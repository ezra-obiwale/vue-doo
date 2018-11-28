const setImmediate = require('../../../time/setImmediate.js');

describe('time/setImmediate', () => {

	it('should run the callback in another process, after the current one has finished', done => {

		let bool = true;

		setImmediate(() => {
			bool = false;
			done();
		});

		expect(bool).to.be.ok();
	});

});
