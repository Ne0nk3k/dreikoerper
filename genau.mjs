// dreikoerper/genau.mjs — Nachprüfung in erhöhter Genauigkeit.
//
// Doppelte Genauigkeit trägt eine Bahn nur so weit, wie 1e-16 mal ihre
// Empfindlichkeit reicht; bei engen Begegnungen ist bei 1e-7 Schluss
// (gemessen im Katalogabgleich). Ob ein Fund dort eine Bahn ist oder ein
// Rundungsgebilde, entscheidet erst eine Rechnung, deren Rundung weit
// darunter liegt.
//
// Hier: dieselbe Taylorreihe wie im Kern, aber in Festkomma auf BigInt.
// Eine Zahl x ist die ganze Zahl round(x·2^P). Summen von Produkten werden
// in doppelter Breite aufsummiert und einmal geschoben.
//
// Die Verfeinerung ist ein Newton-Verfahren mit gemischter Genauigkeit:
// der Rest kommt von hier, die Ableitung aus dem Kern in double. Das
// konvergiert linear mit dem relativen Fehler der Ableitung; reicht der
// nicht, wird die Ableitung hier per Differenzenquotient gebildet.

import { ladeKern } from "./quellen.mjs";

const K = ladeKern();

export function macheGenau(bits, ordnung) {
  if (bits > 960) throw new Error("mehr als 960 Bit: die Umrechnung nach double läuft über");
  const P = BigInt(bits), EINS = 1n << P, N = ordnung;
  const feld = () => [0, 1, 2].map(() => new Array(N + 2).fill(0n));
  const X = feld(), Y = feld(), U = feld(), V = feld(), S = feld(), Q = feld(), FX = feld(), FY = feld();
  const ZWEIHOCH = Math.pow(2, bits);

  // ── Zahlen hinein und heraus ──
  function ausZahl(x) {                         // double → Festkomma, exakt
    if (x === 0) return 0n;
    if (!Number.isFinite(x)) throw new Error("keine Zahl: " + x);
    const e = Math.floor(Math.log2(Math.abs(x))) - 52;
    const mant = BigInt(Math.round(x / Math.pow(2, e)));
    const s = bits + e;
    return s >= 0 ? mant << BigInt(s) : mant >> BigInt(-s);
  }
  function ausDezimal(text) {                   // "0.8" → Festkomma, auf 2^-P gerundet
    const neg = text.trim().startsWith("-"), t = text.trim().replace(/^[-+]/, "");
    const [g, n = ""] = t.split(".");
    const zaehler = BigInt(g + n), nenner = 10n ** BigInt(n.length);
    const w = (zaehler << P) / nenner;
    return neg ? -w : w;
  }
  const zuZahl = v => Number(v) / ZWEIHOCH;
  function zuDezimal(v, stellen) {
    const neg = v < 0n; if (neg) v = -v;
    const s = ((v * 10n ** BigInt(stellen)) >> P).toString().padStart(stellen + 1, "0");
    return (neg ? "-" : "") + s.slice(0, -stellen) + "." + s.slice(-stellen);
  }
  const mal = (a, b) => (a * b) >> P;
  const laenge = v => (v < 0n ? -v : v).toString(2).length;       // Bitlänge
  function wurzel(v) {                          // √v in Festkomma
    const n = v << P;
    if (n < 2n) return n;
    let x = 1n << BigInt((laenge(n) + 1) >> 1);
    for (;;) { const y = (x + n / x) >> 1n; if (y >= x) return x; x = y; }
  }

  // ── Anfangswerte der beiden Ebenen ──
  function anfang(ebene, a, b, m) {
    const u = new Array(12).fill(0n);
    if (ebene === "euler") {
      const k = -(((m[0] + m[1]) << P) / m[2]) - EINS;
      u[0] = 2n * EINS; u[2] = EINS; u[4] = -EINS;
      u[8] = mal(k, a); u[9] = mal(k, b); u[10] = u[8]; u[11] = u[9];
    } else if (ebene === "fall") {
      const halb = EINS >> 1n;
      u[0] = EINS; u[2] = a + halb; u[3] = b; u[4] = a - halb; u[5] = b;
    } else throw new Error("Ebene? " + ebene);
    return u;
  }

  // ── Taylorreihe. u wird überschrieben. epsLog2: Zielgenauigkeit je Schritt als log2 ──
  function lauf(u, m, T, epsLog2, maxSchritte) {
    const m1 = m[0], m2 = m[1], m3 = m[2], m12 = m1 + m2, m13 = m1 + m3, m23 = m2 + m3;
    const fakLog2 = epsLog2 / N + Math.log2(0.9);
    let t = 0n, schritte = 0;
    const grenze = maxSchritte || 200000;
    while (t < T) {
      for (let p = 0; p < 3; p++) { X[p][0] = u[2 * p]; Y[p][0] = u[2 * p + 1]; U[p][0] = u[6 + 2 * p]; V[p][0] = u[7 + 2 * p]; }
      for (let k = 0; k < N; k++) {
        for (let p = 0; p < 3; p++) {
          const x = X[p], y = Y[p], s = S[p], q = Q[p];
          let a = 0n;
          for (let j = 0; j <= k; j++) a += x[j] * x[k - j] + y[j] * y[k - j];
          s[k] = a >> P;
          if (k === 0) {
            if (s[0] <= 0n) return { art: 2, schritte };
            q[0] = (EINS << P) / mal(s[0], wurzel(s[0]));
          } else {
            // q = s^(−3/2): k·s₀·q_k = −Σ (j + 2k)/2 · s_j · q_(k−j)
            let b = 0n;
            for (let j = 1; j <= k; j++) b += BigInt(j + 2 * k) * s[j] * q[k - j];
            q[k] = -(b / (BigInt(2 * k) * s[0]));
          }
          let gx = 0n, gy = 0n;
          for (let j = 0; j <= k; j++) { gx += x[j] * q[k - j]; gy += y[j] * q[k - j]; }
          FX[p][k] = gx >> P; FY[p][k] = gy >> P;
        }
        const ax = FX[0][k], ay = FY[0][k], bx = FX[1][k], by = FY[1][k], cx = FX[2][k], cy = FY[2][k], d = BigInt(k + 1);
        for (let p = 0; p < 3; p++) { X[p][k + 1] = U[p][k] / d; Y[p][k + 1] = V[p][k] / d; }
        U[0][k + 1] = ((-m12 * ax + m3 * (cx - bx)) >> P) / d; V[0][k + 1] = ((-m12 * ay + m3 * (cy - by)) >> P) / d;
        U[1][k + 1] = ((-m13 * bx - m2 * (cx + ax)) >> P) / d; V[1][k + 1] = ((-m13 * by - m2 * (cy + ay)) >> P) / d;
        U[2][k + 1] = ((-m23 * cx + m1 * (ax - bx)) >> P) / d; V[2][k + 1] = ((-m23 * cy + m1 * (ay - by)) >> P) / d;
      }
      // Konvergenzradius aus den Bitlängen der letzten Koeffizienten
      let rhoLog2 = Infinity;
      for (let p = 0; p < 3; p++) {
        const sk = Math.max(laenge(X[p][0]), laenge(Y[p][0]));
        for (const k of [N - 1, N]) {
          const c = Math.max(laenge(X[p][k]), laenge(Y[p][k]));
          if (c > 1) { const r = (sk - c) / k; if (r < rhoLog2) rhoLog2 = r; }
        }
      }
      let h = rhoLog2 === Infinity ? T - t : ausZahl(Math.pow(2, rhoLog2 + fakLog2)), letzter = false;
      if (h <= 0n) return { art: 2, schritte };
      if (T - t <= h) { h = T - t; letzter = true; }
      for (let p = 0; p < 3; p++) {
        let x = X[p][N], y = Y[p][N], uu = U[p][N], vv = V[p][N];
        for (let k = N - 1; k >= 0; k--) { x = mal(x, h) + X[p][k]; y = mal(y, h) + Y[p][k]; uu = mal(uu, h) + U[p][k]; vv = mal(vv, h) + V[p][k]; }
        u[2 * p] = x; u[2 * p + 1] = y; u[6 + 2 * p] = uu; u[7 + 2 * p] = vv;
      }
      schritte++;
      if (letzter) break;
      t += h;
      if (schritte >= grenze) return { art: 2, schritte };
    }
    return { art: 0, schritte };
  }

  // ── Dieselbe Reihe mit nT Tangenten (Variationsgleichungen). tang[c] ist
  //    ein Feld von zwölf Festkommazahlen und wird wie u überschrieben. ──
  function laufVar(u, tang, m, T, epsLog2, maxSchritte) {
    const nT = tang.length, m1 = m[0], m2 = m[1], m3 = m[2], m12 = m1 + m2, m13 = m1 + m3, m23 = m2 + m3;
    const W = feld(), dX = [], dY = [], dU = [], dV = [], dS = [], dQ = [];
    for (let c = 0; c < nT; c++) { dX.push(feld()); dY.push(feld()); dU.push(feld()); dV.push(feld()); dS.push(feld()); dQ.push(feld()); }
    const fx = [0n, 0n, 0n], fy = [0n, 0n, 0n];
    const fakLog2 = epsLog2 / N + Math.log2(0.9);
    let t = 0n, schritte = 0;
    const grenze = maxSchritte || 200000;
    while (t < T) {
      for (let p = 0; p < 3; p++) {
        X[p][0] = u[2 * p]; Y[p][0] = u[2 * p + 1]; U[p][0] = u[6 + 2 * p]; V[p][0] = u[7 + 2 * p];
        for (let c = 0; c < nT; c++) { dX[c][p][0] = tang[c][2 * p]; dY[c][p][0] = tang[c][2 * p + 1]; dU[c][p][0] = tang[c][6 + 2 * p]; dV[c][p][0] = tang[c][7 + 2 * p]; }
      }
      for (let k = 0; k < N; k++) {
        const d = BigInt(k + 1);
        for (let p = 0; p < 3; p++) {
          const x = X[p], y = Y[p], s = S[p], q = Q[p], w = W[p];
          let a = 0n;
          for (let j = 0; j <= k; j++) a += x[j] * x[k - j] + y[j] * y[k - j];
          s[k] = a >> P;
          if (k === 0) {
            if (s[0] <= 0n) return { art: 2, schritte };
            q[0] = (EINS << P) / mal(s[0], wurzel(s[0])); w[0] = (q[0] << P) / s[0];
          } else {
            // q = s^(−3/2), w = s^(−5/2)
            let b = 0n, e = 0n;
            for (let j = 1; j <= k; j++) { b += BigInt(j + 2 * k) * s[j] * q[k - j]; e += BigInt(3 * j + 2 * k) * s[j] * w[k - j]; }
            const nen = BigInt(2 * k) * s[0];
            q[k] = -(b / nen); w[k] = -(e / nen);
          }
          let gx = 0n, gy = 0n;
          for (let j = 0; j <= k; j++) { gx += x[j] * q[k - j]; gy += y[j] * q[k - j]; }
          fx[p] = gx >> P; fy[p] = gy >> P;
        }
        for (let p = 0; p < 3; p++) { X[p][k + 1] = U[p][k] / d; Y[p][k + 1] = V[p][k] / d; }
        U[0][k + 1] = ((-m12 * fx[0] + m3 * (fx[2] - fx[1])) >> P) / d; V[0][k + 1] = ((-m12 * fy[0] + m3 * (fy[2] - fy[1])) >> P) / d;
        U[1][k + 1] = ((-m13 * fx[1] - m2 * (fx[2] + fx[0])) >> P) / d; V[1][k + 1] = ((-m13 * fy[1] - m2 * (fy[2] + fy[0])) >> P) / d;
        U[2][k + 1] = ((-m23 * fx[2] + m1 * (fx[0] - fx[1])) >> P) / d; V[2][k + 1] = ((-m23 * fy[2] + m1 * (fy[0] - fy[1])) >> P) / d;
        for (let c = 0; c < nT; c++) {
          for (let p = 0; p < 3; p++) {
            const x = X[p], y = Y[p], q = Q[p], w = W[p], ex = dX[c][p], ey = dY[c][p], es = dS[c][p], eq = dQ[c][p];
            let a = 0n;
            for (let j = 0; j <= k; j++) a += x[j] * ex[k - j] + y[j] * ey[k - j];
            es[k] = a >> (P - 1n);                           // 2·Σ
            let b = 0n;
            for (let j = 0; j <= k; j++) b += w[j] * es[k - j];
            eq[k] = -((3n * b) >> (P + 1n));                 // −1.5·Σ
            let gx = 0n, gy = 0n;
            for (let j = 0; j <= k; j++) { gx += ex[j] * q[k - j] + x[j] * eq[k - j]; gy += ey[j] * q[k - j] + y[j] * eq[k - j]; }
            fx[p] = gx >> P; fy[p] = gy >> P;
          }
          const ex = dX[c], ey = dY[c], eu = dU[c], ev = dV[c];
          for (let p = 0; p < 3; p++) { ex[p][k + 1] = eu[p][k] / d; ey[p][k + 1] = ev[p][k] / d; }
          eu[0][k + 1] = ((-m12 * fx[0] + m3 * (fx[2] - fx[1])) >> P) / d; ev[0][k + 1] = ((-m12 * fy[0] + m3 * (fy[2] - fy[1])) >> P) / d;
          eu[1][k + 1] = ((-m13 * fx[1] - m2 * (fx[2] + fx[0])) >> P) / d; ev[1][k + 1] = ((-m13 * fy[1] - m2 * (fy[2] + fy[0])) >> P) / d;
          eu[2][k + 1] = ((-m23 * fx[2] + m1 * (fx[0] - fx[1])) >> P) / d; ev[2][k + 1] = ((-m23 * fy[2] + m1 * (fy[0] - fy[1])) >> P) / d;
        }
      }
      let rhoLog2 = Infinity;
      for (let p = 0; p < 3; p++) {
        const sk = Math.max(laenge(X[p][0]), laenge(Y[p][0]));
        for (const k of [N - 1, N]) {
          const c = Math.max(laenge(X[p][k]), laenge(Y[p][k]));
          if (c > 1) { const r = (sk - c) / k; if (r < rhoLog2) rhoLog2 = r; }
        }
      }
      let h = rhoLog2 === Infinity ? T - t : ausZahl(Math.pow(2, rhoLog2 + fakLog2)), letzter = false;
      if (h <= 0n) return { art: 2, schritte };
      if (T - t <= h) { h = T - t; letzter = true; }
      const horner = (r) => { let v = r[N]; for (let k = N - 1; k >= 0; k--) v = mal(v, h) + r[k]; return v; };
      for (let p = 0; p < 3; p++) {
        u[2 * p] = horner(X[p]); u[2 * p + 1] = horner(Y[p]); u[6 + 2 * p] = horner(U[p]); u[7 + 2 * p] = horner(V[p]);
        for (let c = 0; c < nT; c++) { tang[c][2 * p] = horner(dX[c][p]); tang[c][2 * p + 1] = horner(dY[c][p]); tang[c][6 + 2 * p] = horner(dU[c][p]); tang[c][7 + 2 * p] = horner(dV[c][p]); }
      }
      schritte++;
      if (letzter) break;
      t += h;
      if (schritte >= grenze) return { art: 2, schritte };
    }
    return { art: 0, schritte };
  }

  // Energie im Schwerpunktsystem (wie im Kern), Festkomma
  function energie(u, m) {
    const M = m[0] + m[1] + m[2], mm = [mal(m[0], m[1]), mal(m[0], m[2]), mal(m[1], m[2])];
    let k = 0n, p = 0n;
    for (let i = 0; i < 3; i++) {
      k += mal(mm[i], mal(u[6 + 2 * i], u[6 + 2 * i]) + mal(u[7 + 2 * i], u[7 + 2 * i]));
      p -= (mm[i] << P) / wurzel(mal(u[2 * i], u[2 * i]) + mal(u[2 * i + 1], u[2 * i + 1]));
    }
    return (k << P) / (2n * M) + p;
  }

  return { bits, ordnung: N, EINS, P, ausZahl, ausDezimal, zuZahl, zuDezimal, mal, wurzel, anfang, lauf, laufVar, energie };
}

