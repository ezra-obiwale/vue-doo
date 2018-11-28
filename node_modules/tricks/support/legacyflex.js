// Prop
const prefix = require('./prefix.js');
const CSSsupports = require('./CSSsupports.js');

const result = prefix('BoxDirection');

CSSsupports('legacyflex', result);

module.exports = result;
