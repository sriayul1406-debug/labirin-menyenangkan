'use strict';
const $=s=>document.querySelector(s);
const PRAISE=['Hebat sekali!','Jawabanmu benar!','Bagus sekali!'];
let ST={lvl:0,err:0,rescued:0,stars:[0,0,0],paused:false,busy:false,tok:0,instr:'',hp:0,lock:false},M=null,HELD=[];
const later=(f,ms)=>{const t=ST.tok;return setTimeout(()=>{if(t===ST.tok)f()},ms)};
const modal=(id,h)=>{const m=$(id);m.innerHTML=h?`<div class="dlg">${h}</div>`:'';m.classList.toggle('show',!!h)};
function go(h,cls='field'){ST.tok++;ST.busy=false;ST.paused=false;M=null;stopSpeak();modal('#modal');modal('#modal2');const s=$('#stage');s.className=cls;s.innerHTML=h}
function hud(show,n){$('#hud').classList.toggle('hide',!show);if(n)$('#lvl').textContent='Level '+n;
 $('#prog').innerHTML=px('kelinci',ST.rescued?null:{w:'#aaa',p:'#999',k:'#555'})+[1,2,3].map(i=>`<i class="pip ${ST.stars[i-1]?'on':''}"></i>`).join('')}
function confetti(){for(let i=0;i<22;i++){const s=document.createElement('span');s.className='cf';s.innerHTML=px('bintang');
 s.style.left=Math.random()*100+'vw';s.style.animationDelay=Math.random()*.8+'s';document.body.append(s);setTimeout(()=>s.remove(),3800)}}
/* tombol Lanjut: aktif setelah narasi selesai, sekali tekan saja */
function nextBtn(label,fn){const b=$('#nx');b.textContent=label;b.disabled=true;b.onclick=()=>{b.disabled=true;fn()};return()=>later(()=>{b.disabled=false},700)}

/* ===== COVER + PROLOG ===== */
function cover(){
 hud(0);
 go(`<div class="cover"><h1>MISI PENYELAMATAN</h1><h2>di Labirin Ajaib</h2>
 <div class="scene big">${px('semak')}${px('monyet',null,'an')}${px('pintu')}${px('kelinci',null,'an a2')}${px('semak')}</div>
 <div class="story" id="story">&nbsp;</div>
 <div><button class="big green" id="bS">Mulai Petualangan</button><button class="big blue" id="bH">Dengarkan Cerita Lagi</button><button class="big orange" id="bP">Petunjuk Bermain</button></div></div>`);
 $('#bS').onclick=()=>{ST.rescued=0;ST.stars=[0,0,0];A.sfx('tick');titleCard(1)};$('#bH').onclick=tell;$('#bP').onclick=help;
 if(!A.ctx){modal('#modal',`<h2>Halo, teman-teman!</h2><div class="big">${px('monyet',null,'an')}</div><button class="big green" id="bG">Ketuk untuk mulai</button>`);
  $('#bG').onclick=()=>{A.init();modal('#modal');tell()}}
 else tell();
}
function tell(){
 const S=['Halo, teman-teman! Aku Momo si monyet.','Kelinci sedang terjebak di dalam Labirin Ajaib dan membutuhkan pertolongan.','Ayo bantu Momo mencari jalan, menjawab pertanyaan, dan menyelamatkan kelinci!','Ayo, kita mulai petualangannya!'];
 const box=$('#story');box.textContent='';let i=0;
 (function nx(){if(i>=S.length||!$('#story'))return;const p=document.createElement('span');p.textContent=S[i]+' ';box.append(p);speak(S[i++],()=>setTimeout(nx,450))})();
}
function help(){
 modal('#modal2',`<h2>Petunjuk Bermain</h2><div class="help"><p>Tekan panah atau W A S D untuk menjalankan monyet.</p><p>Ketuk gambar yang benar untuk menjawab.</p><p>Kalau salah, tidak apa-apa. Coba lagi ya!</p></div><button class="big green" id="ok">Oke</button>`);
 $('#ok').onclick=()=>{modal('#modal2');stopSpeak()};speak('Tekan tombol panah untuk menjalankan monyet. Ketuk gambar yang benar untuk menjawab. Kalau salah, tidak apa-apa. Coba lagi ya!');
}

