#!/usr/bin/env node
/**
 * Olven Tech — Studio-Grade 9:16 (1080x1920) 30fps Reels Motion Renderer
 *
 * Programmatically renders 5 bespoke vertical storyboard beats using Playwright,
 * embedded studio WOFF2 fonts (Plus Jakarta Sans, Inter, IBM Plex Mono), and the
 * authentic Olven vector SVG logo, then stitches them via ffmpeg xfade transitions
 * into a Meta Reels-compliant MP4 (H.264 High, yuv420p, 30fps, GOP 60, +faststart,
 * stereo 48kHz AAC audio track).
 */
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const PLAYWRIGHT_PATH = fs.existsSync(path.join(__dirname, 'node_modules/playwright-core'))
  ? path.join(__dirname, 'node_modules/playwright-core')
  : '/home/antigravity/.npm/_npx/e41f203b7505f1fb/node_modules/playwright-core';
const { chromium } = require(PLAYWRIGHT_PATH);

const ASSETS_DIR = path.join(__dirname, 'assets');
const b64Font = (file) => fs.readFileSync(path.join(ASSETS_DIR, file)).toString('base64');

const rawLogo = fs.readFileSync(path.join(ASSETS_DIR, 'horizontal_dark.svg'), 'utf8')
  .replace(/<\?xml[\s\S]*?\?>/g, '');

const logoForDarkBg = (h = 40) => rawLogo.replace(
  /<svg\b([^>]*)>/,
  `<svg $1 style="height:${h}px; width:auto; display:block;">`
);

const logoForLightBg = (h = 40) => rawLogo.replace(
  /<svg\b([^>]*)>/,
  `<svg $1 style="height:${h}px; width:auto; display:block; filter: invert(0.92) hue-rotate(180deg) contrast(1.25);">`
);

