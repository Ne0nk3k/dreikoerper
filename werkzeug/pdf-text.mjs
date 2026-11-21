// dreikoerper/werkzeug/pdf-text.mjs (12.11.2026) — grober Text aus einem PDF: alle FlateDecode-Ströme entpacken, Textoperatoren (Tj, TJ, ', ")
// auslesen. Nur zum Lesen fremder Daten — führt nichts aus der Datei aus.
//   node werkzeug/pdf-text.mjs quelle/liliao-2018-zusatz.pdf > quelle/liliao-2018-zusatz.txt
import { readFileSync } from "node:fs";
import { inflateSync } from "node:zlib";
const buf = readFileSync(process.argv[2]);
const s = buf.toString("latin1");
let pos = 0, raus = [];
while (true) {
  const a = s.indexOf("stream", pos); if (a < 0) break;
  let start = a + 6; if (s[start] === "\r") start++; if (s[start] === "\n") start++;
  const e = s.indexOf("endstream", start); if (e < 0) break;
  const kopf = s.slice(Math.max(0, a - 400), a);
  pos = e + 9;
  if (!/FlateDecode/.test(kopf)) continue;
  let roh; try { roh = inflateSync(buf.subarray(start, e)); } catch { try { roh = inflateSync(buf.subarray(start, e - 1)); } catch { continue; } }
  const t = roh.toString("latin1");
  if (!/T[Jj]/.test(t)) continue;
  // Text aus (…) in Tj/TJ; Zeilenwechsel bei T*, Td mit Sprung, ET
  let zeile = "";
  const re = /\[((?:\\.|[^\]])*)\]\s*TJ|\(((?:\\.|[^)])*)\)\s*(?:Tj|'|")|(T\*|ET|-?\d+\.?\d*\s+-?\d+\.?\d*\s+T[dD])/g;
  let m;
  while ((m = re.exec(t))) {
    if (m[3]) { if (zeile.trim()) raus.push(zeile); zeile = ""; continue; }
    const teile = m[1] !== undefined ? [...m[1].matchAll(/\(((?:\\.|[^)])*)\)|(-?\d+\.?\d*)/g)] : [[null, m[2]]];
    for (const p of teile) {
      if (p[1] !== undefined && p[1] !== null) zeile += p[1].replace(/\\([nrtbf()\\])/g, (x, c) => ({ n: "\n", r: "", t: " ", b: "", f: "", "(": "(", ")": ")", "\\": "\\" }[c])).replace(/\\(\d{3})/g, (x, o) => String.fromCharCode(parseInt(o, 8)));
      else if (p[2] !== undefined && +p[2] < -200) zeile += " ";
    }
  }
  if (zeile.trim()) raus.push(zeile);
}
console.log(raus.join("\n"));
