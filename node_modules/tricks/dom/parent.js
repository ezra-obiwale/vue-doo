// Find first parent of an element which matches a pattern

const parents = require('./parents.js');

module.exports = (elements, match) => {
	const ul = parents(elements, match);
	return ul.length ? ul[0] : null;
};
