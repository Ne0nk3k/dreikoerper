// dreikoerper/fundbericht.mjs — ein Paket zum Weitergeben.
//
//   node fundbericht.mjs
//
// Schreibt aus ergebnisse/funde.json (den Bahnen außerhalb der Listen, auf 30
// Stellen belegt) den Ordner fundbericht\:
//   README.md                   eine Seite auf Englisch: was, wie, wogegen geprüft
//   orbits-<ebene>-<massen>.txt je Massensatz eine Tabelle im Stil der Listen
//   words-<ebene>-<massen>.txt  die Wörter (freie Gruppe) dazu
//   stable.txt                  die stabilen und die an der Grenze, alle Massen
//
// Hier wird nichts gerechnet und nichts gesendet. Seit dem 21.10.2026 geht das
// Paket mit dem öffentlichen Repo auf GitHub; Felix' Name steht darin (von ihm
// gewollt), seine Mailadresse nicht — Kontakt über das Repo. Die Seite ist
// englisch, weil ihre Leser es sind; alles andere im Projekt bleibt deutsch.

import { readFileSync, writeFileSync, mkdirSync, readdirSync, unlinkSync } from "node:fs";
import { join } from "node:path";
import { HIER, ladeKatalog } from "./quellen.mjs";

const F = JSON.parse(readFileSync(join(HIER, "ergebnisse", "funde.json"), "utf8"));
const ziel = join(HIER, "fundbericht");
mkdirSync(ziel, { recursive: true });
for (const n of readdirSync(ziel)) if (/^(orbits|words)-.*\.txt$|^stable\.txt$|^README\.md$/.test(n)) unlinkSync(join(ziel, n));

const kat = ladeKatalog().bahnen;
// S stabil · S~ stabil um Haaresbreite (ein Index weniger als 0,001 unter 2) · B ein Index exakt 2 · U instabil
const rand = g => (g && Number.isFinite(g.s1) ? 2 - Math.max(Math.abs(g.s1), Math.abs(g.s2)) : NaN);
const urteil = b => (b.stabilGenau ? (b.stabilGenau.urteil === "stabil" ? (rand(b.stabilGenau) < 1e-3 ? "S~" : "S") : b.stabilGenau.urteil === "an der Grenze" ? "B" : "U") : b.stabil === true ? "S*" : b.stabil === false ? "U*" : "?");
const zahl = (s, n) => String(s).slice(0, n).padEnd(n);
const e = x => (Number.isFinite(x) ? x.toExponential(3) : "-");
const sat = b => (b.satellit ? `${b.satellit.ordnung}x${b.satellit.von}` : "-");

const gruppen = new Map();
for (const b of F.bahnen) { const k = b.ebene + "|" + b.m.join("/"); if (!gruppen.has(k)) gruppen.set(k, []); gruppen.get(k).push(b); }
const zeilen = [], stabile = [];
for (const [k, liste] of gruppen) {
  const [ebene, ms] = k.split("|"), datei = `${ebene === "euler" ? "euler" : "freefall"}-${ms.replace(/\//g, "-")}`;
  liste.sort((x, y) => +x.T - +y.T);
  const kopf = ebene === "euler"
    ? `# Planar three-body problem, G = 1, masses m1/m2/m3 = ${ms}, zero angular momentum.\n# r1 = (-1, 0), r2 = (1, 0), r3 = (0, 0);  v1 = v2 = (a, b);  v3 = -(m1 + m2)/m3 * (a, b).`
    : `# Planar three-body problem, G = 1, masses m1/m2/m3 = ${ms}, free fall (all bodies at rest).\n# r1 = (-0.5, 0), r2 = (0.5, 0), r3 = (a, b).`;
  const T = [kopf,
    "# T* = T |E|^1.5.  stab: S stable; S~ stable by a hair (an index less than 1e-3 below 2); B an index equal to 2 to 26 digits (cause not understood); U unstable — from 320-bit fixed-point arithmetic;",
    "#   S* / U* / ? : from double precision only.  s1, s2: stability indices (lambda + 1/lambda) where computed at 30 digits; |lambda|: largest multiplier in double precision.",
    "# words: number of letters of the free-group word.  sat: k x NAME = k-th order satellite of the listed orbit NAME (word and T* are k-fold).",
    "#",
    "# nr  a                                  b                                  T                                  T*            stab  s1              s2              |lambda|    words  sat"];
  const W = [`# Free-group words for orbits-${datei}.txt (same numbering).`];
  liste.forEach((b, i) => {
    const g = b.stabilGenau, nr = String(i + 1).padStart(4);
    T.push(`${nr}  ${zahl(b.a, 33)}  ${zahl(b.b, 33)}  ${zahl(b.T, 33)}  ${b.Ts.toFixed(7).padStart(12)}  ${urteil(b).padEnd(4)}  ${(g && Number.isFinite(g.s1) ? g.s1.toFixed(9) : "-").padStart(14)}  ${(g && Number.isFinite(g.s2) ? g.s2.toFixed(9) : "-").padStart(14)}  ${e(b.lambda).padStart(10)}  ${String((b.wort || "").length).padStart(5)}  ${sat(b)}`);
    W.push(`${nr}  ${b.wort || "-"}`);
    if (/^[SB]/.test(urteil(b)) || urteil(b) === "?") stabile.push({ b, nr: i + 1, datei, ms, ebene });
  });
  writeFileSync(join(ziel, `orbits-${datei}.txt`), T.join("\n") + "\n");
  writeFileSync(join(ziel, `words-${datei}.txt`), W.join("\n") + "\n");
  const n = u => liste.filter(b => urteil(b).startsWith(u)).length;
  const gelistet = kat.filter(q => q.ebene === ebene && q.m.join("/") === ms).length;
  zeilen.push({ ebene, ms, datei, alle: liste.length, S: n("S"), B: n("B"), U: n("U"), offen: liste.filter(b => urteil(b) === "?").length, sat: liste.filter(b => b.satellit).length, gelistet,
                T0: +liste[0].T, T1: +liste[liste.length - 1].T });
}

