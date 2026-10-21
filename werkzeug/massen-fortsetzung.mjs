// dreikoerper/werkzeug/massen-fortsetzung.mjs — die stabile Bahn bei 1/1/4
// über die dritte Masse fortsetzen (21.10.2026).
//
//   node werkzeug/massen-fortsetzung.mjs
//
// Zwei Fragen: (a) über welchem Bereich von m₃ bleibt dieser Zweig stabil,
// und (b) erreicht er eine Masse, für die es eine Liste gibt (0,5 0,75 1 2
// 5 8 10), und steht er dort in der Liste? Ein Ja zu (b) hieße: die Bahn bei
// 1/1/4 ist die Fortsetzung einer bekannten.
//
// Verfahren: Fortsetzung im Parameter m₃ (m₁ = m₂ = 1, Euler-Ebene). Je Schritt
// Vorhersage linear aus den letzten zwei Punkten, Korrektur mit dem Fundprüfer
// des Kerns (Newton über die ganze Periode, double), dazu Stabilität, Wort,
// engste Begegnung. Ein Punkt gilt, wenn Newton annimmt, die Korrektur klein
// bleibt und keine kürzere Grundperiode auftaucht. Sonst Schritt halbieren;
// unter 1e-4 Ende in dieser Richtung — „bricht ab“, nicht „endet“: eine
// Umkehr des Zweigs (Falte) sieht für dieses Verfahren genauso aus.
// Ein Wechsel der Kennung wird festgehalten, nicht als Ende gewertet.
//
// Jeder angenommene Punkt geht sofort nach ergebnisse/fortsetzung-1-1-4.json.

import { writeFileSync } from "node:fs";
import { join } from "node:path";
import { HIER, ladeKern, ladeKatalog, gleicheAb, ladeGross } from "../quellen.mjs";

const K = ladeKern(), pruefe = K.macheFundpruefer(), KAT = ladeKatalog();
const AUS = join(HIER, "ergebnisse", "fortsetzung-1-1-4.json");
const START = { m3: 4, a: 0.80329455331149897894751545304123, b: 1.43593335078306727053457398659518, T: 53.25485430443248007068935995289679 };
const GRENZEN = [0.5, 10], H0 = 0.01, HMIN = 1e-4, HMAX = 0.05, SCHRITTE_MAX = 4000;
const LISTENMASSEN = [0.5, 0.75, 1, 2, 5, 8, 10];

const bericht = { start: START, kalibrierung: {}, richtungen: {}, listen: [], grenzen: [], ereignisse: [] };
const sichern = () => writeFileSync(AUS, JSON.stringify(bericht, null, 1));

function punkt(m3, a, b, T) {
  const t0 = Date.now(), p = pruefe("euler", [1, 1, m3], a, b, T, {});
  if (!p.ok) return null;
  return { m3, a: p.a, b: p.b, T: p.T, Ts: p.Ts, s1: p.s1, s2: p.s2, komplex: !!p.sKomplex, stabil: p.stabil, rand: p.rand,
           symplektik: p.symplektik, rMin: p.rMin, kennung: p.kennung, wortLaenge: (p.wort || "").length, rest: p.rest,
           teiler: p.teiler || 1, sek: (Date.now() - t0) / 1000 };
}
const stabilNach = q => q.stabil === true ? "stabil" : q.stabil === false ? "instabil" : "offen";

/* ── 1 · Eichung ── */
const p0 = punkt(4, START.a, START.b, START.T);
if (!p0) throw new Error("Startpunkt nimmt Newton nicht an");
bericht.kalibrierung.start = { da: p0.a - START.a, db: p0.b - START.b, dT: p0.T - START.T, s1: p0.s1, s2: p0.s2, sek: p0.sek };
console.log(`Eichung m3=4: Δa ${p0.a - START.a}, Δb ${p0.b - START.b}, ΔT ${p0.T - START.T}, s ${p0.s1.toFixed(6)} / ${p0.s2.toFixed(6)}, ${p0.sek.toFixed(1)} s je Punkt`);
{
  let q = p0;
  for (const m3 of [4.02, 4.04, 4.06, 4.08, 4.1, 4.08, 4.06, 4.04, 4.02, 4]) { const r = punkt(m3, q.a, q.b, q.T); if (!r) { q = null; break; } q = r; }
  bericht.kalibrierung.hinUndZurueck = q ? { da: q.a - p0.a, db: q.b - p0.b, dT: q.T - p0.T } : "abgebrochen";
  console.log("hin und zurück 4 → 4,1 → 4:", JSON.stringify(bericht.kalibrierung.hinUndZurueck));
}
sichern();

