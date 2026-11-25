/* Audio: musik hutan, suara alam, efek suara (Web Audio) dan suara bicara Bahasa Indonesia */
const A={ctx:null,vol:.8,on:true,
 init(){if(this.ctx){this.ctx.resume();return}
  const C=window.AudioContext||window.webkitAudioContext;if(!C)return;
  const x=this.ctx=new C();this.m=x.createGain();this.m.connect(x.destination);
  this.bg=x.createGain();this.bg.connect(this.m);this.set(this.vol,this.on);this.wind();this.music();this.birds()},
 set(v,on){this.vol=v;this.on=on;if(!this.ctx)return;this.m.gain.value=v;this.bg.gain.value=on?.35:0},
 t(f,at,d,type='sine',g=.2,to=null,dest){const x=this.ctx;if(!x)return;
  const o=x.createOscillator(),v=x.createGain(),s=x.currentTime+at;o.type=type;o.frequency.setValueAtTime(f,s);
  if(to)o.frequency.exponentialRampToValueAtTime(to,s+d);
  v.gain.setValueAtTime(.0001,s);v.gain.exponentialRampToValueAtTime(g,s+.02);v.gain.exponentialRampToValueAtTime(.0001,s+d);
  o.connect(v);v.connect(dest||this.m);o.start(s);o.stop(s+d+.05)},
 nz(at,d,g,hp,loop,dest){const x=this.ctx,n=Math.floor(x.sampleRate*d),b=x.createBuffer(1,n,x.sampleRate),a=b.getChannelData(0);
  for(let i=0;i<n;i++)a[i]=(Math.random()*2-1)*(loop?1:1-i/n);
  const s=x.createBufferSource(),f=x.createBiquadFilter(),v=x.createGain();
  f.type=loop?'lowpass':'highpass';f.frequency.value=hp;v.gain.value=g;s.buffer=b;s.loop=!!loop;
  s.connect(f);f.connect(v);v.connect(dest||this.m);s.start(x.currentTime+at)},
 wind(){this.nz(0,2,.05,450,true,this.bg)},
 music(){const mel=[262,330,392,330,440,392,330,294,262,330,392,523,440,392,330,294],bas=[131,131,196,196,175,175,196,196];let i=0;
  setInterval(()=>{if(!this.on||this.ctx.state!=='running')return;
   this.t(mel[i%16],0,.55,'triangle',.16,null,this.bg);if(i%2==0)this.t(bas[(i/2|0)%8],0,.9,'sine',.2,null,this.bg);i++},480)},
 birds(){setInterval(()=>{if(!this.on||this.ctx.state!=='running')return;const b=2300+Math.random()*900;
  for(let k=0;k<3;k++)this.t(b+k*150,k*.13,.1,'sine',.07,b+500,this.bg)},3800)},
 sfx(n){if(!this.ctx)return;const T=(...a)=>this.t(...a);
  ({step:()=>T(520,0,.08,'triangle',.12,700),
   bump:()=>T(150,0,.12,'square',.08,100),
   door:()=>[392,494,587,784].forEach((f,i)=>T(f,i*.12,.25,'triangle',.2)),
   win:()=>[523,659,784,1047,784,1047].forEach((f,i)=>T(f,i*.14,.3,'triangle',.22)),
   wrong:()=>{T(330,0,.25,'sine',.15,260);T(262,.2,.3,'sine',.15,200)},
   right:()=>{T(660,0,.15,'triangle',.2);T(880,.12,.25,'triangle',.2)},
   star:()=>T(900,0,.4,'triangle',.25,1500),
   pop:()=>{T(300,0,.3,'sine',.3,1200);T(1200,.3,.1,'sine',.2,200)},
   boing:()=>{T(200,0,.4,'sine',.3,600);T(600,.4,.3,'sine',.2,300)},
   laugh:()=>[500,600,500,600,500].forEach((f,i)=>T(f,.3+i*.12,.1,'square',.07)),
   clap:()=>{for(let i=0;i<14;i++)this.nz(i*.09+Math.random()*.04,.06,.35,1500)}})[n]?.()}
};
let spk=0,voices=[];
const SS='speechSynthesis' in window;
if(SS){const lv=()=>voices=speechSynthesis.getVoices();lv();speechSynthesis.onvoiceschanged=lv}
function stopSpeak(){spk++;if(SS)speechSynthesis.cancel()}
/* speak: membacakan teks; cb dipanggil setelah selesai (tidak dipanggil bila suara dibatalkan) */
function speak(t,cb){stopSpeak();const id=spk;let done=0,tm;
 const fin=()=>{if(done||id!==spk)return;done=1;clearTimeout(tm);cb&&cb()};
 tm=setTimeout(fin,Math.max(2200,t.length*95)+1200);if(!SS)return;
 setTimeout(()=>{if(id!==spk)return;const u=new SpeechSynthesisUtterance(t);u.lang='id-ID';u.rate=.85;u.pitch=1.15;u.volume=A.vol;
  const v=voices.find(v=>/id[-_]ID/i.test(v.lang))||voices.find(v=>/indones/i.test(v.name));if(v)u.voice=v;
  u.onend=fin;u.onerror=fin;speechSynthesis.speak(u)},80)}
