// dreikoerper/werkzeug/liste-fortsetzen.mjs — alle Familien von Li, Jing & Liao (2018) in m3
// fortsetzen: die Stabilitätskarte der Liste über die Masse (06.11.2026, Felix: „zustimmung“).
//
//   node werkzeug/liste-fortsetzen.mjs [--parallel 9] [--bis 07:30] [--nur 20]
//
// Je Listenbahn ein Prozess massen-fortsetzung.mjs (Fortsetzung in beide Richtungen,
// 0,5 ≤ m3 ≤ 10, Abgleich an jeder Listenmasse), niedrigste Priorität. Ausgabe je Familie
// nach ergebnisse/listenfortsetzung/<name>.json, Übersicht nach ergebnisse/listenfortsetzung.json.
//
// Sparen: trifft eine Fortsetzung an einer anderen Listenmasse eine Listenbahn auf den Ort
// (Stufe „ort“), ist das dieselbe Familie — die wird nicht noch einmal gestartet.
// Wiederaufnahme: was schon eine fertige Ausgabe hat, wird nicht neu gerechnet.
// Anhalten: ablage/STOPP anlegen — laufende Familien rechnen zu Ende, neue starten nicht.
// --bis HH:MM: nach dieser Uhrzeit keine neuen Starts (Felix braucht den Rechner wieder).
// Reihenfolge: zuerst die kurzen Perioden (billig, und sie decken am meisten ab).

import { readFileSync, writeFileSync, existsSync, mkdirSync, appendFileSync } from "node:fs";
import { join } from "node:path";
import { spawn } from "node:child_process";
import { setPriority, constants } from "node:os";
import { HIER, ladeKatalog } from "../quellen.mjs";
import { schreibeSicher } from "./sicher.mjs";

try { setPriority(constants.priority.PRIORITY_LOW); } catch { /* ohne Recht bleibt es normal */ }
const argv = process.argv.slice(2), arg = n => (argv.includes(n) ? argv[argv.indexOf(n) + 1] : null);
const PARALLEL = +(arg("--parallel") || 9), BIS = arg("--bis"), NUR = arg("--nur") ? +arg("--nur") : Infinity;
const ORDNER = join(HIER, "ergebnisse", "listenfortsetzung"), STOPP = join(HIER, "ablage", "STOPP"), LOG = join(HIER, "ablage", "liste-fortsetzen.log");
mkdirSync(ORDNER, { recursive: true }); mkdirSync(join(HIER, "ablage"), { recursive: true });
const log = z => { const t = new Date().toLocaleTimeString("de-DE"); appendFileSync(LOG, `${t} ${z}\n`); console.log(`${t} ${z}`); };

// --rmin r: nur Listenbahnen, deren engste Begegnung ≥ r ist (aus ergebnisse/liste-begegnungen.json).
// Stichprobe 06.11.2026: unter 1e-4 bricht die Fortsetzung in double fast sofort ab; ab 1e-3
// liefen zwei von vier bis m3 = 10.
const RMIN = arg("--rmin") ? +arg("--rmin") : 0;
const BEG = RMIN > 0 ? new Map(JSON.parse(readFileSync(join(HIER, "ergebnisse", "liste-begegnungen.json"), "utf8")).bahnen.map(x => [`${x.name}@${x.m3}`, x.rMin])) : null;
const liste = ladeKatalog().bahnen.filter(b => b.satz === "ungleich" && (!BEG || BEG.get(`${b.name}@${b.m[2]}`) >= RMIN)).sort((x, y) => x.T - y.T);
const datei = b => `${b.name.replace(/[^A-Za-z0-9.-]/g, "")}-${b.m[2]}`;
const schluessel = b => `${b.name}@${b.m[2]}`;
const fertig = p => { try { const R = JSON.parse(readFileSync(p, "utf8")); return R.richtungen && R.richtungen.aufwaerts && R.richtungen.aufwaerts.grund !== "läuft" ? R : null; } catch { return null; } };
// welche Listenbahnen eine Fortsetzung auf den Ort getroffen hat
const getroffen = new Map();   // schluessel → von welcher Familie
function merkeTreffer(R, von) {
  for (const l of R.listen || []) if (l.liliao && l.liliao.stufe === "ort" && l.liliao.naechster) {
    const k = `${l.liliao.naechster}@${l.m3}`; if (!getroffen.has(k)) getroffen.set(k, von);
  }
}
const uebersicht = { erzeugt: null, gestartet: 0, fertig: 0, uebersprungen: 0, je: {} };
for (const b of liste) { const R = fertig(join(ORDNER, datei(b) + ".json")); if (R) { merkeTreffer(R, schluessel(b)); uebersicht.je[schluessel(b)] = { status: "fertig (frühere Sitzung)" }; } }
const schreibeUebersicht = () => { uebersicht.erzeugt = new Date().toISOString(); uebersicht.getroffen = Object.fromEntries(getroffen); schreibeSicher(join(HIER, "ergebnisse", "listenfortsetzung.json"), JSON.stringify(uebersicht, null, 1)); };
const zuSpaet = () => { if (!BIS) return false; const [h, m] = BIS.split(":").map(Number), j = new Date(); return j.getHours() * 60 + j.getMinutes() >= h * 60 + m && j.getHours() < 18; };

