#!/usr/bin/env node
/**
 * Olven Tech 5.0 — Transatlantic High-Stakes Executive × European Atelier Poster Engine
 * (Manhattan Wall Street × Zurich × Milan × London Mayfair × Paris × Stockholm × Geneva)
 *
 * ZERO cartoons. ZERO video-game UI. ZERO SaaS dashboards. ZERO text walls.
 * Bundles 6 authentic European heritage webfonts (Playfair Display, Cormorant Garamond,
 * Instrument Serif + Plus Jakarta Sans + IBM Plex Mono) as inline base64 woff2 for 100%
 * deterministic offline rendering in GitHub Actions.
 *
 * 8 radically distinct global executive worlds:
 *   1. wall_street_wire_slip    — Manhattan × Zurich Private-Bank Cotton Stock (ACH Wire Slips + Oxblood Stamp)
 *   2. palantir_monolith        — Berlin Aerospace Obsidian Monolith (Brushed Titanium Grid + 1 Crimson Fracture)
 *   3. mayfair_racing_green     — London Mayfair Private Bank (British Racing Green Velvet + 24K Gold Ingot)
 *   4. swiss_zurich_flow        — Zurich Architectural Flow (Flow Style 1 Print: Warm Linen + Anodized Hardware)
 *   5. milanese_oxblood_atelier — Milanese Luxury Atelier (Venetian Oxblood + Platinum Optical Laser + Gold Embers)
 *   6. parisian_ivory_monograph — Parisian Gallery Monograph (Limestone Ivory + Stepped Terracotta Arches + Dial)
 *   7. nordic_stockholm_slate   — Stockholm Industrial Precision (Nordic Mist + Machined Concentric Wave Rings)
 *   8. geneva_chronograph_noir  — Geneva Haute Horlogerie (Midnight Sapphire + Chronograph Dial + 1 Emerald Aperture)
 */
const fs = require('fs');
const path = require('path');

let chromium;
try { ({ chromium } = require('playwright')); } catch {
  const localCore = path.join(__dirname, 'node_modules/playwright-core');
  ({ chromium } = require(fs.existsSync(localCore) ? localCore : '/home/antigravity/.npm/_npx/e41f203b7505f1fb/node_modules/playwright-core'));
}

const ASSETS_DIR = path.join(__dirname, 'assets');
const b64File = (fp) => fs.readFileSync(fp).toString('base64');
const RAW_LOGO_SVG = fs.readFileSync(path.join(ASSETS_DIR, 'horizontal_dark.svg'), 'utf8')
  .replace(/<\?xml[\s\S]*?\?>/g, '')
  .replace(/<path[^>]*id="path1-3"[^>]*\/>/g, '');

const PLATFORMS = [
  { name: 'instagram.png', width: 1080, height: 1350, layout: 'portrait' },
  { name: 'linkedin.png',  width: 1200, height: 1200, layout: 'square' },
  { name: 'facebook.png',  width: 1620, height: 1080, layout: 'landscape32' },
  { name: 'x.png',         width: 1920, height: 1080, layout: 'landscape169' },
];

const THEME_PALETTES = {
  wall_street_wire_slip: {
    bg: '#EAE4D8', ink: '#0F172A', logoInk: '#0F172A', logoCut: '#E2DACB',
    accentDefault: '#B91C1C', shadowText: 'none',
    headFont: "'Playfair Display', Georgia, serif", headWeight: 700, headTracking: '-0.022em',
    headScale: 0.88, accentFont: "'Playfair Display', Georgia, serif", accentStyle: 'italic',
  },
  palantir_monolith: {
    bg: '#050608', ink: '#F8FAFC', logoInk: '#F8FAFC', logoCut: '#050608',
    accentDefault: '#FF3B30', shadowText: '0 10px 36px rgba(0,0,0,0.8)',
    headFont: "'Plus Jakarta Sans', sans-serif", headWeight: 800, headTracking: '-0.036em',
    headScale: 0.90, accentFont: "'Instrument Serif', Georgia, serif", accentStyle: 'italic', accentScale: 1.16,
  },
  mayfair_racing_green: {
    bg: '#082118', ink: '#FAF6EE', logoInk: '#E5C67E', logoCut: '#04120D',
    accentDefault: '#F5C451', shadowText: '0 8px 28px rgba(0,0,0,0.55)',
    headFont: "'Cormorant Garamond', Georgia, serif", headWeight: 700, headTracking: '-0.015em',
    headScale: 1.12, accentFont: "'Cormorant Garamond', Georgia, serif", accentStyle: 'italic',
  },
  swiss_zurich_flow: {
    bg: '#F4F1EA', ink: '#0D1017', logoInk: '#0D1017', logoCut: '#EAE3D6',
    accentDefault: '#C81922', shadowText: 'none',
    headFont: "'Plus Jakarta Sans', sans-serif", headWeight: 800, headTracking: '-0.038em',
    accentFont: "'Playfair Display', Georgia, serif", accentStyle: 'italic', accentScale: 1.04,
  },
  milanese_oxblood_atelier: {
    bg: '#26070D', ink: '#FAF2E6', logoInk: '#E8CFA0', logoCut: '#190408',
    accentDefault: '#F2B866', shadowText: '0 10px 34px rgba(0,0,0,0.65)',
    headFont: "'Instrument Serif', Georgia, serif", headWeight: 400, headTracking: '-0.01em',
    headScale: 1.24, accentFont: "'Instrument Serif', Georgia, serif", accentStyle: 'italic',
  },
  parisian_ivory_monograph: {
    bg: '#F5EFE4', ink: '#1B1411', logoInk: '#1B1411', logoCut: '#E8DEC9',
    accentDefault: '#B54726', shadowText: 'none',
    headFont: "'Cormorant Garamond', Georgia, serif", headWeight: 700, headTracking: '-0.016em',
    headScale: 1.12, accentFont: "'Cormorant Garamond', Georgia, serif", accentStyle: 'italic',
  },
  nordic_stockholm_slate: {
    bg: '#DDE4E9', ink: '#0D1722', logoInk: '#0D1722', logoCut: '#D0D9E0',
    accentDefault: '#D92B2B', shadowText: 'none',
    headFont: "'Plus Jakarta Sans', sans-serif", headWeight: 800, headTracking: '-0.036em',
    accentFont: "'Playfair Display', Georgia, serif", accentStyle: 'italic', accentScale: 1.04,
  },
  geneva_chronograph_noir: {
    bg: '#060A13', ink: '#F8FAFC', logoInk: '#D8DEE9', logoCut: '#060A13',
    accentDefault: '#34D399', shadowText: '0 10px 36px rgba(0,0,0,0.8)',
    headFont: "'Playfair Display', Georgia, serif", headWeight: 700, headTracking: '-0.02em',
    accentFont: "'Playfair Display', Georgia, serif", accentStyle: 'italic',
  },
};

