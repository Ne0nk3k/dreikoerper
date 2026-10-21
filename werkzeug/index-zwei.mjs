// dreikoerper/werkzeug/index-zwei.mjs — wo liegt ein Stabilitätsindex exakt bei 2?
//
//   node werkzeug/index-zwei.mjs
//
// Offene Frage (AUFGABEN, Punkt 6): bei auffällig vielen Bahnen liegt ein
// Index auf 10⁻⁶ oder genauer bei 2. Hier, über alle Läufe mit Stabilität aus
// 30 Stellen: wie verteilt sich das auf Massen, Ebene, Spiegelpunkt (Ziel der
// Halbperiodensuche) und Vorzeichen? Nichts wird gerechnet.

import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join } from "node:path";
import { HIER } from "../quellen.mjs";

const ordner = join(HIER, "ergebnisse"), ort = (a, b) => Math.round(Math.abs(a) * 1e9) + ":" + Math.round(Math.abs(b) * 1e9);
const z = [];
for (const datei of readdirSync(ordner).filter(d => d.endsWith(".json") && !/-genau\.json$|-grauzone\.json$|^katalogabgleich|^funde\.json$/.test(d))) {
  const B = JSON.parse(readFileSync(join(ordner, datei), "utf8")), gp = join(ordner, B.lauf + "-genau.json");
  if (!B.funde || !existsSync(gp)) continue;
  const genau = new Map(JSON.parse(readFileSync(gp, "utf8")).geprueft.filter(r => r.start).map(r => [ort(r.start[0], r.start[1]), r]));
  for (const f of B.funde) {
    const r = genau.get(ort(f.a, f.b)), s = r && r.stabilGenau; if (!s || !Number.isFinite(s.s1)) continue;
    const d1 = Math.abs(Math.abs(s.s1) - 2), d2 = Math.abs(Math.abs(s.s2) - 2), nah = Math.min(d1, d2);
    z.push({ nah, plus: (d1 < d2 ? s.s1 : s.s2) > 0, ziel: f.halb ? f.halb.ziel : "voll", ebene: B.parameter.ebene, gleich: B.parameter.m.every(x => x === B.parameter.m[0]), gross: Math.max(Math.abs(s.s1), Math.abs(s.s2)) });
  }
}
const ex = z.filter(x => x.nah < 1e-6), zaehl = (l, f) => { const o = {}; for (const x of l) o[f(x)] = (o[f(x)] || 0) + 1; return Object.entries(o).map(([k, n]) => `${k} ${n}`).join(", "); };
console.log(`Bahnen mit Stabilität aus 30 Stellen: ${z.length}; ein Index näher als 1e-6 an 2: ${ex.length}`);
for (const [name, f] of [["Massen", x => (x.gleich ? "gleich" : "ungleich")], ["Ebene", x => x.ebene], ["Spiegelpunkt", x => x.ziel]]) {
  const gruppen = [...new Set(z.map(f))];
  console.log(`  nach ${name}: ` + gruppen.map(g => `${g}: ${ex.filter(x => f(x) === g).length} von ${z.filter(x => f(x) === g).length}`).join(" · "));
}
console.log(`  Vorzeichen des Index bei 2: ${zaehl(ex, x => (x.plus ? "+2" : "−2"))}`);
console.log(`  Achtung Auswahl: bei gleichen Massen sind fast nur stark instabile Bahnen nachgerechnet (größter Index im Median ${(() => { const g = z.filter(x => x.gleich).map(x => x.gross).sort((a, b) => a - b); return g.length ? g[g.length >> 1].toExponential(1) : "—"; })()}), bei ungleichen vor allem Kandidaten nahe der Grenze.`);
