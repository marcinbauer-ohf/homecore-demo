// The load-in (Matt, 17 Nov: "lets try something quite silly… a fade in load"), from his Figma frames 1158:22778:
// the page opens on the blue sky ("Start on this", 1158:22498), and after 0.4 s it fades into the page's own light
// background ("fade to this BG", 1158:22518) while the cards fade up and the words spin in letter by letter. About
// 1.1 s in all. Once per load; with Reduce motion on it doesn't run.
import { reduced } from './motion.js';

const TEXT = '.tfDashTitle, .activityTitle, .activityRowName, .hcCardTitle';
const CARDS = '#homeView .tfBoardItem:not(.tfDashTitle)';

export function mountIntro(root, app) {
  if (reduced()) return;
  const shell = root.querySelector('.shell');
  if (!shell) return;
  app.classList.add('hcIntro'); // the cards wait unseen, the sky shows
  shell.insertAdjacentHTML('afterbegin', '<div class="hcIntroSky" aria-hidden="true"></div>');
  let started = false;
  const start = () => {
    if (started) return;
    started = true;
    const inView = (el) => { const r = el.getBoundingClientRect(); return r.bottom > 0 && r.top < innerHeight && r.width > 0; };
    // the cards fade up one after another, top to bottom, left to right, from 0.25 s
    const cards = [...root.querySelectorAll(CARDS)].filter(inView)
      .sort((a, b) => a.getBoundingClientRect().top - b.getBoundingClientRect().top || a.getBoundingClientRect().left - b.getBoundingClientRect().left);
    cards.forEach((c, i) => c.style.setProperty('--intro-d', Math.min(250 + i * 30, 600) + 'ms'));
    // each word's letters spin in, a little after its card
    const undo = [];
    root.querySelectorAll(TEXT).forEach((el) => {
      if (!inView(el)) return;
      const card = el.closest(CARDS);
      const base = card ? parseInt(card.style.getPropertyValue('--intro-d'), 10) || 250 : 150;
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
          s.style.animationDelay = Math.min(base + 60 + k++ * 22, 650) + 'ms';
          wrap.appendChild(s);
        });
        n.replaceWith(wrap);
        undo.push(() => { if (wrap.isConnected) wrap.replaceWith(document.createTextNode(n.nodeValue)); });
      });
    });
    app.classList.add('hcIntroGo');
    // done: the words back to plain text, the sky gone
    setTimeout(() => {
      undo.forEach((f) => f());
      app.classList.remove('hcIntro', 'hcIntroGo');
      cards.forEach((c) => c.style.removeProperty('--intro-d'));
      shell.querySelector('.hcIntroSky')?.remove();
    }, 1200);
  };
  // once the board has laid itself out, so the cards are where they'll stay
  if (app.classList.contains('tfBoardReady')) requestAnimationFrame(start);
  else {
    const mo = new MutationObserver(() => { if (app.classList.contains('tfBoardReady')) { mo.disconnect(); requestAnimationFrame(start); } });
    mo.observe(app, { attributes: true, attributeFilter: ['class'] });
  }
  setTimeout(start, 1500); // whatever happens, it doesn't stay hidden
}
