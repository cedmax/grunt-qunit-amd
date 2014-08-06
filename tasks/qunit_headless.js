/*
 * grunt-qunit-amd
 * https://github.com/cedmax/grunt-qunit-amd
 *
 * Copyright (c) 2013 cedmax
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

	var phantom = require('node-phantom');
	var runner = require('../libs/runner');
	var util = grunt.util;
	var installPhantom = require('../libs/installPhantom');
	var cover = require('../libs/coverage.js')(grunt);

	grunt.registerTask('qunit_amd_runner', function () {
		var done = this.async();
		var data = grunt.config.get('qunit_amd_runner');
		var coverage = (data.coverage && data.coverage.tmp)? cover.parse(data.coverage.tmp) : function(){};

		var config = {
			parameters: {
				'local-storage-path': '/dev/null',
				'web-security': false
			}
		};

		var launchPhantom = function(path){
			if (path) {
				config.phantomPath = path;
			}

			data.tests = grunt.file.expand(data.tests);
			phantom.create( 
				runner(
					data, 
					done, 
					coverage, 
					{ 
						head: grunt.log.subhead, 
						success: grunt.log.ok, 
						fail: grunt.log.fail, 
						error: grunt.log.error, 
						log: grunt.log.writeln
					}
				), 
				config 
			);
		};

		installPhantom(launchPhantom, grunt.log.writeln, grunt.log.fail);
	});

	grunt.registerMultiTask('qunit_amd', function() {
		if (util._.isFunction(this.data)) {
			this.data = this.data.apply(grunt, [].slice.call(arguments, 0));
		}
		var data = this.data;

		cover.instrument(data);

		grunt.config.set('qunit_amd_runner', data);
		grunt.task.run('qunit_amd_runner');

		cover.report(data);
	});

};
