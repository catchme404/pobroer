'use strict';
// TrujiYork · creador: catchme404
// ================= NÚCLEO: constantes, mundo, vehículos, sonido =================
const $=id=>document.getElementById(id);
const N=14,P=52,W=12,CITY=N*P,TAU=Math.PI*2;
let seed=7;const rnd=()=>{seed=seed*16807%2147483647;return seed/2147483647},rr=(a,b)=>a+Math.random()*(b-a);
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v)),angDiff=(a,b)=>Math.atan2(Math.sin(a-b),Math.cos(a-b)),pick=a=>a[Math.random()*a.length|0],BC=(i,j)=>[i*P+P/2,j*P+P/2];
const S={mode:'menu',keys:{},cy:0,cp:.35,vol:.5,fog:200,eye:[130,60,130],T:[130,0,130],fire:0,weapon:1,zoom:false,aim:false,wanted:0,cash:0,
 cam:0,camI:1,sens:1,invX:false,invY:false,fovB:1.05,autoCam:false,camIdle:0,frozen:0,eyeS:null,time:10,way:null,god:false,sj:false,panic:false,aAim:true,aDrive:true,shake:0,hurt:0,hitT:0,fov:1.05,mmz:1.7,vp:null,lock:null,idle:0,restart:false,marks:[]};
const solids=[],SIGNS=[];
let stat,cars=[],npcs=[],offs=[],gang=[],pickups=[],smoke=[],sparks=[],pl,cur=null,msgT=0,deadT=0,spots=[],fastCar=null;
const FAST={n:'Superdeportivo',c:[.1,.9,.8],w:1.9,l:4.4,h:.5,ch:.4,m:68,a:30};
const TYPES=[
 {n:'Sedán',c:[.75,.15,.15],w:1.9,l:4.2,h:.8,ch:.7,m:30,a:12},
 {n:'Deportivo',c:[.95,.8,.1],w:1.9,l:4.2,h:.55,ch:.45,m:42,a:20},
 {n:'Furgoneta',c:[.9,.9,.9],w:2.1,l:5,h:1.5,ch:.7,m:24,a:8},
 {n:'Camioneta',c:[.2,.4,.75],w:2,l:4.8,h:.9,ch:.8,m:27,a:10}];
const COPT={
 cop:{n:'Patrulla',c:[.1,.12,.3],w:2,l:4.5,h:.9,ch:.65,m:34,a:16,liv:1},
 inter:{n:'Interceptor',c:[.05,.06,.1],w:1.95,l:4.4,h:.55,ch:.42,m:52,a:26,liv:1},
 swat:{n:'Camión SWAT',c:[.1,.12,.1],w:2.3,l:5.6,h:1.5,ch:.8,m:34,a:12,liv:2}};
// Lugares importantes: c = centro del local, m = punto de llegada frente a la puerta
const loc=(n,i,j,col,ch,m)=>{const c=BC(i,j);return{n,c,m:[c[0]+m[0],c[1]+m[1]],col,ch}};
const LOC={
 club:loc('Club Neón',5,5,'#ee3fa3','N',[0,14]),
 ceviche:loc('Cevichería El Lobo',1,5,'#f39a2b','C',[0,10]),
 paint:loc('Pintura Express',2,4,'#f4d03f','P',[12,0]),
 casa:loc('Casa de Doña Rosa',1,1,'#6fd4a8','H',[0,10]),
 mansion:loc('Mansión de Cristopher',11,3,'#c9a227','M',[0,14]),
 hotel:loc('Hotel Imperial',10,2,'#e8d27a','I',[0,14]),
 taveo:loc('Casa de Taveo',1,3,'#f4f6f8','T',[0,16]),
 vikkingos:loc('Vikkingos (restaurante de lujo)',10,4,'#d4af37','Y',[0,14]),
 mansiche:loc('Estadio Mansiche',6,11,'#2fa84f','S',[-40,0]),
 marea:loc('Discoteca Marea',9,8,'#2fb8c9','D',[0,14]),
 puerto:loc('Almacén del Puerto',2,11,'#9aa0a8','A',[-15,2]),
 mirador:loc('Mirador',1,7,'#7ac74f','V',[0,10]),
 plaza:loc('Plaza de Armas',6,7,'#e0b070','Z',[0,14]),
 comisaria:loc('Comisaría',6,4,'#4a6ad8','X',[0,10]),
 mercado:loc('Mercado de El Porvenir',10,6,'#e86a3a','R',[0,14]),
 univ:loc('Universidad',3,8,'#b88adf','U',[0,14]),
 muelle:loc('Muelle de Huanchaco',0,1,'#7fd0ff','J',[0,8])};
