// dreikoerper/katalog-bauen.mjs — macht aus quelle\ den Katalog katalog.json.
//
//   node katalog-bauen.mjs
//
// Je Bahn: Ebene, Massen, Ort (a,b), Periode T, skalierte Periode T*,
// Wortlänge, Name und die topologische Kennung. T* wird hier selbst aus den
// Anfangswerten gerechnet (T·|E|^1.5), damit Katalog und Fund dieselbe
// Definition teilen; die Spalte der Quelle steht daneben und wird verglichen.
//
// Die Kennung entsteht aus dem veröffentlichten Wort, nicht aus einer eigenen
// Integration: so bleibt der Katalog eine Abschrift der Quelle. Dass Wort und
// eigene Integration übereinstimmen, prüft pruef-katalog.mjs.

import { writeFileSync } from "node:fs";
import { join } from "node:path";
import { ladeKern, ladeQuellen, SUVAKOV, HIER } from "./quellen.mjs";

const K = ladeKern(), Q = ladeQuellen();
const u = new Float64Array(12);
const bahnen = [];
let tsMax = 0, tsN = 0;

for (const [satz, quelle] of [["gleich", "Li & Liao 2017"], ["ungleich", "Li, Jing & Liao 2018"], ["fall", "Li & Liao 2019"]]) {
  for (const e of Q[satz]) {
    K.EBENEN[e.ebene].anfang(e.a, e.b, e.m, u);
    const E = K.energie(u, e.m), Ts = e.T * Math.pow(Math.abs(E), 1.5);
    if (Number.isFinite(e.Ts) && satz === "gleich") { tsMax = Math.max(tsMax, Math.abs(Ts - e.Ts)); tsN++; }
    const b = { satz, quelle, ebene: e.ebene, name: e.name, m: e.m, a: e.a, b: e.b, T: e.T,
                Ts: +Ts.toPrecision(12), Lf: e.Lf ?? e.wort.length };
    if (e.ebene === "euler") b.kennung = K.streu(K.kennung(K.folgeAusWort(e.wort), e.m));
    bahnen.push(b);
  }
}

// Die Namen von 2013 an die Katalogeinträge hängen (nächster Punkt der Ebene).
// Li und Liao führen je Klasse EINE Bahn; vier der fünfzehn Anfangswerte von
// 2013 stehen deshalb nicht an ihrem Ort in der Liste (zweite Bahn derselben
// Klasse oder dieselbe Bahn an anderer Stelle). Sie kommen als eigener Satz
// „2013" dazu — mit fünf Stellen aus der Tabelle, hier auf volle Genauigkeit
// verfeinert, sonst griffe der Ortsvergleich (1e-6) nicht.
const gleich = bahnen.filter(b => b.satz === "gleich");
const namen = [], pruefer = K.macheFundpruefer();
for (const s of SUVAKOV) {
  let best = null, d = Infinity;
  for (const b of gleich) { const q = Math.hypot(b.a - s.a, b.b - s.b); if (q < d) { d = q; best = b; } }
  namen.push({ suvakov: s.nr, name: s.name, katalog: best.name, abstand: d });
  if (d < 2e-5) { best.rufname = s.name; continue; }
  const p = pruefer("euler", [1, 1, 1], s.a, s.b, s.T, { tSpanne: 0.05 });
  if (!p.ok) { console.error(`FEHL: ${s.name} konvergiert nicht`); process.exit(1); }
  bahnen.push({ satz: "2013", quelle: "Šuvakov & Dmitrašinović 2013", ebene: "euler", name: s.nr, rufname: s.name, m: [1, 1, 1],
                a: p.a, b: p.b, T: p.T, Ts: +p.Ts.toPrecision(12), Lf: p.wort.length, kennung: p.kennung,
                tabelle: [s.a, s.b, s.T], verfeinert: true });
}
gleich[0].rufname = "Acht";

const aus = {
  erzeugt: new Date().toISOString().slice(0, 10),
  quellen: ["github.com/sjtu-liao/three-body (abgerufen 01.10.2026)", "Šuvakov & Dmitrašinović, arXiv:1303.0181 (Namen)"],
  anzahl: { gleich: Q.gleich.length, ungleich: Q.ungleich.length, fall: Q.fall.length, "2013": bahnen.filter(b => b.satz === "2013").length },
  bahnen
};
writeFileSync(join(HIER, "katalog.json"), JSON.stringify(aus));

console.log(`katalog.json: ${bahnen.length} Bahnen (gleich ${Q.gleich.length}, ungleich ${Q.ungleich.length}, freier Fall ${Q.fall.length}, nur in der Tabelle von 2013 ${aus.anzahl["2013"]})`);
console.log(`T* selbst gerechnet gegen die Spalte der Quelle (3 Nachkommastellen): größte Abweichung ${tsMax.toExponential(2)} über ${tsN} Bahnen`);
console.log("Namen von 2013:");
for (const n of namen) console.log(`  ${n.suvakov.padEnd(8)} ${n.name.padEnd(18)} → ${n.katalog.padEnd(9)} Abstand ${n.abstand.toExponential(1)}${n.abstand < 2e-5 ? "" : "   (kein Eintrag in der Nähe)"}`);
const kenn = new Map();
for (const b of gleich) kenn.set(b.kennung, (kenn.get(b.kennung) || 0) + 1);
console.log(`gleiche Massen: ${kenn.size} verschiedene Klassen bei ${gleich.length} Bahnen; größte Klasse hat ${Math.max(...kenn.values())} Mitglieder`);
if (tsMax > 1e-3) { console.error("FEHL: T* weicht von der Quelle ab"); process.exit(1); }
