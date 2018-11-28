/* eslint no-undef: 0 */

// module.exports = () => {};

const _xhr = window.XMLHttpRequest;
module.exports = data => {

	const a = [];

	function xhr() {
		// expose this instance
		a.push(this);
	}

	xhr.prototype.send = function(...args) {
		this.sendArgs = args;
		this.writeCalledWith = args[0];
		this.endCalled = true;
	};
	xhr.prototype.onload = function() {};
	xhr.prototype.onerror = function() {};

	xhr.prototype.open = function(...args) {

		const [method, url] = args;
		this.openArgs = args;
		this.method = method;
		this.url = url;

		setTimeout(() => {
			try {
				this.response = data;
				this.onload();
			}
			catch (e) {
				this.onerror();
			}
		});
	};
	xhr.prototype.overrideMimeType = () => {};
	xhr.prototype.setRequestHeader = () => {};
	xhr.prototype.getAllResponseHeaders = () => {};


	window.XMLHttpRequest = xhr;

	return a;
};

module.exports.unstub = () => {
	window.XMLHttpRequest = _xhr;
};
