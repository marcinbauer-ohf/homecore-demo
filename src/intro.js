// The load-in (Matt, 17 Nov: "lets try something quite silly… a fade in load"), from his Figma frames 1158:22778:
// the page opens on the blue sky ("Start on this", 1158:22498), and after 0.4 s it fades into the page's own light
// background ("fade to this BG", 1158:22518) while the cards fade up and the words spin in letter by letter. About
// 1.1 s in all. Once per load; with Reduce motion on it doesn't run. Its timings are INTRO's (the dev tweaker,
// intro-tweaker.js, changes them live).
import { reduced } from './motion.js';

export const EASES = { soft: 'cubic-bezier(.4,0,.2,1)', standard: 'cubic-bezier(.2,0,0,1)', land: 'cubic-bezier(.34,1.46,.64,1)', spring: 'cubic-bezier(.2,1.2,.4,1)', linear: 'linear' };
export const INTRO_DEFAULTS = Object.freeze({
  skyHold: 400, skyFade: 500, skyEase: 'soft', // the blue, then its fade
  cardStart: 250, cardStagger: 30, cardMax: 600, cardDur: 500, cardRise: 14, cardScale: 100, cardEase: 'standard', // the cards
  letterAfter: 60, letterStagger: 22, letterMax: 650, letterDur: 450, letterTurn: -100, letterAxis: 'X', letterRise: 25, letterEase: 'land', // the letters
  words: 'names', // 'names': titles and names spin; 'all': every word in the cards spins too
});
export const INTRO = { ...INTRO_DEFAULTS };
// a tweak saved in this browser while trying it out (dev only)
if (import.meta.env?.DEV) try { Object.assign(INTRO, JSON.parse(localStorage.getItem('homecore-demo-intro') || '{}')); } catch (_e) { /* the defaults */ }

const NAMES = '.tfDashTitle, .activityTitle, .activityRowName, .hcCardTitle';
const ALL = NAMES + ', .activityRowMeta, .tfRoomBig, .tfRoomSub, .tfName, .tfSumState';
const CARDS = '#homeView .tfBoardItem:not(.tfDashTitle)';

let stop = null; // the run in progress, so a replay can end it
export function playIntro(root, app, c = INTRO) {
  if (reduced()) return;
  stop?.();
  const shell = root.querySelector('.shell');
  if (!shell) return;
  const v = {
    '--intro-sky-hold': c.skyHold + 'ms', '--intro-sky-fade': c.skyFade + 'ms', '--intro-sky-ease': EASES[c.skyEase],
    '--intro-card-dur': c.cardDur + 'ms', '--intro-rise': c.cardRise + 'px', '--intro-scale': c.cardScale / 100, '--intro-card-ease': EASES[c.cardEase],
    '--intro-letter-dur': c.letterDur + 'ms', '--intro-letter-ease': EASES[c.letterEase], '--intro-lrise': c.letterRise / 100 + 'em',
    '--intro-rx': c.letterAxis === 'X' ? c.letterTurn + 'deg' : '0deg', '--intro-ry': c.letterAxis === 'Y' ? c.letterTurn + 'deg' : '0deg',
  };
  Object.entries(v).forEach(([k, x]) => app.style.setProperty(k, x));
  app.classList.remove('hcIntroGo');
  app.classList.add('hcIntro'); // the cards wait unseen, the sky shows
  if (!shell.querySelector(':scope>.hcIntroSky')) shell.insertAdjacentHTML('afterbegin', '<div class="hcIntroSky" aria-hidden="true"></div>');
  let started = false, timers = [], cards = [], undo = [];
  const end = () => {
    timers.forEach(clearTimeout);
    undo.forEach((f) => f());
    app.classList.remove('hcIntro', 'hcIntroGo');
    cards.forEach((el) => el.style.removeProperty('--intro-d'));
    shell.querySelector(':scope>.hcIntroSky')?.remove();
    stop = null;
  };
  const start = () => {
    if (started) return;
    started = true;
    const inView = (el) => { const r = el.getBoundingClientRect(); return r.bottom > 0 && r.top < innerHeight && r.width > 0; };
    // the cards fade up one after another, top to bottom, left to right
    const at = (el) => el.getBoundingClientRect();
    cards = [...root.querySelectorAll(CARDS)].filter(inView).sort((a, b) => at(a).top - at(b).top || at(a).left - at(b).left);
    cards.forEach((el, i) => el.style.setProperty('--intro-d', Math.min(c.cardStart + i * c.cardStagger, c.cardMax) + 'ms'));
    // each word's letters spin in, a little after its card
    root.querySelectorAll(c.words === 'all' ? ALL : NAMES).forEach((el) => {
      if (!inView(el) || el.closest('.hcIntroWord') || el.querySelector('.hcIntroWord')) return;
      const card = el.closest(CARDS);
      const base = card ? parseInt(card.style.getPropertyValue('--intro-d'), 10) || c.cardStart : Math.max(0, c.cardStart - 100);
      const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
      const nodes = [];
      for (let n = walker.nextNode(); n; n = walker.nextNode()) if (n.nodeValue.trim()) nodes.push(n);
      let k = 0;
      nodes.forEach((n) => {
        const wrap = document.createElement('span');
        wrap.className = 'hcIntroWord';
        [...n.nodeValue].forEach((ch) => {
          const s = document.createElement('span');
          s.className = 'hcIntroLetter';
          s.textContent = ch;
          s.style.animationDelay = Math.min(base + c.letterAfter + k++ * c.letterStagger, c.letterMax) + 'ms';
          wrap.appendChild(s);
        });
        n.replaceWith(wrap);
        undo.push(() => { if (wrap.isConnected) wrap.replaceWith(document.createTextNode(n.nodeValue)); });
      });
    });
    void app.offsetWidth; // a replay starts its animations again
    app.classList.add('hcIntroGo');
    // done: the words back to plain text, the sky gone
    const last = Math.max(c.skyHold + c.skyFade, c.cardMax + c.cardDur, c.letterMax + c.letterDur);
    timers.push(setTimeout(end, last + 100));
  };
  stop = end;
  // once the board has laid itself out, so the cards are where they'll stay
  if (app.classList.contains('tfBoardReady')) requestAnimationFrame(start);
  else {
    const mo = new MutationObserver(() => { if (app.classList.contains('tfBoardReady')) { mo.disconnect(); requestAnimationFrame(start); } });
    mo.observe(app, { attributes: true, attributeFilter: ['class'] });
  }
  timers.push(setTimeout(start, 1500)); // whatever happens, it doesn't stay hidden
}
export const mountIntro = (root, app) => playIntro(root, app);
