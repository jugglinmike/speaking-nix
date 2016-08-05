'use strict';

var replSim = require('repl-sim');
var whenInView = require('./when-in-view')();

var pres = document.getElementsByClassName('language-terminal');
var options = {
  promptRe: /^(vm\$|pc\$) /,
  prepText: function(text) {
    return text.replace(/\n$/, '');
  },
  getHeight: function(el) {
    var parent = el.parentNode;
    var style = getComputedStyle(parent);
    var top = parseInt(style.paddingTop || 0, 10);
    var bottom = parseInt(style.paddingBottom || 0, 10);
    return parent.clientHeight - top - bottom;
  }
};

Array.prototype.slice.call(pres).forEach(function(pre) {
  whenInView(pre, function(el) { replSim(el, options); });
});
