import {
  clinic, hours, nav, highlights, team, staff, aboutPillars, services, feeGroups, savings, feeNote, areas, faqs,
} from './data.js';
import { icon, logoMark } from './icons.js';

/* ---------- helpers ---------- */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const callBtn = (cls = 'btn--primary', label = `Call ${clinic.phone}`) =>
  `<a class="btn ${cls}" href="${clinic.phoneHref}">${icon('phone')}<span>${label}</span></a>`;
const emailBtn = (cls = 'btn--ghost', label = 'Email the clinic') =>
  `<a class="btn ${cls}" href="mailto:${clinic.email}?subject=Appointment%20request">${icon('mail')}<span>${label}</span></a>`;
const bookLink = (cls = 'btn--primary', label = 'Request an appointment') =>
  `<a class="btn ${cls}" href="#/contact" data-scroll="appointment">${icon('calendar')}<span>${label}</span></a>`;

const stars = () => `<span class="stars" aria-hidden="true">★★★★★</span>`;
const ratingLine = () =>
  `<a class="rating" href="${clinic.mapsUrl}" target="_blank" rel="noopener" aria-label="View the clinic on Google Maps: ${clinic.rating.score} out of 5 from ${clinic.rating.count} reviews">${stars()}<span><strong>${clinic.rating.score}</strong> from ${clinic.rating.count} ${clinic.rating.source} reviews</span>${icon('arrowRight')}</a>`;

const sectionHead = ({ eyebrow, title, lead, center }) => `
  <header class="section-head${center ? ' section-head--center' : ''}" data-reveal>
    ${eyebrow ? `<p class="eyebrow">${eyebrow}</p>` : ''}
    <h2 class="h2">${title}</h2>
    ${lead ? `<p class="lead">${lead}</p>` : ''}
  </header>`;

const pageHero = ({ crumb, eyebrow, title, lead, actions = '' }) => `
  <section class="page-hero">
    <div class="container">
      <nav class="crumbs" aria-label="Breadcrumb"><a href="#/">Home</a>${icon('chevronRight')}<span aria-current="page">${crumb}</span></nav>
      ${eyebrow ? `<p class="eyebrow">${eyebrow}</p>` : ''}
      <h1 class="h1">${title}</h1>
      ${lead ? `<p class="lead">${lead}</p>` : ''}
      ${actions ? `<div class="btn-row">${actions}</div>` : ''}
    </div>
  </section>`;

const accordion = (items, name = 'faq') => `
  <div class="accordion">
    ${items.map((it) => `
      <details class="accordion__item" name="${name}">
        <summary><span>${it.q}</span><span class="accordion__icon" aria-hidden="true"></span></summary>
        <div class="accordion__body"><p>${it.a}</p></div>
      </details>`).join('')}
  </div>`;

/* ---------- opening hours ---------- */
function dublinNow() {
  const now = new Date(new Date().toLocaleString('en-US', { timeZone: 'Europe/Dublin' }));
  return { day: now.getDay(), mins: now.getHours() * 60 + now.getMinutes() };
}

function openStatus() {
  const { day, mins } = dublinNow();
  const today = hours.find((h) => h.day === day);
  if (today?.open != null && mins >= today.open && mins < today.close) {
    return { open: true, text: `Open now · until ${today.text.split('–')[1].trim()}` };
  }
  // Next opening time.
  for (let i = 0; i < 8; i++) {
    const d = (day + i) % 7;
    const h = hours.find((x) => x.day === d);
    if (h?.open == null) continue;
    if (i === 0 && mins >= h.open) continue;
    const start = h.text.split('–')[0].trim();
    const when = i === 0 ? 'today' : i === 1 ? 'tomorrow' : h.label;
    return { open: false, text: `Closed · opens ${when} at ${start}` };
  }
  return { open: false, text: 'Closed' };
}

const hoursList = () => {
  const { day } = dublinNow();
  return `
  <ul class="hours">
    ${hours.map((h) => `
      <li data-day="${h.day}" class="${h.day === day ? 'is-today' : ''}"><span>${h.label} <em${h.day === day ? '' : ' hidden'}>Today</em></span><span>${h.text}</span></li>`).join('')}
  </ul>`;
};

