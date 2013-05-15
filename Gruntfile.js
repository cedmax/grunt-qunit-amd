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
				jshintrc: '.jshintrc',
			}
		},
		// Configuration to be run (and then tested).
		qunit_amd: {
			unit: {
				include: ['test/fixtures/libs/helper.js'],
				tests: ["test/fixtures/tests/*.js"],
				require: {
					baseUrl: 'test/fixtures/src'
				}
			}
		}
	});

	// Actually load this plugin's task(s).
	grunt.loadTasks('tasks');
	grunt.loadNpmTasks('grunt-contrib-jshint');


	// By default, lint and run all tests.
	grunt.registerTask('default', [ 'jshint', 'qunit_amd']);

};
