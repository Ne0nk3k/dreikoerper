// dreikoerper/nachpruefen.mjs — Funde eines Suchlaufs in erhöhter Genauigkeit.
//
//   node nachpruefen.mjs <lauf> [--alle | --unbekannt | --stabil] [--mitStabil]
//                        [--stellen 30] [--max N] [--tmax T] [--limit 900] [--neu] [--offene]
//
// Welche Funde:
//   (ohne)       alle, bei denen double nicht entscheidet: nicht „bestätigt"
//   --unbekannt  nur die, die in keiner Liste stehen
//   --stabil     nur die, deren Stabilitätsurteil in double stabil oder offen ist
//   --alle       alle
//
// Zwei Durchgänge:
//   1  Verfeinern. Newton mit 320-Bit-Festkomma bis auf 30 Stellen, danach
//      derselbe Rest noch einmal mit 448 Bit und höherer Ordnung. „belegt"
//      heißt: Rest unter 1e-30 UND beide Rechnungen einig UND die Korrektur
//      gegenüber dem double-Wert ist klein (die Bahn ist dieselbe geblieben).
//   2  Stabilität (nur mit --stabil oder --mitStabil, und nur dort, wo double
//      nicht schon klar „instabil" sagt): zwölf Tangenten in Festkomma, etwa
//      das Dreizehnfache der Rechenzeit. Davor eine schnelle Stufe, die nur
//      „klar instabil" aussprechen darf und sonst abgibt (geeicht mit
//      werkzeug/stabil-schnell-eichen.mjs); --gruendlich lässt sie weg.
//
// Der Stand wird alle 30 Sekunden nach ergebnisse/<lauf>-genau.json
// geschrieben. Ein neuer Aufruf setzt dort fort und rechnet nur, was fehlt
// (--neu fängt von vorn an). Jeder Auftrag hat ein Zeitlimit (--limit,
// Sekunden): wer es reißt, steht als „zeitlimit" im Bericht und hält die
// anderen nicht auf.
//
// Am Ende ein Abschnitt in ergebnisse/<lauf>.md.

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { HIER } from "./quellen.mjs";
import { macheSchwarm } from "./schwarm.mjs";

const argv = process.argv.slice(2), lauf = argv[0];
if (!lauf) { console.error("Aufruf: node nachpruefen.mjs <lauf> [--alle | --unbekannt | --stabil] [--mitStabil] [--stellen 30] [--max N] [--tmax T] [--limit 900] [--neu]"); process.exit(2); }
const hol = (f, v) => { const i = argv.indexOf("--" + f); return i >= 0 && argv[i + 1] !== undefined ? argv[i + 1] : v; };
const ALLE = argv.includes("--alle"), UNBEK = argv.includes("--unbekannt"), STAB = argv.includes("--stabil"), KAND = argv.includes("--kandidaten"), MITSTAB = STAB || KAND || argv.includes("--mitStabil"), NEU = argv.includes("--neu"), OFFENE = argv.includes("--offene"), GRUENDLICH = argv.includes("--gruendlich");
const STELLEN = +hol("stellen", 30), MAX = +hol("max", 1e9), TMAX = +hol("tmax", 1e9), LIMIT = +hol("limit", 900) * 1000;
const ordner = join(HIER, "ergebnisse"), ziel = join(ordner, lauf + "-genau.json");
const B = JSON.parse(readFileSync(join(ordner, lauf + ".json"), "utf8"));
const z = x => (typeof x !== "number" || !Number.isFinite(x) ? "—" : x === 0 ? "0" : Math.abs(x) < 1e-3 || Math.abs(x) >= 1e5 ? x.toExponential(1) : x.toPrecision(4));
const sag = t => process.stderr.write(t + "\n");

