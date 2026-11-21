// dreikoerper/werkzeug/stufe6-nach.mjs — Nachlauf der Stufe-6-Kette (12.11.2026, Felix: „Fensterreihe
// nachrechnen … Probe an der Listenmasse für die Familien ohne Fortsetzungspunkt (6d) … damit bin
// ich sehr einverstanden“).
//
//   node werkzeug/stufe6-nach.mjs
//
// Wartet, bis die Kette (werkzeug/stufe6-kette.mjs) „Kette fertig“ meldet. Endet sie anders (STOPP,
// Fehler) oder verschwindet ihr Prozess ohne diese Zeile, tut der Nachlauf nichts. Dann:
//   1. auswerten (liste-auswerten.mjs), damit neue Kandidaten aus 6c dabei sind;
//   F2 Fensterränder, zweiter Durchgang, für alle Kandidaten: fenster-genau tastet seit 12.11. nach
//      außen, die ersten Familien liefen noch ohne; Fertiges kostet nur Sekunden (2 Plätze);
//   6d Probe an der Listenmasse für alle Familien, die noch keine haben — auch die ohne
//      Fortsetzungspunkt (fortsetzung-genau kann das seit 12.11.); ohne die Kandidaten, die F2
//      gerade bearbeitet (nie zwei Werkzeuge an derselben -genau.json). Plätze: 7 minus F2.
//   2. noch einmal auswerten.
// Protokoll in ablage/stufe6.log (Zeilen „Kette: F2 …“, „Kette: 6d …“ — der Leitstand liest sie).

import { spawn, spawnSync, execFileSync } from "node:child_process";
import { readFileSync, writeFileSync, existsSync, readdirSync, appendFileSync } from "node:fs";
import { join } from "node:path";
import { setPriority, constants } from "node:os";
import { HIER } from "../quellen.mjs";
import { schreibeSicher } from "./sicher.mjs";

try { setPriority(constants.priority.PRIORITY_LOW); } catch { /* ohne Recht bleibt es normal */ }
const W = join(HIER, "werkzeug"), E = join(HIER, "ergebnisse"), O = join(E, "listenfortsetzung"), A_ = join(HIER, "ablage");
const LOG = join(A_, "stufe6.log"), STOPP = join(A_, "STOPP"), PLAETZE = join(A_, "plaetze-6d.txt");
const log = z => { const t = new Date().toLocaleString("de-DE"); appendFileSync(LOG, `${t} Kette: ${z}\n`); console.log(`${t} ${z}`); };
const lies = p => { try { return JSON.parse(readFileSync(p, "utf8")); } catch { return null; } };
const warte = s => new Promise(r => setTimeout(r, s * 1000));
const ketteLaeuft = () => { try { return /stufe6-kette/.test(execFileSync("powershell", ["-NoProfile", "-Command",
  "Get-CimInstance Win32_Process -Filter \"Name='node.exe'\" | ForEach-Object { $_.CommandLine }"], { encoding: "utf8", timeout: 30000 })); } catch { return true; } };

// 0. auf das Ende der Kette warten
log("Nachlauf wartet auf das Ende der Kette");
let ende = null;
// nur Zeilen nach dem letzten Start der Kette zählen (12.11.2026: der Nachlauf las beim Wiederanlauf
// die alte Zeile „Kette nach STOPP beendet“ und gab sofort auf)
const seitStart = () => { if (!existsSync(LOG)) return []; const Z = readFileSync(LOG, "utf8").split(/\r?\n/);
  const i = Z.map(x => / Kette: Start$/.test(x)).lastIndexOf(true); return Z.slice(i + 1); };
