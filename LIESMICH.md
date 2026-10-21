# Dreikörper — Suche nach periodischen Bahnen

Drei Körper, die einander anziehen, tun fast immer etwas, das sich nie
wiederholt. Dieses Projekt sucht die Ausnahmen: Anfangswerte, von denen aus
die drei nach einer Zeit T wieder genau so stehen und laufen wie am Anfang.

Zwei Teile:

- **Die Suchmaschine** (`suche.mjs`, Node, mehrere Kerne, gebremst). Rastert
  eine Ebene von Anfangswerten, verfolgt die aussichtsreichen Punkte bis auf
  eine geschlossene Bahn, prüft jeden Fund mit einem zweiten Verfahren,
  gleicht ihn mit den veröffentlichten Listen ab und schreibt einen Bericht.
- **Das Labor** (`Desktop\werke\dreikoerper-labor-v9.html`, eine Datei).
  Dieselbe Rechnung zum Anfassen: Karte, Bahn, Ergebnis. Doppelklick auf die
  Datei öffnet es. Die Verknüpfung **DREIKÖRPER** (eigenes Fenster, eigenes
  Symbol) lag bis zum 03.10.2026 auf dem Desktop und liegt jetzt in `start\`.

Das Projekt ist abgeschlossen und liegt seit dem 03.10.2026 in
`Documents\Projekte\dreikoerper`.

### Das Labor bedienen (seit v5)

Seit v5 sieht das Labor nicht mehr aus wie ein Messgerät (Felix, 02.10.2026):
das Ergebnis steht in Sätzen da, sichtbar ist, was man als Nächstes tun kann,
und Zahlen wie Einstellungen liegen hinter Klappen. Gemessen an der
Startansicht bei 1920 × 1080 (`werkzeug/bedienung-zaehlen.mjs`):

| | v4 | v5 |
|---|---|---|
| sichtbare Bedienelemente | 30 | 21 |
| Fachwörter im sichtbaren Text | 20 | 0 |
| lange Zahlen und Zehnerpotenzen | 7 | 0 |
| Elemente in Festbreitenschrift | 29 | 8 |
| Beschriftungen in gesperrten Versalien | 12 | 0 |
| Wörter im Bild | 245 | 166 |

Seit v6 sind es 22 sichtbare Bedienelemente — eins mehr, der dritte Reiter
„Schaukasten“ —, weiter 0 Fachwörter und 0 lange Zahlen (gezählt an v6 und v7).

Der Weg, in drei Schritten (so steht er auch auf dem Startblatt):

1. **Karte ansehen.** Jeder Punkt ist ein Start; hell heißt, ganz in der Nähe
   liegt eine Bahn, die sich schließt. Unter dem Zeiger steht in Worten, was
   dort ist („hier ist nichts“, „kühl“, „warm“, „heiß — klick hier“).
2. **Bahn finden** (Taste V) sucht von der angeklickten Stelle aus die
   geschlossene Bahn. **Alles absuchen** (J) tut das für jede helle Stelle im
   Bild.
3. **Stabilität messen** (M), mit Ton.

Der hervorgehobene Knopf wandert mit: erst „Bahn finden“, dann „Stabilität
messen“, dann „Merken“. Das „?“ an der Karte erklärt alles noch einmal.

| im Labor heißt es | in der Suchmaschine und in den Berichten |
|---|---|
| Bahn finden | verfeinern |
| Alles absuchen | Jagd |
| Start „in einer Reihe“ / „aus der Ruhe“ | Euler-Ebene / freier Fall |
| Die Karte sucht „Spiegelpunkte“ / „Rückkehr“ | Umkehrpunkte / Wiederkehr |
| Gewichte | Massen |
| Anstupsen | Störung |
| Formbild | Formkugel |
| vielleicht stabil | offen |

### Seit v6: das Bekannte steht nicht mehr in der Suche

Felix, 02.10.2026: „ich suche ausschließlich neue, unbekannte“ — die
bekannten Bahnen sollten heraus oder getrennt zum Anschauen liegen. Seit v6
gibt es drei Listen:

| Reiter | was darin steht |
|---|---|
| **Meine Funde** | was du gefunden hast und in keiner Liste steht. Grau „ungeprüft“: das Labor kann es nicht entscheiden (siehe unten) |
| **Fundus** | was die Suchmaschine in ihren langen Läufen außerhalb der Listen gefunden hat und was stabil ist oder es sein kann; „Ableger“ heißt Satellit einer bekannten Bahn |
| **Schaukasten** | alle bekannten: die gelisteten Bahnen aus den Läufen der Suchmaschine, die stabil sind oder es sein können, und jede bekannte, die du selbst getroffen hast. Ansehen und nachmessen ja, mitgezählt nein |

Bei mehreren Gewichtssätzen steht über jeder Gruppe eine Zwischenzeile.

**Nach stabilen Bahnen suchen** sucht das Bild ab, misst danach jede Bahn,
die in keiner Liste steht, und zeigt nur die Kandidaten darunter. Der Ton
sagt, wie die Suche ausging: aufwärts, wenn ein stabiler Kandidat dabei ist;
zweimal gleich, wenn keiner stabil, aber einer offen ist (seit v7: offen mit
beiden Indizes unter 30); abwärts, wenn keiner — auch dann, wenn gar nichts
außerhalb der Listen gefunden wurde.

Drei Dinge machen die Trennung verlässlich:

- **Das Labor weiß, was die Suchmaschine schon geprüft hat.** Es trägt die
  große Liste von Hristov u. a. nur bis T = 40 und vergleicht dort nur den
  Ort. Dazu kommt jetzt eine Tabelle aller Bahnen aus den Läufen der
  Suchmaschine (skalierte Periode T*, gelistet ja oder nein, Urteil aus 30
  Stellen). Trifft das Labor eine davon, gilt das Urteil der Suchmaschine.
  Anlass: im ersten Probelauf stand eine stabile Bahn als „ungeprüft“ unter
  den eigenen Funden, die die Suchmaschine längst als gelistet kennt (an
  anderer Stelle der Ebene getroffen).
- **Das Labor übernimmt das 30-Stellen-Urteil**, wo seine schnelle Messung
  „vielleicht“ sagt und die Suchmaschine entschieden hat — mit dem Satz
  dazu, woher es kommt. Die Messung bleibt auf Knopfdruck.
- **Das Grundfenster der Karte richtet sich nach den Gewichten.** Bei 1/1/4
  lag im festen Fenster 0…0,75 keine einzige Listenbahn; jetzt umfasst es
  95 % der Listenbahnen der gewählten Gewichte, mit Rand (gemessen bei
  1/1/0,5 bis 1/1/10: 96 bis 100 %; bei 1/1/2 227 von 237). Eine Bahn, die
  aus einer Liste geladen wird, liegt immer auf der Karte — das Fenster
  wächst dafür.

„Ungeprüft“ bleibt, was weder in der eingebetteten Liste steht noch je in
einem Lauf der Suchmaschine war. „Neu“ steht nirgends.

**v7** (03.10.2026, aus der Durchsicht, ohne neue Funktion):

- **Dieselbe Kandidatenregel wie die Suchmaschine.** „Kandidat“ heißt:
  stabil, oder offen mit beiden Indizes unter 30. Offen mit einem Index über
  30 war bei 325 von 325 Bahnen auf 30 Stellen nicht stabil; solche Bahnen
  stehen mit blassem Ring da, aber nicht unter „Kandidaten“, und der Ton nach
  der Suche zählt sie nicht. Bei 1/1/0,5 zeigte v6 nach der Suche 26
  Kandidaten, v7 zeigt die 3, die es sind.
- **„Stabil um Haaresbreite“** (ein Index weniger als 0,001 unter 2) ist
  eine eigene Stufe im Fundus und zählt nicht unter „sicher stabil“; „an der
  Grenze“ heißt jetzt, was es ist: ein Index exakt 2.
- **Eine geladene Bahn liegt immer auf der Karte** (die stabile bei 1/1/4
  hat v₂ = 1,436, das Grundfenster endet bei 1,1).
- **Die Marke („nicht gelistet“, „ungeprüft“) hat eine eigene Spalte**;
  gekürzt wird der Spitzname, nie die Auskunft.

**v8** (03.10.2026, ebenfalls aus der Durchsicht): ein **Ableger** einer
bekannten Bahn (Satellit) heißt unter „Meine Funde“ jetzt so und nicht
„nicht gelistet“ — die Suchmaschine kennt die Satelliten ihrer Läufe und gibt
es über dieselbe Tabelle weiter. Bei 1/1/0,5 betrifft das eine der drei
stabilen Bahnen, die die Suche im Labor findet (T 9,62, Satellit 3. Ordnung
der Acht-Familie I.A-1).

**v9** (03.10.2026, früh): eine Bahn, die die Suchmaschine schon auf 30
Stellen nachgerechnet hat, heißt im Ergebnis „Geschlossene Bahn, auf 30
Stellen belegt“ — vorher stand dort „Wohl eine geschlossene Bahn … sicher
erst nach der Nachprüfung“, auch bei der besten Bahn der Nacht (1/1/4,
T 53,25).

Im Probelauf der Browserprüfung (gleiche Gewichte, Spiegelpunkte, Standardfenster):
78 Bahnen gefunden, 71 davon bekannt (16 nur dank der Tabelle der
Suchmaschine erkannt), 7 außerhalb der Listen, alle 7 instabil — bei 3 hat
das Labor das Urteil der Suchmaschine übernommen. Kein Kandidat, Ton abwärts.
Das deckt sich mit der Suchmaschine: bei gleichen Gewichten ist keine Bahn
außerhalb der Listen stabil. Bei den Gewichten 1/1/0,5 (v8, Grundfenster):
220 Bahnen gefunden, 165 außerhalb der Liste, 3 davon stabil — eine als
„Ableger“ markiert —, 23 offene mit einem Index über 30 nicht unter den
Kandidaten; Ton aufwärts.

### Stabilität im Labor: auf Knopfdruck, mit Ton

Das Labor rechnet die Stabilität einer Bahn nicht von selbst mit. Erst der
Knopf **„Stabilität messen“** (Taste M) löst die Messung aus — dieselbe wie
in der Suchmaschine (Monodromie aus zwölf Tangenten). Gemessen im Labor:
0,01 bis 0,05 s vom Knopfdruck bis zum Urteil, an Bahnen mit T von 6 bis
144; im Kern in Node über 15 Bahnen im Median 0,03 s, höchstens 0,39 s
(T = 63,5). Danach ein Ton:

| Ton | heißt |
|---|---|
| zwei Töne aufwärts | **stabil** |
| zwei Töne abwärts, tiefer | **instabil** |
| zweimal derselbe Ton | **nicht entscheidbar — die Bahn kann stabil sein** |

**Der mittlere Ton ist bei stabilen Bahnen der Normalfall, nicht die
Ausnahme.** Stabile Bahnen liegen fast immer hauchdünn an der Grenze, und
doppelte Genauigkeit trennt das nicht: von 113 stabilen Bahnen der Literatur
(T < 150) nennt diese Messung 17 „stabil“ und 96 „nicht entscheidbar“ — und
keine „instabil“ (`pruef-hristov.mjs`, Abschnitt C). Aufwärts heißt also
„sicher stabil“, abwärts „sicher instabil“, der mittlere „kann stabil sein“.
Entschieden wird so eine Bahn in erhöhter Genauigkeit
(`nachpruefen.mjs <lauf> --unbekannt --kandidaten`). Hat die Suchmaschine sie
schon entschieden, übernimmt das Labor seit v6 deren Urteil (stabil oder
instabil) und sagt dazu, woher es kommt. Seit v7 gilt eine offene Bahn mit
einem Index über 30 nicht mehr als Kandidat: von 325 solchen war auf 30
Stellen keine stabil.

„Ton an / Ton aus“ daneben (Taste T) schaltet ihn stumm; die Anzeige bleibt.
**„Alle messen“** unter der Liste misst die Bahnen der offenen Liste, die noch
kein Urteil haben (im Probelauf 28 Bahnen in 0,4 s), und spielt am Ende einen
Ton für alle zusammen: aufwärts, wenn eine stabile dabei ist; den mittleren,
wenn keine stabil, aber ein Kandidat offen ist; sonst abwärts. Die Jagd
rechnet die Stabilität nicht mit; grün markiert sind in der Liste nur
gemessene stabile Bahnen. Bahnen aus einem geladenen Lauf der Suchmaschine
bringen ihr Urteil mit.

Was daran **nicht** auf Knopfdruck wartet: die Suchmaschine in Node
(`suche.mjs`, `nachpruefen.mjs`) rechnet die Stabilität weiter mit, weil ihre
Berichte sie brauchen. Und: gemessen ist, dass der Browser den Ton auslöst
und welchen — angehört hat ihn noch niemand.

Was herausgekommen ist, steht in `ergebnisse\UEBERSICHT.md` und
`ergebnisse\FUNDE.md`. Diese Datei erklärt, wie man es bedient und woran man
erkennt, dass die Zahlen stimmen.

## Was herausgekommen ist (Stand 02.10.2026)

### Gleiche Massen

| | Euler-Ebene | Freier Fall |
|---|---|---|
| Lauf | `euler-gleich-1`, Raster 512², T bis 40 | `fall-gleich-1`, Raster 512², T bis 16 |
| gefundene Orte in der Ebene | 1040 | 554 |
| verschiedene Bahnen (gleiches T* einmal gezählt) | 973 | 463 |
| davon in einer veröffentlichten Liste | 856 Orte | 222 Orte |
| in keiner Liste | 184 Bahnen | 301 Bahnen (332 Orte) |
| davon auf 30 Stellen belegt | 184 | 301 (alle 332 Orte) |
| davon linear stabil | 0 | 0 |
| sicher stabile Bahnen im Lauf, alle bekannt | 11 | 0 |
| von den gelisteten Bahnen im Fenster wiedergefunden | 586 von 34 107 (1,7 %) | 115 von 28 819 (0,4 %) |

Dazu sieben Bahnen aus einem Probelauf; drei Bahnen stehen in beiden Ebenen.
Zusammen **489 verschiedene periodische Bahnen, die in keiner der geprüften
Listen stehen, jede auf 30 Stellen belegt** (`ergebnisse\FUNDE.md`,
maschinenlesbar `funde.json`).

Drei Dinge, die diese Zahl einordnen:

- **Keine davon ist stabil.** Wo doppelte Genauigkeit das Urteil offen ließ
  (an 295 Fundstellen), hat die Rechnung in Festkomma entschieden: 295-mal
  instabil, der kleinste größte Stabilitätsindex ist 420 (die Grenze liegt
  bei 2). Stabile Bahnen findet die Suche — elf im Euler-Lauf —, aber die
  sind alle schon veröffentlicht.
- **„In keiner Liste“ heißt nicht „neu“.** In den beiden großen Läufen steht
  unter T* = 60 jede gefundene Bahn in den Listen (234 von 234); die einzige
  Ausnahme stammt aus dem Probelauf (T* = 50,76 bei T = 42, nahe der Kurve
  E = 0). Die Funde beginnen dort, wo die Listen dünner werden, und 115 der
  301 Bahnen im freien Fall liegen über T* = 120, wo die Listen gar nicht
  hinreichen.
- **Ein Teil sind Satelliten bekannter Bahnen.** Zehn der 184 Euler-Funde
  tragen genau (oder bis auf vier Buchstaben) das k-fache Wort einer
  gelisteten Bahn und das k-fache T*: Begleiter der Acht, der Brille, von
  Motte I und dreier Bahnen aus Hristovs Liste. Eigene Bahnen, aber keine
  unerwarteten.
- **Die Suche ist nicht vollständig, und zwar deutlich nicht.** Von den
  gelisteten Bahnen im selben Fenster findet sie 1,7 % und 0,4 %. Sie sieht,
  was ihr Raster sieht.

Ob die Funde jemanden interessieren: die Gruppe um Hristov und Hristova
pflegt die größte Liste (`quelle\hristov\LIESMICH.md`) und veröffentlicht
dazu. 161 der 188 Bahnen in der Euler-Ebene liegen mit T* unter 211, 54 der
301 im freien Fall mit T* unter 80 (186 unter 120) — also in dem Bereich,
den ihre Listen abdecken, und fehlen dort (`werkzeug/funde-zahlen.mjs`). Das
wäre ein Grund, ihnen die Werte zu schicken. Geschickt ist nichts; das
entscheidet Felix.

### Ungleiche Massen (1, 1, 2) — eine eigene Rechnung, eigens zu lesen

| Lauf `euler-m3-2`, Euler-Ebene, Raster 512², T bis 40 | |
|---|---|
| gefundene Orte / verschiedene Bahnen | 201 / 195 |
| auf 30 Stellen belegt | 201 von 201 |
| bei Li und Liao (Ort oder gleiches T* auf acht Stellen) | 42 Orte |
| von Li/Liaos Bahnen im Fenster mit T ≤ 40 wiedergefunden | 15 von 15 |
| in keiner Liste | 156 Bahnen (159 Orte) |
| davon in einer Klasse, die Li/Liao führen (andere Bahn derselben Familie) | 32 Orte |
| davon Satelliten der gelisteten Bahn I.A-2 (Wort das k-fache, T* das k-fache) | 5 Orte |
| davon linear stabil / an der Grenze / instabil | 3 / 3 / 150 |
| stabile Bahnen im ganzen Lauf (Festkomma) | 13: sieben mit Abstand zur Grenze ab 2,6·10⁻⁵, sechs innerhalb von 5·10⁻⁹; dazu sechs „an der Grenze“ (ein Index exakt 2) |

**Diese 156 gehören nicht zu den 489.** Für ungleiche Massen gibt es hier als
Vergleich nur Li und Liao: 237 Bahnen für diese Massen, je Klasse eine. Die
großen Listen gelten nur für gleiche Massen. „In keiner Liste“ heißt hier
also nur „nicht unter diesen 237“; andere Arbeiten zu ungleichen Massen sind
nicht geprüft.

Die drei stabilen (Anfangsgeschwindigkeiten v₁, v₂ von Körper 1 und 2,
30 Stellen in `ergebnisse\FUNDE.md`):

| v₁ | v₂ | T | T* | Stabilitätsindizes (Grenze 2) | Abstand zur Grenze | bei Li/Liao |
|---|---|---|---|---|---|---|
| 0,536783574010 | 0,484978557526 | 70,8193930795 | 454,472 | 1,217241 und −1,234090 | 0,77 | **Satellit 7. Ordnung der stabilen Li/Liao-Bahn I.A-2**: Wort genau das siebenfache, T* das 7,00015-fache |
| 0,665584482804 | 0,528055110718 | 70,8209227203 | 378,406 | 2 − 1,2·10⁻¹⁰ und −1,721787 | 1,2·10⁻¹⁰ | Klasse von I.B-15, anderes T* |
| 0,651181731549 | 0,412366894833 | 57,5331080797 | 346,753 | 2 − 3,1·10⁻¹⁴ und −1,533888 | 3,1·10⁻¹⁴ | Klasse von I.A-10, anderes T* |

Die erste ist deutlich stabil — und sie ist keine Überraschung: ein
**Satellit**. Sie läuft siebenmal fast denselben Weg wie die bekannte stabile
Bahn I.A-2 (T* = 64,923), bevor sie sich schließt. Um eine stabile Bahn
herum gibt es solche Begleiter regelmäßig; die Liste führt sie nicht, weil
sie je Klasse eine Bahn führt, und der Abgleich mit den Listen sucht
gleiches T*, keine Vielfachen. Der Laufbericht prüft deshalb eigens auf
Satelliten und benennt sie in der Spalte „Listen“ (`abschluss.mjs`). Derselbe
Lauf hat drei weitere Satelliten von I.A-2 gefunden (2., 3. und 4. Ordnung;
den dritter Ordnung an zwei Stellen der Ebene), alle instabil. Bei gleichen Massen sind zehn der 184 Euler-Funde Satelliten
gelisteter Bahnen — der Acht (13- und 17-fach), der Brille, von Motte I.

Die beiden anderen sind stabil nur um Haaresbreite: ein Index liegt 10⁻¹⁰
bzw. 10⁻¹⁴ unter der Grenze. Beide tragen das Wort einer gelisteten Bahn
und ein T*, das von deren um weniger als 2·10⁻⁴ abweicht — vermutlich
Geschwister aus einer Verzweigung. Das ist ein Urteil der 30-stelligen
Rechnung, keines, auf das man eine Aussage über das wirkliche Verhalten
bauen sollte.

Woran das Stabilitätsurteil bei ungleichen Massen hängt:

- Doppelte Genauigkeit und Festkomma sagen dasselbe (1,217291 / −1,234107
  gegen 1,217241 / −1,234090; an I.A-2 auf sieben Stellen gleich). Das sind
  zwei Rechnungen, aber **dasselbe Verfahren** (Variationsgleichungen, Spur
  der Monodromie) — ein gemeinsamer Denkfehler fiele so nicht auf.
- Geeicht ist das Verfahren an Rouths Formel für die Lagrange-Kreisbahn —
  einem Sollwert, der von keiner Rechnung abhängt: in doppelter Genauigkeit
  an vier Massensätzen, in Festkomma an drei ungleichen. Dort stimmen die
  Indizes für m = (1, 0,01, 0,01) und (1, 0,02, 0,005) auf 30 Stellen mit
  der Formel überein (größte Abweichung 1,4·10⁻³⁰), das komplexe Paar für
  m = (1, 2, 3) auf 15 (`pruef-genau.mjs`, Abschnitt E). An fremden
  periodischen Bahnen ist die Festkommarechnung nur bei gleichen Massen
  geprüft (`pruef-hristov.mjs`).
- Eine Gegenprobe, die nur die Kraft kennt (`werkzeug/stoerprobe.mjs`):
  Anfangswert um 10⁻⁸ verschoben, 20 Umläufe gerechnet. Bei der stabilen
  Bahn wächst der Abstand gleichmäßig (Umlauf 10 → 20: Faktor 2,00), ebenso
  bei I.A-2; beim instabilen Satelliten 4. Ordnung (|λ| = 2,69) um den
  Faktor 329. Einen schwach instabilen Satelliten (|λ| = 1,03) trennt diese
  Probe über 20 Umläufe nicht von einem stabilen.

### Weitere Massen — die Nacht vom 02. auf den 03.10.2026

Felix wollte die Nacht genutzt haben. Gesucht wurde dort, wo der erste
Versuch bei ungleichen Massen schon stabile Bahnen außerhalb der Liste
gebracht hatte und wo es eine Vergleichsliste gibt: bei den Gewichten
1/1/0,5, 1/1/0,75 und 1/1/4. Das Suchfenster ist jeweils das Rechteck um die
Listenbahnen dieser Gewichte (`werkzeug/fenster.mjs`; das feste Fenster
0…0,75 hätte bei 1/1/4 keine einzige enthalten). Raster 512², Perioden bis
40, 40 000 Kandidaten durch die Prüfkette, eine Rechnung zur Zeit, CPU im
Mittel 45 %, höchstens 50 %. Die Tabellen schreibt
`werkzeug/nacht-tabelle.mjs` aus den Ergebnisdateien.

| Lauf | Gewichte | Fenster v₁ × v₂ | Orte / Bahnen | Listenbahnen im Fenster (T ≤ 40) wiedergefunden | nicht bei Li/Liao 2018 | Kandidaten für Stabilität | davon stabil / an der Grenze / instabil (30 Stellen) | Suchzeit |
|---|---|---|---|---|---|---|---|---|
| `euler-m3-05` | 1 / 1 / 0,5 | 0…0,4 × 0…0,4 | 2204 / 2108 | 72 von 74 | 1976 | 17 | 4 / 2 / 11 | 17 min |
| `euler-m3-075` | 1 / 1 / 0,75 | 0…0,6 × 0…0,6 | 980 / 956 | 45 von 45 | 857 | 3 | 1 / 0 / 2 | 19 min |
| `euler-m3-2` (02.10.) | 1 / 1 / 2 | 0…0,75 × 0…0,75 | 201 / 195 | 15 von 15 | 156 | 9 | 3 / 3 / 3 | 25 min |
| `euler-m3-4` | 1 / 1 / 4 | 0,6…1,05 × 0…1,05 | 94 / 93 | 5 von 6 | 76 | 9 | 2 / 2 / 5 | 28 min |

„An der Grenze“ heißt in dieser Tabelle und unten: ein Index liegt exakt
bei 2 — auf 26 Stellen, mehr als der Unterschied der beiden Rechnungen
hergibt. Das ist kein „knapp daneben“, sondern ein genau einfaches
Eigenwertpaar, und warum es so oft vorkommt, ist nicht geklärt (AUFGABEN,
offen Punkt 6).

**Kandidaten** sind die Funde außerhalb der Liste, die in double stabil sind
oder offen mit beiden Indizes unter 30 (`nachpruefen.mjs --kandidaten`, geeicht
siehe „Bedienen“). Nur sie sind auf 30 Stellen nachgerechnet; die übrigen
Funde sind gefunden und in double geprüft, mehr nicht.

Die stabilen und die an der Grenze, alle auf 30 Stellen:

| Gewichte | v₁ | v₂ | T | Urteil | Stabilitätsindizes | Abstand zur Grenze | engste Begegnung | Verwandtschaft |
|---|---|---|---|---|---|---|---|---|
| 1 / 1 / 0,5 | 0,208385982751 | 0,066268864029 | 9,616972 | stabil | 1,437657 und −0,351667 | 0,56 | 7,6·10⁻⁵ | Satellit 3. Ordnung von I.A-1 |
| 1 / 1 / 0,5 | 0,312287688412 | 0,103614627616 | 16,818706 | **stabil** | 1,990817 und −1,350370 | 0,0092 | 0,011 | Klasse von I.B-4, anderes T* |
| 1 / 1 / 0,5 | 0,276094088353 | 0,103186106770 | 49,356005 | **stabil** | 1,856545 und 0,266200 | 0,14 | 9,8·10⁻⁵ | Klasse von I.A-19, anderes T* |
| 1 / 1 / 0,5 | 0,313676523380 | 0,105172108195 | 63,017397 | stabil um Haaresbreite | 2 − 4,7·10⁻⁹ und −1,998962 | 4,7·10⁻⁹ | 8,3·10⁻⁴ | Klasse von II.A-4, anderes T* |
| 1 / 1 / 0,5 | 0,278605199146 | 0,064274532627 | 79,711271 | Index exakt 2 | 2,000000 und 1,934948 | — | 9,6·10⁻⁵ | Klasse von I.A-45, T* 3,5·10⁻⁸ daneben (andere Bahn, `grauzone.mjs`) |
| 1 / 1 / 0,5 | 0,217583316000 | 0,031719767006 | 80,513066 | Index exakt 2 | 2,000000 und −0,453477 | — | 3,9·10⁻⁵ | keine gelistete Klasse |
| 1 / 1 / 0,75 | 0,157764078493 | 0,092653153515 | 71,210334 | **stabil** | 1,373168 und −0,077420 | 0,63 | 5,6·10⁻⁵ | Klasse von I.B-60, T* 1,1·10⁻⁶ daneben (andere Bahn) |
| 1 / 1 / 4 | 0,879470011060 | 0,702980367878 | 32,666697 | stabil um Haaresbreite | 1,999907 und 1,990901 | 9,3·10⁻⁵ | 7,2·10⁻⁴ | Satellit 2. Ordnung von I.A-2 |
| 1 / 1 / 4 | 0,803294553311 | 1,435933350783 | 53,254854 | **stabil** | 0,050097 und −0,059928 | 1,94 | 0,0015 | keine gelistete Klasse |
| 1 / 1 / 4 | 0,998088209318 | 0,274255978635 | 51,024895 | Index exakt 2 | 2,000000 und 0,518556 | — | 2,5·10⁻⁵ | Klasse von I.A-6, anderes T* |
| 1 / 1 / 4 | 0,972644433301 | 0,960354367676 | 72,822702 | Index exakt 2 | 2,000000 und 0,812431 | — | 2,2·10⁻⁴ | Klasse von II.B-2, anderes T* |

Fett: **deutlich stabil (Abstand zur Grenze über 0,001), kein Satellit** —
vier Bahnen. Zu unterscheiden sind sie trotzdem:

- **Eine gehört zu keiner gelisteten Familie:** 1/1/4, T = 53,25. Beide
  Indizes liegen nahe 0, weit innen im stabilen Bereich; ihr T* ist kein
  Vielfaches einer Listenbahn dieser Gewichte (k = 2 … 10, ±2 %;
  `werkzeug/satellit-katalog.mjs`).
- **Drei tragen das Wort einer gelisteten Familie** (I.B-4, I.A-19, I.B-60)
  mit anderem T*: andere Bahnen derselben Familie. Bei I.B-60 liegt das T*
  nur 1,1·10⁻⁶ neben dem der Listenbahn — auf 30 Stellen nachgerechnet eine
  andere Bahn, aber eine sehr nahe Verwandte.

Die deutlich stabile vom 02.10. bei 1/1/2 ist ein Satellit.

Was dagegen spricht, sie zu feiern:

- **Verglichen ist nur mit Li und Liao 2018**, je Klasse eine Bahn. Der Atlas
  threebodyorbits.com und die großen Dateien von Li/Liao kennen für diese
  Gewichte nichts anderes (`quelle\WEITERE-LISTEN.md`); der Atlas trifft
  keine der vier.
- **Sehr enge Begegnungen.** Bei zwei der vier kommen sich zwei Körper bis
  auf 10⁻⁴ nahe (9,8·10⁻⁵ und 5,6·10⁻⁵), bei den beiden anderen auf 0,011
  und 0,0015. Das ist bei diesen Gewichten üblich (die gelisteten Bahnen
  bei 1/1/0,5: Median 7,8·10⁻⁴), heißt aber: stabil für Punktmassen.
- **Häufung bei Index 2.** Bei zehn der siebzehn (die drei vom 02.10. bei
  1/1/2 mitgezählt) liegt ein Index auf mindestens acht Stellen genau bei 2.
  Es kommt **nur bei ungleichen Massen** vor (22 von 90 nachgerechneten
  Bahnen; bei gleichen 0 von 295, allerdings fast nur stark instabile), nur
  in der Euler-Ebene, nur bei den Spiegelpunkten B3 und C, und immer als +2
  (`werkzeug/index-zwei.mjs`). Das deutet auf eine Ursache im Aufbau — zwei
  gleiche Massen und eine andere —, nicht auf Zufall — über alle Läufe bei 20 von 374
  Bahnen mit Stabilität aus 30 Stellen. Das ist kein Zufall, und die Ursache
  ist nicht geklärt (AUFGABEN, offen Punkt 6). Diese Bahnen heißen hier „um
  Haaresbreite“ oder „an der Grenze“, nicht stabil.

**Gegenprobe ohne Monodromie** (`werkzeug/stoerprobe-lauf.mjs`: um 10⁻⁸
anstoßen, 20 Umläufe). Bei 1/1/2 wachsen alle 19 stabilen und Grenzbahnen
gleichmäßig (Abstand von Umlauf 10 bis 20 × 2,00 bis 2,02), bei 1/1/4 alle
vier, bei 1/1/0,5 fünf von sechs; bei der sechsten verliert double die Bahn
selbst. Die instabilen Gegenstücke wachsen, wo die Probe trägt, × 185 und
× 755. **Die stabile bei 1/1/0,75 bestätigt die Probe nicht:** sie wächst
von Umlauf 10 bis 20 × 3,3 — schneller als gleichmäßig, langsamer als jede
instabile. Länger trägt die Probe in double nicht: ab Umlauf 24 entfernt sich
die ungestörte Bahn selbst weiter von ihrem Anfang als ein Zehntel des
gemessenen Abstands (`stoerprobe-lauf.mjs --umlaeufe 160`; eine erste
Fassung des Werkzeugs bewertete das erst am Ende und ließ mich hier
fälschlich „über 40 Umläufe gleichmäßig“ schreiben). Ungeklärt; eine Probe
über mehr Umläufe in Festkomma steht aus.

**Gegenprobe der Stabilitätsrechnung an fremden Werten**
(`werkzeug/atlas-stabil.mjs`): 168 Listenbahnen ungleicher Massen, die die
Läufe am Ort getroffen haben, gegen max |λ| im Atlas — Urteil 168 von 168
gleich; die 20 mit Stabilität aus 30 Stellen weichen höchstens 4,8·10⁻⁵ ab.

### Der Bereich über 1 bei 1/1/4 — 21.10.2026

Von den 85 Listenbahnen bei 1/1/4 (Li, Jing & Liao 2018) haben 82 beide
Werte v₁, v₂ unter 1. Gebunden bleiben die drei Körper bei 1/1/4 aber bis
|v| = 2,3805 (aus der Energie gerechnet, in jeder Richtung gleich), und die
stabile Bahn T = 53,25 liegt mit v₂ = 1,436 außerhalb des Quadrats. Abgesucht
wurde deshalb der Rest des gebundenen Bereichs, in zwei Fenstern, Raster
1024², Perioden bis 40, je 40 000 Kandidaten — die tiefsten von 215 582 (A)
und 411 345 (B) Talsohlen.

| Lauf | Fenster v₁ × v₂ | Bahnen | in keiner Liste | Listenbahnen wiedergefunden | Kandidaten | davon stabil / um Haaresbreite / an der Grenze / instabil (30 Stellen) | Suchzeit |
|---|---|---|---|---|---|---|---|
| `euler-m3-4-v2gross` (A) | 0…2,4 × 1…2,4 | 899 | 894 | 2 von 2 | 13 | 1 / 3 / 0 / 9 | 23 min |
| `euler-m3-4-v1gross` (B) | 1…2,4 × 0…1 | 58 | 49 | 0 von 0 | 10 | 1 / 5 / 3 / 1 | 20 min |

**Eine zweite deutlich stabile Bahn ist nicht dabei.** Die eine „stabil“ in
jedem Fenster ist die bekannte (T = 53,25), von beiden Fenstern unabhängig
wiedergefunden, mit denselben 30 Stellen. Neu für uns sind fünf Bahnen um
Haaresbreite — Abstand zur Grenze 1,3·10⁻⁴ (T 18,54), 3,7·10⁻¹⁰ (T 56,43),
2,0·10⁻⁶ (T 73,51), 4,2·10⁻¹⁵ (T 74,57), 2,3·10⁻⁷ (T 84,40) — und eine
weitere mit einem Index exakt 2 (T 91,87). Bei T 73,51 und 84,40 liegen
**beide** Indizes bei 2. Bei 10 der 12 übrigen Kandidaten aus A liegt ein Index
auf mindestens drei Stellen bei 2; das ist das Muster aus AUFGABEN, Punkt 6,
und dem bin ich auf Felix' Wunsch vom 03.10. nicht nachgegangen.

Die vier Bahnen, die beide Fenster gefunden haben, kommen in beiden
Nachrechnungen mit denselben Indizes heraus (4 von 4). Zwei Funde aus B
liegen mit T* nahe an einer Listenbahn (1,4·10⁻⁷ an I.A-10, 9,7·10⁻⁷ an
I.B-7); auf 30 Stellen sind es andere Bahnen (`werkzeug/grauzone.mjs`). Eine
Bahn aus B (T 39,18) ist dieselbe wie die um Haaresbreite stabile vom
03.10. (T 32,67, Satellit von I.A-2), in anderer Lage. Im Bereich v₁ über 1
schließt sich wenig: von 40 000 geprüften Stellen ergaben 38 024 keine Bahn.

Keine der fünf neuen um Haaresbreite ist ein Vielfaches einer Listenbahn
(`werkzeug/satellit-katalog.mjs`); am nächsten kommt T 73,51 an 4× II.C-1,
Wort 6 Buchstaben daneben (die Regel lässt 4 zu). Die Störprobe
(`werkzeug/stoerprobe-lauf.mjs`) sieht bei allen stabilen und Grenzbahnen
beider Fenster gleichmäßiges Wachstum, Abstand(20)/Abstand(10) = 2,00 bis
2,36; bei T 74,57 trägt sie nicht (double verliert die Bahn selbst nach 20
Umläufen um 1,4·10⁻⁵). Um Haaresbreite von genau an der Grenze trennen kann
sie nicht — das kann nur die Rechnung auf 30 Stellen.

## Bedienen

```
node suche.mjs --name mein-lauf                       Euler-Ebene, gleiche Massen, Raster 512, T bis 40
node suche.mjs --name fein --raster 1024 --tmax 60 --max 100000
node suche.mjs --name fall --ebene fall --tmax 16     freier Fall
node suche.mjs --name m2 --m 1,1,2                    ungleiche Massen (m1 = m2 muss bleiben)
node suche.mjs --name eng --sicht 0.3,0.4,0.2,0.3     ein Ausschnitt der Ebene

