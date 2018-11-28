// removeClass
const each = require('./each.js');

module.exports = (elements, className) => {
	const reg = new RegExp(`(^|\\s)${ className }($|\\s)`, 'ig');
	return each(elements, el => {
		el.className = el.className.replace(reg, ' ');
	});
};
