// dreikoerper/werkzeug/stabil-genau-probe.mjs — ein schneller Blick auf
// stabilitaetGenau an der Acht, bevor die lange Eichung läuft.
//
//   node werkzeug/stabil-genau-probe.mjs
import { stabilitaetGenau } from "../genau.mjs";
const t0 = Date.now();
const st = stabilitaetGenau("euler", ["1", "1", "1"],
  "0.347116888118926938242776920320300866247407337170783353439887",
  "0.532724945388030229262027987691926270354911090188219655821614",
  "6.32591398292621167758900033396704706329264990989414709217424", { stellen: 30 });
console.log(st, ((Date.now() - t0) / 1000).toFixed(1) + " s");
console.log("Quelle: 2·Re(λ) = -0.5951933350374258973699394426915580423332 und 1.997199964184076777 (aus 0.99859998209203838852)");
