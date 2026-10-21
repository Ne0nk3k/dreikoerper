# Suchlauf euler-m3-4

2026-10-02 23:17 UTC · Euler-Ebene · Massen 1 / 1 / 4 · Fenster v₁ 0.6…1.05, v₂ 0…1.05 · Raster 512×512 · Perioden bis 40 · Suche über Umkehrpunkte (halbe Periode)

## Was der Lauf getan hat

| Stufe | Zahl |
|---|---|
| Rasterpunkte gerechnet | 262144 in 243 s auf 5 Fäden |
| davon durchgelaufen / Zerfall / abgebrochen / ungebunden | 174927 / 82826 / 4391 / 0 |
| Talsohlen (unter 0.3) in 4 Zielen × 6 Zeitbändern | 283059 |
| davon durch die Prüfkette | 40000 in 1459 s |
| Umkehrpunkt verfehlt | 37021 |
| Umkehrpunkt getroffen, aber nach 12τ nicht zurück (nur bis auf eine Drehung periodisch) | 135 |
| geschlossene Bahn | 2844 |
| verschiedene Orte in der Ebene | **94** |
| verschiedene Bahnen (gleiches T* auf acht Stellen einmal gezählt) | **93** |
| — bestätigt (voller Umlauf: Rest < 1e-10 und Gegenprobe < 1e-8) | 16 |
| — über den Umkehrpunkt (halber Umlauf auf 1e-11 getroffen, voller für double zu empfindlich) | 52 |
| — an der Rechengrenze | 26 |
| sicher linear stabil | 0 |
| Ausnahmen im Schwarm | 0 |

Je Ziel (Fixmenge, die nach der halben Periode getroffen wird):

| Ziel | Kandidaten | Umkehrpunkt getroffen | geschlossene Bahn |
|---|---|---|---|
| A3 | 7681 | 583 | 581 |
| B3 | 23208 | 2121 | 2113 |
| C | 8597 | 254 | 145 |
| R | 514 | 21 | 5 |

## Bekannt oder nicht

Von den 94 Funden stehen **17** in einer der geprüften Listen, **77** in keiner. Als verschiedene Bahnen gezählt (eine Bahn kann die Ebene an mehreren Stellen kreuzen): 93, davon **76** in keiner Liste.

| Liste | Stufe | Bahnen | Bedeutung |
|---|---|---|---|
| Li/Liao 2017–2019, Šuvakov/Dmitrašinović 2013 (2364 Bahnen, mit Klassen) | Ort | 16 | steht mit diesen Anfangswerten in der Liste |
| | Lage | 1 | gleiches T* auf acht Stellen: Listenbahn, an anderer Stelle getroffen |
| | Klasse | 7 | Klasse in der Liste, aber anderes T*: weitere Bahn derselben Familie |
| | keine | 70 | Klasse nicht in der Liste |
| Hristov u. a. | — | — | nur für gleiche Massen; hier nicht anwendbar |

**Für die Massen 1 / 1 / 4 gibt es als Vergleich nur Li und Liao: 85 Bahnen, je Klasse eine, davon 7 mit T bis 40.** Die großen Listen von Hristov u. a. gelten nur für gleiche Massen. „In keiner Liste“ sagt in diesem Lauf deshalb wenig: fast alles, was eine Suche bei diesen Massen findet, steht in keiner Liste, weil es kaum eine gibt.

„In keiner Liste“ heißt genau das und nicht „neu“. Die Listen sind in sich begrenzt: Li und Liao führen je Klasse eine Bahn bis T = 200, gefunden auf einem Raster von 4000²; Hristov u. a. führen die Euler-Ebene bis T* = 211 und den freien Fall bis T* = 80 (mit Punktsymmetrie bis 120).

**Satelliten:** 3 der 77 Funde außerhalb der Listen laufen mehrmals fast den Weg einer anderen Bahn dieses Laufs oder der Liste, bevor sie sich schließen (Wort das k-fache, T* das k-fache); bei 3 davon ist die Grundbahn gelistet. Das sind eigene Bahnen, aber keine unerklärten — um eine stabile Bahn herum gibt es solche Begleiter regelmäßig. Sie sind in der Tabelle unten in der Spalte „Listen“ benannt.

## Gegenrichtung: was der Lauf von den Listen wiederfindet

| Liste | Bahnen im Fenster mit T bis 40 | gefunden | Anteil |
|---|---|---|---|
| Li/Liao, 2013 | 6 | 5 | 83 % |

Verpasst aus Li/Liao: II.B-1 (T 33.1).

![Karte](euler-m3-4.png)

Karte: hell = die Bahn kommt bis zur halben Höchstperiode einer Fixmenge nahe. Weißer Ring = Fund, der in einer Liste steht (nur bei bis zu 3000 Funden gezeichnet). Grüner Punkt = Fund, der in keiner Liste steht. Rotes Kreuz = Bahn aus Li/Liao, die der Lauf verpasst hat.

## Funde in keiner Liste (77)

