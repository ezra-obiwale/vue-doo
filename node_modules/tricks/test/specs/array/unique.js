const unique = require('../../../array/unique.js');

describe('array/unique', () => {

	it('should return only unique values from an array', () => {

		const value = unique([1, 3, 1, 2, 3]);
		expect(value).to.eql([1, 3, 2]);

	});

});