/**
 * Lineare Stabilität in erhöhter Genauigkeit: dieselbe Spurformel wie im Kern
 * (s₁ + s₂ = Spur M − 8, s₁² + s₂² = Spur M² − 4), aber die Monodromie aus
 * der Festkommareihe mit zwölf Tangenten. In double bleibt das Urteil offen,
 * sobald der Abstand zur Grenze |s| = 2 unter dem Fehler der Monodromie
 * liegt — und bei den stabilen Bahnen der Literatur liegt er im Median bei
 * 1e-6 (gemessen, werkzeug/stabil-fehler.mjs).
 *
 * a, b, T: Dezimaltext (aus verfeinereGenau) oder double.
 * Gibt s1, s2 (double), den Abstand zur Grenze, das Urteil und — wenn
 * opt.gegenprobe — dieselben Werte aus einer zweiten Rechnung mit mehr Bits.
 */
export function stabilitaetGenau(ebene, m, a, b, T, opt) {
  opt = opt || {};
  const rechne = (bits, ordnung, epsLog2) => {
    const G = macheGenau(bits, ordnung), E = G.EINS, P = G.P;
    const fest = x => (typeof x === "string" ? G.ausDezimal(x) : G.ausZahl(x));
    // Der Anfang: aus der Ebene (a, b) — oder, mit opt.zustand, ein beliebiger
    // Zustand in Festkomma (stabilitaetGenauAusZustand, für Bahnen, die in
    // keiner der beiden Ebenen starten, etwa die Lagrange-Kreisbahn).
    const z = opt.zustand ? opt.zustand(G) : null;
    const mF = z ? z.m : mText(m).map(G.ausDezimal);
    const u = z ? z.u.slice() : G.anfang(ebene, fest(a), fest(b), mF);
    const tang = Array.from({ length: 12 }, (_, c) => { const v = new Array(12).fill(0n); v[c] = E; return v; });
    const e = G.laufVar(u, tang, mF, z ? z.T : fest(T), epsLog2);
    if (e.art !== 0) return null;
    let sp = 0n, sp2 = 0n;
    for (let c = 0; c < 12; c++) { sp += tang[c][c]; for (let k = 0; k < 12; k++) sp2 += tang[c][k] * tang[k][c]; }
    sp2 >>= P;
    const p = sp - 8n * E, q2 = sp2 - 4n * E, D = 2n * q2 - ((p * p) >> P);
    const aus = { schritte: e.schritte, D: G.zuZahl(D) };
    if (D >= 0n) {
      const w = G.wurzel(D), s1 = (p + w) / 2n, s2 = (p - w) / 2n;
      aus.s1 = G.zuZahl(s1); aus.s2 = G.zuZahl(s2); aus.komplex = false;
      const betrag = v => (v < 0n ? -v : v), gr = betrag(s1) > betrag(s2) ? betrag(s1) : betrag(s2);
      aus.rand = G.zuZahl(2n * E - gr);                       // Abstand zur Grenze, kann 1e-30 sein
      aus.s1Text = G.zuDezimal(s1, 30); aus.s2Text = G.zuDezimal(s2, 30);
    } else {
      aus.s1 = aus.s2 = G.zuZahl(p / 2n); aus.sIm = G.zuZahl(G.wurzel(-D) / 2n); aus.komplex = true; aus.rand = -aus.sIm;
    }
    return aus;
  };
  const stellen = opt.stellen || 30, eps = -(stellen + 8) * Math.log2(10);
  // opt.schnell: erst zwei bescheidene Rechnungen (20 und 30 Stellen
  // Schrittschärfe). Sind sie sich einig UND liegt der Index weit jenseits
  // der Grenze, lautet das Urteil „instabil" und die teure Rechnung entfällt.
  // „Stabil" spricht diese Stufe nie aus, und alles Unklare geht weiter an die
  // volle Rechnung darunter. Anlass: an den 72 offenen Funden des Euler-Laufs
  // brauchte die volle Rechnung im Median 836 s je Bahn, der Unterschied ihrer
  // zwei Durchgänge war 72-mal null, und jede hatte |s| über 4000.
  if (opt.schnell) {
    const grob = rechne(192, 26, -20 * Math.log2(10)), fein = grob && rechne(256, 34, -30 * Math.log2(10));
    if (grob && fein && grob.komplex === fein.komplex) {
      const unterschied = Math.max(Math.abs(fein.s1 - grob.s1), Math.abs(fein.s2 - grob.s2), Math.abs((fein.sIm || 0) - (grob.sIm || 0)), Math.abs(fein.rand - grob.rand));
      const unsicher = Math.max(1e-6, 1000 * unterschied);
      const klarInstabil = fein.komplex ? fein.sIm > unsicher : fein.rand < -unsicher;
      if (klarInstabil) return { ok: true, ...fein, unterschied, unsicher, urteil: "instabil", stufe: "schnell" };
    }
  }
  const erste = rechne(opt.bits || 320, opt.ordnung || 40, eps);
  if (!erste) return { ok: false, grund: "abbruch" };
  const aus = { ok: true, ...erste };
  // Schwelle für „an der Grenze": was die Rechnung selbst nicht mehr trennt
  let unsicher = Math.pow(10, -stellen / 2);
  if (opt.gegenprobe !== false) {
    const zweite = rechne((opt.bits || 320) + 128, (opt.ordnung || 40) + 12, eps - 60);
    if (zweite) {
      aus.unterschied = Math.max(Math.abs(zweite.s1 - erste.s1), Math.abs(zweite.s2 - erste.s2), Math.abs((zweite.sIm || 0) - (erste.sIm || 0)), Math.abs(zweite.rand - erste.rand));
      unsicher = Math.max(unsicher, 1000 * aus.unterschied);
    }
  }
  aus.unsicher = unsicher; aus.stufe = "voll";
  aus.urteil = aus.komplex ? (aus.sIm > unsicher ? "instabil" : "an der Grenze")
    : aus.rand > unsicher ? "stabil" : aus.rand < -unsicher ? "instabil" : "an der Grenze";
  return aus;
}

