// Synthesized Web Audio API sound generator for kitchen and educational background music

class SoundEffects {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private isBgmOn: boolean = true;
  private bgmInterval: number | null = null;
  private bgmActiveNodes: (AudioNode | OscillatorNode)[] = [];

  private initCtx() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.isMuted) {
      this.stopBGM();
    } else if (this.isBgmOn) {
      this.startBGM();
    }
    return this.isMuted;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public toggleBGM(): boolean {
    this.isBgmOn = !this.isBgmOn;
    if (this.isBgmOn && !this.isMuted) {
      this.startBGM();
    } else {
      this.stopBGM();
    }
    return this.isBgmOn;
  }

  public getBgmOn(): boolean {
    return this.isBgmOn;
  }

  // --- BACKGROUND MUSIC: Cozy Kitchen Lofi/Acoustic Tune ---
  public startBGM() {
    if (this.isMuted || !this.isBgmOn) return;
    this.initCtx();
    if (!this.ctx) return;

    if (this.bgmInterval !== null) {
      // Already running
      return;
    }

    // Cozy C Major 7th chord progression: Cmaj7 -> Am7 -> Dm7 -> G7sus4
    const chords = [
      [261.63, 329.63, 392.0, 493.88], // Cmaj7
      [220.0, 261.63, 329.63, 392.0],  // Am7
      [293.66, 349.23, 440.0, 523.25], // Dm7
      [196.0, 261.63, 392.0, 440.0],   // G7sus4
    ];

    const melodyNotes = [
      523.25, 587.33, 659.25, 783.99, 880.0, 1046.5, // C5, D5, E5, G5, A5, C6
    ];

    let step = 0;

    const playChordStep = () => {
      if (this.isMuted || !this.isBgmOn || !this.ctx) return;

      const currentChord = chords[step % chords.length];
      const now = this.ctx.currentTime;

      // Play soft warm chord pad
      currentChord.forEach((freq) => {
        try {
          if (!this.ctx) return;
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();

          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now);

          gain.gain.setValueAtTime(0.001, now);
          gain.gain.linearRampToValueAtTime(0.025, now + 0.3);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 2.2);

          osc.connect(gain);
          gain.connect(this.ctx.destination);

          osc.start(now);
          osc.stop(now + 2.3);
        } catch {
          // ignore
        }
      });

      // Play gentle marimba-like acoustic melody note
      const randomMelody = melodyNotes[Math.floor(Math.random() * melodyNotes.length)];
      try {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(randomMelody, now + 0.2);

        gain.gain.setValueAtTime(0.001, now + 0.2);
        gain.gain.linearRampToValueAtTime(0.04, now + 0.25);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now + 0.2);
        osc.stop(now + 1.25);
      } catch {
        // ignore
      }

      step++;
    };

    playChordStep();
    this.bgmInterval = window.setInterval(playChordStep, 2400);
  }

  public stopBGM() {
    if (this.bgmInterval !== null) {
      clearInterval(this.bgmInterval);
      this.bgmInterval = null;
    }
  }

  // --- SOUND EFFECTS ---

  // Soft click / item selection
  public playPop() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(400, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(800, this.ctx.currentTime + 0.08);

      gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.01, this.ctx.currentTime + 0.08);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.08);
    } catch {
      // ignore audio errors
    }
  }

  // Success chime for completing an ingredient task
  public playSuccess() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime + idx * 0.08);

        gain.gain.setValueAtTime(0.2, this.ctx.currentTime + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + idx * 0.08 + 0.35);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(this.ctx.currentTime + idx * 0.08);
        osc.stop(this.ctx.currentTime + idx * 0.08 + 0.4);
      });
    } catch {
      // ignore audio errors
    }
  }

  // 🍗 BUNYI MENGGORENG (FRYING SIZZLE SOUND) for Ayam Crispy / Karipap
  public playFryingSound(durationSec = 2.5) {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const bufferSize = this.ctx.sampleRate * durationSec;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);

      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      // Bandpass filter for sizzling oil frequencies
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(2800, now);
      filter.Q.setValueAtTime(1.8, now);

      // Highpass to add crisp crackles
      const highpass = this.ctx.createBiquadFilter();
      highpass.type = 'highpass';
      highpass.frequency.setValueAtTime(1200, now);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.01, now);
      gain.gain.linearRampToValueAtTime(0.22, now + 0.3);
      gain.gain.setValueAtTime(0.2, now + durationSec - 0.4);
      gain.gain.linearRampToValueAtTime(0.001, now + durationSec);

      noise.connect(filter);
      filter.connect(highpass);
      highpass.connect(gain);
      gain.connect(this.ctx.destination);

      noise.start(now);
      noise.stop(now + durationSec);

      // Add random pop/crackle bursts (hot oil pops)
      for (let p = 0; p < 8; p++) {
        const popTime = now + 0.2 + Math.random() * (durationSec - 0.5);
        const popOsc = this.ctx.createOscillator();
        const popGain = this.ctx.createGain();

        popOsc.type = 'triangle';
        popOsc.frequency.setValueAtTime(600 + Math.random() * 800, popTime);
        popGain.gain.setValueAtTime(0.12, popTime);
        popGain.gain.exponentialRampToValueAtTime(0.001, popTime + 0.04);

        popOsc.connect(popGain);
        popGain.connect(this.ctx.destination);

        popOsc.start(popTime);
        popOsc.stop(popTime + 0.05);
      }
    } catch {
      // ignore
    }
  }

  // 🥤 BUNYI AIR DIBUAT (LIQUID POURING & STIRRING SOUND) for Sirap Bandung / Water
  public playLiquidPouringSound(durationSec = 2.5) {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const bufferSize = this.ctx.sampleRate * durationSec;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);

      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      // Resonant lowpass filter that sweeps up to simulate container filling with liquid
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(400, now);
      filter.frequency.exponentialRampToValueAtTime(1600, now + durationSec);
      filter.Q.setValueAtTime(5, now);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.01, now);
      gain.gain.linearRampToValueAtTime(0.18, now + 0.2);
      gain.gain.setValueAtTime(0.15, now + durationSec - 0.3);
      gain.gain.linearRampToValueAtTime(0.001, now + durationSec);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      noise.start(now);
      noise.stop(now + durationSec);

      // Add ice clinking / spoon stirring sound chimes
      [0.4, 0.9, 1.5, 2.0].forEach((clinkTimeOffset) => {
        if (!this.ctx) return;
        const clinkTime = now + clinkTimeOffset;
        const osc = this.ctx.createOscillator();
        const clinkGain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(1800 + Math.random() * 600, clinkTime);
        clinkGain.gain.setValueAtTime(0.08, clinkTime);
        clinkGain.gain.exponentialRampToValueAtTime(0.001, clinkTime + 0.12);

        osc.connect(clinkGain);
        clinkGain.connect(this.ctx.destination);

        osc.start(clinkTime);
        osc.stop(clinkTime + 0.15);
      });
    } catch {
      // ignore
    }
  }

  // 🎂 BUNYI KEK DIBAKAR (CAKE BAKING & OVEN DING SOUND) for Kek Coklat
  public playBakingSound(durationSec = 2.5) {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;

      // 1. Gentle warm oven fan hum
      const fanOsc = this.ctx.createOscillator();
      const fanGain = this.ctx.createGain();

      fanOsc.type = 'sine';
      fanOsc.frequency.setValueAtTime(110, now); // Low hum

      fanGain.gain.setValueAtTime(0.01, now);
      fanGain.gain.linearRampToValueAtTime(0.1, now + 0.3);
      fanGain.gain.setValueAtTime(0.1, now + durationSec - 0.5);
      fanGain.gain.linearRampToValueAtTime(0.001, now + durationSec);

      fanOsc.connect(fanGain);
      fanGain.connect(this.ctx.destination);

      fanOsc.start(now);
      fanOsc.stop(now + durationSec);

      // 2. Soft baking warmth sizzle
      const bufferSize = this.ctx.sampleRate * (durationSec - 0.5);
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(800, now);
      filter.Q.setValueAtTime(3, now);

      const noiseGain = this.ctx.createGain();
      noiseGain.gain.setValueAtTime(0.05, now);
      noiseGain.gain.linearRampToValueAtTime(0.001, now + durationSec - 0.5);

      noise.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(this.ctx.destination);

      noise.start(now);
      noise.stop(now + durationSec - 0.5);

      // 3. Classic Oven Bell Timer "DING!" when cake finishes baking
      const dingTime = now + durationSec - 0.6;
      const dingOsc = this.ctx.createOscillator();
      const dingGain = this.ctx.createGain();

      dingOsc.type = 'sine';
      dingOsc.frequency.setValueAtTime(1567.98, dingTime); // G6 note chime

      dingGain.gain.setValueAtTime(0.3, dingTime);
      dingGain.gain.exponentialRampToValueAtTime(0.0001, dingTime + 1.2);

      dingOsc.connect(dingGain);
      dingGain.connect(this.ctx.destination);

      dingOsc.start(dingTime);
      dingOsc.stop(dingTime + 1.25);
    } catch {
      // ignore
    }
  }

  // General Cooking/Stirring Sound
  public playCookingSound() {
    this.playFryingSound(1.8);
  }

  // Error / Try again buzzer sound
  public playTryAgain() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, this.ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(180, this.ctx.currentTime + 0.2);

      gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.01, this.ctx.currentTime + 0.2);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.2);
    } catch {
      // ignore
    }
  }
}

export const sounds = new SoundEffects();

