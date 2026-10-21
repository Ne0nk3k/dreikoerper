// dreikoerper/pruef-genau.mjs — Eichung der Rechnung in erhöhter Genauigkeit.
//
//   node pruef-genau.mjs
//
// Bekannte Antworten zuerst (√2, die Lagrange-Kreisbahn analytisch), dann
// die Acht, dann die Gegenproben. Urteil im Exit-Code.

import { macheGenau, verfeinereGenau, stabilitaetGenauAusZustand } from "./genau.mjs";
import { ladeQuellen, ladeKern } from "./quellen.mjs";

const Q = ladeQuellen();
let fehl = 0, gesamt = 0;
const z = x => (typeof x === "number" ? (x === 0 ? "0" : Math.abs(x) < 1e-3 || Math.abs(x) >= 1e5 ? x.toExponential(2) : x.toPrecision(6)) : String(x));
function pruefe(name, ok, wert) { gesamt++; if (!ok) fehl++; console.log(`  ${ok ? "ok  " : "FEHL"}  ${name}${wert !== undefined ? "   [" + wert + "]" : ""}`); }

console.log("\nA · Festkomma und Reihe an bekannten Antworten");
const G = macheGenau(320, 40);
{
  const w2 = G.zuDezimal(G.wurzel(2n * G.EINS), 50);
  // √2 auf 50 Stellen (OEIS A002193)
  const soll = "1.41421356237309504880168872420969807856967187537694";
  pruefe("√2 auf 50 Stellen", w2 === soll, w2);
  pruefe("0.8 als Dezimalzahl ist 0.8, nicht der nächste double", G.zuDezimal(G.ausDezimal("0.8"), 40) === "0." + "7".repeat(0) + "8" + "0".repeat(39) || G.zuDezimal(G.ausDezimal("0.8"), 40) === "0.7" + "9".repeat(39), G.zuDezimal(G.ausDezimal("0.8"), 40));
  pruefe("double hinein und heraus ist exakt", G.zuZahl(G.ausZahl(0.3471168881)) === 0.3471168881 && G.zuZahl(G.ausZahl(-123456.789e-9)) === -123456.789e-9, String(G.zuZahl(G.ausZahl(0.3471168881))));
}
{
  // Lagrange-Kreisbahn, gleiche Massen, Seitenlänge 1: ω = √3. Nach t = 1
  // ist jeder Abstandsvektor um den Winkel √3 gedreht. Sinus und Kosinus
  // hier über ihre Reihen in derselben Festkommarechnung.
  const E = G.EINS, w = G.wurzel(3n * E);
  const sinCos = x => { let s = 0n, c = 0n, glied = E; for (let k = 0; k < 120; k++) { if (k % 2 === 0) c += (k % 4 === 0 ? glied : -glied); else s += (k % 4 === 1 ? glied : -glied); glied = G.mal(glied, x) / BigInt(k + 1); } return [s, c]; };
  const [si, co] = sinCos(w);
  const h3 = G.wurzel(3n * E) / 2n, halb = E / 2n;
  // Orte (0,0), (1,0), (½, √3/2); v = ω × r
  const P = [[0n, 0n], [E, 0n], [halb, h3]], u = new Array(12).fill(0n);
  const paare = [[0, 1], [0, 2], [1, 2]];
  for (let p = 0; p < 3; p++) {
    const [i, j] = paare[p], dx = P[j][0] - P[i][0], dy = P[j][1] - P[i][1];
    u[2 * p] = dx; u[2 * p + 1] = dy; u[6 + 2 * p] = -G.mal(w, dy); u[7 + 2 * p] = G.mal(w, dx);
  }
  const u0 = u.slice(), m = [E, E, E];
  const e = G.lauf(u, m, E, -34 * Math.log2(10));
  let ab = 0;
  for (let k = 0; k < 6; k++) {
    const x = u0[2 * k], y = u0[2 * k + 1];
    const sx = G.mal(co, x) - G.mal(si, y), sy = G.mal(si, x) + G.mal(co, y);
    ab = Math.max(ab, Math.abs(G.zuZahl(u[2 * k] - sx)), Math.abs(G.zuZahl(u[2 * k + 1] - sy)));
  }
  pruefe("Lagrange-Kreisbahn nach t = 1 wie analytisch (unter 1e-30)", e.art === 0 && ab < 1e-30, `größte Abweichung ${z(ab)}, ${e.schritte} Schritte`);
  const dE = Math.abs(G.zuZahl(G.energie(u, m) - G.energie(u0, m)));
  pruefe("Energie dabei erhalten (unter 1e-30)", dE < 1e-30, z(dE));
}

