#!/usr/bin/env node
/**
 * Olven Tech — Entertainment-First Viral 3D Story Engine (ArtCraft EffectCraft v0.24.1)
 *
 * Designed for MAXIMUM views, watch-through completion, shares, comments & inbound B2B clients:
 *  - ZERO boring static text slides — 13 individual visual + audio dopamine beats across 16.0s!
 *  - Beat 1 (0.0–3.6s): Live 3D iPhone 16 Pro Lockscreen Meltdown (3 notifications pop in 1-by-1 with real dings!)
 *  - Beat 2 (3.4–7.4s): Live Workplace Group-Chat Drama (#emergency-chat — CFO panic -> Dev sweat -> Olven Tech enters!)
 *  - Beat 3 (7.2–10.7s): Interactive Apple Fix Switches (3 glowing emerald toggles flip ON with ascending clicks!)
 *  - Beat 4 (10.5–13.7s): Giant Struck-Through BEFORE -> Glowing Emerald AFTER Payoff + Happy CFO Reply Bubble!
 *  - Beat 5 (13.5–16.0s): Punchy Shareable Brand Drop ("Don't be the next 9 AM Slack meltdown.")
 *  - 100% Butter-Smooth Apple exponential deceleration (inInfluence: 88, outInfluence: 25), silky 0.45s cross-dissolves,
 *    ZERO 90-deg flips, ZERO 1-frame luminance flashes, ZERO radial smear!
 *  - Synced 116-BPM upbeat pulse + Apple-style UI SFX via mix_reel_sfx.py (pure Python stdlib + FFmpeg).
 *  - Output: 1080x1920 30fps H.264 9.2 Mbps Rec.709 (strictly <= 19.4 MB CDN-safe).
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
  apple_obsidian_titanium: {
    name: 'apple_obsidian_titanium',
    label: 'NEW YORK · REAL STORIES',
    isDark: true,
    track: 'nyc_felt_piano_mvt2.mp3',
    domes: [
      [[0.068, 0.095, 0.160, 1.0], [0.020, 0.025, 0.040, 1.0]],
      [[0.092, 0.065, 0.105, 1.0], [0.022, 0.024, 0.036, 1.0]],
      [[0.048, 0.112, 0.145, 1.0], [0.018, 0.025, 0.038, 1.0]],
      [[0.048, 0.128, 0.115, 1.0], [0.018, 0.026, 0.035, 1.0]],
      [[0.064, 0.088, 0.155, 1.0], [0.020, 0.024, 0.038, 1.0]],
    ],
    ink: '#F8FAFC',
    inkMuted: '#94A3B8',
    accent: '#60A5FA',
    proofColor: '#34D399',
    proofSoft: 'rgba(52, 211, 153, 0.16)',
    alert: '#FB7185',
    alertSoft: 'rgba(251, 113, 133, 0.16)',
    surfaceBg: 'rgba(18, 24, 38, 0.90)',
    surfaceBorder: 'rgba(255, 255, 255, 0.15)',
    depthMotif: 'spatial_rings',
  },

  anthropic_warm_editorial: {
    name: 'anthropic_warm_editorial',
    label: 'NEW YORK · REAL STORIES',
    isDark: false,
    track: 'nyc_felt_piano_mvt1.mp3',
    domes: [
      [[0.968, 0.954, 0.926, 1.0], [0.916, 0.896, 0.854, 1.0]],
      [[0.962, 0.946, 0.920, 1.0], [0.910, 0.888, 0.848, 1.0]],
      [[0.966, 0.954, 0.930, 1.0], [0.914, 0.898, 0.864, 1.0]],
      [[0.972, 0.958, 0.932, 1.0], [0.922, 0.904, 0.862, 1.0]],
      [[0.964, 0.950, 0.924, 1.0], [0.914, 0.894, 0.852, 1.0]],
    ],
    ink: '#141413',
    inkMuted: '#57534E',
    accent: '#C96442',
    proofColor: '#059669',
    proofSoft: '#E2F6EF',
    alert: '#DC2626',
    alertSoft: '#FEECEC',
    surfaceBg: 'rgba(255, 253, 249, 0.95)',
    surfaceBorder: 'rgba(20, 20, 19, 0.11)',
    depthMotif: 'editorial_hairlines',
  },

  stripe_linear_precision: {
    name: 'stripe_linear_precision',
    label: 'NEW YORK · REAL STORIES',
    isDark: true,
    track: 'nyc_felt_piano_mvt3.mp3',
    domes: [
      [[0.075, 0.082, 0.175, 1.0], [0.022, 0.026, 0.052, 1.0]],
      [[0.102, 0.074, 0.140, 1.0], [0.024, 0.026, 0.048, 1.0]],
      [[0.052, 0.118, 0.148, 1.0], [0.020, 0.028, 0.046, 1.0]],
      [[0.045, 0.132, 0.120, 1.0], [0.018, 0.028, 0.042, 1.0]],
      [[0.072, 0.080, 0.168, 1.0], [0.022, 0.026, 0.050, 1.0]],
    ],
    ink: '#FFFFFF',
    inkMuted: '#94A3B8',
    accent: '#818CF8',
    proofColor: '#34D399',
    proofSoft: 'rgba(52, 211, 153, 0.16)',
    alert: '#F59E0B',
    alertSoft: 'rgba(245, 158, 11, 0.16)',
    surfaceBg: 'rgba(18, 22, 38, 0.90)',
    surfaceBorder: 'rgba(255, 255, 255, 0.14)',
    depthMotif: 'telemetry_dotgrid',
  },

  openai_ceramic_studio: {
    name: 'openai_ceramic_studio',
    label: 'NEW YORK · REAL STORIES',
    isDark: false,
    track: 'nyc_felt_piano_mvt1.mp3',
    domes: [
      [[0.985, 0.990, 1.000, 1.0], [0.922, 0.946, 0.988, 1.0]],
      [[0.988, 0.985, 0.996, 1.0], [0.938, 0.935, 0.975, 1.0]],
      [[0.982, 0.994, 0.994, 1.0], [0.918, 0.958, 0.960, 1.0]],
      [[0.984, 0.996, 0.990, 1.0], [0.918, 0.962, 0.945, 1.0]],
      [[0.985, 0.990, 1.000, 1.0], [0.922, 0.946, 0.988, 1.0]],
    ],
    ink: '#0A0B0E',
    inkMuted: '#4B5563',
    accent: '#1D4ED8',
    proofColor: '#047857',
    proofSoft: '#E2F6EF',
    alert: '#DC2626',
    alertSoft: '#FEECEC',
    surfaceBg: 'rgba(255, 255, 255, 0.95)',
    surfaceBorder: 'rgba(15, 23, 42, 0.10)',
    depthMotif: 'studio_grid',
  },

  manhattan_executive_noir: {
    name: 'manhattan_executive_noir',
    label: 'MANHATTAN · REAL STORIES',
    isDark: true,
    track: 'nyc_felt_piano_mvt2.mp3',
    domes: [
      [[0.090, 0.082, 0.072, 1.0], [0.024, 0.022, 0.020, 1.0]],
      [[0.102, 0.076, 0.070, 1.0], [0.026, 0.022, 0.020, 1.0]],
      [[0.075, 0.095, 0.082, 1.0], [0.022, 0.024, 0.022, 1.0]],
      [[0.082, 0.098, 0.078, 1.0], [0.022, 0.024, 0.020, 1.0]],
      [[0.088, 0.082, 0.072, 1.0], [0.024, 0.022, 0.020, 1.0]],
    ],
    ink: '#FAF7F0',
    inkMuted: '#A8A29E',
    accent: '#E5B84B',
    proofColor: '#4ADE80',
    proofSoft: 'rgba(74, 222, 128, 0.16)',
    alert: '#F87171',
    alertSoft: 'rgba(248, 113, 113, 0.16)',
    surfaceBg: 'rgba(26, 23, 20, 0.92)',
    surfaceBorder: 'rgba(250, 247, 240, 0.14)',
    depthMotif: 'editorial_hairlines',
  },

  google_deepmind_luminous: {
    name: 'google_deepmind_luminous',
    label: 'NEW YORK · REAL STORIES',
    isDark: false,
    track: 'nyc_felt_piano_mvt3.mp3',
    domes: [
      [[0.980, 0.990, 1.000, 1.0], [0.908, 0.945, 0.995, 1.0]],
      [[0.988, 0.984, 0.988, 1.0], [0.944, 0.926, 0.935, 1.0]],
      [[0.978, 0.994, 0.988, 1.0], [0.906, 0.958, 0.935, 1.0]],
      [[0.980, 0.995, 0.990, 1.0], [0.910, 0.960, 0.940, 1.0]],
      [[0.980, 0.990, 1.000, 1.0], [0.908, 0.945, 0.995, 1.0]],
    ],
    ink: '#0F172A',
    inkMuted: '#475569',
    accent: '#1A73E8',
    proofColor: '#188038',
    proofSoft: '#E6F4EA',
    alert: '#D93025',
    alertSoft: '#FCE8E6',
    surfaceBg: 'rgba(255, 255, 255, 0.95)',
    surfaceBorder: 'rgba(26, 115, 232, 0.14)',
    depthMotif: 'spatial_rings',
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

function compileEntertainmentScript(spec) {
  const m0 = (spec.metrics && spec.metrics[0]) || { value: '$0.00', label: 'ERRORS', sub: 'Verified in production' };
  const m1 = (spec.metrics && spec.metrics[1]) || { value: '0', label: 'OUTAGES', sub: 'Fixed in days' };
  const m2 = (spec.metrics && spec.metrics[2]) || m1;

  const ent = spec.entertainment || {};
  const timeStr = ent.time || '9:14 AM';

  const aNodes = ((spec.viral_after_nodes && spec.viral_after_nodes.length)
    ? spec.viral_after_nodes
    : (spec.after_nodes || ['Lock Every Action', 'Stamp 1 Unique ID', 'Verify Before Retry'])).slice(0, 3);

  const hookHeadline = stripHtml(spec.viral_headline || spec.headline || 'One tiny bug cost $64,000.');
  const hookLines = (Array.isArray(spec.viral_hook_lines) && spec.viral_hook_lines.length === 3)
    ? spec.viral_hook_lines.map(stripHtml)
    : [hookHeadline.split(' ').slice(0, 3).join(' '), hookHeadline.split(' ').slice(3, 6).join(' '), m0.value];

  const notifs = (ent.notifs && ent.notifs.length >= 3)
    ? ent.notifs
    : [
        { app: 'SYSTEM ALERT', time: timeStr, title: stripHtml(spec.before_title || 'System Stalled'), body: stripHtml((spec.viral_before_nodes || spec.before_nodes || ['Bottleneck hit'])[0]), tone: 'warn' },
        { app: 'CRITICAL', time: timeStr, title: stripHtml(spec.before_badge || 'Revenue At Risk'), body: stripHtml((spec.viral_before_points || spec.before_points || ['Production incident triggered'])[0]).slice(0, 68), tone: 'danger' },
        { app: 'SLACK · #OPS', time: 'now', title: 'Founder is typing...', body: '"WHO CAN FIX THIS RIGHT NOW?!"', tone: 'panic' },
      ];

  const chat = (ent.chat && ent.chat.length >= 3)
    ? ent.chat
    : [
        { who: 'Founder', side: 'left', role: 'cfo', msg: `Why is ${stripHtml(spec.before_badge || 'this breaking')} happening right now?!` },
        { who: 'Dev On-Call', side: 'right', role: 'dev', msg: stripHtml((spec.viral_before_points || spec.before_points || ['The legacy script choked under load.'])[0]).slice(0, 88) },
        { who: 'Olven Tech', side: 'left', role: 'olven', msg: `Fixed it in days. ${aNodes[0]} + ${aNodes[1]}. Result: ${m0.value}.` },
      ];

  const cfoReact = ent.cfo_react || `${m0.value} ${m0.label.toLowerCase()} & ${m1.value} ${m1.label.toLowerCase()}. Best call we made all year.`;

  let heroMetric = m0;
  for (const m of [m0, m1, m2]) {
    if (String(m.value).includes('$') || String(m.value).includes('%') || String(m.value).includes('x')) {
      heroMetric = m;
      break;
    }
  }
  const rest = [m0, m1, m2].filter((x) => x !== heroMetric);
  const cleanTag = (s) => String(s || '').replace(/\s+/g, ' ').trim();

  return {
    timeStr,
    hookHeadline,
    hookLines,
    notifs,
    chat,
    cfoReact,
    beforeStat: cleanTag(spec.viral_before_stat || spec.before_badge || 'BROKEN LEGACY FLOW'),
    fixSteps: [
      { num: '01', title: cleanTag(aNodes[0]) },
      { num: '02', title: cleanTag(aNodes[1]) },
      { num: '03', title: cleanTag(aNodes[2]) },
    ],
    heroVal: cleanTag(heroMetric.value),
    heroFontPx: cleanTag(heroMetric.value).length >= 7 ? 142 : (cleanTag(heroMetric.value).length >= 5 ? 172 : 204),
    heroLabel: cleanTag(heroMetric.label).toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase()),
    heroSub: cleanTag(heroMetric.sub),
    subA: rest[0] || m1,
    subB: rest[1] || m2,
  };
}

function fontsCss(interB64, monoB64) {
  return `
    @font-face { font-family: 'Inter'; src: url('data:font/woff2;base64,${interB64}') format('woff2'); font-weight: 100 900; }
    @font-face { font-family: 'IBM Plex Mono'; src: url('data:font/woff2;base64,${monoB64}') format('woff2'); font-weight: 400 700; }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif; -webkit-font-smoothing: antialiased; }
  `;
}

function buildDepthHtml(idx, dir, interB64, monoB64) {
  const stroke = dir.isDark ? 'rgba(255,255,255,0.08)' : 'rgba(15,23,42,0.07)';
  const prog = [0, 1, 2, 3, 4].map((i) => {
    const active = i <= idx;
    const bg = active ? dir.accent : (dir.isDark ? 'rgba(255,255,255,0.16)' : 'rgba(15,23,42,0.12)');
    const op = i === idx ? '1' : (active ? '0.52' : '1');
    return `<div style="flex:1;height:6px;border-radius:999px;background:${bg};opacity:${op};"></div>`;
  }).join('');

  return `<!doctype html><html><head><meta charset="utf-8"><style>${fontsCss(interB64, monoB64)}
    html, body { width: 1080px; height: 1920px; background: transparent; overflow: hidden; position: relative; }
  </style></head><body>
    <div style="position:absolute;top:110px;left:90px;right:90px;display:flex;gap:14px;">${prog}</div>
    <div style="position:absolute;inset:64px;border:1px solid ${stroke};border-radius:36px;"></div>
    <div style="position:absolute;bottom:92px;left:92px;font-family:'IBM Plex Mono',monospace;font-size:17px;letter-spacing:0.2em;color:${stroke};">OLVEN TECH · ${dir.label}</div>
  </body></html>`;
}

function buildNotificationCardHtml(n, idx, interB64, monoB64) {
  const isDanger = n.tone === 'danger' || n.tone === 'panic';
  const bg = n.tone === 'panic'
    ? 'linear-gradient(135deg, rgba(225, 29, 72, 0.96) 0%, rgba(159, 18, 57, 0.96) 100%)'
    : isDanger
    ? 'rgba(46, 16, 26, 0.96)'
    : 'rgba(26, 32, 46, 0.96)';
  const border = n.tone === 'panic'
    ? 'rgba(255, 255, 255, 0.34)'
    : isDanger
    ? 'rgba(244, 63, 94, 0.65)'
    : 'rgba(255, 255, 255, 0.18)';
  const tagColor = n.tone === 'panic' ? '#FFF1F2' : (isDanger ? '#FDA4AF' : '#93C5FD');

  return `<!doctype html><html><head><meta charset="utf-8"><style>${fontsCss(interB64, monoB64)}
    html, body { width: 720px; height: 204px; background: transparent; display: flex; align-items: center; justify-content: center; padding: 10px; }
    .card {
      width: 100%; border-radius: 28px; padding: 24px 28px;
      background: ${bg}; border: 1.5px solid ${border};
      box-shadow: 0 22px 46px -12px rgba(0,0,0,0.62); color: #FFFFFF;
    }
    .hdr { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; font-family: 'IBM Plex Mono', monospace; font-size: 16px; font-weight: 800; letter-spacing: 0.08em; color: ${tagColor}; }
    .t { font-size: 27px; font-weight: 820; letter-spacing: -0.03em; line-height: 1.15; color: #FFFFFF; }
    .b { margin-top: 6px; font-size: 20px; font-weight: 500; line-height: 1.28; color: rgba(255,255,255,0.88); }
  </style></head><body>
    <div class="card">
      <div class="hdr"><span>● ${esc(n.app)}</span><span>${esc(n.time)}</span></div>
      <div class="t">${esc(n.title)}</div>
      <div class="b">${esc(n.body)}</div>
    </div>
  </body></html>`;
}

function buildChatBubbleHtml(msgObj, dir, interB64, monoB64) {
  const isRight = msgObj.side === 'right';
  const isOlven = msgObj.role === 'olven';
  const isCfo = msgObj.role === 'cfo';

  const bg = isOlven
    ? (dir.isDark ? 'linear-gradient(135deg, rgba(16,185,129,0.28) 0%, rgba(5,150,105,0.20) 100%)' : '#E6F7F0')
    : isCfo
    ? (dir.isDark ? 'rgba(244,63,94,0.22)' : '#FFF1F2')
    : (dir.isDark ? 'rgba(255,255,255,0.12)' : '#F1F5F9');
  const border = isOlven
    ? 'rgba(16,185,129,0.55)'
    : isCfo
    ? 'rgba(244,63,94,0.48)'
    : (dir.isDark ? 'rgba(255,255,255,0.20)' : 'rgba(15,23,42,0.12)');
  const whoColor = isOlven ? dir.proofColor : (isCfo ? dir.alert : dir.inkMuted);
  const txtColor = dir.ink;

  const badge = isOlven
    ? `<div style="align-self:center;margin-bottom:14px;padding:7px 20px;border-radius:999px;background:${dir.proofSoft};border:1px solid ${dir.proofColor}66;font-family:'IBM Plex Mono',monospace;font-size:16px;font-weight:800;letter-spacing:0.1em;color:${dir.proofColor};">⚡ OLVEN TECH ENTERED THE CHAT</div>`
    : '';

  return `<!doctype html><html><head><meta charset="utf-8"><style>${fontsCss(interB64, monoB64)}
    html, body { width: 840px; height: ${isOlven ? '320' : '250'}px; background: transparent; display: flex; flex-direction: column; justify-content: center; padding: 12px 16px; }
    .wrap { display: flex; flex-direction: column; max-width: 90%; align-self: ${isRight ? 'flex-end' : 'flex-start'}; align-items: ${isRight ? 'flex-end' : 'flex-start'}; }
    .who { font-family: 'IBM Plex Mono', monospace; font-size: 16px; font-weight: 800; letter-spacing: 0.08em; text-transform: uppercase; color: ${whoColor}; margin-bottom: 8px; }
    .b {
      padding: 24px 30px; border-radius: 28px;
      ${isRight ? 'border-bottom-right-radius: 8px;' : 'border-bottom-left-radius: 8px;'}
      background: ${bg}; border: 1.5px solid ${border};
      font-size: 29px; font-weight: 700; line-height: 1.32; color: ${txtColor};
      box-shadow: 0 18px 42px -14px rgba(0,0,0,${dir.isDark ? '0.52' : '0.12'});
    }
  </style></head><body>
    ${badge}
    <div class="wrap">
      <div class="who">${esc(msgObj.who)}</div>
      <div class="b">${esc(msgObj.msg)}</div>
    </div>
  </body></html>`;
}

function buildSwitchCardHtml(step, dir, interB64, monoB64) {
  return `<!doctype html><html><head><meta charset="utf-8"><style>${fontsCss(interB64, monoB64)}
    html, body { width: 860px; height: 184px; background: transparent; display: flex; align-items: center; justify-content: center; padding: 12px; }
    .row {
      width: 100%; padding: 28px 34px; border-radius: 28px;
      background: ${dir.surfaceBg}; border: 1.5px solid ${dir.proofColor}55;
      box-shadow: 0 22px 48px -16px rgba(0,0,0,${dir.isDark ? '0.55' : '0.12'});
      display: flex; align-items: center; justify-content: space-between; gap: 22px;
    }
    .left { display: flex; align-items: center; gap: 22px; }
    .num { font-family: 'IBM Plex Mono', monospace; font-size: 20px; font-weight: 800; color: ${dir.proofColor}; background: ${dir.proofSoft}; padding: 10px 16px; border-radius: 14px; }
    .txt { font-size: 33px; font-weight: 800; letter-spacing: -0.03em; color: ${dir.ink}; }
    .toggle {
      width: 88px; height: 50px; border-radius: 999px; background: #10B981;
      padding: 5px; display: flex; align-items: center; justify-content: flex-end; flex-shrink: 0;
      box-shadow: inset 0 2px 6px rgba(0,0,0,0.18), 0 0 20px rgba(16,185,129,0.45);
    }
    .knob { width: 40px; height: 40px; border-radius: 50%; background: #FFFFFF; box-shadow: 0 3px 8px rgba(0,0,0,0.28); }
  </style></head><body>
    <div class="row">
      <div class="left"><span class="num">${step.num}</span><span class="txt">${esc(step.title)}</span></div>
      <div class="toggle"><div class="knob"></div></div>
    </div>
  </body></html>`;
}

function buildBaseScenesHtml(script, dir, interB64, monoB64) {
  const logoUri = dir.isDark
    ? loadTransparentLogoDataUri('#F8FAFC', '#141924')
    : loadTransparentLogoDataUri('#141413', '#FFFDF9');

  const n0 = script.notifs[0];

  // BASE 0: Top Viral Hook + 3D Titanium iPhone Lockscreen with Notification #1 ALREADY LIVE at Frame 0!
  const base0 = `<!doctype html><html><head><meta charset="utf-8"><style>${fontsCss(interB64, monoB64)}
    html, body { width: 960px; height: 1580px; background: transparent; display: flex; flex-direction: column; align-items: center; justify-content: flex-start; padding: 20px 30px; }
    .top-hook { width: 100%; text-align: center; margin-bottom: 34px; }
    .ey { display: inline-flex; align-items: center; gap: 10px; font-family: 'IBM Plex Mono', monospace; font-size: 19px; font-weight: 800; letter-spacing: 0.14em; color: ${dir.accent}; margin-bottom: 14px; }
    .h { font-size: 62px; font-weight: 900; line-height: 1.04; letter-spacing: -0.045em; color: ${dir.ink}; }
    .ha { color: ${dir.accent}; }
    .iphone {
      width: 790px; height: 1120px; border-radius: 82px; padding: 20px;
      background: linear-gradient(145deg, #4B5262 0%, #171A21 50%, #303645 100%);
      box-shadow: 0 44px 92px -20px rgba(0,0,0,${dir.isDark ? '0.78' : '0.32'}), inset 0 2px 3px rgba(255,255,255,0.45);
    }
    .screen {
      width: 100%; height: 100%; border-radius: 66px;
      background: radial-gradient(ellipse 90% 60% at 50% 10%, #1B243B 0%, #0B0F1A 60%, #05070D 100%);
      padding: 30px 30px; color: #FFFFFF; border: 1px solid rgba(255,255,255,0.14);
      display: flex; flex-direction: column; align-items: center;
    }
    .island { width: 180px; height: 34px; border-radius: 999px; background: #000; border: 1px solid rgba(255,255,255,0.12); margin-bottom: 24px; }
    .clock { font-size: 96px; font-weight: 800; letter-spacing: -0.04em; line-height: 0.96; color: #FFFFFF; }
    .date { font-size: 22px; font-weight: 600; color: rgba(255,255,255,0.72); margin-top: 8px; margin-bottom: 34px; }
    .n1 {
      width: 100%; border-radius: 28px; padding: 24px 28px;
      background: rgba(26, 32, 46, 0.94); border: 1.5px solid rgba(255,255,255,0.18);
      box-shadow: 0 20px 44px -12px rgba(0,0,0,0.55);
    }
    .nh { display: flex; justify-content: space-between; font-family: 'IBM Plex Mono', monospace; font-size: 16px; font-weight: 800; letter-spacing: 0.08em; color: #93C5FD; margin-bottom: 8px; }
    .nt { font-size: 27px; font-weight: 820; letter-spacing: -0.03em; color: #FFFFFF; }
    .nb { margin-top: 6px; font-size: 20px; color: rgba(255,255,255,0.85); }
  </style></head><body>
    <div class="top-hook">
      <div class="ey">● REAL CLIENT STORY</div>
      <div class="h">${esc(script.hookLines[0])} ${esc(script.hookLines[1])} <span class="ha">${esc(script.hookLines[2])}</span></div>
    </div>
    <div class="iphone"><div class="screen">
      <div class="island"></div>
      <div class="clock">${esc(script.timeStr.replace(/\s*(AM|PM)/i, ''))}</div>
      <div class="date">Tuesday · Live Production Alert</div>
      <div class="n1">
        <div class="nh"><span>● ${esc(n0.app)}</span><span>${esc(n0.time)}</span></div>
        <div class="nt">${esc(n0.title)}</div>
        <div class="nb">${esc(n0.body)}</div>
      </div>
    </div></div>
  </body></html>`;

  // BASE 1: Live Workplace Group-Chat Window Frame (#emergency-chat)
  const base1 = `<!doctype html><html><head><meta charset="utf-8"><style>${fontsCss(interB64, monoB64)}
    html, body { width: 960px; height: 1380px; background: transparent; padding: 30px; display: flex; }
    .win {
      flex: 1; border-radius: 38px; overflow: hidden;
      background: ${dir.surfaceBg}; border: 1.5px solid ${dir.surfaceBorder};
      box-shadow: 0 38px 86px -22px rgba(0,0,0,${dir.isDark ? '0.68' : '0.14'});
      display: flex; flex-direction: column;
    }
    .bar {
      padding: 26px 34px; border-bottom: 1px solid ${dir.surfaceBorder};
      display: flex; align-items: center; justify-content: space-between;
      background: ${dir.isDark ? 'rgba(255,255,255,0.04)' : 'rgba(15,23,42,0.03)'};
    }
    .dots { display: flex; gap: 11px; }
    .d { width: 15px; height: 15px; border-radius: 50%; }
    .chan { font-family: 'IBM Plex Mono', monospace; font-size: 20px; font-weight: 800; color: ${dir.ink}; }
    .sev { padding: 8px 18px; border-radius: 999px; background: ${dir.alertSoft}; color: ${dir.alert}; font-family: 'IBM Plex Mono', monospace; font-size: 15px; font-weight: 800; letter-spacing: 0.08em; }
  </style></head><body>
    <div class="win">
      <div class="bar">
        <div class="dots"><span class="d" style="background:#FF5F57;"></span><span class="d" style="background:#FEBC2E;"></span><span class="d" style="background:#28C840;"></span></div>
        <div class="chan">#emergency-chat · ${esc(script.timeStr)}</div>
        <div class="sev">LIVE DRAMA</div>
      </div>
    </div>
  </body></html>`;

  // BASE 2: Interactive Fix Switches Header Backdrop
  const base2 = `<!doctype html><html><head><meta charset="utf-8"><style>${fontsCss(interB64, monoB64)}
    html, body { width: 960px; height: 1380px; background: transparent; padding: 50px 44px; display: flex; flex-direction: column; }
    .ey { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; font-family: 'IBM Plex Mono', monospace; font-size: 19px; font-weight: 800; color: ${dir.inkMuted}; letter-spacing: 0.14em; }
    .badge { padding: 10px 20px; border-radius: 999px; background: ${dir.proofSoft}; color: ${dir.proofColor}; font-size: 17px; }
    .title { font-size: 68px; font-weight: 900; line-height: 1.04; letter-spacing: -0.045em; color: ${dir.ink}; }
    .sub { margin-top: 16px; font-size: 28px; font-weight: 550; color: ${dir.inkMuted}; }
  </style></head><body>
    <div class="ey"><span class="badge">✓ THE OLVEN FIX</span><span>03 / 05</span></div>
    <div class="title">Fixed in days.<br/>3 simple switches.</div>
    <div class="sub">Zero 6-month agency rewrites. Shipped live inside their stack.</div>
  </body></html>`;

  // BASE 3: Giant Dopamine Payoff Panel (Struck-through Disaster -> Huge Emerald Result!)
  const base3 = `<!doctype html><html><head><meta charset="utf-8"><style>${fontsCss(interB64, monoB64)}
    html, body { width: 960px; height: 920px; background: transparent; padding: 36px; display: flex; align-items: center; }
    .panel {
      width: 100%; border-radius: 40px; padding: 56px 54px;
      background: ${dir.surfaceBg}; border: 1.5px solid ${dir.surfaceBorder};
      box-shadow: 0 38px 86px -22px rgba(0,0,0,${dir.isDark ? '0.70' : '0.12'});
    }
    .ey { display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; font-family: 'IBM Plex Mono', monospace; font-size: 18px; font-weight: 800; color: ${dir.inkMuted}; letter-spacing: 0.14em; }
    .badge { padding: 10px 20px; border-radius: 999px; background: ${dir.proofSoft}; color: ${dir.proofColor}; }
    .strike {
      display: inline-block; padding: 12px 22px; border-radius: 16px; margin-bottom: 16px;
      background: ${dir.alertSoft}; color: ${dir.alert};
      font-family: 'IBM Plex Mono', monospace; font-size: 22px; font-weight: 800;
      text-decoration: line-through; text-decoration-thickness: 3px;
    }
    .hn { font-size: ${script.heroFontPx}px; font-weight: 900; line-height: 0.92; letter-spacing: -0.06em; color: ${dir.proofColor}; font-variant-numeric: tabular-nums; }
    .hl { margin-top: 22px; font-size: 48px; font-weight: 850; letter-spacing: -0.04em; color: ${dir.ink}; }
    .hs { margin-top: 10px; font-size: 27px; color: ${dir.inkMuted}; }
  </style></head><body>
    <div class="panel">
      <div class="ey"><span class="badge">✓ PROBLEM SOLVED</span><span>04 / 05</span></div>
      <div class="strike">BEFORE: ${esc(script.beforeStat)}</div>
      <div class="hn">${esc(script.heroVal)}</div>
      <div class="hl">${esc(script.heroLabel)}.</div>
      <div class="hs">${esc(script.heroSub)}</div>
    </div>
  </body></html>`;

  // BASE 4: Punchy, Shareable Brand Drop
  const base4 = `<!doctype html><html><head><meta charset="utf-8"><style>${fontsCss(interB64, monoB64)}
    html, body { width: 960px; height: 1120px; background: transparent; padding: 40px 44px; display: flex; flex-direction: column; justify-content: center; }
    .ey { display: flex; justify-content: space-between; margin-bottom: 30px; font-family: 'IBM Plex Mono', monospace; font-size: 19px; font-weight: 800; color: ${dir.inkMuted}; letter-spacing: 0.14em; }
    .cl { font-size: 78px; font-weight: 900; line-height: 1.04; letter-spacing: -0.048em; color: ${dir.ink}; }
    .ca { color: ${dir.accent}; }
    .sub { margin-top: 24px; font-size: 30px; font-weight: 600; color: ${dir.inkMuted}; line-height: 1.35; }
    .brand {
      margin-top: 48px; padding: 34px 40px; border-radius: 30px;
      background: ${dir.surfaceBg}; border: 1.5px solid ${dir.surfaceBorder};
      box-shadow: 0 28px 68px -20px rgba(0,0,0,${dir.isDark ? '0.62' : '0.11'});
      display: flex; align-items: center; justify-content: space-between;
    }
    .logo { height: 48px; width: auto; display: block; }
    .city { font-family: 'IBM Plex Mono', monospace; font-size: 18px; font-weight: 800; letter-spacing: 0.14em; color: ${dir.inkMuted}; }
  </style></head><body>
    <div class="ey"><span>OLVEN TECH · NEW YORK</span><span>05 / 05</span></div>
    <div class="cl">Don't be the next</div>
    <div class="cl">9 AM Slack meltdown.</div>
    <div class="cl ca">We fix it in days.</div>
    <div class="sub">Follow for wild real tech stories that save real money.</div>
    <div class="brand">
      ${logoUri ? `<img class="logo" src="${logoUri}" alt="Olven Tech" />` : `<div style="font-size:38px;font-weight:800;">Olven Tech</div>`}
      <span class="city">OLVENTECH.COM</span>
    </div>
  </body></html>`;

  return [base0, base1, base2, base3, base4];
}

function buildCfoReplyHtml(script, dir, interB64, monoB64) {
  return `<!doctype html><html><head><meta charset="utf-8"><style>${fontsCss(interB64, monoB64)}
    html, body { width: 880px; height: 260px; background: transparent; display: flex; align-items: center; justify-content: center; padding: 14px; }
    .card {
      width: 100%; padding: 26px 32px; border-radius: 28px;
      background: ${dir.isDark ? 'rgba(16, 185, 129, 0.18)' : '#ECFDF5'};
      border: 1.5px solid ${dir.proofColor}66;
      box-shadow: 0 22px 48px -14px rgba(0,0,0,${dir.isDark ? '0.55' : '0.12'});
    }
    .who { font-family: 'IBM Plex Mono', monospace; font-size: 16px; font-weight: 800; letter-spacing: 0.08em; color: ${dir.proofColor}; margin-bottom: 8px; }
    .msg { font-size: 27px; font-weight: 740; line-height: 1.32; color: ${dir.ink}; }
  </style></head><body>
    <div class="card">
      <div class="who">💬 CLIENT REPLY · VERIFIED RESULT</div>
      <div class="msg">"${esc(script.cfoReact)}"</div>
    </div>
  </body></html>`;
}

function buildCtaPillHtml(dir, interB64, monoB64) {
  const bg = dir.isDark ? '#FFFFFF' : '#141413';
  const ink = dir.isDark ? '#0A0B0E' : '#FAF8F5';
  return `<!doctype html><html><head><meta charset="utf-8"><style>${fontsCss(interB64, monoB64)}
    html, body { width: 900px; height: 160px; background: transparent; display: flex; align-items: center; justify-content: center; padding: 12px; }
    .pill {
      padding: 24px 44px; border-radius: 999px; background: ${bg}; color: ${ink};
      font-family: 'IBM Plex Mono', monospace; font-size: 22px; font-weight: 800; letter-spacing: 0.04em;
      box-shadow: 0 20px 44px -12px rgba(0,0,0,0.45);
    }
  </style></head><body><div class="pill">Save &amp; Share  ·  contact@olventech.com</div></body></html>`;
}

async function renderAllAssets(script, dir, workDir) {
  const interB64 = fontBase64('Inter.woff2');
  const monoB64 = fontBase64('IBMPlexMono.woff2');
  const baseHtmls = buildBaseScenesHtml(script, dir, interB64, monoB64);

  const execPath = detectChromeExecutable();
  const browser = await chromium.launch({
    headless: true,
    ...(execPath ? { executablePath: execPath } : {}),
    args: ['--no-sandbox', '--disable-dev-shm-usage'],
  });

  const out = { depths: [], bases: [], overlays: {} };
  async function snap(html, w, h, dpr, filename) {
    const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: dpr });
    const page = await ctx.newPage();
    await page.setContent(html, { waitUntil: 'load' });
    await page.evaluate(() => document.fonts.ready);
    const fp = path.join(workDir, filename);
    await page.screenshot({ path: fp, type: 'png', omitBackground: true });
    await ctx.close();
    return fp;
  }

  try {
    for (let i = 0; i < 5; i++) {
      out.depths.push(await snap(buildDepthHtml(i, dir, interB64, monoB64), 1080, 1920, 1, `depth_${i}.png`));
    }
    const baseDims = [[960, 1580], [960, 1380], [960, 1380], [960, 920], [960, 1120]];
    for (let i = 0; i < 5; i++) {
      out.bases.push(await snap(baseHtmls[i], baseDims[i][0], baseDims[i][1], 2, `base_${i}.png`));
    }
    // Staggered interactive entertainment overlays!
    out.overlays.notif2 = await snap(buildNotificationCardHtml(script.notifs[1], 1, interB64, monoB64), 720, 204, 2, 'notif2.png');
    out.overlays.notif3 = await snap(buildNotificationCardHtml(script.notifs[2], 2, interB64, monoB64), 720, 204, 2, 'notif3.png');
    out.overlays.chat1 = await snap(buildChatBubbleHtml(script.chat[0], dir, interB64, monoB64), 840, 250, 2, 'chat1.png');
    out.overlays.chat2 = await snap(buildChatBubbleHtml(script.chat[1], dir, interB64, monoB64), 840, 250, 2, 'chat2.png');
    out.overlays.chat3 = await snap(buildChatBubbleHtml(script.chat[2], dir, interB64, monoB64), 840, 320, 2, 'chat3.png');
    out.overlays.fix1 = await snap(buildSwitchCardHtml(script.fixSteps[0], dir, interB64, monoB64), 860, 184, 2, 'fix1.png');
    out.overlays.fix2 = await snap(buildSwitchCardHtml(script.fixSteps[1], dir, interB64, monoB64), 860, 184, 2, 'fix2.png');
    out.overlays.fix3 = await snap(buildSwitchCardHtml(script.fixSteps[2], dir, interB64, monoB64), 860, 184, 2, 'fix3.png');
    out.overlays.cfoReact = await snap(buildCfoReplyHtml(script, dir, interB64, monoB64), 880, 260, 2, 'cfo_react.png');
    out.overlays.ctaPill = await snap(buildCtaPillHtml(dir, interB64, monoB64), 900, 160, 2, 'cta_pill.png');
  } finally {
    await browser.close();
  }
  return out;
}

function addAnimatedProp(cmds, layer, propPath, keyframes, inInf = 86, outInf = 28) {
  for (const [time, value] of keyframes) {
    cmds.push({ command: 'prop.addKey', params: { layer, path: propPath, time, timeBase: 'comp', value } });
  }
  cmds.push({
    command: 'keys.select',
    params: { keys: keyframes.map(([time]) => ({ layer, prop: propPath, time, timeBase: 'comp' })), add: false },
  });
  cmds.push({ command: 'keys.easyEase', params: { which: 'both' } });
  cmds.push({ command: 'keys.velocity', params: { inInfluence: inInf, outInfluence: outInf } });
}

function addPopInOverlay(cmds, name, filePath, tIn, tHoldEnd, tOutEnd, x, y, z, scalePct = 50) {
  cmds.push({ command: 'file.import', params: { paths: [filePath], addToComp: true } });
  cmds.push({ command: 'layer.rename', params: { layer: '#1', name } });
  cmds.push({ command: 'layer.setSwitch', params: { layers: [name], switch: 'threeD', value: true } });
  cmds.push({ command: 'layer.timing', params: { layers: [name], in: tIn - 0.04, out: tOutEnd + 0.06 } });

  const isLast = tOutEnd >= 16.0;
  const posKeys = isLast
    ? [[tIn, [x, y + 46, z + 30]], [tIn + 0.42, [x, y, z]], [16.0, [x, y - 6, z - 12]]]
    : [[tIn, [x, y + 46, z + 30]], [tIn + 0.42, [x, y, z]], [tHoldEnd, [x, y - 5, z - 10]], [tOutEnd, [x, y - 34, z - 24]]];
  const scaleKeys = isLast
    ? [[tIn, [scalePct * 0.94, scalePct * 0.94, scalePct * 0.94]], [tIn + 0.40, [scalePct, scalePct, scalePct]], [16.0, [scalePct * 1.02, scalePct * 1.02, scalePct * 1.02]]]
    : [[tIn, [scalePct * 0.94, scalePct * 0.94, scalePct * 0.94]], [tIn + 0.40, [scalePct, scalePct, scalePct]], [tOutEnd, [scalePct * 1.01, scalePct * 1.01, scalePct * 1.01]]];
  const opKeys = isLast
    ? [[tIn, 0], [tIn + 0.30, 100], [16.0, 100]]
    : [[tIn, 0], [tIn + 0.30, 100], [tHoldEnd, 100], [tOutEnd, 0]];

  addAnimatedProp(cmds, name, 'transform/position', posKeys, 88, 24);
  addAnimatedProp(cmds, name, 'transform/scale', scaleKeys, 84, 30);
  addAnimatedProp(cmds, name, 'transform/opacity', opKeys, 70, 45);
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

async function renderWalkthroughVideo(specPath, outDir, directorOverride = null) {
  const spec = JSON.parse(fs.readFileSync(specPath, 'utf8'));
  const dir = pickDirector(spec, directorOverride);

  fs.mkdirSync(outDir, { recursive: true });
  const workDir = path.join(outDir, '_ec_work');
  fs.mkdirSync(workDir, { recursive: true });

  const trackPath = path.join(MUSIC_DIR, dir.track);
  if (!fs.existsSync(trackPath)) throw new Error(`Missing music track: ${trackPath}`);

  const t0 = Date.now();
  const script = compileEntertainmentScript(spec);
  const assets = await renderAllAssets(script, dir, workDir);

  const acts = [
    { idx: 0, start: 0.00, settle: 0.00, holdEnd: 3.18, exitEnd: 3.65, y: 970 },
    { idx: 1, start: 3.35, settle: 3.92, holdEnd: 7.05, exitEnd: 7.50, y: 975 },
    { idx: 2, start: 7.20, settle: 7.75, holdEnd: 10.30, exitEnd: 10.75, y: 980 },
    { idx: 3, start: 10.45, settle: 11.00, holdEnd: 13.30, exitEnd: 13.75, y: 815 },
    { idx: 4, start: 13.45, settle: 14.05, holdEnd: 16.00, exitEnd: 16.00, y: 870 },
  ];

  const compBg = dir.isDark ? '#07090D' : '#F6F3EC';
  const cmds = [
    {
      command: 'comp.new',
      params: {
        name: 'Main', width: WIDTH, height: HEIGHT, frameRate: FPS, duration: DURATION,
        background: compBg, shutterAngle: 120, shutterPhase: 0, motionBlurSamples: 3, renderer: 'classic3D', open: true,
      },
    },
  ];

  // Smoothly cross-dissolved Atmospheric Domes
  for (const a of acts) {
    const bgName = `Dome_${a.idx}`;
    const [startColor, endColor] = dir.domes[a.idx];
    cmds.push({ command: 'layer.newSolid', params: { name: bgName, color: compBg, width: WIDTH, height: HEIGHT } });
    cmds.push({ command: 'layer.timing', params: { layers: [bgName], in: a.idx === 0 ? -0.5 : a.start - 0.05, out: a.idx === 4 ? 16.5 : a.exitEnd + 0.05 } });
    cmds.push({ command: 'effect.apply', params: { effect: 'ec.generate.gradientramp', layers: [bgName] } });
    cmds.push({ command: 'prop.set', params: { layer: bgName, path: 'effects/#1/shape', value: 1 } });
    cmds.push({ command: 'prop.set', params: { layer: bgName, path: 'effects/#1/start', value: [0.5, 0.25] } });
    cmds.push({ command: 'prop.set', params: { layer: bgName, path: 'effects/#1/end', value: [0.5, 1.15] } });
    cmds.push({ command: 'prop.set', params: { layer: bgName, path: 'effects/#1/startColor', value: startColor } });
    cmds.push({ command: 'prop.set', params: { layer: bgName, path: 'effects/#1/endColor', value: endColor } });
    cmds.push({ command: 'prop.set', params: { layer: bgName, path: 'effects/#1/scatter', value: 28.0 } });
    if (a.idx > 0) {
      addAnimatedProp(cmds, bgName, 'transform/opacity', [[a.start, 0], [a.start + 0.45, 100]], 65, 65);
    }
  }

  // Calm continuous architectural camera float
  cmds.push({ command: 'layer.newCamera', params: { name: 'HeroCam', preset: '35mm', position: [540, 960, -1088], poi: [540, 960, 0] } });
  cmds.push({ command: 'layer.timing', params: { layers: ['HeroCam'], in: -0.5, out: 16.5 } });
  addAnimatedProp(cmds, 'HeroCam', 'transform/position', [
    [0.0, [540, 962, -1088]], [5.5, [546, 958, -1068]], [11.0, [535, 962, -1048]], [16.0, [540, 960, -1032]],
  ], 65, 65);

  // Depth + Base Stage Layers
  for (const a of acts) {
    const isFirst = a.idx === 0;
    const isLast = a.idx === 4;
    const inT = isFirst ? -0.5 : a.start - 0.04;
    const outT = isLast ? 16.5 : a.exitEnd + 0.06;

    const dName = `Depth_${a.idx}`;
    cmds.push({ command: 'file.import', params: { paths: [assets.depths[a.idx]], addToComp: true } });
    cmds.push({ command: 'layer.rename', params: { layer: '#1', name: dName } });
    cmds.push({ command: 'layer.setSwitch', params: { layers: [dName], switch: 'threeD', value: true } });
    cmds.push({ command: 'layer.timing', params: { layers: [dName], in: inT, out: outT } });
    cmds.push({ command: 'prop.set', params: { layer: dName, path: 'transform/scale', value: [130, 130, 130] } });
    cmds.push({ command: 'prop.set', params: { layer: dName, path: 'transform/position', value: [540, 960, 320] } });
    const dOp = isFirst
      ? [[0.0, 100], [a.holdEnd, 100], [a.exitEnd, 0]]
      : isLast
      ? [[a.start, 0], [a.start + 0.42, 100], [16.0, 100]]
      : [[a.start, 0], [a.start + 0.42, 100], [a.holdEnd, 100], [a.exitEnd, 0]];
    addAnimatedProp(cmds, dName, 'transform/opacity', dOp, 65, 65);

    const bName = `Base_${a.idx}`;
    cmds.push({ command: 'file.import', params: { paths: [assets.bases[a.idx]], addToComp: true } });
    cmds.push({ command: 'layer.rename', params: { layer: '#1', name: bName } });
    cmds.push({ command: 'layer.setSwitch', params: { layers: [bName], switch: 'threeD', value: true } });
    cmds.push({ command: 'layer.timing', params: { layers: [bName], in: inT, out: outT } });

    const bPos = isFirst
      ? [[0.0, [540, a.y, 0]], [a.holdEnd, [540, a.y - 6, -16]], [a.exitEnd, [540, a.y - 38, -40]]]
      : isLast
      ? [[a.start, [540, a.y + 56, 48]], [a.settle, [540, a.y, 0]], [16.0, [540, a.y - 6, -18]]]
      : [[a.start, [540, a.y + 56, 48]], [a.settle, [540, a.y, 0]], [a.holdEnd, [540, a.y - 6, -16]], [a.exitEnd, [540, a.y - 38, -40]]];
    const bScale = isFirst
      ? [[0.0, [50, 50, 50]], [a.exitEnd, [51.6, 51.6, 51.6]]]
      : isLast
      ? [[a.start, [48.8, 48.8, 48.8]], [a.settle, [50, 50, 50]], [16.0, [51.8, 51.8, 51.8]]]
      : [[a.start, [48.8, 48.8, 48.8]], [a.settle, [50, 50, 50]], [a.exitEnd, [51.4, 51.4, 51.4]]];
    const bOp = isFirst
      ? [[0.0, 100], [a.holdEnd, 100], [a.exitEnd, 0]]
      : isLast
      ? [[a.start, 0], [a.start + 0.42, 100], [16.0, 100]]
      : [[a.start, 0], [a.start + 0.42, 100], [a.holdEnd, 100], [a.exitEnd, 0]];

    addAnimatedProp(cmds, bName, 'transform/position', bPos, 86, 26);
    addAnimatedProp(cmds, bName, 'transform/scale', bScale, 72, 40);
    addAnimatedProp(cmds, bName, 'transform/opacity', bOp, 68, 45);
  }

  // 10 MULTI-BEAT POP-IN ENTERTAINMENT OVERLAYS (Synced to the exact millisecond with mix_reel_sfx.py!)
  // Act 1: Notification #2 & #3 pop onto the iPhone lockscreen cleanly beneath Notification #1
  addPopInOverlay(cmds, 'Notif_2', assets.overlays.notif2, 0.95, 3.18, 3.65, 540, 1105, -35, 50);
  addPopInOverlay(cmds, 'Notif_3', assets.overlays.notif3, 2.05, 3.18, 3.65, 540, 1315, -50, 50);

  // Act 2: Live #emergency-chat messages pop in 1-by-1
  addPopInOverlay(cmds, 'Chat_1', assets.overlays.chat1, 3.80, 7.05, 7.50, 540, 660, -35, 50);
  addPopInOverlay(cmds, 'Chat_2', assets.overlays.chat2, 4.95, 7.05, 7.50, 540, 935, -45, 50);
  addPopInOverlay(cmds, 'Chat_3', assets.overlays.chat3, 6.08, 7.05, 7.50, 540, 1265, -60, 50);

  // Act 3: 3 Interactive Glowing Fix Switches flip ON 1-by-1
  addPopInOverlay(cmds, 'Fix_1', assets.overlays.fix1, 7.65, 10.30, 10.75, 540, 860, -35, 50);
  addPopInOverlay(cmds, 'Fix_2', assets.overlays.fix2, 8.55, 10.30, 10.75, 540, 1075, -45, 50);
  addPopInOverlay(cmds, 'Fix_3', assets.overlays.fix3, 9.45, 10.30, 10.75, 540, 1290, -55, 50);

  // Act 4: Happy CFO Reply pops in under the giant Payoff
  addPopInOverlay(cmds, 'Cfo_React', assets.overlays.cfoReact, 11.75, 13.30, 13.75, 540, 1390, -60, 50);

  // Act 5: Save & Share CTA Pill
  addPopInOverlay(cmds, 'Cta_Pill', assets.overlays.ctaPill, 13.85, 16.00, 16.00, 540, 1480, -60, 50);

  // Subtle Cinema Finish Adjustment Layer
  cmds.push({ command: 'layer.newAdjustment', params: { name: 'CinemaGrade' } });
  cmds.push({ command: 'effect.apply', params: { effect: 'ec.stylize.ccvignette', layers: ['CinemaGrade'] } });
  cmds.push({ command: 'prop.set', params: { layer: 'CinemaGrade', path: 'effects/#1/amount', value: dir.isDark ? 10.0 : 5.0 } });

  const cmdsPath = path.join(workDir, 'build_comp.json');
  const projPath = path.join(workDir, 'olven_reel.ecproj');
  const rawMp4 = path.join(workDir, 'video_silent.mp4');
  const mixedAudio = path.join(workDir, 'mixed_audio.m4a');
  const outMp4 = path.join(outDir, 'walkthrough-video.mp4');
  fs.writeFileSync(cmdsPath, JSON.stringify(cmds, null, 2));

  // Synthesize millisecond-synced UI SFX + upbeat 116-BPM pulse over studio music bed!
  const mixerPy = path.join(__dirname, 'mix_reel_sfx.py');
  let finalAudioPath = trackPath;
  if (fs.existsSync(mixerPy)) {
    execFileSync('python3', [mixerPy, trackPath, mixedAudio], { stdio: 'inherit' });
    finalAudioPath = mixedAudio;
  }

  const ecCli = detectEffectCraftCli();
  execFileSync(ecCli, ['--empty', 'run', '--commands', cmdsPath, '--save-as', projPath], { stdio: 'pipe' });
  execFileSync(ecCli, [
    '--project', projPath, 'render', '--comp', 'Main', '--out', rawMp4,
    '--format', 'h264', '--fps', String(FPS), '--bitrate', '9000', '--quality', 'best', '--audio', 'off',
  ], { stdio: 'inherit' });

  // Mux Rec.709 H.264 + Synced Entertainment Audio
  execFileSync('ffmpeg', [
    '-y', '-v', 'error',
    '-i', rawMp4, '-i', finalAudioPath,
    '-map', '0:v:0', '-map', '1:a:0',
    '-c:v', 'copy',
    '-bsf:v', 'h264_metadata=colour_primaries=1:transfer_characteristics=1:matrix_coefficients=1',
    '-c:a', 'aac', '-b:a', '192k', '-ar', '48000',
    '-movflags', '+faststart', '-t', String(DURATION),
    outMp4,
  ], { stdio: 'inherit' });

  // Hard CDN Safety Guard: strictly <= 19.4 MB (jsDelivr 20 MB limit)
  const MAX_BYTES = Math.floor(19.4 * 1024 * 1024);
  if (fs.statSync(outMp4).size > MAX_BYTES) {
    const cappedMp4 = path.join(workDir, 'video_capped.mp4');
    execFileSync('ffmpeg', [
      '-y', '-v', 'error', '-i', outMp4,
      '-c:v', 'libx264', '-preset', 'slow', '-profile:v', 'high', '-level', '4.1',
      '-pix_fmt', 'yuv420p', '-b:v', '8600k', '-maxrate', '9200k', '-bufsize', '18000k',
      '-color_primaries', 'bt709', '-color_trc', 'bt709', '-colorspace', 'bt709',
      '-c:a', 'copy', '-movflags', '+faststart', cappedMp4,
    ], { stdio: 'inherit' });
    fs.renameSync(cappedMp4, outMp4);
  }

  fs.rmSync(workDir, { recursive: true, force: true });
  const elapsed = ((Date.now() - t0) / 1000).toFixed(1);
  const mb = (fs.statSync(outMp4).size / (1024 * 1024)).toFixed(2);
  console.log(`[OK] Rendered Entertainment Viral 3D Video [${dir.name} | 13 synced UI beats + SFX, Rec.709 in ${elapsed}s, ${mb} MB] -> ${outMp4}`);
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
