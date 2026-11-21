// dreikoerper/werkzeug/stufe6-kette.mjs — Stufe 6 als eine Kette (12.11.2026, Felix: „mach weiter
// mit 6a, 6b und den fensterrändern. danach deine beiden vorschläge“).
//
//   node werkzeug/stufe6-kette.mjs
//
// Gleichzeitig, zusammen höchstens 7 Rechenprozesse (Felix: bis 85 %; gemessen 7 ≈ 84 %):
//   A  6a: stufe6.mjs --parallel 3 (die Familien ohne Fortsetzungspunkt, kleine Schritte)
//   B  Rest der Stichprobe 6b (liste-genau, 2 Plätze)
//   C  Fensterränder der Kandidaten (fenster-reihe, 2 Familien × 1)
// Sobald B fertig ist: 6b für alle fortgesetzten Familien mit Begegnung < 1e-4 (Probe an der
// Listenmasse auf 30 Stellen), gemischt, mit den Plätzen, die A und C gerade nicht brauchen
// (ablage/plaetze-6.txt, alle 20 s neu). Nach A ein zweiter Durchgang für die Familien, die 6a
// noch fortgesetzt hat. Danach 6c: um die Listenmasse (± 0,005, ± 0,03) für alle Familien, die
// an der Listenmasse auf 30 Stellen stabil sind, in double aber nirgends — aus Stufe 1–4 (63)
// und was 6b findet. Ausgenommen sind stets die Kandidaten der Fensterliste (nie zwei Werkzeuge
// an derselben -genau.json). ablage/STOPP: kein neuer Teil, keine neuen Punkte; ein Teil, der
// mit Fehler endet, hält die Kette an (Lehre aus stufe5.mjs).

import { spawn } from "node:child_process";
import { readFileSync, writeFileSync, existsSync, readdirSync, appendFileSync } from "node:fs";
import { join } from "node:path";
import { setPriority, constants } from "node:os";
import { HIER } from "../quellen.mjs";
import { schreibeSicher } from "./sicher.mjs";

try { setPriority(constants.priority.PRIORITY_LOW); } catch { /* ohne Recht bleibt es normal */ }
const W = join(HIER, "werkzeug"), E = join(HIER, "ergebnisse"), O = join(E, "listenfortsetzung"), A_ = join(HIER, "ablage");
const STOPP = join(A_, "STOPP"), PLAETZE = join(A_, "plaetze-6.txt"), LOG = join(A_, "stufe6.log");
const log = z => { const t = new Date().toLocaleString("de-DE"); appendFileSync(LOG, `${t} Kette: ${z}\n`); console.log(`${t} ${z}`); };
const lies = p => { try { return JSON.parse(readFileSync(p, "utf8")); } catch { return null; } };
const FENSTER = readFileSync(join(E, "fenster-liste.txt"), "utf8").trim().split(/\s+/);
const BEG = new Map(lies(join(E, "liste-begegnungen.json")).bahnen.map(x => [`${x.name.replace(/[^A-Za-z0-9.-]/g, "")}-${x.m3}`, x.rMin]));

const laeuft = { A: false, B: false, C: false };
function starte(name, args) {
  laeuft[name] = true; log(`${name} beginnt: ${args.join(" ").slice(0, 160)}`);
  return new Promise(fertig => {
    const c = spawn(process.execPath, args.map((x, i) => (i === 0 ? join(W, x) : x)), { stdio: "ignore", cwd: HIER });
    c.on("exit", code => { laeuft[name] = false; log(`${name} Ende, Exit ${code}`); fertig(code); });
  });
}
// Plätze für 6b/6c: 8 minus was A und C belegen, mindestens 2 (8 statt 7 seit 16.11.2026, Felix: „lass mit 8 weiterlaufen“; gemessen 72 % im Mittel, höchstens 79 %)
const plaetze = () => Math.max(2, 8 - (laeuft.A ? 3 : 0) - (laeuft.B ? 2 : 0) - (laeuft.C ? 2 : 0));
const waechter = setInterval(() => writeFileSync(PLAETZE, String(plaetze())), 20000);
// vorsichtig 2, bis A, B und C laufen: am 12.11.2026, 21:35 stand hier vor ihrem Start 7, und 6b
// nahm in den ersten 20 s sieben Plätze zu den zwei der Fensterränder — 8 Prozesse, CPU über 85 %
writeFileSync(PLAETZE, "2");

