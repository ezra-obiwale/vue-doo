const close = require('../../../window/close.js');

describe('window/close', () => {

	it('should call window.close on a popup', () => {

		// Create a fake instance of a popup.
		const popup = {};

		const spy = sinon.spy();

		popup.close = spy;

		close(popup);

		expect(spy.calledOnce).to.be.ok();
	});

	xit('should remove a window if its contained within another window.', () => {

		const popup = document.createElement('iframe');
		popup.src = 'about:blank';

	});
});
