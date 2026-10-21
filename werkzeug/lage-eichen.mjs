// dreikoerper/werkzeug/lage-eichen.mjs — taugt der Vergleich über T*?
//
//   node werkzeug/lage-eichen.mjs <lauf>
//
// Der Abgleich „Lage" behauptet: eine Bahn, die in der Liste an einer anderen
// Stelle der Ebene steht, erkennt man an gleichem T* (acht Stellen). In den
// Läufen hat er bisher nie angeschlagen — eine Prüfung, die nie ja gesagt
// hat, ist unbewiesen. Hier wird sie geeicht:
//
//   1  Gleiche Definition? Für alle Funde, die am ORT in der Liste stehen:
//      mein T* gegen das T* der Liste.
//   2  Kann sie ja sagen? Dieselben Funde, aber der Listeneintrag am eigenen
//      Ort wird ausgeblendet: findet der Vergleich über T* dann den ZWEITEN
//      Anfangswert derselben Lösung? (Hristov und Hristova: 12 431
//      Anfangswerte für 6333 Lösungen — die meisten Lösungen kreuzen die
//      Euler-Aufstellung zweimal.)
//   3  Sagt sie zu oft ja? Wie dicht liegen fremde T* beieinander: Abstand
//      jedes Listeneintrags zum nächsten mit anderem Ort und anderem T*.
//
// Exit 1, wenn 1 oder 2 nicht bestehen.

import { readFileSync } from "node:fs";
import { join } from "node:path";
import { HIER, ladeGross } from "../quellen.mjs";

const lauf = process.argv[2];
const B = JSON.parse(readFileSync(join(HIER, "ergebnisse", lauf + ".json"), "utf8"));
const G = ladeGross()[B.parameter.ebene], w = G.w, n = G.n;
const z = x => x.toExponential(1);

// nach T* sortieren
const ord = Int32Array.from({ length: n }, (_, i) => i).sort((x, y) => w[4 * x + 3] - w[4 * y + 3]);
const stelle = Ts => { let lo = 0, hi = n - 1; while (lo < hi) { const mi = (lo + hi) >> 1; if (w[4 * ord[mi] + 3] < Ts) lo = mi + 1; else hi = mi; } return lo; };

const ort = B.funde.filter(f => f.gross && f.gross.stufe === "ort");
// 1
const ab = ort.map(f => Math.abs(f.Ts / f.gross.Ts - 1)).sort((x, y) => x - y);
console.log(`1  T* der Funde gegen T* der Liste, ${ort.length} Ortstreffer: Median ${z(ab[ab.length >> 1])}, größte Abweichung ${z(ab[ab.length - 1])}`);
const ok1 = ab.length > 0 && ab[ab.length - 1] < 1e-8;

// 2
let mitPartner = 0, ohne = 0; const partnerAb = [];
for (const f of ort) {
  const k = stelle(f.Ts); let best = null, bd = Infinity;
  for (let q = Math.max(0, k - 40); q < Math.min(n, k + 40); q++) {
    const i = ord[q];
    if (Math.hypot(w[4 * i] - Math.abs(f.a), w[4 * i + 1] - Math.abs(f.b)) < 1e-4) continue;       // der eigene Ort zählt nicht
    const e = Math.abs(w[4 * i + 3] / f.Ts - 1);
    if (e < bd) { bd = e; best = i; }
  }
  if (best !== null && bd < 1e-8) { mitPartner++; partnerAb.push(bd); } else ohne++;
}
partnerAb.sort((x, y) => x - y);
console.log(`2  eigener Ort ausgeblendet: bei ${mitPartner} von ${ort.length} findet der T*-Vergleich einen zweiten Anfangswert derselben Lösung` +
  (partnerAb.length ? ` (Abweichung Median ${z(partnerAb[partnerAb.length >> 1])}, größte ${z(partnerAb[partnerAb.length - 1])})` : "") + `; ${ohne} haben keinen`);
const ok2 = mitPartner > 0;

// 3 — Abstand zum nächsten FREMDEN T* (über 1e-8 entfernt), über die ganze Liste
const luecken = [];
for (let q = 1; q < n; q++) { const a = w[4 * ord[q - 1] + 3], b = w[4 * ord[q] + 3], r = b / a - 1; if (r > 1e-8) luecken.push(r); }
luecken.sort((x, y) => x - y);
const unter = g => luecken.filter(x => x < g).length;
console.log(`3  ${luecken.length} Lücken zwischen verschiedenen T* in der Liste: kleinste ${z(luecken[0])}, 1 % unter ${z(luecken[Math.floor(luecken.length * 0.01)])}, Median ${z(luecken[luecken.length >> 1])}; unter 1e-7 liegen ${unter(1e-7)}`);
console.log(`   → bei Schwelle 1e-8 trifft ein fremdes T* nur zufällig, wenn es in einer Lücke dieser Größe liegt: Anteil der Skala, den alle Einträge mit ±1e-8 abdecken: ${(n * 2e-8 / Math.log(w[4 * ord[n - 1] + 3] / w[4 * ord[0] + 3]) * 100).toFixed(2)} %`);

// Die Funde außerhalb der Liste: Abstand zum nächsten T*
const un = B.funde.filter(f => !f.bekannt);
if (un.length) {
  const d = un.map(f => { const k = stelle(f.Ts); let bd = Infinity; for (let q = Math.max(0, k - 3); q < Math.min(n, k + 3); q++) bd = Math.min(bd, Math.abs(w[4 * ord[q] + 3] / f.Ts - 1)); return bd; }).sort((x, y) => x - y);
  console.log(`   Funde außerhalb der Liste (${un.length}): ihr nächstes Listen-T* liegt mindestens ${z(d[0])} entfernt, im Median ${z(d[d.length >> 1])}`);
}
console.log(ok1 && ok2 ? "\nDer Vergleich über T* ist geeicht: gleiche Definition, und er findet den zweiten Anfangswert." : "\nFEHL");
process.exit(ok1 && ok2 ? 0 : 1);