function buildLogoSvg(h, inkHex, cutoutHex) {
  return RAW_LOGO_SVG
    .replace(/style="fill:#000000;/g, `style="fill:${cutoutHex};`)
    .replace(/style="fill:#ffffff;/g, `style="fill:${inkHex};`)
    .replace(/fill="#ffffff"/g, `fill="${inkHex}"`)
    .replace(/<svg\b([^>]*)>/, `<svg $1 style="height:${h}px; width:auto; display:block;">`);
}

function esc(s) {
  return String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function formatHeadline(headline, accentWord, accentHex, theme) {
  let html = esc(String(headline || '').trim()).replace(/\n/g, '<br/>');
  if (!accentWord) return html;
  const re = new RegExp(`(${esc(accentWord).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'i');
  const scaleEm = theme.accentScale ? `font-size:${theme.accentScale}em;` : '';
  const styleCss = `color:${accentHex};font-family:${theme.accentFont};font-style:${theme.accentStyle || 'italic'};font-weight:${theme.accentFont.includes('Instrument') ? 400 : 700};${scaleEm}`;
  return html.replace(re, `<span style="${styleCss}">$1</span>`);
}

function detectChrome() {
  for (const p of ['/usr/bin/google-chrome', '/usr/bin/chromium', '/usr/bin/chromium-browser']) {
    if (fs.existsSync(p)) return p;
  }
  return undefined;
}

const ART_SCRIPT = `
function mkRng(seed) {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; };
}

// 1. MANHATTAN × ZURICH PRIVATE-BANKING WIRE ARTIFACT
function drawWallStreetWireSlip(ctx, W, H, meta) {
  const bg = ctx.createRadialGradient(W * 0.5, H * 0.45, 60, W * 0.5, H * 0.55, Math.max(W, H) * 0.78);
  bg.addColorStop(0, '#F7F4ED'); bg.addColorStop(0.65, '#EAE4D8'); bg.addColorStop(1, '#DDD5C5');
  ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);

  // Subtle European banknote guilloché watermark rings in background
  ctx.save();
  ctx.strokeStyle = 'rgba(15, 23, 42, 0.032)'; ctx.lineWidth = 1;
  for (let r = 180; r < 680; r += 34) {
    ctx.beginPath(); ctx.arc(W * 0.5, H * 0.62, r, 0, Math.PI * 2); ctx.stroke();
  }
  ctx.restore();

  const amountStr = meta.wireAmount || '$32,000.00';
  const stampText = meta.stampText || 'WIRED TWICE';
  const docHeader = meta.docHeader || 'ACH DISBURSEMENT RECEIPT';
  const statusBad = meta.statusBad || 'TIMEOUT RETRY · EXECUTED';
  const scale = Math.min(1, (Math.min(W, H) / 1080) * 1.0);

  function drawSlip(cx, cy, rot, refNo, timeStr, isDupe) {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(rot);
    ctx.scale(scale, scale);

    const sw = 650, sh = 410;
    ctx.shadowColor = 'rgba(15, 23, 42, 0.22)'; ctx.shadowBlur = 54; ctx.shadowOffsetY = 26;
    const pg = ctx.createLinearGradient(-sw / 2, -sh / 2, sw / 2, sh / 2);
    pg.addColorStop(0, '#FFFFFF'); pg.addColorStop(1, '#F6F3EC');
    ctx.fillStyle = pg;
    ctx.beginPath(); ctx.roundRect(-sw / 2, -sh / 2, sw, sh, 7); ctx.fill();
    ctx.shadowColor = 'transparent';

    ctx.strokeStyle = 'rgba(15, 23, 42, 0.14)'; ctx.lineWidth = 1.5;
    ctx.strokeRect(-sw / 2 + 18, -sh / 2 + 18, sw - 36, sh - 36);

    ctx.fillStyle = '#0F172A'; ctx.font = '700 18px "IBM Plex Mono", monospace'; ctx.textAlign = 'left';
    ctx.fillText(docHeader, -sw / 2 + 44, -sh / 2 + 64);
    ctx.fillStyle = '#64748B'; ctx.textAlign = 'right';
    ctx.fillText(refNo, sw / 2 - 44, -sh / 2 + 64);

    ctx.strokeStyle = 'rgba(15, 23, 42, 0.12)';
    ctx.beginPath(); ctx.moveTo(-sw / 2 + 44, -sh / 2 + 86); ctx.lineTo(sw / 2 - 44, -sh / 2 + 86); ctx.stroke();

    ctx.fillStyle = '#0B0F17'; ctx.font = '700 88px "Playfair Display", Georgia, serif'; ctx.textAlign = 'left';
    ctx.fillText(amountStr, -sw / 2 + 44, -sh / 2 + 194);

    ctx.fillStyle = '#475569'; ctx.font = '600 19px "IBM Plex Mono", monospace';
    ctx.fillText('INVOICE  #INV-88412', -sw / 2 + 44, -sh / 2 + 260);
    ctx.fillText('SETTLED  ' + timeStr, -sw / 2 + 44, -sh / 2 + 294);
    ctx.fillStyle = isDupe ? '#B91C1C' : '#059669';
    ctx.fillText('STATUS   ' + (isDupe ? statusBad : 'EXECUTED · CONFIRMED'), -sw / 2 + 44, -sh / 2 + 334);

    ctx.fillStyle = 'rgba(15, 23, 42, 0.26)'; ctx.font = '500 15px "IBM Plex Mono", monospace';
    ctx.fillText('⑆ 021000021 ⑆   00498120441 ⑈   88412', -sw / 2 + 44, sh / 2 - 32);

    if (isDupe) {
      ctx.save();
      ctx.translate(148, 84); ctx.rotate(-0.18);
      ctx.strokeStyle = 'rgba(185, 28, 28, 0.90)'; ctx.lineWidth = 5.5;
      ctx.strokeRect(-142, -37, 284, 74);
      ctx.lineWidth = 2; ctx.strokeRect(-134, -29, 268, 58);
      ctx.fillStyle = 'rgba(185, 28, 28, 0.92)';
      ctx.font = '800 30px "Plus Jakarta Sans", sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText(stampText, 0, 1);
      ctx.restore();
    }
    ctx.restore();
  }

  const baseCy = H > W ? H * 0.56 : H * 0.57;
  drawSlip(W * 0.45, baseCy, -0.09, 'WIRE #001', '09:14:02.114 UTC', false);
  drawSlip(W * 0.55, baseCy + (H > W ? 165 : 115), 0.055, 'WIRE #002', '09:14:04.208 UTC', true);
}

// 2. BERLIN / AEROSPACE OBSIDIAN MONOLITH
function drawPalantirMonolith(ctx, W, H, meta) {
  const bg = ctx.createRadialGradient(W * 0.5, H * 0.54, 40, W * 0.5, H * 0.54, Math.max(W, H) * 0.78);
  bg.addColorStop(0, '#141820'); bg.addColorStop(0.55, '#090B0F'); bg.addColorStop(1, '#040507');
  ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);

  ctx.strokeStyle = 'rgba(255, 255, 255, 0.16)'; ctx.lineWidth = 1.2;
  for (const [mx, my] of [[56, 56], [W - 56, 56], [56, H - 56]]) {
    ctx.beginPath(); ctx.moveTo(mx - 12, my); ctx.lineTo(mx + 12, my); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(mx, my - 12); ctx.lineTo(mx, my + 12); ctx.stroke();
  }

  const cols = W > H ? 26 : 20;
  const rows = H > W ? 14 : 9;
  const padX = W > H ? 150 : 80;
  const y0 = H > W ? 425 : 340;
  const gridW = W - padX * 2;
  const gridH = H - y0 - (H > W ? 290 : 210);
  const cw = gridW / cols, ch = gridH / rows;
  const faultCol = 4, faultRow = 1;
  const faultSym = meta.faultSym || ',';
  const callout = meta.callout || 'LINE 12 ERROR · 400 ORDERS FROZEN · $95K/YR FINES';

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const idx = r * cols + c, fIdx = faultRow * cols + faultCol;
      const bx = padX + c * cw + 4, by = y0 + r * ch + 4, bw = cw - 8, bh = ch - 8;
      if (idx < fIdx) {
        const g = ctx.createLinearGradient(bx, by, bx, by + bh);
        g.addColorStop(0, '#E2E8F0'); g.addColorStop(1, '#94A3B8');
        ctx.fillStyle = g; ctx.beginPath(); ctx.roundRect(bx, by, bw, bh, 4); ctx.fill();
      } else if (idx === fIdx) {
        const halo = ctx.createRadialGradient(bx + bw / 2, by + bh / 2, 4, bx + bw / 2, by + bh / 2, 130);
        halo.addColorStop(0, 'rgba(255, 59, 48, 0.85)'); halo.addColorStop(0.45, 'rgba(255, 59, 48, 0.22)'); halo.addColorStop(1, 'rgba(255, 59, 48, 0)');
        ctx.fillStyle = halo; ctx.beginPath(); ctx.arc(bx + bw / 2, by + bh / 2, 130, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#FF3B30'; ctx.shadowColor = '#FF3B30'; ctx.shadowBlur = 22;
        ctx.beginPath(); ctx.roundRect(bx - 2, by - 2, bw + 4, bh + 4, 5); ctx.fill(); ctx.shadowBlur = 0;
        ctx.fillStyle = '#FFFFFF'; ctx.font = '800 20px "IBM Plex Mono", monospace';
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText(faultSym, bx + bw / 2, by + bh / 2 - 1);
      } else {
        ctx.fillStyle = 'rgba(148, 163, 184, 0.08)'; ctx.strokeStyle = 'rgba(148, 163, 184, 0.14)'; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.roundRect(bx, by, bw, bh, 4); ctx.fill(); ctx.stroke();
      }
    }
  }

  const fx = padX + faultCol * cw + cw / 2;
  const fy = y0 + faultRow * ch + ch;
  const lineEndY = y0 + gridH + 54;
  ctx.save();
  ctx.strokeStyle = 'rgba(255, 59, 48, 0.78)'; ctx.lineWidth = 1.8;
  ctx.beginPath(); ctx.moveTo(fx, fy + 8); ctx.lineTo(fx, lineEndY); ctx.stroke();
  ctx.fillStyle = '#FF3B30'; ctx.beginPath(); ctx.arc(fx, lineEndY, 4.5, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#F8FAFC'; ctx.font = '700 20px "IBM Plex Mono", monospace';
  ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
  ctx.fillText(callout, fx + 18, lineEndY);
  ctx.restore();
}

// 3. LONDON MAYFAIR PRIVATE BANK — British Racing Green Velvet + Sculptural 24K Gold Ingot
function drawMayfairRacingGreen(ctx, W, H, meta) {
  const bg = ctx.createRadialGradient(W * 0.5, H * 0.42, 60, W * 0.5, H * 0.55, Math.max(W, H) * 0.78);
  bg.addColorStop(0, '#103C2D'); bg.addColorStop(0.55, '#082118'); bg.addColorStop(1, '#04120D');
  ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);

  // European double champagne-gold gallery hairline frame
  ctx.strokeStyle = 'rgba(229, 198, 126, 0.28)'; ctx.lineWidth = 1.4;
  ctx.strokeRect(36, 36, W - 72, H - 72);
  ctx.strokeStyle = 'rgba(229, 198, 126, 0.12)'; ctx.lineWidth = 1;
  ctx.strokeRect(46, 46, W - 92, H - 92);

  const baseLine = H - (H > W ? 215 : 175);
  const colW = Math.min(280, W * 0.24);
  const gap = Math.min(180, W * 0.14);
  const lx = W * 0.5 - gap / 2 - colW;
  const rx = W * 0.5 + gap / 2;
  const totalH = H > W ? 590 : 420;

  ctx.strokeStyle = 'rgba(229, 198, 126, 0.35)'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(lx - 70, baseLine); ctx.lineTo(rx + colW + 70, baseLine); ctx.stroke();

  // Left heavy matte slate slab stack
  const slabs = H > W ? 22 : 16;
  for (let i = 0; i < slabs; i++) {
    const sy = baseLine - (i + 1) * (totalH / slabs);
    const sh = (totalH / slabs) - 4.5;
    const sg = ctx.createLinearGradient(lx, sy, lx + colW, sy);
    sg.addColorStop(0, '#334155'); sg.addColorStop(0.38, '#1E293B'); sg.addColorStop(1, '#0F172A');
    ctx.fillStyle = sg; ctx.fillRect(lx, sy, colW, sh);
    ctx.fillStyle = 'rgba(255,255,255,0.14)'; ctx.fillRect(lx, sy, colW, 1.4);
  }

  ctx.fillStyle = 'rgba(226, 232, 240, 0.72)'; ctx.font = '700 22px "IBM Plex Mono", monospace'; ctx.textAlign = 'center';
  ctx.fillText(meta.beforeTag || 'BEFORE', lx + colW / 2, baseLine + 40);
  ctx.fillStyle = '#FAF6EE'; ctx.font = '700 44px "Cormorant Garamond", Georgia, serif';
  ctx.fillText(meta.beforeVal || '110 HRS', lx + colW / 2, baseLine + 90);

  // Right radiant 24K brushed gold ingot under vertical museum beam
  const rh = 24;
  const beam = ctx.createLinearGradient(rx + colW / 2, baseLine - totalH, rx + colW / 2, baseLine);
  beam.addColorStop(0, 'rgba(245,196,81,0)'); beam.addColorStop(0.65, 'rgba(245,196,81,0.10)'); beam.addColorStop(1, 'rgba(245,196,81,0.34)');
  ctx.fillStyle = beam;
  ctx.beginPath();
  ctx.moveTo(rx + colW * 0.28, baseLine - totalH * 0.92);
  ctx.lineTo(rx + colW * 0.72, baseLine - totalH * 0.92);
  ctx.lineTo(rx + colW + 34, baseLine); ctx.lineTo(rx - 34, baseLine);
  ctx.closePath(); ctx.fill();

  const gg = ctx.createLinearGradient(rx, baseLine - rh, rx + colW, baseLine);
  gg.addColorStop(0, '#FFFBEB'); gg.addColorStop(0.35, '#F5C451'); gg.addColorStop(0.85, '#B47412'); gg.addColorStop(1, '#FDE68A');
  ctx.fillStyle = gg; ctx.shadowColor = 'rgba(245,196,81,0.75)'; ctx.shadowBlur = 32;
  ctx.beginPath(); ctx.roundRect(rx, baseLine - rh, colW, rh, 4); ctx.fill(); ctx.shadowBlur = 0;

  ctx.fillStyle = '#F5C451'; ctx.font = 'italic 700 66px "Cormorant Garamond", Georgia, serif';
  ctx.fillText(meta.goldHero || '15 SEC', rx + colW / 2, baseLine - 62);
  ctx.fillStyle = '#E5C67E'; ctx.font = '700 22px "IBM Plex Mono", monospace';
  ctx.fillText(meta.afterTag || 'AFTER · AUTOMATED', rx + colW / 2, baseLine + 40);
  ctx.fillStyle = '#FAF6EE'; ctx.font = '700 44px "Cormorant Garamond", Georgia, serif';
  ctx.fillText(meta.afterVal || '0 FINDINGS', rx + colW / 2, baseLine + 90);
}