function refreshOpeningStatus() {
  const status = openStatus();
  $$('[data-live-status]').forEach((el) => {
    el.classList.toggle('is-open', status.open);
    $('[data-status-text]', el).textContent = status.text;
  });
  const { day } = dublinNow();
  $$('.hours li[data-day]').forEach((el) => {
    const isToday = Number(el.dataset.day) === day;
    el.classList.toggle('is-today', isToday);
    $('em', el).hidden = !isToday;
  });
}

/* ---------- shared blocks ---------- */
function visitBlock() {
  return `
  <section class="section section--alt" id="visit">
    <div class="container split">
      <div data-reveal>
        <p class="eyebrow">Visit us</p>
        <h2 class="h2">In the heart of Dublin 3.</h2>
        <ul class="contact-list">
          <li>${icon('mapPin')}<div>${clinic.addressLines.join('<br>')}<button type="button" class="link-btn" data-copy="${esc(clinic.addressText)}">${icon('copy')}Copy address</button></div></li>
          <li>${icon('phone')}<div><a href="${clinic.phoneHref}">${clinic.phone}</a></div></li>
          <li>${icon('mail')}<div><a href="mailto:${clinic.email}">${clinic.email}</a></div></li>
          <li>${icon('bus')}<div>The Fairview Park bus stop is just outside our door, served by 15 Dublin Bus routes including the H1, H2 and H3.</div></li>
          <li>${icon('car')}<div>Ample on-street parking.</div></li>
        </ul>
        <p class="areas"><span class="muted small">Walking distance from</span>${areas.walk.map((a) => `<span class="tag">${a}</span>`).join('')}</p>
        <div class="btn-row">
          <a class="btn btn--primary" href="${clinic.directionsUrl}" target="_blank" rel="noopener">${icon('navigation')}<span>Get directions</span></a>
          ${callBtn('btn--ghost')}
        </div>
      </div>
      <div class="map" data-reveal>
        <iframe title="Map showing ${clinic.name}" loading="lazy" src="${clinic.mapEmbed}" referrerpolicy="no-referrer-when-downgrade"></iframe>
      </div>
    </div>
  </section>`;
}

function ctaBand(title = 'Ready to book?', text = 'Call reception and we’ll find a time that suits you, including early mornings and evenings until 7pm on Tuesdays and Wednesdays.') {
  return `
  <section class="section section--tight">
    <div class="container">
      <div class="band" data-reveal>
        <div>
          <h2 class="h2">${title}</h2>
          <p>${text}</p>
        </div>
        <div class="btn-row">${callBtn('btn--primary')}${emailBtn('btn--light', 'Email us')}</div>
      </div>
    </div>
  </section>`;
}

