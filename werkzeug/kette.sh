#!/usr/bin/env bash
# dreikoerper/werkzeug/kette.sh — mehrere lange Läufe nacheinander, jeder mit
# eigenem Protokoll in ablage/. Wartet zuerst, bis die Eichung gegen Hristov
# fertig ist (sie braucht alle Kerne).
#
#   bash werkzeug/kette.sh
#
# Jede Zeile „SCHRITT …" in ablage/kette.log sagt, was gerade läuft und wie
# der Schritt davor endete.
cd "$(dirname "$0")/.." || exit 1
log=ablage/kette.log
: > "$log"
until grep -q "^EXIT=" ablage/pruef-hristov.log 2>/dev/null; do sleep 5; done
echo "SCHRITT 0 pruef-hristov $(grep '^EXIT=' ablage/pruef-hristov.log)" >> "$log"

schritt() {
  name="$1"; shift
  echo "SCHRITT $name beginnt $(date +%H:%M:%S)" >> "$log"
  "$@" > "ablage/$name.log" 2>&1
  echo "SCHRITT $name EXIT=$? $(date +%H:%M:%S)" >> "$log"
}

schritt euler-gleich-1-offene node nachpruefen.mjs euler-gleich-1 --unbekannt --offene
schritt fall-gleich-1         node suche.mjs --name fall-gleich-1 --ebene fall --tmax 16 --sicht 0,0.5,0,0.88 --max 40000
schritt fall-gleich-1-genau   node nachpruefen.mjs fall-gleich-1 --unbekannt --limit 600
schritt euler-m3-2            node suche.mjs --name euler-m3-2 --m 1,1,2 --max 40000
echo "KETTE FERTIG $(date +%H:%M:%S)" >> "$log"
