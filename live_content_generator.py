#!/usr/bin/env python3
"""
Olven Tech 6.0 — Infinite Live Autonomous Social Engine (live_content_generator.py)

Generates 100% brand-new, never-repeating, news-grounded B2B engineering posts
1 hour before every scheduled wave:
  1. Pulls real-time tech/engineering/fintech/AI/cloud signals from HN, Dev.to, and Lobsters.
  2. Reads persistent forever-memory (`state/topic_memory.json`) so NO topic, headline,
     entity angle, 3-word opener, or 4-gram ever repeats across the entire lifetime of the brand.
  3. Deterministically selects an opposite-luminance European Atelier poster world (Dark <-> Light)
     and a distinct Frame-0 Cinema Reel world so the Instagram/LinkedIn grids stay visually electric.
  4. Calls Gemini (`GEMINI_API_KEY`), OpenAI (`OPENAI_API_KEY`), or Anthropic (`ANTHROPIC_API_KEY`)
     to write a completely original case study, 4-6 word European poster headline, custom `art_meta`,
     4-act Physics-Cinema Reel script, and all 5 platform captions in the Olven Ramp/Duolingo voice.
  5. Validates every draft through `lint_human_quality.py` + `topic_memory.json` with up to 4
     self-healing feedback retries before accepting.
"""
import datetime
import json
import os
import re
import tempfile
import urllib.error
import urllib.request
from pathlib import Path
from zoneinfo import ZoneInfo

BASE_DIR = Path(__file__).resolve().parent
PKT = ZoneInfo("Asia/Karachi")
TOPIC_MEMORY_FILE = BASE_DIR / "state" / "topic_memory.json"

DARK_POSTER_WORLDS = [
    "milanese_oxblood_atelier",   # Deep Venetian Bordeaux + Gold
    "palantir_monolith",          # Pitch Aerospace Obsidian + Titanium
    "mayfair_racing_green",       # British Racing Green + 24K Gold
    "geneva_chronograph_noir",    # Midnight Sapphire Ink + Emerald
]

LIGHT_POSTER_WORLDS = [
    "parisian_ivory_monograph",   # Warm Parisian Limestone + Terracotta
    "wall_street_wire_slip",      # Warm Cotton Alabaster + Oxblood Stamp
    "nordic_stockholm_slate",     # Cool Nordic Mist + Slate
    "swiss_zurich_flow",          # Warm Swiss Linen + 32 Bottleneck Spheres (concurrency/queue only)
]

SAFE_LIGHT_POSTER_WORLDS = [
    "parisian_ivory_monograph",
    "wall_street_wire_slip",
    "nordic_stockholm_slate",
]

# 5 Reel worlds & their Frame-0 color family (for IG grid contrast against adjacent Image tiles)
REEL_WORLDS = [
    ("flow_bottleneck_zurich", "warm_light"),       # Warm Swiss Linen (#F4F1EA)
    ("flow_chronograph_geneva", "cool_light"),      # Cool Nordic Silver-Slate (#E9EEF4)
    ("flow_wire_ledger_geneva", "dark_green"),      # Deep Mayfair Racing Green (#082118)
    ("flow_optics_milan", "dark_oxblood"),          # Deep Venetian Oxblood (#26070D)
    ("flow_monolith_milan", "dark_obsidian"),       # Pitch Aerospace Obsidian (#050608)
]

POSTER_COLOR_FAMILY = {
    "milanese_oxblood_atelier": "dark_oxblood",
    "palantir_monolith": "dark_obsidian",
    "mayfair_racing_green": "dark_green",
    "geneva_chronograph_noir": "dark_sapphire",
    "parisian_ivory_monograph": "warm_light",
    "wall_street_wire_slip": "warm_light",
    "nordic_stockholm_slate": "cool_light",
    "swiss_zurich_flow": "warm_light",
}

