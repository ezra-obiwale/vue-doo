/* eslint-disable */
// jsonp mock
// Find the full path of this request

var scripts = Array.prototype.slice.apply(document.querySelectorAll('script'));
var match = /([^=\/\&]+)=([^\&]+)/g;
var match_path = /mock-jsonp.js\?(.*)/;

scripts.forEach(function(script) {
	var src = script.src;
	var query, m;
	if ((query = src.match(match_path))) {
		var o = {};
		while ((m = match.exec(query[1]))) {
			o[m[1]] = decodeURIComponent(m[2]);
		}
		if (o.callback) {
			window[o.callback](o.response ? JSON.parse(o.response) : {status: 'success'});
		}
	}
});
