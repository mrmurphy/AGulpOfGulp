var gulp = require('gulp');
var gutil = require('gulp-util');
var jade = require('gulp-jade');
var sass = require('gulp-sass');
var connect = require('connect');
var glr = require('gulp-livereload');
var tinylr = require('tiny-lr');
var livereload = tinylr();

var sources = {
  jade: "./jade/*.jade",
  sass: "./sass/*.scss"
};

var watchpaths = {
  jade: "./jade/**/*.jade",
  sass: "./sass/**/*.scss"
}


// --------------------------------------------->
// These are simple tasks that do one thing each with no dependecies.

// Tasks run asyncronously by default for maximum efficiency. In order to
// use the dependency management feature of gulp, a task must indicate somehow
// when it has finished. Otherwise gulp will assume that the task is finished
// as soon as it has started.
// There are three ways to indicate that a task has finished, and two of those
// ways are shown below.

// This task returns a stream. When the stream emits its ending events, gulp
// will know that the task has completed.
gulp.task('jade', function() {
  gutil.log(gutil.colors.blue('Recompiling Jade templates.'));
  return gulp.src(sources.jade)
  .pipe(jade())
  .pipe(glr(livereload)) // Notify livereload of the change.
  .pipe(gulp.dest("./public/"));
});

// This task takes a callback as a parameter, and calls it manually upon
// stream event end.
gulp.task('sass', function(cb) {
  gutil.log(gutil.colors.blue('Recompiling Sass styles.'));
  gulp.src(sources.sass)
  .pipe(sass())
  .pipe(glr(livereload))
  .pipe(gulp.dest("./public"))
  .on('end', function() {
    cb(null); // Pass in null, assuming there were no errors in the stream.
  })
  .on('error', function(err) {
    ch(err);
  });
});


// --------------------------------------------->
// Here is an example of code that needs to be called by two tasks.
// Exctracting it into a function makes it easy to call from either task.
// The watch function is used in both the 'watch' task, and the 'serve' task
// below.
//
// I also have code here that I wanted to store outside of the function it's
// called from for clarity sake.

function watch () {
  gulp.watch(watchpaths.jade, ['jade']);
  gulp.watch(watchpaths.sass, ['sass']);
}

function startLivereload() {
  livereload.listen(35729, function(err) {
    if (err) {
      return console.error(err);
    }
  });
}

// This is an example of a task whose only purpose is to make a function
// callable from the command line.

gulp.task('watch', function() {
  watch();
});


// --------------------------------------------->
// Here is a task that depends on other tasks, and runs non gulp-specific code
// as part of its operations.

gulp.task('serve', ['sass', 'jade'], function(cb) {
  startLivereload();
  connect()
  .use(connect.static('./public'))
  .listen(8787);
  watch();
});


gulp.task('default', ['serve']);
