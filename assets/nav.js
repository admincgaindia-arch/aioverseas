/* AI Overseas — dropdown navigation (shared by every page) */
(function () {
  'use strict';
  var wraps = Array.prototype.slice.call(document.querySelectorAll('.ddw'));
  if (!wraps.length) return;

  function closeAll(except) {
    wraps.forEach(function (w) {
      if (w === except) return;
      w.classList.remove('is-open');
      var b = w.querySelector('.dd-btn');
      if (b) b.setAttribute('aria-expanded', 'false');
    });
  }

  wraps.forEach(function (w) {
    var btn = w.querySelector('.dd-btn');
    if (!btn) return;
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      var open = w.classList.toggle('is-open');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      closeAll(w);
    });
  });

  document.addEventListener('click', function () { closeAll(null); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeAll(null); });

  /* mark the current page in the nav */
  var here = location.pathname.replace(/^\//, '') || 'index.html';
  Array.prototype.slice.call(document.querySelectorAll('.nav a')).forEach(function (a) {
    var href = (a.getAttribute('href') || '').replace(/^\//, '').split('#')[0];
    if (!href) return;
    if (href === here) {
      a.classList.add('is-here');
      var dw = a.closest('.ddw');
      if (dw) dw.querySelector('.dd-btn').classList.add('is-here');
    }
  });
})();
