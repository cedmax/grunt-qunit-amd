/*global QUnit, test, ok, equal */

require(['Another'], function(another){
	'use strict';
	QUnit.start();

	test('module attach _gaq as global', 1, function(){
		ok(!another.b, "this should be green");
	});

});
