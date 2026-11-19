// My account and My profile, from Matt's Claude Design file, in HomeCore's parts: the list in groups (Settings rows in
// cards, each with its icon chip), and the profile as cards of fields with their labels above. Wide: the list beside the
// page; narrow: the list, then the page with a back arrow. Appearance opens HomeCore's Settings; the other rows open
// a page that says it isn't designed yet. What's typed is kept in this browser only.
import { IMG } from '../images.js';
const GROUPS = [
  [['profile', 'My profile', 'mdi:account-circle-outline', '#2a5fc1']],
  [['location', 'Location', 'mdi:map-marker', '#3e7b4f'], ['health', 'Health', 'mdi:heart-pulse', '#b33a2c'], ['calendar', 'Calendar', 'mdi:calendar', '#b07a2c'], ['voice', 'Voice', 'mdi:microphone', '']],
  [['security', 'Security', 'mdi:shield-account', '#3c7f84']],
  [['appearance', 'Appearance', 'mdi:palette', '#6b4aa7'], ['accessibility', 'Accessibility', 'mdi:human', '#424f9a'], ['notifications', 'Notifications', 'mdi:bell', '#9b3e6c']],
];
const KEY = 'homecore-demo-profile';
const FIELDS = { name: 'Wembely', nickname: '', pronouns: '', mail: '', phone: '', about: '' };
// what each field's (i) says
const ABOUT = {
  name: 'How you show up to everyone in your home: in the activity log, on Home\'s welcome message and wherever Home Assistant names you.',
  nickname: 'A shorter or friendlier name, if you\'d rather be called something else.',
  pronouns: 'Shown with your name, so the people in your home know how to refer to you.',
  mail: 'Where Home Assistant can reach you, for notifications and messages about your account.',
  phone: 'For text notifications. Start with your country code, like +31.',
  about: 'A few words about yourself, for the people you share your home with.',
  since: 'The day your account was made on this Home Assistant.',
};
const LEARN = 'https://www.home-assistant.io/docs/authentication/';
// what a field must look like, and what to say when it doesn't
const CHECKS = {
  mail: [(v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), 'Enter a mail address, like name@example.com'],
  phone: [(v) => /^\+?[\d\s().-]+$/.test(v) && (v.match(/\d/g) || []).length >= 7 && (v.match(/\d/g) || []).length <= 15, 'Enter a phone number, like +31 6 1234 5678'],
};
/* where a field says what's wrong, three ways to try (Matt, 19 Nov: "I want to try out error options for the fields… give
   me a toggle to go between them"; Figma 1251:25491): in the title's place, under the field, or at the end of the title
   line. Picked with the toggle at the top of My profile, kept in this browser */
const ERR_KEY = 'homecore-demo-field-errors';
const ERR_WAYS = [['title', 'Replace title'], ['below', 'Below'], ['line', 'Title line']];
const errWay = () => { try { const v = localStorage.getItem(ERR_KEY); return ERR_WAYS.some(([k]) => k === v) ? v : 'title'; } catch (_e) { return 'title'; } };
const local = {
  get() { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch (_e) { return {}; } },
  set(v) { try { localStorage.setItem(KEY, JSON.stringify(v)); } catch (_e) { /* not remembered */ } },
};

