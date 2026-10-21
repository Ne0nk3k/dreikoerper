// dreikoerper/werkzeug/herkunft-bauen.mjs — schreibt quelle/HERKUNFT.json:
// für jede fremde Datei in quelle\ die Adresse beim Urheber, die Größe und die
// SHA-256 unserer Kopie. Damit holt daten-holen.mjs dieselben Bytes wieder,
// ohne dass die Listen selbst weitergegeben werden (21.10.2026, für GitHub:
// das Repo von Li/Liao hat keine Lizenz, die Datenbank in Sofia nennt keine).
//
//   node werkzeug/herkunft-bauen.mjs
//
// Welche Datei woher kam, ist nicht geraten: die sieben Markdown-Dateien von
// Li/Liao haben dieselbe Git-Blob-Prüfsumme wie die Dateien im Stand
// b96b019 ihres Repos (gemessen 21.10.2026); die Sofia-Dateien stehen so in
// den Verweisen der gespeicherten Seiten quelle/hristov/*.html.

import { readFileSync, writeFileSync, existsSync, statSync } from "node:fs";
import { createHash } from "node:crypto";
import { join } from "node:path";
import { HIER } from "../quellen.mjs";

const LIAO = "https://raw.githubusercontent.com/sjtu-liao/three-body/b96b0193579a9952299d710ed616f529bb7cf898/";
const SOFIA = "https://db2.fmi.uni-sofia.bg/";

// [Datei unter quelle\, Adresse, wozu, darf sich an der Quelle ändern]
const LISTE = [
  ["readme.md", LIAO + "README.md", "katalog-bauen.mjs"],
  ["equal.md", LIAO + "three-body-free-group-word.md", "katalog-bauen.mjs"],
  ["bilder.md", LIAO + "three-body-pictures.md", "katalog-bauen.mjs"],
  ["ungleich.md", LIAO + "three-body-unequal-mass-free-group-word.md", "katalog-bauen.mjs"],
  ["ungleich-bilder.md", LIAO + "three-body-unequal-mass-pictures.md", "katalog-bauen.mjs"],
  ["frei.md", LIAO + "free-fall-3b-free-group-word.md", "katalog-bauen.mjs"],
  ["frei-bilder.md", LIAO + "free-fall-3b-pictures.md", "katalog-bauen.mjs"],
  ["non-hierarchical-3b-supplementary_data.txt", LIAO + "non-hierarchical-3b-supplementary_data.txt", "werkzeug/nichthierarchisch-pruefen.mjs"],
  ...["case1_periodic_orbit.dat", "case2_periodic_orbit.dat", "case1_classification.dat", "case2_classification.dat"]
    .map(d => ["roadmap/" + d, LIAO + "roadmap/Data/" + d, "werkzeug/nichthierarchisch-pruefen.mjs"]),
  ["atlas/catalogue.json", "https://data.threebodyorbits.com/catalogue.json", "werkzeug/atlas-pruefen.mjs", true],
];
const ORDNER = {
  euler: "3bodyeuler/", free: "3bodyfree/", stab971: "3bodystab971/", sym4860: "3bodysym4860/",
  chor164: "3bodychor164/", chor462: "3bodychor462/datafiles/", sat821: "3body821/datafiles/", neu123: "3body123/datafiles/",
};
const SOFIA_DATEIEN = {
  euler: ["60digits.txt", "100_12431.txt", "100_free.txt", "100_stable.txt", "add_332_100.txt", "eigenvalues_12431.txt", "syz_12431.txt"],
  free: ["res_eigen.txt", "res_exponents.txt", "sd_80.txt", "sol_80.txt"],
  stab971: ["ics_971_100.txt", "ics_971_100_num.txt", "res_eig_angles.txt", "syzygies971.txt", "Broucke_num.txt", "Eight_num.txt", "Intermediate_Moth_num.txt", "Shubart_S_num.txt"],
  sym4860: ["euler_100_4860.txt", "free_100_4860.txt", "res_eigen.txt", "syzygies.txt"],
  chor164: ["triv_180.txt", "nontriv_180.txt", "eig_t.txt", "eig_nt.txt", "words_triv.txt", "words_nontriv.txt"],
  chor462: ["digits180.txt"],
  sat821: ["all_150_digits.txt"],
  neu123: ["all_150_digits_123.txt"],
};
const GELESEN = new Set(["euler/60digits.txt", "euler/100_12431.txt", "euler/add_332_100.txt", "stab971/ics_971_100.txt",
  "sym4860/euler_100_4860.txt", "sat821/all_150_digits.txt", "neu123/all_150_digits_123.txt", "chor164/triv_180.txt",
  "chor164/nontriv_180.txt", "chor462/digits180.txt", "free/sol_80.txt", "sym4860/free_100_4860.txt"]);
for (const [ordner, dateien] of Object.entries(SOFIA_DATEIEN))
  for (const d of dateien)
    LISTE.push(["hristov/" + ordner + "/" + d, SOFIA + ORDNER[ordner] + d,
      GELESEN.has(ordner + "/" + d) ? "katalog-gross-bauen.mjs" : "nur zum Nachlesen"]);

const eintraege = [];
let fehlt = 0;
for (const [datei, url, wozu, veraenderlich] of LISTE) {
  const pfad = join(HIER, "quelle", datei);
  if (!existsSync(pfad)) { console.error("FEHLT lokal:", datei); fehlt++; continue; }
  const sha256 = createHash("sha256").update(readFileSync(pfad)).digest("hex");
  eintraege.push({ datei: "quelle/" + datei, url, bytes: statSync(pfad).size, sha256, wozu, ...(veraenderlich ? { veraenderlich: true } : {}) });
}
const aus = {
  zweck: "Fremde Listen, die dieses Projekt liest, aber nicht weitergibt. daten-holen.mjs lädt sie von hier und prüft jede Datei gegen sha256.",
  stand: "Kopien vom 01.10.–02.10.2026; Atlas vom 27.09.2026",
  dateien: eintraege,
};
writeFileSync(join(HIER, "quelle", "HERKUNFT.json"), JSON.stringify(aus, null, 1) + "\n");
const summe = eintraege.reduce((s, e) => s + e.bytes, 0);
console.log(`${eintraege.length} Dateien, ${(summe / 1e6).toFixed(1)} MB, ${fehlt} fehlen lokal`);
process.exit(fehlt ? 1 : 0);
