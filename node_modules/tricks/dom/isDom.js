const instanceOf = require('../object/instanceOf.js');

const _HTMLElement = (typeof HTMLElement !== 'undefined' && HTMLElement) || (typeof Element !== 'undefined' && Element);
const _HTMLDocument = (typeof HTMLDocument !== 'undefined' && HTMLDocument) || (typeof Document !== 'undefined' && Document);
const _Window = window.constructor;

module.exports = test =>
	instanceOf(test, _HTMLElement) ||
		instanceOf(test, _HTMLDocument) ||
		instanceOf(test, _Window)
;
