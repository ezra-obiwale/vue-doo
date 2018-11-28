// Param
// Explode/encode the parameters of an URL string/object
// @param string s, string to decode
module.exports = (hash, delimiter = '&', seperator = '=', formatFunction = o => o) =>
	Object.keys(hash).map(name => {
		const value = formatFunction(hash[name]);
		return name + (value !== null ? seperator + value : '');
	}).join(delimiter)
;
