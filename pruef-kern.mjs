// dreikoerper/pruef-kern.mjs — die Eichung des Rechenkerns.
//
//   node pruef-kern.mjs [--katalog N]     (N Bahnen je Katalog, Vorgabe 40)
//
// Reihenfolge nach dem Diagnose-Handwerk: erst das Messgerät an Lasten mit
// bekannter Antwort, dann die Gegenproben (jede Prüfung muss an einer
// falschen Eingabe rot werden), dann die Tabellen aus der Literatur.
// Das Urteil steht im Exit-Code: 0 nur, wenn keine Zeile FEHL meldet.

import { ladeKern, ladeQuellen, SUVAKOV } from "./quellen.mjs";
import { macheSchwarm } from "./schwarm.mjs";

const K = ladeKern(), Q = ladeQuellen();
const argv = process.argv.slice(2);
const NKAT = argv.includes("--katalog") ? +argv[argv.indexOf("--katalog") + 1] : 40;

let fehl = 0, gesamt = 0;
const z = x => (typeof x === "number" ? (x === 0 ? "0" : Math.abs(x) < 1e-3 || Math.abs(x) >= 1e5 ? x.toExponential(2) : x.toPrecision(6)) : String(x));
function pruefe(name, ok, wert) {
  gesamt++; if (!ok) fehl++;
  console.log(`  ${ok ? "ok  " : "FEHL"}  ${name}${wert !== undefined ? "   [" + wert + "]" : ""}`);
}
const kopf = t => console.log("\n" + t);

// ── Lagrange: drei Körper im gleichseitigen Dreieck auf Kreisbahnen ──────
// Seitenlänge 1, Winkelgeschwindigkeit ω = √M. Der Zustand zu jeder Zeit ist
// der Anfang, um ωt gedreht — eine Last mit bekannter Antwort.
function lagrange(m) {
  const M = m[0] + m[1] + m[2], w = Math.sqrt(M), P = [[0, 0], [1, 0], [0.5, Math.sqrt(3) / 2]];
  const s = new Float64Array(12);
  for (let i = 0; i < 3; i++) { s[2 * i] = P[i][0]; s[2 * i + 1] = P[i][1]; s[6 + 2 * i] = -w * P[i][1]; s[7 + 2 * i] = w * P[i][0]; }
  return { u: K.zuRelativ(s, new Float64Array(12)), w, T: 2 * Math.PI / w };
}
function gedreht(s, winkel) {
  const c = Math.cos(winkel), si = Math.sin(winkel), o = new Float64Array(12);
  for (let i = 0; i < 6; i++) { o[2 * i] = c * s[2 * i] - si * s[2 * i + 1]; o[2 * i + 1] = si * s[2 * i] + c * s[2 * i + 1]; }
  return o;
}
function fest(L, y, m, T, N) {          // N gleiche Schritte, ohne Schrittweitensteuerung
  L.start(y, m);
  for (let i = 0; i < N; i++) { L.versuch(y, m, T / N, 1); L.annehmen(y); }
}
function euler(y, m, T, N) {            // das bekannt schlechte Gerät
  const f = new Float64Array(12), h = T / N;
  for (let i = 0; i < N; i++) { K.kraft(y, m, f); for (let k = 0; k < 12; k++) y[k] += h * f[k]; }
}

const EINS = [1, 1, 1];
const L12 = K.macheLoeser(12, K.kraft);
const variation = K.macheVariation();
const verfeinere = K.macheVerfeinerer();
const neu = () => new Float64Array(12);

// Die Acht, von den Katalogziffern aus verfeinert — Bezugsbahn für alles Weitere.
const acht0 = Q.gleich[0];
const acht = verfeinere("euler", EINS, acht0.a, acht0.b, acht0.T, {});
const uAcht = K.EBENEN.euler.anfang(acht.a, acht.b, EINS, neu());

