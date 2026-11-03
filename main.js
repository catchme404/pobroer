'use strict';
// TrujiYork · creador: catchme404
// ================= BUCLE PRINCIPAL: entrada, actualización, render =================
let cool=0,shopCd=0;
const isPlay=()=>S.mode==='play';
Object.assign(VOICE,{'Alex Ross':{f:215,c:'#7fd0ff'},Cristo:{f:150,c:'#e0d4a0'},Charlie:{f:175,c:'#b0e0a0'},Omar:{f:140,c:'#e8b090'},Luis:{f:190,c:'#c0b0f0'},Taveo:{f:165,c:'#f0c070'},Alesso:{f:120,c:'#d0d0d8'}});
VOICE.Cliente={f:150,c:'#cfd8ff'};VOICE.Chica={f:360,c:'#ffb3e6'};VOICE.Barman={f:170,c:'#e8c090'};
function msg(t){$('msg').textContent=t;msgT=2}
// ---------- Botón de pánico (Y): cambia toda la pantalla por imagen1.png ----------
function panic(on){S.panic=on===undefined?!S.panic:on;$('panic').hidden=!S.panic;if(S.panic){sndMute();Music.stop();S.fire=0;S.aim=false}}
// ---------- Cheats (tecla |) ----------
const CHEATS=[
 ['vida','Salud y coche al máximo',()=>{pl.hp=100;if(cur)cur.hp=cur.mhp||100}],
 ['dinero','+$10.000',()=>{S.cash+=10000}],
 ['limpio','Quita la búsqueda policial',()=>{policeReset()}],
 ['estrellas','Sube 1 estrella de búsqueda',()=>setWanted(Math.min(5,S.wanted+1))],
 ['auto','Aparece un superdeportivo frente a ti',()=>{cars.push(mkCar(FAST,pl.x+Math.sin(S.cy)*7,pl.z+Math.cos(S.cy)*7,S.cy,null))}],
 ['dia','Cambia la hora a las 12:00',()=>{S.time=12}],
 ['noche','Cambia la hora a las 23:00',()=>{S.time=23}],
 ['inmortal','Invencibilidad (activar/desactivar)',()=>{S.god=!S.god;msg('Inmortal: '+(S.god?'ACTIVADO':'desactivado'))}],
 ['supersalto','Super salto (activar/desactivar)',()=>{S.sj=!S.sj;msg('Super salto: '+(S.sj?'ACTIVADO':'desactivado'))}],
 ['tp','Teletransporte al waypoint del mapa',()=>{if(!S.way){msg('Primero marca un waypoint en el mapa (Esc)');return}
   const v=cur||pl;v.x=S.way.x;v.z=S.way.z;if(cur){hitSolids(cur,1.9);pl.x=cur.x;pl.z=cur.z}else hitSolids(pl,.5)}]];
function runCheat(txt){const k=txt.toLowerCase().normalize('NFD').replace(/[^a-z0-9]/g,''),c=CHEATS.find(c=>c[0]===k);
 if(!c){msg('Cheat desconocido: '+txt);return false}c[2]();if(!['inmortal','supersalto','tp'].includes(c[0]))msg('Cheat: '+c[1]);return true}
function openCheat(){if(!isPlay())return;S.mode='cheat';S.fire=0;S.aim=false;S.keys={};document.exitPointerLock&&document.exitPointerLock();
 $('cheat').hidden=false;$('chin').value='';setTimeout(()=>$('chin').focus(),30)}
