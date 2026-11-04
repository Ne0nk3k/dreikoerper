// dreikoerper/werkzeug/familie-b-bauen.mjs — das öffentliche Repository der
// Familie B (und der zweiten Kandidatin A), 04.11.2026.
//
//   node werkzeug/familie-b-bauen.mjs [--doi 10.5281/zenodo.…] [<ziel>]
//                                     Vorgabe: ..\dreikoerper-familie-b
//
// Keine Zahl im Text ist von Hand geschrieben: alles kommt aus den
// Ergebnisdateien (Fortsetzungen, 30-Stellen-Stützstellen, Familienabgleich,
// Worteichung, Fast-Vielfach-Test) oder wird hier aus ihnen gerechnet. Das
// Bauskript schreibt README.md, die Datentabellen (daten\), die Bilder
// (bilder\, Bahnbild aus werkzeug/bahnbild.mjs und ein Stabilitätsdiagramm),
// CITATION.cff, .zenodo.json, LICENSE und kopiert das Prüfskript mit dem, was
// es braucht (kern.js, genau.mjs, quellen.mjs, bahn-pruefen.mjs).
// Wie oeffentlich-bauen.mjs: nur aus versionierten Ständen, löscht im Ziel
// nur, was es selbst abgelegt hat. Danach muss
//   node werkzeug/oeffentlich-pruefen.mjs <ziel> --muss README.md,LICENSE,CITATION.cff,.zenodo.json,bahn-pruefen.mjs,alle-pruefen.mjs
// grün sein.

import { readFileSync, writeFileSync, mkdirSync, copyFileSync, existsSync, lstatSync, unlinkSync, readdirSync } from "node:fs";
import { join, resolve, relative, dirname } from "node:path";
import { execFileSync, spawnSync } from "node:child_process";
import { HIER, ladeKern } from "../quellen.mjs";
import { macheGenau } from "../genau.mjs";

const K = ladeKern();
// Rückkehrabstand der ABGEDRUCKTEN Ziffern nach einem Umlauf (wie bahn-pruefen.mjs).
// Nicht der Newton-Rest der internen Rechnung: wer die gedruckten 32 Stellen
// nachrechnet, soll dieselbe Zahl bekommen, die hier steht (Fehler der ersten
// Fassung vom 04.11.2026: 4,6e-37 im Text, 1,95e-30 beim Nachrechnen).
function rueckkehr(m3, a, b, T, bits, ordnung) {
  const G = macheGenau(bits, ordnung), mT = ["1", "1", String(m3)], mF = mT.map(G.ausDezimal), mD = mT.map(Number);
  const u0 = G.anfang("euler", G.ausDezimal(a), G.ausDezimal(b), mF), u = u0.slice();
  if (G.lauf(u, mF, G.ausDezimal(T), -38 * Math.log2(10)).art !== 0) return NaN;
  const d = new Float64Array(12);
  for (let i = 0; i < 12; i++) d[i] = G.zuZahl(u[i] - u0[i]);
  return K.abstand(d, new Float64Array(12), mD);
}

// die Wörter der Liste, die wir nicht Buchstabe für Buchstabe treffen, und warum (aus woerter-eichen.json)
const ZAHLWORT = ["no", "one", "two", "three", "four", "five"];
function abweichlerText(WE) {
  const e = WE.einordnung || {}, g = e["gekuerzt-gleich"] || [], f = e["ein-buchstabe-fehlt-in-der-liste"] || [], z = e["ein-buchstabe-zuviel-in-der-liste"] || [], u = e.unerklaert || [];
  const teile = [];
  if (g.length) teile.push(`${ZAHLWORT[g.length] || g.length} (${g.join(", ")}) ${g.length > 1 ? "are" : "is"} written without free reduction in the list and reduce${g.length > 1 ? "" : "s"} to the word we compute`);
  if (f.length) teile.push(`in ${ZAHLWORT[f.length] || f.length} (${f.join(", ")}) the list word lacks one letter of ours`);
  if (z.length) teile.push(`in ${ZAHLWORT[z.length] || z.length} (${z.join(", ")}) the list word has one letter more than ours`);
  if (u.length) teile.push(`${ZAHLWORT[u.length] || u.length} (${u.join(", ")}) differ${u.length > 1 ? "" : "s"} for reasons we have not found`);
  return `of the other ${ZAHLWORT[WE.nicht] || WE.nicht}, ${teile.join("; ")}`;
}
const argv = process.argv.slice(2);
const dIdx = argv.indexOf("--doi"), DOI = dIdx >= 0 ? argv[dIdx + 1] : null;
const rest = dIdx >= 0 ? argv.filter((_, i) => i !== dIdx && i !== dIdx + 1) : argv;  // bis 04.11.2026 ohne --doi das erste Argument verschluckt (dIdx + 1 = 0)
const ZIEL = resolve(rest[0] || join(HIER, "..", "dreikoerper-familie-b"));
if (ZIEL === resolve(HIER) || ZIEL.startsWith(resolve(HIER) + "\\")) { console.error("Das Ziel darf nicht im privaten Repo liegen."); process.exit(2); }
const offen = execFileSync("git", ["-C", HIER, "status", "--porcelain"], { encoding: "utf8" }).split("\n").filter(z => z.trim() && !z.startsWith("??"));
if (offen.length) { console.error("Erst committen:\n" + offen.join("\n")); process.exit(2); }