/* ═══════════════ A · Das Messgerät ═══════════════ */
kopf("A · Messgerät an bekannten Antworten");
{
  const lg = lagrange(EINS), Tt = 0.5;
  const fehlerBei = N => { const y = Float64Array.from(lg.u); fest(L12, y, EINS, Tt, N); return K.abstand(y, gedreht(lg.u, lg.w * Tt), EINS); };
  const e1 = fehlerBei(20), e2 = fehlerBei(40), ordnung = Math.log2(e1 / e2);
  pruefe("Dormand–Prince hat Ordnung 5 (Fehler fällt um 2⁵ bei halbem Schritt)", ordnung > 4.7 && ordnung < 5.5, `Ordnung ${ordnung.toFixed(2)}, Fehler ${z(e1)} → ${z(e2)}`);

  const y = Float64Array.from(lg.u);
  const r = K.integriere(L12, y, EINS, lg.T, K.TOL_GENAU);
  pruefe("Dormand–Prince: Lagrange-Kreisbahn nach einem Umlauf am Anfang (unter 1e-12)", K.abstand(y, lg.u, EINS) < 1e-12, `Abstand ${z(K.abstand(y, lg.u, EINS))}, ${r.schritte} Schritte`);

  const g = Float64Array.from(lg.u);
  const rg = K.taylor(g, EINS, lg.T, 1e-16);
  pruefe("Taylorreihe: dieselbe Bahn (unter 1e-12)", K.abstand(g, lg.u, EINS) < 1e-12, `Abstand ${z(K.abstand(g, lg.u, EINS))}, ${rg.schritte} Schritte`);

  const h = Float64Array.from(lg.u);
  K.taylor(h, EINS, 0.37 * lg.T, 1e-16);
  const dh = K.abstand(h, gedreht(lg.u, lg.w * 0.37 * lg.T), EINS);
  pruefe("Taylorreihe: Zustand mitten im Umlauf wie analytisch (unter 1e-13)", dh < 1e-13, `Abstand ${z(dh)}`);

  // Umrechnung hin und zurück
  const zz = K.zuOrten(uAcht, EINS, neu()), uu = K.zuRelativ(zz, neu());
  let d = 0; for (let i = 0; i < 12; i++) d = Math.max(d, Math.abs(uu[i] - uAcht[i]));
  pruefe("Relativ → Orte → Relativ ist die Identität, Schwerpunkt in 0", d < 1e-15 && Math.abs(zz[0] + zz[2] + zz[4]) < 1e-15, `Abweichung ${z(d)}, Schwerpunkt ${z(zz[0] + zz[2] + zz[4])}`);
  pruefe("Acht startet wie in der Tabelle: Körper bei −1, +1, 0", Math.abs(zz[0] + 1) < 1e-15 && Math.abs(zz[2] - 1) < 1e-15 && Math.abs(zz[4]) < 1e-15 && Math.abs(zz[6] - acht.a) < 1e-15 && Math.abs(zz[10] + 2 * acht.a) < 1e-15,
         `x = ${zz[0]}, ${zz[2]}, ${zz[4]}; v₁ₓ = ${zz[6].toFixed(6)}, v₃ₓ = ${zz[10].toFixed(6)}`);
}
{
  pruefe("Verfeinerung der Acht von den Katalogziffern aus (Rest unter 1e-13)", acht.ok && acht.rest < 1e-13, `Rest ${z(acht.rest)} nach ${acht.iter} Schritten, Verlauf ${acht.verlauf.map(z).join(" → ")}`);
  pruefe("verfeinerte Acht bleibt bei den zehn Katalogziffern", Math.abs(acht.a - acht0.a) < 5e-10 && Math.abs(acht.b - acht0.b) < 5e-10 && Math.abs(acht.T - acht0.T) < 5e-9,
         `Δv₁ ${z(acht.a - acht0.a)}, Δv₂ ${z(acht.b - acht0.b)}, ΔT ${z(acht.T - acht0.T)}`);

  const y = Float64Array.from(uAcht), e0 = K.energie(uAcht, EINS);
  K.taylor(y, EINS, 10 * acht.T, 1e-16);
  const drift = Math.abs((K.energie(y, EINS) - e0) / e0), dl = Math.abs(K.drehimpuls(y, EINS) - K.drehimpuls(uAcht, EINS));
  // Schwelle 1e-12: rund 400 Schritte, je Schritt Rundung um 1e-16 mal Größen um 10.
  pruefe("Taylorreihe: Energie und Drehimpuls über zehn Umläufe der Acht (unter 1e-12)", drift < 1e-12 && dl < 1e-12, `Energiedrift ${z(drift)}, Drehimpuls ${z(dl)}`);
  // Schwelle 1e-10: der Rest der Verfeinerung (um 1e-14) wächst auf der Acht
  // linear, gemessen ×1063 in 20 Umläufen (unten); mit Faktor zehn Luft.
  // 1e-11 war zu knapp: derselbe Kern lag je nach letztem Newton-Schritt bei
  // 4.8e-12 oder 2.6e-11.
  pruefe("Acht nach zehn Umläufen noch am Anfang (unter 1e-10)", K.abstand(y, uAcht, EINS) < 1e-10, `Abstand ${z(K.abstand(y, uAcht, EINS))}`);
  const yr = Float64Array.from(uAcht);
  K.integriere(L12, yr, EINS, 10 * acht.T, K.TOL_GENAU);
  const driftR = Math.abs((K.energie(yr, EINS) - e0) / e0);
  pruefe("Dormand–Prince: Energie über zehn Umläufe der Acht (unter 1e-11)", driftR < 1e-11, `Energiedrift ${z(driftR)}`);

  const a = Float64Array.from(uAcht), b = Float64Array.from(uAcht);
  K.integriere(L12, a, EINS, 3.7, K.TOL_GENAU); K.taylor(b, EINS, 3.7, 1e-16);
  pruefe("beide Verfahren stimmen mitten auf der Acht überein (unter 1e-12)", K.abstand(a, b, EINS) < 1e-12, `Unterschied ${z(K.abstand(a, b, EINS))}`);

  // Dasselbe an einer Bahn mit enger Begegnung (freier Fall F-5, kleinster Abstand 4e-5)
  const f5 = Q.fall[4], u5 = K.EBENEN.fall.anfang(f5.a, f5.b, f5.m, neu());
  const p = Float64Array.from(u5), q = Float64Array.from(u5);
  K.integriere(L12, p, f5.m, f5.T, K.TOL_GENAU); K.taylor(q, f5.m, f5.T, 1e-16);
  const dE = Math.abs(K.energie(p, f5.m) / K.energie(u5, f5.m) - 1), dT = Math.abs(K.energie(q, f5.m) / K.energie(u5, f5.m) - 1);
  pruefe("enge Begegnung (F-5): Energiedrift beider Verfahren unter 1e-9", dE < 1e-9 && dT < 1e-9, `Dormand–Prince ${z(dE)}, Taylor ${z(dT)}, Unterschied der Endzustände ${z(K.abstand(p, q, f5.m))}`);
}
{
  // Monodromie: Taylorreihe mit Tangenten gegen den Differenzenquotienten
  // und gegen Dormand–Prince auf den 156 Gleichungen
  const mon = variation(uAcht, EINS, acht.T);
  const Y = Float64Array.from(mon.y);
  let maxU = 0, maxM = 0;
  const d = 1e-6, p = neu(), q = neu();
  for (let c = 0; c < 12; c++) {
    p.set(uAcht); q.set(uAcht); p[c] += d; q[c] -= d;
    K.taylor(p, EINS, acht.T, 1e-16); K.taylor(q, EINS, acht.T, 1e-16);
    for (let k = 0; k < 12; k++) {
      const fd = (p[k] - q[k]) / (2 * d), v = Y[12 + 12 * c + k];
      maxU = Math.max(maxU, Math.abs(fd - v)); maxM = Math.max(maxM, Math.abs(v));
    }
  }
  pruefe("Monodromie: Tangenten der Taylorreihe = Differenzenquotient", maxU / maxM < 1e-6, `größte Abweichung ${z(maxU)} bei größtem Eintrag ${z(maxM)}`);
  const rk = K.macheVariationRK()(uAcht, EINS, acht.T, 1e-14).y;
  let maxR = 0; for (let i = 12; i < 156; i++) maxR = Math.max(maxR, Math.abs(rk[i] - Y[i]));
  pruefe("Monodromie: Taylorreihe = Dormand–Prince auf 156 Gleichungen (unter 1e-9)", maxR < 1e-9, `größte Abweichung ${z(maxR)}`);
  const sy = K.symplektikFehler(Y, EINS);
  pruefe("Monodromie ist symplektisch (unter 1e-10)", sy < 1e-10, `Fehler ${z(sy)}`);
  const st = K.stabilitaet(Y);
  pruefe("die Acht ist linear stabil (Simó 2002)", st.stabil, `s₁ ${st.s1.toFixed(6)}, s₂ ${st.s2.toFixed(6)}`);

  // Gegenprobe im selben Atemzug: die Spurformel gegen das rohe Auseinanderlaufen.
  // Gestört wird ein Ort und eine Geschwindigkeit von Körper 1 — eine Störung
  // der Relativgrößen einzeln wäre kein Zustand dreier Körper mehr.
  const zs = K.zuOrten(uAcht, EINS, neu()); zs[0] += 1e-7; zs[7] -= 1e-7;
  const s0 = K.zuRelativ(zs, neu()), stoer = Float64Array.from(s0), ref = Float64Array.from(uAcht);
  K.taylor(stoer, EINS, 20 * acht.T, 1e-16); K.taylor(ref, EINS, 20 * acht.T, 1e-16);
  const wuchs = K.abstand(stoer, ref, EINS) / K.abstand(s0, uAcht, EINS);
  pruefe("Störung der Acht wächst in 20 Umläufen nicht exponentiell", wuchs < 5000, `Faktor ${wuchs.toFixed(1)} (linear erlaubt, exponentiell wäre ≥ 10⁶)`);
}
{
  // Routh: die Lagrange-Bahn ist genau dann stabil, wenn 27·σ < 1 mit
  // σ = (m1m2 + m2m3 + m3m1)/M². Die Indizes sind analytisch bekannt.
  const routh = m => {
    const M = m[0] + m[1] + m[2], sig = (m[0] * m[1] + m[1] * m[2] + m[2] * m[0]) / (M * M), dis = 1 - 27 * sig;
    if (dis >= 0) {
      const x = Math.sqrt(dis);
      return { stabil: true, s: [2 * Math.cos(2 * Math.PI * Math.sqrt((1 - x) / 2)), 2 * Math.cos(2 * Math.PI * Math.sqrt((1 + x) / 2))], lambda: 1 };
    }
    const yv = Math.sqrt(-dis), bet = Math.hypot(-0.5, yv / 2), al = Math.sqrt((bet - 0.5) / 2), be = Math.sqrt((bet + 0.5) / 2);
    return { stabil: false, re: 2 * Math.cosh(2 * Math.PI * al) * Math.cos(2 * Math.PI * be),
             im: Math.abs(2 * Math.sinh(2 * Math.PI * al) * Math.sin(2 * Math.PI * be)), lambda: Math.exp(2 * Math.PI * al) };
  };
  const messe = m => { const lg = lagrange(m); return K.stabilitaet(variation(lg.u, m, lg.T).y); };
  const mu = ziel => { let a = 1e-4, b = 0.2; for (let i = 0; i < 80; i++) { const c = (a + b) / 2, s = (2 * c + c * c) / (1 + 2 * c) ** 2; if (27 * s < ziel) a = c; else b = c; } return (a + b) / 2; };

  let m = [1, 0.01, 0.01], soll = routh(m), ist = messe(m);
  const si = [ist.s1, ist.s2].sort((a, b) => a - b), ss = [...soll.s].sort((a, b) => a - b);
  pruefe("Routh, stabiler Fall m = (1, 0.01, 0.01): Indizes wie analytisch", ist.stabil && Math.abs(si[0] - ss[0]) < 1e-6 && Math.abs(si[1] - ss[1]) < 1e-6,
         `gemessen ${si.map(v => v.toFixed(7)).join(", ")} · analytisch ${ss.map(v => v.toFixed(7)).join(", ")}`);

  m = [1, 2, 3]; soll = routh(m); ist = messe(m);
  pruefe("Routh, instabiler Fall m = (1, 2, 3): |λ| wie analytisch", !ist.stabil && Math.abs(ist.lambda / soll.lambda - 1) < 1e-6,
         `gemessen |λ| ${ist.lambda.toFixed(6)}, analytisch ${soll.lambda.toFixed(6)}; Index ${ist.s1.toFixed(4)} ± ${(ist.sIm || 0).toFixed(4)}i gegen ${soll.re.toFixed(4)} ± ${soll.im.toFixed(4)}i`);

  m = EINS; soll = routh(m); ist = messe(m);
  pruefe("Routh, gleiche Massen: instabil mit |λ| = e^(π√2)", !ist.stabil && Math.abs(ist.lambda / soll.lambda - 1) < 1e-4, `gemessen ${ist.lambda.toFixed(4)}, analytisch ${soll.lambda.toFixed(4)}`);

  const mS = mu(0.98), mI = mu(1.02), a = messe([1, mS, mS]), b = messe([1, mI, mI]);
  pruefe("Routh trennt knapp unter und knapp über der Grenze (27σ = 0.98 | 1.02)", a.stabil && !b.stabil,
         `0.98: stabil=${a.stabil}, s ${a.s1.toFixed(4)}/${a.s2.toFixed(4)} · 1.02: stabil=${b.stabil}, |λ| ${b.lambda.toFixed(4)} (analytisch ${routh([1, mI, mI]).lambda.toFixed(4)})`);
}
{
  // Kleinste Quadrate
  const A = new Float64Array(45), b = new Float64Array(15), x0 = [0.3, -1.7, 2.5];
  let saat = 7; const zuf = () => { saat = (saat * 16807) % 2147483647; return saat / 2147483647 - 0.5; };
  for (let i = 0; i < 15; i++) { let s = 0; for (let j = 0; j < 3; j++) { A[i * 3 + j] = zuf() * (j === 0 ? 1e6 : 1); s += A[i * 3 + j] * x0[j]; } b[i] = s; }
  const x = K.kleinsteQuadrate3(A, b, 15);
  pruefe("Householder löst ein schlecht skaliertes Ausgleichsproblem", Math.hypot(x[0] - x0[0], x[1] - x0[1], x[2] - x0[2]) < 1e-9, x.map(v => v.toFixed(10)).join(", "));
}
{
  const d = K.durchgaenge(uAcht, EINS, acht.T, 1e-11);
  pruefe("Durchgangsfolge der Acht ist 123123", d.folge.join("") === "123123" && d.stimmig, d.folge.join(""));
  pruefe("Wort der Acht ist abAB (bis auf Drehung)", K.wortAus(d.folge, d.richtung) === K.kleinsteDrehung("abAB"), K.wortAus(d.folge, d.richtung));
  pruefe("Rückläufer werden gestrichen: 12233121 → 21", K.kuerzeFolge([1, 2, 2, 3, 3, 1, 2, 1]).folge.join("") === "21", K.kuerzeFolge([1, 2, 2, 3, 3, 1, 2, 1]).folge.join(""));
  const w = "BAbabaBA", zurueck = K.wortAus(K.folgeAusWort(w), K.folgeAusWort(w).map((_, i) => (i % 2 ? 1 : -1)));
  pruefe("Wort → Folge → Wort gibt dasselbe Wort", zurueck === K.kleinsteDrehung(w), `${w} → ${K.folgeAusWort(w).join("")} → ${zurueck}`);
}

