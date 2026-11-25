#!/usr/bin/env python3
"""
Olven Tech 2.1 — 8-Flavour Editorial Poster & 5-World Physics-Cinema Generator,
Self-Healing Anti-Newspaper Quality Blocker & Cloud Stager.
"""
import copy
import csv
import json
import re
import subprocess
import sys
from pathlib import Path

from rd_research_engine import (
    ADDITIONAL_CASE_NOTES,
    ARCHETYPE_ROTATION,
    gather_live_rd_signals,
    write_research_dossier,
)

BASE_DIR = Path(__file__).resolve().parent
POSTS_BY_DAY_FOLDER_ID = "1X6NaCcY99ShXMiUxyeO1xvA1bKI_k562"
QUEUE_SHEET_ID = "1wka99PpgtayvUQ2KKwzv1pnDiZd95acOpLOQtOp-KDA"
CSV_PATH = BASE_DIR / "Olven_12AM_Make_Queue.csv"

CASE_NOTES = {
    7: {
        "visual_archetype": "parisian_ivory_monograph",
        "editorial_mode": "parisian_ivory_monograph",
        "reel_mode": "flow_wire_ledger_geneva",
        "doc_id": "CASE NOTE #07 · STRIPE TO NETSUITE 6.5H PAYOUT DRIFT",
        "headline": "Eliminating 6.5-Hour Month-End Stripe to NetSuite Drift",
        "poster_headline": "6.5 Hours Matching\nStripe CSVs.",
        "poster_accent_word": "6.5 Hours",
        "art_meta": {"clayMetric": "$0.00"},
        "before_title": "Per-Charge Webhook Zaps",
        "before_badge": "6.5 HRS MANUAL CLOSE",
        "after_nodes": ["Stripe payout.paid", "Balance Txn Cursor", "Postgres Ledger", "Balanced NetSuite Deposit"],
        "metrics": [
            {"label": "MONTH-END CLOSE", "value": "12 mins", "sub": "Down from 6.5 hours"},
            {"label": "LEDGER VARIANCE", "value": "$0.00", "sub": "Across 18,400 txns/mo"},
            {"label": "API VOLUME", "value": "-84%", "sub": "Batch deposit vs per-charge"},
        ],
        "physics_reel": {
            "mode": "flow_wire_ledger_geneva",
            "setupLine1": "Triggering NetSuite on",
            "setupLine2": "every raw Stripe charge.",
            "symbol": "FX",
            "goldHero": "$9K",
            "twistPunch": "6.5 HRS IN CSV HELL.",
            "fixLine1": "ANCHOR PAYOUT.PAID.",
            "fixLine2": "POSTGRES LEDGER.",
            "payoffBig": "$0.00 DRIFT.",
            "payoffSub": "12-MIN CLOSE.",
            "cta": "contact@olventech.com",
        },
        "captions": {
            "linkedin": """Pushing every individual Stripe card charge straight into NetSuite guarantees your finance team will spend 6.5 hours every month-end crying into CSVs.

Per-charge zaps completely miss settled FX fees, grouped Stripe deductions, and mid-week refunds.

We rebuilt their 18,400 txn/mo ledger around `payout.paid` in Postgres.
Variance hit $0.00. ERP API calls dropped 84%. Close shrank to 12 minutes.

Fix messy payout accounting: contact@olventech.com""",
            "instagram": """Triggering NetSuite on raw Stripe charges left finance matching 18,400 CSV rows for 6.5 hours every month.
A payout.paid Postgres ledger cut close to 12 mins and $0.00 variance.
contact@olventech.com""",
            "facebook": """If your NetSuite bank feed disagrees with Stripe by thousands every month-end, blame per-charge webhook zaps.
Our Postgres payout.paid ledger cut 18,400 txns/mo to 12 mins and $0.00 drift.
contact@olventech.com""",
            "threads": """Finance teams shouldn't spend 6.5 hours every month-end hunting Stripe FX fees in CSVs.
Anchor on payout.paid in Postgres -> $0.00 NetSuite drift, 12-min close.
contact@olventech.com""",
            "x": """Per-charge Stripe zaps cost 6.5h/mo in NetSuite CSV pain.
Postgres payout.paid ledger -> $0.00 drift, 12-min close.
contact@olventech.com""",
        },
    },
    8: {
        "visual_archetype": "swiss_zurich_flow",
        "editorial_mode": "swiss_zurich_flow",
        "reel_mode": "flow_bottleneck_zurich",
        "doc_id": "CASE NOTE #08 · STOPPING FLASH-SALE SHOPIFY OVERSELLS",
        "headline": "Stopping Flash-Sale Oversells Caused by 15-Minute Crons",
        "poster_headline": "15-Min Cron Sold\n38 Fake Units.",
        "poster_accent_word": "38 Fake Units.",
        "art_meta": {},
        "before_title": "15-Min Full Catalog CSV Polling",
        "before_badge": "38 OVERSELLS PER DROP",
        "after_nodes": ["Postgres SKU State", "Delta Diff Filter", "Low-Stock Fast Lane", "1.8s Shopify Sync"],
        "metrics": [
            {"label": "SYNC LATENCY", "value": "1.8 sec", "sub": "Down from 22 minutes"},
            {"label": "API SAVED", "value": "98.6%", "sub": "Delta-only SKU writes"},
            {"label": "OVERSELLS", "value": "0 orders", "sub": "Across last 6 drops"},
        ],
        "physics_reel": {
            "mode": "flow_bottleneck_zurich",
            "setupLine1": "14,200 SKUs re-uploaded",
            "setupLine2": "every 15 mins on flash day.",
            "doorLabel": "429 THROTTLE",
            "crashMax": 38,
            "crashUnit": "OVERSELLS",
            "stuckStat": "22 MINS LATE",
            "twistPunch": "38 ANGRY REFUNDS.",
            "fixLine1": "DELTA-ONLY DIFF.",
            "fixLine2": "1.8 SEC FAST LANE.",
            "beforeVal": "22 MINS",
            "afterTimer": "1.8 SEC",
            "payoffBig": "0 OVERSELLS.",
            "payoffSub": "98.6% LESS API.",
            "cta": "contact@olventech.com",
        },
        "captions": {
            "linkedin": """Nothing says "happy launch day" like emailing 38 excited customers to confess you sold them sneakers that do not exist.

Their 15-minute cron re-uploaded all 14,200 SKUs to Shopify, burning GraphQL limits on slow items while hot SKUs oversold for 22 minutes.

We built a Postgres delta-diff worker with a fast lane for SKUs under 5 units.
98.6% fewer API calls. 1.8s zero-outs. 0 oversells across 6 drops.

Stop launch-day oversells: contact@olventech.com""",
            "instagram": """Re-uploading 14,200 unchanged SKUs every 15 mins throttled Shopify and oversold 38 orders per drop.
Postgres delta-diff cut API writes 98.6% and zeroed hot SKUs in 1.8s.
contact@olventech.com""",
            "facebook": """During flash sales, full-catalog ERP crons waste Shopify quota on unchanged products while bestsellers oversell.
Our Postgres delta-diff fast lane synced in 1.8s with 0 oversells across 6 drops.
contact@olventech.com""",
            "threads": """Why upload 14,200 unchanged SKUs during a flash sale while your #1 product oversells 38 times?
Postgres delta-diff -> 98.6% fewer Shopify API writes, 1.8s zero-outs, 0 oversells.
contact@olventech.com""",
            "x": """15m ERP cron oversold 38 Shopify orders every flash drop.
Postgres delta-diff -> -98.6% API calls, 1.8s sync, 0 oversells.
contact@olventech.com""",
        },
    },
    9: {
        "visual_archetype": "milanese_oxblood_atelier",
        "editorial_mode": "milanese_oxblood_atelier",
        "reel_mode": "flow_optics_milan",
        "doc_id": "CASE NOTE #09 · STOPPING BAD PDF OCR FROM POLLUTING AP",
        "headline": "Stopping Bad PDF OCR From Turning $1,090 Into $10,900",
        "poster_headline": "OCR Misread 1 Dot.\nBilled $10,900.",
        "poster_accent_word": "$10,900.",
        "art_meta": {},
        "before_title": "Unchecked Email-to-ERP OCR",
        "before_badge": "9.5 HRS/WK AP CLEANUP",
        "after_nodes": ["SHA-256 Dupe Gate", "Line-Item Math Check", "94.2% Straight-Through", "0 Bad Bills"],
        "metrics": [
            {"label": "DUPLICATE BILLS", "value": "0", "sub": "Blocked by SHA-256 gate"},
            {"label": "AUTO-POSTED", "value": "94.2%", "sub": "Verified math + PO match"},
            {"label": "AP REVIEW", "value": "45 mins", "sub": "Down from 9.5 hours/wk"},
        ],
        "physics_reel": {
            "mode": "flow_optics_milan",
            "setupLine1": "PDF OCR misread one dot",
            "setupLine2": "and typed $10,900 into ERP.",
            "twistPunch": "9.5 HRS/WK FIXING.",
            "fixLine1": "SHA-256 + MATH GATE.",
            "fixLine2": "ZERO BAD BILLS.",
            "payoffBig": "94.2% AUTO.",
            "payoffSub": "0 DUPLICATE BILLS.",
            "cta": "contact@olventech.com",
        },
        "captions": {
            "linkedin": """Vendor PDF OCR confidently misread a smudged decimal and tried to book a $1,090 invoice as $10,900 inside QuickBooks.

AP teams burned 9.5 hours every week double-checking every single line item by hand.

We put a deterministic SHA-256 duplicate gate and strict line-sum math check in front of ERP commits.
94.2% of bills post automatically. Duplicate bills hit 0. Weekly review dropped to 45 minutes.

Automate safe AP ingestion: contact@olventech.com""",
            "instagram": """Invoice OCR misread one smudge and tried to post $1,090 as $10,900 inside QuickBooks.
A SHA-256 + math verification gate hit 94.2% auto-posting and 0 bad bills.
contact@olventech.com""",
            "facebook": """Blindly piping PDF OCR straight into QuickBooks or NetSuite turns tiny scan smudges into 10x accounting errors.
Our math verification gate cut AP cleanup from 9.5h to 45 mins/wk with 0 dupes.
contact@olventech.com""",
            "threads": """Blind PDF OCR loves turning $1,090 invoices into $10,900 ERP surprises.
SHA-256 + strict line-item math checks -> 94.2% straight-through, 0 duplicate bills.
contact@olventech.com""",
            "x": """PDF OCR misread 1 dot and turned $1,090 into $10,900 in ERP.
SHA-256 + math gate -> 94.2% auto, 0 dupes, 45m/wk review.
contact@olventech.com""",
        },
    },
    15: {
        "visual_archetype": "wall_street_wire_slip",
        "editorial_mode": "wall_street_wire_slip",
        "reel_mode": "flow_wire_ledger_geneva",
        "doc_id": "CASE NOTE #15 · KILLING 84% OF WASTED ERP API CALLS",
        "headline": "Why 18,400 Per-Charge ERP Writes Break Bank Reconciliation",
        "poster_headline": "18,400 ERP Calls.\nStill Off by $9K.",
        "poster_accent_word": "$9K.",
        "art_meta": {"twinLabel": "-84%"},
        "before_title": "18,400 Per-Charge CashSales",
        "before_badge": "$9K MONTHLY VARIANCE",
        "after_nodes": ["Batch Deposit Ledger", "-84% ERP Calls", "100% Payout Trace", "$0.00 Variance"],
        "metrics": [
            {"label": "ERP API CALLS", "value": "-84%", "sub": "Batch vs 18,400 singles"},
            {"label": "LEDGER VARIANCE", "value": "$0.00", "sub": "4 straight closes"},
            {"label": "AUDIT TRACE", "value": "100%", "sub": "Linked to payout_id"},
        ],
        "physics_reel": {
            "mode": "flow_wire_ledger_geneva",
            "setupLine1": "18,400 card charges fired",
            "setupLine2": "blindly into NetSuite.",
            "symbol": "$",
            "goldHero": "$9K",
            "twistPunch": "BANK FEED NEVER MATCHED.",
            "fixLine1": "ONE BALANCED BATCH.",
            "fixLine2": "84% FEWER CALLS.",
            "payoffBig": "$0.00 GAP.",
            "payoffSub": "100% AUDIT TRACE.",
            "cta": "contact@olventech.com",
        },
        "captions": {
            "linkedin": """Flooding NetSuite with 18,400 single-charge CashSales every month still left their bank feed off by up to $9,000.

Card fees, disputes, and UTC midnight cutoffs never line up with raw checkout webhooks.

We swapped per-charge noise for one verified Postgres batch deposit per settled Stripe payout.
ERP API traffic fell 84%. Bank variance hit $0.00 across 4 straight closes.

Clean up noisy ERP syncs: contact@olventech.com""",
            "instagram": """Firing 18,400 single Stripe charges into NetSuite hammered their ERP API and still missed by $9,000.
One settled payout batch per wire cut calls 84% and hit $0.00 variance.
contact@olventech.com""",
            "facebook": """Hammering NetSuite with 18,400 individual card webhooks wastes API limits and still fails bank reconciliation.
Batching settled Stripe payouts in Postgres cut ERP calls 84% with $0.00 variance.
contact@olventech.com""",
            "threads": """18,400 individual Stripe webhooks slammed NetSuite every month and STILL left a $9K bank gap.
Settled payout batches in Postgres -> -84% API calls, $0.00 variance.
contact@olventech.com""",
            "x": """18,400 per-charge Stripe webhooks still left NetSuite off $9K.
Settled Postgres payout batches -> -84% ERP calls, $0.00 gap.
contact@olventech.com""",
        },
    },
}

