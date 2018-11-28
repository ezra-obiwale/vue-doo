const extend = require('../../../object/extend.js');

describe('object/extend', () => {

	it('should overide the properties in the first object with those within the second', () => {

		const a = {
			key: 'valueA'
		};

		const b = {
			key: 'valueB'
		};

		extend(a, b);

		// Check a is like b
		expect(a).to.eql(b);

		// But a is not b
		expect(a).to.not.equal(b);

	});

	it('should merge child objects', () => {

		const a = {
			key: 'valueA'
		};
		a.child = {};
		a.child.key = 'valueA';
		a.child.key2 = 'valueA';

		const b = {
			key: 'valueB'
		};
		b.child = b;

		extend(a, b);

		// Check a is like b
		expect(a).to.not.eql(b);

	});

	it('should understand null is not an object', () => {

		const a = {
			key: 'valueA',
			child: null
		};

		const child = {
			key: 'valueA'
		};

		const b = {
			key: 'valueB',
			child
		};

		extend(a, b);

		// Check a is like b
		expect(a.child).to.eql(child);

	});
});