// --unbekannt zusammen mit --stabil: nur die Funde außerhalb der Listen, die
// in double stabil oder offen sind — das, wonach Felix sucht, zuerst (02.10.2026).
const BEIDES = UNBEK && STAB && !ALLE;
// --kandidaten: die Funde, bei denen sich 30 Stellen für die Stabilität lohnen —
// in double stabil, oder offen mit beiden Indizes unter 30. Geeicht am
// 02.10.2026 an vier Läufen: von 325 Bahnen „offen mit Indizes über 30 oder
// unbestimmt" war auf 30 Stellen keine stabil und keine an der Grenze; alle 19
// stabilen und Grenzbahnen kamen aus „stabil" oder „offen unter 30". Mit
// --unbekannt zusammen: nur die außerhalb der Listen. Eine zweite Lage
// derselben Bahn wird übersprungen.
const kandidat = f => !f.weitereLage && (f.stabil === true || (f.stabil === null && Number.isFinite(f.s1) && Number.isFinite(f.s2) && Math.max(Math.abs(f.s1), Math.abs(f.s2)) < 30));
let auswahl = B.funde.map((f, i) => ({ f, i })).filter(({ f }) => f.T <= TMAX && (ALLE ? true : KAND ? (!UNBEK || !f.bekannt) && kandidat(f) : BEIDES ? !f.bekannt && f.stabil !== false : UNBEK ? !f.bekannt : STAB ? f.stabil !== false : f.urteil !== "bestätigt"));
auswahl = auswahl.slice(0, MAX);
const welche = ALLE ? "alle" : KAND ? (UNBEK ? "in keiner Liste und " : "") + "Kandidaten: in double stabil, oder offen mit Indizes unter 30" : BEIDES ? "in keiner Liste und in double stabil oder offen" : UNBEK ? "in keiner Liste" : STAB ? "Stabilität in double stabil oder offen" : "in double nicht bestätigt";

// Was schon gerechnet ist. Ein Eintrag gehört zur Bahn, nicht zur Nummer:
// nachbereiten.mjs kann die Reihenfolge der Funde ändern. Zugeordnet wird
// über den Ort; die Periode muss dieselbe geblieben sein.
const zeilen = new Map();
let rechenzeit = 0;
if (!NEU && existsSync(ziel)) {
  const alt = JSON.parse(readFileSync(ziel, "utf8"));
  if (alt.stellen === STELLEN) {
    rechenzeit = alt.rechenSekunden || 0;
    const ort = (a, b) => Math.round(a * 1e11) + ":" + Math.round(b * 1e11);
    const nachOrt = new Map(B.funde.map((f, i) => [ort(f.a, f.b), i]));
    for (const r of alt.geprueft) {
      if (!r.start) continue;
      const i = nachOrt.get(ort(r.start[0], r.start[1]));
      if (i !== undefined && Math.abs(r.start[2] / B.funde[i].T - 1) < 1e-9) { r.i = i; zeilen.set(i, r); }
    }
  }
}
const speichern = () => writeFileSync(ziel, JSON.stringify({ lauf, datum: new Date().toISOString(), stellen: STELLEN, auswahl: welche, rechenSekunden: rechenzeit + (Date.now() - t0) / 1000,
  geprueft: [...zeilen.values()].sort((x, y) => x.i - y.i) }, null, 1));

const schwarm = macheSchwarm(), mText = B.parameter.m.map(String), ebene = B.parameter.ebene;
const t0 = Date.now();
let letzte = Date.now(), gesichert = Date.now();
const takt = (n, von, was) => {
  if (Date.now() - letzte > 20000) { letzte = Date.now(); sag(`  ${was} ${n}/${von}`); }
  if (Date.now() - gesichert > 30000) { gesichert = Date.now(); speichern(); }
};

