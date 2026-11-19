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
function makeRiderSkin(){  // Harry: long strawberry-blond hair, olive hat cover with a grey pompom (drawn at 48,0), olive top with rust sleeves, jodhpurs, paddock boots
  const c = document.createElement("canvas"); c.width = c.height = 64; const g = c.getContext("2d");
  let seed = 11; const rnd = () => (seed = (seed*16807) % 2147483647) / 2147483647;
  const shade = (hex, k) => { const n = parseInt(hex.slice(1),16); const f = v => Math.max(0,Math.min(255,Math.round(v*k))); return `rgb(${f(n>>16)},${f(n>>8&255)},${f(n&255)})`; };
  const fill = (x,y,w,h,col,j=.08) => { for(let i=0;i<w;i++) for(let k=0;k<h;k++){ g.fillStyle = shade(col, 1 - j + rnd()*j*2); g.fillRect(x+i,y+k,1,1); } };
  const px = (x,y,col) => { g.fillStyle = col; g.fillRect(x,y,1,1); };
  const box = (u,v,w,h,d,col) => { fill(u+d,v,w,d,col); fill(u+d+w,v,w,d,col); fill(u,v+d,2*(w+d),h,col); };
  // long wavy hair: strawberry blond with lighter and darker strands
  const hair = (x,y,w,h) => { for(let i=0;i<w;i++) for(let k=0;k<h;k++){ const r=rnd(); g.fillStyle = r<.22 ? "#E7A766" : r<.4 ? "#A85A2A" : shade("#C9803F", .94+rnd()*.12); g.fillRect(x+i,y+k,1,1); } };
  const SK="#EDC3A2", HELM="#4A4636", HELM_D="#38352A", PEAK="#1A1A1C", TOP="#4B4938", SLEEVE="#9C5A2A", JOD="#504C3D", JOD_D="#454233", BOOT="#2B211C";
  // head: fair skin, riding hat on top (olive cover, black peak), hair down both sides and the back
  box(0,0,8,8,8,SK);
  fill(8,0,8,8,HELM); fill(16,0,8,8,HELM_D);                 // hat top, underside
  fill(0,8,32,3,HELM);                                        // hat band all round (rows 8-10)
  fill(8,10,8,1,PEAK,.02);                                    // black peak over the eyes
  px(9,9,"#CFC9B8"); px(10,9,"#BDB7A6");  // the little silver logo on the cover
  hair(8,11,1,5); hair(15,11,1,5);                            // hair framing the face
  hair(0,11,8,5); hair(16,11,8,5); hair(24,11,8,5);           // sides and back of the head
  px(1,11,SK); px(2,11,SK); px(21,11,SK); px(22,11,SK);       // a bit of cheek showing by the ears
  // face: blue eyes, rosy cheeks, freckles, a smile
  px(9,12,"#FFFFFF"); px(10,12,"#4E86C6"); px(13,12,"#4E86C6"); px(14,12,"#FFFFFF");
  px(9,13,"#E9A08E"); px(14,13,"#E9A08E"); px(10,13,"#C98A66"); px(13,13,"#C98A66"); px(11,13,"#C98A66");
  px(10,14,"#C98272"); px(11,15,"#C47468"); px(12,15,"#C47468"); px(13,14,"#C98272");
  // chin strap
  px(8,15,PEAK); px(15,15,PEAK);
  // body: olive base layer with a copper zip stripe, long hair over the shoulders and down the back
  box(16,16,8,12,4,TOP);
  fill(23,20,2,3,"#3E3C2E",.03); px(24,20,"#C07A3A"); px(24,21,"#9A9A9A"); px(23,20,"#3A382C");
   // copper piping down the front
  px(22,21,"#111111"); px(25,21,"#111111"); px(23,22,"#111111"); px(24,23,"#111111"); fill(23,24,2,3,"#1C1C1E",.02); // lanyard and whistle
  hair(20,20,1,5); hair(27,20,1,5);                           // hair over the shoulders
  hair(32,20,8,8); hair(33,28,6,1); hair(34,29,4,1);          // long hair down the back
  hair(16,20,4,3); hair(28,20,4,3);                           // and over the sides
  // arms: rust sleeves, hands
  box(40,16,4,12,4,SLEEVE); fill(40,30,16,2,SK); fill(48,16,4,4,SK); fill(44,16,4,4,SLEEVE);
  box(32,48,4,12,4,SLEEVE); fill(32,62,16,2,SK); fill(40,48,4,4,SK); fill(36,48,4,4,SLEEVE);
  // legs: olive jodhpurs with knee patches, short zip paddock boots
  box(0,16,4,12,4,JOD); fill(4,24,4,3,JOD_D,.04); fill(0,28,16,4,BOOT); fill(8,16,4,4,BOOT); px(6,28,"#5A4A40"); px(6,29,"#5A4A40");
  box(16,48,4,12,4,JOD); fill(20,56,4,3,JOD_D,.04); fill(16,60,16,4,BOOT); fill(24,48,4,4,BOOT); px(21,60,"#5A4A40"); px(21,61,"#5A4A40");
  // pompom on top of the hat (a 2x2x2 box at 56,0)
  for(let i=0;i<16;i++) for(let k=0;k<8;k++){ g.fillStyle = shade("#B9B6B2", .85+rnd()*.3); g.fillRect(48+i,k,1,1); }
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
      ${P("phead",0,0,8,8,8,4,0).replace(/<\/div>\s*$/, P("ppom",48,0,4,4,4,2,-3.4) + "</div>")}${P("pbody",16,16,8,12,4,4,8)}
      ${P("parm r",40,16,4,12,4,0,8)}${P("parm l",32,48,4,12,4,12,8)}
      ${P("pleg r",0,16,4,12,4,4,20)}${P("pleg l",16,48,4,12,4,8,20)}
    </div></div>
    <a class="tile mm skinbtn" href="${SKINS_URL}" target="_blank" rel="noopener">Create skin</a>
  </div>`;
}
