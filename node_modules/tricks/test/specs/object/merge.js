const merge = require('../../../object/merge.js');

describe('object/merge', () => {

	it('should merge arguments into one new object', () => {

		const a = {
			key: 'valueA'
		};

		const b = {
			key: 'valueB'
		};

		const value = merge(a, b);

		// Check: a is like b
		expect(value).to.eql(b);

		// But a is not b
		expect(value).to.not.equal(b);

	});

});
