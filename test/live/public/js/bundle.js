(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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
		var args = Array.prototype.slice.call(arguments);
		event.trigger('resolve', args);
	}

	function reject(){
		var args = Array.prototype.slice.call(arguments);
		event.trigger('reject', args);	
	}

	function notify(){
		var args = Array.prototype.slice.call(arguments);
		event.trigger('notify', args);		
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
},{"stupid-event":2}],2:[function(require,module,exports){
/**
 * @fileoverview Simple event system.
 * @author david@stupid-studio.com (David Adalberth Andersen)
 */

/**
 * Event
 * @constructor
 */
function Event(opts){
	/**
	 * @define {object} Collection of public methods.
	 */
	var self = {};

	/**
	 * @define {object} options for the constructor 
	 */
	var opts = opts || {};

	/**
	 * @define {object} collection the event names as
	 * an identifyer for later calls
	 */
	var event = {};

	/**
	 * @define {object} collection of precalled events
	 */
	var queue = {};

	/**
	 * On method for collection the event calls
	 * @example event.on('custom-event', function(){ //do something });
	 * @param {string} key A string identifyer
	 * @param {function} call A callback for the identifyer
	 * @config {object} event[key] Set object[key] to array if not set
	 */
	function on(key, call){
		if(!event[key]) event[key] = [];

		/** add event */
		addEvent(key, call);
		
		/** if the event has been triggered before created, then trigger it now */
		if(queue[key]) call.apply(null, queue[key]);
	}

	/**
	 * Add event to events and override if it is the same
	 * @param {string} key A string identifyer
	 * @param {function} call A callback for the identifyer
	 */
	function addEvent(key, call){
		/**
		 * @define {boolean} if the function is the same,
		 * boolean will be set to true
		 */
		var same = false;
		/**
		 * Loop through the events on key
		 * This is for comparing two anonymous
		 */
		for (var i = 0; i < event[key].length; i++) {
			/** If anonymous function is the same set boolean to true */
			if(call.toString() === event[key][i].toString()){
				same = true;
				/** override the current callback */
				event[key][i] = call;
				break;
			}
		};
		/** If the functions isnt the same, push to call stack */
		if(!same) event[key].push(call);
	}

	/**
	 * Trigger the event
	 * @example event.trigger(key, params)
	 * @param {string} key The key for event objet
	 */
	function trigger(key){
		var events = event[key];
		/**
		 * @define {array} takes the arguments and removes the first param
		 */
		var args = Array.prototype.slice.call(arguments).slice(1);
		console.log(arguments);
		/** If first argument is an array, pass it as argument */
		if(arguments.length === 2 && arguments[1].constructor == Array) args = arguments[1];
		
		if(events){
			/** Trigger the events by the current key */
			for (var i = 0; i < events.length; i++) {
				events[i].apply(null, args);
			};
		}else{
			/**
			 * If the trigger method is call before any key is added
			 * save the key and params for to be called later
			 */
			queue[key] = args;
		}
	}

	/**
	 * Public methods
	 * @public {function}
	 */
	self.on = on;
	self.trigger = trigger;

	/**
	 * @return {object} return public methods
	 */
	return self;
}

/** @export */
module.exports = Event;
},{}],3:[function(require,module,exports){
var Deferred = require('../../deferred');
// function test(){
// 	var def = Deferred();
// 	def.resolve();
// 	def.reject();
// 	return def.promise;
// }
// test().success(function(){
// 	console.log("success");
// }).error(function(){
// 	console.log("error");
// }).notify(function(){
// 	console.log("notify");
// });
var arg1 = "arg1";
var arg2 = "arg2";
var arg3 = "arg3";
function test(){
	var def = Deferred();
	setTimeout(function(){
		def.resolve(arg1, "test1");
	}, 1);
	setTimeout(function(){
		def.reject(arg2, "test2");
	}, 2);
	setTimeout(function(){
		def.notify(arg3, "test3"); 
	}, 3);
	return def.promise;
}
test().success(function(param, param2){
	console.log("success", arg1 === param, "test1" === param2);
}).error(function(param){
	// console.log("error", param, arg2);
}).notify(function(param){
	// console.log("notify", param, arg3);
});
},{"../../deferred":1}]},{},[3]);
