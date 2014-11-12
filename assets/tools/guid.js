define([
	'namespace'
], function(namespace) {
	'use strict';

	function Guid() {}

	/**
	 * 128-bit, 32 chars long Globally Unique Identifier generator
	 * It used to make a guaranteed unique ID
	 * @method getGuid
	 * @return {String} string GUID
	 */
	Guid.prototype.getGuid = function() {
		function s4() {
			return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
		}
		return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
	};

	namespace.Guid = new Guid();
	return namespace.Guid;
});