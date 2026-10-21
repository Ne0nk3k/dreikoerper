// dreikoerper/werkzeug/stabil-fehler.mjs — wie genau sind meine Stabilitäts-
// indizes wirklich, und sagt der Symplektikfehler das voraus?
//
//   node werkzeug/stabil-fehler.mjs [Tmax=150]
//
// Vergleicht s = λ + 1/λ aus der Spurformel mit den Eigenwerten der Quelle
// (971 stabile Bahnen, 40 Stellen) und druckt das Verhältnis
// Fehler / Symplektikfehler. Daraus kommt der Faktor in der Regel
// „Urteil offen, wenn der Abstand zur Grenze unter Faktor × Symplektikfehler".

import { readFileSync } from "node:fs";
import { join } from "node:path";
import { HIER } from "../quellen.mjs";
import { macheSchwarm } from "../schwarm.mjs";

const TMAX = +(process.argv[2] || 150);
const H = join(HIER, "quelle", "hristov", "stab971");
const ics = readFileSync(join(H, "ics_971_100.txt"), "utf8").split(/\r?\n/).filter(x => x.trim()).map(l => l.trim().split(/\s+/));
const roh = readFileSync(join(H, "res_eig_angles.txt"), "utf8").split(/\r?\n/);
const eig = [];
for (let k = 0; k < roh.length; k++) if (/^i\.c\./.test(roh[k])) {
  const l = [];
  for (let j = k + 2; j < k + 6; j++) { const t = roh[j].trim().split(/\s+/); l.push([+t[0], t.length > 1 ? (t[1] === "-" ? -1 : 1) * parseFloat(t[2]) : 0]); }
  eig.push(l);
}
console.log(`${ics.length} Bahnen, ${eig.length} Eigenwertblöcke`);
const wahl = ics.map((v, i) => i).filter(i => +ics[i][2] < TMAX);
const schwarm = macheSchwarm();
const erg = await schwarm.alle(wahl.map(i => ({ art: "pruefe", ebene: "euler", m: [1, 1, 1], a: +ics[i][0], b: +ics[i][1], T: +ics[i][2], opt: { tSpanne: 0.02 } })));
await schwarm.ende();

const verh = [];
console.log("   Nr     T      s (Quelle)            s (ich)               Fehler     sympl.    Fehler/sympl.  Abstand zur Grenze  komplex");
for (let k = 0; k < erg.length; k++) {
  const r = erg[k], i = wahl[k];
  if (r.fehler || !r.ok || r.symplektik === undefined) { console.log(`  ${String(i + 1).padStart(4)}  nicht konvergiert (Rest ${r.rest})`); continue; }
  const soll = [...new Set(eig[i].map(c => +(2 * c[0]).toFixed(12)))].sort((x, y) => x - y);
  const ich = r.sKomplex ? [r.s1, r.s1] : [Math.min(r.s1, r.s2), Math.max(r.s1, r.s2)];
  const so = [soll[0], soll[soll.length - 1]];
  const f = Math.max(Math.abs(ich[0] - so[0]), Math.abs(ich[1] - so[1]), r.sKomplex ? r.sIm : 0);
  const rand = 2 - Math.max(Math.abs(so[0]), Math.abs(so[1]));
  verh.push({ f, sy: r.symplektik, v: f / r.symplektik, rand, T: r.T, komplex: r.sKomplex });
  if (k < 25 || f / r.symplektik > 30) console.log(`  ${String(i + 1).padStart(4)} ${r.T.toFixed(1).padStart(6)}  ${so.map(x => x.toFixed(8)).join(" ")}  ${ich.map(x => x.toFixed(8)).join(" ")}  ${f.toExponential(1)}  ${r.symplektik.toExponential(1)}  ${(f / r.symplektik).toFixed(2).padStart(8)}       ${rand.toExponential(1)}        ${r.sKomplex ? "ja (Im " + r.sIm.toExponential(1) + ")" : ""}`);
}
verh.sort((x, y) => x.v - y.v);
const q = p => verh[Math.min(verh.length - 1, Math.floor(p * verh.length))].v;
console.log(`\nFehler/Symplektikfehler über ${verh.length} Bahnen: Median ${q(0.5).toFixed(2)}, 90 % ${q(0.9).toFixed(2)}, 99 % ${q(0.99).toFixed(2)}, größter ${verh[verh.length - 1].v.toFixed(2)}`);
const ohneK = verh.filter(x => !x.komplex);
console.log(`ohne die als komplex gemeldeten (${verh.length - ohneK.length}): größter ${Math.max(...ohneK.map(x => x.v)).toFixed(2)}`);
console.log(`Abstand zur Grenze: kleinster ${Math.min(...verh.map(x => x.rand)).toExponential(1)}, Median ${verh.map(x => x.rand).sort((a, b) => a - b)[verh.length >> 1].toExponential(1)}`);
