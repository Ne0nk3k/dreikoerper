// dreikoerper/daten-holen.mjs — holt die fremden Listen von ihren Urhebern.
//
// Die Listen von Li/Liao (github.com/sjtu-liao/three-body), die Datenbank von
// Hristov u. a. (db2.fmi.uni-sofia.bg) und der Atlas (threebodyorbits.com)
// gehören nicht uns und liegen deshalb nicht im öffentlichen Repo. Dieses
// Skript lädt sie nach quelle\ und prüft jede Datei gegen die SHA-256 aus
// quelle/HERKUNFT.json — es sind dann genau die Bytes, mit denen gerechnet
// wurde. Danach: node katalog-bauen.mjs && node katalog-gross-bauen.mjs
//
//   node daten-holen.mjs                 alles holen, was fehlt (≈ 170 MB)
//   node daten-holen.mjs --ziel <ordner> anderswohin (zum Prüfen dieses Skripts)
//
// Eine Datei, die schon da ist und stimmt, wird nicht noch einmal geladen.
// Eine, die nicht stimmt, wird nicht überschrieben, sondern gemeldet.

import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { createHash } from "node:crypto";
import { spawnSync } from "node:child_process";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const HIER = dirname(fileURLToPath(import.meta.url));
const arg = process.argv.slice(2);
const zielArg = arg.indexOf("--ziel");
const ZIEL = zielArg >= 0 ? arg[zielArg + 1] : HIER;
const { dateien } = JSON.parse(readFileSync(join(HIER, "quelle", "HERKUNFT.json"), "utf8"));
const sha = b => createHash("sha256").update(b).digest("hex");

let gut = 0, geholt = 0, schlecht = 0, anders = 0, vonHand = 0;
for (const e of dateien) {
  const pfad = join(ZIEL, e.datei);
  if (existsSync(pfad)) {
    if (sha(readFileSync(pfad)) === e.sha256) { gut++; continue; }
    console.log(`ABWEICHEND (liegt schon da, bleibt unangetastet): ${e.datei}`);
    e.veraenderlich ? anders++ : schlecht++;
    continue;
  }
  let daten;
  // abgeleitete Datei (13.11.2026): aus ihrer Quelle mit einem Werkzeug erzeugen, z. B. der Text der
  // Zusatzdaten von 2018 aus deren PDF (werkzeug/pdf-text.mjs); die Prüfsumme gilt wie sonst
  if (e.abgeleitet) {
    const von = join(ZIEL, e.abgeleitet.von);
    if (!existsSync(von)) { console.log(`NICHT ABGELEITET: ${e.datei} — es fehlt ${e.abgeleitet.von}`); schlecht++; continue; }
    const r = spawnSync(process.execPath, [join(HIER, e.abgeleitet.werkzeug), von], { maxBuffer: 1 << 30 });
    if (r.status !== 0) { console.log(`NICHT ABGELEITET: ${e.datei} (${e.abgeleitet.werkzeug} endete mit ${r.status})`); schlecht++; continue; }
    daten = r.stdout;
  } else if (!e.url) {
    // von Hand (21.11.2026): der Verlag gibt die Zusatzdaten von 2018 nur über einen je Abruf signierten Link heraus; so
    // ein Link gehört nicht ins Repo — er läuft ab und sieht aus wie ein Schlüssel. Der Bezugsweg steht in e.bezug.
    console.log(`VON HAND HOLEN: ${e.datei}\n  ${e.bezug || "(kein Bezugsweg angegeben)"}`);
    vonHand++;
    continue;
  } else try {
    const r = await fetch(e.url, { signal: AbortSignal.timeout(15 * 60 * 1000) });
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    daten = Buffer.from(await r.arrayBuffer());
  } catch (f) {
    console.log(`NICHT GELADEN: ${e.datei} von ${e.url} (${f.message})${e.bezug ? `\n  von Hand: ${e.bezug}` : ""}`);
    schlecht++;
    continue;
  }
  const passt = sha(daten) === e.sha256;
  if (!passt && !e.veraenderlich) {
    console.log(`FALSCHE PRÜFSUMME, verworfen: ${e.datei} (${daten.length} statt ${e.bytes} Bytes) — die Quelle hat sich geändert`);
    schlecht++;
    continue;
  }
  mkdirSync(dirname(pfad), { recursive: true });
  writeFileSync(pfad, daten);
  geholt++;
  if (passt) console.log(`geholt: ${e.datei} (${(daten.length / 1e6).toFixed(1)} MB)`);
  else { anders++; console.log(`geholt, aber NEUERER STAND als beim Rechnen: ${e.datei} (${e.wozu})`); }
}
console.log(`\n${dateien.length} Dateien: ${gut} waren schon richtig da, ${geholt} geholt, ${anders} in neuerem Stand, ${schlecht} fehlen oder stimmen nicht${vonHand ? `, ${vonHand} von Hand zu holen (siehe oben)` : ""}.`);
process.exit(schlecht ? 1 : 0);
