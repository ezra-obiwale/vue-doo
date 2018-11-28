const diffKey = require('../../../object/diffKey.js');

describe('object/diffKey', () => {

	it('should return a new object with the properties of `a` which aren\'t defined in `b`', () => {

		const value = diffKey({a: 1, b: 2}, {a: 1, c: 3});
		expect(value).to.eql({b: 2});

	});

});
