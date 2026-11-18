#!/usr/bin/env node
/**
 * Olven Tech — 6-Archetype Bespoke Visual Systems Renderer (2x Retina)
 *
 * Every archetype has a radically different visual composition, canvas geometry,
 * and engineering diagram widget so consecutive posts on an Instagram or LinkedIn
 * profile grid look like bespoke studio posters — never a repeated template:
 *
 *  1. editorial_light_blueprint     — Warm FT Paper Poster (#F5F2EB) + Giant Hero Stat + Dark SQL/Code Terminal Window
 *  2. security_policy_shield_matrix — Deep Emerald Blueprint (#061410) + 3-Column SVG Policy Firewall Flowchart + Audit Log
 *  3. circuit_breaker_state_machine — 2x2 Linear/Apple Bento Grid (#EEF2F6) with Navy Hero Tile & SVG Backoff Curve
 *  4. split_latency_waterfall       — 50/50 Vertical Split Screen (Left Crimson-Obsidian #160B0E vs Right Mint #ECFDF5)
 *  5. revenue_ledger_reconciliation — Lavender-Ivory (#EEF2FF) + Live Database CDC Table UI & Slack Alert Card Mockup
 *  6. cdc_hash_diff_funnel          — Warm Espresso & Terracotta (#191210 / #EA580C) + Financial Ledger Balance Sheet Receipt
 */
const fs = require('fs');
const path = require('path');

const PLAYWRIGHT_PATH = fs.existsSync(path.join(__dirname, 'node_modules/playwright-core'))
  ? path.join(__dirname, 'node_modules/playwright-core')
  : '/home/antigravity/.npm/_npx/e41f203b7505f1fb/node_modules/playwright-core';
const { chromium } = require(PLAYWRIGHT_PATH);

const ASSETS_DIR = path.join(__dirname, 'assets');
const b64Font = (file) => fs.readFileSync(path.join(ASSETS_DIR, file)).toString('base64');

let rawLogo = fs.readFileSync(path.join(ASSETS_DIR, 'horizontal_dark.svg'), 'utf8')
  .replace(/<\?xml[\s\S]*?\?>/g, '');

const logoForDarkBg = rawLogo.replace(
  /<svg\b([^>]*)>/,
  '<svg $1 style="height:34px; width:auto; display:block;">'
);

