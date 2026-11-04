// dreikoerper/werkzeug/halbperiode-familie.mjs — Halbperioden-Symmetrie an allen
// 30-Stellen-Punkten einer Massen-Fortsetzung (04.11.2026).
//
//   node werkzeug/halbperiode-familie.mjs fortsetzung-1-1-4
//
// Ruft halbperiode.mjs (Hauptordner) für jeden Punkt aus
// ergebnisse/<name>-genau.json und schreibt ergebnisse/halbperiode-<name>.json.
// Anlass: Familie B berührt bei m3 ≈ 4,5469 den Index −2, ohne ihn zu kreuzen.
// Hat eine Bahn x(T/2) = g x(0), ist M = N² und s = σ² − 2 — reelle,
// verschiedene Indizes bleiben dann ≥ −2. Für die I.A-5-Familie erledigt das
// den Vorbehalt aus Version 1.0.0 („ein schmaler instabiler Streifen bei
// m3 = 4,11 ist nicht ausgeschlossen“).
// Exit-Code von halbperiode.mjs: 0 Symmetrie und Quadrat bestätigt, 3 Symmetrie
// ja, Monodromie in double zu grob für das Quadrat, 1 keine Symmetrie.

import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { spawnSync } from "node:child_process";
import { HIER } from "../quellen.mjs";

const name = process.argv[2];
if (!name) { console.error("Aufruf: node werkzeug/halbperiode-familie.mjs <fortsetzung>"); process.exit(2); }
const punkte = JSON.parse(readFileSync(join(HIER, "ergebnisse", name + "-genau.json"), "utf8")).punkte.filter(p => p.ok).sort((x, y) => x.m3 - y.m3);
const aus = [];
for (const p of punkte) {
  const h = spawnSync(process.execPath, [join(HIER, "halbperiode.mjs"), "--m", `1,1,${p.m3}`, "--a", p.a, "--b", p.b, "--T", p.T], { encoding: "utf8" });
  const z = re => +((h.stdout.match(re) || [])[1]);
  const e = { m3: p.m3, code: h.status, d: z(/\| = ([\d.e+-]+)\s+\(best other g/), dAnders: z(/best other g: ([\d.e+-]+)\)/),
    quadrat: z(/\|N² − M\| \/ \|M\| = ([\d.e+-]+)/), ohneG: z(/without g: ([\d.e+-]+);/), anderesG: z(/with the best other g: ([\d.e+-]+)\)/),
    tausch: /bodies 1 and 2 exchanged/.test(h.stdout), rMin: z(/closest approach of two bodies: ([\d.e+-]+)/), urteil30: p.urteil, s1: p.s1, s2: p.s2 };
  aus.push(e);
  console.log(`m3 ${String(p.m3).padEnd(14)} ${e.code === 0 ? "M = N²  " : e.code === 3 ? "nur Sym." : "keine   "}  |g x(0) − x(T/2)| ${e.d.toExponential(1)}  |N² − M|/|M| ${e.quadrat.toExponential(1)}  andere ≥ ${Math.min(e.ohneG, e.anderesG).toExponential(1)}  rMin ${e.rMin.toExponential(1)}`);
}
const n0 = aus.filter(e => e.code === 0).length, n3 = aus.filter(e => e.code === 3).length;
writeFileSync(join(HIER, "ergebnisse", `halbperiode-${name}.json`), JSON.stringify({ erzeugt: new Date().toISOString(), fortsetzung: name, punkte: aus.length, bestaetigt: n0, nurSymmetrie: n3, keine: aus.length - n0 - n3, je: aus }, null, 1));
console.log(`${name}: ${n0} von ${aus.length} Punkten M = N², ${n3} nur die Symmetrie (Monodromie in double zu grob), ${aus.length - n0 - n3} ohne`);
