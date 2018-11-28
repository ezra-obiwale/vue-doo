/*eslint no-loop-func: 0*/
const cors = require('../../../support/cors.js');
const flex = require('../../../support/flex.js');
const legacyflex = require('../../../support/legacyflex.js');
const mobile = require('../../../support/mobile.js');
const svg = require('../../../support/svg.js');
const smil = require('../../../support/smil.js');
const touch = require('../../../support/touch.js');
const transform = require('../../../support/transform.js');
const transform3d = require('../../../support/transform3d.js');
const video = require('../../../support/video.js');
const videoAutoplay = require('../../../support/video.autoplay.js');


const obj = {
	cors,
	flex,
	legacyflex,
	mobile,
	smil,
	svg,
	touch,
	transform,
	transform3d,
	video,
	'video.autoplay': videoAutoplay
};

for (const name in obj) {

	const bool = obj[name];

	describe(`support/${ name}`, () => {

		it(`should return Boolean to indicate it supports ${ name}`, () => {
			expect(bool).to.be.a('boolean');
		});

	});
}


const requestAnimationFrame = require('../../../support/requestAnimationFrame.js');
const canvasToBlob = require('../../../support/canvasToBlob.js');
const getUserMedia = require('../../../support/getUserMedia.js');

const fns = {
	requestAnimationFrame,
	canvasToBlob,
	getUserMedia
};

for (const name in fns) {

	const fn = fns[name];

	describe(`support/${ name}`, () => {

		it('should return a Function', () => {
			expect(fn).to.be.a('function');
		});

	});
}