function closeCheat(){$('cheat').hidden=true;S.mode='play';$('c').requestPointerLock&&$('c').requestPointerLock()}
// ---------- Teclado ----------
addEventListener('keydown',e=>{const tg=e.target.tagName;
 if(e.code==='KeyY'&&tg!=='INPUT'&&!e.repeat){panic();return}
 if(S.panic)return;
 if(e.key==='|'&&tg!=='INPUT'&&!e.repeat){e.preventDefault();if(isPlay())openCheat();return}
 if(S.mode==='pause'&&e.code==='Escape'){start();return}
 if(isPlay()&&e.code==='Escape'&&document.pointerLockElement!==$('c')){pause();return}
 if(!isPlay()||tg==='INPUT'||tg==='SELECT')return;S.keys[e.code]=true;S.idle=0;
 if(e.code==='Space'||e.code.startsWith('Arrow'))e.preventDefault();
 if(e.code==='KeyT'&&!e.repeat){Phone.toggle();return}
 if(e.code==='KeyV'&&!e.repeat){setCam(S.cam?0:1);return}
 if(e.code==='KeyQ'&&!e.repeat){S.cy=cur?cur.h:pl.h;S.camIdle=0;msg('Cámara centrada');return}
 if(Flirt.open&&/^Digit[1-4]$/.test(e.code)){Flirt.pick(+e.code[5]-1);return}
 if(e.code==='KeyB'&&!e.repeat){Bribe.toggle();return}
 if(Bribe.open&&/^Digit[1-3]$/.test(e.code)){Bribe.pick(+e.code[5]-1);return}
 if(Phone.open){if(e.code==='ArrowLeft'||e.code==='ArrowUp'){Phone.nav(-1);return}if(e.code==='ArrowRight'||e.code==='ArrowDown'){Phone.nav(1);return}
  if(Phone.opts&&/^Digit[1-3]$/.test(e.code)){Phone.pick(+e.code[5]-1);return}}
 if(e.code==='Space'&&!e.repeat&&!cur&&deadT<=0&&pl.y<=pl.gy+.05){pl.vy=S.sj?17:8.5;bark('jump',.04)}
 if(e.code==='Digit1')S.weapon=1;if(e.code==='Digit2')S.weapon=2;if(e.code==='Digit3')S.weapon=3;if(e.code==='KeyZ')S.zoom=!S.zoom;
 if(e.code==='KeyE'&&!e.repeat){if(Flirt.open)Flirt.close();else interact()}
 if(e.code==='KeyR'){snapRoad(cur||pl);if(cur){cur.h=Math.round(cur.h/(Math.PI/2))*Math.PI/2;cur.sp=0}msg('Posición recuperada')}});
addEventListener('keyup',e=>{S.keys[e.code]=false});
const pitchLim=()=>S.cam===1?[-1.3,1.3]:[-.15,1.1];
addEventListener('mousemove',e=>{if(!isPlay()||document.pointerLockElement!==$('c'))return;S.camIdle=0;
 const k=((S.zoom||S.aim)&&S.weapon===1?.6:1)*(S.lock?.7:1)*S.sens,lim=pitchLim();
 S.cy+=(S.invX?1:-1)*e.movementX*.0025*k;S.cp=clamp(S.cp+(S.invY?-1:1)*e.movementY*.002*k,lim[0],lim[1])});
addEventListener('wheel',e=>{if(!isPlay()||S.cam===1)return;S.camI=clamp(S.camI+(e.deltaY>0?1:-1),0,2);msg('Cámara: distancia '+['cerca','media','lejos'][S.camI])},{passive:true});
function setCam(m){S.cam=m;S.eyeS=null;const lim=pitchLim();S.cp=clamp(S.cp,lim[0],lim[1]);$('camsel').value=m;msg('Cámara: '+(m?'primera persona':'tercera persona'))}
addEventListener('mousedown',e=>{if(!isPlay())return;S.idle=0;if(e.button===0)S.fire=1;if(e.button===2)S.aim=true});
addEventListener('mouseup',e=>{if(e.button===0)S.fire=0;if(e.button===2)S.aim=false});
addEventListener('contextmenu',e=>e.preventDefault());
document.addEventListener('pointerlockchange',()=>{if(isPlay()&&document.pointerLockElement!==$('c'))pause()});
// ---------- Interacciones (E): coches, tiendas, clientes del club ----------
const SHOPS=[
 {n:'ceviche',get p(){return[LOC.ceviche.c[0],LOC.ceviche.c[1]+3.4]},cost:30,hp:45,label:'comprar un ceviche ($30, +45 vida)',ok:'¡Qué rico! Ceviche fresco: +45 de vida',who:'Doña Rosa'},
 {n:'bar',get p(){return[LOC.club.c[0]-4,LOC.club.c[1]-4.6]},cost:25,hp:15,label:'pedir un pisco sour ($25, +15 vida)',ok:'Pisco sour bien helado: +15 de vida',who:'Barman'}];
