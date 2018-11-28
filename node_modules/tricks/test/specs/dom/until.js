const until = require('../../../dom/until.js');

describe('dom/until', () => {

	it('should trigger the callback until it returns true', () => {
		const a = [1, 2, 3, 4];
		let i = 0;
		until(a, n => {
			i++;
			return n === 2;
		});
		expect(i).to.be(2);
	});

});
