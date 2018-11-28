// Browser Sniffing

const addClass = require('../dom/addClass.js');

const map = {
	seamonkey: [/Seamonkey\/\d+/],
	firefox: [/Firefox\/\d+/, /Seamonkey\/\d+/],
	chrome: [/Chrome\/\d/, /Chromium\/\d+/],
	chromium: [/Chromium\/\d+/],
	safari: [/Safari\/\d+/, /Chrom(e|ium)\/\d+/],
	opera: [/O(PR|pera)\/\d+/],
	ie: [/(;MSIE\s|Trident\/)\d+/]
};

const ua = window.navigator.userAgent;

const test = a => {
	const [match, ignore] = a;
	return match.test(ua) && !(ignore && ignore.test(ua));
};

let name;
for (const x in map) {
	if (test(map[x])) {
		name = x;
		break;
	}
}

if (name) {
	addClass(document.documentElement, name);
}

module.exports = name;
