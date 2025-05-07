'use strict';
module.exports = {
	async up(queryInterface, Sequelize) {
		// await queryInterface.dropTable('users');
		return true;
	},
	async down(queryInterface, Sequelize) {},
};