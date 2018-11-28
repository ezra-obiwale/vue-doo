// Object-Fit
//  Maps an item to the width and the height of an item using the cover command
// Returns the coordinatates and the new width and height of the item being drawn on the target
module.exports = (item_width, item_height, target_width, target_height) => {

	// Deterine the ratio
	const item_r = item_height / item_width;
	const target_r = target_height / target_width;

	// initial offset points
	let offsetLeft = 0;
	let offsetTop = 0;

	// Window is proportionally taller than image
	if (target_r > item_r) {
		// Get the horiontal middle offset
		offsetLeft = Math.round(((target_height / item_r) - target_width));
	}
	// Window is proportionally narrower than the image
	else if (target_r < item_r) {
		// Get the vertical middle offset
		offsetTop = Math.round(((target_width * item_r) - target_height));
	}

	// Returns the new [x,y,w,h];
	return [-offsetLeft / 2, -offsetTop / 2, target_width + offsetLeft, target_height + offsetTop];
};
