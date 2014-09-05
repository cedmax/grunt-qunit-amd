var isbin = require('isbin');
var logger = require('chip')();

module.exports = function(launchPhantom){
	'use strict';

	isbin('phantomjs', function(exists) {
		if (!exists){
			try{
				launchPhantom(require('phantomjs').path);
			} catch(e){
				var npm = require('npm');
				npm.load(npm.config, function (err) {
					if (err) { logger.error(err); }
					npm.commands.install(['phantomjs'], function (err) {
						if (err) { logger.error(err); }
						launchPhantom(require('phantomjs').path);
					});
					npm.on('log', function (message) {
						logger.info(message);
					});
				});
			}
		} else {
			launchPhantom();
		}
	});
};
