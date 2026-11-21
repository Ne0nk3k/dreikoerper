// dreikoerper/werkzeug/fenster-genau.mjs — die Ränder eines stabilen Fensters auf 30 Stellen
// eingrenzen (07.11.2026), für die besten Kandidaten der Listenfortsetzung.
//
//   node werkzeug/fenster-genau.mjs <datei> [--genauigkeit 0.005] [--parallel 2]
//
// <datei>: Name in ergebnisse/listenfortsetzung/ ohne .json (z. B. I.A-2-4). Aus den
// 30-Stellen-Proben (<datei>-genau.json) die stabilen Abschnitte; je Rand das Paar
// (letzte stabile, erste nicht stabile Probe) und Halbierung mit fortsetzung-genau.mjs --punkt,
// bis das Paar enger als --genauigkeit ist. Ränder ohne Gegenprobe außerhalb (Ende der
// Fortsetzung) bleiben offen und werden so gemeldet. Neue Punkte gehen in dieselbe
// -genau.json. Mehrere Ränder gleichzeitig (--parallel), niedrigste Priorität.

import { readFileSync, writeFileSync, existsSync, appendFileSync } from "node:fs";
import { join } from "node:path";
import { spawn } from "node:child_process";
import { setPriority, constants } from "node:os";
import { HIER } from "../quellen.mjs";
import { schreibeSicher } from "./sicher.mjs";
import { darfStarten, meldeLaufend } from "./teilpause.mjs";

