// dreikoerper/werkzeug/bhh-familien-ab.mjs — BHH-Startlage für die Familien A und B (21.11.2026; Felix fragte, ob die
// beiden früheren Veröffentlichungen ein Update brauchen — B war vor dem 17.11. nur gegen vier Listen geprüft).
//
//   node werkzeug/bhh-familien-ab.mjs        schreibt ergebnisse/bhh-lage-familien-ab.json
//
// Je stabile 30-Stellen-Probe der Familien (ergebnisse/fortsetzung-1-1-5-{b,a}-genau.json und die Stützstelle bei
// m3 = 5, wie familie-b-bauen.mjs sie liest — hier aus den veröffentlichten Tabellen von dreikoerper-familie-b,
// daten/family-{B,A}-30digit.csv, die genau diese Werte tragen): dieselbe Regel wie bhh-alle.mjs. Die Regel wird
// WÖRTLICH aus bhh-alle.mjs genommen (lage, urteilProbe), nicht abgeschrieben.

import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { HIER, ladeKern } from "../quellen.mjs";
import { schreibeSicher } from "./sicher.mjs";

const K = ladeKern(), schritt = K.macheTaylor(), EB = K.EBENEN.euler, N = 200000;
const q = readFileSync(join(HIER, "werkzeug", "bhh-alle.mjs"), "utf8");
const von = q.indexOf("function lage("), bis = q.indexOf("PR.kandidaten.forEach");
if (von < 0 || bis < 0) { console.error("Regel in bhh-alle.mjs nicht gefunden"); process.exit(1); }
const urteilProbe = new Function("K", "schritt", "EB", "N", q.slice(von, bis) + "\nreturn urteilProbe;")(K, schritt, EB, N);
const B = join(HIER, "..", "dreikoerper-familie-b", "daten");
if (!existsSync(B)) { console.error(`${B} fehlt (die veröffentlichte Familie B)`); process.exit(1); }
const aus = { zweck: "BHH-Startlage der Familien A und B (dreikoerper-familie-b): kommen ihre stabilen Proben je in die Startlage der BHH-Kataloge?", regel: "werkzeug/bhh-alle.mjs (lage, urteilProbe), Abtastung " + N, erzeugt: new Date().toISOString(), familien: {} };
for (const fam of ["B", "A"]) {
  const zeilen = readFileSync(join(B, `family-${fam}-30digit.csv`), "utf8").split(/\r?\n/).filter(z => z && !z.startsWith("#"));
  const kopf = zeilen.shift().split(","), sp = n => kopf.indexOf(n);
  const proben = [];
  for (const z of zeilen.map(z => z.split(",")).filter(z => z[sp("verdict")] === "stable")) {
    const m3 = +z[sp("m3")], r = urteilProbe(m3, +z[sp("a")], +z[sp("b")], +z[sp("T")]);
    proben.push({ m3, urteil: r.urteil, syzygien: [r.r1.syzygien, r.r2.syzygien], mitte: r.r2.mitte, minAnteil: r.r2.minAnteil });
  }
  const nie = proben.filter(p => p.urteil === "nie in BHH-Startlage").length, anteile = proben.map(p => p.minAnteil).filter(x => x != null);
  aus.familien[fam] = { proben, stabil: proben.length, nie, kleinsterAnteil: Math.min(...anteile), groessterAnteil: Math.max(...anteile) };
  console.log(`Familie ${fam}: ${nie} von ${proben.length} stabilen Proben nie in BHH-Startlage; kleinster Längsanteil ${Math.min(...anteile).toFixed(3)} bis ${Math.max(...anteile).toFixed(3)}`);
}
schreibeSicher(join(HIER, "ergebnisse", "bhh-lage-familien-ab.json"), JSON.stringify(aus, null, 1));
