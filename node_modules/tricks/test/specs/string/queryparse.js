const queryparse = require('../../../string/queryparse.js');
const stringify = require('../../../string/querystringify.js');

describe('string/queryparse', () => {

	it('should accept a string and return an object', () => {

		const value = queryparse('');

		expect(value).to.be.an(Object);
	});

	it('should turn URL query into an object', () => {

		// Convert there and back

		const value = queryparse('&test=1&test2=2');

		expect(value).to.eql({
			test: '1',
			test2: '2'
		});
	});

	it('should perform the opposite of querystringify, e.g. return a decoded URL string', () => {

		// Encode
		const params = {
			test: 'http://word',
			test2: '2'
		};

		// Convert there and back
		const value = queryparse(stringify(params));

		expect(value).to.eql(params);
	});

});
