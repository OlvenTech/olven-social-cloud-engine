#!/usr/bin/env node
/**
 * Olven Tech — Apple iPhone / macOS Liquid Glass Visual Engine (True 2x Retina PNG)
 *
 * 6 radically distinct, high-retention flagship genres engineered for enterprise
 * New York / Silicon Valley presentation & delivery:
 *
 *  1. editorial_light_blueprint     — Apple Porcelain Liquid Glass Hero Metric Sheet (Light)
 *  2. security_policy_shield_matrix — macOS Sequoia Space-Black Glass Slack #prod-incidents Window (Dark)
 *  3. circuit_breaker_state_machine — iPadOS / macOS Frosted Glass Architecture Freeform Studio (Light)
 *  4. split_latency_waterfall       — macOS Obsidian Liquid Glass GitHub PR Diff Window (Dark)
 *  5. revenue_ledger_reconciliation — Apple Glacier Frosted Glass Live Telemetry Sheet (Light)
 *  6. cdc_hash_diff_funnel          — Apple Keynote Twin Titanium Glass Split ("Legacy vs. Prod") (Split)
 */
const fs = require('fs');
const path = require('path');

let chromium;
try { ({ chromium } = require('playwright')); } catch {
  const localCore = path.join(__dirname, 'node_modules/playwright-core');
  ({ chromium } = require(fs.existsSync(localCore) ? localCore : '/home/antigravity/.npm/_npx/e41f203b7505f1fb/node_modules/playwright-core'));
}

const ASSETS_DIR = path.join(__dirname, 'assets');
const b64Font = (file) => fs.readFileSync(path.join(ASSETS_DIR, file)).toString('base64');

const RAW_LOGO_SVG = fs.readFileSync(path.join(ASSETS_DIR, 'horizontal_dark.svg'), 'utf8')
  .replace(/<\?xml[\s\S]*?\?>/g, '')
  .replace(/<path[^>]*id="path1-3"[^>]*\/>/g, '');

