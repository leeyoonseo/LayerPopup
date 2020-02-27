const gulp = require('gulp');
var sourcemaps = require('gulp-sourcemaps');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const babel = require('gulp-babel');

gulp.task('concat', function () {
    return gulp.src(['./assets/js/layerPopup.js', './assets/js/index.js'])
        .pipe(sourcemaps.init())
        .pipe(babel({
            presets : ['@babel/preset-env']
        }))
        .pipe(uglify())
        .pipe(concat('index.min.js'))
        .pipe(sourcemaps.write('./', {sourceRoot: '../assets'}))

        .pipe(gulp.dest('dist'));
});

gulp.task('watch', function(){
    gulp.watch('./assets/js/*.js', gulp.series('concat'));
});

gulp.task('default', gulp.series('concat', 'watch'));