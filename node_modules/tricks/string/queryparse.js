// Create a Query string
const extract = require('./extract.js');

const trim_left = /^[#?]/;
const match_params = /([^=/&]+)=([^&]+)/g;

module.exports = (str, formatFunction = decodeURIComponent) => {
	str = str.replace(trim_left, '');
	return extract(str, match_params, formatFunction);
};
