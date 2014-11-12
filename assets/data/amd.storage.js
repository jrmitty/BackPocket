define([
	'amd.namespace'
], function(namespace) {
	'use strict';
	
	function Storage() {}

	/**
	 * Setting data into browser's local storage
	 * @method setData
	 * @param {String} key Key for stored value
	 * @param {Object} data JSON object will going to stringify and store as String
	 * @requires compatibility.polyfill.localstorage
	 * @default {Boolean} true
	 * @return {Boolean} true
	 */
	Storage.prototype.setData = function(key, data) {
		localStorage.setItem(key, JSON.stringify(data));
		return true;
	};

	/**
	 * Getting data from browser's local storage
	 * @method getData
	 * @param {String} key Key for stored value
	 * @requires compatibility.polyfill.localstorage
	 * @return {Object|Boolean} JSON parsed object | false
	 */
	Storage.prototype.getData = function(key) {
		if (localStorage.getItem(key)) {
			return JSON.parse(localStorage.getItem(key));
		}
		return false;
	};

	namespace.Storage = new Storage();
	return namespace.Storage;
});