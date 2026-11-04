// dreikoerper/werkzeug/feinscan.mjs — eine Fortsetzung fein abtasten, um einen
// schmalen Instabilitätsstreifen zu finden oder auszuschließen (21.10.2026).
//
//   node werkzeug/feinscan.mjs --name fortsetzung-1-1-5-b --von 4.4 --bis 4.6 --schritt 0.002
//
// In double — nur dort, wo double nachweislich trägt (für Familie B bei
// m₃ = 5: Indizes auf 3·10⁻⁵ wie auf 30 Stellen). Startwerte linear aus der
// Fortsetzung, dann Schritt für Schritt mit Vorhersage aus den letzten zwei.
// Gibt das kleinste s₂ und das größte s₁ und jeden Vorzeichenwechsel von
// 2 − |s| aus.

import { readFileSync } from "node:fs";
import { join } from "node:path";
import { HIER, ladeKern } from "../quellen.mjs";

const argv = process.argv.slice(2), arg = (n, v) => (argv.includes(n) ? argv[argv.indexOf(n) + 1] : v);
const NAME = arg("--name"), VON = +arg("--von"), BIS = +arg("--bis"), H = +arg("--schritt", 0.002);
const K = ladeKern(), pruefe = K.macheFundpruefer();
const R = JSON.parse(readFileSync(join(HIER, "ergebnisse", NAME + ".json"), "utf8"));
const pts = [...R.richtungen.abwaerts.punkte, { m3: R.start.m3, a: R.start.a, b: R.start.b, T: R.start.T }, ...R.richtungen.aufwaerts.punkte].sort((x, y) => x.m3 - y.m3);
const nahe = m => { let i = pts.findIndex(p => p.m3 >= m); if (i <= 0) i = 1; const p = pts[i - 1], q = pts[i], f = (m - p.m3) / (q.m3 - p.m3 || 1); return { a: p.a + f * (q.a - p.a), b: p.b + f * (q.b - p.b), T: p.T + f * (q.T - p.T) }; };
let l = null, v = null, minS2 = Infinity, maxS1 = -Infinity, wechsel = [], n = 0, randMin = Infinity, beiRand = null;
for (let m = VON; m <= BIS + 1e-12; m += H) {
  const f = l && v ? (m - l.m3) / (l.m3 - v.m3) : 0;
  const s = l && v ? { a: l.a + f * (l.a - v.a), b: l.b + f * (l.b - v.b), T: l.T + f * (l.T - v.T) } : nahe(m);
  const p = pruefe("euler", [1, 1, m], s.a, s.b, s.T, {});
  if (!p.ok) { console.log(`m3 ${m.toFixed(4)}: Newton nimmt nicht an`); continue; }
  const q = { m3: m, a: p.a, b: p.b, T: p.T, s1: p.s1, s2: p.s2, komplex: !!p.sKomplex, rand: p.rand, stabil: p.stabil };
  n++;
  if (!q.komplex) { minS2 = Math.min(minS2, q.s2); maxS1 = Math.max(maxS1, q.s1); }
  if (q.rand < randMin) { randMin = q.rand; beiRand = q; }
  if (l && Math.sign(l.rand) !== Math.sign(q.rand)) wechsel.push(`${l.m3.toFixed(4)}→${m.toFixed(4)} (Rand ${l.rand.toExponential(2)} → ${q.rand.toExponential(2)})`);
  v = l; l = q;
}
console.log(`${NAME}, m3 ${VON} … ${BIS} in Schritten ${H}: ${n} Punkte`);
console.log(`kleinstes s2 ${minS2.toFixed(6)}, größtes s1 ${maxS1.toFixed(6)}; kleinster Abstand zur Grenze ${randMin.toExponential(3)} bei m3 ${beiRand && beiRand.m3.toFixed(4)} (s ${beiRand && beiRand.s1.toFixed(6)} / ${beiRand && beiRand.s2.toFixed(6)})`);
console.log(wechsel.length ? "Vorzeichenwechsel von 2 − |s|: " + wechsel.join("; ") : "kein Vorzeichenwechsel: durchgehend auf derselben Seite der Grenze");
