'use strict';
// TrujiYork · creador: catchme404
// ================= HISTORIA: Damián Quiñones y La Manada =================
// Cap. 1 (misiones 1-5): el regreso · Cap. 2 (6-15): guerra contra Los Tiburones · Cap. 3 (16-25): el extranjero Robert Mussolini
const VOICE={'Damián':{f:190,c:'#ffcf5a'},'Fiorella':{f:330,c:'#ff8fd0'},'Cristopher':{f:125,c:'#ffb46b'},'Doña Rosa':{f:270,c:'#a8f0c0'},Vijay:{f:160,c:'#9ad0ff'},Joseph:{f:380,c:'#c8ff8a'},
 'Juan José Leyva':{f:105,c:'#7fe0ff'},'Cap. Einer Alva':{f:140,c:'#9aa8ff'},'Robert Mussolini':{f:115,c:'#f2c14e'},'Policía':{f:150,c:'#8aa4ff'},Radio:{f:520,c:'#8fd0ff'}};
const BARKS={
 car:['A ver qué tal anda este fierro.','Con permisito... ¡y sin permiso también!','Agárrense, que manejo como los dioses. O casi.','Este asiento es más cómodo que mi cama.'],
 fast:['¡Esta belleza ahora es mía!','Uy, qué rico suena este motor.'],
 crash:['¡Auch! Eso me va a doler mañana.','Ese seguro no cubre esto...','¡Fue la pared, yo no hice nada!','Mi espalda... mi pobre espalda.'],
 w1:['Ay, ya vienen los tombos...','Mejor me hago el desentendido.'],
 w3:['¡Esto se está saliendo de control!','Tanto tombo junto, ¿hay feria?'],
 w5:['¡Hasta el SWAT viene por mí! Qué honor.','Mamita... esto ya es guerra.'],
 lost:['Chau, tombos. ¡Que les vaya bonito!','Ni se dieron cuenta. Soy un fantasma.'],
 low:['Estoy hecho una sopa... necesito un ceviche.','Me duele hasta el cabello.'],
 head:['¡Qué puntería, causa!','Tiro perfecto, como en los sueños.'],
 idle:['¿Y si me pido un cevichito?','Quieto, quieto... algo va a pasar.','La Manada nunca duerme, pero yo sí quisiera.'],
 ceviche:['Uff, qué rico huele ese ceviche.'],
 drift:['¡Mira cómo derrapo!','¡Esto es más divertido que el cine!'],
 kill:['Eh... eso no estaba en el plan.'],
 busted:['Esto me pasa por andar de bacán.'],
 boom:['¡Sal del auto, que explota!','¡Esto va a explotar!'],
 jump:['¡Hop!','Ágil como lobo en la sierra.'],
 zone:['TrujiYork de noche es otra cosa.','Aquí hay que andar con ojo.']};
const DLG={q:[],cur:null,t:0,cd:3};
const subHTML=l=>{const v=VOICE[l.who]||VOICE['Damián'];return'<b style="color:'+v.c+'">'+l.who+':</b> '+l.text};
function say(who,text){DLG.q.push({who,text,dur:Math.max(2.6,text.length*.058)})}
function bark(key,p){if(DLG.cur||DLG.q.length||DLG.cd>0||(p!==undefined&&Math.random()>p))return;DLG.cd=8;say('Damián',pick(BARKS[key]))}
function talk(who,text){if(!audio)return;const v=VOICE[who]||VOICE['Damián'],n=Math.min(16,text.length/2.2|0);
 for(let i=0;i<n;i++)tone(v.f*rr(.85,1.3),i*.07,.05,'square',.05)}
function dlgUpdate(dt){DLG.cd-=dt;
 if(DLG.cur){DLG.t-=dt;if(DLG.t<=0){DLG.cur=null;$('sub').innerHTML=''}}
 if(!DLG.cur&&DLG.q.length){const l=DLG.q.shift();DLG.cur=l;DLG.t=l.dur;$('sub').innerHTML=subHTML(l);talk(l.who,l.text)}}
// ---------- Estado y utilidades ----------
const M={i:0,s:0,n:0,w:0,q:100,qLabel:'Ceviche',timer:0,t:0,hint:false,next:0,retry:0,failTxt:null,tmShow:false,qOn:false,tcar:null,truck:null,lalo:null,onPick:null,far:0,t2:0,bossPos:null,tip:0,b:0};
const SEEN={};
const near=(p,r)=>Math.hypot((cur||pl).x-p[0],(cur||pl).z-p[1])<r;
const mk=p=>({x:p[0],z:p[1]});
const DEBT=[[55,78],[153,130],[130,211]],DEBT2=[[104,495],[260,505],[416,484],[520,530]];
const BAGS=[[156,52],[468,156],[312,312],[104,520],[572,416]];
const BAGS2=[[208,208],[364,52],[572,260],[416,364],[260,468],[52,312]];
const TGT1={n:'Coche de los Tiburones',c:[.1,.35,.75],w:2,l:4.4,h:.7,ch:.6,m:44,a:22};
const TGT2={n:'Camioneta blindada',c:[.1,.12,.14],w:2.2,l:5,h:1.2,ch:.8,m:46,a:20};
const TGT3={n:'Limusina blindada',c:[.04,.04,.05],w:2.1,l:5.8,h:.9,ch:.7,m:48,a:22};
const TGT4={n:'Auto del contador',c:[.85,.85,.9],w:1.9,l:4.2,h:.6,ch:.5,m:46,a:24};
const CRIS={jk:[.1,.1,.12],pn:[.15,.15,.18],sk:[.8,.6,.45],hr:[.85,.85,.85],suit:[.25,.2,.15],sh:true,kind:'gang'};
const MUSSO={jk:[.14,.12,.16],pn:[.14,.12,.16],sk:[.88,.68,.55],hr:[.55,.55,.58],hat:true,hatc:[.08,.08,.1],suit:[.7,.1,.15],kind:'gang'};
const GUARD={jk:[.08,.08,.1],pn:[.08,.08,.1],sk:[.8,.6,.45],hr:[.06,.05,.05],sh:true,suit:[.7,.1,.15],kind:'gang'};
function freeAround(c,r0,r1,n){const out=[];for(let k=0;k<n;k++)for(let a=0;a<40;a++){const an=rr(0,TAU),r=rr(r0,r1),x=clamp(c[0]+Math.cos(an)*r,2,CITY-2),z=clamp(c[1]+Math.sin(an)*r,2,CITY-2);if(hAt(x,z)===0&&landAt(x,z)){out.push([x,z]);break}}return out}
function spawnGang(list,o){for(const p of list)gang.push(mkGang(p[0],p[1],o))}
function spawnDebtors(list){npcs=npcs.filter(n=>n.tag!=='debt');
 list.forEach(p=>{const n=mkNpc();n.x=p[0];n.z=p[1];n.tag='debt';n.hp=40;n.look.jk=[.55,.1,.7];n.look.hat=true;n.look.sh=false;npcs.push(n)})}
