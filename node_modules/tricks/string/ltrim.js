// Return trimmed string
module.exports = (str, trim) => {
	if (!trim) {
		return str;
	}
	if (str.indexOf(trim) === 0) {
		return str.slice(trim.length);
	}
	return str;
};
