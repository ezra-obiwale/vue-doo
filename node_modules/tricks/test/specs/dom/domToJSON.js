const domToJSON = require('../../../dom/domToJSON.js');

// Are errors thrown if an invalid network is provided?
describe('dom/domToJSON', () => {

	let test;

	beforeEach(() => {
		test = document.createElement('div');
		document.body.appendChild(test);
	});

	afterEach(() => {
		test.parentNode.removeChild(test);
	});

	it('should extrapolate the data in a form', () => {

		// Create a form
		test.innerHTML = `<form id="form">${
			[
				'<input name="key" value="value"/>',
				'<input name="key2" value="value2"/>',
				'<input name="file" type="file"/>'
			].join() }</form>`;

		const json = domToJSON(document.getElementById('form'));

		if (json) {
			// This has been altered to a JSON object
			expect(json).to.be.a('object');
			expect(json.key).to.be('value');
			expect(json.key2).to.be('value2');
			expect(json.file).to.be.a('object');
		}
		else {
			// The data object can't be altered
			expect(json.tagName.toUpperCase()).to.be('FORM');
		}
	});
});
