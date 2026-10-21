// dreikoerper/pruef-hristov.mjs — zweite Eichung, gegen fremde Hochgenauigkeit.
//
//   node pruef-hristov.mjs [--eigen 400] [--stellen 12]
//
// Hristov u. a. geben ihre Anfangswerte mit 100 Stellen und die Eigenwerte
// der Monodromie mit 20 bis 40 Stellen an. Das sind Sollwerte, die nicht von
// mir stammen und nicht aus meinem Rechenweg:
//
//   A  Ziffern    — eigene Verfeinerung auf 30 Stellen gegen ihre 100
//   B  Eigenwerte — eigene Stabilitätsindizes (Spurformel) gegen ihre vier
//                   Eigenwerte, an einer Stichprobe der 12 431
//   C  Urteil     — ihre linear stabilen Bahnen dürfen bei mir nie instabil
//                   heißen (stabil oder offen)
//   D  Indizes in erhöhter Genauigkeit an acht stabilen Bahnen gegen 40 Stellen
//   E  dieselbe Rechnung an sechs instabilen, |λ| von 1e2 bis 1e12
//
// Urteil im Exit-Code.

import { readFileSync } from "node:fs";
import { join } from "node:path";
import { HIER, ladeKern } from "./quellen.mjs";
import { macheSchwarm } from "./schwarm.mjs";
import { verfeinereGenau, stabilitaetGenau } from "./genau.mjs";

const K = ladeKern();
const argv = process.argv.slice(2);
const hol = (f, v) => { const i = argv.indexOf("--" + f); return i >= 0 ? +argv[i + 1] : v; };
const NEIGEN = hol("eigen", 400), NZIFFERN = hol("stellen", 12);
const H = join(HIER, "quelle", "hristov");
const zeilen = d => readFileSync(join(H, d), "utf8").split(/\r?\n/).filter(x => x.trim());

let fehl = 0, gesamt = 0;
const z = x => (typeof x === "number" ? (x === 0 ? "0" : Math.abs(x) < 1e-3 || Math.abs(x) >= 1e5 ? x.toExponential(2) : x.toPrecision(6)) : String(x));
function pruefe(name, ok, wert) { gesamt++; if (!ok) fehl++; console.log(`  ${ok ? "ok  " : "FEHL"}  ${name}${wert !== undefined ? "   [" + wert + "]" : ""}`); }

// "0.3471…e0" → Dezimaltext mit `stellen` Nachkommastellen (abgeschnitten)
function dezimal(text, stellen) {
  const m = text.match(/^(-?)0?\.(\d+)e(-?\d+)$/);
  if (!m) throw new Error("Zahlformat? " + text.slice(0, 30));
  const e = +m[3], zif = m[2];
  const ganz = e > 0 ? zif.slice(0, e).padEnd(e, "0") : "0", nach = e > 0 ? zif.slice(e) : "0".repeat(-e) + zif;
  return m[1] + ganz.replace(/^0+(?=\d)/, "") + "." + nach.slice(0, stellen).padEnd(stellen, "0");
}
const gleicheZiffern = (x, y) => { let n = 0; while (n < x.length && n < y.length && x[n] === y[n]) n++; return n; };

const ics = zeilen("euler/100_12431.txt").map(l => l.trim().split(/\s+/));

