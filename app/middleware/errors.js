const ServerError = require('../errors/ServerError');
module.exports = function (app) {
	app.use(function (err, req, res, next) {
		let status = err.status || err.status_code || 500;
		let message = err.message;
		console.error(err.stack, 123);
		if (process.env.NODE_ENV !== 'development' && status === 500) {
			err = new ServerError('server_error', {
				message: 'Something unexpected happened',
			});
		} else if (process.env.NODE_ENV === 'development' && status === 500) {
			err = new ServerError('server_error', { stack: err.stack, message: err.message });
		}

		res.status(status).json(err).end();
	});
};
