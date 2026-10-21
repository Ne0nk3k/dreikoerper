// dreikoerper/bild.mjs — PNG schreiben ohne Fremdpaket (nur node:zlib).
//
// Für die Karten der Suchläufe: ein Bild sagt, wo gesucht und was gefunden
// wurde, und es lässt sich ansehen, ohne das Labor zu öffnen.

import { deflateSync } from "node:zlib";
import { writeFileSync } from "node:fs";

const CRC = (() => { const t = new Uint32Array(256); for (let n = 0; n < 256; n++) { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; t[n] = c >>> 0; } return t; })();
function crc(buf) { let c = 0xffffffff; for (let i = 0; i < buf.length; i++) c = CRC[(c ^ buf[i]) & 255] ^ (c >>> 8); return (c ^ 0xffffffff) >>> 0; }
function stueck(typ, daten) {
  const kopf = Buffer.alloc(8); kopf.writeUInt32BE(daten.length, 0); kopf.write(typ, 4, "ascii");
  const ende = Buffer.alloc(4); ende.writeUInt32BE(crc(Buffer.concat([kopf.subarray(4), daten])), 0);
  return Buffer.concat([kopf, daten, ende]);
}
// rgb: Uint8Array(w*h*3), Zeile 0 oben.
export function schreibePng(pfad, w, h, rgb) {
  const roh = Buffer.alloc((w * 3 + 1) * h);
  for (let y = 0; y < h; y++) { roh[y * (w * 3 + 1)] = 0; Buffer.from(rgb.buffer, rgb.byteOffset + y * w * 3, w * 3).copy(roh, y * (w * 3 + 1) + 1); }
  const ihdr = Buffer.alloc(13); ihdr.writeUInt32BE(w, 0); ihdr.writeUInt32BE(h, 4); ihdr[8] = 8; ihdr[9] = 2;
  writeFileSync(pfad, Buffer.concat([Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), stueck("IHDR", ihdr), stueck("IDAT", deflateSync(roh, { level: 9 })), stueck("IEND", Buffer.alloc(0))]));
}

// Farbskala für den Wiederkehrabstand: dunkel = weit weg, hell = nah.
// Stützstellen aus der Skala „magma" (von Hand, fünf Punkte), linear dazwischen.
const SKALA = [[4, 5, 14], [59, 15, 112], [140, 41, 129], [222, 73, 104], [254, 159, 109], [252, 253, 191]];
export function farbe(v) {               // v in 0..1
  v = v < 0 ? 0 : v > 1 ? 1 : v;
  const x = v * (SKALA.length - 1), i = Math.min(SKALA.length - 2, Math.floor(x)), f = x - i;
  return [0, 1, 2].map(k => Math.round(SKALA[i][k] + f * (SKALA[i + 1][k] - SKALA[i][k])));
}

// Karte N×N (Zeile 0 = kleinstes b) → PNG, b nach oben. marken: [{i, j, art}]
// art 0 = Fund im Katalog (weißer Ring), 1 = Fund nicht im Katalog (grüner
// Punkt mit Ring), 2 = Katalogeintrag, nicht gefunden (rotes Kreuz).
export function karteAlsPng(pfad, d, N, marken, mass) {
  const k = mass || 1, W = N * k, rgb = new Uint8Array(W * W * 3);
  for (let j = 0; j < N; j++) for (let i = 0; i < N; i++) {
    const w = d[j * N + i];
    // −log10(d): 0.5 (d = 0.3) … 3.5 (d = 3e-4)
    const c = Number.isFinite(w) ? farbe((-Math.log10(Math.max(w, 1e-9)) + 0.5) / 4) : [22, 26, 32];
    for (let a = 0; a < k; a++) for (let b = 0; b < k; b++) {
      const o = ((W - 1 - (j * k + a)) * W + i * k + b) * 3;
      rgb[o] = c[0]; rgb[o + 1] = c[1]; rgb[o + 2] = c[2];
    }
  }
  const punkt = (x, y, c) => { if (x >= 0 && y >= 0 && x < W && y < W) { const o = ((W - 1 - y) * W + x) * 3; rgb[o] = c[0]; rgb[o + 1] = c[1]; rgb[o + 2] = c[2]; } };
  for (const m of marken || []) {
    const x = Math.round(m.i * k), y = Math.round(m.j * k), r = 5;
    if (m.art === 2) { for (let s = -r; s <= r; s++) { punkt(x + s, y + s, [255, 70, 70]); punkt(x + s, y - s, [255, 70, 70]); punkt(x + s + 1, y + s, [255, 70, 70]); punkt(x + s + 1, y - s, [255, 70, 70]); } continue; }
    const c = m.art === 1 ? [80, 255, 160] : [255, 255, 255];
    for (let w = 0; w < 64; w++) { const a = w * Math.PI / 32; punkt(Math.round(x + r * Math.cos(a)), Math.round(y + r * Math.sin(a)), c); if (m.art === 1) punkt(Math.round(x + (r + 1) * Math.cos(a)), Math.round(y + (r + 1) * Math.sin(a)), c); }
    if (m.art === 1) for (let a = -1; a <= 1; a++) for (let b = -1; b <= 1; b++) punkt(x + a, y + b, c);
  }
  schreibePng(pfad, W, W, rgb);
}