const St = ["# Orbits outside the published lists that are linearly stable (S), at the stability boundary (B),",
  "# or undecided in double precision (?). File and number refer to orbits-<file>.txt.",
  "#", "# file                  nr  masses        a                      b                      T                 stab  s1            s2            sat"];
for (const { b, nr, datei, ms } of stabile) {
  const g = b.stabilGenau;
  St.push(`${datei.padEnd(22)} ${String(nr).padStart(4)}  ${ms.padEnd(12)}  ${zahl(b.a, 21)}  ${zahl(b.b, 21)}  ${(+b.T).toFixed(10).padStart(16)}  ${urteil(b).padEnd(4)}  ${(g && Number.isFinite(g.s1) ? g.s1.toFixed(8) : "-").padStart(12)}  ${(g && Number.isFinite(g.s2) ? g.s2.toFixed(8) : "-").padStart(12)}  ${sat(b)}`);
}
writeFileSync(join(ziel, "stable.txt"), St.join("\n") + "\n");

const gleich = zeilen.filter(z => z.ms.split("/").every(x => x === "1")), ungleich = zeilen.filter(z => !gleich.includes(z));
const summe = l => l.reduce((s, z) => s + z.alle, 0);
const R = [`# Periodic orbits of the planar three-body problem outside the published lists`,
  "", `Data package, generated ${F.erzeugt.slice(0, 10)} by \`fundbericht.mjs\`. Authors: Felix Habl (idea and direction) and Claude, an AI model by Anthropic (code and computations). Contact: the issue tracker of the repository this package is published in.`,
  "", "**These orbits are not claimed to be new.** The claim is narrower: each one was compared with the lists named below and is in none of them, and each one is verified to 30 digits.",
  "", "## Contents", "",
  "| File | Configuration | Masses | Orbits | stable / boundary / unstable / undecided | satellites of listed orbits | T from … to | orbits in the reference list for these masses |", "|---|---|---|---|---|---|---|---|",
  ...zeilen.map(z => `| \`orbits-${z.datei}.txt\` | ${z.ebene === "euler" ? "isosceles collinear (Euler), zero angular momentum" : "free fall"} | ${z.ms} | ${z.alle} | ${z.S} / ${z.B} / ${z.U} / ${z.offen} | ${z.sat} | ${z.T0.toFixed(1)} … ${z.T1.toFixed(1)} | ${z.gelistet} (Li, Liao et al.) |`),
  "", `Equal masses: ${summe(gleich)} orbits. Unequal masses: ${summe(ungleich)} orbits. \`stable.txt\` lists the ${stabile.length} orbits that are stable (S, S~), have an index equal to 2 (B), or are undecided.`,
  "", "**Which orbits are in these files.** For equal masses and for masses 1/1/2, every orbit the search found outside the lists was verified to 30 digits. For masses 1/1/0.5, 1/1/0.75 and 1/1/4 only the candidates for stability were: orbits that double precision calls stable, or undecided with both stability indices below 30 in absolute value (calibrated on 325 orbits outside that range, none of which turned out stable at 30 digits). Those runs found many more orbits outside the list (1976, 857 and 943; at 1/1/4 from three search windows in (a, b): 0.6…1.05 × 0…1.05, 0…2.4 × 1…2.4 and 1…2.4 × 0…1, distinct by T*); they are in the run reports, verified in double precision only, and not in this package.",
  "", "## Initial conditions", "",
  "G = 1 throughout.",
  "- **Euler files:** r1 = (−1, 0), r2 = (1, 0), r3 = (0, 0); v1 = v2 = (a, b); v3 = −(m1 + m2)/m3 · (a, b). This is the convention of Li & Liao (2017) and Li, Jing & Liao (2018).",
  "- **Free-fall files:** r1 = (−0.5, 0), r2 = (0.5, 0), r3 = (a, b), all at rest, as in Li & Liao (2019).",
  "- T is the period, T* = T·|E|^1.5 the scale-invariant period.",
  "", "## How the orbits were found and verified", "",
  "1. **Search.** A grid over the (a, b) plane. For each point the orbit is integrated (Taylor series, order 24, double precision) and its closest approach to one of the fixed sets of the reversing symmetries is recorded (a symmetric periodic orbit crosses such a set twice per period), in several time bands. Local minima of this map are refined by Newton's method on the half period.",
  "2. **Check in double precision.** Full-period return, an independent Dormand–Prince integration, the free-group word (Montgomery's topological classification), the minimal period.",
  "3. **Verification at 30 digits.** Newton's method in 320-bit fixed-point arithmetic with a Taylor integrator of order 40 until the return distance is below 1e-30; the residual is recomputed with 448 bits and order 52. An orbit is kept only if both agree and the correction to the double-precision value is small.",
  "4. **Linear stability.** From the monodromy matrix; s1, s2 are the stability indices λ + 1/λ of the two nontrivial multiplier pairs. S: both |s| < 2 with a margin larger than the difference between the 320-bit and the 448-bit computation; S~ the same, but the margin is below 1e-3 (stable by a hair). B: an index equals 2 to within that difference — in practice to 26 digits, i.e. an exact unit multiplier pair. This happens far more often than chance allows (20 of 374 orbits within 1e-6 of 2, only 11 between 1e-6 and 1e-3); we do not know why. U: unstable.",
  "", "## What the orbits were compared with", "",
  "- Li & Liao, *Sci. China Phys. Mech. Astron.* 60 (2017): 695 families, equal masses.",
  "- Li, Jing & Liao, *PASJ* 70 (2018): 1349 families, masses 1/1/m3 with m3 = 0.5, 0.75, 2, 4, 5, 8, 10.",
  "- Li & Liao, *New Astronomy* 70 (2019): 316 free-fall orbits.",
  "- Šuvakov & Dmitrašinović, *PRL* 110 (2013).",
  "- For equal masses in addition the databases of Hristov, Hristova et al. (db2.fmi.uni-sofia.bg, retrieved 2026-10-01): 441 985 initial conditions in the Euler configuration, 29 442 in free fall, including the 971 stable orbits of arXiv:2510.22802.",
  "- Cross-check against the catalogue of threebodyorbits.com (snapshot 2026-09-27, 3943 orbits). For the unequal masses above it contains exactly the orbits of Li, Jing & Liao (2018).",
  "", "An orbit counts as listed if its initial point agrees with a listed one to 1e-6, or if its T* agrees to 2e-8 (the same orbit met at another point of the plane). Agreement of T* to five or six digits is *not* enough: we found pairs of distinct orbits of the same class with nearly equal T* and different stability.",
  "", "## Caveats", "",
  "- **Unequal masses:** the only reference is Li, Jing & Liao (2018), one orbit per family. \"Not in the list\" says little there.",
  "- **Satellites:** some orbits run k times almost along a listed orbit before closing (word and T* are k-fold). They are orbits of their own, but not unexplained ones; the column `sat` names the base orbit.",
  "- Only symmetric orbits are found by the half-period search, and only within the search windows and period limits of each run.",
  "- The comparison covers the lists above. Lists we do not know of are not covered.",
  "- The search code was written with the help of an AI assistant (Claude, Anthropic); every number here comes from a computation, and the test batteries compare the code against published 100-digit initial conditions and eigenvalues.",
  ""];
writeFileSync(join(ziel, "README.md"), R.join("\n"));
console.log(`fundbericht\\: ${zeilen.length} Massensätze, ${F.bahnen.length} Bahnen, ${stabile.length} in stable.txt`);
for (const z of zeilen) console.log(`  orbits-${z.datei}.txt: ${z.alle} Bahnen — S ${z.S}, B ${z.B}, U ${z.U}, offen ${z.offen}; Satelliten ${z.sat}`);
