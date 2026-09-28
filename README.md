# JustJava website

The JustJava marketing site, written in plain HTML, CSS and JavaScript. It has no framework, no build step and no dependencies to install.

Homepage weight: about 155 KB including fonts and the founder photo.

---

## 1. Run it locally

Use a local server. Double-clicking `index.html` mostly works, but fonts, the 404 page and some browser security rules behave properly only when the files are served over HTTP.

Pick one of these:

```bash
# Python (already on most machines)
python3 -m http.server 8080

# Node
npx serve .
```

You can also use the **Live Server** extension in VS Code: right-click `index.html` and choose "Open with Live Server".

Then open http://localhost:8080.

---

## 2. Project structure

```
index.html              Homepage
solutions.html          Solutions index
launch.html             Solution: Launch a Software Product
transform.html          Solution: Transform Business Operations
expertise.html          Solution: Turn Expertise into Software
connect.html            Solution: Connect Systems & Data
legacy.html             Solution: Modernise Legacy Software
ai-automation.html      Solution: AI Automation
rescue.html             Solution: Software Rescue
standard.html           The JustJava Standard
products.html           Products
hr-payroll.html         HR & Payroll Platform (product + case study)
case-studies.html       Case Studies
corecare.html           CoreCare
about.html              About
contact.html            Contact (the form becomes a ticket)
404.html                Not found page (uses absolute /paths on purpose)
sitemap.xml, robots.txt

assets/
  css/site.css          Shared styles: tokens, type, nav, menu, footer, components, homepage sections
  css/pages/<page>.css  Styles used only by that page
  js/site.js            Shared behaviour: nav hide/show, mobile menu, headline reveal, number roll
  js/pages/<page>.js    The page's own interaction (index.js is the homepage)
  fonts/                Creato Display (Regular, Medium, Bold) as subset woff2 + its licence
  img/founder.webp      Founder photo
  brand/                Logo files (SVG)
```

### How a page is put together

Every page has the same shell:

1. `<head>`: meta tags, `site.css`, then `pages/<page>.css`
2. skip link, header (`.nav`), mobile menu (`.sheet`)
3. `<main id="top">`: the page content
4. footer
5. `site.js` first, then `pages/<page>.js`, both with `defer`

`site.js` exposes `window.JJ = { reduce, roll }`:
- `JJ.reduce` is `true` when the visitor has turned on reduced motion. Every animation must check it and jump to its final state.
- `JJ.roll(element, text)` swaps a number or status label with a short roll-in animation.

Each page script is wrapped in its own function, so nothing leaks between pages.

### Adding a new page

1. Copy the closest existing page (for example `launch.html` for a new solution).
2. Change the `<title>`, description, canonical URL and the content inside `<main>`.
3. Create `assets/css/pages/<new>.css` and `assets/js/pages/<new>.js` only if the page needs them, and update the two tags in `<head>`.
4. Add the page to the nav, the mobile menu and the footer on **every** page (they are copied into each file), and to `sitemap.xml`.

---

## 3. Before going live

### Must do

- [ ] **Connect the contact form.** Open `contact.html`, find `<form id="form" ... data-endpoint="">` and set `data-endpoint` to the URL that should receive submissions. Until it is set, the form shows the success state but **nothing is sent** (a warning appears in the browser console). The form posts JSON with these fields:
  `name, company, email, type, achieve, today, why, time, budget, links`.
  A hidden field called `website` is a spam trap. If it has a value, the browser silently skips sending. Validate on the server too.
  A minimal Spring Boot receiver:
  ```java
  @RestController
  @RequestMapping("/api/requirements")
  @CrossOrigin(origins = "https://www.justjava.tech")
  class RequirementController {
      record Requirement(@NotBlank String name, String company, @NotBlank @Email String email,
                         String type, @NotBlank String achieve, String today, String why,
                         String time, String budget, String links) {}

      @PostMapping
      ResponseEntity<Void> receive(@Valid @RequestBody Requirement r) {
          // save it, then notify the sales inbox
          return ResponseEntity.accepted().build();
      }
  }
  ```
  A form service such as Formspree also works if you do not want to run an endpoint.
- [ ] **Publish a privacy policy** before the form goes live. The form collects personal data, and the Nigeria Data Protection Act 2023 requires a notice explaining how it is used. Add `privacy.html`, link it in the footer, and add one line under the form's submit button pointing to it.
- [ ] **Confirm the client platform exists.** The homepage ENGINEER chapter, the CoreCare "Report" responsibility and the About page value "Visibility by default" all say clients follow their work through the JustJava client platform. If it does not exist yet, rewrite those lines before launch.
- [ ] **Confirm every claim and example with management:**
  - 90 days of Launch Assurance
  - no recruitment fee
  - the example ticket (US-024)
  - the system logs on the Connect page
  - payroll figures (312 employees, ₦48.6m gross)
  - the rescue assessment findings
  - the legacy screen data
  - scope baseline sprints

  Illustrative content is labelled on the page, but the commercial claims must be true.
- [ ] **Configure the 404 page on the host:**
  - Netlify and Vercel use `404.html` automatically
  - Apache: `ErrorDocument 404 /404.html`
  - Nginx: `error_page 404 /404.html;`
- [ ] **Add a social sharing image:** 1200 × 630, saved as `assets/img/og.png`, then uncomment the `og:image` tag in each page's `<head>`.
- [ ] **Serve over HTTPS on `https://www.justjava.tech`.** Canonical URLs and the sitemap already use that domain.

### Should do

- [ ] Test on a real iPhone, a mid-range Android and a low-end Android, on mobile data.
- [ ] Run Lighthouse (mobile). Target 90+ for performance, accessibility, best practices and SEO.
- [ ] Self-host IBM Plex Mono (it is open source) instead of loading it from Google Fonts. That is faster and avoids sending visitor IP addresses to Google.
- [ ] If you add analytics, prefer a cookie-free tool so you do not need a cookie banner.
- [ ] Caching: asset filenames are not versioned. Either give `/assets/` a short cache time (for example 1 hour), or add `?v=2` to the CSS and JS tags whenever you change those files.
- [ ] Replace `assets/img/founder.webp` with the original high-resolution photo when available (same portrait ratio, around 1280 px wide).
- [ ] Footer links for Insights, Terms of Use, Privacy Policy and Cookies were removed because those pages do not exist yet. Add them back as the pages are written.

---

## 4. Editing

- **Copy** lives directly in each HTML file.
- **Colours, type sizes and spacing** are CSS custom properties at the top of `assets/css/site.css`. Change them there, not in individual rules.
- **Design and motion rules** are in `CLAUDE.md`. Read it before changing anything visual. It is also what keeps AI coding assistants consistent with the design.

---

## 5. Quality checks already done

- All 17 pages load with no JavaScript errors and no missing files.
- No page scrolls sideways at 390 px (phone) or 1440 px (laptop).
- Automated accessibility scan (axe-core, WCAG 2 A/AA) passes on the final state of every page. Two items appear only while an animation is still running (a dimmed log line on CoreCare, the fading replay button on the homepage) and clear when it finishes.
- Every animation has a reduced-motion version that shows the final state immediately.
