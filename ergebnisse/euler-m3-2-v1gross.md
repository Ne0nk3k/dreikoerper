# Suchlauf euler-m3-2-v1gross

2026-10-21 17:07 UTC · Euler-Ebene · Massen 1 / 1 / 2 · Fenster v₁ 1…1.5, v₂ 0…1 · Raster 1024×1024 · Perioden bis 40 · Suche über Umkehrpunkte (halbe Periode)

## Was der Lauf getan hat

| Stufe | Zahl |
|---|---|
| Rasterpunkte gerechnet | 1048576 in 92 s auf 7 Fäden |
| davon durchgelaufen / Zerfall / abgebrochen / ungebunden | 367677 / 427517 / 1647 / 251735 |
| Talsohlen (unter 0.3) in 4 Zielen × 6 Zeitbändern | 41786 |
| davon durch die Prüfkette | 40000 in 419 s |
| Umkehrpunkt verfehlt | 39478 |
| Umkehrpunkt getroffen, aber nach 12τ nicht zurück (nur bis auf eine Drehung periodisch) | 94 |
| geschlossene Bahn | 428 |
| verschiedene Orte in der Ebene | **20** |
| verschiedene Bahnen (gleiches T* auf acht Stellen einmal gezählt) | **19** |
| — bestätigt (voller Umlauf: Rest < 1e-10 und Gegenprobe < 1e-8) | 2 |
| — über den Umkehrpunkt (halber Umlauf auf 1e-11 getroffen, voller für double zu empfindlich) | 14 |
| — an der Rechengrenze | 4 |
| sicher linear stabil | 0 |
| Ausnahmen im Schwarm | 0 |

Je Ziel (Fixmenge, die nach der halben Periode getroffen wird):

| Ziel | Kandidaten | Umkehrpunkt getroffen | geschlossene Bahn |
|---|---|---|---|
| A3 | 3341 | 106 | 106 |
| C | 24672 | 50 | 31 |
| B3 | 4309 | 209 | 186 |
| R | 7678 | 157 | 105 |

## Bekannt oder nicht

Von den 20 Funden stehen **1** in einer der geprüften Listen, **19** in keiner. Als verschiedene Bahnen gezählt (eine Bahn kann die Ebene an mehreren Stellen kreuzen): 19, davon **18** in keiner Liste.

| Liste | Stufe | Bahnen | Bedeutung |
|---|---|---|---|
| Li/Liao 2017–2019, Šuvakov/Dmitrašinović 2013 (2364 Bahnen, mit Klassen) | Ort | 0 | steht mit diesen Anfangswerten in der Liste |
| | Lage | 1 | gleiches T* auf acht Stellen: Listenbahn, an anderer Stelle getroffen |
| | Klasse | 2 | Klasse in der Liste, aber anderes T*: weitere Bahn derselben Familie |
| | keine | 17 | Klasse nicht in der Liste |
| Hristov u. a. | — | — | nur für gleiche Massen; hier nicht anwendbar |

**Für die Massen 1 / 1 / 2 gibt es als Vergleich nur Li und Liao: 237 Bahnen, je Klasse eine, davon 30 mit T bis 40.** Die großen Listen von Hristov u. a. gelten nur für gleiche Massen. „In keiner Liste“ sagt in diesem Lauf deshalb wenig: fast alles, was eine Suche bei diesen Massen findet, steht in keiner Liste, weil es kaum eine gibt.

„In keiner Liste“ heißt genau das und nicht „neu“. Die Listen sind in sich begrenzt: Li und Liao führen je Klasse eine Bahn bis T = 200, gefunden auf einem Raster von 4000²; Hristov u. a. führen die Euler-Ebene bis T* = 211 und den freien Fall bis T* = 80 (mit Punktsymmetrie bis 120).

## Gegenrichtung: was der Lauf von den Listen wiederfindet

| Liste | Bahnen im Fenster mit T bis 40 | gefunden | Anteil |
|---|---|---|---|
| Li/Liao, 2013 | 0 | 0 | — |

![Karte](euler-m3-2-v1gross.png)

Karte: hell = die Bahn kommt bis zur halben Höchstperiode einer Fixmenge nahe. Weißer Ring = Fund, der in einer Liste steht (nur bei bis zu 3000 Funden gezeichnet). Grüner Punkt = Fund, der in keiner Liste steht. Rotes Kreuz = Bahn aus Li/Liao, die der Lauf verpasst hat.

## Funde in keiner Liste (19)

