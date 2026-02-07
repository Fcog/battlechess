/**
 * Plays a short sound for a chess move. Uses Web Audio API (no external file).
 * Call from a user gesture (e.g. after piece drop) to satisfy browser autoplay.
 */
export function playMoveSound(): void {
  if (typeof window === "undefined" || typeof window.AudioContext === "undefined") return;
  try {
    const Ctx = window.AudioContext;
    const ctx = new Ctx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = 520;
    osc.type = "sine";
    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.08);
  } catch {
    // Ignore if AudioContext fails (e.g. autoplay policy)
  }
}