mkdirSync(ZIEL, { recursive: true });
if (existsSync(join(ZIEL, ".git"))) {
  for (const p of execFileSync("git", ["-C", ZIEL, "ls-files", "-z", "--cached", "--others", "--exclude-standard"], { encoding: "utf8" }).split("\0").filter(Boolean)) {
    const q = join(ZIEL, p); if (existsSync(q) && lstatSync(q).isFile()) unlinkSync(q);
  }
} else if (readdirSync(ZIEL).length) { console.error(`${ZIEL} ist nicht leer und kein Repo.`); process.exit(2); }
for (const d of ["daten", "bilder"]) mkdirSync(join(ZIEL, d), { recursive: true });

const lade = n => JSON.parse(readFileSync(join(HIER, "ergebnisse", n), "utf8"));
const lauf5 = lade("euler-m3-5-v2gross.json"), genau5 = lade("euler-m3-5-v2gross-genau.json");
const FA = lade("familien-abgleich.json"), WE = lade("woerter-eichen.json"), FV = lade("fast-vielfach.json");
const sofia = JSON.parse(readFileSync(join(HIER, "katalog-gross.json"), "utf8"));
const sofiaEintraege = Object.values(sofia.ebenen.euler.quellen).reduce((s, q) => s + q.zeilen, 0);
const WH = existsSync(join(HIER, "woerter-hristov.json")) ? JSON.parse(readFileSync(join(HIER, "woerter-hristov.json"), "utf8")) : null;
const sofiaWoerter = WH ? Object.keys(WH.woerter).length : null, sofiaGerechnet = WH ? WH.gerechnet : null;
// Li, Li & Liao (2021), github.com/sjtu-liao/three-body: je Zeile m1 m2 m3 x1 v1 v2 T S/U (werkzeug/nichthierarchisch-pruefen.mjs)
const NH = (() => { const z = readFileSync(join(HIER, "quelle", "non-hierarchical-3b-supplementary_data.txt"), "utf8").split(/\r?\n/).filter(l => /^\s*[\d.]/.test(l)).map(l => l.trim().split(/\s+/));
  let min = Infinity, max = -Infinity;   // Schleife statt Math.min(...m): 406 335 Argumente sprengen den Stapel
  for (const t of z) for (const x of t.slice(0, 3).map(Number)) { if (x < min) min = x; if (x > max) max = x; }
  return { zeilen: z.length, stabil: z.filter(t => t[7] === "S").length, min, max }; })();
const URTEIL = { stabil: "stable", instabil: "unstable", "an der Grenze": "boundary" };