// Die Prozessliste (PowerShell) nur alle 10 min: jeder Start kostet kurz viel Rechenzeit, und mit
// 7 Rechenprozessen gab das Spitzen über 85 % (12.11.2026). Das Protokoll reicht jede Minute.
let runde = 0;
while (!ende) {
  const z = seitStart().filter(x => / Kette: Kette /.test(x)).pop() || "";
  if (/Kette fertig/.test(z)) ende = "fertig";
  else if (/Kette (nach STOPP|mit Fehler)/.test(z)) ende = "abgebrochen";
  else if (runde++ % 10 === 9 && !ketteLaeuft()) { await warte(30); if (!ketteLaeuft() && !seitStart().some(x => /Kette: Kette fertig/.test(x))) ende = "verschwunden"; }
  if (!ende) await warte(60);
}
if (ende !== "fertig" || existsSync(STOPP)) { log(`Nachlauf beginnt nicht: Kette ${ende}${existsSync(STOPP) ? ", STOPP liegt" : ""}`); process.exit(0); }

const lauf = (name, args) => new Promise(fertig => {
  log(`${name} beginnt: ${args.join(" ").slice(0, 140)}`);
  const c = spawn(process.execPath, [join(W, args[0]), ...args.slice(1)], { stdio: "ignore", cwd: HIER });
  c.on("exit", code => { log(`${name} Ende, Exit ${code}`); fertig(code); });
});
const auswerten = () => spawnSync(process.execPath, [join(W, "liste-auswerten.mjs")], { stdio: "ignore", cwd: HIER }).status;

// 1. auswerten, Listen bauen
log(`auswerten: Exit ${auswerten()}`);
const kand = ((lies(join(E, "listenfortsetzung-auswertung.json")) || { kandidaten: [] }).kandidaten || []).map(k => k.datei);
schreibeSicher(join(E, "fenster-liste-2.txt"), kand.join(" ") + "\n");
const namen = readdirSync(O).filter(n => n.endsWith(".json") && !n.endsWith("-genau.json")).map(n => n.slice(0, -5));
const ohne = namen.filter(d => !kand.includes(d)).filter(d => {
  const R = lies(join(O, d + ".json")); if (!R || !R.richtungen || !R.richtungen.aufwaerts || R.richtungen.aufwaerts.grund === "läuft") return false;
  const G = (lies(join(O, d + "-genau.json")) || { punkte: [] }).punkte;
  // ein Eintrag „keine Ausgabe“ (Prozess gestorben) ist keine Probe — sonst fehlten die 87 aus Stufe 2/4
  return !G.some(g => Math.abs(g.m3 - R.start.m3) < 1e-9 && !(g.ok === false && /keine Ausgabe/.test(g.grund || "")));
});
// „alle“: jede Familie, die je in der 6d-Liste stand (18.11.2026) — beim Neustart stehen in „familien“ nur noch die
// offenen, und der Leitstand zählte dann gegen die kleinere Liste („2 von 193“ statt 13 von 204)
const alt6d = lies(join(E, "stufe6d-familien.json")) || {}, alle6d = [...new Set([...(alt6d.alle || alt6d.familien || []), ...ohne])];
schreibeSicher(join(E, "stufe6d-familien.json"), JSON.stringify({ zweck: "6d: Probe an der Listenmasse auf 30 Stellen für alle Familien, die noch keine haben (auch ohne Fortsetzungspunkt); ohne die Kandidaten. „familien“: noch offen beim letzten Start; „alle“: je in der Liste", erzeugt: new Date().toISOString(), familien: ohne, alle: alle6d }, null, 1));
log(`Listen: ${kand.length} Kandidaten für F2, ${ohne.length} Familien für 6d`);

// 2. F2 und 6d gleichzeitig, zusammen 8 Plätze (seit 16.11.2026, vorher 7) — über den gemeinsamen Deckel ablage/DECKEL (15.11.2026,
// Felix: „behebe den engpass“): wer Arbeit hat, bekommt den Platz. Bisher fest 2 für F2 und 5 für 6d; war
// 6d zuerst fertig, standen 5 Plätze leer, bis F2 durch war. Eine Teilpause (ablage/TEILPAUSE) senkt ihn.
writeFileSync(join(A_, "DECKEL"), "8");
let f2laeuft = true;
writeFileSync(PLAETZE, "8");
const pF2 = lauf("F2", ["fenster-reihe.mjs", ...kand, "--familien", "8", "--je", "1"]).then(c => { f2laeuft = false; return c; });
const p6d = ohne.length ? lauf("6d", ["liste-genau.mjs", "--familienDatei", join(E, "stufe6d-familien.json"), "--parallel", "8", "--parallelDatei", PLAETZE, "--mischen", "20261113"]) : Promise.resolve(0);
const [c1, c2] = await Promise.all([pF2, p6d]);
let fehler = c1 || c2 ? `F2 ${c1}, 6d ${c2}` : "", bfFehler = "";

