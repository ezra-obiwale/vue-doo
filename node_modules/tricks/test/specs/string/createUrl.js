const createUrl = require('../../../string/createUrl.js');

describe('string/createUrl', () => {

	it('should append arguments to a url', () => {

		const value = createUrl('https://api.com/path?q=%22root%22+in+parents+and+trashed=false&maxResults=5', {access_token: 'token', path: 'path'});

		expect(value).to.eql('https://api.com/path?q=%22root%22+in+parents+and+trashed=false&maxResults=5&access_token=token&path=path');

	});

	it('should overwrite existing arguments in a url', () => {

		const value = createUrl('https://api.com/path?q=%22root%22+in+parents+and+trashed=false&maxResults=5', {q: 'word', access_token: 'token'});

		expect(value).to.eql('https://api.com/path?q=word&maxResults=5&access_token=token');

	});

});