/* ═══════════ A · Ziffern ═══════════ */
console.log(`\nA · ${NZIFFERN} Bahnen aus den 12 431: eigene 30 Stellen gegen ihre 100`);
{
  // gleichmäßig über die Liste, aber nur Perioden bis 60 (Rechenzeit)
  const kurz = ics.map((v, i) => ({ v, i })).filter(e => +e.v[2] < 60);
  const wahl = Array.from({ length: NZIFFERN }, (_, k) => kurz[Math.floor(k * (kurz.length - 1) / (NZIFFERN - 1))]);
  let alle = true, minZ = 99;
  for (const { v, i } of wahl) {
    const t0 = Date.now();
    // Start bei den auf double gerundeten Werten: 16 Stellen bekannt, 30 gesucht
    const g = verfeinereGenau("euler", ["1", "1", "1"], +v[0], +v[1], +v[2], { stellen: 30 });
    const soll = [dezimal(v[0], 30), dezimal(v[1], 30), dezimal(v[2], 29)];
    const ist = g.ok ? [g.a.slice(0, 32), g.b.slice(0, 32), g.T.slice(0, soll[2].length)] : ["", "", ""];
    // Vergleich bis zur 28. Nachkommastelle (die letzten beiden können durch Rundung abweichen)
    const zif = [0, 1, 2].map(k => gleicheZiffern(ist[k], soll[k]) - soll[k].indexOf(".") - 1);
    const ok = g.ok && zif.every(n => n >= 27);
    if (!ok) alle = false; minZ = Math.min(minZ, ...zif);
    console.log(`     Nr. ${String(i + 1).padStart(5)}  T ${(+v[2]).toFixed(3).padStart(8)}  Rest ${z(g.rest).padEnd(9)} gleiche Nachkommastellen v₁ ${zif[0]}, v₂ ${zif[1]}, T ${zif[2]}   ${((Date.now() - t0) / 1000).toFixed(1)} s${ok ? "" : "   ←"}`);
  }
  pruefe(`alle ${NZIFFERN} stimmen auf mindestens 27 Nachkommastellen mit der Quelle überein`, alle, `kleinste Übereinstimmung ${minZ} Stellen`);
}

/* ═══════════ B · Eigenwerte ═══════════ */
console.log(`\nB · Stabilitätsindizes gegen die Eigenwerte der Quelle (${NEIGEN} Bahnen mit T < 60)`);
const schwarm = macheSchwarm();
{
  const roh = zeilen("euler/eigenvalues_12431.txt"), eig = [];
  for (let k = 0; k < roh.length; k += 5) {
    // komplexe Werte stehen als „re + im i", reelle als eine Zahl
    const l = [1, 2, 3, 4].map(j => { const t = roh[k + j].trim().split(/\s+/); return [+t[0], t.length > 1 ? (t[1] === "-" ? -1 : 1) * parseFloat(t[2]) : 0]; });
    eig.push(l);
  }
  pruefe("Eigenwertdatei hat vier Werte je Bahn", eig.length === ics.length, `${eig.length} Blöcke, ${ics.length} Bahnen`);
  const kurz = ics.map((v, i) => i).filter(i => +ics[i][2] < 60);
  const wahl = Array.from({ length: Math.min(NEIGEN, kurz.length) }, (_, k) => kurz[Math.floor(k * (kurz.length - 1) / (Math.min(NEIGEN, kurz.length) - 1))]);
  const t0 = Date.now();
  const erg = await schwarm.alle(wahl.map(i => ({ art: "pruefe", ebene: "euler", m: [1, 1, 1], a: +ics[i][0], b: +ics[i][1], T: +ics[i][2], opt: { tSpanne: 0.02 } })));
  let verglichen = 0, einig = 0, urteilGleich = 0, offen = 0, nichtKonv = 0; const schlimm = [];
  for (let k = 0; k < erg.length; k++) {
    const r = erg[k], l = eig[wahl[k]];
    if (r.fehler || !r.ok) { nichtKonv++; continue; }
    const lamSoll = Math.max(...l.map(c => Math.hypot(c[0], c[1])));
    const stabilSoll = l.every(c => Math.abs(Math.hypot(c[0], c[1]) - 1) < 1e-9);
    if (r.stabil === null) { offen++; continue; }
    verglichen++;
    // Vergleich in der Größe, die die Spurformel liefert: |λ|max
    const ab = Math.abs(r.lambda / lamSoll - 1);
    // erlaubte Abweichung: der Fehler der Monodromie, relativ
    if (ab < Math.max(1e-6, 1e3 * r.symplektik / Math.max(1, lamSoll))) einig++; else schlimm.push(`Nr. ${wahl[k] + 1}: ich ${z(r.lambda)}, Quelle ${z(lamSoll)}, sympl. ${z(r.symplektik)}`);
    if (r.stabil === stabilSoll) urteilGleich++; else schlimm.push(`Nr. ${wahl[k] + 1}: Urteil ich ${r.stabil}, Quelle ${stabilSoll} (s ${z(r.s1)}, ${z(r.s2)})`);
  }
  pruefe("|λ|max wie in der Quelle", einig === verglichen && verglichen > 0, `${einig} von ${verglichen} verglichenen; ${offen} mit offenem Urteil (Monodromie zu grob), ${nichtKonv} in double nicht unter 1e-8 zu bringen; ${((Date.now() - t0) / 1000).toFixed(0)} s`);
  // Diese Zahl ist selbst ein Befund: so viele der veröffentlichten Bahnen
  // trägt doppelte Genauigkeit nicht — sie brauchen genau.mjs.
  console.log(`     (von ${erg.length} Bahnen mit T < 60 konvergieren in double ${erg.length - nichtKonv})`);
  pruefe("Urteil stabil/instabil wie in der Quelle", urteilGleich === verglichen, `${urteilGleich} von ${verglichen}`);
  for (const s of schlimm.slice(0, 8)) console.log("        " + s);

  // Die Acht im Einzelnen: Indizes s = 2·Re(λ) auf zehn Stellen
  const acht = erg[0], s = eig[0].map(c => 2 * c[0]).sort((x, y) => x - y);
  if (wahl[0] === 0) pruefe("Acht: Stabilitätsindizes auf zehn Stellen wie 2·Re(λ) der Quelle", Math.abs(Math.min(acht.s1, acht.s2) - s[0]) < 1e-10 && Math.abs(Math.max(acht.s1, acht.s2) - s[3]) < 1e-10,
    `ich ${Math.min(acht.s1, acht.s2).toFixed(12)}, ${Math.max(acht.s1, acht.s2).toFixed(12)} · Quelle ${s[0].toFixed(12)}, ${s[3].toFixed(12)}`);
}

