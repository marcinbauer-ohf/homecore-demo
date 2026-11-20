// The Ambient lab (Matt, 20 Nov: "dashboard layouts being more 'ambient', so 'airy' backgrounds, less 'stuff' going on…
// a structured softness"; "lets start with the weather page. give me options for your interpretation and give me options
// to control and modify elements designs, padding, grouping etc"). A panel on the Weather page, on the dev server only
// (demo-shell.js loads it behind import.meta.env.DEV, as the load-in tweaker): four interpretations as presets, then
// every part of them as its own control. What's picked is kept in this browser. To take it out for good: delete this
// file, ambient.css and their lines in demo-shell.js.
const KEY = 'homecore-demo-ambient';
export const AMBIENT_OFF = { on: false };
// the controls' defaults are today's Weather page, so "Off" and all-defaults look the same
const BASE = {
  on: true, preset: 'custom',
  // the ground: the theme's, a tint by the time of day, or a colour; a soft gradient across it or flat
  ground: 'theme', groundColour: '#e9eef2', gradient: 'on', tint: 50,
  // the cards: how much ground shows through, the blur behind, their corner, their edge
  cardA: 100, blur: 24, radius: 28, stroke: 'hair',
  // the air round things
  gap: 16, pad: 18, margin: 0,
  // the words: names' weight, the big numbers' size, how quiet the quiet text is
  nameW: 600, valueK: 100, mutedA: 100,
  // icons: in a chip, bare, or gone
  icons: 'chip',
  // grouping: loose as now, tiles in pairs, all the readings gathered in one panel, or panels by kind
  group: 'loose', groupA: 35, groupPad: 12, labels: 'on',
  // the art: colour kept in the one picture (the weather card) and quietened elsewhere
  artSat: 100, still: 'off',
  // which widgets are on the page
  hide: [],
};
// my four interpretations (Matt: "give me options for your interpretation")
export const PRESETS = {
  mist: { name: 'Mist', note: 'The sky is the page. A pale tint of the time of day behind cards you can almost see through; no edges; the readings in one quiet panel.',
    ground: 'tint', gradient: 'on', tint: 60, cardA: 45, blur: 30, radius: 32, stroke: 'none', gap: 24, pad: 22, margin: 24, nameW: 500, valueK: 100, mutedA: 70, icons: 'plain', group: 'gathered', groupA: 25, groupPad: 16, labels: 'on', artSat: 70, still: 'on' },
  paper: { name: 'Paper', note: 'Flat and warm, like a printed sheet. Cards barely lighter than the page with a hairline only; the readings in panels by kind, each with a small label.',
    ground: 'colour', groundColour: '#efe9e0', gradient: 'off', cardA: 60, blur: 0, radius: 24, stroke: 'hair', gap: 20, pad: 20, margin: 16, nameW: 500, valueK: 95, mutedA: 80, icons: 'plain', group: 'kinds', groupA: 20, groupPad: 14, labels: 'on', artSat: 60, still: 'on' },
  glass: { name: 'Glass', note: 'Deep blue dusk with frosted panes. The weather card is the one bright thing; everything else is glass over the sky, in pairs.',
    ground: 'colour', groundColour: '#1b2436', gradient: 'on', cardA: 30, blur: 32, radius: 30, stroke: 'none', gap: 28, pad: 22, margin: 24, nameW: 400, valueK: 105, mutedA: 65, icons: 'none', group: 'pairs', groupA: 0, groupPad: 0, labels: 'off', artSat: 50, still: 'on' },
  bare: { name: 'Bare', note: 'No cards at all. The readings sit on the page with air between them, lined up by the grid; thin labels keep the groups.',
    ground: 'theme', gradient: 'off', cardA: 0, blur: 0, radius: 0, stroke: 'none', gap: 32, pad: 12, margin: 32, nameW: 400, valueK: 110, mutedA: 60, icons: 'none', group: 'kinds', groupA: 0, groupPad: 0, labels: 'on', artSat: 80, still: 'on' },
};
// the readings by kind, for the panels
const KINDS = [['Sky', ['sun', 'moon', 'uv_index']], ['Air', ['aq_tile', 'pollen_tile', 'humidity', 'pressure']], ['Outlook', ['wind', 'visibility', 'radar_tile', 'precipitation', 'air_quality']]];
const WIDGETS = [['current', 'Weather'], ['hourly', 'Next hours'], ['sun', 'Sun'], ['moon', 'Moon'], ['uv_index', 'UV'], ['aq_tile', 'Air quality'], ['pollen_tile', 'Pollen'], ['humidity', 'Humidity'],
  ['pressure', 'Pressure'], ['wind', 'Wind'], ['visibility', 'Visibility'], ['radar_tile', 'Rain radar'], ['compared_to_average', 'Compared to average']];
