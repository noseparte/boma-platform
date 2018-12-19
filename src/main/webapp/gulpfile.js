var gulp = require('gulp'),
	csso = require("gulp-csso"),
	concat = require("gulp-concat"),
	uglify = require("gulp-uglify"),
	clean = require("gulp-clean"),
	rename = require("gulp-rename"),
	rev = require("gulp-rev"),
	revCollector = require("gulp-rev-collector"),
	sequence = require('gulp-sequence');
gulp.task('seaJs', function() {
	return gulp.src(['js/lib/sea.js', 'js/lib/sea.config.js'])
	.pipe(concat('sea_160301.js'))
	// .pipe(uglify('specialDetail.js'))
	.pipe(gulp.dest('js/lib/'));
});
gulp.task('ugJs', function() {
	if(gulp.env.path) {
		return gulp.src(gulp.env.path)
		// .pipe(concat('sea_160301.js'))
		.pipe(uglify(gulp.env.path + 'compare'))
		.pipe(gulp.dest(gulp.env.path + 'compare'));
	}
});