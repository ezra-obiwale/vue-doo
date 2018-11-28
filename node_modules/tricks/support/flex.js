// Supports Flex
const prefix = require('./prefix.js');
const CSSsupports = require('./CSSsupports.js');

const result = prefix('FlexWrap');

CSSsupports('flex', result);

module.exports = result;
