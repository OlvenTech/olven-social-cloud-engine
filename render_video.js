#!/usr/bin/env node
/**
 * Olven Tech — ArtCraft EffectCraft (v0.24.1) 6-Format Manhattan Cinema Director Engine
 * (1080x1920, 30fps, 16.0s, 14 Mbps H.264 Rec.709 + NYC Felt Piano).
 *
 * Breaks completely out of static slideshow boxes by rotating automatically across
 * 6 distinct New York / Cupertino / Tokyo Cinema Formats, each with different
 * visual design, animation physics, and video-editing skills:
 *   1. manhattan_kinetic_slam   — Full-bleed Klein Cobalt kinetic type (unboxed) + iPhone 16 Pro 3D + Radial Zoom-Burst
 *   2. before_after_card_flip   — Pro Display XDR Dark + True 3D Card-Flip & Linear-Wipe Slice Reveal + Alpine White Flash
 *   3. tokyo_vermilion_hardware — Teenage Engineering Industrial + Mechanical Hard-Cut Slams + Full-Bleed Signal Vermilion
 *   4. visionos_lightwipe_spatial — Apple Vision Pro Spatial Glass + Luminous Optical LightWipe Transitions
 *   5. nyc_wallstreet_noir      — Leica Obsidian & Newsprint Ivory + Champagne Gold + Lateral Whip-Pan 3D Camera
 *   6. executive_roi_teardown   — Conversion-First Manhattan Boardroom Teardown + macOS Dark Terminal + Optical Bloom
 *
 * Every film uses True 3-Plane Optical 3D Parallax (Z=+360 Depth, Z=0 Hero, Z=-190 Floating Chip),
 * sweeping 35mm Cinema Camera, forward shutterPhase=0 (tack-sharp Frame 0 IG/Reels cover),
 * float32 anti-banding radial softbox domes, subtle Lumetri/vignette cinema grade, and 35mm monochrome grain.
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

const DIRECTORS = {
  manhattan_kinetic_slam: {
    name: 'manhattan_kinetic_slam',
    label: 'MANHATTAN · KINETIC',
    track: 'nyc_felt_piano_mvt1.mp3',
    editSkill: 'radial_zoom_burst', // Uses ec.blur.ccradialfast optical zoom-burst on scene cuts!
    unboxedHook: true,              // Full-bleed colossal kinetic type straight on Klein Cobalt!
    unboxedProof: false,
    domes: [
      [[0.080, 0.225, 0.980, 1.0], [0.020, 0.055, 0.340, 1.0]], // Scene 0: International Klein Cobalt
      [[0.988, 0.978, 0.955, 1.0], [0.895, 0.878, 0.840, 1.0]], // Scene 1: Warm Editorial Alabaster
      [[0.055, 0.115, 0.300, 1.0], [0.018, 0.025, 0.055, 1.0]], // Scene 2: Midnight Cobalt Obsidian
      [[0.992, 0.984, 0.962, 1.0], [0.910, 0.892, 0.850, 1.0]], // Scene 3: Warm Swiss Cream
      [[0.065, 0.175, 0.740, 1.0], [0.016, 0.032, 0.125, 1.0]], // Scene 4: Electric Cobalt Close
    ],
    sceneDark: [true, false, true, false, true],
    accent: '#0A28FF',
    accentBright: '#B8FF3B',
    alert: '#FF3B30',
    heroNumColor: '#0A28FF',
    depthMotif: 'editorial_numerals',
    deviceMode: 'iphone',
    ctaHeadline: ['We engineer', 'revenue-critical', 'backends.'],
    ctaSub: 'OLVENTECH.COM · MANHATTAN, NY',
  },

  before_after_card_flip: {
    name: 'before_after_card_flip',
    label: 'ARCHITECTURE · FLIP',
    track: 'nyc_felt_piano_mvt2.mp3',
    editSkill: 'card_flip_linear_wipe', // True 3D 90-deg flip + ec.transition.linearwipe architectural slice!
    unboxedHook: false,
    unboxedProof: false,
    opticalGlow: true,
    domes: [
      [[0.045, 0.165, 0.145, 1.0], [0.018, 0.026, 0.038, 1.0]], // Scene 0: Emerald-Lit Carbon
      [[0.080, 0.105, 0.165, 1.0], [0.022, 0.028, 0.044, 1.0]], // Scene 1: Midnight Telemetry
      [[0.038, 0.145, 0.200, 1.0], [0.016, 0.024, 0.040, 1.0]], // Scene 2: Optical Cyan-Obsidian
      [[0.995, 0.998, 1.000, 1.0], [0.895, 0.925, 0.945, 1.0]], // Scene 3: BLAZING ALPINE WHITE FLASH CUT!
      [[0.048, 0.135, 0.170, 1.0], [0.016, 0.022, 0.035, 1.0]], // Scene 4: Pro Display Obsidian Close
    ],
    sceneDark: [true, true, true, false, true],
    accent: '#059669',
    accentBright: '#34D399',
    alert: '#F43F5E',
    heroNumColor: '#059669',
    depthMotif: 'telemetry_dotgrid',
    deviceMode: 'macos_dark_terminal',
    ctaHeadline: ['Ship systems', 'that never', 'lose a dollar.'],
    ctaSub: 'OLVENTECH.COM · MANHATTAN, NY',
  },

  tokyo_vermilion_hardware: {
    name: 'tokyo_vermilion_hardware',
    label: 'INDUSTRIAL · VERMILION',
    track: 'nyc_felt_piano_mvt2.mp3',
    editSkill: 'mechanical_elevator_snap', // Ultra-crisp 94% influence mechanical vertical hard-cut snaps!
    unboxedHook: false,
    unboxedProof: true,                    // Full-bleed Signal Vermilion typography explosion!
    domes: [
      [[0.975, 0.965, 0.942, 1.0], [0.880, 0.865, 0.835, 1.0]], // Scene 0: Warm Ceramic Off-White
      [[0.120, 0.130, 0.155, 1.0], [0.042, 0.046, 0.058, 1.0]], // Scene 1: Anodized Slate Hardware
      [[0.095, 0.102, 0.120, 1.0], [0.030, 0.034, 0.042, 1.0]], // Scene 2: Matte Graphite Spec
      [[1.000, 0.335, 0.120, 1.0], [0.760, 0.130, 0.020, 1.0]], // Scene 3: FULL-BLEED SIGNAL VERMILION!!
      [[0.105, 0.112, 0.130, 1.0], [0.032, 0.036, 0.045, 1.0]], // Scene 4: Matte Graphite Close
    ],
    sceneDark: [false, true, true, true, true],
    accent: '#FF451A',
    accentBright: '#FF5C33',
    alert: '#FF451A',
    heroNumColor: '#FFFFFF',
    depthMotif: 'industrial_crosshair',
    deviceMode: 'hardware_plate',
    ctaHeadline: ['Built for', 'zero-leak', 'production.'],
    ctaSub: 'OLVENTECH.COM · NEW YORK',
  },

  visionos_lightwipe_spatial: {
    name: 'visionos_lightwipe_spatial',
    label: 'VISIONOS · SPATIAL',
    track: 'nyc_felt_piano_mvt3.mp3',
    editSkill: 'optical_light_wipe', // Luminous ec.transition.cclightwipe optical beam transitions!
    unboxedHook: false,
    unboxedProof: false,
    domes: [
      [[0.140, 0.105, 0.360, 1.0], [0.032, 0.036, 0.095, 1.0]], // Scene 0: Midnight Spatial Violet
      [[0.960, 0.968, 1.000, 1.0], [0.855, 0.875, 0.965, 1.0]], // Scene 1: Frosted Pearl Mist
      [[0.130, 0.085, 0.340, 1.0], [0.028, 0.042, 0.115, 1.0]], // Scene 2: Sapphire-Violet Aurora
      [[0.945, 0.975, 1.000, 1.0], [0.835, 0.900, 0.975, 1.0]], // Scene 3: Luminous Spatial Sky
      [[0.110, 0.095, 0.310, 1.0], [0.025, 0.030, 0.082, 1.0]], // Scene 4: Deep Space Indigo Close
    ],
    sceneDark: [true, false, true, false, true],
    accent: '#6C47FF',
    accentBright: '#22D3EE',
    alert: '#FB7185',
    heroNumColor: '#5B3DF5',
    depthMotif: 'spatial_rings',
    deviceMode: 'visionos_glass',
    ctaHeadline: ['Precision', 'software', 'architecture.'],
    ctaSub: 'OLVENTECH.COM · MANHATTAN, NY',
  },

  nyc_wallstreet_noir: {
    name: 'nyc_wallstreet_noir',
    label: 'MANHATTAN · NOIR',
    track: 'nyc_felt_piano_mvt1.mp3',
    editSkill: 'lateral_whip_pan', // Wide horizontal whip-pan 3D camera choreography!
    unboxedHook: true,             // Pure Bloomberg / Leica editorial print typography on pitch obsidian!
    unboxedProof: true,            // Pure monumental black & gold typography on warm Manhattan newsprint!
    domes: [
      [[0.075, 0.072, 0.068, 1.0], [0.018, 0.018, 0.020, 1.0]], // Scene 0: Leica Pitch Obsidian
      [[0.975, 0.965, 0.938, 1.0], [0.885, 0.870, 0.830, 1.0]], // Scene 1: Manhattan Newsprint Ivory
      [[0.082, 0.078, 0.070, 1.0], [0.020, 0.020, 0.022, 1.0]], // Scene 2: Warm Carbon Obsidian
      [[0.985, 0.974, 0.945, 1.0], [0.900, 0.882, 0.838, 1.0]], // Scene 3: Warm Luxury Newsprint
      [[0.070, 0.068, 0.064, 1.0], [0.015, 0.015, 0.018, 1.0]], // Scene 4: Leica Noir Gold Close
    ],
    sceneDark: [true, false, true, false, true],
    accent: '#0B0D12',
    accentBright: '#F5C451', // Manhattan Champagne Gold
    alert: '#D92D20',
    heroNumColor: '#0B0D12',
    depthMotif: 'editorial_numerals',
    deviceMode: 'iphone',
    ctaHeadline: ['Manhattan', 'systems', 'engineering.'],
    ctaSub: 'BOOK AN AUDIT · OLVENTECH.COM',
  },

  executive_roi_teardown: {
    name: 'executive_roi_teardown',
    label: 'CTO TEARDOWN · ROI',
    track: 'nyc_felt_piano_mvt3.mp3',
    editSkill: 'optical_light_wipe', // Luminous light-wipe + optical emerald bloom on ROI numbers!
    unboxedHook: true,               // Bold pattern-interrupt boardroom loss opener!
    unboxedProof: false,
    opticalGlow: true,
    domes: [
      [[0.145, 0.048, 0.068, 1.0], [0.022, 0.018, 0.025, 1.0]], // Scene 0: Deep Studio Burgundy-Carbon Alert
      [[0.068, 0.082, 0.122, 1.0], [0.020, 0.024, 0.036, 1.0]], // Scene 1: Dark Incident Terminal
      [[0.035, 0.125, 0.110, 1.0], [0.014, 0.024, 0.028, 1.0]], // Scene 2: Deep Emerald Architecture
      [[0.988, 0.992, 0.990, 1.0], [0.895, 0.920, 0.910, 1.0]], // Scene 3: Crisp Boardroom White ROI Proof
      [[0.048, 0.062, 0.095, 1.0], [0.014, 0.018, 0.028, 1.0]], // Scene 4: Executive Slate Close
    ],
    sceneDark: [true, true, true, false, true],
    accent: '#059669',
    accentBright: '#34D399',
    alert: '#FB7185',
    heroNumColor: '#059669',
    depthMotif: 'telemetry_dotgrid',
    deviceMode: 'macos_dark_terminal',
    ctaHeadline: ['Book a 15-min', 'architecture', 'audit.'],
    ctaSub: 'OLVENTECH.COM · MANHATTAN, NY',
  },
};

const DIRECTOR_ORDER = [
  'manhattan_kinetic_slam',
  'nyc_wallstreet_noir',
  'before_after_card_flip',
  'tokyo_vermilion_hardware',
  'visionos_lightwipe_spatial',
  'executive_roi_teardown',
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
  if (/\b(lead|hubspot|routing|revops)\b/.test(hlLower)) {
    hookL1 = 'Slow lead';
    hookL2 = 'routing kills';
    hookAccent = '8.7% pipeline.';
  } else if (/\b(netsuite|payout|reconcil)/.test(hlLower)) {
    hookL1 = 'Per-charge';
    hookL2 = 'webhooks break';
    hookAccent = 'month-end close.';
  } else if (/\b(stripe|billing|usage|revenue|metering)\b/.test(hlLower)) {
    hookL1 = 'Your billing';
    hookL2 = 'pipeline leaks';
    hookAccent = m0.value.includes('$') ? m0.value : (m1.value.includes('$') ? m1.value : badBadge);
  } else if (/\b(llm|agent|refund|policy)\b/.test(hlLower)) {
    hookL1 = 'LLM prompts';
    hookL2 = 'are not a';
    hookAccent = 'security wall.';
  } else if (/\b(inventory|oversell|shopify|sku)\b/.test(hlLower)) {
    hookL1 = '15-min crons';
    hookL2 = 'cause live';
    hookAccent = badBadge || 'oversells.';
  } else if (/\b(tenant|isolation|rls)\b/.test(hlLower)) {
    hookL1 = 'Zero-leak';
    hookL2 = 'tenant isolation';
    hookAccent = m0.value;
  } else if (/\b(webhook|outbox|erp|wms)\b/.test(hlLower)) {
    hookL1 = 'Failed webhooks';
    hookL2 = 'quietly drop';
    hookAccent = badBadge || 'live orders.';
  } else if (/\b(kafka|queue|backpressure|dead-letter|dlq)\b/.test(hlLower)) {
    hookL1 = 'Unbounded queues';
    hookL2 = 'trigger silent';
    hookAccent = 'cascading outages.';
  } else if (/\b(soc-2|soc2|audit|compliance|ledger)\b/.test(hlLower)) {
    hookL1 = 'Mutable logs';
    hookL2 = 'fail enterprise';
    hookAccent = 'SOC-2 audits.';
  } else {
    const words = hl.split(/\s+/);
    hookL1 = words.slice(0, 2).join(' ');
    hookL2 = words.slice(2, 4).join(' ');
    hookAccent = m0.value;
  }

  if (hookAccent.length > 18) hookAccent = m0.value;
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
    heroFontPx: cleanTag(heroMetric.value).length >= 7 ? 156 : (cleanTag(heroMetric.value).length >= 5 ? 186 : 214),
    heroLabel,
    heroSub,
    subA: { val: cleanTag(subA.value), lbl: cleanTag(subA.label).toLowerCase() },
    subB: { val: cleanTag(subB.value), lbl: cleanTag(subB.label).toLowerCase() },
  };
}

function buildDepthPlaneHtml(idx, dir, interB64, monoB64) {
  const isDark = dir.sceneDark[idx];
  const stroke = isDark ? 'rgba(255,255,255,0.11)' : 'rgba(10,14,26,0.085)';
  const ghostInk = isDark ? 'rgba(255,255,255,0.072)' : 'rgba(10,14,26,0.056)';
  const accentGlow = isDark ? dir.accentBright : dir.accent;
  const num = `0${idx + 1}`;

  let inner = '';
  if (dir.depthMotif === 'editorial_numerals') {
    inner = `
      <div style="position:absolute;top:110px;right:48px;font-family:'Inter',sans-serif;font-weight:900;font-size:440px;line-height:0.82;letter-spacing:-0.06em;color:${ghostInk};">${num}</div>
      <div style="position:absolute;inset:76px;border:1.5px solid ${stroke};border-radius:42px;"></div>
      <div style="position:absolute;bottom:110px;left:96px;font-family:'IBM Plex Mono',monospace;font-size:20px;letter-spacing:0.22em;color:${stroke};">OLVEN // MANHATTAN · ${dir.label}</div>
    `;
  } else if (dir.depthMotif === 'industrial_crosshair') {
    inner = `
      <div style="position:absolute;inset:82px;border:1.5px dashed ${stroke};"></div>
      <div style="position:absolute;top:64px;left:64px;font-family:'IBM Plex Mono',monospace;font-size:38px;color:${stroke};">+</div>
      <div style="position:absolute;top:64px;right:64px;font-family:'IBM Plex Mono',monospace;font-size:38px;color:${stroke};">+</div>
      <div style="position:absolute;bottom:64px;left:64px;font-family:'IBM Plex Mono',monospace;font-size:38px;color:${stroke};">+</div>
      <div style="position:absolute;bottom:64px;right:64px;font-family:'IBM Plex Mono',monospace;font-size:38px;color:${stroke};">+</div>
      <div style="position:absolute;top:130px;left:108px;font-family:'IBM Plex Mono',monospace;font-size:22px;letter-spacing:0.26em;color:${stroke};">SPEC-${num} // MANHATTAN</div>
      <div style="position:absolute;bottom:140px;right:108px;font-family:'Inter',sans-serif;font-weight:900;font-size:310px;line-height:0.8;color:${ghostInk};">${num}</div>
    `;
  } else if (dir.depthMotif === 'telemetry_dotgrid') {
    inner = `
      <div style="position:absolute;inset:60px;background-image:radial-gradient(${stroke} 2.2px, transparent 2.2px);background-size:44px 44px;"></div>
      <div style="position:absolute;top:170px;left:0;right:0;height:1.5px;background:linear-gradient(90deg,transparent,${accentGlow}44,transparent);"></div>
      <div style="position:absolute;bottom:170px;left:0;right:0;height:1.5px;background:linear-gradient(90deg,transparent,${accentGlow}44,transparent);"></div>
      <div style="position:absolute;top:116px;right:84px;font-family:'IBM Plex Mono',monospace;font-size:22px;letter-spacing:0.2em;color:${stroke};">OLVEN // ${num}</div>
    `;
  } else {
    inner = `
      <div style="position:absolute;top:50%;left:50%;width:980px;height:980px;transform:translate(-50%,-50%);border-radius:50%;border:1.5px solid ${stroke};"></div>
      <div style="position:absolute;top:50%;left:50%;width:720px;height:720px;transform:translate(-50%,-50%);border-radius:50%;border:1.5px solid ${stroke};"></div>
      <div style="position:absolute;top:50%;left:50%;width:1240px;height:1240px;transform:translate(-50%,-50%);border-radius:50%;border:1.5px dashed ${stroke};"></div>
      <div style="position:absolute;top:120px;left:88px;font-family:'IBM Plex Mono',monospace;font-size:21px;letter-spacing:0.22em;color:${stroke};">SPATIAL · ${num}</div>
    `;
  }

  return `<!doctype html><html><head><meta charset="utf-8"><style>
    @font-face { font-family: 'Inter'; src: url('data:font/woff2;base64,${interB64}') format('woff2'); font-weight: 100 900; }
    @font-face { font-family: 'IBM Plex Mono'; src: url('data:font/woff2;base64,${monoB64}') format('woff2'); font-weight: 400 700; }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    html, body { width: 1080px; height: 1920px; background: transparent; overflow: hidden; position: relative; }
  </style></head><body>${inner}</body></html>`;
}

function buildForegroundChipHtml(idx, script, dir, interB64, monoB64) {
  const isDark = dir.sceneDark[idx];
  const isVermilionImpact = dir.name === 'tokyo_vermilion_hardware' && idx === 3;
  const isNoir = dir.name === 'nyc_wallstreet_noir';
  const isCobalt = dir.name === 'manhattan_kinetic_slam';

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
      display: inline-flex; align-items: center; gap: 18px;
      padding: 24px 40px; border-radius: 999px;
      font-family: 'IBM Plex Mono', monospace; font-size: 25px; font-weight: 700;
      letter-spacing: 0.1em; text-transform: uppercase;
    }
    .glass-dark {
      background: linear-gradient(145deg, rgba(22, 26, 36, 0.94) 0%, rgba(10, 12, 18, 0.90) 100%);
      border: 2px solid rgba(255,255,255,0.28);
      box-shadow: inset 0 2px 0 rgba(255,255,255,0.35);
      color: #FFFFFF;
    }
    .glass-light {
      background: linear-gradient(145deg, rgba(255, 255, 255, 0.96) 0%, rgba(244, 246, 250, 0.88) 100%);
      border: 2px solid rgba(255,255,255,1.0);
      box-shadow: inset 0 2px 0 rgba(255,255,255,1.0);
      color: #090C14;
    }
    .glass-accent {
      background: ${dir.accentBright};
      border: 2px solid rgba(255,255,255,0.55);
      color: #080A10;
    }
    .dot { width: 14px; height: 14px; border-radius: 50%; flex-shrink: 0; }
    .dual { display: flex; gap: 22px; width: 100%; justify-content: center; }
    .mini {
      flex: 1; max-width: 410px; padding: 28px 34px; border-radius: 30px;
      display: flex; flex-direction: column; gap: 6px;
    }
    .mv { font-size: 48px; font-weight: 850; letter-spacing: -0.04em; font-variant-numeric: tabular-nums; }
    .ml { font-family: 'IBM Plex Mono', monospace; font-size: 19px; font-weight: 700; letter-spacing: 0.09em; text-transform: uppercase; opacity: 0.72; }
  `;

  let body = '';
  if (idx === 0) {
    const cls = (isCobalt || isNoir) ? 'glass-accent' : (isDark ? 'glass-dark' : 'glass-light');
    const dotColor = (isCobalt || isNoir) ? '#080A10' : dir.alert;
    body = `<div class="pill ${cls}"><span class="dot" style="background:${dotColor};"></span><span>CASE STUDY · ${esc(script.domainShort)}</span></div>`;
  } else if (idx === 1) {
    body = `<div class="pill glass-dark" style="border-color:${dir.alert}88;"><span class="dot" style="background:${dir.alert};"></span><span style="color:#FFE4E6;">${esc(script.painKicker.replace(/\.$/, ''))}</span></div>`;
  } else if (idx === 2) {
    body = `<div class="pill glass-dark" style="border-color:${dir.accentBright}88;"><span class="dot" style="background:${dir.accentBright};"></span><span style="color:${dir.accentBright};">${esc(script.archFoot)}</span></div>`;
  } else if (idx === 3) {
    const cardCls = (isVermilionImpact || isNoir) ? 'glass-dark' : (isDark ? 'glass-dark' : 'glass-light');
    body = `
      <div class="dual">
        <div class="mini ${cardCls}"><div class="mv">${esc(script.subA.val)}</div><div class="ml">${esc(script.subA.lbl)}</div></div>
        <div class="mini ${cardCls}"><div class="mv">${esc(script.subB.val)}</div><div class="ml">${esc(script.subB.lbl)}</div></div>
      </div>`;
  } else {
    const ctaBg = (isCobalt || isNoir) ? dir.accentBright : (dir.name === 'tokyo_vermilion_hardware' ? '#FF451A' : '#FFFFFF');
    const ctaInk = dir.name === 'tokyo_vermilion_hardware' ? '#FFFFFF' : '#07090E';
    body = `<div class="pill" style="background:${ctaBg};color:${ctaInk};border:2px solid rgba(255,255,255,0.6);padding:26px 56px;font-size:30px;"><span>DM "AUDIT"</span><span>→</span></div>`;
  }

  return `<!doctype html><html><head><meta charset="utf-8"><style>${chipCss}</style></head><body>${body}</body></html>`;
}

function buildHeroCardsHtml(script, dir, interB64, monoB64) {
  const logoLightUri = loadTransparentLogoDataUri('#F8FAFC', '#10141E');
  const isVermilion = dir.name === 'tokyo_vermilion_hardware';
  const isVision = dir.name === 'visionos_lightwipe_spatial';

  const baseCss = `
    @font-face { font-family: 'Inter'; src: url('data:font/woff2;base64,${interB64}') format('woff2'); font-weight: 100 900; }
    @font-face { font-family: 'IBM Plex Mono'; src: url('data:font/woff2;base64,${monoB64}') format('woff2'); font-weight: 400 700; }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    html, body {
      width: 960px; height: 1420px; background: transparent; overflow: hidden;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif;
      -webkit-font-smoothing: antialiased;
      display: flex; flex-direction: column; justify-content: center; padding: 34px;
    }
    .slab-light {
      background: linear-gradient(155deg, rgba(255,255,255,0.95) 0%, rgba(250,251,254,0.82) 100%);
      border: 1.5px solid rgba(255,255,255,0.98);
      box-shadow: 0 38px 82px -18px rgba(10,16,32,0.24), inset 0 2px 0 rgba(255,255,255,1.0);
      color: #090C14;
    }
    .slab-dark {
      background: linear-gradient(155deg, rgba(24,29,42,0.90) 0%, rgba(10,13,20,0.86) 100%);
      border: 1.5px solid rgba(255,255,255,0.22);
      box-shadow: 0 42px 92px -18px rgba(0,0,0,0.82), inset 0 2px 0 rgba(255,255,255,0.32);
      color: #F8FAFC;
    }
    .slab-vision {
      background: linear-gradient(145deg, rgba(255,255,255,0.20) 0%, rgba(255,255,255,0.08) 100%);
      border: 1.8px solid rgba(255,255,255,0.38);
      box-shadow: 0 42px 92px -16px rgba(6,8,28,0.68), inset 0 2px 0 rgba(255,255,255,0.52);
      color: #FFFFFF;
    }
    .card { position: relative; border-radius: ${isVermilion ? '20px' : '44px'}; padding: 62px 58px; overflow: hidden; }
    .card::before {
      content: ''; position: absolute; top: 0; left: 0; right: 0; height: 40%;
      background: linear-gradient(180deg, rgba(255,255,255,0.20) 0%, rgba(255,255,255,0) 100%);
      pointer-events: none;
    }
    .unboxed { background: transparent !important; border: none !important; box-shadow: none !important; padding: 24px 12px !important; }
    .unboxed::before { display: none !important; }
    .tag-row {
      display: flex; justify-content: space-between; align-items: center;
      margin-bottom: 36px; font-family: 'IBM Plex Mono', monospace;
      font-size: 19px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; opacity: 0.75;
    }
  `;

  // SCENE 0: Full-bleed Kinetic Editorial Type (unboxed for Manhattan Kinetic, Noir, Executive ROI!) OR Sculpted Glass Slab
  const s0Dark = dir.sceneDark[0];
  const s0CardCls = dir.unboxedHook ? 'unboxed' : (isVision ? 'slab-vision' : (s0Dark ? 'slab-dark' : 'slab-light'));
  const s0Ink = s0Dark ? '#FFFFFF' : '#090C14';
  const s0Accent = s0Dark ? dir.accentBright : dir.accent;
  const scene0 = `<!doctype html><html><head><meta charset="utf-8"><style>${baseCss}
    .h { font-size: ${dir.unboxedHook ? '114px' : '94px'}; font-weight: 900; line-height: 0.98; letter-spacing: -0.056em; color: ${s0Ink}; }
    .ha {
      display: inline-block; margin-top: 18px;
      font-size: ${dir.unboxedHook ? '122px' : '108px'}; font-weight: 900; line-height: 0.96; letter-spacing: -0.058em;
      color: ${s0Accent};
    }
    .bar { margin-top: 42px; height: 6px; width: 136px; border-radius: 99px; background: ${s0Accent}; }
    .ft { margin-top: 26px; font-family: 'IBM Plex Mono', monospace; font-size: 24px; font-weight: 600; color: ${s0Ink}; opacity: 0.78; }
  </style></head><body>
    <div class="card ${s0CardCls}" style="color:${s0Ink};">
      <div class="tag-row"><span>OLVEN TECH · ${esc(dir.label)}</span><span>01 / 05</span></div>
      <div class="h">${esc(script.hookL1)}</div>
      <div class="h">${esc(script.hookL2)}</div>
      <div class="ha">${esc(script.hookAccent)}</div>
      <div class="bar"></div>
      <div class="ft">${esc(script.hookFoot)}</div>
    </div>
  </body></html>`;

  // SCENE 1: Distinct Hardware / Device Persona per Director!
  let scene1 = '';
  if (dir.deviceMode === 'iphone') {
    scene1 = `<!doctype html><html><head><meta charset="utf-8"><style>${baseCss}
      .iphone {
        margin: 0 auto; width: 690px; border-radius: 92px; padding: 22px;
        background: linear-gradient(145deg, #4B5262 0%, #171A21 48%, #2E3442 100%);
        box-shadow: 0 48px 100px -16px rgba(10,16,32,0.44), inset 0 2px 3px rgba(255,255,255,0.52);
      }
      .screen {
        border-radius: 72px; background: linear-gradient(180deg, #0D111A 0%, #07090F 100%);
        padding: 30px 42px 26px; color: #F8FAFC; min-height: 960px;
        border: 1.5px solid rgba(255,255,255,0.14);
        display: flex; flex-direction: column; justify-content: space-between;
      }
      .top-bar { display:flex; align-items:center; justify-content:space-between; margin-bottom:26px; font-family:'Inter',sans-serif; font-size:21px; font-weight:700; color:#FFFFFF; }
      .island { width: 196px; height: 38px; border-radius: 999px; background: #000000; border: 1px solid rgba(255,255,255,0.14); display:flex; align-items:center; justify-content:flex-end; padding-right:14px; }
      .cam { width: 13px; height: 13px; border-radius: 50%; background: radial-gradient(circle, #2563EB 20%, #090D1A 70%); }
      .notif {
        background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.16);
        border-radius: 28px; padding: 22px 26px; margin-bottom: 40px;
        display: flex; align-items: center; justify-content: space-between;
        font-family: 'IBM Plex Mono', monospace; font-size: 18px; color: #FDA4AF; font-weight: 700;
      }
      .dl { font-size: 54px; font-weight: 840; line-height: 1.12; letter-spacing: -0.044em; margin-bottom: 24px; }
      .dl0 { color: #8B95A7; text-decoration: line-through; text-decoration-color: ${dir.alert}; text-decoration-thickness: 5px; }
      .sub { margin-top: 28px; padding-top: 22px; border-top: 1px solid rgba(255,255,255,0.12); font-family: 'IBM Plex Mono', monospace; font-size: 19px; color: #94A3B8; letter-spacing: 0.08em; }
      .home-ind { width: 220px; height: 7px; border-radius: 999px; background: rgba(255,255,255,0.34); margin: 28px auto 0; }
    </style></head><body>
      <div class="iphone"><div class="screen">
        <div>
          <div class="top-bar"><span>9:41</span><div class="island"><span class="cam"></span></div><span>5G</span></div>
          <div class="notif"><span>● PAGERDUTY · SEV-1</span><span>NOW</span></div>
          <div class="dl dl0">${esc(script.diagLines[0])}</div>
          <div class="dl">${esc(script.diagLines[1])}</div>
          <div class="dl">${esc(script.diagLines[2])}</div>
        </div>
        <div>
          <div class="sub">ROOT CAUSE TRACE · 02 / 05</div>
          <div class="home-ind"></div>
        </div>
      </div></div>
    </body></html>`;
  } else {
    const s1Dark = dir.sceneDark[1];
    const s1Cls = s1Dark ? 'slab-dark' : 'slab-light';
    const muted = s1Dark ? '#94A3B8' : '#586070';
    scene1 = `<!doctype html><html><head><meta charset="utf-8"><style>${baseCss}
      .bar { display:flex; align-items:center; justify-content:space-between; margin-bottom:40px; }
      .dots { display:flex; gap:12px; }
      .dot { width:15px; height:15px; border-radius:50%; }
      .dr { background:#FF5F57; } .dy { background:#FEBC2E; } .dg { background:#28C840; }
      .mt { font-family:'IBM Plex Mono',monospace; font-size:19px; font-weight:700; letter-spacing:0.12em; opacity:0.65; }
      .dl { font-size:62px; font-weight:840; line-height:1.12; letter-spacing:-0.044em; margin-bottom:22px; }
      .dl0 { color:${muted}; text-decoration:line-through; text-decoration-color:${dir.alert}; text-decoration-thickness:6px; }
      .prompt { margin-top:36px; padding:22px 28px; border-radius:18px; background:${s1Dark ? 'rgba(255,255,255,0.06)' : 'rgba(10,14,26,0.05)'}; font-family:'IBM Plex Mono',monospace; font-size:21px; color:${dir.alert}; font-weight:700; }
    </style></head><body>
      <div class="card ${s1Cls}">
        <div class="bar"><div class="dots"><span class="dot dr"></span><span class="dot dy"></span><span class="dot dg"></span></div><span class="mt">INCIDENT-TRACE.LOG · 02 / 05</span></div>
        <div class="dl dl0">${esc(script.diagLines[0])}</div>
        <div class="dl">${esc(script.diagLines[1])}</div>
        <div class="dl">${esc(script.diagLines[2])}</div>
        <div class="prompt">&gt; FAIL: ${esc(script.painKicker)}</div>
      </div>
    </body></html>`;
  }

  // SCENE 2: 3D Architectural System Rebuild Stack
  const s2Cls = isVision ? 'slab-vision' : 'slab-dark';
  const scene2 = `<!doctype html><html><head><meta charset="utf-8"><style>${baseCss}
    .ey { font-family:'IBM Plex Mono',monospace; font-size:20px; font-weight:700; letter-spacing:0.16em; color:${dir.accentBright}; margin-bottom:18px; }
    .t { font-size:66px; font-weight:880; letter-spacing:-0.046em; color:#FFFFFF; margin-bottom:38px; line-height:1.02; }
    .row {
      display:flex; align-items:center; gap:28px; padding:34px 38px;
      border-radius:${isVermilion ? '16px' : '28px'}; position:relative;
    }
    .conn { width:3px; height:22px; background:linear-gradient(180deg,${dir.accentBright},transparent); margin-left:52px; }
    .num {
      font-family:'IBM Plex Mono',monospace; font-size:24px; font-weight:800;
      color:#080A10; background:${dir.accentBright}; padding:8px 16px; border-radius:999px;
    }
    .st { font-size:38px; font-weight:780; letter-spacing:-0.032em; color:#FFFFFF; }
  </style></head><body>
    <div class="ey">THE FIX · ARCHITECTURE · 03 / 05</div>
    <div class="t">How we rebuilt it.</div>
    ${script.archSteps.map((s, i) => `
      <div class="row ${s2Cls}"><span class="num">${s.num}</span><span class="st">${esc(s.title)}</span></div>
      ${i < 2 ? '<div class="conn"></div>' : ''}
    `).join('')}
  </body></html>`;

  // SCENE 3: Monumental Proof Explosion! (Unboxed full-bleed on Vermilion & WallStreet Noir!)
  const s3Dark = dir.sceneDark[3];
  const s3Cls = dir.unboxedProof ? 'unboxed' : (s3Dark ? 'slab-dark' : 'slab-light');
  const s3Ink = s3Dark ? '#FFFFFF' : '#090C14';
  const scene3 = `<!doctype html><html><head><meta charset="utf-8"><style>${baseCss}
    .ey { font-family:'IBM Plex Mono',monospace; font-size:22px; font-weight:700; letter-spacing:0.16em; opacity:0.74; margin-bottom:22px; color:${s3Ink}; }
    .hn {
      font-size:${dir.unboxedProof ? Math.min(230, script.heroFontPx + 24) : script.heroFontPx}px;
      font-weight:900; line-height:0.90; letter-spacing:-0.062em;
      color:${dir.heroNumColor}; font-variant-numeric:tabular-nums;
    }
    .hl { margin-top:28px; font-size:52px; font-weight:860; letter-spacing:-0.04em; color:${s3Ink}; }
    .hs { margin-top:12px; font-size:29px; font-weight:550; opacity:0.78; color:${s3Ink}; }
  </style></head><body>
    <div class="card ${s3Cls}">
      <div class="ey">VERIFIED PRODUCTION PROOF · 04 / 05</div>
      <div class="hn">${esc(script.heroVal)}</div>
      <div class="hl">${esc(script.heroLabel)}.</div>
      <div class="hs">${esc(script.heroSub)}</div>
    </div>
  </body></html>`;

  // SCENE 4: High-Status Manhattan Flagship Outro
  const s4Cls = isVision ? 'slab-vision' : 'slab-dark';
  const [c1, c2, c3] = dir.ctaHeadline || ['We engineer', 'revenue-critical', 'backends.'];
  const scene4 = `<!doctype html><html><head><meta charset="utf-8"><style>${baseCss}
    .ey { font-family:'IBM Plex Mono',monospace; font-size:20px; font-weight:700; letter-spacing:0.16em; color:${dir.accentBright}; margin-bottom:24px; }
    .cl { font-size:88px; font-weight:900; line-height:1.0; letter-spacing:-0.05em; color:#FFFFFF; }
    .ca { color:${dir.accentBright}; }
    .brand {
      margin-top:52px; padding:34px 42px; border-radius:${isVermilion ? '18px' : '32px'};
      display:flex; align-items:center; justify-content:space-between;
    }
    .logo { height:52px; width:auto; display:block; }
    .city { font-family:'IBM Plex Mono',monospace; font-size:20px; font-weight:700; letter-spacing:0.12em; color:rgba(255,255,255,0.78); }
  </style></head><body>
    <div class="ey">OLVEN TECH · NEW YORK · 05 / 05</div>
    <div class="cl">${esc(c1)}</div>
    <div class="cl">${esc(c2)}</div>
    <div class="cl ca">${esc(c3)}</div>
    <div class="brand ${s4Cls}">
      ${logoLightUri ? `<img class="logo" src="${logoLightUri}" alt="Olven Tech" />` : `<div style="font-size:40px;font-weight:800;">Olven Tech</div>`}
      <span class="city">${esc(dir.ctaSub || 'MANHATTAN, NY')}</span>
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

function addAnimatedProp(cmds, layer, propPath, keyframes, influence = 84) {
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
  cmds.push({ command: 'keys.velocity', params: { inInfluence: influence, outInfluence: influence } });
}

function pickDirector(spec, directorOverride) {
  if (directorOverride && DIRECTORS[directorOverride]) return DIRECTORS[directorOverride];
  // Rotate cleanly through ALL 6 Manhattan Cinema Directors across consecutive waves via OLVEN_SEQ_INDEX!
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
 * Generates bespoke 3D camera + scene motion choreography based on the Director's editing skill!
 */
