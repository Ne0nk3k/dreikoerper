#!/usr/bin/env bash
# dreikoerper/werkzeug/kette2.sh — nach der zurückgenommenen Stabilitätsregel:
# die Läufe mit dem heutigen Kern neu beschreiben, dann die in double offenen
# Stabilitätsurteile in erhöhter Genauigkeit entscheiden.
#
#   bash werkzeug/kette2.sh
#
# Wartet auf die Eichung gegen Hristov und geht nur weiter, wenn sie grün ist:
# auf einer Regel, die die Eichung nicht besteht, baut kein Bericht auf.
cd "$(dirname "$0")/.." || exit 1
log=ablage/kette2.log
: > "$log"
until grep -q "^EXIT=" ablage/pruef-hristov.log 2>/dev/null; do sleep 5; done
echo "SCHRITT 0 pruef-hristov $(grep '^EXIT=' ablage/pruef-hristov.log)" >> "$log"
if ! grep -q "^EXIT=0" ablage/pruef-hristov.log; then echo "KETTE2 ABGEBROCHEN: Eichung nicht grün" >> "$log"; exit 1; fi
until grep -q "^EXIT=" ablage/stabil-genau-instabil.log 2>/dev/null; do sleep 5; done
echo "SCHRITT 0 stabil-genau-instabil $(grep '^EXIT=' ablage/stabil-genau-instabil.log)" >> "$log"
if ! grep -q "^EXIT=0" ablage/stabil-genau-instabil.log; then echo "KETTE2 ABGEBROCHEN: genaue Stabilität trifft die Quelle nicht" >> "$log"; exit 1; fi

schritt() {
  name="$1"; shift
  echo "SCHRITT $name beginnt $(date +%H:%M:%S)" >> "$log"
  "$@" > "ablage/$name.log" 2>&1
  echo "SCHRITT $name EXIT=$? $(date +%H:%M:%S)" >> "$log"
}

schritt nachbereiten-euler-gleich-1 node nachbereiten.mjs euler-gleich-1
schritt nachbereiten-probe-halb-256 node nachbereiten.mjs probe-halb-256
schritt stabil-euler-gleich-1       node nachpruefen.mjs euler-gleich-1 --unbekannt --mitStabil --limit 1200
schritt stabil-probe-halb-256       node nachpruefen.mjs probe-halb-256 --unbekannt --mitStabil --limit 1200
echo "KETTE2 FERTIG $(date +%H:%M:%S)" >> "$log"