function familie(name, T5, kennung, fortsetzung) {
  const r = genau5.geprueft.find(x => Math.abs(+x.T - T5) < 1e-3), f = lauf5.funde[r.i], g = r.stabilGenau;
  const Ts = f.Ts, E = -Math.pow(Ts / +r.T, 2 / 3);
  const fuenf = { m3: 5, a: r.a, b: r.b, T: r.T, Ts, s1: g.s1, s2: g.s2, komplex: !!g.komplex, sIm: g.sIm, rand: g.rand, rest: r.rest, rMin: f.rMin, urteil: g.urteil };
  const R = lade(fortsetzung + ".json");
  const G = existsSync(join(HIER, "ergebnisse", fortsetzung + "-genau.json")) ? lade(fortsetzung + "-genau.json").punkte.filter(p => p.ok) : [];
  const proben = [...G.filter(p => Math.abs(p.m3 - 5) > 1e-12), fuenf].sort((x, y) => x.m3 - y.m3);
  for (const p of proben) { p.r320 = rueckkehr(p.m3, p.a, p.b, p.T, 320, 40); p.r448 = rueckkehr(p.m3, p.a, p.b, p.T, 448, 52); }
  // Halbperioden-Symmetrie je Probe (halbperiode.mjs, double): x(T/2) = g x(0) und M = N²
  // (04.11.2026). Daraus s = σ² − 2: ein reeller Index berührt −2 höchstens, kreuzt nie.
  for (const p of proben) {
    const h = spawnSync(process.execPath, [join(HIER, "halbperiode.mjs"), "--m", `1,1,${p.m3}`, "--a", p.a, "--b", p.b, "--T", p.T], { encoding: "utf8" });
    const zahlNach = re => +((h.stdout.match(re) || [])[1]);
    p.sym = { code: h.status, d: zahlNach(/\| = ([\d.e+-]+)\s+\(best other g/), dAnders: zahlNach(/best other g: ([\d.e+-]+)\)/),
      q: zahlNach(/\|N² − M\| \/ \|M\| = ([\d.e+-]+)/), qOhne: zahlNach(/without g: ([\d.e+-]+);/), qAnders: zahlNach(/with the best other g: ([\d.e+-]+)\)/),
      tausch: /bodies 1 and 2 exchanged/.test(h.stdout) };
  }
  // stabiler Block um m3 = 5. Dazu zählen Proben „an der Grenze“, deren Rand positiv ist und
  // deren Index bei −2 liegt, wenn M = N² gilt: dort berührt der Index −2 (s = σ² − 2, σ = 0).
  // Ohne diese Regel endete das Fenster am 04.11.2026 an der Berührstelle bei 4,5469.
  const beruehrt = p => p.urteil === "an der Grenze" && !p.komplex && p.rand >= 0 && p.sym.code === 0 && Math.abs(Math.min(p.s1, p.s2)) >= Math.abs(Math.max(p.s1, p.s2));
  const drin = p => p.urteil === "stabil" || beruehrt(p);
  const i5 = proben.findIndex(p => p.m3 === 5);
  let lo = i5, hi = i5;
  while (lo > 0 && drin(proben[lo - 1])) lo--;
  while (hi < proben.length - 1 && drin(proben[hi + 1])) hi++;
  const block = proben.slice(lo, hi + 1);
  const fenster = { stabilVon: proben[lo].m3, stabilBis: proben[hi].m3, instabilUnten: lo > 0 ? proben[lo - 1] : null, instabilOben: hi < proben.length - 1 ? proben[hi + 1] : null,
    stabileProben: block.filter(p => p.urteil === "stabil").length, beruehrend: block.filter(beruehrt) };
  const engsterRand = block.reduce((x, y) => (y.rand < x.rand ? y : x));
  // Krümmung des Randes um die Berührstelle, aus den beiden nächsten Nachbarn: Rand ≈ k (m3 − m*)²
  const nachbarn = proben.filter(p => p !== engsterRand && Math.abs(p.m3 - engsterRand.m3) < 1e-5).sort((x, y) => Math.abs(x.m3 - engsterRand.m3) - Math.abs(y.m3 - engsterRand.m3));
  const kruemmung = nachbarn.slice(0, 2).map(p => ({ m3: p.m3, abstand: Math.abs(p.m3 - engsterRand.m3), rand: p.rand, k: (p.rand - engsterRand.rand) / (p.m3 - engsterRand.m3) ** 2 }));
  const symAlle = { n: proben.length, gut: proben.filter(p => p.sym.code === 0).length, dMax: Math.max(...proben.map(p => p.sym.d)), qMax: Math.max(...proben.map(p => p.sym.q)),
    andersMin: Math.min(...proben.map(p => Math.min(p.sym.qOhne, p.sym.qAnders))), dAndersMin: Math.min(...proben.map(p => p.sym.dAnders)), tausch: proben.every(p => p.sym.tausch), ohneTausch: proben.every(p => !p.sym.tausch) };
  const fam = FA.familien.find(x => x.kennung === kennung), fv = FV.bahnen.find(x => Math.abs(x.T - T5) < 1e-3);
  const alle = [...R.richtungen.abwaerts.punkte.slice().reverse(), { m3: R.start.m3, a: R.start.a, b: R.start.b, T: R.start.T, s1: R.kalibrierung.start.s1, s2: R.kalibrierung.start.s2, komplex: false, stabil: null, rMin: f.rMin, Ts }, ...R.richtungen.aufwaerts.punkte];
  // Bewegungsenergie nie null? (werkzeug/stillstand.mjs)
  const st = spawnSync(process.execPath, [join(HIER, "werkzeug", "stillstand.mjs"), "--m", "1,1,5", "--a", r.a, "--b", r.b, "--T", r.T], { encoding: "utf8" });
  const kin = +((st.stdout.match(/— ([\d.]+) % von \|E\|/) || [])[1]);
  const gegen = (st.stdout.match(/kleinste Bewegungsenergie (-?[\d.e+-]+) \(/g) || []).length;
  // die Fortsetzung in double zwischen den 30-Stellen-Proben: auch dort stabil?
  const imFenster = alle.filter(p => p.stabil !== null && p.m3 >= fenster.stabilVon - 1e-9 && p.m3 <= fenster.stabilBis + 1e-9).sort((x, y) => x.m3 - y.m3);
  const zwischen = { n: imFenster.length, instabil: imFenster.filter(p => !p.stabil).length,
    luecke: Math.max(...imFenster.slice(1).map((p, i) => p.m3 - imFenster[i].m3)), rand: Math.min(...imFenster.map(p => p.rand)) };
  return { name, r, f, g, Ts, E, fuenf, R, proben, fenster, engsterRand, kruemmung, symAlle, zwischen, fam, fv, alle, kin, gegenproben: gegen,
    rMinVon: Math.min(...alle.map(p => p.rMin)), rMinBis: Math.max(...alle.map(p => p.rMin)) };
}
const B = familie("B", 19.2567, "1ckw2su4jtc", "fortsetzung-1-1-5-b");
const A = familie("A", 78.2389, "oajqcvm5vn", "fortsetzung-1-1-5-a");

/* ── Daten ── */
const zahl = (x, n) => (Number.isFinite(x) ? x.toFixed(n) : "");
const exp = x => (Number.isFinite(x) ? x.toExponential(3) : "");
function tabelle30(F, datei) {
  const z = ["# " + `Family ${F.name}: periodic orbits of the planar three-body problem, G = 1, m1 = m2 = 1, zero angular momentum,`,
    "# isosceles collinear (Euler) initial conditions: r1 = (-1, 0), r2 = (1, 0), r3 = (0, 0); v1 = v2 = (a, b); v3 = -(2/m3) (a, b).",
    "# a, b, T verified to 30 digits (Newton in 320-bit fixed point, Taylor order 40; residual recomputed at 448 bits, order 52).",
    "# s1, s2: stability indices lambda + 1/lambda from the monodromy matrix at 30 digits (compared with a second computation at 128 more bits).",
    "# For a complex pair, s1 = s2 = real part and im_s is the imaginary part. margin = 2 - max|s| (negative: unstable). T_star = T |E|^1.5.",
    "# return_320, return_448: distance after one period of exactly the digits in this row, at 320 bits (order 40) and 448 bits (order 52).",
    "# r_min: closest approach of two bodies (double precision).",
    "m3,a,b,T,T_star,s1,s2,im_s,margin,verdict,return_320,return_448,r_min"];
  for (const p of F.proben) z.push([p.m3, p.a, p.b, p.T, zahl(p.Ts, 6), zahl(p.s1, 12), zahl(p.s2, 12), p.komplex ? exp(p.sIm) : "", exp(p.rand), URTEIL[p.urteil] || p.urteil, exp(p.r320), exp(p.r448), zahl(p.rMin, 5)].join(","));
  writeFileSync(join(ZIEL, "daten", datei), z.join("\n") + "\n");
}
function tabelleFortsetzung(F, datei, hinweis) {
  const z = [`# Family ${F.name}: continuation in m3 (double precision; Newton on the full period with the core kern.js). ${hinweis}`,
    "# stable_double: true / false / empty = undecided in double precision. complex: the two indices form a complex pair (s1 = s2 = real part).",
    "m3,a,b,T,T_star,s1,s2,complex,stable_double,r_min"];
  for (const p of F.alle) z.push([zahl(p.m3, 6), zahl(+p.a, 15), zahl(+p.b, 15), zahl(+p.T, 12), zahl(p.Ts, 6), zahl(p.s1, 6), zahl(p.s2, 6), p.komplex ? "true" : "false", p.stabil === true ? "true" : p.stabil === false ? "false" : "", zahl(p.rMin, 5)].join(","));
  writeFileSync(join(ZIEL, "daten", datei), z.join("\n") + "\n");
}
tabelle30(B, "family-B-30digit.csv"); tabelleFortsetzung(B, "family-B-continuation.csv", "For this family double precision agrees with the 30-digit indices to about 3e-5 at m3 = 5.");
tabelle30(A, "family-A-30digit.csv"); tabelleFortsetzung(A, "family-A-continuation.csv", "For this family double precision is NOT reliable for stability (close encounters down to 1.5e-4; at m3 = 5 the indices are off by about 0.13) — use the 30-digit file.");

