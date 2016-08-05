'use strict';
var path = require('path');

var metalsmithWebpack = require('metalsmith-webpack');

module.exports = function(src, dest) {
  return function(_, metalsmith, done) {

    return metalsmithWebpack({
      context: metalsmith.path(),
      entry: './' + src,
      output: {
        filename: dest,
        path: metalsmith.path()
      }
    }).apply(null, arguments);
  };
};
