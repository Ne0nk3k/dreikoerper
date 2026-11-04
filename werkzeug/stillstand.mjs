// dreikoerper/werkzeug/stillstand.mjs — kommt eine Bahn je zur Ruhe? (21.10.2026)
//
//   node werkzeug/stillstand.mjs --m 1,1,5 --a … --b … --T … [--ebene euler]
//
// In einer Freifall-Liste stehen nur Bahnen, auf denen alle drei Körper in
// einem Augenblick zugleich stillstehen (sie starten aus der Ruhe). Bleibt die
// Bewegungsenergie über den ganzen Umlauf deutlich über null, kann die Bahn in
// keiner Freifall-Liste stehen — ohne jeden Wortvergleich, der zwischen den
// Ebenen nicht geeicht ist (werkzeug/fall-eichen.mjs: 51 von 737).
// Bewegungsenergie = E − U(Orte), E aus dem Anfang; Schritt nach Weg wie in
// bahnbild.mjs. Gegenprobe: eine Freifall-Bahn muss hier auf ≈ 0 kommen.

import { HIER, ladeKern, ladeKatalog } from "../quellen.mjs";

const K = ladeKern(), argv = process.argv.slice(2), arg = (n, v) => (argv.includes(n) ? argv[argv.indexOf(n) + 1] : v);
function minKin(ebene, m, a, b, T) {
  const u = new Float64Array(12), z = new Float64Array(12), alt = new Float64Array(12);
  K.EBENEN[ebene].anfang(a, b, m, u);
  const E = K.energie(u, m);
  const pot = () => { K.zuOrten(u, m, z); const r = (i, j) => Math.hypot(z[2 * i] - z[2 * j], z[2 * i + 1] - z[2 * j + 1]); return -(m[0] * m[1] / r(0, 1) + m[0] * m[2] / r(0, 2) + m[1] * m[2] / r(1, 2)); };
  let t = 0, dt = T / 20000, min = E - pot(), tMin = 0, last = Array.from(z.slice(0, 6));
  while (t < T) {
    const h = Math.min(dt, T - t);
    alt.set(u); K.taylor(u, m, h, 1e-16); K.zuOrten(u, m, z);
    const weg = Math.max(...[0, 1, 2].map(c => Math.hypot(z[2 * c] - last[2 * c], z[2 * c + 1] - last[2 * c + 1])));
    if (weg > 0.002 && h > 1e-12) { u.set(alt); dt = h / 2; continue; }
    t += h; last = Array.from(z.slice(0, 6));
    const kin = E - pot(); if (kin < min) { min = kin; tMin = t; }
    if (weg < 0.001) dt = h * 1.5;
  }
  return { E, min, tMin, anteil: min / Math.abs(E) };
}
if (argv.includes("--a")) {
  const m = arg("--m", "1,1,5").split(",").map(Number), r = minKin(arg("--ebene", "euler"), m, +arg("--a"), +arg("--b"), +arg("--T"));
  console.log(`kleinste Bewegungsenergie ${r.min.toExponential(3)} bei t = ${r.tMin.toFixed(4)} — ${(100 * r.anteil).toFixed(1)} % von |E| = ${Math.abs(r.E).toFixed(4)}`);
}
// Gegenprobe: drei Freifall-Bahnen aus dem Katalog (Li & Liao 2019) müssen zur Ruhe kommen
for (const k of ladeKatalog().bahnen.filter(b => b.ebene === "fall").slice(0, 3)) {
  const r = minKin("fall", k.m, k.a, k.b, k.T);
  console.log(`Gegenprobe ${k.name} (freier Fall, m ${k.m.join("/")}): kleinste Bewegungsenergie ${r.min.toExponential(2)} (${(100 * r.anteil).toFixed(4)} % von |E|)`);
}
