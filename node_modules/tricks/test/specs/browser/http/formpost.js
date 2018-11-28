const formpost = require('../../../../browser/http/formpost.js');

describe('http/formpost', () => {

	const mockUrl = './mock-formpost.html';

	it('should post data to the formpost-mock', done => {

		const data = {name: 'Switch'};
		const url = `${mockUrl}?response=${encodeURIComponent(JSON.stringify(data))}&callback=?`;
		formpost(url, data, {}, response => {
			expect(response).to.eql(data);
			done();
		});
	});

	it('should clear up the iframe and any created form at the end', function(done) {

		this.timeout(5000);

		const callback_name = 'test_iframe';
		const url = `${mockUrl}?callback=?`;
		formpost(url, {}, {}, () => {
			const form = document.querySelector(`form[target="${ callback_name }"]:last-of-type`);
			const iframe = document.querySelector(`iframe[id="${ callback_name }"]:last-of-type`);
			expect(iframe.parentNode).to.be.ok();
			expect(form.parentNode).to.be.ok();
			setTimeout(() => {
				expect(window[callback_name]).to.not.be.ok();
				expect(iframe.parentNode).to.not.be.ok();
				expect(form.parentNode).to.not.be.ok();
				done();
			}, 100);
		}, callback_name);

	});
});

