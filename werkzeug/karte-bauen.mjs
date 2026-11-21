// dreikoerper/werkzeug/karte-bauen.mjs — das öffentliche Repository der Stabilitätskarte (21.11.2026;
// Felix: nur GitHub und Zenodo, Name „dreikoerper-stability-map“, Prüfbericht als kurze REVIEW.md, eine
// einzige Abbildung: die Karte der Familien über die Masse).
//
//   node werkzeug/karte-bauen.mjs [--entwurf] [--doi 10.5281/zenodo.…] [<ziel>]
//                                  Vorgabe: ..\dreikoerper-stability-map
//
// Keine Zahl im Text ist von Hand geschrieben. Ablauf:
//  1. Nur aus versionierten Ständen (git status sauber, ausgenommen mit --entwurf); pruefung.json ohne
//     harten Verstoß.
//  2. Tabellen nach daten/. Ohne fremde Daten: keine Anfangswerte, keine Urteile, keine Wörter aus der
//     Liste von Li, Jing & Liao — nur ihre Bezeichner (Name und Masse) und unsere eigenen Rechnungen.
//  3. karte/zahlen.mjs (öffentlich, liegt danach im Ziel) rechnet jede Kennzahl aus den Tabellen neu.
//     Jede muss mit pruefung.json und mit der Übersicht der Listenfortsetzung übereinstimmen, sonst Abbruch.
//  4. Bild, README.md, REVIEW.md, CITATION.cff, .zenodo.json, LICENSE (folgende Abschnitte).
//  5. Abnahme im Ziel: keine Zahl der Liste (a, b, T auf ihren zehn Stellen) und keine interne Spur;
//     danach muss werkzeug/oeffentlich-pruefen.mjs grün sein.

import { readFileSync, writeFileSync, mkdirSync, copyFileSync, existsSync, lstatSync, unlinkSync, readdirSync, statSync } from "node:fs";
import { join, resolve } from "node:path";
import { execFileSync, spawnSync } from "node:child_process";
import { tmpdir } from "node:os";
import { HIER, ladeKatalog, ladeKern } from "../quellen.mjs";
import { baueBilder } from "./karte-bild.mjs";
import { readme, review, zitat } from "./karte-texte.mjs";

const argv = process.argv.slice(2);
const wert = n => (argv.includes(n) ? argv[argv.indexOf(n) + 1] : null);
const ENTWURF = argv.includes("--entwurf"), DOI = wert("--doi");
const frei = argv.filter((x, i) => !x.startsWith("--") && !(i > 0 && argv[i - 1] === "--doi"));
const ZIEL = resolve(frei[0] || join(HIER, "..", "dreikoerper-stability-map"));
const stopp = text => { console.error(text); process.exit(2); };
if (ZIEL === resolve(HIER) || ZIEL.startsWith(resolve(HIER) + "\\")) stopp("Das Ziel darf nicht im privaten Repo liegen.");
const offen = execFileSync("git", ["-C", HIER, "status", "--porcelain"], { encoding: "utf8" }).split("\n").filter(z => z.trim());
if (offen.length && !ENTWURF) stopp("Erst committen (auch neue Dateien):\n" + offen.join("\n"));
if (offen.length) console.log(`ENTWURF: ${offen.length} nicht committete Änderungen — so nicht veröffentlichen`);

const E = join(HIER, "ergebnisse"), O = join(E, "listenfortsetzung");
const lies = p => JSON.parse(readFileSync(p, "utf8"));
const PR = lies(join(E, "pruefung.json"));
if (PR.hart.length) stopp(`pruefung.json hat ${PR.hart.length} harte Verstöße — erst node werkzeug/pruefe-alles.mjs --schluss grün`);
const UE = lies(join(E, "listenfortsetzung.json")), AW = lies(join(E, "listenfortsetzung-auswertung.json"));
const BFS = lies(join(E, "blinder-fleck-stichprobe.json")), BEKANNT = lies(join(E, "bekannte-funde.json")).funde;
const K = ladeKern();
const KAT = ladeKatalog().bahnen.filter(b => b.satz === "ungleich");
const gleich = (x, y) => Math.abs(x - y) < 1e-9;
const LISTENMASSEN = [0.5, 0.75, 1, 2, 4, 5, 8, 10];
const datei = (name, m3) => `${String(name).replace(/[^A-Za-z0-9.-]/g, "")}-${m3}`;
const URTEIL = { stabil: "stable", instabil: "unstable", "an der Grenze": "boundary" };
const s = x => (x == null || x === "" || (typeof x === "number" && !Number.isFinite(x)) ? "" : String(x));
const ohneKomma = x => String(x).replace(/[,;]/g, " ");

