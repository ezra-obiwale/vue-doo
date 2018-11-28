const matches = require('../../../dom/matches.js');

describe('dom/matches', () => {

	const el = document.createElement('div');
	el.className = 'test';

	it('should return true if an element matches a given selector', () => {

		expect(matches(el, 'div.test')).to.be.ok();
		expect(matches(el, 'div.tests')).to.not.be.ok();
	});

});
