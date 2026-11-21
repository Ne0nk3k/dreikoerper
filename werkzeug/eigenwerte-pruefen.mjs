// Alle 12 Eigenwerte der Monodromie einer Listenbahn, unabhängig von der Spurformel:
// Matrix mit Taylor (Kern) und mit Dormand–Prince (Gegenprobe), charakteristisches Polynom nach
// Faddeev–LeVerrier, Nullstellen nach Durand–Kerner. Ausgabe: Eigenwerte als Betrag und Winkel.
//   node werkzeug/eigenwerte-pruefen.mjs <Name> <m3>
// (12.11.2026, Eichung an Li, Jing & Liao 2018, Tabelle 1: bei I.A-1 (2) zeigen Taylor und Dormand–Prince
// zwei elliptische Paare, Winkel ±2,8851 und ±2,0239 — die Arbeit führt nur das erste und nennt die Bahn marginal)
import { HIER, ladeKern, ladeKatalog } from "../quellen.mjs";
const K = ladeKern(), [name, m3s] = process.argv.slice(2), m3 = +m3s;
const b = ladeKatalog().bahnen.find(k => k.satz === "ungleich" && k.name === name && k.m[2] === m3);
const m = [1, 1, m3], u0 = K.EBENEN.euler.anfang(b.a, b.b, m, new Float64Array(12));
function matrix(Y) { const M = []; for (let i = 0; i < 12; i++) { M.push([]); for (let j = 0; j < 12; j++) M[i].push(Y[12 + 12 * j + i]); } return M; }
const mal = (A, B) => A.map((r, i) => B[0].map((_, j) => r.reduce((s, x, k) => s + x * B[k][j], 0)));
function charPoly(A) { // Faddeev–LeVerrier: p(x) = x^n + c1 x^(n-1) + ... + cn
  const n = A.length, I = A.map((r, i) => r.map((_, j) => (i === j ? 1 : 0))); let Mk = I.map(r => r.slice()), c = [1];
  for (let k = 1; k <= n; k++) { const AM = mal(A, Mk); const ck = -AM.reduce((s, r, i) => s + r[i], 0) / k; c.push(ck);
    Mk = AM.map((r, i) => r.map((x, j) => x + (i === j ? ck : 0))); }
  return c;
}
function wurzeln(c) { // Durand–Kerner, komplex
  const n = c.length - 1; let z = Array.from({ length: n }, (_, k) => [Math.cos(2 * Math.PI * k / n + 0.4) * 1.3, Math.sin(2 * Math.PI * k / n + 0.4) * 1.3]);
  const mul = (a, b) => [a[0] * b[0] - a[1] * b[1], a[0] * b[1] + a[1] * b[0]], div = (a, b) => { const d = b[0] ** 2 + b[1] ** 2; return [(a[0] * b[0] + a[1] * b[1]) / d, (a[1] * b[0] - a[0] * b[1]) / d]; };
  const p = x => { let r = [1, 0]; for (let k = 1; k <= n; k++) { r = mul(r, x); r[0] += c[k]; } return r; };
  for (let it = 0; it < 4000; it++) { let gr = 0;
    z = z.map((zi, i) => { let q = [1, 0]; z.forEach((zj, j) => { if (j !== i) q = mul(q, [zi[0] - zj[0], zi[1] - zj[1]]); }); const d = div(p(zi), q); gr = Math.max(gr, Math.hypot(...d)); return [zi[0] - d[0], zi[1] - d[1]]; });
    if (gr < 1e-14) break; }
  return z;
}
for (const [art, lauf] of [["Taylor", K.macheVariation()], ["Dormand–Prince", K.macheVariationRK()]]) {
  const r = lauf(u0, m, b.T); if (r.art !== 0) { console.log(art, "Abbruch"); continue; }
  const M = matrix(r.y), spur = M.reduce((s, x, i) => s + x[i], 0), z = wurzeln(charPoly(M));
  const w = z.map(([re, im]) => ({ betrag: Math.hypot(re, im), winkel: Math.atan2(im, re) })).sort((x, y) => Math.abs(y.winkel) - Math.abs(x.winkel));
  console.log(`${name} (${m3}) ${art}: Spur ${spur.toFixed(6)} → s1 + s2 = ${(spur - 8).toFixed(6)}`);
  console.log("  Eigenwerte |λ|, Winkel:", w.map(x => `${x.betrag.toFixed(4)}∠${x.winkel.toFixed(4)}`).join("  "));
}
