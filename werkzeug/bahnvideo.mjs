// dreikoerper/werkzeug/bahnvideo.mjs — ein Umlauf als Video für eine
// Instagram-Story (21.10.2026, Felix: „Wenig Aufmerksamkeit. Reicht der Link
// aus?“). Die drei Körper fliegen ihre Bahn ab und zeichnen dabei das Muster;
// am Ende steht dasselbe Bild wie bilder/bahn-1-1-4.png.
//
//   node werkzeug/bahnvideo.mjs [--aus ablage/story.mp4] [--sekunden 12] [--halten 3]
//
// Die Bahn wird wie in bahnbild.mjs mit dem Kern gerechnet, Schritt nach Weg,
// und muss sich schließen. Die Zeit im Video läuft gleichmäßig in der Zeit
// der Bahn — bei engen Begegnungen sieht man die Körper wirklich vorbeischießen.
// Bilder gehen roh an ffmpeg (H.264, 1080 × 1920, 30 Bilder/s); ffmpeg mit
// vier Fäden, damit die Last unter der vereinbarten Grenze bleibt.

import { spawn } from "node:child_process";
import { join } from "node:path";
import { HIER, ladeKern } from "../quellen.mjs";

const K = ladeKern();
const argv = process.argv.slice(2);
const wert = (n, v) => (argv.includes(n) ? argv[argv.indexOf(n) + 1] : v);
const AUS = join(HIER, wert("--aus", "ablage/story-bahn-1-1-4.mp4"));
const SEK = +wert("--sekunden", 12), HALT = +wert("--halten", 3), FPS = 30;
const m = [1, 1, 4], a = 0.80329455331149897894751545304123, b = 1.43593335078306727053457398659518;
const T = 53.25485430443248007068935995289679;

/* ── die Bahn, mit Zeitstempel ── */
const u = new Float64Array(12), z = new Float64Array(12), alt = new Float64Array(12);
K.EBENEN.euler.anfang(a, b, m, u);
K.zuOrten(u, m, z);
const bahn = [[...z.slice(0, 6)]], zeit = [0];
const DS = 0.002;
let t = 0, dt = T / 20000;
while (t < T) {
  const h = Math.min(dt, T - t);
  alt.set(u);
  K.taylor(u, m, h, 1e-16);
  K.zuOrten(u, m, z);
  const l = bahn[bahn.length - 1];
  const weg = Math.max(...[0, 1, 2].map(c => Math.hypot(z[2 * c] - l[2 * c], z[2 * c + 1] - l[2 * c + 1])));
  if (weg > DS && h > 1e-12) { u.set(alt); dt = h / 2; continue; }
  bahn.push([...z.slice(0, 6)]); t += h; zeit.push(t);
  if (weg < DS / 2) dt = h * 1.5;
}
const schluss = Math.max(...bahn[0].map((v, i) => Math.abs(bahn[bahn.length - 1][i] - v)));
if (!(schluss < 1e-8)) throw new Error("die Bahn schließt sich nicht: " + schluss);

