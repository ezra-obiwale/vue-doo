const instanceOf = require('../../../object/instanceOf.js');

describe('object/instanceOf', () => {

	it('should return true if an item is an instanceOf a constructor', () => {

		expect(instanceOf({}, Object)).to.ok();

		expect(instanceOf([], Array)).to.ok();

	});

	it('should return false if an item is not an instanceOf a constructor', () => {

		expect(instanceOf(undefined, Array)).to.not.ok();

		expect(instanceOf('', undefined)).to.not.ok();

		expect(instanceOf('', Object)).to.not.ok();

		expect(instanceOf(0, String)).to.not.ok();

	});

});
