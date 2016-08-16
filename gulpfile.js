require('dotenv').load();

var gulp = require('gulp'),
    gutil = require('gulp-util'),
    webserver = require('gulp-webserver'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat-sourcemap'),
    rename = require("gulp-rename"),
    minifyCss = require('gulp-minify-css'),
    gutil = require('gulp-util'),
    sass = require("gulp-ruby-sass"),
    compass = require('gulp-compass'),
    sourcemaps = require('gulp-sourcemaps'),
    browserify = require('gulp-browserify'),
    livereload = require('gulp-livereload'),
    replace = require('gulp-replace'),
    s3 = require("gulp-s3"),
    deploy = require('gulp-deploy-ftp'),
    ftp = require('gulp-ftp'),
    changed = require('gulp-changed'),
    sync = require('gulp-directory-sync'),
    fs = require('fs');
    

// ============= BV API APP ============= //
// ***
// ***
// ***
// ***
// ***
// ***
// ***

    // Sass & CSS configuration
    gulp.task('mini-sass', function () {
        return sass('app/sass/', {style: 'compressed', sourcemap: false})
            .on('error', function (err) {
                console.error('Error!', err.message);
            })
            .pipe(concat('style.css'))
            .pipe(rename({
                extname: '.min.css'
            }))
            .pipe(gulp.dest('app/css/'));
    });
    
    // Uglify configuration 
    gulp.task('minify', function() {
        return gulp.src(['app/js/*.js', '!app/js/*.min.js'])
        .pipe(uglify().on('error', gutil.log))
        .pipe(concat('all.js'))
        .pipe(rename({
            extname: '.min.js'
        }))
        .pipe(gulp.dest('app/js'));
    });
    
    gulp.task('htm', function() {
        gulp.src('app/*.html')
    });
    
    // Watch task
    gulp.task('check', function() {
        //livereload.listen();
        gulp.watch('app/js/**/*', ['minify']).on('change', function(file) { //livereload.changed(file.path);
            gutil.log(gutil.colors.yellow('JS has been updated' + ' (' + file.path + ')'));
        });
        
        gulp.watch(['app/*.html', 'app/views/*.html'], ['htm']).on('change', function(file) { //livereload.changed(file.path);
            gutil.log(gutil.colors.cyan('HTML has been updated' + ' (' + file.path + ')'));
        });
        
        gulp.watch(['app/sass/**/*'], ['mini-sass']).on('change', function(file) { //livereload.changed(file.path);
            gutil.log(gutil.colors.grey('SASS has been updated' + ' (' + file.path + ')'));
        });
        gulp.watch(['bower_components/**/*'],['sync']).on('change', function(file) { //livereload.changed(file.path);
            gutil.log(gutil.colors.grey('New module added' + ' (' + file.path + ')'));
        });

    });
    
    gulp.task( 'sync', function() {
    return gulp.src( '' )
        .pipe(sync('bower_components/', 'app/bower_components/', { printSummary: true } ))
        .on('error', gutil.log);
    });
    
    // Webserver
    gulp.task('server', ['mini-sass'], function() {
        gulp.src('app/')
        .pipe(webserver({
        	livereload: true,
        	open: true
        }));
    });
    
    gulp.task('default', ['minify', 'mini-sass' , 'check', 'sync', 'server']);

// ***
// ***
// ***
// ***
// ***
// ***
// ***
// ============= End - BV API APP ============= //