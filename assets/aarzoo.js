/* Aarzoo — AI Overseas Private Limited site assistant
   Self-contained: injects its own styles and markup, no page edits needed.
   Chip taps answer instantly from the local KB (free). Typed questions go to
   the n8n webhook and are answered by Claude. The KB is also the offline
   fallback if the webhook times out or errors. */

(function () {
  'use strict';

  var API = 'https://cga.app.n8n.cloud/webhook/aarzoo-ai';
  var WA  = 'https://wa.me/919355107739?text=';
  var TIMEOUT = 22000;
  var history = [];

  /* ---------- local knowledge base (chips + offline fallback) ---------- */
  var KB = [
    { keys: ['which country', 'kaun sa desh', 'best country', 'country suits'],
      a: 'Depends on three things: your budget, your academics and how soon you want to move. Canada and Australia suit study-to-PR plans, Germany suits low tuition, UK suits a one-year masters, UAE suits quick employment. The free eligibility check on this page gives you an indicative read in under a minute.',
      cta: 'Check my eligibility', href: '#assess' },

    { keys: ['study visa document', 'documents for study', 'study documents', 'padhai ke documents'],
      a: 'Base list: passport, all marksheets and degrees, English test score, offer letter and fee receipt, six months of bank statements, sponsor affidavit with income proof, and a medical from a panel clinic. The Document Checklist tool on this page builds the full list for your exact route, and you can copy or print it.',
      cta: 'Build my checklist', href: '#checklist' },

    { keys: ['charge', 'fees', 'fee', 'kitna paisa', 'price', 'cost'],
      a: 'Fees are not published because they change with country and category. What is fixed is how you find out: the first assessment is free, and before any payment you get a written quote that separates our professional fee from government fees, English test, medicals and courier. No verbal numbers.',
      cta: 'Get a free assessment', href: '#contact' },

    { keys: ['refusal', 'rejected', 'reject', 'refuse'],
      a: 'A past refusal is not the end. We read the refusal letter, work out what the officer was not satisfied about — usually funds, intent to return or an inconsistency — and rebuild the file around that gap. One thing is non-negotiable: every past refusal must be disclosed. Hiding one is what actually ends a case.',
      cta: 'Discuss my refusal', href: '#contact' },

    { keys: ['how long', 'kitna time', 'processing time', 'timeline'],
      a: 'File preparation is normally two to four weeks, driven mainly by how fast your documents come in. Government processing varies: Canada 8-24 weeks, Australia 6-20, UK 3-12, Germany 8-16, UAE 1-4. Those are published ranges, not promises — the visa office decides.',
      cta: 'Ask about my case', href: '#contact' },

    { keys: ['guarantee', 'guaranteed', 'sure visa', '100%'],
      a: 'No. Nobody can guarantee a visa — only the destination country decides, and anyone promising otherwise is usually planning to file something false in your name. What we can promise is an honest read on your case before you spend money.',
      cta: 'Get an honest read', href: '#assess' },

    { keys: ['human', 'talk to', 'call', 'counsellor', 'baat karni'],
      a: 'Sure. Call +91 93551 07739 or +91 94163 88835, Monday to Saturday, 10:00 to 19:00 IST. Or tap below and WhatsApp us — a director or counsellor will pick it up.',
      cta: 'Talk to our team', href: null },

    { keys: ['work permit', 'job abroad', 'naukri'],
      a: 'We handle employer-sponsored and open work routes for Canada, UK, Germany, New Zealand and the Gulf. Before anything else we verify the employer and the offer — that single step prevents most of the trouble people run into.',
      cta: 'Discuss a work permit', href: '#contact' },

    { keys: [' pr ', 'permanent residence', 'express entry', 'crs'],
      a: 'Points-based and provincial routes. We map your score honestly, tell you exactly what would move it — usually an English retest, a documented experience letter or credential assessment — and time the application around draw trends.',
      cta: 'Map my PR points', href: '#assess' }
  ];

  function kbLookup(q) {
    var s = ' ' + String(q).toLowerCase().replace(/[^a-z0-9\u0900-\u097F ]+/g, ' ').replace(/\s+/g, ' ') + ' ';
    for (var i = 0; i < KB.length; i++) {
      var keys = KB[i].keys;
      for (var k = 0; k < keys.length; k++) {
        var key = keys[k];
        var hit = key.indexOf(' ') > -1 ? s.indexOf(key) > -1 : s.indexOf(' ' + key.trim() + ' ') > -1;
        if (hit) return KB[i];
      }
    }
    return null;
  }

  /* ---------- styles ---------- */
  var css = '' +
    '.az-btn{position:fixed;right:18px;bottom:86px;z-index:61;display:flex;align-items:center;gap:.5rem;' +
      'padding:.62rem .95rem .62rem .62rem;border:0;border-radius:999px;cursor:pointer;' +
      'background:#04122B;color:#F2DCA1;font:600 .87rem/1 Archivo,Helvetica,Arial,sans-serif;' +
      'box-shadow:0 12px 30px -10px rgba(0,0,0,.6);transition:transform .2s ease}' +
    '.az-btn:hover{transform:translateY(-2px)}' +
    '.az-btn i{width:28px;height:28px;border-radius:50%;display:grid;place-items:center;flex:0 0 auto;' +
      'background:#D9A93E;color:#04122B;font-style:normal;font-weight:700;font-size:.9rem}' +
    '.az-dot{position:absolute;top:6px;right:10px;width:8px;height:8px;border-radius:50%;background:#2ECC71}' +
    '.az-box{position:fixed;right:18px;bottom:86px;z-index:62;width:min(374px,calc(100vw - 32px));' +
      'max-height:min(620px,calc(100vh - 120px));display:none;flex-direction:column;overflow:hidden;' +
      'background:#fff;border-radius:16px;box-shadow:0 34px 70px -24px rgba(0,0,0,.62);' +
      'font-family:Archivo,Helvetica,Arial,sans-serif}' +
    '.az-box.on{display:flex}' +
    '.az-head{background:#04122B;color:#fff;padding:.95rem 1rem;display:flex;align-items:center;gap:.65rem}' +
    '.az-head b{font:600 1rem/1.2 Fraunces,Georgia,serif;display:block}' +
    '.az-head small{display:block;font-size:.72rem;color:#A7BCD6;margin-top:2px}' +
    '.az-av{width:34px;height:34px;border-radius:50%;display:grid;place-items:center;flex:0 0 auto;' +
      'background:#D9A93E;color:#04122B;font-weight:700}' +
    '.az-x{margin-left:auto;background:none;border:0;color:#A7BCD6;font-size:1.4rem;line-height:1;cursor:pointer;padding:0 .2rem}' +
    '.az-x:hover{color:#fff}' +
    '.az-msgs{flex:1;overflow-y:auto;padding:1rem;background:#F1F4F8;display:flex;flex-direction:column;gap:.7rem}' +
    '.az-m{max-width:86%;padding:.7rem .85rem;border-radius:12px;font-size:.92rem;line-height:1.5;white-space:pre-wrap}' +
    '.az-bot{background:#fff;color:#0A1D38;border:1px solid #D3DEEB;border-bottom-left-radius:4px;align-self:flex-start}' +
    '.az-me{background:#04122B;color:#fff;border-bottom-right-radius:4px;align-self:flex-end}' +
    '.az-cta{align-self:flex-start;display:inline-block;margin-top:-.2rem;padding:.5rem .9rem;border-radius:6px;' +
      'background:#D9A93E;color:#04122B;font-size:.84rem;font-weight:600;text-decoration:none}' +
    '.az-cta:hover{background:#F2DCA1}' +
    '.az-chips{display:flex;gap:.4rem;overflow-x:auto;padding:.6rem 1rem;background:#fff;border-top:1px solid #D3DEEB}' +
    '.az-chip{white-space:nowrap;border:1.5px solid #D3DEEB;background:#fff;color:#33507A;border-radius:999px;' +
      'padding:.36rem .8rem;font-size:.79rem;cursor:pointer}' +
    '.az-chip:hover{border-color:#D9A93E;color:#04122B}' +
    '.az-in{display:flex;gap:.5rem;padding:.7rem 1rem 1rem;background:#fff}' +
    '.az-in input{flex:1;border:1.5px solid #D3DEEB;border-radius:999px;padding:.62rem .95rem;font:400 .92rem Archivo,Arial,sans-serif;color:#0A1D38}' +
    '.az-in input:focus{outline:none;border-color:#1268C3}' +
    '.az-in button{border:0;border-radius:50%;width:42px;height:42px;flex:0 0 auto;cursor:pointer;' +
      'background:#D9A93E;color:#04122B;font-size:1.05rem;font-weight:700}' +
    '.az-in button:disabled{opacity:.5;cursor:default}' +
    '.az-typing{display:flex;gap:4px;padding:.85rem}' +
    '.az-typing span{width:6px;height:6px;border-radius:50%;background:#8FA6C0;animation:azb 1.1s infinite}' +
    '.az-typing span:nth-child(2){animation-delay:.16s}.az-typing span:nth-child(3){animation-delay:.32s}' +
    '@keyframes azb{0%,60%,100%{opacity:.3;transform:translateY(0)}30%{opacity:1;transform:translateY(-4px)}}' +
    '.az-note{font-size:.7rem;color:#54677F;text-align:center;padding:0 1rem .7rem;background:#fff}' +
    '@media(max-width:520px){.az-box{right:8px;left:8px;width:auto;bottom:80px}.az-btn{right:12px;bottom:82px}' +
      '.az-btn span{display:none}.az-btn{padding:.62rem}}';

  var style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);

  /* ---------- markup ---------- */
  var btn = document.createElement('button');
  btn.className = 'az-btn';
  btn.setAttribute('aria-label', 'Chat with Aarzoo');
  btn.innerHTML = '<i>A</i><span>Ask Aarzoo</span><span class="az-dot"></span>';

  var box = document.createElement('div');
  box.className = 'az-box';
  box.setAttribute('role', 'dialog');
  box.setAttribute('aria-label', 'Chat with Aarzoo');
  box.innerHTML =
    '<div class="az-head"><span class="az-av">A</span><span><b>Aarzoo</b>' +
      '<small>AI assistant &middot; AI Overseas</small></span>' +
      '<button class="az-x" aria-label="Close chat">&times;</button></div>' +
    '<div class="az-msgs" id="azMsgs"></div>' +
    '<div class="az-chips" id="azChips"></div>' +
    '<div class="az-in"><label class="sr" for="azInput">Your question</label>' +
      '<input id="azInput" type="text" placeholder="Type your question\u2026" autocomplete="off" maxlength="500">' +
      '<button id="azSend" aria-label="Send">&#8593;</button></div>' +
    '<p class="az-note">Aarzoo is an AI. She can be wrong \u2014 confirm anything important with the team.</p>';

  document.body.appendChild(btn);
  document.body.appendChild(box);

  var msgs = box.querySelector('#azMsgs');
  var chips = box.querySelector('#azChips');
  var input = box.querySelector('#azInput');
  var send = box.querySelector('#azSend');

  /* ---------- rendering ---------- */
  function bubble(text, who) {
    var d = document.createElement('div');
    d.className = 'az-m ' + (who === 'me' ? 'az-me' : 'az-bot');
    d.textContent = text;
    msgs.appendChild(d);
    msgs.scrollTop = msgs.scrollHeight;
    return d;
  }

  function ctaLink(label, href) {
    var a = document.createElement('a');
    a.className = 'az-cta';
    if (href && href.charAt(0) === '#') {
      a.href = (location.pathname.indexOf('news') > -1 ? 'index.html' : '') + href;
    } else {
      a.href = href;
      a.target = '_blank';
      a.rel = 'noopener';
    }
    a.textContent = label;
    msgs.appendChild(a);
    msgs.scrollTop = msgs.scrollHeight;
  }

  function typing() {
    var d = document.createElement('div');
    d.className = 'az-m az-bot az-typing';
    d.innerHTML = '<span></span><span></span><span></span>';
    msgs.appendChild(d);
    msgs.scrollTop = msgs.scrollHeight;
    return d;
  }

  var CHIPS = [
    'Which country suits me?',
    'Study visa documents',
    'How much do you charge?',
    'I had a refusal earlier',
    'How long does it take?',
    'Talk to a human'
  ];

  CHIPS.forEach(function (c) {
    var b = document.createElement('button');
    b.className = 'az-chip';
    b.type = 'button';
    b.textContent = c;
    b.addEventListener('click', function () { ask(c, true); });
    chips.appendChild(b);
  });

  /* ---------- ask ---------- */
  function answerFromKB(q) {
    var hit = kbLookup(q);
    if (!hit) {
      bubble('Main abhi online jawab nahi de paa rahi. Aap WhatsApp par pooch lijiye — team turant reply karti hai.', 'bot');
      ctaLink('Ask on WhatsApp', WA + encodeURIComponent('Hi AI Overseas, ' + q));
      return;
    }
    bubble(hit.a, 'bot');
    ctaLink(hit.cta, hit.href || (WA + encodeURIComponent('Hi AI Overseas, ' + q)));
  }

  function ask(text, fromChip) {
    var q = String(text || '').trim();
    if (!q) return;
    bubble(q, 'me');
    history.push({ role: 'user', text: q });
    input.value = '';

    if (fromChip) {
      answerFromKB(q);
      history.push({ role: 'bot', text: 'answered from site info' });
      return;
    }

    send.disabled = true;
    var dots = typing();
    var done = false;

    var timer = setTimeout(function () {
      if (done) return;
      done = true;
      dots.remove();
      send.disabled = false;
      answerFromKB(q);
    }, TIMEOUT);

    fetch(API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: q, history: history.slice(-6) })
    })
      .then(function (r) { return r.json(); })
      .then(function (d) {
        if (done) return;
        done = true;
        clearTimeout(timer);
        dots.remove();
        send.disabled = false;
        var reply = (d && d.reply ? String(d.reply) : '').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>');
        if (!reply) { answerFromKB(q); return; }
        bubble(reply, 'bot');
        history.push({ role: 'bot', text: reply });
        if (d.handoff && d.wa_url) ctaLink(d.cta_label || 'Talk to our team', d.wa_url);
      })
      .catch(function () {
        if (done) return;
        done = true;
        clearTimeout(timer);
        dots.remove();
        send.disabled = false;
        answerFromKB(q);
      });
  }

  /* ---------- wiring ---------- */
  var opened = false;
  function open() {
    box.classList.add('on');
    btn.style.display = 'none';
    if (!opened) {
      opened = true;
      bubble('Namaste! Main Aarzoo hoon, AI Overseas ki AI assistant. Visa, study abroad, work permit ya PR — jo bhi poochna ho, English ya Hindi mein pooch lijiye.', 'bot');
    }
    setTimeout(function () { input.focus(); }, 80);
  }
  function close() { box.classList.remove('on'); btn.style.display = 'flex'; }

  btn.addEventListener('click', open);
  box.querySelector('.az-x').addEventListener('click', close);
  send.addEventListener('click', function () { ask(input.value, false); });
  input.addEventListener('keydown', function (e) { if (e.key === 'Enter') ask(input.value, false); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && box.classList.contains('on')) close(); });
})();
