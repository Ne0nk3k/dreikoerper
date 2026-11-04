// alle-pruefen.mjs — every row of a 30-digit table checked again with
// bahn-pruefen.mjs (from the dreikoerper project, 04.11.2026).
//
//   node alle-pruefen.mjs daten/family-B-30digit.csv
//
// For each row: one period at 320 and at 448 bits must return to better than
// 1e-25, and the verdict (stable / unstable / boundary) and the stability
// indices must agree with the table (indices to 1e-9). One row after the
// other, a few minutes each. Exit code 0 only if every row agrees.

import { readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const HIER = dirname(fileURLToPath(import.meta.url));
const datei = process.argv[2];
if (!datei) { console.error("usage: node alle-pruefen.mjs <table.csv>"); process.exit(2); }
const zeilen = readFileSync(datei, "utf8").split(/\r?\n/).filter(z => z && !z.startsWith("#"));
const kopf = zeilen.shift().split(","), spalte = n => kopf.indexOf(n);
const VERDIKT = { "linearly stable": "stable", unstable: "unstable", "at the stability boundary (not separable at this precision)": "boundary" };
let gut = 0, schlecht = 0;
for (const z of zeilen) {
  const w = z.split(","), m3 = w[spalte("m3")], t0 = Date.now();
  const r = spawnSync(process.execPath, [join(HIER, "bahn-pruefen.mjs"), "--m", `1,1,${m3}`, "--a", w[spalte("a")], "--b", w[spalte("b")], "--T", w[spalte("T")]], { encoding: "utf8" });
  const o = r.stdout || "";
  const periodisch = /RESULT: periodic to better than 1e-25 at both precisions/.test(o);
  const verdikt = VERDIKT[(o.match(/verdict: (.*)/) || [])[1]] || "?";
  const s1 = +((o.match(/s1 = (-?[\d.]+)/) || o.match(/s = (-?[\d.]+) ±/) || [])[1]);
  const s2 = +((o.match(/s2 = (-?[\d.]+)/) || o.match(/s = (-?[\d.]+) ±/) || [])[1]);
  const soll1 = +w[spalte("s1")], soll2 = +w[spalte("s2")];
  const passt = periodisch && verdikt === w[spalte("verdict")] && Math.abs(s1 - soll1) < 1e-9 && Math.abs(s2 - soll2) < 1e-9;
  passt ? gut++ : schlecht++;
  console.log(`m3 ${m3.padEnd(9)} ${passt ? "ok  " : "FAIL"}  ${verdikt.padEnd(9)} s ${Number.isFinite(s1) ? s1.toFixed(9) : "?"} / ${Number.isFinite(s2) ? s2.toFixed(9) : "?"}  (${((Date.now() - t0) / 1000).toFixed(0)} s)`);
}
console.log(`${gut} of ${gut + schlecht} rows agree with the table.`);
process.exit(schlecht ? 1 : 0);
