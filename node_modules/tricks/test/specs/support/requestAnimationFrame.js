const requestAnimationFrame = require('../../../support/requestAnimationFrame.js');

describe('support/requestAnimationFrame', () => {

	it('should trigger the callback handler', done => {

		const spy = sinon.spy(() => {
			done();
		});

		requestAnimationFrame(spy);
		expect(spy.called).to.not.be.ok();
	});

});
