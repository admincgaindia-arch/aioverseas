/* AI Overseas — country pages: mobile nav + year */
(function () {
  'use strict';
  var yr = document.getElementById('yr'); if (yr) yr.textContent = new Date().getFullYear();
  var burger = document.getElementById('burger'), nav = document.getElementById('nav');
  if (burger && nav) {
    burger.addEventListener('click', function () {
      var open = nav.classList.toggle('is-open');
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
      burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    });
  }
})();
