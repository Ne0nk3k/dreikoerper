# Periodic orbits of the planar three-body problem outside the published lists

Data package, generated 2026-10-21 by `fundbericht.mjs`. Authors: Felix Habl (idea and direction) and Claude, an AI model by Anthropic (code and computations). Contact: the issue tracker of the repository this package is published in.

**These orbits are not claimed to be new.** The claim is narrower: each one was compared with the lists named below and is in none of them, and each one is verified to 30 digits.

## Contents

| File | Configuration | Masses | Orbits | stable / boundary / unstable / undecided | satellites of listed orbits | T from … to | orbits in the reference list for these masses |
|---|---|---|---|---|---|---|---|
| `orbits-freefall-1-1-1.txt` | free fall | 1/1/1 | 301 | 0 / 0 / 301 / 0 | 0 | 4.8 … 27.5 | 30 (Li, Liao et al.) |
| `orbits-euler-1-1-2.txt` | isosceles collinear (Euler), zero angular momentum | 1/1/2 | 156 | 3 / 3 / 150 / 0 | 4 | 7.8 … 91.8 | 237 (Li, Liao et al.) |
| `orbits-euler-1-1-0.5.txt` | isosceles collinear (Euler), zero angular momentum | 1/1/0.5 | 17 | 4 / 2 / 11 / 0 | 3 | 9.6 … 80.5 | 565 (Li, Liao et al.) |
| `orbits-euler-1-1-4.txt` | isosceles collinear (Euler), zero angular momentum | 1/1/4 | 21 | 7 / 3 / 11 / 0 | 3 | 14.0 … 91.9 | 85 (Li, Liao et al.) |
| `orbits-euler-1-1-1.txt` | isosceles collinear (Euler), zero angular momentum | 1/1/1 | 188 | 0 / 0 / 188 / 0 | 10 | 21.4 … 92.7 | 699 (Li, Liao et al.) |
| `orbits-euler-1-1-0.75.txt` | isosceles collinear (Euler), zero angular momentum | 1/1/0.75 | 3 | 1 / 0 / 2 / 0 | 0 | 22.1 … 71.2 | 401 (Li, Liao et al.) |

Equal masses: 489 orbits. Unequal masses: 197 orbits. `stable.txt` lists the 23 orbits that are stable (S, S~), have an index equal to 2 (B), or are undecided.

**Which orbits are in these files.** For equal masses and for masses 1/1/2, every orbit the search found outside the lists was verified to 30 digits. For masses 1/1/0.5, 1/1/0.75 and 1/1/4 only the candidates for stability were: orbits that double precision calls stable, or undecided with both stability indices below 30 in absolute value (calibrated on 325 orbits outside that range, none of which turned out stable at 30 digits). Those runs found many more orbits outside the list (1976, 857 and 943; at 1/1/4 from three search windows in (a, b): 0.6…1.05 × 0…1.05, 0…2.4 × 1…2.4 and 1…2.4 × 0…1, distinct by T*); they are in the run reports, verified in double precision only, and not in this package.

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

## Caveats

- **Unequal masses:** the only reference is Li, Jing & Liao (2018), one orbit per family. "Not in the list" says little there.
- **Satellites:** some orbits run k times almost along a listed orbit before closing (word and T* are k-fold). They are orbits of their own, but not unexplained ones; the column `sat` names the base orbit.
- Only symmetric orbits are found by the half-period search, and only within the search windows and period limits of each run.
- The comparison covers the lists above. Lists we do not know of are not covered.
- The search code was written with the help of an AI assistant (Claude, Anthropic); every number here comes from a computation, and the test batteries compare the code against published 100-digit initial conditions and eigenvalues.