ART_META_INSTRUCTIONS = {
    "wall_street_wire_slip": (
        'Required `art_meta` keys for wall_street_wire_slip (overlapping financial receipts): '
        '{"wireAmount": "$XX,XXX.00", "stampText": "SHORT 2-WORD RED STAMP", '
        '"docHeader": "UPPERCASE RECEIPT TITLE (max 26 chars)", '
        '"statusBad": "SHORT UPPERCASE FAILURE STATUS (max 28 chars)"}'
    ),
    "palantir_monolith": (
        'Required `art_meta` keys for palantir_monolith (obsidian grid with 1 glowing red fault tile): '
        '{"faultSym": "1-3 CHAR SYMBOL (e.g. FK, TLS, 0%, @)", '
        '"callout": "SHORT UPPERCASE TELEMETRY CALLOUT (max 44 chars)"}'
    ),
    "mayfair_racing_green": (
        'Required `art_meta` keys for mayfair_racing_green (heavy dark stack vs 24K gold bar): '
        '{"beforeTag": "SHORT UPPERCASE BEFORE LABEL", "beforeVal": "e.g. $168K/YR or 640 MS", '
        '"goldHero": "SHORT GOLD METRIC (e.g. 15 MIN or 22 MS)", '
        '"afterTag": "SHORT UPPERCASE AFTER LABEL", "afterVal": "e.g. $0 WASTE or 29X FASTER"}'
    ),
    "milanese_oxblood_atelier": (
        'Required `art_meta` keys for milanese_oxblood_atelier (sheet sliced by platinum laser): '
        '{"pageStamp": "SHORT UPPERCASE STAMP (max 24 chars, e.g. IDLE GPU · $7K/MO)"}'
    ),
    "parisian_ivory_monograph": (
        'Required `art_meta` keys for parisian_ivory_monograph (sculptural limestone monument): '
        '{"clayMetric": "SHORT HERO METRIC (max 8 chars, e.g. 9 sec, +34%, 48ms)"}'
    ),
    "nordic_stockholm_slate": (
        'Required `art_meta` keys for nordic_stockholm_slate (Nordic precision dial): '
        '{"nordicHero": "SHORT HERO METRIC (max 6 chars, e.g. -96%, 1.4s, 842x)"}'
    ),
    "geneva_chronograph_noir": (
        'Required `art_meta` keys for geneva_chronograph_noir (midnight sapphire radar grid): '
        '{"signalTop": "1 SHORT WORD (max 6 chars)", "signalBot": "1 SHORT WORD (max 6 chars)"}'
    ),
    "swiss_zurich_flow": (
        'Optional `art_meta`: {} (renders 32 physical spheres jammed behind 1 bottleneck door — '
        'ONLY use a concurrency, queue, rate-limit, or traffic-jam topic for this world!)'
    ),
}

REEL_META_INSTRUCTIONS = {
    "flow_bottleneck_zurich": 'Include physics_reel.doorLabel (max 14 chars uppercase, e.g. "DB LOCKED").',
    "flow_wire_ledger_geneva": (
        'Include physics_reel.wireVal (e.g. "$168K"), physics_reel.doorLabel (max 15 chars, e.g. "CDN EGRESS GATE"), '
        'physics_reel.doubleStat (max 26 chars uppercase), physics_reel.safeStat (max 28 chars uppercase).'
    ),
    "flow_monolith_milan": (
        'Include physics_reel.faultSym (1-3 chars) and physics_reel.faultStat (max 26 chars uppercase).'
    ),
    "flow_optics_milan": 'Include physics_reel.pageTag (max 22 chars uppercase, e.g. "DEBUG NOISE · $48K").',
    "flow_chronograph_geneva": (
        'Include physics_reel.signalTop (max 6 chars) and physics_reel.signalBot (max 6 chars).'
    ),
}


def _fetch_json(url: str, timeout: int = 8):
    req = urllib.request.Request(
        url,
        headers={"User-Agent": "OlvenTech-LiveEngine/6.0 (+https://olventech.com)"},
    )
    with urllib.request.urlopen(req, timeout=timeout) as resp:
        return json.loads(resp.read().decode("utf-8", errors="ignore"))