/* ── Bilder ── */
for (const F of [B, A]) {
  const aus = relative(HIER, join(ZIEL, "bilder", `family-${F.name}-m3-5.png`));
  const b = spawnSync(process.execPath, [join(HIER, "werkzeug", "bahnbild.mjs"), "--m", "1,1,5", "--a", F.r.a, "--b", F.r.b, "--T", F.r.T, "--aus", aus], { encoding: "utf8" });
  if (b.status !== 0) { console.error(b.stderr || b.stdout); process.exit(1); }
  F.bild = (b.stdout.match(/Schluss nach einem Umlauf ([\d.e+-]+)/) || [])[1];
}
// Stabilitätsdiagramm für B (SVG, weißer Grund, lesbar in hellem und dunklem GitHub)
{
  const W = 880, H = 500, L = 76, Rr = 24, O = 46, U = 64, x0 = 3.95, x1 = 5.30, y0 = -2.6, y1 = 2.6;
  const X = m => L + (m - x0) / (x1 - x0) * (W - L - Rr), Y = s => O + (y1 - Math.max(y0, Math.min(y1, s))) / (y1 - y0) * (H - O - U);
  const pts = B.alle.filter(p => p.m3 >= x0 - 1e-9 && p.m3 <= x1 && Number.isFinite(p.s1));
  const linie = (sel, farbe, strich) => `<polyline fill="none" stroke="${farbe}" stroke-width="2"${strich ? ` stroke-dasharray="${strich}"` : ""} points="${pts.map(p => `${X(p.m3).toFixed(1)},${Y(sel(p)).toFixed(1)}`).join(" ")}"/>`;
  const fx = B.fenster;
  const t = [`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" font-family="Helvetica, Arial, sans-serif" font-size="14">`,
    `<rect width="${W}" height="${H}" fill="#ffffff"/>`,
    `<rect x="${X(fx.stabilVon).toFixed(1)}" y="${O}" width="${(X(fx.stabilBis) - X(fx.stabilVon)).toFixed(1)}" height="${H - O - U}" fill="#e3f4ea"/>`,
    `<rect x="${L}" y="${Y(2).toFixed(1)}" width="${W - L - Rr}" height="${(Y(-2) - Y(2)).toFixed(1)}" fill="none" stroke="#9aa5b1" stroke-dasharray="4 4"/>`];
  for (let m = 4.0; m <= 5.3 + 1e-9; m += 0.1) t.push(`<line x1="${X(m).toFixed(1)}" y1="${H - U}" x2="${X(m).toFixed(1)}" y2="${H - U + 5}" stroke="#333"/><text x="${X(m).toFixed(1)}" y="${H - U + 20}" text-anchor="middle" fill="#333">${m.toFixed(1)}</text>`);
  for (const s of [-2, -1, 0, 1, 2]) t.push(`<line x1="${L - 5}" y1="${Y(s).toFixed(1)}" x2="${L}" y2="${Y(s).toFixed(1)}" stroke="#333"/><text x="${L - 9}" y="${(Y(s) + 5).toFixed(1)}" text-anchor="end" fill="#333">${s}</text>`);
  t.push(`<rect x="${L}" y="${O}" width="${W - L - Rr}" height="${H - O - U}" fill="none" stroke="#333"/>`);
  t.push(`<clipPath id="k"><rect x="${L}" y="${O}" width="${W - L - Rr}" height="${H - O - U}"/></clipPath><g clip-path="url(#k)">`);
  t.push(linie(p => p.s1, "#2b7bba"), linie(p => p.s2, "#e08a00"));
  for (const p of B.proben) for (const s of p.komplex ? [p.s1] : [p.s1, p.s2])
    t.push(`<circle cx="${X(p.m3).toFixed(1)}" cy="${Y(s).toFixed(1)}" r="4" fill="${p.urteil === "stabil" || B.fenster.beruehrend.includes(p) ? "#1a7f45" : "#ffffff"}" stroke="#1a7f45" stroke-width="1.5"/>`);
  t.push("</g>");
  t.push(`<text x="${L}" y="26" font-size="16" fill="#111">Family B (m1 = m2 = 1): stability indices s = λ + 1/λ along the continuation in m3</text>`,
    `<text x="${(L + W - Rr) / 2}" y="${H - 18}" text-anchor="middle" fill="#111">m3</text>`,
    `<text x="20" y="${(O + H - U) / 2}" transform="rotate(-90 20 ${(O + H - U) / 2})" text-anchor="middle" fill="#111">s</text>`,
    `<text x="${X(fx.stabilVon) + 6}" y="${O + 18}" fill="#1a7f45">linearly stable for ${fx.stabilVon} ≤ m3 ≤ ${fx.stabilBis} (30-digit samples)</text>`,
    `<text x="${W - Rr - 6}" y="${H - U - 28}" text-anchor="end"><tspan fill="#2b7bba">blue: s1 (the larger index)</tspan><tspan fill="#555"> · </tspan><tspan fill="#e08a00">orange: s2</tspan></text>`,
    `<text x="${W - Rr - 6}" y="${H - U - 10}" text-anchor="end" fill="#555">lines: double-precision continuation · circles: 30 digits (filled = stable, or touching −2) · dashed box: |s| = 2</text>`,
    "</svg>");
  writeFileSync(join(ZIEL, "bilder", "family-B-stability.svg"), t.join("\n") + "\n");
}

