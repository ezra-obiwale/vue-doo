// Find parents of an element which match a pattern

const each = require('./each.js');
const matches = require('./matches.js');
const documentElement = require('./documentElement.js');

module.exports = (elements, match) => {
	const m = [];
	each(elements, el => {
		while (el && el.parentNode) {
			el = el.parentNode;

			if (el === document) {
				el = documentElement;
			}

			if (matches(el, match)) {
				m.push(el);
			}

			if (el === documentElement) {
				break;
			}
		}
	});
	return m;
};
