// visible
// Apply a visibilitychange event, and hidden property to elements
const emit = require('./emit.js');
const on = require('./on.js');
const inViewport = require('../dom/inviewport.js');
require('./pageVisibility.js');

// These are the elements which are being managed
const elements = [];

// Listen to the page visibility
on(document, 'visibilitychange', scan);

// Window resize, scroll
on(window, 'scroll resize', scan);

// Function scan
function scan() {
	// Trigger hidden on these elements
	elements.forEach(scanElement);
}

function scanElement(el) {
	const _visible = el.parentNode && !document.hidden && inViewport(el);
	if (el.visible !== _visible) {
		el.visible = _visible;
		emit(el, 'visibilitychange');
	}
}

module.exports = el => {
	// Add element to list of elements to monitor
	elements.push(el);

	// Update
	scanElement(el);
};
