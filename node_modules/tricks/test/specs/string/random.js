const random = require('../../../string/random.js');

describe('string/random', () => {

	it('should return a new random string everytime.', () => {
		const a = random();
		const b = random();
		expect(a).to.be.a('string');
		expect(b).to.be.a('string');
		expect(a).to.not.eql(b);
		expect(a.length > 6).to.be.ok();
	});

});
