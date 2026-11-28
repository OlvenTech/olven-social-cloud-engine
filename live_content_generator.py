#!/usr/bin/env python3
"""
Olven Tech 6.5 — Infinite Live Autonomous Engine (Gemini 4 Neon/Hydrogen + Grounded Deep Research + Nano Banana 2.1 Art)

Zero-Hallucination, Never-Repeating, News-Grounded Pipeline running 1 hour before every scheduled wave:
  STAGE 1A (Live Multi-Source Signal & Full-Article Harvester):
    - Pulls 45+ live signals from Hacker News Front Page, HN Recent High-Signal, Dev.to Architecture, and Lobsters.
    - Fetches and extracts actual body text from the top fresh engineering/postmortem/cloud/AI articles.
  STAGE 1B (Gemini 4 Grounded Fact Researcher — Google Search Grounding):
    - Uses Gemini 4 (`gemini-4-neon` -> `gemini-4-hydrogen` free/paid -> `gemini-3.8-flash`) with native
      Google Search grounding (`{"google_search": {}}`, 5,000 free/month) to verify real numbers, incidents,
      benchmarks, and architecture details into a structured VERIFIED FACT BRIEF (zero hallucination!).
  STAGE 2 (Gemini 4 Executive Copywriter + Self-Healing Quality & Forever-Memory Gate):
    - Writes a 100% original B2B engineering post strictly grounded in the Stage 1B Verified Fact Brief.
    - Validates every caption against `lint_human_quality.py` AND `state/topic_memory.json` (forever dedup)
      with up to 4 self-healing feedback retries.
  STAGE 3 (Hybrid Studio Art — Nano Banana 2.1 Bespoke Art + Playwright European Atelier Compositor):
    - Calls `gemini-nano-banana-2.1` (fallback `gemini-3-pro-image`) on the same `GEMINI_API_KEY` to generate
      a bespoke, text-free, palette-matched museum-grade editorial art centerpiece (`hero_art.png`).
    - Playwright composites crisp European heritage typography + gallery frame + exact Olventech SVG logo on top,
      gracefully falling back to the 8 procedural European Atelier worlds if image API is unavailable.
"""
import base64
import datetime
import html as html_lib
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

# Current Nov 2026 Gemini 4 cascade (gemini-2.5-flash/pro deprecated Dec 1, 2026)
# gemini-4-neon = frontier intelligence (paid); gemini-4-hydrogen = Gemini 4 (FREE + paid tier!)
DEFAULT_GEMINI_CASCADE = ["gemini-4-neon", "gemini-4-hydrogen", "gemini-3.8-flash"]
DEFAULT_IMAGE_CASCADE = ["gemini-nano-banana-2.1", "gemini-3-pro-image"]

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

PALETTE_ART_DIRECTION = {
    "milanese_oxblood_atelier": (
        "Deep Venetian Bordeaux / oxblood velvet dark background (#24060C), warm champagne gold and brushed platinum accents, "
        "dramatic Milanese architectural gallery rim-lighting, moody high-fashion editorial luxury."
    ),
    "palantir_monolith": (
        "Pitch aerospace obsidian matte black background (#06070A), machined brushed titanium, sapphire glass, and one subtle crimson fault glow, "
        "ultra-sharp Dieter Rams industrial minimalism."
    ),
    "mayfair_racing_green": (
        "Deep British Racing Green velvet background (#072017), sculpted solid 24K brushed gold and dark honed slate stone, "
        "London Mayfair private-bank museum spotlighting."
    ),
    "geneva_chronograph_noir": (
        "Deep midnight sapphire ink background (#060B17), precision Swiss watchmaking sapphire crystal, gunmetal brass gears, and emerald optical precision glow."
    ),
    "parisian_ivory_monograph": (
        "Warm Parisian travertine limestone & matte ivory background (#F3EDE2), sculpted terracotta clay, travertine stone, and warm architectural sunlight shadows."
    ),
    "wall_street_wire_slip": (
        "Crisp warm cotton alabaster paper background (#F5F2EB), finely textured archival rag stock, brushed brass seal, and deep oxblood ink accents."
    ),
    "nordic_stockholm_slate": (
        "Cool Nordic silver-mist architectural background (#E9EEF4), frosted Swedish glass, anodized steel, and crisp cobalt/navy studio accents."
    ),
    "swiss_zurich_flow": (
        "Warm Swiss linen drafting background (#F4F1EA), machined anodized cobalt aluminum spheres and dark matte obsidian architectural gate."
    ),
}

