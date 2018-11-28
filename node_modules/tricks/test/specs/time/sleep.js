const sleep = require('../../../time/sleep.js');

describe('time/sleep', () => {

	it('should be a function', () => {
		expect(sleep).to.be.a('function');
	});


	it('should fire a callback after a given period of time.', done => {

		let i = 0;
		const cb = () => {
			i = 1;
			done();
		};

		sleep(cb, 10);

		expect(i).to.eql(0);

	});

	it('should cancel a previous callback, if passsed its ID', done => {

		const id = sleep(() => done(new Error('Should not be called')), 10);

		sleep(() => done(), 10, id);

	});

});
