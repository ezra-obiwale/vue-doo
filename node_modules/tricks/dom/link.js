const tryCatch = require('../object/tryCatch.js');
const query = require('./query.js');

module.exports = name => tryCatch(() => query(`link[rel="${ name }"]`).href);