def gather_fresh_industry_signals() -> dict:
    """Pulls live, up-to-the-minute engineering, AI, cloud, fintech & SaaS news at T-60m."""
    now_utc = datetime.datetime.now(datetime.timezone.utc)
    since_ts = int((now_utc - datetime.timedelta(days=14)).timestamp())

    signals = {
        "timestamp_pkt": datetime.datetime.now(PKT).strftime("%Y-%m-%d %H:%M:%S %Z"),
        "date_utc": now_utc.strftime("%Y-%m-%d"),
        "hn_frontpage": [],
        "hn_infra_ops": [],
        "devto_architecture": [],
        "lobsters_active": [],
    }

    # 1. Hacker News Front Page (live right now)
    try:
        hn_fp = _fetch_json("https://hn.algolia.com/api/v1/search?tags=front_page&hitsPerPage=15")
        for h in hn_fp.get("hits", []):
            if h.get("title"):
                signals["hn_frontpage"].append({
                    "title": h["title"],
                    "points": h.get("points", 0),
                    "comments": h.get("num_comments", 0),
                    "url": h.get("url") or f"https://news.ycombinator.com/item?id={h.get('objectID')}",
                })
    except Exception:
        pass

    # 2. Hacker News Recent High-Signal Stories (sorted by recency, >25 pts)
    try:
        url = (
            "https://hn.algolia.com/api/v1/search_by_date"
            f"?tags=story&numericFilters=points>25,created_at_i>{since_ts}&hitsPerPage=12"
        )
        hn_ops = _fetch_json(url)
        for h in hn_ops.get("hits", []):
            if h.get("title"):
                signals["hn_infra_ops"].append({
                    "title": h["title"],
                    "points": h.get("points", 0),
                    "url": h.get("url") or f"https://news.ycombinator.com/item?id={h.get('objectID')}",
                })
    except Exception:
        pass

    # 3. Dev.to Top Architecture / Engineering (past 7 days)
    try:
        devto = _fetch_json("https://dev.to/api/articles?tag=architecture&top=7&per_page=10")
        for a in devto:
            if a.get("title"):
                signals["devto_architecture"].append({
                    "title": a["title"],
                    "reactions": a.get("public_reactions_count", 0),
                    "url": a.get("url", ""),
                })
    except Exception:
        pass

    # 4. Lobsters Active High-Signal Engineering Discussions
    try:
        lob = _fetch_json("https://lobste.rs/active.json")
        if isinstance(lob, list):
            for item in lob[:10]:
                if item.get("title"):
                    signals["lobsters_active"].append({
                        "title": item["title"],
                        "score": item.get("score", 0),
                        "tags": item.get("tags", []),
                        "url": item.get("url") or item.get("comments_url", ""),
                    })
    except Exception:
        pass

    return signals


def _normalize_text(s: str) -> str:
    return " ".join(re.findall(r"[a-z0-9]+", (s or "").lower()))


def _word_four_grams(text: str) -> list[str]:
    words = re.findall(r"[a-z0-9]+", (text or "").lower())
    if len(words) < 4:
        return []
    return [" ".join(words[i : i + 4]) for i in range(len(words) - 3)]


def _extract_opener(text: str) -> str:
    return " ".join(re.findall(r"[a-z0-9]+", (text or "").lower())[:3])


def load_topic_memory() -> dict:
    if TOPIC_MEMORY_FILE.exists():
        try:
            data = json.loads(TOPIC_MEMORY_FILE.read_text(encoding="utf-8"))
            if isinstance(data, dict) and isinstance(data.get("entries"), list):
                return data
        except Exception:
            pass
    return {"version": "6.0", "entries": []}


def save_topic_memory(memory: dict) -> None:
    TOPIC_MEMORY_FILE.parent.mkdir(parents=True, exist_ok=True)
    TOPIC_MEMORY_FILE.write_text(json.dumps(memory, indent=2) + "\n", encoding="utf-8")


def record_topic_memory(
    day_label: str,
    seq_index: int,
    media_type: str,
    spec: dict,
    linkedin_text: str,
    generation_mode: str = "LIVE_LLM",
) -> dict:
    memory = load_topic_memory()
    entries = [e for e in memory.get("entries", []) if e.get("day_label") != day_label]
    now_date = datetime.datetime.now(datetime.timezone.utc).strftime("%Y-%m-%d")
    slug = spec.get("topic_slug") or re.sub(r"[^a-z0-9]+", "-", spec.get("headline", "").lower()).strip("-")[:64]
    entry = {
        "day_label": day_label,
        "seq_index": seq_index,
        "date_utc": now_date,
        "media_type": media_type,
        "generation_mode": generation_mode,
        "visual_archetype": spec.get("visual_archetype", ""),
        "reel_mode": spec.get("reel_mode", ""),
        "topic_slug": slug,
        "headline": spec.get("headline", ""),
        "poster_headline": spec.get("poster_headline", ""),
        "linkedin_opener": _extract_opener(linkedin_text),
        "linkedin_4grams": sorted(set(_word_four_grams(linkedin_text))),
        "keywords": [k.lower() for k in spec.get("keywords", [])[:10]],
        "source_signal": spec.get("source_signal", ""),
    }
    entries.append(entry)
    memory["version"] = "6.0"
    memory["entries"] = entries
    save_topic_memory(memory)
    return entry