function spawnTarget(ty,hp){const dir=Math.random()<.5?1:-1,line=vLineNear(pl.x+(pl.x<CITY/2?130:-130),pl.z),
 c=mkCar(ty,0,0,0,{axis:'z',dir,line,last:-1,keep:true,fast:true});placeAI(c,clamp(pl.z,20,CITY-20));c.hp=c.mhp=hp;cars.push(c);return c}
function dropCar(c){if(c&&cur===c){cur=null;pl.x+=3;pl.y=0}if(c)cars=cars.filter(k=>k!==c)}
function cleanup(){gang=[];pickups=[];dropCar(M.tcar);M.tcar=null;dropCar(M.truck);M.truck=null;M.lalo=null;M.tmShow=false;M.qOn=false;M.onPick=null}
// ---------- Pasos reutilizables ----------
const pos=p=>typeof p==='function'?p():p,txtOf=t=>typeof t==='function'?t():t;
function go(p,r,txt,o){o=o||{};return{obj:()=>txtOf(txt),marks:()=>[mk(pos(p))],enter:o.enter,done:o.done,
 upd(){if(near(pos(p),r)&&(!o.stop||!cur||Math.abs(cur.sp)<8))return 1}}}
function fight(txt,waves,c,r0,r1,gopts,intro){const tot=waves.reduce((a,b)=>a+b,0),sp=k=>spawnGang(freeAround(c,r0,r1,k),gopts);
 return{obj:()=>txt+' ('+M.n+'/'+tot+')',
  marks:()=>{const l=gang.filter(g=>g.st!=='down').sort((a,b)=>Math.hypot(a.x-pl.x,a.z-pl.z)-Math.hypot(b.x-pl.x,b.z-pl.z)).slice(0,3).map(g=>mk([g.x,g.z]));return l.length?l:[mk(c)]},
  enter(){M.n=0;M.w=1;sp(waves[0]);intro&&intro()},
  upd(){if(gang.every(g=>g.st==='down')){if(M.w<waves.length){sp(waves[M.w]);M.w++;msg('¡Llegan más!')}else return 1}}}}
function chase(txt,txt2,ty,hp,intro){return{obj:()=>cur?txt:txt2,marks:()=>M.tcar?[mk([M.tcar.x,M.tcar.z])]:[],
 enter(){M.tcar=spawnTarget(ty,hp);M.far=0;M.t2=0;intro&&intro()},
 upd(dt){const c=M.tcar;if(!c)return;
  if(c.hp<=0||c.boom){M.t2+=dt;if(c.boom||M.t2>1.5){M.bossPos=[c.x,c.z];return 1}}
  const d=Math.hypot(c.x-(cur||pl).x,c.z-(cur||pl).z);if(d>260){M.far+=dt;if(M.far>8){M.failTxt='Se les escapó el coche';return -1}}else M.far=0}}}
function bossStep(txt,look,hp,sc,dmg,intro){return{obj:()=>txt,marks:()=>gang.filter(g=>g.st!=='down').map(g=>mk([g.x,g.z])),
 enter(){spawnGang([M.bossPos||LOC.puerto.c],{look,hp,sc,dmg,acc:.6,boss:true});intro&&intro()},
 upd(){if(gang.length&&gang.every(g=>g.st==='down'))return 1}}}
function grab(txt,list,secs,onPick){return{obj:()=>txt+' ('+M.n+'/'+list.length+')',marks:()=>pickups.filter(p=>!p.got).map(p=>mk([p.x,p.z])),
 enter(){M.n=0;M.timer=secs;M.tmShow=true;M.onPick=onPick;pickups=list.map(p=>({x:p[0],z:p[1],got:false}))},
 upd(dt){M.timer-=dt;if(M.timer<=0){M.failTxt='Se acabó el tiempo';return -1}if(M.n>=list.length){M.tmShow=false;return 1}}}}
function esc(level,txt,hint){return{obj:()=>S.wanted?txt+' ('+'★'.repeat(S.wanted)+')':'Casi libre...',marks:()=>[],
 enter(){M.hint=false;if(level)setWanted(level)},
 upd(dt){M.t+=dt;if(hint&&!M.hint&&M.t>14){M.hint=true;say(hint[0],hint[1])}if(S.wanted===0&&M.t>(level?3:0))return 1}}}
