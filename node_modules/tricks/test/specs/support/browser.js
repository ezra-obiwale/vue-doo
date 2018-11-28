const browser = require('../../../support/browser.js');

describe('support/browser', () => {

	it('should return String pertaining to the browser', () => {
		expect(browser).to.be.a('string');
	});

});
