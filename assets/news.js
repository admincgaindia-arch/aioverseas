/* AI Overseas — daily updates feed
   Reads data/news.json, which an automated job rewrites every morning. */

(function () {
  'use strict';

  var $  = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  var yr = $('#yr'); if (yr) yr.textContent = new Date().getFullYear();

  /* mobile nav */
  var burger = $('#burger'), nav = $('#nav');
  if (burger && nav) {
    burger.addEventListener('click', function () {
      var open = nav.classList.toggle('is-open');
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
      burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    });
  }

  var grid = $('#newsGrid'), filters = $('#newsFilters'),
      search = $('#newsQ'), empty = $('#newsEmpty'), stampText = $('#stampText');

  var ITEMS = [], active = 'all', query = '';

  var MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

  function fmtDate(iso) {
    var d = new Date(iso + 'T00:00:00');
    if (isNaN(d)) return iso;
    return d.getDate() + ' ' + MONTHS[d.getMonth()] + ' ' + d.getFullYear();
  }

  function ago(iso) {
    var d = new Date(iso + 'T00:00:00');
    if (isNaN(d)) return '';
    var days = Math.floor((Date.now() - d.getTime()) / 86400000);
    if (days <= 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return days + ' days ago';
    if (days < 14) return 'Last week';
    return '';
  }

  function host(url) {
    try { return new URL(url).hostname.replace(/^www\./, ''); }
    catch (e) { return ''; }
  }

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  function render() {
    var q = query.trim().toLowerCase();
    var list = ITEMS.filter(function (it) {
      if (active !== 'all' && it.category !== active) return false;
      if (!q) return true;
      return (it.title + ' ' + it.summary + ' ' + (it.country || '') + ' ' + (it.category || '') + ' ' + (it.source || ''))
             .toLowerCase().indexOf(q) > -1;
    });

    if (!list.length) {
      grid.innerHTML = '';
      empty.hidden = false;
      return;
    }
    empty.hidden = true;

    grid.innerHTML = list.map(function (it) {
      var rel = ago(it.date);
      var h = host(it.url);
      return '' +
        '<article class="ncard">' +
          '<div class="ncard-top">' +
            '<span class="ntag">' + esc(it.category || 'Update') + '</span>' +
            (it.country ? '<span class="nctry">' + esc(it.country) + '</span>' : '') +
          '</div>' +
          '<h2 class="ncard-h">' + esc(it.title) + '</h2>' +
          '<p class="ncard-s">' + esc(it.summary) + '</p>' +
          '<div class="ncard-foot">' +
            '<span class="ndate">' + esc(fmtDate(it.date)) + (rel ? ' &middot; ' + esc(rel) : '') + '</span>' +
            (it.url
              ? '<a class="nsrc" href="' + esc(it.url) + '" target="_blank" rel="noopener nofollow">' +
                  esc(it.source || h || 'Source') + '</a>'
              : '') +
          '</div>' +
        '</article>';
    }).join('');
  }

  function buildFilters() {
    var seen = {};
    ITEMS.forEach(function (it) { if (it.category) seen[it.category] = true; });
    Object.keys(seen).sort().forEach(function (cat) {
      var b = document.createElement('button');
      b.className = 'chip';
      b.dataset.filter = cat;
      b.textContent = cat;
      filters.appendChild(b);
    });

    filters.addEventListener('click', function (e) {
      var b = e.target.closest('.chip');
      if (!b) return;
      $$('.chip', filters).forEach(function (c) { c.classList.remove('is-on'); });
      b.classList.add('is-on');
      active = b.dataset.filter;
      render();
    });
  }

  function setStamp(iso) {
    if (!stampText) return;
    var d = iso ? new Date(iso) : null;
    if (!d || isNaN(d)) { stampText.textContent = 'Updated daily'; return; }
    var day = d.getDate() + ' ' + MONTHS[d.getMonth()] + ' ' + d.getFullYear();
    var hh = d.getHours(), mm = ('0' + d.getMinutes()).slice(0, 2);
    var ampm = hh >= 12 ? 'pm' : 'am';
    hh = hh % 12 || 12;
    stampText.textContent = 'Last updated ' + day + ' at ' + hh + ':' + mm + ' ' + ampm + ' IST — ' +
                            ITEMS.length + ' update' + (ITEMS.length === 1 ? '' : 's');
  }

  fetch('data/news.json?t=' + Date.now(), { cache: 'no-store' })
    .then(function (r) {
      if (!r.ok) throw new Error('HTTP ' + r.status);
      return r.json();
    })
    .then(function (data) {
      ITEMS = (data.items || []).slice().sort(function (a, b) {
        return String(b.date).localeCompare(String(a.date));
      });
      if (!ITEMS.length) {
        grid.innerHTML = '<p class="news-loading">No updates published yet. The next run publishes tomorrow morning.</p>';
        setStamp(data.generated_at);
        return;
      }
      buildFilters();
      render();
      setStamp(data.generated_at);
    })
    .catch(function () {
      grid.innerHTML = '<p class="news-loading">Updates could not be loaded right now. Please refresh in a moment, ' +
                       'or <a href="https://wa.me/919355107739" target="_blank" rel="noopener">ask us on WhatsApp</a>.</p>';
      if (stampText) stampText.textContent = 'Feed temporarily unavailable';
    });

  if (search) {
    var t;
    search.addEventListener('input', function () {
      clearTimeout(t);
      t = setTimeout(function () { query = search.value; render(); }, 160);
    });
  }
})();
