const on = require('./on.js');
const off = require('./off.js');
const matches = require('../dom/matches.js');

module.exports = (match, eventName, handler, root = document) => {

	const eventHandler = e => {
		let target = e.target;
		while (target) {
			if (matches(target, match)) {
				e.delegateTarget = target;
				handler(e);
				break;
			}
			else {
				// Next: match parentNode?
				target = target.parentNode;
			}
		}
	};

	on(root, eventName, eventHandler);

	return {
		remove: () => off(root, eventName, eventHandler)
	};
};
