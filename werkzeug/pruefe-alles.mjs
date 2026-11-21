// dreikoerper/werkzeug/pruefe-alles.mjs — Abnahme der Listenfortsetzung (12.11.2026, Felix: „finde alle
// [Fehler], es dürfen keine weiteren entstehen da es um eine wissenschaftliche veröffentlichung geht.
// alles muss zenodo niveau haben“).
//
//   node werkzeug/pruefe-alles.mjs        Bericht auf der Konsole und in ergebnisse/pruefung.json;
//                                         Exit 1 bei jedem harten Verstoß
//
// Rechnet jede Kennzahl aus den Dateien neu, unabhängig von liste-auswerten, und prüft:
//  D  Daten: jede Ergebnisdatei lesbar und ohne BOM; liegengebliebene Nebendateien; Familien im
//     Zustand „läuft“ (nur zulässig, solange gerechnet wird); Einträge „keine Ausgabe“.
//  G  Güte jeder angenommenen Probe: Rest ≤ 1e-25 in beiden Genauigkeiten, Gegenprobe ≤ 1e-18,
//     Urteil passt zu s1, s2 und Rand.
//  I  Identität: T* wie die Fortsetzung an dieser Masse (≤ 1e-3 relativ); an der Listenmasse die
//     Kennung des Katalogs; sonst (außer bei m3 = 1) die Kennung eines der beiden Nachbarpunkte.
//  K  Kandidaten (stabil auf 30 Stellen an einer Masse ohne Listeneintrag; bei m3 = 1 auch nicht in
//     der Liste aus Sofia) neu bestimmt und mit liste-auswerten verglichen; zu Familien
//     zusammengefasst (einander auf den Ort getroffen); neue stabile Proben an einer Listenmasse
//     gegen alle Listenbahnen dort geprüft, auch als Vielfache (T*·k, k = 1/3 … 3); eigene
//     Veröffentlichungen (ergebnisse/eigene-funde.json: Listeneintrag oder Bahnwort). Klasse je
//     stabilem Stück, gemessen an allen Massen, an denen der Zweig gelistet ist (eigene Startmasse,
//     jede Listenmasse, an der die Fortsetzung einen Eintrag auf den Ort trifft, m3 = 1 bei
//     Treffer in einer Liste gleicher Massen):
//       a  das Stück enthält eine gelistete Masse, deren Bahn Li, Jing & Liao linear stabil nennen;
//       b  … eine gelistete Masse, deren Bahn sie marginal oder instabil nennen;
//       g  … nur m3 = 1 (gleiche Massen; deren Stabilität ist hier nicht verglichen);
//       c  das Stück enthält keine gelistete Masse und liegt nicht an einem offenen Rand neben einer:
//          ein neues stabiles Stück;
//       ?  offener Rand (noch keine Gegenprobe), und dahinter liegt eine gelistete Masse.
//  T  Proben mit bekannter Antwort, damit eine kaputte Regel laut wird: Wort → Kennung für alle
//     Wörter von 2018, Bahnwort von I.A-5 trifft I.A-5@2, Klassen von I.A-1@2 (b), I.A-1@4 (c),
//     I.B-10@0.75 (a).
//  L  Literatur: BHH-Lage je Kandidat (ergebnisse/bhh-lage.json); fehlt sie, „offen“.
//  Z  Kennzahlen mit einer Definition: Probe = Eintrag in einer -genau.json; angenommen = ok;
//     stabil = angenommen und Urteil „stabil“ (bei bestandener Güte); Haaresbreite = Rand < 1e-6.

import { readFileSync, readdirSync, existsSync, writeFileSync, renameSync } from "node:fs";
import { join } from "node:path";
import { HIER, ladeKatalog, ladeKern } from "../quellen.mjs";
import { schreibeSicher } from "./sicher.mjs";
// --schluss (Nachlauf, Prüfung zum Schluss; Code-Prüfung 15.11.2026, Befund 6): Proben ohne Ergebnis und
// Familien im Zustand „läuft“ sind dann harte Verstöße — beim Abnehmen darf nichts offen sein
const SCHLUSS = process.argv.includes("--schluss");

// DREIKOERPER_ERGEBNISSE: anderer Ergebnisordner (für werkzeug/pruefe-pruefer.mjs, das in einer Kopie
// Fehler einbaut und verlangt, dass dieses Skript sie meldet); ohne Angabe der echte Ordner
const E = process.env.DREIKOERPER_ERGEBNISSE || join(HIER, "ergebnisse"), O = join(E, "listenfortsetzung"), Q = join(HIER, "quelle");
const LISTENMASSEN = [0.5, 0.75, 1, 2, 4, 5, 8, 10];
const gleich = (x, y) => Math.abs(x - y) < 1e-9;
const hart = [], warn = [];
const H = (k, s) => hart.push(`${k}  ${s}`), W = (k, s) => warn.push(`${k}  ${s}`);
const liesJson = p => { const t = readFileSync(p, "utf8"); if (t.charCodeAt(0) === 0xfeff) H("D", `BOM am Anfang: ${p}`); return JSON.parse(t.replace(/^\uFEFF/, "")); };
const lies = p => { try { return liesJson(p); } catch { return null; } };
const datei = b => `${b.name.replace(/[^A-Za-z0-9.-]/g, "")}-${b.m[2]}`;
const dateiVon = (name, m3) => `${String(name).replace(/[^A-Za-z0-9.-]/g, "")}-${m3}`;
const KATL = ladeKatalog().bahnen.filter(b => b.satz === "ungleich");
const KAT = new Map(KATL.map(b => [datei(b), b]));
const KERN = ladeKern(), wortKennung = (w, m) => KERN.streu(KERN.kennung(KERN.folgeAusWort(w), m));
const hristovTreffer = l => !!(l && l.hristov && (l.hristov.mitTs || (l.hristov.naechsterOrt && l.hristov.naechsterOrt.abstand < 1e-6)));

