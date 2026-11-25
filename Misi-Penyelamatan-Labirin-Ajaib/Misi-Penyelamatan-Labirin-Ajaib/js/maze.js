/* Pembuat labirin (selalu bisa diselesaikan) */
function genMaze(w,h){const R=2*h+1,C=2*w+1,g=Array.from({length:R},()=>Array(C).fill(1)),st=[[1,1]];g[1][1]=0;
 while(st.length){const[r,c]=st[st.length-1];
  const nb=[[-2,0],[2,0],[0,-2],[0,2]].map(([a,b])=>[r+a,c+b,a/2,b/2]).filter(([a,b])=>a>0&&b>0&&a<R&&b<C&&g[a][b]);
  if(!nb.length){st.pop();continue}
  const[a,b,x,y]=rnd(nb);g[r+x][c+y]=0;g[a][b]=0;st.push([a,b])}
 return g}
/* Titik paling jauh dari awal = lokasi pintu, dalam bentuk [x,y] */
function farthest(g){const d={'1,1':0},q=[[1,1]];let far=[1,1];
 for(let i=0;i<q.length;i++){const[r,c]=q[i];for(const[a,b]of[[1,0],[-1,0],[0,1],[0,-1]]){const y=r+a,x=c+b,k=y+','+x;
  if(g[y][x]===0&&!(k in d)){d[k]=d[r+','+c]+1;q.push([y,x]);far=[x,y]}}}
 return far}
