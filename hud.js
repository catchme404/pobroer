'use strict';
// TrujiYork · creador: catchme404
// ================= HUD: minimapa estilo GTA V, estrellas, objetivos =================
const MM={w:236,h:176,K:3,X0:-40,Z0:-40,SZ:CITY+80,dpr:1,map:null,ctx:null};
function mmInit(){const c=$('mm');MM.dpr=Math.min(2,window.devicePixelRatio||1);c.width=MM.w*MM.dpr;c.height=MM.h*MM.dpr;MM.ctx=c.getContext('2d');buildMiniMap()}
function buildMiniMap(){const K=MM.K,c=document.createElement('canvas');c.width=c.height=MM.SZ*K;const g=c.getContext('2d');
 g.scale(K,K);g.translate(-MM.X0,-MM.Z0);
 g.fillStyle='#6b5a43';g.fillRect(MM.X0,MM.Z0,MM.SZ,MM.SZ);            // desierto
 g.fillStyle='#2b6a8c';g.fillRect(MM.X0,MM.Z0,-MM.X0,MM.SZ);            // mar al oeste
 for(let i=0;i<N;i++)for(let j=0;j<N;j++){
  if(isSea(i,j)){g.fillStyle='#2b6a8c';g.fillRect(i*P,j*P,P,P);continue}
  if(!isLand(i,j))continue;
  const k=i+','+j,zn=zoneOf(i,j);let col='#5a5f66';
  if(zn===6)col='#8a7f55';else if(zn===5)col='#4d4a48';else if(zn===3)col='#665f55';
  if(k==='2,2'||k==='0,1'||(zn===0&&(i+j)%3===0&&!SPKEYS.includes(k)))col='#3f6b48';
  else if(k==='3,9')col='#2b3440';else if(k==='2,11')col='#3a3d44';else if(k==='6,7')col='#8a7a5a';
  g.fillStyle=col;g.fillRect(i*P+W/2,j*P+W/2,P-W,P-W)}
 g.fillStyle='#4a4f56';
 for(let i=0;i<=N;i++)for(let j=0;j<N;j++)if(hasRoadV(i,j))g.fillRect(i*P-W/2,j*P-W/2,W,P+W);
 for(let j=0;j<=N;j++)for(let i=0;i<N;i++)if(hasRoadH(i,j))g.fillRect(i*P-W/2,j*P-W/2,P+W,W);
 for(const s of solids){if(s.x1-s.x0<2&&s.z1-s.z0<2)continue;if(s.h<1.5)continue;g.fillStyle=s.col||'#566474';g.fillRect(s.x0,s.z0,s.x1-s.x0,s.z1-s.z0)}
 MM.map=c}
