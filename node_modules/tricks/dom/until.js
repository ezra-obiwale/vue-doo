const each = require('./each.js');

module.exports = (elements, callback) => {
	let bool;

	each(elements, el => {
		if (!bool) {
			bool = callback(el);
		}
	});

	return bool;
};
