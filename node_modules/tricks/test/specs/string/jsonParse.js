const jsonParse = require('../../../string/jsonParse.js');

describe('string/jsonParse', () => {

	it('should accept a string and return an object', () => {

		const json = {
			test: 1
		};

		const str = JSON.stringify(json);

		const test = jsonParse(str);

		expect(test).to.eql(json);
	});

	it('should return undefined if json is invalid', () => {

		// Convert there and back

		const test = jsonParse('invalid json');

		expect(test).to.eql(undefined);
	});
});
