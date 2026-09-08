/* AI Overseas — visa calendar: countdowns, month grouping, country filter */
(function () {
  'use strict';
  var list = document.getElementById('evList');
  if (!list) return;
  var items = Array.prototype.slice.call(list.querySelectorAll('.ev'));
  var count = document.getElementById('evCount');
  var empty = document.getElementById('evEmpty');
  var M = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  var today = new Date(); today.setHours(0, 0, 0, 0);

  items.forEach(function (li) {
    var d = new Date(li.dataset.date + 'T00:00:00');
    if (isNaN(d)) return;
    li.querySelector('.ev-day').textContent = d.getDate();
    li.querySelector('.ev-mon').textContent = M[d.getMonth()] + ' ' + String(d.getFullYear()).slice(2);
    var days = Math.round((d - today) / 86400000);
    var tag = li.querySelector('.ev-in-days');
    if (days < 0) { tag.textContent = 'passed'; li.classList.add('is-past'); }
    else if (days === 0) { tag.textContent = 'today'; li.classList.add('is-soon'); }
    else if (days <= 45) { tag.textContent = 'in ' + days + ' days'; li.classList.add('is-soon'); }
    else if (days <= 365) { tag.textContent = 'in ' + Math.round(days / 30) + ' months'; }
    else { tag.textContent = 'next year'; }
  });

  function apply(f) {
    var shown = 0;
    items.forEach(function (li) {
      var ok = f === 'all' || li.dataset.slug === f;
      li.hidden = !ok;
      if (ok) shown++;
    });
    if (empty) empty.hidden = shown > 0;
    if (count) count.textContent = shown === items.length
      ? items.length + ' dates ahead'
      : shown + ' of ' + items.length + ' dates';
  }

  var chips = Array.prototype.slice.call(document.querySelectorAll('#evChips .chip'));
  chips.forEach(function (c) {
    c.addEventListener('click', function () {
      chips.forEach(function (x) { x.classList.remove('is-on'); });
      c.classList.add('is-on');
      apply(c.dataset.f);
    });
  });
  apply('all');

  var yr = document.getElementById('yr'); if (yr) yr.textContent = new Date().getFullYear();
  var burger = document.getElementById('burger'), nav = document.getElementById('nav');
  if (burger && nav) burger.addEventListener('click', function () {
    var open = nav.classList.toggle('is-open');
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
})();
