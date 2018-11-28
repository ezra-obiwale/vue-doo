const toDate = require('../../../time/toDate.js');

describe('time/toDate', () => {

	it('should return null string if value passed is not a date', () => {

		[undefined, '', {}].forEach(input => {
			const output = toDate(input);
			expect(output).to.be.a(Date);
			expect(output.toString()).to.eql('Invalid Date');
		});

	});

	it('should return a date object from a string from an ISO', () => {

		expect(toDate('2014-06-12T13:38:48.000+10:00')).to.be.a(Date);

	});

});
