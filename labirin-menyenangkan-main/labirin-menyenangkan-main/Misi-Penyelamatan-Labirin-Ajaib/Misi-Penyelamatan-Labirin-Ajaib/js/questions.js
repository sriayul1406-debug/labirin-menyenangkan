/* BANK SOAL — bagian yang paling mudah diubah.
   'pilihan' dan 'benar' memakai NAMA GAMBAR: kucing, anjing, ayam, lingkaran, persegi, segitiga,
   merah, biru, kuning, hijau, atau ANGKA. 'say' = kalimat yang dibacakan narator. */
const CFG={vidaMonster:4,bintang3Maks:1,bintang2Maks:3};
const BANK={
 1:{
  hewan:[
   {say:'Hewan apa yang bersuara meong?',pilihan:['kucing','anjing','ayam'],benar:'kucing'},
   {say:'Hewan apa yang bersuara guk guk?',pilihan:['kucing','anjing','ayam'],benar:'anjing'},
   {say:'Hewan apa yang bersuara kukuruyuk?',pilihan:['kucing','anjing','ayam'],benar:'ayam'}],
  bentuk:[
   {say:'Manakah bentuk lingkaran?',pilihan:['segitiga','lingkaran','persegi'],benar:'lingkaran'},
   {say:'Manakah bentuk persegi?',pilihan:['segitiga','lingkaran','persegi'],benar:'persegi'},
   {say:'Manakah bentuk segitiga?',pilihan:['segitiga','lingkaran','persegi'],benar:'segitiga'}]},
 2:{
  pola:[ /* pola A-B-A, jawabannya B */
   {pola:['merah','biru','merah'],pilihan:['biru','kuning','hijau'],benar:'biru'},
   {pola:['kuning','hijau','kuning'],pilihan:['hijau','merah','biru'],benar:'hijau'},
   {pola:['biru','kuning','biru'],pilihan:['kuning','merah','hijau'],benar:'kuning'},
   {pola:['hijau','merah','hijau'],pilihan:['merah','biru','kuning'],benar:'merah'}],
  hitung:[ /* n = jumlah apel (1-5) */
   {n:2,pilihan:[1,2,3],benar:2},{n:3,pilihan:[2,3,4],benar:3},
   {n:4,pilihan:[3,4,5],benar:4},{n:5,pilihan:[3,4,5],benar:5}]},
 3:{tambah:[[1,1],[1,2],[2,1],[2,2],[1,3],[3,1],[2,3],[3,2],[1,4],[4,1]]}
};
const rnd=a=>a[Math.random()*a.length|0],shuf=a=>a.map(v=>[Math.random(),v]).sort((x,y)=>x[0]-y[0]).map(v=>v[1]);
const cap=s=>s[0].toUpperCase()+s.slice(1);
function buildQ(it){let say=it.say,show='';
 if(it.pola){say=`${cap(it.pola[0])}, ${it.pola[1]}, ${it.pola[2]}. Setelah ini warna apa?`;show=it.pola.map(vis).join('')+'<span class="qm">?</span>'}
 if(it.n){say='Ada berapa apel pada gambar?';show=px('apel').repeat(it.n)}
 const ch=[...new Set([...it.pilihan,it.benar])];
 return{say,show,o:ch.map(c=>({h:vis(c),ok:c===it.benar}))}}
/* Satu rangkaian kuis: soal diambil acak, tanpa pengulangan */
function pickQuiz(lv){const t=(a,k)=>shuf(a).slice(0,k);
 return(lv==1?shuf([...t(BANK[1].hewan,1),...t(BANK[1].bentuk,1)]):shuf([...t(BANK[2].pola,2),...t(BANK[2].hitung,2)])).map(buildQ)}
/* Soal penjumlahan Level 3, makin lama makin besar */
function pickSums(n){const out=[];for(let i=0;i<n;i++){const lim=3+Math.min(i,2);out.push(rnd(BANK[3].tambah.filter(p=>p[0]+p[1]<=lim&&!out.includes(p))))}return out}