def check_memory_uniqueness(spec: dict, linkedin_text: str, memory: dict | None = None) -> list[str]:
    """Blocks any repeated topic, poster headline, 3-word opener, or >18% 4-gram overlap across ALL time."""
    if memory is None:
        memory = load_topic_memory()
    entries = memory.get("entries", [])
    errors = []

    my_poster = _normalize_text(spec.get("poster_headline", ""))
    my_headline = _normalize_text(spec.get("headline", ""))
    my_slug = (spec.get("topic_slug") or "").strip().lower()
    my_opener = _extract_opener(linkedin_text)
    my_grams = set(_word_four_grams(linkedin_text))
    my_headline_tokens = {w for w in re.findall(r"[a-z0-9]+", my_headline) if len(w) >= 4}

    for entry in entries:
        ref = entry.get("day_label") or entry.get("topic_slug") or "past post"
        old_poster = _normalize_text(entry.get("poster_headline", ""))
        old_headline = _normalize_text(entry.get("headline", ""))
        old_slug = (entry.get("topic_slug") or "").strip().lower()
        old_opener = (entry.get("linkedin_opener") or "").strip().lower()
        old_grams = set(entry.get("linkedin_4grams") or [])

        if my_slug and old_slug and my_slug == old_slug:
            errors.append(f"[FOREVER MEMORY BLOCK] Topic slug '{my_slug}' already posted on {ref}.")
        if my_poster and old_poster and my_poster == old_poster:
            errors.append(f"[FOREVER MEMORY BLOCK] Poster headline matches {ref}.")
        if my_opener and old_opener and my_opener == old_opener:
            errors.append(f"[FOREVER MEMORY BLOCK] LinkedIn 3-word opener '{my_opener}' matches {ref}.")
        if my_grams and old_grams:
            overlap = len(my_grams & old_grams) / min(len(my_grams), len(old_grams))
            if overlap > 0.18:
                errors.append(
                    f"[FOREVER MEMORY BLOCK] LinkedIn shares {overlap*100:.1f}% 4-gram overlap with {ref} (max 18%)."
                )
        old_tokens = {w for w in re.findall(r"[a-z0-9]+", old_headline) if len(w) >= 4}
        if my_headline_tokens and old_tokens:
            jaccard = len(my_headline_tokens & old_tokens) / len(my_headline_tokens | old_tokens)
            if jaccard >= 0.55:
                errors.append(
                    f"[FOREVER MEMORY BLOCK] Headline too similar ({jaccard*100:.0f}% overlap) to {ref}: '{entry.get('headline')}'."
                )
    return errors


def choose_next_visual_worlds(memory: dict, seq_index: int, media_type: str = "image") -> tuple[str, str]:
    """
    Deterministically picks:
      1. Next opposite-luminance European Atelier poster world (Dark <-> Light) avoiding last 3 waves.
      2. Next Cinema Reel world avoiding last 3 reels AND never matching the previous tile's color family.
    """
    entries = memory.get("entries", [])
    recent_posters = [e.get("visual_archetype") for e in entries[-3:] if e.get("visual_archetype")]
    recent_reels = [e.get("reel_mode") for e in entries[-3:] if e.get("reel_mode")]

    # Also check ./history/ in case memory is fresh
    hist_dir = BASE_DIR / "history"
    if not recent_posters and hist_dir.exists():
        def _hk(p: Path):
            m = re.match(r"^day(\d+)(?:_(morning|evening))?$", p.name.lower())
            return (int(m.group(1)), 0 if m.group(2) == "morning" else 1) if m else (0, 0)
        for hf in sorted([p for p in hist_dir.glob("day*") if (p / "visual-metadata.json").exists()], key=_hk)[-3:]:
            try:
                a = json.loads((hf / "visual-metadata.json").read_text(encoding="utf-8")).get("visual_archetype")
                if a:
                    recent_posters.append(a)
            except Exception:
                pass

    last_poster = recent_posters[-1] if recent_posters else "swiss_zurich_flow"
    want_dark = last_poster not in DARK_POSTER_WORLDS
    pool = DARK_POSTER_WORLDS if want_dark else SAFE_LIGHT_POSTER_WORLDS
    candidates = [w for w in pool if w not in recent_posters[-2:]] or pool
    chosen_poster = candidates[seq_index % len(candidates)]

    # Pick a Reel world whose Frame-0 palette contrasts with BOTH recent reels and the immediately preceding IG tile
    prev_family = POSTER_COLOR_FAMILY.get(last_poster, "")
    reel_candidates = [
        name for name, fam in REEL_WORLDS
        if name not in recent_reels[-2:] and fam != prev_family
    ]
    if not reel_candidates:
        reel_candidates = [name for name, _ in REEL_WORLDS if name not in recent_reels[-1:]]
    chosen_reel = reel_candidates[seq_index % len(reel_candidates)]

    return chosen_poster, chosen_reel


