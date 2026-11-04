# Periodic orbits of the planar three-body problem outside the published lists

Data package, generated 2026-11-04 by `fundbericht.mjs`. Authors: Felix Habl (idea and direction) and Claude, an AI model by Anthropic (code and computations). Contact: the issue tracker of the repository this package is published in.

**These orbits are not claimed to be new.** The claim is narrower: each one was compared with the lists named below and is in none of them, and each one is verified to 30 digits. Being outside the list *for the same masses* does not make an orbit a new family: the column `family` says whether its topology (free-group word) is listed at any mass.

## Contents

| File | Configuration | Masses | Orbits | stable / boundary / unstable / undecided | satellites of listed orbits | word in no list (of them stable) | T from … to | orbits in the reference list for these masses |
|---|---|---|---|---|---|---|---|---|
| `orbits-euler-1-1-0.5.txt` | isosceles collinear (Euler), zero angular momentum | 1/1/0.5 | 17 | 4 / 2 / 11 / 0 | 3 | 7 (0) | 9.6 … 80.5 | 565 (Li, Liao et al.) |
| `orbits-euler-1-1-0.75.txt` | isosceles collinear (Euler), zero angular momentum | 1/1/0.75 | 3 | 1 / 0 / 2 / 0 | 0 | 0 (0) | 22.1 … 71.2 | 401 (Li, Liao et al.) |
| `orbits-euler-1-1-1.txt` | isosceles collinear (Euler), zero angular momentum | 1/1/1 | 188 | 0 / 0 / 188 / 0 | 10 | 121 (0) | 21.4 … 92.7 | 699 (Li, Liao et al.) |
| `orbits-euler-1-1-2.txt` | isosceles collinear (Euler), zero angular momentum | 1/1/2 | 156 | 3 / 3 / 150 / 0 | 4 | 98 (0) | 7.8 … 91.8 | 237 (Li, Liao et al.) |
| `orbits-euler-1-1-4.txt` | isosceles collinear (Euler), zero angular momentum | 1/1/4 | 21 | 7 / 3 / 11 / 0 | 3 | 13 (3) | 14.0 … 91.9 | 85 (Li, Liao et al.) |
| `orbits-euler-1-1-5.txt` | isosceles collinear (Euler), zero angular momentum | 1/1/5 | 35 | 10 / 10 / 15 / 0 | 0 | 16 (5) | 19.3 … 102.9 | 35 (Li, Liao et al.) |
| `orbits-freefall-1-1-1.txt` | free fall | 1/1/1 | 301 | 0 / 0 / 301 / 0 | 0 | 1 (0) | 4.8 … 27.5 | 30 (Li, Liao et al.) |

Equal masses: 489 orbits. Unequal masses: 232 orbits. `stable.txt` lists the 43 orbits that are stable (S, S~), have an index equal to 2 (B), or are undecided.

**Which orbits are in these files.** The package contains the orbits that passed the 30-digit verification. From the equal-mass runs and the first run at 1/1/2, every orbit outside the lists was submitted to it. For the other runs only the candidates for stability were: orbits that double precision calls stable, or undecided with both stability indices below 30 in absolute value (calibrated on 325 orbits outside that range, none of which turned out stable at 30 digits). The other orbits these runs found outside the lists are in the run reports (`ergebnisse/`), verified in double precision only:

| Masses | search windows in (a, b) | orbits outside the lists (distinct T*, double precision) | in this package (30 digits) |
|---|---|---|---|
| 1/1/0.5 | 0…0.4 × 0…0.4 | 1975 | 17 |
| 1/1/0.75 | 0…0.6 × 0…0.6 | 857 | 3 |
| 1/1/1 | 0…0.75 × 0…0.75 | 191 | 188 |
| 1/1/2 | 1…1.5 × 0…1; 0…1.5 × 1…1.5; 0…0.75 × 0…0.75 | 793 | 156 |
| 1/1/4 | 1…2.4 × 0…1; 0…2.4 × 1…2.4; 0.6…1.05 × 0…1.05 | 943 | 21 |
| 1/1/5 | 1…2.75 × 0…1; 0…2.75 × 1…2.75 | 732 | 35 |
| 1/1/1 (free fall) | 0…0.5 × 0…0.88 | 300 | 300 (301 entries; 1 orbit met at two points) |

## Initial conditions

G = 1 throughout.
- **Euler files:** r1 = (−1, 0), r2 = (1, 0), r3 = (0, 0); v1 = v2 = (a, b); v3 = −(m1 + m2)/m3 · (a, b). This is the convention of Li & Liao (2017) and Li, Jing & Liao (2018).
- **Free-fall files:** r1 = (−0.5, 0), r2 = (0.5, 0), r3 = (a, b), all at rest, as in Li & Liao (2019).
- T is the period, T* = T·|E|^1.5 the scale-invariant period.

