// dreikoerper/suche.mjs — die Suchmaschine.
//
//   node suche.mjs --name <lauf> [--ebene euler|fall] [--m 1,1,1]
//                  [--art halb|voll] [--sicht a0,a1,b0,b1] [--raster 512]
//                  [--tmax 40] [--tol 1e-8] [--schwelle 0.3] [--max 20000]
//                  [--baender 6] [--tmin 0]
//
// Zwei Arten zu suchen:
//
//   halb  Über Umkehrpunkte (kern.js, Abschnitt 11). Die Karte misst, wie nah
//         die Bahn bis tmax/2 einer Fixmenge der umkehrenden Symmetrien kommt;
//         Newton löst dort drei Gleichungen in drei Unbekannten. Findet nur
//         symmetrische Bahnen, die aber auch bei großer Empfindlichkeit.
//         Braucht einen symmetrischen Start: Euler-Ebene mit m1 = m2, oder
//         freier Fall.
//   voll  Über den Wiederkehrabstand nach der ganzen Periode. Findet jede
//         Bahn, aber nur zahme (|λ| bis etwa 1e3): der Trichter ist 1/|λ|
//         breit.
//
// Danach für beide dasselbe: Prüfkette je Fund (Grundperiode, Stabilität,
// Topologie, Gegenprobe mit dem zweiten Verfahren), Abgleich mit den
// Katalogen, und die Gegenrichtung — welche bekannten Bahnen im Suchfenster
// der Lauf NICHT gefunden hat.
//
// Ergebnis: ergebnisse/<lauf>.json (alle Zahlen), <lauf>.md (Bericht),
// <lauf>.png (Karte mit Marken). Nichts davon wird von Hand nachgetragen.

import { ladeKern } from "./quellen.mjs";
import { macheSchwarm } from "./schwarm.mjs";
import { abschliessen } from "./abschluss.mjs";

const K = ladeKern();
const argv = process.argv.slice(2);
const hol = (f, v) => { const i = argv.indexOf("--" + f); return i >= 0 && argv[i + 1] !== undefined ? argv[i + 1] : v; };

const P = {
  name: hol("name", "lauf"),
  ebene: hol("ebene", "euler"),
  m: hol("m", "1,1,1").split(",").map(Number),
  raster: +hol("raster", 512),
  tmax: +hol("tmax", 40),
  tol: +hol("tol", 1e-8),
  max: +hol("max", 20000),
  baender: +hol("baender", 6),     // Zeitbänder: je Band eine eigene Karte der Talsohlen
  tmin: +hol("tmin", 0),           // Perioden darunter werden nicht verfolgt
};
const startZiel = K.startZiel(P.ebene, P.m);
P.art = hol("art", startZiel >= 0 ? "halb" : "voll");
if (P.art === "halb" && startZiel < 0) { console.error("Die Halbperioden-Suche braucht einen symmetrischen Start: Euler-Ebene mit m1 = m2 oder freier Fall. Nimm --art voll."); process.exit(2); }
P.schwelle = +hol("schwelle", P.art === "halb" ? 0.3 : 1);
P.sicht = hol("sicht", K.EBENEN[P.ebene].sicht.join(",")).split(",").map(Number);
const [a0, a1, b0, b1] = P.sicht, N = P.raster, HALB = P.art === "halb";
const sag = t => process.stderr.write(t + "\n");

const schwarm = macheSchwarm();
const zeiten = {};
const ach = K.EBENEN[P.ebene];

/* ── 1 · Karte ─────────────────────────────────────────────────────────── */
let t0 = Date.now(), letzte = 0;
sag(`Karte ${N}×${N} (${P.art}), ${ach.name}, m = ${P.m.join("/")}, Perioden bis ${P.tmax}, auf ${schwarm.faeden} Fäden`);
const d = new Float32Array(N * N).fill(Infinity), art = new Uint8Array(N * N);
const NB = P.baender, ziele = HALB ? K.erlaubteZiele(P.m) : [], NZ = K.ZIELE.length, W = HALB ? NZ * NB : NB;
// Je Punkt W Werte: voll — das tiefste Minimum je Zeitband; halb — je Ziel und Zeitband
const wd = new Float32Array(N * N * W), wt = new Float32Array(N * N * W);
const tF = HALB ? null : new Float32Array(N * N);
await schwarm.alle(Array.from({ length: N }, (_, j) => ({
  art: HALB ? "zeileHalb" : "zeile", zeile: j, ebene: P.ebene, m: P.m, nx: N, a0, a1, b: b0 + (b1 - b0) * (j + 0.5) / N,
  Tmax: HALB ? P.tmax / 2 : P.tmax, tol: P.tol, maxSchritte: Math.round(4000 * P.tmax), baender: NB
})), (r, _, n) => {
  if (r.fehler) throw new Error(r.fehler);
  art.set(r.art, r.zeile * N);
  if (HALB) {
    wd.set(r.d, r.zeile * N * W); wt.set(r.t, r.zeile * N * W);
    for (let i = 0; i < N; i++) { let mn = Infinity; for (let q = 0; q < W; q++) { const v = r.d[i * W + q]; if (v < mn) mn = v; } d[r.zeile * N + i] = mn; }
  } else {
    d.set(r.d, r.zeile * N); tF.set(r.t, r.zeile * N);
    wd.set(r.bd, r.zeile * N * W); wt.set(r.bt, r.zeile * N * W);
  }
  if (Date.now() - letzte > 15000) { letzte = Date.now(); sag(`  Zeile ${n}/${N}`); }
});
zeiten.karte = (Date.now() - t0) / 1000;
const arten = [0, 0, 0, 0, 0]; for (const x of art) arten[x]++;

