// dreikoerper/werkzeug/genau-einzeln.mjs — eine einzelne Bahn eines Laufs durch
// verfeinereGenau, mit dem ganzen Verlauf der Reste.
//
//   node werkzeug/genau-einzeln.mjs euler-gleich-1 0.0873969197 [--halb]
//
// Die Bahn wird über ihren a-Wert gesucht (zehn Stellen genügen).
// --halb: zusätzlich in Festkomma bis zum Umkehrpunkt laufen und sagen, wie
// gut die Spiegelstellung getroffen ist.

import { readFileSync } from "node:fs";
import { join } from "node:path";
import { HIER, ladeKern } from "../quellen.mjs";
import { verfeinereGenau, macheGenau } from "../genau.mjs";

const K = ladeKern();
const lauf = process.argv[2], aSuch = +process.argv[3];
const b = JSON.parse(readFileSync(join(HIER, "ergebnisse", lauf + ".json"), "utf8"));
const f = b.funde.find(q => Math.abs(q.a - aSuch) < 1e-9);
if (!f) { console.error("keine Bahn mit a =", aSuch); process.exit(2); }
const P = b.parameter;
console.log(`Bahn a ${f.a} b ${f.b} T ${f.T}  |λ| ${f.lambda.toExponential(2)}  Rest double ${f.rest.toExponential(1)}  Urteil ${f.urteil}  Umkehrpunkt ${f.halb ? JSON.stringify(f.halb) : "—"}`);

if (process.argv.includes("--halb") && f.halb) {
  // bis τ in Festkomma, dann die Umkehrbedingung mit dem Kern (double genügt zum Ablesen)
  const G = macheGenau(320, 40), mF = P.m.map(String).map(G.ausDezimal);
  for (const k of [1, 2, 3, 4]) {
    const u = G.anfang(P.ebene, G.ausZahl(f.a), G.ausZahl(f.b), mF);
    const e = G.lauf(u, mF, G.ausZahl(f.halb.tau * k), -40 * Math.log2(10));
    const ud = Float64Array.from(u.map(G.zuZahl)), g = new Float64Array(3);
    const zeile = K.ZIELE.map((name, s) => `${name} ${K.umkehr(s, ud, g).toExponential(1)}`).join("  ");   // umkehr nimmt die Nummer des Ziels
    console.log(`  nach ${k}·τ (${(f.halb.tau * k).toFixed(4)}, Art ${e.art}): Abstand zu den Fixmengen  ${zeile}`);
  }
}
const t0 = Date.now();
const g = verfeinereGenau(P.ebene, P.m.map(String), f.a, f.b, f.T, { stellen: 30, empfindlich: Math.log10(f.lambda) });
console.log(`ok ${g.ok}  Grund ${g.grund}  Iterationen ${g.iter}  eigene Ableitung ${g.eigeneAbleitung}  Ordnung ${g.ordnung}  ${((Date.now() - t0) / 1000).toFixed(0)} s`);
console.log("Verlauf der Reste:", g.verlauf.map(x => x.toExponential(1)).join(" → "));
console.log("Korrektur gegen double:", g.korrektur.map(x => x.toExponential(2)).join(", "), " Rest (448 Bit):", g.restAndereGenauigkeit);
