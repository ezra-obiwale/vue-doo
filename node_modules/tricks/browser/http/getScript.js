const createElement = require('../../dom/createElement.js');
const createEvent = require('../../events/createEvent.js');

module.exports = (url, callback, timeout = 0) => {

	// Inject a script tag
	let bool = 0;
	let timer;
	const head = document.getElementsByTagName('script')[0].parentNode;
	const cb = e => {
		if (!(bool++) && callback) {
			callback(e);
		}
		if (timer) {
			clearTimeout(timer);
		}
	};

	// Add timeout
	if (timeout) {
		timer = window.setTimeout(() => {
			cb(createEvent('timeout'));
		}, timeout);
	}

	// Build script tag
	const script = createElement('script', {
		src: url,
		onerror: cb,
		onload: cb,
		onreadystatechange: () => {
			if (/loaded|complete/i.test(script.readyState)) {
				cb(createEvent('load'));
			}
		}
	});

	// Set Async
	script.async = true;

	// Inject script tag into the head element
	head.insertBefore(script, head.firstChild);

	return script;
};
