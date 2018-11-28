// data-src
// Loads images on demand
// By adding data-src to images and binding dataSrc to a ancestor
// The data-src attribute is read and defines a path to the image
// load an image once the image fits a visible area. or if the image exists

const each = require('../dom/each.js');
const css = require('../dom/css.js');
const on = require('../events/on.js');
const toArray = require('../array/toArray.js');


const images = [];
module.exports = elements =>

	// Find all the elements in the page with data-src className
	// Bind listeners to the page to determine whether this content is changing.

	each(elements, el => {

		// Listen to the scroll event on this item
		on(el, 'scroll', () => check(el));

		// Check
		check(el);
	})
;


function check(el) {

	// Retrieve the relative position of this item to the page
	const h = el.offsetHeight;
	const t = el.scrollTop;

	// [data-src]
	toArray(el.querySelectorAll('img[data-src]'))
	// Is it shown?
		.filter(img => {
		// Where is this positioned?
			const _t = img.offsetTop;
			const _h = img.offsetHeight;

			// does it fix in the bounding box?
			return ((_t + _h) >= t && _t <= (t + h));
		})
	// Process the element
		.forEach(img => {

		// SRC
			img.src = img.getAttribute('data-src');
			img.removeAttribute('data-src');

			// Error fallback
			const errorSrc = img.getAttribute('data-src-error');

			if (errorSrc) {
				img.onerror = () => {
					img.src = errorSrc;
				};
			}

			// Have we already loaded this image into the browser?
			if (images.indexOf(img.src) > -1) {
				show(img);
			}
			else {
				img.onload = () => {
					show(img);
					images.push(img.src);
				};
			}
		});
}

function show(el) {
	css(el, {opacity: 1});
}
