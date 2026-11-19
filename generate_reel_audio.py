#!/usr/bin/env python3
"""
Olven Tech — Silicon Valley Studio Audio Engine for 9:16 Reels
Generates:
  1. Crisp Neural AI Voiceover (Microsoft Azure Neural via edge-tts, en-US-AndrewMultilingualNeural)
     with exact per-beat durations and word-level subtitle cue timestamps.
  2. Lush, copyright-free 118 BPM Silicon Valley ambient electronic / Rhodes pad soundtrack
     + subtle kinetic pulse + transition whoosh SFX aligned to every scene cut (NumPy 48kHz stereo).
  3. Broadcast FFmpeg mastering: vocal presence EQ + sidechain ducking of the music bed under speech
     -> reel_audio.m4a (48kHz stereo 160k AAC) + reel_timeline.json.
"""
import asyncio
import json
import math
import re
import subprocess
import sys
import wave
from pathlib import Path

import numpy as np

SR = 48000


def clean_for_speech(text: str) -> str:
    s = re.sub(r"<[^>]+>", "", str(text or ""))
    s = s.replace("&lt;", " under ").replace("&gt;", " over ").replace("&amp;", " and ")
    s = re.sub(r"POST\s+/v\d+/([a-zA-Z0-9_-]+)", r"the \1 endpoint", s)
    s = re.sub(r"<=", " under ", s)
    s = re.sub(r">=", " at least ", s)
    s = re.sub(r"!=", " is not equal to ", s)
    s = re.sub(r"==", " equals ", s)
    s = s.replace("SHA-256", "sha 256").replace("sha256(pdf_bytes)", "sha 256 file hashing")
    s = s.replace("balance_transactions", "balance transactions").replace("payout.paid", "payout paid")
    s = s.replace("charge.succeeded", "charge succeeded").replace("order_id", "order I D")
    s = s.replace("order_paid", "order paid").replace("on_hand_delta", "stock delta")
    s = s.replace("3PL", "3 P L").replace("SKU", "S K U").replace("SKUs", "S K Us")
    s = s.replace("ERP", "E R P").replace("API", "A P I").replace("LLM", "L L M")
    s = s.replace("OCR", "O C R").replace("PO ", "purchase order ")
    s = s.replace("$0.00", "zero dollars").replace("0.0%", "zero percent")
    s = re.sub(r"\s+", " ", s).strip()
    return s


def build_beat_scripts(spec: dict) -> list[dict]:
    m0 = spec["metrics"][0]
    m1 = spec["metrics"][1]
    before_clean = clean_for_speech(re.sub(r"^Before:\s*", "", spec["before_title"], flags=re.I))
    after_clean = clean_for_speech(re.sub(r"^After:\s*", "", spec["after_title"], flags=re.I))
    badge_bad = clean_for_speech(spec["before_badge"])
    p0_bad = clean_for_speech(spec["before_points"][0])
    n1 = clean_for_speech(spec["after_nodes"][1])
    n2 = clean_for_speech(spec["after_nodes"][2])
    n3 = clean_for_speech(spec["after_nodes"][3])
    m0_val = clean_for_speech(m0["value"])
    m0_lbl = clean_for_speech(m0["label"]).lower()
    m1_val = clean_for_speech(m1["value"])
    m1_lbl = clean_for_speech(m1["label"]).lower()

    raw_before = re.sub(r"^Before:\s*", "", spec["before_title"], flags=re.I)
    raw_after = re.sub(r"^After:\s*", "", spec["after_title"], flags=re.I)
    raw_p0 = re.sub(r"<[^>]+>", "", spec["before_points"][0])

    return [
        {
            "id": "hook",
            "speech": f"{badge_bad}. Here is why {before_clean} fails in production.",
            "display": f"{spec['before_badge']} — why {raw_before} fails in production.",
            "pad_after": 0.35,
        },
        {
            "id": "failure",
            "speech": p0_bad,
            "display": raw_p0,
            "pad_after": 0.35,
        },
        {
            "id": "fix",
            "speech": f"The production fix: {after_clean}. Route through {n1}, enforce {n2}, then commit via {n3}.",
            "display": f"Production fix: {raw_after} → {spec['after_nodes'][1]} → {spec['after_nodes'][2]}.",
            "pad_after": 0.35,
        },
        {
            "id": "proof",
            "speech": f"Measured in production: {m0_val} {m0_lbl}, and {m1_val} {m1_lbl}.",
            "display": f"Measured impact: {m0['value']} ({m0['sub']}) · {m1['label']}: {m1['value']}.",
            "pad_after": 0.40,
        },
        {
            "id": "outro",
            "speech": "Follow Olven Tech for real production architecture.",
            "display": "Follow @olventech · olventech.com",
            "pad_after": 0.90,
        },
    ]


