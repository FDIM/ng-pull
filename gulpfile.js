"use strict";

var gulp = require('gulp');
var uglify = require('gulp-uglify');
var coveralls = require('gulp-coveralls');
var cssmin = require('gulp-cssmin');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var karma = require('karma').server;

var _coverage = 'coverage/**/lcov.info';
var _scripts = 'src/**/*.js';
var _styles = 'src/**/*.css';
var _script = 'ng-pull.js';
var _style = 'ng-pull.css';
var _dist = 'dist';

gulp.task('build-css', function () {
    return gulp.src(_styles)
        .pipe(concat(_style))
        .pipe(gulp.dest(_dist))
        .pipe(cssmin())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest(_dist));
})

gulp.task('build', ['unit-test', 'build-css'], function () {
    return gulp.src(_scripts)
        .pipe(concat(_script))
        .pipe(gulp.dest(_dist))
        .pipe(uglify())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest(_dist));
})
gulp.task('dist', ['build-css'], function () {
    return gulp.src(_scripts)
        .pipe(concat(_script))
        .pipe(gulp.dest(_dist))
        .pipe(uglify())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest(_dist));
})

gulp.task('watch',['build'], function(){
    gulp.watch('src/**/*', ['build']);
    gulp.watch('tests/**/*', ['unit-test']);
});

gulp.task('unit-test', function (done) {
    var _opts = {
        configFile: __dirname + '/karma.conf.js',
        singleRun: true,
        browsers: ['PhantomJS2']
    };

    karma.start(_opts, done);
})
gulp.task('test', function (done) {
    var _opts = {
        configFile: __dirname + '/karma.conf.js',
        singleRun: true,
        browsers: ['PhantomJS2', 'Firefox', 'IE']
    };

    karma.start(_opts, done);
})
gulp.task('coverage', ['unit-test'], function () {
    gulp
        .src(_coverage)
        .pipe(coveralls());
})