log(`Start: ${liste.length} Listenbahnen, ${Object.keys(uebersicht.je).length} schon fertig, ${PARALLEL} parallel${BIS ? ", keine neuen Starts nach " + BIS : ""}`);
let i = 0, laufend = 0, gestartetJetzt = 0;
await new Promise(alles => {
  const weiter = () => {
    while (laufend < PARALLEL && i < liste.length && gestartetJetzt < NUR) {
      if (existsSync(STOPP)) { log("STOPP gefunden: keine neuen Starts"); i = liste.length; break; }
      if (zuSpaet()) { log(`nach ${BIS}: keine neuen Starts`); i = liste.length; break; }
      const b = liste[i++], k = schluessel(b);
      if (uebersicht.je[k]) continue;
      if (getroffen.has(k)) { uebersicht.je[k] = { status: "dieselbe Familie wie " + getroffen.get(k) }; uebersicht.uebersprungen++; continue; }
      const t0 = Date.now(); laufend++; gestartetJetzt++; uebersicht.gestartet++;
      const p = spawn(process.execPath, [join(HIER, "werkzeug", "massen-fortsetzung.mjs"), "--start", [b.m[2], b.a, b.b, b.T].join(","), "--name", "listenfortsetzung/" + datei(b)], { stdio: "ignore" });
      p.on("exit", code => {
        laufend--; uebersicht.fertig++;
        const R = fertig(join(ORDNER, datei(b) + ".json")), sek = (Date.now() - t0) / 1000;
        if (R) merkeTreffer(R, k);
        const pk = R ? [...R.richtungen.abwaerts.punkte, ...R.richtungen.aufwaerts.punkte] : [];
        uebersicht.je[k] = { status: R ? "fertig" : "ohne Ergebnis (Exit " + code + ")", sekunden: Math.round(sek), von: R && R.richtungen.abwaerts.bis, bis: R && R.richtungen.aufwaerts.bis, punkte: pk.length,
          stabilDouble: pk.filter(q => q.stabil === true || q.stabil === "stabil").length };
        log(`${k}: ${sek.toFixed(0)} s, m3 ${R ? R.richtungen.abwaerts.bis.toFixed(3) + " … " + R.richtungen.aufwaerts.bis.toFixed(3) : "-"}, ${pk.length} Punkte (${uebersicht.fertig} fertig, ${uebersicht.uebersprungen} übersprungen, ${i}/${liste.length} gesichtet)`);
        schreibeUebersicht();
        if (laufend === 0 && (i >= liste.length || gestartetJetzt >= NUR)) alles(); else weiter();
      });
    }
    if (laufend === 0) alles();
  };
  weiter();
});
schreibeUebersicht();
log(`Ende: ${uebersicht.fertig} gerechnet, ${uebersicht.uebersprungen} übersprungen`);
