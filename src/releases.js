
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
  return newRelease()
    ? `<button class="tile mm primary newver" id="newver">New version ${esc(r.version)} is ready!</button>`
    : `<button class="tile mm latestver" id="newver">Latest version ${esc(r.version)}</button>`;
}
function releasePanel(){
  const r = latestRelease(); if (!r || !showRelease) return "";
  const isNew = !!newRelease();
  const notes = (r.notes_for_harry||[]).map(n=>`<li>${esc(n)}</li>`).join("");
  return `<div class="homeover" data-close="rel"><div class="inner savedlist relpanel"><div class="listlabel">${isNew?"What's new in":"You've got"} ${esc(r.version)}</div>${notes?`<ul class="relnotes">${notes}</ul>`:""}
    <a class="tile mm primary" id="getver" href="${esc(r.file)}" download style="text-decoration:none">${isNew?"Download it":"Download it again"}</a>
    <p class="relhow">When it has downloaded, tap it and choose Minecraft. Your world and horses stay safe.</p>
    ${isNew?`<button class="tile mm" id="gotver">I've got it now</button>`:""}<button class="tile mm closeover" data-close="rel">Close</button></div></div>`;
}
function reportState(r){
  if (!r.sent) return ["draft","Not sent yet. Tap to finish"];
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
