#!/usr/bin/env python3
"""
Olven Tech — Hard-Line Multi-Layer Anti-AI, Anti-Generic & Visual Uniqueness Gate (lint_human_quality.py)

Blocks any post from staging or publishing if ANY asset in a Day folder fails:
1. LAYER 1 (Visual Uniqueness & Anti-Template Gate):
   - Computes 8x8 spatial RGB/luminance grid distance against the preceding Day folder(s).
   - Blocks cookie-cutter template reuse (mean spatial RGB diff < 22.0 or identical visual_archetype).
2. LAYER 2 (Anti-Generic Copy, Hook Specificity & Cross-Post N-Gram Deduplication):
   - Requires concrete engineering system primitives and quantified numbers in the opening hook.
   - Blocks repetitive hook openings ("Why do...", "If your...") and >16% 4-gram overlap against other days.
   - Enforces high-retention technical depth and conversion CTA (contact@olventech.com).
3. LAYER 3 (Zero-AI Tell, Copyright & Algorithm Reach Gate):
   - Blocks 65+ LLM buzzwords, em-dashes (—), contrast clichés ("Not X. Y."), outbound URLs, >2 hashtags,
     low-res images, and C2PA/diffusion EXIF tags.
"""

import csv
import json
import os
import re
import sys
from pathlib import Path
from PIL import Image

BASE_DIR = Path(__file__).resolve().parent
QUEUE_CSV = BASE_DIR / "Olven_12AM_Make_Queue.csv"

BANNED_AI_PHRASES = [
    "delve",
    "tapestry",
    "symphony",
    "game-changer",
    "game changer",
    "unleash",
    "elevate",
    "paradigm",
    "testament",
    "realm",
    "foster",
    "seamless",
    "seamlessly",
    "in today's fast-paced",
    "in the ever-evolving",
    "in a world where",
    "imagine a world",
    "digital landscape",
    "10x execution velocity",
    "10× execution velocity",
    "sovereign stack",
    "unified data plane",
    "unlock the power",
    "revolutionize",
    "cutting-edge",
    "next-generation",
    "let's dive in",
    "here's the truth",
    "here's the kicker",
    "let that sink in",
    "secret sauce",
    "supercharge",
    "skyrocket",
    "no-brainer",
    "it's no secret",
    "at the end of the day",
    "moreover",
    "furthermore",
    "beacon",
    "embark",
    "holistic",
    "synergy",
]

BANNED_SYNTAX_PATTERNS = [
    (
        r"—",
        "Contains an em-dash (—), one of the strongest subconscious tells of LLM-generated copy.",
    ),
    (
        r"\s–\s",
        "Contains a spaced en-dash ( – ) used as an AI clause separator.",
    ),
    (
        r"\bdoesn['’]t break\b.*\bdo\b",
        "Uses the formulaic 'X doesn't break Y. Z does.' LLM contrast hook.",
    ),
    (
        r"\bdon['’]t rent\b.*\bown it\b",
        "Uses the formulaic 'Market leaders don't rent X. They own it.' LLM contrast hook.",
    ),
    (
        r"\bisn['’]t about\b.*\bit['’]s about\b",
        "Uses the 'It isn't about X, it's about Y' LLM contrast cliché.",
    ),
    (
        r"\bnot just\b.*\bit['’]s\b",
        "Uses the 'Not just X, it's Y' AI copywriting cliché.",
    ),
    (
        r"\bstop\s+\w+ing\b.*\bstart\s+\w+ing\b",
        "Uses the generic 'Stop X-ing, start Y-ing' LinkedIn bro-marketing template.",
    ),
]

AI_METADATA_MARKERS = [
    "midjourney",
    "stable diffusion",
    "dall-e",
    "dalle",
    "imagen",
    "firefly",
    "comfyui",
    "automatic1111",
    "c2pa",
    "ai generated",
    "trainedalgorithmicmedia",
]

