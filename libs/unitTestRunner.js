module.exports = (function(){
	'use strict';

	var phantomApi = require('node-phantom');
	var phantomInstaller = require('../libs/installPhantom');
	var phantomRunner = require('../libs/phantomRunner');

	var config = {
		parameters: {
			'local-storage-path': '/dev/null',
			'web-security': false
		}
	};

	return function(data, done, coverage){
		var phantomLauncher = function(path){
			if (path) {
				config.phantomPath = path;
			}

			phantomApi.create(
				phantomRunner(
					data,
					done,
					coverage || function(){}
				),
				config
			);
		};

		phantomInstaller(phantomLauncher);
	};
})();