| v₁ | v₂ | T | T* | Rest (voller Umlauf) | Umkehrpunkt | Urteil | Stabilität | \|λ\| | engste Begegnung | Wortlänge | Listen |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1.004536542510 | 0.151832855093 | 22.45349718 | 85.3535 | 2.9e-10 | B3 5.9e-14 | über den Umkehrpunkt | instabil | 3.88e+3 | 0.003851 | 16 | — |
| 1.069149545887 | 0.339152935791 | 30.35697942 | 84.8207 | 1.3e-10 | A3 8.5e-13 | über den Umkehrpunkt | instabil | 5.57e+3 | 7.4e-4 | 16 | — |
| 1.055491634512 | 0.206843183042 | 31.94597629 | 103.2720 | 7.5e-10 | A3 3.9e-11 | an der Rechengrenze | instabil | 3.697e+5 | 6.4e-5 | 20 | — |
| 1.062486238692 | 0.409838264312 | 32.12952401 | 84.5658 | 1.5e-10 | B3 1.0e-12 | über den Umkehrpunkt | instabil | 2.36e+4 | 6.6e-4 | 16 | — |
| 1.052232760210 | 0.109970163912 | 32.97175229 | 112.1284 | 1.6e-7 | A3 9.5e-11 | an der Rechengrenze | offen | 8.987e+5 | 5.3e-5 | 22 | — |
| 1.108463947483 | 0.281209373649 | 36.29931145 | 93.9027 | 3.0e-9 | A3 4.0e-12 | über den Umkehrpunkt | instabil | 2.24e+4 | 7.2e-5 | 18 | — |
| 1.102437731780 | 0.216092012650 | 37.18305133 | 103.2720 | 7.8e-9 | B3 7.2e-11 | an der Rechengrenze | instabil | 3.696e+5 | 7.1e-5 | 20 | — |
| 1.105700650347 | 0.357391146183 | 38.81523471 | 93.6898 | 5.6e-10 | A3 1.3e-12 | über den Umkehrpunkt | instabil | 7.58e+4 | 0.001359 | 18 | — |
| 0.944659486061 | 0.870081598124 | 45.70743291 | 60.1706 | 2.3e-8 | R 1.8e-13 | über den Umkehrpunkt | offen | 1.92e+3 | 5.6e-5 | 0 | nur Klasse von II.D-2 |
| 1.004753570295 | 0.303919077985 | 46.11028806 | 160.4406 | 6.5e-7 | C 3.1e-12 | über den Umkehrpunkt | instabil | 4.355e+7 | 0.009467 | 30 | — |
| 0.415478580025 | 1.174765629588 | 47.86560204 | 78.8317 | 1.8e-11 | C 2.2e-14 | bestätigt | instabil | 4.59e+3 | 0.1448 | 18 | — |
| 0.939952397243 | -0.747193081533 | 61.89203177 | 127.1896 | 2.6e-9 | C 1.1e-13 | über den Umkehrpunkt | instabil | 1.887e+6 | 0.01546 | 24 | — |
| 1.063779726100 | 0.478372968744 | 66.96104850 | 158.8948 | 1.9e-6 | C 7.0e-13 | über den Umkehrpunkt | offen | 2.776e+8 | 0.001195 | 30 | — |
| 1.056561643595 | 0.517276989344 | 69.57134563 | 158.6094 | 2.4e-6 | C 8.0e-12 | über den Umkehrpunkt | instabil | 1.879e+9 | 0.007507 | 30 | — |
| 1.008027805142 | 0.837500145090 | 70.73848935 | 77.7406 | 2.4e-7 | R 1.3e-12 | über den Umkehrpunkt | offen | 1.13e+4 | 7.0e-6 | 0 | nur Klasse von II.D-2 |
| 0.940185666529 | -0.760147708686 | 73.62235626 | 145.7240 | 6.4e-8 | C 2.6e-13 | über den Umkehrpunkt | instabil | 5.794e+7 | 0.004075 | 28 | — |
| 0.939315725067 | 0.817725716551 | 75.81392697 | 125.3198 | 1.7e-7 | C 2.3e-13 | über den Umkehrpunkt | instabil | 4.533e+7 | 0.007790 | 24 | — |
| 1.008782747906 | 0.714831994346 | 78.63395678 | 136.2682 | 2.4e-6 | C 1.6e-11 | an der Rechengrenze | instabil | 4.799e+6 | 0.01651 | 26 | — |
| 1.025872274928 | 0.687360589056 | 83.71911135 | 146.2129 | 3.0e-8 | C 3.4e-14 | über den Umkehrpunkt | instabil | 1.689e+7 | 0.01750 | 28 | — |


## Sicher linear stabile Funde (0)

| v₁ | v₂ | T | T* | Rest (voller Umlauf) | Umkehrpunkt | Urteil | Stabilität | \|λ\| | engste Begegnung | Wortlänge | Listen |
|---|---|---|---|---|---|---|---|---|---|---|---|

## Alle Funde (20)