function rrPath(g,x,y,w,h,r){g.beginPath();g.moveTo(x+r,y);g.arcTo(x+w,y,x+w,y+h,r);g.arcTo(x+w,y+h,x,y+h,r);g.arcTo(x,y+h,x,y,r);g.arcTo(x,y,x+w,y,r);g.closePath()}
function drawMini(dt){const g=MM.ctx,w=MM.w,h=MM.h,v=cur||pl;g.setTransform(MM.dpr,0,0,MM.dpr,0,0);g.clearRect(0,0,w,h);
 const tz=1.8-clamp(cur?Math.abs(cur.sp)/60:0,0,1)*.85;S.mmz+=(tz-S.mmz)*Math.min(1,dt*2.5);const s=S.mmz,cx=w/2,cy=h*.58,cs=Math.cos(S.cy),sn=Math.sin(S.cy);
 const pt=(x,z)=>{const dx=x-v.x,dz=z-v.z;return[cx+s*(-dx*cs+dz*sn),cy-s*(dx*sn+dz*cs)]};
 g.save();rrPath(g,0,0,w,h,16);g.clip();
 g.fillStyle='#1b2733';g.fillRect(0,0,w,h);
 g.save();g.translate(cx,cy);g.rotate(S.cy+Math.PI);g.scale(s,s);g.translate(-v.x,-v.z);
 g.drawImage(MM.map,MM.X0,MM.Z0,MM.SZ,MM.SZ);
 if(S.wanted&&POL.lkp&&!POL.seen){g.beginPath();g.arc(POL.lkp[0],POL.lkp[1],70,0,TAU);g.fillStyle='rgba(220,40,40,.14)';g.fill();g.lineWidth=1.5/s;g.strokeStyle='rgba(255,80,80,.7)';g.stroke()}
 g.restore();
 const inside=(p,m)=>p[0]>m&&p[0]<w-m&&p[1]>m&&p[1]<h-m,
  clampEdge=p=>{const ex=p[0]-cx,ey=p[1]-cy,m=13;let f=1;if(ex>0)f=Math.min(f,(w-m-cx)/ex);else if(ex<0)f=Math.min(f,(m-cx)/ex);
   if(ey>0)f=Math.min(f,(h-m-cy)/ey);else if(ey<0)f=Math.min(f,(m-cy)/ey);return f<1?[cx+ex*f,cy+ey*f,1]:[p[0],p[1],0]},
  dot=(p,col,r,ch)=>{g.beginPath();g.arc(p[0],p[1],r,0,TAU);g.fillStyle=col;g.fill();g.lineWidth=2;g.strokeStyle='#0a1118';g.stroke();
   if(ch){g.fillStyle='#fff';g.font='bold '+(r+1)+'px sans-serif';g.textAlign='center';g.textBaseline='middle';g.fillText(ch,p[0],p[1]+.5)}};
 for(const k in LOC){const l=LOC[k],p=pt(l.c[0],l.c[1]);if(inside(p,8))dot(p,l.col,7,l.ch)}
 const fl=(performance.now()/300|0)%2;
 for(const c of cars)if(c.police&&c.hp>0&&!c.stand){const p=pt(c.x,c.z);if(inside(p,5))dot(p,fl?'#e33':'#36f',4.5)}
 for(const o of offs)if(o.st!=='down'){const p=pt(o.x,o.z);if(inside(p,5))dot(p,'#fff',2.6)}
 for(const q of npcs)if(q.friend&&q.st!=='down'){const p=pt(q.x,q.z);if(inside(p,6))dot(p,q.best?'#4aa3ff':'#9ab',q.best?5.5:3,q.best?'A':null)}
 for(const q of npcs)if(q.mug&&!q.gone&&q.st!=='down'){const p=pt(q.x,q.z);if(inside(p,5))dot(p,'#ff3b3b',3)}
 for(const q of gang)if(q.st!=='down'){const p=pt(q.x,q.z);if(inside(p,5))dot(p,'#e22',q.boss?4.5:3)}
 for(const q of pickups)if(!q.got){const p=pt(q.x,q.z);if(inside(p,5))dot(p,'#4c4',3.5)}
 if(S.way){const q=clampEdge(pt(S.way.x,S.way.z));g.save();g.translate(q[0],q[1]);if(q[2])g.rotate(Math.atan2(q[1]-cy,q[0]-cx)+Math.PI/2);g.beginPath();g.moveTo(0,-9);g.lineTo(7,0);g.lineTo(0,9);g.lineTo(-7,0);g.closePath();g.fillStyle='#e040ff';g.fill();g.lineWidth=2;g.strokeStyle='#0a1118';g.stroke();g.restore()}
 for(const m of S.marks){const q=clampEdge(pt(m.x,m.z));g.save();g.translate(q[0],q[1]);
  if(q[2]){g.rotate(Math.atan2(q[1]-cy,q[0]-cx)+Math.PI/2);g.beginPath();g.moveTo(0,-8);g.lineTo(7,6);g.lineTo(-7,6);g.closePath();g.fillStyle='#ffd23a';g.fill();g.lineWidth=2;g.strokeStyle='#0a1118';g.stroke()}
  else{g.beginPath();g.arc(0,0,6.5,0,TAU);g.fillStyle='#ffd23a';g.fill();g.lineWidth=2;g.strokeStyle='#0a1118';g.stroke()}g.restore()}
 g.save();g.translate(cx,cy);g.rotate(S.cy-v.h);g.beginPath();g.moveTo(0,-9);g.lineTo(6.5,7);g.lineTo(0,3.5);g.lineTo(-6.5,7);g.closePath();g.fillStyle='#fff';g.fill();g.lineWidth=2;g.strokeStyle='#0a1118';g.stroke();g.restore();
 const nx=-sn,ny=-cs,pn=clampEdge([cx+nx*500,cy-ny*500]);g.fillStyle='#fff';g.font='bold 11px sans-serif';g.textAlign='center';g.textBaseline='middle';g.fillText('N',pn[0]*.94+cx*.06,pn[1]*.94+cy*.06);
 const gr=g.createRadialGradient(w/2,h/2,h*.3,w/2,h/2,w*.62);gr.addColorStop(0,'rgba(0,0,0,0)');gr.addColorStop(1,'rgba(0,0,0,.45)');g.fillStyle=gr;g.fillRect(0,0,w,h);
 g.restore();
 g.lineWidth=4;rrPath(g,2,2,w-4,h-4,15);g.strokeStyle=S.wanted?(fl?'#d22':'#25d'):'#0d141b';g.stroke()}