console.log("\nB · Die Acht");
let acht;
{
  const e = Q.gleich[0], t0 = Date.now();
  acht = verfeinereGenau("euler", ["1", "1", "1"], e.a, e.b, e.T, { stellen: 30 });
  pruefe("Verfeinerung der Acht auf 30 Stellen", acht.ok && acht.rest < 1e-30, `Rest ${z(acht.rest)}, Verlauf ${acht.verlauf.map(z).join(" → ")}, ${((Date.now() - t0) / 1000).toFixed(1)} s`);
  pruefe("bleibt bei den zehn Katalogziffern", Math.abs(acht.korrektur[0]) < 5e-10 && Math.abs(acht.korrektur[1]) < 5e-10, `v₁ = ${acht.a}, v₂ = ${acht.b}, T = ${acht.T}`);
  pruefe("Gegenprobe mit 448 Bit und Ordnung 52: derselbe Rest", acht.unterschiedDerReste < 1e-29, `Rest dort ${z(acht.restAndereGenauigkeit)}, Unterschied ${z(acht.unterschiedDerReste)}, Energiedrift ${z(acht.energiedrift)}`);
}

console.log("\nC · Gegenproben (müssen anschlagen)");
{
  const e = Q.gleich[0];
  const neben = verfeinereGenau("euler", ["1", "1", "1"], e.a + 1e-6, e.b, e.T, { stellen: 30, maxIter: 0, ohneGegenprobe: true });
  pruefe("ein Punkt 1e-6 neben der Acht gilt nicht als periodisch", !neben.ok && neben.rest > 1e-7, `Rest ${z(neben.rest)}`);
  const falsch = verfeinereGenau("euler", ["1", "1", "1.001"], e.a, e.b, e.T, { stellen: 30, maxIter: 0, ohneGegenprobe: true });
  pruefe("falsche Masse (m₃ = 1.001) gilt nicht als periodisch", !falsch.ok && falsch.rest > 1e-4, `Rest ${z(falsch.rest)}`);
}

console.log("\nD · Ungleiche Massen und freier Fall");
{
  // erste Bahn des Katalogs für m₃ = 0.5 (Li, Jing und Liao 2018)
  const u1 = Q.ungleich[0];
  const g = verfeinereGenau("euler", ["1", "1", "0.5"], u1.a, u1.b, u1.T, { stellen: 30 });
  pruefe(`ungleiche Massen: ${u1.name} (m₃ = 0.5) auf 30 Stellen`, g.ok && Math.abs(g.korrektur[0]) < 5e-10 && Math.abs(g.korrektur[1]) < 5e-10, `Rest ${z(g.rest)}, Gegenprobe ${z(g.restAndereGenauigkeit)}, v₁ = ${g.a.slice(0, 24)}`);
  // freier Fall mit enger Begegnung: F-11, in double nicht unter 1e-7 zu bringen
  const f = Q.fall[10], t0 = Date.now();
  const K = ladeKern(), v = K.macheVerfeinerer()("fall", f.m, f.a, f.b, f.T, { tSpanne: 0.05 });
  const h = verfeinereGenau("fall", f.m.map(String), v.a, v.b, v.T, { stellen: 30 });
  pruefe(`freier Fall ${f.name}: in double Rest ${z(v.rest)}, hochgenau auf 30 Stellen`, h.ok, `Rest ${z(h.rest)}, Verlauf ${h.verlauf.map(z).join(" → ")}, eigene Ableitung ${h.eigeneAbleitung}, ${h.schritte} Schritte, ${((Date.now() - t0) / 1000).toFixed(0)} s; Gegenprobe ${z(h.restAndereGenauigkeit)}; x = ${h.a.slice(0, 22)}`);
}