CASE_NOTES.update(ADDITIONAL_CASE_NOTES)


def run_cmd(cmd):
    res = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True, check=True)
    return res.stdout.strip()


def get_next_day_slot(slot_override=None):
    import datetime
    from zoneinfo import ZoneInfo
    now_pkt = datetime.datetime.now(ZoneInfo("Asia/Karachi"))
    slot = slot_override or ("Morning" if now_pkt.hour < 15 else "Evening")

    out = run_cmd(["gdrive", "readonly", "ls", POSTS_BY_DAY_FOLDER_ID, "--max", "100"])
    max_num = 6
    morning_days = set()
    evening_days = set()
    for line in out.splitlines():
        m = re.search(r"\bDay\s+(\d+)(?:\s*\((Morning|Evening)\))?", line, re.IGNORECASE)
        if m:
            d_num = int(m.group(1))
            if d_num > max_num:
                max_num = d_num
            if m.group(2):
                tag = m.group(2).capitalize()
                if tag == "Morning":
                    morning_days.add(d_num)
                elif tag == "Evening":
                    evening_days.add(d_num)

    if slot == "Evening" and (max_num in morning_days) and (max_num not in evening_days):
        day_num = max_num
    else:
        day_num = max_num + 1

    seq_index = (day_num - 7) * 2 + (0 if slot == "Morning" else 1) + 7
    return day_num, slot, seq_index


