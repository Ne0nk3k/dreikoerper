// dreikoerper/werkzeug/spleissen.mjs — ersetzt in einer Datei den Text
// zwischen zwei Marken durch den Inhalt einer anderen Datei.
//
//   node werkzeug/spleissen.mjs ziel.js "Anfangsmarke" "Endmarke" ersatz.js
//
// Die Anfangsmarke wird mit ersetzt, die Endmarke bleibt stehen. Gibt es
// eine Marke nicht oder mehrfach, wird nichts geschrieben (Ausgang 1).

import { readFileSync, writeFileSync } from "node:fs";

const [ziel, von, bis, ersatz] = process.argv.slice(2);
const t = readFileSync(ziel, "utf8");
const a = t.indexOf(von), b = t.indexOf(bis, a + 1);
if (a < 0 || b < 0 || t.indexOf(von, a + 1) >= 0) {
  console.error(`Marke fehlt oder ist mehrdeutig: von=${a} bis=${b}`);
  process.exit(1);
}
const neu = readFileSync(ersatz, "utf8");
writeFileSync(ziel, t.slice(0, a) + neu + t.slice(b));
console.log(`${ziel}: ${b - a} Zeichen durch ${neu.length} ersetzt`);