// 4. ZURICH ARCHITECTURAL FLOW (Flow Style 1 Print Edition — Warm Swiss Linen + Anodized Hardware)
function drawSwissZurichFlow(ctx, W, H) {
  const bg = ctx.createRadialGradient(W * 0.5, H * 0.48, 40, W * 0.5, H * 0.52, Math.max(W, H) * 0.78);
  bg.addColorStop(0, '#FBF9F4'); bg.addColorStop(0.65, '#F3EFE6'); bg.addColorStop(1, '#E6DFD1');
  ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);

  ctx.strokeStyle = 'rgba(15, 23, 42, 0.048)'; ctx.lineWidth = 1;
  for (let x = 54; x < W; x += 54) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
  for (let y = 54; y < H; y += 54) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }

  const wallY = H * 0.50, wallH = Math.round(H * 0.048), gapW = Math.round(Math.min(W, H) * 0.072), cx = W * 0.5;
  const beam = ctx.createLinearGradient(cx, wallY, cx, wallY - H * 0.22);
  beam.addColorStop(0, 'rgba(245,196,81,0.45)'); beam.addColorStop(0.55, 'rgba(245,196,81,0.14)'); beam.addColorStop(1, 'rgba(245,196,81,0)');
  ctx.fillStyle = beam;
  ctx.beginPath();
  ctx.moveTo(cx - gapW * 0.5, wallY); ctx.lineTo(cx + gapW * 0.5, wallY);
  ctx.lineTo(cx + gapW * 3.8, wallY - H * 0.20); ctx.lineTo(cx - gapW * 3.8, wallY - H * 0.20);
  ctx.closePath(); ctx.fill();

  const wSh = ctx.createLinearGradient(0, wallY + wallH, 0, wallY + wallH + 65);
  wSh.addColorStop(0, 'rgba(13,16,23,0.22)'); wSh.addColorStop(1, 'rgba(13,16,23,0)');
  ctx.fillStyle = wSh; ctx.fillRect(0, wallY + wallH, W, 65);

  function slab(x, y, w, h) {
    const g = ctx.createLinearGradient(x, y, x, y + h);
    g.addColorStop(0, '#1B202C'); g.addColorStop(0.5, '#0F121A'); g.addColorStop(1, '#07090E');
    ctx.fillStyle = g; ctx.fillRect(x, y, w, h);
    ctx.fillStyle = 'rgba(255,255,255,0.16)'; ctx.fillRect(x, y, w, 2.5);
  }
  slab(0, wallY, cx - gapW / 2, wallH);
  slab(cx + gapW / 2, wallY, W - (cx + gapW / 2), wallH);
  ctx.fillStyle = '#D97706';
  ctx.fillRect(cx - gapW / 2 - 7, wallY - 3, 7, wallH + 6);
  ctx.fillRect(cx + gapW / 2, wallY - 3, 7, wallH + 6);

  function sphere(x, y, r, tC, mC, bC, sx = 1, sy = 1) {
    ctx.save(); ctx.translate(x, y); ctx.scale(sx, sy);
    ctx.fillStyle = 'rgba(15, 23, 42, 0.22)';
    ctx.beginPath(); ctx.ellipse(4, r * 0.28, r * 0.96, r * 0.88, 0, 0, Math.PI * 2); ctx.fill();
    const g = ctx.createRadialGradient(-r * 0.34, -r * 0.36, r * 0.06, 0, 0, r * 1.05);
    g.addColorStop(0, tC); g.addColorStop(0.32, mC); g.addColorStop(0.86, bC); g.addColorStop(1, '#080B12');
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,0.32)'; ctx.lineWidth = 1.4; ctx.stroke();
    ctx.restore();
  }

  const rng = mkRng(2104);
  const botR = Math.round(Math.min(W, H) * 0.041);
  const pts = [];
  for (let row = 0; row < 5; row++) {
    const count = 4 + row * 2;
    const spread = gapW * 1.15 + row * botR * 2.05;
    for (let i = 0; i < count; i++) {
      if (pts.length >= 31) break;
      const t = count === 1 ? 0 : (i / (count - 1)) * 2 - 1;
      const px = cx + t * spread * 0.72 + (rng() - 0.5) * 14;
      const py = wallY + wallH + botR * 1.08 + row * botR * 1.72 + Math.abs(t) * 24;
      if (py < H - 84 && px > 54 && px < W - 54) pts.push({ x: px, y: py });
    }
  }
  pts.sort((a, b) => b.y - a.y);
  for (const p of pts) sphere(p.x, p.y, botR, '#E2E8F0', '#3B82F6', '#1E3A8A');
  sphere(cx, wallY + wallH * 0.48, botR * 1.12, '#FFE4E6', '#E11D48', '#881337', 0.84, 1.18);
}

