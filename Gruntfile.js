/*
 * grunt-qunit-amd
 * https://github.com/cedmax/grunt-qunit-amd
 *
 * Copyright (c) 2013 cedmax
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

	// Project configuration.
	grunt.initConfig({
		jshint: {
			all: [
				'Gruntfile.js',
				'tasks/*.js'
			],
			options: {
				jshintrc: '.jshintrc'
			}
		},
		qunit_amd: {
			unit: function(file){
				var config = {
					include: ['test/fixtures/libs/helper.js'],
					require: {
						baseUrl: 'test/fixtures/src'
					}
				};
				if (file) {
					config.tests = ["test/fixtures/tests/"+file+"Test.js"];
				} else {
					config.tests = ["test/fixtures/tests/*.js"];
				}
				return config;
			},
			verbose: function(file){
				var config = {
					include: ['test/fixtures/libs/helper.js'],
					require: {
						baseUrl: 'test/fixtures/src'
					},
					verbose:true,
					coverage: {
						tmp: 'tmp',
						out: 'out'
					}
				};
				if (file) {
					config.tests = ["test/fixtures/tests/"+file+"Test.js"];
				} else {
					config.tests = ["test/fixtures/tests/*.js"];
				}
				return config;
			},
			qunitConf: function(file){
				var config = {
					include: ['test/fixtures/libs/helper.js'],
					require: {
						baseUrl: 'test/fixtures/src'
					},
					qunit: {
						requireExpects: false
					},
					verbose:true,
					coverage: {
						tmp: 'tmp',
						out: 'out'
					}
				};
				if (file) {
					config.tests = ["test/fixtures/tests/"+file+"Test.js"];
				} else {
					config.tests = ["test/fixtures/tests/*.js"];
				}
				return config;
			}
		}

	});

	// Actually load this plugin's task(s).
	grunt.loadTasks('tasks');
	grunt.loadNpmTasks('grunt-contrib-jshint');


	// By default, lint and run all tests.
	grunt.registerTask('default', ['qunit_amd:verbose']);

};
