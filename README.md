# Fairview Dental Clinic — website redesign concept

A redesign proposal for [fairviewdentalclinic.ie](https://www.fairviewdentalclinic.ie), built with the clinic's existing content, services, fee guide, team and opening hours.

> This is a design concept, not the official website. It is excluded from search engines (`noindex` + `robots.txt`).

## What's improved

- **Clear structure** — the current site is one long page. Here Home, About Us, Our Team, Services, Fees and Contact each get their own page, and every service links to its prices.
- **Mobile first** — sticky Call / Book / Directions bar, full-screen menu and large tap targets.
- **Late appointments up front** — "open until 7pm on Tuesdays and Wednesdays" is on the home page, with today's hours highlighted and a live "Open now / Closed now" status (Irish time).
- **Social proof** — the 4.7★ Google rating (79 reviews) sits next to the main call to action and links to the Google listing.
- **Services with guide prices** — each service links to its fees; the home page cards deep-link to each service.
- **Searchable fee guide** with category filters, plus PRSI, VHI/DeCare and free-consultation notes.
- **Appointment request form** — prepares an email to reception (name, phone, reason, preferred time), with a copy option. No server needed.
- **Getting here** — map, copy-address button, directions, the Fairview Park bus stop and on-street parking.
- **Real photos and logo** — the clinic's own FDC logo, team photos and rooms, instead of stock images.
- **Cleaner copy** — typos fixed ("RCSI", "networks") and photos described in words instead of file names such as "IMG_6345.jpeg".
- **Accessible** — semantic HTML, skip link, keyboard-friendly menu (focus trap, Esc to close), visible focus, reduced-motion support, meaningful image descriptions.
- **Current open/closed status** — refreshes every 30 seconds and on tab return without resetting the appointment form. Opening hours remain as published by the clinic.
- **Small-screen polish** — the top-bar phone stays on one line, while the status can wrap; the hero includes a dental icon alongside its family-dentist label.

## Stack

Plain HTML, CSS and JavaScript (ES modules). No build step, no dependencies.

```
index.html        page shell
css/styles.css    design system and layout
js/data.js        all content: services, fees, hours, team, contact details
js/app.js         router (#/, #/about, #/team, #/services, #/fees, #/contact), pages and interactions
js/icons.js       inline SVG icons and logo mark
assets/           logo, favicon, clinic and team photos
```

To change a price, an opening time or any text, edit `js/data.js` — every page reads from it.

## Run locally

```bash
npx http-server . -p 5173
```

Then open http://127.0.0.1:5173. (ES modules don't load from `file://`, so use a local server.)

## Deploy

Any static host works (Hostinger, GitHub Pages, Netlify): upload the files as they are. Routing uses `#/` URLs, so no server rewrite rules are needed.

Before going live as the official site, remove the `noindex` meta tag from `index.html`, replace `robots.txt`, and remove the "design concept" note in the footer (`js/app.js`).

## Content to confirm with the clinic

- Fees come from the current online fee guide (no date shown) and should be confirmed.
- Prices for children's dentistry and teeth whitening aren't listed on the current site, so they show "Ask reception".
- The fee guide lists hygienist appointments; confirm whether a hygienist should appear on the team page.
