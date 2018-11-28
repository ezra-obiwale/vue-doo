/* global _gaq */
const getScript = require('../http/getScript.js');

module.exports = tracking => {
	window._gaq = window._gaq || [];
	_gaq.push(['_setAccount', tracking]);
	_gaq.push(['_trackPageview']);

	getScript(`${document.location.protocol === 'https:' ? 'https://ssl' : 'http://www' }.google-analytics.com/ga.js`);
};