// ── D: alle Dateien lesen ──
const fam = new Map();
for (const n of readdirSync(O).filter(n => n.endsWith(".json"))) {
  let J; try { J = liesJson(join(O, n)); } catch (e) { H("D", `nicht lesbar: ${n} (${String(e.message).slice(0, 60)})`); continue; }
  const d = n.endsWith("-genau.json") ? n.slice(0, -11) : n.slice(0, -5), e = fam.get(d) || {};
  if (n.endsWith("-genau.json")) e.G = J.punkte || []; else e.R = J;
  fam.set(d, e);
}
for (const d of [O, E]) for (const n of readdirSync(d).filter(n => n.endsWith(".tmp"))) W("D", `liegengebliebene Nebendatei: ${join(d, n)}`);
let fortgesetzt = 0; const laeuft = [];
for (const [d, e] of fam) {
  if (!e.R) { H("D", `Proben ohne Familiendatei: ${d}`); continue; }
  if (!KAT.has(d)) W("D", `Familiendatei ohne Katalogeintrag: ${d}`);
  const r = e.R.richtungen; if (!r) continue;
  if (!r.aufwaerts || r.aufwaerts.grund === "läuft" || r.abwaerts.grund === "läuft") { laeuft.push(d); continue; }
  fortgesetzt++;
  e.P = [...r.abwaerts.punkte, ...r.aufwaerts.punkte];
}
if (laeuft.length) W("D", `${laeuft.length} Familien im Zustand „läuft“ (nur zulässig, solange gerechnet wird): ${laeuft.slice(0, 6).join(" ")}`);

// ── G, I: jede Probe ──
const Z = { eintraege: 0, angenommen: 0, keineAusgabe: 0, andereFehl: 0, stabil: 0, instabil: 0, grenze: 0, haaresbreite: 0, gueteVerletzt: 0 };
const andereGruende = {};
// Proben von Familien, deren Fortsetzung gerade läuft: geprüft wie alle, im Vergleich mit liste-auswerten
// (Z) aber abgezogen — liste-auswerten überspringt solche Familien ganz (13.11.2026: während Stufe 6a
// sonst ein Fehlalarm „genauPunkte dort 1443, hier 1446“)
const imLauf = new Set(laeuft), lauf = { eintraege: 0, angenommen: 0, stabil: 0 };
for (const [d, e] of fam) {
  if (!e.G || !e.R) continue;
  const l = imLauf.has(d) ? 1 : 0;
  const b = KAT.get(d), s0 = e.R.start.m3;
  const start = { ...e.R.start, Ts: b ? b.Ts : null, kennung: b ? b.kennung : null };
  const P = e.P ? [...e.P, start].sort((x, y) => x.m3 - y.m3) : [];
  for (const g of e.G) {
    Z.eintraege++; lauf.eintraege += l;
    if (!g.ok) { if (/keine Ausgabe/.test(g.grund || "")) Z.keineAusgabe++; else { Z.andereFehl++; const k = String(g.grund || "?").slice(0, 50); andereGruende[k] = (andereGruende[k] || 0) + 1; } continue; }
    Z.angenommen++; lauf.angenommen += l;
    const p_ = [], pI = [], s1 = +g.s1, s2 = +g.s2, rand = +g.rand;
    if (!(+g.rest <= 1e-25)) p_.push(`Rest ${g.rest}`);
    if (g.restAndereGenauigkeit != null && !(+g.restAndereGenauigkeit <= 1e-25)) p_.push(`Rest bei anderer Genauigkeit ${g.restAndereGenauigkeit}`);
    if (g.unterschied != null && !(Math.abs(+g.unterschied) <= 1e-18)) p_.push(`Gegenprobe ${g.unterschied}`);
    const stabilNachS = !g.komplex && Math.abs(s1) < 2 && Math.abs(s2) < 2;
    // Urteil genau nach der Regel aus genau.mjs (20.11.2026, Prüfbericht der zweiten Sitzung, H10: vorher genügte
    // für „stabil“ Rand > 0 und für „an der Grenze“ |Rand| ≤ 1e-12 — lockerer als die Regel; in den Daten ohne Folge)
    const u = Number.isFinite(+g.unsicher) ? +g.unsicher : 1e-15;
    const regel = g.komplex ? (+g.sIm > u ? "instabil" : "an der Grenze") : rand > u ? "stabil" : rand < -u ? "instabil" : "an der Grenze";
    if (g.urteil === "stabil" && !stabilNachS) p_.push(`„stabil“, aber s ${s1} / ${s2}, komplex ${!!g.komplex}, Rand ${rand}`);
    if (["stabil", "instabil", "an der Grenze"].includes(g.urteil) && g.urteil !== regel) p_.push(`„${g.urteil}“, nach der Regel „${regel}“ (Rand ${rand}, unsicher ${u})`);
    if (!["stabil", "instabil", "an der Grenze"].includes(g.urteil)) p_.push(`unbekanntes Urteil ${g.urteil}`);
    if (b && gleich(g.m3, s0)) { if (g.kennung && g.kennung !== b.kennung) {
      // An der Listenmasse sind die Anfangswerte der Liste der direktere Beweis der Identität als das
      // daraus abgeleitete Bahnwort: bei enger Begegnung liest die Rechnung eine fast streifende Syzygie
      // mal mit, mal ohne (14.11.2026: I.B-33@2, Begegnung 4,5e-5 — a, b auf 1e-10 wie die Liste, T auf
      // 2,7e-9, Kennung dennoch anders). Stimmen a, b, T auf Listengenauigkeit: Hinweis; sonst Verstoß.
      const da = Math.abs(+g.a - b.a), db = Math.abs(+g.b - b.b), dT = Math.abs(+g.T - b.T);
      if (da <= 1e-9 && db <= 1e-9 && dT <= 1e-8 * b.T) W("I", `${d} bei m3 ${g.m3}: Kennung ${g.kennung} statt ${b.kennung}, Anfangswerte aber wie die Liste (Δa ${da.toExponential(1)}, Δb ${db.toExponential(1)}, ΔT ${dT.toExponential(1)}) — dieselbe Bahn, Wort anders gelesen`);
      else pI.push(`Kennung ${g.kennung} statt ${b.kennung} an der Listenmasse (Δa ${da.toExponential(1)}, Δb ${db.toExponential(1)}, ΔT ${dT.toExponential(1)})`); } }
    else if (P.length > 1) {
      let i = P.findIndex(p => p.m3 >= g.m3); if (i <= 0) i = 1; const p = P[i - 1], q = P[i] || p, t = (g.m3 - p.m3) / ((q.m3 - p.m3) || 1);
      if (Number.isFinite(+g.Ts) && Number.isFinite(p.Ts) && Number.isFinite(q.Ts)) { const ts = p.Ts + t * (q.Ts - p.Ts); if (Math.abs(+g.Ts / ts - 1) > 1e-3) pI.push(`T* ${(+g.Ts).toFixed(4)} statt ${ts.toFixed(4)} (andere Bahn?)`); }
      if (!gleich(g.m3, 1) && g.kennung && p.kennung && q.kennung && g.kennung !== p.kennung && g.kennung !== q.kennung) pI.push(`Kennung ${g.kennung} weder wie der Nachbar links (${p.kennung}) noch rechts (${q.kennung})`);
    }
    g._gut = !p_.length && !pI.length;   // Güte (G) und Identität (I) getrennt gemeldet
    if (p_.length || pI.length) Z.gueteVerletzt++;
    if (p_.length) H("G", `${d} bei m3 ${g.m3}: ${p_.join("; ")}`);
    if (pI.length) H("I", `${d} bei m3 ${g.m3}: ${pI.join("; ")}`);
    if (g.urteil === "stabil") { Z.stabil++; lauf.stabil += l; if (rand < 1e-6) Z.haaresbreite++; } else if (g.urteil === "instabil") Z.instabil++; else Z.grenze++;
  }
}

