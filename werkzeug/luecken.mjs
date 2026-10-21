// dreikoerper/werkzeug/luecken.mjs — wo sind die Listen blind? (21.10.2026)
//
//   node werkzeug/luecken.mjs
//
// Je Massensatz der Euler-Ebene (m₁ = m₂ = 1): der gebundene Bereich aus der
// Energie (E < 0 ⇔ |v|² < (1/2 + 2m₃)/(1 + 2/m₃), in jeder Richtung gleich),
// wie weit die Listenbahnen darin reichen, und welche Fenster unsere Läufe
// schon abgesucht haben. Gelesen aus den Listendaten selbst und aus den
// Laufberichten — nicht aus privater Post. Die Fläche wird über ein feines
// Gitter im Viertelkreis gezählt (a, b ≥ 0; die Listen führen Beträge).

import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { HIER, ladeKatalog, ladeGross } from "../quellen.mjs";

const KAT = ladeKatalog();
const vmax = m3 => Math.sqrt((0.5 + 2 * m3) / (1 + 2 / m3));
const laeufe = readdirSync(join(HIER, "ergebnisse")).filter(n => /^euler-.*\.json$/.test(n) && !/genau|grauzone/.test(n))
  .map(n => { const B = JSON.parse(readFileSync(join(HIER, "ergebnisse", n), "utf8")); return { lauf: n.replace(/\.json$/, ""), m3: B.parameter.m[2], sicht: B.parameter.sicht || [0, 0.75, 0, 0.75], tmax: B.parameter.tmax }; });

const G = ladeGross();
let hMax = [0, 0];
for (let i = 0; i < G.euler.n; i++) { hMax[0] = Math.max(hMax[0], Math.abs(G.euler.w[4 * i])); hMax[1] = Math.max(hMax[1], Math.abs(G.euler.w[4 * i + 1])); }

const zeilen = [];
for (const m3 of [0.5, 0.75, 1, 2, 4, 5, 8, 10]) {
  const V = vmax(m3);
  const liste = KAT.bahnen.filter(k => k.ebene === "euler" && k.m[0] === 1 && k.m[1] === 1 && Math.abs(k.m[2] - m3) < 1e-12);
  const A = liste.map(k => Math.abs(k.a)), B = liste.map(k => Math.abs(k.b));
  const ueber1 = liste.filter(k => Math.abs(k.a) > 1 || Math.abs(k.b) > 1).length;
  // Abdeckung der Listen: das Quadrat [0,1]². Einzelne Listenbahnen liegen
  // darüber (bei 1/1/4 drei von 85, bis b = 1,58) — Newton läuft über den
  // Rand hinaus, wie bei unserem eigenen Fund; das Rechteck bis max|b| als
  // „abgesucht“ zu zählen, hieße die Lücke wegzudefinieren.
  const listeA = 1, listeB = 1;
  const unsere = laeufe.filter(l => Math.abs(l.m3 - m3) < 1e-12);
  const N = 600; let gebunden = 0, inListe = 0, inUnseren = 0, nirgends = 0;
  for (let i = 0; i < N; i++) for (let j = 0; j < N; j++) {
    const a = (i + 0.5) / N * V, b = (j + 0.5) / N * V;
    if (a * a + b * b >= V * V) continue;
    gebunden++;
    const L = (m3 === 1 ? (a <= Math.max(listeA, hMax[0]) && b <= Math.max(listeB, hMax[1])) : (a <= listeA && b <= listeB));
    const U = unsere.some(l => a >= l.sicht[0] && a <= l.sicht[1] && b >= l.sicht[2] && b <= l.sicht[3]);
    if (L) inListe++; if (U) inUnseren++; if (!L && !U) nirgends++;
  }
  zeilen.push({ m3, vmax: V, listenbahnen: liste.length, maxA: Math.max(0, ...A), maxB: Math.max(0, ...B), ueber1,
    anteilListe: inListe / gebunden, anteilUnsere: inUnseren / gebunden, anteilNirgends: nirgends / gebunden,
    unsereLaeufe: unsere.map(l => `${l.lauf} [${l.sicht.join(",")}] T≤${l.tmax}`) });
}
console.log("Massen | v_max | Listenbahnen | max|a|, max|b| der Liste | davon über 1 | Anteil des gebundenen Bereichs: Listen-Rechteck / unsere Fenster / NIRGENDS abgesucht");
for (const z of zeilen) console.log(`1/1/${z.m3} | ${z.vmax.toFixed(3)} | ${z.listenbahnen} | ${z.maxA.toFixed(3)}, ${z.maxB.toFixed(3)} | ${z.ueber1} | ${(100 * z.anteilListe).toFixed(0)} % / ${(100 * z.anteilUnsere).toFixed(0)} % / ${(100 * z.anteilNirgends).toFixed(0)} %   ${z.unsereLaeufe.join("; ")}`);
console.log(`Sofia-Liste (gleiche Massen, ${G.euler.n} Bahnen): max|a| ${hMax[0].toFixed(3)}, max|b| ${hMax[1].toFixed(3)}`);
