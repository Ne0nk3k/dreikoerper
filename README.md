# dreikoerper — periodic orbits of the planar three-body problem

A search engine for periodic orbits of the planar three-body problem (zero angular momentum, G = 1), the orbits it found that are in none of the published lists, and a 30-digit verification of each one.

Code comments and working notes are in German. This page, the data package in [`fundbericht/`](fundbericht/README.md) and the output of `bahn-pruefen.mjs` are in English.

## The main result: a linearly stable orbit at masses 1 : 1 : 4

Euler configuration: r1 = (−1, 0), r2 = (1, 0), r3 = (0, 0); v1 = v2 = (a, b); v3 = −(m1 + m2)/m3 · (a, b).

```
m1 = m2 = 1, m3 = 4
a = 0.80329455331149897894751545304123
b = 1.43593335078306727053457398659518
T = 53.25485430443248007068935995289679
```

- **Period:** the scale-invariant period T* = T·|E|^1.5 is 498.10304.
- **Stability:** the stability indices are s1 = 0.050097460726014453493487243479 and s2 = −0.059928082662415128925027567105. Both satisfy |s| < 2, so the orbit is linearly stable, with a margin of 1.94.
- **Word and closest approach:** the free-group word is `ABABABAbabababABABABAbabababaBABABABabababaB` (44 letters). The closest approach of two bodies is 0.0015.
- **Comparison with the literature:** the orbit is not in Li, Jing & Liao (2018), the only published list for these masses we know of. It is also not a k-fold satellite of any orbit in that list.

Check it yourself. No downloads are needed:

```
node bahn-pruefen.mjs
```

It integrates the digits above over one period at 320 and at 448 bits and prints the return distance. Then it computes both stability indices from the monodromy matrix. It takes about four minutes on one core.

**Searching further at these masses.** The bound region at 1 : 1 : 4 reaches |v| = 2.38. We also searched the part of it with a > 1 or b > 1, in two windows. That search found 913 distinct orbits outside the list, but no second clearly stable one. Five more orbits are stable only by a hair: one index lies between 1.3e-4 and 4.2e-15 below 2. They are in `fundbericht/stable.txt` as S~.

## What else is here

| Path | What |
|---|---|
| `fundbericht/` | The data package: all 686 orbits the searches found outside the lists and verified to 30 digits, with initial conditions, words and stability. Its README explains the method and the caveats. |
| `ergebnisse/` | The raw reports of every search run (JSON, Markdown, map images; German field names). |
| `kern.js` | The double-precision core: Taylor integrator, monodromy, free-group words. The same file runs in Node and in the lab. |
| `genau.mjs` | Fixed-point arithmetic on BigInt: Taylor order 40 to 52, 320 to 448 bits. |
| `suche.mjs`, `nachpruefen.mjs` | The search, and the 30-digit verification of a run's finds. |
| `pruef-*.mjs` | Test batteries: against analytic cases, against the published lists, and against the 100-digit data of Hristov et al. |
| `vorlage.html`, `bauen.mjs` | An interactive lab, built as a single offline HTML file. |
| `daten-holen.mjs`, `quelle/HERKUNFT.json` | Download of the published lists from their authors. |

## Reproduce

You need Node.js 18 or later. No npm packages are required; Playwright is needed only for `pruef-browser.mjs`.

```
node bahn-pruefen.mjs            # the stable 1/1/4 orbit, no downloads
node pruef-genau.mjs             # calibration of the 30-digit arithmetic, no downloads
node daten-holen.mjs             # the published lists, about 175 MB, each file checked by SHA-256
node katalog-bauen.mjs
node katalog-gross-bauen.mjs
node pruef-kern.mjs              # calibration of the core, including against the lists
node bauen.mjs --fassung v9      # the lab, written to labor/dreikoerper-labor-v9.html
```

Every check exits with code 0 only if every line passes.

The run that found the orbit above:

```
node suche.mjs --name euler-m3-4 --ebene euler --m 1,1,4 --art halb --raster 512 --tmax 40 --max 40000 --sicht 0.6,1.05,0,1.05
node nachpruefen.mjs euler-m3-4 --unbekannt --kandidaten
```

By default a search uses 42 % of the logical cores at low priority. The environment variable `DREIKOERPER_FAEDEN` sets the number of threads.

## Data from others (not included)

The published lists belong to their authors and are not redistributed here. `daten-holen.mjs` fetches them from these sources:

- **github.com/sjtu-liao/three-body:** Li & Liao (2017), Li, Jing & Liao (2018) and Li & Liao (2019), pinned to commit `b96b019`.
- **db2.fmi.uni-sofia.bg:** the databases of Hristov, Hristova, Dmitrašinović, Tanikawa et al.
- **data.threebodyorbits.com:** the catalogue of threebodyorbits.com.

`quelle/HERKUNFT.json` lists every file with its URL and SHA-256.

## Authors

Felix Habl had the idea and directed the work. The code, the computations and the documentation were written by Claude, an AI model by Anthropic, in conversation with him. Every number in this repository comes from a computation in this code. The test batteries compare that code against published high-precision data.

## License

- **Code:** MIT, see `LICENSE`.
- **Results and data package** (`ergebnisse/`, `fundbericht/`): [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). You may use them freely, with attribution.

For questions or corrections, please open an issue.
