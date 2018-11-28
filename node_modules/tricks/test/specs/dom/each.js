const each = require('../../../dom/each.js');

describe('dom/each', () => {
	it('should return an array given an array', () => {
		expect(each([])).to.be.an('array');
	});

	it('should match elements in the dom', () => {
		expect(each('#mocha')).to.have.property(0);
	});

	it('should return an instance of an array', () => {
		expect(each('div')).to.be.an('array');
	});
});
