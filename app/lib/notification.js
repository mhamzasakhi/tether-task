const admin = require('firebase-admin');
const Op = require('sequelize').Op;
const ServerError = require('../errors/ServerError');
const appRoot = require('app-root-path');
const moment = require('moment');
const serviceAccount = require(`${appRoot.path}/${firebaseAdminsdk.json}`);
admin.initializeApp({
	credential: admin.credential.cert(serviceAccount),
	databaseURL: "https://projectName.firebaseio.com"
});

const types = {
	inviteUser: {
		title: 'You have a new job invitation',
		source: 'job',
		notificationType: 'invitation'
	}
};

module.exports = {
	send: async function (userId, payload, models) {
		try {
			// const notification = add notification into the database using any service and return the notification...
			// get user tokens here
			let tokensP = models.apiSession.getDeviceTokens(userId);
			let [token] = await Promise.all([tokensP]);
			if (!Array.isArray(token)) {
				token = [token];
			}
			if (token.length === 0) {
				return true;
			}
			if (!admin) {
				console.log('Something wrong with Firebase connection!');
			}
			payload['data']['notificationId'] = notification.id.toString();
			return admin.messaging().sendToDevice(token, payload, {});
		} catch (error) {
			throw new ServerError(error);
		}
	},

	inviteUser: async function (userId, data, models) {
		const payload = {
			notification: {
				title: types.inviteUser.title,
				body: `You’ve been invited on ${data.name}.`,
				image: data.logo
			},
			data: {
				source: types.inviteUser.source,
				notificationType: types.inviteUser.notificationType,
			}
		};
		return this.send(userId, payload, models);
	},
};
