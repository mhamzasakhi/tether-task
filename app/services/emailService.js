const ValidationError = require('../errors/ValidationError');
const ClientError = require('../errors/ClientError');
const { USER_STATUSES } = require('../helpers/constants');
const Op = require('sequelize').Op;
const mail = require('../lib/mail');
const { copyObject } = require('../helpers/objectHelper');

module.exports = {
    sendMeEmail: async (user, models) => {
        const to = user.email;
        let data = {
            user: {
                name: user.name,
                surname: user.surname,
            },
            LinkId: order.paymentLinkId,
        };

        if (user.ccEmails !== null && user.ccEmails !== '') {
            data.cc = user.ccEmails.split(',');
        }
        
        await mail.sendMeEmail(to, data);
        return true;
	},
};