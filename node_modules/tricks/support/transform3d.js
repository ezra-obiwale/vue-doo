// Prop
const prefix = require('./prefix.js');
const CSSsupports = require('./CSSsupports.js');

const result = prefix('perspective');
CSSsupports('transform3d', result);

module.exports = result;