function nearCar(){let b=null,bd=4;for(const c of cars){const d=Math.hypot(c.x-pl.x,c.z-pl.z);if(d<bd){bd=d;b=c}}return b}
function nearInteract(){if(cur)return{k:'car',c:cur};let best=null,bd=1e9;
 for(const n of npcs)if(n.fixed&&n.st!=='flee'&&n.st!=='down'){const d=Math.hypot(n.x-pl.x,n.z-pl.z);if(d<2.8&&d<bd){bd=d;best={k:'talk',n}}}
 for(const sh of SHOPS){const p=sh.p,d=Math.hypot(p[0]-pl.x,p[1]-pl.z);if(d<3.2&&d<bd){bd=d;best={k:'shop',sh}}}
 const c=nearCar();if(c){const d=Math.hypot(c.x-pl.x,c.z-pl.z);if(d<bd){bd=d;best={k:'car',c}}}return best}
// Conversación con los personajes con nombre; Alex Ross, tu mejor amigo, te presta $200 la primera vez y te escribe al celular
function talkFriend(n){const L=n.lines.slice();
 if(n.best){if(!S.alexMet){S.alexMet=true;S.cash+=200;msg('Alex Ross te prestó $200 "para empezar"');say(n.name,'¡Hermano! Sabía que volverías. Toma $200 para empezar, no me los devuelvas todavía.');
   Phone.msg('Alex Ross','Cualquier cosa me escribes. Para eso están los mejores amigos.',3);return}
  L.push(M.i<5?'Dicen que Cristopher te necesita para algo grande, pata.':M.i<15?'Los Tiburones andan sueltos. Ten cuidado, hermano.':'Ese italiano, Mussolini, no me da buena espina, hermano.')}
 n.li=((n.li||0)+1)%L.length;say(n.name,L[n.li])}
function interact(){if(deadT>0)return;const it=nearInteract();if(!it)return;
 if(it.k==='talk'){const n=it.n;if(n.girl){Flirt.start(n);return}if(n.friend){talkFriend(n);return}say(n.name||(n.look.dress?'Chica':'Cliente'),pick(n.lines));return}
 if(it.k==='shop'){const sh=it.sh;if(S.cash<sh.cost){msg('No te alcanza: cuesta $'+sh.cost);return}S.cash-=sh.cost;pl.hp=Math.min(100,pl.hp+sh.hp);msg(sh.ok);say(sh.who,sh.n==='bar'?'Salud, joven. Que la noche sea larga.':'¡Que aproveche, joven!');return}
 if(cur){if(Math.abs(cur.sp)>9){msg('Frena para salir');return}pl.x=cur.x+Math.cos(cur.h)*2.6;pl.z=cur.z-Math.sin(cur.h)*2.6;pl.h=cur.h;pl.y=0;pl.vy=0;cur=null;hitSolids(pl,.5);return}
 const c=it.c;if(c.police){msg('No puedes robar una patrulla en servicio');return}cur=c;c.ai=null;c.sp*=0;pl.y=0;pl.vy=0;if(c===fastCar)bark('fast');else bark('car',.5)}
function promptText(){if(Bribe.open)return'';const it=nearInteract();if(!it)return'';
 if(it.k==='car')return cur?'E: salir del '+cur.t.n+(cur.hp<=0?' (destruido)':''):it.c.police?'':'E: entrar al '+it.c.t.n;
 if(it.k==='shop')return'E: '+it.sh.label;if(it.k==='talk')return it.n.girl?'E: ligar con '+it.n.name:'E: hablar'+(it.n.name?' con '+it.n.name+(it.n.best?' (mejor amigo)':''):'');return''}
function explode(c){c.boom=true;c.sp=0;boom();for(let k=0;k<14;k++)sparks.push({x:c.x+rr(-2,2),y:rr(.4,2.4),z:c.z+rr(-2,2),t:rr(.2,.5)});
 const dp=Math.hypot(c.x-pl.x,c.z-pl.z);
 if(cur===c){pl.x=c.x+Math.cos(c.h)*2.8;pl.z=c.z-Math.sin(c.h)*2.8;cur=null;hitSolids(pl,.5);S.shake=1;hurt(50)}else if(dp<9){S.shake=.6;hurt(25)}}
