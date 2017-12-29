# Gulp Liquidr

[![npm](https://img.shields.io/npm/v/gulp-liquidr.svg)](https://www.npmjs.org/package/gulp-liquidr)
[![npm](https://img.shields.io/npm/dm/gulp-liquidr.svg)](https://www.npmjs.org/package/gulp-liquidr)
[![Build Status](https://travis-ci.org/icai/gulp-liquidr.svg?branch=master)](https://travis-ci.org/icai/gulp-liquidr)
[![GitHub issues](https://img.shields.io/github/issues-closed/icai/gulp-liquidr.svg)](https://github.com/icai/gulp-liquidr/issues)
[![GitHub contributors](https://img.shields.io/github/contributors/icai/gulp-liquidr.svg)](https://github.com/icai/gulp-liquidr/graphs/contributors)
[![David](https://img.shields.io/david/icai/gulp-liquidr.svg)](https://david-dm.org/icai/gulp-liquidr)
[![David Dev](https://img.shields.io/david/dev/icai/gulp-liquidr.svg)](https://david-dm.org/icai/gulp-liquidr?type=dev)
[![DUB](https://img.shields.io/dub/l/vibe-d.svg)](https://github.com/icai/gulp-liquidr/blob/master/LICENSE)

<!-- [![Coveralls](https://img.shields.io/coveralls/icai/gulp-liquidr.svg)](https://coveralls.io/github/icai/gulp-liquidr?branch=master) -->

> gulp plugin for [LiquidJs](https://github.com/icai/gulp-liquidr)




## Usage


### Install

```bash
npm install gulp-liquidr --save
```

### Options 

The full list of options for `Liquid()` is listed as following:

* `root` is a directory or an array of directories to resolve layouts and includes, as well as the filename passed in when calling `.renderFile()`.
If an array, the files are looked up in the order they occur in the array.
Defaults to `["."]`

* `extname` is used to lookup the template file when filepath doesn't include an extension name. Eg: setting to `".html"` will allow including file by basename. Defaults to `""`.

* `cache` indicates whether or not to cache resolved templates. Defaults to `false`.

* `dynamicPartials`: if set, treat `<filepath>` parameter in `{%include filepath %}`, `{%layout filepath%}` as a variable, otherwise as a literal value. Defaults to `true`.

* `strict_filters` is used to enable strict filter existence. If set to `false`, undefined filters will be rendered as empty string. Otherwise, undefined filters will cause an exception. Defaults to `false`.

* `strict_variables` is used to enable strict variable derivation. 
If set to `false`, undefined variables will be rendered as empty string.
Otherwise, undefined variables will cause an exception. Defaults to `false`.

* `trim_tag_right` is used to strip blank characters (including ` `, `\t`, and `\r`) from the right of tags (`{% %}`) until `\n` (inclusive). Defaults to `false`.

* `trim_tag_left` is similiar to `trim_tag_right`, whereas the `\n` is exclusive. Defaults to `false`. See [Whitespace Control][whitespace control] for details.

* `trim_value_right` is used to strip blank characters (including ` `, `\t`, and `\r`) from the right of values (`{{ }}`) until `\n` (inclusive). Defaults to `false`.

* `trim_value_left` is similiar to `trim_value_right`, whereas the `\n` is exclusive. Defaults to `false`. See [Whitespace Control][whitespace control] for details.

* `greedy` is used to specify whether `trim_left`/`trim_right` is greedy. When set to `true`, all consecutive blank characters including `\n` will be trimed regardless of line breaks. Defaults to `true`.

The above is All [Liquidjs initilization options](https://github.com/icai/gulp-liquidr#options). 

----

* `tags` is used to Liquidjs instance to call `registerTag`

* `filters` is used to Liquidjs instance to call `registerFilter`

* `data` is used to Liquidjs instance to call `parseAndRender` with stream


by the way, extname default is  `extname: '.html'`.


### Demo

```javascript
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


```


## License
Copyright (c) 2017 Terry Cai. Licensed under the MIT license.





