const clone = require('../../../object/clone.js');

describe('object/clone', () => {

	it('should clone a simple object', () => {

		const orig = {
			prop: 'prop'
		};

		const _clone = clone(orig);

		// Assert that its the same but different.
		expect(_clone).to.be.eql(orig).and.not.to.be.equal(orig);

	});

	if (typeof Blob !== 'undefined') {
		it('should not clone Blob values', () => {

			const blob = new Blob();

			const orig = {
				prop: blob
			};

			const _clone = clone(orig);

			// Assert that its the same but different.
			expect(_clone.prop).to.be.a(Blob).and.to.be.equal(orig.prop);

		});
	}

	if (typeof document !== 'undefined') {
		it('should not clone DOM element', () => {

			const orig = {
				prop: document.createElement('input')
			};

			const _clone = clone(orig);

			// Assert that its the same but different.
			expect(_clone.prop).to.be.a(window.Element || window.HTMLElement).and.to.be.equal(orig.prop);

		});
	}

	it('should clone arrays', () => {

		const orig = [1, 2, 3];
		const _clone = clone(orig);

		// Assert that its the same but different.
		expect(_clone).to.be.eql(orig).and.to.not.be.equal(orig);

	});

	it('should return primitive value (Number)', () => {

		const orig = 1;
		const _clone = clone(orig);

		// Assert that its the same but different.
		expect(_clone).to.be.eql(orig);

	});

	it('should return primitive value (null)', () => {

		const orig = null;
		const _clone = clone(orig);

		// Assert that its the same but different.
		expect(_clone).to.be.eql(orig);

	});

	it('should return primitive value (String)', () => {

		const orig = 'string';
		const _clone = clone(orig);

		// Assert that its the same but different.
		expect(_clone).to.be.eql(orig);

	});

	it('should clone Date objects', () => {

		const orig = (new Date());
		const _clone = clone(orig);

		// Assert that its the same but different.
		expect(_clone).to.be.eql(orig);

	});

	it('should clone arrays in objects', () => {
		const orig = {
			foo: 'bar',
			arr: [
				{
					a: 'b',
					c: 'd'
				},
				{
					a: '1',
					c: '3'
				}
			]
		};
		const _clone = clone(orig);

		expect(_clone).to.be.eql(orig).and.to.not.be.equal(orig);
	});
});
