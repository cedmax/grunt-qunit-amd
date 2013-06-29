/*global QUnit, test, ok, equal, phantom, document */

require(['Another'], function(another){
	'use strict';
	QUnit.start();

	var div = document.createElement("div");

	test('module attach _gaq as global', 1, function(){
		phantom.log(div);
		phantom.log(another);
		ok(!another.b, "this should be green");
	});

});