export function renderAccount(page, { esc, icon, go, root, glyph, paint, head }) {
  const me = { ...FIELDS, ...local.get() };
  const photo = IMG.people.wembely;
  let showing = null; // narrow only: the profile instead of the list
  const row = ([k, name, ic, colour]) => '<button class="hcRow' + (k === 'profile' ? ' active' : '') + '" type="button" data-acc="' + k + '">' +
    glyph(ic, colour) +
    '<span class="hcRowText"><span class="hcRowName">' + name + '</span></span></button>';
  /* a field: its title with an (i) beside it, the box, and a note under it (Figma "Field · Titled", 1240:5611). The (i)
     opens the same popover as Edit Home's settings; a mail address or phone number that isn't one shows the danger
     ring, and its note says what to fix (checked when you leave the field, cleared as soon as it's right) */
  const field = (k, label, ph, type = 'text', note = '') => '<div class="hcField">' + title(k, label, 'hcf-' + k) +
    (type === 'area' ? '<textarea class="hcInput" id="hcf-' + k + '" rows="4" data-f="' + k + '"' + (note ? ' aria-describedby="hcf-' + k + '-note"' : '') + ' placeholder="' + esc(ph) + '">' + esc(me[k]) + '</textarea>'
      : '<input class="hcInput" id="hcf-' + k + '" type="' + type + '" data-f="' + k + '"' + (note ? ' aria-describedby="hcf-' + k + '-note"' : '') + ' placeholder="' + esc(ph) + '" value="' + esc(me[k]) + '">') +
    (note || CHECKS[k] ? '<span class="hcFieldNote" id="hcf-' + k + '-note" data-note="' + esc(note) + '"' + (note ? '' : ' hidden') + '>' + note + '</span>' : '') + '</div>';
  const title = (k, label, forId) => '<div class="hcFieldTitle">' + (forId ? '<label class="hcFieldName" for="' + forId + '">' : '<span class="hcFieldName">') + label + (forId ? '</label>' : '</span>') +
    '<button class="hcInfoBtn" type="button" aria-expanded="false" aria-label="About ' + esc(label) + '" data-info-title="' + esc(label) + '" data-info-text="' + esc(ABOUT[k]) + '" data-info-more="' + LEARN + '">' + icon('mdi:information-outline') + '</button></div>';
  const BACK = '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M15 18L9 12L15 6"/></svg>';
  const panelHead = (title) => '<div class="settingsHeader tfAreaHead hcPanelHead"><button class="back" type="button" data-acc-back aria-label="Back to My account">' + BACK + '</button><div class="settingsTitle">' + esc(title) + '</div></div>';
  // the rows other than My profile open a page the same way (Matt, 9 Nov); none is designed yet, so each says so
  const others = GROUPS.flat().filter(([k]) => k !== 'profile' && k !== 'appearance');
  page.innerHTML =
    '<div class="hcAccount" data-err="' + errWay() + '">' +
      head('My account') +
      '<div class="hcAccList">' + GROUPS.map((g) => '<section class="card hcRowsCard">' + g.map(row).join('') + '</section>').join('') + '</div>' +
      '<div class="hcPanel" data-panel="profile">' + panelHead('My profile') +
        '<div class="tfSeg hcErrSeg" role="group" aria-label="Where a field says what\'s wrong">' + ERR_WAYS.map(([k, t]) => '<button type="button" data-err-way="' + k + '" aria-pressed="' + (k === errWay()) + '">' + t + '</button>').join('') + '</div>' +
        // the photo from the top left, level with the first row (Matt, 9 Nov)
        '<div class="hcPhoto"><img src="' + photo + '" alt="Your photo"><div class="hcPhotoActions"><button class="hcBtn" type="button" data-oops>Change photo</button><button class="pill" type="button" data-oops>Remove</button></div></div>' +
        '<section class="card hcFields">' + field('name', 'Name', 'Your name') + field('nickname', 'Nickname', 'Add a nickname') +
          field('pronouns', 'Pronouns', 'Ex. they/them/theirs', 'text', 'Let people know which pronouns you use.') + '</section>' +
        // each section's title inside its card (Matt, 9 Nov)
        '<section class="card hcFields"><div class="hcCardTitle">Contact information</div>' +
          field('mail', 'Mail address', 'name@example.com', 'email') + field('phone', 'Phone number', '+31 6 1234 5678', 'tel') + '</section>' +
        '<section class="card hcFields"><div class="hcCardTitle">About me</div>' + field('about', 'About', 'Say a little about yourself', 'area') +
          '<div class="hcField">' + title('since', 'Home Assistant user since') + '<span class="hcSince">14 March 2023</span></div></section>' +
      '</div>' +
      others.map(([k, name]) => '<div class="hcPanel" data-panel="' + k + '" hidden>' + panelHead(name) +
        '<section class="card hcFields hcSoon"><div class="hcCardTitle">' + esc(name) + '</div><p>Oops! We haven\'t designed this yet. Let\'s add it to the list :)</p>' +
        // the Oops popup's picture, wherever an Oops shows (Matt, 10 Nov)
        '<div class="hcArt hcArtOops"><img alt="" src="' + IMG.oopsTrees + '"></div></section></div>').join('') +
    '</div>';
  const wrap = page.querySelector('.hcAccount');
  paint(page);
  // which page shows beside the list (wide) or instead of it (narrow, after a tap)
  const open = (k, narrowToo) => {
    page.querySelectorAll('.hcPanel').forEach((p) => { p.hidden = p.dataset.panel !== k; });
    page.querySelectorAll('[data-acc]').forEach((b) => b.classList.toggle('active', b.dataset.acc === k));
    showing = narrowToo ? k : null;
    wrap.classList.toggle('hcShowPanel', Boolean(narrowToo));
    window.scrollTo(0, 0);
  };
  // the toggle: another way to show what's wrong; with nothing wrong yet, the Figma's wrong mail address shows it (not kept)
  page.querySelector('.hcErrSeg').addEventListener('click', (ev) => {
    const b = ev.target.closest('[data-err-way]');
    if (!b) return;
    wrap.dataset.err = b.dataset.errWay;
    try { localStorage.setItem(ERR_KEY, b.dataset.errWay); } catch (_e) { /* not kept */ }
    page.querySelectorAll('[data-err-way]').forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
    if (!page.querySelector('.hcInput[aria-invalid="true"]')) { const mail = page.querySelector('#hcf-mail'); mail.value = 'home@youcom'; check(mail, true); }
  });
  page.addEventListener('click', (ev) => {
    const b = ev.target.closest('[data-acc],[data-acc-back]');
    if (!b) return;
    if (b.hasAttribute('data-acc-back')) { wrap.classList.remove('hcShowPanel'); showing = null; return; }
    if (b.dataset.acc === 'appearance') { go('settings'); return; }
    open(b.dataset.acc, true);
  });
  // wrong: the danger ring and the note says what to fix; right (or empty): back to its own note
  const check = (el, strict) => {
    const k = el.dataset.f, c = CHECKS[k], note = page.querySelector('#hcf-' + k + '-note');
    if (!c || !note) return;
    const v = el.value.trim(), bad = Boolean(v) && !c[0](v);
    if (bad && !strict && el.getAttribute('aria-invalid') !== 'true') return; // while typing it only clears, never scolds
    const was = el.getAttribute('aria-invalid') === 'true', field = el.closest('.hcField');
    if (bad) el.setAttribute('aria-invalid', 'true'); else el.removeAttribute('aria-invalid');
    // put right: its title fades back in (Replace title), so the class is new each time
    field.classList.remove('hcErrWas');
    if (was && !bad) { void field.offsetWidth; field.classList.add('hcErrWas'); }
    note.classList.toggle('hcFieldError', bad);
    note.textContent = bad ? c[1] : note.dataset.note;
    note.hidden = !note.textContent;
    if (note.hidden) el.removeAttribute('aria-describedby'); else el.setAttribute('aria-describedby', note.id);
  };
  page.querySelectorAll('.hcInput').forEach((el) => { if (el.value) check(el, true); }); // what was kept, checked again
  page.addEventListener('focusout', (ev) => { if (ev.target.dataset?.f) check(ev.target, true); });
  page.addEventListener('input', (ev) => {
    const k = ev.target.dataset.f;
    if (!k) return;
    check(ev.target, false);
    me[k] = ev.target.value;
    local.set(me);
    if (k === 'name') root.querySelectorAll('[data-hc-account] .hcMeName').forEach((el) => { el.textContent = me.name || 'Me'; });
  });
  return () => { showing = null; };
}
