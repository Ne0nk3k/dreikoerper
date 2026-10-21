// dreikoerper/kern.js — Rechenkern des Dreikörper-Labors.
//
// Reine Funktionen: kein DOM, kein Zufall, keine Uhr. Dieselbe Datei läuft
//   - in Node (Prüfbatterie, Suchmaschine),
//   - im Browser auf dem Hauptfaden,
//   - im Web-Worker (als Text in einen Blob gelegt).
//
// Ebenes Dreikörperproblem, G = 1, Massen m = [m1,m2,m3].
//
// ZUSTAND IN RELATIVKOORDINATEN. u: Float64Array(12) =
//     d12x,d12y, d13x,d13y, d23x,d23y,  w12x,w12y, w13x,w13y, w23x,w23y
// mit d_ij = r_j − r_i und w_ij = v_j − v_i. Drei Abstandsvektoren statt
// drei Orte: einer davon ist überzählig (d12 + d23 = d13), aber keiner wird
// je als Differenz großer Zahlen gebildet. Gemessen am 01.10.2026: in festen
// Koordinaten blieb die Energiedrift bei Bahnen mit engen Begegnungen
// (kleinster Abstand 4e-5) bei 1e-8 stehen, gleich wie scharf die Toleranz
// war; in Relativkoordinaten fällt sie mit der Toleranz bis 1e-13.
//
// Körper 1 und 2 stehen außen, Körper 3 in der Mitte — dieselbe Reihenfolge
// wie bei Šuvakov/Dmitrašinović 2013 und Li/Liao 2017, damit Anfangswerte und
// Wörter aus deren Tabellen ohne Umrechnung gelten.
//
// Zwei Integratoren, mit Absicht:
//   Dormand–Prince 5(4)  — Runge-Kutta mit Schrittweitensteuerung und
//                          Zwischenwerten. Karte, Verfeinerung, Monodromie.
//   Taylorreihe          — Ordnung 24, Schrittweite aus dem Konvergenzradius.
//                          Die Gegenprobe.
// Sie teilen keine Zeile Rechnung. Was beide gleich ausrechnen, hängt nicht
// an den Koeffizienten des einen.

