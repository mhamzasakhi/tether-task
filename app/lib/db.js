const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const path = require('path');
const appRoot = require('app-root-path');
const config = require(appRoot.path + '/config/config.js')[env];
const fs = require('fs');
const basename = path.basename(__filename);
const ValidationError = require(appRoot.path + '/app/errors/ValidationError');

const sequelize = config.use_env_variable
	? new Sequelize(process.env[config.use_env_variable], config)
	: new Sequelize(config.database, config.username, config.password, config);

sequelize.addHook('beforeCount', function (options) {
	if (this._scope.include && this._scope.include.length > 0) {
		options.distinct = true;
		options.col = this._scope.col || options.col || `${this.options.name.singular}.id`;
	}

	if (options.include && options.include.length > 0) {
		options.include = null;
	}
});

const modelsPath = require('path').resolve('./app/data/models');
const models = {};
fs.readdirSync(modelsPath)
	.filter((file) => {
		return (
			file.indexOf('.') !== 0 &&
			file !== basename &&
			file.slice(-3) === '.js' &&
			file !== 'module.js'
		);
	})
	.forEach((file) => {
		const model = require(path.join(modelsPath, file))(sequelize, Sequelize.DataTypes);
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
		models[model.name] = model;
	});

Object.keys(models).forEach(function (modelName) {
	if ('associate' in models[modelName]) {
		models[modelName].associate(models);
	}
});

module.exports = {
	sequelize,
	models,
};
