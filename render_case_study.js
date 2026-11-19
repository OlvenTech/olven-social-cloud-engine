#!/usr/bin/env node
/**
 * Olven Tech — High-Retention Silicon Valley Visual Engine (2x Retina)
 *
 * 6 radically distinct, scroll-stopping visual genres engineered for high dwell time,
 * saves, and shares (zero repetitive "Before/After + 4 KPI box" slide templates):
 *
 *  1. editorial_light_blueprint     — Apple / Stripe Press Minimalist Giant-Stat Billboard (70% whitespace)
 *  2. security_policy_shield_matrix — Authentic Slack #prod-incidents War-Room Thread Card
 *  3. circuit_breaker_state_machine — ByteByteGo / Excalidraw Hand-Sketched Whiteboard Architecture
 *  4. split_latency_waterfall       — Vercel / Raycast macOS Glass GitHub PR Diff Window
 *  5. revenue_ledger_reconciliation — Datadog / Grafana Live Telemetry Cliff Chart
 *  6. cdc_hash_diff_funnel          — High-Contrast Editorial Magazine Split ("Naive vs. Prod")
 */
const fs = require('fs');
const path = require('path');

const PLAYWRIGHT_PATH = fs.existsSync(path.join(__dirname, 'node_modules/playwright-core'))
  ? path.join(__dirname, 'node_modules/playwright-core')
  : '/home/antigravity/.npm/_npx/e41f203b7505f1fb/node_modules/playwright-core';
const { chromium } = require(PLAYWRIGHT_PATH);

const ASSETS_DIR = path.join(__dirname, 'assets');
const b64Font = (file) => fs.readFileSync(path.join(ASSETS_DIR, file)).toString('base64');

const rawLogo = fs.readFileSync(path.join(ASSETS_DIR, 'horizontal_dark.svg'), 'utf8')
  .replace(/<\?xml[\s\S]*?\?>/g, '');

const logoForDarkBg = (h = 30) => rawLogo.replace(
  /<svg\b([^>]*)>/,
  `<svg $1 style="height:${h}px; width:auto; display:block; border-radius:6px;">`
);

const logoForLightBg = (h = 30) => rawLogo.replace(
  /<svg\b([^>]*)>/,
  `<svg $1 style="height:${h}px; width:auto; display:block; filter: invert(0.92) hue-rotate(180deg) contrast(1.25); border-radius:6px;">`
);

const PLATFORMS = [
  { name: 'linkedin.png', width: 1350, height: 1350, layout: 'square' },
  { name: 'instagram.png', width: 1200, height: 1500, layout: 'portrait' },
  { name: 'x.png', width: 1600, height: 900, layout: 'landscape' },
  { name: 'facebook.png', width: 1536, height: 1024, layout: 'landscape-tall' }
];

const ARCHETYPES = [
  'editorial_light_blueprint',
  'security_policy_shield_matrix',
  'circuit_breaker_state_machine',
  'split_latency_waterfall',
  'revenue_ledger_reconciliation',
  'cdc_hash_diff_funnel'
];

function stripHtml(s) {
  return String(s || '').replace(/<[^>]+>/g, '').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&').trim();
}

function shorten(s, maxLen) {
  const clean = stripHtml(s);
  if (clean.length <= maxLen) return clean;
  const cut = clean.slice(0, maxLen).replace(/\s+\S*$/, '');
  return cut + '.';
}

function baseFontsCss() {
  const fJakarta = b64Font('PlusJakartaSans.woff2');
  const fInter = b64Font('Inter.woff2');
  const fMono = b64Font('IBMPlexMono.woff2');
  return `
    @font-face {
      font-family: 'Plus Jakarta Sans';
      src: url(data:font/woff2;base64,${fJakarta}) format('woff2');
      font-weight: 500 800;
    }
    @font-face {
      font-family: 'Inter';
      src: url(data:font/woff2;base64,${fInter}) format('woff2');
      font-weight: 400 700;
    }
    @font-face {
      font-family: 'IBM Plex Mono';
      src: url(data:font/woff2;base64,${fMono}) format('woff2');
      font-weight: 400 700;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    .inline-code {
      font-family: 'IBM Plex Mono', monospace;
      font-size: 0.88em; font-weight: 600;
      padding: 2px 7px; border-radius: 5px;
    }
  `;
}

/**
 * GENRE 1 (editorial_light_blueprint):
 * Apple / Stripe Press Minimalist Giant-Stat Billboard Poster
 * Ultra-high whitespace, ONE massive focal metric, punchy editorial hook, zero box clutter.
 */
