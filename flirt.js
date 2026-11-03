'use strict';
// TrujiYork · creador: catchme404
// ============== LIGAR EN EL CLUB ==============
// Todas las chicas son adultas (22-30 años). Es un coqueteo de diálogos: el beso termina con un fundido a negro, sin contenido explícito.
const GIRLS=[
 {n:'Valeria',age:24,t:'romantica',job:'estudia Derecho en San Andrés'},
 {n:'Camila',age:27,t:'divertida',job:'es fotógrafa'},
 {n:'Fernanda',age:26,t:'interesada',job:'trabaja en una joyería de El Golf'},
 {n:'Shirley',age:23,t:'divertida',job:'es DJ aficionada'},
 {n:'Brenda',age:29,t:'romantica',job:'es enfermera'},
 {n:'Milagros',age:25,t:'interesada',job:'vende autos de lujo'},
 {n:'Luciana',age:28,t:'romantica',job:'es arquitecta'},
 {n:'Xiomara',age:22,t:'divertida',job:'baila marinera'},
 {n:'Naomi',age:30,t:'interesada',job:'tiene una boutique'},
 {n:'Daniela',age:26,t:'romantica',job:'es profesora de inglés'}];
const PREF={romantica:{cumplido:18,trago:12,chiste:5,bailar:14},divertida:{cumplido:8,trago:10,chiste:20,bailar:18},interesada:{cumplido:10,trago:25,chiste:4,bailar:10}};
const HINT={romantica:'Parece romántica: los cumplidos y bailar funcionan',divertida:'Le encanta reír: los chistes y bailar funcionan',interesada:'Se fija en los detalles (y en los tragos)'};
const OPT={
 cumplido:['Qué linda sonrisa tienes.','Brillas más que las luces del club.','Ese vestido te queda increíble.'],
 trago:['¿Te invito un trago? ($25)','¿Pisco sour o chilcano? Va por mi cuenta. ($25)'],
 chiste:['Si fueras ceviche, serías el fresquito... y con ají.','Dicen que bailo mal, pero tú me inspiras.','¿Eres del Golf? Porque contigo siento que metí un hoyo en uno.'],
 bailar:['¿Bailamos esta canción?','Préstame un baile y te lo devuelvo.']};
