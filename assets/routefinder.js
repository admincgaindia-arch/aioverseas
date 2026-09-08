/* AI Overseas — route finder filters */
(function () {
  'use strict';
  var list = document.getElementById('fList');
  if (!list) return;
  var cards = Array.prototype.slice.call(list.querySelectorAll('.fcard'));
  var count = document.getElementById('fCount');
  var empty = document.getElementById('fEmpty');
  var sels = ['fGoal', 'fSpeed', 'fEng', 'fStay'].map(function (id) { return document.getElementById(id); });
  var keys = ['goal', 'speed', 'eng', 'stay'];

  function apply() {
    var want = sels.map(function (s) { return s ? s.value : 'all'; });
    var shown = 0;
    cards.forEach(function (c) {
      var ok = true;
      for (var i = 0; i < keys.length; i++) {
        if (want[i] !== 'all' && c.dataset[keys[i]] !== want[i]) { ok = false; break; }
      }
      c.hidden = !ok;
      if (ok) shown++;
    });
    if (empty) empty.hidden = shown > 0;
    if (count) {
      count.textContent = shown === cards.length
        ? cards.length + ' routes across 8 countries'
        : shown + ' of ' + cards.length + ' routes match';
    }
  }

  sels.forEach(function (s) { if (s) s.addEventListener('change', apply); });
  var clear = document.getElementById('fClear');
  if (clear) clear.addEventListener('click', function () {
    sels.forEach(function (s) { if (s) s.value = 'all'; });
    apply();
  });
  apply();

  /* mobile nav + year, same as the other pages */
  var yr = document.getElementById('yr'); if (yr) yr.textContent = new Date().getFullYear();
  var burger = document.getElementById('burger'), nav = document.getElementById('nav');
  if (burger && nav) burger.addEventListener('click', function () {
    var open = nav.classList.toggle('is-open');
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
})();
