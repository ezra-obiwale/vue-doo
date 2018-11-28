const createElement = require('../../../dom/createElement.js');

describe('dom/createElement', () => {

	it('should create a new element outside the DOM', () => {

		const elm = createElement('div');
		expect(elm.parentNode).to.not.be.ok();
	});

	it('should accept a second argument with attributes to append', () => {

		const id = 'test-id';
		const elm = createElement('div', {id});
		expect(elm.id).to.eql(id);
	});

});
