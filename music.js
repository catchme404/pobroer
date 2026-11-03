'use strict';
// TrujiYork · creador: catchme404
// ============== MÚSICA DEL CLUB ==============
// Pon tus canciones en la carpeta musica/ con los nombres musica_1.mp3, musica_2.mp3 ... hasta musica_15.mp3.
// Suenan solo cerca del Club Neón (más fuerte dentro). Si falta un archivo se salta al siguiente; si no hay ninguno, no suena nada.
const Music={MAX:15,i:0,fails:0,el:null,dead:false,ready:false,
 init(){if(this.ready||typeof Audio==='undefined')return;this.ready=true;const a=this.el=new Audio();a.preload='auto';a.loop=false;
  a.addEventListener('error',()=>this.skip());a.addEventListener('ended',()=>this.skip(true));this.load()},
 load(){this.el.src='musica/musica_'+(this.i+1)+'.mp3'},
 skip(ok){if(!ok)this.fails++;else this.fails=0;if(this.fails>=this.MAX){this.dead=true;return}this.i=(this.i+1)%this.MAX;this.load();if(this.want)this.play()},
 play(){const p=this.el.play();if(p&&p.catch)p.catch(()=>{})},
 // d: distancia al club; inside: dentro del local
 update(){if(!this.ready||this.dead)return;const c=LOC.club.c,v=cur||pl,d=Math.hypot(v.x-c[0],v.z-c[1]),
  inside=Math.abs(v.x-c[0])<11&&Math.abs(v.z-c[1])<8,vol=inside?1:clamp(1-(d-12)/38,0,1)*.4;
  this.want=vol>0.01&&S.mode==='play'&&!S.panic;
  this.el.volume=clamp(vol*S.vol*1.4,0,1);
  if(this.want&&this.el.paused)this.play();else if(!this.want&&!this.el.paused)this.el.pause()},
 stop(){if(this.el&&!this.el.paused)this.el.pause();this.want=false}};
