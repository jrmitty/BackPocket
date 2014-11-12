define([
	'namespace'
], function(namespace) {
	'use strict';

	function EventHandlers() {}

	/**
	 * Cross-browser supported DOMContentLoaded event handler. Watching the readystage and/or loading events, and able to run in async environment too.
	 * @method contentLoadedEvent
	 * @param {Function} fn function what will be called when done
	 */
	EventHandlers.prototype.contentLoadedEvent = function(fn) {

		var done = false,
			top = true,
			win = window,
			doc = win.document,
			root = doc.documentElement,

			add = doc.addEventListener ? 'addEventListener' : 'attachEvent',
			rem = doc.addEventListener ? 'removeEventListener' : 'detachEvent',
			pre = doc.addEventListener ? '' : 'on',
			/**
			 * contentLoadedEvent init method
			 * @method init
			 * @private
			 */
			init = function(e) {
				if (e.type === 'readystatechange' && doc.readyState !== 'complete') {
					return;
				}
				(e.type === 'load' ? win : doc)[rem](pre + e.type, init, false);
				if (!done && (done = true)) {
					fn.call(win, e.type || e);
				}
			},
			/**
			 * contentLoadedEvent poll method
			 * @method poll
			 * @private
			 */
			poll = function() {
				try {
					root.doScroll('left');
				} catch (e) {
					setTimeout(poll, 50);
					return;
				}
				init('poll');
			};

		if (doc.readyState === 'complete') {
			fn.call(win, 'lazy');
		} else {
			if (doc.createEventObject && root.doScroll) {
				try {
					top = !win.frameElement;
				} catch (ignore) {}
				if (top) {
					poll();
				}
			}
			doc[add](pre + 'DOMContentLoaded', init, false);
			doc[add](pre + 'readystatechange', init, false);
			win[add](pre + 'load', init, false);
		}
	};

	namespace.EventHandlers = new EventHandlers();
	return namespace.EventHandlers;
});