function familie(d) {
  const R = lies(join(O, d + ".json"));
  if (!R || !R.richtungen || !R.richtungen.aufwaerts || R.richtungen.aufwaerts.grund === "läuft") return null;
  const P = [...R.richtungen.abwaerts.punkte, ...R.richtungen.aufwaerts.punkte];
  const G = (lies(join(O, d + "-genau.json")) || { punkte: [] }).punkte;
  const L = G.find(g => Math.abs(g.m3 - R.start.m3) < 1e-9);
  return { d, R, P, G, L };
}
const namen = () => readdirSync(O).filter(n => n.endsWith(".json") && !n.endsWith("-genau.json")).map(n => n.slice(0, -5));
function liste6b() {
  const F = namen().filter(d => BEG.get(d) < 1e-4 && !FENSTER.includes(d)).map(familie).filter(f => f && f.P.length > 0);
  schreibeSicher(join(E, "stufe6b-familien.json"), JSON.stringify({ zweck: "6b: Probe an der Listenmasse auf 30 Stellen, alle fortgesetzten Familien mit Begegnung < 1e-4, ohne Kandidaten der Fensterliste", erzeugt: new Date().toISOString(), familien: F.map(f => f.d) }, null, 1));
  return F.length;
}
function liste6c() {
  const F = namen().filter(d => !FENSTER.includes(d)).map(familie)
    .filter(f => f && f.P.length > 0 && !f.P.some(q => q.stabil === true) && f.L && f.L.ok && f.L.urteil === "stabil");
  schreibeSicher(join(E, "stufe6c-familien.json"), JSON.stringify({ zweck: "6c: um die Listenmasse (± 0,005, ± 0,03) für Familien, die dort auf 30 Stellen stabil sind, in double aber nirgends", erzeugt: new Date().toISOString(), familien: F.map(f => f.d) }, null, 1));
  return F.length;
}
const halt = () => existsSync(STOPP);
const genau = (datei, extra) => ["liste-genau.mjs", "--familienDatei", join(E, datei), "--parallel", "2", "--parallelDatei", PLAETZE, "--mischen", "20261112", ...extra];

log("Start");
const pA = starte("A", ["stufe6.mjs", "--parallel", "3"]);
const pC = starte("C", ["fenster-reihe.mjs", ...FENSTER, "--familien", "2", "--je", "1"]);
const pB = starte("B", ["liste-genau.mjs", "--familienDatei", join(E, "stufe6b-stichprobe.json"), "--parallel", "2"]);
writeFileSync(PLAETZE, String(plaetze()));
let fehler = false;
const pruefe = (teil, code) => { if (code !== 0) { fehler = true; log(`${teil} endete mit Exit ${code}: Kette hält an`); } };
pruefe("B", await pB);
if (!fehler && !halt()) { log(`6b, erster Durchgang: ${liste6b()} Familien`); pruefe("6b-1", await starte("6b", genau("stufe6b-familien.json", []))); }
pruefe("A", await pA);
if (!fehler && !halt()) { log(`6b, zweiter Durchgang (nach 6a): ${liste6b()} Familien`); pruefe("6b-2", await starte("6b", genau("stufe6b-familien.json", []))); }
if (!fehler && !halt()) { log(`6c: ${liste6c()} Familien`); pruefe("6c", await starte("6c", genau("stufe6c-familien.json", ["--umListenmasse"]))); }
pruefe("C", await pC);
clearInterval(waechter); writeFileSync(PLAETZE, "8");
log(fehler ? "Kette mit Fehler beendet" : halt() ? "Kette nach STOPP beendet" : "Kette fertig");
