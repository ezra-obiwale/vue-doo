const inviewport = require('../../../dom/inviewport.js');

describe('dom/inviewport', () => {

	let elm;

	beforeEach(() => {
		elm = document.createElement('div');
		elm.style.cssText = 'width:100px;height:100px;position:absolute;';
		document.body.appendChild(elm);
	});

	afterEach(() => {
		// Clean up
		document.body.removeChild(elm);
	});

	it('should return 1 for being in the viewport', () => {

		elm.style.cssText += 'top:0;left:0px;';
		expect(inviewport(elm)).to.be.eql(1);

	});


	it('should return 0 for being outside the viewport', () => {

		elm.style.cssText += 'top:0;left:-100px;';
		expect(inviewport(elm)).to.be.eql(0);

	});

	it('should return 0.5 for being half in the viewport', () => {

		elm.style.cssText += 'top:0;left:-50px;';
		expect(inviewport(elm)).to.be.eql(0.5);

	});

});
