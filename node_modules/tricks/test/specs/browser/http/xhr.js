const xhr = require('../../../../browser/http/xhr.js');

describe('http/xhr', () => {

	it('should open a GET request and trigger the callback', done => {

		const json = {success: true};

		xhr('get', './stub.json', 'json', {}, {}, r => {
			expect(r).to.be.eql(json);
			done();
		});

	});

	it('should call the callback upon connection failure', done => {

		xhr('get', '/fails', 'json', {}, {}, r => {
			expect(r).to.not.be.ok();
			done();
		});

	});

	it('should return headers', done => {

		xhr('get', './stub.json', 'json', {}, {}, (r, headers) => {
			expect(headers).to.have.property('Content-Type');
			done();
		});

	});

	it('should format a response as a text', done => {

		xhr('get', './stub.json', 'text', {}, {}, r => {
			expect(r).to.be.a('string');
			done();
		});

	});
});

