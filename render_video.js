#!/usr/bin/env node
/**
 * Olven Tech — Silicon Valley True-Motion 9:16 (1080x1920) Reels Engine
 *
 * 1. Invokes generate_reel_audio.py to synthesize Microsoft Neural AI voiceover (edge-tts)
 *    + sidechain-ducked 118 BPM Silicon Valley ambient synth soundtrack + transition whooshes
 *    + word-level caption timestamps (reel_timeline.json).
 * 2. Drives a deterministic 24fps animation engine inside Chromium (spring-eased kinetic text,
 *    drifting aurora mesh, animated red failure packet, drawing emerald SVG architecture beam,
 *    live drawing telemetry crash curve, count-up hero stat, live audio waveform bars, and
 *    word-highlighted burnt-in captions synced to the narrator's voice).
 * 3. Pipes frames directly into ffmpeg -> Meta Reels-compliant H.264 High + 48kHz stereo AAC MP4.
 */
const fs = require('fs');
const path = require('path');
const { execFileSync, spawn } = require('child_process');

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
  `<svg $1 style="height:${h}px; width:auto; display:block; border-radius:6px;">`
);

const ARCHETYPE_ACCENTS = {
  editorial_light_blueprint: { primary: '#3B82F6', secondary: '#10B981', glow1: 'rgba(59,130,246,0.38)', glow2: 'rgba(16,185,129,0.24)' },
  security_policy_shield_matrix: { primary: '#10B981', secondary: '#34D399', glow1: 'rgba(16,185,129,0.34)', glow2: 'rgba(244,63,94,0.24)' },
  circuit_breaker_state_machine: { primary: '#14B8A6', secondary: '#FDE047', glow1: 'rgba(20,184,166,0.36)', glow2: 'rgba(99,102,241,0.24)' },
  split_latency_waterfall: { primary: '#F59E0B', secondary: '#10B981', glow1: 'rgba(139,92,246,0.36)', glow2: 'rgba(245,158,11,0.26)' },
  revenue_ledger_reconciliation: { primary: '#818CF8', secondary: '#34D399', glow1: 'rgba(99,102,241,0.38)', glow2: 'rgba(16,185,129,0.26)' },
  cdc_hash_diff_funnel: { primary: '#FB923C', secondary: '#38BDF8', glow1: 'rgba(234,88,12,0.36)', glow2: 'rgba(56,189,248,0.24)' },
};

function stripHtml(s) {
  return String(s || '').replace(/<[^>]+>/g, '').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&').trim();
}

