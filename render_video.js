#!/usr/bin/env node
/**
 * Olven Tech — Apple Liquid Glass & Swiss Kinetic Reel Engine (1080x1920, 30fps, 16.0s).
 *
 * Flagship New York / Silicon Valley presentation:
 * - Approved NYC Felt Piano signature audio (3 distinct 16s movements mastered to -14 LUFS).
 * - ZERO AI voiceover, ZERO synthetic SFX, ZERO generic corporate marimba.
 * - Authentic Apple iPhone / macOS Liquid Glass surfaces (frosted blur + 1px specular rim highlights
 *   + soft multi-layer studio shadows + drifting ambient titanium light fields) paired with crisp
 *   Swiss typography (Inter + IBM Plex Mono).
 * - Lossless PNG frame pipeline -> high-profile H.264 (CRF 15) for razor-sharp glass refraction.
 */
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');
let chromium;
try { ({ chromium } = require('playwright')); } catch { ({ chromium } = require('playwright-core')); }

const WIDTH = 1080;
const HEIGHT = 1920;
const FPS = 30;
const DURATION = 16.0;
const TOTAL_FRAMES = Math.round(DURATION * FPS);

const ASSETS_DIR = path.join(__dirname, 'assets');
const MUSIC_DIR = path.join(ASSETS_DIR, 'music');

const THEMES = {
  apple_porcelain: {
    name: 'apple_porcelain',
    track: 'nyc_felt_piano_mvt1.mp3',
    lightBg: '#F2F0EC',
    lightOrbA: 'rgba(0, 82, 255, 0.14)',
    lightOrbB: 'rgba(180, 160, 130, 0.22)',
    lightInk: '#0A0D14',
    lightMuted: '#5C6270',
    darkBg: '#07080B',
    darkOrbA: 'rgba(16, 185, 129, 0.20)',
    darkOrbB: 'rgba(59, 130, 246, 0.18)',
    darkInk: '#F7F8FA',
    darkMuted: '#949BA8',
    accent: '#0052FF',
    accentOnDark: '#34D399',
    alert: '#E11D48',
    openDark: false,
  },
  titanium_obsidian: {
    name: 'titanium_obsidian',
    track: 'nyc_felt_piano_mvt2.mp3',
    lightBg: '#F4F5F7',
    lightOrbA: 'rgba(16, 185, 129, 0.15)',
    lightOrbB: 'rgba(148, 163, 184, 0.24)',
    lightInk: '#090B10',
    lightMuted: '#586070',
    darkBg: '#06070A',
    darkOrbA: 'rgba(99, 102, 241, 0.22)',
    darkOrbB: 'rgba(16, 185, 129, 0.16)',
    darkInk: '#F8FAFC',
    darkMuted: '#9098A6',
    accent: '#059669',
    accentOnDark: '#34D399',
    alert: '#F43F5E',
    openDark: true,
  },
  silver_glass: {
    name: 'silver_glass',
    track: 'nyc_felt_piano_mvt3.mp3',
    lightBg: '#F6F7FB',
    lightOrbA: 'rgba(99, 91, 255, 0.15)',
    lightOrbB: 'rgba(14, 165, 233, 0.14)',
    lightInk: '#0A1F38',
    lightMuted: '#56677C',
    darkBg: '#081222',
    darkOrbA: 'rgba(99, 91, 255, 0.25)',
    darkOrbB: 'rgba(0, 212, 182, 0.18)',
    darkInk: '#FFFFFF',
    darkMuted: '#92A6BE',
    accent: '#635BFF',
    accentOnDark: '#2DD4BF',
    alert: '#E11D48',
    openDark: false,
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
  // Remove outer black background rect (path1-3) so logo floats seamlessly over glass!
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
      { num: '01', title: cleanTag(aNodes[0]), tag: 'IDEMPOTENT' },
      { num: '02', title: cleanTag(aNodes[1]), tag: 'DETERMINISTIC' },
      { num: '03', title: cleanTag(aNodes[2]), tag: 'ATOMIC' },
    ],
    archFoot: cleanTag(spec.after_badge || 'Zero lost events · Full audit trail'),
    heroVal: cleanTag(heroMetric.value),
    heroFontPx: cleanTag(heroMetric.value).length >= 7 ? 156 : (cleanTag(heroMetric.value).length >= 5 ? 182 : 208),
    heroLabel,
    heroSub,
    subA: { val: cleanTag(subA.value), lbl: cleanTag(subA.label).toLowerCase() },
    subB: { val: cleanTag(subB.value), lbl: cleanTag(subB.label).toLowerCase() },
    ctaLines: ['We engineer', 'revenue-critical', 'backends.'],
  };
}

