const Queue = require('../../../object/Queue.js');

describe('object/Queue', () => {

	it('should convert an Array into a Queue', () => {

		// Create a Queue with initial value
		const q = new Queue([0]);

		// Anticipate what should be called
		let x = 0;

		// Create a handling function
		const spy = sinon.spy(item => {
			// Should return the first item
			expect(item).to.be.eql(x++);
		});

		// Append it too the handler
		q.handler = spy;

		// Check that it has been called
		expect(spy.calledOnce).to.be.ok();

		// Add another
		q.push(1);

		// Check that it has been called
		expect(spy.calledTwice).to.be.ok();

	});

});
