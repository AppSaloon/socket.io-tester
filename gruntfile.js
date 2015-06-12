var path = require('path');

module.exports = function(grunt) {

	require('load-grunt-tasks')(grunt);

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		copy: {
			css : {
				files : [{
					expand: true,
					flatten: true,
					cwd: './bower_components/bootstrap/dist/css/',
					src: '*.min.css',
					dest: './build/'
				},
				{
					expand: true,
					flatten: true,
					cwd: './bower_components/bootstrap/dist/fonts/',
					src: '**',
					dest: './build/fonts'
				}]
			},
			appFiles: {
				files: [{
					expand: true,
					flatten: true,
					cwd: 'appFiles',
					src: '**',
					dest: 'build'
				}]
			}
		},

		clean: {
			build: 'build',
			compiled: 'src/compiled'
		},

		shell: {
			babel: {
				command: 'babel src/js/ --out-dir src/compiled/'
			}
		},

		browserify: {
			app: {
				files: {
					'build/app.js': 'src/compiled/app.js'
				}
			}
		},

		// watch: {
		// 	scripts: {
		// 		files: ['./src/js/**'],
		// 		tasks: ['clean', 'jshint:dev', 'shell', 'browserify:app']/*,
		// 		options: {
		// 			livereload: true
		// 		}*/
		// 	},
		// 	// less: {
		// 	// 	files: ['./src/css/*.less'],
		// 	// 	tasks: ['clean:css', 'copy:css', 'less:dev']
		// 	// },
		// 	// index: {
		// 	// 	files: ['./src/index.html'],
		// 	// 	tasks: ['preprocess:default']
		// 	// }
		// }

	});

	// Default task(s).
	grunt.registerTask('default', ['build:dev', 'shell', 'browserify:app']);
	grunt.registerTask('build:dev', ['clean', 'copy']);

};