function buildHtml(script, theme) {
  const interB64 = fontBase64('Inter.woff2');
  const monoB64 = fontBase64('IBMPlexMono.woff2');
  const logoDarkUri = loadTransparentLogoDataUri(theme.darkInk, theme.darkBg);

  const payload = JSON.stringify({ script, theme, duration: DURATION });

  return `<!doctype html>
<html><head><meta charset="utf-8" />
<style>
  @font-face {
    font-family: 'Inter';
    src: url('data:font/woff2;base64,${interB64}') format('woff2');
    font-weight: 100 900;
  }
  @font-face {
    font-family: 'IBM Plex Mono';
    src: url('data:font/woff2;base64,${monoB64}') format('woff2');
    font-weight: 400 700;
  }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  html, body {
    width: ${WIDTH}px;
    height: ${HEIGHT}px;
    overflow: hidden;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif;
    -webkit-font-smoothing: antialiased;
    text-rendering: geometricPrecision;
  }
  .stage {
    position: relative;
    width: ${WIDTH}px;
    height: ${HEIGHT}px;
    overflow: hidden;
  }

  /* Soft Apple Studio Light Orbs behind Liquid Glass (drifts subtly, zero neon garishness) */
  .studio-orb {
    position: absolute; border-radius: 50%;
    filter: blur(130px);
    pointer-events: none; z-index: 1;
  }
  .orb-a { width: 760px; height: 760px; top: -120px; right: -160px; }
  .orb-b { width: 720px; height: 720px; bottom: -140px; left: -180px; }

  /* Subtle top 3px progress hairline */
  .progress-track {
    position: absolute; top: 0; left: 0; right: 0; height: 4px;
    background: rgba(128, 128, 128, 0.14); z-index: 40;
  }
  .progress-fill { height: 100%; width: 0%; }

  /* Top Apple iOS/macOS Frosted Glass Status Pill (safely below IG top bar) */
  .folio-bar {
    position: absolute; top: 186px; left: 82px; right: 102px;
    display: flex; justify-content: space-between; align-items: center;
    padding: 18px 28px;
    border-radius: 999px;
    backdrop-filter: blur(36px) saturate(190%);
    -webkit-backdrop-filter: blur(36px) saturate(190%);
    font-family: 'IBM Plex Mono', monospace;
    font-size: 19px; font-weight: 600; letter-spacing: 0.13em;
    text-transform: uppercase;
    z-index: 25;
  }
  .glass-light {
    background: linear-gradient(155deg, rgba(255, 255, 255, 0.80) 0%, rgba(255, 255, 255, 0.46) 100%);
    border: 1px solid rgba(255, 255, 255, 0.86);
    box-shadow:
      0 34px 80px -20px rgba(15, 23, 42, 0.14),
      0 10px 26px -8px rgba(15, 23, 42, 0.07),
      inset 0 1.5px 0 rgba(255, 255, 255, 0.96),
      inset 0 -1px 0 rgba(15, 23, 42, 0.05);
  }
  .glass-dark {
    background: linear-gradient(155deg, rgba(255, 255, 255, 0.11) 0%, rgba(255, 255, 255, 0.04) 100%);
    border: 1px solid rgba(255, 255, 255, 0.18);
    box-shadow:
      0 38px 90px -20px rgba(0, 0, 0, 0.65),
      0 12px 30px -8px rgba(0, 0, 0, 0.40),
      inset 0 1.5px 0 rgba(255, 255, 255, 0.28),
      inset 0 -1px 0 rgba(255, 255, 255, 0.04);
  }

  /* Safe-zone scene container */
  .scene {
    position: absolute;
    top: 290px; left: 82px; right: 102px; bottom: 300px;
    display: none;
    flex-direction: column;
    justify-content: center;
    z-index: 10;
  }
  .scene.active { display: flex; }

  .mask { overflow: hidden; padding-bottom: 8px; }
  .rise { display: block; will-change: transform, opacity; }

  /* Apple Liquid Glass Hero Card (macOS / iPhone Titanium Squircle) */
  .apple-glass-card {
    position: relative;
    border-radius: 40px;
    padding: 64px 58px;
    backdrop-filter: blur(42px) saturate(195%);
    -webkit-backdrop-filter: blur(42px) saturate(195%);
    overflow: hidden;
  }
  /* Subtle diagonal glass specular reflection sheen */
  .apple-glass-card::before {
    content: '';
    position: absolute; top: 0; left: 0; right: 0; height: 42%;
    background: linear-gradient(180deg, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0) 100%);
    pointer-events: none;
  }

  /* macOS Window Traffic Lights (authentic subtle Apple chrome) */
  .mac-chrome {
    display: flex; align-items: center; justify-content: space-between;
    margin-bottom: 42px;
  }
  .mac-dots { display: flex; gap: 11px; align-items: center; }
  .mdot { width: 14px; height: 14px; border-radius: 50%; }
  .md-r { background: #FF5F57; box-shadow: inset 0 1px 1px rgba(255,255,255,0.4); }
  .md-y { background: #FEBC2E; box-shadow: inset 0 1px 1px rgba(255,255,255,0.4); }
  .md-g { background: #28C840; box-shadow: inset 0 1px 1px rgba(255,255,255,0.4); }
  .mac-title {
    font-family: 'IBM Plex Mono', monospace;
    font-size: 19px; font-weight: 600; letter-spacing: 0.1em;
    text-transform: uppercase; opacity: 0.65;
  }

  /* SCENE 0: APPLE LIQUID GLASS PAIN HOOK */
  .hook-pill {
    display: inline-flex; align-items: center; gap: 12px;
    padding: 12px 22px; border-radius: 999px;
    font-family: 'IBM Plex Mono', monospace;
    font-size: 20px; font-weight: 600; letter-spacing: 0.1em;
    text-transform: uppercase;
    margin-bottom: 40px; width: fit-content;
  }
  .pulse-dot { width: 10px; height: 10px; border-radius: 50%; }
  .hook-line {
    font-size: 92px; font-weight: 800; line-height: 1.03;
    letter-spacing: -0.048em;
  }
  .hook-accent {
    font-size: 104px; font-weight: 850; line-height: 1.02;
    letter-spacing: -0.052em;
    margin-top: 8px; transform-origin: left center;
  }
  .hook-foot-bar {
    margin-top: 46px; padding-top: 30px;
    border-top: 1px solid rgba(128, 128, 128, 0.20);
    font-family: 'IBM Plex Mono', monospace;
    font-size: 23px; font-weight: 500; letter-spacing: 0.02em;
  }

  /* SCENE 1: macOS FROSTED GLASS INCIDENT SHEET */
  .diag-wrap { display: flex; flex-direction: column; gap: 22px; }
  .diag-item {
    position: relative; display: inline-block; width: fit-content;
    font-size: 64px; font-weight: 800; line-height: 1.1;
    letter-spacing: -0.042em;
  }
  .strike-bar {
    position: absolute; left: 0; top: 53%; height: 6px; width: 0%;
    background: ${theme.alert}; border-radius: 4px;
  }
  .diag-kicker {
    margin-top: 36px; padding-top: 28px;
    border-top: 1px solid rgba(128, 128, 128, 0.22);
    font-size: 40px; font-weight: 800; letter-spacing: -0.03em;
    line-height: 1.18;
  }

  /* SCENE 2: SPACE-BLACK TITANIUM GLASS LAYERS */
  .arch-title {
    font-size: 58px; font-weight: 800; letter-spacing: -0.042em;
    line-height: 1.06; margin-bottom: 42px;
  }
  .arch-stack { display: flex; flex-direction: column; gap: 22px; }
  .arch-glass-row {
    display: flex; align-items: center; justify-content: space-between;
    padding: 34px 38px; border-radius: 28px;
    backdrop-filter: blur(36px) saturate(185%);
    -webkit-backdrop-filter: blur(36px) saturate(185%);
  }
  .arch-left { display: flex; align-items: baseline; gap: 26px; }
  .arch-num {
    font-family: 'IBM Plex Mono', monospace;
    font-size: 24px; font-weight: 700; letter-spacing: 0.06em;
  }
  .arch-step {
    font-size: 40px; font-weight: 750; letter-spacing: -0.03em;
    line-height: 1.12;
  }
  .arch-foot {
    margin-top: 38px; display: flex; align-items: center; gap: 14px;
    font-family: 'IBM Plex Mono', monospace;
    font-size: 24px; font-weight: 600; letter-spacing: 0.04em;
  }
  .live-dot { width: 12px; height: 12px; border-radius: 50%; flex-shrink: 0; }

  /* SCENE 3: APPLE GLASS HERO METRIC CARD */
  .proof-eyebrow {
    font-family: 'IBM Plex Mono', monospace;
    font-size: 22px; font-weight: 600; letter-spacing: 0.14em;
    text-transform: uppercase; margin-bottom: 22px;
  }
  .proof-hero {
    font-size: ${script.heroFontPx}px; font-weight: 850; line-height: 0.96;
    letter-spacing: -0.056em; font-variant-numeric: tabular-nums;
    transform-origin: left center;
  }
  .proof-label {
    margin-top: 24px; font-size: 46px; font-weight: 800;
    letter-spacing: -0.038em; line-height: 1.08;
  }
  .proof-sub {
    margin-top: 12px; font-size: 27px; font-weight: 500;
  }
  .proof-pills {
    margin-top: 32px; display: grid; grid-template-columns: 1fr 1fr; gap: 22px;
  }
  .proof-pill {
    padding: 32px 34px; border-radius: 30px;
    backdrop-filter: blur(36px) saturate(190%);
    -webkit-backdrop-filter: blur(36px) saturate(190%);
  }
  .proof-cell-val {
    font-size: 48px; font-weight: 800; letter-spacing: -0.04em;
    font-variant-numeric: tabular-nums;
  }
  .proof-cell-lbl {
    margin-top: 8px; font-family: 'IBM Plex Mono', monospace;
    font-size: 19px; font-weight: 600; text-transform: uppercase;
    letter-spacing: 0.08em;
  }

  /* SCENE 4: SPACE-BLACK TITANIUM FLAGSHIP CLOSE */
  .cta-line {
    font-size: 82px; font-weight: 800; line-height: 1.04;
    letter-spacing: -0.046em;
  }
  .cta-glass-dock {
    margin-top: 52px; padding: 34px 40px; border-radius: 34px;
    display: flex; align-items: center; justify-content: space-between;
    gap: 20px;
    backdrop-filter: blur(40px) saturate(190%);
    -webkit-backdrop-filter: blur(40px) saturate(190%);
  }
  .cta-logo { height: 54px; width: auto; display: block; }
  .cta-pill {
    display: inline-block; padding: 18px 34px; border-radius: 999px;
    font-family: 'IBM Plex Mono', monospace;
    font-size: 24px; font-weight: 700; letter-spacing: 0.08em;
    text-transform: uppercase;
  }
  .cta-url {
    margin-top: 30px; padding-left: 8px;
    font-family: 'IBM Plex Mono', monospace;
    font-size: 23px; font-weight: 500; letter-spacing: 0.06em;
  }
</style>
</head>
<body>
  <div class="stage" id="stage">
    <div class="studio-orb orb-a" id="orbA"></div>
    <div class="studio-orb orb-b" id="orbB"></div>
    <div class="progress-track"><div class="progress-fill" id="prog"></div></div>

    <div class="folio-bar" id="folio">
      <span id="folioLeft">OLVEN TECH · ${esc(script.domainShort)}</span>
      <span id="folioRight">01 / 05</span>
    </div>

    <!-- SCENE 0: APPLE LIQUID GLASS PAIN HOOK (0.0s - 2.5s) -->
    <div class="scene active" id="s0">
      <div class="apple-glass-card" id="s0Card">
        <div class="hook-pill" id="s0Pill">
          <span class="pulse-dot" id="s0Dot"></span>
          <span>PRODUCTION AUDIT</span>
        </div>
        <div class="mask"><span class="rise hook-line" id="s0L1">${esc(script.hookL1)}</span></div>
        <div class="mask"><span class="rise hook-line" id="s0L2">${esc(script.hookL2)}</span></div>
        <div class="mask"><span class="rise hook-accent" id="s0L3">${esc(script.hookAccent)}</span></div>
        <div class="hook-foot-bar" id="s0Foot">${esc(script.hookFoot)}</div>
      </div>
    </div>

    <!-- SCENE 1: macOS LIQUID GLASS DIAGNOSIS WINDOW (2.5s - 6.0s) -->
    <div class="scene" id="s1">
      <div class="apple-glass-card" id="s1Card">
        <div class="mac-chrome">
          <div class="mac-dots">
            <span class="mdot md-r"></span><span class="mdot md-y"></span><span class="mdot md-g"></span>
          </div>
          <span class="mac-title">incident-trace.log</span>
        </div>
        <div class="diag-wrap">
          <div class="mask">
            <span class="rise diag-item" id="d0">
              ${esc(script.diagLines[0])}
              <span class="strike-bar" id="strikeBar"></span>
            </span>
          </div>
          <div class="mask"><span class="rise diag-item" id="d1">${esc(script.diagLines[1])}</span></div>
          <div class="mask"><span class="rise diag-item" id="d2">${esc(script.diagLines[2])}</span></div>
        </div>
        <div class="mask"><span class="rise diag-kicker" id="dKick">${esc(script.painKicker)}</span></div>
      </div>
    </div>

    <!-- SCENE 2: SPACE-BLACK TITANIUM GLASS LAYERS (6.0s - 10.0s) -->
    <div class="scene" id="s2">
      <div class="mask"><span class="rise arch-title" id="aTitle">How we rebuilt it.</span></div>
      <div class="arch-stack">
        ${script.archSteps.map((st, idx) => `
          <div class="arch-glass-row glass-dark" id="aRow${idx}">
            <div class="arch-left">
              <span class="arch-num" id="aNum${idx}">${st.num}</span>
              <span class="arch-step">${esc(st.title)}</span>
            </div>
          </div>
        `).join('')}
      </div>
      <div class="arch-foot" id="aFoot">
        <span class="live-dot" id="aDot"></span>
        <span>${esc(script.archFoot)}</span>
      </div>
    </div>

    <!-- SCENE 3: APPLE PORCELAIN LIQUID GLASS HERO METRIC (10.0s - 13.0s) -->
    <div class="scene" id="s3">
      <div class="apple-glass-card glass-light" id="pCard">
        <div class="proof-eyebrow" id="pEye">VERIFIED PRODUCTION RESULT</div>
        <div class="proof-hero" id="pHero">${esc(script.heroVal)}</div>
        <div class="mask"><span class="rise proof-label" id="pLbl">${esc(script.heroLabel)}.</span></div>
        <div class="mask"><span class="rise proof-sub" id="pSub">${esc(script.heroSub)}</span></div>
      </div>
      <div class="proof-pills" id="pGrid">
        <div class="proof-pill glass-light">
          <div class="proof-cell-val">${esc(script.subA.val)}</div>
          <div class="proof-cell-lbl" id="pSubALbl">${esc(script.subA.lbl)}</div>
        </div>
        <div class="proof-pill glass-light">
          <div class="proof-cell-val">${esc(script.subB.val)}</div>
          <div class="proof-cell-lbl" id="pSubBLbl">${esc(script.subB.lbl)}</div>
        </div>
      </div>
    </div>

    <!-- SCENE 4: SPACE-BLACK TITANIUM FLAGSHIP CLOSE (13.0s - 16.0s) -->
    <div class="scene" id="s4">
      <div class="mask"><span class="rise cta-line" id="c0">${esc(script.ctaLines[0])}</span></div>
      <div class="mask"><span class="rise cta-line" id="c1">${esc(script.ctaLines[1])}</span></div>
      <div class="mask"><span class="rise cta-line" id="c2">${esc(script.ctaLines[2])}</span></div>
      <div class="cta-glass-dock glass-dark" id="cBrand">
        ${logoDarkUri ? `<img class="cta-logo" src="${logoDarkUri}" alt="Olven Tech" />` : `<div style="font-size:42px;font-weight:800;">Olven Tech</div>`}
        <span class="cta-pill" id="cPill">DM "AUDIT"</span>
      </div>
      <div class="cta-url" id="cUrl">OLVENTECH.COM  ·  NEW YORK</div>
    </div>
  </div>

  <script>
    const CFG = ${payload};
    const T = CFG.theme;
    const DUR = CFG.duration;

    const CUTS = [0.0, 2.5, 6.0, 10.0, 13.0, 16.0];
    const FOLIO_LABELS = [
      'OLVEN TECH · ' + CFG.script.domainShort,
      'ROOT CAUSE · DIAGNOSIS',
      'THE FIX · ARCHITECTURE',
      'VERIFIED · PRODUCTION PROOF',
      'OLVEN TECH · NEW YORK'
    ];

    const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
    const appleEase = (x) => 1 - Math.pow(1 - clamp(x), 4);

    const heroRaw = String(CFG.script.heroVal);
    const numMatch = heroRaw.match(/(-?\\d+(?:\\.\\d+)?)/);
    const heroNum = numMatch ? parseFloat(numMatch[1]) : null;
    const heroDec = numMatch && numMatch[1].includes('.') ? numMatch[1].split('.')[1].length : 0;

    function applyPolarity(isDark) {
      const stage = document.getElementById('stage');
      const folio = document.getElementById('folio');
      const prog = document.getElementById('prog');
      const orbA = document.getElementById('orbA');
      const orbB = document.getElementById('orbB');

      const bg = isDark ? T.darkBg : T.lightBg;
      const ink = isDark ? T.darkInk : T.lightInk;
      const muted = isDark ? T.darkMuted : T.lightMuted;
      const accent = isDark ? T.accentOnDark : T.accent;

      stage.style.background = bg;
      stage.style.color = ink;
      orbA.style.background = isDark ? T.darkOrbA : T.lightOrbA;
      orbB.style.background = isDark ? T.darkOrbB : T.lightOrbB;

      folio.className = 'folio-bar ' + (isDark ? 'glass-dark' : 'glass-light');
      folio.style.color = muted;
      prog.style.background = accent;

      const s0Card = document.getElementById('s0Card');
      s0Card.className = 'apple-glass-card ' + (isDark ? 'glass-dark' : 'glass-light');
      const s1Card = document.getElementById('s1Card');
      s1Card.className = 'apple-glass-card ' + (isDark ? 'glass-dark' : 'glass-light');

      const s0Pill = document.getElementById('s0Pill');
      s0Pill.style.background = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(10,13,20,0.06)';
      s0Pill.style.color = muted;
      document.getElementById('s0Dot').style.background = T.alert;
      document.getElementById('s0L3').style.color = accent;
      document.getElementById('s0Foot').style.color = muted;

      document.getElementById('d0').style.color = muted;
      document.getElementById('dKick').style.color = T.alert;

      for (let i = 0; i < 3; i++) {
        document.getElementById('aNum' + i).style.color = T.accentOnDark;
      }
      document.getElementById('aFoot').style.color = T.accentOnDark;
      document.getElementById('aDot').style.background = T.accentOnDark;

      document.getElementById('pEye').style.color = T.lightMuted;
      document.getElementById('pHero').style.color = T.accent;
      document.getElementById('pSub').style.color = T.lightMuted;
      document.getElementById('pSubALbl').style.color = T.lightMuted;
      document.getElementById('pSubBLbl').style.color = T.lightMuted;

      document.getElementById('c2').style.color = T.accentOnDark;
      document.getElementById('cPill').style.background = '#FFFFFF';
      document.getElementById('cPill').style.color = '#07080B';
      document.getElementById('cUrl').style.color = T.darkMuted;
    }

    function rise(id, localT, delay, dur = 0.36) {
      const el = document.getElementById(id);
      if (!el) return;
      const p = appleEase((localT - delay) / dur);
      el.style.transform = 'translateY(' + ((1 - p) * 112).toFixed(1) + '%)';
      el.style.opacity = clamp(p * 1.4).toFixed(3);
    }

    window.__renderFrame = function(t) {
      document.getElementById('prog').style.width = (clamp(t / DUR) * 100).toFixed(2) + '%';

      // Subtle slow studio light drift behind the frosted glass
      const ox = Math.sin(t * 0.45) * 44;
      const oy = Math.cos(t * 0.35) * 32;
      document.getElementById('orbA').style.transform = 'translate(' + ox.toFixed(1) + 'px,' + oy.toFixed(1) + 'px)';
      document.getElementById('orbB').style.transform = 'translate(' + (-ox * 0.8).toFixed(1) + 'px,' + (-oy * 0.8).toFixed(1) + 'px)';

      let si = 4;
      for (let i = 0; i < 5; i++) {
        if (t < CUTS[i + 1]) { si = i; break; }
      }
      const lt = Math.max(0, t - CUTS[si]);

      let isDark;
      if (si === 0 || si === 1) isDark = T.openDark;
      else if (si === 2) isDark = true;
      else if (si === 3) isDark = false;
      else isDark = true;

      applyPolarity(isDark);
      document.getElementById('folioLeft').textContent = FOLIO_LABELS[si];
      document.getElementById('folioRight').textContent = '0' + (si + 1) + ' / 05';

      for (let i = 0; i < 5; i++) {
        document.getElementById('s' + i).classList.toggle('active', i === si);
      }

      if (si === 0) {
        // Frame 0 stays 100% opaque & razor-sharp for Instagram grid cover
        document.getElementById('s0L1').style.transform = 'translateY(0%)';
        document.getElementById('s0L1').style.opacity = '1';
        document.getElementById('s0L2').style.transform = 'translateY(0%)';
        document.getElementById('s0L2').style.opacity = '1';
        const settle = 1.03 - 0.03 * appleEase(lt / 0.55);
        document.getElementById('s0L3').style.transform = 'scale(' + settle.toFixed(4) + ')';
        document.getElementById('s0L3').style.opacity = '1';
        const cardScale = 1.0 + 0.014 * appleEase(lt / 2.4);
        document.getElementById('s0Card').style.transform = 'scale(' + cardScale.toFixed(4) + ')';
      } else if (si === 1) {
        const cp = appleEase(lt / 0.34);
        const s1c = document.getElementById('s1Card');
        s1c.style.opacity = cp.toFixed(3);
        s1c.style.transform = 'translateY(' + ((1 - cp) * 32).toFixed(1) + 'px)';
        rise('d0', lt, 0.06, 0.34);
        rise('d1', lt, 0.72, 0.34);
        rise('d2', lt, 1.45, 0.34);
        const sp = appleEase((lt - 2.10) / 0.38);
        document.getElementById('strikeBar').style.width = (sp * 100).toFixed(1) + '%';
        rise('dKick', lt, 2.25, 0.38);
      } else if (si === 2) {
        rise('aTitle', lt, 0.00, 0.34);
        for (let k = 0; k < 3; k++) {
          const row = document.getElementById('aRow' + k);
          const p = appleEase((lt - (0.42 + k * 0.82)) / 0.40);
          row.style.opacity = p.toFixed(3);
          row.style.transform = 'translateY(' + ((1 - p) * 34).toFixed(1) + 'px) scale(' + (0.97 + 0.03 * p).toFixed(4) + ')';
        }
        const fp = appleEase((lt - 3.00) / 0.36);
        const foot = document.getElementById('aFoot');
        foot.style.opacity = fp.toFixed(3);
        foot.style.transform = 'translateY(' + ((1 - fp) * 18).toFixed(1) + 'px)';
      } else if (si === 3) {
        const cp = appleEase(lt / 0.38);
        const pCard = document.getElementById('pCard');
        pCard.style.opacity = cp.toFixed(3);
        pCard.style.transform = 'translateY(' + ((1 - cp) * 28).toFixed(1) + 'px)';
        const hp = appleEase(lt / 0.56);
        const heroEl = document.getElementById('pHero');
        const sc = 1.05 - 0.05 * hp;
        heroEl.style.transform = 'scale(' + sc.toFixed(4) + ')';
        if (heroNum !== null) {
          const cur = heroNum * hp;
          const fmt = heroDec > 0 ? cur.toFixed(heroDec) : Math.round(cur).toString();
          heroEl.textContent = heroRaw.replace(numMatch[1], fmt);
        }
        rise('pLbl', lt, 0.24, 0.36);
        rise('pSub', lt, 0.42, 0.36);
        const gp = appleEase((lt - 0.80) / 0.44);
        const gEl = document.getElementById('pGrid');
        gEl.style.opacity = gp.toFixed(3);
        gEl.style.transform = 'translateY(' + ((1 - gp) * 26).toFixed(1) + 'px)';
      } else if (si === 4) {
        rise('c0', lt, 0.00, 0.34);
        rise('c1', lt, 0.24, 0.34);
        rise('c2', lt, 0.48, 0.36);
        const bp = appleEase((lt - 0.88) / 0.44);
        const bEl = document.getElementById('cBrand');
        bEl.style.opacity = bp.toFixed(3);
        bEl.style.transform = 'translateY(' + ((1 - bp) * 28).toFixed(1) + 'px) scale(' + (0.98 + 0.02 * bp).toFixed(4) + ')';
        const up = appleEase((lt - 1.24) / 0.38);
        document.getElementById('cUrl').style.opacity = up.toFixed(3);
      }
    };
    window.__renderFrame(0);
  </script>
</body></html>`;
}

