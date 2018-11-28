const each = require('./each.js');
const addClass = require('./addClass.js');
const removeClass = require('./removeClass.js');
const hasClass = require('./hasClass.js');

module.exports = (elements, className, condition) => {

	if (typeof(condition) !== 'function') {
		condition = el => !hasClass(el, className);
	}

	return each(elements, el => {
		if (condition(el)) {
			addClass(el, className);
		}
		else {
			removeClass(el, className);
		}
	});
};
