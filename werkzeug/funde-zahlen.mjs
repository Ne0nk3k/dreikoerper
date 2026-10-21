// dreikoerper/werkzeug/funde-zahlen.mjs — die Zahlen, die LIESMICH über die
// Fundliste nennt, aus funde.json nachgezählt.
//
//   node werkzeug/funde-zahlen.mjs

import { readFileSync } from "node:fs";
import { join } from "node:path";
import { HIER } from "../quellen.mjs";

const F = JSON.parse(readFileSync(join(HIER, "ergebnisse", "funde.json"), "utf8")).bahnen;
const gruppen = {};
for (const b of F) { const k = b.ebene + " " + b.m.join("/"); (gruppen[k] = gruppen[k] || []).push(b); }
console.log(`${F.length} Bahnen in funde.json`);
for (const [k, l] of Object.entries(gruppen)) {
  const urteil = b => (b.stabilGenau ? b.stabilGenau.urteil + " (genau)" : b.stabil === true ? "stabil" : b.stabil === false ? "instabil" : "offen");
  const z = {}; for (const b of l) z[urteil(b)] = (z[urteil(b)] || 0) + 1;
  const ts = l.map(b => b.Ts).sort((x, y) => x - y);
  console.log(`${k}: ${l.length} Bahnen · Stabilität ${JSON.stringify(z)} · T* ${ts[0].toFixed(2)} … ${ts[ts.length - 1].toFixed(2)} · mit weiterer Lage ${l.filter(b => b.weitereLagen.length).length}`);
  for (const g of [60, 80, 120, 211]) console.log(`   T* unter ${g}: ${l.filter(b => b.Ts < g).length}`);
  const gen = l.filter(b => b.stabilGenau && b.stabilGenau.s1 !== undefined).map(b => Math.max(Math.abs(b.stabilGenau.s1), Math.abs(b.stabilGenau.s2))).sort((x, y) => x - y);
  if (gen.length) console.log(`   genau gerechnet ${gen.length}: kleinster größter Index ${gen[0].toExponential(2)}`);
  const lam = l.map(b => b.lambda).filter(Number.isFinite).sort((x, y) => x - y);
  console.log(`   |λ| (double): kleinstes ${lam[0].toExponential(1)}, Median ${lam[lam.length >> 1].toExponential(1)}, größtes ${lam[lam.length - 1].toExponential(1)}`);
  const reste = l.map(b => b.rest).sort((x, y) => x - y);
  console.log(`   Rest: größter ${reste[reste.length - 1].toExponential(1)}`);
}
