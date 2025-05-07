'use strict';
const { USER_STATUSES } = require("../app/helpers/constants");

module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.createTable('users', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.BIGINT,
			},
			name: {
				type: Sequelize.STRING,
			},
			surname: {
				type: Sequelize.STRING,
			},
			email: {
				type: Sequelize.STRING,
				unique: true
			},
			password: {
				type: Sequelize.STRING,
			},
			status: {
				type: Sequelize.ENUM,
				allowNull: true,
				values: [
					USER_STATUSES.ACTIVE,
					USER_STATUSES.DEACTIVATED,
					USER_STATUSES.DELETED,
				],
			},
			userRoleId: {
				type: Sequelize.BIGINT,
				nullable: false,
			},
			lastLogin: {
				type: Sequelize.DATE,
				allowNull: true,
				defaultValue: null,
			},
			lastMobileLogin: {
				type: Sequelize.DATE,
				allowNull: true,
				defaultValue: null,
			},
			resetToken: {
				type: Sequelize.STRING,
				nullable: true,
			},
			totalLogin: {
				type: Sequelize.INTEGER,
				nullable: true,
				defaultValue: 0
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
		return queryInterface.dropTable('users');
	},
};