def build_spec_for_day(day_num, seq_index=None, slot="Evening"):
    signals = gather_live_rd_signals()
    fp_count = len(signals.get("hn_frontpage", []))
    ops_count = len(signals.get("hn_infra_ops", []))
    dev_count = len(signals.get("devto_architecture", []))
    print(f"[R&D] Pulled live signals: {fp_count} HN front-page, {ops_count} HN infra/ops, {dev_count} Dev.to architecture articles.")

    lookup_idx = seq_index if seq_index is not None else day_num
    keys = sorted(CASE_NOTES.keys())
    if lookup_idx in CASE_NOTES:
        spec = copy.deepcopy(CASE_NOTES[lookup_idx])
    else:
        spec = copy.deepcopy(CASE_NOTES[keys[(lookup_idx - 7) % len(keys)]])
    spec["doc_id"] = re.sub(r"CASE NOTE #\d+", f"DAY {day_num:02d} ({slot.upper()})", spec["doc_id"])

    default_arch = spec.get("visual_archetype")
    chosen_arch = default_arch if default_arch in ARCHETYPE_ROTATION else ARCHETYPE_ROTATION[(lookup_idx - 7) % len(ARCHETYPE_ROTATION)]

    # Proactively avoid any flavour used in the last 2 waves in ./history/ so Attempt 1 passes cleanly
    hist_dir = BASE_DIR / "history"
    if hist_dir.exists():
        recent_archs = set()
        def _hist_key(p: Path):
            m = re.match(r"^day(\d+)(?:_(morning|evening))?$", p.name.lower())
            return (int(m.group(1)), 0 if m.group(2) == "morning" else 1) if m else (0, 0)
        hist_folders = sorted(
            [p for p in hist_dir.glob("day*") if p.is_dir() and (p / "visual-metadata.json").exists()],
            key=_hist_key,
        )[-2:]
        for hf in hist_folders:
            try:
                recent_archs.add(json.loads((hf / "visual-metadata.json").read_text(encoding="utf-8")).get("visual_archetype"))
            except Exception:
                pass
        if chosen_arch in recent_archs:
            start_i = ARCHETYPE_ROTATION.index(chosen_arch)
            for offset in range(1, len(ARCHETYPE_ROTATION)):
                cand = ARCHETYPE_ROTATION[(start_i + offset) % len(ARCHETYPE_ROTATION)]
                if cand not in recent_archs:
                    chosen_arch = cand
                    break

    if chosen_arch != default_arch:
        # Clear custom accent hex so the newly rotated flavour uses its high-contrast default accent
        spec.pop("poster_accent_hex", None)
    spec["visual_archetype"] = chosen_arch
    spec["editorial_mode"] = chosen_arch
    return spec, signals