/* ═══════════ C · Die stabilen Bahnen ═══════════ */
console.log("\nC · Die linear stabilen Bahnen der Quelle");
{
  const acht = zeilen("euler/100_stable.txt").map(l => l.trim().split(/\s+/));
  const erg = await schwarm.alle(acht.map(v => ({ art: "pruefe", ebene: "euler", m: [1, 1, 1], a: +v[0], b: +v[1], T: +v[2], opt: { tSpanne: 0.02 } })));
  const ja = erg.filter(r => r.ok && r.stabil === true).length;
  pruefe("die 8 stabilen unter den 12 431 sind auch hier stabil", ja === 8, `${ja} von 8; T = ${acht.map(v => (+v[2]).toFixed(1)).join(", ")}`);

  const alle = zeilen("stab971/ics_971_100.txt").map(l => l.trim().split(/\s+/)).filter(v => +v[2] < 150);
  const t0 = Date.now();
  const e2 = await schwarm.alle(alle.map(v => ({ art: "pruefe", ebene: "euler", m: [1, 1, 1], a: +v[0], b: +v[1], T: +v[2], opt: { tSpanne: 0.02 } })));
  const konv = e2.filter(r => !r.fehler && r.ok), st = konv.filter(r => r.stabil === true).length, of = konv.filter(r => r.stabil === null).length, inst = konv.filter(r => r.stabil === false);
  pruefe(`von den 971 stabilen (hier: ${alle.length} mit T < 150) nennt der Kern keine einzige instabil`, inst.length === 0 && konv.length > 0,
    `stabil ${st}, offen ${of}, instabil ${inst.length}, nicht konvergiert ${alle.length - konv.length}; ${((Date.now() - t0) / 1000).toFixed(0)} s`);
  for (const r of inst.slice(0, 5)) console.log(`        instabil genannt: a ${r.a.toFixed(8)} T ${r.T.toFixed(2)} s ${z(r.s1)} ${z(r.s2)} sympl ${z(r.symplektik)}`);
}
await schwarm.ende();

