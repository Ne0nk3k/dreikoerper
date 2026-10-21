# Suchlauf euler-m3-05

2026-10-02 20:38 UTC · Euler-Ebene · Massen 1 / 1 / 0.5 · Fenster v₁ 0…0.4, v₂ 0…0.4 · Raster 512×512 · Perioden bis 40 · Suche über Umkehrpunkte (halbe Periode)

## Was der Lauf getan hat

| Stufe | Zahl |
|---|---|
| Rasterpunkte gerechnet | 262144 in 72 s auf 5 Fäden |
| davon durchgelaufen / Zerfall / abgebrochen / ungebunden | 222597 / 37875 / 1142 / 530 |
| Talsohlen (unter 0.3) in 4 Zielen × 6 Zeitbändern | 170453 |
| davon durch die Prüfkette | 40000 in 969 s |
| Umkehrpunkt verfehlt | 29133 |
| Umkehrpunkt getroffen, aber nach 12τ nicht zurück (nur bis auf eine Drehung periodisch) | 2603 |
| geschlossene Bahn | 8264 |
| verschiedene Orte in der Ebene | **2204** |
| verschiedene Bahnen (gleiches T* auf acht Stellen einmal gezählt) | **2108** |
| — bestätigt (voller Umlauf: Rest < 1e-10 und Gegenprobe < 1e-8) | 327 |
| — über den Umkehrpunkt (halber Umlauf auf 1e-11 getroffen, voller für double zu empfindlich) | 1458 |
| — an der Rechengrenze | 419 |
| sicher linear stabil | 3 |
| Ausnahmen im Schwarm | 0 |

Je Ziel (Fixmenge, die nach der halben Periode getroffen wird):

| Ziel | Kandidaten | Umkehrpunkt getroffen | geschlossene Bahn |
|---|---|---|---|
| B3 | 15606 | 5872 | 4957 |
| C | 16171 | 2620 | 1556 |
| A3 | 4289 | 1594 | 1568 |
| R | 3934 | 781 | 183 |

## Bekannt oder nicht

Von den 2204 Funden stehen **158** in einer der geprüften Listen, **2046** in keiner. Als verschiedene Bahnen gezählt (eine Bahn kann die Ebene an mehreren Stellen kreuzen): 2108, davon **1976** in keiner Liste.

| Liste | Stufe | Bahnen | Bedeutung |
|---|---|---|---|
| Li/Liao 2017–2019, Šuvakov/Dmitrašinović 2013 (2364 Bahnen, mit Klassen) | Ort | 125 | steht mit diesen Anfangswerten in der Liste |
| | Lage | 33 | gleiches T* auf acht Stellen: Listenbahn, an anderer Stelle getroffen |
| | Klasse | 126 | Klasse in der Liste, aber anderes T*: weitere Bahn derselben Familie |
| | keine | 1920 | Klasse nicht in der Liste |
| Hristov u. a. | — | — | nur für gleiche Massen; hier nicht anwendbar |

**Für die Massen 1 / 1 / 0.5 gibt es als Vergleich nur Li und Liao: 565 Bahnen, je Klasse eine, davon 74 mit T bis 40.** Die großen Listen von Hristov u. a. gelten nur für gleiche Massen. „In keiner Liste“ sagt in diesem Lauf deshalb wenig: fast alles, was eine Suche bei diesen Massen findet, steht in keiner Liste, weil es kaum eine gibt.

„In keiner Liste“ heißt genau das und nicht „neu“. Die Listen sind in sich begrenzt: Li und Liao führen je Klasse eine Bahn bis T = 200, gefunden auf einem Raster von 4000²; Hristov u. a. führen die Euler-Ebene bis T* = 211 und den freien Fall bis T* = 80 (mit Punktsymmetrie bis 120).

**Satelliten:** 138 der 2046 Funde außerhalb der Listen laufen mehrmals fast den Weg einer anderen Bahn dieses Laufs oder der Liste, bevor sie sich schließen (Wort das k-fache, T* das k-fache); bei 95 davon ist die Grundbahn gelistet. Das sind eigene Bahnen, aber keine unerklärten — um eine stabile Bahn herum gibt es solche Begleiter regelmäßig. Sie sind in der Tabelle unten in der Spalte „Listen“ benannt.

## Gegenrichtung: was der Lauf von den Listen wiederfindet

| Liste | Bahnen im Fenster mit T bis 40 | gefunden | Anteil |
|---|---|---|---|
| Li/Liao, 2013 | 74 | 72 | 97 % |

Verpasst aus Li/Liao: II.C-8 (T 25.7), II.C-52 (T 35.1).

![Karte](euler-m3-05.png)

Karte: hell = die Bahn kommt bis zur halben Höchstperiode einer Fixmenge nahe. Weißer Ring = Fund, der in einer Liste steht (nur bei bis zu 3000 Funden gezeichnet). Grüner Punkt = Fund, der in keiner Liste steht. Rotes Kreuz = Bahn aus Li/Liao, die der Lauf verpasst hat.

## Funde in keiner Liste (2046)

| v₁ | v₂ | T | T* | Rest (voller Umlauf) | Umkehrpunkt | Urteil | Stabilität | \|λ\| | engste Begegnung | Wortlänge | Listen |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 0.060447462523 | 0.185459949661 | 3.09207357 | 4.6348 | 2.1e-13 | A3 4.5e-15 | bestätigt | instabil | 136 | 0.006150 | 4 | nur Klasse von I.A-1 |
| 0.058326291822 | 0.189152809588 | 6.21509846 | 9.2558 | 2.6e-11 | B3 4.8e-15 | bestätigt | instabil | 1.72e+4 | 0.01263 | 8 | nur Klasse von I.A-2 · Satellit 2. Ordnung von I.A-1 (T* das 2.03944-fache, Wort bis auf 4 Buchstaben) |
| 0.084418598400 | 0.218687093349 | 7.00530843 | 9.5009 | 2.6e-13 | B3 4.9e-15 | bestätigt | instabil | 407 | 0.1970 | 8 | nur Klasse von I.A-2 |
| 0.086473570203 | 0.132655109384 | 8.42117265 | 13.5722 | 4.1e-12 | B3 2.6e-14 | bestätigt | instabil | 104 | 0.01402 | 12 | nur Klasse von II.C-3 · Satellit 2. Ordnung von Fund (0.375866, 0.102951) (T* das 2.03853-fache, Wort bis auf 4 Buchstaben) |
| 0.016979547148 | 0.012824530355 | 8.51751463 | 15.6123 | 2.6e-10 | A3 1.0e-11 | an der Rechengrenze | instabil | 8.40e+3 | 1.6e-4 | 14 | nur Klasse von II.C-4 |
| 0.044280745570 | 0.017088809030 | 8.73056470 | 15.8587 | 2.2e-11 | A3 5.2e-13 | bestätigt | instabil | 2.77e+4 | 0.001029 | 14 | — |
| 0.048609196529 | 0.188742066902 | 9.25024797 | 13.8706 | 3.7e-9 | A3 8.1e-13 | über den Umkehrpunkt | instabil | 3.309e+7 | 0.005449 | 12 | — |
| 0.240641761660 | 0.138000988521 | 9.53590297 | 11.2308 | 3.1e-12 | B3 3.2e-14 | bestätigt | instabil | 239 | 0.02047 | 10 | nur Klasse von II.C-1 |
| 0.208385982753 | 0.066268864030 | 9.61697220 | 13.6166 | 3.5e-11 | B3 5.6e-14 | bestätigt | stabil | 1.00 | 7.6e-5 | 12 | Satellit 3. Ordnung von I.A-1 (T* das 3.00033-fache) |
| 0.038806889630 | 0.143368690021 | 9.66860208 | 15.8396 | 4.7e-13 | A3 2.7e-13 | bestätigt | instabil | 408 | 0.03234 | 14 | nur Klasse von II.C-4 |
| 0.061756190766 | 0.028645199229 | 10.00067965 | 17.9483 | 8.1e-11 | B3 5.1e-13 | bestätigt | instabil | 2.18e+4 | 0.002931 | 16 | Satellit 2. Ordnung von I.A-2 (T* das 1.98033-fache, Wort bis auf 4 Buchstaben) |
| 0.246506732667 | 0.159242611075 | 10.08165109 | 11.1489 | 7.9e-13 | B3 3.6e-14 | bestätigt | instabil | 3.21e+3 | 0.06040 | 10 | nur Klasse von I.B-2 |
| 0.086288318206 | 0.041211693230 | 10.25231040 | 17.9802 | 1.1e-10 | B3 2.8e-14 | über den Umkehrpunkt | instabil | 1.12e+4 | 0.004548 | 16 | — |
| 0.225136918721 | 0.193366710942 | 10.36605566 | 11.3067 | 8.4e-13 | C 5.0e-15 | bestätigt | instabil | 456 | 0.3247 | 10 | nur Klasse von I.B-2 |
| 0.013466096053 | 0.079307623933 | 10.43398308 | 18.5516 | 1.7e-9 | B3 2.2e-14 | über den Umkehrpunkt | instabil | 1.787e+6 | 0.003762 | 16 | — |
| 0.375866373683 | 0.102951141275 | 10.44558286 | 6.6578 | 4.2e-13 | A3 9.5e-16 | bestätigt | instabil | 214 | 0.08308 | 6 | nur Klasse von I.B-1 |
| 0.090570554803 | 0.220574273679 | 10.55333748 | 14.1462 | 6.9e-10 | B3 2.6e-13 | über den Umkehrpunkt | instabil | 2.00e+4 | 0.007962 | 12 | Satellit 3. Ordnung von Fund (0.060447, 0.185460) (T* das 3.05215-fache, Wort bis auf 4 Buchstaben) |
| 0.093598443772 | 0.181638272631 | 10.59660863 | 15.5480 | 3.6e-11 | A3 5.6e-13 | bestätigt | instabil | 1.85e+4 | 0.007725 | 14 | nur Klasse von II.C-5 |
| 0.166871214543 | 0.206438730853 | 10.82066394 | 13.3042 | 2.3e-11 | A3 9.7e-14 | bestätigt | instabil | 5.33e+4 | 0.03304 | 12 | nur Klasse von I.A-3 |
| 0.045073999296 | 0.026636820882 | 11.00633814 | 19.9434 | 6.2e-10 | B3 3.6e-12 | über den Umkehrpunkt | instabil | 1.005e+5 | 0.002544 | 18 | nur Klasse von II.C-11 |
| 0.029963024308 | 0.023546178474 | 11.07160299 | 20.1923 | 6.0e-11 | B3 4.8e-13 | bestätigt | instabil | 2.16e+4 | 0.001311 | 18 | — |
| 0.114640846510 | 0.191911924813 | 11.09278381 | 15.5052 | 3.5e-11 | A3 2.3e-13 | bestätigt | instabil | 1.05e+4 | 0.04532 | 14 | nur Klasse von I.B-5 |
| 0.098538450596 | 0.185544016357 | 11.10371737 | 16.0670 | 1.7e-9 | A3 8.3e-13 | über den Umkehrpunkt | instabil | 2.261e+6 | 0.001494 | 14 | — |
| 0.029989868790 | 0.134992213747 | 11.14316533 | 18.5455 | 3.7e-11 | B3 1.7e-14 | bestätigt | instabil | 1.87e+4 | 0.04756 | 16 | — |
| 0.147282750056 | 0.067818825606 | 11.22930390 | 17.9779 | 5.1e-12 | B3 1.3e-14 | bestätigt | instabil | 227 | 0.004017 | 16 | — |
| 0.048185409368 | 0.042049745389 | 11.23900798 | 20.2266 | 7.3e-11 | C 4.3e-14 | bestätigt | instabil | 7.96e+3 | 0.006737 | 18 | — |
| 0.260645300747 | 0.082991035232 | 11.39658325 | 13.6149 | 1.9e-13 | B3 2.8e-15 | bestätigt | instabil | 2.37 | 0.02230 | 12 | Satellit 3. Ordnung von I.A-1 (T* das 2.99995-fache) |
| 0.041205671493 | 0.083048968350 | 11.45177572 | 20.1406 | 2.0e-11 | B3 2.8e-13 | bestätigt | instabil | 1.84e+4 | 0.02358 | 18 | nur Klasse von II.C-11 |
| 0.029794392028 | 0.078928869147 | 11.49185561 | 20.3650 | 1.1e-11 | A3 1.1e-13 | bestätigt | instabil | 4.66e+3 | 0.005969 | 18 | — |
| 0.033126235940 | 0.077807140031 | 11.49776246 | 20.3720 | 4.3e-12 | C 5.0e-15 | bestätigt | instabil | 4.17e+3 | 0.01652 | 18 | — |
| 0.060888204089 | 0.081188205066 | 11.51274865 | 20.0705 | 1.9e-11 | B3 5.6e-14 | bestätigt | instabil | 1.53e+4 | 0.01902 | 18 | nur Klasse von II.C-11 |
| 0.088963847915 | 0.246547465760 | 11.66201718 | 14.5041 | 2.4e-11 | A3 6.6e-14 | bestätigt | instabil | 4.13e+4 | 0.008641 | 12 | Satellit 2. Ordnung von I.B-1 (T* das 1.99716-fache) |
| 0.121000704691 | 0.210445180264 | 11.80135836 | 15.6173 | 2.7e-12 | A3 2.0e-14 | bestätigt | instabil | 1.74e+3 | 0.1751 | 14 | nur Klasse von I.B-5 |
| 0.016846493735 | 0.148466868306 | 11.90771952 | 19.4799 | 4.0e-9 | C 9.8e-14 | über den Umkehrpunkt | instabil | 3.524e+7 | 0.02934 | 16 | — |
| 0.003500181562 | 0.065408608994 | 12.01308738 | 21.5977 | 2.7e-6 | C 4.3e-13 | über den Umkehrpunkt | instabil | 1.008e+10 | 0.001190 | 18 | — |
| 0.033015733396 | 0.035416984003 | 12.17364112 | 22.1028 | 3.2e-11 | A3 2.0e-13 | bestätigt | instabil | 8.08e+4 | 0.003328 | 20 | — |
| 0.082856955579 | 0.111947063923 | 12.17575277 | 20.2343 | 2.3e-11 | A3 1.8e-13 | bestätigt | instabil | 1.81e+4 | 0.01846 | 18 | Satellit 3. Ordnung von Fund (0.375866, 0.102951) (T* das 3.03918-fache, Wort bis auf 4 Buchstaben) |
| 0.035881380320 | 0.155665607668 | 12.27735546 | 19.7391 | 2.2e-12 | A3 1.0e-13 | bestätigt | instabil | 1.72e+3 | 0.02457 | 18 | nur Klasse von II.C-11 |
| 0.047325898995 | 0.188706582072 | 12.32141340 | 18.4902 | 4.2e-6 | C 1.6e-13 | über den Umkehrpunkt | instabil | 6.472e+9 | 0.009621 | 16 | — |
| 0.032561391030 | 0.046301620450 | 12.33260861 | 22.2945 | 1.6e-10 | B3 8.2e-14 | über den Umkehrpunkt | instabil | 5.41e+4 | 0.005625 | 20 | nur Klasse von I.A-7 |
| 0.028630952337 | 0.058524903020 | 12.37815504 | 22.2592 | 4.7e-11 | B3 4.2e-13 | bestätigt | instabil | 2.48e+4 | 0.004476 | 20 | — |
| 0.044017682653 | 0.016809290453 | 12.39242960 | 22.5141 | 1.6e-8 | A3 7.8e-12 | über den Umkehrpunkt | instabil | 6.792e+6 | 9.8e-4 | 20 | Satellit 2. Ordnung von II.C-2 (T* das 1.99500-fache, Wort bis auf 4 Buchstaben) |
| 0.118696071550 | 0.253540794373 | 12.43337200 | 14.5038 | 7.9e-13 | B3 1.8e-14 | bestätigt | instabil | 7.35e+3 | 0.02367 | 12 | Satellit 2. Ordnung von I.B-1 (T* das 1.99711-fache) |
| 0.056813076179 | 0.067169083016 | 12.51645189 | 22.1101 | 2.8e-11 | A3 3.7e-13 | über den Umkehrpunkt | instabil | 1.535e+5 | 0.01502 | 20 | — |
| 0.062647149603 | 0.029972706615 | 12.54875866 | 22.4998 | 8.1e-9 | B3 7.9e-12 | über den Umkehrpunkt | instabil | 2.641e+5 | 6.2e-4 | 20 | Satellit 2. Ordnung von II.C-2 (T* das 1.99374-fache, Wort bis auf 4 Buchstaben) |
| 0.068655044555 | 0.029434094127 | 12.60523870 | 22.5142 | 1.1e-10 | A3 4.9e-13 | über den Umkehrpunkt | instabil | 2.46e+3 | 0.002865 | 20 | Satellit 2. Ordnung von II.C-2 (T* das 1.99502-fache, Wort bis auf 2 Buchstaben) |
| 0.070251140141 | 0.028096921283 | 12.61779209 | 22.5200 | 2.3e-11 | A3 2.1e-12 | bestätigt | instabil | 6.99e+3 | 0.002574 | 20 | Satellit 2. Ordnung von II.C-2 (T* das 1.99553-fache, Wort bis auf 4 Buchstaben) |
| 0.082968606245 | 0.005823877907 | 12.78557889 | 22.6809 | 1.1e-10 | B3 1.2e-11 | an der Rechengrenze | instabil | 6.20e+3 | 1.0e-4 | 20 | — |
| 0.106198165921 | 0.131905453406 | 12.80556601 | 20.2341 | 2.2e-11 | A3 1.5e-13 | bestätigt | instabil | 4.24e+3 | 0.008964 | 18 | Satellit 3. Ordnung von Fund (0.375866, 0.102951) (T* das 3.03914-fache, Wort bis auf 4 Buchstaben) |
| 0.072212918876 | 0.150697825814 | 12.83135812 | 20.3592 | 1.6e-11 | C 3.3e-14 | bestätigt | instabil | 823 | 0.01021 | 18 | — |
| 0.125402741254 | 0.190065559205 | 12.83542408 | 17.7392 | 3.6e-7 | B3 7.3e-14 | über den Umkehrpunkt | instabil | 1.260e+8 | 0.03754 | 16 | — |
| 0.046168841047 | 0.229930914237 | 12.88115444 | 17.4646 | 7.9e-7 | C 1.3e-13 | über den Umkehrpunkt | instabil | 1.098e+10 | 9.4e-4 | 14 | — |
| 0.130102705468 | 0.223475241847 | 12.99014293 | 16.3483 | 4.3e-11 | B3 1.8e-12 | bestätigt | instabil | 2.64e+4 | 0.003324 | 14 | — |
| 0.082210484816 | 0.152860229041 | 12.99229651 | 20.3650 | 2.7e-12 | B3 6.1e-14 | bestätigt | instabil | 4.66e+3 | 0.006478 | 18 | — |
| 0.089979244295 | 0.213844161087 | 13.22902778 | 18.0654 | 1.6e-9 | B3 2.5e-14 | über den Umkehrpunkt | instabil | 8.259e+5 | 0.1606 | 16 | — |
| 0.021039326580 | 0.022970557119 | 13.24025786 | 24.2060 | 4.1e-10 | C 8.0e-13 | über den Umkehrpunkt | instabil | 1.007e+7 | 7.6e-4 | 22 | — |
| 0.232900556943 | 0.147984119768 | 13.33570666 | 15.7917 | 9.2e-13 | A3 1.2e-13 | bestätigt | instabil | 6.84e+3 | 0.004529 | 14 | nur Klasse von I.B-4 |
| 0.023732221985 | 0.052435200551 | 13.34724912 | 24.1154 | 1.3e-10 | A3 1.8e-13 | über den Umkehrpunkt | instabil | 2.242e+5 | 0.004819 | 22 | — |
| 0.020372341338 | 0.055819991171 | 13.46907052 | 24.3087 | 3.5e-10 | C 5.4e-14 | über den Umkehrpunkt | instabil | 1.326e+5 | 0.004301 | 22 | — |
| 0.049074545100 | 0.029424632872 | 13.57975378 | 24.5403 | 4.5e-9 | B3 2.5e-11 | an der Rechengrenze | instabil | 9.160e+5 | 0.002323 | 22 | — |
| 0.063052958512 | 0.215235785053 | 13.58676440 | 18.9537 | 8.5e-10 | C 6.5e-14 | über den Umkehrpunkt | instabil | 1.302e+6 | 0.1516 | 16 | — |
| 0.186308616998 | 0.206973110640 | 13.58728584 | 15.9382 | 5.4e-11 | A3 1.0e-13 | bestätigt | instabil | 4.98e+4 | 0.01649 | 14 | nur Klasse von II.C-5 |
| 0.010818214908 | 0.167945356702 | 13.60285080 | 21.5360 | 2.1e-7 | C 7.5e-14 | über den Umkehrpunkt | instabil | 6.654e+8 | 0.02361 | 18 | — |
| 0.255504998974 | 0.120518983925 | 13.66320188 | 15.7838 | 9.6e-13 | B3 1.6e-14 | bestätigt | instabil | 156 | 0.04364 | 14 | nur Klasse von I.B-4 |
| 0.010619250037 | 0.099225382952 | 13.67054886 | 23.8743 | 1.2e-7 | A3 2.0e-12 | über den Umkehrpunkt | instabil | 1.060e+9 | 0.003110 | 20 | — |
| 0.334287155116 | 0.114622587677 | 13.70808472 | 11.2308 | 1.1e-12 | B3 1.5e-14 | bestätigt | instabil | 239 | 0.02608 | 10 | nur Klasse von II.C-1 |
| 0.075655421135 | 0.038618228519 | 13.80606283 | 24.4539 | 2.4e-8 | B3 7.5e-12 | über den Umkehrpunkt | instabil | 2.505e+6 | 0.004482 | 22 | — |
| 0.123409935213 | 0.243819618410 | 13.81150977 | 16.5159 | 2.6e-11 | A3 2.6e-13 | bestätigt | instabil | 1.46e+4 | 0.003152 | 14 | — |
| 0.074935755140 | 0.037259320743 | 13.95083759 | 24.7371 | 3.3e-10 | A3 1.8e-12 | über den Umkehrpunkt | instabil | 8.44e+4 | 0.004222 | 22 | — |
| 0.071746421714 | 0.186391292923 | 13.97450275 | 20.7266 | 2.9e-7 | C 1.2e-11 | an der Rechengrenze | instabil | 7.213e+8 | 0.001230 | 18 | nur Klasse von I.B-6 |
| 0.028459174488 | 0.155739615079 | 13.99500172 | 22.5566 | 2.2e-11 | B3 3.3e-13 | über den Umkehrpunkt | instabil | 1.584e+5 | 0.03340 | 20 | nur Klasse von I.A-7 |
| 0.086286878231 | 0.049160560886 | 14.01896137 | 24.4950 | 1.6e-11 | B3 2.6e-14 | bestätigt | instabil | 9.38e+3 | 0.006282 | 22 | — |
| 0.001859901004 | 0.059708617291 | 14.03603203 | 25.3271 | 8.6e-6 | C 5.5e-14 | über den Umkehrpunkt | instabil | 1.184e+11 | 0.003586 | 22 | — |
| 0.037233952196 | 0.098340509562 | 14.26638740 | 24.7735 | 1.5e-8 | A3 5.5e-12 | über den Umkehrpunkt | instabil | 2.691e+6 | 0.01092 | 22 | — |
| 0.147951778012 | 0.163660177649 | 14.33428938 | 20.1923 | 2.8e-9 | B3 1.3e-12 | über den Umkehrpunkt | instabil | 2.16e+4 | 0.001557 | 18 | — |
| 0.021852744552 | 0.035232242255 | 14.35785978 | 26.1507 | 4.9e-9 | B3 2.2e-14 | über den Umkehrpunkt | instabil | 2.613e+6 | 0.001901 | 24 | — |
| 0.142386447585 | 0.170695974500 | 14.36107884 | 20.1412 | 1.2e-11 | C 5.7e-14 | bestätigt | instabil | 3.59e+4 | 0.01221 | 18 | Satellit 3. Ordnung von Fund (0.375866, 0.102951) (T* das 3.02519-fache, Wort bis auf 4 Buchstaben) |
| 0.004331382869 | 0.047675688168 | 14.54993284 | 26.4242 | 7.3e-8 | B3 1.2e-13 | über den Umkehrpunkt | instabil | 5.835e+8 | 3.1e-4 | 24 | — |
| 0.234919820129 | 0.231845043131 | 14.79648399 | 13.8156 | 3.2e-11 | B3 1.6e-13 | bestätigt | instabil | 9.94e+3 | 0.02550 | 12 | — |
| 0.037900341685 | 0.034001637544 | 14.88189151 | 26.9861 | 1.5e-8 | A3 9.2e-13 | über den Umkehrpunkt | instabil | 3.998e+7 | 0.001261 | 24 | — |
| 0.075798335082 | 0.182464742101 | 14.93706295 | 22.2630 | 4.5e-10 | B3 6.2e-13 | über den Umkehrpunkt | instabil | 1.702e+6 | 0.004894 | 20 | — |
| 0.026086764696 | 0.070130017192 | 14.97467558 | 26.7437 | 4.8e-11 | A3 2.2e-12 | bestätigt | instabil | 2.43e+4 | 0.003946 | 24 | — |
| 0.024610682284 | 0.073859010220 | 15.00879788 | 26.7416 | 1.8e-10 | A3 2.0e-12 | über den Umkehrpunkt | instabil | 3.04e+4 | 4.1e-4 | 24 | Satellit 2. Ordnung von II.C-3 (T* das 1.97030-fache, Wort bis auf 4 Buchstaben) |
| 0.110390870478 | 0.167779401499 | 15.03134963 | 22.2367 | 2.9e-11 | B3 1.1e-13 | bestätigt | instabil | 960 | 6.7e-4 | 20 | nur Klasse von I.A-6 |
| 0.021802446797 | 0.076679298456 | 15.03495625 | 26.7480 | 2.5e-9 | A3 4.0e-12 | über den Umkehrpunkt | instabil | 6.162e+5 | 0.009248 | 24 | Satellit 2. Ordnung von II.C-3 (T* das 1.97077-fache, Wort bis auf 4 Buchstaben) |
| 0.178735405862 | 0.088847577595 | 15.03681580 | 22.3085 | 9.6e-11 | B3 5.2e-14 | bestätigt | instabil | 669 | 7.0e-4 | 20 | nur Klasse von I.A-7 |
| 0.052115533562 | 0.050800610619 | 15.07946225 | 26.9723 | 1.9e-10 | B3 5.6e-13 | über den Umkehrpunkt | instabil | 3.86e+4 | 0.004495 | 24 | — |
| 0.132331878745 | 0.266104758932 | 15.10267310 | 16.4444 | 4.7e-9 | A3 8.2e-12 | über den Umkehrpunkt | instabil | 1.394e+6 | 0.007395 | 14 | — |
| 0.103107409745 | 0.230032490779 | 15.14780020 | 19.4726 | 1.1e-9 | R 1.3e-14 | über den Umkehrpunkt | instabil | 4.436e+6 | 0.07047 | 0 | — |
| 0.057444988114 | 0.187224325165 | 15.15681466 | 22.6797 | 8.8e-7 | C 2.8e-12 | über den Umkehrpunkt | instabil | 2.688e+6 | 1.7e-4 | 20 | — |
| 0.104119001337 | 0.230177113460 | 15.17555110 | 19.4741 | 1.1e-11 | B3 9.4e-15 | über den Umkehrpunkt | instabil | 3.333e+6 | 0.06901 | 16 | — |
| 0.222762845284 | 0.162480447780 | 15.19471431 | 18.0074 | 4.1e-10 | A3 2.6e-11 | an der Rechengrenze | offen | 9.760e+5 | 3.9e-5 | 16 | — |
| 0.015778041643 | 0.018848181723 | 15.28078928 | 27.9878 | 6.9e-6 | C 5.0e-12 | über den Umkehrpunkt | instabil | 1.139e+8 | 2.9e-4 | 26 | — |
| 0.114972114229 | 0.174135883188 | 15.32955833 | 22.2592 | 1.1e-10 | B3 3.6e-13 | über den Umkehrpunkt | instabil | 2.48e+4 | 0.005162 | 20 | — |
| 0.143826711632 | 0.080763977083 | 15.38018824 | 24.4998 | 1.1e-12 | C 2.3e-14 | bestätigt | instabil | 622 | 0.005172 | 22 | — |
| 0.082744427260 | 0.051196506343 | 15.39071779 | 26.9467 | 2.7e-12 | A3 2.4e-13 | bestätigt | instabil | 5.27e+3 | 9.6e-4 | 24 | — |
| 0.271885722043 | 0.145029445027 | 15.42239182 | 16.0096 | 8.1e-8 | A3 5.6e-12 | über den Umkehrpunkt | instabil | 1.193e+7 | 1.5e-4 | 6 | nur Klasse von I.B-1 |
| 0.062178695179 | 0.160586056028 | 15.44533706 | 24.2735 | 1.2e-10 | C 6.2e-14 | über den Umkehrpunkt | instabil | 6.76e+3 | 0.006725 | 22 | — |
| 0.016134248621 | 0.047491763160 | 15.47739005 | 28.0769 | 8.5e-9 | C 1.2e-13 | über den Umkehrpunkt | instabil | 1.359e+6 | 0.001975 | 26 | — |
| 0.019938807669 | 0.095593795408 | 15.50961097 | 27.1453 | 7.5e-7 | B3 1.1e-12 | über den Umkehrpunkt | instabil | 6.619e+8 | 0.01229 | 24 | — |
| 0.068493634853 | 0.162136048836 | 15.57047712 | 24.2904 | 1.2e-10 | A3 2.2e-13 | über den Umkehrpunkt | instabil | 5.47e+4 | 0.004250 | 22 | — |
| 0.167258752586 | 0.221468834521 | 15.57204811 | 18.3311 | 1.2e-10 | A3 2.0e-13 | über den Umkehrpunkt | instabil | 2.41e+4 | 0.001435 | 16 | Satellit 2. Ordnung von I.A-2 (T* das 2.02256-fache, Wort bis auf 2 Buchstaben) |
| 0.070518593281 | 0.083945626182 | 15.59342667 | 26.9427 | 2.8e-10 | A3 1.3e-12 | über den Umkehrpunkt | instabil | 1.52e+4 | 3.0e-4 | 24 | — |
| 0.060088500695 | 0.391128591111 | 15.59895162 | 9.4713 | 8.4e-8 | A3 3.7e-11 | an der Rechengrenze | instabil | 3.544e+5 | 0.005666 | 8 | nur Klasse von I.A-2 |
| 0.065113526759 | 0.089219126367 | 15.61162594 | 26.9488 | 1.6e-8 | A3 1.4e-11 | an der Rechengrenze | instabil | 3.353e+6 | 9.9e-5 | 24 | — |
| 0.158247049283 | 0.078187383894 | 15.69941982 | 24.4676 | 1.3e-9 | C 8.9e-14 | über den Umkehrpunkt | instabil | 1.41e+4 | 0.003145 | 22 | — |
| 0.070101672257 | 0.210479279223 | 15.77879878 | 22.1554 | 7.6e-9 | B3 4.6e-13 | über den Umkehrpunkt | instabil | 4.810e+6 | 0.1199 | 20 | — |
| 0.241189530337 | 0.155119911579 | 15.84017594 | 17.9969 | 2.4e-11 | B3 6.9e-13 | bestätigt | instabil | 1.05e+4 | 1.3e-4 | 16 | — |
| 0.023098818370 | 0.054129337440 | 15.92642933 | 28.7535 | 5.0e-9 | A3 1.8e-12 | über den Umkehrpunkt | instabil | 2.883e+7 | 0.004925 | 26 | — |
| 0.038347181296 | 0.210028540898 | 16.00269867 | 22.9598 | 2.1e-9 | C 8.5e-14 | über den Umkehrpunkt | instabil | 2.022e+8 | 0.1080 | 20 | — |
| 0.076658782325 | 0.111940338269 | 16.08245479 | 26.8683 | 1.6e-10 | A3 3.1e-13 | über den Umkehrpunkt | instabil | 1.984e+5 | 0.02025 | 24 | Satellit 2. Ordnung von II.C-3 (T* das 1.97963-fache, Wort bis auf 2 Buchstaben) |
| 0.066285749802 | 0.112768618376 | 16.13620666 | 27.1445 | 4.0e-11 | B3 1.5e-13 | bestätigt | instabil | 1.05e+4 | 0.01344 | 24 | Satellit 2. Ordnung von II.C-3 (T* das 1.99999-fache) |
| 0.124839810470 | 0.060340960029 | 16.15675243 | 26.8747 | 1.4e-11 | B3 2.0e-12 | bestätigt | instabil | 1.20e+3 | 0.005480 | 24 | — |
| 0.111250765563 | 0.219850264376 | 16.17144440 | 21.1635 | 5.6e-13 | A3 1.1e-13 | bestätigt | instabil | 1.58e+4 | 0.006692 | 18 | — |
| 0.036352075291 | 0.016734462782 | 16.21236664 | 29.5458 | 1.9e-9 | A3 1.7e-11 | an der Rechengrenze | instabil | 5.354e+6 | 8.1e-4 | 26 | — |
| 0.089494593367 | 0.179634540636 | 16.28376831 | 24.0976 | 1.4e-8 | C 1.0e-13 | über den Umkehrpunkt | instabil | 5.313e+6 | 0.004436 | 22 | — |
| 0.064363422280 | 0.029495491938 | 16.28963137 | 29.1791 | 2.5e-8 | A3 9.6e-12 | über den Umkehrpunkt | instabil | 5.002e+6 | 0.003004 | 26 | — |
| 0.017775252147 | 0.030671196015 | 16.36218840 | 29.8706 | 5.6e-9 | B3 1.8e-13 | über den Umkehrpunkt | instabil | 1.975e+7 | 1.0e-3 | 28 | — |
| 0.069939947362 | 0.031225490157 | 16.38941703 | 29.2304 | 1.1e-8 | C 5.2e-13 | über den Umkehrpunkt | instabil | 5.247e+5 | 0.003169 | 26 | — |
| 0.072372064288 | 0.030957736688 | 16.39429913 | 29.1900 | 5.1e-9 | B3 4.4e-12 | über den Umkehrpunkt | instabil | 6.18e+4 | 0.002763 | 26 | — |
| 0.100339335289 | 0.228892204701 | 16.43884696 | 21.2781 | 1.5e-11 | A3 1.4e-13 | bestätigt | instabil | 4.299e+5 | 0.007859 | 2 | — |
| 0.048527924896 | 0.144921705928 | 16.43896178 | 26.7429 | 6.4e-11 | A3 6.4e-14 | bestätigt | instabil | 9.33e+4 | 0.02379 | 24 | Satellit 2. Ordnung von II.C-3 (T* das 1.97040-fache, Wort bis auf 4 Buchstaben) |
| 0.015966131797 | 0.099971826336 | 16.45199389 | 28.6887 | 1.5e-8 | B3 6.5e-14 | über den Umkehrpunkt | instabil | 1.511e+6 | 0.003372 | 24 | Satellit 3. Ordnung von Fund (0.084419, 0.218687) (T* das 3.01959-fache, Wort bis auf 4 Buchstaben) |
| 0.325075574490 | 0.144523159543 | 16.45336900 | 13.2871 | 2.0e-12 | B3 8.7e-15 | bestätigt | instabil | 63.4 | 0.1660 | 12 | nur Klasse von I.A-3 |
| 0.026328548060 | 0.161413367570 | 16.50706709 | 26.3616 | 4.2e-10 | B3 3.6e-14 | über den Umkehrpunkt | instabil | 1.917e+6 | 0.02877 | 24 | — |
| 0.080655176495 | 0.015637589421 | 16.52235423 | 29.3349 | 1.4e-9 | B3 2.9e-12 | über den Umkehrpunkt | instabil | 4.39e+4 | 7.3e-4 | 26 | — |
| 0.114303557277 | 0.223961213382 | 16.54437966 | 21.3114 | 4.9e-13 | C 2.7e-14 | bestätigt | instabil | 1.17e+4 | 0.2072 | 18 | nur Klasse von I.B-7 |
| 0.043243357601 | 0.089323365698 | 16.59792063 | 29.0032 | 1.7e-10 | C 1.8e-13 | über den Umkehrpunkt | instabil | 6.540e+5 | 0.02837 | 26 | — |
| 0.018031330643 | 0.107869453294 | 16.59884879 | 28.6886 | 9.0e-10 | B3 1.3e-13 | über den Umkehrpunkt | instabil | 5.520e+5 | 0.003731 | 24 | Satellit 3. Ordnung von Fund (0.084419, 0.218687) (T* das 3.01958-fache, Wort bis auf 4 Buchstaben) |
| 0.055793442452 | 0.083235152215 | 16.60078993 | 28.9794 | 1.2e-10 | A3 2.0e-13 | über den Umkehrpunkt | instabil | 1.420e+5 | 0.02111 | 26 | — |
| 0.086789080547 | 0.050122506128 | 16.64730424 | 29.0600 | 1.0e-10 | B3 9.4e-13 | über den Umkehrpunkt | instabil | 6.04e+3 | 0.006470 | 26 | — |
| 0.093035517060 | 0.046308196894 | 16.68622028 | 29.0142 | 1.6e-8 | B3 9.6e-12 | über den Umkehrpunkt | instabil | 5.334e+5 | 0.005255 | 26 | — |
| 0.064192533147 | 0.151698899430 | 16.77602569 | 26.7344 | 2.6e-9 | A3 2.5e-10 | an der Rechengrenze | instabil | 1.25e+3 | 8.6e-5 | 24 | — |
| 0.210649296901 | 0.175095020094 | 16.81545557 | 20.0607 | 2.0e-9 | B3 9.9e-12 | über den Umkehrpunkt | instabil | 9.86e+3 | 3.6e-5 | 18 | — |
| 0.312287688413 | 0.103614627617 | 16.81870619 | 15.7877 | 6.8e-13 | C 2.3e-14 | bestätigt | stabil | 1.00 | 0.01089 | 14 | nur Klasse von I.B-4 |
| 0.086718105767 | 0.132998261216 | 16.85472862 | 27.1445 | 4.4e-11 | A3 1.1e-13 | bestätigt | instabil | 1.05e+4 | 0.01384 | 24 | Satellit 2. Ordnung von II.C-3 (T* das 1.99999-fache) |
| 0.069261974791 | 0.153836208035 | 16.89948209 | 26.7345 | 5.8e-11 | A3 2.1e-12 | bestätigt | instabil | 701 | 0.002284 | 24 | — |
| 0.192226469906 | 0.196758814603 | 16.95402536 | 20.1406 | 9.5e-12 | B3 3.2e-14 | bestätigt | instabil | 1.84e+4 | 0.03063 | 18 | nur Klasse von II.C-11 |
| 0.339868335884 | 0.123634066200 | 16.97048846 | 13.2058 | 5.2e-12 | B3 8.5e-15 | bestätigt | instabil | 4.49e+3 | 0.1208 | 12 | nur Klasse von I.A-3 |
| 0.031903034546 | 0.030959226664 | 17.02964641 | 30.9768 | 2.4e-10 | A3 3.2e-13 | über den Umkehrpunkt | instabil | 7.976e+5 | 0.002443 | 28 | — |
| 0.031933562146 | 0.162840418661 | 17.06997315 | 27.1425 | 2.1e-11 | A3 1.1e-12 | bestätigt | instabil | 5.24e+3 | 0.01975 | 26 | — |
| 0.032777271533 | 0.208168353741 | 17.14737038 | 24.7726 | 5.5e-8 | C 4.3e-14 | über den Umkehrpunkt | instabil | 1.014e+9 | 0.09601 | 22 | — |
| 0.037448606284 | 0.015377600293 | 17.19910752 | 31.3382 | 2.2e-8 | B3 6.3e-12 | über den Umkehrpunkt | offen | 5.490e+7 | 6.3e-4 | 28 | Satellit 2. Ordnung von I.B-3 (T* das 1.98246-fache, Wort bis auf 4 Buchstaben) |
| 0.083490872152 | 0.159949189972 | 17.28436081 | 26.7277 | 6.2e-11 | B3 2.0e-12 | bestätigt | instabil | 789 | 0.002830 | 24 | — |
| 0.222881268503 | 0.116874829947 | 17.32699822 | 22.3037 | 3.5e-10 | B3 2.2e-14 | über den Umkehrpunkt | instabil | 1.27e+4 | 0.01461 | 20 | nur Klasse von I.A-6 · Satellit 5. Ordnung von I.A-1 (T* das 4.91447-fache, Wort bis auf 4 Buchstaben) |
| 0.088541397219 | 0.172539595426 | 17.35267304 | 26.0762 | 6.4e-10 | B3 3.3e-13 | über den Umkehrpunkt | instabil | 2.35e+4 | 3.1e-4 | 24 | — |
| 0.009998777328 | 0.174220530302 | 17.35556510 | 27.1548 | 5.1e-10 | A3 2.1e-13 | über den Umkehrpunkt | instabil | 4.505e+6 | 0.003459 | 22 | — |
| 0.044358533989 | 0.005159311511 | 17.38227481 | 31.6154 | 6.2e-9 | A3 1.2e-11 | an der Rechengrenze | offen | 3.015e+5 | 5.5e-6 | 28 | — |
| 0.094598787294 | 0.243391594303 | 17.39129614 | 21.7015 | 2.4e-9 | C 5.6e-14 | über den Umkehrpunkt | instabil | 3.951e+6 | 0.03128 | 18 | Satellit 3. Ordnung von I.B-1 (T* das 2.98820-fache, Wort bis auf 2 Buchstaben) |
| 0.213969362646 | 0.191214682750 | 17.52519822 | 19.8961 | 1.1e-11 | C 7.7e-15 | bestätigt | instabil | 9.65e+4 | 0.2794 | 18 | nur Klasse von I.B-8 |
| 0.155899418287 | 0.157060398735 | 17.60530565 | 24.7560 | 8.3e-10 | A3 1.4e-12 | über den Umkehrpunkt | instabil | 5.99e+4 | 0.005004 | 22 | nur Klasse von II.C-14 |
| 0.068572286076 | 0.020810473889 | 17.62948699 | 31.5594 | 4.4e-11 | B3 4.9e-13 | bestätigt | instabil | 5.65e+3 | 0.001454 | 28 | — |
| 0.228364693999 | 0.206628325319 | 17.64095078 | 18.3273 | 2.6e-9 | A3 2.2e-12 | über den Umkehrpunkt | instabil | 4.45e+4 | 8.6e-4 | 16 | Satellit 2. Ordnung von I.A-2 (T* das 2.02214-fache, Wort bis auf 2 Buchstaben) |
| 0.061324098447 | 0.038961935467 | 17.65910404 | 31.5894 | 1.2e-9 | B3 1.3e-12 | über den Umkehrpunkt | instabil | 1.846e+5 | 8.3e-4 | 28 | — |
| 0.102665377481 | 0.183153931028 | 17.66014315 | 25.5618 | 8.2e-9 | A3 1.3e-12 | über den Umkehrpunkt | instabil | 3.097e+7 | 0.001105 | 22 | — |
| 0.077024951090 | 0.120643593547 | 17.71293164 | 29.2649 | 1.3e-8 | A3 7.2e-12 | über den Umkehrpunkt | instabil | 6.791e+5 | 0.01958 | 26 | — |
| 0.067119128083 | 0.044767774692 | 17.72404557 | 31.5072 | 1.2e-10 | A3 3.7e-12 | über den Umkehrpunkt | instabil | 1.14e+4 | 0.006476 | 28 | — |
| 0.056444922038 | 0.164286547758 | 17.88623680 | 28.0282 | 2.1e-10 | C 1.9e-14 | über den Umkehrpunkt | instabil | 2.08e+4 | 0.005614 | 26 | — |
| 0.196528299403 | 0.180350332251 | 17.91865584 | 21.9325 | 1.1e-10 | B3 1.3e-14 | über den Umkehrpunkt | instabil | 6.607e+5 | 0.09352 | 20 | — |
| 0.091306982297 | 0.029800078083 | 17.95098302 | 31.4687 | 4.0e-10 | B3 2.5e-12 | über den Umkehrpunkt | instabil | 1.06e+4 | 0.001270 | 28 | — |
| 0.240404363594 | 0.165114486737 | 18.01438505 | 20.0705 | 8.1e-12 | B3 5.2e-14 | bestätigt | instabil | 1.53e+4 | 0.02564 | 18 | nur Klasse von II.C-11 |
| 0.026179670889 | 0.023146460190 | 18.05136946 | 32.9602 | 3.1e-8 | C 4.1e-11 | an der Rechengrenze | instabil | 4.720e+6 | 0.001062 | 30 | — |
| 0.025410567692 | 0.047875465200 | 18.08471173 | 32.7369 | 2.5e-8 | B3 7.3e-12 | über den Umkehrpunkt | instabil | 1.323e+8 | 0.004418 | 30 | — |
| 0.093563895904 | 0.231654725457 | 18.09837145 | 23.4323 | 7.3e-8 | R 7.4e-15 | über den Umkehrpunkt | instabil | 8.768e+6 | 5.5e-4 | 0 | — |
| 0.070856891285 | 0.159293029953 | 18.18136598 | 28.4560 | 6.5e-9 | A3 1.4e-11 | an der Rechengrenze | instabil | 1.588e+5 | 0.005481 | 26 | — |
| 0.100000988824 | 0.048558205158 | 18.25717799 | 31.4896 | 1.4e-9 | B3 7.2e-13 | über den Umkehrpunkt | instabil | 2.447e+5 | 0.001417 | 28 | — |
| 0.064532001182 | 0.083123911504 | 18.30065964 | 31.7762 | 3.5e-11 | A3 1.4e-12 | bestätigt | instabil | 3.54e+4 | 0.004791 | 28 | — |
| 0.062619415343 | 0.208767857780 | 18.32392676 | 25.9927 | 2.1e-8 | B3 4.2e-14 | über den Umkehrpunkt | instabil | 1.393e+7 | 0.1051 | 24 | — |
| 0.015569044576 | 0.028115544514 | 18.33321725 | 33.5065 | 9.7e-7 | B3 2.1e-12 | über den Umkehrpunkt | instabil | 7.752e+7 | 6.3e-4 | 32 | — |
| 0.207885389322 | 0.164449476020 | 18.33710222 | 22.5757 | 5.8e-8 | R 9.6e-14 | über den Umkehrpunkt | instabil | 5.739e+6 | 0.001229 | 0 | — |
| 0.023034047864 | 0.054335906877 | 18.49531534 | 33.3881 | 1.5e-6 | B3 3.4e-11 | an der Rechengrenze | instabil | 3.889e+9 | 0.004955 | 30 | nur Klasse von II.C-23 |
| 0.278759187669 | 0.196486233398 | 18.49675504 | 16.2804 | 9.4e-12 | A3 6.5e-14 | bestätigt | instabil | 5.35e+3 | 0.007290 | 14 | — |
| 0.209515027220 | 0.124237737148 | 18.55639599 | 24.4950 | 1.1e-11 | A3 8.2e-14 | bestätigt | instabil | 9.38e+3 | 0.007573 | 22 | — |
| 0.040085459886 | 0.034611464659 | 18.56190440 | 33.6233 | 2.6e-9 | A3 1.4e-11 | an der Rechengrenze | instabil | 1.627e+6 | 9.9e-4 | 30 | — |
| 0.274533434014 | 0.110118069114 | 18.56465717 | 20.3328 | 6.1e-13 | B3 3.7e-14 | bestätigt | instabil | 2.85 | 0.004700 | 18 | nur Klasse von II.C-8 |
| 0.072105350914 | 0.180927271334 | 18.57998188 | 27.8687 | 2.1e-7 | C 2.1e-13 | über den Umkehrpunkt | instabil | 4.839e+7 | 0.002805 | 26 | — |
| 0.032373039920 | 0.041327822669 | 18.58784971 | 33.6786 | 2.2e-8 | B3 1.2e-12 | über den Umkehrpunkt | instabil | 3.876e+6 | 2.2e-4 | 30 | — |
| 0.116062172607 | 0.047822623713 | 18.65082915 | 31.6000 | 2.1e-10 | B3 4.4e-13 | über den Umkehrpunkt | instabil | 6.14e+3 | 8.4e-4 | 28 | Satellit 2. Ordnung von Fund (0.232901, 0.147984) (T* das 2.00104-fache, Wort bis auf 2 Buchstaben) |
| 0.053051963777 | 0.022016790795 | 18.65579500 | 33.7091 | 2.8e-6 | C 1.1e-11 | an der Rechengrenze | offen | 4.574e+8 | 0.001416 | 30 | Satellit 3. Ordnung von Fund (0.225137, 0.193367) (T* das 2.98134-fache, Wort bis auf 4 Buchstaben) |
| 0.030843642793 | 0.015227048395 | 18.68139439 | 34.1171 | 1.9e-6 | B3 1.6e-10 | an der Rechengrenze | offen | 3.078e+8 | 5.7e-4 | 30 | Satellit 3. Ordnung von II.C-2 (T* das 3.02316-fache, Wort bis auf 4 Buchstaben) |
| 0.121014902024 | 0.231385395247 | 18.70710278 | 23.3441 | 8.8e-12 | A3 2.7e-13 | bestätigt | instabil | 9.53e+3 | 0.006126 | 20 | — |
| 0.073416267135 | 0.007250713817 | 18.73808595 | 33.4916 | 5.4e-8 | A3 8.9e-11 | an der Rechengrenze | offen | 7.764e+5 | 1.6e-4 | 30 | — |
| 0.094374150359 | 0.242305840589 | 18.82407572 | 23.5760 | 1.3e-9 | C 1.1e-14 | über den Umkehrpunkt | instabil | 1.530e+6 | 0.03720 | 20 | — |
| 0.024944363874 | 0.164253735630 | 18.90709737 | 30.0529 | 3.7e-8 | B3 1.8e-13 | über den Umkehrpunkt | instabil | 7.538e+6 | 0.02634 | 28 | — |
| 0.136920497366 | 0.226078647301 | 18.91096872 | 23.3432 | 2.4e-11 | C 1.3e-14 | bestätigt | instabil | 1.73e+4 | 0.1286 | 20 | — |
| 0.086456852106 | 0.045737042608 | 18.91636477 | 33.1026 | 5.0e-10 | B3 6.3e-13 | über den Umkehrpunkt | instabil | 8.83e+4 | 0.005503 | 30 | — |
| 0.031504405268 | 0.008364522870 | 18.96715461 | 34.6599 | 5.0e-8 | B3 2.3e-10 | an der Rechengrenze | instabil | 1.607e+6 | 1.8e-4 | 30 | — |
| 0.030818407308 | 0.124746196642 | 19.02151168 | 32.0999 | 3.6e-9 | A3 3.7e-12 | über den Umkehrpunkt | instabil | 8.105e+5 | 0.03579 | 28 | — |
| 0.114252191435 | 0.149825228462 | 19.04601912 | 28.9664 | 4.1e-11 | C 2.5e-12 | über den Umkehrpunkt | instabil | 7.91e+3 | 0.001811 | 26 | — |
| 0.077729734293 | 0.035275127526 | 19.05244991 | 33.7342 | 8.8e-10 | A3 1.9e-11 | an der Rechengrenze | instabil | 2.791e+6 | 8.4e-5 | 30 | Satellit 3. Ordnung von Fund (0.334287, 0.114623) (T* das 3.00371-fache, Wort bis auf 4 Buchstaben) |
| 0.041652147929 | 0.071223300127 | 19.06617099 | 33.8413 | 1.8e-9 | A3 4.7e-12 | über den Umkehrpunkt | instabil | 1.332e+6 | 0.01734 | 30 | — |
| 0.035596706026 | 0.026197054732 | 19.07164807 | 34.6952 | 4.3e-8 | A3 4.0e-11 | an der Rechengrenze | instabil | 3.039e+6 | 0.001967 | 30 | — |
| 0.145975697655 | 0.164515992838 | 19.09034156 | 26.9402 | 2.3e-9 | B3 8.3e-13 | über den Umkehrpunkt | instabil | 2.821e+5 | 0.004212 | 24 | — |
| 0.032349241772 | 0.077806362539 | 19.15224187 | 33.9432 | 2.9e-8 | A3 1.7e-11 | an der Rechengrenze | instabil | 3.115e+6 | 0.01609 | 30 | — |
| 0.032354889057 | 0.079221422748 | 19.16972638 | 33.9355 | 2.2e-10 | A3 1.4e-12 | über den Umkehrpunkt | instabil | 1.795e+6 | 0.01500 | 30 | — |
| 0.030834818707 | 0.127839600637 | 19.18676025 | 32.2448 | 3.2e-8 | B3 4.1e-12 | über den Umkehrpunkt | instabil | 3.820e+7 | 0.01123 | 28 | — |
| 0.209467605642 | 0.145153326991 | 19.22499367 | 24.4947 | 5.1e-10 | B3 6.0e-12 | über den Umkehrpunkt | instabil | 2.45e+4 | 3.5e-4 | 22 | — |
| 0.175339102025 | 0.195495086768 | 19.27264788 | 23.9288 | 7.5e-12 | C 7.1e-15 | bestätigt | instabil | 2.80e+4 | 0.1828 | 22 | — |
| 0.085884830224 | 0.050967742300 | 19.28931745 | 33.6843 | 6.6e-10 | B3 1.2e-12 | über den Umkehrpunkt | instabil | 2.13e+4 | 0.001782 | 30 | — |
| 0.199449036726 | 0.157432688347 | 19.29030946 | 24.6377 | 5.8e-8 | B3 6.5e-12 | über den Umkehrpunkt | instabil | 5.018e+6 | 2.1e-4 | 22 | — |
| 0.030001453539 | 0.134803244067 | 19.29326711 | 32.1184 | 8.7e-8 | A3 1.0e-11 | an der Rechengrenze | instabil | 9.580e+7 | 0.03249 | 28 | Satellit 2. Ordnung von II.C-4 (T* das 2.02704-fache, Wort bis auf 4 Buchstaben) |
| 0.212841372886 | 0.142953134535 | 19.29522366 | 24.4602 | 1.4e-9 | C 5.3e-14 | über den Umkehrpunkt | instabil | 2.076e+5 | 0.03351 | 22 | — |
| 0.244274607531 | 0.137869137872 | 19.34039639 | 22.5142 | 1.4e-10 | A3 1.4e-12 | über den Umkehrpunkt | instabil | 2.46e+3 | 0.003811 | 20 | Satellit 2. Ordnung von II.C-2 (T* das 1.99502-fache, Wort bis auf 2 Buchstaben) |
| 0.065536152370 | 0.077387690925 | 19.35438653 | 33.7438 | 4.8e-11 | A3 1.4e-12 | bestätigt | instabil | 1.46e+4 | 0.001398 | 30 | — |
| 0.092437899903 | 0.032863380134 | 19.36227930 | 33.8728 | 6.9e-11 | A3 2.9e-12 | bestätigt | instabil | 903 | 0.002786 | 30 | — |
| 0.030787421056 | 0.164476098039 | 19.37851927 | 30.7347 | 9.4e-11 | A3 2.0e-12 | bestätigt | instabil | 6.50e+3 | 0.01863 | 30 | — |
| 0.075856366283 | 0.068145409305 | 19.38577833 | 33.7785 | 2.9e-9 | A3 4.1e-11 | an der Rechengrenze | offen | 2.98e+4 | 7.1e-6 | 26 | — |
| 0.012648320561 | 0.040264710609 | 19.41275552 | 35.3464 | 3.6e-7 | C 2.0e-12 | über den Umkehrpunkt | instabil | 2.286e+7 | 7.4e-4 | 34 | — |
| 0.027539722870 | 0.158338048297 | 19.41475096 | 31.1615 | 3.3e-11 | A3 4.8e-13 | bestätigt | instabil | 7.71e+4 | 0.02283 | 28 | — |
| 0.100458601828 | 0.054679669004 | 19.42785774 | 33.3824 | 2.7e-10 | B3 1.8e-12 | über den Umkehrpunkt | instabil | 1.203e+5 | 0.004185 | 30 | — |
| 0.078314165878 | 0.075639513831 | 19.53300485 | 33.7786 | 3.2e-9 | A3 5.0e-12 | über den Umkehrpunkt | instabil | 2.537e+5 | 0.001603 | 22 | — |
| 0.115420677689 | 0.215956674428 | 19.55395888 | 25.7109 | 2.0e-10 | A3 2.1e-13 | über den Umkehrpunkt | instabil | 1.168e+7 | 0.004956 | 22 | — |
| 0.214994099133 | 0.148094410838 | 19.55571189 | 24.4077 | 8.9e-8 | C 1.3e-12 | über den Umkehrpunkt | instabil | 3.869e+7 | 0.03339 | 22 | — |
| 0.105840325233 | 0.119549768238 | 19.56419073 | 31.4589 | 1.2e-9 | A3 7.9e-12 | über den Umkehrpunkt | instabil | 1.104e+5 | 0.01175 | 28 | — |
| 0.253147213557 | 0.130825112653 | 19.63558563 | 22.4685 | 9.2e-12 | A3 7.7e-13 | bestätigt | instabil | 4.06e+3 | 0.001383 | 20 | nur Klasse von II.C-12 · Satellit 2. Ordnung von Fund (0.334287, 0.114623) (T* das 2.00061-fache, Wort bis auf 2 Buchstaben) |
| 0.088536308693 | 0.129628731473 | 19.66622260 | 31.7703 | 8.1e-8 | A3 1.9e-11 | an der Rechengrenze | instabil | 8.306e+5 | 0.001845 | 28 | — |
| 0.077803088760 | 0.174259754657 | 19.68783725 | 29.7867 | 2.0e-8 | B3 2.6e-12 | über den Umkehrpunkt | instabil | 1.281e+5 | 1.6e-4 | 28 | nur Klasse von I.A-10 |
| 0.236022351366 | 0.152827689212 | 19.70181323 | 22.8752 | 8.2e-11 | B3 6.7e-13 | bestätigt | instabil | 9.33e+3 | 0.001236 | 20 | Satellit 2. Ordnung von I.B-2 (T* das 1.99263-fache, Wort bis auf 4 Buchstaben) |
| 0.063689230477 | 0.160556132965 | 19.76911120 | 31.0375 | 4.2e-8 | B3 1.0e-12 | über den Umkehrpunkt | instabil | 1.506e+6 | 0.001510 | 28 | — |
| 0.307290892666 | 0.132759360016 | 19.80962180 | 18.0462 | 1.1e-11 | B3 8.6e-14 | bestätigt | instabil | 204 | 0.006976 | 16 | — |
| 0.048929309256 | 0.022408664471 | 19.80976477 | 35.8671 | 3.3e-7 | B3 2.2e-12 | über den Umkehrpunkt | instabil | 1.219e+7 | 0.001917 | 32 | — |
| 0.044020609467 | 0.046282641408 | 19.83034557 | 35.6900 | 8.9e-8 | A3 7.5e-12 | über den Umkehrpunkt | instabil | 2.235e+8 | 0.001694 | 32 | — |
| 0.112804109942 | 0.124805060498 | 19.86812679 | 31.4589 | 5.0e-10 | A3 2.2e-12 | über den Umkehrpunkt | instabil | 7.40e+4 | 0.009063 | 28 | — |
| 0.229890439748 | 0.133030759967 | 19.89993459 | 24.4539 | 2.9e-9 | B3 4.8e-13 | über den Umkehrpunkt | instabil | 2.505e+6 | 0.005723 | 22 | — |
| 0.141172415604 | 0.239481187056 | 19.92549166 | 23.4153 | 6.6e-12 | A3 8.8e-14 | bestätigt | instabil | 2.23e+3 | 0.006981 | 20 | Satellit 2. Ordnung von I.B-2 (T* das 2.03968-fache, Wort bis auf 2 Buchstaben) |
| 0.168675454012 | 0.204783596025 | 19.93536303 | 24.5229 | 9.5e-10 | A3 2.9e-13 | über den Umkehrpunkt | instabil | 2.439e+7 | 0.01587 | 22 | — |
| 0.217552157750 | 0.192636435612 | 19.94964571 | 22.3228 | 3.2e-10 | A3 1.0e-12 | über den Umkehrpunkt | instabil | 2.820e+5 | 0.002759 | 20 | Satellit 2. Ordnung von II.C-2 (T* das 1.97805-fache, Wort bis auf 2 Buchstaben) |
| 0.200852329576 | 0.184162380404 | 19.94970395 | 23.9228 | 1.2e-11 | C 8.3e-15 | bestätigt | instabil | 2.82e+3 | 0.1601 | 22 | — |
| 0.056815426887 | 0.029142966655 | 19.97045878 | 35.9427 | 6.4e-6 | B3 1.0e-12 | über den Umkehrpunkt | offen | 1.543e+9 | 8.2e-4 | 32 | — |
| 0.183641591384 | 0.242226202425 | 20.01015593 | 21.1618 | 4.8e-8 | B3 2.6e-10 | an der Rechengrenze | offen | 1.25e+4 | 5.1e-5 | 18 | — |
| 0.026180550643 | 0.070680604236 | 20.05936696 | 35.8096 | 1.5e-10 | A3 3.0e-12 | über den Umkehrpunkt | instabil | 2.535e+5 | 0.002924 | 32 | — |
| 0.161357441974 | 0.192797827971 | 20.06479640 | 25.8489 | 2.1e-11 | B3 9.8e-15 | bestätigt | instabil | 2.35e+3 | 0.1208 | 24 | — |
| 0.153433621036 | 0.274137122722 | 20.10386126 | 20.3012 | 1.2e-11 | B3 1.1e-12 | bestätigt | instabil | 245 | 0.01860 | 16 | nur Klasse von I.A-4 |
| 0.064832808465 | 0.018633441546 | 20.12301556 | 36.1304 | 5.1e-9 | A3 1.8e-11 | an der Rechengrenze | instabil | 7.29e+4 | 0.001217 | 32 | — |
| 0.075719493356 | 0.107925889448 | 20.12489510 | 33.8057 | 1.1e-9 | C 6.1e-14 | über den Umkehrpunkt | instabil | 1.174e+6 | 0.02043 | 30 | — |
| 0.061055244378 | 0.031071634660 | 20.14839330 | 36.1498 | 1.2e-8 | A3 1.5e-11 | an der Rechengrenze | instabil | 1.333e+6 | 4.7e-4 | 32 | — |
| 0.052876053551 | 0.166306813684 | 20.25274970 | 31.6876 | 1.1e-9 | C 5.2e-14 | über den Umkehrpunkt | instabil | 4.44e+4 | 0.005050 | 30 | — |
| 0.056424251430 | 0.072692863740 | 20.27375713 | 35.6795 | 2.3e-9 | B3 2.7e-13 | über den Umkehrpunkt | instabil | 3.853e+6 | 0.006264 | 32 | — |
| 0.167683587685 | 0.084041012088 | 20.31208594 | 30.9481 | 5.1e-10 | B3 2.3e-14 | über den Umkehrpunkt | instabil | 1.653e+5 | 0.001965 | 28 | — |
| 0.077799897667 | 0.214750552548 | 20.42305354 | 28.1712 | 2.3e-9 | B3 1.9e-12 | über den Umkehrpunkt | instabil | 6.20e+4 | 0.001252 | 24 | Satellit 3. Ordnung von Fund (0.060089, 0.391129) (T* das 2.97437-fache) |
| 0.087795965506 | 0.180201696462 | 20.54240602 | 30.4168 | 1.1e-8 | A3 1.4e-12 | über den Umkehrpunkt | instabil | 6.354e+7 | 0.004671 | 28 | — |
| 0.091711768304 | 0.030211595891 | 20.56051943 | 36.0249 | 2.1e-10 | A3 5.0e-12 | über den Umkehrpunkt | instabil | 5.18e+3 | 4.3e-4 | 32 | — |
| 0.018351954082 | 0.083801311083 | 20.60156357 | 36.4634 | 5.0e-7 | B3 1.0e-13 | über den Umkehrpunkt | instabil | 1.553e+9 | 0.004512 | 32 | — |
| 0.043524079418 | 0.123152034403 | 20.62754230 | 34.7090 | 1.4e-7 | A3 5.2e-12 | über den Umkehrpunkt | instabil | 4.056e+7 | 0.008274 | 30 | — |
| 0.090300152718 | 0.018207526702 | 20.65619735 | 36.3492 | 5.0e-10 | B3 1.3e-13 | über den Umkehrpunkt | instabil | 7.85e+3 | 9.0e-4 | 32 | — |
| 0.145229978836 | 0.206743211725 | 20.67031763 | 26.5233 | 6.8e-10 | A3 9.0e-13 | über den Umkehrpunkt | instabil | 1.324e+6 | 0.02367 | 24 | Satellit 2. Ordnung von I.A-3 (T* das 2.02548-fache, Wort bis auf 2 Buchstaben) |
| 0.087044579746 | 0.231458453453 | 20.67605915 | 26.9843 | 1.6e-6 | R 1.7e-13 | über den Umkehrpunkt | offen | 2.156e+7 | 6.3e-5 | 0 | — |
| 0.120689502668 | 0.227725047117 | 20.76374160 | 26.2060 | 3.1e-8 | B3 4.1e-12 | über den Umkehrpunkt | instabil | 2.395e+6 | 0.009196 | 22 | — |
| 0.222914459402 | 0.116367994024 | 20.85346487 | 26.8607 | 4.1e-10 | B3 3.9e-13 | über den Umkehrpunkt | instabil | 8.74e+3 | 0.01429 | 24 | nur Klasse von II.C-15 · Satellit 6. Ordnung von I.A-1 (T* das 5.91856-fache, Wort bis auf 4 Buchstaben) |
| 0.103985879461 | 0.022528055874 | 20.89909165 | 36.2415 | 1.5e-10 | A3 1.9e-11 | an der Rechengrenze | instabil | 1.17e+3 | 7.9e-5 | 32 | — |
| 0.063571277337 | 0.181426292051 | 20.90858574 | 31.5370 | 1.8e-7 | C 7.5e-14 | über den Umkehrpunkt | instabil | 2.018e+8 | 0.002150 | 30 | — |
| 0.105325403830 | 0.024932420521 | 20.94193245 | 36.2414 | 7.8e-10 | B3 9.5e-13 | über den Umkehrpunkt | instabil | 518 | 0.001427 | 32 | — |
| 0.143235603734 | 0.196059691677 | 20.95983777 | 27.7324 | 9.1e-12 | C 3.5e-15 | bestätigt | instabil | 1.23e+3 | 0.1042 | 26 | — |
| 0.178608014182 | 0.093731801521 | 20.96878784 | 30.9575 | 4.9e-11 | B3 2.2e-13 | bestätigt | instabil | 100 | 5.6e-4 | 28 | — |
| 0.163521395069 | 0.150307259483 | 20.96926516 | 29.4231 | 5.3e-10 | B3 1.7e-12 | über den Umkehrpunkt | instabil | 9.91e+3 | 8.3e-4 | 26 | — |
| 0.020542620058 | 0.013551600459 | 21.01315283 | 38.4868 | 4.4e-7 | A3 1.9e-11 | an der Rechengrenze | instabil | 3.155e+8 | 1.6e-4 | 34 | — |
| 0.143017789851 | 0.198072462907 | 21.05580367 | 27.7328 | 2.9e-11 | C 3.2e-15 | bestätigt | instabil | 1.03e+3 | 0.1175 | 26 | — |
| 0.034772960841 | 0.004301825397 | 21.06938257 | 38.4696 | 4.1e-6 | A3 3.7e-10 | an der Rechengrenze | offen | 1.619e+8 | 5.2e-5 | 34 | — |
| 0.031189841728 | 0.024889089152 | 21.08792321 | 38.4330 | 1.4e-7 | A3 1.2e-11 | an der Rechengrenze | instabil | 9.873e+7 | 0.001256 | 34 | — |
| 0.154078144980 | 0.078836815691 | 21.10377402 | 33.1107 | 3.6e-12 | C 8.5e-14 | bestätigt | instabil | 1.99e+3 | 0.003694 | 30 | — |
| 0.298831383813 | 0.140732912025 | 21.16571136 | 19.7368 | 6.3e-10 | C 5.6e-15 | über den Umkehrpunkt | instabil | 7.981e+5 | 0.1240 | 18 | nur Klasse von I.B-8 |
| 0.181863095410 | 0.077156913071 | 21.21062475 | 31.6156 | 4.3e-10 | A3 2.5e-11 | an der Rechengrenze | offen | 17.8 | 4.1e-6 | 28 | Satellit 2. Ordnung von I.B-3 (T* das 2.00000-fache, Wort bis auf 2 Buchstaben) |
| 0.215253825952 | 0.232308831364 | 21.21150065 | 21.1635 | 1.2e-10 | B3 1.4e-12 | über den Umkehrpunkt | instabil | 1.58e+4 | 0.008018 | 18 | — |
| 0.165175353142 | 0.201857759091 | 21.23707277 | 26.5277 | 4.1e-12 | A3 1.1e-12 | bestätigt | instabil | 1.93e+3 | 0.008883 | 24 | Satellit 2. Ordnung von I.A-3 (T* das 2.02582-fache, Wort bis auf 4 Buchstaben) |
| 0.023987688942 | 0.165995694458 | 21.24456761 | 33.6701 | 3.8e-8 | B3 9.0e-14 | über den Umkehrpunkt | instabil | 1.984e+7 | 0.02481 | 32 | — |
| 0.049509289600 | 0.045857384499 | 21.27063984 | 38.1903 | 1.2e-10 | B3 2.3e-12 | über den Umkehrpunkt | instabil | 1.078e+5 | 0.001582 | 34 | — |
| 0.303471565859 | 0.165193642777 | 21.28512402 | 18.2669 | 1.2e-10 | B3 3.3e-14 | über den Umkehrpunkt | instabil | 1.52e+4 | 0.005940 | 16 | — |
| 0.076705138225 | 0.039669563165 | 21.28926854 | 37.6617 | 4.0e-7 | A3 6.6e-11 | an der Rechengrenze | instabil | 1.622e+7 | 0.004668 | 34 | — |
| 0.044634297144 | 0.015588409420 | 21.29036361 | 38.6766 | 7.4e-7 | C 6.7e-12 | über den Umkehrpunkt | instabil | 2.496e+7 | 7.7e-4 | 34 | — |
| 0.055017988497 | 0.035466560075 | 21.30162101 | 38.2982 | 1.1e-8 | B3 1.0e-10 | an der Rechengrenze | instabil | 3.751e+6 | 2.5e-5 | 34 | — |
| 0.057352038537 | 0.070556010780 | 21.31548204 | 37.5515 | 1.4e-7 | C 8.4e-14 | über den Umkehrpunkt | instabil | 8.140e+7 | 0.01615 | 34 | — |
| 0.158688046548 | 0.226193493629 | 21.33962152 | 25.2353 | 7.1e-12 | C 1.8e-13 | bestätigt | instabil | 5.50e+3 | 0.07913 | 22 | nur Klasse von I.B-11 |
| 0.090550237399 | 0.240328728851 | 21.41053408 | 27.1035 | 6.4e-10 | C 4.3e-14 | über den Umkehrpunkt | instabil | 1.655e+5 | 0.04166 | 24 | — |
| 0.055277075257 | 0.016901833183 | 21.41608633 | 38.6884 | 1.4e-9 | C 1.2e-12 | über den Umkehrpunkt | instabil | 5.294e+5 | 0.001121 | 34 | — |
| 0.135261995663 | 0.161885020130 | 21.42284865 | 30.9323 | 8.0e-11 | B3 1.1e-12 | bestätigt | instabil | 2.58e+3 | 0.002015 | 28 | nur Klasse von I.A-10 |
| 0.278750700535 | 0.261033423222 | 21.43240548 | 14.5038 | 8.0e-12 | B3 3.6e-13 | bestätigt | instabil | 7.35e+3 | 0.03403 | 12 | Satellit 2. Ordnung von I.B-1 (T* das 1.99711-fache) |
| 0.053395525198 | 0.292797762323 | 21.45245140 | 23.3156 | 2.2e-11 | C 2.5e-14 | bestätigt | instabil | 1.96e+3 | 0.03392 | 18 | — |
| 0.164397086164 | 0.223949868592 | 21.45389448 | 25.2286 | 5.0e-13 | B3 5.9e-14 | bestätigt | instabil | 6.42e+3 | 0.04704 | 22 | nur Klasse von I.B-11 |
| 0.042799018645 | 0.087559166566 | 21.48292747 | 37.6072 | 1.5e-7 | C 4.4e-14 | über den Umkehrpunkt | instabil | 3.535e+8 | 0.02671 | 34 | — |
| 0.106894336651 | 0.135494600777 | 21.52566174 | 33.8046 | 4.4e-9 | C 6.7e-14 | über den Umkehrpunkt | instabil | 7.493e+5 | 0.007737 | 30 | — |
| 0.270539951132 | -0.144076939705 | 21.56335533 | 22.5492 | 1.6e-10 | C 4.0e-14 | über den Umkehrpunkt | instabil | 8.06e+3 | 0.002494 | 20 | — |
| 0.057607948188 | 0.057042972520 | 21.60433262 | 38.3925 | 1.3e-9 | A3 4.8e-12 | über den Umkehrpunkt | instabil | 5.87e+4 | 7.2e-4 | 34 | — |
| 0.090263744198 | 0.047120346736 | 21.61257482 | 37.6644 | 3.0e-10 | B3 5.5e-13 | über den Umkehrpunkt | instabil | 2.33e+4 | 0.005584 | 34 | — |
| 0.140913897226 | 0.164016802919 | 21.70746029 | 30.9291 | 6.7e-10 | B3 1.6e-13 | über den Umkehrpunkt | instabil | 4.86e+4 | 0.004689 | 28 | nur Klasse von I.A-10 |
| 0.116195893855 | 0.266368547109 | 21.71556978 | 24.2961 | 6.5e-9 | B3 5.9e-13 | über den Umkehrpunkt | offen | 4.63e+4 | 5.1e-6 | 20 | nur Klasse von I.A-6 |
| 0.023897865838 | 0.079149370749 | 21.75675552 | 38.6114 | 1.8e-7 | A3 6.3e-11 | an der Rechengrenze | instabil | 9.174e+7 | 0.004171 | 34 | — |
| 0.084311829555 | 0.037234016623 | 21.76199372 | 38.2933 | 3.1e-8 | B3 8.4e-11 | an der Rechengrenze | instabil | 9.793e+5 | 2.1e-4 | 34 | — |
| 0.085687774417 | 0.039976379591 | 21.76329887 | 38.2078 | 1.5e-10 | B3 3.2e-13 | über den Umkehrpunkt | instabil | 2.02e+4 | 0.004323 | 34 | — |
| 0.082288547622 | 0.051905333512 | 21.79743989 | 38.1643 | 7.8e-8 | B3 9.5e-11 | an der Rechengrenze | offen | 1.342e+6 | 5.6e-6 | 34 | — |
| 0.130122741360 | 0.197140469027 | 21.92847822 | 29.5864 | 4.6e-11 | B3 2.6e-14 | bestätigt | instabil | 6.17e+3 | 0.08914 | 28 | — |
| 0.092296738170 | 0.039846942274 | 21.94397524 | 38.2938 | 8.6e-9 | A3 4.1e-11 | an der Rechengrenze | offen | 9.62e+3 | 2.3e-6 | 34 | — |
| 0.321817398618 | 0.148389882002 | 21.96440423 | 17.8874 | 3.6e-11 | A3 4.2e-13 | bestätigt | instabil | 5.06e+3 | 0.009285 | 16 | Satellit 2. Ordnung von I.A-2 (T* das 1.97360-fache, Wort bis auf 4 Buchstaben) |
| 0.096614284845 | 0.109377606755 | 21.97379046 | 36.1469 | 9.2e-9 | B3 2.6e-12 | über den Umkehrpunkt | instabil | 1.576e+6 | 9.1e-5 | 32 | — |
| 0.071437329735 | 0.175163938841 | 22.00739316 | 33.4163 | 1.9e-8 | B3 1.5e-12 | über den Umkehrpunkt | offen | 4.153e+5 | 1.0e-4 | 32 | — |
| 0.099718095881 | 0.157437425126 | 22.02667812 | 33.6462 | 4.4e-7 | A3 1.6e-10 | an der Rechengrenze | instabil | 7.879e+6 | 6.9e-4 | 26 | — |
| 0.096652459690 | 0.026792285469 | 22.05085547 | 38.4896 | 2.3e-10 | B3 2.0e-12 | über den Umkehrpunkt | instabil | 1.06e+4 | 0.001800 | 34 | — |
| 0.044184792731 | 0.053199549919 | 22.06891344 | 39.5776 | 5.7e-8 | B3 4.0e-13 | über den Umkehrpunkt | instabil | 7.517e+7 | 0.01007 | 36 | — |
| 0.274844888009 | 0.271067342196 | 22.11288296 | 14.5041 | 2.1e-11 | B3 1.2e-13 | bestätigt | instabil | 4.13e+4 | 0.01324 | 12 | Satellit 2. Ordnung von I.B-1 (T* das 1.99716-fache) |
| 0.096713702398 | 0.058717045456 | 22.18201529 | 38.1707 | 4.7e-11 | A3 8.6e-13 | bestätigt | instabil | 9.39e+3 | 0.001557 | 34 | — |
| 0.145797806071 | 0.159077718682 | 22.26581515 | 31.7614 | 4.2e-9 | A3 5.5e-12 | über den Umkehrpunkt | instabil | 2.60e+4 | 8.4e-5 | 28 | — |
| 0.052691431068 | 0.032505153152 | 22.37541203 | 40.3210 | 1.5e-7 | B3 3.6e-13 | über den Umkehrpunkt | instabil | 2.207e+8 | 0.003988 | 36 | — |
| 0.002695375888 | 0.041010828975 | 22.42784375 | 40.8551 | 5.8e-7 | B3 7.0e-14 | über den Umkehrpunkt | instabil | 1.060e+9 | 9.9e-4 | 40 | — |
| 0.028525579723 | 0.083186993315 | 22.46517473 | 39.6856 | 1.3e-6 | A3 7.5e-11 | an der Rechengrenze | instabil | 2.954e+9 | 0.002206 | 34 | — |
| 0.029181525864 | 0.068871206844 | 22.47499864 | 40.1396 | 3.2e-7 | B3 3.8e-13 | über den Umkehrpunkt | instabil | 5.324e+8 | 0.01078 | 36 | — |
| 0.341612408761 | 0.107584032980 | 22.50849262 | 17.9084 | 6.0e-11 | B3 3.3e-14 | bestätigt | instabil | 5.26e+3 | 0.007587 | 16 | nur Klasse von I.A-4 |
| 0.156351743028 | 0.160876668967 | 22.55937322 | 31.4658 | 5.6e-9 | B3 1.7e-11 | an der Rechengrenze | instabil | 4.539e+5 | 0.008222 | 28 | — |
| 0.050432979320 | 0.167604690594 | 22.57298656 | 35.2822 | 4.1e-9 | C 7.8e-14 | über den Umkehrpunkt | instabil | 7.82e+4 | 0.004704 | 34 | — |
| 0.020724234360 | 0.023871189024 | 22.58683507 | 41.2875 | 2.1e-8 | A3 2.0e-11 | an der Rechengrenze | instabil | 3.798e+7 | 7.9e-4 | 38 | — |
| 0.021575283814 | 0.203466747978 | 22.59389630 | 33.1298 | 3.9e-6 | C 4.8e-14 | über den Umkehrpunkt | instabil | 9.725e+10 | 0.06925 | 32 | — |
| 0.059815776915 | 0.020654659292 | 22.60077052 | 40.6917 | 2.2e-10 | A3 2.8e-12 | über den Umkehrpunkt | instabil | 1.78e+3 | 0.001578 | 36 | — |
| 0.045606386300 | 0.016613491617 | 22.61195969 | 41.0524 | 4.7e-9 | A3 3.6e-11 | an der Rechengrenze | instabil | 9.39e+4 | 1.8e-4 | 36 | — |
| 0.058607628776 | 0.049099395324 | 22.62310602 | 40.3525 | 3.2e-8 | A3 4.4e-11 | an der Rechengrenze | instabil | 1.702e+5 | 0.003048 | 36 | — |
| 0.088422975430 | 0.239533340832 | 22.63599249 | 28.7949 | 6.1e-10 | C 1.4e-12 | über den Umkehrpunkt | instabil | 5.00e+4 | 0.04222 | 26 | — |
| 0.225219142465 | 0.168427723253 | 22.63809241 | 26.2793 | 4.8e-6 | B3 1.2e-14 | über den Umkehrpunkt | instabil | 1.700e+10 | 0.06700 | 24 | — |
| 0.053451448842 | 0.058875019345 | 22.67811642 | 40.3521 | 2.8e-8 | A3 4.4e-12 | über den Umkehrpunkt | instabil | 2.427e+7 | 0.003767 | 36 | — |
| 0.063635637978 | 0.020421403842 | 22.69370924 | 40.7634 | 1.2e-8 | B3 1.0e-12 | über den Umkehrpunkt | instabil | 8.37e+4 | 0.001478 | 36 | — |
| 0.046477286471 | 0.066712847199 | 22.69743954 | 40.3272 | 6.3e-8 | B3 4.3e-12 | über den Umkehrpunkt | instabil | 2.293e+6 | 0.008451 | 36 | — |
| 0.214446394934 | 0.135634826009 | 22.70456339 | 29.0319 | 1.1e-9 | B3 6.5e-13 | über den Umkehrpunkt | instabil | 1.143e+5 | 0.01755 | 26 | — |
| 0.152458073302 | 0.168511546720 | 22.73789569 | 31.4651 | 4.2e-11 | A3 7.1e-13 | über den Umkehrpunkt | instabil | 9.504e+5 | 0.01519 | 28 | — |
| 0.072823464170 | 0.031052160556 | 22.73867740 | 40.4714 | 3.6e-8 | B3 2.6e-12 | über den Umkehrpunkt | instabil | 5.522e+5 | 0.001866 | 36 | — |
| 0.113752824892 | 0.177461819843 | 22.74475290 | 32.8545 | 5.6e-7 | C 7.8e-14 | über den Umkehrpunkt | instabil | 3.438e+8 | 0.008435 | 30 | — |
| 0.066046510021 | 0.045743885815 | 22.75069553 | 40.4541 | 3.3e-8 | B3 4.4e-12 | über den Umkehrpunkt | instabil | 2.401e+7 | 0.001336 | 36 | Satellit 2. Ordnung von Fund (0.048185, 0.042050) (T* das 2.00005-fache) |
| 0.153954762022 | 0.074327157134 | 22.81908594 | 35.9470 | 8.8e-11 | B3 1.1e-12 | bestätigt | instabil | 2.91e+3 | 0.003581 | 32 | — |
| 0.137993833808 | 0.178833988997 | 22.82582820 | 31.7043 | 8.8e-6 | B3 5.0e-13 | über den Umkehrpunkt | instabil | 9.201e+9 | 0.004683 | 28 | — |
| 0.326827735392 | 0.089935600056 | 22.83752840 | 20.3328 | 9.7e-13 | B3 1.1e-13 | bestätigt | instabil | 2.85 | 0.005397 | 18 | nur Klasse von II.C-8 |
| 0.287099529386 | 0.139164686590 | 22.86770933 | 22.5609 | 9.5e-10 | B3 1.3e-14 | über den Umkehrpunkt | instabil | 7.06e+3 | 0.002440 | 20 | — |
| 0.061399962355 | 0.062252844918 | 22.87794346 | 40.4331 | 4.8e-9 | B3 1.4e-13 | über den Umkehrpunkt | instabil | 7.113e+5 | 0.003811 | 36 | — |
| 0.242201485279 | 0.133932074322 | 22.88533650 | 27.0171 | 3.9e-10 | B3 3.7e-13 | über den Umkehrpunkt | instabil | 2.721e+5 | 0.002672 | 24 | nur Klasse von II.A-1 |
| 0.247429696933 | 0.193810140057 | 22.89049552 | 23.0996 | 7.4e-12 | B3 7.0e-15 | bestätigt | instabil | 856 | 0.02030 | 20 | — |
| 0.064587195390 | 0.062185564620 | 22.92710825 | 40.4383 | 1.1e-9 | C 1.3e-13 | über den Umkehrpunkt | instabil | 1.625e+5 | 0.005746 | 36 | — |
| 0.033864978207 | 0.079388800727 | 22.94167130 | 40.5865 | 1.7e-8 | B3 1.1e-11 | an der Rechengrenze | instabil | 1.582e+6 | 0.002013 | 36 | — |
| 0.036758532176 | 0.078455102301 | 23.00298925 | 40.6831 | 7.7e-8 | B3 1.2e-13 | über den Umkehrpunkt | instabil | 2.132e+7 | 0.01873 | 36 | — |
| 0.121292899508 | 0.197772838891 | 23.00665257 | 31.4175 | 8.8e-11 | C 3.5e-14 | bestätigt | instabil | 1.83e+4 | 0.08090 | 30 | — |
| 0.033047326562 | 0.078936766426 | 23.01265789 | 40.7384 | 2.1e-8 | C 2.4e-13 | über den Umkehrpunkt | instabil | 6.813e+6 | 0.01285 | 36 | — |
| 0.036482845437 | 0.080424883369 | 23.03366443 | 40.6762 | 2.8e-7 | R 3.1e-14 | über den Umkehrpunkt | instabil | 5.165e+7 | 0.01958 | 0 | — |
| 0.089045408906 | 0.044567740670 | 23.04023645 | 40.2466 | 4.8e-7 | A3 1.4e-10 | an der Rechengrenze | instabil | 1.433e+7 | 0.001969 | 36 | — |
| 0.127070379832 | 0.214247306839 | 23.04899724 | 29.9116 | 2.0e-8 | C 4.6e-14 | über den Umkehrpunkt | instabil | 1.789e+7 | 0.1513 | 26 | — |
| 0.152117977457 | 0.174776093766 | 23.09081045 | 31.5592 | 2.0e-6 | B3 2.8e-13 | über den Umkehrpunkt | instabil | 1.283e+9 | 0.01533 | 28 | — |
| 0.196044166853 | 0.164100269510 | 23.09932460 | 29.3529 | 5.0e-10 | B3 2.5e-12 | über den Umkehrpunkt | instabil | 2.764e+5 | 0.003846 | 26 | — |
| 0.082523223376 | 0.231032514404 | 23.11121251 | 30.3451 | 5.0e-6 | R 5.5e-13 | über den Umkehrpunkt | offen | 4.587e+7 | 1.5e-5 | 0 | — |
| 0.094198833520 | 0.046346821293 | 23.11626774 | 40.1487 | 4.4e-7 | B3 4.7e-13 | über den Umkehrpunkt | instabil | 9.258e+7 | 0.005199 | 36 | — |
| 0.123028088888 | 0.198943471307 | 23.13182770 | 31.4176 | 1.3e-10 | C 5.7e-15 | über den Umkehrpunkt | instabil | 1.91e+3 | 0.09017 | 30 | — |
| 0.132972023676 | 0.057642377952 | 23.13854294 | 38.1230 | 7.2e-10 | B3 3.0e-12 | über den Umkehrpunkt | instabil | 4.84e+4 | 0.001772 | 34 | — |
| 0.131033697673 | 0.063707208139 | 23.15438776 | 38.1032 | 1.3e-9 | B3 1.0e-12 | über den Umkehrpunkt | instabil | 3.857e+5 | 0.004879 | 34 | — |
| 0.090876976859 | 0.031851165243 | 23.18345882 | 40.6313 | 8.6e-11 | B3 1.8e-12 | über den Umkehrpunkt | instabil | 1.13e+4 | 0.001921 | 36 | — |
| 0.249545059508 | 0.127773595808 | 23.19710335 | 27.0183 | 2.1e-10 | A3 5.5e-13 | über den Umkehrpunkt | instabil | 1.81e+4 | 0.002519 | 24 | — |
| 0.091261827981 | 0.052581600713 | 23.20657824 | 40.2904 | 1.5e-9 | A3 1.2e-12 | über den Umkehrpunkt | instabil | 1.900e+5 | 2.6e-4 | 36 | — |
| 0.058436062545 | 0.181716708439 | 23.22651440 | 35.1373 | 4.6e-7 | C 2.3e-14 | über den Umkehrpunkt | instabil | 5.764e+8 | 0.001784 | 34 | — |
| 0.094278550694 | 0.027374467477 | 23.22714897 | 40.6313 | 9.4e-11 | A3 7.2e-13 | über den Umkehrpunkt | instabil | 1.13e+4 | 0.001923 | 36 | — |
| 0.035809415106 | 0.005113469236 | 23.22838041 | 42.3944 | 1.9e-7 | B3 7.3e-11 | an der Rechengrenze | instabil | 3.622e+6 | 7.4e-5 | 38 | — |
| 0.093823528907 | 0.030462329623 | 23.23818559 | 40.6311 | 3.6e-10 | B3 4.1e-13 | über den Umkehrpunkt | instabil | 7.42e+3 | 0.001541 | 36 | — |
| 0.092677125008 | 0.004301050725 | 23.30582645 | 40.9861 | 1.9e-8 | B3 1.6e-10 | an der Rechengrenze | offen | 1.49e+3 | 5.0e-6 | 36 | — |
| 0.209461096964 | 0.120319940946 | 23.30653668 | 30.9536 | 2.8e-12 | B3 2.5e-13 | bestätigt | instabil | 4.58e+4 | 0.008048 | 28 | nur Klasse von I.A-10 |
| 0.020029179337 | 0.092686033638 | 23.32082166 | 40.9314 | 8.1e-7 | C 1.2e-14 | über den Umkehrpunkt | instabil | 9.564e+10 | 0.01206 | 36 | — |
| 0.027184285715 | 0.062719433890 | 23.40791036 | 42.0023 | 1.7e-7 | C 2.6e-13 | über den Umkehrpunkt | instabil | 9.772e+8 | 0.006976 | 38 | — |
| 0.033803366902 | 0.099658045374 | 23.43605370 | 40.6929 | 6.3e-7 | R 1.8e-13 | über den Umkehrpunkt | instabil | 4.157e+8 | 0.01117 | 0 | — |
| 0.050630109618 | 0.142362392627 | 23.45319322 | 38.2627 | 1.4e-7 | C 3.1e-13 | über den Umkehrpunkt | instabil | 1.064e+7 | 0.009057 | 34 | — |
| 0.051984078104 | 0.002742540980 | 23.50994162 | 42.6066 | 8.8e-7 | B3 7.5e-10 | an der Rechengrenze | offen | 2.565e+6 | 1.1e-5 | 30 | — |
| 0.106060035077 | 0.057188012341 | 23.53492077 | 40.1359 | 6.7e-10 | B3 4.5e-13 | über den Umkehrpunkt | instabil | 6.288e+5 | 0.001736 | 36 | — |
| 0.048787053792 | 0.022252273581 | 23.54025544 | 42.6260 | 4.3e-8 | A3 3.1e-11 | an der Rechengrenze | instabil | 3.468e+6 | 0.001893 | 38 | — |
| 0.069189449095 | 0.092051885762 | 23.58060351 | 40.4800 | 2.4e-8 | R 2.1e-13 | über den Umkehrpunkt | instabil | 5.590e+6 | 0.001295 | 0 | — |
| 0.070684864747 | 0.092594272996 | 23.59465677 | 40.4386 | 7.1e-8 | A3 3.0e-11 | an der Rechengrenze | offen | 1.887e+7 | 1.1e-4 | 28 | — |
| 0.201379640020 | 0.129288855013 | 23.60408196 | 31.5594 | 2.0e-11 | B3 2.4e-13 | bestätigt | instabil | 5.65e+3 | 0.001767 | 28 | — |
| 0.228271394354 | 0.136658290813 | 23.61849969 | 28.9785 | 1.1e-7 | B3 2.0e-11 | an der Rechengrenze | instabil | 1.076e+7 | 0.004102 | 26 | — |
| 0.020566277292 | 0.202968786918 | 23.64528236 | 34.7208 | 9.2e-6 | C 4.9e-13 | über den Umkehrpunkt | instabil | 1.717e+11 | 0.06665 | 34 | — |
| 0.080333383883 | 0.145318385877 | 23.65148220 | 37.6005 | 2.6e-8 | C 9.5e-14 | über den Umkehrpunkt | instabil | 1.477e+5 | 0.01074 | 34 | — |
| 0.110421478467 | 0.054175806719 | 23.69348085 | 40.2771 | 2.5e-7 | B3 1.8e-11 | an der Rechengrenze | instabil | 1.780e+7 | 9.6e-4 | 36 | Satellit 2. Ordnung von II.C-11 (T* das 2.00036-fache, Wort bis auf 2 Buchstaben) |
| 0.055639755734 | 0.002468497364 | 23.73244850 | 42.9248 | 6.4e-7 | B3 3.9e-10 | an der Rechengrenze | offen | 8.175e+5 | 2.3e-5 | 30 | — |
| 0.075844455499 | 0.094923853618 | 23.76188280 | 40.4711 | 1.2e-8 | A3 1.2e-11 | an der Rechengrenze | instabil | 1.409e+6 | 0.002969 | 36 | — |
| 0.066865182261 | 0.039907561292 | 23.79152846 | 42.3894 | 5.3e-8 | C 1.9e-13 | über den Umkehrpunkt | instabil | 4.338e+6 | 0.005237 | 38 | — |
| 0.128921022006 | 0.138196336999 | 23.79599770 | 36.1458 | 2.0e-8 | A3 6.7e-12 | über den Umkehrpunkt | instabil | 2.484e+6 | 1.0e-4 | 32 | — |
| 0.234307103735 | 0.124617028582 | 23.85363204 | 29.3349 | 2.3e-10 | B3 1.3e-13 | über den Umkehrpunkt | instabil | 4.39e+4 | 9.3e-4 | 26 | — |
| 0.114181331779 | 0.048516311309 | 23.87512095 | 40.5297 | 2.7e-10 | A3 4.4e-11 | an der Rechengrenze | instabil | 2.78e+4 | 3.3e-4 | 36 | — |
| 0.225507143724 | 0.204686993780 | 23.89037943 | 25.2011 | 2.2e-10 | A3 2.6e-11 | an der Rechengrenze | offen | 620 | 3.0e-5 | 22 | — |
| 0.023995344895 | 0.075591436116 | 23.91254537 | 42.5558 | 1.6e-7 | C 2.1e-12 | über den Umkehrpunkt | instabil | 2.283e+7 | 0.003973 | 38 | — |
| 0.101463123323 | 0.224486062995 | 23.91371010 | 31.3002 | 9.9e-10 | C 4.4e-14 | über den Umkehrpunkt | instabil | 1.472e+6 | 0.1103 | 26 | — |
| 0.066585352436 | 0.022733974156 | 23.91890418 | 42.8587 | 6.6e-9 | C 8.0e-13 | über den Umkehrpunkt | instabil | 1.500e+5 | 0.001125 | 38 | — |
| 0.083583115181 | 0.029330264407 | 23.94108432 | 42.2684 | 3.0e-8 | B3 1.6e-11 | an der Rechengrenze | instabil | 9.576e+5 | 0.002446 | 38 | — |
| 0.212111339948 | 0.259451447617 | 23.96331042 | 21.7859 | 1.9e-12 | A3 8.4e-14 | bestätigt | instabil | 436 | 0.2576 | 18 | Satellit 3. Ordnung von I.B-1 (T* das 2.99983-fache) |
| 0.258281232739 | 0.129688461861 | 23.99816443 | 27.0231 | 4.2e-12 | A3 5.1e-13 | bestätigt | instabil | 2.50e+3 | 0.001445 | 24 | nur Klasse von II.A-1 |
| 0.243964322472 | 0.188291830991 | 24.00180515 | 24.9125 | 6.2e-9 | A3 6.5e-11 | an der Rechengrenze | instabil | 2.123e+5 | 2.0e-4 | 22 | — |
| 0.041238354849 | 0.071191221187 | 24.02091581 | 42.6442 | 2.8e-7 | C 2.9e-13 | über den Umkehrpunkt | instabil | 7.002e+7 | 0.01712 | 38 | — |
| 0.051142713791 | 0.075938194546 | 24.07830380 | 42.3938 | 7.3e-8 | B3 4.2e-12 | über den Umkehrpunkt | instabil | 6.185e+6 | 4.5e-5 | 38 | — |
| 0.069365812019 | 0.044980326618 | 24.08392668 | 42.7416 | 5.0e-10 | A3 1.3e-12 | über den Umkehrpunkt | instabil | 3.52e+4 | 0.003181 | 38 | — |
| 0.078740179233 | 0.014647625401 | 24.10632675 | 42.8734 | 9.5e-7 | C 8.8e-12 | über den Umkehrpunkt | offen | 7.135e+6 | 6.4e-4 | 38 | — |
| 0.353317586770 | 0.104522095244 | 24.11814161 | 17.9483 | 7.0e-10 | B3 1.4e-12 | über den Umkehrpunkt | instabil | 2.18e+4 | 0.005272 | 16 | Satellit 2. Ordnung von I.A-2 (T* das 1.98033-fache, Wort bis auf 4 Buchstaben) |
| 0.229578457478 | 0.143498142309 | 24.13470237 | 29.1259 | 2.9e-8 | C 4.9e-14 | über den Umkehrpunkt | instabil | 2.305e+7 | 0.02199 | 26 | — |
| 0.114947733705 | 0.198204331264 | 24.13849036 | 33.2302 | 9.5e-11 | B3 7.3e-15 | bestätigt | instabil | 3.99e+4 | 0.07595 | 32 | — |
| 0.073645096674 | 0.048023253517 | 24.18645881 | 42.7272 | 3.8e-10 | A3 1.5e-12 | über den Umkehrpunkt | instabil | 9.00e+4 | 0.001256 | 38 | — |
| 0.263162415774 | 0.124239882048 | 24.19293105 | 27.0234 | 4.2e-11 | B3 2.0e-14 | bestätigt | instabil | 1.86e+3 | 0.02244 | 24 | nur Klasse von II.A-1 |
| 0.066274419063 | 0.112767887702 | 24.20404476 | 40.7166 | 8.4e-10 | A3 1.0e-12 | über den Umkehrpunkt | instabil | 1.091e+6 | 0.01353 | 36 | Satellit 3. Ordnung von II.C-3 (T* das 2.99997-fache) |
| 0.118491953950 | 0.235579678587 | 24.24307836 | 29.9876 | 5.1e-10 | B3 9.1e-13 | über den Umkehrpunkt | instabil | 5.26e+4 | 0.001997 | 26 | — |
| 0.111989132176 | 0.202278255288 | 24.28009192 | 33.2309 | 2.0e-10 | B3 4.7e-13 | über den Umkehrpunkt | instabil | 5.373e+5 | 0.04922 | 32 | — |
| 0.085632016989 | 0.003699159435 | 24.28600544 | 42.9874 | 2.3e-6 | B3 3.0e-10 | an der Rechengrenze | offen | 3.812e+6 | 8.3e-7 | 38 | — |
| 0.030962962946 | 0.125865432457 | 24.29127563 | 40.9301 | 4.8e-7 | C 1.5e-13 | über den Umkehrpunkt | instabil | 1.334e+8 | 0.04017 | 36 | — |
| 0.222064607006 | 0.114486951425 | 24.30574077 | 31.4687 | 3.4e-10 | B3 6.4e-13 | über den Umkehrpunkt | instabil | 1.06e+4 | 0.001554 | 28 | — |
| 0.067199294239 | 0.175736590450 | 24.30709755 | 36.9892 | 6.7e-7 | B3 1.8e-11 | an der Rechengrenze | offen | 1.024e+6 | 6.6e-5 | 36 | — |
| 0.258645367423 | 0.136124956246 | 24.31210804 | 27.0171 | 3.6e-10 | A3 5.7e-13 | über den Umkehrpunkt | instabil | 2.721e+5 | 0.002782 | 24 | nur Klasse von II.A-1 |
| 0.087495494200 | 0.031117771584 | 24.32207335 | 42.7698 | 5.7e-9 | C 1.4e-11 | an der Rechengrenze | instabil | 8.57e+4 | 0.002637 | 38 | — |
| 0.379694751314 | 0.077726259691 | 24.36399721 | 15.7917 | 3.1e-11 | B3 3.7e-13 | bestätigt | instabil | 6.84e+3 | 0.006768 | 14 | nur Klasse von I.B-4 |
| 0.047378746123 | 0.128823497326 | 24.41322971 | 40.6921 | 1.2e-7 | R 8.3e-14 | über den Umkehrpunkt | instabil | 8.107e+7 | 0.01101 | 0 | — |
| 0.143547083349 | 0.195683488124 | 24.45307088 | 32.3661 | 2.0e-9 | A3 6.3e-13 | über den Umkehrpunkt | instabil | 2.956e+5 | 0.009235 | 30 | — |
| 0.030108854113 | 0.132133648629 | 24.56518314 | 41.0490 | 6.8e-7 | R 8.8e-13 | über den Umkehrpunkt | instabil | 4.621e+7 | 4.9e-4 | 0 | — |
| 0.052076990938 | 0.023320555708 | 24.60174156 | 44.4625 | 3.3e-6 | B3 1.2e-12 | über den Umkehrpunkt | instabil | 2.207e+8 | 0.002053 | 40 | — |
| 0.033700879581 | 0.043055099485 | 24.61890093 | 44.5535 | 2.5e-7 | R 9.9e-14 | über den Umkehrpunkt | instabil | 3.270e+7 | 0.005045 | 0 | — |
| 0.032831705676 | 0.046547963076 | 24.66718293 | 44.5833 | 9.3e-6 | C 1.1e-12 | über den Umkehrpunkt | instabil | 1.695e+9 | 0.004972 | 40 | — |
| 0.036116323149 | 0.046946657902 | 24.68478392 | 44.5557 | 7.4e-7 | R 1.9e-13 | über den Umkehrpunkt | instabil | 1.024e+9 | 0.006464 | 0 | — |
| 0.081266606976 | 0.165900241642 | 24.72048513 | 37.8899 | 1.1e-7 | B3 2.0e-10 | an der Rechengrenze | offen | 3.201e+5 | 8.8e-4 | 34 | — |
| 0.039375246376 | 0.140048435668 | 24.75856959 | 40.7572 | 5.3e-9 | B3 6.5e-13 | über den Umkehrpunkt | instabil | 4.626e+6 | 0.03379 | 36 | — |
| 0.056879469675 | 0.021285317113 | 24.78027085 | 44.6873 | 3.8e-8 | A3 2.3e-11 | an der Rechengrenze | instabil | 1.242e+7 | 0.001734 | 40 | — |
| 0.164502178318 | 0.080328915413 | 24.78678341 | 38.1230 | 9.1e-9 | B3 1.2e-11 | an der Rechengrenze | instabil | 4.84e+4 | 0.001855 | 34 | — |
| 0.101668820471 | 0.042717852948 | 24.81489137 | 42.8441 | 3.6e-11 | A3 3.9e-12 | bestätigt | instabil | 1.17e+4 | 3.4e-4 | 38 | — |
| 0.357881395642 | 0.105679443630 | 24.83219154 | 17.8940 | 2.9e-10 | B3 1.7e-13 | über den Umkehrpunkt | instabil | 8.14e+4 | 0.03039 | 16 | nur Klasse von II.C-7 |
| 0.048645707293 | 0.168519612295 | 24.86053514 | 38.8295 | 1.0e-9 | C 6.8e-14 | über den Umkehrpunkt | instabil | 1.224e+5 | 0.004467 | 38 | — |
| 0.063214438397 | 0.037075516509 | 24.87430550 | 44.4754 | 1.1e-8 | B3 5.8e-13 | über den Umkehrpunkt | instabil | 2.503e+7 | 0.004743 | 40 | — |
| 0.148166634159 | 0.228390206195 | 24.91035797 | 29.8996 | 9.3e-10 | A3 1.0e-12 | über den Umkehrpunkt | instabil | 6.899e+5 | 0.01133 | 26 | — |
| 0.049317650495 | 0.056879668675 | 24.95508013 | 44.5524 | 1.4e-8 | A3 1.1e-11 | an der Rechengrenze | instabil | 4.163e+6 | 0.01254 | 40 | — |
| 0.022064036204 | 0.018828924560 | 24.95919281 | 45.6602 | 4.6e-6 | C 2.9e-11 | an der Rechengrenze | offen | 5.958e+10 | 5.5e-4 | 42 | — |
| 0.061232853658 | 0.022239946178 | 24.99983456 | 44.9565 | 2.6e-6 | B3 2.1e-12 | über den Umkehrpunkt | instabil | 1.815e+8 | 0.001768 | 40 | — |
| 0.039525942591 | 0.064318530126 | 25.03510558 | 44.6881 | 1.0e-7 | C 1.6e-13 | über den Umkehrpunkt | instabil | 2.000e+8 | 0.01334 | 40 | — |
| 0.035315424547 | 0.064595087259 | 25.03854609 | 44.7579 | 1.8e-7 | R 3.8e-13 | über den Umkehrpunkt | instabil | 8.478e+7 | 0.001837 | 0 | — |
| 0.053526467609 | 0.004295994559 | 25.08119460 | 45.4144 | 4.5e-6 | B3 3.0e-10 | an der Rechengrenze | offen | 2.843e+6 | 6.8e-5 | 32 | — |
| 0.229976784383 | 0.130940255301 | 25.08135650 | 30.9243 | 1.5e-7 | B3 5.4e-14 | über den Umkehrpunkt | instabil | 8.534e+7 | 0.03781 | 28 | nur Klasse von I.A-10 |
| 0.036151029430 | 0.066937060021 | 25.08625840 | 44.7592 | 1.0e-8 | R 1.7e-13 | über den Umkehrpunkt | instabil | 1.455e+6 | 8.6e-4 | 0 | — |
| 0.017576278269 | 0.073134917799 | 25.08916636 | 44.7941 | 1.7e-8 | B3 1.9e-13 | über den Umkehrpunkt | instabil | 2.068e+6 | 0.005748 | 40 | — |
| 0.122533294124 | 0.178094678552 | 25.15311510 | 35.8440 | 5.7e-6 | B3 2.9e-13 | über den Umkehrpunkt | instabil | 3.171e+9 | 0.01301 | 32 | — |
| 0.010581407809 | 0.035823995360 | 25.15898011 | 45.8979 | 6.9e-8 | C 4.0e-14 | über den Umkehrpunkt | offen | 2.470e+8 | 1.7e-4 | 46 | — |
| 0.297233248269 | 0.161756420424 | 25.17584956 | 22.4859 | 1.7e-9 | B3 9.5e-13 | über den Umkehrpunkt | instabil | 9.240e+5 | 0.01228 | 20 | Satellit 2. Ordnung von II.C-2 (T* das 1.99250-fache, Wort bis auf 4 Buchstaben) |
| 0.108100105671 | 0.197841704886 | 25.18860826 | 35.0276 | 3.7e-10 | C 1.2e-14 | über den Umkehrpunkt | instabil | 9.02e+4 | 0.06707 | 34 | — |
| 0.070670976024 | 0.013998531113 | 25.18931973 | 45.0800 | 1.9e-8 | B3 6.3e-12 | über den Umkehrpunkt | instabil | 1.011e+5 | 6.5e-4 | 40 | — |
| 0.074482134144 | 0.028079997333 | 25.23270765 | 44.8947 | 1.7e-6 | B3 5.9e-13 | über den Umkehrpunkt | instabil | 5.861e+7 | 0.002461 | 40 | — |
| 0.252483726296 | 0.192756592412 | 25.24513396 | 25.0743 | 3.2e-10 | A3 5.0e-13 | über den Umkehrpunkt | instabil | 1.351e+5 | 0.01228 | 22 | — |
| 0.082461437515 | 0.028483329646 | 25.28251280 | 44.6906 | 1.9e-10 | A3 1.4e-12 | über den Umkehrpunkt | instabil | 1.44e+3 | 0.001740 | 40 | — |
| 0.219094630060 | 0.199064963397 | 25.28315108 | 27.6648 | 9.2e-10 | A3 3.2e-12 | über den Umkehrpunkt | instabil | 6.806e+5 | 6.4e-4 | 24 | — |
| 0.179584369019 | 0.090951291613 | 25.32690881 | 37.4271 | 4.0e-8 | A3 3.7e-11 | an der Rechengrenze | offen | 3.208e+5 | 5.5e-4 | 34 | — |
| 0.118622781632 | 0.028040732477 | 25.35169478 | 43.1573 | 1.3e-10 | B3 1.5e-11 | an der Rechengrenze | instabil | 208 | 4.1e-5 | 38 | — |
| 0.111148333735 | 0.199275898349 | 25.37762286 | 35.0278 | 1.9e-10 | C 2.0e-14 | über den Umkehrpunkt | instabil | 2.03e+4 | 0.07800 | 34 | — |
| 0.109386127562 | 0.221595989263 | 25.38037037 | 33.1405 | 9.8e-10 | B3 8.8e-14 | über den Umkehrpunkt | instabil | 4.852e+5 | 0.06279 | 28 | — |
| 0.270081327875 | 0.196600598609 | 25.42008530 | 23.2417 | 9.4e-13 | C 5.5e-15 | bestätigt | instabil | 1.11e+3 | 0.08213 | 20 | — |
| 0.029608437693 | 0.090910133619 | 25.42481443 | 44.5898 | 1.4e-8 | C 4.1e-14 | über den Umkehrpunkt | instabil | 1.154e+7 | 0.01548 | 40 | — |
| 0.078502039424 | 0.051218842288 | 25.43205462 | 44.6843 | 1.4e-7 | A3 7.0e-11 | an der Rechengrenze | instabil | 1.555e+6 | 0.003609 | 40 | — |
| 0.065360029682 | 0.166836026710 | 25.43472833 | 39.4299 | 8.3e-7 | B3 4.3e-12 | über den Umkehrpunkt | offen | 2.544e+7 | 2.7e-4 | 36 | — |
| 0.144586228373 | 0.214258859948 | 25.44339287 | 32.0324 | 1.4e-7 | B3 1.6e-13 | über den Umkehrpunkt | instabil | 7.892e+7 | 0.03854 | 28 | — |
| 0.025698494421 | 0.151312230181 | 25.50814231 | 41.4520 | 9.6e-7 | B3 1.4e-13 | über den Umkehrpunkt | instabil | 7.121e+8 | 0.003632 | 36 | — |
| 0.159820347876 | 0.079978335304 | 25.51037973 | 39.5842 | 2.8e-9 | B3 6.6e-14 | über den Umkehrpunkt | instabil | 1.033e+6 | 0.002955 | 36 | — |
| 0.169816260319 | 0.186493408764 | 25.51725754 | 32.7878 | 2.4e-9 | B3 5.3e-13 | über den Umkehrpunkt | instabil | 3.103e+6 | 0.006533 | 30 | — |
| 0.023615492938 | 0.096271729611 | 25.52398897 | 44.6058 | 1.1e-6 | C 1.3e-13 | über den Umkehrpunkt | instabil | 1.248e+9 | 0.01291 | 40 | — |
| 0.054972268813 | 0.181918027264 | 25.52750218 | 38.6886 | 1.5e-6 | C 2.8e-13 | über den Umkehrpunkt | instabil | 1.317e+9 | 0.001524 | 38 | — |
| 0.087678516556 | 0.022510918121 | 25.53238078 | 44.9974 | 1.2e-6 | B3 1.9e-12 | über den Umkehrpunkt | offen | 1.143e+7 | 0.001373 | 40 | — |
| 0.212783473866 | 0.203009394083 | 25.54701287 | 28.1789 | 1.3e-9 | A3 1.9e-12 | über den Umkehrpunkt | instabil | 6.473e+5 | 0.004909 | 24 | — |
| 0.315273943232 | 0.204147779553 | 25.58816608 | 18.1254 | 1.5e-12 | A3 2.0e-14 | bestätigt | instabil | 12.7 | 0.08848 | 16 | Satellit 2. Ordnung von I.A-2 (T* das 1.99986-fache) |
| 0.026963018985 | 0.117018912768 | 25.59047753 | 43.6641 | 5.3e-6 | B3 2.2e-14 | über den Umkehrpunkt | instabil | 1.997e+11 | 0.03101 | 41 | — |
| 0.022526213236 | 0.202056283356 | 25.61310304 | 37.6726 | 5.8e-8 | A3 1.4e-12 | über den Umkehrpunkt | instabil | 1.153e+9 | 9.5e-4 | 30 | — |
| 0.162584384060 | 0.081878490600 | 25.68269558 | 39.5846 | 1.4e-8 | B3 5.2e-13 | über den Umkehrpunkt | instabil | 6.41e+4 | 0.002616 | 36 | — |
| 0.115661496031 | 0.222593328181 | 25.69114749 | 33.1563 | 5.7e-10 | B3 6.3e-14 | über den Umkehrpunkt | instabil | 8.245e+5 | 0.1858 | 28 | — |
| 0.218513415712 | 0.124875744976 | 25.71732345 | 33.1026 | 1.8e-9 | B3 1.4e-12 | über den Umkehrpunkt | instabil | 8.83e+4 | 0.006753 | 30 | — |
| 0.041823578871 | 0.048097136281 | 25.72484101 | 46.3028 | 1.2e-6 | A3 2.1e-11 | an der Rechengrenze | instabil | 1.027e+9 | 5.8e-4 | 42 | — |
| 0.092009558148 | 0.022352774641 | 25.78185572 | 45.2570 | 1.7e-10 | A3 1.5e-11 | an der Rechengrenze | instabil | 2.46e+3 | 0.001325 | 40 | — |
| 0.022745718209 | 0.168060445874 | 25.80681439 | 40.7583 | 5.4e-8 | B3 5.6e-14 | über den Umkehrpunkt | instabil | 7.864e+7 | 0.02296 | 40 | — |
| 0.279332637516 | 0.126305885911 | 25.84802532 | 27.0238 | 4.8e-10 | B3 6.3e-13 | über den Umkehrpunkt | instabil | 1.99e+3 | 7.5e-4 | 24 | nur Klasse von II.A-1 |
| 0.393661229827 | 0.122030783424 | 25.85716868 | 13.5722 | 2.5e-12 | B3 3.6e-14 | bestätigt | instabil | 104 | 0.02961 | 12 | nur Klasse von II.C-3 · Satellit 2. Ordnung von Fund (0.375866, 0.102951) (T* das 2.03853-fache, Wort bis auf 4 Buchstaben) |
| 0.080586450929 | 0.152142016256 | 25.91207468 | 40.7256 | 2.0e-7 | C 2.1e-13 | über den Umkehrpunkt | instabil | 1.857e+7 | 0.007210 | 36 | — |
| 0.086097961673 | 0.158186759709 | 25.92557939 | 40.1167 | 2.9e-8 | B3 1.3e-13 | über den Umkehrpunkt | instabil | 3.242e+6 | 0.003181 | 36 | — |
| 0.011916796315 | 0.023738750048 | 25.99722582 | 47.5916 | 5.8e-6 | B3 4.5e-13 | über den Umkehrpunkt | offen | 1.741e+9 | 2.1e-4 | 48 | — |
| 0.299454061852 | 0.200078649938 | 26.00009410 | 20.4285 | 6.0e-11 | B3 6.6e-13 | bestätigt | instabil | 1.49e+4 | 0.03188 | 18 | — |
| 0.086910106453 | 0.152256681843 | 26.03038925 | 40.6635 | 1.8e-8 | R 1.3e-13 | über den Umkehrpunkt | instabil | 4.681e+6 | 0.005739 | 0 | — |
| 0.240106199436 | 0.161090950181 | 26.03446107 | 29.3012 | 5.0e-10 | B3 1.5e-13 | über den Umkehrpunkt | instabil | 1.669e+5 | 0.004182 | 26 | — |
| 0.021262265763 | 0.071979795640 | 26.08056584 | 46.5699 | 1.8e-7 | C 8.1e-13 | über den Umkehrpunkt | instabil | 2.455e+7 | 9.7e-4 | 42 | Satellit 3. Ordnung von I.B-5 (T* das 3.02915-fache, Wort bis auf 4 Buchstaben) |
| 0.089232480762 | 0.153134802995 | 26.13231322 | 40.6688 | 1.6e-7 | B3 2.3e-13 | über den Umkehrpunkt | instabil | 5.174e+6 | 0.004862 | 36 | — |
| 0.034069596809 | 0.024689231307 | 26.19307609 | 47.6945 | 1.1e-7 | A3 3.7e-12 | über den Umkehrpunkt | instabil | 1.606e+8 | 0.001565 | 42 | — |
| 0.204643499331 | 0.116288537379 | 26.25718523 | 35.5126 | 1.0e-9 | B3 1.5e-12 | über den Umkehrpunkt | instabil | 1.90e+4 | 0.004348 | 32 | — |
| 0.088623466715 | 0.212097266891 | 26.27559574 | 36.0974 | 3.4e-10 | A3 4.1e-12 | über den Umkehrpunkt | instabil | 4.43e+4 | 7.2e-4 | 30 | — |
| 0.218031524479 | 0.140918430702 | 26.36383736 | 33.0666 | 5.8e-9 | C 6.3e-14 | über den Umkehrpunkt | instabil | 2.391e+6 | 0.03723 | 30 | — |
| 0.195596407764 | 0.162112486046 | 26.38213936 | 33.7012 | 5.0e-7 | C 1.3e-13 | über den Umkehrpunkt | instabil | 2.993e+8 | 0.01046 | 30 | — |
| 0.056452823090 | 0.148020292282 | 26.40057015 | 42.5439 | 1.2e-8 | C 3.8e-13 | über den Umkehrpunkt | instabil | 9.097e+5 | 0.003811 | 38 | — |
| 0.371233464239 | 0.144311013323 | 26.41018398 | 15.6934 | 6.5e-11 | B3 1.5e-13 | bestätigt | instabil | 1.07e+4 | 0.04758 | 14 | — |
| 0.105687559758 | 0.198515554745 | 26.43233591 | 36.8122 | 2.4e-9 | B3 6.8e-14 | über den Umkehrpunkt | instabil | 1.382e+5 | 0.06848 | 36 | — |
| 0.171154844142 | 0.210381284152 | 26.43250788 | 31.8449 | 1.6e-6 | B3 1.2e-14 | über den Umkehrpunkt | instabil | 3.410e+9 | 0.03660 | 28 | — |
| 0.321694810356 | 0.142081750889 | 26.43907491 | 21.8863 | 3.7e-11 | B3 1.4e-14 | bestätigt | instabil | 2.37e+3 | 0.1608 | 20 | — |
| 0.034040800474 | 0.125135040216 | 26.47458593 | 44.6050 | 7.8e-8 | C 3.6e-14 | über den Umkehrpunkt | instabil | 1.395e+8 | 0.02567 | 40 | — |
| 0.063181816822 | 0.027137503780 | 26.49416858 | 47.5267 | 4.4e-9 | B3 9.5e-12 | über den Umkehrpunkt | instabil | 3.430e+5 | 1.7e-4 | 42 | — |
| 0.239522729483 | 0.176125601424 | 26.49445656 | 28.8343 | 2.0e-10 | A3 3.4e-13 | über den Umkehrpunkt | instabil | 1.928e+5 | 0.001002 | 26 | — |
| 0.114374246359 | 0.043356501607 | 26.49550905 | 45.0799 | 2.7e-10 | B3 1.5e-12 | über den Umkehrpunkt | instabil | 3.69e+3 | 4.1e-4 | 40 | — |
| 0.112178033136 | 0.038927158034 | 26.51694192 | 45.3212 | 1.4e-10 | A3 2.4e-11 | an der Rechengrenze | instabil | 139 | 4.2e-5 | 40 | — |
| 0.330244079814 | 0.109215802063 | 26.53383044 | 22.4685 | 2.0e-10 | B3 8.6e-13 | über den Umkehrpunkt | instabil | 4.06e+3 | 0.001690 | 20 | nur Klasse von II.C-12 · Satellit 2. Ordnung von Fund (0.334287, 0.114623) (T* das 2.00061-fache, Wort bis auf 2 Buchstaben) |
| 0.079680508485 | 0.021056674827 | 26.58318572 | 47.1873 | 5.4e-9 | C 1.4e-12 | über den Umkehrpunkt | instabil | 1.413e+5 | 0.001330 | 42 | — |
| 0.064156800565 | 0.176139497784 | 26.58829243 | 40.5198 | 1.2e-7 | B3 3.0e-12 | über den Umkehrpunkt | offen | 2.128e+6 | 4.6e-5 | 40 | — |
| 0.048024371445 | 0.277666891460 | 26.60711669 | 30.8209 | 2.9e-10 | C 3.1e-14 | über den Umkehrpunkt | instabil | 4.07e+4 | 0.03865 | 26 | — |
| 0.329068824774 | 0.112963903853 | 26.60762980 | 22.5200 | 6.0e-11 | B3 1.6e-13 | bestätigt | instabil | 6.99e+3 | 0.004232 | 20 | Satellit 2. Ordnung von II.C-2 (T* das 1.99553-fache, Wort bis auf 4 Buchstaben) |
| 0.036359799324 | 0.144888846502 | 26.60810999 | 43.5309 | 1.5e-7 | A3 3.9e-11 | an der Rechengrenze | instabil | 1.154e+8 | 0.01126 | 38 | — |
| 0.231211397692 | 0.225924503148 | 26.70850798 | 25.8121 | 1.1e-8 | A3 6.0e-12 | über den Umkehrpunkt | offen | 2.326e+6 | 1.4e-4 | 22 | — |
| 0.418702946892 | -0.120403473120 | 26.71603761 | 10.9256 | 3.7e-12 | C 3.7e-14 | bestätigt | instabil | 480 | 0.1105 | 10 | nur Klasse von I.B-2 |
| 0.121233092071 | 0.148300802653 | 26.73905023 | 40.3925 | 3.1e-6 | R 1.9e-12 | über den Umkehrpunkt | offen | 1.358e+8 | 5.7e-4 | 0 | — |
| 0.090521007037 | 0.044689935948 | 26.74469449 | 46.6509 | 2.0e-7 | B3 3.1e-11 | an der Rechengrenze | instabil | 2.689e+7 | 0.004219 | 42 | — |
| 0.250424162263 | 0.157325700162 | 26.74763796 | 29.3015 | 7.0e-10 | B3 6.7e-13 | über den Umkehrpunkt | instabil | 2.682e+5 | 0.01612 | 26 | — |
| 0.262246797200 | 0.197955340356 | 26.77643482 | 25.1940 | 1.2e-11 | B3 2.4e-13 | bestätigt | instabil | 1.12e+3 | 0.06239 | 22 | — |
| 0.263486847749 | 0.173678461413 | 26.78576286 | 26.8683 | 3.2e-10 | B3 6.8e-14 | über den Umkehrpunkt | instabil | 1.984e+5 | 0.02845 | 24 | Satellit 2. Ordnung von II.C-3 (T* das 1.97963-fache, Wort bis auf 2 Buchstaben) |
| 0.191743833445 | 0.177967524958 | 26.82137070 | 33.4146 | 1.2e-6 | C 3.8e-13 | über den Umkehrpunkt | instabil | 2.541e+9 | 0.009951 | 30 | Satellit 3. Ordnung von Fund (0.246507, 0.159243) (T* das 2.99713-fache) |
| 0.081776164232 | 0.048147138729 | 26.83574255 | 47.0973 | 9.2e-9 | A3 1.8e-11 | an der Rechengrenze | offen | 1.558e+7 | 4.9e-5 | 42 | — |
| 0.090894847583 | 0.027800820453 | 26.85887472 | 47.1308 | 2.9e-8 | C 3.9e-13 | über den Umkehrpunkt | instabil | 2.927e+6 | 0.002050 | 42 | — |
| 0.094671361834 | 0.259789046789 | 26.86972136 | 31.7520 | 2.7e-9 | B3 8.2e-14 | über den Umkehrpunkt | instabil | 1.802e+6 | 0.003275 | 28 | nur Klasse von I.A-10 |
| 0.254218699197 | 0.113021361805 | 26.91205966 | 31.6000 | 2.2e-11 | B3 2.7e-13 | bestätigt | instabil | 6.14e+3 | 0.001070 | 28 | Satellit 2. Ordnung von Fund (0.232901, 0.147984) (T* das 2.00104-fache, Wort bis auf 2 Buchstaben) |
| 0.392204324080 | 0.075428957822 | 26.93786377 | 15.8587 | 7.9e-11 | B3 6.6e-14 | bestätigt | instabil | 2.77e+4 | 0.002181 | 14 | — |
| 0.071019333329 | 0.189470016500 | 26.96428406 | 39.7501 | 7.5e-8 | A3 3.0e-12 | über den Umkehrpunkt | instabil | 7.616e+7 | 0.001912 | 34 | — |
| 0.083187266012 | 0.081664469019 | 26.97666596 | 46.2304 | 3.6e-7 | A3 7.1e-11 | an der Rechengrenze | instabil | 5.802e+7 | 0.003531 | 40 | — |
| 0.230110290471 | 0.124598149191 | 26.97714075 | 33.6006 | 4.2e-9 | B3 1.1e-12 | über den Umkehrpunkt | instabil | 3.334e+5 | 0.003317 | 30 | — |
| 0.251407922206 | 0.233135488223 | 26.98112437 | 23.5073 | 8.2e-12 | B3 1.4e-13 | bestätigt | instabil | 59.8 | 0.04747 | 20 | nur Klasse von I.A-5 |
| 0.281824690471 | 0.174127668469 | 26.98318458 | 25.0352 | 2.2e-10 | C 3.0e-14 | über den Umkehrpunkt | instabil | 2.86e+4 | 0.1865 | 22 | — |
| 0.128323728479 | 0.146568061689 | 26.98412405 | 40.4708 | 5.5e-8 | R 6.0e-14 | über den Umkehrpunkt | offen | 2.005e+6 | 7.9e-4 | 0 | — |
| 0.108248263232 | 0.214498333324 | 27.00200820 | 36.0005 | 2.7e-7 | B3 5.2e-14 | über den Umkehrpunkt | instabil | 1.377e+10 | 0.05480 | 32 | — |
| 0.154407021779 | 0.271157237358 | 27.01905063 | 27.5542 | 4.3e-12 | A3 6.8e-13 | bestätigt | instabil | 641 | 0.004270 | 22 | — |
| 0.016927075972 | 0.013774272737 | 27.02425347 | 49.5285 | 1.7e-6 | C 4.5e-12 | über den Umkehrpunkt | offen | 2.194e+8 | 5.6e-5 | 46 | — |
| 0.087229139773 | 0.011030814257 | 27.02795472 | 47.7467 | 2.6e-9 | A3 3.6e-12 | über den Umkehrpunkt | instabil | 3.575e+5 | 3.4e-4 | 42 | — |
| 0.339830788963 | 0.210986345256 | 27.04567684 | 15.8396 | 9.3e-12 | B3 2.5e-14 | bestätigt | instabil | 408 | 0.06421 | 14 | nur Klasse von II.C-4 |
| 0.172919171106 | 0.249958842698 | 27.07672101 | 28.6387 | 3.8e-9 | B3 1.1e-11 | an der Rechengrenze | instabil | 4.87e+4 | 6.4e-4 | 24 | Satellit 4. Ordnung von I.B-1 (T* das 3.94343-fache, Wort bis auf 4 Buchstaben) |
| 0.047274712318 | 0.169204698081 | 27.12337474 | 42.3403 | 1.8e-8 | C 9.1e-14 | über den Umkehrpunkt | instabil | 1.770e+5 | 0.004293 | 42 | — |
| 0.197228185095 | 0.096114244085 | 27.12569026 | 38.3339 | 3.1e-10 | B3 2.8e-11 | an der Rechengrenze | instabil | 47.4 | 1.8e-4 | 34 | — |
| 0.216523336072 | 0.118383379106 | 27.17142202 | 35.5177 | 5.2e-11 | B3 1.9e-13 | bestätigt | instabil | 49.1 | 0.01112 | 32 | — |
| 0.052719208620 | 0.137884526417 | 27.17648998 | 44.5866 | 3.1e-10 | C 2.1e-14 | über den Umkehrpunkt | instabil | 1.754e+6 | 0.01615 | 40 | — |
| 0.093882351481 | 0.009280271100 | 27.20756923 | 47.7758 | 4.8e-10 | B3 1.0e-11 | an der Rechengrenze | instabil | 313 | 1.8e-4 | 42 | — |
| 0.203063851848 | 0.194812809997 | 27.21939366 | 31.5770 | 6.3e-10 | A3 8.4e-13 | über den Umkehrpunkt | instabil | 3.727e+6 | 0.05207 | 28 | — |
| 0.105863894781 | 0.045809912679 | 27.25348559 | 46.7741 | 4.9e-9 | B3 8.4e-12 | über den Umkehrpunkt | instabil | 5.22e+4 | 6.6e-5 | 42 | — |
| 0.131945105408 | 0.162581137866 | 27.27013072 | 39.5279 | 1.9e-6 | B3 4.6e-12 | über den Umkehrpunkt | offen | 5.126e+6 | 0.001694 | 36 | — |
| 0.088286431171 | 0.063546793743 | 27.27903480 | 47.1793 | 1.2e-9 | A3 8.9e-12 | über den Umkehrpunkt | instabil | 2.016e+5 | 7.8e-4 | 42 | — |
| 0.170502819168 | 0.249410046526 | 27.28598812 | 29.0905 | 9.5e-11 | B3 8.4e-14 | bestätigt | instabil | 2.54e+3 | 0.009087 | 24 | — |
| 0.197938034934 | 0.199967028923 | 27.38165192 | 31.7697 | 4.5e-10 | B3 5.3e-14 | über den Umkehrpunkt | instabil | 4.323e+6 | 0.07177 | 28 | — |
| 0.099142025153 | 0.197556574767 | 27.42126261 | 38.5853 | 2.5e-9 | C 1.1e-14 | über den Umkehrpunkt | instabil | 2.591e+5 | 0.05824 | 38 | — |
| 0.041580945012 | 0.145458899280 | 27.45736858 | 44.7815 | 1.5e-9 | B3 6.2e-14 | über den Umkehrpunkt | instabil | 1.624e+6 | 0.02844 | 40 | — |
| 0.369970012379 | 0.108216435597 | 27.49535138 | 18.1114 | 5.1e-9 | A3 5.4e-12 | über den Umkehrpunkt | instabil | 1.518e+7 | 6.7e-4 | 16 | Satellit 2. Ordnung von I.A-2 (T* das 1.99832-fache, Wort bis auf 2 Buchstaben) |
| 0.108396357725 | 0.024798275192 | 27.52798938 | 47.4780 | 2.1e-8 | B3 2.1e-11 | an der Rechengrenze | instabil | 4.77e+4 | 8.5e-5 | 42 | — |
| 0.193108865435 | 0.120006911312 | 27.58465776 | 38.1599 | 1.4e-9 | A3 2.1e-11 | an der Rechengrenze | instabil | 3.45e+3 | 5.5e-5 | 34 | — |
| 0.257122293521 | 0.167025741194 | 27.59166492 | 28.8406 | 1.7e-11 | B3 3.1e-14 | bestätigt | instabil | 7.15e+3 | 0.006743 | 26 | — |
| 0.197403393632 | 0.157352890671 | 27.60037863 | 35.4396 | 8.6e-8 | A3 5.3e-12 | über den Umkehrpunkt | instabil | 3.083e+7 | 6.0e-4 | 32 | — |
| 0.123077948816 | 0.244014392278 | 27.61994845 | 33.0252 | 6.4e-7 | B3 5.8e-13 | über den Umkehrpunkt | instabil | 4.030e+8 | 0.006190 | 28 | — |
| 0.094903405377 | 0.163298433698 | 27.62261285 | 41.9693 | 5.9e-6 | C 1.6e-11 | an der Rechengrenze | offen | 2.830e+7 | 4.1e-4 | 38 | — |
| 0.139135441560 | 0.054935705954 | 27.65458570 | 45.2279 | 1.7e-10 | A3 5.6e-12 | über den Umkehrpunkt | instabil | 1.65e+3 | 2.1e-4 | 40 | — |
| 0.103429768801 | 0.199363056329 | 27.68328177 | 38.5857 | 8.5e-10 | C 1.0e-14 | über den Umkehrpunkt | instabil | 8.47e+4 | 0.07111 | 38 | — |
| 0.012471618952 | 0.087559970459 | 27.69688685 | 48.9054 | 2.0e-8 | B3 4.5e-12 | über den Umkehrpunkt | instabil | 2.006e+8 | 6.7e-4 | 38 | — |
| 0.117646953818 | 0.050995185822 | 27.70723950 | 46.7749 | 4.2e-9 | B3 1.0e-11 | an der Rechengrenze | instabil | 5.95e+4 | 0.001458 | 42 | — |
| 0.052697041092 | 0.066701606881 | 27.75438613 | 49.1570 | 3.4e-9 | A3 4.5e-12 | über den Umkehrpunkt | instabil | 1.279e+7 | 0.002389 | 44 | — |
| 0.060791951713 | 0.275436487866 | 27.79657126 | 32.1647 | 4.4e-11 | A3 2.6e-13 | bestätigt | instabil | 1.13e+4 | 0.06256 | 30 | — |
| 0.085557763376 | 0.042579324501 | 27.81559590 | 48.7848 | 9.7e-9 | B3 1.8e-12 | über den Umkehrpunkt | instabil | 1.690e+7 | 0.004846 | 44 | — |
| 0.298974233427 | 0.120513223415 | 27.83598942 | 27.0239 | 1.8e-9 | A3 1.8e-11 | an der Rechengrenze | offen | 441 | 4.7e-5 | 24 | — |
| 0.143609323119 | 0.068099593463 | 27.86490210 | 44.8634 | 3.1e-9 | A3 3.4e-12 | über den Umkehrpunkt | instabil | 8.95e+4 | 4.8e-4 | 40 | — |
| 0.084149588076 | 0.044654530946 | 27.87025548 | 48.8953 | 1.2e-9 | B3 3.8e-12 | über den Umkehrpunkt | instabil | 5.329e+6 | 0.005393 | 44 | — |
| 0.101250888652 | 0.075556856129 | 27.87361220 | 47.1755 | 2.6e-9 | A3 6.8e-12 | über den Umkehrpunkt | instabil | 1.04e+4 | 2.8e-4 | 42 | — |
| 0.083317443326 | 0.025784506179 | 27.89462303 | 49.3091 | 7.6e-10 | B3 2.2e-12 | über den Umkehrpunkt | instabil | 2.55e+4 | 0.001909 | 44 | — |
| 0.173092305913 | 0.167282022865 | 27.92051030 | 37.1750 | 1.9e-7 | C 1.2e-13 | über den Umkehrpunkt | instabil | 3.661e+8 | 0.02427 | 34 | — |
| 0.207002225122 | 0.100933876459 | 27.93645582 | 38.3330 | 2.6e-10 | B3 9.7e-13 | über den Umkehrpunkt | instabil | 1.10e+3 | 0.001744 | 34 | — |
| 0.203497928547 | 0.202738542165 | 27.94820233 | 31.6924 | 4.9e-11 | A3 1.1e-12 | bestätigt | instabil | 5.352e+5 | 0.004933 | 28 | — |
| 0.135527827089 | 0.089307013208 | 27.94992160 | 44.7347 | 5.7e-11 | B3 6.1e-13 | bestätigt | instabil | 2.12e+3 | 0.005143 | 40 | Satellit 2. Ordnung von I.A-7 (T* das 2.00043-fache, Wort bis auf 4 Buchstaben) |
| 0.054686605256 | 0.212998693330 | 27.95682818 | 39.4562 | 6.6e-8 | B3 2.0e-12 | über den Umkehrpunkt | instabil | 2.238e+8 | 0.006138 | 34 | — |
| 0.141726396507 | 0.081026274121 | 27.99718886 | 44.7347 | 7.7e-11 | B3 2.7e-13 | bestätigt | instabil | 1.59e+3 | 0.005005 | 40 | Satellit 2. Ordnung von I.A-7 (T* das 2.00043-fache, Wort bis auf 4 Buchstaben) |
| 0.087511850743 | 0.029810120371 | 28.00559401 | 49.2666 | 4.3e-7 | B3 2.1e-12 | über den Umkehrpunkt | offen | 7.341e+6 | 7.3e-4 | 44 | — |
| 0.267804676138 | 0.156469995593 | 28.01440215 | 28.8161 | 8.5e-10 | A3 2.7e-12 | über den Umkehrpunkt | instabil | 1.936e+5 | 6.5e-4 | 26 | — |
| 0.071154740406 | 0.068582249122 | 28.02433283 | 48.9905 | 3.7e-7 | B3 1.9e-11 | an der Rechengrenze | offen | 1.420e+8 | 0.001019 | 44 | — |
| 0.315212862438 | 0.130573870660 | 28.02738365 | 24.6499 | 4.3e-11 | C 2.1e-13 | bestätigt | instabil | 1.77e+3 | 0.07506 | 22 | — |
| 0.393132982434 | 0.109016634933 | 28.03438306 | 15.2992 | 3.2e-10 | C 2.0e-14 | über den Umkehrpunkt | instabil | 1.257e+5 | 0.09241 | 14 | nur Klasse von I.B-5 |
| 0.090154850961 | 0.047236791776 | 28.05214852 | 48.8890 | 6.7e-9 | B3 2.2e-12 | über den Umkehrpunkt | instabil | 1.457e+7 | 0.005588 | 44 | — |
| 0.137481447858 | 0.090475320653 | 28.06419995 | 44.7347 | 4.6e-11 | B3 8.7e-13 | bestätigt | instabil | 1.59e+3 | 0.005013 | 40 | Satellit 2. Ordnung von I.A-7 (T* das 2.00043-fache, Wort bis auf 4 Buchstaben) |
| 0.143188862753 | 0.081953677246 | 28.08465392 | 44.7347 | 3.9e-11 | B3 5.6e-13 | bestätigt | instabil | 2.12e+3 | 0.005160 | 40 | Satellit 2. Ordnung von I.A-7 (T* das 2.00043-fache, Wort bis auf 4 Buchstaben) |
| 0.052565166019 | 0.206010842825 | 28.11995456 | 40.4352 | 1.1e-7 | B3 4.9e-14 | über den Umkehrpunkt | instabil | 1.567e+8 | 0.08515 | 40 | — |
| 0.092538930459 | 0.130053421480 | 28.18568719 | 45.3264 | 1.3e-6 | A3 7.4e-11 | an der Rechengrenze | instabil | 5.272e+7 | 0.003114 | 40 | — |
| 0.031127608676 | 0.379043752745 | 28.19903377 | 19.3057 | 1.9e-10 | C 1.8e-12 | über den Umkehrpunkt | instabil | 4.23e+3 | 0.002846 | 14 | nur Klasse von I.B-4 |
| 0.382567301593 | 0.081144840603 | 28.20161545 | 17.7812 | 3.5e-9 | B3 1.3e-11 | an der Rechengrenze | instabil | 1.886e+5 | 0.02310 | 16 | Satellit 2. Ordnung von I.A-2 (T* das 1.96189-fache, Wort bis auf 4 Buchstaben) |
| 0.034765403771 | 0.035170612380 | 28.20621454 | 51.1858 | 1.1e-6 | B3 3.5e-10 | an der Rechengrenze | offen | 5.949e+7 | 1.1e-5 | 46 | — |
| 0.373573706547 | 0.108832683062 | 28.22105910 | 18.0738 | 1.2e-7 | A3 7.4e-12 | über den Umkehrpunkt | instabil | 3.762e+7 | 0.001125 | 16 | — |
| 0.145119750083 | 0.151297664881 | 28.23321302 | 40.8979 | 3.8e-7 | B3 7.8e-10 | an der Rechengrenze | offen | 4.788e+6 | 3.6e-4 | 28 | — |
| 0.255032757608 | 0.270776499056 | 28.24322019 | 20.5204 | 2.9e-12 | B3 1.0e-13 | bestätigt | instabil | 2.98e+3 | 0.04388 | 16 | nur Klasse von I.A-4 |
| 0.122528146913 | 0.068663052936 | 28.24814003 | 46.8614 | 2.0e-9 | B3 2.5e-12 | über den Umkehrpunkt | instabil | 1.064e+5 | 5.4e-5 | 42 | — |
| 0.190050136031 | 0.197324928263 | 28.26294208 | 33.7119 | 1.1e-9 | A3 6.4e-13 | über den Umkehrpunkt | instabil | 9.452e+5 | 0.02758 | 30 | — |
| 0.195087890885 | 0.192525474999 | 28.26443170 | 33.6981 | 3.0e-9 | A3 2.5e-11 | an der Rechengrenze | offen | 5.102e+5 | 1.3e-5 | 30 | — |
| 0.030632682605 | 0.387959811147 | 28.27394174 | 18.0986 | 3.2e-7 | A3 1.5e-10 | an der Rechengrenze | instabil | 9.908e+5 | 0.002443 | 14 | nur Klasse von I.B-4 |
| 0.088796232194 | 0.018668635449 | 28.30929345 | 49.8813 | 2.3e-8 | B3 5.7e-13 | über den Umkehrpunkt | instabil | 5.041e+5 | 9.6e-4 | 44 | — |
| 0.074695150713 | 0.321582719953 | 28.32116892 | 26.4322 | 1.3e-11 | B3 4.3e-13 | bestätigt | instabil | 2.81e+3 | 0.02348 | 20 | nur Klasse von II.C-12 · Satellit 2. Ordnung von II.C-1 (T* das 1.99861-fache, Wort bis auf 2 Buchstaben) |
| 0.125320553971 | 0.051139639110 | 28.36687969 | 47.4132 | 9.2e-10 | A3 6.6e-12 | über den Umkehrpunkt | instabil | 1.246e+5 | 8.5e-4 | 42 | Satellit 3. Ordnung von Fund (0.232901, 0.147984) (T* das 3.00241-fache, Wort bis auf 4 Buchstaben) |
| 0.090367685926 | 0.108630449205 | 28.36870469 | 47.0012 | 4.0e-9 | B3 1.6e-11 | an der Rechengrenze | instabil | 7.329e+5 | 0.005259 | 42 | — |
| 0.076826840547 | 0.157380844819 | 28.40587764 | 44.3903 | 1.1e-8 | B3 7.8e-13 | über den Umkehrpunkt | instabil | 2.507e+6 | 0.005283 | 40 | — |
| 0.090664170753 | 0.098413950855 | 28.41282392 | 47.5951 | 2.0e-9 | B3 1.4e-12 | über den Umkehrpunkt | instabil | 1.120e+5 | 0.001374 | 42 | — |
| 0.018944745561 | 0.351689925001 | 28.44653805 | 23.4740 | 1.1e-10 | A3 3.0e-11 | an der Rechengrenze | instabil | 939 | 0.001567 | 18 | nur Klasse von II.C-10 |
| 0.129757277166 | 0.068179969678 | 28.44758432 | 46.7490 | 1.1e-9 | B3 2.3e-12 | über den Umkehrpunkt | offen | 7.300e+5 | 1.4e-4 | 42 | — |
| 0.105924563761 | 0.154314198247 | 28.45110217 | 43.3852 | 1.6e-8 | B3 6.5e-12 | über den Umkehrpunkt | offen | 4.694e+5 | 0.001644 | 38 | — |
| 0.106862043816 | 0.167462295908 | 28.50263897 | 42.3783 | 5.9e-7 | B3 1.7e-10 | an der Rechengrenze | offen | 5.966e+5 | 2.6e-4 | 38 | — |
| 0.147762267296 | 0.161173737049 | 28.51321683 | 40.3730 | 2.8e-8 | R 3.8e-14 | über den Umkehrpunkt | offen | 5.080e+7 | 0.003709 | 0 | — |
| 0.215679089478 | 0.169000185799 | 28.51794623 | 34.0110 | 1.6e-6 | B3 3.7e-11 | an der Rechengrenze | instabil | 4.847e+8 | 0.01514 | 30 | — |
| 0.178717529454 | 0.155718066671 | 28.54973985 | 38.4273 | 4.7e-8 | B3 9.1e-11 | an der Rechengrenze | offen | 2.901e+5 | 2.0e-5 | 34 | — |
| 0.024649937470 | 0.029531941558 | 28.66647903 | 52.2745 | 5.5e-7 | C 4.1e-12 | über den Umkehrpunkt | instabil | 2.918e+9 | 4.5e-4 | 48 | — |
| 0.268385275049 | 0.165227017218 | 28.69439127 | 28.8386 | 4.0e-10 | A3 3.3e-12 | über den Umkehrpunkt | instabil | 2.95e+4 | 7.3e-4 | 26 | — |
| 0.099359432998 | 0.198581751446 | 28.75184118 | 40.3491 | 5.8e-10 | B3 1.8e-14 | über den Umkehrpunkt | instabil | 3.510e+5 | 0.06360 | 40 | — |
| 0.028451336494 | 0.038619018110 | 28.78943383 | 52.2823 | 4.6e-8 | C 7.6e-13 | über den Umkehrpunkt | instabil | 7.863e+5 | 0.002962 | 48 | — |
| 0.126373249885 | 0.161440113761 | 28.80568290 | 42.1968 | 4.8e-7 | A3 4.1e-11 | an der Rechengrenze | offen | 5.919e+7 | 5.9e-4 | 38 | — |
| 0.133002592891 | 0.145034387195 | 28.82133020 | 43.0345 | 3.9e-6 | B3 6.4e-10 | an der Rechengrenze | offen | 6.947e+6 | 2.1e-4 | 38 | — |
| 0.103876538206 | 0.028657263946 | 28.83278724 | 49.9239 | 3.8e-10 | B3 8.4e-12 | über den Umkehrpunkt | instabil | 4.43e+3 | 1.1e-4 | 44 | Satellit 2. Ordnung von I.B-10 (T* das 2.00009-fache, Wort bis auf 2 Buchstaben) |
| 0.061855178650 | 0.176442322867 | 28.85327518 | 44.0172 | 3.3e-6 | B3 3.0e-11 | an der Rechengrenze | offen | 3.932e+6 | 3.4e-5 | 44 | — |
| 0.092750539746 | 0.073924810248 | 28.87853272 | 49.3657 | 4.2e-8 | B3 2.9e-11 | an der Rechengrenze | instabil | 1.107e+7 | 1.8e-4 | 44 | — |
| 0.037845669726 | 0.069274461844 | 28.88162812 | 51.4144 | 1.9e-7 | A3 2.5e-11 | an der Rechengrenze | instabil | 3.284e+8 | 0.001679 | 46 | — |
| 0.199069945123 | 0.099485988981 | 28.89179840 | 40.4923 | 1.2e-9 | A3 2.0e-11 | an der Rechengrenze | instabil | 1.95e+3 | 4.7e-4 | 36 | — |
| 0.053785273580 | 0.149680192408 | 28.92130371 | 46.5552 | 1.4e-8 | C 1.5e-13 | über den Umkehrpunkt | instabil | 2.077e+6 | 7.7e-4 | 42 | Satellit 3. Ordnung von I.B-5 (T* das 3.02819-fache, Wort bis auf 4 Buchstaben) |
| 0.009856301249 | 0.034239011240 | 28.92290519 | 52.7979 | 9.6e-7 | C 3.7e-13 | über den Umkehrpunkt | offen | 7.139e+8 | 9.0e-6 | 54 | — |
| 0.050216054783 | 0.013811694370 | 28.92407377 | 52.4179 | 4.9e-8 | C 3.3e-11 | an der Rechengrenze | instabil | 1.888e+7 | 6.8e-4 | 46 | — |
| 0.068723932013 | 0.020261496831 | 28.93749878 | 51.8029 | 3.2e-9 | B3 7.4e-12 | über den Umkehrpunkt | instabil | 1.962e+5 | 4.7e-5 | 46 | — |
| 0.091162081285 | 0.048960273918 | 28.95717656 | 50.3752 | 6.1e-10 | C 1.4e-13 | über den Umkehrpunkt | instabil | 8.24e+3 | 0.005926 | 46 | — |
| 0.078243633710 | 0.016132674753 | 28.95950647 | 51.5133 | 3.4e-7 | C 5.3e-12 | über den Umkehrpunkt | offen | 9.047e+7 | 5.7e-4 | 46 | — |
| 0.197374974948 | 0.141037815784 | 28.97802014 | 38.3671 | 1.5e-10 | B3 1.2e-12 | über den Umkehrpunkt | instabil | 6.90e+3 | 9.7e-4 | 34 | — |
| 0.076014411736 | 0.017545243028 | 29.00079558 | 51.6649 | 1.7e-8 | B3 3.4e-11 | an der Rechengrenze | instabil | 1.028e+5 | 9.4e-5 | 46 | — |
| 0.080077248691 | 0.027404823040 | 29.03133513 | 51.4352 | 2.2e-9 | C 1.4e-12 | über den Umkehrpunkt | instabil | 1.75e+4 | 3.5e-4 | 46 | — |
| 0.080863377397 | 0.029696692628 | 29.04808937 | 51.3970 | 1.2e-6 | C 1.2e-12 | über den Umkehrpunkt | instabil | 1.353e+8 | 0.002574 | 46 | — |
| 0.308608328815 | 0.119467945247 | 29.06706207 | 27.0183 | 1.5e-9 | A3 8.6e-13 | über den Umkehrpunkt | instabil | 1.81e+4 | 0.002928 | 24 | — |
| 0.022039410977 | 0.051551540483 | 29.09305430 | 52.6096 | 3.3e-6 | R 5.3e-13 | über den Umkehrpunkt | offen | 3.457e+8 | 2.8e-4 | 0 | — |
| 0.062918697364 | 0.055852321284 | 29.10501726 | 51.5882 | 2.7e-6 | B3 2.1e-11 | an der Rechengrenze | offen | 5.216e+7 | 4.1e-4 | 46 | — |
| 0.070253462228 | 0.033325399941 | 29.12153663 | 51.8905 | 1.4e-7 | A3 4.2e-11 | an der Rechengrenze | instabil | 1.464e+7 | 0.002578 | 46 | — |
| 0.247916272708 | 0.133984014910 | 29.13862864 | 33.7513 | 3.7e-10 | B3 6.0e-13 | über den Umkehrpunkt | instabil | 5.325e+5 | 0.002106 | 30 | Satellit 3. Ordnung von Fund (0.334287, 0.114623) (T* das 3.00523-fache, Wort bis auf 4 Buchstaben) |
| 0.274556586413 | 0.167251703019 | 29.19043937 | 28.4591 | 6.0e-8 | C 3.3e-13 | über den Umkehrpunkt | instabil | 5.961e+7 | 0.1042 | 26 | — |
| 0.223663283825 | 0.143896663993 | 29.19551726 | 35.8334 | 2.9e-8 | C 1.8e-13 | über den Umkehrpunkt | instabil | 7.294e+7 | 0.004674 | 32 | — |
| 0.228260990063 | 0.235163358776 | 29.19573037 | 27.5894 | 1.1e-6 | B3 6.8e-13 | über den Umkehrpunkt | instabil | 9.241e+7 | 0.04738 | 24 | Satellit 3. Ordnung von I.A-2 (T* das 3.04408-fache, Wort bis auf 4 Buchstaben) |
| 0.079737141056 | 0.045517103610 | 29.21510839 | 51.4253 | 1.9e-8 | A3 1.4e-11 | an der Rechengrenze | instabil | 3.597e+6 | 0.003426 | 46 | — |
| 0.392234160166 | 0.033789663257 | 29.23011047 | 18.0462 | 3.8e-11 | B3 8.4e-13 | bestätigt | instabil | 204 | 0.009042 | 16 | — |
| 0.224491445207 | 0.238237826981 | 29.27648796 | 27.7199 | 8.8e-9 | B3 1.4e-13 | über den Umkehrpunkt | instabil | 1.810e+6 | 0.08268 | 24 | Satellit 3. Ordnung von I.A-2 (T* das 3.05847-fache, Wort bis auf 4 Buchstaben) |
| 0.117951625621 | 0.029882961058 | 29.31850528 | 49.9239 | 8.1e-10 | B3 4.2e-12 | über den Umkehrpunkt | offen | 4.43e+3 | 1.1e-4 | 44 | Satellit 2. Ordnung von I.B-10 (T* das 2.00009-fache, Wort bis auf 2 Buchstaben) |
| 0.002809961725 | 0.159051773151 | 29.32796267 | 47.2076 | 9.1e-6 | C 1.0e-11 | über den Umkehrpunkt | instabil | 3.080e+9 | 8.9e-4 | 48 | — |
| 0.088004995616 | 0.005577150756 | 29.34995160 | 51.8366 | 2.6e-7 | A3 4.8e-10 | an der Rechengrenze | offen | 1.070e+6 | 8.2e-5 | 46 | — |
| 0.172744936166 | 0.184705393533 | 29.35560616 | 37.6386 | 5.9e-8 | C 4.3e-13 | über den Umkehrpunkt | instabil | 6.615e+7 | 0.02024 | 34 | — |
| 0.046185332912 | 0.169739939996 | 29.36670264 | 45.8218 | 1.4e-8 | C 6.5e-14 | über den Umkehrpunkt | instabil | 2.422e+5 | 0.004160 | 46 | — |
| 0.140741874084 | 0.084392402635 | 29.37310356 | 46.8614 | 4.5e-9 | A3 1.3e-11 | an der Rechengrenze | offen | 1.065e+5 | 5.5e-5 | 42 | — |
| 0.315272431546 | 0.107003365055 | 29.38368943 | 27.0261 | 2.8e-11 | B3 6.4e-14 | bestätigt | instabil | 50.9 | 0.003856 | 24 | nur Klasse von II.A-1 |
| 0.111029412867 | 0.244132578478 | 29.40748285 | 35.8113 | 3.3e-8 | C 1.9e-12 | über den Umkehrpunkt | instabil | 2.345e+6 | 0.05943 | 30 | Satellit 5. Ordnung von I.B-1 (T* das 4.93106-fache, Wort bis auf 4 Buchstaben) |
| 0.101960468538 | 0.158657634892 | 29.42384417 | 44.7327 | 3.0e-8 | R 1.4e-12 | über den Umkehrpunkt | instabil | 7.720e+5 | 8.5e-5 | 0 | — |
| 0.118015560849 | 0.055266327149 | 29.45409242 | 49.5817 | 1.1e-9 | B3 1.7e-12 | über den Umkehrpunkt | instabil | 5.851e+5 | 6.2e-4 | 44 | — |
| 0.115277294222 | 0.070550278404 | 29.48465876 | 49.2958 | 1.7e-10 | B3 2.2e-11 | an der Rechengrenze | instabil | 6.30e+3 | 5.5e-4 | 44 | — |
| 0.064581605189 | 0.103467174327 | 29.50710988 | 50.2264 | 1.1e-7 | A3 7.1e-12 | über den Umkehrpunkt | instabil | 7.716e+7 | 0.003328 | 44 | — |
| 0.007307081299 | 0.302183814963 | 29.51382386 | 31.4449 | 5.6e-9 | C 3.9e-11 | an der Rechengrenze | instabil | 1.446e+6 | 5.6e-4 | 22 | nur Klasse von I.B-9 |
| 0.088502720668 | 0.020308862199 | 29.52241052 | 52.0156 | 1.2e-7 | C 6.5e-12 | über den Umkehrpunkt | instabil | 1.459e+6 | 0.001132 | 46 | — |
| 0.034783395149 | 0.051159318801 | 29.57483551 | 53.2961 | 2.8e-9 | A3 3.3e-12 | über den Umkehrpunkt | instabil | 1.350e+7 | 0.004742 | 48 | — |
| 0.234675445073 | 0.128570579590 | 29.58759893 | 36.1078 | 2.4e-9 | A3 1.8e-11 | an der Rechengrenze | instabil | 6.33e+4 | 5.1e-4 | 32 | — |
| 0.315227331509 | 0.111353385615 | 29.59839690 | 27.0249 | 2.9e-11 | B3 2.4e-12 | bestätigt | instabil | 76.5 | 2.1e-4 | 24 | nur Klasse von II.A-1 |
| 0.038382613306 | 0.015884798992 | 29.60582714 | 53.9208 | 6.8e-7 | A3 1.1e-10 | an der Rechengrenze | instabil | 6.638e+7 | 6.4e-4 | 48 | — |
| 0.104576011144 | 0.160686500637 | 29.61962207 | 44.7272 | 7.2e-8 | R 6.8e-13 | über den Umkehrpunkt | offen | 1.290e+7 | 2.8e-4 | 0 | — |
| 0.279001996477 | 0.116195997637 | 29.63055631 | 31.5749 | 1.1e-11 | A3 1.9e-13 | bestätigt | instabil | 9.61 | 0.001383 | 28 | Satellit 2. Ordnung von Fund (0.312288, 0.103615) (T* das 1.99997-fache) |
| 0.230260812788 | 0.144248851276 | 29.66045993 | 35.6691 | 3.8e-6 | B3 1.1e-12 | über den Umkehrpunkt | instabil | 3.365e+8 | 0.01811 | 32 | — |
| 0.092702632152 | 0.197214780192 | 29.67836115 | 42.1036 | 2.6e-9 | C 5.4e-14 | über den Umkehrpunkt | instabil | 5.655e+5 | 0.05228 | 42 | — |
| 0.174015938726 | 0.190176664722 | 29.73988363 | 37.5291 | 6.2e-11 | A3 8.9e-13 | bestätigt | instabil | 4.25e+4 | 0.01526 | 34 | — |
| 0.168987672293 | 0.195770978306 | 29.74531386 | 37.4312 | 6.5e-8 | B3 2.2e-12 | über den Umkehrpunkt | instabil | 7.975e+8 | 0.003689 | 34 | — |
| 0.112626422741 | 0.159903586168 | 29.82694617 | 44.6565 | 3.4e-6 | C 1.7e-11 | an der Rechengrenze | offen | 4.366e+6 | 6.5e-5 | 40 | — |
| 0.230812141921 | 0.143386543270 | 29.87224121 | 35.9223 | 5.3e-8 | B3 2.6e-11 | an der Rechengrenze | instabil | 8.467e+6 | 5.9e-4 | 32 | — |
| 0.014447576801 | 0.048058260706 | 29.87284523 | 54.1903 | 6.6e-7 | A3 1.0e-11 | an der Rechengrenze | offen | 6.547e+9 | 9.8e-4 | 50 | — |
| 0.095482203948 | 0.035517324360 | 29.88151925 | 52.0720 | 1.6e-10 | A3 1.8e-12 | über den Umkehrpunkt | instabil | 1.88e+3 | 0.001808 | 46 | — |
| 0.104380257955 | 0.215969005658 | 29.88836668 | 39.8954 | 2.6e-7 | C 2.4e-13 | über den Umkehrpunkt | instabil | 9.072e+7 | 0.01787 | 34 | — |
| 0.222228046583 | 0.132176469537 | 29.90182382 | 37.6348 | 5.4e-9 | B3 1.0e-12 | über den Umkehrpunkt | instabil | 5.369e+5 | 0.01496 | 34 | — |
| 0.070268302205 | 0.025614752928 | 29.98587740 | 53.5540 | 1.2e-6 | B3 1.1e-12 | über den Umkehrpunkt | instabil | 5.393e+7 | 0.002148 | 48 | — |
| 0.242665286548 | 0.124536332130 | 30.00189565 | 35.9439 | 3.4e-9 | B3 2.2e-12 | über den Umkehrpunkt | instabil | 6.951e+5 | 0.001103 | 32 | Satellit 2. Ordnung von Fund (0.395424, 0.082319) (T* das 2.00945-fache, Wort bis auf 4 Buchstaben) |
| 0.097960831442 | 0.199341004676 | 30.00716608 | 42.1042 | 4.9e-10 | C 7.8e-14 | über den Umkehrpunkt | instabil | 2.208e+5 | 0.06655 | 42 | — |
| 0.068269555424 | 0.023813641777 | 30.12722004 | 53.9068 | 3.6e-8 | B3 6.4e-11 | an der Rechengrenze | instabil | 1.202e+6 | 2.0e-4 | 48 | — |
| 0.240195824215 | 0.159270213497 | 30.13005732 | 34.0378 | 1.5e-8 | B3 7.7e-13 | über den Umkehrpunkt | instabil | 4.663e+7 | 0.01271 | 30 | — |
| 0.095948118457 | 0.205919221874 | 30.19621100 | 41.7938 | 2.8e-9 | A3 3.6e-12 | über den Umkehrpunkt | instabil | 1.059e+7 | 0.007388 | 40 | — |
| 0.050412028259 | 0.073850182383 | 30.19918756 | 53.2764 | 2.3e-6 | A3 1.8e-10 | an der Rechengrenze | offen | 2.920e+8 | 4.7e-4 | 48 | — |
| 0.069180101018 | 0.027748339161 | 30.24425170 | 54.0259 | 2.4e-8 | B3 4.4e-12 | über den Umkehrpunkt | instabil | 1.299e+6 | 0.002540 | 48 | — |
| 0.055079543435 | 0.055181708973 | 30.27082409 | 53.9294 | 3.1e-6 | B3 4.9e-12 | über den Umkehrpunkt | instabil | 2.776e+9 | 0.01032 | 48 | — |
| 0.021965548335 | 0.169265949267 | 30.27507595 | 47.7170 | 1.9e-7 | B3 4.2e-14 | über den Umkehrpunkt | instabil | 2.109e+8 | 0.02185 | 48 | — |
| 0.068427592828 | 0.042504702712 | 30.28949026 | 53.8497 | 5.5e-6 | B3 2.1e-12 | über den Umkehrpunkt | offen | 1.464e+9 | 0.005796 | 48 | — |
| 0.184619941636 | 0.153565386357 | 30.32806462 | 40.4500 | 8.8e-9 | A3 5.8e-12 | über den Umkehrpunkt | instabil | 1.703e+6 | 0.001376 | 36 | Satellit 2. Ordnung von Fund (0.332120, 0.213201) (T* das 1.99661-fache, Wort bis auf 4 Buchstaben) |
| 0.231224707328 | 0.113342008954 | 30.35516027 | 38.3393 | 4.3e-10 | A3 9.2e-12 | über den Umkehrpunkt | instabil | 5.54e+3 | 4.7e-4 | 34 | — |
| 0.109466411755 | 0.038393806810 | 30.37242678 | 52.0858 | 3.4e-10 | B3 2.7e-12 | über den Umkehrpunkt | instabil | 1.31e+4 | 1.0e-3 | 46 | — |
| 0.138569274561 | 0.077017304414 | 30.39154278 | 48.9656 | 7.6e-9 | A3 2.8e-11 | an der Rechengrenze | offen | 5.681e+5 | 1.2e-5 | 44 | Satellit 2. Ordnung von Fund (0.158247, 0.078187) (T* das 2.00125-fache) |
| 0.112725104795 | 0.030481622274 | 30.39285388 | 52.0720 | 1.5e-9 | B3 3.3e-12 | über den Umkehrpunkt | instabil | 2.05e+3 | 2.2e-4 | 46 | — |
| 0.138906692189 | 0.059663766104 | 30.40438717 | 49.5966 | 1.9e-10 | A3 4.0e-12 | über den Umkehrpunkt | instabil | 8.32e+3 | 0.004151 | 44 | — |
| 0.103052436919 | 0.178809622262 | 30.45801522 | 44.4721 | 3.2e-7 | R 1.9e-13 | über den Umkehrpunkt | offen | 3.870e+10 | 0.006729 | 0 | — |
| 0.082008696521 | 0.054073008036 | 30.49081902 | 53.3345 | 1.7e-10 | A3 1.3e-12 | über den Umkehrpunkt | instabil | 1.845e+5 | 0.005419 | 48 | — |
| 0.064565328355 | 0.154595104195 | 30.49831469 | 48.3527 | 6.5e-8 | B3 5.7e-13 | über den Umkehrpunkt | instabil | 1.730e+6 | 0.01009 | 44 | — |
| 0.292835134989 | 0.137445287985 | 30.51603395 | 29.4594 | 1.4e-10 | A3 7.9e-12 | über den Umkehrpunkt | instabil | 5.24e+3 | 8.4e-4 | 26 | — |
| 0.071267187106 | 0.035457236448 | 30.53472168 | 54.3281 | 5.7e-7 | A3 5.5e-11 | an der Rechengrenze | instabil | 3.307e+7 | 2.0e-4 | 48 | — |
| 0.251221454143 | 0.289538693859 | 30.59950321 | 20.4852 | 6.5e-12 | B3 5.8e-14 | bestätigt | instabil | 1.49e+4 | 0.02957 | 16 | nur Klasse von I.A-4 |
| 0.189948822820 | 0.119084870018 | 30.60954485 | 42.7110 | 5.4e-10 | A3 1.1e-11 | an der Rechengrenze | instabil | 5.45e+3 | 8.6e-4 | 38 | — |
| 0.181805253392 | 0.157334121305 | 30.69817377 | 40.9081 | 5.0e-9 | A3 4.2e-11 | an der Rechengrenze | instabil | 8.93e+4 | 0.001108 | 36 | — |
| 0.137059714704 | 0.168530227859 | 30.70738730 | 43.6410 | 1.3e-8 | B3 9.3e-13 | über den Umkehrpunkt | instabil | 5.31e+3 | 0.007141 | 40 | — |
| 0.188860977550 | 0.288479069654 | 30.71284029 | 26.4663 | 5.7e-12 | A3 1.5e-13 | bestätigt | instabil | 151 | 0.03115 | 20 | Satellit 2. Ordnung von II.C-1 (T* das 2.00119-fache) |
| 0.125802148887 | 0.167910243199 | 30.72796196 | 44.4936 | 5.6e-6 | R 2.8e-12 | über den Umkehrpunkt | offen | 3.435e+7 | 0.002924 | 0 | — |
| 0.135817155723 | 0.169897120437 | 30.72987526 | 43.6410 | 2.8e-7 | B3 2.5e-13 | über den Umkehrpunkt | instabil | 3.521e+7 | 0.008050 | 40 | — |
| 0.201088531988 | 0.163537007207 | 30.76779837 | 38.6437 | 4.9e-9 | A3 3.0e-11 | an der Rechengrenze | instabil | 5.90e+4 | 0.001286 | 34 | — |
| 0.183742683760 | 0.156344545326 | 30.77397010 | 40.9081 | 2.4e-9 | A3 7.1e-12 | über den Umkehrpunkt | instabil | 1.757e+5 | 0.002182 | 36 | — |
| 0.128974310167 | 0.209926418006 | 30.79372254 | 40.3016 | 6.6e-8 | B3 1.3e-13 | über den Umkehrpunkt | instabil | 2.375e+8 | 0.1654 | 36 | Satellit 3. Ordnung von Fund (0.166871, 0.206439) (T* das 3.02924-fache, Wort bis auf 4 Buchstaben) |
| 0.040396982506 | 0.076812806433 | 30.80039608 | 54.4664 | 1.3e-7 | B3 2.7e-13 | über den Umkehrpunkt | instabil | 2.308e+8 | 0.01941 | 48 | — |
| 0.387983129489 | 0.151194448073 | 30.86888381 | 15.5480 | 2.8e-10 | B3 1.7e-13 | über den Umkehrpunkt | instabil | 1.85e+4 | 0.01576 | 14 | nur Klasse von II.C-5 |
| 0.079319552430 | 0.080163838702 | 30.88018968 | 53.1616 | 4.3e-7 | B3 5.9e-12 | über den Umkehrpunkt | instabil | 2.606e+9 | 0.002055 | 40 | — |
| 0.019724438181 | 0.065493701353 | 30.91146277 | 55.4648 | 4.4e-6 | B3 2.4e-13 | über den Umkehrpunkt | instabil | 7.301e+9 | 8.2e-6 | 52 | — |
| 0.260021248722 | 0.139791551810 | 30.94074560 | 33.9694 | 5.5e-10 | B3 1.4e-11 | an der Rechengrenze | instabil | 7.57e+3 | 5.4e-5 | 30 | Satellit 3. Ordnung von Fund (0.334287, 0.114623) (T* das 3.02465-fache, Wort bis auf 4 Buchstaben) |
| 0.193472252589 | 0.121586882036 | 30.98006475 | 42.7219 | 1.2e-9 | A3 7.6e-12 | über den Umkehrpunkt | instabil | 2.33e+3 | 1.7e-4 | 38 | — |
| 0.068905503919 | 0.115683842369 | 30.98475290 | 51.8412 | 9.9e-7 | C 6.6e-13 | über den Umkehrpunkt | instabil | 1.365e+9 | 0.004212 | 46 | — |
| 0.091041667811 | 0.010469234754 | 30.98534966 | 54.5502 | 1.3e-9 | A3 5.6e-11 | an der Rechengrenze | instabil | 4.33e+3 | 3.0e-4 | 48 | — |
| 0.094722897005 | 0.198555507926 | 31.07795414 | 43.8512 | 3.5e-9 | B3 2.8e-14 | über den Umkehrpunkt | instabil | 7.395e+5 | 0.06013 | 44 | — |
| 0.195239038641 | 0.121309366883 | 31.09464971 | 42.7192 | 2.4e-9 | A3 1.4e-11 | an der Rechengrenze | instabil | 1.41e+4 | 0.002789 | 38 | — |
| 0.084033876030 | 0.079952551691 | 31.10944825 | 53.3505 | 3.4e-6 | A3 1.6e-10 | an der Rechengrenze | offen | 4.526e+8 | 5.6e-4 | 46 | — |
| 0.017062979084 | 0.061232777957 | 31.11331169 | 56.0079 | 2.1e-6 | C 1.8e-12 | über den Umkehrpunkt | instabil | 1.403e+9 | 3.5e-4 | 52 | — |
| 0.249954542847 | 0.163832791836 | 31.11531922 | 33.6410 | 2.4e-9 | B3 2.9e-12 | über den Umkehrpunkt | instabil | 5.449e+5 | 0.004358 | 30 | — |
| 0.046146698362 | 0.148720683715 | 31.12871120 | 50.3960 | 7.9e-6 | C 9.2e-13 | über den Umkehrpunkt | offen | 9.530e+8 | 4.6e-4 | 46 | — |
| 0.070442566400 | 0.083682426582 | 31.17749698 | 53.8846 | 1.1e-6 | B3 1.1e-12 | über den Umkehrpunkt | instabil | 2.577e+8 | 8.6e-4 | 48 | — |
| 0.018333155859 | 0.069135393206 | 31.19871740 | 55.8559 | 1.1e-6 | B3 2.7e-12 | über den Umkehrpunkt | instabil | 3.737e+8 | 0.005041 | 52 | — |
| 0.035977760319 | 0.043387035440 | 31.20104395 | 56.4119 | 2.7e-8 | A3 4.6e-12 | über den Umkehrpunkt | instabil | 1.827e+7 | 9.9e-4 | 50 | — |
| 0.169307009642 | 0.221017643714 | 31.24453677 | 36.6593 | 2.7e-8 | B3 4.1e-13 | über den Umkehrpunkt | instabil | 1.062e+8 | 0.002656 | 32 | — |
| 0.364714722278 | 0.081000507552 | 31.26933189 | 22.4631 | 1.8e-9 | A3 9.9e-11 | an der Rechengrenze | instabil | 2.53e+4 | 4.4e-5 | 20 | nur Klasse von II.C-12 · Satellit 2. Ordnung von Fund (0.334287, 0.114623) (T* das 2.00013-fache, Wort bis auf 2 Buchstaben) |
| 0.209977847519 | 0.139354292494 | 31.29665536 | 40.2412 | 9.7e-9 | B3 7.7e-14 | über den Umkehrpunkt | instabil | 1.561e+6 | 0.02456 | 36 | — |
| 0.146447382015 | 0.162242013300 | 31.30157622 | 44.3321 | 7.3e-9 | A3 8.8e-13 | über den Umkehrpunkt | instabil | 6.153e+6 | 0.005254 | 40 | — |
| 0.012230923378 | 0.367125696862 | 31.30877994 | 23.4758 | 2.6e-10 | A3 5.6e-12 | über den Umkehrpunkt | instabil | 2.21e+3 | 5.2e-4 | 18 | nur Klasse von II.C-10 |
| 0.073782888319 | 0.078429955926 | 31.33489408 | 54.2609 | 5.5e-8 | A3 3.3e-11 | an der Rechengrenze | offen | 2.097e+7 | 1.5e-4 | 48 | — |
| 0.059763985199 | 0.162112061870 | 31.40728187 | 49.3046 | 7.7e-7 | B3 1.5e-10 | an der Rechengrenze | instabil | 3.396e+8 | 0.005916 | 46 | — |
| 0.109937964814 | 0.042753581886 | 31.41404508 | 53.7432 | 2.4e-10 | B3 1.0e-11 | an der Rechengrenze | instabil | 2.23e+3 | 5.6e-4 | 48 | — |
| 0.101645223162 | 0.137845689844 | 31.43149189 | 49.4849 | 8.4e-6 | B3 7.4e-13 | über den Umkehrpunkt | instabil | 1.343e+9 | 0.005896 | 44 | — |
| 0.216363282445 | 0.236013113438 | 31.43946722 | 30.8482 | 6.1e-10 | C 5.2e-14 | über den Umkehrpunkt | instabil | 1.877e+5 | 0.03808 | 26 | — |
| 0.259337816567 | 0.116093030105 | 31.46366600 | 36.1179 | 4.0e-11 | A3 1.3e-12 | bestätigt | instabil | 295 | 0.003192 | 32 | — |
| 0.185162669106 | 0.113771489254 | 31.47668962 | 44.7234 | 6.8e-9 | B3 6.1e-11 | an der Rechengrenze | offen | 1.61e+3 | 1.7e-4 | 40 | Satellit 2. Ordnung von I.A-6 (T* das 2.00003-fache, Wort bis auf 2 Buchstaben) |
| 0.216240395508 | 0.156784532538 | 31.52278260 | 38.5355 | 2.0e-7 | C 9.6e-14 | über den Umkehrpunkt | instabil | 4.343e+7 | 0.002265 | 34 | — |
| 0.317836058046 | 0.163544717077 | 31.53537254 | 25.2016 | 3.2e-11 | B3 5.9e-13 | bestätigt | instabil | 730 | 9.2e-4 | 22 | — |
| 0.278542090274 | 0.240894034178 | 31.54686091 | 23.5073 | 4.9e-13 | A3 5.5e-14 | bestätigt | instabil | 59.8 | 0.05268 | 20 | nur Klasse von I.A-5 |
| 0.052025504276 | 0.048050154404 | 31.58109830 | 56.5693 | 1.2e-8 | A3 2.9e-11 | an der Rechengrenze | offen | 1.063e+5 | 4.3e-4 | 50 | — |
| 0.395424245928 | 0.082319218280 | 31.59812896 | 17.8874 | 8.2e-12 | B3 1.1e-13 | bestätigt | instabil | 5.06e+3 | 0.01183 | 16 | Satellit 2. Ordnung von I.A-2 (T* das 1.97360-fache, Wort bis auf 4 Buchstaben) |
| 0.075326119948 | 0.044961566136 | 31.64358797 | 55.9106 | 2.1e-8 | B3 3.4e-11 | an der Rechengrenze | instabil | 3.206e+5 | 6.7e-4 | 50 | — |
| 0.173107183188 | 0.194093966320 | 31.67760193 | 39.6692 | 3.3e-11 | A3 3.6e-13 | bestätigt | instabil | 4.12e+4 | 0.02678 | 36 | — |
| 0.316377858188 | 0.147104846989 | 31.68865660 | 26.6661 | 6.0e-9 | A3 2.0e-12 | über den Umkehrpunkt | instabil | 7.092e+5 | 3.7e-4 | 24 | — |
| 0.241359724627 | 0.155112217463 | 31.69753162 | 35.9936 | 4.6e-6 | B3 6.7e-12 | über den Umkehrpunkt | instabil | 1.131e+8 | 3.8e-4 | 32 | — |
| 0.372489306529 | 0.015204928989 | 31.70948820 | 22.9069 | 5.8e-8 | A3 1.8e-10 | an der Rechengrenze | offen | 2.37e+4 | 6.0e-6 | 20 | Satellit 2. Ordnung von I.B-2 (T* das 1.99539-fache, Wort bis auf 4 Buchstaben) |
| 0.165832906876 | 0.109079586153 | 31.71516797 | 47.1722 | 2.5e-10 | B3 8.5e-12 | über den Umkehrpunkt | instabil | 1.60e+3 | 7.7e-4 | 42 | — |
| 0.028285931827 | 0.158539744727 | 31.72372847 | 50.8885 | 2.7e-8 | C 6.8e-14 | über den Umkehrpunkt | instabil | 7.597e+7 | 0.03000 | 46 | — |
| 0.088985100085 | 0.027842395820 | 31.72545081 | 55.7684 | 4.5e-8 | C 5.2e-12 | über den Umkehrpunkt | instabil | 7.988e+6 | 0.002096 | 50 | — |
| 0.158610552170 | 0.085025403800 | 31.75443573 | 49.1497 | 1.5e-9 | B3 8.4e-12 | über den Umkehrpunkt | instabil | 4.54e+3 | 4.6e-5 | 44 | — |
| 0.079471891216 | 0.011018866525 | 31.76265044 | 56.4837 | 4.7e-8 | B3 5.3e-11 | an der Rechengrenze | offen | 1.000e+7 | 5.3e-5 | 50 | — |
| 0.182372827349 | 0.149696489083 | 31.80378919 | 42.9440 | 1.2e-10 | B3 2.5e-12 | über den Umkehrpunkt | instabil | 4.25e+3 | 5.5e-4 | 38 | — |
| 0.372912148217 | 0.016028481582 | 31.80944979 | 22.9062 | 1.3e-7 | A3 9.2e-11 | an der Rechengrenze | offen | 4.03e+4 | 4.7e-6 | 12 | — |
| 0.241937348949 | 0.183843862961 | 31.82032299 | 33.6677 | 1.8e-8 | C 1.5e-13 | über den Umkehrpunkt | instabil | 1.194e+6 | 7.5e-4 | 30 | Satellit 3. Ordnung von Fund (0.246507, 0.159243) (T* das 3.01983-fache, Wort bis auf 4 Buchstaben) |
| 0.078650933554 | 0.111312428328 | 31.83712293 | 53.1410 | 5.7e-7 | B3 2.8e-13 | über den Umkehrpunkt | instabil | 9.138e+7 | 0.01966 | 48 | — |
| 0.010090816049 | 0.318858954672 | 31.85719253 | 31.4345 | 3.5e-8 | C 1.6e-11 | an der Rechengrenze | instabil | 1.632e+5 | 7.7e-4 | 22 | nur Klasse von I.B-9 |
| 0.261305805734 | 0.162184975607 | 31.88808928 | 33.1919 | 1.3e-8 | B3 1.5e-12 | über den Umkehrpunkt | instabil | 2.328e+6 | 1.0e-3 | 30 | — |
| 0.087860993698 | 0.196889168379 | 31.94607580 | 45.5909 | 5.6e-9 | C 5.1e-14 | über den Umkehrpunkt | instabil | 1.047e+6 | 0.04804 | 46 | — |
| 0.002725420003 | 0.156382829371 | 31.94936408 | 51.6639 | 9.1e-7 | C 5.5e-11 | an der Rechengrenze | instabil | 1.524e+8 | 0.001521 | 54 | — |
| 0.100965320567 | 0.139385247925 | 31.95297511 | 50.2253 | 6.8e-7 | A3 3.7e-11 | an der Rechengrenze | instabil | 4.684e+7 | 0.002151 | 44 | — |
| 0.328520045860 | 0.115371687586 | 31.97743156 | 27.0221 | 2.2e-10 | A3 1.3e-12 | über den Umkehrpunkt | instabil | 7.37e+4 | 0.01055 | 24 | — |
| 0.069274755486 | 0.074964248018 | 31.98872588 | 55.7324 | 1.0e-8 | A3 1.1e-11 | an der Rechengrenze | instabil | 6.195e+5 | 0.002186 | 50 | — |
| 0.075280072804 | 0.162033891655 | 32.00096542 | 49.6603 | 8.0e-7 | C 2.5e-12 | über den Umkehrpunkt | instabil | 3.161e+6 | 0.003034 | 46 | — |
| 0.333257486296 | 0.101412787286 | 32.00889483 | 27.0239 | 2.0e-10 | B3 4.1e-12 | über den Umkehrpunkt | instabil | 441 | 5.1e-5 | 24 | — |
| 0.045067281687 | 0.271632680896 | 32.01936922 | 37.9994 | 8.7e-10 | C 8.6e-14 | über den Umkehrpunkt | instabil | 2.045e+5 | 0.03958 | 34 | — |
| 0.375152136456 | 0.149772445741 | 32.03052363 | 18.1254 | 6.1e-13 | B3 1.4e-14 | bestätigt | instabil | 12.7 | 0.1028 | 16 | Satellit 2. Ordnung von I.A-2 (T* das 1.99986-fache) |
| 0.119752962330 | 0.051113113921 | 32.03521284 | 53.9349 | 2.1e-7 | B3 3.0e-13 | über den Umkehrpunkt | instabil | 9.411e+6 | 0.003254 | 48 | — |
| 0.177978796488 | 0.195627321984 | 32.05468486 | 39.5448 | 6.9e-9 | B3 6.0e-13 | über den Umkehrpunkt | instabil | 2.530e+6 | 0.001043 | 36 | — |
| 0.305640741369 | 0.224091300682 | 32.06514138 | 22.1669 | 8.6e-13 | A3 3.2e-13 | bestätigt | instabil | 164 | 0.08802 | 20 | Satellit 2. Ordnung von II.C-2 (T* das 1.96424-fache, Wort bis auf 2 Buchstaben) |
| 0.333150172806 | 0.102828430540 | 32.06737315 | 27.0238 | 1.6e-10 | A3 6.3e-13 | über den Umkehrpunkt | instabil | 1.99e+3 | 8.7e-4 | 24 | nur Klasse von II.A-1 |
| 0.061750284989 | 0.071973744633 | 32.06840529 | 56.2842 | 8.1e-7 | C 1.5e-12 | über den Umkehrpunkt | instabil | 2.019e+8 | 0.01574 | 50 | — |
| 0.088557288522 | 0.015029547071 | 32.07779342 | 56.5694 | 3.0e-8 | A3 1.7e-11 | an der Rechengrenze | offen | 3.113e+6 | 3.8e-4 | 50 | — |
| 0.220079333453 | 0.199980117206 | 32.10680907 | 34.9335 | 1.9e-10 | C 6.1e-14 | über den Umkehrpunkt | instabil | 1.549e+5 | 0.06098 | 30 | — |
| 0.228375034685 | 0.134373867847 | 32.11656315 | 39.5527 | 3.0e-6 | B3 3.1e-13 | über den Umkehrpunkt | instabil | 1.638e+9 | 0.04119 | 36 | — |
| 0.165871559611 | 0.073285018863 | 32.13617178 | 49.6020 | 2.9e-9 | B3 8.5e-14 | über den Umkehrpunkt | instabil | 2.80e+3 | 0.002194 | 44 | — |
| 0.291625395758 | 0.210218867812 | 32.14093653 | 25.3573 | 1.8e-9 | B3 1.9e-11 | an der Rechengrenze | instabil | 6.46e+4 | 0.006416 | 22 | — |
| 0.120124658775 | 0.050157475114 | 32.16330430 | 54.1527 | 2.4e-8 | A3 7.9e-11 | an der Rechengrenze | offen | 5.84e+4 | 3.8e-5 | 48 | — |
| 0.020692399791 | 0.081470109227 | 32.18491374 | 57.0510 | 3.3e-7 | C 2.5e-12 | über den Umkehrpunkt | instabil | 1.396e+8 | 0.009306 | 50 | — |
| 0.085503905696 | 0.256488226534 | 32.19830067 | 38.9088 | 3.3e-8 | B3 1.1e-13 | über den Umkehrpunkt | instabil | 1.162e+7 | 0.005731 | 36 | — |
| 0.006813530121 | 0.371470365846 | 32.20882901 | 23.4723 | 8.7e-10 | A3 7.1e-11 | an der Rechengrenze | instabil | 5.67e+3 | 1.5e-4 | 18 | nur Klasse von II.C-10 |
| 0.147115017677 | 0.064260857448 | 32.24664985 | 51.7734 | 2.9e-9 | C 5.4e-13 | über den Umkehrpunkt | instabil | 1.029e+5 | 0.001671 | 46 | — |
| 0.118290389365 | 0.236390168426 | 32.24778307 | 39.8021 | 2.1e-6 | C 2.1e-12 | über den Umkehrpunkt | offen | 3.755e+7 | 1.5e-4 | 34 | — |
| 0.202702371286 | 0.131605024563 | 32.26491405 | 42.8360 | 8.8e-9 | A3 2.5e-11 | an der Rechengrenze | instabil | 1.166e+6 | 0.001179 | 38 | — |
| 0.068584318567 | 0.111543453261 | 32.26849409 | 54.2722 | 5.8e-6 | C 7.5e-13 | über den Umkehrpunkt | instabil | 4.375e+8 | 0.02281 | 48 | — |
| 0.091707558405 | 0.053217762809 | 32.32764366 | 56.0827 | 3.9e-7 | A3 1.4e-10 | an der Rechengrenze | offen | 2.420e+7 | 8.2e-5 | 50 | — |
| 0.093853386512 | 0.199274179991 | 32.33494179 | 45.5917 | 2.8e-9 | C 8.5e-14 | über den Umkehrpunkt | instabil | 4.656e+5 | 0.06325 | 46 | — |
| 0.031633139814 | 0.077737657092 | 32.36336121 | 57.3737 | 8.1e-7 | A3 1.2e-11 | an der Rechengrenze | instabil | 6.120e+9 | 0.002980 | 50 | — |
| 0.051987470246 | 0.072920829013 | 32.39216663 | 57.1379 | 7.5e-8 | B3 1.3e-10 | an der Rechengrenze | offen | 4.103e+5 | 6.7e-5 | 52 | — |
| 0.090233516437 | 0.098022826662 | 32.42425228 | 54.3594 | 1.7e-9 | A3 1.1e-11 | an der Rechengrenze | instabil | 3.39e+4 | 0.001643 | 48 | — |
| 0.231638208459 | 0.128374799281 | 32.53568760 | 40.0886 | 2.3e-8 | B3 1.7e-12 | über den Umkehrpunkt | instabil | 3.481e+5 | 0.03622 | 36 | — |
| 0.127947368975 | 0.054035321799 | 32.56229509 | 54.1447 | 4.8e-10 | B3 6.6e-12 | über den Umkehrpunkt | instabil | 3.33e+4 | 0.001394 | 48 | — |
| 0.079132914383 | 0.114700573696 | 32.60786520 | 54.1834 | 3.3e-7 | B3 1.7e-13 | über den Umkehrpunkt | instabil | 7.424e+7 | 0.001216 | 48 | — |
| 0.104225400506 | 0.025366524919 | 32.62237560 | 56.5165 | 9.6e-9 | A3 9.8e-12 | über den Umkehrpunkt | offen | 3.367e+5 | 1.8e-4 | 50 | — |
| 0.128880205584 | 0.369605502733 | 32.63797697 | 20.5204 | 3.3e-11 | B3 6.0e-13 | bestätigt | instabil | 2.98e+3 | 0.04832 | 16 | nur Klasse von I.A-4 |
| 0.074002822403 | 0.017706317035 | 32.64886958 | 58.2518 | 6.0e-6 | B3 2.5e-10 | an der Rechengrenze | offen | 1.515e+8 | 8.1e-4 | 52 | — |
| 0.370430236246 | 0.086646620687 | 32.68317489 | 22.3577 | 1.3e-9 | B3 3.1e-13 | über den Umkehrpunkt | instabil | 9.00e+4 | 0.01029 | 20 | nur Klasse von I.A-6 · Satellit 5. Ordnung von I.A-1 (T* das 4.92636-fache, Wort bis auf 4 Buchstaben) |
| 0.106364233328 | 0.128311019107 | 32.73361991 | 51.9800 | 8.9e-8 | A3 4.7e-11 | an der Rechengrenze | offen | 2.076e+6 | 3.1e-5 | 46 | — |
| 0.313357760859 | 0.133669055928 | 32.78826259 | 28.9192 | 1.4e-7 | A3 1.6e-11 | an der Rechengrenze | offen | 4.794e+6 | 0.001640 | 26 | — |
| 0.112396503213 | 0.059562576472 | 32.81154270 | 55.4683 | 2.0e-7 | B3 3.7e-11 | an der Rechengrenze | instabil | 8.691e+6 | 0.006452 | 50 | — |
| 0.295911810909 | 0.187349384141 | 32.81839645 | 27.4012 | 4.5e-8 | A3 5.7e-12 | über den Umkehrpunkt | instabil | 1.286e+7 | 0.02411 | 24 | — |
| 0.085335024276 | 0.029393036737 | 32.84671102 | 57.9022 | 1.1e-6 | B3 3.0e-12 | über den Umkehrpunkt | instabil | 2.959e+7 | 0.001820 | 52 | — |
| 0.190044920815 | 0.104163559086 | 32.86890026 | 46.7741 | 1.4e-8 | B3 9.0e-12 | über den Umkehrpunkt | offen | 5.22e+4 | 7.5e-5 | 42 | — |
| 0.050543577578 | 0.205394338642 | 32.87633268 | 47.4033 | 2.6e-7 | B3 7.1e-14 | über den Umkehrpunkt | instabil | 3.348e+8 | 0.08114 | 48 | — |
| 0.354809162984 | 0.099921870221 | 32.88899463 | 24.4496 | 6.6e-10 | C 1.8e-11 | an der Rechengrenze | instabil | 5.27e+4 | 0.001375 | 22 | — |
| 0.206759895654 | 0.102827464053 | 32.91057744 | 45.0799 | 5.8e-10 | B3 2.0e-12 | über den Umkehrpunkt | instabil | 3.69e+3 | 4.8e-4 | 40 | — |
| 0.251026468938 | 0.126308498566 | 32.92610952 | 38.2541 | 7.8e-9 | B3 6.2e-12 | über den Umkehrpunkt | instabil | 4.894e+5 | 4.2e-4 | 34 | — |
| 0.078131994427 | 0.045989054939 | 32.93862373 | 58.0423 | 2.6e-6 | B3 7.5e-12 | über den Umkehrpunkt | offen | 8.154e+7 | 5.9e-5 | 52 | — |
| 0.202469508969 | 0.144724725329 | 32.98031357 | 42.8294 | 6.5e-8 | B3 9.1e-12 | über den Umkehrpunkt | offen | 1.514e+7 | 2.5e-4 | 38 | — |
| 0.076256827766 | 0.235603302844 | 32.98641583 | 43.0034 | 5.5e-10 | C 2.6e-13 | über den Umkehrpunkt | instabil | 3.288e+5 | 0.03991 | 44 | — |
| 0.211795346473 | 0.146461613126 | 33.00225457 | 41.6834 | 4.8e-6 | C 1.8e-13 | über den Umkehrpunkt | instabil | 5.829e+8 | 0.03848 | 38 | — |
| 0.332119505217 | 0.213201038708 | 33.07762599 | 20.2594 | 3.0e-9 | B3 3.6e-13 | über den Umkehrpunkt | instabil | 2.375e+5 | 0.01420 | 18 | — |
| 0.092745289508 | 0.050592537200 | 33.09222495 | 57.4333 | 1.2e-6 | B3 6.6e-13 | über den Umkehrpunkt | offen | 1.503e+9 | 0.006177 | 52 | — |
| 0.341895313549 | 0.164767431496 | 33.09625333 | 22.7903 | 3.3e-12 | B3 1.0e-14 | bestätigt | instabil | 2.97e+3 | 0.1967 | 20 | — |
| 0.373343665281 | 0.077644173522 | 33.11080199 | 22.4998 | 3.8e-10 | B3 1.1e-12 | über den Umkehrpunkt | instabil | 2.641e+5 | 0.001177 | 20 | Satellit 2. Ordnung von II.C-2 (T* das 1.99374-fache, Wort bis auf 4 Buchstaben) |
| 0.202649935034 | 0.120516764188 | 33.11170458 | 44.7313 | 2.8e-10 | B3 1.7e-12 | über den Umkehrpunkt | offen | 1.37e+4 | 1.2e-4 | 40 | — |
| 0.074710542435 | 0.049629816067 | 33.13151658 | 58.4347 | 7.9e-10 | B3 1.5e-13 | über den Umkehrpunkt | instabil | 2.21e+4 | 0.007210 | 52 | — |
| 0.212707197705 | 0.138964078875 | 33.13152632 | 42.3184 | 1.5e-7 | C 7.1e-12 | über den Umkehrpunkt | instabil | 3.422e+6 | 7.0e-4 | 38 | — |
| 0.253024202235 | 0.183143847281 | 33.14929998 | 33.7570 | 4.9e-7 | C 5.0e-12 | über den Umkehrpunkt | instabil | 1.391e+9 | 0.04140 | 30 | Satellit 3. Ordnung von I.B-2 (T* das 2.94053-fache) |
| 0.232074508890 | 0.197708006863 | 33.17177746 | 34.9419 | 2.8e-8 | C 1.5e-12 | über den Umkehrpunkt | instabil | 6.91e+4 | 8.9e-5 | 30 | — |
| 0.058114906032 | 0.158463990499 | 33.17227585 | 52.4703 | 8.2e-6 | C 8.3e-13 | über den Umkehrpunkt | instabil | 1.742e+9 | 0.008910 | 48 | — |
| 0.086135140261 | 0.031663657818 | 33.19528008 | 58.4338 | 1.5e-8 | B3 2.9e-12 | über den Umkehrpunkt | instabil | 3.822e+5 | 0.002764 | 52 | — |
| 0.055699969061 | 0.084418191487 | 33.22493481 | 57.9431 | 6.5e-7 | C 4.1e-13 | über den Umkehrpunkt | instabil | 5.222e+8 | 0.02100 | 52 | — |
| 0.203226903778 | 0.122232757394 | 33.23848608 | 44.7234 | 3.8e-10 | B3 5.2e-12 | über den Umkehrpunkt | instabil | 1.61e+3 | 1.7e-4 | 40 | Satellit 2. Ordnung von I.A-6 (T* das 2.00003-fache, Wort bis auf 2 Buchstaben) |
| 0.180058284626 | 0.201471233601 | 33.24704339 | 40.1988 | 5.1e-6 | R 7.4e-14 | über den Umkehrpunkt | instabil | 9.275e+9 | 0.01893 | 0 | — |
| 0.141037225197 | 0.051107527514 | 33.25093059 | 54.3432 | 9.9e-11 | B3 2.6e-13 | bestätigt | instabil | 94.2 | 0.001628 | 48 | — |
| 0.083981180943 | 0.004310724065 | 33.27567057 | 58.9827 | 1.3e-6 | B3 8.2e-10 | an der Rechengrenze | offen | 2.122e+6 | 1.7e-6 | 52 | — |
| 0.155160148952 | 0.204803930994 | 33.27770521 | 42.1093 | 4.6e-9 | C 2.4e-13 | über den Umkehrpunkt | instabil | 1.149e+8 | 0.005282 | 38 | — |
| 0.234851515047 | 0.126582756561 | 33.28551134 | 40.7339 | 3.7e-8 | B3 5.7e-12 | über den Umkehrpunkt | offen | 1.485e+6 | 8.2e-5 | 36 | — |
| 0.058581810731 | 0.176873694082 | 33.34306412 | 50.9362 | 5.3e-6 | B3 2.1e-11 | an der Rechengrenze | offen | 1.059e+7 | 1.9e-5 | 52 | — |
| 0.259296912069 | 0.155046630630 | 33.38971959 | 35.5985 | 2.0e-7 | B3 2.4e-13 | über den Umkehrpunkt | instabil | 8.961e+8 | 0.05296 | 32 | — |
| 0.210581178710 | 0.141577988920 | 33.39851038 | 42.7047 | 3.8e-10 | B3 4.5e-12 | über den Umkehrpunkt | instabil | 2.68e+4 | 0.001294 | 38 | — |
| 0.091159756891 | 0.198492870488 | 33.40328703 | 47.3255 | 6.4e-9 | B3 8.7e-14 | über den Umkehrpunkt | instabil | 1.375e+6 | 0.05752 | 48 | — |
| 0.344329582430 | 0.089050268639 | 33.44511518 | 27.0249 | 4.5e-11 | B3 2.4e-12 | bestätigt | instabil | 76.5 | 2.2e-4 | 24 | nur Klasse von II.A-1 |
| 0.201562622705 | 0.160206548217 | 33.47487729 | 42.2844 | 8.0e-6 | C 8.9e-14 | über den Umkehrpunkt | instabil | 2.926e+9 | 0.008427 | 38 | — |
| 0.102538303737 | 0.131779724640 | 33.48344068 | 53.1405 | 1.4e-7 | B3 1.2e-12 | über den Umkehrpunkt | instabil | 5.985e+6 | 0.009904 | 48 | — |
| 0.089268118458 | 0.181580919731 | 33.51111830 | 49.4019 | 6.5e-6 | C 3.4e-13 | über den Umkehrpunkt | offen | 1.687e+12 | 0.006565 | 43 | — |
| 0.122508488259 | 0.209722318952 | 33.52513429 | 44.3479 | 5.3e-8 | B3 5.5e-14 | über den Umkehrpunkt | instabil | 6.767e+7 | 0.06738 | 40 | — |
| 0.058966805002 | 0.148817909076 | 33.55807897 | 53.9227 | 1.3e-8 | A3 1.2e-11 | an der Rechengrenze | instabil | 4.742e+6 | 0.001447 | 48 | — |
| 0.121304633901 | 0.070397842511 | 33.59005859 | 55.7402 | 5.1e-9 | B3 3.2e-11 | an der Rechengrenze | instabil | 2.215e+5 | 9.5e-5 | 50 | — |
| 0.073377095986 | 0.039374327695 | 33.59330358 | 59.5874 | 1.6e-8 | C 2.3e-12 | über den Umkehrpunkt | instabil | 6.829e+6 | 0.004763 | 54 | — |
| 0.371188401542 | 0.111620704873 | 33.63099682 | 21.7916 | 3.8e-7 | B3 3.3e-14 | über den Umkehrpunkt | instabil | 2.188e+8 | 0.09686 | 20 | — |
| 0.124740355011 | 0.053229629983 | 33.70016850 | 56.3055 | 1.1e-8 | A3 2.2e-11 | an der Rechengrenze | instabil | 1.892e+5 | 0.004363 | 50 | — |
| 0.002151846208 | 0.038753320676 | 33.73628923 | 61.5113 | 1.1e-7 | B3 3.6e-13 | über den Umkehrpunkt | instabil | 1.057e+7 | 0.001304 | 64 | — |
| 0.048835006970 | 0.044921584774 | 33.75839791 | 60.6579 | 1.2e-7 | A3 3.0e-10 | an der Rechengrenze | instabil | 9.868e+6 | 0.001018 | 54 | — |
| 0.255884786897 | 0.130899488262 | 33.75950302 | 38.2565 | 2.3e-8 | A3 4.0e-11 | an der Rechengrenze | offen | 2.597e+5 | 4.2e-5 | 34 | — |
| 0.261357046860 | 0.151425640842 | 33.76055073 | 36.0034 | 3.0e-8 | B3 4.5e-12 | über den Umkehrpunkt | instabil | 1.049e+7 | 0.008939 | 32 | — |
| 0.126499188134 | 0.044529530938 | 33.76731851 | 56.5406 | 5.5e-9 | B3 5.0e-11 | an der Rechengrenze | offen | 1.46e+3 | 6.8e-5 | 50 | — |
| 0.190034453197 | 0.197567421761 | 33.78370725 | 40.2729 | 3.4e-7 | C 9.9e-14 | über den Umkehrpunkt | instabil | 1.599e+8 | 0.02187 | 36 | — |
| 0.044554065845 | 0.170528084576 | 33.80831358 | 52.7169 | 1.0e-7 | C 2.6e-13 | über den Umkehrpunkt | instabil | 6.954e+5 | 0.003967 | 54 | — |
| 0.299350640957 | 0.213376687674 | 33.81583266 | 25.3073 | 3.8e-12 | C 6.4e-14 | bestätigt | instabil | 47.1 | 0.01842 | 22 | — |
| 0.098086068248 | 0.005519008988 | 33.83546397 | 59.1844 | 1.3e-9 | B3 6.4e-11 | an der Rechengrenze | offen | 587 | 8.1e-6 | 52 | — |
| 0.077955314560 | 0.028767429240 | 33.83715625 | 60.0292 | 3.6e-6 | C 1.1e-11 | an der Rechengrenze | offen | 2.589e+9 | 0.001414 | 54 | — |
| 0.091061656495 | 0.133311087978 | 33.85676752 | 54.2718 | 8.6e-7 | C 2.2e-13 | über den Umkehrpunkt | instabil | 5.729e+8 | 0.01140 | 48 | — |
| 0.096578926423 | 0.131053399616 | 33.88282548 | 54.1832 | 2.8e-7 | B3 1.8e-13 | über den Umkehrpunkt | instabil | 2.129e+6 | 0.002166 | 48 | — |
| 0.258115630277 | 0.128597613002 | 33.88957975 | 38.2584 | 2.7e-9 | B3 3.7e-12 | über den Umkehrpunkt | instabil | 6.13e+4 | 8.3e-4 | 34 | — |
| 0.129227217429 | 0.044819785467 | 33.89794553 | 56.5410 | 7.7e-10 | B3 4.1e-11 | an der Rechengrenze | instabil | 2.10e+3 | 5.4e-5 | 50 | — |
| 0.127626323821 | 0.050295281637 | 33.89872008 | 56.5092 | 2.0e-9 | B3 5.1e-12 | über den Umkehrpunkt | instabil | 1.20e+4 | 3.1e-4 | 50 | — |
| 0.062886151539 | 0.020680780776 | 33.93414329 | 60.9800 | 2.2e-8 | B3 7.1e-12 | über den Umkehrpunkt | instabil | 1.310e+6 | 0.001528 | 54 | — |
| 0.106687548003 | 0.042572767013 | 33.95797144 | 58.3146 | 2.1e-10 | A3 1.1e-11 | an der Rechengrenze | instabil | 6.54e+3 | 0.001845 | 52 | — |
| 0.248143949805 | 0.144746115959 | 33.99261063 | 38.5432 | 1.5e-7 | C 1.8e-10 | an der Rechengrenze | offen | 3.942e+5 | 2.9e-5 | 34 | — |
| 0.306187231690 | 0.127722218481 | 34.04414234 | 31.5072 | 8.4e-10 | B3 2.1e-12 | über den Umkehrpunkt | instabil | 1.14e+4 | 0.01001 | 28 | — |
| 0.247423158319 | 0.180960523382 | 34.06778005 | 35.6214 | 5.2e-8 | B3 1.7e-13 | über den Umkehrpunkt | instabil | 1.684e+7 | 0.03370 | 32 | — |
| 0.155542223065 | 0.080865923081 | 34.09704927 | 53.2657 | 1.6e-9 | B3 1.9e-11 | an der Rechengrenze | instabil | 8.96e+4 | 1.1e-4 | 48 | — |
| 0.050070551913 | 0.158082785480 | 34.13839933 | 54.2943 | 9.2e-7 | C 1.2e-13 | über den Umkehrpunkt | instabil | 2.173e+8 | 0.003214 | 50 | — |
| 0.077787238448 | 0.165163497771 | 34.14149404 | 52.5653 | 8.5e-7 | R 7.3e-13 | über den Umkehrpunkt | offen | 1.674e+8 | 3.1e-4 | 0 | — |
| 0.164615240543 | 0.265474077909 | 34.18358841 | 34.8073 | 1.2e-11 | A3 4.9e-13 | bestätigt | instabil | 462 | 0.01367 | 28 | — |
| 0.060210345277 | 0.062470636121 | 34.19947465 | 60.4785 | 1.8e-6 | C 1.3e-12 | über den Umkehrpunkt | instabil | 9.354e+8 | 0.007415 | 54 | — |
| 0.108405227496 | 0.003462630148 | 34.20832456 | 59.1848 | 5.0e-9 | A3 2.6e-10 | an der Rechengrenze | offen | 47.9 | 2.3e-6 | 52 | — |
| 0.084087709705 | 0.196597013819 | 34.21727476 | 49.0530 | 1.6e-8 | C 9.0e-14 | über den Umkehrpunkt | instabil | 1.736e+6 | 0.04487 | 50 | — |
| 0.251899950541 | 0.192648132241 | 34.24435617 | 34.0989 | 3.9e-9 | A3 4.5e-12 | über den Umkehrpunkt | instabil | 5.946e+5 | 0.001710 | 30 | — |
| 0.108251520545 | 0.044849763822 | 34.25615450 | 58.6621 | 6.3e-9 | B3 5.6e-12 | über den Umkehrpunkt | instabil | 6.310e+5 | 0.001679 | 52 | — |
| 0.137456516881 | 0.036495592478 | 34.30067050 | 56.7503 | 2.7e-10 | A3 1.6e-11 | an der Rechengrenze | offen | 29.6 | 1.6e-5 | 50 | — |
| 0.262865724629 | 0.125695088668 | 34.30224544 | 38.2600 | 7.3e-10 | C 2.9e-13 | über den Umkehrpunkt | instabil | 4.76e+4 | 0.01935 | 34 | — |
| 0.157352609099 | 0.070271601340 | 34.33035349 | 53.9395 | 3.1e-8 | B3 2.1e-13 | über den Umkehrpunkt | instabil | 5.293e+5 | 0.001056 | 48 | Satellit 3. Ordnung von Fund (0.086288, 0.041212) (T* das 2.99995-fache, Wort bis auf 4 Buchstaben) |
| 0.112233217605 | 0.020681189806 | 34.35958237 | 59.0570 | 1.1e-8 | A3 6.3e-11 | an der Rechengrenze | offen | 8.53e+4 | 8.1e-5 | 52 | — |
| 0.242405869210 | 0.136480643289 | 34.37771497 | 40.3698 | 8.3e-6 | B3 2.3e-12 | über den Umkehrpunkt | instabil | 2.623e+8 | 0.004437 | 36 | — |
| 0.112361888942 | 0.010520352377 | 34.38189327 | 59.1844 | 6.1e-10 | B3 5.0e-11 | an der Rechengrenze | offen | 593 | 8.2e-6 | 52 | — |
| 0.387048837301 | 0.103569079280 | 34.44848773 | 20.0600 | 3.2e-8 | A3 1.9e-12 | über den Umkehrpunkt | instabil | 2.458e+7 | 1.9e-4 | 18 | — |
| 0.262661449222 | 0.128973512131 | 34.50621052 | 38.2924 | 8.5e-9 | B3 8.6e-12 | über den Umkehrpunkt | offen | 9.85e+4 | 1.2e-4 | 34 | — |
| 0.105329007095 | 0.106871619250 | 34.58472590 | 56.5193 | 1.4e-10 | B3 1.5e-12 | über den Umkehrpunkt | instabil | 1.14e+3 | 3.6e-5 | 50 | — |
| 0.080192438883 | 0.095842014109 | 34.62416473 | 58.7071 | 6.9e-9 | A3 3.5e-11 | an der Rechengrenze | instabil | 5.59e+4 | 3.1e-4 | 52 | — |
| 0.119105277048 | 0.053467822830 | 34.64886520 | 58.3070 | 8.7e-9 | B3 9.1e-13 | über den Umkehrpunkt | instabil | 1.998e+5 | 0.004929 | 52 | — |
| 0.090639097105 | 0.199190722061 | 34.66096186 | 49.0540 | 6.4e-10 | C 8.8e-14 | über den Umkehrpunkt | instabil | 8.619e+5 | 0.06074 | 50 | — |
| 0.237071121463 | 0.147213268721 | 34.70884352 | 40.6250 | 3.0e-9 | B3 2.9e-11 | an der Rechengrenze | instabil | 2.023e+5 | 9.5e-5 | 36 | — |
| 0.048279237412 | 0.058790723221 | 34.73173982 | 61.9689 | 1.1e-6 | C 5.8e-13 | über den Umkehrpunkt | instabil | 5.189e+8 | 0.01324 | 56 | — |
| 0.267205564688 | 0.123820788659 | 34.74703866 | 38.2619 | 2.7e-10 | B3 1.8e-12 | über den Umkehrpunkt | instabil | 8.00e+3 | 8.0e-4 | 34 | — |
| 0.193708792571 | 0.094963413569 | 34.74931393 | 49.5750 | 1.1e-8 | B3 1.5e-11 | an der Rechengrenze | offen | 5.57e+3 | 2.5e-5 | 44 | — |
| 0.099673877411 | 0.173425313548 | 34.75204131 | 51.5071 | 2.9e-6 | B3 5.8e-12 | über den Umkehrpunkt | offen | 4.051e+7 | 0.001018 | 48 | — |
| 0.279079153033 | 0.131166936244 | 34.77233374 | 36.0607 | 5.1e-11 | A3 4.8e-12 | über den Umkehrpunkt | instabil | 5.08e+3 | 3.7e-4 | 32 | — |
| 0.245520579046 | 0.135212107787 | 34.77488699 | 40.5132 | 1.4e-8 | B3 8.2e-12 | über den Umkehrpunkt | instabil | 4.58e+4 | 0.004969 | 36 | — |
| 0.206546791064 | 0.192893477408 | 34.82353000 | 40.2113 | 1.4e-7 | B3 1.1e-13 | über den Umkehrpunkt | instabil | 1.083e+8 | 0.02106 | 36 | — |
| 0.262419015824 | 0.134247062931 | 34.82594123 | 38.3068 | 8.3e-9 | B3 6.2e-12 | über den Umkehrpunkt | instabil | 6.708e+6 | 0.002672 | 34 | — |
| 0.120857847203 | 0.070303695579 | 34.85731325 | 57.8807 | 2.7e-9 | B3 7.2e-13 | über den Umkehrpunkt | instabil | 2.62e+4 | 0.005118 | 52 | — |
| 0.181029708006 | 0.083511246802 | 34.87280446 | 51.7652 | 8.6e-9 | A3 3.9e-11 | an der Rechengrenze | instabil | 1.33e+3 | 6.5e-4 | 46 | — |
| 0.181444528925 | 0.083259713104 | 34.90053372 | 51.7740 | 2.8e-9 | C 1.5e-12 | über den Umkehrpunkt | instabil | 1.10e+4 | 6.2e-4 | 46 | — |
| 0.202971804723 | 0.163883019215 | 34.95013270 | 43.6497 | 1.0e-7 | B3 1.7e-11 | an der Rechengrenze | instabil | 8.580e+6 | 2.1e-4 | 38 | — |
| 0.081652870881 | 0.062946924317 | 34.95196174 | 60.8286 | 6.9e-8 | C 4.8e-13 | über den Umkehrpunkt | instabil | 3.018e+7 | 0.009555 | 54 | Satellit 3. Ordnung von Fund (0.048185, 0.042050) (T* das 3.00736-fache) |
| 0.158912665545 | 0.212904340287 | 34.96185479 | 42.9529 | 2.8e-6 | B3 1.1e-11 | an der Rechengrenze | instabil | 2.089e+10 | 0.003068 | 38 | — |
| 0.069138438464 | 0.013660456871 | 34.98681346 | 62.6853 | 6.0e-8 | A3 2.7e-11 | an der Rechengrenze | offen | 1.095e+7 | 6.1e-4 | 56 | — |
| 0.148027747180 | 0.065552844105 | 35.02644096 | 56.1021 | 1.3e-7 | C 1.5e-12 | über den Umkehrpunkt | offen | 3.636e+6 | 6.4e-4 | 50 | — |
| 0.070943611518 | 0.015554684385 | 35.03947322 | 62.6813 | 5.1e-8 | A3 9.9e-12 | über den Umkehrpunkt | offen | 2.284e+7 | 7.6e-4 | 56 | — |
| 0.162124602303 | 0.202586907712 | 35.05026074 | 43.9813 | 1.2e-7 | B3 3.4e-13 | über den Umkehrpunkt | instabil | 1.003e+8 | 0.006238 | 40 | — |
| 0.262881851433 | 0.171555555197 | 35.05849155 | 35.4436 | 3.6e-8 | A3 1.5e-12 | über den Umkehrpunkt | instabil | 9.286e+7 | 0.006924 | 32 | — |
| 0.097233729416 | 0.015220819139 | 35.06077050 | 61.3166 | 1.0e-8 | A3 5.1e-11 | an der Rechengrenze | offen | 3.194e+5 | 8.6e-5 | 54 | — |
| 0.135250449276 | 0.223754327184 | 35.06723940 | 43.7100 | 3.7e-6 | C 5.9e-14 | über den Umkehrpunkt | instabil | 5.379e+9 | 0.008775 | 38 | — |
| 0.353096441998 | 0.085644829615 | 35.10450636 | 27.0231 | 2.5e-10 | B3 7.7e-13 | über den Umkehrpunkt | instabil | 2.50e+3 | 0.001862 | 24 | nur Klasse von II.A-1 |
| 0.105653284118 | 0.038347582321 | 35.12426394 | 60.4947 | 6.9e-7 | A3 4.7e-10 | an der Rechengrenze | offen | 1.118e+7 | 4.3e-4 | 54 | — |
| 0.100050293180 | 0.032930548558 | 35.12718709 | 60.9863 | 1.3e-8 | B3 7.5e-11 | an der Rechengrenze | offen | 2.053e+6 | 1.0e-4 | 54 | — |
| 0.156753883589 | 0.206599480566 | 35.13366828 | 44.1061 | 1.6e-8 | C 6.7e-14 | über den Umkehrpunkt | instabil | 2.149e+8 | 0.02184 | 40 | — |
| 0.168409256868 | 0.087844387046 | 35.13814140 | 53.2655 | 8.9e-10 | B3 7.6e-12 | über den Umkehrpunkt | instabil | 1.49e+4 | 2.6e-4 | 48 | — |
| 0.288987012052 | 0.168639380534 | 35.14907274 | 32.0457 | 5.0e-11 | A3 3.4e-13 | bestätigt | instabil | 5.99e+3 | 0.005576 | 28 | — |
| 0.158582519947 | 0.154144813301 | 35.16716741 | 49.4697 | 3.5e-6 | B3 1.5e-12 | über den Umkehrpunkt | instabil | 2.104e+8 | 0.004147 | 44 | — |
| 0.104140820051 | 0.083198280651 | 35.16990622 | 58.9573 | 1.4e-8 | A3 8.9e-12 | über den Umkehrpunkt | instabil | 6.646e+5 | 0.002497 | 52 | — |
| 0.118685141766 | 0.214379242895 | 35.17156121 | 46.2213 | 4.9e-7 | B3 1.4e-13 | über den Umkehrpunkt | instabil | 4.603e+8 | 0.02919 | 40 | Satellit 5. Ordnung von I.A-2 (T* das 5.09983-fache, Wort bis auf 4 Buchstaben) |
| 0.056894927254 | 0.036824125873 | 35.18856584 | 63.1666 | 1.0e-5 | R 1.3e-12 | über den Umkehrpunkt | offen | 1.964e+8 | 2.6e-4 | 0 | — |
| 0.375475086417 | 0.110964642265 | 35.19393899 | 22.1101 | 3.7e-11 | B3 1.3e-13 | über den Umkehrpunkt | instabil | 1.535e+5 | 0.02993 | 20 | — |
| 0.169816324841 | 0.205257311573 | 35.19640551 | 43.1318 | 9.7e-8 | B3 6.8e-14 | über den Umkehrpunkt | instabil | 1.380e+7 | 0.1557 | 40 | — |
| 0.074732824390 | 0.235119758688 | 35.20030372 | 46.0217 | 1.1e-8 | C 7.7e-14 | über den Umkehrpunkt | instabil | 4.261e+5 | 0.03934 | 48 | — |
| 0.097309454772 | 0.059649107190 | 35.22176174 | 60.5379 | 1.0e-6 | C 5.9e-13 | über den Umkehrpunkt | offen | 1.007e+8 | 1.6e-4 | 54 | — |
| 0.237802557698 | 0.157513521605 | 35.23307759 | 40.2715 | 5.0e-6 | B3 2.4e-10 | an der Rechengrenze | offen | 6.783e+6 | 9.2e-6 | 32 | — |
| 0.332515409058 | 0.112435966541 | 35.23356030 | 29.2822 | 2.8e-10 | B3 4.5e-13 | über den Umkehrpunkt | instabil | 1.81e+3 | 0.008149 | 26 | — |
| 0.359377639234 | 0.062902677695 | 35.25657663 | 26.8747 | 1.6e-9 | B3 5.5e-12 | über den Umkehrpunkt | instabil | 1.20e+3 | 0.009219 | 24 | — |
| 0.078569228577 | 0.026945247561 | 35.28497059 | 62.5994 | 9.3e-7 | A3 6.1e-10 | an der Rechengrenze | offen | 7.794e+6 | 3.4e-4 | 56 | — |
| 0.129767816015 | 0.041733723817 | 35.30406802 | 58.9263 | 2.1e-9 | B3 2.3e-10 | an der Rechengrenze | offen | 377 | 1.4e-5 | 52 | — |
| 0.154984698948 | 0.247675564243 | 35.31309744 | 39.2596 | 2.0e-6 | R 9.0e-14 | über den Umkehrpunkt | instabil | 5.232e+9 | 0.07954 | 0 | — |
| 0.052020674200 | 0.080087323025 | 35.31497145 | 61.9419 | 9.7e-7 | B3 2.5e-14 | über den Umkehrpunkt | offen | 4.556e+8 | 0.004272 | 56 | — |
| 0.097066979987 | 0.098137085776 | 35.32298260 | 58.8097 | 5.7e-7 | B3 2.1e-11 | an der Rechengrenze | instabil | 9.070e+6 | 0.001941 | 52 | — |
| 0.102817062987 | 0.026009774852 | 35.34052130 | 61.3078 | 5.1e-8 | B3 3.0e-11 | an der Rechengrenze | instabil | 3.123e+5 | 0.001219 | 54 | — |
| 0.268139847659 | 0.131374568950 | 35.34364999 | 38.2562 | 1.4e-7 | A3 6.3e-11 | an der Rechengrenze | instabil | 1.595e+6 | 0.002545 | 34 | — |
| 0.102690027462 | 0.049949840693 | 35.34897656 | 60.7524 | 2.4e-6 | B3 2.7e-11 | an der Rechengrenze | offen | 2.013e+8 | 2.7e-4 | 54 | — |
| 0.335507505769 | 0.107825758564 | 35.36518417 | 29.1467 | 3.1e-9 | C 7.4e-14 | über den Umkehrpunkt | instabil | 1.617e+5 | 0.002684 | 26 | — |
| 0.233434034998 | 0.167223818190 | 35.36739990 | 40.1219 | 7.8e-9 | C 2.4e-14 | über den Umkehrpunkt | instabil | 9.752e+5 | 0.02966 | 36 | — |
| 0.081815488281 | 0.011524104478 | 35.40023094 | 62.8272 | 1.3e-7 | B3 7.8e-11 | an der Rechengrenze | offen | 3.138e+6 | 3.9e-4 | 56 | — |
| 0.078420409498 | 0.083629707179 | 35.40176792 | 60.8102 | 7.4e-8 | C 6.1e-13 | über den Umkehrpunkt | instabil | 3.155e+8 | 0.005081 | 38 | — |
| 0.187959389775 | 0.096788276706 | 35.40947871 | 51.0692 | 6.2e-7 | A3 6.2e-10 | an der Rechengrenze | offen | 6.21e+4 | 1.8e-5 | 46 | — |
| 0.219416332263 | 0.116437814174 | 35.41125674 | 46.0552 | 3.5e-8 | C 9.3e-14 | über den Umkehrpunkt | instabil | 5.413e+6 | 0.01185 | 42 | — |
| 0.307209464440 | 0.186515174997 | 35.49120576 | 28.0181 | 2.0e-9 | A3 2.4e-12 | über den Umkehrpunkt | instabil | 1.661e+5 | 0.004560 | 24 | — |
| 0.191194837287 | 0.119871041272 | 35.54224824 | 49.3965 | 6.8e-8 | B3 1.1e-10 | an der Rechengrenze | instabil | 5.15e+4 | 4.0e-4 | 44 | — |
| 0.216694427498 | 0.103346814858 | 35.54527095 | 47.4172 | 5.9e-9 | B3 2.2e-11 | an der Rechengrenze | instabil | 1.75e+4 | 4.8e-4 | 42 | Satellit 3. Ordnung von Fund (0.232901, 0.147984) (T* das 3.00266-fache, Wort bis auf 4 Buchstaben) |
| 0.057369276288 | 0.177034572044 | 35.57130856 | 54.3659 | 9.4e-6 | B3 2.8e-11 | an der Rechengrenze | offen | 1.600e+7 | 1.5e-5 | 56 | — |
| 0.236027057724 | 0.142476886148 | 35.59749410 | 42.1912 | 2.4e-8 | C 4.0e-13 | über den Umkehrpunkt | instabil | 4.727e+5 | 0.01447 | 38 | — |
| 0.140346719270 | 0.206975733481 | 35.65733847 | 46.1318 | 2.1e-6 | C 2.4e-13 | über den Umkehrpunkt | instabil | 8.839e+8 | 0.001849 | 42 | Satellit 3. Ordnung von I.B-5 (T* das 3.00065-fache) |
| 0.156092588830 | 0.251205958894 | 35.68882146 | 39.0949 | 8.8e-11 | B3 2.2e-14 | über den Umkehrpunkt | instabil | 2.45e+4 | 0.02297 | 32 | — |
| 0.088324321019 | 0.198416959460 | 35.72477644 | 50.7769 | 7.6e-9 | B3 3.7e-14 | über den Umkehrpunkt | instabil | 2.338e+6 | 0.05548 | 52 | — |
| 0.336481739633 | 0.144156512206 | 35.73559291 | 27.0218 | 1.3e-10 | B3 1.1e-14 | über den Umkehrpunkt | instabil | 180 | 0.01024 | 24 | Satellit 3. Ordnung von I.A-2 (T* das 2.98145-fache, Wort bis auf 4 Buchstaben) |
| 0.129478669115 | 0.108482855343 | 35.73981543 | 56.5174 | 1.3e-11 | C 5.2e-14 | bestätigt | instabil | 389 | 0.002955 | 50 | — |
| 0.207410732900 | 0.134031456467 | 35.74799460 | 46.7034 | 2.3e-8 | B3 3.6e-12 | über den Umkehrpunkt | instabil | 1.688e+7 | 0.002106 | 42 | — |
| 0.158315111790 | 0.258170132656 | 35.78372782 | 38.0300 | 1.5e-8 | B3 4.8e-14 | über den Umkehrpunkt | instabil | 2.102e+7 | 0.07908 | 32 | nur Klasse von II.A-2 |
| 0.221579941671 | 0.158166266615 | 35.82930135 | 43.0058 | 2.3e-7 | B3 9.2e-11 | an der Rechengrenze | offen | 1.859e+7 | 3.4e-4 | 38 | — |
| 0.061439758493 | 0.330493105733 | 35.83433318 | 32.3978 | 1.0e-11 | B3 1.2e-11 | bestätigt | instabil | 8.73e+3 | 0.02214 | 24 | nur Klasse von II.A-1 |
| 0.082462394837 | 0.049632675745 | 35.85946961 | 62.8504 | 1.0e-7 | A3 3.9e-12 | über den Umkehrpunkt | offen | 2.110e+8 | 0.001470 | 56 | — |
| 0.118458379702 | 0.052222773197 | 35.86671594 | 60.4476 | 2.0e-8 | C 4.0e-13 | über den Umkehrpunkt | instabil | 1.516e+6 | 0.001203 | 54 | — |
| 0.162402283781 | 0.244872167109 | 35.86926829 | 39.6070 | 6.7e-8 | C 6.5e-14 | über den Umkehrpunkt | instabil | 2.675e+7 | 0.1189 | 34 | — |
| 0.121982229443 | 0.087696920356 | 35.87669033 | 58.6133 | 4.5e-10 | B3 4.7e-12 | über den Umkehrpunkt | instabil | 4.25e+3 | 2.2e-5 | 52 | — |
| 0.259280121544 | 0.153223335346 | 35.90244195 | 38.4345 | 1.5e-8 | C 2.4e-13 | über den Umkehrpunkt | instabil | 1.005e+7 | 0.05613 | 34 | — |
| 0.064450582453 | 0.078478608593 | 35.90898639 | 62.5968 | 4.4e-7 | A3 4.6e-11 | an der Rechengrenze | instabil | 1.353e+8 | 0.005033 | 56 | — |
| 0.230615406524 | 0.201247288134 | 35.94627523 | 37.6624 | 5.5e-7 | A3 3.3e-11 | an der Rechengrenze | instabil | 9.301e+7 | 0.004108 | 14 | nur Klasse von I.B-5 |
| 0.118822170674 | 0.026700633661 | 36.03273837 | 61.3485 | 2.1e-10 | C 7.8e-10 | an der Rechengrenze | instabil | 329 | 1.9e-4 | 54 | — |
| 0.091032939023 | 0.012108484525 | 36.05163110 | 63.4580 | 3.2e-8 | B3 1.4e-10 | an der Rechengrenze | offen | 5.45e+4 | 9.5e-6 | 56 | — |
| 0.257088970310 | 0.232862429196 | 36.13299601 | 30.7688 | 5.4e-12 | A3 3.3e-12 | bestätigt | instabil | 154 | 0.05232 | 26 | nur Klasse von II.C-18 |
| 0.249567947975 | 0.187568742506 | 36.14500548 | 36.8341 | 6.5e-11 | B3 3.2e-14 | über den Umkehrpunkt | instabil | 7.176e+5 | 0.1201 | 32 | — |
| 0.197449289881 | 0.121496508148 | 36.15199268 | 49.3921 | 2.9e-8 | A3 2.3e-11 | an der Rechengrenze | instabil | 3.559e+5 | 0.001935 | 44 | — |
| 0.217438359011 | 0.152809642691 | 36.15264746 | 44.4017 | 1.1e-6 | B3 6.6e-12 | über den Umkehrpunkt | instabil | 1.154e+8 | 0.003127 | 40 | — |
| 0.077451482995 | 0.209957890864 | 36.15583656 | 50.5047 | 4.2e-8 | C 1.0e-13 | über den Umkehrpunkt | instabil | 1.607e+7 | 0.07345 | 46 | — |
| 0.144631774797 | 0.079910765685 | 36.18521589 | 57.6108 | 3.0e-9 | B3 5.4e-12 | über den Umkehrpunkt | offen | 1.932e+5 | 6.5e-5 | 52 | Satellit 2. Ordnung von Fund (0.070857, 0.159293) (T* das 2.02456-fache, Wort bis auf 4 Buchstaben) |
| 0.125053729866 | 0.053968657361 | 36.19385528 | 60.4212 | 6.2e-7 | C 2.6e-12 | über den Umkehrpunkt | offen | 9.416e+7 | 0.002946 | 54 | — |
| 0.157226557407 | 0.242605346917 | 36.19559058 | 40.7440 | 1.5e-9 | B3 3.3e-12 | über den Umkehrpunkt | instabil | 1.70e+4 | 5.8e-5 | 36 | — |
| 0.101118766899 | 0.044121009474 | 36.23784464 | 62.5630 | 3.6e-8 | B3 1.0e-11 | über den Umkehrpunkt | instabil | 1.110e+6 | 0.001426 | 56 | — |
| 0.252414055474 | 0.206066190936 | 36.24723166 | 34.5813 | 1.2e-8 | B3 5.2e-12 | über den Umkehrpunkt | instabil | 5.821e+6 | 0.05690 | 30 | — |
| 0.143954512103 | 0.102028834532 | 36.26060848 | 56.5193 | 2.9e-10 | A3 1.4e-11 | an der Rechengrenze | instabil | 1.14e+3 | 3.8e-5 | 50 | — |
| 0.056582090850 | 0.021460222304 | 36.29680547 | 65.4643 | 1.9e-7 | B3 1.2e-11 | an der Rechengrenze | instabil | 1.240e+8 | 0.001762 | 58 | — |
| 0.095586537098 | 0.219119478815 | 36.30146809 | 48.5720 | 6.1e-6 | B3 2.7e-13 | über den Umkehrpunkt | instabil | 4.128e+9 | 0.07882 | 44 | — |
| 0.094601834716 | 0.045122010463 | 36.31040342 | 63.0762 | 4.7e-6 | B3 1.1e-12 | über den Umkehrpunkt | offen | 8.438e+8 | 6.2e-4 | 56 | — |
| 0.150462858296 | 0.241007776030 | 36.34542253 | 41.7246 | 2.8e-9 | B3 1.1e-11 | an der Rechengrenze | instabil | 2.854e+5 | 0.003116 | 36 | — |
| 0.308963379909 | 0.121458874748 | 36.34580606 | 33.5983 | 3.9e-10 | B3 3.2e-13 | über den Umkehrpunkt | instabil | 7.70e+3 | 6.7e-4 | 30 | — |
| 0.075343085905 | 0.019072335649 | 36.35793656 | 64.7867 | 1.9e-8 | A3 1.0e-10 | an der Rechengrenze | offen | 1.232e+5 | 3.7e-5 | 58 | — |
| 0.270565856747 | 0.186305898803 | 36.36151389 | 34.2243 | 1.3e-8 | B3 1.2e-10 | an der Rechengrenze | offen | 2.043e+6 | 3.1e-5 | 30 | — |
| 0.094133950922 | 0.208985088941 | 36.36441875 | 50.0495 | 4.0e-7 | A3 3.9e-11 | an der Rechengrenze | offen | 2.735e+8 | 3.1e-4 | 46 | — |
| 0.123264560118 | 0.047883755215 | 36.38967554 | 61.0929 | 1.6e-10 | A3 9.1e-11 | an der Rechengrenze | instabil | 1.08e+3 | 3.7e-5 | 54 | Satellit 3. Ordnung von II.C-9 (T* das 3.00005-fache) |
| 0.334873548596 | 0.129260739811 | 36.43112355 | 28.8402 | 1.2e-10 | A3 1.1e-13 | über den Umkehrpunkt | instabil | 4.05e+3 | 0.009863 | 26 | — |
| 0.163965986966 | 0.080811404469 | 36.45051704 | 56.0934 | 3.8e-9 | B3 5.0e-12 | über den Umkehrpunkt | instabil | 9.69e+3 | 0.002449 | 50 | — |
| 0.025406843598 | 0.017592199903 | 36.45614268 | 66.6547 | 6.1e-6 | B3 3.0e-10 | an der Rechengrenze | offen | 1.866e+9 | 9.0e-5 | 56 | — |
| 0.125852677578 | 0.045261558430 | 36.46670234 | 61.0921 | 9.8e-10 | A3 4.3e-11 | an der Rechengrenze | instabil | 313 | 4.2e-4 | 54 | Satellit 3. Ordnung von II.C-9 (T* das 3.00001-fache) |
| 0.223877115834 | 0.148452907763 | 36.46967853 | 44.3439 | 5.7e-10 | B3 4.3e-14 | über den Umkehrpunkt | instabil | 9.29e+3 | 0.01498 | 40 | — |
| 0.081061464945 | 0.196339589505 | 36.48825408 | 52.4942 | 1.5e-8 | C 1.5e-13 | über den Umkehrpunkt | instabil | 2.659e+6 | 0.04241 | 54 | — |
| 0.099834704527 | 0.058184023888 | 36.51973004 | 62.6621 | 5.1e-7 | B3 9.5e-13 | über den Umkehrpunkt | instabil | 3.703e+7 | 0.003027 | 56 | — |
| 0.331371430010 | 0.093252879121 | 36.52443992 | 31.5749 | 9.6e-12 | B3 8.9e-13 | bestätigt | instabil | 9.61 | 0.001589 | 28 | Satellit 2. Ordnung von Fund (0.312288, 0.103615) (T* das 1.99997-fache) |
| 0.076902006402 | 0.085775576543 | 36.55828118 | 62.7549 | 6.3e-6 | B3 1.3e-12 | über den Umkehrpunkt | offen | 2.151e+9 | 0.002364 | 40 | — |
| 0.252800954063 | 0.120367738251 | 36.56412965 | 42.6456 | 8.1e-9 | B3 2.1e-12 | über den Umkehrpunkt | instabil | 2.240e+6 | 0.02175 | 38 | — |
| 0.097570265316 | 0.046285527072 | 36.56772104 | 63.3002 | 1.8e-9 | A3 4.3e-11 | an der Rechengrenze | instabil | 4.69e+4 | 5.4e-4 | 56 | — |
| 0.279236527985 | 0.126435838533 | 36.58953114 | 38.2598 | 1.1e-8 | B3 1.3e-11 | an der Rechengrenze | instabil | 6.66e+4 | 6.0e-5 | 34 | — |
| 0.129888930999 | 0.049618638770 | 36.60830623 | 60.8585 | 3.6e-9 | A3 1.5e-11 | an der Rechengrenze | instabil | 4.06e+3 | 0.003676 | 54 | — |
| 0.385743169350 | 0.078368140873 | 36.61885476 | 22.6196 | 2.1e-10 | B3 1.2e-12 | über den Umkehrpunkt | instabil | 2.58e+4 | 0.007354 | 20 | Satellit 2. Ordnung von Fund (0.334287, 0.114623) (T* das 2.01406-fache, Wort bis auf 4 Buchstaben) |
| 0.186423831499 | 0.092959932865 | 36.65182430 | 53.2657 | 4.5e-7 | B3 3.2e-10 | an der Rechengrenze | offen | 8.96e+4 | 8.9e-5 | 48 | — |
| 0.202678555101 | 0.251648350089 | 36.65218900 | 35.4479 | 7.6e-11 | C 8.4e-14 | bestätigt | instabil | 8.58e+3 | 0.001805 | 30 | — |
| 0.134123681051 | 0.092434301495 | 36.65913720 | 58.6130 | 6.2e-9 | B3 7.3e-12 | über den Umkehrpunkt | instabil | 1.670e+5 | 4.6e-4 | 52 | — |
| 0.133393657373 | 0.093825099887 | 36.67221412 | 58.6134 | 5.0e-10 | B3 1.5e-12 | über den Umkehrpunkt | instabil | 1.03e+4 | 1.0e-4 | 52 | — |
| 0.198899592859 | 0.093560646269 | 36.67493599 | 51.7739 | 1.1e-8 | C 1.7e-12 | über den Umkehrpunkt | offen | 1.50e+4 | 1.9e-4 | 46 | — |
| 0.109917648425 | 0.047832025080 | 36.67495460 | 62.5937 | 2.2e-8 | B3 1.3e-12 | über den Umkehrpunkt | instabil | 1.810e+6 | 0.001031 | 56 | — |
| 0.395182155740 | 0.096548411660 | 36.68630970 | 20.2343 | 9.5e-11 | B3 1.3e-13 | bestätigt | instabil | 1.81e+4 | 0.03852 | 18 | Satellit 3. Ordnung von Fund (0.375866, 0.102951) (T* das 3.03918-fache, Wort bis auf 4 Buchstaben) |
| 0.120702915018 | 0.134702291852 | 36.70199736 | 56.7034 | 5.6e-8 | A3 1.5e-10 | an der Rechengrenze | instabil | 1.646e+6 | 7.8e-4 | 50 | — |
| 0.008265486139 | 0.305415050280 | 36.74194332 | 38.5905 | 1.3e-9 | B3 5.6e-12 | über den Umkehrpunkt | instabil | 5.366e+5 | 6.7e-4 | 28 | Satellit 2. Ordnung von I.B-4 (T* das 2.00666-fache, Wort bis auf 4 Buchstaben) |
| 0.275916785502 | 0.198726561636 | 36.77245472 | 32.5492 | 2.3e-8 | B3 1.7e-13 | über den Umkehrpunkt | instabil | 2.162e+7 | 0.01622 | 28 | — |
| 0.342401829840 | 0.107453352308 | 36.78828327 | 29.1391 | 3.5e-9 | B3 8.6e-13 | über den Umkehrpunkt | instabil | 1.152e+6 | 0.005192 | 26 | — |
| 0.254441283245 | 0.187225896468 | 36.78988115 | 36.8468 | 3.5e-10 | B3 6.0e-14 | über den Umkehrpunkt | instabil | 4.506e+5 | 0.1079 | 32 | — |
| 0.339183612408 | 0.148583802192 | 36.92509238 | 27.1374 | 1.2e-11 | C 1.2e-14 | bestätigt | instabil | 518 | 0.08600 | 24 | — |
| 0.153149135481 | 0.074221697812 | 36.93140040 | 58.2629 | 8.7e-7 | B3 3.7e-13 | über den Umkehrpunkt | offen | 8.745e+6 | 9.2e-4 | 52 | — |
| 0.154431580298 | 0.212084528437 | 36.94066045 | 45.9050 | 9.6e-8 | C 3.1e-14 | über den Umkehrpunkt | instabil | 1.695e+9 | 0.1032 | 40 | — |
| 0.137638588977 | 0.094983231403 | 36.95056539 | 58.6152 | 3.8e-10 | A3 1.7e-12 | über den Umkehrpunkt | instabil | 7.44e+3 | 6.3e-4 | 52 | — |
| 0.373138373027 | 0.093595222996 | 36.96739776 | 24.4947 | 4.0e-9 | B3 1.4e-11 | an der Rechengrenze | instabil | 2.45e+4 | 5.4e-4 | 22 | — |
| 0.121667376109 | 0.141215407868 | 36.97368315 | 56.4734 | 9.5e-6 | C 1.2e-11 | an der Rechengrenze | offen | 6.269e+8 | 0.001036 | 50 | — |
| 0.088045522267 | 0.199103136023 | 36.98286946 | 52.4954 | 9.5e-9 | C 6.0e-14 | über den Umkehrpunkt | instabil | 1.458e+6 | 0.05874 | 54 | — |
| 0.046549279265 | 0.154341211369 | 36.98345610 | 59.3085 | 8.4e-7 | C 1.0e-12 | über den Umkehrpunkt | instabil | 9.970e+8 | 0.009044 | 56 | — |
| 0.208727790608 | 0.143650799980 | 36.99366347 | 47.3577 | 7.2e-8 | B3 6.3e-12 | über den Umkehrpunkt | instabil | 9.327e+6 | 0.001175 | 42 | — |
| 0.130149861960 | 0.244756900689 | 37.00386451 | 43.6126 | 8.9e-8 | R 4.3e-14 | über den Umkehrpunkt | instabil | 1.730e+9 | 0.05256 | 0 | — |
| 0.244590800500 | 0.141677404120 | 37.01660298 | 42.7356 | 1.2e-8 | B3 6.9e-13 | über den Umkehrpunkt | instabil | 8.228e+6 | 0.003472 | 38 | — |
| 0.090723973950 | 0.040194020325 | 37.04293918 | 64.7295 | 3.5e-7 | C 2.1e-12 | über den Umkehrpunkt | offen | 1.786e+9 | 1.2e-4 | 58 | — |
| 0.253565538178 | 0.124577801113 | 37.05963453 | 42.8092 | 3.1e-10 | A3 2.0e-12 | über den Umkehrpunkt | instabil | 1.181e+5 | 0.001705 | 38 | nur Klasse von II.C-30 |
| 0.254487617154 | 0.122806797569 | 37.06583916 | 42.8075 | 1.3e-9 | B3 5.4e-13 | über den Umkehrpunkt | instabil | 2.607e+5 | 0.01566 | 38 | nur Klasse von II.C-30 |
| 0.362729650688 | 0.081159609983 | 37.11439912 | 27.0164 | 3.4e-9 | B3 6.3e-13 | über den Umkehrpunkt | instabil | 9.44e+4 | 1.9e-4 | 24 | nur Klasse von I.A-9 |
| 0.233345437987 | 0.100587617952 | 37.12732430 | 47.4184 | 4.3e-11 | B3 1.2e-12 | bestätigt | instabil | 1.52e+3 | 0.004703 | 42 | Satellit 3. Ordnung von Fund (0.232901, 0.147984) (T* das 3.00273-fache, Wort bis auf 4 Buchstaben) |
| 0.114342302243 | 0.257377623326 | 37.18029054 | 43.0943 | 2.4e-7 | B3 2.7e-10 | an der Rechengrenze | instabil | 5.509e+9 | 0.006929 | 38 | — |
| 0.172226991001 | 0.085261935080 | 37.18371735 | 56.0932 | 4.1e-9 | B3 4.2e-11 | an der Rechengrenze | instabil | 4.12e+3 | 6.7e-4 | 50 | — |
| 0.267046679513 | 0.212820872613 | 37.22317347 | 32.6846 | 7.2e-10 | B3 7.7e-14 | über den Umkehrpunkt | instabil | 1.815e+5 | 0.005679 | 28 | — |
| 0.150306020156 | 0.192418206246 | 37.24696641 | 49.0798 | 4.5e-8 | C 5.5e-14 | über den Umkehrpunkt | instabil | 2.367e+7 | 0.09465 | 46 | — |
| 0.313794565422 | 0.169803156140 | 37.25582105 | 29.8942 | 2.5e-10 | B3 1.2e-12 | über den Umkehrpunkt | instabil | 9.54e+3 | 0.002333 | 26 | — |
| 0.009682523828 | 0.051195025417 | 37.32147328 | 67.6354 | 4.6e-7 | B3 2.1e-12 | über den Umkehrpunkt | instabil | 5.127e+7 | 1.4e-4 | 64 | — |
| 0.162662939575 | 0.081868664583 | 37.35179167 | 57.5624 | 2.2e-8 | B3 2.3e-11 | an der Rechengrenze | instabil | 3.248e+5 | 0.002227 | 52 | — |
| 0.075493935042 | 0.155152435153 | 37.38146784 | 58.7094 | 8.9e-6 | C 5.3e-12 | über den Umkehrpunkt | instabil | 4.430e+7 | 0.005650 | 52 | — |
| 0.073437289799 | 0.234705401079 | 37.39486553 | 49.0095 | 1.6e-8 | C 3.4e-14 | über den Umkehrpunkt | instabil | 5.359e+5 | 0.03883 | 52 | — |
| 0.299091987929 | 0.220966879302 | 37.40062311 | 27.1938 | 4.1e-10 | B3 3.5e-12 | über den Umkehrpunkt | instabil | 2.83e+4 | 0.005683 | 24 | Satellit 3. Ordnung von I.A-2 (T* das 3.00043-fache, Wort bis auf 2 Buchstaben) |
| 0.043205357604 | 0.268202526922 | 37.42262698 | 45.0122 | 2.9e-9 | C 8.0e-14 | über den Umkehrpunkt | instabil | 6.207e+5 | 0.03980 | 42 | — |
| 0.023444296620 | 0.274002560157 | 37.42603342 | 44.4718 | 1.8e-10 | A3 3.4e-12 | über den Umkehrpunkt | instabil | 2.30e+4 | 0.003677 | 36 | — |
| 0.075330532085 | 0.153492399779 | 37.43662966 | 58.9714 | 1.5e-6 | B3 1.5e-11 | an der Rechengrenze | instabil | 1.979e+7 | 2.4e-5 | 52 | — |
| 0.354668935693 | 0.067050870468 | 37.44968458 | 29.2739 | 1.7e-11 | C 1.5e-13 | bestätigt | instabil | 84.3 | 0.03543 | 26 | — |
| 0.256587668113 | 0.148853460346 | 37.49020310 | 40.9160 | 7.3e-6 | A3 3.4e-10 | an der Rechengrenze | offen | 2.155e+7 | 6.7e-6 | 36 | — |
| 0.374807098586 | 0.093736016089 | 37.49412354 | 24.5319 | 1.7e-10 | C 6.7e-13 | über den Umkehrpunkt | instabil | 1.40e+3 | 0.001285 | 22 | — |
| 0.226434329553 | 0.128769381433 | 37.50777984 | 46.9049 | 2.0e-11 | A3 7.6e-13 | bestätigt | instabil | 2.20e+3 | 0.006448 | 42 | — |
| 0.080201026526 | 0.254426137359 | 37.51081979 | 45.9088 | 7.3e-8 | B3 7.8e-14 | über den Umkehrpunkt | instabil | 4.103e+7 | 0.007268 | 44 | — |
| 0.184604755701 | 0.115188231384 | 37.55603506 | 53.3238 | 8.7e-8 | B3 1.4e-10 | an der Rechengrenze | offen | 8.02e+4 | 1.2e-5 | 48 | — |
| 0.068984209586 | 0.012315253967 | 37.56758537 | 67.3285 | 6.4e-7 | B3 3.0e-12 | über den Umkehrpunkt | offen | 4.700e+7 | 5.1e-4 | 60 | — |
| 0.049155926915 | 0.204960163290 | 37.57676288 | 54.2815 | 1.1e-7 | B3 2.0e-14 | über den Umkehrpunkt | instabil | 6.200e+8 | 0.07840 | 56 | — |
| 0.209288085592 | 0.241383967648 | 37.58722605 | 37.0058 | 9.6e-8 | B3 9.8e-14 | über den Umkehrpunkt | instabil | 6.615e+7 | 0.06818 | 32 | — |
| 0.218315837741 | 0.127681815640 | 37.60193589 | 48.2094 | 3.8e-9 | B3 1.9e-13 | über den Umkehrpunkt | instabil | 2.412e+5 | 0.01970 | 44 | — |
| 0.140895707438 | 0.067525555252 | 37.62480831 | 60.8585 | 1.3e-9 | B3 7.6e-13 | über den Umkehrpunkt | instabil | 4.26e+3 | 0.003671 | 54 | — |
| 0.158267072984 | 0.085751232136 | 37.62941620 | 58.2381 | 9.2e-9 | A3 7.3e-12 | über den Umkehrpunkt | instabil | 1.316e+5 | 0.003169 | 52 | — |
| 0.095805167794 | 0.008673135228 | 37.63537021 | 65.9663 | 2.2e-9 | A3 5.0e-10 | an der Rechengrenze | offen | 2.04e+3 | 1.5e-5 | 58 | — |
| 0.091759663511 | 0.059746888594 | 37.65894226 | 65.0782 | 8.6e-7 | A3 5.7e-10 | an der Rechengrenze | offen | 5.053e+6 | 9.1e-6 | 58 | — |
| 0.035634847963 | 0.041968358932 | 37.66921814 | 68.1566 | 4.5e-6 | A3 9.1e-11 | an der Rechengrenze | offen | 1.512e+10 | 9.3e-5 | 60 | — |
| 0.199525443327 | 0.102786826840 | 37.68004605 | 52.5409 | 4.2e-9 | B3 1.2e-12 | über den Umkehrpunkt | instabil | 1.98e+4 | 7.5e-4 | 48 | — |
| 0.125870656104 | 0.226906856808 | 37.68400751 | 47.2849 | 3.6e-8 | B3 3.5e-14 | über den Umkehrpunkt | instabil | 1.370e+6 | 0.002090 | 40 | — |
| 0.155048470311 | 0.200814839134 | 37.69047872 | 48.1994 | 2.0e-6 | B3 2.4e-14 | über den Umkehrpunkt | instabil | 1.634e+10 | 0.01733 | 44 | — |
| 0.073718902782 | 0.044143762749 | 37.70996449 | 66.7360 | 2.0e-8 | B3 5.6e-13 | über den Umkehrpunkt | instabil | 1.624e+6 | 0.004539 | 60 | — |
| 0.124827795555 | 0.036751393231 | 37.72084739 | 63.5142 | 1.1e-10 | B3 3.6e-13 | über den Umkehrpunkt | instabil | 220 | 0.002334 | 56 | nur Klasse von II.A-5 |
| 0.099804219927 | 0.028378938645 | 37.72113172 | 65.6014 | 1.3e-7 | B3 1.0e-10 | an der Rechengrenze | offen | 2.779e+5 | 6.0e-5 | 58 | — |
| 0.200528381265 | 0.203621393369 | 37.72272880 | 43.0248 | 4.1e-6 | C 7.8e-14 | über den Umkehrpunkt | instabil | 2.206e+9 | 0.005502 | 38 | — |
| 0.098000773645 | 0.013093529358 | 37.73718225 | 65.9668 | 1.6e-9 | A3 3.3e-10 | an der Rechengrenze | offen | 6.30e+3 | 1.5e-5 | 58 | — |
| 0.098793321386 | 0.011646749248 | 37.76072603 | 65.9670 | 2.1e-8 | A3 9.3e-10 | an der Rechengrenze | offen | 2.10e+3 | 3.5e-6 | 58 | — |
| 0.034917094461 | 0.310351293334 | 37.76433903 | 38.4640 | 1.1e-11 | C 1.2e-13 | bestätigt | instabil | 2.47e+4 | 0.01059 | 28 | — |
| 0.191974966619 | 0.167383971212 | 37.86361781 | 48.2652 | 2.2e-7 | C 1.6e-11 | an der Rechengrenze | offen | 4.173e+5 | 6.1e-4 | 42 | — |
| 0.097617407472 | 0.049177728276 | 37.88347887 | 65.4805 | 1.1e-6 | B3 4.4e-13 | über den Umkehrpunkt | instabil | 2.554e+8 | 0.005572 | 60 | — |
| 0.105838763189 | 0.080836086106 | 37.98595999 | 63.6884 | 9.8e-7 | A3 1.9e-10 | an der Rechengrenze | offen | 3.555e+7 | 4.0e-4 | 56 | — |
| 0.098475075027 | 0.052450333887 | 37.99025238 | 65.4939 | 2.2e-7 | B3 4.4e-13 | über den Umkehrpunkt | instabil | 3.109e+6 | 0.006181 | 60 | — |
| 0.057879402703 | 0.161483886608 | 38.02775051 | 59.8387 | 2.6e-8 | B3 3.1e-12 | über den Umkehrpunkt | instabil | 2.139e+7 | 0.007259 | 56 | — |
| 0.281820234904 | 0.168242385120 | 38.02846381 | 35.8457 | 1.1e-7 | B3 1.9e-13 | über den Umkehrpunkt | instabil | 2.475e+7 | 0.01934 | 32 | — |
| 0.086006981377 | 0.198337959215 | 38.04117998 | 54.2090 | 6.7e-9 | B3 2.2e-14 | über den Umkehrpunkt | instabil | 3.718e+6 | 0.05383 | 56 | — |
| 0.245635901646 | 0.230095518797 | 38.05081609 | 34.3243 | 3.9e-10 | B3 6.3e-13 | über den Umkehrpunkt | instabil | 1.775e+5 | 0.02405 | 30 | — |
| 0.083289394720 | 0.026838773664 | 38.06104257 | 67.2626 | 3.5e-8 | A3 4.4e-11 | an der Rechengrenze | instabil | 3.348e+6 | 0.002054 | 60 | — |
| 0.386564732019 | 0.005405543290 | 38.08778150 | 24.8721 | 2.8e-7 | A3 2.0e-10 | an der Rechengrenze | offen | 5.22e+4 | 6.7e-5 | 22 | — |
| 0.302047659669 | 0.176431371897 | 38.08865818 | 31.8830 | 2.1e-9 | A3 8.0e-12 | über den Umkehrpunkt | instabil | 1.35e+3 | 6.5e-4 | 28 | — |
| 0.088700019570 | 0.044063779296 | 38.10835023 | 66.6040 | 4.7e-6 | B3 1.6e-12 | über den Umkehrpunkt | offen | 9.723e+8 | 0.005022 | 60 | — |
| 0.297470690554 | 0.136765879529 | 38.11291627 | 36.0752 | 1.4e-8 | B3 1.5e-14 | über den Umkehrpunkt | instabil | 1.642e+6 | 0.03743 | 32 | — |
| 0.227794847134 | 0.099046074865 | 38.13404195 | 49.5966 | 3.2e-10 | B3 9.6e-13 | über den Umkehrpunkt | instabil | 8.32e+3 | 0.004827 | 44 | — |
| 0.099395724534 | 0.071365780087 | 38.18535402 | 64.9653 | 1.6e-9 | B3 6.6e-12 | über den Umkehrpunkt | instabil | 3.304e+5 | 8.8e-4 | 58 | — |
| 0.257960769377 | 0.134171664775 | 38.20635910 | 42.7192 | 7.3e-11 | B3 4.5e-13 | bestätigt | instabil | 1.41e+4 | 0.003200 | 38 | — |
| 0.044935648803 | 0.081606144304 | 38.26369957 | 67.2667 | 4.3e-6 | B3 2.8e-11 | an der Rechengrenze | instabil | 4.782e+10 | 0.001936 | 62 | — |
| 0.111157520954 | 0.013762699280 | 38.28274185 | 65.9648 | 1.5e-8 | B3 3.1e-10 | an der Rechengrenze | offen | 2.27e+3 | 5.9e-6 | 58 | — |
| 0.197012168681 | 0.128991420086 | 38.29168514 | 51.7731 | 1.7e-8 | A3 5.7e-12 | über den Umkehrpunkt | instabil | 2.081e+6 | 1.0e-3 | 46 | — |
| 0.382282677839 | 0.194616897591 | 38.30089073 | 16.9146 | 3.3e-12 | B3 9.0e-15 | bestätigt | instabil | 9.91 | 0.2731 | 16 | — |
| 0.153296274604 | 0.104776381228 | 38.31688483 | 58.6133 | 1.0e-9 | B3 2.8e-13 | über den Umkehrpunkt | instabil | 1.31e+4 | 2.0e-4 | 52 | — |
| 0.199011118159 | 0.175908833391 | 38.34265511 | 47.1163 | 6.9e-6 | C 9.1e-13 | über den Umkehrpunkt | offen | 6.568e+10 | 0.001225 | 42 | — |
| 0.265442351484 | 0.119707541907 | 38.38317881 | 42.8441 | 2.2e-10 | B3 8.8e-13 | über den Umkehrpunkt | instabil | 1.17e+4 | 4.6e-4 | 38 | — |
| 0.359215926224 | 0.184205983438 | 38.44688225 | 21.8047 | 9.0e-11 | B3 5.7e-14 | bestätigt | instabil | 6.72e+3 | 0.2552 | 20 | — |
| 0.257620249322 | 0.104260223342 | 38.47607140 | 45.2279 | 8.3e-10 | B3 3.6e-12 | über den Umkehrpunkt | instabil | 1.65e+3 | 2.6e-4 | 40 | — |
| 0.070892318116 | 0.025271327445 | 38.47647714 | 68.6933 | 2.0e-6 | C 8.6e-13 | über den Umkehrpunkt | instabil | 2.908e+7 | 0.002079 | 62 | — |
| 0.041529312335 | 0.298262390256 | 38.47893744 | 41.1982 | 1.7e-6 | C 3.9e-13 | über den Umkehrpunkt | instabil | 1.026e+9 | 0.002781 | 30 | — |
| 0.331207244688 | 0.137891846201 | 38.47951899 | 30.4982 | 6.4e-10 | B3 3.7e-14 | über den Umkehrpunkt | instabil | 4.94e+3 | 0.1507 | 28 | — |
| 0.131873204589 | 0.243302684580 | 38.48224889 | 45.4338 | 4.4e-9 | C 2.1e-13 | über den Umkehrpunkt | instabil | 7.333e+5 | 0.08042 | 38 | — |
| 0.044832208711 | 0.142587659164 | 38.48761248 | 62.9569 | 1.6e-6 | B3 3.4e-13 | über den Umkehrpunkt | instabil | 5.950e+8 | 0.02694 | 56 | — |
| 0.094426931360 | 0.014953581328 | 38.50282189 | 67.5264 | 8.2e-9 | B3 9.7e-11 | an der Rechengrenze | instabil | 2.60e+4 | 6.2e-5 | 60 | — |
| 0.237161361875 | 0.145686480484 | 38.50470813 | 45.1910 | 2.8e-8 | A3 8.8e-12 | über den Umkehrpunkt | instabil | 3.064e+6 | 0.004976 | 40 | — |
| 0.212062236092 | 0.163742225605 | 38.54245903 | 46.9807 | 7.4e-6 | C 7.1e-11 | an der Rechengrenze | offen | 8.130e+7 | 6.7e-5 | 2 | — |
| 0.109327474168 | 0.099707034246 | 38.54862700 | 63.2091 | 4.1e-8 | A3 3.6e-10 | an der Rechengrenze | offen | 6.05e+4 | 1.6e-5 | 56 | — |
| 0.086966676239 | 0.055774560337 | 38.56498353 | 67.1011 | 9.6e-9 | B3 1.4e-12 | über den Umkehrpunkt | instabil | 3.485e+5 | 0.001864 | 60 | Satellit 3. Ordnung von I.A-7 (T* das 3.00060-fache, Wort bis auf 4 Buchstaben) |
| 0.140913594699 | 0.062938814747 | 38.57587745 | 62.5985 | 3.2e-8 | B3 6.3e-14 | über den Umkehrpunkt | instabil | 1.038e+6 | 0.004282 | 56 | — |
| 0.136736405663 | 0.057257496515 | 38.57691267 | 63.2277 | 2.7e-11 | B3 8.2e-12 | über den Umkehrpunkt | instabil | 1.938e+5 | 2.2e-4 | 56 | — |
| 0.115256630535 | 0.063270312660 | 38.58686292 | 64.8504 | 9.3e-6 | B3 2.6e-10 | an der Rechengrenze | offen | 9.341e+7 | 2.8e-6 | 58 | — |
| 0.087065189001 | 0.086397865892 | 38.59431744 | 65.6361 | 2.3e-8 | B3 1.9e-10 | an der Rechengrenze | offen | 6.69e+4 | 1.6e-6 | 58 | — |
| 0.316889323318 | 0.134636110172 | 38.60389413 | 33.3608 | 7.1e-8 | B3 2.3e-11 | an der Rechengrenze | instabil | 6.371e+5 | 0.06724 | 30 | — |
| 0.387148582912 | 0.038543914362 | 38.61290194 | 24.7371 | 6.3e-9 | B3 6.7e-12 | über den Umkehrpunkt | instabil | 8.44e+4 | 0.008323 | 22 | — |
| 0.172800597260 | 0.080381223221 | 38.62666334 | 58.4730 | 3.5e-9 | B3 1.6e-11 | an der Rechengrenze | instabil | 2.72e+4 | 6.9e-4 | 52 | — |
| 0.188871827226 | 0.097380824678 | 38.66733767 | 55.6176 | 8.1e-8 | B3 9.3e-11 | an der Rechengrenze | offen | 4.21e+3 | 3.3e-8 | 50 | — |
| 0.354140408626 | 0.092297832408 | 38.67316306 | 29.2607 | 6.6e-11 | A3 4.8e-12 | über den Umkehrpunkt | instabil | 8.33e+3 | 0.002893 | 26 | — |
| 0.264087791995 | 0.127653009959 | 38.69122677 | 42.8128 | 2.5e-10 | B3 5.9e-13 | über den Umkehrpunkt | instabil | 2.43e+3 | 0.001981 | 38 | nur Klasse von II.C-30 |
| 0.063903200833 | 0.038047053598 | 38.69693514 | 69.1338 | 6.8e-6 | A3 8.5e-10 | an der Rechengrenze | offen | 7.305e+8 | 8.4e-5 | 62 | — |
| 0.093925892852 | 0.251357022002 | 38.70743616 | 47.1134 | 4.9e-6 | B3 1.7e-13 | über den Umkehrpunkt | offen | 1.763e+10 | 0.002510 | 40 | Satellit 5. Ordnung von Fund (0.060089, 0.391129) (T* das 4.97434-fache, Wort bis auf 4 Buchstaben) |
| 0.102682933901 | 0.115200261884 | 38.72323785 | 62.8387 | 1.6e-8 | B3 8.6e-12 | über den Umkehrpunkt | instabil | 7.643e+7 | 0.01301 | 56 | — |
| 0.038830013867 | 0.152698019269 | 38.74082674 | 62.5228 | 7.7e-7 | C 2.3e-13 | über den Umkehrpunkt | instabil | 1.081e+9 | 0.008822 | 60 | — |
| 0.078577382247 | 0.196113582691 | 38.75707951 | 55.9176 | 5.7e-8 | C 1.9e-14 | über den Umkehrpunkt | instabil | 3.837e+6 | 0.04044 | 58 | — |
| 0.118637336985 | 0.040858859167 | 38.76325011 | 65.6809 | 6.1e-11 | B3 1.7e-12 | bestätigt | instabil | 86.3 | 0.003076 | 58 | — |
| 0.209476595469 | 0.264507010752 | 38.76678261 | 34.8120 | 8.8e-11 | B3 5.5e-13 | bestätigt | instabil | 4.74e+3 | 0.01817 | 28 | — |
| 0.070766632059 | 0.041745190515 | 38.76753480 | 68.8302 | 7.3e-7 | C 1.0e-12 | über den Umkehrpunkt | instabil | 9.177e+7 | 0.003974 | 62 | — |
| 0.244928483441 | 0.169544372765 | 38.77593284 | 42.0976 | 3.3e-10 | B3 5.1e-13 | über den Umkehrpunkt | instabil | 3.042e+5 | 0.004653 | 38 | — |
| 0.388524171778 | 0.018334220343 | 38.78041869 | 24.8651 | 3.0e-9 | A3 2.8e-11 | an der Rechengrenze | instabil | 384 | 6.8e-6 | 22 | — |
| 0.366084705994 | 0.103648130140 | 38.78485624 | 26.5228 | 1.9e-6 | B3 1.4e-13 | über den Umkehrpunkt | instabil | 2.346e+8 | 0.04020 | 24 | — |
| 0.161048833643 | 0.072774715159 | 38.78755979 | 60.4243 | 1.1e-6 | C 8.5e-12 | über den Umkehrpunkt | offen | 1.157e+7 | 0.002710 | 54 | — |
| 0.182898063905 | 0.104408233787 | 38.81608250 | 56.0955 | 1.5e-7 | B3 1.5e-10 | an der Rechengrenze | offen | 8.29e+4 | 1.2e-5 | 50 | — |
| 0.161401353018 | 0.055561158758 | 38.83628530 | 61.2091 | 1.1e-10 | B3 2.5e-11 | an der Rechengrenze | offen | 13.1 | 3.9e-5 | 54 | — |
| 0.072076904866 | 0.016675831781 | 38.84700155 | 69.4224 | 4.7e-6 | C 2.5e-10 | an der Rechengrenze | offen | 2.503e+7 | 8.7e-4 | 62 | — |
| 0.247010638999 | 0.103729220244 | 38.89856187 | 47.4172 | 9.4e-11 | B3 6.1e-13 | über den Umkehrpunkt | instabil | 1.75e+4 | 5.1e-4 | 42 | Satellit 3. Ordnung von Fund (0.232901, 0.147984) (T* das 3.00266-fache, Wort bis auf 4 Buchstaben) |
| 0.031654205221 | 0.133161379242 | 38.90182338 | 64.8785 | 8.8e-7 | B3 2.4e-13 | über den Umkehrpunkt | instabil | 7.459e+8 | 0.01747 | 56 | — |
| 0.216243733648 | 0.156552787460 | 38.91495824 | 47.5944 | 1.7e-8 | B3 3.1e-12 | über den Umkehrpunkt | instabil | 1.267e+7 | 0.002671 | 42 | — |
| 0.158093479523 | 0.346974782991 | 38.93689146 | 26.4663 | 4.3e-12 | B3 9.7e-14 | bestätigt | instabil | 151 | 0.03649 | 20 | Satellit 2. Ordnung von II.C-1 (T* das 2.00119-fache) |
| 0.191755872249 | 0.208146534614 | 38.94363940 | 44.8997 | 5.3e-8 | C 2.2e-13 | über den Umkehrpunkt | instabil | 1.097e+7 | 0.02699 | 38 | — |
| 0.112540588313 | 0.078313905894 | 38.96980101 | 64.9695 | 5.0e-9 | A3 5.0e-11 | an der Rechengrenze | instabil | 6.52e+4 | 1.5e-4 | 58 | — |
| 0.143750052320 | 0.057440491280 | 38.99474830 | 63.2282 | 6.4e-11 | B3 7.8e-12 | über den Umkehrpunkt | instabil | 1.168e+5 | 4.4e-4 | 56 | — |
| 0.163205069125 | 0.107595108193 | 38.99822863 | 58.4014 | 7.4e-8 | B3 6.9e-11 | an der Rechengrenze | offen | 4.86e+4 | 2.4e-5 | 52 | — |
| 0.100100903032 | 0.048265294353 | 39.01494531 | 67.2951 | 3.0e-6 | B3 9.3e-11 | an der Rechengrenze | instabil | 2.305e+8 | 0.001674 | 60 | — |
| 0.191151444638 | 0.167014521046 | 39.05365464 | 49.9217 | 2.0e-7 | A3 2.0e-10 | an der Rechengrenze | offen | 1.169e+7 | 3.1e-5 | 44 | — |
| 0.103235800455 | 0.041130620565 | 39.07446123 | 67.3978 | 1.3e-8 | A3 1.6e-11 | an der Rechengrenze | instabil | 1.838e+6 | 1.0e-4 | 60 | — |
| 0.218144057043 | 0.104108109168 | 39.14359076 | 51.9628 | 6.5e-10 | A3 5.2e-12 | über den Umkehrpunkt | instabil | 2.79e+3 | 0.001049 | 46 | — |
| 0.254020289226 | 0.127043528823 | 39.20795049 | 45.0285 | 1.9e-8 | B3 2.1e-12 | über den Umkehrpunkt | instabil | 1.591e+6 | 7.3e-4 | 40 | — |
| 0.149729445123 | 0.066688221504 | 39.21414841 | 62.5837 | 2.3e-6 | B3 6.5e-13 | über den Umkehrpunkt | offen | 1.134e+8 | 0.002056 | 56 | — |
| 0.278933152872 | 0.132154273530 | 39.22377961 | 40.6239 | 8.3e-10 | B3 2.9e-13 | über den Umkehrpunkt | instabil | 3.76e+3 | 0.001043 | 36 | — |
| 0.211029113692 | 0.152888336721 | 39.24750603 | 49.0633 | 7.7e-7 | B3 4.2e-12 | über den Umkehrpunkt | instabil | 9.702e+6 | 0.005398 | 44 | — |
| 0.191614129973 | 0.166381800002 | 39.29374259 | 50.2394 | 8.4e-6 | B3 1.1e-12 | über den Umkehrpunkt | offen | 2.191e+9 | 0.002308 | 44 | — |
| 0.085902465479 | 0.199017041899 | 39.29972149 | 55.9189 | 6.5e-9 | C 1.1e-13 | über den Umkehrpunkt | instabil | 2.308e+6 | 0.05712 | 58 | — |
| 0.122249265624 | 0.138408457714 | 39.30491971 | 60.2525 | 9.8e-7 | C 1.9e-13 | über den Umkehrpunkt | instabil | 3.756e+8 | 0.002699 | 54 | — |
| 0.153756243158 | 0.147579637261 | 39.32593804 | 56.4766 | 2.8e-8 | C 1.7e-11 | an der Rechengrenze | instabil | 1.942e+5 | 7.1e-4 | 50 | — |
| 0.160307245964 | 0.140651796586 | 39.36499570 | 56.5125 | 2.1e-9 | B3 1.3e-11 | an der Rechengrenze | offen | 102 | 9.5e-5 | 50 | — |
| 0.071907585206 | 0.047112977858 | 39.37498343 | 69.6800 | 1.3e-7 | C 1.9e-12 | über den Umkehrpunkt | instabil | 7.198e+6 | 0.006756 | 62 | — |
| 0.271989385481 | 0.120902682370 | 39.39609104 | 42.8133 | 7.1e-11 | A3 1.8e-12 | bestätigt | instabil | 87.0 | 0.002050 | 38 | nur Klasse von II.C-30 |
| 0.208172500386 | 0.128491255020 | 39.39616277 | 51.8375 | 4.1e-9 | B3 2.3e-11 | an der Rechengrenze | instabil | 1.13e+4 | 5.1e-4 | 46 | — |
| 0.108393508773 | 0.174003257177 | 39.40071858 | 57.7195 | 5.0e-6 | B3 4.3e-12 | über den Umkehrpunkt | offen | 2.168e+8 | 0.003458 | 52 | — |
| 0.149156401112 | 0.060241971276 | 39.40369843 | 63.2282 | 1.1e-9 | B3 6.3e-12 | über den Umkehrpunkt | instabil | 8.86e+3 | 0.001350 | 56 | — |
| 0.134219754375 | 0.059199871166 | 39.40949526 | 64.7512 | 4.3e-7 | C 6.1e-12 | über den Umkehrpunkt | instabil | 6.782e+6 | 0.001421 | 58 | — |
| 0.226787660734 | 0.180829039625 | 39.41656876 | 44.1995 | 7.9e-7 | C 4.2e-14 | über den Umkehrpunkt | instabil | 1.182e+9 | 0.004905 | 40 | — |
| 0.250705545629 | 0.115218577711 | 39.47473797 | 46.7490 | 9.6e-8 | B3 5.7e-11 | an der Rechengrenze | offen | 7.300e+5 | 1.8e-4 | 42 | — |
| 0.169376023543 | 0.245311759968 | 39.48561866 | 42.8283 | 8.8e-8 | R 5.0e-14 | über den Umkehrpunkt | instabil | 5.060e+6 | 0.02533 | 0 | — |
| 0.142595055854 | 0.239454921153 | 39.56121751 | 46.3677 | 1.6e-6 | B3 1.4e-10 | an der Rechengrenze | offen | 5.123e+6 | 5.4e-6 | 40 | — |
| 0.032404975740 | 0.071600408405 | 39.60041484 | 70.5154 | 4.8e-7 | C 2.9e-13 | über den Umkehrpunkt | instabil | 8.091e+8 | 0.006127 | 62 | — |
| 0.220385240783 | 0.241143160993 | 39.60963360 | 37.6303 | 7.0e-8 | R 1.2e-14 | über den Umkehrpunkt | instabil | 5.990e+7 | 0.06479 | 0 | — |
| 0.208387328994 | 0.104384560791 | 39.65534195 | 53.9893 | 8.4e-11 | A3 6.4e-12 | bestätigt | instabil | 1.71e+3 | 0.002606 | 48 | — |
| 0.111000684341 | 0.051362935982 | 39.70817846 | 67.5609 | 4.8e-6 | B3 5.5e-11 | an der Rechengrenze | offen | 6.787e+8 | 0.001950 | 60 | — |
| 0.220979051900 | 0.113356027479 | 39.73940320 | 51.6908 | 4.6e-6 | B3 3.0e-10 | an der Rechengrenze | offen | 9.552e+6 | 6.7e-5 | 46 | — |
| 0.131313410717 | 0.062751842516 | 39.75997097 | 65.4462 | 6.3e-10 | A3 2.9e-12 | über den Umkehrpunkt | instabil | 1.21e+3 | 3.9e-4 | 58 | — |
| 0.271908329692 | 0.126384217633 | 39.76504681 | 42.8128 | 8.0e-10 | B3 6.6e-12 | über den Umkehrpunkt | instabil | 2.43e+3 | 0.002018 | 38 | nur Klasse von II.C-30 |
| 0.301250056009 | 0.120212834516 | 39.80284547 | 38.2599 | 1.9e-8 | A3 2.4e-11 | an der Rechengrenze | instabil | 2.23e+4 | 2.8e-4 | 34 | — |
| 0.136513117882 | 0.205187420301 | 39.81782075 | 52.1007 | 2.9e-6 | C 6.0e-14 | über den Umkehrpunkt | instabil | 1.196e+10 | 0.01150 | 48 | — |
| 0.158288074015 | 0.189710168245 | 39.82170269 | 52.0054 | 3.1e-6 | C 1.9e-13 | über den Umkehrpunkt | instabil | 3.701e+8 | 0.006703 | 48 | — |
| 0.068103151409 | 0.039699895748 | 39.83870016 | 70.9262 | 2.6e-7 | B3 5.3e-13 | über den Umkehrpunkt | instabil | 6.319e+8 | 0.005116 | 64 | — |
| 0.177160246241 | 0.151152643681 | 39.86001047 | 54.2973 | 4.3e-7 | B3 2.1e-10 | an der Rechengrenze | offen | 1.620e+6 | 6.5e-6 | 48 | — |
| 0.208129571987 | 0.120449719178 | 39.89216387 | 53.1537 | 1.4e-8 | B3 2.0e-12 | über den Umkehrpunkt | instabil | 1.903e+7 | 0.007428 | 48 | — |
| 0.194300583592 | 0.243402935478 | 39.91510277 | 40.8172 | 2.8e-9 | C 4.0e-14 | über den Umkehrpunkt | instabil | 1.776e+6 | 0.04063 | 34 | — |
| 0.188275541585 | 0.213767653764 | 39.96387161 | 45.7467 | 5.3e-6 | B3 1.2e-10 | an der Rechengrenze | offen | 4.942e+8 | 2.3e-4 | 36 | — |
| 0.076960105830 | 0.169772841805 | 40.00582893 | 61.1043 | 3.4e-7 | C 1.3e-11 | an der Rechengrenze | offen | 2.870e+5 | 2.4e-4 | 58 | — |
| 0.115575729497 | 0.065904959184 | 40.01321662 | 67.0999 | 5.1e-9 | B3 5.8e-12 | über den Umkehrpunkt | instabil | 1.398e+5 | 3.5e-4 | 60 | — |
| 0.140940873605 | 0.204500683715 | 40.03246550 | 52.0709 | 5.9e-6 | R 1.7e-13 | über den Umkehrpunkt | offen | 1.579e+9 | 2.1e-4 | 0 | — |
| 0.187169643812 | 0.249035573908 | 40.04656984 | 40.9355 | 4.2e-7 | B3 1.7e-13 | über den Umkehrpunkt | instabil | 1.943e+8 | 0.07312 | 36 | — |
| 0.117895254449 | 0.043345361442 | 40.04770953 | 67.8452 | 2.8e-10 | B3 2.4e-12 | über den Umkehrpunkt | instabil | 1.16e+4 | 0.003480 | 60 | — |
| 0.248772312730 | 0.176530260007 | 40.07273839 | 42.1794 | 9.0e-7 | C 3.3e-13 | über den Umkehrpunkt | instabil | 2.399e+8 | 0.1678 | 38 | — |
| 0.385527300599 | 0.085949444041 | 40.17588722 | 24.5403 | 6.9e-9 | B3 4.4e-12 | über den Umkehrpunkt | instabil | 9.160e+5 | 0.004786 | 22 | — |
| 0.161196174900 | 0.223866266884 | 40.18985762 | 47.6049 | 9.0e-6 | C 2.4e-13 | über den Umkehrpunkt | instabil | 3.324e+9 | 0.01700 | 42 | — |
| 0.077320470036 | 0.020563036984 | 40.21714896 | 71.5315 | 2.1e-7 | B3 4.9e-12 | über den Umkehrpunkt | offen | 1.615e+7 | 0.001281 | 64 | — |
| 0.353256253804 | 0.075429173549 | 40.26075118 | 31.4174 | 7.2e-11 | B3 5.5e-14 | bestätigt | instabil | 6.32e+3 | 0.04095 | 28 | Satellit 7. Ordnung von I.A-1 (T* das 6.92260-fache, Wort bis auf 4 Buchstaben) |
| 0.078319602580 | 0.079714315081 | 40.28038305 | 69.4275 | 5.6e-6 | C 1.3e-11 | an der Rechengrenze | offen | 1.110e+9 | 0.001540 | 46 | — |
| 0.172372887951 | 0.116122528568 | 40.28482626 | 58.6134 | 9.0e-9 | B3 2.9e-11 | an der Rechengrenze | offen | 1.03e+4 | 1.1e-4 | 52 | — |
| 0.084072722375 | 0.198260466304 | 40.35208314 | 57.6246 | 5.7e-9 | B3 6.9e-14 | über den Umkehrpunkt | instabil | 5.611e+6 | 0.05247 | 60 | — |
| 0.178451206276 | 0.133803365852 | 40.37829753 | 56.5157 | 7.3e-10 | C 3.7e-12 | über den Umkehrpunkt | instabil | 489 | 3.3e-4 | 50 | — |
| 0.132268871037 | 0.089045139731 | 40.38889525 | 64.9697 | 5.7e-9 | C 6.1e-12 | über den Umkehrpunkt | instabil | 1.315e+5 | 1.4e-4 | 58 | — |
| 0.042909624357 | 0.171308446070 | 40.38915799 | 62.9351 | 7.6e-9 | C 1.7e-13 | über den Umkehrpunkt | instabil | 3.001e+6 | 0.003780 | 66 | — |
| 0.025682882656 | 0.282280154322 | 40.50753452 | 46.6243 | 1.0e-9 | C 2.5e-13 | über den Umkehrpunkt | instabil | 1.420e+5 | 0.01039 | 36 | — |
| 0.288889487727 | 0.172885674301 | 40.50879775 | 36.5223 | 1.0e-7 | B3 2.7e-14 | über den Umkehrpunkt | instabil | 9.463e+7 | 0.02079 | 32 | — |
| 0.061402951603 | 0.306715946817 | 40.53282736 | 41.1897 | 1.7e-7 | C 2.4e-12 | über den Umkehrpunkt | instabil | 3.485e+6 | 8.8e-5 | 30 | — |
| 0.093164728651 | 0.070566827419 | 40.53603533 | 69.4418 | 7.4e-8 | C 5.5e-12 | über den Umkehrpunkt | instabil | 2.191e+7 | 0.008054 | 62 | — |
| 0.218131450177 | 0.167232419122 | 40.54037724 | 48.1979 | 1.9e-7 | C 2.3e-12 | über den Umkehrpunkt | instabil | 1.783e+7 | 0.009722 | 42 | — |
| 0.135367984821 | 0.088283512987 | 40.54334383 | 64.9709 | 5.4e-9 | C 9.7e-13 | über den Umkehrpunkt | instabil | 6.81e+4 | 0.004954 | 58 | — |
| 0.244617984881 | 0.107221955928 | 40.55619469 | 49.5808 | 6.3e-9 | B3 1.8e-13 | über den Umkehrpunkt | instabil | 9.70e+4 | 0.01620 | 44 | — |
| 0.101294870193 | 0.218709330272 | 40.63446103 | 54.0528 | 4.3e-8 | C 2.1e-13 | über den Umkehrpunkt | instabil | 1.545e+7 | 0.07902 | 50 | — |
| 0.012226535793 | 0.379530025774 | 40.73900843 | 28.0122 | 6.6e-9 | R 1.8e-13 | über den Umkehrpunkt | offen | 2.498e+5 | 4.4e-4 | 0 | — |
| 0.205859271764 | 0.131285597880 | 40.82346159 | 53.7934 | 2.9e-8 | B3 1.6e-12 | über den Umkehrpunkt | instabil | 1.334e+6 | 0.003672 | 48 | — |
| 0.144523898002 | 0.238123929465 | 40.82995747 | 47.8812 | 3.4e-6 | C 3.0e-12 | über den Umkehrpunkt | offen | 1.031e+8 | 7.5e-4 | 42 | — |
| 0.371198748027 | 0.108927034095 | 40.94502645 | 26.6867 | 5.8e-9 | C 3.1e-14 | über den Umkehrpunkt | instabil | 2.945e+7 | 0.009430 | 24 | — |
| 0.118666071982 | 0.051183383513 | 40.96433378 | 69.0602 | 2.2e-6 | C 3.3e-12 | über den Umkehrpunkt | offen | 1.756e+8 | 0.003213 | 62 | — |
| 0.074720056682 | 0.149536839974 | 40.99952159 | 65.0460 | 2.6e-6 | C 4.0e-12 | über den Umkehrpunkt | instabil | 9.107e+8 | 0.006935 | 58 | — |
| 0.399135360441 | 0.081668287546 | 41.00279191 | 22.4920 | 2.2e-9 | B3 9.3e-14 | über den Umkehrpunkt | instabil | 2.532e+5 | 0.01252 | 20 | nur Klasse von I.A-6 · Satellit 5. Ordnung von I.A-1 (T* das 4.95597-fache, Wort bis auf 4 Buchstaben) |
| 0.076499131714 | 0.195914728264 | 41.02275880 | 59.3256 | 6.9e-8 | C 6.4e-14 | über den Umkehrpunkt | instabil | 5.284e+6 | 0.03884 | 62 | — |
| 0.278046728854 | 0.173529748274 | 41.04522832 | 38.7816 | 2.3e-7 | C 8.2e-12 | über den Umkehrpunkt | offen | 1.793e+6 | 6.3e-5 | 34 | — |
| 0.180350349482 | 0.208692880228 | 41.11904593 | 48.7125 | 6.8e-6 | B3 2.5e-12 | über den Umkehrpunkt | offen | 4.165e+8 | 4.6e-4 | 44 | — |
| 0.052083540077 | 0.325968944219 | 41.17540094 | 38.4371 | 1.6e-10 | C 2.8e-13 | über den Umkehrpunkt | instabil | 8.84e+3 | 0.008084 | 28 | — |
| 0.120958383675 | 0.195642254339 | 41.19764377 | 56.5742 | 2.1e-7 | C 1.9e-13 | über den Umkehrpunkt | instabil | 1.446e+9 | 0.06876 | 54 | — |
| 0.172098267199 | 0.192383747383 | 41.28756426 | 52.0408 | 1.3e-8 | R 1.4e-13 | über den Umkehrpunkt | instabil | 1.879e+7 | 0.009585 | 0 | — |
| 0.173324084685 | 0.153436602165 | 41.29405998 | 56.4737 | 4.4e-7 | C 1.4e-12 | über den Umkehrpunkt | instabil | 9.804e+6 | 0.009361 | 50 | — |
| 0.136529209684 | 0.065658443334 | 41.32166599 | 67.3701 | 2.5e-6 | B3 7.1e-12 | über den Umkehrpunkt | offen | 3.134e+7 | 7.2e-4 | 60 | — |
| 0.117410942154 | 0.044786162276 | 41.32470746 | 70.0037 | 4.6e-9 | C 7.1e-12 | über den Umkehrpunkt | instabil | 4.56e+4 | 0.003285 | 62 | — |
| 0.078170416406 | 0.097071622530 | 41.38821040 | 70.2067 | 4.0e-6 | C 1.8e-10 | an der Rechengrenze | offen | 4.462e+7 | 4.6e-5 | 62 | — |
| 0.076358212430 | 0.022500245774 | 41.38867367 | 73.6395 | 6.0e-9 | C 5.7e-12 | über den Umkehrpunkt | offen | 1.635e+7 | 2.1e-4 | 66 | — |
| 0.218164310561 | 0.157941793136 | 41.43351365 | 50.2528 | 3.1e-6 | B3 2.7e-11 | an der Rechengrenze | offen | 2.209e+7 | 1.5e-4 | 44 | — |
| 0.287781647969 | 0.142482337224 | 41.45578670 | 40.4897 | 8.8e-8 | B3 3.6e-13 | über den Umkehrpunkt | instabil | 1.235e+7 | 0.002752 | 36 | — |
| 0.194783601576 | 0.240238375057 | 41.45907037 | 42.8174 | 1.6e-7 | R 7.7e-14 | über den Umkehrpunkt | instabil | 4.703e+7 | 0.02672 | 0 | — |
| 0.220642382418 | 0.193812386168 | 41.51539861 | 45.8706 | 1.5e-7 | C 1.9e-14 | über den Umkehrpunkt | instabil | 5.110e+8 | 0.07916 | 40 | — |
| 0.379457098058 | 0.161320046650 | 41.54177137 | 21.7669 | 1.5e-11 | B3 5.6e-14 | bestätigt | instabil | 5.19e+3 | 0.1557 | 20 | — |
| 0.007034226652 | 0.280031459147 | 41.56504585 | 48.4552 | 9.4e-8 | R 3.6e-12 | über den Umkehrpunkt | instabil | 8.222e+6 | 8.4e-4 | 0 | — |
| 0.098933367670 | 0.037191699980 | 41.60468804 | 72.2035 | 7.2e-6 | B3 2.6e-12 | über den Umkehrpunkt | offen | 1.166e+8 | 0.001285 | 64 | — |
| 0.187810637743 | 0.118267188529 | 41.60565885 | 58.4040 | 1.0e-8 | B3 4.7e-12 | über den Umkehrpunkt | instabil | 3.07e+4 | 7.5e-4 | 52 | — |
| 0.084097695420 | 0.198934893128 | 41.61122876 | 59.3271 | 3.6e-10 | C 7.2e-14 | über den Umkehrpunkt | instabil | 3.468e+6 | 0.05577 | 62 | — |
| 0.203339625123 | 0.161854396658 | 41.67693310 | 52.2231 | 9.5e-6 | C 7.9e-12 | über den Umkehrpunkt | offen | 1.262e+9 | 4.0e-4 | 46 | — |
| 0.088192205937 | 0.238690149965 | 41.68231452 | 53.1739 | 2.3e-6 | C 1.0e-11 | an der Rechengrenze | instabil | 2.022e+9 | 0.04596 | 50 | — |
| 0.296013567911 | 0.090063643937 | 41.69711326 | 43.0378 | 1.7e-11 | C 1.1e-13 | bestätigt | offen | 1.01 | 0.001077 | 38 | nur Klasse von I.B-18 |
| 0.293367122175 | 0.192713201003 | 41.73939007 | 34.6908 | 9.2e-10 | C 6.7e-14 | über den Umkehrpunkt | instabil | 7.854e+5 | 0.05594 | 30 | — |
| 0.054555405166 | 0.303314159211 | 41.74067836 | 43.3234 | 5.1e-6 | C 3.0e-12 | über den Umkehrpunkt | offen | 2.063e+8 | 8.0e-5 | 32 | — |
| 0.192310426908 | 0.242692789153 | 41.75185574 | 43.0476 | 9.3e-9 | C 9.0e-14 | über den Umkehrpunkt | instabil | 1.478e+7 | 0.01983 | 36 | — |
| 0.217041452809 | 0.254844126899 | 41.75611648 | 38.0391 | 1.1e-12 | B3 1.9e-14 | bestätigt | instabil | 3.05 | 0.1004 | 32 | nur Klasse von II.A-2 |
| 0.216176577277 | 0.197210223534 | 41.94201434 | 46.5445 | 4.1e-7 | C 3.3e-14 | über den Umkehrpunkt | instabil | 1.576e+9 | 0.1968 | 42 | — |
| 0.241524990742 | 0.227931244674 | 42.01237360 | 38.8131 | 9.9e-7 | C 2.9e-13 | über den Umkehrpunkt | offen | 2.785e+8 | 6.3e-4 | 34 | — |
| 0.317156735074 | 0.108096315634 | 42.07613177 | 38.2631 | 7.0e-10 | C 1.3e-12 | über den Umkehrpunkt | instabil | 2.23e+3 | 0.001779 | 34 | — |
| 0.229091292906 | 0.191425099440 | 42.22515585 | 45.7151 | 2.6e-7 | B3 7.6e-14 | über den Umkehrpunkt | instabil | 2.064e+8 | 0.02102 | 40 | — |
| 0.314320478942 | 0.134919676456 | 42.24407997 | 36.9739 | 5.3e-7 | C 1.0e-13 | über den Umkehrpunkt | instabil | 9.755e+7 | 0.1455 | 34 | — |
| 0.199204889710 | 0.202832721651 | 42.24560070 | 48.4649 | 2.0e-7 | B3 8.9e-14 | über den Umkehrpunkt | instabil | 5.669e+7 | 0.1263 | 44 | — |
| 0.110497873674 | 0.022384722893 | 42.25389535 | 72.7446 | 1.8e-8 | B3 6.9e-12 | über den Umkehrpunkt | offen | 3.49e+4 | 2.1e-5 | 64 | — |
| 0.376014349315 | 0.106788931597 | 42.27456302 | 26.6954 | 2.4e-7 | R 6.3e-13 | über den Umkehrpunkt | instabil | 3.298e+5 | 6.0e-4 | 0 | — |
| 0.047075833193 | 0.290646479142 | 42.31284822 | 46.6057 | 4.6e-10 | C 4.6e-13 | über den Umkehrpunkt | instabil | 1.383e+6 | 0.02796 | 36 | — |
| 0.113075883391 | 0.044795440531 | 42.37061577 | 72.1540 | 2.1e-6 | B3 2.3e-12 | über den Umkehrpunkt | offen | 1.485e+7 | 9.5e-4 | 64 | — |
| 0.287112583364 | 0.170387686389 | 42.39013813 | 38.7977 | 9.0e-10 | C 1.0e-13 | über den Umkehrpunkt | instabil | 1.111e+6 | 0.06258 | 34 | — |
| 0.167723973594 | 0.151684552524 | 42.39448231 | 58.8435 | 2.4e-6 | B3 2.0e-12 | über den Umkehrpunkt | offen | 3.936e+6 | 0.001020 | 52 | — |
| 0.233591419942 | 0.103889328735 | 42.42524595 | 53.9123 | 9.0e-10 | B3 1.2e-13 | über den Umkehrpunkt | instabil | 4.13e+3 | 0.01424 | 48 | — |
| 0.172084666895 | 0.252099229158 | 42.49593435 | 44.6922 | 1.9e-7 | B3 4.3e-14 | über den Umkehrpunkt | instabil | 3.671e+8 | 0.07429 | 40 | — |
| 0.294571692301 | 0.237775952135 | 42.50461537 | 29.4750 | 1.2e-9 | C 2.6e-14 | über den Umkehrpunkt | instabil | 5.268e+5 | 0.01962 | 26 | — |
| 0.042493517251 | 0.171503907588 | 42.56640083 | 66.3161 | 6.9e-8 | C 2.9e-13 | über den Umkehrpunkt | instabil | 4.208e+6 | 0.003733 | 70 | — |
| 0.053199259748 | 0.038296469616 | 42.59993156 | 76.5858 | 6.8e-6 | B3 1.4e-11 | an der Rechengrenze | instabil | 3.666e+8 | 0.005695 | 68 | — |
| 0.263427562398 | 0.267490711978 | 42.60554996 | 30.2163 | 2.0e-10 | R 2.9e-14 | über den Umkehrpunkt | instabil | 6.47e+4 | 0.01844 | 0 | — |
| 0.217639861811 | 0.200131021521 | 42.62702292 | 46.7116 | 1.5e-8 | B3 6.1e-14 | über den Umkehrpunkt | instabil | 3.871e+7 | 0.04315 | 40 | — |
| 0.080860569725 | 0.095617174680 | 42.63046107 | 72.2576 | 5.4e-8 | B3 2.3e-12 | über den Umkehrpunkt | offen | 7.841e+6 | 3.2e-4 | 64 | — |
| 0.082430384183 | 0.198186503400 | 42.65746307 | 61.0259 | 3.0e-8 | B3 1.2e-13 | über den Umkehrpunkt | instabil | 8.122e+6 | 0.05133 | 64 | — |
| 0.109636395514 | 0.208049820538 | 42.66702296 | 57.7411 | 8.9e-6 | C 4.8e-13 | über den Umkehrpunkt | offen | 2.091e+10 | 0.003509 | 54 | Satellit 3. Ordnung von I.B-8 (T* das 3.02025-fache) |
| 0.360000085302 | 0.094346524126 | 42.67338718 | 30.9646 | 1.6e-7 | B3 1.8e-12 | über den Umkehrpunkt | offen | 5.060e+5 | 6.6e-4 | 28 | nur Klasse von I.A-10 |
| 0.063899052989 | 0.143062201178 | 42.67351601 | 68.9728 | 5.3e-6 | C 3.7e-13 | über den Umkehrpunkt | offen | 1.170e+9 | 7.5e-4 | 54 | — |
| 0.093411876914 | 0.076326756350 | 42.68944985 | 72.7892 | 1.2e-7 | B3 7.6e-12 | über den Umkehrpunkt | offen | 3.789e+6 | 2.4e-4 | 64 | — |
| 0.076683176181 | 0.252991154965 | 42.78890139 | 52.8085 | 2.4e-7 | B3 1.2e-13 | über den Umkehrpunkt | instabil | 1.061e+8 | 0.008307 | 52 | — |
| 0.041913439815 | 0.265939256135 | 42.79145427 | 51.9207 | 6.1e-9 | C 2.4e-14 | über den Umkehrpunkt | instabil | 1.446e+6 | 0.03981 | 50 | — |
| 0.317663030136 | 0.117828360440 | 42.92394357 | 38.2507 | 9.0e-9 | C 9.8e-14 | über den Umkehrpunkt | instabil | 4.632e+6 | 0.008327 | 34 | — |
| 0.241149058965 | 0.184718181142 | 42.93228352 | 45.4440 | 3.3e-7 | B3 1.7e-13 | über den Umkehrpunkt | instabil | 2.182e+8 | 0.008625 | 40 | — |
| 0.035973952541 | 0.283067646369 | 42.97388183 | 49.0988 | 7.4e-6 | C 5.1e-13 | über den Umkehrpunkt | instabil | 2.458e+9 | 0.01141 | 38 | — |
| 0.098414502897 | 0.087890296444 | 43.02321369 | 72.2591 | 8.1e-9 | B3 4.5e-12 | über den Umkehrpunkt | offen | 1.007e+5 | 3.6e-4 | 64 | — |
| 0.304260524521 | 0.156070192198 | 43.21167829 | 37.8419 | 8.0e-9 | C 4.6e-13 | über den Umkehrpunkt | instabil | 6.114e+6 | 0.02370 | 34 | — |
| 0.074732633969 | 0.195738970795 | 43.28481587 | 62.7203 | 1.4e-7 | C 4.0e-14 | über den Umkehrpunkt | instabil | 7.009e+6 | 0.03750 | 66 | — |
| 0.083024626351 | 0.053330264875 | 43.30112923 | 75.7079 | 1.3e-6 | B3 8.0e-13 | über den Umkehrpunkt | offen | 6.776e+7 | 3.2e-4 | 68 | — |
| 0.141772634839 | 0.080296619180 | 43.30443998 | 69.2327 | 1.8e-7 | C 4.1e-11 | an der Rechengrenze | offen | 9.195e+5 | 9.0e-6 | 62 | — |
| 0.105765599802 | 0.029659852486 | 43.35096479 | 74.8847 | 1.3e-8 | C 2.8e-11 | an der Rechengrenze | instabil | 3.04e+4 | 0.001483 | 66 | Satellit 3. Ordnung von I.B-10 (T* das 3.00009-fache, Wort bis auf 4 Buchstaben) |
| 0.212786157994 | 0.108868491334 | 43.53191327 | 58.2536 | 5.1e-7 | B3 4.8e-13 | über den Umkehrpunkt | offen | 1.401e+8 | 3.3e-4 | 52 | — |
| 0.215412803633 | 0.244261819888 | 43.62182120 | 41.6522 | 1.0e-8 | C 7.4e-14 | über den Umkehrpunkt | instabil | 1.600e+7 | 0.05576 | 36 | — |
| 0.264832342293 | 0.167931309113 | 43.70145860 | 44.2476 | 2.4e-8 | C 4.1e-14 | über den Umkehrpunkt | instabil | 1.816e+7 | 0.04926 | 40 | — |
| 0.251497446056 | 0.113883900210 | 43.71086481 | 51.7339 | 8.3e-7 | C 1.2e-10 | an der Rechengrenze | offen | 7.833e+6 | 1.0e-4 | 46 | — |
| 0.210581335945 | 0.144089504799 | 43.72127989 | 55.6487 | 1.3e-7 | C 2.7e-12 | über den Umkehrpunkt | offen | 1.865e+7 | 4.4e-4 | 50 | — |
| 0.290371129374 | 0.134871762487 | 43.74223535 | 42.9228 | 9.2e-6 | C 3.9e-10 | an der Rechengrenze | instabil | 4.294e+6 | 1.5e-5 | 38 | — |
| 0.179439111663 | 0.089547497193 | 43.74777806 | 64.7630 | 3.7e-7 | C 3.9e-12 | über den Umkehrpunkt | offen | 9.241e+7 | 6.2e-4 | 58 | — |
| 0.140681854857 | 0.240381578761 | 43.82012070 | 51.3931 | 1.6e-8 | B3 5.0e-13 | über den Umkehrpunkt | instabil | 5.237e+5 | 0.008641 | 44 | — |
| 0.083361735335 | 0.087669205822 | 43.83005163 | 74.7013 | 1.4e-7 | C 3.1e-12 | über den Umkehrpunkt | offen | 2.203e+7 | 4.4e-4 | 66 | — |
| 0.141442792168 | 0.240571019620 | 43.91060795 | 51.3931 | 1.0e-8 | B3 3.4e-13 | über den Umkehrpunkt | instabil | 2.25e+4 | 0.006682 | 44 | — |
| 0.156486298608 | 0.071621702960 | 43.93767975 | 69.0653 | 4.1e-7 | C 1.2e-10 | an der Rechengrenze | offen | 9.453e+5 | 3.8e-6 | 62 | — |
| 0.165182543695 | 0.195144706009 | 43.93880195 | 55.8326 | 4.8e-6 | R 5.2e-13 | über den Umkehrpunkt | offen | 1.936e+8 | 1.4e-4 | 0 | — |
| 0.269999998239 | 0.162407493680 | 43.94650686 | 44.1853 | 5.6e-9 | B3 5.8e-14 | über den Umkehrpunkt | instabil | 2.101e+7 | 0.009922 | 40 | — |
| 0.134407448935 | 0.075433198346 | 43.96074777 | 71.3609 | 1.2e-6 | B3 4.0e-12 | über den Umkehrpunkt | instabil | 4.805e+7 | 0.001035 | 64 | — |
| 0.266928753163 | 0.223717565637 | 44.00371469 | 37.1646 | 2.8e-10 | B3 8.9e-14 | über den Umkehrpunkt | instabil | 1.213e+6 | 0.005721 | 32 | — |
| 0.337718067747 | 0.110255867950 | 44.06288412 | 35.6916 | 1.2e-9 | B3 2.5e-13 | über den Umkehrpunkt | instabil | 5.08e+3 | 0.01145 | 32 | — |
| 0.158461351656 | 0.285050261687 | 44.09082623 | 42.0033 | 9.1e-11 | R 1.8e-13 | bestätigt | instabil | 2.83e+4 | 0.01213 | 0 | — |
| 0.147369103785 | 0.251882488523 | 44.10724911 | 49.1055 | 3.0e-7 | B3 2.1e-13 | über den Umkehrpunkt | instabil | 5.654e+7 | 0.01024 | 40 | — |
| 0.158592977004 | 0.071887049300 | 44.10943882 | 69.0655 | 2.7e-8 | C 7.3e-12 | über den Umkehrpunkt | instabil | 3.790e+5 | 0.002959 | 62 | — |
| 0.164850443649 | 0.093173482270 | 44.12554095 | 66.9736 | 1.8e-8 | B3 1.5e-12 | über den Umkehrpunkt | instabil | 1.606e+6 | 1.1e-4 | 60 | — |
| 0.172009698457 | 0.108043122466 | 44.15220211 | 64.9682 | 1.6e-9 | C 9.3e-11 | an der Rechengrenze | instabil | 3.27e+4 | 4.9e-4 | 58 | — |
| 0.198704659949 | 0.137737480352 | 44.15381254 | 58.6030 | 3.1e-9 | B3 7.3e-13 | über den Umkehrpunkt | instabil | 3.304e+5 | 0.003845 | 52 | — |
| 0.100248491459 | 0.078690786664 | 44.19925302 | 74.6951 | 2.0e-7 | C 7.5e-12 | über den Umkehrpunkt | offen | 2.538e+6 | 2.1e-5 | 66 | — |
| 0.120235288364 | 0.089460549664 | 44.20127573 | 72.2568 | 2.0e-8 | B3 6.4e-13 | über den Umkehrpunkt | offen | 5.625e+5 | 2.2e-4 | 64 | — |
| 0.256327870371 | 0.191658194936 | 44.22266387 | 43.4169 | 2.9e-7 | C 2.1e-12 | über den Umkehrpunkt | instabil | 4.672e+6 | 0.009340 | 38 | — |
| 0.358213472037 | 0.125397284869 | 44.26044680 | 30.4779 | 3.2e-8 | B3 3.1e-14 | über den Umkehrpunkt | instabil | 1.012e+8 | 0.1226 | 28 | — |
| 0.262150017196 | 0.126286244907 | 44.30593120 | 49.4961 | 2.3e-8 | B3 1.0e-13 | über den Umkehrpunkt | instabil | 1.464e+6 | 0.01687 | 44 | — |
| 0.394841783113 | 0.107507855197 | 44.31093986 | 23.9054 | 1.5e-8 | C 5.8e-15 | über den Umkehrpunkt | instabil | 2.717e+7 | 0.08983 | 22 | — |
| 0.146549929261 | 0.065218198704 | 44.35001471 | 71.2222 | 7.1e-7 | B3 6.1e-13 | über den Umkehrpunkt | offen | 2.452e+7 | 0.003181 | 64 | — |
| 0.228203806820 | 0.231062709018 | 44.42071743 | 42.6119 | 1.3e-8 | B3 1.8e-13 | über den Umkehrpunkt | instabil | 1.703e+7 | 0.01323 | 36 | — |
| 0.122046259505 | 0.204476437175 | 44.46634571 | 59.6601 | 9.0e-6 | R 1.6e-12 | über den Umkehrpunkt | offen | 5.812e+10 | 1.1e-4 | 3 | — |
| 0.054127235300 | 0.289827374878 | 44.64287436 | 49.0898 | 2.7e-7 | C 1.9e-13 | über den Umkehrpunkt | instabil | 1.249e+8 | 0.003518 | 38 | — |
| 0.261408885858 | 0.164576792425 | 44.67551038 | 46.2188 | 2.9e-8 | C 3.4e-13 | über den Umkehrpunkt | instabil | 2.429e+6 | 0.1053 | 42 | — |
| 0.001943672452 | 0.037898272171 | 44.78876973 | 81.6905 | 7.8e-7 | B3 1.9e-12 | über den Umkehrpunkt | instabil | 6.306e+7 | 0.001438 | 88 | — |
| 0.061927490728 | 0.033030390992 | 44.82202372 | 80.3235 | 5.2e-6 | R 6.2e-13 | über den Umkehrpunkt | offen | 4.831e+8 | 5.8e-4 | 0 | — |
| 0.136601972959 | 0.060019239521 | 44.84040217 | 73.3798 | 6.3e-6 | C 9.3e-12 | über den Umkehrpunkt | offen | 7.172e+7 | 2.4e-4 | 66 | — |
| 0.235842186983 | 0.197042447222 | 44.88910253 | 46.7714 | 5.2e-9 | B3 1.2e-12 | über den Umkehrpunkt | offen | 1.953e+5 | 2.7e-4 | 40 | — |
| 0.434541052212 | 0.124445669126 | 44.89198069 | 14.8561 | 7.1e-11 | C 4.7e-14 | bestätigt | instabil | 3.94e+3 | 0.1165 | 14 | nur Klasse von I.B-5 |
| 0.113071927704 | 0.043453477584 | 44.89328129 | 76.4979 | 8.9e-6 | B3 2.7e-11 | an der Rechengrenze | offen | 1.001e+7 | 6.8e-5 | 68 | — |
| 0.112145798757 | 0.030214220331 | 44.92669398 | 77.0318 | 1.3e-7 | B3 1.3e-11 | an der Rechengrenze | offen | 2.71e+4 | 4.4e-5 | 68 | — |
| 0.123958235318 | 0.143316188136 | 44.92876463 | 68.1741 | 7.9e-7 | B3 2.8e-12 | über den Umkehrpunkt | offen | 3.269e+8 | 3.6e-4 | 60 | — |
| 0.081016047368 | 0.198116858415 | 44.95748298 | 64.4147 | 4.0e-9 | B3 5.5e-14 | über den Umkehrpunkt | instabil | 1.136e+7 | 0.05035 | 68 | — |
| 0.242969439356 | 0.124255684439 | 45.01890182 | 53.9071 | 4.0e-6 | B3 4.4e-13 | über den Umkehrpunkt | offen | 2.178e+8 | 5.3e-4 | 48 | — |
| 0.115287668644 | 0.064131278561 | 45.03856027 | 75.6464 | 4.1e-7 | B3 3.7e-13 | über den Umkehrpunkt | instabil | 9.432e+7 | 0.001219 | 68 | — |
| 0.278803852290 | 0.185592672201 | 45.24039295 | 41.1725 | 3.9e-7 | B3 3.7e-12 | über den Umkehrpunkt | offen | 1.477e+6 | 0.002406 | 36 | — |
| 0.211461376140 | 0.137861886769 | 45.24987979 | 58.1042 | 9.2e-9 | B3 9.5e-13 | über den Umkehrpunkt | instabil | 6.971e+5 | 0.02384 | 52 | — |
| 0.170466736323 | 0.243252611972 | 45.25790413 | 49.3110 | 2.4e-9 | B3 1.1e-13 | über den Umkehrpunkt | instabil | 1.628e+6 | 0.04435 | 44 | — |
| 0.126734825853 | 0.054971766065 | 45.37738765 | 75.5371 | 4.3e-7 | B3 2.5e-12 | über den Umkehrpunkt | offen | 1.088e+8 | 0.001147 | 68 | — |
| 0.241367109249 | 0.107088702774 | 45.38405969 | 56.0693 | 4.1e-8 | C 4.3e-13 | über den Umkehrpunkt | instabil | 1.129e+6 | 0.02109 | 50 | — |
| 0.202627053470 | 0.099972160691 | 45.40046387 | 63.0489 | 8.4e-8 | B3 4.7e-12 | über den Umkehrpunkt | offen | 3.87e+4 | 8.0e-5 | 56 | — |
| 0.016156657374 | 0.284759096547 | 45.42587686 | 51.9262 | 2.1e-7 | C 1.7e-13 | über den Umkehrpunkt | instabil | 1.697e+7 | 0.003925 | 42 | — |
| 0.159698362088 | 0.212423758792 | 45.45222575 | 55.8242 | 4.9e-6 | B3 3.2e-13 | über den Umkehrpunkt | instabil | 1.642e+9 | 0.04857 | 52 | — |
| 0.386298252006 | 0.132816173701 | 45.47427125 | 24.6974 | 8.5e-10 | C 2.9e-15 | über den Umkehrpunkt | instabil | 3.711e+5 | 0.008131 | 22 | — |
| 0.237442176132 | 0.234377701232 | 45.47772248 | 41.6746 | 1.2e-6 | R 3.0e-13 | über den Umkehrpunkt | offen | 6.605e+7 | 0.001118 | 0 | — |
| 0.301047768444 | 0.131713306746 | 45.48912657 | 42.7946 | 1.5e-6 | C 4.5e-12 | über den Umkehrpunkt | offen | 5.746e+6 | 1.8e-4 | 38 | — |
| 0.147667432163 | 0.222194433230 | 45.50299487 | 55.6862 | 8.2e-7 | B3 1.1e-12 | über den Umkehrpunkt | instabil | 8.722e+8 | 0.007355 | 48 | — |
| 0.311420395908 | 0.217680372205 | 45.51895682 | 31.2463 | 8.7e-12 | B3 9.1e-14 | bestätigt | instabil | 793 | 0.1293 | 28 | — |
| 0.357565257604 | 0.102826086866 | 45.51908272 | 33.0526 | 8.6e-6 | C 1.1e-12 | über den Umkehrpunkt | offen | 1.447e+9 | 0.01134 | 30 | — |
| 0.073210920052 | 0.195582786743 | 45.54306354 | 66.1032 | 2.9e-8 | C 2.3e-13 | über den Umkehrpunkt | instabil | 9.018e+6 | 0.03637 | 70 | — |
| 0.122928109939 | 0.227780695897 | 45.58640142 | 57.3241 | 3.6e-7 | B3 2.0e-12 | über den Umkehrpunkt | instabil | 1.118e+8 | 0.06547 | 48 | — |
| 0.242777893998 | 0.148488614724 | 45.61008471 | 52.2651 | 2.2e-6 | C 9.2e-12 | über den Umkehrpunkt | instabil | 1.679e+7 | 1.9e-4 | 46 | — |
| 0.069886671412 | 0.046485621760 | 45.64479741 | 80.9184 | 3.3e-6 | B3 1.8e-12 | über den Umkehrpunkt | instabil | 3.190e+8 | 0.003139 | 72 | — |
| 0.112135212345 | 0.048182035191 | 45.64598288 | 77.6896 | 9.0e-6 | C 7.8e-12 | über den Umkehrpunkt | offen | 3.436e+8 | 0.002810 | 70 | — |
| 0.372962336835 | 0.069227106998 | 45.67786813 | 31.4987 | 6.0e-11 | B3 2.6e-13 | bestätigt | instabil | 537 | 0.03779 | 28 | Satellit 7. Ordnung von I.A-1 (T* das 6.94053-fache, Wort bis auf 4 Buchstaben) |
| 0.102701167840 | 0.030810618084 | 45.71760039 | 79.2071 | 9.9e-9 | C 8.7e-12 | über den Umkehrpunkt | instabil | 2.844e+5 | 8.0e-4 | 70 | — |
| 0.362088204602 | 0.078884854990 | 45.72768051 | 33.5423 | 8.4e-8 | C 2.9e-13 | über den Umkehrpunkt | instabil | 3.676e+6 | 0.01387 | 30 | — |
| 0.106491102352 | 0.024515757199 | 45.78698233 | 79.1441 | 1.6e-6 | C 1.5e-10 | an der Rechengrenze | offen | 5.194e+6 | 1.6e-5 | 70 | — |
| 0.106735447202 | 0.042264030800 | 45.81583084 | 78.6842 | 9.4e-9 | C 8.4e-13 | über den Umkehrpunkt | instabil | 3.544e+5 | 0.002704 | 70 | — |
| 0.383825675306 | 0.063193957398 | 45.86687707 | 29.4003 | 1.5e-12 | C 8.7e-14 | bestätigt | instabil | 617 | 0.03151 | 26 | — |
| 0.060624733025 | 0.365301627950 | 45.88587489 | 33.7235 | 5.4e-11 | C 2.3e-13 | bestätigt | instabil | 2.17e+3 | 0.01272 | 26 | — |
| 0.224645174269 | 0.131755892559 | 45.90664463 | 57.4187 | 1.4e-7 | B3 9.4e-14 | über den Umkehrpunkt | instabil | 5.983e+6 | 0.03165 | 52 | — |
| 0.283948916067 | 0.156397682528 | 45.92644813 | 44.1854 | 1.1e-10 | B3 3.0e-14 | über den Umkehrpunkt | instabil | 2.996e+6 | 0.009483 | 40 | — |
| 0.036779076329 | 0.388166784231 | 45.93244126 | 29.2316 | 3.1e-8 | C 3.9e-12 | über den Umkehrpunkt | instabil | 3.324e+5 | 1.9e-4 | 22 | — |
| 0.279288350615 | 0.139462100920 | 45.97129270 | 46.8527 | 8.8e-6 | C 3.2e-11 | an der Rechengrenze | instabil | 2.833e+7 | 1.8e-4 | 26 | — |
| 0.235128798175 | 0.193300276777 | 46.04497376 | 48.6062 | 9.9e-8 | C 4.3e-13 | über den Umkehrpunkt | instabil | 2.923e+7 | 0.04892 | 42 | — |
| 0.258724329284 | 0.187516190697 | 46.09632204 | 45.3720 | 1.9e-7 | B3 1.4e-13 | über den Umkehrpunkt | instabil | 5.330e+7 | 0.03761 | 40 | — |
| 0.201265070671 | 0.249333539041 | 46.09973751 | 45.1780 | 2.5e-8 | C 8.7e-14 | über den Umkehrpunkt | instabil | 1.119e+7 | 0.05255 | 40 | — |
| 0.083971586808 | 0.033953376085 | 46.10514318 | 81.2500 | 2.8e-8 | B3 3.0e-12 | über den Umkehrpunkt | offen | 1.099e+5 | 5.8e-4 | 72 | — |
| 0.129001039282 | 0.051989345089 | 46.21858526 | 76.8303 | 1.2e-6 | B3 4.9e-12 | über den Umkehrpunkt | instabil | 1.071e+7 | 0.002254 | 68 | — |
| 0.150977563060 | 0.152443289371 | 46.24953469 | 66.1802 | 1.1e-6 | C 4.2e-11 | an der Rechengrenze | offen | 1.535e+7 | 0.001492 | 58 | — |
| 0.131645503165 | 0.238656644660 | 46.26014671 | 55.4620 | 3.2e-6 | B3 1.0e-12 | über den Umkehrpunkt | instabil | 5.635e+8 | 0.002331 | 48 | — |
| 0.368075044725 | 0.053705986867 | 46.27512870 | 33.6211 | 2.3e-7 | C 1.3e-10 | an der Rechengrenze | offen | 1.41e+4 | 1.2e-5 | 30 | — |
| 0.114692028989 | 0.066833772072 | 46.38947825 | 77.8257 | 1.9e-7 | C 8.4e-13 | über den Umkehrpunkt | instabil | 1.399e+7 | 0.007443 | 70 | — |
| 0.157910969713 | 0.092544893446 | 46.40132418 | 71.3724 | 3.4e-8 | B3 5.7e-13 | über den Umkehrpunkt | instabil | 1.106e+6 | 0.003075 | 64 | — |
| 0.322746838931 | 0.177583991102 | 46.41765853 | 34.5612 | 4.3e-9 | C 3.3e-14 | über den Umkehrpunkt | instabil | 4.023e+5 | 0.04129 | 30 | — |
| 0.154193847449 | 0.213443507955 | 46.51888984 | 57.6183 | 7.9e-7 | C 1.0e-13 | über den Umkehrpunkt | instabil | 3.796e+7 | 0.03410 | 54 | — |
| 0.118764241957 | 0.065919607796 | 46.57680195 | 77.7960 | 8.4e-6 | C 4.7e-12 | über den Umkehrpunkt | offen | 1.615e+8 | 5.8e-4 | 70 | — |
| 0.266042213146 | 0.216045758733 | 46.61703475 | 40.6497 | 4.2e-7 | B3 7.3e-12 | über den Umkehrpunkt | instabil | 2.893e+6 | 0.001162 | 36 | — |
| 0.094322463642 | 0.036380797319 | 46.64258862 | 81.3466 | 8.1e-8 | B3 8.9e-12 | über den Umkehrpunkt | offen | 5.883e+6 | 9.3e-5 | 72 | Satellit 3. Ordnung von I.A-8 (T* das 3.00038-fache, Wort bis auf 4 Buchstaben) |
| 0.318100595664 | 0.216092595774 | 46.68703352 | 30.9680 | 5.5e-7 | B3 7.0e-13 | über den Umkehrpunkt | instabil | 1.059e+7 | 0.003873 | 28 | — |
| 0.248699047001 | 0.229772333483 | 46.70653817 | 41.6710 | 1.0e-6 | R 1.6e-13 | über den Umkehrpunkt | offen | 1.550e+8 | 0.002387 | 0 | — |
| 0.095558895610 | 0.004622334154 | 46.75060703 | 81.9860 | 2.9e-7 | B3 2.5e-11 | an der Rechengrenze | offen | 2.136e+5 | 5.9e-6 | 72 | — |
| 0.218741644984 | 0.149061933172 | 46.77687119 | 57.6617 | 3.2e-6 | B3 4.7e-13 | über den Umkehrpunkt | offen | 2.779e+11 | 0.005485 | 52 | — |
| 0.137715836708 | 0.076537942387 | 46.85735168 | 75.6222 | 1.5e-6 | B3 1.2e-11 | an der Rechengrenze | offen | 6.434e+8 | 3.7e-5 | 68 | — |
| 0.157920692141 | 0.191932914818 | 46.85791576 | 60.9134 | 1.3e-6 | B3 1.3e-12 | über den Umkehrpunkt | instabil | 1.281e+8 | 0.05307 | 56 | — |
| 0.047344024156 | 0.204380582919 | 46.86209094 | 67.8584 | 1.1e-7 | B3 8.6e-14 | über den Umkehrpunkt | instabil | 1.629e+9 | 0.07479 | 72 | — |
| 0.203706596558 | 0.214175007771 | 46.87941525 | 51.3904 | 4.1e-6 | C 2.1e-12 | über den Umkehrpunkt | offen | 1.647e+8 | 6.5e-4 | 46 | — |
| 0.100670474498 | 0.032964407191 | 46.88291636 | 81.3425 | 3.2e-6 | B3 4.8e-11 | an der Rechengrenze | offen | 1.981e+7 | 3.1e-5 | 72 | Satellit 3. Ordnung von I.A-8 (T* das 3.00023-fache, Wort bis auf 4 Buchstaben) |
| 0.086311250090 | 0.067575952130 | 46.96228523 | 81.1440 | 9.6e-7 | R 6.1e-13 | über den Umkehrpunkt | offen | 2.074e+8 | 0.004912 | 0 | — |
| 0.106078679252 | 0.039077278885 | 46.98372533 | 80.8584 | 8.6e-6 | B3 1.1e-11 | an der Rechengrenze | offen | 6.974e+7 | 4.8e-4 | 72 | — |
| 0.144066670705 | 0.286817733014 | 47.05002560 | 45.9885 | 3.9e-7 | R 5.6e-12 | über den Umkehrpunkt | offen | 3.156e+6 | 2.6e-4 | 0 | — |
| 0.359896239171 | 0.063013793405 | 47.08578149 | 35.7669 | 2.3e-9 | B3 3.0e-13 | über den Umkehrpunkt | instabil | 799 | 0.01918 | 32 | — |
| 0.155018228138 | 0.271843192641 | 47.12000168 | 47.8537 | 2.5e-9 | C 5.8e-13 | über den Umkehrpunkt | instabil | 5.60e+4 | 0.008486 | 38 | — |
| 0.230842206351 | 0.104000358558 | 47.14763367 | 60.3942 | 1.4e-8 | C 1.6e-12 | über den Umkehrpunkt | instabil | 2.84e+3 | 0.01155 | 54 | — |
| 0.381676391982 | 0.126503900786 | 47.16428331 | 27.1266 | 7.4e-11 | C 4.8e-15 | bestätigt | instabil | 3.34e+4 | 0.06267 | 24 | — |
| 0.230969863926 | 0.317567999293 | 47.16752583 | 29.3596 | 1.9e-6 | C 5.0e-13 | über den Umkehrpunkt | instabil | 6.614e+8 | 0.01845 | 22 | — |
| 0.173949157138 | 0.242797729525 | 47.28677902 | 51.1650 | 3.4e-8 | C 2.5e-13 | über den Umkehrpunkt | instabil | 1.823e+6 | 0.02241 | 46 | — |
| 0.044782613083 | 0.281349360839 | 47.38592903 | 54.2358 | 4.2e-7 | C 1.9e-13 | über den Umkehrpunkt | instabil | 8.139e+7 | 0.03116 | 44 | — |
| 0.050874208321 | 0.163809959090 | 47.38668935 | 74.5676 | 9.0e-6 | B3 1.3e-11 | an der Rechengrenze | instabil | 4.644e+8 | 0.007515 | 72 | — |
| 0.108585380359 | 0.085962448312 | 47.43682751 | 78.9245 | 7.2e-7 | C 9.7e-12 | über den Umkehrpunkt | offen | 2.068e+7 | 3.7e-4 | 70 | — |
| 0.295913485655 | 0.135641888830 | 47.46796871 | 45.3608 | 5.0e-6 | B3 2.4e-12 | über den Umkehrpunkt | offen | 3.564e+7 | 2.1e-4 | 40 | — |
| 0.202665856212 | 0.131368274270 | 47.51401828 | 63.1114 | 7.0e-9 | B3 7.4e-13 | über den Umkehrpunkt | offen | 5.479e+7 | 0.001313 | 56 | — |
| 0.135439376971 | 0.198776605570 | 47.54920975 | 63.3445 | 3.7e-6 | R 1.7e-12 | über den Umkehrpunkt | offen | 3.696e+7 | 2.1e-4 | 0 | — |
| 0.151643095043 | 0.150902724848 | 47.56266431 | 68.1661 | 3.2e-7 | B3 9.5e-12 | über den Umkehrpunkt | offen | 5.009e+5 | 0.001143 | 60 | — |
| 0.156712944643 | 0.246471125820 | 47.57735068 | 52.9154 | 1.7e-6 | B3 8.0e-13 | über den Umkehrpunkt | instabil | 1.919e+8 | 0.1409 | 44 | — |
| 0.188066122576 | 0.114710138887 | 47.58075460 | 67.0846 | 9.4e-9 | B3 1.6e-11 | an der Rechengrenze | offen | 4.71e+3 | 8.8e-5 | 60 | Satellit 3. Ordnung von I.A-6 (T* das 3.00003-fache, Wort bis auf 4 Buchstaben) |
| 0.124710804033 | 0.231579155282 | 47.63789614 | 59.0627 | 1.1e-6 | C 3.5e-13 | über den Umkehrpunkt | instabil | 8.745e+9 | 0.01646 | 54 | — |
| 0.225868571455 | 0.222073559298 | 47.64120120 | 47.5222 | 1.8e-7 | C 6.3e-14 | über den Umkehrpunkt | instabil | 5.424e+8 | 0.009063 | 40 | — |
| 0.231666082145 | 0.218413424934 | 47.65440142 | 47.1643 | 9.5e-9 | R 2.0e-14 | über den Umkehrpunkt | instabil | 1.867e+8 | 0.01876 | 0 | — |
| 0.354026952297 | 0.096515578737 | 47.73108174 | 35.8807 | 3.9e-8 | B3 6.2e-12 | über den Umkehrpunkt | offen | 1.61e+4 | 4.2e-4 | 32 | — |
| 0.304687756614 | 0.250078803792 | 47.74353288 | 29.3588 | 2.4e-8 | C 2.4e-13 | über den Umkehrpunkt | offen | 6.032e+7 | 0.001222 | 26 | — |
| 0.253002913537 | 0.204610284061 | 47.74964375 | 45.6609 | 6.0e-8 | B3 1.0e-13 | über den Umkehrpunkt | instabil | 6.721e+8 | 0.06636 | 40 | — |
| 0.252652564486 | 0.155184703671 | 47.78022044 | 52.1755 | 1.5e-7 | C 8.3e-13 | über den Umkehrpunkt | instabil | 1.891e+8 | 0.02748 | 46 | — |
| 0.071885034282 | 0.195443217963 | 47.79747797 | 69.4756 | 1.2e-7 | C 6.7e-14 | über den Umkehrpunkt | instabil | 1.131e+7 | 0.03540 | 74 | — |
| 0.246614312359 | 0.219307938130 | 47.83279846 | 44.6706 | 4.2e-6 | C 4.7e-12 | über den Umkehrpunkt | instabil | 6.560e+7 | 0.002277 | 38 | — |
| 0.069071542485 | 0.292778874710 | 47.83932461 | 51.2916 | 9.7e-6 | C 4.4e-13 | über den Umkehrpunkt | instabil | 4.485e+9 | 0.007472 | 40 | — |
| 0.237847982026 | 0.230147983101 | 47.86636954 | 44.4828 | 3.5e-8 | B3 4.3e-13 | über den Umkehrpunkt | instabil | 1.321e+6 | 0.006265 | 40 | — |
| 0.102282158643 | 0.076678365571 | 47.92159884 | 80.9433 | 1.1e-6 | R 2.2e-12 | über den Umkehrpunkt | offen | 7.661e+7 | 9.1e-4 | 0 | — |
| 0.074469610281 | 0.010504310559 | 47.94756069 | 85.6060 | 8.9e-7 | B3 2.4e-11 | an der Rechengrenze | offen | 5.025e+6 | 2.4e-5 | 76 | — |
| 0.151442914324 | 0.079903386939 | 47.99354484 | 75.5654 | 2.5e-7 | B3 5.9e-13 | über den Umkehrpunkt | offen | 1.060e+7 | 6.3e-4 | 68 | — |
| 0.081204347037 | 0.030755280158 | 48.00758844 | 84.8916 | 3.6e-6 | B3 7.7e-12 | über den Umkehrpunkt | offen | 4.292e+7 | 4.3e-4 | 76 | — |
| 0.300687940480 | 0.142714200612 | 48.02414571 | 44.1940 | 8.1e-9 | C 2.8e-14 | über den Umkehrpunkt | instabil | 3.668e+5 | 0.02471 | 40 | — |
| 0.074152935658 | 0.251923972374 | 48.03368280 | 59.6375 | 8.0e-7 | B3 2.3e-13 | über den Umkehrpunkt | instabil | 2.269e+8 | 0.009057 | 60 | — |
| 0.116060997870 | 0.284241834514 | 48.04279270 | 50.1245 | 5.7e-9 | R 8.5e-14 | über den Umkehrpunkt | instabil | 1.060e+6 | 0.003724 | 0 | — |
| 0.244692519139 | 0.112904245944 | 48.05145750 | 58.2485 | 5.8e-10 | B3 1.4e-13 | über den Umkehrpunkt | instabil | 646 | 0.01798 | 52 | — |
| 0.040957175158 | 0.264313153749 | 48.12591269 | 58.7560 | 1.2e-8 | C 2.7e-13 | über den Umkehrpunkt | instabil | 2.857e+6 | 0.03976 | 58 | — |
| 0.203767826569 | 0.137783068233 | 48.14425912 | 63.0874 | 1.6e-6 | C 3.3e-13 | über den Umkehrpunkt | offen | 4.038e+8 | 0.001583 | 56 | — |
| 0.191961739980 | 0.117778043272 | 48.17427423 | 67.0346 | 1.0e-7 | B3 3.5e-12 | über den Umkehrpunkt | instabil | 1.67e+4 | 0.001332 | 60 | Satellit 3. Ordnung von I.A-6 (T* das 2.99779-fache) |
| 0.332588200364 | 0.107952490248 | 48.20644549 | 40.3837 | 6.0e-7 | B3 4.0e-12 | über den Umkehrpunkt | instabil | 4.818e+6 | 0.001314 | 36 | — |
| 0.047532574262 | 0.053872218668 | 48.22349592 | 86.3157 | 4.3e-6 | C 8.8e-13 | über den Umkehrpunkt | offen | 2.102e+11 | 0.01057 | 78 | — |
| 0.237749508858 | 0.215612287492 | 48.26736025 | 47.1806 | 8.8e-8 | B3 9.3e-14 | über den Umkehrpunkt | instabil | 2.039e+7 | 0.02449 | 40 | — |
| 0.368447857718 | 0.093340093227 | 48.29900398 | 33.1231 | 2.0e-9 | C 7.6e-12 | über den Umkehrpunkt | offen | 3.34e+3 | 3.2e-5 | 30 | — |
| 0.347049527035 | 0.132082594089 | 48.31496822 | 35.2578 | 1.6e-6 | B3 1.6e-13 | über den Umkehrpunkt | instabil | 1.566e+8 | 0.002341 | 32 | — |
| 0.222482693667 | 0.187578314907 | 48.33357029 | 53.9906 | 4.6e-6 | B3 2.6e-13 | über den Umkehrpunkt | instabil | 4.106e+9 | 0.1300 | 48 | — |
| 0.259891512203 | 0.136557236305 | 48.33669293 | 53.4281 | 3.4e-6 | B3 4.9e-12 | über den Umkehrpunkt | offen | 1.007e+9 | 0.001363 | 48 | — |
| 0.148133649377 | 0.232745033607 | 48.41584901 | 57.3434 | 3.2e-6 | B3 3.6e-14 | über den Umkehrpunkt | offen | 2.933e+10 | 0.01313 | 52 | — |
| 0.205930399407 | 0.143379977114 | 48.44262539 | 62.5030 | 1.1e-6 | B3 1.1e-13 | über den Umkehrpunkt | instabil | 4.794e+8 | 0.02564 | 56 | — |
| 0.080044422396 | 0.198718333087 | 48.51459106 | 69.4775 | 2.6e-9 | C 9.3e-14 | über den Umkehrpunkt | instabil | 9.462e+6 | 0.05279 | 74 | — |
| 0.031597842926 | 0.074943716547 | 48.56781617 | 86.2900 | 5.7e-6 | B3 3.1e-12 | über den Umkehrpunkt | offen | 8.151e+9 | 0.001767 | 76 | — |
| 0.011883199815 | 0.384946543103 | 48.58075165 | 32.0841 | 3.2e-6 | R 8.5e-12 | über den Umkehrpunkt | offen | 7.571e+6 | 3.9e-4 | 0 | — |
| 0.219517574290 | 0.210210203357 | 48.58587006 | 51.3902 | 7.1e-6 | C 8.8e-12 | über den Umkehrpunkt | offen | 8.942e+7 | 1.4e-4 | 46 | — |
| 0.248768564749 | 0.111820767148 | 48.59572031 | 58.2226 | 3.2e-6 | B3 6.5e-13 | über den Umkehrpunkt | instabil | 1.083e+8 | 0.006075 | 52 | — |
| 0.269928206154 | 0.186408352059 | 48.64885755 | 45.8991 | 1.4e-6 | R 2.2e-13 | über den Umkehrpunkt | instabil | 9.635e+6 | 9.9e-4 | 0 | — |
| 0.175856310951 | 0.104179984370 | 48.65013785 | 71.3718 | 1.6e-9 | B3 1.8e-12 | über den Umkehrpunkt | instabil | 1.16e+3 | 1.6e-4 | 64 | — |
| 0.371758536973 | 0.074405488281 | 48.65425099 | 33.6004 | 8.8e-10 | C 2.4e-13 | über den Umkehrpunkt | instabil | 6.16e+4 | 0.04364 | 30 | — |
| 0.145192293698 | 0.214864508570 | 48.72333674 | 61.1693 | 3.8e-6 | C 2.2e-13 | über den Umkehrpunkt | instabil | 9.814e+8 | 0.01606 | 58 | — |
| 0.304221044938 | 0.142144046794 | 48.75891869 | 44.1696 | 2.8e-8 | B3 1.0e-13 | über den Umkehrpunkt | instabil | 5.422e+6 | 0.005983 | 40 | — |
| 0.310953665641 | 0.119840261926 | 48.76024853 | 44.7742 | 3.9e-6 | B3 1.1e-12 | über den Umkehrpunkt | instabil | 1.730e+8 | 0.005399 | 40 | — |
| 0.163569036103 | 0.074360470635 | 48.77662219 | 75.5401 | 3.1e-6 | B3 3.9e-12 | über den Umkehrpunkt | offen | 3.190e+7 | 0.002192 | 68 | — |
| 0.314437243069 | 0.154068515141 | 48.80784895 | 40.7705 | 7.2e-11 | B3 8.8e-14 | bestätigt | instabil | 1.386e+6 | 0.02214 | 36 | — |
| 0.090538157312 | 0.034767388498 | 48.88879475 | 85.6238 | 5.8e-6 | B3 7.8e-12 | über den Umkehrpunkt | offen | 1.134e+8 | 5.3e-5 | 76 | — |
| 0.186076224878 | 0.245519950143 | 48.92420807 | 50.8058 | 2.7e-7 | C 1.0e-12 | über den Umkehrpunkt | instabil | 1.554e+7 | 0.006268 | 42 | — |
| 0.355340328957 | 0.071166809921 | 48.95133546 | 37.9115 | 1.6e-9 | C 1.7e-13 | über den Umkehrpunkt | instabil | 2.40e+4 | 0.03992 | 34 | — |
| 0.355153739745 | 0.158235715387 | 48.97642681 | 31.4388 | 3.3e-9 | B3 2.6e-14 | über den Umkehrpunkt | instabil | 5.509e+5 | 0.1936 | 28 | — |
| 0.165731307115 | 0.075684437649 | 49.02661872 | 75.5402 | 9.6e-10 | B3 1.6e-12 | über den Umkehrpunkt | offen | 1.854e+6 | 0.002200 | 68 | — |
| 0.092089487338 | 0.011988434275 | 49.06740209 | 86.2836 | 9.9e-7 | B3 1.1e-10 | an der Rechengrenze | offen | 8.323e+5 | 9.1e-5 | 76 | — |
| 0.286550181153 | 0.183059844098 | 49.09126796 | 43.4533 | 3.0e-10 | C 3.8e-12 | über den Umkehrpunkt | instabil | 2.58e+3 | 0.001307 | 38 | — |
| 0.166356979963 | 0.076566458237 | 49.12101990 | 75.5401 | 7.3e-6 | B3 3.1e-11 | an der Rechengrenze | offen | 2.025e+6 | 1.3e-5 | 68 | — |
| 0.314556699288 | 0.218247800552 | 49.22953209 | 33.0759 | 3.8e-11 | C 9.3e-14 | bestätigt | instabil | 949 | 0.04184 | 30 | Satellit 3. Ordnung von Fund (0.418703, -0.120403) (T* das 3.02738-fache, Wort bis auf 4 Buchstaben) |
| 0.094284197811 | 0.021740205991 | 49.24749194 | 86.2715 | 8.1e-7 | B3 1.3e-12 | über den Umkehrpunkt | offen | 1.838e+6 | 9.3e-5 | 76 | — |
| 0.266506993994 | 0.152553101203 | 49.25073903 | 51.3717 | 5.0e-6 | C 4.7e-12 | über den Umkehrpunkt | instabil | 1.294e+9 | 0.007508 | 46 | — |
| 0.340756998168 | 0.193123580444 | 49.35566383 | 30.9699 | 1.2e-7 | B3 2.7e-12 | über den Umkehrpunkt | offen | 1.697e+6 | 3.4e-4 | 28 | — |
| 0.276094088354 | 0.103186106770 | 49.35600537 | 54.2932 | 1.7e-10 | B3 5.2e-12 | über den Umkehrpunkt | offen | 1.00 | 9.8e-5 | 48 | nur Klasse von I.A-19 |
| 0.034081012490 | 0.162839808238 | 49.42237754 | 78.5239 | 1.8e-6 | B3 3.0e-12 | über den Umkehrpunkt | instabil | 2.393e+9 | 0.01761 | 76 | — |
| 0.136172158758 | 0.055414430244 | 49.44753866 | 81.2029 | 7.3e-7 | B3 2.8e-12 | über den Umkehrpunkt | offen | 9.478e+6 | 5.3e-4 | 72 | — |
| 0.321544896799 | 0.124010772755 | 49.47233492 | 42.6740 | 2.0e-6 | C 4.1e-11 | an der Rechengrenze | offen | 1.030e+6 | 2.8e-5 | 38 | — |
| 0.078698360506 | 0.197990966994 | 49.54246560 | 71.1600 | 8.7e-9 | B3 2.7e-14 | über den Umkehrpunkt | instabil | 2.050e+7 | 0.04877 | 76 | — |
| 0.262981562354 | 0.114124719441 | 49.66869690 | 56.4512 | 8.9e-11 | C 2.5e-13 | bestätigt | instabil | 1.23e+3 | 0.001503 | 50 | nur Klasse von I.B-25 |
| 0.153587382299 | 0.062079942897 | 49.68130484 | 79.0376 | 1.7e-8 | C 3.4e-11 | an der Rechengrenze | instabil | 2.73e+4 | 0.001472 | 70 | — |
| 0.208940870556 | 0.134824963209 | 49.70256464 | 64.5882 | 2.7e-7 | C 2.6e-13 | über den Umkehrpunkt | instabil | 4.734e+7 | 0.01822 | 58 | — |
| 0.251349319535 | 0.209277534699 | 49.73401444 | 47.1556 | 8.5e-10 | B3 1.3e-13 | über den Umkehrpunkt | instabil | 2.752e+5 | 0.01170 | 40 | — |
| 0.288350711832 | 0.251860214992 | 49.73480924 | 33.4149 | 8.2e-8 | C 1.4e-13 | über den Umkehrpunkt | instabil | 1.580e+8 | 0.01820 | 30 | Satellit 3. Ordnung von Fund (0.246507, 0.159243) (T* das 2.99716-fache, Wort bis auf 4 Buchstaben) |
| 0.126098226151 | 0.222235419366 | 49.75882995 | 63.2593 | 8.0e-6 | R 7.9e-14 | über den Umkehrpunkt | instabil | 1.790e+10 | 0.02628 | 0 | — |
| 0.020354509585 | 0.171575899784 | 49.83121933 | 78.2272 | 6.9e-6 | B3 3.2e-12 | über den Umkehrpunkt | instabil | 2.854e+9 | 0.01970 | 84 | — |
| 0.260741992911 | 0.142180988048 | 49.83854806 | 54.3130 | 2.3e-8 | B3 6.4e-13 | über den Umkehrpunkt | instabil | 1.944e+6 | 0.002473 | 48 | — |
| 0.026261474977 | 0.311414242262 | 49.85470339 | 50.7290 | 2.4e-7 | C 4.8e-12 | über den Umkehrpunkt | instabil | 3.978e+7 | 1.6e-4 | 36 | — |
| 0.105097409236 | 0.027454467059 | 49.87103276 | 86.2673 | 3.1e-6 | B3 3.2e-12 | über den Umkehrpunkt | offen | 2.275e+7 | 0.001076 | 76 | — |
| 0.389135060198 | 0.037596687729 | 49.89833817 | 31.4940 | 1.6e-8 | B3 9.6e-14 | über den Umkehrpunkt | instabil | 2.889e+5 | 0.01119 | 28 | — |
| 0.237774517509 | 0.105876705526 | 49.98422061 | 62.5505 | 9.2e-9 | B3 5.4e-13 | über den Umkehrpunkt | instabil | 2.253e+6 | 0.01891 | 56 | — |
| 0.481988053304 | -0.052570966159 | 50.01540337 | 9.2505 | 1.6e-10 | C 4.9e-14 | über den Umkehrpunkt | instabil | 1.779e+5 | 0.02186 | 8 | Satellit 2. Ordnung von I.A-1 (T* das 2.03828-fache, Wort bis auf 4 Buchstaben) |
| 0.306356313249 | 0.148454382211 | 50.02247083 | 44.1800 | 3.7e-8 | B3 1.8e-13 | über den Umkehrpunkt | instabil | 8.122e+5 | 0.001881 | 40 | — |
| 0.127012308914 | 0.061312073481 | 50.09044031 | 83.0233 | 9.6e-6 | C 4.3e-11 | an der Rechengrenze | offen | 3.524e+8 | 0.005404 | 74 | — |
| 0.172673123425 | 0.068707786214 | 50.26453679 | 76.8640 | 8.6e-9 | B3 2.2e-12 | über den Umkehrpunkt | offen | 3.43e+3 | 1.5e-4 | 68 | — |
| 0.062752977305 | 0.330303120839 | 50.41864888 | 45.5697 | 1.5e-9 | C 7.1e-12 | über den Umkehrpunkt | instabil | 4.632e+5 | 0.02311 | 34 | — |
| 0.295286317884 | 0.210327805289 | 50.43368001 | 39.0247 | 4.9e-9 | C 9.3e-14 | über den Umkehrpunkt | instabil | 2.432e+5 | 6.1e-4 | 34 | — |
| 0.365278939428 | 0.172107658238 | 50.43807717 | 28.5797 | 6.2e-6 | C 1.0e-12 | über den Umkehrpunkt | instabil | 3.375e+7 | 0.02289 | 26 | — |
| 0.355973531625 | 0.083913944367 | 50.48041864 | 38.2548 | 1.8e-8 | C 1.3e-13 | über den Umkehrpunkt | offen | 5.105e+5 | 1.7e-4 | 34 | — |
| 0.174957758133 | 0.111794540175 | 50.53713622 | 73.5683 | 3.6e-8 | C 1.7e-11 | an der Rechengrenze | offen | 2.49e+4 | 1.3e-4 | 66 | — |
| 0.117890408121 | 0.069683209357 | 50.55358251 | 84.3018 | 1.4e-6 | B3 8.0e-13 | über den Umkehrpunkt | instabil | 7.546e+7 | 0.007514 | 76 | — |
| 0.363203070968 | 0.150706089975 | 50.55617143 | 31.3290 | 3.0e-7 | B3 1.3e-13 | über den Umkehrpunkt | instabil | 3.085e+6 | 0.1042 | 28 | — |
| 0.139952530912 | 0.288194065005 | 50.56189383 | 49.5631 | 3.4e-6 | R 1.6e-11 | an der Rechengrenze | offen | 1.526e+7 | 4.4e-5 | 0 | — |
| 0.318464471735 | 0.119043663293 | 50.63628646 | 44.8322 | 2.8e-8 | B3 2.5e-13 | über den Umkehrpunkt | instabil | 4.672e+6 | 0.006971 | 40 | — |
| 0.212916441528 | 0.217473004656 | 50.69155844 | 53.5200 | 2.0e-6 | B3 2.5e-13 | über den Umkehrpunkt | instabil | 7.772e+8 | 0.06433 | 48 | — |
| 0.302966043770 | 0.135489208023 | 50.71319264 | 46.9036 | 4.3e-7 | C 1.5e-13 | über den Umkehrpunkt | instabil | 4.937e+7 | 0.08320 | 42 | — |
| 0.207996716406 | 0.125691793784 | 50.73712388 | 67.0875 | 1.4e-7 | B3 2.9e-12 | über den Umkehrpunkt | instabil | 1.174e+6 | 0.003354 | 60 | Satellit 3. Ordnung von I.A-6 (T* das 3.00016-fache, Wort bis auf 4 Buchstaben) |
| 0.389481499317 | 0.196500786917 | 50.75665222 | 20.6162 | 5.9e-13 | B3 2.1e-14 | bestätigt | instabil | 12.0 | 0.2750 | 20 | — |
| 0.254876317043 | 0.122367500823 | 50.76402813 | 58.5916 | 9.8e-9 | B3 1.2e-13 | über den Umkehrpunkt | instabil | 3.917e+7 | 0.01763 | 52 | nur Klasse von II.A-4 |
| 0.249716686487 | 0.116133075158 | 50.89863930 | 60.3925 | 1.5e-9 | C 2.7e-12 | über den Umkehrpunkt | instabil | 1.380e+5 | 8.1e-4 | 54 | — |
| 0.062918843987 | 0.284731158565 | 50.92839954 | 56.7518 | 1.1e-6 | C 9.6e-13 | über den Umkehrpunkt | instabil | 1.780e+8 | 0.01165 | 46 | — |
| 0.226847125109 | 0.195361454788 | 51.05273574 | 55.0761 | 1.6e-7 | B3 7.6e-14 | über den Umkehrpunkt | instabil | 1.673e+9 | 0.02292 | 48 | — |
| 0.153998270213 | 0.054197447235 | 51.05304500 | 81.5734 | 8.2e-10 | B3 5.8e-12 | über den Umkehrpunkt | offen | 103 | 7.0e-5 | 72 | — |
| 0.271117196822 | 0.210383268786 | 51.11887434 | 44.4612 | 2.5e-8 | C 8.1e-14 | über den Umkehrpunkt | instabil | 6.022e+6 | 0.009273 | 38 | — |
| 0.113319737021 | 0.282691164412 | 51.16468609 | 53.9696 | 4.1e-7 | R 8.5e-13 | über den Umkehrpunkt | offen | 6.083e+6 | 2.7e-4 | 0 | — |
| 0.318261584113 | 0.124504835987 | 51.20572445 | 44.8942 | 1.8e-8 | B3 7.9e-13 | über den Umkehrpunkt | instabil | 2.37e+4 | 0.002173 | 40 | — |
| 0.401181284689 | 0.098008312154 | 51.24898607 | 26.6860 | 5.1e-8 | R 5.0e-14 | über den Umkehrpunkt | offen | 3.064e+10 | 0.004258 | 0 | — |
| 0.210223747529 | 0.132362344570 | 51.27286950 | 66.6793 | 5.7e-9 | B3 4.6e-13 | über den Umkehrpunkt | instabil | 4.013e+5 | 0.01692 | 60 | — |
| 0.266578987232 | 0.276235512619 | 51.30558475 | 34.2041 | 1.5e-8 | R 4.4e-13 | über den Umkehrpunkt | offen | 6.214e+5 | 2.4e-4 | 0 | — |
| 0.068148831060 | 0.232969157517 | 51.33261071 | 67.9349 | 8.5e-9 | C 7.6e-12 | über den Umkehrpunkt | instabil | 5.444e+6 | 0.03658 | 78 | — |
| 0.326226218135 | 0.148927605878 | 51.41390124 | 40.7888 | 3.5e-9 | B3 7.8e-14 | über den Umkehrpunkt | instabil | 2.233e+5 | 0.01910 | 36 | — |
| 0.304437256284 | 0.228688412374 | 51.43576401 | 35.0994 | 1.9e-10 | B3 8.7e-14 | über den Umkehrpunkt | instabil | 9.36e+3 | 0.1103 | 32 | — |
| 0.046712068969 | 0.204175241148 | 51.46261296 | 74.5828 | 9.8e-7 | B3 8.8e-14 | über den Umkehrpunkt | instabil | 2.416e+9 | 0.07352 | 80 | — |
| 0.198029163313 | 0.194986252764 | 51.47211289 | 60.5058 | 3.9e-6 | C 7.2e-13 | über den Umkehrpunkt | instabil | 1.068e+9 | 0.007816 | 54 | Satellit 3. Ordnung von Fund (0.048185, 0.042050) (T* das 2.99140-fache, Wort bis auf 4 Buchstaben) |
| 0.270452533177 | 0.215175706959 | 51.49112548 | 44.1673 | 2.6e-6 | B3 5.3e-13 | über den Umkehrpunkt | offen | 2.391e+8 | 7.9e-4 | 40 | — |
| 0.364622026679 | 0.063747990019 | 51.57800866 | 37.9445 | 3.4e-11 | C 5.9e-14 | bestätigt | instabil | 71.6 | 0.02446 | 34 | — |
| 0.219979241638 | 0.180296127065 | 51.58969399 | 59.1546 | 7.8e-6 | C 4.2e-13 | über den Umkehrpunkt | instabil | 8.044e+8 | 0.1203 | 54 | — |
| 0.295740168414 | 0.185040831596 | 51.59825498 | 43.4319 | 4.4e-9 | C 1.5e-13 | über den Umkehrpunkt | instabil | 1.729e+5 | 0.01265 | 38 | — |
| 0.374564682564 | 0.054776044899 | 51.63738207 | 35.8118 | 4.4e-10 | B3 7.3e-13 | über den Umkehrpunkt | offen | 633 | 8.0e-5 | 32 | — |
| 0.176411142025 | 0.221281507162 | 51.65160258 | 59.5548 | 3.7e-7 | B3 1.0e-12 | über den Umkehrpunkt | instabil | 1.861e+8 | 0.02199 | 52 | — |
| 0.336088426550 | 0.137024682694 | 51.67116451 | 39.8757 | 5.7e-7 | C 7.5e-13 | über den Umkehrpunkt | instabil | 4.536e+6 | 0.003627 | 36 | — |
| 0.277689606997 | 0.245216643129 | 51.75676385 | 37.9956 | 1.4e-11 | B3 1.1e-13 | bestätigt | instabil | 1.31e+4 | 0.01730 | 32 | nur Klasse von II.A-2 |
| 0.182519520523 | 0.190771336793 | 51.76797980 | 63.9642 | 2.9e-8 | C 3.0e-12 | über den Umkehrpunkt | instabil | 8.917e+5 | 5.7e-4 | 58 | — |
| 0.008703069746 | 0.265382303319 | 51.78505748 | 63.6537 | 4.7e-6 | R 2.6e-12 | über den Umkehrpunkt | offen | 6.697e+7 | 0.001853 | 0 | — |
| 0.220025756693 | 0.133800510755 | 51.81977307 | 65.4485 | 6.9e-6 | B3 1.2e-13 | über den Umkehrpunkt | instabil | 2.726e+9 | 0.02869 | 60 | — |
| 0.114161060272 | 0.369928536416 | 51.89125508 | 33.7449 | 5.6e-10 | C 6.8e-13 | über den Umkehrpunkt | instabil | 1.14e+4 | 0.03893 | 26 | — |
| 0.147495530270 | 0.055349189519 | 51.89295908 | 83.7515 | 1.3e-9 | C 6.9e-11 | an der Rechengrenze | instabil | 136 | 4.9e-4 | 74 | — |
| 0.179349557212 | 0.154137977707 | 52.05663787 | 70.1805 | 4.5e-7 | C 1.4e-11 | an der Rechengrenze | offen | 2.500e+7 | 2.4e-4 | 62 | — |
| 0.082149424184 | 0.096554118690 | 52.06032968 | 88.0595 | 1.8e-6 | C 2.1e-10 | an der Rechengrenze | offen | 2.063e+7 | 6.0e-5 | 78 | — |
| 0.134145421111 | 0.053094283414 | 52.09570576 | 85.9206 | 4.3e-8 | B3 1.1e-11 | an der Rechengrenze | offen | 5.07e+4 | 7.1e-5 | 76 | — |
| 0.101118261148 | 0.028004359425 | 52.14628384 | 90.5742 | 5.5e-7 | B3 5.6e-12 | über den Umkehrpunkt | offen | 1.090e+7 | 4.9e-4 | 80 | — |
| 0.356486703037 | 0.107333318566 | 52.21362266 | 37.8513 | 1.5e-8 | C 7.1e-12 | über den Umkehrpunkt | instabil | 2.227e+5 | 0.003541 | 34 | — |
| 0.069682947400 | 0.195204546294 | 52.29513001 | 76.1932 | 2.0e-7 | C 2.2e-13 | über den Umkehrpunkt | instabil | 1.674e+7 | 0.03381 | 82 | — |
| 0.283754100794 | 0.177811531838 | 52.30926870 | 47.6221 | 2.0e-7 | C 6.7e-13 | über den Umkehrpunkt | instabil | 1.235e+7 | 0.03037 | 42 | Satellit 3. Ordnung von Fund (0.121001, 0.210445) (T* das 3.04931-fache, Wort bis auf 4 Buchstaben) |
| 0.118186773436 | 0.217781481474 | 52.31043762 | 68.1644 | 3.0e-6 | C 8.3e-13 | über den Umkehrpunkt | instabil | 1.687e+9 | 0.01278 | 66 | — |
| 0.341020874430 | 0.161535330434 | 52.31809554 | 36.6005 | 1.7e-9 | B3 1.0e-13 | über den Umkehrpunkt | instabil | 6.575e+5 | 0.05104 | 32 | — |
| 0.124927767905 | 0.221542646842 | 52.38049066 | 66.8483 | 3.7e-6 | B3 3.2e-14 | über den Umkehrpunkt | instabil | 2.882e+11 | 0.04751 | 56 | — |
| 0.138675131124 | 0.059747169520 | 52.43843601 | 85.5644 | 1.8e-6 | B3 1.4e-12 | über den Umkehrpunkt | offen | 6.093e+7 | 9.1e-4 | 76 | — |
| 0.205768560105 | 0.239714942921 | 52.49348296 | 52.5707 | 3.6e-7 | B3 1.9e-13 | über den Umkehrpunkt | instabil | 1.482e+8 | 0.02887 | 44 | — |
| 0.109659691070 | 0.029525464680 | 52.64828402 | 90.5515 | 4.1e-7 | B3 5.9e-11 | an der Rechengrenze | instabil | 1.164e+6 | 0.001363 | 80 | — |
| 0.141520687551 | 0.074822145571 | 52.69507530 | 84.6717 | 1.3e-7 | B3 2.0e-12 | über den Umkehrpunkt | instabil | 2.317e+7 | 0.003732 | 76 | — |
| 0.356985184175 | 0.077793554284 | 52.71380679 | 40.0441 | 8.3e-8 | B3 2.0e-13 | über den Umkehrpunkt | instabil | 2.146e+7 | 0.03692 | 36 | — |
| 0.327393360631 | 0.224573137934 | 52.72158978 | 31.6679 | 2.3e-8 | C 1.2e-13 | über den Umkehrpunkt | instabil | 2.125e+6 | 0.02204 | 28 | — |
| 0.246393416752 | 0.227375721068 | 52.74002589 | 47.9084 | 4.5e-9 | B3 3.7e-13 | über den Umkehrpunkt | instabil | 2.23e+4 | 0.01034 | 44 | — |
| 0.167585829786 | 0.073938978540 | 52.81989971 | 81.2216 | 3.9e-7 | B3 9.1e-11 | an der Rechengrenze | offen | 2.954e+5 | 1.8e-5 | 72 | — |
| 0.380854620035 | 0.080613413772 | 52.84840138 | 33.7958 | 2.1e-6 | C 3.0e-13 | über den Umkehrpunkt | instabil | 1.563e+8 | 0.02560 | 30 | — |
| 0.243539630888 | 0.109113455203 | 52.89095654 | 64.7100 | 1.8e-9 | C 2.0e-13 | über den Umkehrpunkt | instabil | 1.468e+6 | 0.02368 | 58 | — |
| 0.078083865175 | 0.198597754870 | 53.09321941 | 76.1953 | 1.0e-8 | C 6.8e-14 | über den Umkehrpunkt | instabil | 1.626e+7 | 0.05137 | 82 | — |
| 0.335570128953 | 0.213847671971 | 53.15765520 | 31.6884 | 2.4e-8 | C 1.7e-13 | über den Umkehrpunkt | instabil | 2.992e+5 | 0.01048 | 28 | — |
| 0.084807792917 | 0.285634741128 | 53.21445112 | 57.7549 | 1.0e-7 | R 8.9e-14 | über den Umkehrpunkt | instabil | 5.548e+6 | 0.002327 | 0 | — |
| 0.072232233339 | 0.251093395428 | 53.24923786 | 66.4133 | 1.2e-6 | B3 1.7e-13 | über den Umkehrpunkt | instabil | 4.269e+8 | 0.009627 | 68 | — |
| 0.294500030047 | 0.133049075351 | 53.29072942 | 51.5291 | 4.1e-6 | C 2.7e-12 | über den Umkehrpunkt | offen | 1.287e+7 | 0.002418 | 46 | — |
| 0.292513158309 | 0.163468288233 | 53.31677974 | 48.4802 | 7.8e-7 | B3 1.3e-13 | über den Umkehrpunkt | instabil | 2.639e+8 | 0.01594 | 44 | — |
| 0.040977464622 | 0.172209981702 | 53.36494009 | 83.0858 | 6.6e-7 | C 9.4e-14 | über den Umkehrpunkt | instabil | 1.519e+7 | 0.003566 | 90 | — |
| 0.360108463356 | 0.071659181036 | 53.39326220 | 40.0779 | 1.0e-11 | B3 9.6e-14 | bestätigt | instabil | 191 | 0.04048 | 36 | — |
| 0.040216403083 | 0.263077944321 | 53.43000908 | 65.5367 | 3.0e-9 | C 1.9e-13 | über den Umkehrpunkt | instabil | 5.054e+6 | 0.03968 | 66 | — |
| 0.191850816914 | 0.105875720491 | 53.43042104 | 75.5617 | 4.7e-6 | B3 7.4e-12 | über den Umkehrpunkt | offen | 7.102e+6 | 2.2e-4 | 68 | — |
| 0.291861534445 | 0.318676256371 | 53.43126745 | 22.7708 | 8.7e-12 | C 2.2e-13 | bestätigt | instabil | 3.25e+3 | 0.2607 | 22 | — |
| 0.334321674327 | 0.217107935741 | 53.44339243 | 31.6671 | 6.6e-9 | C 4.7e-14 | über den Umkehrpunkt | instabil | 1.492e+6 | 0.04066 | 28 | — |
| 0.250987387313 | 0.122379049975 | 53.45751889 | 62.5284 | 2.8e-7 | B3 4.7e-13 | über den Umkehrpunkt | instabil | 4.137e+7 | 0.01871 | 56 | — |
| 0.332715874936 | 0.139681690664 | 53.46103934 | 41.8174 | 7.0e-7 | C 7.3e-12 | über den Umkehrpunkt | offen | 2.514e+8 | 0.006645 | 38 | — |
| 0.170262204016 | 0.093353230513 | 53.51695235 | 80.3774 | 2.6e-7 | B3 1.5e-11 | an der Rechengrenze | instabil | 3.833e+5 | 0.001387 | 72 | — |
| 0.218042753538 | 0.200549905816 | 53.58222578 | 58.5744 | 1.1e-7 | C 3.3e-14 | über den Umkehrpunkt | instabil | 1.841e+8 | 0.06028 | 50 | — |
| 0.218998811998 | 0.116276657221 | 53.59527027 | 69.8018 | 1.5e-8 | B3 6.6e-13 | über den Umkehrpunkt | instabil | 1.067e+6 | 0.01148 | 64 | — |
| 0.033243766313 | 0.271953582355 | 53.65557591 | 63.9969 | 4.9e-6 | C 1.1e-13 | über den Umkehrpunkt | instabil | 7.380e+9 | 0.02179 | 54 | — |
| 0.181554189454 | 0.153609335961 | 53.78271121 | 72.2257 | 2.2e-7 | B3 1.4e-12 | über den Umkehrpunkt | offen | 1.647e+7 | 6.1e-4 | 64 | — |
| 0.075442007775 | -0.019387859531 | 53.81125522 | 95.8738 | 5.7e-6 | C 3.4e-12 | über den Umkehrpunkt | offen | 2.299e+9 | 9.1e-8 | 86 | — |
| 0.308376744298 | 0.129078557298 | 53.87673282 | 49.1963 | 3.5e-6 | B3 3.7e-12 | über den Umkehrpunkt | offen | 3.479e+9 | 2.8e-4 | 44 | — |
| 0.188832792322 | 0.116244918741 | 53.88856674 | 75.6866 | 1.5e-7 | B3 2.5e-11 | an der Rechengrenze | offen | 2.73e+4 | 2.3e-4 | 68 | — |
| 0.327706900323 | 0.146105254515 | 53.96478617 | 42.7617 | 4.9e-8 | C 4.3e-13 | über den Umkehrpunkt | instabil | 1.609e+5 | 0.002756 | 38 | — |
| 0.145279786778 | 0.073895699250 | 54.02516264 | 86.3631 | 9.4e-6 | C 9.7e-12 | über den Umkehrpunkt | offen | 2.271e+8 | 0.003611 | 78 | — |
| 0.227227053276 | 0.113454578246 | 54.04296234 | 69.0509 | 7.3e-6 | C 4.7e-14 | über den Umkehrpunkt | offen | 1.029e+10 | 0.003225 | 62 | — |
| 0.316781410702 | 0.139623499033 | 54.06518284 | 46.2212 | 4.6e-11 | C 1.2e-12 | bestätigt | instabil | 5.93e+3 | 0.1357 | 42 | — |
| 0.309341034233 | 0.153715488451 | 54.08106923 | 46.4370 | 4.8e-7 | C 6.1e-14 | über den Umkehrpunkt | instabil | 2.468e+8 | 0.02352 | 42 | Satellit 3. Ordnung von I.B-5 (T* das 3.02051-fache, Wort bis auf 4 Buchstaben) |
| 0.382683098698 | 0.015247183349 | 54.09139320 | 36.3067 | 1.0e-9 | R 6.1e-12 | über den Umkehrpunkt | offen | 146 | 2.0e-5 | 0 | — |
| 0.076872182913 | 0.197881622265 | 54.10925468 | 77.8694 | 5.6e-8 | B3 8.2e-14 | über den Umkehrpunkt | instabil | 3.402e+7 | 0.04753 | 84 | — |
| 0.304623267264 | 0.200359557122 | 54.25145287 | 41.4169 | 8.2e-10 | C 2.1e-14 | über den Umkehrpunkt | instabil | 1.223e+5 | 0.03817 | 36 | — |
| 0.232990749773 | 0.105263359803 | 54.32528214 | 69.0313 | 5.0e-9 | C 1.4e-11 | an der Rechengrenze | instabil | 1.29e+3 | 0.01323 | 62 | — |
| 0.301271277242 | 0.164430437499 | 54.42356102 | 47.3215 | 2.0e-8 | C 8.2e-14 | über den Umkehrpunkt | instabil | 7.373e+7 | 0.1463 | 42 | — |
| 0.383425561214 | 0.017107558524 | 54.42567773 | 36.3065 | 1.0e-9 | C 2.1e-12 | über den Umkehrpunkt | instabil | 735 | 1.8e-4 | 32 | — |
| 0.233963394334 | 0.104754464073 | 54.44512877 | 69.0300 | 4.5e-8 | C 2.6e-12 | über den Umkehrpunkt | offen | 4.15e+3 | 0.01504 | 62 | — |
| 0.285525618684 | 0.141014720126 | 54.44773888 | 53.8730 | 1.7e-6 | B3 1.8e-13 | über den Umkehrpunkt | offen | 2.786e+8 | 0.01338 | 48 | — |
| -0.067369097672 | 0.232705679532 | 54.49153929 | 72.2180 | 3.9e-8 | C 1.9e-13 | über den Umkehrpunkt | instabil | 7.549e+6 | 0.03623 | 84 | — |
| 0.191100160660 | 0.201704211598 | 54.53234264 | 64.1166 | 7.5e-6 | C 3.8e-14 | über den Umkehrpunkt | instabil | 5.851e+10 | 0.05185 | 56 | — |
| 0.068757103093 | 0.195101742890 | 54.53863080 | 79.5400 | 3.8e-7 | C 1.8e-13 | über den Umkehrpunkt | instabil | 1.987e+7 | 0.03315 | 86 | — |
| 0.107556839989 | 0.285411742962 | 54.62475310 | 57.5057 | 1.1e-6 | R 6.0e-12 | über den Umkehrpunkt | offen | 8.786e+6 | 4.1e-5 | 0 | — |
| 0.363240615326 | 0.181050211862 | 54.64132106 | 30.3957 | 6.4e-8 | B3 3.9e-14 | über den Umkehrpunkt | instabil | 6.841e+6 | 0.2463 | 28 | — |
| 0.374205510289 | 0.041444330382 | 54.69466059 | 38.4969 | 2.5e-10 | C 2.9e-12 | über den Umkehrpunkt | instabil | 286 | 0.01356 | 34 | — |
| 0.169101028169 | 0.091665781663 | 54.72289323 | 82.5208 | 1.0e-8 | C 1.7e-10 | an der Rechengrenze | offen | 5.35e+3 | 1.2e-4 | 74 | — |
| 0.162023730824 | 0.084690839663 | 54.73243482 | 84.2230 | 6.3e-8 | B3 6.9e-13 | über den Umkehrpunkt | offen | 1.750e+5 | 7.4e-4 | 76 | — |
| 0.100038208921 | 0.015509899031 | 54.79447733 | 95.5501 | 2.5e-6 | B3 5.1e-12 | über den Umkehrpunkt | offen | 1.401e+7 | 4.9e-5 | 84 | — |
| 0.118111181579 | 0.249588919048 | 54.85618527 | 64.9143 | 3.8e-7 | C 2.7e-13 | über den Umkehrpunkt | instabil | 5.757e+9 | 0.01878 | 58 | — |
| 0.318678180585 | 0.108446187405 | 54.88930680 | 49.4997 | 7.1e-9 | B3 4.5e-12 | über den Umkehrpunkt | instabil | 7.38e+4 | 9.6e-4 | 44 | — |
| 0.315391715058 | 0.117950567121 | 54.90797609 | 49.4895 | 2.7e-6 | B3 8.5e-13 | über den Umkehrpunkt | instabil | 6.549e+7 | 0.005885 | 44 | — |
| 0.311798694191 | 0.193266827179 | 54.91287594 | 41.3094 | 1.2e-8 | B3 4.4e-14 | über den Umkehrpunkt | instabil | 2.155e+6 | 0.04165 | 36 | — |
| 0.084915988850 | 0.039529448844 | 55.00328237 | 96.6474 | 6.9e-6 | C 7.5e-12 | über den Umkehrpunkt | offen | 2.571e+9 | 0.002047 | 86 | — |
| 0.183917482200 | 0.240879820291 | 55.00943019 | 58.4064 | 1.3e-6 | C 3.8e-12 | über den Umkehrpunkt | instabil | 6.113e+6 | 3.0e-4 | 54 | — |
| 0.284926330122 | 0.195579369199 | 55.10586501 | 47.2722 | 1.3e-7 | C 6.0e-14 | über den Umkehrpunkt | instabil | 4.483e+7 | 0.05303 | 42 | — |
| 0.238827872396 | 0.141009954973 | 55.19788573 | 65.0221 | 1.2e-7 | C 1.3e-11 | an der Rechengrenze | instabil | 1.936e+6 | 0.01446 | 58 | — |
| 0.163470413523 | 0.076336146267 | 55.32775085 | 85.5584 | 2.5e-6 | B3 1.4e-11 | an der Rechengrenze | offen | 2.002e+6 | 7.4e-5 | 76 | — |
| 0.088732518522 | 0.321778706327 | 55.44010785 | 50.7621 | 1.6e-8 | C 2.3e-11 | an der Rechengrenze | instabil | 1.991e+5 | 0.03497 | 38 | — |
| 0.109962988141 | 0.021225332831 | 55.45082921 | 95.5485 | 1.5e-6 | B3 2.0e-11 | an der Rechengrenze | offen | 6.390e+5 | 4.7e-6 | 84 | — |
| 0.235669175674 | 0.232331682200 | 55.46102486 | 51.5494 | 6.2e-10 | B3 1.2e-13 | über den Umkehrpunkt | instabil | 8.060e+6 | 0.03019 | 48 | — |
| 0.112299331394 | 0.012727186576 | 55.52713851 | 95.5648 | 2.2e-8 | B3 1.8e-11 | an der Rechengrenze | offen | 6.07e+3 | 1.5e-5 | 84 | — |
| 0.167377812367 | 0.075177263933 | 55.68189648 | 85.5671 | 1.9e-6 | B3 2.7e-11 | an der Rechengrenze | offen | 3.003e+7 | 6.6e-5 | 76 | — |
| 0.200718678786 | 0.116871975565 | 55.76769698 | 76.0993 | 3.9e-6 | B3 1.7e-11 | an der Rechengrenze | offen | 5.995e+7 | 5.7e-5 | 68 | — |
| 0.205925910916 | 0.191778530939 | 55.81881583 | 64.7560 | 3.6e-7 | C 1.5e-13 | über den Umkehrpunkt | instabil | 1.190e+7 | 0.02915 | 58 | — |
| 0.253724299489 | 0.136947657958 | 55.86390114 | 63.0788 | 1.6e-6 | B3 9.7e-13 | über den Umkehrpunkt | instabil | 1.514e+8 | 0.005555 | 56 | — |
| 0.103493547606 | 0.097045334810 | 55.91462859 | 92.5589 | 3.9e-8 | C 3.8e-12 | über den Umkehrpunkt | instabil | 6.205e+6 | 0.003478 | 82 | — |
| 0.398234027405 | 0.079524733840 | 55.98052134 | 31.0746 | 3.9e-8 | B3 1.2e-13 | über den Umkehrpunkt | instabil | 2.778e+7 | 0.02450 | 28 | nur Klasse von I.A-10 |
| 0.289530474869 | 0.197772696819 | 56.07961242 | 46.7126 | 9.6e-9 | C 1.3e-14 | über den Umkehrpunkt | instabil | 1.019e+7 | 0.03787 | 40 | — |
| 0.326294802250 | 0.133645662986 | 56.14742946 | 46.2204 | 2.2e-10 | C 4.7e-13 | über den Umkehrpunkt | instabil | 3.10e+3 | 0.1339 | 42 | — |
| 0.200467806110 | 0.092898875033 | 56.15656760 | 79.0387 | 9.9e-9 | C 3.6e-11 | an der Rechengrenze | offen | 7.46e+4 | 2.6e-4 | 70 | — |
| 0.221680616316 | 0.259701276590 | 56.17370022 | 49.3325 | 7.7e-12 | B3 5.9e-12 | bestätigt | instabil | 387 | 0.02092 | 40 | — |
| 0.284349462393 | 0.259392432139 | 56.21970411 | 37.1974 | 4.2e-6 | C 2.7e-13 | über den Umkehrpunkt | instabil | 3.148e+9 | 0.01722 | 34 | — |
| 0.098809221875 | 0.104843409006 | 56.25089934 | 92.8029 | 5.7e-8 | C 4.1e-12 | über den Umkehrpunkt | offen | 7.286e+5 | 1.5e-4 | 82 | — |
| 0.391353965067 | 0.079633924872 | 56.25295428 | 33.1220 | 1.9e-9 | C 5.8e-14 | über den Umkehrpunkt | instabil | 1.143e+6 | 0.02674 | 30 | — |
| 0.135977914121 | 0.047324723786 | 56.30097890 | 92.8984 | 1.8e-8 | C 4.7e-10 | an der Rechengrenze | offen | 1.97e+3 | 2.5e-4 | 82 | — |
| 0.032827647564 | 0.164422971717 | 56.32534800 | 89.2776 | 4.4e-6 | B3 2.1e-13 | über den Umkehrpunkt | instabil | 9.887e+9 | 0.01630 | 88 | — |
| 0.281872692115 | 0.144357560811 | 56.39141184 | 56.2682 | 1.8e-7 | C 1.5e-12 | über den Umkehrpunkt | offen | 1.051e+6 | 3.2e-4 | 50 | — |
| 0.284978129049 | 0.116723799090 | 56.40383625 | 58.6020 | 1.4e-10 | B3 4.1e-13 | über den Umkehrpunkt | instabil | 12.1 | 7.4e-4 | 52 | nur Klasse von II.A-4 |
| 0.160738319520 | 0.075960224232 | 56.43439668 | 87.7316 | 1.6e-6 | C 8.5e-12 | über den Umkehrpunkt | offen | 6.540e+8 | 1.5e-4 | 78 | — |
| 0.098004739861 | 0.280217863456 | 56.45832939 | 61.5597 | 5.7e-7 | R 9.2e-13 | über den Umkehrpunkt | offen | 6.641e+6 | 2.1e-4 | 0 | — |
| 0.094334002859 | 0.015342088430 | 56.58211974 | 99.2369 | 2.4e-7 | B3 1.6e-11 | an der Rechengrenze | offen | 1.800e+6 | 6.2e-4 | 88 | — |
| 0.207335788960 | 0.214634389255 | 56.68939508 | 61.4055 | 3.8e-7 | C 5.2e-13 | über den Umkehrpunkt | instabil | 5.176e+7 | 0.01520 | 54 | — |
| 0.363711193299 | 0.058735682513 | 56.76597497 | 42.2530 | 1.1e-8 | C 1.7e-13 | über den Umkehrpunkt | instabil | 5.75e+4 | 0.005634 | 38 | — |
| 0.067923711344 | 0.195008011300 | 56.77878558 | 82.8797 | 4.3e-7 | C 2.4e-13 | über den Umkehrpunkt | instabil | 2.326e+7 | 0.03257 | 90 | — |
| 0.286342567045 | 0.189489446961 | 56.81423965 | 49.3609 | 3.9e-7 | B3 9.4e-13 | über den Umkehrpunkt | offen | 8.404e+6 | 3.3e-4 | 44 | — |
| 0.360821104383 | 0.146160209265 | 56.88156028 | 36.3728 | 1.8e-6 | B3 1.3e-12 | über den Umkehrpunkt | instabil | 5.324e+7 | 0.02153 | 32 | — |
| 0.298084527135 | 0.190589975161 | 56.90983389 | 46.5086 | 5.8e-9 | B3 4.0e-14 | über den Umkehrpunkt | instabil | 2.318e+6 | 0.02237 | 40 | — |
| 0.284139680090 | 0.164320618433 | 56.98546471 | 53.7111 | 9.3e-8 | C 3.1e-13 | über den Umkehrpunkt | instabil | 3.171e+8 | 0.05184 | 48 | — |
| 0.306203985263 | 0.121415190346 | 57.02764868 | 53.4300 | 1.6e-7 | B3 3.8e-13 | über den Umkehrpunkt | instabil | 5.682e+6 | 0.004408 | 48 | — |
| 0.268905969152 | 0.161920150761 | 57.03526243 | 57.6659 | 4.0e-7 | B3 7.0e-14 | über den Umkehrpunkt | instabil | 5.684e+7 | 0.02895 | 52 | — |
| 0.212954547586 | 0.106569923708 | 57.05759575 | 76.5532 | 5.2e-7 | B3 1.1e-11 | an der Rechengrenze | offen | 4.136e+5 | 4.7e-4 | 68 | — |
| 0.006282561355 | 0.339508208874 | 57.09219447 | 50.6656 | 1.7e-7 | C 2.5e-11 | an der Rechengrenze | instabil | 9.075e+6 | 2.1e-4 | 36 | — |
| 0.239483374490 | 0.106843712437 | 57.26241075 | 71.1864 | 2.3e-8 | B3 1.5e-12 | über den Umkehrpunkt | instabil | 5.011e+5 | 0.02122 | 64 | — |
| 0.170854594908 | 0.088704278443 | 57.30441128 | 86.3831 | 5.2e-6 | C 3.8e-12 | über den Umkehrpunkt | offen | 3.894e+7 | 8.6e-4 | 78 | — |
| 0.087228496028 | 0.096489833336 | 57.38467895 | 96.6311 | 1.7e-6 | C 5.0e-12 | über den Umkehrpunkt | offen | 3.591e+7 | 5.9e-4 | 86 | — |
| 0.222287159712 | 0.125533693626 | 57.43820714 | 73.0778 | 3.7e-8 | C 4.0e-11 | an der Rechengrenze | instabil | 1.181e+7 | 0.02141 | 66 | — |
| 0.210015836871 | 0.189423261688 | 57.45996296 | 66.2965 | 3.1e-6 | C 4.4e-11 | an der Rechengrenze | instabil | 9.360e+5 | 0.001328 | 58 | — |
| 0.297913157588 | 0.159082919739 | 57.54445291 | 51.5845 | 7.5e-7 | C 1.6e-12 | über den Umkehrpunkt | instabil | 2.754e+8 | 0.02029 | 46 | — |
| 0.135801362871 | 0.049332976629 | 57.66431858 | 95.0733 | 1.6e-8 | B3 4.8e-12 | über den Umkehrpunkt | instabil | 2.60e+4 | 9.1e-4 | 84 | — |
| 0.207925519978 | 0.104141939116 | 57.72324233 | 78.7046 | 1.5e-8 | C 2.3e-12 | über den Umkehrpunkt | instabil | 5.62e+4 | 0.002445 | 70 | — |
| 0.348074207843 | 0.132011158426 | 57.77240336 | 41.8891 | 1.0e-7 | C 2.5e-13 | über den Umkehrpunkt | instabil | 6.602e+6 | 0.01378 | 38 | — |
| 0.094852492015 | 0.016403932787 | 57.83144298 | 101.3591 | 8.1e-7 | C 1.4e-11 | an der Rechengrenze | offen | 8.602e+6 | 6.4e-4 | 90 | — |
| 0.264515933613 | 0.281985328454 | 57.84471383 | 37.7651 | 1.7e-6 | R 8.4e-13 | über den Umkehrpunkt | offen | 2.135e+6 | 3.1e-5 | 0 | — |
| 0.357660338428 | 0.066795338551 | 57.86818689 | 44.3991 | 7.5e-8 | B3 1.4e-12 | über den Umkehrpunkt | instabil | 5.88e+4 | 0.03516 | 40 | — |
| 0.325123653988 | 0.223147822983 | 57.88146347 | 35.5463 | 3.2e-8 | R 1.2e-13 | über den Umkehrpunkt | offen | 3.998e+5 | 5.5e-4 | 0 | — |
| 0.012933482905 | 0.316821720152 | 58.00252993 | 57.7664 | 1.7e-6 | C 1.5e-10 | an der Rechengrenze | instabil | 9.362e+7 | 0.001279 | 42 | Satellit 3. Ordnung von I.B-4 (T* das 3.00379-fache, Wort bis auf 4 Buchstaben) |
| 0.317479785283 | 0.089050516572 | 58.04955708 | 54.2934 | 1.1e-11 | B3 8.2e-14 | bestätigt | instabil | 4.08 | 0.005965 | 48 | nur Klasse von I.A-19 |
| 0.367500145603 | 0.056104562522 | 58.08314601 | 42.2626 | 2.1e-8 | C 1.6e-12 | über den Umkehrpunkt | instabil | 2.55e+4 | 0.001277 | 38 | — |
| 0.376209979176 | 0.047077242546 | 58.09000457 | 40.1130 | 5.0e-7 | B3 1.8e-13 | über den Umkehrpunkt | offen | 9.756e+6 | 0.007853 | 36 | — |
| 0.364142874274 | 0.076577428953 | 58.13526428 | 42.1986 | 2.3e-9 | C 1.2e-13 | über den Umkehrpunkt | instabil | 2.624e+5 | 0.03547 | 38 | — |
| 0.211624443534 | 0.253532601943 | 58.20282618 | 54.2915 | 2.2e-10 | C 3.7e-14 | über den Umkehrpunkt | instabil | 1.04e+4 | 0.01261 | 46 | — |
| 0.291430521247 | 0.168198100823 | 58.23627880 | 52.5577 | 2.9e-7 | C 8.8e-14 | über den Umkehrpunkt | instabil | 5.102e+7 | 0.05134 | 46 | — |
| 0.209914814056 | 0.222268751890 | 58.26009366 | 61.1376 | 2.4e-8 | B3 4.8e-13 | über den Umkehrpunkt | instabil | 1.373e+6 | 0.01430 | 52 | — |
| 0.218691394361 | 0.184157116837 | 58.30888941 | 66.4740 | 7.7e-8 | B3 1.1e-12 | über den Umkehrpunkt | offen | 3.599e+10 | 0.003049 | 60 | — |
| 0.238765820523 | 0.195220518083 | 58.34575486 | 60.4941 | 7.8e-9 | B3 9.2e-13 | über den Umkehrpunkt | instabil | 7.043e+7 | 0.004977 | 52 | — |
| 0.076177704695 | 0.281029728892 | 58.35583253 | 65.1420 | 1.7e-6 | R 8.6e-13 | über den Umkehrpunkt | offen | 2.023e+7 | 0.001828 | 0 | — |
| 0.284151577567 | 0.189103122215 | 58.37607964 | 51.3023 | 2.5e-9 | C 7.7e-14 | über den Umkehrpunkt | instabil | 3.327e+5 | 0.01409 | 46 | — |
| 0.070716770055 | 0.250425136861 | 58.43960848 | 73.1472 | 1.5e-7 | B3 2.6e-13 | über den Umkehrpunkt | instabil | 7.326e+8 | 0.01008 | 76 | — |
| 0.220076405210 | 0.211918669734 | 58.46233926 | 61.4053 | 1.8e-7 | C 1.2e-12 | über den Umkehrpunkt | instabil | 6.476e+6 | 0.01232 | 54 | — |
| 0.375801399809 | 0.043181613084 | 58.47678283 | 40.6358 | 1.9e-10 | B3 2.0e-13 | über den Umkehrpunkt | instabil | 431 | 0.01406 | 36 | — |
| 0.228792730689 | 0.235394258019 | 58.49755737 | 55.1277 | 3.1e-8 | B3 7.2e-14 | über den Umkehrpunkt | instabil | 3.671e+7 | 0.05087 | 52 | — |
| 0.165057316677 | 0.080329001252 | 58.50243260 | 89.8864 | 1.8e-6 | B3 1.4e-11 | an der Rechengrenze | offen | 5.207e+6 | 0.001530 | 80 | — |
| 0.326457744295 | 0.223491612976 | 58.59335528 | 35.6021 | 2.5e-10 | C 5.7e-14 | über den Umkehrpunkt | instabil | 8.76e+4 | 0.05251 | 32 | — |
| 0.279822546631 | 0.198158461347 | 58.61431147 | 51.0637 | 3.9e-7 | C 7.2e-14 | über den Umkehrpunkt | instabil | 1.115e+8 | 0.04745 | 46 | — |
| 0.212671310154 | 0.116453795088 | 58.66499507 | 77.7008 | 1.0e-6 | C 7.7e-13 | über den Umkehrpunkt | instabil | 6.751e+7 | 0.007892 | 70 | — |
| 0.360200123322 | 0.064393380432 | 58.66727634 | 44.4060 | 3.0e-10 | B3 4.6e-13 | über den Umkehrpunkt | instabil | 1.56e+3 | 0.02602 | 40 | — |
| 0.039622921780 | 0.262101943112 | 58.70791310 | 72.2746 | 6.1e-9 | C 1.7e-13 | über den Umkehrpunkt | instabil | 8.250e+6 | 0.03960 | 74 | — |
| 0.269297565557 | 0.157229627989 | 58.78136924 | 60.0013 | 3.4e-7 | C 4.1e-13 | über den Umkehrpunkt | instabil | 1.560e+8 | 0.05423 | 54 | — |
| 0.282048212864 | 0.196095389892 | 58.81748131 | 51.0566 | 1.9e-8 | C 1.5e-14 | über den Umkehrpunkt | instabil | 1.991e+7 | 0.05519 | 46 | — |
| 0.090176433774 | 0.397461821244 | 58.93341051 | 32.2812 | 2.1e-8 | C 8.8e-14 | über den Umkehrpunkt | instabil | 3.152e+6 | 0.01784 | 26 | — |
| 0.304311047640 | -0.210506630470 | 58.94970991 | 43.4055 | 3.4e-10 | C 5.2e-13 | über den Umkehrpunkt | instabil | 3.11e+3 | 0.001340 | 38 | — |
| 0.285924441548 | 0.168950071294 | 58.97586331 | 54.4805 | 7.3e-7 | B3 9.6e-14 | über den Umkehrpunkt | instabil | 3.894e+8 | 0.04137 | 48 | — |
| 0.135538794198 | 0.050633226479 | 58.99691093 | 97.2397 | 1.5e-8 | C 2.6e-11 | an der Rechengrenze | instabil | 1.53e+4 | 0.003437 | 86 | — |
| 0.123591271602 | 0.029714317103 | 59.09085672 | 99.9058 | 8.6e-9 | B3 4.0e-12 | über den Umkehrpunkt | instabil | 5.98e+3 | 2.0e-4 | 88 | — |
| 0.295159260156 | 0.159232360315 | 59.15966740 | 53.7122 | 4.4e-8 | C 1.2e-13 | über den Umkehrpunkt | instabil | 7.242e+6 | 0.06567 | 48 | — |
| 0.260636216374 | 0.160662637886 | 59.22465579 | 62.0252 | 3.8e-6 | B3 1.2e-12 | über den Umkehrpunkt | instabil | 1.039e+9 | 0.01517 | 56 | — |
| 0.353654553739 | 0.184044672537 | 59.26571332 | 35.1031 | 1.8e-6 | C 1.2e-12 | über den Umkehrpunkt | offen | 3.207e+7 | 0.001156 | 32 | — |
| 0.218491694868 | 0.100521610833 | 59.32256732 | 79.0351 | 1.0e-6 | C 1.8e-11 | an der Rechengrenze | offen | 2.086e+6 | 0.001078 | 70 | — |
| 0.097483727210 | 0.093940574089 | 59.42843551 | 99.3265 | 2.2e-7 | C 6.0e-13 | über den Umkehrpunkt | offen | 4.715e+7 | 0.002173 | 88 | — |
| 0.133183455398 | 0.117918980103 | 59.70792177 | 92.8019 | 8.4e-9 | C 5.4e-11 | an der Rechengrenze | offen | 3.58e+3 | 2.5e-5 | 82 | — |
| 0.273156655241 | 0.190239125003 | 59.72927532 | 54.9547 | 5.1e-6 | C 4.4e-12 | über den Umkehrpunkt | instabil | 2.376e+7 | 0.01625 | 50 | — |
| 0.199539873943 | 0.353815458187 | 59.75075614 | 33.1354 | 7.9e-9 | B3 9.3e-14 | über den Umkehrpunkt | instabil | 1.686e+6 | 0.08659 | 28 | — |
| 0.270599263912 | 0.146939941613 | 59.77095562 | 62.1102 | 5.5e-8 | B3 3.6e-13 | über den Umkehrpunkt | instabil | 2.326e+5 | 0.004879 | 56 | — |
| 0.099464625519 | 0.028635963301 | 59.83829293 | 104.0943 | 3.0e-7 | B3 3.4e-11 | an der Rechengrenze | offen | 9.559e+5 | 2.0e-5 | 92 | — |
| 0.262823403175 | 0.091299601697 | 59.84963694 | 70.2700 | 3.0e-10 | C 1.2e-12 | über den Umkehrpunkt | instabil | 384 | 1.5e-4 | 62 | nur Klasse von I.B-33 |
| 0.007247870598 | 0.261285451204 | 59.91361056 | 74.6975 | 7.1e-7 | R 3.7e-12 | über den Umkehrpunkt | instabil | 2.877e+7 | 2.4e-4 | 0 | — |
| 0.131141733612 | 0.050648151686 | 59.92987393 | 99.3998 | 8.5e-7 | B3 4.9e-12 | über den Umkehrpunkt | instabil | 1.917e+6 | 0.002913 | 88 | — |
| 0.075822195013 | 0.198445964903 | 59.93095689 | 86.2154 | 2.0e-8 | C 3.5e-14 | über den Umkehrpunkt | instabil | 3.225e+7 | 0.04975 | 94 | — |
| 0.101944603261 | 0.099548105405 | 59.94488889 | 99.1380 | 2.4e-6 | B3 4.7e-12 | über den Umkehrpunkt | offen | 9.802e+7 | 0.001338 | 88 | — |
| 0.329188740521 | 0.125036222037 | 59.99527954 | 49.5272 | 3.0e-7 | C 8.6e-14 | über den Umkehrpunkt | offen | 5.133e+9 | 0.001058 | 44 | — |
| 0.263939184426 | 0.161863414649 | 60.15216141 | 62.0279 | 2.2e-7 | B3 5.2e-14 | über den Umkehrpunkt | instabil | 9.046e+7 | 0.04602 | 56 | — |
| 0.037368725234 | 0.298241145206 | 60.21668944 | 64.6297 | 9.8e-9 | C 7.3e-14 | über den Umkehrpunkt | instabil | 5.109e+5 | 0.008484 | 48 | — |
| 0.222761945887 | 0.136226323113 | 60.33428564 | 75.2912 | 7.9e-10 | B3 4.4e-12 | über den Umkehrpunkt | instabil | 3.378e+6 | 0.01702 | 68 | — |
| 0.345499911656 | 0.193900462050 | 60.33933613 | 36.4928 | 3.8e-8 | C 6.0e-14 | über den Umkehrpunkt | instabil | 3.792e+7 | 0.1285 | 34 | — |
| 0.302902476574 | 0.234041096921 | 60.36121439 | 40.5760 | 1.7e-9 | C 1.4e-13 | über den Umkehrpunkt | instabil | 6.490e+5 | 0.03988 | 38 | — |
| 0.322005192853 | 0.147966630916 | 60.37523220 | 49.1703 | 3.5e-6 | R 5.5e-13 | über den Umkehrpunkt | offen | 6.496e+8 | 2.8e-4 | 0 | — |
| 0.177874205883 | 0.087203867444 | 60.37873513 | 89.8858 | 6.8e-7 | B3 2.4e-12 | über den Umkehrpunkt | offen | 4.598e+6 | 6.1e-4 | 80 | — |
| 0.126277653244 | 0.230810208119 | 60.43784755 | 74.9140 | 2.0e-6 | B3 2.1e-13 | über den Umkehrpunkt | instabil | 6.739e+9 | 0.03264 | 72 | — |
| 0.356018343552 | 0.072261788513 | 60.44502577 | 46.5471 | 6.6e-9 | C 2.0e-13 | über den Umkehrpunkt | instabil | 1.060e+5 | 0.04116 | 42 | — |
| 0.311382056571 | 0.190329209977 | 60.46685795 | 46.0605 | 2.9e-9 | C 3.9e-14 | über den Umkehrpunkt | instabil | 1.542e+5 | 0.06401 | 42 | — |
| 0.264059374908 | 0.195122542775 | 60.52041867 | 57.0146 | 4.1e-8 | C 7.0e-13 | über den Umkehrpunkt | instabil | 1.190e+6 | 0.01929 | 50 | — |
| 0.154016563993 | 0.195676577095 | 60.70306255 | 78.7957 | 8.1e-7 | C 9.3e-14 | über den Umkehrpunkt | instabil | 1.680e+7 | 0.07712 | 72 | — |
| 0.182553905201 | 0.187088766537 | 60.75324144 | 75.7416 | 9.0e-8 | B3 6.9e-13 | über den Umkehrpunkt | instabil | 5.145e+7 | 0.02693 | 68 | — |
| 0.367534614280 | 0.095866802748 | 60.75638712 | 41.7442 | 3.6e-9 | C 4.0e-13 | über den Umkehrpunkt | instabil | 3.57e+4 | 0.001314 | 38 | — |
| 0.221219914595 | 0.178144502035 | 60.77143427 | 69.7896 | 1.8e-7 | B3 1.7e-13 | über den Umkehrpunkt | instabil | 9.406e+7 | 0.1098 | 64 | — |
| 0.173118724855 | 0.112692220366 | 60.77609167 | 88.7001 | 2.0e-6 | B3 3.1e-11 | an der Rechengrenze | instabil | 5.297e+5 | 2.0e-4 | 80 | — |
| 0.269495486831 | 0.153846590986 | 60.78244922 | 62.4785 | 7.3e-6 | B3 4.0e-13 | über den Umkehrpunkt | offen | 1.957e+9 | 0.01115 | 56 | — |
| 0.333771860867 | 0.194078431132 | 60.87650180 | 39.9087 | 1.9e-8 | B3 1.3e-12 | über den Umkehrpunkt | instabil | 7.244e+5 | 0.1228 | 36 | — |
| 0.252075743541 | 0.201885171354 | 60.91353142 | 58.9598 | 2.1e-7 | C 2.2e-13 | über den Umkehrpunkt | instabil | 6.590e+7 | 0.05279 | 54 | — |
| 0.222456630588 | 0.185098553231 | 60.99265503 | 68.5759 | 1.6e-6 | C 5.0e-12 | über den Umkehrpunkt | instabil | 4.260e+8 | 0.002387 | 46 | — |
| 0.066482160753 | 0.194843304694 | 61.24968922 | 89.5403 | 5.4e-7 | C 4.1e-14 | über den Umkehrpunkt | instabil | 3.078e+7 | 0.03157 | 98 | — |
| 0.164154553863 | 0.265927166601 | 61.27854328 | 62.3553 | 3.8e-9 | C 3.8e-13 | über den Umkehrpunkt | instabil | 1.010e+5 | 0.008346 | 50 | — |
| 0.250551655333 | 0.187010549214 | 61.33356741 | 62.3719 | 5.6e-6 | C 2.4e-13 | über den Umkehrpunkt | instabil | 1.676e+9 | 0.1007 | 54 | — |
| 0.345329454979 | 0.203586164071 | 61.34037199 | 35.6557 | 1.0e-8 | R 3.6e-13 | über den Umkehrpunkt | instabil | 4.87e+4 | 8.9e-4 | 0 | — |
| 0.177756197439 | 0.113705137665 | 61.41904942 | 88.6702 | 2.4e-6 | B3 6.9e-11 | an der Rechengrenze | offen | 2.341e+6 | 4.1e-6 | 80 | — |
| 0.372250018359 | 0.141935286041 | 61.43399864 | 36.4758 | 4.6e-9 | B3 6.2e-14 | über den Umkehrpunkt | instabil | 2.587e+6 | 0.03698 | 32 | — |
| 0.054619449823 | 0.324646987442 | 61.46766906 | 57.6457 | 7.2e-9 | C 5.4e-12 | über den Umkehrpunkt | instabil | 9.413e+5 | 0.007530 | 42 | — |
| 0.349854153596 | 0.108241085018 | 61.48991632 | 46.4487 | 3.3e-7 | C 6.8e-14 | über den Umkehrpunkt | instabil | 3.051e+7 | 0.01073 | 42 | — |
| 0.362704374397 | 0.180456568810 | 61.59320716 | 34.4926 | 5.6e-8 | B3 2.5e-13 | über den Umkehrpunkt | instabil | 5.738e+6 | 0.2450 | 32 | — |
| 0.270981936817 | 0.116549078611 | 61.59855373 | 67.6939 | 9.7e-11 | B3 2.5e-13 | bestätigt | instabil | 4.65e+3 | 0.003165 | 60 | nur Klasse von I.A-25 |
| 0.223443347561 | 0.237719485557 | 61.61145643 | 58.6609 | 3.1e-7 | B3 2.2e-13 | über den Umkehrpunkt | instabil | 1.440e+8 | 0.07266 | 56 | — |
| 0.384625806544 | 0.042242568359 | 61.61618205 | 40.1324 | 6.7e-9 | B3 5.4e-14 | über den Umkehrpunkt | instabil | 1.963e+6 | 0.01411 | 36 | — |
| 0.150944137725 | 0.104750534149 | 61.78404645 | 94.8963 | 2.1e-8 | B3 7.8e-13 | über den Umkehrpunkt | instabil | 4.355e+5 | 6.1e-5 | 84 | — |
| 0.262773814300 | 0.161994690551 | 61.84205554 | 64.0383 | 2.0e-6 | C 8.1e-13 | über den Umkehrpunkt | instabil | 1.012e+9 | 0.03973 | 58 | — |
| 0.337811544322 | 0.120717770007 | 61.90310245 | 49.0731 | 1.9e-7 | B3 6.2e-13 | über den Umkehrpunkt | instabil | 7.991e+6 | 0.006461 | 44 | — |
| 0.070923529124 | 0.384063979402 | 61.97861805 | 39.2400 | 2.6e-7 | C 2.2e-12 | über den Umkehrpunkt | instabil | 4.014e+7 | 0.01337 | 30 | — |
| 0.334028763447 | 0.072422417910 | 61.99915605 | 54.3447 | 5.7e-10 | B3 3.8e-11 | an der Rechengrenze | offen | 203 | 3.7e-5 | 48 | — |
| 0.374636771846 | 0.097916311548 | 62.03548597 | 40.3173 | 2.7e-9 | B3 1.9e-13 | über den Umkehrpunkt | instabil | 4.095e+5 | 0.01734 | 36 | — |
| 0.125734905503 | 0.039826300066 | 62.06205989 | 104.2438 | 9.1e-9 | B3 5.7e-12 | über den Umkehrpunkt | instabil | 1.79e+4 | 6.2e-4 | 92 | — |
| 0.116138856055 | 0.075087968819 | 62.09272480 | 103.3385 | 2.1e-8 | B3 7.4e-12 | über den Umkehrpunkt | offen | 2.163e+6 | 5.9e-5 | 92 | — |
| 0.179725476783 | 0.188588917390 | 62.11867960 | 77.6752 | 3.6e-6 | C 5.3e-13 | über den Umkehrpunkt | offen | 4.703e+8 | 0.01363 | 70 | — |
| 0.188726504171 | 0.092286939031 | 62.12168955 | 89.8909 | 1.2e-6 | B3 1.2e-10 | an der Rechengrenze | offen | 7.444e+6 | 4.6e-5 | 80 | — |
| 0.276910105476 | 0.199701179923 | 62.31878020 | 54.7414 | 1.6e-6 | C 8.0e-13 | über den Umkehrpunkt | instabil | 3.663e+8 | 0.04387 | 50 | — |
| 0.281644371494 | 0.264046741559 | 62.34016340 | 40.8787 | 5.6e-6 | C 5.2e-13 | über den Umkehrpunkt | instabil | 2.140e+10 | 0.01655 | 38 | — |
| 0.121559811397 | 0.074318294881 | 62.35955608 | 103.1328 | 1.6e-6 | B3 1.1e-11 | an der Rechengrenze | offen | 1.180e+8 | 0.001138 | 92 | — |
| 0.278495307070 | 0.198042199337 | 62.42332144 | 54.7343 | 2.2e-7 | C 9.8e-14 | über den Umkehrpunkt | instabil | 1.059e+8 | 0.05052 | 50 | — |
| 0.124878871705 | 0.063539051672 | 62.44663772 | 103.6470 | 5.8e-9 | C 4.8e-12 | über den Umkehrpunkt | instabil | 2.95e+4 | 6.8e-4 | 94 | — |
| 0.263171370374 | 0.099704264259 | 62.45953484 | 72.4523 | 2.5e-10 | B3 4.5e-13 | über den Umkehrpunkt | instabil | 1.00e+4 | 6.1e-4 | 64 | — |
| 0.150474074394 | 0.272080102149 | 62.48812636 | 64.0552 | 1.4e-8 | B3 3.5e-12 | über den Umkehrpunkt | instabil | 5.400e+6 | 0.001072 | 52 | — |
| 0.252469506506 | 0.249250403707 | 62.57335048 | 50.8355 | 6.4e-10 | C 5.2e-13 | über den Umkehrpunkt | instabil | 8.98e+4 | 0.3247 | 42 | Satellit 7. Ordnung von I.B-1 (T* das 6.99984-fache) |
| 0.311026975668 | 0.151540552810 | 62.61722255 | 53.5962 | 1.6e-9 | B3 1.1e-13 | über den Umkehrpunkt | instabil | 1.509e+5 | 0.01345 | 48 | — |
| 0.208532337648 | 0.113379566465 | 62.62785515 | 84.2165 | 9.3e-6 | B3 5.5e-13 | über den Umkehrpunkt | offen | 3.144e+8 | 0.004373 | 76 | — |
| 0.184152821415 | 0.187669300875 | 62.62963335 | 77.6748 | 2.1e-7 | C 3.0e-12 | über den Umkehrpunkt | offen | 3.975e+8 | 0.003307 | 70 | — |
| 0.294659070531 | 0.170890727557 | 62.64472456 | 55.2673 | 7.6e-6 | C 1.0e-12 | über den Umkehrpunkt | instabil | 6.482e+8 | 0.01576 | 50 | — |
| 0.283786547503 | 0.190305490019 | 62.66900530 | 54.9630 | 4.4e-8 | C 3.2e-12 | über den Umkehrpunkt | instabil | 2.880e+6 | 0.01171 | 50 | — |
| 0.313339841919 | 0.178106429215 | 62.73108680 | 49.2017 | 1.3e-8 | B3 5.9e-14 | über den Umkehrpunkt | instabil | 7.591e+6 | 0.05984 | 44 | — |
| 0.156389003987 | 0.240194444895 | 62.73684970 | 71.3200 | 6.6e-8 | C 9.5e-14 | über den Umkehrpunkt | instabil | 4.471e+6 | 0.01701 | 60 | — |
| 0.047791248590 | 0.365188787710 | 62.83386524 | 46.8075 | 2.1e-9 | B3 3.3e-11 | an der Rechengrenze | instabil | 4.82e+4 | 0.008023 | 36 | — |
| 0.001134565501 | 0.316369717342 | 62.91780817 | 62.8748 | 4.2e-6 | C 4.9e-10 | an der Rechengrenze | offen | 2.545e+9 | 1.0e-5 | 44 | — |
| 0.112403766276 | 0.090755497468 | 62.99151441 | 103.8590 | 7.4e-6 | B3 7.4e-13 | über den Umkehrpunkt | offen | 2.348e+9 | 4.7e-5 | 92 | — |
| 0.305483058509 | 0.191806331498 | 63.01237573 | 49.3326 | 7.9e-7 | B3 6.3e-13 | über den Umkehrpunkt | instabil | 2.883e+8 | 0.05406 | 44 | — |
| 0.319403630247 | 0.229205625953 | 63.01349244 | 39.0788 | 9.4e-7 | R 6.8e-12 | über den Umkehrpunkt | offen | 6.727e+5 | 6.7e-5 | 0 | — |
| 0.313676523380 | 0.105172108196 | 63.01739656 | 58.6023 | 9.3e-11 | B3 5.8e-13 | bestätigt | offen | 1.00 | 8.3e-4 | 52 | nur Klasse von II.A-4 |
| 0.310914990604 | 0.207020714179 | 63.03899653 | 45.3078 | 1.9e-10 | B3 3.2e-13 | über den Umkehrpunkt | instabil | 1.28e+4 | 0.06430 | 40 | Satellit 5. Ordnung von I.A-2 (T* das 4.99903-fache) |
| 0.152796095424 | 0.118668461591 | 63.08196173 | 94.8922 | 2.8e-8 | B3 3.2e-12 | über den Umkehrpunkt | instabil | 3.341e+5 | 4.3e-4 | 84 | — |
| 0.121898994936 | 0.043045064182 | 63.12076156 | 106.4067 | 1.1e-9 | C 3.1e-11 | an der Rechengrenze | instabil | 4.88e+3 | 3.9e-4 | 94 | — |
| 0.247726011458 | 0.240802234893 | 63.23446573 | 54.2815 | 1.4e-11 | C 2.7e-13 | bestätigt | instabil | 54.9 | 0.02304 | 46 | nur Klasse von II.B-1 |
| 0.378361249954 | 0.190099268284 | 63.24692443 | 29.6539 | 8.4e-11 | B3 7.5e-14 | bestätigt | instabil | 5.80e+4 | 0.2636 | 28 | — |
| 0.394224815196 | 0.197671635781 | 63.26075912 | 24.2408 | 4.8e-12 | B3 4.7e-14 | bestätigt | instabil | 17.1 | 0.2761 | 24 | — |
| 0.177730957882 | 0.273047573766 | 63.28112797 | 60.3880 | 2.8e-7 | R 1.9e-12 | über den Umkehrpunkt | offen | 2.140e+7 | 2.8e-4 | 0 | — |
| 0.386118152715 | 0.088892281973 | 63.28672932 | 38.2667 | 2.1e-7 | C 9.6e-11 | an der Rechengrenze | offen | 1.289e+6 | 1.4e-5 | 34 | — |
| 0.159259407234 | 0.113187161673 | 63.35537227 | 94.8976 | 2.3e-8 | B3 2.6e-12 | über den Umkehrpunkt | offen | 9.30e+4 | 1.3e-4 | 84 | — |
| 0.292434028236 | 0.185539689816 | 63.46308119 | 54.2116 | 7.5e-9 | B3 2.4e-11 | an der Rechengrenze | instabil | 5.59e+4 | 8.1e-4 | 48 | — |
| 0.065853862770 | 0.194770531877 | 63.48074505 | 92.8621 | 1.1e-6 | C 5.8e-14 | über den Umkehrpunkt | instabil | 3.489e+7 | 0.03114 | 102 | — |
| 0.085582002786 | 0.023210554303 | 63.51870718 | 112.1338 | 2.7e-7 | B3 6.1e-12 | über den Umkehrpunkt | offen | 6.129e+7 | 0.001391 | 100 | — |
| 0.041305973017 | 0.309932387023 | 63.53633385 | 64.6047 | 4.8e-9 | C 1.5e-12 | über den Umkehrpunkt | instabil | 2.590e+5 | 0.003220 | 48 | — |
| 0.007547583634 | 0.279983325297 | 63.67825920 | 74.2439 | 2.1e-6 | R 2.1e-12 | über den Umkehrpunkt | offen | 1.189e+9 | 8.2e-4 | 0 | — |
| 0.071209097692 | 0.277695287896 | 63.68172250 | 72.3769 | 6.5e-7 | R 4.1e-13 | über den Umkehrpunkt | offen | 1.247e+7 | 0.001557 | 0 | — |
| 0.233754047743 | 0.101220452536 | 63.71363572 | 81.2089 | 1.0e-7 | B3 1.9e-12 | über den Umkehrpunkt | instabil | 5.491e+5 | 0.004218 | 72 | — |
| 0.316394080846 | 0.220538835983 | 63.74713229 | 41.9267 | 1.3e-6 | C 9.8e-13 | über den Umkehrpunkt | offen | 3.438e+7 | 5.8e-4 | 40 | — |
| 0.171351887659 | 0.026250519167 | 63.76066972 | 99.9842 | 2.3e-9 | B3 2.0e-11 | an der Rechengrenze | offen | 16.5 | 5.8e-6 | 88 | — |
| 0.257671348823 | 0.232309387575 | 63.76202634 | 54.2767 | 4.1e-11 | C 1.3e-13 | bestätigt | instabil | 1.94e+4 | 0.04762 | 46 | nur Klasse von II.B-1 |
| 0.157499658216 | 0.258993930330 | 63.90761653 | 67.8369 | 3.5e-6 | B3 2.7e-13 | über den Umkehrpunkt | instabil | 1.020e+10 | 0.07323 | 60 | — |
| 0.251390307188 | 0.115493448751 | 63.91629662 | 75.4881 | 8.3e-7 | B3 2.4e-12 | über den Umkehrpunkt | offen | 2.083e+7 | 5.2e-6 | 68 | — |
| 0.218282722227 | 0.097269162162 | 63.92111586 | 85.5495 | 2.6e-6 | B3 1.5e-11 | an der Rechengrenze | offen | 2.935e+5 | 9.0e-4 | 76 | — |
| 0.184988810091 | 0.114860545714 | 63.99094455 | 90.8213 | 3.6e-7 | C 9.9e-11 | an der Rechengrenze | instabil | 4.09e+4 | 2.1e-4 | 82 | — |
| 0.040008361458 | 0.172656796288 | 64.05833354 | 99.6926 | 3.4e-7 | C 1.1e-13 | über den Umkehrpunkt | instabil | 3.795e+7 | 0.003459 | 110 | — |
| 0.156088195614 | 0.057489023198 | 64.13365507 | 101.9032 | 4.6e-9 | C 3.3e-11 | an der Rechengrenze | offen | 3.68e+3 | 1.7e-4 | 90 | — |
| 0.379047340830 | 0.101997510379 | 64.20311639 | 40.0112 | 3.2e-7 | R 2.4e-12 | über den Umkehrpunkt | offen | 4.399e+9 | 4.2e-4 | 0 | — |
| 0.332383872343 | 0.077515607403 | 64.29853576 | 56.5137 | 2.3e-11 | C 2.1e-12 | bestätigt | instabil | 187 | 0.01126 | 50 | — |
| 0.120401199811 | 0.044061016776 | 64.31424174 | 108.5762 | 8.3e-8 | B3 2.8e-12 | über den Umkehrpunkt | instabil | 8.995e+5 | 9.6e-4 | 96 | — |
| 0.030723161525 | 0.266450877471 | 64.32062499 | 78.3211 | 6.6e-6 | C 2.9e-13 | über den Umkehrpunkt | instabil | 3.962e+10 | 0.01908 | 70 | — |
| 0.180352288190 | 0.100711315624 | 64.32572425 | 93.8806 | 8.5e-6 | B3 3.6e-10 | an der Rechengrenze | offen | 2.631e+6 | 2.1e-4 | 84 | — |
| 0.146198811711 | 0.056469431190 | 64.39821116 | 104.0789 | 2.7e-7 | B3 4.0e-12 | über den Umkehrpunkt | offen | 6.886e+5 | 1.6e-4 | 92 | — |
| 0.317229261779 | 0.252930788045 | 64.40203413 | 35.8709 | 1.2e-10 | B3 2.0e-14 | über den Umkehrpunkt | instabil | 2.86e+4 | 0.01327 | 32 | — |
| 0.200724415439 | 0.111334197546 | 64.41183473 | 88.5717 | 5.2e-8 | B3 4.9e-12 | über den Umkehrpunkt | offen | 2.713e+5 | 4.7e-4 | 80 | — |
| 0.392706296459 | 0.129835138017 | 64.42795758 | 33.3452 | 2.6e-6 | C 2.4e-12 | über den Umkehrpunkt | offen | 1.991e+8 | 0.005434 | 30 | Satellit 3. Ordnung von Fund (0.246507, 0.159243) (T* das 2.99091-fache, Wort bis auf 4 Buchstaben) |
| 0.277677550298 | 0.198884632119 | 64.42922205 | 56.5489 | 1.6e-7 | B3 1.5e-13 | über den Umkehrpunkt | instabil | 4.299e+7 | 0.04725 | 52 | — |
| 0.353640779848 | 0.084873334895 | 64.43766741 | 49.4913 | 7.7e-7 | B3 2.3e-12 | über den Umkehrpunkt | offen | 7.219e+6 | 4.1e-4 | 44 | — |
| 0.090501641577 | 0.053746828809 | 64.46912470 | 111.9373 | 4.4e-7 | B3 2.3e-12 | über den Umkehrpunkt | instabil | 1.489e+7 | 0.002459 | 100 | — |
| 0.074628134983 | 0.198360390428 | 64.47201738 | 92.8647 | 2.4e-7 | C 7.8e-14 | über den Umkehrpunkt | instabil | 4.778e+7 | 0.04889 | 102 | — |
| 0.189043270066 | 0.120612181099 | 64.51115272 | 90.0031 | 4.3e-8 | B3 3.8e-12 | über den Umkehrpunkt | offen | 9.63e+4 | 0.001256 | 80 | — |
| 0.152982262558 | 0.102630025959 | 64.57971536 | 99.0898 | 4.4e-6 | B3 1.9e-11 | an der Rechengrenze | offen | 7.585e+7 | 0.001715 | 88 | — |
| 0.294740031528 | 0.321064516294 | 64.58712733 | 26.3610 | 1.1e-13 | C 4.2e-15 | bestätigt | instabil | 5.75e+3 | 0.2563 | 26 | — |
| 0.268319323287 | 0.195647186727 | 64.62324177 | 59.7086 | 4.4e-7 | B3 1.0e-12 | über den Umkehrpunkt | instabil | 2.688e+7 | 0.04027 | 52 | — |
| 0.329132201363 | 0.155854512477 | 64.68121772 | 49.5215 | 4.2e-8 | B3 7.6e-14 | über den Umkehrpunkt | instabil | 7.662e+6 | 0.04011 | 44 | — |
| 0.217192967869 | 0.114297187014 | 64.69362827 | 84.9162 | 1.7e-7 | C 2.7e-12 | über den Umkehrpunkt | instabil | 5.728e+6 | 0.009313 | 78 | — |
| 0.421316522340 | 0.102126464033 | 64.69802922 | 27.1354 | 3.8e-9 | C 9.2e-14 | über den Umkehrpunkt | instabil | 1.103e+6 | 0.08014 | 24 | — |
| 0.218563162527 | 0.239795933561 | 64.70062547 | 62.1593 | 7.7e-7 | B3 8.3e-14 | über den Umkehrpunkt | instabil | 6.038e+8 | 0.09788 | 60 | — |
| 0.376629067125 | 0.160022924534 | 64.73157852 | 34.9227 | 7.9e-10 | B3 8.9e-14 | über den Umkehrpunkt | instabil | 6.02e+4 | 0.005695 | 32 | — |
| 0.019809900961 | 0.172309849766 | 64.73551542 | 101.4945 | 1.1e-6 | B3 4.0e-14 | über den Umkehrpunkt | instabil | 9.412e+9 | 0.01900 | 112 | — |
| 0.147445593804 | 0.112408831428 | 64.75554065 | 99.1136 | 4.6e-11 | B3 2.5e-13 | bestätigt | instabil | 301 | 0.001391 | 88 | — |
| 0.345872916435 | 0.166479604386 | 64.81770236 | 43.2237 | 1.9e-6 | C 2.5e-13 | über den Umkehrpunkt | instabil | 6.929e+7 | 0.2143 | 38 | — |
| 0.063439147544 | 0.329785285384 | 64.86009218 | 58.7423 | 2.5e-7 | B3 7.5e-11 | an der Rechengrenze | instabil | 2.943e+7 | 0.02380 | 44 | — |
| 0.140778069877 | 0.086209712557 | 64.88571104 | 103.3356 | 8.6e-6 | B3 4.2e-11 | an der Rechengrenze | offen | 3.075e+7 | 1.2e-4 | 92 | — |
| 0.358894113402 | 0.077959052016 | 64.88877625 | 48.6759 | 7.8e-7 | B3 2.8e-13 | über den Umkehrpunkt | instabil | 1.731e+8 | 0.03236 | 44 | — |
| 0.223560701150 | 0.098699657072 | 64.96649962 | 85.5496 | 3.4e-9 | B3 1.1e-12 | über den Umkehrpunkt | instabil | 55.0 | 6.3e-4 | 76 | — |
| 0.164851171832 | 0.247170864309 | 65.08356962 | 70.8928 | 8.1e-6 | R 9.5e-14 | über den Umkehrpunkt | instabil | 4.897e+9 | 0.02911 | 0 | — |
| 0.165365949673 | 0.086934574082 | 65.10067916 | 99.3451 | 8.5e-6 | C 1.2e-11 | an der Rechengrenze | offen | 3.456e+6 | 0.001028 | 90 | — |
| 0.255646331854 | 0.106615089333 | 65.13697746 | 76.8337 | 5.6e-9 | B3 2.7e-11 | an der Rechengrenze | offen | 1.66e+4 | 1.7e-5 | 68 | — |
| 0.244845880168 | 0.171618056010 | 65.25548202 | 70.5103 | 4.4e-7 | B3 1.1e-13 | über den Umkehrpunkt | instabil | 2.372e+8 | 0.08903 | 64 | — |
| 0.332543411985 | 0.088542433558 | 65.25795425 | 56.4512 | 1.1e-10 | C 1.7e-12 | über den Umkehrpunkt | instabil | 56.2 | 0.004712 | 50 | — |
| 0.059899471932 | 0.295016802171 | 65.29726161 | 69.9429 | 6.6e-7 | B3 2.6e-12 | über den Umkehrpunkt | instabil | 1.352e+8 | 0.04017 | 56 | — |
| 0.224836362641 | 0.131286357685 | 65.35335447 | 81.7620 | 9.0e-6 | C 7.4e-13 | über den Umkehrpunkt | instabil | 1.064e+9 | 0.03123 | 74 | — |
| 0.276794968381 | 0.119749687056 | 65.35648765 | 69.8396 | 3.5e-9 | C 3.7e-11 | an der Rechengrenze | offen | 7.82e+3 | 1.1e-4 | 62 | — |
| 0.339334059886 | 0.200448555343 | 65.40629567 | 40.2397 | 1.8e-10 | C 5.1e-14 | über den Umkehrpunkt | instabil | 4.145e+5 | 0.1520 | 38 | — |
| 0.073621356963 | 0.197665293996 | 65.46015048 | 94.5235 | 1.8e-7 | B3 4.8e-14 | über den Umkehrpunkt | instabil | 9.441e+7 | 0.04535 | 104 | — |
| 0.206704556630 | 0.113759160423 | 65.59519085 | 88.5723 | 1.7e-8 | B3 2.4e-12 | über den Umkehrpunkt | instabil | 4.99e+4 | 0.002051 | 80 | — |
| 0.228803074040 | 0.116337467796 | 65.60645372 | 83.0892 | 5.4e-6 | C 2.9e-13 | über den Umkehrpunkt | offen | 3.240e+9 | 0.002386 | 74 | — |
| 0.179843915878 | 0.099439452778 | 65.62960411 | 96.0281 | 3.0e-7 | C 3.2e-11 | an der Rechengrenze | offen | 5.802e+6 | 2.8e-4 | 86 | — |
| 0.120647571525 | 0.045778520517 | 65.66530954 | 110.7318 | 6.7e-7 | C 6.9e-10 | an der Rechengrenze | offen | 7.607e+5 | 0.001043 | 98 | — |
| 0.065276703223 | 0.194703172903 | 65.70906433 | 96.1788 | 2.4e-7 | C 3.2e-13 | über den Umkehrpunkt | instabil | 3.921e+7 | 0.03074 | 106 | — |
| 0.222770222404 | 0.305710969295 | 65.71759684 | 45.6699 | 8.5e-10 | C 1.5e-11 | an der Rechengrenze | instabil | 2.10e+4 | 0.002022 | 34 | — |
| 0.223770475489 | 0.186367066563 | 65.74833432 | 73.3813 | 2.8e-6 | C 9.4e-12 | über den Umkehrpunkt | instabil | 4.015e+9 | 0.01486 | 66 | — |
| 0.259850703276 | 0.229756333865 | 65.79667002 | 56.0329 | 5.9e-10 | B3 1.3e-12 | über den Umkehrpunkt | instabil | 3.27e+3 | 0.02949 | 48 | nur Klasse von II.A-3 |
| 0.299880850396 | 0.221533964606 | 65.80910365 | 47.5287 | 1.4e-7 | C 2.2e-13 | über den Umkehrpunkt | instabil | 9.437e+6 | 0.004285 | 42 | — |
| 0.300615706363 | 0.237465169070 | 65.89772012 | 44.1963 | 2.6e-9 | C 4.3e-13 | über den Umkehrpunkt | instabil | 2.168e+6 | 0.03849 | 42 | — |
| 0.363653751791 | 0.187374583144 | 65.94791811 | 35.6206 | 3.0e-8 | R 5.5e-14 | über den Umkehrpunkt | instabil | 2.434e+6 | 0.005166 | 0 | — |
| 0.214460544445 | 0.241281700167 | 65.97498452 | 63.9027 | 5.1e-6 | C 5.8e-14 | über den Umkehrpunkt | instabil | 9.526e+9 | 0.07556 | 62 | — |
| 0.279676935090 | 0.204720643175 | 66.07769070 | 56.3571 | 2.9e-6 | B3 2.5e-13 | über den Umkehrpunkt | instabil | 1.032e+9 | 0.01922 | 48 | — |
| 0.275012816672 | 0.200729020857 | 66.07999245 | 58.3472 | 6.9e-8 | C 4.6e-14 | über den Umkehrpunkt | instabil | 9.894e+8 | 0.04120 | 54 | — |
| 0.206705100508 | 0.251173252806 | 66.10274863 | 63.2409 | 6.3e-7 | C 3.2e-12 | über den Umkehrpunkt | offen | 3.812e+7 | 4.3e-4 | 56 | — |
| 0.056086524249 | 0.316453616997 | 66.22473689 | 64.5981 | 3.0e-10 | C 1.0e-11 | über den Umkehrpunkt | instabil | 3.14e+3 | 5.7e-4 | 48 | — |
| 0.299787851381 | 0.130480407452 | 66.39504030 | 62.9899 | 2.9e-7 | C 3.0e-13 | über den Umkehrpunkt | instabil | 3.390e+6 | 0.006851 | 56 | — |
| 0.244940960666 | 0.318663719777 | 66.50384130 | 38.3068 | 5.5e-8 | C 2.0e-13 | über den Umkehrpunkt | instabil | 2.627e+7 | 0.2236 | 34 | — |
| 0.177203112610 | 0.096801858440 | 66.52520096 | 98.1669 | 9.6e-8 | B3 5.3e-12 | über den Umkehrpunkt | instabil | 8.60e+4 | 5.6e-4 | 88 | — |
| 0.194740573666 | 0.095815175853 | 66.54033084 | 94.6132 | 4.0e-7 | B3 6.6e-11 | an der Rechengrenze | offen | 7.42e+3 | 3.2e-5 | 84 | — |
| 0.223553305690 | 0.129109060577 | 66.54280277 | 83.8651 | 3.2e-7 | B3 6.3e-13 | über den Umkehrpunkt | instabil | 1.008e+7 | 0.02170 | 76 | — |
| 0.116574284726 | 0.043962676940 | 66.55231178 | 112.8991 | 1.4e-7 | B3 1.7e-11 | an der Rechengrenze | offen | 8.591e+6 | 2.3e-4 | 100 | — |
| 0.259119168651 | 0.114829188658 | 66.69707867 | 76.7755 | 3.8e-7 | B3 7.6e-13 | über den Umkehrpunkt | instabil | 1.515e+8 | 0.002681 | 68 | — |
| 0.371902980498 | 0.095314712202 | 66.71111084 | 44.4630 | 1.5e-7 | B3 1.2e-11 | an der Rechengrenze | instabil | 6.370e+5 | 0.002643 | 40 | — |
| 0.074101688425 | 0.198321477502 | 66.73791734 | 96.1814 | 1.1e-8 | C 3.8e-13 | über den Umkehrpunkt | instabil | 5.729e+7 | 0.04852 | 106 | — |
| 0.283223360200 | 0.191095022420 | 66.75847490 | 58.5583 | 4.0e-8 | C 1.7e-13 | über den Umkehrpunkt | instabil | 5.737e+6 | 0.01051 | 54 | — |
| 0.164958416249 | 0.062094608083 | 66.76905410 | 104.1109 | 3.4e-10 | B3 1.6e-12 | über den Umkehrpunkt | instabil | 5.69e+3 | 8.6e-4 | 92 | — |
| 0.169588823282 | 0.278288992163 | 66.77546510 | 63.6921 | 2.4e-9 | C 3.1e-14 | über den Umkehrpunkt | instabil | 4.119e+5 | 0.02547 | 50 | — |
| 0.146378376223 | 0.066302531460 | 66.79789770 | 107.2174 | 3.3e-6 | B3 8.3e-12 | über den Umkehrpunkt | offen | 8.482e+7 | 8.6e-4 | 96 | — |
| 0.161141772851 | 0.271329466002 | 66.88303697 | 67.0906 | 4.0e-8 | C 5.0e-12 | über den Umkehrpunkt | offen | 7.980e+6 | 2.1e-4 | 52 | — |
| 0.341423978219 | 0.142281850572 | 66.91164530 | 49.3150 | 1.5e-9 | B3 1.2e-12 | über den Umkehrpunkt | instabil | 736 | 9.6e-4 | 44 | — |
| 0.121527763591 | 0.033471926601 | 66.99860233 | 113.4363 | 1.7e-9 | B3 7.1e-12 | über den Umkehrpunkt | instabil | 2.19e+4 | 1.1e-4 | 100 | — |
| 0.332240056157 | 0.081559836628 | 67.05785765 | 58.6753 | 1.5e-10 | B3 1.9e-13 | über den Umkehrpunkt | instabil | 6.98e+3 | 0.01587 | 52 | — |
| 0.275931313877 | 0.134636179477 | 67.05982238 | 69.9648 | 3.6e-6 | C 6.8e-10 | an der Rechengrenze | offen | 1.065e+7 | 6.4e-4 | 62 | — |
| 0.137815489950 | 0.062090398098 | 67.07341056 | 109.4162 | 2.8e-6 | C 3.0e-11 | an der Rechengrenze | offen | 1.921e+7 | 0.001556 | 98 | — |
| 0.305655544699 | 0.098375555791 | 67.09859552 | 65.5431 | 2.7e-10 | C 4.7e-11 | an der Rechengrenze | offen | 1.38 | 5.4e-4 | 58 | nur Klasse von I.B-28 |
| 0.162663766461 | 0.087876769386 | 67.11522013 | 102.8379 | 5.0e-6 | B3 1.4e-11 | an der Rechengrenze | offen | 1.667e+6 | 2.4e-4 | 92 | — |
| 0.218526050448 | 0.096253836828 | 67.11801176 | 89.8781 | 2.8e-7 | B3 2.7e-11 | an der Rechengrenze | offen | 8.88e+4 | 4.7e-5 | 80 | — |
| 0.350430699330 | 0.161445018784 | 67.14295288 | 44.1060 | 1.1e-6 | B3 1.5e-13 | über den Umkehrpunkt | instabil | 5.847e+8 | 0.2019 | 40 | — |
| 0.294306311237 | 0.139021028652 | 67.14465631 | 64.1742 | 8.9e-6 | C 3.8e-13 | über den Umkehrpunkt | instabil | 4.850e+8 | 0.07649 | 58 | — |
| 0.164105422567 | 0.118546656327 | 67.24941441 | 99.1137 | 1.9e-9 | B3 1.5e-12 | über den Umkehrpunkt | instabil | 5.82e+4 | 5.2e-4 | 88 | — |
| 0.360702886541 | 0.062442198423 | 67.29581324 | 50.8842 | 1.5e-9 | C 1.6e-13 | über den Umkehrpunkt | offen | 4.297e+5 | 0.01695 | 46 | — |
| 0.044569249043 | 0.379086865364 | 67.37708594 | 45.6609 | 4.8e-6 | B3 3.3e-12 | über den Umkehrpunkt | offen | 1.073e+8 | 0.005527 | 36 | — |
| 0.156872871188 | 0.098369926750 | 67.48069868 | 103.3372 | 2.0e-8 | B3 4.1e-12 | über den Umkehrpunkt | instabil | 2.410e+5 | 0.002220 | 92 | — |
| 0.095350577485 | 0.006816565954 | 67.48867160 | 118.3630 | 8.7e-7 | B3 9.1e-12 | über den Umkehrpunkt | offen | 1.001e+6 | 5.0e-5 | 104 | — |
| 0.259434660756 | 0.253325754504 | 67.56915883 | 52.2612 | 7.5e-9 | C 4.8e-14 | über den Umkehrpunkt | instabil | 1.738e+6 | 0.06507 | 42 | — |
| 0.229200382462 | 0.120621751013 | 67.58980550 | 84.9453 | 3.2e-6 | B3 1.5e-12 | über den Umkehrpunkt | instabil | 1.842e+7 | 3.0e-4 | 76 | — |
| 0.330215409059 | 0.095951280181 | 67.64609959 | 58.6021 | 5.7e-11 | B3 7.3e-13 | bestätigt | instabil | 22.8 | 0.003751 | 52 | nur Klasse von II.A-4 |
| 0.102254312616 | 0.040272032234 | 67.66745463 | 116.8820 | 1.8e-7 | B3 1.9e-12 | über den Umkehrpunkt | offen | 1.065e+6 | 0.003683 | 104 | — |
| 0.257436154739 | 0.109576664443 | 67.67931592 | 78.9982 | 5.6e-7 | C 2.1e-10 | an der Rechengrenze | offen | 3.884e+6 | 3.5e-4 | 70 | — |
| 0.073122660379 | 0.197629694840 | 67.72072982 | 97.8378 | 2.6e-7 | B3 5.1e-14 | über den Umkehrpunkt | instabil | 1.123e+8 | 0.04502 | 108 | — |
| 0.175402292882 | 0.048870721306 | 67.74685230 | 104.4082 | 6.2e-10 | B3 6.6e-12 | über den Umkehrpunkt | offen | 5.39 | 6.6e-5 | 92 | — |
| 0.319839967759 | 0.108564449736 | 67.76655528 | 60.7360 | 1.6e-7 | C 5.0e-12 | über den Umkehrpunkt | offen | 2.259e+6 | 5.8e-4 | 54 | — |
| 0.389380115738 | 0.035993682362 | 67.78269995 | 42.7502 | 1.9e-7 | C 7.3e-13 | über den Umkehrpunkt | instabil | 8.762e+6 | 0.01024 | 38 | — |
| 0.263171779135 | 0.241582220826 | 67.83371542 | 54.2782 | 4.0e-10 | C 4.1e-13 | über den Umkehrpunkt | instabil | 7.01e+3 | 0.01652 | 46 | nur Klasse von II.B-1 |
| 0.160356136710 | 0.097705888060 | 67.85253470 | 103.3354 | 4.3e-6 | B3 8.9e-12 | über den Umkehrpunkt | offen | 6.294e+6 | 2.0e-5 | 92 | — |
| 0.311096875633 | 0.251429257946 | 67.86095602 | 39.7445 | 2.5e-11 | B3 1.7e-14 | bestätigt | instabil | 1.15e+4 | 0.06306 | 36 | Satellit 3. Ordnung von I.A-3 (T* das 3.03514-fache, Wort bis auf 4 Buchstaben) |
| 0.064744433472 | 0.194640631050 | 67.93478314 | 99.4908 | 8.9e-7 | C 5.1e-14 | über den Umkehrpunkt | instabil | 4.374e+7 | 0.03038 | 110 | — |
| 0.300770287755 | 0.177393364728 | 67.96560818 | 57.0987 | 3.0e-9 | C 1.1e-11 | an der Rechengrenze | instabil | 2.99e+4 | 3.8e-4 | 50 | — |
| 0.105156892832 | 0.008503270704 | 68.19074247 | 118.3678 | 3.5e-6 | B3 6.8e-10 | an der Rechengrenze | offen | 1.996e+5 | 7.0e-6 | 104 | — |
| 0.310111837085 | 0.227897346858 | 68.20642338 | 45.1428 | 4.5e-6 | C 1.7e-12 | über den Umkehrpunkt | offen | 1.236e+7 | 4.3e-4 | 44 | — |
| 0.166645573823 | 0.345101860422 | 68.26793348 | 45.7382 | 2.3e-9 | C 5.8e-12 | über den Umkehrpunkt | instabil | 3.792e+5 | 0.02143 | 34 | — |
| 0.261964291640 | 0.267701165096 | 68.33607611 | 48.7648 | 7.3e-7 | C 3.5e-13 | über den Umkehrpunkt | instabil | 4.767e+8 | 0.02970 | 10 | nur Klasse von I.B-2 |
| 0.251089734221 | 0.203788150786 | 68.44327407 | 66.1080 | 4.1e-6 | C 3.3e-13 | über den Umkehrpunkt | instabil | 5.260e+9 | 0.05691 | 62 | — |
| 0.371380108738 | 0.112477233168 | 68.44524397 | 44.2014 | 5.9e-7 | C 6.8e-14 | über den Umkehrpunkt | instabil | 2.710e+8 | 0.03581 | 40 | — |
| 0.304337954704 | 0.215888947234 | 68.44963593 | 49.3327 | 9.6e-10 | B3 8.9e-14 | über den Umkehrpunkt | instabil | 5.66e+4 | 0.04011 | 44 | — |
| 0.302576514310 | 0.198769587209 | 68.48015424 | 53.1632 | 1.6e-7 | C 4.3e-13 | über den Umkehrpunkt | instabil | 1.444e+7 | 0.03727 | 46 | — |
| 0.200196514759 | 0.327559296523 | 68.50862790 | 45.6714 | 4.5e-10 | C 7.6e-11 | an der Rechengrenze | instabil | 2.57e+4 | 0.001400 | 34 | — |
| 0.177331916433 | 0.279398022682 | 68.52135013 | 63.6927 | 3.8e-10 | C 1.3e-13 | über den Umkehrpunkt | instabil | 1.86e+4 | 0.02211 | 50 | — |
| 0.341542802235 | 0.222632240407 | 68.63081616 | 37.5472 | 7.4e-12 | C 3.8e-14 | bestätigt | instabil | 28.5 | 0.03790 | 34 | — |
| 0.111029966577 | 0.011431846434 | 68.66323534 | 118.3669 | 3.1e-6 | B3 6.6e-11 | an der Rechengrenze | offen | 2.50e+4 | 1.3e-5 | 104 | — |
| 0.299475362898 | 0.206653310505 | 68.87211212 | 52.8377 | 3.6e-7 | C 4.3e-13 | über den Umkehrpunkt | instabil | 5.239e+7 | 0.009290 | 46 | — |
| 0.322956357456 | 0.134504910643 | 68.90278784 | 57.6613 | 1.1e-8 | B3 3.8e-13 | über den Umkehrpunkt | instabil | 5.973e+5 | 0.04095 | 52 | — |
| 0.325590523793 | 0.214458548549 | 68.94809359 | 43.8897 | 1.6e-10 | C 4.5e-14 | über den Umkehrpunkt | instabil | 111 | 0.1494 | 42 | — |
| 0.073614822688 | 0.198284848280 | 69.00096126 | 99.4934 | 1.3e-7 | C 4.6e-14 | über den Umkehrpunkt | instabil | 6.808e+7 | 0.04817 | 110 | — |
| 0.287979575803 | 0.148433959083 | 69.01416607 | 66.4603 | 4.7e-7 | B3 5.1e-13 | über den Umkehrpunkt | offen | 2.940e+8 | 0.008442 | 60 | — |
| 0.113327287139 | 0.040364478857 | 69.03794130 | 117.7647 | 4.2e-7 | B3 2.7e-10 | an der Rechengrenze | offen | 4.757e+5 | 6.6e-5 | 104 | — |
| 0.325684262061 | 0.196895615020 | 69.07030455 | 47.1980 | 2.4e-9 | C 4.4e-13 | über den Umkehrpunkt | instabil | 4.15e+4 | 0.03222 | 42 | — |
| 0.150700725109 | 0.282302137334 | 69.09174492 | 67.8492 | 5.9e-6 | R 9.1e-13 | über den Umkehrpunkt | offen | 3.232e+8 | 9.5e-4 | 0 | — |
| 0.347986598798 | 0.162655802730 | 69.19584198 | 46.0489 | 5.9e-6 | C 4.9e-14 | über den Umkehrpunkt | instabil | 4.325e+9 | 0.1189 | 42 | — |
| 0.038725526461 | 0.260646495763 | 69.19897368 | 85.6527 | 1.6e-8 | C 9.5e-14 | über den Umkehrpunkt | instabil | 1.857e+7 | 0.03944 | 90 | — |
| 0.357766591240 | 0.067338519088 | 69.21292557 | 53.0325 | 3.3e-10 | B3 5.0e-14 | über den Umkehrpunkt | instabil | 506 | 0.03574 | 48 | — |
| 0.212252714526 | 0.242187422507 | 69.27800071 | 67.3614 | 1.7e-6 | C 1.2e-13 | über den Umkehrpunkt | instabil | 2.879e+9 | 0.07645 | 66 | — |
| 0.182985025944 | 0.128441305150 | 69.39464545 | 96.9932 | 5.0e-8 | C 1.3e-11 | an der Rechengrenze | offen | 1.89e+4 | 4.6e-4 | 86 | — |
| 0.239327035057 | 0.205864977715 | 69.46834409 | 69.6467 | 1.2e-6 | C 2.7e-13 | über den Umkehrpunkt | offen | 7.018e+8 | 0.01156 | 66 | — |
| 0.224214261841 | 0.108249079000 | 69.55979962 | 90.3039 | 1.4e-6 | B3 2.9e-10 | an der Rechengrenze | offen | 4.336e+6 | 6.3e-6 | 80 | — |
| 0.237274119491 | 0.263877276567 | 69.57443928 | 56.4924 | 4.6e-7 | R 7.7e-12 | über den Umkehrpunkt | offen | 4.894e+5 | 1.3e-4 | 0 | — |
| 0.286494638520 | 0.170208733400 | 69.77350574 | 64.0716 | 2.6e-6 | B3 1.8e-13 | über den Umkehrpunkt | offen | 7.618e+9 | 0.02153 | 56 | — |
| 0.178813917303 | 0.152104805575 | 69.78250332 | 94.5491 | 7.2e-6 | B3 3.2e-12 | über den Umkehrpunkt | offen | 4.752e+8 | 2.6e-4 | 84 | — |
| 0.184076975651 | 0.296386649025 | 69.89162493 | 58.8166 | 1.1e-7 | B3 3.8e-10 | an der Rechengrenze | instabil | 5.627e+6 | 0.009373 | 44 | — |
| 0.211372446046 | 0.264574882473 | 69.92097964 | 62.3666 | 5.9e-9 | C 1.5e-12 | über den Umkehrpunkt | instabil | 6.214e+6 | 0.01432 | 50 | — |
| 0.358914613199 | 0.086571432218 | 70.02293979 | 51.8455 | 2.3e-8 | C 4.8e-12 | über den Umkehrpunkt | offen | 2.783e+5 | 1.3e-4 | 46 | — |
| 0.278691698492 | 0.297460068689 | 70.10894307 | 38.3838 | 1.5e-8 | R 9.9e-14 | über den Umkehrpunkt | instabil | 1.072e+6 | 0.005465 | 0 | — |
| 0.148515351672 | 0.060148270986 | 70.23680349 | 112.8285 | 1.8e-6 | B3 3.3e-12 | über den Umkehrpunkt | offen | 2.889e+7 | 9.6e-4 | 100 | — |
| 0.154407060695 | 0.102265292855 | 70.24638194 | 107.5640 | 5.2e-7 | B3 1.6e-11 | an der Rechengrenze | offen | 3.243e+5 | 6.3e-5 | 96 | — |
| 0.281670655654 | 0.155965665768 | 70.40478804 | 68.4791 | 2.8e-6 | C 2.7e-13 | über den Umkehrpunkt | instabil | 2.624e+9 | 0.09414 | 62 | — |
| 0.349362706754 | 0.141532739153 | 70.42466620 | 49.4096 | 1.6e-6 | B3 1.3e-13 | über den Umkehrpunkt | offen | 4.654e+8 | 0.003898 | 44 | — |
| 0.326849222076 | 0.109792562754 | 70.46389785 | 60.7231 | 8.5e-6 | C 7.1e-12 | über den Umkehrpunkt | offen | 2.001e+9 | 4.2e-4 | 54 | — |
| 0.209421057708 | 0.277743894828 | 70.53378377 | 59.7222 | 2.7e-8 | C 3.1e-11 | an der Rechengrenze | instabil | 4.399e+6 | 0.001022 | 46 | — |
| 0.326490924399 | 0.136646898152 | 70.61856540 | 57.6673 | 3.5e-9 | B3 3.9e-13 | über den Umkehrpunkt | instabil | 2.01e+4 | 0.04137 | 52 | — |
| 0.149569846008 | 0.097147860683 | 70.64758173 | 109.7031 | 2.6e-6 | C 1.3e-11 | an der Rechengrenze | offen | 2.300e+7 | 7.3e-4 | 98 | — |
| 0.181153499286 | 0.284915444042 | 70.68129635 | 63.3946 | 5.9e-7 | R 2.0e-12 | über den Umkehrpunkt | offen | 1.872e+6 | 2.5e-4 | 0 | — |
| 0.074434795064 | 0.326488961072 | 70.69313777 | 64.3575 | 1.7e-6 | C 1.1e-12 | über den Umkehrpunkt | instabil | 1.352e+8 | 0.03390 | 50 | — |
| 0.334677527594 | 0.084677678960 | 70.76151646 | 60.8309 | 2.6e-8 | C 1.7e-12 | über den Umkehrpunkt | instabil | 1.331e+5 | 0.001570 | 54 | — |
| 0.373931215175 | 0.147076407297 | 70.94871217 | 40.9054 | 5.5e-8 | B3 1.7e-13 | über den Umkehrpunkt | instabil | 2.639e+6 | 0.1025 | 36 | — |
| 0.309927399013 | 0.176058154851 | 70.99110733 | 57.0866 | 2.4e-9 | C 7.0e-13 | über den Umkehrpunkt | instabil | 1.61e+4 | 0.01471 | 50 | — |
| 0.180586969052 | 0.286318088770 | 71.07296531 | 63.4396 | 3.0e-8 | B3 4.0e-13 | über den Umkehrpunkt | instabil | 1.019e+6 | 0.007689 | 48 | — |
| 0.183618937072 | 0.130007667526 | 71.18358263 | 99.1135 | 2.7e-8 | B3 5.0e-12 | über den Umkehrpunkt | instabil | 1.61e+3 | 2.0e-4 | 88 | — |
| 0.152579341797 | 0.317360567626 | 71.25286305 | 58.8211 | 2.9e-7 | B3 2.3e-10 | an der Rechengrenze | instabil | 7.891e+6 | 0.001864 | 44 | — |
| 0.321198093233 | 0.205289844877 | 71.35075046 | 48.5331 | 1.4e-6 | B3 1.7e-13 | über den Umkehrpunkt | instabil | 7.345e+7 | 0.1700 | 44 | — |
| 0.299023330782 | 0.239895457462 | 71.35958331 | 47.7633 | 3.8e-9 | C 6.6e-14 | über den Umkehrpunkt | instabil | 4.971e+6 | 0.03736 | 46 | — |
| 0.258293278689 | 0.141823157494 | 71.49872772 | 78.6765 | 3.8e-6 | C 3.4e-12 | über den Umkehrpunkt | instabil | 4.520e+8 | 6.4e-4 | 70 | — |
| 0.267894968180 | 0.133503936075 | 71.53284182 | 77.1893 | 7.9e-6 | C 1.5e-11 | an der Rechengrenze | offen | 8.688e+6 | 4.0e-4 | 70 | — |
| 0.379576444013 | 0.118512822793 | 71.58448759 | 42.7700 | 6.9e-9 | C 3.0e-13 | über den Umkehrpunkt | instabil | 5.10e+4 | 0.007932 | 38 | — |
| 0.095793945254 | 0.394203142635 | 71.63683442 | 39.9164 | 6.4e-8 | C 6.8e-14 | über den Umkehrpunkt | instabil | 5.039e+7 | 0.02079 | 34 | — |
| 0.209588555288 | 0.133641061963 | 71.64695756 | 93.1323 | 1.3e-6 | B3 1.5e-12 | über den Umkehrpunkt | instabil | 5.905e+8 | 0.01761 | 84 | — |
| 0.243431050787 | 0.213654084373 | 71.64997162 | 69.0295 | 5.2e-7 | C 8.6e-12 | über den Umkehrpunkt | instabil | 4.577e+7 | 0.02591 | 58 | — |
| 0.273232758374 | 0.254501307236 | 71.65238503 | 51.5459 | 8.7e-6 | R 1.1e-11 | an der Rechengrenze | offen | 4.650e+8 | 5.6e-5 | 0 | — |
| 0.177536536511 | 0.071013857031 | 71.76156473 | 108.4836 | 2.8e-6 | B3 2.9e-11 | an der Rechengrenze | offen | 3.785e+5 | 1.4e-8 | 82 | — |
| 0.121568675393 | 0.278480862331 | 71.76752971 | 75.9350 | 1.0e-6 | R 3.0e-13 | über den Umkehrpunkt | offen | 6.210e+8 | 9.7e-4 | 0 | — |
| 0.378811626005 | 0.045815201669 | 71.86713273 | 48.7492 | 1.5e-7 | B3 6.9e-13 | über den Umkehrpunkt | instabil | 3.628e+6 | 0.01186 | 44 | — |
| 0.332122914987 | 0.149416898588 | 71.91855613 | 55.0565 | 2.1e-8 | C 3.3e-13 | über den Umkehrpunkt | instabil | 5.799e+6 | 0.03997 | 50 | — |
| 0.035430859438 | 0.377037048888 | 71.92778112 | 49.8297 | 1.9e-6 | C 6.5e-13 | über den Umkehrpunkt | instabil | 4.815e+8 | 0.003489 | 38 | — |
| 0.356878591091 | 0.087031437709 | 71.95857868 | 53.9527 | 1.1e-7 | B3 2.8e-12 | über den Umkehrpunkt | instabil | 1.853e+6 | 0.01564 | 48 | — |
| 0.283284155362 | 0.224711822347 | 71.98045645 | 56.0377 | 2.3e-11 | B3 6.3e-13 | bestätigt | instabil | 29.9 | 0.001807 | 48 | nur Klasse von II.A-3 |
| 0.109482000600 | 0.043241365302 | 72.04152019 | 123.2862 | 6.1e-6 | C 1.5e-10 | an der Rechengrenze | offen | 5.998e+7 | 3.2e-4 | 110 | — |
| 0.364414413754 | 0.184111979179 | 72.08589868 | 39.2260 | 9.4e-10 | C 3.6e-14 | über den Umkehrpunkt | instabil | 3.637e+6 | 0.04869 | 36 | — |
| 0.349616863512 | 0.158042161863 | 72.24996634 | 48.2434 | 3.5e-8 | C 4.2e-14 | über den Umkehrpunkt | instabil | 7.809e+6 | 0.01566 | 42 | — |
| 0.184363656326 | 0.138808973701 | 72.32718820 | 99.1109 | 7.4e-6 | B3 5.1e-12 | über den Umkehrpunkt | offen | 7.983e+7 | 2.7e-4 | 88 | — |
| 0.377629820484 | 0.035895254243 | 72.35518540 | 49.8953 | 3.3e-9 | B3 5.3e-13 | über den Umkehrpunkt | instabil | 1.82e+4 | 0.006727 | 44 | — |
| 0.054600378364 | 0.375149401835 | 72.36943068 | 49.9888 | 2.9e-8 | B3 2.6e-12 | über den Umkehrpunkt | instabil | 3.170e+5 | 0.009067 | 40 | — |
| 0.209536309485 | 0.243264258170 | 72.46861486 | 70.7995 | 8.2e-6 | C 1.1e-12 | über den Umkehrpunkt | instabil | 8.761e+8 | 0.07614 | 70 | — |
| 0.026113263837 | 0.367510412318 | 72.50726810 | 53.9649 | 2.6e-8 | R 1.1e-12 | über den Umkehrpunkt | instabil | 1.296e+6 | 0.002354 | 0 | — |
| 0.057363796801 | 0.333585900375 | 72.54646728 | 64.7651 | 1.1e-7 | C 1.2e-13 | über den Umkehrpunkt | instabil | 2.450e+7 | 0.007007 | 48 | — |
| 0.124558326250 | 0.023407356922 | 72.55307626 | 122.7283 | 5.9e-10 | B3 2.2e-12 | über den Umkehrpunkt | instabil | 279 | 8.5e-4 | 108 | — |
| 0.295082865204 | 0.266312242806 | 72.61123083 | 43.4419 | 1.5e-11 | B3 2.2e-14 | bestätigt | instabil | 4.59e+3 | 0.1189 | 40 | — |
| 0.371402002949 | 0.081413498092 | 72.61822196 | 49.7523 | 2.3e-7 | B3 3.6e-13 | über den Umkehrpunkt | instabil | 2.693e+7 | 0.01130 | 44 | — |
| 0.273634504851 | 0.096455708962 | 72.73658043 | 81.5355 | 8.2e-12 | B3 4.7e-13 | bestätigt | instabil | 2.66 | 0.003564 | 72 | nur Klasse von I.A-36 |
| 0.191420658022 | 0.077288792456 | 72.81207233 | 106.2997 | 4.3e-9 | C 1.4e-10 | an der Rechengrenze | offen | 16.4 | 1.5e-4 | 94 | — |
| 0.171325564388 | 0.250927065193 | 72.81869759 | 77.0548 | 2.9e-6 | B3 9.5e-13 | über den Umkehrpunkt | offen | 4.784e+7 | 0.009864 | 68 | — |
| 0.366463263876 | 0.096705614223 | 72.85521533 | 50.3586 | 4.6e-7 | C 7.6e-12 | über den Umkehrpunkt | instabil | 1.124e+6 | 0.002142 | 46 | — |
| 0.080357175327 | 0.333401242291 | 72.89915535 | 63.4842 | 4.1e-8 | B3 5.3e-13 | über den Umkehrpunkt | instabil | 1.486e+6 | 0.004486 | 48 | — |
| 0.229064940811 | 0.330373194452 | 72.99982430 | 42.0146 | 9.3e-8 | C 4.1e-14 | über den Umkehrpunkt | instabil | 8.567e+7 | 0.1823 | 38 | — |
| 0.361819302056 | 0.154033345652 | 73.05899586 | 45.2687 | 8.1e-7 | C 9.0e-13 | über den Umkehrpunkt | instabil | 8.050e+6 | 0.1391 | 40 | — |
| 0.144103163915 | 0.083016093444 | 73.07056780 | 116.1103 | 7.9e-6 | B3 2.1e-12 | über den Umkehrpunkt | offen | 4.587e+8 | 0.002232 | 104 | — |
| 0.162620347158 | 0.088278136169 | 73.07768933 | 111.9382 | 1.7e-6 | B3 3.0e-11 | an der Rechengrenze | offen | 3.290e+7 | 3.0e-4 | 100 | — |
| 0.073088843079 | 0.302019219802 | 73.16131479 | 75.0583 | 6.6e-6 | C 6.3e-13 | über den Umkehrpunkt | instabil | 1.323e+9 | 0.05044 | 70 | — |
| 0.133722538555 | 0.081472887013 | 73.17657750 | 118.2942 | 1.9e-7 | C 7.6e-12 | über den Umkehrpunkt | offen | 5.846e+5 | 0.001428 | 106 | — |
| 0.214251787143 | 0.122964560998 | 73.27436801 | 95.7058 | 4.9e-6 | B3 3.7e-12 | über den Umkehrpunkt | offen | 2.943e+6 | 0.01250 | 88 | — |
| 0.370897458112 | 0.075995022497 | 73.31401230 | 50.8251 | 1.5e-7 | C 6.4e-13 | über den Umkehrpunkt | instabil | 5.000e+6 | 0.02214 | 46 | — |
| 0.336240005564 | 0.078602220501 | 73.33044105 | 63.0099 | 4.0e-9 | B3 2.6e-13 | über den Umkehrpunkt | instabil | 1.76e+3 | 0.02433 | 56 | — |
| 0.152790295902 | 0.048589052430 | 73.42658831 | 117.9325 | 2.3e-10 | B3 5.8e-12 | über den Umkehrpunkt | instabil | 7.71 | 7.1e-4 | 104 | — |
| 0.259839990294 | 0.188695056663 | 73.43278514 | 71.7197 | 4.3e-6 | C 1.7e-11 | an der Rechengrenze | offen | 8.420e+7 | 2.4e-4 | 64 | — |
| 0.266572979125 | 0.104033249471 | 73.49954195 | 83.7087 | 1.2e-9 | C 4.0e-11 | an der Rechengrenze | offen | 8.53 | 9.7e-5 | 74 | — |
| 0.274036890448 | 0.192722435925 | 73.52697283 | 66.8825 | 9.2e-6 | B3 1.0e-13 | über den Umkehrpunkt | offen | 7.071e+9 | 0.008466 | 60 | — |
| 0.318745946543 | 0.221768694090 | 73.66619705 | 47.4747 | 1.0e-10 | C 1.0e-13 | über den Umkehrpunkt | instabil | 5.49e+3 | 0.1427 | 46 | — |
| 0.135139059305 | 0.069242903707 | 73.73978547 | 120.1551 | 4.4e-7 | B3 7.7e-11 | an der Rechengrenze | offen | 4.833e+5 | 3.7e-6 | 108 | — |
| 0.085745294732 | 0.334540226881 | 73.87136050 | 63.4569 | 5.8e-9 | R 3.1e-12 | über den Umkehrpunkt | offen | 1.846e+5 | 1.2e-4 | 0 | — |
| 0.310684121310 | 0.223735744142 | 73.87668370 | 49.6336 | 2.1e-7 | C 1.6e-11 | an der Rechengrenze | instabil | 5.696e+6 | 0.02735 | 46 | — |
| 0.067596913856 | 0.249012040486 | 73.89133003 | 93.1678 | 5.7e-6 | B3 2.5e-13 | über den Umkehrpunkt | instabil | 2.589e+9 | 0.01102 | 100 | — |
| 0.295897909550 | 0.243162788720 | 73.89898745 | 49.5993 | 8.0e-9 | B3 2.6e-13 | über den Umkehrpunkt | instabil | 1.227e+7 | 0.09007 | 48 | — |
| 0.400006797021 | 0.153864799059 | 73.98128199 | 32.8140 | 3.8e-8 | C 2.6e-14 | über den Umkehrpunkt | instabil | 1.068e+7 | 0.03133 | 30 | Satellit 3. Ordnung von Fund (0.418703, -0.120403) (T* das 3.00341-fache, Wort bis auf 4 Buchstaben) |
| 0.265816852056 | 0.161702990103 | 74.00657752 | 75.7862 | 6.5e-6 | B3 2.3e-13 | über den Umkehrpunkt | offen | 3.368e+9 | 0.008463 | 68 | — |
| 0.353799858067 | 0.158471466182 | 74.01358368 | 47.9351 | 2.5e-7 | B3 2.7e-13 | über den Umkehrpunkt | instabil | 3.806e+7 | 0.1944 | 44 | — |
| 0.336657792186 | 0.132323205925 | 74.14104814 | 57.6673 | 1.6e-8 | B3 5.5e-14 | über den Umkehrpunkt | instabil | 2.989e+6 | 0.04342 | 52 | — |
| 0.262014950577 | 0.202812435540 | 74.19542161 | 68.8177 | 5.5e-6 | B3 2.1e-12 | über den Umkehrpunkt | instabil | 3.780e+8 | 0.003659 | 60 | — |
| 0.392948597147 | 0.154137240798 | 74.28210728 | 35.3173 | 4.5e-7 | R 8.0e-14 | über den Umkehrpunkt | instabil | 1.686e+7 | 0.01842 | 0 | — |
| 0.338299366083 | 0.080069268603 | 74.32839257 | 63.0097 | 4.5e-8 | B3 1.1e-12 | über den Umkehrpunkt | instabil | 2.286e+5 | 0.009075 | 56 | — |
| 0.147574275571 | 0.077466679924 | 74.32863146 | 118.0302 | 6.4e-6 | C 1.4e-12 | über den Umkehrpunkt | offen | 5.162e+7 | 9.1e-4 | 106 | — |
| 0.153474513637 | 0.102387497350 | 74.37003344 | 114.0468 | 5.8e-6 | C 1.3e-11 | an der Rechengrenze | offen | 7.693e+6 | 4.0e-4 | 102 | — |
| 0.165602100504 | 0.279913850832 | 74.46690445 | 71.2645 | 1.3e-6 | C 2.6e-13 | über den Umkehrpunkt | instabil | 3.320e+8 | 0.02874 | 58 | — |
| 0.140032807711 | 0.365362430031 | 74.50380106 | 46.8998 | 6.5e-9 | B3 1.8e-12 | über den Umkehrpunkt | instabil | 4.615e+6 | 0.05873 | 36 | — |
| 0.298284029617 | 0.148541148945 | 74.56609385 | 68.4792 | 2.6e-7 | C 3.5e-14 | über den Umkehrpunkt | instabil | 3.408e+8 | 0.09224 | 62 | — |
| 0.378961748929 | 0.118439123891 | 74.57267395 | 44.7834 | 1.6e-7 | B3 9.0e-14 | über den Umkehrpunkt | instabil | 5.189e+7 | 0.02077 | 40 | — |
| 0.176992540829 | 0.073648334854 | 74.71864773 | 112.8328 | 1.2e-7 | B3 8.0e-12 | über den Umkehrpunkt | offen | 1.11e+4 | 1.1e-4 | 100 | — |
| 0.305928970242 | 0.146873787675 | 74.77766282 | 66.4363 | 1.9e-6 | B3 3.2e-12 | über den Umkehrpunkt | offen | 1.606e+7 | 3.6e-4 | 60 | — |
| 0.350592281291 | 0.084565881071 | 74.80117579 | 58.5845 | 6.8e-6 | B3 3.3e-12 | über den Umkehrpunkt | offen | 3.554e+8 | 3.4e-5 | 52 | — |
| 0.226309727582 | 0.257062186595 | 74.85899794 | 65.3608 | 1.9e-9 | C 5.0e-13 | über den Umkehrpunkt | instabil | 6.06e+4 | 0.3367 | 54 | Satellit 9. Ordnung von I.B-1 (T* das 8.99990-fache) |
| 0.203431570978 | 0.100214934606 | 74.89991501 | 103.7806 | 7.7e-7 | B3 2.4e-11 | an der Rechengrenze | offen | 3.067e+6 | 6.2e-5 | 92 | — |
| 0.310268176752 | 0.113453322540 | 74.91041563 | 69.8355 | 1.0e-7 | C 3.1e-11 | an der Rechengrenze | offen | 1.91e+4 | 2.4e-4 | 62 | — |
| 0.272973246235 | 0.121218516888 | 74.93100125 | 81.0768 | 2.4e-7 | B3 2.9e-12 | über den Umkehrpunkt | instabil | 1.089e+6 | 0.001408 | 72 | Satellit 3. Ordnung von II.A-1 (T* das 3.00003-fache) |
| 0.288911452456 | 0.219695529023 | 74.94650552 | 57.8354 | 6.9e-10 | C 2.3e-12 | über den Umkehrpunkt | instabil | 605 | 9.1e-4 | 50 | — |
| 0.185455956814 | 0.079449937050 | 74.95932069 | 110.6544 | 3.1e-9 | C 4.1e-10 | an der Rechengrenze | offen | 13.6 | 5.0e-5 | 98 | Satellit 7. Ordnung von I.B-3 (T* das 7.00000-fache) |
| 0.315212307682 | 0.214482730034 | 74.98692201 | 50.9819 | 4.4e-8 | C 9.9e-14 | über den Umkehrpunkt | instabil | 3.882e+6 | 0.03006 | 46 | — |
| 0.042227020962 | 0.381408516285 | 75.18670590 | 50.1816 | 4.4e-6 | R 7.0e-12 | über den Umkehrpunkt | offen | 2.496e+10 | 0.003034 | 7 | — |
| 0.180144125477 | 0.073709056912 | 75.20438447 | 112.8330 | 1.1e-7 | B3 3.9e-12 | über den Umkehrpunkt | offen | 1.889e+5 | 8.5e-4 | 100 | — |
| 0.211281971642 | 0.209542591079 | 75.21411456 | 81.7658 | 8.9e-6 | C 2.4e-12 | über den Umkehrpunkt | offen | 4.047e+8 | 0.001384 | 74 | — |
| 0.100356099130 | 0.333854154186 | 75.28012414 | 63.4576 | 5.6e-9 | R 2.6e-12 | über den Umkehrpunkt | offen | 3.53e+4 | 1.8e-4 | 0 | — |
| 0.363387503532 | 0.090421362823 | 75.32973555 | 53.7872 | 2.9e-7 | B3 1.7e-12 | über den Umkehrpunkt | instabil | 1.414e+7 | 0.001741 | 48 | — |
| 0.334547203346 | 0.081067346930 | 75.37444592 | 65.1653 | 3.1e-9 | C 4.8e-13 | über den Umkehrpunkt | instabil | 3.26e+4 | 0.02238 | 58 | — |
| 0.263132675285 | 0.269208126820 | 75.43010725 | 53.1095 | 6.8e-8 | C 7.9e-13 | über den Umkehrpunkt | instabil | 6.739e+7 | 0.001669 | 6 | nur Klasse von I.B-1 |
| 0.254255489663 | 0.279975222351 | 75.44874693 | 52.4595 | 4.1e-6 | C 7.5e-14 | über den Umkehrpunkt | instabil | 8.136e+9 | 0.05229 | 42 | — |
| 0.133194706067 | 0.064439833488 | 75.47718565 | 123.7621 | 6.1e-6 | C 2.2e-10 | an der Rechengrenze | offen | 4.246e+8 | 8.7e-4 | 110 | — |
| 0.256611850950 | 0.114646990452 | 75.47784176 | 87.6762 | 5.6e-7 | C 2.2e-12 | über den Umkehrpunkt | instabil | 3.725e+6 | 0.01244 | 78 | — |
| 0.314557868338 | 0.106253637009 | 75.56728939 | 69.8406 | 5.0e-10 | C 2.6e-12 | über den Umkehrpunkt | instabil | 1.43e+3 | 5.8e-4 | 62 | — |
| 0.126604823739 | 0.042944061518 | 75.63112754 | 126.7134 | 3.7e-6 | B3 4.7e-11 | an der Rechengrenze | offen | 1.271e+6 | 4.9e-4 | 112 | — |
| 0.349654271911 | 0.154033051385 | 75.63595790 | 51.1129 | 2.6e-6 | C 2.4e-14 | über den Umkehrpunkt | offen | 4.647e+8 | 0.06160 | 46 | — |
| 0.296922996583 | 0.322800687113 | 75.74418434 | 29.9050 | 1.8e-11 | C 9.8e-14 | bestätigt | instabil | 9.29e+3 | 0.2533 | 30 | — |
| 0.035387806661 | 0.311044854354 | 75.78036208 | 76.9192 | 2.1e-6 | C 8.3e-13 | über den Umkehrpunkt | instabil | 5.578e+8 | 0.007018 | 56 | — |
| 0.397619539668 | 0.198476771832 | 75.79380766 | 27.8106 | 2.5e-12 | B3 2.5e-14 | bestätigt | instabil | 22.5 | 0.2768 | 28 | — |
| 0.200867018476 | 0.216684691155 | 75.79514930 | 83.1282 | 2.2e-6 | B3 1.1e-12 | über den Umkehrpunkt | offen | 1.554e+8 | 0.004635 | 72 | — |
| 0.012064023000 | 0.302418916609 | 75.80368559 | 80.6275 | 6.5e-6 | R 1.4e-12 | über den Umkehrpunkt | instabil | 7.082e+8 | 0.001411 | 0 | — |
| 0.044499793489 | 0.343393090186 | 75.86850729 | 64.8322 | 7.7e-6 | C 9.8e-12 | über den Umkehrpunkt | offen | 2.530e+7 | 2.8e-5 | 48 | — |
| 0.094510932315 | 0.313858564834 | 75.95457299 | 71.7562 | 5.5e-6 | R 4.7e-12 | über den Umkehrpunkt | offen | 1.318e+7 | 4.1e-4 | 0 | — |
| 0.208620833835 | 0.102188046087 | 76.05950706 | 103.7776 | 2.0e-6 | B3 1.1e-11 | an der Rechengrenze | offen | 7.662e+5 | 1.0e-4 | 92 | — |
| 0.359568171948 | 0.153939482907 | 76.06105698 | 47.9350 | 1.4e-7 | B3 2.4e-13 | über den Umkehrpunkt | instabil | 2.904e+6 | 0.1529 | 44 | — |
| 0.325608342336 | 0.246336130932 | 76.16071788 | 41.4400 | 1.2e-8 | C 9.4e-14 | über den Umkehrpunkt | instabil | 1.199e+7 | 0.03285 | 38 | — |
| 0.423835042535 | -0.092863012315 | 76.21355757 | 31.8275 | 2.5e-8 | C 8.4e-14 | über den Umkehrpunkt | instabil | 1.361e+7 | 0.06700 | 30 | — |
| 0.341992194904 | 0.204162382770 | 76.38416680 | 45.3883 | 1.1e-7 | B3 1.1e-13 | über den Umkehrpunkt | instabil | 2.756e+7 | 0.2375 | 40 | — |
| 0.340237742760 | 0.151693524090 | 76.54358121 | 55.4015 | 1.9e-8 | C 2.5e-13 | über den Umkehrpunkt | instabil | 1.672e+6 | 0.01255 | 50 | — |
| 0.103162261835 | 0.278417684098 | 76.67143961 | 83.5803 | 3.0e-7 | R 6.1e-14 | über den Umkehrpunkt | offen | 6.337e+9 | 8.3e-4 | 0 | — |
| 0.362018110722 | 0.139804984490 | 76.69605092 | 49.5157 | 3.1e-6 | B3 7.1e-13 | über den Umkehrpunkt | instabil | 3.783e+7 | 0.01725 | 44 | — |
| 0.145538446546 | 0.053407649725 | 76.79616617 | 124.4739 | 1.9e-9 | C 2.7e-11 | an der Rechengrenze | instabil | 352 | 3.9e-4 | 110 | — |
| 0.328248944755 | 0.153674602971 | 76.83894101 | 59.4928 | 6.4e-7 | B3 3.0e-13 | über den Umkehrpunkt | instabil | 4.942e+7 | 0.07615 | 52 | — |
| 0.311637757241 | 0.181439526220 | 76.86966838 | 60.2194 | 1.4e-6 | B3 6.2e-13 | über den Umkehrpunkt | instabil | 1.993e+9 | 0.03320 | 52 | — |
| 0.130300577443 | 0.324549586851 | 76.88595362 | 64.3864 | 1.0e-9 | C 6.8e-13 | über den Umkehrpunkt | instabil | 2.674e+5 | 0.009493 | 50 | — |
| 0.076124073676 | 0.362104781183 | 76.92494486 | 56.6427 | 1.4e-9 | R 4.7e-13 | über den Umkehrpunkt | instabil | 2.19e+4 | 0.01608 | 0 | — |
| 0.250534566119 | 0.272817809946 | 76.95001581 | 56.5141 | 4.2e-9 | R 1.0e-13 | über den Umkehrpunkt | instabil | 1.169e+7 | 0.01076 | 0 | — |
| 0.374526613241 | 0.114600054565 | 76.95204999 | 48.2904 | 6.2e-9 | C 7.8e-14 | über den Umkehrpunkt | instabil | 4.776e+5 | 0.04075 | 44 | — |
| 0.335789285396 | 0.134284497271 | 77.06702590 | 59.9757 | 2.0e-7 | C 8.6e-14 | über den Umkehrpunkt | instabil | 6.757e+6 | 0.04569 | 54 | — |
| 0.143373648584 | 0.064129894290 | 77.08668938 | 124.5139 | 7.5e-6 | B3 9.5e-12 | über den Umkehrpunkt | offen | 6.315e+8 | 7.8e-4 | 112 | — |
| 0.149628405233 | 0.244918849844 | 77.12765284 | 87.5450 | 5.5e-6 | B3 3.6e-14 | über den Umkehrpunkt | instabil | 1.423e+10 | 0.05405 | 89 | — |
| 0.060860539579 | 0.334750494178 | 77.40611957 | 68.4383 | 1.6e-8 | R 7.8e-14 | über den Umkehrpunkt | instabil | 3.059e+6 | 0.01307 | 0 | — |
| 0.376407078534 | 0.111130738787 | 77.43304957 | 48.2799 | 1.5e-6 | C 9.8e-14 | über den Umkehrpunkt | instabil | 6.356e+8 | 0.02957 | 44 | — |
| 0.142123839938 | 0.039037314112 | 77.44020646 | 127.0976 | 7.3e-9 | B3 6.9e-11 | an der Rechengrenze | offen | 2.82e+3 | 6.0e-5 | 112 | — |
| 0.264710637335 | 0.197018797413 | 77.44686246 | 72.3420 | 6.4e-8 | B3 4.4e-13 | über den Umkehrpunkt | instabil | 4.294e+7 | 0.01511 | 64 | — |
| 0.220889296969 | 0.344156976446 | 77.56848035 | 41.9527 | 1.6e-8 | C 1.1e-12 | über den Umkehrpunkt | instabil | 2.256e+6 | 0.1240 | 34 | — |
| 0.388559888119 | 0.018389489672 | 77.58412940 | 49.7302 | 4.9e-6 | B3 3.8e-11 | an der Rechengrenze | offen | 4.086e+5 | 2.0e-5 | 44 | — |
| 0.276336948387 | 0.136553956832 | 77.81527195 | 80.7461 | 4.0e-6 | B3 5.9e-12 | über den Umkehrpunkt | offen | 8.017e+6 | 0.006350 | 72 | — |
| 0.312592926440 | 0.210801434445 | 77.89523765 | 54.6168 | 2.0e-10 | C 1.1e-13 | über den Umkehrpunkt | instabil | 9.67e+3 | 0.09320 | 50 | — |
| 0.313115995143 | 0.214036402414 | 77.92788886 | 53.7585 | 6.9e-7 | R 1.0e-13 | über den Umkehrpunkt | offen | 5.448e+7 | 0.004307 | 0 | — |
| 0.060557297338 | 0.211317966909 | 77.94813806 | 110.0341 | 4.3e-6 | B3 4.6e-13 | über den Umkehrpunkt | instabil | 2.291e+9 | 0.02187 | 116 | — |
| 0.230883610630 | 0.250366589989 | 77.97083067 | 68.8093 | 5.0e-11 | C 9.0e-14 | bestätigt | instabil | 185 | 0.02264 | 58 | — |
| 0.229332676682 | 0.110846728640 | 78.04368742 | 99.4777 | 2.1e-6 | B3 5.1e-12 | über den Umkehrpunkt | offen | 1.292e+7 | 1.0e-4 | 88 | — |
| 0.346363039059 | 0.081818174190 | 78.10053355 | 63.0161 | 3.2e-8 | B3 2.4e-12 | über den Umkehrpunkt | instabil | 1.300e+5 | 0.001788 | 56 | — |
| 0.234513078986 | 0.331348808892 | 78.18610832 | 43.4616 | 1.2e-8 | B3 1.6e-13 | über den Umkehrpunkt | instabil | 5.910e+6 | 0.1184 | 36 | — |
| 0.376735870391 | 0.041090617124 | 78.33605766 | 54.1621 | 1.1e-8 | B3 4.3e-13 | über den Umkehrpunkt | instabil | 5.78e+3 | 4.4e-4 | 48 | — |
| 0.359759033928 | 0.063873935952 | 78.35795817 | 59.5161 | 1.6e-8 | C 7.6e-13 | über den Umkehrpunkt | instabil | 1.483e+5 | 0.02315 | 54 | — |
| 0.310575329380 | 0.240017228479 | 78.39543684 | 48.8634 | 2.9e-8 | C 8.5e-14 | über den Umkehrpunkt | instabil | 4.384e+7 | 0.04182 | 48 | — |
| 0.277961367393 | 0.283623582128 | 78.40241212 | 47.0511 | 1.3e-9 | B3 2.1e-13 | über den Umkehrpunkt | instabil | 4.408e+5 | 0.1707 | 44 | — |

… 46 weitere in der JSON-Datei.

## Sicher linear stabile Funde (3)

| v₁ | v₂ | T | T* | Rest (voller Umlauf) | Umkehrpunkt | Urteil | Stabilität | \|λ\| | engste Begegnung | Wortlänge | Listen |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 0.208385982753 | 0.066268864030 | 9.61697220 | 13.6166 | 3.5e-11 | B3 5.6e-14 | bestätigt | stabil | 1.00 | 7.6e-5 | 12 | Satellit 3. Ordnung von I.A-1 (T* das 3.00033-fache) |
| 0.180434186226 | 0.077439046632 | 10.57647820 | 15.8078 | 5.8e-12 | B3 1.4e-13 | bestätigt | stabil | 1.00 | 8.0e-4 | 14 | ort: I.B-3 |
| 0.312287688413 | 0.103614627617 | 16.81870619 | 15.7877 | 6.8e-13 | C 2.3e-14 | bestätigt | stabil | 1.00 | 0.01089 | 14 | nur Klasse von I.B-4 |

## Alle Funde

2204 Bahnen — die Tabelle stünde hier über tausende Zeilen. Sie stehen vollständig in `euler-m3-05.json`.

## Nachprüfung in erhöhter Genauigkeit (2026-10-02 21:44 UTC)

17 Funde (in keiner Liste und Kandidaten: in double stabil, oder offen mit Indizes unter 30), Festkomma mit 320 Bit, Taylorreihe der Ordnung 40, Ziel 30 Stellen; Gegenprobe mit 448 Bit und Ordnung 52. Rechenzeit zusammen 61 min auf 5 Fäden.

| Urteil | Bahnen |
|---|---|
| belegt (Rest unter 1e-30, beide Rechnungen einig, Korrektur unter 1e-5) | **17** |
| belegt, aber verschoben | 0 |
| offen (Newton kam nicht unter 1e-30) | 0 |
| Zeitlimit | 0 |
| Ausnahmen | 0 |

Stabilität in erhöhter Genauigkeit (17 Bahnen): stabil **4**, an der Grenze 2, instabil 11, Zeitlimit 0, abgebrochen 0.

| a | b | T | Rest | Rest (448 Bit) | Korrektur gegen double | Rest in double | wahrer Rest dort | Schritte | s | Stabilität (double) | Stabilität (genau) | Abstand zur Grenze | Listen | Urteil |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 0.2083859827514622498098 | 0.0662688640291554496903 | 9.61697219605350519847 | 1.3e-32 | 1.3e-32 | 3.5e-11 | 3.5e-11 | 1.4e-11 | 1592 | 30 | stabil | stabil | 0.5623 | in keiner | belegt |
| 0.3122876884125472060976 | 0.1036146276166307944554 | 16.8187061914973873881 | 2.5e-37 | 1.6e-36 | 5.9e-13 | 6.8e-13 | 2.2e-13 | 1043 | 12 | stabil | stabil | 0.009183 | in keiner | belegt |
| 0.1818630953952348232622 | 0.0771569130568533682336 | 21.2106247503617588574 | 7.7e-36 | 1.5e-34 | 4.1e-10 | 4.3e-10 | 1.9e-9 | 2983 | 61 | offen | instabil | -0.3754 | in keiner | belegt |
| 0.1374565168825902694800 | 0.0364955924780688110668 | 34.3006705035383761041 | 1.3e-31 | 1.3e-31 | 9.7e-12 | 2.7e-10 | 1.6e-10 | 5813 | 177 | offen | instabil | -27.32 | in keiner | belegt |
| 0.1614013530182254873342 | 0.0555611587577371691526 | 38.8362852993120943593 | 6.0e-33 | 6.0e-33 | 1.6e-11 | 1.1e-10 | 3.5e-11 | 5109 | 117 | offen | instabil | -11.29 | in keiner | belegt |
| 0.2960135679114422719928 | 0.0900636439373634813910 | 41.6971132586856387147 | 8.0e-35 | 1.1e-34 | 9.5e-12 | 1.7e-11 | 4.6e-12 | 3315 | 49 | offen | instabil | -9.4e-8 | in keiner | belegt |
| 0.2760940883537150386983 | 0.1031861067701278908864 | 49.3560053663583385219 | 2.0e-31 | 1.9e-31 | 4.8e-11 | 1.7e-10 | 3.3e-11 | 4596 | 93 | offen | stabil | 0.1435 | in keiner | belegt |
| 0.3136765233804480497632 | 0.1051721081958178885804 | 63.0173965592602597282 | 1.6e-34 | 6.6e-35 | 2.9e-11 | 9.3e-11 | 4.2e-12 | 4007 | 58 | offen | stabil | 4.7e-9 | in keiner | belegt |
| 0.1713518876553900720613 | 0.0262505191634811312466 | 63.7606697189794670318 | 3.3e-31 | 3.3e-31 | 3.8e-10 | 2.3e-9 | 1.1e-9 | 11773 | 218 | offen | instabil | -0.05892 | in keiner | belegt |
| 0.3056555447145475935318 | 0.0983755557838063730354 | 67.0985955239256421008 | 1.3e-32 | 1.3e-32 | 4.4e-9 | 2.7e-10 | 1.3e-10 | 4808 | 84 | offen | instabil | -6.3e-9 | in keiner | belegt |
| 0.1754022928817201716062 | 0.0488707213062095683660 | 67.7468523042902499501 | 6.1e-32 | 6.0e-32 | 2.4e-12 | 6.2e-10 | 1.8e-11 | 9325 | 202 | offen | instabil | -2.804 | in keiner | belegt |
| 0.1914206580218333704927 | 0.0772887924555419911512 | 72.8120723283820178477 | 7.0e-31 | 7.0e-31 | 2.5e-10 | 4.3e-9 | 1.7e-9 | 9108 | 239 | offen | instabil | -12.19 | in keiner | belegt |
| 0.2665729791246357189158 | 0.1040332494711567183518 | 73.4995419483235693484 | 7.4e-32 | 7.4e-32 | 1.3e-10 | 1.2e-9 | 1.6e-10 | 7321 | 169 | offen | instabil | -6.598 | in keiner | belegt |
| 0.1854559568144048874009 | 0.0794499370499578634306 | 74.9593206937507698548 | 1.4e-31 | 1.4e-31 | 1.4e-10 | 3.1e-9 | 9.7e-11 | 10089 | 455 | offen | instabil | -0.2306 | in keiner | belegt |
| 0.2786051991465020358385 | 0.0642745326279598360194 | 79.7112709287499239665 | 3.0e-31 | 3.0e-31 | 3.4e-10 | 7.9e-11 | 1.2e-11 | 8901 | 194 | offen | an der Grenze | -1.3e-26 | in keiner | belegt |
| 0.3082807579405009182662 | 0.1002690300141908476718 | 79.8166069565943556062 | 9.4e-34 | 1.3e-33 | 1.4e-10 | 9.5e-11 | 6.2e-11 | 5526 | 104 | offen | instabil | -1.0e-10 | in keiner | belegt |
| 0.2175833160007455112154 | 0.0317197670064262978374 | 80.5130664968361060188 | 2.7e-31 | 2.8e-31 | 1.7e-10 | 1.4e-9 | 4.4e-11 | 14914 | 404 | offen | an der Grenze | 4.5e-16 | in keiner | belegt |
