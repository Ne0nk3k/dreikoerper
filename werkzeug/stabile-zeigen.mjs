// dreikoerper/werkzeug/stabile-zeigen.mjs — die Bahnen eines Laufs, deren
// Stabilitätsurteil „stabil" oder „offen" lautet, mit allem, was dazu bekannt
// ist: Listenstand, Indizes aus double, und (wenn nachgeprüft) aus Festkomma.
//
//   node werkzeug/stabile-zeigen.mjs euler-m3-2 [--alle]
//
// Ohne --alle nur die, die in keiner Liste stehen.

import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { HIER } from "../quellen.mjs";

const lauf = process.argv[2], ALLE = process.argv.includes("--alle");
const b = JSON.parse(readFileSync(join(HIER, "ergebnisse", lauf + ".json"), "utf8"));
const gp = join(HIER, "ergebnisse", lauf + "-genau.json");
const g = existsSync(gp) ? JSON.parse(readFileSync(gp, "utf8")) : { geprueft: [] };
const ort = (x, y) => Math.round(Math.abs(x) * 1e9) + ":" + Math.round(Math.abs(y) * 1e9);
const genau = new Map(g.geprueft.filter(r => r.start).map(r => [ort(r.start[0], r.start[1]), r]));
const e = x => (typeof x === "number" && Number.isFinite(x) ? (Math.abs(x) >= 1e4 || Math.abs(x) < 1e-3 ? x.toExponential(2) : x.toFixed(6)) : "—");
const liste = b.funde.filter(f => f.stabil !== false && (ALLE || !f.bekannt));
const urteilGenau = f => { const r = genau.get(ort(f.a, f.b)); return r && r.stabilGenau ? r.stabilGenau.urteil : r ? "(" + r.urteil + ", Stabilität fehlt)" : "nicht nachgeprüft"; };
const zahl = {};
for (const f of liste) { const k = (f.stabil === true ? "double stabil" : "double offen") + " → genau " + urteilGenau(f); zahl[k] = (zahl[k] || 0) + 1; }
console.log(`${lauf}: ${liste.length} Bahnen mit Urteil stabil oder offen in double (${ALLE ? "alle" : "nur die in keiner Liste"})`);
for (const [k, n] of Object.entries(zahl)) console.log(`  ${String(n).padStart(3)}  ${k}`);
console.log("");
for (const f of liste.sort((x, y) => x.T - y.T)) {
  const r = genau.get(ort(f.a, f.b)), s = r && r.stabilGenau;
  const listen = f.katalog.stufe === "ort" || f.katalog.stufe === "lage" ? f.katalog.stufe + ": " + (f.katalog.rufname || f.katalog.name) : f.katalog.stufe === "klasse" ? "nur Klasse von " + (f.katalog.rufname || f.katalog.name) : "in keiner";
  console.log(`T ${f.T.toFixed(4).padStart(9)}  T* ${f.Ts.toFixed(3).padStart(8)}  (${f.a.toFixed(8)}, ${f.b.toFixed(8)})  double: ${f.stabil === true ? "stabil" : "offen "} s ${e(f.s1)} / ${e(f.s2)} sympl ${e(f.symplektik)}  ` +
    `genau: ${s ? `${s.urteil} (${s.stufe || "voll"}) s ${s.s1Text ? s.s1Text.slice(0, 14) : e(s.s1)} / ${s.s2Text ? s.s2Text.slice(0, 14) : e(s.s2)} Abstand zur Grenze ${e(s.rand)}` : urteilGenau(f)}  ` +
    `Rest ${r && r.rest !== undefined ? r.rest.toExponential(1) : "—"}  ${f.urteil}  Wort ${f.wort.length}  rMin ${e(f.rMin)}  Listen: ${listen}`);
}