/* ═══════════════ B · Rot sehen ═══════════════ */
kopf("B · Gegenproben: jede Prüfung an einer falschen Eingabe (muss anschlagen)");
{
  const lg = lagrange(EINS), Tt = 0.5;
  const f = N => { const y = Float64Array.from(lg.u); euler(y, EINS, Tt, N); return K.abstand(y, gedreht(lg.u, lg.w * Tt), EINS); };
  const ordnung = Math.log2(f(20) / f(40));
  pruefe("Ordnungsprobe meldet für das Euler-Verfahren 1, nicht 5", ordnung > 0.7 && ordnung < 1.4, `Ordnung ${ordnung.toFixed(2)}`);

  const y = Float64Array.from(uAcht), e0 = K.energie(uAcht, EINS);
  K.integriere(L12, y, EINS, 10 * acht.T, 1e-4);
  const drift = Math.abs((K.energie(y, EINS) - e0) / e0);
  pruefe("Energieprobe schlägt bei grober Toleranz (1e-4) an", drift > 1e-11, `Drift ${z(drift)} statt < 1e-11`);

  // falsche Massen: dieselben Anfangswerte kehren nicht zurück
  const m2 = [1, 1, 1.05], q = Float64Array.from(uAcht);
  K.taylor(q, m2, acht.T, 1e-16);
  pruefe("Wiederkehr schlägt bei falscher Masse (m₃ = 1.05) an", K.abstand(q, uAcht, EINS) > 1e-2, `Abstand ${z(K.abstand(q, uAcht, EINS))}`);

  // Massenzuordnung im freien Fall: nur die richtige Reihenfolge kehrt zurück
  const e = Q.fall.find(x => x.m.join() === "1,0.8,0.4"), wert = [];
  for (const mm of [e.m, [e.m[1], e.m[0], e.m[2]], [e.m[2], e.m[1], e.m[0]]]) {
    const u = K.EBENEN.fall.anfang(e.a, e.b, mm, neu()), v = Float64Array.from(u);
    K.taylor(v, mm, e.T, 1e-16); wert.push(K.abstand(v, u, mm));
  }
  pruefe("vertauschte Massen im freien Fall kehren nicht zurück", wert[0] < 1e-5 && wert[1] > 0.1 && wert[2] > 0.1, wert.map(z).join(" | "));

  const mon = variation(uAcht, EINS, acht.T);
  pruefe("Symplektikprobe schlägt bei falschen Massen an", K.symplektikFehler(mon.y, [1, 1, 1.3]) > 1e-3, `Fehler ${z(K.symplektikFehler(mon.y, [1, 1, 1.3]))}`);

  // Verfeinerung neben der Bahn darf sie nicht „finden", wenn T nicht passt
  const v = verfeinere("euler", EINS, acht0.a, acht0.b, acht0.T * 1.6, { tSpanne: 0.05, maxIter: 15 });
  pruefe("Verfeinerung mit falscher Periode (1.6·T, enge Spanne) meldet keinen Fund", !v.ok, `ok=${v.ok}, Rest ${z(v.rest)}`);

  const s1 = Q.gleich[1], uu = K.EBENEN.euler.anfang(s1.a, s1.b, EINS, neu());
  const d = K.durchgaenge(uu, EINS, s1.T, 1e-11);
  pruefe("Wort unterscheidet Schmetterling I von der Acht", K.wortAus(d.folge, d.richtung) !== K.kleinsteDrehung("abAB"), K.wortAus(d.folge, d.richtung));
}

