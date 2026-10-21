// dreikoerper/werkzeug/unbekannt-ts.mjs — liegen die Funde „in keiner Liste"
// überhaupt in dem Bereich, den die Listen abdecken?
//
//   node werkzeug/unbekannt-ts.mjs fall-gleich-1 80 120
//
// Die Listen von Hristov u. a. enden bei einer skalierten Periode T* (Euler:
// 211; freier Fall: 80, mit Punktsymmetrie 120). Ein Fund darüber steht aus
// einem langweiligen Grund in keiner Liste: dort hat niemand gesucht.

import { readFileSync } from "node:fs";
import { join } from "node:path";
import { HIER } from "../quellen.mjs";

const lauf = process.argv[2], grenzen = process.argv.slice(3).map(Number);
const b = JSON.parse(readFileSync(join(HIER, "ergebnisse", lauf + ".json"), "utf8"));
const un = b.funde.filter(f => !f.bekannt), ts = un.map(f => f.Ts).sort((x, y) => x - y);
console.log(`${lauf}: ${b.funde.length} Bahnen, ${un.length} in keiner Liste. T* der unbekannten: kleinstes ${ts[0]?.toFixed(2)}, Median ${ts[ts.length >> 1]?.toFixed(2)}, größtes ${ts[ts.length - 1]?.toFixed(2)}`);
const bek = b.funde.filter(f => f.bekannt).map(f => f.Ts).sort((x, y) => x - y);
console.log(`T* der bekannten: kleinstes ${bek[0]?.toFixed(2)}, Median ${bek[bek.length >> 1]?.toFixed(2)}, größtes ${bek[bek.length - 1]?.toFixed(2)}`);
for (const g of grenzen) console.log(`  unbekannt mit T* unter ${g}: ${un.filter(f => f.Ts < g).length} von ${un.length}   (bekannt mit T* unter ${g}: ${bek.filter(x => x < g).length} von ${bek.length})`);
const zahl = {};
for (const f of un) zahl[f.urteil] = (zahl[f.urteil] || 0) + 1;
console.log("Urteile der unbekannten:", JSON.stringify(zahl));
const zz = {};
for (const f of un) { const k = f.halb ? f.halb.ziel + "×" + f.halb.vielfaches : "—"; zz[k] = (zz[k] || 0) + 1; }
console.log("Umkehrpunkt × Vielfaches der unbekannten:", JSON.stringify(zz));
// Gegenstück: dieselbe Aufteilung bei den bekannten. Fehlte dort eine Art von
// Umkehrpunkt ganz, läge der Verdacht nahe, dass die Liste diese Art gar nicht
// führt (oder ihre Periode anders zählt) — und „in keiner Liste" hieße wenig.
const zb = {};
for (const f of b.funde.filter(f => f.bekannt)) { const k = f.halb ? f.halb.ziel + "×" + f.halb.vielfaches : "—"; zb[k] = (zb[k] || 0) + 1; }
console.log("Umkehrpunkt × Vielfaches der bekannten:  ", JSON.stringify(zb));
// Anteil unbekannt je T*-Band
const baender = [0, 40, 60, 80, 100, 120, 160, 211, 1e9];
for (let i = 0; i + 1 < baender.length; i++) {
  const alle = b.funde.filter(f => f.Ts >= baender[i] && f.Ts < baender[i + 1]);
  if (alle.length) console.log(`  T* ${String(baender[i]).padStart(3)} … ${baender[i + 1] > 1e8 ? "∞  " : String(baender[i + 1]).padEnd(3)}: ${String(alle.length).padStart(4)} Bahnen, davon in keiner Liste ${String(alle.filter(f => !f.bekannt).length).padStart(4)}`);
}
