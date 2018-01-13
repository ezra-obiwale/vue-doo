const fs = require('fs');
const path = require('path');

function copySync(src, dest, overwrite = false) {
    if (!fs.existsSync(src) || overwrite) {
        return false;
    }

    let data = fs.readFileSync(src, 'utf-8');
    fs.writeFileSync(dest, data);
}

const base_dir = path.dirname(path.dirname(__dirname));

copySync('env.example.js', path.join(base_dir, 'env.js'));
copySync('config.prod.env.js', path.join(base_dir, 'config', 'prod.env.js'), true);