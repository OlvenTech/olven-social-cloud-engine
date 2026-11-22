#!/usr/bin/env node
/**
 * Olven Tech — Tier-1 Big Tech 3D Motion Studio (ArtCraft EffectCraft v0.24.1)
 *
 * Engineered to Apple / OpenAI / Anthropic (Claude) / Google / Linear motion & visual psychology:
 *  - ZERO abrupt whip-slams, ZERO 90-deg flips, ZERO 1-frame dark-to-white luminance flashes, ZERO radial smear.
 *  - Asymmetric Apple exponential deceleration (inInfluence: 86%, outInfluence: 28%) — glides to a velvety stop.
 *  - Cohesive single-world studio lighting per video with 0.65s overlapping cross-dissolves on Domes & Depth planes.
 *  - Gentle human-scale travel (64–88px), restrained ±1.8° micro-parallax, continuous breathing camera float.
 *  - 6 Iconic Tier-1 Visual Worlds rotating cleanly via OLVEN_SEQ_INDEX:
 *      1. anthropic_warm_editorial  (Claude Warm Alabaster · Terracotta · Charcoal Ink)
 *      2. apple_obsidian_titanium   (Apple Pro Obsidian · Brushed Titanium · Precision Sapphire)
 *      3. openai_ceramic_studio     (OpenAI Pure Ceramic White · Pearl Mist · Studio Cobalt)
 *      4. stripe_linear_precision   (Stripe / Linear Midnight Slate · Amber Pain → Emerald Relief)
 *      5. google_deepmind_luminous  (Google DeepMind Paper · Soft Ice · Research Cobalt)
 *      6. manhattan_executive_noir  (Manhattan Warm Carbon · Ivory · Champagne Gold)
 *  - Output: 1080x1920 30fps H.264 9.2 Mbps Rec.709 (strictly <= 19.4 MB CDN-safe) + NYC Felt Piano.
 */
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

let chromium;
try { ({ chromium } = require('playwright')); } catch {
  try { ({ chromium } = require('playwright-core')); } catch {
    chromium = require('/home/antigravity/.npm/_npx/e41f203b7505f1fb/node_modules/playwright-core').chromium;
  }
}

const WIDTH = 1080;
const HEIGHT = 1920;
const FPS = 30;
const DURATION = 16.0;

const ASSETS_DIR = path.join(__dirname, 'assets');
const MUSIC_DIR = path.join(ASSETS_DIR, 'music');

const DIRECTORS = {
  anthropic_warm_editorial: {
    name: 'anthropic_warm_editorial',
    label: 'NEW YORK · ARCHITECTURE',
    isDark: false,
    track: 'nyc_felt_piano_mvt1.mp3',
    motionStyle: 'anthropic_warm_drift',
    // Cohesive Claude / Anthropic Warm Alabaster & Linen Paper (zero harsh flashes!)
    domes: [
      [[0.968, 0.955, 0.928, 1.0], [0.922, 0.902, 0.862, 1.0]],
      [[0.962, 0.948, 0.922, 1.0], [0.914, 0.894, 0.855, 1.0]],
      [[0.966, 0.954, 0.930, 1.0], [0.916, 0.900, 0.868, 1.0]],
      [[0.972, 0.958, 0.932, 1.0], [0.925, 0.905, 0.865, 1.0]],
      [[0.964, 0.950, 0.924, 1.0], [0.915, 0.895, 0.856, 1.0]],
    ],
    ink: '#141413',
    inkMuted: '#57534E',
    accent: '#C96442',        // Anthropic Terracotta Clay
    accentSoft: '#F3E5DE',
    proofColor: '#166534',    // Deep Forest Emerald
    proofSoft: '#E3F2E8',
    alert: '#B91C1C',
    alertSoft: '#FDECEC',
    surfaceBg: 'rgba(255, 253, 249, 0.88)',
    surfaceBorder: 'rgba(20, 20, 19, 0.10)',
    depthMotif: 'editorial_hairlines',
    ctaHeadline: ['Engineered for', 'systems that', 'never leak.'],
    ctaSub: 'OLVENTECH.COM · NEW YORK',
  },

  apple_obsidian_titanium: {
    name: 'apple_obsidian_titanium',
    label: 'NEW YORK · SYSTEMS',
    isDark: true,
    track: 'nyc_felt_piano_mvt2.mp3',
    motionStyle: 'apple_silk_float',
    // Cohesive Apple Keynote Space-Black Obsidian & Sapphire Ambient Depth
    domes: [
      [[0.062, 0.088, 0.145, 1.0], [0.022, 0.026, 0.038, 1.0]],
      [[0.085, 0.068, 0.095, 1.0], [0.024, 0.026, 0.036, 1.0]],
      [[0.048, 0.105, 0.135, 1.0], [0.020, 0.025, 0.036, 1.0]],
      [[0.052, 0.118, 0.112, 1.0], [0.020, 0.026, 0.035, 1.0]],
      [[0.058, 0.082, 0.140, 1.0], [0.020, 0.024, 0.036, 1.0]],
    ],
    ink: '#F8FAFC',
    inkMuted: '#94A3B8',
    accent: '#60A5FA',        // Precision Sapphire
    accentSoft: 'rgba(96, 165, 250, 0.14)',
    proofColor: '#34D399',    // Signal Emerald
    proofSoft: 'rgba(52, 211, 153, 0.14)',
    alert: '#FB7185',
    alertSoft: 'rgba(251, 113, 133, 0.14)',
    surfaceBg: 'rgba(20, 25, 36, 0.80)',
    surfaceBorder: 'rgba(255, 255, 255, 0.14)',
    depthMotif: 'spatial_rings',
    ctaHeadline: ['Precision', 'production', 'engineering.'],
    ctaSub: 'OLVENTECH.COM · NEW YORK',
  },

  openai_ceramic_studio: {
    name: 'openai_ceramic_studio',
    label: 'NEW YORK · ENGINEERING',
    isDark: false,
    track: 'nyc_felt_piano_mvt3.mp3',
    motionStyle: 'openai_editorial_glide',
    // Cohesive OpenAI Ceramic White & Subtle Pearl Sky Mist
    domes: [
      [[0.985, 0.990, 1.000, 1.0], [0.928, 0.948, 0.988, 1.0]],
      [[0.988, 0.986, 0.996, 1.0], [0.940, 0.938, 0.975, 1.0]],
      [[0.982, 0.994, 0.994, 1.0], [0.922, 0.958, 0.962, 1.0]],
      [[0.984, 0.996, 0.990, 1.0], [0.920, 0.962, 0.946, 1.0]],
      [[0.985, 0.990, 1.000, 1.0], [0.928, 0.948, 0.988, 1.0]],
    ],
    ink: '#0A0B0E',
    inkMuted: '#4B5563',
    accent: '#1D4ED8',        // OpenAI / Swiss Studio Cobalt
    accentSoft: '#E8EFFD',
    proofColor: '#047857',
    proofSoft: '#E2F6EF',
    alert: '#DC2626',
    alertSoft: '#FEECEC',
    surfaceBg: 'rgba(255, 255, 255, 0.88)',
    surfaceBorder: 'rgba(15, 23, 42, 0.09)',
    depthMotif: 'studio_grid',
    ctaHeadline: ['Built for', 'enterprise', 'reliability.'],
    ctaSub: 'OLVENTECH.COM · NEW YORK',
  },

  stripe_linear_precision: {
    name: 'stripe_linear_precision',
    label: 'NEW YORK · INFRASTRUCTURE',
    isDark: true,
    track: 'nyc_felt_piano_mvt1.mp3',
    motionStyle: 'stripe_precision_reveal',
    // Cohesive Stripe / Linear Deep Indigo-Slate
    domes: [
      [[0.070, 0.082, 0.165, 1.0], [0.024, 0.028, 0.052, 1.0]],
      [[0.095, 0.075, 0.135, 1.0], [0.026, 0.028, 0.048, 1.0]],
      [[0.052, 0.112, 0.142, 1.0], [0.022, 0.030, 0.046, 1.0]],
      [[0.045, 0.128, 0.118, 1.0], [0.020, 0.030, 0.042, 1.0]],
      [[0.068, 0.080, 0.160, 1.0], [0.024, 0.028, 0.050, 1.0]],
    ],
    ink: '#FFFFFF',
    inkMuted: '#94A3B8',
    accent: '#818CF8',        // Stripe / Linear Soft Indigo
    accentSoft: 'rgba(129, 140, 248, 0.15)',
    proofColor: '#34D399',
    proofSoft: 'rgba(52, 211, 153, 0.15)',
    alert: '#F59E0B',         // High-contrast Amber Alert
    alertSoft: 'rgba(245, 158, 11, 0.14)',
    surfaceBg: 'rgba(18, 23, 38, 0.82)',
    surfaceBorder: 'rgba(255, 255, 255, 0.13)',
    depthMotif: 'telemetry_dotgrid',
    ctaHeadline: ['Ship backends', 'that never', 'drop revenue.'],
    ctaSub: 'OLVENTECH.COM · NEW YORK',
  },

  google_deepmind_luminous: {
    name: 'google_deepmind_luminous',
    label: 'NEW YORK · RESEARCH',
    isDark: false,
    track: 'nyc_felt_piano_mvt2.mp3',
    motionStyle: 'apple_silk_float',
    // Cohesive Google DeepMind Luminous Paper & Soft Atmospheric Blue
    domes: [
      [[0.980, 0.990, 1.000, 1.0], [0.910, 0.945, 0.995, 1.0]],
      [[0.988, 0.984, 0.988, 1.0], [0.945, 0.928, 0.935, 1.0]],
      [[0.978, 0.994, 0.988, 1.0], [0.908, 0.958, 0.935, 1.0]],
      [[0.980, 0.995, 0.990, 1.0], [0.912, 0.960, 0.940, 1.0]],
      [[0.980, 0.990, 1.000, 1.0], [0.910, 0.945, 0.995, 1.0]],
    ],
    ink: '#0F172A',
    inkMuted: '#475569',
    accent: '#1A73E8',        // Google DeepMind Blue
    accentSoft: '#E8F0FE',
    proofColor: '#188038',    // Google Signal Green
    proofSoft: '#E6F4EA',
    alert: '#D93025',         // Google Coral Red
    alertSoft: '#FCE8E6',
    surfaceBg: 'rgba(255, 255, 255, 0.90)',
    surfaceBorder: 'rgba(26, 115, 232, 0.12)',
    depthMotif: 'spatial_rings',
    ctaHeadline: ['Deterministic', 'systems.', 'Zero guesswork.'],
    ctaSub: 'OLVENTECH.COM · NEW YORK',
  },

  manhattan_executive_noir: {
    name: 'manhattan_executive_noir',
    label: 'MANHATTAN · EXECUTIVE',
    isDark: true,
    track: 'nyc_felt_piano_mvt3.mp3',
    motionStyle: 'openai_editorial_glide',
    // Cohesive Wall Street / Leica Warm Carbon & Champagne Gold
    domes: [
      [[0.088, 0.082, 0.072, 1.0], [0.026, 0.024, 0.022, 1.0]],
      [[0.098, 0.076, 0.070, 1.0], [0.028, 0.024, 0.022, 1.0]],
      [[0.075, 0.092, 0.082, 1.0], [0.024, 0.026, 0.024, 1.0]],
      [[0.082, 0.096, 0.078, 1.0], [0.024, 0.026, 0.022, 1.0]],
      [[0.088, 0.082, 0.072, 1.0], [0.026, 0.024, 0.022, 1.0]],
    ],
    ink: '#FAF7F0',
    inkMuted: '#A8A29E',
    accent: '#E5B84B',        // Champagne Gold
    accentSoft: 'rgba(229, 184, 75, 0.15)',
    proofColor: '#4ADE80',
    proofSoft: 'rgba(74, 222, 128, 0.14)',
    alert: '#F87171',
    alertSoft: 'rgba(248, 113, 113, 0.14)',
    surfaceBg: 'rgba(28, 25, 22, 0.84)',
    surfaceBorder: 'rgba(250, 247, 240, 0.13)',
    depthMotif: 'editorial_hairlines',
    ctaHeadline: ['Manhattan', 'systems', 'engineering.'],
    ctaSub: 'OLVENTECH.COM · NEW YORK',
  },
};