// robar un camión y entregarlo sin dañar la carga
function truckSteps(from,to,toTxt,secs){return[
 {obj:()=>'Roba el camión de carga',marks:()=>[mk([M.truck.x,M.truck.z])],
  enter(){const c=from,t=mkCar(2,c[0]-16,c[1]+16,0,null);t.t=Object.assign({},TYPES[2],{n:'Camión de carga'});t.hp=t.mhp=160;M.truck=t;cars.push(t)},
  upd(){if(cur===M.truck)return 1}},
 {obj:()=>cur===M.truck?toTxt:'Vuelve al camión',marks:()=>cur===M.truck?[mk(to)]:[mk([M.truck.x,M.truck.z])],
  enter(){M.timer=secs;M.q=100;M.qOn=true;M.qLabel='Carga';M.tmShow=true},
  upd(dt){if(M.truck.hp<=0){M.failTxt='El camión quedó destruido';return -1}M.timer-=dt;if(M.timer<=0){M.failTxt='Se acabó el tiempo';return -1}
   if(M.q<=0){M.failTxt='La carga quedó dañada';return -1}if(cur===M.truck&&near(to,9)&&Math.abs(cur.sp)<8)return 1}}]}
// sobornar al capitán por el celular: si es poco, te manda a la policía
function askBribe(){M.b=0;Phone.ask('Cap. Einer Alva',['Ofrecer $500','Ofrecer $1500','Ofrecer $3000'],null,i=>{const amt=[500,1500,3000][i],need=700+Math.random()*2100;
  if(amt>=need){S.cash-=amt;M.b=1;say('Cap. Einer Alva','Hecho. Mussolini tendrá paso libre en TrujiYork.')}
  else{say('Cap. Einer Alva','¿Con esa miseria? ¡Arréstenlo!');M.b=2;setWanted(3)}})}
const bribeStep=()=>({obj:()=>M.b===2?'Escapa de la policía ('+'★'.repeat(S.wanted)+')':'Soborna al Capitán Alva (responde en el celular: T)',marks:()=>M.b===2?[]:[mk(LOC.comisaria.m)],
 enter(){askBribe()},upd(){if(M.b===1)return 1;if(M.b===2&&S.wanted===0){askBribe()}}});
function Mission(id,t,rw,o){const enter=()=>{M.t=0;M.tmShow=false;const st=o.steps[M.s];st.enter&&st.enter()};
 return{t,rw,onFail:o.onFail,win:o.win,
  init(){cleanup();M.s=0;M.n=0;M.w=0;M.t=0;M.failTxt=null;if(o.time!==undefined)S.time=o.time;if(!SEEN[id]){SEEN[id]=1;o.start&&o.start()}else say('Damián','Otra vez... ahora sí sale bien.');enter()},
  obj(){return o.steps[M.s].obj()},marks(){return o.steps[M.s].marks()},
  upd(dt){const f=o.fail&&o.fail();if(f){M.failTxt=f;return -1}
   const st=o.steps[M.s],r=st.upd(dt);
   if(r===1){st.done&&st.done();M.s++;if(M.s>=o.steps.length)return 1;enter()}else if(r<0)return r}}}
