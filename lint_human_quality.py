#!/usr/bin/env python3
"""
Olven Tech 2.0 — Anti-Newspaper, Zero-AI & Visual Uniqueness Quality Gate (lint_human_quality.py)

Blocks any post from staging or publishing if ANY asset in a Day folder fails:
1. LAYER 1 (Visual Uniqueness & Anti-Template Gate):
   - Computes 8x8 spatial RGB/luminance grid distance against the preceding Day folder(s).
   - Blocks cookie-cutter reuse (mean spatial RGB diff < 22.0 or identical visual_archetype/scene_key).
   - Enforces >= 1080px shortest side and zero AI generator EXIF metadata markers.
2. LAYER 2 (Anti-Newspaper MAX Length & Punchy Duolingo/Ramp Voice Gate):
   - REMOVED old 600-char LinkedIn newspaper minimum!
   - STRICT MAX length limits:
       * LinkedIn  : <= 85 words AND <= 560 chars (punchy beat rhythm, zero essays!)
       * Instagram : <= 280 chars AND <= 4 non-empty lines (ultra-short 2-3 line punch!)
       * Facebook  : <= 280 chars AND <= 4 non-empty lines
       * Threads   : <= 260 chars AND <= 4 non-empty lines
       * X         : <= 240 chars AND <= 4 non-empty lines
   - Requires concrete quantified metric/number + system/business anchor + CTA (contact@olventech.com).
   - Blocks repetitive 3-word opening hooks and >18% 4-gram overlap against previous waves.
3. LAYER 3 (Zero-AI Tell & Algorithm Reach Gate):
   - Blocks LLM buzzwords, em-dashes (—), contrast clichés ("Not X. Y."), outbound URLs, and >2 hashtags.
"""
import json
import re
import sys
from pathlib import Path
from PIL import Image

BASE_DIR = Path(__file__).resolve().parent

BANNED_AI_PHRASES = [
    "delve", "tapestry", "symphony", "game-changer", "game changer",
    "unleash", "elevate", "paradigm", "testament", "realm", "foster",
    "seamless", "seamlessly", "in today's fast-paced", "in the ever-evolving",
    "in a world where", "imagine a world", "digital landscape",
    "10x execution velocity", "sovereign stack", "unified data plane",
    "unlock the power", "revolutionize", "cutting-edge", "next-generation",
    "let's dive in", "here's the truth", "here's the kicker", "let that sink in",
    "secret sauce", "supercharge", "skyrocket", "no-brainer", "it's no secret",
    "at the end of the day", "moreover", "furthermore", "beacon", "embark",
    "holistic", "synergy",
]

BANNED_SYNTAX_PATTERNS = [
    (r"—", "Contains an em-dash (—), an instant tell of LLM-generated copy."),
    (r"\s–\s", "Contains a spaced en-dash ( – ) used as an AI clause separator."),
    (r"\bdoesn['’]t break\b.*\bdo\b", "Uses the formulaic 'X doesn't break Y. Z does.' LLM contrast hook."),
    (r"\bdon['’]t rent\b.*\bown it\b", "Uses the formulaic 'Market leaders don't rent X. They own it.' hook."),
    (r"\bisn['’]t about\b.*\bit['’]s about\b", "Uses the 'It isn't about X, it's about Y' LLM contrast cliché."),
    (r"\bnot just\b.*\bit['’]s\b", "Uses the 'Not just X, it's Y' AI copywriting cliché."),
    (r"\bstop\s+\w+ing\b.*\bstart\s+\w+ing\b", "Uses the generic 'Stop X-ing, start Y-ing' bro-marketing template."),
]

AI_METADATA_MARKERS = [
    "midjourney", "stable diffusion", "dall-e", "dalle", "imagen",
    "firefly", "comfyui", "automatic1111", "c2pa", "ai generated",
    "trainedalgorithmicmedia",
]

CONCRETE_ANCHORS = [
    "postgres", "stripe", "netsuite", "shopify", "hubspot", "salesforce",
    "erp", "crm", "3pl", "wms", "webhook", "idempotency", "sha-256", "sha256",
    "dlq", "outbox", "cursor", "graphql", "lock", "ocr", "sku", "invoice",
    "payout", "cdc", "warehouse", "429", "503", "latency", "queue", "snowflake",
    "bigquery", "rollup", "partition", "watermark", "p95", "p99", "backoff",
    "retry", "retries", "bulkhead", "slo", "pagerduty", "concurrency", "jitter",
    "uptime", "cpu", "outage", "ddos", "rls", "tenant", "redis", "kafka", "sql",
    "api", "ach", "wire", "ledger", "uuid", "pipeline", "schema", "index",
    "cache", "circuit", "quota", "aws", "s3", "alert", "burn-rate", "edi",
    "sftp", "cron", "pdf", "llm", "ai", "token", "quickbooks", "soc-2", "audit",
    "slack", "alarm", "server", "bot", "worker", "checkout", "search", "billing",
    "gpu", "cluster", "staging", "cloud", "replica", "csv", "card", "okta",
    "saas", "zendesk", "jira", "tax", "avalara", "avif", "cdn", "datadog",
    "excel", "smtp", "inbox", "seat", "vendor", "kyb", "scraper", "deploy",
    "ssl", "tls", "cert", "interchange", "fx", "refund", "forecast", "trial",
    "pixel", "capi", "roas", "microservice", "sigterm", "billing", "license",
]

