// zahlen.mjs — jede Kennzahl der README, neu gerechnet aus den Tabellen in daten/ und nur aus ihnen.
//
//   node zahlen.mjs            die Zahlen (englisch)
//   node zahlen.mjs --json     dieselben als JSON
//
// Für Leser der Stabilitätskarte (21.11.2026): was sich aus den Tabellen nachzählen lässt, muss niemand
// glauben. Dabei wird auch geprüft, dass die Tabellen zueinander passen: die Urteile folgen der Regel, die
// stabilen Stücke folgen aus den Proben, die Kandidaten aus Stücken und Listenmassen, und die Zufalls-
// stichprobe des blinden Flecks wird aus den Fortsetzungen neu gezogen (mulberry32, Saat 20261113) und muss
// Stelle für Stelle gleich herauskommen. Exit 1, wenn etwas nicht passt.
// Ohne fremde Daten nicht nachzählbar: die Eichung an den Urteilen von Li, Jing & Liao (2018) und die
// Unterscheidung der Klassen a und b (sie hängt an deren Urteil an der Listenmasse). Beides steht in der
// README so, wie das Projekt es mit deren Zusatzdaten bestimmt hat.
// Ausgabe englisch, weil die Leser es sind. Node.js 18 oder neuer, keine Pakete.

import { readFileSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const D = join(dirname(fileURLToPath(import.meta.url)), "daten");
const fehler = [];
const pruefe = (bedingung, text) => { if (!bedingung && fehler.length < 200) fehler.push(text); };
const gleich = (x, y) => Math.abs(x - y) < 1e-9;
// Massen, an denen eine Liste existiert: die sieben von Li, Jing & Liao (2018) und m3 = 1 (gleiche Massen)
const LISTENMASSEN = [0.5, 0.75, 1, 2, 4, 5, 8, 10];
const SAAT = 20261113, N_STICH = 300;

function liesCsv(name) {
  const zeilen = readFileSync(join(D, name), "utf8").split(/\r?\n/).filter(z => z && !z.startsWith("#"));
  const kopf = zeilen.shift().split(",");
  return zeilen.map(z => {
    const w = z.split(",");
    pruefe(w.length === kopf.length, `${name}: ${w.length} instead of ${kopf.length} fields: ${z.slice(0, 60)}`);
    return Object.fromEntries(kopf.map((k, i) => [k, w[i] ?? ""]));
  });
}
const zahl = x => (x === "" || x == null ? null : +x);
const LISTE = liesCsv("list-entries.csv"), PROBEN = liesCsv("probes-30digit.csv"), STUECKE = liesCsv("stable-pieces.csv");
const KAND = liesCsv("candidates.csv"), STICH = liesCsv("blind-spot-sample.csv");
const FORTS = readdirSync(D).filter(n => /^continuations-double.*\.csv$/.test(n)).sort().flatMap(liesCsv);

// ── Listeneinträge ──
const eintrag = new Map(LISTE.map(e => [e.entry, e]));
pruefe(eintrag.size === LISTE.length, "list-entries.csv: an entry occurs twice");
const fortgesetzt = LISTE.filter(e => e.status === "continued");
// Reihenfolge wie die Dateien des Projekts (Name + ".json", sortiert) — die Stichprobe hängt daran
const reihe = [...fortgesetzt].sort((x, y) => (x.entry + ".json" < y.entry + ".json" ? -1 : 1));
const nicht = LISTE.filter(e => e.status === "not_continued").map(e => zahl(e.r_min_list_mass));
for (const e of LISTE.filter(e => e.status === "same_family")) pruefe(eintrag.get(e.same_as)?.status === "continued" && eintrag.get(e.same_as).family === e.family, `${e.entry}: same_as ${e.same_as} is not a continued entry of the same family`);
const liste = {
  eintraege: LISTE.length, fortgesetzt: fortgesetzt.length, dieselbeFamilie: LISTE.length - fortgesetzt.length - nicht.length, nichtFortgesetzt: nicht.length,
  familien: new Set(fortgesetzt.map(e => e.family)).size,
  nichtFortgesetztRMin: { unter1e5: nicht.filter(r => r < 1e-5).length, von1e5bis1e4: nicht.filter(r => r >= 1e-5 && r < 1e-4).length, ab1e4: nicht.filter(r => r >= 1e-4).length, ohne: nicht.filter(r => r == null).length },
};

// ── Fortsetzungen in double ──
const punkte = new Map(fortgesetzt.map(e => [e.entry, { down: [], up: [] }]));
for (const p of FORTS) {
  const P = punkte.get(p.entry);
  pruefe(P && (p.direction === "down" || p.direction === "up"), `continuation point of ${p.entry} (${p.direction}) without a continued list entry`);
  if (P && P[p.direction]) P[p.direction].push({ m3: +p.m3, stabil: p.stable_double === "true" ? true : p.stable_double === "false" ? false : null });
}
let schritte = 0, kurz = 0, laengeAlle = 0, laengeKurz = 0, ohnePunkte = 0;
for (const e of reihe) {
  const P = punkte.get(e.entry), m0 = +e.list_mass;
  pruefe(P.down.length + P.up.length === +e.points, `${e.entry}: ${P.down.length + P.up.length} continuation points, list-entries.csv says ${e.points}`);
  if (!P.down.length && !P.up.length) ohnePunkte++;
  for (const [r, vz] of [[P.down, -1], [P.up, 1]]) { let v = m0; for (const q of r) { pruefe((q.m3 - v) * vz > 0, `${e.entry}: continuation does not run away from the listed mass at ${q.m3}`); v = q.m3; } }
  pruefe(+e.continued_from === (P.down.length ? P.down[P.down.length - 1].m3 : m0) && +e.continued_to === (P.up.length ? P.up[P.up.length - 1].m3 : m0), `${e.entry}: continued_from/to do not match the continuation points`);
  const alle = [...P.down, { m3: m0 }, ...P.up].sort((x, y) => x.m3 - y.m3);
  for (let i = 0; i + 1 < alle.length; i++) { const l = alle[i + 1].m3 - alle[i].m3; schritte++; laengeAlle += l; if (l < 1e-3) { kurz++; laengeKurz += l; } }
}
const fortsetzung = { punkte: FORTS.length, schritte, kuerzerAls1e3: kurz, laenge: laengeAlle, laengeKurz, ohnePunkte };

// ── Proben auf 30 Stellen: Regel nachrechnen ──
const angenommen = PROBEN.filter(p => p.accepted === "yes");
const fehlgruende = {};
for (const p of PROBEN.filter(p => p.accepted !== "yes")) fehlgruende[p.reason] = (fehlgruende[p.reason] || 0) + 1;
let maxRest = 0, maxRestAndere = 0, maxGegen = 0; const unsicher = new Set();
for (const p of angenommen) {
  pruefe(eintrag.get(p.entry)?.status === "continued", `probe of ${p.entry} without a continued list entry`);
  const u = +p.uncertainty, rand = +p.margin, d = Math.abs(+p.check_difference);
  const regel = p.complex === "true" ? (+p.im_s > u ? "unstable" : "boundary") : rand > u ? "stable" : rand < -u ? "unstable" : "boundary";
  pruefe(regel === p.verdict, `${p.entry} at ${p.m3}: verdict ${p.verdict}, the rule gives ${regel}`);
  pruefe(Math.abs(u - Math.max(1e-15, 1000 * d)) <= 1e-30, `${p.entry} at ${p.m3}: uncertainty ${u} is not max(1e-15, 1000 x check difference)`);
  // s1, s2 stehen als double da: 2 − max|s| daraus ist bis auf einige Einheiten der letzten Stelle von s genau
  if (p.complex !== "true") { const sm = Math.max(Math.abs(+p.s1), Math.abs(+p.s2)); pruefe(Math.abs(rand - (2 - sm)) <= 1e-15 * (1 + sm), `${p.entry} at ${p.m3}: margin ${rand} is not 2 - max|s|`); }
  maxRest = Math.max(maxRest, +p.residual_newton); maxRestAndere = Math.max(maxRestAndere, +p.residual_check); maxGegen = Math.max(maxGegen, d); unsicher.add(u);
}
const anz = v => angenommen.filter(p => p.verdict === v).length;
const proben = { eintraege: PROBEN.length, angenommen: angenommen.length, stabil: anz("stable"), instabil: anz("unstable"), grenze: anz("boundary"),
  haaresbreite: angenommen.filter(p => p.verdict === "stable" && +p.margin < 1e-6).length, andereFehl: PROBEN.length - angenommen.length, fehlgruende,
  maxRestNewton: maxRest, maxRestAndere, maxGegenprobe: maxGegen, unsicherheiten: [...unsicher].sort((x, y) => x - y),
  grenzeKomplex: angenommen.filter(p => p.verdict === "boundary" && p.complex === "true").length,
  // größter Index: bestimmt, wie stark die Rundung der gedruckten Ziffern über eine Periode wächst (probe-pruefen.mjs)
  groesstesS: angenommen.reduce((x, p) => Math.max(x, Math.abs(+p.s1), Math.abs(+p.s2)), 0) };

// ── stabile Stücke: aufeinanderfolgende stabile Proben einer Fortsetzung ──
const probenVon = new Map();
for (const p of angenommen) { if (!probenVon.has(p.entry)) probenVon.set(p.entry, []); probenVon.get(p.entry).push(p); }
const nichtGelistet = new Map(fortgesetzt.map(e => [e.entry, e.not_listed_at.split(";").filter(Boolean).map(Number)]));
const istNeu = (e, p) => p.verdict === "stable" && !gleich(+p.m3, +e.list_mass)
  && (!LISTENMASSEN.some(m => gleich(m, +p.m3)) || nichtGelistet.get(e.entry).some(m => gleich(m, +p.m3)));
const stuecke = [], kandidatenNeu = new Set();
for (const e of reihe) {
  const G = (probenVon.get(e.entry) || []).slice().sort((x, y) => +x.m3 - +y.m3);
  for (let i = 0; i < G.length; i++) {
    if (G[i].verdict !== "stable" || (i > 0 && G[i - 1].verdict === "stable")) continue;
    let j = i; while (j + 1 < G.length && G[j + 1].verdict === "stable") j++;
    const S = G.slice(i, j + 1), neu = S.some(p => istNeu(e, p));
    if (neu) kandidatenNeu.add(e.entry);
    stuecke.push({ entry: e.entry, von: S[0].m3, bis: S[S.length - 1].m3, proben: S.length, laenge: +S[S.length - 1].m3 - +S[0].m3, neu });
    i = j;
  }
}
pruefe(stuecke.length === STUECKE.length, `stable pieces: ${stuecke.length} from the probes, ${STUECKE.length} in stable-pieces.csv`);
stuecke.forEach((s, i) => { const t = STUECKE[i] || {};
  pruefe(t.entry === s.entry && t.from_m3 === s.von && t.to_m3 === s.bis && +t.probes === s.proben && (t.candidate_piece === "yes") === s.neu, `stable-pieces.csv row ${i + 1} (${t.entry} ${t.from_m3}–${t.to_m3}) does not follow from the probes (${s.entry} ${s.von}–${s.bis})`); });
const stueckZahl = { n: stuecke.length, einzeln: stuecke.filter(s => s.proben === 1).length, laenge: stuecke.reduce((x, s) => x + s.laenge, 0), kandidatenStuecke: stuecke.filter(s => s.neu).length };

// ── Kandidaten und Familien ──
const kandE = new Set(KAND.map(k => k.entry));
pruefe(kandE.size === KAND.length, "candidates.csv: an entry occurs twice");
for (const d of kandidatenNeu) pruefe(kandE.has(d), `${d} is a candidate by the probes but missing in candidates.csv`);
for (const d of kandE) pruefe(kandidatenNeu.has(d), `${d} is in candidates.csv but no probe makes it a candidate`);
const famK = new Map();
for (const k of KAND) { pruefe(eintrag.get(k.entry)?.family === k.family, `${k.entry}: family differs between candidates.csv and list-entries.csv`); if (!famK.has(k.family)) famK.set(k.family, []); famK.get(k.family).push(k); }
for (const [f, L] of famK) pruefe(L.every(k => k.status === L[0].status && k.family_class === L[0].family_class), `family ${f}: status or family_class differs between its entries`);
const RANG = { c: 0, "?": 1, b: 2, "b?": 3, a: 4, g: 5, known: 6 };
for (const [f, L] of famK) pruefe(L.map(k => k.class).sort((x, y) => RANG[x] - RANG[y])[0] === L[0].family_class || L[0].status === "known", `family ${f}: family_class is not the best class of its entries`);
const famStatus = s => [...famK].filter(([, L]) => L[0].status === s).map(([f]) => f);
const neu = famStatus("new"), famMax = f => Math.max(...famK.get(f).map(k => +k.max_margin_new));
const proKlasse = Object.fromEntries(["c", "?", "b", "b?", "a", "g"].map(c => [c, neu.filter(f => famK.get(f)[0].family_class === c).length]));
const bhh = {}; for (const k of KAND) bhh[k.bhh] = (bhh[k.bhh] || 0) + 1;
// Kandidatenstücke verschiedener Familien mit gleichem Bahnwort (Kennung stabiler Proben im Stück, außer bei m3 = 1,
// wo das Wort an der Liste gleicher Massen hängt) — Kandidaten für eine Vereinigung über eine Umkehr in m3
const wortFam = new Map();
for (const s of stuecke.filter(s => s.neu)) for (const p of (probenVon.get(s.entry) || []).filter(p => p.verdict === "stable" && +p.m3 >= +s.von - 1e-12 && +p.m3 <= +s.bis + 1e-12 && !gleich(+p.m3, 1))) {
  if (!wortFam.has(p.word_hash)) wortFam.set(p.word_hash, new Set()); wortFam.get(p.word_hash).add(eintrag.get(s.entry).family); }
const wortPaare = new Set(); for (const fs of wortFam.values()) { const L2 = [...fs].sort(); for (let i = 0; i < L2.length; i++) for (let j = i + 1; j < L2.length; j++) wortPaare.add(`${L2[i]} / ${L2[j]}`); }
const kandidaten = { eintraege: KAND.length, familien: famK.size, gleichesWortPaare: [...wortPaare].sort(), eigen: famStatus("own").length, bekannt: famStatus("known").length, nichtPruefbar: famStatus("not checkable").length,
  nichtPruefbarFamilien: famStatus("not checkable"), neu: neu.length, proKlasse, nurHaaresbreite: neu.filter(f => famMax(f) < 1e-6).length,
  neuRandBis: { "1e-12": neu.filter(f => famMax(f) <= 1e-12).length, "1e-9": neu.filter(f => famMax(f) <= 1e-9).length, "1e-6": neu.filter(f => famMax(f) <= 1e-6).length },
  mitWortwechsel: KAND.filter(k => k.word_changed === "yes").length, bhh,
  bekannteStuecke: STUECKE.filter(s => s.known).length };

// ── blinder Fleck: Ziehungsrahmen neu, Stichprobe neu gezogen, Lage gegenüber der Karte ──
const mulberry32 = saat => { let a = saat | 0; return () => { a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; };
const strecken = [], kum = []; let L = 0;
for (const e of reihe) {
  const P = punkte.get(e.entry);
  for (const r of [P.down, P.up]) {
    let v = { m3: +e.list_mass, stabil: undefined };
    for (const q of r) { const l = Math.abs(q.m3 - v.m3); if (q.stabil !== true && v.stabil !== true && l > 0) { strecken.push({ entry: e.entry, von: v.m3, bis: q.m3 }); L += l; kum.push(L); } v = q; }
  }
}
const zufall = mulberry32(SAAT), gezogen = [];
for (let k = 0; k < N_STICH; k++) {
  const u = zufall() * L; let lo = 0, hi = kum.length - 1;
  while (lo < hi) { const mitte = (lo + hi) >> 1; if (kum[mitte] > u) hi = mitte; else lo = mitte + 1; }
  const s = strecken[lo], vorher = lo ? kum[lo - 1] : 0, t = (u - vorher) / (kum[lo] - vorher);
  gezogen.push({ entry: s.entry, m3: s.von + t * (s.bis - s.von), von: s.von, bis: s.bis });
}
pruefe(STICH.length === N_STICH, `blind-spot-sample.csv: ${STICH.length} rows instead of ${N_STICH}`);
gezogen.forEach((g, i) => { const z = STICH[i] || {}; pruefe(z.entry === g.entry && +z.m3 === g.m3 && +z.stretch_from === g.von && +z.stretch_to === g.bis, `blind-spot sample point ${i + 1}: redrawn ${g.entry} at ${g.m3}, the table has ${z.entry} at ${z.m3}`); });
const probeBei = (d, m3) => (probenVon.get(d) || []).find(p => gleich(+p.m3, m3)) || PROBEN.find(p => p.entry === d && gleich(+p.m3, m3));
const wilson = (k, n) => { const q = k / n, z = 1.96, m = (q + z * z / (2 * n)) / (1 + z * z / n), h = z * Math.sqrt(q * (1 - q) / n + z * z / (4 * n * n)) / (1 + z * z / n); return [Math.max(0, m - h), Math.min(1, m + h)]; };
const B = { n: STICH.length, laenge: L, strecken: strecken.length, gerechnet: 0, stabil: 0, imStueck: 0, engerRand: 0, randOffen: 0, fern: 0, blind: 0, instabil: 0, grenze: 0, fehl: 0 };
const LAGE = { imStueck: "in_piece", engerRand: "tight_edge", randOffen: "open_edge", fern: "far" };
for (const z of STICH) {
  for (const s of ["left", "right"]) if (z[s + "_m3"] !== "") { const q = probeBei(z.entry, +z[s + "_m3"]); pruefe(q && q.accepted === "yes" && q.verdict === z[s + "_verdict"], `blind-spot sample ${z.entry} at ${z.m3}: neighbour ${s} at ${z[s + "_m3"]} (${z[s + "_verdict"]}) not among the probes`); }
  const p = probeBei(z.entry, +z.m3);
  pruefe(p, `blind-spot sample ${z.entry} at ${z.m3}: no probe at this point`);
  if (!p) continue;
  pruefe((p.accepted === "yes" ? p.verdict : "no_result") === z.verdict, `blind-spot sample ${z.entry} at ${z.m3}: verdict ${z.verdict}, the probe says ${p.accepted === "yes" ? p.verdict : "no_result"}`);
  if (p.accepted !== "yes") { B.fehl++; continue; }
  B.gerechnet++;
  if (p.verdict === "stable") {
    B.stabil++;
    const sL = z.left_verdict === "stable", sR = z.right_verdict === "stable";
    const klammer = z.left_m3 !== "" && z.right_m3 !== "" ? Math.abs(+z.right_m3 - +z.left_m3) : Infinity;
    const lage = sL && sR ? "imStueck" : sL || sR ? (klammer <= 0.005 + 1e-12 ? "engerRand" : "randOffen") : "fern";
    B[lage]++; if (lage === "randOffen" || lage === "fern") B.blind++;
    pruefe(z.position === LAGE[lage], `blind-spot sample ${z.entry} at ${z.m3}: position ${z.position}, computed ${LAGE[lage]}`);
  } else { pruefe(z.position === "", `blind-spot sample ${z.entry} at ${z.m3}: position given for a point that is not stable`); if (p.verdict === "unstable") B.instabil++; else B.grenze++; }
}
B.anteilStabil = B.stabil / B.gerechnet; B.bereichStabil = wilson(B.stabil, B.gerechnet);
B.anteilBlind = B.blind / B.gerechnet; B.bereichBlind = wilson(B.blind, B.gerechnet);
// fehlende stabile Länge und der Anteil, den die Karte zeigt
B.fehlendeLaenge = [B.bereichBlind[0] * L, B.anteilBlind * L, B.bereichBlind[1] * L];
const karteL = stueckZahl.laenge;
B.kartenanteil = [karteL / (karteL + B.fehlendeLaenge[2]), karteL / (karteL + B.fehlendeLaenge[1]), karteL / (karteL + B.fehlendeLaenge[0])];

// ── double gegen 30 Stellen: Familien, die double nirgends stabil nennt, an der Listenmasse ──
const GRUPPEN = [["r_min >= 1e-3", 1e-3, Infinity], ["3e-4 <= r_min < 1e-3", 3e-4, 1e-3], ["1e-4 <= r_min < 3e-4", 1e-4, 3e-4], ["r_min < 1e-4", 0, 1e-4]];
const doubleGegen30 = GRUPPEN.map(([name, lo, hi]) => {
  let stabil = 0, alle = 0;
  for (const e of fortgesetzt) {
    const P = punkte.get(e.entry), q = (probenVon.get(e.entry) || []).find(p => gleich(+p.m3, +e.list_mass));
    if (!q || !(P.down.length + P.up.length) || [...P.down, ...P.up].some(x => x.stabil === true)) continue;
    const r = +q.r_min; if (!Number.isFinite(r) || r < lo || r >= hi) continue;
    alle++; if (q.verdict === "stable") stabil++;
  }
  return { gruppe: name, stabil, alle };
});
pruefe(fortgesetzt.every(e => (probenVon.get(e.entry) || []).some(p => gleich(+p.m3, +e.list_mass))), "a continued entry has no accepted probe at its listed mass");

// ── Ränder der Kandidatenstücke: geschlossen nur durch eine instabile Probe; Breite der Klammer ──
const kStuecke = STUECKE.filter(s => s.candidate_piece === "yes");
// Offene Ränder nach Grund: an der Bereichsgrenze 0,5 oder 10; am Ende der Fortsetzung (keine Probe dahinter,
// die Fortsetzung endet dort); dahinter nicht geprobt (die Fortsetzung reicht weiter); dahinter nur Proben „an der Grenze“
const raender = { stuecke: kStuecke.length, raender: 2 * kStuecke.length, geschlossen: 0, bis0005: 0, breitesteKlammer: 0, offen: 0, nachbarn: 0, grenzNachbarn: 0,
  offenWarum: { bereichsgrenze: 0, endeFortsetzung: 0, nichtGeprobt: 0, nurSchwelle: 0 }, nichtGeprobtBei: [] };
for (const s of kStuecke) for (const [stabil, instabil, nb, nv, vz] of [[+s.from_m3, s.unstable_below, s.below_m3, s.below_verdict, -1], [+s.to_m3, s.unstable_above, s.above_m3, s.above_verdict, 1]]) {
  if (nb !== "") { raender.nachbarn++; if (nv === "boundary") raender.grenzNachbarn++; }
  if (instabil === "") {
    raender.offen++;
    const e = eintrag.get(s.entry), ende = vz < 0 ? +e.continued_from : +e.continued_to;
    const dahinter = (probenVon.get(s.entry) || []).filter(p => (+p.m3 - stabil) * vz > 1e-12);
    const warum = gleich(stabil, vz < 0 ? 0.5 : 10) ? "bereichsgrenze" : dahinter.length ? "nurSchwelle" : gleich(stabil, ende) ? "endeFortsetzung" : "nichtGeprobt";
    raender.offenWarum[warum]++;
    if (warum === "nichtGeprobt") raender.nichtGeprobtBei.push({ entry: s.entry, seite: vz, m3: vz < 0 ? s.from_m3 : s.to_m3, ende: vz < 0 ? e.continued_from : e.continued_to });
    continue;
  }
  const b = Math.abs(+instabil - stabil); raender.geschlossen++; raender.breitesteKlammer = Math.max(raender.breitesteKlammer, b); if (b <= 0.005 + 1e-12) raender.bis0005++;
}

const ergebnis = { liste, fortsetzung, proben, stuecke: stueckZahl, kandidaten, blinderFleck: B, doubleGegen30, raender, fehler };
if (process.argv.includes("--json")) { console.log(JSON.stringify(ergebnis, null, 1)); process.exit(fehler.length ? 1 : 0); }

const pc = x => (100 * x).toFixed(1) + " %", ex = x => x.toExponential(1);
console.log(`List entries: ${liste.eintraege}; continued ${liste.fortgesetzt} (in ${liste.familien} families), on the continuation of another entry ${liste.dieselbeFamilie}, not continued ${liste.nichtFortgesetzt} (closest approach < 1e-5: ${liste.nichtFortgesetztRMin.unter1e5}, 1e-5 to 1e-4: ${liste.nichtFortgesetztRMin.von1e5bis1e4}, above: ${liste.nichtFortgesetztRMin.ab1e4})`);
console.log(`Continuation in double precision: ${fortsetzung.punkte} points, ${fortsetzung.schritte} steps over a total length ${fortsetzung.laenge.toFixed(2)} in m3; ${fortsetzung.kuerzerAls1e3} steps (${pc(fortsetzung.kuerzerAls1e3 / fortsetzung.schritte)}) are shorter than 1e-3 and cover ${pc(fortsetzung.laengeKurz / fortsetzung.laenge)} of the length; ${fortsetzung.ohnePunkte} continued entries have no point besides the listed mass`);
console.log(`30-digit probes: ${proben.eintraege}, accepted ${proben.angenommen}: stable ${proben.stabil} (margin < 1e-6: ${proben.haaresbreite}), unstable ${proben.instabil}, boundary ${proben.grenze} (complex: ${proben.grenzeKomplex}); not accepted ${proben.andereFehl} (${Object.entries(fehlgruende).map(([g, n]) => `${n}: ${g}`).join("; ")})`);
console.log(`  largest Newton residual ${ex(proben.maxRestNewton)} (other precision ${ex(proben.maxRestAndere)}), largest check difference ${ex(proben.maxGegenprobe)}, uncertainty ${proben.unsicherheiten.join(" / ")}; every verdict follows the rule`);
console.log(`Stable pieces: ${stueckZahl.n} (${stueckZahl.einzeln} of a single probe), total length ${stueckZahl.laenge.toFixed(1)} in m3; ${stueckZahl.kandidatenStuecke} contain a stable probe at an unlisted mass`);
console.log(`Candidates: ${kandidaten.eintraege} list entries = ${kandidaten.familien} families; published before ${kandidaten.eigen}, known ${kandidaten.bekannt}, not checkable against the literature ${kandidaten.nichtPruefbar} (${kandidaten.nichtPruefbarFamilien.join(" ")}); NEW ${kandidaten.neu}: ${Object.entries(proKlasse).filter(([, n]) => n).map(([c, n]) => `${c} ${n}`).join(", ")}`);
console.log(`  new families resting only on margins <= 1e-12: ${kandidaten.neuRandBis["1e-12"]}, <= 1e-9: ${kandidaten.neuRandBis["1e-9"]}, < 1e-6: ${kandidaten.nurHaaresbreite}; word changed along the way: ${kandidaten.mitWortwechsel}; BHH start configuration: ${Object.entries(bhh).map(([k, n]) => `${k} ${n}`).join(", ")}`);
console.log(`Blind spot: sampling frame ${B.strecken} stretches, length ${B.laenge.toFixed(2)}; all ${B.n} points redrawn identically; computed ${B.gerechnet}, stable ${B.stabil} (${pc(B.anteilStabil)}, 95 %: ${pc(B.bereichStabil[0])} to ${pc(B.bereichStabil[1])}): in a piece ${B.imStueck}, at a tight edge ${B.engerRand}, at an open edge ${B.randOffen}, far ${B.fern}`);
console.log(`  blind spot ${B.blind} of ${B.gerechnet} = ${pc(B.anteilBlind)} (95 %: ${pc(B.bereichBlind[0])} to ${pc(B.bereichBlind[1])}) = ${B.fehlendeLaenge[1].toFixed(1)} in m3 (${B.fehlendeLaenge[0].toFixed(1)} to ${B.fehlendeLaenge[2].toFixed(1)}) of stable length missing from the map; the map shows about ${pc(B.kartenanteil[1])} (${pc(B.kartenanteil[0])} to ${pc(B.kartenanteil[2])}) of the stable length`);
console.log(`Double precision says "nowhere stable", 30 digits say "stable at the listed mass": ${doubleGegen30.map(g => `${g.gruppe}: ${g.stabil} of ${g.alle}`).join("; ")}`);
console.log(`Edges of the ${raender.stuecke} candidate pieces: ${raender.geschlossen} of ${raender.raender} closed by an unstable probe (${raender.bis0005} within 0.005, widest ${raender.breitesteKlammer.toFixed(4)}), ${raender.offen} open; ${raender.grenzNachbarn} of ${raender.nachbarn} outer neighbours are boundary probes`);
console.log(fehler.length ? `\n${fehler.length} INCONSISTENCIES:\n  ${fehler.slice(0, 40).join("\n  ")}` : "\nAll tables consistent.");
process.exit(fehler.length ? 1 : 0);
