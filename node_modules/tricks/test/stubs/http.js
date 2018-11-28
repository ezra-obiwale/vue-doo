// stubs nodes http.request methods
// Get the methods to stub

const http = require('http');
const https = require('https');
const _http = http.request;
const _https = https.request;
const EventEmitter = require('events').EventEmitter;

module.exports = mock => {
	const a = [];

	http.request = respond(a, mock);
	https.request = respond(a, mock);

	return a;
};

module.exports.unstub = () => {
	http.request = _http;
	https.request = _https;
};

function respond(a, mock) {

	return (req, callback) => {

		// Info
		a.push(req);

		// Cosntruct an event emitter
		const e = new EventEmitter();

		// trigger callback to listen to new events
		callback(e);

		// Push out event
		if (mock) {
			e.emit('data', mock);
		}

		e.emit('end');
		return {
			write: data => {
				req.writeCalledWith = data;
			},
			end: () => {
				req.endCalled = true;
			}
		};
	};
}