/**
 * Dieselbe Rechnung für einen beliebigen Anfangszustand. baue(G) bekommt die
 * Festkommarechnung der jeweiligen Genauigkeit und gibt { u, m, T } zurück:
 * zwölf Relativkoordinaten, drei Massen und die Periode, alles in Festkomma.
 * Gebraucht von pruef-genau.mjs für die Lagrange-Kreisbahn (Rouths Formel).
 */
export function stabilitaetGenauAusZustand(baue, opt) {
  return stabilitaetGenau(null, null, null, null, null, { ...(opt || {}), zustand: baue });
}

// Wiederkehrabstand aus einem Festkomma-Rest, gemessen wie im Kern
function restNorm(G, r, mD) {
  const d = new Float64Array(12);
  for (let i = 0; i < 12; i++) d[i] = G.zuZahl(r[i]);
  return K.abstand(d, new Float64Array(12), mD);
}

// Massen als Dezimaltext, damit 0.8 wirklich 0.8 ist
const mText = m => m.map(x => (typeof x === "string" ? x : String(x)));

/**
 * Verfeinert (a, b, T) in erhöhter Genauigkeit.
 * opt: bits (320), ordnung (40), stellen (30 Dezimalstellen Ziel), maxIter (25)
 * Gibt zurück: ok, a/b/T als Dezimaltext, rest, verlauf, korrektur (Abstand zum
 * double-Wert), restAndereGenauigkeit (Gegenprobe mit mehr Bits und Ordnung).
 */
