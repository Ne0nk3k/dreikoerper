// dreikoerper/werkzeug/satellit-katalog.mjs — ist eine stabile Bahn ein
// Satellit einer GELISTETEN Bahn, auch wenn der Lauf diese nie getroffen hat?
//
//   node werkzeug/satellit-katalog.mjs
//
// abschluss.mjs sucht Satelliten nur unter den Bahnen desselben Laufs („einer
// anderen Bahn des Laufs“). Hier gegen den ganzen Katalog der Gewichte: für
// jede Bahn außerhalb der Liste, die auf 30 Stellen stabil oder an der Grenze
// ist, und jedes k = 2 … 10: gibt es eine Listenbahn mit T* ≈ T*/k (±2 %)?
// Wenn ja: ist das Wort der Bahn das k-fache des Listenworts (bis auf
// Drehung und höchstens vier Buchstaben)?

import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join } from "node:path";
import { HIER, ladeKatalog, ladeKern } from "../quellen.mjs";

// Der Katalog trägt für die Euler-Ebene keine Wörter. Sie werden hier mit dem
// eigenen Kern aus den Anfangswerten der Listenbahn gerechnet (ein Umlauf in
// double, ohne Newton) — dieselbe Rechnung, die auch die Wörter der Funde gibt.
const K = ladeKern(), pr = K.macheFundpruefer(), wortCache = new Map();
const wortVon = q => {
  if (q.wort) return q.wort;
  if (!wortCache.has(q.name + q.m)) { let w = null; try { const e = pr(q.ebene, q.m, q.a, q.b, q.T, { maxIter: 0, annahme: 1e-3, ohneStabil: true }); w = e && e.wort ? e.wort : null; } catch { w = null; } wortCache.set(q.name + q.m, w); }
  return wortCache.get(q.name + q.m);
};
const kat = ladeKatalog().bahnen, ordner = join(HIER, "ergebnisse");
const ort = (a, b) => Math.round(Math.abs(a) * 1e9) + ":" + Math.round(Math.abs(b) * 1e9);
// Levenshtein-Abstand, klein gehalten (Wörter bis einige hundert Buchstaben)
const abstand = (x, y) => { let v = Array.from({ length: y.length + 1 }, (_, j) => j); for (let i = 1; i <= x.length; i++) { const w = [i]; for (let j = 1; j <= y.length; j++) w[j] = Math.min(v[j] + 1, w[j - 1] + 1, v[j - 1] + (x[i - 1] === y[j - 1] ? 0 : 1)); v = w; } return v[y.length]; };
const drehungen = w => Array.from({ length: w.length }, (_, i) => w.slice(i) + w.slice(0, i));
for (const datei of readdirSync(ordner).filter(d => d.endsWith(".json") && !/-genau\.json$|-grauzone\.json$|^katalogabgleich|^funde\.json$/.test(d))) {
  const B = JSON.parse(readFileSync(join(ordner, datei), "utf8"));
  if (!B.funde || B.parameter.m.every(x => x === 1)) continue;
  const gp = join(ordner, B.lauf + "-genau.json"); if (!existsSync(gp)) continue;
  const genau = new Map(JSON.parse(readFileSync(gp, "utf8")).geprueft.filter(r => r.start).map(r => [ort(r.start[0], r.start[1]), r]));
  const K = kat.filter(q => q.ebene === B.parameter.ebene && q.m.join() === B.parameter.m.join());
  for (const f of B.funde) {
    if (f.bekannt || f.weitereLage) continue;
    const r = genau.get(ort(f.a, f.b)), u = r && r.stabilGenau && r.stabilGenau.urteil;
    if (u !== "stabil" && u !== "an der Grenze") continue;
    const treffer = [];
    for (let k = 2; k <= 10; k++) for (const q of K) {
      const v = f.Ts / (k * q.Ts); if (Math.abs(v - 1) > 0.02) continue;
      let wortAbstand = null;
      const qw = wortVon(q);
      if (qw && f.wort) { const soll = qw.repeat(k); if (Math.abs(soll.length - f.wort.length) <= 8) wortAbstand = Math.min(...drehungen(f.wort).map(w => abstand(w, soll))); else wortAbstand = Math.abs(soll.length - f.wort.length); }
      treffer.push({ k, name: q.name, v, wortAbstand });
    }
    const echt = treffer.filter(x => x.wortAbstand !== null && x.wortAbstand <= 4);
    console.log(`${B.lauf} T ${f.T.toFixed(3)} (${u}, Wort ${f.wort.length} Buchstaben, im Lauf: ${f.satellit ? `Satellit ${f.satellit.ordnung}. Ordnung von ${f.satellit.von}` : "kein Satellit"}): ` +
      (echt.length ? "SATELLIT laut Katalog — " + echt.map(x => `${x.k}× ${x.name} (T*-Verhältnis ${x.v.toFixed(5)}, Wort ${x.wortAbstand} Buchstaben daneben)`).join("; ")
        : treffer.length ? `T* passt zu ${treffer.length} Vielfachen, das Wort zu keinem (nächste: ${treffer.slice(0, 3).map(x => `${x.k}× ${x.name}, Wort ${x.wortAbstand === null ? "—" : x.wortAbstand + " daneben"}`).join("; ")})` : "kein Vielfaches einer Listenbahn"));
  }
}
