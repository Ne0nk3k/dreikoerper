// dreikoerper/werkzeug/woerter-hristov.mjs — die massenfreien Wörter der
// Liste aus Sofia (gleiche Massen, Euler-Ebene, 441 985 Anfangswerte), damit
// familien-abgleich.mjs eine Familie nur dann „in keiner Liste“ nennt, wenn ihr
// Wort auch dort fehlt (21.10.2026).
//
//   node werkzeug/woerter-hristov.mjs              alles, sieben Prozesse
//   node werkzeug/woerter-hristov.mjs --teil k n   intern: jede n-te Bahn ab k
//
// Je Bahn ein Umlauf in double (durchgaenge, wie im Fundprüfer), daraus
// kennung(folge, null) — alle Vertauschungen, Drehung, Zeitumkehr — und davon
// der 53-Bit-Streuwert. Geschätzt aus dem Katalogabgleich: 21 ms je Bahn.
// Ergebnis: woerter-hristov.json im Hauptordner (aus fremden Daten gebaut,
// geht nicht in die öffentliche Fassung): { streuwert: [Anzahl, Index, T*] }.

import { writeFileSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import { setPriority, constants } from "node:os";
import { HIER, ladeKern, ladeGross } from "../quellen.mjs";

try { setPriority(constants.priority.PRIORITY_LOW); } catch { /* ohne Recht */ }
const argv = process.argv.slice(2);

if (argv[0] === "--teil") {
  const k = +argv[1], n = +argv[2], K = ladeKern(), G = ladeGross().euler, m = [1, 1, 1], u0 = new Float64Array(12);
  const aus = {}; let leer = 0, gerechnet = 0;
  for (let i = k; i < G.n; i += n) {
    const a = G.w[4 * i], b = G.w[4 * i + 1], T = G.w[4 * i + 2], Ts = G.w[4 * i + 3];
    K.EBENEN.euler.anfang(a, b, m, u0);
    const dg = K.durchgaenge(u0, m, T, 1e-11);
    if (!dg.folge || !dg.folge.length) { leer++; continue; }
    const s = K.streu(K.kennung(dg.folge, null));
    if (aus[s]) aus[s][0]++; else aus[s] = [1, i, Ts];
    gerechnet++;
  }
  writeFileSync(join(HIER, "ablage", `woerter-hristov-${k}.json`), JSON.stringify({ gerechnet, leer, woerter: aus }));
  process.exit(0);
}

const N = 7, t0 = Date.now(), selbst = fileURLToPath(import.meta.url);
console.log(`${N} Prozesse, jede ${N}. Bahn`);
await Promise.all(Array.from({ length: N }, (_, k) => new Promise((ok, schlecht) => {
  const c = spawn(process.execPath, [selbst, "--teil", String(k), String(N)], { stdio: "inherit" });
  c.on("close", code => (code === 0 ? ok() : schlecht(new Error(`Teil ${k}: Exit ${code}`))));
})));
const alle = {}; let gerechnet = 0, leer = 0;
for (let k = 0; k < N; k++) {
  const t = JSON.parse(readFileSync(join(HIER, "ablage", `woerter-hristov-${k}.json`), "utf8"));
  gerechnet += t.gerechnet; leer += t.leer;
  for (const [s, v] of Object.entries(t.woerter)) { if (alle[s]) { alle[s][0] += v[0]; if (v[2] < alle[s][2]) { alle[s][1] = v[1]; alle[s][2] = v[2]; } } else alle[s] = v; }
}
writeFileSync(join(HIER, "woerter-hristov.json"), JSON.stringify({ erzeugt: new Date().toISOString(), gerechnet, leer, woerter: alle }));
console.log(`${gerechnet} Bahnen gerechnet, ${leer} ohne Folge, ${Object.keys(alle).length} verschiedene massenfreie Wörter, ${((Date.now() - t0) / 60000).toFixed(1)} min`);
