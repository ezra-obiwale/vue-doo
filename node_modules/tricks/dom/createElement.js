const attr = require('./attr.js');

module.exports = (tagName, attrs) => {
	const elm = document.createElement(tagName);
	attr(elm, attrs);
	return elm;
};
