const timing = require('../../../animation/timing.js');

describe('animation/timing', () => {

	it('should trigger numerous callbacks between a period of time', done => {

		const spy = sinon.spy((x, t) => {

			if (t === 1) {
				expect(spy.callCount >= 1).to.be.ok();
				done();
				return;
			}

			expect(x >= 0).to.be.ok();
			expect(x < 1).to.be.ok();
		});

		// Lets wait for a calm moment
		timing(100, spy);
	});

});
