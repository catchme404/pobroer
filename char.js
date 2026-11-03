'use strict';
// TrujiYork · creador: catchme404
// ================= PERSONAJES Y VEHÍCULOS (dibujo) =================
const Tm=(x,y,z)=>[1,0,0,0,0,1,0,0,0,0,1,0,x,y,z,1];
const Rxm=a=>{const c=Math.cos(a),s=Math.sin(a);return[1,0,0,0,0,c,s,0,0,-s,c,0,0,0,0,1]};
const Rym=a=>{const c=Math.cos(a),s=Math.sin(a);return[c,0,-s,0,0,1,0,0,s,0,c,0,0,0,0,1]};
const Sm=(x,y,z)=>[x,0,0,0,0,y,0,0,0,0,z,0,0,0,0,1];
const mm=(a,b)=>E.mul(a,b);
const bx=(B,x,y,z,sx,sy,sz,c,k,em)=>{k=k||1;E.draw(mm(B,mm(Tm(x,y,z),Sm(sx,sy,sz))),c[0]*k,c[1]*k,c[2]*k,em)};
const pv=(B,x,y,z,rx,ry)=>{let m=mm(B,Tm(x,y,z));if(ry)m=mm(m,Rym(ry));if(rx)m=mm(m,Rxm(rx));return m};
// Damián Quiñones: conjunto Nike negro (chaqueta y pants con franja blanca), taper fade, zapatillas negras de suela blanca
const DAMIAN={jk:[.05,.05,.06],pn:[.06,.06,.07],sk:[.74,.54,.4],hr:[.04,.03,.03],fade:true,kind:'hero'};
const COPLOOK={jk:[.1,.15,.4],pn:[.07,.1,.25],sk:[.85,.65,.5],hr:[.1,.08,.06],hat:true,kind:'cop'};
const WHITE=[.95,.95,.95];
// o: x,z,h (rumbo), y (altura), air (en el aire), sc (escala), ph (fase de paso), mv (0..1 velocidad), t (tiempo), look, lying,
// wep (0 nada,1 pistola,2 puños,3 cuchillo), aim (0..1), pitch, atk (0..1), hand, flash, tag
function human(o){const L=o.look,t=o.t||0,sc=o.sc||1;
 if(o.lying){const B=mm(mm(Tm(o.x,.18,o.z),Rym(o.h)),Sm(sc,sc,sc));
  bx(B,0,.15,-.65,.45,.28,.9,L.pn);bx(B,0,.2,.2,.62,.34,.7,L.jk);bx(B,0,.2,.78,.34,.34,.34,L.sk);bx(B,0,.38,.8,.36,.1,.36,L.hr);return}
 const dn=o.dance?1:0,ph0=o.ph||0,mv=Math.min(1,o.mv||0),sw=Math.sin(o.ph||0)*(.3+.65*mv)*Math.min(1,mv*3),bob=o.air?0:dn?Math.abs(Math.sin(t*6+ph0))*.08:Math.abs(Math.cos(o.ph||0))*.07*Math.min(1,mv*3),
  br=Math.sin(t*2.2)*.012*(1-Math.min(1,mv*3)),B=mm(mm(Tm(o.x,(o.y||0)+bob+br,o.z),Rym(o.h+(dn?Math.sin(t*3+ph0)*.35:0))),Sm(sc,sc,sc)),hero=L.kind==='hero';
 if(L.detail){womanDetail(o,B,L,t,sw,dn,ph0);return}
 // piernas, franja lateral y zapatillas
 for(const sd of[1,-1]){const m=pv(B,sd*.14,.86,0,o.air?(sd>0?-.8:.5):dn?-sd*Math.sin(t*6+ph0)*.45:-sd*sw);bx(m,0,-.41,0,.25,.82,.29,L.pn);
  if(hero){bx(m,sd*.13,-.4,0,.03,.78,.12,WHITE);bx(m,0,-.78,.08,.27,.16,.45,[.08,.08,.09]);bx(m,0,-.87,.08,.28,.05,.47,WHITE)}
  else bx(m,0,-.78,.08,.27,.16,.45,L.kind==='cop'?[.05,.05,.07]:L.dress?[.1,.05,.08]:(L.shoe||[.12,.1,.1]))}
 if(L.dress)bx(B,0,.93,0,.72,.5,.42,L.jk);
 // torso
 bx(B,0,1.22,0,.64,.72,.34,L.jk);bx(B,0,.9,0,.66,.1,.36,hero?[.08,.08,.09]:[.1,.08,.08]);if(L.bag)bx(B,0,1.22,-.22,.5,.6,.16,L.bag);
 if(hero){bx(B,0,1.2,.175,.03,.7,.02,[.45,.45,.48]);bx(B,.19,1.43,.18,.1,.04,.03,WHITE);bx(B,.25,1.46,.18,.12,.04,.03,WHITE);bx(B,0,1.57,0,.66,.06,.36,[.12,.12,.13]);bx(B,0,1.5,.2,.18,.05,.03,[1,.82,.2])}
 else if(L.kind==='cop'){bx(B,.18,1.4,.18,.1,.1,.03,[1,.85,.2])}
 else if(L.suit){bx(B,0,1.28,.175,.22,.62,.02,WHITE);bx(B,0,1.3,.19,.06,.45,.02,L.suit)}
 // brazos
 let rR=-sw*.8,rL=sw*.8,rRy=0,rLy=0;
 const aimed=o.wep===1&&o.aim>0;
 if(o.wep===1){rR=aimed?-Math.PI/2+(o.pitch||0):-.45;if(aimed){rL=-Math.PI/2+(o.pitch||0)+.15;rLy=-.4}}
 else if(o.air){rR=-2.3;rL=-2.1}
 if(o.atk>0){const p=1-o.atk;
  if(o.wep===2){const pu=Math.sin(p*Math.PI)*1.55;if(o.hand)rR=-pu;else rL=-pu}
  else if(o.wep===3)rR=-2.1+2.7*p}
 if(dn&&o.wep!==1){rR=-2.3+Math.sin(t*6+ph0)*.5;rL=-2.1-Math.sin(t*6+ph0)*.5}
 else if(o.talk&&o.wep!==1){rR=-.9+Math.sin(t*3.1+ph0)*.55;rL=-.5+Math.sin(t*2.3+ph0*1.3)*.3}
 rR+=br*8;rL-=br*8;
 const aR=pv(B,-.4,1.55,0,rR,rRy),aL=pv(B,.4,1.55,0,rL,rLy);
 for(const [m,right] of[[aR,1],[aL,0]]){bx(m,0,-.35,0,.2,.7,.22,L.dress?L.sk:L.jk);if(hero)bx(m,.0,-.35,.115,.04,.66,.02,WHITE);bx(m,0,-.77,0,.18,.18,.18,L.sk);
  if(right&&o.wep===1){bx(m,0,-.92,0,.09,.34,.11,[.12,.12,.14]);bx(m,0,-.8,-.07,.08,.16,.08,[.2,.15,.1]);if(o.flash>0)bx(m,0,-1.2,0,.2,.2,.2,[1,.9,.3],2,1)}
  if(right&&o.wep===3){bx(m,0,-.85,0,.06,.12,.06,[.2,.1,.05]);bx(m,0,-1.1,0,.04,.42,.11,[.85,.88,.92],1.2)}}
 // cabeza
 bx(B,0,1.78,0,.36,.38,.36,L.sk);
 if(L.fade){// taper fade: arriba más largo, costados y nuca degradados hasta la piel, línea de contorno nítida
  const mid=[L.sk[0]*.45+L.hr[0]*.55,L.sk[1]*.45+L.hr[1]*.55,L.sk[2]*.45+L.hr[2]*.55],low=[L.sk[0]*.75+L.hr[0]*.25,L.sk[1]*.75+L.hr[1]*.25,L.sk[2]*.75+L.hr[2]*.25];
  bx(B,0,2.03,-.01,.34,.13,.38,L.hr);bx(B,0,1.96,.185,.32,.03,.03,L.hr);
  for(const sd of[-1,1]){bx(B,sd*.185,1.93,-.02,.03,.12,.34,mid);bx(B,sd*.185,1.82,-.03,.025,.1,.28,low)}
  bx(B,0,1.92,-.185,.34,.14,.03,mid);bx(B,0,1.8,-.185,.3,.1,.02,low);bx(B,0,1.7,.19,.12,.035,.03,[.25,.17,.12])}
 else if(L.hat){bx(B,0,2.0,0,.42,.14,.42,L.kind==='cop'?[.08,.12,.3]:(L.hatc||[.7,.2,.2]));bx(B,0,1.96,.26,.4,.05,.2,[.05,.05,.1])}
 else bx(B,0,2.0,-.02,.4,.14,.4,L.hr);
 if(L.long){bx(B,0,1.78,-.2,.4,.66,.12,L.hr);bx(B,.2,1.82,-.02,.06,.42,.34,L.hr);bx(B,-.2,1.82,-.02,.06,.42,.34,L.hr)}
 if(L.sh)bx(B,0,1.82,.19,.4,.09,.04,[.02,.02,.03]);if(L.glasses&&!L.sh)for(const sd of[1,-1])bx(B,sd*.085,1.8,.19,.12,.05,.02,[.1,.1,.12]);
 if(o.tag==='debt')bx(mm(Tm(o.x,2.7+Math.sin(t*4)*.15,o.z),Rym(t*3)),0,0,0,.45,.45,.45,[1,.15,.15],1.5)}
