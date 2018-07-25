const fs = require('fs');

const logLevels = [
	'EMERGENCY',
	'CRITICAL',
	'ALERT',
	'ERROR',
	'WARNING',
	'NOTICE',
	'INFO',
	'DEBUG'
];

module.exports = {
	log: log,
	LEVEL_EMERGENCY: 0,
	LEVEL_CRITICAL: 1,
	LEVEL_ALERT: 2,
	LEVEL_ERROR: 3,
	LEVEL_WARNING: 4,
	LEVEL_NOTICE: 5,
	LEVEL_INFO: 6,
	LEVEL_DEBUG: 7
};

function log() {
	let args = Array.from(arguments);
	let logLevel = args.pop();
	let message = '';

	for(; args.length > 0;) {
		let arg = args.shift.toString()
		message += arg + (args.length >= 1 ? ' ' : '');
	}
	
	let date = new Date();
	let year = padString(date.getFullYear(), 4, '0');
	let month = padString(date.getMonth() + 1, 2, '0');
	let day = padString(date.getDate(), 2, '0');
	let hour = padString(date.getHours(), 2, '0');
	let minute = padString(date.getMinutes(), 2, '0');
	let second = padString(date.getSeconds(), 2, '0');

	let timestamp = '[' + year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second + ']';

	let warnLabel = padString('[' + logLevels[logLevel] + ']', 11, ' ', false);

	message = timestamp + warnLabel + '  ' + message;

	console.log(message);
}

function padString(string, length, padding = ' ', left = true) {
	string = string.toString();
	let diff = length - string.length;
	if (diff <= 0) return string;

	let pad = padding.repeat(diff);
	if (left) string = pad + string;
	else string += pad;

	return string;
}
