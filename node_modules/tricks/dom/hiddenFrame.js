const append = require('./append.js');
const param = require('../string/param.js');

module.exports = src => {

	const style = param({
		position: 'absolute',
		left: '-1000px',
		bottom: 0,
		height: '1px',
		width: '1px'
	}, ';', ':');

	return append('iframe', {src, style});
};
