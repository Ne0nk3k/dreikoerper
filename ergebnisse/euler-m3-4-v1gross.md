# Suchlauf euler-m3-4-v1gross

2026-10-21 10:32 UTC · Euler-Ebene · Massen 1 / 1 / 4 · Fenster v₁ 1…2.4, v₂ 0…1 · Raster 1024×1024 · Perioden bis 40 · Suche über Umkehrpunkte (halbe Periode)

## Was der Lauf getan hat

| Stufe | Zahl |
|---|---|
| Rasterpunkte gerechnet | 1048576 in 344 s auf 6 Fäden |
| davon durchgelaufen / Zerfall / abgebrochen / ungebunden | 566076 / 400832 / 13131 / 68537 |
| Talsohlen (unter 0.3) in 4 Zielen × 6 Zeitbändern | 411345 |
| davon durch die Prüfkette | 40000 in 877 s |
| Umkehrpunkt verfehlt | 38024 |
| Umkehrpunkt getroffen, aber nach 12τ nicht zurück (nur bis auf eine Drehung periodisch) | 252 |
| geschlossene Bahn | 1724 |
| verschiedene Orte in der Ebene | **59** |
| verschiedene Bahnen (gleiches T* auf acht Stellen einmal gezählt) | **58** |
| — bestätigt (voller Umlauf: Rest < 1e-10 und Gegenprobe < 1e-8) | 12 |
| — über den Umkehrpunkt (halber Umlauf auf 1e-11 getroffen, voller für double zu empfindlich) | 36 |
| — an der Rechengrenze | 11 |
| sicher linear stabil | 1 |
| Ausnahmen im Schwarm | 0 |

Je Ziel (Fixmenge, die nach der halben Periode getroffen wird):

| Ziel | Kandidaten | Umkehrpunkt getroffen | geschlossene Bahn |
|---|---|---|---|
| A3 | 5949 | 395 | 395 |
| B3 | 24563 | 1301 | 1289 |
| C | 7576 | 81 | 40 |
| R | 1912 | 199 | 0 |

## Bekannt oder nicht

Von den 59 Funden stehen **9** in einer der geprüften Listen, **50** in keiner. Als verschiedene Bahnen gezählt (eine Bahn kann die Ebene an mehreren Stellen kreuzen): 58, davon **49** in keiner Liste.

| Liste | Stufe | Bahnen | Bedeutung |
|---|---|---|---|
| Li/Liao 2017–2019, Šuvakov/Dmitrašinović 2013 (2364 Bahnen, mit Klassen) | Ort | 7 | steht mit diesen Anfangswerten in der Liste |
| | Lage | 2 | gleiches T* auf acht Stellen: Listenbahn, an anderer Stelle getroffen |
| | Klasse | 9 | Klasse in der Liste, aber anderes T*: weitere Bahn derselben Familie |
| | keine | 41 | Klasse nicht in der Liste |
| Hristov u. a. | — | — | nur für gleiche Massen; hier nicht anwendbar |

**Für die Massen 1 / 1 / 4 gibt es als Vergleich nur Li und Liao: 85 Bahnen, je Klasse eine, davon 7 mit T bis 40.** Die großen Listen von Hristov u. a. gelten nur für gleiche Massen. „In keiner Liste“ sagt in diesem Lauf deshalb wenig: fast alles, was eine Suche bei diesen Massen findet, steht in keiner Liste, weil es kaum eine gibt.

„In keiner Liste“ heißt genau das und nicht „neu“. Die Listen sind in sich begrenzt: Li und Liao führen je Klasse eine Bahn bis T = 200, gefunden auf einem Raster von 4000²; Hristov u. a. führen die Euler-Ebene bis T* = 211 und den freien Fall bis T* = 80 (mit Punktsymmetrie bis 120).

**Satelliten:** 2 der 50 Funde außerhalb der Listen laufen mehrmals fast den Weg einer anderen Bahn dieses Laufs oder der Liste, bevor sie sich schließen (Wort das k-fache, T* das k-fache); bei 1 davon ist die Grundbahn gelistet. Das sind eigene Bahnen, aber keine unerklärten — um eine stabile Bahn herum gibt es solche Begleiter regelmäßig. Sie sind in der Tabelle unten in der Spalte „Listen“ benannt.

## Gegenrichtung: was der Lauf von den Listen wiederfindet

| Liste | Bahnen im Fenster mit T bis 40 | gefunden | Anteil |
|---|---|---|---|
| Li/Liao, 2013 | 0 | 0 | — |

