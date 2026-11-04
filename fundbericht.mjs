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
// Wie viele Listenbahnen ungleicher Massen liegen im Quadrat 0 < a, b < 1? Gezählt, nicht
// behauptet (04.11.2026; vorher stand „from the square“, gestützt auf private Post)
const ungleichListe = kat.filter(b => b.satz === "ungleich"), imQuadrat = ungleichListe.filter(b => b.a > 0 && b.a < 1 && b.b > 0 && b.b < 1).length;
// Familie über alle Massen (werkzeug/familien-abgleich.mjs, seit 04.11.2026):
// ob das Wort einer Bahn irgendwo gelistet ist — bei einer anderen Masse, in den
// Datenbanken aus Sofia, in einer Freifall-Liste — oder nirgends.
const FJ = (() => { try { return JSON.parse(readFileSync(join(HIER, "ergebnisse", "familien-je-bahn.json"), "utf8")).bahnen; } catch { return null; } })();
const FA = (() => { try { return JSON.parse(readFileSync(join(HIER, "ergebnisse", "familien-abgleich.json"), "utf8")); } catch { return null; } })();
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
const WE = (() => { try { return JSON.parse(readFileSync(join(HIER, "ergebnisse", "woerter-eichen.json"), "utf8")); } catch { return null; } })();
const famVon = b => (FJ ? FJ[`${b.ebene}|${b.m.join("/")}|${b.kennung}|${(+b.Ts).toFixed(5)}`] : null);
const famText = b => { const f = famVon(b); if (!f) return "?";
  return f.familie === "new" ? "new" : f.familie === "listed" ? `=${f.name}@${f.m.split("/")[2]}` : f.familie === "hristov" ? "=Hristov" : f.familie === "listed-freefall" ? "=freefall-list"
    : f.familie === "multiple" ? `${f.k}x${f.name}@${f.m.split("/")[2]}` : f.familie === "satellite" ? "satellite" : "?"; };
// Was die Läufe insgesamt gefunden haben, je Massensatz (nur gelesen, nicht gerechnet)
const laeufe = readdirSync(join(HIER, "ergebnisse")).filter(n => /\.json$/.test(n) && !/genau|grauzone|fortsetzung|familien|woerter|vielfach|funde|katalogabgleich/.test(n))
  .map(n => { try { const B = JSON.parse(readFileSync(join(HIER, "ergebnisse", n), "utf8")); return B.parameter && B.funde ? { n, B } : null; } catch { return null; } }).filter(Boolean);
function suchstand(ebene, ms) {
  const L = laeufe.filter(({ B }) => B.parameter.ebene === ebene && B.parameter.m.join("/") === ms);
  const ts = [];
  for (const { B } of L) for (const f of B.funde) if (!f.bekannt && Number.isFinite(f.Ts) && !ts.some(t => Math.abs(t / f.Ts - 1) < 2e-8)) ts.push(f.Ts);
  return { fenster: [...new Set(L.map(({ B }) => (B.parameter.sicht || [0, 0.75, 0, 0.75]).join("…").replace(/…([^…]*)…/, "…$1 × ")))], aussen: ts.length };
}
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
    "# family: is the word listed anywhere, at any mass (up to relabelling of the bodies, cyclic shift, time reversal)?  new = in no list;",
    "#   =NAME@m3 = same word as the listed orbit NAME at m3;  =Hristov = word in the databases of Hristov et al.;  =freefall-list = word in a free-fall list;",
    "#   kxNAME@m3 = exact k-fold of a listed word;  satellite = satellite found within the run.",
    "#",
    "# nr  a                                  b                                  T                                  T*            stab  s1              s2              |lambda|    words  sat           family"];
  const W = [`# Free-group words for orbits-${datei}.txt (same numbering).`];
  liste.forEach((b, i) => {
    const g = b.stabilGenau, nr = String(i + 1).padStart(4);
    T.push(`${nr}  ${zahl(b.a, 33)}  ${zahl(b.b, 33)}  ${zahl(b.T, 33)}  ${b.Ts.toFixed(7).padStart(12)}  ${urteil(b).padEnd(4)}  ${(g && Number.isFinite(g.s1) ? g.s1.toFixed(9) : "-").padStart(14)}  ${(g && Number.isFinite(g.s2) ? g.s2.toFixed(9) : "-").padStart(14)}  ${e(b.lambda).padStart(10)}  ${String((b.wort || "").length).padStart(5)}  ${sat(b).padEnd(12)}  ${famText(b)}`);
    W.push(`${nr}  ${b.wort || "-"}`);
    if (/^[SB]/.test(urteil(b)) || urteil(b) === "?") stabile.push({ b, nr: i + 1, datei, ms, ebene });
  });
  writeFileSync(join(ziel, `orbits-${datei}.txt`), T.join("\n") + "\n");
  writeFileSync(join(ziel, `words-${datei}.txt`), W.join("\n") + "\n");
  const n = u => liste.filter(b => urteil(b).startsWith(u)).length;
  const gelistet = kat.filter(q => q.ebene === ebene && q.m.join("/") === ms).length;
  zeilen.push({ ebene, ms, datei, alle: liste.length, S: n("S"), B: n("B"), U: n("U"), offen: liste.filter(b => urteil(b) === "?").length, sat: liste.filter(b => b.satellit).length, gelistet,
                T0: +liste[0].T, T1: +liste[liste.length - 1].T, neu: liste.filter(b => famText(b) === "new").length,
                neuStabil: liste.filter(b => famText(b) === "new" && /^S/.test(urteil(b))).length, ...suchstand(ebene, ms),
                // im Paket nach T* gezählt wie die Spalte daneben — sonst stünde „301 im Paket“ neben „300 gefunden“
                verschieden: liste.reduce((ts, b) => (ts.some(t => Math.abs(t / b.Ts - 1) < 2e-8) ? ts : ts.concat([b.Ts])), []).length });
}

