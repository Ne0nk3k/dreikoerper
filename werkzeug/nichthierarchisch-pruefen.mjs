// dreikoerper/werkzeug/nichthierarchisch-pruefen.mjs — betrifft die Liste der
// 135 445 Bahnen von Li, Li und Liao (2021) unsere Suche?
//
//   node werkzeug/nichthierarchisch-pruefen.mjs
//
// Die Datei quelle\non-hierarchical-3b-supplementary_data.txt (aus
// github.com/sjtu-liao/three-body, geladen am 02.10.2026) gibt je Zeile
// m1 m2 m3 x1 v1 v2 T und S/U. Start: r1 = (x1,0), r2 = (1,0), r3 = (0,0),
// Geschwindigkeiten senkrecht zur Linie. Unsere Euler-Ebene hat den
// Drehimpuls null. Der Drehimpuls bleibt erhalten, und L·√|E| ändert sich
// auch beim Umskalieren nicht: eine Bahn mit L ≠ 0 kann keine Bahn unserer
// Ebene sein. Hier: Massenbereich, Drehimpuls je Zeile, und welche Zeilen
// überhaupt Massen haben, die wir absuchen (bis auf Umbenennen und Skalieren).

import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const HIER = dirname(fileURLToPath(import.meta.url));
const text = readFileSync(join(HIER, "..", "quelle", "non-hierarchical-3b-supplementary_data.txt"), "utf8");
const zeilen = [];
for (const z of text.split(/\r?\n/)) {
  const t = z.trim().split(/\s+/);
  if (t.length !== 8 || !/^[SU]$/.test(t[7])) continue;
  const [m1, m2, m3, x1, v1, v2, T] = t.slice(0, 7).map(Number);
  if (![m1, m2, m3, x1, v1, v2, T].every(Number.isFinite)) continue;
  zeilen.push({ m1, m2, m3, x1, v1, v2, T, stabil: t[7] === "S" });
}
const e = x => x.toExponential(2);
const spanne = k => { let lo = Infinity, hi = -Infinity; for (const z of zeilen) { if (z[k] < lo) lo = z[k]; if (z[k] > hi) hi = z[k]; } return `${lo} … ${hi}`; };
console.log(`${zeilen.length} Bahnen gelesen, davon stabil ${zeilen.filter(z => z.stabil).length}`);
console.log(`m1 ${spanne("m1")} · m2 ${spanne("m2")} · m3 ${spanne("m3")} · T ${spanne("T")}`);

// Energie, Drehimpuls, skalierte Größen
let lMin = Infinity, lMinZ = null; const inv = [];
for (const z of zeilen) {
  const v3 = -(z.m1 * z.v1 + z.m2 * z.v2) / z.m3;
  const kin = 0.5 * (z.m1 * z.v1 ** 2 + z.m2 * z.v2 ** 2 + z.m3 * v3 ** 2);
  const pot = -(z.m1 * z.m2 / Math.abs(1 - z.x1) + z.m1 * z.m3 / Math.abs(z.x1) + z.m2 * z.m3 / 1);
  const E = kin + pot, L = z.m1 * z.x1 * z.v1 + z.m2 * 1 * z.v2;
  const l = Math.abs(L) * Math.sqrt(Math.abs(E));        // ändert sich beim Umskalieren nicht
  z.E = E; z.L = L; z.l = l; z.Ts = z.T * Math.abs(E) ** 1.5;
  inv.push(l);
  if (l < lMin) { lMin = l; lMinZ = z; }
}
inv.sort((a, b) => a - b);
console.log(`\nDrehimpuls, skaliert |L|·√|E|: kleinster ${e(inv[0])}, Median ${e(inv[inv.length >> 1])}, größter ${e(inv[inv.length - 1])}`);
for (const g of [1e-6, 1e-4, 1e-2, 1e-1]) console.log(`  unter ${e(g)}: ${inv.filter(x => x < g).length} Bahnen`);
console.log(`  die Bahn mit dem kleinsten Drehimpuls: m ${lMinZ.m1}/${lMinZ.m2}/${lMinZ.m3}, L ${e(lMinZ.L)}, E ${lMinZ.E.toFixed(4)}, T ${lMinZ.T.toFixed(4)}`);
console.log(`  gebunden (E < 0): ${zeilen.filter(z => z.E < 0).length} von ${zeilen.length}`);

