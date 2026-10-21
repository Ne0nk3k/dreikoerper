#!/usr/bin/env bash
# dreikoerper/werkzeug/kette-luecken.sh — die blinden Flecken bei 1/1/2 und
# 1/1/5 absuchen (21.10.2026): gebunden bis v = 1,50 bzw. 2,74, von den Listen
# nur das Quadrat [0,1]² abgedeckt (werkzeug/luecken.mjs: nirgends abgesucht
# 43 % bzw. 83 %). Je Masse zwei Fenster wie bei 1/1/4, danach die
# Stabilitätskandidaten auf 30 Stellen. Nacheinander, nie nebeneinander.
#
#   bash werkzeug/kette-luecken.sh
cd "$(dirname "$0")/.." || exit 1
log=ablage/kette-luecken.log
: > "$log"
export DREIKOERPER_FAEDEN=7
schritt() {
  name="$1"; shift
  echo "SCHRITT $name beginnt $(date +%H:%M:%S)" >> "$log"
  "$@" > "ablage/$name.log" 2>&1
  echo "SCHRITT $name EXIT=$? $(date +%H:%M:%S)" >> "$log"
}
schritt suche-m3-2-v2gross node suche.mjs --name euler-m3-2-v2gross --ebene euler --m 1,1,2 --art halb --raster 1024 --tmax 40 --max 40000 --sicht 0,1.5,1,1.5
schritt suche-m3-2-v1gross node suche.mjs --name euler-m3-2-v1gross --ebene euler --m 1,1,2 --art halb --raster 1024 --tmax 40 --max 40000 --sicht 1,1.5,0,1
schritt suche-m3-5-v2gross node suche.mjs --name euler-m3-5-v2gross --ebene euler --m 1,1,5 --art halb --raster 1024 --tmax 40 --max 40000 --sicht 0,2.75,1,2.75
schritt suche-m3-5-v1gross node suche.mjs --name euler-m3-5-v1gross --ebene euler --m 1,1,5 --art halb --raster 1024 --tmax 40 --max 40000 --sicht 1,2.75,0,1
for l in euler-m3-2-v2gross euler-m3-2-v1gross euler-m3-5-v2gross euler-m3-5-v1gross; do
  schritt "genau-$l" node nachpruefen.mjs "$l" --unbekannt --kandidaten
done
echo "KETTE FERTIG $(date +%H:%M:%S)" >> "$log"
