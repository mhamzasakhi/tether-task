'use strict';
const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../../../config/config.js')[env];
const db = {};
const ValidationError = require('../../errors/ValidationError');

let sequelize;
if (config.use_env_variable) {
	sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
	sequelize = new Sequelize(config.database, config.username, config.password, config);
}
sequelize.addHook('beforeCount', function (options) {
	if (this._scope.include && this._scope.include.length > 0) {
		options.distinct = true;
		options.col = this._scope.col || options.col || `${this.options.name.singular}.id`;
	}

	if (options.include && options.include.length > 0) {
		options.include = null;
	}
});
fs.readdirSync(__dirname)
	.filter((file) => {
		return (
			file.indexOf('.') !== 0 &&
			file !== basename &&
			file.slice(-3) === '.js' &&
			file !== 'index.js'
		);
	})
	.forEach((file) => {
		const model = sequelize['import'](path.join(__dirname, file));
		model.isExist = async (id) => {
			const obj = await model.findByPk(id);
			return !!obj;
		};
		model.validateAssocId = async (...ids) => {
			for (let id of ids) {
				const exist = await model.isExist(id);
				if (!exist) {
					throw new ValidationError('invalid_id', {
						message: `Invalid ${model.name} id`,
					});
				}
			}
			return true;
		};
		db[model.name] = model;
	});

Object.keys(db).forEach((modelName) => {
	if (db[modelName].associate) {
		db[modelName].associate(db);
	}
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;
module.exports = db;
