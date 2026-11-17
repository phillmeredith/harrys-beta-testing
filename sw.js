const C="hbt-v2";
self.addEventListener("install",e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(["./","index.html","manifest.webmanifest","icon-180.png"])));self.skipWaiting();});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C).map(x=>caches.delete(x)))));self.clients.claim();});
self.addEventListener("fetch",e=>{const r=e.request;if(r.method!=="GET"||/\/releases\/|releases\.json|\.mcaddon$/.test(r.url)||!r.url.startsWith(self.location.origin)&&!/fonts\.(googleapis|gstatic)\.com/.test(r.url))return;
  e.respondWith(fetch(r).then(res=>{const cp=res.clone();caches.open(C).then(c=>c.put(r,cp));return res;}).catch(()=>caches.match(r).then(m=>m||caches.match("index.html"))));});
