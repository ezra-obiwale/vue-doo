// Polls the fn multiple times until it's resolved
// Period between polls is defined by the value defer
module.exports = (fn, defer = 0) =>

	new Promise((accept, reject) => {

		let timer;
		let resolved;

		const curry = resolve => resp => {
			timer && clearTimeout(timer);
			resolved = true;
			return resolve(resp);
		};

		const _accept = curry(accept);
		const _reject = curry(reject);

		const tick = () => {
			try {
				fn(_accept, _reject);

				if (!resolved) {
					timer = setTimeout(tick, defer);
				}
			}
			catch (e) {
				reject(e);
			}
		};

		tick();
	});
