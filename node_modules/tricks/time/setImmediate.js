module.exports = typeof setImmediate === 'function' ? setImmediate : (cb => setTimeout(cb, 0));