node nachpruefen.mjs mein-lauf --unbekannt            Funde außerhalb der Listen auf 30 Stellen
node nachpruefen.mjs mein-lauf --unbekannt --mitStabil   dazu die Stabilität, wo double sie offen lässt
node nachpruefen.mjs mein-lauf --unbekannt --offene   noch einmal, was offen oder am Zeitlimit hängen blieb
node nachpruefen.mjs mein-lauf --unbekannt --kandidaten  nur die Kandidaten für Stabilität (double stabil,
                                                      oder offen mit beiden Indizes unter 30), samt Stabilität
node uebersicht.mjs                                   UEBERSICHT.md und FUNDE.md neu schreiben
node nachbereiten.mjs mein-lauf                       alten Bericht mit heutigem Kern neu auswerten
node fundbericht.mjs                                  Paket zum Weitergeben nach fundbericht\ (englisch; gesendet wird nichts)

node werkzeug/fenster.mjs                             wo die Listenbahnen je Masse liegen — Suchfenster wählen
node werkzeug/grauzone.mjs mein-lauf                  Funde knapp neben einer Listenbahn: beide auf 30 Stellen, dieselbe?
node werkzeug/stoerprobe-lauf.mjs mein-lauf           stabile Bahnen anstoßen und 20 Umläufe zusehen
node werkzeug/atlas-pruefen.mjs                       Gegenprobe gegen den Atlas threebodyorbits.com
node werkzeug/nacht-tabelle.mjs                       alle Läufe ungleicher Massen in einer Tabelle
```

`--kandidaten` ist geeicht: von 325 Bahnen, die in double offen waren mit
einem Index über 30, war auf 30 Stellen keine stabil und keine an der
Grenze. Bei 1/1/0,5 macht das aus 2046 Funden außerhalb der Liste 17
Kandidaten; die 17 brauchten eine Stunde. Die übrigen Funde sind gefunden
und in double geprüft, aber nicht auf 30 Stellen belegt.

Ein Lauf schreibt `ergebnisse\<name>.json`, `.md` und `.png`. Die `.json`
lässt sich im Labor laden („Lauf laden“).

Lange Läufe gehören in den Hintergrund und in eine Protokolldatei:
`node suche.mjs … > ablage\lauf.log 2>&1`. Der Fortschritt steht im Protokoll.
`nachpruefen.mjs` sichert alle 30 Sekunden und setzt beim nächsten Aufruf fort.

### Rechenlast

Der Schwarm nimmt höchstens 42 % der logischen Kerne (5 von 12) und läuft in
der niedrigsten Prioritätsklasse; das Labor hält sich an dieselbe Zahl. Das
ist fest eingebaut. Seit dem 21.10.2026 setzt `DREIKOERPER_FAEDEN=<n>` die
Zahl der Fäden, höchstens zwei Drittel der Kerne (8 von 12); die vereinbarte
Grenze ist jetzt 80 % gesamt. Gemessen mit sieben Fäden: 62 bis 63 % im
Mittel, höchstens 69 %. Gemessen mit fünf Fäden: CPU gesamt im Mittel 46 %,
höchstens 49 %, rund 1 GB Speicher. **Immer nur ein Lauf zur Zeit** — zwei
nebeneinander verdoppeln die Last, und das erzwingt kein Code.
`powershell -ExecutionPolicy Bypass -File werkzeug\last.ps1` misst nach.

### Symbol und Startprogramm

```
node symbol.mjs                                          symbol\dreikoerper.ico aus der gerechneten Acht
powershell -ExecutionPolicy Bypass -File start\bauen.ps1    Dreikoerper-Labor.exe und die Verknüpfung DREIKÖRPER
powershell -ExecutionPolicy Bypass -File start\probe.ps1    löst den Start aus, bildet das Fenster ab, schließt es
```

`Dreikoerper-Labor.exe` sucht die neueste Fassung `dreikoerper-labor-v<N>.html`
in `werke\` und öffnet sie über Edge (sonst Chrome) in einem eigenen Fenster
ohne Adresszeile; ist das Labor schon offen, holt es das Fenster nach vorn.
Es rechnet und zeichnet selbst nichts — das Labor bleibt die eine HTML-Datei.

## Die zwei Ebenen

| Ebene | Start | zwei Zahlen |
|---|---|---|
| **Euler** | Körper 1 bei −1, Körper 2 bei +1, Körper 3 bei 0. 1 und 2 starten mit derselben Geschwindigkeit, 3 trägt den Gegenimpuls. | (v₁, v₂), die Geschwindigkeit von 1 und 2 |
| **Freier Fall** | Körper 1 bei (−½, 0), Körper 2 bei (½, 0), alle in Ruhe. | (x₃, y₃), der Ort von Körper 3 |

Das sind die zwei Schnitte, in denen die Literatur sucht; deshalb lassen sich
Funde mit ihren Listen vergleichen.

## Die zwei Arten zu suchen

**Über den Umkehrpunkt (`--art halb`, Vorgabe).** Beide Ebenen starten in
einer Stellung, die ihr eigenes Spiegelbild in der Zeit ist. Trifft die Bahn
nach der Zeit τ noch einmal eine solche Stellung, läuft sie von dort
spiegelbildlich zurück und ist periodisch mit 2τ (oder 4τ, 6τ …). Es sind
drei Gleichungen in drei Unbekannten, und die Rechnung geht nur über die
halbe Periode: wo eine Störung über den ganzen Umlauf um den Faktor |λ|
wächst, wächst sie hier um √|λ|.

**Über die Wiederkehr (`--art voll`).** Der kleinste Abstand, auf den die
Bahn ihrem Anfang wieder nahekommt. Findet jede Art Bahn, auch
unsymmetrische — aber nur zahme: der Trichter um eine Bahn ist etwa 1/|λ|
breit, und die meisten Bahnen haben |λ| über 10⁵.

Gemessen am selben Fenster (Raster 256, T bis 30): 43 Bahnen über die
Wiederkehr, 119 über den Umkehrpunkt.

## Die Prüfkette je Fund

1. **Rest** — Wiederkehrabstand nach T, mit der Taylorreihe (Ordnung 24).
2. **Gegenprobe** — dasselbe mit Dormand–Prince 5(4). Die beiden Verfahren
   teilen keine Zeile Rechnung.
3. **Grundperiode** — die erste Wiederkehr entlang der Bahn; ein Vielfaches
   ist keine zweite Bahn.
4. **Stabilität** — Monodromie aus zwölf Tangenten, Indizes aus zwei Spuren.
   Ein Urteil nur, wenn der Abstand zur Grenze über dem gemessenen Fehler
   liegt; sonst „offen“. Offene entscheidet `nachpruefen.mjs --mitStabil` in
   Festkomma: erst eine schnelle Stufe (zwei Rechnungen mit 20 und 30
   Stellen Schrittschärfe), die nur „klar instabil“ sagen darf, sonst die
   volle Rechnung mit 320 und 448 Bit.
5. **Topologie** — Durchgangsfolge auf der Formkugel, Wort in a, b, A, B.
6. **Abgleich** — Ort in der Ebene (10⁻⁶) und skalierte Periode T* (acht
   Stellen) gegen die Listen.

Urteile im Bericht:

| Urteil | heißt |
|---|---|
| bestätigt | voller Umlauf in double: Rest unter 10⁻¹⁰, Gegenprobe unter 10⁻⁸ |
| über den Umkehrpunkt | halber Umlauf trifft die Spiegelstellung auf 10⁻¹¹; der volle ist für double zu empfindlich |
| an der Rechengrenze | konvergiert, aber gröber |
| belegt (nach `nachpruefen.mjs`) | Rest unter 10⁻³⁰ in 320-Bit-Festkomma, zweite Rechnung mit 448 Bit einig |

## Woran man sieht, dass es stimmt

Jede Batterie urteilt im Exit-Code.

| Batterie | prüft gegen | Ergebnis am 01./02.10.2026 |
|---|---|---|
| `pruef-kern.mjs` | Lagrange-Kreisbahn (analytisch), Rouths Stabilitätskriterium, Tabelle von 2013, Wörter von Li/Liao | 56 von 56: Rouths Indizes auf 7 Stellen; alle 15 Bahnen von 2013 konvergieren; Wörter stimmen; die Stabilität auf Abruf liefert auf das Bit dasselbe wie die mitgerechnete (Median 0,03 s) |
| `pruef-hristov.mjs` | 100-stellige Anfangswerte und 20- bis 40-stellige Eigenwerte von Hristov u. a. | 12 von 12 (am 02.10.): 12 Bahnen auf 29 bis 30 Nachkommastellen; \|λ\| und Urteil an 131 von 131; von 113 stabilen Bahnen der Quelle keine „instabil“ genannt (17 stabil, 96 offen); in Festkomma die Indizes von acht stabilen Bahnen auf 29 Stellen und \|λ\| von sechs instabilen (10² bis 10¹²) auf 16 Stellen, auch über die schnelle Stufe |
| `pruef-genau.mjs` | √2, Lagrange-Kreisbahn in Festkomma, Rouths Formel bei ungleichen Massen | 15 von 15: Bahn auf 3·10⁻⁴⁰; Stabilitätsindizes bei ungleichen Massen auf 30 Stellen wie Routh |
| `pruef-katalog.mjs` | alle 2360 Bahnen von Li/Liao | Wörter 1958 von 1963 gleich; zeigt, wo double aufhört |
| `pruef-browser.mjs` | das ausgelieferte Labor (v9) | 50 von 50: eine Bahn aus dem Fundus heißt „auf 30 Stellen belegt“; bei 1/1/0,5 findet „Nach stabilen Bahnen suchen“ die 3 stabilen außerhalb der Liste, zeigt nur diese 3 als Kandidaten, markiert den Satelliten unter ihnen als „Ableger“ und gibt den Ton aufwärts; der Sammelton an festen Fällen; eine Bahn außerhalb des Grundfensters liegt nach dem Laden auf der Karte; Aufbau (Startblatt, Klappen, Hilfe, ein Hauptknopf); die drei Listen getrennt (keine gelistete Bahn unter den eigenen Funden oder im Fundus, der Schaukasten nur mit bekannten); „Nach stabilen Bahnen suchen“ misst nur, was in keiner Liste steht, übernimmt das 30-Stellen-Urteil der Suchmaschine und widerspricht ihr nirgends; Grundfenster je Gewichtssatz; die Liste beginnt nach dem Reiterwechsel oben; derselbe Kern auf das Bit gleich wie in Node; Stabilität erst auf Knopfdruck (0,01 bis 0,05 s bei T von 6 bis 144); jeder der drei Töne einmal ausgelöst; „Alle messen“ im Schaukasten findet die fünf stabilen der Jagd; keine der 168 Bahnen aus den Läufen der Suchmaschine (Fundus und Schaukasten) misst das Labor instabil (23 stabil, 145 vielleicht) |
| `werkzeug/lage-eichen.mjs` | den Abgleich selbst | Ortstreffer liegen höchstens 8·10⁻¹¹ vom Listenwert, Nichttreffer mindestens 2·10⁻⁵ |
| `werkzeug/grauzone.mjs` | die Schwelle 2·10⁻⁸ für „dieselbe Bahn“ | bei 1/1/0,5 sechs Funde mit T* 3,5·10⁻⁸ bis 6,1·10⁻⁷ neben einer Listenbahn: beide auf 30 Stellen verfeinert, der Abstand bleibt derselbe — sechs andere Bahnen. Dieselbe Bahn stimmte auf 10⁻¹² |
| `werkzeug/stoerprobe-lauf.mjs` | das Stabilitätsurteil, ohne Monodromie | siehe „Weitere Massen“ |
| `werkzeug/atlas-pruefen.mjs` | den Abgleich gegen eine fremde Sammlung | der Atlas threebodyorbits.com findet 2363 von 2364 unserer Listenbahnen wieder; sein Feld „stab“ ist max \|λ\| (an acht selbst gemessenen Bahnen; in der ersten Fassung war eine davon falsch gepaart — Li/Liaos II.B-1 statt der Garn — und blieb ungenannt) |
| `werkzeug/lage-pruefen.mjs` | die Stufe „dieselbe Bahn, andere Lage“, an der Stabilität | nach der alten Regel (T* auf fünf Stellen) 88 Funde, davon 26 mit anderem \|λ\| als die Listenbahn und 6 mit anderer Stabilität; seit dem 02.10. gilt T* auf acht Stellen (62 der 88) |

Jede Prüfung hat ihre Gegenprobe: eine falsche Eingabe, an der sie rot werden
muss (Abschnitt B in `pruef-kern.mjs`).

## Was „in keiner Liste“ heißt

Geprüft wird gegen:

- Li und Liao 2017–2019: 695 Familien gleicher Massen, 1349 ungleicher, 316 im
  freien Fall (`quelle\*.md`, von github.com/sjtu-liao/three-body)
- Šuvakov und Dmitrašinović 2013: 15 Anfangswerte
- Hristov, Hristova, Dmitrašinović, Tanikawa u. a.: 441 985 Anfangswerte in
  der Euler-Ebene (T* bis 211), 29 442 im freien Fall (T* bis 80 bzw. 120),
  gleiche Massen (`quelle\hristov\LIESMICH.md`)

„In keiner Liste“ heißt: weder am selben Ort noch mit derselben skalierten
Periode in einer dieser Dateien. Es heißt nicht „neu“. Andere Listen kann es
geben; für ungleiche Massen gibt es außer Li/Liao hier gar keine.

## Grenzen

- **Nur symmetrische Bahnen** über den Umkehrpunkt. Unsymmetrische findet nur
  `--art voll`, und die nur, wenn sie zahm sind.
- **Nur die Talsohlen, die das Raster sieht.** Gegen die Liste von Hristov
  u. a. findet ein Lauf mit Raster 512 unter den Bahnen mit T ≤ 40 knapp
  2 %. Die Liste ist ihrerseits nicht vollständig (sonst gäbe es keine Funde
  außerhalb).
- **double trägt nicht alles.** Den vollen Umlauf einer Bahn mit |λ| = 10¹⁰
  kann doppelte Genauigkeit nicht schließen. Deshalb `nachpruefen.mjs`.
- **Ebene Bahnen, Drehimpuls null** in der Euler-Ebene bei m₁ = m₂.

## Aufbau

```
kern.js              Rechenkern: Kraft, zwei Integratoren, Wiederkehr, Umkehrpunkte,
                     Verfeinerung, Monodromie, Topologie. Kein DOM.
suche.mjs            Karte → Talsohlen → Newton → Prüfkette
abschluss.mjs        zusammenlegen → Abgleich → Bericht (auch für nachbereiten.mjs)
genau.mjs            Taylorreihe und Newton in Festkomma auf BigInt
nachpruefen.mjs      Funde eines Laufs durch genau.mjs
schwarm.mjs, arbeiter.mjs   Verteilung auf alle Kerne
quellen.mjs          liest quelle\, lädt die Kataloge, gleicht ab
katalog-bauen.mjs, katalog-gross-bauen.mjs
vorlage.html, bauen.mjs     das Labor
pruef-*.mjs          die Batterien
werkzeug\            Einzelmessungen, die einmal eine Frage entschieden haben
quelle\              die Listen im Original
ergebnisse\          Berichte der Läufe
```
