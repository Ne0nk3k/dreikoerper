// dreikoerper/werkzeug/liste-auswerten.mjs — was die Listenfortsetzung ergeben hat (06.11.2026)
//
//   node werkzeug/liste-auswerten.mjs
//
// Liest ergebnisse/listenfortsetzung/<datei>.json (Fortsetzung in double) und <datei>-genau.json
// (30 Stellen) und schreibt ergebnisse/listenfortsetzung-auswertung.json und …-auswertung.md.
//
// Je Startfamilie: Reichweite in m3 und Abbruchgründe, Treffer an Listenmassen (Stufe „ort“ =
// dieselbe Bahn wie ein Listeneintrag), stabile Abschnitte in double, Urteile auf 30 Stellen.
// Familien, die einander auf den Ort treffen, werden zu einer Gruppe zusammengefasst.
// „Stabil und in keiner Liste“ heißt: auf 30 Stellen stabil bei einer Masse m3, für die es
// entweder keine Liste gibt (alle außer 0,5 0,75 1 2 4 5 8 10) oder deren Liste die Bahn
// nicht führt (Abgleich der Fortsetzung an dieser Masse: Stufe „keine“). Die Startmasse
// selbst zählt nicht — dort ist die Bahn ja gelistet.

import { readFileSync, writeFileSync, readdirSync, existsSync } from "node:fs";
import { join } from "node:path";
import { HIER } from "../quellen.mjs";
import { schreibeSicher } from "./sicher.mjs";

// DREIKOERPER_ERGEBNISSE: anderer Ergebnisordner, wie im Prüfskript (13.11.2026: pruefe-pruefer.mjs
// wertet seine Kopie selbst aus, damit sie auch während einer laufenden Rechnung in sich stimmt);
// ohne Angabe der echte Ordner
const E = process.env.DREIKOERPER_ERGEBNISSE || join(HIER, "ergebnisse");
const ORDNER = join(E, "listenfortsetzung");
const LISTENMASSEN = [0.5, 0.75, 1, 2, 4, 5, 8, 10];
const lies = p => { try { return JSON.parse(readFileSync(p, "utf8")); } catch { return null; } };
const dateien = existsSync(ORDNER) ? readdirSync(ORDNER).filter(n => n.endsWith(".json") && !n.endsWith("-genau.json")) : [];
const familien = [];
for (const n of dateien) {
  const R = lies(join(ORDNER, n)); if (!R || !R.richtungen) continue;
  const fertig = R.richtungen.aufwaerts && R.richtungen.aufwaerts.grund !== "läuft";
  if (!fertig) continue;
  const G = lies(join(ORDNER, n.replace(/\.json$/, "-genau.json")));
  const P = [...R.richtungen.abwaerts.punkte, ...R.richtungen.aufwaerts.punkte].sort((x, y) => x.m3 - y.m3);
  // stabile Abschnitte in double
  const abschnitte = []; let a = null;
  for (const q of P) { if (q.stabil === true) { if (!a) a = { von: q.m3, bis: q.m3, n: 0 }; a.bis = q.m3; a.n++; } else if (a) { abschnitte.push(a); a = null; } }
  if (a) abschnitte.push(a);
  // hristov: bei m3 = 1 führt auch die Liste aus Sofia die Bahn (12.11.2026: bis dahin galt dort nur
  // der Abgleich mit Li & Liao — eine stabile Probe bei 1, die nur Sofia führt, hätte als neu gezählt)
  const treffer = (R.listen || []).filter(l => l.liliao).map(l => ({ m3: l.m3, stufe: l.liliao.stufe, naechster: l.liliao.naechster, listeBahnen: l.liliao.listeBahnen,
    hristov: !!(l.hristov && (l.hristov.mitTs || (l.hristov.naechsterOrt && l.hristov.naechsterOrt.abstand < 1e-6))) }));
  const genau = G ? G.punkte : [];
  const neuStabil = genau.filter(g => g.ok && g.urteil === "stabil" && Math.abs(g.m3 - R.start.m3) > 1e-9).filter(g => {
    const t = treffer.find(l => Math.abs(l.m3 - g.m3) < 1e-9);
    return !LISTENMASSEN.some(m => Math.abs(m - g.m3) < 1e-9) || (t && t.stufe === "keine" && !(Math.abs(g.m3 - 1) < 1e-9 && t.hristov));
  });
  familien.push({ datei: n.slice(0, -5), start: R.start, von: R.richtungen.abwaerts.bis, bis: R.richtungen.aufwaerts.bis,
    gruende: [R.richtungen.abwaerts.grund, R.richtungen.aufwaerts.grund], punkte: P.length,
    kennung: (P.find(q => q.kennung) || {}).kennung, kennungWechsel: (R.ereignisse || []).filter(e => e.art === "Kennung wechselt").length,
    rMin: P.length ? Math.min(...P.map(q => q.rMin).filter(Number.isFinite)) : NaN,
    abschnitte, treffer, genau: genau.map(g => ({ m3: g.m3, ok: g.ok, urteil: g.urteil, s1: g.s1, s2: g.s2, komplex: g.komplex, rand: g.rand, grund: g.grund })),
    neuStabil: neuStabil.map(g => ({ m3: g.m3, s1: g.s1, s2: g.s2, rand: g.rand, a: g.a, b: g.b, T: g.T })) });
}
// Gruppen: wer wen auf den Ort trifft (Name@Masse der Listenbahn ↔ Startfamilie)
const name = f => f.datei;
const eltern = new Map(familien.map(f => [name(f), name(f)]));
const finde = x => { while (eltern.get(x) !== x) x = eltern.get(x); return x; };
const vereine = (x, y) => { if (eltern.has(x) && eltern.has(y)) eltern.set(finde(x), finde(y)); };
const dateiVon = (nm, m3) => `${String(nm).replace(/[^A-Za-z0-9.-]/g, "")}-${m3}`;
// „lage“ zählt mit (20.11.2026, Prüfbericht der zweiten Sitzung, H1): gleiches T* auf acht Stellen heißt im
// Projekt „dieselbe Bahn, an anderer Stelle getroffen“ — wie in pruefe-alles
for (const f of familien) for (const t of f.treffer) if ((t.stufe === "ort" || t.stufe === "lage") && t.naechster) vereine(name(f), dateiVon(t.naechster, t.m3));
const gruppen = new Map();
for (const f of familien) { const g = finde(name(f)); if (!gruppen.has(g)) gruppen.set(g, []); gruppen.get(g).push(f); }

