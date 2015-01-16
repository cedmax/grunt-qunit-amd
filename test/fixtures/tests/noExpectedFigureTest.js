
require(['MyLib'], function(MyLib){
	'use strict';
	QUnit.start();

	test('THIS TEST IS SUPPOSED TO FAIL if you don\'t run \'qunitConf\' task', function(){
		equal(MyLib.a, 1, "this should be green");
	});

});