const delegate = require('../events/delegate');
const cordova = require('../support/cordova');

module.exports = (root = document) => {
	if (!cordova) {
		return false;
	}
	else {
		// Enable event delegation to fix anchor elements
		delegate('a', 'click', e => {

			const target = e.delegateTarget;

			// Check this is a valid external URL...
			if (target.href && target.href.match(/^https?:\/\//)) {
				e.preventDefault();
				window.open(target.href, '_system');
			}
		}, root);
	}
};
