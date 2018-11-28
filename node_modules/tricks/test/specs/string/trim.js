const trim = require('../../../string/trim.js');

describe('string/trim', () => {

	it('should remove whitespace from eitherside of a string.', () => {
		const str = 'trimmed';
		expect(trim(`   ${str}    `)).to.eql(str);
		expect(trim(`${str}    `)).to.eql(str);
		expect(trim(`   ${str}`)).to.eql(str);
		expect(trim(str)).to.eql(str);
	});

	it('should remove characters according to a regular expression.', () => {
		const str = 'trimmed';
		expect(trim(`?${str}&`, /^\?|&$/g)).to.eql(str);
	});

});
