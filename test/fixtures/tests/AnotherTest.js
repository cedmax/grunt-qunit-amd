/*global QUnit, test, ok, equal, phantom, document */

require(['Another'], function(another){
	'use strict';
	QUnit.start();

	var div = document.createElement("div");
	div.innerHTML = "Let's have some random text \n multiline";

	test('module attach _gaq as global', 1, function(){
		phantom.log(div);
		phantom.log(another);
		phantom.log([1,2,3]);
		phantom.log(function(){ return "log a function"; });

		ok(!another.b, "this should be green");
	});

});