const Kern = (() => {
"use strict";

/* ═══════════════════ 1 · Kraft ═══════════════════ */

function kraft(u, m, du) {
  const ax=u[0], ay=u[1], bx=u[2], by=u[3], cx=u[4], cy=u[5];
  let r2=ax*ax+ay*ay; const qa=1/(r2*Math.sqrt(r2));
  r2=bx*bx+by*by; const qb=1/(r2*Math.sqrt(r2));
  r2=cx*cx+cy*cy; const qc=1/(r2*Math.sqrt(r2));
  const Ax=ax*qa, Ay=ay*qa, Bx=bx*qb, By=by*qb, Cx=cx*qc, Cy=cy*qc;
  const m1=m[0], m2=m[1], m3=m[2];
  du[0]=u[6]; du[1]=u[7]; du[2]=u[8]; du[3]=u[9]; du[4]=u[10]; du[5]=u[11];
  du[6]=-(m1+m2)*Ax+m3*(Cx-Bx);  du[7]=-(m1+m2)*Ay+m3*(Cy-By);
  du[8]=-(m1+m3)*Bx-m2*(Cx+Ax);  du[9]=-(m1+m3)*By-m2*(Cy+Ay);
  du[10]=-(m2+m3)*Cx+m1*(Ax-Bx); du[11]=-(m2+m3)*Cy+m1*(Ay-By);
}

// Zustand plus Variationsgleichungen: y[0..11] = u, y[12+12c+k] = du_k/du0_c.
// Die zwölf Spalten zusammen sind die Übertragungsmatrix; nach einer Periode
// ist sie die Monodromie.
const vQ3=[0,0,0], vQ5=[0,0,0], vT=[0,0,0,0,0,0];
function kraftVar(y, m, dy) {
  kraft(y, m, dy);
  for (let p=0; p<3; p++) {
    const dx=y[2*p], dyy=y[2*p+1], r2=dx*dx+dyy*dyy, i3=1/(r2*Math.sqrt(r2));
    vQ3[p]=i3; vQ5[p]=3*i3/r2;
  }
  const m1=m[0], m2=m[1], m3=m[2];
  for (let c=0; c<12; c++) {
    const b = 12 + 12*c;
    for (let p=0; p<3; p++) {
      const ex=y[b+2*p], ey=y[b+2*p+1], dx=y[2*p], dyy=y[2*p+1];
      const s=(dx*ex+dyy*ey)*vQ5[p];
      vT[2*p]=ex*vQ3[p]-dx*s; vT[2*p+1]=ey*vQ3[p]-dyy*s;
    }
    for (let k=0; k<6; k++) dy[b+k]=y[b+6+k];
    dy[b+6]=-(m1+m2)*vT[0]+m3*(vT[4]-vT[2]);  dy[b+7]=-(m1+m2)*vT[1]+m3*(vT[5]-vT[3]);
    dy[b+8]=-(m1+m3)*vT[2]-m2*(vT[4]+vT[0]);  dy[b+9]=-(m1+m3)*vT[3]-m2*(vT[5]+vT[1]);
    dy[b+10]=-(m2+m3)*vT[4]+m1*(vT[0]-vT[2]); dy[b+11]=-(m2+m3)*vT[5]+m1*(vT[1]-vT[3]);
  }
}

// Erhaltungsgrößen im Schwerpunktsystem, aus den Relativgrößen allein.
function energie(u, m) {
  const M=m[0]+m[1]+m[2], mm=[m[0]*m[1], m[0]*m[2], m[1]*m[2]];
  let k=0, p=0;
  for (let i=0;i<3;i++) { k+=mm[i]*(u[6+2*i]*u[6+2*i]+u[7+2*i]*u[7+2*i]); p-=mm[i]/Math.hypot(u[2*i],u[2*i+1]); }
  return k/(2*M)+p;
}
function drehimpuls(u, m) {
  const M=m[0]+m[1]+m[2], mm=[m[0]*m[1], m[0]*m[2], m[1]*m[2]];
  let l=0;
  for (let i=0;i<3;i++) l+=mm[i]*(u[2*i]*u[7+2*i]-u[2*i+1]*u[6+2*i]);
  return l/M;
}
function kleinsterAbstand(u) {
  const a=Math.hypot(u[0],u[1]), b=Math.hypot(u[2],u[3]), c=Math.hypot(u[4],u[5]);
  return a<b?(a<c?a:c):(b<c?b:c);
}

// Relativ → Orte und Geschwindigkeiten im Schwerpunktsystem. Linear, also
// auch für Differenzen und Ableitungen zu gebrauchen. z: x1,y1,x2,y2,x3,y3, vx1,…
function zuOrten(u, m, z, ou, oz) {
  ou=ou||0; oz=oz||0;
  const m1=m[0], m2=m[1], m3=m[2], M=m1+m2+m3;
  for (let s=0; s<12; s+=6) {
    const ax=u[ou+s], ay=u[ou+s+1], bx=u[ou+s+2], by=u[ou+s+3], cx=u[ou+s+4], cy=u[ou+s+5];
    z[oz+s]  =-(m2*ax+m3*bx)/M; z[oz+s+1]=-(m2*ay+m3*by)/M;
    z[oz+s+2]= (m1*ax-m3*cx)/M; z[oz+s+3]= (m1*ay-m3*cy)/M;
    z[oz+s+4]= (m1*bx+m2*cx)/M; z[oz+s+5]= (m1*by+m2*cy)/M;
  }
  return z;
}
function zuRelativ(z, u) {
  for (let s=0; s<12; s+=6) {
    u[s]=z[s+2]-z[s]; u[s+1]=z[s+3]-z[s+1]; u[s+2]=z[s+4]-z[s]; u[s+3]=z[s+5]-z[s+1];
    u[s+4]=z[s+4]-z[s+2]; u[s+5]=z[s+5]-z[s+3];
  }
  return u;
}
// Abstand zweier Zustände, gemessen wie in der Literatur: euklidisch über
// Orte und Geschwindigkeiten aller drei Körper im Schwerpunktsystem.
const abU=new Float64Array(12), abZ=new Float64Array(12);
function abstand(u1, u0, m) {
  for (let i=0;i<12;i++) abU[i]=u1[i]-u0[i];
  zuOrten(abU, m, abZ);
  let s=0; for (let i=0;i<12;i++) s+=abZ[i]*abZ[i];
  return Math.sqrt(s);
}

/* ═══════════════════ 2 · Dormand–Prince 5(4) ═══════════════════ */

const A21=1/5, A31=3/40, A32=9/40, A41=44/45, A42=-56/15, A43=32/9,
  A51=19372/6561, A52=-25360/2187, A53=64448/6561, A54=-212/729,
  A61=9017/3168, A62=-355/33, A63=46732/5247, A64=49/176, A65=-5103/18656,
  B1=35/384, B3=500/1113, B4=125/192, B5=-2187/6784, B6=11/84,
  E1=71/57600, E3=-71/16695, E4=71/1920, E5=-17253/339200, E6=22/525, E7=-1/40;

function macheLoeser(n, rhs) {
  const k1=new Float64Array(n), k2=new Float64Array(n), k3=new Float64Array(n),
        k4=new Float64Array(n), k5=new Float64Array(n), k6=new Float64Array(n),
        k7=new Float64Array(n), yt=new Float64Array(n), yn=new Float64Array(n);
  function start(y, m) { rhs(y, m, k1); }
  // Ein Versuchsschritt der Weite h. Schreibt yn und k7 = f(yn), gibt die
  // Fehlernorm zurück (≤ 1 heißt annehmbar). Größter Einzelfehler, kein
  // Mittel: sonst verdünnen die 144 Variationsgrößen den Fehler der Bahn.
  function versuch(y, m, h, tol) {
    let i;
    for (i=0;i<n;i++) yt[i]=y[i]+h*A21*k1[i];
    rhs(yt,m,k2);
    for (i=0;i<n;i++) yt[i]=y[i]+h*(A31*k1[i]+A32*k2[i]);
    rhs(yt,m,k3);
    for (i=0;i<n;i++) yt[i]=y[i]+h*(A41*k1[i]+A42*k2[i]+A43*k3[i]);
    rhs(yt,m,k4);
    for (i=0;i<n;i++) yt[i]=y[i]+h*(A51*k1[i]+A52*k2[i]+A53*k3[i]+A54*k4[i]);
    rhs(yt,m,k5);
    for (i=0;i<n;i++) yt[i]=y[i]+h*(A61*k1[i]+A62*k2[i]+A63*k3[i]+A64*k4[i]+A65*k5[i]);
    rhs(yt,m,k6);
    for (i=0;i<n;i++) yn[i]=y[i]+h*(B1*k1[i]+B3*k3[i]+B4*k4[i]+B5*k5[i]+B6*k6[i]);
    rhs(yn,m,k7);
    let s=0;
    for (i=0;i<n;i++) {
      const e=h*(E1*k1[i]+E3*k3[i]+E4*k4[i]+E5*k5[i]+E6*k6[i]+E7*k7[i]);
      const a=Math.abs(y[i]), b=Math.abs(yn[i]);
      const q=Math.abs(e)/(tol*(1+(a>b?a:b)));
      if (q>s || q!==q) s=q;
    }
    return s;
  }
  function annehmen(y) { for (let i=0;i<n;i++) { y[i]=yn[i]; k1[i]=k7[i]; } }
  return { n, k1, k7, yn, start, versuch, annehmen };
}

function schrittFaktor(err) {
  if (!(err>=0)) return 0.2;                 // NaN: Stoß im Schritt
  if (err===0) return 5;
  const f=0.9*Math.pow(err,-0.2);
  return f>5?5:(f<0.2?0.2:f);
}

// Integriert y an Ort und Stelle von 0 bis T. rueckruf(t, h) wird nach jedem
// angenommenen Schritt gerufen, bevor y überschrieben wird: y ist der Stand
// bei t, L.yn der bei t+h, L.k1 und L.k7 die Ableitungen dazu. Gibt er wahr
// zurück, endet der Lauf nach diesem Schritt.
// art: 0 durchgelaufen, 2 abgebrochen (Schrittgrenze, Stoß), 3 vom Rückruf beendet.
function integriere(L, y, m, T, tol, rueckruf, maxSchritte, h0) {
  let t=0, h=h0||Math.min(1e-3,T), n=0, art=0;
  const grenze=maxSchritte||2e7;
  L.start(y,m);
  while (t<T) {
    let hh=h, letzter=false;
    if (T-t<=hh*(1+1e-12)) { hh=T-t; letzter=true; }
    const err=L.versuch(y,m,hh,tol);
    if (err<=1) {
      let halt=false;
      if (rueckruf) halt=rueckruf(t,hh);
      L.annehmen(y); n++;
      if (letzter) { t=T; break; }
      t+=hh;
      if (halt) { art=3; break; }
      if (n>=grenze) { art=2; break; }
    }
    h=hh*schrittFaktor(err);
    if (h<1e-14) { art=2; break; }
  }
  return { t, schritte:n, art, h };
}

// Die Toleranz, mit der genau gerechnet wird.
const TOL_GENAU = 1e-15;

/* ═══════════════════ 3 · Taylorreihe ═══════════════════
   Jede Größe als Potenzreihe in der Zeit, die Koeffizienten Ordnung für
   Ordnung aus den Bewegungsgleichungen: r² über das Cauchy-Produkt, r⁻³ über
   die Rekursion für Potenzen einer Reihe. Die Schrittweite folgt aus dem
   Abklingen der letzten Koeffizienten, also aus dem Konvergenzradius — nahe
   einer engen Begegnung schrumpft sie von selbst.                          */

const TAYLOR_N=24;
function macheTaylor() {
  const N=TAYLOR_N, neu=()=>[new Float64Array(N+2),new Float64Array(N+2),new Float64Array(N+2)];
  const X=neu(), Y=neu(), U=neu(), V=neu(), S=neu(), Q=neu(), FX=neu(), FY=neu();
  return function(u, m, T, eps, maxSchritte) {
    const m1=m[0], m2=m[1], m3=m[2];
    const fak=0.9*Math.pow(eps||1e-16, 1/N), grenze=maxSchritte||5e6;
    let t=0, schritte=0, art=0;
    while (t<T) {
      for (let p=0;p<3;p++) { X[p][0]=u[2*p]; Y[p][0]=u[2*p+1]; U[p][0]=u[6+2*p]; V[p][0]=u[7+2*p]; }
      for (let k=0;k<N;k++) {
        for (let p=0;p<3;p++) {
          const x=X[p], y=Y[p], s=S[p], q=Q[p];
          let a=0;
          for (let j=0;j<=k;j++) a+=x[j]*x[k-j]+y[j]*y[k-j];
          s[k]=a;
          if (k===0) q[0]=1/(a*Math.sqrt(a));
          else { let b=0; for (let j=1;j<=k;j++) b+=(-1.5*j-(k-j))*s[j]*q[k-j]; q[k]=b/(k*s[0]); }
          let fx=0, fy=0;
          for (let j=0;j<=k;j++) { fx+=x[j]*q[k-j]; fy+=y[j]*q[k-j]; }
          FX[p][k]=fx; FY[p][k]=fy;
        }
        const ax=FX[0][k], ay=FY[0][k], bx=FX[1][k], by=FY[1][k], cx=FX[2][k], cy=FY[2][k], d=k+1;
        X[0][d]=U[0][k]/d; Y[0][d]=V[0][k]/d; X[1][d]=U[1][k]/d; Y[1][d]=V[1][k]/d; X[2][d]=U[2][k]/d; Y[2][d]=V[2][k]/d;
        U[0][d]=(-(m1+m2)*ax+m3*(cx-bx))/d; V[0][d]=(-(m1+m2)*ay+m3*(cy-by))/d;
        U[1][d]=(-(m1+m3)*bx-m2*(cx+ax))/d; V[1][d]=(-(m1+m3)*by-m2*(cy+ay))/d;
        U[2][d]=(-(m2+m3)*cx+m1*(ax-bx))/d; V[2][d]=(-(m2+m3)*cy+m1*(ay-by))/d;
      }
      // Schrittweite: kleinster geschätzter Konvergenzradius über die drei Paare
      let rho=Infinity;
      for (let p=0;p<3;p++) {
        const sk=Math.max(Math.abs(X[p][0]),Math.abs(Y[p][0]));
        for (const k of [N-1,N]) {
          const c=Math.max(Math.abs(X[p][k]),Math.abs(Y[p][k]));
          if (c>0) { const r=Math.pow(sk/c,1/k); if (r<rho) rho=r; }
        }
      }
      if (!(rho>0)) { art=2; break; }           // auch NaN: Stoß
      let h=fak*rho, letzter=false;
      if (T-t<=h*(1+1e-12)) { h=T-t; letzter=true; }
      for (let p=0;p<3;p++) {
        let x=X[p][N], y=Y[p][N], uu=U[p][N], vv=V[p][N];
        for (let k=N-1;k>=0;k--) { x=x*h+X[p][k]; y=y*h+Y[p][k]; uu=uu*h+U[p][k]; vv=vv*h+V[p][k]; }
        u[2*p]=x; u[2*p+1]=y; u[6+2*p]=uu; u[7+2*p]=vv;
      }
      schritte++;
      if (letzter) { t=T; break; }
      t+=h;
      if (schritte>=grenze || h<1e-14) { art=2; break; }
    }
    return { t, schritte, art };
  };
}
let taylor12=null;
function taylor(u, m, T, eps, maxSchritte) { if (!taylor12) taylor12=macheTaylor(); return taylor12(u, m, T, eps, maxSchritte); }

// Dieselbe Reihe mit Tangenten: neben der Bahn laufen nT Tangentenvektoren
// durch die Variationsgleichungen. δ(r⁻³) = −1.5·r⁻⁵·δ(r²), und r⁻⁵ ist eine
// zweite Potenzreihe aus derselben Rekursion. tang: Float64Array(nT·12),
// Spalte c ab Stelle 12c, wird wie u an Ort und Stelle überschrieben.
function macheTaylorVar(nT) {
  const N=TAYLOR_N, neu=()=>[new Float64Array(N+2),new Float64Array(N+2),new Float64Array(N+2)];
  const X=neu(), Y=neu(), U=neu(), V=neu(), S=neu(), Q=neu(), W=neu();
  const dX=[], dY=[], dU=[], dV=[], dS=[], dQ=[];
  for (let c=0;c<nT;c++) { dX.push(neu()); dY.push(neu()); dU.push(neu()); dV.push(neu()); dS.push(neu()); dQ.push(neu()); }
  const fx=[0,0,0], fy=[0,0,0];
  return function(u, tang, m, T, eps, maxSchritte) {
    const m1=m[0], m2=m[1], m3=m[2];
    const fak=0.9*Math.pow(eps||1e-16, 1/N), grenze=maxSchritte||5e6;
    let t=0, schritte=0, art=0;
    while (t<T) {
      for (let p=0;p<3;p++) {
        X[p][0]=u[2*p]; Y[p][0]=u[2*p+1]; U[p][0]=u[6+2*p]; V[p][0]=u[7+2*p];
        for (let c=0;c<nT;c++) { const o=12*c; dX[c][p][0]=tang[o+2*p]; dY[c][p][0]=tang[o+2*p+1]; dU[c][p][0]=tang[o+6+2*p]; dV[c][p][0]=tang[o+7+2*p]; }
      }
      for (let k=0;k<N;k++) {
        const d=k+1;
        for (let p=0;p<3;p++) {
          const x=X[p], y=Y[p], s=S[p], q=Q[p], w=W[p];
          let a=0;
          for (let j=0;j<=k;j++) a+=x[j]*x[k-j]+y[j]*y[k-j];
          s[k]=a;
          if (k===0) { q[0]=1/(a*Math.sqrt(a)); w[0]=q[0]/a; }
          else {
            let b=0, e=0;
            for (let j=1;j<=k;j++) { b+=(-1.5*j-(k-j))*s[j]*q[k-j]; e+=(-2.5*j-(k-j))*s[j]*w[k-j]; }
            q[k]=b/(k*s[0]); w[k]=e/(k*s[0]);
          }
          let gx=0, gy=0;
          for (let j=0;j<=k;j++) { gx+=x[j]*q[k-j]; gy+=y[j]*q[k-j]; }
          fx[p]=gx; fy[p]=gy;
        }
        X[0][d]=U[0][k]/d; Y[0][d]=V[0][k]/d; X[1][d]=U[1][k]/d; Y[1][d]=V[1][k]/d; X[2][d]=U[2][k]/d; Y[2][d]=V[2][k]/d;
        U[0][d]=(-(m1+m2)*fx[0]+m3*(fx[2]-fx[1]))/d; V[0][d]=(-(m1+m2)*fy[0]+m3*(fy[2]-fy[1]))/d;
        U[1][d]=(-(m1+m3)*fx[1]-m2*(fx[2]+fx[0]))/d; V[1][d]=(-(m1+m3)*fy[1]-m2*(fy[2]+fy[0]))/d;
        U[2][d]=(-(m2+m3)*fx[2]+m1*(fx[0]-fx[1]))/d; V[2][d]=(-(m2+m3)*fy[2]+m1*(fy[0]-fy[1]))/d;
        for (let c=0;c<nT;c++) {
          for (let p=0;p<3;p++) {
            const x=X[p], y=Y[p], q=Q[p], w=W[p], ex=dX[c][p], ey=dY[c][p], es=dS[c][p], eq=dQ[c][p];
            let a=0;
            for (let j=0;j<=k;j++) a+=x[j]*ex[k-j]+y[j]*ey[k-j];
            es[k]=2*a;
            let b=0;
            for (let j=0;j<=k;j++) b+=w[j]*es[k-j];
            eq[k]=-1.5*b;
            let gx=0, gy=0;
            for (let j=0;j<=k;j++) { gx+=ex[j]*q[k-j]+x[j]*eq[k-j]; gy+=ey[j]*q[k-j]+y[j]*eq[k-j]; }
            fx[p]=gx; fy[p]=gy;
          }
          const ex=dX[c], ey=dY[c], eu=dU[c], ev=dV[c];
          ex[0][d]=eu[0][k]/d; ey[0][d]=ev[0][k]/d; ex[1][d]=eu[1][k]/d; ey[1][d]=ev[1][k]/d; ex[2][d]=eu[2][k]/d; ey[2][d]=ev[2][k]/d;
          eu[0][d]=(-(m1+m2)*fx[0]+m3*(fx[2]-fx[1]))/d; ev[0][d]=(-(m1+m2)*fy[0]+m3*(fy[2]-fy[1]))/d;
          eu[1][d]=(-(m1+m3)*fx[1]-m2*(fx[2]+fx[0]))/d; ev[1][d]=(-(m1+m3)*fy[1]-m2*(fy[2]+fy[0]))/d;
          eu[2][d]=(-(m2+m3)*fx[2]+m1*(fx[0]-fx[1]))/d; ev[2][d]=(-(m2+m3)*fy[2]+m1*(fy[0]-fy[1]))/d;
        }
      }
      let rho=Infinity;
      for (let p=0;p<3;p++) {
        const sk=Math.max(Math.abs(X[p][0]),Math.abs(Y[p][0]));
        for (const k of [N-1,N]) {
          const c=Math.max(Math.abs(X[p][k]),Math.abs(Y[p][k]));
          if (c>0) { const r=Math.pow(sk/c,1/k); if (r<rho) rho=r; }
        }
      }
      if (!(rho>0)) { art=2; break; }
      let h=fak*rho, letzter=false;
      if (T-t<=h*(1+1e-12)) { h=T-t; letzter=true; }
      for (let p=0;p<3;p++) {
        let x=X[p][N], y=Y[p][N], uu=U[p][N], vv=V[p][N];
        for (let k=N-1;k>=0;k--) { x=x*h+X[p][k]; y=y*h+Y[p][k]; uu=uu*h+U[p][k]; vv=vv*h+V[p][k]; }
        u[2*p]=x; u[2*p+1]=y; u[6+2*p]=uu; u[7+2*p]=vv;
        for (let c=0;c<nT;c++) {
          const ex=dX[c][p], ey=dY[c][p], eu=dU[c][p], ev=dV[c][p];
          x=ex[N]; y=ey[N]; uu=eu[N]; vv=ev[N];
          for (let k=N-1;k>=0;k--) { x=x*h+ex[k]; y=y*h+ey[k]; uu=uu*h+eu[k]; vv=vv*h+ev[k]; }
          const o=12*c; tang[o+2*p]=x; tang[o+2*p+1]=y; tang[o+6+2*p]=uu; tang[o+7+2*p]=vv;
        }
      }
      schritte++;
      if (letzter) { t=T; break; }
      t+=h;
      if (schritte>=grenze || h<1e-14) { art=2; break; }
    }
    return { t, schritte, art };
  };
}

/* ═══════════════════ 4 · Ebenen der Anfangswerte ═══════════════════
   Eine Ebene macht aus zwei Zahlen (a,b) einen Anfangszustand.

   euler: Körper 1 bei −1, Körper 2 bei +1, Körper 3 bei 0; Körper 1 und 2
          starten mit (a,b), Körper 3 trägt den Gegenimpuls. Für gleiche
          Massen genau die Tabelle von 2013.
   fall:  Körper 1 bei (−½,0), Körper 2 bei (½,0), Körper 3 bei (a,b);
          alle ruhen. Freier Fall nach Agekyan und Anosova.              */

const EBENEN = {
  euler: {
    name: "Euler-Ebene", achseA: "v₁", achseB: "v₂",
    sicht: [0, 0.75, 0, 0.75],
    anfang(a, b, m, u) {
      const k=-(m[0]+m[1])/m[2]-1;            // v3 − v1 in Einheiten von (a,b)
      u[0]=2; u[1]=0; u[2]=1; u[3]=0; u[4]=-1; u[5]=0;
      u[6]=0; u[7]=0; u[8]=k*a; u[9]=k*b; u[10]=k*a; u[11]=k*b;
      return u;
    }
  },
  fall: {
    name: "Freier Fall", achseA: "x₃", achseB: "y₃",
    sicht: [0, 0.5, 0, 1],
    anfang(a, b, m, u) {
      u[0]=1; u[1]=0; u[2]=a+0.5; u[3]=b; u[4]=a-0.5; u[5]=b;
      u[6]=0; u[7]=0; u[8]=0; u[9]=0; u[10]=0; u[11]=0;
      return u;
    }
  }
};

/* ═══════════════════ 5 · Wiederkehr ═══════════════════
   Der Wiederkehrabstand ist der kleinste Abstand im Zustandsraum, auf den
   die Bahn ihrem Anfang nach dem Start wieder nahekommt:
       d = min über t in (0,T] von |z(t) − z(0)|.
   Null heißt periodisch. Minima werden dort gesucht, wo die Ableitung von
   |z(t) − z(0)|² von fallend auf steigend wechselt, und im Schritt über die
   kubische Hermite-Interpolation verfeinert.                               */

const MAXMIN = 128;
function macheSucher() {
  const L=macheLoeser(12, kraft);
  const y=new Float64Array(12), x0=new Float64Array(12), yh=new Float64Array(12), dh=new Float64Array(12);
  const p1=new Float64Array(12), p2=new Float64Array(12);
  const minT=new Float64Array(MAXMIN), minD=new Float64Array(MAXMIN);
  const S={ d:Infinity, t:0, dFrueh:Infinity, tFrueh:0, art:0, schritte:0,
            rMin:Infinity, nMin:0, minT, minD, y, drift:0, tEnde:0,
            nb:0, bandD:new Float64Array(64), bandT:new Float64Array(64),
            schwelleErst:0, tErst:0, dErst:Infinity };
  let hh=0, mm=null;

  // Skalarprodukt zweier Relativvektoren, gemessen in Orten: (P a)·(P b)
  function prod(a, b) {
    zuOrten(a, mm, p1); zuOrten(b, mm, p2);
    let s=0; for (let i=0;i<12;i++) s+=p1[i]*p2[i];
    return s;
  }
  // Hermite: Y − x0 in yh, Y′ in dh; zurück kommt g(θ) = ⟨Y−x0, Y′⟩
  function gBei(th) {
    const t2=th*th, t3=t2*th;
    const h00=2*t3-3*t2+1, h10=t3-2*t2+th, h01=-2*t3+3*t2, h11=t3-t2;
    const d00=6*t2-6*th, d10=3*t2-4*th+1, d01=-d00, d11=3*t2-2*th;
    const k1=L.k1, k7=L.k7, yn=L.yn;
    for (let i=0;i<12;i++) {
      yh[i]=h00*y[i]+h10*hh*k1[i]+h01*yn[i]+h11*hh*k7[i]-x0[i];
      dh[i]=d00*y[i]+d10*hh*k1[i]+d01*yn[i]+d11*hh*k7[i];
    }
    return prod(yh, dh);
  }

  // tAb: Minima vor dieser Zeit zählen nicht (Suche in einem Zeitfenster).
  // S.nb > 0: zusätzlich das beste Minimum je Zeitband (nb gleich breite
  // Bänder über 0…Tmax) in bandD/bandT. Eine Bahn kehrt zu vielen Zeiten fast
  // zurück; jede dieser Zeiten kann der Keim einer anderen periodischen Bahn
  // sein, und das beste Minimum allein verdeckt die übrigen.
  S.lauf = function(u0, m, Tmax, tol, maxSchritte, tAb) {
    tAb=tAb||0;
    const nb=S.nb, bandD=S.bandD, bandT=S.bandT;
    for (let k=0;k<nb;k++) { bandD[k]=Infinity; bandT[k]=0; }
    S.tErst=0; S.dErst=Infinity;
    y.set(u0); x0.set(u0); mm=m;
    const e0=energie(u0,m), Mges=m[0]+m[1]+m[2];
    const grenze=maxSchritte||200000;
    let t=0, h=Math.min(1e-3,Tmax), n=0, art=0, nMin=0;
    let dBest=Infinity, tBest=0, rMin=Infinity;
    L.start(y,m);
    let g0=0;
    const k7=L.k7, yn=L.yn;
    while (t<Tmax) {
      let letzter=false; hh=h;
      if (Tmax-t<=hh*(1+1e-12)) { hh=Tmax-t; letzter=true; }
      const err=L.versuch(y,m,hh,tol);
      if (err<=1) {
        for (let i=0;i<12;i++) yh[i]=yn[i]-x0[i];
        const g1=prod(yh, k7);
        if (g0<0 && g1>=0) {
          // Nullstelle von g im Schritt: Regula falsi mit Illinois-Kniff
          let ta=0, tb=1, ga=g0*hh, gb=g1*hh, th=ga/(ga-gb), gm=0;
          for (let it=0; it<6; it++) {
            gm=gBei(th);
            if (Math.abs(gm)<1e-15) break;
            if (gm<0) { ta=th; ga=gm; gb*=0.5; } else { tb=th; gb=gm; ga*=0.5; }
            th=ta+(tb-ta)*ga/(ga-gb);
          }
          gBei(th);
          const d=Math.sqrt(prod(yh, yh)), tm=t+th*hh;
          if (tm>=tAb) {
            if (S.tErst===0 && d<S.schwelleErst) { S.tErst=tm; S.dErst=d; }
            if (nb) { let k=Math.floor(tm/Tmax*nb); if (k>=nb) k=nb-1; if (d<bandD[k]) { bandD[k]=d; bandT[k]=tm; } }
            if (d<dBest) { dBest=d; tBest=tm; }
            if (nMin>=MAXMIN) {               // voll: alles über 2·Bestwert räumen
              let w=0;
              for (let r=0;r<nMin;r++) if (minD[r]<=2*dBest) { minT[w]=minT[r]; minD[w]=minD[r]; w++; }
              nMin=w;
            }
            if (nMin<MAXMIN && d<=2*dBest) { minT[nMin]=tm; minD[nMin]=d; nMin++; }
          }
        }
        L.annehmen(y); n++; g0=g1;
        if (letzter) { t=Tmax; break; }
        t+=hh;
        // Abstände, Stoß, Zerfall
        const r12=y[0]*y[0]+y[1]*y[1], r13=y[2]*y[2]+y[3]*y[3], r23=y[4]*y[4]+y[5]*y[5];
        const rk=r12<r13?(r12<r23?r12:r23):(r13<r23?r13:r23);
        if (rk<rMin) rMin=rk;
        if (rk<1e-16) { art=2; break; }
        if ((n&7)===0) {
          // Engstes Paar als Doppelstern, dritter Körper dagegen: weit weg,
          // nach außen unterwegs und mit positiver Bahnenergie heißt Zerfall.
          let Rx, Ry, Vx, Vy;
          const m1=m[0], m2=m[1], m3=m[2];
          if (rk===r12)      { const s=m1+m2; Rx=(m1*y[2]+m2*y[4])/s; Ry=(m1*y[3]+m2*y[5])/s; Vx=(m1*y[8]+m2*y[10])/s; Vy=(m1*y[9]+m2*y[11])/s; }
          else if (rk===r13) { const s=m1+m3; Rx=(m1*y[0]-m3*y[4])/s; Ry=(m1*y[1]-m3*y[5])/s; Vx=(m1*y[6]-m3*y[10])/s; Vy=(m1*y[7]-m3*y[11])/s; }
          else               { const s=m2+m3; Rx=-(m2*y[0]+m3*y[2])/s; Ry=-(m2*y[1]+m3*y[3])/s; Vx=-(m2*y[6]+m3*y[8])/s; Vy=-(m2*y[7]+m3*y[9])/s; }
          const R2=Rx*Rx+Ry*Ry;
          if (R2>12.25 && R2>16*rk && Rx*Vx+Ry*Vy>0 && 0.5*(Vx*Vx+Vy*Vy)-Mges/Math.sqrt(R2)>0) { art=1; break; }
        }
        if (n>=grenze) { art=2; break; }
      }
      h=hh*schrittFaktor(err);
      if (h<1e-14) { art=2; break; }
    }
    // Frühestes Minimum, das dem besten nahekommt: der Schätzwert für die
    // Grundperiode. Das beste selbst kann die zweite oder dritte Wiederkehr sein.
    let tF=tBest, dF=dBest;
    for (let r=0;r<nMin;r++) if (minD[r]<=2*dBest) { tF=minT[r]; dF=minD[r]; break; }
    S.d=dBest; S.t=tBest; S.tFrueh=tF; S.dFrueh=dF; S.art=art; S.schritte=n;
    S.rMin=Math.sqrt(rMin); S.nMin=nMin; S.tEnde=t;
    S.drift=Math.abs((energie(y,m)-e0)/e0);
    return S;
  };
  return S;
}

// Bahn in gleichen Zeitabständen abtasten: N+1 Punkte, je 12 Werte — Orte
// und Geschwindigkeiten im Schwerpunktsystem, fertig zum Zeichnen.
function abtasten(u0, m, T, tol, N) {
  const L=macheLoeser(12, kraft), y=Float64Array.from(u0), uh=new Float64Array(12);
  const aus=new Float64Array((N+1)*12);
  zuOrten(u0, m, aus, 0, 0);
  const dt=T/N; let naechster=1;
  const erg=integriere(L, y, m, T, tol, (t,h) => {
    const k1=L.k1, k7=L.k7, yn=L.yn;
    while (naechster<=N && naechster*dt<=t+h*(1+1e-12)) {
      let th=(naechster*dt-t)/h; if (th>1) th=1;
      const t2=th*th, t3=t2*th;
      const h00=2*t3-3*t2+1, h10=t3-2*t2+th, h01=-2*t3+3*t2, h11=t3-t2;
      for (let i=0;i<12;i++) uh[i]=h00*y[i]+h10*h*k1[i]+h01*yn[i]+h11*h*k7[i];
      zuOrten(uh, m, aus, 0, naechster*12);
      naechster++;
    }
    return false;
  }, 3e6);
  return { punkte: aus, n: naechster-1, art: erg.art, ende: y };
}

/* ═══════════════════ 6 · Monodromie und Stabilität ═══════════════════ */

// Monodromie über die Taylorreihe mit zwölf Tangenten. Gibt y zurück wie die
// Runge-Kutta-Fassung: y[0..11] = u(T), y[12+12c+k] = du_k/du0_c.
function macheVariation() {
  const lauf=macheTaylorVar(12), y=new Float64Array(156), u=new Float64Array(12), tang=new Float64Array(144);
  return function(u0, m, T, eps, maxSchritte) {
    u.set(u0); tang.fill(0);
    for (let c=0;c<12;c++) tang[13*c]=1;
    const erg=lauf(u, tang, m, T, eps||1e-16, maxSchritte);
    y.set(u,0); y.set(tang,12);
    return { y, art: erg.art, schritte: erg.schritte };
  };
}
// Dieselbe Matrix mit Dormand–Prince auf den 156 Gleichungen — langsamer und
// gröber, aber unabhängig. Nur für die Gegenprobe in der Prüfbatterie.
function macheVariationRK() {
  const L=macheLoeser(156, kraftVar), y=new Float64Array(156);
  return function(u0, m, T, tol, maxSchritte) {
    y.fill(0); y.set(u0,0);
    for (let c=0;c<12;c++) y[12+13*c]=1;
    const erg=integriere(L, y, m, T, tol||1e-13, null, maxSchritte||2e7);
    return { y, art: erg.art, schritte: erg.schritte };
  };
}

function csqrt(re, im) {
  const r=Math.hypot(re,im);
  let a=Math.sqrt(Math.max(0,(r+re)/2)), b=Math.sqrt(Math.max(0,(r-re)/2));
  if (im<0) b=-b;
  return [a,b];
}
// Betrag des größeren der beiden λ mit λ + 1/λ = s (s komplex erlaubt)
function lambdaBetrag(sr, si) {
  const w=csqrt(sr*sr-si*si-4, 2*sr*si);
  const b1=Math.hypot((sr+w[0])/2,(si+w[1])/2), b2=Math.hypot((sr-w[0])/2,(si-w[1])/2);
  return b1>b2?b1:b2;
}

// Acht der zwölf Eigenwerte der Monodromie sind 1. Vier gehören zum
// überzähligen Abstandsvektor (die Verletzung c = d12 + d23 − d13 gehorcht
// c″ = 0), zwei zu Drehung und Drehimpuls, zwei zu Zeit und Energie. Die
// übrigen vier kommen als λ₁, 1/λ₁, λ₂, 1/λ₂. Ihre Stabilitätsindizes
// s = λ + 1/λ folgen aus zwei Spuren, ohne Eigenwertverfahren:
//     s₁ + s₂   = Spur(M) − 8
//     s₁² + s₂² = Spur(M²) − 4
// Linear stabil genau dann, wenn beide s reell sind und |s| < 2.
// Geeicht an der Lagrange-Bahn gegen Rouths Formel (pruef-kern.mjs).
function stabilitaet(Y) {
  let sp=0, sp2=0, maxE=0;
  for (let c=0;c<12;c++) {
    sp+=Y[12+13*c];
    for (let k=0;k<12;k++) {
      const a=Y[12+12*c+k], b=Y[12+12*k+c];
      sp2+=a*b;
      if (Math.abs(a)>maxE) maxE=Math.abs(a);
    }
  }
  const p=sp-8, q2=sp2-4, D=2*q2-p*p;
  const aus={ spur:sp, spur2:sp2, D, groesstesElement:maxE };
  if (D>=0) {
    const w=Math.sqrt(D);
    aus.s1=(p+w)/2; aus.s2=(p-w)/2; aus.komplex=false; aus.sIm=0;
    aus.lambda=Math.max(lambdaBetrag(aus.s1,0), lambdaBetrag(aus.s2,0));
    aus.stabil=Math.abs(aus.s1)<2 && Math.abs(aus.s2)<2;
    aus.rand=2-Math.max(Math.abs(aus.s1),Math.abs(aus.s2));   // Abstand zur Grenze
  } else {
    const w=Math.sqrt(-D);
    aus.s1=p/2; aus.s2=p/2; aus.sIm=w/2; aus.komplex=true;
    aus.lambda=lambdaBetrag(p/2,w/2);
    aus.stabil=false; aus.rand=-w/2;
  }
  return aus;
}

// Abweichung von der symplektischen Bedingung, gemessen in Jacobi-Koordinaten
// (ρ = d12, λ = Körper 3 gegen den Schwerpunkt von 1 und 2) — dort ist die
// Bewegung kanonisch mit den reduzierten Massen μ₁, μ₂. Ein Maß dafür, wie
// gut die Monodromie gerechnet ist.
function symplektikFehler(Y, m) {
  const m1=m[0], m2=m[1], m3=m[2], s=m1+m2, M=s+m3;
  const mu=[m1*m2/s, m1*m2/s, m3*s/M, m3*s/M];
  // u aus (ρ,λ): d12 = ρ, d13 = λ + m2/s ρ, d23 = λ − m1/s ρ
  // (ρ,λ) aus u: ρ = d12, λ = (m1 d13 + m2 d23)/s
  const M8=new Float64Array(64), sp=new Float64Array(12), bild=new Float64Array(12);
  for (let c=0;c<8;c++) {
    sp.fill(0);
    const o=c<4?0:6, k=c%4;                    // k: 0,1 = ρx,ρy; 2,3 = λx,λy
    if (k<2) { sp[o+k]=1; sp[o+2+k]=m2/s; sp[o+4+k]=-m1/s; }
    else     { sp[o+2+(k-2)]=1; sp[o+4+(k-2)]=1; }
    for (let r=0;r<12;r++) { let a=0; for (let j=0;j<12;j++) a+=Y[12+12*j+r]*sp[j]; bild[r]=a; }
    for (let h=0;h<2;h++) {
      const q=h*6;
      M8[(h*4+0)*8+c]=bild[q]; M8[(h*4+1)*8+c]=bild[q+1];
      M8[(h*4+2)*8+c]=(m1*bild[q+2]+m2*bild[q+4])/s; M8[(h*4+3)*8+c]=(m1*bild[q+3]+m2*bild[q+5])/s;
    }
  }
  let maxF=0;
  for (let a=0;a<8;a++) for (let b=0;b<8;b++) {
    let w=0;
    for (let k=0;k<4;k++) w+=mu[k]*(M8[k*8+a]*M8[(4+k)*8+b]-M8[(4+k)*8+a]*M8[k*8+b]);
    let soll=0;
    if (a<4 && b===a+4) soll=mu[a]; else if (b<4 && a===b+4) soll=-mu[b];
    const f=Math.abs(w-soll);
    if (f>maxF) maxF=f;
  }
  return maxF;
}

/* ═══════════════════ 7 · Verfeinerung ═══════════════════
   Gesucht: (a, b, T) mit r = u(T; a,b) − u(0; a,b) = 0. Zwölf Gleichungen,
   drei Unbekannte, gelöst nach Levenberg–Marquardt. Die Ableitung kommt aus
   den Variationsgleichungen: dr/da = (M − 1)·du0/da, dr/dT = f(u(T)).
   Kleinste Quadrate über Householder, nicht über Normalgleichungen — bei
   instabilen Bahnen liegen die Spalten fast parallel.                      */

// Löst min |A x − b| für A (zeilen×3, zeilenweise in einem Array). Überschreibt A, b.
function kleinsteQuadrate3(A, b, zeilen) {
  const n=3, x=[0,0,0], diag=[0,0,0];
  for (let k=0;k<n;k++) {
    let nrm=0;
    for (let i=k;i<zeilen;i++) nrm+=A[i*n+k]*A[i*n+k];
    nrm=Math.sqrt(nrm);
    if (nrm===0) { diag[k]=0; continue; }
    const alpha=A[k*n+k]>0?-nrm:nrm;
    A[k*n+k]-=alpha;
    let vn=0;
    for (let i=k;i<zeilen;i++) vn+=A[i*n+k]*A[i*n+k];
    if (vn>0) {
      for (let j=k+1;j<n;j++) {
        let s=0;
        for (let i=k;i<zeilen;i++) s+=A[i*n+k]*A[i*n+j];
        s=2*s/vn;
        for (let i=k;i<zeilen;i++) A[i*n+j]-=s*A[i*n+k];
      }
      let s=0;
      for (let i=k;i<zeilen;i++) s+=A[i*n+k]*b[i];
      s=2*s/vn;
      for (let i=k;i<zeilen;i++) b[i]-=s*A[i*n+k];
    }
    diag[k]=alpha;
  }
  for (let k=n-1;k>=0;k--) {
    let s=b[k];
    for (let j=k+1;j<n;j++) s-=A[k*n+j]*x[j];
    x[k]=diag[k]!==0 ? s/diag[k] : 0;
  }
  return x;
}

function macheVerfeinerer() {
  const lauf=macheTaylorVar(2);
  const u0=new Float64Array(12), uT=new Float64Array(12), up=new Float64Array(12), um=new Float64Array(12);
  const da=new Float64Array(12), db=new Float64Array(12), f=new Float64Array(12), tang=new Float64Array(24);
  const r=new Float64Array(12), J=new Float64Array(36);
  const rAlt=new Float64Array(12), JAlt=new Float64Array(36);
  const A=new Float64Array(45), rhs=new Float64Array(15);
  const null12=new Float64Array(12);

  // Rest und Jacobi-Matrix an der Stelle (a,b,T), beides aus einem Lauf der
  // Taylorreihe mit zwei Tangenten (den Richtungen der Ebene).
  // Gibt den Wiederkehrabstand zurück (NaN bei Abbruch).
  function auswerten(ebene, m, a, b, T) {
    const E=EBENEN[ebene];
    E.anfang(a,b,m,u0);
    // Die Ebenen sind linear in (a,b): der Differenzenquotient ist exakt.
    const h=1e-3;
    E.anfang(a+h,b,m,up); E.anfang(a-h,b,m,um);
    for (let k=0;k<12;k++) da[k]=(up[k]-um[k])/(2*h);
    E.anfang(a,b+h,m,up); E.anfang(a,b-h,m,um);
    for (let k=0;k<12;k++) db[k]=(up[k]-um[k])/(2*h);
    uT.set(u0); tang.set(da,0); tang.set(db,12);
    if (lauf(uT,tang,m,T,1e-16).art!==0) return NaN;
    kraft(uT,m,f);
    for (let k=0;k<12;k++) {
      r[k]=uT[k]-u0[k];
      J[k*3]=tang[k]-da[k]; J[k*3+1]=tang[12+k]-db[k]; J[k*3+2]=f[k];
    }
    return abstand(r, null12, m);
  }

  // opt: maxIter (60), ziel (1e-14), tSpanne (0.3), annahme (1e-8), mu0 (1e-9)
  return function verfeinere(ebene, m, a, b, T, opt) {
    opt=opt||{};
    const maxIter=opt.maxIter??60, ziel=opt.ziel||1e-14;
    const spanne=opt.tSpanne||0.3, T0=T;
    let rest=auswerten(ebene,m,a,b,T), mu=opt.mu0||1e-9, iter=0, grund="iterationen";
    const verlauf=[rest];
    if (!(rest>=0)) return { ok:false, a, b, T, rest:NaN, iter:0, grund:"abbruch", verlauf };
    const sk=[0,0,0];
    let ohneGewinn=0;
    while (iter<maxIter) {
      if (rest<ziel) { grund="ziel"; break; }
      iter++;
      for (let j=0;j<3;j++) { let s=0; for (let k=0;k<12;k++) s+=J[k*3+j]*J[k*3+j]; sk[j]=Math.sqrt(s)||1; }
      let angenommen=false;
      for (let versuch=0; versuch<16; versuch++) {
        // [J·S⁻¹; √μ·1] δ' = [−r; 0], δ = S⁻¹ δ'
        for (let k=0;k<12;k++) { for (let j=0;j<3;j++) A[k*3+j]=J[k*3+j]/sk[j]; rhs[k]=-r[k]; }
        const w=Math.sqrt(mu);
        for (let j=0;j<3;j++) { for (let c=0;c<3;c++) A[(12+j)*3+c]=(c===j?w:0); rhs[12+j]=0; }
        const x=kleinsteQuadrate3(A,rhs,15);
        const na=a+x[0]/sk[0], nb=b+x[1]/sk[1], nT=T+x[2]/sk[2];
        if (!(nT>T0*(1-spanne) && nT<T0*(1+spanne))) { mu*=10; if (mu>1e8) break; continue; }
        rAlt.set(r); JAlt.set(J);
        const neu=auswerten(ebene,m,na,nb,nT);
        if (neu<rest) {
          // Kaum noch Gewinn dreimal nacheinander, und zwar OHNE Dämpfung:
          // dann ist die Rundung erreicht. Mit Dämpfung sind kleine Schritte
          // gewollt und kein Zeichen von Stillstand.
          if (neu>0.7*rest && mu<1e-6) ohneGewinn++; else ohneGewinn=0;
          a=na; b=nb; T=nT; rest=neu; mu=Math.max(mu/10,1e-14); angenommen=true;
          verlauf.push(rest);
          break;
        }
        r.set(rAlt); J.set(JAlt); mu*=10;
        if (mu>1e8) break;
      }
      if (!angenommen || ohneGewinn>=3) { grund="stillstand"; break; }
    }
    return { ok: rest<(opt.annahme||1e-8), a, b, T, rest, iter, grund, verlauf };
  };
}

/* ═══════════════════ 8 · Topologie: Durchgangsfolge und Wort ═══════════════════
   Auf der Formkugel liegen die geraden Aufstellungen (alle drei auf einer
   Linie) auf dem Äquator. Die drei Stoßpunkte teilen ihn in drei Bögen —
   Bogen i: Körper i steht in der Mitte. Eine periodische Bahn kreuzt den
   Äquator in einer festen Folge von Bögen; diese Durchgangsfolge, von
   Rückläufern befreit, bestimmt ihre Klasse (Montgomery 1998).            */

function flaeche(u) { return u[0]*u[3]-u[1]*u[2]; }           // d12 × d13
function mittlerer(u) {       // wer steht zwischen den beiden anderen?
  const s1=u[0]*u[2]+u[1]*u[3], s2=-(u[0]*u[4]+u[1]*u[5]), s3=u[2]*u[4]+u[3]*u[5];
  return s1<s2?(s1<s3?1:3):(s2<s3?2:3);
}

// Gibt { folge:[1..3,…], richtung:[±1,…], rMin } über eine Periode. richtung
// ist das Vorzeichen der Fläche NACH dem Durchgang, rMin die engste Begegnung.
function durchgaenge(u0, m, T, tol) {
  const L=macheLoeser(12, kraft), y=Float64Array.from(u0);
  const folge=[], richtung=[], zeiten=[], px=new Float64Array(6);
  const skala=u0[0]*u0[0]+u0[1]*u0[1]+u0[2]*u0[2]+u0[3]*u0[3]+u0[4]*u0[4]+u0[5]*u0[5];
  const eps=1e-9*skala;
  const A0=flaeche(u0), startGerade=Math.abs(A0)<=eps;
  let vz=startGerade?0:Math.sign(A0), erstes=vz, rMin=kleinsterAbstand(u0);
  const erg=integriere(L, y, m, T, tol||1e-11, (t,h) => {
    const yn=L.yn, A1=flaeche(yn);
    const r=kleinsterAbstand(yn); if (r<rMin) rMin=r;
    if (t+h>=T*(1-1e-9) && startGerade) return false;   // der Endpunkt selbst zählt unten
    if (Math.abs(A1)>eps) {
      const v1=Math.sign(A1);
      if (vz===0) { vz=v1; erstes=v1; }
      else if (v1!==vz) {
        const Aa=flaeche(y);
        let th=(Aa===A1)?0.5:Aa/(Aa-A1);
        if (!(th>=0 && th<=1)) th=0.5;
        for (let i=0;i<6;i++) px[i]=y[i]+th*(yn[i]-y[i]);
        folge.push(mittlerer(px)); richtung.push(v1); zeiten.push(t+th*h);
        vz=v1;
      }
    }
    return false;
  }, 2e7);
  let stimmig=erg.art===0;
  if (startGerade) {
    if (vz!==0 && vz!==erstes) { folge.push(mittlerer(u0)); richtung.push(erstes); zeiten.push(T); }
  } else if (vz!==erstes) stimmig=false;
  if (folge.length%2!==0) stimmig=false;
  return { folge, richtung, zeiten, stimmig, rMin };
}

// Rückläufer streichen: zweimal nacheinander durch denselben Bogen ist hin
// und zurück. Zyklisch, bis nichts mehr geht.
function kuerzeFolge(folge, richtung) {
  const f=[], r=[];
  for (let i=0;i<folge.length;i++) {
    if (f.length && f[f.length-1]===folge[i]) { f.pop(); r.pop(); }
    else { f.push(folge[i]); r.push(richtung?richtung[i]:0); }
  }
  let a=0, e=f.length-1;
  while (e>a && f[a]===f[e]) { a++; e--; }
  return { folge:f.slice(a,e+1), richtung:r.slice(a,e+1) };
}

// Wort in den Buchstaben a, b, A, B. Zwei Durchgänge — nach Süden durch Bogen
// i, zurück nach Norden durch Bogen j — sind eine Schleife g_ij um den
// Stoßpunkt zwischen beiden Bögen. Erzeuger wie in der Literatur: a und b
// laufen GEGENSINNIG um ihre Stoßpunkte (Šuvakov 2013: a im Uhrzeigersinn,
// b dagegen), also a = g_23, b = g_13; daraus g_12 = bA und g_21 = aB.
// Welche Halbkugel „Norden" heißt und welcher Körper welche Rolle spielt,
// legt KONVENTION fest; sie ist gegen die veröffentlichten Wörter von Li
// und Liao geeicht (pruef-kern.mjs).
const KONVENTION = { nord: 1, perm: [1,2,3], kehre: false };
const BUCHST = { "23":"a", "32":"A", "13":"b", "31":"B", "12":"bA", "21":"aB" };
function invertiere(w) {
  let o="";
  for (let i=w.length-1;i>=0;i--) { const c=w[i]; o+=(c===c.toLowerCase())?c.toUpperCase():c.toLowerCase(); }
  return o;
}
function kuerzeWort(w) {
  const s=[];
  for (const c of w) {
    const l=s[s.length-1];
    if (l && l!==c && l.toLowerCase()===c.toLowerCase()) s.pop(); else s.push(c);
  }
  let a=0, e=s.length-1;
  while (e>a && s[a]!==s[e] && s[a].toLowerCase()===s[e].toLowerCase()) { a++; e--; }
  return s.slice(a,e+1).join("");
}
function kleinsteDrehung(s) {
  if (!s.length) return s;
  let best=s;
  for (let i=1;i<s.length;i++) { const r=s.slice(i)+s.slice(0,i); if (r<best) best=r; }
  return best;
}
function wortAus(folge, richtung, konv) {
  konv=konv||KONVENTION;
  const k=kuerzeFolge(folge, richtung);
  const f=k.folge, r=k.richtung, n=f.length;
  if (n===0 || n%2) return "";
  // Beginn bei einem Durchgang von Nord nach Süd
  const start=(r[0]===-konv.nord)?0:1;
  const inv=[0,0,0,0]; for (let i=0;i<3;i++) inv[konv.perm[i]]=i+1;
  let w="";
  for (let q=0;q<n;q+=2) {
    const i=inv[f[(start+q)%n]], j=inv[f[(start+q+1)%n]];
    w+=BUCHST[""+i+j];
  }
  w=kuerzeWort(w);
  if (konv.kehre) w=invertiere(w);
  return kleinsteDrehung(w);
}
// Dasselbe ohne jedes Kürzen. Bahnen aus dem freien Fall laufen ihren Weg hin
// und zurück; gekürzt bliebe von ihrem Wort nichts übrig. Li und Liao geben
// für sie deshalb das ungekürzte Wort w·w⁻¹ an, beginnend am Ruhepunkt.
function wortRoh(folge, richtung, konv) {
  konv=konv||KONVENTION;
  const n=folge.length;
  if (n===0 || n%2) return "";
  const start=(richtung[0]===-konv.nord)?0:1;
  const inv=[0,0,0,0]; for (let i=0;i<3;i++) inv[konv.perm[i]]=i+1;
  let w="";
  for (let q=0;q<n;q+=2) {
    const i=inv[folge[(start+q)%n]], j=inv[folge[(start+q+1)%n]];
    if (i!==j) w+=BUCHST[""+i+j];
  }
  return konv.kehre?invertiere(w):w;
}
// Umkehrung: aus einem Wort die Durchgangsfolge (für Katalogwörter)
function folgeAusWort(w, konv) {
  konv=konv||KONVENTION;
  if (konv.kehre) w=invertiere(w);
  const paar={ a:[2,3], A:[3,2], b:[1,3], B:[3,1] };
  const f=[];
  for (const c of w) { const p=paar[c]; f.push(konv.perm[p[0]-1], konv.perm[p[1]-1]); }
  return kuerzeFolge(f).folge;
}

// Kennung: kleinste Darstellung der gekürzten Folge unter Drehung des
// Anfangs, Zeitumkehr und den Vertauschungen der Körper, die die Massen
// erhalten. Zwei Bahnen mit gleicher Kennung gehören zur selben Klasse.
// offen = wahr: die Folge ist ein Weg mit zwei Enden (halbe Periode im
// freien Fall), dann wird nicht gedreht und nicht zyklisch gekürzt.
const PERMS = [[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]];
function kennung(folge, m, offen) {
  let f;
  if (offen) { f=[]; for (const x of folge) { if (f.length && f[f.length-1]===x) f.pop(); else f.push(x); } }
  else f=kuerzeFolge(folge).folge;
  if (!f.length) return "";
  let best=null;
  for (const p of PERMS) {
    if (m && !(m[p[0]-1]===m[0] && m[p[1]-1]===m[1] && m[p[2]-1]===m[2])) continue;
    const s=f.map(x=>p[x-1]).join("");
    for (const t of [s, s.split("").reverse().join("")]) {
      const d=offen?t:kleinsteDrehung(t);
      if (best===null || d<best) best=d;
    }
  }
  return best;
}
// Kurzform der Kennung für den Katalog: 53 Bit als Zeichenkette zur Basis 36.
function streu(s) {
  let h1=0x811c9dc5, h2=0x9e3779b9;
  for (let i=0;i<s.length;i++) {
    const c=s.charCodeAt(i);
    h1=Math.imul(h1^c,0x01000193)>>>0;
    h2=Math.imul(h2^(c+i),0x85ebca6b)>>>0; h2=(h2^(h2>>>13))>>>0;
  }
  return ((h1&0x1fffff)*4294967296+h2).toString(36);
}

/* ═══════════════════ 9 · Formkugel ═══════════════════ */

// Punkt auf der Formkugel aus den Orten z (ab Stelle o), massengewichtete
// Jacobi-Koordinaten; für gleiche Massen die von 2013. Gibt R² zurück.
function formpunkt(z, o, m, aus) {
  const m1=m[0], m2=m[1], m3=m[2], M=m1+m2+m3;
  const k1=Math.sqrt(m1*m2/(m1+m2)), k2=Math.sqrt(m3*(m1+m2)/M);
  const rx=k1*(z[o]-z[o+2]), ry=k1*(z[o+1]-z[o+3]);
  const lx=k2*((m1*z[o]+m2*z[o+2])/(m1+m2)-z[o+4]), ly=k2*((m1*z[o+1]+m2*z[o+3])/(m1+m2)-z[o+5]);
  const R2=rx*rx+ry*ry+lx*lx+ly*ly;
  aus[0]=2*(rx*lx+ry*ly)/R2; aus[1]=(lx*lx+ly*ly-rx*rx-ry*ry)/R2; aus[2]=2*(rx*ly-ry*lx)/R2;
  return R2;
}

/* ═══════════════════ 10 · Die Prüfkette für einen Fund ═══════════════════ */

function macheFundpruefer() {
  const verfeinere=macheVerfeinerer(), variation=macheVariation(), reihe=macheTaylor();
  const u0=new Float64Array(12), ut=new Float64Array(12);
  const L=macheLoeser(12, kraft);

  // Kleinste Periode: teilt T durch k, solange die Bahn auch nach T/k schon
  // zurück ist.
  // Gesucht wird die ERSTE Wiederkehr entlang der Bahn; T ist dann ein
  // ganzes Vielfaches davon. Bis zum 01.10.2026 wurden hier nur die Teiler 2
  // bis 12 probiert: die Acht stand danach mit 13-, 17-, 19- und 23-facher
  // Periode als eigene Bahn in der Fundliste (aufgefallen beim Eichen des
  // T*-Vergleichs, werkzeug/lage-eichen.mjs).
  const erstSucher=macheSucher();
  function grundperiode(ebene, m, a, b, T, rest) {
    EBENEN[ebene].anfang(a,b,m,u0);
    const schwelle=Math.max(1e-6, 30*(rest||0));
    erstSucher.schwelleErst=schwelle;
    erstSucher.lauf(u0, m, T*0.999, 1e-10, 2e7);
    erstSucher.schwelleErst=0;
    const t1=erstSucher.tErst;
    if (!(t1>0)) return 1;
    const k=Math.round(T/t1);
    if (k<2 || Math.abs(T/k-t1)>1e-3*t1) return 1;
    // nachmessen mit der Reihe: ist die Bahn nach T/k wirklich zurück?
    ut.set(u0);
    if (reihe(ut, m, T/k, 1e-16).art!==0) return 1;
    return abstand(ut,u0,m)<schwelle ? k : 1;
  }

  // Lineare Stabilität der Bahn, die bei u0 beginnt und nach T zurück ist;
  // schreibt Urteil und Indizes nach aus. Eigener Schritt, damit das Labor ihn
  // erst auf Knopfdruck auslösen kann (opt.ohneStabil in pruefe, und
  // stabilitaetMessen unten).
  function stabilTeil(u0, m, T, aus) {
    const mon=variation(u0, m, T);
    if (mon.art!==0) { aus.stabil=null; aus.stabilGrund="Monodromie nicht gerechnet"; return aus; }
    const st=stabilitaet(mon.y);
    aus.stabil=st.stabil; aus.lambda=st.lambda; aus.s1=st.s1; aus.s2=st.s2;
    aus.sKomplex=st.komplex; aus.sIm=st.sIm; aus.rand=st.rand;
    aus.symplektik=symplektikFehler(mon.y, m); aus.maxM=st.groesstesElement;
    // Das Urteil gilt nur, wenn der Abstand zur Grenze |s| = 2 über dem
    // Fehler der Indizes liegt; sonst bleibt es offen (null). Der Fehler
    // ist gegen die Eigenwerte von Hristov u. a. gemessen (113 stabile
    // Bahnen mit T < 150, werkzeug/stabil-fehler.mjs): im Median das
    // 1.8-fache des Symplektikfehlers, höchstens das 109-fache. Liegen
    // beide Indizes fast gleich, zerfällt die Wurzel in der Spurformel und
    // der Fehler wächst wie die Wurzel — dann gilt die Schranke quadriert.
    // Die Schranke durch das gemessene |λ| zu teilen liegt nahe und ist
    // falsch: eine verdorbene Monodromie bläht |λ| auf und verkleinert
    // damit ihre eigene Fehlerschranke. Gemessen an 467 Bahnen mit fremden
    // Eigenwerten (werkzeug/stabil-schranke.mjs): so wie hier 0 falsche
    // Urteile bei 165 offenen; geteilt durch |λ| 6 falsche — sechs stabile
    // Bahnen der Literatur mit gemessenem s zwischen 1e4 und 6e8 hießen
    // „instabil". Was hier offen bleibt, entscheidet stabilitaetGenau.
    const schranke=150*aus.symplektik;
    if (st.komplex ? st.sIm*st.sIm<schranke : Math.abs(st.rand)<schranke) aus.stabil=null;
    return aus;
  }

  // Alles, was über einen Kandidaten zu sagen ist.
  function pruefe(ebene, m, a, b, T, opt) {
    opt=opt||{};
    const v=verfeinere(ebene, m, a, b, T, opt);
    const aus={ ebene, m:[m[0],m[1],m[2]], a:v.a, b:v.b, T:v.T, rest:v.rest, iter:v.iter,
                grund:v.grund, ok:v.ok, start:[a,b,T] };
    if (!v.ok) return aus;
    const k=grundperiode(ebene, m, v.a, v.b, v.T, v.rest);
    if (k>1) {
      const w=verfeinere(ebene, m, v.a, v.b, v.T/k, opt);
      if (w.ok) { aus.a=w.a; aus.b=w.b; aus.T=w.T; aus.rest=w.rest; aus.teiler=k; }
    }
    EBENEN[ebene].anfang(aus.a,aus.b,m,u0);
    aus.E=energie(u0,m); aus.L=drehimpuls(u0,m);
    aus.Ts=aus.T*Math.pow(Math.abs(aus.E),1.5);
    // Stabilität (im Labor erst auf Knopfdruck: dort kommt opt.ohneStabil)
    if (!opt.ohneStabil) stabilTeil(u0, m, aus.T, aus);
    // Topologie. Im freien Fall läuft die Bahn hin und zurück: dort zählt
    // der Hinweg, also die halbe Periode.
    const dg=durchgaenge(u0, m, aus.T, 1e-11);
    aus.stimmig=dg.stimmig; aus.rMin=dg.rMin;
    if (ebene==="fall") {
      const halb=dg.folge.slice(0, dg.folge.length>>1);
      aus.folge=halb.join("");
      aus.wort=wortRoh(dg.folge, dg.richtung);
      aus.kennung=streu("f"+kennung(halb, m, true));
    } else {
      aus.folge=kuerzeFolge(dg.folge, dg.richtung).folge.join("");
      aus.wort=wortAus(dg.folge, dg.richtung);
      aus.kennung=streu(kennung(dg.folge, m));
    }
    // Gegenprobe: dieselbe Bahn mit dem anderen Verfahren (Dormand–Prince).
    // Der Rest oben stammt aus der Taylorreihe.
    ut.set(u0);
    const g=integriere(L, ut, m, aus.T, TOL_GENAU, null, 2e7);
    aus.gegenprobe=g.art===0?abstand(ut,u0,m):NaN;
    aus.drift=g.art===0?Math.abs((energie(ut,m)-aus.E)/aus.E):NaN;
    return aus;
  }
  // Nur die Stabilität, für eine Bahn, die schon geschlossen ist: dieselbe
  // Rechnung wie in der Prüfkette, ohne Verfeinern, Topologie und Gegenprobe.
  pruefe.stabilitaetMessen=function(ebene, m, a, b, T) {
    EBENEN[ebene].anfang(a,b,m,u0);
    return stabilTeil(u0, m, T, {});
  };
  return pruefe;
}

/* ═══════════════════ 11 · Halbperioden: Umkehrpunkte ═══════════════════
   Das Dreikörperproblem hat umkehrende Symmetrien: Zeitumkehr, verbunden mit
   einer Spiegelung oder Punktspiegelung des Raums und dem Tausch gleicher
   Massen. Startet eine Bahn in der Fixmenge einer solchen Symmetrie und
   trifft nach der Zeit τ wieder eine, so läuft sie von dort spiegelbildlich
   zurück — sie ist (bis auf eine Drehung) periodisch mit 2τ, 4τ oder 6τ.

   Die Anfangswerte beider Ebenen liegen in solchen Fixmengen: die
   Euler-Aufstellung (bei m1 = m2) und die Ruhe im freien Fall. Deshalb
   reicht es, nach der HALBEN Periode drei Gleichungen in drei Unbekannten
   (a, b, τ) zu lösen statt zwölf nach der ganzen. Die Empfindlichkeit ist
   dort nur √|λ| statt |λ|: der Trichter um eine Bahn mit |λ| = 1e10 ist
   1e-5 breit statt 1e-10. Auf diesem Weg haben Hristov und Hristova ihre
   Listen gebaut (arXiv:2404.16526).

   Die Fixmengen, jede durch drei drehfeste Bedingungen beschrieben:
     A1, A2, A3   Körper k genau in der Mitte der beiden anderen, und deren
                  Abstand ändert sich gerade nicht (Euler-Aufstellung)
     B1, B2, B3   gleichschenkliges Dreieck mit Spitze k, im Umkehrpunkt
     C            alle drei auf einer Linie, Geschwindigkeiten quer dazu
     R            alle drei in Ruhe
   A und B brauchen zwei gleiche Massen (die getauschten).               */

const ZIELE = ["A1", "A2", "A3", "B1", "B2", "B3", "C", "R"];
function umkehr(s, u, g) {
  const ax=u[0], ay=u[1], bx=u[2], by=u[3], cx=u[4], cy=u[5];
  const pax=u[6], pay=u[7], pbx=u[8], pby=u[9], pcx=u[10], pcy=u[11];
  const ra=Math.hypot(ax,ay), rb=Math.hypot(bx,by), rc=Math.hypot(cx,cy);
  const va=(ax*pax+ay*pay)/ra, vb=(bx*pbx+by*pby)/rb, vc=(cx*pcx+cy*pcy)/rc;   // Abstandsänderungen
  switch (s) {
    case 0: g[0]=ax+bx; g[1]=ay+by; g[2]=vc; break;            // d12 + d13 = 0
    case 1: g[0]=cx-ax; g[1]=cy-ay; g[2]=vb; break;            // d23 − d12 = 0
    case 2: g[0]=bx+cx; g[1]=by+cy; g[2]=va; break;            // d13 + d23 = 0
    case 3: g[0]=ra-rb; g[1]=vc; g[2]=(ra*va+rb*vb)/Math.hypot(ra,rb); break;
    case 4: g[0]=ra-rc; g[1]=vb; g[2]=(ra*va+rc*vc)/Math.hypot(ra,rc); break;
    case 5: g[0]=rb-rc; g[1]=va; g[2]=(rb*vb+rc*vc)/Math.hypot(rb,rc); break;
    case 6: g[0]=(ax*by-ay*bx)/Math.max(ra,rb,rc); g[1]=va; g[2]=vb; break;
    default: g[0]=va; g[1]=(ax*pay-ay*pax)/ra; g[2]=vb;
  }
  return Math.sqrt(g[0]*g[0]+g[1]*g[1]+g[2]*g[2]);
}
// Welche Ziele erlauben die Massen? A_k und B_k tauschen die beiden anderen.
function erlaubteZiele(m) {
  const z=[6,7];
  if (m[1]===m[2]) z.push(0,3);
  if (m[0]===m[2]) z.push(1,4);
  if (m[0]===m[1]) z.push(2,5);
  return z.sort((x,y)=>x-y);
}
// In welcher Fixmenge startet die Ebene? euler: A3 (braucht m1 = m2), fall: R.
function startZiel(ebene, m) { return ebene==="fall" ? 7 : (m[0]===m[1] ? 2 : -1); }

const HALB_BAENDER = 8;
function macheHalbsucher() {
  const L=macheLoeser(12, kraft), y=new Float64Array(12), g=[0,0,0];
  const NZ=ZIELE.length;
  // nb: Zahl der Zeitbänder, einstellbar bis HALB_BAENDER
  const S={ defD:new Float64Array(NZ*HALB_BAENDER), defT:new Float64Array(NZ*HALB_BAENDER), art:0, schritte:0, nb:6 };
  const g1=new Float64Array(NZ), g2=new Float64Array(NZ), frei=new Uint8Array(NZ);
  // Integriert bis tauMax und hält je Ziel und Zeitband das tiefste Minimum
  // des Abstands zur Fixmenge fest. ziele: erlaubte Ziele.
  S.lauf=function(u0, m, tauMax, tol, ziele, maxSchritte) {
    y.set(u0);
    const defD=S.defD, defT=S.defT, Mges=m[0]+m[1]+m[2], NB=S.nb;
    defD.fill(Infinity); defT.fill(0); g1.fill(0); g2.fill(0); frei.fill(0);
    const grenze=maxSchritte||200000;
    let t=0, h=Math.min(1e-3,tauMax), n=0, art=0, t1=0, t2=0;
    L.start(y,m);
    while (t<tauMax) {
      let hh=h, letzter=false;
      if (tauMax-t<=hh*(1+1e-12)) { hh=tauMax-t; letzter=true; }
      const err=L.versuch(y,m,hh,tol);
      if (err<=1) {
        L.annehmen(y); n++; t+=hh;
        for (let q=0;q<ziele.length;q++) {
          const s=ziele[q], w=umkehr(s,y,g);
          // erst zählen, wenn die Bahn die Fixmenge des Starts verlassen hat
          if (!frei[s]) { if (w>0.05) frei[s]=1; }
          else if (n>2 && g1[s]<g2[s] && g1[s]<=w) {
            // Parabel durch die drei letzten Werte: Scheitel in Zeit und Höhe
            const x1=t2-t1, x3=t-t1, y1=g2[s]-g1[s], y3=w-g1[s];
            const den=x1*x3*(x1-x3);
            let tm=t1, wm=g1[s];
            if (den!==0) {
              const A=(x3*y1-x1*y3)/den, Bq=(x1*x1*y3-x3*x3*y1)/den;
              if (A>0) { const xs=-Bq/(2*A); if (xs>x1 && xs<x3) { tm=t1+xs; wm=Math.max(0,g1[s]-Bq*Bq/(4*A)); } }
            }
            let k=Math.floor(tm/tauMax*NB); if (k>=NB) k=NB-1;
            if (wm<defD[s*NB+k]) { defD[s*NB+k]=wm; defT[s*NB+k]=tm; }
          }
          g2[s]=g1[s]; g1[s]=w;
        }
        t2=t1; t1=t;
        if (letzter) break;
        const r12=y[0]*y[0]+y[1]*y[1], r13=y[2]*y[2]+y[3]*y[3], r23=y[4]*y[4]+y[5]*y[5];
        const rk=r12<r13?(r12<r23?r12:r23):(r13<r23?r13:r23);
        if (rk<1e-16) { art=2; break; }
        if ((n&7)===0) {
          let Rx, Ry, Vx, Vy; const m1=m[0], m2=m[1], m3=m[2];
          if (rk===r12)      { const q=m1+m2; Rx=(m1*y[2]+m2*y[4])/q; Ry=(m1*y[3]+m2*y[5])/q; Vx=(m1*y[8]+m2*y[10])/q; Vy=(m1*y[9]+m2*y[11])/q; }
          else if (rk===r13) { const q=m1+m3; Rx=(m1*y[0]-m3*y[4])/q; Ry=(m1*y[1]-m3*y[5])/q; Vx=(m1*y[6]-m3*y[10])/q; Vy=(m1*y[7]-m3*y[11])/q; }
          else               { const q=m2+m3; Rx=-(m2*y[0]+m3*y[2])/q; Ry=-(m2*y[1]+m3*y[3])/q; Vx=-(m2*y[6]+m3*y[8])/q; Vy=-(m2*y[7]+m3*y[9])/q; }
          const R2=Rx*Rx+Ry*Ry;
          if (R2>12.25 && R2>16*rk && Rx*Vx+Ry*Vy>0 && 0.5*(Vx*Vx+Vy*Vy)-Mges/Math.sqrt(R2)>0) { art=1; break; }
        }
        if (n>=grenze) { art=2; break; }
      }
      h=hh*schrittFaktor(err);
      if (h<1e-14) { art=2; break; }
    }
    S.art=art; S.schritte=n;
    return S;
  };
  return S;
}

// Löst g_s(u(τ; a, b)) = 0 für (a, b, τ): Newton mit Rückzug. Die Ableitung
// von u nach (a, b) kommt aus zwei Tangenten der Taylorreihe, die von g nach
// u aus Differenzenquotienten (g ist reine Algebra).
function macheHalbverfeinerer() {
  const lauf2=macheTaylorVar(2), reihe=macheTaylor();
  const u0=new Float64Array(12), uT=new Float64Array(12), up=new Float64Array(12), um=new Float64Array(12);
  const da=new Float64Array(12), db=new Float64Array(12), f=new Float64Array(12), tang=new Float64Array(24);
  const g=[0,0,0], gq=[0,0,0], Jg=new Float64Array(36), J=new Float64Array(9);
  function nurG(ebene, m, a, b, tau, s) {
    EBENEN[ebene].anfang(a,b,m,u0);
    if (energie(u0,m)>=0) return NaN;
    uT.set(u0);
    if (reihe(uT,m,tau,1e-16).art!==0) return NaN;
    return umkehr(s,uT,gq);
  }
  function mitJ(ebene, m, a, b, tau, s) {
    const E=EBENEN[ebene], h=1e-3;
    E.anfang(a,b,m,u0);
    E.anfang(a+h,b,m,up); E.anfang(a-h,b,m,um); for (let k=0;k<12;k++) da[k]=(up[k]-um[k])/(2*h);
    E.anfang(a,b+h,m,up); E.anfang(a,b-h,m,um); for (let k=0;k<12;k++) db[k]=(up[k]-um[k])/(2*h);
    uT.set(u0); tang.set(da,0); tang.set(db,12);
    if (lauf2(uT,tang,m,tau,1e-16).art!==0) return NaN;
    const w=umkehr(s,uT,g);
    kraft(uT,m,f);
    for (let c=0;c<12;c++) {
      const e=1e-7*(1+Math.abs(uT[c])), alt=uT[c];
      uT[c]=alt+e; umkehr(s,uT,gq); const p0=gq[0], p1=gq[1], p2=gq[2];
      uT[c]=alt-e; umkehr(s,uT,gq); uT[c]=alt;
      Jg[c]=(p0-gq[0])/(2*e); Jg[12+c]=(p1-gq[1])/(2*e); Jg[24+c]=(p2-gq[2])/(2*e);
    }
    for (let r=0;r<3;r++) {
      let sa=0, sb=0, st=0;
      for (let c=0;c<12;c++) { const q=Jg[12*r+c]; sa+=q*tang[c]; sb+=q*tang[12+c]; st+=q*f[c]; }
      J[3*r]=sa; J[3*r+1]=sb; J[3*r+2]=st;
    }
    return w;
  }
  function loese3(A, b) {                 // Gauß mit Spaltenpivot; null bei Rangverlust
    const M=[[A[0],A[1],A[2],b[0]],[A[3],A[4],A[5],b[1]],[A[6],A[7],A[8],b[2]]];
    for (let k=0;k<3;k++) {
      let p=k; for (let r=k+1;r<3;r++) if (Math.abs(M[r][k])>Math.abs(M[p][k])) p=r;
      if (Math.abs(M[p][k])<1e-300) return null;
      const t=M[k]; M[k]=M[p]; M[p]=t;
      for (let r=k+1;r<3;r++) { const q=M[r][k]/M[k][k]; for (let c=k;c<4;c++) M[r][c]-=q*M[k][c]; }
    }
    const x=[0,0,0];
    for (let k=2;k>=0;k--) { let v=M[k][3]; for (let c=k+1;c<3;c++) v-=M[k][c]*x[c]; x[k]=v/M[k][k]; }
    return x;
  }
  // opt: tSpanne (0.35), maxIter (30), annahme (1e-9)
  return function halb(ebene, m, a, b, tau, s, opt) {
    opt=opt||{};
    const tau0=tau, spanne=opt.tSpanne||0.35, maxIter=opt.maxIter||20;
    let w=mitJ(ebene,m,a,b,tau,s), iter=0, grund="iterationen";
    const verlauf=[w];
    if (!(w>=0)) return { ok:false, a, b, tau, rest:NaN, ziel:s, grund:"abbruch", verlauf };
    while (iter<maxIter) {
      if (w<1e-13) { grund="ziel"; break; }
      iter++;
      const x=loese3(J,[-g[0],-g[1],-g[2]]);
      if (!x) { grund="rang"; break; }
      // Wer nach vier Schritten nicht wenigstens auf ein Drittel gekommen ist,
      // sitzt in keinem Trichter: abbrechen, statt Rechenzeit zu verbrennen.
      if (iter===5 && w>0.33*verlauf[0]) { grund="kein Trichter"; break; }
      let lam=1, angenommen=false;
      for (let v=0;v<6;v++) {
        const na=a+lam*x[0], nb=b+lam*x[1], nt=tau+lam*x[2];
        if (nt>tau0*(1-spanne) && nt<tau0*(1+spanne)) {
          const nw=nurG(ebene,m,na,nb,nt,s);
          if (nw<w) { a=na; b=nb; tau=nt; angenommen=true; break; }
        }
        lam/=2;
      }
      if (!angenommen) { grund="stillstand"; break; }
      const neu=mitJ(ebene,m,a,b,tau,s);
      if (!(neu>=0)) { grund="abbruch"; break; }
      if (neu>0.5*w && neu<1e-9) { w=neu; verlauf.push(w); grund="stillstand"; break; }   // Rundung erreicht
      w=neu; verlauf.push(w);
    }
    return { ok: w<(opt.annahme||1e-9), a, b, tau, rest:w, ziel:s, iter, grund, verlauf };
  };
}

/* ═══════════════════ 12 · Die Arbeit eines Rechenfadens ═══════════════════
   Dieselben zwei Aufträge in Node (arbeiter.mjs) und im Browser (Web-Worker):
   eine Zeile der Karte rechnen, und ein Kartenminimum zu Ende verfolgen.   */

function macheJaeger() {
  const sucher=macheSucher(), pruefe=macheFundpruefer();
  const halbsucher=macheHalbsucher(), halbfein=macheHalbverfeinerer(), reihe=macheTaylor();
  const u0=new Float64Array(12), uq=new Float64Array(12);
  const R=[[1,0],[-1,0],[0,1],[0,-1],[1,1],[-1,-1],[1,-1],[-1,1]];

  // Rasterzeile: n Punkte von a0 bis a1 (Zellmitten) bei festem b.
  // art je Punkt: 0 durchgelaufen, 1 Zerfall, 2 abgebrochen, 4 ungebunden.
  // baender > 0: dazu bd/bt, je Punkt das beste Minimum in jedem Zeitband.
  function zeile(ebene, m, a0, a1, b, n, Tmax, tol, maxSchritte, schritt, versatz, baender) {
    schritt=schritt||1; versatz=versatz||0; baender=baender||0;
    const anzahl=Math.ceil((n-versatz)/schritt);
    const d=new Float32Array(anzahl), t=new Float32Array(anzahl), art=new Uint8Array(anzahl);
    const bd=baender?new Float32Array(anzahl*baender).fill(Infinity):null, bt=baender?new Float32Array(anzahl*baender):null;
    const E=EBENEN[ebene];
    sucher.nb=baender;
    for (let k=0;k<anzahl;k++) {
      const i=versatz+k*schritt;
      E.anfang(a0+(a1-a0)*(i+0.5)/n, b, m, u0);
      if (energie(u0,m)>=0) { d[k]=Infinity; art[k]=4; continue; }
      const s=sucher.lauf(u0, m, Tmax, tol, maxSchritte);
      d[k]=s.d; t[k]=s.tFrueh; art[k]=s.art;
      for (let q=0;q<baender;q++) { bd[k*baender+q]=s.bandD[q]; bt[k*baender+q]=s.bandT[q]; }
    }
    sucher.nb=0;
    return { d, t, art, bd, bt };
  }

  // Ein Kartenminimum: erst talwärts tasten, dann die Prüfkette. Das Tasten
  // sucht ohne Ableitung das Minimum des Wiederkehrabstands in der Nähe (acht
  // Richtungen, Schritt halbieren) — die Rasterzelle ist meist breiter als
  // der Trichter, in dem das Newton-Verfahren greift.
  function kandidat(ebene, m, a, b, T, schritt, opt) {
    const E=EBENEN[ebene];
    let x=a, y=b, s=schritt, n=0;
    const f=(p,q)=>{
      E.anfang(p,q,m,u0); n++;
      if (energie(u0,m)>=0) return null;
      const r=sucher.lauf(u0, m, 1.25*T, 1e-9, 400000, 0.75*T);
      return r.d<Infinity ? { d:r.d, t:r.t } : null;
    };
    let best=f(x,y);
    if (!best) return { ok:false, grund:"kein Minimum im Fenster", start:[a,b,T] };
    T=best.t;
    while (s>schritt/256 && best.d>1e-6 && n<160) {
      let besser=false;
      for (let k=0;k<8;k++) {
        const c=f(x+R[k][0]*s, y+R[k][1]*s);
        if (c && c.d<best.d) { best=c; x+=R[k][0]*s; y+=R[k][1]*s; T=c.t; besser=true; break; }
      }
      if (!besser) s/=2;
    }
    // Wo das Tasten nicht unter 0.1 kam, greift Newton selten (gemessen: 7 %
    // gegen 62 % darunter) und kostet am meisten — dort ein knappes Budget.
    const o=Object.assign({ tSpanne:0.2, annahme:1e-6, maxIter: best.d>0.1 ? 10 : 40 }, opt||{});
    const p=pruefe(ebene, m, x, y, T, o);
    p.vorlauf={ a:x, b:y, T, d:best.d, auswertungen:n };
    p.kandidat=[a,b];
    return p;
  }

  // Rasterzeile der Halbperioden-Karte: je Punkt, Ziel und Zeitband der
  // kleinste Abstand zur Fixmenge und die Zeit dazu.
  function zeileHalb(ebene, m, a0, a1, b, n, tauMax, tol, maxSchritte, baender) {
    if (baender) halbsucher.nb=Math.min(HALB_BAENDER, baender);
    const ziele=erlaubteZiele(m), NZ=ZIELE.length, NB=halbsucher.nb, W=NZ*NB;
    const d=new Float32Array(n*W).fill(Infinity), t=new Float32Array(n*W), art=new Uint8Array(n);
    const E=EBENEN[ebene];
    for (let i=0;i<n;i++) {
      E.anfang(a0+(a1-a0)*(i+0.5)/n, b, m, u0);
      if (energie(u0,m)>=0) { art[i]=4; continue; }
      const s=halbsucher.lauf(u0, m, tauMax, tol, ziele, maxSchritte);
      art[i]=s.art;
      for (let q=0;q<W;q++) { d[i*W+q]=s.defD[q]; t[i*W+q]=s.defT[q]; }
    }
    return { d, t, art, nz:NZ, nb:NB };
  }

  // Ein Minimum der Halbperioden-Karte: Newton auf den Umkehrpunkt, dann die
  // Frage, nach welchem Vielfachen von 2τ die Bahn wirklich zurück ist, dann
  // die Prüfkette. Die ganze Periode wird NICHT mehr nachverfeinert: ihr Rest
  // ist bei empfindlichen Bahnen Rundung, der Umkehrpunkt dagegen steht fest.
  function kandidatHalb(ebene, m, a, b, tau, s, opt) {
    const h=halbfein(ebene, m, a, b, tau, s, opt);
    const aus={ ok:false, a:h.a, b:h.b, start:[a,b,tau],
                halb:{ ziel:ZIELE[s], tau:h.tau, rest:h.rest, iter:h.iter, grund:h.grund } };
    if (!h.ok) { aus.grund="Umkehrpunkt nicht getroffen"; return aus; }
    EBENEN[ebene].anfang(h.a, h.b, m, u0);
    let T=0; const rueck=[];
    // Die Acht etwa trifft schon nach einem Zwölftel ihrer Periode eine
    // Fixmenge (B1): deshalb bis 12τ.
    for (let k=1;k<=6;k++) {
      uq.set(u0);
      if (reihe(uq, m, 2*k*h.tau, 1e-16).art!==0) { rueck.push(NaN); continue; }
      const d=abstand(uq, u0, m); rueck.push(d);
      if (d<1e-5) { T=2*k*h.tau; break; }
    }
    aus.halb.rueckkehr=rueck;
    if (!T) { aus.grund="schließt sich nur bis auf eine Drehung"; return aus; }
    const p=pruefe(ebene, m, h.a, h.b, T, { maxIter:0, annahme:1e-5, ohneStabil: !!(opt && opt.ohneStabil) });
    p.halb=aus.halb; p.halb.vielfaches=Math.round(T/(2*h.tau));
    return p;
  }

  return { zeile, kandidat, zeileHalb, kandidatHalb, pruefe, stabil: pruefe.stabilitaetMessen, sucher, halbsucher };
}

return {
  macheJaeger, macheHalbsucher, macheHalbverfeinerer, umkehr, erlaubteZiele, startZiel, ZIELE,
  kraft, kraftVar, energie, drehimpuls, kleinsterAbstand, abstand, zuOrten, zuRelativ,
  macheLoeser, integriere, macheTaylor, macheTaylorVar, taylor, TOL_GENAU, TAYLOR_N, EBENEN,
  macheSucher, abtasten, macheVariation, macheVariationRK, stabilitaet, symplektikFehler, lambdaBetrag,
  kleinsteQuadrate3, macheVerfeinerer,
  flaeche, mittlerer, durchgaenge, kuerzeFolge, wortAus, wortRoh, folgeAusWort, kuerzeWort,
  kleinsteDrehung, invertiere, kennung, streu, KONVENTION, PERMS,
  formpunkt, macheFundpruefer
};
})();

if (typeof module !== "undefined" && module.exports) module.exports = Kern;
