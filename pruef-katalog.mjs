// dreikoerper/pruef-katalog.mjs — der große Katalogabgleich.
//
//   node pruef-katalog.mjs [gleich|ungleich|fall|alle] [--bis N]
//
// Jede Bahn aus den Katalogen von Li und Liao läuft durch dieselbe Prüfkette
// wie später ein eigener Fund: Wiederkehr mit den veröffentlichten Ziffern
// (zwei Verfahren), Verfeinerung, Wort, Stabilität, Gegenprobe.
//
// Das ist keine Prüfung des Katalogs, sondern des Geräts: wie weit trägt
// doppelte Genauigkeit, und woran erkennt man, wo sie aufhört? Li und Liao
// haben mit Vielfachgenauigkeit gerechnet; wo double nicht reicht, muss das
// hier als „an der Rechengrenze" herauskommen und nicht als falscher Fund.
//
// Schreibt ergebnisse/katalogabgleich-<satz>.json. Exit 1, wenn ein Faden
// eine Ausnahme wirft oder ein Wort falsch ist.

import { writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { ladeKern, ladeQuellen, HIER } from "./quellen.mjs";
import { macheSchwarm } from "./schwarm.mjs";

const K = ladeKern(), Q = ladeQuellen();
const argv = process.argv.slice(2);
const welche = !argv[0] || argv[0].startsWith("--") || argv[0] === "alle" ? ["gleich", "ungleich", "fall"] : [argv[0]];
const BIS = argv.includes("--bis") ? +argv[argv.indexOf("--bis") + 1] : Infinity;
mkdirSync(join(HIER, "ergebnisse"), { recursive: true });

const z = x => (typeof x === "number" ? (x === 0 ? "0" : Math.abs(x) < 1e-3 || Math.abs(x) >= 1e5 ? x.toExponential(1) : x.toPrecision(4)) : String(x));
const median = a => { const s = a.filter(Number.isFinite).sort((x, y) => x - y); return s.length ? s[s.length >> 1] : NaN; };

const schwarm = macheSchwarm();
let schlimm = 0;
for (const satz of welche) {
  const liste = Q[satz].slice(0, BIS);
  const t0 = Date.now();
  let letzte = 0;
  const erg = await schwarm.alle(liste.map(e => ({ art: "katalog", eintrag: e })), (_, __, n) => {
    if (Date.now() - letzte > 20000) { letzte = Date.now(); process.stderr.write(`  ${satz}: ${n}/${liste.length}\n`); }
  });
  const dauer = (Date.now() - t0) / 1000;
  const kaputt = erg.filter(r => r.fehler);
  schlimm += kaputt.length;

  // Urteil je Bahn
  for (let i = 0; i < erg.length; i++) {
    const r = erg[i], e = liste[i];
    if (r.fehler) { r.urteil = "ausnahme"; continue; }
    r.wortSoll = e.wort; r.TsKatalog = e.Ts;
    // Die Quelle kürzt nicht immer (II.D-1: „ABba"); verglichen wird gekürzt.
    r.wortGleich = satz === "fall" ? null : (r.ok ? r.wort === K.kleinsteDrehung(K.kuerzeWort(e.wort)) : null);
    const nah = Math.abs(r.da) < 1e-6 && Math.abs(r.db) < 1e-6;
    r.urteil = !r.ok ? "nicht konvergiert" : !nah ? "woanders gelandet" : (r.rest < 1e-10 && r.gegenprobe < 1e-8) ? "bestätigt" : "an der Rechengrenze";
  }
  const zaehl = u => erg.filter(r => r.urteil === u).length;
  console.log(`\n══ ${satz}: ${liste.length} Bahnen, ${dauer.toFixed(0)} s auf ${schwarm.faeden} Fäden ══`);
  console.log(`  bestätigt (Rest < 1e-10, Gegenprobe < 1e-8) : ${zaehl("bestätigt")}`);
  console.log(`  an der Rechengrenze (konvergiert, gröber)    : ${zaehl("an der Rechengrenze")}`);
  console.log(`  woanders gelandet (> 1e-6 vom Katalogwert)   : ${zaehl("woanders gelandet")}`);
  console.log(`  nicht konvergiert                            : ${zaehl("nicht konvergiert")}`);
  console.log(`  Ausnahmen                                    : ${kaputt.length}`);
  if (kaputt.length) console.log("   erste: " + kaputt[0].fehler.slice(0, 300));

  if (satz !== "fall") {
    const mitWort = erg.filter(r => r.wortGleich !== null && r.wortGleich !== undefined);
    const falsch = mitWort.filter(r => !r.wortGleich);
    console.log(`  Wort wie veröffentlicht: ${mitWort.length - falsch.length} von ${mitWort.length} konvergierten`);
    for (const r of falsch.slice(0, 5)) console.log(`     ${r.name} m₃=${r.m[2]}: ich ${r.wort.slice(0, 50)} | soll ${K.kleinsteDrehung(r.wortSoll).slice(0, 50)} | stimmig ${r.stimmig}`);
    const echtFalsch = falsch.filter(r => r.urteil === "bestätigt");
    if (echtFalsch.length) { schlimm += echtFalsch.length; console.log(`  FEHL: ${echtFalsch.length} bestätigte Bahnen mit anderem Wort`); }
    const mitTs = erg.filter(r => r.urteil === "bestätigt" && Number.isFinite(r.TsKatalog));
    const tsAb = mitTs.map(r => Math.abs(r.Ts / r.TsKatalog - 1));
    console.log(`  T* = T·|E|^1.5 gegen die Katalogspalte: größte Abweichung ${z(Math.max(...tsAb))} über ${mitTs.length} bestätigte`);
  }

  // Wo hört double auf? Nach Periode und nach engster Begegnung.
  const tafel = (titel, schluessel, grenzen) => {
    console.log(`  ${titel.padEnd(22)} Bahnen  bestätigt  Grenze  nicht konv.  Median Rest   Median d(Katalog)`);
    for (let g = 0; g < grenzen.length - 1; g++) {
      const teil = erg.filter(r => !r.fehler && schluessel(r) >= grenzen[g] && schluessel(r) < grenzen[g + 1]);
      if (!teil.length) continue;
      const c = u => teil.filter(r => r.urteil === u).length;
      console.log(`    ${(z(grenzen[g]) + " … " + z(grenzen[g + 1])).padEnd(20)} ${String(teil.length).padStart(6)}  ${String(c("bestätigt")).padStart(9)}  ${String(c("an der Rechengrenze")).padStart(6)}  ${String(c("nicht konvergiert") + c("woanders gelandet")).padStart(11)}  ${z(median(teil.map(r => r.rest))).padStart(11)}   ${z(median(teil.map(r => r.dKatalog))).padStart(11)}`);
    }
  };
  tafel("Periode T", r => r.T, [0, 10, 20, 40, 60, 80, 100, 150, 201]);
  tafel("engste Begegnung", r => (Number.isFinite(r.rMin) ? r.rMin : -1), [-2, 0, 1e-5, 1e-4, 1e-3, 1e-2, 1e-1, 10]);
  console.log("    (Zeile −2 … 0: nicht konvergiert, engste Begegnung nicht bestimmt)");

  const stab = erg.filter(r => r.urteil === "bestätigt" && r.stabil);
  console.log(`  linear stabil unter den bestätigten: ${stab.length}` + (stab.length ? " — " + stab.slice(0, 30).map(r => r.name + (satz === "gleich" ? "" : "(" + r.m.join("/") + ")")).join(", ") : ""));

  writeFileSync(join(HIER, "ergebnisse", `katalogabgleich-${satz}.json`),
    JSON.stringify({ satz, datum: new Date().toISOString(), dauerSekunden: dauer, faeden: schwarm.faeden, bahnen: erg }, null, 0));
}
await schwarm.ende();
process.exit(schlimm ? 1 : 0);
