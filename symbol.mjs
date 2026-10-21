// dreikoerper/symbol.mjs — das Symbol des Labors, gezeichnet aus der Bahn selbst.
//
//   node symbol.mjs
//
// Die Acht (Moore 1993, Chenciner und Montgomery 2000) wird mit dem Kern aus
// den Anfangswerten der Quelle gerechnet; was im Symbol zu sehen ist, ist
// diese Bahn, nicht eine Zeichnung von ihr. Drei Körper, jeder mit seiner
// Spur, auf dunklem Grund — dieselben Farben wie im Labor.
//
// Schreibt nach symbol\:
//   dreikoerper.ico        16, 24, 32, 48, 64, 128 (als Bitmap) und 256 (als PNG)
//   dreikoerper-256.png    dasselbe Bild einzeln
//   dreikoerper-128.png    das Seitensymbol, das bauen.mjs ins Labor einbettet
//   ansicht.png            alle Größen vergrößert nebeneinander, auf dunklem und
//                          hellem Grund — zum Ansehen, nicht zum Ausliefern
//
// Eigener PNG- und ICO-Schreiber; außer zlib aus Node nichts.

import { writeFileSync, readFileSync, mkdirSync } from "node:fs";
import { deflateSync } from "node:zlib";
import { join } from "node:path";
import { HIER, ladeKern } from "./quellen.mjs";

const K = ladeKern();

/* ── die Bahn ── */
const [a, b, T] = readFileSync(join(HIER, "quelle", "hristov", "euler", "100_12431.txt"), "utf8").split(/\r?\n/)[0].trim().split(/\s+/).map(Number);
const m = [1, 1, 1], u = new Float64Array(12), z = new Float64Array(12);
K.EBENEN.euler.anfang(a, b, m, u);
const N = 1440, bahn = [];
for (let k = 0; k <= N; k++) {
  K.zuOrten(u, m, z);
  bahn.push([z[0], z[1], z[2], z[3], z[4], z[5]]);
  if (k < N) K.taylor(u, m, T / N, 1e-16);
}
const schluss = Math.max(...[0, 1, 2, 3, 4, 5].map(i => Math.abs(bahn[N][i] - bahn[0][i])));
if (!(schluss < 1e-9)) throw new Error("die Acht schließt sich nicht: " + schluss);

// Lage im Bild: leicht gekippt, auf die Breite eingepasst
const KIPP = -13 * Math.PI / 180, ck = Math.cos(KIPP), sk = Math.sin(KIPP);
const dreh = (x, y) => [x * ck - y * sk, x * sk + y * ck];
let xm = 0, ym = 0;
for (const p of bahn) for (let i = 0; i < 3; i++) { const [x, y] = dreh(p[2 * i], p[2 * i + 1]); xm = Math.max(xm, Math.abs(x)); ym = Math.max(ym, Math.abs(y)); }
const JETZT = Math.round(N * 0.055);                 // der gezeigte Augenblick: kurz nach der Euler-Aufstellung
const SPUR = Math.round(N * 0.17);                   // Länge der Spur hinter jedem Körper
const KOERPER = [[86, 180, 233], [230, 159, 0], [204, 121, 167]];   // Okabe–Ito wie im Labor
const AKZENT = [96, 214, 180];

