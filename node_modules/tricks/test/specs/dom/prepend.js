const prepend = require('../../../dom/prepend.js');

describe('dom/prepend', () => {

	it('should create a new element and prepend it to the document body', () => {

		const elm = prepend('div', {id: 'test-append'});
		expect(elm.parentNode).to.eql(document.body);
		expect(elm).to.eql(document.body.firstChild);

		// Clean up
		document.body.removeChild(elm);
	});

});
