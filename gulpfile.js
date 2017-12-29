'use strict';

const path = require('path');
const gulp = require('gulp');
const del = require('del');
const liquidjs = require('./index.js');
const Liquid = require('liquidjs');
const eslint = require('gulp-eslint');

const resolve = function (dir) {
  return path.join(__dirname, 'example', dir);
}

function lint(files) {
  return gulp.src(files)
    .pipe(eslint({ fix: true }))
    .pipe(eslint.format())
}

gulp.task('lint', () => {
  return lint('index.js')
    .pipe(gulp.dest('./'));
});
gulp.task('lint:test', () => {
  return lint('test/*.js')
    .pipe(gulp.dest('test'));
});


gulp.task('example', () => {
  return gulp.src([
    'example/views/**/*.html',  // scan
    '!example/views/_includes/**/*.html',  // filter
    '!example/views/_layouts/**/*.html' // filter
  ])
  .pipe(liquidjs({
    root: [resolve('views/'), resolve('views/_includes/'), resolve('views/_layouts/')],
    filters: {
      'add': (initial, arg1, arg2) => initial + arg1 + arg2
    },
    tags: {
      'upper': {
        parse: function (tagToken/*, remainTokens*/) {
          this.str = tagToken.args; // name
        },
        render: function (scope/*, hash*/) {
          var str = Liquid.evalValue(this.str, scope); // 'alice'
          return Promise.resolve(str.toUpperCase()); // 'Alice'
        }
      }
    }
  }))
  .pipe(gulp.dest('.tmp'))
})


gulp.task('clean', del.bind(null, ['.tmp']));

