// Rewire functions
module.exports = fn => {
	const f = (...args) => f.fn.apply(null, args);
	f.fn = fn;
	return f;
};
