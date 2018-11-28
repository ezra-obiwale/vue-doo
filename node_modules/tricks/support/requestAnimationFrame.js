// requestAnimationFrame polyfill
window.requestAnimationFrame =
	window.requestAnimationFrame ||
	window.webkitRequestAnimationFrame ||
	window.mozRequestAnimationFrame ||
	window.oRequestAnimationFrame ||
	window.msRequestAnimationFrame ||
	(callback => setTimeout(callback, 1000 / 60));

module.exports = window.requestAnimationFrame.bind(window);
