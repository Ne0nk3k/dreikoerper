// dreikoerper/werkzeug/liste-genau.mjs — Stufe 2 der Listenfortsetzung (06.11.2026): die
// stabilen Abschnitte, die die Fortsetzung in double meldet, auf 30 Stellen prüfen.
//
//   node werkzeug/liste-genau.mjs [--parallel 9] [--bis 09:00] [--jeFamilie 16]
//
// Double ist bei engen Begegnungen unzuverlässig (I.A-5: bei 4,0025 ein Index 2,06, bei 4,005
// wieder 0,06) — ein Abschnitt zählt erst, wenn 30 Stellen ihn bestätigen. Je Familie aus
// ergebnisse/listenfortsetzung/<datei>.json: die Listenmasse selbst; je stabilem Abschnitt
// (aufeinanderfolgende Punkte stabil in double) beide Enden, die Nachbarn außerhalb (um die
// Grenze einzuklammern) und Zwischenpunkte im Abstand ≥ 0,1; höchstens --jeFamilie Punkte.
// Familien mit der längsten stabilen Strecke zuerst. Jeder Punkt ein Prozess
// fortsetzung-genau.mjs --punkt (Newton in double, dann 30 Stellen, Stabilität mit Gegenprobe),
// niedrigste Priorität. Ergebnis je Familie nach …/<datei>-genau.json (Format wie
// fortsetzung-genau.mjs). Wiederaufnahme: Fertiges wird übersprungen. Anhalten: ablage/STOPP.

import { readFileSync, writeFileSync, existsSync, readdirSync, appendFileSync } from "node:fs";
import { join } from "node:path";
import { spawn } from "node:child_process";
import { setPriority, constants } from "node:os";
import { HIER } from "../quellen.mjs";
import { schreibeSicher } from "./sicher.mjs";
import { darfStarten, meldeLaufend } from "./teilpause.mjs";

try { setPriority(constants.priority.PRIORITY_LOW); } catch { /* ohne Recht bleibt es normal */ }
const argv = process.argv.slice(2), arg = n => (argv.includes(n) ? argv[argv.indexOf(n) + 1] : null);
const PARALLEL = +(arg("--parallel") || 9), BIS = arg("--bis"), JE = +(arg("--jeFamilie") || 16);
// --nurAbschnitte: keine Pflichtprobe an der Listenmasse, nur die stabilen Abschnitte (und ihre
// Nachbarn). Für Stufe 5 (11.11.2026, Felix: „zweite variante“): die Probe an der Listenmasse
// dient nur der Eichung; Kandidaten kommen allein aus stabilen Abschnitten, und bei engen
// Begegnungen kostet ein Punkt geschätzt 2300 bis 5000 s.
const NUR_ABSCHNITTE = argv.includes("--nurAbschnitte");
// --familien a,b,c: nur diese Familien (Dateinamen ohne .json). Für Stichproben (11.11.2026: was
// kostet die Probe an der Listenmasse bei Begegnung < 1e-4, zufällig gezogen, nicht die ersten N).
let NUR_FAMILIEN = arg("--familien") ? new Set(arg("--familien").split(",")) : null;
// Seit 12.11.2026 (Felix: 6b für alle Familien von Stufe 5, dann die 63 übersehenen):
// --familienDatei <json>: Familien aus einer Datei ({ familien: [...] }), statt einer langen Zeile.
// --umListenmasse: zusätzlich je Seite die double-Punkte nächst Listenmasse ± 0,005 und ± 0,03 —
//   für Familien, die an der Listenmasse auf 30 Stellen stabil sind, double aber nirgends stabil
//   nennt (in Stufe 1–4 waren das 63; stabil dort hieße: Kandidat).
// --mischen <saat>: Familien in fester Zufallsreihenfolge, damit jeder Zwischenstand eine
//   Stichprobe ist (Lehre vom 11.11.: die ersten N einer sortierten Liste sind keine).
// --parallelDatei <pfad>: steht dort eine Zahl, gilt sie statt --parallel (bei jedem Start neu
//   gelesen) — so kann die Kette Plätze nachschieben, sobald andere Arbeit fertig ist.
if (arg("--familienDatei")) NUR_FAMILIEN = new Set(JSON.parse(readFileSync(arg("--familienDatei"), "utf8")).familien);
const UM_LISTENMASSE = argv.includes("--umListenmasse"), MISCHEN = arg("--mischen"), PDATEI = arg("--parallelDatei");
const plaetze = () => { if (PDATEI) { try { const n = +readFileSync(PDATEI, "utf8").trim(); if (n > 0 && n <= 9) return n; } catch { /* Datei fehlt: --parallel */ } } return PARALLEL; };
const ORDNER = join(HIER, "ergebnisse", "listenfortsetzung"), STOPP = join(HIER, "ablage", "STOPP"), LOG = join(HIER, "ablage", "liste-genau.log");
const log = z => { const t = new Date().toLocaleTimeString("de-DE"); appendFileSync(LOG, `${t} ${z}\n`); console.log(`${t} ${z}`); };
const zuSpaet = () => { if (!BIS) return false; const [h, m] = BIS.split(":").map(Number), j = new Date(); return j.getHours() * 60 + j.getMinutes() >= h * 60 + m && j.getHours() < 18; };

