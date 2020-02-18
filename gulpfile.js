var gulp = require('gulp')
var plumber = require('gulp-plumber')
var sass = require('gulp-sass')
const { watch, series } = require('gulp')

sass.compiler = require('node-sass')

gulp.task('sass', function() {
  return gulp
    .src('./src/assets/sass/**/*.scss')
    .pipe(
      plumber({
        errorHandler: function(error) {
          console.log(error.message)
          this.emit('end')
        }
      })
    )
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./css'))
})

gulp.task('gitrdone', function() {
  watch('./src/assets/sass/**/*.scss', series('sass'))
})
