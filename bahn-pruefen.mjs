// dreikoerper/bahn-pruefen.mjs — eine einzelne Bahn nachrechnen, ohne Kataloge
// und ohne fremde Daten.
//
//   node bahn-pruefen.mjs                     die stabile Bahn bei 1/1/4
//   node bahn-pruefen.mjs --m 1,1,4 --a <v1> --b <v2> --T <T> [--ebene euler|fall]
//
// Für Leser des öffentlichen Repos (21.10.2026): eine Zahl, die sie selbst
// erzeugen, bevor sie irgendetwas anderes glauben. Die Ziffern werden so
// gerechnet, wie sie dastehen — nicht verfeinert. Ein Umlauf in Festkomma
// (320 Bit, Ordnung 40) und dieselbe Rechnung noch einmal mit 448 Bit,
// Ordnung 52; danach die Stabilitätsindizes aus der Monodromie (genau.mjs,
// mit Gegenprobe). Ausgabe englisch, weil ihre Leser es sind; dauert bei der
// 1/1/4-Bahn gut vier Minuten auf einem Kern (gemessen 251 s, 21.10.2026).
// Gegenprobe: T in der 20. Nachkommastelle um 1 verändert gibt 6,5e-19 und
// Exit 1.

import { ladeKern } from "./quellen.mjs";
import { macheGenau, stabilitaetGenau } from "./genau.mjs";

const K = ladeKern();
const argv = process.argv.slice(2);
const wert = (name, vorgabe) => (argv.includes(name) ? argv[argv.indexOf(name) + 1] : vorgabe);

// Die Bahn aus ergebnisse/funde.json (Kennung gqnupb8c33), 32 Stellen
const VORGABE = { ebene: "euler", m: "1,1,4",
  a: "0.80329455331149897894751545304123", b: "1.43593335078306727053457398659518", T: "53.25485430443248007068935995289679" };
const ebene = wert("--ebene", VORGABE.ebene), mT = wert("--m", VORGABE.m).split(",");
const a = wert("--a", VORGABE.a), b = wert("--b", VORGABE.b), T = wert("--T", VORGABE.T);
if (!K.EBENEN[ebene] || mT.length !== 3 || [a, b, T, ...mT].some(x => !/^-?\d+(\.\d+)?$/.test(x))) {
  console.error("usage: node bahn-pruefen.mjs [--ebene euler|fall] --m m1,m2,m3 --a <decimal> --b <decimal> --T <decimal>");
  process.exit(2);
}

console.log(`plane ${ebene}, masses ${mT.join("/")}\n  a = ${a}\n  b = ${b}\n  T = ${T}\n`);
console.log(ebene === "euler"
  ? "Initial state: r1 = (-1,0), r2 = (1,0), r3 = (0,0), v1 = v2 = (a,b), v3 = -(m1+m2)/m3 (a,b), G = 1."
  : "Initial state: free fall from rest, see kern.js (EBENEN.fall).");

function wiederkehr(bits, ordnung) {
  const G = macheGenau(bits, ordnung), mF = mT.map(G.ausDezimal), mD = mT.map(Number);
  const u0 = G.anfang(ebene, G.ausDezimal(a), G.ausDezimal(b), mF), u = u0.slice();
  const t0 = Date.now(), e = G.lauf(u, mF, G.ausDezimal(T), -38 * Math.log2(10));
  if (e.art !== 0) return { abbruch: true };
  const d = new Float64Array(12);
  for (let i = 0; i < 12; i++) d[i] = G.zuZahl(u[i] - u0[i]);
  return { rest: K.abstand(d, new Float64Array(12), mD), schritte: e.schritte, sekunden: (Date.now() - t0) / 1000 };
}

let schlecht = false;
for (const [bits, ordnung] of [[320, 40], [448, 52]]) {
  const w = wiederkehr(bits, ordnung);
  if (w.abbruch) { console.log(`\n${bits} bits: integration stopped (collision or step limit)`); schlecht = true; continue; }
  console.log(`\nreturn distance after one period, ${bits} bits, Taylor order ${ordnung}: ${w.rest.toExponential(2)}  (${w.schritte} steps, ${w.sekunden.toFixed(0)} s)`);
  if (!(w.rest < 1e-25)) schlecht = true;
}

const s = stabilitaetGenau(ebene, mT, a, b, T, { gegenprobe: true });
if (!s.ok) { console.log("\nstability: integration stopped"); process.exit(1); }
console.log(`\nstability indices s = λ + 1/λ from the monodromy trace (|s| < 2 for both: linearly stable):`);
if (s.komplex) console.log(`  s = ${s.s1.toFixed(12)} ± ${s.sIm.toExponential(3)} i`);
else console.log(`  s1 = ${s.s1Text}\n  s2 = ${s.s2Text}`);
console.log(`  difference to a second computation with 128 more bits (compared in double precision): ${(s.unterschied ?? NaN).toExponential(1)}`);
console.log(`  verdict: ${{ stabil: "linearly stable", instabil: "unstable", "an der Grenze": "at the stability boundary (not separable at this precision)" }[s.urteil]}`);
console.log(schlecht ? "\nRESULT: the digits do NOT return to within 1e-25." : "\nRESULT: periodic to better than 1e-25 at both precisions.");
process.exit(schlecht ? 1 : 0);