| v₁ | v₂ | T | T* | Rest (voller Umlauf) | Umkehrpunkt | Urteil | Stabilität | \|λ\| | engste Begegnung | Wortlänge | Listen |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 0.410722137268 | 1.531685904798 | 12.89615004 | 132.5739 | 1.1e-12 | C 1.4e-14 | bestätigt | instabil | 1.00e+3 | 0.1034 | 14 | — |
| 0.396227985857 | 1.434862890372 | 14.62879533 | 172.2790 | 2.1e-11 | C 1.3e-14 | bestätigt | instabil | 5.64e+3 | 0.05114 | 18 | — |
| 0.667256918097 | 0.484371453762 | 15.71132562 | 321.4291 | 1.3e-8 | A3 5.2e-12 | über den Umkehrpunkt | instabil | 1.018e+6 | 2.8e-4 | 28 | — |
| 0.681013119839 | 0.521583144632 | 15.93556337 | 320.5424 | 2.5e-8 | A3 9.9e-12 | über den Umkehrpunkt | instabil | 1.906e+6 | 8.1e-4 | 28 | — |
| 0.809859702358 | 0.291483250899 | 15.99666402 | 321.2814 | 3.4e-9 | A3 4.6e-11 | an der Rechengrenze | instabil | 6.93e+4 | 4.7e-4 | 28 | — |
| 0.676994836029 | 0.581692049064 | 16.18117627 | 319.4755 | 1.6e-7 | A3 5.9e-11 | an der Rechengrenze | instabil | 4.112e+6 | 9.4e-4 | 28 | — |
| 0.760916000676 | 0.473721531190 | 16.31183703 | 321.3891 | 1.5e-8 | A3 6.5e-12 | über den Umkehrpunkt | instabil | 5.141e+5 | 0.001555 | 28 | — |
| 0.766434870625 | 0.499893682790 | 16.43526977 | 320.4401 | 1.8e-9 | A3 1.0e-11 | an der Rechengrenze | instabil | 5.906e+5 | 0.001616 | 28 | — |
| 0.655734369491 | 0.948441809615 | 16.55789222 | 274.7557 | 3.8e-7 | R 7.3e-12 | über den Umkehrpunkt | offen | 4.488e+5 | 3.2e-5 | 0 | — |
| 0.805479732772 | 0.155003593811 | 16.64008675 | 341.1495 | 2.9e-7 | A3 1.1e-10 | an der Rechengrenze | instabil | 6.165e+5 | 1.9e-4 | 30 | — |
| 0.762043682367 | 0.286724337896 | 16.64749100 | 342.3170 | 4.9e-7 | A3 1.5e-10 | an der Rechengrenze | instabil | 1.003e+7 | 8.8e-4 | 30 | — |
| 0.374919499664 | 1.386520360051 | 16.70020195 | 209.8819 | 2.8e-11 | C 2.6e-14 | bestätigt | instabil | 1.54e+4 | 0.03837 | 22 | — |
| 0.771909798675 | 0.386697134895 | 16.97739103 | 340.5069 | 3.4e-7 | A3 5.3e-10 | an der Rechengrenze | instabil | 2.796e+6 | 0.001360 | 30 | — |
| 0.187525863877 | 1.429573106031 | 16.98285985 | 212.0284 | 9.6e-9 | C 7.7e-13 | über den Umkehrpunkt | instabil | 7.72e+4 | 0.004045 | 22 | — |
| 0.639102146892 | 0.415748416658 | 17.19953682 | 362.3575 | 1.3e-6 | A3 6.2e-11 | an der Rechengrenze | offen | 5.715e+8 | 5.8e-4 | 32 | — |
| 0.629501564589 | 0.456921917690 | 17.21311514 | 360.1059 | 1.2e-7 | A3 1.7e-11 | an der Rechengrenze | instabil | 1.171e+8 | 3.7e-4 | 32 | — |
| 0.691840538644 | 0.451235018460 | 17.61300478 | 360.0734 | 5.8e-6 | A3 4.8e-10 | an der Rechengrenze | instabil | 8.617e+7 | 7.5e-4 | 32 | — |
| 0.655621455893 | -1.233124358381 | 17.90707752 | 235.6762 | 1.0e-6 | C 1.5e-13 | über den Umkehrpunkt | instabil | 6.011e+8 | 0.007278 | 22 | — |
| 0.623058921065 | 1.292974073229 | 18.69745136 | 235.2779 | 4.8e-6 | C 4.7e-13 | über den Umkehrpunkt | instabil | 1.879e+9 | 8.5e-4 | 22 | — |
| 0.281169880125 | 1.532027526462 | 19.12344064 | 204.9374 | 5.0e-6 | C 5.6e-13 | über den Umkehrpunkt | instabil | 2.406e+9 | 0.03444 | 26 | — |
| 0.643483257762 | 1.132515053347 | 19.12499671 | 277.9233 | 1.7e-7 | C 1.3e-13 | über den Umkehrpunkt | instabil | 8.471e+7 | 0.02101 | 26 | — |
| 0.185172657718 | 1.839090271395 | 19.55759545 | 121.2725 | 5.2e-11 | C 7.8e-14 | bestätigt | instabil | 1.59e+3 | 0.01748 | 14 | — |
| 0.650546117027 | 0.993148667076 | 20.44622252 | 329.9306 | 5.8e-6 | A3 5.5e-10 | an der Rechengrenze | offen | 6.648e+8 | 3.1e-4 | 30 | — |
| 0.636009529571 | 1.090636677885 | 20.96580163 | 316.5682 | 9.1e-8 | C 6.0e-14 | über den Umkehrpunkt | instabil | 1.659e+7 | 0.02612 | 30 | — |
| -0.025227936561 | 1.733315364139 | 23.59742626 | 188.2467 | 1.9e-9 | C 3.5e-13 | über den Umkehrpunkt | instabil | 2.12e+4 | 0.002433 | 22 | — |
| 0.331112887828 | 1.311777164479 | 25.54080186 | 352.5619 | 5.1e-9 | C 9.5e-14 | über den Umkehrpunkt | instabil | 1.068e+5 | 0.02608 | 38 | — |
| 0.544476374056 | 1.525476591195 | 25.54738731 | 249.1523 | 1.5e-7 | C 3.6e-12 | über den Umkehrpunkt | offen | 2.051e+6 | 5.9e-4 | 26 | — |
| 0.210378030726 | -1.550356699658 | 25.55976084 | 271.1659 | 2.8e-6 | C 3.3e-13 | über den Umkehrpunkt | instabil | 1.664e+9 | 0.01299 | 28 | — |
| 0.200658809439 | 1.876435288422 | 28.34015694 | 159.0520 | 7.2e-11 | C 8.3e-14 | bestätigt | instabil | 4.96e+3 | 0.01748 | 18 | — |
| 0.664436435742 | 1.261077174428 | 28.39778446 | 361.5394 | 2.4e-6 | C 5.9e-13 | über den Umkehrpunkt | offen | 1.666e+8 | 4.8e-4 | 32 | — |
| 0.625205212830 | 1.034516168466 | 29.07835452 | 460.7260 | 2.5e-6 | C 1.0e-12 | über den Umkehrpunkt | instabil | 1.331e+10 | 0.03134 | 46 | — |
| 0.611246637324 | 1.554674045002 | 29.43171625 | 263.7201 | 3.0e-8 | C 1.8e-13 | über den Umkehrpunkt | instabil | 1.004e+6 | 0.009755 | 24 | — |
| 0.624336430262 | -1.614849928560 | 30.21659398 | 242.0678 | 5.5e-10 | C 2.5e-12 | über den Umkehrpunkt | instabil | 6.20e+3 | 0.01005 | 22 | — |
| 0.426387706340 | -1.473274028488 | 30.25158703 | 335.3339 | 1.8e-6 | C 2.0e-13 | über den Umkehrpunkt | instabil | 3.729e+8 | 0.01958 | 38 | — |
| 0.759910013408 | 0.983446949142 | 31.43993361 | 483.3771 | 1.0e-10 | B3 8.3e-12 | über den Umkehrpunkt | instabil | 120 | 6.2e-4 | 42 | nur Klasse von I.B-1 |
| 0.805305935614 | 0.823632292499 | 31.92923355 | 530.3063 | 2.7e-10 | A3 2.6e-11 | an der Rechengrenze | instabil | 470 | 2.6e-4 | 46 | nur Klasse von I.B-2 |
| 0.772217303958 | -0.815578658553 | 32.48176699 | 551.7239 | 2.7e-6 | C 7.9e-12 | über den Umkehrpunkt | offen | 6.060e+7 | 2.8e-4 | 48 | — |
| 0.879470011060 | 0.702980367879 | 32.66669687 | 553.7015 | 2.5e-11 | B3 4.6e-13 | bestätigt | offen | 1.18 | 7.2e-4 | 48 | Satellit 2. Ordnung von I.A-2 (T* das 1.99999-fache) |
| 0.216957024949 | 1.370574435518 | 34.44092662 | 457.8408 | 1.5e-7 | C 3.5e-13 | über den Umkehrpunkt | instabil | 2.635e+6 | 0.002473 | 50 | — |
| 0.749202237865 | -1.381604453885 | 34.49458972 | 362.1650 | 9.1e-9 | C 1.2e-13 | über den Umkehrpunkt | instabil | 4.358e+5 | 0.005079 | 32 | — |
| 0.812915209648 | -1.411269921946 | 35.38219515 | 340.1493 | 5.7e-12 | B3 3.9e-12 | bestätigt | instabil | 4.12 | 0.003999 | 30 | — |
| 0.738036801610 | -1.564295519581 | 36.25336882 | 291.3790 | 6.6e-11 | C 1.3e-12 | bestätigt | instabil | 2.96e+3 | 0.01080 | 26 | — |
| 0.730865041980 | 1.368300470728 | 37.15476499 | 401.8177 | 3.9e-7 | C 2.7e-12 | über den Umkehrpunkt | offen | 2.061e+7 | 0.006855 | 36 | — |
| -0.210634652471 | 1.898790417791 | 37.17967490 | 195.6443 | 4.0e-10 | C 2.1e-14 | über den Umkehrpunkt | instabil | 1.18e+4 | 0.01733 | 22 | — |
| 0.914525992855 | -1.309876267089 | 38.46081225 | 388.3692 | 2.6e-11 | C 3.8e-12 | bestätigt | offen | 1.04 | 0.002257 | 34 | — |
| 1.189750480741 | 0.461480215067 | 40.25722288 | 600.1528 | 4.9e-10 | A3 8.4e-12 | über den Umkehrpunkt | offen | 1.21 | 1.3e-4 | 52 | Satellit 2. Ordnung von II.C-1 (T* das 2.00000-fache) |
| 0.741582747445 | 1.593171832124 | 41.19568677 | 313.3616 | 1.2e-7 | C 2.1e-13 | über den Umkehrpunkt | instabil | 7.601e+6 | 0.009954 | 28 | — |
| 1.109970190484 | 1.453013523646 | 41.28422627 | 268.5979 | 3.1e-8 | C 1.2e-13 | über den Umkehrpunkt | instabil | 1.183e+7 | 0.09904 | 26 | — |
| 1.158028871361 | 0.885587457064 | 43.31474255 | 530.3099 | 8.6e-11 | B3 8.3e-12 | bestätigt | instabil | 62.9 | 0.001402 | 46 | nur Klasse von I.B-2 |
| 0.641070950380 | 1.532077816697 | 43.59794688 | 397.2751 | 2.6e-6 | R 6.9e-13 | über den Umkehrpunkt | offen | 1.134e+8 | 0.005782 | 0 | — |
| 0.217660593463 | 1.913888778226 | 46.05590118 | 231.5166 | 4.3e-10 | C 3.4e-14 | über den Umkehrpunkt | instabil | 2.36e+4 | 0.01718 | 26 | — |
| 0.855035595493 | 0.552125394957 | 47.90630014 | 877.0107 | 1.1e-8 | B3 9.2e-12 | über den Umkehrpunkt | offen | 3.00e+3 | 2.1e-5 | 76 | — |
| 0.813596179826 | 0.843504485882 | 47.96162804 | 783.8027 | 7.7e-10 | B3 4.6e-13 | über den Umkehrpunkt | instabil | 18.7 | 1.5e-4 | 68 | nur Klasse von I.A-4 |
| 0.998088209272 | 0.274255978640 | 51.02489462 | 923.3909 | 6.0e-10 | B3 2.5e-12 | über den Umkehrpunkt | offen | 2.75 | 2.5e-5 | 80 | nur Klasse von I.A-6 |
| 0.717591531541 | 1.523497365676 | 51.92569202 | 454.3144 | 7.5e-6 | C 1.9e-11 | an der Rechengrenze | offen | 1.103e+7 | 0.01238 | 42 | — |
| 0.803294553311 | 1.435933350783 | 53.25485430 | 498.1030 | 3.5e-11 | B3 1.0e-12 | bestätigt | offen | 1.01 | 0.001515 | 44 | — |
| 1.020979451694 | -1.582787020617 | 53.83592581 | 305.0856 | 7.6e-9 | C 5.6e-14 | über den Umkehrpunkt | instabil | 1.653e+6 | 0.08713 | 30 | — |
| 0.508535407156 | 1.683908117209 | 54.57582260 | 413.6883 | 3.3e-6 | C 1.3e-12 | über den Umkehrpunkt | instabil | 1.432e+8 | 0.01445 | 42 | — |
| 0.222921253036 | 1.924881434536 | 54.95881606 | 266.8944 | 1.3e-10 | C 3.0e-14 | über den Umkehrpunkt | instabil | 4.19e+4 | 0.01707 | 30 | — |
| 1.178964390574 | -1.388082787552 | 57.07204136 | 377.6977 | 3.3e-6 | C 9.8e-14 | über den Umkehrpunkt | instabil | 2.029e+9 | 0.08754 | 38 | — |
| 0.919293407517 | -1.284811134796 | 57.31648158 | 594.5319 | 1.4e-10 | B3 2.6e-12 | über den Umkehrpunkt | offen | 1.00 | 9.5e-4 | 52 | — |
| 0.681613409807 | 1.159390261017 | 57.49175917 | 800.3247 | 2.3e-6 | C 2.6e-11 | an der Rechengrenze | offen | 3.020e+8 | 0.001087 | 70 | — |
| 0.778358911370 | 1.792539831522 | 58.71080959 | 270.8792 | 8.1e-8 | C 5.0e-13 | über den Umkehrpunkt | instabil | 2.540e+6 | 0.01717 | 26 | — |
| 1.053974688143 | -1.559694632916 | 60.06550266 | 341.3776 | 1.3e-7 | C 1.8e-13 | über den Umkehrpunkt | instabil | 1.898e+7 | 0.09417 | 34 | — |
| 0.757181145065 | 1.023381672826 | 63.08517649 | 943.2100 | 1.3e-10 | C 2.3e-11 | an der Rechengrenze | instabil | 24.4 | 0.001470 | 82 | — |
| 0.227034534779 | 1.933303265036 | 63.88221207 | 301.9069 | 3.9e-9 | C 5.4e-14 | über den Umkehrpunkt | instabil | 6.83e+4 | 0.01697 | 34 | — |
| 0.289763404612 | 1.249954011424 | 64.77725817 | 959.2906 | 2.8e-7 | C 4.4e-13 | über den Umkehrpunkt | instabil | 1.239e+8 | 0.01969 | 110 | — |
| 1.197365723283 | -1.368887937515 | 67.27409918 | 447.8288 | 1.6e-6 | C 2.8e-13 | über den Umkehrpunkt | instabil | 8.309e+9 | 0.07946 | 46 | — |
| 0.829067522547 | 1.376455139325 | 70.78082882 | 704.4801 | 4.1e-9 | C 2.8e-11 | an der Rechengrenze | instabil | 321 | 0.001060 | 62 | — |
| 1.092754704022 | 1.530157625798 | 72.13617376 | 412.3040 | 2.5e-6 | C 2.1e-13 | über den Umkehrpunkt | instabil | 3.515e+8 | 0.1009 | 42 | — |
| 0.972644433305 | 0.960354367678 | 72.82270249 | 990.3666 | 3.8e-10 | C 5.0e-11 | an der Rechengrenze | offen | 1.00 | 2.2e-4 | 86 | nur Klasse von II.B-2 |
| 0.957159207659 | 1.043079782870 | 73.25223283 | 943.2434 | 5.5e-10 | C 2.1e-10 | an der Rechengrenze | offen | 1.39 | 3.2e-4 | 82 | — |
| 0.963651198902 | 1.045107782535 | 73.75626270 | 943.2434 | 1.4e-10 | C 7.5e-10 | an der Rechengrenze | offen | 1.36 | 2.8e-4 | 82 | — |
| 0.772474203249 | 0.943829665120 | 79.24025308 | 1243.6909 | 6.0e-6 | B3 5.9e-11 | an der Rechengrenze | offen | 5.559e+6 | 1.8e-4 | 108 | nur Klasse von II.A-1 |
| 0.860698111202 | 0.507767204973 | 79.72488572 | 1477.1764 | 3.3e-9 | B3 5.9e-11 | an der Rechengrenze | offen | 5.07e+3 | 6.1e-5 | 128 | — |
| 0.846829288672 | 0.708053581435 | 80.31379397 | 1384.2180 | 8.8e-10 | B3 3.1e-12 | über den Umkehrpunkt | offen | 1.07 | 4.4e-4 | 120 | Satellit 5. Ordnung von I.A-2 (T* das 4.99984-fache) |
| 1.003119685979 | 1.707283663642 | 90.41193674 | 383.0714 | 8.2e-7 | C 2.1e-13 | über den Umkehrpunkt | instabil | 3.652e+8 | 0.05779 | 38 | — |