/* ── Code ── */
for (const n of ["kern.js", "genau.mjs", "quellen.mjs", "bahn-pruefen.mjs", "halbperiode.mjs"]) copyFileSync(join(HIER, n), join(ZIEL, n));
copyFileSync(join(HIER, "familie-b", "alle-pruefen.mjs"), join(ZIEL, "alle-pruefen.mjs"));

/* ── Texte ── */
const fmt = (x, n) => x.toFixed(n);
const fB = B.fenster, fA = A.fenster;
const lit = [
  "Li X, Liao S (2017). More than six hundred new families of Newtonian periodic planar collisionless three-body orbits. Sci. China Phys. Mech. Astron. 60, 129511. doi:10.1007/s11433-017-9078-5",
  "Li X, Jing Y, Liao S (2018). Over a thousand new periodic orbits of a planar three-body system with unequal masses. Publ. Astron. Soc. Japan 70, 64. doi:10.1093/pasj/psy057",
  "Li X, Liao S (2019). Collisionless periodic orbits in the free-fall three-body problem. New Astronomy 70, 22-26. doi:10.1016/j.newast.2019.01.003",
  "Šuvakov M, Dmitrašinović V (2013). Three classes of Newtonian three-body planar periodic orbits. Phys. Rev. Lett. 110, 114301.",
  "Hristov I, Hristova R, et al. Databases of periodic three-body orbits, db2.fmi.uni-sofia.bg; arXiv:2404.16526, arXiv:2308.16159, arXiv:2510.22802.",
  "Li X, Li X, Liao S (2021). One family of 13315 stable periodic orbits of non-hierarchical unequal-mass triple systems. Sci. China Phys. Mech. Astron. 64, 219511. doi:10.1007/s11433-020-1624-7",
  "Habl F (2026). dreikoerper: a search engine for periodic orbits of the planar three-body problem, and its finds. Zenodo. doi:10.5281/zenodo.23536576"];