| v₁ | v₂ | T | T* | Rest (voller Umlauf) | Umkehrpunkt | Urteil | Stabilität | \|λ\| | engste Begegnung | Wortlänge | Listen |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1.004536542510 | 0.151832855093 | 22.45349718 | 85.3535 | 2.9e-10 | B3 5.9e-14 | über den Umkehrpunkt | instabil | 3.88e+3 | 0.003851 | 16 | — |
| 1.069149545887 | 0.339152935791 | 30.35697942 | 84.8207 | 1.3e-10 | A3 8.5e-13 | über den Umkehrpunkt | instabil | 5.57e+3 | 7.4e-4 | 16 | — |
| 1.055491634512 | 0.206843183042 | 31.94597629 | 103.2720 | 7.5e-10 | A3 3.9e-11 | an der Rechengrenze | instabil | 3.697e+5 | 6.4e-5 | 20 | — |
| 1.062486238692 | 0.409838264312 | 32.12952401 | 84.5658 | 1.5e-10 | B3 1.0e-12 | über den Umkehrpunkt | instabil | 2.36e+4 | 6.6e-4 | 16 | — |
| 1.052232760210 | 0.109970163912 | 32.97175229 | 112.1284 | 1.6e-7 | A3 9.5e-11 | an der Rechengrenze | offen | 8.987e+5 | 5.3e-5 | 22 | — |
| 1.108463947483 | 0.281209373649 | 36.29931145 | 93.9027 | 3.0e-9 | A3 4.0e-12 | über den Umkehrpunkt | instabil | 2.24e+4 | 7.2e-5 | 18 | — |
| 1.102437731780 | 0.216092012650 | 37.18305133 | 103.2720 | 7.8e-9 | B3 7.2e-11 | an der Rechengrenze | instabil | 3.696e+5 | 7.1e-5 | 20 | — |
| 0.964711263408 | 0.785704145168 | 37.71368404 | 62.7409 | 5.9e-11 | B3 6.5e-13 | bestätigt | instabil | 4.27e+3 | 0.01140 | 12 | lage: II.C-3 |
| 1.105700650347 | 0.357391146183 | 38.81523471 | 93.6898 | 5.6e-10 | A3 1.3e-12 | über den Umkehrpunkt | instabil | 7.58e+4 | 0.001359 | 18 | — |
| 0.944659486061 | 0.870081598124 | 45.70743291 | 60.1706 | 2.3e-8 | R 1.8e-13 | über den Umkehrpunkt | offen | 1.92e+3 | 5.6e-5 | 0 | nur Klasse von II.D-2 |
| 1.004753570295 | 0.303919077985 | 46.11028806 | 160.4406 | 6.5e-7 | C 3.1e-12 | über den Umkehrpunkt | instabil | 4.355e+7 | 0.009467 | 30 | — |
| 0.415478580025 | 1.174765629588 | 47.86560204 | 78.8317 | 1.8e-11 | C 2.2e-14 | bestätigt | instabil | 4.59e+3 | 0.1448 | 18 | — |
| 0.939952397243 | -0.747193081533 | 61.89203177 | 127.1896 | 2.6e-9 | C 1.1e-13 | über den Umkehrpunkt | instabil | 1.887e+6 | 0.01546 | 24 | — |
| 1.063779726100 | 0.478372968744 | 66.96104850 | 158.8948 | 1.9e-6 | C 7.0e-13 | über den Umkehrpunkt | offen | 2.776e+8 | 0.001195 | 30 | — |
| 1.056561643595 | 0.517276989344 | 69.57134563 | 158.6094 | 2.4e-6 | C 8.0e-12 | über den Umkehrpunkt | instabil | 1.879e+9 | 0.007507 | 30 | — |
| 1.008027805142 | 0.837500145090 | 70.73848935 | 77.7406 | 2.4e-7 | R 1.3e-12 | über den Umkehrpunkt | offen | 1.13e+4 | 7.0e-6 | 0 | nur Klasse von II.D-2 |
| 0.940185666529 | -0.760147708686 | 73.62235626 | 145.7240 | 6.4e-8 | C 2.6e-13 | über den Umkehrpunkt | instabil | 5.794e+7 | 0.004075 | 28 | — |
| 0.939315725067 | 0.817725716551 | 75.81392697 | 125.3198 | 1.7e-7 | C 2.3e-13 | über den Umkehrpunkt | instabil | 4.533e+7 | 0.007790 | 24 | — |
| 1.008782747906 | 0.714831994346 | 78.63395678 | 136.2682 | 2.4e-6 | C 1.6e-11 | an der Rechengrenze | instabil | 4.799e+6 | 0.01651 | 26 | — |
| 1.025872274928 | 0.687360589056 | 83.71911135 | 146.2129 | 3.0e-8 | C 3.4e-14 | über den Umkehrpunkt | instabil | 1.689e+7 | 0.01750 | 28 | — |

## Nachprüfung in erhöhter Genauigkeit (2026-10-21 17:44 UTC)

0 Funde (in keiner Liste und Kandidaten: in double stabil, oder offen mit Indizes unter 30), Festkomma mit 320 Bit, Taylorreihe der Ordnung 40, Ziel 30 Stellen; Gegenprobe mit 448 Bit und Ordnung 52. Rechenzeit zusammen 0 min auf 7 Fäden.

| Urteil | Bahnen |
|---|---|
| belegt (Rest unter 1e-30, beide Rechnungen einig, Korrektur unter 1e-5) | **0** |
| belegt, aber verschoben | 0 |
| offen (Newton kam nicht unter 1e-30) | 0 |
| Zeitlimit | 0 |
| Ausnahmen | 0 |

| a | b | T | Rest | Rest (448 Bit) | Korrektur gegen double | Rest in double | wahrer Rest dort | Schritte | s | Stabilität (double) | Stabilität (genau) | Abstand zur Grenze | Listen | Urteil |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