function shopUpdate(dt){shopCd-=dt;if(!cur||shopCd>0)return;const p=LOC.paint.m;if(Math.hypot(cur.x-p[0],cur.z-p[1])>6||Math.abs(cur.sp)>7)return;
 if(S.wanted){const nr=cars.some(c=>c.police&&c.hp>0&&Math.hypot(c.x-pl.x,c.z-pl.z)<24)||offs.some(o=>Math.hypot(o.x-pl.x,o.z-pl.z)<24);
  if(nr){msg('Hay policías cerca: no pueden repintar tu coche');shopCd=3;return}
  const cost=100+S.wanted*60;if(S.cash<cost){msg('Necesitas $'+cost+' para repintar el coche');shopCd=3;return}
  S.cash-=cost;cur.col=[rr(.1,.9),rr(.1,.9),rr(.1,.9)];cur.hp=cur.mhp;policeReset();msg('Coche repintado (-$'+cost+'): la policía ya no te reconoce');shopCd=5}
 else if(cur.hp<cur.mhp*.95&&S.cash>=40){S.cash-=40;cur.hp=cur.mhp;msg('Coche reparado (-$40)');shopCd=5}}
// ---------- Actualización ----------
function update(dt){
 dlgUpdate(dt);S.time=(S.time+dt/60)%24;
 const K=S.keys,ar=!Phone.open,fz=S.frozen>0,thr=fz?0:(K.KeyW?1:0)-(K.KeyS?1:0),st=fz?0:(K.KeyA?1:0)-(K.KeyD?1:0);S.frozen=Math.max(0,S.frozen-dt);
 if(ar){const cs=1.9*S.sens*dt,lim=pitchLim();if(K.ArrowLeft){S.cy+=cs;S.camIdle=0}if(K.ArrowRight){S.cy-=cs;S.camIdle=0}if(K.ArrowUp){S.cp=clamp(S.cp-cs*.7,lim[0],lim[1]);S.camIdle=0}if(K.ArrowDown){S.cp=clamp(S.cp+cs*.7,lim[0],lim[1]);S.camIdle=0}}
 S.camIdle+=dt;
 pl.hit-=dt;pl.atk=Math.max(0,pl.atk-dt*3.2);pl.atkCd-=dt;pl.shoot-=dt;pl.flash-=dt;pl.aimT-=dt;S.hurt=Math.max(0,S.hurt-dt);S.hitT-=dt;S.shake=Math.max(0,S.shake-dt*1.8);
 const zoomOn=(S.zoom||S.aim)&&S.weapon===1;
 if(deadT>0){deadT-=dt;pl.mv=0;if(deadT<=0)respawn()}
 else if(cur){drive(cur,dt,thr,st,K.Space);if(S.aDrive&&!st&&Math.abs(cur.sp)>8)laneAssist(cur,dt);pl.x=cur.x;pl.z=cur.z;pl.h=cur.h;pl.y=0;pl.vy=0;
  if(Math.abs(cur.sp)>3&&!K.ShiftLeft)S.cy+=angDiff(cur.h+cur.str*.2,S.cy)*dt*2.2;
  if(K.Space&&Math.abs(cur.sp)>15&&Math.abs(cur.str)>.3)bark('drift',.01)}
 else{const run=K.ShiftLeft||K.ShiftRight,sp=run?6.5:3.2,aiming=S.weapon===1&&(zoomOn||S.fire||pl.aimT>0),mx=thr,mz=st;
  if(mx||mz){const l=Math.hypot(mx,mz),fx=Math.sin(S.cy),fz=Math.cos(S.cy),dx=(fx*mx+fz*mz)/l,dz=(fz*mx-fx*mz)/l;
   pl.x+=dx*sp*dt;pl.z+=dz*sp*dt;pl.ph+=dt*sp*2.3;if(!aiming)pl.h+=angDiff(Math.atan2(dx,dz),pl.h)*Math.min(1,dt*14)}
  if(aiming)pl.h+=angDiff(S.cy,pl.h)*Math.min(1,dt*16);
  pl.mv+=(((mx||mz)?(run?1:.55):0)-pl.mv)*Math.min(1,dt*10);
  hitSolids(pl,.5);
  for(const c of cars){const dx=pl.x-c.x,dz=pl.z-c.z,d=Math.hypot(dx,dz);
   if(d<2.3&&d>.01&&pl.y<.25+c.t.h+c.t.ch*.5){if(Math.abs(c.sp)>6&&pl.hit<=0){pl.hit=1;hurt(25);if(deadT>0)msg('Has caído. Reapareciendo...')}const k=(2.3-d)/d;pl.x+=dx*k;pl.z+=dz*k}}
  const gy=groundAt(pl.x,pl.z,pl.y);pl.gy=gy;pl.vy-=22*dt;pl.y+=pl.vy*dt;if(pl.y<=gy){pl.y=gy;pl.vy=0}
  if(!S.wanted&&pl.hp<100&&Math.hypot(pl.x-LOC.ceviche.c[0],pl.z-LOC.ceviche.c[1])<13){pl.hp=Math.min(100,pl.hp+8*dt);bark('ceviche',.3)}}
 if(S.god){pl.hp=100;if(cur)cur.hp=cur.mhp||100}
 if(S.autoCam&&!cur&&S.cam===0&&(thr||st)&&S.camIdle>1.2&&!zoomOn)S.cy+=angDiff(pl.h,S.cy)*Math.min(1,dt*1.6);
 if(thr||st||S.fire)S.idle=0;else{S.idle+=dt;if(S.idle>35){S.idle=0;bark('idle')}}
 // vehículos
 for(const c of cars){if(c!==cur&&!c.fixed){if(c.ai)aiStep(c,dt);else if(!c.police||c.hp<=0)drive(c,dt,0,0,false)}carWorld(c);
  if(c.hp<=0&&!c.fused){c.fused=true;c.fuse=rr(1.8,3);if(c===cur)bark('boom')}
  if(c.fuse>0){c.fuse-=dt;if(c.fuse<=0)explode(c)}
  if(c.hp<50&&!c.boom){c.sm-=dt;if(c.sm<=0&&smoke.length<60){c.sm=.15;smoke.push({x:c.x+Math.sin(c.h)*1.5,y:1.1,z:c.z+Math.cos(c.h)*1.5,t:0})}}}
 policeUpdate(dt);gangUpdate(dt);mugUpdate(dt);trafficUpdate(dt);Phone.update(dt);Flirt.update(dt);DATE.update(dt);Music.update();shopUpdate(dt);carPairs();
 for(const p of pickups)if(!p.got&&Math.hypot(p.x-pl.x,p.z-pl.z)<3.4&&pl.y<2){p.got=true;Story.pick()}
 // peatones (los clientes del club se quedan en su sitio hasta que se asustan)
 for(const n of npcs){const dp=Math.hypot(n.x-pl.x,n.z-pl.z),far=dp>90;n.t-=dt;
  if(n.st==='down'){if(n.mug){n.gone=1;continue}if(n.t<=0)Object.assign(n,n.fixed?n.proto:mkNpc());continue}
  if(n.mug){muggerStep(n,dt);continue}
  if(far)continue;
  if(n.fixed&&n.st!=='flee'){n.mv=0;continue}
  for(const c of cars)if(Math.abs(c.sp)>6&&Math.hypot(c.x-n.x,c.z-n.z)<2.1){npcDown(n,c===cur?'car':'ai');break}
  if(n.st==='down')continue;
  for(const c of cars)if(Math.abs(c.sp)>6&&Math.hypot(c.x-n.x,c.z-n.z)<9&&n.st!=='flee'){n.st='flee';n.t=3;n.h=Math.atan2(n.x-c.x,n.z-c.z)}
  if(n.tag==='debt'&&dp<30){n.st='flee';n.t=2.5}
  if(n.fixed&&n.t<=0){if(dp>22){Object.assign(n,n.proto);continue}n.t=2}
  if(n.t<=0){if(n.st==='walk'){n.st='idle';n.t=rr(1,3)}else{n.st='walk';n.t=rr(2,6);n.h=rr(0,TAU)}}
  if(n.st==='flee'&&Math.random()<dt*2)n.h=Math.atan2(n.x-pl.x,n.z-pl.z)+rr(-.7,.7);
  if(n.st!=='idle'){const v=n.st==='flee'?5.5:1.8;n.x+=Math.sin(n.h)*v*dt;n.z+=Math.cos(n.h)*v*dt;n.ph+=dt*v*2.3;n.mv=v/6.5;
   if(hitSolids(n,.4)||n.x<-4||n.x>CITY+4||n.z<-4||n.z>CITY+4)n.h+=Math.PI*.6}else n.mv=0}
 npcs=npcs.filter(n=>!n.gone);
 for(const s of smoke)s.t+=dt;smoke=smoke.filter(s=>s.t<1.3);
 for(const s of sparks)s.t-=dt;sparks=sparks.filter(s=>s.t>0);
 cool-=dt;if(S.fire&&cool<=0&&deadT<=0&&!fz){cool=S.weapon===1?.15:.1;shoot()}
 Story.update(dt);
 // cámara: tercera persona (suavizada, 3 distancias) o primera persona
 const lim=pitchLim();S.cp=clamp(S.cp,lim[0],lim[1]);
 if(S.cam===1){const hy=cur?1.38:1.72,fo=cur?.45:.12,ex=(cur||pl).x+Math.sin(cur?cur.h:S.cy)*fo,ey=hy+pl.y,ez=(cur||pl).z+Math.cos(cur?cur.h:S.cy)*fo,cpv=S.cp;
  S.eye=[ex,ey,ez];S.T=[ex+Math.sin(S.cy)*Math.cos(cpv)*10,ey-Math.sin(cpv)*10,ez+Math.cos(S.cy)*Math.cos(cpv)*10];S.eyeS=null;}
 else{const base=cur?[6.5,9,13][S.camI]:[3.2,5,7.4][S.camI],foot=cur?1.4:1.6,Dd=zoomOn&&!cur?2.6:base,side=cur?0:(zoomOn?1.3:1.15),Tx=pl.x+Math.cos(S.cy)*side,Ty=foot+pl.y,Tz=pl.z-Math.sin(S.cy)*side,cp=S.cp;let d=Dd,ex,ey,ez;
  for(;;){ex=Tx-Math.sin(S.cy)*Math.cos(cp)*d;ey=Ty+Math.sin(cp)*d+.3;ez=Tz-Math.cos(S.cy)*Math.cos(cp)*d;
   let bad=ey<.4;if(!bad)for(const s of solids)if(ey<s.h&&ex>s.x0-.4&&ex<s.x1+.4&&ez>s.z0-.4&&ez<s.z1+.4){bad=true;break}
   if(!bad){const n=Math.ceil(d/1.5);for(let k=1;k<n;k++){const f=k/n;if(f*d>2.5&&hAt(Tx+(ex-Tx)*f,Tz+(ez-Tz)*f)>Ty+(ey-Ty)*f){bad=true;break}}}
   if(!bad||d<1.2)break;d-=.6}
  let eye=[ex,Math.max(.4,ey),ez];const es=S.eyeS;
  if(es&&Math.hypot(es[0]-eye[0],es[2]-eye[2])<14){const kk=Math.min(1,dt*(zoomOn||S.fire?40:22));eye=[es[0]+(eye[0]-es[0])*kk,es[1]+(eye[1]-es[1])*kk,es[2]+(eye[2]-es[2])*kk]}
  S.eyeS=eye;const sh=S.shake*.35;S.eye=[eye[0]+rr(-sh,sh),eye[1]+rr(-sh,sh),eye[2]+rr(-sh,sh)];S.T=[Tx,Ty,Tz]}
 if(S.cam===1&&S.shake>0){const sh=S.shake*.2;S.eye=[S.eye[0]+rr(-sh,sh),S.eye[1]+rr(-sh,sh),S.eye[2]+rr(-sh,sh)]}
 S.fov+=((zoomOn?S.fovB*.74:S.fovB+(cur?Math.min(.2,Math.abs(cur.sp)/68*.2):0))-S.fov)*Math.min(1,dt*6);
 findLock();sndUpdate();
 if(msgT>0){msgT-=dt;if(msgT<=0)$('msg').textContent=''}else $('msg').textContent=promptText()}