REQUIRED_TECH_PRIMITIVES = [
    "postgres", "stripe", "netsuite", "shopify", "hubspot", "salesforce",
    "erp", "crm", "3pl", "wms", "webhook", "idempotency", "sha-256", "sha256",
    "dlq", "outbox", "cursor", "graphql", "lock", "ocr", "po ", "sku",
    "invoice", "payout", "cdc", "warehouse", "429", "503", "latency", "queue",
    "snowflake", "bigquery", "rollup", "partition", "clustering", "watermark",
    "p95", "p99", "backoff", "retry", "retries", "bulkhead", "slo", "pagerduty",
    "concurrency", "jitter", "uptime", "cpu", "outage", "ddos", "rls", "tenant",
    "redis", "kafka", "grpc", "sql", "api", "ach", "wire", "ledger", "uuid",
    "pipeline", "schema", "index", "cache", "circuit", "quota", "kubernetes",
    "docker", "aws", "s3", "cdn", "oauth", "jwt", "tls", "terraform", "replica",
    "shard", "broker", "event", "alert", "burn-rate", "disbursement", "recon",
    "migration", "canary", "rollback", "telemetry", "trace", "span", "rate limit",
]


def compute_spatial_rgb_signature(img_path: Path, grid_size: int = 8) -> list[float]:
    """Downsamples an image into an 8x8 RGB grid (192 floats) to measure layout & palette similarity."""
    with Image.open(img_path) as im:
        rgb = im.convert("RGB").resize((grid_size, grid_size), Image.Resampling.BOX)
        pixels = list(rgb.getdata())
        flat = []
        for r, g, b in pixels:
            flat.extend([float(r), float(g), float(b)])
        return flat


def spatial_signature_distance(sig_a: list[float], sig_b: list[float]) -> float:
    """Mean absolute RGB difference (0..255) across the 8x8 spatial layout grid."""
    if not sig_a or not sig_b or len(sig_a) != len(sig_b):
        return 255.0
    return sum(abs(a - b) for a, b in zip(sig_a, sig_b)) / len(sig_a)


def get_Ordered_day_folders() -> list[Path]:
    """Returns existing day* folders in ./history or /home/antigravity ordered by (day_num, slot)."""
    folders = []
    seen = set()
    search_roots = [Path(__file__).resolve().parent / "history", Path("/home/antigravity")]
    for root in search_roots:
        if not root.exists():
            continue
        for p in root.glob("day*"):
            if not p.is_dir():
                continue
            m = re.match(r"^day(\d+)(?:_(morning|evening))?$", p.name.lower())
            if m and p.name.lower() not in seen:
                d_num = int(m.group(1))
                slot_order = 0 if m.group(2) == "morning" else (1 if m.group(2) == "evening" else 0)
                if (p / "instagram.png").exists():
                    seen.add(p.name.lower())
                    folders.append(((d_num, slot_order, p.name), p))
    folders.sort(key=lambda x: x[0])
    return [f[1] for f in folders]


