'use strict';
module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface
			.createTable('countries', {
				id: {
					allowNull: false,
					autoIncrement: true,
					primaryKey: true,
					type: Sequelize.INTEGER,
				},
				iso:{
					type: Sequelize.STRING(2),
				},
				name: {
					type: Sequelize.STRING,
				},
				nicename: {
					type: Sequelize.STRING,
				},
				iso3:{
					type: Sequelize.STRING(3),
				},
				numcode:{
					type: Sequelize.INTEGER,
				},
				phonecode:{
					type: Sequelize.INTEGER,
				},
				status: {
					type: Sequelize.BOOLEAN,
					defaultValue: 1,
				},
				createdAt: {
					allowNull: false,
					type: Sequelize.DATE,
				},
				updatedAt: {
					allowNull: false,
					type: Sequelize.DATE,
				},
			});
	},
	down: (queryInterface, Sequelize) => {
		return queryInterface.dropTable('countries');
	},
};