// [key, label, min, max, step, unit] or [key, label, [[value, text]…]]
const GROUPS = [
  ['Ground', [['ground', 'Ground', [['theme', 'Theme'], ['tint', 'Time of day'], ['colour', 'Colour']]], ['groundColour', 'Colour', 'colour'], ['gradient', 'Gradient', [['on', 'Soft'], ['off', 'Flat']]], ['tint', 'Tint strength', 0, 100, 5, '%']]],
  ['Cards', [['cardA', 'Opacity', 0, 100, 5, '%'], ['blur', 'Blur behind', 0, 40, 2, 'px'], ['radius', 'Corner', 0, 40, 2, 'px'], ['stroke', 'Edge', [['none', 'None'], ['hair', 'Hairline'], ['line', '1 px']]]]],
  ['Air', [['gap', 'Between cards', 8, 48, 2, 'px'], ['pad', 'Inside cards', 8, 32, 2, 'px'], ['margin', 'Round the page', 0, 64, 4, 'px']]],
  ['Words', [['nameW', 'Names', [['400', 'Light'], ['500', 'Medium'], ['600', 'Bold']]], ['valueK', 'Numbers', 70, 130, 5, '%'], ['mutedA', 'Quiet text', 40, 100, 5, '%']]],
  ['Icons', [['icons', 'Icons', [['chip', 'In a chip'], ['plain', 'Bare'], ['none', 'None']]]]],
  ['Grouping', [['group', 'Readings', [['loose', 'Loose'], ['pairs', 'Pairs'], ['gathered', 'One panel'], ['kinds', 'By kind']]], ['groupA', 'Panel', 0, 100, 5, '%'], ['groupPad', 'Panel padding', 0, 32, 2, 'px'], ['labels', 'Labels', [['on', 'Shown'], ['off', 'None']]]]],
  ['Stillness', [['artSat', 'Colour in the readings', 0, 100, 10, '%'], ['still', 'Hover and motion', [['off', 'As now'], ['on', 'Still']]]]],
];
const hexRgb = (hex) => { const n = parseInt(hex.slice(1), 16); return [n >> 16, (n >> 8) & 255, n & 255]; };
const lum = ([r, g, b]) => { const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }; return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b); };
// the time of day's tint: dawn, day, dusk, night
const dayTint = () => { const h = new Date().getHours(); return h < 6 ? ['#141a2b', '#1f2a44'] : h < 9 ? ['#f3dfd2', '#dfe7f1'] : h < 17 ? ['#dfe9f3', '#eef3f7'] : h < 20 ? ['#f1d8c2', '#cdd3e6'] : ['#171d2e', '#232b45']; };