if (SCHLUSS && Z.keineAusgabe) H("D", `${Z.keineAusgabe} Proben ohne Ergebnis („keine Ausgabe“: Rechenprozess gestorben) — bei der Schlussprüfung nicht zulässig, nachrechnen`);
// jede fortgesetzte Familie braucht eine angenommene Probe an ihrer Listenmasse (20.11.2026, Prüfbericht H3: sechs
// Kandidaten hatten keine — 6d nahm Kandidaten aus, und die Wege der Kandidaten probten dort nicht)
const ohneListenprobe = [...fam].filter(([, e]) => e.R && e.R.start && e.R.richtungen && !(e.G || []).some(g => g.ok && gleich(g.m3, e.R.start.m3))).map(([d]) => d);
if (ohneListenprobe.length) (SCHLUSS ? H : W)("D", `${ohneListenprobe.length} fortgesetzte Familien ohne angenommene Probe an ihrer Listenmasse: ${ohneListenprobe.slice(0, 8).join(" ")}`);
if (SCHLUSS && laeuft.length) H("D", `${laeuft.length} Familien im Zustand „läuft“ bei der Schlussprüfung: ${laeuft.slice(0, 6).join(" ")}`);

// ── Urteile von Li, Jing & Liao (Zusatzdaten, nur lokal; Druckfehler „I:C“ mitgelesen) ──
const LJL = new Map();
if (existsSync(join(Q, "liliao-2018-zusatz.txt"))) {
  const t = readFileSync(join(Q, "liliao-2018-zusatz.txt"), "latin1").split(/\r?\n/).join(" ");
  const re = /(I{1,2})[.:]([A-D])\s+i:c:\s+(\d+)\s+\(([\d.]+)\)\s+[\d.]+\s+[\d.]+\s+[\d.]+\s+[\d.]+\s+\d+\s+([SMU])\s/g; let m;
  while ((m = re.exec(t))) LJL.set(`${m[1]}.${m[2]}-${m[3]}-${+m[4]}`, m[5]);
  if (LJL.size !== 1349) H("K", `Zusatzdaten von 2018: ${LJL.size} statt 1349 Zeilen gelesen`);
} else W("K", "Zusatzdaten von 2018 fehlen (quelle/liliao-2018-zusatz.txt) — Klassen a/b nicht unterscheidbar");