// ---------- Render ----------
const cubeAt=(x,y,z,s,c)=>E.draw([s,0,0,0,0,s,0,0,0,0,s,0,x,y,z,1],c[0],c[1],c[2]);
function render(){
 if(S.mode==='menu'||S.mode==='pause'){const a=performance.now()/9000;S.eye=[CITY/2+Math.cos(a)*230,90,CITY/2+Math.sin(a)*230];S.T=[CITY/2,5,CITY/2];S.fov=1.05}
 const e=S.eye,t=performance.now()/1000,vp=E.mul(E.persp(S.fov,E.aspect(),.45,S.fog+60),E.lookAt(e,S.T)),k=dayK(S.time);S.vp=vp;
 E.begin(e,vp,S.fog,skyCol(k),lightVec(k),.34+.66*k);E.drawStatic(statFlat,0,1);E.drawStatic(statRoad,2,1);E.drawStatic(statFlatGlow,k<.6,1);E.drawStatic(stat,0);E.drawStatic(statGlow,k<.6);E.beginDyn();
 const nr=S.fog+20;
 for(const c of cars)if(Math.hypot(c.x-e[0],c.z-e[2])<nr)drawCar(c);
 for(const n of npcs)if(Math.hypot(n.x-e[0],n.z-e[2])<nr)human({x:n.x,z:n.z,h:n.h,ph:n.ph,mv:n.mv,t,look:n.look,lying:n.st==='down',tag:n.tag===('debt')?'debt':undefined,wep:0,dance:n.pose==='dance'&&n.st!=='flee'&&!(Flirt.open&&Flirt.n===n),talk:(n.pose==='talk'||(Flirt.open&&Flirt.n===n))&&n.st!=='flee'});
 for(const g of gang)if(Math.hypot(g.x-e[0],g.z-e[2])<nr)human({x:g.x,z:g.z,h:g.h,ph:g.ph,mv:g.mv,t,look:g.look,sc:g.sc,lying:g.st==='down',wep:1,aim:g.los?1:0,pitch:0,flash:g.flash});
 if(M.lalo)human({x:M.lalo.x,z:M.lalo.z,h:Math.PI,t,look:{jk:[.9,.8,.2],pn:[.3,.3,.4],sk:[.7,.5,.35],hr:[.1,.08,.05],hat:true,kind:'npc'},wep:0});
 for(const p of pickups)if(!p.got)bag(p,t);
 for(const o of offs)human({x:o.x,z:o.z,h:o.h,ph:o.ph,mv:o.mv,t,look:o.look,lying:o.st==='down',wep:1,aim:o.los&&S.wanted>=2?1:0,pitch:0,flash:o.flash});
 if(!cur&&S.mode!=='menu'&&S.cam===0)human({x:pl.x,z:pl.z,h:pl.h,y:pl.y,air:pl.y>pl.gy+.08,ph:pl.ph,mv:pl.mv,t,look:DAMIAN,lying:deadT>0,wep:S.weapon,aim:S.weapon===1&&(S.zoom||S.aim||pl.aimT>0)?1:0,pitch:S.cp*.7,atk:pl.atk,hand:pl.hand,flash:pl.flash});
 if(S.mode==='play'){for(const m of S.marks)beacon(m,t);if(S.way)wayBeacon(S.way,t)}
 for(const h of hearts)E.draw([.22,0,0,0,0,.22,0,0,0,0,.22,0,h.x,h.y,h.z,1],1,.35,.6,1);
 if(S.cam===1&&!cur&&S.mode==='play')fpHand(t)
 for(const s of smoke){const z=.3+s.t*.7;cubeAt(s.x,s.y+s.t*2,s.z,z,[.35,.35,.35])}
 for(const s of sparks)E.draw([.35,0,0,0,0,.35,0,0,0,0,.35,0,s.x,s.y,s.z,1],1,.85,.2,1);
 if(S.mode==='play')Hud.lock()}
