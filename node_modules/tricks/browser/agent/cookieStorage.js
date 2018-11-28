// Provide an API for setting and retrieving cookies
const arrayFind = require('../../array/find.js');
const Storage = require('./Storage.js');

// Emulate localStorage using cookies
module.exports = new Storage({
	getItem: name => {
		const key = `${name }=`;
		const m = document.cookie.split(';');
		return arrayFind(m, item => {
			item = item.replace(/(^\s+|\s+$)/, '');
			if (item && item.indexOf(key) === 0) {
				return item.substr(key.length);
			}
		}) || null;

	},

	setItem: (name, value) => {
		document.cookie = `${name }=${ value}`;
	},

	removeItem: name => {
		document.cookie = `${name }=; expires=Thu, 01 Jan 1970 00:00:01 GMT;`;
	}
});
