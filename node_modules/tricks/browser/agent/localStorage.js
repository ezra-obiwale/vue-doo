// sessionStorage
// Shimmed up sessionStorage

const sessionStorage = require('./sessionStorage.js');
const Storage = require('./Storage.js');

// Test the environment
try {
	const temp = '__tricks_temp__';
	// In Chrome with cookies blocked, calling localStorage throws an error
	const storage = window.localStorage;
	storage.setItem(temp, 1);
	storage.removeItem(temp);
	module.exports = new Storage(storage);

}
catch (e) {
	module.exports = sessionStorage;
}
