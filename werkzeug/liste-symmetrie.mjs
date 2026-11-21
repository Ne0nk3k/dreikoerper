// dreikoerper/werkzeug/liste-symmetrie.mjs — Halbperioden-Symmetrie der auf 30 Stellen stabilen
// Bahnen der Listenfortsetzung (07.11.2026).
//
//   node werkzeug/liste-symmetrie.mjs [--alle]
//
// Für jeden Punkt in ergebnisse/listenfortsetzung/*-genau.json mit Urteil „stabil“ (mit --alle:
// jeden angenommenen Punkt) halbperiode.mjs: g mit x(T/2) = g x(0), und M = N². Bei Familie B,
// A und I.A-5 gilt das; gilt es für alle, ist ein Index nahe −2 dort eine Berührung, kein
// Kreuzen. Ergebnis nach ergebnisse/listenfortsetzung-symmetrie.json. Ein Prozess, je Punkt
// unter einer Sekunde bis wenige Sekunden (double).

import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { spawnSync } from "node:child_process";
import { setPriority, constants } from "node:os";
import { HIER } from "../quellen.mjs";

try { setPriority(constants.priority.PRIORITY_LOW); } catch { /* ohne Recht bleibt es normal */ }
const ALLE = process.argv.includes("--alle"), ORDNER = join(HIER, "ergebnisse", "listenfortsetzung");
const aus = [], t0 = Date.now();
for (const n of readdirSync(ORDNER).filter(x => x.endsWith("-genau.json"))) {
  const G = JSON.parse(readFileSync(join(ORDNER, n), "utf8"));
  for (const p of G.punkte.filter(q => q.ok && (ALLE || q.urteil === "stabil"))) {
    const h = spawnSync(process.execPath, [join(HIER, "halbperiode.mjs"), "--m", `1,1,${p.m3}`, "--a", p.a, "--b", p.b, "--T", p.T], { encoding: "utf8" });
    const z = re => +((h.stdout.match(re) || [])[1]);
    aus.push({ familie: n.replace(/-genau\.json$/, ""), m3: p.m3, urteil: p.urteil, s1: p.s1, s2: p.s2, code: h.status,
      d: z(/\| = ([\d.e+-]+)\s+\(best other g/), quadrat: z(/\|N² − M\| \/ \|M\| = ([\d.e+-]+)/), andere: Math.min(z(/without g: ([\d.e+-]+);/), z(/with the best other g: ([\d.e+-]+)\)/)),
      tausch: /bodies 1 and 2 exchanged/.test(h.stdout), rMin: z(/closest approach of two bodies: ([\d.e+-]+)/) });
  }
}
const n0 = aus.filter(x => x.code === 0).length, n3 = aus.filter(x => x.code === 3).length, n1 = aus.length - n0 - n3;
writeFileSync(join(HIER, "ergebnisse", "listenfortsetzung-symmetrie.json"), JSON.stringify({ erzeugt: new Date().toISOString(), punkte: aus.length, quadrat: n0, nurSymmetrie: n3, keine: n1, je: aus }, null, 1));
console.log(`${aus.length} Punkte in ${((Date.now() - t0) / 1000).toFixed(0)} s: M = N² bei ${n0}, nur die Symmetrie (M in double zu grob) bei ${n3}, keine Symmetrie bei ${n1}; mit Tausch 1↔2: ${aus.filter(x => x.tausch).length}`);
for (const x of aus.filter(x => x.code === 1)) console.log(`  keine Symmetrie: ${x.familie} m3 ${x.m3} (Abstand ${x.d}, rMin ${x.rMin})`);
