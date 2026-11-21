// dreikoerper/werkzeug/bhh-alle.mjs — BHH-Lage für alle Kandidaten (12.11.2026, Fehlersuche: die
// Literaturprüfung gegen die BHH-Kataloge von Li & Liao (2020) und Liao, Li & Yang (2022) war nur für
// I.A-5 bei m3 = 4 gerechnet; der Katalog von 2022 reicht umgerechnet bis m3 ≈ 0,83 hinab).
//
//   node werkzeug/bhh-alle.mjs [--abtastung 200000] [--teil i/n] [--nur datei,datei]
//
// Jede BHH-Bahn startet kollinear, Körper 3 in der Mitte, alle Geschwindigkeiten senkrecht zur
// Linie, Gesamtimpuls null. Kommt eine Bahn über eine Periode nie in eine solche Lage, kann sie in
// diesen Katalogen nicht stehen — auch ohne deren Daten.
// Je stabilem Stück eines Kandidaten (aus ergebnisse/pruefung.json) drei Proben: beide Enden und die
// mit dem größten Rand, je auf 30 Stellen (a, b, T). Jede Probe zweimal, mit N und 2N Teilschritten:
// stimmen Zahl der Syzygien und kleinster Längsanteil nicht überein, heißt sie „unklar“ (eine zu grobe
// Abtastung übersieht Syzygien — grob mit 4000 fand der Test 67 statt 74).
// Urteil je Probe: kleinster Längsanteil > 1e-3 → „nie in BHH-Startlage“; sonst „BHH-Startlage
// möglich“ (dann bleibt nur der Vergleich mit Katalogdaten). Ein Kandidat ist „nie“, wenn alle seine
// Proben „nie“ sind.
// Ergebnis je Kandidat in ergebnisse/bhh-lage/<datei>.json (getrennte Dateien: mehrere Prozesse mit
// --teil i/n schreiben nie dieselbe). Fertiges wird übersprungen; ablage/STOPP beendet nach dem
// laufenden Kandidaten.

