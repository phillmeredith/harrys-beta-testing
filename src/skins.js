/* ---------- Skin maker (skins.phillm.dev): report choices + home-screen player ---------- */
const SKINS_URL = "https://skins.phillm.dev/";
const isSkins = (s=S) => s.app === "skins";
const APPS = [
  {v:"app:mod", label:"My mod", sub:"Harry's Equestrian"},
  {v:"app:skins", label:"Skin maker", sub:"skins.phillm.dev"}
];
const SKIN_TREE = [
  {l:"Drawing and painting", tp:"skin", k: leaves(["Pencil","Eraser","Paint bucket","Picking a colour","Copying a colour from the skin","Brush size","Undo and redo","Drawing on both sides at once"], "skin:draw:", "skin")},
  {l:"The 3D model", tp:"skin", k: leaves(["Turning it round","Zooming in and out","Showing or hiding parts","The outer layer (hat and jacket)","Making it walk or pose"], "skin:model:", "skin")},
  {l:"Parts of the skin", tp:"skin", k: leaves(["Head","Face","Body","Arms","Legs","Hat layer","Jacket and sleeves layer"], "skin:part:", "skin")},
  {l:"Starting a skin", tp:"skin", k: leaves(["A new blank skin","A ready-made skin","Opening a skin I made","Opening a picture"], "skin:start:", "skin")},
  {l:"Saving and my skins", tp:"skin", k: leaves(["Saving","My saved skins","Renaming a skin","Deleting a skin"], "skin:save:", "skin")},
  {l:"Getting it into Minecraft", tp:"skin", k: leaves(["Downloading the skin","Putting it on in Minecraft","Thin arms or wide arms","It looks different in the game"], "skin:mc:", "skin")},
  {l:"The page itself", tp:"skin", k: leaves(["Opening the page","Buttons","Menus","Words on the page","It's slow"], "skin:page:", "skin")}
];
const SKIN_UNSURE = {l:"I'm not sure", id:"skin:unsure", tp:"skin", vague:true};
const SKIN_DOING = ["Drawing","Picking a colour","Turning the 3D model","Opening a skin","Saving","Downloading","Putting it in Minecraft","Don't know"];
const SKIN_TAPPED = ["Tapped on the skin","Pressed a button","Picked a tool","Dragged to turn it","Pinched to zoom","Pressed undo","Pressed save or download","Don't know"];
BROKEN.push(
  {id:"skin_colour",label:"Wrong colour",exp:"it paints the colour I picked",act:"it painted the wrong colour"},
  {id:"skin_wontopen",label:"Wouldn't open",exp:"the page or skin opens",act:"the page or skin would not open"},
  {id:"skin_lost",label:"Lost my skin",exp:"my skin is saved and still there",act:"the skin or my drawing went missing"},
  {id:"skin_ingame",label:"Wrong in Minecraft",exp:"the skin looks the same in Minecraft as in the skin maker",act:"it looked different or didn't work in Minecraft"},
  {id:"skin_frozen",label:"Page froze or closed",exp:"the page keeps working",act:"the skin maker froze or closed"});
BROKEN_FOR.other = ["vanished","stuck","looks","nothing","wrongthing","lost","crash","sound"];
BROKEN_FOR.skin = ["looks","skin_colour","nothing","wrongthing","skin_wontopen","skin_lost","skin_ingame","skin_frozen"];

/* A blocky player for the home screen, drawn from a 64x64 skin in the standard layout
   (so a real skin PNG can be dropped in later). Original rider design, not Steve. */