LOC.puerto.in=[LOC.puerto.c[0]+5,LOC.puerto.c[1]+8];
LOC.club.in=[LOC.club.c[0],LOC.club.c[1]+2];LOC.club.vip=[LOC.club.c[0]+8,LOC.club.c[1]-3];
// ---------- Forma de TrujiYork: ciudad irregular junto al mar (no es cuadrada) ----------
// ROWS[j] = [primera, última] columna de tierra en la fila j (norte→sur). Lo demás es mar (oeste) o desierto.
const ROWS=[[0,9],[0,10],[0,11],[0,12],[1,12],[1,12],[1,13],[1,13],[1,13],[1,13],[2,13],[2,12],[2,11],[3,10]];
const isLand=(i,j)=>j>=0&&j<N&&i>=0&&i<N&&i>=ROWS[j][0]&&i<=ROWS[j][1];
const isSea=(i,j)=>j>=0&&j<N&&!isLand(i,j)&&i<ROWS[j][0];
// Tramos de calle: vertical en x=i·P entre z=j·P y (j+1)·P · horizontal en z=j·P entre x=i·P y (i+1)·P
const isStad=(i,j)=>i>=4&&i<=8&&j>=10&&j<=12;   // el estadio Mansiche no tiene calles por dentro
const hasRoadV=(i,j)=>j>=0&&j<N&&i>=0&&i<=N&&!(i===0&&j===1)&&!(isStad(i-1,j)&&isStad(i,j))&&(isLand(i-1,j)||isLand(i,j));
const hasRoadH=(i,j)=>i>=0&&i<N&&j>=0&&j<=N&&!(isStad(i,j-1)&&isStad(i,j))&&(isLand(i,j-1)||isLand(i,j));
const landAt=(x,z)=>isLand(Math.floor(x/P),Math.floor(z/P));
let SEGS=null;
function roadSegs(){if(!SEGS){SEGS=[];for(let i=0;i<=N;i++)for(let j=0;j<N;j++)if(hasRoadV(i,j))SEGS.push({ax:'z',line:i,k:j});for(let j=0;j<=N;j++)for(let i=0;i<N;i++)if(hasRoadH(i,j))SEGS.push({ax:'x',line:j,k:i})}return SEGS}
const randSeg=()=>{const L=roadSegs();return L[Math.random()*L.length|0]};
// Calle vertical más cercana a x, en la fila donde está z
function vLineNear(x,z){const j=clamp(Math.floor(z/P),0,N-1);let best=1,bd=1e9;for(let i=0;i<=N;i++)if(hasRoadV(i,j)){const d=Math.abs(i*P-x);if(d<bd){bd=d;best=i}}return best}
// ---------- Zonas de TrujiYork ----------
const ZONES=[
 {n:'El Golf',w:'Residencial, moderna, exclusiva',sl:'Relativamente alta',sec:3,lv:'#3fcf6a',col:'rgba(60,180,100,.25)'},
 {n:'California',w:'Acomodada, residencial, conectada',sl:'Relativamente alta',sec:3,lv:'#3fcf6a',col:'rgba(70,150,230,.25)'},
 {n:'San Andrés',w:'Céntrica, residencial, universitaria',sl:'Intermedia',sec:2,lv:'#e8d23a',col:'rgba(220,200,70,.25)'},
 {n:'Centro Histórico',w:'Comercial, histórico, concurrido',sl:'Variable',sec:2,lv:'#e8d23a',col:'rgba(230,150,60,.25)'},
 {n:'El Porvenir',w:'Populoso, comercial, trabajador',sl:'Riesgo elevado en sectores',sec:1,lv:'#f08a2a',col:'rgba(240,110,40,.25)'},
 {n:'Florencia de Mora',w:'Popular, urbana, densamente poblada',sl:'Precaución elevada en sectores',sec:0,lv:'#e84a4a',col:'rgba(220,70,70,.25)'},
 {n:'Huanchaco',w:'Playa, pescadores y malecón',sl:'Media',sec:2,lv:'#e8d23a',col:'rgba(70,200,200,.25)'}];
