# Suchlauf probe-1024

2026-10-02 17:39 UTC · Euler-Ebene · Massen 1 / 1 / 1 · Fenster v₁ 0…0.75, v₂ 0…0.75 · Raster 1024×1024 · Perioden bis 30 · Suche über den Wiederkehrabstand (ganze Periode)

## Was der Lauf getan hat

| Stufe | Zahl |
|---|---|
| Rasterpunkte gerechnet | 1048576 in 192 s auf 11 Fäden |
| davon durchgelaufen / Zerfall / abgebrochen / ungebunden | 891453 / 106338 / 7538 / 43247 |
| Talsohlen (unter 1) in undefined Zeitbändern | 11923 |
| davon durch die Prüfkette | 11923 in 658 s |
| geschlossene Bahn | 895 |
| verschiedene Orte in der Ebene | **86** |
| verschiedene Bahnen (gleiches T* auf acht Stellen einmal gezählt) | **74** |
| — bestätigt (voller Umlauf: Rest < 1e-10 und Gegenprobe < 1e-8) | 80 |
| — an der Rechengrenze | 6 |
| sicher linear stabil | 6 |
| Ausnahmen im Schwarm | 0 |

## Bekannt oder nicht

Von den 86 Funden stehen **86** in einer der geprüften Listen, **0** in keiner. Als verschiedene Bahnen gezählt (eine Bahn kann die Ebene an mehreren Stellen kreuzen): 74, davon **0** in keiner Liste.

| Liste | Stufe | Bahnen | Bedeutung |
|---|---|---|---|
| Li/Liao 2017–2019, Šuvakov/Dmitrašinović 2013 (2364 Bahnen, mit Klassen) | Ort | 27 | steht mit diesen Anfangswerten in der Liste |
| | Lage | 9 | gleiches T* auf acht Stellen: Listenbahn, an anderer Stelle getroffen |
| | Klasse | 22 | Klasse in der Liste, aber anderes T*: weitere Bahn derselben Familie |
| | keine | 28 | Klasse nicht in der Liste |
| Hristov u. a. (441985 Anfangswerte, gleiche Massen) | Ort | 86 | steht mit diesen Anfangswerten in der Liste |
| | Lage | 0 | gleiches T* auf acht Stellen: Listenbahn, an anderer Stelle getroffen |
| | keine | 0 | weder Ort noch T* in der Liste |

Trennschärfe: die 86 Ortstreffer liegen im Median 4.1e-14 und höchstens 2.8e-12 vom Listenwert (Schwelle 1e-6), ihr T* weicht höchstens 1.6e-11 ab.

„In keiner Liste“ heißt genau das und nicht „neu“. Die Listen sind in sich begrenzt: Li und Liao führen je Klasse eine Bahn bis T = 200, gefunden auf einem Raster von 4000²; Hristov u. a. führen die Euler-Ebene bis T* = 211 und den freien Fall bis T* = 80 (mit Punktsymmetrie bis 120).

## Gegenrichtung: was der Lauf von den Listen wiederfindet

| Liste | Bahnen im Fenster mit T bis 30 | gefunden | Anteil |
|---|---|---|---|
| Li/Liao, 2013 | 0 | 0 | — |
| Hristov u. a. | 0 | 0 | — |

![Karte](probe-1024.png)

Karte: hell = kleiner Wiederkehrabstand. Weißer Ring = Fund, der in einer Liste steht (nur bei bis zu 3000 Funden gezeichnet). Grüner Punkt = Fund, der in keiner Liste steht. Rotes Kreuz = Bahn aus Li/Liao, die der Lauf verpasst hat.

## Funde in keiner Liste (0)

| v₁ | v₂ | T | T* | Rest (voller Umlauf) | Umkehrpunkt | Urteil | Stabilität | \|λ\| | engste Begegnung | Wortlänge | Listen |
|---|---|---|---|---|---|---|---|---|---|---|---|


## Sicher linear stabile Funde (6)

