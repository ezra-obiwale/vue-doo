const extract = require('../../../string/extract.js');

describe('string/extract', () => {

	it('should accept a string and return an object', () => {
		const reg = /(.+)(.+)/g;
		const value = extract('', reg);
		expect(value).to.be.an(Object);
	});

	it('should extract according to a regExp, and format the values', () => {

		// Convert there and back
		const str = 'test:value;test2:2;';
		const reg = /([a-z0-9-]+):\s*([^:;]+)/gi;
		const test = extract(str, reg, value => value + 1);

		expect(test).to.eql({
			test: 'value1',
			test2: '21'
		});
	});
});