# Olven Tech 2.0 STRICT Anti-Newspaper Limits
PLATFORM_LIMITS = {
    "linkedin-caption.txt":  {"max_words": 85, "min_words": 18, "max_chars": 560, "max_lines": 12},
    "instagram-caption.txt": {"max_words": 52, "min_words": 10, "max_chars": 280, "max_lines": 4},
    "facebook-caption.txt":  {"max_words": 52, "min_words": 10, "max_chars": 280, "max_lines": 4},
    "threads-caption.txt":   {"max_words": 48, "min_words": 10, "max_chars": 260, "max_lines": 4},
    "x-caption.txt":         {"max_words": 44, "min_words": 10, "max_chars": 240, "max_lines": 4},
}


def compute_spatial_rgb_signature(img_path: Path, grid_size: int = 8) -> list[float]:
    with Image.open(img_path) as im:
        rgb = im.convert("RGB").resize((grid_size, grid_size), Image.Resampling.BOX)
        pixels = rgb.get_flattened_data() if hasattr(rgb, "get_flattened_data") else rgb.getdata()
        flat = []
        for r, g, b in pixels:
            flat.extend([float(r), float(g), float(b)])
        return flat


def spatial_signature_distance(sig_a: list[float], sig_b: list[float]) -> float:
    if not sig_a or not sig_b or len(sig_a) != len(sig_b):
        return 255.0
    return sum(abs(a - b) for a, b in zip(sig_a, sig_b)) / len(sig_a)