/* ── zeichnen ── */
function zeichne(S) {
  const ss = S >= 128 ? 3 : S >= 48 ? 5 : 8, W = S * ss, n = W * W;
  const R = new Float32Array(n), G = new Float32Array(n), B = new Float32Array(n), A = new Float32Array(n);
  const klein = S <= 32;
  // 1 · Grund: abgerundetes Quadrat, oben heller
  const rad = W * 0.225, rand = W * 0.012;
  for (let y = 0; y < W; y++) for (let x = 0; x < W; x++) {
    const dx = Math.max(rad - x - 0.5, x + 0.5 - (W - rad), 0), dy = Math.max(rad - y - 0.5, y + 0.5 - (W - rad), 0);
    const d = Math.hypot(dx, dy) - rad;                       // < 0 innen
    if (d > 0) continue;
    const i = y * W + x, t = y / W;
    const mx = (x - W / 2) / W, my = (y - W * 0.46) / W, hell = Math.exp(-(mx * mx + my * my) * 7);
    R[i] = 13 - 8 * t + 10 * hell; G[i] = 36 - 22 * t + 26 * hell; B[i] = 52 - 30 * t + 30 * hell; A[i] = 1;
    if (!klein && d > -rand) { const f = 0.10; R[i] += (255 - R[i]) * f; G[i] += (255 - G[i]) * f; B[i] += (255 - B[i]) * f; }
  }
  // Bahn → Bildpunkte
  const mass = W * (klein ? 0.40 : 0.385) / xm;
  const ort = (x, y) => { const [p, q] = dreh(x, y); return [W / 2 + p * mass, W / 2 - q * mass]; };
  // 2 · die Bahn: Abstandsfeld zur Kurve, daraus Schein und Linie
  const lw = Math.max(W * 0.030, 1.25 * ss), schein = W * 0.050, reich = Math.ceil(Math.max(3 * schein, lw));
  const dist = new Float32Array(n).fill(1e9);
  for (let k = 0; k < N; k += 2) {
    const [x0, y0] = ort(bahn[k][0], bahn[k][1]), [x1, y1] = ort(bahn[k + 2 > N ? N : k + 2][0], bahn[k + 2 > N ? N : k + 2][1]);
    const vx = x1 - x0, vy = y1 - y0, l2 = vx * vx + vy * vy || 1e-12;
    const ax = Math.max(0, Math.floor(Math.min(x0, x1) - reich)), bx = Math.min(W - 1, Math.ceil(Math.max(x0, x1) + reich));
    const ay = Math.max(0, Math.floor(Math.min(y0, y1) - reich)), by = Math.min(W - 1, Math.ceil(Math.max(y0, y1) + reich));
    for (let y = ay; y <= by; y++) for (let x = ax; x <= bx; x++) {
      const px = x + 0.5 - x0, py = y + 0.5 - y0, t = Math.max(0, Math.min(1, (px * vx + py * vy) / l2));
      const d = Math.hypot(px - t * vx, py - t * vy), i = y * W + x;
      if (d < dist[i]) dist[i] = d;
    }
  }
  for (let i = 0; i < n; i++) {
    if (!A[i] || dist[i] > reich) continue;
    const d = dist[i];
    if (!klein) { const s = 0.34 * Math.exp(-(d / schein) * (d / schein)); R[i] += AKZENT[0] * s; G[i] += AKZENT[1] * s; B[i] += AKZENT[2] * s; }
    const kante = Math.max(0, Math.min(1, lw / 2 - d + 0.5)) * (klein ? 0.80 : 0.62);
    R[i] += (AKZENT[0] - R[i]) * kante; G[i] += (AKZENT[1] - G[i]) * kante; B[i] += (AKZENT[2] - B[i]) * kante;
  }
  // 3 · Spuren und Körper
  const rk = Math.max(W * 0.066, 1.9 * ss);
  const scheibe = (cx, cy, r, fn) => {
    const ax = Math.max(0, Math.floor(cx - r - 1)), bx = Math.min(W - 1, Math.ceil(cx + r + 1)), ay = Math.max(0, Math.floor(cy - r - 1)), by = Math.min(W - 1, Math.ceil(cy + r + 1));
    for (let y = ay; y <= by; y++) for (let x = ax; x <= bx; x++) { const i = y * W + x; if (A[i]) fn(i, Math.hypot(x + 0.5 - cx, y + 0.5 - cy)); }
  };
  for (let c = 0; c < 3; c++) {
    const F = KOERPER[c], deck = new Float32Array(n);
    for (let j = 0; j <= SPUR; j++) {
      const k = ((JETZT - SPUR + j) % N + N) % N, f = j / SPUR, [cx, cy] = ort(bahn[k][2 * c], bahn[k][2 * c + 1]);
      const r = lw * (0.55 + 0.75 * f), al = f * f * 0.95;
      scheibe(cx, cy, r, (i, d) => { const v = al * Math.max(0, Math.min(1, r - d + 0.5)); if (v > deck[i]) deck[i] = v; });
    }
    for (let i = 0; i < n; i++) if (deck[i] > 0) { const v = deck[i]; R[i] += (F[0] - R[i]) * v; G[i] += (F[1] - G[i]) * v; B[i] += (F[2] - B[i]) * v; }
  }
  for (let c = 0; c < 3; c++) {
    const F = KOERPER[c], [cx, cy] = ort(bahn[JETZT][2 * c], bahn[JETZT][2 * c + 1]);
    if (!klein) scheibe(cx, cy, rk * 3.2, (i, d) => { const s = 0.50 * Math.exp(-(d / (rk * 1.25)) * (d / (rk * 1.25))); R[i] += F[0] * s; G[i] += F[1] * s; B[i] += F[2] * s; });
    scheibe(cx, cy, rk, (i, d) => {
      const kante = Math.max(0, Math.min(1, rk - d + 0.5));
      if (!kante) return;
      // Kugel: zur Mitte und nach links oben heller
      const h = Math.max(0, 1 - d / rk), licht = 0.30 + 0.70 * h * h;
      const r = F[0] + (255 - F[0]) * licht * 0.85, g = F[1] + (255 - F[1]) * licht * 0.85, bl = F[2] + (255 - F[2]) * licht * 0.85;
      R[i] += (r - R[i]) * kante; G[i] += (g - G[i]) * kante; B[i] += (bl - B[i]) * kante;
    });
  }
  // 4 · herunterrechnen
  const aus = new Uint8Array(S * S * 4), q = ss * ss;
  for (let y = 0; y < S; y++) for (let x = 0; x < S; x++) {
    let r = 0, g = 0, bl = 0, al = 0;
    for (let v = 0; v < ss; v++) for (let w = 0; w < ss; w++) { const i = (y * ss + v) * W + x * ss + w; r += R[i] * A[i]; g += G[i] * A[i]; bl += B[i] * A[i]; al += A[i]; }
    const o = (y * S + x) * 4;
    if (al > 0) { aus[o] = Math.min(255, Math.round(r / al)); aus[o + 1] = Math.min(255, Math.round(g / al)); aus[o + 2] = Math.min(255, Math.round(bl / al)); }
    aus[o + 3] = Math.round(255 * al / q);
  }
  return aus;
}

