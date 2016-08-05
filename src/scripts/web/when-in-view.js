'use strict';
var throttle = function(interval, fn) {
  var prev = new Date().getTime();
  return function() {
    var now = new Date().getTime();
    if (now - prev < interval) {
      return;
    }
    prev = now;
    return fn.apply(this, arguments);
  };
};
function onScroll(els) {
  var length = els.length;
  var idx, el, rect, wasInView;
  var center;

  for (idx = 0; idx < length; ++idx) {
    el = els[idx];
	rect = el.el.getBoundingClientRect();
	center = rect.top + (rect.bottom - rect.top) / 2;
	wasInView = el.el.getAttribute('data-in-view') === 'true';
	if (center > 0.2 * window.innerHeight && center < 0.8 * window.innerHeight) {
	  if (wasInView) {
		continue;
	  }
	  el.handler.call(null, el.el);
	  el.el.setAttribute('data-in-view', 'true');
	} else {
	  if (wasInView) {
	    el.el.setAttribute('data-in-view', 'false');
	  }
	}
  }
}
module.exports = function() {
  var els = [];
  var localOnScroll = throttle(500, onScroll.bind(null, els));

  document.addEventListener('scroll', localOnScroll);

  return function whenInView(el, handler) {
    els.push({ el: el, handler: handler });
  };
};
