const CSSsupports = require('./CSSsupports.js');

const result = ('ontouchstart' in window);

CSSsupports('touch', result);

module.exports = result;