![Karte](euler-m3-4-v1gross.png)

Karte: hell = die Bahn kommt bis zur halben Höchstperiode einer Fixmenge nahe. Weißer Ring = Fund, der in einer Liste steht (nur bei bis zu 3000 Funden gezeichnet). Grüner Punkt = Fund, der in keiner Liste steht. Rotes Kreuz = Bahn aus Li/Liao, die der Lauf verpasst hat.

## Funde in keiner Liste (50)

| v₁ | v₂ | T | T* | Rest (voller Umlauf) | Umkehrpunkt | Urteil | Stabilität | \|λ\| | engste Begegnung | Wortlänge | Listen |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 0.374919499664 | 1.386520360051 | 16.70020195 | 209.8819 | 1.1e-10 | C 9.3e-14 | über den Umkehrpunkt | instabil | 1.54e+4 | 0.03837 | 22 | — |
| 0.655621455893 | 1.233124358381 | 17.90707752 | 235.6762 | 1.8e-7 | C 9.8e-14 | über den Umkehrpunkt | instabil | 6.011e+8 | 0.007278 | 22 | — |
| 0.957990858075 | 1.085274761174 | 18.54404241 | 229.9027 | 2.9e-11 | B3 4.8e-13 | bestätigt | offen | 1.00 | 0.005103 | 20 | — |
| 0.359021911910 | 1.357311686559 | 18.87938063 | 246.3939 | 2.5e-10 | C 3.9e-14 | über den Umkehrpunkt | instabil | 3.04e+4 | 0.03276 | 26 | — |
| 0.185172657718 | -1.839090271395 | 19.55759545 | 121.2725 | 5.2e-11 | C 2.9e-14 | bestätigt | instabil | 1.59e+3 | 0.01748 | 14 | — |
| 0.901399159658 | 1.393815261524 | 19.96084882 | 182.1690 | 6.2e-12 | B3 2.1e-12 | bestätigt | instabil | 1.63 | 0.01056 | 16 | — |
| 0.891148011711 | 1.595965834163 | 20.38373416 | 132.7918 | 1.1e-11 | B3 2.4e-13 | bestätigt | instabil | 1.29e+4 | 0.02769 | 12 | — |
| 1.278281060097 | 0.347707819452 | 22.62614635 | 321.5928 | 1.7e-7 | A3 9.7e-11 | an der Rechengrenze | offen | 5.006e+5 | 3.2e-5 | 28 | — |
| 1.238260429392 | 0.809647550999 | 23.23035384 | 276.7953 | 7.6e-12 | B3 7.6e-15 | bestätigt | instabil | 654 | 0.006571 | 24 | nur Klasse von I.A-2 |
| 0.514660732208 | 1.569977080368 | 27.27374047 | 252.1908 | 1.6e-6 | C 6.1e-12 | über den Umkehrpunkt | offen | 2.394e+7 | 4.8e-4 | 30 | — |
| 1.279738357234 | 0.909753221356 | 28.23246120 | 297.0792 | 1.6e-9 | A3 1.0e-12 | über den Umkehrpunkt | instabil | 1.685e+6 | 0.008352 | 26 | — |
| -0.200658809439 | 1.876435288422 | 28.34015694 | 159.0520 | 4.0e-10 | C 1.1e-12 | über den Umkehrpunkt | instabil | 4.96e+3 | 0.01748 | 18 | — |
| 0.361439145700 | 1.466953377328 | 28.42888618 | 325.1299 | 1.4e-6 | C 1.1e-13 | über den Umkehrpunkt | instabil | 5.435e+7 | 0.001132 | 34 | — |
| 1.402752950093 | 0.573373476158 | 29.90509590 | 339.9103 | 2.8e-6 | B3 1.9e-10 | an der Rechengrenze | offen | 1.184e+8 | 8.2e-6 | 30 | — |
| 1.370796829631 | 0.887280882604 | 31.21614549 | 298.0345 | 7.8e-9 | A3 2.4e-12 | über den Umkehrpunkt | instabil | 2.033e+6 | 0.007744 | 26 | — |
| 1.266937299601 | 1.183922837277 | 31.41768898 | 250.3803 | 3.1e-9 | A3 7.3e-12 | über den Umkehrpunkt | instabil | 6.59e+4 | 0.007165 | 22 | — |
| 1.437018899941 | 0.607882032109 | 31.83274063 | 339.8151 | 5.0e-8 | B3 9.7e-12 | über den Umkehrpunkt | instabil | 1.122e+8 | 8.5e-4 | 30 | — |
| 1.364265093780 | -0.931210393702 | 34.48253826 | 319.0650 | 2.5e-7 | B3 6.3e-14 | über den Umkehrpunkt | instabil | 1.395e+8 | 0.01209 | 28 | — |
| 0.749202237865 | -1.381604453885 | 34.49458972 | 362.1650 | 2.0e-8 | C 4.1e-13 | über den Umkehrpunkt | instabil | 4.358e+5 | 0.005079 | 32 | — |
| 0.616885959067 | 1.531419893861 | 34.79224006 | 322.3542 | 3.6e-6 | C 5.2e-12 | über den Umkehrpunkt | instabil | 2.452e+8 | 0.01385 | 30 | — |
| 0.604779292287 | 1.576401942191 | 36.60756701 | 317.7793 | 5.0e-7 | B3 6.0e-11 | an der Rechengrenze | offen | 2.662e+5 | 0.006484 | 30 | — |
| -0.341090509065 | 1.805692593857 | 37.14299554 | 236.4338 | 4.3e-7 | C 3.0e-12 | über den Umkehrpunkt | instabil | 5.816e+7 | 0.01449 | 22 | — |
| 0.210634652471 | 1.898790417791 | 37.17967490 | 195.6443 | 1.1e-10 | C 1.4e-13 | über den Umkehrpunkt | instabil | 1.18e+4 | 0.01733 | 22 | — |
| 0.512680771762 | 1.658960598956 | 37.87582605 | 300.4550 | 6.9e-9 | B3 2.1e-13 | über den Umkehrpunkt | instabil | 3.684e+5 | 0.01257 | 28 | — |
| 1.107258683128 | 0.737218162370 | 39.17575747 | 553.7015 | 1.5e-11 | B3 3.0e-13 | bestätigt | offen | 1.09 | 8.1e-4 | 48 | Satellit 2. Ordnung von I.A-2 (T* das 1.99999-fache) |
| 0.861178991127 | 1.672326566694 | 40.14388712 | 228.9941 | 1.4e-8 | C 9.0e-14 | über den Umkehrpunkt | instabil | 6.395e+6 | 0.04834 | 22 | — |
| 1.384278499034 | 0.944845525234 | 40.43006609 | 358.8127 | 3.9e-6 | B3 6.6e-12 | über den Umkehrpunkt | instabil | 7.447e+9 | 0.01032 | 32 | — |
| 0.217660593463 | 1.913888778226 | 46.05590118 | 231.5166 | 8.1e-10 | C 3.8e-14 | über den Umkehrpunkt | instabil | 2.36e+4 | 0.01718 | 26 | — |
| 1.215449607798 | 0.905381933368 | 46.66776115 | 530.3074 | 3.7e-11 | C 3.3e-12 | bestätigt | instabil | 451 | 0.003549 | 46 | nur Klasse von I.B-2 |
| 1.665837708269 | 0.747682726303 | 48.77339567 | 319.2173 | 3.7e-8 | B3 3.0e-13 | über den Umkehrpunkt | instabil | 9.193e+7 | 0.009635 | 28 | — |
| 1.082363717355 | -1.641721556654 | 50.73731361 | 225.0811 | 7.4e-8 | B3 2.9e-13 | über den Umkehrpunkt | instabil | 6.025e+6 | 0.01797 | 20 | — |
| 0.998088209369 | 0.274255978634 | 51.02489462 | 923.3909 | 1.2e-10 | B3 2.3e-12 | über den Umkehrpunkt | offen | 3.46 | 2.5e-5 | 80 | nur Klasse von I.A-6 |
| 0.803294553312 | 1.435933350783 | 53.25485430 | 498.1030 | 1.2e-10 | B3 5.6e-12 | über den Umkehrpunkt | stabil | 1.00 | 0.001515 | 44 | — |
| 1.020979451694 | 1.582787020617 | 53.83592581 | 305.0856 | 2.1e-8 | C 1.3e-13 | über den Umkehrpunkt | instabil | 1.653e+6 | 0.08713 | 30 | — |
| 0.222921253036 | 1.924881434536 | 54.95881606 | 266.8944 | 3.5e-10 | C 1.1e-13 | über den Umkehrpunkt | instabil | 4.19e+4 | 0.01707 | 30 | — |
| 0.971213030274 | 1.090122543981 | 56.48538542 | 689.7082 | 5.1e-11 | B3 1.1e-12 | bestätigt | instabil | 1.48 | 0.004814 | 60 | Satellit 3. Ordnung von Fund (0.957991, 1.085275) (T* das 3.00000-fache) |
| 0.689559480207 | 1.600116135122 | 57.19614713 | 448.3695 | 5.0e-6 | C 8.9e-13 | über den Umkehrpunkt | instabil | 1.939e+8 | 0.03229 | 42 | — |
| 0.919293407513 | 1.284811134793 | 57.31648158 | 594.5319 | 1.4e-10 | B3 1.3e-13 | über den Umkehrpunkt | offen | 1.04 | 9.5e-4 | 52 | — |
| 1.225657156107 | 0.590314754255 | 64.04171234 | 877.0119 | 2.9e-9 | B3 2.7e-13 | über den Umkehrpunkt | instabil | 2.61e+3 | 5.2e-4 | 76 | nur Klasse von I.A-5 |
| 1.142483130028 | 0.906864354901 | 64.08430731 | 783.8062 | 7.0e-11 | B3 3.9e-13 | bestätigt | instabil | 51.9 | 8.1e-4 | 68 | nur Klasse von I.A-4 |
| -0.230355562170 | 1.939997525331 | 72.82189025 | 336.6362 | 1.7e-9 | C 9.9e-13 | über den Umkehrpunkt | instabil | 1.046e+5 | 0.01690 | 38 | — |
| 0.972644433304 | 0.960354367678 | 72.82270249 | 990.3666 | 2.9e-10 | C 2.7e-10 | an der Rechengrenze | offen | 1.16 | 2.2e-4 | 86 | nur Klasse von II.B-2 |
| 1.075877288009 | 0.523132618087 | 73.50940370 | 1177.1582 | 4.4e-10 | C 7.5e-10 | an der Rechengrenze | offen | 1.99 | 1.6e-4 | 102 | nur Klasse von I.B-7 |
| 1.138152161823 | 1.675039302735 | 73.65910227 | 265.0642 | 3.8e-7 | B3 1.6e-13 | über den Umkehrpunkt | instabil | 3.623e+8 | 0.01739 | 24 | — |
| 0.951671260318 | 1.124235989776 | 74.57240873 | 895.9294 | 4.2e-10 | C 1.4e-10 | an der Rechengrenze | offen | 1.08 | 3.5e-4 | 78 | — |
| 1.105270184795 | 1.520026907748 | 78.05826462 | 447.2179 | 4.4e-6 | C 1.9e-13 | über den Umkehrpunkt | instabil | 8.191e+8 | 0.09641 | 46 | — |
| 0.962117764473 | 1.726553980806 | 80.85078651 | 346.8110 | 4.1e-7 | C 1.4e-13 | über den Umkehrpunkt | instabil | 4.276e+8 | 0.04992 | 34 | — |
| 0.946937790237 | 0.608579518538 | 84.39666019 | 1430.8131 | 3.2e-9 | B3 5.8e-10 | an der Rechengrenze | offen | 9.04 | 2.4e-5 | 124 | nur Klasse von I.A-10 |
| 1.042543735989 | 0.620230683489 | 90.64318368 | 1430.8131 | 2.3e-9 | B3 1.3e-11 | an der Rechengrenze | offen | 1.68 | 7.3e-5 | 124 | nur Klasse von I.A-10 |
| 0.966723500092 | 1.020355857963 | 91.86558479 | 1196.7498 | 2.1e-10 | B3 3.0e-11 | an der Rechengrenze | offen | 2.07 | 1.7e-4 | 104 | — |


