// dreikoerper/werkzeug/sicher.mjs — Ergebnisdateien sicher schreiben (12.11.2026, Fehlersuche vor der
// Veröffentlichung). Erst in eine Nebendatei, dann in einem Schritt umbenennen: ein Neustart mitten im
// Schreiben (am 11.11. riss ein Windows-Update alles ab) hinterlässt so die alte oder die neue Datei,
// nie eine halbe. Auf Windows kann das Umbenennen kurz scheitern, wenn gerade ein Leser die Datei
// offen hat (der Leitstand liest alle 30 s) — dann bis zu 20-mal nach 50 ms erneut, zuletzt direkt.
//
//   import { schreibeSicher } from "./sicher.mjs";   schreibeSicher(pfad, text)

import { writeFileSync, renameSync, unlinkSync, existsSync } from "node:fs";

const warte = ms => Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);

export function schreibeSicher(pfad, text) {
  const tmp = `${pfad}.${process.pid}.tmp`;
  writeFileSync(tmp, text);
  for (let k = 0; k < 20; k++) {
    try { renameSync(tmp, pfad); return; }
    catch (e) { if (!["EPERM", "EACCES", "EBUSY"].includes(e.code)) throw e; warte(50); }
  }
  // letzter Ausweg: direkt schreiben, die Nebendatei entfernen
  writeFileSync(pfad, text);
  try { if (existsSync(tmp)) unlinkSync(tmp); } catch { /* bleibt liegen, wird von den Lesern übergangen */ }
}