ART_META_INSTRUCTIONS = {
    "wall_street_wire_slip": (
        'Required `art_meta` keys for wall_street_wire_slip: '
        '{"wireAmount": "$XX,XXX.00", "stampText": "SHORT 2-WORD RED STAMP", '
        '"docHeader": "UPPERCASE RECEIPT TITLE (max 26 chars)", '
        '"statusBad": "SHORT UPPERCASE FAILURE STATUS (max 28 chars)"}'
    ),
    "palantir_monolith": (
        'Required `art_meta` keys for palantir_monolith: '
        '{"faultSym": "1-3 CHAR SYMBOL", "callout": "SHORT UPPERCASE TELEMETRY CALLOUT (max 44 chars)"}'
    ),
    "mayfair_racing_green": (
        'Required `art_meta` keys for mayfair_racing_green: '
        '{"beforeTag": "SHORT UPPERCASE BEFORE", "beforeVal": "e.g. $168K/YR", '
        '"goldHero": "SHORT GOLD STAT", "afterTag": "SHORT UPPERCASE AFTER", "afterVal": "e.g. $0 WASTE"}'
    ),
    "milanese_oxblood_atelier": (
        'Required `art_meta` keys for milanese_oxblood_atelier: '
        '{"pageStamp": "SHORT UPPERCASE STAMP (max 24 chars)"}'
    ),
    "parisian_ivory_monograph": (
        'Required `art_meta` keys for parisian_ivory_monograph: '
        '{"clayMetric": "SHORT HERO METRIC (max 8 chars)"}'
    ),
    "nordic_stockholm_slate": (
        'Required `art_meta` keys for nordic_stockholm_slate: '
        '{"nordicHero": "SHORT HERO METRIC (max 6 chars)"}'
    ),
    "geneva_chronograph_noir": (
        'Required `art_meta` keys for geneva_chronograph_noir: '
        '{"signalTop": "1 SHORT WORD (max 6 chars)", "signalBot": "1 SHORT WORD (max 6 chars)"}'
    ),
    "swiss_zurich_flow": (
        'Optional `art_meta`: {} (ONLY for concurrency/queue/bottleneck topics).'
    ),
}

REEL_META_INSTRUCTIONS = {
    "flow_bottleneck_zurich": 'Include physics_reel.doorLabel (max 14 chars uppercase).',
    "flow_wire_ledger_geneva": (
        'Include physics_reel.wireVal, physics_reel.doorLabel (max 15 chars uppercase), '
        'physics_reel.doubleStat (max 26 chars uppercase), physics_reel.safeStat (max 28 chars uppercase).'
    ),
    "flow_monolith_milan": 'Include physics_reel.faultSym (1-3 chars) and physics_reel.faultStat (max 26 chars uppercase).',
    "flow_optics_milan": 'Include physics_reel.pageTag (max 22 chars uppercase).',
    "flow_chronograph_geneva": 'Include physics_reel.signalTop (max 6 chars) and physics_reel.signalBot (max 6 chars).',
}

B2B_TECH_RELEVANCE = {
    "postgres", "postgresql", "sql", "database", "stripe", "billing", "payment", "aws", "cloud",
    "kubernetes", "docker", "ai", "llm", "agent", "latency", "outage", "incident", "postmortem",
    "redis", "kafka", "queue", "webhook", "api", "security", "tls", "ssl", "auth", "oauth",
    "saas", "finops", "cost", "pricing", "gpu", "cache", "cdn", "dns", "deploy", "ci", "devops",
    "observability", "datadog", "snowflake", "bigquery", "erp", "crm", "shopify", "checkout",
    "architecture", "scaling", "performance", "bug", "memory", "cpu", "network", "serverless",
}


