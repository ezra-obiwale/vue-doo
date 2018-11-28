const uuid = require('../../../string/uuid.js');

describe('string/uuid', () => {

	it('should return a UUID', () => {
		const str = uuid();
		expect(str).to.match(/[a-z0-9-]+/);
	});

	it('should not make two of the same', () => {
		const a = uuid();
		const b = uuid();
		expect(a).to.not.eql(b);
	});

});