// ── K: Kandidaten, unabhängig neu ──
const eltern = new Map([...fam.keys()].map(d => [d, d]));
const finde = x => { while (eltern.get(x) !== x) x = eltern.get(x); return x; };
// „lage“ zählt mit (20.11.2026, Prüfbericht H1): gleiches T* auf acht Stellen heißt im Projekt „dieselbe Bahn, an
// anderer Stelle getroffen“ (quellen.mjs) — II.C-3-0.75 und II.C-8-0.5 trafen sich so und standen doppelt da
for (const [d, e] of fam) for (const l of (e.R && e.R.listen) || []) if (l.liliao && (l.liliao.stufe === "ort" || l.liliao.stufe === "lage") && l.liliao.naechster) {
  const y = dateiVon(l.liliao.naechster, l.m3); if (eltern.has(y)) eltern.set(finde(d), finde(y));
}
const EIGENE = (lies(join(E, "eigene-funde.json")) || { funde: [] }).funde;
// aus fremden Veröffentlichungen bekannt (16.11.2026: I.B-1 steht bei Li, Li & Liao 2021) — nicht neu
// zwei Arten (17.11.2026): ohne „art“ ein veröffentlichtes stabiles STÜCK — es zählt nicht als neu;
// „art: urteil“ ein fremdes Stabilitätsurteil an einer Listenmasse — es wirkt nur auf die Klasse (wie das S von
// Li, Jing & Liao: a, neu bleibt das Fenster), nie auf die Eichung (Abschnitt E liest LJL direkt)
const BEKANNT_ALLE = (lies(join(E, "bekannte-funde.json")) || { funde: [] }).funde;
const BEKANNT = BEKANNT_ALLE.filter(x => !x.art || x.art === "stueck");
const FREMDURTEIL = BEKANNT_ALLE.filter(x => x.art === "urteil");
for (const x of BEKANNT_ALLE) if (x.art && x.art !== "stueck" && x.art !== "urteil" && x.art !== "offen") H("K", `bekannte-funde.json: unbekannte Art „${x.art}“ bei ${x.datei}`);
for (const x of FREMDURTEIL) if (!x.datei || !(+x.m3 > 0) || !["S", "M", "U"].includes(x.urteil)) H("K", `bekannte-funde.json: Urteil unvollständig (${x.datei}@${x.m3}: ${x.urteil})`);
// Vasiljević, Raonić & Dmitrašinović (2023, New Astronomy 100, 101969): ihre Stabilitätsurteile zu den Listenbahnen, wie
// der Atlas threebodyorbits.com sie zuordnet (quelle/atlas/catalogue.json, von daten-holen.mjs geholt; stab_src
// „vasiljevic2023“, stable_pub). Am Tag der Veröffentlichung gefunden (21.11.2026): die Arbeit stand seit 16.11. in
// literatur.json als „wertet vorhandene Listen aus“ — ihre Urteile an den Listenmassen wirkten aber nicht auf die Klasse.
// Wirkt wie „art: urteil“, nur für „stabil“ (dann Klasse a statt b), nie auf die Eichung. Der Volltext war uns nicht
// zugänglich; die Zuordnung ist die des Atlas. Fehlt der Atlas, wird das gemeldet, nicht still übergangen.
const ATLAS = join(Q, "atlas", "catalogue.json");
let vasiljevic = 0; const VASIL = new Map();   // Listeneintrag → stabil laut Vasiljević u. a. 2023 (true/false), für die zweite Eichung
if (existsSync(ATLAS)) {
  for (const o of liesJson(ATLAS).orbits || []) {
    if (o.stab_src !== "vasiljevic2023" || typeof o.stable_pub !== "boolean") continue;
    const m = (o.masses || []).slice().sort((a, b) => a - b), c = String(o.code || "").match(/^(I{1,2}\.[A-D])\.(\d+)$/);
    const zweiGleich = m.length === 3 && (Math.abs(m[0] - m[1]) < 1e-9 * m[1] || Math.abs(m[1] - m[2]) < 1e-9 * m[2]);
    if (!c || !zweiGleich) continue;
    const mu = +(Math.abs(m[0] - m[1]) < 1e-9 * m[1] ? m[2] / m[0] : m[0] / m[1]).toFixed(6), d = `${c[1]}-${c[2]}-${mu}`;
    VASIL.set(d, o.stable_pub);
    if (!o.stable_pub) continue;
    FREMDURTEIL.push({ art: "urteil", datei: d, m3: mu, urteil: "S", kurz: "Vasiljević u. a. 2023 laut threebodyorbits.com" });
    vasiljevic++;
  }
} else W("K", "Atlas fehlt (quelle/atlas/catalogue.json, daten-holen.mjs) — Urteile von Vasiljević u. a. 2023 nicht berücksichtigt, Klassen a/b zu günstig");
const mitFremd = e => { const x = FREMDURTEIL.find(x => x.datei === e.name && gleich(+x.m3, e.m3)); return x ? { ...e, urteil: x.urteil, urteil2018: e.urteil, quelle: x.kurz || "fremde Quelle" } : e; };
const eigeneWoerter = EIGENE.filter(x => x.wort).map(x => ({ ...x, kennung: wortKennung(x.wort, [1, 1, 2]) }));
const BHHD = join(E, "bhh-lage"), BHH = new Map(existsSync(BHHD) ? readdirSync(BHHD).filter(n => n.endsWith(".json")).map(n => [n.slice(0, -5), lies(join(BHHD, n))]).filter(([, v]) => v) : []);
// gelistete Massen eines Zweigs
function gelistet(d, R) {
  const L = [{ m3: R.start.m3, name: d, urteil: LJL.get(d) || null }];
  for (const l of R.listen || []) {
    const ort = l.liliao && (l.liliao.stufe === "ort" || l.liliao.stufe === "lage");   // „lage“: dieselbe Bahn (H1)
    if (gleich(l.m3, 1)) { if (ort || hristovTreffer(l)) L.push({ m3: 1, name: ort ? l.liliao.naechster : "Sofia", urteil: "gleich" }); continue; }
    if (ort) L.push({ m3: l.m3, name: dateiVon(l.liliao.naechster, l.m3), urteil: LJL.get(dateiVon(l.liliao.naechster, l.m3)) || null });
  }
  return L.map(mitFremd);
}
const kandidaten = [];
for (const [d, e] of fam) {
  if (!e.G || !e.R || !e.R.richtungen || !e.P) continue;
  const s0 = e.R.start.m3, treffer = e.R.listen || [], b = KAT.get(d);
  const trefferBei = m3 => treffer.find(l => gleich(l.m3, m3));
  const istNeu = g => g.ok && g._gut && g.urteil === "stabil" && !gleich(g.m3, s0) && (!LISTENMASSEN.some(m => gleich(m, g.m3))
    || ((trefferBei(g.m3) || {}).liliao?.stufe === "keine" && !(gleich(g.m3, 1) && hristovTreffer(trefferBei(g.m3)))));
  if (!e.G.some(istNeu)) continue;
  // neue stabile Probe an einer Listenmasse: auch kein Vielfaches einer Bahn dieser Liste
  for (const g of e.G.filter(g => istNeu(g) && LISTENMASSEN.some(m => gleich(m, g.m3)))) {
    for (const k of [1 / 3, 1 / 2, 1, 2, 3]) for (const x of KATL.filter(x => gleich(x.m[2], g.m3)))
      if (Math.abs(k * +g.Ts / x.Ts - 1) < 1e-6) H("K", `${d} bei m3 ${g.m3}: T*·${k.toFixed(3)} trifft die Listenbahn ${x.name} (${x.Ts}) — gelistet, nicht neu`);
  }
  const LM = gelistet(d, e.R);
  const G = e.G.filter(g => g.ok && g._gut).sort((x, y) => x.m3 - y.m3), stuecke = [];
  for (let i = 0; i < G.length; i++) {
    if (G[i].urteil !== "stabil" || (i > 0 && G[i - 1].urteil === "stabil")) continue;
    let j = i; while (j + 1 < G.length && G[j + 1].urteil === "stabil") j++;
    const S = G.slice(i, j + 1);
    if (S.some(istNeu)) {
      const lo = S[0].m3, hi = S[S.length - 1].m3, aL = i > 0 ? G[i - 1].m3 : null, aH = j + 1 < G.length ? G[j + 1].m3 : null;
      // Schließen darf einen Rand nur eine INSTABILE Gegenprobe (20.11.2026, Prüfbericht H2): „an der Grenze“ ist
      // die Schwelle 1e-15, kein Wechsel der Stabilität — I.B-4-4 lief von der Listenmasse 4 an mit positivem Rand
      // unter der Schwelle bis 4,4787 und hieß dann „c“, obwohl das Stück die glatte Fortsetzung der Listenbahn ist
      const gL = G.slice(0, i).filter(g => g.urteil === "instabil").pop(), gH = G.slice(j + 1).find(g => g.urteil === "instabil");
      const iL = gL ? gL.m3 : null, iH = gH ? gH.m3 : null;
      const reichweite = [e.R.richtungen.abwaerts.bis, e.R.richtungen.aufwaerts.bis];
      const innen = LM.filter(x => x.m3 >= lo - 1e-9 && x.m3 <= hi + 1e-9);
      // gelistete Masse in der Lücke zur instabilen Gegenprobe: unscharf, zählt wie „enthalten“
      const luecke = LM.filter(x => !innen.includes(x) && ((iL != null && x.m3 > iL && x.m3 < lo) || (iH != null && x.m3 > hi && x.m3 < iH)));
      // offener Rand: keine instabile Gegenprobe, aber die Fortsetzung reicht weiter, und dort ist der Zweig gelistet
      const offen = LM.filter(x => !innen.includes(x) && ((iL == null && x.m3 < lo && x.m3 >= reichweite[0] - 1e-9) || (iH == null && x.m3 > hi && x.m3 <= reichweite[1] + 1e-9)));
      const nah = [...innen, ...luecke];
      const klasse = nah.some(x => x.urteil === "S") ? "a" : nah.some(x => x.urteil === "M" || x.urteil === "U") ? "b"
        : nah.some(x => x.urteil === "gleich") ? "g" : nah.length ? "b?" : offen.length ? "?" : "c";
      const woerter = [...new Set(S.filter(g => !gleich(g.m3, 1)).map(g => g.kennung))];
      const Lf = k => { const q = e.P.find(p => p.kennung === k); return q ? q.wortLaenge : null; };
      const neuR = S.filter(istNeu).map(g => +g.rand);
      stuecke.push({ von: lo, bis: hi, proben: S.length, klasse, gelistetIn: nah.map(x => `${x.name}@${x.m3} (${x.quelle ? `${x.urteil2018 || "?"}; ${x.quelle}: ${x.urteil}` : x.urteil || "?"})`), offenNeben: offen.map(x => `${x.name}@${x.m3}`),
        minRand: Math.min(...S.map(g => +g.rand)), maxRandNeu: Math.max(...neuR), aussen: [aL, aH], gegenprobe: [iL, iH],
        wortGewechselt: b ? woerter.some(k => k !== b.kennung) : null, woerter: woerter.map(k => ({ kennung: k, Lf: Lf(k) })) });
    }
    i = j;
  }
  const eigen = EIGENE.find(x => x.datei === d) || eigeneWoerter.find(x => stuecke.some(s => s.woerter.some(w => w.kennung === x.kennung)));
  // aus der Literatur bekannte STÜCKE (nicht Familien: I.B-1 hat bei 0,96 … 1,03 ein bekanntes Fenster, aber
  // auch Stücke bei 0,55 … 0,59 und 1,19 … 1,23 außerhalb des Katalogs — 16.11.2026). Ein Eintrag gilt für
  // alle Listeneinträge derselben Familie und jedes Stück, das seinen Bereich von … bis berührt.
  for (const s of stuecke) { const x = BEKANNT.find(x => (x.datei === d || finde(x.datei) === finde(d)) && s.von <= x.bis && s.bis >= x.von); if (x) s.bekannt = x.wo; }
  const ks = stuecke.filter(s => !s.bekannt).map(s => s.klasse);
  kandidaten.push({ datei: d, familie: finde(d), listenmasse: s0, eigen: eigen ? eigen.wo : null, bekannt: ks.length ? null : "alle stabilen Stücke aus der Literatur bekannt", stuecke,
    klasse: !ks.length ? "bekannt" : ks.includes("c") ? "c" : ks.includes("?") ? "?" : ks.includes("b") ? "b" : ks.includes("b?") ? "b?" : ks.includes("a") ? "a" : "g",
    bhh: BHH.get(d) || null });
}
// gegen liste-auswerten: dieselben Kandidaten, dieselben Kennzahlen
const familien = new Map(); for (const k of kandidaten) familien.set(k.familie, (familien.get(k.familie) || []).concat(k));
const AW = lies(join(E, "listenfortsetzung-auswertung.json"));
if (AW) {
  const a = new Set(AW.kandidaten.map(k => k.datei)), b = new Set(kandidaten.map(k => k.datei));
  const nurA = [...a].filter(x => !b.has(x)), nurB = [...b].filter(x => !a.has(x));
  if (nurA.length || nurB.length) H("K", `Kandidaten weichen von liste-auswerten ab — nur dort: ${nurA.join(" ") || "–"}; nur hier: ${nurB.join(" ") || "–"} (liste-auswerten neu laufen lassen?)`);
  const z = AW.zahl || {}, soll = { familien: fortgesetzt, genauPunkte: Z.eintraege - lauf.eintraege, genauAngenommen: Z.angenommen - lauf.angenommen, genauStabil: Z.stabil - lauf.stabil, kandidatenFamilien: familien.size };
  const ab = Object.entries(soll).filter(([k, v]) => z[k] !== v).map(([k, v]) => `${k} dort ${z[k]}, hier ${v}`);
  if (ab.length) H("Z", `Kennzahlen weichen von liste-auswerten ab: ${ab.join("; ")} (liste-auswerten neu laufen lassen?)`);
} else W("K", "keine Auswertung (listenfortsetzung-auswertung.json) zum Vergleich");
const eigeneFam = new Set(kandidaten.filter(k => k.eigen).map(k => k.familie));
const rang = { c: 0, "?": 1, b: 2, "b?": 3, a: 4, g: 5, bekannt: 6 };
const klasseFam = new Map(); for (const [f, L] of familien) klasseFam.set(f, L.map(k => k.klasse).sort((x, y) => rang[x] - rang[y])[0]);
// eine Familie gilt als bekannt, wenn ALLE ihre stabilen Stücke aus der Literatur bekannt sind
const bekannteFam = new Set([...familien].filter(([f, L]) => !eigeneFam.has(f) && L.every(k => k.bekannt)).map(([f]) => f));
const bekannteStuecke = kandidaten.reduce((n, k) => n + k.stuecke.filter(s => s.bekannt).length, 0);
// für die Zeile „dazu … bekannte Stücke in neuen Familien“ nur Stücke in Familien, die nicht ganz bekannt sind
// (17.11.2026: mit I.A-68-0.5 als bekannter Familie zählte die Zeile deren Stück fälschlich mit)
const bekannteStueckeNeu = kandidaten.filter(k => !bekannteFam.has(k.familie)).reduce((n, k) => n + k.stuecke.filter(s => s.bekannt).length, 0);
// gegenüber der Literatur nicht prüfbar (21.11.2026, Felix: keine Mail an Li vor der Veröffentlichung): eine Familie
// mit einem Eintrag „art: offen“ in bekannte-funde.json zählt nicht als neu, sondern gesondert (I.B-3-2: erreicht die
// BHH-Startlage, die Daten des BHH-Katalogs von 2020 sind nicht öffentlich)
const OFFEN = BEKANNT_ALLE.filter(x => x.art === "offen");
const offeneFam = new Set([...familien.keys()].filter(f => !eigeneFam.has(f) && !bekannteFam.has(f) && OFFEN.some(x => finde(x.datei) === f)));
const neueFam = [...familien.keys()].filter(f => !eigeneFam.has(f) && !bekannteFam.has(f) && !offeneFam.has(f));
const proKlasse = k => neueFam.filter(f => klasseFam.get(f) === k).length;
const mitWortwechsel = kandidaten.filter(k => k.stuecke.some(s => s.wortGewechselt)).map(k => k.datei);
// neue Familien, deren neue stabile Proben alle nur um Haaresbreite stabil sind (Rand < 1e-6)
const nurHaar = neueFam.filter(f => familien.get(f).every(k => k.stuecke.every(s => s.maxRandNeu < 1e-6)));
for (const k of kandidaten) { if (!k.bhh) W("L", `BHH-Lage offen: ${k.datei}`); else if (k.bhh.urteil !== "nie in BHH-Startlage") W("L", `BHH-Lage ${k.bhh.urteil}: ${k.datei} (Katalogdaten vergleichen oder neu rechnen)`); }

