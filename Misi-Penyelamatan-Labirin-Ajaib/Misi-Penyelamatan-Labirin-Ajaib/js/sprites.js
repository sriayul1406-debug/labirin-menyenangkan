/* SPRITE PIXEL ART 12x12 (orisinal). Setiap huruf = satu warna (lihat PAL), '.' = kosong.
   Sprite simetris cukup ditulis separuh kiri (6 huruf); otomatis dicerminkan. */
const PAL={b:'#9a5b2e',B:'#5a3418',t:'#efcf9e',k:'#2a2a2a',w:'#ffffff',r:'#e53935',R:'#a31515',H:'#ff9e9e',s:'#6d4c41',g:'#4fae4f',G:'#2f7d32',h:'#8fd98c',y:'#f9d441',o:'#f08c2a',p:'#f7a8b8',P:'#9b6bd6',Q:'#cdb0f2',m:'#7a2a5a',n:'#8d6e4a'};
const mir=a=>a.map(s=>s+[...s].reverse().join(''));
const DEF={
 monyet:mir(['..bbbb','.bbbbb','ttbttt','ttbtkt','.tbttt','..bttk','...btt','..bbbb','.bbbtt','.bbbtt','..bb..','..kk..']),
 kelinci:mir(['..ww..','..wp..','..wp..','..wwww','.wwwww','.wkwww','.wpwwp','..wwww','..wwww','.wwwww','.wwwww','..pp..']),
 monster:mir(['..y...','..yP..','..PPPP','.PPPPP','.PwwPP','.PwkPP','PPPPPP','PpPPPP','PPmPPP','PPPmmm','.PQQQQ','..PP..']),
 kucing:mir(['.oo...','.ooooo','oooooo','oookoo','oooooo','ooooop','.owwoo','..oooo','.ooooo','oooooo','oooooo','..oo..']),
 anjing:mir(['..nnnn','nnnttt','nnnttt','nnttkt','nntttt','.nttkk','..tttp','..tttp','..nnnn','.nnnnn','.nnnnn','..nn..']),
 ayam:mir(['...rrr','..yyyy','.yyyyy','.ykyyy','.yyyoo','.yyyyr','yyyyyy','yyyyyy','yyyyyy','.yyyyy','..yyyy','...oo.']),
 pintu:mir(['.BBBBB','.Bbbbb','.Bbbbb','.Bbbbb','.Bbbby','.Bbbyy','.Bbbyk','.Bbbyy','.Bbbbb','.Bbbbb','.Bbbbb','BBBBBB']),
 hati:mir(['.rrrr.','rrHrrr','rrrrrr','rrrrrr','.rrrrr','..rrrr','...rrr','....rr','.....r']),
 bintang:mir(['.....y','.....y','....yy','yyyyyy','.yyyyy','..yyyy','...yyy','..yyyy','.yyy..','.yy...']),
 apel:['......s.gg..','.....sggGg..','..rrrsrrrr..','.rHHrrrrrrR.','rrHrrrrrrrrR','rrrrrrrrrrRR','rrrrrrrrrrRR','rrrrrrrrrrRR','.rrrrrrrrRR.','.rrrrrrrRRR.','..rrrrrRRR..','...rrr.RR...'],
 semak:['..gggggggg..','.gggggggggG.','ggghggggggGG','ggggggggGGGG','gghgggggggGG','ggggggGgggGG','gggggggggGGG','gggGgggggGGG','ggggggggGGGG','.GgggggggGG.','.GGGGGGGGGG.','..GGGGGGGG..']
};
DEF.monsterTawa=DEF.monster.map((r,i)=>i==8?'PPmmmmmmmmPP':i==9?'PPPmrrrrmPPP':r);
const SHP={lingkaran:['c','#3f8fe0','#2a62a8'],persegi:['s','#f08c2a','#b5600e'],segitiga:['t','#4fae4f','#2f7d32']};
const COL={merah:['#e53935','#a31515'],biru:['#3f8fe0','#2a62a8'],kuning:['#f9d441','#c9a010'],hijau:['#4fae4f','#2f7d32']};
const CACHE={};
function shp(t,c1,c2){const c=document.createElement('canvas');c.width=c.height=12;const x=c.getContext('2d');
 for(let j=0;j<12;j++)for(let i=0;i<12;i++){const d=Math.hypot(i-5.5,j-5.5),hw=Math.abs(i-5.5);
  const inn=t=='c'?d<=5.7:t=='s'?i>0&&i<11&&j>0&&j<11:(j>=1&&j<=10&&hw<=j*.55+.3);
  const ed=t=='c'?d>4.5:t=='s'?(i<2||i>9||j<2||j>9):(hw>j*.55-.9||j>8);
  if(inn){x.fillStyle=ed?c2:c1;x.fillRect(i,j,1,1)}}return c}
function cv(name,over){const k=name+(over?JSON.stringify(over):'');if(CACHE[k])return CACHE[k];let c;
 if(DEF[name]){c=document.createElement('canvas');c.width=12;c.height=DEF[name].length;const x=c.getContext('2d');
  DEF[name].forEach((r,j)=>[...r].forEach((ch,i)=>{const col=(over&&over[ch])||PAL[ch];if(ch!=='.'&&col){x.fillStyle=col;x.fillRect(i,j,1,1)}}))}
 else if(SHP[name])c=shp(...SHP[name]);else if(COL[name])c=shp('c',...COL[name]);
 return CACHE[k]=c}
function pathTile(){if(CACHE.path)return CACHE.path;const c=document.createElement('canvas');c.width=c.height=12;const x=c.getContext('2d');
 x.fillStyle='#ecd5a0';x.fillRect(0,0,12,12);x.fillStyle='#d9bb82';[[2,3],[8,1],[5,7],[10,9],[1,10],[7,5]].forEach(([i,j])=>x.fillRect(i,j,1,1));return CACHE.path=c}
const px=(n,o,cls='')=>`<img class="px ${cls}" alt="" src="${cv(n,o).toDataURL()}">`;
const vis=t=>typeof t==='number'?`<b class="nm">${t}</b>`:(DEF[t]||SHP[t]||COL[t]?px(t):`<b>${t}</b>`);
