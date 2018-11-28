const jsonp = require('../../../../browser/http/jsonp.js');

describe('http/jsonp', () => {

	const jsonpMockUrl = './mock-jsonp.js';

	it('should trigger a callback with a response', done => {
		const json = {success: 'ok'};
		const url = `${jsonpMockUrl}?response=${encodeURIComponent(JSON.stringify(json))}&callback=?`;
		jsonp(url, response => {
			expect(response).to.eql(json);
			done();
		});
	});

	it('should return a response even if the endpoint returned an error', done => {
		const url = `404/${jsonpMockUrl}?callback=?`;
		jsonp(url, response => {
			expect(response).to.not.be.ok();
			done();
		});
	});

	it('should clearup the script tag reference', done => {
		const url = `${jsonpMockUrl}?callback=?`;
		const script = jsonp(url, () => {
			setTimeout(() => {
				expect(script.parentNode).to.not.be.ok();
				done();
			}, 0);
		});

		// Find the script tag
		expect(script.parentNode).to.be.ok();
	});
});

