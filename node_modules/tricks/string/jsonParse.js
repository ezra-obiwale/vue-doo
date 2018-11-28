const tryCatch = require('../object/tryCatch.js');
module.exports = str => tryCatch(() => JSON.parse(str));