## Sicher linear stabile Funde (1)

| v₁ | v₂ | T | T* | Rest (voller Umlauf) | Umkehrpunkt | Urteil | Stabilität | \|λ\| | engste Begegnung | Wortlänge | Listen |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 0.803294553312 | 1.435933350783 | 53.25485430 | 498.1030 | 1.2e-10 | B3 5.6e-12 | über den Umkehrpunkt | stabil | 1.00 | 0.001515 | 44 | — |

## Alle Funde (59)

| v₁ | v₂ | T | T* | Rest (voller Umlauf) | Umkehrpunkt | Urteil | Stabilität | \|λ\| | engste Begegnung | Wortlänge | Listen |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 0.374919499664 | 1.386520360051 | 16.70020195 | 209.8819 | 1.1e-10 | C 9.3e-14 | über den Umkehrpunkt | instabil | 1.54e+4 | 0.03837 | 22 | — |
| 0.991198121730 | 0.711947212488 | 17.65078078 | 276.8523 | 2.5e-11 | B3 1.5e-14 | bestätigt | offen | 1.00 | 0.001702 | 24 | ort: I.A-2 |
| 0.655621455893 | 1.233124358381 | 17.90707752 | 235.6762 | 1.8e-7 | C 9.8e-14 | über den Umkehrpunkt | instabil | 6.011e+8 | 0.007278 | 22 | — |
| 0.957990858075 | 1.085274761174 | 18.54404241 | 229.9027 | 2.9e-11 | B3 4.8e-13 | bestätigt | offen | 1.00 | 0.005103 | 20 | — |
| 0.359021911910 | 1.357311686559 | 18.87938063 | 246.3939 | 2.5e-10 | C 3.9e-14 | über den Umkehrpunkt | instabil | 3.04e+4 | 0.03276 | 26 | — |
| 0.185172657718 | -1.839090271395 | 19.55759545 | 121.2725 | 5.2e-11 | C 2.9e-14 | bestätigt | instabil | 1.59e+3 | 0.01748 | 14 | — |
| 0.901399159658 | 1.393815261524 | 19.96084882 | 182.1690 | 6.2e-12 | B3 2.1e-12 | bestätigt | instabil | 1.63 | 0.01056 | 16 | — |
| 1.189750480752 | 0.461480215070 | 20.12861144 | 300.0764 | 1.0e-10 | A3 1.7e-13 | über den Umkehrpunkt | offen | 1.07 | 1.3e-4 | 26 | lage: II.C-1 |
| 0.891148011711 | 1.595965834163 | 20.38373416 | 132.7918 | 1.1e-11 | B3 2.4e-13 | bestätigt | instabil | 1.29e+4 | 0.02769 | 12 | — |
| 1.278281060097 | 0.347707819452 | 22.62614635 | 321.5928 | 1.7e-7 | A3 9.7e-11 | an der Rechengrenze | offen | 5.006e+5 | 3.2e-5 | 28 | — |
| 1.238260429392 | 0.809647550999 | 23.23035384 | 276.7953 | 7.6e-12 | B3 7.6e-15 | bestätigt | instabil | 654 | 0.006571 | 24 | nur Klasse von I.A-2 |
| 0.514660732208 | 1.569977080368 | 27.27374047 | 252.1908 | 1.6e-6 | C 6.1e-12 | über den Umkehrpunkt | offen | 2.394e+7 | 4.8e-4 | 30 | — |
| 1.279738357234 | 0.909753221356 | 28.23246120 | 297.0792 | 1.6e-9 | A3 1.0e-12 | über den Umkehrpunkt | instabil | 1.685e+6 | 0.008352 | 26 | — |
| -0.200658809439 | 1.876435288422 | 28.34015694 | 159.0520 | 4.0e-10 | C 1.1e-12 | über den Umkehrpunkt | instabil | 4.96e+3 | 0.01748 | 18 | — |
| 0.361439145700 | 1.466953377328 | 28.42888618 | 325.1299 | 1.4e-6 | C 1.1e-13 | über den Umkehrpunkt | instabil | 5.435e+7 | 0.001132 | 34 | — |
| 1.402752950093 | 0.573373476158 | 29.90509590 | 339.9103 | 2.8e-6 | B3 1.9e-10 | an der Rechengrenze | offen | 1.184e+8 | 8.2e-6 | 30 | — |
| 1.370796829631 | 0.887280882604 | 31.21614549 | 298.0345 | 7.8e-9 | A3 2.4e-12 | über den Umkehrpunkt | instabil | 2.033e+6 | 0.007744 | 26 | — |
| 1.266937299601 | 1.183922837277 | 31.41768898 | 250.3803 | 3.1e-9 | A3 7.3e-12 | über den Umkehrpunkt | instabil | 6.59e+4 | 0.007165 | 22 | — |
| 1.437018899941 | 0.607882032109 | 31.83274063 | 339.8151 | 5.0e-8 | B3 9.7e-12 | über den Umkehrpunkt | instabil | 1.122e+8 | 8.5e-4 | 30 | — |
| 1.364265093780 | -0.931210393702 | 34.48253826 | 319.0650 | 2.5e-7 | B3 6.3e-14 | über den Umkehrpunkt | instabil | 1.395e+8 | 0.01209 | 28 | — |
| 0.749202237865 | -1.381604453885 | 34.49458972 | 362.1650 | 2.0e-8 | C 4.1e-13 | über den Umkehrpunkt | instabil | 4.358e+5 | 0.005079 | 32 | — |
| 0.616885959067 | 1.531419893861 | 34.79224006 | 322.3542 | 3.6e-6 | C 5.2e-12 | über den Umkehrpunkt | instabil | 2.452e+8 | 0.01385 | 30 | — |
| 0.994734060475 | 0.586002268729 | 34.81124126 | 576.9730 | 1.7e-10 | B3 1.5e-12 | über den Umkehrpunkt | offen | 1.00 | 2.7e-4 | 50 | ort: I.B-3 |
| 1.041299218268 | 0.152526504528 | 34.85288069 | 623.2955 | 2.5e-9 | A3 1.8e-10 | an der Rechengrenze | offen | 4.22 | 1.1e-5 | 54 | lage: II.B-1 |
| 0.986675456627 | 0.819978013576 | 35.80701113 | 530.3585 | 5.9e-11 | B3 9.5e-13 | bestätigt | offen | 1.01 | 6.0e-4 | 46 | ort: I.B-2 |
| 0.604779292287 | 1.576401942191 | 36.60756701 | 317.7793 | 5.0e-7 | B3 6.0e-11 | an der Rechengrenze | offen | 2.662e+5 | 0.006484 | 30 | — |
| -0.341090509065 | 1.805692593857 | 37.14299554 | 236.4338 | 4.3e-7 | C 3.0e-12 | über den Umkehrpunkt | instabil | 5.816e+7 | 0.01449 | 22 | — |
| 0.210634652471 | 1.898790417791 | 37.17967490 | 195.6443 | 1.1e-10 | C 1.4e-13 | über den Umkehrpunkt | instabil | 1.18e+4 | 0.01733 | 22 | — |
| 0.512680771762 | 1.658960598956 | 37.87582605 | 300.4550 | 6.9e-9 | B3 2.1e-13 | über den Umkehrpunkt | instabil | 3.684e+5 | 0.01257 | 28 | — |
| 1.107258683128 | 0.737218162370 | 39.17575747 | 553.7015 | 1.5e-11 | B3 3.0e-13 | bestätigt | offen | 1.09 | 8.1e-4 | 48 | Satellit 2. Ordnung von I.A-2 (T* das 1.99999-fache) |
| 0.861178991127 | 1.672326566694 | 40.14388712 | 228.9941 | 1.4e-8 | C 9.0e-14 | über den Umkehrpunkt | instabil | 6.395e+6 | 0.04834 | 22 | — |
| 1.384278499034 | 0.944845525234 | 40.43006609 | 358.8127 | 3.9e-6 | B3 6.6e-12 | über den Umkehrpunkt | instabil | 7.447e+9 | 0.01032 | 32 | — |
| 0.217660593463 | 1.913888778226 | 46.05590118 | 231.5166 | 8.1e-10 | C 3.8e-14 | über den Umkehrpunkt | instabil | 2.36e+4 | 0.01718 | 26 | — |
| 1.215449607798 | 0.905381933368 | 46.66776115 | 530.3074 | 3.7e-11 | C 3.3e-12 | bestätigt | instabil | 451 | 0.003549 | 46 | nur Klasse von I.B-2 |
| 1.665837708269 | 0.747682726303 | 48.77339567 | 319.2173 | 3.7e-8 | B3 3.0e-13 | über den Umkehrpunkt | instabil | 9.193e+7 | 0.009635 | 28 | — |
| 1.082363717355 | -1.641721556654 | 50.73731361 | 225.0811 | 7.4e-8 | B3 2.9e-13 | über den Umkehrpunkt | instabil | 6.025e+6 | 0.01797 | 20 | — |
| 0.998088209369 | 0.274255978634 | 51.02489462 | 923.3909 | 1.2e-10 | B3 2.3e-12 | über den Umkehrpunkt | offen | 3.46 | 2.5e-5 | 80 | nur Klasse von I.A-6 |
| 0.995648141413 | 0.537898797795 | 51.97465085 | 877.0691 | 2.3e-10 | B3 6.9e-13 | über den Umkehrpunkt | offen | 1.42 | 1.0e-4 | 76 | ort: I.A-5 |
| 0.803294553312 | 1.435933350783 | 53.25485430 | 498.1030 | 1.2e-10 | B3 5.6e-12 | über den Umkehrpunkt | stabil | 1.00 | 0.001515 | 44 | — |
| 1.020979451694 | 1.582787020617 | 53.83592581 | 305.0856 | 2.1e-8 | C 1.3e-13 | über den Umkehrpunkt | instabil | 1.653e+6 | 0.08713 | 30 | — |
| 0.985434702937 | 0.853336775772 | 53.99206750 | 783.8376 | 6.2e-10 | B3 2.6e-13 | über den Umkehrpunkt | offen | 1.00 | 3.0e-4 | 68 | ort: I.A-4 |
| 0.971451585290 | 0.974960223559 | 54.74461667 | 736.8941 | 5.8e-11 | B3 1.4e-11 | bestätigt | offen | 1.00 | 4.1e-4 | 64 | ort: I.A-3 |
| 0.222921253036 | 1.924881434536 | 54.95881606 | 266.8944 | 3.5e-10 | C 1.1e-13 | über den Umkehrpunkt | instabil | 4.19e+4 | 0.01707 | 30 | — |
| 0.971213030274 | 1.090122543981 | 56.48538542 | 689.7082 | 5.1e-11 | B3 1.1e-12 | bestätigt | instabil | 1.48 | 0.004814 | 60 | Satellit 3. Ordnung von Fund (0.957991, 1.085275) (T* das 3.00000-fache) |
| 0.689559480207 | 1.600116135122 | 57.19614713 | 448.3695 | 5.0e-6 | C 8.9e-13 | über den Umkehrpunkt | instabil | 1.939e+8 | 0.03229 | 42 | — |
| 0.919293407513 | 1.284811134793 | 57.31648158 | 594.5319 | 1.4e-10 | B3 1.3e-13 | über den Umkehrpunkt | offen | 1.04 | 9.5e-4 | 52 | — |
| 1.225657156107 | 0.590314754255 | 64.04171234 | 877.0119 | 2.9e-9 | B3 2.7e-13 | über den Umkehrpunkt | instabil | 2.61e+3 | 5.2e-4 | 76 | nur Klasse von I.A-5 |
| 1.142483130028 | 0.906864354901 | 64.08430731 | 783.8062 | 7.0e-11 | B3 3.9e-13 | bestätigt | instabil | 51.9 | 8.1e-4 | 68 | nur Klasse von I.A-4 |
| -0.230355562170 | 1.939997525331 | 72.82189025 | 336.6362 | 1.7e-9 | C 9.9e-13 | über den Umkehrpunkt | instabil | 1.046e+5 | 0.01690 | 38 | — |
| 0.972644433304 | 0.960354367678 | 72.82270249 | 990.3666 | 2.9e-10 | C 2.7e-10 | an der Rechengrenze | offen | 1.16 | 2.2e-4 | 86 | nur Klasse von II.B-2 |
| 1.075877288009 | 0.523132618087 | 73.50940370 | 1177.1582 | 4.4e-10 | C 7.5e-10 | an der Rechengrenze | offen | 1.99 | 1.6e-4 | 102 | nur Klasse von I.B-7 |
| 1.138152161823 | 1.675039302735 | 73.65910227 | 265.0642 | 3.8e-7 | B3 1.6e-13 | über den Umkehrpunkt | instabil | 3.623e+8 | 0.01739 | 24 | — |
| 0.951671260318 | 1.124235989776 | 74.57240873 | 895.9294 | 4.2e-10 | C 1.4e-10 | an der Rechengrenze | offen | 1.08 | 3.5e-4 | 78 | — |
| 1.105270184795 | 1.520026907748 | 78.05826462 | 447.2179 | 4.4e-6 | C 1.9e-13 | über den Umkehrpunkt | instabil | 8.191e+8 | 0.09641 | 46 | — |
| 0.962117764473 | 1.726553980806 | 80.85078651 | 346.8110 | 4.1e-7 | C 1.4e-13 | über den Umkehrpunkt | instabil | 4.276e+8 | 0.04992 | 34 | — |
| 0.946937790237 | 0.608579518538 | 84.39666019 | 1430.8131 | 3.2e-9 | B3 5.8e-10 | an der Rechengrenze | offen | 9.04 | 2.4e-5 | 124 | nur Klasse von I.A-10 |
| 0.996287848038 | 0.496223520853 | 86.30351064 | 1477.2471 | 5.1e-10 | B3 4.0e-11 | an der Rechengrenze | offen | 3.31 | 3.1e-5 | 128 | ort: I.A-11 |
| 1.042543735989 | 0.620230683489 | 90.64318368 | 1430.8131 | 2.3e-9 | B3 1.3e-11 | an der Rechengrenze | offen | 1.68 | 7.3e-5 | 124 | nur Klasse von I.A-10 |
| 0.966723500092 | 1.020355857963 | 91.86558479 | 1196.7498 | 2.1e-10 | B3 3.0e-11 | an der Rechengrenze | offen | 2.07 | 1.7e-4 | 104 | — |

