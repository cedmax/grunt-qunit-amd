/*
 * grunt-qunit-amd
 * https://github.com/cedmax/grunt-qunit-amd
 *
 * Copyright (c) 2013 cedmax
 * Licensed under the MIT license.
 */

'use strict';

var phantom = require('node-phantom');
var fs = require('fs');

module.exports = function(grunt) {

	var callback = require('../libs/runner.js'), util = grunt.util;


	function cover(path){
		return function(file, coverage){
			if (coverage) {
				var reportSlug = file.substr(file.lastIndexOf("/")+1, file.length).replace(".js", "");
				fs.writeFileSync(path + '/'+ reportSlug+'.json', JSON.stringify(coverage, null, 4));
			}
		};
	}

	grunt.registerTask('qunit_amd_child', function () {
		var done = this.async();

		var data = grunt.config.get('qunit_amd_child');

		var coverage = (data.coverage && data.coverage.tmp)? cover(data.coverage.tmp) : function(){};

		phantom.create(callback(grunt, data, done, coverage) , {
			phantomPath:require('phantomjs').path,
			parameters: {
				'local-storage-path': '/dev/null',
				'web-security': false
			}
		});
	});

	grunt.registerMultiTask('qunit_amd', function() {
		grunt.loadTasks(__dirname + '/../node_modules/grunt-istanbul/tasks');

		if (util._.isFunction(this.data)) {
			this.data = this.data.apply(grunt, [].slice.call(arguments, 0));
		}

		var data = this.data;

		function prepareCoverage(coverage){
			if (coverage){
				var pattern = [data.require.baseUrl + "/**/*.js"];
				if (data.coverage.pathsToCover){
					data.coverage.pathsToCover.forEach(function(path){
						pattern.push(data.require.paths[path] + '/**/*.js');
					});
				}

				grunt.config.set('instrument', {
					files: pattern,
					options : {
						lazy : true,
						basePath : data.coverage.tmp
					}
				});
				grunt.task.run('instrument');
				data.require.baseUrl = data.coverage.tmp + '/' + data.require.baseUrl;
				if (data.coverage.pathsToCover){
					data.coverage.pathsToCover.forEach(function(path){
						data.require.paths[path] = data.coverage.tmp +'/'+ data.require.paths[path];
					});
				}
			}
		}

		function reportCoverage(coverage){
			if (coverage){
				grunt.config.set('makeReport', {
					src: data.coverage.tmp + '/*.json',
					options : {
						type : data.coverage.type || 'html',
						dir : data.coverage.out,
						print : 'detail'
					}
				});

				grunt.task.run('makeReport');
			}
		}

		prepareCoverage(data.coverage);

		grunt.config.set('qunit_amd_child', data);
		grunt.task.run('qunit_amd_child');

		reportCoverage(data.coverage);
	});

};
