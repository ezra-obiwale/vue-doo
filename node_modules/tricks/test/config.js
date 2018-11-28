/* eslint-disable */

// Test file
mocha.ui('bdd');

// set our baseURL reference path
System.config({
	paths: {
		'babel': 'node_modules/babel-core/browser.js'
	},
	baseURL: './',
	// or 'traceur' or 'typescript'
	transpiler: 'babel',
	// or traceurOptions or typescriptOptions
	babelOptions: {}
});

// loads /app/main.js
System['import']('test/specs/index.js').then(function() {
	if (window.mochaPhantomJS) mochaPhantomJS.run();
	else mocha.run();
});
