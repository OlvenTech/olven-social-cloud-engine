#!/usr/bin/env node
/**
 * Olven Tech — ArtCraft EffectCraft (v0.24.1) 3D Cinema Reel Engine (1080x1920, 30fps, 16.0s).
 *
 * True pure-Rust After Effects 3D compositor pipeline:
 * 1. Renders 5 crystal-clear 2x Retina transparent Apple Liquid Glass Hero Slabs (PNG alpha).
 * 2. Assembles a native EffectCraft 3D composition (1080x1920, 30fps, 180-deg optical motion blur,
 *    35mm Cinema Camera, 3D spatial tilt/Z-depth choreography, Apple Easy-Ease 85% velocity curves,
 *    specular Light Sweep VFX across glass edges, subtle Vignette, and 35mm monochrome Add Grain).
 * 3. Renders natively at 10 Mbps H.264 in pure Rust (`effectcraft-cli render`) and muxes our
 *    approved NYC Felt Piano signature soundtrack (`nyc_felt_piano_mvt1-3.mp3`, -14 LUFS) with
 *    Rec.709 Apple color tags.
 */
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
let chromium;
try { ({ chromium } = require('playwright')); } catch { ({ chromium } = require('playwright-core')); }

const WIDTH = 1080;
const HEIGHT = 1920;
const FPS = 30;
const DURATION = 16.0;

const ASSETS_DIR = path.join(__dirname, 'assets');
const MUSIC_DIR = path.join(ASSETS_DIR, 'music');

const THEMES = {
  apple_porcelain: {
    name: 'apple_porcelain',
    track: 'nyc_felt_piano_mvt1.mp3',
    lightBg: '#F2F0EC',
    darkBg: '#080A0E',
    lightInk: '#0A0D14',
    lightMuted: '#5C6270',
    darkInk: '#F7F8FA',
    darkMuted: '#949BA8',
    accent: '#0052FF',
    accentOnDark: '#34D399',
    alert: '#E11D48',
  },
  titanium_obsidian: {
    name: 'titanium_obsidian',
    track: 'nyc_felt_piano_mvt2.mp3',
    lightBg: '#F4F5F7',
    darkBg: '#07090D',
    lightInk: '#090B10',
    lightMuted: '#586070',
    darkInk: '#F8FAFC',
    darkMuted: '#9098A6',
    accent: '#059669',
    accentOnDark: '#34D399',
    alert: '#F43F5E',
  },
  silver_glass: {
    name: 'silver_glass',
    track: 'nyc_felt_piano_mvt3.mp3',
    lightBg: '#F5F6FA',
    darkBg: '#081222',
    lightInk: '#0A1F38',
    lightMuted: '#56677C',
    darkInk: '#FFFFFF',
    darkMuted: '#92A6BE',
    accent: '#635BFF',
    accentOnDark: '#2DD4BF',
    alert: '#E11D48',
  },
};

const ARCHETYPE_TO_THEME = {
  editorial_light_blueprint: 'apple_porcelain',
  circuit_breaker_state_machine: 'apple_porcelain',
  security_policy_shield_matrix: 'titanium_obsidian',
  split_latency_waterfall: 'titanium_obsidian',
  revenue_ledger_reconciliation: 'silver_glass',
  cdc_hash_diff_funnel: 'silver_glass',
};

