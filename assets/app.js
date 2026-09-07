/* AI Overseas Private Limited — aioverseas.co.in
   No dependencies. Everything runs client-side so the site works on GitHub Pages. */

(function () {
  'use strict';

  var WA_NUMBER = '919355107739';          // primary WhatsApp line
  var MAIL_TO   = 'admin.aioverseas@gmail.com';
  var $  = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  /* ---------------- year ---------------- */
  var yr = $('#yr'); if (yr) yr.textContent = new Date().getFullYear();

  /* ---------------- mobile nav ---------------- */
  var burger = $('#burger'), nav = $('#nav');
  if (burger && nav) {
    burger.addEventListener('click', function () {
      var open = nav.classList.toggle('is-open');
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
      burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    });
    nav.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') {
        nav.classList.remove('is-open');
        burger.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ---------------- active section in nav ---------------- */
  var navLinks = $$('.nav a');
  if ('IntersectionObserver' in window && navLinks.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        navLinks.forEach(function (a) {
          a.classList.toggle('is-here', a.getAttribute('href') === '#' + en.target.id);
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    ['destinations', 'services', 'process', 'checklist', 'leadership', 'faq', 'contact'].forEach(function (id) {
      var el = document.getElementById(id); if (el) io.observe(el);
    });
  }

  /* ---------------- eligibility scorer ---------------- */
  var ROUTES = {
    study:    ['Canada study permit with post-graduation work permit pathway',
               'UK student visa plus the Graduate route stay-back',
               'Germany public university (low tuition, blocked account route)',
               'Australia subclass 500 with 485 graduate stream'],
    work:     ['Canada employer-specific or open work permit',
               'UK Skilled Worker with a licensed sponsor',
               'Germany EU Blue Card or Opportunity Card',
               'UAE employment visa through a Gulf employer'],
    pr:       ['Canada Express Entry (CRS) and Provincial Nominee streams',
               'Australia skilled independent 189 / state nominated 190',
               'New Zealand Skilled Migrant residence',
               'Canada study-to-PR route if your points are short today'],
    visit:    ['Canada visitor visa or parent super visa',
               'UK standard visitor visa',
               'Schengen short-stay visit visa',
               'UAE tourist visa'],
    business: ['UK or Canada business visitor visa for meetings and trade fairs',
               'UAE freezone company setup with investor visa',
               'US B1 business visa with interview preparation',
               'Australia business visitor stream']
  };

  var form = $('#assessForm'), out = $('#assessOut');

  function verdictText(score, goal) {
    if (score >= 68) {
      return 'Your profile reads strong. On most points-based routes a file like this is worth filing now rather than waiting — timing usually matters more than one more qualification.';
    }
    if (score >= 46) {
      return 'Workable profile. It will clear on the right route, but the route choice matters more than usual here. One or two targeted improvements — an English retest, a documented experience letter, cleaner funds — can move this materially.';
    }
    return 'This needs work before filing. That is not a no; it means a rushed application would probably be refused and a refusal makes the next attempt harder. Let us map what to fix first, in what order.';
  }

  if (form && out) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var d  = new FormData(form);
      var raw = ['age', 'edu', 'eng', 'exp', 'funds', 'refusal'].reduce(function (t, k) {
        return t + Number(d.get(k) || 0);
      }, 0);
      var score = Math.max(5, Math.min(100, Math.round(raw)));
      var goal  = d.get('goal') || 'study';

      var band = score >= 68 ? 'Strong' : score >= 46 ? 'Workable' : 'Needs work';
      var cls  = score >= 68 ? '' : score >= 46 ? 'is-mid' : 'is-low';

      $('#stamp').className = 'stamp ' + cls;
      $('#stampBand').textContent = band;
      $('#verdict').textContent = verdictText(score, goal);

      // count the score up — small, user-triggered, worth the attention
      var num = $('#scoreNum'), reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (reduce) { num.textContent = score; }
      else {
        var n = 0, step = Math.max(1, Math.round(score / 26));
        var t = setInterval(function () {
          n = Math.min(score, n + step); num.textContent = n;
          if (n >= score) clearInterval(t);
        }, 22);
      }

      var ul = $('#routes'); ul.innerHTML = '';
      (ROUTES[goal] || ROUTES.study).forEach(function (r) {
        var li = document.createElement('li'); li.textContent = r; ul.appendChild(li);
      });

      var goalLabel = form.querySelector('#q-goal').selectedOptions[0].textContent;
      var msg = 'Hi AI Overseas, I used the eligibility check on aioverseas.co.in.\n' +
                'Goal: ' + goalLabel + '\nScore: ' + score + '/100 (' + band + ')\n' +
                'Age band: ' + form.querySelector('#q-age').selectedOptions[0].textContent + '\n' +
                'Education: ' + form.querySelector('#q-edu').selectedOptions[0].textContent + '\n' +
                'English: ' + form.querySelector('#q-eng').selectedOptions[0].textContent + '\n' +
                'Experience: ' + form.querySelector('#q-exp').selectedOptions[0].textContent + '\n' +
                'Please advise on my options.';
      $('#waResult').href = 'https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(msg);

      form.hidden = true; out.hidden = false;
      out.scrollIntoView({ block: 'nearest', behavior: reduce ? 'auto' : 'smooth' });
    });

    $('#redo').addEventListener('click', function () {
      out.hidden = true; form.hidden = false; form.querySelector('select').focus();
    });
  }

  /* ---------------- destination filter ---------------- */
  var chips = $$('.chip'), rows = $$('.dest-row'), empty = $('#destEmpty');
  chips.forEach(function (chip) {
    chip.addEventListener('click', function () {
      chips.forEach(function (c) { c.classList.remove('is-on'); });
      chip.classList.add('is-on');
      var f = chip.dataset.filter, shown = 0;
      rows.forEach(function (row) {
        var ok = f === 'all' || row.dataset.tags.split(' ').indexOf(f) > -1;
        row.hidden = !ok; if (ok) shown++;
      });
      if (empty) empty.hidden = shown > 0;
    });
  });

  /* ---------------- document checklist ---------------- */
  var BASE = [
    'Passport, first and last pages, plus all used pages',
    'Passport-size photographs to the destination specification',
    'All academic mark sheets and degree certificates',
    'Birth certificate or 10th certificate as date-of-birth proof',
    'Aadhaar and PAN copies',
    'Any previous visas, stamps and refusal letters'
  ];
  var CHECK = {
    study: BASE.concat([
      'IELTS / PTE / TOEFL / Duolingo score report',
      'Statement of purpose, drafted with us',
      'Offer or admission letter and tuition fee receipt',
      'Six months of bank statements, bank stamped',
      'Loan sanction letter if the funding is a loan',
      'Sponsor affidavit and sponsor income proof',
      'Property valuation or CA net-worth certificate',
      'Medical examination report from a panel clinic',
      'Gap justification for any break in studies'
    ]),
    work: BASE.concat([
      'Updated CV in the destination format',
      'Job offer or employment contract from the overseas employer',
      'Sponsorship or LMIA reference number where applicable',
      'Experience letters on letterhead, with role and dates',
      'Salary slips and Form 16 for the last two years',
      'Trade certificate or skill assessment result',
      'Police clearance certificate',
      'Medical examination report'
    ]),
    pr: BASE.concat([
      'Educational credential assessment (ECA / equivalency)',
      'English test result within validity',
      'Detailed experience letters with hours and duties',
      'Salary slips, bank credits and Form 16 for each claimed job',
      'Proof of settlement funds, six months seasoned',
      'Marriage certificate and spouse documents',
      'Police clearance certificate for every country lived in',
      'Medical examination for all family members'
    ]),
    visit: BASE.concat([
      'Cover letter explaining purpose and duration of travel',
      'Invitation letter from the host, with their status proof',
      'Six months of personal bank statements',
      'ITR acknowledgements for the last two or three years',
      'Employment leave letter, or business registration proof',
      'Property papers and other ties to India',
      'Confirmed travel itinerary and accommodation plan',
      'Travel insurance for the stay period'
    ]),
    business: BASE.concat([
      'Company incorporation certificate, GST and MSME registration',
      'Audited financials and ITRs for the last three years',
      'Board resolution or partnership authorisation to travel',
      'Business invitation letter from the overseas counterpart',
      'Trade fair or conference registration proof',
      'Import export code and sample trade invoices',
      'Company bank statements, six months',
      'Business profile and product catalogue'
    ])
  };
  var LABEL = {
    study: 'Study visa', work: 'Work permit', pr: 'Permanent residence',
    visit: 'Visitor / family visa', business: 'Business / investor visa'
  };

  var clType = $('#clType'), clList = $('#clList'), clTitle = $('#clTitle'), clMsg = $('#clMsg');
  function renderChecklist() {
    if (!clList) return;
    var k = clType.value;
    clTitle.textContent = LABEL[k] + ' — documents to arrange';
    clList.innerHTML = '';
    CHECK[k].forEach(function (item) {
      var li = document.createElement('li'); li.textContent = item; clList.appendChild(li);
    });
  }
  if (clType) {
    clType.addEventListener('change', function () { renderChecklist(); clMsg.textContent = ''; });
    renderChecklist();

    $('#clCopy').addEventListener('click', function () {
      var text = LABEL[clType.value] + ' — document checklist (AI Overseas Pvt Ltd)\n\n' +
                 CHECK[clType.value].map(function (i) { return '[ ] ' + i; }).join('\n') +
                 '\n\nQuestions: +91 93551 07739 | aioverseas.co.in';
      var done = function () { clMsg.textContent = 'Checklist copied. Paste it wherever you keep notes.'; };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done, function () {
          clMsg.textContent = 'Copy blocked by the browser. Select the list and copy manually.';
        });
      } else {
        var ta = document.createElement('textarea');
        ta.value = text; document.body.appendChild(ta); ta.select();
        try { document.execCommand('copy'); done(); }
        catch (e) { clMsg.textContent = 'Copy blocked by the browser. Select the list and copy manually.'; }
        document.body.removeChild(ta);
      }
    });

    $('#clPrint').addEventListener('click', function () { window.print(); });
  }

  /* ---------------- enquiry form ---------------- */
  var lead = $('#leadForm'), formMsg = $('#formMsg');
  if (lead) {
    lead.addEventListener('submit', function (e) {
      e.preventDefault();
      var name  = $('#f-name').value.trim();
      var phone = $('#f-phone').value.replace(/\D/g, '');
      var email = $('#f-email').value.trim();

      formMsg.classList.remove('is-err');
      if (name.length < 2)  { formMsg.textContent = 'Enter your full name so we know who is writing.'; formMsg.classList.add('is-err'); $('#f-name').focus(); return; }
      if (phone.length < 10) { formMsg.textContent = 'Enter a 10-digit mobile number we can call you back on.'; formMsg.classList.add('is-err'); $('#f-phone').focus(); return; }
      if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { formMsg.textContent = 'That email address looks incomplete. Check it, or leave it blank.'; formMsg.classList.add('is-err'); $('#f-email').focus(); return; }
      if (!$('#f-consent').checked) { formMsg.textContent = 'Tick the consent box so we may contact you.'; formMsg.classList.add('is-err'); $('#f-consent').focus(); return; }

      var body = 'New enquiry from aioverseas.co.in\n\n' +
                 'Name: ' + name + '\n' +
                 'Mobile: ' + phone + '\n' +
                 (email ? 'Email: ' + email + '\n' : '') +
                 'Destination: ' + $('#f-country').value + '\n' +
                 'Visa type: ' + $('#f-type').value + '\n' +
                 'Notes: ' + ($('#f-msg').value.trim() || '—');

      window.open('https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(body), '_blank', 'noopener');
      formMsg.textContent = 'Enquiry opened in WhatsApp — press send there and we will reply within one working day.';

      // email fallback for anyone without WhatsApp on this device
      var mail = document.createElement('a');
      mail.href = 'mailto:' + MAIL_TO + '?subject=' + encodeURIComponent('Visa enquiry — ' + name) + '&body=' + encodeURIComponent(body);
      mail.textContent = ' Send by email instead.';
      mail.style.color = 'inherit';
      formMsg.appendChild(mail);
    });
  }
})();