/* ---------- pages ---------- */
function renderHome() {
  const status = openStatus();
  return `
  <section class="hero">
    <div class="container hero__grid">
      <div class="hero__copy">
        <p class="eyebrow">${icon('tooth')}Your family dentist · Dublin 3</p>
        <h1 class="display">Friendly dentistry.<br><span>Right here in Fairview.</span></h1>
        <p class="lead">Dr Aoife Lynch and Dr Aidan Ahern welcome new and existing patients to their newly refurbished clinic, from routine check-ups to emergencies, Invisalign and whitening.</p>
        <div class="btn-row">${callBtn()}${bookLink('btn--ghost')}</div>
        <p class="hero__availability">${icon('clock')}Appointments until 7pm on Tuesdays and Wednesdays</p>
        ${ratingLine()}
      </div>
      <aside class="hero__practice" aria-label="The clinic and opening hours">
        <figure class="practice-photo">
          <img src="assets/surgery.jpg" width="825" height="1100" fetchpriority="high" alt="A treatment room at Fairview Dental Clinic">
          <figcaption><span>Newly refurbished. Same friendly welcome.</span><a href="#/team">Meet your dentists ${icon('arrowRight')}</a></figcaption>
        </figure>
        <div class="hero-hours">
          <p class="status ${status.open ? 'is-open' : ''}" data-live-status><span class="dot"></span><span data-status-text>${status.text}</span></p>
          <h2 class="h3">Early starts, later finishes.</h2>
          <div class="hero-hours__summary"><span>Tuesday &amp; Wednesday<strong>8am – 7pm</strong></span><span>Mon, Thu &amp; Fri<strong>until 5.30pm</strong></span></div>
          <details class="hero-hours__details"><summary>See all opening hours ${icon('chevronRight')}</summary>${hoursList()}</details>
        </div>
      </aside>
    </div>
  </section>

  <section class="section section--flush">
    <div class="container">
      <ul class="highlights">
        ${highlights.map((h) => `<li data-reveal>${icon(h.icon)}<div><strong>${h.title}</strong><span>${h.text}</span></div></li>`).join('')}
      </ul>
    </div>
  </section>

  <section class="section section--alt">
    <div class="container split split--center split--wide">
      <div class="stats" data-reveal aria-label="The clinic in numbers">
        <div><b>20+ years</b><span>Caring for the people of Fairview</span></div>
        <div><b>${clinic.rating.score} ★</b><span>Average rating from ${clinic.rating.count} Google reviews</span></div>
        <div><b>7pm</b><span>Late appointments on Tuesdays and Wednesdays</span></div>
      </div>
      <div data-reveal>
        <p class="eyebrow">About the clinic</p>
        <h2 class="h2">A new chapter for a Fairview favourite.</h2>
        <p>Fairview Dental Clinic has been proudly serving the people of Fairview for over 20 years. Since December 2022 it has been run by Dr Aoife Lynch and Dr Aidan Ahern, who keep up to date with the latest developments in modern dentistry to give you the highest quality of care.</p>
        <a class="text-link" href="#/about">About the clinic ${icon('arrowRight')}</a>
      </div>
    </div>
  </section>

  <section class="section">
    <div class="container">
      ${sectionHead({ eyebrow: 'Services', title: 'Care for the whole family, under one roof.', lead: 'From routine exams and hygiene to crowns, Invisalign and facial aesthetics.' })}
      <div class="cards">
        ${services.slice(0, 6).map((t) => `
          <a class="card" href="#/services/${t.id}" data-reveal>
            <span class="card__icon">${icon(t.icon)}</span>
            <h3 class="h4">${t.title}</h3>
            <p>${t.short}</p>
            <span class="card__more">Learn more ${icon('arrowRight')}</span>
          </a>`).join('')}
      </div>
      <p class="center"><a class="btn btn--ghost" href="#/services">See all services ${icon('arrowRight')}</a></p>
    </div>
  </section>

  <section class="section section--alt">
    <div class="container split split--center">
      <div data-reveal>
        <p class="eyebrow">Fees</p>
        <h2 class="h2">Clear prices, no surprises.</h2>
        <p>Our fee guide is online, so you know what to expect before you come in. Eligible PRSI patients pay €15 for an exam, scale and polish, and reception can check your eligibility for you.</p>
        <a class="btn btn--primary" href="#/fees">View our fees ${icon('arrowRight')}</a>
      </div>
      <div class="price-peek" data-reveal>
        ${[['PRSI exam, scale & polish (if eligible)', '€15'], ['Exam / emergency assessment', '€60'], ['Scale & polish', '€85'], ['White filling', 'from €180']]
          .map(([n, p]) => `<div class="fee-row"><span>${n}</span><span>${p}</span></div>`).join('')}
      </div>
    </div>
  </section>

  ${visitBlock()}
  ${ctaBand()}`;
}

