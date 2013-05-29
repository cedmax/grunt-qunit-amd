/*global current:true, window, QUnit, document, require:true */

var phantomHelper = require("./helper.js");

module.exports = function(grunt, testOpt, done){

	var suiteResults = { files: 0, success: 0, failure: 0 },
		verbose = false, cwd = process.cwd();

	return function(e, phantom){

		function handleResults(file, result, queue){
			suiteResults.success += result.success;
			suiteResults.failure += result.failure;

			if (verbose) {
				grunt.log.writeln('');
			}
			if (result.failure === 0) {
				grunt.log.ok(file);
			} else {
				grunt.log.fail(file);
			}
			if (queue.length){
				loadSuite(queue.shift(), queue);
			} else {
				if (!verbose){
					grunt.log.subhead('Files: ' + (suiteResults.files) + ' Tests: ' + (suiteResults.success + suiteResults.failure) + ' Success: ' + suiteResults.success + ' Failed: ' + suiteResults.failure);
				}
				phantom.exit();
				done(suiteResults.failure? false : true);
			}
		}


		function initRequire(page, test){
			phantomHelper.evaluate(page, function(requireConf, paths, test) {
				if (requireConf) {
					require = requireConf;
				}
				if (require.baseUrl) {
					require.baseUrl = 'file://' + paths.cwd + '/' + require.baseUrl;
				}

				if (require.paths) {
					for (var prop in require.paths) {
						if (require.paths.hasOwnProperty(prop)) {
							require.paths[prop] = 'file://'+ paths.cwd + '/' + require.paths[prop];
						}
					}
				}

				var script = document.createElement('script');
				script.type = 'text/javascript';
				script.charset = 'utf-8';

				script.setAttribute('data-main', 'file://'+ paths.cwd + '/'+  test + '.js');
				script.src = 'file://'+ paths.lib + '/../node_modules/requirejs/require.js';

				document.head.appendChild(script);

			}, testOpt.data.require, {cwd: cwd, lib: __dirname},  test);
		}


		function injectDependency(page, dependencies, callback) {
			var dep = dependencies.shift();
			page.injectJs(dep, function(){
				if (dependencies.length) {
					injectDependency(page, dependencies, callback);
				} else {
					callback();
				}
			});
		}


		function exectuteTests(file, queue) {
			return phantom.createPage(function(e, page) {

				page.onConsoleMessage = function(text){
					if (text.indexOf('grunt.log')===0 && verbose){
						/* jshint evil: true */
						eval(text);
						/* jshint evil: false */
					} else {
						grunt.log.verbose.writeln(text);
					}
				};

				page.onError = function(e){
					grunt.log.writeln(JSON.stringify(e, null, 4));
				};

				var testRunning = false;

				page.open(__dirname +"/empty.html", function(e){

					if (testRunning) {
						return;
					}
					testRunning = true;
					var dependencies = [__dirname + "/helper.js", __dirname +"/../node_modules/qunitjs/qunit/qunit.js"];

					if (testOpt.data.include) {
						dependencies = dependencies.concat(testOpt.data.include.map(function(f){ return cwd + '/' + f; }));
					}

					injectDependency(page, dependencies, function(){
						page.evaluate(function(){
							var testRunning;
							current = {
								success: 0,
								failure: 0
							};

							window.onerror = function(e){
								current.failure++;
							};
							QUnit.init();
							QUnit.config.blocking = false;
							QUnit.config.requireExpects = true;
							QUnit.config.autorun = false;

							QUnit.testStart = function(obj){
								testRunning = obj.name;
								console.log("grunt.log.subhead('"+obj.name+"')");
							};

							QUnit.log = function(testResult){
								var result = testResult.result;
								current[(result)?'success':'failure']++;

								var expected = testResult.expected,
									actual = testResult.actual,
									message = testResult.message;

								if (result) {
									console.log("grunt.log.ok('"+ message.replace(/\'/g, "\\'") +"')");

								} else {
									console.log("grunt.log.fail('"+ message.replace(/\n/g, "\\n").replace(/\'/g, "\\'") +"')");

									if (typeof expected!== 'undefined') {
										console.log("grunt.log.error(' expected: "+ expected.toString().replace(/\'/g, "\\'") +"')");
									}
									if (typeof actual!== 'undefined') {
										//actual = actual+"";
										console.log("grunt.log.error(' actual: "+ actual.toString().replace(/\'/g, "\\'") +"')");
									}
								}
							};
						}, function(){
							initRequire(page, file);

							phantomHelper.waitFor(page, function(){
								return !QUnit.config.queue.length;
							}, function(){
								if (page) {
									page.evaluate(function(){
										return current;
									}, function(e, result) {
										page = null;
										handleResults(file, result, queue);
									});
								}
							}, function(){
								grunt.log.fail('script timeout');
								done(false);
							}, 10000);
						});
					});
				});
			});
		}

		function loadSuite(file, queue){
			if (verbose) {
				grunt.log.subhead(phantomHelper.consoleFlag(file));
			}
			exectuteTests(file, queue);
		}

		function initialize(files){
			suiteResults.files = files.length;
			if (suiteResults.files === 0) {
				grunt.log.fail("no test to be run");
				done(false);
			}

			verbose = (suiteResults.files === 1);
			return files;
		}

		var queue = initialize(grunt.file.expand(testOpt.data.tests));
		loadSuite(queue.shift(), queue);
	};
};
