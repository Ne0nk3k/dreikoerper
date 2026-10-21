// dreikoerper/werkzeug/stabil-schnell-eichen.mjs — die schnelle Stufe von
// stabilitaetGenau gegen drei Mengen mit bekannter Antwort, bevor sie über
// Funde urteilt.
//
//   node werkzeug/stabil-schnell-eichen.mjs
//
//   1  zwölf der 72 Funde des Euler-Laufs, deren Indizes die volle Rechnung
//      (320 und 448 Bit) schon kennt: gleiches Urteil, gleicher Index?
//   2  sechs instabile Bahnen der Quelle, |λ| von 1e2 bis 1e12, gegen ihre
//      Eigenwerte
//   3  drei stabile Bahnen der Quelle (die Acht und die zwei, die der Grenze
//      am nächsten liegen): die schnelle Stufe darf hier NICHT urteilen — sie
//      muss an die volle Rechnung abgeben, und die muss „stabil" sagen
//
// Dazu die Rechenzeit: schnell gegen voll.

import { readFileSync } from "node:fs";
import { join } from "node:path";
import { HIER } from "../quellen.mjs";
import { macheSchwarm } from "../schwarm.mjs";

const H = join(HIER, "quelle", "hristov");
const zeilen = d => readFileSync(join(H, d), "utf8").split(/\r?\n/).filter(x => x.trim());
function dezimal(text, stellen) {
  const m = text.match(/^(-?)0?\.(\d+)e(-?\d+)$/);
  if (!m) throw new Error("Zahlformat? " + text.slice(0, 30));
  const e = +m[3], zif = m[2];
  const ganz = e > 0 ? zif.slice(0, e).padEnd(e, "0") : "0", nach = e > 0 ? zif.slice(e) : "0".repeat(-e) + zif;
  return m[1] + ganz.replace(/^0+(?=\d)/, "") + "." + nach.slice(0, stellen).padEnd(stellen, "0");
}
const e1 = x => (typeof x === "number" && Number.isFinite(x) ? x.toExponential(1) : "—");
const gross = r => Math.max(Math.abs(r.s1), Math.abs(r.s2));
const M = ["1", "1", "1"], opt = { stellen: 30, schnell: true };

// 1 · Funde mit bekanntem vollem Ergebnis
const g = JSON.parse(readFileSync(join(HIER, "ergebnisse", "euler-gleich-1-genau.json"), "utf8"));
const voll = g.geprueft.filter(r => r.stabilGenau && r.stabilGenau.s1 !== undefined).sort((x, y) => gross(x.stabilGenau) - gross(y.stabilGenau));
const wahl1 = Array.from({ length: 12 }, (_, k) => voll[Math.floor(k * (voll.length - 1) / 11)]);
// 2 · instabile Bahnen der Quelle
const ics = zeilen("euler/100_12431.txt").map(l => l.trim().split(/\s+/));
const roh = zeilen("euler/eigenvalues_12431.txt"), lam = [];
for (let k = 0; k < roh.length; k += 5) lam.push(Math.max(...[1, 2, 3, 4].map(j => { const t = roh[k + j].trim().split(/\s+/); return Math.hypot(+t[0], t.length > 1 ? parseFloat(t[2]) : 0); })));
const wahl2 = [2, 4, 6, 8, 10, 12].map(d => ics.findIndex((v, k) => +v[2] < 60 && lam[k] >= 10 ** d && lam[k] < 10 ** (d + 1))).filter(i => i >= 0);
// 3 · stabile Bahnen der Quelle: Nr. 1 (Acht), Nr. 3 und Nr. 5 (Abstand zur Grenze 1.2e-4 und 7.1e-5)
const ics971 = zeilen("stab971/ics_971_100.txt").map(l => l.trim().split(/\s+/));
const wahl3 = [0, 2, 4];

