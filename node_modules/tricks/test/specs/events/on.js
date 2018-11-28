const on = require('../../../events/on.js');
const emit = require('../../../events/emit.js');

describe('events/on', () => {

	let spy;
	let el;

	beforeEach(() => {
		spy = sinon.spy();
		el = document.createElement('a');
		document.body.appendChild(el);
	});
	afterEach(() => {
		// Clean up
		document.body.removeChild(el);
	});

	it('should bind event handlers to DOM nodes', () => {

		on(el, 'click', spy);
		emit(el, 'click');
		expect(spy.calledOnce).to.be.ok();
	});

	it('should bind multiple event handlers to DOM nodes', () => {

		on(el, 'click, touchstart, word', spy);
		emit(el, 'click');
		expect(spy.calledOnce).to.be.ok();

	});

});
