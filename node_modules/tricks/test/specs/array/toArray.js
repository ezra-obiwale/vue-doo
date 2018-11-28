const toArray = require('../../../array/toArray.js');

describe('array/toArray', () => {

	it('should convert an object into an Array', () => {

		expect(toArray([])).to.be.an('array');
		expect(toArray({})).to.be.an('array');
		expect(toArray(1)).to.be.an('array');

	});

});
