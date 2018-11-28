const attr = require('../../../dom/attr.js');

describe('dom/attr', () => {

	it('should apply attributes to an element', () => {
		const el = document.createElement('div');
		attr(el, {id: 'test'});
		expect(el.id).to.eql('test');
	});

	it('should apply attributes to a collection of elements', () => {
		const el = document.createElement('div');
		attr([el], {id: 'test'});
		expect(el.id).to.eql('test');
	});

	it('should accept functions and bind them as listeners to the element', () => {
		const clickHandler = () => {};
		const el = document.createElement('div');
		attr([el], {
			onclick: clickHandler
		});
		expect(el.onclick).to.eql(clickHandler);
	});

});