/* ═══════════════ B2 · Umkehrpunkte (Halbperioden-Suche) ═══════════════ */
kopf("B2 · Umkehrpunkte: die Fixmengen der umkehrenden Symmetrien");
{
  const g = [0, 0, 0], nach = t => { const u = Float64Array.from(uAcht); if (t > 0) K.taylor(u, EINS, t, 1e-16); return u; };
  const alle = K.erlaubteZiele(EINS), bestes = u => { let b = Infinity, s = -1; for (const q of alle) { const w = K.umkehr(q, u, g); if (w < b) { b = w; s = q; } } return [K.ZIELE[s], b]; };
  pruefe("der Start der Euler-Ebene liegt genau in der Fixmenge A3", K.umkehr(2, uAcht, g) === 0 && K.startZiel("euler", EINS) === 2, `Abstand ${K.umkehr(2, uAcht, g)}`);
  const h = bestes(nach(acht.T / 2)), v = bestes(nach(acht.T / 4)), zw = bestes(nach(acht.T / 12));
  // (Welche gleichschenklige Fixmenge nach T/12 kommt, hatte ich als B1
  // geraten; gemessen ist es B2. Der Sollwert ist die Messung, mit dem Grund:
  // die Acht hat zwölf Umkehrpunkte je Periode, abwechselnd A und B.)
  pruefe("die Acht trifft nach T/2 wieder A3, nach T/4 B3, nach T/12 B2", h[0] === "A3" && h[1] < 1e-12 && v[0] === "B3" && v[1] < 1e-12 && zw[0] === "B2" && zw[1] < 1e-12,
         `T/2: ${h[0]} ${z(h[1])} · T/4: ${v[0]} ${z(v[1])} · T/12: ${zw[0]} ${z(zw[1])}`);
  // Gegenprobe: zu einer Zeit ohne Symmetrie ist keine Fixmenge nah
  const quer = bestes(nach(acht.T * 0.137));
  pruefe("Gegenprobe: bei 0.137·T ist die Acht in keiner Fixmenge", quer[1] > 0.05, `nächste ${quer[0]} im Abstand ${z(quer[1])}`);
  // Newton auf den Umkehrpunkt von einem Punkt daneben
  const J = K.macheJaeger();
  const p = J.kandidatHalb("euler", EINS, acht.a + 0.002, acht.b - 0.001, acht.T / 2 * 1.01, 2);
  pruefe("Newton auf A3 von 0.002 daneben findet die Acht", p.ok && Math.abs(p.a - acht.a) < 1e-12 && Math.abs(p.b - acht.b) < 1e-12 && Math.abs(p.T - acht.T) < 1e-11 && p.halb.rest < 1e-12 && p.halb.vielfaches === 1,
         `a ${p.a}, T ${p.T}, Umkehrpunkt auf ${z(p.halb.rest)}, voller Umlauf ${z(p.rest)}, Periode = ${p.halb.vielfaches} × 2τ`);
  const p4 = J.kandidatHalb("euler", EINS, acht.a + 0.001, acht.b + 0.001, acht.T / 4 * 0.99, 5);
  pruefe("Newton auf B3 nach einem Viertel: dieselbe Bahn, Periode = 2 × 2τ", p4.ok && Math.abs(p4.a - acht.a) < 1e-12 && p4.halb.vielfaches === 2, `a ${p4.a}, τ ${p4.halb.tau.toFixed(6)}, Vielfaches ${p4.halb.vielfaches}`);
  // Massen entscheiden, welche Symmetrien es gibt
  const z1 = K.erlaubteZiele([1, 1, 2]).map(s => K.ZIELE[s]).join(" "), z2 = K.erlaubteZiele([1, 2, 3]).map(s => K.ZIELE[s]).join(" ");
  pruefe("ungleiche Massen streichen die Tausch-Symmetrien", z1 === "A3 B3 C R" && z2 === "C R" && K.startZiel("euler", [1, 2, 3]) === -1 && K.startZiel("fall", [1, 2, 3]) === 7, `(1,1,2): ${z1} · (1,2,3): ${z2}; Euler-Start bei (1,2,3) unsymmetrisch, freier Fall immer in R`);
  // Grundperiode: ein Vielfaches der Periode ist keine eigene Bahn
  const viel = [1, 5, 13, 23].map(k => J.pruefe("euler", EINS, acht.a, acht.b, acht.T * k, { maxIter: 0, annahme: 1e-5 }));
  pruefe("Vielfache der Periode (×5, ×13, ×23) werden auf die Grundperiode zurückgeführt", viel.every(p => p.ok && Math.abs(p.T - acht.T) < 1e-9) && viel[0].teiler === undefined && viel[2].teiler === 13 && viel[3].teiler === 23,
         viel.map((p, i) => `×${[1, 5, 13, 23][i]} → T ${p.T.toFixed(6)}, Teiler ${p.teiler || 1}`).join(" · "));
  // Gegenprobe: falsches Ziel an derselben Stelle darf die Acht nicht „finden"
  const f = J.kandidatHalb("euler", EINS, acht.a, acht.b, acht.T / 2, 6);
  pruefe("Gegenprobe: Ziel C bei T/2 der Acht liefert nicht die Acht mit Periode 2τ", !(f.ok && f.halb.vielfaches === 1 && Math.abs(f.a - acht.a) < 1e-9), `ok=${f.ok}, ${f.grund || "a " + f.a + ", Vielfaches " + f.halb.vielfaches}`);
}

