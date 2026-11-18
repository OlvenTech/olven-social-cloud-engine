const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const PLAYWRIGHT_PATH = fs.existsSync(path.join(__dirname, 'node_modules/playwright-core'))
  ? path.join(__dirname, 'node_modules/playwright-core')
  : '/home/antigravity/.npm/_npx/e41f203b7505f1fb/node_modules/playwright-core';
const { chromium } = require(PLAYWRIGHT_PATH);

const THEME_PALETTES = {
  editorial_light_blueprint: {
    bg: '#F5F2EB', text: '#0F172A', sub: '#334155', panel: '#FFFFFF', border: '#0F172A',
    accent: '#1D4ED8', afterPanel: '#F0FDF4', afterBorder: '#059669', nodeBg: '#F1F5F9', nodeText: '#0F172A'
  },
  split_latency_waterfall: {
    bg: '#070A12', text: '#F8FAFC', sub: '#94A3B8', panel: '#0D1322', border: '#1E293B',
    accent: '#F59E0B', afterPanel: '#081514', afterBorder: '#10B981', nodeBg: '#111827', nodeText: '#FDE68A'
  },
  security_policy_shield_matrix: {
    bg: '#06120E', text: '#ECFDF5', sub: '#A7F3D0', panel: '#141115', border: '#EF4444',
    accent: '#34D399', afterPanel: '#0A211A', afterBorder: '#10B981', nodeBg: '#0B261E', nodeText: '#6EE7B7'
  },
  circuit_breaker_state_machine: {
    bg: '#EEF2F6', text: '#0F172A', sub: '#334155', panel: '#FFFFFF', border: '#CBD5E1',
    accent: '#0B132B', afterPanel: '#F0FDFA', afterBorder: '#0D9488', nodeBg: '#CCFBF1', nodeText: '#115E59'
  },
  revenue_ledger_reconciliation: {
    bg: '#090C22', text: '#F8FAFC', sub: '#CBD5E1', panel: '#131836', border: '#4F46E5',
    accent: '#818CF8', afterPanel: '#FFFFFF', afterBorder: '#4F46E5', nodeBg: '#EEF2FF', nodeText: '#1E293B'
  },
  cdc_hash_diff_funnel: {
    bg: '#121110', text: '#FAF8F5', sub: '#D6D3D1', panel: '#1C1917', border: '#292524',
    accent: '#FB923C', afterPanel: '#141B24', afterBorder: '#38BDF8', nodeBg: '#1E293B', nodeText: '#E0F2FE'
  }
};

