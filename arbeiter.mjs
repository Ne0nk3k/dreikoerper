// dreikoerper/arbeiter.mjs — ein Rechenfaden des Schwarms.
//
// Bekommt Aufträge { nr, art, ... } und schickt { nr, ergebnis } zurück.
// Alle schweren Objekte (Löser, Puffer) entstehen einmal je Faden. Die
// eigentliche Arbeit steht im Kern (macheJaeger) — derselbe Code läuft im
// Labor im Web-Worker.

import { parentPort } from "node:worker_threads";
import { ladeKern } from "./quellen.mjs";
import { verfeinereGenau, stabilitaetGenau } from "./genau.mjs";

const K = ladeKern();
const jaeger = K.macheJaeger();
const u0 = new Float64Array(12), ut = new Float64Array(12);
const L12 = K.macheLoeser(12, K.kraft);

const ARTEN = {
  // Eine Rasterzeile der Wiederkehrkarte.
  zeile(a) {
    const r = jaeger.zeile(a.ebene, a.m, a.a0, a.a1, a.b, a.nx, a.Tmax, a.tol, a.maxSchritte, 1, 0, a.baender);
    r.zeile = a.zeile;
    return r;
  },

  // Die ganze Prüfkette für einen Punkt, ohne Tasten.
  pruefe(a) { return jaeger.pruefe(a.ebene, a.m, a.a, a.b, a.T, a.opt); },

  // Ein Kartenminimum: talwärts tasten, dann die Prüfkette.
  kandidat(a) { const p = jaeger.kandidat(a.ebene, a.m, a.a, a.b, a.T, a.schritt, a.opt); p.kandidat = [a.a, a.b, a.T, a.d]; return p; },

  // Dasselbe über Umkehrpunkte: Zeile der Halbperioden-Karte und ihr Kandidat.
  zeileHalb(a) {
    const r = jaeger.zeileHalb(a.ebene, a.m, a.a0, a.a1, a.b, a.nx, a.Tmax, a.tol, a.maxSchritte, a.baender);
    r.zeile = a.zeile;
    return r;
  },
  kandidatHalb(a) { const p = jaeger.kandidatHalb(a.ebene, a.m, a.a, a.b, a.tau, a.ziel, a.opt); p.kandidat = [a.a, a.b, a.tau, a.d]; return p; },

  // Nachprüfung in erhöhter Genauigkeit (genau.mjs).
  genau(a) {
    const g = verfeinereGenau(a.ebene, a.m, a.a, a.b, a.T, a.opt);
    g.start = [a.a, a.b, a.T];
    return g;
  },
  // Stabilität in erhöhter Genauigkeit; a, b, T als Dezimaltext aus genau().
  stabilGenau(a) { return stabilitaetGenau(a.ebene, a.m, a.a, a.b, a.T, a.opt); },

  // Ein Katalogeintrag: kehrt die Bahn mit den veröffentlichten Zahlen
  // zurück, und wohin führt die Verfeinerung von dort?
  katalog(a) {
    const e = a.eintrag, E = K.EBENEN[e.ebene];
    E.anfang(e.a, e.b, e.m, u0);
    const aus = { name: e.name, m: e.m, T: e.T };
    ut.set(u0);
    const r1 = K.integriere(L12, ut, e.m, e.T, K.TOL_GENAU);
    aus.dKatalog = r1.art === 0 ? K.abstand(ut, u0, e.m) : NaN;
    ut.set(u0);
    const r2 = K.taylor(ut, e.m, e.T, 1e-16);
    aus.dKatalogTaylor = r2.art === 0 ? K.abstand(ut, u0, e.m) : NaN;
    const p = jaeger.pruefe(e.ebene, e.m, e.a, e.b, e.T, { tSpanne: 0.05, annahme: 1e-6 });
    Object.assign(aus, { ok: p.ok, rest: p.rest, iter: p.iter, da: p.a - e.a, db: p.b - e.b, dT: p.T - e.T,
                         teiler: p.teiler || 1, wort: p.wort, kennung: p.kennung, stabil: p.stabil,
                         lambda: p.lambda, gegenprobe: p.gegenprobe, Ts: p.Ts, stimmig: p.stimmig,
                         rMin: p.rMin, drift: p.drift, grund: p.grund, symplektik: p.symplektik,
                         s1: p.s1, s2: p.s2, a: p.a, b: p.b, Tneu: p.T });
    return aus;
  }
};

parentPort.on("message", a => {
  let ergebnis, fehler = null;
  const t0 = Date.now();
  try {
    ergebnis = ARTEN[a.art](a);
    if (ergebnis && typeof ergebnis === "object") ergebnis.sekunden = (Date.now() - t0) / 1000;
  } catch (e) { fehler = String(e && e.stack || e); }
  parentPort.postMessage({ nr: a.nr, ergebnis, fehler });
});