// 5. MILANESE VENETIAN OXBLOOD ATELIER — Deep Bordeaux + Platinum Laser + Blank Cotton Sheet + Gold Embers
function drawMilaneseOxblood(ctx, W, H, meta) {
  const bg = ctx.createRadialGradient(W * 0.5, H * 0.58, 50, W * 0.5, H * 0.55, Math.max(W, H) * 0.8);
  bg.addColorStop(0, '#460E18'); bg.addColorStop(0.52, '#26070D'); bg.addColorStop(1, '#120306');
  ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);

  // Fine Milanese champagne-brass framing rule
  ctx.strokeStyle = 'rgba(232, 207, 160, 0.24)'; ctx.lineWidth = 1.4;
  ctx.strokeRect(38, 38, W - 76, H - 76);

  const cx = W * 0.5;
  const pw = Math.min(430, W * 0.40);
  const ph = Math.min(545, H * 0.46);
  const py = H * 0.59;

  // Warm amber-gold furnace underglow beneath charred page bottom
  const glow = ctx.createRadialGradient(cx, py + ph * 0.48, 20, cx, py + ph * 0.48, pw * 0.95);
  glow.addColorStop(0, 'rgba(242, 184, 102, 0.52)'); glow.addColorStop(0.5, 'rgba(234, 88, 12, 0.20)'); glow.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = glow; ctx.beginPath(); ctx.arc(cx, py + ph * 0.48, pw * 0.95, 0, Math.PI * 2); ctx.fill();

  // Tactile Ivory Cotton Blank Page with jagged charred gold-ember bottom edge
  ctx.save();
  ctx.shadowColor = 'rgba(0,0,0,0.65)'; ctx.shadowBlur = 50; ctx.shadowOffsetY = 24;
  const pg = ctx.createLinearGradient(cx - pw / 2, py - ph / 2, cx + pw / 2, py + ph / 2);
  pg.addColorStop(0, '#FFFDF9'); pg.addColorStop(0.75, '#F5ECE0'); pg.addColorStop(1, '#D6B896');
  ctx.fillStyle = pg;
  ctx.beginPath();
  ctx.moveTo(cx - pw / 2 + 8, py - ph / 2);
  ctx.lineTo(cx + pw / 2 - 8, py - ph / 2);
  ctx.quadraticCurveTo(cx + pw / 2, py - ph / 2, cx + pw / 2, py - ph / 2 + 8);
  ctx.lineTo(cx + pw / 2, py + ph * 0.40);
  // Subtle jagged burn silhouette
  const pts = [0.5, 0.34, 0.18, 0.02, -0.15, -0.32, -0.5];
  const yj = [0.40, 0.46, 0.39, 0.44, 0.38, 0.45, 0.42];
  pts.forEach((px, i) => ctx.lineTo(cx + pw * px, py + ph * yj[i]));
  ctx.lineTo(cx - pw / 2, py - ph / 2 + 8);
  ctx.quadraticCurveTo(cx - pw / 2, py - ph / 2, cx - pw / 2 + 8, py - ph / 2);
  ctx.closePath(); ctx.fill(); ctx.shadowColor = 'transparent';

  // Glowing molten-gold ember line along the burned edge
  ctx.strokeStyle = '#F59E0B'; ctx.shadowColor = '#F97316'; ctx.shadowBlur = 18; ctx.lineWidth = 4;
  ctx.beginPath();
  pts.forEach((px, i) => i === 0 ? ctx.moveTo(cx + pw * px, py + ph * yj[i]) : ctx.lineTo(cx + pw * px, py + ph * yj[i]));
  ctx.stroke(); ctx.shadowBlur = 0;

  // Faint watermark text centered on blank sheet
  ctx.shadowOffsetY = 0; ctx.shadowBlur = 0; ctx.shadowColor = 'transparent';
  ctx.fillStyle = 'rgba(38, 7, 13, 0.22)'; ctx.font = '700 22px "IBM Plex Mono", monospace';
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText(meta.pageStamp || 'BLANK PAGE · $0.42', cx, py - ph * 0.14);
  ctx.restore();

  // Razor-sharp Platinum-Cyan Optical Scanner Beam bisecting the cotton sheet
  const scanY = py + ph * 0.02;
  const beamG = ctx.createLinearGradient(0, scanY - 46, 0, scanY + 46);
  beamG.addColorStop(0, 'rgba(186, 230, 253, 0)'); beamG.addColorStop(0.5, 'rgba(186, 230, 253, 0.34)'); beamG.addColorStop(1, 'rgba(186, 230, 253, 0)');
  ctx.fillStyle = beamG; ctx.fillRect(cx - pw * 0.68, scanY - 46, pw * 1.36, 92);
  ctx.strokeStyle = '#E0F2FE'; ctx.shadowColor = '#38BDF8'; ctx.shadowBlur = 24; ctx.lineWidth = 4;
  ctx.beginPath(); ctx.moveTo(cx - pw * 0.72, scanY); ctx.lineTo(cx + pw * 0.72, scanY); ctx.stroke(); ctx.shadowBlur = 0;

  // Floating gold-leaf sparks & ember flecks drifting downward
  const rng = mkRng(2299);
  for (let i = 0; i < 36; i++) {
    const ex = cx + (rng() - 0.5) * pw * 1.15;
    const ey = py + ph * 0.42 + rng() * 145;
    if (ey > H - 70) continue;
    ctx.fillStyle = i % 3 === 0 ? '#FDE68A' : (i % 3 === 1 ? '#F59E0B' : '#34D399');
    ctx.beginPath(); ctx.arc(ex, ey, 2.2 + rng() * 4.5, 0, Math.PI * 2); ctx.fill();
  }
}

