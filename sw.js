const CACHE='sihina-kanji-master-v6-450-memory';
const ASSETS=['./','./index.html','./styles.css','./app.js','./manifest.webmanifest','./data/kanji.json','./data/source-manifest.json','./data/source-slots.json','./data/n4-pages.json','./data/source450-index.json','./data/kanji-character-stories.json','./data/kanji-memory-450.json','./sources/kanji-all-450.pdf','./sources/n4-kanji.pdf'];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{if(e.request.method!=='GET')return;e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request).then(x=>{const c=x.clone();caches.open(CACHE).then(cache=>cache.put(e.request,c));return x}).catch(()=>caches.match('./index.html'))))});
