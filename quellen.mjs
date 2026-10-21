// dreikoerper/quellen.mjs — liest die Tabellen aus quelle\ in Datensätze.
//
// Die Dateien sind HTML-Tabellen in Markdown-Hülle, unverändert aus
// github.com/sjtu-liao/three-body (01.10.2026). Hier wird nichts gerundet und
// nichts ergänzt; was nicht in der Quelle steht, steht nicht im Datensatz.

import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

export const HIER = dirname(fileURLToPath(import.meta.url));
const lies = name => readFileSync(join(HIER, "quelle", name), "utf8");

export function ladeKern() {
  const text = readFileSync(join(HIER, "kern.js"), "utf8");
  return new Function(text.replace(/if \(typeof module[\s\S]*$/, "") + "\nreturn Kern;")();
}

function zeilen(text) {
  const aus = [];
  for (const stueck of text.split(/<tr>/i).slice(1)) {
    const zellen = [...stueck.matchAll(/<t[hd][^>]*>([\s\S]*?)<\/t[hd]>/gi)]
      .map(z => z[1].replace(/&nbsp;/g, " ").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim());
    if (zellen.length) aus.push(zellen);
  }
  return aus;
}

// "I.A i.c. 12" oder "I.A i.c. 12 (0.5)" -> { klasse, nr, m3 }
function marke(s) {
  const t = s.match(/^([IVX]+\.[A-Z])\s*i\.c\.\s*(\d+)(?:\s*\(([\d.]+)\))?/);
  if (!t) return null;
  return { klasse: t[1], nr: +t[2], m3: t[3] ? +t[3] : 1 };
}
// "F 12 (1,1,1)" oder "F 12 (0.8,0.8,1)"
function fallmarke(s) {
  const t = s.match(/^F\s*(\d+)\s*\(([\d.]+),\s*([\d.]+),\s*([\d.]+)\)/);
  if (!t) return null;
  return { nr: +t[1], m: [+t[2], +t[3], +t[4]] };
}

export function ladeQuellen() {
  const aus = { gleich: [], ungleich: [], fall: [], uebergangen: [] };

  const woerter = (datei, leser) => {
    const w = new Map();
    for (const z of zeilen(lies(datei))) {
      const k = leser(z[0]);
      if (k && z[1] && /^[abAB]+$/.test(z[1])) w.set(JSON.stringify(k), z[1]);
    }
    return w;
  };

  for (const [bilder, wortdatei, ziel] of [["bilder.md", "equal.md", "gleich"],
                                           ["ungleich-bilder.md", "ungleich.md", "ungleich"]]) {
    const w = woerter(wortdatei, marke);
    for (const z of zeilen(lies(bilder))) {
      const k = marke(z[0]);
      if (!k) { if (!/Class/.test(z[0])) aus.uebergangen.push(bilder + ": " + z[0].slice(0, 40)); continue; }
      const [a, b, T, Ts, Lf] = z.slice(1, 6).map(Number);
      if (![a, b, T].every(Number.isFinite)) { aus.uebergangen.push(bilder + ": " + z.join("|").slice(0, 60)); continue; }
      aus[ziel].push({ ebene: "euler", name: `${k.klasse}-${k.nr}`, klasse: k.klasse, nr: k.nr,
                       m: [1, 1, k.m3], a, b, T, Ts, Lf, wort: w.get(JSON.stringify(k)) || null });
    }
  }

  const w = woerter("frei.md", fallmarke);
  for (const z of zeilen(lies("frei-bilder.md"))) {
    const k = fallmarke(z[0]);
    if (!k) { if (!/F i/.test(z[0])) aus.uebergangen.push("frei-bilder.md: " + z[0].slice(0, 40)); continue; }
    const [a, b, T] = z.slice(1, 4).map(Number);
    if (![a, b, T].every(Number.isFinite)) { aus.uebergangen.push("frei-bilder.md: " + z.join("|").slice(0, 60)); continue; }
    aus.fall.push({ ebene: "fall", name: `F-${k.nr}`, nr: k.nr, m: k.m, a, b, T,
                    wort: w.get(JSON.stringify(k)) || null });
  }
  return aus;
}

// Der fertige Katalog (katalog-bauen.mjs) und der Abgleich eines Fundes.
export function ladeKatalog() {
  return JSON.parse(readFileSync(join(HIER, "katalog.json"), "utf8"));
}
const gleicheMassen = (a, b) => a.length === b.length && a.every((x, i) => Math.abs(x - b[i]) < 1e-12);

// Vier Stufen, von hart nach weich:
//   ort     — gleicher Punkt der Ebene (|Δ| < 1e-6), gleiche Massen: dieselbe Bahn
//   lage    — gleiche skalierte Periode T* auf acht Stellen: dieselbe Bahn,
//             an einer anderen Stelle der Ebene getroffen
//   klasse  — gleiche Klasse, anderes T*: eine andere Bahn derselben Familie
//   keine   — nichts davon
export function gleicheAb(fund, katalog) {
  const selbe = katalog.bahnen.filter(k => k.ebene === fund.ebene && gleicheMassen(k.m, fund.m));
  const A = Math.abs(fund.a), B = Math.abs(fund.b);
  let naechster = null, dMin = Infinity;
  for (const k of selbe) {
    const d = Math.hypot(Math.abs(k.a) - A, Math.abs(k.b) - B);
    if (d < dMin) { dMin = d; naechster = k; }
  }
  if (naechster && dMin < 1e-6) return { stufe: "ort", eintrag: naechster, abstand: dMin };
  const ts = k => Math.abs(k.Ts / fund.Ts - 1);
  // Gleiches T* auf acht Stellen genügt, auch wenn die Klasse anders
  // herauskommt: im Lauf euler-m3-2 stand eine Bahn als „in keiner Liste",
  // deren T* auf 3.8e-9 das von I.A-9 war — an anderer Stelle gekreuzt, mit
  // anderer Kennung. Gemessen (werkzeug/liliao-ts.mjs): an 36 Ortstreffern
  // weicht T* höchstens 4.9e-9 ab, die nächste fremde Bahn liegt 1.3e-5 weg.
  const gleichesTs = selbe.filter(k => ts(k) < 2e-8).sort((x, y) => ts(x) - ts(y))[0];
  if (gleichesTs) return { stufe: "lage", eintrag: gleichesTs, abstand: dMin };
  // Bis zum 02.10.2026 galt als „Lage" auch: gleiche Klasse und T* auf fünf
  // Stellen gleich (im freien Fall: sechs). Das war zu weit. Von 88 solchen
  // Funden stimmten 62 auf acht Stellen; die übrigen 26 haben ein anderes |λ|
  // als die Listenbahn oder sogar eine andere Stabilität — es sind andere
  // Bahnen derselben Klasse mit fast gleicher Periode. Aufgefallen an einer
  // „Acht (andere Lage)", die sich instabil maß (werkzeug/lage-pruefen.mjs).
  if (fund.ebene === "fall") return { stufe: "keine", eintrag: naechster, abstand: dMin };
  const klasse = selbe.filter(k => k.kennung === fund.kennung);
  if (klasse.length) return { stufe: "klasse", eintrag: klasse.sort((x, y) => ts(x) - ts(y))[0], abstand: dMin, mitglieder: klasse.length };
  return { stufe: "keine", eintrag: naechster, abstand: dMin };
}

// Der große Katalog für gleiche Massen (katalog-gross-bauen.mjs): mehrere
// hunderttausend Anfangswerte, über ein Gitter schnell nach dem nächsten
// Nachbarn zu befragen.
export function ladeGross() {
  const meta = JSON.parse(readFileSync(join(HIER, "katalog-gross.json"), "utf8"));
  const aus = { meta };
  for (const ebene of Object.keys(meta.ebenen)) {
    const roh = readFileSync(join(HIER, `katalog-gross-${ebene}.bin`));
    const w = new Float64Array(roh.buffer, roh.byteOffset, roh.byteLength / 8);
    const q = new Uint8Array(readFileSync(join(HIER, `katalog-gross-${ebene}.q`)));
    const n = q.length, Z = 0.002, G = Math.ceil(1.05 / Z);
    const zelle = i => Math.min(G - 1, Math.max(0, Math.floor(Math.abs(w[4 * i]) / Z))) * G + Math.min(G - 1, Math.max(0, Math.floor(Math.abs(w[4 * i + 1]) / Z)));
    const start = new Int32Array(G * G + 1);
    for (let i = 0; i < n; i++) start[zelle(i) + 1]++;
    for (let c = 0; c < G * G; c++) start[c + 1] += start[c];
    const ordnung = new Int32Array(n), fuell = start.slice(0, G * G);
    for (let i = 0; i < n; i++) ordnung[fuell[zelle(i)]++] = i;
    // nach T* sortiert, für die Frage „führt die Liste eine Bahn mit diesem T*?"
    const nachTs = Int32Array.from({ length: n }, (_, i) => i).sort((x, y) => w[4 * x + 3] - w[4 * y + 3]);
    aus[ebene] = {
      n, w, q, quellen: meta.ebenen[ebene].quellen,
      mitTs(Ts, tolRel) {
        let lo = 0, hi = n - 1;
        while (lo < hi) { const mi = (lo + hi) >> 1; if (w[4 * nachTs[mi] + 3] < Ts) lo = mi + 1; else hi = mi; }
        let best = null, d = Infinity;
        for (const k of [lo - 1, lo, lo + 1]) {
          if (k < 0 || k >= n) continue;
          const i = nachTs[k], e = Math.abs(w[4 * i + 3] / Ts - 1);
          if (e < d) { d = e; best = i; }
        }
        return best !== null && d < tolRel ? { a: w[4 * best], b: w[4 * best + 1], T: w[4 * best + 2], Ts: w[4 * best + 3], quelle: q[best], abweichung: d } : null;
      },
      // nächster Eintrag zu (a,b) im Umkreis einer Gitterzelle
      naechster(a, b) {
        a = Math.abs(a); b = Math.abs(b);
        const ca = Math.floor(a / Z), cb = Math.floor(b / Z);
        let best = -1, d = Infinity;
        for (let p = ca - 1; p <= ca + 1; p++) for (let r = cb - 1; r <= cb + 1; r++) {
          if (p < 0 || r < 0 || p >= G || r >= G) continue;
          for (let k = start[p * G + r]; k < start[p * G + r + 1]; k++) {
            const i = ordnung[k], e = Math.hypot(w[4 * i] - a, w[4 * i + 1] - b);
            if (e < d) { d = e; best = i; }
          }
        }
        return best < 0 ? null : { abstand: d, i: best, a: w[4 * best], b: w[4 * best + 1], T: w[4 * best + 2], Ts: w[4 * best + 3], quelle: q[best] };
      },
      // alle Einträge im Fenster mit T ≤ Tmax; gleiche Punkte aus mehreren Listen einmal
      imFenster(a0, a1, b0, b1, Tmax) {
        const liste = [];
        for (let i = 0; i < n; i++) {
          const a = w[4 * i], b = w[4 * i + 1];
          if (a >= a0 && a <= a1 && b >= b0 && b <= b1 && w[4 * i + 2] <= Tmax) liste.push(i);
        }
        liste.sort((x, y) => w[4 * x] - w[4 * y] || w[4 * x + 1] - w[4 * y + 1]);
        const einmal = [];
        for (const i of liste) {
          const l = einmal[einmal.length - 1];
          if (l !== undefined && Math.abs(w[4 * l] - w[4 * i]) < 1e-9 && Math.abs(w[4 * l + 1] - w[4 * i + 1]) < 1e-9) continue;
          einmal.push(i);
        }
        return einmal;
      }
    };
  }
  return aus;
}

// Tabelle I aus Šuvakov und Dmitrašinović 2013 (arXiv:1303.0181v1, Seite 3),
// von Hand aus der PDF in quelle\ übertragen. Die Acht steht nicht in der
// Tabelle; sie ist Li/Liaos I.A-1.
export const SUVAKOV = [
  ["I.A.1",   "Schmetterling I",   0.30689,  0.12551,  6.2356,  "ababABAB"],
  ["I.A.2",   "Schmetterling II",  0.39295,  0.09758,  7.0039,  "ababABAB"],
  ["I.A.3",   "Hummel",            0.18428,  0.58719,  63.5345, "bbABabABabAAbaBAbaBAbaBBabABabABaaBAbaBAbaBA"],
  ["I.B.1",   "Motte I",           0.46444,  0.39606,  14.8939, "baBABabABA"],
  ["I.B.2",   "Motte II",          0.43917,  0.45297,  28.6703, "abABabABAbaBAbaBAB"],
  ["I.B.3",   "Schmetterling III", 0.40592,  0.23016,  13.8658, "ababABAbabaBAB"],
  ["I.B.4",   "Motte III",         0.38344,  0.37736,  25.8406, "babABAbabABAaabaBABabaBABb"],
  ["I.B.5",   "Brille",            0.08330,  0.12789,  10.4668, "ababABBAbabaBAAB"],
  ["I.B.6",   "Schmetterling IV",  0.350112, 0.07934,  79.4759, null],
  ["I.B.7",   "Libelle",           0.08058,  0.58884,  21.2710, "bbABabABaaBAbaBA"],
  ["II.B.1",  "Garn",              0.55906,  0.34919,  55.5018, "babABabaBAbabABabaBAbabABabaBA"],
  ["II.C.2a", "Yin-Yang I a",      0.51394,  0.30474,  17.3284, "ababABAbaBAB"],
  ["II.C.2b", "Yin-Yang I b",      0.28270,  0.32721,  10.9626, "ababABAbaBAB"],
  ["II.C.3a", "Yin-Yang II a",     0.41682,  0.33033,  55.7898, "abaBABabaBABabaBABabaBAbabABAbabABAbabABAbabABAB"],
  ["II.C.3b", "Yin-Yang II b",     0.41734,  0.31310,  54.2076, "abaBABabaBABabaBABabaBAbabABAbabABAbabABAbabABAB"],
].map(([nr, name, a, b, T, wort]) => ({ nr, name, a, b, T, wort }));
