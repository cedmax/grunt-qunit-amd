/*global console, stop, start */

(function(w){
	'use strict';

	w.test = w.test || {};

	w.test.fireEvent = function(element, eventName) {

		if (element.on) {
			element = element[0];
		}
		if (typeof(element)==='string'){
			element = document.getElementById(element);
		}

		var opt = {
			pointerX: 0,
			pointerY: 0,
			button:  0,
			ctrlKey:  false,
			altKey:   false,
			shiftKey: false,
			metaKey: false,
			bubbles: true,
			cancelable: true
		};

		var src = arguments[2] || { };
		for (var property in src) {
			if (src.hasOwnProperty(property)) {
				opt[property] = src[property];
			}
		}

		if (document.createEvent) {
			var evt = document.createEvent('MouseEvents');
			evt.initMouseEvent(
				eventName,
				opt.bubbles,
				opt.cancelable,
				document.defaultView,
				opt.button,
				opt.pointerX,
				opt.pointerY,
				opt.pointerX,
				opt.pointerY,
				opt.ctrlKey,
				opt.altKey,
				opt.shiftKey,
				opt.metaKey,
				opt.button,
				element
			);
			for (var propt in opt) {
				if (opt.hasOwnProperty(propt) && !evt[propt]) {
					evt[propt] = opt[propt];
				}
			}
			element.dispatchEvent(evt);
		} else {
			opt.clientX = opt.pointerX;
			opt.clientY = opt.pointerY;

			var eventObj = document.createEventObject();
			for (var prop in opt) {
				if (opt.hasOwnProperty(prop)) {
					eventObj[prop] = opt[prop];
				}
			}
			element.fireEvent('on' + eventName, eventObj);
		}
	};

	w.test.setDevice = function(match){
		var oldMatch = String.prototype.match;
		this.restore = function(){
			String.prototype.match = oldMatch;
		};

		this.set = function(device){
			match = device;
		};

		String.prototype.match = function(regex){
			if (regex === match) {
				return true;
			} else {
				return oldMatch.call(this, regex);
			}
		};

		return this;
	};

	w.test.subscribeTo = function(eventName, stub){
		define(eventName + 'TestModule', function(){
			return function(sandbox){
				return {
					init:function(){
						sandbox.subscribe(eventName, stub);
					}
				};
			};
		});
	};

	w.test.loadSubscription = function(events, callback){
		if (typeof events === "string") {
			events = [events];
		}

		events = events.map(function(evt){
			return evt+"TestModule";
		});

		events.unshift('core/coreAMD');

		stop();
		require(events, function(core) {
			start();
			events.shift();
			events.forEach(function(eventName){
				core.start(eventName);
			});
			callback();
		});
	};

	w.test.killSubscription = function(events) {
		if (typeof events === "string") {
			events = [events];
		}

		events = events.map(function(evt){
			return evt+"TestModule";
		});

		stop();
		require(['core/coreAMD'], function(core) {
			start();
			events.forEach(function(eventName){
				core.stop(eventName);
			});
		});
	};

	w.test.log = function(txt) {
		console.log('### ' + txt + ' ###');
	};

})(this);
