// Add browser ability to the window HTML.classList
module.exports = (property, enabled) => {
	document.documentElement.className = `${document.documentElement.className } ${ enabled ? '' : 'no-' }${property}`;
};