/* ── Bildaufbau wie bahnbild.mjs, ohne Überabtastung ── */
const W = 1080, H = 1920, n = W * H;
const KOERPER = [[86, 180, 233], [230, 159, 0], [204, 121, 167]];
let x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity;
for (const p of bahn) for (let c = 0; c < 3; c++) { x0 = Math.min(x0, p[2 * c]); x1 = Math.max(x1, p[2 * c]); y0 = Math.min(y0, p[2 * c + 1]); y1 = Math.max(y1, p[2 * c + 1]); }
const mass = Math.min(W * 0.86 / (x1 - x0), H * 0.86 / (y1 - y0)), mx = (x0 + x1) / 2, my = (y0 + y1) / 2;
const ort = (x, y) => [W / 2 + (x - mx) * mass, H / 2 - (y - my) * mass];
const GR = new Float32Array(n * 3);
for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
  const i = (y * W + x) * 3, dx = (x - W / 2) / W, dy = (y - H / 2) / H, hell = Math.exp(-(dx * dx + dy * dy) * 3);
  GR[i] = 7 + 8 * hell; GR[i + 1] = 17 + 16 * hell; GR[i + 2] = 27 + 20 * hell;
}
const deck = [0, 1, 2].map(() => new Float32Array(n)), lw = 2.4;
function strich(c, k) {
  const [ax, ay] = ort(bahn[k][2 * c], bahn[k][2 * c + 1]), [bx, by] = ort(bahn[k + 1][2 * c], bahn[k + 1][2 * c + 1]);
  const vx = bx - ax, vy = by - ay, l2 = vx * vx + vy * vy || 1e-12, D = deck[c];
  const xa = Math.max(0, Math.floor(Math.min(ax, bx) - lw)), xb = Math.min(W - 1, Math.ceil(Math.max(ax, bx) + lw));
  const ya = Math.max(0, Math.floor(Math.min(ay, by) - lw)), yb = Math.min(H - 1, Math.ceil(Math.max(ay, by) + lw));
  for (let y = ya; y <= yb; y++) for (let x = xa; x <= xb; x++) {
    const px = x + 0.5 - ax, py = y + 0.5 - ay, s = Math.max(0, Math.min(1, (px * vx + py * vy) / l2));
    const v = Math.max(0, Math.min(1, lw / 2 - Math.hypot(px - s * vx, py - s * vy) + 0.5)), i = y * W + x;
    if (v > D[i]) D[i] = v;
  }
}
const bild = Buffer.alloc(n * 3);
function zusammensetzen(pos) {
  for (let i = 0, j = 0; i < n; i++, j += 3) {
    let r = GR[j], g = GR[j + 1], bl = GR[j + 2];
    for (const c of [2, 0, 1]) { const v = deck[c][i] * 0.88; if (v) { const F = KOERPER[c]; r += (F[0] - r) * v; g += (F[1] - g) * v; bl += (F[2] - bl) * v; } }
    bild[j] = r; bild[j + 1] = g; bild[j + 2] = bl;
  }
  for (let c = 0; c < 3; c++) {                                   // Körper mit Schein
    const [cx, cy] = ort(pos[2 * c], pos[2 * c + 1]), r0 = m[c] > 1 ? 13 : 10, F = KOERPER[c], R = r0 * 3.5;
    for (let y = Math.max(0, Math.floor(cy - R)); y <= Math.min(H - 1, Math.ceil(cy + R)); y++)
      for (let x = Math.max(0, Math.floor(cx - R)); x <= Math.min(W - 1, Math.ceil(cx + R)); x++) {
        const d = Math.hypot(x + 0.5 - cx, y + 0.5 - cy), j = (y * W + x) * 3;
        const q = d / (r0 * 1.4), schein = 0.55 * Math.exp(-q * q), kern = Math.max(0, Math.min(1, r0 - d + 0.5));
        for (let k = 0; k < 3; k++) {
          let v = bild[j + k] + F[k] * schein;
          v += ((k === 0 ? Math.min(255, F[0] + 60) : k === 1 ? Math.min(255, F[1] + 60) : Math.min(255, F[2] + 60)) - v) * kern;
          bild[j + k] = Math.max(0, Math.min(255, v));
        }
      }
  }
}
function lage(tt) {                                               // Orte zur Zeit tt, linear zwischen den Punkten
  let lo = 0, hi = zeit.length - 1;
  while (hi - lo > 1) { const mid = (lo + hi) >> 1; if (zeit[mid] <= tt) lo = mid; else hi = mid; }
  const f = zeit[hi] > zeit[lo] ? (tt - zeit[lo]) / (zeit[hi] - zeit[lo]) : 0;
  return { k: lo, pos: bahn[lo].map((v, i) => v + (bahn[hi][i] - v) * f) };
}

const ff = spawn("ffmpeg", ["-y", "-loglevel", "error", "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", `${W}x${H}`, "-r", String(FPS), "-i", "-",
  "-c:v", "libx264", "-pix_fmt", "yuv420p", "-crf", "18", "-preset", "medium", "-threads", "4", "-movflags", "+faststart", AUS], { stdio: ["pipe", "inherit", "inherit"] });
const schreib = buf => new Promise(r => (ff.stdin.write(buf) ? r() : ff.stdin.once("drain", r)));
let gezeichnet = 0;
const BILDER = SEK * FPS, ALLE = (SEK + HALT) * FPS, t0 = Date.now();
for (let f = 0; f < ALLE; f++) {
  const tt = Math.min(T, T * f / (BILDER - 1));
  const { k, pos } = lage(tt);
  for (; gezeichnet < Math.min(k, bahn.length - 2); gezeichnet++) for (const c of [0, 1, 2]) strich(c, gezeichnet);
  if (f === BILDER - 1) for (; gezeichnet < bahn.length - 1; gezeichnet++) for (const c of [0, 1, 2]) strich(c, gezeichnet);
  zusammensetzen(f < BILDER ? pos : bahn[0]);
  await schreib(bild);
}
ff.stdin.end();
const ende = await new Promise(r => ff.on("close", r));
console.log(`${AUS}: ${ALLE} Bilder (${SEK + HALT} s), Bahn schließt auf ${schluss.toExponential(1)}, ${((Date.now() - t0) / 1000).toFixed(0)} s, ffmpeg Exit ${ende}`);
process.exit(ende);
