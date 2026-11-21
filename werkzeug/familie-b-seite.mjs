// dreikoerper/werkzeug/familie-b-seite.mjs — Familie B zum Anfassen, als eine Datei (05.11.2026)
//
//   node werkzeug/familie-b-seite.mjs [--fassung v1] [--neu]
//
// werkzeug/familie-b-seite.html + kern.js + die Fortsetzung von Familie B
//   →  Desktop\werke\familie-b-<fassung>.html   (ohne Desktop\werke: labor\ neben dem Projekt)
//
// Der Kern wird wörtlich eingesetzt wie im Labor (bauen.mjs): die Seite rechnet
// jede Bahn im Browser selbst — Startwert aus der Fortsetzung, Newton, Abtastung,
// Monodromie. Eingebettet sind nur die 133 Fortsetzungspunkte (double) und die
// 32 Stützstellen auf 30 Stellen fürs Diagramm. Kein Netz, kein CDN.
// Ersetzt wird mit einer Funktion, nicht mit einer Zeichenkette: ein „$'“ im
// eingesetzten Text würde sonst als Muster gelesen (diagnose-handwerk, 20.10.2026).

import { homedir } from "node:os";
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { HIER } from "../quellen.mjs";

const argv = process.argv.slice(2);
const fassung = argv.includes("--fassung") ? argv[argv.indexOf("--fassung") + 1] : "v1";
const WERKE = join(homedir(), "Desktop", "werke");
const ordner = existsSync(WERKE) ? WERKE : join(HIER, "labor");
mkdirSync(ordner, { recursive: true });
const ziel = join(ordner, `familie-b-${fassung}.html`);
if (existsSync(ziel) && !argv.includes("--neu")) {
  console.error(`${ziel} gibt es schon. Ausgelieferte Fassungen werden nicht überschrieben: --fassung v2, oder --neu.`);
  process.exit(2);
}

const kern = readFileSync(join(HIER, "kern.js"), "utf8").replace(/\nif \(typeof module[\s\S]*$/, "\n");
const R = JSON.parse(readFileSync(join(HIER, "ergebnisse", "fortsetzung-1-1-5-b.json"), "utf8"));
const G = JSON.parse(readFileSync(join(HIER, "ergebnisse", "fortsetzung-1-1-5-b-genau.json"), "utf8")).punkte.filter(p => p.ok);
const runde = (x, n) => +(+x).toPrecision(n);
const fort = [...R.richtungen.abwaerts.punkte, ...R.richtungen.aufwaerts.punkte,
  { m3: R.start.m3 ?? 5, a: +R.start.a, b: +R.start.b, T: +R.start.T, s1: R.kalibrierung.start.s1, s2: R.kalibrierung.start.s2, komplex: false }]
  .filter(p => p.m3 >= 3.9 && p.m3 <= 5.35)
  // dazu die 30-Stellen-Stützstellen als Startwerte: dicht an den Grenzen und an der Berührstelle
  .concat(G.map(p => ({ m3: p.m3, a: +p.a, b: +p.b, T: +p.T, s1: p.s1, s2: p.s2, komplex: !!p.komplex })))
  .map(p => ({ m3: runde(p.m3, 13), a: runde(p.a, 15), b: runde(p.b, 15), T: runde(p.T, 15), s1: runde(p.s1, 7), s2: runde(p.s2, 7), k: p.komplex ? 1 : 0 }))
  .sort((x, y) => x.m3 - y.m3)
  .filter((p, i, alle) => i === 0 || p.m3 - alle[i - 1].m3 > 1e-12);
// das stabile Fenster der 30-Stellen-Proben um m3 = 5 (Berührproben bei −2 zählen dazu, wie im B-Repo)
const genau = G.map(p => ({ m3: p.m3, s1: runde(p.s1, 8), s2: runde(p.s2, 8), k: p.komplex ? 1 : 0, u: p.urteil })).sort((x, y) => x.m3 - y.m3);
const drin = p => p.u === "stabil" || (p.u === "an der Grenze" && !p.k && Math.min(p.s1, p.s2) < 0);
const i5 = genau.findIndex(p => Math.abs(p.m3 - 5) < 0.02 && drin(p));
let lo = i5, hi = i5;
while (lo > 0 && drin(genau[lo - 1])) lo--;
while (hi < genau.length - 1 && drin(genau[hi + 1])) hi++;
const daten = { fortsetzung: fort, genau, fenster: [genau[lo].m3, genau[hi].m3] };

const json = JSON.stringify(daten);
for (const [n, t] of [["kern.js", kern], ["Daten", json]]) if (t.includes("</script")) throw new Error(n + " enthält </script");
let html = readFileSync(join(HIER, "werkzeug", "familie-b-seite.html"), "utf8");
for (const [platz, inhalt] of [["/*KERN*/", kern], ["/*DATEN*/", json]]) {
  if (html.split(platz).length !== 2) throw new Error("Platzhalter " + platz + " nicht genau einmal");
  html = html.replace(platz, () => inhalt);
}
writeFileSync(ziel, html);
console.log(`${ziel}: ${(html.length / 1024).toFixed(0)} KB, ${fort.length} Fortsetzungspunkte, ${genau.length} Stützstellen, Fenster ${daten.fenster.join(" … ")}`);