function renderBillboardPoster(spec, p) {
  const isWide = p.layout === 'landscape' || p.layout === 'landscape-tall';
  const m0 = spec.metrics[0];
  const m1 = spec.metrics[1];
  const valLen = String(m0.value).length;
  const heroSize = isWide
    ? (valLen > 7 ? 128 : 168)
    : (valLen > 7 ? 148 : 204);

  return `<!DOCTYPE html><html><head><meta charset="utf-8"><style>
    ${baseFontsCss()}
    body {
      width: ${p.width}px; height: ${p.height}px;
      background: #F6F2EA; color: #0B1120;
      font-family: 'Inter', sans-serif;
      padding: ${isWide ? '54px 76px' : '74px 78px'};
      display: flex; flex-direction: column; justify-content: space-between;
      position: relative; overflow: hidden;
    }
    .accent-arc {
      position: absolute; right: -160px; top: -160px;
      width: 680px; height: 680px; border-radius: 50%;
      background: radial-gradient(circle, rgba(29,78,216,0.14) 0%, rgba(29,78,216,0) 70%);
      pointer-events: none;
    }
    .top-bar {
      position: relative; z-index: 2;
      display: flex; justify-content: space-between; align-items: center;
    }
    .tag {
      font-family: 'IBM Plex Mono', monospace; font-size: 14px; font-weight: 700;
      letter-spacing: 0.1em; color: #1D4ED8; text-transform: uppercase;
      padding: 8px 16px; border: 1.5px solid #1D4ED8; border-radius: 999px;
      background: rgba(29,78,216,0.06);
    }
    .center-stage {
      position: relative; z-index: 2;
      display: ${isWide ? 'grid' : 'flex'};
      ${isWide ? 'grid-template-columns: 1.05fr 0.95fr; gap: 56px; align-items: center;' : 'flex-direction: column; gap: 38px;'}
    }
    .stat-block {
      display: flex; flex-direction: column; gap: 12px;
    }
    .stat-kicker {
      font-family: 'IBM Plex Mono', monospace; font-size: 16px; font-weight: 700;
      color: #64748B; letter-spacing: 0.12em; text-transform: uppercase;
    }
    .giant-num {
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-size: ${heroSize}px; font-weight: 800; line-height: 0.92;
      letter-spacing: -0.055em; color: #1D4ED8;
    }
    .stat-delta {
      display: inline-flex; align-items: center; gap: 10px; align-self: flex-start;
      margin-top: 8px;
      font-family: 'IBM Plex Mono', monospace; font-size: 19px; font-weight: 700;
      color: #0B1120; background: #DBEAFE; padding: 10px 18px; border-radius: 10px;
    }
    .copy-block {
      display: flex; flex-direction: column; gap: 22px;
      ${isWide ? 'border-left: 3px solid #0B1120; padding-left: 44px;' : 'border-top: 3px solid #0B1120; padding-top: 34px;'}
    }
    h1 {
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-size: ${isWide ? '44px' : '56px'}; line-height: 1.08; font-weight: 800;
      letter-spacing: -0.03em; color: #0B1120;
    }
    .takeaway {
      font-size: ${isWide ? '21px' : '25px'}; line-height: 1.45; color: #334155; font-weight: 500;
    }
    .bottom-strip {
      position: relative; z-index: 2;
      display: flex; justify-content: space-between; align-items: center;
      padding-top: 22px; border-top: 1.5px solid rgba(11,17,32,0.16);
      font-family: 'IBM Plex Mono', monospace; font-size: 15px; font-weight: 600; color: #475569;
    }
    .swap-pill {
      color: #0B1120; font-weight: 700;
    }
    .swap-pill span { color: #DC2626; text-decoration: line-through; margin-right: 10px; }
    .swap-pill strong { color: #059669; }
  </style></head><body>
    <div class="accent-arc"></div>
    <div class="top-bar">
      <div>${logoForLightBg(34)}</div>
      <div class="tag">${spec.eyebrow.split('·')[0].trim()}</div>
    </div>

    <div class="center-stage">
      <div class="stat-block">
        <div class="stat-kicker">${m0.label}</div>
        <div class="giant-num">${m0.value}</div>
        <div class="stat-delta">▲ ${m0.sub} · ${m1.label}: ${m1.value}</div>
      </div>
      <div class="copy-block">
        <h1>${spec.headline}</h1>
        <div class="takeaway">${shorten(spec.after_points[0], 130)}</div>
      </div>
    </div>

    <div class="bottom-strip">
      <div class="swap-pill"><span>${spec.before_badge}</span> → <strong>${spec.after_badge}</strong></div>
      <div>olventech.com</div>
    </div>
  </body></html>`;
}

/**
 * GENRE 2 (security_policy_shield_matrix):
 * Authentic Dark-Mode Slack #prod-incidents War-Room Thread Card
 * People instinctively stop scrolling to read real production incident threads.
 */
