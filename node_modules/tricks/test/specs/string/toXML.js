const toXML = require('../../../string/toXML.js');

describe('string/toXML', () => {

	const test = {
		param: 'param1',
		param2: 'param2'
	};

	it('should convert an object into an XML string', () => {

		const value = toXML(test);
		expect(value).to.eql('<param>param1</param><param2>param2</param2>');

	});
});