/* ── 1. Rohdaten, wie pruefe-alles sie liest ── */
const fam = new Map();
for (const n of readdirSync(O).filter(n => n.endsWith(".json"))) {
  const d = n.endsWith("-genau.json") ? n.slice(0, -11) : n.slice(0, -5), e = fam.get(d) || {};
  if (n.endsWith("-genau.json")) e.G = lies(join(O, n)).punkte; else e.R = lies(join(O, n));
  fam.set(d, e);
}
for (const [d, e] of fam) if (!e.R || !e.R.richtungen || !e.G) stopp(`${d}: Familiendatei, Fortsetzung oder Proben fehlen`);
// Familien: dieselbe Vereinigung wie pruefe-alles.mjs (Treffer „ort“ oder „lage“), in derselben Reihenfolge
const eltern = new Map([...fam.keys()].map(d => [d, d]));
const finde = x => { while (eltern.get(x) !== x) x = eltern.get(x); return x; };
for (const [d, e] of fam) for (const l of e.R.listen || []) if (l.liliao && (l.liliao.stufe === "ort" || l.liliao.stufe === "lage") && l.liliao.naechster) {
  const y = datei(l.liliao.naechster, l.m3); if (eltern.has(y)) eltern.set(finde(d), finde(y));
}
const hristovTreffer = l => !!(l && l.hristov && (l.hristov.mitTs || (l.hristov.naechsterOrt && l.hristov.naechsterOrt.abstand < 1e-6)));
const reihe = [...fam.keys()].sort((x, y) => (x + ".json" < y + ".json" ? -1 : 1));
const KAND = new Map(PR.kandidaten.map(k => [k.datei, k]));

/* ── 2. Tabellen ── */
mkdirSync(ZIEL, { recursive: true });
if (existsSync(join(ZIEL, ".git"))) {
  for (const p of execFileSync("git", ["-C", ZIEL, "ls-files", "-z", "--cached", "--others", "--exclude-standard"], { encoding: "utf8" }).split("\0").filter(Boolean)) {
    const q = join(ZIEL, p); if (existsSync(q) && lstatSync(q).isFile()) unlinkSync(q);
  }
} else if (readdirSync(ZIEL).length) {
  // ein früherer Entwurf ohne Repo: nur löschen, was dieses Skript ablegt
  const meine = new Set(["README.md", "REVIEW.md", "LICENSE", "CITATION.cff", ".zenodo.json", ".gitignore", "zahlen.mjs", "probe-pruefen.mjs", "kern.js", "genau.mjs", "quellen.mjs"]);
  for (const n of readdirSync(ZIEL)) { const q = join(ZIEL, n);
    if (statSync(q).isDirectory() && (n === "daten" || n === "bilder")) { for (const m of readdirSync(q)) unlinkSync(join(q, m)); }
    else if (meine.has(n)) unlinkSync(q); else stopp(`${ZIEL} enthält ${n}, das nicht von diesem Skript stammt`); }
}
for (const d of ["daten", "bilder"]) mkdirSync(join(ZIEL, d), { recursive: true });
const schreibeCsv = (name, kopf, spalten, zeilen) => {
  const t = [...kopf.map(z => "# " + z), spalten.join(","), ...zeilen.map(z => { if (z.length !== spalten.length) stopp(`${name}: Zeile mit ${z.length} statt ${spalten.length} Feldern`); const w = z.map(s); if (w.some(x => /[,\n]/.test(x))) stopp(`${name}: Komma im Feld: ${w.join("|").slice(0, 80)}`); return w.join(","); })].join("\n") + "\n";
  writeFileSync(join(ZIEL, "daten", name), t); return t.length;
};
const KOPF_GEMEINSAM = [
  "Planar three-body problem, G = 1, zero angular momentum, m1 = m2 = 1, m3 free. Initial state (convention of Li, Jing & Liao 2018):",
  "r1 = (-1, 0), r2 = (1, 0), r3 = (0, 0); v1 = v2 = (a, b), v3 = -(2/m3) (a, b); period T. Entry names: I.A-5-2 is their orbit I.A^{i.c.}_5 at m3 = 2."];
const abbruch = g => g === "Grenze des Bereichs erreicht" ? "end of range" : g === "Newton nimmt nicht an" ? "Newton failed at the smallest step"
  : /^kürzere Grundperiode \(Teiler (\d+)\)$/.test(g) ? `shorter fundamental period (divisor ${g.match(/\d+/)[0]})` : /^Korrektur zu groß \((.*)\)$/.test(g) ? `Newton correction too large (${g.match(/\((.*)\)/)[1]})` : stopp(`unbekannter Abbruchgrund „${g}“`);
const fehlgrund = g => g === "Newton (double) nimmt nicht an" ? "Newton in double precision did not converge from the continuation" : stopp(`unbekannter Fehlgrund „${g}“`);

// stabile Stücke je Fortsetzung (aus allen angenommenen Proben; Güte ist überall bestanden, pruefung.json)
const stueckeVon = new Map();
for (const d of reihe) {
  const G = fam.get(d).G.filter(g => g.ok).sort((x, y) => x.m3 - y.m3), L = [];
  for (let i = 0; i < G.length; i++) {
    if (G[i].urteil !== "stabil" || (i > 0 && G[i - 1].urteil === "stabil")) continue;
    let j = i; while (j + 1 < G.length && G[j + 1].urteil === "stabil") j++;
    const gL = G.slice(0, i).filter(g => g.urteil === "instabil").pop(), gH = G.slice(j + 1).find(g => g.urteil === "instabil");
    L.push({ von: G[i].m3, bis: G[j].m3, S: G.slice(i, j + 1), unten: G[i - 1] || null, oben: G[j + 1] || null, iL: gL ? gL.m3 : null, iH: gH ? gH.m3 : null });
    i = j;
  }
  stueckeVon.set(d, L);
}