## Nachprüfung in erhöhter Genauigkeit (2026-10-21 12:00 UTC)

10 Funde (in keiner Liste und Kandidaten: in double stabil, oder offen mit Indizes unter 30), Festkomma mit 320 Bit, Taylorreihe der Ordnung 40, Ziel 30 Stellen; Gegenprobe mit 448 Bit und Ordnung 52. Rechenzeit zusammen 43 min auf 7 Fäden.

| Urteil | Bahnen |
|---|---|
| belegt (Rest unter 1e-30, beide Rechnungen einig, Korrektur unter 1e-5) | **10** |
| belegt, aber verschoben | 0 |
| offen (Newton kam nicht unter 1e-30) | 0 |
| Zeitlimit | 0 |
| Ausnahmen | 0 |

Stabilität in erhöhter Genauigkeit (10 Bahnen): stabil **6**, an der Grenze 3, instabil 1, Zeitlimit 0, abgebrochen 0.

| a | b | T | Rest | Rest (448 Bit) | Korrektur gegen double | Rest in double | wahrer Rest dort | Schritte | s | Stabilität (double) | Stabilität (genau) | Abstand zur Grenze | Listen | Urteil |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 0.9579908580786195558521 | 1.0852747611757682627827 | 18.5440424074432270087 | 3.2e-33 | 3.2e-33 | 7.8e-11 | 2.9e-11 | 3.1e-11 | 1581 | 22 | offen | stabil | 1.3e-4 | in keiner | belegt |
| 1.1072586831287970056166 | 0.7372181623707510379739 | 39.1757574656811493199 | 2.7e-31 | 2.7e-31 | 5.2e-11 | 1.5e-11 | 5.7e-12 | 4687 | 66 | offen | stabil | 9.3e-5 | in keiner | belegt |
| 0.9980882093181269176792 | 0.2742559786351288380152 | 51.0248946228133458352 | 1.7e-35 | 3.6e-33 | 1.9e-9 | 1.2e-10 | 1.4e-9 | 11360 | 250 | offen | an der Grenze | -3.5e-25 | in keiner | belegt |
| 0.8032945533114989789475 | 1.4359333507830672705345 | 53.2548543044324800706 | 1.8e-34 | 3.8e-34 | 3.4e-12 | 1.2e-10 | 6.9e-12 | 3082 | 47 | stabil | stabil | 1.940 | in keiner | belegt |
| 0.9192934075152116525050 | 1.2848111347947572042103 | 57.3164815791172300232 | 9.2e-36 | 1.0e-34 | 2.5e-10 | 1.4e-10 | 1.5e-10 | 3911 | 70 | offen | instabil | -3.6e-6 | in keiner | belegt |
| 0.9726444333013057598762 | 0.9603543676764217659510 | 72.8227024874420611194 | 1.3e-32 | 1.1e-32 | 1.9e-10 | 2.9e-10 | 3.5e-10 | 7473 | 167 | offen | an der Grenze | -8.6e-20 | in keiner | belegt |
| 1.0758772880014272904977 | 0.5231326180705958215692 | 73.5094036944915833776 | 5.8e-31 | 5.8e-31 | 8.1e-10 | 4.4e-10 | 4.3e-10 | 11837 | 290 | offen | stabil | 2.0e-6 | in keiner | belegt |
| 0.9516712603169405279537 | 1.1242359897750631245232 | 74.5724087259606519630 | 6.3e-34 | 1.7e-33 | 1.3e-10 | 4.2e-10 | 8.9e-11 | 6270 | 139 | offen | stabil | 4.2e-15 | in keiner | belegt |
| 0.9469377902035552632976 | 0.6085795185352241961142 | 84.3966601867633577497 | 1.2e-34 | 5.5e-33 | 2.0e-9 | 3.2e-9 | 6.4e-10 | 13387 | 304 | offen | stabil | 2.3e-7 | in keiner | belegt |
| 0.9667235000657486977390 | 1.0203558579551021289562 | 91.8655847911152634998 | 7.4e-32 | 7.6e-32 | 2.6e-9 | 2.1e-10 | 5.1e-10 | 8924 | 273 | offen | an der Grenze | -3.4e-21 | in keiner | belegt |
