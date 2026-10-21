// dreikoerper/werkzeug/stabil-schranke.mjs — welche Fehlerschranke für die
// Stabilitätsindizes hält an BEIDEN Vergleichsmengen?
//
//   node werkzeug/stabil-schranke.mjs
//
// Menge S: die stabilen Bahnen der Quelle (stab971, T < 150) — wahre Indizes
//          aus den 40-stelligen Eigenwerten.
// Menge U: Bahnen aus den 12 431 mit T < 60 — wahre Eigenwerte auf 20 Stellen,
//          fast alle instabil, |λ| bis 1e12.
//
// Je Bahn: der wahre Fehler meiner Indizes (für große |λ| relativ gemessen)
// gegen Kandidaten für eine Schranke: Symplektikfehler, geteilt durch den
// größten Eintrag der Monodromie, geteilt durch dessen Quadrat.
// Gesucht ist eine Regel, die nie ein falsches Urteil erlaubt und möglichst
// selten „offen" sagt.

import { readFileSync } from "node:fs";
import { join } from "node:path";
import { HIER } from "../quellen.mjs";
import { macheSchwarm } from "../schwarm.mjs";

const H = join(HIER, "quelle", "hristov");
const zeilen = d => readFileSync(join(H, d), "utf8").split(/\r?\n/).filter(x => x.trim());
const paar = t => { const q = t.trim().split(/\s+/); return [+q[0], q.length > 1 ? (q[1] === "-" ? -1 : 1) * parseFloat(q[2]) : 0]; };

// Menge S
const icsS = zeilen("stab971/ics_971_100.txt").map(l => l.trim().split(/\s+/).map(Number));
const rohS = readFileSync(join(H, "stab971/res_eig_angles.txt"), "utf8").split(/\r?\n/), eigS = [];
for (let k = 0; k < rohS.length; k++) if (/^i\.c\./.test(rohS[k])) eigS.push([2, 3, 4, 5].map(j => paar(rohS[k + j])));
// Menge U
const icsU = zeilen("euler/100_12431.txt").map(l => l.trim().split(/\s+/).map(Number));
const rohU = zeilen("euler/eigenvalues_12431.txt"), eigU = [];
for (let k = 0; k < rohU.length; k += 5) eigU.push([1, 2, 3, 4].map(j => paar(rohU[k + j])));

const wahlS = icsS.map((v, i) => i).filter(i => icsS[i][2] < 150);
const kurzU = icsU.map((v, i) => i).filter(i => icsU[i][2] < 60);
const wahlU = Array.from({ length: 500 }, (_, k) => kurzU[Math.floor(k * (kurzU.length - 1) / 499)]);

const schwarm = macheSchwarm();
const auftrag = v => ({ art: "pruefe", ebene: "euler", m: [1, 1, 1], a: v[0], b: v[1], T: v[2], opt: { tSpanne: 0.02, annahme: 1e-6 } });
const ergS = await schwarm.alle(wahlS.map(i => auftrag(icsS[i])));
const ergU = await schwarm.alle(wahlU.map(i => auftrag(icsU[i])));
await schwarm.ende();

// wahre Indizes s = λ + 1/λ aus den vier Eigenwerten (zwei Paare)
function wahr(l) {
  const s = l.map(c => { const n = c[0] * c[0] + c[1] * c[1]; return [c[0] + c[0] / n, c[1] - c[1] / n]; });   // λ + 1/λ komplex
  const reell = s.every(x => Math.abs(x[1]) < 1e-9 * (1 + Math.abs(x[0])));
  const werte = [...new Set(s.map(x => +x[0].toPrecision(12)))].sort((x, y) => x - y);
  const lam = Math.max(...l.map(c => Math.hypot(c[0], c[1])));
  return { reell, klein: werte[0], gross: werte[werte.length - 1], lam, stabil: l.every(c => Math.abs(Math.hypot(c[0], c[1]) - 1) < 1e-9) };
}
const daten = [];
const nimm = (erg, wahl, eig, menge) => erg.forEach((r, k) => {
  if (r.fehler || !r.ok || r.symplektik === undefined) return;
  const w = wahr(eig[wahl[k]]);
  // Fehler: bei reellen wahren Indizes der größere der beiden Abstände; sonst nur |λ|
  let f;
  if (w.reell && !r.sKomplex) f = Math.max(Math.abs(Math.min(r.s1, r.s2) - w.klein), Math.abs(Math.max(r.s1, r.s2) - w.gross));
  else f = Math.abs(r.lambda - w.lam) + (w.reell && r.sKomplex ? r.sIm : 0);
  // Abstand der WAHREN Indizes zur Grenze (wie weit darf ich danebenliegen, ohne das Urteil zu kippen?)
  const rand = w.stabil ? 2 - Math.max(Math.abs(w.klein), Math.abs(w.gross)) : Math.max(Math.abs(w.klein), Math.abs(w.gross)) - 2;
  daten.push({ menge, T: r.T, f, sy: r.symplektik, maxM: r.maxM, lam: w.lam, lamIch: r.lambda, stabilWahr: w.stabil, stabilIch: r.stabil, rand, s1: r.s1, s2: r.s2, komplex: r.sKomplex, sIm: r.sIm });
});
nimm(ergS, wahlS, eigS, "S"); nimm(ergU, wahlU, eigU, "U");