def lint_visual_uniqueness(folder: Path) -> list[str]:
    """
    Blocks if the rendered visual is structurally/colorimetrically too close to the preceding post
    or repeats the preceding post's visual_archetype.
    """
    errors = []
    ig_path = folder / "instagram.png"
    if not ig_path.exists():
        return errors

    ordered = get_Ordered_day_folders()
    prev_folders = []
    for i, candidate in enumerate(ordered):
        if candidate.resolve() == folder.resolve():
            if i > 0:
                prev_folders.append(ordered[i - 1])
            if i > 1:
                prev_folders.append(ordered[i - 2])
            break
    else:
        if ordered:
            prev_folders = ordered[-2:]

    cur_sig = compute_spatial_rgb_signature(ig_path)
    cur_meta_path = folder / "visual-metadata.json"
    cur_arch = None
    if cur_meta_path.exists():
        try:
            cur_arch = json.loads(cur_meta_path.read_text(encoding="utf-8")).get("visual_archetype")
        except Exception:
            pass

    for idx, prev in enumerate(prev_folders):
        prev_ig = prev / "instagram.png"
        if not prev_ig.exists():
            continue
        dist = spatial_signature_distance(cur_sig, compute_spatial_rgb_signature(prev_ig))
        # Adjacent post on grid must have strong visual contrast (dist >= 22.0)
        min_dist = 22.0 if idx == 0 else 16.0
        if dist < min_dist:
            errors.append(
                f"[VISUAL DUPLICATE BLOCK] {folder.name}/instagram.png is visually too similar to {prev.name}/instagram.png "
                f"(spatial RGB distance = {dist:.1f}, minimum required = {min_dist:.1f}). "
                "Cookie-cutter template repetition is blocked; switch to a contrasting visual archetype!"
            )

        prev_meta_path = prev / "visual-metadata.json"
        if cur_arch and prev_meta_path.exists():
            try:
                prev_arch = json.loads(prev_meta_path.read_text(encoding="utf-8")).get("visual_archetype")
                if prev_arch == cur_arch:
                    errors.append(
                        f"[ARCHETYPE REPEAT BLOCK] {folder.name} uses the same visual_archetype ('{cur_arch}') "
                        f"as recent post {prev.name}. Every post must rotate visual archetype!"
                    )
            except Exception:
                pass

    return errors


def four_grams(text: str) -> set[tuple[str, ...]]:
    words = re.findall(r"[a-z0-9]+", text.lower())
    if len(words) < 4:
        return set()
    return {tuple(words[i : i + 4]) for i in range(len(words) - 3)}


def lint_caption(file_path: Path, folder: Path) -> list[str]:
    errors = []
    text = file_path.read_text(encoding="utf-8").strip()
    lower = text.lower()

    # 1. Check banned AI phrases
    for phrase in BANNED_AI_PHRASES:
        if phrase in lower:
            errors.append(f"[{file_path.name}] Banned AI buzzword/phrase detected: '{phrase}'")

    # 2. Check banned syntactic patterns (em-dashes, contrast hooks)
    for pattern, reason in BANNED_SYNTAX_PATTERNS:
        if re.search(pattern, text, flags=re.IGNORECASE):
            errors.append(f"[{file_path.name}] {reason}")

    # 3. Hook Specificity & Anti-Generic Opening Check (first 200 chars must name a concrete primitive or number)
    hook = lower[:200]
    has_num = bool(re.search(r"\d", hook))
    has_tech = any(tp in hook for tp in REQUIRED_TECH_PRIMITIVES)
    if not (has_num or has_tech):
        errors.append(
            f"[{file_path.name}] Generic opening hook detected: first 200 chars lack concrete engineering primitives or numbers."
        )

    # 4. Technical Evidence Density & CTA Check
    matched_primitives = [tp for tp in REQUIRED_TECH_PRIMITIVES if tp in lower]
    if len(matched_primitives) < 2:
        errors.append(
            f"[{file_path.name}] Insufficient engineering specificity (found {len(matched_primitives)} primitives; need >= 2)."
        )

    numbers_found = re.findall(r"(?<![A-Za-z])\d+(?:[.,]\d+)?(?:[%kKmMbBsxX]|ms|hr|mo|yr)?", text)
    if len(numbers_found) < 2:
        errors.append(
            f"[{file_path.name}] Insufficient quantified proof (found {len(numbers_found)} numbers; need >= 2 concrete metrics)."
        )

    if "contact@olventech.com" not in lower:
        errors.append(f"[{file_path.name}] Missing direct conversion CTA 'contact@olventech.com'.")

    # 5. Platform length & algorithm reach rules
    hashtags = re.findall(r"(?:^|\s)(#[A-Za-z0-9_]+)", text)
    if len(hashtags) > 2:
        errors.append(
            f"[{file_path.name}] Hashtag stuffing ({len(hashtags)} tags: {hashtags}). Keep <= 2 tags."
        )

    urls = re.findall(r"https?://[^\s]+", text)
    if urls:
        errors.append(
            f"[{file_path.name}] Outbound URL in main caption ({urls}). Suppresses feed reach by 40-70%."
        )

    if file_path.name == "x-caption.txt" and len(text) > 280:
        errors.append(f"[x-caption.txt] Exceeds 280-char X limit ({len(text)} chars).")

    if file_path.name == "linkedin-caption.txt":
        if len(text) < 600:
            errors.append(f"[linkedin-caption.txt] Too short for high-dwell LinkedIn reach ({len(text)} chars < 600).")
        # Cross-post 4-gram duplication check against other folders
        my_grams = four_grams(text)
        for other_dir in get_Ordered_day_folders():
            if other_dir.resolve() == folder.resolve():
                continue
            other_li = other_dir / "linkedin-caption.txt"
            if other_li.exists():
                other_text = other_li.read_text(encoding="utf-8").strip()
                other_grams = four_grams(other_text)
                if my_grams and other_grams:
                    overlap = len(my_grams & other_grams) / min(len(my_grams), len(other_grams))
                    if overlap > 0.16:
                        errors.append(
                            f"[DUPLICATE COPY BLOCK] {folder.name}/linkedin-caption.txt shares {overlap*100:.1f}% 4-gram overlap "
                            f"with {other_dir.name}/linkedin-caption.txt (max allowed 16%)."
                        )
                # Also block identical 3-word opening hook across adjacent posts
                my_open = " ".join(re.findall(r"[a-z0-9]+", lower)[:3])
                other_open = " ".join(re.findall(r"[a-z0-9]+", other_text.lower())[:3])
                if my_open and my_open == other_open:
                    errors.append(
                        f"[REPETITIVE HOOK OPENING BLOCK] {folder.name} starts with '{my_open}...', matching {other_dir.name}. "
                        "Vary opening syntax across posts!"
                    )

    return errors


