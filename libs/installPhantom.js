var isbin = require('isbin');

module.exports = function(launchPhantom, logger, fail){
	'use strict';

	isbin('phantomjs', function(exists) {
		if (!exists){
			try{
				launchPhantom(require('phantomjs').path);
			} catch(e){
				var npm = require('npm');
				npm.load(npm.config, function (err) {
					if (err) { fail(err); }
					npm.commands.install(['phantomjs'], function (err) {
						if (err) { fail(err); }
						launchPhantom(require('phantomjs').path);
					});
					npm.on('log', function (message) {
						logger(message);
					});
				});
			}
		} else {
			launchPhantom();
		}
	});
};