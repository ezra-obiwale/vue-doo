const insertBefore = require('../dom/insertBefore.js');
const create = require('../dom/create.js');

// Insert Meta Tag
insertBefore(create('meta', {
	name: 'viewport',
	content: 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no'
}), document.getElementsByTagName('script')[0]);
