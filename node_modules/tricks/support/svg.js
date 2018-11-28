// SVG Capable
const CSSsupports = require('./CSSsupports.js');
const bool = !!document.createElementNS;
CSSsupports('svg', bool);
module.exports = bool;
