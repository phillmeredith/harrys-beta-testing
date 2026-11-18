
/* ---------- New versions: releases.json on the same site, written by the add-on thread on every release ---------- */
var REL = null, showRelease = false;
const INSTALLED = "hbt_installed_version";
function installedVersion(){ try { return localStorage.getItem(INSTALLED) || ""; } catch(e){ return ""; } }
function setInstalled(v){ try { localStorage.setItem(INSTALLED, v); } catch(e){} }
function versionText(){
  const iv = installedVersion(), latest = REL?.latest;
  if (iv) return `${iv} (installed from the app)`;
  if (S.version && S.version!=="?") return `${S.version} (Harry read it off the Horse Guide)`;
  return `unknown${latest?`, latest released is ${latest}`:""} (ask Harry to check the Horse Guide front page)`;
}
function newRelease(){ const l = REL?.releases?.[0]; return l && l.version !== installedVersion() ? l : null; }
function fixedIn(code){ for (const r of (REL?.releases||[])) if ((r.fixed||[]).includes(code)) return r.version; return null; }
function statusOf(code){ for (const r of (REL?.releases||[])) if (r.status && r.status[code]) return r.status[code]; return null; }
function loadReleases(){
  if (!/^https?:/.test(location.protocol)) return;
  fetch("releases.json", {cache:"no-store"}).then(r=>r.ok?r.json():null).then(j=>{ if (j && Array.isArray(j.releases)){ REL=j; if (S.step===0 || S.step==="done") render(); } }).catch(()=>{});
}
function latestRelease(){ return REL?.releases?.[0] || null; }
function releaseTile(){
  const r = latestRelease(); if (!r) return "";
  return `<div class="menurow relrow">${newRelease()
    ? `<button class="tile mm newver" id="newver">Download latest<span class="vtag">New</span></button>`
    : `<button class="tile mm latestver" id="newver">Download latest</button>`}<button class="tile mm latestver" id="prevver">Previous versions</button></div>`;
}
var showPrev = false;
// Names for each big update (first two numbers of the version). releases.json "update_names" can add or change these.
const UPDATE_NAMES = {"4.0":"Foals and Flying","3.0":"The Big Art Update","2.0":"Shows and Hacks","1.10":"Yard Day","1.9":"My Horses","1.8":"The Horse Designer","1.7":"Harry's Yard","1.6":"The First Horses"};
function relDate(d){ if (!d) return ""; const t = new Date(d+"T12:00:00"); return isNaN(t) ? "" : t.toLocaleDateString("en-GB",{day:"numeric",month:"short",year:"numeric"}); }
function tsDate(t){ return t ? new Date(t).toLocaleDateString("en-GB",{day:"numeric",month:"short",year:"numeric"}) : ""; }
function prevPanel(){
  if (!showPrev || !REL) return "";
  const iv = installedVersion(), list = REL.releases || [];
  const reps = Object.values(loadAll()).filter(r=>r.sent && r.kind).sort((a,b)=>b.sent-a.sent);
  const byCode = {}; reps.forEach(r=>{ byCode[code(r)] = r; });
  const rowHTML = (r) => {
    const notes = (r.notes_for_harry||[]).filter(n=>!/^A big new version number/.test(n)).map(n=>`<li>${esc(n)}</li>`).join("");
    const fx = (r.fixed||[]).map(c=>{ const rep = byCode[c]; return `<li><span class="fbh">Found by Harry</span> ${rep?`${esc(fbTitle(rep))} <small>reported ${esc(tsDate(rep.sent))} · ${esc(c)}</small>`:`<small>${esc(c)}</small>`}</li>`; }).join("");
    const tags = (r===list[0]?`<span class="vtag2">Latest</span>`:"") + (r.version===iv?`<span class="vtag2 have">You've got this</span>`:"");
    return `<div class="relver"><div class="relhead small"><b>${esc(r.version)}</b><span>${esc(relDate(r.date))}</span>${tags}</div>
      ${notes?`<ul class="relnotes">${notes}</ul>`:`<p class="relhow">Small fixes.</p>`}${fx?`<ul class="relfixes">${fx}</ul>`:""}
      ${r.file?`<a class="tile mm relget" data-ver="${esc(r.version)}" href="${esc(r.file)}" download>${r===list[0]?"Download":"Download this version"}</a>`:""}</div>`;
  };
  // Group versions into named updates by their first two numbers (4.0.x, 3.0.x, 1.10.x...)
  const names = Object.assign({}, UPDATE_NAMES, REL.update_names||{});
  const groups = [];
  list.forEach(r=>{ const k = r.version.split(".").slice(0,2).join("."); let g = groups.find(x=>x.k===k); if (!g){ g = {k, items:[]}; groups.push(g); } g.items.push(r); });
  const card = (g,gi) => {
    const first = g.items[g.items.length-1], last = g.items[0];
    const skip = n => /^A big new version number|^Small fixes/.test(n);
    let hl = (first.notes_for_harry||[]).filter(n=>!skip(n));
    g.items.slice(0,-1).reverse().forEach(r=>{ const n = (r.notes_for_harry||[]).find(x=>!skip(x)); if (n && !hl.includes(n)) hl.push(n); });
    if (hl.length > 8) hl = hl.slice(0,8);
    const nFix = g.items.reduce((n,r)=>n+(r.fixed||[]).length,0);
    const has = g.items.some(r=>r.version===iv);
    const dates = first.date===last.date ? relDate(first.date) : `${relDate(first.date)} to ${relDate(last.date)}`;
    return `<div class="relcard"><div class="relhead"><b>${esc(g.k)}</b><span class="uname">${esc(names[g.k]||"Update")}</span>${gi===0?`<span class="vtag2">Latest</span>`:""}${has?`<span class="vtag2 have">You've got this</span>`:""}</div>
      <p class="relhow">${esc(dates)} · ${g.items.length} version${g.items.length>1?"s":""}${nFix?` · ${nFix} found by Harry`:""}</p>
      ${hl.length?`<ul class="relnotes">${hl.map(n=>`<li>${esc(n)}</li>`).join("")}</ul>`:""}
      ${g.items.length===1 ? ((first.fixed||[]).length||first.file ? rowHTML(first) : "") : `<details${gi===0?" open":""}><summary>${gi===0?"Every version in this update":`See all ${g.items.length} versions`}</summary><div class="relvers">${g.items.map(rowHTML).join("")}</div></details>`}</div>`;
  };
  const rep = r => { const st = reportState(r); return `<div class="repcard" data-track="${r.id}" role="button" tabindex="0"><span class="rkind k-${r.kind}"></span><div class="rt"><b>${esc(fbTitle(r))}</b><small>${esc(KINDS[r.kind].word)} · reported ${esc(tsDate(r.sent))} · ${esc(code(r))}</small></div><span class="rstate st-${st[0]}">${esc(st[1])}</span></div>`; };
  return `<div class="homeover" data-close="prev"><div class="inner prevpanel">
    <div class="prevcol"><div class="listlabel">All versions</div>
      <p class="relhow">Each big update has a name. Open one to see every version in it.${list.length>1?" Only go back to an older one if Daddy asks.":""}</p>
      ${groups.map(card).join("")}</div>
    <div class="prevcol"><div class="listlabel">Harry's reports</div>
      <p class="relhow">Everything Harry has sent to Daddy, newest first.</p>
      ${reps.length?reps.map(rep).join(""):`<p class="relhow">Nothing sent yet. When Harry sends a report it shows up here with its date.</p>`}</div>
    <button class="tile mm closeover prevclose" data-close="prev">Close</button></div></div>`;
}
function releasePanel(){
  const r = latestRelease(); if (!r || !showRelease) return "";
  const isNew = !!newRelease();
  const notes = (r.notes_for_harry||[]).map(n=>`<li>${esc(n)}</li>`).join("");
  return `<div class="homeover" data-close="rel"><div class="inner savedlist relpanel"><div class="listlabel">${isNew?"What's new in":"You've got"} ${esc(r.version)}</div>${notes?`<ul class="relnotes">${notes}</ul>`:""}
    <a class="tile mm primary" id="getver" href="${esc(r.file)}" download style="text-decoration:none">${isNew?"Download it":"Download it again"}</a>
    <p class="relhow">When it has downloaded, tap it and choose Minecraft. Your world and horses stay safe.</p>
    ${isNew?"":(fbAllowedVer(r.version)?`<button class="tile mm fbbtn" data-fb="ver:${esc(r.version)}">Something not right in this version?</button>`:"")}<button class="tile mm closeover" data-close="rel">Close</button></div></div>`;
}
function reportState(r){
  if (!r.sent) return ["draft","Not sent yet. Tap to finish"];
  if (r.confirmed && r.confirmed.release===fixedIn(code(r))) return ["fixed","Harry says it's fixed"];
  if (fixedIn(code(r)) && (r.followups||[]).some(f=>f.release===fixedIn(code(r)))) return ["wip","Daddy's looking again"];
  if (fixedIn(code(r))) return ["fixed",`Fixed in ${fixedIn(code(r))}!`];
  const st = statusOf(code(r)); if (st) return ["wip", st];
  return ["sent","Sent to Daddy"];
}
function reportTag(r){
  if (!r.sent) return "";
  const f = fixedIn(code(r)); if (f) return `<span class="fixtag">Fixed in ${esc(f)}</span>`;
  const st = statusOf(code(r)); return st ? `<span class="fixtag wip">${esc(st)}</span>` : "";
}
function builderNotes(){
  const N = [];
  if (S.kind === "broken"){
    if (S.thing?.vague) N.push("Harry wasn't sure what it was about: use the screenshot and his sentence, otherwise ask Phill.");
    if (!installedVersion() && (!S.version || S.version==="?")) N.push("Version unknown: assume the latest release, and say so in the reply.");
    if (S.words==="Yes, words came up" && !S.shot) N.push("Words came up on screen but there is no screenshot: the exact text may be in Harry's sentence. If not, ask Phill to get it.");
    if (S.doing==="Don't know" || S.tapped==="Don't know") N.push("Steps are partly unknown: try the obvious routes on the test server first.");
    const w = BROKEN.find(b=>b.id===S.what); if (w) N.push(`Done when: following the same steps${S.laura?" in a LAN game":""}, ${w.exp}${S.thing&&!S.thing.vague?` (${S.thing.l})`:""}. Add a check to the per-item test.`);
  } else {
    [...S.parts, S].forEach((p,i)=>{
      if (!p.change) return;
      const who = p.thing?.vague ? "the thing Harry means" : subj(p), tag = S.parts.length ? `Part ${i+1}: ` : "";
      if (p.thing?.vague) N.push(`${tag}Harry wasn't sure what it's about: ask Phill which thing he means.`);
      if (p.change?.vague) N.push(`${tag}Harry picked "Something else": his sentence may say more, otherwise ask Phill.`);
      if (p.thing?.isNew && !p.like) N.push(`${tag}Brand new, not like anything existing: propose a look and check it with Phill before building.`);
      if (p.thing?.isNew && !p.where) N.push(`${tag}No place chosen for the new thing: suggest the Horse Guide shop as a default.`);
      if (p.detail?.unit==="times") N.push(`${tag}Number: multiply the current value by ${p.detail.num} (find the current value in the add-on code; cap it if the game would break).`);
      if (p.detail?.unit==="count") N.push(`${tag}Number: Harry wants exactly ${p.detail.num}.`);
      if (p.detail?.unit==="coins") N.push(`${tag}Number: the price should be ${p.detail.num} coins.`);
      if (p.detail && !p.detail.num && /^amount:/.test(p.detail.id||"")) N.push(`${tag}Amount is a word ("${p.detail.l}"): choose a sensible value and say what you picked.`);
      N.push(`${tag}Done when: ${partSentence(p).replace(/\.$/,"")}${p.when&&p.when!=="All the time"?"":" (all the time)"}. Harry should never need to type a command for it.`);
    });
  }
  return N;
}
loadReleases();

/* ---------- "Not quite right?": feedback on a release, sent as a follow-up to the original request ----------
   Follow-ups do not count towards the one-report-a-day limit (they finish work already chosen),
   but each request (or version) can get one follow-up per release. */
const FB_CHOICES = ["It still happens","It only half works","It works, but not how I wanted","Now something else is broken","Something else"];
const FB_VER = "hbt_fb_versions";
var fbFor = null, fbPick = null, fbNote = "", fbState = null; // fbState: null | "sending" | "sent" | "failed"
function fbVersions(){ try { return JSON.parse(localStorage.getItem(FB_VER)||"[]"); } catch(e){ return []; } }
function fbAllowed(r){ const v = r.sent && fixedIn(code(r)); return !!v && !(r.followups||[]).some(f=>f.release===v); }
function fbAllowedVer(v){ return !fbVersions().includes(v); }
function fbTitle(r){ const t=(r.parts?.[0]||r).thing; if (!t) return "your request"; if (t.vague) return (r.text||"your request").replace(/^(Something went wrong: |Make it better\. |New idea! )/,""); return t.l; }
function closeFeedback(){ fbFor = null; fbPick = null; fbNote = ""; fbState = null; }
function fbPanel(){
  if (!fbFor) return "";
  const r = fbFor.startsWith("ver:") ? null : loadAll()[fbFor], ver = r ? fixedIn(code(r)) : fbFor.slice(4);
  if (fbState === "sent") return `<div class="homeover" data-close="fb"><div class="inner savedlist"><div class="listlabel">Sent to Daddy</div>
    <p class="relhow" style="font-size:19px">Thanks Harry. Daddy will look at this first, before anything new.</p><button class="tile mm closeover" data-close="fb">Close</button></div></div>`;
  return `<div class="homeover" data-close="fb"><div class="inner savedlist"><div class="listlabel">${r?`What's not right with ${esc(fbTitle(r))}?`:`What's not right in ${esc(ver)}?`}</div>
    ${FB_CHOICES.map((c,i)=>`<button class="tile mm${fbPick===i?" primary":""}" data-fbc="${i}">${esc(c)}</button>`).join("")}
    ${fbPick!==null?`<textarea id="fbmsg" class="fbmsg" rows="2" placeholder="Tell Daddy more. You can skip this.">${esc(fbNote)}</textarea>
    ${fbState==="failed"?`<p class="relhow">It couldn't reach Daddy just now. Try again in a bit.</p>`:""}
    <button class="tile mm primary" id="fbsend"${fbState==="sending"?" disabled":""}>${fbState==="sending"?"Sending…":"Send to Daddy"}</button>`:""}
    <button class="tile mm closeover" data-close="fb">Close</button></div></div>`;
}
function wireFeedback(){
  document.querySelectorAll("[data-fb]").forEach(b=>b.onclick=e=>{ e.stopPropagation(); closeFeedback(); fbFor=b.dataset.fb; render(); });
  document.querySelectorAll("[data-fbc]").forEach(b=>b.onclick=()=>{ fbPick=+b.dataset.fbc; render(); });
  const m=document.getElementById("fbmsg"); if (m) m.oninput=()=>{ fbNote=m.value; };
  const s=document.getElementById("fbsend"); if (s) s.onclick=sendFollowup;
}
function followupText(r, ver, fcode){
  const choice = FB_CHOICES[fbPick], note = fbNote.trim();
  const L = [`[Harry's Beta Testing] FOLLOW-UP · ${r?`report ${fcode}`:`version ${ver}`} · release ${ver}`, ""];
  if (r){
    L.push(`This is a follow-up to report ${fcode}, which releases.json marks as fixed in ${ver}. Harry says it didn't work the way he hoped.`);
    L.push(`Original request: ${KINDS[r.kind]?.word||r.kind} about ${fbTitle(r)}`, `Original words: ${r.text||"(none)"}`);
  } else L.push(`Harry says something in release ${ver} didn't work the way he hoped. It isn't tied to one of his requests.`);
  L.push(`What's not right: ${choice}`, `Harry's words: ${note||"(none)"}`);
  L.push(`Add-on: Harry's Equestrian ${versionText()} · iPad Pro`);
  L.push("", "For the builder:",
    r ? `- Treat as a follow-up, not a new report: find the original email by "${fcode}", reopen it, and do it before new reports. It does not use Harry's daily report.`
      : `- Treat as a follow-up on release ${ver}: check every change in that release's notes, and do it before new reports. It does not use Harry's daily report.`,
    choice==="Something else" && !note ? "- Harry didn't say what: ask Phill." : "",
    choice==="Now something else is broken" ? "- Something else broke after this release: check for a regression in the files that release changed." : "",
    `- Done when: ${r?`the original request works on the version Harry has`:`the release works as its notes say`}, and the reply says what changed.`);
  return L.filter(x=>x!=="").join("\n");
}
async function sendFollowup(){
  const r = fbFor.startsWith("ver:") ? null : loadAll()[fbFor], ver = r ? fixedIn(code(r)) : fbFor.slice(4);
  const fcode = r ? code(r) : "HBT-V" + String(Date.now()).slice(-3);
  const m=document.getElementById("fbmsg"); if (m) fbNote=m.value;
  const text = followupText(r, ver, fcode);
  fbState = "sending"; render();
  let ok = false;
  try {
    const res = await fetch(SEND_URL, {method:"POST", headers:{"Content-Type":"text/plain;charset=utf-8"},
      body: JSON.stringify({key:SEND_KEY, device:deviceToken(), code:fcode, kind:r?.kind||"broken", said:`Follow-up on ${ver}: ${FB_CHOICES[fbPick]}`, text, shot:null})});
    const j = await res.json(); noteDeviceError(j); ok = !!j.ok;
  } catch(e){}
  if (!ok && navigator.share){ try { await navigator.share({text}); ok = true; } catch(e){} }
  if (!ok){ fbState = "failed"; render(); return; }
  if (r){ const all = loadAll(); const rec = all[r.id]; if (rec){ rec.followups = [...(rec.followups||[]), {release:ver, at:Date.now(), choice:FB_CHOICES[fbPick]}]; try { localStorage.setItem(STORE, JSON.stringify(all)); } catch(e){} } }
  else { try { localStorage.setItem(FB_VER, JSON.stringify([...fbVersions(), ver])); } catch(e){} }
  fbState = "sent"; render();
}


/* ---------- Report tracker: where a sent report is up to, and Harry's say on the fix ---------- */
var trackFor = null, trackMore = false, trackNote = "", trackState = null; // trackState: null | "sending" | "failed" | "thanks" | "added"
function relOf(v){ return (REL?.releases||[]).find(r=>r.version===v) || null; }
function needsCheck(r){ const v = r.sent && fixedIn(code(r)); return !!v && !(r.confirmed && r.confirmed.release===v) && !(r.followups||[]).some(f=>f.release===v); }
function closeTrack(){ trackFor = null; trackMore = false; trackNote = ""; trackState = null; }
function trackPanel(){
  if (!trackFor) return "";
  const r = loadAll()[trackFor]; if (!r) return "";
  const c = code(r), v = fixedIn(c), st = statusOf(c), rel = v ? relOf(v) : null;
  const ups = (r.followups||[]), adds = (r.added||[]), conf = r.confirmed && r.confirmed.release===v ? r.confirmed : null;
  const step = (state, title, sub) => `<li class="tl tl-${state}"><span class="tdot"></span><div><b>${esc(title)}</b>${sub?`<small>${esc(sub)}</small>`:""}</div></li>`;
  const L = [step("done","Sent to Daddy", tsDate(r.sent))];
  adds.forEach(a=>L.push(step("done","Harry told Daddy more", `${tsDate(a.at)} · "${a.note}"`)));
  if (v) L.push(step("done", st && !v ? st : "Daddy's looking at it", ""));
  else L.push(step(st?"now":"next", st || "Daddy's looking at it", st ? "" : "Waiting for Daddy"));
  L.push(step(v?"done":"next", v ? `Fixed in ${v}` : "Fixed in a new version", v ? relDate(rel?.date) : "Not yet"));
  ups.forEach(f=>L.push(step("done", `Harry said: ${f.choice}`, `${tsDate(f.at)} · on ${f.release}`)));
  if (ups.some(f=>f.release===v)) L.push(step("now","Daddy's looking again","He'll do this before anything new"));
  else if (v) L.push(step(conf?"done":"now", conf ? "Harry checked: it's fixed" : "Harry checks it", conf ? tsDate(conf.at) : "Get the new version, then try it"));
  let actions = "";
  if (trackState==="thanks") actions = `<p class="relhow big">Thanks Harry. Daddy's been told it works.</p>`;
  else if (trackState==="added") actions = `<p class="relhow big">Sent. Daddy will read it with your report.</p>`;
  else if (trackMore) actions = `<textarea id="trknote" class="fbmsg" rows="3" placeholder="What else should Daddy know?">${esc(trackNote)}</textarea>
      ${trackState==="failed"?`<p class="relhow">It couldn't reach Daddy just now. Try again in a bit.</p>`:""}
      <div class="row2"><button class="tile mm" id="trkcancel">Back</button><button class="tile mm primary" id="trksendmore"${trackState==="sending"?" disabled":""}>${trackState==="sending"?"Sending…":"Send to Daddy"}</button></div>`;
  else if (needsCheck(r)) actions = `<p class="relhow big">Is it fixed now?</p>
      ${trackState==="failed"?`<p class="relhow">It couldn't reach Daddy just now. Try again in a bit.</p>`:""}
      <div class="row2"><button class="tile mm okbtn" id="trkyes"${trackState==="sending"?" disabled":""}>Yes, it's fixed</button><button class="tile mm fbbtn" data-fb="${r.id}">No, not quite</button></div>`;
  else if (!v) actions = `<button class="tile mm" id="trkmore">Tell Daddy more</button>`;
  return `<div class="homeover" data-close="track"><div class="inner trackpanel">
    <div class="trkhead"><span class="rkind k-${r.kind}"></span><div><div class="listlabel">${esc(fbTitle(r))}</div><small>${esc(KINDS[r.kind]?.word||"")} · ${esc(c)}</small></div></div>
    ${r.text?`<p class="trkwords">"${esc(r.text)}"</p>`:""}
    <ol class="timeline">${L.join("")}</ol>
    ${actions}
    <button class="tile mm closeover" data-close="track">Close</button></div></div>`;
}
async function postToDaddy(r, said, text){
  let ok = false;
  try {
    const res = await fetch(SEND_URL, {method:"POST", headers:{"Content-Type":"text/plain;charset=utf-8"},
      body: JSON.stringify({key:SEND_KEY, device:deviceToken(), code:code(r), kind:r.kind, said, text, shot:null})});
    const j = await res.json(); noteDeviceError(j); ok = !!j.ok;
  } catch(e){}
  if (!ok && navigator.share){ try { await navigator.share({text}); ok = true; } catch(e){} }
  return ok;
}
function saveRec(id, fn){ const all = loadAll(); if (all[id]){ fn(all[id]); try { localStorage.setItem(STORE, JSON.stringify(all)); } catch(e){} } }
async function confirmFixed(){
  const r = loadAll()[trackFor]; if (!r) return; const c = code(r), v = fixedIn(c);
  trackState = "sending"; render();
  const text = [`[Harry's Beta Testing] CONFIRMED · report ${c} · release ${v}`, "",
    `Harry checked report ${c} (${KINDS[r.kind]?.word||r.kind} about ${fbTitle(r)}) on ${v} and says it's fixed.`,
    `Add-on: Harry's Equestrian ${versionText()} · iPad Pro`, "", "For the builder:",
    `- Nothing to build. Mark report ${c} as confirmed by Harry and label this email Done. It does not use Harry's daily report.`].join("\n");
  const ok = await postToDaddy(r, `Confirmed fixed in ${v}`, text);
  if (!ok){ trackState = "failed"; render(); return; }
  saveRec(r.id, rec=>{ rec.confirmed = {release:v, at:Date.now()}; });
  trackState = "thanks"; render();
}
async function sendMore(){
  const r = loadAll()[trackFor]; if (!r) return; const c = code(r);
  const m = document.getElementById("trknote"); if (m) trackNote = m.value; const note = trackNote.trim(); if (!note) return;
  trackState = "sending"; render();
  const text = [`[Harry's Beta Testing] MORE INFO · report ${c}`, "",
    `Harry added more to report ${c} (${KINDS[r.kind]?.word||r.kind} about ${fbTitle(r)}), which isn't fixed yet.`,
    `Original words: ${r.text||"(none)"}`, `Harry's new words: ${note}`,
    `Add-on: Harry's Equestrian ${versionText()} · iPad Pro`, "", "For the builder:",
    `- Not a new report: find the original email by "${c}" and read this with it. It does not use Harry's daily report.`].join("\n");
  const ok = await postToDaddy(r, `More info: ${note.slice(0,40)}`, text);
  if (!ok){ trackState = "failed"; render(); return; }
  saveRec(r.id, rec=>{ rec.added = [...(rec.added||[]), {at:Date.now(), note}]; });
  trackMore = false; trackNote = ""; trackState = "added"; render();
}
function wireTrack(){
  document.querySelectorAll("[data-track]").forEach(b=>b.onclick=e=>{ e.stopPropagation(); closeTrack(); trackFor=b.dataset.track; render(); });
  const $ = id => document.getElementById(id);
  $("trkyes") && ($("trkyes").onclick=confirmFixed);
  $("trkmore") && ($("trkmore").onclick=()=>{ trackMore=true; trackState=null; render(); });
  $("trkcancel") && ($("trkcancel").onclick=()=>{ trackMore=false; trackState=null; render(); });
  const n = $("trknote"); if (n) n.oninput=()=>{ trackNote=n.value; };
  $("trksendmore") && ($("trksendmore").onclick=sendMore);
}

/* ---------- Mod features: a store-style gallery of what's in the mod ---------- */
const FEATURES = [
  {id:"yard", img:"yard", title:"Harry's Yard", tag:"Your own riding centre", upd:"1.7", pts:["Built like the real riding centre, ready when you load the world","Stables, paddocks, a car park and the jump field","Everything is reachable by tapping, with no commands"]},
  {id:"stables", img:"stables", title:"Stables and arenas", tag:"Indoor school and outdoor arena", upd:"1.7", pts:["A stable block with a stall for every horse","An indoor school and an outdoor arena with poles and cones","Mess spreads to empty stalls if nobody mucks out"]},
  {id:"horses", img:"horses", title:"The yard horses", tag:"17 horses from the real yard", upd:"1.9", pts:["Every horse from the real yard, with matching coats","Each one has its own personality and a passport","Calm mode for gentle riding"]},
  {id:"designer", img:"herd", title:"Horse Designer", tag:"Make your own horse", upd:"1.8", pts:["23 breeds to choose from","Coat colours, patterns, manes and tails","Face and leg markings"]},
  {id:"foals", img:"foals", title:"Foals and twins", tag:"Foals that grow up", upd:"4.0", pts:["Foals grow up over time, even when you're far away","Sometimes twins are born","Lead a foal, and when you let go it walks back to its mum"]},
  {id:"tack", img:"tack", title:"Tack and gear", tag:"Saddles, bridles and armour", upd:"3.0", pts:["English and western tack","Racks to keep it tidy","Copper, iron, gold, diamond and netherite armour"]},
  {id:"shows", img:"shows", title:"Shows and rosettes", tag:"Jump, bend and race", upd:"2.0", pts:["Clear round, bending poles and barrel racing","Every rider gets a rosette","Rosettes go in the Hall of Fame"]},
  {id:"course", img:"course", title:"Jumping", tag:"Hold to jump higher", upd:"3.0", pts:["Hold jump for a higher jump, up to 6 blocks","Jump standards that sort themselves when stacked","Your horse gets better the more it jumps"]},
  {id:"trips", img:"trips", title:"Hacks and horsebox trips", tag:"Go to the beach and the forest", upd:"2.0", pts:["Marked hacks around the yard","Load up the horsebox for a day out","Trips to the beach and the forest"]},
  {id:"yardday", img:"yardday", title:"Yard Day", tag:"Look after the yard", upd:"1.10", pts:["A Jobs Board with jobs to do","Turn out and Goodnight Horses","Fran the Farrier visits, and the Paddock Feeder keeps hay topped up"]},
  {id:"flying", img:"flying", title:"Galaxy coats and flying", tag:"Horses that fly", upd:"4.0", pts:["A Fly! button in the horse menu","A checklist shows what your horse still needs to fly","Galaxy and surprise coats"]},
  {id:"hobby", img:"hobby", title:"Hobby horses", tag:"Ride a hobby horse", upd:"3.0", pts:["A whole set of hobby horses to collect","Each one looks like a horse from the yard","Hold it and gallop around"]},
  {id:"guide", img:"guide", title:"The Horse Guide", tag:"Everything with a tap", upd:"1.6", pts:["Every part of the mod is in the Horse Guide","The Horse Book has 52 horse cards","You never need to type a command"]}
];
var showFeat = false, featPick = null, featHero = 0;
function featImg(f){ return `features/${f.img}.jpg`; }
function featPanel(){
  if (!showFeat) return "";
  const names = Object.assign({}, UPDATE_NAMES, REL?.update_names||{});
  if (featPick){
    const f = FEATURES.find(x=>x.id===featPick);
    return `<div class="homeover" data-close="feat"><div class="inner featpanel featdetail">
      <img class="feathero" src="${featImg(f)}" alt="">
      <div class="featbody"><div class="relhead"><b>${esc(f.title)}</b><span class="vtag2">Came in ${esc(f.upd)}${names[f.upd]?` ${esc(names[f.upd])}`:""}</span></div>
        <ul class="relnotes">${f.pts.map(p=>`<li>${esc(p)}</li>`).join("")}</ul></div>
      <div class="row2"><button class="tile mm" id="featback">Back to all features</button><button class="tile mm fbbtn" id="featbug">Something wrong? Report bug</button></div>
      <button class="tile mm closeover" data-close="feat">Close</button></div></div>`;
  }
  const h = FEATURES[featHero % FEATURES.length];
  return `<div class="homeover" data-close="feat"><div class="inner featpanel">
    <div class="listlabel">Features</div>
    <div class="herowrap"><button class="heroimg" data-feat="${h.id}" style="background-image:url('${featImg(h)}')"><span class="herocap"><b>${esc(h.title)}</b><small>${esc(h.tag)}</small></span></button>
      <button class="heroarrow l" id="heroprev" aria-label="Previous">&lsaquo;</button><button class="heroarrow r" id="heronext" aria-label="Next">&rsaquo;</button></div>
    <div class="herodots">${FEATURES.map((f,i)=>`<span class="${i===featHero%FEATURES.length?"on":""}"></span>`).join("")}</div>
    <div class="featgrid">${FEATURES.map(f=>`<button class="feattile" data-feat="${f.id}"><img src="${featImg(f)}" alt="" loading="lazy"><b>${esc(f.title)}</b><small>${esc(f.tag)}</small></button>`).join("")}</div>
    <button class="tile mm closeover" data-close="feat">Close</button></div></div>`;
}
function wireFeat(){
  const $ = id => document.getElementById(id);
  $("featbtn") && ($("featbtn").onclick=()=>{ showFeat=true; featPick=null; render(); });
  document.querySelectorAll("[data-feat]").forEach(b=>b.onclick=()=>{ featPick=b.dataset.feat; render(); document.querySelector(".featpanel")?.scrollTo(0,0); });
  $("heroprev") && ($("heroprev").onclick=()=>{ featHero=(featHero+FEATURES.length-1)%FEATURES.length; render(); });
  $("heronext") && ($("heronext").onclick=()=>{ featHero=(featHero+1)%FEATURES.length; render(); });
  $("featback") && ($("featback").onclick=()=>{ featPick=null; render(); });
  $("featbug") && ($("featbug").onclick=()=>{ showFeat=false; featPick=null; document.querySelector('[data-v="broken"]')?.click(); });
}
