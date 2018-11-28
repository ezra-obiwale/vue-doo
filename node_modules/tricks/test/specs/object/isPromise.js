const isPromise = require('../../../object/isPromise.js');
const Promise = require('../../../object/Promise.js');

describe('object/isPromise', () => {

	it('should return true if the item is a Promise-ish', () => {

		[
			new Promise(() => {}),
			{then: () => {}}
		].forEach(value => {
			expect(isPromise(value)).to.be.ok();
		});

	});

	it('should return false if the item is not a promise', () => {

		[
			1,
			null,
			{},
			{then: 1}
		].forEach(value => {
			expect(isPromise(value)).to.not.be.ok();
		});

	});

});
