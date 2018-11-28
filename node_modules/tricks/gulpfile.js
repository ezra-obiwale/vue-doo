'use strict';

const gulp = require('gulp');
const mochaPhantomJS = require('gulp-mocha-phantomjs');
const fs = require('fs');

const browserify = require('browserify');
const babelify = require('babelify');
const buffer = require('vinyl-buffer');
const source = require('vinyl-source-stream');
const sourcemaps = require('gulp-sourcemaps');
const util = require('gulp-util');

const port = 8080;
const localhost = require('localhost')('./');

const scripts_to_watch = ['**/*.js', '!node_modules/**/*', '!test/components/**/*', '!test/bundle.js', '!test/specs/index.js'];

gulp.task('localhost', () => {
	localhost.listen(port);
	util.log('Listening on port', util.colors.cyan(port));
});

gulp.task('test', ['bundle'], testSpecs('test/bundle.html'));

gulp.task('index_tests', () => {
	const root = `${__dirname.replace(/\\/g, '/') }/test/specs/`;

	// for the given files in the test directory, create an index
	return gulp.src(['test/specs/**/*.js', '!test/specs/index.js'], (err, files) => {
		// Write line to the index file
		const index = files.map(name => `require('${ name.replace(root, './') }');`);

		fs.writeFileSync('test/specs/index.js', index.join('\n'));
	});
});

gulp.task('watch', ['localhost'], () => gulp.watch(scripts_to_watch, {interval: 500}, ['test']));

gulp.task('close', () => localhost.close());

gulp.task('bundle', ['index_tests'], () =>

	// Package up the specs directory into a single file called config.js
	browserify('./test/setup_bundle.js', {debug: true, paths: './'})
		.transform(babelify, {
			presets: ['es2015',
				['env', {
					include: ['es6.object.assign', 'es6.promise']
				}]
			],
			plugins: ['transform-object-assign'] //add-module-exports allows mixing of commonJs and ES6 exports
		})
		.bundle()
		.on('error', util.log.bind(util, 'Browserify Error'))
		.pipe(source('./bundle.js'))
		.pipe(buffer())
		.pipe(sourcemaps.init({loadMaps: true}))
		.pipe(sourcemaps.write('./'))
		.pipe(gulp.dest('./test/'))
);

gulp.task('watch_bundle', () => gulp.watch(scripts_to_watch, {interval: 500}, ['bundle']));

gulp.task('default', ['localhost', 'test'], () => {
	util.log(`Closing localhost:${ port}`);
	localhost.close();
});

function testSpecs(path) {
	return () => {
		path = `http://localhost:${port}/${path}`;
		const stream = mochaPhantomJS();
		stream.write({path, reporter: 'spec'});
		stream.end();
		return stream;
	};
}