/* ═══════════ D · Stabilität in erhöhter Genauigkeit ═══════════ */
console.log("\nD · Stabilitätsindizes in erhöhter Genauigkeit gegen die 40 Stellen der Quelle");
{
  const ics971 = zeilen("stab971/ics_971_100.txt").map(l => l.trim().split(/\s+/));
  const roh = readFileSync(join(H, "stab971/res_eig_angles.txt"), "utf8").split(/\r?\n/), eig = [];
  for (let k = 0; k < roh.length; k++) if (/^i\.c\./.test(roh[k])) eig.push([2, 3, 4, 5].map(j => roh[k + j].trim().split(/\s+/)[0]));
  // Zahltext → ganze Zahl in Einheiten von 1e-30
  const zuFein = txt => { const neg = txt.startsWith("-"), [g, n] = txt.replace("-", "").split("."); const w = BigInt(g + n.padEnd(30, "0").slice(0, 30)); return neg ? -w : w; };
  const fein = t => zuFein(dezimal(t, 30));
  const betrag = v => (v < 0n ? -v : v);
  // die ersten acht (kurze Perioden) — darunter die Acht, Motte I und Schmetterling III,
  // dessen Abstand zur Grenze nur 1.2e-4 beträgt
  let alle = true, minStellen = 99; const urteile = [];
  for (let i = 0; i < 8; i++) {
    const v = ics971[i], t0 = Date.now();
    const st = stabilitaetGenau("euler", ["1", "1", "1"], dezimal(v[0], 60), dezimal(v[1], 60), dezimal(v[2], 60), { stellen: 30 });
    const soll = [...new Set(eig[i].map(t => 2n * fein(t)))].sort((x, y) => (x < y ? -1 : 1));
    const s = st.ok && !st.komplex ? [zuFein(st.s1Text), zuFein(st.s2Text)].sort((x, y) => (x < y ? -1 : 1)) : null;
    let stellen = 0;
    if (s) { const ab = betrag(s[0] - soll[0]) > betrag(s[1] - soll[soll.length - 1]) ? betrag(s[0] - soll[0]) : betrag(s[1] - soll[soll.length - 1]); stellen = 30 - (ab === 0n ? 0 : ab.toString().length); }
    if (!(stellen >= 24)) alle = false; minStellen = Math.min(minStellen, stellen); urteile.push(st.urteil);
    console.log(`     Nr. ${i + 1}  T ${(+v[2]).toFixed(2).padStart(6)}  s = ${st.ok ? st.s1.toFixed(12) + ", " + st.s2.toFixed(12) : "—"}  Abstand zur Grenze ${st.ok ? z(st.rand) : "—"}  gleich auf ${stellen} Stellen  Urteil ${st.urteil}  Unterschied der zwei Rechnungen ${z(st.unterschied)}  ${((Date.now() - t0) / 1000).toFixed(0)} s`);
  }
  pruefe("Indizes der ersten acht stabilen Bahnen auf mindestens 24 Stellen wie 2·Re(λ) der Quelle", alle, `kleinste Übereinstimmung ${minStellen} Stellen`);
  pruefe("Urteil für alle acht: stabil", urteile.every(u => u === "stabil"), urteile.join(", "));
}

