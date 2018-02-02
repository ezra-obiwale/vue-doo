let env = {
  NODE_ENV: '"production"'
};

try {
  // get custom environment variables
  let custom = require('../env');
  if (custom) {
    // add them to the real environment variables
    for (let key in custom) {
      env[key] = '"' + (process.env[key] || custom[key]) + '"';
    }
  }
}
catch (e) {
  console.error('No env file found in project root directory');
}

module.exports = env;