const auftraege = [
  ...wahl1.map(r => ({ art: "stabilGenau", ebene: "euler", m: M, a: r.a, b: r.b, T: r.T, opt })),
  ...wahl2.map(i => ({ art: "stabilGenau", ebene: "euler", m: M, a: dezimal(ics[i][0], 60), b: dezimal(ics[i][1], 60), T: dezimal(ics[i][2], 60), opt })),
  ...wahl3.map(i => ({ art: "stabilGenau", ebene: "euler", m: M, a: dezimal(ics971[i][0], 60), b: dezimal(ics971[i][1], 60), T: dezimal(ics971[i][2], 60), opt })),
];
const schwarm = macheSchwarm();
process.stderr.write(`${auftraege.length} Aufträge, ${schwarm.faeden} Fäden\n`);
const erg = await schwarm.alle(auftraege, (_, __, n) => process.stderr.write(`  ${n}/${auftraege.length}\n`));
await schwarm.ende();

let fehl = 0;
console.log("1 · zwölf Funde: schnelle Stufe gegen die volle Rechnung");
wahl1.forEach((r, k) => {
  const s = erg[k], v = r.stabilGenau;
  if (s.fehler || !s.ok) { fehl++; console.log(`   T ${(+r.T).toFixed(2)}: ${s.fehler || s.grund}   ←`); return; }
  const ab = Math.abs(gross(s) / gross(v) - 1), ok = s.urteil === v.urteil && ab < 1e-9 && s.stufe === "schnell";
  if (!ok) fehl++;
  console.log(`   T ${(+r.T).toFixed(2).padStart(6)}  |s| voll ${e1(gross(v))}  schnell ${e1(gross(s))}  rel. Abweichung ${e1(ab)}  Urteil ${s.urteil} (${s.stufe})  Unterschied grob/fein rel. ${e1(s.unterschied / gross(s))}  ${s.sekunden.toFixed(0)} s statt ${v.sekunden.toFixed(0)} s${ok ? "" : "   ←"}`);
});
console.log("2 · sechs instabile Bahnen der Quelle");
wahl2.forEach((i, k) => {
  const s = erg[12 + k];
  if (s.fehler || !s.ok || s.komplex) { fehl++; console.log(`   Nr. ${i + 1}: ${s.fehler || s.grund || "komplex"}   ←`); return; }
  const sg = gross(s), ist = (sg + Math.sqrt(sg * sg - 4)) / 2, ab = Math.abs(ist / lam[i] - 1), ok = s.urteil === "instabil" && ab < 1e-9;
  if (!ok) fehl++;
  console.log(`   Nr. ${String(i + 1).padStart(5)}  |λ| Quelle ${lam[i].toExponential(10)}  hier ${ist.toExponential(10)}  rel. Abweichung ${e1(ab)}  Urteil ${s.urteil} (${s.stufe})  ${s.sekunden.toFixed(0)} s${ok ? "" : "   ←"}`);
});
console.log("3 · drei stabile Bahnen der Quelle: die schnelle Stufe muss abgeben");
wahl3.forEach((i, k) => {
  const s = erg[18 + k];
  if (s.fehler || !s.ok) { fehl++; console.log(`   Nr. ${i + 1}: ${s.fehler || s.grund}   ←`); return; }
  const ok = s.urteil === "stabil" && s.stufe === "voll";
  if (!ok) fehl++;
  console.log(`   Nr. ${i + 1}  T ${(+ics971[i][2]).toFixed(2)}  s ${s.s1.toFixed(9)}, ${s.s2.toFixed(9)}  Abstand zur Grenze ${e1(s.rand)}  Urteil ${s.urteil} (${s.stufe})  ${s.sekunden.toFixed(0)} s${ok ? "" : "   ←"}`);
});
console.log(fehl ? `\n${fehl} von ${auftraege.length} weichen ab` : `\nalle ${auftraege.length} wie erwartet`);
process.exit(fehl ? 1 : 0);
