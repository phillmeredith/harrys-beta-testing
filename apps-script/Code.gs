/**
 * Harry's Beta Testing: report inbox.
 * Receives a report from the app and emails it to you (the owner of this script),
 * with Harry's screenshot attached. It can only SEND mail (MailApp), never read it.
 *
 * Setup (once):
 * 1. Go to script.google.com, New project, paste this file over Code.gs, Save.
 * 2. Deploy > New deployment > type "Web app".
 *    Execute as: Me.   Who has access: Anyone.   Deploy, allow the permissions.
 * 3. Copy the Web app URL (ends in /exec) and send it to Claude.
 *
 * Device pairing (2026-11-18): only paired devices can send.
 * 4. Project Settings (gear) > Script properties > Add: PAIR_CODE = a 6-digit PIN only you know.
 * 5. On each device, open the app, tap "Set up this device", type that word and pick its name.
 *    Paired devices are kept in the DEVICES script property. Delete one there to unpair it.
 *    Change PAIR_CODE any time; already-paired devices keep working.
 * When updating this script: Deploy > Manage deployments > edit (pencil) > Version: New version > Deploy,
 * so the /exec link stays the same.
 */

const KEY = "hbt-7Qm2xR9vK4"; // must match SEND_KEY in the app
const KIND_LABEL = { broken: "Broken", better: "Make it better", idea: "New idea" };
const MAX_PER_DAY = 40;      // stops a flood if someone finds the link

function doPost(e) {
  try {
    const r = JSON.parse(e.postData.contents);
    if (r.key !== KEY) return out({ ok: false, error: "key" });
    if (r.pair !== undefined) return pairDevice(r);
    const dev = devices()[String(r.device || "")];
    if (r.check !== undefined) return out({ ok: !!dev, name: dev ? dev.name : null });
    if (!dev) return out({ ok: false, error: "device" });
    if (!underDailyLimit()) return out({ ok: false, error: "limit" });

    const code = String(r.code || "HBT-????").slice(0, 12);
    const kind = KIND_LABEL[r.kind] ? r.kind : "idea";
    const said = String(r.said || "").replace(/\s+/g, " ").slice(0, 70);
    const subject = `[Harry's Beta Testing] ${code} ${KIND_LABEL[kind]}: ${said}`;
    const body = `Sent from: ${dev.name}\n\n` + String(r.text || "").slice(0, 20000);

    const opts = { name: "Harry's Beta Testing" };
    if (r.shot && /^data:image\//.test(r.shot)) {
      const [head, b64] = r.shot.split(",");
      const mime = head.match(/data:(.*?);/)[1];
      opts.attachments = [Utilities.newBlob(Utilities.base64Decode(b64), mime, `${code}.jpg`)];
    }

    // Send-only: MailApp can send mail but can never read your inbox.
    // A Gmail filter on "Harry's Beta Testing" in the subject files it under the label.
    MailApp.sendEmail(Object.assign({ to: Session.getEffectiveUser().getEmail(), subject, body }, opts));
    return out({ ok: true, code });
  } catch (err) {
    return out({ ok: false, error: String(err) });
  }
}

// Lets you check the link works by opening it in a browser.
function doGet() { return out({ ok: true, hello: "Harry's Beta Testing inbox is running" }); }

function devices() { try { return JSON.parse(PropertiesService.getScriptProperties().getProperty("DEVICES") || "{}"); } catch (e) { return {}; } }
function pairDevice(r) {
  const p = PropertiesService.getScriptProperties(), code = p.getProperty("PAIR_CODE") || "";
  const day = new Date().toDateString(), fails = p.getProperty("pairday") === day ? Number(p.getProperty("pairfails") || 0) : 0;
  if (fails >= 10) return out({ ok: false, error: "locked" });            // too many wrong codes today
  if (!code || String(r.pair).trim().toLowerCase() !== code.trim().toLowerCase()) {
    p.setProperties({ pairday: day, pairfails: String(fails + 1) });
    return out({ ok: false, error: "code" });
  }
  const name = String(r.name || "Device").slice(0, 40), token = Utilities.getUuid(), all = devices();
  all[token] = { name, at: new Date().toISOString() };
  p.setProperty("DEVICES", JSON.stringify(all));
  return out({ ok: true, token, name });
}
function out(o) { return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON); }
function underDailyLimit() {
  const p = PropertiesService.getScriptProperties(), day = new Date().toDateString();
  const n = p.getProperty("day") === day ? Number(p.getProperty("n") || 0) : 0;
  if (n >= MAX_PER_DAY) return false;
  p.setProperties({ day, n: String(n + 1) });
  return true;
}
