const moment = require('moment');
const dateFormat = 'YYYY-MM-DD';
const timeFormat = 'HH:mm:ss';
const weekDays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
const _ = require('lodash');

exports.dateFormatUK = (date, format = dateFormat) =>
	date ? moment(date, format).format(format) : null;

exports.formatTime = (time, format = timeFormat) =>
	moment(time, format).isValid() ? moment(time, format).format('HH:mm') : null;

exports.weekDays = weekDays;

exports.getWeekDayByIndex = (dayIndex) => {
	const days = [...weekDays];
	const lastDay = days[days.length - 1];
	days.splice(days.length - 1);
	days.unshift(lastDay);
	return days[dayIndex];
};

exports.isInPast = (date, format = dateFormat) =>
	date ? moment(date, format).isBefore(moment()) : false;

exports.getDurationFormat = (duration, full = false) => {
	let h = Math.floor(duration / 60);
	let m = duration % 60;
	h = h >= 0 ? h : '0';
	m = m < 10 && m >= 0 ? '0' + m : m > 0 ? m : '0';
	return full
		? `${h == '1' ? `${h} Hour` : `${h} Hours`}${m === '00' ? `` : ` : ${m} Minutes`}`
		: `${h}h:${m}m`;
};

exports.datesEqual = (first, second) => {
	return (
		first.getDate() === second.getDate() &&
		first.getMonth() === second.getMonth() &&
		first.getFullYear() === second.getFullYear()
	);
};

exports.getWeekNumberByDay = (day) => {
	if (day <= 7) return 1;
	if (day > 7 && day <= 14) return 2;
	if (day > 14 && day <= 21) return 3;
	if (day > 21) return 4;
	return null;
};

exports.generateDaysOfMonth = (date) => {
	const startOfMonth = moment(date).clone().startOf('month');
	const endOfMonth = startOfMonth.clone().endOf('month');
	const monthDays = [];
	while (startOfMonth.isSameOrBefore(endOfMonth)) {
		monthDays.push(startOfMonth.clone());
		startOfMonth.add(1, 'days');
	}
	//   unshift absent days from the beginning of the calendar
	while (monthDays[0].day() !== 1) {
		const prevDay = moment(monthDays[0]).clone().subtract(1, 'days');
		monthDays.unshift(prevDay);
	}
	// push absent days from the end of the calendar
	while (monthDays[monthDays.length - 1].day() !== 0) {
		const nextDays = moment(monthDays[monthDays.length - 1])
			.clone()
			.add(1, 'days');
		monthDays.push(nextDays);
	}
	return _.chunk(monthDays, 7);
};

exports.detectWeekNumberOfMonth = (date) => {
	const dates = this.generateDaysOfMonth(date);
	for (const [index, week] of dates.entries()) {
		const match = week.find((weekDate) => weekDate.isSame(date));
		if (match) {
			return index + 1;
		}
	}
};

exports.getNumberOfDays = async (date1, date2) => {
    const start = new Date(date1);
    const end = new Date(date2);
    const oneDay = 1000 * 60 * 60 * 24;	 // One day in milliseconds
    const totalDays = Math.round((start.getTime() - end.getTime()) / oneDay); // Calculating the no. of days between two dates
    return totalDays;
};