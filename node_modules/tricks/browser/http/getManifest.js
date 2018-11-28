const link = require('../../dom/link.js');
const json = require('./json.js');

module.exports = callback => {

	// Manifest, e.g.
	// <link rel="manifest" href="manifest.webmanifest">
	const path = link('manifest') || '/manifest.json';

	// Request the manifest content
	json(path, callback);

};