function zoneOf(i,j){if(i<=2&&j<=3)return 6;if(j>=10)return 5;if(i>=9&&j<=4)return 0;if(j<=3&&i>=3&&i<=8)return 1;if(i>=9)return 4;if(i<=4&&j>=4&&j<=9)return 2;return 3}
const zoneAt=(x,z)=>zoneOf(clamp(Math.floor(x/P),0,N-1),clamp(Math.floor(z/P),0,N-1));
const BAGC=[[.9,.3,.2],[.2,.5,.85],[.2,.2,.2],[.95,.8,.2]],SHOES=[[.95,.95,.95],[.1,.1,.12],[.6,.3,.15],[.9,.2,.3]];
// ---------- Día y noche ----------
// k: 0 = noche cerrada, 1 = pleno día (amanece 5-7, anochece 18-20)
function dayK(h){h=((h%24)+24)%24;if(h>=7&&h<=18)return 1;if(h>=20||h<=5)return 0;if(h<7)return(h-5)/2;return 1-(h-18)/2}
function lightVec(k){const w=Math.sin(Math.PI*k)*(k<1&&k>0?1:0);return[.2+.8*k+w*.12,.27+.73*k-w*.05,.5+.5*k-w*.2]}
function skyCol(k){const w=Math.sin(Math.PI*k);return[.02+.58*k+w*.28,.03+.69*k+w*.06,.08+.74*k-w*.1]}
const isNight=()=>dayK(S.time)<.6;
const fmtTime=()=>{const h=S.time%24;return String(h|0).padStart(2,'0')+':'+String((h%1)*60|0).padStart(2,'0')};
// ---------- Rejilla de alturas (disparos y línea de visión rápidos) ----------
const GC=2,GO=24,GW=Math.ceil((CITY+2*GO)/GC);const GH=new Float32Array(GW*GW);
const gi=v=>Math.floor((v+GO)/GC);
function buildGrid(){GH.fill(0);for(const s of solids){if(s.x1-s.x0<2&&s.z1-s.z0<2)continue;
 for(let i=gi(s.x0);i<=gi(s.x1);i++)for(let j=gi(s.z0);j<=gi(s.z1);j++)if(i>=0&&j>=0&&i<GW&&j<GW)GH[i*GW+j]=Math.max(GH[i*GW+j],s.h)}}
const hAt=(x,z)=>{const i=gi(x),j=gi(z);return i<0||j<0||i>=GW||j>=GW?0:GH[i*GW+j]};
function lineClear(x0,z0,x1,z1){const d=Math.hypot(x1-x0,z1-z0),n=Math.ceil(d/2);for(let k=1;k<n;k++){const t=k/n;if(hAt(x0+(x1-x0)*t,z0+(z1-z0)*t)>1.6)return false}return true}
// ---------- Entidades ----------
function mkCar(t,x,z,h,ai){const ty=typeof t==='number'?TYPES[t]:t;return{t:ty,x,z,h,sp:0,hp:100,mhp:100,ai,st:0,sm:0,str:0,col:null,fuse:0,boom:false}}
function mkAI(){const sg=randSeg(),c=mkCar(Math.random()*4|0,0,0,0,{axis:sg.ax,dir:Math.random()<.5?1:-1,line:sg.line,last:-1,slow:Math.random()<.35});placeAI(c,sg.k*P+rr(4,P-4));return c}
function placeAI(c,u){const a=c.ai,lat=a.line*P+(a.axis=='z'?3*a.dir:-3*a.dir);
 if(a.axis=='z'){c.x=lat;c.z=u;c.h=a.dir>0?0:Math.PI}else{c.z=lat;c.x=u;c.h=a.dir>0?Math.PI/2:-Math.PI/2}}
