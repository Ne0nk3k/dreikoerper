// dreikoerper/werkzeug/fall-wort.mjs — wie lesen Li und Liao die Wörter im
// freien Fall? Rechnet das ungekürzte Wort über die volle Periode und
// vergleicht es buchstäblich und bis auf Drehung mit dem veröffentlichten.
//
//   node werkzeug/fall-wort.mjs [N=30]

import { ladeKern, ladeQuellen } from "../quellen.mjs";
const K = ladeKern(), Q = ladeQuellen();
const N = +(process.argv[2] || 30), z0 = new Float64Array(12);

let palindrom = 0;
for (const e of Q.fall) { const h = e.wort.length / 2; if (e.wort.slice(h) === K.invertiere(e.wort.slice(0, h))) palindrom++; }
console.log(`veröffentlichte Wörter der Form w·w⁻¹: ${palindrom} von ${Q.fall.length}`);

const lesarten = [];
for (const perm of K.PERMS) for (const nord of [1, -1]) for (const kehre of [false, true])
  lesarten.push({ perm, nord, kehre, gleich: 0, gedreht: 0 });
let n = 0;
for (const e of Q.fall.slice(0, N)) {
  K.EBENEN.fall.anfang(e.a, e.b, e.m, z0);
  const d = K.durchgaenge(z0, e.m, e.T, 1e-11);
  n++;
  for (const l of lesarten) {
    const w = K.wortRoh(d.folge, d.richtung, l);
    if (w === e.wort) l.gleich++;
    if (K.kleinsteDrehung(w) === K.kleinsteDrehung(e.wort)) l.gedreht++;
  }
  if (n <= 4) console.log(e.name, e.m.join(","), "Folge", d.folge.join(""), "stimmig", d.stimmig,
                          "\n   roh ", K.wortRoh(d.folge, d.richtung), "\n   soll", e.wort);
}
lesarten.sort((a, b) => b.gleich + b.gedreht - a.gleich - a.gedreht);
console.log(`${n} Bahnen`);
for (const l of lesarten.slice(0, 6))
  console.log(`  perm ${l.perm.join("")} nord ${l.nord > 0 ? "+" : "-"} kehre ${l.kehre ? "ja  " : "nein"}  buchstäblich ${l.gleich}  bis auf Drehung ${l.gedreht}`);
