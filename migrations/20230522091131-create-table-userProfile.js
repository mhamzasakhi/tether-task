'use strict';
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable('userProfile', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.BIGINT,
			},
			userId: {
				type: Sequelize.BIGINT,
			},
			dob: {
				type: Sequelize.DATE,
				allowNull: true,
			},
			gender: {
				type: Sequelize.STRING,
				allowNull: true,
			},
			phone: {
				type: Sequelize.STRING,
				allowNull: true,
			},
			address1: {
				type: Sequelize.STRING,
				allowNull: true,
			},
			address2: {
				type: Sequelize.STRING,
				allowNull: true,
			},
			zipCode: {
				type: Sequelize.STRING,
				allowNull: true,
			},
			city: {
				type: Sequelize.STRING,
				allowNull: true,
			},
			state: {
				type: Sequelize.STRING,
				allowNull: true,
			},
			countryId: {
				type: Sequelize.INTEGER,
				defaultValue: 6,
				allowNull: true,
			},
			longitude: {
				type: Sequelize.DECIMAL,
				allowNull: true,
			},
			latitude: {
				type: Sequelize.DECIMAL,
				allowNull: true,
			},
			image: {
				type: Sequelize.STRING,
				nullable: true,
			},
			about: {
				type: Sequelize.STRING,
				allowNull: true,
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
		return queryInterface.dropTable('userProfile');
	},
};