function renderSlackIncidentStory(spec, p) {
  const isWide = p.layout === 'landscape' || p.layout === 'landscape-tall';
  const m0 = spec.metrics[0];
  const m1 = spec.metrics[1];

  return `<!DOCTYPE html><html><head><meta charset="utf-8"><style>
    ${baseFontsCss()}
    body {
      width: ${p.width}px; height: ${p.height}px;
      background:
        radial-gradient(circle at 18% 15%, rgba(239,68,68,0.22), transparent 44%),
        radial-gradient(circle at 84% 85%, rgba(16,185,129,0.24), transparent 48%),
        #070B13;
      color: #F8FAFC;
      font-family: 'Inter', sans-serif;
      padding: ${isWide ? '40px 64px' : '58px 56px'};
      display: flex; flex-direction: column; justify-content: space-between; gap: ${isWide ? '22px' : '30px'};
      position: relative; overflow: hidden;
    }
    .top-head {
      display: flex; justify-content: space-between; align-items: flex-start; gap: 24px;
    }
    h1 {
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-size: ${isWide ? '38px' : '48px'}; line-height: 1.09; font-weight: 800;
      letter-spacing: -0.03em; color: #FFFFFF; max-width: ${isWide ? '1060px' : '860px'};
    }
    .slack-window {
      flex: 1;
      background: #11161D; border: 1.5px solid rgba(148,163,184,0.22);
      border-radius: 22px; overflow: hidden;
      box-shadow: 0 32px 80px rgba(0,0,0,0.58);
      display: flex; flex-direction: column;
    }
    .slack-topbar {
      background: #191F29; border-bottom: 1px solid rgba(148,163,184,0.16);
      padding: 16px 26px; display: flex; justify-content: space-between; align-items: center;
    }
    .ch-name {
      display: flex; align-items: center; gap: 12px;
      font-family: 'Plus Jakarta Sans', sans-serif; font-size: 20px; font-weight: 800; color: #F8FAFC;
    }
    .dots { display: flex; gap: 8px; margin-right: 12px; }
    .dot { width: 12px; height: 12px; border-radius: 50%; }
    .live-badge {
      font-family: 'IBM Plex Mono', monospace; font-size: 13px; font-weight: 700;
      background: rgba(16,185,129,0.16); color: #34D399; border: 1px solid rgba(52,211,153,0.4);
      padding: 5px 12px; border-radius: 999px;
    }
    .messages {
      flex: 1; padding: ${isWide ? '22px 32px' : '38px 36px'};
      display: flex; flex-direction: column; justify-content: center; gap: ${isWide ? '20px' : '38px'};
    }
    .msg {
      display: flex; gap: 18px; align-items: flex-start;
    }
    .avatar {
      width: 50px; height: 50px; border-radius: 12px; flex-shrink: 0;
      display: flex; align-items: center; justify-content: center;
      font-family: 'IBM Plex Mono', monospace; font-size: 20px; font-weight: 800; color: #FFFFFF;
    }
    .av-alert { background: linear-gradient(135deg, #DC2626, #991B1B); }
    .av-eng { background: linear-gradient(135deg, #10B981, #047857); }
    .msg-body { flex: 1; display: flex; flex-direction: column; gap: 8px; }
    .msg-meta { display: flex; align-items: center; gap: 12px; }
    .sender { font-weight: 800; font-size: 19px; color: #FFFFFF; }
    .bot-tag {
      font-family: 'IBM Plex Mono', monospace; font-size: 11px; font-weight: 700;
      background: #273244; color: #94A3B8; padding: 3px 7px; border-radius: 4px;
    }
    .ts { font-family: 'IBM Plex Mono', monospace; font-size: 14px; color: #64748B; }
    .alert-card {
      background: rgba(239,68,68,0.10); border-left: 5px solid #EF4444;
      border-radius: 0 10px 10px 0; padding: 16px 20px;
    }
    .alert-title {
      font-family: 'IBM Plex Mono', monospace; font-size: 16px; font-weight: 700; color: #FCA5A5; margin-bottom: 6px;
    }
    .msg-text { font-size: ${isWide ? '19px' : '22px'}; line-height: 1.44; color: #E2E8F0; }
    .fix-code {
      margin-top: 8px; background: #090D14; border: 1px solid #1E293B; border-radius: 10px;
      padding: 14px 18px; font-family: 'IBM Plex Mono', monospace;
      font-size: ${isWide ? '16px' : '17.5px'}; color: #6EE7B7; line-height: 1.5;
    }
    .reactions { display: flex; gap: 10px; margin-top: 8px; flex-wrap: wrap; }
    .react {
      background: rgba(52,211,153,0.12); border: 1px solid rgba(52,211,153,0.35);
      border-radius: 999px; padding: 5px 14px;
      font-family: 'IBM Plex Mono', monospace; font-size: 15px; font-weight: 700; color: #A7F3D0;
    }
    .footer {
      display: flex; justify-content: space-between; align-items: center;
      font-family: 'IBM Plex Mono', monospace; font-size: 15px; color: #94A3B8; font-weight: 600;
    }
    .inline-code { background: #1E293B; color: #38BDF8; }
  </style></head><body>
    <div class="top-head">
      <h1>${spec.headline}</h1>
      <div style="flex-shrink:0;">${logoForDarkBg(32)}</div>
    </div>

    <div class="slack-window">
      <div class="slack-topbar">
        <div class="ch-name">
          <div class="dots">
            <span class="dot" style="background:#EF4444"></span>
            <span class="dot" style="background:#F59E0B"></span>
            <span class="dot" style="background:#10B981"></span>
          </div>
          <span>#prod-incidents</span>
        </div>
        <div class="live-badge">RESOLVED · ${spec.after_badge}</div>
      </div>

      <div class="messages">
        <div class="msg">
          <div class="avatar av-alert">!</div>
          <div class="msg-body">
            <div class="msg-meta">
              <span class="sender">PagerDuty Alert</span>
              <span class="bot-tag">APP</span>
              <span class="ts">03:14 AM</span>
            </div>
            <div class="alert-card">
              <div class="alert-title">SEV-1 · ${spec.before_badge}</div>
              <div class="msg-text">${shorten(spec.before_points[0], 135)}</div>
            </div>
          </div>
        </div>

        <div class="msg">
          <div class="avatar av-eng">OV</div>
          <div class="msg-body">
            <div class="msg-meta">
              <span class="sender">Olven Engineering</span>
              <span class="bot-tag" style="background:#064E3B;color:#6EE7B7;">FIXED</span>
              <span class="ts">03:19 AM</span>
            </div>
            <div class="msg-text">Killed the naive <span class="inline-code">${spec.before_nodes[1]}</span> path and shipped the deterministic pipeline:</div>
            <div class="fix-code">${spec.after_nodes.join('  →  ')}<br/>// Result: ${m0.label} = ${m0.value} (${m0.sub}) · ${m1.label} = ${m1.value}</div>
            <div class="reactions">
              <div class="react">✓ ${spec.after_badge}</div>
              <div class="react">${m0.label}: ${m0.value}</div>
              <div class="react">Saved to runbook</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="footer">
      <div>REAL PRODUCTION POSTMORTEM · ${spec.eyebrow.split('·')[0].trim()}</div>
      <div>olventech.com</div>
    </div>
  </body></html>`;
}

