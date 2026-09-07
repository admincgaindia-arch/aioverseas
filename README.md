# aioverseas.co.in — AI Overseas Private Limited

Static website. No build step, no server, no database. Upload the files as they are and the site runs.

```
index.html            home page (hero, eligibility check, destinations, services,
                      process, leadership, office gallery, commitments, checklist,
                      FAQ, contact)
visa-guide.html       full visa guide: six route tabs, country section, mistakes, glossary
news.html             daily visa & immigration updates, reads data/news.json
404.html              custom not-found page
data/news.json        news feed, rewritten every morning by the n8n workflow
CNAME                 custom domain for GitHub Pages
.nojekyll             stops GitHub from processing the files
robots.txt            search engine rules
sitemap.xml           page list for Google
site.webmanifest      installable-app metadata
assets/style.css      all styling for every page
assets/app.js         home page: eligibility checker, filters, checklist, form, gallery lightbox
assets/news.js        news page feed rendering, filters and search
assets/guide.js       visa guide route tabs
assets/aarzoo.js      Aarzoo chat widget (loads on all three main pages)
assets/logo.png       full logo lockup, transparent background
assets/logo-mark.png  emblem only, used in the header
assets/favicon.png / apple-touch-icon.png / icon-512.png
assets/og-image.png   preview image for WhatsApp, LinkedIn, Facebook
assets/office/*.jpg   office gallery images (-sm = grid thumb, full = lightbox)
```

## Connected automations (n8n, cga.app.n8n.cloud)

| Workflow | What it does |
|---|---|
| `Daily Visa News - aioverseas.co.in` | 07:30 IST daily. Reads news feeds, filters, Claude writes cards, commits `data/news.json`. |
| `Aarzoo Chatbot - aioverseas.co.in` | Webhook `POST /webhook/aarzoo-ai`. Answers site visitors, returns a pre-tagged WhatsApp handoff. |

Both must be **Published** in n8n or they will not run.

**Standing rule:** if you add a page, a service or a price to this site, update BOTH
`assets/aarzoo.js` (the local KB) and the Aarzoo system prompt in n8n. A page the chat
does not know about is a page the chat cannot sell.


---

## 1. Put it on GitHub

1. Create a new **public** repository. Name it `aioverseas` (or anything).
2. Upload every file above, keeping the `assets` folder as a folder.
3. Go to **Settings → Pages**.
4. Source: **Deploy from a branch**. Branch: `main`, folder: `/ (root)`. Save.
5. Wait 1–2 minutes. The site goes live at `https://<username>.github.io/aioverseas/`.

## 2. Point aioverseas.co.in at it

In your domain DNS panel, add these records:

| Type  | Name  | Value                   |
|-------|-------|-------------------------|
| A     | @     | 185.199.108.153         |
| A     | @     | 185.199.109.153         |
| A     | @     | 185.199.110.153         |
| A     | @     | 185.199.111.153         |
| CNAME | www   | `<username>.github.io`  |

Then in **Settings → Pages → Custom domain**, enter `aioverseas.co.in` and save.
Tick **Enforce HTTPS** once the certificate is issued (can take up to an hour).

The `CNAME` file already contains the domain, so this usually fills in by itself.

---

## 3. Things to update before you go live

| Where | What to change |
|---|---|
| `index.html` — footer disclaimer | Add the CIN once incorporation completes |
| `index.html` — `ProfessionalService` JSON-LD | Add the full registered office address |
| `index.html` — contact section | Add the office address and Google Maps link |
| `assets/app.js` — `WA_NUMBER` | Change if the WhatsApp line changes |
| FAQ "Are you registered?" | Add the CIN when available |

**Deliberately not included:** client counts, success rates and testimonials. Immigration
advertising rules and plain honesty both cut against invented numbers. Add real figures and
real reviews once you have them — a "Reviews" block can go between *How it works* and *Documents*.

---

## 4. How the interactive parts work

**Eligibility checker (hero).** Scores age, education, English, experience, funds and past
refusals out of 100, then shows a band (Strong / Workable / Needs work) and route suggestions
matched to what the visitor selected. The result builds a pre-filled WhatsApp message so the
lead reaches you with their answers attached. Scoring weights live at the top of the `<select>`
option values in `index.html` — change the numbers there to re-weight it.

**Destination filter.** Chips filter the country list by purpose. Tags are in
`data-tags` on each `.dest-row`.

**Document checklist.** Route dropdown builds a checklist from the `CHECK` object in
`app.js`. Copy and Print both work. Add country-specific lists by extending that object.

**Enquiry form.** Validates, then opens WhatsApp with the enquiry pre-written, with an email
fallback link. Nothing is stored anywhere, so there is no privacy exposure and no backend cost.

*Want enquiries in your inbox too?* Create a free form endpoint (Formspree, Web3Forms or
Google Forms), then in `index.html` change `<form class="contact-form" id="leadForm" novalidate>`
to add `action="YOUR_ENDPOINT" method="POST"` and remove the `e.preventDefault()` line in `app.js`.

---

## 5. Built in already

- Mobile-first responsive layout, tested down to 360px
- Keyboard navigation with visible focus rings, skip-to-content link
- `prefers-reduced-motion` respected
- Schema.org structured data: Organization, ProfessionalService, WebSite, FAQPage
- Open Graph and Twitter cards with a custom preview image
- Click-to-call, click-to-WhatsApp, floating WhatsApp button
- Print stylesheet (the document checklist prints clean)
- Zero third-party trackers; the only external request is Google Fonts

## 6. Brand assets

The uploaded logo has been cut out of its white background, so `logo.png` and
`logo-mark.png` sit cleanly on any colour. Site colours are pulled from the logo itself:
navy `#04193B`, royal blue `#0A62B8`, gold `#D6A238`. The tagline
*Your Dream, Our Direction!* appears in the hero and on the 404 page.

If you ever get the logo as a vector (AI / EPS / SVG) from your designer, drop the SVG in
`assets/` and swap the `<img>` sources — it will stay razor sharp at every size.
