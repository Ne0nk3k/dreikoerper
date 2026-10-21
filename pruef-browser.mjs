// dreikoerper/pruef-browser.mjs — läuft das ausgelieferte Labor im Browser?
//
//   node pruef-browser.mjs [--kopf] [--fassung v1]
//
// Öffnet werke\dreikoerper-labor-<fassung>.html als file://, ohne Netz, und
// prüft das, was die Kernbatterie nicht sehen kann: dass derselbe Kern in
// der Datei steckt, dass Karte, Verfeinern, Jagd, Störung und Laden wirklich
// etwas tun, und dass bei 1920 und 1280 nichts bricht. Bilder nach ablage\.
// Urteil im Exit-Code; 3 heißt: nicht gelaufen (kein Playwright).

import { homedir } from "node:os";
import { existsSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { pathToFileURL } from "node:url";
import { HIER, ladeKern, ladeQuellen } from "./quellen.mjs";

const argv = process.argv.slice(2);
const fassung = argv.includes("--fassung") ? argv[argv.indexOf("--fassung") + 1] : "v10";
const DESKTOP = join(homedir(), "Desktop"),       // das Projekt liegt seit dem 03.10.2026 in Documents\Projekte
      werke = join(DESKTOP, "werke"),              // ohne Desktop\werke (andere Rechner): labor\, wie bauen.mjs
      datei = join(existsSync(werke) ? werke : join(HIER, "labor"), `dreikoerper-labor-${fassung}.html`);
const orte = [join(HIER, "node_modules", "playwright", "index.mjs"), join(DESKTOP, "gehirn-werkstatt", "node_modules", "playwright", "index.mjs")];
if (process.env.APPDATA) orte.push(join(process.env.APPDATA, "npm", "node_modules", "playwright", "index.mjs"));
const PW = orte.find(existsSync);
if (!PW) { console.error("NICHT GELAUFEN: Playwright fehlt. Gesucht in:\n  " + orte.join("\n  ")); process.exit(3); }
if (!existsSync(datei)) { console.error("NICHT GELAUFEN: " + datei + " fehlt (node bauen.mjs)"); process.exit(3); }
const { chromium } = await import(pathToFileURL(PW).href);
const ablage = join(HIER, "ablage"); mkdirSync(ablage, { recursive: true });

let fehl = 0, gesamt = 0;
function pruefe(name, ok, wert) { gesamt++; if (!ok) fehl++; console.log(`  ${ok ? "ok  " : "FEHL"}  ${name}${wert !== undefined ? "   [" + wert + "]" : ""}`); }
const schlaf = ms => new Promise(r => setTimeout(r, ms));
const K = ladeKern(), Q = ladeQuellen();

const browser = await chromium.launch({ headless: !argv.includes("--kopf") });
const ctx = await browser.newContext({ viewport: { width: 1920, height: 1080 } });
const seite = await ctx.newPage();
const konsole = [], ausnahmen = [], netz = [];
seite.on("console", m => { if (m.type() === "error") konsole.push(m.text().slice(0, 300)); });
seite.on("pageerror", e => ausnahmen.push(String(e).slice(0, 400)));
await seite.route("**/*", r => { const u = r.request().url(); if (/^(file|data|blob|about):/i.test(u)) return r.continue(); netz.push(u); return r.abort(); });

const t0 = Date.now();
await seite.goto(pathToFileURL(datei).href);
await seite.waitForFunction(() => window.__d && window.__d.KA.gesamt > 0, null, { timeout: 20000 });
const warte = async (bedingung, ms, arg) => { try { await seite.waitForFunction(bedingung, arg, { timeout: ms }); return true; } catch (e) { return false; } };

console.log("\nA · Laden und Karte");
const karteDa = await warte(() => window.__d.KA.offen === 0, 180000);
const karte = await seite.evaluate(() => { const d = window.__d.KA.d; let endlich = 0, klein = 0, mn = Infinity; for (const x of d) { if (x === x && x < Infinity) { endlich++; if (x < 0.05) klein++; if (x < mn) mn = x; } } return { n: d.length, endlich, klein, mn, faeden: window.__d.POOL.fad.length, ohne: window.__d.POOL.ohne, info: "Karte in " + (window.__d.KA.sekunden || 0).toFixed(1) + " s" }; });
pruefe("Karte 256² fertig gerechnet", karteDa && karte.endlich > 30000, `${karte.endlich} von ${karte.n} Punkten gebunden und gerechnet, ${karte.klein} unter 0.05, kleinster ${karte.mn.toExponential(1)}; ${((Date.now() - t0) / 1000).toFixed(1)} s seit dem Laden; „${karte.info}“`);
pruefe("Rechenfäden laufen (Blob-Worker aus file://)", !karte.ohne && karte.faeden >= 1, `${karte.faeden} Fäden`);

console.log("\nB · Derselbe Kern wie in der Batterie");
{
  const e = Q.gleich[1];
  const imBrowser = await seite.evaluate(([a, b, T]) => { const v = window.__d.K.macheVerfeinerer()("euler", [1, 1, 1], a, b, T, {}); return [v.a, v.b, v.T, v.rest, v.iter]; }, [e.a, e.b, e.T]);
  const hier = K.macheVerfeinerer()("euler", [1, 1, 1], e.a, e.b, e.T, {});
  pruefe("Verfeinerung von Schmetterling I: Browser und Node auf das Bit gleich", imBrowser[0] === hier.a && imBrowser[1] === hier.b && imBrowser[2] === hier.T, `Browser ${imBrowser[0]}, ${imBrowser[2]} · Node ${hier.a}, ${hier.T}; Rest ${imBrowser[3].toExponential(1)}`);
}

console.log("\nC · Die Acht zum Einstieg");
{
  const da = await warte(() => window.__d.Z.befund && window.__d.Z.befund.ok, 60000);
  const b = await seite.evaluate(() => { const p = window.__d.Z.befund; return p && { T: p.T, rest: p.rest, gegen: p.gegenprobe, stabil: p.stabil, wort: p.wort, stufe: p.listen.klein.stufe, gross: p.listen.gross && p.listen.gross.stufe, name: document.getElementById("bahnName").textContent, titel: document.getElementById("uTitel").textContent, kacheln: document.querySelectorAll("#kacheln .kachel").length }; });
  pruefe("Befund der Acht steht", da && b && Math.abs(b.T - 6.3259139829) < 1e-8 && b.rest < 1e-12, b ? `T ${b.T}, Rest ${b.rest.toExponential(1)}, Gegenprobe ${b.gegen.toExponential(1)}, ${b.kacheln} Kacheln` : "kein Befund");
  pruefe("als „Acht“ und in beiden Listen erkannt", b && /Acht/.test(b.name) && b.stufe === "ort" && b.gross === "ort" && b.wort === "ABab", b ? `„${b.name}“, „${b.titel}“, Wort ${b.wort}, Li/Liao ${b.stufe}, Hristov ${b.gross}` : "");
  const kachelText = () => seite.evaluate(() => { const k = [...document.querySelectorAll("#kacheln .kachel")].find(x => x.firstChild.textContent === "Stabilität"); return k ? k.textContent : ""; });
  const vorher = await kachelText();
  pruefe("die Stabilität wird nicht von selbst gerechnet", b && b.stabil === undefined && /nicht gemessen/.test(vorher), `Feld stabil: ${b && String(b.stabil)}; Kachel „${vorher.slice(0, 60)}“`);
}
const startblatt = await seite.evaluate(() => ({ schritte: document.querySelectorAll("#cold .schritt").length, knopf: !!document.getElementById("los"), sichtbar: !document.getElementById("cold").classList.contains("weg") }));
await seite.click("#los");
await schlaf(900);

console.log("\nC1 · Aufbau: Startblatt, Klappen, Hilfe");
{
  const weg = await seite.evaluate(() => document.getElementById("cold").classList.contains("weg"));
  pruefe("das Startblatt zeigt drei Schritte und geht mit „Los geht's“ auf", startblatt.sichtbar && startblatt.schritte === 3 && startblatt.knopf && weg, `${startblatt.schritte} Schritte, danach verborgen: ${weg}`);
  const sicht = id => seite.evaluate(i => document.getElementById(i).checkVisibility(), id);
  const zu = await seite.evaluate(() => ({ ein: document.getElementById("einstellungen").open, det: document.getElementById("details").open, verw: document.getElementById("verwalten").open }));
  const kachelnVorher = await sicht("kacheln"), tmaxVorher = await sicht("tmax");
  await seite.click("#details summary"); await schlaf(150);
  const kachelnDa = await sicht("kacheln"), nKacheln = await seite.evaluate(() => document.querySelectorAll("#kacheln .kachel").length);
  await seite.click("#details summary"); await schlaf(100);
  await seite.click("#einstellungen summary"); await schlaf(150);
  const tmaxDa = await sicht("tmax");
  pruefe("Zahlen und Einstellungen liegen hinter Klappen: zu beim Start, erreichbar mit einem Klick", !zu.ein && !zu.det && !zu.verw && !kachelnVorher && !tmaxVorher && kachelnDa && nKacheln >= 6 && tmaxDa, `beim Start offen: Einstellungen ${zu.ein}, Zahlen ${zu.det}, Liste verwalten ${zu.verw}; nach dem Klick ${nKacheln} Kacheln sichtbar: ${kachelnDa}, Regler sichtbar: ${tmaxDa}`);
  await seite.click("#hilfe"); await schlaf(200);
  const hOffen = await seite.evaluate(() => ({ da: !document.getElementById("hilfeBlatt").classList.contains("weg"), text: document.getElementById("hilfeBlatt").innerText.length }));
  await seite.keyboard.press("Escape"); await schlaf(200);
  const hZu = await seite.evaluate(() => document.getElementById("hilfeBlatt").classList.contains("weg"));
  pruefe("die Hilfe („?“) geht auf, erklärt Karte und Töne, und Esc schließt sie", hOffen.da && hOffen.text > 800 && hZu, `offen: ${hOffen.da}, ${hOffen.text} Zeichen Text; nach Esc zu: ${hZu}`);
  const worte = await seite.evaluate(() => ({ titel: document.getElementById("uTitel").textContent, stabil: document.getElementById("stabilWort").textContent, fakten: document.getElementById("fakten").innerText.replace(/\n/g, " | "), haupt: [...document.querySelectorAll("button.haupt")].filter(b => b.getBoundingClientRect().width > 0 && !b.closest(".blatt")).map(b => b.firstChild.textContent) }));
  pruefe("das Ergebnis steht in Sätzen da, und genau ein Hauptknopf sagt, was als Nächstes kommt", /Geschlossene Bahn/.test(worte.titel) && /noch nicht gemessen/.test(worte.stabil) && /Ein Umlauf dauert/.test(worte.fakten) && /Acht/.test(worte.fakten) && worte.haupt.length === 1 && /Stabilität messen/.test(worte.haupt[0]), `„${worte.titel}“ · ${worte.fakten} · Stabilität: „${worte.stabil}“ · Hauptknopf: ${worte.haupt.join(", ")}`);
}

console.log("\nC2 · Stabilität auf Knopfdruck, mit Ton");
{
  const lage = () => seite.evaluate(() => { const p = window.__d.Z.befund, Z = window.__d.Z; return { stabil: p.stabil, s1: p.s1, s2: p.s2, lambda: p.lambda, sek: p.stabilSek, a: p.a, b: p.b, T: p.T, ton: Z.letzterTon, toene: Z.toene || 0, klang: Z.klangZustand, an: Z.ton, zeit: document.getElementById("messzeit").textContent,
    kachel: ([...document.querySelectorAll("#kacheln .kachel")].find(x => x.firstChild.textContent === "Stabilität") || {}).textContent || "", unter: document.getElementById("bahnUnter").textContent }; });
  await seite.keyboard.press("m");
  const da = await warte(() => window.__d.Z.befund.stabil !== undefined && !window.__d.Z.messung, 30000);
  const a = await lage(), hier = K.macheFundpruefer().stabilitaetMessen("euler", [1, 1, 1], a.a, a.b, a.T);
  pruefe("Taste M misst die Acht: stabil, Indizes auf das Bit wie im Kern in Node", da && a.stabil === true && a.s1 === hier.s1 && a.s2 === hier.s2, `stabil=${a.stabil}, Indizes ${a.s1}, ${a.s2} (Node ${hier.s1}, ${hier.s2}); Kachel „${a.kachel.slice(0, 80)}“`);
  pruefe("die Messung ist schnell (unter einer Sekunde) und die Zeit steht da", a.sek < 1 && /s$/.test(a.zeit), `${a.sek && a.sek.toFixed(3)} s vom Knopfdruck bis zum Urteil; Anzeige „${a.zeit}“`);
  pruefe("Ton nach der Messung: „stabil“ (aufwärts), Web-Audio läuft", a.ton === "stabil" && a.toene === 1 && a.klang === "running", `Ton „${a.ton}“, ${a.toene} gespielt, AudioContext ${a.klang}`);
  await schlaf(500);
  await seite.screenshot({ path: join(ablage, "labor-1920-acht.png") });
}

console.log("\nD · Karte bedienen (Kartenart „Wiederkehr“)");
{
  const artVorher = await seite.evaluate(() => ({ art: window.__d.Z.kartenArt, halb: window.__d.KA.halb }));
  pruefe("das Labor startet mit der Karte der Umkehrpunkte", artVorher.art === "halb" && artVorher.halb === true, JSON.stringify(artVorher));
  await seite.click("#kVoll");
  await warte(() => window.__d.KA.halb === false && window.__d.KA.offen === 0, 180000);
  const r = await seite.evaluate(() => { const q = document.getElementById("rahmen").getBoundingClientRect(); return [q.left, q.top, q.width, q.height]; });
  const zuPunkt = (a, b, sicht) => [r[0] + (a - sicht[0]) / (sicht[1] - sicht[0]) * r[2], r[1] + (1 - (b - sicht[2]) / (sicht[3] - sicht[2])) * r[3]];
  const sicht = await seite.evaluate(() => window.__d.Z.sicht);
  // Vorschau: Maus über die Karte
  await seite.keyboard.press("Escape");
  const [hx, hy] = zuPunkt(0.2, 0.3, sicht);
  await seite.mouse.move(hx, hy); await schlaf(120); await seite.mouse.move(hx + 3, hy + 2); await schlaf(200);
  const vor = await seite.evaluate(() => ({ fest: window.__d.Z.wahl.fest, a: window.__d.Z.wahl.a, n: window.__d.BAHN.n, art: document.getElementById("befundArt").textContent }));
  pruefe("Zeiger über der Karte zeigt eine Vorschau", vor.fest === false && Math.abs(vor.a - 0.2) < 0.01 && vor.n > 100, `a = ${vor.a.toFixed(4)}, ${vor.n} Stützpunkte, „${vor.art}“`);
  // Klick bei Schmetterling I, dann V
  const [kx, ky] = zuPunkt(0.30689, 0.12551, sicht);
  await seite.mouse.click(kx, ky); await schlaf(300);
  const roh = await seite.evaluate(() => ({ fest: window.__d.Z.wahl.fest, a: window.__d.Z.wahl.a, b: window.__d.Z.wahl.b, d: window.__d.Z.wahl.d, T: window.__d.Z.wahl.T, titel: document.getElementById("uTitel").textContent }));
  pruefe("Klick hält den Punkt fest und rechnet den Wiederkehrabstand", roh.fest && Math.abs(roh.a - 0.30689) < 0.003 && roh.d < 0.1, `a ${roh.a.toFixed(4)}, b ${roh.b.toFixed(4)}, d ${roh.d.toExponential(1)}, T ${roh.T.toFixed(3)}, „${roh.titel}“`);
  await seite.keyboard.press("v");
  const ok = await warte(() => window.__d.Z.befund && window.__d.Z.befund.ok && Math.abs(window.__d.Z.befund.T - 6.2347) < 0.01, 60000);
  const b = await seite.evaluate(() => { const p = window.__d.Z.befund; return p && { a: p.a, b: p.b, T: p.T, rest: p.rest, stabil: p.stabil, lambda: p.lambda, name: document.getElementById("bahnName").textContent }; });
  const soll = Q.gleich[1];
  pruefe("Taste V verfeinert von dort auf Schmetterling I", ok && Math.abs(b.a - soll.a) < 1e-8 && Math.abs(b.b - soll.b) < 1e-8 && /Schmetterling I/.test(b.name), b ? `a ${b.a.toFixed(10)} (Katalog ${soll.a}), T ${b.T.toFixed(8)}, Rest ${b.rest.toExponential(1)}, Stabilität ${b.stabil === undefined ? "nicht gemessen" : b.stabil}, „${b.name}“` : "kein Befund");
  // Knopf statt Taste, und diesmal eine instabile Bahn: der andere Ton
  const toeneVorher = await seite.evaluate(() => window.__d.Z.toene || 0);
  await seite.click("#messen");
  const gemessen = await warte(() => window.__d.Z.befund.stabil !== undefined && !window.__d.Z.messung, 30000);
  const u = await seite.evaluate(() => { const p = window.__d.Z.befund, Z = window.__d.Z; return { stabil: p.stabil, lambda: p.lambda, sek: p.stabilSek, a: p.a, b: p.b, T: p.T, ton: Z.letzterTon, toene: Z.toene, toast: document.getElementById("toast").textContent }; });
  const hierU = K.macheFundpruefer().stabilitaetMessen("euler", [1, 1, 1], u.a, u.b, u.T);
  pruefe("Knopf „Stabilität messen“ an Schmetterling I: instabil, |λ| wie im Kern, Ton „instabil“ (abwärts)", gemessen && b.stabil === undefined && u.stabil === false && u.lambda === hierU.lambda && u.ton === "instabil" && u.toene === toeneVorher + 1, `instabil mit |λ| ${u.lambda && u.lambda.toFixed(4)} (Node ${hierU.lambda.toFixed(4)}) in ${u.sek && u.sek.toFixed(3)} s; Ton „${u.ton}“; Meldung „${u.toast}“`);
  // Ton aus: es wird weiter gemessen, aber nichts gespielt
  await seite.keyboard.press("t"); await schlaf(150);
  const aus = await seite.evaluate(() => ({ ton: window.__d.Z.ton, text: document.getElementById("bTon").textContent }));
  await seite.click("#bTon"); await schlaf(150);
  const wiederAn = await seite.evaluate(() => ({ ton: window.__d.Z.ton, text: document.getElementById("bTon").textContent }));
  pruefe("Taste T schaltet den Ton aus, der Knopf wieder an", aus.ton === false && aus.text === "Ton aus" && wiederAn.ton === true && wiederAn.text === "Ton an", `nach T: ton=${aus.ton}, Knopf „${aus.text}“; nach Klick: ton=${wiederAn.ton}, Knopf „${wiederAn.text}“`);
  await seite.click("#merken"); await schlaf(200);
  // Störung
  await seite.keyboard.press("b"); await schlaf(600);
  const st = await seite.evaluate(() => window.__d.BAHN.geist && { faktor: window.__d.BAHN.geist.faktor, n: window.__d.BAHN.geist.n });
  pruefe("Taste B lässt die gestörte Bahn mitlaufen", st && st.faktor > 1 && st.n > 1000, st ? `Abstand nach zwölf Umläufen ×${st.faktor.toFixed(1)}` : "kein Geist");
  await seite.screenshot({ path: join(ablage, "labor-1920-stoerung.png") });
  await seite.keyboard.press("b");
}

// Einen eigenen Fund anklicken: er steht in „Meine Funde" oder, wenn er bekannt ist, im Schaukasten
const oeffneFund = async nr => {
  await seite.evaluate(n => { const d = window.__d; d.Z.liste = d.listenStand(d.Z.funde[n]) === "bekannt" ? "schau" : "meine"; d.Z.filter = "alle"; d.fundeZeigen(); }, nr);
  await seite.click(`#funde li[data-nr="${nr}"]`);
};
let jagdVoll = 0;
console.log("\nE · Jagd");
{
  const vorher = await seite.evaluate(() => window.__d.Z.funde.length);
  const tj = Date.now();
  await seite.click("#jagd");
  await warte(() => window.__d.Z.jagd !== null, 5000);
  const fertig = await warte(() => window.__d.Z.jagd === null, 600000);
  const erg = await seite.evaluate(() => { const f = window.__d.Z.funde; return { n: f.length, stabil: f.filter(x => x.stabil === true).length, bekannt: f.filter(x => x.listen && x.listen.bekannt).length, scharf: f.filter(x => x.rest < 1e-10 && x.gegenprobe < 1e-8).length, li: document.querySelectorAll("#funde li:not(.gruppe)").length, schau: +document.getElementById("schauZahl").textContent, hinweis: document.getElementById("listenHinweis").textContent }; });
  jagdVoll = erg.n - vorher;
  pruefe("Jagd über die ganze Ebene läuft durch und füllt die Liste", fertig && erg.n - vorher >= 10 && erg.li === erg.n - erg.bekannt && erg.schau >= erg.bekannt, `${erg.n - vorher} neue Bahnen in ${((Date.now() - tj) / 1000).toFixed(0)} s; gefunden ${erg.n}, davon bestätigt ${erg.scharf}; bekannt ${erg.bekannt} (Schaukasten zeigt ${erg.schau}), „Meine Funde“ zeigt ${erg.li}`);
  console.log("        " + erg.hinweis.slice(0, 220));
  // Die Jagd misst keine Stabilität mehr; „Liste messen" holt es auf Knopfdruck nach.
  const ungemessen = await seite.evaluate(() => window.__d.Z.funde.filter(f => f.stabil === undefined).length);
  const tm = Date.now();
  // „Alle messen" misst die Bahnen der offenen Liste: erst „Meine Funde" (außerhalb der Listen) …
  const eigeneOffen = await seite.evaluate(() => window.__d.Z.funde.filter(f => f.stabil === undefined && window.__d.listenStand(f) !== "bekannt").length);
  if (eigeneOffen) { await seite.click("#alleMessen"); await warte(() => !window.__d.Z.messung && window.__d.Z.funde.every(f => f.stabil !== undefined || window.__d.listenStand(f) === "bekannt"), 120000); }
  const getrennt = await seite.evaluate(() => { const d = window.__d, f = d.Z.funde; return { bekOffen: f.filter(x => x.stabil === undefined && d.listenStand(x) === "bekannt").length, bek: f.filter(x => d.listenStand(x) === "bekannt").length, eigOffen: f.filter(x => x.stabil === undefined && d.listenStand(x) !== "bekannt").length }; });
  pruefe("„Alle messen“ in „Meine Funde“ misst, was außerhalb der Listen steht, und lässt die bekannten in Ruhe", getrennt.eigOffen === 0 && getrennt.bekOffen >= 5, `${eigeneOffen} außerhalb der Listen gemessen; von ${getrennt.bek} bekannten noch ${getrennt.bekOffen} ungemessen`);
  // … dann der Schaukasten (die bekannten)
  await seite.click("#tabSchau"); await schlaf(200);
  await seite.click("#alleMessen");
  const durch = await warte(() => !window.__d.Z.messung && window.__d.Z.funde.every(f => f.stabil !== undefined), 120000);
  const lm = await seite.evaluate(() => { const f = window.__d.Z.funde, Z = window.__d.Z; return { n: f.length, stabil: f.filter(x => x.stabil === true).length, instabil: f.filter(x => x.stabil === false).length, offen: f.filter(x => x.stabil === null).length, ton: Z.letzterTon, toast: document.getElementById("toast").textContent, namen: f.filter(x => x.stabil === true).map(x => x.name).join(", ") }; });
  pruefe("„Alle messen“ im Schaukasten misst die bekannten Funde der Jagd und findet die stabilen", ungemessen >= erg.n - vorher && durch && lm.stabil >= 1 && lm.stabil + lm.instabil + lm.offen === lm.n && lm.ton === "stabil", `${ungemessen} ungemessen → ${lm.stabil} stabil (${lm.namen}), ${lm.instabil} instabil, ${lm.offen} offen in ${((Date.now() - tm) / 1000).toFixed(1)} s; Ton „${lm.ton}“; „${lm.toast}“`);
  // Der mittlere Ton: eine der nicht entscheidbaren Bahnen einzeln messen
  const offenNr = await seite.evaluate(() => window.__d.Z.funde.findIndex(x => x.stabil === null));
  if (offenNr >= 0) {
    await oeffneFund(offenNr); await schlaf(300);
    const tv = await seite.evaluate(() => window.__d.Z.toene);
    await seite.keyboard.press("m");
    await warte(v => window.__d.Z.toene > v && !window.__d.Z.messung, 30000, tv);
    const o = await seite.evaluate(() => { const Z = window.__d.Z, p = Z.befund; return { stabil: p.stabil, T: p.T, s1: p.s1, s2: p.s2, sy: p.symplektik, ton: Z.letzterTon, toast: document.getElementById("toast").textContent, kachel: ([...document.querySelectorAll("#kacheln .kachel")].find(x => x.firstChild.textContent === "Stabilität") || {}).textContent || "" }; });
    pruefe("eine nicht entscheidbare Bahn einzeln gemessen: Ton „offen“, und der Text sagt „kann stabil sein“", o.stabil === null && o.ton === "offen" && /kann stabil sein/.test(o.toast) && /kann stabil sein/.test(o.kachel), `T ${o.T.toFixed(3)}, Indizes ${o.s1 && o.s1.toFixed(4)} / ${o.s2 && o.s2.toFixed(4)}, Symplektikfehler ${o.sy && o.sy.toExponential(1)}; Ton „${o.ton}“; „${o.toast.slice(0, 70)}…“`);
  } else pruefe("eine nicht entscheidbare Bahn einzeln gemessen (keine offene in der Liste)", false, "nicht geprüft");
  // Der Sammelton nach einer Messung vieler Bahnen, an festen Fällen: offen nur, wenn ein KANDIDAT offen ist
  {
    const r = await seite.evaluate(() => { const t = window.__d.sammelTon; return [
      t([{ stabil: null, s1: 1.9, s2: 0.4 }, { stabil: false, s1: 5, s2: 1 }]),
      t([{ stabil: null, s1: 45, s2: 0.4 }, { stabil: false, s1: 5, s2: 1 }]),
      t([{ stabil: true, s1: 1.2, s2: 0.1 }, { stabil: null, s1: 1.99, s2: 1 }]),
      t([{ stabil: false, s1: 3, s2: 1 }]) ]; });
    pruefe("Sammelton: aufwärts bei einer stabilen, zweimal gleich nur bei einem offenen Kandidaten, sonst abwärts", r.join() === "offen,instabil,stabil,instabil", r.join(" · "));
  }
  await seite.click("#zeigeListen"); await schlaf(400);
  await seite.screenshot({ path: join(ablage, "labor-1920-jagd.png") });
  // Fund anklicken
  await oeffneFund(2); await schlaf(400);
  const g = await seite.evaluate(() => ({ T: window.__d.Z.befund && window.__d.Z.befund.T, name: document.getElementById("bahnName").textContent }));
  pruefe("Klick auf einen Fund lädt ihn auf die Bühne", g.T > 0 && g.name.length > 2, `„${g.name}“, T ${g.T && g.T.toFixed(4)}`);
}

console.log("\nE2 · Umkehrpunkte: Karte, Verfeinern, Jagd");
{
  seite.once("dialog", d => d.accept());
  await seite.click("#verwalten summary"); await seite.click("#leeren").catch(() => {}); await seite.click("#verwalten summary");
  await seite.evaluate(() => { window.__d.Z.funde.length = 0; window.__d.fundeZeigen(); });
  await seite.evaluate(() => document.getElementById("ganz").click()); await seite.click("#kHalb");
  const da = await warte(() => window.__d.KA.halb === true && window.__d.KA.offen === 0, 240000);
  const k = await seite.evaluate(() => { const d = window.__d.KA.d; let e = 0, tief = 0; for (const x of d) { if (x === x && x < 9) { e++; if (x < 0.01) tief++; } } return { e, tief, info: "Karte in " + (window.__d.KA.sekunden || 0).toFixed(1) + " s", skala: document.getElementById("skalaText").textContent }; });
  pruefe("Karte der Umkehrpunkte fertig gerechnet", da && k.e > 30000 && k.tief > 100, `${k.e} Punkte mit einem Minimum, ${k.tief} unter 0.01; „${k.info}“, Skala „${k.skala}“`);
  // Klick neben der Acht (bei T/2 liegt dort A3), dann V: der Weg über den Umkehrpunkt
  const r = await seite.evaluate(() => { const q = document.getElementById("rahmen").getBoundingClientRect(); return [q.left, q.top, q.width, q.height, ...window.__d.Z.sicht]; });
  const px = (a, b) => [r[0] + (a - r[4]) / (r[5] - r[4]) * r[2], r[1] + (1 - (b - r[6]) / (r[7] - r[6])) * r[3]];
  const [kx, ky] = px(0.3471, 0.5327);
  await seite.mouse.click(kx, ky); await schlaf(300);
  const w = await seite.evaluate(() => window.__d.Z.wahl && window.__d.Z.wahl.halb);
  await seite.keyboard.press("v");
  const ok = await warte(() => window.__d.Z.befund && window.__d.Z.befund.ok && window.__d.Z.befund.halb, 60000);
  const b = await seite.evaluate(() => { const p = window.__d.Z.befund; return p && { T: p.T, a: p.a, halb: p.halb, rest: p.rest, name: document.getElementById("bahnName").textContent, kachel: [...document.querySelectorAll("#kacheln .kachel span")].map(s => s.textContent).join("|") }; });
  pruefe("Klick und V auf der Umkehrpunkt-Karte: Newton auf den Umkehrpunkt", ok && b && b.halb.rest < 1e-10 && /Umkehrpunkt/.test(b.kachel), b ? `„${b.name}“, T ${b.T.toFixed(6)}, Ziel ${b.halb.ziel} auf ${b.halb.rest.toExponential(1)} getroffen, Periode ${b.halb.vielfaches} × 2τ; Pixel sagte Ziel ${w && w.ziel}, τ ${w && w.tau.toFixed(3)}` : "kein Befund");
  const tj = Date.now();
  await seite.click("#jagd");
  await warte(() => window.__d.Z.jagd !== null, 5000);
  const fertig = await warte(() => window.__d.Z.jagd === null, 900000);
  const erg = await seite.evaluate(() => { const f = window.__d.Z.funde; return { n: f.length, gemessen: f.filter(x => x.stabil !== undefined).length, bekannt: f.filter(x => x.listen && x.listen.bekannt).length, scharf: f.filter(x => x.rest < 1e-10 && x.gegenprobe < 1e-8).length, umkehr: f.filter(x => x.halb && x.halb.rest < 1e-11).length, tmax: Math.max(...f.map(x => x.T)), unb40: f.filter(x => x.T <= 40 && x.listen && !x.listen.bekannt).length, bis40: f.filter(x => x.T <= 40).length }; });
  // Maßstab ist die Wiederkehr-Jagd desselben Laufs (oben), nicht eine geratene Zahl: mindestens das Anderthalbfache.
  pruefe("Jagd über Umkehrpunkte findet mindestens anderthalbmal so viele wie die über die Wiederkehr", fertig && erg.n >= 1.5 * jagdVoll, `${erg.n} Bahnen in ${((Date.now() - tj) / 1000).toFixed(0)} s (Wiederkehr-Jagd oben: ${jagdVoll}); Umkehrpunkt scharf getroffen bei ${erg.umkehr}, voller Umlauf bestätigt ${erg.scharf}, Stabilität gemessen bei ${erg.gemessen} (die Jagd misst sie nicht), längste Periode ${erg.tmax.toFixed(1)}`);
  console.log(`        bis T = 40 (so weit reicht die eingebettete Liste): ${erg.bis40} Bahnen, davon ${erg.unb40} in keiner eingebetteten Liste`);
  // Wie schnell ist „schnell" bei einer langen Bahn? Die längste der Jagd.
  {
    await oeffneFund(await seite.evaluate(() => window.__d.Z.funde.length - 1)); await schlaf(400);
    const tv = await seite.evaluate(() => window.__d.Z.toene);
    await seite.keyboard.press("m");
    const durch = await warte(v => window.__d.Z.toene > v && !window.__d.Z.messung, 60000, tv);
    const l = await seite.evaluate(() => { const p = window.__d.Z.befund; return { T: p.T, sek: p.stabilSek, stabil: p.stabil, lambda: p.lambda, ton: window.__d.Z.letzterTon }; });
    pruefe("Messung an der längsten Bahn der Jagd dauert unter zwei Sekunden", durch && l.sek < 2 && l.T > 60, `T ${l.T.toFixed(1)}: ${l.sek && l.sek.toFixed(2)} s, Urteil ${l.stabil === true ? "stabil" : l.stabil === false ? "instabil" : "offen"}, Ton „${l.ton}“`);
  }
  await seite.screenshot({ path: join(ablage, "labor-1920-umkehr.png") });
}

console.log("\nF · Zoom, Ebene, Lauf laden, F3");
{
  const r = await seite.evaluate(() => { const q = document.getElementById("rahmen").getBoundingClientRect(); return [q.left, q.top, q.width, q.height]; });
  await seite.mouse.move(r[0] + r[2] * 0.4, r[1] + r[3] * 0.5);
  await seite.mouse.wheel(0, -300); await schlaf(500);
  const s = await seite.evaluate(() => window.__d.Z.sicht);
  const da = await warte(() => window.__d.KA.offen === 0, 180000);
  pruefe("Mausrad zoomt und die Karte rechnet neu", da && s[1] - s[0] < 0.6, `Fenster ${s.map(x => x.toFixed(3)).join(" … ")}`);
  await seite.click("#eFall");
  const fall = await warte(() => window.__d.KA.offen === 0 && window.__d.Z.ebene === "fall", 240000);
  const fk = await seite.evaluate(() => { let e = 0; for (const x of window.__d.KA.d) if (x === x && x < Infinity) e++; return e; });
  pruefe("Ebene „Freier Fall“ rechnet eine Karte", fall && fk > 30000, `${fk} Punkte`);
  await seite.screenshot({ path: join(ablage, "labor-1920-fall.png") });
  const lauf = join(HIER, "ergebnisse", "probe-256.json");
  if (existsSync(lauf)) {
    const vorher = await seite.evaluate(() => window.__d.Z.funde.length);
    await seite.setInputFiles("#datei", lauf);
    await warte(v => window.__d.Z.funde.length > v || window.__d.Z.ebene === "euler", 10000, vorher);
    await schlaf(500);
    const n = await seite.evaluate(() => ({ n: window.__d.Z.funde.length, ebene: window.__d.Z.ebene }));
    pruefe("„Lauf laden“ übernimmt die Funde der Suchmaschine", n.n >= vorher && n.ebene === "euler", `${vorher} → ${n.n} Funde, Ebene ${n.ebene}`);
  } else pruefe("„Lauf laden“ (ergebnisse/probe-256.json fehlt)", false, "nicht geprüft");
  // Fundus: die Kandidatenliste der Suchmaschine, im Labor zum Durchsehen und Nachmessen
  {
    await seite.click("#tabFundus"); await schlaf(300);
    const fu = await seite.evaluate(() => { const F = window.__d.Fundus, U = F.filter(x => !x.gelistet), li = [...document.querySelectorAll("#funde li:not(.gruppe)")]; return { n: F.length, un: U.length, li: li.length, nurUn: li.every(l => !F[+l.dataset.fundus].gelistet), zahl: document.getElementById("fundusZahl").textContent, stabil: U.filter(x => "sdl".includes(x.u)).length, m112: U.filter(x => x.m[2] === 2).length, massen: [...new Set(U.map(x => x.m.join("/")))].join(", ") }; });
    await seite.click("#fStabil"); await schlaf(200);
    const nurStabil = await seite.evaluate(() => document.querySelectorAll("#funde li:not(.gruppe)").length);
    await seite.click("#fAlle"); await schlaf(200);
    pruefe("der Fundus zeigt nur Bahnen außerhalb der Listen, der Filter „sicher stabil“ grenzt ein", fu.un >= 1 && fu.li === fu.un && fu.nurUn && +fu.zahl === fu.un && nurStabil === fu.stabil, `${fu.un} von ${fu.n} Bahnen der Suchmaschine stehen in keiner Liste (Gewichte ${fu.massen}), mit Filter „sicher stabil“ ${nurStabil}`);
    await schlaf(300); await seite.screenshot({ path: join(ablage, "labor-1920-fundus.png") });
    // der Schaukasten: die bekannten, getrennt von der Suche
    await seite.click("#tabSchau"); await schlaf(300);
    const sk = await seite.evaluate(() => { const d = window.__d, F = d.Fundus, li = [...document.querySelectorAll("#funde li:not(.gruppe)")]; return { li: li.length, fundus: li.filter(l => l.dataset.fundus !== undefined).length, alleBekannt: li.every(l => (l.dataset.fundus !== undefined ? F[+l.dataset.fundus].gelistet : d.listenStand(d.Z.funde[+l.dataset.nr]) === "bekannt")), acht: li.some(l => /^Acht/.test(l.textContent)), zahl: +document.getElementById("schauZahl").textContent, kand: getComputedStyle(document.getElementById("fKand")).display }; });
    const kopfzeilen = await seite.evaluate(() => [...document.querySelectorAll("#funde li.gruppe")].map(l => l.textContent).join(" | "));
    // die erste Zwischenzeile muss zu sehen sein: die Liste beginnt nach dem Reiterwechsel oben
    const oben = await seite.evaluate(() => { const ul = document.getElementById("funde"), k = ul.querySelector("li.gruppe"); if (!k) return null; const a = ul.getBoundingClientRect(), b = k.getBoundingClientRect(); return { scroll: ul.scrollTop, sichtbar: b.top >= a.top - 1 && b.bottom <= a.bottom + 1 }; });
    pruefe("nach dem Reiterwechsel beginnt die Liste oben, die erste Zwischenzeile ist zu sehen", oben && oben.scroll === 0 && oben.sichtbar, oben ? `Verschiebung ${oben.scroll} px, erste Zwischenzeile sichtbar: ${oben.sichtbar}` : "keine Zwischenzeile");
    pruefe("der Schaukasten führt die bekannten Bahnen und nur sie", sk.li >= 40 && sk.li === sk.zahl && sk.alleBekannt && sk.acht && sk.kand === "none" && /Gleiche Gewichte/.test(kopfzeilen) && /Gewichte 1 · 1 · 2/.test(kopfzeilen), `${sk.li} Bahnen, davon ${sk.fundus} aus den Läufen der Suchmaschine; die Acht ist dabei; der Filter „Kandidaten“ ist dort ausgeblendet; Zwischenzeilen: ${kopfzeilen}`);
    await schlaf(300); await seite.screenshot({ path: join(ablage, "labor-1920-schaukasten.png") });
    // eine sicher stabile Bahn gleicher Massen öffnen und selbst nachmessen
    const nr = await seite.evaluate(() => window.__d.Fundus.findIndex((x, i) => x.u === "d" && x.m.every(v => v === 1) && document.querySelector(`#funde li[data-fundus="${i}"]`)));
    const tv = await seite.evaluate(() => window.__d.Z.toene);
    await seite.click(`#funde li[data-fundus="${nr}"]`);
    const offen = await warte(() => window.__d.Z.befund && window.__d.Z.befund.fundus && window.__d.Z.befund.ok, 60000);
    await seite.keyboard.press("m");
    await warte(v => window.__d.Z.toene > v && !window.__d.Z.messung, 30000, tv);
    const g = await seite.evaluate(() => { const p = window.__d.Z.befund, Z = window.__d.Z; return p && { name: document.getElementById("bahnName").textContent, T: p.T, rest: p.rest, stabil: p.stabil, ton: Z.letzterTon, wort: document.getElementById("stabilWort").innerText.replace(/\n/g, " · "), u: p.fundus && p.fundus.u }; });
    pruefe("eine stabile Bahn aus dem Schaukasten öffnet sich, lässt sich nachmessen, und Labor und Suchmaschine sind sich einig", offen && g && g.u === "d" && g.stabil === true && g.ton === "stabil" && /Suchmaschine/.test(g.wort), g ? `„${g.name}“, T ${g.T.toFixed(3)}, Rest ${g.rest.toExponential(1)}; „${g.wort}“; Ton „${g.ton}“` : "kein Befund");
    // die stabile Bahn bei den Gewichten 1/1/2 (auf 30 Stellen gerechnet): das Labor stellt die Gewichte um
    const nr2 = await seite.evaluate(() => window.__d.Fundus.findIndex(x => x.u === "s" && x.m[2] === 2 && /Satellit 7/.test(x.satellit)));
    const tv2 = await seite.evaluate(() => window.__d.Z.toene);
    await seite.click("#tabFundus"); await schlaf(300);
    await seite.click(`#funde li[data-fundus="${nr2}"]`);
    const offen2 = await warte(() => window.__d.Z.befund && window.__d.Z.befund.fundus && window.__d.Z.befund.ok && window.__d.Z.m[2] === 2, 60000);
    await seite.keyboard.press("m");
    await warte(v => window.__d.Z.toene > v && !window.__d.Z.messung, 30000, tv2);
    const g2 = await seite.evaluate(() => { const p = window.__d.Z.befund, Z = window.__d.Z; return p && { name: document.getElementById("bahnName").textContent, T: p.T, stabil: p.stabil, s1: p.s1, s2: p.s2, ton: Z.letzterTon, kopf: document.getElementById("ebenenName").textContent, m: Z.m.join("/"), sicht: Z.sicht.map(v => +v.toFixed(3)).join(" … "), drin: Z.sicht[0] <= Math.abs(p.a) && Math.abs(p.a) <= Z.sicht[1] && Z.sicht[2] <= Math.abs(p.b) && Math.abs(p.b) <= Z.sicht[3] }; });
    pruefe("eine Bahn mit den Gewichten 1/1/2 aus dem Fundus: das Labor stellt um und misst sie stabil", offen2 && g2 && g2.m === "1/1/2" && g2.stabil === true && g2.ton === "stabil" && /Gewichte/.test(g2.kopf) && g2.drin, g2 ? `„${g2.name}“, T ${g2.T.toFixed(3)}, Indizes ${g2.s1.toFixed(4)} / ${g2.s2.toFixed(4)}, Ton „${g2.ton}“, Kopf „${g2.kopf}“, Karte ${g2.sicht}, die Bahn liegt ${g2.drin ? "darin" : "AUSSERHALB"}` : "kein Befund");
    {
      // u === "s": die auf 30 Stellen stabile Bahn (T 53,25) — seit den Läufen vom
      // 21.10.2026 stehen bei 1/1/4 auch noch nicht nachgerechnete Bahnen mit b > 1,2 im Fundus
      const nr4 = await seite.evaluate(() => window.__d.Fundus.findIndex(x => x.m[2] === 4 && !x.gelistet && Math.abs(x.b) > 1.2 && x.u === "s"));
      if (nr4 >= 0) {
        await seite.click("#tabFundus"); await schlaf(300);
        await seite.click(`#funde li[data-fundus="${nr4}"]`);
        const da4 = await warte(() => window.__d.Z.befund && window.__d.Z.befund.fundus && window.__d.Z.befund.ok && window.__d.Z.m[2] === 4, 90000);
        const g4 = await seite.evaluate(() => { const Z = window.__d.Z, p = Z.befund; return { titel: document.getElementById("uTitel").textContent, text: document.getElementById("uText").textContent, a: p.a, b: p.b, T: p.T, sicht: Z.sicht.map(v => +v.toFixed(3)), grund: window.__d.grundSicht("euler", [1, 1, 4]).map(v => +v.toFixed(3)) }; });
        const drin = g4.sicht[0] <= Math.abs(g4.a) && Math.abs(g4.a) <= g4.sicht[1] && g4.sicht[2] <= Math.abs(g4.b) && Math.abs(g4.b) <= g4.sicht[3];
        pruefe("eine Bahn aus dem Fundus außerhalb des Grundfensters liegt nach dem Laden auf der Karte, und das Ergebnis sagt, dass sie auf 30 Stellen belegt ist", da4 && drin && /belegt/.test(g4.titel) && !/erst nach der Nachprüfung/.test(g4.text), `1/1/4, (${g4.a.toFixed(3)}, ${g4.b.toFixed(3)}), T ${g4.T.toFixed(2)}: Grundfenster ${g4.grund.join(" … ")}, Karte jetzt ${g4.sicht.join(" … ")}; „${g4.titel}“`);
      } else pruefe("eine Bahn aus dem Fundus außerhalb des Grundfensters (keine bei 1/1/4 im Fundus)", false, "nicht geprüft");
    }
    // Labor und Suchmaschine dürfen sich nirgends widersprechen: keine Bahn des Fundus darf im Labor „instabil" heißen
    const alleF = await seite.evaluate(() => { const d = window.__d, pr = d.K.macheFundpruefer(), z = { stabil: 0, offen: 0, instabil: 0 }, schlimm = []; const t0 = performance.now();
      for (const x of d.Fundus) { const e = pr.stabilitaetMessen(x.ebene, x.m, x.a, x.b, x.T); const u = e.stabil === true ? "stabil" : e.stabil === false ? "instabil" : "offen"; z[u]++; if (u === "instabil" || ("sd".includes(x.u) && u !== "stabil" && x.u === "d")) schlimm.push(`${x.name} (${x.u} → ${u})`); }
      return { ...z, schlimm, n: d.Fundus.length, sek: (performance.now() - t0) / 1000 }; });
    pruefe("keine Bahn des Fundus misst das Labor als instabil; die in double sicher stabilen misst es stabil", alleF.instabil === 0 && alleF.schlimm.length === 0, `${alleF.n} Bahnen in ${alleF.sek.toFixed(1)} s: ${alleF.stabil} stabil, ${alleF.offen} vielleicht stabil, ${alleF.instabil} instabil` + (alleF.schlimm.length ? " — " + alleF.schlimm.join("; ") : ""));
    await seite.click("#tabMeine"); await schlaf(200);
    await seite.click("#massenGleich"); await warte(() => window.__d.KA.offen === 0 && window.__d.Z.m[2] === 1, 240000);
  }
  // „Nach stabilen Bahnen suchen": absuchen, messen, auf die Kandidaten eingrenzen — ein Knopf
  {
    seite.once("dialog", d => d.accept());
    await seite.evaluate(() => { window.__d.Z.funde.length = 0; window.__d.Z.filter = "alle"; window.__d.fundeZeigen(); });
    await seite.click("#eEuler"); await warte(() => window.__d.KA.offen === 0 && window.__d.Z.ebene === "euler", 240000);
    const tv = await seite.evaluate(() => window.__d.Z.toene), ts = Date.now();
    await seite.click("#stabilSuche");
    const gestartet = await warte(() => window.__d.Z.jagd !== null, 5000);
    const fertig = await warte(v => window.__d.Z.jagd === null && !window.__d.Z.messung && window.__d.Z.toene > v, 900000, tv);
    const s = await seite.evaluate(() => { const d = window.__d, Z = d.Z, f = Z.funde, e = f.filter(x => d.listenStand(x) !== "bekannt"), li = [...document.querySelectorAll("#funde li:not(.gruppe)")];
      return { n: f.length, eigene: e.length, gemessen: e.filter(x => x.stabil !== undefined).length, bekGemessen: f.filter(x => d.listenStand(x) === "bekannt" && x.stabil !== undefined).length, stabil: e.filter(x => x.stabil === true).length, vielleicht: e.filter(x => x.stabil === null && d.istKandidat(x)).length,
        filter: Z.filter, chip: document.getElementById("fKand").classList.contains("an"), liste: Z.liste, li: li.length, nurEigene: li.every(l => l.dataset.nr !== undefined && d.listenStand(f[+l.dataset.nr]) !== "bekannt"),
        ton: Z.letzterTon, namen: e.filter(x => x.stabil === true).map(x => x.name).join(", "), ungeprueft: e.filter(x => d.listenStand(x) === "ungeprueft").length, toast: document.getElementById("toast").textContent,
        // was die Suchmaschine als gelistet kennt, darf nicht unter den eigenen Funden stehen
        falschEigen: e.filter(x => d.vonDerSuchmaschineGeprueft(x) === true).length, lautMaschine: f.filter(x => !(x.listen && x.listen.bekannt) && d.vonDerSuchmaschineGeprueft(x) === true).length, maschineUngelistet: e.filter(x => d.vonDerSuchmaschineGeprueft(x) === false).length,
        // wo die Suchmaschine auf 30 Stellen entschieden hat, darf das Labor nicht „vielleicht" sagen und nicht widersprechen
        vielleichtTrotzUrteil: f.filter(x => x.stabil === null && "si".includes(d.stabilLautSuchmaschine(x) || "-")).length,
        widerspruch: f.filter(x => x.stabil !== undefined && x.stabil !== null && d.stabilLautSuchmaschine(x) && !"gh".includes(d.stabilLautSuchmaschine(x)) && (d.stabilLautSuchmaschine(x) === "s") !== x.stabil).map(x => x.name).join(", "),
        uebernommen: f.filter(x => x.stabilQuelle === "suchmaschine").length }; });
    const sollTon = s.stabil ? "stabil" : s.vielleicht ? "offen" : "instabil";
    pruefe("„Nach stabilen Bahnen suchen“: sucht ab, misst nur, was in keiner Liste steht, und zeigt nur diese Kandidaten", gestartet && fertig && s.n >= 20 && s.eigene >= 1 && s.gemessen === s.eigene && s.bekGemessen === 0 && s.filter === "kand" && s.chip && s.liste === "meine" && s.li === s.stabil + s.vielleicht && s.nurEigene && s.ton === sollTon && s.falschEigen === 0 && s.lautMaschine >= 1 && s.vielleichtTrotzUrteil === 0 && s.widerspruch === "",
      `${s.n} Bahnen in ${((Date.now() - ts) / 1000).toFixed(0)} s gefunden; ${s.n - s.eigene} bekannte in den Schaukasten (ungemessen), ${s.eigene} außerhalb der Listen gemessen (${s.ungeprueft} „ungeprüft“, ${s.maschineUngelistet} von der Suchmaschine als ungelistet bestätigt; ${s.lautMaschine} nur dank der Suchmaschine als bekannt erkannt; bei ${s.uebernommen} das 30-Stellen-Urteil der Suchmaschine übernommen, Widersprüche: ${s.widerspruch || "keine"}): ${s.stabil} stabil (${s.namen}), ${s.vielleicht} vielleicht; die Liste zeigt ${s.li}; Ton „${s.ton}“; „${s.toast.slice(0, 110)}“`);
    await schlaf(500);
    await seite.screenshot({ path: join(ablage, "labor-1920-stabilsuche.png") });
    await seite.click("#fAlle");
  }
  // Der Zweig „ein stabiler Kandidat ist dabei": bei den Gewichten 1/1/0,5
  {
    await seite.evaluate(() => { const d = window.__d; d.Z.funde.length = 0; d.Z.filter = "alle"; d.fundeZeigen(); const e = document.getElementById("m3"); e.value = "0.5"; e.dispatchEvent(new Event("change")); });
    const karte = await warte(() => window.__d.KA.offen === 0 && window.__d.Z.m[2] === 0.5, 240000);
    const tv = await seite.evaluate(() => window.__d.Z.toene), ts = Date.now();
    await seite.click("#stabilSuche");
    const gestartet = await warte(() => window.__d.Z.jagd !== null, 5000);
    const fertig = await warte(v => window.__d.Z.jagd === null && !window.__d.Z.messung && window.__d.Z.toene > v, 900000, tv);
    const s = await seite.evaluate(() => { const d = window.__d, Z = d.Z, f = Z.funde, e = f.filter(x => d.listenStand(x) !== "bekannt"), st = e.filter(x => x.stabil === true);
      return { n: f.length, eigene: e.length, stabil: st.length, namen: st.map(x => `${x.name} (T ${x.T.toFixed(2)}, ${d.vonDerSuchmaschineGeprueft(x) === false ? "von der Suchmaschine als ungelistet bestätigt" : d.listenStand(x)})`).join(", "), li: document.querySelectorAll("#funde li:not(.gruppe)").length, kand: e.filter(x => d.istKandidat(x)).length, ableger: [...document.querySelectorAll("#funde li:not(.gruppe)")].filter(l => l.children[2].textContent === "Ableger").map(l => l.children[1].textContent).join(", "), kaum: e.filter(x => x.stabil === null && !d.istKandidat(x)).length, ton: Z.letzterTon, sicht: Z.sicht.join(" … "), toast: document.getElementById("toast").textContent }; });
    pruefe("„Nach stabilen Bahnen suchen“ bei 1/1/0,5 findet einen stabilen Kandidaten außerhalb der Liste, Ton aufwärts", karte && gestartet && fertig && s.stabil >= 1 && s.ton === "stabil" && s.li === s.kand && s.ableger.length > 0,
      `Fenster ${s.sicht}; ${s.n} Bahnen in ${((Date.now() - ts) / 1000).toFixed(0)} s, ${s.eigene} außerhalb der Liste, davon stabil ${s.stabil}: ${s.namen || "keine"}; die Liste zeigt ${s.li} Kandidaten (${s.kaum} offene mit einem Index über 30 nicht darunter), als Ableger markiert: ${s.ableger || "keiner"}; Ton „${s.ton}“`);
    await schlaf(500); await seite.screenshot({ path: join(ablage, "labor-1920-stabilsuche-05.png") });
    await seite.evaluate(() => document.getElementById("massenGleich").click());
    await warte(() => window.__d.KA.offen === 0 && window.__d.Z.m[2] === 1, 240000);
  }
  await seite.keyboard.press("F3"); await schlaf(700);
  const f3 = await seite.evaluate(() => document.getElementById("f3").classList.contains("da") ? document.getElementById("f3").textContent : "");
  pruefe("F3 zeigt die Diagnose", /fps/.test(f3) && /Fäden/.test(f3), f3.replace(/\n/g, " | ").replace(/\s+/g, " ").slice(0, 160));
}

console.log("\nG · Fenstergrößen");
for (const [w, h] of [[1920, 1080], [1280, 800]]) {
  await seite.setViewportSize({ width: w, height: h }); await schlaf(700);
  const m = await seite.evaluate(() => {
    const q = s => document.querySelector(s).getBoundingClientRect();
    const l = q(".rail.left"), r = q(".rail.right"), b = q(".bar"), k = q("#rahmen");
    const mk = q("#messen");
    return { ueber: document.documentElement.scrollWidth > window.innerWidth, frei: r.left - l.right, bar: [b.left, b.right, b.bottom], barHoch: b.height, karte: k.width, lr: l.right, rl: r.left, h: window.innerHeight, messenUnten: mk.bottom, leisteUnten: r.bottom, messenOben: mk.top, leisteOben: r.top };
  });
  const dockFrei = m.bar[0] >= m.lr - 1 && m.bar[1] <= m.rl + 1;
  pruefe(`${w}×${h}: kein waagerechter Überlauf, Bühne frei, Dock zwischen den Leisten`, !m.ueber && m.frei > 420 && dockFrei && m.bar[2] <= m.h, `Bühne ${m.frei.toFixed(0)} px breit, Karte ${m.karte.toFixed(0)} px, Dock ${m.bar[0].toFixed(0)}–${m.bar[1].toFixed(0)} zwischen ${m.lr.toFixed(0)} und ${m.rl.toFixed(0)}`);
  pruefe(`${w}×${h}: Knopf „Stabilität messen“ ohne Rollen sichtbar, Dock einzeilig`, m.messenUnten <= m.leisteUnten + 0.5 && m.messenOben >= m.leisteOben && m.barHoch < 60, `Knopf ${m.messenOben.toFixed(0)}–${m.messenUnten.toFixed(0)}, Leiste ${m.leisteOben.toFixed(0)}–${m.leisteUnten.toFixed(0)}; Dock ${m.barHoch.toFixed(0)} px hoch`);
  await seite.screenshot({ path: join(ablage, `labor-${w}.png`) });
}

console.log("\nH · Sauberkeit");
pruefe("keine Konsolenfehler", konsole.length === 0, konsole.length ? konsole.slice(0, 3).join(" ‖ ") : "0");
pruefe("keine unbehandelten Ausnahmen", ausnahmen.length === 0, ausnahmen.length ? ausnahmen.slice(0, 3).join(" ‖ ") : "0");
pruefe("keine Netzanfrage", netz.length === 0, netz.length ? netz.slice(0, 3).join(", ") : "0");

await browser.close();
console.log(`\n${gesamt - fehl} von ${gesamt} Prüfungen bestanden` + (fehl ? ` — ${fehl} FEHL` : "") + `\nBilder: ${ablage}`);
process.exit(fehl ? 1 : 0);
