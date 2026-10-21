// dreikoerper/werkzeug/katalog-massen.mjs — gegen welche Listen lässt sich ein
// Lauf mit diesen Massen überhaupt abgleichen?
//
//   node werkzeug/katalog-massen.mjs 1,1,2
//
// Für gleiche Massen gibt es die großen Listen von Hristov u. a.; für
// ungleiche nur Li/Liao. Steht dort für die gewählten Massen nichts, dann
// heißt „in keiner Liste" nichts — es gibt keine Liste.

import { ladeKatalog } from "../quellen.mjs";

const m = (process.argv[2] || "1,1,2").split(",").map(Number);
const kat = ladeKatalog();
const gleich = (x, y) => x.every((v, i) => Math.abs(v - y[i]) < 1e-12);
const je = new Map();
for (const b of kat.bahnen) { const k = b.ebene + " " + b.m.join("/"); je.set(k, (je.get(k) || 0) + 1); }
console.log(`Katalog: ${kat.bahnen.length} Bahnen. Massensätze und Ebenen:`);
for (const [k, n] of [...je.entries()].sort((x, y) => y[1] - x[1]).slice(0, 30)) console.log(`  ${String(n).padStart(5)}  ${k}`);
const hier = kat.bahnen.filter(b => gleich(b.m, m));
console.log(`\nMassen ${m.join("/")}: ${hier.length} Bahnen` + (hier.length ? ` (Euler ${hier.filter(b => b.ebene === "euler").length}, freier Fall ${hier.filter(b => b.ebene === "fall").length}); T von ${Math.min(...hier.map(b => b.T)).toFixed(2)} bis ${Math.max(...hier.map(b => b.T)).toFixed(2)}, davon T ≤ 40: ${hier.filter(b => b.T <= 40).length}` : ""));
