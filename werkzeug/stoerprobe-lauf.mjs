// dreikoerper/werkzeug/stoerprobe-lauf.mjs — die Störprobe (siehe
// stoerprobe.mjs) für die stabilen Bahnen eines beliebigen Laufs.
//
//   node werkzeug/stoerprobe-lauf.mjs <lauf>
//
// Das Stabilitätsurteil kommt in double wie in Festkomma aus demselben
// Verfahren (Variationsgleichungen, Spur der Monodromie). Die Störprobe kennt
// nur die Kraft: Anfangswert um 1e-8 verschieben, beide Bahnen 20 Umläufe
// rechnen (Taylorreihe, double), Abstand nach jedem Umlauf. Linear stabil:
// der Abstand wächst höchstens gleichmäßig, Abstand(20)/Abstand(10) ≈ 2.
// Instabil: er vervielfacht sich je Umlauf um |λ|.
//
// Geprüft werden alle Funde des Laufs, die auf 30 Stellen stabil oder an der
// Grenze sind, und als Gegenstück die instabilen mit dem kleinsten |Index|.
// Wo die ungestörte Bahn selbst in double nach 20 Umläufen weit vom Anfang
// ist, trägt die Probe nicht — das steht dann da.

import { readFileSync } from "node:fs";
import { join } from "node:path";
import { HIER, ladeKern } from "../quellen.mjs";

// --umlaeufe N (Vorgabe 20) und --nur T (nur die Bahn mit dieser Umlaufzeit, ±0,01):
// für den Fall, dass zwanzig Umläufe nicht trennen.
const K = ladeKern(), argv = process.argv.slice(2), lauf = argv[0];
if (!lauf) { console.error("Aufruf: node werkzeug/stoerprobe-lauf.mjs <lauf> [--umlaeufe 20] [--nur T]"); process.exit(2); }
const hol = (f, v) => (argv.includes("--" + f) ? +argv[argv.indexOf("--" + f) + 1] : v);
const NUR = hol("nur", NaN);
const g = JSON.parse(readFileSync(join(HIER, "ergebnisse", lauf + "-genau.json"), "utf8"));
const b = JSON.parse(readFileSync(join(HIER, "ergebnisse", lauf + ".json"), "utf8"));
const m = b.parameter.m, E = K.EBENEN[b.parameter.ebene];
const mit = g.geprueft.filter(r => r.stabilGenau && r.urteil === "belegt");
const gross = r => Math.max(Math.abs(r.stabilGenau.s1), Math.abs(r.stabilGenau.s2));
let faelle = [...mit.filter(r => r.stabilGenau.urteil !== "instabil").sort((x, y) => +x.T - +y.T),
  ...mit.filter(r => r.stabilGenau.urteil === "instabil" && gross(r) > 2.2).sort((x, y) => gross(x) - gross(y)).slice(0, 3)];
if (NUR === NUR) faelle = mit.filter(r => Math.abs(+r.T - NUR) < 0.01);
const UMLAEUFE = Math.max(20, hol("umlaeufe", 20)), STOSS = 1e-8;
console.log(`${lauf}, Massen ${m.join("/")}: Stoß ${STOSS} im ersten Anfangswert, ${UMLAEUFE} Umläufe\n`);
console.log("| T | Urteil (30 Stellen) | Indizes | Abstand nach Umlauf 1 / 5 / 10 / 20 | Abstand(20)/Abstand(10) | ungestörte Bahn nach 20 Umläufen vom Anfang | Befund |");
console.log("|---|---|---|---|---|---|---|");
for (const r of faelle) {
  const a = +r.a, bb = +r.b, T = +r.T, s = r.stabilGenau;
  const u = new Float64Array(12), v = new Float64Array(12), u0 = new Float64Array(12);
  E.anfang(a, bb, m, u); E.anfang(a + STOSS, bb, m, v); E.anfang(a, bb, m, u0);
  // je Umlauf: Abstand gestört–ungestört, und wie weit die ungestörte Bahn selbst von ihrem Anfang ist
  const reihe = [], abweg = []; let ok = true;
  for (let n = 1; n <= UMLAEUFE && ok; n++) { const e1 = K.taylor(u, m, T, 1e-16), e2 = K.taylor(v, m, T, 1e-16); if ((e1 && e1.art) || (e2 && e2.art)) ok = false; reihe.push(K.abstand(u, v, m)); abweg.push(K.abstand(u, u0, m)); }
  const drift = abweg[Math.min(19, abweg.length - 1)], q = reihe.length >= 20 ? reihe[19] / reihe[9] : NaN;
  const e = x => (Number.isFinite(x) ? x.toExponential(1) : "—");
  // trägt die Probe? Die ungestörte Bahn muss deutlich näher am Anfang bleiben als die gestörte von ihr —
  // bewertet nach 20 Umläufen (bis 03.10.2026: am Ende der Rechnung, was lange Läufe fälschlich verwarf)
  const traegt = ok && drift < 0.1 * reihe[19];
  const traegtBis = (() => { let n = 0; while (n < reihe.length && abweg[n] < 0.1 * reihe[n]) n++; return n; })();
  // gleichmäßig wäre ×2; die instabilen Gegenstücke lagen bei ×185 und ×755. Dazwischen entscheidet die Probe nicht.
  const befund = !ok ? "Rechnung abgebrochen" : !traegt ? "trägt nicht: double verliert die Bahn selbst" : q < 3 ? "gleichmäßiges Wachstum — passt zu stabil" : q < 10 ? `Wachstum ×${q.toFixed(1)} in zehn Umläufen — nicht eindeutig` : `Wachstum ×${q.toFixed(0)} in zehn Umläufen — passt zu instabil`;
  console.log(`| ${T.toFixed(3)} | ${s.urteil} | ${s.s1.toFixed(6)} / ${s.s2.toFixed(6)} | ${[0, 4, 9, 19].map(i => e(reihe[i])).join(" / ")} | ${Number.isFinite(q) ? q.toFixed(2) : "—"} | ${e(drift)} | ${befund} |`);
  if (UMLAEUFE > 20) {
    // längerer Verlauf: gleichmäßig heißt Abstand/Umlauf ungefähr fest; exponentiell heißt, er wächst immer schneller
    const punkte = [10, 20, 40, 80, 160, 320, 640].filter(n => n <= reihe.length);
    console.log(`   über ${reihe.length} Umläufe, die Probe trägt bis Umlauf ${traegtBis}: ` + punkte.map(n => `nach ${n}: ${e(reihe[n - 1])} (je Umlauf ${e(reihe[n - 1] / n)}; ungestörte Bahn ${e(abweg[n - 1])} vom Anfang)`).join(" · "));
  }
}
