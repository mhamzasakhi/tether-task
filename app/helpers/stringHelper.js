const { REQUEST_MAX_VALUE, REQUEST_MIN_VALUE } = require('./constants');
exports.toUpperCase = (string = '') => string[0].toUpperCase() + string.slice(1);

exports.toUniqueId = (requestId, prefix = '') => {
	const alphabet = [
		'A',
		'B',
		'C',
		'D',
		'R',
		'F',
		'G',
		'H',
		'I',
		'J',
		'K',
		'L',
		'M',
		'N',
		'O',
		'P',
		'Q',
		'R',
		'S',
		'T',
		'U',
		'V',
		'W',
		'X',
		'Y',
		'Z',
	];

	function pad(num, size) {
		var s = '00000' + num;
		return s.substr(s.length - size);
	}

	if (requestId === REQUEST_MAX_VALUE) {
		let nextPrefix = '';
		for (let i = 0; i < alphabet.length; i++) {
			if (prefix < alphabet[i]) {
				nextPrefix = alphabet[i];
				break;
			}
		}
		return [REQUEST_MIN_VALUE, nextPrefix];
	} else {
		return [pad(parseInt(requestId) + 1, 6), prefix];
	}
};

exports.containsWhitespace = (str) => {
	return /\s/.test(str);
}