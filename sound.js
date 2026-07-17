// Optional UI sound effects (graceful no-op when unavailable)
(function () {
  let audioCtx = null;

  function getContext() {
    if (!audioCtx) {
      try {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      } catch {
        return null;
      }
    }
    return audioCtx;
  }

  function tone(frequency, duration, type = "sine", volume = 0.04) {
    const ctx = getContext();
    if (!ctx) return;

    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();
    oscillator.type = type;
    oscillator.frequency.value = frequency;
    gain.gain.value = volume;
    oscillator.connect(gain);
    gain.connect(ctx.destination);
    oscillator.start();
    oscillator.stop(ctx.currentTime + duration);
  }

  window.soundSystem = {
    playClick() {
      tone(880, 0.05, "triangle", 0.03);
    },
    playSuccess() {
      tone(660, 0.08, "sine", 0.04);
      setTimeout(() => tone(880, 0.1, "sine", 0.04), 80);
    },
    playError() {
      tone(220, 0.12, "square", 0.03);
    },
  };
})();