const THEME_PALETTES = {
  editorial_light_blueprint: {
    isLight: true,
    bg: '#F4EFE6',
    bgGrad: 'radial-gradient(circle at 85% 12%, rgba(29,78,216,0.10), transparent 52%), #F4EFE6',
    gridColor: 'rgba(15,23,42,0.055)',
    text: '#0F172A',
    sub: '#334155',
    panel: '#FFFFFF',
    panelAlt: '#0B0F19',
    panelAltText: '#F8FAFC',
    border: '#0F172A',
    accent: '#1D4ED8',
    accentSoft: 'rgba(29,78,216,0.12)',
    badBg: 'rgba(220,38,38,0.10)',
    badBorder: '#DC2626',
    badText: '#B91C1C',
    goodBg: 'rgba(5,150,105,0.10)',
    goodBorder: '#059669',
    goodText: '#047857',
    codeBg: '#E2E8F0',
    codeText: '#0F172A',
    heroCardBg: '#1D4ED8',
    heroCardText: '#FFFFFF',
    heroCardSub: '#FEF08A',
  },
  security_policy_shield_matrix: {
    isLight: false,
    bg: '#061410',
    bgGrad: 'radial-gradient(circle at 80% 15%, rgba(16,185,129,0.18), transparent 50%), #061410',
    gridColor: 'rgba(52,211,153,0.06)',
    text: '#ECFDF5',
    sub: '#A7F3D0',
    panel: '#0B211A',
    panelAlt: '#040E0B',
    panelAltText: '#ECFDF5',
    border: '#10B981',
    accent: '#34D399',
    accentSoft: 'rgba(52,211,153,0.14)',
    badBg: 'rgba(239,68,68,0.14)',
    badBorder: '#EF4444',
    badText: '#FCA5A5',
    goodBg: 'rgba(16,185,129,0.16)',
    goodBorder: '#10B981',
    goodText: '#6EE7B7',
    codeBg: '#042F2E',
    codeText: '#6EE7B7',
    heroCardBg: '#064E3B',
    heroCardText: '#ECFDF5',
    heroCardSub: '#6EE7B7',
  },
  circuit_breaker_state_machine: {
    isLight: true,
    bg: '#EEF2F6',
    bgGrad: 'radial-gradient(circle at 85% 15%, rgba(13,148,136,0.12), transparent 52%), #EEF2F6',
    gridColor: 'rgba(15,23,42,0.05)',
    text: '#0F172A',
    sub: '#334155',
    panel: '#FFFFFF',
    panelAlt: '#0B132B',
    panelAltText: '#F8FAFC',
    border: '#CBD5E1',
    accent: '#0D9488',
    accentSoft: 'rgba(13,148,136,0.12)',
    badBg: 'rgba(220,38,38,0.09)',
    badBorder: '#DC2626',
    badText: '#B91C1C',
    goodBg: 'rgba(13,148,136,0.10)',
    goodBorder: '#0D9488',
    goodText: '#0F766E',
    codeBg: '#E2E8F0',
    codeText: '#0F172A',
    heroCardBg: '#0B132B',
    heroCardText: '#FFFFFF',
    heroCardSub: '#5EEAD4',
  },
  split_latency_waterfall: {
    isLight: false,
    bg: '#080B14',
    bgGrad: 'radial-gradient(circle at 85% 12%, rgba(245,158,11,0.16), transparent 48%), radial-gradient(circle at 15% 82%, rgba(16,185,129,0.12), transparent 45%), #080B14',
    gridColor: 'rgba(148,163,184,0.06)',
    text: '#F8FAFC',
    sub: '#CBD5E1',
    panel: '#101728',
    panelAlt: '#0B101D',
    panelAltText: '#F8FAFC',
    border: '#1E293B',
    accent: '#F59E0B',
    accentSoft: 'rgba(245,158,11,0.15)',
    badBg: 'rgba(244,63,94,0.15)',
    badBorder: '#F43F5E',
    badText: '#FDA4AF',
    goodBg: 'rgba(16,185,129,0.16)',
    goodBorder: '#10B981',
    goodText: '#6EE7B7',
    codeBg: '#1E293B',
    codeText: '#FDE68A',
    heroCardBg: '#141D33',
    heroCardText: '#FFFFFF',
    heroCardSub: '#34D399',
  },
  revenue_ledger_reconciliation: {
    isLight: false,
    bg: '#0A0E24',
    bgGrad: 'radial-gradient(circle at 80% 14%, rgba(129,140,248,0.20), transparent 50%), #0A0E24',
    gridColor: 'rgba(129,140,248,0.06)',
    text: '#F8FAFC',
    sub: '#CBD5E1',
    panel: '#13193A',
    panelAlt: '#0F1430',
    panelAltText: '#F8FAFC',
    border: '#4F46E5',
    accent: '#818CF8',
    accentSoft: 'rgba(129,140,248,0.16)',
    badBg: 'rgba(239,68,68,0.15)',
    badBorder: '#EF4444',
    badText: '#FCA5A5',
    goodBg: 'rgba(16,185,129,0.16)',
    goodBorder: '#10B981',
    goodText: '#6EE7B7',
    codeBg: '#1E2552',
    codeText: '#C7D2FE',
    heroCardBg: '#312E81',
    heroCardText: '#FFFFFF',
    heroCardSub: '#A5B4FC',
  },
  cdc_hash_diff_funnel: {
    isLight: false,
    bg: '#14100E',
    bgGrad: 'radial-gradient(circle at 85% 15%, rgba(234,88,12,0.18), transparent 50%), #14100E',
    gridColor: 'rgba(251,146,60,0.055)',
    text: '#FAF8F5',
    sub: '#D6D3D1',
    panel: '#1F1916',
    panelAlt: '#171210',
    panelAltText: '#FAF8F5',
    border: '#44403C',
    accent: '#FB923C',
    accentSoft: 'rgba(251,146,60,0.15)',
    badBg: 'rgba(239,68,68,0.15)',
    badBorder: '#EF4444',
    badText: '#FCA5A5',
    goodBg: 'rgba(56,189,248,0.15)',
    goodBorder: '#38BDF8',
    goodText: '#7DD3FC',
    codeBg: '#292524',
    codeText: '#FDBA74',
    heroCardBg: '#7C2D12',
    heroCardText: '#FFF7ED',
    heroCardSub: '#FED7AA',
  }
};

