#!/usr/bin/env python3
"""
Olven Tech 2.1 — 5-Genre Cinema Score & Tactile Physics Foley Engine
Pure Python + NumPy + FFmpeg -> 48kHz stereo 192k AAC (100% original, zero copyright risk).

5 distinct musical worlds matching our 5 Continuous-Flow 30fps Physics-Cinema Reels:
  1. physics_bottleneck    — 118-BPM Apple Marimba + Warm Rhodes + Wooden Collision Ticks
  2. domino_chain_reaction — 110-BPM Luxury Watch-Ad Deep Sub Pluck + Sequential Ivory Domino Clacks + Rewind Whoosh
  3. alarm_storm_signal    — 124-BPM Pulsing Midnight Synth-Tension -> Silky Filter Sweep -> Calm Warm Piano Dawn
  4. laser_cash_shredder   — 120-BPM Funky Ramp Electro-Pluck + Soft Laser Scan + Cash Flicks -> Emerald Vault Chime
  5. retry_storm_wave      — 126-BPM Bauhaus Driving Percussive Pulse + Tidal Swell -> Laminar Glass Calm
"""
import math
import subprocess
import sys
import wave
from pathlib import Path
import numpy as np

SR = 48000


def _mix(left, right, start_s, sig, pan=0.0):
    i0 = max(0, int(start_s * SR))
    i1 = min(len(left), i0 + len(sig))
    if i1 <= i0:
        return
    seg = sig[: i1 - i0]
    gl = math.sqrt(0.5 * (1.0 - pan))
    gr = math.sqrt(0.5 * (1.0 + pan))
    left[i0:i1] += seg * gl
    right[i0:i1] += seg * gr


def synth_marimba(freq, dur=0.22, amp=0.30):
    t = np.arange(int(dur * SR), dtype=np.float64) / SR
    sig = (
        0.78 * np.sin(2 * np.pi * freq * t)
        + 0.18 * np.sin(2 * np.pi * freq * 3.98 * t) * np.exp(-t * 24.0)
        + 0.08 * np.sin(2 * np.pi * freq * 2.0 * t) * np.exp(-t * 14.0)
    )
    env = np.minimum(t / 0.004, 1.0) * np.exp(-t * (10.5 / max(dur, 0.15)))
    return amp * sig * env


def synth_tick(freq=520.0, amp=0.22):
    dur = 0.055
    t = np.arange(int(dur * SR), dtype=np.float64) / SR
    f = freq * (1.0 - 0.35 * (t / dur))
    ph = 2 * np.pi * np.cumsum(f) / SR
    return amp * np.sin(ph) * np.minimum(t / 0.002, 1.0) * np.exp(-t * 72.0)


def synth_domino_clack(pitch=1.0, amp=0.38):
    """Tactile luxury ivory domino clack with deep wooden body resonance."""
    dur = 0.12
    t = np.arange(int(dur * SR), dtype=np.float64) / SR
    rng = np.random.default_rng(int(pitch * 1000) % 9999)
    click = rng.normal(0.0, 0.55, len(t)) * np.exp(-t * 90.0)
    body = (
        0.7 * np.sin(2 * np.pi * (440.0 * pitch) * t) * np.exp(-t * 36.0)
        + 0.4 * np.sin(2 * np.pi * (1120.0 * pitch) * t) * np.exp(-t * 58.0)
        + 0.45 * np.sin(2 * np.pi * (120.0 * pitch) * t) * np.exp(-t * 22.0)
    )
    return amp * np.tanh((click + body) * 1.2)


def synth_vinyl_stop(amp=0.48):
    dur = 0.34
    t = np.arange(int(dur * SR), dtype=np.float64) / SR
    u = t / dur
    freq = 420.0 * np.exp(-3.4 * u) + 42.0
    ph = 2 * np.pi * np.cumsum(freq) / SR
    sig = 0.65 * np.sin(ph) + 0.25 * np.sin(2 * ph) + 0.10 * np.sin(3 * ph)
    return amp * np.tanh(sig * 1.1) * np.minimum(t / 0.012, 1.0) * (1.0 - u) ** 0.7


def synth_iris_bloom(amp=0.68, root=44.0):
    dur = 1.15
    n = int(dur * SR)
    t = np.arange(n, dtype=np.float64) / SR
    f_sub = root + 55.0 * np.exp(-t * 6.5)
    sub = np.sin(2 * np.pi * np.cumsum(f_sub) / SR) * np.minimum(t / 0.015, 1.0) * np.exp(-t * 2.2)
    shim = np.zeros(n, dtype=np.float64)
    for k, cf in enumerate([523.25, 659.25, 783.99, 1046.50]):
        shim += (0.20 / (k + 1)) * np.sin(2 * np.pi * cf * t) * np.minimum(t / 0.08, 1.0) * np.exp(-t * 2.6)
    return amp * np.tanh((sub * 0.85 + shim * 0.65) * 1.15)


