# Suchlauf euler-m3-5-v1gross

2026-10-21 17:44 UTC · Euler-Ebene · Massen 1 / 1 / 5 · Fenster v₁ 1…2.75, v₂ 0…1 · Raster 1024×1024 · Perioden bis 40 · Suche über Umkehrpunkte (halbe Periode)

## Was der Lauf getan hat

| Stufe | Zahl |
|---|---|
| Rasterpunkte gerechnet | 1048576 in 392 s auf 7 Fäden |
| davon durchgelaufen / Zerfall / abgebrochen / ungebunden | 669283 / 325186 / 10047 / 44060 |
| Talsohlen (unter 0.3) in 4 Zielen × 6 Zeitbändern | 611384 |
| davon durch die Prüfkette | 40000 in 992 s |
| Umkehrpunkt verfehlt | 38462 |
| Umkehrpunkt getroffen, aber nach 12τ nicht zurück (nur bis auf eine Drehung periodisch) | 49 |
| geschlossene Bahn | 1489 |
| verschiedene Orte in der Ebene | **38** |
| verschiedene Bahnen (gleiches T* auf acht Stellen einmal gezählt) | **38** |
| — bestätigt (voller Umlauf: Rest < 1e-10 und Gegenprobe < 1e-8) | 4 |
| — über den Umkehrpunkt (halber Umlauf auf 1e-11 getroffen, voller für double zu empfindlich) | 25 |
| — an der Rechengrenze | 9 |
| sicher linear stabil | 0 |
| Ausnahmen im Schwarm | 0 |

Je Ziel (Fixmenge, die nach der halben Periode getroffen wird):

| Ziel | Kandidaten | Umkehrpunkt getroffen | geschlossene Bahn |
|---|---|---|---|
| A3 | 5338 | 408 | 408 |
| B3 | 27533 | 1041 | 1041 |
| C | 6500 | 63 | 40 |
| R | 629 | 26 | 0 |

## Bekannt oder nicht

Von den 38 Funden stehen **1** in einer der geprüften Listen, **37** in keiner.

| Liste | Stufe | Bahnen | Bedeutung |
|---|---|---|---|
| Li/Liao 2017–2019, Šuvakov/Dmitrašinović 2013 (2364 Bahnen, mit Klassen) | Ort | 0 | steht mit diesen Anfangswerten in der Liste |
| | Lage | 1 | gleiches T* auf acht Stellen: Listenbahn, an anderer Stelle getroffen |
| | Klasse | 2 | Klasse in der Liste, aber anderes T*: weitere Bahn derselben Familie |
| | keine | 35 | Klasse nicht in der Liste |
| Hristov u. a. | — | — | nur für gleiche Massen; hier nicht anwendbar |

**Für die Massen 1 / 1 / 5 gibt es als Vergleich nur Li und Liao: 35 Bahnen, je Klasse eine, davon 2 mit T bis 40.** Die großen Listen von Hristov u. a. gelten nur für gleiche Massen. „In keiner Liste“ sagt in diesem Lauf deshalb wenig: fast alles, was eine Suche bei diesen Massen findet, steht in keiner Liste, weil es kaum eine gibt.

„In keiner Liste“ heißt genau das und nicht „neu“. Die Listen sind in sich begrenzt: Li und Liao führen je Klasse eine Bahn bis T = 200, gefunden auf einem Raster von 4000²; Hristov u. a. führen die Euler-Ebene bis T* = 211 und den freien Fall bis T* = 80 (mit Punktsymmetrie bis 120).

**Satelliten:** 1 der 37 Funde außerhalb der Listen laufen mehrmals fast den Weg einer anderen Bahn dieses Laufs oder der Liste, bevor sie sich schließen (Wort das k-fache, T* das k-fache); bei 0 davon ist die Grundbahn gelistet. Das sind eigene Bahnen, aber keine unerklärten — um eine stabile Bahn herum gibt es solche Begleiter regelmäßig. Sie sind in der Tabelle unten in der Spalte „Listen“ benannt.

