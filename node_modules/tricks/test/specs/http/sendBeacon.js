const sendBeacon = require('../../../http/sendBeacon.js');
const stubRequest = require('../../stubs/http.js');

describe('http/sendBeacon', () => {

	if (typeof navigator === 'object' && navigator.sendBeacon) {
		const sb = navigator.sendBeacon;
		afterEach(() => navigator.sendBeacon = sb);

		it('should trigger a navigator.sendBeacon if it exists and send JSON object', done => {

			const data = {payload: 'hello'};

			// override
			navigator.sendBeacon = (url, data) => {
				expect(url).to.equal('./stub.json');
				expect(data).to.be.a(Blob);
				done();
			};

			sendBeacon('./stub.json', data);

		});
	}
	else {

		afterEach(() => stubRequest.unstub());

		it('should trigger a POST request and send x-www-form-urlencoded string', () => {

			const a = stubRequest();
			const data = {payload: 'hello'};

			sendBeacon('./stub.json', data);

			const req = a[0];
			expect(req).to.have.property('url', './stub.json');
			expect(req).to.have.property('method', 'post');
			expect(req.writeCalledWith).to.eql('payload=hello');
			expect(req.endCalled).to.be.ok();
		});
	}
});
