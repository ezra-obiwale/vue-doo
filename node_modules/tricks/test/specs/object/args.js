const args = require('../../../object/args.js');

describe('object/args', () => {

	it('should accept an object and arguments as first and second parameters and return an object', () => {

		const value = args({}, []);

		expect(value).to.be.an(Object);

	});

	it('should map arguments to an object', () => {

		const value = args({str: 's', obj: 'o', func: 'f'}, ['String', {}, () => {}]);

		expect(value).to.be.an('object');

		expect(value.str).to.be.a('string');

		expect(value.obj).to.be.an('object');

		expect(value.func).to.be.a('function');

	});

	it('should interpret the order of arguments, so some can be ommited', () => {

		const value = args({str: 's', obj: 'o', func: 'f'}, [() => {}]);

		expect(value)

			.to.be.an('object')

			.and.to.not.have.property('str')

			.and.to.not.have.property('obj');

		expect(value.func).to.be.a('function');

	});

	it('should decipher whether the first argument is all the arguments represented as an object', () => {

		const value = args({str: 's', obj: 'o', func: 'f'}, [{
			func: () => {}
		}]);

		expect(value)

			.to.be.an('object')

			.and.to.not.have.property('str')

			.and.to.not.have.property('obj');

		expect(value.func).to.be.a('function');

	});
});