// Arma/puño visible en primera persona
function fpHand(t){const e=S.eye,B=mm(mm(mm(Tm(e[0],e[1],e[2]),Rym(S.cy)),Rxm(S.cp)),Tm(-.22,-.24+Math.sin(t*2)*.004-(pl.flash>0?-.02:0),.5));
 if(S.weapon===1){bx(B,0,0,.1,.07,.1,.34,[.12,.12,.14]);bx(B,0,-.07,-.02,.07,.1,.09,[.2,.15,.1]);bx(B,0,-.1,-.06,.09,.07,.1,DAMIAN.sk);if(pl.flash>0)bx(B,0,0,.34,.14,.14,.14,[1,.9,.3],2,1)}
 else if(S.weapon===2){const p=pl.atk>0?Math.sin((1-pl.atk)*Math.PI)*.4:0;bx(B,.12-p*.1,0,.15+p,.14,.14,.2,DAMIAN.sk);bx(B,.12-p*.1,-.03,-.05+p,.16,.12,.3,DAMIAN.jk)}
 else{const p=pl.atk>0?Math.sin((1-pl.atk)*Math.PI)*.4:0;bx(B,0,0,.2+p,.03,.05,.4,[.85,.88,.92],1.2);bx(B,0,-.02,-.02+p,.08,.08,.12,[.2,.1,.05])}}
