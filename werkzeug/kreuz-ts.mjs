// dreikoerper/werkzeug/kreuz-ts.mjs — steht dieselbe Bahn in der Fundliste
// einmal in der Euler-Ebene und einmal im freien Fall?
//
//   node werkzeug/kreuz-ts.mjs
//
// Eine Bahn mit Drehimpuls null kann sowohl einen Ruhepunkt als auch eine
// Euler-Aufstellung haben; dann taucht sie in beiden Ebenen auf, mit derselben
// skalierten Periode T*. uebersicht.mjs legt nur innerhalb einer Ebene
// zusammen. Liest ergebnisse/funde.json.

import { readFileSync } from "node:fs";
import { join } from "node:path";
import { HIER } from "../quellen.mjs";

const F = JSON.parse(readFileSync(join(HIER, "ergebnisse", "funde.json"), "utf8")).bahnen.filter(b => b.m.every(x => x === 1));
const eu = F.filter(b => b.ebene === "euler").sort((x, y) => x.Ts - y.Ts), fa = F.filter(b => b.ebene === "fall").sort((x, y) => x.Ts - y.Ts);
let j = 0; const naechste = [];
for (const e of eu) {
  while (j + 1 < fa.length && Math.abs(fa[j + 1].Ts - e.Ts) <= Math.abs(fa[j].Ts - e.Ts)) j++;
  if (fa.length) naechste.push({ e, f: fa[j], ab: Math.abs(fa[j].Ts / e.Ts - 1) });
}
naechste.sort((x, y) => x.ab - y.ab);
console.log(`${eu.length} Bahnen in der Euler-Ebene, ${fa.length} im freien Fall (gleiche Massen)`);
console.log(`kleinste relative Abstände in T* zwischen beiden Ebenen: ${naechste.slice(0, 6).map(x => x.ab.toExponential(1)).join(", ")}`);
const gleich = naechste.filter(x => x.ab < 1e-8);
console.log(`gleiches T* auf acht Stellen: ${gleich.length}`);
for (const x of gleich) console.log(`  T* ${x.e.Ts.toFixed(7)}: Euler (${(+x.e.a).toFixed(8)}, ${(+x.e.b).toFixed(8)}) |λ| ${x.e.lambda.toExponential(2)}  ·  freier Fall (${(+x.f.a).toFixed(8)}, ${(+x.f.b).toFixed(8)}) |λ| ${x.f.lambda.toExponential(2)}`);
