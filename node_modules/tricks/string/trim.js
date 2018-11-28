const white_space = /^\s+|\s+$/g;
module.exports = (str, trim) => (str || '').replace(trim || white_space, '');
