// dreikoerper/nachbereiten.mjs — einen Laufbericht mit dem heutigen Kern und
// den heutigen Katalogen neu auswerten, ohne die Karte neu zu rechnen.
//
//   node nachbereiten.mjs <lauf>
//
// Jede Bahn des Berichts läuft noch einmal durch die Beschreibung der
// Prüfkette (Grundperiode, Stabilität, Topologie, Gegenprobe) — ihr Ort wird
// nicht mehr verändert. Danach derselbe Abschluss wie in suche.mjs:
// zusammenlegen, abgleichen, berichten. Die Karte (.png) bleibt die alte.
//
// Wozu: am 01.10.2026 stand die Acht mit 13-, 17-, 19- und 23-facher Periode
// fünfmal als eigene Bahn im Bericht. Der Kern bestimmt die Grundperiode
// seither über die erste Wiederkehr; Läufe von davor lassen sich so
// berichtigen, statt sie eine Stunde lang neu zu fahren.

import { readFileSync } from "node:fs";
import { join } from "node:path";
import { HIER } from "./quellen.mjs";
import { macheSchwarm } from "./schwarm.mjs";
import { abschliessen } from "./abschluss.mjs";

const lauf = process.argv[2];
if (!lauf) { console.error("Aufruf: node nachbereiten.mjs <lauf>"); process.exit(2); }
const alt = JSON.parse(readFileSync(join(HIER, "ergebnisse", lauf + ".json"), "utf8"));
const P = alt.parameter;
const schwarm = macheSchwarm();
process.stderr.write(`${lauf}: ${alt.funde.length} Bahnen neu beschreiben, ${schwarm.faeden} Fäden\n`);
const t0 = Date.now(); let letzte = 0;
const erg = await schwarm.alle(alt.funde.map(f => ({ art: "pruefe", ebene: P.ebene, m: P.m, a: f.a, b: f.b, T: f.T, opt: { maxIter: 0, annahme: 1e-4 } })),
  (_, __, n) => { if (Date.now() - letzte > 15000) { letzte = Date.now(); process.stderr.write(`  ${n}/${alt.funde.length}\n`); } });
await schwarm.ende();
const ausnahmen = erg.filter(r => r.fehler), konv = [];
let verloren = 0;
erg.forEach((r, i) => {
  if (r.fehler) return;
  if (!r.ok) { verloren++; return; }
  const f = alt.funde[i];
  if (f.halb) { r.halb = { ...f.halb }; r.halb.vielfaches = Math.round(r.T / (2 * f.halb.tau)); }
  konv.push(r);
});
const arten = [alt.karte.durchgelaufen, alt.karte.zerfall, alt.karte.abgebrochen, 0, alt.karte.ungebunden];
const kandidaten = { ...alt.kandidaten, ziele: alt.kandidaten.ziele || (P.art === "halb" ? Object.keys(alt.kandidaten.proZiel || {}).length : 0),
                     nachbereitet: { datum: new Date().toISOString(), sekunden: (Date.now() - t0) / 1000, vorher: alt.funde.length, nichtMehrGeschlossen: verloren } };
const s = abschliessen({ P, zeiten: alt.zeiten, faeden: alt.faeden, karte: { arten, d: null, N: P.raster }, kandidaten, konv, ausnahmen });
console.log(`  nachbereitet: aus ${alt.funde.length} Einträgen wurden ${s.funde} Bahnen` + (verloren ? `; ${verloren} schließen sich mit dem heutigen Kern nicht mehr unter 1e-4` : ""));
process.exit(ausnahmen.length ? 1 : 0);