const POS=['Jaja, qué atrevido...','Me caes bien, Damián.','Uy, qué lindo eres.','Me hiciste reír.','Mmm, sigue así.'],NEU=['Está bien, jaja.','Mmm... puede ser.'],NEG=['No sé... qué cringe, jaja.','Ya pues, intenta algo mejor.','Eso no me convenció.','Uf, qué flojera.'];
let hearts=[];
const FL={};
const Flirt={open:false,g:null,n:null,opts:[],txt:'',
 reset(){for(const k in FL)delete FL[k];hearts=[];this.dateCb=null;this.close();DATE.reset()},
 st(g){return FL[g.n]||(FL[g.n]={int:20+(Math.random()*10|0),cd:0,kissed:0,turns:0,met:0})},
 start(n){const g=n.girl,s=this.st(g);if(s.date){DATE.menu(n);return}this.title=null;
  if(s.cd>0){say(g.n,pick(['Ahora no, estoy con mis amigas.','Ya te dije que no, jaja.']));return}
  this.open=true;this.g=g;this.n=n;s.turns=0;
  this.txt=s.kissed?pick(['¿Otra vez por aquí? Me gusta que vuelvas.','¡Damián! Te estaba esperando.']):s.met?'Hola otra vez...':'Hola... ¿tú eres de La Manada?';s.met=1;
  this.roll();this.draw();$('flirt').hidden=false},
 roll(){const s=this.st(this.g),cats=['cumplido','trago','chiste','bailar'].sort(()=>Math.random()-.5).slice(0,s.int>=65?2:3);
  this.opts=cats.map(c=>({c,t:pick(OPT[c])}));if(s.int>=65)this.opts.push({c:'beso',t:'Darle un beso'})},
 pick(i){if(this.dateCb){const cb=this.dateCb;this.dateCb=null;cb(i);return}const o=this.opts[i];if(!o)return;const g=this.g,s=this.st(g);
  if(o.c==='beso'){if(Math.random()<(s.int-40)/60){this.kiss();return}s.int-=28;this.txt=pick(['¡Muy rápido, Damián!','Ay no... todavía no.'])}
  else{if(o.c==='trago'){if(S.cash<25){this.txt='Mmm... parece que no te alcanza para el trago.';this.roll();this.draw();return}S.cash-=25}
   const d=PREF[g.t][o.c]+(Math.random()*12-6);s.int=clamp(s.int+d,-10,100);this.txt=d>=12?pick(POS):d>=4?pick(NEU):pick(NEG)}
  s.turns++;
  if(s.int<=0){s.cd=90;s.int=15;const gn=g.n;this.close();say(gn,pick(['Mejor vuelve cuando tengas algo más interesante, jaja.','No eres mi tipo, lo siento.']));return}
  if(s.int>=100){this.kiss();return}
  if(s.turns>=8){const gn=g.n;this.close();say(gn,'Se hace tarde... otro día, ¿sí?');return}
  this.roll();this.draw()},
 kiss(){const g=this.g,n=this.n,s=this.st(g);this.close();s.kissed=1;s.int=100;
  const dx=n.x-pl.x,dz=n.z-pl.z,d=Math.hypot(dx,dz)||1;pl.h=Math.atan2(dx,dz);n.h=Math.atan2(-dx,-dz);if(d>1.1){n.x=pl.x+dx/d*.9;n.z=pl.z+dz/d*.9}
  S.frozen=3.4;Hud.fade('Se dieron un beso largo... (fundido a negro)');
  for(let k=0;k<16;k++)hearts.push({x:n.x+rr(-.6,.6),y:1.7+rr(0,.6),z:n.z+rr(-.6,.6),t:rr(2,3.4)});
  pl.hp=Math.min(100,pl.hp+30);S.kisses=(S.kisses||0)+1;
  say(g.n,pick(['Mmm... qué rico besas, Damián.','Qué bonito... no te vayas, ¿ya?']));say('Damián','Esta noche sí valió la pena.');
  DATE.onKiss(g);
  Phone.msg(g.n,'Me encantó conocerte, Damián. Guarda mi número ;)',9);
  Phone.ask(g.n,['Te invito a cenar ceviche mañana.','Cuando quieras, linda.','*Dejar en visto*'],[['¡Trato hecho! Me visto bonita.'],['Jaja, te tomo la palabra.'],['Ay, qué malo eres... ya te perdono.']])},
 show(g,title,txt,texts,cb){this.open=true;this.g=g;this.title=title;this.txt=txt;this.opts=texts.map((x,i)=>({c:'d'+i,t:x}));this.dateCb=cb;this.draw();$('flirt').hidden=false},
 draw(){const g=this.g,s=this.st(g);$('fn').textContent=this.title||(g.n+', '+g.age+' años');$('fi').textContent=s.turns>0?HINT[g.t]:g.job;$('fbar').style.width=clamp(s.int,0,100)+'%';
  $('fs').textContent=g.n+': '+this.txt;$('fo').innerHTML=this.opts.map((o,i)=>'<div class="opt"><b>'+(i+1)+'</b> '+o.t+'</div>').join('')},
 close(){const cb=this.dateCb;this.dateCb=null;this.open=false;$('flirt').hidden=true;if(cb)cb(-1)},
 update(dt){for(const k in FL)FL[k].cd=Math.max(0,FL[k].cd-dt);
  for(const h of hearts){h.t-=dt;h.y+=dt*.9}hearts=hearts.filter(h=>h.t>0);
  if(this.open&&!this.dateCb){const n=this.n;n.h=Math.atan2(pl.x-n.x,pl.z-n.z);if(Math.hypot(n.x-pl.x,n.z-pl.z)>5||cur||deadT>0||n.st==='flee'||n.st==='down')this.close()}}};
