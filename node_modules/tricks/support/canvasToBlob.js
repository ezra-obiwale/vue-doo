const toBlob = require('../object/toBlob.js');

module.exports = canvasToBlob;

function canvasToBlob(callback, type, quality) {
	callback(toBlob(this.toDataURL(type, quality)));
}

if (typeof HTMLCanvasElement !== 'undefined' && !HTMLCanvasElement.prototype.toBlob) {
	Object.defineProperty(HTMLCanvasElement.prototype, 'toBlob', {
		value: canvasToBlob
	});
}