function renderAbout() {
  return `
  ${pageHero({
    crumb: 'About Us', eyebrow: 'About us',
    title: 'Over 20 years in Fairview.',
    lead: 'Fairview Dental Clinic has been proudly serving the people of Fairview for over 20 years. Now it enters a new chapter, under the care of Dr Aoife Lynch and Dr Aidan Ahern.',
    actions: callBtn() + bookLink('btn--ghost'),
  })}
  <section class="section section--flush">
    <div class="container">
      <figure class="about-photo" data-reveal><img class="about-photo__place" src="assets/clinic.jpg" width="825" height="1100" alt="The newly refurbished clinic, looking through to a treatment room" loading="lazy"><figcaption><p class="eyebrow">Come and see us</p><h2 class="h2">A newly refurbished clinic.</h2><p>Dr Aoife and Dr Aidan took charge of the clinic in December 2022 and look forward to providing top-quality dental care to the people of Fairview for years to come.</p></figcaption></figure>
    </div>
  </section>
  <section class="section">
    <div class="container">
      ${sectionHead({ eyebrow: 'Our approach', title: 'Modern dentistry, explained clearly.', lead: 'We pride ourselves on keeping up to date with the latest developments in modern dentistry and providing the highest quality of care for our patients.' })}
      <div class="pillars">
        ${aboutPillars.map((p) => `<article class="pillar" data-reveal><span class="card__icon">${icon(p.icon)}</span><h3 class="h4">${p.title}</h3><p>${p.text}</p></article>`).join('')}
      </div>
    </div>
  </section>
  <section class="section section--alt">
    <div class="container split split--center">
      <div data-reveal>
        <p class="eyebrow">Qualifications</p>
        <h2 class="h2">Trained at the Royal College of Surgeons in Ireland.</h2>
        <p>Dr Aoife and Dr Aidan have both completed the Diploma of Primary Care Dentistry (Dip PCD RCSI) and the Membership of the Faculty of Dentistry (MFD RCSI), and regularly attend courses to further their dental knowledge.</p>
        <a class="text-link" href="#/team">Meet the team ${icon('arrowRight')}</a>
      </div>
      <ul class="credentials" data-reveal>
        <li>${icon('badge')}<div><strong>Dip PCD RCSI</strong><span>Diploma of Primary Care Dentistry</span></div></li>
        <li>${icon('badge')}<div><strong>MFD RCSI</strong><span>Membership of the Faculty of Dentistry</span></div></li>
        <li>${icon('shield')}<div><strong>VHI Dental &amp; DeCare Dental</strong><span>Member of both dental networks</span></div></li>
      </ul>
    </div>
  </section>
  ${ctaBand('We look forward to meeting you.', `Call reception on ${clinic.phone} to book your visit.`)}`;
}

function renderTeam() {
  return `
  ${pageHero({
    crumb: 'Our Team', eyebrow: 'Our team',
    title: 'The friendly faces at Fairview.',
    lead: 'Two dentists who trained together at University College Cork, supported by a welcoming reception and nursing team.',
    actions: callBtn() + bookLink('btn--ghost'),
  })}
  <section class="section section--flush">
    <div class="container">
      <div class="team">
        ${team.map((m) => `
          <article class="person" data-reveal>
            <img class="person__avatar person__avatar--photo" src="${m.photo}" alt="${m.name}" loading="lazy">
            <div>
              <h2 class="h3">${m.name}</h2>
              <p class="person__role">${m.role}</p>
              <p class="person__quals">${m.quals}</p>
              ${m.bio.map((p) => `<p>${p}</p>`).join('')}
              <p class="person__outside">${m.outside}</p>
            </div>
          </article>`).join('')}
      </div>
      <div class="staff">
        ${staff.map((s) => `<article class="staff__card" data-reveal><img class="person__avatar person__avatar--sm person__avatar--photo" src="${s.photo}" alt="${s.name}" loading="lazy"><div><h2 class="h4">${s.name}</h2><p class="person__role">${s.role}</p></div></article>`).join('')}
      </div>
    </div>
  </section>
  ${ctaBand('Nervous about your visit?', 'Let reception know when you book. Dr Aidan strives to provide a relaxed and calming environment for anxious patients.')}`;
}

function renderServices(sub) {
  return `
  ${pageHero({
    crumb: 'Services', eyebrow: 'Our services',
    title: 'From <span class="nowrap">check-ups</span> to Invisalign.',
    lead: 'General, cosmetic and emergency dentistry for adults and children, plus facial aesthetics.',
  })}
  <section class="section section--flush">
    <div class="container">
      <nav class="chip-nav" aria-label="Jump to a service">
        ${services.map((t) => `<a class="chip" href="#/services/${t.id}">${t.title}</a>`).join('')}
      </nav>
    </div>
  </section>
  <section class="section">
    <div class="container treatment-list">
      ${services.map((t) => `
        <article class="treatment${sub === t.id ? ' is-target' : ''}" id="t-${t.id}" data-reveal>
          <span class="card__icon card__icon--lg">${icon(t.icon)}</span>
          <div class="treatment__body">
            <h2 class="h3">${t.title}</h2>
            ${t.body.map((p) => `<p>${p}</p>`).join('')}
          </div>
          <aside class="treatment__fee"><span class="muted">Guide price</span><strong>${t.fee}</strong><a class="text-link" href="#/fees">All fees ${icon('arrowRight')}</a></aside>
        </article>`).join('')}
    </div>
  </section>
  ${ctaBand('Not sure what you need?', 'Book an exam and your dentist will talk you through your options and costs.')}`;
}