def ffprobe_duration(media_path: Path) -> float:
    out = subprocess.check_output(
        [
            "ffprobe", "-v", "error",
            "-show_entries", "format=duration",
            "-of", "default=noprint_wrappers=1:nokey=1",
            str(media_path),
        ],
        text=True,
    ).strip()
    return float(out)


def chunk_words(words_with_ts: list[dict], max_words: int = 4) -> list[dict]:
    """Group word timestamps into crisp 3-4 word TikTok/Reels kinetic caption phrases."""
    cues = []
    for i in range(0, len(words_with_ts), max_words):
        grp = words_with_ts[i : i + max_words]
        if not grp:
            continue
        cues.append({
            "start": round(grp[0]["start"], 3),
            "end": round(grp[-1]["end"], 3),
            "words": grp,
        })
    return cues


async def synth_edge_tts_beats(beats: list[dict], work_dir: Path, voice: str = "en-US-AndrewMultilingualNeural"):
    import edge_tts

    beat_results = []
    for idx, b in enumerate(beats):
        mp3_path = work_dir / f"vo_beat_{idx}.mp3"
        comm = edge_tts.Communicate(b["speech"], voice=voice, rate="+7%", boundary="WordBoundary")
        words = []
        audio_chunks = bytearray()
        async for chunk in comm.stream():
            if chunk["type"] == "audio":
                audio_chunks.extend(chunk["data"])
            elif chunk["type"] == "WordBoundary":
                st = chunk["offset"] / 10_000_000.0
                dur = chunk["duration"] / 10_000_000.0
                words.append({
                    "word": chunk["text"],
                    "start": st,
                    "end": st + max(dur, 0.12),
                })
        if not audio_chunks:
            raise RuntimeError(f"edge-tts returned empty audio for beat {idx}")
        mp3_path.write_bytes(bytes(audio_chunks))
        dur = ffprobe_duration(mp3_path)
        if not words:
            # Synthesize even word spacing if provider omitted WordBoundary
            toks = b["speech"].split()
            step = dur / max(len(toks), 1)
            words = [{"word": w, "start": k * step, "end": (k + 1) * step} for k, w in enumerate(toks)]
        beat_results.append({"mp3": mp3_path, "voice_dur": dur, "words": words})
    return beat_results