/* ===== KARTU LEVEL ===== */
function titleCard(n){
 ST.lvl=n;hud(1,n);
 const T=['','Labirin Sahabat Hewan','Labirin Tantangan Logika','Gelembung Angka'],
 S=['','Level satu. Labirin sahabat hewan. Ayo bantu monyet menemukan kelinci!','Level dua. Labirin tantangan logika. Ayo cari pintu menuju Monster Penjaga!','Level tiga. Ada monster lucu yang menjaga jalan keluar. Ayo kita buat dia pergi dengan gelembung angka!'],
 E=['',px('monyet')+px('kelinci'),px('monyet')+px('kelinci')+px('apel'),px('monyet')+px('monster')];
 go(`<div class="tcard"><div class="scene big">${E[n]}</div><h1>Level ${n}</h1><h2>${T[n]}</h2><button class="big green" id="nx">Main</button></div>`);
 ST.instr=S[n];const en=nextBtn('Main',()=>startLevel(n));speak(S[n],en);
}
function startLevel(n){ST.lvl=n;ST.err=0;hud(1,n);n<3?mazeLevel(n):battle()}

/* ===== LABIRIN ===== */
function mazeLevel(n){
 const g=genMaze(n==1?3:6,n==1?3:5),door=farthest(g);
 go(`<div class="mz"><canvas id="cv"></canvas><div class="dpad"><button class="up" data-k="u">&#9650;</button><button class="lf" data-k="l">&#9664;</button><button class="rt" data-k="r">&#9654;</button><button class="dn" data-k="d">&#9660;</button></div></div>`);
 M={tok:ST.tok,lvl:n,g,R:g.length,C:g[0].length,x:1,y:1,from:[1,1],to:[1,1],t:1,face:1,door,open:false,doorA:1,fr:{from:[1,1],to:[1,1]},T:24,quiz:false,last:0};
 layout();
 document.querySelectorAll('.dpad button').forEach(b=>{const k=b.dataset.k,off=()=>{HELD=HELD.filter(x=>x!==k)};
  b.onpointerdown=e=>{e.preventDefault();if(!HELD.includes(k))HELD.push(k)};b.onpointerup=b.onpointerleave=b.onpointercancel=off});
 ST.instr=n==1?'Tekan tombol panah untuk berjalan. Ayo selamatkan kelinci!':'Ayo cari pintu menuju Monster Penjaga! Jawab pertanyaan untuk membuka pintu.';
 speak(ST.instr);requestAnimationFrame(loop);
}
function layout(){
 if(!M||!$('#cv'))return;const land=matchMedia('(orientation:landscape) and (max-height:560px)').matches;
 const k=Math.max(1,Math.min(5,Math.floor(Math.min((innerWidth-(land?260:24))/M.C,(innerHeight-(land?84:300))/M.R)/12)));
 M.T=12*k;const c=$('#cv');c.width=M.C*M.T;c.height=M.R*M.T;
}
addEventListener('resize',layout);
const DIRS={u:[0,-1],d:[0,1],l:[-1,0],r:[1,0]},KEY={ArrowUp:'u',w:'u',W:'u',ArrowDown:'d',s:'d',S:'d',ArrowLeft:'l',a:'l',A:'l',ArrowRight:'r',d:'r',D:'r'};
addEventListener('keydown',e=>{const k=KEY[e.key];if(!k)return;e.preventDefault();if(!HELD.includes(k))HELD.push(k)});
addEventListener('keyup',e=>{const k=KEY[e.key];if(k)HELD=HELD.filter(x=>x!==k)});
addEventListener('blur',()=>HELD=[]);
function loop(ts){if(!M||M.tok!==ST.tok)return;const dt=Math.min(.05,(ts-M.last)/1000||0);M.last=ts;update(dt);draw(ts);requestAnimationFrame(loop)}
function update(dt){
 if(M.opening){M.doorA=Math.max(0,M.doorA-dt*1.2)}
 if(M.t<1){M.t=Math.min(1,M.t+dt*7);if(M.t>=1){M.x=M.to[0];M.y=M.to[1];arrive()}}
 if(M.t>=1&&!ST.busy&&!ST.paused&&HELD.length)tryMove(HELD[HELD.length-1]);
}
function tryMove(k){
 const[dx,dy]=DIRS[k],nx=M.x+dx,ny=M.y+dy;if(dx)M.face=dx;
 if(M.g[ny][nx]===1||(!M.open&&nx==M.door[0]&&ny==M.door[1])){if(!M.bumped){A.sfx('bump');M.bumped=1;setTimeout(()=>M&&(M.bumped=0),300)}return}
 M.fr.from=M.fr.to;M.fr.to=[M.x,M.y];M.from=[M.x,M.y];M.to=[nx,ny];M.t=0;A.sfx('step');
}
function arrive(){
 if(!M.open&&!M.quiz&&Math.abs(M.x-M.door[0])+Math.abs(M.y-M.door[1])==1){
  M.quiz=true;ST.busy=true;A.sfx('tick');
  quiz(pickQuiz(M.lvl),()=>{M.open=M.opening=true;A.sfx('door');speak('Pintu terbuka!');later(celebrate,1700)});
 }
}
function draw(ts){
 const x=$('#cv').getContext('2d'),T=M.T;x.imageSmoothingEnabled=false;
 for(let j=0;j<M.R;j++)for(let i=0;i<M.C;i++)x.drawImage(M.g[j][i]?cv('semak'):pathTile(),i*T,j*T,T,T);
 const[dx,dy]=M.door,hop=M.open?Math.abs(Math.sin(ts/180))*T*.2:0;
 if(M.lvl==1)x.drawImage(cv('kelinci'),dx*T,dy*T-hop,T,T);
 if(M.doorA>0){x.globalAlpha=M.doorA;x.drawImage(cv('pintu'),dx*T,dy*T,T,T);x.globalAlpha=1}
 const L=(a,b)=>a+(b-a)*M.t,bob=M.t<1?Math.abs(Math.sin(M.t*Math.PI))*T*.15:0;
 if(M.lvl==2&&ST.rescued)x.drawImage(cv('kelinci'),L(M.fr.from[0],M.fr.to[0])*T,L(M.fr.from[1],M.fr.to[1])*T-bob,T,T);
 const px_=L(M.from[0],M.to[0])*T,py=L(M.from[1],M.to[1])*T-bob;
 x.save();if(M.face<0){x.translate(px_+T,py);x.scale(-1,1);x.drawImage(cv('monyet'),0,0,T,T)}else x.drawImage(cv('monyet'),px_,py,T,T);x.restore();
}
function celebrate(){
 ST.busy=true;const l1=M.lvl==1;if(l1)ST.rescued=1;hud(1,ST.lvl);A.sfx('win');confetti();
 const say=l1?'Kamu berhasil menyelamatkan kelinci!':'Pintu terbuka! Jalan menuju Monster Penjaga sudah terbuka!';
 modal('#modal',`<div class="scene big">${px('monyet',null,'an')}${px('kelinci',null,'an a2')}</div><h2>${say}</h2><button class="big green" id="nx">Lanjut</button>`);
 const en=nextBtn('Lanjut',()=>{modal('#modal');reward()});speak(say,en);
}

