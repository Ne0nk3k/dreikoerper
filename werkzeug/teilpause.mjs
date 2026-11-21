// dreikoerper/werkzeug/teilpause.mjs — Teilpause statt Pause (Felix, 15.11.2026: „sobald ich pause sag
// gehst du runter auf 2 prozessen“). Liegt ablage/TEILPAUSE mit einer Zahl N (1 bis 64), starten
// liste-genau und fenster-genau nur dann einen neuen Rechenpunkt, wenn alle zusammen weniger als N
// laufen; Laufendes rechnet zu Ende, nichts geht verloren. Ohne die Datei ändert sich nichts.
// Dauerhafter gemeinsamer Deckel (15.11.2026, Felix: „behebe den engpass“): ablage/DECKEL, z. B. 7 —
// Werkzeuge, die gleichzeitig laufen (Fensterränder und 6d im Nachlauf), teilen sich die Plätze, statt
// feste Anteile zu haben. Liegen DECKEL und TEILPAUSE, gilt der kleinere.
// Jedes Werkzeug meldet seine laufenden Punkte in ablage/laufend/<pid>.txt und erneuert die Datei alle
// 30 s (Lebenszeichen). Gezählt wird eine Meldung nur, wenn ihr Prozess lebt UND sie jünger als 3 min ist
// — sonst zählte nach einem Absturz eine liegengebliebene Meldung weiter, sobald Windows die Prozessnummer
// neu vergibt (Code-Prüfung 15.11.2026, Befund 3: erste Wiederholung nach 163 Starts).

import { readFileSync, writeFileSync, readdirSync, mkdirSync, unlinkSync, existsSync, statSync } from "node:fs";
import { join } from "node:path";
import { HIER } from "../quellen.mjs";

const A = join(HIER, "ablage"), TEIL = join(A, "TEILPAUSE"), DECKEL = join(A, "DECKEL"), L = join(A, "laufend");
const ALT_MS = 180000;

// Zahl aus einer Steuerdatei: fehlt sie, null. TEILPAUSE, die liegt, aber keine Zahl 1 … 64 enthält (leer,
// „0“, UTF-16), gilt als 1 — lieber zu wenig als unbemerkt gar kein Deckel (Befund 5). DECKEL ebenso
// unlesbar: ignoriert (der Nachlauf schreibt ihn selbst, als „7“).
const zahl = (p, sonst) => {
  if (!existsSync(p)) return null;
  try { const n = +readFileSync(p, "utf8").trim(); return n >= 1 && n <= 64 ? n : sonst; } catch { return sonst; }
};
export function deckel() { const d = zahl(DECKEL, null), t = zahl(TEIL, 1); return d == null ? t : t == null ? d : Math.min(d, t); }
const lebt = pid => { try { process.kill(pid, 0); return true; } catch (e) { return e.code === "EPERM"; } };
export function meldeLaufend(n) {
  try {
    mkdirSync(L, { recursive: true });
    const p = join(L, process.pid + ".txt");
    if (n > 0) writeFileSync(p, String(n)); else if (existsSync(p)) unlinkSync(p);
  } catch { /* Meldung ist Hilfsmittel, nie Grund zum Abbruch */ }
}
export function laufendGesamt() {
  let s = 0, namen = [];
  try { namen = readdirSync(L); } catch { return 0; }   // noch kein Ordner: nichts läuft
  const jetzt = Date.now();
  for (const f of namen) {
    const p = join(L, f), pid = +f.replace(/\.txt$/, "");
    try {   // je Datei: verschwindet eine während des Zählens, fehlen nicht alle übrigen (Befund 4)
      const alt = jetzt - statSync(p).mtimeMs > ALT_MS;
      if (!pid || alt || !lebt(pid)) { try { unlinkSync(p); } catch { } continue; }
      s += +readFileSync(p, "utf8") || 0;
    } catch (e) { if (e.code !== "ENOENT") s += 1; }   // unlesbar, aber da: vorsichtig als belegt zählen
  }
  return s;
}
// ablage/HALT (19.11.2026, Felix: „wenn … die fensterränder im zweiten durchgang und 6d fertig sind, bitte
// pause einrichten so das erstmal nix mehr läuft“): solange die Datei liegt, startet kein Werkzeug, das dieses
// Modul NEU lädt, einen Rechenpunkt — es wartet (wie unter einem Deckel von 0), nichts endet vorzeitig. Laufende
// Werkzeuge haben das Modul schon im Speicher und rechnen unberührt weiter. So hält der Nachlauf vor Schritt 3
// an, ohne F2 und 6d zu kürzen. Danach STOPP (beendet die Wartenden sauber) oder HALT löschen (geht weiter).
const HALT = join(A, "HALT");
// ohne Deckel sofort ja (kein Dateizugriff auf ablage/laufend); mit Deckel nur darunter
export const darfStarten = () => { if (existsSync(HALT)) return false; const n = deckel(); return n == null || laufendGesamt() < n; };
