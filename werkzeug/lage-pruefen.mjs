// dreikoerper/werkzeug/lage-pruefen.mjs — ist „dieselbe Bahn, andere Lage"
// wirklich dieselbe Bahn?
//
//   node werkzeug/lage-pruefen.mjs
//
// Der Abgleich nennt einen Fund „Lage", wenn seine Klasse und seine skalierte
// Periode T* zu einer Listenbahn passen. Im Labor stand so eine „Acht (andere
// Lage)" in der Liste — und maß sich instabil, während die Acht stabil ist.
// Dieselbe Bahn hat an jeder Stelle dieselbe Stabilität. Hier: alle Funde der
// Läufe mit Stufe „lage", ihr Abstand in T* zur Listenbahn, und wo beide
// Urteile bekannt sind, ob sie übereinstimmen.

import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { HIER, ladeKern, ladeKatalog } from "../quellen.mjs";

const K = ladeKern(), kat = ladeKatalog(), pr = K.macheFundpruefer();
const ordner = join(HIER, "ergebnisse");
const e = x => (Number.isFinite(x) ? x.toExponential(1) : "—");
const urteil = s => (s === true ? "stabil" : s === false ? "instabil" : "offen");
let n = 0, verschieden = 0; const ab = [];
for (const datei of readdirSync(ordner).filter(d => d.endsWith(".json") && !d.endsWith("-genau.json") && !d.startsWith("katalogabgleich") && d !== "funde.json")) {
  const lauf = JSON.parse(readFileSync(join(ordner, datei), "utf8"));
  if (!lauf.funde) continue;
  for (const f of lauf.funde) {
    if (!f.katalog || f.katalog.stufe !== "lage") continue;
    const k = kat.bahnen.find(q => q.name === f.katalog.name && q.ebene === lauf.parameter.ebene && q.m.join() === lauf.parameter.m.join());
    if (!k) continue;
    n++;
    const d = Math.abs(f.Ts / k.Ts - 1); ab.push(d);
    // Stabilität der Listenbahn selbst, mit demselben Kern
    const v = K.macheVerfeinerer()(k.ebene, k.m, k.a, k.b, k.T, { tSpanne: 0.05 });
    const s = v.ok ? pr.stabilitaetMessen(k.ebene, k.m, v.a, v.b, v.T) : null;
    const anders = s && s.stabil !== null && f.stabil !== null && f.stabil !== undefined && s.stabil !== f.stabil;
    if (anders || d > 1e-8) {
      if (anders) verschieden++;
      console.log(`${lauf.lauf}: Fund (${f.a.toFixed(6)}, ${f.b.toFixed(6)}) T ${f.T.toFixed(4)} T* ${f.Ts.toFixed(7)} ${urteil(f.stabil)} |λ| ${e(f.lambda)}  ↔  ${k.rufname || k.name} (${k.a.toFixed(6)}, ${k.b.toFixed(6)}) T ${k.T.toFixed(4)} T* ${k.Ts.toFixed(7)} ${s ? urteil(s.stabil) + " |λ| " + e(s.lambda) : "nicht verfeinert"}   ΔT* ${e(d)}${anders ? "   ← VERSCHIEDENE STABILITÄT" : ""}`);
    }
  }
}
ab.sort((x, y) => x - y);
console.log(`\n${n} Funde mit Stufe „lage". Abstand in T* zur Listenbahn: kleinster ${e(ab[0])}, Median ${e(ab[ab.length >> 1])}, größter ${e(ab[ab.length - 1])}`);
for (const g of [1e-9, 1e-8, 1e-7, 1e-6, 1e-5]) console.log(`  unter ${e(g)}: ${ab.filter(x => x < g).length}`);
console.log(`Mit anderer Stabilität als die Listenbahn (also sicher eine andere Bahn): ${verschieden}`);
