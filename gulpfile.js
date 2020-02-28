const gulp = require('gulp');
var sourcemaps = require('gulp-sourcemaps');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const babel = require('gulp-babel');

const concatFunc = function(src, name){
    return gulp.src(src)
        .pipe(sourcemaps.init())
        .pipe(babel({
            presets : ['@babel/preset-env']
        }))
        .pipe(uglify())
        .pipe(concat(`${name}.min.js`))
        .pipe(sourcemaps.write('./', {sourceRoot: '../assets'}))
        .pipe(gulp.dest('dist'));
};

gulp.task('moduleConcat', function () {
    return concatFunc('./assets/js/layerPopup.js', 'layerPopup');
});

// dev
gulp.task('devConcat', function () {
    return concatFunc('./assets/js/index.js', 'index');
});

gulp.task('watch', function(){
    gulp.watch('./assets/js/layerPopup.js', gulp.series('moduleConcat'));
    gulp.watch('./assets/js/index.js', gulp.series('devConcat'));
});

gulp.task('default', gulp.series('moduleConcat', 'devConcat', 'watch'));