def synth_whoosh_soft(amp=0.36, reverse=False):
    dur = 0.48
    n = int(dur * SR)
    t = np.arange(n, dtype=np.float64) / SR
    u = t / dur
    rng = np.random.default_rng(77 if not reverse else 88)
    silky = np.convolve(rng.normal(0.0, 1.0, n), np.ones(28) / 28.0, mode="same")
    env = (u ** 1.8) * np.minimum((1.0 - u) * 10.0, 1.0) if reverse else (np.sin(np.pi * u) ** 1.6)
    return amp * silky * env


def synth_victory_pad(amp=0.52, notes=None):
    dur = 2.8
    n = int(dur * SR)
    notes = notes or [261.63, 392.00, 493.88, 587.33, 659.25, 783.99]
    out = np.zeros(n, dtype=np.float64)
    for idx, freq in enumerate(notes):
        st = int(idx * 0.05 * SR)
        rem = n - st
        if rem <= 0:
            break
        lt = np.arange(rem, dtype=np.float64) / SR
        w = 0.72 * np.sin(2 * np.pi * freq * lt) + 0.22 * np.sin(2 * np.pi * freq * 2 * lt) * np.exp(-lt * 2.2)
        env = np.minimum(lt / 0.025, 1.0) * np.exp(-lt * 1.45)
        out[st:] += w * env * (0.26 if idx < 3 else 0.19)
    return amp * out


GENRE_CONFIGS = {
    "physics_bottleneck": {
        "bpm": 118.0,
        "chords": [[174.61, 220.00, 261.63, 329.63], [196.00, 246.94, 293.66, 329.63], [220.00, 261.63, 329.63, 392.00], [164.81, 196.00, 246.94, 293.66]],
        "bass": [87.31, 98.00, 110.00, 82.41],
        "scale": [523.25, 587.33, 659.25, 783.99, 880.00, 1046.50],
        "victory": [261.63, 392.00, 493.88, 587.33, 659.25, 783.99],
    },
    "domino_chain_reaction": {
        "bpm": 110.0,
        "chords": [[146.83, 220.00, 261.63, 329.63], [116.54, 174.61, 220.00, 293.66], [130.81, 196.00, 246.94, 293.66], [110.00, 164.81, 220.00, 261.63]],
        "bass": [73.42, 58.27, 65.41, 55.00],
        "scale": [440.00, 523.25, 587.33, 659.25, 783.99, 880.00],
        "victory": [293.66, 440.00, 554.37, 659.25, 739.99, 880.00],
    },
    "alarm_storm_signal": {
        "bpm": 124.0,
        "chords": [[130.81, 155.56, 196.00, 233.08], [103.83, 155.56, 196.00, 261.63], [116.54, 174.61, 233.08, 293.66], [130.81, 196.00, 246.94, 293.66]],
        "bass": [65.41, 51.91, 58.27, 65.41],
        "scale": [392.00, 466.16, 523.25, 622.25, 783.99, 932.33],
        "victory": [261.63, 329.63, 392.00, 493.88, 659.25, 783.99],
    },
    "laser_cash_shredder": {
        "bpm": 120.0,
        "chords": [[164.81, 207.65, 246.94, 311.13], [146.83, 185.00, 220.00, 277.18], [130.81, 164.81, 196.00, 246.94], [123.47, 164.81, 196.00, 246.94]],
        "bass": [82.41, 73.42, 65.41, 61.74],
        "scale": [493.88, 554.37, 659.25, 739.99, 830.61, 987.77],
        "victory": [329.63, 415.30, 493.88, 622.25, 739.99, 987.77],
    },
    "retry_storm_wave": {
        "bpm": 126.0,
        "chords": [[196.00, 246.94, 293.66, 369.99], [164.81, 196.00, 246.94, 293.66], [130.81, 164.81, 196.00, 246.94], [146.83, 185.00, 220.00, 293.66]],
        "bass": [98.00, 82.41, 65.41, 73.42],
        "scale": [587.33, 659.25, 739.99, 880.00, 987.77, 1174.66],
        "victory": [392.00, 493.88, 587.33, 739.99, 880.00, 1174.66],
    },
}


