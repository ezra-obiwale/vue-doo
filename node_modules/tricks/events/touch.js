// Standardizes touch events
// Calculate the difference from the starting position and the end position.
// Returns a gesture object given

const on = require('./on.js');
const each = require('../dom/each.js');

// Does this support pointer events?
const pointerEnabled = window.navigator.pointerEnabled;
const eventMoveTypes = pointerEnabled ? 'MSPointerMove pointerMove' : 'mousemove touchmove';
const eventStartTypes = pointerEnabled ? 'MSPointerDown pointerDown' : 'mousedown touchstart';
const eventEndTypes = pointerEnabled ? 'MSPointerUp pointerUp' : 'mouseup touchend touchcancel';

// Touch
// @param callback function - Every touch event fired
// @param complete function- Once all touch event ends
module.exports = (elements, onmove, onstart, onend) => {

	// Store callbacks, and previous pointer position
	const cb = {};
	const mv = {};
	const fin = {};

	on(document, eventMoveTypes, moveEvent => {

		// Fix Android not firing multiple moves
		// if (e.type.match(/touch/i)) {
		// 	e.preventDefault();
		// }

		// Pointer/Mouse down?
		if (voidEvent(moveEvent)) {
			// The mouse buttons isn't pressed, kill this
			return;
		}

		// trigger the call
		const i = moveEvent.pointerId || 0;
		const handler = cb[i];

		if (handler && typeof(handler) === 'function') {

			const prevEvent = mv[i];

			// Extend the Event Object with 'gestures'
			gesture(moveEvent, prevEvent);

			// Trigger callback
			handler(moveEvent, prevEvent);
		}

		mv[i] = moveEvent;
	});

	on(document, eventEndTypes, e => {

		const i = e.pointerId || 0;
		cb[i] = null;

		if (e.type === 'touchend' || e.type === 'touchcancel') {
			e = mv[i];
		}

		const handler = fin[i];
		if (handler) {
			handler(e);
		}

		fin[i] = null;
	});

	// loop through and add events
	each(elements, element => {

		// bind events
		// on(element, 'touchend', e => {
		// 	console.log('el:touchend');
		// 	console.log(e);
		// });

		on(element, 'selectstart', () => false);

		on(element, eventStartTypes, startEvent => {

			// default pointer ID
			const i = startEvent.pointerId || 0;

			// Add Gestures to event Object
			gesture(startEvent);

			mv[i] = startEvent;
			cb[i] = (moveEvent, prevMoveEvent) => {
				onmove.call(element, moveEvent, prevMoveEvent, startEvent);
			};

			if (onend) {
				fin[i] = endEvent => {

					// Add Gestures to event Object
					gesture(endEvent, startEvent);

					// fire complete callback
					onend.call(element, endEvent, startEvent);
				};
			}

			// trigger start
			if (onstart) {
				onstart.call(element, startEvent);
			}
		});
	});
};

function gesture(currEvent, prevEvent) {

	// Response Object
	currEvent.gesture = {};

	if (currEvent && currEvent.touches && currEvent.touches.length > 0) {
		currEvent.gesture.touches = currEvent.touches;
	}
	else {
		currEvent.gesture.touches = [currEvent];
	}

	currEvent.gesture.screenX = currEvent.gesture.touches[0].screenX;
	currEvent.gesture.screenY = currEvent.gesture.touches[0].screenY;

	if (!('screenX' in currEvent)) {
		currEvent.screenX = currEvent.gesture.screenX;
	}
	if (!('screenY' in currEvent)) {
		currEvent.screenY = currEvent.gesture.screenY;
	}

	// If the second parameter isn't defined then we're unable to define getures
	// But if it is then whoop, lets go.
	if (prevEvent) {

		currEvent.gesture.deltaTime = (currEvent.timeStamp - prevEvent.timeStamp);

		const dx = currEvent.gesture.deltaX = currEvent.gesture.screenX - prevEvent.gesture.screenX;
		const dy = currEvent.gesture.deltaY = currEvent.gesture.screenY - prevEvent.gesture.screenY;

		// Which is the best direction for the gesture?
		if (Math.abs(dy) > Math.abs(dx)) {
			currEvent.gesture.direction = (dy > 0 ? 'up' : 'down');
		}
		else {
			currEvent.gesture.direction = (dx > 0 ? 'right' : 'left');
		}

		// Distance
		currEvent.gesture.distance = Math.sqrt((dx * dx) + (dy * dy));

		// Velocity
		currEvent.gesture.velocity = currEvent.gesture.distance / currEvent.gesture.deltaTime;
	}
}

module.exports.gesture = gesture;

function voidEvent(event) {
	const type = event.pointerType || event.type;
	return (type.match(/mouse/i) && (event.which || event.buttons) !== 1);
}