| v₁ | v₂ | T | T* | Rest (voller Umlauf) | Umkehrpunkt | Urteil | Stabilität | \|λ\| | engste Begegnung | Wortlänge | Listen |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 0.347116888119 | 0.532724945388 | 6.32591398 | 9.2377 | 1.8e-15 | — | bestätigt | stabil | 1.00 | 0.6905 | 4 | ort: Acht |
| 0.405915567135 | 0.230163125980 | 13.86712344 | 34.8022 | 1.4e-13 | — | bestätigt | stabil | 1.00 | 0.008337 | 14 | ort: Schmetterling III |
| 0.464445172818 | 0.396060014653 | 14.89430518 | 24.2056 | 2.6e-14 | — | bestätigt | stabil | 1.00 | 0.07947 | 10 | ort: Motte I |
| 0.411292690948 | 0.260755101360 | 20.74906501 | 49.6301 | 3.3e-13 | — | bestätigt | stabil | 1.00 | 0.005486 | 20 | ort: I.A-5 |
| 0.439165917888 | 0.452967643191 | 28.66927092 | 42.7821 | 1.5e-12 | — | bestätigt | stabil | 1.00 | 0.04970 | 18 | ort: Motte II |
| 0.409494591304 | 0.362823165469 | 33.86775072 | 68.6734 | 1.4e-11 | — | bestätigt | stabil | 1.00 | 0.005905 | 28 | ort: I.A-8 |

## Alle Funde (86)