def render_physics_film_audio(total_dur: float, out_m4a: Path, mode: str = "physics_bottleneck"):
    cfg = GENRE_CONFIGS.get(mode, GENRE_CONFIGS["physics_bottleneck"])
    n = int(math.ceil(total_dur * SR))
    left = np.zeros(n, dtype=np.float64)
    right = np.zeros(n, dtype=np.float64)

    bpm = cfg["bpm"]
    beat = 60.0 / bpm
    eighth = beat * 0.5
    rng = np.random.default_rng(int(bpm * 10))
    pause_t, transform_t = 6.10, 7.45

    t_now = 0.0
    step = 0
    while t_now < total_dur - 1.6:
        if pause_t - 0.04 <= t_now < transform_t - 0.04:
            t_now += eighth
            step += 1
            continue

        bar = (step // 8) % len(cfg["chords"])
        is_act34 = t_now >= transform_t

        # Warm muted electronic kick
        if step % 2 == 0:
            tk = np.arange(int(0.14 * SR), dtype=np.float64) / SR
            kf = 45.0 + 78.0 * np.exp(-tk * 30.0)
            kick = (0.24 if is_act34 else 0.17) * np.sin(2 * np.pi * np.cumsum(kf) / SR) * np.exp(-tk * 15.0)
            _mix(left, right, t_now, kick, pan=0.0)

        # Crisp modern rim/finger-snap on beats 2 & 4
        if step % 4 == 2:
            ts = np.arange(int(0.055 * SR), dtype=np.float64) / SR
            snap = (rng.normal(0.0, 0.28, len(ts)) + 0.45 * np.sin(2 * np.pi * 1720.0 * ts)) * np.exp(-ts * 62.0) * 0.15
            _mix(left, right, t_now, snap, pan=0.16)

        # Warm analog bass line
        if step % 8 in (0, 3, 6):
            bf = cfg["bass"][bar]
            tb = np.arange(int(0.32 * SR), dtype=np.float64) / SR
            bass = 0.22 * (0.78 * np.sin(2 * np.pi * bf * tb) + 0.22 * np.sin(2 * np.pi * bf * 2 * tb)) * np.minimum(tb / 0.008, 1.0) * np.exp(-tb * 7.0)
            _mix(left, right, t_now, bass, pan=0.0)

        # Lush Rhodes/synth chord pad on bar downbeat
        if step % 8 == 0:
            bar_d = min(beat * 4.0, total_dur - t_now - 0.2)
            if bar_d > 0.2:
                tp = np.arange(int(bar_d * SR), dtype=np.float64) / SR
                env = np.minimum(tp / 0.04, 1.0) * np.minimum((bar_d - tp) / 0.12, 1.0)
                pad_l = np.zeros_like(tp)
                pad_r = np.zeros_like(tp)
                for cf in cfg["chords"][bar]:
                    pad_l += np.sin(2 * np.pi * cf * 0.9985 * tp) + 0.18 * np.sin(2 * np.pi * cf * 2 * tp) * np.exp(-tp * 3.0)
                    pad_r += np.sin(2 * np.pi * cf * 1.0015 * tp) + 0.18 * np.sin(2 * np.pi * cf * 2 * tp) * np.exp(-tp * 3.0)
                gain = 0.095 if is_act34 else 0.068
                _mix(left, right, t_now, pad_l * env * gain, pan=-0.35)
                _mix(left, right, t_now, pad_r * env * gain, pan=0.35)

        # Genre-specific melodic pluck motif
        if step % 2 == 0 and (t_now < 2.9 or (8.6 <= t_now < 12.4)):
            f_m = cfg["scale"][(step // 2) % len(cfg["scale"])] * (1.0 if is_act34 else 0.75)
            _mix(left, right, t_now, synth_marimba(f_m, 0.18, 0.13), pan=-0.28 if step % 4 == 0 else 0.28)

        t_now += eighth
        step += 1

    # Genre-choreographed tactile physics foley!
    if mode == "domino_chain_reaction":
        # Accelerating ivory domino clacks getting deeper & heavier (2.4s -> 5.4s) -> gold shatter!
        clack_times = [2.45, 3.05, 3.58, 4.04, 4.46, 4.84, 5.20]
        for idx, ct in enumerate(clack_times):
            _mix(left, right, ct, synth_domino_clack(pitch=1.35 - idx * 0.11, amp=0.42), pan=-0.55 + idx * 0.18)
        _mix(left, right, 5.48, synth_iris_bloom(0.70, root=38.0), pan=0.25)
        _mix(left, right, 7.10, synth_whoosh_soft(0.45, reverse=True), pan=0.0)
        _mix(left, right, 8.20, synth_domino_clack(pitch=1.4, amp=0.35), pan=-0.45)
        _mix(left, right, 8.75, synth_iris_bloom(0.58, root=55.0), pan=0.0)
    elif mode == "alarm_storm_signal":
        # Subtle escalating radar sonar pings (never harsh ear-piercing!) -> silky filter sweep!
        for i in range(18):
            pt = 1.6 + i * 0.24
            _mix(left, right, pt, synth_tick(680.0 + (i % 5) * 90.0, amp=0.16 + 0.008 * i), pan=(rng.random() - 0.5) * 0.8)
        _mix(left, right, pause_t - 0.02, synth_vinyl_stop(0.44), pan=0.0)
        _mix(left, right, transform_t, synth_iris_bloom(0.68, root=48.0), pan=0.0)
        _mix(left, right, 8.4, synth_whoosh_soft(0.42), pan=0.0)
    elif mode == "laser_cash_shredder":
        # Crisp scanner hum ticks + paper flicks -> clean deflector pops!
        for i in range(14):
            _mix(left, right, 2.0 + i * 0.28, synth_tick(820.0 - i * 18.0, amp=0.18), pan=(i % 2 - 0.5) * 0.5)
        _mix(left, right, pause_t - 0.02, synth_vinyl_stop(0.46), pan=0.0)
        _mix(left, right, transform_t, synth_iris_bloom(0.70, root=44.0), pan=0.0)
        for i in range(12):
            _mix(left, right, 8.6 + i * 0.24, synth_marimba(cfg["scale"][i % len(cfg["scale"])], 0.16, 0.22), pan=-0.4 + (i / 11.0) * 0.8)
    elif mode == "retry_storm_wave":
        # Escalating synchronized pulse waves -> clean obsidian dam drop!
        for i in range(16):
            _mix(left, right, 2.8 + i * 0.19, synth_tick(380.0 + i * 28.0, amp=0.18 + 0.008 * i), pan=math.sin(i) * 0.55)
        _mix(left, right, pause_t - 0.02, synth_vinyl_stop(0.48), pan=0.0)
        _mix(left, right, transform_t, synth_iris_bloom(0.72, root=42.0), pan=0.0)
        _mix(left, right, 9.0, synth_whoosh_soft(0.38), pan=0.0)
    else:
        # physics_bottleneck
        for i in range(10):
            _mix(left, right, 0.45 + i * 0.16, synth_marimba(cfg["scale"][i % len(cfg["scale"])] * (1.0 + 0.04 * i), 0.12, 0.20), pan=(i - 4.5) * 0.12)
        for i in range(18):
            _mix(left, right, 3.35 + i * 0.135, synth_tick(340.0 + rng.random() * 440.0, amp=0.22), pan=(rng.random() - 0.5) * 0.7)
        _mix(left, right, pause_t - 0.02, synth_vinyl_stop(0.48), pan=0.0)
        _mix(left, right, transform_t, synth_iris_bloom(0.72, root=44.0), pan=0.0)

    # Shimmering payoff cascade in Act 3b + warm Apple-Keynote victory chord in Act 4!
    for i in range(12):
        nf = cfg["scale"][min(i // 2, len(cfg["scale"]) - 1)] * (1.0 if i < 6 else 1.5)
        _mix(left, right, 9.2 + i * 0.21, synth_marimba(nf, 0.22, 0.18), pan=-0.5 + (i / 11.0) * 1.0)
    _mix(left, right, 12.55, synth_victory_pad(0.55, notes=cfg["victory"]), pan=0.0)

    fade_n = int(0.60 * SR)
    if fade_n < n:
        ramp = np.linspace(1.0, 0.0, fade_n)
        left[-fade_n:] *= ramp
        right[-fade_n:] *= ramp

    left = np.tanh(left * 1.18) * 0.90
    right = np.tanh(right * 1.18) * 0.90

    interleaved = np.empty(n * 2, dtype=np.int16)
    interleaved[0::2] = np.clip(left * 32767.0, -32767, 32767).astype(np.int16)
    interleaved[1::2] = np.clip(right * 32767.0, -32767, 32767).astype(np.int16)

    wav_tmp = out_m4a.with_suffix(".tmp.wav")
    with wave.open(str(wav_tmp), "wb") as wf:
        wf.setnchannels(2)
        wf.setsampwidth(2)
        wf.setframerate(SR)
        wf.writeframes(interleaved.tobytes())

    subprocess.run(
        ["ffmpeg", "-y", "-v", "error", "-i", str(wav_tmp), "-c:a", "aac", "-b:a", "192k", "-ar", "48000", "-t", f"{total_dur:.3f}", str(out_m4a)],
        check=True,
    )
    wav_tmp.unlink(missing_ok=True)
    print(f"[Audio 2.1 OK] Mastered {total_dur:.2f}s [{mode} @ {bpm:.0f} BPM] -> {out_m4a}")


if __name__ == "__main__":
    dur = float(sys.argv[1]) if len(sys.argv) > 1 else 16.0
    out = Path(sys.argv[2]) if len(sys.argv) > 2 else Path("/tmp/reel_audio.m4a")
    mode = sys.argv[3] if len(sys.argv) > 3 else "physics_bottleneck"
    render_physics_film_audio(dur, out, mode)
