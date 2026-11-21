// dreikoerper/werkzeug/pilot-fortsetzung.mjs — Stichprobe vor dem großen Vorhaben (06.11.2026):
// alle Familien von Li, Jing & Liao (2018) in m3 fortsetzen. Was kostet eine Familie, wie weit
// trägt die Fortsetzung, wo ist sie stabil, und steht sie bei anderen Listenmassen in der Liste?
//
//   node werkzeug/pilot-fortsetzung.mjs [--je 2] [--parallel 3]
//
// Je Listenmasse (0,5 0,75 2 4 5 8 10) zwei Bahnen, fest ausgelost (gleicher Seed, gleiche
// Auswahl). Jede läuft als eigener Prozess massen-fortsetzung.mjs --start … --name pilot-…,
// niedrige Priorität. Zusammenfassung nach ergebnisse/pilot-fortsetzung.json.

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { spawn } from "node:child_process";
import { setPriority, constants } from "node:os";
import { HIER, ladeKatalog } from "../quellen.mjs";

try { setPriority(constants.priority.PRIORITY_LOW); } catch { /* ohne Recht bleibt es normal */ }
const argv = process.argv.slice(2), arg = (n, v) => (argv.includes(n) ? +argv[argv.indexOf(n) + 1] : v);
const JE = arg("--je", 2), PARALLEL = arg("--parallel", 3);
const kat = ladeKatalog().bahnen.filter(b => b.satz === "ungleich");
let s = 20261106; const zufall = () => ((s = (Math.imul(s, 1103515245) + 12345) >>> 0) / 4294967296);
const auswahl = [];
for (const m3 of [...new Set(kat.map(b => b.m[2]))].sort((x, y) => x - y)) {
  const L = kat.filter(b => b.m[2] === m3);
  const genommen = new Set();
  while (genommen.size < Math.min(JE, L.length)) genommen.add(Math.floor(zufall() * L.length));
  for (const i of genommen) auswahl.push(L[i]);
}
const name = b => `pilot-${b.name.replace(/[^A-Za-z0-9.-]/g, "")}-${b.m[2]}`;
const zusammenfassen = (b, sek) => {
  const p = join(HIER, "ergebnisse", name(b) + ".json");
  if (!existsSync(p)) return { name: b.name, m3: b.m[2], T: b.T, Ts: b.Ts, sekunden: sek, fehler: "keine Ausgabe" };
  const R = JSON.parse(readFileSync(p, "utf8")), ab = R.richtungen.abwaerts, auf = R.richtungen.aufwaerts;
  const pkt = [...ab.punkte, ...auf.punkte];
  const stabilD = pkt.filter(q => q.stabil === true || q.stabil === "stabil").length;
  return { name: b.name, m3: b.m[2], T: b.T, Ts: b.Ts, sekunden: sek, von: ab.bis, bis: auf.bis, grundAb: ab.grund, grundAuf: auf.grund, punkte: pkt.length,
    stabilDouble: stabilD, rMin: Math.min(...pkt.map(q => q.rMin).filter(Number.isFinite)),
    grenzen: (R.grenzen || []).length,
    listen: (R.listen || []).map(l => ({ m3: l.m3, stufe: l.liliao && l.liliao.stufe, naechster: l.liliao && l.liliao.naechster, stabil: l.stabil })) };
};
const ergebnisse = []; let laufend = 0, i = 0; const t00 = Date.now();
await new Promise(fertig => {
  const weiter = () => {
    while (laufend < PARALLEL && i < auswahl.length) {
      const b = auswahl[i++], t0 = Date.now(); laufend++;
      const k = spawn(process.execPath, [join(HIER, "werkzeug", "massen-fortsetzung.mjs"), "--start", [b.m[2], b.a, b.b, b.T].join(","), "--name", name(b)], { stdio: "ignore" });
      k.on("exit", () => {
        laufend--; const e = zusammenfassen(b, (Date.now() - t0) / 1000); ergebnisse.push(e);
        console.log(`${e.name}@${e.m3}: ${e.sekunden.toFixed(0)} s, m3 ${e.von ?? "?"} … ${e.bis ?? "?"}, ${e.punkte ?? 0} Punkte, ${e.stabilDouble ?? 0} stabil (double), Listen: ${(e.listen || []).map(l => l.m3 + ":" + l.stufe + (l.stufe !== "keine" ? "=" + l.naechster : "")).join(" ")}`);
        writeFileSync(join(HIER, "ergebnisse", "pilot-fortsetzung.json"), JSON.stringify({ erzeugt: new Date().toISOString(), auswahl: auswahl.length, fertig: ergebnisse.length, sekunden: (Date.now() - t00) / 1000, ergebnisse }, null, 1));
        if (ergebnisse.length === auswahl.length) fertig(); else weiter();
      });
    }
  };
  weiter();
});
console.log(`fertig: ${ergebnisse.length} Familien in ${((Date.now() - t00) / 60000).toFixed(1)} min`);
