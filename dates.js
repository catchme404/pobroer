'use strict';
// TrujiYork · creador: catchme404
// ============== CITAS: recoger a una chica en su casa, salir a cenar y dejarla en casa ==============
// Todas las chicas son adultas (22-30 años). Las citas son de diálogo: el beso termina con un fundido a negro.
// Para tener una cita primero hay que besarla en el Club Neón. Después aparece su casa en el mapa.
Object.assign(VOICE,{'Alex Ross':{f:250,c:'#ff9f7a'},Taveo:{f:200,c:'#9ad0ff'}});
// Casas de las chicas: celda [i,j]; la puerta está en la calle de la celda
const HOME={Valeria:[2,6],Camila:[5,2],Fernanda:[10,3],Shirley:[7,8],Brenda:[12,6],Milagros:[9,1],Luciana:[4,0],Xiomara:[2,0],Naomi:[6,9],Daniela:[3,13]};
const homePos=name=>{const h=HOME[name];return[h[0]*P,h[1]*P+26]};
// Planes de cita: costo, lugar y las situaciones de cada escena
const DEST=[
 {n:'Vikkingos (cena de lujo)',cost:150,p:()=>LOC.vikkingos.c,hello:'¿Vikkingos? Qué elegante, Damián. Me pongo linda para ti.',
  turns:['El mesero trae la carta de vinos. Te mira esperando que elijas.','Llega el lomo con salsa de ají. Ella prueba un bocado y te observa.','Se acomoda el pelo y te pregunta por tu vida en TrujiYork.','El postre llega. Ella espera a ver cómo cierras la noche.']},
 {n:'Malecón de Huanchaco (helados)',cost:30,p:()=>LOC.muelle.c,hello:'¡Huanchaco! Me encanta el mar, me calma.',
  turns:['Las olas suenan bajito. Te pasa un helado de lúcuma.','Los pescadores regresan con la pesca. Te cuenta que de niña venía aquí.','Se sienta más cerca. Espera tu reacción.','El sol se pone en el mar. Ella te mira en silencio.']},
 {n:'Discoteca Marea',cost:60,p:()=>LOC.marea.c,hello:'¡Marea! Vamos a bailar hasta que salga el sol.',
  turns:['La música retumba. Te grita al oído para que la escuches.','Te arrastra a la pista y se ríe mientras baila.','Te pregunta si estás bien con tanto ruido.','¿Vamos afuera a tomar aire?']},
 {n:'Mirador de San Andrés',cost:0,p:()=>LOC.mirador.c,hello:'Qué lindo mirador... se ve toda la ciudad.',
  turns:['Desde aquí se ven las luces de todo TrujiYork.','Te pregunta por tu familia. Espera tu respuesta.','El viento le despeina el pelo. Te mira en silencio.','Te pregunta si te quedas con ella un rato más.']}];
const OPT_DATE={cumplido:['Te ves preciosa esta noche.','Tu risa es lo mejor de esta ciudad.'],chiste:['¿Sabes por qué el ceviche nunca se aburre? Porque siempre está en su salsa.','¿Eres del Golf? Porque contigo siento que metí un hoyo en uno.'],detalle:['Te traje una flor del mercado.','Pido otro trago para las dos. ¡Yo invito!'],escuchar:['Cuéntame más de ti, en serio.','Me encanta cómo hablas de lo que te gusta.']};
const DATE_CAT_PREF={cumplido:'cumplido',chiste:'chiste',detalle:'trago',escuchar:null};
const girlLook=g=>{const i=GIRLS.indexOf(g),pal=[[.9,.4,.6],[.3,.6,.9],[.95,.8,.3],[.6,.3,.8],[.3,.8,.6]];
 return{jk:pal[i%5],pn:[.15,.15,.2],sk:[.85,.65,.5],hr:[.1,.06,.04],long:true,dress:1,kind:'npc'}};