def _detect_llm_provider() -> tuple[str | None, str | None]:
    pref = os.environ.get("LLM_PROVIDER", "").strip().lower()
    providers = [
        ("gemini", os.environ.get("GEMINI_API_KEY", "").strip()),
        ("openai", os.environ.get("OPENAI_API_KEY", "").strip()),
        ("anthropic", os.environ.get("ANTHROPIC_API_KEY", "").strip()),
    ]
    if pref:
        for name, key in providers:
            if name == pref and key:
                return name, key
    for name, key in providers:
        if key:
            return name, key
    return None, None


def _call_gemini(api_key: str, system_prompt: str, user_prompt: str) -> str:
    model = os.environ.get("GEMINI_MODEL", "gemini-2.5-flash").strip() or "gemini-2.5-flash"
    url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={api_key}"
    payload = {
        "system_instruction": {"parts": [{"text": system_prompt}]},
        "contents": [{"role": "user", "parts": [{"text": user_prompt}]}],
        "generationConfig": {
            "temperature": 0.85,
            "responseMimeType": "application/json",
        },
    }
    req = urllib.request.Request(
        url,
        data=json.dumps(payload).encode("utf-8"),
        headers={"Content-Type": "application/json"},
        method="POST",
    )
    with urllib.request.urlopen(req, timeout=60) as resp:
        data = json.loads(resp.read().decode("utf-8"))
    return data["candidates"][0]["content"]["parts"][0]["text"]


def _call_openai(api_key: str, system_prompt: str, user_prompt: str) -> str:
    model = os.environ.get("OPENAI_MODEL", "gpt-4o").strip() or "gpt-4o"
    url = "https://api.openai.com/v1/chat/completions"
    payload = {
        "model": model,
        "temperature": 0.85,
        "response_format": {"type": "json_object"},
        "messages": [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt},
        ],
    }
    req = urllib.request.Request(
        url,
        data=json.dumps(payload).encode("utf-8"),
        headers={
            "Content-Type": "application/json",
            "Authorization": f"Bearer {api_key}",
        },
        method="POST",
    )
    with urllib.request.urlopen(req, timeout=60) as resp:
        data = json.loads(resp.read().decode("utf-8"))
    return data["choices"][0]["message"]["content"]


def _call_anthropic(api_key: str, system_prompt: str, user_prompt: str) -> str:
    model = os.environ.get("ANTHROPIC_MODEL", "claude-sonnet-4-20250514").strip() or "claude-sonnet-4-20250514"
    url = "https://api.anthropic.com/v1/messages"
    payload = {
        "model": model,
        "max_tokens": 2200,
        "temperature": 0.85,
        "system": system_prompt,
        "messages": [{"role": "user", "content": user_prompt}],
    }
    req = urllib.request.Request(
        url,
        data=json.dumps(payload).encode("utf-8"),
        headers={
            "Content-Type": "application/json",
            "x-api-key": api_key,
            "anthropic-version": "2023-06-01",
        },
        method="POST",
    )
    with urllib.request.urlopen(req, timeout=60) as resp:
        data = json.loads(resp.read().decode("utf-8"))
    return data["content"][0]["text"]


def _extract_json_object(raw_text: str) -> dict:
    cleaned = raw_text.strip()
    if cleaned.startswith("```"):
        cleaned = re.sub(r"^```(?:json)?\s*", "", cleaned)
        cleaned = re.sub(r"\s*```$", "", cleaned)
    start = cleaned.find("{")
    end = cleaned.rfind("}")
    if start != -1 and end != -1:
        cleaned = cleaned[start : end + 1]
    return json.loads(cleaned)


def _format_live_signals_brief(signals: dict) -> str:
    lines = []
    seen = set()
    buckets = [
        ("HN Front Page (Live Today)", signals.get("hn_frontpage", [])[:10]),
        ("HN Recent Infra / AI / Cloud / Fintech", signals.get("hn_infra_ops", [])[:8]),
        ("Dev.to Top Architecture (7d)", signals.get("devto_architecture", [])[:6]),
        ("Lobsters Active Engineering", signals.get("lobsters_active", [])[:6]),
    ]
    for label, items in buckets:
        if not items:
            continue
        lines.append(f"### {label}")
        for it in items:
            t = (it.get("title") or "").strip()
            if t and t.lower() not in seen:
                seen.add(t.lower())
                lines.append(f"- {t}")
    return "\n".join(lines) or "- High-volume B2B SaaS, Postgres, AI agent costs, cloud FinOps, Stripe/ERP reliability."


