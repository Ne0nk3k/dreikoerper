// dreikoerper/werkzeug/stoerprobe.mjs — Stabilität ohne Monodromie: die Bahn
// anstoßen und zusehen.
//
//   node werkzeug/stoerprobe.mjs
//
// Das Stabilitätsurteil des Projekts kommt aus den Variationsgleichungen — in
// double wie in Festkomma dasselbe Verfahren. Hier die Gegenprobe, die nur die
// Kraft kennt: den Anfangswert um 1e-8 verschieben, beide Bahnen 20 Umläufe
// weit rechnen (Taylorreihe, double) und nach jedem Umlauf den Abstand im
// Phasenraum messen. Eine linear stabile Bahn lässt die Störung höchstens
// gleichmäßig wachsen (die Nachbarbahn hat eine etwas andere Periode und
// läuft langsam davon); eine instabile vervielfacht sie je Umlauf um |λ|.
//
// Geprüft: die stabile Bahn bei den Massen 1/1/2 mit T* = 454,472 (Satellit
// 7. Ordnung von I.A-2), ihre Grundbahn I.A-2, und als Gegenstück zwei
// instabile Satelliten derselben Grundbahn (3. und 4. Ordnung).

import { readFileSync } from "node:fs";
import { join } from "node:path";
import { HIER, ladeKern } from "../quellen.mjs";

const K = ladeKern();
const g = JSON.parse(readFileSync(join(HIER, "ergebnisse", "euler-m3-2-genau.json"), "utf8"));
const b = JSON.parse(readFileSync(join(HIER, "ergebnisse", "euler-m3-2.json"), "utf8"));
const m = b.parameter.m;
const nah = Ts => { const f = b.funde.slice().sort((x, y) => Math.abs(x.Ts - Ts) - Math.abs(y.Ts - Ts))[0]; const r = g.geprueft.find(q => Math.abs(q.start[0] - f.a) < 1e-11 && Math.abs(q.start[1] - f.b) < 1e-11); return { f, r }; };
const faelle = [["Satellit 7. Ordnung, T* 454,472 (Urteil: stabil)", nah(454.472)], ["Grundbahn I.A-2, T* 64,923 (stabil)", nah(64.9232)],
  ["Satellit 3. Ordnung, T* 194,770 (instabil)", nah(194.7697)], ["Satellit 4. Ordnung, T* 259,706 (instabil)", nah(259.7056)]];
const UMLAEUFE = 20, STOSS = 1e-8;
for (const [name, { f, r }] of faelle) {
  const a = +r.a, bb = +r.b, T = +r.T;
  const u = new Float64Array(12), v = new Float64Array(12);
  K.EBENEN.euler.anfang(a, bb, m, u); K.EBENEN.euler.anfang(a + STOSS, bb, m, v);
  const d0 = K.abstand(u, v, m), reihe = [];
  for (let n = 1; n <= UMLAEUFE; n++) { K.taylor(u, m, T, 1e-16); K.taylor(v, m, T, 1e-16); reihe.push(K.abstand(u, v, m)); }
  // die ungestörte Bahn selbst: wie weit ist sie nach 20 Umläufen vom Anfang? (Rechenfehler mal Verstärkung)
  const u0 = new Float64Array(12); K.EBENEN.euler.anfang(a, bb, m, u0);
  const drift = K.abstand(u, u0, m);
  const faktor = reihe.map((x, i) => x / (i ? reihe[i - 1] : d0));
  console.log(`${name}\n   T ${T.toFixed(4)}, |λ| aus der Monodromie ${f.lambda.toExponential(2)}, Stoß ${STOSS} in v₁ (Abstand im Phasenraum ${d0.toExponential(1)})`);
  console.log(`   Abstand nach Umlauf 1, 2, 5, 10, 20: ${[0, 1, 4, 9, 19].map(i => reihe[i].toExponential(1)).join(", ")}`);
  console.log(`   Wachstum je Umlauf, Umlauf 1 bis 5: ${faktor.slice(0, 5).map(x => x.toFixed(2)).join(", ")} · Verhältnis Abstand(20)/Abstand(10): ${(reihe[19] / reihe[9]).toFixed(2)} (gleichmäßiges Wachstum gäbe 2)`);
  console.log(`   ungestörte Bahn nach ${UMLAEUFE} Umläufen: ${drift.toExponential(1)} vom Anfang\n`);
}
