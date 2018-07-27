const fs = require('fs');

const colors = {
	error: '\x1b[31m',
	success: '\x1b[32m',
	warning: '\x1b[33m',
	debug: '\x1b[33m',
	reset: '\x1b[0m'
}

const logLevels = [
	'Error',
	'Success',
	'Warning',
	'Debug',
	'Info'
];

exports.log = log;

for(let i = 0; i < logLevels.length; i++) {
	module.exports[logLevels[i].toLowerCase()] = (...args) => {
		args.push(i);
		return log(...args);
	}
}

function log(...args) {
	let logLevel = args.pop();
	let message = '';
	while(args.length > 0) {
		let arg = args.shift();
		let strArg
		if (arg === null) strArg = 'null';
		else if (arg === undefined) strArg = 'undefined';
		else strArg = arg.toString();
		message += strArg + (args.length >= 1 ? ' ' : '');
	}

	let date = new Date();
	let year = padString(date.getFullYear(), 4, '0');
	let month = padString(date.getMonth() + 1, 2, '0');
	let day = padString(date.getDate(), 2, '0');
	let hour = padString(date.getHours(), 2, '0');
	let minute = padString(date.getMinutes(), 2, '0');
	let second = padString(date.getSeconds(), 2, '0');
	let ms = padString(date.getMilliseconds().toString().substring(0, 3), 3, '0', false);

	let timestamp = '[' + year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second + '.' + ms + ']';

	let levelLabel = padString(' ' + logLevels[logLevel], 11, ' ', false);
	if (colors[logLevels[logLevel].toLowerCase()]) levelLabel = colors[logLevels[logLevel].toLowerCase()] + levelLabel + colors.reset;

	message = timestamp + levelLabel + ' | ' + message;

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