const DATE={st:'none',g:null,dest:0,turn:0,pend:'',cats:[],
 reset(){this.st='none';this.g=null;this.pend='';S.marks=[]},
 // al besar a una chica aparece su casa y se puede tener una cita
 onKiss(g){const s=Flirt.st(g);s.date=1;
  if(!npcs.some(n=>n.tag==='home'&&n.girl===g)){const p=homePos(g.n),n={x:p[0],z:p[1],h:Math.PI,st:'idle',t:1e9,hp:50,ph:0,mv:0,tag:'home',fixed:1,pose:'talk',girl:g,name:g.n,look:girlLook(g),lines:[],li:0};n.proto=Object.assign({},n);npcs.push(n)}
  const h=HOME[g.n],zn=ZONES[zoneOf(h[0],h[1])].n;
  Phone.msg(g.n,'Oye, Damián, si quieres salir... vivo en '+zn+'. Pásate por mi casa cuando quieras.',6)},
 // al hablar con ella en su casa o en el club (ya con cita)
 menu(n){const g=n.girl;
  if(this.st==='none'){
   Flirt.show(g,'Cita con '+g.n,'¿Qué hacemos, Damián?',['Recogerla y salir juntos','Solo saludarla'],i=>{
    if(i===0)this.pickup(g);else{Flirt.close();say(g.n,pick(['¡Qué lindo verte, Damián!','Nos vemos luego, ¿sí?']))}});
   return}
  if(this.g!==g){Flirt.close();say(g.n,'Ahorita no, ya salí con alguien...');return}
  if(this.st==='home'){this.atHome();return}
  Flirt.close();say(g.n,'Estamos en plena salida... ¡sigue manejando, Damián!')},
 // elegir el plan de la cita
 pickup(g){this.g=g;this.st='pick';
  Flirt.show(g,'¿A dónde vamos?','Elige el plan, Damián.',DEST.map(d=>d.n+(d.cost?' · $'+d.cost:' · gratis')),i=>{
   Flirt.close();
   if(i<0){this.end();say(g.n,'Bueno... otro día.');return}
   this.dest=i;this.st='going';msg('Recogiste a '+g.n+'. Destino: '+DEST[i].n);say(g.n,DEST[i].hello)})},
 update(dt){
  if(this.st==='going'){const d=DEST[this.dest].p();S.marks=[{x:d[0],z:d[1]}];if(near(d,10))this.arrive()}
  else if(this.st==='home'&&this.g){const h=homePos(this.g.n);S.marks=[{x:h[0],z:h[1]}];if(near(h,9))this.atHome()}},
 arrive(){const d=DEST[this.dest];
  if(S.cash<d.cost){say(this.g.n,'No tienes ni para el menú, causa. Mejor vamos a mi casa.');this.st='home';return}
  S.cash-=d.cost;this.turn=0;this.pend='';this.st='scene';this.scene()},
 scene(){const g=this.g,d=DEST[this.dest];
  if(this.turn>=d.turns.length){this.finish(true);return}
  const cats=['cumplido','chiste','detalle','escuchar'].sort(()=>Math.random()-.5).slice(0,3);this.cats=cats;
  const txt=(this.pend?this.pend+' ':'')+d.turns[this.turn];this.pend='';
  Flirt.show(g,d.n,txt,cats.map(c=>pick(OPT_DATE[c])),i=>{if(i<0){this.finish(false);return}this.choose(i)})},
 choose(i){const g=this.g,s=Flirt.st(g),c=this.cats[i],key=DATE_CAT_PREF[c];
  let d=key?PREF[g.t][key]+rr(-6,6):8+rr(-3,3);
  if(c==='detalle'){if(S.cash<20){d=-4;this.pend='(no tienes para el detalle)'}else S.cash-=20}
  s.int=clamp(s.int+d,-10,100);
  if(!this.pend)this.pend=d>=12?pick(POS):d>=4?pick(NEU):pick(NEG);
  this.turn++;
  if(s.int<=0){this.finish(false);return}
  this.scene()},
 finish(ok){const g=this.g,s=Flirt.st(g);Flirt.close();
  const good=ok&&s.int>=50;
  if(good)s.rel=(s.rel||0)+1;
  say(g.n,s.int>=70?'Me la pasé increíble, Damián. Llévame a casa... ya veremos.':s.int>=50?'Estuvo bien. Llévame a casa, ¿sí?':'Mmm... no me convenciste del todo. Llévame a casa.');
  if(s.int>=70)Phone.msg(g.n,'Repitamos pronto, ¿sí? ;)',5);
  msg(good?'Buena cita con '+g.n+' (+1 de relación)':'Cita regular con '+g.n);
  this.st='home';this.pend=''},
 // llegaron a su casa: puede invitarte a pasar
 atHome(){const g=this.g,s=Flirt.st(g);S.marks=[];
  const opts=s.int>=70?['Entrar a su casa','Despedirte con un beso en la mejilla']:['Despedirte'];
  Flirt.show(g,'Llegaron a casa de '+g.n,'Se queda en la puerta mirándote...',opts,i=>{
   Flirt.close();
   if(s.int>=70&&i===0)this.enter(g);
   else{say(g.n,'Gracias por la noche, Damián.');this.end()}})},
 enter(g){const s=Flirt.st(g);s.kissed=1;s.int=100;s.rel=(s.rel||0)+1;S.kisses=(S.kisses||0)+1;
  pl.hp=Math.min(100,pl.hp+30);S.frozen=3.4;
  Hud.fade('Entraron a su casa... (fundido a negro)');
  say(g.n,'Pasa... que la noche es larga.');say('Damián','Esta sí fue una buena cita.');this.end()},
 end(){this.st='none';this.g=null;this.pend='';S.marks=[]}};
