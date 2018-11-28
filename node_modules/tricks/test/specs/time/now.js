const now = require('../../../time/now.js');

describe('time/now', () => {

	it('should return the current time in milliseconds', done => {

		const i = now();

		expect(i).to.be.a('number');

		setTimeout(() => {
			expect(i < now()).to.be.ok();
			done();
		}, 10);

	});

});
