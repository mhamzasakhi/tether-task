const Joi = require('@hapi/joi');
const ValidationError = require('../errors/ValidationError');

module.exports = {
	Login: async function (object) {
		const schema = Joi.object().keys({
			email: Joi.string().email({ minDomainSegments: 2 }).required(),
			password: Joi.string().min(6).required()
			.error((errors) => {
				return {
					message: 'Please Enter Correct Credentials!',
				};
			}),
			deviceToken: Joi.string().allow(null).allow(''),
			isMobile: Joi.boolean().allow(null).allow(''),
		});
		let validation = Joi.validate(object, schema);
		if (validation.error !== null) {
			throw new ValidationError('validation_error', { message: validation.error.details[0] });
		}
	},
	
	SignUp: async function (object) {
		const schema = Joi.object().keys({
			email: Joi.string().email({ minDomainSegments: 2 }).required(),
			password: Joi.string().min(6).required()
			.error((errors) => {
				return {
					message: 'Password must be at least 6 Characters.',
				};
			}),
			name: object.roleId === 2 ? Joi.string().min(2)
			.error((errors) => {
				return {
					message: 'Contact Person Name must be at least 2 Characters.',
				};
			}) : Joi.string().min(1)
			.error((errors) => {
				return {
					message: 'First Name must be at least 1 Character.',
				};
			}),
			surname: Joi.string().min(1)
			.error((errors) => {
				return {
					message: 'Last Name must be at least 1 Character.',
				};
			}),
			address1: Joi.string().allow(null).allow(''),
			address2: Joi.string().allow(null).allow(''),
			roleId: Joi.number().valid([1]).required(),
			address: Joi.string().min(3),
			deviceToken: Joi.string(),
		});
		let validation = Joi.validate(object, schema);
		if (validation.error !== null) {
			throw new ValidationError('validation_error', { message: validation.error.details[0] });
		}
	},
};