function buildMotionHtml(spec, timeline, accent) {
  const fJakarta = b64Font('PlusJakartaSans.woff2');
  const fInter = b64Font('Inter.woff2');
  const fMono = b64Font('IBMPlexMono.woff2');
  const m0 = spec.metrics[0];
  const m1 = spec.metrics[1];

  const payloadJson = JSON.stringify({
    spec: {
      headline: spec.headline,
      eyebrow: spec.eyebrow.split('·')[0].trim(),
      before_title: spec.before_title.replace(/^Before:\s*/i, ''),
      before_badge: spec.before_badge,
      before_nodes: spec.before_nodes,
      before_point: stripHtml(spec.before_points[0]),
      after_title: spec.after_title.replace(/^After:\s*/i, ''),
      after_badge: spec.after_badge,
      after_nodes: spec.after_nodes,
      after_point: stripHtml(spec.after_points[0]),
      m0,
      m1,
      m2: spec.metrics[2] || m0,
      m3: spec.metrics[3] || m1,
    },
    timeline,
    accent,
  }).replace(/</g, '\\u003c');

  return `<!DOCTYPE html><html><head><meta charset="utf-8"><style>
    @font-face { font-family: 'Plus Jakarta Sans'; src: url(data:font/woff2;base64,${fJakarta}) format('woff2'); font-weight: 500 800; }
    @font-face { font-family: 'Inter'; src: url(data:font/woff2;base64,${fInter}) format('woff2'); font-weight: 400 700; }
    @font-face { font-family: 'IBM Plex Mono'; src: url(data:font/woff2;base64,${fMono}) format('woff2'); font-weight: 400 700; }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      width: 1080px; height: 1920px; overflow: hidden;
      background: #070A12; color: #F8FAFC;
      font-family: 'Inter', sans-serif;
      position: relative;
    }
    .aurora {
      position: absolute; inset: -160px; pointer-events: none;
      background:
        radial-gradient(circle at 22% 18%, ${accent.glow1}, transparent 42%),
        radial-gradient(circle at 80% 78%, ${accent.glow2}, transparent 46%),
        radial-gradient(circle at 50% 48%, rgba(244,63,94,0.12), transparent 45%);
      will-change: transform;
    }
    .dot-grid {
      position: absolute; inset: -60px; pointer-events: none;
      background-image: radial-gradient(rgba(148,163,184,0.18) 1.5px, transparent 1.5px);
      background-size: 40px 40px;
    }
    /* Safe Zone Frame */
    .stage {
      position: absolute; inset: 0;
      padding: 150px 104px 290px 64px;
      display: flex; flex-direction: column; justify-content: space-between;
      z-index: 2;
    }
    .top-chrome {
      display: flex; flex-direction: column; gap: 22px;
    }
    .prog-bar {
      width: 100%; height: 6px; border-radius: 999px;
      background: rgba(255,255,255,0.12); overflow: hidden;
    }
    .prog-fill {
      height: 100%; width: 0%; border-radius: 999px;
      background: linear-gradient(90deg, ${accent.primary}, ${accent.secondary});
    }
    .brand-row {
      display: flex; justify-content: space-between; align-items: center;
    }
    .scene-chip {
      font-family: 'IBM Plex Mono', monospace; font-size: 16px; font-weight: 700;
      letter-spacing: 0.08em; padding: 8px 18px; border-radius: 999px;
      background: rgba(255,255,255,0.08); border: 1.5px solid rgba(255,255,255,0.22);
      color: #E2E8F0;
    }

    /* Scene Containers */
    .scene-viewport {
      position: relative; flex: 1; margin: 28px 0 22px 0;
    }
    .scene {
      position: absolute; inset: 0;
      display: flex; flex-direction: column; justify-content: center; gap: 28px;
      opacity: 0; pointer-events: none;
    }
    .scene.active { opacity: 1; }

    /* Beat 1: Hook Cover */
    .alert-pill {
      align-self: flex-start;
      display: inline-flex; align-items: center; gap: 12px;
      background: rgba(244,63,94,0.18); border: 2px solid #F43F5E;
      color: #FDA4AF; border-radius: 12px; padding: 12px 22px;
      font-family: 'IBM Plex Mono', monospace; font-size: 21px; font-weight: 800;
      letter-spacing: 0.04em;
    }
    .pulse-dot {
      width: 14px; height: 14px; border-radius: 50%; background: #F43F5E;
      box-shadow: 0 0 18px #F43F5E;
    }
    .hook-title {
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-size: 62px; line-height: 1.07; font-weight: 800;
      letter-spacing: -0.035em; color: #FFFFFF;
    }
    .hook-hero-card {
      background: rgba(15,23,42,0.78); border: 2px solid ${accent.primary};
      border-radius: 26px; padding: 38px 40px;
      box-shadow: 0 30px 70px rgba(0,0,0,0.45);
      display: flex; justify-content: space-between; align-items: center;
    }
    .hh-lbl { font-family: 'IBM Plex Mono', monospace; font-size: 16px; color: #94A3B8; font-weight: 700; }
    .hh-val {
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-size: 92px; font-weight: 800; line-height: 0.96; letter-spacing: -0.04em;
      color: #FFFFFF; margin-top: 8px;
    }
    .hh-sub { font-family: 'IBM Plex Mono', monospace; font-size: 20px; font-weight: 700; color: ${accent.secondary}; margin-top: 10px; }

    /* Beat 2: Failure Slack/Pipeline Incident */
    .sec-title {
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-size: 52px; line-height: 1.08; font-weight: 800; letter-spacing: -0.03em;
    }
    .glass-card {
      background: rgba(15, 20, 32, 0.88); border: 2px solid rgba(255,255,255,0.14);
      border-radius: 24px; padding: 30px 32px;
      box-shadow: 0 28px 65px rgba(0,0,0,0.5);
    }
    .glass-card.bad { border-color: rgba(244,63,94,0.55); }
    .glass-card.good { border-color: rgba(16,185,129,0.55); }
    .node-item {
      display: flex; align-items: center; gap: 20px;
      background: rgba(255,255,255,0.04); border: 1.5px solid rgba(255,255,255,0.12);
      border-radius: 16px; padding: 20px 24px; margin-bottom: 14px;
      position: relative;
    }
    .node-item.bad-hit { background: rgba(244,63,94,0.22); border-color: #F43F5E; }
    .node-item.good-lit { background: rgba(16,185,129,0.18); border-color: #10B981; }
    .n-badge {
      width: 46px; height: 46px; border-radius: 12px; flex-shrink: 0;
      display: flex; align-items: center; justify-content: center;
      font-family: 'IBM Plex Mono', monospace; font-size: 20px; font-weight: 800; color: #FFFFFF;
    }
    .n-text { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 27px; font-weight: 700; color: #F8FAFC; }
    .incident-callout {
      margin-top: 18px; background: rgba(244,63,94,0.14); border-left: 5px solid #F43F5E;
      border-radius: 0 14px 14px 0; padding: 20px 24px;
      font-size: 24px; line-height: 1.42; color: #FFE4E6; font-weight: 500;
    }

    /* Beat 4: Live Telemetry Cliff + Count-up */
    .big-stat-row {
      display: grid; grid-template-columns: 1fr 1fr; gap: 20px;
    }
    .stat-tile {
      background: rgba(15,23,42,0.85); border: 2px solid rgba(255,255,255,0.14);
      border-radius: 22px; padding: 28px;
    }
    .stat-tile.hi { border-color: ${accent.primary}; background: rgba(15,23,42,0.96); }
    .st-lbl { font-family: 'IBM Plex Mono', monospace; font-size: 15px; color: #94A3B8; font-weight: 700; }
    .st-val { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 58px; font-weight: 800; color: #FFFFFF; margin: 10px 0; }
    .st-sub { font-size: 19px; color: #34D399; font-weight: 600; }

    /* Beat 5: Outro */
    .outro-box {
      background: rgba(15,23,42,0.86); border: 2px solid ${accent.primary};
      border-radius: 28px; padding: 48px 44px;
      display: flex; flex-direction: column; gap: 24px;
      box-shadow: 0 36px 80px rgba(0,0,0,0.55);
    }

    /* Synced Kinetic Caption Pill (Bottom Safe Zone) */
    .bottom-hud {
      display: flex; flex-direction: column; gap: 18px; align-items: center;
    }
    .caption-pill {
      min-height: 92px; width: 100%;
      background: rgba(5, 8, 16, 0.86); border: 2px solid rgba(255,255,255,0.18);
      border-radius: 20px; padding: 18px 28px;
      display: flex; flex-wrap: wrap; justify-content: center; align-items: center; gap: 12px;
      box-shadow: 0 18px 40px rgba(0,0,0,0.5);
    }
    .cap-word {
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-size: 36px; font-weight: 800; color: rgba(248,250,252,0.68);
      letter-spacing: -0.02em; transition: none;
    }
    .cap-word.spoken { color: #FFFFFF; }
    .cap-word.active {
      color: #0B0F19; background: #FEF08A;
      padding: 2px 12px; border-radius: 10px;
      transform: scale(1.06);
    }
    .wave-bar-row {
      width: 100%; display: flex; justify-content: space-between; align-items: center;
      font-family: 'IBM Plex Mono', monospace; font-size: 16px; font-weight: 700; color: #94A3B8;
    }
    .eq {
      display: flex; align-items: flex-end; gap: 5px; height: 26px;
    }
    .eq-bar {
      width: 5px; border-radius: 999px; background: ${accent.primary}; height: 8px;
    }
  </style></head><body>
    <div class="aurora" id="aurora"></div>
    <div class="dot-grid" id="dotgrid"></div>

    <div class="stage">
      <div class="top-chrome">
        <div class="prog-bar"><div class="prog-fill" id="prog"></div></div>
        <div class="brand-row">
          <div>${logoForDarkBg(38)}</div>
          <div class="scene-chip" id="sceneChip">01 / HOOK</div>
        </div>
      </div>

      <div class="scene-viewport">
        <!-- SCENE 0: HOOK COVER (Frame 0 = Full-Impact IG Grid Thumbnail) -->
        <div class="scene active" id="s0">
          <div class="alert-pill" id="s0Alert"><span class="pulse-dot" id="s0Dot"></span><span>${spec.before_badge}</span></div>
          <div class="hook-title" id="s0Title">${spec.headline}</div>
          <div class="hook-hero-card" id="s0Card">
            <div>
              <div class="hh-lbl">${m0.label}</div>
              <div class="hh-val">${m0.value}</div>
              <div class="hh-sub">▲ ${m0.sub}</div>
            </div>
            <div style="text-align:right;">
              <div class="hh-lbl">${m1.label}</div>
              <div style="font-family:'Plus Jakarta Sans',sans-serif;font-size:48px;font-weight:800;color:#34D399;margin-top:8px;">${m1.value}</div>
            </div>
          </div>
        </div>

        <!-- SCENE 1: FAILURE INCIDENT TOPOLOGY -->
        <div class="scene" id="s1">
          <div class="alert-pill"><span class="pulse-dot"></span><span>WHY IT BREAKS IN PROD</span></div>
          <div class="sec-title" id="s1Title">${spec.before_title.replace(/^Before:\s*/i, '')}</div>
          <div class="glass-card bad">
            ${spec.before_nodes.map((n, idx) => `
              <div class="node-item" id="bNode${idx}">
                <div class="n-badge" style="background:#DC2626;">0${idx + 1}</div>
                <div class="n-text">${n}</div>
              </div>
            `).join('')}
            <div class="incident-callout" id="s1Callout">${stripHtml(spec.before_points[0])}</div>
          </div>
        </div>

        <!-- SCENE 2: HARDENED PRODUCTION ARCHITECTURE -->
        <div class="scene" id="s2">
          <div class="alert-pill" style="background:rgba(16,185,129,0.18);border-color:#10B981;color:#6EE7B7;">
            <span class="pulse-dot" style="background:#10B981;box-shadow:0 0 18px #10B981;"></span>
            <span>THE PRODUCTION FIX · ${spec.after_badge}</span>
          </div>
          <div class="sec-title">${spec.after_title.replace(/^After:\s*/i, '')}</div>
          <div class="glass-card good">
            ${spec.after_nodes.map((n, idx) => `
              <div class="node-item" id="aNode${idx}">
                <div class="n-badge" style="background:#059669;">✓</div>
                <div class="n-text">${n}</div>
              </div>
            `).join('')}
            <div class="incident-callout" style="background:rgba(16,185,129,0.14);border-left-color:#10B981;color:#D1FAE5;" id="s2Callout">
              ${stripHtml(spec.after_points[0])}
            </div>
          </div>
        </div>

        <!-- SCENE 3: LIVE TELEMETRY CLIFF + COUNT-UP PROOF -->
        <div class="scene" id="s3">
          <div class="alert-pill" style="background:rgba(59,130,246,0.18);border-color:${accent.primary};color:#E0F2FE;">
            <span>● VERIFIED PRODUCTION TELEMETRY</span>
          </div>
          <div class="sec-title">Measured Impact</div>
          <div class="glass-card" style="padding:26px;">
            <svg viewBox="0 0 900 320" style="width:100%;height:300px;">
              <line x1="20" y1="60" x2="880" y2="60" stroke="#1E293B" stroke-width="2" stroke-dasharray="6 6"/>
              <line x1="20" y1="160" x2="880" y2="160" stroke="#1E293B" stroke-width="2" stroke-dasharray="6 6"/>
              <line x1="20" y1="265" x2="880" y2="265" stroke="#334155" stroke-width="2"/>
              <path id="redCurve" d="M20,105 L100,72 L180,118 L260,52 L340,86 L420,58" fill="none" stroke="#F43F5E" stroke-width="7" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="600" stroke-dashoffset="600"/>
              <line id="deployLine" x1="420" y1="20" x2="420" y2="270" stroke="#FEF08A" stroke-width="3.5" stroke-dasharray="8 6" opacity="0"/>
              <rect id="deployTag" x="436" y="22" width="195" height="36" rx="8" fill="#FEF08A" opacity="0"/>
              <text id="deployTxt" x="533" y="46" text-anchor="middle" font-family="IBM Plex Mono, monospace" font-size="16" font-weight="700" fill="#0F172A" opacity="0">▼ FIX DEPLOYED</text>
              <path id="greenCurve" d="M420,58 L475,244 L580,248 L700,245 L800,248 L880,246" fill="none" stroke="#10B981" stroke-width="7" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="700" stroke-dashoffset="700"/>
            </svg>
          </div>
          <div class="big-stat-row">
            <div class="stat-tile hi">
              <div class="st-lbl">${m0.label}</div>
              <div class="st-val" id="m0Val" style="color:${accent.primary};">${m0.value}</div>
              <div class="st-sub">${m0.sub}</div>
            </div>
            <div class="stat-tile">
              <div class="st-lbl">${m1.label}</div>
              <div class="st-val" style="color:#34D399;">${m1.value}</div>
              <div class="st-sub">${m1.sub}</div>
            </div>
          </div>
        </div>

        <!-- SCENE 4: SILICON VALLEY OUTRO -->
        <div class="scene" id="s4">
          <div class="outro-box" id="s4Box">
            <div>${logoForDarkBg(56)}</div>
            <div class="sec-title" style="font-size:56px;">Production Systems Architecture.</div>
            <div style="font-size:26px;line-height:1.45;color:#CBD5E1;">
              ${spec.headline} — verified at <strong style="color:${accent.secondary};">${m0.value}</strong>.
            </div>
            <div style="padding-top:18px;border-top:1.5px solid rgba(255,255,255,0.16);display:flex;flex-direction:column;gap:8px;">
              <div style="font-family:'Plus Jakarta Sans',sans-serif;font-size:40px;font-weight:800;color:#FFFFFF;">contact@olventech.com</div>
              <div style="font-family:'IBM Plex Mono',monospace;font-size:20px;color:#94A3B8;">olventech.com · Follow @olventech</div>
            </div>
          </div>
        </div>
      </div>

      <div class="bottom-hud">
        <div class="caption-pill" id="captionBox"></div>
        <div class="wave-bar-row">
          <div class="eq" id="eq">
            ${Array.from({ length: 12 }, (_, i) => `<div class="eq-bar" id="eq${i}"></div>`).join('')}
          </div>
          <div>@OLVENTECH · PRODUCTION ENGINEERING</div>
        </div>
      </div>
    </div>

    <script>
      const DATA = ${payloadJson};
      const beats = DATA.timeline.beats;
      const cues = DATA.timeline.captions;
      const totalDur = DATA.timeline.total_duration;
      const chips = ['01 / HOOK', '02 / PROD FAILURE', '03 / ARCHITECTURE FIX', '04 / TELEMETRY PROOF', '05 / OLVEN TECH'];

      const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
      const easeOut = (x) => 1 - Math.pow(1 - clamp(x), 3);

      // Parse numeric hero stat for smooth count-up on Scene 3
      const m0Raw = String(DATA.spec.m0.value);
      const numMatch = m0Raw.match(/(-?\\d+(?:\\.\\d+)?)/);
      const m0Num = numMatch ? parseFloat(numMatch[1]) : null;
      const m0Decimals = numMatch && numMatch[1].includes('.') ? numMatch[1].split('.')[1].length : 0;

      window.__renderFrame = function(t) {
        // 1) Progress bar & ambient motion
        document.getElementById('prog').style.width = (clamp(t / totalDur) * 100).toFixed(2) + '%';
        const dx = Math.sin(t * 0.6) * 28;
        const dy = Math.cos(t * 0.45) * 22;
        document.getElementById('aurora').style.transform = 'translate(' + dx.toFixed(1) + 'px,' + dy.toFixed(1) + 'px) scale(' + (1 + Math.sin(t * 0.5) * 0.03).toFixed(3) + ')';
        document.getElementById('dotgrid').style.transform = 'translateY(' + (-(t * 14) % 40).toFixed(1) + 'px)';

        // 2) Active beat
        let bi = beats.length - 1;
        for (let i = 0; i < beats.length; i++) {
          if (t < beats[i].end) { bi = i; break; }
        }
        const beat = beats[bi];
        const lt = Math.max(0, t - beat.start);
        const bp = clamp(lt / Math.max(beat.duration, 0.1));
        document.getElementById('sceneChip').textContent = chips[bi] || 'OLVEN TECH';

        for (let i = 0; i < 5; i++) {
          const el = document.getElementById('s' + i);
          if (i === bi) {
            el.classList.add('active');
            // Frame 0 stays 100% opaque for crisp Instagram profile grid cover!
            const fadeIn = (bi === 0 && t < 0.05) ? 1 : easeOut(lt / 0.25);
            const yOff = (bi === 0 && t < 0.05) ? 0 : (1 - fadeIn) * 34;
            el.style.opacity = fadeIn.toFixed(3);
            el.style.transform = 'translateY(' + yOff.toFixed(1) + 'px)';
          } else {
            el.classList.remove('active');
            el.style.opacity = '0';
          }
        }

        // Scene-specific micro-animations
        if (bi === 0) {
          const pulse = 0.65 + 0.35 * Math.sin(t * 8.0);
          document.getElementById('s0Dot').style.opacity = pulse.toFixed(2);
          const sc = 1.0 + bp * 0.025;
          document.getElementById('s0Card').style.transform = 'scale(' + sc.toFixed(4) + ')';
        } else if (bi === 1) {
          // Stagger failure nodes + highlight crashing node sequentially
          const activeNode = Math.min(3, Math.floor(bp * 4.5));
          for (let k = 0; k < 4; k++) {
            const nd = document.getElementById('bNode' + k);
            const pNode = easeOut((lt - k * 0.14) / 0.3);
            nd.style.opacity = pNode.toFixed(3);
            nd.style.transform = 'translateX(' + ((1 - pNode) * -32).toFixed(1) + 'px)';
            nd.classList.toggle('bad-hit', k === activeNode);
          }
        } else if (bi === 2) {
          // Stagger hardened architecture nodes turning emerald sequentially
          const litUpTo = Math.floor(bp * 4.8);
          for (let k = 0; k < 4; k++) {
            const nd = document.getElementById('aNode' + k);
            const pNode = easeOut((lt - k * 0.16) / 0.3);
            nd.style.opacity = pNode.toFixed(3);
            nd.style.transform = 'translateX(' + ((1 - pNode) * 36).toFixed(1) + 'px)';
            nd.classList.toggle('good-lit', k <= litUpTo);
          }
        } else if (bi === 3) {
          // Draw red failure curve (0..0.38), flash FIX DEPLOYED (0.38..0.48), drop emerald curve (0.45..0.85)
          const rProg = easeOut(bp / 0.38);
          document.getElementById('redCurve').setAttribute('stroke-dashoffset', (600 * (1 - rProg)).toFixed(1));
          const depOp = easeOut((bp - 0.35) / 0.12);
          document.getElementById('deployLine').setAttribute('opacity', depOp.toFixed(2));
          document.getElementById('deployTag').setAttribute('opacity', depOp.toFixed(2));
          document.getElementById('deployTxt').setAttribute('opacity', depOp.toFixed(2));
          const gProg = easeOut((bp - 0.42) / 0.42);
          document.getElementById('greenCurve').setAttribute('stroke-dashoffset', (700 * (1 - gProg)).toFixed(1));

          if (m0Num !== null) {
            const cur = m0Num * easeOut(bp / 0.65);
            const formatted = m0Decimals > 0 ? cur.toFixed(m0Decimals) : Math.round(cur).toString();
            document.getElementById('m0Val').textContent = m0Raw.replace(numMatch[1], formatted);
          }
        } else if (bi === 4) {
          const sc = 0.96 + 0.04 * easeOut(lt / 0.45);
          document.getElementById('s4Box').style.transform = 'scale(' + sc.toFixed(4) + ')';
        }

        // 3) Synced word-highlighted captions
        const capBox = document.getElementById('captionBox');
        let activeCue = null;
        for (let i = 0; i < cues.length; i++) {
          if (t >= cues[i].start - 0.08 && t <= cues[i].end + 0.22) {
            activeCue = cues[i];
            break;
          }
        }
        if (activeCue) {
          capBox.style.opacity = '1';
          let actIdx = -1;
          for (let wi = 0; wi < activeCue.words.length; wi++) {
            const w = activeCue.words[wi];
            if (t >= w.start && t < w.end) { actIdx = wi; break; }
          }
          capBox.innerHTML = activeCue.words.map((w, wi) => {
            const isAct = wi === actIdx;
            const isSpk = actIdx >= 0 ? wi < actIdx : t >= w.end;
            const cls = isAct ? 'cap-word active' : (isSpk ? 'cap-word spoken' : 'cap-word');
            return '<span class="' + cls + '">' + w.word + '</span>';
          }).join('');
        } else {
          capBox.style.opacity = '0.35';
          capBox.innerHTML = '<span class="cap-word spoken" style="font-size:24px;">' + DATA.spec.eyebrow + '</span>';
        }

        // 4) Live animated equalizer bars synced to 118 BPM + speech activity
        const speaking = activeCue ? 1.0 : 0.4;
        for (let k = 0; k < 12; k++) {
          const h = 6 + speaking * 19 * (0.5 + 0.5 * Math.sin(t * (9 + k * 1.3) + k * 0.9));
          document.getElementById('eq' + k).style.height = h.toFixed(1) + 'px';
        }
      };
      window.__renderFrame(0);
    </script>
  </body></html>`;
}

