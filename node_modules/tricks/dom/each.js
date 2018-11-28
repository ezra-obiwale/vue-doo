const isDom = require('./isDom.js');
const instanceOf = require('../object/instanceOf.js');
const toArray = require('../array/toArray.js');

module.exports = (matches, callback = () => {}) => {

	if (isDom(matches)) {
		matches = [matches];
	}
	else if (typeof(matches) === 'string') {
		matches = document.querySelectorAll(matches);
	}

	if (!instanceOf(matches, Array)) {
		matches = toArray(matches);
	}

	if (callback) {
		matches.forEach(callback);
	}

	return matches;
};