const logoForLightBg = rawLogo.replace(
  /<svg\b([^>]*)>/,
  '<svg $1 style="height:34px; width:auto; display:block; filter: invert(0.92) hue-rotate(180deg) contrast(1.25);">'
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
      font-weight: 400 600;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    .inline-code {
      font-family: 'IBM Plex Mono', monospace;
      font-size: 0.9em;
      padding: 2px 7px;
      border-radius: 4px;
      font-weight: 600;
    }
  `;
}

/**
 * ARCHETYPE 1: Warm FT Paper Poster + Giant Hero Stat + Dark SQL/Code Execution Terminal
 */
function renderEditorialLightBlueprint(spec, p) {
  const isWide = p.layout === 'landscape' || p.layout === 'landscape-tall';
  const m0 = spec.metrics[0];
  const m1 = spec.metrics[1];

  return `<!DOCTYPE html><html><head><meta charset="utf-8"/><style>
    ${baseFontsCss()}
    body {
      width: ${p.width}px; height: ${p.height}px;
      background: #F4EFE6; color: #0F172A;
      font-family: 'Inter', sans-serif;
      padding: ${isWide ? '38px 48px' : '48px 52px'};
      display: flex; flex-direction: column; gap: ${isWide ? '18px' : '24px'};
      position: relative; overflow: hidden;
    }
    .paper-grid {
      position: absolute; inset: 0;
      background-image:
        linear-gradient(to right, rgba(15, 23, 42, 0.05) 1px, transparent 1px),
        linear-gradient(to bottom, rgba(15, 23, 42, 0.05) 1px, transparent 1px);
      background-size: 40px 40px; pointer-events: none;
    }
    .top-bar {
      position: relative; z-index: 2;
      display: flex; justify-content: space-between; align-items: center;
      border-bottom: 3px solid #0F172A; padding-bottom: 14px;
    }
    .issue-tag {
      font-family: 'IBM Plex Mono', monospace; font-size: 13px; font-weight: 700;
      background: #0F172A; color: #F4EFE6; padding: 6px 14px; border-radius: 4px;
    }
    .poster-hero {
      position: relative; z-index: 2;
      display: grid; grid-template-columns: ${isWide ? '1.35fr 0.65fr' : '1.2fr 0.8fr'};
      gap: 24px; align-items: stretch;
    }
    .hero-copy {
      display: flex; flex-direction: column; justify-content: center;
    }
    .eyebrow {
      font-family: 'IBM Plex Mono', monospace; font-size: 14px; font-weight: 700;
      color: #1D4ED8; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 10px;
    }
    h1 {
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-size: ${isWide ? '38px' : '46px'}; font-weight: 800; line-height: 1.08;
      letter-spacing: -0.03em; color: #0F172A;
    }
    .subhead {
      margin-top: 12px; font-size: ${isWide ? '17px' : '19px'}; line-height: 1.42; color: #334155; font-weight: 500;
    }
    .giant-stat-poster {
      background: #1D4ED8; color: #FFFFFF; border: 3px solid #0F172A; border-radius: 14px;
      padding: 24px 28px; box-shadow: 8px 8px 0px #0F172A;
      display: flex; flex-direction: column; justify-content: space-between;
    }
    .gsp-top {
      font-family: 'IBM Plex Mono', monospace; font-size: 13px; font-weight: 700;
      color: #BFDBFE; letter-spacing: 0.06em;
      display: flex; justify-content: space-between;
    }
    .gsp-num {
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-size: ${isWide ? '64px' : '82px'}; font-weight: 800; line-height: 0.95;
      letter-spacing: -0.04em; color: #FFFFFF; margin: 10px 0;
    }
    .gsp-from {
      font-family: 'IBM Plex Mono', monospace; font-size: 14px;
      background: rgba(15, 23, 42, 0.35); padding: 8px 12px; border-radius: 6px; color: #FEF08A;
    }
    .terminal-workbench {
      position: relative; z-index: 2; flex: 1;
      background: #0B0F19; color: #E2E8F0; border: 3px solid #0F172A; border-radius: 14px;
      box-shadow: 8px 8px 0px #0F172A;
      display: grid; grid-template-columns: ${isWide ? '1.1fr 0.9fr' : '1fr'};
      overflow: hidden;
    }
    .term-left {
      padding: ${isWide ? '22px 26px' : '26px 30px'};
      border-right: ${isWide ? '1px solid #1E293B' : 'none'};
      border-bottom: ${isWide ? 'none' : '1px solid #1E293B'};
      display: flex; flex-direction: column; justify-content: space-between; gap: 14px;
    }
    .term-bar {
      display: flex; align-items: center; justify-content: space-between;
      border-bottom: 1px solid #1E293B; padding-bottom: 12px;
    }
    .dots { display: flex; gap: 7px; align-items: center; }
    .dot { width: 11px; height: 11px; border-radius: 50%; }
    .sql-trace {
      font-family: 'IBM Plex Mono', monospace; font-size: ${isWide ? '13.5px' : '14.5px'};
      line-height: 1.55; background: #060911; border: 1px solid #1E293B;
      border-radius: 8px; padding: 14px 18px; color: #93C5FD;
    }
    .stage-chain {
      display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px;
    }
    .stage-pill {
      background: #111827; border: 1.5px solid #3B82F6; border-radius: 8px; padding: 10px 12px;
    }
    .sp-idx { font-family: 'IBM Plex Mono', monospace; font-size: 11px; color: #60A5FA; font-weight: 700; }
    .sp-name { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 14px; font-weight: 700; color: #F8FAFC; margin-top: 3px; }
    .term-right {
      padding: ${isWide ? '22px 26px' : '24px 30px'}; background: #111827;
      display: flex; flex-direction: column; justify-content: space-between; gap: 14px;
    }
    .comparison-rows {
      display: flex; flex-direction: column; gap: 12px;
    }
    .comp-item {
      background: #1E293B; border-left: 4px solid #10B981; border-radius: 6px;
      padding: 11px 14px; font-size: 15px; line-height: 1.4; color: #F1F5F9;
    }
    .comp-item.warn {
      background: rgba(127, 29, 29, 0.25); border-left-color: #EF4444; color: #FECACA;
    }
    .inline-code { background: #0F172A; color: #38BDF8; border: 1px solid #334155; }
    .bottom-kpis {
      position: relative; z-index: 2;
      display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px;
    }
    .bk-card {
      background: #FFFFFF; border: 2.5px solid #0F172A; border-radius: 10px;
      padding: 14px 18px; box-shadow: 4px 4px 0px #0F172A;
    }
    .bk-lbl { font-family: 'IBM Plex Mono', monospace; font-size: 11.5px; color: #475569; font-weight: 700; }
    .bk-val { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 26px; font-weight: 800; color: #0F172A; margin: 2px 0; }
    .bk-sub { font-size: 12.5px; color: #1D4ED8; font-weight: 700; }
    .footer {
      position: relative; z-index: 2;
      display: flex; justify-content: space-between; align-items: center;
      border-top: 2px solid #0F172A; padding-top: 10px;
      font-family: 'IBM Plex Mono', monospace; font-size: 13px; font-weight: 700; color: #0F172A;
    }
  </style></head><body>
    <div class="paper-grid"></div>
    <div class="top-bar">
      <div>${logoForLightBg}</div>
      <div class="issue-tag">${spec.doc_id}</div>
    </div>
    <div class="poster-hero">
      <div class="hero-copy">
        <div class="eyebrow">PRODUCTION ARCHITECTURE REPORT · ${spec.eyebrow}</div>
        <h1>${spec.headline}</h1>
        <div class="subhead">${spec.subhead}</div>
      </div>
      <div class="giant-stat-poster">
        <div class="gsp-top"><span>${m0.label}</span><span>VERIFIED SLA</span></div>
        <div class="gsp-num">${m0.value}</div>
        <div class="gsp-from">▲ ${m0.sub} · ${m1.label}: ${m1.value}</div>
      </div>
    </div>
    <div class="terminal-workbench">
      <div class="term-left">
        <div class="term-bar">
          <div class="dots">
            <span class="dot" style="background:#EF4444"></span>
            <span class="dot" style="background:#F59E0B"></span>
            <span class="dot" style="background:#10B981"></span>
            <span style="font-family:'IBM Plex Mono',monospace;font-size:12px;color:#94A3B8;margin-left:8px;">olven_atomic_worker.sql — ${spec.after_badge}</span>
          </div>
          <span style="font-family:'IBM Plex Mono',monospace;font-size:12px;color:#34D399;">● PRODUCTION ACTIVE</span>
        </div>
        <div class="sql-trace">
          <div style="color:#64748B;">-- 1. Eliminate Legacy Failure (${spec.before_title}: ${spec.before_badge})</div>
          <div style="color:#F87171;">-- BLOCKED: ${spec.before_nodes.join(' -> ')}</div>
          <div style="color:#38BDF8;margin-top:6px;">BEGIN ISOLATION LEVEL REPEATABLE READ;</div>
          <div style="color:#A7F3D0;">SELECT pg_try_advisory_xact_lock(hashtext(entity_key));</div>
          <div style="color:#FDE68A;">COMMIT AND NOTIFY downstream_verified_channel;</div>
        </div>
        <div class="stage-chain">
          ${spec.after_nodes.map((n, i) => `
            <div class="stage-pill">
              <div class="sp-idx">STEP 0${i + 1}</div>
              <div class="sp-name">${n}</div>
            </div>
          `).join('')}
        </div>
      </div>
      <div class="term-right">
        <div style="font-family:'IBM Plex Mono',monospace;font-size:12px;color:#F87171;font-weight:700;letter-spacing:0.05em;">
          ✕ LEGACY BOTTLENECK (${spec.before_badge})
        </div>
        <div class="comparison-rows">
          <div class="comp-item warn">${spec.before_points[0]}</div>
          <div class="comp-item warn">${spec.before_points[1]}</div>
        </div>
        <div style="font-family:'IBM Plex Mono',monospace;font-size:12px;color:#34D399;font-weight:700;letter-spacing:0.05em;margin-top:4px;">
          ✓ ENGINEERED INVARIANTS (${spec.after_badge})
        </div>
        <div class="comparison-rows">
          ${spec.after_points.map(pt => `<div class="comp-item">${pt}</div>`).join('')}
        </div>
      </div>
    </div>
    <div class="bottom-kpis">
      ${spec.metrics.map(m => `
        <div class="bk-card">
          <div class="bk-lbl">${m.label}</div>
          <div class="bk-val">${m.value}</div>
          <div class="bk-sub">${m.sub}</div>
        </div>
      `).join('')}
    </div>
    <div class="footer">
      <div>OLVEN TECH · SYSTEMS ARCHITECTURE DOSSIER</div>
      <div>contact@olventech.com</div>
    </div>
  </body></html>`;
}

/**
 * ARCHETYPE 2: Deep Emerald Firewall Matrix + Centerpiece 3-Tier Policy Shield Diagram
 */
function renderSecurityPolicyShieldMatrix(spec, p) {
  const isWide = p.layout === 'landscape' || p.layout === 'landscape-tall';

  return `<!DOCTYPE html><html><head><meta charset="utf-8"/><style>
    ${baseFontsCss()}
    body {
      width: ${p.width}px; height: ${p.height}px;
      background: #041410; color: #ECFDF5;
      font-family: 'Inter', sans-serif;
      padding: ${isWide ? '38px 48px' : '48px 52px'};
      display: flex; flex-direction: column; gap: ${isWide ? '18px' : '22px'};
      position: relative; overflow: hidden;
    }
    .matrix-bg {
      position: absolute; inset: 0;
      background-image: radial-gradient(rgba(16, 185, 129, 0.22) 1.5px, transparent 1.5px);
      background-size: 28px 28px; pointer-events: none;
    }
    .top-bar {
      position: relative; z-index: 2;
      display: flex; justify-content: space-between; align-items: center;
      border-bottom: 2px solid #10B981; padding-bottom: 14px;
    }
    .sec-badge {
      font-family: 'IBM Plex Mono', monospace; font-size: 13px; font-weight: 700;
      background: #10B981; color: #041410; padding: 6px 14px; border-radius: 4px;
    }
    .title-block {
      position: relative; z-index: 2;
      background: linear-gradient(90deg, #06281E 0%, #041410 100%);
      border-left: 6px solid #F59E0B; padding: 18px 24px; border-radius: 0 12px 12px 0;
    }
    .eyebrow {
      font-family: 'IBM Plex Mono', monospace; font-size: 13px; font-weight: 700;
      color: #FBBF24; letter-spacing: 0.08em; text-transform: uppercase; margin-bottom: 6px;
    }
    h1 {
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-size: ${isWide ? '36px' : '42px'}; font-weight: 800; line-height: 1.1; color: #FFFFFF;
    }
    .subhead { margin-top: 8px; font-size: 17px; color: #A7F3D0; line-height: 1.4; }
    .firewall-stage {
      position: relative; z-index: 2; flex: 1;
      display: grid; grid-template-columns: ${isWide ? '0.9fr 1.2fr 0.9fr' : '1fr'};
      gap: 16px; align-items: stretch;
    }
    .tier-col {
      border-radius: 14px; padding: 22px 24px;
      display: flex; flex-direction: column; justify-content: space-between; gap: 12px;
    }
    .tier-untrusted {
      background: #1F0D12; border: 2px dashed #F87171;
    }
    .tier-shield {
      background: #FEFCE8; color: #0F172A; border: 4px solid #F59E0B;
      box-shadow: 0 0 40px rgba(245, 158, 11, 0.25);
    }
    .tier-verified {
      background: #062E22; border: 2px solid #34D399;
    }
    .tier-hdr {
      font-family: 'IBM Plex Mono', monospace; font-size: 12px; font-weight: 700;
      letter-spacing: 0.06em; text-transform: uppercase;
      display: flex; justify-content: space-between; align-items: center;
      padding-bottom: 10px; border-bottom: 1px solid rgba(255,255,255,0.15);
    }
    .tier-shield .tier-hdr { border-bottom-color: #FDE047; color: #B45309; }
    .tier-title {
      font-family: 'Plus Jakarta Sans', sans-serif; font-size: 21px; font-weight: 800;
    }
    .flow-pills {
      display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px;
    }
    .fp {
      padding: 9px 12px; border-radius: 6px; font-family: 'IBM Plex Mono', monospace; font-size: 12.5px; font-weight: 600;
    }
    .tier-untrusted .fp { background: #3B1219; color: #FECACA; border: 1px solid #EF4444; }
    .tier-shield .fp { background: #0F172A; color: #FEF08A; border: 1px solid #F59E0B; }
    .tier-verified .fp { background: #041F17; color: #6EE7B7; border: 1px solid #10B981; }
    .rule-list { list-style: none; display: flex; flex-direction: column; gap: 10px; }
    .rule-list li { font-size: 15px; line-height: 1.4; padding-left: 22px; position: relative; }
    .tier-untrusted .rule-list li { color: #FECACA; }
    .tier-untrusted .rule-list li::before { content: "✕"; position: absolute; left: 2px; color: #F87171; font-weight: 800; }
    .tier-shield .rule-list li { color: #0F172A; font-weight: 500; }
    .tier-shield .rule-list li::before { content: "🔒"; position: absolute; left: 0; font-size: 13px; }
    .tier-shield .inline-code { background: #FEF08A; color: #78350F; border: 1px solid #F59E0B; }
    .tier-untrusted .inline-code { background: #450A0A; color: #FCA5A5; }
    .kpi-grid-2x2 {
      display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px;
    }
    .kpi-cell {
      background: #041A13; border: 1.5px solid #10B981; border-radius: 10px; padding: 14px 16px;
    }
    .kc-v { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 28px; font-weight: 800; color: #34D399; }
    .kc-l { font-family: 'IBM Plex Mono', monospace; font-size: 11px; color: #A7F3D0; margin-top: 2px; }
    .kc-s { font-size: 12px; color: #FBBF24; margin-top: 2px; }
    .footer {
      position: relative; z-index: 2;
      display: flex; justify-content: space-between; border-top: 2px solid #10B981; padding-top: 12px;
      font-family: 'IBM Plex Mono', monospace; font-size: 13px; color: #6EE7B7; font-weight: 700;
    }
  </style></head><body>
    <div class="matrix-bg"></div>
    <div class="top-bar">
      <div>${logoForDarkBg}</div>
      <div class="sec-badge">SECURITY & POLICY GATE · ${spec.doc_id}</div>
    </div>
    <div class="title-block">
      <div class="eyebrow">${spec.eyebrow}</div>
      <h1>${spec.headline}</h1>
      <div class="subhead">${spec.subhead}</div>
    </div>
    <div class="firewall-stage">
      <div class="tier-col tier-untrusted">
        <div class="tier-hdr"><span>TIER 1 · UNTRUSTED RUNTIME</span><span>${spec.before_badge}</span></div>
        <div class="tier-title" style="color:#FCA5A5;">${spec.before_title}</div>
        <div class="flow-pills">
          ${spec.before_nodes.map(n => `<div class="fp">${n}</div>`).join('')}
        </div>
        <ul class="rule-list">
          ${spec.before_points.map(pt => `<li>${pt}</li>`).join('')}
        </ul>
      </div>
      <div class="tier-col tier-shield">
        <div class="tier-hdr"><span>TIER 2 · DETERMINISTIC FIREWALL</span><span>${spec.after_badge}</span></div>
        <div class="tier-title" style="color:#0F172A;">${spec.after_title}</div>
        <div class="flow-pills">
          ${spec.after_nodes.map(n => `<div class="fp">${n}</div>`).join('')}
        </div>
        <ul class="rule-list">
          ${spec.after_points.map(pt => `<li>${pt}</li>`).join('')}
        </ul>
      </div>
      <div class="tier-col tier-verified">
        <div class="tier-hdr" style="color:#6EE7B7;"><span>TIER 3 · PRODUCTION TELEMETRY</span><span>90-DAY AUDIT</span></div>
        <div class="kpi-grid-2x2">
          ${spec.metrics.map(m => `
            <div class="kpi-cell">
              <div class="kc-v">${m.value}</div>
              <div class="kc-l">${m.label}</div>
              <div class="kc-s">${m.sub}</div>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
    <div class="footer">
      <div>OLVEN TECH · ZERO-TRUST AGENT & API ARCHITECTURE</div>
      <div>contact@olventech.com</div>
    </div>
  </body></html>`;
}

/**
 * ARCHETYPE 3: 2x2 Apple/Linear Keynote Bento Grid on Cool Alabaster + SVG Backoff Curve
 */
function renderCircuitBreakerStateMachine(spec, p) {
  const isWide = p.layout === 'landscape' || p.layout === 'landscape-tall';

  return `<!DOCTYPE html><html><head><meta charset="utf-8"/><style>
    ${baseFontsCss()}
    body {
      width: ${p.width}px; height: ${p.height}px;
      background: #E2E8F0; color: #0F172A;
      font-family: 'Inter', sans-serif;
      padding: ${isWide ? '36px 46px' : '44px 48px'};
      display: flex; flex-direction: column; gap: 18px;
    }
    .bento-grid {
      flex: 1; display: grid;
      grid-template-columns: 1.05fr 0.95fr;
      grid-template-rows: auto 1fr 1fr;
      gap: 18px;
    }
    .tile-header {
      grid-column: 1 / 3;
      background: #0B132B; color: #FFFFFF; border-radius: 18px;
      padding: ${isWide ? '22px 28px' : '28px 34px'};
      display: grid; grid-template-columns: 1fr auto; gap: 20px; align-items: center;
    }
    .th-top {
      grid-column: 1 / 3; display: flex; justify-content: space-between; align-items: center;
      border-bottom: 1px solid #1E293B; padding-bottom: 12px; margin-bottom: 4px;
    }
    .eyebrow {
      font-family: 'IBM Plex Mono', monospace; font-size: 13px; color: #38BDF8;
      letter-spacing: 0.08em; text-transform: uppercase; margin-bottom: 6px; font-weight: 700;
    }
    h1 {
      font-family: 'Plus Jakarta Sans', sans-serif; font-size: ${isWide ? '34px' : '40px'};
      font-weight: 800; line-height: 1.1; color: #FFFFFF;
    }
    .subhead { margin-top: 8px; font-size: 16.5px; color: #CBD5E1; line-height: 1.38; }
    .hero-pill-stat {
      background: #0D9488; color: #FFFFFF; border-radius: 14px; padding: 18px 24px; text-align: center;
      min-width: 210px;
    }
    .hps-v { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 46px; font-weight: 800; line-height: 1; }
    .hps-l { font-family: 'IBM Plex Mono', monospace; font-size: 12px; margin-top: 6px; color: #CCFBF1; }
    .bento-tile {
      border-radius: 18px; padding: 22px 26px;
      display: flex; flex-direction: column; justify-content: space-between; gap: 12px;
    }
    .tile-white { background: #FFFFFF; border: 2px solid #CBD5E1; }
    .tile-crimson { background: #450A0A; color: #FEF2F2; }
    .tile-teal { background: #042F2E; color: #F0FDFA; }
    .tile-indigo { background: #1E1B4B; color: #E0E7FF; }
    .bt-tag {
      font-family: 'IBM Plex Mono', monospace; font-size: 12px; font-weight: 700;
      letter-spacing: 0.06em; text-transform: uppercase;
      display: flex; justify-content: space-between;
    }
    .bt-title { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 20px; font-weight: 800; }
    .chip-row { display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px; }
    .chip {
      padding: 8px 10px; border-radius: 6px; font-family: 'IBM Plex Mono', monospace; font-size: 12px; font-weight: 600;
    }
    .tile-crimson .chip { background: #7F1D1D; color: #FECACA; }
    .tile-teal .chip { background: #115E59; color: #99F6E4; }
    .bt-list { list-style: none; display: flex; flex-direction: column; gap: 8px; font-size: 14.5px; line-height: 1.38; }
    .bt-list li { padding-left: 18px; position: relative; }
    .tile-crimson .bt-list li::before { content: "✕"; position: absolute; left: 0; color: #F87171; font-weight: 700; }
    .tile-teal .bt-list li::before { content: "✓"; position: absolute; left: 0; color: #2DD4BF; font-weight: 700; }
    .inline-code { background: rgba(255,255,255,0.15); color: #FEF08A; }
    .kpi-quad { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; flex: 1; }
    .kq-box { background: #F8FAFC; border: 1.5px solid #CBD5E1; border-radius: 12px; padding: 12px 14px; display: flex; flex-direction: column; justify-content: center; }
    .kq-v { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 28px; font-weight: 800; color: #0F172A; }
    .kq-l { font-family: 'IBM Plex Mono', monospace; font-size: 11px; color: #475569; font-weight: 700; }
    .kq-s { font-size: 12px; color: #0D9488; font-weight: 700; }
    .footer {
      display: flex; justify-content: space-between; font-family: 'IBM Plex Mono', monospace;
      font-size: 13px; font-weight: 700; color: #1E293B;
    }
  </style></head><body>
    <div class="bento-grid">
      <div class="tile-header">
        <div class="th-top">
          <div>${logoForDarkBg}</div>
          <span style="font-family:'IBM Plex Mono',monospace;font-size:12.5px;color:#38BDF8;">BENTO ARCHITECTURE BRIEF · ${spec.doc_id}</span>
        </div>
        <div>
          <div class="eyebrow">${spec.eyebrow}</div>
          <h1>${spec.headline}</h1>
          <div class="subhead">${spec.subhead}</div>
        </div>
        <div class="hero-pill-stat">
          <div class="hps-v">${spec.metrics[0].value}</div>
          <div class="hps-l">${spec.metrics[0].label} · ${spec.metrics[0].sub}</div>
        </div>
      </div>

      <div class="bento-tile tile-crimson">
        <div class="bt-tag" style="color:#FCA5A5;"><span>01 · FAILURE MODE</span><span>${spec.before_badge}</span></div>
        <div class="bt-title">${spec.before_title}</div>
        <div class="chip-row">${spec.before_nodes.map(n => `<div class="chip">${n}</div>`).join('')}</div>
        <ul class="bt-list">${spec.before_points.map(pt => `<li>${pt}</li>`).join('')}</ul>
      </div>

      <div class="bento-tile tile-teal">
        <div class="bt-tag" style="color:#5EEAD4;"><span>02 · RESILIENT ENGINE</span><span>${spec.after_badge}</span></div>
        <div class="bt-title">${spec.after_title}</div>
        <div class="chip-row">${spec.after_nodes.map(n => `<div class="chip">${n}</div>`).join('')}</div>
        <ul class="bt-list">${spec.after_points.map(pt => `<li>${pt}</li>`).join('')}</ul>
      </div>

      <div class="bento-tile tile-indigo">
        <div class="bt-tag" style="color:#A5B4FC;"><span>03 · STATE TRANSITION CURVE</span><span>12H SURVIVAL</span></div>
        <svg viewBox="0 0 500 130" style="width:100%;height:auto;background:#0F172A;border-radius:10px;padding:10px;border:1px solid #312E81;">
          <line x1="30" y1="105" x2="470" y2="105" stroke="#334155" stroke-width="2"/>
          <polyline fill="none" stroke="#EF4444" stroke-width="3.5" stroke-dasharray="6,4" points="35,30 95,45 135,100 460,100"/>
          <polyline fill="none" stroke="#34D399" stroke-width="4" points="35,90 110,78 200,62 310,42 455,22"/>
          <text x="145" y="92" fill="#F87171" font-family="monospace" font-size="11" font-weight="bold">Legacy 30s Drop Cliff</text>
          <text x="240" y="32" fill="#34D399" font-family="monospace" font-size="11" font-weight="bold">Write-Ahead Outbox + Ordered Drain (100%)</text>
        </svg>
        <div style="font-family:'IBM Plex Mono',monospace;font-size:12.5px;color:#C7D2FE;">
          State Machine: CLOSED → OPEN (5x HTTP 503) → 60s HEALTH PROBE → ORDERED REPLAY
        </div>
      </div>

      <div class="bento-tile tile-white">
        <div class="bt-tag" style="color:#475569;"><span>04 · VERIFIED PRODUCTION METRICS</span><span>AUDIT LOG</span></div>
        <div class="kpi-quad">
          ${spec.metrics.map(m => `
            <div class="kq-box">
              <div class="kq-l">${m.label}</div>
              <div class="kq-v">${m.value}</div>
              <div class="kq-s">${m.sub}</div>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
    <div class="footer">
      <div>OLVEN TECH · DISTRIBUTED RELIABILITY SYSTEMS</div>
      <div>contact@olventech.com</div>
    </div>
  </body></html>`;
}

/**
 * ARCHETYPE 4: 50/50 Vertical Split Screen Poster (Left Crimson-Obsidian vs Right Mint-Emerald)
 */
function renderSplitLatencyWaterfall(spec, p) {
  const isWide = p.layout === 'landscape' || p.layout === 'landscape-tall';

  return `<!DOCTYPE html><html><head><meta charset="utf-8"/><style>
    ${baseFontsCss()}
    body {
      width: ${p.width}px; height: ${p.height}px;
      display: grid; grid-template-columns: 1fr 1fr;
      font-family: 'Inter', sans-serif; overflow: hidden; position: relative;
    }
    .left-half {
      background: #18090E; color: #FFF1F2;
      padding: ${isWide ? '40px 42px' : '50px 44px'};
      display: flex; flex-direction: column; justify-content: space-between;
      border-right: 4px solid #F59E0B;
    }
    .right-half {
      background: #ECFDF5; color: #064E3B;
      padding: ${isWide ? '40px 42px' : '50px 44px'};
      display: flex; flex-direction: column; justify-content: space-between;
    }
    .side-tag {
      font-family: 'IBM Plex Mono', monospace; font-size: 12.5px; font-weight: 700;
      padding: 6px 12px; border-radius: 6px; display: inline-block;
    }
    .left-half .side-tag { background: #7F1D1D; color: #FECACA; }
    .right-half .side-tag { background: #065F46; color: #A7F3D0; }
    h1 {
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-size: ${isWide ? '32px' : '37px'}; font-weight: 800; line-height: 1.12;
      margin-top: 14px;
    }
    .big-contrast-metric {
      border-radius: 14px; padding: 20px 24px; margin: 14px 0;
    }
    .left-half .big-contrast-metric { background: #2E0F18; border: 2px solid #EF4444; }
    .right-half .big-contrast-metric { background: #064E3B; color: #FFFFFF; box-shadow: 6px 6px 0px #10B981; }
    .bcm-lbl { font-family: 'IBM Plex Mono', monospace; font-size: 12px; opacity: 0.85; }
    .bcm-val { font-family: 'Plus Jakarta Sans', sans-serif; font-size: ${isWide ? '42px' : '50px'}; font-weight: 800; line-height: 1.05; margin: 4px 0; }
    .cascade { display: flex; flex-direction: column; gap: 10px; }
    .c-step {
      padding: 12px 16px; border-radius: 8px; font-family: 'IBM Plex Mono', monospace; font-size: 13px; font-weight: 700;
      display: flex; justify-content: space-between; align-items: center;
    }
    .left-half .c-step { background: #2A1017; border-left: 4px solid #F87171; color: #FECACA; }
    .right-half .c-step { background: #D1FAE5; border-left: 4px solid #059669; color: #064E3B; }
    .pts { list-style: none; display: flex; flex-direction: column; gap: 10px; font-size: 15px; line-height: 1.42; }
    .pts li { padding-left: 20px; position: relative; }
    .left-half .pts li::before { content: "✕"; position: absolute; left: 0; color: #F87171; font-weight: 800; }
    .right-half .pts li::before { content: "✓"; position: absolute; left: 0; color: #059669; font-weight: 800; }
    .left-half .inline-code { background: #450A0A; color: #FDA4AF; }
    .right-half .inline-code { background: #A7F3D0; color: #064E3B; }
    .mini-kpis { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
    .mk { padding: 12px 14px; border-radius: 10px; }
    .left-half .mk { background: #261016; border: 1px solid #7F1D1D; }
    .right-half .mk { background: #FFFFFF; border: 2px solid #059669; }
    .mk-v { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 24px; font-weight: 800; }
    .mk-l { font-family: 'IBM Plex Mono', monospace; font-size: 11px; opacity: 0.8; }
  </style></head><body>
    <div class="left-half">
      <div>
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;">
          ${logoForDarkBg}
          <span class="side-tag">BEFORE · LEGACY DRIFT</span>
        </div>
        <div style="font-family:'IBM Plex Mono',monospace;font-size:12px;color:#FDA4AF;letter-spacing:0.08em;">${spec.eyebrow}</div>
        <h1>${spec.headline}</h1>
      </div>
      <div class="big-contrast-metric">
        <div class="bcm-lbl">${spec.before_title}</div>
        <div class="bcm-val" style="color:#F87171;">${spec.before_badge}</div>
      </div>
      <div class="cascade">
        ${spec.before_nodes.map((n, i) => `<div class="c-step"><span>0${i + 1}. ${n}</span><span>DRIFT</span></div>`).join('')}
      </div>
      <ul class="pts">${spec.before_points.map(pt => `<li>${pt}</li>`).join('')}</ul>
      <div class="mini-kpis">
        <div class="mk"><div class="mk-l">${spec.metrics[2].label}</div><div class="mk-v" style="color:#FDA4AF;">${spec.metrics[2].value}</div></div>
        <div class="mk"><div class="mk-l">${spec.metrics[3].label}</div><div class="mk-v" style="color:#FDA4AF;">${spec.metrics[3].value}</div></div>
      </div>
    </div>
    <div class="right-half">
      <div>
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;">
          <span class="side-tag">AFTER · OLVEN TECH ENGINE</span>
          <span style="font-family:'IBM Plex Mono',monospace;font-size:12px;font-weight:700;">${spec.doc_id}</span>
        </div>
        <p style="font-size:17.5px;line-height:1.45;font-weight:600;color:#065F46;margin-top:8px;">${spec.subhead}</p>
      </div>
      <div class="big-contrast-metric">
        <div class="bcm-lbl" style="color:#A7F3D0;">${spec.after_title} · ${spec.after_badge}</div>
        <div class="bcm-val" style="color:#34D399;">${spec.metrics[0].value}</div>
        <div style="font-family:'IBM Plex Mono',monospace;font-size:12.5px;color:#ECFDF5;">${spec.metrics[0].label} (${spec.metrics[0].sub})</div>
      </div>
      <div class="cascade">
        ${spec.after_nodes.map((n, i) => `<div class="c-step"><span>0${i + 1}. ${n}</span><span>VERIFIED</span></div>`).join('')}
      </div>
      <ul class="pts">${spec.after_points.map(pt => `<li>${pt}</li>`).join('')}</ul>
      <div class="mini-kpis">
        <div class="mk"><div class="mk-l">${spec.metrics[0].label}</div><div class="mk-v" style="color:#059669;">${spec.metrics[0].value}</div></div>
        <div class="mk"><div class="mk-l">${spec.metrics[1].label}</div><div class="mk-v" style="color:#059669;">${spec.metrics[1].value}</div></div>
      </div>
      <div style="font-family:'IBM Plex Mono',monospace;font-size:13px;font-weight:700;text-align:right;border-top:2px solid #059669;padding-top:10px;">
        contact@olventech.com
      </div>
    </div>
  </body></html>`;
}

/**
 * ARCHETYPE 5: Royal Indigo Header + Lavender-Ivory Database Hash-Diff Table & Slack Alert Card
 */
function renderRevenueLedgerReconciliation(spec, p) {
  const isWide = p.layout === 'landscape' || p.layout === 'landscape-tall';

  return `<!DOCTYPE html><html><head><meta charset="utf-8"/><style>
    ${baseFontsCss()}
    body {
      width: ${p.width}px; height: ${p.height}px;
      background: #EEF2FF; color: #1E1B4B;
      font-family: 'Inter', sans-serif;
      padding: ${isWide ? '38px 48px' : '46px 50px'};
      display: flex; flex-direction: column; gap: 18px;
    }
    .indigo-hero {
      background: linear-gradient(135deg, #1E1B4B 0%, #312E81 100%);
      color: #FFFFFF; border-radius: 16px; padding: ${isWide ? '22px 28px' : '28px 32px'};
      box-shadow: 0 12px 28px rgba(49, 46, 129, 0.2);
    }
    .ih-top {
      display: flex; justify-content: space-between; align-items: center;
      border-bottom: 1px solid rgba(165, 180, 252, 0.25); padding-bottom: 12px; margin-bottom: 14px;
    }
    .eyebrow { font-family: 'IBM Plex Mono', monospace; font-size: 13px; color: #A5B4FC; letter-spacing: 0.08em; margin-bottom: 6px; font-weight: 700; }
    h1 { font-family: 'Plus Jakarta Sans', sans-serif; font-size: ${isWide ? '35px' : '41px'}; font-weight: 800; line-height: 1.1; }
    .subhead { margin-top: 8px; font-size: 16.5px; color: #E0E7FF; line-height: 1.4; }
    .db-workspace {
      flex: 1; display: grid; grid-template-columns: ${isWide ? '1.15fr 0.85fr' : '1fr'}; gap: 18px;
    }
    .db-table-card {
      background: #FFFFFF; border: 2.5px solid #312E81; border-radius: 14px; padding: 20px 24px;
      display: flex; flex-direction: column; gap: 14px;
      box-shadow: 6px 6px 0px #4F46E5;
    }
    .db-grid {
      width: 100%; border-collapse: collapse; font-family: 'IBM Plex Mono', monospace; font-size: 12.5px;
    }
    .db-grid th {
      background: #1E1B4B; color: #E0E7FF; text-align: left; padding: 9px 12px;
    }
    .db-grid td {
      padding: 9px 12px; border-bottom: 1px solid #E2E8F0; color: #0F172A; font-weight: 600;
    }
    .status-ok { background: #DCFCE7; color: #15803D; padding: 3px 8px; border-radius: 4px; }
    .status-skip { background: #F1F5F9; color: #475569; padding: 3px 8px; border-radius: 4px; }
    .slack-stack {
      display: flex; flex-direction: column; gap: 14px;
    }
    .slack-card {
      background: #0F172A; color: #F8FAFC; border-radius: 14px; padding: 18px 22px;
      border-left: 6px solid #10B981; display: flex; flex-direction: column; gap: 8px;
    }
    .slack-card.bad { background: #FEF2F2; color: #7F1D1D; border: 2px solid #FCA5A5; border-left: 6px solid #EF4444; }
    .pts { list-style: none; display: flex; flex-direction: column; gap: 8px; font-size: 14.5px; line-height: 1.4; }
    .pts li { padding-left: 18px; position: relative; }
    .pts li::before { content: "▸"; position: absolute; left: 0; font-weight: 800; }
    .inline-code { background: #E0E7FF; color: #1E1B4B; }
    .slack-card .inline-code { background: #1E293B; color: #38BDF8; }
    .kpi-strip { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; }
    .ks-item {
      background: #1E1B4B; color: #FFFFFF; border-radius: 12px; padding: 14px 18px;
    }
    .ks-l { font-family: 'IBM Plex Mono', monospace; font-size: 11px; color: #A5B4FC; }
    .ks-v { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 25px; font-weight: 800; color: #34D399; margin: 2px 0; }
    .ks-s { font-size: 12px; color: #E0E7FF; }
    .footer {
      display: flex; justify-content: space-between; font-family: 'IBM Plex Mono', monospace;
      font-size: 13px; font-weight: 700; color: #1E1B4B;
    }
  </style></head><body>
    <div class="indigo-hero">
      <div class="ih-top">
        <div>${logoForDarkBg}</div>
        <span style="font-family:'IBM Plex Mono',monospace;font-size:12.5px;background:#4F46E5;padding:5px 12px;border-radius:6px;">CDC & LEDGER STATE · ${spec.doc_id}</span>
      </div>
      <div class="eyebrow">${spec.eyebrow}</div>
      <h1>${spec.headline}</h1>
      <div class="subhead">${spec.subhead}</div>
    </div>
    <div class="db-workspace">
      <div class="db-table-card">
        <div style="display:flex;justify-content:space-between;align-items:center;">
          <span style="font-family:'Plus Jakarta Sans',sans-serif;font-size:18px;font-weight:800;">✓ ${spec.after_title}</span>
          <span style="font-family:'IBM Plex Mono',monospace;font-size:12px;background:#DCFCE7;color:#15803D;padding:4px 10px;border-radius:6px;font-weight:700;">${spec.after_badge}</span>
        </div>
        <table class="db-grid">
          <thead><tr><th>STAGE</th><th>PIPELINE NODE</th><th>INVARIANT CHECK</th><th>STATUS</th></tr></thead>
          <tbody>
            ${spec.after_nodes.map((n, i) => `
              <tr>
                <td>0${i + 1}</td>
                <td>${n}</td>
                <td>sha256_state_verified</td>
                <td><span class="status-ok">COMMITTED</span></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        <ul class="pts">
          ${spec.after_points.map(pt => `<li>${pt}</li>`).join('')}
        </ul>
      </div>
      <div class="slack-stack">
        <div class="slack-card bad">
          <div style="font-family:'IBM Plex Mono',monospace;font-size:12px;font-weight:700;">✕ REPLACED LEGACY PIPELINE (${spec.before_badge})</div>
          <div style="font-family:'Plus Jakarta Sans',sans-serif;font-size:18px;font-weight:800;">${spec.before_title}</div>
          <ul class="pts">${spec.before_points.map(pt => `<li>${pt}</li>`).join('')}</ul>
        </div>
        <div class="slack-card">
          <div style="display:flex;justify-content:space-between;align-items:center;font-family:'IBM Plex Mono',monospace;font-size:12px;color:#34D399;">
            <span>#revops-production-telemetry · BOT</span>
            <span style="background:#064E3B;color:#6EE7B7;padding:2px 8px;border-radius:4px;">HTTP 200 OK · 420ms</span>
          </div>
          <div style="font-size:14.5px;line-height:1.4;color:#E2E8F0;">
            <strong>CDC Batch Committed:</strong> ${spec.metrics[0].label} = <span style="color:#34D399;font-weight:700;">${spec.metrics[0].value}</span> (${spec.metrics[0].sub}) · ${spec.metrics[1].label}: <span style="color:#38BDF8;font-weight:700;">${spec.metrics[1].value}</span>
          </div>
          <div style="background:#020617;border:1px solid #1E293B;border-radius:8px;padding:10px 14px;font-family:'IBM Plex Mono',monospace;font-size:12px;color:#94A3B8;">
            {"cursor": "watermark_tx_91842", "unchanged_skipped": "97.4%", "rate_limit_429": 0}
          </div>
        </div>
      </div>
    </div>
    <div class="kpi-strip">
      ${spec.metrics.map(m => `
        <div class="ks-item">
          <div class="ks-l">${m.label}</div>
          <div class="ks-v">${m.value}</div>
          <div class="ks-s">${m.sub}</div>
        </div>
      `).join('')}
    </div>
    <div class="footer">
      <div>OLVEN TECH · DATA & REVOPS INFRASTRUCTURE</div>
      <div>contact@olventech.com</div>
    </div>
  </body></html>`;
}

/**
 * ARCHETYPE 6: Warm Terracotta & Sand Split + Financial Reconciliation Balance Sheet
 */
function renderCdcHashDiffFunnel(spec, p) {
  const isWide = p.layout === 'landscape' || p.layout === 'landscape-tall';

  return `<!DOCTYPE html><html><head><meta charset="utf-8"/><style>
    ${baseFontsCss()}
    body {
      width: ${p.width}px; height: ${p.height}px;
      background: #FFFBEB; color: #1C1917;
      font-family: 'Inter', sans-serif;
      padding: ${isWide ? '38px 48px' : '46px 50px'};
      display: flex; flex-direction: column; gap: 18px;
    }
    .terracotta-top {
      background: #7C2D12; color: #FFF7ED; border-radius: 16px;
      padding: ${isWide ? '22px 28px' : '26px 32px'};
      border-bottom: 6px solid #EA580C;
    }
    .tt-bar {
      display: flex; justify-content: space-between; align-items: center;
      border-bottom: 1px solid rgba(254, 215, 170, 0.25); padding-bottom: 12px; margin-bottom: 12px;
    }
    .eyebrow { font-family: 'IBM Plex Mono', monospace; font-size: 13px; color: #FDBA74; letter-spacing: 0.08em; margin-bottom: 6px; font-weight: 700; }
    h1 { font-family: 'Plus Jakarta Sans', sans-serif; font-size: ${isWide ? '35px' : '40px'}; font-weight: 800; line-height: 1.1; }
    .subhead { margin-top: 8px; font-size: 16.5px; color: #FFEDD5; line-height: 1.4; }
    .audit-body {
      flex: 1; display: grid; grid-template-columns: ${isWide ? '1fr 1fr' : '1fr'}; gap: 16px;
    }
    .audit-sheet {
      background: #FFFFFF; border: 2.5px solid #1C1917; border-radius: 14px; padding: 20px 24px;
      box-shadow: 6px 6px 0px #EA580C; display: flex; flex-direction: column; gap: 14px;
    }
    .audit-sheet.dark {
      background: #1C1917; color: #FAF8F5; box-shadow: 6px 6px 0px #16A34A;
    }
    .flow-steps { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; }
    .fs-box {
      padding: 9px 10px; border-radius: 6px; font-family: 'IBM Plex Mono', monospace; font-size: 12px; font-weight: 700;
      background: #FEF2F2; border: 1.5px solid #EF4444; color: #991B1B;
    }
    .audit-sheet.dark .fs-box { background: #292524; border-color: #22C55E; color: #86EFAC; }
    .ledger-mini {
      width: 100%; border-collapse: collapse; font-family: 'IBM Plex Mono', monospace; font-size: 12px;
      background: #292524; border-radius: 8px; overflow: hidden;
    }
    .ledger-mini th { background: #44403C; color: #FDBA74; text-align: left; padding: 7px 12px; }
    .ledger-mini td { padding: 7px 12px; border-bottom: 1px solid #44403C; color: #E7E5E4; }
    .pts { list-style: none; display: flex; flex-direction: column; gap: 9px; font-size: 14.8px; line-height: 1.42; }
    .pts li { padding-left: 20px; position: relative; }
    .pts li::before { content: "•"; position: absolute; left: 2px; color: #EA580C; font-weight: 800; }
    .audit-sheet.dark .pts li::before { content: "✓"; color: #22C55E; }
    .inline-code { background: #FFEDD5; color: #9A3412; }
    .audit-sheet.dark .inline-code { background: #292524; color: #FDBA74; }
    .kpi-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; }
    .kr-box {
      background: #1C1917; color: #FFFBEB; border-radius: 10px; padding: 13px 16px; border-top: 4px solid #EA580C;
    }
    .kr-l { font-family: 'IBM Plex Mono', monospace; font-size: 11px; color: #FDBA74; }
    .kr-v { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 24px; font-weight: 800; margin: 2px 0; }
    .kr-s { font-size: 12px; color: #4ADE80; }
    .footer {
      display: flex; justify-content: space-between; font-family: 'IBM Plex Mono', monospace;
      font-size: 13px; font-weight: 700; color: #7C2D12;
    }
  </style></head><body>
    <div class="terracotta-top">
      <div class="tt-bar">
        <div>${logoForDarkBg}</div>
        <span style="font-family:'IBM Plex Mono',monospace;font-size:12.5px;background:#EA580C;padding:5px 12px;border-radius:6px;font-weight:700;">EXECUTIVE AUDIT · ${spec.doc_id}</span>
      </div>
      <div class="eyebrow">${spec.eyebrow}</div>
      <h1>${spec.headline}</h1>
      <div class="subhead">${spec.subhead}</div>
    </div>
    <div class="audit-body">
      <div class="audit-sheet">
        <div style="display:flex;justify-content:space-between;align-items:center;">
          <span style="font-family:'Plus Jakarta Sans',sans-serif;font-size:19px;font-weight:800;color:#991B1B;">✕ ${spec.before_title}</span>
          <span style="font-family:'IBM Plex Mono',monospace;font-size:12px;background:#FEE2E2;color:#B91C1C;padding:4px 10px;border-radius:6px;font-weight:700;">${spec.before_badge}</span>
        </div>
        <div class="flow-steps">${spec.before_nodes.map(n => `<div class="fs-box">${n}</div>`).join('')}</div>
        <ul class="pts">${spec.before_points.map(pt => `<li>${pt}</li>`).join('')}</ul>
      </div>
      <div class="audit-sheet dark">
        <div style="display:flex;justify-content:space-between;align-items:center;">
          <span style="font-family:'Plus Jakarta Sans',sans-serif;font-size:19px;font-weight:800;color:#86EFAC;">✓ ${spec.after_title}</span>
          <span style="font-family:'IBM Plex Mono',monospace;font-size:12px;background:#14532D;color:#86EFAC;padding:4px 10px;border-radius:6px;font-weight:700;">${spec.after_badge}</span>
        </div>
        <div class="flow-steps">${spec.after_nodes.map(n => `<div class="fs-box">${n}</div>`).join('')}</div>
        <table class="ledger-mini">
          <thead><tr><th>JOURNAL ENTRY</th><th>INVARIANT</th><th>RECONCILED</th></tr></thead>
          <tbody>
            <tr><td>payout_batch_cursor_tx</td><td>gross - fee - fx == net_wire</td><td style="color:#4ADE80;font-weight:700;">$0.00 DRIFT</td></tr>
          </tbody>
        </table>
        <ul class="pts">${spec.after_points.map(pt => `<li>${pt}</li>`).join('')}</ul>
      </div>
    </div>
    <div class="kpi-row">
      ${spec.metrics.map(m => `
        <div class="kr-box">
          <div class="kr-l">${m.label}</div>
          <div class="kr-v">${m.value}</div>
          <div class="kr-s">${m.sub}</div>
        </div>
      `).join('')}
    </div>
    <div class="footer">
      <div>OLVEN TECH · FINANCIAL & INVENTORY LEDGER ENGINEERING</div>
      <div>contact@olventech.com</div>
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
      return renderEditorialLightBlueprint(spec, platform);
    case 'security_policy_shield_matrix':
      return renderSecurityPolicyShieldMatrix(spec, platform);
    case 'circuit_breaker_state_machine':
      return renderCircuitBreakerStateMachine(spec, platform);
    case 'split_latency_waterfall':
      return renderSplitLatencyWaterfall(spec, platform);
    case 'revenue_ledger_reconciliation':
      return renderRevenueLedgerReconciliation(spec, platform);
    case 'cdc_hash_diff_funnel':
    default:
      return renderCdcHashDiffFunnel(spec, platform);
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

  const browser = await chromium.launch({
    executablePath: '/usr/bin/chromium',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  for (const p of PLATFORMS) {
    const context = await browser.newContext({
      viewport: { width: p.width, height: p.height },
      deviceScaleFactor: 2
    });
    const page = await context.newPage();
    await page.setContent(buildHtml(spec, p), { waitUntil: 'networkidle' });
    const outPath = path.join(outDir, p.name);
    await page.screenshot({ path: outPath, type: 'png' });
    await context.close();
    console.log(`Rendered ${outPath} [archetype=${chosenArchetype}] (${p.width * 2}x${p.height * 2})`);
  }

  await browser.close();
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
