
/* ---------- Real send: the iPad's own share sheet (replaces the mockup sheet above) ---------- */
function dataURLtoFile(u, name){
  const [h, b] = u.split(","), mime = h.match(/:(.*?);/)[1], bin = atob(b), arr = new Uint8Array(bin.length);
  for (let i=0;i<bin.length;i++) arr[i] = bin.charCodeAt(i);
  return new File([arr], name, {type:mime});
}
function markSent(){ S.sent = Date.now(); persist(); S.step = "done"; render(); }
/* Daddy's inbox: a Google Apps Script web app that emails the report to Phill's Gmail, labelled. Empty = use the share sheet. */
const SEND_URL = "https://script.google.com/macros/s/AKfycbwBffMumMoI-XmtIphJ2w4hcSFcgP6zrOc9TzRPrSQg3a-u8lhRPNHlHnoeg_JyU23K/exec";
const SEND_KEY = "hbt-7Qm2xR9vK4";
async function sendToInbox(text){
  const btn = document.getElementById("send"); if (btn){ btn.disabled = true; btn.textContent = "Sending…"; }
  try {
    const res = await fetch(SEND_URL, {method:"POST", headers:{"Content-Type":"text/plain;charset=utf-8"},
      body: JSON.stringify({key:SEND_KEY, device:deviceToken(), code:code(), kind:S.kind, said:S.text, text, shot:S.shot||null})});
    const j = await res.json(); noteDeviceError(j);
    if (j.ok) return true;
  } catch(e){}
  if (btn){ btn.disabled = false; btn.textContent = "Send to Daddy"; }
  return false;
}
async function shareSheet(){
  clearTimeout(autoTimer); S.text = document.getElementById("msg")?.value ?? S.text; persist();
  const text = prompt();
  if (SEND_URL){
    if (navigator.onLine !== false && await sendToInbox(text)){ S.via = "inbox"; markSent(); return; }
    S.sendFailed = true;
  }
  if (navigator.share){
    const data = {text};
    if (S.shot){
      try { const f = dataURLtoFile(S.shot, `${code()}.jpg`); if (navigator.canShare && navigator.canShare({files:[f]})) data.files = [f]; } catch(e){}
    }
    try { await navigator.share(data); markSent(); return; }
    catch(e){ if (e && e.name === "AbortError") return; /* closed without sending: stays in "Not sent yet" */ }
  }
  fallbackSend(text);
}
function fallbackSend(text){
  const L = document.getElementById("layer");
  let copied = false;
  try { navigator.clipboard.writeText(text).then(()=>{ copied = true; const s=document.getElementById("cpstate"); if(s) s.textContent="Copied. "; }).catch(()=>{}); } catch(e){}
  L.innerHTML = `<div class="scrim" id="scrim" style="align-items:center;padding:16px"><div class="panel" style="max-width:560px;width:100%">
    <h2>Send it to Daddy</h2>${S.sendFailed?`<p style="margin:0">It couldn’t reach Daddy’s email just now, so send it by Messages instead.</p>`:""}
    <p style="margin:0"><span id="cpstate"></span>Open Messages, pick Daddy, and paste it in.</p>
    <div class="btns"><a class="go small" style="text-decoration:none" id="sms" href="sms:&body=${encodeURIComponent(text)}">Open Messages</a></div>
    <div class="btns"><button class="go quiet small" id="notyet">Not yet</button><button class="go small" id="didsend">I sent it</button></div>
  </div></div>`;
  document.getElementById("notyet").onclick = () => { L.innerHTML = ""; };
  document.getElementById("didsend").onclick = () => { L.innerHTML = ""; markSent(); };
}
if ("serviceWorker" in navigator && location.protocol === "https:") { navigator.serviceWorker.register("sw.js").catch(()=>{}); }