def synthesize_silicon_valley_music(total_dur: float, cut_times: list[float], wav_out: Path):
    """
    Procedurally synthesizes a rich, warm, 118 BPM Silicon Valley tech-documentary
    ambient Rhodes/synth + sub-bass + soft electronic pulse + cinematic transition whooshes.
    100% copyright-free, 48kHz stereo.
    """
    n = int(math.ceil(total_dur * SR))
    t = np.arange(n, dtype=np.float64) / SR
    bpm = 118.0
    beat_sec = 60.0 / bpm
    bar_sec = beat_sec * 4.0

    # Warm Silicon Valley minor-9th / major-7th progression (Cm9 -> Abmaj7 -> Ebmaj7 -> Bbadd9)
    chords = [
        [130.81, 196.00, 233.08, 293.66, 311.13],  # Cm9
        [103.83, 155.56, 196.00, 261.63, 311.13],  # Abmaj7
        [155.56, 233.08, 293.66, 392.00, 466.16],  # Ebmaj7
        [116.54, 174.61, 261.63, 293.66, 349.23],  # Bbadd9
    ]
    bass_roots = [65.41, 51.91, 77.78, 58.27]

    left = np.zeros(n, dtype=np.float64)
    right = np.zeros(n, dtype=np.float64)

    # 1) Warm Rhodes / analog pad chords with subtle stereo detune & gentle filter envelope
    num_bars = int(math.ceil(total_dur / bar_sec)) + 1
    for bar_idx in range(num_bars):
        st_s = int(bar_idx * bar_sec * SR)
        en_s = min(n, int((bar_idx + 1) * bar_sec * SR))
        if st_s >= n:
            break
        lt = np.arange(en_s - st_s, dtype=np.float64) / SR
        dur_bar = len(lt) / SR
        # Smooth pad envelope with subtle quarter-note breathing
        env = np.minimum(lt / 0.14, 1.0) * np.minimum((dur_bar - lt) / 0.18, 1.0)
        env = np.clip(env, 0.0, 1.0)
        pump = 0.78 + 0.22 * (1.0 - np.exp(-((lt % beat_sec) / 0.11)))

        chord = chords[bar_idx % len(chords)]
        pad_l = np.zeros_like(lt)
        pad_r = np.zeros_like(lt)
        for fi, freq in enumerate(chord):
            # Fundamental + warm 2nd harmonic + gentle 3rd shimmer
            w_l = (
                0.65 * np.sin(2 * np.pi * (freq * 0.9985) * lt + fi * 0.7)
                + 0.24 * np.sin(2 * np.pi * (freq * 2.001) * lt)
                + 0.08 * np.sin(2 * np.pi * (freq * 3.0) * lt) * np.exp(-lt * 1.4)
            )
            w_r = (
                0.65 * np.sin(2 * np.pi * (freq * 1.0015) * lt + fi * 1.3)
                + 0.24 * np.sin(2 * np.pi * (freq * 1.999) * lt)
                + 0.08 * np.sin(2 * np.pi * (freq * 3.0) * lt) * np.exp(-lt * 1.4)
            )
            pad_l += w_l
            pad_r += w_r

        pad_l = (pad_l / len(chord)) * env * pump * 0.22
        pad_r = (pad_r / len(chord)) * env * pump * 0.22

        # Warm sub-bass synced to bar
        bfreq = bass_roots[bar_idx % len(bass_roots)]
        sub = (0.75 * np.sin(2 * np.pi * bfreq * lt) + 0.25 * np.sin(2 * np.pi * (bfreq * 2) * lt)) * env * pump * 0.18

        left[st_s:en_s] += pad_l + sub
        right[st_s:en_s] += pad_r + sub

        # Subtle modern arpeggiated glass pluck on 8th notes
        arp_notes = [chord[1] * 2, chord[2] * 2, chord[3] * 2, chord[4] * 2]
        eighth = beat_sec / 2.0
        for step in range(8):
            ast = st_s + int(step * eighth * SR)
            aen = min(n, ast + int(0.32 * SR))
            if ast >= n:
                break
            at = np.arange(aen - ast, dtype=np.float64) / SR
            af = arp_notes[step % len(arp_notes)]
            aenv = np.exp(-at * 11.0) * np.minimum(at / 0.008, 1.0)
            pluck = (np.sin(2 * np.pi * af * at) + 0.3 * np.sin(2 * np.pi * af * 2 * at)) * aenv * 0.055
            pan = 0.35 if step % 2 == 0 else 0.65
            left[ast:aen] += pluck * (1.0 - pan)
            right[ast:aen] += pluck * pan

    # 2) Soft muted kick pulse on beat 1 & 3 + delicate lo-fi hat tick on 8ths
    rng = np.random.default_rng(42)
    num_beats = int(math.ceil(total_dur / beat_sec))
    for b_idx in range(num_beats):
        kst = int(b_idx * beat_sec * SR)
        if b_idx % 2 == 0:
            ken = min(n, kst + int(0.18 * SR))
            if kst < n:
                kt = np.arange(ken - kst, dtype=np.float64) / SR
                f_sweep = 48.0 + 75.0 * np.exp(-kt * 28.0)
                phase = 2 * np.pi * np.cumsum(f_sweep) / SR
                kick = np.sin(phase) * np.exp(-kt * 16.0) * 0.22
                left[kst:ken] += kick
                right[kst:ken] += kick

        # Soft brushed hi-hat on off-beat 8th
        hst = kst + int((beat_sec * 0.5) * SR)
        hen = min(n, hst + int(0.055 * SR))
        if hst < n:
            ht = np.arange(hen - hst, dtype=np.float64) / SR
            noise = rng.normal(0.0, 1.0, len(ht))
            # Simple 1st-order high-pass diff for crisp airy tick
            hp = np.diff(noise, prepend=0.0)
            hat = hp * np.exp(-ht * 55.0) * 0.025
            left[hst:hen] += hat * 0.85
            right[hst:hen] += hat * 1.15

    # 3) Subtle cinematic transition whoosh + soft sub-drop on every scene cut
    for ct in cut_times:
        # Whoosh swell leading into cut (-0.28s to +0.12s)
        wst = max(0, int((ct - 0.28) * SR))
        wen = min(n, int((ct + 0.14) * SR))
        if wen > wst:
            wt = np.arange(wen - wst, dtype=np.float64) / SR
            peak = min(0.28, (wen - wst) / SR * 0.65)
            wenv = np.exp(-((wt - peak) ** 2) / (2 * (0.09 ** 2)))
            wn = rng.normal(0.0, 1.0, len(wt))
            # Moving average low-pass for smooth airy swoosh
            k = np.ones(18) / 18.0
            smooth_n = np.convolve(wn, k, mode="same")
            whoosh = smooth_n * wenv * 0.12
            left[wst:wen] += whoosh
            right[wst:wen] += whoosh
        # Soft sub accent right at cut
        sst = max(0, int(ct * SR))
        sen = min(n, int((ct + 0.22) * SR))
        if sen > sst:
            st_t = np.arange(sen - sst, dtype=np.float64) / SR
            sf = 92.0 * np.exp(-st_t * 10.0) + 46.0
            sphase = 2 * np.pi * np.cumsum(sf) / SR
            subhit = np.sin(sphase) * np.exp(-st_t * 12.0) * 0.14
            left[sst:sen] += subhit
            right[sst:sen] += subhit

    # Global gentle fade-in (0.35s) and smooth fade-out (1.1s)
    fin = min(n, int(0.35 * SR))
    fout = min(n, int(1.1 * SR))
    left[:fin] *= np.linspace(0.0, 1.0, fin)
    right[:fin] *= np.linspace(0.0, 1.0, fin)
    left[-fout:] *= np.linspace(1.0, 0.0, fout)
    right[-fout:] *= np.linspace(1.0, 0.0, fout)

    # Soft limiter & write 16-bit PCM WAV
    stereo = np.stack([left, right], axis=1)
    peak = np.max(np.abs(stereo)) + 1e-9
    if peak > 0.88:
        stereo = stereo * (0.88 / peak)
    pcm = (np.clip(stereo, -1.0, 1.0) * 32767.0).astype(np.int16)

    with wave.open(str(wav_out), "wb") as wf:
        wf.setnchannels(2)
        wf.setsampwidth(2)
        wf.setframerate(SR)
        wf.writeframes(pcm.tobytes())


