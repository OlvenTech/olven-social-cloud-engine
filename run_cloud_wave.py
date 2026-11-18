#!/usr/bin/env python3
"""
Olven Tech — GitHub Actions 1-Hour-Before-Peak (T-1h) Cloud Runner.
Executes live B2B Engineering R&D, renders 2x Retina bespoke visuals across 6 archetypes via Playwright,
enforces the 3-Layer Anti-AI & Visual Uniqueness Blocker with self-healing remediation,
and writes the verified package to ./live_out/ for Make.com Scenario 8619522 to materialize into
Google Drive 'Posts By Day' and 'Olven_12AM_Make_Queue'.
"""
import datetime
import json
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


def load_cursor():
    if STATE_FILE.exists():
        return json.loads(STATE_FILE.read_text(encoding="utf-8"))
    return {"day_num": 8, "slot": "Evening", "seq_index": 10}


def save_next_cursor(day_num: int, slot: str, seq_index: int):
    STATE_FILE.parent.mkdir(parents=True, exist_ok=True)
    if slot.lower() == "morning":
        next_cursor = {"day_num": day_num, "slot": "Evening", "seq_index": seq_index + 1}
    else:
        next_cursor = {"day_num": day_num + 1, "slot": "Morning", "seq_index": seq_index + 1}
    STATE_FILE.write_text(json.dumps(next_cursor, indent=2) + "\n", encoding="utf-8")


def main():
    cursor = load_cursor()
    day_num = int(sys.argv[1]) if len(sys.argv) > 1 and sys.argv[1].strip() else cursor["day_num"]
    slot = sys.argv[2].strip().capitalize() if len(sys.argv) > 2 and sys.argv[2].strip() else cursor["slot"]
    seq_index = (day_num - 7) * 2 + (0 if slot == "Morning" else 1) + 7

    day_label = f"Day {day_num} ({slot})"
    wave_dir = HISTORY_DIR / f"day{day_num}_{slot.lower()}"
    wave_dir.mkdir(parents=True, exist_ok=True)
    LIVE_OUT_DIR.mkdir(parents=True, exist_ok=True)

    print(f"[1/5] Running Live T-1h B2B Engineering R&D for {day_label} (seq_index={seq_index})...")
    spec, signals = build_spec_for_day(day_num, seq_index=seq_index, slot=slot)
    write_research_dossier(f"{day_num} ({slot})", spec, signals, wave_dir)

    spec_path = wave_dir / "spec.json"
    spec_path.write_text(json.dumps(spec, indent=2), encoding="utf-8")

    print(f"[2/5] Rendering 2x Retina bespoke visuals [archetype={spec.get('visual_archetype')}] via Playwright...")
    run_cmd(["node", str(BASE_DIR / "render_case_study.js"), str(spec_path), str(wave_dir)])

    print(f"[3/5] Writing platform captions for {day_label}...")
    for plat, txt in spec["captions"].items():
        (wave_dir / f"{plat}-caption.txt").write_text(txt.strip() + "\n", encoding="utf-8")

    print(f"[4/5] Running 3-Layer Anti-AI, Anti-Generic & Visual Uniqueness Blocker on {wave_dir}...")
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

    write_research_dossier(f"{day_num} ({slot})", spec, signals, wave_dir)
    spec_path.unlink(missing_ok=True)

    print(f"[5/5] Staging verified {day_label} package into ./live_out/ and advancing cursor...")
    for fname in [
        "linkedin.png", "facebook.png", "instagram.png", "x.png",
        "linkedin-caption.txt", "facebook-caption.txt", "instagram-caption.txt",
        "x-caption.txt", "threads-caption.txt", "research-dossier.md", "visual-metadata.json"
    ]:
        src = wave_dir / fname
        if src.exists():
            shutil.copy2(src, LIVE_OUT_DIR / fname)

    now_utc = datetime.datetime.now(datetime.timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
    hn_top = (signals.get("hn_frontpage") or [{"title": "Live B2B Systems Architecture"}])[0].get("title", "")
    manifest = {
        "day_label": day_label,
        "day_num": day_num,
        "slot": slot,
        "seq_index": seq_index,
        "generated_at_utc": now_utc,
        "visual_archetype": spec.get("visual_archetype"),
        "hn_top_signal": hn_top,
        "linkedin_img_url": f"{REPO_RAW_BASE}/linkedin.png",
        "facebook_img_url": f"{REPO_RAW_BASE}/facebook.png",
        "instagram_img_url": f"{REPO_RAW_BASE}/instagram.png",
        "x_img_url": f"{REPO_RAW_BASE}/x.png",
        "linkedin_caption": (wave_dir / "linkedin-caption.txt").read_text(encoding="utf-8").strip(),
        "facebook_caption": (wave_dir / "facebook-caption.txt").read_text(encoding="utf-8").strip(),
        "instagram_caption": (wave_dir / "instagram-caption.txt").read_text(encoding="utf-8").strip(),
        "x_caption": (wave_dir / "x-caption.txt").read_text(encoding="utf-8").strip(),
        "threads_caption": (wave_dir / "threads-caption.txt").read_text(encoding="utf-8").strip(),
        "research_dossier": (wave_dir / "research-dossier.md").read_text(encoding="utf-8").strip(),
    }
    (LIVE_OUT_DIR / "manifest.json").write_text(json.dumps(manifest, indent=2) + "\n", encoding="utf-8")

    # Keep only the 2 most recent history folders so repo stays lightweight while enforcing 2-post lookback
    all_hist = sorted(HISTORY_DIR.glob("day*"), key=lambda p: p.stat().st_mtime)
    if len(all_hist) > 3:
        for old_dir in all_hist[:-3]:
            shutil.rmtree(old_dir, ignore_errors=True)

    save_next_cursor(day_num, slot, seq_index)
    print(f"SUCCESS: {day_label} [archetype={spec.get('visual_archetype')}] rendered, verified, and staged to ./live_out/manifest.json")


if __name__ == "__main__":
    main()
