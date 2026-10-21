// dreikoerper/schwarm.mjs — verteilt Aufträge auf mehrere Kerne, gebremst.
//
//   const s = macheSchwarm();            // höchstens 42 % der Kerne, niedrige Priorität
//   const ergebnisse = await s.alle(auftraege, (erg, i) => …, { zeitlimit: 600000 });
//   await s.ende();
//
// Die Bremse ist Vorgabe, kein Schalter. Am 01.10.2026 liefen drei Schwärme
// zugleich mit je 11 von 12 Kernen in normaler Priorität; die CPU stand bei
// 100 %, der Rechner war nicht mehr bedienbar und musste neu gestartet
// werden. Seither:
//   - höchstens 42 % der logischen Kerne (5 von 12): mit der Grundlast des
//     Rechners bleibt die Gesamtauslastung unter den vereinbarten 60 %;
//   - der ganze Prozess in der niedrigsten Prioritätsklasse — alles andere
//     auf dem Rechner kommt zuerst dran;
//   - und, das kann der Code nicht erzwingen: nie zwei Läufe nebeneinander.
// Wer mehr Fäden verlangt, bekommt trotzdem nur die Obergrenze.
//
// Ein Auftrag, der im Faden eine Ausnahme wirft, kommt als { fehler } zurück
// und zählt mit — er verschwindet nicht.
//
// Mit zeitlimit (Millisekunden je Auftrag): ein Auftrag, der länger braucht,
// wird samt seinem Faden beendet, kommt als { fehler, zeitlimit: true }
// zurück, und ein frischer Faden übernimmt den nächsten. Ohne das hält ein
// einziger Auftrag, der nicht fertig wird, den ganzen Lauf fest — so ging am
// 01.10.2026 eine Nachprüfung nach zwei Stunden bei 180 von 184 verloren.

import { Worker } from "node:worker_threads";
import { availableParallelism, setPriority, getPriority, constants } from "node:os";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import { HIER } from "./quellen.mjs";

export const OBERGRENZE = Math.max(1, Math.floor(availableParallelism() * 0.42));
// Gilt für den ganzen Prozess samt seinen Fäden, sobald diese Datei geladen ist.
try { setPriority(constants.priority.PRIORITY_LOW); } catch { /* ohne das Recht dazu bleibt nur die Obergrenze */ }
export const PRIORITAET = getPriority();

// Weniger Fäden, wenn der Rechner schon anderweitig zu tun hat (21.10.2026:
// Chrome und Claude zusammen ~18 % — mit fünf Fäden wäre die vereinbarte
// Grenze von 60 % überschritten): Umgebungsvariable DREIKOERPER_FAEDEN.
// Mehr als die Obergrenze gibt es auch damit nie.
const WUNSCH = Math.max(0, Math.floor(+process.env.DREIKOERPER_FAEDEN || 0));
// Am 21.10.2026 hat Felix die Grenze auf 80 % der CPU angehoben. Ohne Wunsch
// bleibt es bei 42 % der Kerne; MIT Wunsch sind bis zu zwei Drittel erlaubt
// (8 von 12) — gemessen werden muss trotzdem nach jedem Start.
export const HOECHSTENS = Math.max(1, Math.floor(availableParallelism() * 2 / 3));
export function macheSchwarm(faeden) {
  const n = WUNSCH && !faeden ? Math.min(HOECHSTENS, WUNSCH) : Math.min(OBERGRENZE, faeden || OBERGRENZE);
  const neuerFaden = () => new Worker(pathToFileURL(join(HIER, "arbeiter.mjs")));
  const plaetze = [];
  for (let i = 0; i < n; i++) plaetze.push({ w: neuerFaden(), nr: -1, seit: 0 });

  function alle(auftraege, beiErgebnis, opt) {
    const zeitlimit = opt && opt.zeitlimit;
    return new Promise((fertig, kaputt) => {
      const aus = new Array(auftraege.length);
      let naechster = 0, erledigt = 0, uhr = null;
      if (!auftraege.length) return fertig(aus);
      const schluss = () => { if (uhr) clearInterval(uhr); fertig(aus); };
      const gib = p => {
        if (naechster >= auftraege.length) { p.nr = -1; return; }
        p.nr = naechster++; p.seit = Date.now();
        p.w.postMessage({ ...auftraege[p.nr], nr: p.nr });
      };
      const melde = (p, wert) => {
        aus[p.nr] = wert; erledigt++;
        if (beiErgebnis) beiErgebnis(wert, p.nr, erledigt);
        if (erledigt === auftraege.length) schluss(); else gib(p);
      };
      const binde = p => {
        p.w.removeAllListeners("message"); p.w.removeAllListeners("error");
        p.w.on("error", kaputt);
        p.w.on("message", ({ nr, ergebnis, fehler }) => { if (nr === p.nr) melde(p, fehler ? { fehler } : ergebnis); });
      };
      for (const p of plaetze) { binde(p); gib(p); }
      if (zeitlimit) uhr = setInterval(() => {
        const jetzt = Date.now();
        for (const p of plaetze) if (p.nr >= 0 && jetzt - p.seit > zeitlimit) {
          p.w.removeAllListeners("message"); p.w.removeAllListeners("error");
          p.w.terminate();
          p.w = neuerFaden(); binde(p);
          melde(p, { fehler: `Zeitlimit von ${Math.round(zeitlimit / 1000)} s überschritten`, zeitlimit: true });
        }
      }, 1000);
    });
  }
  const ende = () => Promise.all(plaetze.map(p => p.w.terminate()));
  return { faeden: n, alle, ende };
}
