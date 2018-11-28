module.exports = fn => {
	try {
		return fn();
	}
	catch (e) {
		// Continue
	}
};
