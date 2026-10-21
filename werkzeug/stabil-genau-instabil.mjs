// dreikoerper/werkzeug/stabil-genau-instabil.mjs — stabilitaetGenau an stark
// instabilen Bahnen der Quelle, bevor sie über die offenen Funde urteilt.
//
//   node werkzeug/stabil-genau-instabil.mjs
//
// Abschnitt D von pruef-hristov.mjs prüft die Rechnung nur an stabilen Bahnen.
// Die offenen Funde haben in double |λ| von 1e4 bis 1e10 — dort muss dieselbe
// Rechnung die Eigenwerte der Quelle (20 Stellen) treffen. Je Größenordnung
// von |λ| eine Bahn aus den 12 431 mit T < 60, dazu die Rechenzeit.

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
const ics = zeilen("euler/100_12431.txt").map(l => l.trim().split(/\s+/));
const roh = zeilen("euler/eigenvalues_12431.txt"), eig = [];
for (let k = 0; k < roh.length; k += 5) eig.push([1, 2, 3, 4].map(j => { const t = roh[k + j].trim().split(/\s+/); return [+t[0], t.length > 1 ? (t[1] === "-" ? -1 : 1) * parseFloat(t[2]) : 0]; }));

const lam = i => Math.max(...eig[i].map(c => Math.hypot(c[0], c[1])));
const wahl = [];
for (const dek of [2, 4, 6, 8, 10, 12]) {
  const i = ics.findIndex((v, k) => +v[2] < 60 && lam(k) >= 10 ** dek && lam(k) < 10 ** (dek + 1));
  if (i >= 0) wahl.push(i);
}
const schwarm = macheSchwarm();
const t0 = Date.now(), zeit = [];
const erg = await schwarm.alle(wahl.map(i => ({ art: "stabilGenau", ebene: "euler", m: ["1", "1", "1"], a: dezimal(ics[i][0], 60), b: dezimal(ics[i][1], 60), T: dezimal(ics[i][2], 60), opt: { stellen: 30 } })),
  (g, k) => { zeit[k] = (Date.now() - t0) / 1000; });
await schwarm.ende();

let schlecht = 0;
console.log("Nr.     T        |λ| Quelle             |λ| hier               rel. Abweichung  Urteil     Unterschied der zwei Rechnungen   fertig nach");
erg.forEach((r, k) => {
  const i = wahl[k], soll = lam(i);
  if (r.fehler || !r.ok) { schlecht++; console.log(`${String(i + 1).padStart(5)}  ${(+ics[i][2]).toFixed(2).padStart(6)}  ${soll.toExponential(14)}   — ${r.fehler || r.grund}`); return; }
  // |λ| aus dem größeren Index: λ = (|s| + √(s² − 4))/2; bei komplexem Paar aus s und Im
  let ist;
  if (r.komplex) { // λ + 1/λ = s ± i·sIm
    const re = r.s1, im = r.sIm, dRe = re * re - im * im - 4, dIm = 2 * re * im, bet = Math.hypot(dRe, dIm), wRe = Math.sqrt((bet + dRe) / 2), wIm = Math.sign(dIm) * Math.sqrt((bet - dRe) / 2);
    ist = Math.max(Math.hypot(re + wRe, im + wIm), Math.hypot(re - wRe, im - wIm)) / 2;
  } else { const s = Math.max(Math.abs(r.s1), Math.abs(r.s2)); ist = (s + Math.sqrt(s * s - 4)) / 2; }
  const ab = Math.abs(ist / soll - 1);
  if (!(ab < 1e-12) || r.urteil !== "instabil") schlecht++;
  console.log(`${String(i + 1).padStart(5)}  ${(+ics[i][2]).toFixed(2).padStart(6)}  ${soll.toExponential(14)}   ${ist.toExponential(14)}   ${ab.toExponential(1).padStart(9)}        ${r.urteil.padEnd(9)}  ${(r.unterschied ?? NaN).toExponential(1).padStart(9)}                         ${zeit[k].toFixed(0)} s`);
});
console.log(schlecht ? `\n${schlecht} von ${wahl.length} weichen ab` : `\nalle ${wahl.length}: |λ| auf zwölf Stellen wie in der Quelle, Urteil instabil`);
process.exit(schlecht ? 1 : 0);