function baseFontsCss(pal) {
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
    body {
      width: 1080px; height: 1920px;
      background: ${pal.bgGrad};
      color: ${pal.text};
      font-family: 'Inter', -apple-system, sans-serif;
      /* Meta Reels Safe Zone: top 165px, bottom 260px, right 108px, left 64px */
      padding: 165px 108px 260px 64px;
      display: flex; flex-direction: column; justify-content: space-between;
      position: relative; overflow: hidden;
    }
    .grid-bg {
      position: absolute; inset: 0; pointer-events: none;
      background-image:
        linear-gradient(to right, ${pal.gridColor} 1px, transparent 1px),
        linear-gradient(to bottom, ${pal.gridColor} 1px, transparent 1px);
      background-size: 48px 48px;
    }
    .progress-track {
      position: absolute; top: 112px; left: 64px; right: 108px;
      display: grid; grid-template-columns: repeat(5, 1fr); gap: 10px; z-index: 10;
    }
    .prog-seg {
      height: 6px; border-radius: 999px;
      background: ${pal.isLight ? 'rgba(15,23,42,0.14)' : 'rgba(255,255,255,0.16)'};
    }
    .prog-seg.done { background: ${pal.accent}; }
    .content {
      position: relative; z-index: 2;
      display: flex; flex-direction: column; flex: 1; justify-content: space-between;
    }
    .header {
      display: flex; justify-content: space-between; align-items: center;
      padding-bottom: 22px; border-bottom: 2px solid ${pal.border};
    }
    .step-pill {
      font-family: 'IBM Plex Mono', monospace; font-size: 16px; font-weight: 700;
      padding: 8px 16px; border-radius: 8px;
      background: ${pal.accentSoft}; color: ${pal.accent};
      border: 1.5px solid ${pal.accent};
    }
    .eyebrow {
      font-family: 'IBM Plex Mono', monospace; font-size: 18px; font-weight: 700;
      letter-spacing: 0.09em; text-transform: uppercase; color: ${pal.accent};
    }
    .inline-code {
      font-family: 'IBM Plex Mono', monospace; font-size: 0.9em; font-weight: 600;
      background: ${pal.codeBg}; color: ${pal.codeText};
      padding: 3px 9px; border-radius: 6px;
    }
    .footer-bar {
      display: flex; justify-content: space-between; align-items: center;
      padding-top: 20px; border-top: 2px solid ${pal.border};
      font-family: 'IBM Plex Mono', monospace; font-size: 17px; font-weight: 700;
      color: ${pal.sub};
    }
  `;
}

function progressHtml(stepIdx) {
  return `<div class="progress-track">${[0, 1, 2, 3, 4]
    .map((i) => `<div class="prog-seg ${i <= stepIdx ? 'done' : ''}"></div>`)
    .join('')}</div>`;
}

function renderBeat1Cover(spec, pal, logo) {
  const m0 = spec.metrics[0];
  const m1 = spec.metrics[1];
  const headlineSize = spec.headline.length > 74 ? 54 : spec.headline.length > 58 ? 60 : 66;
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><style>
    ${baseFontsCss(pal)}
    .hero-block { display: flex; flex-direction: column; gap: 28px; margin-top: 24px; }
    h1 {
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-size: ${headlineSize}px; line-height: 1.08; font-weight: 800;
      letter-spacing: -0.03em; color: ${pal.text};
    }
    .subhead {
      font-size: 26px; line-height: 1.44; color: ${pal.sub}; font-weight: 500;
    }
    .impact-card {
      background: ${pal.heroCardBg}; color: ${pal.heroCardText};
      border: 2.5px solid ${pal.accent}; border-radius: 22px;
      padding: 36px 38px;
      display: flex; flex-direction: column; gap: 16px;
      box-shadow: 0 24px 50px rgba(0,0,0,0.28);
    }
    .ic-top {
      display: flex; justify-content: space-between; align-items: center;
      font-family: 'IBM Plex Mono', monospace; font-size: 17px; font-weight: 700;
      letter-spacing: 0.08em; opacity: 0.9;
    }
    .ic-num {
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-size: 104px; line-height: 0.96; font-weight: 800; letter-spacing: -0.04em;
    }
    .ic-sub {
      font-family: 'IBM Plex Mono', monospace; font-size: 21px; font-weight: 700;
      color: ${pal.heroCardSub};
    }
    .pill-row {
      display: grid; grid-template-columns: 1fr 1fr; gap: 18px;
    }
    .mini-pill {
      background: ${pal.panel}; border: 2px solid ${pal.border}; border-radius: 16px;
      padding: 20px 24px;
    }
    .mp-lbl { font-family: 'IBM Plex Mono', monospace; font-size: 14px; font-weight: 700; color: ${pal.sub}; }
    .mp-val { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 32px; font-weight: 800; color: ${pal.text}; margin-top: 6px; }
    .watch-cue {
      display: inline-flex; align-items: center; gap: 12px;
      font-family: 'IBM Plex Mono', monospace; font-size: 18px; font-weight: 700;
      color: ${pal.accent};
    }
  </style></head><body>
    <div class="grid-bg"></div>
    ${progressHtml(0)}
    <div class="content">
      <div class="header">
        <div>${logo}</div>
        <div class="step-pill">ARCHITECTURE REEL · 01/05</div>
      </div>

      <div class="hero-block">
        <div class="eyebrow">${spec.eyebrow}</div>
        <h1>${spec.headline}</h1>
        <div class="subhead">${spec.subhead}</div>
      </div>

      <div class="impact-card">
        <div class="ic-top">
          <span>${m0.label}</span>
          <span>PRODUCTION VERIFIED</span>
        </div>
        <div class="ic-num">${m0.value}</div>
        <div class="ic-sub">▲ ${m0.sub}</div>
      </div>

      <div class="pill-row">
        <div class="mini-pill">
          <div class="mp-lbl">FAILURE MODE</div>
          <div class="mp-val" style="color:${pal.badText};">${spec.before_badge}</div>
        </div>
        <div class="mini-pill">
          <div class="mp-lbl">${m1.label}</div>
          <div class="mp-val" style="color:${pal.goodText};">${m1.value}</div>
        </div>
      </div>

      <div class="footer-bar">
        <div class="watch-cue">▶ 14s ARCHITECTURE BREAKDOWN</div>
        <div>olventech.com</div>
      </div>
    </div>
  </body></html>`;
}

