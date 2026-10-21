// dreikoerper/werkzeug/verpasst.mjs — warum findet ein Lauf eine bekannte Bahn nicht?
//
//   node werkzeug/verpasst.mjs <lauf> [Tmax=10]
//
// Listet die Bahnen des großen Katalogs im Fenster bis Tmax, sagt je Bahn, ob
// der Lauf sie hat, und nennt aus der Eigenwertdatei der Quelle |λ|max (nur
// für die ersten 12 431). Daneben, was der Kern findet, wenn er genau dort
// startet: so trennt sich „Raster zu grob" von „double trägt die Bahn nicht".
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { HIER, ladeGross, ladeKern } from "../quellen.mjs";
const lauf = process.argv[2], TM = +(process.argv[3] || 10);
const B = JSON.parse(readFileSync(join(HIER, "ergebnisse", lauf + ".json"), "utf8"));
const G = ladeGross().euler, K = ladeKern(), P = K.macheFundpruefer();
const roh = readFileSync(join(HIER, "quelle/hristov/euler/eigenvalues_12431.txt"), "utf8").split(/\r?\n/).filter(x => x.trim());
const ics = readFileSync(join(HIER, "quelle/hristov/euler/100_12431.txt"), "utf8").split(/\r?\n/).filter(x => x.trim()).map(l => l.trim().split(/\s+/).map(Number));
const lam = new Map();
for (let k = 0; k < roh.length; k += 5) {
  const l = [1, 2, 3, 4].map(j => { const t = roh[k + j].trim().split(/\s+/); return Math.hypot(+t[0], t.length > 1 ? parseFloat(t[2]) : 0); });
  const v = ics[k / 5]; lam.set(v[0].toFixed(9) + ":" + v[1].toFixed(9), Math.max(...l));
}
const [a0, a1, b0, b1] = B.parameter.sicht;
const idx = G.imFenster(a0, a1, b0, b1, TM).sort((x, y) => G.w[4 * x + 2] - G.w[4 * y + 2]);
console.log("      v₁          v₂          T        |λ| (Quelle)  im Lauf   Kern von dort: Rest      Gegenprobe  engste Begegnung");
let gef = 0, traegt = 0;
for (const i of idx) {
  const a = G.w[4 * i], b = G.w[4 * i + 1], T = G.w[4 * i + 2];
  const drin = B.funde.some(f => Math.abs(Math.abs(f.a) - a) < 1e-6 && Math.abs(Math.abs(f.b) - b) < 1e-6);
  const p = P("euler", [1, 1, 1], a, b, T, { tSpanne: 0.02, annahme: 1e-6 });
  if (drin) gef++; if (p.ok) traegt++;
  const l = lam.get(a.toFixed(9) + ":" + b.toFixed(9));
  console.log(`  ${a.toFixed(8)}  ${b.toFixed(8)}  ${T.toFixed(4).padStart(8)}  ${(l ? l.toExponential(2) : "—").padStart(10)}    ${drin ? "ja  " : "nein"}      ${p.ok ? "ok  " : "nein"} ${(p.rest ?? NaN).toExponential(1).padStart(9)}  ${(p.gegenprobe ?? NaN).toExponential(1).padStart(9)}   ${(p.rMin ?? NaN).toExponential(1)}`);
}
console.log(`\n${idx.length} Bahnen bis T = ${TM}: im Lauf ${gef}, vom Kern in double getragen ${traegt}`);