/**
 * GENRE 3 (circuit_breaker_state_machine):
 * ByteByteGo / Excalidraw Hand-Sketched Whiteboard Architecture
 * Crisp dot-grid paper + organic SVG whiteboard flow + red crossed-out naive path + yellow marker highlight.
 */
function renderWhiteboardSketch(spec, p) {
  const isWide = p.layout === 'landscape' || p.layout === 'landscape-tall';
  const m0 = spec.metrics[0];

  return `<!DOCTYPE html><html><head><meta charset="utf-8"><style>
    ${baseFontsCss()}
    body {
      width: ${p.width}px; height: ${p.height}px;
      background-color: #FAF9F5;
      background-image: radial-gradient(#CBD5E1 1.6px, transparent 1.6px);
      background-size: 28px 28px;
      color: #1E293B;
      font-family: 'Inter', sans-serif;
      padding: ${isWide ? '44px 60px' : '62px 58px'};
      display: flex; flex-direction: column; justify-content: space-between; gap: ${isWide ? '20px' : '30px'};
      position: relative; overflow: hidden;
    }
    .top-bar {
      display: flex; justify-content: space-between; align-items: center;
    }
    .sketch-pill {
      font-family: 'IBM Plex Mono', monospace; font-size: 14px; font-weight: 700;
      color: #0F172A; background: #FEF08A; border: 2px solid #0F172A;
      padding: 6px 16px; border-radius: 8px; transform: rotate(-1deg);
      box-shadow: 3px 3px 0 #0F172A;
    }
    h1 {
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-size: ${isWide ? '42px' : '50px'}; line-height: 1.09; font-weight: 800;
      letter-spacing: -0.03em; color: #0F172A;
    }
    .hl {
      background: linear-gradient(180deg, transparent 58%, #FEF08A 58%);
      padding: 0 6px;
    }
    .board {
      flex: 1;
      display: flex; flex-direction: column; justify-content: space-evenly; gap: ${isWide ? '18px' : '28px'};
    }
    .lane {
      background: rgba(255,255,255,0.88);
      border: 2.5px solid #0F172A; border-radius: 18px;
      padding: ${isWide ? '22px 28px' : '30px 32px'};
      position: relative;
      box-shadow: 6px 6px 0 #0F172A;
    }
    .lane.bad {
      border-style: dashed; border-color: #DC2626;
      background: rgba(254,242,242,0.82); box-shadow: 5px 5px 0 rgba(220,38,38,0.22);
    }
    .lane.good {
      border-color: #0D9488; background: rgba(240,253,250,0.92);
      box-shadow: 7px 7px 0 #0D9488;
    }
    .lane-top {
      display: flex; justify-content: space-between; align-items: center; margin-bottom: ${isWide ? '16px' : '22px'};
    }
    .lane-title {
      font-family: 'IBM Plex Mono', monospace; font-size: 16px; font-weight: 700;
      letter-spacing: 0.05em; text-transform: uppercase;
    }
    .lane.bad .lane-title { color: #B91C1C; }
    .lane.good .lane-title { color: #0F766E; }
    .lane-badge {
      font-family: 'IBM Plex Mono', monospace; font-size: 15px; font-weight: 700;
      padding: 5px 14px; border-radius: 999px;
    }
    .lane.bad .lane-badge { background: #FEE2E2; color: #B91C1C; border: 1.5px solid #DC2626; }
    .lane.good .lane-badge { background: #CCFBF1; color: #115E59; border: 1.5px solid #0D9488; }
    .flow-row {
      display: grid; grid-template-columns: 1fr auto 1fr auto 1fr auto 1fr;
      align-items: center; gap: 10px;
    }
    .box {
      background: #FFFFFF; border: 2.5px solid #0F172A; border-radius: 12px;
      padding: ${isWide ? '16px 14px' : '24px 14px'}; text-align: center;
      font-family: 'Plus Jakarta Sans', sans-serif; font-size: ${isWide ? '18px' : '19px'};
      font-weight: 800; color: #0F172A; line-height: 1.2;
      box-shadow: 3px 3px 0 rgba(15,23,42,0.18);
    }
    .lane.bad .box {
      border-color: #EF4444; color: #7F1D1D;
    }
    .lane.bad .box:last-child {
      background: #FEE2E2; text-decoration: line-through;
    }
    .lane.good .box {
      border-color: #0D9488; color: #0F172A;
    }
    .lane.good .box.key {
      background: #FEF08A; border-color: #0F172A; transform: rotate(-1deg);
    }
    .arr {
      font-family: 'IBM Plex Mono', monospace; font-size: 26px; font-weight: 800; color: #0F172A;
    }
    .lane.bad .arr { color: #DC2626; }
    .lane.good .arr { color: #0D9488; }
    .note-strip {
      margin-top: ${isWide ? '14px' : '20px'};
      font-family: 'IBM Plex Mono', monospace; font-size: 16px; font-weight: 600; color: #334155;
    }
    .footer {
      display: flex; justify-content: space-between; align-items: center;
      font-family: 'IBM Plex Mono', monospace; font-size: 15px; font-weight: 700; color: #475569;
    }
  </style></head><body>
    <div class="top-bar">
      <div>${logoForLightBg(32)}</div>
      <div class="sketch-pill">SYSTEM DESIGN WHITEBOARD</div>
    </div>

    <h1>${spec.headline} — <span class="hl">${m0.value}</span></h1>

    <div class="board">
      <div class="lane bad">
        <div class="lane-top">
          <div class="lane-title">✕ NAIVE PATTERN (BREAKS UNDER LOAD)</div>
          <div class="lane-badge">${spec.before_badge}</div>
        </div>
        <div class="flow-row">
          ${spec.before_nodes.map((n, i) => `<div class="box">${n}</div>${i < 3 ? '<div class="arr">→</div>' : ''}`).join('')}
        </div>
        <div class="note-strip">↳ ${shorten(spec.before_points[0], 115)}</div>
      </div>

      <div class="lane good">
        <div class="lane-top">
          <div class="lane-title">✓ PRODUCTION ARCHITECTURE</div>
          <div class="lane-badge">${spec.after_badge}</div>
        </div>
        <div class="flow-row">
          ${spec.after_nodes.map((n, i) => `<div class="box ${i === 1 || i === 2 ? 'key' : ''}">${n}</div>${i < 3 ? '<div class="arr">→</div>' : ''}`).join('')}
        </div>
        <div class="note-strip">↳ ${shorten(spec.after_points[0], 115)} · ${m0.label}: <strong>${m0.value}</strong> (${m0.sub})</div>
      </div>
    </div>

    <div class="footer">
      <div>SAVE THIS ARCHITECTURE DIAGRAM</div>
      <div>olventech.com</div>
    </div>
  </body></html>`;
}