/* ===== KUIS ===== */
function quiz(qs,done){let i=0;(function nx(){if(i>=qs.length){modal('#modal');return done()}ask(qs[i++],nx)})()}
function ask(q,ok){
 const o=shuf(q.o);ST.instr=q.say;
 modal('#modal',`<div class="qv">${q.show||''}</div><p class="qt">${q.say}</p><div class="opts">${o.map((x,j)=>`<button class="opt" data-j="${j}">${x.h}</button>`).join('')}</div>`);
 speak(q.say);let lock=false;
 document.querySelectorAll('.opt').forEach(b=>b.onclick=()=>{
  if(lock||ST.paused)return;
  if(o[+b.dataset.j].ok){lock=true;b.classList.add('good');A.sfx('right');speak(rnd(PRAISE),()=>later(ok,700))}
  else{ST.err++;A.sfx('wrong');b.classList.add('shake');setTimeout(()=>b.classList.remove('shake'),600);speak('Coba lagi ya!')}});
}

/* ===== LEVEL 3: GELEMBUNG ANGKA ===== */
function battle(){
 ST.hp=CFG.vidaMonster;ST.round=0;ST.lock=false;ST.pool=pickSums(ST.hp);
 go(`<div class="arena"><div class="qtop" id="qt"></div><div class="hearts" id="hp"></div><div id="mon">${px('monster')}</div><div id="bub"></div></div>`);
 hearts();round();
}
const hearts=()=>$('#hp').innerHTML=Array.from({length:CFG.vidaMonster},(_,i)=>px('hati',i<ST.hp?null:{r:'#cfc8b8',H:'#e0dacb',R:'#cfc8b8'})).join('');
function round(){
 const[a,b]=ST.pool[ST.round++],s=a+b,W=['','satu','dua','tiga','empat','lima'];ST.lock=false;
 $('#qt').innerHTML=`${px('apel').repeat(a)}<b>+</b>${px('apel').repeat(b)}<b>=</b><b>?</b>`;
 ST.instr=`${W[a]} tambah ${W[b]} sama dengan berapa?`;speak(ST.instr);
 const o=new Set([s]);while(o.size<4){const v=1+Math.random()*10|0;o.add(v)}
 $('#bub').innerHTML=shuf([...o]).map((v,i)=>`<button class="bub" style="--d:${i*.4}s"><span>${v}</span></button>`).join('');
 document.querySelectorAll('.bub').forEach(b=>b.onclick=()=>pick(b,+b.textContent===s));
}
function pick(b,ok){
 if(ST.lock||ST.paused)return;
 if(!ok){ST.err++;A.sfx('wrong');b.classList.add('shake');setTimeout(()=>b.classList.remove('shake'),600);speak('Coba lagi ya!');return}
 ST.lock=true;A.sfx('right');
 const br=b.getBoundingClientRect(),mr=$('#mon').getBoundingClientRect();
 b.style.transition='transform .8s ease-in';
 b.style.transform=`translate(${mr.left+mr.width/2-br.left-br.width/2}px,${mr.top+mr.height/2-br.top-br.height/2}px) scale(.4)`;
 later(()=>{b.remove();hit()},800);
}
function hit(){
 ST.hp--;hearts();A.sfx('boing');A.sfx('laugh');const m=$('#mon');m.classList.add('hit');m.innerHTML=px('monsterTawa');
 speak(ST.hp?rnd(PRAISE):'Hahaha! Monsternya pergi!');
 later(()=>{m.classList.remove('hit');m.innerHTML=px('monster');ST.hp>0?round():vanish()},2200);
}
function vanish(){
 $('#mon').classList.add('bye');A.sfx('pop');$('#bub').innerHTML='';
 later(()=>{go(`<div class="rew"><div class="run scene big">${px('monyet')}${px('kelinci')}</div><h1>Kita berhasil keluar dari labirin!</h1><button class="big green" id="nx">Lanjut</button></div>`);
  hud(1,3);A.sfx('win');confetti();const en=nextBtn('Lanjut',reward);
  speak('Hore! Monsternya sudah pergi. Kita berhasil keluar dari labirin!',en)},1600);
}