def _validate_candidate_spec(spec: dict, memory: dict) -> list[str]:
    from lint_human_quality import lint_caption

    errors = []
    for req_key in ("topic_slug", "headline", "poster_headline", "poster_accent_word", "metrics", "physics_reel", "captions"):
        if not spec.get(req_key):
            errors.append(f"Missing required field: '{req_key}'")

    ph = (spec.get("poster_headline") or "").strip()
    if "\n" not in ph:
        errors.append("poster_headline must have exactly 2 short lines separated by \\n.")
    else:
        ph_lines = [ln.strip() for ln in ph.splitlines() if ln.strip()]
        if len(ph_lines) != 2:
            errors.append(f"poster_headline must have 2 non-empty lines, got {len(ph_lines)}.")
        wc = len(ph.split())
        if wc < 3 or wc > 8:
            errors.append(f"poster_headline should be 4-7 punchy words, got {wc} words ('{ph}').")
        if spec.get("poster_accent_word") and spec["poster_accent_word"] not in ph:
            errors.append("poster_accent_word must be an exact substring of poster_headline.")

    caps = spec.get("captions") or {}
    with tempfile.TemporaryDirectory() as td:
        td_path = Path(td)
        for plat in ("linkedin", "instagram", "facebook", "threads", "x"):
            txt = (caps.get(plat) or "").strip()
            if not txt:
                errors.append(f"Missing caption for '{plat}'")
                continue
            fp = td_path / f"{plat}-caption.txt"
            fp.write_text(txt + "\n", encoding="utf-8")
            errors.extend(lint_caption(fp, td_path))

    li_text = (caps.get("linkedin") or "").strip()
    if li_text:
        errors.extend(check_memory_uniqueness(spec, li_text, memory))

    return errors


