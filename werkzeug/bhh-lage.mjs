// Kann eine Bahn unter den BHH-Satelliten von Li & Liao (2020) stehen? Deren Anfangswerte sind
// kollinear, Körper 3 dazwischen (r1=(x1,0), r2=(1,0), r3=(0,0)) und alle Geschwindigkeiten
// senkrecht zur Linie, Gesamtimpuls null. Geht die Bahn nie durch eine solche Lage, kann sie dort
// nicht stehen. Gesucht: alle Syzygien mit Körper 3 in der Mitte; je Syzygie der größte Anteil
// einer Geschwindigkeit längs der Linie, bezogen auf die größte Geschwindigkeit.
//   node werkzeug/bhh-lage.mjs <datei> <m3> [abtastung]   (datei in ergebnisse/listenfortsetzung)
// (11.11.2026, Literaturprüfung: I.A-5-2 bei 4 → kleinster Längsanteil 0,49, also keine BHH-Bahn)
import { readFileSync } from "node:fs";
import { HIER, ladeKern } from "../quellen.mjs";
const K = ladeKern(), schritt = K.macheTaylor(), E = K.EBENEN.euler;
const [datei, m3s, nArg] = process.argv.slice(2), m3 = +m3s;
const R = JSON.parse(readFileSync(HIER + "/ergebnisse/listenfortsetzung/" + datei + ".json", "utf8"));
const P = [...R.richtungen.abwaerts.punkte, R.start, ...R.richtungen.aufwaerts.punkte];
const p = P.find(q => Math.abs(q.m3 - m3) < 1e-9);
const m = [1, 1, m3], N = +(nArg || 200000), dt = p.T / N;
const u = E.anfang(p.a, p.b, m, new Float64Array(12)), z = new Float64Array(12);
const C = uu => { K.zuOrten(uu, m, z); return (z[0] - z[4]) * (z[3] - z[5]) - (z[1] - z[5]) * (z[2] - z[4]); };
function bewerte(uu) {
  K.zuOrten(uu, m, z);
  const d1 = [z[0] - z[4], z[1] - z[5]], d2 = [z[2] - z[4], z[3] - z[5]];
  const mitte = d1[0] * d2[0] + d1[1] * d2[1] < 0;
  const ex = z[2] - z[0], ey = z[3] - z[1], l = Math.hypot(ex, ey);
  let laengs = 0, gross = 0;
  for (let i = 0; i < 3; i++) { const vx = z[6 + 2 * i], vy = z[7 + 2 * i]; laengs = Math.max(laengs, Math.abs((vx * ex + vy * ey) / l)); gross = Math.max(gross, Math.hypot(vx, vy)); }
  return { mitte, anteil: laengs / gross };
}
const s0 = bewerte(u); let t = 0, c = C(u), syz = [];
for (let k = 0; k < N; k++) {
  const alt = Float64Array.from(u), cAlt = c;
  if (schritt(u, m, dt, 1e-16).art !== 0) { console.log("Abbruch bei", t); break; }
  t += dt; c = C(u);
  if (cAlt === 0 || cAlt * c < 0) {
    // Halbierung im Teilschritt
    let lo = 0, hi = dt;
    for (let j = 0; j < 40; j++) { const mid = (lo + hi) / 2, w = Float64Array.from(alt); schritt(w, m, mid, 1e-16); if (C(w) * cAlt > 0) lo = mid; else hi = mid; }
    const w = Float64Array.from(alt); schritt(w, m, (lo + hi) / 2, 1e-16);
    syz.push({ t: t - dt + (lo + hi) / 2, ...bewerte(w) });
  }
}
const mitte = syz.filter(s => s.mitte);
console.log(`${datei} bei m3 = ${m3}: T ${p.T.toFixed(6)}, Start (Körper 3 in der Mitte): Längsanteil ${s0.anteil.toFixed(4)}`);
console.log(`Syzygien über eine Periode: ${syz.length}, davon Körper 3 in der Mitte: ${mitte.length}`);
const best = mitte.slice().sort((x, y) => x.anteil - y.anteil);
console.log("kleinste Längsanteile (Körper 3 in der Mitte):", best.slice(0, 6).map(s => `t ${s.t.toFixed(4)}: ${s.anteil.toExponential(2)}`).join(" | "));
