// dreikoerper/werkzeug/atlas-pruefen.mjs — was führt der Atlas
// threebodyorbits.com, und trifft er unsere Funde?
//
//   node werkzeug/atlas-pruefen.mjs
//
// quelle\atlas\catalogue.json (data.threebodyorbits.com, geladen am
// 02.10.2026) nennt je Bahn Massen, T, E, L und ein Stabilitätsmaß — keine
// Anfangswerte. Vergleichen lässt sich über Größen, die sich beim Umskalieren
// von Längen UND Massen nicht ändern:
//     t = T·|E|^1.5 / M^2.5      l = |L|·√|E| / M^2.5      (M = Gesamtmasse)
// und über die Massenform (Massen sortiert, durch M geteilt). E steht dort mit
// sieben Stellen: t ist auf etwa 2e-7 genau, nicht auf acht Stellen.
//
// Geeicht wird am eigenen Katalog: die Li/Liao-Bahnen stehen in beiden.

import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { HIER, ladeKatalog, ladeGross } from "../quellen.mjs";

const atlas = JSON.parse(readFileSync(join(HIER, "quelle", "atlas", "catalogue.json"), "utf8"));
const e = x => (Number.isFinite(x) ? x.toExponential(1) : "—");
const form = m => { const s = m.slice().sort((a, b) => a - b), M = s.reduce((a, b) => a + b, 0); return s.map(x => x / M); };
const gleicheForm = (f, g) => f.every((x, i) => Math.abs(x - g[i]) < 2e-6);
const zaehl = (liste, f) => { const z = new Map(); for (const x of liste) { const k = f(x); z.set(k, (z.get(k) || 0) + 1); } return [...z].sort((a, b) => b[1] - a[1]); };

const A = atlas.orbits.map(o => {
  const M = o.masses.reduce((a, b) => a + b, 0);
  return { ...o, M, form: form(o.masses), t: o.T * Math.abs(o.E) ** 1.5 / M ** 2.5, l: Math.abs(o.L) * Math.sqrt(Math.abs(o.E)) / M ** 2.5 };
});
console.log(`Atlas: ${A.length} Bahnen (Datei nennt ${atlas.count}), Stand ${new Date(atlas.generated * 1000).toISOString().slice(0, 10)}`);
console.log("Familien: " + zaehl(A, o => o.family).map(([k, n]) => `${k} ${n}`).join(" · "));
const ohneDreh = A.filter(o => o.l < 1e-6);
console.log(`\nDrehimpuls null (l < 1e-6): ${ohneDreh.length}; mit Drehimpuls: ${A.length - ohneDreh.length}`);
const zweiGleich = o => { const s = o.masses.slice().sort((a, b) => a - b); return Math.abs(s[0] - s[1]) < 1e-9 || Math.abs(s[1] - s[2]) < 1e-9; };
const klasse = ohneDreh.filter(zweiGleich);
console.log(`davon mit zwei gleichen Massen (das ist die Klasse, die unsere Euler-Ebene absucht): ${klasse.length}`);
console.log("Massen dieser Klasse: " + zaehl(klasse, o => o.masses.slice().sort((a, b) => a - b).join("/")).slice(0, 30).map(([k, n]) => `${k} ×${n}`).join(" · "));
console.log("Massen mit Drehimpuls null, alle drei verschieden: " + zaehl(ohneDreh.filter(o => !zweiGleich(o)), o => o.masses.join("/")).slice(0, 12).map(([k, n]) => `${k} ×${n}`).join(" · "));
console.log("Stabilitätsfeld „stab“: " + zaehl(A, o => (o.stab === undefined ? "fehlt" : o.stab === 1 ? "1" : o.stab > 1 ? "> 1" : "< 1")).map(([k, n]) => `${k}: ${n}`).join(" · "));

// Eichung: unser Katalog (Li/Liao, Šuvakov) gegen den Atlas
const kat = ladeKatalog();
const treffer = (m, Ts, tol) => {
  const M = m.reduce((a, b) => a + b, 0), f = form(m), t = Ts / M ** 2.5;
  let best = null, d = Infinity;
  for (const o of A) { if (o.l > 1e-5 || !gleicheForm(o.form, f)) continue; const x = Math.abs(o.t / t - 1); if (x < d) { d = x; best = o; } }
  return { best, d, ja: d < tol };
};
console.log(`\nEichung — Bahnen unseres Katalogs, die der Atlas über Massenform und t wiederfindet:`);
const gruppen = new Map();
for (const k of kat.bahnen) { const s = k.ebene + " " + k.m.join("/"); if (!gruppen.has(s)) gruppen.set(s, []); gruppen.get(s).push(k); }
const alleAb = [];
for (const [s, liste] of gruppen) {
  const r = liste.map(k => treffer(k.m, k.Ts, 1e-5));
  const ab = r.filter(x => x.ja).map(x => x.d).sort((a, b) => a - b);
  alleAb.push(...ab);
  console.log(`  ${s.padEnd(26)} ${String(ab.length).padStart(4)} von ${String(liste.length).padStart(4)}` + (ab.length ? `   Abweichung in t: Median ${e(ab[ab.length >> 1])}, größte ${e(ab[ab.length - 1])}` : ""));
}
alleAb.sort((a, b) => a - b);
if (alleAb.length) { console.log(`  alle Treffer: ${alleAb.length}; Abweichung in t`); for (const g of [1e-8, 1e-7, 1e-6, 1e-5]) console.log(`    unter ${e(g)}: ${alleAb.filter(x => x < g).length}`); }

