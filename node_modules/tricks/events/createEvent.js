// IE does not support `new Event()`
// See https://developer.mozilla.org/en-US/docs/Web/Guide/Events/Creating_and_triggering_events for details
const dict = {bubbles: true, cancelable: true};

let createEvent = (eventname, options = dict) =>
	new Event(eventname, options);

try {
	createEvent('test');
}
catch (e) {
	createEvent = (eventname, options = dict) => {
		const e = document.createEvent('Event');
		e.initEvent(eventname, !!options.bubbles, !!options.cancelable);
		return e;
	};
}

module.exports = createEvent;
