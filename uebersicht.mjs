// dreikoerper/uebersicht.mjs — fasst alle Läufe in ergebnisse\ zusammen.
//
//   node uebersicht.mjs
//
// Schreibt
//   ergebnisse/UEBERSICHT.md   eine Zeile je Lauf, dazu die Summe
//   ergebnisse/FUNDE.md        die Bahnen, die in keiner Liste stehen UND in
//                              erhöhter Genauigkeit belegt sind, mit 30 Stellen
//   ergebnisse/funde.json      dieselben, maschinenlesbar
//
// Nichts wird hier gerechnet oder bewertet; es ist eine Abschrift der
// Laufberichte. Was dort nicht steht, steht auch hier nicht.

import { readdirSync, readFileSync, writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { HIER, ladeKern, ladeKatalog } from "./quellen.mjs";

const K = ladeKern();
const ordner = join(HIER, "ergebnisse");
const z = x => (typeof x !== "number" || !Number.isFinite(x) ? "—" : x === 0 ? "0" : Math.abs(x) < 1e-3 || Math.abs(x) >= 1e5 ? x.toExponential(1) : x.toPrecision(4));
const laeufe = readdirSync(ordner).filter(n => n.endsWith(".json") && !n.endsWith("-genau.json") && !n.startsWith("katalogabgleich") && n !== "funde.json")
  .map(n => JSON.parse(readFileSync(join(ordner, n), "utf8"))).filter(b => b.lauf && b.funde).sort((x, y) => x.datum.localeCompare(y.datum));

const L = ["# Übersicht der Suchläufe", "", `Erzeugt von \`uebersicht.mjs\` am ${new Date().toISOString().slice(0, 10)} aus den Berichten in diesem Ordner.`, "",
  "| Lauf | Ebene | Massen | Suche | Raster | Perioden | Bahnen | bestätigt | über Umkehrpunkt | sicher stabil | in einer Liste | in keiner Liste | davon auf 30 Stellen belegt |", "|---|---|---|---|---|---|---|---|---|---|---|---|---|"];
const alle = [];
for (const b of laeufe) {
  const P = b.parameter, gp = join(ordner, b.lauf + "-genau.json");
  const genau = existsSync(gp) ? JSON.parse(readFileSync(gp, "utf8")) : null;
  const un = b.funde.filter(f => !f.bekannt);
  let belegt = "nicht nachgeprüft";
  if (genau) {
    // Zuordnung über den Ort, nicht über die Nummer: nachbereiten.mjs kann
    // die Reihenfolge der Funde ändern, die Nachprüfung gehört zur Bahn.
    const ort = (a, b) => Math.round(Math.abs(a) * 1e9) + ":" + Math.round(Math.abs(b) * 1e9);
    const nachOrt = new Map(genau.geprueft.filter(r => r.start).map(r => [ort(r.start[0], r.start[1]), r]));
    let n = 0;
    b.funde.forEach((f) => {
      const r = nachOrt.get(ort(f.a, f.b));
      if (!r) return;
      f.genau = r;
      if (!f.bekannt && r.urteil === "belegt") { n++; alle.push({ lauf: b.lauf, ebene: P.ebene, m: P.m, f, r }); }
    });
    belegt = `${n} von ${un.filter((f) => f.genau).length} geprüften`;
  }
  L.push(`| [${b.lauf}](${b.lauf}.md) | ${K.EBENEN[P.ebene].name} | ${P.m.join(" / ")} | ${P.art === "halb" ? "Umkehrpunkte" : "Wiederkehr"} | ${P.raster}² | ${P.tmin ? P.tmin + "–" : "bis "}${P.tmax} | ${b.funde.length}${b.bahnen && b.bahnen.verschieden < b.funde.length ? " Orte, " + b.bahnen.verschieden + " Bahnen" : ""} | ${b.funde.filter(f => f.urteil === "bestätigt").length} | ${b.funde.filter(f => f.urteil === "über den Umkehrpunkt").length} | ${b.funde.filter(f => f.stabil === true).length} | ${b.funde.length - un.length} | ${un.length}${b.bahnen && b.bahnen.unbekannteVerschieden < un.length ? " Orte, " + b.bahnen.unbekannteVerschieden + " Bahnen" : ""} | ${belegt} |`);
}
L.push("", "**bestätigt**: der volle Umlauf schließt sich in doppelter Genauigkeit, mit zwei unabhängigen Verfahren (Rest unter 1e-10, Gegenprobe unter 1e-8).",
  "**über Umkehrpunkt**: nach der halben Periode steht die Bahn auf 1e-11 in einer Fixmenge der umkehrenden Symmetrien; der volle Umlauf ist für double zu empfindlich.",
  "**in einer Liste**: Li/Liao 2017–2019, Šuvakov/Dmitrašinović 2013, bei gleichen Massen dazu die Datenbanken von Hristov u. a. (441 985 Anfangswerte in der Euler-Ebene, 29 442 im freien Fall).",
  "**auf 30 Stellen belegt**: `nachpruefen.mjs` — Newton in 320-Bit-Festkomma bis Rest unter 1e-30, derselbe Rest noch einmal mit 448 Bit.", "");
writeFileSync(join(ordner, "UEBERSICHT.md"), L.join("\n"));

// Dieselbe Bahn kann in mehreren Läufen auftauchen, und innerhalb eines Laufs
// an mehreren Stellen der Ebene (im freien Fall hat jede Bahn zwei
// Ruhepunkte): einmal führen. Gleicher Ort ODER gleiche skalierte Periode T*
// aus den 30-stelligen Werten (Schwelle 1e-9; gemessen liegen echte Paare
// unter 1e-12 und fremde Bahnen über 7e-8 auseinander, werkzeug/doppelte-ts.mjs).
const uu = new Float64Array(12);
for (const e of alle) { K.EBENEN[e.ebene].anfang(+e.r.a, +e.r.b, e.m, uu); e.Ts = +e.r.T * Math.pow(Math.abs(K.energie(uu, e.m)), 1.5); e.weitere = []; }
alle.sort((x, y) => x.f.T - y.f.T);
const einmal = [];
for (const e of alle) {
  const gleicheM = q => q.ebene === e.ebene && q.m.join() === e.m.join();
  if (einmal.some(q => gleicheM(q) && Math.abs(Math.abs(q.f.a) - Math.abs(e.f.a)) < 1e-6 && Math.abs(Math.abs(q.f.b) - Math.abs(e.f.b)) < 1e-6)) continue;   // derselbe Ort aus einem zweiten Lauf
  // dieselbe Bahn, andere Lage — auch über die Ebenen hinweg: eine Bahn mit
  // Ruhepunkt UND Euler-Aufstellung steht in beiden (drei solche am 02.10.2026)
  const bahn = einmal.find(q => q.m.join() === e.m.join() && Math.abs(q.Ts / e.Ts - 1) < 1e-9);
  if (bahn) { bahn.weitere.push(e); continue; }
  einmal.push(e);
}
// Gleiche und ungleiche Massen getrennt zählen: nur für gleiche Massen gibt es
// die großen Listen. Für ungleiche bleibt Li/Liao, je Klasse eine Bahn — dort
// sagt „in keiner Liste" wenig, und die Zahl darf nicht in dieselbe Summe.
const gleicheMassen = e => e.m.every(x => x === e.m[0]);
const nGleich = einmal.filter(gleicheMassen).length, nUngleich = einmal.length - nGleich;
const katalogListe = ladeKatalog().bahnen;
const ungleichSaetze = [...new Set(einmal.filter(e => !gleicheMassen(e)).map(e => e.m.join("/")))];
// Was „belegt“ hier umfasst: bei manchen Läufen nur die Kandidaten für Stabilität
// (nachpruefen.mjs --kandidaten). Die Zahl der Funde außerhalb der Liste steht daneben.
const deckung = laeufe.filter(b => !b.parameter.m.every(x => x === b.parameter.m[0]) && b.bahnen).map(b => {
  const s = b.parameter.m.join("/"), belegt = einmal.filter(e => e.m.join("/") === s).length;
  return `${s.replace(/\./g, ",")}: ${belegt} von ${b.bahnen.unbekannteVerschieden}`;
});
const F = ["# Funde außerhalb der Listen", "",
  `Erzeugt von \`uebersicht.mjs\` am ${new Date().toISOString().slice(0, 10)}.`, "",
  `**Gleiche Massen: ${nGleich} periodische Bahnen**, die in keiner der geprüften Listen stehen und in erhöhter Genauigkeit belegt sind. Geprüft gegen Li und Liao 2017–2019, Šuvakov und Dmitrašinović 2013 und die Datenbanken von Hristov u. a. (441 985 Anfangswerte in der Euler-Ebene, 29 442 im freien Fall; \`quelle/hristov/LIESMICH.md\`).`, "",
  ...(nUngleich ? [`**Ungleiche Massen: ${nUngleich} Bahnen**, belegt — aber hier gibt es als Vergleich nur Li und Liao (${ungleichSaetze.map(s => `für ${s}: ${katalogListe.filter(k => k.m.join("/") === s).length} Bahnen`).join("; ")}), und die führen je Klasse eine einzige Bahn. Der Atlas threebodyorbits.com und die beiden großen Dateien von Li/Liao (135 445 Bahnen von 2021, 65 045 von 2022) kennen für diese Massen nichts anderes (\`quelle/WEITERE-LISTEN.md\`, geprüft am 02.10.2026). „In keiner Liste“ heißt bei ungleichen Massen deshalb wenig; diese Zahl gehört nicht in dieselbe Summe wie die obere. **Nachgerechnet ist nicht alles:** bei 1/1/2 jeder Fund außerhalb der Liste, bei den übrigen Gewichten nur die Kandidaten für Stabilität (in double stabil, oder offen mit beiden Indizes unter 30). Auf 30 Stellen belegt von den Bahnen außerhalb der Liste — ${deckung.join("; ")}. Die übrigen sind gefunden und in double geprüft und stehen nur in den Laufberichten.`, ""] : []),
  "Das ist keine Behauptung, sie seien neu. Verglichen wird der Ort in der Ebene (Schwelle 1e-6) und die skalierte Periode T* (acht Stellen).",
  "", `**Satelliten:** ${einmal.filter(e => e.f.satellit).length} dieser Bahnen laufen mehrmals fast den Weg einer anderen, bevor sie sich schließen (Wort das k-fache, T* das k-fache); bei ${einmal.filter(e => e.f.satellit && e.f.satellit.grundBekannt).length} ist die Grundbahn gelistet. Eigene Bahnen, aber keine unerklärten. Spalte „Satellit von“.`,
  "", "Belegt heißt: Newton in 320-Bit-Festkomma bringt den Wiederkehrabstand unter 1e-30; eine zweite Rechnung mit 448 Bit und höherer Ordnung findet denselben Rest; die Korrektur gegenüber dem double-Wert liegt unter 1e-5.", ""];
// Zuerst das, wonach gesucht wird (Felix, 02.10.2026): außerhalb der Listen
// UND stabil — oder so nah an der Grenze, dass es auch 30 Stellen nicht
// entscheiden. Alles Übrige in den Tabellen darunter ist instabil.
// „stabil um Haaresbreite": ein Index liegt weniger als 0,001 unter der Grenze 2;
// „an der Grenze" heißt seit 03.10.2026, was es ist: ein Index exakt 2 (auf 26 Stellen).
const randVon = g => (g && Number.isFinite(g.s1) ? 2 - Math.max(Math.abs(g.s1), Math.abs(g.s2)) : NaN);
const urteilVon = ({ f, r }) => (r.stabilGenau ? (r.stabilGenau.urteil === "stabil" && randVon(r.stabilGenau) < 1e-3 ? "stabil um Haaresbreite" : r.stabilGenau.urteil === "an der Grenze" ? "Index exakt 2" : r.stabilGenau.urteil) + " (30 Stellen)" : f.stabil === true ? "stabil (nur double)" : f.stabil === false ? "instabil" : "offen (nur double)");
const kandidaten = einmal.filter(e => (e.r.stabilGenau ? e.r.stabilGenau.urteil !== "instabil" : e.f.stabil !== false));
F.push(`## Zuerst: stabil, um Haaresbreite stabil, oder ein Index exakt 2 (${kandidaten.length})`, "",
  kandidaten.length ? "Die Bahnen außerhalb der Listen, die linear stabil sind oder bei denen es nicht entschieden ist. „Um Haaresbreite“: ein Index liegt weniger als 0,001 unter der Grenze 2. „Index exakt 2“: auf 26 Stellen — warum das so oft vorkommt, ist nicht geklärt (AUFGABEN, offen Punkt 6). Ein Satellit ist eine eigene Bahn, aber keine unerklärte: er läuft mehrmals fast den Weg der genannten Bahn."
    : "Keine. Alle Bahnen außerhalb der Listen sind instabil.", "");
if (kandidaten.length) {
  F.push("| Ebene | Massen | Anfangswert 1 | Anfangswert 2 | T | T* | Urteil | Stabilitätsindizes | Satellit von | Lauf |", "|---|---|---|---|---|---|---|---|---|---|");
  const rang = e => (/^stabil/.test(urteilVon(e)) ? 0 : 1);
  for (const e of kandidaten.slice().sort((x, y) => x.m.join().localeCompare(y.m.join()) || rang(x) - rang(y) || x.f.T - y.f.T)) {
    const g = e.r.stabilGenau;
    F.push(`| ${K.EBENEN[e.ebene].name} | ${e.m.join(" / ")} | ${e.r.a.slice(0, 18)} | ${e.r.b.slice(0, 18)} | ${(+e.r.T).toFixed(8)} | ${e.f.Ts.toFixed(5)} | ${urteilVon(e)} | ${g && Number.isFinite(g.s1) ? g.s1.toFixed(6) + " und " + g.s2.toFixed(6) : "—"} | ${e.f.satellit ? `${e.f.satellit.von}, ${e.f.satellit.ordnung}. Ordnung` : "—"} | ${e.lauf} |`);
  }
  F.push("");
}
const gruppen = new Map();
for (const e of einmal) { const k = e.ebene + "|" + e.m.join("/"); if (!gruppen.has(k)) gruppen.set(k, []); gruppen.get(k).push(e); }
for (const [k, liste] of gruppen) {
  const [eb, m] = k.split("|"), E = K.EBENEN[eb];
  F.push(`## ${E.name}, Massen ${m} (${liste.length})`, "", `| ${E.achseA} | ${E.achseB} | T | T* | Rest | Stabilität | \\|λ\\| | engste Begegnung | Wortlänge | Umkehrpunkt | Satellit von | weitere Lage derselben Bahn | Lauf |`, "|---|---|---|---|---|---|---|---|---|---|---|---|---|");
  for (const { f, r, lauf, weitere } of liste) {
    const st = r.stabilGenau ? r.stabilGenau.urteil + " (genau)" : f.stabil === true ? "stabil" : f.stabil === false ? "instabil" : "offen";
    const lagen = weitere.length ? weitere.map(w => `${w.ebene !== eb ? K.EBENEN[w.ebene].name + ": " : ""}(${(+w.r.a).toFixed(8)}, ${(+w.r.b).toFixed(8)}), T ${(+w.r.T).toFixed(6)}`).join("; ") : "—";
    F.push(`| ${r.a.slice(0, 33)} | ${r.b.slice(0, 33)} | ${r.T.slice(0, 31)} | ${f.Ts.toFixed(5)} | ${z(r.rest)} | ${st} | ${z(f.lambda)} | ${z(f.rMin)} | ${f.wort.length} | ${f.halb ? f.halb.ziel : "—"} | ${f.satellit ? `${f.satellit.von}, ${f.satellit.ordnung}. Ordnung (T* × ${f.satellit.verhaeltnis.toFixed(5)})` : "—"} | ${lagen} | ${lauf} |`);
  }
  F.push("");
}
writeFileSync(join(ordner, "FUNDE.md"), F.join("\n"));
writeFileSync(join(ordner, "funde.json"), JSON.stringify({ erzeugt: new Date().toISOString(), anzahl: einmal.length,
  bahnen: einmal.map(({ f, r, lauf, ebene, m, weitere }) => ({ ebene, m, a: r.a, b: r.b, T: r.T, Ts: f.Ts, rest: r.rest, restAndereGenauigkeit: r.restAndereGenauigkeit, stabil: f.stabil, stabilGenau: r.stabilGenau || null,
    lambda: f.lambda, rMin: f.rMin, wort: f.wort, folge: f.folge, kennung: f.kennung, halb: f.halb, satellit: f.satellit || null, lauf,
    weitereLagen: weitere.map(w => ({ ebene: w.ebene, a: w.r.a, b: w.r.b, T: w.r.T, lauf: w.lauf })) })) }, null, 1));
console.log(`${laeufe.length} Läufe; außerhalb der Listen und belegt: ${nGleich} Bahnen bei gleichen Massen` + (nUngleich ? `, ${nUngleich} bei ungleichen (nur gegen Li/Liao geprüft)` : "") + ` → ergebnisse/UEBERSICHT.md, FUNDE.md, funde.json`);
