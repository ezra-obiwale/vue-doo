// Create a queuing function
// Queues items in an Array like function until a handler has been defined
// Then each item will be processed against the handler.
// Useful for creating Global Asynchronous Queues, as can be retro fitted to existing arrays.

module.exports = class Queue {

	constructor(arr, handler) {
		this.items = (Array.isArray(arr) ? arr : []);
		this.handler = handler;
	}

	// Mimic the Array.push function
	push(...args) {

		// Append items to the internal array.
		args.forEach(item => this.items.push(item));

		// Trigger the custom handler
		if (this._handler) {
			args.forEach(item => this._handler(item));
		}
	}

	// Mimic the length
	get length() {
		return this.items.length;
	}
	set length(value) {
		return this.items.length = value;
	}

	// Set the item handler
	get handler() {
		return this._handler;
	}

	set handler(callback) {

		this._handler = callback;

		if (this._handler) {
			this.items.forEach(item => this._handler(item));
		}
	}
};