// ---------- Elementos DOM ----------
let banT=0,toastT=0;const sgEls=[];
const Hud={
 fade(text){const f=$('fade');f.textContent=text||'';f.classList.add('on');setTimeout(()=>f.classList.remove('on'),2400)},
 toast(who,text){const t=$('toast');t.innerHTML='<b style="color:'+(CCOL[who]||'#ffb3e6')+'">'+who+'</b><br>'+text.slice(0,70);t.hidden=false;toastT=4.5},
 chapter(n,title){const b=$('ban');b.innerHTML='<div class="bs" style="letter-spacing:6px">'+n.toUpperCase()+'</div><div class="bt" style="font-size:46px">'+title+'</div>';b.hidden=false;banT=4.5},
 banner(t,sub,col,extra){const b=$('ban');b.innerHTML='<div class="bt" style="color:'+(col||'#e0a526')+'">'+t+'</div>'+(sub?'<div class="bs">'+sub+'</div>':'')+(extra?'<div class="bx">'+extra+'</div>':'');b.hidden=false;banT=3.2},
 update(dt){
  if(banT>0){banT-=dt;if(banT<=0)$('ban').hidden=true}
  if(toastT>0){toastT-=dt;if(toastT<=0)$('toast').hidden=true}
  const un=Phone.total(),pb=$('pbadge');pb.hidden=false;pb.textContent='T · Celular'+(un?' ('+un+')':'');pb.classList.toggle('new',un>0&&(performance.now()/400|0)%2===0);
  $('hpb').style.width=clamp(pl.hp,0,100)+'%';
  const vb=$('vhb');vb.style.display=cur?'block':'none';$('hpt').style.flex=cur?'1':'2';if(cur)vb.firstChild.style.width=clamp(cur.hp/(cur.mhp||100)*100,0,100)+'%';
  $('spd').textContent=cur?(Math.abs(cur.sp)*3.6|0)+' km/h':'';
  $('cash').textContent='$ '+S.cash;
  const zi=zoneAt(pl.x,pl.z),zn=ZONES[zi];if(Hud.zi!==zi){if(Hud.zi!==undefined)Hud.toast('Zona: '+zn.n,zn.w+' · Seguridad: '+zn.sl);Hud.zi=zi}
  $('zone').innerHTML='<i style="background:'+zn.lv+'"></i>'+zn.n+' <small>'+zn.sl+'</small>';
  const tm=fmtTime();$('clock').textContent=(isNight()?'☾ ':'☀ ')+tm;$('phc').textContent=tm;
  const wy=S.way?Math.hypot((cur||pl).x-S.way.x,(cur||pl).z-S.way.z)|0:0;$('way').textContent=S.way?'Waypoint — '+wy+' m':'';if(S.way&&wy<8)S.way=null;
  const fl=S.wanted&&!POL.seen&&(performance.now()/350|0)%2;
  $('stars').innerHTML=[1,2,3,4,5].map(i=>'<span class="'+(i<=S.wanted?'on':'')+'" style="'+(fl&&i<=S.wanted?'opacity:.25':'')+'">★</span>').join('');
  $('wep').textContent=['','Pistola ∞','Puños','Cuchillo'][S.weapon];
  const o=Story.objective(),m=S.marks[0],d=m?Math.hypot((cur||pl).x-m.x,(cur||pl).z-m.z)|0:0;
  $('obj').textContent=o+(m&&d>10?' — '+d+' m':'');$('mtimer').textContent=Story.info();
  $('hurt').style.opacity=clamp(S.hurt*1.8,0,.8)+(pl.hp<30?.15:0);
  const cr=$('cross'),zm=S.zoom||S.aim;cr.style.transform=zm&&S.weapon===1?'scale(.72)':'scale(1)';cr.classList.toggle('lk',!!S.lock);cr.classList.toggle('hit',S.hitT>0);
  cr.style.display=S.weapon===1?'block':'none';
  drawMini(dt)},
 signs(){const m=S.vp,box=$('wsigns');if(!m)return;const pw=innerHeight/2/Math.tan(S.fov/2);
  SIGNS.forEach((sg,i)=>{let el=sgEls[i];if(!el){el=document.createElement('div');el.className='wsg';el.innerHTML='<b></b><small></small>';box.appendChild(el);sgEls[i]=el;el.firstChild.textContent=sg.t;el.lastChild.textContent=sg.sub||'';el.style.color=sg.col}
   const d=Math.hypot(sg.x-S.eye[0],sg.z-S.eye[2]),cw=m[3]*sg.x+m[7]*sg.y+m[11]*sg.z+m[15];
   if(cw<=.01||d>sg.d||d<4){el.style.display='none';return}
   const px=(((m[0]*sg.x+m[4]*sg.y+m[8]*sg.z+m[12])/cw)*.5+.5)*innerWidth,py=(1-(((m[1]*sg.x+m[5]*sg.y+m[9]*sg.z+m[13])/cw)*.5+.5))*innerHeight;
   el.style.display='block';el.style.left=px+'px';el.style.top=py+'px';el.style.fontSize=clamp(sg.h*pw/d,9,34)+'px'})},
 tags(){let box=$('ntags');if(!box){box=document.createElement('div');box.id='ntags';$('hud').appendChild(box)}
  const m=S.vp;if(!m)return;Hud._t=Hud._t||{};const seen={};
  for(const n of npcs){if(!n.name||n.st==='down')continue;const d=Math.hypot(n.x-pl.x,n.z-pl.z);if(d>(n.friend?20:6.5))continue;
   const x=n.x,y=2.55,z=n.z,cw=m[3]*x+m[7]*y+m[11]*z+m[15];if(cw<=.3)continue;
   const px=(((m[0]*x+m[4]*y+m[8]*z+m[12])/cw)*.5+.5)*innerWidth,py=(1-(((m[1]*x+m[5]*y+m[9]*z+m[13])/cw)*.5+.5))*innerHeight;if(px<0||px>innerWidth||py<0||py>innerHeight)continue;
   let e=Hud._t[n.name];if(!e){e=document.createElement('div');e.className='ntag'+(n.best?' best':'');e.innerHTML=n.name+(n.role?'<small>'+n.role+'</small>':'');box.appendChild(e);Hud._t[n.name]=e}
   e.style.display='block';e.style.left=px+'px';e.style.top=py+'px';e.style.opacity=clamp(1.3-d/(n.friend?20:6.5),.35,1);seen[n.name]=1}
  for(const k in Hud._t)if(!seen[k])Hud._t[k].style.display='none'},
 lock(){Hud.signs();Hud.tags();const l=$('lock');if(!S.lock||!S.vp){l.hidden=true;return}const m=S.vp,x=S.lock.x,y=S.lock.y+(S.lock.kind==='car'?.8:.6),z=S.lock.z,
  cw=m[3]*x+m[7]*y+m[11]*z+m[15];if(cw<=.01){l.hidden=true;return}
  const px=(((m[0]*x+m[4]*y+m[8]*z+m[12])/cw)*.5+.5)*innerWidth,py=(1-(((m[1]*x+m[5]*y+m[9]*z+m[13])/cw)*.5+.5))*innerHeight;
  l.hidden=false;l.style.left=px+'px';l.style.top=py+'px'}};