const DIRECTOR_ORDER = [
  'anthropic_warm_editorial',
  'apple_obsidian_titanium',
  'openai_ceramic_studio',
  'stripe_linear_precision',
  'google_deepmind_luminous',
  'manhattan_executive_noir',
];

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
  for (const c of candidates) {
    if (fs.existsSync(c)) return c;
  }
  return 'effectcraft-cli';
}

/**
 * Human-Psychology Editorial Script Compiler:
 * Turns any B2B engineering spec into a 5-act thumb-stopping narrative:
 *   Act 1 (Hook)  -> Pattern-interrupt loss aversion / curiosity gap (< 0.8s read)
 *   Act 2 (Pain)  -> Relatable operational bottleneck (Before)
 *   Act 3 (Fix)   -> The Olven Architecture Difference (3 clean steps)
 *   Act 4 (Proof) -> Monumental Before -> After ROI contrast
 *   Act 5 (Brand) -> Quiet, high-status Manhattan firm signature
 */
function compileEditorialScript(spec) {
  const m0 = (spec.metrics && spec.metrics[0]) || { value: '99.9%', label: 'RELIABILITY', sub: 'Production verified' };
  const m1 = (spec.metrics && spec.metrics[1]) || { value: '$0', label: 'LEAKAGE', sub: 'Zero lost events' };
  const m2 = (spec.metrics && spec.metrics[2]) || { value: '0', label: 'DOWNTIME', sub: 'Full audit trail' };

  const bNodes = ((spec.viral_before_nodes && spec.viral_before_nodes.length) ? spec.viral_before_nodes : (spec.before_nodes || ['Direct API Call', 'Rate Limit Hit', 'Silent Data Loss'])).slice(0, 3);
  const aNodes = ((spec.viral_after_nodes && spec.viral_after_nodes.length) ? spec.viral_after_nodes : (spec.after_nodes || ['Lock Payment First', 'Stamp 1 Unique ID', 'Verify Before Retry'])).slice(0, 3);

  const domainRaw = String(spec.eyebrow || 'REAL CLIENT STORY').split('·')[1] || String(spec.eyebrow || 'REAL RESULT').split('·')[0];
  const domainShort = domainRaw.trim().split(/\s+/).slice(0, 2).join(' ').toUpperCase();

  const badBadge = String(spec.viral_before_stat || spec.before_badge || '').trim();
  const hl = stripHtml(spec.viral_headline || spec.headline || 'One tiny bug cost $64,000.');
  const hlLower = (hl + ' ' + JSON.stringify(spec.keywords || [])).toLowerCase();

  let hookL1 = 'One silent bug';
  let hookL2 = 'was quietly';
  let hookAccent = 'burning cash.';

  if (Array.isArray(spec.viral_hook_lines) && spec.viral_hook_lines.length === 3) {
    [hookL1, hookL2, hookAccent] = spec.viral_hook_lines.map((s) => stripHtml(s));
  } else if (/\b(snowflake|bigquery|warehouse|rollup|scan)\b/.test(hlLower)) {
    hookL1 = 'Their cloud bill';
    hookL2 = 'was paying to';
    hookAccent = 'scan old data.';
  } else if (/\b(ach|wire|disbursement|double|payout|bank)\b/.test(hlLower)) {
    hookL1 = 'A 30-second glitch';
    hookL2 = 'wired the same';
    hookAccent = '$64,000 twice.';
  } else if (/\b(retry|retries|storm|backoff|bulkhead|jitter)\b/.test(hlLower)) {
    hookL1 = 'A 15-second dip';
    hookL2 = 'crashed their app';
    hookAccent = 'for 42 minutes.';
  } else if (/\b(pagerduty|slo|burn-rate|cpu|3 am|alert)\b/.test(hlLower)) {
    hookL1 = '84 fake 3 AM';
    hookL2 = 'alarms made them';
    hookAccent = 'miss a real crash.';
  } else if (/\b(lead|hubspot|routing|revops)\b/.test(hlLower)) {
    hookL1 = 'A 19-minute delay';
    hookL2 = 'was killing';
    hookAccent = 'hot sales leads.';
  } else if (/\b(stripe|billing|usage|metering|quickbooks|proration)\b/.test(hlLower)) {
    hookL1 = '$19,000/month';
    hookL2 = 'kept vanishing';
    hookAccent = 'from their books.';
  } else if (/\b(deadlock|32 workers|fulfillment|warehouse)\b/.test(hlLower)) {
    hookL1 = 'Adding 32 workers';
    hookL2 = 'made this company';
    hookAccent = '9x SLOWER.';
  } else if (/\b(soc-2|soc2|audit|screenshot|compliance)\b/.test(hlLower)) {
    hookL1 = '110 hours of';
    hookL2 = 'audit screenshots.';
    hookAccent = 'Now 1 click.';
  } else if (/\b(edi|sftp|typo|chargeback|fines)\b/.test(hlLower)) {
    hookL1 = '1 tiny typo in';
    hookL2 = 'a midnight file';
    hookAccent = 'cost $95,000/yr.';
  } else {
    const words = hl.split(/\s+/);
    hookL1 = words.slice(0, 3).join(' ');
    hookL2 = words.slice(3, 6).join(' ');
    hookAccent = m0.value;
  }

  if (hookAccent.length > 20) hookAccent = m0.value;
  if (!/[.!?%]$/.test(hookAccent) && !hookAccent.includes('/')) hookAccent = hookAccent + '.';

  let heroMetric = m0;
  for (const m of [m0, m1, m2]) {
    if (String(m.value).includes('$') || String(m.value).includes('%') || String(m.value).includes('x')) {
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
  const painKicker = badBadge ? badBadge.toUpperCase() : cleanTag(m1.sub).toUpperCase();
  const hookFoot = cleanTag(spec.viral_subhead || heroMetric.sub || 'Real client result · fixed in days.');

  return {
    domainShort,
    hookL1,
    hookL2,
    hookAccent,
    hookFoot,
    beforeStat: badBadge || cleanTag(spec.before_title || 'BROKEN LEGACY FLOW').replace(/^Before:\s*/i, ''),
    diagLines: [cleanTag(bNodes[0]), cleanTag(bNodes[1] || 'System Stalled'), cleanTag(bNodes[2] || 'Silent Cash Leak')],
    painKicker,
    archSteps: [
      { num: '01', title: cleanTag(aNodes[0]) },
      { num: '02', title: cleanTag(aNodes[1]) },
      { num: '03', title: cleanTag(aNodes[2]) },
    ],
    archFoot: cleanTag(spec.after_badge || 'Fixed in days · Zero rebuild'),
    heroVal: cleanTag(heroMetric.value),
    heroFontPx: cleanTag(heroMetric.value).length >= 7 ? 148 : (cleanTag(heroMetric.value).length >= 5 ? 176 : 208),
    heroLabel,
    heroSub,
    subA: { val: cleanTag(subA.value), lbl: cleanTag(subA.label).toLowerCase() },
    subB: { val: cleanTag(subB.value), lbl: cleanTag(subB.label).toLowerCase() },
  };
}

function buildDepthPlaneHtml(idx, dir, interB64, monoB64) {
  const stroke = dir.isDark ? 'rgba(255,255,255,0.08)' : 'rgba(15,23,42,0.07)';
  const ghostInk = dir.isDark ? 'rgba(255,255,255,0.038)' : 'rgba(15,23,42,0.036)';
  const num = `0${idx + 1}`;

  // Sleek 5-segment Story Progress Bar (boosts Reels & LinkedIn watch-through completion!)
  const progSegments = [0, 1, 2, 3, 4].map((i) => {
    const active = i <= idx;
    const bg = active ? dir.accent : (dir.isDark ? 'rgba(255,255,255,0.16)' : 'rgba(15,23,42,0.12)');
    const op = i === idx ? '1' : (active ? '0.55' : '1');
    return `<div style="flex:1;height:6px;border-radius:999px;background:${bg};opacity:${op};"></div>`;
  }).join('');
  const progressBar = `
    <div style="position:absolute;top:118px;left:110px;right:110px;display:flex;gap:14px;z-index:5;">
      ${progSegments}
    </div>
  `;

  let inner = '';
  if (dir.depthMotif === 'editorial_hairlines') {
    inner = `
      <div style="position:absolute;inset:72px;border:1px solid ${stroke};border-radius:36px;"></div>
      <div style="position:absolute;top:152px;right:84px;font-family:'Inter',sans-serif;font-weight:800;font-size:300px;line-height:0.85;letter-spacing:-0.06em;color:${ghostInk};">${num}</div>
      <div style="position:absolute;bottom:108px;left:108px;font-family:'IBM Plex Mono',monospace;font-size:18px;letter-spacing:0.22em;color:${stroke};">OLVEN TECH · ${dir.label}</div>
    `;
  } else if (dir.depthMotif === 'studio_grid') {
    inner = `
      <div style="position:absolute;inset:76px;background-image:linear-gradient(${stroke} 1px, transparent 1px),linear-gradient(90deg, ${stroke} 1px, transparent 1px);background-size:96px 96px;opacity:0.65;"></div>
      <div style="position:absolute;bottom:108px;left:108px;font-family:'IBM Plex Mono',monospace;font-size:18px;letter-spacing:0.22em;color:${stroke};">OLVEN TECH // ${num}</div>
    `;
  } else if (dir.depthMotif === 'telemetry_dotgrid') {
    inner = `
      <div style="position:absolute;inset:64px;background-image:radial-gradient(${stroke} 2px, transparent 2px);background-size:48px 48px;"></div>
      <div style="position:absolute;top:174px;left:96px;right:96px;height:1px;background:linear-gradient(90deg,transparent,${dir.accent}33,transparent);"></div>
      <div style="position:absolute;bottom:164px;left:96px;right:96px;height:1px;background:linear-gradient(90deg,transparent,${dir.proofColor}33,transparent);"></div>
    `;
  } else {
    inner = `
      <div style="position:absolute;top:50%;left:50%;width:920px;height:920px;transform:translate(-50%,-50%);border-radius:50%;border:1px solid ${stroke};"></div>
      <div style="position:absolute;top:50%;left:50%;width:660px;height:660px;transform:translate(-50%,-50%);border-radius:50%;border:1px solid ${stroke};"></div>
      <div style="position:absolute;top:50%;left:50%;width:1180px;height:1180px;transform:translate(-50%,-50%);border-radius:50%;border:1px dashed ${stroke};"></div>
    `;
  }

  return `<!doctype html><html><head><meta charset="utf-8"><style>
    @font-face { font-family: 'Inter'; src: url('data:font/woff2;base64,${interB64}') format('woff2'); font-weight: 100 900; }
    @font-face { font-family: 'IBM Plex Mono'; src: url('data:font/woff2;base64,${monoB64}') format('woff2'); font-weight: 400 700; }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    html, body { width: 1080px; height: 1920px; background: transparent; overflow: hidden; position: relative; }
  </style></head><body>${progressBar}${inner}</body></html>`;
}

function buildForegroundChipHtml(idx, script, dir, interB64, monoB64) {
  const pillBg = dir.isDark ? 'rgba(22, 26, 36, 0.92)' : 'rgba(255, 255, 255, 0.96)';
  const pillBorder = dir.isDark ? 'rgba(255,255,255,0.18)' : 'rgba(15,23,42,0.12)';
  const pillInk = dir.ink;

  const chipCss = `
    @font-face { font-family: 'Inter'; src: url('data:font/woff2;base64,${interB64}') format('woff2'); font-weight: 100 900; }
    @font-face { font-family: 'IBM Plex Mono'; src: url('data:font/woff2;base64,${monoB64}') format('woff2'); font-weight: 400 700; }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    html, body {
      width: 960px; height: 340px; background: transparent; overflow: hidden;
      font-family: 'Inter', -apple-system, sans-serif; -webkit-font-smoothing: antialiased;
      display: flex; align-items: center; justify-content: center; padding: 20px;
    }
    .pill {
      display: inline-flex; align-items: center; gap: 16px;
      padding: 22px 38px; border-radius: 999px;
      background: ${pillBg}; border: 1.5px solid ${pillBorder}; color: ${pillInk};
      font-family: 'IBM Plex Mono', monospace; font-size: 22px; font-weight: 700;
      letter-spacing: 0.08em; text-transform: uppercase;
      box-shadow: 0 18px 44px -14px rgba(0,0,0,${dir.isDark ? '0.55' : '0.12'});
    }
    .dot { width: 12px; height: 12px; border-radius: 50%; flex-shrink: 0; }
    .dual { display: flex; gap: 20px; width: 100%; justify-content: center; }
    .mini {
      flex: 1; max-width: 410px; padding: 26px 32px; border-radius: 28px;
      background: ${pillBg}; border: 1.5px solid ${pillBorder}; color: ${pillInk};
      display: flex; flex-direction: column; gap: 6px;
      box-shadow: 0 20px 48px -14px rgba(0,0,0,${dir.isDark ? '0.55' : '0.12'});
    }
    .mv { font-size: 46px; font-weight: 850; letter-spacing: -0.04em; font-variant-numeric: tabular-nums; color: ${dir.ink}; }
    .ml { font-family: 'IBM Plex Mono', monospace; font-size: 18px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; color: ${dir.inkMuted}; }
  `;

  let body = '';
  if (idx === 0) {
    body = `<div class="pill" style="border-color:${dir.accent}55;"><span class="dot" style="background:${dir.accent};"></span><span>REAL STORY · ${esc(script.domainShort)}</span></div>`;
  } else if (idx === 1) {
    body = `<div class="pill" style="border-color:${dir.alert}55;"><span class="dot" style="background:${dir.alert};"></span><span style="color:${dir.alert};">${esc(script.painKicker)}</span></div>`;
  } else if (idx === 2) {
    body = `<div class="pill" style="border-color:${dir.proofColor}55;"><span class="dot" style="background:${dir.proofColor};"></span><span style="color:${dir.proofColor};">${esc(script.archFoot)}</span></div>`;
  } else if (idx === 3) {
    body = `
      <div class="dual">
        <div class="mini"><div class="mv">${esc(script.subA.val)}</div><div class="ml">${esc(script.subA.lbl)}</div></div>
        <div class="mini"><div class="mv">${esc(script.subB.val)}</div><div class="ml">${esc(script.subB.lbl)}</div></div>
      </div>`;
  } else {
    const ctaBg = dir.isDark ? '#FFFFFF' : '#141413';
    const ctaInk = dir.isDark ? '#0A0B0E' : '#FAF8F5';
    body = `<div class="pill" style="background:${ctaBg};color:${ctaInk};border:none;padding:24px 44px;font-size:21px;letter-spacing:0.05em;text-transform:none;"><span>Save this  ·  contact@olventech.com</span></div>`;
  }

  return `<!doctype html><html><head><meta charset="utf-8"><style>${chipCss}</style></head><body>${body}</body></html>`;
}

function buildHeroCardsHtml(script, dir, interB64, monoB64) {
  const logoUri = dir.isDark
    ? loadTransparentLogoDataUri('#F8FAFC', '#141924')
    : loadTransparentLogoDataUri('#141413', '#FFFDF9');

  const baseCss = `
    @font-face { font-family: 'Inter'; src: url('data:font/woff2;base64,${interB64}') format('woff2'); font-weight: 100 900; }
    @font-face { font-family: 'IBM Plex Mono'; src: url('data:font/woff2;base64,${monoB64}') format('woff2'); font-weight: 400 700; }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    html, body {
      width: 960px; height: 1420px; background: transparent; overflow: hidden;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif;
      -webkit-font-smoothing: antialiased;
      display: flex; flex-direction: column; justify-content: center; padding: 40px;
    }
    .panel {
      position: relative; border-radius: 40px; padding: 62px 56px; overflow: hidden;
      background: ${dir.surfaceBg};
      border: 1.5px solid ${dir.surfaceBorder};
      box-shadow: 0 36px 84px -22px rgba(0, 0, 0, ${dir.isDark ? '0.68' : '0.11'});
      color: ${dir.ink};
    }
    .eyebrow {
      display: flex; justify-content: space-between; align-items: center;
      margin-bottom: 36px; font-family: 'IBM Plex Mono', monospace;
      font-size: 19px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase;
      color: ${dir.inkMuted};
    }
    .badge {
      display: inline-flex; align-items: center; gap: 10px;
      padding: 10px 18px; border-radius: 999px;
      font-family: 'IBM Plex Mono', monospace; font-size: 17px; font-weight: 700;
      letter-spacing: 0.1em; text-transform: uppercase;
    }
  `;

  // SCENE 0: Viral Scroll-Stop Story Hook (0.7-second 5th-grade read!)
  const scene0 = `<!doctype html><html><head><meta charset="utf-8"><style>${baseCss}
    .wrap { padding: 20px 14px; color: ${dir.ink}; }
    .brand-ey {
      display: inline-flex; align-items: center; gap: 14px; margin-bottom: 40px;
      font-family: 'IBM Plex Mono', monospace; font-size: 20px; font-weight: 700;
      letter-spacing: 0.16em; color: ${dir.inkMuted};
    }
    .bdot { width: 10px; height: 10px; border-radius: 50%; background: ${dir.accent}; }
    .h { font-size: 104px; font-weight: 880; line-height: 1.02; letter-spacing: -0.052em; color: ${dir.ink}; }
    .ha { font-size: 112px; font-weight: 900; line-height: 0.98; letter-spacing: -0.056em; color: ${dir.accent}; margin-top: 10px; }
    .rule { margin-top: 44px; height: 4px; width: 110px; border-radius: 99px; background: ${dir.accent}; opacity: 0.85; }
    .ft { margin-top: 24px; font-size: 29px; font-weight: 560; line-height: 1.38; color: ${dir.inkMuted}; max-width: 800px; }
  </style></head><body>
    <div class="wrap">
      <div class="brand-ey"><span class="bdot"></span><span>OLVEN TECH · REAL CLIENT STORY</span></div>
      <div class="h">${esc(script.hookL1)}</div>
      <div class="h">${esc(script.hookL2)}</div>
      <div class="ha">${esc(script.hookAccent)}</div>
      <div class="rule"></div>
      <div class="ft">${esc(script.hookFoot)}</div>
    </div>
  </body></html>`;

  // SCENE 1: Plain-English Domino Chain ("How It Happened" — instant human curiosity!)
  const scene1 = `<!doctype html><html><head><meta charset="utf-8"><style>${baseCss}
    .title { font-size: 54px; font-weight: 850; letter-spacing: -0.042em; line-height: 1.08; margin-bottom: 36px; color: ${dir.ink}; }
    .item {
      display: flex; align-items: center; gap: 22px; padding: 26px 0;
      border-top: 1px solid ${dir.surfaceBorder};
    }
    .idx {
      font-family: 'IBM Plex Mono', monospace; font-size: 20px; font-weight: 800;
      color: ${dir.alert}; background: ${dir.alertSoft};
      padding: 10px 16px; border-radius: 14px; flex-shrink: 0;
    }
    .txt { font-size: 38px; font-weight: 760; letter-spacing: -0.03em; line-height: 1.2; color: ${dir.ink}; }
  </style></head><body>
    <div class="panel">
      <div class="eyebrow">
        <span class="badge" style="background:${dir.alertSoft};color:${dir.alert};">● WHAT WENT WRONG</span>
        <span>02 / 05</span>
      </div>
      <div class="title">How one glitch spiraled fast.</div>
      <div class="item"><span class="idx">01</span><div class="txt">${esc(script.diagLines[0])}</div></div>
      <div class="item"><span class="idx">02</span><div class="txt">${esc(script.diagLines[1])}</div></div>
      <div class="item"><span class="idx">03</span><div class="txt">${esc(script.diagLines[2])}</div></div>
    </div>
  </body></html>`;

  // SCENE 2: The Simple 3-Step Fix (Plain English — Zero Jargon!)
  const scene2 = `<!doctype html><html><head><meta charset="utf-8"><style>${baseCss}
    .title { font-size: 56px; font-weight: 850; letter-spacing: -0.042em; line-height: 1.06; margin-bottom: 36px; color: ${dir.ink}; }
    .step {
      display: flex; align-items: center; gap: 24px; padding: 30px 34px; border-radius: 26px;
      background: ${dir.surfaceBg}; border: 1.5px solid ${dir.surfaceBorder};
      box-shadow: 0 22px 54px -18px rgba(0, 0, 0, ${dir.isDark ? '0.55' : '0.09'});
    }
    .conn { width: 2px; height: 22px; background: ${dir.proofColor}; opacity: 0.45; margin-left: 48px; }
    .num {
      font-family: 'IBM Plex Mono', monospace; font-size: 21px; font-weight: 800;
      color: ${dir.proofColor}; background: ${dir.proofSoft};
      padding: 10px 16px; border-radius: 14px; flex-shrink: 0;
    }
    .st { font-size: 36px; font-weight: 760; letter-spacing: -0.03em; color: ${dir.ink}; }
  </style></head><body>
    <div style="padding: 12px;">
      <div class="eyebrow" style="margin-bottom: 20px;">
        <span class="badge" style="background:${dir.proofSoft};color:${dir.proofColor};">✓ THE OLVEN FIX</span>
        <span>03 / 05</span>
      </div>
      <div class="title">Fixed in days. 3 simple steps.</div>
      ${script.archSteps.map((s, i) => `
        <div class="step"><span class="num">${s.num}</span><span class="st">${esc(s.title)}</span></div>
        ${i < 2 ? '<div class="conn"></div>' : ''}
      `).join('')}
    </div>
  </body></html>`;

  // SCENE 3: Dopamine BEFORE -> AFTER Payoff Reveal (Struck-through pain -> Huge Emerald Win!)
  const scene3 = `<!doctype html><html><head><meta charset="utf-8"><style>${baseCss}
    .before-strike {
      display: inline-flex; align-items: center; gap: 12px;
      padding: 12px 22px; border-radius: 16px; margin-bottom: 18px;
      background: ${dir.alertSoft}; color: ${dir.alert};
      font-family: 'IBM Plex Mono', monospace; font-size: 22px; font-weight: 800;
      letter-spacing: 0.06em; text-decoration: line-through; text-decoration-thickness: 3px;
    }
    .hn {
      font-size: ${script.heroFontPx}px; font-weight: 900; line-height: 0.92;
      letter-spacing: -0.06em; color: ${dir.proofColor}; font-variant-numeric: tabular-nums;
      margin-top: 6px;
    }
    .hl { margin-top: 24px; font-size: 48px; font-weight: 840; letter-spacing: -0.04em; color: ${dir.ink}; line-height: 1.08; }
    .hs { margin-top: 14px; font-size: 28px; font-weight: 540; color: ${dir.inkMuted}; line-height: 1.38; }
  </style></head><body>
    <div class="panel">
      <div class="eyebrow">
        <span class="badge" style="background:${dir.proofSoft};color:${dir.proofColor};">✓ REAL RESULT</span>
        <span>04 / 05</span>
      </div>
      <div class="before-strike">BEFORE: ${esc(script.beforeStat)}</div>
      <div class="hn">${esc(script.heroVal)}</div>
      <div class="hl">${esc(script.heroLabel)}.</div>
      <div class="hs">${esc(script.heroSub)}</div>
    </div>
  </body></html>`;

  // SCENE 4: Memorable, Shareable Brand Differentiation Close
  const scene4 = `<!doctype html><html><head><meta charset="utf-8"><style>${baseCss}
    .wrap { padding: 20px 14px; color: ${dir.ink}; }
    .cl { font-size: 82px; font-weight: 880; line-height: 1.04; letter-spacing: -0.05em; color: ${dir.ink}; }
    .ca { color: ${dir.accent}; }
    .sub-cta { margin-top: 22px; font-size: 29px; font-weight: 560; color: ${dir.inkMuted}; line-height: 1.36; }
    .brand {
      margin-top: 48px; padding: 34px 40px; border-radius: 30px;
      background: ${dir.surfaceBg}; border: 1.5px solid ${dir.surfaceBorder};
      box-shadow: 0 28px 68px -20px rgba(0, 0, 0, ${dir.isDark ? '0.60' : '0.10'});
      display: flex; align-items: center; justify-content: space-between;
    }
    .logo { height: 48px; width: auto; display: block; }
    .city { font-family: 'IBM Plex Mono', monospace; font-size: 19px; font-weight: 700; letter-spacing: 0.14em; color: ${dir.inkMuted}; }
  </style></head><body>
    <div class="wrap">
      <div class="eyebrow" style="margin-bottom: 30px;"><span>OLVEN TECH · NEW YORK</span><span>05 / 05</span></div>
      <div class="cl">Others pitch</div>
      <div class="cl">6-month rebuilds.</div>
      <div class="cl ca">We fix it in days.</div>
      <div class="sub-cta">Follow for real software stories that save real money.</div>
      <div class="brand">
        ${logoUri ? `<img class="logo" src="${logoUri}" alt="Olven Tech" />` : `<div style="font-size:38px;font-weight:800;">Olven Tech</div>`}
        <span class="city">${esc(dir.ctaSub)}</span>
      </div>
    </div>
  </body></html>`;

  return [scene0, scene1, scene2, scene3, scene4];
}

async function renderMultiPlaneAssets(script, dir, workDir) {
  const interB64 = fontBase64('Inter.woff2');
  const monoB64 = fontBase64('IBMPlexMono.woff2');
  const heroHtmls = buildHeroCardsHtml(script, dir, interB64, monoB64);

  const execPath = detectChromeExecutable();
  const browser = await chromium.launch({
    headless: true,
    ...(execPath ? { executablePath: execPath } : {}),
    args: ['--no-sandbox', '--disable-dev-shm-usage'],
  });

  const assets = { depths: [], heroes: [], chips: [] };
  try {
    const ctxDepth = await browser.newContext({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
    const pDepth = await ctxDepth.newPage();
    for (let i = 0; i < 5; i++) {
      await pDepth.setContent(buildDepthPlaneHtml(i, dir, interB64, monoB64), { waitUntil: 'load' });
      await pDepth.evaluate(() => document.fonts.ready);
      const out = path.join(workDir, `depth_${i}.png`);
      await pDepth.screenshot({ path: out, type: 'png', omitBackground: true });
      assets.depths.push(out);
    }
    await ctxDepth.close();

    const ctxHero = await browser.newContext({ viewport: { width: 960, height: 1420 }, deviceScaleFactor: 2 });
    const pHero = await ctxHero.newPage();
    for (let i = 0; i < 5; i++) {
      await pHero.setContent(heroHtmls[i], { waitUntil: 'load' });
      await pHero.evaluate(() => document.fonts.ready);
      const out = path.join(workDir, `hero_${i}.png`);
      await pHero.screenshot({ path: out, type: 'png', omitBackground: true });
      assets.heroes.push(out);
    }
    await ctxHero.close();

    const ctxChip = await browser.newContext({ viewport: { width: 960, height: 340 }, deviceScaleFactor: 2 });
    const pChip = await ctxChip.newPage();
    for (let i = 0; i < 5; i++) {
      await pChip.setContent(buildForegroundChipHtml(i, script, dir, interB64, monoB64), { waitUntil: 'load' });
      await pChip.evaluate(() => document.fonts.ready);
      const out = path.join(workDir, `chip_${i}.png`);
      await pChip.screenshot({ path: out, type: 'png', omitBackground: true });
      assets.chips.push(out);
    }
    await ctxChip.close();
  } finally {
    await browser.close();
  }
  return assets;
}

/**
 * Asymmetric Apple-style exponential deceleration easing:
 * Fast, confident lift-off (outInfluence ~30) settling smoothly into velvety stillness (inInfluence ~86).
 */
function addAnimatedProp(cmds, layer, propPath, keyframes, inInf = 84, outInf = 34) {
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
  cmds.push({ command: 'keys.velocity', params: { inInfluence: inInf, outInfluence: outInf } });
}

function pickDirector(spec, directorOverride) {
  if (directorOverride && DIRECTORS[directorOverride]) return DIRECTORS[directorOverride];
  if (process.env.OLVEN_SEQ_INDEX !== undefined && process.env.OLVEN_SEQ_INDEX !== '') {
    const idx = Math.abs(parseInt(process.env.OLVEN_SEQ_INDEX, 10) || 0);
    return DIRECTORS[DIRECTOR_ORDER[idx % DIRECTOR_ORDER.length]];
  }
  const str = String(spec.headline || 'olven') + String(spec.doc_id || '');
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0;
  return DIRECTORS[DIRECTOR_ORDER[h % DIRECTOR_ORDER.length]];
}

/**
 * Human-Natural, Butter-Smooth Motion Choreography (Apple / OpenAI / Anthropic standard):
 *  - Gentle 64–88px entries over 0.85s (never abrupt 1000px slams!)
 *  - Subtle continuous breathing drift (-24px Z) on every hold (never dead frozen frames!)
 *  - 0.55s overlapping silk cross-dissolves between every act (never hard pops!)
 *  - Staggered +0.20s secondary follow-through on foreground proof pills
 *  - Max ±1.8° micro-parallax (never dizzying 28°/90° flips!)
 */
function buildSmoothChoreography(motionStyle) {
  // Overlapping act timings for silky 0.55s cross-dissolves across 16.0s
  const acts = [
    { idx: 0, start: 0.00, settle: 0.00, holdEnd: 2.55, exitEnd: 3.15, heroY: 895, chipY: 1355 },
    { idx: 1, start: 2.75, settle: 3.55, holdEnd: 5.75, exitEnd: 6.35, heroY: 900, chipY: 1380 },
    { idx: 2, start: 5.95, settle: 6.75, holdEnd: 9.25, exitEnd: 9.85, heroY: 890, chipY: 1390 },
    { idx: 3, start: 9.45, settle: 10.25, holdEnd: 12.45, exitEnd: 13.05, heroY: 845, chipY: 1315 },
    { idx: 4, start: 12.65, settle: 13.50, holdEnd: 16.00, exitEnd: 16.00, heroY: 880, chipY: 1375 },
  ];

  // Calm, continuous architectural camera float across the entire 16s
  const camKeys =
    motionStyle === 'anthropic_warm_drift'
      ? [[0.0, [532, 960, -1085]], [5.5, [548, 956, -1062]], [11.0, [534, 964, -1046]], [16.0, [540, 960, -1032]]]
      : motionStyle === 'openai_editorial_glide'
      ? [[0.0, [540, 960, -1090]], [8.0, [540, 956, -1058]], [16.0, [540, 960, -1028]]]
      : [[0.0, [540, 962, -1088]], [4.5, [548, 957, -1068]], [10.5, [533, 962, -1048]], [16.0, [540, 958, -1030]]];

  const scenes = acts.map((a) => {
    const isFirst = a.idx === 0;
    const isLast = a.idx === 4;

    // Gentle, natural motion vectors tailored to each studio style
    let dxIn = 0, dyIn = 72, dzIn = 70, rotYIn = 0, rotXIn = 0;
    let dxOut = 0, dyOut = -38, dzOut = -45;
    if (motionStyle === 'anthropic_warm_drift') {
      dxIn = 82; dyIn = 18; dzIn = 40; rotYIn = 1.6;
      dxOut = -48; dyOut = -10; dzOut = -30;
    } else if (motionStyle === 'openai_editorial_glide') {
      dxIn = 0; dyIn = 46; dzIn = 95; rotYIn = 0; rotXIn = 0;
      dxOut = 0; dyOut = -24; dzOut = -55;
    } else if (motionStyle === 'stripe_precision_reveal') {
      dxIn = 0; dyIn = 66; dzIn = 55; rotYIn = -1.4; rotXIn = 1.5;
      dxOut = 0; dyOut = -34; dzOut = -35;
    } else {
      // apple_silk_float
      dxIn = 0; dyIn = 74; dzIn = 65; rotYIn = 1.2; rotXIn = 1.2;
      dxOut = 0; dyOut = -36; dzOut = -40;
    }

    // Scene 0 starts crisp & immediately readable at Frame 0 (zero blank thumbnail!)
    const heroPos = isFirst
      ? [[0.0, [540, a.heroY, 0]], [a.holdEnd, [540, a.heroY - 8, -24]], [a.exitEnd, [540 + dxOut, a.heroY + dyOut, dzOut]]]
      : isLast
      ? [[a.start, [540 + dxIn, a.heroY + dyIn, dzIn]], [a.settle, [540, a.heroY, 0]], [16.0, [540, a.heroY - 6, -24]]]
      : [[a.start, [540 + dxIn, a.heroY + dyIn, dzIn]], [a.settle, [540, a.heroY, 0]], [a.holdEnd, [540, a.heroY - 8, -24]], [a.exitEnd, [540 + dxOut, a.heroY + dyOut, dzOut]]];

    const heroRotY = isFirst
      ? [[0.0, 0], [a.holdEnd, -1.2], [a.exitEnd, -1.8]]
      : isLast
      ? [[a.start, rotYIn], [a.settle, 0], [16.0, -0.8]]
      : [[a.start, rotYIn], [a.settle, 0], [a.holdEnd, -1.2], [a.exitEnd, -1.8]];

    const heroRotX = isFirst
      ? [[0.0, 0], [a.holdEnd, 0.5]]
      : isLast
      ? [[a.start, rotXIn], [a.settle, 0], [16.0, 0]]
      : [[a.start, rotXIn], [a.settle, 0], [a.holdEnd, 0.6]];

    const heroOp = isFirst
      ? [[0.0, 100], [a.holdEnd, 100], [a.exitEnd, 0]]
      : isLast
      ? [[a.start, 0], [a.start + 0.55, 100], [16.0, 100]]
      : [[a.start, 0], [a.start + 0.52, 100], [a.holdEnd, 100], [a.exitEnd, 0]];

    // Staggered foreground proof pill (+0.20s follow-through for natural human eye rhythm)
    const cStart = isFirst ? 0.0 : a.start + 0.20;
    const cSettle = isFirst ? 0.0 : a.settle + 0.16;
    const chipPos = isFirst
      ? [[0.0, [540, a.chipY, -140]], [a.holdEnd, [540, a.chipY - 10, -162]], [a.exitEnd - 0.05, [540 + dxOut * 0.7, a.chipY + dyOut, -180]]]
      : isLast
      ? [[cStart, [540 + dxIn * 0.65, a.chipY + 56, -110]], [cSettle, [540, a.chipY, -140]], [16.0, [540, a.chipY - 8, -162]]]
      : [[cStart, [540 + dxIn * 0.65, a.chipY + 56, -110]], [cSettle, [540, a.chipY, -140]], [a.holdEnd, [540, a.chipY - 10, -162]], [a.exitEnd - 0.05, [540 + dxOut * 0.7, a.chipY + dyOut, -180]]];

    const chipOp = isFirst
      ? [[0.0, 100], [a.holdEnd - 0.05, 100], [a.exitEnd - 0.08, 0]]
      : isLast
      ? [[cStart, 0], [cStart + 0.48, 100], [16.0, 100]]
      : [[cStart, 0], [cStart + 0.48, 100], [a.holdEnd - 0.05, 100], [a.exitEnd - 0.08, 0]];

    const heroScale = isFirst
      ? [[0.0, [50.0, 50.0, 50.0]], [a.holdEnd, [52.2, 52.2, 52.2]], [a.exitEnd, [53.2, 53.2, 53.2]]]
      : isLast
      ? [[a.start, [48.8, 48.8, 48.8]], [a.settle, [50.2, 50.2, 50.2]], [16.0, [52.2, 52.2, 52.2]]]
      : [[a.start, [48.8, 48.8, 48.8]], [a.settle, [50.2, 50.2, 50.2]], [a.holdEnd, [52.0, 52.0, 52.0]], [a.exitEnd, [53.0, 53.0, 53.0]]];

    const sweep = [[isFirst ? 0.35 : a.settle, [0.05, 0.18]], [isLast ? 15.5 : a.holdEnd, [0.95, 0.82]]];

    return {
      idx: a.idx,
      inT: isFirst ? -0.5 : a.start - 0.05,
      outT: isLast ? 16.5 : a.exitEnd + 0.08,
      fadeInStart: a.start,
      fadeOutStart: a.holdEnd,
      fadeOutEnd: a.exitEnd,
      heroPos,
      heroScale,
      heroRotY,
      heroRotX,
      heroOp,
      chipPos,
      chipOp,
      sweep,
    };
  });

  return { camKeys, scenes };
}

async function renderWalkthroughVideo(specPath, outDir, directorOverride = null) {
  const spec = JSON.parse(fs.readFileSync(specPath, 'utf8'));
  const dir = pickDirector(spec, directorOverride);
  const choreoPlan = buildSmoothChoreography(dir.motionStyle);

  fs.mkdirSync(outDir, { recursive: true });
  const workDir = path.join(outDir, '_ec_work');
  fs.mkdirSync(workDir, { recursive: true });

  const trackPath = path.join(MUSIC_DIR, dir.track);
  if (!fs.existsSync(trackPath)) {
    throw new Error(`Missing NYC Felt Piano track: ${trackPath}`);
  }

  const t0 = Date.now();
  const script = compileEditorialScript(spec);
  const assets = await renderMultiPlaneAssets(script, dir, workDir);

  const compBg = dir.isDark ? '#07090D' : '#F6F3EC';
  const cmds = [
    {
      command: 'comp.new',
      params: {
        name: 'Main',
        width: WIDTH,
        height: HEIGHT,
        frameRate: FPS,
        duration: DURATION,
        background: compBg,
        shutterAngle: 140,
        shutterPhase: 0,
        motionBlurSamples: 4,
        renderer: 'classic3D',
        open: true,
      },
    },
  ];

  // Smoothly cross-dissolved Studio Atmospheric Domes (ZERO 1-frame background pops!)
  for (const c of choreoPlan.scenes) {
    const bgName = `Dome_${c.idx}`;
    const [startColor, endColor] = dir.domes[c.idx];
    cmds.push({ command: 'layer.newSolid', params: { name: bgName, color: compBg, width: WIDTH, height: HEIGHT } });
    cmds.push({ command: 'layer.timing', params: { layers: [bgName], in: c.inT, out: c.outT } });
    cmds.push({ command: 'effect.apply', params: { effect: 'ec.generate.gradientramp', layers: [bgName] } });
    cmds.push({ command: 'prop.set', params: { layer: bgName, path: 'effects/#1/shape', value: 1 } });
    cmds.push({ command: 'prop.set', params: { layer: bgName, path: 'effects/#1/start', value: [0.5, 0.28] } });
    cmds.push({ command: 'prop.set', params: { layer: bgName, path: 'effects/#1/end', value: [0.5, 1.15] } });
    cmds.push({ command: 'prop.set', params: { layer: bgName, path: 'effects/#1/startColor', value: startColor } });
    cmds.push({ command: 'prop.set', params: { layer: bgName, path: 'effects/#1/endColor', value: endColor } });
    cmds.push({ command: 'prop.set', params: { layer: bgName, path: 'effects/#1/scatter', value: 32.0 } });
    if (c.idx > 0) {
      addAnimatedProp(cmds, bgName, 'transform/opacity', [[c.fadeInStart, 0], [c.fadeInStart + 0.50, 100]], 65, 65);
    }
  }

  cmds.push({
    command: 'layer.newCamera',
    params: { name: 'HeroCam', preset: '35mm', position: [540, 960, -1088], poi: [540, 960, 0] },
  });
  cmds.push({ command: 'layer.timing', params: { layers: ['HeroCam'], in: -0.5, out: 16.5 } });
  addAnimatedProp(cmds, 'HeroCam', 'transform/position', choreoPlan.camKeys, 65, 65);

  for (const c of choreoPlan.scenes) {
    // PLANE 1: Background Architectural Depth Plane (Z = +320) with smooth opacity cross-dissolve!
    const dName = `Depth_${c.idx}`;
    cmds.push({ command: 'file.import', params: { paths: [assets.depths[c.idx]], addToComp: true } });
    cmds.push({ command: 'layer.rename', params: { layer: '#1', name: dName } });
    cmds.push({ command: 'layer.setSwitch', params: { layers: [dName], switch: 'threeD', value: true } });
    cmds.push({ command: 'layer.timing', params: { layers: [dName], in: c.inT, out: c.outT } });
    cmds.push({ command: 'prop.set', params: { layer: dName, path: 'transform/scale', value: [130, 130, 130] } });
    cmds.push({ command: 'prop.set', params: { layer: dName, path: 'transform/position', value: [540, 960, 320] } });
    const dOp = c.idx === 0
      ? [[0.0, 100], [c.fadeOutStart, 100], [c.fadeOutEnd, 0]]
      : c.idx === 4
      ? [[c.fadeInStart, 0], [c.fadeInStart + 0.48, 100], [16.0, 100]]
      : [[c.fadeInStart, 0], [c.fadeInStart + 0.48, 100], [c.fadeOutStart, 100], [c.fadeOutEnd, 0]];
    addAnimatedProp(cmds, dName, 'transform/opacity', dOp, 65, 65);

    // PLANE 2: Hero 2x Retina Editorial/Product Panel (Z = 0) — Apple Silk Deceleration + Living Ken Burns Breathing!
    const hName = `Hero_${c.idx}`;
    cmds.push({ command: 'file.import', params: { paths: [assets.heroes[c.idx]], addToComp: true } });
    cmds.push({ command: 'layer.rename', params: { layer: '#1', name: hName } });
    cmds.push({ command: 'layer.setSwitch', params: { layers: [hName], switch: 'threeD', value: true } });
    cmds.push({ command: 'layer.setSwitch', params: { layers: [hName], switch: 'motionBlur', value: true } });
    cmds.push({ command: 'layer.timing', params: { layers: [hName], in: c.inT, out: c.outT } });

    addAnimatedProp(cmds, hName, 'transform/scale', c.heroScale, 68, 42);
    addAnimatedProp(cmds, hName, 'transform/position', c.heroPos, 86, 28);
    addAnimatedProp(cmds, hName, 'transform/rotationY', c.heroRotY, 84, 30);
    addAnimatedProp(cmds, hName, 'transform/rotationX', c.heroRotX, 84, 30);
    addAnimatedProp(cmds, hName, 'transform/opacity', c.heroOp, 68, 45);

    // Restrained, tasteful optical specular light sweep on structured cards (Scenes 1–3 only)
    if (c.idx >= 1 && c.idx <= 3) {
      cmds.push({ command: 'effect.apply', params: { effect: 'ec.generate.cclightsweep', layers: [hName] } });
      cmds.push({ command: 'prop.set', params: { layer: hName, path: 'effects/#1/direction', value: -24.0 } });
      cmds.push({ command: 'prop.set', params: { layer: hName, path: 'effects/#1/width', value: 96.0 } });
      cmds.push({ command: 'prop.set', params: { layer: hName, path: 'effects/#1/sweepIntensity', value: dir.isDark ? 18.0 : 12.0 } });
      cmds.push({ command: 'prop.set', params: { layer: hName, path: 'effects/#1/edgeIntensity', value: 22.0 } });
      cmds.push({ command: 'prop.set', params: { layer: hName, path: 'effects/#1/edgeThickness', value: 1.4 } });
      addAnimatedProp(cmds, hName, 'effects/#1/center', c.sweep, 55, 55);
    }

    // PLANE 3: Foreground Floating Proof Chip (Z = -140) with natural staggered follow-through!
    const fName = `FgChip_${c.idx}`;
    cmds.push({ command: 'file.import', params: { paths: [assets.chips[c.idx]], addToComp: true } });
    cmds.push({ command: 'layer.rename', params: { layer: '#1', name: fName } });
    cmds.push({ command: 'layer.setSwitch', params: { layers: [fName], switch: 'threeD', value: true } });
    cmds.push({ command: 'layer.setSwitch', params: { layers: [fName], switch: 'motionBlur', value: true } });
    cmds.push({ command: 'layer.timing', params: { layers: [fName], in: c.inT, out: c.outT } });
    cmds.push({ command: 'prop.set', params: { layer: fName, path: 'transform/scale', value: [44, 44, 44] } });

    addAnimatedProp(cmds, fName, 'transform/position', c.chipPos, 86, 28);
    addAnimatedProp(cmds, fName, 'transform/rotationY', c.heroRotY.map(([t, v]) => [t, v * 0.5]), 82, 30);
    addAnimatedProp(cmds, fName, 'transform/opacity', c.chipOp, 68, 45);
  }

  // Subtle Cinema Finish Adjustment Layer (Restrained vignette + anti-banding micro-grain; ZERO radial smear!)
  cmds.push({ command: 'layer.newAdjustment', params: { name: 'CinemaGrade' } });
  cmds.push({ command: 'effect.apply', params: { effect: 'ec.stylize.ccvignette', layers: ['CinemaGrade'] } });
  cmds.push({ command: 'prop.set', params: { layer: 'CinemaGrade', path: 'effects/#1/amount', value: dir.isDark ? 11.0 : 6.0 } });
  cmds.push({ command: 'effect.apply', params: { effect: 'ec.noise.addgrain', layers: ['CinemaGrade'] } });
  cmds.push({ command: 'prop.set', params: { layer: 'CinemaGrade', path: 'effects/#2/viewingMode', value: 2 } });
  cmds.push({ command: 'prop.set', params: { layer: 'CinemaGrade', path: 'effects/#2/tweaking/intensity', value: 0.09 } });
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
    '--bitrate', '9200',
    '--quality', 'best',
    '--audio', 'off',
  ], { stdio: 'inherit' });

  // Mux approved NYC Felt Piano + Rec.709 color space tags (stream copy video — 0 quality loss!)
  execFileSync('ffmpeg', [
    '-y', '-v', 'error',
    '-i', rawMp4,
    '-i', trackPath,
    '-map', '0:v:0', '-map', '1:a:0',
    '-c:v', 'copy',
    '-bsf:v', 'h264_metadata=colour_primaries=1:transfer_characteristics=1:matrix_coefficients=1',
    '-c:a', 'aac', '-b:a', '192k', '-ar', '48000',
    '-movflags', '+faststart',
    '-t', String(DURATION),
    outMp4,
  ], { stdio: 'inherit' });

  // Hard CDN Safety Guard: strictly <= 19.4 MB (jsDelivr 20 MB limit)
  const MAX_BYTES = Math.floor(19.4 * 1024 * 1024);
  if (fs.statSync(outMp4).size > MAX_BYTES) {
    const cappedMp4 = path.join(workDir, 'video_capped.mp4');
    execFileSync('ffmpeg', [
      '-y', '-v', 'error',
      '-i', outMp4,
      '-c:v', 'libx264', '-preset', 'slow', '-profile:v', 'high', '-level', '4.1',
      '-pix_fmt', 'yuv420p', '-b:v', '8800k', '-maxrate', '9400k', '-bufsize', '18000k',
      '-color_primaries', 'bt709', '-color_trc', 'bt709', '-colorspace', 'bt709',
      '-c:a', 'copy', '-movflags', '+faststart',
      cappedMp4,
    ], { stdio: 'inherit' });
    fs.renameSync(cappedMp4, outMp4);
  }

  fs.rmSync(workDir, { recursive: true, force: true });

  const elapsed = ((Date.now() - t0) / 1000).toFixed(1);
  const mb = (fs.statSync(outMp4).size / (1024 * 1024)).toFixed(2);
  console.log(
    `[OK] Rendered Tier-1 Smooth 3D Video [${dir.name} | motion=${dir.motionStyle} | ${dir.track}, 9.2Mbps Rec.709 in ${elapsed}s, ${mb} MB] -> ${outMp4}`
  );
}

if (require.main === module) {
  const [specPath, outDir, directorOverride] = process.argv.slice(2);
  if (!specPath || !outDir) {
    console.error('Usage: node render_video.js <spec.json> <outDir> [directorOverride]');
    process.exit(1);
  }
  renderWalkthroughVideo(specPath, outDir, directorOverride).catch((err) => {
    console.error(err);
    process.exit(1);
  });
}

module.exports = { renderWalkthroughVideo, DIRECTORS, DIRECTOR_ORDER };