const P_=Phone;
// ---------- Las 25 misiones ----------
const MIS=[
 // ===== CAPÍTULO 1: LA MANADA =====
 Mission('m1','Primer día',150,{
  start(){say('Damián','Dos años fuera y TrujiYork sigue igual de loca. La Manada me necesita... y yo necesito la plata.');
   P_.msg('Fiorella','Damián!! Ya llegó el hijo pródigo. Pásate por el Club Neón, Cristopher quiere verte.',3.5);
   P_.ask('Fiorella',['Voy volando, Fio.','¿Cristopher está de buen humor?','No te emociones, ya voy.'],[['Así me gusta, puntual.'],['Nunca. Pero hoy anda con ganas de hablar de negocios.'],['Jaja, siempre tan serio. Te espero con un trago.']]);
   P_.msg('Alex Ross','¡HERMANO! ¿Es verdad que volviste? Estoy cerca de tu casa, ven a saludar a tu mejor amigo.',14)},
  steps:[go(LOC.club.m,9,'Ve al Club Neón (Centro Histórico)')],
  win(){say('Fiorella','¡Llegaste! Afuera hay un superdeportivo cian. Es del sobrino de Juan José Leyva, el jefe de Los Tiburones.');
   say('Damián','Los Tiburones... la banda que quiere comerse a La Manada. Ya me cae gordo ese carro.');
   P_.msg('Cristopher','Bienvenido, Damián. Quiero ese carro en el garaje de La Manada. Hazlo bien y sin que te pillen.',4)}}),
 Mission('m2','Auto de lujo',300,{
  start(){P_.msg('Fiorella','Ahí está el cian. Apenas lo muevas, el sobrino llamará a los tombos. Llévalo a la cevichería El Lobo.',2)},
  steps:[{obj:()=>'Roba el superdeportivo cian',marks:()=>[mk([fastCar.x,fastCar.z])],
    upd(){if(cur===fastCar){addHeat(1);say('Damián','¡Qué bestia de carro! Perdón, sobrino de Leyva...');say('Fiorella','¡Ya salieron los tombos! Piérdelos antes de llegar donde Cristopher.');return 1}}},
   {obj:()=>cur===fastCar?(S.wanted?'Pierde a la policía y llega a la cevichería':'Llévalo a la Cevichería El Lobo'):'Vuelve al superdeportivo',
    marks:()=>cur===fastCar?[mk(LOC.ceviche.m)]:[mk([fastCar.x,fastCar.z])],
    upd(){if(cur===fastCar&&near(LOC.ceviche.m,8)&&Math.abs(cur.sp)<8&&!S.wanted)return 1}}],
  fail:()=>fastCar.hp<=0?'El superdeportivo quedó destruido':null,onFail:()=>spawnFast(),
  win(){say('Cristopher','¡Pero qué bestia! Ese pituco va a llorar. Eres de La Manada de verdad, Damián.');
   P_.msg('Cristopher','Tengo otro trabajito: unos morosos me deben plata y andan corriendo por la ciudad.',5);
   P_.ask('Cristopher',['Con gusto, jefe.','¿Y si se resisten?','¿Cuánto me toca?'],[['Así se habla.'],['Les recuerdas quién manda. Con los puños, sin balas: la policía es un fastidio.'],['Tu parte te la doy al terminar. No seas ambicioso.']])}}),
 Mission('m3','Cobranza',400,{
  start(){say('Cristopher','Tres morosos andan corriendo por la ciudad. Noquéalos, pero sin balas si puedes.')},
  steps:[{obj:()=>'Noquea a los morosos ('+M.n+'/3)',marks:()=>npcs.filter(n=>n.tag==='debt'&&n.st!=='down').map(n=>mk([n.x,n.z])),
    enter(){M.n=0;spawnDebtors(DEBT)},upd(){if(M.n>=3)return 1}}],
  win(){say('Cristopher','Bacán. Ahora a lo importante: tengo un pedido para Doña Rosa.')}}),
 Mission('m4','Ceviche express',450,{
  start(){P_.msg('Cristopher','Recoge el pedido en la cevichería y llévalo a casa de Doña Rosa (California). Dentro del ceviche va la mercadería: si se aplasta, se arruina.',2)},
  steps:[go(LOC.ceviche.m,6,'Recoge el pedido en la cevichería',{done:()=>say('Cristopher','¡Ahí va! Tienes 80 segundos. ¡Cuida ese pescado!')}),
   {obj:()=>'Entrega el ceviche a Doña Rosa',marks:()=>[mk(LOC.casa.m)],enter(){M.timer=80;M.q=100;M.qOn=true;M.qLabel='Ceviche';M.tmShow=true},
    upd(dt){M.timer-=dt;if(M.timer<=0){M.failTxt='¡Se enfrió el ceviche!';return -1}if(M.q<=0){M.failTxt='¡El ceviche quedó hecho puré!';return -1}
     if(near(LOC.casa.m,7)){M.tip=Math.round(M.q*2);return 1}}}],
  win(){S.cash+=M.tip;say('Doña Rosa','¡Qué rico se ve! Toma, mijo, una propina de $'+M.tip+'.');P_.msg('Doña Rosa','Cuídate mucho, Damián. Los Tiburones no perdonan.',4)}}),
 Mission('m5','Se armó la grande',800,{
  start(){say('Fiorella','¡Damián! Alguien chismeó y el capitán Einer Alva te busca por toda la ciudad. ¡Pierde a la policía!');
   P_.msg('Fiorella','El Cap. Alva está comprado por los Tiburones. ¡Corre!',1)},
  steps:[esc(3,'Escapa de la policía',['Fiorella','Rómpeles la vista entre cuadras, escóndete... o pasa por Pintura Express para repintar el auto. O intenta sobornarlos (B).'])],
  win(){say('Damián','Chau, tombos. Una ciudad menos por conquistar.');say('Cristopher','Eres de los míos. Fin de la primera parte, muchacho. Pero la guerra recién empieza.');
   P_.msg('Cristopher','Descansa. Mañana los Tiburones vendrán con todo.',3)}}),
 // ===== CAPÍTULO 2: LA GUERRA DE LOS TIBURONES =====
 Mission('m6','Mensajes sin leer',500,{
  start(){P_.msg('Desconocido','Sabemos que volviste, lobito. Tienes 24 horas para largarte de TrujiYork.',4);
   P_.ask('Desconocido',['¿Quién eres?','Ven a buscarme, tiburón.','*Bloquear número*'],[['Alguien que no quiere verte por aquí. Tic, tac.'],['Con gusto. Llevaré a mis amigos... y mis cuchillos.'],['Bloqueado... aunque ya leíste el mensaje.']]);
   P_.msg('Vijay','Pata, soy Vijay Huanaco. Ven al taller (Pintura Express). Tengo info de esos tiburones. Ojo que te siguen.',6)},
  steps:[go(LOC.paint.m,9,'Ve a Pintura Express a ver a Vijay',{done:()=>{say('Vijay','Pata, los Tiburones mueven armas por el Almacén del Puerto, en Florencia de Mora, y tienen su guarida en la Discoteca Marea, en El Porvenir.');say('Damián','Entonces ahí les caemos. Gracias, Vijay.')}})],
  win(){P_.msg('Cristopher','Vijay me contó. Pásate por el club: tengo mercadería que mover, y sin llamar la atención.',4)}}),
 Mission('m7','Sin llamar la atención',600,{
  start(){say('Cristopher','Recoge la mercadería en el club y llévala a mi mansión en El Golf. Sin estrellas, Damián: el capitán Alva nos vigila.')},
  steps:[esc(0,'Pierde a la policía primero'),
   go(LOC.club.m,9,'Recoge la mercadería en el Club Neón',{done:()=>say('Fiorella','Aquí va la maleta. No te enganches con nadie.')}),
   go(LOC.mansion.m,9,'Lleva la mercadería a la Mansión (¡sin estrellas!)',{stop:1})],
  fail:()=>M.s>=1&&S.wanted>0?'Te vieron los tombos':null,
  win(){say('Cristopher','Limpio y rápido. Así trabaja La Manada.')}}),
 Mission('m8','Fuego cruzado',700,{
  start(){say('Cristopher','¡Los Tiburones atacan la cevichería! ¡Ve ya!');P_.msg('Joseph','Causa!! Tiburones con fierros frente a la cevichería!! Doña Rosa está adentro!',1)},
  steps:[go(LOC.ceviche.m,45,'Ve a la cevichería (¡la atacan!)'),
   fight('Defiende la cevichería',[3,3],LOC.ceviche.c,24,36,null,()=>say('Doña Rosa','¡Ay, Dios mío, balazos! ¡Sálvame, mijo!'))],
  win(){say('Doña Rosa','Gracias, mijo. Te preparo un ceviche especial.');P_.msg('Joseph','Pata, vi el carro de los Tiburones cargando maletas por la avenida. Síguelo!',5)}}),
 Mission('m9','Persecución en la avenida',800,{
  start(){say('Joseph','¡Ese carro azul, Damián! ¡Lleva la plata de los Tiburones!')},
  steps:[chase('Destruye el coche de los Tiburones','Roba un coche (E) y persigue a los Tiburones',TGT1,130)],
  win(){say('Damián','Ese carro ya no corre más.');P_.msg('Joseph','...pata me cachar... me llevar... Marea... AYUDA',3);
   P_.msg('Desconocido','Tu amiguito está con nosotros. Ven solo, lobito.',6)}}),
 Mission('m10','Rescata a Joseph',900,{
  start(){say('Damián','Joseph es un chiquillo. No lo voy a dejar solo.')},
  steps:[go(LOC.marea.m,45,'Ve a la Discoteca Marea (El Porvenir)'),
   fight('Elimina a los guardias de los Tiburones',[3,2],LOC.marea.c,12,22,null,()=>{M.lalo={x:LOC.marea.c[0],z:LOC.marea.c[1]+10}}),
   go(()=>[LOC.marea.c[0],LOC.marea.c[1]+10],4,'Libera a Joseph',{done:()=>{M.lalo=null;say('Joseph','¡Gracias, Damián! ¡Pensé que me hacían ceviche!');say('Radio','Alarma en la Discoteca Marea. Todas las unidades.')}}),
   esc(2,'Huye con Joseph',['Vijay','Pata, pasa por Pintura Express y te repinto el carro. O soborna a los tombos con B.'])],
  win(){P_.msg('Joseph','Gracias por salvarme, pata. Ahora sí conozco a La Manada de verdad.',3)}}),
 Mission('m11','Dinero sucio',1000,{
  start(){P_.msg('Cristopher','Hay cinco bolsos con plata escondidos por la ciudad. Los Tiburones los buscan. Tráelos a mi mansión en 190 segundos.',2)},
  steps:[grab('Recoge los bolsos de dinero',BAGS,190,()=>{if(M.n===3){setWanted(2);say('Radio','Reportan un sospechoso con bolsos de dinero.')}}),
   go(LOC.mansion.m,9,'Lleva el dinero a la Mansión',{stop:1})],
  win(){S.cash+=300;say('Cristopher','Hasta el último sol. Aquí tienes tu parte, Damián.')}}),
 Mission('m12','Traición',1100,{
  start(){P_.msg('Fiorella','Damián... perdóname. Fui yo quien le habló al capitán Alva. Me amenazaron por mi hermana. Estoy en el mirador, ven y te cuento todo.',2);
   P_.ask('Fiorella',['¿Qué hiciste, Fiorella?','Voy para allá. Más te vale explicar.','*No contestar*'],[['Me obligaron... ven, por favor.'],['Lo haré. No me dejes ahí tirada, Damián.'],['Damián... por favor, contesta.']])},
  steps:[go(LOC.mirador.m,10,'Ve al Mirador (San Andrés)',{done:()=>{say('Fiorella','¡Es una trampa, huye, Damián! ¡El capitán Alva viene con sus hombres!');say('Cap. Einer Alva','Mátenlo, que no quede testigo.')}}),
   fight('Elimina a los escoltas del Cap. Alva',[3,2],LOC.mirador.c,10,20,{look:CORR,hp:60}),
   esc(3,'Escapa de la policía del Cap. Alva',['Damián','Rápido, antes de que lleguen más.'])],
  win(){P_.msg('Fiorella','Estoy bien. Me voy de la ciudad. Cuídate, Damián. Lo siento mucho.',3)}}),
 Mission('m13','Asalto al puerto',1500,{
  start(){P_.msg('Vijay','Pata, ya tengo el plan. Entras al Almacén del Puerto (Florencia de Mora), revientas a los tiburones y volamos el contenedor de armas.',2);
   P_.msg('Cristopher','Que no quede ni uno. Es por La Manada.',3)},
  steps:[go(LOC.puerto.m,40,'Ve al Almacén del Puerto'),
   fight('Elimina a los Tiburones del almacén',[4,4],LOC.puerto.c,6,24),
   go(LOC.puerto.in,5,'Planta la carga en el contenedor de armas',{done:()=>{const c=mkCar(1,LOC.puerto.in[0],LOC.puerto.in[1]+2,0,null);c.hp=0;cars.push(c);say('Damián','Bum. Eso es por la plata de Cristopher.')}}),
   esc(3,'Huye del puerto',['Vijay','¡Pata, escápate! Llegan todas las patrullas.'])],
  win(){say('Vijay','¡Pura candela, pata! Los Tiburones ya no tienen armas.')}}),
 Mission('m14','Cabeza de tiburón',1800,{
  start(){P_.msg('Juan José Leyva','Quemaste mi almacén, lobito. Esto se arregla en la avenida.',2);P_.msg('Joseph','Pata, ¡Leyva se escapa en una camioneta blindada!',4)},
  steps:[chase('Destruye la camioneta blindada de Leyva','Roba un coche (E) y persigue a Juan José Leyva',TGT2,260),
   bossStep('Elimina a Juan José Leyva',BOSS,180,1.15,8,()=>say('Juan José Leyva','¡Te voy a enterrar, lobito!'))],
  win(){say('Damián','Se acabó, Leyva.');P_.msg('Cristopher','Ven a mi mansión, hijo. Tengo algo para ti.',4)}}),
 Mission('m15','Rey de la ciudad',3000,{
  start(){say('Cristopher','Ven a la mansión, Damián. Es hora de hablar del futuro de La Manada.')},
  steps:[go(LOC.mansion.m,12,'Ve a la Mansión de Cristopher (El Golf)'),
   fight('Defiende la mansión de los últimos enemigos',[3,3,2],LOC.mansion.c,24,36,{look:CORR,hp:60},()=>say('Cap. Einer Alva','Los últimos de La Manada... ¡acábenlos!')),
   go(LOC.mansion.m,6,'Habla con Cristopher',{done:()=>{
     say('Cristopher','Mis hijos... esta ciudad necesita sangre joven. Desde hoy eres mi mano derecha, Damián.');
     say('Damián','No te voy a fallar, Cristopher. La Manada será leyenda.');say('Doña Rosa','¡Y yo hago el ceviche de la celebración!')}})],
  win(){Hud.banner('FIN DEL CAPÍTULO 2','Damián Quiñones, mano derecha de La Manada','#e0a526');P_.msg('Joseph','Jefe, ¿y ahora qué hacemos? Jaja.',3);
   P_.msg('Robert Mussolini','Mister Quiñones. Soy Robert Mussolini. Dicen que usted limpió esta ciudad. Hablemos de negocios en el Hotel Imperial.',9)}}),
 // ===== CAPÍTULO 3: EL EXTRANJERO =====
 Mission('m16','Un extranjero en TrujiYork',1200,{
  start(){P_.msg('Cristopher','Hay un italiano en el Hotel Imperial, Robert Mussolini. Trae armas y plata. No me gusta, pero escúchalo.',2);
   P_.ask('Cristopher',['Voy con cuidado.','¿Y si quiere comprarnos?','No confío en extranjeros.'],[['Eso, hijo. Ojos abiertos.'],['Entonces le recuerdas que La Manada no se vende.'],['Yo tampoco. Pero escucha primero.']])},
  steps:[go(LOC.hotel.m,10,'Ve al Hotel Imperial (El Golf)',{done:()=>{
    say('Robert Mussolini','Leyva cayó y TrujiYork quedó huérfana. Yo traigo la mercadería, ustedes ponen las calles. Capisce?');
    say('Damián','Primero demuéstrame que no eres otro tiburón con acento.');say('Robert Mussolini','Pruébeme su lealtad cobrando en Florencia de Mora. Después hablamos.')}})],
  win(){P_.msg('Robert Mussolini','Cuatro deudores en Florencia de Mora. No falle, Mister Quiñones.',3)}}),
 Mission('m17','Cobranza en Florencia',1300,{
  start(){say('Damián','Florencia de Mora... precaución elevada en sectores. Ojo con los costados.')},
  steps:[go([260,500],60,'Ve a Florencia de Mora'),
   {obj:()=>'Noquea a los morosos de Mussolini ('+M.n+'/4)',marks:()=>npcs.filter(n=>n.tag==='debt'&&n.st!=='down').map(n=>mk([n.x,n.z])),enter(){M.n=0;spawnDebtors(DEBT2)},upd(){if(M.n>=4)return 1}},
   fight('Repele a los cobradores de Leyva',[3],[260,500],12,26,null,()=>say('Joseph','¡Damián, cuidado, los tiburones que quedaron!'))],
  win(){say('Robert Mussolini','Impresionante. Esta noche en el Club Neón: gala privada.')}}),
 Mission('m18','Noche de gala',1400,{time:21,
  start(){P_.msg('Fiorella','Mussolini hizo una reunión en el club esta noche. Entra y habla con él en la zona VIP. Ven elegante... bueno, vas igual.',2);P_.msg('Fiorella','Dato: en la discoteca hay gente de negocios y chicas bailando. Pregunta a quien quieras (E).',5)},
  steps:[go(LOC.club.m,12,'Ve al Club Neón (Centro Histórico)'),
   go(LOC.club.vip,3.5,'Reúnete con Mussolini en la zona VIP',{done:()=>{say('Robert Mussolini','Quiero el puerto, Mister Quiñones. Pero hay un traidor entre mis socios... el Capitán Alva me vendió.');say('Cap. Einer Alva','¡Mussolini no sale vivo de aquí!')}}),
   fight('Repele la emboscada en el club',[3,3],LOC.club.c,3,6,{look:CORR,hp:60}),
   go(LOC.club.m,12,'Sal del club')],
  win(){say('Robert Mussolini','Grazie, amico. Mañana le doy una carga delicada.')}}),
 Mission('m19','Carga delicada',1500,{
  start(){P_.msg('Robert Mussolini','Un camión de carga en el puerto. Llévelo al Hotel Imperial sin un rasguño: la mercadería es frágil.',2)},
  steps:[go(LOC.puerto.m,14,'Ve al Almacén del Puerto (Florencia de Mora)'),...truckSteps(LOC.puerto.c,LOC.hotel.m,'Lleva la carga al Hotel Imperial',170)],
  win(){say('Robert Mussolini','Perfecto. Usted es un profesional, Mister Quiñones.')}}),
 Mission('m20','La coima',1600,{
  start(){S.cash+=3000;P_.msg('Robert Mussolini','Le dejo un maletín con $3000. Soborne al Capitán Alva en la Comisaría. Si ofrece poco, se enfadará.',2)},
  steps:[go(LOC.comisaria.m,10,'Ve a la Comisaría (Centro Histórico)'),bribeStep()],
  win(){say('Damián','Lo compré. La coima funciona... si pagas lo suficiente.')}}),
 Mission('m21','Persecución nocturna',1700,{time:23,
  start(){P_.msg('Joseph','Pata, el contador de Mussolini huye con la plata, ¡es un traidor! Auto blanco por las avenidas.',2)},
  steps:[chase('Destruye el auto del contador','Roba un coche (E) y persigue al contador',TGT4,160)],
  win(){say('Robert Mussolini','El dinero se perdió, pero la traición quedó pagada.')}}),
 Mission('m22','Fuego en El Porvenir',1800,{
  start(){P_.msg('Doña Rosa','Mijo, atacaron el mercado de mi primo en El Porvenir. Son los sicarios de un tal Mussolini... ¡ayúdalo!',2)},
  steps:[go(LOC.mercado.m,45,'Ve al Mercado de El Porvenir'),fight('Defiende el mercado',[4,4,2],LOC.mercado.c,10,26,{look:GUARD,hp:60})],
  win(){say('Doña Rosa','Gracias a Dios. Ese italiano no es de fiar...');P_.msg('Cristopher','Damián, Mussolini nos está traicionando. Hay que cortarle el paso.',4)}}),
 Mission('m23','Paquetes de la discordia',1900,{time:22,
  start(){P_.msg('Cristopher','Hay seis paquetes de Mussolini escondidos por TrujiYork. Róbalos todos en 230 segundos: sin ellos no tiene cómo pagar a sus hombres.',2)},
  steps:[grab('Roba los paquetes de Mussolini',BAGS2,230,()=>{if(M.n===3){setWanted(2);say('Radio','Se reportan robos de mercadería en varias zonas.')}}),
   go(LOC.mansion.m,9,'Lleva los paquetes a la Mansión',{stop:1})],
  win(){S.cash+=500;say('Cristopher','Bien hecho. Ahora vamos por él.')}}),
 Mission('m24','Asalto al Hotel Imperial',2200,{time:0,
  start(){P_.msg('Cristopher','Hotel Imperial. Todos sus guardias. Hoy termina la mafia italiana en TrujiYork.',2);say('Damián','Es hora de limpiar El Golf.')},
  steps:[go(LOC.hotel.m,45,'Ve al Hotel Imperial (El Golf)'),
   fight('Elimina a los guardias de Mussolini',[4,4,3],LOC.hotel.c,14,30,{look:GUARD,hp:60},()=>say('Robert Mussolini','¡Mátenlo! ¡Es solo un ragazzo!')),
   esc(3,'Escapa de la policía de El Golf',['Joseph','Pata, en El Golf la policía llega rapidísimo. Rómpeles la vista o soborna (B).'])],
  win(){say('Joseph','¡Lo logramos! Mussolini escapa en su limusina.')}}),
 Mission('m25','Cabeza de la mafia',4000,{time:2,
  start(){P_.msg('Robert Mussolini','Mister Quiñones... usted ganó una batalla, no la guerra. Venga a la avenida si tiene valor.',2)},
  steps:[chase('Destruye la limusina blindada de Mussolini','Roba un coche (E) y persigue la limusina',TGT3,300),
   bossStep('Elimina a Robert Mussolini',MUSSO,260,1.2,9,()=>say('Robert Mussolini','¡Nadie le dice no a Mussolini!'))],
  win(){say('Damián','Se acabó. Un italiano menos en TrujiYork.');say('Cristopher','Hijo... desde hoy eres el Alfa de La Manada. TrujiYork es tuya.');
   Hud.banner('FIN DEL CAPÍTULO 3','Damián Quiñones, Alfa de La Manada','#e0a526');P_.msg('Joseph','Alfa, ¿a dónde vamos ahora? Jaja.',4)}}),
 // ===== CAPÍTULO 4: EL CIERRE DE DAMIÁN QUIÑONES =====
 Mission('m26','Los papeles de Cristopher',2000,{
  start(){P_.msg('Fiorella','Damián, soy yo, desde un número nuevo. Cristopher no es quien crees. Tiene un despacho en su mansión con contratos firmados con el capitán Alva.',3);
   P_.ask('Fiorella',['¿Cómo sabes eso?','Voy ya. Y más te vale que sea verdad.','No te creo, Fio.'],[['Porque yo también firmé uno... y por eso me fui.'],['Entonces ten cuidado. Te espero en el Mirador después.'],['Lo entiendo. Pero mira con tus propios ojos.']])},
  steps:[go(LOC.mansion.m,9,'Revisa el despacho de Cristopher (Mansión, El Golf)',{done:()=>{say('Damián','Contratos con el Cap. Alva, fechados hace años. Cristopher vendió a La Manada.');say('Fiorella','Y Alex Ross cobró por dejarte afuera... no confíes en nadie todavía.')}}),
   go(LOC.vikkingos.m,12,'Ve al restaurante Vikkingos y confróntalo',{done:()=>{say('Cristopher','Hijo, qué sorpresa. Siéntate, que hay que hablar de la familia.')}})],
  win(){P_.msg('Cristopher','Pásate por el Mansiche esta noche. Ahí se decide todo.',3)}}),
 Mission('m27','Cena de traición',2500,{
  start(){P_.msg('Cristopher','Damián, reservé en Vikkingos. Hay que celebrar tu ascenso. Ven solo, como familia.',3)},
  steps:[go(LOC.vikkingos.m,12,'Cena con Cristopher en Vikkingos',{done:()=>{say('Cristopher','Sabías demasiado, hijo. Alva me pagó más que La Manada. Lo siento.');say('Cap. Einer Alva','Ya están rodeados, Mister Quiñones.')}}),
   fight('Sobrevive a la emboscada en Vikkingos',[3,3,2],LOC.vikkingos.c,10,22,{look:CORR,hp:60})],
  win(){say('Cristopher','¡Nos vemos en el Mansiche, hijo! Si tienes huevos.');P_.msg('Fiorella','Damián, ese estadio es la guarida de Cristopher. Ve con todo.',4)}}),
 Mission('m28','Puertas del Mansiche',3000,{
  start(){P_.msg('Fiorella','Cristopher vende armas en el Estadio Mansiche (Florencia de Mora). Hay subasta esta noche y guardias en cada tribuna.',3)},
  steps:[go(LOC.mansiche.m,30,'Entra al Estadio Mansiche (Florencia de Mora)'),
   fight('Abre paso por las tribunas',[4,4,3],LOC.mansiche.c,30,55,{look:GUARD,hp:60},()=>say('Cap. Einer Alva','¡Ni uno pasa de la tribuna!')),
   esc(3,'Escapa de la policía del estadio',['Fiorella','Sal por el lado norte, rápido.'])],
  win(){M.bossPos=[LOC.mansiche.c[0],LOC.mansiche.c[1]];say('Joseph','¡Pata, Cristopher está en el centro de la cancha, te está esperando!')}}),
 Mission('m29','La cancha de la traición',4000,{
  start(){say('Cristopher','Llegaste, Damián. Te di la mejor cancha de TrujiYork para morir.')},
  steps:[go(LOC.mansiche.c,20,'Llega a la cancha, al centro del estadio'),
   bossStep('Enfrenta a Cristopher en la cancha',CRIS,320,1.25,10,()=>say('Cristopher','Eras mi mejor pieza, Damián. Qué lástima.'))],
  win(){say('Damián','Se acabó, Cristopher. La Manada ya no le pertenece a nadie.');P_.msg('Alex Ross','Hermano, ¿estás bien? Vente al Mirador, los chicos te esperan.',3)}}),
 Mission('m30','El cierre',5000,{
  start(){P_.msg('Fiorella','Damián... vente al Mirador. Todos te esperan: Joseph, Vijay, Alex... y Taveo, que ya quiere contarte su última conquista.',3)},
  steps:[go(LOC.mirador.m,12,'Reúnete con tus amigos en el Mirador',{done:()=>{
    say('Fiorella','Damián... perdón por todo. Me voy de TrujiYork para empezar de nuevo.');
    say('Joseph','Pata, ¿y ahora quién manda?');
    say('Alex Ross','Tú, hermano. Pero manda con cabeza, como cuando éramos chibolos.');
    say('Vijay','La ciudad se va a limpiar sola si la gente se pone las pilas, pata.');
    say('Taveo','Broer, ayer me hice a 3 en un tono... y ninguna me preguntó por el novio. ¡Jaja!');
    say('Damián','Esta ciudad no tiene dueño. Tiene gente, y eso es mejor. Gracias a todos.')}})],
  win(){Hud.banner('FIN DE LA HISTORIA','Damián Quiñones: de vuelta a TrujiYork','#e0a526');P_.msg('Doña Rosa','Mijo, te guardé el mejor ceviche. Ven cuando quieras.',4)}})];
