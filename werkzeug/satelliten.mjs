// dreikoerper/werkzeug/satelliten.mjs — ist ein Fund „in keiner Liste" ein
// Satellit einer bekannten Bahn?
//
//   node werkzeug/satelliten.mjs euler-m3-2
//
// Ein Satellit k-ter Ordnung läuft k-mal fast denselben Weg wie seine
// Grundbahn, bevor er sich schließt: sein Wort ist (fast) das k-fache Wort,
// seine skalierte Periode T* (fast) das k-fache. Der Abgleich mit den Listen
// prüft nur gleiches T*, nie Vielfache — ein Satellit steht deshalb immer als
// „in keiner Liste", auch wenn seine Grundbahn seit Jahren bekannt ist.
//
// Grundbahnen: alle Funde des Laufs (ihr Wort ist bekannt). Je Fund außerhalb
// der Listen: das beste k ≥ 2 mit Wortlänge = k × Länge der Grundbahn und
// T*-Verhältnis innerhalb von 2 % bei k; dazu, wie viele Buchstaben das Wort
// vom k-fachen Grundwort trennen (über alle Drehungen, vorwärts und rückwärts
// gelesen, und mit vertauschten Rollen von a und b).

import { readFileSync } from "node:fs";
import { join } from "node:path";
import { HIER } from "../quellen.mjs";

const lauf = process.argv[2];
const b = JSON.parse(readFileSync(join(HIER, "ergebnisse", lauf + ".json"), "utf8"));
const name = f => (f.katalog && (f.katalog.stufe === "ort" || f.katalog.stufe === "lage") ? (f.katalog.rufname || f.katalog.name) + (f.katalog.stufe === "lage" ? " (andere Lage)" : "") : f.gross && f.gross.stufe !== "keine" ? "Hristov" : null);
const st = f => (f.stabil === true ? "stabil" : f.stabil === false ? "instabil" : "offen");
// Abwandlungen eines Wortes, die dieselbe Bahn beschreiben können
const gross = c => (c === c.toLowerCase() ? c.toUpperCase() : c.toLowerCase());
const invers = w => [...w].reverse().map(gross).join("");
const tausch = w => [...w].map(c => ({ a: "b", b: "a", A: "B", B: "A" }[c] || c)).join("");
const formen = w => { const s = new Set(); for (const x of [w, invers(w), tausch(w), invers(tausch(w)), [...w].map(gross).join(""), [...tausch(w)].map(gross).join("")]) s.add(x); return [...s]; };
function abstand(wort, grund, k) {          // kleinste Zahl abweichender Buchstaben
  const ziel = grund.repeat(k), n = ziel.length;
  if (wort.length !== n) return Infinity;
  let best = Infinity;
  for (const z of formen(ziel)) for (let d = 0; d < grund.length; d++) {
    let ab = 0;
    for (let i = 0; i < n && ab < best; i++) if (wort[i] !== z[(i + d) % n]) ab++;
    if (ab < best) best = ab;
  }
  return best;
}
const basen = b.funde.filter(f => f.wort && f.wort.length >= 2);
const treffer = [];
for (const f of b.funde) {
  if (f.bekannt || !f.wort || !f.wort.length) continue;
  let best = null;
  for (const g of basen) {
    if (g === f || g.Ts > f.Ts / 1.5) continue;
    const k = Math.round(f.Ts / g.Ts);
    if (k < 2 || f.wort.length !== k * g.wort.length) continue;
    const ab = Math.abs(f.Ts / (k * g.Ts) - 1);
    if (ab > 0.02) continue;
    const buch = abstand(f.wort, g.wort, k);
    if (!best || buch < best.buch || (buch === best.buch && ab < best.ab)) best = { g, k, ab, buch };
  }
  if (best) treffer.push({ f, ...best });
}
const un = b.funde.filter(f => !f.bekannt);
console.log(`${lauf}: ${un.length} Funde in keiner Liste; davon mit k-facher Wortlänge und k-fachem T* (±2 %) einer anderen Bahn des Laufs: ${treffer.length}`);
const genau = treffer.filter(t => t.buch === 0), nah = treffer.filter(t => t.buch > 0 && t.buch <= 4);
console.log(`  Wort genau das k-fache: ${genau.length} · bis auf höchstens vier Buchstaben: ${nah.length} · weiter weg: ${treffer.length - genau.length - nah.length}`);
console.log(`  Grundbahn in einer Liste: ${treffer.filter(t => t.buch <= 4 && name(t.g)).length} · Grundbahn selbst in keiner Liste: ${treffer.filter(t => t.buch <= 4 && !name(t.g)).length}`);
treffer.sort((x, y) => x.buch - y.buch || x.ab - y.ab);
for (const t of treffer.slice(0, 40)) console.log(`  T* ${t.f.Ts.toFixed(4).padStart(9)} (${t.f.a.toFixed(6)}, ${t.f.b.toFixed(6)}) ${st(t.f).padEnd(8)} Wort ${String(t.f.wort.length).padStart(3)}  =  ${t.k} × ${name(t.g) || "Fund ohne Liste"} (T* ${t.g.Ts.toFixed(4)}, Wort ${t.g.wort.length}, ${st(t.g)})  T*-Verhältnis ${(t.f.Ts / t.g.Ts).toFixed(5)}  abweichende Buchstaben ${t.buch}`);
