// dreikoerper/werkzeug/listen-ueber-massen.mjs — wie viele der Listenfamilien sind dieselbe
// Topologie bei verschiedenen Massen? (06.11.2026)
//
//   node werkzeug/listen-ueber-massen.mjs
//
// Li, Jing & Liao (2018) führen ihre Bahnen je Masse m3 getrennt, mit eigener Zählung
// (I.A-1, I.A-2 … bei jeder Masse neu). Unsere 1/1/4-Bahn ist die Fortsetzung von I.A-5
// bei 1/1/2 — also könnten viele „Familien“ der Liste dieselbe Familie bei einer anderen
// Masse sein. Hier nur die notwendige Bedingung: das massenfreie Wort (K.kennung, alle
// Vertauschungen der Körper, Drehung, Zeitumkehr; geeicht 2047 von 2048) je Listenbahn,
// und wie viele Wörter bei mehreren Massen vorkommen. Ob zwei Einträge wirklich durch
// Fortsetzung in m3 verbunden sind, sagt erst massen-fortsetzung.mjs.
// Ergebnis nach ergebnisse/listen-ueber-massen.json.

import { writeFileSync } from "node:fs";
import { join } from "node:path";
import { HIER, ladeKern, ladeKatalog } from "../quellen.mjs";

const K = ladeKern(), KAT = ladeKatalog(), u0 = new Float64Array(12);
const t0 = Date.now(), je = new Map();   // kennung → [{name, m3, satz, Ts}]
let ohne = 0;
for (const k of KAT.bahnen.filter(b => b.ebene === "euler" || b.ebene === undefined)) {
  if (!k.m || !Number.isFinite(k.a)) continue;
  K.EBENEN.euler.anfang(k.a, k.b, k.m, u0);
  const dg = K.durchgaenge(u0, k.m, k.T, 1e-11);
  if (!dg.folge || !dg.folge.length) { ohne++; continue; }
  const ken = K.kennung(dg.folge, null);
  if (!je.has(ken)) je.set(ken, []);
  je.get(ken).push({ name: k.name, m3: k.m[2], satz: k.satz, Ts: k.Ts });
}
const woerter = [...je.entries()].map(([kennung, e]) => ({ kennung, massen: [...new Set(e.map(x => x.m3))].sort((a, b) => a - b), eintraege: e }));
const mehr = woerter.filter(w => w.massen.length >= 2), ungl = woerter.filter(w => w.eintraege.some(x => x.satz === "ungleich"));
const eintraegeUngl = woerter.reduce((s, w) => s + w.eintraege.filter(x => x.satz === "ungleich").length, 0);
const verteilung = {}; for (const w of woerter) verteilung[w.massen.length] = (verteilung[w.massen.length] || 0) + 1;
console.log(`${woerter.reduce((s, w) => s + w.eintraege.length, 0)} Listenbahnen der Euler-Ebene, ${ohne} ohne Folge, ${((Date.now() - t0) / 1000).toFixed(0)} s`);
console.log(`verschiedene massenfreie Wörter: ${woerter.length}; davon bei ungleichen Massen: ${ungl.length} (aus ${eintraegeUngl} Einträgen)`);
console.log(`Wörter bei mehreren Massen: ${mehr.length}, mit zusammen ${mehr.reduce((s, w) => s + w.eintraege.length, 0)} Einträgen`);
console.log("Anzahl Massen je Wort:", JSON.stringify(verteilung));
const beispiele = mehr.sort((x, y) => y.massen.length - x.massen.length).slice(0, 6);
for (const w of beispiele) console.log(`  ${w.kennung}: ${w.eintraege.map(x => x.name + "@" + x.m3).join(", ")}`);
writeFileSync(join(HIER, "ergebnisse", "listen-ueber-massen.json"), JSON.stringify({ erzeugt: new Date().toISOString(), woerter: woerter.length, ungleich: ungl.length, eintraegeUngleich: eintraegeUngl, mehrereMassen: mehr.length, verteilung, liste: woerter }, null, 1));