/* ── 1 · Verfeinern ── */
// --offene: auch die noch einmal, die beim letzten Mal „offen" oder am Zeitlimit hängen blieben
const nochmal = u => u === "ausnahme" || (OFFENE && (u === "offen" || u === "zeitlimit"));
const offen1 = auswahl.filter(({ i }) => !zeilen.has(i) || nochmal(zeilen.get(i).urteil));
sag(`${lauf}: ${auswahl.length} von ${B.funde.length} Funden gewählt (${welche}); ${auswahl.length - offen1.length} schon gerechnet, ${offen1.length} zu verfeinern, ${schwarm.faeden} Fäden, Zeitlimit ${LIMIT / 1000} s`);
await schwarm.alle(offen1.map(({ f }) => ({ art: "genau", ebene, m: mText, a: f.a, b: f.b, T: f.T,
  opt: { stellen: STELLEN, empfindlich: Number.isFinite(f.lambda) && f.lambda > 1 ? Math.log10(f.lambda) : 0 } })), (g, k, n) => {
  const { f, i } = offen1[k], start = [f.a, f.b, f.T];
  if (g.fehler) zeilen.set(i, { i, start, urteil: g.zeitlimit ? "zeitlimit" : "ausnahme", fehler: g.fehler.slice(0, 200) });
  else {
    const korr = g.korrektur ? Math.max(...g.korrektur.map(Math.abs)) : NaN;
    const einig = g.ok && g.unterschiedDerReste !== undefined && g.unterschiedDerReste < 100 * Math.pow(10, -STELLEN);
    zeilen.set(i, { i, start, urteil: g.ok && einig && korr < 1e-5 ? "belegt" : g.ok && einig ? "belegt, aber verschoben" : "offen",
      a: g.a, b: g.b, T: g.T, rest: g.rest, restAndereGenauigkeit: g.restAndereGenauigkeit, unterschiedDerReste: g.unterschiedDerReste, korrektur: korr,
      restDouble: f.rest, ersterRestGenau: g.verlauf ? g.verlauf[0] : null, iter: g.iter, eigeneAbleitung: g.eigeneAbleitung, schritte: g.schritte,
      sekunden: g.sekunden, grund: g.grund, stabilGenau: null });
  }
  takt(n, offen1.length, "verfeinert");
}, { zeitlimit: LIMIT });
speichern();

/* ── 2 · Stabilität ── */
let offen2 = [];
if (MITSTAB) {
  offen2 = auswahl.filter(({ f, i }) => { const r = zeilen.get(i); return r && r.urteil === "belegt" && f.stabil !== false && !r.stabilGenau; });
  sag(`Stabilität in erhöhter Genauigkeit: ${offen2.length} Bahnen (belegt, in double stabil oder offen), Zeitlimit ${3 * LIMIT / 1000} s`);
  await schwarm.alle(offen2.map(({ i }) => { const r = zeilen.get(i); return { art: "stabilGenau", ebene, m: mText, a: r.a, b: r.b, T: r.T, opt: { stellen: STELLEN, schnell: !GRUENDLICH } }; }), (g, k, n) => {
    const r = zeilen.get(offen2[k].i);
    r.stabilGenau = g.fehler ? { urteil: g.zeitlimit ? "zeitlimit" : "ausnahme", fehler: g.fehler.slice(0, 200) }
      : g.ok ? { urteil: g.urteil, stufe: g.stufe, s1: g.s1, s2: g.s2, s1Text: g.s1Text, s2Text: g.s2Text, sIm: g.sIm, rand: g.rand, unterschied: g.unterschied, schritte: g.schritte, sekunden: g.sekunden }
      : { urteil: "abbruch" };
    takt(n, offen2.length, "Stabilität");
  }, { zeitlimit: 3 * LIMIT });
}
await schwarm.ende();
speichern();

