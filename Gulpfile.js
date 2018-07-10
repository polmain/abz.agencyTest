const gulp = require('gulp');
const cssmin = require('gulp-cssmin');
const rename = require('gulp-rename');
const imagemin = require('gulp-imagemin');
const browserSync = require('browser-sync');
const concat      = require('gulp-concat');
const uglify      = require('gulp-uglifyjs');


gulp.task('default', ['css-min','img-min', 'scripts', 'html']);

gulp.task('css-min',function () {
	return gulp.src([
		'src/libs/select2/dist/css/select2.min.css',
		'src/css/*.css'
	])
		.pipe(concat('app.min.css'))
		.pipe(cssmin())
		//.pipe(rename({suffix: '.min'}))
		.pipe(gulp.dest('dist/css'))
		.pipe(browserSync.reload({stream: true}));
})

gulp.task('watch',['browser-sync', 'css-min','img-min', 'scripts','html'], function() {
	gulp.watch('src/**/*.css', ['css-min']);
	gulp.watch('src/img/*', ['img-min']);
	gulp.watch('src/scripts/*', ['scripts']);
	gulp.watch('src/*.html', ['html']);
});
gulp.task('html',function () {
	return gulp.src('src/*.html')
		.pipe(gulp.dest('dist'))
		.pipe(browserSync.reload({stream: true}));
});
gulp.task('img-min',function () {
	return gulp.src('src/img/*')
		.pipe(imagemin())
		.pipe(gulp.dest('dist/img'))
		.pipe(browserSync.reload({stream: true}));
});

gulp.task('scripts', function() {
	return gulp.src([
		'src/libs/jquery/dist/jquery.min.js',
		'src/libs/select2/dist/js/select2.js',
		'src/libs/jquery-validation/dist/jquery.validate.js',
		'src/scripts/main.js'
	])
		.pipe(concat('app.min.js'))
		.pipe(uglify())
		.pipe(gulp.dest('dist/scripts'))
		.pipe(browserSync.reload({stream: true}));
});

gulp.task('browser-sync', function() {
	browserSync({
		server: {
			baseDir: 'dist'
		},
		notify: false
	});
});