function renderBeatTopology(spec, pal, logo, mode) {
  const isBefore = mode === 'before';
  const stepIdx = isBefore ? 1 : 2;
  const title = isBefore ? spec.before_title : spec.after_title;
  const badge = isBefore ? spec.before_badge : spec.after_badge;
  const nodes = isBefore ? spec.before_nodes : spec.after_nodes;
  const points = isBefore ? spec.before_points : spec.after_points;
  const toneBorder = isBefore ? pal.badBorder : pal.goodBorder;
  const toneBg = isBefore ? pal.badBg : pal.goodBg;
  const toneText = isBefore ? pal.badText : pal.goodText;
  const tagLabel = isBefore ? 'STEP 02/05 · WHY IT FAILS' : 'STEP 03/05 · PRODUCTION FIX';
  const nodeIcon = isBefore ? '✕' : '✓';

  return `<!DOCTYPE html><html><head><meta charset="utf-8"><style>
    ${baseFontsCss(pal)}
    .title-wrap { display: flex; flex-direction: column; gap: 16px; margin-top: 12px; }
    .status-badge {
      align-self: flex-start;
      font-family: 'IBM Plex Mono', monospace; font-size: 20px; font-weight: 700;
      padding: 10px 20px; border-radius: 10px;
      background: ${toneBg}; color: ${toneText}; border: 2px solid ${toneBorder};
    }
    h2 {
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-size: 50px; line-height: 1.1; font-weight: 800; letter-spacing: -0.025em;
    }
    .pipeline {
      display: flex; flex-direction: column; gap: 10px;
      background: ${pal.panel}; border: 2.5px solid ${toneBorder}; border-radius: 22px;
      padding: 28px 30px;
    }
    .pipe-label {
      font-family: 'IBM Plex Mono', monospace; font-size: 15px; font-weight: 700;
      color: ${toneText}; letter-spacing: 0.08em; margin-bottom: 6px;
    }
    .node-row {
      display: flex; align-items: center; gap: 18px;
      background: ${toneBg}; border: 1.5px solid ${toneBorder}; border-radius: 14px;
      padding: 18px 22px;
    }
    .node-idx {
      width: 44px; height: 44px; border-radius: 10px; flex-shrink: 0;
      background: ${toneBorder}; color: #FFFFFF;
      display: flex; align-items: center; justify-content: center;
      font-family: 'IBM Plex Mono', monospace; font-size: 20px; font-weight: 700;
    }
    .node-name {
      font-family: 'Plus Jakarta Sans', sans-serif; font-size: 25px; font-weight: 700; color: ${pal.text};
    }
    .node-arrow {
      margin-left: 36px; font-family: 'IBM Plex Mono', monospace;
      font-size: 22px; font-weight: 700; color: ${toneBorder}; line-height: 1;
    }
    .bullets {
      display: flex; flex-direction: column; gap: 16px;
    }
    .bullet-card {
      background: ${pal.panel}; border-left: 6px solid ${toneBorder};
      border-top: 1px solid ${pal.border}; border-right: 1px solid ${pal.border}; border-bottom: 1px solid ${pal.border};
      border-radius: 12px; padding: 20px 24px;
      font-size: 23px; line-height: 1.42; color: ${pal.text}; font-weight: 500;
    }
  </style></head><body>
    <div class="grid-bg"></div>
    ${progressHtml(stepIdx)}
    <div class="content">
      <div class="header">
        <div>${logo}</div>
        <div class="step-pill">${tagLabel}</div>
      </div>

      <div class="title-wrap">
        <div class="status-badge">${nodeIcon} ${badge}</div>
        <h2>${title}</h2>
      </div>

      <div class="pipeline">
        <div class="pipe-label">${isBefore ? 'BROKEN EXECUTION PATH' : 'HARDENED EXECUTION PATH'}</div>
        ${nodes.map((n, idx) => `
          <div class="node-row">
            <div class="node-idx">0${idx + 1}</div>
            <div class="node-name">${n}</div>
          </div>
          ${idx < nodes.length - 1 ? '<div class="node-arrow">↓</div>' : ''}
        `).join('')}
      </div>

      <div class="bullets">
        ${points.map((pt) => `<div class="bullet-card">${pt}</div>`).join('')}
      </div>

      <div class="footer-bar">
        <div>${spec.doc_id.split('·')[0].trim()}</div>
        <div>olventech.com</div>
      </div>
    </div>
  </body></html>`;
}

