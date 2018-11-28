const ltrim = require('../../../string/ltrim.js');

describe('string/ltrim', () => {

	it('should remove pattern from left side of a string.', () => {
		const str = 'trimmed';
		const pattern = 'remove';

		expect(ltrim(pattern + str, pattern)).to.eql(str);
	});

});
