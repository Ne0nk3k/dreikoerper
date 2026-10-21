// dreikoerper/werkzeug/abgleich-genau.mjs — der Abgleich „gleiche Bahn an
// anderer Stelle" hängt an T* auf acht Stellen. Trägt die Periode aus double
// diese acht Stellen überhaupt? Mit den 30-stelligen Werten der Nachprüfung
// lässt sich das nachmessen.
//
//   node werkzeug/abgleich-genau.mjs fall-gleich-1
//
// Je belegter Bahn außerhalb der Listen: T* aus den genauen Werten, der
// nächste Listeneintrag nach T* (beide Ebenen) und nach Ort. Ein Treffer hier
// hieße: die Bahn steht doch in der Liste, double hat sie nur verfehlt.

import { readFileSync } from "node:fs";
import { join } from "node:path";
import { HIER, ladeKern, ladeGross } from "../quellen.mjs";

const K = ladeKern();
const lauf = process.argv[2];
const b = JSON.parse(readFileSync(join(HIER, "ergebnisse", lauf + ".json"), "utf8"));
const g = JSON.parse(readFileSync(join(HIER, "ergebnisse", lauf + "-genau.json"), "utf8"));
const P = b.parameter, gross = ladeGross();
if (!(P.m[0] === P.m[1] && P.m[1] === P.m[2])) { console.log("ungleiche Massen: keine große Liste zum Abgleich"); process.exit(0); }
const ort = (x, y) => Math.round(Math.abs(x) * 1e9) + ":" + Math.round(Math.abs(y) * 1e9);
const nachOrt = new Map(b.funde.map(f => [ort(f.a, f.b), f]));
const u = new Float64Array(12);
const abwTs = [], abwOrt = [], drift = [], treffer = [];
let n = 0;
for (const r of g.geprueft) {
  if (r.urteil !== "belegt") continue;
  const f = nachOrt.get(ort(r.start[0], r.start[1]));
  if (!f || f.bekannt) continue;
  n++;
  const a = +r.a, bb = +r.b, T = +r.T;
  K.EBENEN[P.ebene].anfang(a, bb, P.m, u);
  const Ts = T * Math.pow(Math.abs(K.energie(u, P.m)), 1.5);
  drift.push(Math.abs(Ts / f.Ts - 1));
  let beste = Infinity, wo = null;
  for (const eb of Object.keys(gross.meta.ebenen)) {
    const t = gross[eb].mitTs(Ts, Infinity);
    if (t && t.abweichung < beste) { beste = t.abweichung; wo = { ebene: eb, ...t }; }
  }
  abwTs.push(beste);
  const nn = gross[P.ebene].naechster(a, bb);
  if (nn) abwOrt.push(nn.abstand);
  if (beste < 1e-8 || (nn && nn.abstand < 1e-6)) treffer.push({ a, b: bb, T, Ts, TsDouble: f.Ts, abweichungTs: beste, wo, ortAbstand: nn ? nn.abstand : null });
}
const q = (v, p) => { const s = [...v].sort((x, y) => x - y); return s.length ? s[Math.min(s.length - 1, Math.floor(p * s.length))] : NaN; };
const e = x => x.toExponential(1);
console.log(`${lauf}: ${n} belegte Bahnen außerhalb der Listen`);
console.log(`  T* aus double gegen T* aus 30 Stellen (relativ): Median ${e(q(drift, 0.5))}, 90 % ${e(q(drift, 0.9))}, größte ${e(q(drift, 1))}   — der Abgleich verlangt 1e-8`);
console.log(`  nächstes T* in den Listen (relativ):             kleinste ${e(q(abwTs, 0))}, 10 % ${e(q(abwTs, 0.1))}, Median ${e(q(abwTs, 0.5))}   — Treffer wäre unter 1e-8`);
console.log(`  nächster Listenort:                              kleinster ${e(q(abwOrt, 0))}, Median ${e(q(abwOrt, 0.5))}   — Treffer wäre unter 1e-6`);
console.log(`  mit den genauen Werten doch in einer Liste: ${treffer.length}`);
for (const t of treffer) console.log(`    a ${t.a.toFixed(10)} b ${t.b.toFixed(10)} T ${t.T.toFixed(8)} T* ${t.Ts.toFixed(8)} (double ${t.TsDouble.toFixed(8)})  Liste: ${t.wo ? `${t.wo.ebene} a ${t.wo.a.toFixed(8)} b ${t.wo.b.toFixed(8)} T* ${t.wo.Ts.toFixed(8)}, Abweichung ${e(t.abweichungTs)}` : "—"}  Ortsabstand ${t.ortAbstand === null ? "—" : e(t.ortAbstand)}`);
// Wie dicht liegen die Listenwerte von T* selbst? Bei zufälliger Lage wäre die
// erwartete Zahl zufälliger Treffer etwa n · 2·1e-8·T* · Dichte.