/* ===== PENGHARGAAN ===== */
function reward(){
 const n=ST.lvl,st=ST.err<=CFG.bintang3Maks?3:ST.err<=CFG.bintang2Maks?2:1;ST.stars[n-1]=st;hud(1,n);
 go(`<div class="rew"><h1>Level ${n} Selesai!</h1><div class="stars">${[0,1,2].map(()=>`<span class="sl">${px('bintang',{y:'#d8d2c0'})}<span class="g">${px('bintang')}</span></span>`).join('')}</div>
  <p class="msg">Hebat! Kamu berhasil menyelesaikan level ini!</p><button class="big green" id="nx">Lanjut</button></div>`);
 const el=document.querySelectorAll('.sl .g'),en=nextBtn('Lanjut',()=>n<3?titleCard(n+1):final());
 for(let i=0;i<st;i++)later(()=>{el[i].classList.add('on');A.sfx('star')},900*(i+1));
 later(()=>{A.sfx('clap');speak(n<3?'Hebat sekali! Kamu berhasil menyelesaikan level ini!':'Selamat! Kamu berhasil menyelesaikan permainan!',en)},900*st+700);
}
function final(){
 hud(1,3);go(`<div class="rew"><h1>Selamat! Kamu hebat!</h1><div class="scene big">${px('monyet',null,'an')}${px('kelinci',null,'an a2')}${px('monster',null,'an a3')}</div>
  <p class="msg">Total bintangmu: ${ST.stars.reduce((a,b)=>a+b,0)}</p>
  <div><button class="big green" id="ag">Main Lagi</button><button class="big orange" id="hm">Menu Utama</button></div></div>`);
 A.sfx('win');A.sfx('clap');confetti();speak('Selamat! Kamu berhasil menyelesaikan permainan!');
 $('#ag').onclick=()=>{ST.rescued=0;ST.stars=[0,0,0];titleCard(1)};$('#hm').onclick=cover;
}

/* ===== TOMBOL ATAS ===== */
document.addEventListener('click',e=>{if(e.target.closest('button'))A.sfx('tick')});
$('#bHome').onclick=cover;
$('#bRep').onclick=()=>speak(ST.instr);
$('#bPause').onclick=()=>{ST.paused=true;HELD=[];stopSpeak();
 modal('#modal2','<h2>Permainan dijeda</h2><button class="big green" id="rs">Lanjut Main</button><button class="big orange" id="hm2">Menu Utama</button>');
 $('#rs').onclick=()=>{ST.paused=false;modal('#modal2')};$('#hm2').onclick=cover};
$('#bSet').onclick=()=>{
 modal('#modal2',`<h2>Suara</h2><input type="range" id="vol" min="0" max="1" step=".1" value="${A.vol}" style="width:70vw;max-width:360px;height:40px"><br>
  <button class="big blue" id="mu">${A.on?'Musik: Nyala':'Musik: Mati'}</button><br><button class="big green" id="ok2">Oke</button>`);
 $('#vol').oninput=e=>A.set(+e.target.value,A.on);
 $('#mu').onclick=e=>{A.set(A.vol,!A.on);e.target.textContent=A.on?'Musik: Nyala':'Musik: Mati'};
 $('#ok2').onclick=()=>modal('#modal2')};
cover();
