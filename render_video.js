#!/usr/bin/env node
/**
 * Olven Tech 5.1 — 5-World Transatlantic Executive "Flow Style 1" 30fps Cinema Reel Engine
 * (16.0s, 480 real animated frames @ 30fps, 1080x1920, H.264 High Rec.709 + 192k AAC)
 *
 * CRITICAL INSTAGRAM GRID FIX (v5.1):
 *   - Frame 0 (t = 0.00s) ALWAYS renders the giant bold European headline at 100% opacity
 *     so Instagram's auto-selected Reel cover thumbnail is ALWAYS a sharp, unmistakable poster!
 *   - All 5 Reel worlds start in RADICALLY DIFFERENT signature palettes (zero twin white covers!):
 *       1. flow_bottleneck_zurich   — Warm Zurich Linen (#F4F1EA) -> Obsidian Emerald
 *       2. flow_wire_ledger_geneva  — Deep Mayfair Racing Green (#082118) + 24K Gold -> Obsidian Gold
 *       3. flow_monolith_milan      — Pitch Aerospace Obsidian (#050608) + Titanium -> Emerald/Gold
 *       4. flow_optics_milan        — Deep Venetian Oxblood (#26070D) + Platinum Laser -> Emerald
 *       5. flow_chronograph_geneva  — Cool Nordic Silver-Slate (#E9EEF4) + Chronograph -> Midnight Emerald Sweep
 */
const fs = require('fs');
const path = require('path');
const { spawn, execFileSync } = require('child_process');

let chromium;
try { ({ chromium } = require('playwright')); } catch {
  const localCore = path.join(__dirname, 'node_modules/playwright-core');
  ({ chromium } = require(fs.existsSync(localCore) ? localCore : '/home/antigravity/.npm/_npx/e41f203b7505f1fb/node_modules/playwright-core'));
}

const WIDTH = 1080;
const HEIGHT = 1920;
const FPS = 30;
const DURATION = 16.0;
const TOTAL_FRAMES = Math.round(FPS * DURATION); // 480 real animated frames
const ASSETS_DIR = path.join(__dirname, 'assets');

const b64File = (fp) => fs.readFileSync(fp).toString('base64');
const RAW_LOGO_SVG = fs.readFileSync(path.join(ASSETS_DIR, 'horizontal_dark.svg'), 'utf8')
  .replace(/<\?xml[\s\S]*?\?>/g, '')
  .replace(/<path[^>]*id="path1-3"[^>]*\/>/g, '');

