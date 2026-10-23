(() => {
  'use strict';
  // All sound is synthesized locally. No audio files, microphones, or third-party sound requests.
  class VoyageSoundscape {
    constructor() { this.context = null; this.enabled = false; this.volume = .35; this.kind = 'clear'; this.thunderTimer = null; }
    build() {
      const Audio = window.AudioContext || window.webkitAudioContext;
      if (!Audio) throw new Error('Audio is unavailable in this browser.');
      const context = this.context = new Audio();
      this.master = context.createGain();
      this.master.gain.value = 0;
      const limiter = context.createDynamicsCompressor();
      limiter.threshold.value = -18; limiter.knee.value = 12; limiter.ratio.value = 8; limiter.attack.value = .01; limiter.release.value = .5;
      this.master.connect(limiter); limiter.connect(context.destination);
      const length = Math.floor(context.sampleRate * 6);
      this.noise = context.createBuffer(1, length, context.sampleRate);
      this.brown = context.createBuffer(1, length, context.sampleRate);
      const white = this.noise.getChannelData(0), brown = this.brown.getChannelData(0);
      let previous = 0;
      for (let i = 0; i < length; i++) { white[i] = Math.random() * 2 - 1; previous = (previous + .025 * white[i]) / 1.025; brown[i] = previous * 3.8; }
      this.layers = {};
      for (const [name, type, frequency] of [['sea','lowpass',650],['wind','bandpass',350],['rain','highpass',1200]]) {
        const source = context.createBufferSource(), filter = context.createBiquadFilter(), gain = context.createGain();
        source.buffer = name === 'sea' ? this.brown : this.noise; source.loop = true;
        filter.type = type; filter.frequency.value = frequency; filter.Q.value = .4;
        gain.gain.value = 0; source.connect(filter); filter.connect(gain); gain.connect(this.master); source.start();
        this.layers[name] = gain;
      }
      // A slow swell gives the surf a breathing rhythm instead of static hiss.
      const swell = context.createOscillator(), swellDepth = context.createGain();
      swell.frequency.value = .11; swellDepth.gain.value = .045;
      swell.connect(swellDepth); swellDepth.connect(this.layers.sea.gain); swell.start();
    }
    async start() {
      if (!this.context) this.build();
      await this.context.resume();
      if (this.context.state !== 'running') throw new Error('Tap Enable sound again to start audio.');
      this.enabled = true; this.adjust();
    }
    async stop() { this.enabled = false; clearTimeout(this.thunderTimer); if (this.context) { this.master.gain.value = 0; await this.context.suspend(); } }
    setVolume(value) { this.volume = Math.min(1, Math.max(0, Number(value) || 0)); this.adjust(); }
    setWeather(kind) { this.kind = kind; this.adjust(); }
    adjust() {
      clearTimeout(this.thunderTimer);
      if (!this.context || !this.enabled || document.hidden) return;
      const now = this.context.currentTime;
      const storm = this.kind === 'storm', wet = storm || this.kind === 'rain', windy = storm || this.kind === 'wind';
      this.master.gain.setTargetAtTime(this.volume * .65, now, .35);
      this.layers.sea.gain.setTargetAtTime(storm ? .45 : .23, now, 1);
      this.layers.wind.gain.setTargetAtTime(windy ? .24 : .025, now, 1);
      this.layers.rain.gain.setTargetAtTime(wet ? .11 : 0, now, 1);
      if (storm) this.scheduleThunder();
    }
    scheduleThunder() {
      this.thunderTimer = setTimeout(() => {
        if (!this.enabled || document.hidden || this.kind !== 'storm') return;
        const context = this.context, now = context.currentTime;
        const rumble = context.createBufferSource(), filter = context.createBiquadFilter(), envelope = context.createGain();
        rumble.buffer = this.brown; filter.type = 'lowpass'; filter.frequency.value = 180;
        envelope.gain.setValueAtTime(0, now); envelope.gain.linearRampToValueAtTime(.65, now + .7); envelope.gain.exponentialRampToValueAtTime(.001, now + 4.5);
        rumble.connect(filter); filter.connect(envelope); envelope.connect(this.master); rumble.start(); rumble.stop(now + 5);
        rumble.onended = () => { rumble.disconnect(); filter.disconnect(); envelope.disconnect(); };
        this.scheduleThunder();
      }, 18000 + Math.random() * 20000);
    }
    async visibility() {
      clearTimeout(this.thunderTimer);
      if (!this.context || !this.enabled) return;
      if (document.hidden) { this.master.gain.value = 0; await this.context.suspend(); }
      else { await this.context.resume(); this.adjust(); }
    }
  }
  window.VoyageSoundscape = VoyageSoundscape;
})();