## Sicher linear stabile Funde (0)

| v₁ | v₂ | T | T* | Rest (voller Umlauf) | Umkehrpunkt | Urteil | Stabilität | \|λ\| | engste Begegnung | Wortlänge | Listen |
|---|---|---|---|---|---|---|---|---|---|---|---|

## Alle Funde (94)

| v₁ | v₂ | T | T* | Rest (voller Umlauf) | Umkehrpunkt | Urteil | Stabilität | \|λ\| | engste Begegnung | Wortlänge | Listen |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 0.410722137268 | 1.531685904798 | 12.89615004 | 132.5739 | 1.1e-12 | C 1.4e-14 | bestätigt | instabil | 1.00e+3 | 0.1034 | 14 | — |
| 0.396227985857 | 1.434862890372 | 14.62879533 | 172.2790 | 2.1e-11 | C 1.3e-14 | bestätigt | instabil | 5.64e+3 | 0.05114 | 18 | — |
| 0.667256918097 | 0.484371453762 | 15.71132562 | 321.4291 | 1.3e-8 | A3 5.2e-12 | über den Umkehrpunkt | instabil | 1.018e+6 | 2.8e-4 | 28 | — |
| 0.681013119839 | 0.521583144632 | 15.93556337 | 320.5424 | 2.5e-8 | A3 9.9e-12 | über den Umkehrpunkt | instabil | 1.906e+6 | 8.1e-4 | 28 | — |
| 0.871183875295 | 0.436245498572 | 15.94195557 | 300.0764 | 1.6e-10 | A3 3.5e-13 | über den Umkehrpunkt | offen | 1.00 | 1.1e-4 | 26 | ort: II.C-1 |
| 0.809859702358 | 0.291483250899 | 15.99666402 | 321.2814 | 3.4e-9 | A3 4.6e-11 | an der Rechengrenze | instabil | 6.93e+4 | 4.7e-4 | 28 | — |
| 0.676994836029 | 0.581692049064 | 16.18117627 | 319.4755 | 1.6e-7 | A3 5.9e-11 | an der Rechengrenze | instabil | 4.112e+6 | 9.4e-4 | 28 | — |
| 0.760916000676 | 0.473721531190 | 16.31183703 | 321.3891 | 1.5e-8 | A3 6.5e-12 | über den Umkehrpunkt | instabil | 5.141e+5 | 0.001555 | 28 | — |
| 0.688654648354 | 1.577157388978 | 16.32395946 | 133.4174 | 9.2e-13 | A3 7.7e-13 | bestätigt | instabil | 24.1 | 0.03391 | 12 | ort: I.A-1 |
| 0.766434870625 | 0.499893682790 | 16.43526977 | 320.4401 | 1.8e-9 | A3 1.0e-11 | an der Rechengrenze | instabil | 5.906e+5 | 0.001616 | 28 | — |
| 0.655734369491 | 0.948441809615 | 16.55789222 | 274.7557 | 3.8e-7 | R 7.3e-12 | über den Umkehrpunkt | offen | 4.488e+5 | 3.2e-5 | 0 | — |
| 0.805479732772 | 0.155003593811 | 16.64008675 | 341.1495 | 2.9e-7 | A3 1.1e-10 | an der Rechengrenze | instabil | 6.165e+5 | 1.9e-4 | 30 | — |
| 0.762043682367 | 0.286724337896 | 16.64749100 | 342.3170 | 4.9e-7 | A3 1.5e-10 | an der Rechengrenze | instabil | 1.003e+7 | 8.8e-4 | 30 | — |
| 0.374919499664 | 1.386520360051 | 16.70020195 | 209.8819 | 2.8e-11 | C 2.6e-14 | bestätigt | instabil | 1.54e+4 | 0.03837 | 22 | — |
| 0.771909798675 | 0.386697134895 | 16.97739103 | 340.5069 | 3.4e-7 | A3 5.3e-10 | an der Rechengrenze | instabil | 2.796e+6 | 0.001360 | 30 | — |
| 0.187525863877 | 1.429573106031 | 16.98285985 | 212.0284 | 9.6e-9 | C 7.7e-13 | über den Umkehrpunkt | instabil | 7.72e+4 | 0.004045 | 22 | — |
| 0.639102146892 | 0.415748416658 | 17.19953682 | 362.3575 | 1.3e-6 | A3 6.2e-11 | an der Rechengrenze | offen | 5.715e+8 | 5.8e-4 | 32 | — |
| 0.629501564589 | 0.456921917690 | 17.21311514 | 360.1059 | 1.2e-7 | A3 1.7e-11 | an der Rechengrenze | instabil | 1.171e+8 | 3.7e-4 | 32 | — |
| 0.691840538644 | 0.451235018460 | 17.61300478 | 360.0734 | 5.8e-6 | A3 4.8e-10 | an der Rechengrenze | instabil | 8.617e+7 | 7.5e-4 | 32 | — |
| 0.991198121730 | 0.711947212488 | 17.65078078 | 276.8523 | 3.0e-11 | B3 9.2e-15 | bestätigt | offen | 1.00 | 0.001702 | 24 | ort: I.A-2 |
| 0.655621455893 | -1.233124358381 | 17.90707752 | 235.6762 | 1.0e-6 | C 1.5e-13 | über den Umkehrpunkt | instabil | 6.011e+8 | 0.007278 | 22 | — |
| 0.623058921065 | 1.292974073229 | 18.69745136 | 235.2779 | 4.8e-6 | C 4.7e-13 | über den Umkehrpunkt | instabil | 1.879e+9 | 8.5e-4 | 22 | — |
| 0.281169880125 | 1.532027526462 | 19.12344064 | 204.9374 | 5.0e-6 | C 5.6e-13 | über den Umkehrpunkt | instabil | 2.406e+9 | 0.03444 | 26 | — |
| 0.643483257762 | 1.132515053347 | 19.12499671 | 277.9233 | 1.7e-7 | C 1.3e-13 | über den Umkehrpunkt | instabil | 8.471e+7 | 0.02101 | 26 | — |
| 0.185172657718 | 1.839090271395 | 19.55759545 | 121.2725 | 5.2e-11 | C 7.8e-14 | bestätigt | instabil | 1.59e+3 | 0.01748 | 14 | — |
| 0.650546117027 | 0.993148667076 | 20.44622252 | 329.9306 | 5.8e-6 | A3 5.5e-10 | an der Rechengrenze | offen | 6.648e+8 | 3.1e-4 | 30 | — |
| 0.636009529571 | 1.090636677885 | 20.96580163 | 316.5682 | 9.1e-8 | C 6.0e-14 | über den Umkehrpunkt | instabil | 1.659e+7 | 0.02612 | 30 | — |
| -0.025227936561 | 1.733315364139 | 23.59742626 | 188.2467 | 1.9e-9 | C 3.5e-13 | über den Umkehrpunkt | instabil | 2.12e+4 | 0.002433 | 22 | — |
| 0.331112887828 | 1.311777164479 | 25.54080186 | 352.5619 | 5.1e-9 | C 9.5e-14 | über den Umkehrpunkt | instabil | 1.068e+5 | 0.02608 | 38 | — |
| 0.544476374056 | 1.525476591195 | 25.54738731 | 249.1523 | 1.5e-7 | C 3.6e-12 | über den Umkehrpunkt | offen | 2.051e+6 | 5.9e-4 | 26 | — |
| 0.210378030726 | -1.550356699658 | 25.55976084 | 271.1659 | 2.8e-6 | C 3.3e-13 | über den Umkehrpunkt | instabil | 1.664e+9 | 0.01299 | 28 | — |
| 0.200658809439 | 1.876435288422 | 28.34015694 | 159.0520 | 7.2e-11 | C 8.3e-14 | bestätigt | instabil | 4.96e+3 | 0.01748 | 18 | — |
| 0.664436435742 | 1.261077174428 | 28.39778446 | 361.5394 | 2.4e-6 | C 5.9e-13 | über den Umkehrpunkt | offen | 1.666e+8 | 4.8e-4 | 32 | — |
| 0.625205212830 | 1.034516168466 | 29.07835452 | 460.7260 | 2.5e-6 | C 1.0e-12 | über den Umkehrpunkt | instabil | 1.331e+10 | 0.03134 | 46 | — |
| 0.611246637324 | 1.554674045002 | 29.43171625 | 263.7201 | 3.0e-8 | C 1.8e-13 | über den Umkehrpunkt | instabil | 1.004e+6 | 0.009755 | 24 | — |
| 0.624336430262 | -1.614849928560 | 30.21659398 | 242.0678 | 5.5e-10 | C 2.5e-12 | über den Umkehrpunkt | instabil | 6.20e+3 | 0.01005 | 22 | — |
| 0.426387706340 | -1.473274028488 | 30.25158703 | 335.3339 | 1.8e-6 | C 2.0e-13 | über den Umkehrpunkt | instabil | 3.729e+8 | 0.01958 | 38 | — |
| 0.759910013408 | 0.983446949142 | 31.43993361 | 483.3771 | 1.0e-10 | B3 8.3e-12 | über den Umkehrpunkt | instabil | 120 | 6.2e-4 | 42 | nur Klasse von I.B-1 |
| 0.805305935614 | 0.823632292499 | 31.92923355 | 530.3063 | 2.7e-10 | A3 2.6e-11 | an der Rechengrenze | instabil | 470 | 2.6e-4 | 46 | nur Klasse von I.B-2 |
| 0.772217303958 | -0.815578658553 | 32.48176699 | 551.7239 | 2.7e-6 | C 7.9e-12 | über den Umkehrpunkt | offen | 6.060e+7 | 2.8e-4 | 48 | — |
| 0.879470011060 | 0.702980367879 | 32.66669687 | 553.7015 | 2.5e-11 | B3 4.6e-13 | bestätigt | offen | 1.18 | 7.2e-4 | 48 | Satellit 2. Ordnung von I.A-2 (T* das 1.99999-fache) |
| 0.216957024949 | 1.370574435518 | 34.44092662 | 457.8408 | 1.5e-7 | C 3.5e-13 | über den Umkehrpunkt | instabil | 2.635e+6 | 0.002473 | 50 | — |
| 0.749202237865 | -1.381604453885 | 34.49458972 | 362.1650 | 9.1e-9 | C 1.2e-13 | über den Umkehrpunkt | instabil | 4.358e+5 | 0.005079 | 32 | — |
| 0.994734060473 | 0.586002268729 | 34.81124126 | 576.9730 | 4.7e-11 | B3 1.1e-12 | bestätigt | offen | 1.00 | 2.7e-4 | 50 | ort: I.B-3 |
| 1.041299219518 | 0.152526504678 | 34.85288072 | 623.2955 | 3.5e-10 | A3 6.8e-10 | an der Rechengrenze | offen | 3.71 | 1.1e-5 | 54 | lage: II.B-1 |
| 0.812915209648 | -1.411269921946 | 35.38219515 | 340.1493 | 5.7e-12 | B3 3.9e-12 | bestätigt | instabil | 4.12 | 0.003999 | 30 | — |
| 0.986675456626 | 0.819978013576 | 35.80701113 | 530.3585 | 7.9e-11 | A3 6.1e-13 | bestätigt | offen | 1.01 | 6.0e-4 | 46 | ort: I.B-2 |
| 0.738036801610 | -1.564295519581 | 36.25336882 | 291.3790 | 6.6e-11 | C 1.3e-12 | bestätigt | instabil | 2.96e+3 | 0.01080 | 26 | — |
| 0.968621238726 | 1.003553839845 | 36.65531909 | 483.4141 | 1.4e-11 | B3 3.6e-13 | bestätigt | offen | 1.00 | 0.001009 | 42 | ort: I.B-1 |
| 0.730865041980 | 1.368300470728 | 37.15476499 | 401.8177 | 3.9e-7 | C 2.7e-12 | über den Umkehrpunkt | offen | 2.061e+7 | 0.006855 | 36 | — |
| -0.210634652471 | 1.898790417791 | 37.17967490 | 195.6443 | 4.0e-10 | C 2.1e-14 | über den Umkehrpunkt | instabil | 1.18e+4 | 0.01733 | 22 | — |
| 0.914525992855 | -1.309876267089 | 38.46081225 | 388.3692 | 2.6e-11 | C 3.8e-12 | bestätigt | offen | 1.04 | 0.002257 | 34 | — |
| 1.189750480741 | 0.461480215067 | 40.25722288 | 600.1528 | 4.9e-10 | A3 8.4e-12 | über den Umkehrpunkt | offen | 1.21 | 1.3e-4 | 52 | Satellit 2. Ordnung von II.C-1 (T* das 2.00000-fache) |
| 0.741582747445 | 1.593171832124 | 41.19568677 | 313.3616 | 1.2e-7 | C 2.1e-13 | über den Umkehrpunkt | instabil | 7.601e+6 | 0.009954 | 28 | — |
| 1.109970190484 | 1.453013523646 | 41.28422627 | 268.5979 | 3.1e-8 | C 1.2e-13 | über den Umkehrpunkt | instabil | 1.183e+7 | 0.09904 | 26 | — |
| 1.158028871361 | 0.885587457064 | 43.31474255 | 530.3099 | 8.6e-11 | B3 8.3e-12 | bestätigt | instabil | 62.9 | 0.001402 | 46 | nur Klasse von I.B-2 |
| 0.641070950380 | 1.532077816697 | 43.59794688 | 397.2751 | 2.6e-6 | R 6.9e-13 | über den Umkehrpunkt | offen | 1.134e+8 | 0.005782 | 0 | — |
| 0.217660593463 | 1.913888778226 | 46.05590118 | 231.5166 | 4.3e-10 | C 3.4e-14 | über den Umkehrpunkt | instabil | 2.36e+4 | 0.01718 | 26 | — |
| 0.855035595493 | 0.552125394957 | 47.90630014 | 877.0107 | 1.1e-8 | B3 9.2e-12 | über den Umkehrpunkt | offen | 3.00e+3 | 2.1e-5 | 76 | — |
| 0.813596179826 | 0.843504485882 | 47.96162804 | 783.8027 | 7.7e-10 | B3 4.6e-13 | über den Umkehrpunkt | instabil | 18.7 | 1.5e-4 | 68 | nur Klasse von I.A-4 |
| 0.908140601834 | 0.279347088785 | 48.33942180 | 923.3875 | 4.4e-10 | B3 1.1e-12 | über den Umkehrpunkt | offen | 2.06 | 9.0e-5 | 80 | ort: I.A-6 |
| 0.998088209272 | 0.274255978640 | 51.02489462 | 923.3909 | 6.0e-10 | B3 2.5e-12 | über den Umkehrpunkt | offen | 2.75 | 2.5e-5 | 80 | nur Klasse von I.A-6 |
| 0.717591531541 | 1.523497365676 | 51.92569202 | 454.3144 | 7.5e-6 | C 1.9e-11 | an der Rechengrenze | offen | 1.103e+7 | 0.01238 | 42 | — |
| 0.995648141410 | 0.537898797795 | 51.97465085 | 877.0691 | 4.4e-10 | B3 3.4e-13 | über den Umkehrpunkt | offen | 1.26 | 1.0e-4 | 76 | ort: I.A-5 |
| 0.803294553311 | 1.435933350783 | 53.25485430 | 498.1030 | 3.5e-11 | B3 1.0e-12 | bestätigt | offen | 1.01 | 0.001515 | 44 | — |
| 1.020979451694 | -1.582787020617 | 53.83592581 | 305.0856 | 7.6e-9 | C 5.6e-14 | über den Umkehrpunkt | instabil | 1.653e+6 | 0.08713 | 30 | — |
| 0.985434702939 | 0.853336775773 | 53.99206750 | 783.8376 | 2.5e-10 | B3 2.5e-13 | über den Umkehrpunkt | offen | 1.00 | 3.0e-4 | 68 | ort: I.A-4 |
| 0.508535407156 | 1.683908117209 | 54.57582260 | 413.6883 | 3.3e-6 | C 1.3e-12 | über den Umkehrpunkt | instabil | 1.432e+8 | 0.01445 | 42 | — |
| 0.971451585288 | 0.974960223558 | 54.74461667 | 736.8941 | 1.0e-10 | B3 3.1e-13 | über den Umkehrpunkt | offen | 1.00 | 4.1e-4 | 64 | ort: I.A-3 |
| 0.222921253036 | 1.924881434536 | 54.95881606 | 266.8944 | 1.3e-10 | C 3.0e-14 | über den Umkehrpunkt | instabil | 4.19e+4 | 0.01707 | 30 | — |
| 1.178964390574 | -1.388082787552 | 57.07204136 | 377.6977 | 3.3e-6 | C 9.8e-14 | über den Umkehrpunkt | instabil | 2.029e+9 | 0.08754 | 38 | — |
| 0.919293407517 | -1.284811134796 | 57.31648158 | 594.5319 | 1.4e-10 | B3 2.6e-12 | über den Umkehrpunkt | offen | 1.00 | 9.5e-4 | 52 | — |
| 0.681613409807 | 1.159390261017 | 57.49175917 | 800.3247 | 2.3e-6 | C 2.6e-11 | an der Rechengrenze | offen | 3.020e+8 | 0.001087 | 70 | — |
| 0.778358911370 | 1.792539831522 | 58.71080959 | 270.8792 | 8.1e-8 | C 5.0e-13 | über den Umkehrpunkt | instabil | 2.540e+6 | 0.01717 | 26 | — |
| 1.053974688143 | -1.559694632916 | 60.06550266 | 341.3776 | 1.3e-7 | C 1.8e-13 | über den Umkehrpunkt | instabil | 1.898e+7 | 0.09417 | 34 | — |
| 0.757181145065 | 1.023381672826 | 63.08517649 | 943.2100 | 1.3e-10 | C 2.3e-11 | an der Rechengrenze | instabil | 24.4 | 0.001470 | 82 | — |
| 0.227034534779 | 1.933303265036 | 63.88221207 | 301.9069 | 3.9e-9 | C 5.4e-14 | über den Umkehrpunkt | instabil | 6.83e+4 | 0.01697 | 34 | — |
| 0.289763404612 | 1.249954011424 | 64.77725817 | 959.2906 | 2.8e-7 | C 4.4e-13 | über den Umkehrpunkt | instabil | 1.239e+8 | 0.01969 | 110 | — |
| 1.197365723283 | -1.368887937515 | 67.27409918 | 447.8288 | 1.6e-6 | C 2.8e-13 | über den Umkehrpunkt | instabil | 8.309e+9 | 0.07946 | 46 | — |
| 0.993116220263 | 0.651838366744 | 70.11068149 | 1130.6963 | 3.1e-10 | C 2.4e-10 | an der Rechengrenze | offen | 1.75 | 8.7e-5 | 98 | ort: I.B-6 |
| 0.829067522547 | 1.376455139325 | 70.78082882 | 704.4801 | 4.1e-9 | C 2.8e-11 | an der Rechengrenze | instabil | 321 | 0.001060 | 62 | — |
| 0.989003190481 | 0.767683737752 | 71.10117869 | 1084.0830 | 1.0e-9 | C 1.6e-11 | an der Rechengrenze | offen | 1.36 | 1.3e-4 | 94 | ort: I.B-5 |
| 1.092754704022 | 1.530157625798 | 72.13617376 | 412.3040 | 2.5e-6 | C 2.1e-13 | über den Umkehrpunkt | instabil | 3.515e+8 | 0.1009 | 42 | — |
| 0.985402887356 | 0.869735726024 | 72.22012632 | 1037.3097 | 1.1e-10 | C 9.6e-10 | an der Rechengrenze | offen | 1.00 | 1.8e-4 | 90 | ort: I.B-4 |
| 0.972644433305 | 0.960354367678 | 72.82270249 | 990.3666 | 3.8e-10 | C 5.0e-11 | an der Rechengrenze | offen | 1.00 | 2.2e-4 | 86 | nur Klasse von II.B-2 |
| 0.957159207659 | 1.043079782870 | 73.25223283 | 943.2434 | 5.5e-10 | C 2.1e-10 | an der Rechengrenze | offen | 1.39 | 3.2e-4 | 82 | — |
| 0.963651198902 | 1.045107782535 | 73.75626270 | 943.2434 | 1.4e-10 | C 7.5e-10 | an der Rechengrenze | offen | 1.36 | 2.8e-4 | 82 | — |
| 0.772474203249 | 0.943829665120 | 79.24025308 | 1243.6909 | 6.0e-6 | B3 5.9e-11 | an der Rechengrenze | offen | 5.559e+6 | 1.8e-4 | 108 | nur Klasse von II.A-1 |
| 0.782051735294 | 0.998533160026 | 79.68785547 | 1196.7295 | 1.6e-10 | B3 4.0e-12 | über den Umkehrpunkt | offen | 1.29 | 2.2e-4 | 104 | ort: I.A-7 |
| 0.860698111202 | 0.507767204973 | 79.72488572 | 1477.1764 | 3.3e-9 | B3 5.9e-11 | an der Rechengrenze | offen | 5.07e+3 | 6.1e-5 | 128 | — |
| 0.889338396731 | 0.349855032321 | 80.02424744 | 1523.5529 | 2.2e-9 | B3 3.6e-11 | an der Rechengrenze | offen | 6.57 | 3.1e-5 | 132 | ort: I.A-12 |
| 0.846829288672 | 0.708053581435 | 80.31379397 | 1384.2180 | 8.8e-10 | B3 3.1e-12 | über den Umkehrpunkt | offen | 1.07 | 4.4e-4 | 120 | Satellit 5. Ordnung von I.A-2 (T* das 4.99984-fache) |
| 0.830327677160 | 0.861945349088 | 80.63815424 | 1290.7607 | 1.1e-9 | B3 5.3e-10 | an der Rechengrenze | offen | 2.36 | 6.8e-5 | 112 | ort: I.A-8 |
| 1.003119685979 | 1.707283663642 | 90.41193674 | 383.0714 | 8.2e-7 | C 2.1e-13 | über den Umkehrpunkt | instabil | 3.652e+8 | 0.05779 | 38 | — |

