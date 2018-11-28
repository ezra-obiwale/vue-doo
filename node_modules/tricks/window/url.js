module.exports = path => {

	// If the path is empty
	if (!path) {
		return window.location;
	}

	// Chrome and FireFox support new URL() to extract URL objects
	else if (window.URL && URL instanceof Function && URL.length !== 0) {
		return new URL(path, window.location);
	}

	// Ugly shim, it works!
	else {
		const a = document.createElement('a');
		a.href = path;
		// Return clone for IE compatibility view.
		return a.cloneNode(false);
	}
};