const St = ["# Orbits outside the published lists that are linearly stable (S), at the stability boundary (B),",
  "# or undecided in double precision (?). File and number refer to orbits-<file>.txt. family: see the header of the orbits files.",
  "#", "# file                  nr  masses        a                      b                      T                 stab  s1            s2            sat           family"];
for (const { b, nr, datei, ms } of stabile) {
  const g = b.stabilGenau;
  St.push(`${datei.padEnd(22)} ${String(nr).padStart(4)}  ${ms.padEnd(12)}  ${zahl(b.a, 21)}  ${zahl(b.b, 21)}  ${(+b.T).toFixed(10).padStart(16)}  ${urteil(b).padEnd(4)}  ${(g && Number.isFinite(g.s1) ? g.s1.toFixed(8) : "-").padStart(12)}  ${(g && Number.isFinite(g.s2) ? g.s2.toFixed(8) : "-").padStart(12)}  ${sat(b).padEnd(12)}  ${famText(b)}`);
}
writeFileSync(join(ziel, "stable.txt"), St.join("\n") + "\n");

// Euler-Ebene vor freiem Fall, dann nach m3 (bis 04.11.2026 in Einleseordnung)
zeilen.sort((x, y) => (x.ebene === y.ebene ? +x.ms.split("/")[2] - +y.ms.split("/")[2] : x.ebene === "euler" ? -1 : 1));
const gleich = zeilen.filter(z => z.ms.split("/").every(x => x === "1")), ungleich = zeilen.filter(z => !gleich.includes(z));
const summe = l => l.reduce((s, z) => s + z.alle, 0);
const R = [`# Periodic orbits of the planar three-body problem outside the published lists`,
  "", `Data package, generated ${new Date(F.erzeugt).toLocaleDateString("sv-SE")} by \`fundbericht.mjs\`. Authors: Felix Habl (idea and direction) and Claude, an AI model by Anthropic (code and computations). Contact: the issue tracker of the repository this package is published in.`,
  "", "**These orbits are not claimed to be new.** The claim is narrower: each one was compared with the lists named below and is in none of them, and each one is verified to 30 digits. Being outside the list *for the same masses* does not make an orbit a new family: the column `family` says whether its topology (free-group word) is listed at any mass.",
  "", "## Contents", "",
  "| File | Configuration | Masses | Orbits | stable / boundary / unstable / undecided | satellites of listed orbits | word in no list (of them stable) | T from … to | orbits in the reference list for these masses |", "|---|---|---|---|---|---|---|---|---|",
  ...zeilen.map(z => `| \`orbits-${z.datei}.txt\` | ${z.ebene === "euler" ? "isosceles collinear (Euler), zero angular momentum" : "free fall"} | ${z.ms} | ${z.alle} | ${z.S} / ${z.B} / ${z.U} / ${z.offen} | ${z.sat} | ${z.neu} (${z.neuStabil}) | ${z.T0.toFixed(1)} … ${z.T1.toFixed(1)} | ${z.gelistet} (Li, Liao et al.) |`),
  "", `Equal masses: ${summe(gleich)} orbits. Unequal masses: ${summe(ungleich)} orbits. \`stable.txt\` lists the ${stabile.length} orbits that are stable (S, S~), have an index equal to 2 (B), or are undecided.`,
  "", "**Which orbits are in these files.** The package contains the orbits that passed the 30-digit verification. From the equal-mass runs and the first run at 1/1/2, every orbit outside the lists was submitted to it. For the other runs only the candidates for stability were: orbits that double precision calls stable, or undecided with both stability indices below 30 in absolute value (calibrated on 325 orbits outside that range, none of which turned out stable at 30 digits). The other orbits these runs found outside the lists are in the run reports (`ergebnisse/`), verified in double precision only:", "",
  "| Masses | search windows in (a, b) | orbits outside the lists (distinct T*, double precision) | in this package (30 digits) |", "|---|---|---|---|",
  ...zeilen.map(z => `| ${z.ms}${z.ebene === "fall" ? " (free fall)" : ""} | ${z.fenster.join("; ")} | ${z.aussen} | ${z.verschieden}${z.verschieden !== z.alle ? ` (${z.alle} entries; ${z.alle - z.verschieden} orbit${z.alle - z.verschieden > 1 ? "s" : ""} met at two points)` : ""} |`),
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
  "", "## Families across all masses (column `family`)", "",
  "A family continued in m3 keeps its free-group word as long as no close encounter becomes a collision. So an orbit outside the list for its own masses can still belong to a listed family — our stable orbit at 1/1/4 is the continuation of I.A-5 at 1/1/2. The word of every orbit was therefore compared, up to relabelling of all three bodies, cyclic shift and time reversal, with the words of all listed orbits at all masses and with the databases of Hristov et al. Free-fall orbits are compared within the free-fall plane (full period), because a word comparison across the two planes does not calibrate.", "",
  ...(() => { const z = {}; for (const b of F.bahnen) { const t = (famVon(b) || { familie: "?" }).familie; z[t] = (z[t] || 0) + 1; }
    return ["| family | orbits |", "|---|---|", ...Object.entries({ "new — word in no list": z.new || 0, "same word as a listed orbit (at another mass, or another orbit of a listed class)": z.listed || 0, "word in the databases of Hristov et al.": z.hristov || 0, "word in a free-fall list": z["listed-freefall"] || 0, "exact multiple of a listed word": z.multiple || 0, "satellite found within the run": z.satellite || 0, "not determined": z["?"] || 0 }).map(([k, v]) => `| ${k} | ${v} |`)]; })(), "",
  FA && WE ? `Calibration: our words reproduce ${WE.gleichBisAufDrehung} of the ${WE.verglichen} published words of Li, Jing & Liao (2018) letter for letter, up to cyclic shift; ${abweichlerText(WE)}. Of our Euler-plane orbits that match a listed orbit by position or T*, ${FA.eichungWortlisten.findenIhrWort} of ${FA.eichungWortlisten.gelisteteFunde} also find their word in the lists${FA.freierFall && FA.freierFall.eichung ? `, and ${FA.freierFall.eichung.treffer} of ${FA.freierFall.eichung.n} in free fall` : ""}.` : "",
  "", "## Caveats", "",
  `- **Unequal masses:** the only list for these masses is Li, Jing & Liao (2018), one orbit per family; ${imQuadrat === ungleichListe.length ? "all" : `all but ${ungleichListe.length - imQuadrat}`} of its ${ungleichListe.length} orbits lie in the square 0 < a, b < 1. "Not in the list" says little there; the column \`family\` says more.`,
  "- **Satellites:** some orbits run k times almost along a listed orbit before closing (word and T* are k-fold). They are orbits of their own, but not unexplained ones; the column `sat` names the base orbit.",
  "- Only symmetric orbits are found by the half-period search, and only within the search windows and period limits of each run.",
  "- The comparison covers the lists above. Lists we do not know of are not covered.",
  "- The search code was written with the help of an AI assistant (Claude, Anthropic); every number here comes from a computation, and the test batteries compare the code against published 100-digit initial conditions and eigenvalues.",
  ""];
writeFileSync(join(ziel, "README.md"), R.join("\n"));
console.log(`fundbericht\\: ${zeilen.length} Massensätze, ${F.bahnen.length} Bahnen, ${stabile.length} in stable.txt`);
for (const z of zeilen) console.log(`  orbits-${z.datei}.txt: ${z.alle} Bahnen — S ${z.S}, B ${z.B}, U ${z.U}, offen ${z.offen}; Satelliten ${z.sat}`);