function renderFees() {
  return `
  ${pageHero({
    crumb: 'Fees', eyebrow: 'Fee guide',
    title: 'Clear prices, no surprises.',
    lead: 'A guide to our treatment fees, so you know what to expect before your visit.',
  })}
  <section class="section section--flush">
    <div class="container">
      <div class="savings savings--3">
        ${savings.map((s) => `<article data-reveal>${icon('badge')}<div><strong>${s.title}</strong><p>${s.text}</p></div></article>`).join('')}
      </div>
    </div>
  </section>
  <section class="section">
    <div class="container">
      <div class="fee-tools">
        <label class="search">
          ${icon('search')}
          <span class="sr-only">Search fees</span>
          <input type="search" id="fee-search" placeholder="Search a treatment, e.g. filling" autocomplete="off">
        </label>
        <div class="chip-nav chip-nav--filters" role="group" aria-label="Filter by category">
          <button type="button" class="chip is-active" data-filter="all" aria-pressed="true">All</button>
          ${feeGroups.map((g) => `<button type="button" class="chip" data-filter="${g.id}" aria-pressed="false">${g.title}</button>`).join('')}
        </div>
      </div>
      <div class="fee-groups" id="fee-groups">
        ${feeGroups.map((g) => `
          <section class="fee-card" data-group="${g.id}">
            <h2 class="h4">${icon(g.icon)}${g.title}</h2>
            ${g.items.map(([n, p]) => `<div class="fee-row" data-name="${esc(`${g.title} ${n}`.toLowerCase())}"><span>${n}</span><span>${p}</span></div>`).join('')}
          </section>`).join('')}
      </div>
      <p class="empty" id="fee-empty" hidden>No treatment matches your search. Call us on <a href="${clinic.phoneHref}">${clinic.phone}</a> and we’ll be happy to help.</p>
      <aside class="notice">${icon('info')}<p>${feeNote}</p></aside>
    </div>
  </section>
  ${ctaBand('Questions about a treatment or its cost?', `Call us on ${clinic.phone} and we’ll talk you through it.`)}`;
}

