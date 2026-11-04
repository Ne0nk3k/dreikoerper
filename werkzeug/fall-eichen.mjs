// dreikoerper/werkzeug/fall-eichen.mjs — taugt der Wortvergleich zwischen
// Euler-Ebene und freiem Fall? (21.10.2026)
//
//   node werkzeug/fall-eichen.mjs [--max 800]
//
// woerter-fall.mjs paarte die Punktsymmetrie-Liste aus Sofia (euler_100_4860
// und free_100_4860) nach der Zeile und fand nur 43 von 557 gleiche Wörter.
// Entweder stehen die Bahnen in den Dateien nicht in derselben Reihenfolge,
// oder das zyklische Wort einer Bahn hängt davon ab, in welcher Ebene man sie
// startet. Hier wird nach T* gepaart (dieselbe Bahn hat in beiden Ebenen
// dasselbe T*, Toleranz 1e-9 relativ) — erst wenn die gepaarten Wörter dann
// gleich sind, darf der Abgleich über die Ebenen etwas bedeuten.

import { HIER, ladeKern, ladeGross } from "../quellen.mjs";

const argv = process.argv.slice(2), MAX = argv.includes("--max") ? +argv[argv.indexOf("--max") + 1] : 800;
const K = ladeKern(), G = ladeGross(), u0 = new Float64Array(12);
const wortVon = (ebene, a, b, T) => {
  K.EBENEN[ebene].anfang(a, b, [1, 1, 1], u0);
  const dg = K.durchgaenge(u0, [1, 1, 1], T, 1e-11);
  return dg.folge && dg.folge.length ? K.streu(K.kennung(dg.folge, null)) : null;
};
const qE = G.meta.ebenen.euler.quellen.findIndex(x => x.datei === "sym4860/euler_100_4860.txt");
const qF = G.meta.ebenen.fall.quellen.findIndex(x => x.datei === "sym4860/free_100_4860.txt");
const liste = (E, q) => { const a = []; for (let i = 0; i < E.n; i++) if (E.q[i] === q) a.push(i); return a; };
const fall = liste(G.fall, qF).map(i => ({ i, Ts: G.fall.w[4 * i + 3] })).sort((x, y) => x.Ts - y.Ts);
const euler = liste(G.euler, qE);
let gepaart = 0, gleich = 0, ohnePartner = 0, n = 0;
for (const i of euler) {
  if (n++ >= MAX) break;
  const Ts = G.euler.w[4 * i + 3];
  let lo = 0, hi = fall.length - 1;
  while (lo < hi) { const mi = (lo + hi) >> 1; if (fall[mi].Ts < Ts) lo = mi + 1; else hi = mi; }
  const kand = [fall[lo - 1], fall[lo], fall[lo + 1]].filter(x => x && Math.abs(x.Ts / Ts - 1) < 1e-9);
  if (!kand.length) { ohnePartner++; continue; }
  const we = wortVon("euler", G.euler.w[4 * i], G.euler.w[4 * i + 1], G.euler.w[4 * i + 2]);
  const wf = kand.map(x => wortVon("fall", G.fall.w[4 * x.i], G.fall.w[4 * x.i + 1], G.fall.w[4 * x.i + 2]));
  if (!we || !wf.some(Boolean)) continue;
  gepaart++;
  if (wf.includes(we)) gleich++;
}
console.log(`Punktsymmetrie-Liste, nach T* gepaart: ${gleich} von ${gepaart} Paaren mit gleichem Wort; ${ohnePartner} Euler-Bahnen ohne Freifall-Partner mit gleichem T* (von ${Math.min(MAX, euler.length)})`);
