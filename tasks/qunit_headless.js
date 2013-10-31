
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

		phantom.create(callback(grunt, data, done, cover(data.coverage.tmp)) , {
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
				grunt.config.set('instrument', {
					files: [data.require.baseUrl + "/**//*.js"],
					options : {
						lazy : true,
						basePath : data.coverage.tmp
					}
				});
				grunt.task.run('instrument');
			}
		}

		prepareCoverage(data.coverage);

		data.require.baseUrl = data.coverage.tmp + '/' + data.require.baseUrl;

		grunt.config.set('qunit_amd_child', data);
		grunt.task.run('qunit_amd_child');

		grunt.config.set('makeReport', {
			src: data.coverage.tmp + '/*.json',
			options : {
				type : data.coverage.type || 'html',
				dir : data.coverage.out,
				print : 'detail'
			}
		});

		grunt.task.run('makeReport');
	});

};
