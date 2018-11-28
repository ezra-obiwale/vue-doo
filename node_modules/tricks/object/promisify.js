'use strict';

const isPromise = require('./isPromise.js');
const Promise = require('./Promise.js');

module.exports = func =>

	(...args) =>

		new Promise((accept, reject) => {

			// Add the callback
			args.push(accept);

			// Call the function and handle the callback
			const r = func(...args);
			if (isPromise(r)) {
				r.then(accept, reject);
			}
		});