import { readFileSync, existsSync, appendFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { setPriority, constants } from "node:os";
import { HIER, ladeKern } from "../quellen.mjs";
import { schreibeSicher } from "./sicher.mjs";

try { setPriority(constants.priority.PRIORITY_LOW); } catch { /* ohne Recht bleibt es normal */ }
const argv = process.argv.slice(2), arg = (n, v) => (argv.includes(n) ? argv[argv.indexOf(n) + 1] : v);
const N = +arg("--abtastung", 200000), NUR = arg("--nur", null) ? new Set(arg("--nur").split(",")) : null;
const [TI, TN] = (arg("--teil", "0/1")).split("/").map(Number);
const E = join(HIER, "ergebnisse"), O = join(E, "listenfortsetzung"), AUS = join(E, "bhh-lage"), STOPP = join(HIER, "ablage", "STOPP");
mkdirSync(AUS, { recursive: true });
const log = z => { const t = new Date().toLocaleTimeString("de-DE"); appendFileSync(join(HIER, "ablage", "bhh-alle.log"), `${t} [${TI}/${TN}] ${z}\n`); console.log(`${t} ${z}`); };
const K = ladeKern(), schritt = K.macheTaylor(), EB = K.EBENEN.euler;
const PR = JSON.parse(readFileSync(join(E, "pruefung.json"), "utf8"));

function lage(m3, a, b, T, n) {
  const m = [1, 1, m3], u = EB.anfang(a, b, m, new Float64Array(12)), z = new Float64Array(12), dt = T / n;
  const C = uu => { K.zuOrten(uu, m, z); return (z[0] - z[4]) * (z[3] - z[5]) - (z[1] - z[5]) * (z[2] - z[4]); };
  const bewerte = uu => { K.zuOrten(uu, m, z);
    const mitte = (z[0] - z[4]) * (z[2] - z[4]) + (z[1] - z[5]) * (z[3] - z[5]) < 0;
    const ex = z[2] - z[0], ey = z[3] - z[1], l = Math.hypot(ex, ey); let laengs = 0, gross = 0;
    for (let i = 0; i < 3; i++) { const vx = z[6 + 2 * i], vy = z[7 + 2 * i]; laengs = Math.max(laengs, Math.abs((vx * ex + vy * ey) / l)); gross = Math.max(gross, Math.hypot(vx, vy)); }
    return { mitte, anteil: laengs / gross }; };
  let c = C(u), min = Infinity, mitte = 0, alle = 0;
  for (let k = 0; k < n; k++) {
    const alt = Float64Array.from(u), cAlt = c;
    if (schritt(u, m, dt, 1e-16).art !== 0) return { fehler: "Integration brach ab" };
    c = C(u);
    if (cAlt === 0 || cAlt * c < 0) {
      let lo = 0, hi = dt;
      for (let j = 0; j < 40; j++) { const mid = (lo + hi) / 2, w = Float64Array.from(alt); schritt(w, m, mid, 1e-16); if (C(w) * cAlt > 0) lo = mid; else hi = mid; }
      // Gezählt wird auf [0, T). Die Bahn startet kollinear (C(0) = 0, oben über cAlt === 0 erfasst) und
      // kehrt bei T dorthin zurück; numerisch ist C(T) etwa ±1e-12, und je nach Vorzeichen zählte der
      // letzte Schritt die Startlage ein zweites Mal (13.11.2026: 21 Syzygien bei N, 20 bei 2N, bei
      // gleichem kleinstem Längsanteil → „unklar (Abtastung)“). Eine Nullstelle ganz am Ende des letzten
      // Schritts ist diese Startlage und wird übergangen.
      // 20.11.2026 (Prüfbericht der zweiten Sitzung, H8): die Toleranz war dt·1e-6 und schrumpfte mit
      // feinerer Abtastung, der Fehler von C(T) (±1e-10 … 1e-8) nicht — gemessen lag die doppelt gezählte
      // Startlage 1,2e-10 bis 1,2e-8 vor T. Jetzt feste Zeittoleranz gegen T: 1e-6·T. Die nächste echte
      // Syzygie lag in den geprüften Fällen 0,29 bis 0,62 Zeiteinheiten vor T. Mit der neuen Regel zählten
      // N und 2N dort gleich (170/170, 282/282, 338/338).
      if (T - (k * dt + (lo + hi) / 2) < 1e-6 * T) continue;
      const w = Float64Array.from(alt); schritt(w, m, (lo + hi) / 2, 1e-16); const r = bewerte(w); alle++;
      if (r.mitte) { mitte++; min = Math.min(min, r.anteil); }
    }
  }
  return { syzygien: alle, mitte, minAnteil: mitte ? min : null };
}
function urteilProbe(m3, a, b, T) {
  const r1 = lage(m3, a, b, T, N), r2 = lage(m3, a, b, T, 2 * N);
  if (r1.fehler || r2.fehler) return { r1, r2, urteil: "unklar (Integration)" };
  const gleich = r1.syzygien === r2.syzygien && r1.mitte === r2.mitte && (r1.minAnteil === null ? r2.minAnteil === null : Math.abs(r1.minAnteil - r2.minAnteil) <= 1e-6 * Math.max(1, r2.minAnteil));
  // Parität (13.11.2026): auf [0, T) ist die Zahl der Syzygien gerade — die Startlage ist eine einfache
  // Nullstelle von C, über eine Periode kehrt das Vorzeichen zurück. Ungerade heißt: ein Vorzeichen-
  // wechsel ging verloren oder wurde doppelt gezählt.
  if (!gleich || r1.syzygien % 2 || r2.syzygien % 2) return { r1, r2, urteil: "unklar (Abtastung)" };
  return { r1, r2, urteil: r2.minAnteil === null || r2.minAnteil > 1e-3 ? "nie in BHH-Startlage" : "BHH-Startlage möglich" };
}

PR.kandidaten.forEach((k, idx) => {
  if (idx % TN !== TI) return;
  if (NUR && !NUR.has(k.datei)) return;
  const ziel = join(AUS, k.datei + ".json");
  if (existsSync(ziel)) { try { if (JSON.parse(readFileSync(ziel, "utf8")).abtastung === N) return; } catch { /* neu rechnen */ } }
  if (existsSync(STOPP)) { if (!globalThis.__stopp) log("STOPP gefunden"); globalThis.__stopp = true; return; }
  const G = JSON.parse(readFileSync(join(O, k.datei + "-genau.json"), "utf8")).punkte.filter(g => g.ok && g.urteil === "stabil");
  const proben = [];
  for (const s of k.stuecke) {
    const S = G.filter(g => g.m3 >= s.von - 1e-12 && g.m3 <= s.bis + 1e-12).sort((x, y) => x.m3 - y.m3); if (!S.length) continue;
    const wahl = new Map(); for (const p of [S[0], S[S.length - 1], S.reduce((x, y) => (+y.rand > +x.rand ? y : x))]) wahl.set(p.m3, p);
    for (const p of wahl.values()) {
      const t0 = Date.now(), r = urteilProbe(+p.m3, +p.a, +p.b, +p.T);
      proben.push({ m3: +p.m3, stueck: [s.von, s.bis], ...r, sekunden: Math.round((Date.now() - t0) / 1000) });
      log(`${k.datei} bei m3 ${(+p.m3).toFixed(5)}: ${r.urteil}${r.r2 && r.r2.minAnteil != null ? `, kleinster Längsanteil ${r.r2.minAnteil.toExponential(2)}` : ""} (${r.r2 ? r.r2.mitte : "–"} von ${r.r2 ? r.r2.syzygien : "–"} Syzygien mit Körper 3 in der Mitte)`);
    }
  }
  const urteil = proben.length && proben.every(p => p.urteil === "nie in BHH-Startlage") ? "nie in BHH-Startlage"
    : proben.some(p => p.urteil === "BHH-Startlage möglich") ? "BHH-Startlage möglich" : "unklar";
  schreibeSicher(ziel, JSON.stringify({ datei: k.datei, abtastung: N, erzeugt: new Date().toISOString(), proben, urteil }, null, 1));
});
log(`Teil ${TI}/${TN} fertig`);
