const instanceOf = require('./instanceOf.js');

module.exports = function extend(r, ...args) {
	args.forEach(o => {
		if (Array.isArray(r) && Array.isArray(o)) {
			Array.prototype.push.apply(r, o);
		}
		else if (instanceOf(r, Object) && instanceOf(o, Object) && r !== o) {
			for (const x in o) {
				r[x] = extend(r[x], o[x]);
			}
		}
		else if (Array.isArray(o)) {
			// Clone it
			r = o.slice(0);
		}
		else {
			r = o;
		}
	});
	return r;
};