// Unsere Massen: (1,1,m3) — bis auf Reihenfolge und gemeinsamen Faktor
const unsere = [[1, 1, 1], [1, 1, 0.5], [1, 1, 0.75], [1, 1, 2], [1, 1, 4], [1, 1, 5], [1, 1, 8], [1, 1, 10]];
const form = m => { const s = m.slice().sort((a, b) => a - b); return s.map(x => x / s[2]); };
console.log(`\nZeilen mit unseren Massen (bis auf Reihenfolge und Faktor):`);
for (const u of unsere) {
  const f = form(u);
  const tr = zeilen.filter(z => { const g = form([z.m1, z.m2, z.m3]); return g.every((x, i) => Math.abs(x - f[i]) < 5e-4); });
  console.log(`  ${u.join("/")}: ${tr.length}` + tr.map(z => `   [m ${z.m1}/${z.m2}/${z.m3}, T ${z.T.toFixed(4)}, T* ${z.Ts.toFixed(5)}, |L|·√|E| ${z.l.toFixed(4)}, ${z.stabil ? "stabil" : "instabil"}]`).join(""));
}
// Steht die eine Zeile gleicher Massen in unserem Katalog? (Eichung des Vergleichs über T*)
{
  const { ladeKatalog } = await import("../quellen.mjs");
  const kat = ladeKatalog(), z = zeilen.find(q => q.m1 === 1 && q.m2 === 1);
  if (z) {
    const n = kat.bahnen.filter(k => k.m.every(x => x === 1)).map(k => ({ k, d: Math.abs(k.Ts / z.Ts - 1) })).sort((a, b) => a.d - b.d)[0];
    console.log(`  die Zeile 1/1/1 (T* ${z.Ts.toFixed(8)}): nächste Bahn unseres Katalogs ist ${n.k.rufname || n.k.name} (${n.k.ebene}) mit T* ${n.k.Ts.toFixed(8)}, Abweichung ${e(n.d)}`);
  }
}

// Die Daten des Roadmap-Papiers (Liao, Li, Yang 2022): laut Quelle „relatively
// periodic BHH satellites … in a rotating frame". Spalten: m1 m2 m3 x1 v1 v2 T
// und ein Winkel. ANNAHME: derselbe Startaufbau wie oben (so steht es im
// Papier, nicht in der Datei). Dann lässt sich der Drehimpuls nachrechnen.
for (const name of ["case1_periodic_orbit.dat", "case2_periodic_orbit.dat"]) {
  let n = 0, klein = 0, lKlein = Infinity; const winkel = new Set(), ms = [Infinity, -Infinity, Infinity, -Infinity];
  for (const zl of readFileSync(join(HIER, "..", "quelle", "roadmap", name), "utf8").split(/\r?\n/)) {
    const t = zl.trim().split(/\s+/).map(Number);
    if (t.length < 8 || !t.slice(0, 8).every(Number.isFinite)) continue;
    const [m1, m2, m3, x1, v1, v2] = t; n++; winkel.add(t[7]);
    ms[0] = Math.min(ms[0], m1); ms[1] = Math.max(ms[1], m1); ms[2] = Math.min(ms[2], m2); ms[3] = Math.max(ms[3], m2);
    const v3 = -(m1 * v1 + m2 * v2) / m3;
    const E = 0.5 * (m1 * v1 * v1 + m2 * v2 * v2 + m3 * v3 * v3) - (m1 * m2 / Math.abs(1 - x1) + m1 * m3 / Math.abs(x1) + m2 * m3);
    const l = Math.abs(m1 * x1 * v1 + m2 * v2) * Math.sqrt(Math.abs(E));
    if (l < lKlein) lKlein = l; if (l < 1e-4) klein++;
  }
  console.log(`\nRoadmap ${name}: ${n} Bahnen, m1 ${ms[0]} … ${ms[1]}, m2 ${ms[2]} … ${ms[3]}, m3 = 1; Drehwinkel je Periode (Spalte 8): ${[...winkel].slice(0, 3).join(", ")}; skalierter Drehimpuls: kleinster ${e(lKlein)}, unter 1e-4: ${klein}`);
}

// und allgemein: Zeilen mit zwei gleichen Massen (unsere Suche braucht m1 = m2)
const zweiGleich = zeilen.filter(z => Math.abs(z.m1 - z.m2) < 5e-4 || Math.abs(z.m1 - z.m3) < 5e-4 || Math.abs(z.m2 - z.m3) < 5e-4);
console.log(`\nZeilen mit zwei gleichen Massen: ${zweiGleich.length}; kleinster skalierter Drehimpuls darunter ${e(Math.min(...zweiGleich.map(z => z.l)))}`);
