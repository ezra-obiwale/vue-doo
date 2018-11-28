const isDom = require('../../../dom/isDom.js');

describe('dom/isDom', () => {

	it('should return true if object is part of the DOM', () => {

		const elm = document.createElement('div');
		expect(isDom(elm)).to.be.ok();
		expect(isDom(document.body)).to.be.ok();
		expect(isDom(document)).to.be.ok();
		expect(isDom(document.documentElement)).to.be.ok();
		expect(isDom(window)).to.be.ok();

	});

	it('should return true if object is not part of the DOM, i.e. pure javascript', () => {

		expect(isDom({})).to.not.be.ok();
		expect(isDom('hello')).to.not.be.ok();
		expect(isDom(undefined)).to.not.be.ok();
		expect(isDom(1)).to.not.be.ok();
		expect(isDom([])).to.not.be.ok();

	});

});
