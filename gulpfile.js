/**
 * File: gulpfile.js
 * Type: Javascript Gulp File
 * Author: Chris Humboldt
 */

// Table of contents
// ---------------------------------------------------------------------------------------
// Requires

// Requires
var gulp = require('gulp');
var livereload = require('gulp-livereload');
var sass = require('gulp-sass');
var uglify = require('gulp-uglify');

// Tasks
gulp.task('build', ['css', 'js']);

gulp.task('css', function() {
   gulp.src('./sass/*.scss')
      .pipe(sass({
         outputStyle: 'compressed'
      }))
      .pipe(gulp.dest('./css'))
      .pipe(livereload());
});

gulp.task('js', function() {
   gulp.src('./js/*.js')
      .pipe(uglify())
      .pipe(gulp.dest('./js/min'))
      .pipe(livereload());
});

gulp.task('watch', function() {
   livereload.listen();
   gulp.watch([
      './sass/*.scss',
      './sass/**/*.scss'
   ], ['css']);
   gulp.watch([
      './js/*.js'
   ], ['js']);
});
