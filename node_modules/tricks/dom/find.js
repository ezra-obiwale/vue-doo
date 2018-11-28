const until = require('./until.js');
const matches = require('./matches.js');

module.exports = (elements, match) =>
	until(elements, el => {
		if (matches(el, match)) {
			return el;
		}
	})
;
