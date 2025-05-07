'use strict';
const { ROLE_TYPES } = require("../app/helpers/constants");
const { SUPER_ADMIN_ROLE, ADMIN_ROLE, END_USER } = require("../config/roles");

module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable('userRoles', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.BIGINT,
			},
			label: {
				type: Sequelize.STRING,
				allowNull: false,
			},
			role: {
				type: Sequelize.STRING,
				allowNull: true,
			},
			roleType: {
				type: Sequelize.ENUM,
				allowNull: false,
				values: [
					ROLE_TYPES.DEFAULT,
					ROLE_TYPES.CUSTOM
				],
			},
			group: {
				type: Sequelize.STRING,
				allowNull: false,
			},
			createdBy: {
				type: Sequelize.BIGINT,
				allowNull: false,
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
		await queryInterface.bulkInsert('userRoles', [
			{
				label: 'Super Admin',
				role: SUPER_ADMIN_ROLE,
				roleType: ROLE_TYPES.DEFAULT,
				group: SUPER_ADMIN_ROLE,
				createdBy: 1,
				createdAt: new Date(),
				updatedAt: new Date(),
			},
			{
				label: 'Admin / Sub-Admin',
				role: ADMIN_ROLE,
				roleType: ROLE_TYPES.DEFAULT,
				group: ADMIN_ROLE,
				createdBy: 1,
				createdAt: new Date(),
				updatedAt: new Date(),
			},
			{
				label: 'End User',
				role: END_USER,
				roleType: ROLE_TYPES.DEFAULT,
				group: END_USER,
				createdBy: 1,
				createdAt: new Date(),
				updatedAt: new Date(),
			},
		]);
	},
	async down(queryInterface, Sequelize) {
		return queryInterface.dropTable('userRoles');
	},
};
