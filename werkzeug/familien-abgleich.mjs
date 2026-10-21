// dreikoerper/werkzeug/familien-abgleich.mjs — Stufe 1 der Suche nach einer
// unentdeckten Familie (21.10.2026): welche unserer Funde haben ein Wort, das
// in KEINER Liste vorkommt, bei KEINER Masse?
//
//   node werkzeug/familien-abgleich.mjs
//
// Anlass: die stabile Bahn bei 1/1/4 stand in keiner Liste dieser Massen und
// ist doch die Fortsetzung von I.A-5 bei 1/1/2 (werkzeug/fortsetzung-zurueck.mjs).
// Der Abgleich der Läufe (gleicheAb) vergleicht Klassen nur bei gleichen Massen.
// Hier zählt die Familie über alle Massen: entlang einer Fortsetzung bleibt die
// Durchgangsfolge gleich, solange keine Begegnung zum Stoß wird.
//
// „Massenfreie Kennung“ = kennung(folge, null): kleinste Darstellung unter
// Drehung, Zeitumkehr und ALLEN Vertauschungen der Körper — als wären alle
// Massen gleich. Das ist die vorsichtige Richtung: zwei Bahnen gelten eher als
// verwandt, eine „neue Familie“ muss mehr bestehen.
//
// Eichung zuerst: die aus den Anfangswerten neu gerechnete, massengebundene
// Kennung jeder Listenbahn muss die im Katalog gespeicherte treffen, und bei
// unseren Funden die gespeicherte Folge die gespeicherte Kennung.
//
// Nur die Euler-Ebene (Li & Liao 2017, Li, Jing & Liao 2018, Šuvakov 2013);
// der freie Fall läuft über halbe Folgen und kommt gesondert.
// Ergebnis: ergebnisse/familien-abgleich.json und .md

import { readFileSync, writeFileSync, readdirSync, existsSync } from "node:fs";
import { join } from "node:path";
import { HIER, ladeKern, ladeKatalog } from "../quellen.mjs";

const K = ladeKern(), KAT = ladeKatalog();
const t0 = Date.now();
const zahlen = s => s.split("").map(Number);
const massenfrei = folge => K.kennung(folge, null);

/* ── 1 · Wörter der Listenbahnen, aus ihren Anfangswerten ── */
const ref = new Map();                 // massenfreie Kennung → [Listenbahnen]
let geeicht = 0, gerechnet = 0, versagt = 0;
const u0 = new Float64Array(12);
for (const k of KAT.bahnen.filter(b => b.ebene === "euler")) {
  K.EBENEN.euler.anfang(k.a, k.b, k.m, u0);
  const dg = K.durchgaenge(u0, k.m, k.T, 1e-11);
  if (!dg.folge || !dg.folge.length) { versagt++; continue; }
  gerechnet++;
  if (K.streu(K.kennung(dg.folge, k.m)) === k.kennung) geeicht++;
  const mf = massenfrei(dg.folge);
  if (!ref.has(mf)) ref.set(mf, []);
  ref.get(mf).push({ satz: k.satz, name: k.name, m: k.m, Ts: k.Ts, laenge: K.kuerzeFolge(dg.folge).folge.length });
}
console.log(`Listenbahnen (Euler-Ebene): ${gerechnet} gerechnet, ${versagt} ohne Folge; Eichung: ${geeicht} von ${gerechnet} treffen die gespeicherte Kennung; ${ref.size} verschiedene massenfreie Wörter (${((Date.now() - t0) / 1000).toFixed(0)} s)`);
// Die Liste aus Sofia (gleiche Massen, 441 985 Bahnen): Wörter als Streuwerte,
// gerechnet von werkzeug/woerter-hristov.mjs. Ohne sie ist „in keiner Liste“
// nur „in keiner Liste von Li/Liao und Šuvakov“ — das steht dann im Bericht.
const WH = join(HIER, "woerter-hristov.json");
const hristov = existsSync(WH) ? JSON.parse(readFileSync(WH, "utf8")) : null;
console.log(hristov ? `Sofia: ${hristov.gerechnet} Bahnen, ${Object.keys(hristov.woerter).length} massenfreie Wörter` : "Sofia: Wörter fehlen (node werkzeug/woerter-hristov.mjs) — Abgleich nur gegen Li/Liao und Šuvakov");

