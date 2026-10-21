// dreikoerper/werkzeug/atlas-stabil.mjs — stimmt unser Stabilitätsurteil bei
// UNGLEICHEN Massen mit einer fremden Rechnung überein?
//
//   node werkzeug/atlas-stabil.mjs
//
// Bisher offen (AUFGABEN, „Was noch offen ist“, Punkt 5): an fremden
// periodischen Bahnen ungleicher Massen war die Stabilitätsrechnung nicht
// geprüft, weil keine Liste mit Eigenwerten vorlag. Der Atlas
// threebodyorbits.com nennt für jede Bahn max |λ| (Feld „stab“, gerechnet in
// doppelt-doppelter Genauigkeit; an acht Bahnen gleicher Massen geeicht,
// werkzeug/atlas-pruefen.mjs). Hier: alle Listenbahnen ungleicher Massen, die
// unsere Läufe am Ort getroffen haben, unser max |λ| (aus 30 Stellen, wo es
// das gibt, sonst double mit sicherem Urteil) gegen das des Atlas.

import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join } from "node:path";
import { HIER } from "../quellen.mjs";

const atlas = JSON.parse(readFileSync(join(HIER, "quelle", "atlas", "catalogue.json"), "utf8")).orbits;
const form = m => { const s = m.slice().sort((a, b) => a - b), M = s.reduce((a, b) => a + b, 0); return s.map(x => x / M); };
const A = atlas.map(o => { const M = o.masses.reduce((a, b) => a + b, 0); return { o, f: form(o.masses), t: o.T * Math.abs(o.E) ** 1.5 / M ** 2.5, l: Math.abs(o.L) * Math.sqrt(Math.abs(o.E)) / M ** 2.5 }; });
const lamAusS = s => (Math.abs(s) <= 2 ? 1 : (Math.abs(s) + Math.sqrt(s * s - 4)) / 2);
const ort = (a, b) => Math.round(Math.abs(a) * 1e9) + ":" + Math.round(Math.abs(b) * 1e9);
const e = x => (Number.isFinite(x) ? (x < 1e4 ? x.toPrecision(5) : x.toExponential(3)) : "—");
const ordner = join(HIER, "ergebnisse");
let n = 0, gleich = 0, urteilGleich = 0; const abw = [], schlecht = [];
for (const datei of readdirSync(ordner).filter(d => d.endsWith(".json") && !/-genau\.json$|-grauzone\.json$|^katalogabgleich|^funde\.json$/.test(d))) {
  const B = JSON.parse(readFileSync(join(ordner, datei), "utf8"));
  if (!B.funde || B.parameter.m.every(x => x === 1)) continue;
  const m = B.parameter.m, M = m.reduce((a, b) => a + b, 0), f0 = form(m);
  const gp = join(ordner, B.lauf + "-genau.json");
  const genau = existsSync(gp) ? new Map(JSON.parse(readFileSync(gp, "utf8")).geprueft.filter(r => r.start).map(r => [ort(r.start[0], r.start[1]), r])) : new Map();
  for (const f of B.funde) {
    if (!f.katalog || f.katalog.stufe !== "ort") continue;
    const t = f.Ts / M ** 2.5;
    const kand = A.filter(x => x.l < 1e-5 && x.f.every((v, i) => Math.abs(v - f0[i]) < 2e-6)).map(x => ({ x, d: Math.abs(x.t / t - 1) })).sort((p, q) => p.d - q.d)[0];
    if (!kand || kand.d > 2e-6) continue;
    const r = genau.get(ort(f.a, f.b)), sg = r && r.stabilGenau;
    let unser, quelle;
    if (sg && Number.isFinite(sg.s1)) { unser = Math.max(lamAusS(sg.s1), lamAusS(sg.s2)); quelle = "30 Stellen"; }
    else if (f.stabil === true) { unser = 1; quelle = "double, sicher stabil"; }
    else if (f.stabil === false) { unser = f.lambda; quelle = "double, sicher instabil"; }
    else continue;                                  // in double offen und nicht auf 30 Stellen: kein Urteil zum Vergleichen
    n++;
    const ihr = kand.x.o.stab, d = Math.abs(unser / ihr - 1);
    const ihrStabil = ihr <= 1 + 1e-6, unserStabil = unser <= 1 + 1e-6;
    if (ihrStabil === unserStabil) urteilGleich++; else schlecht.push(`${B.lauf} ${f.katalog.name} (T ${f.T.toFixed(3)}): unser |λ| ${e(unser)} [${quelle}], Atlas ${e(ihr)}`);
    if (d < 1e-3) gleich++;
    abw.push({ d, name: f.katalog.name, lauf: B.lauf, unser, ihr, quelle });
  }
}
abw.sort((p, q) => p.d - q.d);
console.log(`Listenbahnen ungleicher Massen, am Ort getroffen und mit sicherem Urteil: ${n}`);
console.log(`Urteil stabil/instabil gleich: ${urteilGleich} von ${n}; max |λ| auf 1e-3 gleich: ${gleich} von ${n}`);
for (const q of ["30 Stellen", "double, sicher stabil", "double, sicher instabil"]) { const t = abw.filter(x => x.quelle === q); if (t.length) console.log(`  ${q}: ${t.length} Bahnen, Abweichung in max |λ| höchstens ${t[t.length - 1].d.toExponential(1)}, Median ${t[t.length >> 1].d.toExponential(1)}`); }
if (abw.length) console.log(`Abweichung in max |λ|: Median ${abw[abw.length >> 1].d.toExponential(1)}, größte ${abw.slice(-3).map(x => `${x.d.toExponential(1)} (${x.lauf} ${x.name}: unser ${e(x.unser)} [${x.quelle}], Atlas ${e(x.ihr)})`).join("; ")}`);
for (const s of schlecht) console.log("  WIDERSPRUCH: " + s);