function auswahl(R) {
  const P = [...R.richtungen.abwaerts.punkte, { ...R.start, stabil: null, start: true }, ...R.richtungen.aufwaerts.punkte].sort((x, y) => x.m3 - y.m3);
  const st = q => q.stabil === true;
  const wahl = new Set(NUR_ABSCHNITTE ? [] : [R.start.m3]);
  let laenge = 0;
  for (let i = 0; i < P.length; i++) {
    if (!st(P[i]) || (i > 0 && st(P[i - 1]))) continue;
    let j = i; while (j + 1 < P.length && st(P[j + 1])) j++;
    laenge += P[j].m3 - P[i].m3;
    for (const k of [i - 1, i, j, j + 1]) if (k >= 0 && k < P.length) wahl.add(P[k].m3);
    let zuletzt = P[i].m3;
    for (let k = i + 1; k < j; k++) if (P[k].m3 - zuletzt >= 0.1) { wahl.add(P[k].m3); zuletzt = P[k].m3; }
    i = j;
  }
  if (UM_LISTENMASSE) {
    const s = R.start.m3;
    for (const seite of [-1, 1]) for (const d of [0.005, 0.03]) {
      const K = P.filter(q => !q.start && seite * (q.m3 - s) > 0);
      if (!K.length) continue;
      const q = K.reduce((x, y) => (Math.abs(y.m3 - (s + seite * d)) < Math.abs(x.m3 - (s + seite * d)) ? y : x));
      wahl.add(q.m3);
    }
  }
  return { punkte: [...wahl].sort((x, y) => x - y).slice(0, JE), laenge };
}

const familien = readdirSync(ORDNER).filter(n => n.endsWith(".json") && !n.endsWith("-genau.json")).map(n => {
  try { const R = JSON.parse(readFileSync(join(ORDNER, n), "utf8")); if (!R.richtungen || R.richtungen.aufwaerts.grund === "läuft") return null;
    const a = auswahl(R); return { datei: n.slice(0, -5), ...a }; } catch { return null; }
}).filter(Boolean).filter(f => f.punkte.length).filter(f => !NUR_FAMILIEN || NUR_FAMILIEN.has(f.datei)).sort((x, y) => y.laenge - x.laenge);
if (MISCHEN) { let s = +MISCHEN || 1; const zuf = () => (s = (s * 1103515245 + 12345) % 2147483648) / 2147483648;
  familien.sort((x, y) => (x.datei < y.datei ? -1 : 1)); for (let k = familien.length - 1; k > 0; k--) { const j = Math.floor(zuf() * (k + 1)); [familien[k], familien[j]] = [familien[j], familien[k]]; } }
