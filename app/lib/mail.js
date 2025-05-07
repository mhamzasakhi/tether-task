const ServerError = require('../errors/ServerError');
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.MAILER_API_KEY);
const fs = require('fs').promises;
const { mailDir } = require('../helpers/pathHelper');

const templates = {
	resetPassword: {
		file: 'forgotten-password.html',
		subject: 'Signature-RX Password Reset',
		templateId: 'd-10154faec0004de1b8263231337c5b44',
	},
	email: { // dummy 
		file: 'send-your-email.html',
		subject: 'Send Your Email!',
		templateId: 'd-10154werefaec0004de1b8263231337c5b44',
	},
};

module.exports = {
	templates,
	send: async function (template, to, data = {}) {
		if (!Array.isArray(to)) {
			to = [{ email: to }];
		} else {
			to = to.map((el) => {
				return { email: el };
			});
		}
		/*if (!data.imgHost) {
			data.imgHost = process.env.API_URL + '/static/';
		}*/
		let ccEmail = [];
		if (data.cc) {
			if (!Array.isArray(data.cc)) {
				ccEmail = [{ email: data.cc }];
			} else {
				ccEmail = data.cc.map((el) => {
					return { email: el };
				});
			}
			delete data.cc;
		}

		try {
			const sendData = {
				to: to,
				subject: template.subject,
				from: {
					name: 'Signature Pharmacy',
					email: 'reece@lopic.io',
				},
			};

			if (ccEmail.length > 0) {
				sendData['cc'] = ccEmail;
			}

			if (template.templateId) {
				sendData.templateId = template.templateId;
				sendData.dynamic_template_data = {
					params: data,
					subject: template.subject,
				};
			} else {
				const templateHtml = await fs.readFile(mailDir + '/' + template.file, 'utf8');
				sendData.html = templateHtml;
			}
			await sgMail.send(sendData);
		} catch (error) {
			console.error(error);
			throw new ServerError(error);
		}
	},
	
	requestResetPassword: async function (to, data) {
		return this.send(templates.resetPassword, to, data);
	},

	sendMeEmail: async function (to, data) { // dummy
		/*
		data: { let's data look like this
			"user": { "name": "Muhammad", "surname": "Hamza" },
			"linkId": "d242d7fvfacwerr45rdf34645dfwjf76f8",
			"clinicName": "Sakhi"
		}
		*/
		data.link = process.env.FRONTEND_URL + '/checkout/' + data.linkId;
		return this.send(templates.email, to, data);
	},
};
