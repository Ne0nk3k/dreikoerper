// dreikoerper/werkzeug/stabil-genau-auswerten.mjs — was hat die Stabilität in
// erhöhter Genauigkeit ergeben, und wie weit lag double daneben?
//
//   node werkzeug/stabil-genau-auswerten.mjs euler-gleich-1
//
// Liest nur; rechnet nichts neu.

import { readFileSync } from "node:fs";
import { join } from "node:path";
import { HIER } from "../quellen.mjs";

const lauf = process.argv[2];
const b = JSON.parse(readFileSync(join(HIER, "ergebnisse", lauf + ".json"), "utf8"));
const g = JSON.parse(readFileSync(join(HIER, "ergebnisse", lauf + "-genau.json"), "utf8"));
const ort = (x, y) => Math.round(Math.abs(x) * 1e9) + ":" + Math.round(Math.abs(y) * 1e9);
const nachOrt = new Map(b.funde.map(f => [ort(f.a, f.b), f]));
const e = x => (typeof x === "number" && Number.isFinite(x) ? x.toExponential(1) : "—");
const zeilen = g.geprueft.filter(r => r.stabilGenau).map(r => ({ r, s: r.stabilGenau, f: nachOrt.get(ort(r.start[0], r.start[1])) })).filter(x => x.f);
const urteile = {};
for (const x of zeilen) urteile[x.s.urteil] = (urteile[x.s.urteil] || 0) + 1;
console.log(`${lauf}: ${zeilen.length} Bahnen mit Stabilität in erhöhter Genauigkeit`, JSON.stringify(urteile));
const ok = zeilen.filter(x => x.s.s1 !== undefined);
const gr = x => Math.max(Math.abs(x.s.s1), Math.abs(x.s.s2));
const sort = v => [...v].sort((p, q) => p - q), q = (v, p) => { const s = sort(v); return s.length ? s[Math.min(s.length - 1, Math.floor(p * s.length))] : NaN; };
console.log(`  größter Index |s| (genau): kleinster ${e(q(ok.map(gr), 0))}, Median ${e(q(ok.map(gr), 0.5))}, größter ${e(q(ok.map(gr), 1))}`);
console.log(`  Unterschied der zwei Rechnungen, relativ zu |s|: Median ${e(q(ok.map(x => (x.s.unterschied || 0) / gr(x)), 0.5))}, größter ${e(q(ok.map(x => (x.s.unterschied || 0) / gr(x)), 1))}`);
console.log(`  Rechenzeit je Bahn: Median ${q(ok.map(x => x.s.sekunden || NaN).filter(Number.isFinite), 0.5).toFixed(0)} s, größte ${q(ok.map(x => x.s.sekunden || NaN).filter(Number.isFinite), 1).toFixed(0)} s`);
// Wie weit lag double daneben? |λ| aus double gegen |s| genau (für |s| ≫ 2 ist |λ| ≈ |s|)
const fehler = ok.filter(x => Number.isFinite(x.f.lambda)).map(x => ({ x, ab: Math.abs(x.f.lambda / gr(x) - 1) }));
console.log(`  |λ| aus double gegen den genauen Wert (relativ): Median ${e(q(fehler.map(y => y.ab), 0.5))}, 90 % ${e(q(fehler.map(y => y.ab), 0.9))}, größter ${e(q(fehler.map(y => y.ab), 1))}`);
console.log(`  davon lag double um mehr als die Hälfte daneben: ${fehler.filter(y => y.ab > 0.5).length} von ${fehler.length}`);
// die dem Rand nächsten
const nah = [...ok].sort((p, r) => gr(p) - gr(r)).slice(0, 6);
console.log("  die sechs mit dem kleinsten größten Index (am nächsten an der Grenze |s| = 2):");
for (const x of nah) console.log(`    T ${x.f.T.toFixed(3).padStart(8)}  T* ${x.f.Ts.toFixed(2).padStart(7)}  s genau ${e(x.s.s1)} / ${e(x.s.s2)}${x.s.sIm ? " ± i·" + e(x.s.sIm) : ""}  Urteil ${x.s.urteil}  (double: |λ| ${e(x.f.lambda)}, sympl ${e(x.f.symplektik)})`);
const nicht = zeilen.filter(x => x.s.urteil !== "instabil");
if (nicht.length) { console.log(`  NICHT instabil: ${nicht.length}`); for (const x of nicht) console.log(`    a ${x.f.a} b ${x.f.b} T ${x.f.T}  Urteil ${x.s.urteil}  s ${x.s.s1Text || x.s.s1} / ${x.s.s2Text || x.s.s2}  Abstand zur Grenze ${e(x.s.rand)}  ${x.s.fehler || ""}`); }