/* ═══════════ E · Dieselbe Rechnung an stark instabilen Bahnen ═══════════ */
// D prüft nur stabile Bahnen. Über die offenen Funde urteilt stabilitaetGenau
// aber bei |λ| von 1e4 bis 1e10 — dort muss sie die Quelle ebenso treffen.
console.log("\nE · Stabilität in erhöhter Genauigkeit an instabilen Bahnen: |λ| gegen die 20 Stellen der Quelle");
{
  const roh = zeilen("euler/eigenvalues_12431.txt"), lam = [];
  for (let k = 0; k < roh.length; k += 5) lam.push(Math.max(...[1, 2, 3, 4].map(j => { const t = roh[k + j].trim().split(/\s+/); return Math.hypot(+t[0], t.length > 1 ? parseFloat(t[2]) : 0); })));
  // je Größenordnung von |λ| die erste Bahn mit T < 60
  const wahl = [2, 4, 6, 8, 10, 12].map(d => ics.findIndex((v, k) => +v[2] < 60 && lam[k] >= 10 ** d && lam[k] < 10 ** (d + 1))).filter(i => i >= 0);
  const schwarmE = macheSchwarm(), t0 = Date.now();
  const auftrag = (v, schnell) => ({ art: "stabilGenau", ebene: "euler", m: ["1", "1", "1"], a: dezimal(v[0], 60), b: dezimal(v[1], 60), T: dezimal(v[2], 60), opt: { stellen: 30, schnell } });
  const acht = zeilen("stab971/ics_971_100.txt")[0].trim().split(/\s+/);
  // dieselben Bahnen noch einmal über die schnelle Stufe, dazu die Acht: bei
  // einer stabilen Bahn darf die schnelle Stufe nicht urteilen
  const alleE = await schwarmE.alle([...wahl.map(i => auftrag(ics[i], false)), ...wahl.map(i => auftrag(ics[i], true)), auftrag(acht, true)]);
  await schwarmE.ende();
  const erg = alleE.slice(0, wahl.length), schnell = alleE.slice(wahl.length, 2 * wahl.length), achtS = alleE[2 * wahl.length];
  let gut = 0, groesste = 0;
  erg.forEach((r, k) => {
    const i = wahl[k];
    if (r.fehler || !r.ok || r.komplex) { console.log(`     Nr. ${i + 1}: ${r.fehler || r.grund || "komplexes Paar — hier nicht verglichen"}   ←`); return; }
    const s = Math.max(Math.abs(r.s1), Math.abs(r.s2)), ist = (s + Math.sqrt(s * s - 4)) / 2, ab = Math.abs(ist / lam[i] - 1);
    groesste = Math.max(groesste, ab);
    const ok = ab < 1e-12 && r.urteil === "instabil"; if (ok) gut++;
    console.log(`     Nr. ${String(i + 1).padStart(5)}  T ${(+ics[i][2]).toFixed(2).padStart(6)}  |λ| Quelle ${lam[i].toExponential(12)}  hier ${ist.toExponential(12)}  Urteil ${r.urteil}${ok ? "" : "   ←"}`);
  });
  pruefe(`|λ| von 1e2 bis 1e12 auf zwölf Stellen wie in der Quelle, Urteil instabil`, gut === wahl.length && wahl.length >= 5, `${gut} von ${wahl.length}, größte relative Abweichung ${z(groesste)}; ${((Date.now() - t0) / 1000).toFixed(0)} s`);
  let gutS = 0, groessteS = 0;
  schnell.forEach((r, k) => {
    if (r.fehler || !r.ok || r.komplex) return;
    const s = Math.max(Math.abs(r.s1), Math.abs(r.s2)), ab = Math.abs((s + Math.sqrt(s * s - 4)) / 2 / lam[wahl[k]] - 1);
    groessteS = Math.max(groessteS, ab);
    if (ab < 1e-9 && r.urteil === "instabil" && r.stufe === "schnell") gutS++;
  });
  pruefe("schnelle Stufe: dieselben Bahnen instabil, |λ| auf neun Stellen", gutS === wahl.length, `${gutS} von ${wahl.length}, größte relative Abweichung ${z(groessteS)}`);
  pruefe("schnelle Stufe gibt bei der stabilen Acht an die volle Rechnung ab, Urteil stabil", achtS.ok && achtS.stufe === "voll" && achtS.urteil === "stabil", `Stufe ${achtS.stufe}, Urteil ${achtS.urteil}`);
}

console.log(`\n${gesamt - fehl} von ${gesamt} Prüfungen bestanden` + (fehl ? ` — ${fehl} FEHL` : ""));
process.exit(fehl ? 1 : 0);
