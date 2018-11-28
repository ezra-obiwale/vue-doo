const hasBinary = require('../../../object/hasBinary.js');

describe('object/hasBinary', () => {

	if (typeof Blob !== 'undefined') {
		it('should return true if the content of the arguments contain binary data', () => {

			const b = hasBinary({
				key: 'valueB',
				bin: new Blob()
			});

			// Check a is like b
			expect(b).to.be.ok();
		});
	}

	it('should return false if the content of the arguments does not contain binary data', () => {

		const b = hasBinary({
			key: 'valueB'
		});

		// Check a is like b
		expect(b).to.not.be.ok();
	});
});