| v₁ | v₂ | T | T* | Rest (voller Umlauf) | Umkehrpunkt | Urteil | Stabilität | \|λ\| | engste Begegnung | Wortlänge | Listen |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 0.306893420464 | 0.125506567015 | 6.23467484 | 19.9325 | 3.4e-14 | — | bestätigt | instabil | 1.78 | 0.01102 | 8 | ort: Schmetterling I |
| 0.339407411991 | 0.536184978151 | 6.29081877 | 9.2377 | 3.1e-15 | — | bestätigt | instabil | 1.10 | 0.6583 | 4 | Hristov: ort |
| 0.347116888119 | 0.532724945388 | 6.32591398 | 9.2377 | 1.8e-15 | — | bestätigt | stabil | 1.00 | 0.6905 | 4 | ort: Acht |
| 0.392955493698 | 0.097578968423 | 7.00370960 | 19.9313 | 9.9e-14 | — | bestätigt | instabil | 1.02 | 0.004099 | 8 | ort: Schmetterling II |
| 0.088005461924 | 0.421271076906 | 8.97545309 | 24.3344 | 2.7e-13 | — | bestätigt | instabil | 680 | 0.03728 | 10 | Hristov: ort |
| 0.055588616644 | 0.476379501409 | 9.87060008 | 24.0343 | 7.0e-13 | — | bestätigt | instabil | 1.02e+3 | 0.06021 | 12 | Hristov: ort |
| 0.062014409046 | 0.254787672459 | 10.09007046 | 35.0512 | 9.4e-13 | — | bestätigt | instabil | 121 | 0.04078 | 14 | Hristov: ort |
| 0.056005055936 | 0.139870726289 | 10.45366342 | 39.6448 | 2.4e-12 | — | bestätigt | instabil | 55.1 | 0.01801 | 16 | Hristov: ort |
| 0.083300071850 | 0.127889255520 | 10.46484953 | 39.6436 | 2.3e-13 | — | bestätigt | instabil | 20.7 | 0.01848 | 16 | ort: Brille |
| 0.282702090436 | 0.327208971523 | 10.96330309 | 29.6021 | 9.3e-14 | — | bestätigt | instabil | 1.91 | 0.009784 | 12 | ort: Yin-Yang I b |
| 0.083258051546 | 0.459741140310 | 12.14223348 | 30.4323 | 1.2e-12 | — | bestätigt | instabil | 1.41e+4 | 0.1549 | 14 | Hristov: ort |
| 0.066732789869 | 0.291286756903 | 13.36971106 | 44.5853 | 5.4e-13 | — | bestätigt | instabil | 334 | 0.03156 | 18 | ort: II.C-189 |
| 0.087988043946 | 0.206807486135 | 13.85675385 | 49.8698 | 7.5e-11 | — | an der Rechengrenze | instabil | 1.745e+5 | 0.01351 | 20 | Hristov: ort |
| 0.405915567135 | 0.230163125980 | 13.86712344 | 34.8022 | 1.4e-13 | — | bestätigt | stabil | 1.00 | 0.008337 | 14 | ort: Schmetterling III |
| 0.464445172818 | 0.396060014653 | 14.89430518 | 24.2056 | 2.6e-14 | — | bestätigt | stabil | 1.00 | 0.07947 | 10 | ort: Motte I |
| 0.055432422247 | 0.393007544819 | 15.31827337 | 44.2206 | 1.0e-11 | — | bestätigt | instabil | 1.96e+4 | 0.005404 | 18 | Hristov: ort |
| 0.076545916089 | 0.447177502003 | 15.33370144 | 39.6056 | 1.8e-12 | — | bestätigt | instabil | 8.48e+3 | 0.1212 | 18 | Hristov: ort |
| 0.146771114348 | 0.198823898139 | 15.58520410 | 54.9592 | 2.5e-12 | — | bestätigt | instabil | 548 | 0.01204 | 22 | ort: II.C-62 |
| 0.035836843244 | 0.138442001638 | 15.62220261 | 59.4930 | 1.3e-11 | — | bestätigt | instabil | 3.68e+3 | 0.01161 | 24 | Hristov: ort |
| 0.121453416447 | 0.101202379955 | 15.74409450 | 59.4554 | 9.6e-13 | — | bestätigt | instabil | 1.31e+3 | 0.01115 | 24 | ort: I.A-7 |
| 0.094893102570 | 0.253997259124 | 15.96972284 | 54.9592 | 1.6e-12 | — | bestätigt | instabil | 548 | 0.01224 | 22 | lage: II.C-62 |
| 0.138948376479 | 0.139163284020 | 16.16262795 | 59.4930 | 1.5e-11 | — | bestätigt | instabil | 3.68e+3 | 0.01188 | 24 | Hristov: ort |
| 0.063313775811 | 0.446967973612 | 16.19756077 | 42.0408 | 2.5e-11 | — | bestätigt | instabil | 8.32e+4 | 0.1063 | 20 | Hristov: ort |
| 0.096253139734 | 0.472872430545 | 16.25302731 | 39.2955 | 3.1e-11 | — | bestätigt | instabil | 4.74e+4 | 0.07816 | 18 | Hristov: ort |
| 0.035245331131 | 0.076761158599 | 16.33255500 | 63.7328 | 1.2e-11 | — | bestätigt | instabil | 390 | 0.003384 | 26 | Hristov: ort |
| 0.244508405258 | 0.275224079621 | 16.39008490 | 49.6432 | 8.8e-13 | — | bestätigt | instabil | 8.44 | 7.7e-4 | 20 | lage: II.C-3 |
| 0.151182507188 | 0.077153642246 | 16.99699234 | 63.7328 | 7.7e-12 | — | bestätigt | instabil | 390 | 0.003475 | 26 | Hristov: ort |
| 0.010984225392 | 0.474838265246 | 17.15797208 | 42.2402 | 2.4e-11 | — | bestätigt | instabil | 812 | 0.002164 | 20 | Hristov: ort |
| 0.513938537460 | 0.304735919347 | 17.32883402 | 29.6021 | 1.1e-13 | — | bestätigt | instabil | 1.91 | 0.01328 | 12 | ort: Yin-Yang I a |
| 0.069539380600 | 0.500350333012 | 17.37504836 | 39.6886 | 3.1e-12 | — | bestätigt | instabil | 1.25e+3 | 0.002485 | 18 | Hristov: ort |
| 0.072656534145 | 0.501517234944 | 17.44796238 | 39.6885 | 1.1e-12 | — | bestätigt | instabil | 1.07e+3 | 0.005076 | 18 | lage: II.C-191 |
| 0.181942880483 | 0.514805997725 | 18.14136765 | 36.9090 | 4.3e-13 | — | bestätigt | instabil | 3.83 | 0.2281 | 16 | Hristov: ort |
| 0.063330864580 | 0.272807254862 | 18.97617517 | 64.6731 | 3.1e-11 | — | bestätigt | instabil | 2.80e+3 | 9.5e-5 | 26 | Hristov: ort |
| 0.189004891951 | 0.539762452801 | 19.73539189 | 36.9400 | 3.7e-13 | — | bestätigt | instabil | 43.8 | 0.2607 | 16 | Hristov: ort |
| 0.067477109003 | 0.176382476107 | 20.18667726 | 74.7276 | 8.6e-12 | — | bestätigt | instabil | 293 | 4.5e-4 | 30 | Hristov: ort |
| 0.071329509030 | 0.176761351127 | 20.21208108 | 74.7276 | 2.1e-11 | — | bestätigt | instabil | 119 | 5.3e-4 | 30 | lage: II.C-64 |
| 0.073645733069 | 0.198997960073 | 20.56152982 | 74.7795 | 2.4e-11 | — | bestätigt | instabil | 5.79e+3 | 0.03020 | 30 | Hristov: ort |
| 0.124845074905 | 0.428794509452 | 20.56270071 | 53.9231 | 1.6e-11 | — | bestätigt | instabil | 82.4 | 4.6e-4 | 22 | lage: II.C-4 |
| 0.077068420570 | 0.087555133288 | 20.58829098 | 79.3975 | 1.0e-11 | — | bestätigt | instabil | 4.53e+3 | 0.004443 | 32 | Hristov: ort |
| 0.411292690948 | 0.260755101360 | 20.74906501 | 49.6301 | 3.3e-13 | — | bestätigt | stabil | 1.00 | 0.005486 | 20 | ort: I.A-5 |
| 0.079852101478 | 0.432796490535 | 20.75666687 | 55.1756 | 9.6e-12 | — | bestätigt | instabil | 1.22e+4 | 0.04314 | 24 | Hristov: ort |
| 0.042658449948 | 0.136179805552 | 20.81231258 | 79.2707 | 3.2e-11 | — | bestätigt | instabil | 1.29e+4 | 0.01340 | 32 | Hristov: ort |
| 0.034156397886 | 0.139200706072 | 20.85512849 | 79.4076 | 3.1e-11 | — | bestätigt | instabil | 1.69e+4 | 0.01114 | 32 | Hristov: ort |
| 0.060136433081 | 0.135819365446 | 20.88231548 | 79.2882 | 1.4e-11 | — | bestätigt | instabil | 752 | 0.01662 | 32 | Hristov: ort |
| 0.017369588659 | 0.057677034853 | 20.90234734 | 82.0848 | 1.2e-9 | — | an der Rechengrenze | instabil | 2.027e+5 | 6.5e-4 | 34 | Hristov: ort |
| 0.083632024082 | 0.133007119089 | 20.98395936 | 79.2882 | 2.0e-11 | — | bestätigt | instabil | 752 | 0.01668 | 32 | Hristov: ort |
| 0.201678309264 | 0.409895543659 | 21.02051589 | 53.9231 | 1.1e-11 | — | bestätigt | instabil | 82.4 | 4.7e-4 | 22 | ort: II.C-4 |
| 0.123145355952 | 0.111604461781 | 21.11954868 | 79.3665 | 9.6e-12 | — | bestätigt | instabil | 4.64e+3 | 0.009249 | 32 | Hristov: ort |
| 0.080584225541 | 0.588836089778 | 21.27233739 | 36.7714 | 2.0e-12 | — | bestätigt | instabil | 1.31 | 0.007336 | 16 | ort: Libelle |
| 0.056331518212 | 0.319066506132 | 21.32546155 | 68.8805 | 6.5e-10 | — | an der Rechengrenze | instabil | 1.19e+3 | 2.4e-5 | 28 | Hristov: ort |
| 0.106606298759 | 0.236974050081 | 21.45933180 | 74.7276 | 4.2e-11 | — | bestätigt | instabil | 119 | 5.5e-4 | 30 | ort: II.C-64 |
| 0.146985093201 | 0.219929331007 | 21.60848569 | 74.8859 | 2.3e-12 | — | bestätigt | instabil | 172 | 0.001803 | 30 | Hristov: ort |
| 0.173918430930 | 0.114084387451 | 21.75353410 | 79.3799 | 7.2e-11 | — | bestätigt | instabil | 1.20e+4 | 0.01026 | 32 | ort: II.C-9 |
| 0.198066087117 | 0.098792589688 | 21.98852003 | 79.3665 | 5.4e-12 | — | bestätigt | instabil | 4.64e+3 | 0.009501 | 32 | Hristov: ort |
| 0.243384558648 | 0.250516692356 | 22.33337879 | 69.6227 | 1.2e-10 | — | an der Rechengrenze | instabil | 19.9 | 2.9e-5 | 28 | ort: II.C-8 |
| 0.063381042333 | 0.374169375151 | 23.15402305 | 68.8547 | 1.3e-10 | — | an der Rechengrenze | instabil | 4.01e+3 | 0.002016 | 28 | Hristov: ort |
| 0.138898023308 | 0.537502415024 | 23.33464606 | 46.1409 | 2.1e-12 | — | bestätigt | instabil | 431 | 0.1597 | 20 | Hristov: ort |
| 0.617818158662 | 0.331482079288 | 23.44060140 | 24.3344 | 1.8e-12 | — | bestätigt | instabil | 680 | 0.07069 | 10 | Hristov: ort |
| 0.058880084868 | 0.292917179005 | 23.44463195 | 78.1884 | 3.5e-12 | — | bestätigt | instabil | 789 | 0.01512 | 32 | Hristov: ort |
| 0.066924285481 | 0.305564006020 | 23.85589355 | 78.1877 | 4.5e-11 | — | bestätigt | instabil | 1.94e+3 | 0.001078 | 32 | Hristov: ort |
| 0.183446232710 | 0.329336650948 | 24.83999919 | 74.1748 | 2.1e-11 | — | bestätigt | instabil | 2.89e+3 | 0.02163 | 30 | lage: II.C-193 |
| 0.101055798597 | 0.488325137838 | 24.84137311 | 57.7048 | 1.0e-12 | — | bestätigt | instabil | 853 | 0.01659 | 26 | Hristov: ort |
| 0.382741412266 | 0.458977118199 | 25.05730466 | 42.7835 | 3.8e-13 | — | bestätigt | instabil | 30.9 | 0.01595 | 18 | Hristov: ort |
| 0.259557114145 | 0.345634066418 | 25.42970948 | 68.6873 | 1.5e-12 | — | bestätigt | instabil | 155 | 0.002322 | 28 | lage: II.C-6 |
| 0.383443519950 | 0.377363694888 | 25.83923636 | 53.8569 | 9.5e-13 | — | bestätigt | instabil | 1.68 | 0.006717 | 22 | ort: Motte III |
| 0.077255372959 | 0.096293502255 | 25.83964112 | 99.3509 | 2.1e-11 | — | bestätigt | instabil | 4.03e+3 | 9.1e-5 | 40 | ort: II.C-197 |
| 0.150365547650 | 0.510957535837 | 26.08613758 | 55.2352 | 3.1e-12 | — | bestätigt | instabil | 330 | 0.08624 | 24 | Hristov: ort |
| 0.123649796508 | 0.518690715783 | 26.13341607 | 55.2384 | 2.8e-12 | — | bestätigt | instabil | 467 | 0.1072 | 24 | Hristov: ort |
| 0.522520163383 | 0.226808387137 | 26.31938488 | 49.6432 | 1.1e-12 | — | bestätigt | instabil | 8.44 | 0.001060 | 20 | ort: II.C-3 |
| 0.098682211153 | 0.131758459237 | 26.36114797 | 99.1605 | 5.5e-11 | — | bestätigt | instabil | 2.98e+4 | 0.01170 | 40 | Hristov: ort |
| 0.115051657239 | 0.124917308015 | 26.43080795 | 99.1003 | 2.2e-11 | — | bestätigt | instabil | 2.18e+4 | 0.006625 | 40 | Hristov: ort |
| 0.123299298262 | 0.116971223959 | 26.48445275 | 99.2933 | 1.2e-11 | — | bestätigt | instabil | 1.29e+4 | 0.007678 | 40 | Hristov: ort |
| 0.537955720731 | 0.341457854438 | 26.91866962 | 39.0752 | 1.4e-13 | — | bestätigt | instabil | 56.9 | 0.06187 | 16 | ort: I.A-4 |
| 0.251733033679 | 0.294190155578 | 27.00343892 | 79.2736 | 1.2e-12 | — | bestätigt | instabil | 21.8 | 0.01258 | 32 | Hristov: ort |
| 0.140931985364 | 0.234382507755 | 27.62009989 | 94.8138 | 9.2e-11 | — | bestätigt | instabil | 116 | 5.2e-5 | 38 | lage: II.C-19 |
| 0.414912960880 | 0.274618755099 | 27.66464711 | 64.4455 | 9.7e-13 | — | bestätigt | offen | 1.02 | 0.003676 | 26 | ort: I.B-9 |
| 0.186859214402 | 0.204454880989 | 27.72536513 | 94.8138 | 8.7e-11 | — | bestätigt | instabil | 116 | 5.2e-5 | 38 | ort: II.C-19 |
| 0.398044433461 | 0.176138333450 | 27.82341433 | 74.6945 | 1.7e-12 | — | bestätigt | offen | 1.00 | 0.001070 | 30 | ort: I.B-10 |
| 0.065541183003 | 0.278246723245 | 27.84588742 | 94.2839 | 4.3e-11 | — | bestätigt | instabil | 9.60e+3 | 0.001964 | 38 | Hristov: ort |
| 0.246618201708 | 0.234562128619 | 28.36714892 | 89.5828 | 7.5e-11 | — | bestätigt | offen | 43.7 | 1.0e-5 | 36 | lage: II.C-17 |
| 0.439165917888 | 0.452967643191 | 28.66927092 | 42.7821 | 1.5e-12 | — | bestätigt | stabil | 1.00 | 0.04970 | 18 | ort: Motte II |
| 0.505695409770 | 0.602356412015 | 29.09853230 | 15.0494 | 2.8e-13 | — | bestätigt | instabil | 570 | 0.2748 | 8 | Hristov: ort |
| 0.327578070942 | 0.579861679719 | 29.21293407 | 36.9400 | 1.3e-13 | — | bestätigt | instabil | 43.8 | 0.3386 | 16 | Hristov: ort |
| 0.409494591304 | 0.362823165469 | 33.86775072 | 68.6734 | 1.4e-11 | — | bestätigt | stabil | 1.00 | 0.005905 | 28 | ort: I.A-8 |
| 0.412102872517 | 0.283383749688 | 34.24704997 | 79.2555 | 1.3e-12 | — | bestätigt | offen | 1.01 | 0.003132 | 32 | ort: I.A-10 |
| 0.161480681141 | 0.548954802301 | 39.39196863 | 73.6536 | 1.2e-10 | — | an der Rechengrenze | instabil | 491 | 1.9e-4 | 32 | Hristov: ort |