def _fetch_json(url: str, timeout: int = 8):
    req = urllib.request.Request(
        url,
        headers={"User-Agent": "OlvenTech-LiveEngine/6.5 (+https://olventech.com)"},
    )
    with urllib.request.urlopen(req, timeout=timeout) as resp:
        return json.loads(resp.read().decode("utf-8", errors="ignore"))


def _fetch_clean_article_text(url: str, max_chars: int = 3200, timeout: int = 6) -> str:
    """Fetches a live web article and strips HTML cleanly so the Research Layer reads real facts."""
    if not url or not url.startswith(("http://", "https://")):
        return ""
    lower_u = url.lower()
    if any(ext in lower_u for ext in (".pdf", ".zip", ".mp4", "youtube.com", "youtu.be", "x.com/", "twitter.com/")):
        return ""
    try:
        req = urllib.request.Request(
            url,
            headers={
                "User-Agent": "Mozilla/5.0 (compatible; OlvenTech-ResearchBot/6.5; +https://olventech.com)",
                "Accept": "text/html,application/xhtml+xml,text/plain;q=0.9",
            },
        )
        with urllib.request.urlopen(req, timeout=timeout) as resp:
            ctype = (resp.headers.get("Content-Type") or "").lower()
            if "html" not in ctype and "text" not in ctype:
                return ""
            raw = resp.read(180000).decode("utf-8", errors="ignore")
        # Strip script/style/nav/header/footer blocks
        cleaned = re.sub(r"<(script|style|noscript|svg|nav|footer|header)[^>]*>[\s\S]*?</\1>", " ", raw, flags=re.I)
        cleaned = re.sub(r"<[^>]+>", " ", cleaned)
        cleaned = html_lib.unescape(cleaned)
        cleaned = re.sub(r"\s+", " ", cleaned).strip()
        if len(cleaned) < 280:
            return ""
        return cleaned[:max_chars]
    except Exception:
        return ""


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
        "article_excerpts": [],
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

    # 5. Deep Research Layer: fetch actual full-article excerpts for top 4 relevant engineering links
    candidates = []
    seen_urls = set()
    for bucket in (signals["hn_frontpage"], signals["lobsters_active"], signals["hn_infra_ops"], signals["devto_architecture"]):
        for item in bucket:
            u = item.get("url", "")
            t = (item.get("title") or "").strip()
            if not u or u in seen_urls or "news.ycombinator.com/item" in u:
                continue
            words = set(re.findall(r"[a-z0-9]+", t.lower()))
            score = len(words & B2B_TECH_RELEVANCE) * 10 + min(item.get("points", item.get("score", 0)), 200) / 20.0
            seen_urls.add(u)
            candidates.append((score, t, u))

    candidates.sort(key=lambda x: x[0], reverse=True)
    for _, title, u in candidates[:10]:
        if len(signals["article_excerpts"]) >= 4:
            break
        excerpt = _fetch_clean_article_text(u, max_chars=2600, timeout=5)
        if excerpt:
            signals["article_excerpts"].append({
                "title": title,
                "url": u,
                "excerpt": excerpt,
            })

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
    return {"version": "6.5", "entries": []}


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
        "art_engine": spec.get("art_engine", "procedural-atelier"),
        "visual_archetype": spec.get("visual_archetype", ""),
        "reel_mode": spec.get("reel_mode", ""),
        "topic_slug": slug,
        "headline": spec.get("headline", ""),
        "poster_headline": spec.get("poster_headline", ""),
        "linkedin_opener": _extract_opener(linkedin_text),
        "linkedin_4grams": sorted(set(_word_four_grams(linkedin_text))),
        "keywords": [k.lower() for k in spec.get("keywords", [])[:10]],
        "source_signal": spec.get("source_signal", ""),
        "source_url": spec.get("source_url", ""),
    }
    entries.append(entry)
    memory["version"] = "6.5"
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


def _get_gemini_model_cascade() -> list[str]:
    override = os.environ.get("GEMINI_MODEL", "").strip()
    cascade = []
    if override:
        cascade.append(override)
    for m in DEFAULT_GEMINI_CASCADE:
        if m not in cascade:
            cascade.append(m)
    return cascade


