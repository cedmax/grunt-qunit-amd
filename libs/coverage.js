var fs = require('fs');

module.exports = function(grunt){
	'use strict';

	grunt.loadNpmTasks('grunt-istanbul');

	return {
		instrument: function(data){
			if (data.coverage){
				var pattern = [data.require.baseUrl + '/**/*.js'];
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
		},
		report: function(data){
			if (data.coverage){
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
		},
		parse: 	function cover(path){
			return function(file, coverage){
				if (coverage) {
					var reportSlug = file.substr(file.lastIndexOf('/')+1, file.length).replace('.js', '');
					fs.writeFileSync(path + '/'+ reportSlug+'.json', JSON.stringify(coverage, null, 4));
				}
			};
		}
	};
};