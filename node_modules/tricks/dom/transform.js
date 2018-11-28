// transform
// Assign CSS transform operation
const css = require('./css.js');
const supportsTransform3d = require('../support/transform3d.js');

module.exports = (element, prop, value) => {
	let x = `${prop }(${ value })`;
	if (supportsTransform3d && prop === 'translateX') {
		x = `translate3d(0,0,0) translate(${ value || '0' },0)`;
	}
	const o = {
		transform: x,
		msTransform: x,
		MozTransform: x,
		WebkitTransform: x
	};
	return css(element, o);
};
