module.exports = function xml(obj) {

	if (typeof(obj) !== 'object') {
		return (obj) ? obj.toString() : '';
	}

	let r = '';
	for (const x in obj) {
		r += `<${ x }>${ xml(obj[x]) }</${ x }>`;
	}

	return r;
};