const auftraege = [];
for (const f of familien) {
  const aus = join(ORDNER, f.datei + "-genau.json"), fertig = existsSync(aus) ? JSON.parse(readFileSync(aus, "utf8")).punkte : [];
  // „keine Ausgabe“ heißt: der Rechenprozess starb (Absturz, Abbruch, Neustart) — so ein Punkt ist
  // nicht gerechnet und kommt wieder in die Reihe (12.11.2026: 87 Listenmassen-Proben aus Stufe 2/4
  // standen so da, Familien ohne Fortsetzungspunkt, an denen fortsetzung-genau abstürzte)
  const gerechnet = p => !(p.ok === false && /keine Ausgabe/.test(p.grund || ""));
  for (const m3 of f.punkte) if (!fertig.some(p => Math.abs(p.m3 - m3) < 1e-12 && gerechnet(p))) auftraege.push({ datei: f.datei, m3 });
}
// --auftragsDatei <json>: statt der Auswahl genau diese Punkte ({ punkte: [{ datei, m3 }] }), Fertiges
// übersprungen — für die Zufallsstichprobe des blinden Flecks (13.11.2026, werkzeug/blinder-fleck.mjs)
if (arg("--auftragsDatei")) {
  auftraege.length = 0;
  for (const a of JSON.parse(readFileSync(arg("--auftragsDatei"), "utf8")).punkte) {
    const aus = join(ORDNER, a.datei + "-genau.json"), fertig = existsSync(aus) ? JSON.parse(readFileSync(aus, "utf8")).punkte : [];
    if (!fertig.some(p => Math.abs(p.m3 - a.m3) < 1e-12 && !(p.ok === false && /keine Ausgabe/.test(p.grund || "")))) auftraege.push({ datei: a.datei, m3: a.m3 });
  }
}
log(`Start: ${arg("--auftragsDatei") ? "Auftragsdatei " + arg("--auftragsDatei") : familien.length + " Familien"}, ${auftraege.length} Punkte offen, ${plaetze()} parallel${PDATEI ? " (aus " + PDATEI + ")" : ""}${UM_LISTENMASSE ? ", um die Listenmasse" : ""}${MISCHEN ? ", gemischt" : ""}${BIS ? ", keine neuen Starts nach " + BIS : ""}`);
let i = 0, laufend = 0, fertigZahl = 0, nachfuellen = null;
await new Promise(alles => {
  const weiter = () => {
    // STOPP und Zeitgrenze vor der Schleife: bei Teilpause kann die Schleife leer bleiben, STOPP gilt trotzdem
    if (i < auftraege.length && existsSync(STOPP)) { log("STOPP gefunden: keine neuen Starts"); i = auftraege.length; }
    if (i < auftraege.length && zuSpaet()) { log(`nach ${BIS}: keine neuen Starts`); i = auftraege.length; }
    while (laufend < plaetze() && i < auftraege.length && darfStarten()) {
      const a = auftraege[i++]; laufend++; meldeLaufend(laufend);
      const c = spawn(process.execPath, [join(HIER, "werkzeug", "fortsetzung-genau.mjs"), "--punkt", String(a.m3), "--name", "listenfortsetzung/" + a.datei], { stdio: ["ignore", "pipe", "ignore"] });
      let s = ""; c.stdout.on("data", d => (s += d));
      c.on("close", () => {
        laufend--; meldeLaufend(laufend); fertigZahl++;
        let e; try { e = JSON.parse(s.trim().split("\n").pop()); } catch { e = { m3: a.m3, ok: false, grund: "keine Ausgabe" }; }
        const aus = join(ORDNER, a.datei + "-genau.json"), alt = existsSync(aus) ? JSON.parse(readFileSync(aus, "utf8")) : { punkte: [] };
        alt.punkte = alt.punkte.filter(p => Math.abs(p.m3 - a.m3) > 1e-12).concat([e]).sort((x, y) => x.m3 - y.m3);
        schreibeSicher(aus, JSON.stringify(alt, null, 1));
        log(`${a.datei} m3 ${a.m3}: ${e.ok ? `${e.urteil}, s ${e.komplex ? e.s1.toFixed(5) + " ± " + e.sIm.toExponential(1) + "i" : e.s1.toFixed(5) + " / " + e.s2.toFixed(5)}` : "FEHL " + e.grund} (${(e.sekunden || 0).toFixed(0)} s; ${fertigZahl}/${auftraege.length})`);
        if (laufend === 0 && i >= auftraege.length) alles(); else weiter();
      });
    }
    // fertig erst, wenn alles begonnen ist (oder STOPP) — bei Teilpause kann gerade nichts laufen, ohne dass
    // die Arbeit getan ist (15.11.2026)
    if (laufend === 0 && i >= auftraege.length) alles();
  };
  // Plätze nachfüllen, wenn die Plätze-Datei mehr erlaubt oder eine Teilpause endet (14./15.11.2026: 6b
  // startete mit 2 Plätzen, die Kette gab Sekunden später 7 frei; bisher griff das erst, wenn ein laufender
  // Punkt endete). Nicht unref: wartet liste-genau auf einen Platz, hält der Takt den Prozess am Leben.
  // dabei die eigene Meldung erneuern: das Lebenszeichen, ohne das teilpause.mjs sie nach 3 min übergeht
  nachfuellen = setInterval(() => { meldeLaufend(laufend); if (i < auftraege.length && laufend < plaetze()) weiter(); }, 30000);
  weiter();
});
clearInterval(nachfuellen); meldeLaufend(0);
log(`Ende: ${fertigZahl} Punkte gerechnet`);
