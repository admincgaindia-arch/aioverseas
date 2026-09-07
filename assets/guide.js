/* AI Overseas — visa guide page: route tabs + mobile nav */
(function () {
  'use strict';
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  var yr = $('#yr'); if (yr) yr.textContent = new Date().getFullYear();

  var burger = $('#burger'), nav = $('#nav');
  if (burger && nav) {
    burger.addEventListener('click', function () {
      var open = nav.classList.toggle('is-open');
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
      burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    });
  }

  var tabs = $$('.gtab'), panels = $$('.gpanel');

  function show(key, focusPanel) {
    tabs.forEach(function (t) {
      var on = t.dataset.tab === key;
      t.classList.toggle('is-on', on);
      t.setAttribute('aria-selected', on ? 'true' : 'false');
    });
    panels.forEach(function (p) {
      var on = p.id === 'p-' + key;
      p.hidden = !on;
      p.classList.toggle('is-on', on);
    });
    if (history.replaceState) history.replaceState(null, '', '#' + key);
    if (focusPanel) {
      var el = document.getElementById('p-' + key);
      if (el) el.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
  }

  tabs.forEach(function (t) {
    t.addEventListener('click', function () { show(t.dataset.tab, true); });
  });

  var VALID = ['study', 'work', 'pr', 'visit', 'dependant', 'business'];
  var hash = (location.hash || '').replace('#', '');
  if (VALID.indexOf(hash) > -1) show(hash, false);
})();
