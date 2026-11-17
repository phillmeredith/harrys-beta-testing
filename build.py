import json, os
from PIL import Image, ImageDraw
out='.'; os.makedirs(out, exist_ok=True)
h=open('src/head.part').read(); mp=open('src/map.part').read()
js=open('src/designer.js').read()+'const MOD = '+open('src/mod.json').read()+';\n'+open('src/mc.js').read()+open('src/flow.js').read()+open('src/maths.js').read()+open('src/real.js').read()
pre='''<!doctype html>
<html lang="en-GB"><head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<meta name="apple-mobile-web-app-title" content="Beta Testing">
<meta name="theme-color" content="#2B1F16">
<meta name="robots" content="noindex,nofollow">
<link rel="manifest" href="manifest.webmanifest">
<link rel="apple-touch-icon" href="icon-180.png">
<link rel="icon" href="icon-180.png">
'''
i=h.index('<div class="app" id="app">')
html=pre+h[:i]+'<style>body{margin:0;padding-top:env(safe-area-inset-top,0px)}</style>\n</head><body>\n'+h[i:]+'<script>\n'+mp+'\n'+js+'</script>\n</body></html>\n'
open(f'{out}/index.html','w').write(html)
json.dump({"name":"Harry's Beta Testing","short_name":"Beta Testing","start_url":"./","scope":"./","display":"standalone","orientation":"any","background_color":"#2B1F16","theme_color":"#2B1F16",
 "icons":[{"src":"icon-180.png","sizes":"180x180","type":"image/png"},{"src":"icon-512.png","sizes":"512x512","type":"image/png","purpose":"any"}]},open(f'{out}/manifest.webmanifest','w'),indent=1)
open(f'{out}/sw.js','w').write('''const C="hbt-v1";
self.addEventListener("install",e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(["./","index.html","manifest.webmanifest","icon-180.png"])));self.skipWaiting();});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C).map(x=>caches.delete(x)))));self.clients.claim();});
self.addEventListener("fetch",e=>{const r=e.request;if(r.method!=="GET")return;
  e.respondWith(fetch(r).then(res=>{const cp=res.clone();caches.open(C).then(c=>c.put(r,cp));return res;}).catch(()=>caches.match(r).then(m=>m||caches.match("index.html"))));});
''')
# icon: grass-topped block with pixel "HBT"
F={'H':["10001","10001","11111","10001","10001"],'B':["11110","10001","11110","10001","11110"],'T':["11111","00100","00100","00100","00100"]}
for size in (512,180):
    g=32; px=size/g; im=Image.new('RGB',(size,size)); d=ImageDraw.Draw(im)
    import random; random.seed(3)
    for y in range(g):
        for x in range(g):
            if y<9: c=random.choice([(92,148,52),(104,160,60),(84,136,46),(112,170,66)])
            elif y<11 and random.random()<.5: c=(92,148,52)
            else: c=random.choice([(134,96,67),(121,85,58),(150,108,74),(110,77,52)])
            d.rectangle([x*px,y*px,(x+1)*px-1,(y+1)*px-1],fill=c)
    x0=4.5
    for ch in "HBT":
        for r,row in enumerate(F[ch]):
            for cc,v in enumerate(row):
                if v=='1':
                    X=(x0+cc*1.4)*px; Y=(15+r*2)*px
                    d.rectangle([X+px*.5,Y+px*.5,X+1.4*px+px*.5,Y+2*px+px*.5],fill=(40,40,40))
                    d.rectangle([X,Y,X+1.4*px-1,Y+2*px-1],fill=(240,240,240))
        x0+=8.5
    im.save(f'{out}/icon-{size}.png')
print(len(html))
