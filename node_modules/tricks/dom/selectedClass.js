// Select Class
const each = require('./each.js');
const addClass = require('./addClass.js');
const removeClass = require('./removeClass.js');

module.exports = (elements, className = 'selected') =>
	each(elements, el => {
		removeClass(el.parentNode.children, className);
		addClass(el, className);
	})
;
