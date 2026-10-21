// dreikoerper/bauen.mjs — setzt das Labor zu einer Datei zusammen.
//
//   node bauen.mjs [--fassung v1]
//
// vorlage.html + kern.js + Kataloge  →  Desktop\werke\dreikoerper-labor-<fassung>.html
//
// Der Kern wird wörtlich eingesetzt (dieselbe Datei, die die Prüfbatterie
// prüft). Die Kataloge werden auf das verdichtet, was das Labor braucht:
//   KATALOG — Li/Liao und 2013 mit Namen und Klassen, alle Massen
//   GROSS   — Hristov u. a., gleiche Massen: Ort und Periode, zwölf Bytes je
//             Eintrag; Euler-Ebene nur bis T = 40 (darüber wäre die Datei
//             mehrere Megabyte groß; die Suchmaschine in Node hat alles)
//
// Eine bestehende Fassung wird nicht überschrieben, außer mit --neu.

import { homedir } from "node:os";
import { readFileSync, writeFileSync, existsSync, readdirSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { HIER, ladeKatalog, ladeGross } from "./quellen.mjs";

const argv = process.argv.slice(2);
const fassung = argv.includes("--fassung") ? argv[argv.indexOf("--fassung") + 1] : "v1";
// Das Projekt liegt seit dem 03.10.2026 in Documents\Projekte, die Werke auf dem Desktop.
// Wo es keinen Ordner Desktop\werke gibt (jeder andere Rechner, seit das Repo
// öffentlich ist), landet das Labor in labor\ neben diesem Skript.
const WERKE = join(homedir(), "Desktop", "werke");
const ziel = join(existsSync(WERKE) ? WERKE : join(HIER, "labor"), `dreikoerper-labor-${fassung}.html`);
if (existsSync(ziel) && !argv.includes("--neu")) {
  console.error(`${ziel} gibt es schon. Ausgelieferte Fassungen werden nicht überschrieben: --fassung v2, oder --neu, solange v1 noch nicht ausgeliefert ist.`);
  process.exit(2);
}

const T_EULER = 40;
const kern = readFileSync(join(HIER, "kern.js"), "utf8").replace(/\nif \(typeof module[\s\S]*$/, "\n");
if (kern.includes("</script")) throw new Error("kern.js enthält </script");

// ── kleiner Katalog ──
const kat = ladeKatalog();
const saetze = [], massen = [];
const nr = (liste, wert) => { let i = liste.indexOf(wert); if (i < 0) { i = liste.length; liste.push(wert); } return i; };
const massenText = [];
const bahnen = kat.bahnen.map(b => {
  const mi = nr(massenText, b.m.join("/")); massen[mi] = b.m;
  return [nr(saetze, b.quelle), b.name, b.rufname || "", mi, b.ebene === "fall" ? 1 : 0, b.a, b.b, b.T, b.Ts, b.kennung || ""];
});
const KATALOG = { saetze, massen, bahnen };

// ── großer Katalog ──
const G = ladeGross(), GROSS = { ebenen: {} };
const pack = (g, grenze) => {
  const idx = g.imFenster(0, 0.99999, 0, 0.99999, grenze), buf = Buffer.alloc(idx.length * 12);
  idx.forEach((i, k) => {
    buf.writeUInt32LE(Math.min(4294967295, Math.round(g.w[4 * i] * 4294967296)), 12 * k);
    buf.writeUInt32LE(Math.min(4294967295, Math.round(g.w[4 * i + 1] * 4294967296)), 12 * k + 4);
    buf.writeFloatLE(g.w[4 * i + 2], 12 * k + 8);
  });
  return { daten: buf.toString("base64"), anzahl: idx.length, tGrenze: grenze };
};
GROSS.ebenen.euler = pack(G.euler, T_EULER);
GROSS.ebenen.fall = pack(G.fall, 1e9);
GROSS.ebenen.fall.tGrenze = Math.floor(Math.max(...Array.from({ length: G.fall.n }, (_, i) => G.fall.w[4 * i + 2])));

// ── Fundus: was die Suchmaschine gefunden hat und was stabil ist oder es sein kann ──
// Aus allen Laufberichten in ergebnisse\, mit dem Urteil der Nachprüfung, wo es
// eines gibt. Aufgenommen wird eine Bahn, wenn sie
//   s  in Festkomma (30 Stellen) stabil ist,
//   g  dort genau an der Grenze liegt,
//   d  in doppelter Genauigkeit sicher stabil ist,
//   l  in double offen ist, aber in der Liste der 971 stabilen von Hristov u. a. steht,
//   o  in double offen ist UND beide Indizes unter 3 liegen (ein echter Kandidat).
// Nicht aufgenommen: „offen" mit riesigen Indizes — das sind verdorbene
// Monodromien empfindlicher Bahnen, keine Kandidaten.
const FUNDUS = (() => {
  const ordner = join(HIER, "ergebnisse"), rang = { s: 0, h: 1, g: 2, d: 3, l: 4, o: 5 }, eintraege = [], massen = [];
  const stab971 = readFileSync(join(HIER, "quelle", "hristov", "stab971", "ics_971_100.txt"), "utf8").split(/\r?\n/).filter(x => x.trim()).map(l => l.trim().split(/\s+/).map(Number));
  const inStab971 = (a, b) => stab971.some(v => Math.abs(v[0] - Math.abs(a)) < 1e-6 && Math.abs(v[1] - Math.abs(b)) < 1e-6);
  const ort = (a, b) => Math.round(Math.abs(a) * 1e9) + ":" + Math.round(Math.abs(b) * 1e9);
  for (const datei of readdirSync(ordner).filter(n => n.endsWith(".json") && !n.endsWith("-genau.json") && !n.startsWith("katalogabgleich") && n !== "funde.json")) {
    const lauf = JSON.parse(readFileSync(join(ordner, datei), "utf8"));
    if (!lauf.lauf || !lauf.funde) continue;
    const gp = join(ordner, lauf.lauf + "-genau.json"), P = lauf.parameter;
    const genau = existsSync(gp) ? new Map(JSON.parse(readFileSync(gp, "utf8")).geprueft.filter(r => r.start).map(r => [ort(r.start[0], r.start[1]), r])) : new Map();
    const gleich = P.m.every(x => x === 1);
    for (const f of lauf.funde) {
      if (f.weitereLage) continue;                                   // dieselbe Bahn an anderer Stelle: einmal genügt
      const r = genau.get(ort(f.a, f.b)), sg = r && r.stabilGenau && r.stabilGenau.urteil;
      const nah = Number.isFinite(f.s1) && Math.abs(f.s1) < 3 && Math.abs(f.s2) < 3;
      const rand = r && r.stabilGenau && Number.isFinite(r.stabilGenau.s1) ? 2 - Math.max(Math.abs(r.stabilGenau.s1), Math.abs(r.stabilGenau.s2)) : NaN;
      const u = sg === "stabil" ? (rand < 1e-3 ? "h" : "s") : sg === "an der Grenze" ? "g" : sg ? null : f.stabil === true ? "d"
        : f.stabil === false ? null : gleich && P.ebene === "euler" && inStab971(f.a, f.b) ? "l" : nah ? "o" : null;
      if (!u) continue;
      const k = f.katalog || {}, name = k.stufe === "ort" || k.stufe === "lage" ? (k.rufname || "Bahn " + k.name) + (k.stufe === "lage" ? " (andere Lage)" : "") : "";
      eintraege.push({ ebene: P.ebene, m: P.m, a: r && r.a ? +r.a : f.a, b: r && r.b ? +r.b : f.b, T: r && r.T ? +r.T : f.T, Ts: f.Ts, u, gelistet: !!f.bekannt, name, kennung: f.kennung || "",
                       satellit: f.satellit ? `Satellit ${f.satellit.ordnung}. Ordnung von ${f.satellit.von}` : "", lauf: lauf.lauf });
    }
  }
  // dieselbe Bahn aus mehreren Läufen: die mit dem härteren Urteil bleibt
  eintraege.sort((x, y) => rang[x.u] - rang[y.u]);
  const einmal = [];
  for (const e of eintraege) if (!einmal.some(q => q.ebene === e.ebene && q.m.join() === e.m.join() && (Math.hypot(Math.abs(q.a) - Math.abs(e.a), Math.abs(q.b) - Math.abs(e.b)) < 1e-6 || Math.abs(q.Ts / e.Ts - 1) < 1e-8))) einmal.push(e);
  einmal.sort((x, y) => x.m.join().localeCompare(y.m.join()) || x.T - y.T);
  const mNr = m => { let i = massen.findIndex(q => q.join() === m.join()); if (i < 0) { i = massen.length; massen.push(m); } return i; };
  return { massen, zahl: Object.fromEntries(Object.keys(rang).map(u => [u, einmal.filter(e => e.u === u).length])),
           bahnen: einmal.map(e => [e.ebene === "fall" ? 1 : 0, mNr(e.m), e.a, e.b, e.T, +e.Ts.toPrecision(10), e.u, e.gelistet ? 1 : 0, e.name, e.kennung, e.satellit]) };
})();

// ── Geprüft: was die Suchmaschine schon gegen die GANZEN Listen gehalten hat ──
// Das Labor trägt die große Liste nur bis zu einer Periode und vergleicht dort
// nur den Ort. Die Suchmaschine vergleicht auch die skalierte Periode T*,
// gegen alle Listen. Hier je Massensatz die T* aller Funde ihrer Läufe mit
// dem Urteil (1 gelistet, 0 nicht). T* hängt nicht an der Ebene: eine Bahn mit
// Ruhepunkt UND Euler-Aufstellung steht unter beiden gleich.
const GEPRUEFT = (() => {
  const ordner = join(HIER, "ergebnisse"), saetze = new Map();
  for (const datei of readdirSync(ordner).filter(n => n.endsWith(".json") && !n.endsWith("-genau.json") && !n.startsWith("katalogabgleich") && n !== "funde.json")) {
    const lauf = JSON.parse(readFileSync(join(ordner, datei), "utf8"));
    if (!lauf.lauf || !lauf.funde) continue;
    const k = lauf.parameter.m.join(",");
    if (!saetze.has(k)) saetze.set(k, { m: lauf.parameter.m, l: [] });
    // dazu das Stabilitätsurteil aus 30 Stellen, wo es eines gibt: s stabil, g Grenze, i instabil
    const gp = join(ordner, lauf.lauf + "-genau.json"), ortG = (a, b) => Math.round(Math.abs(a) * 1e9) + ":" + Math.round(Math.abs(b) * 1e9);
    const genau = existsSync(gp) ? new Map(JSON.parse(readFileSync(gp, "utf8")).geprueft.filter(r => r.start).map(r => [ortG(r.start[0], r.start[1]), r])) : new Map();
    for (const f of lauf.funde) if (f.Ts > 0) {
      const r = genau.get(ortG(f.a, f.b)), u = r && r.stabilGenau && r.stabilGenau.urteil;
      const rand = r && r.stabilGenau && Number.isFinite(r.stabilGenau.s1) ? 2 - Math.max(Math.abs(r.stabilGenau.s1), Math.abs(r.stabilGenau.s2)) : NaN;
      saetze.get(k).l.push([f.Ts, f.bekannt ? 1 : 0, u === "stabil" ? (rand < 1e-3 ? "h" : "s") : u === "an der Grenze" ? "g" : u === "instabil" ? "i" : "-",
                            f.satellit ? `Satellit ${f.satellit.ordnung}. Ordnung von ${f.satellit.von}` : ""]);
    }
  }
  return [...saetze.values()].map(({ m, l }) => {
    l.sort((x, y) => x[0] - y[0]);
    const einmal = [];
    for (const x of l) { const v = einmal[einmal.length - 1]; if (v && Math.abs(x[0] / v[0] - 1) < 2e-8) { v[1] = v[1] || x[1]; if (v[2] === "-") v[2] = x[2]; if (!v[3]) v[3] = x[3]; continue; } einmal.push(x.slice()); }
    // Satelliten nur dort, wo es einen gibt: {Nummer: Text}
    const sat = {}; einmal.forEach((x, i) => { if (x[3]) sat[i] = x[3]; });
    return { m, t: einmal.map(x => +x[0].toPrecision(13)), g: einmal.map(x => x[1]).join(""), s: einmal.map(x => x[2]).join(""), sat };
  });
})();

let html = readFileSync(join(HIER, "vorlage.html"), "utf8");
const setze = (marke, text) => { if (html.split(marke).length !== 2) throw new Error("Marke fehlt oder doppelt: " + marke); html = html.replace(marke, () => text); };
setze("/*__KERN__*/", kern);
setze("/*__KATALOG__*/null", JSON.stringify(KATALOG));
setze("/*__GROSS__*/null", JSON.stringify(GROSS));
setze("/*__FUNDUS__*/null", JSON.stringify(FUNDUS));
setze("/*__GEPRUEFT__*/null", JSON.stringify(GEPRUEFT));
// Das Seitensymbol: im eigenen Fenster (Startprogramm, --app) wird es zum
// Symbol in Titelleiste und Taskleiste. Eingebettet, damit es bei der einen
// Datei bleibt.
const symbol = join(HIER, "symbol", "dreikoerper-128.png");
if (!existsSync(symbol)) throw new Error("Symbol fehlt: erst node symbol.mjs");
setze("<!--__SYMBOL__-->", `<link rel="icon" type="image/png" href="data:image/png;base64,${readFileSync(symbol).toString("base64")}">`);
if (/https?:\/\/(?!www\.w3\.org)/.test(html.replace(/\/\/[^\n]*/g, ""))) console.warn("Achtung: die Datei nennt eine Netzadresse außerhalb von Kommentaren.");
mkdirSync(dirname(ziel), { recursive: true });
writeFileSync(ziel, html);

const kb = x => (x / 1024).toFixed(0) + " KB";
console.log(`${ziel}`);
console.log(`  ${kb(html.length)} gesamt · Kern ${kb(kern.length)} · Li/Liao ${bahnen.length} Bahnen (${kb(JSON.stringify(KATALOG).length)}) · Hristov u. a. Euler bis T = ${T_EULER}: ${GROSS.ebenen.euler.anzahl}, freier Fall: ${GROSS.ebenen.fall.anzahl} (${kb(JSON.stringify(GROSS).length)})`);
console.log(`  Fundus: ${FUNDUS.bahnen.length} Bahnen (${kb(JSON.stringify(FUNDUS).length)}) — stabil auf 30 Stellen ${FUNDUS.zahl.s}, um Haaresbreite ${FUNDUS.zahl.h}, Index exakt 2 ${FUNDUS.zahl.g}, stabil in double ${FUNDUS.zahl.d}, stabil laut Liste ${FUNDUS.zahl.l}, offen nahe der Grenze ${FUNDUS.zahl.o}`);
// Seit v6 getrennt: was in keiner Liste steht (Reiter „Fundus") und was bekannt ist (Reiter „Schaukasten")
{
  const un = FUNDUS.bahnen.filter(z => !z[7]), je = u => un.filter(z => z[6] === u).length;
  const massen = [...new Set(un.map(z => FUNDUS.massen[z[1]].join("/")))].map(s => `${s}: ${un.filter(z => FUNDUS.massen[z[1]].join("/") === s).length}`).join(", ");
  console.log(`  davon außerhalb der Listen (Fundus): ${un.length} — stabil auf 30 Stellen ${je("s")}, um Haaresbreite ${je("h")}, Index exakt 2 ${je("g")}, stabil in double ${je("d")}, offen ${je("o")}; darunter Satelliten bekannter Bahnen ${un.filter(z => z[10]).length}; nach Gewichten ${massen || "—"}`);
  console.log(`  bekannt (Schaukasten): ${FUNDUS.bahnen.length - un.length}`);
  console.log(`  von der Suchmaschine geprüft (nach T*): ${GEPRUEFT.map(s => `${s.m.join("/")}: ${s.t.length} Bahnen, ${s.g.split("1").length - 1} gelistet, ${s.s.replace(/-/g, "").length} mit Stabilität aus 30 Stellen`).join("; ")} (${kb(JSON.stringify(GEPRUEFT).length)})`);
}
