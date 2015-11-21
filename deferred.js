/**
 * @fileoverview Simple deferred lib.
 * @author david@stupid-studio.com (David Adalberth Andersen)
 */

/** Import the Event system */
var Event = require('stupid-event');

/**
 * Deferred
 * @constructor
 */
function Deferred(opts){
 	/**
	 * @define {object} Collection of public methods.
	 */
	var self = {};

	/**
	 * @define {object} options for the constructor 
	 */
	var opts = opts || {};

	/**
	 * @define {object} A promise object that will be returned
	 */
	var promise = {};

	/**
	 * @define {object} Event system for controlling events
	 */
	var event = Event();
	
	/**
	 * Promise then method
	 * This is for chaining promis callbacks
	 * @example promiseFunction().then(
	 * function(){ // success }, 
	 * function(){ // rejected }, 
	 * function(){ // notify } 
	 * ).then( ... );
	 * @param {function} sucess Success callback
	 * @param {function} reject Reject callback
	 * @param {function} notify notify callback
	 * @return {object} Returns the promise object
	 */
	function promiseThen(success, reject, notify){
		/**
		 * @define {object} Return a new promise
		 */
		var def = Deferred();

		/**
		 * Resolved promise
		 * @example example
		 * @param {string} A string key for the event system
		 * @param {function} A callback when event is triggered
		 * @return {object} Returns promise object
		 */
		event.on('resolve', function(){ 
			/**
			 * If the success callback returns a promise
			 * then resolve/reject/notify that returned promise
			 */
			var promise = success();
			if(!promise) return;
			promise.success(function(){
				/** handle the returned deferred object */
				def.resolve();
			});
			promise.error(function(){
				def.reject();
			});
			promise.notify(function(){
				def.notify();
			});
		});

		/**
		 * If promise is rejected/notify trigger the callback
		 */
		event.on('reject', function(){ 
			if(reject) reject();
		});

		event.on('notify', function(){ 
			if(notify) notify();
		});

		/**
		 * @return {object} Returns a promise object
		 */
		return def.promise; 
	}

	/**
	 * Promise methods
	 * @example promise.then( //new promise ).then(...)
	 * @example promise.success(...).error(...).notify(...)
	 * @param {function} callback A callback for the promise
	 * @return {object} Return the promise
	 */
	function promiseSuccess(callback){
		event.on('resolve', callback);
		return promise;
	}

	function promiseError(callback){
		event.on('reject', callback);
		return promise;
	}

	function promiseNotified(callback){
		event.on('notify', callback);
		return promise;
	}

	/**
	 * Deferred methods to trigger the promise
	 * @example def.resolve(args)
	 * @example def.reject(args)
	 * @example def.notify(args)
	 */
	function resolve(){
		event.trigger('resolve', arguments);
	}

	function reject(){
		event.trigger('reject', arguments);	
	}

	function notify(){
		event.trigger('notify', arguments);		
	}

	/**
	 * Add the promise methods to the promise object
	 */
	promise.then = promiseThen;
	promise.success = promiseSuccess;
	promise.error = promiseError;
	promise.notify = promiseNotified;

	/**
	 * The promise object
	 * @public {object}
	 */
	self.promise = promise;

	/**
	 * Deferred public methods	
	 * @public {function}
	 */
	self.resolve = resolve;
	self.reject = reject;
	self.notify = notify;

	/**
	 * @return {object} return public methos
	 */
	return self;
}

/** @export */
module.exports = Deferred;