// Vielfache: ist die gekürzte Folge f die k-fache Wiederholung einer Folge g
// (bis auf Drehung), deren massenfreie Kennung in den Listen steht?
function vielfachesVon(f) {
  const n = f.length;
  for (let k = 2; k <= 12; k++) {
    if (n % k) continue;
    const L = n / k;
    for (let s = 0; s < L; s++) {                    // Anfang drehen
      const g = Array.from({ length: L }, (_, i) => f[(s + i) % n]);
      let gleich = true;
      for (let i = 0; i < n && gleich; i++) gleich = f[(s + i) % n] === g[i % L];
      if (gleich) { const mf = massenfrei(g); if (ref.has(mf)) return { k, liste: ref.get(mf)[0] }; break; }
    }
  }
  return null;
}

/* ── 2 · unsere Funde ── */
const genauUrteil = new Map();                       // Lauf:Index → Urteil auf 30 Stellen
for (const n of readdirSync(join(HIER, "ergebnisse")).filter(n => /-genau\.json$/.test(n) && !/^fortsetzung/.test(n))) {
  const G = JSON.parse(readFileSync(join(HIER, "ergebnisse", n), "utf8"));
  for (const r of G.geprueft || []) if (r.stabilGenau) genauUrteil.set(G.lauf + ":" + r.i, { urteil: r.stabilGenau.urteil, rand: r.stabilGenau.rand, belegt: r.urteil });
    else if (r.urteil) genauUrteil.set(G.lauf + ":" + r.i, { urteil: null, belegt: r.urteil });
}
const laeufe = readdirSync(join(HIER, "ergebnisse")).filter(n => /^euler-.*\.json$/.test(n) && !/genau|grauzone/.test(n));
const familien = new Map();                          // massenfreie Kennung → Mitglieder (Funde außerhalb der Listen mit neuem Wort)
const eichListe = { n: 0, treffer: 0, daneben: [] };
const zaehl = {};
let geeichtF = 0, mitFolge = 0;
for (const n of laeufe) {
  const B = JSON.parse(readFileSync(join(HIER, "ergebnisse", n), "utf8")), lauf = n.replace(/\.json$/, ""), m = B.parameter.m;
  const z = zaehl[lauf] = { funde: B.funde.length, bekannt: 0, ohneFolge: 0, wortGelistet: 0, wortSofia: 0, vielfaches: 0, satellitImLauf: 0, neuesWort: 0 };
  B.funde.forEach((f, i) => {
    // Was der Lauf schon als gelistet erkannt hat (Ort oder T*, auch gegen die
    // Liste aus Sofia), ist keine Kandidatin — die erste Fassung zählte diese
    // Funde mit und meldete 3091 „neue Wörter“, die meisten bei gleichen Massen.
    if (f.bekannt) {
      z.bekannt++;
      // Eichung der Wortlisten: ein schon als gelistet erkannter Fund muss sein
      // Wort in einer der Listen wiederfinden
      if (f.folge) { const mf = massenfrei(zahlen(f.folge)); eichListe.n++; if (ref.has(mf) || (hristov && hristov.woerter[K.streu(mf)])) eichListe.treffer++; else if (eichListe.daneben.length < 5) eichListe.daneben.push(lauf + ":" + i); }
      return;
    }
    if (!f.folge) { z.ohneFolge++; return; }
    const folge = zahlen(f.folge);
    mitFolge++;
    if (K.streu(K.kennung(folge, m)) === f.kennung) geeichtF++;
    const mf = massenfrei(folge);
    if (ref.has(mf)) { z.wortGelistet++; return; }
    if (hristov && hristov.woerter[K.streu(mf)]) { z.wortSofia++; return; }
    const v = vielfachesVon(K.kuerzeFolge(folge).folge);
    if (v) { z.vielfaches++; return; }
    if (f.satellit) { z.satellitImLauf++; return; }
    z.neuesWort++;
    const g = genauUrteil.get(lauf + ":" + i);
    if (!familien.has(mf)) familien.set(mf, []);
    familien.get(mf).push({ lauf, i, m3: m[2], a: f.a, b: f.b, T: f.T, Ts: f.Ts, laenge: folge.length, lambda: f.lambda, rMin: f.rMin,
      stabilDouble: f.stabil, s1: f.s1, s2: f.s2, belegt30: g ? g.belegt : null, stabil30: g ? g.urteil : null, rand30: g ? g.rand : null });
  });
}
console.log(`Eichung der Funde: ${geeichtF} von ${mitFolge} gespeicherten Folgen geben die gespeicherte Kennung`);
console.log(`Eichung der Wortlisten: ${eichListe.treffer} von ${eichListe.n} schon als gelistet erkannten Funden finden ihr Wort in den Listen${eichListe.daneben.length ? " (daneben z. B. " + eichListe.daneben.join(", ") + ")" : ""}`);