def get_ordered_day_folders() -> list[Path]:
    folders = []
    seen = set()
    search_roots = [BASE_DIR / "history", Path("/home/antigravity")]
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
    errors = []
    ig_path = folder / "instagram.png"
    if not ig_path.exists():
        return errors

    ordered = get_ordered_day_folders()
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
            # Ordered newest-first so idx == 0 is ALWAYS the immediately preceding wave
            prev_folders = list(reversed(ordered[-2:]))

    cur_sig = compute_spatial_rgb_signature(ig_path)
    cur_meta_path = folder / "visual-metadata.json"
    cur_arch = None
    if cur_meta_path.exists():
        try:
            meta = json.loads(cur_meta_path.read_text(encoding="utf-8"))
            cur_arch = meta.get("scene_key") or meta.get("visual_archetype")
        except Exception:
            pass

    for idx, prev in enumerate(prev_folders):
        prev_ig = prev / "instagram.png"
        if not prev_ig.exists():
            continue
        # Enforce strict spatial RGB contrast against the immediately preceding post (idx == 0)
        # so Dark -> Light -> Dark -> Light alternation never falsely blocks a distinct i-2 dark world.
        if idx == 0:
            dist = spatial_signature_distance(cur_sig, compute_spatial_rgb_signature(prev_ig))
            min_dist = 22.0
            if dist < min_dist:
                errors.append(
                    f"[VISUAL DUPLICATE BLOCK] {folder.name}/instagram.png is visually too similar to {prev.name}/instagram.png "
                    f"(spatial RGB distance = {dist:.1f}, min = {min_dist:.1f}). Rotate poster palette!"
                )

        prev_meta_path = prev / "visual-metadata.json"
        if cur_arch and prev_meta_path.exists():
            try:
                pmeta = json.loads(prev_meta_path.read_text(encoding="utf-8"))
                prev_arch = pmeta.get("scene_key") or pmeta.get("visual_archetype")
                if prev_arch == cur_arch:
                    errors.append(
                        f"[ARCHETYPE REPEAT BLOCK] {folder.name} repeats scene/archetype '{cur_arch}' from {prev.name}."
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
    words = re.findall(r"\S+", text)
    word_count = len(words)
    non_empty_lines = [ln for ln in text.splitlines() if ln.strip()]

    # 1. Banned AI phrases & syntax
    for phrase in BANNED_AI_PHRASES:
        if phrase in lower:
            errors.append(f"[{file_path.name}] Banned AI buzzword/phrase detected: '{phrase}'")

    for pattern, reason in BANNED_SYNTAX_PATTERNS:
        if re.search(pattern, text, flags=re.IGNORECASE):
            errors.append(f"[{file_path.name}] {reason}")

    # 2. STRICT Anti-Newspaper MAX Length Limits (Olven Tech 2.0!)
    lim = PLATFORM_LIMITS.get(file_path.name)
    if lim:
        if word_count > lim["max_words"]:
            errors.append(
                f"[ANTI-NEWSPAPER BLOCK] [{file_path.name}] Too long ({word_count} words > {lim['max_words']} max). "
                "Cut the fluff — keep it Duolingo/Ramp punchy!"
            )
        if word_count < lim["min_words"]:
            errors.append(f"[{file_path.name}] Too sparse ({word_count} words < {lim['min_words']} min).")
        if len(text) > lim["max_chars"]:
            errors.append(
                f"[ANTI-NEWSPAPER BLOCK] [{file_path.name}] Exceeds max char cap ({len(text)} > {lim['max_chars']})."
            )
        if len(non_empty_lines) > lim["max_lines"]:
            errors.append(
                f"[ANTI-NEWSPAPER BLOCK] [{file_path.name}] Too many lines ({len(non_empty_lines)} > {lim['max_lines']} max). "
                "Keep IG/X/Threads/FB strictly 2-3 punchy lines!"
            )

    # 3. Concrete proof & CTA checks
    has_num = bool(re.search(r"\d", text))
    has_anchor = any(a in lower for a in CONCRETE_ANCHORS)
    if not has_num:
        errors.append(f"[{file_path.name}] Missing concrete number/metric for punchy proof.")
    if not has_anchor:
        errors.append(f"[{file_path.name}] Missing concrete system/business anchor.")
    if "contact@olventech.com" not in lower:
        errors.append(f"[{file_path.name}] Missing direct conversion CTA 'contact@olventech.com'.")

    # 4. Algorithm reach rules (zero outbound URLs, <= 2 hashtags)
    hashtags = re.findall(r"(?:^|\s)(#[A-Za-z0-9_]+)", text)
    if len(hashtags) > 2:
        errors.append(f"[{file_path.name}] Hashtag stuffing ({len(hashtags)} tags). Keep <= 2.")

    urls = re.findall(r"https?://[^\s]+", text)
    if urls:
        errors.append(f"[{file_path.name}] Outbound URL in caption ({urls}). Suppresses feed reach.")

    # 5. Cross-post 4-gram & repetitive hook deduplication on LinkedIn
    if file_path.name == "linkedin-caption.txt":
        my_grams = four_grams(text)
        for other_dir in get_ordered_day_folders():
            if other_dir.resolve() == folder.resolve():
                continue
            other_li = other_dir / "linkedin-caption.txt"
            if other_li.exists():
                other_text = other_li.read_text(encoding="utf-8").strip()
                other_grams = four_grams(other_text)
                if my_grams and other_grams:
                    overlap = len(my_grams & other_grams) / min(len(my_grams), len(other_grams))
                    if overlap > 0.18:
                        errors.append(
                            f"[DUPLICATE COPY BLOCK] {folder.name}/linkedin-caption.txt shares {overlap*100:.1f}% 4-gram overlap "
                            f"with {other_dir.name}/linkedin-caption.txt (max 18%)."
                        )
                my_open = " ".join(re.findall(r"[a-z0-9]+", lower)[:3])
                other_open = " ".join(re.findall(r"[a-z0-9]+", other_text.lower())[:3])
                if my_open and my_open == other_open:
                    errors.append(
                        f"[REPETITIVE HOOK OPENING BLOCK] {folder.name} starts with '{my_open}...', matching {other_dir.name}."
                    )

    return errors


def lint_image(file_path: Path) -> list[str]:
    errors = []
    try:
        with Image.open(file_path) as im:
            w, h = im.size
            if min(w, h) < 1080:
                errors.append(f"[{file_path.name}] Resolution too low ({w}x{h}). Shortest side must be >= 1080px.")
            info_dump = json.dumps({k: str(v) for k, v in im.info.items()}).lower()
            for marker in AI_METADATA_MARKERS:
                if marker in info_dump:
                    errors.append(f"[{file_path.name}] AI generator metadata ('{marker}') detected!")
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
    target = Path(sys.argv[1]) if len(sys.argv) > 1 else Path("/home/antigravity/day14_evening")
    passed, issues = validate_day_folder(target)
    if passed:
        print(f"PASS: {target} passed Olven 2.0 Anti-Newspaper, Zero-AI & Visual Uniqueness checks.")
        sys.exit(0)
    else:
        print(f"FAIL: {target} blocked by Quality Gate ({len(issues)} issue(s)):")
        for issue in issues:
            print(f"  - {issue}")
        sys.exit(1)