def generate_live_spec_with_llm(
    day_num: int,
    slot: str,
    seq_index: int,
    signals: dict,
    media_type: str = "image",
    max_retries: int = 4,
) -> tuple[dict | None, str]:
    """
    Generates a 100% original, news-grounded, linter-verified B2B engineering post live via LLM.
    Returns (spec_dict, generation_mode_tag) or (None, 'NO_LLM_KEY' / 'LLM_FAILED').
    """
    provider, api_key = _detect_llm_provider()
    if not provider or not api_key:
        return None, "NO_LLM_KEY"

    memory = load_topic_memory()
    chosen_poster, chosen_reel = choose_next_visual_worlds(memory, seq_index, media_type)

    past_entries = memory.get("entries", [])
    past_summary = "\n".join(
        f"- {e.get('day_label')}: {e.get('headline')} (poster: {e.get('poster_headline', '').replace(chr(10), ' / ')}; opener: '{e.get('linkedin_opener')}')"
        for e in past_entries[-120:]
    ) or "- None yet."

    system_prompt = """You are the Principal Systems Engineer & Executive Creative Director at Olven Tech (contact@olventech.com), an elite B2B engineering studio building reliable AI pipelines, Postgres/ERP ledgers, cloud FinOps, fintech rails, security/compliance automation, and high-throughput SaaS backends.

VOICE & TONE (STRICT):
- Write like Ramp × Duolingo × Pentagram: witty, sharp, ultra-concrete, executive, punchy.
- Zero corporate buzzwords. Zero LLM clichés. Zero newspaper essays.
- Ground every story in a vivid, realistic, financially consequential B2B engineering failure and its exact architectural fix (real systems like Postgres, Stripe, AWS, Kubernetes, Redis, Snowflake, Okta, Kafka, Terraform, LLM agents, Cloudflare, Datadog, GraphQL, TLS, OAuth, EDI, S3, etc.).

STRICT HARD RULES (ANY VIOLATION REJECTS THE DRAFT):
1. NEVER use em-dashes (—) or spaced en-dashes ( – ). Use periods, colons, commas, or arrows (->).
2. NEVER use banned AI words/clichés: delve, tapestry, symphony, game-changer, unleash, elevate, paradigm, testament, realm, foster, seamless, seamlessly, unlock, revolutionize, cutting-edge, next-generation, let's dive in, here's the truth, here's the kicker, let that sink in, secret sauce, supercharge, skyrocket, no-brainer, moreover, furthermore, beacon, embark, holistic, synergy, "Not just X, it's Y", "It isn't about X, it's about Y", "X doesn't break Y. Z does.", "Stop X-ing, start Y-ing".
3. NEVER include outbound URLs (no https://...) and use 0 hashtags (max 2).
4. EVERY SINGLE CAPTION MUST contain:
   - At least one concrete number/metric (dollars, ms, %, hours)
   - At least one concrete system/engineering keyword (postgres, stripe, aws, api, sql, redis, kafka, llm, ai, webhook, cloud, deploy, ssl, cache, queue, worker, erp, crm, ledger, billing, checkout, datadog, snowflake, okta, etc.)
   - End with `contact@olventech.com`
5. STRICT ANTI-NEWSPAPER LENGTH CAPS:
   - linkedin: 42 to 74 words AND <= 510 characters total. Short punchy beats (3-4 short paragraphs).
   - instagram: 18 to 40 words, <= 250 characters, STRICTLY 3 non-empty lines (line 3 is `contact@olventech.com`).
   - facebook: 18 to 40 words, <= 250 characters, STRICTLY 3 non-empty lines (line 3 is `contact@olventech.com`).
   - threads: 16 to 38 words, <= 235 characters, STRICTLY 3 non-empty lines (line 3 is `contact@olventech.com`).
   - x: 14 to 34 words, <= 215 characters, STRICTLY 3 non-empty lines (line 3 is `contact@olventech.com`).
6. poster_headline: EXACTLY 2 ultra-short lines separated by `\\n`, 4-7 words total (e.g. "19 Idle Staging GPUs.\\n$84,000 Burned.").
7. Output ONLY valid JSON matching the exact schema requested."""

    live_brief = _format_live_signals_brief(signals)
    art_guide = ART_META_INSTRUCTIONS.get(chosen_poster, "")
    reel_guide = REEL_META_INSTRUCTIONS.get(chosen_reel, "")

    base_user_prompt = f"""TODAY'S DATE (UTC): {signals.get('date_utc')} | WAVE: Day {day_num} ({slot}) | MEDIA FORMAT: {media_type.upper()}

LIVE ENGINEERING & INDUSTRY SIGNALS (PULLED 1 HOUR BEFORE POSTING):
{live_brief}

MANDATORY ASSIGNED VISUAL WORLDS (DO NOT CHANGE THESE):
- visual_archetype / editorial_mode: "{chosen_poster}"
  {art_guide}
- reel_mode / physics_reel.mode: "{chosen_reel}"
  {reel_guide}

COMPLETE DO-NOT-REPEAT ARCHIVE (NEVER REPEAT ANY TOPIC, ANGLE, HEADLINE, OR 3-WORD OPENER BELOW):
{past_summary}

TASK:
Pick ONE brand-new, high-stakes, executive-worthy B2B engineering & financial case study inspired by today's live tech landscape (completely different from every single past topic above!). Choose a fresh angle that CTOs, founders, VPs of Engineering, and CFOs will immediately share or bookmark.

Return a single JSON object with EXACTLY these keys:
{{
  "topic_slug": "unique-kebab-case-slug",
  "source_signal": "Exact headline from today's live signals that inspired this angle",
  "keywords": ["6", "concrete", "tech", "keywords"],
  "doc_id": "DAY {day_num:02d} ({slot.upper()}) · SHORT UPPERCASE TITLE",
  "headline": "Sharp 7-11 word case study title",
  "poster_headline": "Line One (2-4 words)\\nLine Two (2-3 words)",
  "poster_accent_word": "Exact 1-2 word substring from poster_headline to highlight in accent color",
  "art_meta": {{ ...exact keys required for {chosen_poster}... }},
  "before_title": "Short broken architecture label",
  "before_badge": "SHORT UPPERCASE PAIN METRIC",
  "after_nodes": ["Step 1", "Step 2", "Step 3", "Result"],
  "metrics": [
    {{"label": "SHORT LABEL", "value": "HERO STAT", "sub": "Short proof"}},
    {{"label": "SHORT LABEL", "value": "STAT 2", "sub": "Short proof"}},
    {{"label": "SHORT LABEL", "value": "STAT 3", "sub": "Short proof"}}
  ],
  "physics_reel": {{
    "mode": "{chosen_reel}",
    "setupLine1": "3-5 words max",
    "setupLine2": "3-5 words max",
    "stuckStat": "SHORT UPPERCASE PAIN (max 22 chars)",
    "twistPunch": "SHORT UPPERCASE TWIST (max 22 chars)",
    "fixLine1": "SHORT UPPERCASE FIX 1 (max 20 chars)",
    "fixLine2": "SHORT UPPERCASE FIX 2 (max 20 chars)",
    "payoffBig": "SHORT BIG WIN (max 16 chars)",
    "payoffSub": "SHORT SUB WIN (max 20 chars)",
    "cta": "contact@olventech.com"
  }},
  "captions": {{
    "linkedin": "...",
    "instagram": "...",
    "facebook": "...",
    "threads": "...",
    "x": "..."
  }}
}}"""

    feedback = ""
    for attempt in range(1, max_retries + 1):
        prompt = base_user_prompt + (
            f"\n\nPREVIOUS ATTEMPT FAILED VALIDATION — FIX EVERY SINGLE ISSUE BELOW:\n{feedback}"
            if feedback
            else ""
        )
        try:
            if provider == "gemini":
                raw = _call_gemini(api_key, system_prompt, prompt)
            elif provider == "openai":
                raw = _call_openai(api_key, system_prompt, prompt)
            else:
                raw = _call_anthropic(api_key, system_prompt, prompt)
            spec = _extract_json_object(raw)
        except Exception as exc:
            print(f"  [Live LLM {provider} attempt {attempt}/{max_retries}] Request/JSON error: {exc}")
            feedback = f"Return strictly valid raw JSON with zero markdown wrappers. Error: {exc}"
            continue

        # Lock deterministic visual worlds & required CTA
        spec["visual_archetype"] = chosen_poster
        spec["editorial_mode"] = chosen_poster
        spec["reel_mode"] = chosen_reel
        if isinstance(spec.get("physics_reel"), dict):
            spec["physics_reel"]["mode"] = chosen_reel
            spec["physics_reel"]["cta"] = "contact@olventech.com"
        spec["generation_mode"] = f"LIVE_LLM:{provider}"

        errs = _validate_candidate_spec(spec, memory)
        if not errs:
            print(
                f"  [Live LLM {provider} PASS on attempt {attempt}/{max_retries}] "
                f"slug='{spec['topic_slug']}', poster='{spec['poster_headline'].replace(chr(10), ' / ')}', "
                f"arch='{chosen_poster}', reel='{chosen_reel}'"
            )
            return spec, f"LIVE_LLM:{provider}"

        print(f"  [Live LLM {provider} attempt {attempt}/{max_retries}] Rejected by Quality Gate ({len(errs)} issues):")
        for e in errs[:6]:
            print(f"    - {e}")
        feedback = "\n".join(f"- {e}" for e in errs)

    return None, f"LLM_FAILED:{provider}"


