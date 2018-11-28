// Request
// Makes an REST request given an object which describes how (aka, xhr, jsonp, formpost)
const jsonp = require('./jsonp.js');
const xhr = require('./xhr.js');
const formpost = require('./formpost.js');
const SupportCORS = require('../../support/cors.js');
const globalCallback = require('../../events/globalCallback.js');
const createUrl = require('../../string/createUrl.js');
const extend = require('../../object/extend.js');

module.exports = (p, callback) => {

	if (typeof p === 'string') {
		p = {
			url: p
		};
	}

	// Use interchangeably
	p.url = p.url || p.uri;

	// Set defaults
	p.query = p.query || p.qs || {};

	// Default method
	p.method = (p.method || 'get').toLowerCase();

	// Default proxy response
	p.proxyHandler = p.proxyHandler || ((p, cb) => {
		cb();
	});

	// CORS
	if (SupportCORS && (typeof (p.xhr) === 'function' ? p.xhr(p, p.query) : p.xhr !== false)) {

		// Pass the selected request through a proxy
		p.proxyHandler(p, () => {
			// The agent and the provider support CORS
			const url = createUrl(p.url, p.query);
			const x = xhr(p.method, url, p.responseType, p.headers, p.data, callback);
			x.onprogress = p.onprogress || null;

			// Feature detect, not available on all implementations of XMLHttpRequest
			if (x.upload && p.onuploadprogress) {
				x.upload.onprogress = p.onuploadprogress;
			}
		});

		return;
	}

	// Apply a globalCallback
	p.callbackID = p.query.callback = globalCallback(callback);

	// JSONP
	if (p.jsonp !== false) {

		// Call p.jsonp handler
		if (typeof (p.jsonp) === 'function') {
			// Format the request via JSONP
			p.jsonp(p, p.query);
		}

		// Lets use JSONP if the method is 'get'
		if (p.method === 'get') {

			p.proxyHandler(p, () => {
				const url = createUrl(p.url, extend(p.query, p.data || {}));
				jsonp(url, callback, p.callbackID, p.timeout);
			});

			return;
		}
	}

	// Otherwise we're on to the old school, iframe hacks and JSONP
	if (p.form !== false) {

		// Add some additional query parameters to the URL
		// We're pretty stuffed if the endpoint doesn't like these
		p.query.redirect_uri = p.redirect_uri;
		p.query.state = JSON.stringify({callback: p.callbackID});
		delete p.query.callback;

		let opts;

		if (typeof (p.form) === 'function') {

			// Format the request
			opts = p.form(p, p.query);
		}

		if (p.method === 'post' && opts !== false) {

			p.proxyHandler(p, () => {
				const url = createUrl(p.url, p.query);
				formpost(url, p.data, opts, callback, p.callbackID, p.timeout);
			});

			return;
		}
	}

	callback({error: 'invalid_request'});
};
