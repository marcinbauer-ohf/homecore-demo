// A tweaker for the load-in (Matt, 17 Nov: "build me a little tweaker that I can use, which we can then remove from
// the build"). Only on the dev server (npm run dev): demo-shell.js loads it behind import.meta.env.DEV, so the built
// site never has it. To take it out for good: delete this file and its two lines in demo-shell.js.
import { INTRO, INTRO_DEFAULTS, EASES, playIntro } from './intro.js';

const KEY = 'homecore-demo-intro';
// [key, label, min, max, step, unit] or [key, label, options]
const GROUPS = [
  ['Blue sky', [['skyHold', 'Hold', 0, 1500, 10, 'ms'], ['skyFade', 'Fade', 0, 1500, 10, 'ms'], ['skyEase', 'Ease', Object.keys(EASES)]]],
  ['Cards', [['cardStart', 'Start', 0, 1200, 10, 'ms'], ['cardStagger', 'Stagger', 0, 150, 1, 'ms'], ['cardMax', 'Last starts by', 0, 1500, 10, 'ms'],
    ['cardDur', 'Length', 0, 1500, 10, 'ms'], ['cardRise', 'Rise', 0, 80, 1, 'px'], ['cardScale', 'Start size', 70, 110, 1, '%'], ['cardEase', 'Ease', Object.keys(EASES)]]],
  ['Letters', [['letterAfter', 'After its card', 0, 600, 10, 'ms'], ['letterStagger', 'Stagger', 0, 100, 1, 'ms'], ['letterMax', 'Last starts by', 0, 1500, 10, 'ms'],
    ['letterDur', 'Length', 0, 1500, 10, 'ms'], ['letterTurn', 'Turn', -360, 360, 5, '°'], ['letterAxis', 'Axis', ['X', 'Y']], ['letterRise', 'Rise', 0, 100, 1, '% of a letter'],
    ['letterEase', 'Ease', Object.keys(EASES)], ['words', 'Which words', ['names', 'all']]]],
];

export function mountIntroTweaker(root, app) {
  const style = document.createElement('style');
  style.textContent = `
    .hcTweak{position:fixed;z-index:400;left:96px;bottom:16px;width:300px;max-height:calc(100vh - 32px);overflow:auto;padding:14px 16px;border-radius:20px;
      background:var(--card);box-shadow:0 8px 32px rgba(0,0,0,.18),var(--hc-hair-all,0 0 0 .5px rgba(0,0,0,.1));color:var(--text);font:400 13px/1.3 var(--font);scrollbar-width:thin}
    .hcTweak.min{width:auto;padding:8px 10px}
    .hcTweak.min>:not(.hcTweakHead){display:none}
    .hcTweakHead{display:flex;align-items:center;gap:8px}
    .hcTweakHead b{font:600 14px/20px var(--font-tile);flex:1}
    .hcTweak h4{margin:12px 0 6px;font:600 12px/16px var(--font-tile);color:var(--muted);text-transform:uppercase;letter-spacing:.04em}
    .hcTweak label{display:grid;grid-template-columns:96px 1fr 62px;align-items:center;gap:8px;margin:4px 0}
    .hcTweak input[type=range]{width:100%;accent-color:var(--primary)}
    .hcTweak select{grid-column:2/4;height:28px;border-radius:8px;border:0;background:var(--tile);color:var(--text);font:inherit;padding:0 6px}
    .hcTweak output{text-align:right;font-variant-numeric:tabular-nums;color:var(--muted)}
    .hcTweakBtns{display:flex;flex-wrap:wrap;gap:6px;margin-top:12px}
    .hcTweak button{height:30px;padding:0 12px;border:0;border-radius:10px;background:var(--tile);color:var(--text);font:600 13px/1 var(--font-tile);cursor:pointer}
    .hcTweak button.go{background:var(--text);color:var(--card)}
    .hcTweakTotal{margin-top:8px;color:var(--muted)}`;
  app.appendChild(style);
  const box = Object.assign(document.createElement('div'), { className: 'hcTweak' });
  box.setAttribute('role', 'dialog');
  box.setAttribute('aria-label', 'Load-in tweaker');
  const row = ([k, label, a, b, step, unit]) => Array.isArray(a)
    ? '<label><span>' + label + '</span><select data-k="' + k + '">' + a.map((o) => '<option' + (INTRO[k] === o ? ' selected' : '') + '>' + o + '</option>').join('') + '</select></label>'
    : '<label><span>' + label + '</span><input type="range" min="' + a + '" max="' + b + '" step="' + step + '" value="' + INTRO[k] + '" data-k="' + k + '"><output data-o="' + k + '">' + INTRO[k] + (unit === '%' || unit === '°' ? unit : unit === 'px' || unit === 'ms' ? ' ' + unit : '') + '</output></label>';
  const draw = () => {
    box.innerHTML = '<div class="hcTweakHead"><b>Load-in</b><button type="button" class="go" data-replay>Replay</button><button type="button" data-min aria-label="Fold">–</button></div>' +
      GROUPS.map(([t, rows]) => '<h4>' + t + '</h4>' + rows.map(row).join('')).join('') +
      '<div class="hcTweakTotal" data-total></div>' +
      '<div class="hcTweakBtns"><button type="button" data-copy>Copy values</button><button type="button" data-reset>Reset</button></div>';
    total();
  };
  const total = () => {
    const c = INTRO, last = Math.max(c.skyHold + c.skyFade, c.cardMax + c.cardDur, c.letterMax + c.letterDur);
    const el = box.querySelector('[data-total]'); if (el) el.textContent = 'All in: ' + (last / 1000).toFixed(2) + ' s';
  };
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(INTRO)); } catch (_e) { /* this visit only */ } };
  const replay = () => { window.scrollTo(0, 0); playIntro(root, app, INTRO); };
  box.addEventListener('input', (ev) => {
    const k = ev.target.dataset.k; if (!k) return;
    INTRO[k] = ev.target.type === 'range' ? Number(ev.target.value) : ev.target.value;
    const o = box.querySelector('[data-o="' + k + '"]'); if (o) o.textContent = ev.target.value + o.textContent.replace(/^-?[\d.]+/, '');
    total(); save();
  });
  box.addEventListener('change', (ev) => { if (ev.target.dataset.k) replay(); }); // let go of a slider: see it
  box.addEventListener('click', (ev) => {
    const b = ev.target.closest('button'); if (!b) return;
    if (b.hasAttribute('data-replay')) replay();
    if (b.hasAttribute('data-min')) box.classList.toggle('min');
    if (b.hasAttribute('data-reset')) { Object.assign(INTRO, INTRO_DEFAULTS); save(); draw(); replay(); }
    if (b.hasAttribute('data-copy')) { navigator.clipboard?.writeText(JSON.stringify(INTRO, null, 2)).then(() => { b.textContent = 'Copied'; setTimeout(() => { b.textContent = 'Copy values'; }, 1400); }, () => {}); }
  });
  draw();
  app.appendChild(box);
}