try { setPriority(constants.priority.PRIORITY_LOW); } catch { /* ohne Recht bleibt es normal */ }
const argv = process.argv.slice(2), DATEI = argv[0], arg = (n, v) => (argv.includes(n) ? +argv[argv.indexOf(n) + 1] : v);
const EPS = arg("--genauigkeit", 0.005), PAR = arg("--parallel", 2);
if (!DATEI) { console.error("Aufruf: node werkzeug/fenster-genau.mjs <datei>"); process.exit(2); }
const ORDNER = join(HIER, "ergebnisse", "listenfortsetzung"), GEN = join(ORDNER, DATEI + "-genau.json"), LOG = join(HIER, "ablage", "fenster-genau.log");
const log = z => { const t = new Date().toLocaleTimeString("de-DE"); appendFileSync(LOG, `${t} ${DATEI}: ${z}\n`); console.log(`${t} ${z}`); };
const lies = () => (existsSync(GEN) ? JSON.parse(readFileSync(GEN, "utf8")) : { punkte: [] });
const stabil = p => p.ok && p.urteil === "stabil";
// eine Probe auf 30 Stellen, als Prozess; schreibt sie in die -genau.json. Bei Teilpause (ablage/TEILPAUSE,
// 15.11.2026) erst starten, wenn alle Werkzeuge zusammen unter dem Deckel liegen.
// STOPP auch beim Warten auf einen Platz prüfen (Code-Prüfung 15.11.2026, Befund 2: sonst begann ein
// wartendes fenster-genau nach dem STOPP noch eine Probe, sobald ein Platz frei wurde); dann null.
let laufendFG = 0;
const STOPP_DATEI = join(HIER, "ablage", "STOPP");
setInterval(() => { if (laufendFG > 0) meldeLaufend(laufendFG); }, 30000).unref();   // Lebenszeichen
async function probe(m3) {
  while (!darfStarten()) { if (existsSync(STOPP_DATEI)) return null; await new Promise(r => setTimeout(r, 30000)); }
  if (existsSync(STOPP_DATEI)) return null;
  laufendFG++; meldeLaufend(laufendFG);
  return new Promise(fertig => {
    const c = spawn(process.execPath, [join(HIER, "werkzeug", "fortsetzung-genau.mjs"), "--punkt", String(m3), "--name", "listenfortsetzung/" + DATEI], { stdio: ["ignore", "pipe", "ignore"] });
    let s = ""; c.stdout.on("data", d => (s += d));
    c.on("close", () => {
      laufendFG--; meldeLaufend(laufendFG);
      let e; try { e = JSON.parse(s.trim().split("\n").pop()); } catch { e = { m3, ok: false, grund: "keine Ausgabe" }; }
      const G = lies(); G.punkte = G.punkte.filter(p => Math.abs(p.m3 - m3) > 1e-12).concat([e]).sort((x, y) => x.m3 - y.m3);
      schreibeSicher(GEN, JSON.stringify(G, null, 1));
      log(`m3 ${m3.toFixed(5)}: ${e.ok ? e.urteil + ", s " + (e.komplex ? e.s1.toFixed(5) + " ± " + e.sIm.toExponential(1) + "i" : e.s1.toFixed(5) + " / " + e.s2.toFixed(5)) : "FEHL " + e.grund} (${(e.sekunden || 0).toFixed(0)} s)`);
      fertig(e);
    });
  });
}
// Ränder aus den angenommenen Proben: Paare (stabil, nicht stabil) benachbarter Proben
function raender() {
  const P = lies().punkte.filter(p => p.ok).sort((x, y) => x.m3 - y.m3), r = [];
  for (let i = 0; i + 1 < P.length; i++) if (stabil(P[i]) !== stabil(P[i + 1])) r.push({ innen: stabil(P[i]) ? P[i].m3 : P[i + 1].m3, aussen: stabil(P[i]) ? P[i + 1].m3 : P[i].m3 });
  return r;
}
// je Rand halbieren, bis eng genug; Ränder parallel
async function rand(r) {
  let { innen, aussen } = r;
  while (Math.abs(aussen - innen) > EPS) {
    // ablage/STOPP: keinen neuen Punkt beginnen (11.11.2026 — vorher rechnete eine laufende Familie
    // alle Halbierungen zu Ende, bei I.B-1 bis zu 13 Punkte, also Stunden)
    if (existsSync(join(HIER, "ablage", "STOPP"))) { log(`STOPP: Rand ${innen} … ${aussen} bleibt offen`); break; }
    const m = Math.round(((innen + aussen) / 2) * 1e6) / 1e6, e = await probe(m);
    if (e === null) { log(`STOPP: Rand ${innen} … ${aussen} bleibt offen`); break; }
    if (!e.ok) { log(`Rand bei ${innen} … ${aussen}: Probe ${m} ohne Ergebnis, Halbierung beendet`); break; }
    if (stabil(e)) innen = m; else aussen = m;
  }
  return { innen, aussen };
}
// Ränder ohne Gegenprobe (12.11.2026): ist die äußerste Probe einer Seite stabil, liegt außen noch
// keine Gegenprobe — bisher blieb so ein Rand offen (46 von 158). Jetzt tastet die Suche nach außen:
// der double-Punkt der Fortsetzung nächst innen ∓ d, d = 0,01, 0,02, 0,04 … (höchstens 6 Schritte),
// bis eine Probe nicht stabil ist; dann halbieren wie oben. Kein double-Punkt mehr: Ende der Fortsetzung.
const FAM = JSON.parse(readFileSync(join(ORDNER, DATEI + ".json"), "utf8"));
const DP = [...FAM.richtungen.abwaerts.punkte, FAM.start, ...FAM.richtungen.aufwaerts.punkte].map(q => q.m3).sort((x, y) => x - y);
function offeneEnden() {
  const P = lies().punkte.filter(p => p.ok).sort((x, y) => x.m3 - y.m3), e = [];
  if (P.length && stabil(P[0])) e.push({ innen: P[0].m3, seite: -1 });
  if (P.length && stabil(P[P.length - 1])) e.push({ innen: P[P.length - 1].m3, seite: 1 });
  return e;
}
async function nachAussen(o) {
  let innen = o.innen, d = 0.01;
  for (let k = 0; k < 6; k++) {
    if (existsSync(join(HIER, "ablage", "STOPP"))) { log(`STOPP: Rand bei ${innen} nach außen bleibt offen`); return { innen, aussen: null }; }
    const K = DP.filter(m => o.seite * (m - innen) > 1e-9);
    if (!K.length) { log(`Rand bei ${innen}: die Fortsetzung endet hier`); return { innen, aussen: null }; }
    const ziel = innen + o.seite * d, m = K.reduce((x, y) => (Math.abs(y - ziel) < Math.abs(x - ziel) ? y : x));
    const e = await probe(m);
    if (e === null) { log(`STOPP: Rand bei ${innen} nach außen bleibt offen`); return { innen, aussen: null }; }
    if (!e.ok) { log(`Rand bei ${innen}: Probe ${m} nach außen ohne Ergebnis`); return { innen, aussen: null }; }
    if (!stabil(e)) return rand({ innen, aussen: m });
    innen = m; d *= 2;
  }
  log(`Rand nach außen: nach 6 Schritten bei ${innen} noch stabil`);
  return { innen, aussen: null };
}
const R = raender(), E = offeneEnden();
log(`${R.length} Ränder: ${R.map(r => r.innen + " | " + r.aussen).join(", ")}${E.length ? `; ${E.length} ohne Gegenprobe: ${E.map(o => o.innen + (o.seite < 0 ? " nach unten" : " nach oben")).join(", ")}` : ""}`);
const auftraege = [...R.map(r => () => rand(r)), ...E.map(o => () => nachAussen(o))], ergebnis = [];
for (let i = 0; i < auftraege.length; i += PAR) ergebnis.push(...(await Promise.all(auftraege.slice(i, i + PAR).map(f => f()))));
const P = lies().punkte.filter(p => p.ok).sort((x, y) => x.m3 - y.m3);
log(`fertig: Ränder ${ergebnis.map(r => `${r.innen} (stabil) | ${r.aussen ?? "offen"}`).join("; ")}; ${P.filter(stabil).length} von ${P.length} Proben stabil`);
