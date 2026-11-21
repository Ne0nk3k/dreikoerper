// dreikoerper/werkzeug/halb-fortsetzung-probe.mjs — trägt Newton auf der halben Periode weiter,
// wo Newton auf der ganzen an engen Begegnungen scheitert? (06.11.2026, Probe für den Baustein
// nach der Nacht)
//
//   node werkzeug/halb-fortsetzung-probe.mjs <Name> <m3> [--richtung -1|1|0] [--max 400]
//
// Die Euler-Bahn startet auf der Fixmenge A3 und trifft nach τ = T/2 (oder T/4) wieder eine
// Fixmenge s — welche, liest das Skript an der Listenbahn ab (kleinstes |g_s(u(τ))|). Dann
// Fortsetzung in m3 mit dem Halbverfeinerer des Kerns (löst g_s(u(τ; a, b)) = 0 für a, b, τ),
// lineare Vorhersage aus den letzten zwei Punkten, Schritt 0,01 halbiert bis 1e-4, nach
// Erfolg ×1,5 bis 0,05. Je Punkt: Rest, Rückkehr nach der ganzen Periode (double), engste
// Begegnung, Stabilität in double (nur Hinweis). Vergleich mit massen-fortsetzung.mjs in der
// Stichprobe vom 06.11.2026 (ganze Periode): I.A-46@2 kam 1,877 … 2,046, I.A-94@0.75
// 0,732 … 0,783, II.C-6@5 keinen Schritt.

import { HIER, ladeKern, ladeKatalog } from "../quellen.mjs";

const K = ladeKern(), argv = process.argv.slice(2);
const [NAME, M3] = [argv[0], +argv[1]], arg = (n, v) => (argv.includes(n) ? +argv[argv.indexOf(n) + 1] : v);
const MAX = arg("--max", 400), NUR = arg("--richtung", 0);
const b0 = ladeKatalog().bahnen.find(b => b.satz === "ungleich" && b.name === NAME && b.m[2] === M3);
if (!b0) { console.error("nicht in der Liste:", NAME, M3); process.exit(2); }
const halb = K.macheHalbverfeinerer(), variation = K.macheVariation(), u = new Float64Array(12), g = [0, 0, 0];

// Ziel s und τ an der Listenbahn ablesen
const m0 = [1, 1, M3];
let best = null;
for (const teil of [2, 4]) {
  K.EBENEN.euler.anfang(b0.a, b0.b, m0, u);
  if (K.taylor(u, m0, b0.T / teil, 1e-15, 1e8).art !== 0) continue;
  for (const s of K.erlaubteZiele(m0)) { const w = K.umkehr(s, u, g); if (!best || w < best.w) best = { s, teil, w }; }
}
console.log(`${NAME}@${M3}: T ${b0.T}, Ziel ${K.ZIELE[best.s]} bei T/${best.teil}, |g| ${best.w.toExponential(1)}`);

function punkt(m3, a, b, tau) {
  const t0 = Date.now(), m = [1, 1, m3], r = halb("euler", m, a, b, tau, best.s, { maxIter: 20 });
  if (!r.ok) return null;
  const T = r.tau * best.teil, u0 = K.EBENEN.euler.anfang(r.a, r.b, m, new Float64Array(12)), uT = u0.slice();
  const e = K.taylor(uT, m, T, 1e-15, 1e8), rueck = e.art === 0 ? K.abstand(uT, u0, m) : NaN;
  const dg = K.durchgaenge(u0, m, T, 1e-11);
  const Y = variation(u0, m, T, 1e-16, 1e8), st = Y.art === 0 ? K.stabilitaet(Y.y) : { s1: NaN, s2: NaN };
  return { m3, a: r.a, b: r.b, tau: r.tau, T, rest: r.rest, rueck, rMin: dg.rMin, s1: st.s1, s2: st.s2, komplex: st.komplex, sek: (Date.now() - t0) / 1000 };
}
const p0 = punkt(M3, b0.a, b0.b, b0.T / best.teil);
if (!p0) { console.log("Startpunkt: Halbverfeinerer nimmt nicht an"); process.exit(1); }
console.log(`Start: Rest ${p0.rest.toExponential(1)}, Rückkehr ${p0.rueck.toExponential(1)}, rMin ${p0.rMin.toExponential(1)}, ${p0.sek.toFixed(1)} s je Punkt`);
const t00 = Date.now(), ergebnis = {};
for (const richtung of NUR ? [NUR] : [-1, 1]) {
  const pts = [p0]; let h = 0.01, grund = "Grenze erreicht";
  while (pts.length < MAX) {
    const l = pts[pts.length - 1], v = pts.length > 1 ? pts[pts.length - 2] : null, m3 = l.m3 + richtung * h;
    if (m3 < 0.5 - 1e-12 || m3 > 10 + 1e-12) break;
    const f = v ? (m3 - l.m3) / (l.m3 - v.m3) : 0;
    const q = punkt(m3, l.a + f * (l.a - (v ? v.a : l.a)), l.b + f * (l.b - (v ? v.b : l.b)), l.tau + f * (l.tau - (v ? v.tau : l.tau)));
    const gut = q && Math.abs(q.tau / l.tau - 1) < 0.05 + 5 * h && Math.hypot(q.a - l.a, q.b - l.b) < 0.05 + 5 * h;
    if (!gut) { h /= 2; if (h < 1e-4) { grund = q ? "Sprung zu groß" : "Halbverfeinerer nimmt nicht an"; break; } continue; }
    pts.push(q); h = Math.min(0.05, h * 1.5);
  }
  const e = pts[pts.length - 1];
  ergebnis[richtung] = { bis: e.m3, punkte: pts.length - 1, grund, rMinEnde: e.rMin, rueckEnde: e.rueck };
  console.log(`${richtung < 0 ? "abwärts" : "aufwärts"}: bis m3 ${e.m3.toFixed(4)}, ${pts.length - 1} Punkte, ${grund}; am Ende rMin ${e.rMin.toExponential(1)}, Rückkehr ${e.rueck.toExponential(1)}, s ${e.s1.toFixed(3)} / ${e.s2.toFixed(3)}`);
}
console.log(`fertig in ${((Date.now() - t00) / 1000).toFixed(0)} s`);
