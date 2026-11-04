// dreikoerper/werkzeug/woerter-fall.mjs — massenfreie Wörter der Freifall-
// Listen (21.10.2026). Dieselbe periodische Bahn kann in einer Liste nur in der
// Freifall-Darstellung stehen; familien-abgleich.mjs prüfte bis dahin nur die
// Euler-Ebene.
//
//   node werkzeug/woerter-fall.mjs
//
// Volle Periode, zyklisches Wort (nicht die halbe, offene Folge des
// Fundprüfers), kennung(folge, null). Listen: Sofia freier Fall (sol_80 und
// free_100_4860, 29 442 Bahnen, gleiche Massen) und Li & Liao 2019 (316, auch
// ungleiche Massen). Eichung: Sofia führt die 4860 Bahnen mit Punktsymmetrie
// in BEIDEN Ebenen (euler_100_4860 und free_100_4860, gleiche Reihenfolge) —
// die Wörter der Paare müssen gleich sein, sonst taugt der Vergleich über die
// Ebenen nicht.
// Ergebnis: woerter-fall.json im Hauptordner (aus fremden Daten, nicht öffentlich).

import { writeFileSync } from "node:fs";
import { join } from "node:path";
import { setPriority, constants } from "node:os";
import { HIER, ladeKern, ladeGross, ladeKatalog } from "../quellen.mjs";

try { setPriority(constants.priority.PRIORITY_LOW); } catch { /* ohne Recht */ }
const K = ladeKern(), G = ladeGross(), KAT = ladeKatalog(), u0 = new Float64Array(12), t0 = Date.now();
const wortVon = (ebene, a, b, T, m) => {
  K.EBENEN[ebene].anfang(a, b, m, u0);
  const dg = K.durchgaenge(u0, m, T, 1e-11);
  return dg.folge && dg.folge.length ? K.streu(K.kennung(dg.folge, null)) : null;
};

// Eichung an den Paaren der Punktsymmetrie-Liste
const qEuler = G.meta.ebenen.euler.quellen.findIndex(x => x.datei === "sym4860/euler_100_4860.txt");
const qFall = G.meta.ebenen.fall.quellen.findIndex(x => x.datei === "sym4860/free_100_4860.txt");
const idx = (E, q) => { const aus = []; for (let i = 0; i < E.n; i++) if (E.q[i] === q) aus.push(i); return aus; };
const pe = idx(G.euler, qEuler), pf = idx(G.fall, qFall);
let paare = 0, gleich = 0;
const n = Math.min(pe.length, pf.length, 600);
for (let k = 0; k < n; k++) {
  const i = pe[k], j = pf[k];
  const we = wortVon("euler", G.euler.w[4 * i], G.euler.w[4 * i + 1], G.euler.w[4 * i + 2], [1, 1, 1]);
  const wf = wortVon("fall", G.fall.w[4 * j], G.fall.w[4 * j + 1], G.fall.w[4 * j + 2], [1, 1, 1]);
  if (we && wf) { paare++; if (we === wf) gleich++; }
}
console.log(`Eichung: ${gleich} von ${paare} Paaren (Punktsymmetrie, beide Ebenen; Liste: ${pe.length} / ${pf.length}) haben dasselbe Wort`);

const woerter = {};
let gerechnet = 0, leer = 0;
for (let i = 0; i < G.fall.n; i++) {
  const w = wortVon("fall", G.fall.w[4 * i], G.fall.w[4 * i + 1], G.fall.w[4 * i + 2], [1, 1, 1]);
  if (!w) { leer++; continue; }
  gerechnet++; woerter[w] = (woerter[w] || 0) + 1;
}
for (const k of KAT.bahnen.filter(b => b.ebene === "fall")) {
  const w = wortVon("fall", k.a, k.b, k.T, k.m);
  if (!w) { leer++; continue; }
  gerechnet++; woerter[w] = (woerter[w] || 0) + 1;
}
writeFileSync(join(HIER, "woerter-fall.json"), JSON.stringify({ erzeugt: new Date().toISOString(), eichung: { paare, gleich }, gerechnet, leer, woerter }));
console.log(`${gerechnet} Freifall-Bahnen, ${leer} ohne Folge, ${Object.keys(woerter).length} verschiedene Wörter, ${((Date.now() - t0) / 60000).toFixed(1)} min`);