// Mujeres del club: ~3 veces más detalle que el resto (rostro, joyas, peinados, vestido en capas, tacones)
function womanDetail(o,B,L,t,sw,dn,ph0){
 const sk=L.sk,hr=L.hr,dr=L.jk,tr=L.trim||[1,.85,.3],GOLD=[1,.82,.2],lip=L.lip||[.8,.1,.2],sk2=[sk[0]*.93,sk[1]*.93,sk[2]*.93],
  hi=[Math.min(1,hr[0]*1.6+.1),Math.min(1,hr[1]*1.6+.05),Math.min(1,hr[2]*1.6)],heel=L.heel||[.1,.05,.08];
 for(const sd of[1,-1]){const m=pv(B,sd*.11,.86,0,o.air?(sd>0?-.8:.5):dn?-sd*Math.sin(t*6+ph0)*.45:-sd*sw);
  bx(m,0,-.2,0,.17,.4,.2,sk);bx(m,0,-.43,.02,.12,.08,.14,sk2);bx(m,0,-.62,0,.13,.34,.16,sk);bx(m,0,-.8,0,.15,.05,.18,tr);
  bx(m,0,-.85,.06,.14,.05,.3,heel);bx(m,0,-.8,-.08,.05,.12,.05,heel);bx(m,0,-.87,.17,.12,.03,.1,[.7,.1,.2])}
 const sway=dn?Math.sin(t*6+ph0)*.04:0;
 bx(B,sway,.98,0,.56,.22,.34,dr);bx(B,sway*1.6,.8,0,.66,.18,.4,dr);bx(B,sway*2.2,.68,0,.74,.07,.46,tr);bx(B,0,1.1,0,.46,.06,.28,GOLD);
 bx(B,0,1.22,0,.48,.2,.28,dr);bx(B,0,1.42,.01,.52,.2,.3,dr);bx(B,0,1.52,.14,.3,.08,.06,sk);bx(B,0,1.5,-.14,.34,.16,.04,sk);
 for(const sd of[1,-1]){bx(B,sd*.15,1.6,0,.05,.1,.1,dr);bx(B,sd*.27,1.57,0,.11,.07,.14,sk)}
 bx(B,0,1.63,0,.1,.1,.1,sk);bx(B,0,1.55,.16,.16,.02,.03,GOLD);bx(B,0,1.5,.17,.04,.06,.03,[.9,.1,.3]);
 let rR=-sw*.8,rL=sw*.8;if(dn){rR=-2.3+Math.sin(t*6+ph0)*.5;rL=-2.1-Math.sin(t*6+ph0)*.5}else if(o.talk){rR=-.9+Math.sin(t*3.1+ph0)*.55;rL=-.5+Math.sin(t*2.3+ph0*1.3)*.3}
 for(const [sd,ang] of[[-1,rR],[1,rL]]){const m=pv(B,sd*.31,1.57,0,ang);bx(m,0,-.17,0,.1,.32,.12,sk);bx(m,0,-.35,.01,.09,.06,.1,sk2);bx(m,0,-.52,0,.085,.26,.1,sk);
  bx(m,0,-.66,0,.1,.04,.11,GOLD);bx(m,0,-.74,0,.09,.12,.1,sk);bx(m,0,-.81,.04,.07,.03,.03,L.nail||[.85,.1,.25]);if(sd===1&&L.bag)bx(m,0,-.88,0,.2,.14,.06,L.bag)}
 bx(B,0,1.78,0,.3,.34,.3,sk);bx(B,0,1.68,.02,.24,.14,.26,sk);bx(B,0,1.6,.04,.14,.05,.18,sk2);
 for(const sd of[1,-1]){bx(B,sd*.075,1.8,.152,.07,.04,.02,[.98,.98,.98]);bx(B,sd*.075,1.8,.158,.035,.035,.02,L.eye||[.25,.15,.08]);bx(B,sd*.075,1.83,.155,.09,.012,.02,[.03,.02,.02]);bx(B,sd*.075,1.865,.152,.085,.014,.02,hr);
  bx(B,sd*.105,1.725,.15,.06,.04,.01,[.95,.55,.55]);bx(B,sd*.155,1.76,0,.03,.07,.05,sk);bx(B,sd*.16,1.7,0,.02,.07,.02,GOLD)}
 bx(B,0,1.745,.16,.035,.06,.04,sk2);bx(B,0,1.675,.152,.1,.02,.02,lip);bx(B,0,1.653,.152,.085,.026,.02,[Math.min(1,lip[0]+.1),lip[1]+.03,lip[2]+.03]);
 const st=L.style|0;bx(B,0,1.94,-.01,.33,.1,.33,hr);bx(B,0,1.89,.15,.32,.07,.06,hr);for(const sd of[1,-1])bx(B,sd*.165,1.8,0,.05,.26,.28,hr);bx(B,.06,1.95,.06,.1,.02,.2,hi);
 if(st===0){bx(B,0,1.52,-.17,.34,.7,.1,hr);bx(B,0,1.28,-.17,.28,.2,.09,hr);bx(B,0,1.78,-.17,.34,.3,.12,hr)}
 else if(st===1){bx(B,0,1.92,-.2,.1,.1,.1,GOLD);bx(B,Math.sin(t*3+ph0)*.04,1.62,-.28,.1,.5,.1,hr);bx(B,0,1.78,-.16,.3,.22,.1,hr)}
 else if(st===2){bx(B,0,2.06,-.1,.17,.15,.17,hr);bx(B,0,1.78,-.16,.3,.24,.1,hr)}
 else{bx(B,0,1.76,-.17,.4,.32,.12,hr);for(const sd of[1,-1])bx(B,sd*.19,1.7,.04,.05,.16,.2,hr)}}
