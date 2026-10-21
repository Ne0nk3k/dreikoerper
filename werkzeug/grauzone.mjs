// dreikoerper/werkzeug/grauzone.mjs — Funde knapp neben einer Listenbahn:
// dieselbe Bahn oder eine andere?
//
//   node werkzeug/grauzone.mjs <lauf> [--schwelle 1e-6]
//
// Der Abgleich nennt zwei Bahnen „dieselbe", wenn ihre skalierte Periode T*
// auf 2e-8 übereinstimmt. Das T* der Listenbahn stammt aus doppelter
// Genauigkeit; bei empfindlichen Bahnen ist es selbst nur auf einige 1e-8
// genau (gemessen an sicheren Ortstreffern bei 1/1/0,5: bis 3,4e-8). Funde
// mit einer Abweichung zwischen 2e-8 und 1e-6 liegen deshalb in einer
// Grauzone. Hier wird sie aufgelöst: Listenbahn UND Fund auf 30 Stellen
// verfeinern, T* beider vergleichen. Dieselbe Bahn stimmt dann auf 1e-12.
// Ein Faden, damit es neben nichts anderem läuft (eine Bahn etwa 2–4 min).

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { HIER, ladeKern, ladeKatalog } from "../quellen.mjs";
import { verfeinereGenau } from "../genau.mjs";

const K = ladeKern(), argv = process.argv.slice(2), lauf = argv[0];
if (!lauf) { console.error("Aufruf: node werkzeug/grauzone.mjs <lauf> [--schwelle 1e-6]"); process.exit(2); }
const SCHWELLE = argv.includes("--schwelle") ? +argv[argv.indexOf("--schwelle") + 1] : 1e-6;
const ordner = join(HIER, "ergebnisse");
const B = JSON.parse(readFileSync(join(ordner, lauf + ".json"), "utf8")), P = B.parameter;
const gp = join(ordner, lauf + "-genau.json");
const ort = (a, b) => Math.round(Math.abs(a) * 1e9) + ":" + Math.round(Math.abs(b) * 1e9);
const genau = existsSync(gp) ? new Map(JSON.parse(readFileSync(gp, "utf8")).geprueft.filter(r => r.start).map(r => [ort(r.start[0], r.start[1]), r])) : new Map();
const kat = ladeKatalog().bahnen.filter(q => q.ebene === P.ebene && q.m.join() === P.m.join());
const e = x => (Number.isFinite(x) ? x.toExponential(2) : "—");
const u = new Float64Array(12);
const tsVon = (a, b, T) => { K.EBENEN[P.ebene].anfang(+a, +b, P.m, u); return +T * Math.pow(Math.abs(K.energie(u, P.m)), 1.5); };

const faelle = B.funde.filter(f => !f.bekannt && !f.weitereLage)
  .map(f => ({ f, n: kat.map(q => ({ q, d: Math.abs(q.Ts / f.Ts - 1) })).sort((x, y) => x.d - y.d)[0] }))
  .filter(x => x.n && x.n.d < SCHWELLE).sort((x, y) => x.n.d - y.n.d);
console.log(`${lauf} (Massen ${P.m.join("/")}): ${faelle.length} Funde außerhalb der Liste, deren T* näher als ${e(SCHWELLE)} an einer Listenbahn liegt`);
const verfeinere = (a, b, T, lam) => { const t0 = Date.now(); const g = verfeinereGenau(P.ebene, P.m.map(String), a, b, T, { stellen: 30, empfindlich: Math.log10(Math.max(1, lam || 1)) }); return { g, sek: (Date.now() - t0) / 1000 }; };
const aus = [], listeGenau = new Map();
for (const { f, n } of faelle) {
  // die Listenbahn auf 30 Stellen (jede nur einmal)
  if (!listeGenau.has(n.q.name)) {
    const { g, sek } = verfeinere(n.q.a, n.q.b, n.q.T, 10);
    listeGenau.set(n.q.name, g.ok ? { Ts: tsVon(g.a, g.b, g.T), T: +g.T, sek, rest: g.rest } : { fehler: g.grund, sek });
  }
  const L = listeGenau.get(n.q.name);
  // der Fund auf 30 Stellen: aus der Nachprüfung, sonst jetzt
  let F = null; const r = genau.get(ort(f.a, f.b));
  if (r && r.urteil === "belegt") F = { Ts: tsVon(r.a, r.b, r.T), T: +r.T, aus: "Nachprüfung" };
  else { const { g, sek } = verfeinere(f.a, f.b, f.T, f.lambda); F = g.ok ? { Ts: tsVon(g.a, g.b, g.T), T: +g.T, aus: `jetzt, ${sek.toFixed(0)} s` } : { fehler: g.grund }; }
  const d = L.Ts && F.Ts ? Math.abs(L.Ts / F.Ts - 1) : NaN;
  const urteil = !(d === d) ? "nicht entschieden" : d < 1e-12 ? "DIESELBE BAHN" : "andere Bahn";
  aus.push({ a: f.a, b: f.b, T: f.T, liste: n.q.name, abweichungDouble: n.d, abweichungGenau: d, urteil });
  console.log(`  Fund (${f.a.toFixed(6)}, ${f.b.toFixed(6)}) T ${f.T.toFixed(4)} ${f.stabil === true ? "stabil" : f.stabil === false ? "instabil" : "offen"}  ↔  ${n.q.name} T ${n.q.T.toFixed(4)}: in double ${e(n.d)}; auf 30 Stellen ` +
    (d === d ? `T* ${F.Ts.toFixed(12)} gegen ${L.Ts.toFixed(12)}, Abweichung ${e(d)}` : `nicht verfeinert (${L.fehler || F.fehler})`) + `  →  ${urteil}` + (L.sek ? `   [Listenbahn ${L.sek.toFixed(0)} s, Fund ${F.aus || "—"}]` : ""));
}
writeFileSync(join(ordner, lauf + "-grauzone.json"), JSON.stringify({ lauf, datum: new Date().toISOString(), schwelle: SCHWELLE, faelle: aus }, null, 1));
console.log(`${aus.filter(x => x.urteil === "DIESELBE BAHN").length} dieselbe Bahn, ${aus.filter(x => x.urteil === "andere Bahn").length} andere, ${aus.filter(x => x.urteil === "nicht entschieden").length} nicht entschieden → ergebnisse/${lauf}-grauzone.json`);
