'use strict';
module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.addColumn('userProfile', 'ryftCustomerId', {
			type: Sequelize.STRING,
			defaultValue: null,
		});
	},

	down: (queryInterface, Sequelize) => {
		return queryInterface.removeColumn('userProfile', 'ryftCustomerId');
	},
};