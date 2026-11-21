// dreikoerper/werkzeug/karte-bild.mjs — die eine Abbildung der Stabilitätskarte (21.11.2026; Felix: „nur der
// Teil, der wirklich sehenswert ist“): jede Fortsetzung eine Zeile über m3, stabile Stücke farbig.
//
//   node werkzeug/karte-bild.mjs <ziel>      liest <ziel>/daten (die veröffentlichten Tabellen, nichts sonst)
//                                            und schreibt <ziel>/bilder/stability-map-{light,dark}.{svg,png}
//
// Gebaut nach der Diagramm-Anleitung (dataviz): drei Farben in fester Reihenfolge (Referenzpalette, Validator
// hell und dunkel bestanden, alle Paare), Fortsetzungen als Haarlinien in Grau, Legende immer da, Text nie in
// Datenfarbe, dunkle Fassung eigens gestuft. PNG über Edge ohne Fenster (doppelte Auflösung), danach nur
// die PNG-Blöcke behalten, die oeffentlich-pruefen erlaubt (keine Metadaten).

import { readFileSync, writeFileSync, existsSync, mkdirSync, rmSync } from "node:fs";
import { join, resolve } from "node:path";
import { spawnSync } from "node:child_process";
import { pathToFileURL } from "node:url";

const FARBEN = {
  light: { flaeche: "#fcfcfb", text: "#0b0b0b", text2: "#52514e", leise: "#898781", gitter: "#e1e0d9", achse: "#c3c2b7", linie: "#c9c7bf", neu: "#2a78d6", fenster: "#eb6834", gelistet: "#1baf7a" },
  dark: { flaeche: "#1a1a19", text: "#f0efec", text2: "#c3c2b7", leise: "#898781", gitter: "#2c2c2a", achse: "#383835", linie: "#55544f", neu: "#3987e5", fenster: "#d95926", gelistet: "#199e70" },
};

function liesCsv(datei) {
  const z = readFileSync(datei, "utf8").split(/\r?\n/).filter(x => x && !x.startsWith("#")), kopf = z.shift().split(",");
  return z.map(x => { const w = x.split(","); return Object.fromEntries(kopf.map((k, i) => [k, w[i] ?? ""])); });
}

// Kennzahlen aus den Tabellen (zahlen.mjs im Ziel) — keine Zahl im Bild von Hand
export function zahlenAus(ziel) {
  const r = spawnSync(process.execPath, [join(ziel, "zahlen.mjs"), "--json"], { encoding: "utf8", maxBuffer: 64e6 });
  const Z = JSON.parse(r.stdout); if (r.status !== 0 || Z.fehler.length) throw new Error("zahlen.mjs meldet Widersprüche"); return Z;
}