function seamlessLogo(h, inkHex, cutoutHex) {
  const styled = RAW_LOGO_SVG
    .replace(/style="fill:#000000;/g, `style="fill:${cutoutHex};`)
    .replace(/style="fill:#ffffff;/g, `style="fill:${inkHex};`)
    .replace(/fill="#ffffff"/g, `fill="${inkHex}"`);
  return styled.replace(/<svg\b([^>]*)>/, `<svg $1 style="height:${h}px; width:auto; display:block;">`);
}

const { execFileSync } = require('child_process');

const PLATFORMS = [
  { name: 'linkedin.png', width: 1350, height: 1350, targetW: 1200, targetH: 1200, layout: 'square' },
  { name: 'instagram.png', width: 1200, height: 1500, targetW: 1080, targetH: 1350, layout: 'portrait' },
  { name: 'x.png', width: 1600, height: 900, targetW: 1920, targetH: 1080, layout: 'landscape' },
  { name: 'facebook.png', width: 1536, height: 1024, targetW: 1620, targetH: 1080, layout: 'landscape-tall' }
];

const ARCHETYPES = [
  'manhattan_swiss_poster',
  'split_latency_waterfall',
  'iphone_keynote_hardware',
  'security_policy_shield_matrix',
  'editorial_light_blueprint',
  'cdc_hash_diff_funnel',
  'revenue_ledger_reconciliation',
  'circuit_breaker_state_machine'
];

function stripHtml(s) {
  return String(s || '').replace(/<[^>]+>/g, '').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&').trim();
}

function esc(s) {
  return stripHtml(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function shorten(s, maxLen) {
  const clean = stripHtml(s);
  if (clean.length <= maxLen) return clean;
  return clean.slice(0, maxLen).replace(/\s+\S*$/, '') + '.';
}

// Ultra-fine monochrome micro-grain SVG eliminates 8-bit JPEG banding rings on Instagram/LinkedIn/X
const GRAIN_SVG_URI = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.032'/%3E%3C/svg%3E";

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
      font-weight: 400 850;
    }
    @font-face {
      font-family: 'IBM Plex Mono';
      src: url(data:font/woff2;base64,${fMono}) format('woff2');
      font-weight: 400 700;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      -webkit-font-smoothing: antialiased;
      text-rendering: geometricPrecision;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif;
    }
    body::after {
      content: '';
      position: absolute; inset: 0;
      background-image: url("${GRAIN_SVG_URI}");
      background-repeat: repeat;
      pointer-events: none;
      z-index: 99;
    }
    .mac-dots { display: flex; gap: 10px; align-items: center; }
    .mdot { width: 14px; height: 14px; border-radius: 50%; }
    .md-r { background: #FF5F57; box-shadow: inset 0 1px 1px rgba(255,255,255,0.45); }
    .md-y { background: #FEBC2E; box-shadow: inset 0 1px 1px rgba(255,255,255,0.45); }
    .md-g { background: #28C840; box-shadow: inset 0 1px 1px rgba(255,255,255,0.45); }
    .glass-light {
      background: linear-gradient(155deg, rgba(255,255,255,0.88) 0%, rgba(255,255,255,0.64) 100%);
      backdrop-filter: blur(36px) saturate(165%);
      -webkit-backdrop-filter: blur(36px) saturate(165%);
      border: 1.5px solid rgba(255,255,255,0.92);
      box-shadow:
        0 38px 86px -24px rgba(15, 23, 42, 0.14),
        0 12px 28px -10px rgba(15, 23, 42, 0.07),
        inset 0 2px 0 rgba(255,255,255,0.98),
        inset 0 -1px 0 rgba(15,23,42,0.05);
    }
    .glass-dark {
      background: linear-gradient(155deg, rgba(255,255,255,0.095) 0%, rgba(255,255,255,0.032) 100%);
      backdrop-filter: blur(36px) saturate(150%);
      -webkit-backdrop-filter: blur(36px) saturate(150%);
      border: 1.5px solid rgba(255,255,255,0.17);
      box-shadow:
        0 44px 100px -22px rgba(0, 0, 0, 0.72),
        0 14px 32px -10px rgba(0, 0, 0, 0.44),
        inset 0 1.5px 0 rgba(255,255,255,0.28),
        inset 0 -1px 0 rgba(255,255,255,0.04);
    }
  `;
}

/**
 * GENRE 1 (editorial_light_blueprint — ANTHROPIC WARM ALABASTER EDITORIAL):
 * High-status Claude / FT Editorial Metric Sheet with Warm Alabaster, Terracotta accent, and Before->After proof strip
 */
function renderBillboardPoster(spec, p) {
  const isWide = p.layout === 'landscape' || p.layout === 'landscape-tall';
  const m0 = spec.metrics[0];
  const m1 = spec.metrics[1];
  const m2 = spec.metrics[2] || m1;
  const valLen = String(m0.value).length;
  const heroSize = isWide
    ? (valLen > 7 ? 112 : 148)
    : (valLen > 7 ? 132 : 180);

  return `<!DOCTYPE html><html><head><meta charset="utf-8"><style>
    ${baseFontsCss()}
    body {
      width: ${p.width}px; height: ${p.height}px;
      background: radial-gradient(ellipse 92% 76% at 50% 18%, #FBF9F4 0%, #F4EFE6 56%, #EAE2D6 100%);
      color: #141413;
      padding: ${isWide ? '44px 66px' : '64px 66px'};
      display: flex; flex-direction: column; justify-content: space-between;
      position: relative; overflow: hidden;
    }
    .orb1 {
      position: absolute; width: 780px; height: 780px; border-radius: 50%;
      top: -260px; right: -180px;
      background: radial-gradient(circle, rgba(201, 100, 66, 0.16) 0%, rgba(217, 119, 87, 0.05) 52%, transparent 74%);
      filter: blur(44px);
    }
    .orb2 {
      position: absolute; width: 680px; height: 680px; border-radius: 50%;
      bottom: -260px; left: -160px;
      background: radial-gradient(circle, rgba(168, 148, 120, 0.22) 0%, transparent 72%);
      filter: blur(52px);
    }
    .top-bar {
      position: relative; z-index: 3;
      display: flex; justify-content: space-between; align-items: center;
      padding-bottom: 18px; border-bottom: 1px solid rgba(20, 20, 19, 0.11);
      font-family: 'IBM Plex Mono', monospace; font-size: 15px; font-weight: 700;
      letter-spacing: 0.14em; text-transform: uppercase; color: #5C574F;
    }
    .ny-pill {
      padding: 7px 16px; border-radius: 999px;
      background: #141413; color: #FAF8F4;
      font-size: 13px; letter-spacing: 0.12em;
    }
    .hero-card {
      position: relative; z-index: 3;
      border-radius: 34px;
      background: rgba(254, 253, 250, 0.92);
      border: 1px solid rgba(20, 20, 19, 0.09);
      box-shadow: 0 36px 80px -28px rgba(20, 20, 19, 0.12), inset 0 1px 0 #FFFFFF;
      padding: ${isWide ? '40px 52px' : '58px 56px'};
      display: flex; flex-direction: column; justify-content: center;
      overflow: hidden;
    }
    .contrast-strip {
      display: inline-flex; align-items: center; gap: 14px; flex-wrap: wrap;
      margin-bottom: ${isWide ? '18px' : '26px'};
      font-family: 'IBM Plex Mono', monospace; font-size: 14px; font-weight: 700;
      letter-spacing: 0.08em; text-transform: uppercase;
    }
    .c-bad {
      padding: 6px 14px; border-radius: 999px;
      background: rgba(201, 100, 66, 0.12); color: #A64323;
      border: 1px solid rgba(201, 100, 66, 0.28);
    }
    .c-arr { color: #8A8379; font-weight: 800; }
    .c-good {
      padding: 6px 14px; border-radius: 999px;
      background: rgba(15, 118, 110, 0.10); color: #0F766E;
      border: 1px solid rgba(15, 118, 110, 0.26);
    }
    .eyebrow {
      font-family: 'IBM Plex Mono', monospace; font-size: 15px; font-weight: 700;
      letter-spacing: 0.15em; text-transform: uppercase; color: #7C756B;
      margin-bottom: 10px;
    }
    .hero-num {
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-size: ${heroSize}px; font-weight: 850; line-height: 0.94;
      letter-spacing: -0.055em; color: #C96442;
      font-variant-numeric: tabular-nums;
      margin-bottom: ${isWide ? '18px' : '28px'};
    }
    .headline {
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-size: ${isWide ? '38px' : '48px'}; font-weight: 800; line-height: 1.09;
      letter-spacing: -0.038em; color: #141413; max-width: 96%;
      margin-bottom: ${isWide ? '24px' : '36px'};
    }
    .sub-pills {
      display: grid; grid-template-columns: 1fr 1fr; gap: 18px;
    }
    .sub-pill {
      padding: ${isWide ? '18px 24px' : '22px 26px'}; border-radius: 20px;
      background: #F6F3EC;
      border: 1px solid rgba(20, 20, 19, 0.08);
    }
    .sp-val { font-size: ${isWide ? '30px' : '36px'}; font-weight: 800; letter-spacing: -0.035em; color: #141413; font-variant-numeric: tabular-nums; }
    .sp-lbl { font-family: 'IBM Plex Mono', monospace; font-size: 13px; font-weight: 700; letter-spacing: 0.09em; text-transform: uppercase; color: #6B655C; margin-top: 4px; }
    .footer {
      position: relative; z-index: 3;
      display: flex; justify-content: space-between; align-items: center;
      padding-top: 18px; border-top: 1px solid rgba(20, 20, 19, 0.11);
    }
    .domain {
      font-family: 'IBM Plex Mono', monospace; font-size: 15px; font-weight: 700;
      letter-spacing: 0.1em; color: #5C574F;
    }
  </style></head><body>
    <div class="orb1"></div>
    <div class="orb2"></div>
    <div class="top-bar">
      <span>${esc(spec.eyebrow)}</span>
      <span class="ny-pill">OLVEN TECH · NEW YORK</span>
    </div>
    <div class="hero-card">
      <div class="contrast-strip">
        <span class="c-bad">${esc(spec.before_badge)}</span>
        <span class="c-arr">→</span>
        <span class="c-good">${esc(spec.after_badge || 'DETERMINISTIC FIX')}</span>
      </div>
      <div class="eyebrow">${esc(m0.label)}</div>
      <div class="hero-num">${esc(m0.value)}</div>
      <div class="headline">${esc(shorten(spec.headline, isWide ? 72 : 84))}</div>
      <div class="sub-pills">
        <div class="sub-pill">
          <div class="sp-val">${esc(m1.value)}</div>
          <div class="sp-lbl">${esc(m1.label)}</div>
        </div>
        <div class="sub-pill">
          <div class="sp-val">${esc(m2.value)}</div>
          <div class="sp-lbl">${esc(m2.label)}</div>
        </div>
      </div>
    </div>
    <div class="footer">
      ${seamlessLogo(30, '#141413', '#EFE9DF')}
      <div class="domain">OLVENTECH.COM · ENTERPRISE SYSTEMS</div>
    </div>
  </body></html>`;
}

/**
 * GENRE 2 (security_policy_shield_matrix — DARK):
 * macOS Sequoia Space-Black Liquid Glass Slack #prod-incidents War-Room Window
 */
function renderSlackIncident(spec, p) {
  const isWide = p.layout === 'landscape' || p.layout === 'landscape-tall';
  const m0 = spec.metrics[0];
  const m1 = spec.metrics[1];
  const badPt = shorten(spec.before_points[0], 112);
  const fixPt1 = shorten(spec.after_points[0], 108);
  const fixPt2 = shorten(spec.after_points[1], 108);

  return `<!DOCTYPE html><html><head><meta charset="utf-8"><style>
    ${baseFontsCss()}
    body {
      width: ${p.width}px; height: ${p.height}px;
      background: #06070A; color: #F4F5F7;
      padding: ${isWide ? '44px 66px' : '68px 62px'};
      display: flex; flex-direction: column; justify-content: space-between;
      position: relative; overflow: hidden;
    }
    .orb1 {
      position: absolute; width: 620px; height: 620px; border-radius: 50%;
      top: -220px; left: -140px;
      background: radial-gradient(circle, rgba(226, 232, 240, 0.11) 0%, transparent 66%);
      filter: blur(48px);
    }
    .orb2 {
      position: absolute; width: 680px; height: 680px; border-radius: 50%;
      bottom: -240px; right: -140px;
      background: radial-gradient(circle, rgba(16, 185, 129, 0.14) 0%, rgba(148, 163, 184, 0.06) 48%, transparent 70%);
      filter: blur(52px);
    }
    .window {
      position: relative; z-index: 3; flex: 1;
      border-radius: 34px; overflow: hidden;
      display: flex; flex-direction: column;
    }
    .titlebar {
      padding: 22px 30px;
      background: rgba(255,255,255,0.06);
      border-bottom: 1px solid rgba(255,255,255,0.12);
      display: flex; align-items: center; justify-content: space-between;
    }
    .chan {
      font-family: 'IBM Plex Mono', monospace; font-size: 18px; font-weight: 700;
      color: #F8FAFC; letter-spacing: 0.02em;
    }
    .badge-sev {
      padding: 7px 16px; border-radius: 999px;
      background: rgba(244, 63, 94, 0.16); border: 1px solid rgba(244, 63, 94, 0.45);
      font-family: 'IBM Plex Mono', monospace; font-size: 14px; font-weight: 700;
      color: #FDA4AF; letter-spacing: 0.08em;
    }
    .body-feed {
      flex: 1; padding: ${isWide ? '30px 38px' : '44px 44px'};
      display: flex; flex-direction: column; justify-content: center; gap: ${isWide ? '24px' : '34px'};
    }
    .msg {
      display: flex; gap: 20px; align-items: flex-start;
      padding: ${isWide ? '22px 26px' : '28px 30px'};
      border-radius: 24px;
      background: rgba(255,255,255,0.045);
      border: 1px solid rgba(255,255,255,0.10);
      box-shadow: inset 0 1px 0 rgba(255,255,255,0.12);
    }
    .av {
      width: 48px; height: 48px; border-radius: 14px; flex-shrink: 0;
      display: flex; align-items: center; justify-content: center;
      font-family: 'IBM Plex Mono', monospace; font-size: 18px; font-weight: 800;
    }
    .av-pd { background: linear-gradient(135deg, #F43F5E, #BE123C); color: #FFF; }
    .av-ov { background: linear-gradient(135deg, #10B981, #059669); color: #04130D; }
    .who { font-size: 19px; font-weight: 800; color: #FFFFFF; margin-bottom: 8px; display: flex; align-items: center; gap: 12px; }
    .ts { font-family: 'IBM Plex Mono', monospace; font-size: 14px; font-weight: 500; color: #94A3B8; }
    .txt { font-size: ${isWide ? '22px' : '25px'}; line-height: 1.42; color: #E2E8F0; font-weight: 500; }
    .fix-bullets { margin-top: 12px; display: flex; flex-direction: column; gap: 10px; }
    .fb {
      font-size: ${isWide ? '20px' : '23px'}; line-height: 1.38; color: #A7F3D0;
      padding-left: 16px; border-left: 3px solid #10B981;
    }
    .reacts { display: flex; gap: 12px; margin-top: 16px; flex-wrap: wrap; }
    .rx {
      padding: 8px 16px; border-radius: 999px;
      background: rgba(16, 185, 129, 0.14); border: 1px solid rgba(16, 185, 129, 0.36);
      font-family: 'IBM Plex Mono', monospace; font-size: 15px; font-weight: 700; color: #6EE7B7;
    }
    .footer {
      position: relative; z-index: 3; margin-top: 24px;
      display: flex; justify-content: space-between; align-items: center;
      padding: 14px 26px; border-radius: 22px;
    }
    .ft-meta { font-family: 'IBM Plex Mono', monospace; font-size: 15px; font-weight: 600; color: #94A3B8; letter-spacing: 0.08em; }
  </style></head><body>
    <div class="orb1"></div>
    <div class="orb2"></div>
    <div class="window glass-dark">
      <div class="titlebar">
        <div class="mac-dots">
          <span class="mdot md-r"></span><span class="mdot md-y"></span><span class="mdot md-g"></span>
        </div>
        <div class="chan">#prod-incidents · ${esc(spec.eyebrow.split('·')[0].trim())}</div>
        <div class="badge-sev">${esc(spec.before_badge)}</div>
      </div>
      <div class="body-feed">
        <div class="msg">
          <div class="av av-pd">PD</div>
          <div>
            <div class="who">PagerDuty SEV-1 <span class="ts">02:14 AM EST</span></div>
            <div class="txt">${esc(badPt)}</div>
          </div>
        </div>
        <div class="msg">
          <div class="av av-ov">OT</div>
          <div>
            <div class="who">Olven Staff Eng <span class="ts">02:29 AM EST · SHIPPED</span></div>
            <div class="txt">Replaced legacy path with deterministic architecture:</div>
            <div class="fix-bullets">
              <div class="fb">${esc(fixPt1)}</div>
              <div class="fb">${esc(fixPt2)}</div>
            </div>
            <div class="reacts">
              <span class="rx">${esc(m0.value)} ${esc(m0.label)}</span>
              <span class="rx">${esc(m1.value)} ${esc(m1.label)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="footer glass-dark">
      ${seamlessLogo(30, '#F8FAFC', '#06070A')}
      <div class="ft-meta">OLVENTECH.COM · NEW YORK</div>
    </div>
  </body></html>`;
}

/**
 * GENRE 3 (circuit_breaker_state_machine — OPENAI CERAMIC ARCHITECTURE STUDIO):
 * Ultra-clean OpenAI / Apple gallery studio canvas comparing legacy fragility vs. Olven deterministic architecture
 */
function renderWhiteboardDiagram(spec, p) {
  const isWide = p.layout === 'landscape' || p.layout === 'landscape-tall';
  const bNodes = (spec.before_nodes || []).slice(0, 3);
  const aNodes = (spec.after_nodes || []).slice(0, 3);
  const m0 = spec.metrics[0];
  const m1 = spec.metrics[1] || m0;

  return `<!DOCTYPE html><html><head><meta charset="utf-8"><style>
    ${baseFontsCss()}
    body {
      width: ${p.width}px; height: ${p.height}px;
      background: radial-gradient(ellipse 90% 70% at 50% 0%, #FFFFFF 0%, #F7F9FC 58%, #EEF2F8 100%);
      color: #0B0F17;
      padding: ${isWide ? '40px 62px' : '58px 58px'};
      display: flex; flex-direction: column; justify-content: space-between;
      position: relative; overflow: hidden;
    }
    .orb {
      position: absolute; width: 780px; height: 780px; border-radius: 50%;
      top: -280px; right: -180px;
      background: radial-gradient(circle, rgba(29, 78, 216, 0.11) 0%, rgba(16, 185, 129, 0.06) 50%, transparent 74%);
      filter: blur(48px);
    }
    .canvas-win {
      position: relative; z-index: 3; flex: 1;
      border-radius: 34px; padding: ${isWide ? '34px 44px' : '46px 46px'};
      background: rgba(255, 255, 255, 0.94);
      border: 1px solid rgba(11, 15, 23, 0.09);
      box-shadow: 0 36px 84px -26px rgba(15, 23, 42, 0.12), inset 0 1px 0 #FFFFFF;
      display: flex; flex-direction: column; justify-content: space-between;
    }
    .bar {
      display: flex; justify-content: space-between; align-items: center;
      padding-bottom: 18px; border-bottom: 1px solid rgba(11, 15, 23, 0.08);
    }
    .eyebrow-tag {
      font-family: 'IBM Plex Mono', monospace; font-size: 14px; font-weight: 700;
      color: #475569; letter-spacing: 0.12em; text-transform: uppercase;
    }
    .ny-chip {
      padding: 7px 16px; border-radius: 999px;
      background: #0B0F17; color: #FFFFFF;
      font-family: 'IBM Plex Mono', monospace; font-size: 13px; font-weight: 700;
      letter-spacing: 0.1em; text-transform: uppercase;
    }
    .title {
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-size: ${isWide ? '38px' : '50px'}; font-weight: 850;
      letter-spacing: -0.042em; line-height: 1.06; color: #0B0F17;
      margin: ${isWide ? '12px 0 10px' : '16px 0 14px'};
    }
    .sub {
      font-size: ${isWide ? '20px' : '22px'}; line-height: 1.42; color: #475569;
      font-weight: 500; margin-bottom: ${isWide ? '16px' : '22px'}; max-width: 94%;
    }
    .lanes { display: flex; flex-direction: column; gap: ${isWide ? '16px' : '22px'}; }
    .lane {
      padding: ${isWide ? '22px 26px' : '28px 30px'};
      border-radius: 24px;
    }
    .lane-bad {
      background: #FFF9F8;
      border: 1px solid rgba(220, 38, 38, 0.24);
    }
    .lane-good {
      background: linear-gradient(150deg, #F5FBF8 0%, #EEF7F3 100%);
      border: 1.5px solid rgba(5, 150, 105, 0.36);
      box-shadow: 0 18px 40px -20px rgba(5, 150, 105, 0.20);
    }
    .lane-tag {
      font-family: 'IBM Plex Mono', monospace; font-size: 14px; font-weight: 700;
      letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 16px;
      display: flex; justify-content: space-between; align-items: center;
    }
    .tag-bad { color: #B91C1C; }
    .tag-good { color: #047857; }
    .pill-bad {
      padding: 5px 12px; border-radius: 999px;
      background: rgba(220, 38, 38, 0.10); color: #B91C1C; font-size: 13px;
    }
    .pill-good {
      padding: 5px 12px; border-radius: 999px;
      background: rgba(5, 150, 105, 0.12); color: #047857; font-size: 13px;
    }
    .flow { display: flex; align-items: center; gap: 12px; }
    .node {
      flex: 1; padding: ${isWide ? '18px 14px' : '22px 16px'}; border-radius: 16px;
      background: #FFFFFF;
      border: 1px solid rgba(15, 23, 42, 0.09);
      box-shadow: 0 6px 16px -10px rgba(15, 23, 42, 0.12);
      font-size: ${isWide ? '18px' : '20px'}; font-weight: 750;
      text-align: center; color: #0F172A; letter-spacing: -0.02em;
    }
    .node-good {
      border-color: rgba(5, 150, 105, 0.22);
    }
    .arr { font-family: 'IBM Plex Mono', monospace; font-size: 22px; font-weight: 800; color: #94A3B8; }
    .arr-g { color: #059669; }
    .win-foot {
      display: flex; justify-content: space-between; align-items: center;
      padding-top: 18px; border-top: 1px solid rgba(11, 15, 23, 0.08);
    }
    .foot-metrics { display: flex; gap: 12px; align-items: center; }
    .res-badge {
      padding: 10px 20px; border-radius: 999px;
      background: #1D4ED8; color: #FFFFFF;
      font-family: 'IBM Plex Mono', monospace; font-size: 15px; font-weight: 700;
      letter-spacing: 0.06em;
    }
    .res-sub {
      padding: 10px 18px; border-radius: 999px;
      background: #F1F5F9; color: #0F172A;
      font-family: 'IBM Plex Mono', monospace; font-size: 14px; font-weight: 700;
      letter-spacing: 0.05em;
    }
  </style></head><body>
    <div class="orb"></div>
    <div class="canvas-win">
      <div class="bar">
        <div class="eyebrow-tag">${esc(spec.eyebrow)}</div>
        <div class="ny-chip">OLVEN ARCHITECTURE · NY</div>
      </div>
      <div>
        <div class="title">${esc(shorten(spec.headline, isWide ? 72 : 84))}</div>
        <div class="sub">${esc(shorten(spec.subhead, isWide ? 120 : 145))}</div>
      </div>
      <div class="lanes">
        <div class="lane lane-bad">
          <div class="lane-tag tag-bad"><span>✕ LEGACY PATH · ${esc(spec.before_title.replace(/^Before:\s*/i, ''))}</span><span class="pill-bad">${esc(spec.before_badge)}</span></div>
          <div class="flow">
            ${bNodes.map((n, i) => `<div class="node">${esc(n)}</div>${i < bNodes.length - 1 ? '<span class="arr">→</span>' : ''}`).join('')}
          </div>
        </div>
        <div class="lane lane-good">
          <div class="lane-tag tag-good"><span>✓ OLVEN PRODUCTION · ${esc(spec.after_title.replace(/^After:\s*/i, ''))}</span><span class="pill-good">${esc(spec.after_badge || 'PRODUCTION VERIFIED')}</span></div>
          <div class="flow">
            ${aNodes.map((n, i) => `<div class="node node-good">${esc(n)}</div>${i < aNodes.length - 1 ? '<span class="arr arr-g">→</span>' : ''}`).join('')}
          </div>
        </div>
      </div>
      <div class="win-foot">
        ${seamlessLogo(28, '#0B0F17', '#FFFFFF')}
        <div class="foot-metrics">
          <div class="res-sub">${esc(m1.value)} ${esc(m1.label)}</div>
          <div class="res-badge">${esc(m0.value)} · ${esc(m0.label)}</div>
        </div>
      </div>
    </div>
  </body></html>`;
}

/**
 * GENRE 4 (split_latency_waterfall — DARK):
 * macOS Obsidian Liquid Glass GitHub PR Diff Window
 */
function renderCodeDiffWindow(spec, p) {
  const isWide = p.layout === 'landscape' || p.layout === 'landscape-tall';
  const m0 = spec.metrics[0];
  const m1 = spec.metrics[1];
  const b0 = shorten(spec.before_nodes[0] || 'syncApiCall()', 30);
  const b1 = shorten(spec.before_nodes[1] || 'retryOnTimeout()', 30);
  const a0 = shorten(spec.after_nodes[0] || 'writeAheadLog()', 30);
  const a1 = shorten(spec.after_nodes[1] || 'idempotentCommit()', 30);

  return `<!DOCTYPE html><html><head><meta charset="utf-8"><style>
    ${baseFontsCss()}
    body {
      width: ${p.width}px; height: ${p.height}px;
      background: #070B14; color: #F8FAFC;
      padding: ${isWide ? '44px 66px' : '68px 62px'};
      display: flex; flex-direction: column; justify-content: space-between;
      position: relative; overflow: hidden;
    }
    .orb1 {
      position: absolute; width: 760px; height: 760px; border-radius: 50%;
      top: -220px; right: -140px;
      background: radial-gradient(circle, rgba(99, 102, 241, 0.30) 0%, rgba(56, 189, 248, 0.10) 50%, transparent 72%);
      filter: blur(55px);
    }
    .orb2 {
      position: absolute; width: 680px; height: 680px; border-radius: 50%;
      bottom: -220px; left: -140px;
      background: radial-gradient(circle, rgba(16, 185, 129, 0.24) 0%, transparent 70%);
      filter: blur(60px);
    }
    .head { position: relative; z-index: 3; margin-bottom: ${isWide ? '22px' : '32px'}; }
    .eyebrow {
      font-family: 'IBM Plex Mono', monospace; font-size: 16px; font-weight: 600;
      letter-spacing: 0.14em; color: #818CF8; text-transform: uppercase; margin-bottom: 12px;
    }
    .hl {
      font-size: ${isWide ? '38px' : '48px'}; font-weight: 850; line-height: 1.08;
      letter-spacing: -0.04em; color: #FFFFFF;
    }
    .ide {
      position: relative; z-index: 3; flex: 1;
      border-radius: 32px; overflow: hidden;
      display: flex; flex-direction: column;
    }
    .ide-bar {
      padding: 20px 28px;
      background: rgba(255,255,255,0.06);
      border-bottom: 1px solid rgba(255,255,255,0.12);
      display: flex; align-items: center; justify-content: space-between;
    }
    .file {
      font-family: 'IBM Plex Mono', monospace; font-size: 17px; font-weight: 600; color: #CBD5E1;
    }
    .merged {
      padding: 6px 16px; border-radius: 999px;
      background: rgba(139, 92, 246, 0.22); border: 1px solid rgba(167, 139, 250, 0.45);
      font-family: 'IBM Plex Mono', monospace; font-size: 14px; font-weight: 700; color: #DDD6FE;
    }
    .diff-body {
      flex: 1; padding: ${isWide ? '26px 32px' : '40px 36px'};
      font-family: 'IBM Plex Mono', monospace;
      font-size: ${isWide ? '20px' : '23px'}; line-height: 1.68;
      display: flex; flex-direction: column; justify-content: center; gap: 10px;
    }
    .line { padding: 10px 20px; border-radius: 12px; }
    .del { background: rgba(244, 63, 94, 0.14); color: #FDA4AF; border-left: 3px solid #F43F5E; }
    .add { background: rgba(16, 185, 129, 0.14); color: #6EE7B7; border-left: 3px solid #10B981; }
    .cmt { color: #94A3B8; padding-left: 20px; font-size: 0.9em; }
    .ide-foot {
      padding: 22px 32px;
      background: rgba(255,255,255,0.04);
      border-top: 1px solid rgba(255,255,255,0.10);
      display: flex; justify-content: space-between; align-items: center;
    }
    .checks { display: flex; gap: 22px; font-family: 'IBM Plex Mono', monospace; font-size: 16px; font-weight: 700; color: #34D399; }
  </style></head><body>
    <div class="orb1"></div>
    <div class="orb2"></div>
    <div class="head">
      <div class="eyebrow">PR #418 · PRODUCTION REFACTOR</div>
      <div class="hl">${esc(shorten(spec.headline, isWide ? 72 : 84))}</div>
    </div>
    <div class="ide glass-dark">
      <div class="ide-bar">
        <div class="mac-dots">
          <span class="mdot md-r"></span><span class="mdot md-y"></span><span class="mdot md-g"></span>
        </div>
        <div class="file">src/workers/pipeline.ts</div>
        <div class="merged">MERGED · PROD</div>
      </div>
      <div class="diff-body">
        <div class="cmt">// Legacy brittle path (${esc(spec.before_badge)})</div>
        <div class="line del">- await directDispatch("${esc(b0)}");</div>
        <div class="line del">- await unguardedSync("${esc(b1)}");</div>
        <div class="cmt" style="margin-top:14px;">// Olven deterministic architecture (${esc(spec.after_badge)})</div>
        <div class="line add">+ await tx.persistOutbox("${esc(a0)}");</div>
        <div class="line add">+ await worker.commitIdempotent("${esc(a1)}");</div>
      </div>
      <div class="ide-foot">
        ${seamlessLogo(28, '#F8FAFC', '#070B14')}
        <div class="checks">
          <span>✓ ${esc(m0.value)} ${esc(m0.label)}</span>
          <span>✓ ${esc(m1.value)} ${esc(m1.label)}</span>
        </div>
      </div>
    </div>
  </body></html>`;
}

/**
 * GENRE 5 (revenue_ledger_reconciliation — STRIPE / DEEPMIND MIDNIGHT NAVY TELEMETRY):
 * Deep Obsidian-Navy executive telemetry cliff with luminous Sky/Emerald drop and >140 RGB contrast vs light neighbors
 */
function renderTelemetryCliff(spec, p) {
  const isWide = p.layout === 'landscape' || p.layout === 'landscape-tall';
  const m0 = spec.metrics[0];
  const m1 = spec.metrics[1];

  return `<!DOCTYPE html><html><head><meta charset="utf-8"><style>
    ${baseFontsCss()}
    body {
      width: ${p.width}px; height: ${p.height}px;
      background: radial-gradient(ellipse 92% 76% at 50% 8%, #12203E 0%, #091124 54%, #050914 100%);
      color: #F8FAFC;
      padding: ${isWide ? '40px 66px' : '58px 60px'};
      display: flex; flex-direction: column; justify-content: space-between;
      position: relative; overflow: hidden;
    }
    .orb1 {
      position: absolute; width: 720px; height: 720px; border-radius: 50%;
      top: -240px; left: -140px;
      background: radial-gradient(circle, rgba(56, 189, 248, 0.22) 0%, transparent 70%);
      filter: blur(54px);
    }
    .orb2 {
      position: absolute; width: 780px; height: 780px; border-radius: 50%;
      bottom: -240px; right: -140px;
      background: radial-gradient(circle, rgba(52, 211, 153, 0.20) 0%, rgba(56, 189, 248, 0.08) 52%, transparent 74%);
      filter: blur(54px);
    }
    .card {
      position: relative; z-index: 3; flex: 1;
      border-radius: 34px; padding: ${isWide ? '34px 46px' : '48px 48px'};
      background: linear-gradient(155deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.025) 100%);
      border: 1.5px solid rgba(148, 163, 184, 0.20);
      box-shadow: 0 40px 90px -24px rgba(0, 0, 0, 0.65), inset 0 1px 0 rgba(255,255,255,0.18);
      display: flex; flex-direction: column; justify-content: space-between;
    }
    .hdr { display: flex; justify-content: space-between; align-items: center; }
    .ey { font-family: 'IBM Plex Mono', monospace; font-size: 14px; font-weight: 700; color: #94A3B8; letter-spacing: 0.12em; text-transform: uppercase; }
    .tag {
      font-family: 'IBM Plex Mono', monospace; font-size: 13px; font-weight: 700;
      letter-spacing: 0.12em; text-transform: uppercase; color: #7DD3FC;
      padding: 6px 14px; border-radius: 999px;
      background: rgba(56, 189, 248, 0.14); border: 1px solid rgba(56, 189, 248, 0.34);
    }
    .hl {
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-size: ${isWide ? '38px' : '48px'}; font-weight: 850;
      letter-spacing: -0.04em; line-height: 1.07; color: #FFFFFF;
      margin: ${isWide ? '12px 0 8px' : '16px 0 12px'};
    }
    .sub {
      font-size: ${isWide ? '19px' : '21px'}; line-height: 1.42; color: #94A3B8; font-weight: 500;
    }
    .chart-box {
      padding: 24px 26px; border-radius: 24px;
      background: rgba(5, 10, 24, 0.62);
      border: 1px solid rgba(148, 163, 184, 0.16);
    }
    .stats {
      display: grid; grid-template-columns: 1fr 1fr; gap: 18px;
    }
    .st {
      padding: ${isWide ? '20px 24px' : '26px 28px'}; border-radius: 22px;
      background: rgba(255, 255, 255, 0.045);
      border: 1px solid rgba(148, 163, 184, 0.16);
    }
    .sv { font-family: 'Plus Jakarta Sans', sans-serif; font-size: ${isWide ? '44px' : '56px'}; font-weight: 850; letter-spacing: -0.045em; color: #38BDF8; font-variant-numeric: tabular-nums; }
    .sv-g { color: #34D399; }
    .sl { font-family: 'IBM Plex Mono', monospace; font-size: 14px; font-weight: 700; color: #94A3B8; letter-spacing: 0.08em; text-transform: uppercase; margin-top: 6px; }
    .ft {
      display: flex; justify-content: space-between; align-items: center;
      padding-top: 16px; border-top: 1px solid rgba(148, 163, 184, 0.14);
    }
    .ft-r { font-family: 'IBM Plex Mono', monospace; font-size: 14px; font-weight: 700; color: #94A3B8; letter-spacing: 0.09em; }
  </style></head><body>
    <div class="orb1"></div>
    <div class="orb2"></div>
    <div class="card">
      <div class="hdr">
        <div class="ey">${esc(spec.eyebrow)}</div>
        <div class="tag">VERIFIED TELEMETRY · ${esc(spec.after_badge)}</div>
      </div>
      <div>
        <div class="hl">${esc(shorten(spec.headline, isWide ? 72 : 84))}</div>
        <div class="sub">${esc(shorten(spec.subhead, isWide ? 115 : 140))}</div>
      </div>
      <div class="chart-box">
        <svg viewBox="0 0 920 280" width="100%" height="${isWide ? '190' : '280'}" fill="none">
          <line x1="0" y1="68" x2="920" y2="68" stroke="rgba(148,163,184,0.14)" stroke-dasharray="6 6"/>
          <line x1="0" y1="152" x2="920" y2="152" stroke="rgba(148,163,184,0.14)" stroke-dasharray="6 6"/>
          <line x1="0" y1="232" x2="920" y2="232" stroke="rgba(148,163,184,0.14)" stroke-dasharray="6 6"/>
          <text x="18" y="34" fill="#FBBF24" font-family="IBM Plex Mono, monospace" font-size="13" font-weight="700">BEFORE · ${esc(shorten(spec.before_badge, 24))}</text>
          <path d="M 16 122 L 84 78 L 152 114 L 222 52 L 292 94 L 364 46 L 430 70" stroke="#F59E0B" stroke-width="5.5" stroke-linecap="round" stroke-linejoin="round"/>
          <line x1="452" y1="18" x2="452" y2="262" stroke="#E2E8F0" stroke-width="2" stroke-dasharray="6 6"/>
          <rect x="342" y="8" width="220" height="32" rx="16" fill="#F8FAFC"/>
          <text x="452" y="29" text-anchor="middle" fill="#091124" font-family="IBM Plex Mono, monospace" font-size="13" font-weight="700">▼ OLVEN FIX DEPLOYED</text>
          <text x="632" y="212" fill="#34D399" font-family="IBM Plex Mono, monospace" font-size="13" font-weight="700">PRODUCTION STEADY-STATE</text>
          <path d="M 430 70 L 468 230 L 560 234 L 690 232 L 820 233 L 904 232" stroke="#34D399" stroke-width="5.5" stroke-linecap="round" stroke-linejoin="round"/>
          <circle cx="904" cy="232" r="8.5" fill="#34D399"/>
        </svg>
      </div>
      <div class="stats">
        <div class="st"><div class="sv">${esc(m0.value)}</div><div class="sl">${esc(m0.label)}</div></div>
        <div class="st"><div class="sv sv-g">${esc(m1.value)}</div><div class="sl">${esc(m1.label)}</div></div>
      </div>
      <div class="ft">
        ${seamlessLogo(28, '#FFFFFF', '#091124')}
        <div class="ft-r">OLVENTECH.COM · MANHATTAN, NY</div>
      </div>
    </div>
  </body></html>`;
}

/**
 * GENRE 6 (cdc_hash_diff_funnel — APPLE KEYNOTE TWIN TITANIUM SPLIT):
 * Smoked Obsidian ("WHAT MOST TEAMS BUILD") vs. Warm Alabaster ("HOW OLVEN ENGINEERS IT")
 */
function renderMagazineSplit(spec, p) {
  const isWide = p.layout === 'landscape' || p.layout === 'landscape-tall';
  const bPts = spec.before_points.slice(0, 3).map((x) => shorten(x, 145));
  const aPts = spec.after_points.slice(0, 3).map((x) => shorten(x, 145));
  const m0 = spec.metrics[0];

  return `<!DOCTYPE html><html><head><meta charset="utf-8"><style>
    ${baseFontsCss()}
    body {
      width: ${p.width}px; height: ${p.height}px;
      background:
        radial-gradient(circle at 22% 18%, rgba(226, 232, 240, 0.07) 0%, transparent 44%),
        radial-gradient(circle at 78% 82%, rgba(201, 100, 66, 0.08) 0%, transparent 46%),
        linear-gradient(90deg, #07090E 0%, #07090E 50%, #F6F3EC 50%, #F6F3EC 100%);
      padding: ${isWide ? '42px 58px' : '62px 54px'};
      display: flex; flex-direction: column; justify-content: space-between;
      position: relative; overflow: hidden;
    }
    .grid {
      position: relative; z-index: 3; flex: 1;
      display: grid; grid-template-columns: 1fr 1fr; gap: 26px;
    }
    .slab {
      border-radius: 34px; padding: ${isWide ? '36px 36px' : '50px 42px'};
      display: flex; flex-direction: column; justify-content: space-between;
    }
    .slab-dark { color: #F4F4F5; }
    .slab-light {
      color: #141413;
      background: rgba(254, 253, 250, 0.94);
      border: 1px solid rgba(20, 20, 19, 0.10);
      box-shadow: 0 36px 80px -24px rgba(20, 20, 19, 0.14), inset 0 1px 0 #FFFFFF;
    }
    .lbl {
      font-family: 'IBM Plex Mono', monospace; font-size: 14px; font-weight: 700;
      letter-spacing: 0.14em; text-transform: uppercase; margin-bottom: 16px;
    }
    .lbl-b { color: #FCA5A5; }
    .lbl-g { color: #0F766E; }
    .title {
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-size: ${isWide ? '32px' : '40px'}; font-weight: 850; line-height: 1.08;
      letter-spacing: -0.04em; margin-bottom: ${isWide ? '22px' : '32px'};
    }
    .strike { text-decoration: line-through; text-decoration-color: #EF4444; text-decoration-thickness: 3px; opacity: 0.84; }
    .pts { display: flex; flex-direction: column; gap: ${isWide ? '18px' : '24px'}; }
    .pt { font-size: ${isWide ? '20px' : '22px'}; line-height: 1.40; font-weight: 500; }
    .pt-d { color: #CBD5E1; padding-left: 16px; border-left: 2.5px solid rgba(239, 68, 68, 0.65); }
    .pt-l { color: #1E293B; padding-left: 16px; border-left: 2.5px solid #0F766E; }
    .badge {
      padding: 12px 20px; border-radius: 16px; width: fit-content;
      font-family: 'IBM Plex Mono', monospace; font-size: 15px; font-weight: 700;
    }
    .b-bad { background: rgba(239, 68, 68, 0.16); color: #FCA5A5; border: 1px solid rgba(239, 68, 68, 0.35); }
    .b-good { background: #141413; color: #FAF8F4; }
    .ft {
      position: relative; z-index: 3; margin-top: 22px;
      display: flex; justify-content: space-between; align-items: center;
      padding: 14px 28px; border-radius: 22px;
      background: rgba(12, 15, 22, 0.90);
      backdrop-filter: blur(30px);
      border: 1px solid rgba(255,255,255,0.16);
      color: #CBD5E1;
    }
    .ft-r { font-family: 'IBM Plex Mono', monospace; font-size: 14px; font-weight: 700; letter-spacing: 0.09em; }
  </style></head><body>
    <div class="grid">
      <div class="slab slab-dark glass-dark">
        <div>
          <div class="lbl lbl-b">✕ WHAT MOST TEAMS BUILD</div>
          <div class="title strike">${esc(spec.before_title.replace(/^Before:\s*/i, ''))}</div>
          <div class="pts">
            ${bPts.map((pt) => `<div class="pt pt-d">${esc(pt)}</div>`).join('')}
          </div>
        </div>
        <div class="badge b-bad">${esc(spec.before_badge)}</div>
      </div>
      <div class="slab slab-light">
        <div>
          <div class="lbl lbl-g">✓ HOW OLVEN ENGINEERS IT</div>
          <div class="title">${esc(spec.after_title.replace(/^After:\s*/i, ''))}</div>
          <div class="pts">
            ${aPts.map((pt) => `<div class="pt pt-l">${esc(pt)}</div>`).join('')}
          </div>
        </div>
        <div class="badge b-good">${esc(m0.value)} · ${esc(m0.label)}</div>
      </div>
    </div>
    <div class="ft">
      ${seamlessLogo(28, '#FFFFFF', '#0C0F16')}
      <div class="ft-r">OLVENTECH.COM · MANHATTAN, NY</div>
    </div>
  </body></html>`;
}

/**
 * GENRE 7 (manhattan_swiss_poster — FULL-BLEED INTERNATIONAL KLEIN COBALT):
 * Pentagram / Vignelli Manhattan Gallery Print Poster (zero generic SaaS card box)
 */
function renderManhattanSwissPoster(spec, p) {
  const isWide = p.layout === 'landscape' || p.layout === 'landscape-tall';
  const m0 = spec.metrics[0];
  const m1 = spec.metrics[1];
  const m2 = spec.metrics[2] || m1;
  const heroMetric = [m0, m1, m2].find((m) => String(m.value).includes('$') || String(m.value).includes('%')) || m0;
  const rest = [m0, m1, m2].filter((m) => m !== heroMetric);
  const sA = rest[0] || m1;
  const sB = rest[1] || m2;

  return `<!doctype html><html><head><meta charset="utf-8"><style>
    ${baseFontsCss()}
    body {
      width: ${p.width}px; height: ${p.height}px; position: relative; overflow: hidden;
      background: radial-gradient(ellipse 95% 75% at 24% 18%, #1539FF 0%, #0A22CC 48%, #040B46 100%);
      color: #FFFFFF;
      display: flex; flex-direction: column; justify-content: space-between;
      padding: ${isWide ? '44px 64px 40px' : '58px 62px 48px'};
    }
    .grid-frame {
      position: absolute; inset: ${isWide ? '22px 28px' : '28px'};
      border: 1.5px solid rgba(255,255,255,0.16); border-radius: 26px; pointer-events: none;
    }
    .ghost-ny {
      position: absolute; top: ${isWide ? '-26px' : '20px'}; right: ${isWide ? '40px' : '34px'};
      font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 850;
      font-size: ${isWide ? '310px' : '380px'}; line-height: 0.85; letter-spacing: -0.07em;
      color: rgba(255,255,255,0.065); pointer-events: none;
    }
    .top {
      position: relative; z-index: 2; display: flex; justify-content: space-between; align-items: center;
      padding-bottom: ${isWide ? '18px' : '24px'}; border-bottom: 1.5px solid rgba(255,255,255,0.18);
      font-family: 'IBM Plex Mono', monospace; font-size: ${isWide ? '14px' : '16px'}; font-weight: 700;
      letter-spacing: 0.14em; text-transform: uppercase; color: rgba(255,255,255,0.82);
    }
    .pill-lime {
      background: #B8FF3B; color: #070A12; padding: 8px 18px; border-radius: 999px;
      font-weight: 800; letter-spacing: 0.1em;
    }
    .main {
      position: relative; z-index: 2; flex: 1;
      display: flex; ${isWide ? 'flex-direction: row; align-items: center; gap: 56px;' : 'flex-direction: column; justify-content: center; gap: 36px;'}
      padding: ${isWide ? '18px 0' : '24px 0'};
    }
    .left { flex: 1.25; }
    .hero-val {
      font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 850;
      font-size: ${isWide ? '118px' : (String(heroMetric.value).length > 6 ? '124px' : '148px')};
      line-height: 0.92; letter-spacing: -0.055em; color: #B8FF3B;
      font-variant-numeric: tabular-nums; margin-bottom: ${isWide ? '16px' : '24px'};
    }
    .hl {
      font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 800;
      font-size: ${isWide ? '44px' : '54px'}; line-height: 1.08; letter-spacing: -0.04em;
      color: #FFFFFF; max-width: ${isWide ? '780px' : '100%'};
    }
    .sub {
      margin-top: ${isWide ? '16px' : '22px'}; font-size: ${isWide ? '21px' : '24px'}; line-height: 1.42;
      color: rgba(255,255,255,0.78); font-weight: 500; max-width: ${isWide ? '740px' : '96%'};
    }
    .right {
      flex: 0.85; display: flex; flex-direction: column; gap: 18px;
    }
    .stat-row {
      display: grid; grid-template-columns: ${isWide ? '1fr' : '1fr 1fr'}; gap: 18px;
    }
    .stat-box {
      padding: ${isWide ? '22px 26px' : '26px 30px'}; border-radius: 24px;
      background: rgba(6, 12, 42, 0.56); border: 1.5px solid rgba(255,255,255,0.22);
      box-shadow: inset 0 1.5px 0 rgba(255,255,255,0.28);
    }
    .sv { font-size: ${isWide ? '40px' : '46px'}; font-weight: 850; letter-spacing: -0.04em; color: #FFFFFF; font-variant-numeric: tabular-nums; }
    .sl { margin-top: 6px; font-family: 'IBM Plex Mono', monospace; font-size: 14px; font-weight: 700; letter-spacing: 0.1em; color: #B8FF3B; text-transform: uppercase; }
    .flow {
      padding: 18px 24px; border-radius: 20px; background: rgba(255,255,255,0.08);
      border: 1px solid rgba(255,255,255,0.18);
      font-family: 'IBM Plex Mono', monospace; font-size: ${isWide ? '15px' : '17px'}; font-weight: 600;
      color: rgba(255,255,255,0.92); display: flex; align-items: center; gap: 12px;
    }
    .ft {
      position: relative; z-index: 2; display: flex; justify-content: space-between; align-items: center;
      padding-top: ${isWide ? '18px' : '22px'}; border-top: 1.5px solid rgba(255,255,255,0.18);
    }
    .ft-r { font-family: 'IBM Plex Mono', monospace; font-size: 15px; font-weight: 700; letter-spacing: 0.12em; color: rgba(255,255,255,0.82); }
  </style></head><body>
    <div class="grid-frame"></div>
    <div class="ghost-ny">NY</div>
    <div class="top">
      <span>${esc(spec.eyebrow)}</span>
      <span class="pill-lime">${esc(heroMetric.label)}</span>
    </div>
    <div class="main">
      <div class="left">
        <div class="hero-val">${esc(heroMetric.value)}</div>
        <div class="hl">${esc(spec.headline)}</div>
        <div class="sub">${esc(shorten(spec.subhead, isWide ? 140 : 175))}</div>
      </div>
      <div class="right">
        <div class="stat-row">
          <div class="stat-box"><div class="sv">${esc(sA.value)}</div><div class="sl">${esc(sA.label)}</div></div>
          <div class="stat-box"><div class="sv">${esc(sB.value)}</div><div class="sl">${esc(sB.label)}</div></div>
        </div>
        <div class="flow"><span style="color:#B8FF3B;">→</span><span>${esc((spec.after_nodes || []).slice(0, 3).join(' · '))}</span></div>
      </div>
    </div>
    <div class="ft">
      ${seamlessLogo(30, '#FFFFFF', '#06125E')}
      <div class="ft-r">OLVENTECH.COM · MANHATTAN, NY</div>
    </div>
  </body></html>`;
}

/**
 * GENRE 8 (iphone_keynote_hardware — CUPERTINO STUDIO HARDWARE):
 * Sculpted Apple iPhone 16 Pro Titanium Bezel over warm studio porcelain dome
 */
function renderIphoneKeynoteHardware(spec, p) {
  const isWide = p.layout === 'landscape' || p.layout === 'landscape-tall';
  const m0 = spec.metrics[0];
  const m1 = spec.metrics[1];
  const bNodes = (spec.before_nodes || []).slice(0, 2);
  const aNodes = (spec.after_nodes || []).slice(0, 3);

  return `<!doctype html><html><head><meta charset="utf-8"><style>
    ${baseFontsCss()}
    body {
      width: ${p.width}px; height: ${p.height}px; position: relative; overflow: hidden;
      background: radial-gradient(ellipse 88% 72% at 50% 24%, #FFFFFF 0%, #F4F1EA 52%, #E5E0D5 100%);
      color: #090C14;
      display: flex; flex-direction: column; justify-content: space-between;
      padding: ${isWide ? '40px 60px 34px' : '50px 56px 42px'};
    }
    .top {
      display: flex; justify-content: space-between; align-items: center;
      font-family: 'IBM Plex Mono', monospace; font-size: 15px; font-weight: 700;
      letter-spacing: 0.12em; color: #565E6E; text-transform: uppercase;
    }
    .badge-ok {
      padding: 8px 18px; border-radius: 999px; background: #090C14; color: #34D399;
      font-weight: 700; letter-spacing: 0.08em;
    }
    .stage {
      flex: 1; display: flex;
      ${isWide ? 'flex-direction: row; align-items: center; gap: 58px;' : 'flex-direction: column; justify-content: space-between; gap: 28px;'}
      padding: ${isWide ? '14px 0' : '26px 0 14px'};
    }
    .copy { flex: ${isWide ? '1.05' : '0 0 auto'}; }
    .hl {
      font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 850;
      font-size: ${isWide ? '46px' : '50px'}; line-height: 1.08; letter-spacing: -0.042em;
      color: #090C14;
    }
    .sub {
      margin-top: 16px; font-size: ${isWide ? '20px' : '22px'}; line-height: 1.42;
      color: #4D5566; font-weight: 500;
    }
    .kpis {
      margin-top: ${isWide ? '26px' : '24px'}; display: grid; grid-template-columns: 1fr 1fr; gap: 16px;
    }
    .kpi {
      padding: 20px 24px; border-radius: 22px;
      background: rgba(255,255,255,0.88); border: 1.5px solid rgba(255,255,255,1);
      box-shadow: 0 22px 44px -16px rgba(15,23,42,0.14);
    }
    .kv { font-size: ${isWide ? '38px' : '42px'}; font-weight: 850; letter-spacing: -0.04em; color: #0052FF; font-variant-numeric: tabular-nums; }
    .kl { margin-top: 4px; font-family: 'IBM Plex Mono', monospace; font-size: 13px; font-weight: 700; color: #5B6373; letter-spacing: 0.08em; text-transform: uppercase; }
    .phone-wrap { flex: ${isWide ? '0.95' : '1'}; display: flex; justify-content: center; align-items: center; }
    .iphone {
      width: ${isWide ? '440px' : '510px'}; border-radius: ${isWide ? '58px' : '74px'}; padding: ${isWide ? '14px' : '18px'};
      background: linear-gradient(145deg, #4B5262 0%, #171A21 50%, #303645 100%);
      box-shadow: 0 44px 86px -18px rgba(15,23,42,0.42), inset 0 2px 3px rgba(255,255,255,0.5);
    }
    .screen {
      border-radius: ${isWide ? '46px' : '58px'}; background: linear-gradient(180deg, #0D111A 0%, #07090F 100%);
      padding: ${isWide ? '22px 24px 18px' : '28px 32px 22px'}; color: #F8FAFC;
      border: 1px solid rgba(255,255,255,0.14);
      min-height: ${isWide ? '520px' : '640px'};
      display: flex; flex-direction: column; justify-content: space-between;
    }
    .sbar { display:flex; align-items:center; justify-content:space-between; margin-bottom: ${isWide ? '18px' : '24px'}; font-size: 14px; font-weight: 700; }
    .island { width: ${isWide ? '122px' : '150px'}; height: ${isWide ? '24px' : '28px'}; border-radius: 999px; background: #000; display:flex; align-items:center; justify-content:flex-end; padding-right: 9px; border: 1px solid rgba(255,255,255,0.12); }
    .cam { width: 9px; height: 9px; border-radius: 50%; background: radial-gradient(circle,#2563EB 20%,#090D1A 75%); }
    .ncard {
      border-radius: 20px; padding: ${isWide ? '16px 18px' : '18px 22px'}; margin-bottom: 14px;
      border: 1px solid rgba(255,255,255,0.12);
    }
    .nbad { background: rgba(244,63,94,0.13); border-color: rgba(244,63,94,0.34); }
    .ngood { background: rgba(16,185,129,0.13); border-color: rgba(16,185,129,0.38); }
    .nh { display:flex; justify-content:space-between; font-family:'IBM Plex Mono',monospace; font-size:12px; font-weight:700; letter-spacing:0.08em; margin-bottom:8px; }
    .nt { font-size: ${isWide ? '17px' : '20px'}; font-weight: 750; line-height: 1.28; color: #FFFFFF; }
    .nd { margin-top: 6px; font-family: 'IBM Plex Mono', monospace; font-size: ${isWide ? '13px' : '14px'}; color: rgba(255,255,255,0.74); }
    .hind { width: 140px; height: 5px; border-radius: 999px; background: rgba(255,255,255,0.34); margin: 14px auto 0; }
    .ft {
      display: flex; justify-content: space-between; align-items: center;
      padding-top: 18px; border-top: 1px solid rgba(10,14,26,0.1);
    }
    .ft-r { font-family: 'IBM Plex Mono', monospace; font-size: 14px; font-weight: 700; letter-spacing: 0.1em; color: #565E6E; }
  </style></head><body>
    <div class="top">
      <span>${esc(spec.eyebrow)}</span>
      <span class="badge-ok">● ${esc(spec.after_badge || 'PRODUCTION VERIFIED')}</span>
    </div>
    <div class="stage">
      <div class="copy">
        <div class="hl">${esc(spec.headline)}</div>
        <div class="sub">${esc(shorten(spec.subhead, isWide ? 140 : 165))}</div>
        <div class="kpis">
          <div class="kpi"><div class="kv">${esc(m0.value)}</div><div class="kl">${esc(m0.label)}</div></div>
          <div class="kpi"><div class="kv" style="color:#059669;">${esc(m1.value)}</div><div class="kl">${esc(m1.label)}</div></div>
        </div>
      </div>
      <div class="phone-wrap">
        <div class="iphone"><div class="screen">
          <div class="sbar"><span>9:41</span><div class="island"><span class="cam"></span></div><span>5G</span></div>
          <div class="ncard nbad">
            <div class="nh" style="color:#FDA4AF;"><span>● LEGACY ALERT</span><span>BEFORE</span></div>
            <div class="nt">${esc(spec.before_badge || spec.before_title)}</div>
            <div class="nd">${esc(bNodes.join(' → '))}</div>
          </div>
          <div class="ncard ngood">
            <div class="nh" style="color:#6EE7B7;"><span>✓ OLVEN ARCHITECTURE</span><span>LIVE</span></div>
            <div class="nt">${esc(spec.after_title.replace(/^After:\s*/i, ''))}</div>
            <div class="nd">${esc(aNodes.join(' → '))}</div>
          </div>
          <div class="hind"></div>
        </div></div>
      </div>
    </div>
    <div class="ft">
      ${seamlessLogo(28, '#090C14', '#EAE6DC')}
      <div class="ft-r">OLVENTECH.COM · MANHATTAN, NY</div>
    </div>
  </body></html>`;
}

function buildHtmlForArchetype(spec, p) {
  const arch = spec.visual_archetype || 'manhattan_swiss_poster';
  switch (arch) {
    case 'manhattan_swiss_poster': return renderManhattanSwissPoster(spec, p);
    case 'iphone_keynote_hardware': return renderIphoneKeynoteHardware(spec, p);
    case 'editorial_light_blueprint': return renderBillboardPoster(spec, p);
    case 'security_policy_shield_matrix': return renderSlackIncident(spec, p);
    case 'circuit_breaker_state_machine': return renderWhiteboardDiagram(spec, p);
    case 'split_latency_waterfall': return renderCodeDiffWindow(spec, p);
    case 'revenue_ledger_reconciliation': return renderTelemetryCliff(spec, p);
    case 'cdc_hash_diff_funnel': return renderMagazineSplit(spec, p);
    default: return renderManhattanSwissPoster(spec, p);
  }
}

function detectChromeExecutable() {
  for (const p of ['/usr/bin/google-chrome', '/usr/bin/chromium', '/usr/bin/chromium-browser']) {
    if (fs.existsSync(p)) return p;
  }
  return undefined;
}

function detectPhotoCraftCli() {
  const candidates = [
    process.env.PHOTOCRAFT_CLI,
    '/home/antigravity/.local/artcraft/photocraft/photocraft-0.23.1-linux-x86_64/bin/photocraft-cli',
    path.join(process.env.HOME || '', '.local/artcraft/photocraft/photocraft-0.23.1-linux-x86_64/bin/photocraft-cli'),
    '/usr/local/bin/photocraft-cli',
    '/usr/bin/photocraft-cli',
  ].filter(Boolean);
  for (const p of candidates) {
    if (fs.existsSync(p)) return p;
  }
  return null;
}

function detectLightCraftCli() {
  const candidates = [
    process.env.LIGHTCRAFT_CLI,
    '/home/antigravity/.local/artcraft/lightcraft/lightcraft-0.21.1-linux-x86_64/bin/lightcraft-cli',
    path.join(process.env.HOME || '', '.local/artcraft/lightcraft/lightcraft-0.21.1-linux-x86_64/bin/lightcraft-cli'),
    '/usr/local/bin/lightcraft-cli',
    '/usr/bin/lightcraft-cli',
  ].filter(Boolean);
  for (const p of candidates) {
    if (fs.existsSync(p)) return p;
  }
  return null;
}

// Bespoke per-archetype ArtCraft LightCraft (RAW tonal color grade) + PhotoCraft (micro-sharpen & grain) recipes
const EDITORIAL_GRADES = {
  manhattan_swiss_poster: {
    name: 'Klein Print Vivid',
    lc: ['light.contrast=8', 'color.vibrance=14', 'light.whites=4'],
    pc: { sharpen: 48, contrast: 3, vibrance: 8, noise: 0.70 },
  },
  iphone_keynote_hardware: {
    name: 'Cupertino Studio Porcelain',
    lc: ['light.contrast=6', 'light.highlights=-6', 'light.shadows=6', 'color.vibrance=8'],
    pc: { sharpen: 46, contrast: 3, vibrance: 6, noise: 0.55 },
  },
  editorial_light_blueprint: {
    name: 'Anthropic Warm Alabaster',
    lc: ['wb.temp=6600', 'light.contrast=5', 'light.whites=4', 'color.vibrance=10'],
    pc: { sharpen: 44, contrast: 3, vibrance: 8, noise: 0.50 },
  },
  security_policy_shield_matrix: {
    name: 'Titanium Slate Dark',
    lc: ['light.contrast=7', 'light.shadows=4', 'light.blacks=-4', 'color.vibrance=10'],
    pc: { sharpen: 46, contrast: 4, vibrance: 10, noise: 0.70 },
  },
  circuit_breaker_state_machine: {
    name: 'OpenAI Pure Ceramic Studio',
    lc: ['light.contrast=6', 'color.vibrance=11', 'light.highlights=-3'],
    pc: { sharpen: 48, contrast: 4, vibrance: 8, noise: 0.45 },
  },
  split_latency_waterfall: {
    name: 'Pro Display XDR Blue Hour',
    lc: ['light.contrast=8', 'light.blacks=-5', 'color.vibrance=14'],
    pc: { sharpen: 46, contrast: 4, vibrance: 10, noise: 0.65 },
  },
  revenue_ledger_reconciliation: {
    name: 'Midnight Navy XDR Telemetry',
    lc: ['light.contrast=8', 'light.blacks=-4', 'color.vibrance=14'],
    pc: { sharpen: 46, contrast: 4, vibrance: 10, noise: 0.65 },
  },
  cdc_hash_diff_funnel: {
    name: 'SoHo Matte Contrast',
    lc: ['light.contrast=9', 'light.shadows=4', 'color.vibrance=10'],
    pc: { sharpen: 46, contrast: 4, vibrance: 9, noise: 0.65 },
  },
};

async function renderCaseStudy(specPath, outDir) {
  const spec = JSON.parse(fs.readFileSync(specPath, 'utf8'));
  const arch = spec.visual_archetype || 'manhattan_swiss_poster';
  const grade = EDITORIAL_GRADES[arch] || EDITORIAL_GRADES.manhattan_swiss_poster;
  fs.mkdirSync(outDir, { recursive: true });

  const execPath = detectChromeExecutable();
  const pcCli = detectPhotoCraftCli();
  const lcCli = detectLightCraftCli();
  const browser = await chromium.launch({
    headless: true,
    ...(execPath ? { executablePath: execPath } : {}),
    args: ['--no-sandbox', '--disable-dev-shm-usage']
  });

  try {
    for (const p of PLATFORMS) {
      // 3x Super-Retina render -> Lanczos native pixel grid -> ArtCraft LightCraft RAW color grade -> PhotoCraft studio sharpen/dither
      const context = await browser.newContext({
        viewport: { width: p.width, height: p.height },
        deviceScaleFactor: 3
      });
      const page = await context.newPage();
      const html = buildHtmlForArchetype(spec, p);
      await page.setContent(html, { waitUntil: 'load' });
      await page.evaluate(() => document.fonts.ready);
      const outPath = path.join(outDir, p.name);
      await page.screenshot({ path: outPath, type: 'png' });
      await context.close();

      const tw = p.targetW || p.width;
      const th = p.targetH || p.height;
      execFileSync('python3', [
        '-c',
        `from PIL import Image; im = Image.open(${JSON.stringify(outPath)}).convert("RGB").resize((${tw}, ${th}), Image.Resampling.LANCZOS); im.save(${JSON.stringify(outPath)}, format="PNG", optimize=True)`
      ]);

      const toolsUsed = [];
      if (lcCli) {
        const tmpLc = outPath.replace(/\.png$/, '._lc.png');
        const lcArgs = ['render', outPath, '-o', tmpLc];
        for (const kv of grade.lc) lcArgs.push('--set', kv);
        execFileSync(lcCli, lcArgs, { stdio: 'pipe' });
        if (fs.existsSync(tmpLc)) {
          fs.renameSync(tmpLc, outPath);
          toolsUsed.push('LightCraft');
        }
      }

      if (pcCli) {
        execFileSync(pcCli, [
          'run', outPath,
          '--cmd', 'filter.sharpen.smartSharpen', '--params', JSON.stringify({ amount: grade.pc.sharpen, radius: 0.65, reduceNoise: 14 }),
          '--cmd', 'image.adjustments.brightnessContrast', '--params', JSON.stringify({ brightness: 0, contrast: grade.pc.contrast }),
          '--cmd', 'image.adjustments.vibrance', '--params', JSON.stringify({ vibrance: grade.pc.vibrance }),
          '--cmd', 'filter.noise.addNoise', '--params', JSON.stringify({ amount: grade.pc.noise, monochromatic: true }),
          '--out', outPath, '--in-place'
        ], { stdio: 'pipe' });
        toolsUsed.push('PhotoCraft');
      }

      const tag = toolsUsed.length ? ` + ${toolsUsed.join('×')} [${grade.name}]` : '';
      console.log(`Rendered ${p.name} [${arch}, 3x->${tw}x${th}${tag}] -> ${outDir}`);
    }
    fs.writeFileSync(
      path.join(outDir, 'visual-metadata.json'),
      JSON.stringify({
        visual_archetype: arch,
        grade_profile: grade.name,
        style_system: (lcCli && pcCli)
          ? 'artcraft-lightcraft-photocraft-manhattan-suite'
          : (pcCli ? 'artcraft-photocraft-apple-liquid-glass' : 'apple-liquid-glass-native-supersampled'),
        headline: spec.headline,
        rendered_at: new Date().toISOString()
      }, null, 2)
    );
  } finally {
    await browser.close();
  }
}

if (require.main === module) {
  const [specPath, outDir] = process.argv.slice(2);
  if (!specPath || !outDir) {
    console.error('Usage: node render_case_study.js <spec.json> <outDir>');
    process.exit(1);
  }
  renderCaseStudy(specPath, outDir).catch((err) => {
    console.error(err);
    process.exit(1);
  });
}

module.exports = { renderCaseStudy, ARCHETYPES };
