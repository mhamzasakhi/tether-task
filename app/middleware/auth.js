const UnauthorizedError = require('../errors/UnauthorizedError');
const { USER_STATUSES } = require('../helpers/constants');
const session = require('../middleware/session');

module.exports = function (app) {
	app.use(async function (req, res, next) {
		let header_token = req.headers.authorization;
		if (!header_token) {
			return next();
		}
		let models = req.app.locals.models;
		try {
			let sessionData = await session.extractSessionFromToken(header_token, models);
			let user = await models.user.scope('apiUser').findOne({
				where: {
					id: sessionData.user.id,
				},
				plain: true,
			});

			if (user.status === USER_STATUSES.DELETED) {
				session.destroy(req.headers.authorization, req.app.locals.models);
				return next(
					new UnauthorizedError('user_deleted', {
						message: 'Your account is deleted, please, contact support',
					})
				);
			}
			req.user = user.get({ plain: true });
		} catch (err) {
			next(new UnauthorizedError(err.message));
		}
		next();
	});
};