function drawCar(c){const t=c.t,mh=c.mhp||100,k=c.boom?.25:.4+.6*clamp(c.hp/mh,0,1),col=c.col||t.c;
 const D=(lx,ly,lz,sx,sy,sz,cc,kk,em)=>{const s=Math.sin(c.h),co=Math.cos(c.h),q=kk||k;
  E.draw([co*sx,0,-s*sx,0,0,sy,0,0,s*sz,0,co*sz,0,c.x+lx*co+lz*s,ly,c.z-lx*s+lz*co,1],cc[0]*q,cc[1]*q,cc[2]*q,em)};
 D(0,.45+t.h/2,0,t.w,t.h,t.l,col);
 if(!(c===cur&&S.cam===1))D(0,.45+t.h+t.ch/2,-t.l*.08,t.w*.9,t.ch,t.l*.5,[.25,.35,.45]);
 for(const sx of[-1,1])for(const sz of[-1,1])D(sx*t.w/2,.4,sz*t.l*.33,.35,.8,.8,[.08,.08,.08],.8);
 const nt=isNight()&&!c.boom;for(const sx of[-1,1])D(sx*t.w*.35,.6,t.l/2,.3,.2,.1,[1,1,.7],1,nt);if(nt)for(const sx of[-1,1])D(sx*t.w*.35,.6,-t.l/2,.3,.2,.1,[.9,.1,.1],1,1);
 if(c.police&&!c.boom){const fl=(performance.now()/180|0)%2;
  if(t.liv===1)for(const sx of[-1,1])D(sx*(t.w/2+.02),.45+t.h*.5,0,.05,t.h*.55,t.l*.45,[.95,.95,.95],.9);
  const top=.45+t.h+t.ch+.1;D(-.35,top,-t.l*.08,.5,.18,.4,fl?[1,.05,.05]:[.1,.1,.4],1.6,1);D(.35,top,-t.l*.08,.5,.18,.4,fl?[.1,.1,1]:[1,.05,.05],1.6,1)}}
