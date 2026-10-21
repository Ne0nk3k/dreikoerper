// dreikoerper/katalog-gross-bauen.mjs — der große Katalog für gleiche Massen.
//
//   node katalog-gross-bauen.mjs
//
// Liest die Listen aus quelle\hristov\ (siehe LIESMICH.md dort) und schreibt
//   katalog-gross-euler.bin   Float64: a, b, T, T*  je Zeile
//   katalog-gross-fall.bin    dasselbe für den freien Fall
//   katalog-gross-*.q         Uint8: Nummer der Quelle je Zeile
//   katalog-gross.json        Quellen und Zahlen
//
// Die Stellen jenseits von double gehen hier verloren; für den Abgleich
// (|Δ| < 1e-6) reicht double, für den Ziffernvergleich liest pruef-hristov.mjs
// die Textdateien selbst.

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { HIER } from "./quellen.mjs";

const H = join(HIER, "quelle", "hristov");
const QUELLEN = {
  euler: [
    ["euler/60digits.txt",          "Hristov & Hristova, Nachtrag zu arXiv:2404.16526 (421 562 Anfangswerte, T* < 211)"],
    ["euler/100_12431.txt",         "Hristov & Hristova, arXiv:2404.16526"],
    ["euler/add_332_100.txt",       "Hristov & Hristova, arXiv:2404.16526 (nahe E = 0)"],
    ["stab971/ics_971_100.txt",     "Hristov, Hristova & Tanikawa, arXiv:2510.22802 (linear stabil)"],
    ["sym4860/euler_100_4860.txt",  "Hristov u. a., arXiv:2503.00432 (Punktsymmetrie)"],
    ["sat821/all_150_digits.txt",   "Hristov u. a., arXiv:2203.02793 (Satelliten der Acht)"],
    ["neu123/all_150_digits_123.txt", "Hristov u. a., arXiv:2205.14709 (105 neue Familien)"],
    ["chor164/triv_180.txt",        "Hristov u. a., Phys. Part. Nuclei 55 (2024) (triviale Choreographien)"],
    ["chor164/nontriv_180.txt",     "Hristov u. a., Phys. Part. Nuclei 55 (2024) (nichttriviale Choreographien)"],
    ["chor462/digits180.txt",       "Hristov u. a., arXiv:2210.00594 (triviale Choreographien)"],
  ],
  fall: [
    ["free/sol_80.txt",             "Hristov, Hristova, Dmitrašinović & Tanikawa, arXiv:2308.16159"],
    ["sym4860/free_100_4860.txt",   "Hristov u. a., arXiv:2503.00432 (Punktsymmetrie)"],
  ]
};

const meta = { erzeugt: new Date().toISOString().slice(0, 10), abgerufen: "01.10.2026, db2.fmi.uni-sofia.bg", ebenen: {} };
let fehlt = 0;
for (const [ebene, liste] of Object.entries(QUELLEN)) {
  const werte = [], quelle = [], info = [];
  liste.forEach(([datei, zitat], nr) => {
    const pfad = join(H, datei);
    if (!existsSync(pfad)) { console.error(`FEHLT: ${datei} (siehe quelle/hristov/LIESMICH.md)`); fehlt++; info.push({ datei, zitat, zeilen: 0, fehlt: true }); return; }
    let n = 0, kaputt = 0;
    for (const zeile of readFileSync(pfad, "utf8").split(/\r?\n/)) {
      if (!zeile.trim()) continue;
      const v = zeile.trim().split(/\s+/).slice(0, 4).map(Number);
      if (v.length < 4 || !v.every(Number.isFinite)) { kaputt++; continue; }
      werte.push(v[0], v[1], v[2], v[3]); quelle.push(nr); n++;
    }
    info.push({ datei, zitat, zeilen: n, unlesbar: kaputt });
    console.log(`  ${ebene.padEnd(6)} ${datei.padEnd(34)} ${String(n).padStart(7)} Zeilen` + (kaputt ? `, ${kaputt} unlesbar` : ""));
  });
  writeFileSync(join(HIER, `katalog-gross-${ebene}.bin`), Buffer.from(new Float64Array(werte).buffer));
  writeFileSync(join(HIER, `katalog-gross-${ebene}.q`), Buffer.from(new Uint8Array(quelle).buffer));
  meta.ebenen[ebene] = { anzahl: quelle.length, quellen: info };
  console.log(`  ${ebene}: ${quelle.length} Anfangswerte`);
}
writeFileSync(join(HIER, "katalog-gross.json"), JSON.stringify(meta, null, 1));
process.exit(fehlt ? 1 : 0);
