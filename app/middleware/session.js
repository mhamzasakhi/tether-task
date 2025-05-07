const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/UnauthorizedError');
const Op = require('sequelize').Op;

function extractSessionFromToken(token, models) {
	return new Promise(function (resolve, reject) {
		try {
			resolve(jwt.verify(token, process.env.JWT_SECRET));
		} catch (ex) {
			reject(new UnauthorizedError('invalid_token', { message: 'Invalid token' }));
		}
	})
		.then(function (payload) {
			return models.apiSession.findOne({
				where: {
					id: payload.sessionId,
				},
				include: [
					{
						attributes: ['id'],
						model: models.user,
						required: true,
					},
				],
			});
		})
		.then(function (session) {
			if (!session) {
				throw new UnauthorizedError('invalid_session', { message: 'Invalid session' });
			}
			return session;
		})
		.catch(function (err) {
			throw err;
		});
}

function buildTokenUser(user) {
	Object.assign(user, {
		role: user.role,
	});
	return user.get({ plain: true });
}

async function cleanTokenDuplication(deviceToken, sessionId, models) {
	return models.apiSession.update(
		{ deviceToken: null },
		{
			where: {
				deviceToken,
				id: {
					[Op.ne]: sessionId,
				},
			},
		}
	);
}

module.exports = {
	buildTokenUser,
	extractSessionFromToken,
	create: async function (user, models, deviceToken = null) {
		let [userLogged, session] = await Promise.all([
			buildTokenUser(user),
			models.apiSession.create({ userId: user.get('id'), deviceToken }),
		]);

		if (deviceToken) await cleanTokenDuplication(deviceToken, session.id, models);

		userLogged.sessionId = session.id;
		return {
			...userLogged,
			success: true,
			access: jwt.sign(userLogged, process.env.JWT_SECRET, {
				expiresIn: parseInt(process.env.JWT_TTL, 10),
			}),
			refresh: jwt.sign({ sessionId: session.id }, process.env.JWT_SECRET, {
				expiresIn: '1y',
			}),
		};
	},
	destroy: function (token, models) {
		return extractSessionFromToken(token, models)
			.then(function (session) {
				return session.destroy();
			})
			.catch(function (err) {
				throw err;
			});
	},
	refresh: function (token, models) {
		return extractSessionFromToken(token, models)
			.then(function (session) {
				return buildTokenUser(session.user);
			})
			.then(function (user) {
				return {
					success: true,
					userId: user.id,
					access: jwt.sign(user, process.env.JWT_SECRET, {
						expiresIn: parseInt(process.env.JWT_TTL, 10),
					}),
				};
			})
			.catch(function (err) {
				throw err;
			});
	},
};