console.log(`Menge S: ${daten.filter(d => d.menge === "S").length} Bahnen, Menge U: ${daten.filter(d => d.menge === "U").length} Bahnen (in double konvergiert)`);
// Kandidaten für die Schranke
const kand = {
  "sympl": d => d.sy,
  "sympl/|λ|ich": d => d.sy / Math.max(1, d.lamIch),
  "sympl/maxM": d => d.sy / Math.max(1, d.maxM),
  "sympl/maxM²·|s|": d => d.sy / Math.max(1, d.maxM * d.maxM) * Math.max(Math.abs(d.s1), Math.abs(d.s2), 1),
};
for (const [name, fn] of Object.entries(kand)) {
  const v = daten.map(d => ({ d, q: d.f / fn(d) })).filter(x => Number.isFinite(x.q)).sort((x, y) => x.q - y.q);
  const q = p => v[Math.min(v.length - 1, Math.floor(p * v.length))].q;
  const worst = v[v.length - 1];
  console.log(`\nFehler / (${name}): Median ${q(0.5).toExponential(1)}, 90 % ${q(0.9).toExponential(1)}, 99 % ${q(0.99).toExponential(1)}, größtes ${worst.q.toExponential(1)} (Menge ${worst.d.menge}, T ${worst.d.T.toFixed(1)}, |λ| wahr ${worst.d.lam.toExponential(1)}, maxM ${worst.d.maxM.toExponential(1)}, sympl ${worst.d.sy.toExponential(1)})`);
}
// Was heißt „unbrauchbar"? relativer Symplektikfehler
const rel = d => d.sy / Math.max(1, d.maxM * d.maxM);
console.log("\nRelativer Symplektikfehler sympl/maxM² gegen den relativen Fehler von |λ|:");
for (const g of [[0, 1e-10], [1e-10, 1e-8], [1e-8, 1e-6], [1e-6, 1e-4], [1e-4, 1e-2], [1e-2, 1e9]]) {
  const t = daten.filter(d => rel(d) >= g[0] && rel(d) < g[1]);
  if (!t.length) continue;
  const fr = t.map(d => Math.abs(d.lamIch / d.lam - 1)).sort((x, y) => x - y);
  const falsch = t.filter(d => d.stabilWahr !== (Math.abs(d.s1) < 2 && Math.abs(d.s2) < 2 && !d.komplex)).length;
  console.log(`  ${g[0].toExponential(0)} … ${g[1].toExponential(0)}: ${String(t.length).padStart(4)} Bahnen (S ${t.filter(d => d.menge === "S").length}, U ${t.filter(d => d.menge === "U").length}) · rel. Fehler |λ|: Median ${fr[fr.length >> 1].toExponential(1)}, größter ${fr[fr.length - 1].toExponential(1)} · rohes Urteil falsch: ${falsch}`);
}

// Regeln im Vergleich: wie viele falsche Urteile, wie viele „offen"
const regeln = {
  "alt:  |rand| < 150·sympl": d => (d.komplex ? d.sIm * d.sIm : Math.abs(2 - Math.max(Math.abs(d.s1), Math.abs(d.s2)))) < 150 * d.sy,
  "kurz: |rand| < 150·sympl/|λ|": d => (d.komplex ? d.sIm * d.sIm : Math.abs(2 - Math.max(Math.abs(d.s1), Math.abs(d.s2)))) < 150 * d.sy / Math.max(1, d.lamIch),
  "neu:  rel > 1e-6 oder |rand| < 150·sympl/maxM": d => rel(d) > 1e-6 || (d.komplex ? d.sIm * d.sIm : Math.abs(2 - Math.max(Math.abs(d.s1), Math.abs(d.s2)))) < 150 * d.sy / Math.max(1, d.maxM),
};
console.log("");
for (const [name, offenFn] of Object.entries(regeln)) {
  let offen = 0, falsch = 0, richtig = 0; const bsp = [];
  for (const d of daten) {
    if (offenFn(d)) { offen++; continue; }
    const ich = !d.komplex && Math.abs(d.s1) < 2 && Math.abs(d.s2) < 2;
    if (ich === d.stabilWahr) richtig++; else { falsch++; if (bsp.length < 3) bsp.push(`${d.menge} T ${d.T.toFixed(1)} s ${d.s1.toExponential(2)}/${d.s2.toExponential(2)} sympl ${d.sy.toExponential(1)} maxM ${d.maxM.toExponential(1)} wahr ${d.stabilWahr ? "stabil" : "|λ| " + d.lam.toExponential(1)}`); }
  }
  console.log(`${name.padEnd(48)} richtig ${String(richtig).padStart(4)}  offen ${String(offen).padStart(4)}  FALSCH ${falsch}` + (bsp.length ? "   z. B. " + bsp.join(" | ") : ""));
}