function renderContact() {
  const status = openStatus();
  return `
  ${pageHero({
    crumb: 'Contact', eyebrow: 'Contact us',
    title: 'Let’s find a time that suits you.',
    lead: 'Call reception to arrange an appointment, or prepare an email request below. The clinic will confirm your appointment directly.',
    actions: callBtn() + emailBtn('btn--ghost'),
  })}
  <section class="section section--flush">
    <div class="container contact-grid">
      <a class="contact-card" href="${clinic.phoneHref}">${icon('phone')}<span class="muted">Call reception</span><strong>${clinic.phone}</strong><span class="small muted">Emergency appointments kept daily</span></a>
      <a class="contact-card" href="mailto:${clinic.email}">${icon('mail')}<span class="muted">Email</span><strong>${clinic.email}</strong></a>
      <a class="contact-card" href="${clinic.directionsUrl}" target="_blank" rel="noopener">${icon('mapPin')}<span class="muted">Address</span><strong>${clinic.addressLines[0]}</strong><span class="small muted">${clinic.addressLines.slice(1).join(', ')}</span></a>
    </div>
  </section>
  <section class="section" id="appointment">
    <div class="container split">
      <div data-reveal>
        <p class="eyebrow">Appointment request</p>
        <h2 class="h2">Prepare your appointment email.</h2>
        <p class="muted">Add your details, then open the draft in your email app and send it to the clinic. For anything urgent, please call.</p>
        <ol class="request-steps" aria-label="How an appointment request works"><li><span>1</span>Add your details</li><li><span>2</span>Send your email</li><li><span>3</span>Clinic confirms</li></ol>
        <form class="form" id="appt-form" novalidate>
          <div class="form__row">
            <label>Name<input name="name" required autocomplete="name"></label>
            <label>Phone<input name="phone" type="tel" required autocomplete="tel"></label>
          </div>
          <label>Email<input name="email" type="email" autocomplete="email"></label>
          <div class="form__row">
            <label>Reason for visit
              <select name="reason">
                <option>Check-up</option>
                ${services.slice(1).map((t) => `<option>${t.title}</option>`).join('')}
                <option>Something else</option>
              </select>
            </label>
            <label>Preferred time
              <select name="time">
                <option>Any time</option><option>Morning</option><option>Afternoon</option><option>Evening (Tue or Wed, until 7pm)</option>
              </select>
            </label>
          </div>
          <label class="check"><input type="checkbox" name="new"> I’m a new patient</label>
          <label>Message (optional)<textarea name="message" rows="4"></textarea></label>
          <p class="form__error" id="form-error" role="alert" hidden>Please add your name and a phone number so we can call you back.</p>
          <div class="form__actions"><button class="btn btn--primary" type="submit">${icon('mail')}<span>Open email draft</span></button><button class="link-btn" type="button" id="copy-request">${icon('copy')}Copy request</button></div>
          <p class="small muted">You’ll need to send the email yourself. Your preferred time is a request; reception will confirm availability.</p>
          <p class="form__feedback" id="request-feedback" role="status" hidden></p>
        </form>
      </div>
      <aside class="hours-card" data-reveal aria-label="Opening hours">
        <p class="status ${status.open ? 'is-open' : ''}" data-live-status><span class="dot"></span><span data-status-text>${status.text}</span></p>
        <h2 class="h3">Opening hours</h2>
        ${hoursList()}
      </aside>
    </div>
  </section>
  ${visitBlock()}
  <section class="section">
    <div class="container narrow">
      ${sectionHead({ eyebrow: 'FAQ', title: 'Good to know', center: true })}
      ${accordion(faqs)}
    </div>
  </section>`;
}

function renderNotFound() {
  return pageHero({
    crumb: 'Page not found', title: 'Sorry, we couldn’t find that page.',
    lead: 'It may have moved. Try one of the links above, or call us and we’ll help.',
    actions: `<a class="btn btn--primary" href="#/">Back to home</a>${callBtn('btn--ghost')}`,
  });
}

const routes = {
  '': { title: 'Family Dentist in Fairview, Dublin 3', render: renderHome },
  about: { title: 'About Us', render: renderAbout },
  team: { title: 'Our Team', render: renderTeam },
  services: { title: 'Services', render: renderServices },
  fees: { title: 'Fee Guide', render: renderFees },
  contact: { title: 'Contact & Appointments', render: renderContact },
};

/* ---------- layout ---------- */
function renderHeader(path) {
  const status = openStatus();
  $('#topbar').innerHTML = `
    <div class="container topbar__inner">
      <span class="status ${status.open ? 'is-open' : ''}" data-live-status><span class="dot"></span><span data-status-text>${status.text}</span></span>
      <span><span class="hide-sm">${clinic.addressLines[0]}, Dublin 3 · </span><a href="${clinic.phoneHref}">${clinic.phone}</a></span>
    </div>`;
  $('#site-header').innerHTML = `
    <div class="container header__inner">
      <a class="logo" href="#/" aria-label="${clinic.name}, home">${logoMark}<span class="logo__text">${clinic.name}<small>${clinic.tagline}</small></span></a>
      <nav class="nav" id="nav" aria-label="Main">
        ${nav.map((n) => `<a href="#/${n.path}" ${n.path === path ? 'aria-current="page"' : ''}>${n.label}</a>`).join('')}
        ${bookLink('btn--primary nav__cta', 'Request a visit')}
      </nav>
      <button type="button" class="menu-btn" id="menu-btn" aria-expanded="false" aria-controls="nav" aria-label="Open menu">${icon('menu')}<span>Menu</span></button>
    </div>`;
  $('#menu-btn').addEventListener('click', () => toggleMenu());
}

