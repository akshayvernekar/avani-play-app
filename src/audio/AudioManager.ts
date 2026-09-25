/**
 * Reusable Audio Manager for Avani's Little World
 * Handles button taps, piece pickups, magnetic snaps, spoken vocabulary, and celebration fanfares.
 * Synthesizes audio using Web Audio API and Web Speech API so it works seamlessly offline and on mobile browsers.
 */

class AudioManager {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private isUnlocked: boolean = false;

  constructor() {
    this.setupUnlockListeners();
  }

  private initCtx() {
    if (!this.ctx) {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtxClass) {
        this.ctx = new AudioCtxClass();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  private setupUnlockListeners() {
    const unlock = () => {
      this.initCtx();
      this.isUnlocked = true;

      // Warm up SpeechSynthesis for mobile iOS Safari & Android Chrome
      if ('speechSynthesis' in window) {
        try {
          window.speechSynthesis.getVoices();
          const dummy = new SpeechSynthesisUtterance('');
          dummy.volume = 0;
          window.speechSynthesis.speak(dummy);
        } catch (e) {
          // ignore warmup errors
        }
      }

      window.removeEventListener('pointerdown', unlock);
      window.removeEventListener('touchstart', unlock);
    };

    window.addEventListener('pointerdown', unlock);
    window.addEventListener('touchstart', unlock);
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.isMuted) {
      this.stopCurrentAudio();
      this.stopAartiMantra();
    }
    return this.isMuted;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  /**
   * Cheerful button tap sound
   */
  public playTap() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, this.ctx.currentTime + 0.08);

      gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.08);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.08);
    } catch (e) {
      console.warn('Audio play error:', e);
    }
  }

  /**
   * Piece pickup sound
   */
  public playPickup() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(320, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(600, this.ctx.currentTime + 0.1);

      gain.gain.setValueAtTime(0.25, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.1);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.1);
    } catch (e) {
      console.warn(e);
    }
  }

  /**
   * Magnetic snap sound
   */
  public playSnap() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc1.type = 'triangle';
      osc1.frequency.setValueAtTime(600, this.ctx.currentTime);
      osc1.frequency.exponentialRampToValueAtTime(1200, this.ctx.currentTime + 0.06);

      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(250, this.ctx.currentTime);
      osc2.frequency.exponentialRampToValueAtTime(500, this.ctx.currentTime + 0.06);

      gain.gain.setValueAtTime(0.4, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.07);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(this.ctx.destination);

      osc1.start();
      osc2.start();
      osc1.stop(this.ctx.currentTime + 0.07);
      osc2.stop(this.ctx.currentTime + 0.07);
    } catch (e) {
      console.warn(e);
    }
  }

  /**
   * Celebration Fanfare
   */
  public playCelebration() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        const startTime = this.ctx.currentTime + idx * 0.12;

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, startTime);

        gain.gain.setValueAtTime(0.3, startTime);
        gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.35);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + 0.35);
      });
    } catch (e) {
      console.warn(e);
    }
  }

  /**
   * Object specific sound effect
   */
  public playObjectSound(effectType: string) {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      if (effectType === 'bark') {
        [0, 0.15].forEach(delay => {
          if (!this.ctx) return;
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(220, now + delay);
          osc.frequency.linearRampToValueAtTime(110, now + delay + 0.12);

          gain.gain.setValueAtTime(0.3, now + delay);
          gain.gain.exponentialRampToValueAtTime(0.01, now + delay + 0.12);

          osc.connect(gain);
          gain.connect(this.ctx.destination);

          osc.start(now + delay);
          osc.stop(now + delay + 0.12);
        });
      } else if (effectType === 'engine' || effectType === 'vroom') {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(80, now);
        osc.frequency.linearRampToValueAtTime(250, now + 0.3);
        osc.frequency.linearRampToValueAtTime(120, now + 0.6);

        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.6);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.6);
      } else if (effectType === 'ocean_splash' || effectType === 'splash') {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(600, now);
        osc.frequency.exponentialRampToValueAtTime(200, now + 0.4);

        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.4);
      } else {
        this.playCelebration();
      }
    } catch (e) {
      console.warn(e);
    }
  }

  private currentAudio: HTMLAudioElement | null = null;

  /**
   * Stop any currently playing pre-recorded audio or speech synthesis
   */
  public stopCurrentAudio() {
    if (this.currentAudio) {
      try {
        this.currentAudio.pause();
        this.currentAudio.currentTime = 0;
      } catch (e) {
        // ignore
      }
      this.currentAudio = null;
    }
    if ('speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch (e) {
        // ignore
      }
    }
  }

  /**
   * Plays a pre-recorded audio file (e.g. from ElevenLabs audio_gungun).
   * Automatically resolves base URL if relative path provided.
   */
  public playAudioFile(filePath: string, onStart?: () => void, onEnd?: () => void): HTMLAudioElement | null {
    if (this.isMuted) {
      if (onEnd) onEnd();
      return null;
    }

    this.stopCurrentAudio();

    // Resolve URL with BASE_URL if relative path without leading slash or protocol
    let fullUrl = filePath;
    if (!filePath.startsWith('http://') && !filePath.startsWith('https://')) {
      const baseUrl = import.meta.env.BASE_URL.replace(/\/$/, '') + '/';
      const cleanPath = filePath.startsWith('/') ? filePath.slice(1) : filePath;
      fullUrl = `${baseUrl}${cleanPath}`;
    }

    const audio = new Audio(fullUrl);
    this.currentAudio = audio;

    audio.onplay = () => {
      if (onStart) onStart();
    };

    audio.onended = () => {
      if (this.currentAudio === audio) {
        this.currentAudio = null;
      }
      if (onEnd) onEnd();
    };

    audio.onerror = (e) => {
      console.warn(`Failed to play audio file: ${fullUrl}`, e);
      if (this.currentAudio === audio) {
        this.currentAudio = null;
      }
      if (onEnd) onEnd();
    };

    audio.play().catch(err => {
      console.warn(`Audio play() interrupted or failed: ${fullUrl}`, err);
      if (this.currentAudio === audio) {
        this.currentAudio = null;
      }
      if (onEnd) onEnd();
    });

    return audio;
  }

  /**
   * Spoken vocabulary word using Web Speech API fallback
   */
  public speak(text: string, onStart?: () => void, onEnd?: () => void) {
    if (this.isMuted) {
      if (onEnd) onEnd();
      return;
    }

    this.stopCurrentAudio();

    if ('speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
        if (window.speechSynthesis.paused) {
          window.speechSynthesis.resume();
        }

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'en-IN';
        utterance.rate = 0.85;
        utterance.pitch = 1.1;
        utterance.volume = 1.0;

        utterance.onstart = () => {
          if (onStart) onStart();
        };

        utterance.onend = () => {
          if (onEnd) onEnd();
        };

        utterance.onerror = () => {
          if (onEnd) onEnd();
        };

        const voices = window.speechSynthesis.getVoices();
        if (voices && voices.length > 0) {
          const preferredVoice = voices.find(
            v => v.lang.startsWith('en') && (v.name.includes('Samantha') || v.name.includes('Karen') || v.name.includes('Daniel') || v.name.includes('Google') || v.name.includes('Natural'))
          ) || voices.find(v => v.lang.startsWith('en-IN'));

          if (preferredVoice) {
            utterance.voice = preferredVoice;
          }
        }

        window.speechSynthesis.speak(utterance);
      } catch (err) {
        console.warn('Speech synthesis error:', err);
        if (onEnd) onEnd();
      }
    } else {
      if (onEnd) onEnd();
    }
  }
  /**
   * Puja audio effects: soft chime for flower / offering placement
   */
  public playChime() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const notes = [880, 1046, 1318];
      notes.forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const startTime = now + idx * 0.08;

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, startTime);

        gain.gain.setValueAtTime(0.25, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.35);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + 0.35);
      });
    } catch (e) {
      console.warn(e);
    }
  }

  /**
   * Temple bell sound for garland snap
   */
  public playBell() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const notes = [523, 659, 784];
      notes.forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const startTime = now + idx * 0.1;

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, startTime);

        gain.gain.setValueAtTime(0.35, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.6);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + 0.6);
      });
    } catch (e) {
      console.warn(e);
    }
  }

  /**
   * Diya lighting whoosh sound
   */
  public playFlameWhoosh() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(400, now);
      osc.frequency.exponentialRampToValueAtTime(200, now + 0.3);

      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.3);
    } catch (e) {
      console.warn(e);
    }
  }

  /**
   * Looping temple bells during Aarti. Returns a stop function.
   */
  public playAartiBells(): () => void {
    if (this.isMuted) return () => {};
    this.initCtx();
    if (!this.ctx) return () => {};

    let stopped = false;
    const notes = [659.25, 783.99, 880.0, 987.77, 1046.5];
    let noteIdx = 0;

    const intervalId = window.setInterval(() => {
      if (stopped || !this.ctx || this.isMuted) return;
      try {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const now = this.ctx.currentTime;

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(notes[noteIdx % notes.length], now);
        noteIdx++;

        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.28);
      } catch (e) {
        console.warn(e);
      }
    }, 180);

    return () => {
      stopped = true;
      clearInterval(intervalId);
    };
  }

  private aartiAudio: HTMLAudioElement | null = null;

  /**
   * Plays the Ganapati Mantra mp3 during Aarti.
   * Loops while Aarti is in progress. Returns a stop function.
   */
  public playAartiMantra(): () => void {
    this.stopAartiMantra();
    if (this.isMuted) return () => {};

    const baseUrl = import.meta.env.BASE_URL.replace(/\/$/, '') + '/';
    const mantraUrl = `${baseUrl}assets/puja/aarti/ganapati_mantra.mp3`;

    try {
      const audio = new Audio(mantraUrl);
      audio.loop = true;
      audio.volume = 0.9;
      this.aartiAudio = audio;

      audio.play().catch(err => {
        console.warn('Audio play() interrupted or failed for Ganapati mantra:', err);
      });

      return () => {
        this.stopAartiMantra();
      };
    } catch (e) {
      console.warn('Error playing Aarti mantra:', e);
      return () => {};
    }
  }

  /**
   * Stop Ganapati Mantra audio, optionally fading it out gently
   */
  public stopAartiMantra(fade: boolean = false) {
    if (!this.aartiAudio) return;
    const audio = this.aartiAudio;
    this.aartiAudio = null;

    if (fade && audio.volume > 0.05) {
      const fadeInterval = window.setInterval(() => {
        if (audio.volume > 0.1) {
          audio.volume = Math.max(0, audio.volume - 0.15);
        } else {
          clearInterval(fadeInterval);
          try {
            audio.pause();
            audio.currentTime = 0;
          } catch (e) {}
        }
      }, 70);
    } else {
      try {
        audio.pause();
        audio.currentTime = 0;
      } catch (e) {}
    }
  }
}

export const audioManager = new AudioManager();