function renderBeat4Metrics(spec, pal, logo) {
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><style>
    ${baseFontsCss(pal)}
    .title-wrap { display: flex; flex-direction: column; gap: 14px; }
    h2 {
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-size: 54px; line-height: 1.08; font-weight: 800; letter-spacing: -0.03em;
    }
    .delta-banner {
      display: grid; grid-template-columns: 1fr auto 1fr; align-items: center; gap: 16px;
      background: ${pal.panel}; border: 2px solid ${pal.border}; border-radius: 18px;
      padding: 24px 28px;
    }
    .db-side { display: flex; flex-direction: column; gap: 6px; }
    .db-lbl { font-family: 'IBM Plex Mono', monospace; font-size: 14px; font-weight: 700; color: ${pal.sub}; }
    .db-val { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 27px; font-weight: 800; }
    .db-arrow { font-family: 'IBM Plex Mono', monospace; font-size: 32px; font-weight: 800; color: ${pal.accent}; }
    .bento {
      display: grid; grid-template-columns: 1fr 1fr; gap: 22px;
    }
    .kpi-card {
      background: ${pal.panel}; border: 2.5px solid ${pal.border}; border-radius: 22px;
      padding: 34px 30px; display: flex; flex-direction: column; justify-content: space-between;
      min-height: 310px;
    }
    .kpi-card.primary {
      background: ${pal.heroCardBg}; color: ${pal.heroCardText}; border-color: ${pal.accent};
    }
    .k-lbl { font-family: 'IBM Plex Mono', monospace; font-size: 16px; font-weight: 700; opacity: 0.85; }
    .k-val {
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-size: 62px; line-height: 1.02; font-weight: 800; letter-spacing: -0.03em;
      color: ${pal.accent}; margin: 18px 0;
    }
    .kpi-card.primary .k-val { color: ${pal.heroCardText}; }
    .k-sub { font-size: 21px; line-height: 1.35; font-weight: 600; color: ${pal.goodText}; }
    .kpi-card.primary .k-sub { color: ${pal.heroCardSub}; }
  </style></head><body>
    <div class="grid-bg"></div>
    ${progressHtml(3)}
    <div class="content">
      <div class="header">
        <div>${logo}</div>
        <div class="step-pill">STEP 04/05 · VERIFIED TELEMETRY</div>
      </div>

      <div class="title-wrap">
        <div class="eyebrow">MEASURED IN PRODUCTION</div>
        <h2>Before vs. After Engineering Impact</h2>
      </div>

      <div class="delta-banner">
        <div class="db-side">
          <div class="db-lbl">BEFORE</div>
          <div class="db-val" style="color:${pal.badText};">${spec.before_badge}</div>
        </div>
        <div class="db-arrow">→</div>
        <div class="db-side" style="text-align:right;">
          <div class="db-lbl">AFTER</div>
          <div class="db-val" style="color:${pal.goodText};">${spec.after_badge}</div>
        </div>
      </div>

      <div class="bento">
        ${spec.metrics.slice(0, 4).map((m, idx) => `
          <div class="kpi-card ${idx === 0 ? 'primary' : ''}">
            <div class="k-lbl">${m.label}</div>
            <div class="k-val">${m.value}</div>
            <div class="k-sub">${m.sub}</div>
          </div>
        `).join('')}
      </div>

      <div class="footer-bar">
        <div>${spec.eyebrow.split('·')[0].trim()}</div>
        <div>olventech.com</div>
      </div>
    </div>
  </body></html>`;
}

function renderBeat5Cta(spec, pal, logoLarge) {
  const m0 = spec.metrics[0];
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><style>
    ${baseFontsCss(pal)}
    .cta-center {
      flex: 1; display: flex; flex-direction: column; justify-content: center; gap: 36px;
    }
    .logo-wrap { margin-bottom: 8px; }
    h2 {
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-size: 62px; line-height: 1.08; font-weight: 800; letter-spacing: -0.03em;
    }
    .recap {
      font-size: 27px; line-height: 1.45; color: ${pal.sub}; font-weight: 500;
    }
    .contact-card {
      background: ${pal.heroCardBg}; color: ${pal.heroCardText};
      border: 2.5px solid ${pal.accent}; border-radius: 24px;
      padding: 40px 42px; display: flex; flex-direction: column; gap: 18px;
    }
    .cc-eyebrow {
      font-family: 'IBM Plex Mono', monospace; font-size: 17px; font-weight: 700;
      color: ${pal.heroCardSub}; letter-spacing: 0.08em;
    }
    .cc-email {
      font-family: 'Plus Jakarta Sans', sans-serif; font-size: 46px; font-weight: 800;
      letter-spacing: -0.02em;
    }
    .cc-url {
      font-family: 'IBM Plex Mono', monospace; font-size: 23px; opacity: 0.9;
    }
    .save-strip {
      display: flex; justify-content: space-between; align-items: center;
      background: ${pal.panel}; border: 2px solid ${pal.border}; border-radius: 16px;
      padding: 22px 28px; font-family: 'IBM Plex Mono', monospace; font-size: 19px; font-weight: 700;
    }
  </style></head><body>
    <div class="grid-bg"></div>
    ${progressHtml(4)}
    <div class="content">
      <div class="header">
        <div class="eyebrow">OLVEN TECH · PRODUCTION ARCHITECTURE</div>
        <div class="step-pill">05/05 · SUMMARY</div>
      </div>

      <div class="cta-center">
        <div class="logo-wrap">${logoLarge}</div>
        <h2>Verified Production Architecture.</h2>
        <div class="recap">${spec.headline} — verified at <strong style="color:${pal.accent};">${m0.value}</strong> (${m0.sub}).</div>

        <div class="contact-card">
          <div class="cc-eyebrow">ARCHITECTURE AUDIT & PRODUCTION ENGINEERING</div>
          <div class="cc-email">contact@olventech.com</div>
          <div class="cc-url">olventech.com · Full teardown in caption ↓</div>
        </div>

        <div class="save-strip">
          <span>🔖 SAVE FOR YOUR ENGINEERING TEAM</span>
          <span style="color:${pal.accent};">→</span>
        </div>
      </div>

      <div class="footer-bar">
        <div>${spec.doc_id}</div>
        <div>@olventech</div>
      </div>
    </div>
  </body></html>`;
}

