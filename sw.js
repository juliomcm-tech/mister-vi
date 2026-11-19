/* Mister Vi · service worker: app em rede primeiro; ícones, dados do Vi (ratings.json) e letras guardados; ESPN nunca */
const VERSION = 'vi-v1.2.0';
const CORE = ['./', './index.html', './manifest.webmanifest', './icon-192.png', './icon-512.png', './icon-maskable-512.png', './ratings.json'];
self.addEventListener('install', e => { e.waitUntil(caches.open(VERSION).then(c => c.addAll(CORE)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k.startsWith('vi-') && k !== VERSION && k !== 'vi-runtime').map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  const req = e.request; if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (/espn\.com|corsproxy\.io|allorigins\.win/.test(url.hostname)) return;
  if (req.mode === 'navigate' || (url.origin === self.location.origin && /\/(index\.html)?$/.test(url.pathname))) {
    e.respondWith(fetch(url.href, { cache: 'no-cache' }).then(res => { if (res.ok && url.origin === self.location.origin && /\/(index\.html)?$/.test(url.pathname)) { const c = res.clone(); caches.open(VERSION).then(x => x.put('./index.html', c)); } return res; }).catch(() => caches.match('./index.html').then(r => r || caches.match('./'))));
    return;
  }
  if (url.origin === self.location.origin && /ratings\.json$/.test(url.pathname)) {   // dados do Vi: rede primeiro (há versões novas), cache como reserva
    e.respondWith(fetch(req).then(res => { if (res.ok) { const c = res.clone(); caches.open(VERSION).then(x => x.put(req, c)); } return res; }).catch(() => caches.match(req)));
    return;
  }
  if (url.origin === self.location.origin || /fonts\.(googleapis|gstatic)\.com/.test(url.hostname)) {
    e.respondWith(caches.match(req).then(hit => hit || fetch(req).then(res => { if (res && res.ok && res.type !== 'opaque') { const c = res.clone(); caches.open('vi-runtime').then(x => x.put(req, c)); } return res; })));
  }
});
