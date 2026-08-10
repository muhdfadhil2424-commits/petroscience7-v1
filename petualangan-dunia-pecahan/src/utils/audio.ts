// Web Audio API Synthesizer for game SFX & Cozy Lo-Fi BGM
let audioCtx: AudioContext | null = null;
let bgmOscillators: OscillatorNode[] = [];
let bgmGainNode: GainNode | null = null;
let bgmInterval: number | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioCtxClass) {
      audioCtx = new AudioCtxClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

let hubBgmInterval: number | null = null;

export const toggleLofiBgm = (enable: boolean) => {
  if (!enable) {
    if (hubBgmInterval) {
      clearInterval(hubBgmInterval);
      hubBgmInterval = null;
    }
    return;
  }

  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    if (hubBgmInterval) {
      clearInterval(hubBgmInterval);
    }

    // Relaxing Lo-Fi Chill Chords: Cmaj7 - Am7 - Dm7 - G7
    const chords = [
      { bass: 130.81, notes: [261.63, 329.63, 392.00, 493.88] }, // Cmaj7
      { bass: 110.00, notes: [220.00, 261.63, 329.63, 392.00] }, // Am7
      { bass: 146.83, notes: [293.66, 349.23, 440.00, 523.25] }, // Dm7
      { bass: 98.00,  notes: [196.00, 246.94, 293.66, 349.23] }, // G7
    ];

    let chordIdx = 0;
    const playLofiStep = () => {
      if (!ctx || ctx.state === 'suspended') return;
      const now = ctx.currentTime;
      const current = chords[chordIdx % chords.length];
      chordIdx++;

      // Gentle warm bass note
      const bassOsc = ctx.createOscillator();
      const bassGain = ctx.createGain();
      bassOsc.type = 'triangle';
      bassOsc.frequency.setValueAtTime(current.bass, now);
      bassGain.gain.setValueAtTime(0.04, now);
      bassGain.gain.exponentialRampToValueAtTime(0.001, now + 2.2);
      bassOsc.connect(bassGain);
      bassGain.connect(ctx.destination);
      bassOsc.start(now);
      bassOsc.stop(now + 2.2);

      // Warm chord notes
      current.notes.forEach((freq) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);

        gain.gain.setValueAtTime(0.025, now);
        gain.gain.exponentialRampToValueAtTime(0.0005, now + 2.4);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 2.4);
      });
    };

    playLofiStep();
    hubBgmInterval = window.setInterval(playLofiStep, 2400);
  } catch {
    // ignore
  }
};

export const togglePizzaBgm = (enable: boolean) => {
  if (!enable) {
    if (bgmInterval) {
      clearInterval(bgmInterval);
      bgmInterval = null;
    }
    if (bgmGainNode) {
      try {
        bgmGainNode.gain.linearRampToValueAtTime(0, (audioCtx?.currentTime || 0) + 0.3);
      } catch {
        // ignore
      }
    }
    return;
  }

  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    if (bgmInterval) {
      clearInterval(bgmInterval);
    }

    // Gentle lo-fi warm chord notes: Cmaj7 / Fmaj7 cozy cafe vibe
    const notes = [
      [261.63, 329.63, 392.00, 493.88], // Cmaj7
      [220.00, 261.63, 329.63, 392.00], // Am7
      [174.61, 220.00, 261.63, 329.63], // Fmaj7
      [196.00, 246.94, 293.66, 349.23], // G7
    ];

    let chordIdx = 0;
    const playChord = () => {
      if (!ctx || ctx.state === 'suspended') return;
      const now = ctx.currentTime;
      const currentChord = notes[chordIdx % notes.length];
      chordIdx++;

      currentChord.forEach((freq) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now);

        gain.gain.setValueAtTime(0.02, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 1.8);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 1.8);
      });
    };

    playChord();
    bgmInterval = window.setInterval(playChord, 2200);
  } catch {
    // ignore
  }
};

let pixelBgmInterval: number | null = null;