// ---------- Mapa completo (Esc), con zonas, locales y waypoints ----------
const FM={ms:1,hov:null};
function fmapSize(){return Math.max(320,Math.min(innerHeight-60,innerWidth-520,820))|0}
function drawFullMap(){const cv=$('fmap'),sz=fmapSize();if(cv.width!==sz){cv.width=cv.height=sz;cv.style.width=cv.style.height=sz+'px'}
 const g=cv.getContext('2d'),ms=sz/(CITY+2*W),wx=x=>(x+W)*ms,wz=z=>(z+W)*ms,K=MM.K;FM.ms=ms;
 g.clearRect(0,0,sz,sz);g.drawImage(MM.map,(-W-MM.X0)*K,(-W-MM.Z0)*K,(CITY+2*W)*K,(CITY+2*W)*K,0,0,sz,sz);
 const cs=ZONES.map(()=>[0,0,0]);
 for(let i=0;i<N;i++)for(let j=0;j<N;j++){if(!isLand(i,j))continue;const zi=zoneOf(i,j);g.fillStyle=ZONES[zi].col;g.fillRect(wx(i*P-W/2),wz(j*P-W/2),P*ms+1,P*ms+1);cs[zi][0]+=i*P+P/2;cs[zi][1]+=j*P+P/2;cs[zi][2]++}
 g.textAlign='center';g.textBaseline='middle';g.lineJoin='round';
 ZONES.forEach((z,zi)=>{const c=cs[zi],x=wx(c[0]/c[2]),y=wz(c[1]/c[2]);g.font='bold '+Math.max(12,sz/38|0)+'px sans-serif';g.lineWidth=4;g.strokeStyle='#000c';g.strokeText(z.n.toUpperCase(),x,y);g.fillStyle='#fff';g.fillText(z.n.toUpperCase(),x,y);
  g.beginPath();g.arc(x,y+sz/36,5,0,TAU);g.fillStyle=z.lv;g.fill();g.lineWidth=1.5;g.strokeStyle='#000';g.stroke()});
 g.font='bold '+Math.max(10,sz/62|0)+'px sans-serif';
 for(const k in LOC){const l=LOC[k],x=wx(l.c[0]),y=wz(l.c[1]);g.beginPath();g.arc(x,y,7,0,TAU);g.fillStyle=l.col;g.fill();g.lineWidth=2;g.strokeStyle='#000';g.stroke();g.fillStyle='#fff';g.font='bold 9px sans-serif';g.fillText(l.ch,x,y+.5);
  g.font='bold '+Math.max(10,sz/62|0)+'px sans-serif';g.lineWidth=3;g.strokeStyle='#000d';g.strokeText(l.n,x,y-13);g.fillStyle='#ffe9a0';g.fillText(l.n,x,y-13)}
 for(const q of npcs)if(q.friend){g.beginPath();g.arc(wx(q.x),wz(q.z),q.best?6:3.5,0,TAU);g.fillStyle=q.best?'#4aa3ff':'#9ab';g.fill();g.lineWidth=1.5;g.strokeStyle='#000';g.stroke();if(q.best){g.font='bold 11px sans-serif';g.lineWidth=3;g.strokeStyle='#000d';g.strokeText('Alex Ross',wx(q.x),wz(q.z)-11);g.fillStyle='#bfe3ff';g.fillText('Alex Ross',wx(q.x),wz(q.z)-11)}}
 for(const m of S.marks){g.beginPath();g.arc(wx(m.x),wz(m.z),6,0,TAU);g.fillStyle='#ffd23a';g.fill();g.lineWidth=2;g.strokeStyle='#000';g.stroke()}
 if(S.way){const x=wx(S.way.x),y=wz(S.way.z);g.beginPath();g.moveTo(x,y);g.lineTo(x-8,y-18);g.lineTo(x+8,y-18);g.closePath();g.fillStyle='#e040ff';g.fill();g.strokeStyle='#000';g.lineWidth=2;g.stroke();g.beginPath();g.arc(x,y-22,8,0,TAU);g.fill();g.stroke()}
 const v=cur||pl;g.save();g.translate(wx(v.x),wz(v.z));g.rotate(Math.PI-v.h);g.beginPath();g.moveTo(0,-11);g.lineTo(8,9);g.lineTo(0,5);g.lineTo(-8,9);g.closePath();g.fillStyle='#fff';g.fill();g.lineWidth=2.5;g.strokeStyle='#000';g.stroke();g.restore();
 g.lineWidth=4;g.strokeStyle='#0d141b';g.strokeRect(2,2,sz-4,sz-4);
 if(FM.hov){const h=FM.hov,t=h.t;g.font='bold 13px sans-serif';const w=g.measureText(t).width+14,bx=clamp(h.px+12,2,sz-w-2),by=clamp(h.py+14,2,sz-26);g.fillStyle='#000d';g.fillRect(bx,by,w,22);g.fillStyle='#fff';g.textAlign='left';g.fillText(t,bx+7,by+11)}}