/* ── 3 · Bericht ── */
const liste = [...familien.entries()].map(([mf, mitglieder]) => {
  const ts = mitglieder.map(x => x.Ts);
  return { kennung: K.streu(mf), laenge: mitglieder[0].laenge, mitglieder: mitglieder.length,
    massen: [...new Set(mitglieder.map(x => x.m3))].sort((x, y) => x - y), TsVon: Math.min(...ts), TsBis: Math.max(...ts),
    belegt30: mitglieder.filter(x => x.belegt30 === "belegt").length,
    stabil30: mitglieder.filter(x => x.stabil30 === "stabil").length, grenze30: mitglieder.filter(x => x.stabil30 === "an der Grenze").length,
    stabilDouble: mitglieder.filter(x => x.stabilDouble === true).length, minLambda: Math.min(...mitglieder.map(x => x.lambda ?? Infinity)),
    beispiel: mitglieder.slice().sort((x, y) => (x.lambda ?? 1e99) - (y.lambda ?? 1e99))[0] };
}).sort((x, y) => (y.stabil30 - x.stabil30) || (y.stabilDouble - x.stabilDouble) || (x.minLambda - y.minLambda));
const aus = { erzeugt: new Date().toISOString(), referenz: { bahnen: gerechnet, eichung: geeicht, woerter: ref.size,
  sofia: hristov ? { bahnen: hristov.gerechnet, woerter: Object.keys(hristov.woerter).length } : "nicht abgeglichen" },
  eichungFunde: { mitFolge, treffen: geeichtF }, laeufe: zaehl, familien: liste };
writeFileSync(join(HIER, "ergebnisse", "familien-abgleich.json"), JSON.stringify(aus, null, 1));
for (const [l, z] of Object.entries(zaehl)) console.log(`  ${l.padEnd(22)} ${String(z.funde).padStart(5)} Funde: bekannt ${z.bekannt}, Wort gelistet ${z.wortGelistet}, Wort in Sofia ${z.wortSofia}, Vielfaches ${z.vielfaches}, Satellit (Lauf) ${z.satellitImLauf}, NEUES WORT ${z.neuesWort}, ohne Folge ${z.ohneFolge}`);
console.log(`Familien mit einem Wort in keiner Liste: ${liste.length}; davon mit einem auf 30 Stellen stabilen Mitglied: ${liste.filter(x => x.stabil30).length}, mit einem in double stabilen: ${liste.filter(x => x.stabilDouble).length}`);
console.log(`(${((Date.now() - t0) / 1000).toFixed(0)} s)`);