/**
 * GENRE 4 (split_latency_waterfall):
 * Vercel / Raycast macOS Glass GitHub PR Diff Window
 * High-saturation ambient studio gradient + floating dark code diff window (red - vs green +).
 */
function renderGithubPrDiff(spec, p) {
  const isWide = p.layout === 'landscape' || p.layout === 'landscape-tall';
  const m0 = spec.metrics[0];
  const m1 = spec.metrics[1];

  const badLines = [
    `// ${spec.before_title}`,
    `await callDirectly("${spec.before_nodes[1]}", payload);`,
    `await writeTarget("${spec.before_nodes[2]}"); // ${spec.before_badge}`
  ];
  const goodLines = [
    `// ${spec.after_title}`,
    `const gate = await enforce("${spec.after_nodes[1]}", payload);`,
    `await lockIdempotency("${spec.after_nodes[2]}", gate.key);`,
    `return commitVerified("${spec.after_nodes[3]}"); // ${spec.after_badge}`
  ];

  return `<!DOCTYPE html><html><head><meta charset="utf-8"><style>
    ${baseFontsCss()}
    body {
      width: ${p.width}px; height: ${p.height}px;
      background:
        radial-gradient(circle at 14% 18%, rgba(139,92,246,0.42), transparent 46%),
        radial-gradient(circle at 86% 24%, rgba(245,158,11,0.34), transparent 44%),
        radial-gradient(circle at 50% 92%, rgba(16,185,129,0.28), transparent 48%),
        #0B0817;
      color: #F8FAFC;
      font-family: 'Inter', sans-serif;
      padding: ${isWide ? '44px 68px' : '64px 58px'};
      display: flex; flex-direction: column; justify-content: space-between; gap: ${isWide ? '22px' : '32px'};
      position: relative; overflow: hidden;
    }
    .top-row {
      display: flex; justify-content: space-between; align-items: center;
    }
    .pr-pill {
      font-family: 'IBM Plex Mono', monospace; font-size: 14px; font-weight: 700;
      background: rgba(168,85,247,0.22); color: #E9D5FF;
      border: 1px solid rgba(192,132,252,0.45);
      padding: 7px 16px; border-radius: 999px;
    }
    h1 {
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-size: ${isWide ? '42px' : '52px'}; line-height: 1.07; font-weight: 800;
      letter-spacing: -0.03em; color: #FFFFFF;
    }
    .mac-win {
      flex: 1;
      background: rgba(13, 17, 23, 0.92);
      border: 1.5px solid rgba(255,255,255,0.16);
      border-radius: 20px; overflow: hidden;
      box-shadow: 0 36px 90px rgba(0,0,0,0.62);
      display: flex; flex-direction: column;
    }
    .mac-bar {
      background: rgba(255,255,255,0.05); border-bottom: 1px solid rgba(255,255,255,0.10);
      padding: 15px 24px; display: flex; justify-content: space-between; align-items: center;
    }
    .mac-dots { display: flex; gap: 9px; align-items: center; }
    .dot { width: 13px; height: 13px; border-radius: 50%; }
    .fname {
      font-family: 'IBM Plex Mono', monospace; font-size: 15px; color: #CBD5E1; margin-left: 14px; font-weight: 600;
    }
    .diff-stat {
      font-family: 'IBM Plex Mono', monospace; font-size: 14px; font-weight: 700;
    }
    .code-body {
      flex: 1; padding: ${isWide ? '22px 0' : '30px 0'};
      font-family: 'IBM Plex Mono', monospace; font-size: ${isWide ? '20px' : '22px'}; line-height: 1.75;
      display: flex; flex-direction: column; justify-content: center;
    }
    .line {
      padding: 6px 30px; display: flex; gap: 18px; white-space: pre-wrap;
    }
    .line.del {
      background: rgba(248,81,73,0.16); color: #FFA198; border-left: 4px solid #F85149;
    }
    .line.add {
      background: rgba(46,160,67,0.18); color: #7EE787; border-left: 4px solid #3FB950;
    }
    .line.ctx { color: #8B949E; border-left: 4px solid transparent; }
    .sign { font-weight: 800; width: 16px; flex-shrink: 0; }
    .impact-strip {
      display: flex; justify-content: space-between; align-items: center;
      background: rgba(255,255,255,0.07); border: 1px solid rgba(255,255,255,0.16);
      border-radius: 16px; padding: 18px 26px;
    }
    .imp-left {
      display: flex; gap: 36px; align-items: center;
    }
    .imp-item { display: flex; flex-direction: column; }
    .imp-lbl { font-family: 'IBM Plex Mono', monospace; font-size: 12px; color: #CBD5E1; font-weight: 700; }
    .imp-val { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 32px; font-weight: 800; color: #FDE68A; }
    .imp-right { font-family: 'IBM Plex Mono', monospace; font-size: 15px; color: #E2E8F0; font-weight: 700; }
  </style></head><body>
    <div class="top-row">
      <div>${logoForDarkBg(32)}</div>
      <div class="pr-pill">MERGED PR · PRODUCTION HOTFIX</div>
    </div>

    <h1>${spec.headline}</h1>

    <div class="mac-win">
      <div class="mac-bar">
        <div class="mac-dots">
          <span class="dot" style="background:#FF5F56"></span>
          <span class="dot" style="background:#FFBD2E"></span>
          <span class="dot" style="background:#27C93F"></span>
          <span class="fname">worker/production_gate.ts</span>
        </div>
        <div class="diff-stat"><span style="color:#7EE787;">+4</span> <span style="color:#FFA198;">-3</span></div>
      </div>
      <div class="code-body">
        ${badLines.map((l) => `<div class="line del"><span class="sign">-</span><span>${l}</span></div>`).join('')}
        <div class="line ctx"><span class="sign"> </span><span></span></div>
        ${goodLines.map((l) => `<div class="line add"><span class="sign">+</span><span>${l}</span></div>`).join('')}
      </div>
    </div>

    <div class="impact-strip">
      <div class="imp-left">
        <div class="imp-item">
          <div class="imp-lbl">${m0.label}</div>
          <div class="imp-val">${m0.value}</div>
        </div>
        <div class="imp-item">
          <div class="imp-lbl">${m1.label}</div>
          <div class="imp-val" style="color:#6EE7B7;">${m1.value}</div>
        </div>
      </div>
      <div class="imp-right">olventech.com</div>
    </div>
  </body></html>`;
}

