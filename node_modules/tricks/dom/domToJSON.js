const domInstance = require('./domInstance.js');
const instanceOf = require('../object/instanceOf.js');

module.exports = node => {

	let data = {};

	// Is data a form object
	if (domInstance('form', node)) {
		data = nodeListToJSON(node.elements);
	}
	// A nodelist?
	else if (instanceOf(node, window.NodeList)) {
		data = nodeListToJSON(data);
	}
	// A single input element?
	else if (domInstance('input', node)) {
		data = nodeListToJSON([node]);
	}
	// A blob?
	else if (instanceOf(node, window.File) ||
		instanceOf(node, window.Blob) ||
		instanceOf(node, window.FileList)) {
		data = {file: node};
	}
	else {
		data = node;
	}

	// Loop through data if it's not form data it must now be a JSON object
	if (!instanceOf(data, window.FormData)) {

		for (const x in data) if (data.hasOwnProperty(x)) {

			if (instanceOf(data[x], window.FileList)) {
				if (data[x].length === 1) {
					data[x] = data[x][0];
				}
			}
			else if (domInstance('input', data[x]) && data[x].type === 'file') {
				continue;
			}
			else if (domInstance('input', data[x]) ||
				domInstance('select', data[x]) ||
				domInstance('textArea', data[x])) {
				data[x] = data[x].value;
			}
			else if (domInstance(null, data[x])) {
				data[x] = data[x].innerHTML || data[x].innerText;
			}
		}
	}

	return data;
};

// NodeListToJSON
// Given a list of elements extrapolate their values and return as a json object
function nodeListToJSON(nodelist) {

	const json = {};

	// Create a data string
	for (let i = 0; i < nodelist.length; i++) {

		const input = nodelist[i];

		// If the name of the input is empty or diabled, dont add it.
		if (input.disabled || !input.name) {
			continue;
		}

		// Is this a file, does the browser not support 'files' and 'FormData'?
		if (input.type === 'file') {
			json[input.name] = input;
		}
		else {
			json[input.name] = input.value || input.innerHTML;
		}
	}

	return json;
}
