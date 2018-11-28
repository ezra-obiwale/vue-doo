//
// Age
// Converts a date to an age
const toDate = require('./toDate.js');

// Number of seconds in...
const HOUR = 3600;
const DAY = 3600 * 24;
const WEEK = 3600 * 24 * 7;
const MONTH = 3600 * 24 * 28;
const YEAR = 3600 * 24 * 365;

// format age function
// Creates a readable time when something was released
module.exports = (date_str, now) => {

	// Cannot be a small
	if (!date_str || date_str < YEAR) {
		return '';
	}

	const d = dateToMS(date_str);

	// Convert point in time to a date.
	now = dateToMS(now || (new Date()));

	if (!d || !now) {
		return '';
	}

	const dx = now - d;
	let i = 0; // T
	let u = '';

	// less than five minutes
	if (dx < (5 * 60)) {
		return 'new';
	}
	// Less than 1hour, e.g. 11 minutes
	else if (dx < HOUR) {
		i = parseInt((dx / HOUR) * 60, 10);
		u = 'minute';
	}
	// Less than 24hours
	else if (dx < DAY) {
		i = parseInt((dx / DAY) * 24, 10);
		u = 'hour';
	}
	// Less than 7 days
	else if (dx < WEEK) {
		i = parseInt((dx / WEEK) * 7, 10);
		u = 'day';
	}
	// Less than a month
	else if (dx < MONTH) {
		i = parseInt((dx / MONTH) * 4, 10);
		u = 'week';
	}
	// Less than a year
	else if (dx < YEAR) {
		i = parseInt((dx / YEAR) * 12, 10);
		u = 'month';
	}
	// Over a year
	else {
		i = parseInt((dx / YEAR), 10);
		u = 'year';
	}

	// Minimum value of i is 1, however it could be 0 in the following case.
	// Because Month~=28 days, YEAR/MONTH=13.0357.
	// This means multiplying by 12 in parseInt((dx/YEAR)*12,10) could return a value less than 0.
	i = i || 1;

	return `${i } ${ u }${i > 1 ? 's' : '' } ago`;
};

function dateToMS(date) {

	return toDate(date).getTime() / 1e3;

}
