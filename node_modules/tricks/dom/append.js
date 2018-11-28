const createElement = require('./createElement.js');

module.exports = (tagName, prop, parent = document.body) => {
	const elm = createElement(tagName, prop);
	parent.appendChild(elm);
	return elm;
};