/**
 * GENRE 5 (revenue_ledger_reconciliation):
 * Datadog / Grafana Live Production Telemetry Cliff Chart
 * Dramatic SVG red failure plateau dropping off a cliff to emerald flatline at "FIX DEPLOYED".
 */
function renderTelemetryCrashChart(spec, p) {
  const isWide = p.layout === 'landscape' || p.layout === 'landscape-tall';
  const m0 = spec.metrics[0];
  const m1 = spec.metrics[1];

  return `<!DOCTYPE html><html><head><meta charset="utf-8"><style>
    ${baseFontsCss()}
    body {
      width: ${p.width}px; height: ${p.height}px;
      background:
        radial-gradient(circle at 84% 16%, rgba(16,185,129,0.16), transparent 46%),
        #EEF7F4;
      color: #0F172A;
      font-family: 'Inter', sans-serif;
      padding: ${isWide ? '44px 62px' : '62px 58px'};
      display: flex; flex-direction: column; justify-content: space-between; gap: ${isWide ? '22px' : '30px'};
      position: relative; overflow: hidden;
    }
    .top-row {
      display: flex; justify-content: space-between; align-items: center;
    }
    .tel-tag {
      font-family: 'IBM Plex Mono', monospace; font-size: 14px; font-weight: 700;
      color: #047857; background: #D1FAE5; border: 1.5px solid #10B981;
      padding: 7px 16px; border-radius: 999px;
    }
    h1 {
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-size: ${isWide ? '42px' : '50px'}; line-height: 1.08; font-weight: 800;
      letter-spacing: -0.03em; color: #0F172A;
    }
    .chart-card {
      flex: 1;
      background: #FFFFFF; border: 2px solid #CBD5E1; border-radius: 22px;
      padding: ${isWide ? '26px 32px' : '34px 36px'};
      display: flex; flex-direction: column; justify-content: space-between; gap: 18px;
      box-shadow: 0 24px 60px rgba(15,23,42,0.08);
    }
    .chart-head {
      display: flex; justify-content: space-between; align-items: center;
      font-family: 'IBM Plex Mono', monospace; font-size: 15px; color: #475569; font-weight: 700;
    }
    .chart-svg-wrap { flex: 1; display: flex; align-items: center; }
    .stat-pair {
      display: grid; grid-template-columns: 1fr 1fr; gap: 20px;
    }
    .sp {
      background: #F8FAFC; border: 1.5px solid #E2E8F0; border-radius: 14px;
      padding: 18px 24px; display: flex; justify-content: space-between; align-items: center;
    }
    .sp.bad { border-color: #FDA4AF; background: #FFF1F2; }
    .sp.good { border-color: #6EE7B7; background: #ECFDF5; }
    .sp-lbl { font-family: 'IBM Plex Mono', monospace; font-size: 13px; color: #475569; font-weight: 700; }
    .sp-val { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 36px; font-weight: 800; margin-top: 4px; }
    .footer {
      display: flex; justify-content: space-between; align-items: center;
      font-family: 'IBM Plex Mono', monospace; font-size: 15px; color: #475569; font-weight: 600;
    }
  </style></head><body>
    <div class="top-row">
      <div>${logoForLightBg(32)}</div>
      <div class="tel-tag">● LIVE PRODUCTION TELEMETRY</div>
    </div>

    <h1>${spec.headline}</h1>

    <div class="chart-card">
      <div class="chart-head">
        <span>METRIC: ${m0.label} · ${spec.eyebrow.split('·')[0].trim()}</span>
        <span style="color:#047857;">▼ ${m0.sub}</span>
      </div>

      <div class="chart-svg-wrap">
        <svg viewBox="0 0 1000 340" style="width:100%; height:100%; max-height:${isWide ? '260px' : '460px'};">
          <defs>
            <linearGradient id="redGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#E11D48" stop-opacity="0.34"/>
              <stop offset="100%" stop-color="#E11D48" stop-opacity="0.02"/>
            </linearGradient>
            <linearGradient id="greenGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#059669" stop-opacity="0.32"/>
              <stop offset="100%" stop-color="#059669" stop-opacity="0.02"/>
            </linearGradient>
          </defs>
          <!-- Horizontal gridlines -->
          <line x1="20" y1="60" x2="980" y2="60" stroke="#E2E8F0" stroke-width="1.5" stroke-dasharray="6 6"/>
          <line x1="20" y1="145" x2="980" y2="145" stroke="#E2E8F0" stroke-width="1.5" stroke-dasharray="6 6"/>
          <line x1="20" y1="230" x2="980" y2="230" stroke="#E2E8F0" stroke-width="1.5" stroke-dasharray="6 6"/>
          <line x1="20" y1="305" x2="980" y2="305" stroke="#94A3B8" stroke-width="2"/>

          <!-- Red failure area + jagged line -->
          <path d="M20,120 L95,88 L170,132 L245,62 L320,96 L395,54 L470,74 L470,305 L20,305 Z" fill="url(#redGrad)"/>
          <path d="M20,120 L95,88 L170,132 L245,62 L320,96 L395,54 L470,74" fill="none" stroke="#E11D48" stroke-width="6" stroke-linejoin="round"/>

          <!-- Vertical deploy cliff -->
          <line x1="470" y1="18" x2="470" y2="305" stroke="#0F172A" stroke-width="3" stroke-dasharray="8 6"/>
          <rect x="486" y="20" width="210" height="38" rx="9" fill="#0F172A"/>
          <text x="591" y="44" text-anchor="middle" font-family="IBM Plex Mono, monospace" font-size="16" font-weight="700" fill="#FEF08A">▼ FIX DEPLOYED</text>

          <!-- Drop + Emerald stable baseline -->
          <path d="M470,74 L515,274 L600,278 L700,276 L800,280 L900,278 L980,279 L980,305 L470,305 Z" fill="url(#greenGrad)"/>
          <path d="M470,74 L515,274 L600,278 L700,276 L800,280 L900,278 L980,279" fill="none" stroke="#059669" stroke-width="6" stroke-linejoin="round"/>

          <!-- Labels -->
          <rect x="38" y="168" width="275" height="38" rx="9" fill="#FFE4E6" stroke="#E11D48" stroke-width="2"/>
          <text x="175" y="192" text-anchor="middle" font-family="IBM Plex Mono, monospace" font-size="15" font-weight="700" fill="#9F1239">${spec.before_badge}</text>

          <rect x="678" y="216" width="275" height="38" rx="9" fill="#D1FAE5" stroke="#059669" stroke-width="2"/>
          <text x="815" y="240" text-anchor="middle" font-family="IBM Plex Mono, monospace" font-size="15" font-weight="700" fill="#065F46">${spec.after_badge}</text>
        </svg>
      </div>

      <div class="stat-pair">
        <div class="sp bad">
          <div>
            <div class="sp-lbl">BEFORE FIX</div>
            <div class="sp-val" style="color:#BE123C;">${spec.before_badge}</div>
          </div>
          <div style="font-family:'IBM Plex Mono',monospace;font-size:15px;color:#9F1239;font-weight:700;">${spec.before_nodes[1]}</div>
        </div>
        <div class="sp good">
          <div>
            <div class="sp-lbl">AFTER FIX (${m0.label})</div>
            <div class="sp-val" style="color:#047857;">${m0.value}</div>
          </div>
          <div style="font-family:'IBM Plex Mono',monospace;font-size:15px;color:#065F46;font-weight:700;">${m1.label}: ${m1.value}</div>
        </div>
      </div>
    </div>

    <div class="footer">
      <div>${shorten(spec.after_points[0], 85)}</div>
      <div>olventech.com</div>
    </div>
  </body></html>`;
}

