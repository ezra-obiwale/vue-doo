const emit = require('../../../events/emit.js');

describe('events/emit', () => {

	// Create an element
	let el;
	beforeEach(() => {
		el = document.createElement('a');
		document.body.appendChild(el);
	});
	afterEach(() => {
		// Clean up
		document.body.removeChild(el);
	});

	it('should trigger an event on an element', done => {

		// Define the click handler
		el.onclick = () => {
			done();
		};

		emit(el, 'click');
	});

	it('should trigger an event on an array of elements', done => {

		// Define the click handler
		el.addEventListener('click', () => {
			done();
		});

		emit([el], 'click');
	});

});
