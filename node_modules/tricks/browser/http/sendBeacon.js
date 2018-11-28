const querystringify = require('../../string/querystringify');

module.exports = (url, data = null, contentType = 'text/plain') => {

	// Format data
	if (data && typeof data === 'object') {
		// Wrap the data using a simple header to migigate against CORS pre-flight request header conflicts
		// See https://w3c.github.io/beacon/#sec-sendBeacon-method
		data = querystringify(data);
		contentType = 'application/x-www-form-urlencoded';
	}

	// Send
	if (navigator.sendBeacon) {
		const blob = new Blob([data], {type: contentType});
		navigator.sendBeacon(url, blob);
	}
	else {
		const xhr = new XMLHttpRequest();
		xhr.open('post', url, false);
		xhr.setRequestHeader('Content-Type', contentType);
		xhr.send(data);
	}
};