function toggleMenu(force) {
  const btn = $('#menu-btn');
  const open = force ?? btn.getAttribute('aria-expanded') !== 'true';
  btn.setAttribute('aria-expanded', String(open));
  btn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  btn.innerHTML = `${icon(open ? 'x' : 'menu')}<span>${open ? 'Close' : 'Menu'}</span>`;
  $('#nav').classList.toggle('is-open', open);
  document.body.classList.toggle('menu-open', open);
  ['#main', '#site-footer', '#action-bar', '#topbar'].forEach((selector) => {
    $(selector).inert = open;
  });
  if (open) $('#nav a').focus();
}

function renderFooter() {
  $('#site-footer').innerHTML = `
    <div class="container footer__grid">
      <div>
        <a class="logo logo--light" href="#/">${logoMark}<span class="logo__text">${clinic.name}<small>${clinic.tagline}</small></span></a>
        <p class="footer__muted">${clinic.addressText}</p>
      </div>
      <div>
        <h2 class="footer__title">Pages</h2>
        <ul>${nav.map((n) => `<li><a href="#/${n.path}">${n.label}</a></li>`).join('')}</ul>
      </div>
      <div>
        <h2 class="footer__title">Opening hours</h2>
        <ul class="footer__hours">
          <li>Mon &amp; Fri<span>9am – 5.30pm</span></li>
          <li>Tue &amp; Wed<span>8am – 7pm</span></li>
          <li>Thursday<span>8am – 5.30pm</span></li>
          <li>Sat &amp; Sun<span>Closed</span></li>
        </ul>
      </div>
      <div>
        <h2 class="footer__title">Contact</h2>
        <ul>
          <li><a href="${clinic.phoneHref}">${clinic.phone}</a></li>
          <li><a href="mailto:${clinic.email}">${clinic.email}</a></li>
          <li><a href="${clinic.instagram}" target="_blank" rel="noopener">Instagram</a></li>
        </ul>
      </div>
    </div>
    <div class="container footer__base">
      <span>© ${new Date().getFullYear()} ${clinic.name}</span>
      <span>Design concept for discussion. Not the official website: visit <a href="${clinic.officialSite}">${clinic.officialSite.replace('https://', '')}</a>.</span>
    </div>`;
  $('#action-bar').innerHTML = `
    <a href="${clinic.phoneHref}">${icon('phone')}<span>Call</span></a>
    <a href="#/contact" data-scroll="appointment">${icon('calendar')}<span>Book</span></a>
    <a href="${clinic.directionsUrl}" target="_blank" rel="noopener">${icon('navigation')}<span>Directions</span></a>`;
}

/* ---------- interactions ---------- */
function toast(msg) {
  const t = $('#toast');
  t.textContent = msg;
  t.classList.add('is-visible');
  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => t.classList.remove('is-visible'), 2400);
}

