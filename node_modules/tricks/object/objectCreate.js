// Object Create
// shims up the ES5 function Object.create
let oc;
function F() {}

if (Object.create) {
	oc = Object.create;
}
else {
	oc = (...args) => {
		if (args.length !== 1) {
			throw new Error('Object.create implementation only accepts one parameter.');
		}
		F.prototype = args[0];
		return new F();
	};
}

module.exports = oc;