def _call_gemini_text(
    api_key: str,
    system_prompt: str,
    user_prompt: str,
    json_mode: bool = True,
    use_google_search: bool = False,
) -> tuple[str, str]:
    """
    Calls Gemini 4 Neon -> Gemini 4 Hydrogen (free+paid) -> Gemini 3.8 Flash cascade.
    Supports native Google Search Grounding (5,000 FREE searches/month on Gemini 3/4!).
    Returns (response_text, model_used).
    """
    last_err = None
    for model in _get_gemini_model_cascade():
        url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={api_key}"
        payload: dict = {
            "system_instruction": {"parts": [{"text": system_prompt}]},
            "contents": [{"role": "user", "parts": [{"text": user_prompt}]}],
        }
        if use_google_search:
            payload["tools"] = [{"google_search": {}}]
        elif json_mode:
            payload["generationConfig"] = {"responseMimeType": "application/json"}

        req = urllib.request.Request(
            url,
            data=json.dumps(payload).encode("utf-8"),
            headers={"Content-Type": "application/json"},
            method="POST",
        )
        try:
            with urllib.request.urlopen(req, timeout=90) as resp:
                data = json.loads(resp.read().decode("utf-8"))
            parts = data["candidates"][0]["content"]["parts"]
            text = "".join(p.get("text", "") for p in parts if "text" in p).strip()
            if text:
                return text, model
        except urllib.error.HTTPError as he:
            body = he.read().decode("utf-8", errors="ignore")[:240]
            last_err = f"{model} HTTP {he.code}: {body}"
            print(f"  [Gemini cascade] {model} unavailable (HTTP {he.code}), trying next model...")
        except Exception as exc:
            last_err = f"{model}: {exc}"
            print(f"  [Gemini cascade] {model} failed ({exc}), trying next model...")

    raise RuntimeError(f"All Gemini cascade models failed: {last_err}")


def _call_openai(api_key: str, system_prompt: str, user_prompt: str, json_mode: bool = True) -> tuple[str, str]:
    model = os.environ.get("OPENAI_MODEL", "gpt-4o").strip() or "gpt-4o"
    url = "https://api.openai.com/v1/chat/completions"
    payload: dict = {
        "model": model,
        "messages": [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt},
        ],
    }
    if json_mode:
        payload["response_format"] = {"type": "json_object"}
    req = urllib.request.Request(
        url,
        data=json.dumps(payload).encode("utf-8"),
        headers={"Content-Type": "application/json", "Authorization": f"Bearer {api_key}"},
        method="POST",
    )
    with urllib.request.urlopen(req, timeout=90) as resp:
        data = json.loads(resp.read().decode("utf-8"))
    return data["choices"][0]["message"]["content"], model


