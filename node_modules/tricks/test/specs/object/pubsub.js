const pubsub = require('../../../object/pubsub.js');

describe('object/pubsub', () => {

	let testObj;
	let arbitaryData;
	let eventName;

	beforeEach(() => {

		// Pass an arbitary piece of data around
		arbitaryData = {boom: true};

		eventName = 'custom';

		testObj = {};

		pubsub.call(testObj);
	});

	it('should bind events by name and be able to trigger them by name', () => {

		// Make request
		const spy = sinon.spy((data, type) => {

			expect(eventName).to.be(type);

			expect(arbitaryData).to.be(data);

		});

		testObj.on(eventName, spy);

		testObj.emit(eventName, arbitaryData);

		expect(spy.called).to.be.ok();
	});

	it('should listen to any event by using a *', () => {

		// Make request
		const spy = sinon.spy((data, type) => {

			expect(eventName).to.be(type);

			expect(arbitaryData).to.be(data);

		});

		testObj.on('*', spy);

		testObj.emit(eventName, arbitaryData);

		expect(spy.called).to.be.ok();
	});

	it('should unbind an event by name and callback', () => {

		// Listeners
		const spy = sinon.spy(() => {
			// Should not be called.
		});

		const spy2 = sinon.spy(() => {
			// Should not be called.
		});

		// Bind
		testObj.on(eventName, spy);

		testObj.on(eventName, spy2);

		// Remove
		testObj.off(eventName, spy);

		// Trigger
		testObj.emit(eventName);

		// Test spies
		expect(!spy.called).to.be.ok();
		expect(spy2.called).to.be.ok();

	});

	it('should unbind all events by name', () => {

		// Listeners
		const spy = sinon.spy(() => {
			// Should not be called.
		});

		const spy2 = sinon.spy(() => {
			// Should not be called.
		});

		// Bind
		testObj.on(eventName, spy);

		testObj.on(eventName, spy2);

		// Remove
		testObj.off(eventName);

		// Trigger
		testObj.emit(eventName);

		// Test spies
		expect(!spy.called).to.be.ok();
		expect(!spy2.called).to.be.ok();

	});

	it('should trigger events on its proto (predecessor in chain)', () => {

		// PROTO
		// Listeners
		const spy = sinon.spy(() => {
			// Should not be called.
		});

		// Bind
		testObj.on(eventName, spy);

		// PROTO
		const child = Object.create(testObj);

		const spy2 = sinon.spy(() => {
			// Should not be called.
		});

		testObj.on(eventName, spy2);

		// Trigger
		child.emit(eventName);

		// Test spies
		expect(spy.called).to.be.ok();
		expect(spy2.called).to.be.ok();

	});
});
