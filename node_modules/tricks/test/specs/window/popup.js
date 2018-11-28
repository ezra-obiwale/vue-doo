const popup = require('../../../window/popup.js');

describe('window/popup', () => {

	const _open = window.open;
	const url = 'https://doma.in/oauth/auth';

	after(() => {
		window.open = _open;
	});

	it('should call window.open with url', () => {

		const spy = sinon.spy(_url => {
			expect(url).to.eql(_url);
		});

		window.open = spy;

		popup(url, 'https://redirect.uri/path', {});

		expect(spy.calledOnce).to.be.ok();
	});

	it('should set top and left when width and height are provided', () => {

		const spy = sinon.spy((_url, name, options) => {
			expect(options).to.contain('top=');
			expect(options).to.contain('left=');
		});

		window.open = spy;

		popup(url, 'https://redirect.uri/path', {width: 500, height: 500});

		expect(spy.calledOnce).to.be.ok();
	});
});