// 6. PARISIAN LIMESTONE MONOGRAPH — Le Corbusier / Kinfolk Paris Architectural Arches + Brass Chronometer
function drawParisianIvory(ctx, W, H, meta) {
  const bg = ctx.createLinearGradient(0, 0, 0, H);
  bg.addColorStop(0, '#F7F1E7'); bg.addColorStop(0.75, '#EFE6D7'); bg.addColorStop(1, '#E2D4BE');
  ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);

  const floorY = H * 0.79;
  const cx = W * 0.5;
  const maxR = Math.min(W * 0.37, (floorY - H * 0.33));

  // Stepped Parisian architectural arches (warm terracotta -> muted ochre -> limestone cream)
  const archCols = ['#9C3B1E', '#B85231', '#D68957', '#E7C192', '#FAF6EE'];
  archCols.forEach((col, i) => {
    const r = maxR * (1 - i * 0.165);
    const stemH = maxR * 0.42;
    ctx.save();
    ctx.fillStyle = col;
    if (i === 0) { ctx.shadowColor = 'rgba(27, 20, 17, 0.16)'; ctx.shadowBlur = 42; ctx.shadowOffsetY = 14; }
    ctx.beginPath();
    ctx.moveTo(cx - r, floorY);
    ctx.lineTo(cx - r, floorY - stemH);
    ctx.arc(cx, floorY - stemH, r, Math.PI, 0, false);
    ctx.lineTo(cx + r, floorY);
    ctx.closePath(); ctx.fill();
    ctx.restore();
  });

  // Warm limestone floor plane + diagonal afternoon Paris sun shadow
  ctx.fillStyle = '#E5D8C3'; ctx.fillRect(0, floorY, W, H - floorY);
  ctx.fillStyle = 'rgba(27, 20, 17, 0.08)';
  ctx.beginPath(); ctx.moveTo(cx + maxR * 0.25, floorY); ctx.lineTo(W, floorY); ctx.lineTo(W, H); ctx.lineTo(cx + maxR * 0.78, H); ctx.closePath(); ctx.fill();

  // Hero precision European serif metric inside the sunlit limestone vault
  ctx.fillStyle = '#1B1411';
  ctx.font = 'italic 700 84px "Cormorant Garamond", Georgia, serif';
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText(meta.clayMetric || '48ms', cx, floorY - maxR * 0.48);

  // Polished obsidian & brushed brass sphere resting on the limestone floor
  const sr = 46;
  ctx.fillStyle = 'rgba(27, 20, 17, 0.22)';
  ctx.beginPath(); ctx.ellipse(cx + 8, floorY + 6, sr * 1.15, sr * 0.28, 0, 0, Math.PI * 2); ctx.fill();
  const sg = ctx.createRadialGradient(cx - 14, floorY - sr - 10, 4, cx, floorY - sr + 4, sr * 1.1);
  sg.addColorStop(0, '#57534E'); sg.addColorStop(0.35, '#1C1917'); sg.addColorStop(1, '#090807');
  ctx.fillStyle = sg; ctx.beginPath(); ctx.arc(cx, floorY - sr + 4, sr, 0, Math.PI * 2); ctx.fill();
}

