// dreikoerper/werkzeug/liliao-ts.mjs — bei ungleichen Massen ist Li/Liao die
// einzige Vergleichsliste, und der Abgleich „gleiche Bahn an anderer Stelle"
// verlangt dort gleiche Klasse UND gleiches T*. Hängt ein Fund „in keiner
// Liste" nur daran, dass seine Klasse anders herauskam? Hier der Vergleich
// über T* allein.
//
//   node werkzeug/liliao-ts.mjs euler-m3-2
//
// Je Fund außerhalb der Liste: die Listenbahn derselben Massen mit dem
// nächsten T*. Li/Liao geben T auf etwa zehn Stellen; ein Treffer läge unter 1e-7.

import { readFileSync } from "node:fs";
import { join } from "node:path";
import { HIER, ladeKatalog } from "../quellen.mjs";

const lauf = process.argv[2];
const b = JSON.parse(readFileSync(join(HIER, "ergebnisse", lauf + ".json"), "utf8"));
const P = b.parameter;
const liste = ladeKatalog().bahnen.filter(k => k.ebene === P.ebene && k.m.every((v, i) => Math.abs(v - P.m[i]) < 1e-12));
console.log(`${lauf}: Massen ${P.m.join("/")}, ${liste.length} Listenbahnen (Li/Liao), ${b.funde.length} Funde`);
const e = x => x.toExponential(1);
const zeile = f => { let best = null, d = Infinity; for (const k of liste) { const q = Math.abs(k.Ts / f.Ts - 1); if (q < d) { d = q; best = k; } } return { f, best, d }; };
// Eichung des Vergleichs: bei den Funden, die am Ort einer Listenbahn stehen, muss T* passen
const ort = b.funde.filter(f => f.katalog.stufe === "ort").map(zeile).sort((x, y) => x.d - y.d);
if (ort.length) console.log(`  Eichung an den ${ort.length} Ortstreffern: T* weicht ab um Median ${e(ort[ort.length >> 1].d)}, höchstens ${e(ort[ort.length - 1].d)}`);
const un = b.funde.filter(f => !f.bekannt).map(zeile).sort((x, y) => x.d - y.d);
console.log(`  ${un.length} Funde in keiner Liste: nächstes Listen-T* entfernt um — kleinste ${un.slice(0, 5).map(x => e(x.d)).join(", ")}; Median ${e(un[un.length >> 1].d)}`);
for (const g of [1e-7, 1e-6, 1e-5, 1e-4]) console.log(`    näher als ${e(g)}: ${un.filter(x => x.d < g).length}`);
console.log("  die zwölf nächsten:");
for (const x of un.slice(0, 12)) console.log(`    T* ${x.f.Ts.toFixed(6)} (${x.f.a.toFixed(6)}, ${x.f.b.toFixed(6)}) T ${x.f.T.toFixed(4)} ${x.f.stabil === true ? "stabil" : x.f.stabil === false ? "instabil" : "offen"} Wort ${x.f.wort.length} · Liste: ${x.best.name} T* ${x.best.Ts.toFixed(6)} (${x.best.a.toFixed(6)}, ${x.best.b.toFixed(6)}) T ${x.best.T.toFixed(4)} · Abstand ${e(x.d)} · Stufe ${x.f.katalog.stufe}`);
const stab = un.filter(x => x.f.stabil !== false && Math.abs(x.f.s1) < 3 && Math.abs(x.f.s2) < 3);
console.log(`  Funde in keiner Liste mit beiden Indizes unter 3 (stabil oder nahe daran): ${stab.length}`);
for (const x of stab) console.log(`    T* ${x.f.Ts.toFixed(6)} (${x.f.a.toFixed(8)}, ${x.f.b.toFixed(8)}) T ${x.f.T.toFixed(4)} s ${x.f.s1.toFixed(4)} / ${x.f.s2.toFixed(4)} · nächste Listenbahn ${x.best.name} T* ${x.best.Ts.toFixed(6)}, Abstand ${e(x.d)} · Stufe ${x.f.katalog.stufe}${x.f.katalog.rufname || x.f.katalog.name ? " (" + (x.f.katalog.rufname || x.f.katalog.name) + ")" : ""}`);