## Gegenrichtung: was der Lauf von den Listen wiederfindet

| Liste | Bahnen im Fenster mit T bis 40 | gefunden | Anteil |
|---|---|---|---|
| Li/Liao, 2013 | 0 | 0 | — |

![Karte](euler-m3-5-v1gross.png)

Karte: hell = die Bahn kommt bis zur halben Höchstperiode einer Fixmenge nahe. Weißer Ring = Fund, der in einer Liste steht (nur bei bis zu 3000 Funden gezeichnet). Grüner Punkt = Fund, der in keiner Liste steht. Rotes Kreuz = Bahn aus Li/Liao, die der Lauf verpasst hat.

## Funde in keiner Liste (37)

| v₁ | v₂ | T | T* | Rest (voller Umlauf) | Umkehrpunkt | Urteil | Stabilität | \|λ\| | engste Begegnung | Wortlänge | Listen |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 0.383053052092 | 1.808303393407 | 12.04432443 | 164.6239 | 9.2e-12 | C 2.2e-14 | bestätigt | instabil | 1.04e+3 | 0.06738 | 14 | — |
| 0.396751999038 | 1.697892900863 | 13.78982086 | 215.1375 | 1.9e-10 | C 3.1e-13 | über den Umkehrpunkt | instabil | 5.78e+3 | 0.02991 | 18 | — |
| 0.383361024586 | 1.641701078850 | 15.79119024 | 262.9574 | 2.1e-10 | C 2.4e-13 | über den Umkehrpunkt | instabil | 1.77e+4 | 0.02201 | 22 | — |
| 0.229096260855 | 1.678163694514 | 16.02985711 | 264.6510 | 1.8e-9 | C 4.9e-13 | über den Umkehrpunkt | instabil | 3.96e+4 | 0.002957 | 22 | — |
| 0.638310618221 | 1.478863753164 | 19.33034859 | 347.9041 | 2.8e-8 | C 1.8e-13 | über den Umkehrpunkt | instabil | 1.473e+7 | 0.02842 | 26 | — |
| 1.135898346335 | 0.487364820027 | 19.38031051 | 468.5495 | 1.1e-10 | B3 2.3e-14 | über den Umkehrpunkt | offen | 1.00 | 3.5e-4 | 32 | — |
| 1.107241450178 | 0.992337722333 | 20.32535503 | 409.5673 | 1.3e-11 | B3 2.4e-14 | bestätigt | offen | 1.00 | 0.001718 | 28 | — |
| 0.300394735567 | 1.985816816090 | 22.24175164 | 237.7712 | 2.3e-9 | C 1.9e-13 | über den Umkehrpunkt | instabil | 3.541e+5 | 0.1749 | 18 | — |
| 0.170800944397 | 2.154907053370 | 25.31120266 | 199.3151 | 4.2e-10 | C 1.4e-13 | über den Umkehrpunkt | instabil | 6.80e+3 | 0.01046 | 18 | — |
| 0.404148534253 | 2.056842799744 | 25.56526612 | 231.8235 | 4.1e-6 | C 1.5e-11 | an der Rechengrenze | offen | 1.352e+7 | 2.3e-5 | 18 | — |
| 0.501001895844 | 1.925598981729 | 27.32752982 | 301.6431 | 2.5e-10 | C 1.1e-12 | über den Umkehrpunkt | instabil | 6.87e+3 | 0.01231 | 22 | — |
| 0.529198486717 | 1.693004386168 | 32.38683163 | 487.3557 | 7.6e-8 | C 2.2e-12 | über den Umkehrpunkt | offen | 9.623e+6 | 0.001915 | 38 | — |
| 0.178553765769 | -2.180029666845 | 33.16422785 | 245.8431 | 9.3e-10 | C 1.1e-13 | über den Umkehrpunkt | instabil | 1.09e+4 | 0.01032 | 22 | — |
| 0.679326408229 | 2.047464610140 | 35.98978376 | 286.2966 | 1.1e-9 | C 2.7e-14 | über den Umkehrpunkt | instabil | 3.917e+6 | 0.07442 | 22 | — |
| 0.763465745783 | 1.141774138199 | 37.06469351 | 816.5820 | 2.7e-7 | C 1.2e-12 | über den Umkehrpunkt | instabil | 2.129e+7 | 0.007194 | 56 | — |
| 1.139968039796 | 0.231275224149 | 38.28120012 | 966.4309 | 1.2e-9 | A3 1.1e-11 | an der Rechengrenze | offen | 2.65 | 1.9e-5 | 66 | nur Klasse von I.B-1 |
| 1.130722237491 | 0.650274657381 | 39.24347605 | 907.7064 | 1.4e-10 | B3 2.1e-12 | über den Umkehrpunkt | offen | 1.14 | 1.6e-4 | 62 | — |
| 1.105376951671 | -1.820918822227 | 39.89664353 | 336.9715 | 6.0e-8 | C 1.1e-13 | über den Umkehrpunkt | instabil | 3.537e+7 | 0.08612 | 26 | — |
| 1.116517518355 | 0.892574072540 | 40.19583161 | 848.7274 | 1.6e-10 | B3 3.0e-12 | über den Umkehrpunkt | offen | 1.03 | 3.3e-4 | 58 | — |
| 0.183992122897 | 2.197016340825 | 41.03733522 | 291.4714 | 2.7e-9 | C 2.1e-12 | über den Umkehrpunkt | instabil | 2.22e+4 | 0.01020 | 26 | — |
| 1.067860660801 | -1.244674765273 | 41.76326331 | 729.9047 | 8.3e-11 | C 2.0e-12 | bestätigt | offen | 1.00 | 8.1e-4 | 50 | — |
| 1.159178780663 | -1.787546697181 | 45.52629598 | 384.2447 | 1.2e-6 | C 2.4e-13 | über den Umkehrpunkt | instabil | 2.576e+8 | 0.07026 | 30 | — |
| 0.188052657847 | 2.209395375333 | 48.92508045 | 336.4827 | 1.4e-9 | C 2.3e-13 | über den Umkehrpunkt | instabil | 3.98e+4 | 0.01010 | 30 | — |
| 1.492059023580 | 0.740323143695 | 53.33352455 | 907.5886 | 1.4e-9 | C 8.6e-10 | an der Rechengrenze | instabil | 1.60e+3 | 9.2e-4 | 62 | — |
| 0.114131581545 | 2.140432910236 | 53.59945146 | 439.7323 | 7.9e-6 | C 6.6e-13 | über den Umkehrpunkt | offen | 5.022e+8 | 0.005628 | 38 | — |
| 0.191221073477 | 2.218887085766 | 56.82414805 | 381.0387 | 5.7e-9 | C 1.2e-12 | über den Umkehrpunkt | instabil | 6.55e+4 | 0.01001 | 34 | — |
| 1.148645083132 | 1.653982128866 | 57.56144606 | 609.6767 | 1.4e-10 | C 1.2e-10 | an der Rechengrenze | instabil | 105 | 0.001994 | 42 | — |
| 0.481838197783 | 2.173456338649 | 57.94828880 | 389.4823 | 6.9e-7 | C 2.6e-13 | über den Umkehrpunkt | offen | 2.973e+8 | 0.01004 | 30 | — |
| 1.119274589726 | 0.856822137924 | 60.06015423 | 1287.8639 | 1.3e-9 | B3 9.6e-13 | über den Umkehrpunkt | offen | 1.00 | 1.3e-4 | 88 | nur Klasse von I.A-1 |
| 0.193775260374 | 2.226437209951 | 64.73228271 | 425.2418 | 6.6e-9 | C 5.9e-13 | über den Umkehrpunkt | instabil | 1.010e+5 | 0.009947 | 38 | — |
| 1.426571086836 | 0.176553622000 | 69.78711995 | 1464.2447 | 6.4e-9 | B3 1.4e-11 | an der Rechengrenze | offen | 3.07 | 1.9e-5 | 100 | — |
| 1.036896348316 | 1.928537127301 | 70.47849086 | 519.5672 | 2.0e-6 | C 7.0e-13 | über den Umkehrpunkt | instabil | 3.214e+8 | 0.06679 | 42 | — |
| 1.507335733969 | 0.567550525227 | 78.08431379 | 1405.4778 | 1.7e-8 | B3 1.7e-11 | an der Rechengrenze | offen | 1.06e+4 | 8.6e-5 | 96 | Satellit 3. Ordnung von Fund (1.135898, 0.487365) (T* das 2.99964-fache) |
| 1.120592047778 | 0.838393029591 | 79.92325181 | 1726.9947 | 4.7e-10 | C 3.4e-11 | an der Rechengrenze | offen | 2.58 | 7.1e-5 | 118 | — |
| 1.432718451688 | 0.951669119141 | 80.32167109 | 1287.7880 | 3.4e-9 | B3 9.6e-12 | über den Umkehrpunkt | offen | 8.34 | 9.4e-5 | 88 | — |
| 0.899199442779 | -1.651017545799 | 81.62454082 | 1067.7587 | 1.2e-9 | C 3.3e-10 | an der Rechengrenze | offen | 1.35 | 5.7e-4 | 74 | — |
| 0.994302781290 | 1.562644723662 | 87.45260624 | 1189.2604 | 1.3e-9 | C 6.6e-11 | an der Rechengrenze | offen | 1.00 | 5.3e-4 | 82 | — |


