// Shim up the getUserMedia API
// Wrap this to a custom variable but bind it on the navigator object to work
const _getUserMedia = (
	navigator.getUserMedia ||
	navigator.webkitGetUserMedia ||
	navigator.mozGetUserMedia ||
	navigator.msGetUserMedia ||
	navigator.oGetUserMedia ||
	function(c, s, e) {
		e(new Error('getUserMedia is not supported'));
	}
).bind(navigator);

module.exports = (constraints, success, failure) => {
	try {
		_getUserMedia(constraints, success, failure);
	}
	catch (e) {
		try {
			// provide a string of constraints
			_getUserMedia(Object.keys(constraints).join(','), success, failure);
		}
		catch (_e) {
			failure();
		}
	}
};