const zahl = { familien: familien.length, gruppen: gruppen.size,
  mitDoubleStabil: familien.filter(f => f.abschnitte.length).length,
  mitGenau: familien.filter(f => f.genau.length).length,
  genauPunkte: familien.reduce((s, f) => s + f.genau.length, 0),   // Einträge, auch gescheiterte
  genauAngenommen: familien.reduce((s, f) => s + f.genau.filter(g => g.ok).length, 0),
  genauStabil: familien.reduce((s, f) => s + f.genau.filter(g => g.ok && g.urteil === "stabil").length, 0),
  familienNeuStabil: familien.filter(f => f.neuStabil.length).length,
  weit: familien.filter(f => f.bis - f.von >= 1).length };
const kandidaten = familien.filter(f => f.neuStabil.length).sort((x, y) => y.neuStabil.length - x.neuStabil.length);
// Familien statt Listeneinträgen (12.11.2026: I.B-1@0.75 und I.B-1@2 sind eine Familie). Was neu ist
// (eigene Veröffentlichungen, Klassen a/b/c) entscheidet allein werkzeug/pruefe-alles.mjs — eine
// Stelle, nicht zwei; der Leitstand liest es von dort.
for (const f of kandidaten) f.gruppe = finde(name(f));
zahl.kandidatenEintraege = kandidaten.length;
zahl.kandidatenFamilien = new Set(kandidaten.map(f => f.gruppe)).size;
schreibeSicher(join(E, "listenfortsetzung-auswertung.json"), JSON.stringify({ erzeugt: new Date().toISOString(), zahl, kandidaten, familien }, null, 1));

const f3 = x => (Number.isFinite(x) ? x.toFixed(3).replace(".", ",") : "–");
const md = [`# Listenfortsetzung — Auswertung, Stand ${new Date().toLocaleString("de-DE")}`, "",
  "| | Anzahl |", "|---|---|",
  `| Familien fortgesetzt | ${zahl.familien} |`, `| Gruppen (einander auf den Ort getroffen) | ${zahl.gruppen} |`,
  `| Reichweite ≥ 1 in m3 | ${zahl.weit} |`, `| mit stabilem Abschnitt in double | ${zahl.mitDoubleStabil} |`,
  `| Proben auf 30 Stellen (Einträge) | ${zahl.genauPunkte}, davon angenommen ${zahl.genauAngenommen}, davon stabil ${zahl.genauStabil} |`,
  `| Familien mit 30-Stellen-stabiler Bahn bei einer Masse ohne Listeneintrag | ${zahl.familienNeuStabil} Listeneinträge = ${zahl.kandidatenFamilien} Familien (was davon neu ist: ergebnisse/pruefung.json) |`, "",
  "## Stabil auf 30 Stellen, in keiner Liste dieser Masse", "",
  "| Startfamilie | gelistet bei | Reichweite m3 | stabil auf 30 Stellen bei m3 | kleinster Rand |", "|---|---|---|---|---|",
  ...kandidaten.map(f => `| ${f.datei} | ${f3(f.start.m3)} | ${f3(f.von)} … ${f3(f.bis)} | ${f.neuStabil.map(g => f3(g.m3)).join(", ")} | ${Math.min(...f.neuStabil.map(g => g.rand)).toExponential(1)} |`), "",
  "## Weit reichende Familien (≥ 1 in m3)", "",
  "| Startfamilie | Reichweite | Treffer an Listenmassen | stabile Abschnitte (double) |", "|---|---|---|---|",
  ...familien.filter(f => f.bis - f.von >= 1).sort((x, y) => (y.bis - y.von) - (x.bis - x.von)).map(f => `| ${f.datei} | ${f3(f.von)} … ${f3(f.bis)} | ${f.treffer.map(t => f3(t.m3) + (t.stufe === "keine" ? " nein" : " " + t.stufe + " " + t.naechster)).join("; ")} | ${f.abschnitte.map(a => f3(a.von) + "–" + f3(a.bis)).join(", ") || "–"} |`), ""];
schreibeSicher(join(E, "listenfortsetzung-auswertung.md"), md.join("\n"));
console.log(JSON.stringify(zahl));
