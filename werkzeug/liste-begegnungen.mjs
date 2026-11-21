// dreikoerper/werkzeug/liste-begegnungen.mjs — wie nah kommen sich die Körper in den Listenbahnen?
// (06.11.2026) Die Stichprobe der Massen-Fortsetzung brach überall dort ab, wo die engste
// Begegnung 5e-6 bis 1,6e-4 erreichte; B (0,017) und I.A-5 (0,0015) liefen weit.
//
//   node werkzeug/liste-begegnungen.mjs
//
// Je Listenbahn von Li, Jing & Liao (2018): engste Begegnung über einen Umlauf (double) und
// die Stabilität in double (nur Hinweis — bei engen Begegnungen unzuverlässig).
// Ergebnis nach ergebnisse/liste-begegnungen.json.

import { writeFileSync } from "node:fs";
import { join } from "node:path";
import { HIER, ladeKern, ladeKatalog } from "../quellen.mjs";

const K = ladeKern(), u0 = new Float64Array(12), variation = K.macheVariation();
const liste = ladeKatalog().bahnen.filter(b => b.satz === "ungleich"), aus = [];
const t0 = Date.now();
for (const b of liste) {
  K.EBENEN.euler.anfang(b.a, b.b, b.m, u0);
  const dg = K.durchgaenge(u0, b.m, b.T, 1e-11);
  let s1 = NaN, s2 = NaN, komplex = false;
  if (dg.rMin >= 1e-3) { const Y = variation(u0, b.m, b.T, 1e-16, 1e7); const st = K.stabilitaet(Y.y); s1 = st.s1; s2 = st.s2; komplex = st.komplex; }
  aus.push({ name: b.name, m3: b.m[2], T: b.T, Ts: b.Ts, rMin: dg.rMin, s1, s2, komplex });
}
const stufen = [1e-5, 1e-4, 1e-3, 3e-3, 1e-2];
console.log(`${liste.length} Listenbahnen, ${((Date.now() - t0) / 1000).toFixed(0)} s`);
for (const g of stufen) console.log(`  engste Begegnung ≥ ${g.toExponential(0)}: ${aus.filter(x => x.rMin >= g).length}`);
const gut = aus.filter(x => x.rMin >= 1e-3);
const je = {}; for (const x of gut) je[x.m3] = (je[x.m3] || 0) + 1;
console.log("davon je Masse:", JSON.stringify(je));
const stabil = gut.filter(x => !x.komplex && Math.abs(x.s1) < 2 && Math.abs(x.s2) < 2);
console.log(`davon in double stabil: ${stabil.length} — ${stabil.map(x => x.name + "@" + x.m3).join(", ")}`);
writeFileSync(join(HIER, "ergebnisse", "liste-begegnungen.json"), JSON.stringify({ erzeugt: new Date().toISOString(), bahnen: aus }, null, 1));