// 7. STOCKHOLM NORDIC INDUSTRIAL — Cool Scandinavian Mist + Machined Aluminum Shockwave Rings
function drawNordicStockholm(ctx, W, H, meta) {
  const bg = ctx.createRadialGradient(W * 0.5, H * 0.52, 40, W * 0.5, H * 0.52, Math.max(W, H) * 0.8);
  bg.addColorStop(0, '#EBF0F4'); bg.addColorStop(0.6, '#DDE4E9'); bg.addColorStop(1, '#C9D3DC');
  ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);

  // Fine Scandinavian architectural hairlines
  ctx.strokeStyle = 'rgba(13, 23, 34, 0.08)'; ctx.lineWidth = 1;
  ctx.strokeRect(42, 42, W - 84, H - 84);

  const cx = W * 0.5, cy = H * 0.60;
  const maxR = Math.min(W, H) * 0.36;

  // Concentric machined Bang & Olufsen industrial shockwave rings (outer stormy crimson -> inner calm slate!)
  for (let i = 7; i >= 1; i--) {
    const r = (i / 7) * maxR;
    ctx.save();
    ctx.strokeStyle = i >= 5 ? 'rgba(217, 43, 43, ' + (0.16 + (i - 4) * 0.14).toFixed(2) + ')' : 'rgba(13, 23, 34, ' + (0.14 + (5 - i) * 0.09).toFixed(2) + ')';
    ctx.lineWidth = i === 7 ? 5 : (i === 1 ? 4 : 2.2);
    if (i === 6 || i === 4) ctx.setLineDash([14, 10]);
    ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.stroke();
    ctx.restore();
  }

  // Crosshair precision axes
  ctx.strokeStyle = 'rgba(13, 23, 34, 0.18)'; ctx.lineWidth = 1.2;
  ctx.beginPath(); ctx.moveTo(cx - maxR - 48, cy); ctx.lineTo(cx + maxR + 48, cy); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(cx, cy - maxR - 48); ctx.lineTo(cx, cy + maxR + 48); ctx.stroke();

  // Solid machined fjord-slate centerpiece disc with bold Nordic stat
  const coreR = maxR * 0.39;
  ctx.save();
  ctx.shadowColor = 'rgba(13, 23, 34, 0.25)'; ctx.shadowBlur = 38; ctx.shadowOffsetY = 16;
  const cg = ctx.createRadialGradient(cx - coreR * 0.3, cy - coreR * 0.3, 10, cx, cy, coreR);
  cg.addColorStop(0, '#233447'); cg.addColorStop(1, '#0B131E');
  ctx.fillStyle = cg; ctx.beginPath(); ctx.arc(cx, cy, coreR, 0, Math.PI * 2); ctx.fill();
  ctx.shadowColor = 'transparent';
  ctx.strokeStyle = '#D92B2B'; ctx.lineWidth = 4;
  ctx.beginPath(); ctx.arc(cx, cy, coreR - 10, -Math.PI * 0.75, Math.PI * 0.35); ctx.stroke();

  ctx.fillStyle = '#F8FAFC';
  ctx.font = '800 ' + Math.round(coreR * 0.68) + 'px "Plus Jakarta Sans", sans-serif';
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText(meta.nordicHero || '11x', cx, cy + 4);
  ctx.restore();
}

