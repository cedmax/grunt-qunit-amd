/*global QUnit, test, ok, equal */

require(['MyLib'], function(MyLib){
	'use strict';
	QUnit.start();

	test('THIS TEST IS SUPPOSED TO FAIL!', 2, function(){
		equal(MyLib.a, 1, "this should be green");
		equal(MyLib.a, 2, "this should be red");
	});

});