function makeRiderSkin(){
  const c = document.createElement("canvas"); c.width = c.height = 64; const g = c.getContext("2d");
  let seed = 7; const rnd = () => (seed = (seed*16807) % 2147483647) / 2147483647;
  const shade = (hex, k) => { const n = parseInt(hex.slice(1),16); const f = v => Math.max(0,Math.min(255,Math.round(v*k))); return `rgb(${f(n>>16)},${f(n>>8&255)},${f(n&255)})`; };
  const fill = (x,y,w,h,col,j=.08) => { for(let i=0;i<w;i++) for(let k=0;k<h;k++){ g.fillStyle = shade(col, 1 - j + rnd()*j*2); g.fillRect(x+i,y+k,1,1); } };
  const box = (u,v,w,h,d,col) => { fill(u+d,v,w,d,col); fill(u+d+w,v,w,d,col); fill(u,v+d,2*(w+d),h,col); };
  const SK="#C68E62", HAIR="#5A3720", JACKET="#24406E", COLLAR="#E9E4D8", JOD="#E4D6B5", BOOT="#1E1A18";
  // head
  box(0,0,8,8,8,SK); fill(8,0,8,8,HAIR); fill(24,8,8,8,HAIR); fill(0,8,8,3,HAIR); fill(16,8,8,3,HAIR); fill(0,11,2,2,HAIR); fill(22,11,2,2,HAIR);
  fill(8,8,8,2,HAIR); fill(8,10,1,1,HAIR); fill(15,10,1,1,HAIR);
  g.fillStyle="#FFFFFF"; g.fillRect(9,12,2,1); g.fillRect(13,12,2,1); g.fillStyle="#3D6FB8"; g.fillRect(10,12,1,1); g.fillRect(13,12,1,1);
  fill(11,14,2,1,"#A0604A",.03);
  // body (jacket with white collar and buttons)
  box(16,16,8,12,4,JACKET); fill(23,20,2,2,COLLAR,.03); fill(22,20,1,1,COLLAR,.03); fill(25,20,1,1,COLLAR,.03); fill(24,22,1,10,"#1B3156",.03);
  g.fillStyle="#D8B45A"; g.fillRect(23,24,1,1); g.fillRect(23,27,1,1);
  // arms: sleeves + hands
  box(40,16,4,12,4,JACKET); fill(40,30,16,2,SK); fill(48,16,4,4,SK);
  box(32,48,4,12,4,JACKET); fill(32,62,16,2,SK); fill(40,48,4,4,SK);
  // legs: jodhpurs + tall boots
  box(0,16,4,12,4,JOD); fill(0,25,16,7,BOOT); fill(8,16,4,4,BOOT);
  box(16,48,4,12,4,JOD); fill(16,57,16,7,BOOT); fill(24,48,4,4,BOOT);
  return c.toDataURL();
}
let RIDER_SKIN = null;
function playerHTML(){
  if (!RIDER_SKIN) RIDER_SKIN = makeRiderSkin();
  const P = (cls, u, v, w, h, d, x, y) => {
    const f = (name, fu, fv, fw, fh, tr, pos) => `<i class="pf ${name}" style="width:calc(var(--px)*${fw});height:calc(var(--px)*${fh});${pos||""}background-position:calc(var(--px)*${-fu}) calc(var(--px)*${-fv});transform:${tr}"></i>`;
    const W = `calc(var(--px)*${w})`, H = `calc(var(--px)*${h})`, D2 = `calc(var(--px)*${d/2})`;
    return `<div class="pb ${cls}" style="width:${W};height:${H};left:calc(var(--px)*${x});top:calc(var(--px)*${y})">
      ${f("front", u+d, v+d, w, h, `translateZ(${D2})`)}
      ${f("back", u+2*d+w, v+d, w, h, `rotateY(180deg) translateZ(${D2})`)}
      ${f("right", u, v+d, d, h, `rotateY(-90deg) translateZ(calc(var(--px)*${w/2}))`, `left:calc(var(--px)*${(w-d)/2});`)}
      ${f("left", u+d+w, v+d, d, h, `rotateY(90deg) translateZ(calc(var(--px)*${w/2}))`, `left:calc(var(--px)*${(w-d)/2});`)}
      ${f("top", u+d, v, w, d, `rotateX(90deg) translateZ(calc(var(--px)*${h/2}))`, `top:calc(var(--px)*${(h-d)/2});`)}
      ${f("bottom", u+d+w, v, w, d, `rotateX(-90deg) translateZ(calc(var(--px)*${h/2}))`, `top:calc(var(--px)*${(h-d)/2});`)}
    </div>`;
  };
  return `<div class="player" aria-hidden="false">
    <div class="nametag">Harry</div>
    <div class="pstage" style="--skin:url(${RIDER_SKIN})"><div class="pfig">
      ${P("phead",0,0,8,8,8,4,0)}${P("pbody",16,16,8,12,4,4,8)}
      ${P("parm r",40,16,4,12,4,0,8)}${P("parm l",32,48,4,12,4,12,8)}
      ${P("pleg r",0,16,4,12,4,4,20)}${P("pleg l",16,48,4,12,4,8,20)}
    </div></div>
    <a class="tile mm skinbtn" href="${SKINS_URL}" target="_blank" rel="noopener">Create skin</a>
  </div>`;
}
