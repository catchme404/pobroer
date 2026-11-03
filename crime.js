'use strict';
// TrujiYork · creador: catchme404
// ================= CALLE: asaltos a pie en zonas inseguras y choques que traban el tráfico =================
Object.assign(VOICE,{Asaltante:{f:205,c:'#ff9c9c'}});
// ----- Asaltos: solo a pie y sin búsqueda policial. Probabilidad por segundo según la seguridad (sec 0 = peor) -----
const MUG_RATE=[.05,.03,.01,0],MUG_PCT=[[.2,.3],[.12,.18],[.05,.08],[0,0]],MUG_MAX=3;
const THIEF={jk:[.1,.1,.12],pn:[.13,.13,.15],sk:[.62,.45,.32],hr:[.05,.04,.04],hat:true,hatc:[.16,.16,.18],sh:true,kind:'npc'};
const MUG_LINES=['¡Dame todo lo que tienes, causa!','Tranquilo, no hagas ruido y no te pasa nada.','¡La billetera, rápido!','¡Y el celular también, oe!'];
const MUG_NONE=['Mmm... ¡pura pobreza, causa! Vete.','Estás pelado, ¡sigue tu camino!'];
function mugUpdate(dt){
 if(cur||deadT>0||S.wanted||!(pl.mv>.2))return;   // solo si vas caminando y la policía no te busca
 const rate=MUG_RATE[ZONES[zoneAt(pl.x,pl.z)].sec];
 if(!rate||npcs.reduce((k,n)=>k+(n.mug&&!n.gone?1:0),0)>=MUG_MAX)return;
 if(Math.random()<rate*dt)spawnMugger()}
function spawnMugger(){
 const zi=zoneAt(pl.x,pl.z);
 for(let t=0;t<14;t++){const an=rr(0,TAU),r=rr(22,34),x=pl.x+Math.cos(an)*r,z=pl.z+Math.sin(an)*r;
  if(!landAt(x,z)||zoneAt(x,z)!==zi||hAt(x,z)>0)continue;
  npcs.push({x,z,h:Math.atan2(pl.x-x,pl.z-z),st:'chase',t:0,hp:50,ph:rr(0,6),mv:0,tag:null,fixed:0,mug:1,done:0,gone:0,life:45,look:THIEF,name:null,lines:MUG_LINES,li:0});
  return true}
 return false}
function rob(n){n.done=1;
 if(S.cash<20){say('Asaltante',pick(MUG_NONE));msg('Te quisieron asaltar, pero no tenías nada');return}
 const pr=MUG_PCT[ZONES[zoneAt(pl.x,pl.z)].sec],pct=pr[0]+Math.random()*(pr[1]-pr[0]),amt=Math.min(S.cash,Math.round(S.cash*pct));
 S.cash-=amt;say('Asaltante',pick(MUG_LINES));
 msg('¡Te asaltaron! −$'+amt+' ('+Math.round(pct*100)+'% de tu dinero)');
 for(const o of npcs)if(!o.fixed&&!o.mug&&o.st!=='down'&&Math.hypot(o.x-n.x,o.z-n.z)<12){o.st='flee';o.t=5}   // los peatones huyen
 if(Math.random()<.3)addHeat(.6)}   // a veces un testigo avisa a la policía
function muggerStep(n,dt){
 const dx=pl.x-n.x,dz=pl.z-n.z,d=Math.hypot(dx,dz),onFoot=!cur&&deadT<=0;
 n.life-=dt;
 if(n.st==='chase'&&(!onFoot||n.life<=0)){n.st='flee';n.t=8}
 let sp;
 if(n.st==='chase'){n.h+=angDiff(Math.atan2(dx,dz),n.h)*Math.min(1,dt*8);sp=4.7;
  if(d<1.9&&!n.done){rob(n);n.st='flee';n.t=9}}
 else{n.t-=dt;n.h+=angDiff(Math.atan2(-dx,-dz),n.h)*Math.min(1,dt*6);sp=5.4;if(n.t<=0||d>120){n.gone=1;return}}
 n.x+=Math.sin(n.h)*sp*dt;n.z+=Math.cos(n.h)*sp*dt;n.ph+=dt*sp*2.4;n.mv=sp/6.5;
 // si choca contra una fachada un rato, rodea el obstáculo girando hacia un costado
 if(hitSolids(n,.4)){n.stuck=(n.stuck||0)+dt;if(n.stuck>.5){n.stuck=0;n.h+=(Math.random()<.5?-1:1)*Math.PI*.5}}else n.stuck=0}

// ----- Choques: un coche se estrella, queda parado y el tráfico se atasca detrás -----
const WRK={cd:10,max:10};
function causeWreck(c){c.ai=null;c.wreck=1;c.fixed=true;c.sp=0;c.hp=rr(14,40);c.h+=rr(-.4,.4);
 for(let k=0;k<6;k++)sparks.push({x:c.x+rr(-2,2),y:rr(.3,1),z:c.z+rr(-2,2),t:rr(.2,.5)});
 if(Math.hypot(c.x-pl.x,c.z-pl.z)<100)msg('Choque adelante: el tráfico se detiene')}
function initWrecks(){for(let k=0;k<7;k++){let c;for(let t=0;t<12;t++){c=mkAI();if(Math.hypot(c.x-pl.x,c.z-pl.z)>110)break}causeWreck(c);cars.push(c)}}
function trafficUpdate(dt){
 WRK.cd-=dt;if(WRK.cd>0)return;WRK.cd=rr(12,22);
 // los choques lejanos se retiran y el tráfico se repone en otra calle
 let gone=0;cars=cars.filter(c=>{if(c.wreck&&Math.hypot(c.x-pl.x,c.z-pl.z)>240){gone++;return false}return true});
 for(let k=0;k<gone;k++){let c;for(let t=0;t<12;t++){c=mkAI();if(Math.hypot(c.x-pl.x,c.z-pl.z)>120)break}cars.push(c)}
 if(cars.filter(c=>c.wreck&&c.hp>0).length>=WRK.max)return;
 const cand=cars.filter(c=>{if(!c.ai||c.police||c.wreck||c.fixed||c===cur||c===fastCar||Math.abs(c.sp)<4)return false;const d=Math.hypot(c.x-pl.x,c.z-pl.z);return d>55&&d<170});
 if(cand.length)causeWreck(pick(cand))}
