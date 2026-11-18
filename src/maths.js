
/* ---------- Maths, woven in. Never a gate: every maths bit can be skipped and nothing is marked wrong. ---------- */
const TIMESW = {"Bigger":"times bigger","Smaller":"times smaller","Faster":"times faster","Slower":"times slower","Jumps higher":"times higher","Louder":"times louder","Quieter":"times quieter","Easier to see":"times easier to see","Happens more often":"times as often","Happens less often":"times less often","Lasts longer":"times as long","Wears out slower":"times slower to wear out","Gives more coins or XP":"times as many coins or XP"};
const numMode = c => ["More of them","Fewer of them"].includes(c.l) ? "count" : c.l==="Cheaper" ? "coins" : "times";
const fmt = n => Number.isInteger(n) ? String(n) : Math.floor(n) ? `${Math.floor(n)}½` : "½";
const sym = n => Number.isInteger(n) ? String(n) : String(n).replace(".5",".5");
const NUM_START = {times:2, count:1, coins:10};
const NUM_OPS = {
  times:[["+1","Add 1",n=>n+1,"+"],["-1","Take 1 away",n=>n-1,"−"],["x2","Double it",n=>n*2,"×"],["x10","Times 10",n=>n*10,"×"],["h","Half it",n=>n/2,"÷"]],
  count:[["+1","Add 1",n=>n+1,"+"],["+10","Add 10",n=>n+10,"+"],["+64","Add a stack (64)",n=>n+64,"+"],["-1","Take 1 away",n=>n-1,"−"],["x2","Double it",n=>n*2,"×"],["h","Half it",n=>n/2,"÷"]],
  coins:[["+1","Add 1 coin",n=>n+1,"+"],["+5","Add 5",n=>n+5,"+"],["+10","Add 10",n=>n+10,"+"],["-1","Take 1 away",n=>n-1,"−"],["x2","Double it",n=>n*2,"×"],["h","Half it",n=>n/2,"÷"]]
};
const OPN = {"+1":1,"-1":1,"+10":10,"+64":64,"+5":5,"x2":2,"x10":10,"h":2};
function numLabel(c, n){
  const m = numMode(c);
  if (m==="count") return c.l==="Fewer of them" ? `only ${fmt(n)} of them` : `${fmt(n)} of them`;
  if (m==="coins") return `costs ${fmt(n)} coins`;
  return `${fmt(n)} ${TIMESW[c.l]||"times as much"}`;
}
function blocksHTML(m, n){
  if (m==="count"){
    const st = Math.floor(n/64), rest = Math.round(n - st*64);
    const stacks = Array.from({length:Math.min(st,12)},()=>`<span class="stack">64</span>`).join("") + (st>12?`<span class="stackmore">+${st-12} more stacks</span>`:"");
    const small = rest ? `<span class="eights">${Array.from({length:Math.ceil(rest/8)},(_,r)=>`<span class="row8">${"<i></i>".repeat(Math.min(8,rest-r*8))}</span>`).join("")}</span>` : "";
    const say = st ? `That's ${st} stack${st>1?"s":""} of 64${rest?` and ${rest} more`:""}.` : n>=8 ? `That's ${Math.floor(n/8)} row${n>=16?"s":""} of 8${n%8?` and ${fmt(n%8)} more`:""}.` : "";
    return `<div class="blocks">${stacks}${small}</div>${say?`<p class="numsay">${say}</p>`:""}`;
  }
  if (m==="coins"){
    const tens = Math.floor(n/10), ones = n - tens*10;
    const bag = Array.from({length:Math.min(tens,20)},()=>`<span class="coinbag">10</span>`).join("") + (tens>20?`<span class="stackmore">+${tens-20} more bags</span>`:"");
    return `<div class="blocks">${bag}${"<b class='c1'></b>".repeat(Math.floor(ones))}${ones%1?"<b class='c1 half'></b>":""}</div>${tens?`<p class="numsay">That's ${tens} bag${tens>1?"s":""} of 10${ones?` and ${fmt(ones)} more`:""}.</p>`:""}`;
  }
  const shown = Math.min(Math.floor(n), 40);
  return `<div class="blocks timesrow"><span class="one">1</span><span class="arrow">→</span>${Array.from({length:shown},()=>"<i></i>").join("")}${n%1?"<i class='half'></i>":""}${n>40?`<span class="stackmore">and ${fmt(n-40)} more</span>`:""}</div>`;
}
function numberScreen(){
  const c = S.change, m = numMode(c);
  if (typeof S.num !== "number") S.num = S.detail?.num ?? NUM_START[m];
  const n = S.num;
  const q = m==="count" ? (c.l==="Fewer of them" ? "How many should there be?" : "How many should there be?") : m==="coins" ? "How many coins should it cost?" : `How many times ${lc((TIMESW[c.l]||"times more").replace("times ",""))}?`;
  const body = `<div class="numbox panel">
      <div class="bignum" aria-live="polite">${fmt(n)}</div>
      <div class="sumline">${S.numLog ? esc(S.numLog) : "Tap the buttons to build your number"}</div>
      ${blocksHTML(m, n)}
      <p class="numwhat">${esc(cap(subj()))}: ${esc(numLabel(c, n))}</p>
    </div>
    <div class="grid ops">${NUM_OPS[m].map(([k,l,f])=>{ const r=f(n); const off = r<1 || r>9999 || (k==="h" && (n%1 || (m!=="times" && n%2))); return `<button class="tile op" data-op="${k}" ${off?"disabled":""}>${esc(l)}</button>`; }).join("")}</div>
    <div class="btns"><button class="go quiet" id="words">Use words instead</button><button class="go" id="numdone">That's my number</button></div>`;
  return {q, body};
}
function numOp(k){
  const m = numMode(S.change), op = NUM_OPS[m].find(o=>o[0]===k); if (!op) return;
  const a = S.num, r = op[2](a); if (r<1 || r>9999) return;
  S.numLog = `${sym(a)} ${op[3]} ${OPN[k]} = ${sym(r)}`;
  if (k==="h" && r%1) S.numLog += `  (that's ${fmt(r)})`;
  S.num = r; render();
}
function numDone(){
  const c = S.change, n = S.num, m = numMode(c);
  const val = {l:numLabel(c,n), id:`number:${m}:${n}`, num:n, unit:m};
  if (JSON.stringify(S.detail)!==JSON.stringify(val)) clearAfter("detail");
  S.detail = val; S.num = null; S.numLog = null; advance();
}

