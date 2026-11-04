// halbperiode.mjs — does an orbit have a half-period symmetry, and is its
// monodromy matrix therefore a square? (dreikoerper project, 04.11.2026)
//
//   node halbperiode.mjs --m 1,1,5 --a <decimal> --b <decimal> --T <decimal>
//
// Euler initial conditions as in bahn-pruefen.mjs. Double precision.
//
// 1. Integrate half a period and look for an isometry g of the plane, possibly
//    combined with the exchange of bodies 1 and 2 (both of mass 1), with
//    x(T/2) = g x(0) and velocities transformed like positions. Such a g maps
//    solutions to solutions, so then x(t + T/2) = g x(t) for all t.
// 2. Then the monodromy M = DΦ(T) equals N² with N = G · DΦ(T/2), G the
//    matrix of g. Checked directly: |N² − M| / |M|.
// 3. Consequence: every nontrivial stability index of M is s = σ² − 2, with σ
//    the index of N. While σ is real, s ≥ −2: an index can touch −2 but not
//    pass below it, so a linearly stable family cannot lose stability there.
//    (If the two σ form a complex pair x ± iy, the s are complex unless x = 0,
//    and then s1 = s2 < −2. So: real and distinct s imply real σ and s ≥ −2.)
//
// Exit code 0 only if g x(0) meets x(T/2) about as closely as the orbit itself
// closes after T, and N² matches M at least 1000 times better than any other
// reading (no g, or the second-best g). Exit code 3: the symmetry is there,
// but M is too rough in double precision to confirm the square. 1: no symmetry.

import { ladeKern } from "./quellen.mjs";

const K = ladeKern();
const argv = process.argv.slice(2);
const wert = n => (argv.includes(n) ? argv[argv.indexOf(n) + 1] : null);
const mT = (wert("--m") || "").split(","), a = +wert("--a"), b = +wert("--b"), T = +wert("--T");
if (mT.length !== 3 || ![a, b, T, ...mT.map(Number)].every(Number.isFinite)) {
  console.error("usage: node halbperiode.mjs --m m1,m2,m3 --a <decimal> --b <decimal> --T <decimal>"); process.exit(2);
}
const m = mT.map(Number);

// state u: relative vectors d12 = r2 − r1, d13 = r3 − r1, d23 = r3 − r2, then their velocities
const u0 = new Float64Array(12); K.EBENEN.euler.anfang(a, b, m, u0);
const uH = u0.slice(), uV = u0.slice();
if (K.taylor(uH, m, T / 2, 1e-15, 1e8).art !== 0 || K.taylor(uV, m, T, 1e-15, 1e8).art !== 0) { console.log("integration stopped"); process.exit(1); }
const schliesst = K.abstand(uV, u0, m);

// g as a 12×12 matrix on u: Q = R(θ)·diag(1, ±1) on every relative vector; exchanging
// bodies 1 and 2 maps d12 → −d12, d13 → d23, d23 → d13
function matrixG(th, spiegel, tausch) {
  const c = Math.cos(th), s = Math.sin(th), Q = spiegel ? [[c, s], [s, -c]] : [[c, -s], [s, c]];
  const G = Array.from({ length: 12 }, () => new Float64Array(12));
  const ziel = tausch ? [[0, 0, -1], [1, 2, 1], [2, 1, 1]] : [[0, 0, 1], [1, 1, 1], [2, 2, 1]];   // [new vector, old vector, sign]
  for (const blk of [0, 6]) for (const [neu, alt, vz] of ziel) for (let r = 0; r < 2; r++) for (let q = 0; q < 2; q++) G[blk + 2 * neu + r][blk + 2 * alt + q] = vz * Q[r][q];
  return G;
}
const mulV = (G, u) => G.map(z => z.reduce((x, g, j) => x + g * u[j], 0));
const fehl = (th, sp, ta) => { const g = mulV(matrixG(th, sp, ta), u0); return Math.hypot(...g.map((x, i) => x - uH[i])); };
function bestesTheta(sp, ta) {
  let th = 0, d = Infinity;
  for (let i = 0; i < 7200; i++) { const t = (i / 7200) * 2 * Math.PI, e = fehl(t, sp, ta); if (e < d) { d = e; th = t; } }
  for (let h = (2 * Math.PI) / 7200; h > 1e-16; h /= 2) for (const t of [th - h, th + h]) { const e = fehl(t, sp, ta); if (e < d) { d = e; th = t; } }
  return { th, d };
}
const kandidaten = [];
for (const sp of [false, true]) for (const ta of [false, true]) kandidaten.push({ sp, ta, ...bestesTheta(sp, ta) });
kandidaten.sort((x, y) => x.d - y.d);
const g = kandidaten[0], zweite = kandidaten[1];
console.log(`masses ${mT.join("/")}, a = ${wert("--a")}, b = ${wert("--b")}, T = ${wert("--T")}`);
console.log(`the orbit closes after T to ${schliesst.toExponential(2)} (double precision)`);
console.log(`\nhalf-period symmetry: x(T/2) = g x(0) with g = ${g.sp ? "reflection" : "rotation"}, θ = ${(g.th * 180 / Math.PI).toFixed(6)}°, bodies 1 and 2 ${g.ta ? "exchanged" : "not exchanged"}`);
console.log(`  distance |g x(0) − x(T/2)| = ${g.d.toExponential(2)}   (best other g: ${zweite.d.toExponential(2)})`);

