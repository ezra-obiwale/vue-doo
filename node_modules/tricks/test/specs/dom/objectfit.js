const objectfit = require('../../../dom/objectfit.js');

describe('dom/objectfit', () => {

	it('should return coordinates for positioning an element within another element covering it completely', () => {

		const [W, H] = [200, 100];
		const [w, h] = [100, 100];

		const response = objectfit(w, h, W, H);
		expect(response).to.be.an('array');
		expect(response).to.eql([0, -50, 200, 200]);
	});

});
