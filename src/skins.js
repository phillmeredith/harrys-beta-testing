/* ---------- Skin Studio (skins.phillm.dev): report choices + home-screen player ---------- */
const SKINS_URL = "https://skins.phillm.dev/";
const isSkins = (s=S) => s.app === "skins";
const APPS = [
  {v:"app:mod", label:"My mod", sub:"Harry's Equestrian"},
  {v:"app:skins", label:"Skin Studio", sub:"Making skins"}
];
const SKIN_TREE = [
  {l:"Making a skin", tp:"skin", k:[
    {l:"Human", sub:"Steve or Alex", tp:"skin", k: leaves(["Starting a human skin","Steve shape","Alex shape (thin arms)","Head and face","Body","Arms","Legs","Hat and jacket layer"], "skin:human:", "skin")},
    {l:"Mob", tp:"skin", k: leaves(["Picking a mob","Painting the mob","How the mob looks"], "skin:mob:", "skin")},
    {l:"Item", sub:"Swords, bows, tools", tp:"skin", k: leaves(["Picking an item","Painting the item","How the item looks"], "skin:item:", "skin")},
    {l:"Block", sub:"Grass, stone, TNT", tp:"skin", k: leaves(["Picking a block","Painting the block","How the block looks"], "skin:block:", "skin")}]},
  {l:"Harry's horses", sub:"Horses, foals and families", tp:"skin", k: leaves(["Picking what to make","Choosing a coat to start from","Painting a horse","Painting a foal","Which coat it replaces in the game","A horse family (Mum, Dad and foal)","Switching between the family","Mirror painting on a horse","Hiding parts of the horse"], "skin:horse:", "skin")},
  {l:"Hobby horses", sub:"Horse heads on sticks", tp:"skin", k: leaves(["Picking a hobby horse","Painting a hobby horse","Which hobby horse it replaces","My hobby horse didn't change in the game"], "skin:hobby:", "skin")},
  {l:"Advanced mode", sub:"Layers and special brushes", tp:"skin", k: leaves(["Switching to Advanced","Layers","Hiding or showing a layer","Merging layers","Soft brush","Blend brush","Dither brush","Hair brush","Softness and strength","Close-ups (eyes, nose, ears, mane, tail, hooves)","The colour helpers","Going back to Simple"], "skin:adv:", "skin")},
  {l:"Tack Room", sub:"Saddles, bridles and blankets", tp:"skin", k: leaves(["Opening the Tack Room","Putting tack on a horse","Painting my own tack","The see-through horse","Picking which horse to show it on","Keeping tack on one of my horses","Saving my tack","My tack didn't show in the game"], "skin:tack:", "skin")},
  {l:"Harry's designs", sub:"My own coats, hobby horses and tack in the game", tp:"skin", k: leaves(["Which slot my design goes in","No room left for a design","The Harry's designs pack","Finding my designs in the Horse Guide","The name in the game is wrong","My coat's picture in the Guide","A foal in my coat looks wrong","My tack looks wrong in the game"], "skin:designs:", "skin")},
  {l:"Preview", sub:"Seeing the horse in a world", tp:"skin", k: leaves(["Opening Preview","Riding (moving and turning)","The riding crop and reins","Galloping","Jumping","Poses (graze, rear, lie down, sleep)","Putting tack on","Places, time of day and weather","Photo mode","Taking a picture","Seeing the family together","Riding a hobby horse","Seeing a herd or event together"], "skin:preview:", "skin")},
  {l:"Back Up", sub:"Keeping your skins safe", tp:"skin", k: leaves(["Making a backup","Saving the backup file","Restoring a backup","Something missing after restoring"], "skin:backup:", "skin")},
  {l:"Drawing and painting", tp:"skin", k: leaves(["Pencil","Eraser","Paint bucket","Picking a colour","Copying a colour from the skin","Brush size","Undo and redo","Drawing on both sides at once"], "skin:draw:", "skin")},
  {l:"The 3D model", tp:"skin", k: leaves(["Turning it round","Zooming in and out","Showing or hiding parts","The outer layer (hat and jacket)","Making it walk or pose"], "skin:model:", "skin")},
  {l:"Your skins", sub:"The Create page", tp:"skin", k: leaves(["Saving a skin","The list of your skins","The All, Human, Mob, Item, Block buttons","Opening a skin I made","Renaming a skin","Deleting a skin","Making something new","The 3D pictures","Making a copy","Families","Herds","Christmas, Halloween and Easter","Adding horses to a group","The back button"], "skin:yours:", "skin")},
  {l:"The Library", tp:"skin", k: leaves(["Opening the Library","Finding a skin","Using a skin from the Library","Pictures not showing","It's slow"], "skin:library:", "skin")},
  {l:"Getting it into Minecraft", tp:"skin", k: leaves(["Downloading the skin","Putting it on in Minecraft","Thin arms or wide arms","It looks different in the game","Sending horses to Minecraft","My horse didn't change in the game"], "skin:mc:", "skin")},
  {l:"The page itself", tp:"skin", k: leaves(["Opening the page","The Home button","Other buttons","Words on the page","It's slow"], "skin:page:", "skin")}
];
const SKIN_UNSURE = {l:"I'm not sure", id:"skin:unsure", tp:"skin", vague:true};
const SKIN_DOING = ["Drawing","Picking a colour","Turning the 3D model","Saving","Browsing the Library","Downloading","Putting it in Minecraft","Painting a horse","Riding in Preview","Painting tack","Sorting my stuff","Backing up","Don't know"];
const SKIN_TAPPED = ["Tapped on the skin","Pressed a button","Picked a tool","Dragged to turn it","Pinched to zoom","Pressed undo","Pressed save or download","Don't know"];
BROKEN.push(
  {id:"skin_colour",label:"Wrong colour",exp:"it paints the colour I picked",act:"it painted the wrong colour"},
  {id:"skin_wontopen",label:"Wouldn't open",exp:"the page or skin opens",act:"the page or skin would not open"},
  {id:"skin_lost",label:"Lost my skin",exp:"my skin is saved and still there",act:"the skin or my drawing went missing"},
  {id:"skin_ingame",label:"Wrong in Minecraft",exp:"the skin looks the same in Minecraft as in Skin Studio",act:"it looked different or didn't work in Minecraft"},
  {id:"skin_frozen",label:"Page froze or closed",exp:"the page keeps working",act:"Skin Studio froze or closed"});
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
