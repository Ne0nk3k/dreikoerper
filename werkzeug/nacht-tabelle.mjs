// dreikoerper/werkzeug/nacht-tabelle.mjs — die Läufe bei ungleichen Massen in
// einer Tabelle, aus den Ergebnisdateien abgeschrieben.
//
//   node werkzeug/nacht-tabelle.mjs [lauf …]      (ohne Namen: alle Läufe mit ungleichen Massen)
//
// Je Lauf: Orte, Bahnen, Wiederfinden der Liste, Bahnen außerhalb der Liste,
// Kandidaten für Stabilität und deren Urteil auf 30 Stellen, Satelliten, und
// was werkzeug/grauzone.mjs geklärt hat. Darunter die stabilen und die an der
// Grenze, einzeln. Nichts wird gerechnet.

import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join } from "node:path";
import { HIER } from "../quellen.mjs";

const ordner = join(HIER, "ergebnisse");
const namen = process.argv.slice(2).length ? process.argv.slice(2)
  : readdirSync(ordner).filter(n => n.endsWith(".json") && !/-genau\.json$|-grauzone\.json$|^katalogabgleich|^funde\.json$/.test(n)).map(n => n.slice(0, -5));
const ort = (a, b) => Math.round(Math.abs(a) * 1e9) + ":" + Math.round(Math.abs(b) * 1e9);
const kand = f => !f.weitereLage && (f.stabil === true || (f.stabil === null && Number.isFinite(f.s1) && Number.isFinite(f.s2) && Math.max(Math.abs(f.s1), Math.abs(f.s2)) < 30));
const dez = (x, n) => x.toFixed(n).replace(".", ",");
const zeilen = [], einzeln = [];
for (const name of namen) {
  const p = join(ordner, name + ".json"); if (!existsSync(p)) continue;
  const B = JSON.parse(readFileSync(p, "utf8")); if (!B.funde || B.parameter.m.every(x => x === 1)) continue;
  const P = B.parameter, gp = join(ordner, name + "-genau.json"), zp = join(ordner, name + "-grauzone.json");
  const genau = existsSync(gp) ? new Map(JSON.parse(readFileSync(gp, "utf8")).geprueft.filter(r => r.start).map(r => [ort(r.start[0], r.start[1]), r])) : new Map();
  const grau = existsSync(zp) ? JSON.parse(readFileSync(zp, "utf8")).faelle : null;
  const dieselbe = new Set((grau || []).filter(x => x.urteil === "DIESELBE BAHN").map(x => ort(x.a, x.b)));
  const un = B.funde.filter(f => !f.bekannt && !f.weitereLage && !dieselbe.has(ort(f.a, f.b)));
  const K = un.filter(kand), z = { stabil: 0, "an der Grenze": 0, instabil: 0, offen: 0 };
  for (const f of K) {
    const r = genau.get(ort(f.a, f.b)), u = r && r.stabilGenau ? r.stabilGenau.urteil : "offen"; z[u]++;
    if (u === "stabil" || u === "an der Grenze") einzeln.push({ name, m: P.m, f, r, u });
  }
  const belegt = un.filter(f => { const r = genau.get(ort(f.a, f.b)); return r && r.urteil === "belegt"; }).length;
  zeilen.push(`| \`${name}\` | ${P.m.join(" / ").replace(/\./g, ",")} | ${P.sicht[0]}…${P.sicht[1]} × ${P.sicht[2]}…${P.sicht[3]} | ${B.bahnen.orte} / ${B.bahnen.verschieden} | ${B.wiederfinden.gefunden} von ${B.wiederfinden.soll} | ${un.length} | ${belegt} | ${K.length} | ${z.stabil} / ${z["an der Grenze"]} / ${z.instabil}${z.offen ? " / " + z.offen + " ungerechnet" : ""} | ${grau ? `${grau.length} geprüft, ${dieselbe.size} dieselbe Bahn` : "—"} | ${Math.round((B.zeiten.karte + B.zeiten.pruefkette) / 60)} min |`);
}
console.log("| Lauf | Massen | Fenster v₁ × v₂ | Orte / Bahnen | Listenbahnen im Fenster (T ≤ 40) wiedergefunden | Bahnen nicht bei Li/Liao 2018 | davon auf 30 Stellen belegt | Kandidaten für Stabilität | stabil / an der Grenze / instabil (30 Stellen) | Grenzfälle neben einer Listenbahn | Suchzeit |");
console.log("|---|---|---|---|---|---|---|---|---|---|---|");
for (const z of zeilen) console.log(z);
console.log("\n| Massen | v₁ | v₂ | T | T* | Urteil | Stabilitätsindizes | Abstand zur Grenze | engste Begegnung | Wortlänge | Verwandtschaft |");
console.log("|---|---|---|---|---|---|---|---|---|---|---|");
einzeln.sort((x, y) => x.m.join().localeCompare(y.m.join()) || (x.u === y.u ? x.f.T - y.f.T : x.u === "stabil" ? -1 : 1));
for (const { m, f, r, u } of einzeln) {
  const g = r.stabilGenau, rand = 2 - Math.max(Math.abs(g.s1), Math.abs(g.s2));
  const verw = f.satellit ? `Satellit ${f.satellit.ordnung}. Ordnung von ${f.satellit.von}` : f.katalog && f.katalog.stufe === "klasse" ? `Klasse von ${f.katalog.name}, anderes T*` : "keine gelistete Klasse";
  console.log(`| ${m.join(" / ").replace(/\./g, ",")} | ${String(r.a).slice(0, 14).replace(".", ",")} | ${String(r.b).slice(0, 14).replace(".", ",")} | ${dez(+r.T, 6)} | ${dez(f.Ts, 3)} | ${u} | ${dez(g.s1, 6)} und ${dez(g.s2, 6)} | ${rand > 1e-4 ? dez(rand, 4) : rand.toExponential(1).replace(".", ",")} | ${f.rMin < 1e-3 ? f.rMin.toExponential(1).replace(".", ",") : dez(f.rMin, 4)} | ${f.wort.length} | ${verw} |`);
}
