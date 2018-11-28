// Sleep
// Creates an instance of a function which
let i = 1;
const hash = {};

module.exports = (callback, period = 0, guid = i++) => {

	if (guid && hash[guid]) {
		clearTimeout(hash[guid]);
		delete hash[guid];
	}

	if (callback) {
		// Set the period to change the state.
		hash[guid] = setTimeout(() => {
			callback();
		}, period);
	}

	return guid;
};