function buildChoreographyForSkill(skill) {
  if (skill === 'card_flip_linear_wipe') {
    // True 3D Card-Flip (90-deg turn on exit/entry) + Architectural Linear-Wipe Slice Reveal!
    return {
      influence: 88,
      camKeys: [
        [0.0, [540, 960, -1085]], [0.18, [540, 960, -1085]],
        [3.1, [540, 960, -1025]], [6.3, [540, 960, -1105]],
        [10.4, [540, 960, -1015]], [13.4, [540, 960, -1075]], [16.0, [540, 960, -1010]],
      ],
      scenes: [
        { idx: 0, inT: -0.5, outT: 2.85, heroPos: [[0.0, [540, 900, 0]], [0.18, [540, 900, 0]], [2.35, [540, 900, -45]], [2.80, [540, 900, 120]]], heroRotY: [[0.0, 0], [0.18, 0], [2.35, -4], [2.80, 92]], heroRotX: [[0.0, 0], [2.35, 0]], heroOp: [[0.0, 100], [2.62, 100], [2.80, 0]], chipPos: [[0.0, [540, 1345, -185]], [0.18, [540, 1345, -185]], [2.35, [540, 1338, -220]], [2.78, [540, 1460, -80]]], chipOp: [[0.0, 100], [2.45, 100], [2.76, 0]], sweep: [[0.25, [0.05, 0.15]], [2.2, [0.95, 0.85]]], sweepInt: 28 },
        { idx: 1, inT: 2.65, outT: 6.12, heroPos: [[2.65, [540, 900, 120]], [3.12, [540, 900, 0]], [5.60, [540, 900, -45]], [6.08, [540, 900, 90]]], heroRotY: [[2.65, -92], [3.12, 0], [5.60, 4], [6.08, 92]], heroRotX: [[2.65, 0], [5.60, 0]], heroOp: [[2.65, 0], [2.85, 100], [5.85, 100], [6.08, 0]], chipPos: [[2.85, [540, 1490, -100]], [3.30, [540, 1375, -185]], [5.60, [540, 1368, -220]], [6.05, [540, 1490, -100]]], chipOp: [[2.85, 0], [3.15, 100], [5.65, 100], [6.02, 0]], sweep: [[3.1, [0.0, 0.2]], [5.5, [1.0, 0.82]]], sweepInt: 28 },
        { idx: 2, inT: 5.95, outT: 10.12, linearWipeIn: [5.98, 6.52], heroPos: [[5.95, [540, 895, 60]], [6.50, [540, 895, 0]], [9.55, [540, 895, -50]], [10.08, [540, 895, 100]]], heroRotY: [[5.95, -8], [6.50, 0], [9.55, -3], [10.08, -90]], heroRotX: [[5.95, 0], [9.55, 0]], heroOp: [[5.95, 100], [9.82, 100], [10.08, 0]], chipPos: [[6.20, [540, 1520, -100]], [6.70, [540, 1385, -185]], [9.55, [540, 1378, -220]], [10.04, [540, 1520, -100]]], chipOp: [[6.20, 0], [6.50, 100], [9.60, 100], [10.00, 0]], sweep: [[6.45, [0.0, 0.22]], [9.4, [1.0, 0.80]]], sweepInt: 34 },
        { idx: 3, inT: 9.95, outT: 13.12, heroPos: [[9.95, [540, 835, 380]], [10.45, [540, 835, -10]], [12.60, [540, 835, -62]], [13.08, [540, 835, 120]]], heroRotY: [[9.95, 88], [10.45, 0], [12.60, 3], [13.08, 90]], heroRotX: [[9.95, 0], [12.60, 0]], heroOp: [[9.95, 0], [10.22, 100], [12.82, 100], [13.08, 0]], chipPos: [[10.15, [540, 1480, -80]], [10.65, [540, 1310, -185]], [12.60, [540, 1300, -225]], [13.05, [540, 1480, -80]]], chipOp: [[10.15, 0], [10.45, 100], [12.65, 100], [13.02, 0]], sweep: [[10.4, [0.05, 0.18]], [12.5, [0.95, 0.85]]], sweepInt: 26 },
        { idx: 4, inT: 12.95, outT: 16.5, heroPos: [[12.95, [540, 875, 220]], [13.50, [540, 875, 0]], [16.0, [540, 875, -40]]], heroRotY: [[12.95, -88], [13.50, 0], [16.0, -2]], heroRotX: [[12.95, 0], [16.0, 0]], heroOp: [[12.95, 0], [13.25, 100], [16.0, 100]], chipPos: [[13.20, [540, 1520, -80]], [13.75, [540, 1370, -195]], [16.0, [540, 1362, -235]]], chipOp: [[13.20, 0], [13.52, 100], [16.0, 100]], sweep: [[13.5, [0.0, 0.25]], [15.65, [1.0, 0.78]]], sweepInt: 34 },
      ],
    };
  }

  if (skill === 'lateral_whip_pan') {
    // Bold horizontal Leica Whip-Pan camera sweeps across scenes!
    return {
      influence: 90,
      camKeys: [
        [0.0, [540, 960, -1085]], [0.18, [540, 960, -1085]],
        [2.75, [660, 955, -1050]], [6.05, [420, 965, -1065]],
        [10.05, [650, 952, -1040]], [13.05, [440, 965, -1060]], [16.0, [540, 960, -1025]],
      ],
      scenes: [
        { idx: 0, inT: -0.5, outT: 2.86, heroPos: [[0.0, [540, 900, 0]], [0.18, [540, 900, 0]], [2.30, [540, 900, -35]], [2.82, [-420, 900, -180]]], heroRotY: [[0.0, 0], [0.18, 0], [2.30, -4], [2.82, -22]], heroRotX: [[0.0, 0], [2.30, 0]], heroOp: [[0.0, 100], [2.42, 100], [2.82, 0]], chipPos: [[0.0, [540, 1345, -185]], [0.18, [540, 1345, -185]], [2.30, [520, 1340, -215]], [2.80, [-520, 1340, -300]]], chipOp: [[0.0, 100], [2.38, 100], [2.78, 0]], sweep: [[0.25, [0.05, 0.15]], [2.2, [0.95, 0.85]]], sweepInt: 26 },
        { idx: 1, inT: 2.58, outT: 6.14, heroPos: [[2.58, [1480, 900, -120]], [3.08, [540, 900, 0]], [5.60, [540, 900, -40]], [6.10, [-420, 900, -180]]], heroRotY: [[2.58, 22], [3.08, 2], [5.60, -3], [6.10, -22]], heroRotX: [[2.58, 0], [5.60, 0]], heroOp: [[2.58, 0], [2.90, 100], [5.72, 100], [6.08, 0]], chipPos: [[2.74, [1520, 1375, -240]], [3.26, [540, 1375, -185]], [5.60, [555, 1370, -215]], [6.06, [-520, 1370, -300]]], chipOp: [[2.74, 0], [3.06, 100], [5.68, 100], [6.04, 0]], sweep: [[3.05, [0.0, 0.2]], [5.45, [1.0, 0.82]]], sweepInt: 26 },
        { idx: 2, inT: 5.95, outT: 10.14, heroPos: [[5.95, [1480, 895, -120]], [6.46, [540, 895, 0]], [9.55, [540, 895, -45]], [10.08, [-420, 895, -180]]], heroRotY: [[5.95, 22], [6.46, -2], [9.55, 3], [10.08, -22]], heroRotX: [[5.95, 0], [9.55, 0]], heroOp: [[5.95, 0], [6.28, 100], [9.68, 100], [10.06, 0]], chipPos: [[6.14, [1520, 1385, -240]], [6.66, [540, 1385, -185]], [9.55, [525, 1380, -220]], [10.05, [-520, 1380, -300]]], chipOp: [[6.14, 0], [6.46, 100], [9.64, 100], [10.02, 0]], sweep: [[6.45, [0.0, 0.22]], [9.4, [1.0, 0.80]]], sweepInt: 32 },
        { idx: 3, inT: 9.95, outT: 13.14, heroPos: [[9.95, [1480, 835, -120]], [10.46, [540, 835, -10]], [12.60, [540, 835, -55]], [13.10, [-420, 835, -180]]], heroRotY: [[9.95, 20], [10.46, 0], [12.60, 3], [13.10, -22]], heroRotX: [[9.95, 0], [12.60, 0]], heroOp: [[9.95, 0], [10.26, 100], [12.70, 100], [13.06, 0]], chipPos: [[10.12, [1520, 1310, -240]], [10.64, [540, 1310, -185]], [12.60, [555, 1300, -225]], [13.06, [-520, 1300, -300]]], chipOp: [[10.12, 0], [10.44, 100], [12.66, 100], [13.02, 0]], sweep: [[10.4, [0.05, 0.18]], [12.5, [0.95, 0.85]]], sweepInt: 24 },
        { idx: 4, inT: 12.95, outT: 16.5, heroPos: [[12.95, [1480, 875, -100]], [13.48, [540, 875, 0]], [16.0, [540, 875, -36]]], heroRotY: [[12.95, 20], [13.48, 0], [16.0, -2]], heroRotX: [[12.95, 0], [16.0, 0]], heroOp: [[12.95, 0], [13.28, 100], [16.0, 100]], chipPos: [[13.16, [1520, 1370, -240]], [13.70, [540, 1370, -195]], [16.0, [540, 1362, -235]]], chipOp: [[13.16, 0], [13.48, 100], [16.0, 100]], sweep: [[13.5, [0.0, 0.25]], [15.65, [1.0, 0.78]]], sweepInt: 32 },
      ],
    };
  }

  if (skill === 'mechanical_elevator_snap') {
    // Teenage Engineering vertical mechanical elevator slams (ultra-snappy 94% influence!)
    return {
      influence: 94,
      camKeys: [
        [0.0, [540, 960, -1085]], [0.18, [540, 960, -1085]],
        [6.0, [555, 950, -1055]], [10.0, [525, 968, -1035]], [16.0, [540, 960, -1020]],
      ],
      scenes: [
        { idx: 0, inT: -0.5, outT: 2.84, heroPos: [[0.0, [540, 900, 0]], [0.18, [540, 900, 0]], [2.42, [540, 900, -35]], [2.80, [540, -180, -120]]], heroRotY: [[0.0, 0], [2.42, 0]], heroRotX: [[0.0, 0], [2.42, 0], [2.80, 18]], heroOp: [[0.0, 100], [2.52, 100], [2.80, 0]], chipPos: [[0.0, [540, 1345, -185]], [0.18, [540, 1345, -185]], [2.42, [540, 1340, -210]], [2.78, [540, 320, -260]]], chipOp: [[0.0, 100], [2.48, 100], [2.76, 0]], sweep: [[0.25, [0.05, 0.15]], [2.2, [0.95, 0.85]]], sweepInt: 26 },
        { idx: 1, inT: 2.62, outT: 6.12, heroPos: [[2.62, [540, 1980, -80]], [3.00, [540, 900, 0]], [5.68, [540, 900, -38]], [6.08, [540, -180, -120]]], heroRotY: [[2.62, 0], [5.68, 0]], heroRotX: [[2.62, -18], [3.00, 0], [5.68, 0], [6.08, 18]], heroOp: [[2.62, 0], [2.84, 100], [5.76, 100], [6.06, 0]], chipPos: [[2.76, [540, 2150, -185]], [3.16, [540, 1375, -185]], [5.68, [540, 1368, -215]], [6.04, [540, 320, -260]]], chipOp: [[2.76, 0], [2.98, 100], [5.72, 100], [6.02, 0]], sweep: [[3.05, [0.0, 0.2]], [5.45, [1.0, 0.82]]], sweepInt: 26 },
        { idx: 2, inT: 5.95, outT: 10.12, heroPos: [[5.95, [540, 1980, -80]], [6.34, [540, 895, 0]], [9.62, [540, 895, -42]], [10.06, [540, -180, -120]]], heroRotY: [[5.95, 0], [9.62, 0]], heroRotX: [[5.95, -18], [6.34, 0], [9.62, 0], [10.06, 18]], heroOp: [[5.95, 0], [6.18, 100], [9.72, 100], [10.04, 0]], chipPos: [[6.10, [540, 2150, -185]], [6.50, [540, 1385, -185]], [9.62, [540, 1378, -220]], [10.02, [540, 320, -260]]], chipOp: [[6.10, 0], [6.32, 100], [9.68, 100], [9.98, 0]], sweep: [[6.45, [0.0, 0.22]], [9.4, [1.0, 0.80]]], sweepInt: 32 },
        { idx: 3, inT: 9.95, outT: 13.12, heroPos: [[9.95, [540, 1980, -80]], [10.34, [540, 835, -10]], [12.66, [540, 835, -55]], [13.08, [540, -180, -120]]], heroRotY: [[9.95, 0], [12.66, 0]], heroRotX: [[9.95, -16], [10.34, 0], [12.66, 0], [13.08, 18]], heroOp: [[9.95, 0], [10.16, 100], [12.74, 100], [13.04, 0]], chipPos: [[10.10, [540, 2100, -185]], [10.50, [540, 1310, -185]], [12.66, [540, 1300, -225]], [13.04, [540, 320, -260]]], chipOp: [[10.10, 0], [10.32, 100], [12.70, 100], [13.00, 0]], sweep: [[10.4, [0.05, 0.18]], [12.5, [0.95, 0.85]]], sweepInt: 20 },
        { idx: 4, inT: 12.95, outT: 16.5, heroPos: [[12.95, [540, 1980, -80]], [13.38, [540, 875, 0]], [16.0, [540, 875, -35]]], heroRotY: [[12.95, 0], [16.0, 0]], heroRotX: [[12.95, -16], [13.38, 0], [16.0, 0]], heroOp: [[12.95, 0], [13.18, 100], [16.0, 100]], chipPos: [[13.12, [540, 2120, -195]], [13.56, [540, 1370, -195]], [16.0, [540, 1362, -230]]], chipOp: [[13.12, 0], [13.38, 100], [16.0, 100]], sweep: [[13.5, [0.0, 0.25]], [15.65, [1.0, 0.78]]], sweepInt: 32 },
      ],
    };
  }

  // Default: Orbital 3D Depth Swoops (used by radial_zoom_burst & optical_light_wipe!)
  const useLightWipe = skill === 'optical_light_wipe';
  return {
    influence: 84,
    camKeys: [
      [0.0, [540, 960, -1085]], [0.18, [540, 960, -1085]],
      [2.70, [605, 945, -1045]], [6.00, [475, 972, -1065]],
      [10.00, [595, 948, -1035]], [13.00, [490, 968, -1058]], [16.00, [540, 960, -1020]],
    ],
    scenes: [
      { idx: 0, inT: -0.5, outT: 2.90, heroPos: [[0.0, [540, 900, 0]], [0.18, [540, 900, 0]], [2.25, [540, 900, -45]], [2.82, [60, 900, -420]]], heroRotY: [[0.0, 0], [0.18, 0], [2.25, -6.5], [2.82, -28]], heroRotX: [[0.0, 0], [0.18, 0], [2.25, 1.8]], heroOp: [[0.0, 100], [2.32, 100], [2.80, 0]], chipPos: [[0.0, [540, 1345, -185]], [0.18, [540, 1345, -185]], [2.25, [525, 1338, -225]], [2.80, [-40, 1338, -560]]], chipOp: [[0.0, 100], [2.28, 100], [2.76, 0]], sweep: [[0.25, [0.05, 0.15]], [2.20, [0.95, 0.85]]], sweepInt: 28 },
      { idx: 1, inT: 2.55, outT: 6.18, lightWipeIn: useLightWipe ? [2.58, 3.10] : null, heroPos: [[2.55, [920, 920, 480]], [3.15, [540, 900, 0]], [5.55, [540, 900, -48]], [6.10, [540, 560, -420]]], heroRotY: [[2.55, 26], [3.15, 3.5], [5.55, -4.5], [6.10, -18]], heroRotX: [[2.55, -9], [3.15, 0], [5.55, 1.6], [6.10, 18]], heroOp: [[2.55, useLightWipe ? 100 : 0], [2.95, 100], [5.65, 100], [6.06, 0]], chipPos: [[2.72, [960, 1405, 180]], [3.35, [540, 1375, -185]], [5.55, [555, 1368, -220]], [6.06, [540, 1060, -540]]], chipOp: [[2.72, 0], [3.12, 100], [5.62, 100], [6.02, 0]], sweep: [[3.05, [0.0, 0.2]], [5.45, [1.0, 0.82]]], sweepInt: 26 },
      { idx: 2, inT: 5.95, outT: 10.18, lightWipeIn: useLightWipe ? [5.98, 6.50] : null, heroPos: [[5.95, [540, 1240, 440]], [6.55, [540, 895, 0]], [9.50, [540, 895, -52]], [10.08, [540, 680, -400]]], heroRotY: [[5.95, -16], [6.55, -3.2], [9.50, 4.8], [10.08, 19]], heroRotX: [[5.95, 18], [6.55, 1.0], [9.50, -1.6], [10.08, -16]], heroOp: [[5.95, useLightWipe ? 100 : 0], [6.30, 100], [9.60, 100], [10.04, 0]], chipPos: [[6.15, [540, 1620, 160]], [6.78, [540, 1385, -185]], [9.50, [525, 1378, -225]], [10.04, [540, 1180, -540]]], chipOp: [[6.15, 0], [6.52, 100], [9.56, 100], [9.98, 0]], sweep: [[6.45, [0.0, 0.22]], [9.40, [1.0, 0.80]]], sweepInt: 34 },
      { idx: 3, inT: 9.95, outT: 13.18, lightWipeIn: useLightWipe ? [9.98, 10.50] : null, heroPos: [[9.95, [540, 860, 560]], [10.55, [540, 835, -10]], [12.55, [540, 835, -62]], [13.10, [940, 835, -420]]], heroRotY: [[9.95, -20], [10.55, -2.5], [12.55, 4.2], [13.10, 26]], heroRotX: [[9.95, 8], [10.55, 0], [12.55, -1.2]], heroOp: [[9.95, useLightWipe ? 100 : 0], [10.30, 100], [12.62, 100], [13.04, 0]], chipPos: [[10.12, [540, 1540, 140]], [10.72, [540, 1310, -185]], [12.55, [555, 1300, -225]], [13.06, [980, 1300, -550]]], chipOp: [[10.12, 0], [10.48, 100], [12.60, 100], [13.02, 0]], sweep: [[10.40, [0.05, 0.18]], [12.50, [0.95, 0.85]]], sweepInt: 28 },
      { idx: 4, inT: 12.95, outT: 16.5, heroPos: [[12.95, [540, 1180, 420]], [13.60, [540, 875, 0]], [16.0, [540, 875, -38]]], heroRotY: [[12.95, 16], [13.60, 1.5], [16.0, -2.2]], heroRotX: [[12.95, 15], [13.60, 0], [16.0, 0]], heroOp: [[12.95, 0], [13.35, 100], [16.0, 100]], chipPos: [[13.18, [540, 1560, 120]], [13.85, [540, 1370, -195]], [16.0, [540, 1362, -235]]], chipOp: [[13.18, 0], [13.55, 100], [16.0, 100]], sweep: [[13.50, [0.0, 0.25]], [15.65, [1.0, 0.78]]], sweepInt: 34 },
    ],
  };
}

