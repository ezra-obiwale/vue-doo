let env = {
  NODE_ENV: '"production"'
};

try {
  let custom = require('../env');
  if (custom) {
    for (let key in custom) {
      env[key] = '"' + custom[key] + '"';
    }
  }
}
catch (e) {
  console.error('No env file found in project root directory');
}

module.exports = env;
