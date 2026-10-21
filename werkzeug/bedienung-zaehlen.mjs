// dreikoerper/werkzeug/bedienung-zaehlen.mjs — wie viel verlangt die Oberfläche
// des Labors von jemandem, der sie zum ersten Mal sieht?
//
//   node werkzeug/bedienung-zaehlen.mjs --fassung v4
//
// Öffnet die Fassung bei 1920×1080 und 1280×800, wartet auf den Befund der
// Acht und zählt, was ohne einen weiteren Klick sichtbar ist:
//   Bedienelemente   Knöpfe, Eingabefelder, Regler (sichtbar, im Fenster)
//   Fachwörter       Begriffe, die man ohne Vorwissen nicht versteht
//   Zahlen           Anzeigen mit sechs und mehr Ziffern oder Zehnerpotenz
//   Schrift          Elemente in Festbreitenschrift, in Versalien mit Sperrung
// Kein Urteil; nur Zahlen, um zwei Fassungen zu vergleichen.

import { homedir } from "node:os";
import { existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { pathToFileURL } from "node:url";
import { HIER } from "../quellen.mjs";

const argv = process.argv.slice(2);
const fassung = argv.includes("--fassung") ? argv[argv.indexOf("--fassung") + 1] : "v4";
const DESKTOP = join(homedir(), "Desktop");        // das Projekt liegt seit dem 03.10.2026 in Documents\Projekte
const datei = [join(DESKTOP, "werke", `dreikoerper-labor-${fassung}.html`), join(DESKTOP, "werke", "aeltere-fassungen", `dreikoerper-labor-${fassung}.html`)].find(existsSync);
const orte = [join(HIER, "node_modules", "playwright", "index.mjs"), join(DESKTOP, "gehirn-werkstatt", "node_modules", "playwright", "index.mjs")];
if (process.env.APPDATA) orte.push(join(process.env.APPDATA, "npm", "node_modules", "playwright", "index.mjs"));
const PW = orte.find(existsSync);
if (!PW || !datei) { console.error("nicht gelaufen: Playwright oder die Fassung fehlt"); process.exit(3); }
const { chromium } = await import(pathToFileURL(PW).href);

const FACH = ["Rest", "Gegenprobe", "Umkehrpunkt", "Wort", "Durchgangsfolge", "Formkugel", "T*", "τ", "Wiederkehr", "Euler-Ebene", "Freier Fall", "Symplektik", "skaliert", "Drehimpuls", "Energie", "Indizes", "Perioden", "Massen", "verfeiner", "Verfeiner", "Jagd", "Befund", "Monodromie", "v₁", "v₂", "x₃", "Störung", "Talsohle"];
const browser = await chromium.launch({ headless: true });
console.log(`Fassung ${fassung} (${datei})`);
for (const [w, h] of [[1920, 1080], [1280, 800]]) {
  const seite = await (await browser.newContext({ viewport: { width: w, height: h } })).newPage();
  await seite.goto(pathToFileURL(datei).href);
  await seite.waitForFunction(() => window.__d && window.__d.Z.befund && window.__d.Z.befund.ok, null, { timeout: 60000 });
  if (await seite.$("#los")) await seite.click("#los"); else await seite.click("#cold").catch(() => {});
  await seite.waitForTimeout(1200);
  const m = await seite.evaluate(FACH => {
    const sichtbar = el => { const r = el.getBoundingClientRect(), s = getComputedStyle(el); if (!el.checkVisibility({ checkOpacity: true, checkVisibilityCSS: true }) || !r.width || !r.height) return false;
      if (r.bottom <= 0 || r.top >= innerHeight || r.right <= 0 || r.left >= innerWidth) return false;
      for (let p = el.parentElement; p; p = p.parentElement) { const q = getComputedStyle(p); if (q.display === "none" || q.visibility === "hidden") return false; if (/(auto|scroll|hidden)/.test(q.overflowY)) { const b = p.getBoundingClientRect(); if (r.top >= b.bottom || r.bottom <= b.top) return false; } }
      return true; };
    const bedien = [...document.querySelectorAll("button, input, select, label.datei, summary, [role=button]")].filter(sichtbar);
    const text = document.body.innerText;
    const fach = FACH.filter(f => text.includes(f));
    const zahlen = (text.match(/\d[\d.,]{5,}\d|10[⁻⁰¹²³⁴⁵⁶⁷⁸⁹]+|\de[-+]?\d+/g) || []);
    let mono = 0, versal = 0;
    for (const el of document.querySelectorAll("body *")) {
      if (!el.childNodes.length || ![...el.childNodes].some(n => n.nodeType === 3 && n.textContent.trim())) continue;
      if (!sichtbar(el)) continue;
      const s = getComputedStyle(el);
      if (/mono|Consolas|Cascadia/i.test(s.fontFamily)) mono++;
      if (s.textTransform === "uppercase" && parseFloat(s.letterSpacing) > 0.5) versal++;
    }
    return { bedien: bedien.length, namen: bedien.map(b => (b.textContent || b.getAttribute("aria-label") || b.id || b.type).trim().slice(0, 22)), fach, zahlen, mono, versal, woerter: text.split(/\s+/).filter(Boolean).length };
  }, FACH);
  console.log(`\n${w}×${h}`);
  console.log(`  Bedienelemente sichtbar: ${m.bedien}   (${m.namen.join(" | ")})`);
  console.log(`  Fachwörter im sichtbaren Text: ${m.fach.length}   (${m.fach.join(", ")})`);
  console.log(`  lange Zahlen und Zehnerpotenzen: ${m.zahlen.length}   (${m.zahlen.slice(0, 14).join("  ")})`);
  console.log(`  Elemente in Festbreitenschrift: ${m.mono} · in gesperrten Versalien: ${m.versal} · Wörter im Bild: ${m.woerter}`);
  await seite.close();
}
await browser.close();