function relocAI(v){const sg=randSeg();v.ai={axis:sg.ax,dir:Math.random()<.5?1:-1,line:sg.line,last:-1,slow:!!(v.ai&&v.ai.slow)};placeAI(v,sg.k*P+rr(4,P-4));v.sp=0;v.blkT=0}
function aiStep(v,dt){const a=v.ai;if(v.hp<=0){v.ai=null;return}
 let blk=false;const fx=Math.sin(v.h),fz=Math.cos(v.h);
 for(const o of cars.concat([pl])){if(o===v||o===cur)continue;const dx=o.x-v.x,dz=o.z-v.z,d=dx*fx+dz*fz;if(d>0&&d<9&&Math.abs(dx*fz-dz*fx)<2.6){blk=true;break}}
 if(cur&&cur!==v){const dx=cur.x-v.x,dz=cur.z-v.z;if(dx*fx+dz*fz>0&&dx*fx+dz*fz<9&&Math.abs(dx*fz-dz*fx)<2.6)blk=true}
 drive(v,dt,blk?-.8:(v.sp<(a.fast?24:(a.slow?6:11))?.6:0),0,blk&&v.sp<1);
 // atascado tras un choque o detrás de otro coche: tras unos segundos el conductor busca otra calle
 if(blk&&Math.abs(v.sp)<1){v.blkT=(v.blkT||0)+dt;if(v.blkT>7){relocAI(v);return}}else v.blkT=0;
 const u=a.axis=='z'?v.z:v.x,k=Math.round(u/P);
 if(a.last!==k&&Math.abs(u-k*P)<1.2){a.last=k;const old=a.line,along=a.dir>0?k:k-1;
  const fwd=a.axis=='z'?hasRoadV(old,along):hasRoadH(along,old),
   tp=a.axis=='z'?hasRoadH(old,k):hasRoadV(k,old),
   tn=a.axis=='z'?hasRoadH(old-1,k):hasRoadV(k,old-1);
  const opts=[];if(fwd)opts.push(0,0,0);if(tp)opts.push(1);if(tn)opts.push(-1);
  if(!opts.length){a.dir*=-1;placeAI(v,u)}
  else{const ch=opts[Math.random()*opts.length|0];if(ch){a.axis=a.axis=='z'?'x':'z';a.dir=ch;a.line=k;a.last=old;placeAI(v,old*P)}}}
 if(u<-5||u>CITY+5){a.dir*=-1;placeAI(v,clamp(u,0,CITY))}}
function roadPos(){const sg=randSeg();return sg.ax=='z'?[sg.line*P+rr(-4,4),sg.k*P+rr(5,P-5)]:[sg.k*P+rr(5,P-5),sg.line*P+rr(-4,4)]}
const SKIN=[[.93,.74,.58],[.8,.58,.42],[.6,.4,.28],[.45,.3,.2]],HAIR=[[.08,.06,.05],[.25,.15,.08],[.5,.35,.15],[.15,.15,.18],[.7,.7,.7]];
function mkNpc(){const [x,z]=roadPos();return{x,z,h:rr(0,TAU),st:'walk',t:rr(1,4),hp:50,ph:rr(0,6),mv:0,tag:null,
 look:{jk:[rr(.2,.9),rr(.2,.9),rr(.2,.9)],pn:pick([[.15,.15,.3],[.25,.25,.28],[.4,.3,.2],[.2,.3,.45]]),sk:pick(SKIN),hr:pick(HAIR),hat:Math.random()<.2,sh:Math.random()<.15,bag:Math.random()<.2?pick(BAGC):null,glasses:Math.random()<.15,shoe:pick(SHOES),long:Math.random()<.2,kind:'npc'}}}