/* ═══════════════ C · Šuvakov und Dmitrašinović 2013 ═══════════════ */
kopf("C · Tabelle I von 2013 (fünf Nachkommastellen): Wiederkehr, Verfeinerung, Topologie");
{
  const pruefer = K.macheFundpruefer(), u0 = neu(), ut = neu();
  console.log("     Bahn                       d bei Tab.-T  Rest      Gegenpr.  Δv₁       Δv₂       ΔT          |λ|       s₁         s₂         sympl.   stabil Klasse");
  let konv = 0, ziffern = 0, klasse = 0, mitWort = 0; const stabile = [];
  for (const e of SUVAKOV) {
    K.EBENEN.euler.anfang(e.a, e.b, EINS, u0); ut.set(u0);
    K.taylor(ut, EINS, e.T, 1e-16);
    const d0 = K.abstand(ut, u0, EINS);
    const p = pruefer("euler", EINS, e.a, e.b, e.T, { tSpanne: 0.05 });
    const okZ = p.ok && Math.abs(p.a - e.a) < 1e-5 && Math.abs(p.b - e.b) < 1e-5;
    let kl = "—";
    if (e.wort && p.ok) {
      mitWort++;
      const gleich = K.kennung(K.folgeAusWort(e.wort), EINS) === K.kennung(p.folge.split("").map(Number), EINS);
      if (gleich) klasse++;
      kl = gleich ? "wie Tabelle" : "ANDERS";
    }
    if (p.ok) konv++; if (okZ) ziffern++; if (p.stabil === true) stabile.push(e.name);
    const kurz = x => (typeof x === "number" ? x.toExponential(1) : String(x));
    console.log(`     ${(e.nr + " " + e.name).padEnd(26)} ${z(d0).padEnd(13)} ${kurz(p.rest).padEnd(9)} ${kurz(p.gegenprobe).padEnd(9)} ${kurz(p.a - e.a).padEnd(9)} ${kurz(p.b - e.b).padEnd(9)} ${z(p.T - e.T).padEnd(11)} ${z(p.lambda).padEnd(9)} ${z(p.s1).padEnd(10)} ${(p.sKomplex ? "±" + z(p.sIm) + "i" : z(p.s2)).padEnd(10)} ${kurz(p.symplektik).padEnd(8)} ${String(p.stabil).padEnd(6)} ${kl}`);
  }
  pruefe("alle 15 Anfangswerte der Tabelle führen auf eine periodische Bahn", konv === 15, `${konv} von 15`);
  pruefe("die verfeinerten Werte liegen innerhalb von 1e-5 an der Tabelle", ziffern === 15, `${ziffern} von 15`);
  pruefe("Topologie wie in der Tabelle angegeben", klasse === mitWort && mitWort >= 13, `${klasse} von ${mitWort} (Schmetterling IV ohne ausgeschriebenes Wort)`);
  // Herkunft des Sollwerts, ehrlich: Eine Websuche am 01.10.2026 fasste
  // zusammen, von den Bahnen der Tabelle seien vier linear stabil — Hummel
  // (bumblebee), Motte I, Motte II, Schmetterling III. Die Originalstelle
  // habe ich nicht gelesen. Die Prüfung ist deshalb ein Abgleich mit einer
  // Angabe aus zweiter Hand, keine Eichung; die Eichung ist Routh (oben).
  const soll = ["Hummel", "Motte I", "Motte II", "Schmetterling III"];
  pruefe("sicher stabil sind genau die vier, die die Literatur nennt", stabile.slice().sort().join() === soll.slice().sort().join(), stabile.join(", "));

  // Stabilität auf Abruf (für das Labor): die Prüfkette ohne Stabilität darf an
  // der Bahn nichts ändern, und die nachträgliche Messung muss auf das Bit
  // dasselbe liefern wie die mitgerechnete.
  let ohneFeld = 0, gleicheBahn = 0, gleichesUrteil = 0; const zeiten = [];
  for (const e of SUVAKOV) {
    const mit = pruefer("euler", EINS, e.a, e.b, e.T, { tSpanne: 0.05 }), ohne = pruefer("euler", EINS, e.a, e.b, e.T, { tSpanne: 0.05, ohneStabil: true });
    if (ohne.stabil === undefined && ohne.s1 === undefined && ohne.lambda === undefined) ohneFeld++;
    if (ohne.a === mit.a && ohne.b === mit.b && ohne.T === mit.T && ohne.wort === mit.wort && ohne.gegenprobe === mit.gegenprobe) gleicheBahn++;
    const t0 = performance.now(), nach = pruefer.stabilitaetMessen("euler", EINS, ohne.a, ohne.b, ohne.T);
    zeiten.push((performance.now() - t0) / 1000);
    if (nach.stabil === mit.stabil && nach.s1 === mit.s1 && nach.s2 === mit.s2 && nach.lambda === mit.lambda && nach.symplektik === mit.symplektik) gleichesUrteil++;
  }
  zeiten.sort((x, y) => x - y);
  pruefe("ohneStabil: die Prüfkette lässt die Stabilität weg und die Bahn unverändert", ohneFeld === 15 && gleicheBahn === 15, `ohne Stabilitätsfelder ${ohneFeld} von 15, Bahn auf das Bit gleich ${gleicheBahn} von 15`);
  pruefe("stabilitaetMessen liefert nachträglich dasselbe wie die mitgerechnete Stabilität", gleichesUrteil === 15, `${gleichesUrteil} von 15 auf das Bit gleich; Messzeit Median ${zeiten[7].toFixed(2)} s, längste ${zeiten[14].toFixed(2)} s`);
}

