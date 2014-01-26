module.exports = function(grunt) {

	// Load NPM tasks
	grunt.loadNpmTasks('grunt-contrib-sass');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.registerTask('default', ['watch']);
	
	// Initialize config
	grunt.initConfig({
		// Package
		pkg: grunt.file.readJSON('package.json'),
		// SASS
		sass: {
			dist: {
				options: {
					style: 'compressed'
				},
				files: {
					'css/flickerplate.css': 'sass/flickerplate.scss'
				}
			}
		}, 
		// End of SASS
		// Uglify
		uglify: {
			my_target: {
				files: {
					'js/min/jquery-v1.10.2.min.js'				: ['js/jquery-v1.10.2.js'],
					'js/min/modernizr-custom-v2.7.1.min.js'		: ['js/modernizr-custom-v2.7.1.js'],
					'js/min/jquery-finger-v0.1.0.min.js'		: ['js/jquery-finger-v0.1.0.js'],
					'js/min/flickerplate.min.js'				: ['js/flickerplate.js']
				}
			}
		},
		// Watch
		watch: {
			// CSS
			css: {
				files: '**/*.scss',
				tasks: ['sass']
			},
			// End of CSS
			// Scripts
			scripts: {
				files: '**/*.js',
				tasks: ['uglify']
			}
			// End of scripts
		} 
		// End of watch
	});
	// End of initialize config
}