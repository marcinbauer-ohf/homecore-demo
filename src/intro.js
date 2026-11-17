// The load-in (Matt, 17 Nov: "lets try something quite silly… a fade in load"), from his Figma frames 1158:22778:
// the page opens on the blue sky ("Start on this", 1158:22498), and after 0.4 s it fades into the page's own light
// background ("fade to this BG", 1158:22518) while the words spin in letter by letter: the greeting first, then the
// house's name, then the cards fade up in turn (Matt, 17 Nov), their names spinning in with them. About 1.2 s in all. Once per load; with Reduce motion on it doesn't run. Its timings are INTRO's (the dev tweaker,
// intro-tweaker.js, changes them live).
import { reduced } from './motion.js';

export const EASES = { soft: 'cubic-bezier(.4,0,.2,1)', standard: 'cubic-bezier(.2,0,0,1)', land: 'cubic-bezier(.34,1.46,.64,1)', spring: 'cubic-bezier(.2,1.2,.4,1)', linear: 'linear' };
export const INTRO_DEFAULTS = Object.freeze({
  skyHold: 400, skyFade: 500, skyEase: 'soft', // the blue, then its fade
  greetStart: 60, greetStagger: 8, nameGap: 40, nameStagger: 18, // the greeting's letters, then the house's name's
  cardsAfter: 120, cardStagger: 30, cardSpread: 300, cardDur: 450, cardRise: 14, cardScale: 100, cardEase: 'standard', // the cards, once the name has begun
  letterAfter: 0, letterStagger: 22, letterSpread: 150, letterDur: 400, letterTurn: -100, letterAxis: 'X', letterRise: 25, letterEase: 'land', // every word's letters
  words: 'names', // 'names': titles and names spin; 'all': every word in the cards spins too
});
export const INTRO = { ...INTRO_DEFAULTS };
// a tweak saved in this browser while trying it out (dev only)
if (import.meta.env?.DEV) try { Object.entries(JSON.parse(localStorage.getItem('homecore-demo-intro') || '{}')).forEach(([k, x]) => { if (k in INTRO) INTRO[k] = x; }); } catch (_e) { /* the defaults */ }
// when the parts begin and the whole ends, from INTRO (the tweaker shows the total)
export function introTimes(c = INTRO, greetLen = 23, nameLen = 12) {
  const greetEnd = c.greetStart + Math.max(0, greetLen - 1) * c.greetStagger;
  const nameStart = greetEnd + c.nameGap, nameEnd = nameStart + Math.max(0, nameLen - 1) * c.nameStagger;
  const cardStart = nameStart + c.cardsAfter, lastCard = cardStart + c.cardSpread;
  const end = Math.max(c.skyHold + c.skyFade, nameEnd + c.letterDur, lastCard + c.cardDur, lastCard + c.letterAfter + c.letterSpread + c.letterDur);
  return { greetEnd, nameStart, nameEnd, cardStart, lastCard, end };
}

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
    // a text's letters spin in from `from`, `step` apart, all begun within `spread`
    const textsOf = (el, skip) => { const w = document.createTreeWalker(el, NodeFilter.SHOW_TEXT), out = []; for (let n = w.nextNode(); n; n = w.nextNode()) if (n.nodeValue.trim() && !(skip && skip.contains(n))) out.push(n); return out; };
    const spin = (nodes, from, step, spread = Infinity) => {
      let k = 0;
      nodes.forEach((n) => {
        const wrap = document.createElement('span');
        wrap.className = 'hcIntroWord';
        [...n.nodeValue].forEach((ch) => {
          const s = document.createElement('span');
          s.className = 'hcIntroLetter';
          s.textContent = ch;
          s.style.animationDelay = Math.round(from + Math.min(k++ * step, spread)) + 'ms';
          wrap.appendChild(s);
        });
        n.replaceWith(wrap);
        undo.push(() => { if (wrap.isConnected) wrap.replaceWith(document.createTextNode(n.nodeValue)); });
      });
    };
    // first the greeting, then the house's name (Matt, 17 Nov)
    const title = [...root.querySelectorAll('#homeView .tfDashTitle')].find(inView), greet = title?.querySelector('.tfGreeting');
    const greetNodes = greet ? textsOf(greet) : [], nameNodes = title ? textsOf(title, greet) : [];
    const t = introTimes(c, greetNodes.reduce((n, x) => n + x.nodeValue.length, 0), nameNodes.reduce((n, x) => n + x.nodeValue.length, 0));
    spin(greetNodes, c.greetStart, c.greetStagger);
    spin(nameNodes, t.nameStart, c.nameStagger);
    // then the cards fade up one after another, top to bottom, left to right
    const at = (el) => el.getBoundingClientRect();
    cards = [...root.querySelectorAll(CARDS)].filter(inView).sort((a, b) => at(a).top - at(b).top || at(a).left - at(b).left);
    cards.forEach((el, i) => el.style.setProperty('--intro-d', Math.round(t.cardStart + Math.min(i * c.cardStagger, c.cardSpread)) + 'ms'));
    // each card's words spin in with it
    root.querySelectorAll(c.words === 'all' ? ALL : NAMES).forEach((el) => {
      const card = el.closest(CARDS);
      if (!card || !inView(el) || el.closest('.hcIntroWord') || el.querySelector('.hcIntroWord')) return;
      spin(textsOf(el), (parseInt(card.style.getPropertyValue('--intro-d'), 10) || t.cardStart) + c.letterAfter, c.letterStagger, c.letterSpread);
    });
    void app.offsetWidth; // a replay starts its animations again
    app.classList.add('hcIntroGo');
    // done: the words back to plain text, the sky gone
    timers.push(setTimeout(end, t.end + 100));
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
