# Weitere Sammlungen — geladen am 02.10.2026, 22 Uhr

Anlass: Felix, 02.10.2026: „machs größer, behebe das problem“ — die
Vergleichsliste für ungleiche Massen sollte erweitert werden. Hier steht, was
geholt wurde, was darin ist, und warum es an den Zahlen nichts ändert.

Nur gelesen, nichts verändert. Die großen Dateien stehen in `.gitignore`;
Herkunft und Prüfsumme genügen, um sie wiederzuholen.

| Datei | Herkunft | Bytes | SHA-256 (Anfang) | im Repo |
|---|---|---|---|---|
| `non-hierarchical-3b-supplementary_data.txt` | github.com/sjtu-liao/three-body (Hauptzweig) | 14 222 440 | 9c06eedc41b537b2 | nein |
| `roadmap/case1_periodic_orbit.dat` | dort, `roadmap/Data/` | 3 935 250 | 0f0fb087ccf42ce8 | nein |
| `roadmap/case2_periodic_orbit.dat` | dort | 4 911 554 | 804af871f27ddec9 | nein |
| `roadmap/case1_classification.dat` | dort | 703 508 | c48c05ad2ae06c85 | nein |
| `roadmap/case2_classification.dat` | dort | 868 874 | 21a4dc09e9cab202 | nein |
| `atlas/catalogue.json` | data.threebodyorbits.com/catalogue.json (Stand der Datei: 27.09.2026) | 1 772 587 | 597c66bd93776482 | ja |

## Was darin ist — gemessen, nicht gelesen

**Die 135 445 Bahnen (Li, Li und Liao 2021).** Eine einzige Familie, in den
Massen fortgesetzt: m₃ = 1, m₁ von 0,8 bis 1,1, m₂ von 0,7 bis 1,2, Perioden
5 bis 8,8. Ihre Bahn bei gleichen Massen ist die Motte I (T* auf 1,4·10⁻¹⁰
gleich dem Katalogwert). Fast alle haben einen Drehimpuls; unsere Euler-Ebene
hat keinen, und der Drehimpuls bleibt erhalten. Für die Massen, die wir
absuchen, steht darin: 1/1/1 eine Zeile (die Motte I), 1/1/0,75 eine Zeile
mit Drehimpuls (also eine andere Aufgabe), 1/1/0,5, 1/1/2, 1/1/4, 1/1/5,
1/1/8 und 1/1/10 nichts. → `werkzeug/nichthierarchisch-pruefen.mjs`

**Roadmap (Liao, Li und Yang 2022).** 29 150 und 35 895 Bahnen, laut Quelle
„relatively periodic BHH satellites … in a rotating frame“: periodisch nur im
mitdrehenden Bezugssystem, Drehwinkel je Periode 0,383 und 0,0105. Nachgerechnet
(Startaufbau wie im Papier angenommen): kleinster skalierter Drehimpuls
7·10⁻⁵ und 1·10⁻³, also nie null. Keine Bahnen unserer Art.

**Der Atlas threebodyorbits.com.** 3943 Bahnen aus veröffentlichten Listen
und eigenen Suchen, je Bahn Massen, T, E, L und max |λ| (Feld `stab`), keine
Anfangswerte. 3508 ohne Drehimpuls, 3224 davon mit zwei gleichen Massen. Für
die Massen dieses Projekts führt er genau die Zahlen von Li/Liao: 565
(1/1/0,5), 401 (1/1/0,75), 237 (1/1/2), 85 (1/1/4), 35, 17, 9. Seine eigenen
Suchen (September 2026) liegen bei anderen Massen. Bei gleichen Massen 1803
Bahnen ohne Drehimpuls. → `werkzeug/atlas-pruefen.mjs`

## Was der Vergleich ergab

Verglichen wird über Größen, die sich beim Umskalieren nicht ändern:
t = T·|E|^1,5 / M^2,5 und die Massenform. Geeicht am eigenen Katalog: der
Atlas findet 2363 von 2364 unserer Listenbahnen wieder, Abweichung in t im
Median 2·10⁻⁷, höchstens 2,4·10⁻⁶. Er ist also zehnmal gröber als unsere
Regel (2·10⁻⁸) und entscheidet allein nichts.

Von unseren 645 Bahnen außerhalb der Listen liegen fünf innerhalb von
2·10⁻⁶ einer Atlasbahn. Bei vier ist das Stabilitätsmaß ein anderes
(`stab` am Atlas geeicht: acht Bahnen mit selbst gemessenem |λ| stimmen; die
achte war zuerst falsch gepaart und fehlte stillschweigend, richtig gepaart
— die Garn, 5,0 gegen 5,0218 — stimmt auch sie).
Beim fünften (1/1/2, T 81,44) trägt das Argument nicht: auf 30 Stellen hat
diese Bahn einen Index exakt 2, also |λ| = 1, nah an den 1,0005 des Atlas
(die 1,5 unten stammen aus double und waren falsch). Dort trennt erst die
Nachrechnung beider Bahnen auf 30 Stellen: T* 520,586637730 gegen
520,587008660, also 7,1·10⁻⁷ auseinander, wo dieselbe Bahn auf 10⁻¹²
übereinstimmte (`werkzeug/grauzone.mjs`, 03.10.2026). Ebenso für 1/1/2,
T 52,48 neben I.B-7 (6,8·10⁻⁷).

| Fund | max \|λ\| (eigene Messung) | Atlasbahn | max \|λ\| im Atlas |
|---|---|---|---|
| Euler 1/1/1, T 61,40 | 4199 (30 Stellen) | Hristov 2022, Nr. 122 | 11 963 |
| Euler 1/1/1, T 77,64 | 1,3·10⁸ | Hristov 2026, hs33 | 1 (stabil) |
| freier Fall 1/1/1, T 5,396 | 421 (30 Stellen) | Li/Liao F-21 | 458 |
| Euler 1/1/2, T 52,48 | 2,6 | Li/Liao I.B-7 | 1 (stabil) |
| Euler 1/1/2, T 81,44 | 1,5 in double — auf 30 Stellen 1 (ein Index exakt 2) | Li/Liao II.A-2 | 1,0005 |

Es sind fünf andere Bahnen mit fast gleicher Periode — dieselbe Erscheinung
wie bei der „Acht (andere Lage)“. **Die Zahlen bleiben: 489 bei gleichen
Massen, 156 bei 1/1/2.**

## Was das heißt

Der Abgleich ist jetzt gegen drei Sammlungen geprüft, aber die Deckung ist
nicht größer geworden: für ungleiche Massen unserer Art (Drehimpuls null, zwei
gleiche Massen) führen alle drei dieselben 1349 Bahnen von Li, Jing und Liao
2018. Die Aussage heißt deshalb weiter „nicht bei Li/Liao 2018“ — mit dem
Zusatz, dass weder Atlas noch die beiden großen Dateien für diese Massen
etwas anderes kennen. Eine weitere Liste dieser Art hat die Suche am
02.10.2026 nicht gefunden; das ist kein Beweis, dass es keine gibt.

In `gleicheAb` wird nichts davon aufgenommen: die beiden großen Dateien
können nach ihrer Bauart keine unserer Bahnen treffen, und der Atlas ist für
eine Regel über T* zu grob (er würde den Fehler „andere Lage“ zurückholen).
`werkzeug/atlas-pruefen.mjs` läuft stattdessen nach jedem Suchlauf als
Gegenprobe, mit dem Stabilitätsmaß als Schiedsrichter.