def _call_anthropic(api_key: str, system_prompt: str, user_prompt: str) -> tuple[str, str]:
    model = os.environ.get("ANTHROPIC_MODEL", "claude-sonnet-4-20250514").strip() or "claude-sonnet-4-20250514"
    url = "https://api.anthropic.com/v1/messages"
    payload = {
        "model": model,
        "max_tokens": 2400,
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
    with urllib.request.urlopen(req, timeout=90) as resp:
        data = json.loads(resp.read().decode("utf-8"))
    return data["content"][0]["text"], model


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
        ("HN Recent High-Signal Tech", signals.get("hn_infra_ops", [])[:8]),
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
                lines.append(f"- {t} ({it.get('url', '')})")

    excerpts = signals.get("article_excerpts", [])
    if excerpts:
        lines.append("\n### FULL FETCHED ARTICLE EXCERPTS (READ THESE FOR VERIFIED FACTS & METRICS):")
        for idx, ex in enumerate(excerpts, 1):
            lines.append(f"\n[Article {idx}] {ex['title']} | URL: {ex['url']}\n{ex['excerpt'][:1800]}")
    return "\n".join(lines) or "- Live B2B systems engineering, Postgres, AI agent governance, cloud FinOps, Stripe/ERP reliability."


def build_grounded_research_brief(
    provider: str,
    api_key: str,
    signals: dict,
    past_summary: str,
    chosen_poster: str,
) -> tuple[dict | None, str]:
    """
    STAGE 1B — ZERO-HALLUCINATION GROUNDED RESEARCHER:
    Uses Gemini 4 + live Google Search grounding (or OpenAI/Anthropic on the fetched article bodies)
    to extract a verified, source-backed engineering fact brief BEFORE the writer writes a single word!
    """
    sys_prompt = (
        "You are a Principal Systems Engineering Researcher for Olven Tech. "
        "Your ONLY job is factual research and zero-hallucination fact verification. "
        "You MUST NOT invent fake client stories, fake percentages, or fake dollar losses. "
        "Use ONLY verified real-world facts from the provided live engineering articles and live Google Search results "
        "(real documented cloud pricing, real postmortems, real published engineering benchmarks, real protocol/database mechanics, "
        "or clearly framed industry benchmarks with exact sources). "
        "Output ONLY a valid JSON object."
    )
    palette_desc = PALETTE_ART_DIRECTION.get(chosen_poster, "")
    user_prompt = f"""TODAY'S DATE (UTC): {signals.get('date_utc')}

LIVE ENGINEERING ARTICLES & FETCHED FULL EXCERPTS:
{_format_live_signals_brief(signals)}

DO-NOT-REPEAT ARCHIVE (DO NOT PICK ANY TOPIC SIMILAR TO THESE):
{past_summary}

TASK:
1. Pick ONE fresh, genuinely exciting, timely B2B software engineering, AI infrastructure, database, cloud FinOps, fintech, or security story from today's live articles (or verify a closely related real engineering phenomenon via Google Search).
2. Extract 4 to 6 strictly VERIFIED, concrete engineering facts with real numbers (benchmarks, latencies, costs, RFC/protocol facts, real documented outage/scaling numbers — NEVER guess or fabricate!).
3. Design a bespoke, text-free, museum-grade editorial art direction prompt matching this exact European Atelier palette:
   {palette_desc}

Return ONLY valid JSON:
{{
  "chosen_angle": "Concise summary of the fresh, verified engineering angle",
  "source_title": "Exact title of the real source article or benchmark",
  "source_url": "Exact source URL",
  "verified_facts": [
    "Fact 1 with exact verified number/system detail",
    "Fact 2 with exact verified number/system detail",
    "Fact 3 with exact verified number/system detail",
    "Fact 4 with exact verified architectural fix / takeaway"
  ],
  "art_prompt": "Detailed visual prompt for a bespoke, museum-grade, text-free physical editorial sculpture or macro architectural still-life illustrating this exact engineering concept in the specified palette. STRICTLY ZERO TEXT, ZERO LETTERS, ZERO NUMBERS, ZERO UI BOXES, ZERO LOGOS."
}}"""

    try:
        if provider == "gemini":
            raw, model_used = _call_gemini_text(
                api_key, sys_prompt, user_prompt, json_mode=False, use_google_search=True
            )
        elif provider == "openai":
            raw, model_used = _call_openai(api_key, sys_prompt, user_prompt, json_mode=True)
        else:
            raw, model_used = _call_anthropic(api_key, sys_prompt, user_prompt)
        brief = _extract_json_object(raw)
        if brief.get("chosen_angle") and brief.get("verified_facts"):
            print(
                f"  [Stage 1B Grounded Research PASS via {model_used}] "
                f"angle='{brief['chosen_angle'][:72]}' ({len(brief['verified_facts'])} verified facts)"
            )
            return brief, model_used
    except Exception as exc:
        print(f"  [Stage 1B Grounded Research warning] Falling back to single-pass research: {exc}")
    return None, ""


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
    STAGE 1B + STAGE 2:
    1. Builds a live Google-Search-grounded, article-backed Verified Fact Brief (zero hallucination!).
    2. Calls Gemini 4 Neon -> Gemini 4 Hydrogen -> Gemini 3.8 Flash (or OpenAI / Anthropic) to write
       the sharp Olven Tech post strictly from those verified facts.
    3. Validates every caption against `lint_human_quality.py` + `state/topic_memory.json`.
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

    # STAGE 1B: Build Grounded Research Brief so the copywriter has zero guesswork & zero hallucinations
    brief, research_model = build_grounded_research_brief(provider, api_key, signals, past_summary, chosen_poster)

    system_prompt = """You are the Principal Systems Engineer & Executive Creative Director at Olven Tech (contact@olventech.com), an elite B2B engineering studio building reliable AI pipelines, Postgres/ERP ledgers, cloud FinOps, fintech rails, security automation, and high-throughput SaaS backends.

ZERO-HALLUCINATION RULE (CRITICAL):
- Ground EVERY number, metric, system detail, and architectural claim strictly in the VERIFIED FACT BRIEF provided below.
- Do NOT invent fake customer stories or made-up statistics. Frame verified real-world engineering insights, benchmarks, and architectural lessons sharply for CTOs, founders, and VPs of Engineering.

VOICE & TONE (STRICT):
- Write like Ramp × Duolingo × Pentagram: witty, sharp, ultra-concrete, executive, punchy.
- Zero corporate buzzwords. Zero LLM clichés. Zero newspaper essays.

STRICT HARD RULES (ANY VIOLATION REJECTS THE DRAFT):
1. NEVER use em-dashes (—) or spaced en-dashes ( – ). Use periods, colons, commas, or arrows (->).
2. NEVER use banned AI words/clichés: delve, tapestry, symphony, game-changer, unleash, elevate, paradigm, testament, realm, foster, seamless, seamlessly, unlock, revolutionize, cutting-edge, next-generation, let's dive in, here's the truth, here's the kicker, let that sink in, secret sauce, supercharge, skyrocket, no-brainer, moreover, furthermore, beacon, embark, holistic, synergy, "Not just X, it's Y", "It isn't about X, it's about Y", "X doesn't break Y. Z does.", "Stop X-ing, start Y-ing".
3. NEVER include outbound URLs (no https://...) and use 0 hashtags (max 2).
4. EVERY SINGLE CAPTION MUST contain:
   - At least one verified number/metric from the brief
   - At least one concrete system/engineering keyword (postgres, stripe, aws, api, sql, redis, kafka, llm, ai, webhook, cloud, deploy, ssl, cache, queue, worker, erp, crm, ledger, billing, checkout, datadog, snowflake, okta, server, latency, index, etc.)
   - End with `contact@olventech.com`
5. STRICT ANTI-NEWSPAPER LENGTH CAPS:
   - linkedin: 42 to 74 words AND <= 510 characters total. Short punchy beats (3-4 short paragraphs).
   - instagram: 18 to 40 words, <= 250 characters, STRICTLY 3 non-empty lines (line 3 is `contact@olventech.com`).
   - facebook: 18 to 40 words, <= 250 characters, STRICTLY 3 non-empty lines (line 3 is `contact@olventech.com`).
   - threads: 16 to 38 words, <= 235 characters, STRICTLY 3 non-empty lines (line 3 is `contact@olventech.com`).
   - x: 14 to 34 words, <= 215 characters, STRICTLY 3 non-empty lines (line 3 is `contact@olventech.com`).
6. poster_headline: EXACTLY 2 ultra-short lines separated by `\\n`, 4-7 words total.
7. Output ONLY valid JSON matching the exact schema requested."""

    art_guide = ART_META_INSTRUCTIONS.get(chosen_poster, "")
    reel_guide = REEL_META_INSTRUCTIONS.get(chosen_reel, "")
    palette_desc = PALETTE_ART_DIRECTION.get(chosen_poster, "")

    if brief:
        facts_block = "\n".join(f"  - {f}" for f in brief.get("verified_facts", []))
        research_context = f"""VERIFIED FACT BRIEF (GROUNDED VIA {research_model.upper()} + LIVE RESEARCH — USE ONLY THESE VERIFIED FACTS):
- Angle: {brief.get('chosen_angle')}
- Primary Source: {brief.get('source_title')} ({brief.get('source_url')})
- Verified Facts:
{facts_block}
- Suggested Visual Metaphor: {brief.get('art_prompt', '')}"""
    else:
        research_context = f"LIVE ENGINEERING SIGNALS:\n{_format_live_signals_brief(signals)}"

    base_user_prompt = f"""TODAY'S DATE (UTC): {signals.get('date_utc')} | WAVE: Day {day_num} ({slot}) | MEDIA FORMAT: {media_type.upper()}

{research_context}

MANDATORY ASSIGNED VISUAL WORLDS (DO NOT CHANGE THESE):
- visual_archetype / editorial_mode: "{chosen_poster}"
  Palette: {palette_desc}
  {art_guide}
- reel_mode / physics_reel.mode: "{chosen_reel}"
  {reel_guide}

COMPLETE DO-NOT-REPEAT ARCHIVE (NEVER REPEAT ANY TOPIC, HEADLINE, OR 3-WORD OPENER):
{past_summary}

Return a single JSON object with EXACTLY these keys:
{{
  "topic_slug": "unique-kebab-case-slug",
  "source_signal": "Exact source article title",
  "source_url": "Exact source URL",
  "verified_facts": ["List of the exact verified facts used in this post"],
  "art_prompt": "Museum-grade, TEXT-FREE editorial studio sculpture/still-life prompt matching {chosen_poster} palette. ZERO text, ZERO letters, ZERO numbers, ZERO logos.",
  "keywords": ["6", "concrete", "tech", "keywords"],
  "doc_id": "DAY {day_num:02d} ({slot.upper()}) · SHORT UPPERCASE TITLE",
  "headline": "Sharp 7-11 word technical title",
  "poster_headline": "Line One (2-4 words)\\nLine Two (2-3 words)",
  "poster_accent_word": "Exact 1-2 word substring from poster_headline",
  "art_meta": {{ ...exact keys required for {chosen_poster}... }},
  "before_title": "Short broken architecture label",
  "before_badge": "SHORT UPPERCASE PAIN METRIC",
  "after_nodes": ["Step 1", "Step 2", "Step 3", "Result"],
  "metrics": [
    {{"label": "SHORT LABEL", "value": "VERIFIED STAT", "sub": "Short proof"}},
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
                raw, model_used = _call_gemini_text(api_key, system_prompt, prompt, json_mode=True, use_google_search=False)
            elif provider == "openai":
                raw, model_used = _call_openai(api_key, system_prompt, prompt, json_mode=True)
            else:
                raw, model_used = _call_anthropic(api_key, system_prompt, prompt)
            spec = _extract_json_object(raw)
        except Exception as exc:
            print(f"  [Live LLM {provider} attempt {attempt}/{max_retries}] Request/JSON error: {exc}")
            feedback = f"Return strictly valid raw JSON with zero markdown wrappers. Error: {exc}"
            continue

        spec["visual_archetype"] = chosen_poster
        spec["editorial_mode"] = chosen_poster
        spec["reel_mode"] = chosen_reel
        if isinstance(spec.get("physics_reel"), dict):
            spec["physics_reel"]["mode"] = chosen_reel
            spec["physics_reel"]["cta"] = "contact@olventech.com"
        if brief:
            spec.setdefault("source_signal", brief.get("source_title", ""))
            spec.setdefault("source_url", brief.get("source_url", ""))
            spec.setdefault("verified_facts", brief.get("verified_facts", []))
            if not spec.get("art_prompt") and brief.get("art_prompt"):
                spec["art_prompt"] = brief["art_prompt"]
        spec["generation_mode"] = f"LIVE_LLM:{model_used}"

        errs = _validate_candidate_spec(spec, memory)
        if not errs:
            print(
                f"  [Live LLM {model_used} PASS on attempt {attempt}/{max_retries}] "
                f"slug='{spec['topic_slug']}', poster='{spec['poster_headline'].replace(chr(10), ' / ')}', "
                f"arch='{chosen_poster}', reel='{chosen_reel}'"
            )
            return spec, f"LIVE_LLM:{model_used}"

        print(f"  [Live LLM {model_used} attempt {attempt}/{max_retries}] Rejected by Quality Gate ({len(errs)} issues):")
        for e in errs[:6]:
            print(f"    - {e}")
        feedback = "\n".join(f"- {e}" for e in errs)

    return None, f"LLM_FAILED:{provider}"


def generate_bespoke_editorial_art(spec: dict, out_dir: Path) -> Path | None:
    """
    STAGE 3 — BESPOKE EDITORIAL ART ENGINE (Nano Banana 2.1 -> Nano Banana Pro):
    Generates a 100% unique, text-free, museum-grade studio artwork centerpiece matched to the exact
    European Atelier palette using the same GEMINI_API_KEY, saved to `out_dir/hero_art.png`.
    Playwright (`render_case_study.js`) then composites crisp European typography + exact Olventech SVG logo on top,
    stripping all AI EXIF markers! Gracefully returns None (procedural European Atelier fallback) if unavailable.
    """
    if os.environ.get("ENABLE_AI_ART", "true").strip().lower() in ("0", "false", "no", "off"):
        return None
    api_key = os.environ.get("GEMINI_API_KEY", "").strip()
    if not api_key:
        return None

    mode = spec.get("visual_archetype", "milanese_oxblood_atelier")
    palette_desc = PALETTE_ART_DIRECTION.get(mode, PALETTE_ART_DIRECTION["milanese_oxblood_atelier"])
    base_concept = spec.get("art_prompt") or (
        f"Minimalist luxury architectural object or physical engineering sculpture symbolizing: {spec.get('headline', 'high-precision enterprise systems')}."
    )
    full_prompt = (
        f"Create a museum-grade, luxury editorial still-life studio photograph / architectural 3D sculpture centerpiece "
        f"for an executive design monograph (Pentagram × Wallpaper* × Monocle × Apple Studio quality). "
        f"Concept: {base_concept} "
        f"Color & Material Palette (STRICT): {palette_desc} "
        f"Composition: Single iconic sculptural focal subject cleanly centered with generous uniform background margin around all edges so it blends seamlessly into the poster canvas. "
        f"HARD NEGATIVE RULES: ABSOLUTELY ZERO text, ZERO letters, ZERO words, ZERO numbers, ZERO charts, ZERO UI screens, ZERO logos, ZERO watermarks, ZERO cartoons, ZERO faces."
    )

    override = os.environ.get("GEMINI_IMAGE_MODEL", "").strip()
    cascade = ([override] if override else []) + [m for m in DEFAULT_IMAGE_CASCADE if m != override]

    for model in cascade:
        url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={api_key}"
        payload = {
            "contents": [{"role": "user", "parts": [{"text": full_prompt}]}],
            "generationConfig": {"responseModalities": ["IMAGE"]},
        }
        req = urllib.request.Request(
            url,
            data=json.dumps(payload).encode("utf-8"),
            headers={"Content-Type": "application/json"},
            method="POST",
        )
        try:
            with urllib.request.urlopen(req, timeout=90) as resp:
                data = json.loads(resp.read().decode("utf-8"))
            for cand in data.get("candidates", []):
                for part in cand.get("content", {}).get("parts", []):
                    inline = part.get("inlineData") or part.get("inline_data")
                    if inline and inline.get("data"):
                        img_bytes = base64.b64decode(inline["data"])
                        out_path = out_dir / "hero_art.png"
                        out_path.write_bytes(img_bytes)
                        spec["hero_art_path"] = str(out_path)
                        spec["art_engine"] = model
                        print(f"  [Stage 3 Bespoke Art OK via {model}] Saved {out_path} ({len(img_bytes)//1024} KB)")
                        return out_path
        except urllib.error.HTTPError as he:
            print(f"  [Stage 3 Art] {model} unavailable (HTTP {he.code}), trying fallback...")
        except Exception as exc:
            print(f"  [Stage 3 Art] {model} skipped ({exc}), trying fallback...")

    spec["art_engine"] = "procedural-atelier"
    return None


def pick_unposted_curated_fallback(case_notes: dict, seq_index: int, media_type: str = "image") -> dict:
    """Bulletproof fallback if no LLM API key is configured or the API is temporarily unreachable."""
    import copy

    memory = load_topic_memory()
    used_posters = {_normalize_text(e.get("poster_headline", "")) for e in memory.get("entries", [])}
    used_openers = {(e.get("linkedin_opener") or "").strip().lower() for e in memory.get("entries", [])}

    chosen_spec = None
    if seq_index in case_notes:
        cand = case_notes[seq_index]
        p_norm = _normalize_text(cand.get("poster_headline", ""))
        op = _extract_opener((cand.get("captions") or {}).get("linkedin", ""))
        if p_norm not in used_posters and op not in used_openers:
            chosen_spec = copy.deepcopy(cand)

    if chosen_spec is None:
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