// Was heißt „stab“ im Atlas? Eichung an Bahnen, deren |λ| der eigene Kern
// gemessen hat (werkzeug/lage-pruefen.mjs und pruef-browser, 02.10.2026).
console.log(`\nDas Feld „stab“ des Atlas an Bahnen mit bekanntem |λ| (eigene Messung in Klammern):`);
for (const [name, ebene, lam] of [["I.A-1", "euler", "1, stabil"], ["I.A-2", "euler", "1,7758"], ["II.B.1", "euler", "5,0"], ["II.C-64", "euler", "1,2e2"], ["I.B-13", "euler", "1,9e2"], ["II.C-191", "euler", "1,1e3"], ["II.C-190", "euler", "2,5e4"], ["F-9", "fall", "5,9e4"]]) {
  const k = kat.bahnen.find(q => q.name === name && q.ebene === ebene && q.m.every(x => x === 1));
  if (!k) { console.log(`  ${name}: nicht im Katalog`); continue; }
  const r = treffer(k.m, k.Ts, 1e-5);
  console.log(`  ${(k.rufname || k.name).padEnd(18)} T ${k.T.toFixed(4)}  (|λ| ${lam})  →  Atlas ${r.best ? r.best.key + ": stab " + r.best.stab + (r.best.stable_pub !== undefined ? ", stable_pub " + r.best.stable_pub : "") : "kein Treffer"}`);
}

// Unsere Funde außerhalb der Listen gegen den Atlas
console.log(`\nUnsere Funde, die bisher in keiner Liste standen — steht eine Bahn gleicher Massenform und gleichen t im Atlas? (Schwelle 2e-6)`);
const gross = ladeGross(), gleich111 = m => m.every(x => Math.abs(x - m[0]) < 1e-12);
const ordner = join(HIER, "ergebnisse");
for (const datei of readdirSync(ordner).filter(d => d.endsWith(".json") && !d.endsWith("-genau.json") && !d.startsWith("katalogabgleich") && d !== "funde.json")) {
  const lauf = JSON.parse(readFileSync(join(ordner, datei), "utf8"));
  if (!lauf.funde) continue;
  const m = lauf.parameter.m, offen = lauf.funde.filter(f => !f.bekannt && !f.weitereLage);
  const imAtlas = A.filter(o => o.l < 1e-5 && gleicheForm(o.form, form(m)));
  const tr = offen.map(f => ({ f, ...treffer(m, f.Ts, 2e-6) })).filter(x => x.ja);
  console.log(`  ${lauf.lauf.padEnd(18)} Massen ${m.join("/")}: Atlas führt ${imAtlas.length} Bahnen dieser Massen ohne Drehimpuls; von ${offen.length} Funden außerhalb der Listen trifft er ${tr.length}`);
  for (const x of tr.slice(0, 12)) {
    // trennscharf wird es erst über die Stabilität: dieselbe Bahn hat dasselbe |λ|
    const g = gross && gross[lauf.parameter.ebene] && gleich111(m) ? gross[lauf.parameter.ebene].mitTs(x.f.Ts, 1e-5) : null;
    console.log(`      Fund (${x.f.a.toFixed(6)}, ${x.f.b.toFixed(6)}) T ${x.f.T.toFixed(4)} T* ${x.f.Ts.toFixed(7)} ${x.f.stabil === true ? "stabil" : x.f.stabil === false ? "instabil" : "offen"} |λ| ${e(x.f.lambda)}  ↔  ${x.best.key} [${x.best.family}] T ${x.best.T} stab ${x.best.stab}  Δt ${e(x.d)}` + (g ? `   · nächstes T* im großen Katalog: Abweichung ${e(g.abweichung)}` : ""));
  }
  // die Fremden: Atlasbahnen dieser Massen, die NICHT aus Li/Liao stammen
  const fremd = zaehl(imAtlas, o => o.family);
  if (imAtlas.length) console.log(`      Familien im Atlas zu diesen Massen: ${fremd.map(([k, n]) => `${k} ${n}`).join(" · ")}`);
}
