// visible
// This is similar to the Page Visibility API
//  - https://developer.mozilla.org/en-US/docs/Web/Guide/User_experience/Using_the_Page_Visibility_API

const emit = require('./emit.js');
const on = require('./on.js');
const until = require('../dom/until.js');


// Variables
const VISIBILITYCHANGE = 'visibilitychange';
const HIDDEN = 'hidden';

// Shim up the Page Visibility API
let _hidden;
let _visibilitychange;

until([
	[HIDDEN, VISIBILITYCHANGE],
	['msHidden', `ms${ VISIBILITYCHANGE}`],
	['mozHidden', `moz${ VISIBILITYCHANGE}`],
	['webkitHidden', `webkit${ VISIBILITYCHANGE}`]
], item => {
	const [flag, handler] = item;
	if (typeof document[flag] !== 'undefined') {
		_hidden = flag;
		_visibilitychange = handler;
		return true;
	}
});

// Listen to global visibility changes
// Add events which listen out for Window change
// Any of these can infer whether the video is in a visible area
if (_hidden) {
	if (_hidden !== HIDDEN) {
		on(document, _visibilitychange, () => {
			document.hidden = document[_hidden];
			emit(document, VISIBILITYCHANGE);
		});
	}
}
else {

	// listen to events which change the focus of the page
	on(window, 'focus, resize, scroll, mouseenter', () => {

		// Is document hidden?
		if (document.hidden) {

			// Update the hidden
			document.hidden = false;

			// Trigger the change
			emit(document, VISIBILITYCHANGE);
		}
	});

	// listen to events which change the focus of the page
	on(window, 'blur, mouseleave', () => {

		// If document not already hidden
		if (!document.hidden) {

			// Update the hidden
			document.hidden = true;

			// Trigger the change
			emit(document, VISIBILITYCHANGE);
		}
	});
}
