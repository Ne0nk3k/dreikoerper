// Eichung an Li, Jing & Liao (2018), Zusatzdaten (pasj_70_4_64_s5.pdf, Text vorher herausgezogen):
// ihr Urteil S/M/U je Bahn gegen unsere 30-Stellen-Probe an der Listenmasse.
//   node werkzeug/eichung-liliao.mjs quelle/liliao-2018-zusatz.txt ergebnisse/eichung-liliao-2018.json
// (dreikoerper/werkzeug/eichung-liliao.mjs, 12.11.2026; Felix: Eichung vor jeder Veröffentlichung)
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { HIER, ladeKatalog } from "../quellen.mjs";
const [textDatei, ausDatei] = process.argv.slice(2);
const t = readFileSync(textDatei, "latin1").split(/\r?\n/).join(" ");
// „I:C“ statt „I.C“: Druckfehler der Zusatzdaten bei I.C-1 und I.C-2 (m3 = 2) — ohne „[.:]“ fehlten
// genau diese zwei der 1349 Zeilen (12.11.2026)
const re = /(I{1,2})[.:]([A-D])\s+i:c:\s+(\d+)\s+\(([\d.]+)\)\s+([\d.]+)\s+([\d.]+)\s+([\d.]+)\s+([\d.]+)\s+(\d+)\s+([SMU])\s+(\S+)\s+(\S+)\s+(\S+)/g;
const zahl = x => (x === "-" ? null : +x);
const L = []; let m;
while ((m = re.exec(t))) { m.splice(1, 2, `${m[1]}.${m[2]}`); L.push({ name: `${m[1]}-${m[2]}`, m3: +m[3], v1: +m[4], v2: +m[5], T: +m[6], Ts: +m[7], Lf: +m[8], urteil: m[9], nu1: zahl(m[10]), nu2: zahl(m[11]), mu: zahl(m[12]) }); }
const K = ladeKatalog().bahnen.filter(b => b.satz === "ungleich");
const O = join(HIER, "ergebnisse", "listenfortsetzung");
const z = { S: {}, M: {}, U: {} }, beispiele = { S: [], M: [], U: [] }; let katalogGleich = 0, katalogFehlt = 0;
for (const b of L) {
  const k = K.find(x => x.name === b.name && x.m[2] === b.m3);
  if (!k) katalogFehlt++; else if (Math.abs(k.a - b.v1) < 1e-8 && Math.abs(k.b - b.v2) < 1e-8) katalogGleich++;
  const d = `${b.name}-${b.m3}`, p = join(O, d + "-genau.json");
  const G = existsSync(p) ? JSON.parse(readFileSync(p, "utf8")).punkte.find(g => g.ok && Math.abs(g.m3 - b.m3) < 1e-9) : null;
  b.wir = G ? { urteil: G.urteil, s1: G.s1, s2: G.s2, komplex: !!G.komplex, rand: G.rand } : null;
  const w = !G ? "keine Probe" : G.urteil === "stabil" ? (G.rand < 1e-6 ? "stabil, Rand < 1e-6" : "stabil") : G.urteil === "instabil" ? (G.rand > -1e-6 ? "instabil, Rand > -1e-6" : "instabil") : G.urteil;
  z[b.urteil][w] = (z[b.urteil][w] || 0) + 1;
  if (G && ((b.urteil === "S" && G.urteil !== "stabil") || (b.urteil === "U" && G.urteil === "stabil")) && beispiele[b.urteil].length < 12)
    beispiele[b.urteil].push(`${d}: sie ${b.urteil} (ν ${b.nu1 ?? "–"}/${b.nu2 ?? "–"}, μ ${b.mu ?? "–"}), wir ${G.urteil} s ${G.s1.toFixed(6)}/${G.s2.toFixed(6)} Rand ${G.rand.toExponential(1)}`);
}
const zaehl = u => L.filter(b => b.urteil === u).length;
console.log(`gelesen: ${L.length} Bahnen (S ${zaehl("S")}, M ${zaehl("M")}, U ${zaehl("U")}); Anfangswerte wie unser Katalog: ${katalogGleich}, im Katalog nicht gefunden: ${katalogFehlt}`);
for (const u of ["S", "M", "U"]) console.log(`sie ${u}:`, JSON.stringify(z[u]));
for (const u of ["S", "U"]) if (beispiele[u].length) console.log(`Widersprüche bei ${u}:\n  ` + beispiele[u].join("\n  "));
// die S-Bahnen einzeln, mit ihren Indizes s = 2 cos 2πν gegen unsere
console.log("ihre 23 linear stabilen:");
for (const b of L.filter(b => b.urteil === "S")) console.log(`  ${(b.name + " (" + b.m3 + ")").padEnd(16)} sie s = ${[b.nu1, b.nu2].filter(x => x != null).map(n => (2 * Math.cos(2 * Math.PI * n)).toFixed(6)).join(" / ").padEnd(22)} wir: ${b.wir ? b.wir.urteil + " s = " + b.wir.s1.toFixed(6) + " / " + b.wir.s2.toFixed(6) + ", Rand " + b.wir.rand.toExponential(1) : "keine Probe"}`);
writeFileSync(ausDatei, JSON.stringify({ quelle: "Li, Jing & Liao (2018), PASJ 70, 64, Zusatzdaten pasj_70_4_64_s5.pdf (Verlag OUP); Text am 12.11.2026 herausgezogen. Nur zum Abgleich, nicht zur Weitergabe: ihre Werte stehen hier nur, um sie neben unsere zu legen.", bahnen: L }, null, 1));
