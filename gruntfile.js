module.exports = function(grunt) {

	// Load NPM tasks
	grunt.loadNpmTasks('grunt-contrib-sass');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.registerTask('build', ['sass', 'uglify']);
	grunt.registerTask('default', ['watch']);

	// Initialize config
	grunt.initConfig({
		// Package
		pkg: grunt.file.readJSON('package.json'),
		// SASS
		sass: {
			dist: {
				options: {
					style: 'compressed',
					sourcemap: 'none'
				},
				files: {
					'css/demo.css': 'sass/demo.scss',
					'css/flickerplate.css': 'sass/flickerplate.scss'
				}
			}
		},
		// End of SASS
		// Uglify
		uglify: {
			my_target: {
				files: {
					'js/min/hammer-v2.0.3.min.js': ['js/hammer-v2.0.3.js'],
					'js/min/flickerplate.min.js': ['js/flickerplate.js']
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
				files: 'js/*.js',
				tasks: ['uglify']
			},
			// End of scripts
			// Live reload
			options: {
				livereload: true,
			}
			// End of live reload
		}
		// End of watch
	});
	// End of initialize config
}