/**
 * GENRE 6 (cdc_hash_diff_funnel):
 * High-Contrast Editorial Magazine Split ("WHAT TEAMS BUILD vs. WHAT SURVIVES PROD")
 * Bold terracotta/obsidian half vs crisp cream paper half, <35 words, massive visual tension.
 */
function renderContrarianSplit(spec, p) {
  const isWide = p.layout === 'landscape' || p.layout === 'landscape-tall';
  const m0 = spec.metrics[0];

  return `<!DOCTYPE html><html><head><meta charset="utf-8"><style>
    ${baseFontsCss()}
    body {
      width: ${p.width}px; height: ${p.height}px;
      font-family: 'Inter', sans-serif;
      display: grid;
      grid-template-columns: ${isWide ? '1fr 1fr' : '1fr'};
      grid-template-rows: ${isWide ? '1fr' : '1fr 1fr'};
      position: relative; overflow: hidden;
    }
    .half {
      padding: ${isWide ? '56px 58px' : '58px 66px'};
      display: flex; flex-direction: column; justify-content: space-between;
      position: relative;
    }
    .half.dark {
      background: linear-gradient(145deg, #1E130F 0%, #3A1A0E 100%);
      color: #FFF7ED;
    }
    .half.light {
      background: #FFFBF5;
      color: #1C1917;
    }
    .kicker {
      font-family: 'IBM Plex Mono', monospace; font-size: 16px; font-weight: 700;
      letter-spacing: 0.12em; text-transform: uppercase;
    }
    .dark .kicker { color: #FB923C; }
    .light .kicker { color: #059669; }
    .big-claim {
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-size: ${isWide ? '54px' : '64px'}; line-height: 1.04; font-weight: 800;
      letter-spacing: -0.035em;
    }
    .dark .big-claim {
      color: #FED7AA; text-decoration: line-through; text-decoration-color: #EA580C; text-decoration-thickness: 6px;
    }
    .light .big-claim { color: #0F172A; }
    .sub-line {
      font-size: ${isWide ? '22px' : '25px'}; line-height: 1.4; font-weight: 500; margin-top: 16px;
    }
    .dark .sub-line { color: #D6D3D1; }
    .light .sub-line { color: #44403C; }
    .pill-out {
      align-self: flex-start;
      font-family: 'IBM Plex Mono', monospace; font-size: 20px; font-weight: 800;
      padding: 12px 22px; border-radius: 12px;
    }
    .dark .pill-out { background: rgba(234,88,12,0.22); color: #FDBA74; border: 2px solid #EA580C; }
    .light .pill-out { background: #059669; color: #FFFFFF; }
    .vs-badge {
      position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%);
      width: 82px; height: 82px; border-radius: 50%;
      background: #0F172A; color: #FFFFFF; border: 5px solid #FFFBF5;
      display: flex; align-items: center; justify-content: center;
      font-family: 'Plus Jakarta Sans', sans-serif; font-size: 26px; font-weight: 800;
      z-index: 10; box-shadow: 0 12px 30px rgba(0,0,0,0.35);
    }
    .brand-foot {
      display: flex; justify-content: space-between; align-items: center;
      font-family: 'IBM Plex Mono', monospace; font-size: 15px; font-weight: 700; color: #57534E;
    }
  </style></head><body>
    <div class="vs-badge">VS</div>

    <div class="half dark">
      <div style="display:flex;justify-content:space-between;align-items:center;">
        <div class="kicker">✕ WHAT MOST TEAMS BUILD</div>
        <div>${logoForDarkBg(30)}</div>
      </div>
      <div>
        <div class="big-claim">${spec.before_title.replace(/^Before:\s*/i, '')}</div>
        <div class="sub-line">${shorten(spec.before_points[0], 105)}</div>
      </div>
      <div class="pill-out">RESULT: ${spec.before_badge}</div>
    </div>

    <div class="half light">
      <div class="kicker">✓ WHAT SURVIVES PRODUCTION</div>
      <div>
        <div class="big-claim">${spec.after_title.replace(/^After:\s*/i, '')}</div>
        <div class="sub-line">${spec.after_nodes.slice(1).join(' → ')}</div>
      </div>
      <div class="brand-foot">
        <div class="pill-out">${m0.label}: ${m0.value}</div>
        <div>olventech.com</div>
      </div>
    </div>
  </body></html>`;
}