## Sicher linear stabile Funde (0)

| v₁ | v₂ | T | T* | Rest (voller Umlauf) | Umkehrpunkt | Urteil | Stabilität | \|λ\| | engste Begegnung | Wortlänge | Listen |
|---|---|---|---|---|---|---|---|---|---|---|---|

## Alle Funde (38)

| v₁ | v₂ | T | T* | Rest (voller Umlauf) | Umkehrpunkt | Urteil | Stabilität | \|λ\| | engste Begegnung | Wortlänge | Listen |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 0.383053052092 | 1.808303393407 | 12.04432443 | 164.6239 | 9.2e-12 | C 2.2e-14 | bestätigt | instabil | 1.04e+3 | 0.06738 | 14 | — |
| 0.396751999038 | 1.697892900863 | 13.78982086 | 215.1375 | 1.9e-10 | C 3.1e-13 | über den Umkehrpunkt | instabil | 5.78e+3 | 0.02991 | 18 | — |
| 0.383361024586 | 1.641701078850 | 15.79119024 | 262.9574 | 2.1e-10 | C 2.4e-13 | über den Umkehrpunkt | instabil | 1.77e+4 | 0.02201 | 22 | — |
| 0.229096260855 | 1.678163694514 | 16.02985711 | 264.6510 | 1.8e-9 | C 4.9e-13 | über den Umkehrpunkt | instabil | 3.96e+4 | 0.002957 | 22 | — |
| 0.638310618221 | 1.478863753164 | 19.33034859 | 347.9041 | 2.8e-8 | C 1.8e-13 | über den Umkehrpunkt | instabil | 1.473e+7 | 0.02842 | 26 | — |
| 1.135898346335 | 0.487364820027 | 19.38031051 | 468.5495 | 1.1e-10 | B3 2.3e-14 | über den Umkehrpunkt | offen | 1.00 | 3.5e-4 | 32 | — |
| 1.107241450178 | 0.992337722333 | 20.32535503 | 409.5673 | 1.3e-11 | B3 2.4e-14 | bestätigt | offen | 1.00 | 0.001718 | 28 | — |
| 0.300394735567 | 1.985816816090 | 22.24175164 | 237.7712 | 2.3e-9 | C 1.9e-13 | über den Umkehrpunkt | instabil | 3.541e+5 | 0.1749 | 18 | — |
| 1.352255654345 | 0.837025042787 | 23.91942661 | 439.1182 | 7.8e-11 | A3 3.7e-13 | bestätigt | offen | 1.03 | 2.3e-4 | 30 | lage: II.C-1 |
| 0.170800944397 | 2.154907053370 | 25.31120266 | 199.3151 | 4.2e-10 | C 1.4e-13 | über den Umkehrpunkt | instabil | 6.80e+3 | 0.01046 | 18 | — |
| 0.404148534253 | 2.056842799744 | 25.56526612 | 231.8235 | 4.1e-6 | C 1.5e-11 | an der Rechengrenze | offen | 1.352e+7 | 2.3e-5 | 18 | — |
| 0.501001895844 | 1.925598981729 | 27.32752982 | 301.6431 | 2.5e-10 | C 1.1e-12 | über den Umkehrpunkt | instabil | 6.87e+3 | 0.01231 | 22 | — |
| 0.529198486717 | 1.693004386168 | 32.38683163 | 487.3557 | 7.6e-8 | C 2.2e-12 | über den Umkehrpunkt | offen | 9.623e+6 | 0.001915 | 38 | — |
| 0.178553765769 | -2.180029666845 | 33.16422785 | 245.8431 | 9.3e-10 | C 1.1e-13 | über den Umkehrpunkt | instabil | 1.09e+4 | 0.01032 | 22 | — |
| 0.679326408229 | 2.047464610140 | 35.98978376 | 286.2966 | 1.1e-9 | C 2.7e-14 | über den Umkehrpunkt | instabil | 3.917e+6 | 0.07442 | 22 | — |
| 0.763465745783 | 1.141774138199 | 37.06469351 | 816.5820 | 2.7e-7 | C 1.2e-12 | über den Umkehrpunkt | instabil | 2.129e+7 | 0.007194 | 56 | — |
| 1.139968039796 | 0.231275224149 | 38.28120012 | 966.4309 | 1.2e-9 | A3 1.1e-11 | an der Rechengrenze | offen | 2.65 | 1.9e-5 | 66 | nur Klasse von I.B-1 |
| 1.130722237491 | 0.650274657381 | 39.24347605 | 907.7064 | 1.4e-10 | B3 2.1e-12 | über den Umkehrpunkt | offen | 1.14 | 1.6e-4 | 62 | — |
| 1.105376951671 | -1.820918822227 | 39.89664353 | 336.9715 | 6.0e-8 | C 1.1e-13 | über den Umkehrpunkt | instabil | 3.537e+7 | 0.08612 | 26 | — |
| 1.116517518355 | 0.892574072540 | 40.19583161 | 848.7274 | 1.6e-10 | B3 3.0e-12 | über den Umkehrpunkt | offen | 1.03 | 3.3e-4 | 58 | — |
| 0.183992122897 | 2.197016340825 | 41.03733522 | 291.4714 | 2.7e-9 | C 2.1e-12 | über den Umkehrpunkt | instabil | 2.22e+4 | 0.01020 | 26 | — |
| 1.067860660801 | -1.244674765273 | 41.76326331 | 729.9047 | 8.3e-11 | C 2.0e-12 | bestätigt | offen | 1.00 | 8.1e-4 | 50 | — |
| 1.159178780663 | -1.787546697181 | 45.52629598 | 384.2447 | 1.2e-6 | C 2.4e-13 | über den Umkehrpunkt | instabil | 2.576e+8 | 0.07026 | 30 | — |
| 0.188052657847 | 2.209395375333 | 48.92508045 | 336.4827 | 1.4e-9 | C 2.3e-13 | über den Umkehrpunkt | instabil | 3.98e+4 | 0.01010 | 30 | — |
| 1.492059023580 | 0.740323143695 | 53.33352455 | 907.5886 | 1.4e-9 | C 8.6e-10 | an der Rechengrenze | instabil | 1.60e+3 | 9.2e-4 | 62 | — |
| 0.114131581545 | 2.140432910236 | 53.59945146 | 439.7323 | 7.9e-6 | C 6.6e-13 | über den Umkehrpunkt | offen | 5.022e+8 | 0.005628 | 38 | — |
| 0.191221073477 | 2.218887085766 | 56.82414805 | 381.0387 | 5.7e-9 | C 1.2e-12 | über den Umkehrpunkt | instabil | 6.55e+4 | 0.01001 | 34 | — |
| 1.148645083132 | 1.653982128866 | 57.56144606 | 609.6767 | 1.4e-10 | C 1.2e-10 | an der Rechengrenze | instabil | 105 | 0.001994 | 42 | — |
| 0.481838197783 | 2.173456338649 | 57.94828880 | 389.4823 | 6.9e-7 | C 2.6e-13 | über den Umkehrpunkt | offen | 2.973e+8 | 0.01004 | 30 | — |
| 1.119274589726 | 0.856822137924 | 60.06015423 | 1287.8639 | 1.3e-9 | B3 9.6e-13 | über den Umkehrpunkt | offen | 1.00 | 1.3e-4 | 88 | nur Klasse von I.A-1 |
| 0.193775260374 | 2.226437209951 | 64.73228271 | 425.2418 | 6.6e-9 | C 5.9e-13 | über den Umkehrpunkt | instabil | 1.010e+5 | 0.009947 | 38 | — |
| 1.426571086836 | 0.176553622000 | 69.78711995 | 1464.2447 | 6.4e-9 | B3 1.4e-11 | an der Rechengrenze | offen | 3.07 | 1.9e-5 | 100 | — |
| 1.036896348316 | 1.928537127301 | 70.47849086 | 519.5672 | 2.0e-6 | C 7.0e-13 | über den Umkehrpunkt | instabil | 3.214e+8 | 0.06679 | 42 | — |
| 1.507335733969 | 0.567550525227 | 78.08431379 | 1405.4778 | 1.7e-8 | B3 1.7e-11 | an der Rechengrenze | offen | 1.06e+4 | 8.6e-5 | 96 | Satellit 3. Ordnung von Fund (1.135898, 0.487365) (T* das 2.99964-fache) |
| 1.120592047778 | 0.838393029591 | 79.92325181 | 1726.9947 | 4.7e-10 | C 3.4e-11 | an der Rechengrenze | offen | 2.58 | 7.1e-5 | 118 | — |
| 1.432718451688 | 0.951669119141 | 80.32167109 | 1287.7880 | 3.4e-9 | B3 9.6e-12 | über den Umkehrpunkt | offen | 8.34 | 9.4e-5 | 88 | — |
| 0.899199442779 | -1.651017545799 | 81.62454082 | 1067.7587 | 1.2e-9 | C 3.3e-10 | an der Rechengrenze | offen | 1.35 | 5.7e-4 | 74 | — |
| 0.994302781290 | 1.562644723662 | 87.45260624 | 1189.2604 | 1.3e-9 | C 6.6e-11 | an der Rechengrenze | offen | 1.00 | 5.3e-4 | 82 | — |

