#!/usr/bin/env python3
"""
Olven Tech — GitHub Actions 1-Hour-Before-Peak (T-1h) Cloud Runner.
Executes live B2B Engineering R&D, renders 2x Retina bespoke visuals across 6 archetypes via Playwright,
optionally renders a 9:16 (1080x1920) 30fps studio motion Reel on alternating video waves,
enforces the 3-Layer Anti-AI & Visual Uniqueness Blocker with self-healing remediation,
and writes the verified package to ./live_out/ for Make.com Scenario 8619522 to stage into
'Olven_12AM_Make_Queue'.
"""
import datetime
import json
import os
import shutil
import subprocess
import sys
from pathlib import Path

from generate_and_stage_day import (
    BASE_DIR,
    auto_remediate_captions,
    build_spec_for_day,
    run_cmd,
)
from rd_research_engine import write_research_dossier

STATE_FILE = BASE_DIR / "state" / "wave_cursor.json"
HISTORY_DIR = BASE_DIR / "history"
LIVE_OUT_DIR = BASE_DIR / "live_out"
REPO_RAW_BASE = "https://raw.githubusercontent.com/OlvenTech/olven-social-cloud-engine/main/live_out"
REPO_CDN_BASE = "https://cdn.jsdelivr.net/gh/OlvenTech/olven-social-cloud-engine@main/live_out"


def load_cursor():
    if STATE_FILE.exists():
        data = json.loads(STATE_FILE.read_text(encoding="utf-8"))
        data.setdefault("media_type", "image")
        return data
    return {"day_num": 10, "slot": "Evening", "seq_index": 14, "media_type": "image"}


def save_next_cursor(day_num: int, slot: str, seq_index: int, current_media_type: str):
    STATE_FILE.parent.mkdir(parents=True, exist_ok=True)
    next_media_type = "image" if current_media_type.lower() == "video" else "video"
    if slot.lower() == "morning":
        next_cursor = {
            "day_num": day_num,
            "slot": "Evening",
            "seq_index": seq_index + 1,
            "media_type": next_media_type,
        }
    else:
        next_cursor = {
            "day_num": day_num + 1,
            "slot": "Morning",
            "seq_index": seq_index + 1,
            "media_type": next_media_type,
        }
    STATE_FILE.write_text(json.dumps(next_cursor, indent=2) + "\n", encoding="utf-8")