// monodromy over T/2 and over T
const variation = K.macheVariation();
const mat = Y => Array.from({ length: 12 }, (_, k) => Array.from({ length: 12 }, (_, c) => Y[12 + 12 * c + k]));   // [k][c] = ∂u_k/∂u0_c
const vH = variation(u0, m, T / 2, 1e-16, 1e8), D = mat(vH.y);
const vV = variation(u0, m, T, 1e-16, 1e8), M = mat(vV.y);
const mul = (A, B) => A.map(z => B[0].map((_, j) => z.reduce((x, y, k) => x + y * B[k][j], 0)));
const norm = A => Math.sqrt(A.flat().reduce((x, y) => x + y * y, 0));
const rel = (A, B) => norm(A.map((z, i) => z.map((x, j) => x - B[i][j]))) / norm(B);
const N = mul(matrixG(g.th, g.sp, g.ta), D);
const quadrat = rel(mul(N, N), M), ohneG = rel(mul(D, D), M);
const zN = mul(matrixG(zweite.th, zweite.sp, zweite.ta), D), quadrat2 = rel(mul(zN, zN), M);
console.log(`\nmonodromy as a square: |N² − M| / |M| = ${quadrat.toExponential(2)}   (without g: ${ohneG.toExponential(2)}; with the best other g: ${quadrat2.toExponential(2)})`);
const s = K.stabilitaet(vV.y);
console.log(`stability indices of M in double precision (rough where bodies come close): ${s.s1.toFixed(6)}${s.komplex ? ` ± ${s.sIm.toFixed(6)} i` : ` / ${s.s2.toFixed(6)}`}`);
// Measured against the computation's own accuracy, not a fixed number: where bodies come
// close, double precision loses digits in M (family A: |N² − M| / |M| = 1e-4, while every
// other reading is off by about 10).
// Two verdicts: the symmetry itself (step 1), and its numerical confirmation in M (step 2).
// At I.A-5 (masses 1/1/2, bodies within 6e-5) step 1 holds to 4e-9, but M in double
// precision is too rough for step 2 (|N² − M| / |M| = 2.5e-3, other readings 0.08).
const sym = g.d < 100 * schliesst + 1e-12 && zweite.d > 1e4 * g.d;
const quad = quadrat * 1e3 < Math.min(ohneG, quadrat2);
const rMin = K.durchgaenge(u0, m, T, 1e-11).rMin;
console.log(`closest approach of two bodies: ${rMin.toExponential(2)}`);
if (sym && quad) console.log("\nRESULT: M = N², so s = σ² − 2. While the two indices are real and distinct, both σ are real and s ≥ −2: an index can touch −2 but not cross it.");
else if (sym) console.log("\nRESULT: half-period symmetry found, but the double-precision monodromy is too rough here to confirm M = N² numerically (use the 30-digit indices instead).");
else console.log("\nRESULT: no half-period symmetry found.");
process.exit(sym && quad ? 0 : sym ? 3 : 1);
