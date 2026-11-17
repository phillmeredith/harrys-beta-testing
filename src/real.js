
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
      body: JSON.stringify({key:SEND_KEY, code:code(), kind:S.kind, said:S.text, text, shot:S.shot||null})});
    const j = await res.json();
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
