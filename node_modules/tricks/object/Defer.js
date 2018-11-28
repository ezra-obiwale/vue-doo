// Defer
// Creates a new Iterative object

module.exports = class Defer {

	constructor(...args) {
		this.items = [];
		this.state = 'pending';
		this.response = null;
		this.push(...args);
	}

	// Mimic the Array.push function
	push(...args) {

		// Append items to the internal array.
		this.items.push(...args);

		// Trigger the custom handler
		if (this.state !== 'pending') {
			// Trigger the callbacks
			this.items.forEach(item => item(this.response));

			// Remove all the defered items
			this.length = 0;
		}
	}

	// Mimic the length
	get length() {
		return this.items.length;
	}
	set length(value) {
		return this.items.length = value;
	}

	resolve(response) {

		// Change the instances state
		this.state = 'resolved';
		this.response = response;

		// Trigger the callbacks
		this.push();
	}
};
