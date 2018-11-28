// Array find
// Returns the first non undefined response
// If the response is (Boolean) True, then the value of that array item is returned instead...
module.exports = (arr, callback, thisArg = null) => {
	for (let i = 0; i < arr.length; i++) {
		const value = callback.call(thisArg, arr[i]);
		if (value !== undefined) {
			return value === true ? arr[i] : value;
		}
	}
};