// Clientes de la discoteca: hombres formales conversando y chicas bailando (son NPC fijos)
const SUITS=[[.07,.07,.1],[.12,.14,.22],[.2,.2,.22],[.25,.12,.12]],DRESS=[[.85,.1,.3],[.1,.3,.8],[.9,.7,.15],[.55,.1,.7],[.1,.7,.55],[.9,.9,.92]],TIES=[[.8,.1,.15],[.1,.2,.7],[.9,.8,.2]];
const MEN_LINES=['...y los precios del puerto subieron otra vez, qué barbaridad.','Dicen que un italiano está comprando media ciudad.','Yo solo hablo de negocios... con whisky en la mano.','Cuidado con lo que dices, hay oídos en todas partes.','El Golf se está poniendo carísimo, amigo.'];
const GIRL_LINES=['¡Baila conmigo! Jaja, ¿o te da roche?','Qué bonita noche, ¿no?','Aquí se viene a disfrutar, no a pelear.','Me encanta esta canción.','Invítame un trago y vemos.'];
let girlIdx=0;
const LIPS=[[.8,.1,.2],[.9,.3,.4],[.6,.1,.3],[.85,.2,.15]],EYES=[[.25,.15,.08],[.1,.2,.1],[.15,.15,.25],[.05,.05,.05]],HRC=[[.05,.04,.04],[.3,.15,.08],[.6,.4,.15],[.12,.08,.06],[.45,.1,.1]];
function mkPatron(x,z,h,kind,pose,i){const man=kind==='man',sk=pick(SKIN);let look,girl=null;
 if(man)look={jk:pick(SUITS),pn:null,sk,hr:pick(HAIR),sh:Math.random()<.3,suit:pick(TIES),kind:'npc'},look.pn=look.jk;
 else{const dr=pick(DRESS);look={jk:dr,pn:sk,sk,hr:pick(HRC),dress:1,detail:1,style:i%4,trim:[Math.min(1,dr[0]+.25),Math.min(1,dr[1]+.25),Math.min(1,dr[2]+.25)],lip:pick(LIPS),eye:pick(EYES),bag:pick(DRESS),nail:pick(LIPS),heel:pick([[.1,.05,.08],[.7,.1,.2],[.9,.9,.9]]),kind:'npc'};girl=GIRLS[girlIdx++%GIRLS.length]}
 const n={x,z,h,st:'idle',t:1e9,hp:50,ph:i*1.7,mv:0,tag:'patron',fixed:1,pose,look,lines:man?MEN_LINES:GIRL_LINES,girl,name:girl?girl.n:null};n.proto=Object.assign({},n);npcs.push(n)}
function mkPatrons(){const c=LOC.club.c,x=c[0],z=c[1];let i=0;girlIdx=0;
 [[-7,1.5],[5,-1],[-6.5,-3.2],[8.5,3.5]].forEach(([dx,dz],k)=>{mkPatron(x+dx,z+dz,Math.PI/2,'man','talk',i++);mkPatron(x+dx+1.4,z+dz,-Math.PI/2,'man','talk',i++)});
 for(let k=0;k<9;k++)mkPatron(x-3+(k%3)*3+rr(-.5,.5),z-.5+Math.floor(k/3)*2.4,rr(0,TAU),'woman','dance',i++);
 mkPatron(x-1.5,z-5.2,0,'woman','talk',i++);mkPatron(x+1.5,z-5.2,0,'man','talk',i++);
 mkPatron(x-2.7,z+9.6,0,"man","guard",i++);mkPatron(x+2.7,z+9.6,0,"man","guard",i++);
}
// Personajes con nombre repartidos por TrujiYork (hablas con E). Alex Ross es tu mejor amigo.
const NAMED=[
 {n:'Alex Ross',role:'Tu mejor amigo',best:1,at:()=>[P*4+7.2,P*1.4+5],look:{jk:[.78,.12,.14],pn:[.2,.28,.46],sk:[.8,.6,.44],hr:[.06,.05,.05],hat:true,hatc:[.1,.1,.12],kind:'npc'},
  lines:['Hermano, aquí estoy para lo que necesites. Desde chibolos juntos, ¿te acuerdas?','Si la cosa se pone fea, me escribes al celular y llego volando.','Cuidado con los Tiburones, pata. Yo te cubro la espalda.','¿Te acuerdas cuando nos escapábamos al mirador? Qué tiempos.','Eres como mi hermano, Damián. Nunca lo olvides.']},
 {n:'Cristo',role:'Arregla celulares',at:()=>[LOC.ceviche.c[0]+9,LOC.ceviche.c[1]+9],look:{jk:[.95,.95,.9],pn:[.55,.45,.3],sk:[.75,.55,.4],hr:[.08,.06,.05],kind:'npc'},
  lines:['¡Habla, causa! Soy Cristo, el de la esquina.','Me dicen Cristo pero no hago milagros... solo arreglo celulares.','Aquí el ceviche te cura todo, hasta el mal de amores.']},
 {n:'Charlie',role:'Vende tiempo aire',at:()=>[LOC.paint.c[0]+11,LOC.paint.c[1]-8],look:{jk:[.2,.55,.3],pn:[.15,.15,.2],sk:[.9,.7,.55],hr:[.5,.35,.15],sh:true,kind:'npc'},
  lines:['Charlie, mucho gusto. Vendo recargas y chismes.','Ayer vi unos tipos raros por el puerto, cuidado.','Si te falta saldo, yo te lo consigo... a precio de amigo.']},
 {n:'Omar',role:'Paseante',at:()=>[LOC.plaza.c[0]+8,LOC.plaza.c[1]+10],look:{jk:[.9,.8,.25],pn:[.2,.25,.4],sk:[.7,.5,.36],hr:[.05,.05,.06],kind:'npc'},
  lines:['Omar, a tu servicio. Yo no me meto en problemas... los problemas me buscan.','La Plaza de Armas está tranquila hoy, aprovecha.','Dicen que la catedral tiene un túnel secreto. Yo no he visto nada.']},
 {n:'Luis',role:'Estudiante',at:()=>[LOC.univ.c[0]-1,LOC.univ.c[1]+10],look:{jk:[.45,.45,.5],pn:[.2,.2,.25],sk:[.85,.65,.5],hr:[.15,.1,.08],sh:false,kind:'npc'},
  lines:['Soy Luis, estudio en la universidad. Mi tesis va... en proceso.','El mirador es lo mejor para pensar. O para huir.','Si me ayudas con un trabajo de historia, te invito un café.']},
 {n:'Taveo',role:'Ligador oficial de Huanchaco',at:()=>[LOC.taveo.c[0]-12,LOC.taveo.c[1]+17],look:{jk:[.2,.35,.8],pn:[.15,.15,.15],sk:[.6,.4,.28],hr:[.04,.04,.04],hat:true,hatc:[.9,.9,.9],sh:true,kind:'npc'},
  lines:['Broer, ayer me hice a 2 en un tono. Yo no pregunto, invito.','Pata, la clave es no mirar el celular y decir algo que la haga reír.','Las chicas del Golf se derriten con un chilcano bien frío. Anótalo.','Si te dice que tiene novio... pregúntale con qué nombre lo tiene guardado. Jaja, mentira, tú tranquilo.','Primero la sonrisa, después el cumplido... y al final la llevas a cenar a Vikkingos. Sin falla, broer.','En Huanchaco las olas no son lo único que se rompen, ¿ya?','La de la pista de la Marea me dio su número. Tenía que ser, jaja.']},
 {n:'Alesso',role:'Inmobiliario',at:()=>[LOC.hotel.c[0]-8,LOC.hotel.c[1]+12],look:{jk:[.07,.07,.1],pn:[.07,.07,.1],sk:[.88,.7,.55],hr:[.35,.25,.15],sh:true,suit:[.8,.7,.2],kind:'npc'},
  lines:['Alesso. Negocios inmobiliarios en El Golf, ya sabes.','No hablo con gente sin traje... pero tú me caes bien.','Si ves a un italiano con sombrero, no le compres nada.']}];