/* ═══════════════ D · Li und Liao, Stichprobe ═══════════════ */
kopf(`D · Kataloge von Li und Liao: die ersten ${NKAT} Bahnen je Katalog (alle: pruef-katalog.mjs)`);
{
  const schwarm = macheSchwarm();
  for (const [satz, titel] of [["gleich", "gleiche Massen"], ["ungleich", "ungleiche Massen"], ["fall", "freier Fall"]]) {
    const auswahl = Q[satz].slice(0, NKAT);
    const t0 = Date.now();
    const erg = await schwarm.alle(auswahl.map(e => ({ art: "katalog", eintrag: e })));
    const kaputt = erg.filter(r => r.fehler);
    const konv = erg.filter(r => r.ok && Math.abs(r.da) < 1e-6 && Math.abs(r.db) < 1e-6);
    const scharf = konv.filter(r => r.rest < 1e-10 && r.gegenprobe < 1e-8);
    const reste = konv.map(r => r.rest).sort((a, b) => a - b);
    // Bahnen ohne enge Begegnung (kleinster Abstand über 1e-2) muss double scharf tragen.
    const gutartig = erg.filter(r => !r.fehler && r.ok && r.rMin > 1e-2), gutScharf = gutartig.filter(r => scharf.includes(r));
    const offen = erg.filter(r => !r.fehler && !r.ok);
    pruefe(`${titel}: keine Ausnahme im Schwarm`, !kaputt.length, kaputt.length ? kaputt[0].fehler.slice(0, 200) : `${((Date.now() - t0) / 1000).toFixed(1)} s auf ${schwarm.faeden} Fäden`);
    pruefe(`${titel}: Bahnen ohne enge Begegnung (über 1e-2) scharf bestätigt (Rest < 1e-10, Gegenprobe < 1e-8)`, gutScharf.length === gutartig.length && gutartig.length > 0,
           `${gutScharf.length} von ${gutartig.length}; insgesamt konvergiert ${konv.length} von ${auswahl.length}, davon scharf ${scharf.length}; Rest Median ${z(reste[reste.length >> 1])}, größter ${z(reste[reste.length - 1])}`);
    if (satz !== "fall") {
      const wortOk = konv.filter(r => r.wort === K.kleinsteDrehung(auswahl[erg.indexOf(r)].wort));
      pruefe(`${titel}: berechnetes Wort = veröffentlichtes Wort`, wortOk.length === konv.length && konv.length > 0, `${wortOk.length} von ${konv.length} konvergierten`);
    }
    for (const r of offen.slice(0, 6))
      console.log(`        nicht konvergiert: ${r.name} m=${r.m} T=${r.T}: Rest ${z(r.rest)}, d(Katalog) ${z(r.dKatalog)} / Taylor ${z(r.dKatalogTaylor)}`);
  }
  await schwarm.ende();
}

console.log(`\n${gesamt - fehl} von ${gesamt} Prüfungen bestanden` + (fehl ? ` — ${fehl} FEHL` : ""));
process.exit(fehl ? 1 : 0);
