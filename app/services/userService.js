const Op = require('sequelize').Op;
const { USER_STATUSES, BINARY_OPTION, verifyMobile } = require('../helpers/constants');
const { copyObject } = require('../helpers/objectHelper');
const HttpRequest = require('../lib/HttpRequest');

module.exports = {
	createUser: async (userData, models) => {
		const savedUser = await models.user.create(userData);
		await models.userProfile.create({
			phone: userData.phone,
			userId: savedUser.id,
		});
		return { ...savedUser.dataValues };
	},

	getFullProfile: async function (userId, models) {
		let [profile] = await Promise.all([
			models.user.scope(['personal-info']).findOne({ where: { id: userId } }),
		]);
		return {
			personal: profile ? profile.get({ plain: true }) : null,
		};
	},

	createUpdateProfile: async (body, user, files, models) => {
		let userId = user.id;
		const profileData = body;

		const newData = {
			"name": body.name,
			"surname": body.surname,
			"userRoleId": body.userRoleId,
			"status": body.status
		};

		let userProfile = {
			"city": profileData.city,
			"state": profileData.state,
			"countryId": profileData.countryId,
			"zipCode": profileData.zipCode,
			"phone": profileData.phone,
			"dob": profileData.dob,
			"gender": profileData.gender,
			"image": profileData.image,
			"address1": profileData.address1,
			"address2": profileData.address2,
			"latitude": profileData.latitude,
			"longitude": profileData.longitude
		}
		
		const profile = await models.userProfile.findOne({ where: { userId } });
		if (!profile) {
			userProfile.userId = userId;
			await models.userProfile.create(userProfile);
		} else {
			await profile.update(userProfile);
		}

		await models.user.update(newData, { where: { id: userId } });
		if (files && files.image) {
			await models.userProfile.updateImage(userId, files.image);
		}
		return userId;
	},

	// date = { id: 123, link: "link", clinic: "clinic-name" };
	sendSMS: async function (data, models) {
		const userId = data.id;
		const userProfile = await models.userProfile.findOne({
            attributes: ['phone'],
            where: { userId },
        });

        let phone = userProfile.phone;
        if (phone && phone.length > 9) {
			phone = await verifyMobile(phone);
			const httpRequest = new HttpRequest();
			const authorization = `${process.env.SMS_JWT_TOKEN}`;
			const mask = `${process.env.SMS_MASK}`;
			const url = `${process.env.SEND_SMS_URL}`;
			const paymentLink = `${process.env.FRONTEND_URL+'/checkout/'+data.link}`;

			const requestData = {
				sender: mask,
				destination: phone,
				content: `We've received your order from ${data.clinic}. ${paymentLink}`
			}
			console.log(`sms sent: ${JSON.stringify(requestData)}`);
			// const result = await httpRequest.post(url, requestData, authorization);
			return true;
		}
		return false;
	},
};