function mkNamed(){NAMED.forEach((d,i)=>{const p=d.at(),n={x:p[0],z:p[1],h:rr(0,TAU),st:'idle',t:1e9,hp:50,ph:i*1.3,mv:0,tag:'patron',fixed:1,pose:'talk',name:d.n,role:d.role,friend:1,best:d.best||0,look:d.look,lines:d.lines,li:0};n.proto=Object.assign({},n);npcs.push(n)})}
function reset(){
 cars=[];npcs=[];offs=[];gang=[];pickups=[];smoke=[];sparks=[];cur=null;seed=11;deadT=0;
 S.alexMet=false;S.wanted=0;S.time=10;S.way=null;S.weapon=1;S.zoom=false;S.aim=false;S.cash=250;S.lock=null;S.marks=[];S.idle=0;S.shake=0;S.hurt=0;
 pl={x:P*4,z:P*1.4,h:0,hp:100,hit:0,atk:0,atkCd:0,hand:0,ph:0,mv:0,shoot:0,aimT:0,flash:0,heal:0,y:0,vy:0,gy:0};S.cy=0;S.cp=.35;
 spots.forEach((s,i)=>{if(i%2==0)cars.push(mkCar(i/2%4|0,s[0],s[1],s[2],null))});
 for(let k=0;k<26;k++){const sg=randSeg(),side=Math.random()<.5?1:-1,u=sg.k*P+rr(8,P-8);if(sg.ax==='z')cars.push(mkCar(k%4,sg.line*P+side*(W/2-2.2),u,side>0?0:Math.PI,null));else cars.push(mkCar(k%4,u,sg.line*P+side*(W/2-2.2),side>0?Math.PI/2:-Math.PI/2,null))}
 cars.push(mkCar(1,P*4+3.5,P*1.4+8,0,null));
 spawnFast();
 for(let k=0;k<26;k++)cars.push(mkAI());initWrecks();
 for(let k=0;k<56;k++)npcs.push(mkNpc());
 mkPatrons();mkNamed();
 policeReset();Phone.reset();Flirt.reset();Story.reset()}
