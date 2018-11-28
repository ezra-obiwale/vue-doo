// addClass
const each = require('./each.js');
const hasClass = require('./hasClass.js');

module.exports = (elements, className) =>
	each(elements, el => {
		if (!hasClass(el, className)) {
			el.className += ` ${ className}`;
		}
	});
