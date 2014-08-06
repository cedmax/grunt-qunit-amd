/*global HTMLElement */

'use strict';

var phantom = {
	log: function(txt){

		if (txt instanceof HTMLElement) {
			txt = txt.outerHTML;
		}

		if (typeof txt === "object"){
			txt = JSON.stringify(txt);
		}

		if (typeof txt === "string"){
			txt = JSON.stringify(txt);
			txt = txt.substring(1, txt.length-1);
			txt = txt.replace(/\'/g, "\\'");
		}

		console.log("logger.log('"+ txt +"')");
	}
};

if (typeof module !=="undefined" && module.exports) {
	module.exports = {
		consoleFlag: function(txt) {
			var str = '';

			for (var i=0;i<txt.length;i++){
				str +='#';
			}

			return '##'+str+ '##\n# '+txt+ ' #\n##'+str+ '##';
		},
		waitFor: function(page, testFx, onReady, onFail, timeOutMillis) {
			var maxtimeOutMillis = timeOutMillis ? timeOutMillis : 3001,
				start = new Date().getTime(),
				condition = false,
				interval = setInterval(function() {
						page.evaluate(testFx, function(err, condition){
							if ((new Date().getTime() - start < maxtimeOutMillis)) {
								if (condition) {
									clearInterval(interval);
									onReady();
								}
							} else {
								if(!condition) {
									onFail();
								} else {
									clearInterval(interval);
									onReady();
								}
							}
						});
				}, 150);
		},
		evaluate: function(page, func) {
			var args = [].slice.call(arguments, 2);
			var fn = 'function() { return (' + func.toString() + ').apply(this, ' + JSON.stringify(args) + ');}';
			return page.evaluate(fn);
		}
	};
}
