// dreikoerper/abschluss.mjs — vom Haufen geschlossener Bahnen zum Bericht.
//
// Gemeinsamer zweiter Teil von suche.mjs und nachbereiten.mjs: gleiche Bahnen
// zusammenlegen, Urteil, Abgleich mit den Katalogen, die Gegenrichtung
// (Wiederfinden), dann JSON, Bericht und Karte.
//
// Eingabe: { P, zeiten, faeden, karte:{arten, d, N}, kandidaten:{…}, konv, ausnahmen }
//   konv: Ergebnisse der Prüfkette mit ok === true

import { writeFileSync, mkdirSync, existsSync } from "node:fs";
import { join } from "node:path";
import { ladeKern, ladeKatalog, ladeGross, ladeQuellen, gleicheAb, HIER } from "./quellen.mjs";
import { karteAlsPng } from "./bild.mjs";

const z = (x, n) => (typeof x !== "number" || !Number.isFinite(x) ? String(x) : x === 0 ? "0" : Math.abs(x) < 1e-3 || Math.abs(x) >= 1e5 ? x.toExponential(n ?? 1) : x.toPrecision(n ?? 4));

export function abschliessen({ P, zeiten, faeden, karte, kandidaten, konv, ausnahmen }) {
  const K = ladeKern(), katalog = ladeKatalog();
  const ordner = join(HIER, "ergebnisse"); mkdirSync(ordner, { recursive: true });
  const [a0, a1, b0, b1] = P.sicht, N = P.raster, HALB = P.art === "halb", ach = K.EBENEN[P.ebene];
  const arten = karte.arten;

  // Dieselbe Bahn aus mehreren Talsohlen: zusammenlegen. Gleicher Ort heißt
  // gleiche Bahn — die Periode gehört nicht zum Vergleich (ein Vielfaches
  // derselben Periode ist keine zweite Bahn). Es bleibt der Treffer mit der
  // kürzesten Periode, bei Gleichstand der mit dem genauesten Umkehrpunkt.
  const funde = [], netz0 = new Map();
  const guete = r => (r.halb ? r.halb.rest : r.rest);
  for (const r of konv.slice().sort((x, y) => (Math.abs(x.T / y.T - 1) < 1e-5 ? guete(x) - guete(y) : x.T - y.T))) {
    let schon = null;
    const ka = Math.round(Math.abs(r.a) * 2e5), kb = Math.round(Math.abs(r.b) * 2e5);
    for (let p = -1; p <= 1 && !schon; p++) for (let q = -1; q <= 1 && !schon; q++)
      for (const f of netz0.get((ka + p) + ":" + (kb + q)) || []) if (Math.hypot(Math.abs(f.a) - Math.abs(r.a), Math.abs(f.b) - Math.abs(r.b)) < 1e-6) { schon = f; break; }
    if (schon) { schon.treffer++; if (Math.abs(r.T / schon.T - 1) > 1e-5) schon.vielfache = (schon.vielfache || 0) + 1; continue; }
    r.treffer = 1; funde.push(r);
    const s = ka + ":" + kb; if (!netz0.has(s)) netz0.set(s, []); netz0.get(s).push(r);
  }

  // Zwei Kataloge: der kleine mit Namen und Klassen (Li/Liao, 2013), und für
  // gleiche Massen der große von Hristov u. a. (nur Ort, T, T*).
  const gleicheMassen = P.m.every(x => x === 1);
  const grossAlle = gleicheMassen && existsSync(join(HIER, "katalog-gross.json")) ? ladeGross() : null;
  const gross = grossAlle ? grossAlle[P.ebene] : null, grossAndere = grossAlle ? grossAlle[P.ebene === "euler" ? "fall" : "euler"] : null;
  for (const f of funde) {
    // „bestätigt": der volle Umlauf schließt sich in double scharf, mit zwei
    // Verfahren. „über den Umkehrpunkt": der halbe Umlauf trifft die Fixmenge
    // scharf, der volle ist für double zu empfindlich. Sonst „Rechengrenze".
    f.urteil = f.rest < 1e-10 && f.gegenprobe < 1e-8 ? "bestätigt" : f.halb && f.halb.rest < 1e-11 ? "über den Umkehrpunkt" : "an der Rechengrenze";
    const g = gleicheAb(f, katalog);
    f.katalog = { stufe: g.stufe, name: g.eintrag ? g.eintrag.name : null, rufname: g.eintrag && g.eintrag.rufname || null,
                  quelle: g.eintrag ? g.eintrag.quelle : null, abstand: g.abstand, mitglieder: g.mitglieder || null };
    f.gross = null;
    if (gross) {
      const n = gross.naechster(f.a, f.b);
      if (n && n.abstand < 1e-6) f.gross = { stufe: "ort", abstand: n.abstand, quelle: gross.quellen[n.quelle].zitat, T: n.T, Ts: n.Ts };
      else {
        // gleiches T*: dieselbe Bahn an anderer Stelle — in dieser Ebene oder
        // (eine Bahn mit Ruhepunkt UND Euler-Aufstellung steht in beiden) in der anderen
        let t = gross.mitTs(f.Ts, 1e-8), wo = gross;
        if (!t && grossAndere) { t = grossAndere.mitTs(f.Ts, 1e-8); wo = grossAndere; }
        f.gross = t ? { stufe: "lage", abstand: n ? n.abstand : null, quelle: wo.quellen[t.quelle].zitat, a: t.a, b: t.b, T: t.T, Ts: t.Ts, andereEbene: wo !== gross }
                    : { stufe: "keine", abstand: n ? n.abstand : null };
      }
    }
    // Gesamturteil „bekannt": irgendeine Liste führt diese Bahn
    f.bekannt = f.katalog.stufe === "ort" || f.katalog.stufe === "lage" || !!(f.gross && f.gross.stufe !== "keine");
    f.imFenster = Math.abs(f.a) >= a0 && Math.abs(f.a) <= a1 && Math.abs(f.b) >= b0 && Math.abs(f.b) <= b1;
  }
  funde.sort((x, y) => x.T - y.T);

  // Dieselbe Bahn an mehreren Stellen der Ebene. Zusammengelegt wurde oben
  // nach dem Ort; eine Bahn kann die Ebene aber mehrmals kreuzen — im freien
  // Fall hat jede zwei Ruhepunkte, in der Euler-Ebene kann sie mehrere
  // Euler-Aufstellungen verschiedener Größe durchlaufen. Die skalierte Periode
  // T* ist für alle Lagen dieselbe. Schwelle wie beim Abgleich mit den Listen
  // (acht Stellen); gemessen weicht T* aus double bei 516 nachgeprüften Bahnen
  // höchstens 1.1e-10 vom 30-stelligen Wert ab (werkzeug/abgleich-genau.mjs).
  // Im Lauf fall-gleich-1 standen so 31 Bahnen doppelt in der Zählung.
  {
    const nachTs = funde.slice().sort((x, y) => x.Ts - y.Ts);
    let nr = 0;
    nachTs.forEach((f, i) => { if (i && f.Ts / nachTs[i - 1].Ts - 1 > 1e-8) nr++; f.bahnNr = nr; });
    const zahl = new Map(), gesehen = new Set();
    for (const f of funde) zahl.set(f.bahnNr, (zahl.get(f.bahnNr) || 0) + 1);
    // funde ist nach T sortiert: die Lage mit der kürzesten Periode zählt, die anderen sind „weitere Lagen"
    for (const f of funde) { f.lagen = zahl.get(f.bahnNr); f.weitereLage = gesehen.has(f.bahnNr); gesehen.add(f.bahnNr); }
  }
  const bahnen = funde.filter(f => !f.weitereLage);

  // Satelliten. Ein Satellit k-ter Ordnung läuft k-mal fast den Weg seiner
  // Grundbahn, bevor er sich schließt: sein Wort ist das k-fache Wort, seine
  // skalierte Periode (fast) das k-fache. Der Abgleich oben prüft gleiches
  // T*, nie Vielfache — ein Satellit einer längst bekannten Bahn steht deshalb
  // immer als „in keiner Liste". Am 02.10.2026 habe ich so eine stabile Bahn
  // bei den Massen 1/1/2 als unerklärten Fund gemeldet; sie war der Satellit
  // 7. Ordnung der gelisteten I.A-2 (Wortlänge 84 = 7 × 12, T* = 7,00015-fach).
  // Grundbahnen: die Funde dieses Laufs und die Listenbahnen mit Wort.
  // Als Satellit gilt: Wortlänge genau k-fach (k ≥ 2), T* innerhalb von 2 %
  // beim k-fachen, und das Wort bis auf höchstens vier Buchstaben das k-fache
  // (über alle Drehungen, rückwärts gelesen und mit vertauschten Rollen).
  {
    const gross1 = c => (c === c.toLowerCase() ? c.toUpperCase() : c.toLowerCase());
    const invers = w => [...w].reverse().map(gross1).join(""), tausch = w => [...w].map(c => ({ a: "b", b: "a", A: "B", B: "A" }[c] || c)).join("");
    const formen = w => [...new Set([w, invers(w), tausch(w), invers(tausch(w)), [...w].map(gross1).join(""), [...tausch(w)].map(gross1).join("")])];
    const abweichung = (wort, grund, k) => {
      const ziel = grund.repeat(k), n = ziel.length; let best = Infinity;
      for (const zf of formen(ziel)) for (let d = 0; d < grund.length; d++) {
        let ab = 0;
        for (let i = 0; i < n && ab < best; i++) if (wort[i] !== zf[(i + d) % n]) ab++;
        if (ab < best) best = ab;
      }
      return best;
    };
    const gleichMassen = k => k.m.every((v, i) => Math.abs(v - P.m[i]) < 1e-12);
    const nameVon = f => (f.katalog.stufe === "ort" || f.katalog.stufe === "lage" ? (f.katalog.rufname || f.katalog.name) : f.gross && f.gross.stufe !== "keine" ? "Bahn bei Hristov u. a." : null);
    const basen = funde.filter(f => f.wort && f.wort.length >= 2).map(f => ({ wort: f.wort, Ts: f.Ts, name: nameVon(f), bekannt: f.bekannt, stabil: f.stabil, fund: f }));
    if (P.ebene === "euler") {
      const Q = ladeQuellen(), kat = katalog.bahnen.filter(k => k.ebene === P.ebene && gleichMassen(k));
      for (const satz of ["gleich", "ungleich"]) for (const e of Q[satz] || []) {
        if (e.ebene !== P.ebene || !e.wort || !gleichMassen(e)) continue;
        const k = kat.find(x => x.name === e.name && x.satz === satz);
        if (k) basen.push({ wort: e.wort, Ts: k.Ts, name: k.rufname || k.name, bekannt: true, stabil: undefined, fund: null });
      }
    }
    for (const f of funde) {
      f.satellit = null;
      if (f.bekannt || !f.wort || f.wort.length < 4) continue;
      let best = null;
      for (const g of basen) {
        if (g.fund === f || g.Ts > f.Ts / 1.5) continue;
        const k = Math.round(f.Ts / g.Ts);
        if (k < 2 || f.wort.length !== k * g.wort.length) continue;
        const ab = Math.abs(f.Ts / (k * g.Ts) - 1);
        if (ab > 0.02) continue;
        const buch = abweichung(f.wort, g.wort, k);
        if (buch > 4) continue;
        // die beste Grundbahn: wenige Abweichungen, dann eine gelistete, dann das nähere T*
        if (!best || buch < best.buchstaben || (buch === best.buchstaben && (g.bekannt && !best.grundBekannt || (g.bekannt === best.grundBekannt && ab < best.ab)))) best = { von: g.name || `Fund (${g.fund.a.toFixed(6)}, ${g.fund.b.toFixed(6)})`, ordnung: k, verhaeltnis: f.Ts / g.Ts, buchstaben: buch, grundBekannt: !!g.bekannt, grundStabil: g.stabil === undefined ? null : g.stabil, ab };
      }
      if (best) { delete best.ab; f.satellit = best; }
    }
  }
  const satelliten = funde.filter(f => f.satellit);

  // Gegenrichtung: welche Katalogbahnen im Fenster (T ≤ tmax) hat der Lauf gefunden?
  const netz = new Map(), schl = (a, b) => Math.round(a * 1e5) + ":" + Math.round(b * 1e5);
  for (const f of funde) { const s = schl(Math.abs(f.a), Math.abs(f.b)); if (!netz.has(s)) netz.set(s, []); netz.get(s).push(f); }
  const trifft = (a, b) => {
    const ka = Math.round(a * 1e5), kb = Math.round(b * 1e5);
    for (let p = -1; p <= 1; p++) for (let q = -1; q <= 1; q++) for (const f of netz.get((ka + p) + ":" + (kb + q)) || []) if (Math.abs(Math.abs(f.a) - a) < 1e-6 && Math.abs(Math.abs(f.b) - b) < 1e-6) return true;
    return false;
  };
  const gleichM = (x, y) => x.every((v, i) => Math.abs(v - y[i]) < 1e-12);
  const soll = katalog.bahnen.filter(k => k.ebene === P.ebene && gleichM(k.m, P.m) && k.a >= a0 && k.a <= a1 && k.b >= b0 && k.b <= b1 && k.T <= P.tmax && k.T >= P.tmin);
  const gefundenSoll = soll.filter(k => trifft(k.a, k.b));
  const verpasst = soll.filter(k => !gefundenSoll.includes(k));
  let grossSoll = null;
  if (gross) {
    const idx = gross.imFenster(a0, a1, b0, b1, P.tmax).filter(i => gross.w[4 * i + 2] >= P.tmin);
    const baender = [10, 20, 30, 40, 60, 80, 100, 150, 200, 1e9].filter((t, k, l) => k === 0 || l[k - 1] < P.tmax), proBand = baender.map(() => [0, 0]);
    let gef = 0;
    for (const i of idx) {
      const a = gross.w[4 * i], b = gross.w[4 * i + 1], T = gross.w[4 * i + 2], ok = trifft(a, b);
      if (ok) gef++;
      const k = baender.findIndex(t => T < t); if (k >= 0) { proBand[k][0]++; if (ok) proBand[k][1]++; }
    }
    grossSoll = { soll: idx.length, gefunden: gef, baender: baender.map((t, k) => ({ bis: t, soll: proBand[k][0], gefunden: proBand[k][1] })).filter(x => x.soll) };
  }

  const zaehl = s => funde.filter(f => f.katalog.stufe === s).length;
  const zaehlG = s => funde.filter(f => f.gross && f.gross.stufe === s).length;
  const zaehlU = s => funde.filter(f => f.urteil === s).length;
  const unbekannt = funde.filter(f => !f.bekannt);
  const stab = funde.filter(f => f.stabil === true);

  /* ── Karte ── */
  if (karte.d) {
    const marken = [];
    const iVon = a => (Math.abs(a) - a0) / (a1 - a0) * N, jVon = b => (Math.abs(b) - b0) / (b1 - b0) * N;
    for (const k of verpasst) marken.push({ i: iVon(k.a), j: jVon(k.b), art: 2 });
    if (funde.length <= 3000) { for (const f of funde) if (f.imFenster) marken.push({ i: iVon(f.a), j: jVon(f.b), art: f.bekannt ? 0 : 1 }); }
    else for (const f of unbekannt) if (f.imFenster) marken.push({ i: iVon(f.a), j: jVon(f.b), art: 1 });
    karteAlsPng(join(ordner, P.name + ".png"), karte.d, N, marken, N >= 1024 ? 1 : N >= 512 ? 2 : 3);
  }

  /* ── JSON ── */
  const bericht = { lauf: P.name, datum: new Date().toISOString(), parameter: P, faeden, zeiten,
    karte: { zellen: N * N, durchgelaufen: arten[0], zerfall: arten[1], abgebrochen: arten[2], ungebunden: arten[4] },
    kandidaten,
    funde: funde.map(f => ({ a: f.a, b: f.b, T: f.T, Ts: f.Ts, E: f.E, L: f.L, rest: f.rest, gegenprobe: f.gegenprobe, drift: f.drift,
      urteil: f.urteil, stabil: f.stabil, lambda: f.lambda, s1: f.s1, s2: f.s2, sIm: f.sIm, sKomplex: f.sKomplex, symplektik: f.symplektik,
      rMin: f.rMin, wort: f.wort, folge: f.folge, kennung: f.kennung, teiler: f.teiler || 1, treffer: f.treffer, vielfache: f.vielfache || 0, halb: f.halb || null,
      katalog: f.katalog, gross: f.gross, bekannt: f.bekannt, imFenster: f.imFenster, lagen: f.lagen, weitereLage: f.weitereLage, satellit: f.satellit })),
    bahnen: { orte: funde.length, verschieden: bahnen.length, unbekannteOrte: unbekannt.length, unbekannteVerschieden: unbekannt.filter(f => !f.weitereLage).length,
              satelliten: satelliten.length, satellitenGelisteter: satelliten.filter(f => f.satellit.grundBekannt).length },
    wiederfinden: { soll: soll.length, gefunden: gefundenSoll.length, verpasst: verpasst.map(k => ({ name: k.name, a: k.a, b: k.b, T: k.T })), gross: grossSoll } };
  writeFileSync(join(ordner, P.name + ".json"), JSON.stringify(bericht, null, 1));

  /* ── Bericht ── */
  const kd = kandidaten, L = [];
  L.push(`# Suchlauf ${P.name}`, "");
  L.push(`${new Date().toISOString().slice(0, 16).replace("T", " ")} UTC · ${ach.name} · Massen ${P.m.join(" / ")} · Fenster ${ach.achseA} ${a0}…${a1}, ${ach.achseB} ${b0}…${b1} · Raster ${N}×${N} · Perioden ${P.tmin ? P.tmin + " bis " : "bis "}${P.tmax} · Suche über ${HALB ? "Umkehrpunkte (halbe Periode)" : "den Wiederkehrabstand (ganze Periode)"}`, "");
  L.push("## Was der Lauf getan hat", "");
  L.push("| Stufe | Zahl |", "|---|---|");
  L.push(`| Rasterpunkte gerechnet | ${N * N} in ${zeiten.karte.toFixed(0)} s auf ${faeden} Fäden |`);
  L.push(`| davon durchgelaufen / Zerfall / abgebrochen / ungebunden | ${arten[0]} / ${arten[1]} / ${arten[2]} / ${arten[4]} |`);
  L.push(`| Talsohlen (unter ${P.schwelle}) in ${HALB ? kd.ziele + " Zielen × " + P.baender + " Zeitbändern" : P.baender + " Zeitbändern"} | ${kd.talsohlen} |`);
  L.push(`| davon durch die Prüfkette | ${kd.geprueft} in ${zeiten.pruefkette.toFixed(0)} s |`);
  if (HALB) {
    L.push(`| Umkehrpunkt verfehlt | ${kd.verbleib.umkehrpunktVerfehlt} |`);
    L.push(`| Umkehrpunkt getroffen, aber nach 12τ nicht zurück (nur bis auf eine Drehung periodisch) | ${kd.verbleib.nurBisAufDrehung} |`);
  }
  L.push(`| geschlossene Bahn | ${kd.konvergiert} |`);
  L.push(`| verschiedene Orte in der Ebene | **${funde.length}** |`);
  L.push(`| verschiedene Bahnen (gleiches T* auf acht Stellen einmal gezählt) | **${bahnen.length}** |`);
  L.push(`| — bestätigt (voller Umlauf: Rest < 1e-10 und Gegenprobe < 1e-8) | ${zaehlU("bestätigt")} |`);
  if (HALB) L.push(`| — über den Umkehrpunkt (halber Umlauf auf 1e-11 getroffen, voller für double zu empfindlich) | ${zaehlU("über den Umkehrpunkt")} |`);
  L.push(`| — an der Rechengrenze | ${zaehlU("an der Rechengrenze")} |`);
  L.push(`| sicher linear stabil | ${stab.length} |`);
  L.push(`| Ausnahmen im Schwarm | ${ausnahmen.length} |`, "");
  if (HALB && kd.proZiel) {
    L.push("Je Ziel (Fixmenge, die nach der halben Periode getroffen wird):", "", "| Ziel | Kandidaten | Umkehrpunkt getroffen | geschlossene Bahn |", "|---|---|---|---|");
    for (const zn of Object.keys(kd.proZiel)) L.push(`| ${zn} | ${kd.proZiel[zn].kandidaten} | ${kd.proZiel[zn].getroffen} | ${kd.proZiel[zn].geschlossen} |`);
    L.push("");
  }

  L.push("## Bekannt oder nicht", "");
  L.push(`Von den ${funde.length} Funden stehen **${funde.length - unbekannt.length}** in einer der geprüften Listen, **${unbekannt.length}** in keiner.` +
    (bahnen.length < funde.length ? ` Als verschiedene Bahnen gezählt (eine Bahn kann die Ebene an mehreren Stellen kreuzen): ${bahnen.length}, davon **${unbekannt.filter(f => !f.weitereLage).length}** in keiner Liste.` : ""), "");
  L.push("| Liste | Stufe | Bahnen | Bedeutung |", "|---|---|---|---|");
  L.push(`| Li/Liao 2017–2019, Šuvakov/Dmitrašinović 2013 (${katalog.bahnen.length} Bahnen, mit Klassen) | Ort | ${zaehl("ort")} | steht mit diesen Anfangswerten in der Liste |`);
  L.push(`| | Lage | ${zaehl("lage")} | gleiches T* auf acht Stellen: Listenbahn, an anderer Stelle getroffen |`);
  L.push(`| | Klasse | ${zaehl("klasse")} | Klasse in der Liste, aber anderes T*: weitere Bahn derselben Familie |`);
  L.push(`| | keine | ${zaehl("keine")} | Klasse nicht in der Liste |`);
  if (gross) {
    L.push(`| Hristov u. a. (${gross.n} Anfangswerte, gleiche Massen) | Ort | ${zaehlG("ort")} | steht mit diesen Anfangswerten in der Liste |`);
    L.push(`| | Lage | ${zaehlG("lage")} | gleiches T* auf acht Stellen: Listenbahn, an anderer Stelle getroffen |`);
    L.push(`| | keine | ${zaehlG("keine")} | weder Ort noch T* in der Liste |`);
  } else L.push("| Hristov u. a. | — | — | nur für gleiche Massen; hier nicht anwendbar |");
  L.push("");
  if (gross) {
    // Wie scharf trennt der Vergleich? Abstand der Treffer gegen den der Nichttreffer.
    const tr = funde.filter(f => f.gross.stufe === "ort").map(f => f.gross.abstand).sort((x, y) => x - y);
    const nt = funde.filter(f => f.gross.stufe !== "ort" && f.gross.abstand !== null).map(f => f.gross.abstand).sort((x, y) => x - y);
    const ts = funde.filter(f => f.gross.stufe === "ort").map(f => Math.abs(f.Ts / f.gross.Ts - 1)).sort((x, y) => x - y);
    if (tr.length) L.push(`Trennschärfe: die ${tr.length} Ortstreffer liegen im Median ${z(tr[tr.length >> 1])} und höchstens ${z(tr[tr.length - 1])} vom Listenwert (Schwelle 1e-6), ihr T* weicht höchstens ${z(ts[ts.length - 1])} ab` + (nt.length ? `; die ${nt.length} übrigen haben ihren nächsten Listennachbarn mindestens ${z(nt[0])} entfernt (Median ${z(nt[nt.length >> 1])}).` : "."), "");
  }
  if (!gross) {
    const hier = katalog.bahnen.filter(k => k.m.every((v, i) => Math.abs(v - P.m[i]) < 1e-12));
    L.push(`**Für die Massen ${P.m.join(" / ")} gibt es als Vergleich nur Li und Liao: ${hier.length} Bahnen, je Klasse eine, davon ${hier.filter(k => k.T <= P.tmax).length} mit T bis ${P.tmax}.** Die großen Listen von Hristov u. a. gelten nur für gleiche Massen. „In keiner Liste“ sagt in diesem Lauf deshalb wenig: fast alles, was eine Suche bei diesen Massen findet, steht in keiner Liste, weil es kaum eine gibt.`, "");
  }
  L.push("„In keiner Liste“ heißt genau das und nicht „neu“. Die Listen sind in sich begrenzt: Li und Liao führen je Klasse eine Bahn bis T = 200, gefunden auf einem Raster von 4000²; Hristov u. a. führen die Euler-Ebene bis T* = 211 und den freien Fall bis T* = 80 (mit Punktsymmetrie bis 120).", "");

  if (satelliten.length) {
    const gel = satelliten.filter(f => f.satellit.grundBekannt);
    L.push(`**Satelliten:** ${satelliten.length} der ${unbekannt.length} Funde außerhalb der Listen laufen mehrmals fast den Weg einer anderen Bahn dieses Laufs oder der Liste, bevor sie sich schließen (Wort das k-fache, T* das k-fache); bei ${gel.length} davon ist die Grundbahn gelistet. Das sind eigene Bahnen, aber keine unerklärten — um eine stabile Bahn herum gibt es solche Begleiter regelmäßig. Sie sind in der Tabelle unten in der Spalte „Listen“ benannt.`, "");
  }
  L.push("## Gegenrichtung: was der Lauf von den Listen wiederfindet", "");
  L.push(`| Liste | Bahnen im Fenster mit T ${P.tmin ? "von " + P.tmin + " " : ""}bis ${P.tmax} | gefunden | Anteil |`, "|---|---|---|---|");
  L.push(`| Li/Liao, 2013 | ${soll.length} | ${gefundenSoll.length} | ${soll.length ? (100 * gefundenSoll.length / soll.length).toFixed(0) + " %" : "—"} |`);
  if (grossSoll) {
    L.push(`| Hristov u. a. | ${grossSoll.soll} | ${grossSoll.gefunden} | ${grossSoll.soll ? (100 * grossSoll.gefunden / grossSoll.soll).toFixed(1) + " %" : "—"} |`);
    for (const b of grossSoll.baender) L.push(`| — davon T < ${b.bis > 1e8 ? "∞" : b.bis} | ${b.soll} | ${b.gefunden} | ${(100 * b.gefunden / b.soll).toFixed(1)} % |`);
  }
  L.push("");
  if (verpasst.length) L.push(`Verpasst aus Li/Liao: ${verpasst.slice(0, 60).map(k => k.name + " (T " + k.T.toFixed(1) + ")").join(", ")}${verpasst.length > 60 ? " …" : ""}.`, "");

  if (existsSync(join(ordner, P.name + ".png"))) {
    L.push(`![Karte](${P.name}.png)`, "");
    L.push(`Karte: hell = ${HALB ? "die Bahn kommt bis zur halben Höchstperiode einer Fixmenge nahe" : "kleiner Wiederkehrabstand"}. Weißer Ring = Fund, der in einer Liste steht (nur bei bis zu 3000 Funden gezeichnet). Grüner Punkt = Fund, der in keiner Liste steht. Rotes Kreuz = Bahn aus Li/Liao, die der Lauf verpasst hat.`, "");
  }

  const satText = f => (f.satellit ? `Satellit ${f.satellit.ordnung}. Ordnung von ${f.satellit.von} (T* das ${f.satellit.verhaeltnis.toFixed(5)}-fache${f.satellit.buchstaben ? ", Wort bis auf " + f.satellit.buchstaben + " Buchstaben" : ""})` : "");
  const stufe = f => f.katalog.stufe === "ort" || f.katalog.stufe === "lage" ? f.katalog.stufe + ": " + (f.katalog.rufname || f.katalog.name)
    : f.gross && f.gross.stufe !== "keine" ? "Hristov: " + f.gross.stufe
    : [f.katalog.stufe === "klasse" ? "nur Klasse von " + (f.katalog.rufname || f.katalog.name) : "", satText(f)].filter(Boolean).join(" · ") || "—";
  const zeile = f => `| ${f.a.toFixed(12)} | ${f.b.toFixed(12)} | ${f.T.toFixed(8)} | ${f.Ts.toFixed(4)} | ${z(f.rest)} | ${f.halb ? f.halb.ziel + " " + z(f.halb.rest) : "—"} | ${f.urteil} | ${f.stabil === true ? "stabil" : f.stabil === false ? "instabil" : "offen"} | ${z(f.lambda, 3)} | ${z(f.rMin)} | ${f.wort.length} | ${stufe(f)} |`;
  const kopfZ = [`| ${ach.achseA} | ${ach.achseB} | T | T* | Rest (voller Umlauf) | Umkehrpunkt | Urteil | Stabilität | \\|λ\\| | engste Begegnung | Wortlänge | Listen |`, "|---|---|---|---|---|---|---|---|---|---|---|---|"];
  L.push(`## Funde in keiner Liste (${unbekannt.length})`, "", ...kopfZ, ...unbekannt.slice(0, 2000).map(zeile), unbekannt.length > 2000 ? `\n… ${unbekannt.length - 2000} weitere in der JSON-Datei.` : "", "");
  L.push(`## Sicher linear stabile Funde (${stab.length})`, "", ...kopfZ, ...stab.map(zeile), "");
  if (funde.length <= 1500) L.push(`## Alle Funde (${funde.length})`, "", ...kopfZ, ...funde.map(zeile), "");
  else L.push(`## Alle Funde`, "", `${funde.length} Bahnen — die Tabelle stünde hier über tausende Zeilen. Sie stehen vollständig in \`${P.name}.json\`.`, "");
  writeFileSync(join(ordner, P.name + ".md"), L.join("\n"));

  console.log(`${P.name} (${P.art}): ${N * N} Rasterpunkte (${zeiten.karte.toFixed(0)} s), ${kd.talsohlen} Talsohlen, ${kd.geprueft} geprüft (${zeiten.pruefkette.toFixed(0)} s), ${kd.konvergiert} geschlossen` + (HALB ? `, ${kd.verbleib.nurBisAufDrehung} nur bis auf Drehung, ${kd.verbleib.umkehrpunktVerfehlt} verfehlt` : ""));
  console.log(`  verschiedene Orte: ${funde.length} (verschiedene Bahnen nach T*: ${bahnen.length}) — bestätigt ${zaehlU("bestätigt")}, über den Umkehrpunkt ${zaehlU("über den Umkehrpunkt")}, Rechengrenze ${zaehlU("an der Rechengrenze")}, sicher stabil ${stab.length}`);
  console.log(`  Li/Liao + 2013: Ort ${zaehl("ort")}, Lage ${zaehl("lage")}, Klasse ${zaehl("klasse")}, keine ${zaehl("keine")}`);
  if (gross) console.log(`  Hristov u. a.:  Ort ${zaehlG("ort")}, Lage ${zaehlG("lage")}, keine ${zaehlG("keine")}`);
  console.log(`  in keiner Liste: ${unbekannt.length} Orte, ${unbekannt.filter(f => !f.weitereLage).length} verschiedene Bahnen; davon Satelliten ${satelliten.length} (Grundbahn gelistet: ${satelliten.filter(f => f.satellit.grundBekannt).length})`);
  if (!HALB && kd.dekaden) console.log("  ertasteter Abstand → Kandidaten/konvergiert/Sekunden: " + Object.keys(kd.dekaden).sort((x, y) => x - y).map(k => `1e${k}: ${kd.dekaden[k][0]}/${kd.dekaden[k][1]}/${kd.dekaden[k][2].toFixed(0)}`).join("  "));
  console.log(`  Wiederfinden: ${gefundenSoll.length} von ${soll.length} aus Li/Liao` + (grossSoll ? `, ${grossSoll.gefunden} von ${grossSoll.soll} aus Hristov u. a.` : "") + ` (Fenster, T ≤ ${P.tmax})`);
  if (ausnahmen.length) console.log(`  AUSNAHMEN: ${ausnahmen.length} — ${ausnahmen[0].fehler.slice(0, 300)}`);
  return { funde: funde.length, unbekannt: unbekannt.length, ausnahmen: ausnahmen.length };
}
