// dreikoerper/werkzeug/woerter-eichen.mjs — schreiben wir das freie Wort so wie
// Li, Jing & Liao? (04.11.2026, vor der Veröffentlichung von Familie B)
//
//   node werkzeug/woerter-eichen.mjs
//
// konvention-finden.mjs fand bei ungleichen Massen keine Lesart, die alle
// veröffentlichten Wörter trifft (beste 31 von 60, zweitbeste 29). Hier für
// jede der 1349 Bahnen der Liste: unser Wort (KONVENTION des Kerns) gegen das
// veröffentlichte — gleich bis auf Drehung? bis auf Drehung und Zeitumkehr
// (Wort rückwärts gelesen, Groß- und Kleinbuchstaben getauscht)? bis dazu auf
// den Tausch der gleichen Körper 1 und 2 (a ↔ b, A ↔ B)?

import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { HIER, ladeKern, ladeKatalog } from "../quellen.mjs";

const K = ladeKern(), KAT = ladeKatalog(), u0 = new Float64Array(12);
// veröffentlichte Wörter: Zeilen „<th>I.A…<sub…>1</sub> &nbsp;(0.5)</th> <td>BabA</td>“
const html = readFileSync(join(HIER, "quelle", "ungleich.md"), "utf8");
const liste = new Map();
for (const m of html.matchAll(/<th>([IV]+\.[A-D])<sup>.*?<\/sup><sub[^>]*>(\d+)<\/sub>\s*&nbsp;\(([\d.]+)\)<\/th>\s*<td>([aAbB]+)<\/td>/gs))
  liste.set(`${m[1]}-${m[2]}@${+m[3]}`, m[4]);
const dreh = w => K.kleinsteDrehung(w);
const zeit = w => w.split("").reverse().map(c => (c === c.toUpperCase() ? c.toLowerCase() : c.toUpperCase())).join("");
const tausch = w => w.replace(/[aAbB]/g, c => ({ a: "b", b: "a", A: "B", B: "A" })[c]);
let n = 0, gleich = 0, mitZeit = 0, mitTausch = 0, keins = 0, ohne = 0;
const daneben = [], je = [];
// Warum ein Wort nicht passt (04.11.2026: im Text stand für alle drei „nicht
// gekürzte Buchstabenpaare“ — für I.B-33 falsch, dort fehlt ein Buchstabe).
// frei und zyklisch gekürzt (xX und Xx fallen weg, auch über das Wortende hinweg)
const kuerze = w => { const s = []; for (const c of w) { const t = s[s.length - 1]; if (t && t !== c && t.toLowerCase() === c.toLowerCase()) s.pop(); else s.push(c); }
  while (s.length > 1 && s[0] !== s[s.length - 1] && s[0].toLowerCase() === s[s.length - 1].toLowerCase()) { s.shift(); s.pop(); } return s.join(""); };
const lesarten = w => [w, zeit(w), tausch(w), zeit(tausch(w))].map(dreh);
function einordnen(w, unser) {
  if (lesarten(kuerze(w)).includes(dreh(kuerze(unser)))) return "gekuerzt-gleich";
  // die Liste ist unser Wort mit einem gestrichenen Buchstaben (bis auf Drehung und Lesart)?
  const ziel = new Set(lesarten(w));
  for (let i = 0; i < unser.length; i++) if (ziel.has(dreh(unser.slice(0, i) + unser.slice(i + 1)))) return "ein-buchstabe-fehlt-in-der-liste";
  for (let i = 0; i < w.length; i++) if (lesarten(w.slice(0, i) + w.slice(i + 1)).includes(dreh(unser))) return "ein-buchstabe-zuviel-in-der-liste";
  return "unerklaert";
}
for (const k of KAT.bahnen.filter(b => b.satz === "ungleich")) {
  const w = liste.get(`${k.name}@${k.m[2]}`);
  if (!w) { ohne++; continue; }
  K.EBENEN.euler.anfang(k.a, k.b, k.m, u0);
  const dg = K.durchgaenge(u0, k.m, k.T, 1e-11);
  const unser = K.wortAus(dg.folge, dg.richtung);
  n++;
  if (dreh(unser) === dreh(w)) gleich++;
  else if (dreh(unser) === dreh(zeit(w))) mitZeit++;
  else if ([tausch(w), zeit(tausch(w))].some(v => dreh(v) === dreh(unser))) mitTausch++;
  else { keins++; daneben.push(`${k.name} (${k.m[2]}): Liste ${w}, unser ${unser}`); je.push({ name: k.name, m3: k.m[2], liste: w, unser, art: einordnen(w, unser) }); }
}
console.log(`${liste.size} veröffentlichte Wörter gelesen, ${n} mit Bahn im Katalog, ${ohne} Katalogbahnen ohne Wort`);
console.log(`gleich bis auf Drehung: ${gleich}; dazu Zeitumkehr: ${mitZeit}; dazu Tausch 1↔2: ${mitTausch}; gar nicht: ${keins}`);
if (daneben.length) console.log("nicht getroffen, z. B.:\n  " + daneben.join("\n  "));
// Für Texte, die diese Zahl nennen (werkzeug/familie-b-bauen.mjs): aus der Datei, nicht von Hand
writeFileSync(join(HIER, "ergebnisse", "woerter-eichen.json"), JSON.stringify({ erzeugt: new Date().toISOString(),
  veroeffentlicht: liste.size, verglichen: n, gleichBisAufDrehung: gleich, mitZeitumkehr: mitZeit, mitTausch, nicht: keins, daneben,
  einordnung: Object.fromEntries(["gekuerzt-gleich", "ein-buchstabe-fehlt-in-der-liste", "ein-buchstabe-zuviel-in-der-liste", "unerklaert"].map(a => [a, je.filter(x => x.art === a).map(x => x.name)])), je }, null, 1));
for (const x of je) console.log(`  ${x.name} (${x.m3}): ${x.art}`);
// rot nur, wenn eine Abweichung nicht erklärt ist
process.exit(je.some(x => x.art === "unerklaert") ? 1 : 0);