def main():
    if len(sys.argv) < 3:
        print("Usage: python3 generate_reel_audio.py <spec.json> <out_dir>", file=sys.stderr)
        sys.exit(1)

    spec_path = Path(sys.argv[1])
    out_dir = Path(sys.argv[2])
    out_dir.mkdir(parents=True, exist_ok=True)
    work_dir = out_dir / "_audio_tmp"
    work_dir.mkdir(parents=True, exist_ok=True)

    spec = json.loads(spec_path.read_text(encoding="utf-8"))
    beats = build_beat_scripts(spec)

    has_voice = False
    beat_timings = []
    all_cues = []
    voice_wav_parts = []
    cursor = 0.25  # 250ms crisp visual hook lead-in before narrator speaks

    try:
        beat_tts = asyncio.run(synth_edge_tts_beats(beats, work_dir))
        has_voice = True
        print("[AUDIO] Generated Microsoft Neural AI Voiceover (en-US-AndrewMultilingualNeural) across all 5 beats.")
    except Exception as exc:
        print(f"[AUDIO WARN] edge-tts unavailable ({exc}); falling back to Silicon Valley studio soundtrack + timed kinetic captions.")
        beat_tts = None

    for idx, b in enumerate(beats):
        if has_voice and beat_tts is not None:
            info = beat_tts[idx]
            vdur = info["voice_dur"]
            beat_start = 0.0 if idx == 0 else cursor
            speech_start = cursor
            beat_dur = (speech_start - beat_start) + vdur + b["pad_after"]
            beat_end = beat_start + beat_dur

            shifted_words = [
                {
                    "word": w["word"],
                    "start": round(speech_start + w["start"], 3),
                    "end": round(speech_start + w["end"], 3),
                }
                for w in info["words"]
            ]
            all_cues.extend(chunk_words(shifted_words, max_words=4))
            beat_timings.append({
                "id": b["id"],
                "start": round(beat_start, 3),
                "end": round(beat_end, 3),
                "duration": round(beat_dur, 3),
                "display": b["display"],
            })

            # Pad individual beat MP3 with exact lead/trail silence into a 48kHz stereo WAV segment
            seg_wav = work_dir / f"seg_{idx}.wav"
            lead_ms = int(round((speech_start - beat_start) * 1000))
            subprocess.run(
                [
                    "ffmpeg", "-y", "-loglevel", "error",
                    "-i", str(info["mp3"]),
                    "-af", f"adelay={lead_ms}|{lead_ms},apad=pad_dur={b['pad_after']:.3f}",
                    "-t", f"{beat_dur:.3f}",
                    "-ar", str(SR), "-ac", "2",
                    str(seg_wav),
                ],
                check=True,
            )
            voice_wav_parts.append(seg_wav)
            cursor = beat_end
        else:
            # Offline fallback timing
            toks = b["speech"].split()
            vdur = max(2.2, len(toks) / 2.85)
            beat_start = 0.0 if idx == 0 else cursor
            speech_start = cursor
            beat_dur = (speech_start - beat_start) + vdur + b["pad_after"]
            beat_end = beat_start + beat_dur
            step = vdur / max(len(toks), 1)
            shifted_words = [
                {
                    "word": w,
                    "start": round(speech_start + k * step, 3),
                    "end": round(speech_start + (k + 1) * step, 3),
                }
                for k, w in enumerate(toks)
            ]
            all_cues.extend(chunk_words(shifted_words, max_words=4))
            beat_timings.append({
                "id": b["id"],
                "start": round(beat_start, 3),
                "end": round(beat_end, 3),
                "duration": round(beat_dur, 3),
                "display": b["display"],
            })
            cursor = beat_end

    total_dur = round(cursor, 3)
    cut_times = [bt["start"] for bt in beat_timings[1:]]

    music_wav = work_dir / "music_bed.wav"
    synthesize_silicon_valley_music(total_dur, cut_times, music_wav)

    audio_out = out_dir / "reel_audio.m4a"
    if has_voice and voice_wav_parts:
        concat_list = work_dir / "concat.txt"
        concat_list.write_text("\n".join(f"file '{p.resolve()}'" for p in voice_wav_parts) + "\n", encoding="utf-8")
        full_vo = work_dir / "full_vo.wav"
        subprocess.run(
            ["ffmpeg", "-y", "-loglevel", "error", "-f", "concat", "-safe", "0", "-i", str(concat_list), "-c", "copy", str(full_vo)],
            check=True,
        )
        # Master: crisp broadcast voice + sidechain-ducked Silicon Valley soundtrack
        fc = (
            "[0:a]highpass=f=85,equalizer=f=3200:t=q:w=1.2:g=2.8,"
            "acompressor=threshold=-18dB:ratio=3:attack=10:release=120,volume=1.35,asplit=2[vo_main][vo_sc];"
            "[1:a]volume=0.34[mus_pre];"
            "[mus_pre][vo_sc]sidechaincompress=threshold=0.02:ratio=5:attack=25:release=320[mus_ducked];"
            "[vo_main][mus_ducked]amix=inputs=2:duration=longest:dropout_transition=0:normalize=0,"
            "alimiter=limit=0.95[aout]"
        )
        subprocess.run(
            [
                "ffmpeg", "-y", "-loglevel", "error",
                "-i", str(full_vo),
                "-i", str(music_wav),
                "-filter_complex", fc,
                "-map", "[aout]",
                "-t", f"{total_dur:.3f}",
                "-c:a", "aac", "-b:a", "160k", "-ar", str(SR), "-ac", "2",
                str(audio_out),
            ],
            check=True,
        )
    else:
        subprocess.run(
            [
                "ffmpeg", "-y", "-loglevel", "error",
                "-i", str(music_wav),
                "-af", "volume=0.85,alimiter=limit=0.95",
                "-t", f"{total_dur:.3f}",
                "-c:a", "aac", "-b:a", "160k", "-ar", str(SR), "-ac", "2",
                str(audio_out),
            ],
            check=True,
        )

    timeline = {
        "total_duration": total_dur,
        "has_voice": has_voice,
        "beats": beat_timings,
        "captions": all_cues,
    }
    (out_dir / "reel_timeline.json").write_text(json.dumps(timeline, indent=2), encoding="utf-8")

    # Clean temp files
    import shutil
    shutil.rmtree(work_dir, ignore_errors=True)
    print(f"[AUDIO] Mastered {audio_out} (dur={total_dur:.2f}s, voice={has_voice}, cues={len(all_cues)})")


if __name__ == "__main__":
    main()