## How the orbits were found and verified

1. **Search.** A grid over the (a, b) plane. For each point the orbit is integrated (Taylor series, order 24, double precision) and its closest approach to one of the fixed sets of the reversing symmetries is recorded (a symmetric periodic orbit crosses such a set twice per period), in several time bands. Local minima of this map are refined by Newton's method on the half period.
2. **Check in double precision.** Full-period return, an independent Dormand–Prince integration, the free-group word (Montgomery's topological classification), the minimal period.
3. **Verification at 30 digits.** Newton's method in 320-bit fixed-point arithmetic with a Taylor integrator of order 40 until the return distance is below 1e-30; the residual is recomputed with 448 bits and order 52. An orbit is kept only if both agree and the correction to the double-precision value is small.
4. **Linear stability.** From the monodromy matrix; s1, s2 are the stability indices λ + 1/λ of the two nontrivial multiplier pairs. S: both |s| < 2 with a margin larger than the difference between the 320-bit and the 448-bit computation; S~ the same, but the margin is below 1e-3 (stable by a hair). B: an index equals 2 to within that difference — in practice to 26 digits, i.e. an exact unit multiplier pair. This happens far more often than chance allows (20 of 374 orbits within 1e-6 of 2, only 11 between 1e-6 and 1e-3); we do not know why. U: unstable.

## What the orbits were compared with

- Li & Liao, *Sci. China Phys. Mech. Astron.* 60 (2017): 695 families, equal masses.
- Li, Jing & Liao, *PASJ* 70 (2018): 1349 families, masses 1/1/m3 with m3 = 0.5, 0.75, 2, 4, 5, 8, 10.
- Li & Liao, *New Astronomy* 70 (2019): 316 free-fall orbits.
- Šuvakov & Dmitrašinović, *PRL* 110 (2013).
- For equal masses in addition the databases of Hristov, Hristova et al. (db2.fmi.uni-sofia.bg, retrieved 2026-10-01): 441 985 initial conditions in the Euler configuration, 29 442 in free fall, including the 971 stable orbits of arXiv:2510.22802.
- Cross-check against the catalogue of threebodyorbits.com (snapshot 2026-09-27, 3943 orbits). For the unequal masses above it contains exactly the orbits of Li, Jing & Liao (2018).

An orbit counts as listed if its initial point agrees with a listed one to 1e-6, or if its T* agrees to 2e-8 (the same orbit met at another point of the plane). Agreement of T* to five or six digits is *not* enough: we found pairs of distinct orbits of the same class with nearly equal T* and different stability.

## Families across all masses (column `family`)

A family continued in m3 keeps its free-group word as long as no close encounter becomes a collision. So an orbit outside the list for its own masses can still belong to a listed family — our stable orbit at 1/1/4 is the continuation of I.A-5 at 1/1/2. The word of every orbit was therefore compared, up to relabelling of all three bodies, cyclic shift and time reversal, with the words of all listed orbits at all masses and with the databases of Hristov et al. Free-fall orbits are compared within the free-fall plane (full period), because a word comparison across the two planes does not calibrate.

| family | orbits |
|---|---|
| new — word in no list | 256 |
| same word as a listed orbit (at another mass, or another orbit of a listed class) | 77 |
| word in the databases of Hristov et al. | 76 |
| word in a free-fall list | 300 |
| exact multiple of a listed word | 10 |
| satellite found within the run | 2 |
| not determined | 0 |

Calibration: our words reproduce 1346 of the 1349 published words of Li, Jing & Liao (2018) letter for letter, up to cyclic shift; of the other three, two (II.D-1, II.D-2) are written without free reduction in the list and reduce to the word we compute; in one (I.B-33) the list word lacks one letter of ours. Of our Euler-plane orbits that match a listed orbit by position or T*, 1408 of 1408 also find their word in the lists, and 221 of 222 in free fall.

## Caveats

- **Unequal masses:** the only list for these masses is Li, Jing & Liao (2018), one orbit per family; all but 3 of its 1349 orbits lie in the square 0 < a, b < 1. "Not in the list" says little there; the column `family` says more.
- **Satellites:** some orbits run k times almost along a listed orbit before closing (word and T* are k-fold). They are orbits of their own, but not unexplained ones; the column `sat` names the base orbit.
- Only symmetric orbits are found by the half-period search, and only within the search windows and period limits of each run.
- The comparison covers the lists above. Lists we do not know of are not covered.
- The search code was written with the help of an AI assistant (Claude, Anthropic); every number here comes from a computation, and the test batteries compare the code against published 100-digit initial conditions and eigenvalues.
