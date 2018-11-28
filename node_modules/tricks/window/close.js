// Close a window
module.exports = window => {

	// Is this window within an Iframe?
	if (window.frameElement) {
		window.parent.document.body.removeChild(window.frameElement);
	}
	else {
		// Close this current window
		try {
			window.close();
		}
		catch (e) {
			// Continue
		}

		// IOS bug wont let us close a popup if still loading
		if (window.addEventListener) {
			window.addEventListener('load', () => window.close());
		}
	}
};
