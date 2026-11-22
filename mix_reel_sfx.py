#!/usr/bin/env python3
"""
Olven Tech — Pure-Stdlib Entertainment Audio & Synced UI Sound Effects Mixer
Zero external dependencies (uses only math, struct, wave, subprocess + ffmpeg).

Mixes an upbeat modern rhythmic pulse over the background music bed AND layers
millisecond-accurate, pleasant Apple-style UI SFX synced to every story beat:
  - 0.95s: Notification Ping #2 (urgent two-tone crystal ding)
  - 2.05s: Notification Panic #3 (high urgency double-pop)
  - 3.80s, 4.95s: Crisp iMessage/Slack message pop
  - 6.10s: Hero Olven Tech entrance shimmer
  - 7.65s, 8.55s, 9.45s: 3 ascending tactile Apple switch clicks
  - 10.85s: Big Payoff Victory harmonic chord
  - 11.70s: Happy CFO reply pop
"""
import math
import struct
import subprocess
import sys
import wave
from pathlib import Path

SR = 44100
DUR = 16.0
N = int(SR * DUR)


def add_tone(buf, start_s, dur_s, f0, f1, amp, harmonic=0.25):
    i0 = max(0, int(start_s * SR))
    n = int(dur_s * SR)
    i1 = min(len(buf), i0 + n)
    phase = 0.0
    for i in range(i0, i1):
        t = (i - i0) / SR
        u = t / dur_s
        freq = f0 + (f1 - f0) * u
        phase += 2.0 * math.pi * freq / SR
        env = min(1.0, t / 0.008) * math.exp(-5.8 * u)
        s = math.sin(phase) + harmonic * math.sin(2.0 * phase)
        buf[i] += amp * env * s


def add_pop(buf, start_s, amp=0.34, pitch=1.0):
    add_tone(buf, start_s, 0.11, 360 * pitch, 780 * pitch, amp, harmonic=0.18)


def add_notif_ding(buf, start_s, amp=0.30, urgent=False):
    base = 987.77 if not urgent else 1174.66
    add_tone(buf, start_s, 0.24, base, base, amp, harmonic=0.30)
    add_tone(buf, start_s + 0.085, 0.30, base * 1.25, base * 1.25, amp * 0.9, harmonic=0.25)


def add_switch_click(buf, start_s, step_idx, amp=0.30):
    notes = [587.33, 739.99, 880.00]  # D5, F#5, A5 ascending dopamine trio
    f = notes[step_idx % len(notes)]
    add_tone(buf, start_s, 0.045, 1600, 900, amp * 0.45, harmonic=0.1)
    add_tone(buf, start_s + 0.012, 0.26, f, f, amp, harmonic=0.28)


def add_victory_chord(buf, start_s, amp=0.22):
    for k, freq in enumerate([523.25, 659.25, 783.99, 1046.50]):  # C5 major 7 shimmer
        add_tone(buf, start_s + k * 0.035, 0.85, freq, freq, amp * (1.0 - 0.12 * k), harmonic=0.22)


def add_soft_pulse(buf, bpm=116.0):
    beat = 60.0 / bpm
    t = 0.0
    step = 0
    while t < DUR - 0.1:
        # Warm subtle low pulse on quarter beats (keeps momentum upbeat, never sleepy!)
        if step % 2 == 0:
            add_tone(buf, t, 0.14, 118.0, 52.0, 0.15, harmonic=0.08)
        else:
            # Subtle crisp off-beat woodblock/rim tick
            add_tone(buf, t, 0.038, 1380.0, 1120.0, 0.055, harmonic=0.12)
        t += beat * 0.5
        step += 1


def build_sfx_wav(out_wav: Path):
    buf = [0.0] * N
    add_soft_pulse(buf, bpm=116.0)

    # Beat 1: Phone Lockscreen Notifications
    add_notif_ding(buf, 0.95, amp=0.32, urgent=False)
    add_notif_ding(buf, 2.05, amp=0.34, urgent=True)

    # Beat 2: Live Group-Chat Drama
    add_pop(buf, 3.80, amp=0.32, pitch=0.95)
    add_pop(buf, 4.95, amp=0.32, pitch=1.10)
    # Olven Tech Enters the Chat shimmer
    add_tone(buf, 6.08, 0.40, 659.25, 659.25, 0.22, harmonic=0.25)
    add_tone(buf, 6.16, 0.45, 987.77, 987.77, 0.24, harmonic=0.25)

    # Beat 3: 3 Ascending Interactive Fix Switches
    add_switch_click(buf, 7.65, 0, amp=0.30)
    add_switch_click(buf, 8.55, 1, amp=0.31)
    add_switch_click(buf, 9.45, 2, amp=0.33)

    # Beat 4: Giant Emerald Payoff + CFO Happy Reply
    add_victory_chord(buf, 10.85, amp=0.22)
    add_pop(buf, 11.75, amp=0.32, pitch=1.22)

    # Beat 5: Brand Drop subtle lift
    add_tone(buf, 13.75, 0.55, 783.99, 783.99, 0.18, harmonic=0.22)

    # Soft limiter & 16-bit stereo WAV write
    pcm = bytearray(N * 4)
    for i, x in enumerate(buf):
        y = math.tanh(x * 1.15) * 0.88
        v = max(-32767, min(32767, int(y * 32767)))
        struct.pack_into("<hh", pcm, i * 4, v, v)

    with wave.open(str(out_wav), "wb") as wf:
        wf.setnchannels(2)
        wf.setsampwidth(2)
        wf.setframerate(SR)
        wf.writeframes(pcm)


def mix_audio(music_path: str, out_m4a: str):
    out_p = Path(out_m4a)
    sfx_wav = out_p.with_suffix(".sfx.wav")
    build_sfx_wav(sfx_wav)
    subprocess.run([
        "ffmpeg", "-y", "-v", "error",
        "-i", music_path,
        "-i", str(sfx_wav),
        "-filter_complex",
        "[0:a]volume=0.44,atrim=0:16.0,afade=t=in:st=0:d=0.3,afade=t=out:st=15.2:d=0.8[m];"
        "[1:a]volume=0.95,atrim=0:16.0[s];"
        "[m][s]amix=inputs=2:duration=longest:normalize=0,alimiter=limit=0.95[out]",
        "-map", "[out]",
        "-c:a", "aac", "-b:a", "192k", "-ar", "48000",
        "-t", "16.0",
        str(out_p),
    ], check=True)
    sfx_wav.unlink(missing_ok=True)


if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python3 mix_reel_sfx.py <music.mp3> <out.m4a>")
        sys.exit(1)
    mix_audio(sys.argv[1], sys.argv[2])
