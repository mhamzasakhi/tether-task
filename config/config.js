require('dotenv').config();

module.exports = {
	production: {
		hostname: process.env.DB_HOSTNAME,
	},
	development: {
		username: process.env.DB_USER,
		password: process.env.DB_PASSWORD,
		database: process.env.DB_NAME,
		host: process.env.DB_HOST,
		port: process.env.DB_PORT,
		dialect: 'mysql',
		logging: false
		//logging: process.env.NODE_ENV === 'development' ? console.log : false,
		//timezone: '+2:00'
	},
};