async function renderWalkthroughVideo(specPath, outDir) {
  const spec = JSON.parse(fs.readFileSync(specPath, 'utf8'));
  const arch = spec.visual_archetype || 'editorial_light_blueprint';
  const pal = THEME_PALETTES[arch] || THEME_PALETTES.editorial_light_blueprint;
  const logo = pal.isLight ? logoForLightBg(38) : logoForDarkBg(38);
  const logoLarge = pal.isLight ? logoForLightBg(58) : logoForDarkBg(58);

  const framesDir = path.join(outDir, '_video_frames');
  fs.mkdirSync(framesDir, { recursive: true });

  const launchOpts = { args: ['--no-sandbox', '--disable-setuid-sandbox'] };
  const chromeBin = ['/usr/bin/chromium', '/usr/bin/chromium-browser', '/usr/bin/google-chrome'].find((p) => fs.existsSync(p));
  if (chromeBin) {
    launchOpts.executablePath = chromeBin;
  }
  const browser = await chromium.launch(launchOpts);
  const context = await browser.newContext({
    viewport: { width: 1080, height: 1920 },
    deviceScaleFactor: 1
  });
  const page = await context.newPage();

  const scenes = [
    renderBeat1Cover(spec, pal, logo),
    renderBeatTopology(spec, pal, logo, 'before'),
    renderBeatTopology(spec, pal, logo, 'after'),
    renderBeat4Metrics(spec, pal, logo),
    renderBeat5Cta(spec, pal, logoLarge),
  ];

  for (let i = 0; i < scenes.length; i++) {
    await page.setContent(scenes[i], { waitUntil: 'load' });
    await page.evaluate(() => document.fonts.ready);
    const frameFile = path.join(framesDir, `beat_${String(i).padStart(2, '0')}.png`);
    await page.screenshot({ path: frameFile, type: 'png' });
  }
  await browser.close();

  // Stitch 5 beats with smooth 0.4s xfade transitions at 30fps + mandatory stereo 48kHz AAC audio track.
  // Beat durations: 3.0s, 3.3s, 3.5s, 3.2s, 2.8s -> with 4 x 0.4s xfades = 14.2s total runtime.
  const durations = [3.0, 3.3, 3.5, 3.2, 2.8];
  const fade = 0.4;
  const off1 = +(durations[0] - fade).toFixed(2);                       // 2.6
  const off2 = +(off1 + durations[1] - fade).toFixed(2);                // 5.5
  const off3 = +(off2 + durations[2] - fade).toFixed(2);                // 8.6
  const off4 = +(off3 + durations[3] - fade).toFixed(2);                // 11.4
  const totalDur = +(off4 + durations[4]).toFixed(2);                   // 14.2

  const mp4Out = path.join(outDir, 'walkthrough-video.mp4');
  const filterComplex = [
    `[0:v]fps=30,format=yuv420p[v0]`,
    `[1:v]fps=30,format=yuv420p[v1]`,
    `[2:v]fps=30,format=yuv420p[v2]`,
    `[3:v]fps=30,format=yuv420p[v3]`,
    `[4:v]fps=30,format=yuv420p[v4]`,
    `[v0][v1]xfade=transition=slideup:duration=${fade}:offset=${off1}[x1]`,
    `[x1][v2]xfade=transition=wipeleft:duration=${fade}:offset=${off2}[x2]`,
    `[x2][v3]xfade=transition=slideup:duration=${fade}:offset=${off3}[x3]`,
    `[x3][v4]xfade=transition=fade:duration=${fade}:offset=${off4},format=yuv420p[vout]`
  ].join(';');

  const args = ['-y'];
  for (let i = 0; i < durations.length; i++) {
    args.push('-loop', '1', '-t', String(durations[i]), '-i', path.join(framesDir, `beat_${String(i).padStart(2, '0')}.png`));
  }
  // Input 5: Stereo 48kHz silent AAC track (required by Meta Instagram/Facebook Reels API)
  args.push('-f', 'lavfi', '-t', String(totalDur), '-i', 'anullsrc=channel_layout=stereo:sample_rate=48000');
  args.push(
    '-filter_complex', filterComplex,
    '-map', '[vout]',
    '-map', '5:a',
    '-c:v', 'libx264',
    '-profile:v', 'high',
    '-level', '4.1',
    '-pix_fmt', 'yuv420p',
    '-r', '30',
    '-g', '60',
    '-crf', '22',
    '-c:a', 'aac',
    '-b:a', '128k',
    '-ar', '48000',
    '-ac', '2',
    '-shortest',
    '-movflags', '+faststart',
    mp4Out
  );

  execFileSync('ffmpeg', args, { stdio: 'pipe' });
  fs.rmSync(framesDir, { recursive: true, force: true });
  const stat = fs.statSync(mp4Out);
  console.log(`Rendered 9:16 Reel: ${mp4Out} [archetype=${arch}, dur=${totalDur}s, size=${(stat.size / 1024).toFixed(1)}KB]`);
}

const [, , specArg, outArg] = process.argv;
if (!specArg || !outArg) {
  console.error('Usage: node render_video.js <spec.json> <outDir>');
  process.exit(1);
}
renderWalkthroughVideo(specArg, outArg).catch((err) => {
  console.error(err);
  process.exit(1);
});
