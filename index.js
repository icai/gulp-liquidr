'use strict';

const through = require('through2');
const Liquid = require('liquidjs');
const PluginError = require('plugin-error');
const pluginName = 'gulp-liquidjs';

const deepCopy = (obj) => {
  return JSON.parse(JSON.stringify(obj));
}
/**
 * 
 * @param {
 *  liquidjs options
 *  tags custom tags
 *  filters custom tags
 *  data render data
 * } opts 
 */
module.exports = function (opts) {
  const defaults = {
    extname: '.html'
  };
  opts = Object.assign({}, defaults, opts);
  const engine = Liquid(opts);

  if (opts.tags && typeof opts.tags === 'object') {
    Object.keys(opts.tags).forEach(function (t) {
      engine.registerTag(t, opts.tags[t]);
    });
  }

  if (opts.filters && typeof opts.filters === 'object') {
    Object.keys(opts.filters).forEach(function (f) {
      engine.registerFilter(f, opts.filters[f]);
    });
  }

  function liquid(file, enc, callback) {
    if (file.isNull()) {
      return callback();
    }
    if (file.isStream()) {
      this.emit('error', new PluginError(pluginName, 'Stream content is not supported'));
      return callback();
    }
    if (file.isBuffer()) {
      // use deep copy data
      engine.parseAndRender(file.contents.toString(), deepCopy(opts.data || {}))
        .then((output) => {
          file.contents = new Buffer(output);
          this.push(file);
          callback();
        }).catch((ex) => {
          this.emit('error', new PluginError(pluginName, ex.message));
        });
    }
  }
  return through.obj(liquid);
};