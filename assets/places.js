/* AI Overseas — places gallery lightbox on country pages */
(function () {
  'use strict';
  var gal = document.getElementById('gal');
  var lb = document.getElementById('lb');
  if (!gal || !lb) return;

  var figs = Array.prototype.slice.call(gal.querySelectorAll('.gcell'));
  var img = document.getElementById('lbImg');
  var cap = document.getElementById('lbCap');
  var idx = 0;

  function show(i) {
    idx = (i + figs.length) % figs.length;
    var el = figs[idx].querySelector('img');
    img.src = el.dataset.full || el.src;
    img.alt = el.alt || '';
    var b = figs[idx].querySelector('figcaption b');
    cap.textContent = b ? b.textContent : '';
  }
  function open(i) { show(i); lb.hidden = false; document.body.style.overflow = 'hidden'; }
  function close() { lb.hidden = true; img.src = ''; document.body.style.overflow = ''; }

  figs.forEach(function (f, i) {
    f.setAttribute('tabindex', '0');
    f.setAttribute('role', 'button');
    f.addEventListener('click', function () { open(i); });
    f.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(i); }
    });
  });

  document.getElementById('lbX').addEventListener('click', close);
  document.getElementById('lbPrev').addEventListener('click', function () { show(idx - 1); });
  document.getElementById('lbNext').addEventListener('click', function () { show(idx + 1); });
  lb.addEventListener('click', function (e) { if (e.target === lb) close(); });
  document.addEventListener('keydown', function (e) {
    if (lb.hidden) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowRight') show(idx + 1);
    if (e.key === 'ArrowLeft') show(idx - 1);
  });
})();