// ── T: Proben mit bekannter Antwort ──
// die Wörter von 2018 liegen als quelle/ungleich.md vor (in git, Herkunft und Prüfsumme in quelle/HERKUNFT.json)
const WQ = join(Q, "ungleich.md");
if (existsSync(WQ)) {
  const s = readFileSync(WQ, "utf8"), re = /<th>([IV]+\.[A-C])<sup>.*?<\/sup><sub[^>]*>(\d+)<\/sub>\s*&nbsp;\(([\d.]+)\)<\/th>\s*<td>([A-Za-z]+)<\/td>/g;
  let m, n = 0, falsch = []; while ((m = re.exec(s))) { const b = KAT.get(`${m[1]}-${m[2]}-${+m[3]}`); if (!b) continue; n++; if (wortKennung(m[4], b.m) !== b.kennung) falsch.push(`${m[1]}-${m[2]}@${m[3]}`); }
  if (n < 1340 || falsch.length) H("T", `Wort → Kennung: ${n - falsch.length} von ${n} wie der Katalog${falsch.length ? "; falsch: " + falsch.slice(0, 5).join(" ") : ""}`);
  const w5 = (s.match(/I\.A<sup>.*?<\/sup><sub[^>]*>5<\/sub>\s*&nbsp;\(2\)<\/th>\s*<td>([A-Za-z]+)<\/td>/) || [])[1];
  const k5 = kandidaten.find(k => k.datei === "I.A-5-2");
  if (!w5 || !k5 || !k5.stuecke.some(st => st.woerter.some(w => w.kennung === wortKennung(w5, [1, 1, 2])))) H("T", "das Bahnwort von I.A-5 (2018) trifft I.A-5@2 nicht");
} else H("T", "Wörter von 2018 fehlen (quelle/ungleich.md, in git) — Probe Wort → Kennung nicht möglich");
// 21.11.2026: I.A-1-2 ist jetzt a (Vasiljević u. a. 2023 nennen I.A-1 bei m3 = 2 stabil, laut Atlas) — der Fall prüft
// damit, dass deren Urteile wirken; die Klasse b vertritt I.A-7-5 (2018 „instabil“, 2023 nicht stabil, bei uns stabil)
for (const [d, soll] of [["I.A-1-2", "a"], ["I.A-7-5", "b"], ["I.A-1-4", "c"], ["I.B-10-0.75", "a"]]) {
  const k = kandidaten.find(x => x.datei === d);
  if (!k) H("T", `bekannter Kandidat fehlt: ${d}`); else if (LJL.size && k.klasse !== soll) H("T", `Klasse von ${d} ist ${k.klasse}, erwartet ${soll}`);
}

