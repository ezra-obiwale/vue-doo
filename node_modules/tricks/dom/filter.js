const each = require('./each.js');
const matches = require('./matches.js');

module.exports = (elements, match) => each(elements).filter(el => matches(el, match));