function bindPage() {
  // Copy address
  $$('[data-copy]').forEach((b) => b.addEventListener('click', async () => {
    try { await navigator.clipboard.writeText(b.dataset.copy); toast('Address copied'); } catch { toast(b.dataset.copy); }
  }));

  // Fee search & filters
  const search = $('#fee-search');
  if (search) {
    let filter = 'all';
    const apply = () => {
      const q = search.value.trim().toLowerCase();
      let shown = 0;
      $$('.fee-card').forEach((card) => {
        const inGroup = filter === 'all' || card.dataset.group === filter;
        let rows = 0;
        $$('.fee-row', card).forEach((r) => {
          const hit = inGroup && (!q || r.dataset.name.includes(q));
          r.hidden = !hit;
          rows += hit ? 1 : 0;
        });
        card.hidden = rows === 0;
        shown += rows;
      });
      $('#fee-empty').hidden = shown > 0;
    };
    search.addEventListener('input', apply);
    $$('[data-filter]').forEach((b) => b.addEventListener('click', () => {
      filter = b.dataset.filter;
      $$('[data-filter]').forEach((x) => { x.classList.toggle('is-active', x === b); x.setAttribute('aria-pressed', String(x === b)); });
      apply();
    }));
  }

  // Appointment request → opens the patient's email app with a ready-to-send message.
  const form = $('#appt-form');
  if (form) {
    const prepareRequest = () => {
      const f = new FormData(form);
      const name = (f.get('name') || '').trim();
      const phone = (f.get('phone') || '').trim();
      $('#form-error').hidden = Boolean(name && phone);
      if (!name || !phone) {
        form.elements.namedItem(name ? 'phone' : 'name').focus();
        return null;
      }
      if (!form.reportValidity()) return null;
      const body = [
        `Name: ${name}`, `Phone: ${phone}`, `Email: ${f.get('email') || '-'}`,
        `Reason: ${f.get('reason')}`, `Preferred time: ${f.get('time')}`,
        `New patient: ${f.get('new') ? 'Yes' : 'No'}`, '', f.get('message') || '',
      ].join('\n');
      return { body, subject: `Appointment request: ${name}` };
    };
    const feedback = (message) => {
      $('#request-feedback').textContent = message;
      $('#request-feedback').hidden = false;
    };
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const request = prepareRequest();
      if (!request) return;
      feedback('Opening your email app. Send the draft there to request your appointment. If no app opens, use Copy request and paste it into an email.');
      window.location.href = `mailto:${clinic.email}?subject=${encodeURIComponent(request.subject)}&body=${encodeURIComponent(request.body)}`;
    });
    $('#copy-request').addEventListener('click', async () => {
      const request = prepareRequest();
      if (!request) return;
      try {
        await navigator.clipboard.writeText(`To: ${clinic.email}\nSubject: ${request.subject}\n\n${request.body}`);
        feedback(`Request copied. Paste it into an email to ${clinic.email} and send it to the clinic.`);
      } catch {
        feedback('Copy is unavailable in this browser. Use Open email draft or call reception.');
      }
    });
  }
}

function reveal() {
  const els = $$('[data-reveal]');
  if (reduceMotion || !('IntersectionObserver' in window)) { els.forEach((el) => el.classList.add('is-visible')); return; }
  const io = new IntersectionObserver((entries) => entries.forEach((en) => {
    if (en.isIntersecting) { en.target.classList.add('is-visible'); io.unobserve(en.target); }
  }), { rootMargin: '0px 0px -8% 0px' });
  els.forEach((el) => io.observe(el));
}

/* ---------- router ---------- */
let pendingScroll = null;
document.addEventListener('click', (e) => {
  if (e.target.closest('.skip-link')) {
    e.preventDefault();
    $('#main').focus();
    $('#main').scrollIntoView({ block: 'start' });
    return;
  }
  const a = e.target.closest('[data-scroll]');
  if (a) {
    // Already on that page: no hashchange will fire, so scroll straight to the section.
    if (a.getAttribute('href') === location.hash) {
      e.preventDefault();
      $(`#${a.dataset.scroll}`)?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
    } else {
      pendingScroll = a.dataset.scroll;
    }
  }
  if (e.target.closest('#nav a')) toggleMenu(false);
});

function route() {
  const [path = '', sub] = location.hash.replace(/^#\/?/, '').split('/');
  const r = routes[path];
  const main = $('#main');
  main.innerHTML = r ? r.render(sub) : renderNotFound();
  document.title = `${r ? r.title : 'Page not found'} | ${clinic.name}`;
  renderHeader(path);
  toggleMenu(false);
  bindPage();
  reveal();

  const target = sub ? $(`#t-${sub}`) : pendingScroll ? $(`#${pendingScroll}`) : null;
  pendingScroll = null;
  if (target) {
    requestAnimationFrame(() => target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' }));
  } else {
    window.scrollTo(0, 0);
    main.focus({ preventScroll: true });
  }
}

renderFooter();
window.addEventListener('hashchange', route);
window.addEventListener('keydown', (e) => {
  if (!document.body.classList.contains('menu-open')) return;
  if (e.key === 'Escape') { toggleMenu(false); $('#menu-btn').focus(); }
  if (e.key === 'Tab') {
    const controls = $$('.site-header a, .site-header button');
    const first = controls[0];
    const last = controls[controls.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }
});
window.addEventListener('resize', () => {
  if (window.innerWidth > 900 && document.body.classList.contains('menu-open')) toggleMenu(false);
});
route();
setInterval(refreshOpeningStatus, 30000);
document.addEventListener('visibilitychange', () => { if (!document.hidden) refreshOpeningStatus(); });
window.addEventListener('focus', refreshOpeningStatus);
