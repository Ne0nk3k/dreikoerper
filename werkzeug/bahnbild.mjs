// dreikoerper/werkzeug/bahnbild.mjs — ein Umlauf einer Bahn als Bild, für die
// Startseite des öffentlichen Repos (21.10.2026).
//
//   node werkzeug/bahnbild.mjs                      die stabile Bahn bei 1/1/4
//   node werkzeug/bahnbild.mjs --m 1,1,4 --a … --b … --T … --aus bilder/x.png
//
// Wie symbol.mjs: die Bahn wird mit dem Kern gerechnet, was zu sehen ist, ist
// diese Rechnung. Die Schrittweite richtet sich nach dem Weg, nicht nach der
// Zeit — bei engen Begegnungen (hier bis 0,0015) wäre ein fester Zeitschritt
// eine Sehne quer durchs Bild. Am Ende muss die Bahn sich schließen, sonst
// gibt es kein Bild. Farben wie im Labor (Okabe–Ito): Körper 1 blau,
// Körper 2 orange, Körper 3 rosa; die Punkte zeigen die Anfangsaufstellung.

import { mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { HIER, ladeKern } from "../quellen.mjs";
import { schreibePng } from "../bild.mjs";

const K = ladeKern();
const argv = process.argv.slice(2);
const wert = (n, v) => (argv.includes(n) ? argv[argv.indexOf(n) + 1] : v);
const m = wert("--m", "1,1,4").split(",").map(Number);
const a = +wert("--a", "0.80329455331149897894751545304123"), b = +wert("--b", "1.43593335078306727053457398659518");
const T = +wert("--T", "53.25485430443248007068935995289679");
const AUS = join(HIER, wert("--aus", "bilder/bahn-1-1-4.png"));

/* ── die Bahn, Schritt nach Weg ── */
const u = new Float64Array(12), z = new Float64Array(12), alt = new Float64Array(12);
K.EBENEN.euler.anfang(a, b, m, u);
K.zuOrten(u, m, z);
const start = Array.from(z.slice(0, 6)), bahn = [start.slice()];
const DS = 0.002;                                      // höchster Weg eines Körpers je Punkt
let t = 0, dt = T / 20000, schritte = 0;
while (t < T) {
  const h = Math.min(dt, T - t);
  alt.set(u);
  K.taylor(u, m, h, 1e-16);
  K.zuOrten(u, m, z);
  const letzt = bahn[bahn.length - 1];
  const weg = Math.max(...[0, 1, 2].map(c => Math.hypot(z[2 * c] - letzt[2 * c], z[2 * c + 1] - letzt[2 * c + 1])));
  if (weg > DS && h > 1e-12) { u.set(alt); dt = h / 2; continue; }
  bahn.push(Array.from(z.slice(0, 6)));
  t += h; schritte++;
  if (weg < DS / 2) dt = h * 1.5;
}
const schluss = Math.max(...start.map((v, i) => Math.abs(bahn[bahn.length - 1][i] - v)));
if (!(schluss < 1e-8)) throw new Error("die Bahn schließt sich nicht: " + schluss);

/* ── zeichnen: Abdeckung je Körper, dann übereinander ── */
// --breit/--hoch: andere Formate, etwa 1080 × 1920 für eine Instagram-Story (21.10.2026)
const BREIT = +wert("--breit", 1600), HOCH = +wert("--hoch", 900), SS = 2, W = BREIT * SS, H = HOCH * SS, n = W * H;
const KOERPER = [[86, 180, 233], [230, 159, 0], [204, 121, 167]];
let x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity;
for (const p of bahn) for (let c = 0; c < 3; c++) { x0 = Math.min(x0, p[2 * c]); x1 = Math.max(x1, p[2 * c]); y0 = Math.min(y0, p[2 * c + 1]); y1 = Math.max(y1, p[2 * c + 1]); }
const rand = 0.07, mass = Math.min(W * (1 - 2 * rand) / (x1 - x0), H * (1 - 2 * rand) / (y1 - y0));
const mx = (x0 + x1) / 2, my = (y0 + y1) / 2;
const ort = (x, y) => [W / 2 + (x - mx) * mass, H / 2 - (y - my) * mass];

const R = new Float32Array(n), G = new Float32Array(n), B = new Float32Array(n);
for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {           // Grund wie im Labor, zur Mitte heller
  const i = y * W + x, dx = (x - W / 2) / W, dy = (y - H / 2) / H, hell = Math.exp(-(dx * dx + dy * dy) * 3);
  R[i] = 7 + 8 * hell; G[i] = 17 + 16 * hell; B[i] = 27 + 20 * hell;
}
const lw = 2.2 * SS;
for (const c of [2, 0, 1]) {
  const deck = new Float32Array(n), F = KOERPER[c];
  for (let k = 0; k + 1 < bahn.length; k++) {
    const [ax, ay] = ort(bahn[k][2 * c], bahn[k][2 * c + 1]), [bx, by] = ort(bahn[k + 1][2 * c], bahn[k + 1][2 * c + 1]);
    const vx = bx - ax, vy = by - ay, l2 = vx * vx + vy * vy || 1e-12, r = lw;
    const xa = Math.max(0, Math.floor(Math.min(ax, bx) - r)), xb = Math.min(W - 1, Math.ceil(Math.max(ax, bx) + r));
    const ya = Math.max(0, Math.floor(Math.min(ay, by) - r)), yb = Math.min(H - 1, Math.ceil(Math.max(ay, by) + r));
    for (let y = ya; y <= yb; y++) for (let x = xa; x <= xb; x++) {
      const px = x + 0.5 - ax, py = y + 0.5 - ay, s = Math.max(0, Math.min(1, (px * vx + py * vy) / l2));
      const d = Math.hypot(px - s * vx, py - s * vy), v = Math.max(0, Math.min(1, lw / 2 - d + 0.5)), i = y * W + x;
      if (v > deck[i]) deck[i] = v;
    }
  }
  for (let i = 0; i < n; i++) if (deck[i] > 0) { const v = deck[i] * 0.88; R[i] += (F[0] - R[i]) * v; G[i] += (F[1] - G[i]) * v; B[i] += (F[2] - B[i]) * v; }
}
for (let c = 0; c < 3; c++) {                                          // die Anfangsaufstellung
  const [cx, cy] = ort(start[2 * c], start[2 * c + 1]), r = (m[c] > 1 ? 11 : 8) * SS, F = KOERPER[c];
  for (let y = Math.floor(cy - r - 2); y <= Math.ceil(cy + r + 2); y++) for (let x = Math.floor(cx - r - 2); x <= Math.ceil(cx + r + 2); x++) {
    if (x < 0 || y < 0 || x >= W || y >= H) continue;
    const d = Math.hypot(x + 0.5 - cx, y + 0.5 - cy), i = y * W + x;
    const ring = Math.max(0, Math.min(1, r + 1.5 * SS - d + 0.5)), kern = Math.max(0, Math.min(1, r - d + 0.5));
    R[i] += (235 - R[i]) * ring; G[i] += (240 - G[i]) * ring; B[i] += (245 - B[i]) * ring;
    R[i] += (F[0] - R[i]) * kern; G[i] += (F[1] - G[i]) * kern; B[i] += (F[2] - B[i]) * kern;
  }
}
const rgb = new Uint8Array(BREIT * HOCH * 3);
for (let y = 0; y < HOCH; y++) for (let x = 0; x < BREIT; x++) {
  let r = 0, g = 0, bl = 0;
  for (let j = 0; j < SS; j++) for (let k = 0; k < SS; k++) { const i = (y * SS + j) * W + x * SS + k; r += R[i]; g += G[i]; bl += B[i]; }
  const o = (y * BREIT + x) * 3, q = SS * SS;
  rgb[o] = Math.min(255, Math.round(r / q)); rgb[o + 1] = Math.min(255, Math.round(g / q)); rgb[o + 2] = Math.min(255, Math.round(bl / q));
}
mkdirSync(dirname(AUS), { recursive: true });
schreibePng(AUS, BREIT, HOCH, rgb);
console.log(`${AUS}: ${bahn.length} Punkte in ${schritte} Schritten, Schluss nach einem Umlauf ${schluss.toExponential(1)}`);
