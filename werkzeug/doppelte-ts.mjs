// dreikoerper/werkzeug/doppelte-ts.mjs — wie viele der Funde außerhalb der
// Listen sind dieselbe Bahn, an zwei Stellen der Ebene getroffen?
//
//   node werkzeug/doppelte-ts.mjs euler-gleich-1
//
// Eine Bahn kann die Ebene mehrmals kreuzen: im freien Fall hat jede Bahn zwei
// Ruhepunkte, in der Euler-Ebene kann sie mehrere Euler-Aufstellungen in
// verschiedener Größe durchlaufen. Der Lauf legt nach dem Ort zusammen, nicht
// nach der Bahn. Die skalierte Periode T* ist für alle Lagen derselben Bahn
// gleich — hier mit den 30-stelligen Werten der Nachprüfung verglichen.

import { readFileSync } from "node:fs";
import { join } from "node:path";
import { HIER, ladeKern } from "../quellen.mjs";

const K = ladeKern();
const lauf = process.argv[2];
const b = JSON.parse(readFileSync(join(HIER, "ergebnisse", lauf + ".json"), "utf8"));
const g = JSON.parse(readFileSync(join(HIER, "ergebnisse", lauf + "-genau.json"), "utf8"));
const P = b.parameter, u = new Float64Array(12);
const ort = (x, y) => Math.round(Math.abs(x) * 1e9) + ":" + Math.round(Math.abs(y) * 1e9);
const nachOrt = new Map(b.funde.map(f => [ort(f.a, f.b), f]));
const liste = [];
for (const r of g.geprueft) {
  if (r.urteil !== "belegt") continue;
  const f = nachOrt.get(ort(r.start[0], r.start[1]));
  if (!f || f.bekannt) continue;
  K.EBENEN[P.ebene].anfang(+r.a, +r.b, P.m, u);
  liste.push({ a: +r.a, b: +r.b, T: +r.T, Ts: +r.T * Math.pow(Math.abs(K.energie(u, P.m)), 1.5), f, s: r.stabilGenau });
}
liste.sort((x, y) => x.Ts - y.Ts);
// Abstände benachbarter T* (relativ)
const luecken = [];
for (let i = 1; i < liste.length; i++) luecken.push(liste[i].Ts / liste[i - 1].Ts - 1);
const sortiert = [...luecken].sort((x, y) => x - y);
console.log(`${lauf}: ${liste.length} belegte Bahnen außerhalb der Listen`);
console.log(`  Abstand benachbarter T* (relativ): kleinste ${sortiert.slice(0, 6).map(x => x.toExponential(1)).join(", ")} … Median ${sortiert[sortiert.length >> 1].toExponential(1)}`);
for (const schwelle of [1e-12, 1e-10, 1e-8, 1e-6]) console.log(`  Paare mit gleichem T* bis auf ${schwelle.toExponential(0)}: ${luecken.filter(x => x < schwelle).length}`);
// Gruppen (Schwelle 1e-9: zwischen Rechengenauigkeit 1e-10 und Zufallsnähe)
const gruppen = [];
for (const x of liste) { const l = gruppen[gruppen.length - 1]; if (l && x.Ts / l[l.length - 1].Ts - 1 < 1e-9) l.push(x); else gruppen.push([x]); }
const mehr = gruppen.filter(l => l.length > 1);
console.log(`  verschiedene T* (Schwelle 1e-9): ${gruppen.length}; davon mehrfach getroffen: ${mehr.length} (mit zusammen ${mehr.reduce((s, l) => s + l.length, 0)} Lagen)`);
for (const l of mehr.slice(0, 8)) console.log("    T* " + l[0].Ts.toFixed(6) + ": " + l.map(x => `(${x.a.toFixed(6)}, ${x.b.toFixed(6)}) T ${x.T.toFixed(4)} |λ| ${x.f.lambda.toExponential(2)}${x.f.halb ? " " + x.f.halb.ziel + "×" + x.f.halb.vielfaches : ""}`).join("  |  "));
