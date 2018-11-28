// Create a Query string
const param = require('./param.js');
const fn = value => (value === '?' ? '?' : encodeURIComponent(value));

module.exports = (o, formatter = fn) => param(o, '&', '=', formatter);