/* ── 2 · Kandidaten ────────────────────────────────────────────────────── */
// Talsohlen in jeder der W Teilkarten für sich. Ein Punkt kann so der Keim
// mehrerer Bahnen sein — sein bestes Minimum allein verdeckt die übrigen.
const kand = [], proKarte = new Array(W).fill(0);
const tSchwelle = HALB ? P.tmin / 2 : P.tmin;
for (let q = 0; q < W; q++) {
  if (HALB && !ziele.includes(Math.floor(q / NB))) continue;
  for (let j = 1; j < N - 1; j++) for (let i = 1; i < N - 1; i++) {
    const o = (j * N + i) * W + q, w = wd[o], T = wt[o];
    if (!(w < P.schwelle) || !(T > tSchwelle)) continue;
    let tal = true;
    for (let v = -1; v <= 1 && tal; v++) for (let p = -1; p <= 1; p++) if ((p || v) && wd[((j + v) * N + i + p) * W + q] < w) { tal = false; break; }
    if (tal) { kand.push({ i, j, d: w, T, q }); proKarte[q]++; }
  }
}
kand.sort((x, y) => x.d - y.d);
const alleKand = kand.length;
kand.length = Math.min(kand.length, P.max);

/* ── 3 · Prüfkette ─────────────────────────────────────────────────────── */
t0 = Date.now(); letzte = 0;
sag(`${alleKand} Talsohlen, geprüft werden die ${kand.length} tiefsten`);
const zelle = Math.max((a1 - a0) / N, (b1 - b0) / N);
const erg = await schwarm.alle(kand.map(k => {
  const a = a0 + (a1 - a0) * (k.i + 0.5) / N, b = b0 + (b1 - b0) * (k.j + 0.5) / N;
  return HALB ? { art: "kandidatHalb", ebene: P.ebene, m: P.m, a, b, tau: k.T, ziel: Math.floor(k.q / NB), d: k.d }
              : { art: "kandidat", ebene: P.ebene, m: P.m, a, b, T: k.T, d: k.d, schritt: zelle / 2 };
}), (_, __, n) => { if (Date.now() - letzte > 15000) { letzte = Date.now(); sag(`  Kandidat ${n}/${kand.length}`); } });
zeiten.pruefkette = (Date.now() - t0) / 1000;
await schwarm.ende();

const ausnahmen = erg.filter(r => r.fehler);
const konv = erg.filter(r => !r.fehler && r.ok);
// Was aus den Kandidaten wurde
const verbleib = { umkehrpunktVerfehlt: 0, nurBisAufDrehung: 0, geschlossen: konv.length, nichtKonvergiert: 0 };
const proZiel = {};
for (let k = 0; k < erg.length; k++) {
  const r = erg[k]; if (r.fehler) continue;
  if (HALB) {
    const zn = K.ZIELE[Math.floor(kand[k].q / NB)], e = (proZiel[zn] ||= { kandidaten: 0, getroffen: 0, geschlossen: 0 });
    e.kandidaten++;
    if (r.ok) { e.getroffen++; e.geschlossen++; }
    else if (/Drehung/.test(r.grund || "")) { e.getroffen++; verbleib.nurBisAufDrehung++; }
    else verbleib.umkehrpunktVerfehlt++;
  } else if (!r.ok) verbleib.nichtKonvergiert++;
}
// Wie tief muss das Tasten kommen, damit Newton greift (nur --art voll)?
const dekaden = {};
for (const r of erg) {
  if (r.fehler || !r.vorlauf) continue;
  const k = Math.max(-8, Math.min(0, Math.ceil(Math.log10(r.vorlauf.d))));
  (dekaden[k] ||= [0, 0, 0])[0]++; if (r.ok) dekaden[k][1]++; dekaden[k][2] += r.sekunden || 0;
}

// Ab hier dasselbe wie in nachbereiten.mjs: zusammenlegen, Urteil, Abgleich
// mit den Katalogen, Gegenrichtung, JSON, Bericht, Karte.
const s = abschliessen({ P, zeiten, faeden: schwarm.faeden, karte: { arten, d, N },
  kandidaten: { talsohlen: alleKand, geprueft: kand.length, konvergiert: konv.length, ausnahmen: ausnahmen.length, verbleib, proZiel, dekaden, ziele: ziele.length },
  konv, ausnahmen });
process.exit(s.ausnahmen ? 1 : 0);
