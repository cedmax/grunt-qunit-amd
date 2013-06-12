# grunt-qunit-amd

> Grunt plugin to run Qunit tests on your AMD libraries without having to create html pages.

## Getting Started
This plugin requires Grunt `~0.4.1` and node `< 0.10`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-qunit-amd --save-dev
```

One the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-qunit-amd');
```

## The "qunit_amd" task

### Overview
In your project's Gruntfile, add a section named `qunit_amd` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
	qunit_amd: {
    	unit: function(test){
			var config = {
				include: [
					'test/lib/helper.js',
					'test/lib/sinon-1.5.1.js'
				],
				require: {
					baseUrl: 'assets/javascripts/src',
					paths: {
						jquery: 'public/javascripts/jquery-2.0.0.min',
						mustache: 'public/javascripts/mustache',
					}
				}
			}
			if (test) {
				config.tests = ["test/assets/unit/"+test+".js"];
			} else {
				config.tests = ["test/assets/unit/*.js"];
			}
			return config;
		}
  	}
})
```

```sh
#to launch all tests:
grunt qunit_amd:unit

#to launch just one test:
grunt qunit_amd:unit:myTestFileName
```



### Options

#### options.include
Type: `Array`

An array of files to be injected in all the test suites.

#### options.tests
Type: `Array`

An array of patterns to retrieve the test files.
Test files are threated as require.js main files

sample test:
```js

require(['jquery', 'myLibrary'], function($, myLib){
	'use strict';
	QUnit.start();

	module('myLibraryTest', {
		setup: function(){
			$("<div id='domDependency'></div>").appendTo(document.body);
		},
		teardown: function(){
			document.body.innerHTML = '';
		}
	})


	test('my test', 1, function(){
		var myDiv = $('#domDependency');
		myLib.setElement(myDiv[0]);
		equal(myLib.getElement().id, 'domDependency', "everythings is fine");
	});

});
```


#### options.require
Type: `Object`

RequireJS configuration
Read the [RequireJS documentation](http://www.requirejs.org/)

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Thanks
This library exists because I've been working with these guys and I learned a lot of stuff about testing: [Marco Pracucci](https://github.com/pracucci), [Rocco Zanni](https://github.com/roccozanni), [Luca Lischetti](https://github.com/sirlisko)
