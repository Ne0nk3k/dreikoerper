// probe-pruefen.mjs — eine 30-Stellen-Probe der Stabilitätskarte nachrechnen, aus der Tabelle, ohne fremde Daten.
//
//   node probe-pruefen.mjs --entry I.B-1-0.75 --m3 1.227812      eine Probe (entry und m3 wie in der Tabelle)
//   node probe-pruefen.mjs --zufall 3 [--saat 1] [--tmax 30]     drei zufällige angenommene Proben (T* ≤ tmax:
//                                                                kurze Perioden rechnen schneller)
//
// Für Leser der Karte (21.11.2026): die Ziffern a, b, T aus daten/probes-30digit.csv werden so gerechnet, wie
// sie dastehen. Zuerst die Rückkehr nach einer Periode bei 320 Bit (Ordnung 40); dann die Stabilität genau so,
// wie das Projekt sie bestimmt hat (genau.mjs, stabilitaetGenau mit Gegenprobe bei 128 Bit mehr und höherer
// Ordnung), und der Vergleich mit Urteil, Indizes und Rand der Tabelle. Exit 1 bei einer Abweichung.
// Dauer je Probe: Sekunden bis viele Minuten auf einem Kern, je nach Periode und engster Begegnung.
// Ausgabe englisch, weil die Leser es sind. Node.js 18 oder neuer, keine Pakete.

import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { ladeKern } from "./quellen.mjs";
import { macheGenau, stabilitaetGenau } from "./genau.mjs";

const HIER = dirname(fileURLToPath(import.meta.url)), K = ladeKern();
const argv = process.argv.slice(2), wert = (n, v) => (argv.includes(n) ? argv[argv.indexOf(n) + 1] : v);
const zeilen = readFileSync(join(HIER, "daten", "probes-30digit.csv"), "utf8").split(/\r?\n/).filter(z => z && !z.startsWith("#"));
const kopf = zeilen.shift().split(",");
const PROBEN = zeilen.map(z => { const w = z.split(","); return Object.fromEntries(kopf.map((k, i) => [k, w[i] ?? ""])); }).filter(p => p.accepted === "yes");

let auswahl;
if (argv.includes("--zufall")) {
  // mulberry32: dieselbe Auswahl auf jedem Rechner
  let a = +wert("--saat", 1) | 0;
  const zufall = () => { a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  const tmax = +wert("--tmax", Infinity), topf = PROBEN.filter(p => +p.T_star <= tmax);
  auswahl = Array.from({ length: Math.min(+wert("--zufall", 1), topf.length) }, () => topf.splice(Math.floor(zufall() * topf.length), 1)[0]);
} else {
  const e = wert("--entry", null), m = wert("--m3", null);
  auswahl = PROBEN.filter(p => p.entry === e && Math.abs(+p.m3 - +m) < 1e-9);
  if (!e || !m || !auswahl.length) { console.error("usage: node probe-pruefen.mjs --entry <entry> --m3 <m3>   |   --zufall <n> [--saat s] [--tmax T*]\n(an accepted probe from daten/probes-30digit.csv)"); process.exit(2); }
}

function rueckkehr(p, bits, ordnung) {
  const G = macheGenau(bits, ordnung), mT = ["1", "1", p.m3], mF = mT.map(G.ausDezimal), mD = mT.map(Number);
  const u0 = G.anfang("euler", G.ausDezimal(p.a), G.ausDezimal(p.b), mF), u = u0.slice();
  if (G.lauf(u, mF, G.ausDezimal(p.T), -38 * Math.log2(10)).art !== 0) return NaN;
  const d = new Float64Array(12); for (let i = 0; i < 12; i++) d[i] = G.zuZahl(u[i] - u0[i]);
  return K.abstand(d, new Float64Array(12), mD);
}
const WORT = { stabil: "stable", instabil: "unstable", "an der Grenze": "boundary" };
const nah = (x, y) => Math.abs(x - y) <= 1e-12 * (1 + Math.abs(y));
let schlecht = 0;
for (const p of auswahl) {
  const t0 = Date.now();
  console.log(`\n${p.entry} at m3 = ${p.m3}   (masses 1 / 1 / ${p.m3}, T* = ${(+p.T_star).toFixed(4)})\n  a = ${p.a}\n  b = ${p.b}\n  T = ${p.T}`);
  const r = rueckkehr(p, 320, 40);
  // Die gedruckten 32 Stellen sind gerundet (etwa 5e-33); über eine Periode wächst dieser Fehler mit den Multiplikatoren,
  // bei stark instabilen Bahnen (|s| bis 6e6) also weit über den Newton-Rest hinaus. Grenze daher 1e-25 · max(1, |s|).
  const grenze = 1e-25 * Math.max(1, Math.abs(+p.s1), Math.abs(+p.s2));
  console.log(`  return distance of exactly these digits after one period (320 bits, order 40): ${r.toExponential(2)}  (limit ${grenze.toExponential(1)} = 1e-25 x max(1, |s|))`);
  const s = stabilitaetGenau("euler", ["1", "1", p.m3], p.a, p.b, p.T, { gegenprobe: true });
  if (!s.ok) { console.log("  stability: integration stopped"); schlecht++; continue; }
  const urteil = WORT[s.urteil];
  const gleich = urteil === p.verdict && nah(s.s1, +p.s1) && nah(s.s2, +p.s2) && nah(s.rand, +p.margin) && !!s.komplex === (p.complex === "true");
  console.log(`  indices ${s.komplex ? `${s.s1.toFixed(12)} ± ${s.sIm.toExponential(3)} i` : `${s.s1} / ${s.s2}`}, margin ${s.rand.toExponential(4)}, check difference ${(s.unterschied ?? NaN).toExponential(1)}`);
  console.log(`  verdict: ${urteil} — table: ${p.verdict}, margin ${(+p.margin).toExponential(4)} → ${gleich ? "AGREES" : "DIFFERS"}  (${((Date.now() - t0) / 1000).toFixed(0)} s)`);
  if (!gleich || !(r < grenze)) schlecht++;
}
console.log(schlecht ? `\nRESULT: ${schlecht} of ${auswahl.length} probes do not agree with the table.` : `\nRESULT: all ${auswahl.length} probes agree with the table (verdict, indices and margin).`);
process.exit(schlecht ? 1 : 0);