// ── E: Eichung an Li, Jing & Liao (2018) — ihr Urteil je Listenbahn gegen unsere Probe an der
// Listenmasse; hier gerechnet, damit die Zahlen nie von Hand veralten (13.11.2026) ──
const eichung = { S: {}, M: {}, U: {}, widersprueche: [] };
for (const [d, urteil2018] of LJL) {
  const e = fam.get(d); if (!e || !e.G || !e.R) continue;
  const g = e.G.find(x => x.ok && gleich(x.m3, e.R.start.m3)); if (!g) continue;
  eichung[urteil2018][g.urteil] = (eichung[urteil2018][g.urteil] || 0) + 1;
  if ((urteil2018 === "S" && g.urteil !== "stabil") || (urteil2018 === "U" && g.urteil !== "instabil"))
    eichung.widersprueche.push({ bahn: d, sie: urteil2018, wir: g.urteil, s1: +g.s1, s2: +g.s2, rand: +g.rand });
}
// zweite Eichung (21.11.2026): Vasiljević u. a. 2023 laut Atlas („stabil“ / „nicht stabil“) gegen unsere Probe an der Listenmasse
const eichungVasiljevic = { stabil: {}, nichtStabil: {}, gesamt: VASIL.size, zugeordnetStabil: vasiljevic };
for (const [d, stabil] of VASIL) {
  const e = fam.get(d); if (!e || !e.G || !e.R) continue;
  const g = e.G.find(x => x.ok && gleich(x.m3, e.R.start.m3)); if (!g) continue;
  const z = eichungVasiljevic[stabil ? "stabil" : "nichtStabil"]; z[g.urteil] = (z[g.urteil] || 0) + 1;
}