/* ── Bericht ── */
const liste = auswahl.map(({ f, i }) => ({ f, r: zeilen.get(i) })).filter(x => x.r);
const zahl = u => liste.filter(x => x.r.urteil === u).length;
const stG = liste.filter(x => x.r.stabilGenau && x.r.stabilGenau.urteil), zahlS = u => stG.filter(x => x.r.stabilGenau.urteil === u).length;
const L = [];
L.push("", `## Nachprüfung in erhöhter Genauigkeit (${new Date().toISOString().slice(0, 16).replace("T", " ")} UTC)`, "");
L.push(`${liste.length} Funde (${welche}), Festkomma mit 320 Bit, Taylorreihe der Ordnung 40, Ziel ${STELLEN} Stellen; Gegenprobe mit 448 Bit und Ordnung 52. Rechenzeit zusammen ${((rechenzeit + (Date.now() - t0) / 1000) / 60).toFixed(0)} min auf ${schwarm.faeden} Fäden.`, "");
L.push("| Urteil | Bahnen |", "|---|---|", `| belegt (Rest unter 1e-${STELLEN}, beide Rechnungen einig, Korrektur unter 1e-5) | **${zahl("belegt")}** |`,
  `| belegt, aber verschoben | ${zahl("belegt, aber verschoben")} |`, `| offen (Newton kam nicht unter 1e-${STELLEN}) | ${zahl("offen")} |`, `| Zeitlimit | ${zahl("zeitlimit")} |`, `| Ausnahmen | ${zahl("ausnahme")} |`, "");
if (stG.length) L.push(`Stabilität in erhöhter Genauigkeit (${stG.length} Bahnen): stabil **${zahlS("stabil")}**, an der Grenze ${zahlS("an der Grenze")}, instabil ${zahlS("instabil")}, Zeitlimit ${zahlS("zeitlimit")}, abgebrochen ${zahlS("abbruch") + zahlS("ausnahme")}.`, "");
L.push("| a | b | T | Rest | Rest (448 Bit) | Korrektur gegen double | Rest in double | wahrer Rest dort | Schritte | s | Stabilität (double) | Stabilität (genau) | Abstand zur Grenze | Listen | Urteil |", "|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|");
const listen = f => (f.bekannt ? (f.katalog.stufe === "ort" || f.katalog.stufe === "lage" ? f.katalog.stufe + ": " + (f.katalog.rufname || f.katalog.name) : "Hristov") : "in keiner");
for (const { f, r } of liste) {
  if (!r.a) { L.push(`| ${f.a.toFixed(12)} | ${f.b.toFixed(12)} | ${f.T.toFixed(8)} | | | | ${z(f.rest)} | | | | | | | ${listen(f)} | ${r.urteil}${r.fehler ? ": " + r.fehler : ""} |`); continue; }
  const sg = r.stabilGenau;
  L.push(`| ${r.a.slice(0, 24)} | ${r.b.slice(0, 24)} | ${r.T.slice(0, 22)} | ${z(r.rest)} | ${z(r.restAndereGenauigkeit)} | ${z(r.korrektur)} | ${z(r.restDouble)} | ${z(r.ersterRestGenau)} | ${r.schritte} | ${r.sekunden.toFixed(0)} | ${f.stabil === true ? "stabil" : f.stabil === false ? "instabil" : "offen"} | ${sg ? sg.urteil : "—"} | ${sg && sg.rand !== undefined ? z(sg.rand) : "—"} | ${listen(f)} | ${r.urteil} |`);
}
const md = join(ordner, lauf + ".md");
writeFileSync(md, readFileSync(md, "utf8").replace(/\n+## Nachprüfung in erhöhter Genauigkeit[\s\S]*$/, "\n") + L.join("\n") + "\n");

const schlimm = zahl("ausnahme");
console.log(`${lauf}: ${liste.length} nachgeprüft — belegt ${zahl("belegt")}, verschoben ${zahl("belegt, aber verschoben")}, offen ${zahl("offen")}, Zeitlimit ${zahl("zeitlimit")}, Ausnahmen ${schlimm}` +
  (stG.length ? `; Stabilität genau: stabil ${zahlS("stabil")}, an der Grenze ${zahlS("an der Grenze")}, instabil ${zahlS("instabil")}, Zeitlimit ${zahlS("zeitlimit")}` : ""));
process.exit(schlimm ? 1 : 0);
