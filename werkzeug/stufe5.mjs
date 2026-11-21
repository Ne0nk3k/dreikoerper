// dreikoerper/werkzeug/stufe5.mjs — Stufe 5 der Listenfortsetzung (11.11.2026, Felix:
// „starte stufe 5 mit der zweiten variante“):
//   a) die 579 Familien mit engster Begegnung < 1e-4 in m3 fortsetzen (liste-fortsetzen.mjs ohne
//      --rmin; alles schon Gerechnete wird übersprungen),
//   b) auf 30 Stellen nur die stabilen Abschnitte (liste-genau.mjs --nurAbschnitte), ohne die
//      Pflichtprobe an der Listenmasse.
//
//   node werkzeug/stufe5.mjs [--parallel 7]
//
// Anhalten wie immer mit ablage/STOPP: laufende Familien und Punkte rechnen zu Ende, b startet nicht.

import { spawnSync } from "node:child_process";
import { existsSync, appendFileSync } from "node:fs";
import { join } from "node:path";
import { setPriority, constants } from "node:os";
import { HIER } from "../quellen.mjs";

try { setPriority(constants.priority.PRIORITY_LOW); } catch { /* ohne Recht bleibt es normal */ }
const argv = process.argv.slice(2), P = argv.includes("--parallel") ? argv[argv.indexOf("--parallel") + 1] : "7";
const LOG = join(HIER, "ablage", "nacht.log");
const log = z => { const t = new Date().toLocaleString("de-DE"); appendFileSync(LOG, `${t} ${z}\n`); console.log(`${t} ${z}`); };
for (const [name, skript, extra] of [["5a Fortsetzung, Begegnung < 1e-4", "liste-fortsetzen.mjs", []], ["5b 30 Stellen, nur stabile Abschnitte", "liste-genau.mjs", ["--nurAbschnitte"]]]) {
  if (existsSync(join(HIER, "ablage", "STOPP"))) { log("STOPP: Stufe 5 beendet vor " + name); break; }
  const t0 = Date.now(); log("Stufe " + name + " beginnt");
  const r = spawnSync(process.execPath, [join(HIER, "werkzeug", skript), "--parallel", P, ...extra], { stdio: "inherit" });
  log(`Stufe ${name} Ende, Exit ${r.status}, ${((Date.now() - t0) / 60000).toFixed(0)} min`);
  // Am 11.11.2026 um 09:27 riss ein Windows-Update-Neustart 5a ab; das Skript startete trotzdem 5b
  // und schrieb „Stufe 5 fertig“. Deshalb: nur weiter, wenn der Teil sauber zu Ende kam.
  if (r.status !== 0) { log(`Stufe 5 abgebrochen in ${name} (Exit ${r.status}); Neustart nimmt Fertiges nicht noch einmal`); process.exit(1); }
}
log("Stufe 5 fertig");
