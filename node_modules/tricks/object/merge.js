// Extend an object
const extend = require('./extend.js');

module.exports = (...args) => {
	args.unshift({});
	return extend(...args);
};