function spawnFast(){if(fastCar)cars=cars.filter(c=>c!==fastCar);const c=LOC.club.c;fastCar=mkCar(FAST,c[0]-26,c[1],0,null);cars.push(fastCar)}
// ---------- Física ----------
function hitSolids(o,r){let hit=false;for(const s of solids){if(o.y&&s.h<=o.y+.15)continue;const cx=clamp(o.x,s.x0,s.x1),cz=clamp(o.z,s.z0,s.z1);let dx=o.x-cx,dz=o.z-cz,d2=dx*dx+dz*dz;
 if(d2<r*r){if(d2<1e-6){dx=o.x-(s.x0+s.x1)/2;dz=o.z-(s.z0+s.z1)/2;d2=dx*dx+dz*dz||1}const d=Math.sqrt(d2),k=(r-d)/d;o.x+=dx*k;o.z+=dz*k;hit=true}}
 o.x=clamp(o.x,-W,CITY+W);o.z=clamp(o.z,-W,CITY+W);return hit}
// Dirección más ágil: el volante se suaviza, gira más a baja/media velocidad y el freno de mano permite derrapar
function drive(v,dt,thr,st,hb){const t=v.t;if(v.hp<=0){thr=0;st=0}
 if(thr>0)v.sp+=t.a*thr*dt*(v.sp<0?2:1);else if(thr<0)v.sp-=(v.sp>.5?t.a*1.6:t.a*.6)*dt*-thr;
 else v.sp-=Math.sign(v.sp)*Math.min(Math.abs(v.sp),4*dt);
 if(hb)v.sp-=Math.sign(v.sp)*Math.min(Math.abs(v.sp),(Math.abs(st)>.2?13:22)*dt);
 v.sp=clamp(v.sp,-t.m*.3,t.m*(v.hp<30?.6:1));
 v.str+=(st-v.str)*Math.min(1,dt*(st?10:16));
 const rate=2.9/Math.sqrt(1+(v.sp/22)**2)*clamp(v.sp/5,-1,1)*(hb&&Math.abs(v.sp)>6?1.8:1);
 v.h+=v.str*rate*dt;
 v.x+=Math.sin(v.h)*v.sp*dt;v.z+=Math.cos(v.h)*v.sp*dt}
// Asistente de conducción: al soltar el volante en una calle, el coche se alinea suavemente con ella
function laneAssist(v,dt){const q=Math.PI/2,tg=Math.round(v.h/q)*q,e=angDiff(tg,v.h);if(Math.abs(e)>.32)return;
 const nx=Math.abs(v.x-Math.round(v.x/P)*P)<W/2-1.5,nz=Math.abs(v.z-Math.round(v.z/P)*P)<W/2-1.5,alongZ=Math.abs(Math.sin(tg))<.5;
 if(alongZ?nx:nz)v.h+=e*2*dt}
function carWorld(v){if(hitSolids(v,1.9)){const im=Math.abs(v.sp);if(im>7){v.hp-=im*.9;crashFx(v,im)}v.sp*=-.3;if(v.ai&&!v.ai.keep)v.ai=null}}
function crashFx(v,im){for(let k=0;k<3;k++)sparks.push({x:v.x+rr(-1,1),y:rr(.4,1),z:v.z+rr(-1,1),t:.15});
 if(v===cur){S.shake=Math.max(S.shake,clamp(im/28,.12,.7));thud(clamp(im/30,.3,1));Story.crash(im);if(im>13)bark('crash')}}
function carPairs(){for(let i=0;i<cars.length;i++)for(let j=i+1;j<cars.length;j++){const a=cars[i],b=cars[j],dx=b.x-a.x,dz=b.z-a.z,d=Math.hypot(dx,dz);
 if(d<3.8&&d>.01){const wa=a.fixed?0:1,wb=b.fixed?0:1,tot=wa+wb;if(!tot)continue;const k=(3.8-d)/d;
  a.x-=dx*k*wa/tot;a.z-=dz*k*wa/tot;b.x+=dx*k*wb/tot;b.z+=dz*k*wb/tot;const rel=Math.abs(a.sp-b.sp);
  if(rel>6){a.hp-=rel*.6;b.hp-=rel*.6;a.sp*=.4;b.sp*=.4;if(a.ai&&!a.ai.keep&&a!==cur)a.ai=null;if(b.ai&&!b.ai.keep&&b!==cur)b.ai=null;
   if(a===cur){b.hurtBy='pl';crashFx(a,rel)}if(b===cur){a.hurtBy='pl';crashFx(b,rel)}}}}}
