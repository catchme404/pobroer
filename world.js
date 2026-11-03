'use strict';
// TrujiYork · creador: catchme404
// ================= MUNDO: desierto, cerros, seis zonas y locales =================
let statGlow=null,statFlat=null,statFlatGlow=null,statRoad=null;
// Colores de la ciudad costera: mar, calles grises, aceras, sombras y brillo de los carriles
const SEA_C=[.16,.4,.52],ROAD_C=[.36,.36,.37],LANE_C=[.96,.84,.32],CURB_C=[.74,.72,.68],SHADE_C=[.3,.29,.28];
// Celdas con elementos especiales (para colorear el minimapa)
const SPKEYS=['0,1','1,1','2,2','2,4','1,5','1,7','3,8','3,9','5,5','6,4','6,7','10,1','10,2','11,3','9,8','10,6','2,11'];
function buildWorld(){
 // Capas planas (mar, suelo, calles, aceras, pistas): solo cara superior y en orden de pintor, sin prueba de profundidad -> sin parpadeo
 const a=[],g=[],fl=[],gf=[],rd=[],flat=(y,sy)=>sy<=.2&&y+sy/2<=.32,
  // sombra proyectada: el sol viene de (+x,+y,+z), así que la sombra cae hacia (-x,-z)
  shd=(x,y,z,sx,sy,sz)=>{const top=y+sy/2,ox=-top*.5,oz=-top*.375;E.top9(fl,x+ox/2,.17,z+oz/2,sx+Math.abs(ox),.02,sz+Math.abs(oz),SHADE_C)},
  B=(x,y,z,sx,sy,sz,c)=>{if(flat(y,sy))E.top9(fl,x,y,z,sx,sy,sz,c);else{E.box9(a,x,y,z,sx,sy,sz,c);if(sy>=1)shd(x,y,z,sx,sy,sz)}},
  G=(x,y,z,sx,sy,sz,c)=>flat(y,sy)?E.top9(gf,x,y,z,sx,sy,sz,c):E.box9(g,x,y,z,sx,sy,sz,c),
  R=(x,z,sx,sz)=>E.top9(rd,x,.03,z,sx,.06,sz,ROAD_C);
 solids.length=0;spots.length=0;SIGNS.length=0;
 const rect=(x,z,hw,hd,h,col)=>solids.push({x0:x-hw,x1:x+hw,z0:z-hd,z1:z+hd,h,col}),s=P-W,SAND=[.77,.67,.47];
 const tree=(x,z,k)=>{B(x,1,z,.5,2,.5,[.4,.25,.1]);B(x,3.2,z,2.6,2.4,2.6,k||[.15,.5,.15]);rect(x,z,.4,.4,5)};
 const palm=(x,z)=>{B(x,2,z,.4,4,.4,[.45,.3,.15]);B(x,4.2,z,3.6,.3,.6,[.2,.55,.2]);B(x,4.2,z,.6,.3,3.6,[.2,.55,.2])};
 // ----- desierto, mar y cerros -----
 B(CITY/2,-.3,CITY/2,CITY+900,.2,CITY+900,SAND);
 E.top9(fl,-450,-.3,CITY/2,900,.2,CITY+900,SEA_C);                       // océano al oeste
 for(let j=0;j<N;j++)for(let i=0;i<N;i++)if(isSea(i,j))E.top9(fl,i*P+P/2,-.3,j*P+P/2,P,.2,P,SEA_C);
 for(let j=0;j<N;j++)for(let i=0;i<N;i++)if(isSea(i,j)&&isLand(i+1,j))E.top9(fl,(i+1)*P-8.6,-.22,j*P+P/2,1.2,.04,P,[.88,.95,.97]); // espuma
 const mt=(x,z,w,h,c)=>{B(x,h*.25,z,w,h*.5,w*.8,c);B(x,h*.55,z,w*.65,h*.5,w*.55,[c[0]*1.05,c[1]*1.05,c[2]*1.05]);B(x,h*.85,z,w*.35,h*.3,w*.3,[c[0]*1.12,c[1]*1.1,c[2]*1.08])};
 const MC=[[.5,.4,.3],[.56,.46,.34],[.46,.38,.3],[.6,.5,.38],[.42,.36,.3]];
 for(let side=0;side<4;side++)if(side!==2)for(let k=-120;k<CITY+120;k+=34){const out=40+rr(0,120),t=k+rr(-10,10),w=rr(45,95),h=rr(30,100),c=pick(MC);   // sin cerros al oeste (mar)
  if(side===0)mt(t,-out,w,h,c);else if(side===1)mt(t,CITY+out,w,h,c);else mt(CITY+out,t,w,h,c)}
 for(let k=0;k<160;k++){const an=rr(0,TAU),r=rr(CITY*.75,CITY*.75+160),x=CITY/2+Math.cos(an)*r,z=CITY/2+Math.sin(an)*r;
  if(x<-W-3||(x>-W-3&&x<CITY+W+3&&z>-W-3&&z<CITY+W+3))continue;
  if(Math.random()<.5)B(x,.6,z,rr(6,16),1.2,rr(6,16),[.82,.72,.5]);else B(x,1,z,rr(1.5,3),2,rr(1.5,3),[.45,.4,.35])}
 // ----- calles: solo donde hay tramo de calle (la ciudad tiene forma irregular) -----
 for(let i=0;i<=N;i++)for(let j=0;j<N;j++)if(hasRoadV(i,j)){R(i*P,j*P+P/2,W,P+W);for(let t=j*P+W;t<(j+1)*P-W;t+=8)E.top9(gf,i*P,.08,t+2,.25,.04,3,LANE_C)}
 for(let j=0;j<=N;j++)for(let i=0;i<N;i++)if(hasRoadH(i,j)){R(i*P+P/2,j*P,P+W,W);for(let t=i*P+W;t<(i+1)*P-W;t+=8)E.top9(gf,t+2,.08,j*P,3,.04,.25,LANE_C)}
 // ----- muro perimetral irregular: barandas hacia el mar y muro de adobe hacia el desierto -----
 const WL=P+16,wall=(x,z,sx,sz,sea)=>{if(sea){B(x,.65,z,sx,1.3,sz,[.84,.84,.82]);rect(x,z,sx/2,sz/2,1.3,'#8f9699')}else{B(x,1.6,z,sx,3.2,sz,[.62,.54,.42]);rect(x,z,sx/2,sz/2,3.2,'#6a5a46')}};
 for(let i=0;i<N;i++)for(let j=0;j<N;j++){if(!isLand(i,j))continue;const cx=i*P+P/2,cz=j*P+P/2;
  if(!isLand(i-1,j)){if(i===0&&j===1){wall(-7.2,P+6.5,.8,29,true);wall(-7.2,2*P-6.5,.8,29,true);rect(-9.8,P+21,2.2,.4,1.3,'#8f9699');rect(-9.8,P+31,2.2,.4,1.3,'#8f9699'); /* cierra la franja de mar: el muelle es un callejón */}else wall(i*P-7.2,cz,.8,WL,isSea(i-1,j))}
  if(!isLand(i+1,j))wall((i+1)*P+7.2,cz,.8,WL,isSea(i+1,j));
  if(!isLand(i,j-1))wall(cx,j*P-7.2,WL,.8,isSea(i,j-1));
  if(!isLand(i,j+1))wall(cx,(j+1)*P+7.2,WL,.8,isSea(i,j+1))}
// ----- locales -----
 const club=(cx,cz)=>{const W1=[.32,.08,.38],MG='#ee3fa3';B(cx,.17,cz,s-6,.02,s-6,[.16,.1,.2]);B(cx,.2,cz,21.4,.04,15.4,[.12,.07,.16]);
  for(let k=0;k<5;k++)for(let m=0;m<3;m++)G(cx-4.8+k*2.4,.25,cz-.5+m*2.4,2.2,.04,2.2,(k+m)%2?[.9,.2,.6]:[.2,.8,.9]);
  B(cx,3.25,cz-8,22.6,6.5,.6,W1);rect(cx,cz-8,11.3,.3,6.5,MG);B(cx-11,3.25,cz,.6,6.5,16,W1);rect(cx-11,cz,.3,8,6.5,MG);B(cx+11,3.25,cz,.6,6.5,16,W1);rect(cx+11,cz,.3,8,6.5,MG);
  B(cx-6.4,3.25,cz+8,9.2,6.5,.6,W1);rect(cx-6.4,cz+8,4.6,.3,6.5,MG);B(cx+6.4,3.25,cz+8,9.2,6.5,.6,W1);rect(cx+6.4,cz+8,4.6,.3,6.5,MG);B(cx,5.8,cz+8,3.6,1.4,.6,W1);
  B(cx,6.65,cz,22.8,.3,16.6,[.12,.05,.15]);G(cx,6.85,cz,23,.3,17,[.95,.08,.55]);
  const LC=[[.95,.08,.55],[.1,.9,.95],[.95,.85,.2],[.6,.3,1]];for(let k=0;k<4;k++)G(cx-4.5+k*3,8.6,cz+1,2.2,3,.7,LC[k]);
  for(let k=0;k<5;k++)G(cx-8+k*4,3.4,cz+8.35,.6,4.6,.1,k%2?[.1,.9,.95]:[.95,.08,.55]);G(cx,4.8,cz+8.4,3.8,.2,.1,[.95,.8,.2]);
  B(cx,.23,cz+10.5,3.4,.04,5,[.7,.1,.2]);for(const sx of[-1.9,1.9])for(const dz of[8.8,12])B(cx+sx,.5,cz+dz,.15,1,.15,[.8,.7,.2]);
  B(cx-4,.55,cz-6.2,9,1.1,1.2,[.25,.13,.08]);rect(cx-4,cz-6.2,4.5,.6,1.1,'#8a4a2a');B(cx-4,1.3,cz-7.6,9,.1,.4,[.3,.2,.12]);
  for(let k=0;k<8;k++)G(cx-8+k*1.1,1.6,cz-7.6,.3,.5,.3,[[.3,.8,.5],[.9,.6,.2],[.3,.5,.9],[.9,.3,.3]][k%4]);
  for(let k=0;k<5;k++)B(cx-7.5+k*1.8,.5,cz-5,.5,1,.5,[.15,.1,.1]);
  B(cx+7,.3,cz-6,6,.6,3,[.1,.1,.12]);G(cx+7,1.8,cz-7.4,5,1.6,.2,[.2,.6,.95]);
  B(cx+9.2,.5,cz-2.6,1.2,1,4,[.5,.1,.3]);B(cx+7,.4,cz-2.6,1.4,.8,1.4,[.25,.15,.15]);B(cx+9.2,.5,cz+2,1.2,1,3,[.5,.1,.3]);B(cx-9.4,.5,cz+3,1.2,1,4,[.5,.1,.3]);
  for(const sx of[-10,10])B(cx+sx,1.2,cz+1,1,2.4,1,[.06,.06,.08]);
  for(let k=0;k<3;k++)G(cx,6.4,cz-5+k*5,20,.1,.3,LC[k]);};
 const cevi=(cx,cz)=>{B(cx,.2,cz,s-6,.02,s-6,[.75,.7,.55]);
  B(cx,1.8,cz-2,12,3.6,6,[.9,.43,.12]);rect(cx,cz-2,6,3,3.6,'#f39a2b');
  B(cx,3.75,cz+1.4,12.6,.3,6.6,[1,.85,.35]);for(let k=0;k<6;k++)B(cx-5.5+k*2.2,3.78,cz+1.4,1.1,.3,6.7,[.95,.25,.2]);
  B(cx,1,cz+1.6,11,.9,1,[.5,.3,.15]);for(let k=0;k<5;k++)G(cx-4+k*2,3.2,cz+4,.3,.3,.3,[1,.9,.5]);
  G(cx,5,cz-2,3.4,1.5,.6,[.2,.7,.9]);G(cx+2.4,5,cz-2,1.2,1.3,.6,[.2,.7,.9]);B(cx-1.2,5.2,cz-1.65,.3,.3,.1,[1,1,1]);
  for(const [tx,tz] of [[-8,8],[0,10],[8,8],[-5,14],[5,14]]){const x=cx+tx,z=cz+tz;
   rect(x,z,.8,.8,.9,'#ddd');B(x,.9,z,1.6,.12,1.6,[.95,.95,.9]);B(x,.45,z,.2,.9,.2,[.4,.4,.4]);B(x,3,z,3.6,.25,3.6,[.2,.55,.85]);B(x,1.7,z,.12,2.6,.12,[.3,.3,.3]);
   B(x+1.3,.4,z,.6,.8,.6,[.8,.2,.2]);B(x-1.3,.4,z,.6,.8,.6,[.8,.2,.2])}};
 const paint=(cx,cz)=>{B(cx,.2,cz,s-6,.02,s-6,[.3,.3,.33]);
  B(cx,2.5,cz,14,5,12,[.85,.86,.9]);rect(cx,cz,7,6,5,'#f4d03f');B(cx,5.1,cz,14.8,.4,12.8,[.95,.75,.1]);
  B(cx+7.05,1.9,cz,.12,3.8,9,[.95,.75,.1]);for(let k=0;k<6;k++)B(cx+7.13,.7+k*.6,cz,.1,.28,9,k%2?[.9,.2,.2]:[.2,.5,.9]);
  G(cx,6.6,cz,2,2.4,2,[.9,.2,.2]);B(cx,8.2,cz,1,.8,1,[.9,.9,.9]);
  B(cx+12,.27,cz,8,.04,10,[.95,.85,.15]);for(let k=0;k<4;k++)B(cx+12,.3,cz-4+k*2.6,7,.03,.3,[1,1,1])};
 const casa=(cx,cz)=>{B(cx,.2,cz,s-6,.02,s-6,[.3,.55,.3]);
  B(cx,2.3,cz,10,4.6,9,[.92,.62,.72]);rect(cx,cz,5,4.5,4.6,'#e89ab0');B(cx,5.1,cz,11.4,1,10.4,[.25,.5,.3]);B(cx,5.9,cz,8,.8,7,[.25,.5,.3]);
  B(cx,1.2,cz+4.54,1.4,2.2,.1,[.35,.2,.1]);for(const sx of[-3,3])G(cx+sx,2.4,cz+4.54,1.6,1.4,.1,[.5,.7,.9]);
  for(let k=-8;k<=8;k+=1.6)B(cx+k,.5,cz+12,.15,1,.15,[.95,.95,.9]);B(cx,.9,cz+12,17,.1,.1,[.95,.95,.9]);
  for(let k=0;k<10;k++)B(cx+rr(-8,8),.3,cz+rr(7,11),.4,.6,.4,pick([[1,.4,.6],[1,.8,.2],[.9,.3,.3]]));
  B(cx-12,1.5,cz-3,.6,3,.6,[.4,.25,.1]);B(cx-12,4,cz-3,3,3,3,[.15,.5,.15]);rect(cx-12,cz-3,.4,.4,5)};
 const mansion=(cx,cz)=>{B(cx,.2,cz,s-4,.02,s-4,[.25,.55,.25]);
  B(cx,4,cz,22,8,14,[.92,.9,.82]);rect(cx,cz,11,7,8,'#c9a227');B(cx,8.4,cz,23,.8,15,[.55,.15,.12]);B(cx,9.4,cz,16,1.2,10,[.55,.15,.12]);
  for(let k=0;k<4;k++)B(cx-7.5+k*5,3.5,cz+7.6,.9,7,.9,[.97,.97,.95]);B(cx,7.2,cz+7.8,22,.6,1.8,[.97,.97,.95]);
  B(cx,1.4,cz+7.05,3,2.8,.12,[.3,.15,.08]);for(let k=0;k<3;k++)B(cx,.1+k*.1,cz+8.6+(2-k)*.7,6,.2,.7,[.8,.8,.75]);
  for(const k of[-6,6])G(cx+k,4,cz+7.06,2,2.2,.1,[.5,.7,.9]);
  B(cx,.6,cz+14,6,.8,6,[.7,.7,.7]);G(cx,1.4,cz+14,1.2,1.2,1.2,[.4,.7,.95]);
  for(const k of[-1,1]){B(cx+k*9,.9,cz+17,.5,1.8,.5,[.2,.2,.22]);G(cx+k*9,1.9,cz+17,.7,.2,.7,[.9,.8,.3]);B(cx+k*14,.6,cz+17,8,1.2,.3,[.85,.85,.8]);rect(cx+k*14,cz+17,4,.15,1.2,'#bbb')}
  for(const [dx,dz] of[[-16,-12],[16,-12],[-16,4],[16,4]])tree(cx+dx,cz+dz)};
 const marea=(cx,cz)=>{B(cx,.2,cz,s-6,.02,s-6,[.1,.2,.25]);
  for(let k=0;k<6;k++)for(let m=0;m<3;m++)G(cx-10+k*4,.26,cz+9+m*3,3.4,.04,2.6,(k+m)%2?[.1,.7,.8]:[.9,.95,.95]);
  B(cx,3.25,cz,20,6.5,14,[.1,.42,.5]);rect(cx,cz,10,7,6.5,'#2fb8c9');G(cx,6.7,cz,20.8,.4,14.8,[.2,.85,.95]);
  for(let k=0;k<5;k++)G(cx-8+k*4,3.4,cz+7.06,.6,5.2,.1,k%2?[.9,.95,.95]:[.2,.85,.95]);
  B(cx,1.4,cz+7.07,3.2,2.8,.12,[.04,.06,.08]);B(cx,3.2,cz+7.6,5.6,.3,1.4,[.9,.95,.95]);
  G(cx-2,8.5,cz+1,6,2,.7,[.2,.85,.95]);G(cx+3,9.4,cz+1,3,2.4,.7,[.2,.85,.95]);G(cx+5.8,8.8,cz+1,2,1.2,.7,[.9,.95,.95])};
 const puerto=(cx,cz)=>{B(cx,.2,cz,s-2,.02,s-2,[.22,.23,.25]);
  B(cx,3.5,cz-8,20,7,12,[.45,.47,.5]);rect(cx,cz-8,10,6,7,'#9aa0a8');B(cx,7.2,cz-8,20.6,.4,12.6,[.3,.32,.35]);B(cx,1.6,cz-1.9,6,3.2,.12,[.9,.7,.1]);
  const cc=[[.7,.15,.12],[.15,.35,.7],[.15,.55,.3],[.8,.55,.1]];
  [[-14,6],[-7,6],[0,6],[7,6],[14,6],[-14,12],[-7,12],[7,12]].forEach(([dx,dz],k)=>{B(cx+dx,1.3,cz+dz,6,2.6,2.4,cc[k%4]);rect(cx+dx,cz+dz,3,1.2,2.6,'#9aa0a8')});
  B(cx+16,7,cz-10,.8,14,.8,[.9,.7,.1]);B(cx+10,14,cz-10,14,.8,.8,[.9,.7,.1]);G(cx+16,14.6,cz-10,.8,.5,.8,[.9,.2,.2]);
  for(let k=0;k<14;k++){B(cx-19,.8,cz-18+k*3,.2,1.6,.2,[.5,.5,.5]);B(cx+19,.8,cz-18+k*3,.2,1.6,.2,[.5,.5,.5])}};
 const mirador=(cx,cz)=>{B(cx,.2,cz,s-2,.02,s-2,[.3,.6,.3]);B(cx,.2,cz,12,.1,12,[.75,.7,.6]);
  for(const [dx,dz] of[[-3,-3],[3,-3],[-3,3],[3,3]])B(cx+dx,1.8,cz+dz,.4,3.6,.4,[.9,.9,.9]);B(cx,3.8,cz,8.5,.4,8.5,[.7,.2,.2]);B(cx,4.4,cz,4,.8,4,[.7,.2,.2]);
  B(cx,.5,cz-2,5,.5,.8,[.4,.25,.1]);for(let k=0;k<18;k++){const an=k/18*TAU;tree(cx+Math.cos(an)*16,cz+Math.sin(an)*16)}
  B(cx,.6,cz+19,36,1.2,.4,[.7,.7,.65]);rect(cx,cz+19,18,.2,1.2,'#999')};
 const hotel=(cx,cz)=>{B(cx,.2,cz,s-4,.02,s-4,[.5,.5,.52]);
  B(cx,2.5,cz+2,26,5,12,[.86,.8,.68]);rect(cx,cz+2,13,6,5,'#e8d27a');B(cx,5.2,cz+2,27,.4,13,[.6,.5,.3]);
  B(cx,21,cz-3,14,42,12,[.78,.72,.52]);rect(cx,cz-3,7,6,42,'#e8d27a');
  for(let y=8;y<41;y+=4){G(cx,y,cz+3.05,12.6,1.4,.1,[.5,.7,.85]);G(cx,y,cz-9.05,12.6,1.4,.1,[.5,.7,.85]);G(cx-7.05,y,cz-3,.1,1.4,10,[.5,.7,.85]);G(cx+7.05,y,cz-3,.1,1.4,10,[.5,.7,.85])}
  G(cx,43.6,cz-3,10,2.4,2,[.95,.8,.3]);B(cx,3,cz+8.6,10,.3,3.4,[.6,.1,.1]);for(const sx of[-4.5,4.5])B(cx+sx,1.5,cz+9.9,.4,3,.4,[.9,.9,.85]);
  B(cx,.26,cz+11,8,.04,6,[.6,.1,.1]);for(const sx of[-1,1])palm(cx+sx*13,cz+14)};
 const plaza=(cx,cz)=>{B(cx,.2,cz,s,.02,s,[.82,.76,.62]);
  B(cx,.4,cz+4,6,.8,6,[.7,.7,.7]);B(cx,.9,cz+4,5,.2,5,[.3,.6,.85]);B(cx,1.8,cz+4,.6,2,.6,[.8,.8,.8]);
  B(cx,6,cz-14,26,12,10,[.9,.85,.7]);rect(cx,cz-14,13,5,12,'#e0b070');B(cx-10,10,cz-14,4,20,4,[.88,.82,.66]);rect(cx-10,cz-14,2,2,20,'#e0b070');B(cx+10,10,cz-14,4,20,4,[.88,.82,.66]);rect(cx+10,cz-14,2,2,20,'#e0b070');
  B(cx,13,cz-14,8,2.4,6,[.7,.45,.28]);B(cx-10,20.5,cz-14,4.6,1.2,4.6,[.7,.45,.28]);B(cx+10,20.5,cz-14,4.6,1.2,4.6,[.7,.45,.28]);G(cx,4,cz-8.9,3,4,.2,[.9,.8,.5]);
  for(const [dx,dz] of[[-12,2],[12,2],[-12,12],[12,12],[0,14],[-6,-4],[6,-4]])palm(cx+dx,cz+dz);
  for(const dx of[-8,8])B(cx+dx,.5,cz+4,3,.5,.8,[.4,.25,.1])};
 const comis=(cx,cz)=>{B(cx,.2,cz,s-4,.02,s-4,[.3,.3,.34]);
  B(cx,3.5,cz-3,20,7,12,[.82,.84,.9]);rect(cx,cz-3,10,6,7,'#4a6ad8');B(cx,7.2,cz-3,20.8,.5,12.8,[.15,.25,.6]);B(cx,4.5,cz+3.05,20.2,1.2,.1,[.15,.25,.6]);
  G(cx,8.4,cz-3,6,1.6,.6,[.2,.4,.95]);B(cx+12,5,cz+4,.2,10,.2,[.8,.8,.8]);B(cx+13.2,9,cz+4,2.2,1.3,.1,[.9,.2,.2]);
  for(let k=0;k<6;k++)B(cx-12+k*5,.19,cz+11,.2,.02,5,[1,1,1])};
 const univ=(cx,cz)=>{B(cx,.2,cz,s,.02,s,[.45,.6,.4]);
  B(cx,4.5,cz-12,30,9,8,[.72,.55,.45]);rect(cx,cz-12,15,4,9,'#b88adf');B(cx-13,4.5,cz,6,9,16,[.72,.55,.45]);rect(cx-13,cz,3,8,9,'#b88adf');B(cx+13,4.5,cz,6,9,16,[.72,.55,.45]);rect(cx+13,cz,3,8,9,'#b88adf');
  B(cx,12,cz-12,4,18,4,[.8,.7,.55]);rect(cx,cz-12,2,2,18,'#b88adf');G(cx,18,cz-9.9,2.4,2.4,.2,[.95,.9,.7]);
  for(const y of[3,6.5]){G(cx,y,cz-7.95,24,1.2,.1,[.5,.7,.85])}
  B(cx,.26,cz+2,14,.05,14,[.3,.62,.3]);for(const [dx,dz] of[[-6,-4],[6,-4],[-6,8],[6,8]])tree(cx+dx,cz+dz)};
 const mercado=(cx,cz)=>{B(cx,.2,cz,s-2,.02,s-2,[.6,.55,.45]);
  const AW=[[.9,.25,.2],[.2,.55,.85],[.95,.8,.2],[.3,.7,.35],[.85,.4,.7]];
  for(let u=0;u<5;u++)for(let v=0;v<3;v++){const x=cx-16+u*8,z=cz-6+v*8,c=AW[(u+v)%5];
   rect(x,z,1.5,1,.9,'#e86a3a');B(x,.9,z,3,.12,2,[.6,.4,.2]);B(x,2.6,z,3.4,.2,2.6,c);for(const dx of[-1.5,1.5])B(x+dx,1.4,z-1,.1,2.8,.1,[.3,.3,.3]);
   B(x-.8,1.1,z,.7,.3,.7,pick([[.9,.3,.2],[.95,.8,.2],[.4,.7,.3]]));B(x+.7,1.1,z,.7,.3,.7,pick([[.9,.5,.2],[.5,.8,.3],[.8,.3,.5]]))}
  B(cx,3,cz-17,36,6,4,[.78,.6,.42]);rect(cx,cz-17,18,2,6,'#e86a3a');for(let k=0;k<8;k++)G(cx-14+k*4,3.2,cz-14.95,1.8,1.4,.1,[.5,.7,.85])};
 const taveo=(cx,cz)=>{ // Casa de Taveo: minimalista, blanca, con franjas de cristal y terraza. Sin colores llamativos
  B(cx,.2,cz,s-4,.02,s-4,[.9,.92,.9]);
  B(cx,8.5,cz,18,17,18,[.96,.96,.97]);rect(cx,cz,9,9,17,'#dfe3e8');
  for(let f=0;f<4;f++)G(cx,4+f*4,cz+9.1,15,.6,.1,[.55,.75,.9]);   // franjas de ventana
  B(cx,17.4,cz,19,.5,19,[.85,.86,.88]);                          // losa del techo
  B(cx,.5,cz+13,3,.6,3,[.85,.85,.88]);palm(cx+12,cz+12)};
const vikkingos=(cx,cz)=>{ // Vikkingos: restaurante de lujo en El Golf: piedra clara, cristal y terraza con sombrillas
  B(cx,.2,cz,s-4,.02,s-4,[.5,.6,.45]);
  B(cx,.3,cz+2,24,.5,20,[.93,.9,.84]);
  for(let k=0;k<4;k++){B(cx-9+k*6,2.6,cz+10,.4,5,.4,[.9,.9,.9]);B(cx-9+k*6,5.4,cz+10,3,.3,3,[.95,.25,.3])}
  B(cx,10,cz-4,24,20,18,[.9,.86,.78]);rect(cx,cz-4,12,9,20,'#c8c0b0');
  G(cx,6.5,cz+5.1,20,8,.2,[.85,.95,1]);
  B(cx,20.6,cz-4,25,.6,19,[.7,.55,.2]);
  G(cx,22.4,cz+5.1,15,2.2,.2,[1,.85,.3]);
  B(cx-11,5,cz+4,1.4,10,1.4,[.9,.9,.9]);B(cx+11,5,cz+4,1.4,10,1.4,[.9,.9,.9]);
  palm(cx+12,cz-12);palm(cx-12,cz-12)};
const golf=(cx,cz)=>{B(cx,.2,cz,s-2,.02,s-2,[.3,.68,.32]);
  for(let k=0;k<3;k++)B(cx+rr(-12,12),.26,cz+rr(-12,12),rr(4,7),.08,rr(3,5),[.92,.87,.62]);
  B(cx+8,.3,cz-8,9,.06,6,[.2,.5,.8]);
  for(const [dx,dz] of[[-10,10],[12,6],[0,-12]]){B(cx+dx,1.5,cz+dz,.08,3,.08,[.95,.95,.95]);G(cx+dx+.4,2.7,cz+dz,.8,.5,.05,[.9,.2,.2])}
  for(let k=0;k<5;k++)tree(cx+rr(-17,17),cz+rr(-17,17))};
 // ----- estilo de manzanas por zona -----
 const PAL={0:[[.93,.93,.9],[.85,.88,.9],[.9,.86,.78]],1:[[.9,.8,.7],[.8,.88,.8],[.88,.78,.85],[.85,.85,.7],[.7,.82,.9]],2:[[.65,.35,.3],[.7,.62,.5],[.55,.58,.62],[.75,.7,.6]],
  3:[[.93,.82,.45],[.9,.6,.55],[.65,.8,.88],[.95,.93,.85],[.85,.7,.4]],4:[[.85,.5,.3],[.3,.6,.7],[.8,.75,.3],[.7,.4,.55],[.5,.7,.45]],5:[[.62,.42,.32],[.55,.45,.4],[.7,.55,.4],[.5,.5,.52]],6:[[.94,.86,.7],[.82,.9,.86],[.96,.82,.62],[.72,.86,.92],[.98,.94,.84]]};
 const win=(bx,h,bz,sx,sz)=>{for(let y=3;y<h-1;y+=3.4){G(bx,y,bz+sz/2+.04,sx*.8,1,.08,[.5,.7,.85]);G(bx,y,bz-sz/2-.04,sx*.8,1,.08,[.5,.7,.85])}};
 const house=(bx,bz,sx,sz,h,c,roof,z)=>{B(bx,h/2,bz,sx,h,sz,c);rect(bx,bz,sx/2,sz/2,h,'#6c7889');B(bx,h+.4,bz,sx*1.08,.8,sz*1.08,roof);B(bx,1.1,bz+sz/2+.04,1.2,2,.08,[.25,.17,.1]);
  G(bx-sx*.28,h*.55,bz+sz/2+.04,1.3,1.1,.08,[.5,.7,.85]);G(bx+sx*.28,h*.55,bz+sz/2+.04,1.3,1.1,.08,[.5,.7,.85])};
 const generic=(zn,i,j,x0,z0,cx,cz)=>{const pal=PAL[zn];
  if(zn===0&&(i+j)%3===0)return golf(cx,cz);
  if(zn===6){// Huanchaco: casitas de colores con palmeras, algún corral de arena
   for(let u=0;u<2;u++)for(let v=0;v<2;v++){const bx=x0+2+u*21+7.5,bz=z0+2+v*21+7.5,c=pick(pal),sx=rr(9,12),sz=rr(9,12),h=rr(3.5,5.5);
    if(rnd()<.2){B(bx,.5,bz,sx,1,sz,[.92,.86,.76]);continue}
    house(bx,bz,sx,sz,h,c,[.55,.3,.2]);palm(bx+sx*.5+2.5,bz-sz*.45);if(rnd()<.5)palm(bx-sx*.5-2.5,bz+sz*.45)}
   return}
  if(zn===4||zn===5){// manzanas densas: 3x3 construcciones pequeñas
   for(let u=0;u<3;u++)for(let v=0;v<3;v++){const bx=x0+2+u*12.7+6.2,bz=z0+2+v*12.7+6.2,sx=rr(8,11),sz=rr(8,11),c=pick(pal);
    if(zn===5){const h=rr(3,5);house(bx,bz,sx,sz,h,c,[.4,.3,.25]);if(rnd()<.4)B(bx+sx*.2,h+1.5,bz,1.6,2,1.6,[.2,.3,.6]);if(rnd()<.35)B(bx,h+.9,bz-sz*.3,.2,2,.2,[.5,.3,.2])}
    else{const h=rr(5,10);B(bx,h/2,bz,sx,h,sz,c);rect(bx,bz,sx/2,sz/2,h,'#6c7889');B(bx,h+.3,bz,sx+.4,.6,sz+.4,[.3,.3,.32]);win(bx,h,bz,sx,sz);
     B(bx,2.2,bz+sz/2+.9,sx*.9,.2,1.8,pick([[.9,.25,.2],[.2,.55,.85],[.95,.8,.2]]))}}return}
  for(let u=0;u<2;u++)for(let v=0;v<2;v++){const bx=x0+2+u*21+7.5,bz=z0+2+v*21+7.5,c=pick(pal);
   if(zn===3){const h=rr(5,9),sx=rr(15,18),sz=rr(15,18);B(bx,h/2,bz,sx,h,sz,c);rect(bx,bz,sx/2,sz/2,h,'#c9a060');B(bx,h+.4,bz,sx+.6,.8,sz+.6,[.55,.25,.18]);
    B(bx,h-1.6,bz+sz/2+.5,sx*.85,.2,1,[.4,.25,.12]);B(bx,h-2.4,bz+sz/2+.9,sx*.85,.9,.1,[.4,.25,.12]);win(bx,h,bz,sx,sz);B(bx,1.4,bz+sz/2+.05,2,2.8,.1,[.35,.2,.1]);continue}
   if(zn===0){if(rnd()<.55){const sx=rr(11,15),sz=rr(11,15),h=rr(4,7);house(bx,bz,sx,sz,h,c,[.95,.95,.95]);B(bx+sx*.4,.15,bz-sz*.9,6,.1,4,[.3,.7,.9])}
    else{const h=rr(14,32),sx=14,sz=14;B(bx,h/2,bz,sx,h,sz,[.5,.65,.78]);rect(bx,bz,sx/2,sz/2,h,'#4f6a80');win(bx,h,bz,sx,sz)}continue}
   if(zn===1){const sx=rr(9,13),sz=rr(9,13),h=rr(3.5,6);house(bx,bz,sx,sz,h,c,[.55,.2,.15]);tree(bx+sx*.5+2,bz-sz*.4);continue}
   if(rnd()<.45){const sx=rr(8,12),sz=rr(8,12),h=rr(3.5,6);house(bx,bz,sx,sz,h,c,[.45,.18,.15])}
   else{const h=rr(8,18),sx=15,sz=15;B(bx,h/2,bz,sx,h,sz,c);rect(bx,bz,sx/2,sz/2,h,'#4f5f74');B(bx,h+.3,bz,sx+.6,.6,sz+.6,[.3,.3,.32]);win(bx,h,bz,sx,sz)}}};
 // ----- muelle de Huanchaco: tablado que entra al mar por la brecha del malecón -----
 const muelle=(cx,cz)=>{E.top9(fl,-15,.26,cz,30,.1,6,[.55,.38,.2]);
  for(let k=0;k<6;k++){B(-3-k*5,.05,cz-2.5,.3,.5,.3,[.35,.25,.15]);B(-3-k*5,.05,cz+2.5,.3,.5,.3,[.35,.25,.15])}
  B(-24,1.3,cz,2.6,2.6,2.6,[.9,.25,.2]);rect(-24,cz,1.3,1.3,2.6,'#b03a2e');B(-24,2.9,cz,3.2,.4,3.2,[.95,.9,.8]);
  palm(cx+8,cz-12);palm(cx+8,cz+12)};
 // ----- manzanas -----
 const SP={'0,1':muelle,'2,2':'park','2,4':paint,'1,5':cevi,'1,7':mirador,'3,8':univ,'3,9':'lot','5,5':club,'6,7':plaza,'6,4':comis,'10,6':mercado,'9,8':marea,'2,11':puerto,'1,1':casa,'1,3':taveo,'10,2':hotel,'11,3':mansion,'10,4':vikkingos};
 const ZB=[[.72,.73,.68],[.64,.6,.52],[.64,.6,.52],[.64,.6,.52],[.64,.6,.52],[.5,.46,.4],[.86,.8,.6]];
 for(let i=0;i<N;i++)for(let j=0;j<N;j++){
  if(!isLand(i,j))continue;
  const x0=i*P+W/2,z0=j*P+W/2,cx=x0+s/2,cz=z0+s/2,key=i+','+j,zn=zoneOf(i,j),sp=SP[key];
  B(cx,.08,cz,s,.16,s,ZB[zn]);if(isStad(i,j))continue;   // el estadio se dibuja aparte
  // aceras: franjas claras junto a cada calle
  E.top9(fl,i*P+6.6,.17,j*P+P/2,1.2,.04,P-12,CURB_C);E.top9(fl,(i+1)*P-6.6,.17,j*P+P/2,1.2,.04,P-12,CURB_C);
  E.top9(fl,i*P+P/2,.17,j*P+6.6,P-12,.04,1.2,CURB_C);E.top9(fl,i*P+P/2,.17,(j+1)*P-6.6,P-12,.04,1.2,CURB_C);
  for(const [lx,lz] of [[1,1],[s-1,1],[1,s-1],[s-1,s-1]]){B(x0+lx,3,z0+lz,.2,6,.2,[.3,.3,.3]);G(x0+lx,6.1,z0+lz,.9,.2,.9,[1,.9,.5])}
  if(sp==='park'){B(cx,.2,cz,s-4,.02,s-4,[.25,.6,.25]);B(cx,.2,cz,10,.1,10,[.7,.7,.6]);
   for(let k=0;k<16;k++){const tx=cx+rr(-17,17),tz=cz+rr(-17,17);if(Math.hypot(tx-cx,tz-cz)<7)continue;tree(tx,tz)}}
  else if(sp==='lot'){B(cx,.2,cz,s-4,.02,s-4,[.15,.15,.17]);
   for(let k=0;k<6;k++){const px=cx-15+k*6;B(px-3,.24,cz-9,.2,.04,6,[.9,.9,.9]);spots.push([px,cz-9,0]);spots.push([px,cz+9,Math.PI])}}
  else if(sp)sp(cx,cz);
  else generic(zn,i,j,x0,z0,cx,cz)}
 // carteles con texto (se proyectan en pantalla)
 const sg=(k,y,t,col,d,h,dz,sub)=>{const c=LOC[k].c;SIGNS.push({x:c[0],y,z:c[1]+(dz||0),t,sub,col,d,h})};
 sg('club',10.2,'CLUB NEÓN','#ff5fb0',120,1.5,1);sg('hotel',46,'HOTEL IMPERIAL','#ffe27a',300,3,-3);sg('ceviche',6.8,'CEVICHERÍA EL LOBO','#ffb04a',90,1.1,-2);
 sg('paint',9.6,'PINTURA EXPRESS','#ffe27a',100,1.3,0);sg('marea',11,'DISCOTECA MAREA','#4fe8ff',110,1.4,1);
 sg('taveo',17.6,'CASA DE TAVEO','#eef4ff',200,1.4,9,'Huanchaco');
 sg('vikkingos',22.4,'VIKKINGOS','#f2c14e',170,1.6,-3,'Restaurante de lujo');
 // ----- Estadio Mansiche: concreto, cuatro tribunas, pista atlética, torres de luz y césped natural -----
 {const FX0=253,FX1=423,FZ0=550,FZ1=646,TX0=243,TX1=433,TZ0=540,TZ1=656,CON=[.62,.62,.6],SEATS=[[.2,.35,.72],[.92,.92,.9],[.85,.22,.2],[.2,.6,.3]];
  E.top9(fl,(TX0+TX1)/2,.2,(TZ0+TZ1)/2,TX1-TX0,.02,TZ1-TZ0,[.7,.32,.22]);          // pista atlética (base)
  E.top9(fl,(FX0+FX1)/2,.21,(FZ0+FZ1)/2,FX1-FX0,.02,FZ1-FZ0,[.22,.62,.25]);        // césped natural
  E.top9(fl,338,.23,598,.5,.02,FZ1-FZ0,[.96,.96,.94]);                              // línea de mitad de cancha
  E.top9(fl,(TX0+TX1)/2,.23,(TZ0+TZ1)/2,TX1-TX0-14,.02,.4,[.96,.96,.94]);
  const row=(x,z,sx,sz,h,c)=>{B(x,h/2,z,sx,h,sz,CON);B(x,h+.06,z,sx*.9,.12,sz*.9,c);rect(x,z,sx/2,sz/2,h,'#6c6f73')};
  for(let r=0;r<6;r++){const h=1.5+r*1.6,xw=241-r*4-2,xe=435+r*4+2,c=SEATS[r%4];
   row(xw,557,4,58,h,c);row(xw,639,4,58,h,c);     // tribuna oeste (con la entrada en medio)
   row(xe,598,4,140,h,c)};                          // tribuna este
  for(let r=0;r<4;r++){const h=1.5+r*1.6,zn=527.5+(3-r)*3,zs=667.5-(3-r)*3,c=SEATS[(r+1)%4];
   row(338,zn,190,3,h,c);row(338,zs,190,3,h,c)};   // tribunas norte y sur
  for(const [x,z] of [[226,530],[450,530],[226,666],[450,666]]){B(x,20,z,2.2,40,2.2,[.55,.55,.58]);G(x,40.6,z,7,1.6,7,[1,1,.85])}}   // torres de iluminación
 stat=E.makeStatic(a);statGlow=E.makeStatic(g);statFlat=E.makeStatic(fl);statFlatGlow=E.makeStatic(gf);statRoad=E.makeStatic(rd);buildGrid()}