export function karteSvg(ziel, modus, Z = zahlenAus(ziel)) {
  const F = FARBEN[modus], D = join(ziel, "daten");
  const liste = liesCsv(join(D, "list-entries.csv")).filter(e => e.status === "continued");
  const stuecke = liesCsv(join(D, "stable-pieces.csv")), kand = liesCsv(join(D, "candidates.csv"));
  const stand = new Map(kand.map(k => [k.entry, k.status]));
  const art = s => (s.candidate_piece !== "yes" ? "gelistet" : s.class === "c" ? "neu" : "fenster");
  const proEintrag = new Map(); for (const s of stuecke) { if (!proEintrag.has(s.entry)) proEintrag.set(s.entry, []); proEintrag.get(s.entry).push(s); }
  const massen = [...new Set(liste.map(e => +e.list_mass))].sort((a, b) => a - b);
  // Zeilen: je Listenmasse ein Band, darin nach Reichweite der Fortsetzung (log) absteigend
  const reich = e => Math.log(+e.continued_to) - Math.log(+e.continued_from);
  const baender = massen.map(m => ({ m, zeilen: liste.filter(e => +e.list_mass === m).sort((x, y) => reich(y) - reich(x) || +x.continued_from - +y.continued_from || (x.entry < y.entry ? -1 : 1)) }));
  const W = 1000, L = 150, R = 26, OBEN = 154, ZH = 0.72, LUECKE = 14, MIN_BAND = 34, plotW = W - L - R;
  const xmin = 0.5, xmax = 10, X = m => L + (Math.log(m) - Math.log(xmin)) / (Math.log(xmax) - Math.log(xmin)) * plotW;
  // jedes Band mindestens so hoch wie seine zweizeilige Beschriftung; kleine Bänder mittig darin
  let y = OBEN; for (const b of baender) { const h = b.zeilen.length * ZH, platz = Math.max(h, MIN_BAND); b.y0 = y + (platz - h) / 2; b.y1 = b.y0 + h; b.mitte = y + platz / 2; y += platz + LUECKE; }
  const UNTEN = y - LUECKE, H = Math.ceil(UNTEN + 62);
  const t = [], f = (x, n = 1) => x.toFixed(n), esc = s => s.replace(/&/g, "&amp;").replace(/</g, "&lt;");
  t.push(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" font-family="system-ui, -apple-system, 'Segoe UI', Helvetica, Arial, sans-serif" font-size="13">`);
  t.push(`<rect width="${W}" height="${H}" fill="${F.flaeche}"/>`);
  // Kopf: Titel, Untertitel, Legende (Text in Textfarben, Farbe nur am Zeichen daneben)
  const nNeu = kand.filter((k, i, a) => k.status === "new" && a.findIndex(x => x.family === k.family) === i).length;
  const nKandStuecke = stuecke.filter(s => s.candidate_piece === "yes").length;
  t.push(`<text x="24" y="32" font-size="18" font-weight="600" fill="${F.text}">Linear stability of the ${liste.length} continued list orbits, m1 = m2 = 1</text>`);
  t.push(`<text x="24" y="54" fill="${F.text2}">One row per continuation in m3 (Li, Jing &amp; Liao 2018), grouped by the mass at which the orbit is listed. ${stuecke.length} stable pieces at 30 digits;</text>`);
  const anteil = Z.blinderFleck.kartenanteil.map(x => Math.round(100 * x));
  // drei Zeilen (21.11.2026): „families with a new finding“ statt „new families“ — jede Familie ist die Fortsetzung
  // einer gelisteten Bahn; die längere Zeile wäre am rechten Rand abgeschnitten worden
  t.push(`<text x="24" y="72" fill="${F.text2}">${nKandStuecke} of them reach a mass where no list has the orbit: ${nNeu} families with a new finding (all are continuations of listed orbits).</text>`);
  t.push(`<text x="24" y="90" fill="${F.text2}">Probed at selected masses only, the map shows about ${anteil[1]} % (${anteil[0]}–${anteil[2]} %) of the stable length.</text>`);
  const leg = [["neu", "new stable piece (no listed mass inside)"], ["fenster", "stable window around a listed mass"], ["gelistet", "stable only where the orbit is listed"]];
  let lx = 24; const ly = 120;
  for (const [k, txt] of leg) { t.push(`<rect x="${lx}" y="${ly - 9}" width="14" height="10" rx="2" fill="${F[k]}"/><text x="${lx + 20}" y="${ly}" fill="${F.text}">${txt}</text>`); lx += 20 + txt.length * 6.6 + 16; }
  t.push(`<line x1="${lx}" y1="${ly - 4}" x2="${lx + 22}" y2="${ly - 4}" stroke="${F.linie}" stroke-width="1.5"/><text x="${lx + 28}" y="${ly}" fill="${F.text}">continuation</text>`);
  // Gitter: Haarlinien an den Listenmassen (und m3 = 1, gleiche Massen), Achse unten
  for (const m of [0.5, 0.75, 1, 2, 4, 5, 8, 10]) t.push(`<line x1="${f(X(m))}" y1="${OBEN - 6}" x2="${f(X(m))}" y2="${f(UNTEN + 4)}" stroke="${F.gitter}" stroke-width="1"/>`);
  t.push(`<line x1="${L}" y1="${f(UNTEN + 4)}" x2="${W - R}" y2="${f(UNTEN + 4)}" stroke="${F.achse}" stroke-width="1"/>`);
  for (const m of [0.5, 0.75, 1, 1.5, 2, 3, 4, 5, 6, 8, 10]) t.push(`<line x1="${f(X(m))}" y1="${f(UNTEN + 4)}" x2="${f(X(m))}" y2="${f(UNTEN + 9)}" stroke="${F.achse}"/><text x="${f(X(m))}" y="${f(UNTEN + 24)}" text-anchor="middle" fill="${F.leise}" font-variant-numeric="tabular-nums">${m}</text>`);
  t.push(`<text x="${f(L + plotW / 2)}" y="${f(UNTEN + 46)}" text-anchor="middle" fill="${F.text2}">m3 (logarithmic)</text>`);
  t.push(`<text x="24" y="${OBEN - 12}" fill="${F.leise}" font-size="12">listed at</text>`);
  // Bänder: Beschriftung links, Fortsetzungen als Haarlinien, Stücke darüber
  const zeileY = new Map();
  for (const b of baender) {
    t.push(`<text x="24" y="${f(b.mitte - 2)}" fill="${F.text}" font-weight="600">m3 = ${b.m}</text><text x="24" y="${f(b.mitte + 14)}" fill="${F.leise}" font-size="12">${b.zeilen.length} orbits</text>`);
    b.zeilen.forEach((e, i) => {
      const yy = b.y0 + (i + 0.5) * ZH; zeileY.set(e.entry, yy);
      const x0 = X(+e.continued_from), x1 = X(+e.continued_to);
      t.push(x1 - x0 < 1.2 ? `<rect x="${f(x0 - 0.6, 2)}" y="${f(yy - ZH / 2, 2)}" width="1.2" height="${ZH}" fill="${F.linie}"/>` : `<rect x="${f(x0, 2)}" y="${f(yy - ZH / 2, 2)}" width="${f(x1 - x0, 2)}" height="${ZH}" fill="${F.linie}"/>`);
    });
  }
  for (const k of ["gelistet", "fenster", "neu"]) for (const [d, L2] of proEintrag) for (const s of L2.filter(s => art(s) === k)) {
    const yy = zeileY.get(d), a = X(+s.from_m3), b = X(+s.to_m3), w = Math.max(3, b - a + 2);
    t.push(`<rect x="${f((a + b) / 2 - w / 2, 2)}" y="${f(yy - 1.7, 2)}" width="${f(w, 2)}" height="3.4" rx="1" fill="${F[k]}"/>`);
  }
  // zwei Hinweise mit Führungslinie: unsere frühere Veröffentlichung und der eine nicht prüfbare Fall
  // zweizeilig, in die freie Fläche unter den langen Zeilen des Bandes; Führungslinie zum Stück
  const hinweis = (d, zeilen, dx, dy) => {
    const s = (proEintrag.get(d) || []).find(s => s.candidate_piece === "yes"); if (!s) return;
    const yy = zeileY.get(d), xm = (X(+s.from_m3) + X(+s.to_m3)) / 2, tx = xm + dx, ty = yy + dy, rechts = dx > 0;
    t.push(`<line x1="${f(xm)}" y1="${f(yy + 2)}" x2="${f(tx + (rechts ? -4 : 4))}" y2="${f(ty - 10)}" stroke="${F.text2}" stroke-width="1"/>`);
    zeilen.forEach((z, i) => t.push(`<text x="${f(tx)}" y="${f(ty + i * 15)}" ${rechts ? "" : 'text-anchor="end" '}fill="${F.text2}" font-size="12">${esc(z)}</text>`));
  };
  const eigen = kand.find(k => k.status === "own"), offen = kand.find(k => k.status === "not checkable");
  if (eigen) hinweis(eigen.entry, ["the 1 : 1 : 4 orbit,", "published before (v1.0.0)"], 46, 58);
  if (offen) hinweis(offen.entry, [`${offen.entry}: not checkable`, "(BHH catalogue 2020)"], -70, 64);
  t.push("</svg>");
  return { svg: t.join("\n") + "\n", W, H, stand };
}

// PNG: nur IHDR, PLTE, IDAT, IEND, tRNS, gAMA, sRGB, pHYs, cHRM behalten (oeffentlich-pruefen.mjs)
function pngOhneMetadaten(buf) {
  const OK = new Set(["IHDR", "PLTE", "IDAT", "IEND", "tRNS", "gAMA", "sRGB", "pHYs", "cHRM"]), teile = [buf.subarray(0, 8)];
  for (let i = 8; i + 8 <= buf.length;) { const n = buf.readUInt32BE(i), typ = buf.toString("latin1", i + 4, i + 8); if (OK.has(typ)) teile.push(buf.subarray(i, i + 12 + n)); i += 12 + n; }
  return Buffer.concat(teile);
}
const EDGE = ["C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe", "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe"].find(p => existsSync(p));

export function baueBilder(ziel, tmp) {
  mkdirSync(join(ziel, "bilder"), { recursive: true });
  const aus = [], Z = zahlenAus(ziel);
  for (const modus of ["light", "dark"]) {
    const { svg, W, H } = karteSvg(ziel, modus, Z), name = `stability-map-${modus}`;
    writeFileSync(join(ziel, "bilder", name + ".svg"), svg);
    if (!EDGE) throw new Error("Edge nicht gefunden — kein PNG");
    // eigenes, leeres Profil im Arbeitsordner der Sitzung; das Profil von Felix bleibt unberührt
    const profil = join(tmp, "edge-profil-" + modus), png = join(tmp, name + ".png");
    rmSync(profil, { recursive: true, force: true }); rmSync(png, { force: true });
    // die SVG in einer kleinen Seite ohne Rand: Fenster genau so groß wie das Bild
    const seite = join(tmp, name + ".html");
    writeFileSync(seite, `<!doctype html><meta charset="utf-8"><style>html,body{margin:0;padding:0;background:${FARBEN[modus].flaeche}}img{display:block}</style><img src="${pathToFileURL(join(ziel, "bilder", name + ".svg")).href}" width="${W}" height="${H}">`);
    const r = spawnSync(EDGE, ["--headless=new", "--disable-gpu", "--hide-scrollbars", "--no-first-run", "--no-default-browser-check", "--disable-extensions",
      `--user-data-dir=${profil}`, "--force-device-scale-factor=2", `--window-size=${W},${H}`, `--screenshot=${png}`, pathToFileURL(seite).href], { encoding: "utf8", timeout: 120000 });
    if (!existsSync(png)) throw new Error(`Edge schrieb kein PNG (${r.status}): ${(r.stderr || "").slice(0, 400)}`);
    writeFileSync(join(ziel, "bilder", name + ".png"), pngOhneMetadaten(readFileSync(png)));
    rmSync(profil, { recursive: true, force: true });
    aus.push({ modus, W, H });
  }
  return aus;
}

if (process.argv[1] && resolve(process.argv[1]) === resolve(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1"))) {
  const ziel = resolve(process.argv[2] || join(process.cwd(), "..", "dreikoerper-stability-map"));
  const tmp = process.env.CLAUDE_JOB_DIR ? join(process.env.CLAUDE_JOB_DIR, "tmp") : join(ziel, "..", "bild-tmp");
  mkdirSync(tmp, { recursive: true });
  for (const b of baueBilder(ziel, tmp)) console.log(`Bild ${b.modus}: ${b.W} × ${b.H} (PNG doppelt)`);
}