// Baliza amarilla de misión
function beacon(m,t){const y=2+Math.sin(t*3)*.4;
 E.draw([.7,0,0,0,0,60,0,0,0,0,.7,0,m.x,30,m.z,1],1.4,1.2,.15,1);
 const c=Math.cos(t*2),s=Math.sin(t*2);E.draw([c*1.4,0,-s*1.4,0,0,1.4,0,0,s*1.4,0,c*1.4,0,m.x,y+2,m.z,1],1.6,1.4,.3,1)}
// Baliza morada del waypoint puesto en el mapa
function wayBeacon(m,t){E.draw([.5,0,0,0,0,70,0,0,0,0,.5,0,m.x,35,m.z,1],1.1,.3,1.3,1);const c=Math.cos(t*2),s=Math.sin(t*2);E.draw([c*1.2,0,-s*1.2,0,0,1.2,0,0,s*1.2,0,c*1.2,0,m.x,3+Math.sin(t*3)*.4,m.z,1],1.4,.5,1.5,1)}

// Bolso de dinero (misión "Dinero sucio")
function bag(p,t){const y=.5+Math.sin(t*3+p.x)*.15,c=Math.cos(t*2),sn=Math.sin(t*2);
 E.draw([c*.9,0,-sn*.9,0,0,.7,0,0,sn*.9,0,c*.9,0,p.x,y,p.z,1],.2,.7,.25);E.draw([c*.4,0,-sn*.4,0,0,.1,0,0,sn*.4,0,c*.4,0,p.x,y+.4,p.z,1],.9,.95,.8);
 E.draw([.4,0,0,0,0,14,0,0,0,0,.4,0,p.x,7,p.z,1],.5,1.2,.4,1)}