// 8. GENEVA HAUTE HORLOGERIE NIGHT WATCH — Midnight Sapphire + Swiss Chronograph Ring + 1 Emerald Aperture
function drawGenevaChronograph(ctx, W, H, meta) {
  const bg = ctx.createRadialGradient(W * 0.5, H * 0.56, 40, W * 0.5, H * 0.56, Math.max(W, H) * 0.78);
  bg.addColorStop(0, '#101B33'); bg.addColorStop(0.55, '#070C18'); bg.addColorStop(1, '#03050A');
  ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);

  // Subtle Swiss watchmaker concentric bezel rings
  const cx = W * 0.5, cy = H * 0.60;
  const dialR = Math.min(W, H) * 0.38;
  ctx.save();
  ctx.strokeStyle = 'rgba(203, 213, 225, 0.14)'; ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.arc(cx, cy, dialR + 28, 0, Math.PI * 2); ctx.stroke();
  ctx.beginPath(); ctx.arc(cx, cy, dialR - 12, 0, Math.PI * 2); ctx.stroke();
  // 60 fine platinum minute ticks around bezel
  for (let i = 0; i < 60; i++) {
    const a = (i / 60) * Math.PI * 2;
    const major = i % 5 === 0;
    const r1 = dialR + (major ? 2 : 10), r2 = dialR + 24;
    ctx.strokeStyle = major ? 'rgba(245, 196, 81, 0.42)' : 'rgba(203, 213, 225, 0.18)';
    ctx.lineWidth = major ? 2 : 1;
    ctx.beginPath();
    ctx.moveTo(cx + Math.cos(a) * r1, cy + Math.sin(a) * r1);
    ctx.lineTo(cx + Math.cos(a) * r2, cy + Math.sin(a) * r2);
    ctx.stroke();
  }
  ctx.restore();

  // 84 structured 3:xx alarm ticks inside the dark dial — 83 muted crimson noise, 1 illuminated emerald REAL CRASH aperture!
  const rng = mkRng(2608);
  const cols = W > H ? 12 : 7;
  const rows = W > H ? 7 : 12;
  const spanW = dialR * (W > H ? 1.72 : 1.50);
  const spanH = dialR * (W > H ? 1.15 : 1.54);
  const x0 = cx - spanW / 2, y0 = cy - spanH / 2;
  const cw = spanW / cols, ch = spanH / rows;
  const sigR = Math.floor(rows * 0.58), sigC = Math.floor(cols * 0.62);

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x = x0 + (c + 0.5) * cw, y = y0 + (r + 0.5) * ch;
      if (r === sigR && c === sigC) {
        const g = ctx.createRadialGradient(x, y, 4, x, y, 74);
        g.addColorStop(0, 'rgba(52,211,153,0.62)'); g.addColorStop(1, 'rgba(52,211,153,0)');
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, 74, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#06261E'; ctx.strokeStyle = '#34D399'; ctx.lineWidth = 2.5;
        ctx.beginPath(); ctx.roundRect(x - cw * 0.46, y - ch * 0.40, cw * 0.92, ch * 0.80, 7); ctx.fill(); ctx.stroke();
        ctx.fillStyle = '#ECFDF5'; ctx.font = '800 17px "Plus Jakarta Sans", sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText(meta.signalTop || 'REAL', x, y - 9);
        ctx.fillStyle = '#34D399'; ctx.fillText(meta.signalBot || 'CRASH', x, y + 11);
      } else {
        const m = String(Math.floor(rng() * 59)).padStart(2, '0');
        const op = 0.28 + rng() * 0.46;
        ctx.fillStyle = 'rgba(255, 69, 88, ' + op.toFixed(2) + ')';
        ctx.font = '600 22px "IBM Plex Mono", monospace'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText('3:' + m, x, y);
      }
    }
  }
}