console.log("\nE · Stabilität in Festkomma bei UNGLEICHEN Massen: Lagrange-Bahn gegen Rouths Formel");
{
  // Bis zum 02.10.2026 war die Stabilität in Festkomma nur an fremden Bahnen
  // GLEICHER Massen geeicht (pruef-hristov.mjs, Abschnitte D und E). Für
  // ungleiche gibt es einen Sollwert, der von keiner Rechnung abhängt: die
  // Lagrange-Kreisbahn. Ihre Stabilitätsindizes sind analytisch bekannt
  // (Routh 1875): mit σ = (m₁m₂ + m₂m₃ + m₃m₁)/M² und x = √(1 − 27σ) sind sie
  // 2·cos(2π·√((1 ∓ x)/2)); für 27σ > 1 bilden sie ein komplexes Paar.
  const PI = "3.14159265358979323846264338327950288419716939937510582097494459";   // OEIS A000796
  const sinCos = (Gx, x) => { let s = 0n, c = 0n, glied = Gx.EINS; for (let k = 0; k < 160; k++) { if (k % 2 === 0) c += (k % 4 === 0 ? glied : -glied); else s += (k % 4 === 1 ? glied : -glied); glied = Gx.mal(glied, x) / BigInt(k + 1); } return [s, c]; };
  // gleichseitiges Dreieck der Seite 1, ω = √M; in Relativkoordinaten d' = ω × d
  const baue = mText => Gx => {
    const E = Gx.EINS, m = mText.map(Gx.ausDezimal), w = Gx.wurzel(m[0] + m[1] + m[2]);
    const P = [[0n, 0n], [E, 0n], [E / 2n, Gx.wurzel(3n * E) / 2n]], u = new Array(12).fill(0n);
    [[0, 1], [0, 2], [1, 2]].forEach(([i, j], p) => { const dx = P[j][0] - P[i][0], dy = P[j][1] - P[i][1]; u[2 * p] = dx; u[2 * p + 1] = dy; u[6 + 2 * p] = -Gx.mal(w, dy); u[7 + 2 * p] = Gx.mal(w, dx); });
    return { u, m, T: ((2n * Gx.ausDezimal(PI)) << Gx.P) / w };            // ein Umlauf: 2π/ω
  };
  const routhFest = mText => {              // die analytischen Indizes in derselben Festkommarechnung
    const E = G.EINS, m = mText.map(G.ausDezimal), M = m[0] + m[1] + m[2];
    const sig = ((G.mal(m[0], m[1]) + G.mal(m[1], m[2]) + G.mal(m[2], m[0])) << G.P) / G.mal(M, M), dis = E - 27n * sig;
    if (dis < 0n) return null;
    const x = G.wurzel(dis), zweiPi = 2n * G.ausDezimal(PI);
    return [E - x, E + x].map(q => 2n * sinCos(G, G.mal(zweiPi, G.wurzel(q / 2n)))[1]).sort((p, q) => (p < q ? -1 : 1));
  };
  const betrag = v => (v < 0n ? -v : v);
  for (const mText of [["1", "0.01", "0.01"], ["1", "0.02", "0.005"]]) {
    const t0 = Date.now(), st = stabilitaetGenauAusZustand(baue(mText), { stellen: 30 }), soll = routhFest(mText);
    const ist = st.ok && !st.komplex ? [G.ausDezimal(st.s1Text), G.ausDezimal(st.s2Text)].sort((p, q) => (p < q ? -1 : 1)) : null;
    const ab = ist ? Math.max(G.zuZahl(betrag(ist[0] - soll[0])), G.zuZahl(betrag(ist[1] - soll[1]))) : NaN;
    pruefe(`stabiler Fall m = (${mText.join(", ")}): Indizes auf 25 Stellen wie Routh, Urteil stabil`, st.ok && ab < 1e-25 && st.urteil === "stabil",
      `gemessen ${st.s2Text && st.s2Text.slice(0, 22)}, ${st.s1Text && st.s1Text.slice(0, 22)} · analytisch ${G.zuDezimal(soll[0], 20)}, ${G.zuDezimal(soll[1], 20)} · größte Abweichung ${z(ab)} · Abstand zur Grenze ${z(st.rand)} · ${((Date.now() - t0) / 1000).toFixed(0)} s`);
  }
  {
    // instabil, drei verschiedene Massen: komplexes Paar; Vergleich in double (analytisch wie in pruef-kern.mjs)
    const m = [1, 2, 3], M = 6, sig = (2 + 6 + 3) / (M * M), yv = Math.sqrt(27 * sig - 1), bet = Math.hypot(-0.5, yv / 2), al = Math.sqrt((bet - 0.5) / 2), be = Math.sqrt((bet + 0.5) / 2);
    const re = 2 * Math.cosh(2 * Math.PI * al) * Math.cos(2 * Math.PI * be), im = Math.abs(2 * Math.sinh(2 * Math.PI * al) * Math.sin(2 * Math.PI * be));
    const t0 = Date.now(), st = stabilitaetGenauAusZustand(baue(m.map(String)), { stellen: 30 });
    const ok = st.ok && st.komplex && Math.abs(st.s1 / re - 1) < 1e-12 && Math.abs(st.sIm / im - 1) < 1e-12 && st.urteil === "instabil";
    pruefe("instabiler Fall m = (1, 2, 3): komplexes Indexpaar auf zwölf Stellen wie Routh, Urteil instabil", ok, `gemessen ${st.s1} ± ${st.sIm} i · analytisch ${re} ± ${im} i · ${((Date.now() - t0) / 1000).toFixed(0)} s`);
  }
}

console.log(`\n${gesamt - fehl} von ${gesamt} Prüfungen bestanden` + (fehl ? ` — ${fehl} FEHL` : ""));
process.exit(fehl ? 1 : 0);
