// dreikoerper/werkzeug/genau-offene.mjs — welche Zeilen einer Nachprüfung sind
// nicht „belegt", und woran hängt es?
//
//   node werkzeug/genau-offene.mjs euler-gleich-1

import { readFileSync } from "node:fs";
import { join } from "node:path";
import { HIER } from "../quellen.mjs";

const lauf = process.argv[2];
const g = JSON.parse(readFileSync(join(HIER, "ergebnisse", lauf + "-genau.json"), "utf8"));
const b = JSON.parse(readFileSync(join(HIER, "ergebnisse", lauf + ".json"), "utf8"));
const z = x => (typeof x === "number" && Number.isFinite(x) ? x.toExponential(1) : "—");
const zahl = {};
for (const r of g.geprueft) zahl[r.urteil] = (zahl[r.urteil] || 0) + 1;
console.log(`${lauf}: ${g.geprueft.length} Zeilen`, JSON.stringify(zahl), `Rechenzeit ${(g.rechenSekunden / 60).toFixed(0)} min`);
const sek = g.geprueft.filter(r => r.sekunden).map(r => r.sekunden).sort((x, y) => x - y);
if (sek.length) console.log(`Sekunden je Bahn: Median ${sek[sek.length >> 1].toFixed(0)}, größte ${sek[sek.length - 1].toFixed(0)}`);
for (const r of g.geprueft.filter(r => r.urteil !== "belegt")) {
  const f = b.funde.find(q => Math.abs(q.a - r.start[0]) < 1e-11 && Math.abs(q.b - r.start[1]) < 1e-11);
  console.log(`  Nr. ${r.i}  a ${r.start[0].toFixed(10)} b ${r.start[1].toFixed(10)} T ${r.start[2].toFixed(4)}  Urteil ${r.urteil}  Rest ${z(r.rest)}  Rest (448 Bit) ${z(r.restAndereGenauigkeit)}  Unterschied ${z(r.unterschiedDerReste)}  Korrektur ${z(r.korrektur)}  Iterationen ${r.iter}  Grund ${r.grund || r.fehler || "—"}` +
    (f ? `  |λ| double ${z(f.lambda)}  Rest double ${z(f.rest)}  Urteil double ${f.urteil}  Umkehrpunkt ${f.halb ? f.halb.ziel + " Rest " + z(f.halb.rest) : "—"}  rMin ${z(f.rMin)}` : ""));
}
const st = g.geprueft.filter(r => r.stabilGenau);
if (st.length) { const u = {}; for (const r of st) u[r.stabilGenau.urteil] = (u[r.stabilGenau.urteil] || 0) + 1; console.log("Stabilität genau:", JSON.stringify(u)); }
