define([
	'amd.namespace'
], function(namespace) {
	'use strict';

	function Animation() {}

	/**
	 * Setup styles and properties on HTMLNodeElement before the animation
	 * @example
	 * ```javascript
	 * {
	 *    display: 'block',
	 *    height: 0,
	 *    paddingTop: 0,
	 *    paddingBottom: 0,
	 *    overflow: 0,
	 *    opacity: 0,
	 *    custom: ['remove', 'hidden']
	 * }
	 * ```
	 * @method _elementSetup
	 * @param {HTMLNodeElement} element target of animation
	 * @param {Object} elementsetup Setup for that element
	 * @private
	 */
	var _elementSetup = function _elementSetup(element, elementsetup) {
		for (var prop in elementsetup) {
			if (elementsetup.hasOwnProperty(prop)) {
				if (prop === 'custom') {
					if (elementsetup[prop][0] === 'remove') {
						element.removeAttribute(elementsetup[prop][1]);
					}
				} else {
					try {
						element.style[prop] = elementsetup[prop];
					} catch (ignore) {}
				}
			}
		}
	};

	/**
	 * Handle all animation and effect with RequestAnimationFrame
	 * @example
	 * ```javascript
	 * setup = {
	 *    property: 'paddingTop', // Native style property
	 *    delay: 2000, // Delay of start in ms
	 *    start: 0, // Starting value on animation
	 *    goal: 20, // End value of animation
	 *    speed: 200, // Animation speed in ms
	 *    valueprefix: '', // String prefix of calculated value
	 *    valuesuffix: 'px', // String suffix of calculated value
	 *    endTrigger: 0.5 // Smaller changes of this will indicate a target value rounding and animation's end.
	 *    callback function(t) // callback function for each animation frame. Will given the current value (t).
	 * };```
	 * @method animateIt
	 * @param {HTMLNodeElement} element target of animation
	 * @param {Object} setup Setup object of animation properties
	 * @param {Object} elementsetup Setup object of element (for change styles and properties before the animation flow)
	 * @async
	 * @chainable
	 * @return {Object} new Promise()
	 */
	Animation.prototype.animateIt = function animateIt(element, setup, elementsetup) {
		if (elementsetup !== undefined) {
			_elementSetup(element, elementsetup);
		}
		return new Promise(function(resolve) {
			var c = 0,
				t = setup.start || 0,
				f = setup.goal,
				b = t,
				rid = null,
				d = 60 * (setup.speed / 1000),
				del = (setup.delay !== undefined) ? setup.delay : 0,
				vp = (setup.valueprefix !== undefined) ? setup.valueprefix : '',
				vs = (setup.valuesuffix !== undefined) ? setup.valuesuffix : '',
				_easeIn = function(t, b, c, d) {
					return -c * (t /= d) * (t - 2) + b;
				},
				/**
				 * Run animation frame on each tick
				 * @method _animate
				 * @private
				 */
				_animate = function() {
					b = t;
					c = f - b;
					t = _easeIn(1, b, c, d);
					rid = window.requestAnimationFrame(_animate);
					element.style[setup.property] = vp + t + vs;
					if (setup.callback !== undefined) {
						setup.callback(t);
					}
					if (Math.abs(f - b) < setup.endTrigger) {
						window.cancelAnimationFrame(rid);
						if (setup.round === false) {
							element.style[setup.property] = vp + t + vs;
						} else {
							element.style[setup.property] = vp + Math.round(t) + vs;
						}
						resolve(true);
					}
				};
			window.setTimeout(function() {
				_animate();
			}, del);
		});
	},
	/**
	 * Set multiple of group-animation, check if all done and return once with a new Promise()
	 * @example
	 * ```javascript
	 * setup = {
	 *    property: 'paddingTop', // Native style property
	 *    delay: 2000, // Delay of start in ms
	 *    start: 0, // Starting value on animation
	 *    goal: 20, // End value of animation
	 *    speed: 200, // Animation speed in ms
	 *    valueprefix: '', // String prefix of calculated value
	 *    valuesuffix: 'px', // String suffix of calculated value
	 *    endTrigger: 0.5 // Smaller changes of this will indicate a target value rounding and animation's end.
	 *    callback function(t) // callback function for each animation frame. Will given the current value (t).
	 * };```
	 * @method animateThem
	 * @param {HTMLNodeElement} element target of animation
	 * @param {Object} setup Setup object of animation properties
	 * @param {Object} objsetup Setup object of element (for change styles and properties before the animation flow)
	 * @async
	 * @chainable
	 * @return {Object} new Promise()
	 */
	Animation.prototype.animateThem = function animateThem(element, setup, objsetup) {
		if (objsetup !== undefined) {
			_elementSetup(element, objsetup);
		}
		return new Promise(function(resolve) {
			var c = 0,
				animate = function animate(element, prop) {
					if (setup.hasOwnProperty(prop)) {
						Animation.prototype.animateIt(element, {
							property: prop,
							delay: setup[prop].delay,
							start: setup[prop].start,
							goal: setup[prop].goal,
							speed: setup[prop].speed,
							valueprefix: setup[prop].valueprefix,
							valuesuffix: setup[prop].valuesuffix,
							endTrigger: setup[prop].endTrigger,
							round: setup[prop].round,
							callback: setup[prop].callback
						}).then(function() {
							c += 1;
							if (c === Object.keys(setup).length) {
								resolve(this);
							}
						});
					}
				};
			for (var prop in setup) {
				animate(element, prop);
			}
		});
	};

	namespace.Animation = new Animation();
	return namespace.Animation;
});