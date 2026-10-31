// Irregular torn-paper edge (deterministic). Returns clip polygons for the two halves, the seam path, and fibre fringes.
function rng(seed: number) { return () => { seed |= 0; seed = (seed + 0x6d2b79f5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
export function tear(h: number, seed = 7, step = 14) {
  const r = rng(seed); const n = Math.ceil(h / step);
  const jl: number[] = [], gap: number[] = [], ys: number[] = [];
  let j = 10;
  for (let i = 0; i <= n; i++) {
    j += (r() - 0.5) * 12; if (r() < 0.12) j += (r() - 0.5) * 22; j = Math.max(2, Math.min(24, j));
    jl.push(j); gap.push(8 + r() * 9); ys.push(Math.min(h, i * step));
  }
  const left = "polygon(0 0, " + ys.map((y, i) => `calc(100% - ${jl[i].toFixed(1)}px) ${y}px`).join(", ") + `, 0 ${h}px)`;
  const right = "polygon(" + ys.map((y, i) => `${(30 - jl[i] + gap[i]).toFixed(1)}px ${y}px`).join(", ") + `, 100% ${h}px, 100% 0)`;
  const mid = ys.map((y, i) => `${(22 - jl[i] + gap[i] / 2).toFixed(1)},${y}`);
  const seam = "M" + mid.join(" L");
  const fibL = "M" + ys.map((y, i) => `${(22 - jl[i] - 0.8).toFixed(1)},${y}`).join(" L");
  const fibR = "M" + ys.map((y, i) => `${(22 - jl[i] + gap[i] + 0.8).toFixed(1)},${y}`).join(" L");
  return { left, right, seam, fibL, fibR, h };
}
