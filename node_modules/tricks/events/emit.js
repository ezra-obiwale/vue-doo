// on.js
// Listen to events, this is a wrapper for addEventListener
const each = require('../dom/each.js');
const createEvent = require('./createEvent.js');

// Return
module.exports = (elements, eventname) => each(elements, el => el.dispatchEvent(createEvent(eventname)));

