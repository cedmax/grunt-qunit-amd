
/*
 * grunt-qunit-amd
 * https://github.com/cedmax/grunt-qunit-amd
 *
 * Copyright (c) 2013 cedmax
 * Licensed under the MIT license.
 */

'use strict';

var exec = require('child_process').exec;
var phantombin = require('phantomjs');
var phantom = require('node-phantom');


module.exports = function(grunt) {
	var callback = require('../libs/runner.js'), util = grunt.util;

	grunt.registerMultiTask('qunit_amd', 'Your task description goes here.', function() {
		var done = this.async();

		if (util._.isFunction(this.data)) {
			this.data = this.data.apply(grunt, [].slice.call(arguments, 0));
		}

		phantom.create(callback(grunt, this, done) , {
			phantomPath:require('phantomjs').path,
			parameters: {
				'local-storage-path': '/dev/null',
				'web-security': false
			}
		});

	});
};
