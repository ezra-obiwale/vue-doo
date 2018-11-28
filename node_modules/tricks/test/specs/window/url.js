const url = require('../../../window/url.js');

describe('window/url', () => {

	const testLocationProtocol = window.location.protocol;
	let testLocationRoot = window.location.origin || (`${testLocationProtocol }//${ window.location.host}`);
	const testLocationDir = window.location.pathname.replace(/\/[^/]+$/, '/');
	const testLocationFilename = 'redirect.html';

	if (testLocationRoot === `${testLocationProtocol }//` && testLocationProtocol !== 'file:') {
		// Fix windows issue where origin does not include file:///d:/
		// 'origin':'d://'
		// 'href':'d:/Projects/tricks/specs/index.html',
		// 'hostname':'',
		// 'protocol':'d:'
		testLocationRoot = testLocationProtocol;
	}

	it('should return current URL, if no URL is given', () => {

		const path = url().href;
		expect(path).to.equal(window.location.href);

	});

	it('should return a full URL, if a full URL is given', () => {

		const path = `http://test/${ testLocationFilename}`;
		const _url = url(path);
		expect(_url.href).to.equal(path);
		expect(_url.hostname).to.equal('test');
		expect(_url.protocol).to.equal('http:');
	});

	it('should return a full URL, if a protocol-less URL is given', () => {
		const _url = `//test/${ testLocationFilename}`;
		const path = url(_url).href;
		expect(path).to.equal((testLocationProtocol + _url).replace('////', '//'));
	});

	it('should return a full URL, if a base-path is given', () => {
		const _url = `/test/${ testLocationFilename}`;
		const path = url(_url).href;
		expect(path).to.equal(testLocationRoot + _url);
	});

	it('should return a full URL, if a relative-path is given', () => {
		const _url = `./${ testLocationFilename}`;
		const path = url(_url).href;
		expect(path).to.equal(testLocationRoot + (testLocationDir + _url.replace('./', '')));
	});

	it('should return a full URL, if a relative-ascendant-path is given', () => {
		const _url = `../${ testLocationFilename}`;
		const path = url(_url).href;
		expect(path).to.equal(testLocationRoot + testLocationDir.replace(/\/[^/]+\/$/, '/') + testLocationFilename);
	});

	it('should return a full URL, if a deeper relative-ascendant-path is given', () => {
		const _url = `../../${ testLocationFilename}`;
		const path = url(_url).href;
		expect(path).to.equal(testLocationRoot + testLocationDir.replace(/\/[^/]+\/$/, '/').replace(/\/[^/]+\/$/, '/') + testLocationFilename);
	});

	it('should return a full URL, if a complex relative-ascendant-path is given', () => {
		const _url = `../../asdasd/asdasd/../../${ testLocationFilename}`;
		const path = url(_url).href;
		expect(path).to.equal(testLocationRoot + testLocationDir.replace(/\/[^/]+\/$/, '/').replace(/\/[^/]+\/$/, '/') + testLocationFilename);
	});

});