export const toggleDuniaPixelBgm = (levelId: 1 | 2 | 3 | null, enable: boolean) => {
  if (!enable || !levelId) {
    if (pixelBgmInterval) {
      clearInterval(pixelBgmInterval);
      pixelBgmInterval = null;
    }
    return;
  }

  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    if (pixelBgmInterval) {
      clearInterval(pixelBgmInterval);
    }

    let stepCount = 0;

    const playLevelMusic = () => {
      if (!ctx || ctx.state === 'suspended') return;
      const now = ctx.currentTime;
      stepCount++;

      if (levelId === 1) {
        // 🌿 HUTAN PECAHAN: Calm Lo-Fi Forest Chill
        const forestChords = [
          [349.23, 440.00, 523.25, 659.25], // Fmaj7
          [261.63, 329.63, 392.00, 493.88], // Cmaj7
          [293.66, 349.23, 440.00, 523.25], // Dm7
          [196.00, 246.94, 293.66, 349.23], // G7
        ];
        const chord = forestChords[stepCount % forestChords.length];

        chord.forEach((freq) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, now);
          gain.gain.setValueAtTime(0.02, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 2.0);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now);
          osc.stop(now + 2.0);
        });

        // Gentle Forest Woodwind Chirp
        if (stepCount % 2 === 0) {
          const chirpOsc = ctx.createOscillator();
          const chirpGain = ctx.createGain();
          chirpOsc.type = 'sine';
          chirpOsc.frequency.setValueAtTime(880, now + 0.3);
          chirpOsc.frequency.exponentialRampToValueAtTime(1174.66, now + 0.5);
          chirpGain.gain.setValueAtTime(0.015, now + 0.3);
          chirpGain.gain.exponentialRampToValueAtTime(0.001, now + 0.55);
          chirpOsc.connect(chirpGain);
          chirpGain.connect(ctx.destination);
          chirpOsc.start(now + 0.3);
          chirpOsc.stop(now + 0.55);
        }
      } else if (levelId === 2) {
        // 💎 GUA KRISTAL: Mysterious Crystal Cave Echoes & Twinkles
        const caveChords = [
          [329.63, 392.00, 493.88, 587.33], // Em7
          [246.94, 293.66, 369.99, 440.00], // Bm7
          [220.00, 261.63, 329.63, 392.00], // Am7
          [196.00, 246.94, 293.66, 369.99], // Gmaj7
        ];
        const chord = caveChords[stepCount % caveChords.length];

        chord.forEach((freq) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now);
          gain.gain.setValueAtTime(0.025, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 2.2);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now);
          osc.stop(now + 2.2);
        });

        // Sparkling Crystal Chime Glissando
        const crystalPitches = [1046.50, 1318.51, 1567.98, 2093.00];
        crystalPitches.forEach((p, idx) => {
          const cOsc = ctx.createOscillator();
          const cGain = ctx.createGain();
          cOsc.type = 'sine';
          cOsc.frequency.setValueAtTime(p, now + 0.2 + idx * 0.1);
          cGain.gain.setValueAtTime(0.012, now + 0.2 + idx * 0.1);
          cGain.gain.exponentialRampToValueAtTime(0.0005, now + 0.2 + idx * 0.1 + 0.4);
          cOsc.connect(cGain);
          cGain.connect(ctx.destination);
          cOsc.start(now + 0.2 + idx * 0.1);
          cOsc.stop(now + 0.2 + idx * 0.1 + 0.4);
        });
      } else if (levelId === 3) {
        // 🌈 GUNUNG PELANGI: Epic Adventurous Soaring Chords
        const epicChords = [
          [261.63, 329.63, 392.00, 523.25], // C Major
          [196.00, 246.94, 293.66, 392.00], // G Major
          [220.00, 261.63, 329.63, 440.00], // A Minor
          [174.61, 220.00, 261.63, 349.23], // F Major
        ];
        const chord = epicChords[stepCount % epicChords.length];

        chord.forEach((freq) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, now);
          gain.gain.setValueAtTime(0.035, now);
          gain.gain.exponentialRampToValueAtTime(0.002, now + 1.8);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now);
          osc.stop(now + 1.8);
        });

        // Triumphant Brass/Flute Fanfare Note
        const leadOsc = ctx.createOscillator();
        const leadGain = ctx.createGain();
        leadOsc.type = 'sawtooth';
        const leadNotes = [523.25, 659.25, 783.99, 1046.50];
        leadOsc.frequency.setValueAtTime(leadNotes[stepCount % leadNotes.length], now + 0.1);
        leadGain.gain.setValueAtTime(0.02, now + 0.1);
        leadGain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
        leadOsc.connect(leadGain);
        leadGain.connect(ctx.destination);
        leadOsc.start(now + 0.1);
        leadOsc.stop(now + 0.6);
      }
    };

    playLevelMusic();
    pixelBgmInterval = window.setInterval(playLevelMusic, 2100);
  } catch {
    // ignore
  }
};

export const playSfx = (type: 'click' | 'pop' | 'chime' | 'lock' | 'fanfare' | 'slice' | 'oven' | 'coin' | 'correct' | 'wrong', soundEnabled = true) => {
  if (!soundEnabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;

    if (type === 'correct') {
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();
      osc1.type = 'sine';
      osc2.type = 'triangle';
      osc1.frequency.setValueAtTime(523.25, now); // C5
      osc1.frequency.setValueAtTime(659.25, now + 0.1); // E5
      osc1.frequency.setValueAtTime(783.99, now + 0.2); // G5
      osc2.frequency.setValueAtTime(1046.50, now + 0.3); // C6
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.6);
      osc2.start(now + 0.3);
      osc2.stop(now + 0.6);
    } else if (type === 'wrong') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(300, now);
      osc.frequency.setValueAtTime(220, now + 0.15);
      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.4);
    } else if (type === 'click') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, now);
      osc.frequency.exponentialRampToValueAtTime(800, now + 0.05);
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.05);
    } else if (type === 'pop') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(400, now);
      osc.frequency.exponentialRampToValueAtTime(1200, now + 0.08);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.08);
    } else if (type === 'slice') {
      // Swish / slice noise synth
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.exponentialRampToValueAtTime(150, now + 0.12);
      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.12);
    } else if (type === 'oven') {
      // Warm sizzle oven sound
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(120, now);
      osc.frequency.linearRampToValueAtTime(240, now + 0.4);
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.5);
    } else if (type === 'coin') {
      // Coin ring double chime
      const freqs = [987.77, 1318.51];
      freqs.forEach((f, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, now + i * 0.07);
        gain.gain.setValueAtTime(0.2, now + i * 0.07);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.07 + 0.2);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + i * 0.07);
        osc.stop(now + i * 0.07 + 0.2);
      });
    } else if (type === 'chime') {
      [523.25, 659.25, 783.99, 1046.50].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.06);
        gain.gain.setValueAtTime(0.12, now + idx * 0.06);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.06 + 0.25);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + idx * 0.06);
        osc.stop(now + idx * 0.06 + 0.25);
      });
    } else if (type === 'lock') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.setValueAtTime(180, now + 0.08);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.15);
    } else if (type === 'fanfare') {
      const freqs = [440, 554.37, 659.25, 880];
      freqs.forEach((f, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, now + i * 0.08);
        gain.gain.setValueAtTime(0.18, now + i * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.08 + 0.3);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + i * 0.08);
        osc.stop(now + i * 0.08 + 0.3);
      });
    }
  } catch {
    // ignore audio restrictions
  }
};