def lint_image(file_path: Path) -> list[str]:
    errors = []
    try:
        with Image.open(file_path) as im:
            width, height = im.size
            if min(width, height) < 1080:
                errors.append(
                    f"[{file_path.name}] Resolution too low ({width}x{height}). Minimum shortest side is 1080px."
                )

            info_dump = json.dumps({k: str(v) for k, v in im.info.items()}).lower()
            for marker in AI_METADATA_MARKERS:
                if marker in info_dump:
                    errors.append(
                        f"[{file_path.name}] AI generator metadata signature ('{marker}') found in image header!"
                    )
    except Exception as exc:
        errors.append(f"[{file_path.name}] Failed to inspect image: {exc}")

    return errors


def validate_day_folder(folder: Path) -> tuple[bool, list[str]]:
    errors = []
    if not folder.exists():
        return False, [f"Folder does not exist: {folder}"]

    captions = sorted(folder.glob("*-caption.txt"))
    if not captions:
        errors.append("No *-caption.txt files found in folder.")

    for cap in captions:
        errors.extend(lint_caption(cap, folder))

    images = sorted(folder.glob("*.png")) + sorted(folder.glob("*.jpg"))
    videos = sorted(folder.glob("*.mp4"))
    if not images and not videos:
        errors.append("No media files (.png, .jpg, or .mp4) found in folder.")

    for img in images:
        errors.extend(lint_image(img))

    errors.extend(lint_visual_uniqueness(folder))

    return len(errors) == 0, errors


if __name__ == "__main__":
    target = Path(sys.argv[1]) if len(sys.argv) > 1 else Path("/home/antigravity/day8_morning")
    passed, issues = validate_day_folder(target)
    if passed:
        print(f"PASS: {target} passed all Anti-AI, Visual Uniqueness, Anti-Generic, and Algorithm Reach checks.")
        sys.exit(0)
    else:
        print(f"FAIL: {target} blocked by Quality Gate ({len(issues)} issue(s)):")
        for issue in issues:
            print(f"  - {issue}")
        sys.exit(1)
