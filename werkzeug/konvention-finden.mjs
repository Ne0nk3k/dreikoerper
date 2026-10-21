// dreikoerper/werkzeug/konvention-finden.mjs
//
// Welche Lesart macht aus meiner Durchgangsfolge genau das Wort, das Li und
// Liao veröffentlicht haben? Probiert alle 6 Körperzuordnungen × 2 Halbkugeln
// × 2 (Wort oder Kehrwort) an den ersten N Bahnen des Katalogs und druckt, wie
// viele jede Lesart trifft. Nur eine darf alle treffen.
//
//   node werkzeug/konvention-finden.mjs [N=40] [gleich|ungleich|fall]

import { ladeKern, ladeQuellen } from "../quellen.mjs";

const K = ladeKern(), Q = ladeQuellen();
const N = +(process.argv[2] || 40), satz = process.argv[3] || "gleich";
const z0 = new Float64Array(12);

const bahnen = Q[satz].filter(e => e.T < 60).slice(0, N);
const lesarten = [];
for (const perm of K.PERMS) for (const nord of [1, -1]) for (const kehre of [false, true])
  lesarten.push({ perm, nord, kehre, treffer: 0 });

let gerechnet = 0;
for (const e of bahnen) {
  K.EBENEN[e.ebene].anfang(e.a, e.b, e.m, z0);
  const T = satz === "fall" ? e.T / 2 : e.T;
  const d = K.durchgaenge(z0, e.m, T, 1e-11);
  if (!d.stimmig && satz !== "fall") { console.log("unstimmig:", e.name, d.folge.join("")); continue; }
  gerechnet++;
  const soll = K.kleinsteDrehung(e.wort);
  for (const l of lesarten) if (K.wortAus(d.folge, d.richtung, l) === soll) l.treffer++;
  if (gerechnet <= 3) console.log(e.name, "Folge", d.folge.join(""), "Soll", e.wort);
}
lesarten.sort((a, b) => b.treffer - a.treffer);
console.log(`${gerechnet} Bahnen gerechnet`);
for (const l of lesarten.slice(0, 8))
  console.log(`  perm ${l.perm.join("")}  nord ${l.nord > 0 ? "+" : "-"}  kehre ${l.kehre ? "ja  " : "nein"}  trifft ${l.treffer}`);