const R = [];
R.push("# Family B: a linearly stable family of planar periodic three-body orbits whose topology is not in the published lists", "");
if (DOI) R.push(`[![DOI](https://zenodo.org/badge/DOI/${DOI}.svg)](https://doi.org/${DOI})`, "");
R.push("Felix Habl. Code and computations written with Claude, an AI model by Anthropic. Companion to the search engine [dreikoerper](https://github.com/Ne0nk3k/dreikoerper) ([doi:10.5281/zenodo.23536576](https://doi.org/10.5281/zenodo.23536576)).", "",
  "## Summary", "",
  `Planar three-body problem, G = 1, zero angular momentum, masses m1 = m2 = 1 and m3 variable, isosceles collinear (Euler) initial conditions in the convention of Li & Liao: r1 = (−1, 0), r2 = (1, 0), r3 = (0, 0); v1 = v2 = (a, b); v3 = −(2/m3) (a, b).`, "",
  `**Family B** is a one-parameter family of symmetric periodic orbits with the free-group word \`${B.fv.wort}\` (${B.fv.buchstaben} letters). It is **linearly stable for m3 from ${fB.stabilVon} to ${fB.stabilBis}** (30-digit samples; the boundaries lie between ${fB.instabilUnten.m3} and ${fB.stabilVon} and between ${fB.stabilBis} and ${fB.instabilOben.m3})${fB.beruehrend.length ? `; at one mass inside, m3 ≈ ${fmt(B.engsterRand.m3, 7)}, one index touches −2 without crossing it` : ""}. Its word occurs in none of the published lists we checked, at any mass. At m3 = 5:`, "",
  "```", `m1 = m2 = 1, m3 = 5`, `a  = ${B.r.a}`, `b  = ${B.r.b}`, `T  = ${B.r.T}`, `T* = T |E|^1.5 = ${fmt(B.Ts, 4)}   (E = ${fmt(B.E, 4)})`, "```", "",
  `- **Stability indices** (λ + 1/λ, 30 digits): ${fmt(B.g.s1, 12)} and ${fmt(B.g.s2, 12)}.`,
  `- **Return distance** of exactly these digits after one period: ${exp(B.fuenf.r320)} at 320 bits, ${exp(B.fuenf.r448)} at 448 bits. It comes from rounding the initial values to 32 digits, not from the integration: before rounding, the Newton residual is ${exp(B.fuenf.rest)}.`,
  `- **Closest approach** of two bodies: ${fmt(B.fuenf.rMin, 4)} at m3 = 5 (${fmt(B.rMinVon, 3)} to ${fmt(B.rMinBis, 3)} along the continuation).`, "",
  `![One period of family B at m3 = 5](bilder/family-B-m3-5.png)`, "",
  `*One period at m3 = 5, computed with \`kern.js\` from the values above (the orbit closes to ${B.bild} in double precision). Blue and orange: the bodies of mass 1; pink: the body of mass 5; the dots mark the starting configuration.*`, "",
  "## Stability along the family", "",
  "![Stability indices of family B along m3](bilder/family-B-stability.svg)", "",
  `The family was continued in m3 from ${fmt(B.R.richtungen.abwaerts.bis, 3)} to ${fmt(B.R.richtungen.aufwaerts.bis, 3)} (double precision, \`daten/family-B-continuation.csv\`); the free-group word stays the same throughout. Stability was then computed at 30 digits at ${B.proben.length} masses (\`daten/family-B-30digit.csv\`):`, "",
  "| m3 | verdict at 30 digits | indices |", "|---|---|---|",
  ...[fB.instabilUnten, B.proben.find(p => p.m3 === fB.stabilVon), B.proben.find(p => p.m3 === 5), B.proben.find(p => p.m3 === fB.stabilBis), fB.instabilOben].filter(Boolean).map(p =>
    `| ${p.m3} | ${URTEIL[p.urteil]}${p.komplex ? " (complex pair)" : ""} | ${p.komplex ? `${fmt(p.s1, 6)} ± ${fmt(p.sIm, 6)} i` : `${fmt(p.s1, 6)} / ${fmt(p.s2, 6)}`} |`), "",
  `Between ${fB.stabilVon} and ${fB.stabilBis} all ${fB.stabileProben + fB.beruehrend.length} samples have both indices real and in [−2, 2): ${fB.stabileProben} are stable with a margin above 1e-15${fB.beruehrend.length ? `, ${fB.beruehrend.length} (m3 = ${fB.beruehrend.map(p => p.m3).join(" and ")}) are closer to −2 than that, with a positive margin (next paragraph)` : ""}. All ${B.zwischen.n} points of the double-precision continuation in that range are stable too (spaced at most ${B.zwischen.luecke.toFixed(2)} apart${B.zwischen.instabil ? `; ${B.zwischen.instabil} of them unstable` : ""}). Below the lower boundary the two indices form a complex pair, so the four nontrivial multipliers lie off the unit circle; at the upper boundary s1 crosses +2.`, "",
  `**One index touches −2 without crossing it.** Family B has a half-period symmetry: after half a period the state is the mirror image of the initial state, x(T/2) = g x(0), where g is a reflection of the plane combined with a rotation${B.symAlle.ohneTausch ? "; no bodies are exchanged" : ""}. Since g maps solutions to solutions, x(t + T/2) = g x(t) for all t, and the monodromy matrix is a square: M = N² with N = g · DΦ(T/2). Each nontrivial index is then s = σ² − 2, with σ the corresponding index of N. While the two indices are real and distinct, as here, both σ are real and s ≥ −2: an index can touch −2 but cannot pass below it. \`halbperiode.mjs\` checks this in double precision at ${B.symAlle.gut === B.symAlle.n ? `all ${B.symAlle.n}` : `${B.symAlle.gut} of the ${B.symAlle.n}`} samples of the 30-digit table: |g x(0) − x(T/2)| ≤ ${B.symAlle.dMax.toExponential(1)} (for the best other g at least ${B.symAlle.dAndersMin.toFixed(2)}), |N² − M| / |M| ≤ ${B.symAlle.qMax.toExponential(1)} (without g, or with the other g, at least ${B.symAlle.andersMin.toFixed(1)}).`, "",
  ...(fB.beruehrend.length ? [`Near m3 = ${fmt(B.engsterRand.m3, 10)} the index s2 comes down to −2. The 30-digit margin is ${exp(B.engsterRand.rand)} at m3 = ${B.engsterRand.m3}, ${B.kruemmung.map(k => `${exp(k.rand)} at ${k.m3} (${k.abstand.toExponential(2)} away)`).join(" and ")}. Both neighbours give the same curvature, margin ≈ k (m3 − m*)² with k = ${B.kruemmung.map(k => k.k.toFixed(2)).join(" and ")}: the quadratic touch that σ passing through zero produces. So there is no unstable sliver; at a single mass the index equals −2.`, ""] : []),
  "## Why we think this topology is not in the published lists", "",
  `1. **Word comparison over all masses.** The word was compared up to relabelling of all three bodies, cyclic shift and time reversal with Li & Liao (2017), Li, Jing & Liao (2018, all seven masses), Šuvakov & Dmitrašinović (2013), and the databases of Hristov et al. (${sofiaEintraege.toLocaleString("en")} equal-mass initial conditions${sofiaWoerter ? `; words computed for ${sofiaGerechnet.toLocaleString("en")} of them, ${sofiaWoerter.toLocaleString("en")} distinct` : ""}). It occurs in none of them.`,
  `   - *Calibration:* our words reproduce ${WE.gleichBisAufDrehung} of the ${WE.verglichen} published words of Li, Jing & Liao (2018) letter for letter (up to cyclic shift); ${abweichlerText(WE)}. The ${FA.referenz.bahnen} listed orbits recomputed from their initial conditions give the stored class in ${FA.referenz.eichung} cases, and ${FA.eichungWortlisten.findenIhrWort} of ${FA.eichungWortlisten.gelisteteFunde} of our own orbits that match a listed orbit by position or T* also find their word in the lists.`,
  `2. **Not a satellite of a shorter orbit.** A satellite winds k times almost along a shorter orbit, so its word is almost a k-fold repetition. Compared letter by letter, at every cyclic shift and in both directions, the closest k-fold repetition (k = 2 … 8 dividing the length) differs from family B's word in ${B.fv.abweichung} of its ${B.fv.buchstaben} letters (k = ${B.fv.k}). The satellite rule used in our searches allows at most ${FV.schwelle}; all ${FV.eichung.getroffen} of ${FV.eichung.satelliten} satellites recognised in our runs lie within it.`,
  `3. **Not a free-fall orbit.** The kinetic energy never drops below ${fmt(B.kin, 1)} % of |E|; orbits in free-fall lists come to rest once per period (check on ${B.gegenproben} free-fall orbits of Li & Liao 2019: minimum ≈ 1e-12).`,
  `4. **Continuation.** Continued from m3 = ${fmt(B.R.richtungen.abwaerts.bis, 3)} to ${fmt(B.R.richtungen.aufwaerts.bis, 3)}, the family keeps its word. At the other masses on the way for which a list exists (m3 = ${B.R.listen.map(l => l.m3).join(", ")}) it is not in the list either (${B.R.listen.map(l => l.liliao.listeBahnen).join(", ")} orbits).`,
  `5. **Other collections.** The atlas threebodyorbits.com contains, for these masses, exactly the orbits of Li, Jing & Liao (2018). The ${NH.zeilen.toLocaleString("en")} orbits of Li, Li & Liao (2021), ${NH.stabil.toLocaleString("en")} of them stable, have masses between ${NH.min} and ${NH.max}, so none has the ratio 1 : 1 : 5. A literature search (October–November 2026) found no newer list for this configuration.`, "",
  `**Limits of this claim.** "Not in the lists" means: not in the lists we know and checked. Hristov et al. cover equal masses only (T* < 211). Li, Jing & Liao list one orbit per class, from initial conditions in the square 0 < a, b < 1; family B lies outside that square (at m3 = 5, b = ${fmt(+B.r.b, 3)}). Our search finds symmetric orbits only.`, "",
  "## A second candidate: family A", "",
  "```", `m1 = m2 = 1, m3 = 5`, `a  = ${A.r.a}`, `b  = ${A.r.b}`, `T  = ${A.r.T}`, `T* = ${fmt(A.Ts, 4)}   (E = ${fmt(A.E, 4)})`, "```", "",
  `Stability indices at 30 digits ${fmt(A.g.s1, 10)} and ${fmt(A.g.s2, 10)} (margin ${fmt(A.g.rand, 2)}); return distance of these digits ${exp(A.fuenf.r320)} at 320 bits and ${exp(A.fuenf.r448)} at 448 bits. Word of ${A.fv.buchstaben} letters, in no list; nearest repetition ${A.fv.abweichung} letters off; kinetic energy never below ${fmt(A.kin, 1)} % of |E|. Its bodies come as close as ${fmt(A.rMinVon, 5)}, so double precision cannot judge its stability; at 30 digits it is ${A.proben.length > 1 ? `stable at ${A.proben.filter(p => p.urteil === "stabil").map(p => p.m3).join(", ")}${A.proben.some(p => p.urteil !== "stabil") ? ` and ${A.proben.filter(p => p.urteil !== "stabil").map(p => `${URTEIL[p.urteil]} at ${p.m3}`).join(", ")}` : ""}` : "computed at m3 = 5 only"}. Its stability window is not determined (\`daten/family-A-30digit.csv\`, \`daten/family-A-continuation.csv\`). ${A.symAlle.gut === A.symAlle.n && A.symAlle.tausch ? `Family A has a half-period symmetry too, with the two bodies of mass 1 exchanged (|N² − M| / |M| ≤ ${A.symAlle.qMax.toExponential(1)} at all ${A.symAlle.n} samples, other readings at least ${A.symAlle.andersMin.toFixed(1)}).` : `Half-period symmetry: confirmed at ${A.symAlle.gut} of ${A.symAlle.n} samples.`}`, "",
  "## Check it yourself", "",
  "Node.js 18 or later, no packages:", "",
  "```", `node bahn-pruefen.mjs --m 1,1,5 --a ${B.r.a} --b ${B.r.b} --T ${B.r.T}`, "node alle-pruefen.mjs daten/family-B-30digit.csv", `node halbperiode.mjs --m 1,1,5 --a ${B.r.a} --b ${B.r.b} --T ${B.r.T}`, "```", "",
  "The first line integrates one period at 320 and at 448 bits and computes both stability indices (about one and a half minutes for family B on one core). The second repeats this for every row of the table and compares verdicts and indices with the table. The third checks the half-period symmetry and M = N² in double precision (a few seconds). The search, the list comparisons and the continuation tools are in the main project (`werkzeug/massen-fortsetzung.mjs`, `werkzeug/familien-abgleich.mjs`, `werkzeug/fast-vielfach.mjs`, `werkzeug/stillstand.mjs`).", "",
  "## Files", "",
  "| File | Content |", "|---|---|",
  "| `daten/family-B-30digit.csv` | 30-digit initial conditions and stability at every sampled mass |",
  "| `daten/family-B-continuation.csv` | the continuation in m3, double precision |",
  "| `daten/family-A-30digit.csv`, `daten/family-A-continuation.csv` | the same for family A |",
  "| `bilder/` | the orbits at m3 = 5 and the stability diagram |",
  "| `bahn-pruefen.mjs`, `halbperiode.mjs`, `genau.mjs`, `kern.js`, `quellen.mjs` | the verification code, taken unchanged from the main project |",
  "| `alle-pruefen.mjs` | runs `bahn-pruefen.mjs` on every row of a table (written for this repository) |", "",
  "## How to cite", "",
  DOI ? `Habl, F. (2026). Family B: a linearly stable family of planar periodic three-body orbits whose topology is not in the published lists. Zenodo. [doi:${DOI}](https://doi.org/${DOI})` : "See `CITATION.cff` (GitHub: \"Cite this repository\").", "",
  "## References", "", ...lit.map(x => "- " + x), "",
  "## License", "", "Data and text: [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). Code: MIT (see `LICENSE`).", "");
