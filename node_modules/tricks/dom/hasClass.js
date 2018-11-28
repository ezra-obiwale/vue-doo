const until = require('./until.js');

module.exports = (elements, className) => {
	const reg = new RegExp(`(^|\\s)${ className }($|\\s)`, 'i');
	return until(elements, el => (el.className || '').match(reg));
};
