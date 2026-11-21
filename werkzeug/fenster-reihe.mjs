// dreikoerper/werkzeug/fenster-reihe.mjs — fenster-genau.mjs für mehrere Familien, mit fester
// Obergrenze an Prozessen (07.11.2026; Felix: bis 85 % CPU, gemessen: 8 Prozesse höchstens 85 %).
//
//   node werkzeug/fenster-reihe.mjs I.A-2-4 I.A-1-4 … [--familien 4] [--je 2]
//
// Je Familie ein fenster-genau.mjs mit --parallel <je>; höchstens <familien> zugleich, also
// höchstens familien × je Rechenprozesse. Anhalten: ablage/STOPP (keine neue Familie).

import { spawn } from "node:child_process";
import { existsSync, appendFileSync } from "node:fs";
import { join } from "node:path";
import { setPriority, constants } from "node:os";
import { HIER } from "../quellen.mjs";

try { setPriority(constants.priority.PRIORITY_LOW); } catch { /* ohne Recht bleibt es normal */ }
const argv = process.argv.slice(2), arg = (n, v) => (argv.includes(n) ? +argv[argv.indexOf(n) + 1] : v);
const FAM = arg("--familien", 4), JE = arg("--je", 2);
const liste = argv.filter((x, i) => !x.startsWith("--") && !(i > 0 && argv[i - 1].startsWith("--")));
const log = z => { const t = new Date().toLocaleTimeString("de-DE"); appendFileSync(join(HIER, "ablage", "fenster-genau.log"), `${t} Reihe: ${z}\n`); console.log(`${t} ${z}`); };
log(`${liste.length} Familien, ${FAM} zugleich, je ${JE} Ränder parallel`);
// Exit-Code der Kinder weitergeben (Code-Prüfung 15.11.2026, Befund 7: ein gestorbenes fenster-genau blieb
// sonst im Nachlauf unbemerkt, seine Ränder offen)
let i = 0, laufend = 0, fehlerKinder = 0;
await new Promise(fertig => {
  const weiter = () => {
    while (laufend < FAM && i < liste.length) {
      if (existsSync(join(HIER, "ablage", "STOPP"))) { log("STOPP: keine neue Familie"); i = liste.length; break; }
      const f = liste[i++]; laufend++; log(`${f} beginnt`);
      const p = spawn(process.execPath, [join(HIER, "werkzeug", "fenster-genau.mjs"), f, "--parallel", String(JE)], { stdio: "ignore" });
      p.on("exit", c => { laufend--; if (c !== 0) fehlerKinder++; log(`${f} Ende (Exit ${c})`); if (laufend === 0 && i >= liste.length) fertig(); else weiter(); });
    }
    if (laufend === 0 && i >= liste.length) fertig();
  };
  weiter();
});
log(`alle Familien fertig${fehlerKinder ? `, ${fehlerKinder} mit Fehler` : ""}`);
process.exit(fehlerKinder ? 1 : 0);
