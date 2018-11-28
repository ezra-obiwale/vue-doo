// Prop
const prefix = require('./prefix.js');
const CSSsupports = require('./CSSsupports.js');

const result = prefix('transform');

CSSsupports('transform', result);

module.exports = result;