// Listeneinträge (1349): Stand aus der Übersicht von liste-fortsetzen.mjs
const zeilenListe = [], ohneFortsetzung = { gleich: 0, nicht: 0 };
const KATd = new Map(KAT.map(b => [datei(b.name, b.m[2]), b]));
// Nähe unserer 30-Stellen-Werte an der Listenmasse zu den gedruckten Listenwerten (21.11.2026: die README behauptete
// „gerundet gleich“, ungemessen; I.B-33@2 weicht in a um 8e-11 ab — mehr als eine halbe Einheit der zehnten Stelle)
const naehe = { n: 0, maxA: 0, maxB: 0, maxRelT: 0, rundungAnders: 0 };
for (const b of [...KAT].sort((x, y) => (datei(x.name, x.m[2]) + ".json" < datei(y.name, y.m[2]) + ".json" ? -1 : 1))) {
  const d = datei(b.name, b.m[2]), u = UE.je[`${b.name}@${b.m[2]}`];
  if (!u) stopp(`${d} fehlt in ergebnisse/listenfortsetzung.json`);
  if (fam.has(d)) {
    const R = fam.get(d).R, G = fam.get(d).G.filter(g => g.ok), L0 = G.find(g => gleich(g.m3, R.start.m3));
    const gelistet = [`${R.start.m3}:${d}`], nichtGelistet = [];
    for (const l of R.listen || []) {
      const ort = l.liliao && (l.liliao.stufe === "ort" || l.liliao.stufe === "lage");
      if (gleich(l.m3, 1)) { if (ort || hristovTreffer(l)) gelistet.push(`1:${ort ? ohneKomma(l.liliao.naechster) + " (equal masses)" : "Sofia database"}`); }
      else if (ort) gelistet.push(`${l.m3}:${datei(l.liliao.naechster, l.m3)}`);
    }
    for (const m of LISTENMASSEN) { const l = (R.listen || []).find(l => gleich(l.m3, m)); if (l && l.liliao && l.liliao.stufe === "keine" && !(gleich(m, 1) && hristovTreffer(l))) nichtGelistet.push(m); }
    const P = [...R.richtungen.abwaerts.punkte, ...R.richtungen.aufwaerts.punkte];
    if (!L0) stopp(`${d}: keine angenommene Probe an der Listenmasse`);
    { const da = Math.abs(+L0.a - b.a), db = Math.abs(+L0.b - b.b), dT = Math.abs(+L0.T - b.T) / b.T;
      naehe.n++; naehe.maxA = Math.max(naehe.maxA, da); naehe.maxB = Math.max(naehe.maxB, db); naehe.maxRelT = Math.max(naehe.maxRelT, dT);
      if (da > 5e-11 || db > 5e-11) naehe.rundungAnders++; }
    zeilenListe.push([d, b.m[2], "continued", "", finde(d), R.richtungen.abwaerts.bis, R.richtungen.aufwaerts.bis, abbruch(R.richtungen.abwaerts.grund), abbruch(R.richtungen.aufwaerts.grund),
      P.length, gelistet.join(";"), nichtGelistet.join(";"), G.length, URTEIL[L0.urteil], L0.rand, L0.rMin, stueckeVon.get(d).length, KAND.has(d) ? "yes" : "no"]);
  } else if (/^dieselbe Familie wie /.test(u.status)) {
    const [n2, m2] = u.status.slice("dieselbe Familie wie ".length).split("@"), d2 = datei(n2, +m2);
    if (!fam.has(d2)) stopp(`${d}: „${u.status}“, aber ${d2} hat keine Fortsetzung`);
    ohneFortsetzung.gleich++;
    zeilenListe.push([d, b.m[2], "same_family", d2, finde(d2), "", "", "", "", "", "", "", "", "", "", "", "", ""]);
  } else if (/^ohne Ergebnis/.test(u.status)) {
    // engste Begegnung über eine Periode, aus den Listenwerten in double (dieselbe Funktion wie halbperiode.mjs)
    const u0 = new Float64Array(12); K.EBENEN.euler.anfang(b.a, b.b, b.m, u0);
    const r = K.durchgaenge(u0, b.m, b.T, 1e-11).rMin;
    ohneFortsetzung.nicht++;
    zeilenListe.push([d, b.m[2], "not_continued", "", "", "", "", "", "", "", "", "", "", "", "", r.toPrecision(3), "", ""]);
  } else stopp(`${d}: unbekannter Stand „${u.status}“`);
}
let groesse = {};
groesse.liste = schreibeCsv("list-entries.csv", [
  "The 1349 orbits listed by Li, Jing & Liao (2018, PASJ 70, 64) and what this map did with each. No values of their list are reproduced here.",
  ...KOPF_GEMEINSAM,
  "status: continued (own continuation in m3) / same_family (lies on the continuation of same_as) / not_continued (Newton in double precision did not accept the listed values).",
  "family: continuations that meet (same initial values, or same T* = T |E|^1.5 to 8 digits at a listed mass) form one family, named after one member.",
  "continued_from, continued_to: range of the double-precision continuation within 0.5 <= m3 <= 10; stop_below, stop_above: why it ended; points: continuation points.",
  "listed_at: masses on this continuation where a list has this orbit (m3:entry); not_listed_at: listed masses reached where the lists were checked and do not have it.",
  "probes: accepted 30-digit probes on this continuation. verdict/margin/r_min at the listed mass: our 30-digit probe there (margin = 2 - max|s|, r_min = closest approach).",
  "For not_continued entries r_min_list_mass is the closest approach over one period of the listed values, integrated in double precision.",
  "stable_pieces: runs of consecutive stable probes on this continuation (stable-pieces.csv); candidate: see candidates.csv."],
  ["entry", "list_mass", "status", "same_as", "family", "continued_from", "continued_to", "stop_below", "stop_above", "points", "listed_at", "not_listed_at", "probes", "verdict_at_list_mass", "margin_at_list_mass", "r_min_list_mass", "stable_pieces", "candidate"],
  zeilenListe);

