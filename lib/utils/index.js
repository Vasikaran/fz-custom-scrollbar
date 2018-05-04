'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
var smoothScroll = exports.smoothScroll = function smoothScroll(options) {
	var _options$endPoint = options.endPoint,
	    endPoint = _options$endPoint === undefined ? 0 : _options$endPoint,
	    _options$speed = options.speed,
	    speed = _options$speed === undefined ? 500 : _options$speed,
	    _options$duration = options.duration,
	    duration = _options$duration === undefined ? null : _options$duration,
	    _options$onComplete = options.onComplete,
	    onComplete = _options$onComplete === undefined ? false : _options$onComplete,
	    _options$cancelOnUser = options.cancelOnUserAction,
	    cancelOnUserAction = _options$cancelOnUser === undefined ? false : _options$cancelOnUser,
	    element = options.element;
	var initialScrollPosition = element.scrollTop;

	var diff = endPoint - initialScrollPosition;
	var startingTime = Date.now();
	var requestId = null;

	var scrollDuration = Math.abs(Math.round(diff / 1000 * speed));
	if (duration && scrollDuration > duration) {
		scrollDuration = duration;
	}

	var handleUserAction = void 0;
	var removeListeners = function removeListeners() {
		element.removeEventListener('wheel', handleUserAction);
		element.removeEventListener('touchstart', handleUserAction);

		if (cancelOnUserAction) {
			element.removeEventListener('keydown', handleUserAction);
			element.removeEventListener('mousedown', handleUserAction);
		} else {
			element.removeEventListener('scroll', handleUserAction);
		}
	};

	if (cancelOnUserAction) {
		handleUserAction = function handleUserAction() {
			removeListeners();
			cancelAnimationFrame(requestId);
		};
		element.addEventListener('keydown', handleUserAction);
		element.addEventListener('mousedown', handleUserAction);
	} else {
		handleUserAction = function handleUserAction(event) {
			event.preventDefault();
		};
		element.addEventListener('scroll', handleUserAction);
	}

	element.addEventListener('wheel', handleUserAction);
	element.addEventListener('touchstart', handleUserAction);

	var step = function step() {
		var timeDiff = Date.now() - startingTime;
		var t = timeDiff / scrollDuration - 1;
		var easing = t * t * t + 1;
		var scrollPosition = Math.round(initialScrollPosition + diff * easing);
		if (timeDiff < scrollDuration && scrollPosition !== endPoint) {
			element.scrollTop = scrollPosition;
			requestId = requestAnimationFrame(step);
		} else {
			element.scrollTop = endPoint;
			cancelAnimationFrame(requestId);
			removeListeners();
			typeof onComplete === 'function' && onComplete();
		}
	};
	requestId = requestAnimationFrame(step);
};