/* ---------- Device pairing: only paired devices (Harry's iPad, Daddy's device) can use the app and send ---------- */
const DEVICE = "hbt_device";
var lockView = "locked", lockCode = "", lockName = null, lockState = null; // lockState: null | "pairing" | "bad" | "locked" | "offline"
function deviceInfo(){ try { return JSON.parse(localStorage.getItem(DEVICE)||"null"); } catch(e){ return null; } }
function deviceToken(){ return deviceInfo()?.token || ""; }
function forgetDevice(){ try { localStorage.removeItem(DEVICE); } catch(e){} }
function noteDeviceError(j){ if (j && j.ok===false && j.error==="device"){ forgetDevice(); lockView="locked"; render(); } }
function renderLock(){
  document.body.classList.add("home");
  const app = document.getElementById("app");
  const names = ["Harry's iPad","Daddy's device"];
  const msg = {bad:"That code isn't right. Check it and try again.", locked:"Too many wrong codes today. Try again tomorrow.", offline:"Couldn't reach Daddy's inbox. Check the internet and try again."}[lockState] || "";
  const body = lockView==="setup"
    ? `<div class="lockpanel"><div class="listlabel">Set up this device</div>
        <p class="relhow">Daddy only. Type the setup code and choose which device this is.</p>
        <input id="paircode" class="paircode" type="password" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="Setup code" value="${esc(lockCode)}">
        <div class="row2">${names.map(n=>`<button class="tile mm${lockName===n?" primary":""}" data-pairname="${esc(n)}">${esc(n)}</button>`).join("")}</div>
        ${msg?`<p class="relhow">${esc(msg)}</p>`:""}
        <div class="row2"><button class="tile mm closeover" id="pairback">Back</button><button class="tile mm primary" id="pairgo"${lockState==="pairing"?" disabled":""}>${lockState==="pairing"?"Setting up…":"Set up"}</button></div></div>`
    : `<div class="lockpanel"><div class="listlabel">This app is set up for Harry's iPad</div>
        <p class="relhow">It only works on devices Daddy has set up.</p>
        <button class="tile mm" id="pairopen">Set up this device</button></div>`;
  app.innerHTML = `<div class="title-screen lockscreen">
      <div class="logo"><div class="lw"><img class="logoimg" src="${LOGO}" alt="Harry's Mod" draggable="false"><span class="badge">Beta</span></div></div>
      ${body}</div>`;
  const $ = id => document.getElementById(id);
  $("pairopen") && ($("pairopen").onclick=()=>{ lockView="setup"; lockState=null; render(); });
  $("pairback") && ($("pairback").onclick=()=>{ lockView="locked"; lockState=null; render(); });
  const c = $("paircode"); if (c) c.oninput=()=>{ lockCode=c.value; };
  document.querySelectorAll("[data-pairname]").forEach(b=>b.onclick=()=>{ lockCode=$("paircode")?.value||lockCode; lockName=b.dataset.pairname; render(); });
  $("pairgo") && ($("pairgo").onclick=pairDevice);
}
async function pairDevice(){
  const c = document.getElementById("paircode"); if (c) lockCode = c.value;
  if (!lockCode.trim() || !lockName){ lockState = null; render(); return; }
  lockState = "pairing"; render();
  try {
    const res = await fetch(SEND_URL, {method:"POST", headers:{"Content-Type":"text/plain;charset=utf-8"},
      body: JSON.stringify({key:SEND_KEY, pair:lockCode.trim(), name:lockName})});
    const j = await res.json();
    if (j.ok && j.token){ try { localStorage.setItem(DEVICE, JSON.stringify({token:j.token, name:j.name, at:Date.now()})); } catch(e){}
      lockView="locked"; lockCode=""; lockState=null; render(); return; }
    lockState = j.error==="locked" ? "locked" : "bad";
  } catch(e){ lockState = "offline"; }
  render();
}
// On open, quietly check this device is still on Daddy's list (he can remove one in the Apps Script settings).
(function checkDevice(){
  const t = deviceToken(); if (!t || !SEND_URL || navigator.onLine === false) return;
  fetch(SEND_URL, {method:"POST", headers:{"Content-Type":"text/plain;charset=utf-8"}, body: JSON.stringify({key:SEND_KEY, device:t, check:1})})
    .then(r=>r.json()).then(j=>{ if (j && j.ok===false && !j.error){ forgetDevice(); lockView="locked"; render(); } }).catch(()=>{});
})();
