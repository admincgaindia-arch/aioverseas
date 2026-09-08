/* AI Overseas — policy watch banner.
   Reads data/route-alerts.json, which an automated daily job refreshes.
   The job flags reported changes with a source link; it never rewrites a
   figure on the site. Numbers are updated by a person after verification. */
(function () {
  'use strict';
  var box = document.getElementById('policyWatch');
  if (!box) return;
  var only = (box.dataset.country || '').toLowerCase();

  function esc(s) {
    return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
  var M = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  function fmt(iso) {
    var d = new Date(iso);
    if (isNaN(d)) return iso;
    return d.getDate() + ' ' + M[d.getMonth()] + ' ' + d.getFullYear();
  }

  fetch('data/route-alerts.json?t=' + Date.now(), { cache: 'no-store' })
    .then(function (r) { if (!r.ok) throw 0; return r.json(); })
    .then(function (d) {
      var list = (d.alerts || []).filter(function (a) {
        return !only || String(a.slug || '').toLowerCase() === only;
      }).sort(function (a, b) { return String(b.date).localeCompare(String(a.date)); }).slice(0, 6);

      if (!list.length) {
        box.innerHTML = '<div class="pw-head"><span class="pw-dot" aria-hidden="true"></span>' +
          '<b>Policy watch</b><span class="pw-when">Checked ' + esc(fmt(d.checked_at)) +
          ' &middot; nothing new flagged</span></div>';
        box.hidden = false;
        return;
      }

      box.innerHTML =
        '<div class="pw-head"><span class="pw-dot" aria-hidden="true"></span>' +
        '<b>Policy watch</b>' +
        '<span class="pw-when">Checked ' + esc(fmt(d.checked_at)) + ' &middot; ' +
        list.length + ' change' + (list.length === 1 ? '' : 's') + ' flagged</span>' +
        '<button class="pw-toggle" type="button" aria-expanded="false">Show</button></div>' +
        '<ul class="pw-list" hidden>' +
        list.map(function (a) {
          return '<li><span class="pw-kind">' + esc(a.kind || 'Update') + '</span>' +
            '<span class="pw-country">' + esc(a.country || '') + '</span>' +
            '<b>' + esc(a.title) + '</b>' +
            '<span class="pw-sum">' + esc(a.summary || '') + '</span>' +
            '<span class="pw-foot">' + esc(fmt(a.date)) +
            (a.url ? ' &middot; <a href="' + esc(a.url) + '" target="_blank" rel="noopener nofollow">' +
              esc(a.source || 'Source') + '</a>' : '') + '</span></li>';
        }).join('') + '</ul>';

      box.hidden = false;
      var btn = box.querySelector('.pw-toggle');
      var ul = box.querySelector('.pw-list');
      if (btn && ul) btn.addEventListener('click', function () {
        var open = ul.hidden;
        ul.hidden = !open;
        btn.textContent = open ? 'Hide' : 'Show';
        btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      });
    })
    .catch(function () { /* stay silent — the page works without it */ });
})();