## Nachprüfung in erhöhter Genauigkeit (2026-10-02 23:49 UTC)

9 Funde (in keiner Liste und Kandidaten: in double stabil, oder offen mit Indizes unter 30), Festkomma mit 320 Bit, Taylorreihe der Ordnung 40, Ziel 30 Stellen; Gegenprobe mit 448 Bit und Ordnung 52. Rechenzeit zusammen 32 min auf 5 Fäden.

| Urteil | Bahnen |
|---|---|
| belegt (Rest unter 1e-30, beide Rechnungen einig, Korrektur unter 1e-5) | **9** |
| belegt, aber verschoben | 0 |
| offen (Newton kam nicht unter 1e-30) | 0 |
| Zeitlimit | 0 |
| Ausnahmen | 0 |

Stabilität in erhöhter Genauigkeit (9 Bahnen): stabil **2**, an der Grenze 2, instabil 5, Zeitlimit 0, abgebrochen 0.

| a | b | T | Rest | Rest (448 Bit) | Korrektur gegen double | Rest in double | wahrer Rest dort | Schritte | s | Stabilität (double) | Stabilität (genau) | Abstand zur Grenze | Listen | Urteil |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 0.8794700110601072502657 | 0.7029803678785188401202 | 32.6666968661210937543 | 5.2e-31 | 5.2e-31 | 3.4e-12 | 2.5e-11 | 3.8e-11 | 4696 | 67 | offen | stabil | 9.3e-5 | in keiner | belegt |
| 0.9145259928554456066739 | -1.309876267088851416846 | 38.4608122547624527611 | 6.6e-35 | 1.6e-34 | 9.8e-13 | 2.6e-11 | 6.0e-12 | 2518 | 34 | offen | instabil | -9.8e-4 | in keiner | belegt |
| 1.1897504807499632383957 | 0.4614802150693959497414 | 40.2572228774714358616 | 5.8e-32 | 5.8e-32 | 3.8e-10 | 4.9e-10 | 2.7e-10 | 6317 | 150 | offen | instabil | -9.5e-5 | in keiner | belegt |
| 0.9980882093181269176792 | 0.2742559786351288380152 | 51.0248946228133458352 | 1.5e-35 | 7.6e-33 | 1.6e-9 | 6.0e-10 | 1.0e-9 | 11889 | 224 | offen | an der Grenze | -3.5e-25 | in keiner | belegt |
| 0.8032945533114989789475 | 1.4359333507830672705345 | 53.2548543044324800706 | 2.8e-34 | 4.4e-34 | 1.8e-12 | 3.5e-11 | 1.6e-11 | 3084 | 42 | offen | stabil | 1.940 | in keiner | belegt |
| 0.9192934075152116525050 | -1.284811134794757204210 | 57.3164815791172300232 | 2.5e-31 | 2.5e-31 | 1.9e-10 | 1.4e-10 | 1.3e-10 | 3908 | 54 | offen | instabil | -3.6e-6 | in keiner | belegt |
| 0.9726444333013057598762 | 0.9603543676764217659510 | 72.8227024874420611194 | 8.4e-31 | 8.4e-31 | 1.8e-10 | 3.8e-10 | 6.0e-10 | 7446 | 133 | offen | an der Grenze | -8.6e-20 | in keiner | belegt |
| 0.9571592076938805899522 | 1.0430797828811417066789 | 73.2522328365442678439 | 8.8e-32 | 8.8e-32 | 2.7e-9 | 5.5e-10 | 2.1e-10 | 6862 | 194 | offen | instabil | -0.04856 | in keiner | belegt |
| 0.8468292886716816557354 | 0.7080535814345258303353 | 80.3137939730804965143 | 1.1e-31 | 1.1e-31 | 2.3e-11 | 8.8e-10 | 2.0e-10 | 11662 | 185 | offen | instabil | -0.01807 | in keiner | belegt |