/* A puzzle about his report, offered after sending. Optional, no score, no streaks, no "wrong". */
const rnd = (a,b) => a + Math.floor(Math.random()*(b-a+1));
const SHOW_PUZZLE = false; // hidden for now (Phill 2026-11-18); set true to bring the puzzle back
function makePuzzle(){
  const t = S.thing && !S.thing.vague ? S.thing.l : null;
  const horse = t && S.thing.tp==="horse" ? t : HORSE_NAMES[rnd(0,HORSE_NAMES.length-1)];
  const d = S.detail?.num && S.detail.unit==="times" && Number.isInteger(S.detail.num) && S.detail.num<=12 ? S.detail : null;
  const P = [
    () => { const a=rnd(3,9), b=rnd(2,6); return {q:`The yard has ${b} rows of stalls with ${a} stalls in each row. How many stalls is that?`, a:a*b, w:`${b} × ${a} = ${a*b}`}; },
    () => { const k=rnd(1,3), e=rnd(0,9); return {q:`You've got ${k} stack${k>1?"s":""} of hay bales and ${e} more. A stack is 64. How many hay bales?`, a:64*k+e, w:`${k} × 64${e?` + ${e}`:""} = ${64*k+e}`}; },
    () => { const a=rnd(2,8)*2; return {q:`${horse} and Molly May share ${a} carrots equally. How many does ${horse} get?`, a:a/2, w:`${a} ÷ 2 = ${a/2}`}; },
    () => { const h=rnd(3,9); return {q:`${h} horses go to a show. Each horse needs 4 horseshoes. How many horseshoes?`, a:h*4, w:`${h} × 4 = ${h*4}`}; },
    () => { const c=rnd(20,60), s=rnd(5,19); return {q:`You have ${c} coins. ${t&&!S.thing.isNew?`${t} costs`:"A new saddle costs"} ${s} coins. How many coins are left?`, a:c-s, w:`${c} − ${s} = ${c-s}`}; },
    () => { const a=rnd(6,15), b=rnd(5,15); return {q:`${horse} jumped ${a} fences in the morning and ${b} in the afternoon. How many fences altogether?`, a:a+b, w:`${a} + ${b} = ${a+b}`}; },
    () => { const s=rnd(9,12), k=rnd(1,3); const e=s+k>12?s+k-12:s+k; return {q:`A show starts at ${s} o'clock and lasts ${k} hour${k>1?"s":""}. What time does it finish?`, a:e, w:`${s} o'clock + ${k} hour${k>1?"s":""} = ${e} o'clock`, unit:" o'clock"}; },
    () => { return {q:`There are ${HORSE_NAMES.length} horses at the yard. Each one has 4 legs. How many legs is that?`, a:HORSE_NAMES.length*4, w:`${HORSE_NAMES.length} × 4 = ${HORSE_NAMES.length*4}`}; }
  ];
  if (d) P.push(() => { const b=rnd(2,9); return {q:`You asked for ${lc(S.change.l)}: ${d.num} ${TIMESW[S.change.l]||"times"}. If it was ${b} before, what would it be now?`, a:b*d.num, w:`${b} × ${d.num} = ${b*d.num}`}; });
  const p = (d && Math.random()<.5) ? P[P.length-1]() : P[rnd(0,P.length-1)]();
  const opts = new Set([p.a]); const near = [p.a+1,p.a-1,p.a+2,p.a+10,p.a-10,p.a*2,p.a+4,p.a-4].filter(x=>x>0 && x!==p.a && (!p.unit || x<=12));
  while (opts.size<3 && near.length) opts.add(near.splice(rnd(0,near.length-1),1)[0]);
  p.opts = [...opts].sort((x,y)=>x-y); p.unit = p.unit||""; p.picked = null; return p;
}
function puzzleHTML(){
  const p = S.puz;
  if (!p) return `<button class="go quiet" id="puzzle">A puzzle about your report</button>`;
  return `<div class="panel puz"><h2>Puzzle</h2><p class="puzq">${esc(p.q)}</p>
    <div class="grid puzopts">${p.opts.map(o=>`<button class="tile mm ${p.picked!==null && o===p.a ? "right" : p.picked===o ? "sel" : ""}" data-ans="${o}" ${p.picked!==null?"disabled":""}>${o}${esc(p.unit)}</button>`).join("")}</div>
    ${p.picked!==null ? `<p class="puzres">${p.picked===p.a?"Yes!":`It's ${p.a}${esc(p.unit)}.`} ${esc(p.w)}</p>
    <div class="btns"><button class="go quiet small" id="puzno">That's enough</button><button class="go small" id="puzzle">Another puzzle</button></div>` : `<button class="go quiet small" id="puzno">Not now</button>`}</div>`;
}
function statsHTML(all){
  const sent = all.filter(r=>r.sent); if (!sent.length) return "";
  const by = k => sent.filter(r=>r.kind===k).length;
  const rows = Object.entries(KINDS).map(([k,v])=>[k,v.label,by(k)]).filter(r=>r[2]);
  return `<div class="stats"><div class="listlabel">You've sent ${sent.length} report${sent.length>1?"s":""}</div>${rows.map(([k,l,n])=>`<div class="srow"><span class="slab">${esc(l)}</span><span class="sbar">${`<i class="k-${k}"></i>`.repeat(Math.min(n,20))}</span><b>${n}</b></div>`).join("")}</div>`;
}
