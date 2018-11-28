// Pubsub extension
// A contructor superclass for adding event menthods, on, off, emit.
const setImmediate = require('../time/setImmediate.js');

const separator = /[\s,]+/;

module.exports = function() {

	// If this doesn't support getPrototype then we can't get prototype.events of the parent
	// So lets get the current instance events, and add those to a parent property
	this.parent = {
		events: this.events,
		findEvents: this.findEvents,
		parent: this.parent,
		utils: this.utils
	};

	this.events = {};

	this.off = off;
	this.on = on;
	this.emit = emit;
	this.emitAfter = emitAfter;
	this.findEvents = findEvents;

	return this;
};


// On, subscribe to events
// @param evt   string
// @param callback  function
function on(evt, callback) {

	if (callback && typeof (callback) === 'function') {
		evt.split(separator).forEach(name => {
			// Has this event already been fired on this instance?
			this.events[name] = [callback].concat(this.events[name] || []);
		});
	}

	return this;
}


// Off, unsubscribe to events
// @param evt   string
// @param callback  function
function off(evt, callback) {

	this.findEvents(evt, function(name, index) {
		if (!callback || this.events[name][index] === callback) {
			this.events[name][index] = null;
		}
	});

	return this;
}

// Emit
// Triggers any subscribed events
function emit(evt, ...args) {

	// Append the eventname to the end of the arguments
	args.push(evt);

	// Handler
	const handler = function(name, index) {

		// Replace the last property with the event name
		args[args.length - 1] = (name === '*' ? evt : name);

		// Trigger
		this.events[name][index].apply(this, args);
	};

	// Find the callbacks which match the condition and call
	let _this = this;
	while (_this && _this.findEvents) {

		// Find events which match
		_this.findEvents(`${evt },*`, handler);
		_this = _this.parent;
	}

	return this;
}

// Easy functions
function emitAfter(...args) {

	setImmediate(() => {
		this.emit(...args);
	});

	return this;
}

function findEvents(evt, callback) {

	const a = evt.split(separator);

	for (const name in this.events) {
		if (this.events.hasOwnProperty(name)) {

			if (a.indexOf(name) > -1) {

				this.events[name].forEach(triggerCallback.bind(this, name, callback));
			}
		}
	}
}

function triggerCallback(name, callback, handler, i) {
	// Does the event handler exist?
	if (handler) {
		// Emit on the local instance of this
		callback.call(this, name, i);
	}
}
