module.exports = obj => {

	// Scalar
	if (!obj)
		return true;

	// Array
	if (Array.isArray(obj)) {
		return !obj.length;
	}
	else if (typeof (obj) === 'object') {
		// Object
		for (const key in obj) {
			if (obj.hasOwnProperty(key)) {
				return false;
			}
		}
	}

	return true;
};
