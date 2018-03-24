const fs = require('fs');
const path = require('path');

function copySync(src, dest, overwrite) {
    if (fs.existsSync(src) && !overwrite) {
        return false;
    }

    let data = fs.readFileSync(src, 'utf-8');
    return fs.writeFileSync(dest, data);
}

const base_dir = path.dirname(path.dirname(path.dirname(__dirname)));
// existing env.example.js file
let env_example = path.join(base_dir, 'env.example.js');
// use default if not exist
if (!fs.existsSync(env_example)) {
    env_example = 'env.example.js';
}

copySync('env.example.js', path.join(base_dir, 'env.js'));
let config_dir = path.join(base_dir, 'config');
if (fs.existsSync(config_dir)){
    copySync('config.prod.env.js', path.join(base_dir, 'config', 'prod.env.js'), true);
}