export function verfeinereGenau(ebene, m, a, b, T, opt) {
  opt = opt || {};
  const stellen = opt.stellen || 30, maxIter = opt.maxIter ?? 25;
  // opt.empfindlich = log10 |λ| (aus dem Kern). Ein Schrittfehler wächst bis
  // zum Ende des Umlaufs um etwa |λ|; ohne diese Zugabe konvergierte Newton
  // bei |λ| um 1e9 auf seinen EIGENEN Rest unter 1e-30, während der wahre
  // (448 Bit) bei 1e-28 lag — 22 von 184 Funden standen deshalb als „offen".
  const zugabe = Math.min(24, Math.max(0, opt.empfindlich || 0));
  const bits = opt.bits || 320, ordnung = (opt.ordnung || 40) + Math.round(zugabe);
  const G = macheGenau(bits, ordnung);
  // Schrittfehler acht Stellen unter dem Ziel: über einige tausend Schritte
  // sammelt er sich (gemessen an F-11: mit vier Stellen Luft blieb der Rest
  // bei 2.9e-30 hängen).
  const epsLog2 = -(stellen + 8 + zugabe) * Math.log2(10);
  const mT = mText(m), mF = mT.map(G.ausDezimal), mD = mT.map(Number);
  let A = G.ausZahl(a), B = G.ausZahl(b), TT = G.ausZahl(T);
  const ziel = Math.pow(10, -stellen);

  const rest = (A_, B_, T_, Gx, eps) => {
    Gx = Gx || G;
    const u0 = Gx.anfang(ebene, A_, B_, Gx === G ? mF : mT.map(Gx.ausDezimal)), u = u0.slice();
    const e = Gx.lauf(u, Gx === G ? mF : mT.map(Gx.ausDezimal), T_, eps || epsLog2);
    if (e.art !== 0) return null;
    return { r: u.map((v, i) => v - u0[i]), uT: u, schritte: e.schritte };
  };

  // Ableitung in double aus dem Kern: zwei Tangenten der Ebene
  const lauf2 = K.macheTaylorVar(2);
  function jacobiDouble() {
    const aD = G.zuZahl(A), bD = G.zuZahl(B), tD = G.zuZahl(TT), E = K.EBENEN[ebene];
    const u0 = E.anfang(aD, bD, mD, new Float64Array(12)), up = new Float64Array(12), um = new Float64Array(12), h = 1e-3;
    const tang = new Float64Array(24), da = new Float64Array(12), db = new Float64Array(12);
    E.anfang(aD + h, bD, mD, up); E.anfang(aD - h, bD, mD, um); for (let k = 0; k < 12; k++) da[k] = (up[k] - um[k]) / (2 * h);
    E.anfang(aD, bD + h, mD, up); E.anfang(aD, bD - h, mD, um); for (let k = 0; k < 12; k++) db[k] = (up[k] - um[k]) / (2 * h);
    tang.set(da, 0); tang.set(db, 12);
    const uT = Float64Array.from(u0);
    if (lauf2(uT, tang, mD, tD, 1e-16).art !== 0) return null;
    const f = new Float64Array(12); K.kraft(uT, mD, f);
    const J = new Float64Array(36);
    for (let k = 0; k < 12; k++) { J[k * 3] = tang[k] - da[k]; J[k * 3 + 1] = tang[12 + k] - db[k]; J[k * 3 + 2] = f[k]; }
    return J;
  }
  // Ableitung hier, per Differenzenquotient in erhöhter Genauigkeit
  function jacobiGenau(basis) {
    const hBits = BigInt(Math.floor(bits / 3)), h = G.EINS >> hBits, skal = Math.pow(2, Number(hBits));
    const ra = rest(A + h, B, TT), rb = rest(A, B + h, TT);
    if (!ra || !rb) return null;
    const uD = new Float64Array(12), f = new Float64Array(12);
    for (let i = 0; i < 12; i++) uD[i] = G.zuZahl(basis.uT[i]);
    K.kraft(uD, mD, f);
    const J = new Float64Array(36);
    for (let k = 0; k < 12; k++) {
      J[k * 3] = G.zuZahl(ra.r[k] - basis.r[k]) * skal; J[k * 3 + 1] = G.zuZahl(rb.r[k] - basis.r[k]) * skal; J[k * 3 + 2] = f[k];
    }
    return J;
  }
  function schritt(J, r) {
    const sk = [0, 0, 0], A_ = new Float64Array(36), b_ = new Float64Array(12);
    // Rest auf Größe 1 bringen, damit double ihn trägt
    let gr = 0; const rd = r.map(v => { const x = G.zuZahl(v); gr = Math.max(gr, Math.abs(x)); return x; });
    if (gr === 0) return [0, 0, 0];
    for (let j = 0; j < 3; j++) { let s = 0; for (let k = 0; k < 12; k++) s += J[k * 3 + j] ** 2; sk[j] = Math.sqrt(s) || 1; }
    for (let k = 0; k < 12; k++) { for (let j = 0; j < 3; j++) A_[k * 3 + j] = J[k * 3 + j] / sk[j]; b_[k] = -rd[k] / gr; }
    const x = K.kleinsteQuadrate3(A_, b_, 12);
    return x.map((v, j) => v / sk[j] * gr);
  }

  const a0 = A, b0 = B, T0 = TT;
  let jetzt = rest(A, B, TT);
  if (!jetzt) return { ok: false, grund: "abbruch beim ersten Lauf" };
  let wert = restNorm(G, jetzt.r, mD);
  const verlauf = [wert];
  let J = jacobiDouble(), eigeneAbleitung = false, iter = 0, grund = "iterationen", rueckschritte = 0;
  while (iter < maxIter) {
    if (wert < ziel) { grund = "ziel"; break; }
    iter++;
    if (!J) { J = jacobiGenau(jetzt); eigeneAbleitung = true; if (!J) { grund = "abbruch"; break; } }
    const dx = schritt(J, jetzt.r);
    const nA = A + G.ausZahl(dx[0]), nB = B + G.ausZahl(dx[1]), nT = TT + G.ausZahl(dx[2]);
    const neu = rest(nA, nB, nT);
    const nw = neu ? restNorm(G, neu.r, mD) : Infinity;
    if (nw < wert) {
      const gewinn = nw / wert;
      A = nA; B = nB; TT = nT; jetzt = neu; wert = nw; verlauf.push(wert);
      // Schlechte Kontraktion: die Ableitung taugt nicht mehr
      if (gewinn > 0.1) { J = eigeneAbleitung ? jacobiGenau(jetzt) : null; }
    } else if (!eigeneAbleitung) { J = null; }              // einmal mit eigener Ableitung versuchen
    else if (J && !J.frisch) { J = jacobiGenau(jetzt); if (J) J.frisch = true; else { grund = "abbruch"; break; } }
    else {
      // Auch die frische eigene Ableitung bringt keinen Gewinn: der volle
      // Schritt liegt außerhalb des linearen Bereichs (|λ|·Schritt ist nicht
      // klein). Dieselbe Richtung, kürzer — erst wenn auch das nichts bringt,
      // steht die Rechnung wirklich still.
      let gefunden = false, d = dx;
      for (let kurz = 0; kurz < 6 && !gefunden; kurz++) {
        d = d.map(v => v / 4);
        const pA = A + G.ausZahl(d[0]), pB = B + G.ausZahl(d[1]), pT = TT + G.ausZahl(d[2]);
        const p = rest(pA, pB, pT), pw = p ? restNorm(G, p.r, mD) : Infinity;
        if (pw < wert) { A = pA; B = pB; TT = pT; jetzt = p; wert = pw; verlauf.push(wert); rueckschritte++; gefunden = true; }
      }
      if (!gefunden) { grund = "stillstand"; break; }
      J = jacobiGenau(jetzt); if (!J) { grund = "abbruch"; break; }
    }
  }

  const aus = { ok: wert < ziel, grund, iter, rest: wert, verlauf, eigeneAbleitung, rueckschritte, bits, ordnung, schritte: jetzt.schritte,
    a: G.zuDezimal(A, stellen + 2), b: G.zuDezimal(B, stellen + 2), T: G.zuDezimal(TT, stellen + 2),
    korrektur: [G.zuZahl(A - a0), G.zuZahl(B - b0), G.zuZahl(TT - T0)] };

  // Gegenprobe: derselbe Punkt mit mehr Bits, höherer Ordnung, schärferem Schritt.
  // Stimmen beide Reste überein, hängt das Ergebnis nicht an der Rundung.
  if (aus.ok && !opt.ohneGegenprobe) {
    const G2 = macheGenau(bits + 128, ordnung + 12), sch = 128n;
    const u0 = G2.anfang(ebene, A << sch, B << sch, mT.map(G2.ausDezimal)), u = u0.slice();
    const e = G2.lauf(u, mT.map(G2.ausDezimal), TT << sch, epsLog2 - 60);
    if (e.art === 0) {
      const r2 = u.map((v, i) => v - u0[i]);
      aus.restAndereGenauigkeit = restNorm(G2, r2, mD);
      let unterschied = 0;
      for (let i = 0; i < 12; i++) unterschied = Math.max(unterschied, Math.abs(G2.zuZahl(r2[i] - (jetzt.r[i] << sch))));
      aus.unterschiedDerReste = unterschied;
      aus.energiedrift = Math.abs(G2.zuZahl(G2.energie(u, mT.map(G2.ausDezimal)) - G2.energie(u0, mT.map(G2.ausDezimal))));
    }
  }
  return aus;
}
