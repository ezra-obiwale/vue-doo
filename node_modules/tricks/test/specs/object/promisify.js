const promisify = require('../../../object/promisify.js');

describe('object/promisify', () => {

	it('should convert a function where the last argument is callback into a Promise', done => {

		const promise = promisify((arg, callback) => {
			expect(arg).to.eql(1);
			setTimeout(() => callback(2));
		});

		promise(1).then(arg => {
			expect(arg).to.eql(2);
			done();
		}, done);

	});

});
