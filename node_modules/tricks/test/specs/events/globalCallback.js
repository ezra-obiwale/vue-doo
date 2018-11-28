const globalCallback = require('../../../events/globalCallback.js');

describe('events/globalCallback', () => {

	it('should set a callback function on the window object', done => {

		const id = globalCallback(() => {
			done();
		});

		// Expect there to be a function on the window object which can be triggered
		expect(id).to.be.a('string');
		expect(window[id]).to.be.a('function');

		window[id].call(null);
		expect(window[id]).to.be.a('function');
	});

	it('should set unique callback names', () => {

		const id = globalCallback(() => {});
		const id2 = globalCallback(() => {});

		// Expect there to be a function on the window object which can be triggered
		expect(id).to.not.be.eql(id2);
	});

	it('should let callback names be defined', () => {

		const id = globalCallback(() => {});
		const id2 = globalCallback(() => {}, id);

		// Expect there to be a function on the window object which can be triggered
		expect(id).to.be.eql(id2);
	});

	it('should remove window[callback] reference if it returns truthy', () => {

		const spy = sinon.spy(() => true);

		const id = globalCallback(spy);
		window[id].call(null);

		// Should be removed
		expect(spy.calledOnce).to.be.ok();
		expect(window[id]).to.be(undefined);

	});

	it('should keep the window[callback] reference if it returns falsy', () => {

		const spy = sinon.spy(() => 0);

		const id = globalCallback(spy);
		window[id].call(null);

		// Should be removed
		expect(spy.calledOnce).to.be.ok();
		expect(window[id]).to.be.a('function');

	});

	it('should customize the prefix of the callback in the third argument', () => {

		const id = globalCallback(() => {}, null, 'test_');

		expect(id).to.match(/^test_[a-z0-9]+/i);

		// clean up
		delete window[id];
	});

});
