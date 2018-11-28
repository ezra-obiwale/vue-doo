// css - apply properties to an element
const each = require('./each.js');

module.exports = (elements, props) =>
	each(elements, el => {
		for (const key in props) {
			el.style[key] = props[key];
		}
	})
;