## Nachprüfung in erhöhter Genauigkeit (2026-10-21 19:38 UTC)

12 Funde (in keiner Liste und Kandidaten: in double stabil, oder offen mit Indizes unter 30), Festkomma mit 320 Bit, Taylorreihe der Ordnung 40, Ziel 30 Stellen; Gegenprobe mit 448 Bit und Ordnung 52. Rechenzeit zusammen 54 min auf 7 Fäden.

| Urteil | Bahnen |
|---|---|
| belegt (Rest unter 1e-30, beide Rechnungen einig, Korrektur unter 1e-5) | **12** |
| belegt, aber verschoben | 0 |
| offen (Newton kam nicht unter 1e-30) | 0 |
| Zeitlimit | 0 |
| Ausnahmen | 0 |

Stabilität in erhöhter Genauigkeit (12 Bahnen): stabil **2**, an der Grenze 6, instabil 4, Zeitlimit 0, abgebrochen 0.

| a | b | T | Rest | Rest (448 Bit) | Korrektur gegen double | Rest in double | wahrer Rest dort | Schritte | s | Stabilität (double) | Stabilität (genau) | Abstand zur Grenze | Listen | Urteil |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1.1358983463372995860400 | 0.4873648200275113767509 | 19.3803105137514685060 | 9.2e-31 | 9.2e-31 | 2.2e-11 | 1.1e-10 | 5.0e-12 | 3955 | 69 | offen | an der Grenze | -2.6e-20 | in keiner | belegt |
| 1.1072414501795211144238 | 0.9923377223331286060112 | 20.3253550292048161163 | 1.6e-34 | 1.4e-34 | 1.7e-11 | 1.3e-11 | 7.5e-12 | 2529 | 36 | offen | stabil | 1.8e-11 | in keiner | belegt |
| 1.1399680397526883736712 | 0.2312752241619375947956 | 38.2812001192473376136 | 9.1e-35 | 1.7e-32 | 1.3e-9 | 1.2e-9 | 2.9e-9 | 10882 | 215 | offen | an der Grenze | -2.2e-24 | in keiner | belegt |
| 1.1307222374966781161516 | 0.6502746573827409192849 | 39.2434760511957237701 | 3.6e-31 | 3.6e-31 | 1.1e-10 | 1.4e-10 | 2.7e-10 | 6898 | 158 | offen | an der Grenze | -1.6e-26 | in keiner | belegt |
| 1.1165175183528691671553 | 0.8925740725381106063813 | 40.1958316102862070103 | 5.3e-33 | 3.6e-33 | 1.0e-10 | 1.6e-10 | 1.7e-10 | 5586 | 104 | offen | an der Grenze | -9.8e-23 | in keiner | belegt |
| 1.0678606608005651929671 | -1.244674765273272907597 | 41.7632633127481115973 | 1.6e-31 | 1.6e-31 | 3.8e-12 | 8.3e-11 | 1.3e-11 | 4094 | 65 | offen | stabil | 7.3e-11 | in keiner | belegt |
| 1.1192745897216289009475 | 0.8568221379233513021298 | 60.0601542310161358224 | 1.9e-32 | 1.8e-32 | 6.8e-11 | 1.3e-9 | 8.0e-10 | 8666 | 192 | offen | an der Grenze | 4.4e-27 | in keiner | belegt |
| 1.4265710868562167257385 | 0.1765536219915220673996 | 69.7871199522806855904 | 1.5e-34 | 7.2e-33 | 9.3e-10 | 6.4e-9 | 1.1e-9 | 17954 | 377 | offen | instabil | -6.2e-7 | in keiner | belegt |
| 1.1205920477770832193829 | 0.8383930295851283129626 | 79.9232518081220761545 | 1.8e-32 | 1.5e-32 | 2.5e-10 | 4.7e-10 | 2.1e-10 | 12044 | 311 | offen | an der Grenze | -3.2e-25 | in keiner | belegt |
| 1.4327184516853954674857 | 0.9516691191404309155542 | 80.3216710882394969549 | 7.2e-31 | 7.3e-31 | 2.5e-10 | 3.4e-9 | 4.8e-10 | 8584 | 257 | offen | instabil | -6.580 | in keiner | belegt |
| 0.8991994427796220329345 | -1.651017545799461953686 | 81.6245408205487081187 | 1.4e-33 | 1.7e-33 | 5.9e-11 | 1.2e-9 | 2.9e-11 | 5387 | 98 | offen | instabil | -1.3e-5 | in keiner | belegt |
| 0.9943027812896302297883 | 1.5626447236618436331808 | 87.4526062353371445418 | 1.9e-32 | 1.8e-32 | 8.4e-12 | 1.3e-9 | 5.5e-12 | 6056 | 108 | offen | instabil | -2.9e-5 | in keiner | belegt |
