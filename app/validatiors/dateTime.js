const { DATE_FORMAT, TIME_FORMAT } = require('../helpers/constants');
const ValidationError = require('./../errors/ValidationError');
const moment = require('moment');

exports.validateDatesRange = (dateFrom, dateTo, onlyFuture = false) => {
	const today = moment().format(DATE_FORMAT);
	const from = moment(dateFrom, DATE_FORMAT).format(DATE_FORMAT);
	const to = moment(dateTo, DATE_FORMAT).format(DATE_FORMAT);
	if (from > to) {
		throw new ValidationError('invalid_date', {
			message: 'Start Date can’t be later than “date to”',
		});
	} else if (to < from) {
		throw new ValidationError('invalid_date', {
			message: 'End Date can’t be earlier than “date from”',
		});
	}
	if (onlyFuture) {
		if (from < today) {
			throw new ValidationError('invalid_date', {
				message: 'Start Date  can’t be chosen in the past',
			});
		} else if (to < today) {
			throw new ValidationError('invalid_date', {
				message: 'End Date can’t be chosen in the past',
			});
		}
	}
};

exports.validateTimeRange = (timeFrom, timeTo) => {
	if(!moment(timeFrom, TIME_FORMAT).isValid() || !moment(timeTo, TIME_FORMAT).isValid()) {
			throw new ValidationError('invalid_date', 
		{
		  message: `Time must be of the following format ${TIME_FORMAT}`
		}
	  );
	}
	const from = moment(timeFrom, TIME_FORMAT);
	const to = moment(timeTo, TIME_FORMAT);
	if (from.format(TIME_FORMAT) > to.format(TIME_FORMAT)) {
		throw new ValidationError('invalid_time', {
			message: 'Start time can’t be later than End time',
		});
	}
};