def pick_unposted_curated_fallback(case_notes: dict, seq_index: int, media_type: str = "image") -> dict:
    """
    Bulletproof fallback if no LLM API key is configured or the LLM API is unreachable:
    picks the first case study in `case_notes` not yet recorded in `state/topic_memory.json`,
    and assigns opposite-luminance visuals cleanly.
    """
    import copy

    memory = load_topic_memory()
    used_posters = {_normalize_text(e.get("poster_headline", "")) for e in memory.get("entries", [])}
    used_openers = {(e.get("linkedin_opener") or "").strip().lower() for e in memory.get("entries", [])}

    chosen_spec = None
    # Prefer exact seq_index if unposted
    if seq_index in case_notes:
        cand = case_notes[seq_index]
        p_norm = _normalize_text(cand.get("poster_headline", ""))
        op = _extract_opener((cand.get("captions") or {}).get("linkedin", ""))
        if p_norm not in used_posters and op not in used_openers:
            chosen_spec = copy.deepcopy(cand)

    if chosen_spec is None:
        # Search all keys >= 30 first, then remaining keys
        ordered_keys = sorted([k for k in case_notes if k >= 30]) + sorted([k for k in case_notes if k < 30])
        for k in ordered_keys:
            cand = case_notes[k]
            p_norm = _normalize_text(cand.get("poster_headline", ""))
            op = _extract_opener((cand.get("captions") or {}).get("linkedin", ""))
            if p_norm not in used_posters and op not in used_openers:
                chosen_spec = copy.deepcopy(cand)
                break

    if chosen_spec is None:
        keys = sorted(case_notes.keys())
        chosen_spec = copy.deepcopy(case_notes[keys[(seq_index - 7) % len(keys)]])

    chosen_spec["generation_mode"] = "CURATED_FALLBACK"
    return chosen_spec
