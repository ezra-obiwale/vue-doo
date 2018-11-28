// Can this convert a string to a Date

module.exports = str => {

	const date = new Date(str);

	// IE8, was this a valid date?
	if (date.toString() === 'NaN') {

		// IE can't process i.e. isNaN(Date.parse('2000-01-01T00:00:00.000Z'))
		// If its a string we can do this
		if (str.replace) {
			const a = str.split(/[:T-]|(\.\d+)/); // Create Array from ISO time stamp 2013-01-13T11:51:05+1000
			if (a.length > 2) {
				const d = new Date();
				d.setYear(a[0]);
				d.setMonth(a[1] - 1);
				d.setDate(a[2]);
				d.setHours(a[3] + parseInt(a[6], 10));
				d.setMinutes(a[4]);
				d.setSeconds(a[5]);
				return d;
			}
		}

		return date;
	}

	return date;
};
