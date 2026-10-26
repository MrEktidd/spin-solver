// Standalone chip-EV calculator. No GTO/equilibrium claims.
export const RANKS = "AKQJT98765432";
export const SUITS = "shdc";
export const HANDS = RANKS.split("").flatMap((a,i)=>RANKS.split("").map((b,j)=>i===j?a+b:i<j?a+b+"s":b+a+"o"));
export function handAt(row,col){return row===col?RANKS[row]+RANKS[col]:row<col?RANKS[row]+RANKS[col]+"s":RANKS[col]+RANKS[row]+"o";}
export function cardsOfHand(hand){
 const [a,b,t]=hand;
 if(a===b){const out=[];for(let s=0;s<4;s++)for(let k=s+1;k<4;k++)out.push([a+SUITS[s],b+SUITS[k]]);return out;}
 if(t==="s") return [...SUITS].map(s=>[a+s,b+s]);
 const out=[];for(const s of SUITS)for(const v of SUITS)if(s!==v)out.push([a+s,b+v]);return out;
}
export function deck(){return [...RANKS].flatMap(r=>[...SUITS].map(s=>r+s));}
const rankVal=r=>14-RANKS.indexOf(r);
function straightHigh(mask){for(let high=14;high>=5;high--){let yes=true;for(let k=0;k<5;k++){const x=high-k===1?14:high-k;if(!(mask&(1<<x))){yes=false;break;}}if(yes)return high;}return 0;}
export function evaluate(cards){
 const count=Array(15).fill(0), suits=[[],[],[],[]];let mask=0;
 for(const c of cards){const n=rankVal(c[0]);count[n]++;mask|=1<<n;suits[SUITS.indexOf(c[1])].push(n);}
 const score=(cat,k=[])=>k.reduce((v,n)=>v*15+n,cat);
 const padded=(cat,k)=>score(cat,[...k,...Array(5-k.length).fill(0)]);
 for(const group of suits)if(group.length>=5){const sm=group.reduce((m,n)=>m|(1<<n),0),sf=straightHigh(sm);if(sf)return padded(8,[sf]);}
 const quads=[] ,triples=[],pairs=[];
 for(let n=14;n>=2;n--){if(count[n]===4)quads.push(n);else if(count[n]===3)triples.push(n);else if(count[n]===2)pairs.push(n);}
 if(quads.length)return padded(7,[quads[0],...Array.from({length:13},(_,i)=>14-i).filter(n=>n!==quads[0]&&count[n])[0] ].slice(0,2));
 if(triples.length&&(pairs.length||triples.length>1))return padded(6,[triples[0],Math.max(pairs[0]||0,triples[1]||0)]);
 for(const group of suits)if(group.length>=5)return padded(5,group.sort((a,b)=>b-a).slice(0,5));
 const straight=straightHigh(mask);if(straight)return padded(4,[straight]);
 if(triples.length)return padded(3,[triples[0],...Array.from({length:13},(_,i)=>14-i).filter(n=>n!==triples[0]&&count[n]).slice(0,2)]);
 if(pairs.length>=2)return padded(2,[pairs[0],pairs[1],...Array.from({length:13},(_,i)=>14-i).filter(n=>n!==pairs[0]&&n!==pairs[1]&&count[n]).slice(0,1)]);
 if(pairs.length)return padded(1,[pairs[0],...Array.from({length:13},(_,i)=>14-i).filter(n=>n!==pairs[0]&&count[n]).slice(0,3)]);
 return padded(0,Array.from({length:13},(_,i)=>14-i).filter(n=>count[n]).slice(0,5));
}
// Heuristic hand order used ONLY to define editable model ranges; not an equilibrium chart.
export function strength(h){const a=rankVal(h[0]),b=rankVal(h[1]),hi=Math.max(a,b),lo=Math.min(a,b);return hi*4+lo*1.5+(a===b?38+a*1.1:0)+(h.endsWith("s")?7:0)-(hi-lo>3?(hi-lo-3)*1.6:0);}
export const ORDER=[...new Set(RANKS.split("").flatMap((_,r)=>RANKS.split("").map((_,c)=>handAt(r,c))))].sort((a,b)=>strength(b)-strength(a));
export function rangeSet(pct){let n=Math.round(Math.max(0,Math.min(100,pct))*1326/100),set=new Set();for(const h of ORDER){const w=h.length===2?6:h.endsWith("s")?4:12;if(n<=0)break;set.add(h);n-=w;}return set;}
export function canonical(c1,c2){const a=c1[0],b=c2[0];if(a===b)return a+b;const hi=rankVal(a)>=rankVal(b)?a:b,lo=hi===a?b:a;return hi+lo+(c1[1]===c2[1]?"s":"o");}
export function seeded(seed){let x=(seed>>>0)||1;return ()=>{x^=x<<13;x^=x>>>17;x^=x<<5;return (x>>>0)/4294967296;};}
export function equity(hero,opponentRange,samples=1200,seed=12345){
 const rng=seeded(seed),opps=[];
 const heroes=cardsOfHand(hero);
 for(const a of deck())for(const b of deck()){if(a>=b)continue;if(opponentRange.has(canonical(a,b)))opps.push([a,b]);}
 let won=0,tied=0,total=0;const all=deck();
 for(let i=0;i<samples;i++){
  const hc=heroes[Math.floor(rng()*heroes.length)];
  // blocker-aware rejection: sample uniformly among legal opponent combinations.
  let options=opps.filter(o=>!o.includes(hc[0])&&!o.includes(hc[1]));if(!options.length)continue;
  const oc=options[Math.floor(rng()*options.length)];
  const remaining=all.filter(c=>!hc.includes(c)&&!oc.includes(c));
  for(let k=0;k<5;k++){const j=k+Math.floor(rng()*(remaining.length-k));[remaining[k],remaining[j]]=[remaining[j],remaining[k]];}
  const board=remaining.slice(0,5),a=evaluate([...hc,...board]),b=evaluate([...oc,...board]);won+=a>b?1:0;tied+=a===b?1:0;total++;
 }
 return {equity:total?(won+tied/2)/total:0,samples:total};
}
export function foldFrequency(hero,range){
 const heroes=cardsOfHand(hero),all=deck();let c=0,t=0;
 for(const hc of heroes){for(let i=0;i<all.length;i++){const a=all[i];if(hc.includes(a))continue;for(let j=i+1;j<all.length;j++){const b=all[j];if(hc.includes(b))continue;t++;if(range.has(canonical(a,b)))c++;}}}
 return t?1-c/t:0;
}
// Return decision EV relative to surrendering the current pot. All amounts are BB.
// heroPosted and villainPosted are already in the pot; stacks are *starting* effective stacks.
// Hero's effective risk is effective - heroPosted, villain's call addition is effective - villainPosted.
// Dead chips (e.g. antes) are added to pot but are not recoverable as hero stack.
export function shoveEV({equity:winShare,fold,heroRisk,villainCall,pot}){
 const calledWin=pot+villainCall;
 const calledLose=-heroRisk;
 return fold*pot+(1-fold)*(winShare*calledWin+(1-winShare)*calledLose);
}
export function callEV({equity:winShare,pot,toCall}){return winShare*pot-(1-winShare)*toCall;}
export function computeSpot(hand,{mode="shove",stack=10,oppRange=40,continueRange=25,samples=600,seed=77,heroPosted=0.5,villainPosted=1,dead=0}={}){
 const effective=Math.max(1.01,Number(stack)),P=heroPosted+villainPosted+dead,range=rangeSet(mode==="call"?oppRange:continueRange);
 const eq=equity(hand,range,samples,seed);
 if(mode==="call"){const toCall=Math.max(0,effective-heroPosted);return {...eq,ev:callEV({equity:eq.equity,pot:P+effective-villainPosted,toCall}),fold:0,pot:P+effective-villainPosted};}
 const fold=foldFrequency(hand,range),heroRisk=Math.max(0,effective-heroPosted),villainCall=Math.max(0,effective-villainPosted);
 return {...eq,fold,ev:shoveEV({equity:eq.equity,fold,heroRisk,villainCall,pot:P}),pot:P};
}