function drawEditorialArt(canvas, mode, W, H, meta) {
  const ctx = canvas.getContext('2d');
  const dpr = 2;
  canvas.width = W * dpr;
  canvas.height = H * dpr;
  ctx.scale(dpr, dpr);
  const map = {
    wall_street_wire_slip: drawWallStreetWireSlip,
    palantir_monolith: drawPalantirMonolith,
    mayfair_racing_green: drawMayfairRacingGreen,
    swiss_zurich_flow: drawSwissZurichFlow,
    milanese_oxblood_atelier: drawMilaneseOxblood,
    parisian_ivory_monograph: drawParisianIvory,
    nordic_stockholm_slate: drawNordicStockholm,
    geneva_chronograph_noir: drawGenevaChronograph,
  };
  (map[mode] || drawSwissZurichFlow)(ctx, W, H, meta || {});
}
`;

function buildPosterHtml(spec, plat) {
  const fJakarta = b64File(path.join(ASSETS_DIR, 'PlusJakartaSans.woff2'));
  const fMono = b64File(path.join(ASSETS_DIR, 'IBMPlexMono.woff2'));
  const fPlayB = b64File(path.join(ASSETS_DIR, 'PlayfairDisplay-Bold.woff2'));
  const fPlayBI = b64File(path.join(ASSETS_DIR, 'PlayfairDisplay-BoldItalic.woff2'));
  const fCormB = b64File(path.join(ASSETS_DIR, 'CormorantGaramond-Bold.woff2'));
  const fCormBI = b64File(path.join(ASSETS_DIR, 'CormorantGaramond-BoldItalic.woff2'));
  const fInstR = b64File(path.join(ASSETS_DIR, 'InstrumentSerif-Regular.woff2'));
  const fInstI = b64File(path.join(ASSETS_DIR, 'InstrumentSerif-Italic.woff2'));

  const mode = THEME_PALETTES[spec.visual_archetype]
    ? spec.visual_archetype
    : (THEME_PALETTES[spec.editorial_mode] ? spec.editorial_mode : 'swiss_zurich_flow');
  const theme = THEME_PALETTES[mode] || THEME_PALETTES.swiss_zurich_flow;
  const headline = spec.poster_headline || spec.viral_headline || spec.headline || '32 Workers Added.\n9x Slower.';
  const accentWord = spec.poster_accent_word || '';
  const accentHex = spec.poster_accent_hex || theme.accentDefault;
  const artMeta = spec.art_meta || {};

  let baseSize = 90, topPad = 82, sidePad = 68, logoH = 30, maxW = '90%';
  if (plat.layout === 'square') {
    baseSize = 84; topPad = 68; sidePad = 64;
  } else if (plat.layout === 'landscape32') {
    baseSize = 84; topPad = 62; sidePad = 82; maxW = '78%';
  } else if (plat.layout === 'landscape169') {
    baseSize = 86; topPad = 56; sidePad = 92; maxW = '76%';
  }
  const fontSize = Math.round(baseSize * (theme.headScale || 1.0));

  const logoSvg = buildLogoSvg(logoH, theme.logoInk, theme.logoCut);
  const grainUri = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.82' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.032'/%3E%3C/svg%3E";

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  @font-face { font-family: 'Plus Jakarta Sans'; src: url(data:font/woff2;base64,${fJakarta}) format('woff2'); font-weight: 500 800; }
  @font-face { font-family: 'IBM Plex Mono'; src: url(data:font/woff2;base64,${fMono}) format('woff2'); font-weight: 500 700; }
  @font-face { font-family: 'Playfair Display'; src: url(data:font/woff2;base64,${fPlayB}) format('woff2'); font-weight: 700; font-style: normal; }
  @font-face { font-family: 'Playfair Display'; src: url(data:font/woff2;base64,${fPlayBI}) format('woff2'); font-weight: 700; font-style: italic; }
  @font-face { font-family: 'Cormorant Garamond'; src: url(data:font/woff2;base64,${fCormB}) format('woff2'); font-weight: 700; font-style: normal; }
  @font-face { font-family: 'Cormorant Garamond'; src: url(data:font/woff2;base64,${fCormBI}) format('woff2'); font-weight: 700; font-style: italic; }
  @font-face { font-family: 'Instrument Serif'; src: url(data:font/woff2;base64,${fInstR}) format('woff2'); font-weight: 400; font-style: normal; }
  @font-face { font-family: 'Instrument Serif'; src: url(data:font/woff2;base64,${fInstI}) format('woff2'); font-weight: 400; font-style: italic; }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  html, body {
    width: ${plat.width}px; height: ${plat.height}px;
    overflow: hidden; background: ${theme.bg}; position: relative;
    -webkit-font-smoothing: antialiased; text-rendering: geometricPrecision;
  }
  canvas#art { position: absolute; inset: 0; width: ${plat.width}px; height: ${plat.height}px; }
  .grain {
    position: absolute; inset: 0; background-image: url("${grainUri}");
    background-repeat: repeat; pointer-events: none; z-index: 4;
  }
  .headline-wrap {
    position: absolute; top: ${topPad}px; left: ${sidePad}px; right: ${sidePad}px;
    display: flex; justify-content: center; z-index: 6;
  }
  h1 {
    font-family: ${theme.headFont};
    font-weight: ${theme.headWeight}; font-size: ${fontSize}px; line-height: 1.03;
    letter-spacing: ${theme.headTracking}; color: ${theme.ink};
    max-width: ${maxW}; text-align: center; text-shadow: ${theme.shadowText};
  }
  .logo-wrap {
    position: absolute; bottom: ${Math.round(sidePad * 0.72)}px; right: ${Math.round(sidePad * 0.85)}px;
    opacity: 0.90; z-index: 7;
  }
</style>
</head>
<body>
  <canvas id="art"></canvas>
  <div class="grain"></div>
  <div class="headline-wrap"><h1>${formatHeadline(headline, accentWord, accentHex, theme)}</h1></div>
  <div class="logo-wrap">${logoSvg}</div>
  <script>
    ${ART_SCRIPT}
    document.fonts.ready.then(() => {
      drawEditorialArt(document.getElementById('art'), ${JSON.stringify(mode)}, ${plat.width}, ${plat.height}, ${JSON.stringify(artMeta)});
      window.__RENDER_READY__ = true;
    });
  </script>
</body>
</html>`;
}

async function main() {
  const specPath = process.argv[2];
  const outDir = process.argv[3];
  const onlyPlat = process.argv[4] || '';
  if (!specPath || !outDir) {
    console.error('Usage: node render_case_study.js <spec.json> <out_dir> [single_platform_name]');
    process.exit(1);
  }
  fs.mkdirSync(outDir, { recursive: true });
  const spec = JSON.parse(fs.readFileSync(specPath, 'utf8'));

  const browser = await chromium.launch({
    executablePath: detectChrome(),
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
  });
  try {
    const targets = onlyPlat ? PLATFORMS.filter((p) => p.name === onlyPlat) : PLATFORMS;
    for (const plat of targets) {
      const page = await browser.newPage({ viewport: { width: plat.width, height: plat.height }, deviceScaleFactor: 1 });
      await page.setContent(buildPosterHtml(spec, plat), { waitUntil: 'load' });
      await page.waitForFunction(() => window.__RENDER_READY__ === true);
      const outPath = path.join(outDir, plat.name);
      await page.screenshot({ path: outPath, type: 'png' });
      await page.close();
      console.log(`[Olven 5.0 Transatlantic OK] ${outPath} (${plat.width}x${plat.height})`);
    }
  } finally {
    await browser.close();
  }

  const mode = THEME_PALETTES[spec.visual_archetype]
    ? spec.visual_archetype
    : (THEME_PALETTES[spec.editorial_mode] ? spec.editorial_mode : 'swiss_zurich_flow');
  const meta = {
    engine: 'olven-5.0-transatlantic-european-atelier',
    visual_archetype: mode,
    scene_key: mode,
    poster_headline: spec.poster_headline || spec.viral_headline || spec.headline,
  };
  fs.writeFileSync(path.join(outDir, 'visual-metadata.json'), JSON.stringify(meta, null, 2) + '\n', 'utf8');
}

main().catch((err) => { console.error(err); process.exit(1); });