async function renderWalkthroughVideo(specPath, outDir) {
  const spec = JSON.parse(fs.readFileSync(specPath, 'utf8'));
  const arch = spec.visual_archetype || 'editorial_light_blueprint';
  const pal = THEME_PALETTES[arch] || THEME_PALETTES.editorial_light_blueprint;
  const isWhiteAfter = arch === 'revenue_ledger_reconciliation';

  const framesDir = path.join(outDir, '_video_frames');
  fs.mkdirSync(framesDir, { recursive: true });

  const browser = await chromium.launch({
    executablePath: '/usr/bin/chromium',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const context = await browser.newContext({ viewport: { width: 1080, height: 1350 }, deviceScaleFactor: 1 });
  const page = await context.newPage();

  const steps = [0, 1, 2, 3, 4];
  for (let s = 0; s < steps.length; s++) {
    const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    width: 1080px; height: 1350px;
    background: ${pal.bg}; color: ${pal.text};
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    padding: 52px; display: flex; flex-direction: column; justify-content: space-between;
  }
  .top-bar { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid ${pal.border}; padding-bottom: 18px; }
  .brand { font-size: 19px; font-weight: 800; letter-spacing: 0.08em; color: ${pal.accent}; }
  .doc-id { font-family: monospace; font-size: 15px; color: ${pal.sub}; font-weight: 600; }
  .eyebrow { font-family: monospace; font-size: 15px; color: ${pal.accent}; text-transform: uppercase; letter-spacing: 0.1em; margin-top: 20px; font-weight: 700; }
  h1 { font-size: 38px; line-height: 1.15; font-weight: 800; color: ${pal.text}; margin-top: 10px; }
  .subhead { font-size: 19px; line-height: 1.42; color: ${pal.sub}; margin-top: 10px; }
  .panel {
    background: ${pal.panel}; border: 2px solid ${pal.border}; border-radius: 14px; padding: 24px; margin-top: 20px;
    opacity: 0.18;
  }
  .panel.active { opacity: 1.0; }
  .panel.after.active { border-color: ${pal.afterBorder}; background: ${pal.afterPanel}; color: ${isWhiteAfter ? '#0F172A' : pal.text}; }
  .panel-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px; }
  .panel-title { font-size: 21px; font-weight: 800; }
  .badge { font-family: monospace; font-size: 14px; font-weight: 700; padding: 5px 12px; border-radius: 6px; }
  .badge.bad { background: rgba(239,68,68,0.16); color: #EF4444; border: 1px solid rgba(239,68,68,0.4); }
  .badge.good { background: rgba(16,185,129,0.18); color: #059669; border: 1px solid rgba(16,185,129,0.4); }
  .nodes { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin-bottom: 14px; }
  .node { background: ${pal.nodeBg}; border: 1px solid ${pal.afterBorder}; border-radius: 8px; padding: 10px; text-align: center; font-family: monospace; font-size: 14px; color: ${pal.nodeText}; font-weight: 600; }
  ul { padding-left: 22px; font-size: 17px; line-height: 1.45; }
  li { margin-bottom: 7px; }
  .metrics { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; margin-top: 20px; opacity: ${s >= 3 ? '1' : '0.15'}; }
  .metric { background: ${pal.panel}; border: 1.5px solid ${pal.border}; border-radius: 12px; padding: 16px; }
  .m-label { font-family: monospace; font-size: 12.5px; color: ${pal.sub}; }
  .m-val { font-size: 28px; font-weight: 800; color: ${pal.accent}; margin: 4px 0; }
  .m-sub { font-size: 13px; color: #059669; font-weight: 600; }
  .footer { display: flex; justify-content: space-between; align-items: center; border-top: 2px solid ${pal.border}; padding-top: 16px; margin-top: 18px; color: ${pal.sub}; font-size: 16px; font-family: monospace; font-weight: 600; }
</style>
</head>
<body>
  <div>
    <div class="top-bar">
      <div class="brand">OLVEN TECH · PRODUCTION ARCHITECTURE</div>
      <div class="doc-id">${spec.doc_id} · STEP ${s + 1}/5</div>
    </div>
    <div class="eyebrow">${spec.eyebrow}</div>
    <h1>${spec.headline}</h1>
    <div class="subhead">${spec.subhead}</div>

    <div class="panel ${s >= 1 ? 'active' : ''}">
      <div class="panel-header">
        <div class="panel-title">${spec.before_title}</div>
        <div class="badge bad">${spec.before_badge}</div>
      </div>
      <div class="nodes">${spec.before_nodes.map(n => `<div class="node">${n}</div>`).join('')}</div>
      <ul>${spec.before_points.map(p => `<li>${p}</li>`).join('')}</ul>
    </div>

    <div class="panel after ${s >= 2 ? 'active' : ''}">
      <div class="panel-header">
        <div class="panel-title">${spec.after_title}</div>
        <div class="badge good">${spec.after_badge}</div>
      </div>
      <div class="nodes">${spec.after_nodes.map(n => `<div class="node">${n}</div>`).join('')}</div>
      <ul>${spec.after_points.map(p => `<li>${p}</li>`).join('')}</ul>
    </div>

    <div class="metrics">
      ${spec.metrics.map(m => `<div class="metric"><div class="m-label">${m.label}</div><div class="m-val">${m.value}</div><div class="m-sub">${m.sub}</div></div>`).join('')}
    </div>
  </div>
  <div class="footer">
    <div>olventech.com · Archetype: ${arch}</div>
    <div>contact@olventech.com</div>
  </div>
</body>
</html>`;
    await page.setContent(html, { waitUntil: 'load' });
    const frameFile = path.join(framesDir, `step_${String(s).padStart(2, '0')}.png`);
    await page.screenshot({ path: frameFile, type: 'png' });
  }
  await browser.close();

  const mp4Out = path.join(outDir, 'walkthrough-video.mp4');
  execFileSync('ffmpeg', [
    '-y',
    '-framerate', '0.4',
    '-i', path.join(framesDir, 'step_%02d.png'),
    '-c:v', 'libx264',
    '-r', '30',
    '-pix_fmt', 'yuv420p',
    '-movflags', '+faststart',
    mp4Out
  ], { stdio: 'ignore' });

  fs.rmSync(framesDir, { recursive: true, force: true });
  console.log(`Rendered video: ${mp4Out} [archetype=${arch}]`);
}

const [,, specArg, outArg] = process.argv;
if (!specArg || !outArg) {
  console.error('Usage: node render_video.js <spec.json> <outDir>');
  process.exit(1);
}
renderWalkthroughVideo(specArg, outArg).catch(err => {
  console.error(err);
  process.exit(1);
});