// ---------- Interfaz y bucle ----------
function setQ(q){S.fog=[130,190,260][q];E.resize([.5,.75,1][q])}
function start(){audioInit();Music.init();if(audio&&audio.state==='suspended')audio.resume();
 if(S.mode==='menu'||S.restart){reset();S.restart=false;const sel=+$('mSel').value;if(sel>0){S.cash=250+sel*350;Story.jump(sel)}}
 S.mode='play';$('ov').classList.add('off');$('mapw').hidden=true;$('hud').hidden=false;$('c').requestPointerLock&&$('c').requestPointerLock()}
function pause(){S.mode='pause';S.fire=0;S.aim=false;S.keys={};sndMute();Music.stop();Flirt.close();$('ov').classList.remove('off');$('ovt').textContent='Pausa · mapa de TrujiYork (clic = waypoint, clic derecho = quitar)';
 $('bPlay').textContent='Continuar';$('bRst').hidden=false;$('mapw').hidden=false;$('zlg').innerHTML=zoneLegend();FM.hov=null;drawFullMap()}
$('bPlay').onclick=start;
$('bRst').onclick=()=>{S.mode='menu';start()};
$('q').onchange=e=>setQ(+e.target.value);$('vol').oninput=e=>S.vol=+e.target.value;
$('sens').oninput=e=>{S.sens=+e.target.value;$('sensv').textContent=S.sens.toFixed(2)};$('fovs').oninput=e=>{S.fovB=+e.target.value*Math.PI/180;$('fovv').textContent=e.target.value+'°'};
$('camsel').onchange=e=>setCam(+e.target.value);$('invX').onchange=e=>S.invX=e.target.checked;$('invY').onchange=e=>S.invY=e.target.checked;$('autoCam').onchange=e=>S.autoCam=e.target.checked;
$('aAim').onchange=e=>S.aAim=e.target.checked;$('aDrive').onchange=e=>S.aDrive=e.target.checked;
$('c').addEventListener('click',()=>{if(isPlay()&&document.pointerLockElement!==$('c'))$('c').requestPointerLock&&$('c').requestPointerLock()});
const fm=$('fmap');fm.addEventListener('mousemove',e=>fmapEvent(e,'move'));fm.addEventListener('mouseleave',()=>{FM.hov=null;if(S.mode==='pause')drawFullMap()});
fm.addEventListener('click',e=>fmapEvent(e,'set'));fm.addEventListener('contextmenu',e=>{e.preventDefault();fmapEvent(e,'clear')});
$('chin').addEventListener('keydown',e=>{e.stopPropagation();if(e.key==='Enter'){runCheat($('chin').value);closeCheat()}else if(e.key==='Escape')closeCheat()});
$('chl').innerHTML=CHEATS.map(c=>'<button data-c="'+c[0]+'"><b>'+c[0]+'</b> '+c[1]+'</button>').join('');
$('chl').addEventListener('click',e=>{const b=e.target.closest('button');if(b){runCheat(b.dataset.c);closeCheat()}});
addEventListener('resize',()=>{setQ(+$('q').value);if(S.mode==='pause')drawFullMap()});
let last=0;function loop(t){requestAnimationFrame(loop);const dt=Math.min(.05,(t-last)/1000||0);last=t;
 if(S.panic)return;
 if(S.mode==='play'){update(dt);}render();if(S.mode==='play')Hud.update(dt)}
(function(){const sel=$('mSel');if(!sel||!sel.appendChild)return;let saved=0;try{saved=+localStorage.getItem('manada_m')||0}catch(_){}
 for(let i=0;i<Story.count();i++){const o=document.createElement('option');o.value=i;o.textContent=(i<5?'Cap.1 · ':i<15?'Cap.2 · ':'Cap.3 · ')+(i+1)+'. '+Story.title(i);if(i===saved)o.selected=true;sel.appendChild(o)}})();
if(typeof E.begin==='function'){buildWorld();mmInit();reset();setQ(1);requestAnimationFrame(loop)}