function selectArchetype(spec) {
  if (spec.visual_archetype && ARCHETYPES.includes(spec.visual_archetype)) {
    return spec.visual_archetype;
  }
  const m = String(spec.doc_id || '').match(/\d+/);
  const idx = m ? parseInt(m[0], 10) : 0;
  return ARCHETYPES[idx % ARCHETYPES.length];
}

function buildHtml(spec, platform) {
  const archetype = selectArchetype(spec);
  switch (archetype) {
    case 'editorial_light_blueprint':
      return renderBillboardPoster(spec, platform);
    case 'security_policy_shield_matrix':
      return renderSlackIncidentStory(spec, platform);
    case 'circuit_breaker_state_machine':
      return renderWhiteboardSketch(spec, platform);
    case 'split_latency_waterfall':
      return renderGithubPrDiff(spec, platform);
    case 'revenue_ledger_reconciliation':
      return renderTelemetryCrashChart(spec, platform);
    case 'cdc_hash_diff_funnel':
    default:
      return renderContrarianSplit(spec, platform);
  }
}

async function main() {
  const specPath = process.argv[2];
  const outDir = process.argv[3];
  if (!specPath || !outDir) {
    console.error('Usage: node render_case_study.js <spec.json> <outDir>');
    process.exit(1);
  }
  const spec = JSON.parse(fs.readFileSync(specPath, 'utf8'));
  const chosenArchetype = selectArchetype(spec);
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(
    path.join(outDir, 'visual-metadata.json'),
    JSON.stringify({ visual_archetype: chosenArchetype, doc_id: spec.doc_id, headline: spec.headline }, null, 2)
  );

  const launchOpts = { args: ['--no-sandbox', '--disable-setuid-sandbox'] };
  const chromeBin = ['/usr/bin/chromium', '/usr/bin/chromium-browser', '/usr/bin/google-chrome'].find((p) => fs.existsSync(p));
  if (chromeBin) launchOpts.executablePath = chromeBin;
  const browser = await chromium.launch(launchOpts);

  for (const p of PLATFORMS) {
    const context = await browser.newContext({
      viewport: { width: p.width, height: p.height },
      deviceScaleFactor: 2
    });
    const page = await context.newPage();
    await page.setContent(buildHtml(spec, p), { waitUntil: 'load' });
    await page.evaluate(() => document.fonts.ready);
    const outPath = path.join(outDir, p.name);
    await page.screenshot({ path: outPath, type: 'png' });
    await context.close();
    console.log(`Rendered ${outPath} [archetype=${chosenArchetype}] (${p.width * 2}x${p.height * 2})`);
  }

  await browser.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
