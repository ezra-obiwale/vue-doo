const querystringify = require('./querystringify.js');
const isEmpty = require('../object/isEmpty.js');

module.exports = (url, params, formatFunction) => {

	let reg;

	if (params) {
		// Set default formatting function
		formatFunction = formatFunction || encodeURIComponent;

		// Override the items in the URL which already exist
		for (const x in params) {
			const str = `([\\?\\&])${ x }=[^\\&]*`;
			reg = new RegExp(str);
			if (url.match(reg)) {
				url = url.replace(reg, `$1${ x }=${ formatFunction(params[x])}`);
				delete params[x];
			}
		}
	}

	if (!isEmpty(params)) {
		return url + (url.indexOf('?') > -1 ? '&' : '?') + querystringify(params, formatFunction);
	}

	return url;
};
