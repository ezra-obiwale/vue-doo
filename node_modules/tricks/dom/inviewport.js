// inviewport
// Determine what proportion of an element is in view
const documentElement = require('./documentElement.js');

// Is the element contained in the current view
module.exports = (elm, bounding) => {

	if (!elm.getBoundingClientRect) {
		return;
	}

	// find the position of the icon relative
	// Is if fully shown in the page
	const pos = elm.getBoundingClientRect();

	const x = pos.left;
	const y = pos.top;
	const w = pos.width || elm.offsetWidth || 1; // must have a minium dimension
	const h = pos.height || elm.offsetHeight || 1; // must have a minium dimension

	// Default viewport
	let X = 0;
	let Y = 0;
	let W = window.innerWidth || documentElement.offsetWidth;
	let H = window.innerHeight || documentElement.offsetHeight;

	if (bounding) {
		// Get the bounding element
		X = bounding.left;
		Y = bounding.top;
		W = bounding.width;
		H = bounding.height;
	}

	// Return whether the whole element is showing
	// return !( x + w > X + W || x < X || y + h > Y + H || y < Y ) && 100;

	// Return the percentage of the video element that is showing
	let dx = (Math.min(x - X, 0) + Math.min((X + W) - (x + w), 0) + w) / w;
	if (dx < 0) {
		dx = 0;
	}
	else if (dx > 1) {
		dx = 1;
	}

	let dy = (Math.min(y - Y, 0) + Math.min((Y + H) - (y + h), 0) + h) / h;
	if (dy < 0) {
		dy = 0;
	}
	else if (dy > 1) {
		dy = 1;
	}

	// return a proportion of visible area
	return (dx * dy);
};
