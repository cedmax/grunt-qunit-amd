/*
 * grunt-qunit-amd
 * https://github.com/cedmax/grunt-qunit-amd
 *
 * Copyright (c) 2013 cedmax
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {
	var util = grunt.util;
	var coverageHelper = require('../libs/coverageHelper.js')(grunt);
	var unitTestRunner = require('../libs/unitTestRunner');

	grunt.registerTask('qunit_amd_runner', function () {
		var done = this.async();
		var config = grunt.config.get('qunit_amd_runner');
		config.tests = grunt.file.expand(config.tests);

		var saveReports = config.coverage && config.coverage.tmp && coverageHelper.save(config.coverage.tmp);
		unitTestRunner(config, done, saveReports);
	});

	grunt.registerMultiTask('qunit_amd', function() {
		if (util._.isFunction(this.data)) {
			this.data = this.data.apply(grunt, [].slice.call(arguments, 0));
		}
		var data = this.data;

		coverageHelper.instrument(data);

		grunt.config.set('qunit_amd_runner', data);
		grunt.task.run('qunit_amd_runner');

		coverageHelper.report(data);
		coverageHelper.clean(data);
	});
};