function fmapEvent(e,kind){const cv=$('fmap'),r=cv.getBoundingClientRect(),px=(e.clientX-r.left)*cv.width/r.width,py=(e.clientY-r.top)*cv.height/r.height,x=px/FM.ms-W,z=py/FM.ms-W;
 if(kind==='move'){let t=null,bd=14;for(const k in LOC){const d=Math.hypot(LOC[k].c[0]-x,LOC[k].c[1]-z);if(d<bd){bd=d;t=LOC[k].n}}
  if(!t){if(x<0)t='Océano Pacífico';else if(!isLand(Math.floor(x/P),Math.floor(z/P)))t='Desierto (fuera de la ciudad)';else{const zn=ZONES[zoneAt(x,z)];t=zn.n+' · '+zn.w+' · '+zn.sl}}FM.hov={px,py,t};drawFullMap();return}
 if(x<-W||z<-W||x>CITY+W||z>CITY+W)return;
 if(kind==='set'){if(S.way&&Math.hypot(S.way.x-x,S.way.z-z)<14)S.way=null;else S.way={x:clamp(x,0,CITY),z:clamp(z,0,CITY)};drawFullMap()}
 else if(kind==='clear'){S.way=null;drawFullMap()}}
function zoneLegend(){return ZONES.map(z=>'<div class="zl"><i style="background:'+z.lv+'"></i><b>'+z.n+'</b><small>'+z.w+' · '+z.sl+'</small></div>').join('')}
