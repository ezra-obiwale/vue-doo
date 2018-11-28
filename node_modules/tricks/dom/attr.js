const each = require('./each.js');

module.exports = (elements, props) =>
	each(elements, element => {
		for (const x in props) {
			const prop = props[x];
			if (typeof prop === 'function') {
				element[x] = prop;
			}
			else {
				element.setAttribute(x, prop);
			}
		}
	});