async function renderWalkthroughVideo(specPath, outDir, themeOverride = null) {
  const spec = JSON.parse(fs.readFileSync(specPath, 'utf8'));
  const arch = spec.visual_archetype || 'editorial_light_blueprint';
  const themeKey = themeOverride || ARCHETYPE_TO_THEME[arch] || 'apple_porcelain';
  const theme = THEMES[themeKey] || THEMES.apple_porcelain;

  fs.mkdirSync(outDir, { recursive: true });
  const script = compileEditorialScript(spec);
  const html = buildHtml(script, theme);

  const trackPath = path.join(MUSIC_DIR, theme.track);
  if (!fs.existsSync(trackPath)) {
    throw new Error(`Missing NYC Felt Piano track: ${trackPath}`);
  }
  const outMp4 = path.join(outDir, 'walkthrough-video.mp4');

  const execPath = detectChromeExecutable();
  const browser = await chromium.launch({
    headless: true,
    ...(execPath ? { executablePath: execPath } : {}),
    args: ['--no-sandbox', '--disable-dev-shm-usage', '--disable-gpu'],
  });

  try {
    const context = await browser.newContext({
      viewport: { width: WIDTH, height: HEIGHT },
      deviceScaleFactor: 1,
    });
    const page = await context.newPage();
    await page.setContent(html, { waitUntil: 'load' });
    await page.evaluate(() => document.fonts.ready);

    // Lossless PNG frame pipe -> 8-12 Mbps Rec.709 broadcast-mastered H.264 with anti-banding dither
    const ffArgs = [
      '-y', '-v', 'error',
      '-f', 'image2pipe',
      '-vcodec', 'png',
      '-framerate', String(FPS),
      '-i', '-',
      '-i', trackPath,
      '-map', '0:v:0',
      '-map', '1:a:0',
      '-vf', 'noise=alls=1:allf=t,format=yuv420p',
      '-c:v', 'libx264',
      '-profile:v', 'high',
      '-level', '4.2',
      '-preset', 'medium',
      '-b:v', '8M',
      '-maxrate', '12M',
      '-bufsize', '16M',
      '-g', String(FPS),
      '-keyint_min', String(FPS),
      '-colorspace', 'bt709',
      '-color_primaries', 'bt709',
      '-color_trc', 'bt709',
      '-c:a', 'aac',
      '-b:a', '192k',
      '-ar', '48000',
      '-movflags', '+faststart',
      '-t', String(DURATION),
      outMp4,
    ];

    const ff = spawn('ffmpeg', ffArgs, { stdio: ['pipe', 'inherit', 'inherit'] });
    const ffDone = new Promise((resolve, reject) => {
      ff.on('error', reject);
      ff.on('close', (code) =>
        code === 0 ? resolve() : reject(new Error(`ffmpeg exited with code ${code}`))
      );
    });

    const t0 = Date.now();
    for (let f = 0; f < TOTAL_FRAMES; f++) {
      const t = f / FPS;
      await page.evaluate((timeSec) => window.__renderFrame(timeSec), t);
      const buf = await page.screenshot({ type: 'png' });
      if (!ff.stdin.write(buf)) {
        await new Promise((r) => ff.stdin.once('drain', r));
      }
    }
    ff.stdin.end();
    await ffDone;
    await context.close();

    const elapsed = ((Date.now() - t0) / 1000).toFixed(1);
    const mb = (fs.statSync(outMp4).size / (1024 * 1024)).toFixed(2);
    console.log(
      `[OK] Rendered Apple Glass Reel (${theme.name} / ${theme.track}, ${TOTAL_FRAMES} PNG frames @ ${FPS}fps in ${elapsed}s, ${mb} MB) -> ${outMp4}`
    );
  } finally {
    await browser.close();
  }
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
