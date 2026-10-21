// dreikoerper/werkzeug/stabil-zaehlen.mjs — wie fällt das Stabilitätsurteil
// eines Laufs unter den beiden Fehlerschranken aus? Rechnet nichts neu, liest
// nur s1, s2, Symplektikfehler und |λ| aus dem Laufbericht.
//
//   node werkzeug/stabil-zaehlen.mjs euler-gleich-1

import { readFileSync } from "node:fs";
import { join } from "node:path";
import { HIER } from "../quellen.mjs";

const lauf = process.argv[2];
const b = JSON.parse(readFileSync(join(HIER, "ergebnisse", lauf + ".json"), "utf8"));
const urteil = (f, schranke) => {
  if (f.symplektik === undefined || f.s1 === undefined) return "ohne Monodromie";
  const komplex = !!f.sKomplex;
  const rand = 2 - Math.max(Math.abs(f.s1), Math.abs(f.s2));
  if (komplex ? f.sIm * f.sIm < schranke : Math.abs(rand) < schranke) return "offen";
  return !komplex && rand > 0 ? "stabil" : "instabil";
};
const zaehle = (liste, fn) => { const z = {}; for (const f of liste) { const u = fn(f); z[u] = (z[u] || 0) + 1; } return z; };
for (const [name, liste] of [["alle", b.funde], ["in einer Liste", b.funde.filter(f => f.bekannt)], ["in keiner Liste", b.funde.filter(f => !f.bekannt)]]) {
  console.log(`${name} (${liste.length})`);
  console.log("  im Bericht:              ", JSON.stringify(zaehle(liste, f => f.stabil === true ? "stabil" : f.stabil === false ? "instabil" : "offen")));
  console.log("  Schranke 150·sympl:      ", JSON.stringify(zaehle(liste, f => urteil(f, 150 * f.symplektik))));
  console.log("  Schranke 150·sympl/|λ|:  ", JSON.stringify(zaehle(liste, f => urteil(f, 150 * f.symplektik / Math.max(1, f.lambda)))));
}
const un = b.funde.filter(f => !f.bekannt && urteil(f, 150 * f.symplektik) === "offen").sort((x, y) => x.lambda - y.lambda);
console.log(`\nIn keiner Liste und unter der alten Schranke offen: ${un.length}. |λ| (double): kleinstes ${un[0]?.lambda.toExponential(1)}, Median ${un[un.length >> 1]?.lambda.toExponential(1)}, größtes ${un[un.length - 1]?.lambda.toExponential(1)}`);
for (const f of un.slice(0, 12)) console.log(`  T ${f.T.toFixed(2).padStart(7)}  s ${f.s1.toExponential(2)} / ${f.s2.toExponential(2)}${f.sKomplex ? " komplex" : ""}  sympl ${f.symplektik.toExponential(1)}  |λ| ${f.lambda.toExponential(1)}`);
