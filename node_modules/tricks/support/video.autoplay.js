const CSSsupport = require('./CSSsupports.js');
let bool = false;

// Test to see if the HTML5 player supports AUTOPLAY
const v = document.createElement('video');
try {
	// IE doesn't like this
	v.src = 'data:video/mpeg;base64,';
	if (v.play) {
		v.play();
		bool = !v.paused;
	}
}
catch (e) {
	// Continue
}

CSSsupport('video-autoplay', bool);

module.exports = bool;
