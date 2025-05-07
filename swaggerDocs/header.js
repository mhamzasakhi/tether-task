module.exports = {
	openapi: '3.0.1',
	info: {
		title: 'Application APIs',
		version: '0.1.0',
		description: 'This is a server for Lopic app ADMIN APIs',
		contact: { email: 'mhamzasakhi@gmail.com' },
	},
	servers: [
		{ url: 'http://localhost:3000/api' },
	],
	basePath: '/api', // the basepath of your endpoint
	components: {
		securitySchemes: {
			api_key: {
				type: 'apiKey',
				name: 'authorization',
				in: 'header',
			},
		},
	},
	externalDocs: {
		description: 'Main App Api Docs',
		url: '/api-docs',
	},
};
