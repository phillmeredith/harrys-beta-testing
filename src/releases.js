
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
function relDate(d){ if (!d) return ""; const t = new Date(d+"T12:00:00"); return isNaN(t) ? "" : t.toLocaleDateString("en-GB",{day:"numeric",month:"short",year:"numeric"}); }
function prevPanel(){
  if (!showPrev || !REL) return "";
  const iv = installedVersion(), list = REL.releases || [];
  const card = (r,i) => {
    const notes = (r.notes_for_harry||[]).map(n=>`<li>${esc(n)}</li>`).join("");
    const fixed = (r.fixed||[]).length ? `<p class="relfixed">Fixed your reports: ${(r.fixed||[]).map(esc).join(", ")}</p>` : "";
    const tags = (i===0?`<span class="vtag2">Latest</span>`:"") + (r.version===iv?`<span class="vtag2 have">You've got this</span>`:"");
    return `<div class="relcard"><div class="relhead"><b>${esc(r.version)}</b><span>${esc(relDate(r.date))}</span>${tags}</div>
      ${notes?`<ul class="relnotes">${notes}</ul>`:`<p class="relhow">Small fixes.</p>`}${fixed}
      ${r.file?`<a class="tile mm relget" href="${esc(r.file)}" download>${i===0?"Download":"Download this version"}</a>`:""}</div>`;
  };
  return `<div class="homeover" data-close="prev"><div class="inner savedlist prevpanel"><div class="listlabel">All versions</div>
    <p class="relhow">What changed in each version, newest first.${list.length>1?" Only go back to an older one if Daddy asks.":""}</p>
    ${list.map(card).join("")}<button class="tile mm closeover" data-close="prev">Close</button></div></div>`;
}
function releasePanel(){
  const r = latestRelease(); if (!r || !showRelease) return "";
  const isNew = !!newRelease();
  const notes = (r.notes_for_harry||[]).map(n=>`<li>${esc(n)}</li>`).join("");
  return `<div class="homeover" data-close="rel"><div class="inner savedlist relpanel"><div class="listlabel">${isNew?"What's new in":"You've got"} ${esc(r.version)}</div>${notes?`<ul class="relnotes">${notes}</ul>`:""}
    <a class="tile mm primary" id="getver" href="${esc(r.file)}" download style="text-decoration:none">${isNew?"Download it":"Download it again"}</a>
    <p class="relhow">When it has downloaded, tap it and choose Minecraft. Your world and horses stay safe.</p>
    ${isNew?`<button class="tile mm" id="gotver">I've got it now</button>`:(fbAllowedVer(r.version)?`<button class="tile mm fbbtn" data-fb="ver:${esc(r.version)}">Something not right in this version?</button>`:"")}<button class="tile mm closeover" data-close="rel">Close</button></div></div>`;
}
function reportState(r){
  if (!r.sent) return ["draft","Not sent yet. Tap to finish"];
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
      body: JSON.stringify({key:SEND_KEY, code:fcode, kind:r?.kind||"broken", said:`Follow-up on ${ver}: ${FB_CHOICES[fbPick]}`, text, shot:null})});
    ok = !!(await res.json()).ok;
  } catch(e){}
  if (!ok && navigator.share){ try { await navigator.share({text}); ok = true; } catch(e){} }
  if (!ok){ fbState = "failed"; render(); return; }
  if (r){ const all = loadAll(); const rec = all[r.id]; if (rec){ rec.followups = [...(rec.followups||[]), {release:ver, at:Date.now(), choice:FB_CHOICES[fbPick]}]; try { localStorage.setItem(STORE, JSON.stringify(all)); } catch(e){} } }
  else { try { localStorage.setItem(FB_VER, JSON.stringify([...fbVersions(), ver])); } catch(e){} }
  fbState = "sent"; render();
}