/* ── PNG (RGBA) ── */
const CRC = new Uint32Array(256).map((_, n) => { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; return c >>> 0; });
function crc32(buf) { let c = 0xffffffff; for (let i = 0; i < buf.length; i++) c = CRC[(c ^ buf[i]) & 255] ^ (c >>> 8); return (c ^ 0xffffffff) >>> 0; }
function stueck(typ, daten) {
  const kopf = Buffer.alloc(8); kopf.writeUInt32BE(daten.length, 0); kopf.write(typ, 4, "latin1");
  const ende = Buffer.alloc(4); ende.writeUInt32BE(crc32(Buffer.concat([kopf.subarray(4), daten])), 0);
  return Buffer.concat([kopf, daten, ende]);
}
function png(rgba, w, h) {
  const ihdr = Buffer.alloc(13); ihdr.writeUInt32BE(w, 0); ihdr.writeUInt32BE(h, 4); ihdr[8] = 8; ihdr[9] = 6;
  const roh = Buffer.alloc(h * (w * 4 + 1));
  for (let y = 0; y < h; y++) Buffer.from(rgba.buffer, rgba.byteOffset + y * w * 4, w * 4).copy(roh, y * (w * 4 + 1) + 1);
  return Buffer.concat([Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), stueck("IHDR", ihdr), stueck("IDAT", deflateSync(roh, { level: 9 })), stueck("IEND", Buffer.alloc(0))]);
}