// Altura del suelo bajo (x,z): muros bajos, mesas y techos de coches deportivos se pueden pisar al saltar
function groundAt(x,z,y){let g=0;for(const s of solids)if(s.h<=y+.5&&s.h>g&&x>s.x0-.3&&x<s.x1+.3&&z>s.z0-.3&&z<s.z1+.3)g=s.h;
 for(const c of cars){const h=.45+c.t.h+c.t.ch*.5;if(h<=y+.5&&h>g&&Math.hypot(c.x-x,c.z-z)<1.5)g=h}return g}
function snapRoad(o){let best=null,bd=1e9;for(const sg of roadSegs()){const cx=sg.ax=='z'?sg.line*P:clamp(o.x,sg.k*P,(sg.k+1)*P),cz=sg.ax=='z'?clamp(o.z,sg.k*P,(sg.k+1)*P):sg.line*P;const d=Math.hypot(cx-o.x,cz-o.z);if(d<bd){bd=d;best=[cx,cz]}}if(best){o.x=best[0];o.z=best[1]}}
// ---------- Sonido (todo sintetizado) ----------
let audio=null;const SND={};
function audioInit(){if(audio)return;try{audio=new(window.AudioContext||window.webkitAudioContext)();
 const mk=type=>{const o=audio.createOscillator(),g=audio.createGain();o.type=type;g.gain.value=0;o.connect(g);g.connect(audio.destination);o.start();return{o,g}};
 SND.eng=mk('sawtooth');SND.sir=mk('square')}catch(_){audio=null}}
function noiseBurst(dur,vol,pow,lp){if(!audio)return;const n=audio.sampleRate*dur|0,b=audio.createBuffer(1,n,audio.sampleRate),d=b.getChannelData(0);
 for(let i=0;i<n;i++)d[i]=(Math.random()*2-1)*(1-i/n)**pow;const s=audio.createBufferSource(),g=audio.createGain();g.gain.value=S.vol*vol;s.buffer=b;
 if(lp){const f=audio.createBiquadFilter();f.type='lowpass';f.frequency.value=lp;s.connect(f);f.connect(g)}else s.connect(g);g.connect(audio.destination);s.start()}
const bang=(v=1)=>noiseBurst(.12,v,2),thud=(v=1)=>noiseBurst(.25,v,2,380),boom=()=>noiseBurst(.9,1.4,1.5,260);
function tone(f,t0,dur,type,vol){if(!audio)return;const o=audio.createOscillator(),g=audio.createGain(),t=audio.currentTime+t0;o.type=type;o.frequency.value=f;
 g.gain.setValueAtTime(S.vol*vol,t);g.gain.exponentialRampToValueAtTime(.0001,t+dur);o.connect(g);g.connect(audio.destination);o.start(t);o.stop(t+dur+.05)}
function jingle(ok){const n=ok?[523,659,784,1047]:[330,262,220];n.forEach((f,i)=>tone(f,i*.13,.35,'triangle',.18))}
function sndUpdate(){if(!audio||!SND.eng)return;const t=audio.currentTime;
 SND.eng.o.frequency.setTargetAtTime(40+(cur?Math.abs(cur.sp):0)*3.4,t,.08);SND.eng.g.gain.setTargetAtTime(cur&&cur.hp>0?S.vol*.035:0,t,.1);
 let nd=1e9;for(const c of cars)if(c.police&&c.hp>0&&!c.stand)nd=Math.min(nd,Math.hypot(c.x-pl.x,c.z-pl.z));
 SND.sir.o.frequency.setTargetAtTime((performance.now()/480|0)%2?900:640,t,.01);SND.sir.g.gain.setTargetAtTime(S.wanted&&nd<110?S.vol*.03*(1-nd/110):0,t,.1)}
function sndMute(){if(!audio||!SND.eng)return;SND.eng.g.gain.value=0;SND.sir.g.gain.value=0}
