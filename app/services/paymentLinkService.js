const Op = require('sequelize').Op;
const moment = require('moment');

module.exports = {
    webhookResponse: async function (payload, models) {
        try {
            console.log(`Webhook response webhookResponse() at ${moment().format('YYYY-MM-DD HH:mm:ss')}`);
        }
        catch (err) {
            console.log(err);
            return err;
        }
    },
}