/* ── ICO ── */
function bitmapEintrag(rgba, S) {
  const maskenZeile = Math.ceil(S / 32) * 4, buf = Buffer.alloc(40 + S * S * 4 + maskenZeile * S);
  buf.writeUInt32LE(40, 0); buf.writeInt32LE(S, 4); buf.writeInt32LE(2 * S, 8); buf.writeUInt16LE(1, 12); buf.writeUInt16LE(32, 14);
  buf.writeUInt32LE(S * S * 4 + maskenZeile * S, 20);
  for (let y = 0; y < S; y++) for (let x = 0; x < S; x++) {
    const q = (y * S + x) * 4, o = 40 + ((S - 1 - y) * S + x) * 4;                    // von unten nach oben, BGRA
    buf[o] = rgba[q + 2]; buf[o + 1] = rgba[q + 1]; buf[o + 2] = rgba[q]; buf[o + 3] = rgba[q + 3];
    if (rgba[q + 3] === 0) buf[40 + S * S * 4 + (S - 1 - y) * maskenZeile + (x >> 3)] |= 0x80 >> (x & 7);
  }
  return buf;
}
function ico(bilder) {                                   // bilder: [{ S, daten }]
  const kopf = Buffer.alloc(6 + 16 * bilder.length);
  kopf.writeUInt16LE(1, 2); kopf.writeUInt16LE(bilder.length, 4);
  let ab = kopf.length;
  bilder.forEach(({ S, daten }, i) => {
    const o = 6 + 16 * i;
    kopf[o] = S >= 256 ? 0 : S; kopf[o + 1] = S >= 256 ? 0 : S; kopf.writeUInt16LE(1, o + 4); kopf.writeUInt16LE(32, o + 6);
    kopf.writeUInt32LE(daten.length, o + 8); kopf.writeUInt32LE(ab, o + 12); ab += daten.length;
  });
  return Buffer.concat([kopf, ...bilder.map(x => x.daten)]);
}

/* ── schreiben ── */
const ordner = join(HIER, "symbol");
mkdirSync(ordner, { recursive: true });
const GROESSEN = [16, 24, 32, 48, 64, 128, 256], bild = new Map(GROESSEN.map(S => [S, zeichne(S)]));
writeFileSync(join(ordner, "dreikoerper-256.png"), png(bild.get(256), 256, 256));
writeFileSync(join(ordner, "dreikoerper-128.png"), png(bild.get(128), 128, 128));
const datei = ico(GROESSEN.map(S => ({ S, daten: S === 256 ? png(bild.get(256), 256, 256) : bitmapEintrag(bild.get(S), S) })));
writeFileSync(join(ordner, "dreikoerper.ico"), datei);

// Ansicht: jede Größe auf 256 vergrößert (ganzzahlig, ohne Glättung), oben auf
// dunklem, unten auf hellem Grund; ganz rechts die kleinen in Originalgröße.
{
  const feld = 272, w = feld * GROESSEN.length + 120, h = feld * 2, sheet = new Uint8Array(w * h * 4);
  const grund = y => (y < feld ? [42, 44, 48] : [232, 234, 238]);
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) { const o = (y * w + x) * 4, g = grund(y); sheet[o] = g[0]; sheet[o + 1] = g[1]; sheet[o + 2] = g[2]; sheet[o + 3] = 255; }
  const setze = (rgba, S, f, x0, y0) => {
    for (let y = 0; y < S * f; y++) for (let x = 0; x < S * f; x++) {
      const q = ((y / f | 0) * S + (x / f | 0)) * 4, o = ((y0 + y) * w + x0 + x) * 4, al = rgba[q + 3] / 255;
      for (let c = 0; c < 3; c++) sheet[o + c] = Math.round(rgba[q + c] * al + sheet[o + c] * (1 - al));
    }
  };
  [...GROESSEN].reverse().forEach((S, k) => { const f = Math.floor(256 / S); for (const zeile of [0, 1]) setze(bild.get(S), S, f, k * feld + 8 + (256 - S * f) / 2 | 0, zeile * feld + 8 + (256 - S * f) / 2 | 0); });
  let y = 12;
  for (const S of [48, 32, 24, 16]) { for (const zeile of [0, 1]) setze(bild.get(S), S, 1, feld * GROESSEN.length + 36, zeile * feld + y); y += S + 14; }
  writeFileSync(join(ordner, "ansicht.png"), png(sheet, w, h));
}
console.log(`Acht aus der Quelle: v₁ ${a}, v₂ ${b}, T ${T}; schließt sich nach ${N} Schritten auf ${schluss.toExponential(1)}`);
console.log(`symbol/dreikoerper.ico: ${datei.length} Bytes, Größen ${GROESSEN.join(", ")}`);
