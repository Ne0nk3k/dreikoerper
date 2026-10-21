// dreikoerper/werkzeug/fortsetzung-zurueck.mjs — Gegenprobe zu
// massen-fortsetzung.mjs: von der Listenbahn I.A-5 bei 1/1/2 (Li, Jing &
// Liao 2018) aufwärts bis m₃ = 4. Landet der Zweig dort auf der stabilen
// Bahn T = 53,25, ist die Verbindung in beiden Richtungen belegt (21.10.2026).
//
//   node werkzeug/fortsetzung-zurueck.mjs [--h 0.005]
//
// Feste kleine Schritte, Vorhersage linear aus den letzten zwei Punkten; kein
// Wachsen der Schrittweite, damit kein Sprung auf einen Nachbarzweig unbemerkt
// bleibt. Die Kennung muss auf dem ganzen Weg dieselbe bleiben.

import { ladeKern, ladeKatalog } from "../quellen.mjs";

const K = ladeKern(), pruefe = K.macheFundpruefer();
const H = +(process.argv.includes("--h") ? process.argv[process.argv.indexOf("--h") + 1] : 0.005);
const ziel = { a: 0.80329455331149897894751545304123, b: 1.43593335078306727053457398659518, T: 53.25485430443248007068935995289679 };
const ia5 = ladeKatalog().bahnen.find(k => k.ebene === "euler" && k.m[2] === 2 && k.name === "I.A-5");
const punkt = (m3, a, b, T) => { const p = pruefe("euler", [1, 1, m3], a, b, T, { ohneStabil: true }); return p.ok ? p : null; };

let l = punkt(2, ia5.a, ia5.b, ia5.T), v = null;
if (!l) throw new Error("I.A-5 nimmt Newton nicht an");
console.log(`I.A-5 bei 1/1/2 verfeinert: a ${l.a} b ${l.b} T ${l.T} (Liste: ${ia5.a}, ${ia5.b}, ${ia5.T}), Kennung ${l.kennung}`);
const kennung = l.kennung, t0 = Date.now();
// Bei m₃ = 2 ist der Zweig steil (|db/dm₃| ≈ 9, gemessen in der Hinrichtung):
// mit festen 0,005 nahm Newton schon den ersten Schritt nicht an. Darum
// klein anfangen (1e-4), bei Erfolg verdoppeln bis höchstens H, bei
// Misserfolg halbieren bis 1e-7.
let n = 0, wechsel = 0, h = 1e-4;
for (;;) {
  const m3 = Math.min(4, l.m[2] + h), f = v ? (m3 - l.m[2]) / (l.m[2] - v.m[2]) : 0;
  const q = punkt(m3, l.a + f * (l.a - (v ? v.a : l.a)), l.b + f * (l.b - (v ? v.b : l.b)), l.T + f * (l.T - (v ? v.T : l.T)));
  const sprung = q ? Math.hypot(q.a - l.a, q.b - l.b) : Infinity;
  if (!q || (q.teiler || 1) > 1 || sprung > 0.05) {
    h /= 2;
    if (h < 1e-7) { console.log(`ABBRUCH bei m3 = ${l.m[2]}: ${!q ? "Newton nimmt nicht an" : (q.teiler || 1) > 1 ? "kürzere Grundperiode" : "Sprung " + sprung.toExponential(1)}`); process.exit(1); }
    continue;
  }
  if (q.kennung !== kennung) wechsel++;
  v = l; l = q; n++;
  if (m3 >= 4) break;
  h = Math.min(H, h * 2);
}
const d = { a: l.a - ziel.a, b: l.b - ziel.b, T: l.T - ziel.T };
console.log(`${n} Schritte zu ${H}, ${((Date.now() - t0) / 1000).toFixed(0)} s, Kennungswechsel ${wechsel}`);
console.log(`bei m3 = 4 angekommen: a ${l.a} b ${l.b} T ${l.T}`);
console.log(`Abstand zur stabilen Bahn T = 53,25: Δa ${d.a.toExponential(2)} Δb ${d.b.toExponential(2)} ΔT ${d.T.toExponential(2)}`);
const getroffen = Math.abs(d.a) < 1e-8 && Math.abs(d.b) < 1e-8 && Math.abs(d.T) < 1e-6 && wechsel === 0;
console.log(getroffen ? "ERGEBNIS: der Zweig von I.A-5 (1/1/2) führt auf die stabile Bahn bei 1/1/4." : "ERGEBNIS: nicht dieselbe Bahn erreicht.");
process.exit(getroffen ? 0 : 1);
