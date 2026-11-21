// dreikoerper/werkzeug/nacht-listenfortsetzung.mjs — die Stufen der Listenfortsetzung
// nacheinander, ohne dass jemand zusieht (06.11.2026, Start 22 Uhr, Felix aus dem Haus).
//
//   node werkzeug/nacht-listenfortsetzung.mjs [--parallel 9] [--bis 09:00]
//
//   1. Fortsetzung der gut gestellten Familien (engste Begegnung ≥ 1e-3, 238 Stück)
//   2. deren stabile Abschnitte auf 30 Stellen
//   3. Fortsetzung der Familien mit Begegnung ≥ 1e-4 (die schon gerechneten werden übersprungen)
//   4. auch deren stabile Abschnitte auf 30 Stellen
// Jede Stufe hält ablage/STOPP und --bis ein; keine Stufe startet nach --bis.
// 9 Prozesse auf 12 logischen Kernen = 75 % (Felix' Grenze: 80 %), niedrigste Priorität.

import { spawnSync } from "node:child_process";
import { existsSync, appendFileSync } from "node:fs";
import { join } from "node:path";
import { setPriority, constants } from "node:os";
import { HIER } from "../quellen.mjs";

try { setPriority(constants.priority.PRIORITY_LOW); } catch { /* ohne Recht bleibt es normal */ }
const argv = process.argv.slice(2), arg = (n, v) => (argv.includes(n) ? argv[argv.indexOf(n) + 1] : v);
// Ohne Endzeit, solange --bis fehlt (Felix, 06.11.2026: „richte bitte kein endpunkt ein …
// entweder du bist fertig oder ich unterbreche dich“). Unterbrechen: ablage/STOPP.
const P = arg("--parallel", "9"), BIS = arg("--bis", null), LOG = join(HIER, "ablage", "nacht.log");
const log = z => { const t = new Date().toLocaleString("de-DE"); appendFileSync(LOG, `${t} ${z}\n`); console.log(`${t} ${z}`); };
const zuSpaet = () => { if (!BIS) return false; const [h, m] = BIS.split(":").map(Number), j = new Date(); return j.getHours() * 60 + j.getMinutes() >= h * 60 + m && j.getHours() < 18; };
const stufen = [
  ["1 Fortsetzung, Begegnung ≥ 1e-3", "liste-fortsetzen.mjs", ["--rmin", "1e-3"]],
  ["2 30 Stellen (Stufe 1)", "liste-genau.mjs", []],
  ["3 Fortsetzung, Begegnung ≥ 1e-4", "liste-fortsetzen.mjs", ["--rmin", "1e-4"]],
  ["4 30 Stellen (Stufe 3)", "liste-genau.mjs", []],
];
for (const [name, skript, extra] of stufen) {
  if (existsSync(join(HIER, "ablage", "STOPP"))) { log("STOPP: Nacht beendet vor Stufe " + name); break; }
  if (zuSpaet()) { log(`nach ${BIS}: Nacht beendet vor Stufe ${name}`); break; }
  const t0 = Date.now(); log("Stufe " + name + " beginnt");
  const r = spawnSync(process.execPath, [join(HIER, "werkzeug", skript), "--parallel", P, ...(BIS ? ["--bis", BIS] : []), ...extra], { stdio: "inherit" });
  log(`Stufe ${name} Ende, Exit ${r.status}, ${((Date.now() - t0) / 60000).toFixed(0)} min`);
}
log("Nacht fertig");