// Proben auf 30 Stellen (alle 3179)
const zeilenProben = [];
for (const d of reihe) for (const g of fam.get(d).G.slice().sort((x, y) => x.m3 - y.m3)) {
  if (!g.ok) { zeilenProben.push([d, g.m3, "no", fehlgrund(g.grund), "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""]); continue; }
  zeilenProben.push([d, g.m3, "yes", "", g.a, g.b, g.T, g.Ts, g.s1, g.s2, g.komplex ? "true" : "false", g.komplex ? g.sIm : "", g.rand, g.unsicher, g.unterschied, URTEIL[g.urteil] || stopp(`Urteil ${g.urteil}`), g.rMin, g.kennung, g.rest, g.restAndereGenauigkeit]);
}
groesse.proben = schreibeCsv("probes-30digit.csv", [
  "Every 30-digit probe of the stability map. entry: the continuation (list entry) the probe lies on; see list-entries.csv.",
  ...KOPF_GEMEINSAM,
  "a, b, T: Newton on the full period in 320-bit fixed point (Taylor order 40), started from the double-precision continuation; printed with 32 decimals.",
  "residual_newton: return distance after one period of Newton's internal 320-bit values; residual_check: the same at another precision. The printed 32-decimal",
  "values return up to about 1e6 times worse (rounding); the stability below is computed from exactly the printed values.",
  "s1, s2: the two nontrivial stability indices lambda + 1/lambda from the monodromy matrix (complex pair: s1 = s2 = real part, im_s = imaginary part).",
  "margin = 2 - max|s|. check_difference: difference to a second computation with 128 more bits and higher Taylor order; uncertainty = max(1e-15, 1000 x check_difference).",
  "verdict: stable (real indices, margin > uncertainty) / unstable (margin < -uncertainty, or complex with im_s > uncertainty) / boundary (otherwise). Linear stability only.",
  "T_star = T |E|^1.5. r_min: closest approach of two bodies over one period (double precision). word_hash: hash of the free-group word (kern.js, kennung); equal hash, equal word."],
  ["entry", "m3", "accepted", "reason", "a", "b", "T", "T_star", "s1", "s2", "complex", "im_s", "margin", "uncertainty", "check_difference", "verdict", "r_min", "word_hash", "residual_newton", "residual_check"],
  zeilenProben);

// Fortsetzungen in double, nach Hauptklasse geteilt (jede Datei unter 10 MB)
const g15 = x => (Number.isFinite(x) ? String(+x.toPrecision(15)) : ""), g8 = x => (Number.isFinite(x) ? String(+x.toPrecision(8)) : ""), g3 = x => (Number.isFinite(x) ? String(+x.toPrecision(3)) : "");
const forts = { I: [], II: [] };
for (const d of reihe) {
  const R = fam.get(d).R;
  for (const [r, name] of [["abwaerts", "down"], ["aufwaerts", "up"]]) for (const q of R.richtungen[r].punkte)
    forts[d.startsWith("II.") ? "II" : "I"].push([d, name, q.m3, g15(q.a), g15(q.b), g15(q.T), g15(q.Ts), g15(q.s1), g15(q.s2), q.komplex ? "true" : "false", q.stabil === true ? "true" : q.stabil === false ? "false" : "", g8(q.rand), g8(q.rMin), q.kennung, q.wortLaenge, g3(q.rest), g3(q.symplektik)]);
}
for (const k of ["I", "II"]) groesse["forts" + k] = schreibeCsv(`continuations-double-${k}.csv`, [
  `Continuation in m3 of every list orbit of class ${k} (${k === "I" ? "I.A, I.B" : "II.A, II.B, II.C"}), double precision: Newton on the full period with kern.js, adaptive steps (smallest 1e-4, in a second pass 1e-8).`,
  ...KOPF_GEMEINSAM,
  "Each continuation starts at the listed values at the listed mass (not reproduced here; list_mass in list-entries.csv) and runs down and up. Rows in order away from the start.",
  "stable_double: true / false / empty (undecided). margin = 2 - max|s| in double precision — NOT reliable where bodies come close; the map's verdicts come from probes-30digit.csv only.",
  "word_length: length of the free-group word; residual: Newton residual; symplectic_error: deviation of the double-precision monodromy matrix from symplecticity."],
  ["entry", "direction", "m3", "a", "b", "T", "T_star", "s1", "s2", "complex", "stable_double", "margin", "r_min", "word_hash", "word_length", "residual", "symplectic_error"],
  forts[k]);

// stabile Stücke; Klasse und gelistete Massen aus pruefung.json, für Kandidatenstücke
const bekanntKurz = wo => /Li, Li & Liao \(2021\)/.test(wo) ? "Li & Li & Liao 2021" : stopp(`bekanntes Stück ohne Kurzform: ${wo}`);
const zeilenStuecke = [];
for (const d of reihe) for (const st of stueckeVon.get(d)) {
  const k = KAND.get(d), ks = k ? k.stuecke.find(x => gleich(x.von, st.von) && gleich(x.bis, st.bis)) : null;
  if (ks && ks.proben !== st.S.length) stopp(`${d} ${st.von}–${st.bis}: ${st.S.length} Proben, pruefung.json ${ks.proben}`);
  zeilenStuecke.push([d, finde(d), st.von, st.bis, st.bis - st.von, st.S.length, st.unten ? st.unten.m3 : "", st.unten ? URTEIL[st.unten.urteil] : "", st.oben ? st.oben.m3 : "", st.oben ? URTEIL[st.oben.urteil] : "",
    st.iL, st.iH, Math.min(...st.S.map(g => g.rand)), ks ? "yes" : "no", ks ? ks.klasse : "", ks ? ks.gelistetIn.map(x => x.replace(/\s*\(.*\)$/, "")).join(";") : "", ks && ks.bekannt ? bekanntKurz(ks.bekannt) : ""]);
}
const kandStuecke = PR.kandidaten.reduce((n, k) => n + k.stuecke.length, 0);
if (zeilenStuecke.filter(z => z[13] === "yes").length !== kandStuecke) stopp(`Kandidatenstücke: ${zeilenStuecke.filter(z => z[13] === "yes").length} gefunden, pruefung.json ${kandStuecke}`);
groesse.stuecke = schreibeCsv("stable-pieces.csv", [
  "Stable pieces of the map: maximal runs of consecutive stable 30-digit probes on one continuation (probes sorted by m3). Families with two continuations count each.",
  "from_m3, to_m3: first and last stable probe; length = to_m3 - from_m3 (0 for a piece of a single probe). The true window reaches beyond, up to the next probes outside.",
  "below/above: the nearest probe outside the piece and its verdict. unstable_below/above: nearest UNSTABLE probe outside; only such a probe closes a window edge",
  "(a boundary neighbour sits at the 1e-15 threshold, not at a change of stability; an empty field means the edge is open).",
  "candidate_piece: yes if the piece contains a stable probe at a mass where no list has this orbit. For those: class (see README) and listed_inside, the list entries",
  "(entry@m3) whose listed mass lies in the piece or between it and the closing unstable probe; known: the piece is published elsewhere (then not counted as new)."],
  ["entry", "family", "from_m3", "to_m3", "length", "probes", "below_m3", "below_verdict", "above_m3", "above_verdict", "unstable_below", "unstable_above", "min_margin", "candidate_piece", "class", "listed_inside", "known"],
  zeilenStuecke);

// Kandidaten (184 Einträge = 182 Familien) mit Stand je Familie, wie pruefe-alles ihn bestimmt
const RANG = { c: 0, "?": 1, b: 2, "b?": 3, a: 4, g: 5, bekannt: 6 };
const famListe = new Map(); for (const k of PR.kandidaten) famListe.set(k.familie, (famListe.get(k.familie) || []).concat(k));
for (const k of PR.kandidaten) if (k.familie !== finde(k.datei)) stopp(`${k.datei}: Familie ${k.familie} in pruefung.json, hier ${finde(k.datei)}`);
const famKlasse = f => famListe.get(f).map(k => k.klasse).sort((x, y) => RANG[x] - RANG[y])[0];
const famStand = f => { const L = famListe.get(f);
  if (L.some(k => k.eigen)) return "own"; if (L.every(k => k.bekannt)) return "known";
  if (BEKANNT.filter(x => x.art === "offen").some(x => finde(x.datei) === f)) return "not checkable"; return "new"; };
const bhhWort = u => u === "nie in BHH-Startlage" ? "never" : u === "BHH-Startlage möglich" ? "possible" : /^unklar/.test(u) ? "unclear" : stopp(`BHH-Urteil ${u}`);
const zeilenKand = [];
for (const d of reihe.filter(d => KAND.has(d))) {
  const k = KAND.get(d); if (!k.bhh) stopp(`${d}: keine BHH-Lage`);
  const anteile = k.bhh.proben.flatMap(p => [p.r1 && p.r1.minAnteil, p.r2 && p.r2.minAnteil]).filter(x => x != null);
  zeilenKand.push([d, k.familie, k.listenmasse, k.klasse === "bekannt" ? "known" : k.klasse, famKlasse(k.familie), famStand(k.familie), k.stuecke.map(x => `${x.von}–${x.bis}`).join(";"),
    Math.max(...k.stuecke.map(x => x.maxRandNeu)), k.stuecke.some(x => x.wortGewechselt) ? "yes" : "no", bhhWort(k.bhh.urteil), anteile.length ? Math.min(...anteile).toPrecision(3) : ""]);
}
groesse.kand = schreibeCsv("candidates.csv", [
  "The list entries whose continuation is linearly stable at 30 digits at a mass where no list has the orbit (candidates), one row per list entry.",
  "family: see list-entries.csv; a family counts once. class (per entry) and family_class (the best of its entries, order c, ?, b, a, g): see README, section 'What new means'.",
  "status (per family): new / own (published before, dreikoerper v1.0.0) / not checkable (may be in the BHH catalogue of Li & Liao 2020, whose data are not public) / known.",
  "pieces: the candidate pieces (first–last stable probe, m3). max_margin_new: largest margin among the stable probes at unlisted masses (below 1e-6: a hairline decision).",
  "word_changed: the stable piece carries another free-group word than the list orbit (cite such pieces by their own word).",
  "bhh: whether the orbit ever reaches the start configuration of the BHH catalogues (collinear, body 3 in the middle, all velocities perpendicular to the line):",
  "never / unclear (the syzygy count depends on the sampling; all syzygies found are far from it) / possible. bhh_min_share: smallest longitudinal velocity share found there."],
  ["entry", "family", "list_mass", "class", "family_class", "status", "pieces", "max_margin_new", "word_changed", "bhh", "bhh_min_share"],
  zeilenKand);

// Stichprobe des blinden Flecks, mit den beim Ziehen festgehaltenen Nachbarn
const zeilenStich = [];
for (const p of BFS.punkte) {
  const g = fam.get(p.datei).G.find(x => gleich(x.m3, p.m3)), l = p.nachbarn.links, r = p.nachbarn.rechts;
  let lage = "";
  if (g && g.ok && g.urteil === "stabil") {
    const sL = !!(l && l.urteil === "stabil"), sR = !!(r && r.urteil === "stabil"), klammer = l && r ? Math.abs(r.m3 - l.m3) : Infinity;
    lage = sL && sR ? "in_piece" : sL || sR ? (klammer <= 0.005 + 1e-12 ? "tight_edge" : "open_edge") : "far";
  }
  zeilenStich.push([p.datei, p.m3, p.strecke[0], p.strecke[1], l ? l.m3 : "", l ? URTEIL[l.urteil] : "", r ? r.m3 : "", r ? URTEIL[r.urteil] : "", !g ? stopp(`Stichprobe ${p.datei}@${p.m3} ohne Probe`) : g.ok ? URTEIL[g.urteil] : "no_result", lage]);
}
groesse.stich = schreibeCsv("blind-spot-sample.csv", [
  `Random sample measuring the blind spot of the map: ${BFS.n} points, uniform over the m3-length of all continuation stretches at whose two ends double precision`,
  `does not say "stable" (${BFS.strecken} stretches, total length ${BFS.laenge.toFixed(4)}); random generator mulberry32, seed ${BFS.saat}; drawn ${BFS.gezogen.slice(0, 10)}, after all continuations were done.`,
  "zahlen.mjs redraws the sample from continuations-double-*.csv and list-entries.csv and checks that it comes out identical.",
  "left/right: the nearest accepted 30-digit probes on the same continuation AT THE TIME OF DRAWING (window edges added later around stable hits are not neighbours).",
  "verdict: our 30-digit probe at the point (no_result: Newton did not converge). position of stable points relative to the map: in_piece (both neighbours stable),",
  "tight_edge (one stable, bracket <= 0.005), open_edge (one stable, wider bracket or none), far (no stable neighbour). Blind spot = open_edge + far."],
  ["entry", "m3", "stretch_from", "stretch_to", "left_m3", "left_verdict", "right_m3", "right_verdict", "verdict", "position"],
  zeilenStich);
for (const [k, v] of Object.entries(groesse)) if (v > 10e6) stopp(`Tabelle ${k}: ${(v / 1e6).toFixed(1)} MB, größer als 10 MB`);
console.log("Tabellen: " + Object.entries(groesse).map(([k, v]) => `${k} ${(v / 1e6).toFixed(2)} MB`).join(", "));

/* ── 3. Gegenprobe: zahlen.mjs aus den Tabellen gegen pruefung.json und die Übersicht ── */
copyFileSync(join(HIER, "karte", "zahlen.mjs"), join(ZIEL, "zahlen.mjs"));
const zr = spawnSync(process.execPath, [join(ZIEL, "zahlen.mjs"), "--json"], { encoding: "utf8", maxBuffer: 64e6 });
let Z; try { Z = JSON.parse(zr.stdout); } catch { stopp("zahlen.mjs lieferte kein JSON:\n" + (zr.stderr || zr.stdout).slice(0, 2000)); }
const abw = [];
const soll = (name, ist, sollWert) => { if (typeof sollWert === "number" && !Number.isInteger(sollWert) ? Math.abs(ist - sollWert) > 1e-9 * Math.abs(sollWert) : ist !== sollWert) abw.push(`${name}: Tabellen ${ist}, Projekt ${sollWert}`); };
const P = PR.zahlen.proben, KZ = PR.zahlen.kandidaten, BF = PR.zahlen.blinderFleck;
for (const [a, b] of [["eintraege", "eintraege"], ["angenommen", "angenommen"], ["stabil", "stabil"], ["instabil", "instabil"], ["grenze", "grenze"], ["haaresbreite", "haaresbreite"], ["andereFehl", "andereFehl"]]) soll("proben." + a, Z.proben[a], P[b]);
soll("familien fortgesetzt", Z.liste.fortgesetzt, PR.zahlen.familienFortgesetzt);
soll("Gruppen (Familien)", Z.liste.familien, AW.zahl.gruppen);
soll("dieselbe Familie", Z.liste.dieselbeFamilie, ohneFortsetzung.gleich); soll("nicht fortgesetzt", Z.liste.nichtFortgesetzt, ohneFortsetzung.nicht);
for (const [a, b] of [["eintraege", "eintraege"], ["familien", "familien"], ["eigen", "eigeneFamilien"], ["bekannt", "bekannteFamilien"], ["nichtPruefbar", "nichtPruefbar"], ["neu", "neueFamilien"], ["nurHaaresbreite", "nurHaaresbreite"], ["mitWortwechsel", "mitWortwechsel"]]) soll("kandidaten." + a, Z.kandidaten[a], KZ[b]);
for (const [a, b] of [["c", "klasseC"], ["?", "klasseOffen"], ["b", "klasseB"], ["b?", "klasseBUnscharf"], ["a", "klasseA"], ["g", "klasseG"]]) soll("Klasse " + a, Z.kandidaten.proKlasse[a], KZ[b]);
for (const a of ["n", "gerechnet", "stabil", "imStueck", "engerRand", "randOffen", "fern", "blind", "instabil", "grenze", "fehl", "laenge"]) soll("blinderFleck." + a, Z.blinderFleck[a], BF[a]);
soll("Strecken der Stichprobe", Z.blinderFleck.strecken, BFS.strecken);
soll("Stücke", Z.stuecke.n, [...stueckeVon.values()].reduce((n, L) => n + L.length, 0));
if (Z.fehler.length || zr.status !== 0) abw.push(...Z.fehler.map(f => "zahlen.mjs: " + f));
if (abw.length) stopp("Tabellen und Projekt stimmen nicht überein:\n  " + abw.join("\n  "));
console.log(`Gegenprobe: zahlen.mjs aus den Tabellen = pruefung.json (Proben, Kandidaten, Klassen, blinder Fleck), Stichprobe neu gezogen und gleich`);
const tz = Date.now(), zLauf = spawnSync(process.execPath, [join(ZIEL, "zahlen.mjs")], { encoding: "utf8", maxBuffer: 64e6 }), zahlenSekunden = (Date.now() - tz) / 1000;
if (zLauf.status !== 0) stopp("zahlen.mjs (Textausgabe) mit Fehler:\n" + zLauf.stdout.slice(-2000));
console.log(zLauf.stdout.trim());

/* ── 4. Prüfcode, Probe im Ziel, Bild, Texte ── */
for (const d of ["kern.js", "genau.mjs", "quellen.mjs"]) copyFileSync(join(HIER, d), join(ZIEL, d));
copyFileSync(join(HIER, "karte", "probe-pruefen.mjs"), join(ZIEL, "probe-pruefen.mjs"));
// zwei Proben allein aus dem Paket nachrechnen (im Ziel, ohne das private Projekt): müssen übereinstimmen. Die zweite
// ist stark instabil (|s| ≈ 1020): ihr Rückkehrabstand zeigt, wie die Rundung der gedruckten Ziffern wächst (README)
const probeImZiel = (entry, m3) => {
  const t0 = Date.now(), r = spawnSync(process.execPath, ["probe-pruefen.mjs", "--entry", entry, "--m3", m3], { cwd: ZIEL, encoding: "utf8", timeout: 900000 });
  if (r.status !== 0 || !/AGREES/.test(r.stdout)) stopp(`probe-pruefen.mjs im Ziel stimmt nicht mit der Tabelle (${entry} bei ${m3}):\n` + (r.stdout + r.stderr).slice(-1500));
  const ruck = +(r.stdout.match(/after one period \(320 bits, order 40\): ([\d.e+-]+)/) || [])[1], ind = r.stdout.match(/indices ([-\d.e+]+)(?: \/ ([-\d.e+]+)| ± \S+ i)/);
  // bis 21.11.2026 las \S+ das Komma hinter dem zweiten Index mit: |s| wurde NaN und stand so in der README
  if (!Number.isFinite(ruck) || !ind || !Number.isFinite(+ind[1]) || (ind[2] != null && !Number.isFinite(+ind[2]))) stopp(`probe-pruefen.mjs: Ausgabe nicht lesbar (${entry} bei ${m3})`);
  const p = { entry, m3, sekunden: (Date.now() - t0) / 1000, rueckkehr: ruck, s: Math.max(Math.abs(+ind[1]), Math.abs(+(ind[2] ?? ind[1]))) };
  console.log(`Probe im Ziel: ${entry} bei ${m3} stimmt (${p.sekunden.toFixed(0)} s, Rückkehr ${ruck.toExponential(2)}, |s| ${p.s.toPrecision(4)})`);
  return p;
};
const PROBE = probeImZiel("I.B-1-0.75", "1.227812"), PROBE2 = probeImZiel("I.A-4-0.5", "0.5");
// BHH-Startlage der Familien A und B (werkzeug/bhh-familien-ab.mjs), für den Absatz zum Begleitdatensatz
const AB = lies(join(E, "bhh-lage-familien-ab.json")), abF = Object.values(AB.familien);
const ab = { familien: AB.familien, kleinster: Math.min(...abF.map(f => f.kleinsterAnteil)), groesster: Math.max(...abF.map(f => f.groessterAnteil)) };
const TMP = process.env.CLAUDE_JOB_DIR ? join(process.env.CLAUDE_JOB_DIR, "tmp") : tmpdir();
for (const b of baueBilder(ZIEL, TMP)) console.log(`Bild ${b.modus}: ${b.W} × ${b.H}`);
// Urteile von Vasiljević u. a. 2023 (laut Atlas, in pruefe-alles): wie viele Familien mit neuem Befund sind nur ihretwegen
// Klasse a — ohne 2018-S und ohne Portegies Zwart in ihren Stücken, mit einem 2023-„stabil“ an einer Listenmasse darin
const famKl = new Map(zeilenKand.map(z => [z[1], { klasse: z[4], stand: z[5] }]));
const wegenV = new Set();
for (const k of PR.kandidaten) {
  const f = famKl.get(k.familie); if (!f || f.stand !== "new" || f.klasse !== "a") continue;
  const g = k.stuecke.flatMap(s => s.gelistetIn);
  // 2018-Urteil S steht als „(S)“ oder, mit fremdem Urteil daneben, als „(S; …)“ — beides war schon vorher Klasse a
  const schonA = x => /\(S[);]/.test(x) || /Portegies/.test(x);
  if (g.some(schonA)) continue;
  if (g.some(x => /Vasiljević/.test(x))) wegenV.add(k.familie);
}
for (const k of PR.kandidaten) if (wegenV.has(k.familie) && k.stuecke.flatMap(s => s.gelistetIn).some(x => /\(S[);]/.test(x) || /Portegies/.test(x))) wegenV.delete(k.familie);
const vas = { stabil: PR.zahlen.eichungVasiljevic.zugeordnetStabil, familien: wegenV.size };
console.log(`Vasiljević u. a. 2023: ${vas.stabil} Listenbahnen stabil (laut Atlas); ${vas.familien} Familien nur deshalb Klasse a`);
writeFileSync(join(ZIEL, "README.md"), readme(Z, PR, { doi: DOI, probe: PROBE, probe2: PROBE2, ab, naehe, vas, zahlenSekunden }));
writeFileSync(join(ZIEL, "REVIEW.md"), review(Z, { naehe, vas }));
const { cff, zenodo } = zitat(Z, { doi: DOI });
writeFileSync(join(ZIEL, "CITATION.cff"), cff); writeFileSync(join(ZIEL, ".zenodo.json"), zenodo);
writeFileSync(join(ZIEL, "LICENSE"), readFileSync(join(HIER, "oeffentlich", "LICENSE"), "utf8").replace(/The results and the data package \(ergebnisse\/, fundbericht\/\)[\s\S]*$/,
  "The data, figures and text of this repository (daten/, bilder/, README.md, REVIEW.md) are licensed\nunder Creative Commons Attribution 4.0 International (CC BY 4.0):\nhttps://creativecommons.org/licenses/by/4.0/\n"));
if (!/CC BY 4\.0/.test(readFileSync(join(ZIEL, "LICENSE"), "utf8"))) stopp("LICENSE: der Absatz zu CC BY 4.0 fehlt (Vorlage oeffentlich/LICENSE geändert?)");
writeFileSync(join(ZIEL, ".gitignore"), "node_modules/\n");

/* ── 5. Abnahme im Ziel ── */
const alle = []; (function geh(d) { for (const x of readdirSync(d)) { if (x === ".git") continue; const p = join(d, x); statSync(p).isDirectory() ? geh(p) : alle.push(p); } })(ZIEL);
// keine Zahl der Liste: jede Zahl a, b, T der 1349 Listenbahnen (mit mindestens acht gültigen Ziffern) als ganzes Wort
const zahlen = new Set(); for (const p of alle.filter(p => /\.(csv|md|json|cff|svg|mjs|js)$/.test(p))) for (const m of readFileSync(p, "utf8").matchAll(/(?<![\d.])\d+\.\d+(?![\d.])/g)) zahlen.add(m[0]);
const listenwerte = KAT.flatMap(b => [b.a, b.b, b.T]).map(String).filter(x => x.replace(/\D/g, "").replace(/^0+/, "").length >= 8);
const fremd = listenwerte.filter(x => zahlen.has(x));
if (fremd.length) stopp(`${fremd.length} Zahlen der Liste von Li, Jing & Liao im Ziel: ${fremd.slice(0, 5).join(" ")}`);
// keine interne Spur in den Dateien, die dieses Skript schreibt (der Rechenkern ist unverändert schon öffentlich).
// Mailadressen, Rechner- und Benutzername prüft oeffentlich-pruefen.mjs (danach); sie stehen hier mit Absicht
// nicht im Muster, weil dieses Skript selbst öffentlich ist (Hauptrepo ab v1.2.0)
const SPUR = /ablage|AUFGABEN|GRENZEN\.md|mail-an|pruefbericht|Wächter|Waechter|Leitstand|\bPeter\b|\bFrank\b/i;
for (const p of alle.filter(p => !/[\\/](kern\.js|genau\.mjs|quellen\.mjs)$/.test(p) && !/\.png$/.test(p))) { const m = readFileSync(p, "utf8").match(SPUR); if (m) stopp(`interne Spur „${m[0]}“ in ${p}`); }
const op = spawnSync(process.execPath, [join(HIER, "werkzeug", "oeffentlich-pruefen.mjs"), ZIEL, "--muss", "README.md,REVIEW.md,LICENSE,CITATION.cff,.zenodo.json,.gitignore,zahlen.mjs,probe-pruefen.mjs,kern.js,genau.mjs,quellen.mjs,bilder/stability-map-light.svg,bilder/stability-map-light.png,daten/probes-30digit.csv"], { encoding: "utf8" });
console.log((op.stdout || "").trim().split("\n").slice(-6).join("\n"));
if (op.status !== 0) stopp("oeffentlich-pruefen: NICHT veröffentlichen");
console.log(`Nähe zu den Listenwerten: ${naehe.n} Bahnen, |Δa| ≤ ${naehe.maxA.toExponential(1)}, |Δb| ≤ ${naehe.maxB.toExponential(1)}, |ΔT|/T ≤ ${naehe.maxRelT.toExponential(1)}; gerundet anders bei ${naehe.rundungAnders}`);
console.log(`Abnahme: ${listenwerte.length} Listenwerte gesucht, keiner im Ziel; keine interne Spur; oeffentlich-pruefen grün. Gebaut: ${ZIEL}${ENTWURF ? " (ENTWURF)" : ""}`);