// 3. Nachtrag (12.11.2026, Fehlersuche): 6d findet Familien, die an der Listenmasse stabil sind —
// erst danach lohnt ihre Nachbarschaft (wie 6c), und neue Kandidaten brauchen Fensterränder.
// Beides unter den Schlüsseln 6c und F2, die Listen als Vereinigung, damit der Leitstand das
// Ganze zeigt. liste-genau und fenster-genau überspringen Fertiges.
log(`auswerten: Exit ${auswerten()}`);
const vereinigt = (datei, neu) => { const alt = (lies(join(E, datei)) || { familien: [] }).familien; return [...new Set([...alt, ...neu])]; };
if (!fehler && !existsSync(STOPP)) {
  const kand2 = ((lies(join(E, "listenfortsetzung-auswertung.json")) || { kandidaten: [] }).kandidaten || []).map(k => k.datei);
  const c6 = namen.filter(d => !kand2.includes(d)).filter(d => {
    const R = lies(join(O, d + ".json")); if (!R || !R.richtungen || !R.richtungen.aufwaerts || R.richtungen.aufwaerts.grund === "läuft") return false;
    const P = [...R.richtungen.abwaerts.punkte, ...R.richtungen.aufwaerts.punkte];
    const L = ((lies(join(O, d + "-genau.json")) || { punkte: [] }).punkte).find(g => Math.abs(g.m3 - R.start.m3) < 1e-9);
    return P.length > 0 && !P.some(q => q.stabil === true) && L && L.ok && L.urteil === "stabil";
  });
  schreibeSicher(join(E, "stufe6c-familien.json"), JSON.stringify({ zweck: "6c: um die Listenmasse (± 0,005, ± 0,03) für Familien, die dort auf 30 Stellen stabil sind, in double aber nirgends (mit Nachtrag aus 6d)", erzeugt: new Date().toISOString(), familien: vereinigt("stufe6c-familien.json", c6) }, null, 1));
  writeFileSync(PLAETZE, "8");
  log(`6c-Nachtrag: ${c6.length} Familien`);
  const c3 = await lauf("6c", ["liste-genau.mjs", "--familienDatei", join(E, "stufe6c-familien.json"), "--parallel", "8", "--parallelDatei", PLAETZE, "--umListenmasse", "--mischen", "20261114"]);
  if (c3) fehler = `6c-Nachtrag ${c3}`;
  log(`auswerten: Exit ${auswerten()}`);
  // Fensterränder für neue Kandidaten — die aus 6d und dem 6c-Nachtrag VOR dem Ziehen der Stichprobe
  // (Code-Prüfung 15.11.2026, Befund 8: sonst hätten diese Stücke beim Ziehen nur grobe Klammern, und
  // Treffer daneben zählten als „Rand offen“, obwohl die endgültige Karte ihre Ränder auf 0,005 kennt),
  // die aus Treffern der Stichprobe danach. Gibt die Kandidaten vor dem eigenen Lauf zurück.
  const fensterNeu = async (bekannt, wozu) => {
    const jetzt = ((lies(join(E, "listenfortsetzung-auswertung.json")) || { kandidaten: [] }).kandidaten || []).map(k => k.datei);
    const neu = jetzt.filter(d => !bekannt.includes(d));
    if (fehler || existsSync(STOPP) || !neu.length) return jetzt;
    schreibeSicher(join(E, "fenster-liste-2.txt"), [...new Set([...bekannt, ...neu])].join(" ") + "\n");
    log(`Fensterränder für ${neu.length} neue Kandidaten (${wozu})`);
    const c4 = await lauf("F2", ["fenster-reihe.mjs", ...neu, "--familien", "8", "--je", "1"]);
    if (c4) fehler = `F2-Nachtrag ${c4}`;
    log(`auswerten: Exit ${auswerten()}`);
    return jetzt;
  };
  const kandVorBF = await fensterNeu(kand, "aus 6d und dem 6c-Nachtrag");
  // Messung des blinden Flecks (13.11.2026, ergebnisse/GRENZEN.md): die Zufallsstichprobe
  // (blinder-fleck.mjs zieht sie nur einmal, jetzt, da alle Fortsetzungen fertig sind) auf 30 Stellen —
  // vor den Fensterrändern für neue Kandidaten und vor der BHH-Lage, damit Treffer daraus voll
  // mitgeprüft werden. Scheitert sie, wird das laut vermerkt, hält aber BHH-Lage und Prüfung nicht auf.
  if (!fehler && !existsSync(STOPP)) {
    const z = spawnSync(process.execPath, [join(W, "blinder-fleck.mjs")], { stdio: ["ignore", "ignore", "pipe"], cwd: HIER, encoding: "utf8" });
    if (z.status) { bfFehler = `Stichprobe nicht gezogen (Exit ${z.status}: ${(z.stderr || "").trim().slice(0, 200)})`; log(`Blinder Fleck: ${bfFehler}`); }
    else {
      const cB = await lauf("BF", ["liste-genau.mjs", "--auftragsDatei", join(E, "blinder-fleck-stichprobe.json"), "--parallel", "8", "--parallelDatei", PLAETZE]);
      if (cB) { bfFehler = `liste-genau Exit ${cB}`; log(`Blinder Fleck: ${bfFehler}`); }
      log(`auswerten: Exit ${auswerten()}`);
    }
  }
  await fensterNeu(kandVorBF, "Treffer der Stichprobe");
}
// 4. Abnahme und BHH-Lage aller endgültigen Kandidaten (12.11.2026, Fehlersuche): erst das
// Prüfskript (es schreibt die Kandidatenliste, die bhh-alle liest), dann die BHH-Lage, dann noch
// einmal das Prüfskript — sein Exit-Code entscheidet, ob der Nachlauf als fertig gilt.
// zum Schluss mit --schluss: dann sind Proben ohne Ergebnis und Familien im Zustand „läuft“ harte Verstöße
// (Code-Prüfung 15.11.2026, Befund 6: ein im Nachlauf gestorbener Punkt rechnet sonst niemand nach)
const pruefen = schluss => spawnSync(process.execPath, [join(W, "pruefe-alles.mjs"), ...(schluss ? ["--schluss"] : [])], { stdio: "ignore", cwd: HIER }).status;
if (!fehler && !existsSync(STOPP)) {
  log(`Prüfung vor der BHH-Lage: Exit ${pruefen()}`);
  // sieben Teile gleichzeitig; jeder Kandidat schreibt seine eigene Datei (ergebnisse/bhh-lage/)
  const c5 = (await Promise.all([0, 1, 2, 3, 4, 5, 6].map(i => lauf("BHH", ["bhh-alle.mjs", "--teil", `${i}/7`])))).find(c => c) || 0;
  if (c5) fehler = `BHH-Lage ${c5}`;
  const r = pruefen(true); log(`Prüfung zum Schluss: Exit ${r}`);
  if (r && !fehler) fehler = `Prüfskript meldet Verstöße (Exit ${r}, siehe ergebnisse/pruefung.json)`;
}
log((fehler ? `Nachlauf mit Fehler beendet (${fehler})` : existsSync(STOPP) ? "Nachlauf nach STOPP beendet" : "Nachlauf fertig") + (bfFehler ? ` — Blinder Fleck: ${bfFehler}` : ""));