// ── B: blinder Fleck (13.11.2026, ergebnisse/GRENZEN.md) — Stellen, gleich verteilt über die Länge der
// Fortsetzungsstrecken, an denen double nicht „stabil“ sagt (werkzeug/blinder-fleck.mjs), auf 30 Stellen
// geprobt. Lage jeder stabilen Stelle gegenüber der Karte, nach den nächsten Proben links und rechts in
// derselben Familie: „im Stück“ (beide stabil); „an engem Rand“ (eine stabil, die Klammer zwischen
// beiden höchstens 0,005 breit — so genau gibt die Karte Fensterränder an); „Rand offen“ (eine stabil,
// die Klammer breiter oder auf einer Seite ohne Probe — die Karte kennt den Rand dort nicht); „fern“
// (keine stabil — ein solches Stück hätte die Karte nicht gesehen). Blinder Fleck = Rand offen + fern.
// Die Nachbarn hält blinder-fleck.mjs beim Ziehen fest (p.nachbarn): danach legt der Nachlauf um
// stabile Treffer Fensterränder, aus der lebenden Datei verschwände der blinde Fleck fast ganz. Ohne
// festgehaltene Nachbarn (ältere Datei) aus der lebenden Datei, vermerkt als nachbarnLive. Anteile an
// den gerechneten Stellen, mit 95-%-Bereich nach Wilson. ──
let blinderFleck = null;
const BFS = lies(join(E, "blinder-fleck-stichprobe.json"));
if (BFS) {
  const wilson = (k, n) => { if (!n) return null; const q = k / n, z = 1.96, m = (q + z * z / (2 * n)) / (1 + z * z / n), h = z * Math.sqrt(q * (1 - q) / n + z * z / (4 * n * n)) / (1 + z * z / n); return [Math.max(0, m - h), Math.min(1, m + h)]; };
  const b = { n: BFS.punkte.length, laenge: BFS.laenge ?? null, gerechnet: 0, stabil: 0, imStueck: 0, engerRand: 0, randOffen: 0, fern: 0, blind: 0,
    instabil: 0, grenze: 0, fehl: 0, ausstehend: 0, stabilBei: [], blindBei: [] };
  const stich = new Map(); for (const p of BFS.punkte) { if (!stich.has(p.datei)) stich.set(p.datei, []); stich.get(p.datei).push(p.m3); }
  for (const p of BFS.punkte) {
    const e = fam.get(p.datei), G = e && e.G ? e.G : [], g = G.find(x => gleich(x.m3, p.m3));
    if (!g || (!g.ok && /keine Ausgabe/.test(g.grund || ""))) { b.ausstehend++; continue; }
    if (!g.ok || !g._gut) { b.fehl++; continue; }   // nicht angenommen, oder Güte/Identität verletzt (dann auch hart gemeldet)
    b.gerechnet++;
    if (g.urteil === "stabil") {
      b.stabil++; b.stabilBei.push(`${p.datei}@${p.m3}`);
      let links, rechts;
      if (p.nachbarn) ({ links, rechts } = p.nachbarn);
      else {
        b.nachbarnLive = true;
        const karte = G.filter(x => x.ok && x._gut && !stich.get(p.datei).some(m => gleich(m, x.m3)));
        links = karte.filter(x => x.m3 < p.m3).sort((x, y) => y.m3 - x.m3)[0]; rechts = karte.filter(x => x.m3 > p.m3).sort((x, y) => x.m3 - y.m3)[0];
      }
      const sL = !!(links && links.urteil === "stabil"), sR = !!(rechts && rechts.urteil === "stabil");
      const klammer = links && rechts ? Math.abs(rechts.m3 - links.m3) : Infinity;
      const lage = sL && sR ? "imStueck" : sL || sR ? (klammer <= 0.005 + 1e-12 ? "engerRand" : "randOffen") : "fern";
      b[lage]++;
      if (lage === "randOffen" || lage === "fern") { b.blind++; b.blindBei.push(`${p.datei}@${p.m3} (${lage})`); }
    } else if (g.urteil === "instabil") b.instabil++; else b.grenze++;
  }
  const anteil = k => (b.gerechnet ? k / b.gerechnet : null);
  Object.assign(b, { anteilStabil: anteil(b.stabil), bereichStabil: wilson(b.stabil, b.gerechnet),
    anteilBlind: anteil(b.blind), bereichBlind: wilson(b.blind, b.gerechnet),
    anteilFern: anteil(b.fern), bereichFern: wilson(b.fern, b.gerechnet), anteilRandOffen: anteil(b.randOffen), bereichRandOffen: wilson(b.randOffen, b.gerechnet) });
  blinderFleck = b;
}

