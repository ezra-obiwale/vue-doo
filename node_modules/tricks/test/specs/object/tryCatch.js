const tryCatch = require('../../../object/tryCatch.js');

describe('object/tryCatch', () => {

	it('should execute a function and return its value', () => {

		const test = tryCatch(() => 1);

		expect(test).to.eql(1);

	});

	it('should return undefined if an exception occurs', () => {

		/*eslint no-undef: 0*/
		const test = tryCatch(() => thiscausesanexception);

		expect(test).to.eql(undefined);

	});

});
