const age = require('../../../time/age.js');

describe('time/age', () => {

	it('should be defined', () => {
		expect(age).to.be.a('function');
	});

	it('should return empty string if value passed is not a date', () => {

		[undefined, null, '', {}, 1].forEach(input => {
			expect(age(input)).to.equal('');
		});

	});

	it('should retrn the age of a date, e.g. "new" for "2014-06-12T13:38:48.000+10:00"', () => {

		const now = 'Thu, 12 Jun 2014 03:39:19 GMT';

		[
			['2014-06-12T13:38:48.000+10:00', 'new'],
			['2014-06-12T13:33:48.000+10:00', '5 minutes ago'],
			['2014-06-12T07:33:48.000+10:00', '6 hours ago'],
			['2014-06-10T07:50:00.000+10:00', '2 days ago'],
			['2014-05-21T10:52:00.000+10:00', '3 weeks ago'],
			['2014-05-14T03:39:00.000+10:00', '1 month ago'],
			['2013-06-20T19:00:17.130+10:00', '11 months ago'],
			['2011-11-11T15:50:00.000+11:00', '2 years ago']

		].forEach(test => {
			const [input, output] = test;
			expect(age(input, now)).to.equal(output);
		});

	});
});
