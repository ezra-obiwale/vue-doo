module.exports = e => {
	e.stopPropagation = () => {};
	e.preventDefault = () => {};
	return e;
};