writeFileSync(join(ZIEL, "README.md"), R.join("\n"));

const titel = "Family B: a linearly stable family of planar periodic three-body orbits whose topology is not in the published lists";
const kurz = `A one-parameter family of symmetric periodic orbits of the planar three-body problem (G = 1, zero angular momentum, m1 = m2 = 1, isosceles collinear initial conditions), free-group word ${B.fv.wort}, linearly stable for m3 from ${fB.stabilVon} to ${fB.stabilBis} (30-digit samples${fB.beruehrend.length ? `; at m3 ≈ ${fmt(B.engsterRand.m3, 7)} one index touches −2 without crossing it, a consequence of a half-period symmetry` : ""}). Its word occurs in none of the published lists checked (Li & Liao 2017, Li, Jing & Liao 2018, Šuvakov & Dmitrašinović 2013, Hristov et al.), at any mass. At m3 = 5: a = ${B.r.a}, b = ${B.r.b}, T = ${B.r.T}, stability indices ${fmt(B.g.s1, 5)} and ${fmt(B.g.s2, 5)}. Includes the 30-digit data along the family, a second candidate (family A), and the verification code.`;
writeFileSync(join(ZIEL, "CITATION.cff"), [
  "cff-version: 1.2.0", 'message: "If you use these orbits, please cite them as below."', `title: "${titel}"`, "type: dataset",
  "authors:", "  - family-names: Habl", "    given-names: Felix", 'repository-code: "https://github.com/Ne0nk3k/dreikoerper-familie-b"', 'version: "1.0.0"',
  // Tag des Baus in Ortszeit: gebaut wird am Tag der Freigabe (vorher fest „2026-11-05“)
  ...(DOI ? [`doi: "${DOI}"`] : []), "license:", "  - CC-BY-4.0", "  - MIT", `date-released: "${new Date().toLocaleDateString("sv-SE")}"`,
  "keywords:", "  - three-body problem", "  - periodic orbits", "  - linear stability", "  - celestial mechanics", "  - unequal masses",
  "abstract: >-", ...(kurz + " Code and computations were written with Claude, an AI model by Anthropic.").match(/.{1,74}(\s|$)/g).map(z => "  " + z.trim()), ""].join("\n"));