// ── Bericht ──
const zahlen = { familienFortgesetzt: fortgesetzt, familienLaeuft: laeuft.length, proben: Z, andereFehlgruende: andereGruende, eichung, eichungVasiljevic, blinderFleck,
  kandidaten: { eintraege: kandidaten.length, familien: familien.size, eigeneFamilien: eigeneFam.size, bekannteFamilien: bekannteFam.size, bekannteStuecke, bekannteStueckeNeu, neueFamilien: neueFam.length,
    nichtPruefbar: offeneFam.size, nichtPruefbarFamilien: [...offeneFam],
    klasseA: proKlasse("a"), klasseB: proKlasse("b"), klasseBUnscharf: proKlasse("b?"), klasseG: proKlasse("g"), klasseC: proKlasse("c"), klasseOffen: proKlasse("?"),
    nurHaaresbreite: nurHaar.length, mitWortwechsel: mitWortwechsel.length, bhhGeprueft: kandidaten.filter(k => k.bhh).length } };
// Nebendatei mit Prozessnummer (schreibeSicher): zwei gleichzeitige Prüfläufe stießen sich sonst an einer
// festen pruefung.json.tmp (Code-Prüfung 15.11.2026, Randnotiz)
schreibeSicher(join(E, "pruefung.json"), JSON.stringify({ erzeugt: new Date().toISOString(), zahlen, hart, warn, kandidaten }, null, 1));
const K = zahlen.kandidaten;
console.log(`Familien fortgesetzt ${fortgesetzt}${laeuft.length ? `, ${laeuft.length} laufen` : ""}`);
console.log(`Proben ${Z.eintraege}: angenommen ${Z.angenommen} (stabil ${Z.stabil}, davon Haaresbreite ${Z.haaresbreite}; instabil ${Z.instabil}; an der Grenze ${Z.grenze}); keine Ausgabe ${Z.keineAusgabe} (werden neu gerechnet); andere Fehlschläge ${Z.andereFehl}; Güte verletzt ${Z.gueteVerletzt}`);
console.log(`Kandidaten: ${K.eintraege} Listeneinträge = ${K.familien} Familien; ${K.eigeneFamilien} schon veröffentlicht; ${K.bekannteFamilien ?? 0} aus der Literatur bekannt (dazu ${K.bekannteStueckeNeu ?? K.bekannteStuecke ?? 0} bekannte Stücke in neuen Familien); ${K.nichtPruefbar ? K.nichtPruefbar + " gegenüber der Literatur nicht prüfbar (" + K.nichtPruefbarFamilien.join(" ") + "); " : ""}neu ${K.neueFamilien}: c ${K.klasseC}, offen ${K.klasseOffen}, b ${K.klasseB}${K.klasseBUnscharf ? ` (+${K.klasseBUnscharf} ohne Urteil 2018)` : ""}, a ${K.klasseA}, g ${K.klasseG}; nur um Haaresbreite: ${K.nurHaaresbreite}; Wortwechsel: ${K.mitWortwechsel}; BHH-Lage geprüft: ${K.bhhGeprueft}`);
const zaehl = o => Object.entries(o).map(([k, v]) => `${k} ${v}`).join(", ") || "–";
console.log(`Eichung an Li, Jing & Liao (2018), deren Urteil → unseres an der Listenmasse: S → ${zaehl(eichung.S)} | U → ${zaehl(eichung.U)} | M → ${zaehl(eichung.M)}; Widersprüche bei S und U: ${eichung.widersprueche.map(w => `${w.bahn} (sie ${w.sie}, wir ${w.wir})`).join(", ") || "keine"}`);
if (blinderFleck) { const b = blinderFleck, pr = x => (100 * x).toFixed(1);
  console.log(`Blinder Fleck: ${b.gerechnet} von ${b.n} Stellen gerechnet${b.gerechnet ? `; stabil ${b.stabil} (${pr(b.anteilStabil)} %, 95 %: ${pr(b.bereichStabil[0])} bis ${pr(b.bereichStabil[1])} %): im Stück ${b.imStueck}, an engem Rand ${b.engerRand}, Rand offen ${b.randOffen}, fern ${b.fern}; blinder Fleck (Rand offen + fern) ${b.blind} (${pr(b.anteilBlind)} %, 95 %: ${pr(b.bereichBlind[0])} bis ${pr(b.bereichBlind[1])} %)` : ""}${b.fehl ? `; ${b.fehl} ohne Ergebnis` : ""}${b.ausstehend ? `; ${b.ausstehend} ausstehend` : ""}`); }
console.log(`harte Verstöße: ${hart.length}${hart.length ? "\n  " + hart.slice(0, 30).join("\n  ") : ""}`);
const wSonst = warn.filter(w => !w.startsWith("L")), wL = warn.filter(w => w.startsWith("L"));
console.log(`Hinweise: ${warn.length}${wSonst.length ? "\n  " + wSonst.slice(0, 12).join("\n  ") : ""}${wL.length ? `\n  L  BHH-Lage offen für ${wL.length} Kandidaten` : ""}`);
process.exit(hart.length ? 1 : 0);
