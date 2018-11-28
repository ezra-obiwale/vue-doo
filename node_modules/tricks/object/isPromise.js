'use strict';
// Is Promise
module.exports = obj => (obj && typeof obj === 'object' && 'then' in obj && typeof obj.then === 'function');