def main():
    # Guard against delayed GitHub Actions schedule crons double-firing right after a wave was already generated
    event_name = os.environ.get("GITHUB_EVENT_NAME", "")
    manifest_file = LIVE_OUT_DIR / "manifest.json"
    if event_name == "schedule" and manifest_file.exists():
        try:
            prev = json.loads(manifest_file.read_text(encoding="utf-8"))
            gen_at = datetime.datetime.strptime(prev["generated_at_utc"], "%Y-%m-%dT%H:%M:%SZ").replace(
                tzinfo=datetime.timezone.utc
            )
            age_mins = (datetime.datetime.now(datetime.timezone.utc) - gen_at).total_seconds() / 60.0
            if age_mins < 90:
                print(
                    f"[SKIP] Wave '{prev.get('day_label')}' was already generated {age_mins:.1f} mins ago "
                    f"({prev.get('generated_at_utc')}). Skipping duplicate schedule trigger."
                )
                sys.exit(0)
        except Exception as exc:
            print(f"[WARN] Could not parse previous manifest timestamp: {exc}")

    cursor = load_cursor()
    day_num = int(sys.argv[1]) if len(sys.argv) > 1 and sys.argv[1].strip() else cursor["day_num"]
    slot = sys.argv[2].strip().capitalize() if len(sys.argv) > 2 and sys.argv[2].strip() else cursor["slot"]
    media_type = (
        sys.argv[3].strip().lower()
        if len(sys.argv) > 3 and sys.argv[3].strip()
        else cursor.get("media_type", "image").lower()
    )
    if media_type not in ("video", "image"):
        media_type = "image"

    seq_index = (day_num - 7) * 2 + (0 if slot == "Morning" else 1) + 7

    day_label = f"Day {day_num} ({slot})"
    wave_dir = HISTORY_DIR / f"day{day_num}_{slot.lower()}"
    wave_dir.mkdir(parents=True, exist_ok=True)
    LIVE_OUT_DIR.mkdir(parents=True, exist_ok=True)

    print(
        f"[1/6] Running Live T-1h B2B Engineering R&D for {day_label} "
        f"(seq_index={seq_index}, media_type={media_type})..."
    )
    spec, signals = build_spec_for_day(day_num, seq_index=seq_index, slot=slot)
    write_research_dossier(f"{day_num} ({slot})", spec, signals, wave_dir)

    spec_path = wave_dir / "spec.json"
    spec_path.write_text(json.dumps(spec, indent=2), encoding="utf-8")

    print(f"[2/6] Rendering 2x Retina bespoke visuals [archetype={spec.get('visual_archetype')}] via Playwright...")
    run_cmd(["node", str(BASE_DIR / "render_case_study.js"), str(spec_path), str(wave_dir)])

    print(f"[3/6] Writing platform captions for {day_label}...")
    for plat, txt in spec["captions"].items():
        (wave_dir / f"{plat}-caption.txt").write_text(txt.strip() + "\n", encoding="utf-8")

    print(f"[4/6] Running 3-Layer Anti-AI, Anti-Generic & Visual Uniqueness Blocker on {wave_dir}...")
    max_attempts = 6
    for attempt in range(1, max_attempts + 1):
        res = subprocess.run(
            ["python3", str(BASE_DIR / "lint_human_quality.py"), str(wave_dir)],
            stdout=subprocess.PIPE,
            stderr=subprocess.STDOUT,
            text=True,
        )
        if res.returncode == 0:
            print(f"  [PASS on attempt {attempt}/{max_attempts}] {res.stdout.strip()}")
            break
        print(f"  [Attempt {attempt}/{max_attempts} BLOCKED — auto-remediating & re-rendering]:\n{res.stdout.strip()}")
        auto_remediate_captions(wave_dir, spec_path, spec, res.stdout, attempt)
    else:
        raise RuntimeError(f"3-Layer Quality Gate blocked {day_label} after {max_attempts} self-healing attempts.")

    if media_type == "video":
        print(f"[5/6] Rendering 9:16 (1080x1920) 30fps ArtCraft EffectCraft 3D Cinema Reel [seq={seq_index}, archetype={spec.get('visual_archetype')}]...")
        os.environ["OLVEN_SEQ_INDEX"] = str(seq_index)
        run_cmd(["node", str(BASE_DIR / "render_video.js"), str(spec_path), str(wave_dir)])
    else:
        print(f"[5/6] Image wave ({day_label}) — skipping Reel render (next wave will auto-alternate to video).")

    write_research_dossier(f"{day_num} ({slot})", spec, signals, wave_dir)
    spec_path.unlink(missing_ok=True)

    print(f"[6/6] Staging verified {day_label} ({media_type}) package into ./live_out/ and advancing cursor...")
    stage_files = [
        "linkedin.png", "facebook.png", "instagram.png", "x.png",
        "linkedin-caption.txt", "facebook-caption.txt", "instagram-caption.txt",
        "x-caption.txt", "threads-caption.txt", "research-dossier.md", "visual-metadata.json"
    ]
    if media_type == "video":
        stage_files.append("walkthrough-video.mp4")

    for fname in stage_files:
        src = wave_dir / fname
        if src.exists():
            shutil.copy2(src, LIVE_OUT_DIR / fname)

    now_dt = datetime.datetime.now(datetime.timezone.utc)
    now_utc = now_dt.strftime("%Y-%m-%dT%H:%M:%SZ")
    v_tag = f"d{day_num}_{slot.lower()}_{int(now_dt.timestamp())}"
    hn_top = (signals.get("hn_frontpage") or [{"title": "Live B2B Systems Architecture"}])[0].get("title", "")
    video_url = f"{REPO_CDN_BASE}/walkthrough-video.mp4?v={v_tag}" if media_type == "video" else ""
    instagram_img_url = f"{REPO_RAW_BASE}/instagram.png?v={v_tag}"
    instagram_media_url = video_url if media_type == "video" else instagram_img_url

    manifest = {
        "day_label": day_label,
        "day_num": day_num,
        "slot": slot,
        "seq_index": seq_index,
        "media_type": media_type,
        "generated_at_utc": now_utc,
        "visual_archetype": spec.get("visual_archetype"),
        "hn_top_signal": hn_top,
        "linkedin_img_url": f"{REPO_RAW_BASE}/linkedin.png?v={v_tag}",
        "facebook_img_url": f"{REPO_RAW_BASE}/facebook.png?v={v_tag}",
        "instagram_img_url": instagram_img_url,
        "instagram_media_url": instagram_media_url,
        "video_url": video_url,
        "x_img_url": f"{REPO_RAW_BASE}/x.png?v={v_tag}",
        "threads_img_url": instagram_img_url,
        "linkedin_caption": (wave_dir / "linkedin-caption.txt").read_text(encoding="utf-8").strip(),
        "facebook_caption": (wave_dir / "facebook-caption.txt").read_text(encoding="utf-8").strip(),
        "instagram_caption": (wave_dir / "instagram-caption.txt").read_text(encoding="utf-8").strip(),
        "x_caption": (wave_dir / "x-caption.txt").read_text(encoding="utf-8").strip(),
        "threads_caption": (wave_dir / "threads-caption.txt").read_text(encoding="utf-8").strip(),
        "research_dossier": (wave_dir / "research-dossier.md").read_text(encoding="utf-8").strip(),
    }
    (LIVE_OUT_DIR / "manifest.json").write_text(json.dumps(manifest, indent=2) + "\n", encoding="utf-8")

    # Keep only the 3 most recent history folders so repo stays lightweight while enforcing 2-post lookback
    all_hist = sorted(HISTORY_DIR.glob("day*"), key=lambda p: p.stat().st_mtime)
    if len(all_hist) > 3:
        for old_dir in all_hist[:-3]:
            shutil.rmtree(old_dir, ignore_errors=True)

    save_next_cursor(day_num, slot, seq_index, media_type)
    print(
        f"SUCCESS: {day_label} [media_type={media_type}, archetype={spec.get('visual_archetype')}] "
        f"rendered, verified, and staged to ./live_out/manifest.json"
    )


if __name__ == "__main__":
    main()
