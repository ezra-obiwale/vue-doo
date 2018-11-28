// Phonegap/Cordova Device
const mobile = require('./mobile.js');

const filesystem = /^file:\/{3}[^/]/i.test(window.location.href);

module.exports = (mobile && filesystem);
