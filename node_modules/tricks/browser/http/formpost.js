// Post
// Send information to a remote location using the post mechanism
// @param string uri path
// @param object data, key value data to send
// @param function callback, function to execute in response

const append = require('../../dom/append.js');
const attr = require('../../dom/attr.js');
const domInstance = require('../../dom/domInstance.js');
const createElement = require('../../dom/createElement.js');
const globalCallback = require('../../events/globalCallback.js');
const toArray = require('../../array/toArray.js');
const instanceOf = require('../../object/instanceOf.js');
const on = require('../../events/on.js');
const emit = require('../../events/emit.js');
const setImmediate = require('../../time/setImmediate.js');

module.exports = (url, data, options, callback, callback_name, timeout = 60000) => {

	let timer;
	let bool = 0;
	const cb = r => {
		if (!(bool++)) {
			if (timer) {
				clearTimeout(timer);
				timer = null;
			}
			callback(r);

			// Trigger onsubmit on the form.
			// Typically this isn't activated until afterwards
			emit(form, 'submit');

			// The setImmediate fixes the test runner in phantomjs
			setImmediate(() => frame.parentNode.removeChild(frame));
		}

		return true;
	};

	// What is the name of the callback to contain
	// We'll also use this to name the iframe
	callback_name = globalCallback(cb, callback_name);

	/////////////////////
	// Create the FRAME
	/////////////////////

	const frame = createFrame(callback_name);

	// Override callback mechanism. Triggger a response onload/onerror
	if (options && options.callbackonload) {

		// Onload is being fired twice
		frame.onload = cb.bind(null, {
			response: 'posted',
			message: 'Content was posted'
		});
	}


	/////////////////////
	// Set a timeout
	/////////////////////

	if (timeout) {
		timer = setTimeout(cb.bind(null, new Error('timeout')), timeout);
	}


	/////////////////////
	// Create a form
	/////////////////////

	const form = createFormFromData(data);

	// The URL is a function for some cases and as such
	// Determine its value with a callback containing the new parameters of this function.
	url = url.replace(new RegExp('=\\?(&|$)'), `=${ callback_name }$1`);

	// Set the target of the form
	attr(form, {
		method: 'POST',
		target: callback_name,
		action: url
	});

	form.target = callback_name;

	// Submit the form
	// Some reason this needs to be offset from the current window execution
	setTimeout(() => {
		form.submit();
	}, 100);
};


function createFrame(callback_name) {
	let frame;

	try {
		// IE7 hack, only lets us define the name here, not later.
		frame = createElement(`<iframe name="${ callback_name }">`);
	}
	catch (e) {
		frame = createElement('iframe');
	}

	// Attach the frame with the following attributes to the document body.
	attr(frame, {
		name: callback_name,
		id: callback_name,
		style: 'display:none;'
	});

	document.body.appendChild(frame);

	return frame;
}


function createFormFromData(data) {

	// This hack needs a form
	let form = null;
	const reenableAfterSubmit = [];
	let i = 0;
	let x = null;


	// If we are just posting a single item
	if (domInstance('input', data)) {
		// Get the parent form
		form = data.form;

		// Loop through and disable all of its siblings
		toArray(form.elements).forEach(input => {
			if (input !== data) {
				input.setAttribute('disabled', true);
			}
		});

		// Move the focus to the form
		data = form;
	}

	// Posting a form
	if (domInstance('form', data)) {
		// This is a form element
		form = data;

		// Does this form need to be a multipart form?
		toArray(form.elements).forEach(input => {
			if (!input.disabled && input.type === 'file') {
				form.encoding = form.enctype = 'multipart/form-data';
				input.setAttribute('name', 'file');
			}
		});
	}
	else {
		// Its not a form element,
		// Therefore it must be a JSON object of Key=>Value or Key=>Element
		// If anyone of those values are a input type=file we shall shall insert its siblings into the form for which it belongs.
		for (x in data) if (data.hasOwnProperty(x)) {
			// Is this an input Element?
			if (domInstance('input', data[x]) && data[x].type === 'file') {
				form = data[x].form;
				form.encoding = form.enctype = 'multipart/form-data';
			}
		}

		// Do If there is no defined form element, lets create one.
		if (!form) {
			// Build form
			form = append('form');

			// Bind the removal of the form
			on(form, 'submit', () => {
				setImmediate(() => {
					form.parentNode.removeChild(form);
				});
			});
		}
		else {
			// Bind the clean up of the existing form.
			on(form, 'submit', () => {
				setImmediate(() => {
					reenableAfterSubmit.forEach(input => {
						if (input) {
							input.setAttribute('disabled', false);
							input.disabled = false;
						}
					});

					// Reset, incase this is called again.
					reenableAfterSubmit.length = 0;
				});
			});
		}

		let input;

		// Add elements to the form if they dont exist
		for (x in data) if (data.hasOwnProperty(x)) {

			// Is this an element?
			const el = (domInstance('input', data[x]) || domInstance('textArea', data[x]) || domInstance('select', data[x]));

			// Is this not an input element, or one that exists outside the form.
			if (!el || data[x].form !== form) {

				// Does an element have the same name?
				let inputs = form.elements[x];
				if (input) {
					// Remove it.
					if (!instanceOf(inputs, window.NodeList)) {
						inputs = [inputs];
					}

					for (i = 0; i < inputs.length; i++) {
						inputs[i].parentNode.removeChild(inputs[i]);
					}

				}

				// Create an input element
				input = append('input', {
					type: 'hidden',
					name: x
				}, form);

				// Does it have a value attribute?
				if (el) {
					input.value = data[x].value;
				}
				else if (domInstance(null, data[x])) {
					input.value = data[x].innerHTML || data[x].innerText;
				}
				else {
					input.value = data[x];
				}

			}

			// It is an element, which exists within the form, but the name is wrong
			else if (el && data[x].name !== x) {
				data[x].setAttribute('name', x);
				data[x].name = x;
			}
		}

		// Disable elements from within the form if they weren't specified
		toArray(form.elements).forEach(input => {

			// Does the same name and value exist in the parent
			if (!(input.name in data) && input.getAttribute('disabled') !== true) {
				// Disable
				input.setAttribute('disabled', true);

				// Add re-enable to callback
				reenableAfterSubmit.push(input);
			}
		});
	}

	return form;
}
