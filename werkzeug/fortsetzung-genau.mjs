// dreikoerper/werkzeug/fortsetzung-genau.mjs — Stabilität entlang der
// Massen-Fortsetzung auf 30 Stellen (21.10.2026).
//
//   node werkzeug/fortsetzung-genau.mjs 3.0 3.4 3.6 …     die genannten m₃
//   node werkzeug/fortsetzung-genau.mjs --punkt 3.6       ein Punkt (intern)
//
// In double ist die Stabilität auf diesem Zweig nicht zu gebrauchen: bei
// m₃ = 4,0025 meldete sie einen Index 2,06, bei 4,005 wieder 0,06 — die engen
// Begegnungen (rMin um 1e-3) verderben die Monodromie. Hier je m₃: Startwert
// aus ergebnisse/fortsetzung-1-1-4.json (nächster Punkt, linear zwischen den
// Nachbarn), Newton im Kern bei genau diesem m₃, dann verfeinereGenau auf 30
// Stellen und stabilitaetGenau mit Gegenprobe (128 Bit mehr). Bis zu sechs
// Punkte gleichzeitig, jeder in eigenem Prozess mit einem Faden.
// Ergebnis: ergebnisse/fortsetzung-1-1-4-genau.json (wird ergänzt, nicht ersetzt).

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import { setPriority, constants } from "node:os";
import { HIER, ladeKern } from "../quellen.mjs";
import { verfeinereGenau, stabilitaetGenau } from "../genau.mjs";

// Niedrigste Priorität wie im Schwarm — die erste Fassung vergaß das, ihre
// sechs Rechenprozesse liefen am 21.10.2026 in normaler Priorität.
try { setPriority(constants.priority.PRIORITY_LOW); } catch { /* ohne Recht bleibt es bei sechs Prozessen */ }
const AUS = join(HIER, "ergebnisse", "fortsetzung-1-1-4-genau.json");
const argv = process.argv.slice(2);

if (argv[0] === "--punkt") {
  const m3 = +argv[1], K = ladeKern(), pruefe = K.macheFundpruefer();
  const R = JSON.parse(readFileSync(join(HIER, "ergebnisse", "fortsetzung-1-1-4.json"), "utf8"));
  const pts = [...R.richtungen.abwaerts.punkte, { m3: 4, a: R.start.a, b: R.start.b, T: R.start.T }, ...R.richtungen.aufwaerts.punkte].sort((x, y) => x.m3 - y.m3);
  let i = pts.findIndex(p => p.m3 >= m3); if (i <= 0) i = 1; if (i < 0) i = pts.length - 1;
  const p = pts[i - 1], q = pts[i], f = (m3 - p.m3) / (q.m3 - p.m3 || 1);
  const t0 = Date.now(), d = pruefe("euler", [1, 1, m3], p.a + f * (q.a - p.a), p.b + f * (q.b - p.b), p.T + f * (q.T - p.T), { ohneStabil: true });
  const aus = { m3, ok: false };
  if (d.ok) {
    const mT = ["1", "1", String(m3)];
    const v = verfeinereGenau("euler", mT, d.a, d.b, d.T, { stellen: 30 });
    aus.kennung = d.kennung; aus.rMin = d.rMin; aus.Ts = d.Ts;
    if (v.ok) {
      const s = stabilitaetGenau("euler", mT, v.a, v.b, v.T, { gegenprobe: true });
      Object.assign(aus, { ok: true, a: v.a, b: v.b, T: v.T, rest: v.rest, restAndereGenauigkeit: v.restAndereGenauigkeit,
        urteil: s.urteil, s1: s.s1, s2: s.s2, komplex: s.komplex, sIm: s.sIm, rand: s.rand, unterschied: s.unterschied, unsicher: s.unsicher });
    } else aus.grund = "verfeinereGenau: " + (v.grund || "nicht angenommen");
  } else aus.grund = "Newton (double) nimmt nicht an";
  aus.sekunden = (Date.now() - t0) / 1000;
  process.stdout.write(JSON.stringify(aus) + "\n");
  process.exit(0);
}

const liste = argv.map(Number).filter(Number.isFinite);
const fertig = existsSync(AUS) ? JSON.parse(readFileSync(AUS, "utf8")) : { punkte: [] };
const offen = liste.filter(m => !fertig.punkte.some(p => p.ok && Math.abs(p.m3 - m) < 1e-12));
const GLEICHZEITIG = Math.min(6, offen.length);
console.log(`${offen.length} Punkte auf 30 Stellen, ${GLEICHZEITIG} gleichzeitig`);
const selbst = fileURLToPath(import.meta.url);
let naechster = 0;
function starte() {
  if (naechster >= offen.length) return Promise.resolve();
  const m3 = offen[naechster++];
  return new Promise(fertigP => {
    const c = spawn(process.execPath, [selbst, "--punkt", String(m3)], { stdio: ["ignore", "pipe", "inherit"] });
    let s = ""; c.stdout.on("data", d => (s += d));
    c.on("close", () => {
      let e; try { e = JSON.parse(s.trim().split("\n").pop()); } catch { e = { m3, ok: false, grund: "keine Ausgabe" }; }
      fertig.punkte = fertig.punkte.filter(p => Math.abs(p.m3 - m3) > 1e-12).concat([e]).sort((x, y) => x.m3 - y.m3);
      writeFileSync(AUS, JSON.stringify(fertig, null, 1));
      console.log(`  m3 ${m3}: ${e.ok ? `${e.urteil}, s ${e.komplex ? e.s1.toFixed(6) + " ± " + e.sIm.toExponential(2) + "i" : e.s1.toFixed(6) + " / " + e.s2.toFixed(6)}, Rand ${e.rand.toExponential(2)}, Rest ${e.rest.toExponential(1)}` : "FEHL " + e.grund} (${e.sekunden?.toFixed(0)} s)`);
      fertigP(starte());
    });
  });
}
await Promise.all(Array.from({ length: GLEICHZEITIG }, starte));
console.log("fertig →", AUS);