export function mountAmbientLab(root, app) {
  let s = { ...BASE };
  try { s = { ...BASE, ...JSON.parse(localStorage.getItem(KEY) || '{}') }; } catch (_e) { /* the defaults */ }
  const style = document.createElement('style');
  root.appendChild(style);
  const bento = () => root.querySelector('.tfBento');
  const onWeather = () => app.classList.contains('tfWeatherOpen');

  /* ---- the look, as CSS on #app.hcAmbient (ambient.css reads these) ---- */
  function apply() {
    const on = s.on && onWeather();
    app.classList.toggle('hcAmbient', on);
    if (!on) { style.textContent = ''; regroup('loose'); return; }
    const cs = getComputedStyle(app);
    const themeGround = cs.getPropertyValue('--color-bg-ground').trim() || '#f1f1f1', themeCard = cs.getPropertyValue('--color-bg-card').trim() || '#ffffff';
    const [g1, g2] = s.ground === 'tint' ? dayTint() : s.ground === 'colour' ? [s.groundColour, s.groundColour] : [themeGround, themeGround];
    const mixT = s.ground === 'tint' ? s.tint / 100 : 1;
    const ground = 'color-mix(in srgb,' + g1 + ' ' + Math.round(mixT * 100) + '%,' + themeGround + ')', ground2 = 'color-mix(in srgb,' + g2 + ' ' + Math.round(mixT * 100) + '%,' + themeGround + ')';
    const dark = lum(hexRgb(s.ground === 'colour' ? s.groundColour : s.ground === 'tint' ? g1 : (themeGround.startsWith('#') ? themeGround : '#ffffff'))) < 0.3;
    const text = dark ? '#d9d9d9' : '#26221e', cardBase = dark ? '#ffffff' : themeCard, cardMix = dark ? 10 : 100;
    const vars = {
      '--amb-ground': ground, '--amb-ground2': s.gradient === 'on' ? ground2 : ground, '--amb-text': text,
      '--amb-muted': 'color-mix(in srgb,' + text + ' ' + Math.round(s.mutedA * 0.55) + '%,transparent)',
      '--amb-card': 'color-mix(in srgb,color-mix(in srgb,' + cardBase + ' ' + cardMix + '%,' + ground + ') ' + s.cardA + '%,transparent)',
      '--amb-blur': (s.cardA > 0 && s.cardA < 100 ? s.blur : 0) + 'px', '--amb-radius': s.radius + 'px',
      '--amb-stroke': s.stroke === 'none' ? 'none' : s.stroke === 'hair' ? 'inset 0 0 0 .4px color-mix(in srgb,' + text + ' 18%,transparent)' : 'inset 0 0 0 1px color-mix(in srgb,' + text + ' 22%,transparent)',
      '--amb-gap': s.gap + 'px', '--amb-pad': s.pad + 'px', '--amb-margin': s.margin + 'px',
      '--amb-name-w': s.nameW, '--amb-value-k': s.valueK / 100, '--amb-art-sat': s.artSat / 100,
      '--amb-group': 'color-mix(in srgb,' + cardBase + ' ' + Math.round(s.groupA * cardMix / 100) + '%,transparent)', '--amb-group-pad': s.groupPad + 'px',
      '--amb-tile': 'color-mix(in srgb,' + text + ' 7%,transparent)',
    };
    style.textContent = '#app.hcAmbient{' + Object.entries(vars).map(([k, v]) => k + ':' + v).join(';') + '}' +
      (s.hide.length ? '#app.hcAmbient .tfBento .wbItem:is(' + s.hide.map((k) => '[data-card="' + k + '"]').join(',') + '){display:none!important}' : '');
    app.classList.toggle('hcAmbDark', dark);
    app.classList.toggle('hcAmbStill', s.still === 'on');
    app.classList.toggle('hcAmbNoLabels', s.labels === 'off');
    app.dataset.ambIcons = s.icons;
    regroup(s.group);
  }
  /* ---- grouping: the tiles wrapped in panels, and put back (the bento keeps every widget's element, so they're moved,
     never drawn again) ---- */
  let grouped = null;
  function regroup(mode) {
    const box = bento()?.querySelector('.wbBento');
    if (!box) return;
    if (grouped) { // back in the bento in their order
      const items = [...box.querySelectorAll('.wbItem')];
      box.querySelectorAll('.ambGroup').forEach((g) => g.remove());
      items.sort((a, b) => a.dataset.ambI - b.dataset.ambI).forEach((it) => box.appendChild(it));
      grouped = null;
    }
    if (mode === 'loose') return;
    const items = [...box.querySelectorAll('.wbItem')];
    items.forEach((it, i) => { it.dataset.ambI = i; });
    const tiles = items.filter((it) => it.dataset.size === 'tile' && !it.hidden && !s.hide.includes(it.dataset.card));
    // a panel is one item of the peg grid, so it's told how many rows and columns it takes: its tiles' rows (4 each, as
    // many across as fit), the label's row, and its padding, in the grid's rows of 60 and the gap
    const n = Number(bento().style.getPropertyValue('--peg-n')) || 4, gap = s.gap;
    const panel = (label, list, cols = n) => {
      if (!list.length) return;
      const g = Object.assign(document.createElement('div'), { className: 'ambGroup' + (label ? ' ambLabelled' : '') });
      if (label) g.dataset.label = label;
      const inside = Math.ceil(list.length / cols) * 4 + (label && s.labels !== 'off' ? 1 : 0);
      const h = inside * 60 + (inside - 1) * gap + 2 * s.groupPad;
      g.style.gridRow = 'span ' + Math.ceil((h + gap) / (60 + gap));
      g.style.gridColumn = cols >= n ? '1/-1' : 'span ' + cols;
      g.style.setProperty('--amb-cols', cols);
      // it goes where its first tile was
      box.insertBefore(g, list[0]);
      list.forEach((it) => g.appendChild(it));
    };
    if (mode === 'gathered') panel('Conditions', tiles);
    else if (mode === 'pairs') for (let i = 0; i < tiles.length; i += 2) panel('', tiles.slice(i, i + 2), Math.min(2, n));
    else if (mode === 'kinds') KINDS.forEach(([label, keys]) => panel(label, tiles.filter((it) => keys.includes(it.dataset.card))));
    grouped = mode;
  }
  // the bento drawn again (another page and back): the groups again
  new MutationObserver(() => { if (onWeather() && s.on) { grouped = null; apply(); } }).observe(root.getElementById('homeView') || root, { childList: true, subtree: false });

  /* ---- the panel ---- */
  const pstyle = document.createElement('style');
  pstyle.textContent = `
    .hcAmb{position:fixed;z-index:400;left:96px;bottom:24px;width:320px;max-height:calc(100vh - 48px);overflow:auto;padding:14px 16px;border-radius:20px;background:var(--color-bg-card);
      box-shadow:0 8px 32px rgba(0,0,0,.18),0 0 0 .5px rgba(0,0,0,.1);color:var(--color-text-primary);font:400 13px/1.3 var(--font);scrollbar-width:thin}
    .hcAmb[hidden]{display:none}
    .hcAmb.min{width:auto;padding:8px 10px}
    .hcAmb.min>:not(.hcAmbHead){display:none}
    .hcAmbHead{display:flex;align-items:center;gap:8px}
    .hcAmbHead b{font:600 14px/20px var(--font-tile);flex:1}
    .hcAmb h4{margin:14px 0 6px;font:600 12px/16px var(--font-tile);color:var(--color-text-muted);text-transform:uppercase;letter-spacing:.04em}
    .hcAmbPresets{display:grid;grid-template-columns:1fr 1fr;gap:6px}
    .hcAmb .hcAmbPresets button{display:block;height:auto;padding:8px 10px;text-align:start;border-radius:12px;line-height:1.2}
    .hcAmb .hcAmbPresets button[aria-pressed="true"]{background:var(--color-text-primary);color:var(--color-bg-card)}
    .hcAmbPresets small{display:block;margin-top:2px;font:400 11px/1.3 var(--font);opacity:.7}
    .hcAmbNote{margin:6px 0 0;color:var(--color-text-muted);font:400 12px/1.4 var(--font)}
    .hcAmb label{display:grid;grid-template-columns:104px 1fr 56px;align-items:center;gap:8px;margin:4px 0}
    .hcAmb input[type=range]{width:100%;accent-color:var(--primary)}
    .hcAmb input[type=color]{grid-column:2/4;width:56px;height:28px;padding:0;border:0;border-radius:8px;background:none}
    .hcAmb .seg{grid-column:2/4;display:flex;gap:2px;padding:2px;border-radius:9px;background:var(--color-bg-tile)}
    .hcAmb .seg button{flex:1;height:24px;padding:0 6px;border-radius:7px;background:none;font:600 11px/1 var(--font-tile)}
    .hcAmb .seg button[aria-pressed="true"]{background:var(--color-bg-card);box-shadow:0 0 0 .5px rgba(0,0,0,.1)}
    .hcAmb output{text-align:right;font-variant-numeric:tabular-nums;color:var(--color-text-muted)}
    .hcAmbW{display:flex;flex-wrap:wrap;gap:4px}
    .hcAmbW button{height:26px;padding:0 10px;border-radius:13px;font:600 12px/1 var(--font-tile)}
    .hcAmbW button[aria-pressed="false"]{opacity:.45;text-decoration:line-through}
    .hcAmbBtns{display:flex;flex-wrap:wrap;gap:6px;margin-top:12px}
    .hcAmb button{border:0;background:var(--color-bg-tile);color:var(--color-text-primary);cursor:pointer;font:600 13px/1 var(--font-tile);height:30px;padding:0 12px;border-radius:10px}
    .hcAmb .switch{width:40px;height:24px;padding:0;border-radius:12px;position:relative;background:var(--color-bg-tile)}
    .hcAmb .switch.on{background:var(--primary)}
    .hcAmb .switch::after{content:"";position:absolute;top:3px;left:3px;width:18px;height:18px;border-radius:9px;background:#fff;transition:left .15s}
    .hcAmb .switch.on::after{left:19px}`;
  app.appendChild(pstyle);
  const box = Object.assign(document.createElement('div'), { className: 'hcAmb' });
  box.setAttribute('role', 'dialog');
  box.setAttribute('aria-label', 'Ambient lab');
  const seg = (k, opts) => '<span class="seg">' + opts.map(([v, t]) => '<button type="button" data-seg="' + k + '" data-v="' + v + '" aria-pressed="' + (String(s[k]) === v) + '">' + t + '</button>').join('') + '</span>';
  const row = ([k, label, a, b, step, unit]) => '<label><span>' + label + '</span>' + (Array.isArray(a) ? seg(k, a) : a === 'colour' ? '<input type="color" data-k="' + k + '" value="' + s[k] + '">'
    : '<input type="range" min="' + a + '" max="' + b + '" step="' + step + '" value="' + s[k] + '" data-k="' + k + '"><output data-o="' + k + '">' + s[k] + unit + '</output>') + '</label>';
  function draw() {
    const min = box.classList.contains('min');
    box.innerHTML = '<div class="hcAmbHead"><b>Ambient lab</b><button type="button" class="switch' + (s.on ? ' on' : '') + '" data-on role="switch" aria-checked="' + s.on + '" aria-label="Ambient"></button><button type="button" data-min aria-label="Fold">' + (min ? '+' : '–') + '</button></div>' +
      '<h4>Interpretations</h4><div class="hcAmbPresets">' + Object.entries(PRESETS).map(([k, p]) => '<button type="button" data-preset="' + k + '" aria-pressed="' + (s.preset === k) + '">' + p.name + '<small>' + p.note.split('.')[0] + '.</small></button>').join('') + '</div>' +
      (PRESETS[s.preset] ? '<p class="hcAmbNote">' + PRESETS[s.preset].note + '</p>' : '') +
      GROUPS.map(([t, rows]) => '<h4>' + t + '</h4>' + rows.map(row).join('')).join('') +
      '<h4>Widgets</h4><div class="hcAmbW">' + WIDGETS.map(([k, t]) => '<button type="button" data-w="' + k + '" aria-pressed="' + !s.hide.includes(k) + '">' + t + '</button>').join('') + '</div>' +
      '<div class="hcAmbBtns"><button type="button" data-copy>Copy values</button><button type="button" data-reset>Back to today</button></div>';
  }
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(s)); } catch (_e) { /* this visit only */ } };
  const set = (patch, preset = 'custom') => { s = { ...s, ...patch, preset }; save(); apply(); draw(); };
  box.addEventListener('input', (ev) => {
    const k = ev.target.dataset.k; if (!k) return;
    s[k] = ev.target.type === 'range' ? Number(ev.target.value) : ev.target.value;
    s.preset = 'custom';
    const o = box.querySelector('[data-o="' + k + '"]'); if (o) o.textContent = ev.target.value + o.textContent.replace(/^-?[\d.]+/, '');
    box.querySelectorAll('[data-preset]').forEach((b) => b.setAttribute('aria-pressed', 'false'));
    if (k === 'groundColour') s.ground = 'colour';
    save(); apply();
  });
  box.addEventListener('click', (ev) => {
    const t = ev.target.closest('button'); if (!t) return;
    if (t.hasAttribute('data-on')) { set({ on: !s.on }, s.preset); return; }
    if (t.hasAttribute('data-min')) { box.classList.toggle('min'); draw(); return; }
    if (t.dataset.preset) { set({ ...BASE, on: true, hide: s.hide, ...PRESETS[t.dataset.preset] }, t.dataset.preset); return; }
    if (t.dataset.seg) { const k = t.dataset.seg, v = t.dataset.v; set({ [k]: k === 'nameW' ? Number(v) : v }); return; }
    if (t.dataset.w) { const k = t.dataset.w; set({ hide: s.hide.includes(k) ? s.hide.filter((x) => x !== k) : [...s.hide, k] }, s.preset); return; }
    if (t.hasAttribute('data-reset')) { set({ ...BASE, on: true }, 'custom'); return; }
    if (t.hasAttribute('data-copy')) { const { on: _on, preset: _p, ...vals } = s; navigator.clipboard?.writeText(JSON.stringify(vals, null, 2)); t.textContent = 'Copied'; setTimeout(() => { t.textContent = 'Copy values'; }, 1200); }
  });
  app.appendChild(box);
  draw();
  // only on the Weather page
  const show = () => { box.hidden = !onWeather(); apply(); };
  new MutationObserver(show).observe(app, { attributes: true, attributeFilter: ['class'] });
  show();
}