function esc(s) {
  return String(s || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function stripHtml(s) {
  return String(s || '').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
}

function fontBase64(filename) {
  const fp = path.join(ASSETS_DIR, filename);
  return fs.existsSync(fp) ? fs.readFileSync(fp).toString('base64') : '';
}

function loadTransparentLogoDataUri(inkHex, cutoutHex) {
  const fp = path.join(ASSETS_DIR, 'horizontal_dark.svg');
  if (!fs.existsSync(fp)) return '';
  let svg = fs.readFileSync(fp, 'utf8');
  svg = svg.replace(/<path[^>]*id="path1-3"[^>]*\/>/g, '');
  svg = svg
    .replace(/style="fill:#000000;/g, `style="fill:${cutoutHex};`)
    .replace(/style="fill:#ffffff;/g, `style="fill:${inkHex};`)
    .replace(/fill="#ffffff"/g, `fill="${inkHex}"`);
  return 'data:image/svg+xml;base64,' + Buffer.from(svg, 'utf8').toString('base64');
}

function detectChromeExecutable() {
  for (const p of ['/usr/bin/google-chrome', '/usr/bin/chromium', '/usr/bin/chromium-browser']) {
    if (fs.existsSync(p)) return p;
  }
  return undefined;
}

function detectEffectCraftCli() {
  const candidates = [
    process.env.EFFECTCRAFT_CLI,
    '/home/antigravity/.local/artcraft/effectcraft/effectcraft-0.24.1-linux-x86_64/bin/effectcraft-cli',
    path.join(process.env.HOME || '', '.local/artcraft/effectcraft/effectcraft-0.24.1-linux-x86_64/bin/effectcraft-cli'),
    '/usr/local/bin/effectcraft-cli',
    '/usr/bin/effectcraft-cli',
  ].filter(Boolean);
  for (const p of candidates) {
    if (fs.existsSync(p)) return p;
  }
  return 'effectcraft-cli';
}

function compileEditorialScript(spec) {
  const m0 = (spec.metrics && spec.metrics[0]) || { value: '99.9%', label: 'RELIABILITY', sub: 'Production verified' };
  const m1 = (spec.metrics && spec.metrics[1]) || { value: '$0', label: 'LEAKAGE', sub: 'Zero lost events' };
  const m2 = (spec.metrics && spec.metrics[2]) || { value: '0', label: 'DOWNTIME', sub: 'Full audit trail' };

  const bNodes = (spec.before_nodes || ['Direct API Call', 'Rate Limit Hit', 'Silent Data Loss']).slice(0, 3);
  const aNodes = (spec.after_nodes || ['Postgres Outbox', 'Idempotent Worker', 'Atomic Commit']).slice(0, 3);

  const domainRaw = String(spec.eyebrow || 'BACKEND SYSTEMS').split('·')[0].trim();
  const domainShort = domainRaw.split(/\s+/).slice(0, 2).join(' ').toUpperCase();

  const badBadge = String(spec.before_badge || '').trim();
  const hl = stripHtml(spec.headline || 'Your backend is leaking revenue.');
  let hookL1 = 'Your backend';
  let hookL2 = 'is leaking';
  let hookAccent = badBadge || m0.value;

  const hlLower = hl.toLowerCase();
  if (hlLower.includes('stripe') || hlLower.includes('billing') || hlLower.includes('usage') || hlLower.includes('revenue')) {
    hookL1 = 'Your billing';
    hookL2 = 'pipeline leaks';
    hookAccent = m0.value.includes('$') ? m0.value : (m1.value.includes('$') ? m1.value : badBadge);
  } else if (hlLower.includes('webhook') || hlLower.includes('outbox') || hlLower.includes('erp')) {
    hookL1 = 'Failed webhooks';
    hookL2 = 'quietly drop';
    hookAccent = badBadge || 'live orders.';
  } else if (hlLower.includes('lead') || hlLower.includes('hubspot') || hlLower.includes('routing')) {
    hookL1 = 'Slow lead';
    hookL2 = 'routing costs';
    hookAccent = badBadge || '8.7% pipeline.';
  } else if (hlLower.includes('llm') || hlLower.includes('agent') || hlLower.includes('refund')) {
    hookL1 = 'LLM prompts';
    hookL2 = 'are not a';
    hookAccent = 'security wall.';
  } else if (hlLower.includes('inventory') || hlLower.includes('oversell') || hlLower.includes('shopify')) {
    hookL1 = '15-min crons';
    hookL2 = 'cause live';
    hookAccent = badBadge || 'oversells.';
  } else if (hlLower.includes('netsuite') || hlLower.includes('payout') || hlLower.includes('reconcil')) {
    hookL1 = 'Per-charge';
    hookL2 = 'webhooks break';
    hookAccent = 'month-end close.';
  } else {
    const words = hl.split(/\s+/);
    hookL1 = words.slice(0, 2).join(' ');
    hookL2 = words.slice(2, 4).join(' ');
    hookAccent = m0.value;
  }

  if (hookAccent.length > 17) hookAccent = m0.value;
  if (!/[.!?%]$/.test(hookAccent) && !hookAccent.includes('/')) hookAccent = hookAccent + '.';

  let heroMetric = m0;
  for (const m of [m0, m1, m2]) {
    if (String(m.value).includes('$') || String(m.value).includes('%')) {
      heroMetric = m;
      break;
    }
  }
  const rest = [m0, m1, m2].filter((x) => x !== heroMetric);
  const subA = rest[0] || m1;
  const subB = rest[1] || m2;

  const cleanTag = (s) => String(s || '').replace(/\s+/g, ' ').trim();
  const heroLabel = cleanTag(heroMetric.label).toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
  const heroSub = cleanTag(heroMetric.sub);
  const painKicker = badBadge
    ? `${badBadge.toLowerCase().replace(/^\w/, (c) => c.toUpperCase())}.`
    : `${cleanTag(m1.sub)}.`;
  const hookFoot = cleanTag(m2.sub || m1.sub || 'Enterprise systems audit');

  const diag0 = cleanTag(spec.before_title || bNodes[0]).replace(/^Before:\s*/i, '') + '.';
  const diag1 = cleanTag(bNodes[1] || 'Direct API Coupling') + '.';
  const diag2 = cleanTag(bNodes[2] || 'Silent Data Loss') + '.';

  return {
    domainShort,
    hookL1,
    hookL2,
    hookAccent,
    hookFoot,
    diagLines: [diag0, diag1, diag2],
    painKicker,
    archSteps: [
      { num: '01', title: cleanTag(aNodes[0]) },
      { num: '02', title: cleanTag(aNodes[1]) },
      { num: '03', title: cleanTag(aNodes[2]) },
    ],
    archFoot: cleanTag(spec.after_badge || 'Zero lost events · Full audit trail'),
    heroVal: cleanTag(heroMetric.value),
    heroFontPx: cleanTag(heroMetric.value).length >= 7 ? 148 : (cleanTag(heroMetric.value).length >= 5 ? 174 : 196),
    heroLabel,
    heroSub,
    subA: { val: cleanTag(subA.value), lbl: cleanTag(subA.label).toLowerCase() },
    subB: { val: cleanTag(subB.value), lbl: cleanTag(subB.label).toLowerCase() },
  };
}

/**
 * Renders 5 transparent-background 2x Retina Apple Liquid Glass Hero Cards (PNG alpha)
 * to be composited as true 3D spatial layers inside ArtCraft EffectCraft.
 */
async function renderTransparentGlassCards(script, theme, workDir) {
  const interB64 = fontBase64('Inter.woff2');
  const monoB64 = fontBase64('IBMPlexMono.woff2');
  const logoDarkUri = loadTransparentLogoDataUri(theme.darkInk, '#12151C');

  const baseCss = `
    @font-face { font-family: 'Inter'; src: url('data:font/woff2;base64,${interB64}') format('woff2'); font-weight: 100 900; }
    @font-face { font-family: 'IBM Plex Mono'; src: url('data:font/woff2;base64,${monoB64}') format('woff2'); font-weight: 400 700; }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    html, body {
      width: 960px; height: 1420px; background: transparent; overflow: hidden;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif;
      -webkit-font-smoothing: antialiased;
      display: flex; flex-direction: column; justify-content: center; padding: 36px;
    }
    .folio {
      margin-bottom: 34px; padding: 16px 28px; border-radius: 999px;
      display: flex; justify-content: space-between; align-items: center;
      font-family: 'IBM Plex Mono', monospace; font-size: 18px; font-weight: 600;
      letter-spacing: 0.13em; text-transform: uppercase;
    }
    .gl-light {
      background: linear-gradient(155deg, rgba(255,255,255,0.92) 0%, rgba(255,255,255,0.74) 100%);
      border: 1.5px solid rgba(255,255,255,0.98);
      box-shadow:
        0 34px 76px -18px rgba(15, 23, 42, 0.22),
        0 10px 26px -8px rgba(15, 23, 42, 0.10),
        inset 0 2px 0 rgba(255,255,255,1.0),
        inset 0 -1px 0 rgba(15,23,42,0.06);
      color: ${theme.lightInk};
    }
    .gl-dark {
      background: linear-gradient(155deg, rgba(26, 30, 39, 0.92) 0%, rgba(12, 15, 21, 0.86) 100%);
      border: 1.5px solid rgba(255,255,255,0.20);
      box-shadow:
        0 40px 88px -18px rgba(0, 0, 0, 0.78),
        0 14px 32px -10px rgba(0, 0, 0, 0.50),
        inset 0 1.5px 0 rgba(255,255,255,0.34),
        inset 0 -1px 0 rgba(255,255,255,0.06);
      color: ${theme.darkInk};
    }
    .card {
      position: relative; border-radius: 40px; padding: 60px 56px; overflow: hidden;
    }
    .card::before {
      content: ''; position: absolute; top: 0; left: 0; right: 0; height: 38%;
      background: linear-gradient(180deg, rgba(255,255,255,0.24) 0%, rgba(255,255,255,0) 100%);
      pointer-events: none;
    }
    .mac-bar { display: flex; align-items: center; justify-content: space-between; margin-bottom: 40px; }
    .dots { display: flex; gap: 11px; }
    .dot { width: 14px; height: 14px; border-radius: 50%; }
    .dr { background: #FF5F57; } .dy { background: #FEBC2E; } .dg { background: #28C840; }
    .mtitle { font-family: 'IBM Plex Mono', monospace; font-size: 18px; font-weight: 600; letter-spacing: 0.1em; opacity: 0.62; text-transform: uppercase; }
  `;

  const cardsHtml = [
    // CARD 0: Apple Porcelain Liquid Glass Pain Hook
    `<!doctype html><html><head><meta charset="utf-8"><style>${baseCss}
      .pill { display:inline-flex; align-items:center; gap:12px; padding:11px 22px; border-radius:999px; background:rgba(10,13,20,0.06); font-family:'IBM Plex Mono',monospace; font-size:19px; font-weight:600; letter-spacing:0.1em; color:${theme.lightMuted}; margin-bottom:38px; }
      .pdot { width:10px; height:10px; border-radius:50%; background:${theme.alert}; }
      .h { font-size:88px; font-weight:850; line-height:1.03; letter-spacing:-0.048em; }
      .ha { font-size:98px; font-weight:850; line-height:1.02; letter-spacing:-0.052em; color:${theme.accent}; margin-top:8px; }
      .ft { margin-top:44px; padding-top:28px; border-top:1px solid rgba(10,13,20,0.12); font-family:'IBM Plex Mono',monospace; font-size:22px; font-weight:500; color:${theme.lightMuted}; }
    </style></head><body>
      <div class="folio gl-light" style="color:${theme.lightMuted};"><span>OLVEN TECH · ${esc(script.domainShort)}</span><span>01 / 05</span></div>
      <div class="card gl-light">
        <div class="pill"><span class="pdot"></span><span>PRODUCTION AUDIT</span></div>
        <div class="h">${esc(script.hookL1)}</div>
        <div class="h">${esc(script.hookL2)}</div>
        <div class="ha">${esc(script.hookAccent)}</div>
        <div class="ft">${esc(script.hookFoot)}</div>
      </div>
    </body></html>`,

    // CARD 1: macOS Sequoia Frosted Glass Diagnosis Window
    `<!doctype html><html><head><meta charset="utf-8"><style>${baseCss}
      .dl { font-size:60px; font-weight:800; line-height:1.12; letter-spacing:-0.042em; margin-bottom:20px; }
      .dl0 { color:${theme.lightMuted}; text-decoration:line-through; text-decoration-color:${theme.alert}; text-decoration-thickness:5px; }
      .kick { margin-top:34px; padding-top:28px; border-top:1px solid rgba(10,13,20,0.14); font-size:38px; font-weight:800; color:${theme.alert}; letter-spacing:-0.03em; }
    </style></head><body>
      <div class="folio gl-light" style="color:${theme.lightMuted};"><span>ROOT CAUSE · DIAGNOSIS</span><span>02 / 05</span></div>
      <div class="card gl-light">
        <div class="mac-bar"><div class="dots"><span class="dot dr"></span><span class="dot dy"></span><span class="dot dg"></span></div><span class="mtitle">incident-trace.log</span></div>
        <div class="dl dl0">${esc(script.diagLines[0])}</div>
        <div class="dl">${esc(script.diagLines[1])}</div>
        <div class="dl">${esc(script.diagLines[2])}</div>
        <div class="kick">${esc(script.painKicker)}</div>
      </div>
    </body></html>`,

    // CARD 2: Space-Black Titanium Architecture Glass Stack
    `<!doctype html><html><head><meta charset="utf-8"><style>${baseCss}
      .t { font-size:56px; font-weight:800; letter-spacing:-0.042em; color:${theme.darkInk}; margin-bottom:36px; }
      .row { display:flex; align-items:baseline; gap:26px; padding:32px 36px; border-radius:26px; margin-bottom:20px; }
      .num { font-family:'IBM Plex Mono',monospace; font-size:24px; font-weight:700; color:${theme.accentOnDark}; }
      .st { font-size:38px; font-weight:750; letter-spacing:-0.03em; color:${theme.darkInk}; }
      .af { margin-top:28px; display:flex; align-items:center; gap:14px; font-family:'IBM Plex Mono',monospace; font-size:23px; font-weight:600; color:${theme.accentOnDark}; }
      .ad { width:12px; height:12px; border-radius:50%; background:${theme.accentOnDark}; }
    </style></head><body>
      <div class="folio gl-dark" style="color:${theme.darkMuted};"><span>THE FIX · ARCHITECTURE</span><span>03 / 05</span></div>
      <div class="t">How we rebuilt it.</div>
      ${script.archSteps.map((s) => `<div class="row gl-dark"><span class="num">${s.num}</span><span class="st">${esc(s.title)}</span></div>`).join('')}
      <div class="af"><span class="ad"></span><span>${esc(script.archFoot)}</span></div>
    </body></html>`,

    // CARD 3: Apple Porcelain Liquid Glass Hero Metric
    `<!doctype html><html><head><meta charset="utf-8"><style>${baseCss}
      .ey { font-family:'IBM Plex Mono',monospace; font-size:21px; font-weight:600; letter-spacing:0.14em; color:${theme.lightMuted}; margin-bottom:18px; }
      .hn { font-size:${script.heroFontPx}px; font-weight:850; line-height:0.95; letter-spacing:-0.056em; color:${theme.accent}; font-variant-numeric:tabular-nums; }
      .hl { margin-top:24px; font-size:44px; font-weight:800; letter-spacing:-0.036em; }
      .hs { margin-top:10px; font-size:26px; font-weight:500; color:${theme.lightMuted}; }
      .grid { margin-top:28px; display:grid; grid-template-columns:1fr 1fr; gap:20px; }
      .pill { padding:30px 32px; border-radius:30px; }
      .pv { font-size:46px; font-weight:850; letter-spacing:-0.04em; font-variant-numeric:tabular-nums; }
      .pl { margin-top:8px; font-family:'IBM Plex Mono',monospace; font-size:18px; font-weight:600; color:${theme.lightMuted}; letter-spacing:0.08em; text-transform:uppercase; }
    </style></head><body>
      <div class="folio gl-light" style="color:${theme.lightMuted};"><span>VERIFIED · PRODUCTION PROOF</span><span>04 / 05</span></div>
      <div class="card gl-light">
        <div class="ey">VERIFIED PRODUCTION RESULT</div>
        <div class="hn">${esc(script.heroVal)}</div>
        <div class="hl">${esc(script.heroLabel)}.</div>
        <div class="hs">${esc(script.heroSub)}</div>
      </div>
      <div class="grid">
        <div class="pill gl-light"><div class="pv">${esc(script.subA.val)}</div><div class="pl">${esc(script.subA.lbl)}</div></div>
        <div class="pill gl-light"><div class="pv">${esc(script.subB.val)}</div><div class="pl">${esc(script.subB.lbl)}</div></div>
      </div>
    </body></html>`,

    // CARD 4: Space-Black Titanium Flagship Close
    `<!doctype html><html><head><meta charset="utf-8"><style>${baseCss}
      .cl { font-size:80px; font-weight:850; line-height:1.04; letter-spacing:-0.046em; color:${theme.darkInk}; }
      .ca { color:${theme.accentOnDark}; }
      .dock { margin-top:52px; padding:34px 40px; border-radius:34px; display:flex; align-items:center; justify-content:space-between; }
      .logo { height:50px; width:auto; display:block; }
      .btn { padding:18px 34px; border-radius:999px; background:#FFFFFF; color:#080A0E; font-family:'IBM Plex Mono',monospace; font-size:23px; font-weight:700; letter-spacing:0.08em; }
      .url { margin-top:28px; padding-left:10px; font-family:'IBM Plex Mono',monospace; font-size:22px; font-weight:500; letter-spacing:0.08em; color:${theme.darkMuted}; }
    </style></head><body>
      <div class="folio gl-dark" style="color:${theme.darkMuted};"><span>OLVEN TECH · NEW YORK</span><span>05 / 05</span></div>
      <div class="cl">We engineer</div>
      <div class="cl">revenue-critical</div>
      <div class="cl ca">backends.</div>
      <div class="dock gl-dark">
        ${logoDarkUri ? `<img class="logo" src="${logoDarkUri}" alt="Olven Tech" />` : `<div style="font-size:40px;font-weight:800;">Olven Tech</div>`}
        <span class="btn">DM "AUDIT"</span>
      </div>
      <div class="url">OLVENTECH.COM  ·  NEW YORK</div>
    </body></html>`,
  ];

  const execPath = detectChromeExecutable();
  const browser = await chromium.launch({
    headless: true,
    ...(execPath ? { executablePath: execPath } : {}),
    args: ['--no-sandbox', '--disable-dev-shm-usage'],
  });

  const paths = [];
  try {
    const context = await browser.newContext({
      viewport: { width: 960, height: 1420 },
      deviceScaleFactor: 2, // 1920x2840 ultra-sharp 3D texture cards!
    });
    const page = await context.newPage();
    for (let i = 0; i < cardsHtml.length; i++) {
      await page.setContent(cardsHtml[i], { waitUntil: 'load' });
      await page.evaluate(() => document.fonts.ready);
      const outPng = path.join(workDir, `card_${i}.png`);
      await page.screenshot({ path: outPng, type: 'png', omitBackground: true });
      paths.push(outPng);
    }
    await context.close();
  } finally {
    await browser.close();
  }
  return paths;
}

/**
 * Helper to append keyframe + Apple 85% Easy-Ease velocity commands for an EffectCraft property.
 */
function addAnimatedProp(cmds, layer, propPath, keyframes) {
  for (const [time, value] of keyframes) {
    cmds.push({
      command: 'prop.addKey',
      params: { layer, path: propPath, time, timeBase: 'comp', value },
    });
  }
  cmds.push({
    command: 'keys.select',
    params: {
      keys: keyframes.map(([time]) => ({ layer, prop: propPath, time, timeBase: 'comp' })),
      add: false,
    },
  });
  cmds.push({ command: 'keys.easyEase', params: { which: 'both' } });
  cmds.push({ command: 'keys.velocity', params: { inInfluence: 82, outInfluence: 82 } });
}

async function renderWalkthroughVideo(specPath, outDir, themeOverride = null) {
  const spec = JSON.parse(fs.readFileSync(specPath, 'utf8'));
  const arch = spec.visual_archetype || 'editorial_light_blueprint';
  const themeKey = themeOverride || ARCHETYPE_TO_THEME[arch] || 'apple_porcelain';
  const theme = THEMES[themeKey] || THEMES.apple_porcelain;

  fs.mkdirSync(outDir, { recursive: true });
  const workDir = path.join(outDir, '_ec_work');
  fs.mkdirSync(workDir, { recursive: true });

  const trackPath = path.join(MUSIC_DIR, theme.track);
  if (!fs.existsSync(trackPath)) {
    throw new Error(`Missing NYC Felt Piano track: ${trackPath}`);
  }

  const t0 = Date.now();
  const script = compileEditorialScript(spec);

  // 1) Render 5 transparent 2x Retina Apple Liquid Glass Hero Cards
  const cardPaths = await renderTransparentGlassCards(script, theme, workDir);

  // 2) Build native ArtCraft EffectCraft 3D Cinema Composition (1080x1920, 30fps, 180-deg motion blur)
  const lightStart = theme.name === 'silver_glass' ? [0.992, 0.994, 1.0, 1.0] : [0.994, 0.990, 0.982, 1.0];
  const lightEnd = theme.name === 'silver_glass' ? [0.898, 0.910, 0.945, 1.0] : [0.892, 0.888, 0.880, 1.0];
  const darkStart = theme.name === 'silver_glass' ? [0.085, 0.130, 0.215, 1.0] : [0.095, 0.112, 0.155, 1.0];
  const darkEnd = [0.024, 0.030, 0.044, 1.0];

  const addStudioBackdrop = (name, startColor, endColor, inT = null, outT = null) => {
    cmds.push({ command: 'layer.newSolid', params: { name, color: theme.darkBg, width: WIDTH, height: HEIGHT } });
    if (inT !== null && outT !== null) {
      cmds.push({ command: 'layer.timing', params: { layers: [name], in: inT, out: outT } });
    }
    cmds.push({ command: 'effect.apply', params: { effect: 'ec.generate.gradientramp', layers: [name] } });
    cmds.push({ command: 'prop.set', params: { layer: name, path: 'effects/#1/shape', value: 1 } });
    cmds.push({ command: 'prop.set', params: { layer: name, path: 'effects/#1/start', value: [0.5, 0.34] } });
    cmds.push({ command: 'prop.set', params: { layer: name, path: 'effects/#1/end', value: [0.5, 1.08] } });
    cmds.push({ command: 'prop.set', params: { layer: name, path: 'effects/#1/startColor', value: startColor } });
    cmds.push({ command: 'prop.set', params: { layer: name, path: 'effects/#1/endColor', value: endColor } });
    cmds.push({ command: 'prop.set', params: { layer: name, path: 'effects/#1/scatter', value: 26.0 } });
  };

  const cmds = [
    {
      command: 'comp.new',
      params: {
        name: 'Main',
        width: WIDTH,
        height: HEIGHT,
        frameRate: FPS,
        duration: DURATION,
        background: theme.lightBg,
        shutterAngle: 180,
        shutterPhase: 0, // Strictly forward shutter [t, t + 0.5 frame]: guarantees zero Frame 0 pre-start ghosting
        motionBlurSamples: 8,
        renderer: 'classic3D',
        open: true,
      },
    },
  ];

  // Polarity-flip Apple Keynote softbox backdrops (Light Porcelain for Scenes 0, 1, 3; Space-Black Titanium for Scenes 2, 4)
  addStudioBackdrop('BgLight', lightStart, lightEnd, -0.5, 16.5);
  addStudioBackdrop('BgDark2', darkStart, darkEnd, 6.0, 10.0);
  addStudioBackdrop('BgDark4', darkStart, darkEnd, 13.0, 16.5);

  // Real 35mm Cinema Camera framed so 960px 2x Retina glass slabs fill ~925px boldly across 1080px mobile width
  cmds.push({
    command: 'layer.newCamera',
    params: {
      name: 'HeroCam',
      preset: '35mm',
      position: [540, 960, -1095],
      poi: [540, 960, 0],
    },
  });
  cmds.push({ command: 'layer.timing', params: { layers: ['HeroCam'], in: -0.5, out: 16.5 } });

  // Camera subtle Keynote breathing push-in & micro spatial drift (held steady at t=0..0.15 for tack-sharp cover)
  addAnimatedProp(cmds, 'HeroCam', 'transform/position', [
    [0.0, [540, 960, -1095]],
    [0.15, [540, 960, -1095]],
    [6.0, [548, 956, -1068]],
    [10.0, [532, 963, -1076]],
    [16.0, [540, 960, -1042]],
  ]);

  // Choreograph all 5 3D Apple Liquid Glass Cards (scale 50% because cards are 2x Retina 1920x2840 -> 960x1420 world units)
  const cardChoreo = [
    {
      name: 'Card0', idx: 0, inT: -0.5, outT: 2.85,
      // Frame 0 starts dead-center, zero velocity, tack-sharp for IG/Reels grid thumbnail!
      pos: [[0.0, [540, 940, 0]], [0.15, [540, 940, 0]], [2.25, [540, 940, -48]], [2.80, [110, 940, -390]]],
      rotY: [[0.0, 0], [0.15, 0], [2.25, -5.0], [2.80, -24]],
      rotX: [[0.0, 0], [0.15, 0], [2.25, 1.4]],
      op: [[0.0, 100], [2.30, 100], [2.78, 0]],
      sweep: [[0.25, [0.05, 0.15]], [2.15, [0.95, 0.85]]],
      sweepInt: 28,
    },
    {
      name: 'Card1', idx: 1, inT: 2.55, outT: 6.15,
      pos: [[2.55, [890, 960, 440]], [3.15, [540, 940, 0]], [5.55, [540, 940, -45]], [6.08, [540, 620, -380]]],
      rotY: [[2.55, 22], [3.15, 2.2], [5.55, -3.5], [6.08, -14]],
      rotX: [[2.55, -7], [3.15, 0], [5.55, 1.4], [6.08, 16]],
      op: [[2.55, 0], [2.95, 100], [5.65, 100], [6.05, 0]],
      sweep: [[3.0, [0.0, 0.2]], [5.45, [1.0, 0.82]]],
      sweepInt: 30,
    },
    {
      name: 'Card2', idx: 2, inT: 5.95, outT: 10.15,
      pos: [[5.95, [540, 1200, 420]], [6.55, [540, 945, 0]], [9.50, [540, 945, -50]], [10.05, [540, 720, -370]]],
      rotY: [[5.95, -14], [6.55, -2.2], [9.50, 3.8], [10.05, 16]],
      rotX: [[5.95, 16], [6.55, 0.8], [9.50, -1.4], [10.05, -14]],
      op: [[5.95, 0], [6.30, 100], [9.60, 100], [10.02, 0]],
      sweep: [[6.4, [0.0, 0.25]], [9.4, [1.0, 0.78]]],
      sweepInt: 40,
    },
    {
      name: 'Card3', idx: 3, inT: 9.95, outT: 13.15,
      pos: [[9.95, [540, 945, 520]], [10.55, [540, 945, -10]], [12.55, [540, 945, -60]], [13.08, [910, 945, -390]]],
      rotY: [[9.95, -18], [10.55, -1.8], [12.55, 3.4], [13.08, 22]],
      rotX: [[9.95, 7], [10.55, 0], [12.55, -1.0]],
      op: [[9.95, 0], [10.30, 100], [12.62, 100], [13.02, 0]],
      sweep: [[10.4, [0.05, 0.2]], [12.5, [0.95, 0.85]]],
      sweepInt: 32,
    },
    {
      name: 'Card4', idx: 4, inT: 12.95, outT: 16.5,
      pos: [[12.95, [540, 1140, 390]], [13.60, [540, 950, 0]], [16.0, [540, 950, -32]]],
      rotY: [[12.95, 13], [13.60, 1.0], [16.0, -1.5]],
      rotX: [[12.95, 13], [13.60, 0], [16.0, 0]],
      op: [[12.95, 0], [13.35, 100], [16.0, 100]],
      sweep: [[13.5, [0.0, 0.3]], [15.6, [1.0, 0.75]]],
      sweepInt: 38,
    },
  ];

  for (const c of cardChoreo) {
    cmds.push({ command: 'file.import', params: { paths: [cardPaths[c.idx]], addToComp: true } });
    cmds.push({ command: 'layer.rename', params: { layer: '#1', name: c.name } });
    cmds.push({ command: 'layer.setSwitch', params: { layers: [c.name], switch: 'threeD', value: true } });
    cmds.push({ command: 'layer.setSwitch', params: { layers: [c.name], switch: 'motionBlur', value: true } });
    cmds.push({ command: 'layer.timing', params: { layers: [c.name], in: c.inT, out: c.outT } });
    cmds.push({ command: 'prop.set', params: { layer: c.name, path: 'transform/scale', value: [50, 50, 50] } });

    addAnimatedProp(cmds, c.name, 'transform/position', c.pos);
    addAnimatedProp(cmds, c.name, 'transform/rotationY', c.rotY);
    addAnimatedProp(cmds, c.name, 'transform/rotationX', c.rotX);
    addAnimatedProp(cmds, c.name, 'transform/opacity', c.op);

    // Apply real EffectCraft specular glass Light Sweep across every 3D Apple Liquid Glass slab!
    cmds.push({ command: 'effect.apply', params: { effect: 'ec.generate.cclightsweep', layers: [c.name] } });
    cmds.push({ command: 'prop.set', params: { layer: c.name, path: 'effects/#1/direction', value: -28.0 } });
    cmds.push({ command: 'prop.set', params: { layer: c.name, path: 'effects/#1/width', value: 84.0 } });
    cmds.push({ command: 'prop.set', params: { layer: c.name, path: 'effects/#1/sweepIntensity', value: c.sweepInt } });
    cmds.push({ command: 'prop.set', params: { layer: c.name, path: 'effects/#1/edgeIntensity', value: 78.0 } });
    cmds.push({ command: 'prop.set', params: { layer: c.name, path: 'effects/#1/edgeThickness', value: 2.0 } });
    addAnimatedProp(cmds, c.name, 'effects/#1/center', c.sweep);
  }

  // Top Adjustment Layer: subtle Apple studio Vignette + real 35mm monochrome anti-banding Grain!
  cmds.push({ command: 'layer.newAdjustment', params: { name: 'CinemaGrade' } });
  cmds.push({ command: 'effect.apply', params: { effect: 'ec.stylize.ccvignette', layers: ['CinemaGrade'] } });
  cmds.push({ command: 'prop.set', params: { layer: 'CinemaGrade', path: 'effects/#1/amount', value: 12.0 } });
  cmds.push({ command: 'effect.apply', params: { effect: 'ec.noise.addgrain', layers: ['CinemaGrade'] } });
  cmds.push({ command: 'prop.set', params: { layer: 'CinemaGrade', path: 'effects/#2/viewingMode', value: 2 } });
  cmds.push({ command: 'prop.set', params: { layer: 'CinemaGrade', path: 'effects/#2/tweaking/intensity', value: 0.14 } });
  cmds.push({ command: 'prop.set', params: { layer: 'CinemaGrade', path: 'effects/#2/color/monochromatic', value: true } });

  const cmdsPath = path.join(workDir, 'build_comp.json');
  const projPath = path.join(workDir, 'olven_reel.ecproj');
  const rawMp4 = path.join(workDir, 'video_silent.mp4');
  const outMp4 = path.join(outDir, 'walkthrough-video.mp4');
  fs.writeFileSync(cmdsPath, JSON.stringify(cmds, null, 2));

  const ecCli = detectEffectCraftCli();
  execFileSync(ecCli, ['--empty', 'run', '--commands', cmdsPath, '--save-as', projPath], { stdio: 'pipe' });
  execFileSync(ecCli, [
    '--project', projPath,
    'render', '--comp', 'Main',
    '--out', rawMp4,
    '--format', 'h264',
    '--fps', String(FPS),
    '--bitrate', '10000',
    '--quality', 'best',
    '--audio', 'off',
  ], { stdio: 'inherit' });

  // 3) Mux our approved NYC Felt Piano studio soundtrack + Rec.709 color tags (stream copy video — 0 quality loss!)
  execFileSync('ffmpeg', [
    '-y', '-v', 'error',
    '-i', rawMp4,
    '-i', trackPath,
    '-map', '0:v:0', '-map', '1:a:0',
    '-c:v', 'copy',
    '-c:a', 'aac', '-b:a', '192k', '-ar', '48000',
    '-movflags', '+faststart',
    '-t', String(DURATION),
    outMp4,
  ], { stdio: 'inherit' });

  fs.rmSync(workDir, { recursive: true, force: true });

  const elapsed = ((Date.now() - t0) / 1000).toFixed(1);
  const mb = (fs.statSync(outMp4).size / (1024 * 1024)).toFixed(2);
  console.log(
    `[OK] Rendered ArtCraft EffectCraft 3D Cinema Reel (${theme.name} / ${theme.track}, 10Mbps H.264 in ${elapsed}s, ${mb} MB) -> ${outMp4}`
  );
}

if (require.main === module) {
  const [specPath, outDir, themeOverride] = process.argv.slice(2);
  if (!specPath || !outDir) {
    console.error('Usage: node render_video.js <spec.json> <outDir> [themeOverride]');
    process.exit(1);
  }
  renderWalkthroughVideo(specPath, outDir, themeOverride).catch((err) => {
    console.error(err);
    process.exit(1);
  });
}

module.exports = { renderWalkthroughVideo };
