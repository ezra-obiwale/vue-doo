const hiddenFrame = require('../../../dom/hiddenFrame.js');

describe('dom/hiddenFrame', () => {

	let elm = null;

	afterEach(() => {
		// Clean up
		document.body.removeChild(elm);
	});

	it('should create a new hidden iframe element and append it to the document body', () => {
		const src = 'about:blank';
		elm = hiddenFrame(src);
		expect(elm.parentNode).to.eql(document.body);
		expect(elm.tagName).to.equal('IFRAME');
		expect(elm.src).to.equal(src);
	});
});
