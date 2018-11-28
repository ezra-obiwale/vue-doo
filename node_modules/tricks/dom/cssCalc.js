// cssCalc
const each = require('./each.js');

module.exports = elements => {
	const elm = each(elements)[0];
	return window.getComputedStyle(elm);
};