async function renderWalkthroughVideo(specPath, outDir, directorOverride = null) {
  const spec = JSON.parse(fs.readFileSync(specPath, 'utf8'));
  const dir = pickDirector(spec, directorOverride);
  const choreoPlan = buildChoreographyForSkill(dir.editSkill);

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

  const cmds = [
    {
      command: 'comp.new',
      params: {
        name: 'Main',
        width: WIDTH,
        height: HEIGHT,
        frameRate: FPS,
        duration: DURATION,
        background: '#080A0E',
        shutterAngle: 150,
        shutterPhase: 0,
        motionBlurSamples: 6,
        renderer: 'classic3D',
        open: true,
      },
    },
  ];

  const sceneBounds = [
    [-0.5, 2.75],
    [2.75, 6.05],
    [6.05, 10.05],
    [10.05, 13.05],
    [13.05, 16.5],
  ];
  for (let i = 0; i < 5; i++) {
    const bgName = `Dome_${i}`;
    const [inT, outT] = sceneBounds[i];
    const [startColor, endColor] = dir.domes[i];
    cmds.push({ command: 'layer.newSolid', params: { name: bgName, color: '#080A0E', width: WIDTH, height: HEIGHT } });
    cmds.push({ command: 'layer.timing', params: { layers: [bgName], in: inT, out: outT } });
    cmds.push({ command: 'effect.apply', params: { effect: 'ec.generate.gradientramp', layers: [bgName] } });
    cmds.push({ command: 'prop.set', params: { layer: bgName, path: 'effects/#1/shape', value: 1 } });
    cmds.push({ command: 'prop.set', params: { layer: bgName, path: 'effects/#1/start', value: [0.5, 0.32] } });
    cmds.push({ command: 'prop.set', params: { layer: bgName, path: 'effects/#1/end', value: [0.5, 1.12] } });
    cmds.push({ command: 'prop.set', params: { layer: bgName, path: 'effects/#1/startColor', value: startColor } });
    cmds.push({ command: 'prop.set', params: { layer: bgName, path: 'effects/#1/endColor', value: endColor } });
    cmds.push({ command: 'prop.set', params: { layer: bgName, path: 'effects/#1/scatter', value: 30.0 } });
  }

  cmds.push({
    command: 'layer.newCamera',
    params: { name: 'HeroCam', preset: '35mm', position: [540, 960, -1085], poi: [540, 960, 0] },
  });
  cmds.push({ command: 'layer.timing', params: { layers: ['HeroCam'], in: -0.5, out: 16.5 } });
  addAnimatedProp(cmds, 'HeroCam', 'transform/position', choreoPlan.camKeys, 78);

  for (const c of choreoPlan.scenes) {
    // PLANE 1: Background Architectural Depth Plane (Z = +360)
    const dName = `Depth_${c.idx}`;
    const [bIn, bOut] = sceneBounds[c.idx];
    cmds.push({ command: 'file.import', params: { paths: [assets.depths[c.idx]], addToComp: true } });
    cmds.push({ command: 'layer.rename', params: { layer: '#1', name: dName } });
    cmds.push({ command: 'layer.setSwitch', params: { layers: [dName], switch: 'threeD', value: true } });
    cmds.push({ command: 'layer.timing', params: { layers: [dName], in: bIn, out: bOut } });
    cmds.push({ command: 'prop.set', params: { layer: dName, path: 'transform/scale', value: [134, 134, 134] } });
    cmds.push({ command: 'prop.set', params: { layer: dName, path: 'transform/position', value: [540, 960, 360] } });

    // PLANE 2: Hero 2x Retina Glass/Hardware/Editorial Slab (Z = 0)
    const hName = `Hero_${c.idx}`;
    cmds.push({ command: 'file.import', params: { paths: [assets.heroes[c.idx]], addToComp: true } });
    cmds.push({ command: 'layer.rename', params: { layer: '#1', name: hName } });
    cmds.push({ command: 'layer.setSwitch', params: { layers: [hName], switch: 'threeD', value: true } });
    cmds.push({ command: 'layer.setSwitch', params: { layers: [hName], switch: 'motionBlur', value: true } });
    cmds.push({ command: 'layer.timing', params: { layers: [hName], in: c.inT, out: c.outT } });
    cmds.push({ command: 'prop.set', params: { layer: hName, path: 'transform/scale', value: [50, 50, 50] } });

    addAnimatedProp(cmds, hName, 'transform/position', c.heroPos, choreoPlan.influence);
    addAnimatedProp(cmds, hName, 'transform/rotationY', c.heroRotY, choreoPlan.influence);
    addAnimatedProp(cmds, hName, 'transform/rotationX', c.heroRotX, choreoPlan.influence);
    addAnimatedProp(cmds, hName, 'transform/opacity', c.heroOp, 75);

    let effIdx = 0;
    // Effect 1: Sapphire Specular Light Sweep (skip on unboxed matte typography so text stays crisp!)
    const skipSweep = (c.idx === 0 && dir.unboxedHook) || (c.idx === 3 && dir.unboxedProof);
    if (!skipSweep) {
      effIdx += 1;
      cmds.push({ command: 'effect.apply', params: { effect: 'ec.generate.cclightsweep', layers: [hName] } });
      cmds.push({ command: 'prop.set', params: { layer: hName, path: `effects/#${effIdx}/direction`, value: -26.0 } });
      cmds.push({ command: 'prop.set', params: { layer: hName, path: `effects/#${effIdx}/width`, value: 76.0 } });
      cmds.push({ command: 'prop.set', params: { layer: hName, path: `effects/#${effIdx}/sweepIntensity`, value: c.sweepInt } });
      cmds.push({ command: 'prop.set', params: { layer: hName, path: `effects/#${effIdx}/edgeIntensity`, value: 48.0 } });
      cmds.push({ command: 'prop.set', params: { layer: hName, path: `effects/#${effIdx}/edgeThickness`, value: 1.8 } });
      addAnimatedProp(cmds, hName, `effects/#${effIdx}/center`, c.sweep);
    }

    // Skill-specific Video-Editing Transitions inside EffectCraft!
    if (c.linearWipeIn) {
      effIdx += 1;
      const [tA, tB] = c.linearWipeIn;
      cmds.push({ command: 'effect.apply', params: { effect: 'ec.transition.linearwipe', layers: [hName] } });
      cmds.push({ command: 'prop.set', params: { layer: hName, path: `effects/#${effIdx}/angle`, value: -72.0 } });
      cmds.push({ command: 'prop.set', params: { layer: hName, path: `effects/#${effIdx}/feather`, value: 36.0 } });
      addAnimatedProp(cmds, hName, `effects/#${effIdx}/completion`, [[tA, 100.0], [tB, 0.0]], 85);
    }
    if (c.lightWipeIn) {
      effIdx += 1;
      const [tA, tB] = c.lightWipeIn;
      cmds.push({ command: 'effect.apply', params: { effect: 'ec.transition.cclightwipe', layers: [hName] } });
      cmds.push({ command: 'prop.set', params: { layer: hName, path: `effects/#${effIdx}/intensity`, value: 115.0 } });
      cmds.push({ command: 'prop.set', params: { layer: hName, path: `effects/#${effIdx}/colorFromSource`, value: true } });
      addAnimatedProp(cmds, hName, `effects/#${effIdx}/completion`, [[tA, 100.0], [tB, 0.0]], 85);
    }
    if (dir.opticalGlow && (c.idx === 2 || c.idx === 4)) {
      effIdx += 1;
      cmds.push({ command: 'effect.apply', params: { effect: 'ec.stylize.glow', layers: [hName] } });
      cmds.push({ command: 'prop.set', params: { layer: hName, path: `effects/#${effIdx}/threshold`, value: 78.0 } });
      cmds.push({ command: 'prop.set', params: { layer: hName, path: `effects/#${effIdx}/radius`, value: 22.0 } });
      cmds.push({ command: 'prop.set', params: { layer: hName, path: `effects/#${effIdx}/intensity`, value: 0.45 } });
    }

    // PLANE 3: Foreground Floating 3D Depth Chip (Z = -190!) + Optical Drop Shadow
    const fName = `FgChip_${c.idx}`;
    cmds.push({ command: 'file.import', params: { paths: [assets.chips[c.idx]], addToComp: true } });
    cmds.push({ command: 'layer.rename', params: { layer: '#1', name: fName } });
    cmds.push({ command: 'layer.setSwitch', params: { layers: [fName], switch: 'threeD', value: true } });
    cmds.push({ command: 'layer.setSwitch', params: { layers: [fName], switch: 'motionBlur', value: true } });
    cmds.push({ command: 'layer.timing', params: { layers: [fName], in: c.inT, out: c.outT } });
    cmds.push({ command: 'prop.set', params: { layer: fName, path: 'transform/scale', value: [44, 44, 44] } });

    addAnimatedProp(cmds, fName, 'transform/position', c.chipPos, choreoPlan.influence);
    addAnimatedProp(cmds, fName, 'transform/rotationY', c.heroRotY.map(([t, v]) => [t, v * 0.65]), choreoPlan.influence);
    addAnimatedProp(cmds, fName, 'transform/opacity', c.chipOp, 75);

    cmds.push({ command: 'effect.apply', params: { effect: 'ec.perspective.dropshadow', layers: [fName] } });
    cmds.push({ command: 'prop.set', params: { layer: fName, path: 'effects/#1/opacity', value: 42.0 } });
    cmds.push({ command: 'prop.set', params: { layer: fName, path: 'effects/#1/distance', value: 28.0 } });
    cmds.push({ command: 'prop.set', params: { layer: fName, path: 'effects/#1/softness', value: 52.0 } });
  }

  // Top Cinema Grade Adjustment Layer:
  // Vignette + 35mm Monochrome Anti-Banding Grain + Optional Radial Zoom-Burst Whip-Cuts!
  cmds.push({ command: 'layer.newAdjustment', params: { name: 'CinemaGrade' } });
  cmds.push({ command: 'effect.apply', params: { effect: 'ec.stylize.ccvignette', layers: ['CinemaGrade'] } });
  cmds.push({ command: 'prop.set', params: { layer: 'CinemaGrade', path: 'effects/#1/amount', value: 14.0 } });
  cmds.push({ command: 'effect.apply', params: { effect: 'ec.noise.addgrain', layers: ['CinemaGrade'] } });
  cmds.push({ command: 'prop.set', params: { layer: 'CinemaGrade', path: 'effects/#2/viewingMode', value: 2 } });
  cmds.push({ command: 'prop.set', params: { layer: 'CinemaGrade', path: 'effects/#2/tweaking/intensity', value: 0.14 } });
  cmds.push({ command: 'prop.set', params: { layer: 'CinemaGrade', path: 'effects/#2/color/monochromatic', value: true } });

  if (dir.editSkill === 'radial_zoom_burst') {
    // Optical Radial Fast Blur whip-zoom pulse strictly across scene cut boundaries (0 at Frame 0!)
    cmds.push({ command: 'effect.apply', params: { effect: 'ec.blur.ccradialfast', layers: ['CinemaGrade'] } });
    addAnimatedProp(cmds, 'CinemaGrade', 'effects/#3/amount', [
      [0.0, 0.0], [2.52, 0.0], [2.75, 42.0], [3.05, 0.0],
      [5.82, 0.0], [6.05, 44.0], [6.36, 0.0],
      [9.82, 0.0], [10.05, 44.0], [10.36, 0.0],
      [12.82, 0.0], [13.05, 40.0], [13.38, 0.0], [16.0, 0.0],
    ], 70);
  }

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
    '--bitrate', '9200', // ~18.6 MB for 16s: studio 1080p quality AND strictly under jsDelivr's 20 MB CDN limit!
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

  // Hard CDN Safety Guard: jsDelivr blocks files > 20.0 MB with HTTP 403!
  // If an unusually dense 3D scene exceeds 19.4 MB, re-encode cleanly to 8.8 Mbps (~18.0 MB) Rec.709.
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
    `[OK] Rendered ArtCraft EffectCraft 3D Reel [${dir.name} | skill=${dir.editSkill} | ${dir.track}, 9.2Mbps Rec.709 in ${elapsed}s, ${mb} MB] -> ${outMp4}`
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
