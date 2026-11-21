// dreikoerper/werkzeug/blinder-fleck.mjs — zieht die Zufallsstichprobe, mit der der blinde Fleck der Karte
// gemessen wird (13.11.2026; ergebnisse/GRENZEN.md, Abschnitt 2). Rechnet nichts selbst.
//
//   node werkzeug/blinder-fleck.mjs [--n 300] [--saat 20261113]
//
// Der blinde Fleck: auf 30 Stellen geprobt wird nur an ausgewählten Massen; ein stabiles Stück, das
// double übersieht und das an keiner dieser Stellen liegt, bleibt unentdeckt (Beispiel I.A-5 bei
// 3,4–3,5). Gemessen wird, welcher Anteil der Länge in m3, auf der double „nicht stabil“ sagt, auf
// 30 Stellen stabil ist — und welcher Teil davon fern jeder stabilen Probe der Karte liegt (Prüfskript).
//
// Über die LÄNGE, nicht über Fortsetzungspunkte: die Fortsetzung wählt ihre Schritte selbst; 43,5 % der
// Punkte liegen dichter als 1e-3 und tragen nur 2,6 % der Länge (gemessen 13.11.2026). Eine Stichprobe
// über Punkte träfe fast nur die schwierigen Stellen. Ein erster Zug über Punkte (mit einem in double
// ungenauen Zufallsgenerator) wurde deshalb verworfen, bevor eine einzige Probe gerechnet war.
//
// Grundgesamtheit: jede Strecke zwischen benachbarten Punkten einer fertigen Fortsetzung (Start
// eingeschlossen; die Datei führt dort keine double-Stabilität), an deren beiden Enden double nicht
// „stabil“ sagt. Gezogen: n Stellen, gleich verteilt über die Gesamtlänge; Zufall aus mulberry32
// (exakte 32-Bit-Ganzzahlrechnung), feste Saat. fortsetzung-genau --punkt startet an jeder Stelle linear
// zwischen den beiden Enden der Strecke. Gezogen wird im Nachlauf (stufe6-nach.mjs), wenn alle
// Fortsetzungen fertig sind, und nie ein zweites Mal: liegt die Datei vor, endet das Skript ohne
// Änderung. Gerechnet mit liste-genau.mjs --auftragsDatei, ausgewertet im Prüfskript (zahlen.blinderFleck).

import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join } from "node:path";
import { HIER } from "../quellen.mjs";
import { schreibeSicher } from "./sicher.mjs";

const argv = process.argv.slice(2), arg = (n, v) => (argv.includes(n) ? argv[argv.indexOf(n) + 1] : v);
const N = +arg("--n", 300), SAAT = +arg("--saat", 20261113);
const O = join(HIER, "ergebnisse", "listenfortsetzung"), AUS = join(HIER, "ergebnisse", "blinder-fleck-stichprobe.json");
if (existsSync(AUS)) { console.log(`Stichprobe liegt schon vor (${AUS}) — nicht neu gezogen`); process.exit(0); }

// mulberry32 (Tommy Ettinger / bryc): Zustand und Rechnung in 32-Bit-Ganzzahlen, Werte in [0, 1)
const mulberry32 = saat => { let a = saat | 0; return () => { a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; };

const strecken = [], kum = []; let L = 0, verletzt = 0, familien = 0;
for (const n of readdirSync(O).filter(n => n.endsWith(".json") && !n.endsWith("-genau.json")).sort()) {
  const R = JSON.parse(readFileSync(join(O, n), "utf8"));   // eine kaputte Datei soll hier laut scheitern
  if (!R.richtungen || !R.richtungen.aufwaerts || R.richtungen.aufwaerts.grund === "läuft") continue;
  familien++;
  const d = n.slice(0, -5);
  for (const [r, vz] of [[R.richtungen.abwaerts, -1], [R.richtungen.aufwaerts, 1]]) {
    let v = { m3: R.start.m3, stabil: undefined };
    for (const q of r.punkte) {
      if ((q.m3 - v.m3) * vz <= 0) verletzt++;
      const l = Math.abs(q.m3 - v.m3);
      if (q.stabil !== true && v.stabil !== true && l > 0) { strecken.push({ datei: d, von: v.m3, bis: q.m3 }); L += l; kum.push(L); }
      v = q;
    }
  }
}
if (verletzt) { console.error(`${verletzt} Fortsetzungspunkte laufen nicht vom Start weg — die Strecken wären falsch; nichts gezogen`); process.exit(1); }
if (!strecken.length) { console.error("keine Strecken — nichts gezogen"); process.exit(1); }

const zufall = mulberry32(SAAT), punkte = [];
for (let k = 0; k < N; k++) {
  const u = zufall() * L;
  let lo = 0, hi = kum.length - 1;
  while (lo < hi) { const mitte = (lo + hi) >> 1; if (kum[mitte] > u) hi = mitte; else lo = mitte + 1; }
  const s = strecken[lo], vorher = lo ? kum[lo - 1] : 0, t = (u - vorher) / (kum[lo] - vorher);
  punkte.push({ datei: s.datei, m3: s.von + t * (s.bis - s.von), strecke: [s.von, s.bis] });
}
// Nachbarn auf der Karte, beim Ziehen festgehalten (13.11.2026): die nächste angenommene 30-Stellen-
// Probe links und rechts in derselben Familie. Jetzt ist die Karte endgültig; danach legt der Nachlauf
// um stabile Treffer der Stichprobe Fensterränder (fenster-genau), also stabile Proben direkt daneben —
// aus der lebenden Datei bestimmt, wäre „fern jeder stabilen Probe“ dann von selbst fast nie erfüllt.
const proben = new Map();
const probenVon = d => {
  if (!proben.has(d)) { const p = join(O, d + "-genau.json"); proben.set(d, existsSync(p) ? JSON.parse(readFileSync(p, "utf8")).punkte.filter(g => g.ok) : []); }
  return proben.get(d);
};
for (const p of punkte) {
  const G = probenVon(p.datei);
  const l = G.filter(g => g.m3 < p.m3).sort((x, y) => y.m3 - x.m3)[0], r = G.filter(g => g.m3 > p.m3).sort((x, y) => x.m3 - y.m3)[0];
  p.nachbarn = { links: l ? { m3: l.m3, urteil: l.urteil } : null, rechts: r ? { m3: r.m3, urteil: r.urteil } : null };
}
schreibeSicher(AUS, JSON.stringify({
  zweck: "Messung des blinden Flecks: Stellen, gleich verteilt über die Länge in m3 der Fortsetzungsstrecken, an denen double nicht stabil sagt, auf 30 Stellen geprobt",
  verfahren: "werkzeug/blinder-fleck.mjs; Zufall mulberry32", saat: SAAT, n: punkte.length, familien, strecken: strecken.length, laenge: L,
  gezogen: new Date().toISOString(), punkte }, null, 1));
console.log(`Stichprobe: ${punkte.length} Stellen auf ${strecken.length} Strecken (Länge ${L.toFixed(2)} in m3, ${familien} Familien), Saat ${SAAT} → ${AUS}`);