function logoDataUri(inkHex = '#FFFFFF', cutoutHex = '#070B14') {
  const svg = RAW_LOGO_SVG
    .replace(/style="fill:#000000;/g, `style="fill:${cutoutHex};`)
    .replace(/style="fill:#ffffff;/g, `style="fill:${inkHex};`)
    .replace(/fill="#ffffff"/g, `fill="${inkHex}"`);
  return 'data:image/svg+xml;base64,' + Buffer.from(svg, 'utf8').toString('base64');
}

function detectChrome() {
  for (const p of ['/usr/bin/google-chrome', '/usr/bin/chromium', '/usr/bin/chromium-browser']) {
    if (fs.existsSync(p)) return p;
  }
  return undefined;
}

const MODE_ALIAS = {
  physics_bottleneck: 'flow_bottleneck_zurich',
  domino_chain_reaction: 'flow_wire_ledger_geneva',
  alarm_storm_signal: 'flow_chronograph_geneva',
  laser_cash_shredder: 'flow_optics_milan',
  retry_storm_wave: 'flow_monolith_milan',
};

const AUDIO_MODE_MAP = {
  flow_bottleneck_zurich: 'physics_bottleneck',
  flow_wire_ledger_geneva: 'domino_chain_reaction',
  flow_monolith_milan: 'retry_storm_wave',
  flow_optics_milan: 'laser_cash_shredder',
  flow_chronograph_geneva: 'alarm_storm_signal',
};

function resolveReelConfig(spec) {
  const rc = spec.physics_reel || {};
  const rawMode = rc.mode || spec.reel_mode || 'flow_bottleneck_zurich';
  const mode = AUDIO_MODE_MAP[rawMode] ? rawMode : (MODE_ALIAS[rawMode] || 'flow_bottleneck_zurich');
  const m0 = (spec.metrics && spec.metrics[0]) || { value: '9.4x', label: 'FASTER' };
  const m1 = (spec.metrics && spec.metrics[1]) || { value: '26 MINS', label: 'DELAY' };
  const defaultStuck = {
    flow_bottleneck_zurich: '4.2 HRS STALLED',
    flow_wire_ledger_geneva: '2.0 SEC LAG · RETRY FIRED',
    flow_monolith_milan: '400 ORDERS FROZEN',
    flow_optics_milan: 'TOKENS BURNING',
    flow_chronograph_geneva: 'ALERT FATIGUE',
  }[mode] || 'SYSTEM STALLED';
  return {
    mode,
    setupLine1: rc.setupLine1 || '32 workers added',
    setupLine2: rc.setupLine2 || 'to move faster.',
    doorLabel:  rc.doorLabel  || '1 TINY LOCK',
    stuckStat:  rc.stuckStat  || defaultStuck,
    twistPunch: rc.twistPunch || '9x Slower.',
    fixLine1:   rc.fixLine1   || '$0 New Servers.',
    fixLine2:   rc.fixLine2   || '8 Express Lanes.',
    payoffBig:  rc.payoffBig  || `${m0.value}`.toUpperCase() + ' FASTER.',
    payoffSub:  rc.payoffSub  || `${m1.value}`.toUpperCase() + ' · ZERO HARDWARE.',
    wireVal:    rc.wireVal    || '$32K',
    doubleStat: rc.doubleStat || '$64,000 SETTLED (2X)',
    safeStat:   rc.safeStat   || '$14M/MO · $0.00 DUPLICATES',
    faultSym:   rc.faultSym   || ',',
    faultStat:  rc.faultStat  || '400 ORDERS FROZEN',
    pageTag:    rc.pageTag    || 'BLANK PAGE',
    signalTop:  rc.signalTop  || 'REAL',
    signalBot:  rc.signalBot  || 'OUTAGE',
    cta:        rc.cta        || 'contact@olventech.com',
  };
}

function buildCinemaHtml(cfg) {
  const fJakarta = b64File(path.join(ASSETS_DIR, 'PlusJakartaSans.woff2'));
  const fMono = b64File(path.join(ASSETS_DIR, 'IBMPlexMono.woff2'));
  const fPlayB = b64File(path.join(ASSETS_DIR, 'PlayfairDisplay-Bold.woff2'));
  const fPlayBI = b64File(path.join(ASSETS_DIR, 'PlayfairDisplay-BoldItalic.woff2'));
  const fCormBI = b64File(path.join(ASSETS_DIR, 'CormorantGaramond-BoldItalic.woff2'));
  const logoUri = logoDataUri('#FFFFFF', '#070B14');
  const logoDarkUri = logoDataUri('#0D1017', '#F4F1EA');

  return `<!DOCTYPE html><html><head><meta charset="utf-8"><style>
    @font-face { font-family: 'Plus Jakarta Sans'; src: url(data:font/woff2;base64,${fJakarta}) format('woff2'); font-weight: 500 800; }
    @font-face { font-family: 'IBM Plex Mono'; src: url(data:font/woff2;base64,${fMono}) format('woff2'); font-weight: 500 700; }
    @font-face { font-family: 'Playfair Display'; src: url(data:font/woff2;base64,${fPlayB}) format('woff2'); font-weight: 700; font-style: normal; }
    @font-face { font-family: 'Playfair Display'; src: url(data:font/woff2;base64,${fPlayBI}) format('woff2'); font-weight: 700; font-style: italic; }
    @font-face { font-family: 'Cormorant Garamond'; src: url(data:font/woff2;base64,${fCormBI}) format('woff2'); font-weight: 700; font-style: italic; }
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body { width: ${WIDTH}px; height: ${HEIGHT}px; overflow: hidden; background: #070B14; }
    canvas { display: block; width: ${WIDTH}px; height: ${HEIGHT}px; }
  </style></head><body>
  <canvas id="stage" width="${WIDTH}" height="${HEIGHT}"></canvas>
  <script>
  const W = ${WIDTH}, H = ${HEIGHT}, FPS = ${FPS};
  const CFG = ${JSON.stringify(cfg)};
  const canvas = document.getElementById('stage');
  const ctx = canvas.getContext('2d');
  const logoImg = new Image(); logoImg.src = ${JSON.stringify(logoUri)};
  const logoDarkImg = new Image(); logoDarkImg.src = ${JSON.stringify(logoDarkUri)};

  function mkRng(seed) { let s = seed; return () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; }; }
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const easeOutCubic = (t) => 1 - Math.pow(1 - clamp(t, 0, 1), 3);
  const easeInOutQuart = (t) => { const x = clamp(t, 0, 1); return x < 0.5 ? 8*x*x*x*x : 1 - Math.pow(-2*x+2, 4)/2; };

  function drawSphere(x, y, r, topC, midC, botC, label = '', labelCol = '#FFFFFF', alpha = 1, sx = 1, sy = 1) {
    if (alpha <= 0.01) return;
    ctx.save(); ctx.globalAlpha = clamp(alpha, 0, 1); ctx.translate(x, y); ctx.scale(sx, sy);
    ctx.fillStyle = 'rgba(11, 15, 25, 0.26)';
    ctx.beginPath(); ctx.ellipse(4, r * 0.28, r * 0.94, r * 0.86, 0, 0, Math.PI * 2); ctx.fill();
    const g = ctx.createRadialGradient(-r * 0.34, -r * 0.36, r * 0.08, 0, 0, r * 1.05);
    g.addColorStop(0, topC); g.addColorStop(0.32, midC); g.addColorStop(0.86, botC); g.addColorStop(1, '#080B12');
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,0.34)'; ctx.lineWidth = 1.6; ctx.stroke();
    if (label) {
      ctx.fillStyle = labelCol; ctx.font = '800 ' + Math.round(r * 0.42) + 'px "Plus Jakarta Sans", sans-serif';
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(label, 0, 2);
    }
    ctx.restore();
  }

  function drawExecText(lines, yCenter, size, color, alpha, yOff = 0, darkBg = false) {
    if (alpha <= 0.01) return;
    ctx.save(); ctx.globalAlpha = clamp(alpha, 0, 1);
    let sz = size;
    const maxW = W - 110;
    while (sz > 38) {
      let widest = 0;
      for (const ln of lines) {
        const isIt = typeof ln !== 'string' && ln.italic;
        ctx.font = isIt
          ? ('italic 700 ' + Math.round(sz * 1.06) + 'px "Playfair Display", Georgia, serif')
          : ('800 ' + sz + 'px "Plus Jakarta Sans", sans-serif');
        widest = Math.max(widest, ctx.measureText(typeof ln === 'string' ? ln : ln.text).width);
      }
      if (widest <= maxW) break;
      sz -= 4;
    }
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    if (darkBg) { ctx.shadowColor = 'rgba(0,0,0,0.68)'; ctx.shadowBlur = 24; }
    const lh = sz * 1.12;
    const y0 = yCenter - ((lines.length - 1) * lh) / 2 + yOff;
    lines.forEach((ln, idx) => {
      const isIt = typeof ln !== 'string' && ln.italic;
      ctx.font = isIt
        ? ('italic 700 ' + Math.round(sz * 1.06) + 'px "Playfair Display", Georgia, serif')
        : ('800 ' + sz + 'px "Plus Jakarta Sans", sans-serif');
      ctx.fillStyle = typeof ln === 'string' ? color : ln.color;
      ctx.fillText(typeof ln === 'string' ? ln : ln.text, W * 0.5, y0 + idx * lh);
    });
    ctx.restore();
  }

  function drawCornerLogo(isLight = false) {
    const img = isLight ? logoDarkImg : logoImg;
    if (!img.complete || img.naturalWidth <= 0) return;
    ctx.save(); ctx.globalAlpha = 0.85;
    const lh = 28, lw = lh * (img.naturalWidth / img.naturalHeight);
    ctx.drawImage(img, W - lw - 56, H - lh - 56, lw, lh);
    ctx.restore();
  }

  function drawAct4Payoff(t, accentHex = '#F5C451', bgCenter = '#11221C', bgEdge = '#05080B') {
    if (t < 12.35) return;
    const fbg = easeInOutQuart((t - 12.35) / 0.52);
    ctx.save(); ctx.globalAlpha = fbg;
    const bg = ctx.createRadialGradient(W * 0.5, H * 0.44, 50, W * 0.5, H * 0.5, H * 0.72);
    bg.addColorStop(0, bgCenter); bg.addColorStop(0.55, bgEdge); bg.addColorStop(1, '#030406');
    ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
    ctx.strokeStyle = 'rgba(229, 198, 126, 0.22)'; ctx.lineWidth = 1.5;
    ctx.strokeRect(48, 48, W - 96, H - 96);
    ctx.restore();

    const p1 = easeOutCubic((t - 12.60) / 0.48);
    const p2 = easeOutCubic((t - 13.00) / 0.48);
    const p3 = easeOutCubic((t - 13.45) / 0.48);

    drawExecText([{ text: CFG.payoffBig, color: accentHex, italic: true }], 840, 114, accentHex, p1, (1 - p1) * 32, true);
    drawExecText([{ text: CFG.payoffSub, color: '#FAF6EE' }], 985, 62, '#FAF6EE', p2, (1 - p2) * 24, true);

    ctx.save(); ctx.globalAlpha = p3;
    if (logoImg.complete && logoImg.naturalWidth > 0) {
      const lh = 44, lw = lh * (logoImg.naturalWidth / logoImg.naturalHeight);
      ctx.drawImage(logoImg, (W - lw) / 2, 1255, lw, lh);
    }
    ctx.fillStyle = '#94A3B8'; ctx.font = '500 32px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(CFG.cta, W * 0.5, 1345);
    ctx.restore();
  }

  // =========================================================================
  // WORLD 1: ZURICH ARCHITECTURAL BOTTLENECK (Warm Swiss Linen -> Obsidian Emerald)
  // =========================================================================
  const W1 = (() => {
    const rng = mkRng(2104);
    const wallY = 1040, wallH = 68, gapW = 86, cx = W * 0.5;
    const spheres = [];
    for (let i = 0; i < 32; i++) {
      spheres.push({
        id: i, lane: i % 8, isJam: i === 0,
        x: i === 0 ? cx : cx + (rng() - 0.5) * 700,
        y: i === 0 ? wallY + wallH * 0.5 : 1190 + (i / 32) * 560,
        vx: 0, vy: -90 - rng() * 60, r: 36,
      });
    }
    const history = [];
    const cur = spheres.map((s) => ({ ...s }));
    for (let f = 0; f < ${TOTAL_FRAMES}; f++) {
      const t = f / FPS;
      const isExpress = t >= 7.55;
      for (const b of cur) {
        if (!isExpress) {
          if (b.isJam) {
            b.x = lerp(b.x, cx, 0.2); b.y = lerp(b.y, wallY + wallH * 0.5, 0.2);
          } else {
            const dx = cx - b.x, dy = (wallY + wallH + 34) - b.y;
            const d = Math.hypot(dx, dy) + 1;
            b.vx = b.vx * 0.86 + (dx / d) * 14; b.vy = b.vy * 0.86 + (dy / d) * 14;
            b.x = clamp(b.x + b.vx * 0.55, 78, W - 78);
            b.y = clamp(b.y + b.vy * 0.55, wallY + wallH + b.r + 4, H - 110);
          }
        } else {
          const laneX = 110 + (b.lane / 7) * (W - 220);
          b.x = lerp(b.x, laneX, 0.14);
          b.y -= 28 + (b.lane % 3) * 4;
          if (b.y < 520) b.y = H - 80 + (b.id % 4) * 35;
        }
      }
      if (!isExpress) {
        for (let i = 1; i < cur.length; i++) for (let j = i + 1; j < cur.length; j++) {
          const a = cur[i], b = cur[j], dx = b.x - a.x, dy = b.y - a.y, d = Math.hypot(dx, dy) || 1, minD = a.r + b.r + 3;
          if (d < minD) { const push = (minD - d) * 0.45; a.x -= (dx / d) * push; a.y -= (dy / d) * push; b.x += (dx / d) * push; b.y += (dy / d) * push; }
        }
      }
      history.push(cur.map((s) => ({ x: s.x, y: s.y, isJam: s.isJam, lane: s.lane, r: s.r })));
    }

    return function render(frameIdx, t) {
      const darkT = easeInOutQuart((t - 7.25) / 0.65);
      const r = Math.round(lerp(244, 8, darkT)), g = Math.round(lerp(241, 16, darkT)), b = Math.round(lerp(234, 20, darkT));
      ctx.fillStyle = 'rgb(' + r + ',' + g + ',' + b + ')'; ctx.fillRect(0, 0, W, H);

      ctx.strokeStyle = darkT > 0.5 ? 'rgba(52,211,153,0.06)' : 'rgba(15,23,42,0.05)'; ctx.lineWidth = 1;
      for (let x = 54; x < W; x += 54) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
      for (let y = 54; y < H; y += 54) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }

      if (t < 12.6) {
        const alphaAll = t > 12.1 ? 1 - (t - 12.1) / 0.5 : 1;
        ctx.save(); ctx.globalAlpha = alphaAll;
        if (darkT > 0.1) {
          ctx.save(); ctx.globalAlpha = darkT * 0.45 * alphaAll;
          for (let l = 0; l < 8; l++) {
            const lx = 110 + (l / 7) * (W - 220);
            ctx.strokeStyle = '#34D399'; ctx.lineWidth = 2;
            ctx.beginPath(); ctx.moveTo(lx, 540); ctx.lineTo(lx, H - 80); ctx.stroke();
          }
          ctx.restore();
        }
        const halfGap = lerp(gapW / 2, W * 0.55, easeInOutQuart((t - 7.45) / 0.65));
        if (halfGap < W * 0.52) {
          const wg = ctx.createLinearGradient(0, wallY, 0, wallY + wallH);
          wg.addColorStop(0, '#1B202C'); wg.addColorStop(1, '#07090E');
          ctx.fillStyle = wg;
          ctx.fillRect(0, wallY, cx - halfGap, wallH); ctx.fillRect(cx + halfGap, wallY, W - (cx + halfGap), wallH);
          ctx.fillStyle = '#D97706';
          ctx.fillRect(cx - halfGap - 8, wallY - 3, 8, wallH + 6); ctx.fillRect(cx + halfGap, wallY - 3, 8, wallH + 6);
        }
        const snap = history[clamp(frameIdx, 0, history.length - 1)];
        for (const s of snap) {
          if (darkT > 0.5) drawSphere(s.x, s.y, s.r * 0.85, '#ECFDF5', '#34D399', '#065F46');
          else if (s.isJam) drawSphere(s.x, s.y, s.r * 1.12, '#FFE4E6', '#E11D48', '#881337', '', '#FFF', 1, 0.84, 1.16);
          else drawSphere(s.x, s.y, s.r, '#E2E8F0', '#3B82F6', '#1E3A8A');
        }
        ctx.restore();
      }

      // FRAME-0 SHARP COVER HEADLINE (alpha = 1.0 immediately from t = 0.00s!)
      if (t < 3.1) {
        const fo = t > 2.7 ? 1 - (t - 2.7) / 0.4 : 1;
        drawExecText([{ text: CFG.setupLine1, color: '#0D1017' }, { text: CFG.setupLine2, color: '#C81922', italic: true }], 340, 88, '#0D1017', fo, 0, false);
      }
      if (t >= 3.2 && t < 7.25) {
        const fi = easeOutCubic((t - 3.2) / 0.35), fo = t > 6.85 ? 1 - (t - 6.85) / 0.4 : 1, isTwist = t >= 5.3;
        drawExecText([{ text: isTwist ? CFG.twistPunch : CFG.stuckStat, color: '#C81922', italic: isTwist }], 350, isTwist ? 114 : 88, '#C81922', fi * fo, (1 - fi) * 22, false);
      }
      if (t >= 7.65 && t < 12.35) {
        const fi = easeOutCubic((t - 7.65) / 0.4), fo = t > 11.95 ? 1 - (t - 11.95) / 0.4 : 1;
        drawExecText([{ text: CFG.fixLine1, color: '#FAF6EE' }, { text: CFG.fixLine2, color: '#34D399', italic: true }], 340, 86, '#FAF6EE', fi * fo, (1 - fi) * 24, true);
      }
      if (t < 12.2) drawCornerLogo(darkT < 0.5);
      drawAct4Payoff(t, '#34D399', '#0B241E', '#05080B');
    };
  })();

  // =========================================================================
  // WORLD 2: LONDON MAYFAIR RACING GREEN & 24K GOLD WIRE LEDGER (Distinct Deep Green Cover!)
  // =========================================================================
  const W2 = (() => {
    return function render(frameIdx, t) {
      const darkT = easeInOutQuart((t - 7.25) / 0.70);
      const bg = ctx.createRadialGradient(W * 0.5, H * 0.5, 40, W * 0.5, H * 0.5, H * 0.8);
      if (darkT > 0.5) { bg.addColorStop(0, '#13221D'); bg.addColorStop(0.6, '#070D0E'); bg.addColorStop(1, '#030507'); }
      else { bg.addColorStop(0, '#103D2D'); bg.addColorStop(0.55, '#082118'); bg.addColorStop(1, '#04120D'); }
      ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);

      // Mayfair champagne-gold double gallery framing border
      ctx.strokeStyle = 'rgba(229, 198, 126, 0.24)'; ctx.lineWidth = 1.5; ctx.strokeRect(38, 38, W - 76, H - 76);

      const cx = W * 0.5, gateY = 1040, chanW = 240, slabH = 74, gap = 156;
      if (t < 12.6) {
        const trA = t > 12.1 ? 1 - (t - 12.1) / 0.5 : 1;
        ctx.save(); ctx.globalAlpha = trA;
        ctx.fillStyle = 'rgba(245, 196, 81, 0.045)'; ctx.fillRect(cx - chanW / 2, 540, chanW, 1220);
        ctx.strokeStyle = 'rgba(245, 196, 81, 0.24)'; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(cx - chanW / 2, 540); ctx.lineTo(cx - chanW / 2, 1760); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(cx + chanW / 2, 540); ctx.lineTo(cx + chanW / 2, 1760); ctx.stroke();

        const isLag = (t >= 3.1 && t < 5.3), isLocked = (t >= 7.6);
        const gSlab = ctx.createLinearGradient(0, gateY, 0, gateY + slabH);
        gSlab.addColorStop(0, '#1B2E26'); gSlab.addColorStop(1, '#07100C');
        ctx.fillStyle = gSlab;
        ctx.fillRect(40, gateY, cx - gap / 2 - 40, slabH); ctx.fillRect(cx + gap / 2, gateY, W - (cx + gap / 2) - 40, slabH);

        const trimCol = isLocked ? '#F5C451' : (isLag ? '#FF453A' : '#34D399');
        ctx.fillStyle = trimCol;
        ctx.fillRect(cx - gap / 2 - 10, gateY - 4, 10, slabH + 8); ctx.fillRect(cx + gap / 2, gateY - 4, 10, slabH + 8);

        ctx.fillStyle = '#CBD5E1'; ctx.font = '700 19px "IBM Plex Mono", monospace';
        ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
        ctx.fillText(isLocked ? 'LEDGER KEY GATE' : (CFG.doorLabel || 'LEDGER API GATE'), cx - gap / 2 - 28, gateY + slabH / 2);
        ctx.textAlign = 'left'; ctx.fillStyle = trimCol;
        ctx.fillText(isLocked ? 'SHA-256 LOCKED' : (isLag ? '2.0s LAG' : 'NORMAL 120ms'), cx + gap / 2 + 28, gateY + slabH / 2);

        if (t < 3.05) {
          drawSphere(cx, lerp(720, 1740, easeOutCubic(t / 2.8)), 58, '#FEF9C3', '#F5C451', '#92400E', CFG.wireVal, '#0B0F17');
        }
        if (t >= 3.05 && t < 7.45) {
          const f2 = t > 7.1 ? 1 - (t - 7.1) / 0.35 : 1;
          let y1 = 620, x1 = cx;
          if (t < 3.7) y1 = lerp(600, gateY + 36, easeOutCubic((t - 3.05) / 0.65));
          else if (t < 5.15) y1 = gateY + 36 + Math.sin((t - 3.7) * 14) * 4;
          else { const d = easeOutCubic((t - 5.15) / 0.65); y1 = lerp(gateY + 36, 1480, d); x1 = lerp(cx, cx - 84, d); }
          drawSphere(x1, y1, 58, '#FFF1F2', '#E11D48', '#881337', CFG.wireVal, '#FFFFFF', f2);
          if (t >= 4.35) {
            const p2 = easeOutCubic((t - 4.35) / 1.45);
            const y2 = lerp(580, 1480, p2);
            const x2 = t > 5.2 ? lerp(cx, cx + 84, easeOutCubic((t - 5.2) / 0.55)) : cx;
            drawSphere(x2, y2, 58, '#FFF1F2', '#E11D48', '#881337', CFG.wireVal, '#FFFFFF', f2);
          }
          if (t >= 5.55) {
            const si = easeOutCubic((t - 5.55) / 0.35);
            ctx.save(); ctx.globalAlpha = si * f2;
            ctx.fillStyle = '#0F172A'; ctx.strokeStyle = '#FF453A'; ctx.lineWidth = 2;
            ctx.beginPath(); ctx.roundRect(cx - 275, 1605, 550, 86, 12); ctx.fill(); ctx.stroke();
            ctx.fillStyle = '#FF453A'; ctx.font = '700 34px "IBM Plex Mono", monospace'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
            ctx.fillText(CFG.doubleStat, cx, 1649); ctx.restore();
          }
        }
        if (t >= 7.5 && t < 12.5) {
          const lockIn = easeOutCubic((t - 7.5) / 0.45);
          ctx.save(); ctx.strokeStyle = '#F5C451'; ctx.shadowColor = '#F5C451'; ctx.shadowBlur = 22; ctx.lineWidth = 5;
          ctx.beginPath(); ctx.moveTo(cx - (gap / 2) * lockIn, gateY + slabH / 2); ctx.lineTo(cx + (gap / 2) * lockIn, gateY + slabH / 2); ctx.stroke(); ctx.restore();
          [7.7, 9.2, 10.7].forEach((wt) => {
            const p = (t - wt) / 1.85;
            if (p >= 0 && p <= 1) drawSphere(cx, lerp(580, 1740, p), 52, '#FEF9C3', '#F5C451', '#92400E', CFG.wireVal, '#0B0F17');
          });
          [8.55, 10.05].forEach((dt0) => {
            const dp = (t - dt0) / 1.25;
            if (dp >= 0 && dp <= 1) {
              if (dp < 0.45) drawSphere(cx + 22, lerp(580, gateY - 46, dp / 0.45), 44, '#FFE4E6', '#E11D48', '#881337', 'DUP', '#FFFFFF', 0.95);
              else {
                const b = easeOutCubic((dp - 0.45) / 0.55);
                drawSphere(lerp(cx + 22, cx + 340, b), lerp(gateY - 46, gateY - 120, b), 44, '#FFE4E6', '#E11D48', '#881337', 'DUP', '#FFFFFF', 1 - b);
              }
            }
          });
          ctx.save(); ctx.fillStyle = 'rgba(245,196,81,0.12)'; ctx.strokeStyle = 'rgba(245,196,81,0.45)'; ctx.lineWidth = 2;
          ctx.beginPath(); ctx.roundRect(cx - 295, 1605, 590, 86, 12); ctx.fill(); ctx.stroke();
          ctx.fillStyle = '#F5C451'; ctx.font = '700 32px "IBM Plex Mono", monospace'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
          ctx.fillText(CFG.safeStat, cx, 1649); ctx.restore();
        }
        ctx.restore();
      }

      // FRAME-0 SHARP COVER HEADLINE!
      if (t < 3.0) {
        const fo = t > 2.6 ? 1 - (t - 2.6) / 0.4 : 1;
        drawExecText([{ text: CFG.setupLine1, color: '#FAF6EE' }, { text: CFG.setupLine2, color: '#F5C451', italic: true }], 330, 86, '#FAF6EE', fo, 0, true);
      }
      if (t >= 3.1 && t < 7.25) {
        const fi = easeOutCubic((t - 3.1) / 0.35), fo = t > 6.85 ? 1 - (t - 6.85) / 0.4 : 1, isD = t >= 5.5;
        drawExecText(isD ? [{ text: CFG.twistPunch, color: '#FF453A', italic: true }] : [{ text: CFG.stuckStat, color: '#FAF6EE' }], 335, isD ? 104 : 84, '#FAF6EE', fi * fo, (1 - fi) * 22, true);
      }
      if (t >= 7.6 && t < 12.35) {
        const fi = easeOutCubic((t - 7.6) / 0.4), fo = t > 11.95 ? 1 - (t - 11.95) / 0.4 : 1;
        drawExecText([{ text: CFG.fixLine1, color: '#FAF6EE' }, { text: CFG.fixLine2, color: '#F5C451', italic: true }], 330, 84, '#FAF6EE', fi * fo, (1 - fi) * 24, true);
      }
      if (t < 12.2) drawCornerLogo(false);
      drawAct4Payoff(t, '#F5C451', '#103D2D', '#04120D');
    };
  })();

  // =========================================================================
  // WORLD 3: BERLIN AEROSPACE OBSIDIAN MONOLITH BYPASS (Pitch Obsidian -> Emerald)
  // =========================================================================
  const W3 = (() => {
    return function render(frameIdx, t) {
      const isFix = t >= 7.55;
      const bg = ctx.createRadialGradient(W * 0.5, H * 0.54, 40, W * 0.5, H * 0.54, H * 0.78);
      bg.addColorStop(0, isFix ? '#0D261D' : '#141820'); bg.addColorStop(0.55, '#070A0F'); bg.addColorStop(1, '#040507');
      ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);

      if (t < 12.6) {
        const trA = t > 12.1 ? 1 - (t - 12.1) / 0.5 : 1;
        ctx.save(); ctx.globalAlpha = trA;
        const cols = 12, rows = 14, padX = 96, y0 = 600, gW = W - padX * 2, gH = 1040;
        const cw = gW / cols, ch = gH / rows, fIdx = 15;
        const scanIdx = isFix ? Math.floor((t - 7.55) * 48) : Math.min(fIdx, Math.max(12, Math.floor(t * 7.5)));

        for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
          const idx = r * cols + c;
          const bx = padX + c * cw + 5, by = y0 + r * ch + 5, bw = cw - 10, bh = ch - 10;
          if (idx === fIdx) {
            ctx.fillStyle = isFix ? '#D97706' : '#FF3B30';
            ctx.shadowColor = ctx.fillStyle; ctx.shadowBlur = 22;
            ctx.beginPath(); ctx.roundRect(bx - 1, by - 1, bw + 2, bh + 2, 6); ctx.fill(); ctx.shadowBlur = 0;
            ctx.fillStyle = '#FFFFFF'; ctx.font = '800 22px "IBM Plex Mono", monospace';
            ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
            ctx.fillText(CFG.faultSym, bx + bw / 2, by + bh / 2 - 1);
          } else if (idx < scanIdx) {
            const g = ctx.createLinearGradient(bx, by, bx, by + bh);
            if (isFix) { g.addColorStop(0, '#6EE7B7'); g.addColorStop(1, '#059669'); }
            else { g.addColorStop(0, '#E2E8F0'); g.addColorStop(1, '#94A3B8'); }
            ctx.fillStyle = g; ctx.beginPath(); ctx.roundRect(bx, by, bw, bh, 6); ctx.fill();
          } else {
            ctx.fillStyle = 'rgba(148,163,184,0.08)'; ctx.strokeStyle = 'rgba(148,163,184,0.16)'; ctx.lineWidth = 1;
            ctx.beginPath(); ctx.roundRect(bx, by, bw, bh, 6); ctx.fill(); ctx.stroke();
          }
        }
        ctx.restore();
      }

      if (t < 3.1) {
        const fo = t > 2.7 ? 1 - (t - 2.7) / 0.4 : 1;
        drawExecText([{ text: CFG.setupLine1, color: '#F8FAFC' }, { text: CFG.setupLine2, color: '#FF3B30', italic: true }], 340, 88, '#F8FAFC', fo, 0, true);
      }
      if (t >= 3.2 && t < 7.25) {
        const fi = easeOutCubic((t - 3.2) / 0.35), fo = t > 6.85 ? 1 - (t - 6.85) / 0.4 : 1, isT = t >= 5.3;
        drawExecText([{ text: isT ? CFG.twistPunch : CFG.faultStat, color: isT ? '#F5C451' : '#FF3B30', italic: isT }], 345, isT ? 108 : 84, '#FF3B30', fi * fo, (1 - fi) * 22, true);
      }
      if (t >= 7.6 && t < 12.35) {
        const fi = easeOutCubic((t - 7.6) / 0.4), fo = t > 11.95 ? 1 - (t - 11.95) / 0.4 : 1;
        drawExecText([{ text: CFG.fixLine1, color: '#FAF6EE' }, { text: CFG.fixLine2, color: '#34D399', italic: true }], 340, 84, '#FAF6EE', fi * fo, (1 - fi) * 24, true);
      }
      if (t < 12.2) drawCornerLogo(false);
      drawAct4Payoff(t, '#F5C451', '#0C261D', '#05070A');
    };
  })();

  // =========================================================================
  // WORLD 4: MILANESE VENETIAN OXBLOOD OPTICAL PRE-FILTER (Deep Bordeaux -> Emerald)
  // =========================================================================
  const W4 = (() => {
    const rng = mkRng(2242);
    const pages = Array.from({ length: 16 }, (_, i) => ({ idx: i, isKey: i % 4 === 2, y0: 1080 + i * 270 }));
    const embers = Array.from({ length: 36 }, (_, i) => ({ ox: (rng() - 0.5) * 440, spd: 120 + rng() * 240, ph: rng() * 6, r: 3 + rng() * 4.5, gold: i % 2 === 0 }));
    return function render(frameIdx, t) {
      const isFix = t >= 7.55;
      const bg = ctx.createRadialGradient(W * 0.5, 1080, 40, W * 0.5, 1080, 820);
      if (isFix) { bg.addColorStop(0, '#0F2A20'); bg.addColorStop(0.6, '#071411'); bg.addColorStop(1, '#040808'); }
      else { bg.addColorStop(0, '#460E18'); bg.addColorStop(0.55, '#24070C'); bg.addColorStop(1, '#100305'); }
      ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);

      const scanY = 1080;
      if (t < 12.6) {
        const trA = t > 12.1 ? 1 - (t - 12.1) / 0.5 : 1;
        ctx.save(); ctx.globalAlpha = trA;
        for (const p of pages) {
          let py = p.y0 - t * 380 - (isFix ? (t - 7.55) * 260 : 0);
          py = ((py + 400) % 2400) - 400;
          let px = W * 0.5, rot = 0, a = 1;
          if (isFix && !p.isKey && py < 1300) {
            const fl = easeOutCubic((1300 - py) / 360);
            px -= fl * 520; rot = -fl * 0.65; a = 1 - fl * 0.85;
          }
          const burning = (!isFix && !p.isKey && py < scanY + 55 && py > scanY - 240);
          ctx.save(); ctx.globalAlpha = clamp(a * trA, 0, 1); ctx.translate(px, py); ctx.rotate(rot);
          ctx.fillStyle = p.isKey ? '#FEF3C7' : (burning ? '#FDBA74' : '#FAF6EE');
          ctx.shadowColor = burning ? '#F97316' : 'rgba(0,0,0,0.45)'; ctx.shadowBlur = burning ? 34 : 20;
          ctx.beginPath(); ctx.roundRect(-140, -180, 280, 360, 10); ctx.fill(); ctx.shadowBlur = 0;
          if (p.isKey) {
            ctx.fillStyle = '#92400E';
            for (let r = 0; r < 5; r++) ctx.fillRect(-94, -96 + r * 42, r === 4 ? 115 : 188, 12);
          } else {
            ctx.fillStyle = 'rgba(38,7,13,0.22)'; ctx.font = '700 22px "IBM Plex Mono", monospace';
            ctx.textAlign = 'center'; ctx.fillText(CFG.pageTag, 0, 0);
          }
          ctx.restore();
        }
        const bCol = isFix ? '#34D399' : '#BAE6FD';
        ctx.save(); ctx.strokeStyle = bCol; ctx.shadowColor = bCol; ctx.shadowBlur = 24; ctx.lineWidth = 5;
        ctx.beginPath(); ctx.moveTo(96, scanY); ctx.lineTo(W - 96, scanY); ctx.stroke(); ctx.restore();
        if (!isFix) {
          for (const e of embers) {
            const ey = scanY + 120 - ((t * e.spd + e.ph * 80) % 500);
            ctx.fillStyle = e.gold ? '#F5C451' : '#FB923C';
            ctx.beginPath(); ctx.arc(W * 0.5 + e.ox + Math.sin(t * 4 + e.ph) * 24, ey, e.r, 0, Math.PI * 2); ctx.fill();
          }
        }
        const matte = ctx.createLinearGradient(0, 0, 0, 620);
        const mc = isFix ? '7,20,17' : '36,7,12';
        matte.addColorStop(0, 'rgba(' + mc + ',0.99)'); matte.addColorStop(0.68, 'rgba(' + mc + ',0.94)'); matte.addColorStop(1, 'rgba(' + mc + ',0)');
        ctx.fillStyle = matte; ctx.fillRect(0, 0, W, 620);
        ctx.restore();
      }

      if (t < 3.1) {
        const fo = t > 2.7 ? 1 - (t - 2.7) / 0.4 : 1;
        drawExecText([{ text: CFG.setupLine1, color: '#FAF2E6' }, { text: CFG.setupLine2, color: '#F2B866', italic: true }], 340, 88, '#FAF2E6', fo, 0, true);
      }
      if (t >= 3.2 && t < 7.25) {
        const fi = easeOutCubic((t - 3.2) / 0.35), fo = t > 6.85 ? 1 - (t - 6.85) / 0.4 : 1, isT = t >= 5.3;
        drawExecText([{ text: isT ? CFG.twistPunch : CFG.stuckStat, color: '#F2B866', italic: isT }], 345, isT ? 110 : 94, '#F2B866', fi * fo, (1 - fi) * 22, true);
      }
      if (t >= 7.6 && t < 12.35) {
        const fi = easeOutCubic((t - 7.6) / 0.4), fo = t > 11.95 ? 1 - (t - 11.95) / 0.4 : 1;
        drawExecText([{ text: CFG.fixLine1, color: '#FAF6EE' }, { text: CFG.fixLine2, color: '#34D399', italic: true }], 340, 84, '#FAF6EE', fi * fo, (1 - fi) * 24, true);
      }
      if (t < 12.2) drawCornerLogo(false);
      drawAct4Payoff(t, '#F2B866', '#14261E', '#060A09');
    };
  })();

  // =========================================================================
  // WORLD 5: STOCKHOLM / GENEVA CHRONOGRAPH SWEEP (Cool Nordic Silver-Slate -> Midnight Emerald)
  // =========================================================================
  const W5 = (() => {
    const rng = mkRng(2684);
    const cols = 7, rows = 10, padX = 82, topS = 650, botE = 1710;
    const cw = (W - padX * 2) / cols, ch = (botE - topS) / rows;
    const cells = [];
    for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
      cells.push({
        x: padX + (c + 0.5) * cw, y: topS + (r + 0.5) * ch,
        isReal: (r === 5 && c === 4),
        minute: String(Math.floor(rng() * 59)).padStart(2, '0'),
        phase: rng() * 12,
      });
    }
    return function render(frameIdx, t) {
      const darkT = easeInOutQuart((t - 7.30) / 0.55);
      // Light Cool Nordic Silver-Slate base (Acts 1-2)
      const bgL = ctx.createRadialGradient(W * 0.5, H * 0.42, 60, W * 0.5, H * 0.52, H * 0.78);
      bgL.addColorStop(0, '#F4F7FB'); bgL.addColorStop(0.65, '#E4EBF3'); bgL.addColorStop(1, '#CFD9E6');
      ctx.fillStyle = bgL; ctx.fillRect(0, 0, W, H);
      // Dark Midnight Emerald overlay (Acts 3-4)
      if (darkT > 0.005) {
        ctx.save(); ctx.globalAlpha = darkT;
        const bgD = ctx.createRadialGradient(W * 0.5, H * 0.58, 50, W * 0.5, H * 0.55, H * 0.8);
        bgD.addColorStop(0, '#0B2320'); bgD.addColorStop(0.55, '#070B17'); bgD.addColorStop(1, '#03050A');
        ctx.fillStyle = bgD; ctx.fillRect(0, 0, W, H);
        ctx.restore();
      }

      if (t < 12.6) {
        const trA = t > 12.1 ? 1 - (t - 12.1) / 0.5 : 1;
        ctx.save(); ctx.globalAlpha = trA;
        // Swiss watchmaker chronograph bezel circle
        ctx.strokeStyle = darkT > 0.5 ? 'rgba(203, 213, 225, 0.16)' : 'rgba(15, 23, 42, 0.14)';
        ctx.lineWidth = 2;
        ctx.beginPath(); ctx.arc(W * 0.5, 1180, 470, 0, Math.PI * 2); ctx.stroke();
        ctx.strokeStyle = darkT > 0.5 ? 'rgba(203, 213, 225, 0.08)' : 'rgba(15, 23, 42, 0.08)';
        ctx.beginPath(); ctx.arc(W * 0.5, 1180, 445, 0, Math.PI * 2); ctx.stroke();

        const sweepT = easeInOutQuart((t - 7.65) / 2.60);
        const sweepX = -120 + sweepT * (W + 240);

        for (const cell of cells) {
          const silenced = (!cell.isReal && t >= 7.65 && cell.x < sweepX);
          ctx.save(); ctx.translate(cell.x, cell.y);
          if (cell.isReal) {
            const boost = (t >= 7.65 && cell.x < sweepX) ? 1.38 : 1.0;
            ctx.scale(boost, boost);
            const g = ctx.createRadialGradient(0, 0, 4, 0, 0, 86);
            g.addColorStop(0, darkT > 0.5 ? 'rgba(52,211,153,0.65)' : 'rgba(15,23,42,0.18)');
            g.addColorStop(1, 'rgba(52,211,153,0)');
            ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, 0, 86, 0, Math.PI * 2); ctx.fill();
            ctx.fillStyle = darkT > 0.5 ? '#06261E' : '#0F172A';
            ctx.strokeStyle = darkT > 0.5 ? '#34D399' : '#B91C1C'; ctx.lineWidth = 2.8;
            ctx.beginPath(); ctx.roundRect(-cw * 0.45, -ch * 0.36, cw * 0.90, ch * 0.72, 9); ctx.fill(); ctx.stroke();
            ctx.fillStyle = '#F8FAFC'; ctx.font = '800 20px "Plus Jakarta Sans", sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
            ctx.fillText(CFG.signalTop, 0, -10);
            ctx.fillStyle = darkT > 0.5 ? '#34D399' : '#FCA5A5';
            ctx.fillText(CFG.signalBot, 0, 12);
          } else if (silenced) {
            ctx.fillStyle = 'rgba(148, 163, 184, 0.18)';
            ctx.beginPath(); ctx.arc(0, 0, 4.5, 0, Math.PI * 2); ctx.fill();
          } else {
            const pulse = 0.58 + 0.38 * Math.sin(t * 7 + cell.phase);
            ctx.fillStyle = darkT > 0.5
              ? 'rgba(255, 69, 88, ' + pulse.toFixed(2) + ')'
              : 'rgba(185, 28, 28, ' + pulse.toFixed(2) + ')';
            ctx.font = '700 29px "IBM Plex Mono", monospace'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
            ctx.fillText('3:' + cell.minute, 0, 0);
          }
          ctx.restore();
        }
        if (t >= 7.60 && t <= 10.6) {
          const lg = ctx.createLinearGradient(sweepX - 75, 0, sweepX + 75, 0);
          lg.addColorStop(0, 'rgba(52,211,153,0)'); lg.addColorStop(0.5, 'rgba(52,211,153,0.40)'); lg.addColorStop(1, 'rgba(52,211,153,0)');
          ctx.fillStyle = lg; ctx.fillRect(sweepX - 75, 580, 150, 1180);
          ctx.strokeStyle = '#6EE7B7'; ctx.shadowColor = '#10B981'; ctx.shadowBlur = 22; ctx.lineWidth = 4.5;
          ctx.beginPath(); ctx.moveTo(sweepX, 580); ctx.lineTo(sweepX, 1760); ctx.stroke(); ctx.shadowBlur = 0;
        }
        ctx.restore();
      }

      if (t < 3.1) {
        const fo = t > 2.7 ? 1 - (t - 2.7) / 0.4 : 1;
        drawExecText([{ text: CFG.setupLine1, color: '#0F172A' }, { text: CFG.setupLine2, color: '#B91C1C', italic: true }], 340, 88, '#0F172A', fo, 0, false);
      }
      if (t >= 3.2 && t < 7.25) {
        const fi = easeOutCubic((t - 3.2) / 0.35), fo = t > 6.85 ? 1 - (t - 6.85) / 0.4 : 1, isT = t >= 5.3;
        drawExecText([{ text: isT ? CFG.twistPunch : CFG.stuckStat, color: isT ? '#B91C1C' : '#0F172A', italic: isT }], 345, isT ? 108 : 88, '#0F172A', fi * fo, (1 - fi) * 22, false);
      }
      if (t >= 7.6 && t < 12.35) {
        const fi = easeOutCubic((t - 7.6) / 0.4), fo = t > 11.95 ? 1 - (t - 11.95) / 0.4 : 1;
        drawExecText([{ text: CFG.fixLine1, color: '#FAF6EE' }, { text: CFG.fixLine2, color: '#34D399', italic: true }], 340, 84, '#FAF6EE', fi * fo, (1 - fi) * 24, true);
      }
      if (t < 12.2) drawCornerLogo(darkT < 0.5);
      drawAct4Payoff(t, '#34D399', '#0B2320', '#060A13');
    };
  })();

  const WORLDS = {
    flow_bottleneck_zurich: W1,
    flow_wire_ledger_geneva: W2,
    flow_monolith_milan: W3,
    flow_optics_milan: W4,
    flow_chronograph_geneva: W5,
  };

  window.renderFrame = function(frameIdx) {
    (WORLDS[CFG.mode] || W1)(frameIdx, frameIdx / FPS);
  };

  document.fonts.ready.then(() => {
    const waitLogo = () => {
      if (logoImg.complete && logoDarkImg.complete) { window.renderFrame(0); window.__CINEMA_READY__ = true; }
      else setTimeout(waitLogo, 20);
    };
    waitLogo();
  });
  </script></body></html>`;
}

async function main() {
  const specPath = process.argv[2];
  const outDir = process.argv[3];
  if (!specPath || !outDir) {
    console.error('Usage: node render_video.js <spec.json> <out_dir>');
    process.exit(1);
  }
  fs.mkdirSync(outDir, { recursive: true });
  const spec = JSON.parse(fs.readFileSync(specPath, 'utf8'));
  const cfg = resolveReelConfig(spec);

  const audioMode = AUDIO_MODE_MAP[cfg.mode] || 'physics_bottleneck';
  const audioPath = path.join(outDir, '_score_51.m4a');
  execFileSync('python3', [path.join(__dirname, 'mix_reel_sfx.py'), String(DURATION), audioPath, audioMode], { stdio: 'inherit' });

  const browser = await chromium.launch({
    executablePath: detectChrome(),
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
  });
  const page = await browser.newPage({ viewport: { width: WIDTH, height: HEIGHT }, deviceScaleFactor: 1 });
  await page.setContent(buildCinemaHtml(cfg), { waitUntil: 'load' });
  await page.waitForFunction(() => window.__CINEMA_READY__ === true);

  const outMp4 = path.join(outDir, 'walkthrough-video.mp4');
  const ff = spawn('ffmpeg', [
    '-y', '-f', 'image2pipe', '-vcodec', 'mjpeg', '-r', String(FPS), '-i', '-',
    '-i', audioPath,
    '-map', '0:v:0', '-map', '1:a:0',
    '-c:v', 'libx264', '-preset', 'medium', '-crf', '18',
    '-profile:v', 'high', '-level', '4.1', '-pix_fmt', 'yuv420p',
    '-color_primaries', 'bt709', '-color_trc', 'bt709', '-colorspace', 'bt709',
    '-c:a', 'copy', '-movflags', '+faststart', '-shortest',
    outMp4,
  ], { stdio: ['pipe', 'ignore', 'pipe'] });

  let ffErr = '';
  ff.stderr.on('data', (d) => { ffErr += d.toString(); });

  try {
    for (let f = 0; f < TOTAL_FRAMES; f++) {
      await page.evaluate((idx) => window.renderFrame(idx), f);
      const buf = await page.screenshot({ type: 'jpeg', quality: 94 });
      if (!ff.stdin.write(buf)) {
        await new Promise((res) => ff.stdin.once('drain', res));
      }
    }
    ff.stdin.end();
    await new Promise((res, rej) => ff.on('close', (code) => code === 0 ? res() : rej(new Error(ffErr))));
  } finally {
    await browser.close();
    fs.rmSync(audioPath, { force: true });
  }

  const mb = (fs.statSync(outMp4).size / 1048576).toFixed(2);
  console.log(`[Olven 5.1 Executive Flow OK] ${outMp4} [world=${cfg.mode}, 16s, 480f @ 30fps, ${mb} MB]`);
}

main().catch((err) => { console.error(err); process.exit(1); });
