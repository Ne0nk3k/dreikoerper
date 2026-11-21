// dreikoerper/werkzeug/pruefe-pruefer.mjs — prüft das Prüfskript (13.11.2026). „0 Verstöße“ beweist nur
// etwas, wenn pruefe-alles.mjs Fehler auch findet. Dieses Skript kopiert die Ergebnisse in einen
// Arbeitsordner, baut je Lauf genau einen Fehler ein und verlangt Exit 1 und die erwartete Kennung
// (D, G, I, K, Z) unter den harten Verstößen. Dazu ein Lauf ohne Fehler: Exit 0.
//
//   node werkzeug/pruefe-pruefer.mjs [--arbeitsordner <pfad>]
//
// Nach jeder Änderung am Prüfskript laufen lassen. Exit 1, wenn ein Fehler unentdeckt bleibt.

import { cpSync, rmSync, readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { HIER, ladeKatalog } from "../quellen.mjs";

const argv = process.argv.slice(2);
const ARB = argv.includes("--arbeitsordner") ? argv[argv.indexOf("--arbeitsordner") + 1] : join(tmpdir(), "dreikoerper-pruefe-pruefer");
const QUELLE = join(HIER, "ergebnisse");
const DATEIEN = ["listenfortsetzung", "listenfortsetzung-auswertung.json", "eigene-funde.json", "bekannte-funde.json", "liste-begegnungen.json"];
const O = d => join(d, "listenfortsetzung");
const lies = p => JSON.parse(readFileSync(p, "utf8"));
const schreib = (p, j) => writeFileSync(p, JSON.stringify(j, null, 1));

function kopie() {
  rmSync(ARB, { recursive: true, force: true }); mkdirSync(ARB, { recursive: true });
  for (const n of DATEIEN) if (existsSync(join(QUELLE, n))) cpSync(join(QUELLE, n), join(ARB, n), { recursive: true });
  if (existsSync(join(QUELLE, "bhh-lage"))) cpSync(join(QUELLE, "bhh-lage"), join(ARB, "bhh-lage"), { recursive: true });
  // die Kopie selbst auswerten: läuft gerade eine Rechnung, ist die echte Auswertung älter als die
  // Daten (Z), und ohne Fehler gäbe es schon einen Verstoß (13.11.2026)
  const a = spawnSync(process.execPath, [join(HIER, "werkzeug", "liste-auswerten.mjs")], { env: { ...process.env, DREIKOERPER_ERGEBNISSE: ARB }, encoding: "utf8" });
  if (a.status !== 0) throw new Error("liste-auswerten in der Kopie: Exit " + a.status + " " + (a.stderr || "").slice(0, 300));
  return ARB;
}
function pruefe(d, args = []) {
  const r = spawnSync(process.execPath, [join(HIER, "werkzeug", "pruefe-alles.mjs"), ...args], { env: { ...process.env, DREIKOERPER_ERGEBNISSE: d }, encoding: "utf8", maxBuffer: 1 << 28 });
  const p = existsSync(join(d, "pruefung.json")) ? lies(join(d, "pruefung.json")) : { hart: [] };
  return { exit: r.status, hart: p.hart || [] };
}
// eine angenommene Probe mit Bedingung finden: liefert [datei, index]
function probe(d, bed) {
  const A = lies(join(d, "listenfortsetzung-auswertung.json"));
  for (const k of A.kandidaten) {
    const p = join(O(d), k.datei + "-genau.json"), J = lies(p);
    const R = lies(join(O(d), k.datei + ".json"));
    const i = J.punkte.findIndex(g => g.ok && bed(g, R));
    if (i >= 0) return { p, J, i, R, datei: k.datei };
  }
  throw new Error("keine passende Probe gefunden");
}
const LM = [0.5, 0.75, 1, 2, 4, 5, 8, 10], istLM = m => LM.some(x => Math.abs(x - m) < 1e-9);
const KAT = ladeKatalog().bahnen.filter(b => b.satz === "ungleich");

const faelle = [
  ["D", "BOM am Anfang einer Probendatei", d => { const { p } = probe(d, () => true); writeFileSync(p, "﻿" + readFileSync(p, "utf8")); }],
  ["D", "abgeschnittene Probendatei", d => { const { p } = probe(d, () => true); const t = readFileSync(p, "utf8"); writeFileSync(p, t.slice(0, Math.floor(t.length / 2))); }],
  ["G", "Rest 1e-20", d => { const x = probe(d, () => true); x.J.punkte[x.i].rest = 1e-20; schreib(x.p, x.J); }],
  ["G", "Gegenprobe 1e-10", d => { const x = probe(d, () => true); x.J.punkte[x.i].unterschied = 1e-10; schreib(x.p, x.J); }],
  ["G", "„stabil“ mit s1 = 2,5", d => { const x = probe(d, g => g.urteil === "stabil"); x.J.punkte[x.i].s1 = 2.5; schreib(x.p, x.J); }],
  ["I", "T* um 1 % daneben", d => { const x = probe(d, (g, R) => Math.abs(g.m3 - R.start.m3) > 1e-9); x.J.punkte[x.i].Ts = +x.J.punkte[x.i].Ts * 1.01; schreib(x.p, x.J); }],
  ["I", "an der Listenmasse andere Kennung und Anfangswerte neben der Liste", d => { const x = probe(d, (g, R) => Math.abs(g.m3 - R.start.m3) < 1e-9); x.J.punkte[x.i].kennung = "falsch0000"; x.J.punkte[x.i].a = String(+x.J.punkte[x.i].a + 1e-6); schreib(x.p, x.J); }],
  ["I", "Kennung weder wie der linke noch wie der rechte Nachbar", d => { const x = probe(d, (g, R) => Math.abs(g.m3 - R.start.m3) > 1e-9 && Math.abs(g.m3 - 1) > 1e-9); x.J.punkte[x.i].kennung = "falsch0000"; schreib(x.p, x.J); }],
  ["K", "neue stabile Probe an einer Listenmasse, T*·2 trifft eine Listenbahn", d => {
    const x = probe(d, (g, R) => g.urteil === "stabil" && istLM(g.m3) && Math.abs(g.m3 - R.start.m3) > 1e-9);
    const m3 = x.J.punkte[x.i].m3, b = KAT.find(b => Math.abs(b.m[2] - m3) < 1e-9), ziel = b.Ts / 2;
    x.J.punkte[x.i].Ts = ziel; schreib(x.p, x.J);
    // die Fortsetzung an dieser Masse gleich setzen, sonst greift die Identitätsprüfung (I) zuerst und
    // die Probe zählt gar nicht als neu — dann bliebe die Vielfachen-Regel ungeprüft
    const pf = join(O(d), x.datei + ".json"), R = lies(pf);
    for (const r of [R.richtungen.abwaerts, R.richtungen.aufwaerts]) for (const q of r.punkte) if (Math.abs(q.m3 - m3) < 0.06) q.Ts = ziel;
    schreib(pf, R); }],
  ["K", "Kandidat fehlt in der Auswertung", d => { const p = join(d, "listenfortsetzung-auswertung.json"), A = lies(p); A.kandidaten.shift(); schreib(p, A); }],
  ["Z", "Kennzahl der Auswertung um 1 verändert", d => { const p = join(d, "listenfortsetzung-auswertung.json"), A = lies(p); A.zahl.genauStabil += 1; schreib(p, A); }],
];

let fehler = 0;
const ohne = pruefe(kopie());
console.log(`ohne eingebauten Fehler: Exit ${ohne.exit}, ${ohne.hart.length} harte Verstöße${ohne.exit === 0 && !ohne.hart.length ? " — richtig" : " — FALSCH"}`);
if (ohne.exit !== 0 || ohne.hart.length) fehler++;
// Schlussprüfung (15.11.2026, Befund 6): eine Probe ohne Ergebnis muss mit --schluss hart gemeldet werden
faelle.push(["D", "Probe ohne Ergebnis bei der Schlussprüfung (--schluss)", d => { const x = probe(d, () => true); x.J.punkte.push({ m3: +x.J.punkte[x.i].m3 + 1e-7, ok: false, grund: "keine Ausgabe" }); schreib(x.p, x.J); }, ["--schluss"]]);
// Schlussprüfung (20.11.2026, Prüfbericht der zweiten Sitzung, H3): fehlt einer fortgesetzten Familie die Probe an
// ihrer Listenmasse, muss --schluss das hart melden
faelle.push(["D", "Probe an der Listenmasse fehlt (--schluss)", d => { const x = probe(d, (g, R) => Math.abs(g.m3 - R.start.m3) < 1e-9); x.J.punkte = x.J.punkte.filter(g => Math.abs(g.m3 - x.R.start.m3) >= 1e-9); schreib(x.p, x.J); }, ["--schluss"]]);
for (const [kennung, name, baue, args] of faelle) {
  const d = kopie(); baue(d);
  const r = pruefe(d, args), gefunden = r.hart.some(h => h.startsWith(kennung + " "));
  const gut = r.exit === 1 && gefunden;
  if (!gut) fehler++;
  console.log(`${gut ? "erkannt   " : "ÜBERSEHEN "} ${kennung}  ${name}  (Exit ${r.exit}${gefunden ? "" : `; gemeldet: ${r.hart.map(h => h.slice(0, 1)).join("") || "nichts"}`})`);
}
// Positivprobe für B (blinder Fleck, 13.11.2026): eine Stichprobe aus vorhandenen Proben mit bekanntem
// Urteil muss genau so gezählt werden — sonst bliebe ein falscher Feldname als „0 gerechnet“ unbemerkt
{
  const d = kopie(), A = lies(join(d, "listenfortsetzung-auswertung.json")), punkte = [];
  let st = 0, inst = 0;
  for (const k of A.kandidaten) {
    for (const g of lies(join(O(d), k.datei + "-genau.json")).punkte) {
      if (g.ok && g.urteil === "stabil" && st < 2) { st++; punkte.push({ datei: k.datei, m3: g.m3 }); }
      else if (g.ok && g.urteil === "instabil" && inst < 2) { inst++; punkte.push({ datei: k.datei, m3: g.m3 }); }
    }
    if (st >= 2 && inst >= 2) break;
  }
  writeFileSync(join(d, "blinder-fleck-stichprobe.json"), JSON.stringify({ n: punkte.length, laenge: 1, punkte }));
  const r = pruefe(d), B = (lies(join(d, "pruefung.json")).zahlen || {}).blinderFleck;
  const gut = r.exit === 0 && B && B.gerechnet === 4 && B.stabil === 2 && B.instabil === 2 && B.ausstehend === 0 && B.fehl === 0;
  if (!gut) fehler++;
  console.log(`${gut ? "richtig   " : "FALSCH    "} B  Stichprobe aus 2 stabilen und 2 instabilen Proben: gerechnet ${B && B.gerechnet}, stabil ${B && B.stabil}, instabil ${B && B.instabil}, ausstehend ${B && B.ausstehend} (Exit ${r.exit})`);
}
// Positivprobe „aus der Literatur bekannt“ (16.11.2026): ohne Einträge zählt keine Familie als bekannt; ein
// Eintrag, der alle Stücke einer Familie mit nur einem Stück deckt, nimmt genau diese Familie aus „neu“
{
  const d = kopie(); writeFileSync(join(d, "bekannte-funde.json"), JSON.stringify({ funde: [] }));
  const r0 = pruefe(d), K0 = (lies(join(d, "pruefung.json")).zahlen || {}).kandidaten || {};
  const P = lies(join(d, "pruefung.json")), fam = new Map(); for (const k of P.kandidaten) fam.set(k.familie, (fam.get(k.familie) || []).concat(k));
  const [, [k1]] = [...fam].find(([, L]) => L.length === 1 && L[0].stuecke.length === 1 && !L[0].eigen);
  const s = k1.stuecke[0];
  writeFileSync(join(d, "bekannte-funde.json"), JSON.stringify({ funde: [{ datei: k1.datei, von: s.von - 1e-3, bis: s.bis + 1e-3, wo: "Test" }] }));
  const r1 = pruefe(d), K1 = (lies(join(d, "pruefung.json")).zahlen || {}).kandidaten || {};
  const gut = K0.bekannteFamilien === 0 && K1.bekannteFamilien === 1 && K1.neueFamilien === K0.neueFamilien - 1 && K1.bekannteStuecke === 1;
  if (!gut) fehler++;
  console.log(`${gut ? "richtig   " : "FALSCH    "} K  bekannt aus der Literatur: ohne Eintrag ${K0.bekannteFamilien} bekannt / ${K0.neueFamilien} neu; mit Eintrag für ${k1.datei} ${K1.bekannteFamilien} bekannt / ${K1.neueFamilien} neu, ${K1.bekannteStuecke} Stück`);
}
// Positivprobe „fremdes Urteil an der Listenmasse“ (17.11.2026): ein Eintrag „art: urteil“ mit S hebt ein
// b-Stück (dort „marginal“ nach 2018) auf a; „neu“, „bekannt“ und die Eichung an 2018 bleiben gleich
{
  const d = kopie(); writeFileSync(join(d, "bekannte-funde.json"), JSON.stringify({ funde: [] }));
  const r0 = pruefe(d), P0 = lies(join(d, "pruefung.json")), K0 = P0.zahlen.kandidaten, fam = new Map();
  for (const k of P0.kandidaten) fam.set(k.familie, (fam.get(k.familie) || []).concat(k));
  // nicht die Kandidaten mit fester Klassenerwartung im Prüfskript (Abschnitt T) — sonst meldet T zu Recht
  // einen Verstoß (erster Lauf am 17.11.2026 wählte I.A-1-2, erwartet b)
  const T_FEST = ["I.A-1-2", "I.A-7-5", "I.A-1-4", "I.B-10-0.75"];   // I.A-7-5 seit 21.11.2026 (Klasse b im Abschnitt T)
  const k0 = [...fam.values()].filter(L => L.length === 1 && !L[0].eigen && !T_FEST.includes(L[0].datei) && L[0].klasse === "b" && L[0].stuecke.length === 1
    && L[0].stuecke[0].gelistetIn.length === 1 && / \(M\)$/.test(L[0].stuecke[0].gelistetIn[0])).map(L => L[0])[0];
  let gut = false, text = "kein passender b-Kandidat in der Kopie";
  if (k0) {
    const [, name, m3] = k0.stuecke[0].gelistetIn[0].match(/^(.*)@([\d.]+) \(M\)$/);
    writeFileSync(join(d, "bekannte-funde.json"), JSON.stringify({ funde: [{ art: "urteil", datei: name, m3: +m3, urteil: "S", kurz: "Test", wo: "Test" }] }));
    const r1 = pruefe(d), P1 = lies(join(d, "pruefung.json")), K1 = P1.zahlen.kandidaten, k1 = P1.kandidaten.find(k => k.datei === k0.datei);
    gut = r0.exit === 0 && r1.exit === 0 && k1 && k1.klasse === "a" && K1.neueFamilien === K0.neueFamilien && K1.klasseA === K0.klasseA + 1
      && K1.klasseB === K0.klasseB - 1 && K1.bekannteFamilien === K0.bekannteFamilien && JSON.stringify(P1.zahlen.eichung) === JSON.stringify(P0.zahlen.eichung);
    text = `${k0.datei}: ohne Eintrag ${k0.klasse}, mit Urteil S bei ${m3} ${k1 && k1.klasse} (${k1 && k1.stuecke[0].gelistetIn[0]}); neu ${K0.neueFamilien} → ${K1.neueFamilien}, a ${K0.klasseA} → ${K1.klasseA}, b ${K0.klasseB} → ${K1.klasseB}; Eichung ${JSON.stringify(P1.zahlen.eichung) === JSON.stringify(P0.zahlen.eichung) ? "gleich" : "VERÄNDERT"} (Exit ${r0.exit}/${r1.exit})`;
  }
  if (!gut) fehler++;
  console.log(`${gut ? "richtig   " : "FALSCH    "} K  fremdes Urteil an der Listenmasse: ${text}`);
}
// Positivprobe „nicht prüfbar“ (21.11.2026): ein Eintrag „art: offen“ nimmt genau seine Familie aus „neu“ und zählt
// sie gesondert; ohne Eintrag zählt sie als neu
{
  const d = kopie(); writeFileSync(join(d, "bekannte-funde.json"), JSON.stringify({ funde: [] }));
  const r0 = pruefe(d), K0 = lies(join(d, "pruefung.json")).zahlen.kandidaten;
  writeFileSync(join(d, "bekannte-funde.json"), JSON.stringify({ funde: [{ art: "offen", datei: "I.B-3-2", kurz: "Test", wo: "Test" }] }));
  const r1 = pruefe(d), K1 = lies(join(d, "pruefung.json")).zahlen.kandidaten;
  const gut = r0.exit === 0 && r1.exit === 0 && K1.neueFamilien === K0.neueFamilien - 1 && K1.nichtPruefbar === 1 && (K0.nichtPruefbar || 0) === 0;
  if (!gut) fehler++;
  console.log(`${gut ? "richtig   " : "FALSCH    "} K  nicht prüfbar (art: offen): neu ${K0.neueFamilien} → ${K1.neueFamilien}, nicht prüfbar ${K0.nichtPruefbar || 0} → ${K1.nichtPruefbar} (Exit ${r0.exit}/${r1.exit})`);
}
// Positivprobe „lage“ (20.11.2026, Prüfbericht der zweiten Sitzung, H1): II.C-3-0.75 und II.C-8-0.5 treffen sich nur
// über „lage“ (gleiches T* auf acht Stellen) — mit dieser Verbindung eine Familie, ohne sie zwei
{
  const d = kopie(), r0 = pruefe(d), P0 = lies(join(d, "pruefung.json")), fam0 = x => (P0.kandidaten.find(k => k.datei === x) || {}).familie;
  for (const x of ["II.C-3-0.75", "II.C-8-0.5"]) { const p = join(O(d), x + ".json"), R = lies(p); for (const l of R.listen || []) if (l.liliao && l.liliao.stufe === "lage") l.liliao.stufe = "keine"; schreib(p, R); }
  const r1 = pruefe(d), P1 = lies(join(d, "pruefung.json")), fam1 = x => (P1.kandidaten.find(k => k.datei === x) || {}).familie;
  const gut = r0.exit === 0 && !!fam0("II.C-3-0.75") && fam0("II.C-3-0.75") === fam0("II.C-8-0.5") && fam1("II.C-3-0.75") !== fam1("II.C-8-0.5")
    && P1.zahlen.kandidaten.familien === P0.zahlen.kandidaten.familien + 1;
  if (!gut) fehler++;
  console.log(`${gut ? "richtig   " : "FALSCH    "} K  „lage“ verbindet Familien: mit ${fam0("II.C-3-0.75")} = ${fam0("II.C-8-0.5")}, ohne ${fam1("II.C-3-0.75")} / ${fam1("II.C-8-0.5")}; Familien ${P0.zahlen.kandidaten.familien} → ${P1.zahlen.kandidaten.familien} (Exit ${r0.exit}/${r1.exit})`);
}
// Positivprobe „an der Grenze schließt keinen Rand“ (20.11.2026, Prüfbericht H2): I.B-4-4 läuft von der Listenmasse 4
// mit Rand unter der Schwelle bis 4,4787 — Klasse „?“. Wird der Grenznachbar zur instabilen Probe, ist der Rand zu,
// die Listenmasse liegt jenseits der Gegenprobe, und das Stück ist c.
{
  const d = kopie(), r0 = pruefe(d), P0 = lies(join(d, "pruefung.json")), k0 = P0.kandidaten.find(k => k.datei === "I.B-4-4");
  const p = join(O(d), "I.B-4-4-genau.json"), J = lies(p), s = k0 && k0.stuecke[0];
  const nb = s && J.punkte.filter(g => g.ok && g.m3 < s.von - 1e-12).sort((x, y) => y.m3 - x.m3)[0];
  let text = "I.B-4-4 nicht gefunden", gut = false;
  if (nb) {
    const war = nb.urteil; nb.urteil = "instabil"; nb.rand = -1e-10; nb.s1 = 2 + 1e-10; schreib(p, J);
    const r1 = pruefe(d), P1 = lies(join(d, "pruefung.json")), k1 = P1.kandidaten.find(k => k.datei === "I.B-4-4");
    gut = r0.exit === 0 && k0.klasse === "?" && war === "an der Grenze" && nb.m3 > 4 && !!k1 && k1.klasse === "c";
    text = `I.B-4-4: Nachbar bei ${nb.m3.toFixed(4)} „${war}“ → Klasse ${k0.klasse}; als instabile Gegenprobe → Klasse ${k1 && k1.klasse} (Exit ${r0.exit}/${r1.exit})`;
  }
  if (!gut) fehler++;
  console.log(`${gut ? "richtig   " : "FALSCH    "} K  „an der Grenze“ schließt keinen Rand: ${text}`);
}
// Positivprobe für die Lage gegenüber der Karte (13.11.2026): vier stabile Stichprobenpunkte mit beim
// Ziehen festgehaltenen Nachbarn — beide instabil (fern); links stabil 0,5 entfernt, rechts keine
// Probe (Rand offen); links stabil, rechts instabil, Klammer 0,004 (an engem Rand); beide stabil (im
// Stück). Danach wird neben den ersten eine stabile Probe gelegt — wie die Fensterränder des Nachlaufs;
// er muss „fern“ bleiben (aus der lebenden Datei wäre er „an engem Rand“). Der Exit-Code zählt hier
// nicht: die eingelegte Probe ändert die Kandidaten, die Auswertung passt dann nicht mehr (Z).
{
  const d = kopie(), A = lies(join(d, "listenfortsetzung-auswertung.json")), st = [];
  for (const k of A.kandidaten) { for (const g of lies(join(O(d), k.datei + "-genau.json")).punkte) if (g.ok && g.urteil === "stabil" && st.length < 4) st.push({ datei: k.datei, g }); if (st.length >= 4) break; }
  const [a, c, e, f] = st;
  const punkte = [
    { datei: a.datei, m3: a.g.m3, nachbarn: { links: { m3: a.g.m3 - 0.01, urteil: "instabil" }, rechts: { m3: a.g.m3 + 0.01, urteil: "instabil" } } },
    { datei: c.datei, m3: c.g.m3, nachbarn: { links: { m3: c.g.m3 - 0.5, urteil: "stabil" }, rechts: null } },
    { datei: e.datei, m3: e.g.m3, nachbarn: { links: { m3: e.g.m3 - 0.002, urteil: "stabil" }, rechts: { m3: e.g.m3 + 0.002, urteil: "instabil" } } },
    { datei: f.datei, m3: f.g.m3, nachbarn: { links: { m3: f.g.m3 - 0.01, urteil: "stabil" }, rechts: { m3: f.g.m3 + 0.01, urteil: "stabil" } } }];
  writeFileSync(join(d, "blinder-fleck-stichprobe.json"), JSON.stringify({ n: 4, laenge: 1, punkte }));
  const p = join(O(d), a.datei + "-genau.json"), J = lies(p);
  J.punkte.push({ ...a.g, m3: a.g.m3 + 1e-4 }); J.punkte.sort((x, y) => x.m3 - y.m3); schreib(p, J);
  const r = pruefe(d), B = (lies(join(d, "pruefung.json")).zahlen || {}).blinderFleck;
  const gut = B && B.stabil === 4 && B.fern === 1 && B.randOffen === 1 && B.engerRand === 1 && B.imStueck === 1 && B.blind === 2 && !B.nachbarnLive;
  if (!gut) fehler++;
  console.log(`${gut ? "richtig   " : "FALSCH    "} B  Lage aus den beim Ziehen festgehaltenen Nachbarn: stabil ${B && B.stabil}, fern ${B && B.fern}, Rand offen ${B && B.randOffen}, an engem Rand ${B && B.engerRand}, im Stück ${B && B.imStueck}, blind ${B && B.blind} (erwartet 4; 1, 1, 1, 1; 2)`);
}
rmSync(ARB, { recursive: true, force: true });
console.log(fehler ? `${fehler} Prüfungen versagt — das Prüfskript ist so kein Beleg` : `alle ${faelle.length} eingebauten Fehler erkannt, ohne Fehler kein Fehlalarm, Positivproben B richtig`);
process.exit(fehler ? 1 : 0);