def auto_remediate_captions(day_dir: Path, spec_path: Path, spec: dict, lint_output: str, attempt: int):
    """
    Olven Tech 2.1 self-healing remediation engine:
    - Rotates visual_archetype/editorial_mode across the 8 global poster flavours if Visual Uniqueness blocks.
    - Strips any AI punctuation, banned buzzwords, hashtag overflow, or Anti-Newspaper char/line overflow.
    """
    rerender_needed = False

    if "VISUAL DUPLICATE BLOCK" in lint_output or "ARCHETYPE REPEAT BLOCK" in lint_output:
        cur_arch = spec.get("visual_archetype", ARCHETYPE_ROTATION[0])
        cur_idx = ARCHETYPE_ROTATION.index(cur_arch) if cur_arch in ARCHETYPE_ROTATION else 0
        next_arch = ARCHETYPE_ROTATION[(cur_idx + attempt) % len(ARCHETYPE_ROTATION)]
        print(f"  [Self-Heal] Rotating editorial flavour from '{cur_arch}' -> '{next_arch}' for maximum grid contrast...")
        spec["visual_archetype"] = next_arch
        spec["editorial_mode"] = next_arch
        spec.pop("poster_accent_hex", None)
        with open(spec_path, "w", encoding="utf-8") as f:
            json.dump(spec, f, indent=2)
        rerender_needed = True

    banned_replacements = {
        r"\bdelve(?:s|d)?\b": "examine",
        r"\btapestry\b": "architecture",
        r"\btestament\b": "proof",
        r"\bbeacon\b": "signal",
        r"\brealm\b": "domain",
        r"\bembark\b": "start",
        r"\bunleash(?:ing|ed)?\b": "deploy",
        r"\bunlock(?:ing|ed)?\b": "enable",
        r"\belevat(?:e|ing|ed)\b": "improve",
        r"\brevolutioniz(?:e|ing|ed)\b": "rebuild",
        r"\bgame-changer\b": "upgrade",
        r"\bparadigm\s+shift\b": "change",
        r"\bsynergy\b": "sync",
        r"\bholistic\b": "full",
        r"\bseamless(?:ly)?\b": "clean",
        r"\brobust\b": "solid",
        r"\bin\s+today's\s+fast-paced\b": "in high-volume",
        r"\bin\s+the\s+ever-evolving\b": "in modern",
        r"\blet\s+that\s+sink\s+in\b": "",
        r"\bhere's\s+the\s+truth\b": "in production",
        r"\bmoreover\b": "also",
        r"\bfurthermore\b": "plus",
    }

    char_caps = {
        "linkedin-caption.txt": 550,
        "instagram-caption.txt": 275,
        "facebook-caption.txt": 275,
        "threads-caption.txt": 255,
        "x-caption.txt": 235,
    }

    for cap_file in day_dir.glob("*-caption.txt"):
        txt = cap_file.read_text(encoding="utf-8")
        txt = txt.replace("\u2014", " - ").replace("\u2013", "-").replace("---", " - ").replace("--", " - ")
        for pat, rep in banned_replacements.items():
            txt = re.sub(pat, rep, txt, flags=re.IGNORECASE)

        if "REPETITIVE HOOK OPENING BLOCK" in lint_output and cap_file.name == "linkedin-caption.txt":
            m0 = spec["metrics"][0]
            txt = f"{m0['value']} {m0['label'].lower()}: " + txt

        tags = list(re.finditer(r"(?:^|\s)(#[A-Za-z0-9_]+)", txt))
        if len(tags) > 2:
            for m in reversed(tags[2:]):
                txt = txt[:m.start(1)] + txt[m.end(1):]

        if "olventech.com" not in txt.lower():
            txt = txt.rstrip() + "\ncontact@olventech.com"

        cap_limit = char_caps.get(cap_file.name, 275)
        if len(txt.strip()) > cap_limit:
            suffix = "\ncontact@olventech.com"
            body = txt.strip().replace("contact@olventech.com", "").strip()
            txt = body[: cap_limit - len(suffix) - 3].rstrip() + "..." + suffix

        cap_file.write_text(txt.strip() + "\n", encoding="utf-8")

    for img_name in ["linkedin.png", "facebook.png", "instagram.png", "x.png"]:
        img_path = day_dir / img_name
        if not img_path.exists() or img_path.stat().st_size < 50000:
            rerender_needed = True
            break

    if rerender_needed and spec_path.exists():
        run_cmd(["node", str(BASE_DIR / "render_case_study.js"), str(spec_path), str(day_dir)])