/* ── 2 · Fortsetzung in beide Richtungen ── */
function abgleich(q) {
  const fund = { ebene: "euler", m: [1, 1, q.m3], a: q.a, b: q.b, Ts: q.Ts, kennung: q.kennung };
  const g = gleicheAb(fund, KAT);
  const selbe = KAT.bahnen.filter(k => k.ebene === "euler" && Math.abs(k.m[2] - q.m3) < 1e-12 && k.m[0] === 1 && k.m[1] === 1);
  const ts = selbe.map(k => k.Ts);
  const zeile = { m3: q.m3, a: q.a, b: q.b, T: q.T, Ts: q.Ts, s1: q.s1, s2: q.s2, stabil: stabilNach(q), kennung: q.kennung,
                  liliao: { stufe: g.stufe, naechster: g.eintrag && g.eintrag.name, abstand: g.abstand, listeBahnen: selbe.length,
                            listeTsVonBis: ts.length ? [Math.min(...ts), Math.max(...ts)] : null } };
  if (q.m3 === 1) {
    const G = ladeGross().euler, t = G.mitTs(q.Ts, 2e-8), n = G.naechster(q.a, q.b);
    let tsMax = 0; for (let i = 0; i < G.n; i++) tsMax = Math.max(tsMax, G.w[4 * i + 3]);
    zeile.hristov = { mitTs: t, naechsterOrt: n && { abstand: n.abstand, Ts: n.Ts }, eintraege: G.n, tsMax, gitter: "|a|, |b| bis 1,05" };
  }
  return zeile;
}

for (const richtung of [-1, 1]) {
  const pts = [p0];
  let h = H0, grund = "Grenze des Bereichs erreicht", schritte = 0;
  const listenOffen = LISTENMASSEN.filter(x => (richtung < 0 ? x < 4 : x > 4)).sort((x, y) => richtung * (x - y));
  while (schritte++ < SCHRITTE_MAX) {
    const l = pts[pts.length - 1], v = pts.length > 1 ? pts[pts.length - 2] : null;
    let m3 = l.m3 + richtung * h;
    const ziel = listenOffen[0];
    if (ziel !== undefined && richtung * (m3 - ziel) >= 0) m3 = ziel;                // Listenmasse genau treffen
    if (m3 < GRENZEN[0] - 1e-12 || m3 > GRENZEN[1] + 1e-12) break;
    const f = v ? (m3 - l.m3) / (l.m3 - v.m3) : 0;
    const vor = { a: l.a + f * (l.a - (v ? v.a : l.a)), b: l.b + f * (l.b - (v ? v.b : l.b)), T: l.T + f * (l.T - (v ? v.T : l.T)) };
    const q = punkt(m3, vor.a, vor.b, vor.T);
    const sprung = q ? Math.hypot(q.a - vor.a, q.b - vor.b) + Math.abs(q.T - vor.T) / Math.max(1, l.T) : Infinity;
    const gut = q && q.teiler === 1 && sprung < 0.02 + 2 * h && Math.abs(q.Ts / l.Ts - 1) < 0.05 + 5 * h;
    if (!gut) {
      h /= 2;
      if (h < HMIN) { grund = q ? (q.teiler > 1 ? `kürzere Grundperiode (Teiler ${q.teiler})` : `Korrektur zu groß (${sprung.toExponential(1)})`) : "Newton nimmt nicht an"; break; }
      continue;
    }
    if (q.kennung !== l.kennung) bericht.ereignisse.push({ m3, art: "Kennung wechselt", von: l.kennung, nach: q.kennung, rMin: q.rMin });
    if (stabilNach(q) !== stabilNach(l)) bericht.grenzen.push({ von: { m3: l.m3, stabil: stabilNach(l), s1: l.s1, s2: l.s2, a: l.a, b: l.b, T: l.T },
                                                                  bis: { m3: q.m3, stabil: stabilNach(q), s1: q.s1, s2: q.s2, a: q.a, b: q.b, T: q.T } });
    pts.push(q);
    if (ziel !== undefined && m3 === ziel) { bericht.listen.push(abgleich(q)); listenOffen.shift(); console.log(`  Listenmasse ${ziel}: ${JSON.stringify(bericht.listen[bericht.listen.length - 1].liliao)}`); }
    if (sprung < 1e-3) h = Math.min(HMAX, h * 1.5);
    bericht.richtungen[richtung < 0 ? "abwaerts" : "aufwaerts"] = { grund: "läuft", punkte: pts.slice(1) };
    if (pts.length % 20 === 0) { sichern(); console.log(`  m3 ${q.m3.toFixed(4)}  T ${q.T.toFixed(4)}  T* ${q.Ts.toFixed(4)}  s ${q.s1.toFixed(4)} / ${q.s2.toFixed(4)}  ${stabilNach(q)}  rMin ${q.rMin.toExponential(1)}  h ${h.toExponential(1)}`); }
  }
  const letzt = pts[pts.length - 1];
  bericht.richtungen[richtung < 0 ? "abwaerts" : "aufwaerts"] = { grund, bis: letzt.m3, punkte: pts.slice(1) };
  sichern();
  console.log(`${richtung < 0 ? "abwärts" : "aufwärts"}: bis m3 = ${letzt.m3}, ${pts.length - 1} Punkte — ${grund}`);
}
console.log(`Grenzen der Stabilität (in double): ${bericht.grenzen.length}; Kennungswechsel: ${bericht.ereignisse.length}; Listenmassen erreicht: ${bericht.listen.map(l => l.m3).join(", ") || "keine"}`);
sichern();
