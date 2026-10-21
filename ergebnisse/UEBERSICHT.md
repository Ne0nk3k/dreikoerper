# Übersicht der Suchläufe

Erzeugt von `uebersicht.mjs` am 2026-10-21 aus den Berichten in diesem Ordner.

| Lauf | Ebene | Massen | Suche | Raster | Perioden | Bahnen | bestätigt | über Umkehrpunkt | sicher stabil | in einer Liste | in keiner Liste | davon auf 30 Stellen belegt |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| [probe-256](probe-256.md) | Euler-Ebene | 1 / 1 / 1 | Wiederkehr | 256² | bis 30 | 43 Orte, 39 Bahnen | 42 | 0 | 5 | 43 | 0 | nicht nachgeprüft |
| [probe-1024](probe-1024.md) | Euler-Ebene | 1 / 1 / 1 | Wiederkehr | 1024² | bis 30 | 86 Orte, 74 Bahnen | 80 | 0 | 6 | 86 | 0 | nicht nachgeprüft |
| [euler-gleich-1](euler-gleich-1.md) | Euler-Ebene | 1 / 1 / 1 | Umkehrpunkte | 512² | bis 40 | 1040 Orte, 973 Bahnen | 182 | 630 | 11 | 856 | 184 | 184 von 184 geprüften |
| [probe-halb-256](probe-halb-256.md) | Euler-Ebene | 1 / 1 / 1 | Umkehrpunkte | 256² | bis 30 | 119 Orte, 113 Bahnen | 62 | 52 | 10 | 112 | 7 | 7 von 7 geprüften |
| [fall-gleich-1](fall-gleich-1.md) | Freier Fall | 1 / 1 / 1 | Umkehrpunkte | 512² | bis 16 | 554 Orte, 463 Bahnen | 5 | 242 | 0 | 222 | 332 Orte, 301 Bahnen | 332 von 332 geprüften |
| [euler-m3-2](euler-m3-2.md) | Euler-Ebene | 1 / 1 / 2 | Umkehrpunkte | 512² | bis 40 | 201 Orte, 195 Bahnen | 48 | 109 | 4 | 42 | 159 Orte, 156 Bahnen | 159 von 159 geprüften |
| [euler-m3-05](euler-m3-05.md) | Euler-Ebene | 1 / 1 / 0.5 | Umkehrpunkte | 512² | bis 40 | 2204 Orte, 2108 Bahnen | 327 | 1458 | 3 | 158 | 2046 Orte, 1976 Bahnen | 17 von 17 geprüften |
| [euler-m3-075](euler-m3-075.md) | Euler-Ebene | 1 / 1 / 0.75 | Umkehrpunkte | 512² | bis 40 | 980 Orte, 956 Bahnen | 171 | 562 | 5 | 110 | 870 Orte, 857 Bahnen | 3 von 3 geprüften |
| [euler-m3-4](euler-m3-4.md) | Euler-Ebene | 1 / 1 / 4 | Umkehrpunkte | 512² | bis 40 | 94 Orte, 93 Bahnen | 16 | 52 | 0 | 17 | 77 Orte, 76 Bahnen | 9 von 9 geprüften |
| [euler-m3-4-v2gross](euler-m3-4-v2gross.md) | Euler-Ebene | 1 / 1 / 4 | Umkehrpunkte | 1024² | bis 40 | 931 Orte, 899 Bahnen | 73 | 616 | 2 | 5 | 926 Orte, 894 Bahnen | 13 von 13 geprüften |
| [euler-m3-4-v1gross](euler-m3-4-v1gross.md) | Euler-Ebene | 1 / 1 / 4 | Umkehrpunkte | 1024² | bis 40 | 59 Orte, 58 Bahnen | 12 | 36 | 1 | 9 | 50 Orte, 49 Bahnen | 10 von 10 geprüften |

**bestätigt**: der volle Umlauf schließt sich in doppelter Genauigkeit, mit zwei unabhängigen Verfahren (Rest unter 1e-10, Gegenprobe unter 1e-8).
**über Umkehrpunkt**: nach der halben Periode steht die Bahn auf 1e-11 in einer Fixmenge der umkehrenden Symmetrien; der volle Umlauf ist für double zu empfindlich.
**in einer Liste**: Li/Liao 2017–2019, Šuvakov/Dmitrašinović 2013, bei gleichen Massen dazu die Datenbanken von Hristov u. a. (441 985 Anfangswerte in der Euler-Ebene, 29 442 im freien Fall).
**auf 30 Stellen belegt**: `nachpruefen.mjs` — Newton in 320-Bit-Festkomma bis Rest unter 1e-30, derselbe Rest noch einmal mit 448 Bit.