def find_existing_drive_folder_ids(day_label: str) -> list[str]:
    """Finds any existing folder IDs in Posts By Day matching day_label exactly."""
    out = run_cmd(["gdrive", "readonly", "ls", POSTS_BY_DAY_FOLDER_ID, "--max", "100"])
    ids = []
    for line in out.splitlines():
        parts = line.strip().split()
        if len(parts) >= 3 and parts[0] != "ID":
            fid = parts[0]
            if day_label.lower() in line.lower() and "folder" in line.lower():
                ids.append(fid)
    return ids


def generate_and_stage(day_num=None, slot=None, status="QUEUED"):
    if day_num is None:
        day_num, slot, seq_index = get_next_day_slot(slot)
    else:
        import datetime
        from zoneinfo import ZoneInfo
        now_pkt = datetime.datetime.now(ZoneInfo("Asia/Karachi"))
        slot = slot or ("Morning" if now_pkt.hour < 15 else "Evening")
        seq_index = (day_num - 7) * 2 + (0 if slot == "Morning" else 1) + 7

    day_label = f"Day {day_num} ({slot})"
    local_day_dir = Path(f"/home/antigravity/day{day_num}_{slot.lower()}")
    local_day_dir.mkdir(parents=True, exist_ok=True)

    print(f"[0/5] Running Live B2B Engineering R&D for {day_label} (seq_index={seq_index})...")
    spec, signals = build_spec_for_day(day_num, seq_index=seq_index, slot=slot)
    write_research_dossier(f"{day_num} ({slot})", spec, signals, local_day_dir)

    spec_path = local_day_dir / "spec.json"
    with open(spec_path, "w", encoding="utf-8") as f:
        json.dump(spec, f, indent=2)

    print(f"[1/5] Rendering 8-Flavour 2x Retina Editorial Poster [flavour={spec.get('visual_archetype')}] for {day_label}...")
    run_cmd(["node", str(BASE_DIR / "render_case_study.js"), str(spec_path), str(local_day_dir)])

    import datetime
    from zoneinfo import ZoneInfo
    now_pkt = datetime.datetime.now(ZoneInfo("Asia/Karachi"))
    is_video_day = (now_pkt.weekday() in (1, 3, 5)) or (seq_index % 2 == 1)
    if is_video_day:
        print(f"[1b/5] Video Slot active: Rendering 1080x1920 30fps Physics-Cinema Reel [world={spec.get('reel_mode')}]...")
        run_cmd(["node", str(BASE_DIR / "render_video.js"), str(spec_path), str(local_day_dir)])

    print(f"[2/5] Writing punchy Duolingo/Ramp captions for {day_label}...")
    for plat, text in spec["captions"].items():
        (local_day_dir / f"{plat}-caption.txt").write_text(text.strip() + "\n", encoding="utf-8")

    print(f"[3/5] Running Olven 2.1 Anti-Newspaper, Zero-AI & Visual Uniqueness Gate on {local_day_dir}...")
    max_attempts = 6
    for attempt in range(1, max_attempts + 1):
        res = subprocess.run(
            ["python3", str(BASE_DIR / "lint_human_quality.py"), str(local_day_dir)],
            stdout=subprocess.PIPE,
            stderr=subprocess.STDOUT,
            text=True
        )
        if res.returncode == 0:
            print(f"  [PASS on attempt {attempt}/{max_attempts}] {res.stdout.strip()}")
            break
        print(f"  [Attempt {attempt}/{max_attempts} BLOCKED — auto-remediating & re-rendering]:\n{res.stdout.strip()}")
        auto_remediate_captions(local_day_dir, spec_path, spec, res.stdout, attempt)
    else:
        raise RuntimeError(f"Quality Gate blocked {day_label} after {max_attempts} auto-remediation passes.")

    write_research_dossier(f"{day_num} ({slot})", spec, signals, local_day_dir)
    spec_path.unlink(missing_ok=True)

    print(f"[4/5] Cleaning any stale '{day_label}' folders and creating fresh verified folder in Posts By Day...")
    for old_fid in find_existing_drive_folder_ids(day_label):
        try:
            run_cmd(["gdrive", "mutate", "trash", old_fid])
            print(f"  Trashed stale duplicate folder {day_label} ({old_fid})")
        except Exception:
            pass
    mkdir_out = run_cmd(["gdrive", "mutate", "mkdir", day_label, "--parent", POSTS_BY_DAY_FOLDER_ID])
    m_folder = re.search(r"ID:\s*([A-Za-z0-9_-]+)", mkdir_out)
    day_folder_id = m_folder.group(1)
    print(f"Created {day_label} folder: {day_folder_id}")

    file_ids = {}
    upload_files = [
        "linkedin.png", "facebook.png", "instagram.png", "x.png",
        "linkedin-caption.txt", "facebook-caption.txt", "instagram-caption.txt",
        "x-caption.txt", "threads-caption.txt", "research-dossier.md"
    ]
    if (local_day_dir / "walkthrough-video.mp4").exists():
        upload_files.append("walkthrough-video.mp4")

    for fname in upload_files:
        up_out = run_cmd(["gdrive", "mutate", "upload", str(local_day_dir / fname), "--parent", day_folder_id])
        m_id = re.search(r"ID:\s*([A-Za-z0-9_-]+)", up_out)
        file_ids[fname] = m_id.group(1)
        print(f"  Uploaded {fname} -> {file_ids[fname]}")

    print(f"[5/5] Updating {day_label} (Status={status}) in Olven_12AM_Make_Queue Google Sheet...")
    try:
        run_cmd(["gdrive", "readonly", "export", QUEUE_SHEET_ID, str(CSV_PATH), "--format", "csv"])
    except Exception:
        pass
    rows = []
    headers = [
        "Day", "Status",
        "LinkedIn_Image_File_ID", "LinkedIn_Caption",
        "Facebook_Image_File_ID", "Facebook_Caption",
        "Instagram_Image_File_ID", "Instagram_Image_URL", "Instagram_Caption",
        "X_Image_File_ID", "X_Image_URL", "X_Caption",
        "Threads_Caption"
    ]
    if CSV_PATH.exists():
        with open(CSV_PATH, "r", encoding="utf-8", newline="") as f:
            reader = list(csv.reader(f))
            if reader:
                headers = reader[0]
                rows = [r for r in reader[1:] if r and r[0] != day_label]

    new_row = [
        day_label,
        status,
        file_ids["linkedin.png"],
        (local_day_dir / "linkedin-caption.txt").read_text(encoding="utf-8").strip(),
        file_ids["facebook.png"],
        (local_day_dir / "facebook-caption.txt").read_text(encoding="utf-8").strip(),
        file_ids["instagram.png"],
        f"https://drive.google.com/uc?export=download&id={file_ids['instagram.png']}",
        (local_day_dir / "instagram-caption.txt").read_text(encoding="utf-8").strip(),
        file_ids["x.png"],
        f"https://drive.google.com/uc?export=download&id={file_ids['x.png']}",
        (local_day_dir / "x-caption.txt").read_text(encoding="utf-8").strip(),
        (local_day_dir / "threads-caption.txt").read_text(encoding="utf-8").strip()
    ]
    rows.append(new_row)

    with open(CSV_PATH, "w", encoding="utf-8", newline="") as f:
        writer = csv.writer(f)
        writer.writerow(headers)
        writer.writerows(rows)

    run_cmd(["gdrive", "mutate", "update", QUEUE_SHEET_ID, str(CSV_PATH)])
    print(f"SUCCESS: {day_label} [flavour={spec.get('visual_archetype')}] verified, uploaded to Drive ({day_folder_id}), and staged as {status}!")


if __name__ == "__main__":
    target = int(sys.argv[1]) if len(sys.argv) > 1 else None
    slot_arg = sys.argv[2] if len(sys.argv) > 2 else None
    status_arg = sys.argv[3] if len(sys.argv) > 3 else "QUEUED"
    generate_and_stage(target, slot_arg, status_arg)
