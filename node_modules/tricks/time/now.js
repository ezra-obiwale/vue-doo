const f = () => (new Date()).getTime();
module.exports = Date.now || f;
