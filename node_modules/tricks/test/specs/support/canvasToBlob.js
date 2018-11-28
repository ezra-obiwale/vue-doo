const canvasToBlob = require('../../../support/canvasToBlob.js');

describe('support/canvasToBlob', () => {

	const bool = window.Blob && window.Uint8Array;

	self[bool ? 'it' : 'xit']('should trigger the callback handler', done => {

		const canvas = document.createElement('canvas');
		const spy = sinon.spy(blob => {
			expect(blob).to.be.a(Blob);
			done();
		});

		canvasToBlob.call(canvas, spy);
	});

});

