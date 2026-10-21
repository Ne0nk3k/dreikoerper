// dreikoerper/werkzeug/fenster.mjs — wo in der Euler-Ebene liegen die
// Listenbahnen einer Masse, und welches Suchfenster deckt sie?
//
//   node werkzeug/fenster.mjs
//
// Für jeden Massensatz der Euler-Ebene im Katalog: Spanne der Anfangswerte
// (|v₁|, |v₂|), der Perioden, und wie viele Bahnen ein Fenster trifft. Das
// Fenster eines Suchlaufs soll die Liste decken — sonst lässt sich am
// Wiederfinden nicht ablesen, wie vollständig der Lauf ist.

import { ladeKatalog } from "../quellen.mjs";

const kat = ladeKatalog();
const gruppen = new Map();
for (const k of kat.bahnen) if (k.ebene === "euler") { const s = k.m.join("/"); if (!gruppen.has(s)) gruppen.set(s, []); gruppen.get(s).push(k); }
const q = (liste, p) => liste[Math.min(liste.length - 1, Math.floor(p * liste.length))];
for (const [s, liste] of gruppen) {
  const A = liste.map(k => Math.abs(k.a)).sort((x, y) => x - y), B = liste.map(k => Math.abs(k.b)).sort((x, y) => x - y), T = liste.map(k => k.T).sort((x, y) => x - y);
  console.log(`\nMassen ${s}: ${liste.length} Bahnen`);
  console.log(`  |v₁| ${A[0].toFixed(3)} … ${A[A.length - 1].toFixed(3)} (95 % unter ${q(A, 0.95).toFixed(3)})   |v₂| ${B[0].toFixed(3)} … ${B[B.length - 1].toFixed(3)} (95 % unter ${q(B, 0.95).toFixed(3)})   T ${T[0].toFixed(2)} … ${T[T.length - 1].toFixed(2)} (Median ${q(T, 0.5).toFixed(1)})`);
  for (const [a1, b1] of [[0.75, 0.75], [1, 1], [1.25, 1.25], [1.5, 1.5]]) {
    const drin = liste.filter(k => Math.abs(k.a) <= a1 && Math.abs(k.b) <= b1);
    console.log(`  Fenster 0…${a1} × 0…${b1}: ${String(drin.length).padStart(4)} Bahnen, davon T ≤ 40: ${String(drin.filter(k => k.T <= 40).length).padStart(4)}, T ≤ 80: ${String(drin.filter(k => k.T <= 80).length).padStart(4)}`);
  }
}