const CHAPTERS={0:['Capítulo 1','La Manada'],5:['Capítulo 2','La guerra de los Tiburones'],15:['Capítulo 3','El extranjero'],25:['Capítulo 4','El cierre de Damián Quiñones']};
function begin(i){const c=CHAPTERS[i];if(c)Hud.chapter(c[0],c[1]);const m=MIS[i];
 if(m)m.init();else say('Damián','Modo libre: TrujiYork es mía.')}
function saveProg(){try{localStorage.setItem('manada_m',M.i)}catch(_){}}
const Story={
 reset(){for(const k in SEEN)delete SEEN[k];Story.jump(0)},
 jump(i){DLG.q.length=0;DLG.cur=null;DLG.cd=3;$('sub').innerHTML='';cleanup();
  Object.assign(M,{i,s:0,n:0,w:0,q:100,timer:0,t:0,hint:false,next:0,retry:0,failTxt:null});begin(i)},
 retry(){if(MIS[M.i]){DLG.q.length=0;M.retry=1.5}},
 say,crash(im){if(M.qOn)M.q-=clamp(im*.9,5,30)},
 debtDown(){if(M.i===2||M.i===16){M.n++;msg('Moroso noqueado ('+M.n+'/'+(M.i===2?3:4)+')')}},
 gangDown(){M.n++},
 pick(){M.n++;msg('Bolso recogido ('+M.n+')');if(M.onPick)M.onPick()},
 fail(why){Hud.banner('MISIÓN FALLIDA',why,'#d33');jingle(false);say('Damián','Se complicó... a intentarlo de nuevo.');M.retry=2.5},
 update(dt){const m=MIS[M.i];
  if(M.retry>0){M.retry-=dt;if(M.retry<=0&&m)m.init();S.marks=[];return}
  if(M.next>0){if(!DLG.cur&&!DLG.q.length){M.next-=dt;if(M.next<=0){M.i++;saveProg();begin(M.i)}}S.marks=[];return}
  if(!m){S.marks=[];return}
  const r=m.upd(dt);
  if(r===1){S.cash+=m.rw;Hud.banner('MISIÓN COMPLETADA',m.t,'#e0a526','+$'+m.rw);jingle(true);m.win&&m.win();cleanup();M.next=2.5;S.marks=[];return}
  if(r<0){Story.fail(M.failTxt||'Misión fallida');m.onFail&&m.onFail();cleanup();S.marks=[];return}
  S.marks=m.marks()},
 objective(){const m=MIS[M.i];if(M.retry>0)return'Reintentando...';if(M.next>0)return'...';return m?m.obj():'Modo libre: explora TrujiYork'},
 info(){return M.tmShow?'⏱ '+Math.max(0,M.timer|0)+'s'+(M.qOn?' · '+M.qLabel+' '+Math.max(0,M.q|0)+'%':''):''},
 count:()=>MIS.length,title:i=>MIS[i]?MIS[i].t:''};