async function renderWalkthroughVideo(specPath, outDir) {
  const spec = JSON.parse(fs.readFileSync(specPath, 'utf8'));
  const arch = spec.visual_archetype || 'split_latency_waterfall';
  const accent = ARCHETYPE_ACCENTS[arch] || ARCHETYPE_ACCENTS.split_latency_waterfall;

  fs.mkdirSync(outDir, { recursive: true });

  // 1) Synthesize Neural AI voiceover + Silicon Valley soundtrack + word-level timeline
  execFileSync('python3', [path.join(__dirname, 'generate_reel_audio.py'), specPath, outDir], {
    stdio: 'inherit'
  });

  const timeline = JSON.parse(fs.readFileSync(path.join(outDir, 'reel_timeline.json'), 'utf8'));
  const audioFile = path.join(outDir, 'reel_audio.m4a');
  const totalDur = timeline.total_duration;
  const fps = 24;
  const totalFrames = Math.ceil(totalDur * fps);

  const launchOpts = { args: ['--no-sandbox', '--disable-setuid-sandbox'] };
  const chromeBin = ['/usr/bin/chromium', '/usr/bin/chromium-browser', '/usr/bin/google-chrome'].find((p) => fs.existsSync(p));
  if (chromeBin) launchOpts.executablePath = chromeBin;

  const browser = await chromium.launch(launchOpts);
  const context = await browser.newContext({
    viewport: { width: 1080, height: 1920 },
    deviceScaleFactor: 1
  });
  const page = await context.newPage();
  await page.setContent(buildMotionHtml(spec, timeline, accent), { waitUntil: 'load' });
  await page.evaluate(() => document.fonts.ready);

  const mp4Out = path.join(outDir, 'walkthrough-video.mp4');
  const ff = spawn('ffmpeg', [
    '-y',
    '-loglevel', 'error',
    '-f', 'image2pipe',
    '-vcodec', 'mjpeg',
    '-framerate', String(fps),
    '-i', 'pipe:0',
    '-i', audioFile,
    '-map', '0:v:0',
    '-map', '1:a:0',
    '-c:v', 'libx264',
    '-profile:v', 'high',
    '-level', '4.1',
    '-pix_fmt', 'yuv420p',
    '-r', String(fps),
    '-g', String(fps * 2),
    '-crf', '21',
    '-preset', 'fast',
    '-c:a', 'copy',
    '-shortest',
    '-movflags', '+faststart',
    mp4Out
  ], { stdio: ['pipe', 'inherit', 'inherit'] });

  const ffDone = new Promise((resolve, reject) => {
    ff.on('error', reject);
    ff.on('close', (code) => (code === 0 ? resolve() : reject(new Error(`ffmpeg exited ${code}`))));
  });

  for (let f = 0; f < totalFrames; f++) {
    const t = f / fps;
    await page.evaluate((sec) => window.__renderFrame(sec), t);
    const buf = await page.screenshot({ type: 'jpeg', quality: 92 });
    if (!ff.stdin.write(buf)) {
      await new Promise((r) => ff.stdin.once('drain', r));
    }
  }
  ff.stdin.end();
  await ffDone;
  await browser.close();

  // Cleanup intermediate audio/timeline files
  fs.rmSync(audioFile, { force: true });
  fs.rmSync(path.join(outDir, 'reel_timeline.json'), { force: true });

  const stat = fs.statSync(mp4Out);
  console.log(
    `Rendered Silicon Valley 9:16 Reel: ${mp4Out} [archetype=${arch}, fps=${fps}, dur=${totalDur.toFixed(2)}s, voice=${timeline.has_voice}, size=${(stat.size / 1024).toFixed(1)}KB]`
  );
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
