const isBinary = require('./isBinary.js');

// Some of the providers require that only multipart is used with non-binary forms.
// This function checks whether the form contains binary data
module.exports = data => {
	for (const x in data) {
		if (data.hasOwnProperty(x)) {
			if (isBinary(data[x])) {
				return true;
			}
		}
	}

	return false;
};