writeFileSync(join(ZIEL, ".zenodo.json"), JSON.stringify({
  upload_type: "dataset", title: titel, version: "1.0.0", language: "eng", creators: [{ name: "Habl, Felix" }],
  description: `<p>${kurz.replace(/&/g, "&amp;")}</p><p>"Not in the lists" means: not in the lists we know and checked; Hristov et al. cover equal masses only, Li, Jing &amp; Liao list one orbit per class from the square 0 &lt; a, b &lt; 1, outside which family B lies.</p>`,
  keywords: ["three-body problem", "periodic orbits", "linear stability", "celestial mechanics", "unequal masses"],
  license: "cc-by-4.0",
  notes: "Data and text: CC BY 4.0. Code (bahn-pruefen.mjs, alle-pruefen.mjs, halbperiode.mjs, genau.mjs, kern.js, quellen.mjs): MIT. Felix Habl had the idea and directed the work; the code, the computations and the documentation were written by Claude, an AI model by Anthropic. Every number comes from a computation.",
  related_identifiers: [{ identifier: "10.5281/zenodo.23536576", relation: "isSupplementTo", scheme: "doi", resource_type: "software" }],
  references: lit,
}, null, 2) + "\n");
writeFileSync(join(ZIEL, "LICENSE"), readFileSync(join(HIER, "oeffentlich", "LICENSE"), "utf8").replace(/The results and the data package \(ergebnisse\/, fundbericht\/\)[\s\S]*$/, "The data and text of this repository (daten/, bilder/, README.md) are licensed\nunder Creative Commons Attribution 4.0 International (CC BY 4.0):\nhttps://creativecommons.org/licenses/by/4.0/\n"));
writeFileSync(join(ZIEL, ".gitignore"), "node_modules/\nablage/\n");

console.log(`gebaut: ${ZIEL}`);
console.log(`Familie B: stabil ${fB.stabilVon}–${fB.stabilBis} (${fB.stabileProben} Stützstellen), Grenzen ${fB.instabilUnten && fB.instabilUnten.m3} / ${fB.instabilOben && fB.instabilOben.m3}, engster Rand ${exp(B.engsterRand.rand)} bei ${B.engsterRand.m3}, Bewegungsenergie ≥ ${fmt(B.kin, 1)} %, Bild schließt ${B.bild}`);
console.log(`Familie A: ${A.proben.length} Stützstellen, Bewegungsenergie ≥ ${fmt(A.kin, 1)} %`);
