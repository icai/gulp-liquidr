'use strict';
const assert = require('assert');
const Vinyl = require('vinyl');
const liquid = require('../index');
const Liquid = require('liquidjs');
const { describe, it } = require('mocha');

const opts = {
  data: { name: 'terry' },
  filters: {
    test: (v) => v + ' test',
    add: (initial, arg1, arg2) => initial + arg1 + arg2
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
};

describe('empty data', function () {
  it('interpolate {{...}}', function (cb) {
    const stream = liquid();
    stream.on('data', function (file) {
      assert.equal('hi ', file.contents.toString());
    });
    stream.on('end', cb);
    stream.write(new Vinyl({
      path: 'file.html',
      contents: new Buffer('hi {{name}}')
    }));
    stream.end();
  });

  it('default tags {%...%}', function (cb) {
    const stream = liquid(opts);
    stream.on('data', function (file) {
      assert.equal('OK', file.contents.toString());
    });
    stream.on('end', cb);
    stream.write(new Vinyl({
      path: 'file.html',
      contents: new Buffer('{% if name %}OK{% endif %}')
    }));
    stream.end();
  });

  it('default filters {{... | ...}}', function (cb) {
    const stream = liquid(opts);
    stream.on('data', function (file) {
      assert.equal('terrymena', file.contents.toString());
    });
    stream.on('end', cb);
    stream.write(new Vinyl({
      path: 'file.html',
      contents: new Buffer('{{name | add: "me", "na"}}')
    }));
    stream.end();
  });
});

describe('with options', function () {
  it('interpolate {{...}}', function (cb) {
    const stream = liquid(opts);
    stream.on('data', function (file) {
      assert.equal('hi terry', file.contents.toString());
    });
    stream.on('end', cb);
    stream.write(new Vinyl({
      path: 'file.html',
      contents: new Buffer('hi {{name}}')
    }));
    stream.end();
  });

  it('custom filters {{... | ...}}', function (cb) {
    const stream = liquid(opts);
    stream.on('data', function (file) {
      assert.equal('terry test', file.contents.toString());
    });
    stream.on('end', cb);
    stream.write(new Vinyl({
      path: 'file.html',
      contents: new Buffer('{{name | test}}')
    }));
    stream.end();
  });

  it('custom tags {% upper name %}', function (cb) {
    const stream = liquid(opts);
    stream.on('data', function (file) {
      assert.equal('TERRY', file.contents.toString());
    });
    stream.on('end', cb);
    stream.write(new Vinyl({
      path: 'file.html',
      contents: new Buffer('{% upper name %}')
    }));
    stream.end();
  })

});