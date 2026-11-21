// dreikoerper/werkzeug/stufe6.mjs — Stufe 6a: die Familien, deren Fortsetzung in Stufe 5 keinen
// Schritt von der Listenmasse wegkam, noch einmal mit kleinen Schritten (11.11.2026, Felix:
// „die 278 nicht untersuchten Familien auf 30 Stellen fortsetzen … mit update im leitstand“).
//
//   node werkzeug/stufe6.mjs [--parallel 3] [--h0 1e-6] [--hmin 1e-8] [--schritteMax 800]
//
// Befund vom 11.11.: bei Begegnung < 1e-4 nimmt Newton (double) nur innerhalb 1e-6 … 1e-7 um die
// Listenmasse an, mit dem alten kleinsten Schritt 1e-4 also nie. Lineare Vorhersage aus zwei
// Punkten macht den Fehler quadratisch klein, der Schritt darf dann wieder wachsen (×1,5).
// Bei anderen Familien (II.C-71@2, II.C-188@0.5) bleibt Newton bei jedem δ stehen: dort taugt die
// Ableitung in double nicht — das kann nur eine Fortsetzung auf 30 Stellen, und die ist hier nicht.
//
// Überschreibt ergebnisse/listenfortsetzung/<datei>.json (der Stand mit 0 Punkten liegt in git,
// Commit 8f8255c). Buch: ergebnisse/stufe6.json, Protokoll ablage/stufe6.log. Fertiges wird
// übersprungen; ablage/STOPP: keine neuen Starts, laufende rechnen zu Ende.

import { spawn } from "node:child_process";
import { readFileSync, writeFileSync, existsSync, appendFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { setPriority, constants } from "node:os";
import { HIER, ladeKatalog } from "../quellen.mjs";
import { schreibeSicher } from "./sicher.mjs";

try { setPriority(constants.priority.PRIORITY_LOW); } catch { /* ohne Recht bleibt es normal */ }
const argv = process.argv.slice(2), arg = (n, v) => (argv.includes(n) ? argv[argv.indexOf(n) + 1] : v);
const PARALLEL = +arg("--parallel", 3), H0 = arg("--h0", "1e-6"), HMIN = arg("--hmin", "1e-8"), SMAX = arg("--schritteMax", "800");
const ORDNER = join(HIER, "ergebnisse", "listenfortsetzung"), STOPP = join(HIER, "ablage", "STOPP");
const LOG = join(HIER, "ablage", "stufe6.log"), BUCH = join(HIER, "ergebnisse", "stufe6.json");
const log = z => { const t = new Date().toLocaleTimeString("de-DE"); appendFileSync(LOG, `${t} ${z}\n`); console.log(`${t} ${z}`); };
const lies = p => { try { return JSON.parse(readFileSync(p, "utf8")); } catch { return null; } };
const datei = b => `${b.name.replace(/[^A-Za-z0-9.-]/g, "")}-${b.m[2]}`;
const punkteVon = R => (R && R.richtungen && R.richtungen.aufwaerts && R.richtungen.aufwaerts.grund !== "läuft")
  ? [...R.richtungen.abwaerts.punkte, ...R.richtungen.aufwaerts.punkte] : null;

const BEG = new Map(lies(join(HIER, "ergebnisse", "liste-begegnungen.json")).bahnen.map(x => [`${x.name}@${x.m3}`, x.rMin]));
const buch = lies(BUCH) || { teil: "6a", parameter: { h0: +H0, hmin: +HMIN, schritteMax: +SMAX }, je: {} };
// Auswahl: jede Familie, die fertig mit 0 Fortsetzungspunkten dasteht — oder schon hier im Buch.
// Bis 12.11.2026, 22 Uhr nur Begegnung < 1e-4 (Stufe 5); die Fehlersuche fand 87 solche Familien
// aus Stufe 1–4 (Begegnung ≥ 1e-4), die nie untersucht wurden: ihre einzige Probe stürzte ab.
const liste = ladeKatalog().bahnen.filter(b => b.satz === "ungleich").filter(b => {
  if (buch.je[datei(b)]) return true;
  const P = punkteVon(lies(join(ORDNER, datei(b) + ".json")));
  return P !== null && P.length === 0;
}).sort((x, y) => x.T - y.T);
const offen = liste.filter(b => !buch.je[datei(b)] || buch.je[datei(b)].status === "läuft");
buch.soll = liste.length;
const sichere = () => { buch.erzeugt = new Date().toISOString(); schreibeSicher(BUCH, JSON.stringify(buch, null, 1)); };
sichere();
log(`Start 6a: ${liste.length} Familien, ${offen.length} offen, ${PARALLEL} parallel, h0 ${H0}, hmin ${HMIN}, höchstens ${SMAX} Schritte je Richtung`);

let i = 0, laufend = 0, n = 0;
await new Promise(alles => {
  const weiter = () => {
    while (laufend < PARALLEL && i < offen.length) {
      if (existsSync(STOPP)) { log("STOPP gefunden: keine neuen Starts"); i = offen.length; break; }
      const b = offen[i++], d = datei(b), t0 = Date.now(); laufend++;
      buch.je[d] = { status: "läuft", rMin: BEG.get(`${b.name}@${b.m[2]}`), beginn: new Date().toISOString() }; sichere();
      const c = spawn(process.execPath, [join(HIER, "werkzeug", "massen-fortsetzung.mjs"), "--start", [b.m[2], b.a, b.b, b.T].join(","),
        "--name", "listenfortsetzung/" + d, "--h0", H0, "--hmin", HMIN, "--schritteMax", SMAX], { stdio: "ignore" });
      c.on("exit", code => {
        laufend--; n++;
        const R = lies(join(ORDNER, d + ".json")), P = punkteVon(R), sek = Math.round((Date.now() - t0) / 1000);
        const stabil = P ? P.filter(q => q.stabil === true).length : 0;
        buch.je[d] = { status: code !== 0 ? `ohne Ergebnis (Exit ${code})` : P && P.length ? "fortgesetzt" : "wieder 0 Punkte", sekunden: sek,
          rMin: BEG.get(`${b.name}@${b.m[2]}`), punkte: P ? P.length : 0, stabilDouble: stabil,
          von: R && R.richtungen && R.richtungen.abwaerts.bis, bis: R && R.richtungen && R.richtungen.aufwaerts && R.richtungen.aufwaerts.bis,
          gruende: R && R.richtungen ? [R.richtungen.abwaerts.grund, R.richtungen.aufwaerts && R.richtungen.aufwaerts.grund] : null };
        sichere();
        const e = buch.je[d];
        log(`${b.name}@${b.m[2]}: ${sek} s, ${e.status}${P && P.length ? `, m3 ${(+e.von).toFixed(4)} … ${(+e.bis).toFixed(4)}, ${P.length} Punkte, ${stabil} stabil (double)` : ""} (${n}/${offen.length})`);
        if (laufend === 0 && i >= offen.length) alles(); else weiter();
      });
    }
    if (laufend === 0) alles();
  };
  weiter();
});
const W = Object.values(buch.je); sichere();
log(`Ende 6a: fortgesetzt ${W.filter(x => x.status === "fortgesetzt").length}, wieder 0 Punkte ${W.filter(x => x.status === "wieder 0 Punkte").length}, ohne Ergebnis ${W.filter(x => /ohne/.test(x.status)).length}, offen ${W.filter(x => x.status === "läuft").length}`);
