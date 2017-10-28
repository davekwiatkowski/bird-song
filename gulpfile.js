const gulp = require('gulp'),
    livereload = require('gulp-livereload'),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    pug = require('gulp-pug'),
    rename = require('gulp-rename'),
    minify = require('gulp-minify-css');

const srcJs = 'docs/src/js/**/*.js',
    srcPugOther = 'docs/src/pug/**/*.pug',
    srcPugIndex = 'docs/src/pug/index.pug',
    srcSass = 'docs/src/sass/**/*.sass';

const destCss = 'docs/assets/css/',
    destJs = 'docs/assets/js/',
    destHtml = './docs/';

gulp.task('js', function () {
    return gulp.src(srcJs)
        .pipe(gulp.dest(destJs))
        .pipe(livereload());
});

gulp.task('pugIndex', function () {
    return gulp.src(srcPugIndex)
        .pipe(pug({
            "pretty": true
        }))
        .pipe(gulp.dest(destHtml))
        .pipe(livereload());
});

gulp.task('pugOther', function () {
    gulp.src(srcPugOther)
        .pipe(pug())
        .pipe(livereload());
});

gulp.task('sass', function () {
    return gulp.src(srcSass)
        .pipe(sass({
            sourceComments: 'map'
        }).on('error', sass.logError))
        .pipe(autoprefixer())
        .pipe(gulp.dest(destCss))
        .pipe(minify())
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest(destCss))
        .pipe(livereload());
});

gulp.task('watch', function () {
    livereload.listen();

    gulp.watch(srcJs, ['js']);
    gulp.watch(srcSass, ['sass']);
    gulp.watch(srcPugOther, ['pugOther', 'pugIndex']);
    gulp.watch(srcPugIndex, ['pugIndex']);
});

gulp.task('default', ['pugOther', 'pugIndex', 'js', 'sass', 'watch']);