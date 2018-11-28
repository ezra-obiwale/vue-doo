// Get JSON
const request = require('./request.js');
const jsonParse = require('../string/jsonParse.js');

module.exports = (url, callback) => {

	// Protocol
	request(url, data => callback(jsonParse(data)));
};
