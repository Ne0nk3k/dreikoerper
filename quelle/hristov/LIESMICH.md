# Datenbanken von Hristov, Hristova, Dmitrašinović, Tanikawa u. a.

Abgerufen am 01.10.2026 von <https://db2.fmi.uni-sofia.bg/>. Gleiche Massen,
Drehimpuls null. Vier Spalten je Zeile; in den Euler-Dateien (vx, vy, T, T*),
in den Freifall-Dateien (x, y, T, T*). T* = T·|E|^1.5.

| Ordner | Datei | Zeilen | Was | Arbeit |
|---|---|---|---|---|
| `euler` | `60digits.txt` | 421 562 | Euler-Ebene, T* bis 211, 60 Stellen | Nachtrag zu arXiv:2404.16526 („NEW!“ auf der Seite) |
| `euler` | `100_12431.txt` | 12 431 | Euler-Ebene, T* bis 74, 100 Stellen | arXiv:2404.16526 |
| `euler` | `add_332_100.txt` | 332 | nahe der Kurve E = 0 | ebd. |
| `euler` | `100_stable.txt` | 8 | die linear stabilen unter den 12 431 | ebd. |
| `euler` | `eigenvalues_12431.txt` | 12 431 × 4 | Eigenwerte, 20 Stellen | ebd. |
| `euler` | `syz_12431.txt` | 12 431 | Durchgangsfolgen | ebd. |
| `stab971` | `ics_971_100.txt` | 971 | linear stabile Bahnen, 100 Stellen | arXiv:2510.22802, New Astronomy 125 (Juli 2026) |
| `stab971` | `res_eig_angles.txt` | 971 | Eigenwerte und Stabilitätswinkel, 40 Stellen | ebd. |
| `free` | `sol_80.txt` | 24 582 | freier Fall, T* bis 80, 80 Stellen | arXiv:2308.16159 |
| `free` | `res_eigen.txt` | 24 582 × 4 | Eigenwerte | J. Phys.: Conf. Ser. 2910 012030 (2024) |
| `sym4860` | `euler_100_4860.txt`, `free_100_4860.txt` | 4860 | Bahnen mit Punktsymmetrie, beide Ebenen | arXiv:2503.00432 |
| `sat821` | `all_150_digits.txt` | 821 | Satelliten der Acht, 150 Stellen | arXiv:2203.02793 |
| `neu123` | `all_150_digits_123.txt` | 123 | 105 neue Familien | arXiv:2205.14709 |
| `chor164` | `triv_180.txt`, `nontriv_180.txt` | 259 + 164 | Choreographien, 180 Stellen | Phys. Part. Nuclei 55 (2024) |
| `chor462` | `digits180.txt` | 462 | triviale Choreographien | arXiv:2210.00594 |

## Die große Datei liegt nicht im Repo

`euler/60digits.txt` hat 112 095 692 Bytes und steht in `.gitignore`. Wer sie
braucht (nur `katalog-bauen.mjs` liest sie):

```
curl -o quelle/hristov/euler/60digits.txt https://db2.fmi.uni-sofia.bg/3bodyeuler/60digits.txt
sha256sum quelle/hristov/euler/60digits.txt
13ae312c7071e3b4d4ea3f1c8954eb8f367f43d3e6e5efce9739caeb571d97e9
```

Was daraus wird, liegt im Repo: `katalog-gross-euler.bin` (vier Spalten als
double) und `katalog-gross.json` (Zahlen je Quelle).
