// dreikoerper/werkzeug/fast-vielfach.mjs — ist eine Bahn ein Ableger von
// irgendetwas? (21.10.2026, am 04.11.2026 auf den direkten Vergleich umgestellt)
//
//   node werkzeug/fast-vielfach.mjs <lauf> <T> [<lauf> <T> …]
//
// Ein Ableger (Satellit) läuft k-mal fast entlang einer anderen Bahn; sein
// Wort ist dann fast das k-fache eines kürzeren. Hier ohne jede Liste: für
// k = 2 … 8 (wo k die Länge teilt), jede Drehung und beide Leserichtungen wird
// das k-fache Basiswort gebildet, das Buchstabe für Buchstabe am häufigsten
// passt, und gezählt, in wie vielen Buchstaben das Wort davon abweicht.
// Die Regel der Läufe nennt einen Satelliten bei höchstens vier.
//
// Die erste Fassung verglich das Wort mit sich selbst, um L/k verdreht — das
// zählt jede Abweichung doppelt und trennte nicht (bekannte Satelliten bis 8,
// Nicht-Satelliten zu 27 % ebenso). Eichung jetzt: alle Satelliten, die die
// Läufe selbst erkannt haben, müssen bei ≤ 4 liegen.
// Ergebnis zusätzlich nach ergebnisse/fast-vielfach.json.

import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { HIER, ladeKern } from "../quellen.mjs";

const K = ladeKern(), argv = process.argv.slice(2), u0 = new Float64Array(12);
const wort = (f, m) => { K.EBENEN.euler.anfang(f.a, f.b, m, u0); const dg = K.durchgaenge(u0, m, f.T, 1e-11); return K.wortAus(dg.folge, dg.richtung); };
export function naechstesVielfaches(W, kNur) {
  const L = W.length; let best = { k: null, basis: null, abweichung: Infinity };
  for (let k = 2; k <= 8; k++) {
    if ((kNur && k !== kNur) || L % k) continue;
    const s = L / k;
    for (const v of [W, [...W].reverse().join("")]) for (let r = 0; r < s; r++) {
      const x = v.slice(r) + v.slice(0, r);
      const basis = Array.from({ length: s }, (_, j) => { const c = {}; for (let i = j; i < L; i += s) c[x[i]] = (c[x[i]] || 0) + 1; return Object.entries(c).sort((p, q) => q[1] - p[1])[0][0]; }).join("");
      let d = 0; for (let i = 0; i < L; i++) if (x[i] !== basis[i % s]) d++;
      if (d < best.abweichung) best = { k, basis, abweichung: d };
    }
  }
  return best;
}
const B = {};
const lade = l => (B[l] = B[l] || JSON.parse(readFileSync(join(HIER, "ergebnisse", l + ".json"), "utf8")));
const bahnen = [];
for (let i = 0; i < argv.length; i += 2) {
  const l = argv[i], T = +argv[i + 1], R = lade(l), f = R.funde.find(x => Math.abs(x.T - T) < 1e-3);
  const w = wort(f, R.parameter.m), n = naechstesVielfaches(w);
  bahnen.push({ lauf: l, T, wort: w, buchstaben: w.length, ...n, ableger: n.abweichung <= 4 });
  console.log(`${l} T ${T}: Wort ${w.length} Buchstaben ${w}; nächstes Fast-Vielfaches k=${n.k} (Basis ${n.basis}) mit ${n.abweichung} abweichenden Buchstaben → ${n.abweichung <= 4 ? "FAST-VIELFACHES" : "kein Ableger von irgendetwas"}`);
}
// Eichung an den Satelliten, die die Läufe selbst erkannt haben (Ordnung ≤ 8)
let gezaehlt = 0, getroffen = 0;
for (const l of ["euler-m3-05", "euler-m3-075", "euler-m3-4-v2gross", "euler-m3-5-v2gross", "euler-m3-2-v2gross"]) {
  const R = lade(l);
  for (const f of R.funde.filter(x => x.satellit && x.satellit.ordnung <= 8)) {
    gezaehlt++;
    if (naechstesVielfaches(wort(f, R.parameter.m), f.satellit.ordnung).abweichung <= 4) getroffen++;
  }
}
console.log(`Eichung: ${getroffen} von ${gezaehlt} von den Läufen erkannten Satelliten liegen bei ≤ 4 abweichenden Buchstaben`);
writeFileSync(join(HIER, "ergebnisse", "fast-vielfach.json"), JSON.stringify({ erzeugt: new Date().toISOString(), schwelle: 4, eichung: { satelliten: gezaehlt, getroffen }, bahnen }, null, 1));
