const request = require('../../../http/request.js');
const stubRequest = require('../../stubs/http.js');
const mock = JSON.stringify(require('../../stub.json'));

describe('http/request', () => {

	afterEach(() => stubRequest.unstub());

	it('should be a function', () => {
		expect(request).to.be.a('function');
	});


	it('should accept a String and make a HTTP GET Request', done => {

		// Response
		stubRequest(mock);

		const url = './stub.json';

		request(url, data => {
			expect(JSON.parse(data)).to.be.eql(JSON.parse(mock));
			done();
		});
	});

	['uri', 'url'].forEach(name => {

		it(`should use a Request Object which contains the URL, via property ${ name}`, done => {

			// Response
			stubRequest(mock);

			const p = {};
			p[name] = './stub.json';

			request(p, data => {
				expect(JSON.parse(data)).to.be.eql(JSON.parse(mock));
				done();
			});
		});
	});

	['qs', 'query'].forEach(name => {

		it(`should add query params, via property ${ name } Object`, done => {

			// Response
			const stubs = stubRequest(mock);

			const p = {
				uri: './stub.json'
			};

			p[name] = {
				name: 'Andrew'
			};

			request(p, data => {
				const stub = stubs[0];
				expect(stub).to.be.ok();
				expect(stub.method).to.equal('GET');
				expect(stub.url).to.contain('./stub.json?name=Andrew');
				expect(JSON.parse(data)).to.be.eql(JSON.parse(mock));
				done();
			});
		});
	});

	it('should trigger proxyHandler after formatting the request', done => {

		// Response
		const stubs = stubRequest(mock);
		const proxyHandler = (req, callback) => {
			req.query.name = 'Andrew';
			expect(req).to.eql(p);
			callback();
		};

		const p = {
			uri: './stub.json',
			query: {},
			proxyHandler
		};

		request(p, data => {
			const stub = stubs[0];
			expect(stub).to.be.ok();
			expect(stub.method).to.equal('GET');
			expect(stub.url).to.contain('./stub.json?name=Andrew');
			expect(JSON.parse(data)).to.be.eql(JSON.parse(mock));
			done();
		});
	});


});
