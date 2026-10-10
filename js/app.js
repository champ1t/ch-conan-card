/**
 * SPA App Router — CH.จุ่มการ์ดโคนัน
 * Routes:
 *  /              → Home
 *  /shop          → Shop (all products)
 *  /shop/:cat     → Shop by category
 *  /product/:id   → Product detail
 *  /live          → Live sessions
 *  /highlights    → Highlight clips
 *  /track         → Track order
 *  /cards         → Card catalog
 *  /boxes         → Box catalog
 *  /admin         → Admin panel
 */
import { mountNav, updateNavActive } from './components/nav.js';
import { initCursor } from './components/cursor.js';
import { navigate as _nav } from './router.js';
import { authReady, isAdmin } from './services/auth.js';

let _currentRoute = null;
let _currentUnmount = null;

export function navigate(path) {
  window.location.hash = '#' + path;
}

export async function boot() {
  // Global navigate
  window.navigate = navigate;

  // Initialize Custom Cursor
  initCursor();

  // Wait for initial auth state to resolve so we don't flash unauthorized routes
  await authReady;

  // Mount nav
  mountNav('/');

  // Route listeners
  window.addEventListener('hashchange', _route);

  // Initial route
  await _route();
}

async function _route() {
  const raw = decodeURIComponent(window.location.hash.slice(1) || '/');
  const path = raw.split('?')[0] || '/';

  if (path === _currentRoute) return;
  _currentRoute = path;

  // Nav active state
  updateNavActive(path);

  // Scroll to top
  window.scrollTo({ top: 0, behavior: 'instant' });

  // Unmount previous
  try { _currentUnmount?.(); } catch (_) { }
  _currentUnmount = null;

  // Clear main
  const main = document.getElementById('main-view');
  if (!main) return;
  main.innerHTML = '';

  const segs = path.split('/').filter(Boolean);
  const s0 = segs[0], s1 = segs[1];

  try {
    if (path === '/') {
      const { mountHome, unmountHome } = await import('./views/home.js');
      await mountHome(main);
      _currentUnmount = unmountHome;

    } else if (path === '/shop' || s0 === 'shop') {
      const { mountShop, unmountShop } = await import('./views/shop.js');
      await mountShop(main, s1 || null);
      _currentUnmount = unmountShop;

    } else if (s0 === 'product' && s1) {
      const { mountProductDetail, unmountProductDetail } = await import('./views/productDetail.js');
      await mountProductDetail(main, s1);
      _currentUnmount = unmountProductDetail;

    } else if (path === '/live') {
      const { mountLive, unmountLive } = await import('./views/live.js');
      await mountLive(main);
      _currentUnmount = unmountLive;

    } else if (path === '/highlights') {
      const { mountHighlights, unmountHighlights } = await import('./views/highlights.js');
      await mountHighlights(main);
      _currentUnmount = unmountHighlights;

    } else if (path === '/track') {
      const { mountTrack, unmountTrack } = await import('./views/trackOrder.js');
      await mountTrack(main);
      _currentUnmount = unmountTrack;

    } else if (path === '/cards') {
      const { mountShop, unmountShop } = await import('./views/shop.js');
      await mountShop(main, 'card');
      _currentUnmount = unmountShop;

    } else if (path === '/boxes') {
      const { mountShop, unmountShop } = await import('./views/shop.js');
      await mountShop(main, 'box');
      _currentUnmount = unmountShop;

    } else if (s0 === 'admin') {
      if (!isAdmin) {
        throw new Error('Access Denied. You do not have permission to view this page.');
      }
      const { mountAdmin, unmountAdmin } = await import('./views/admin/index.js');
      mountAdmin(main, s1 || 'dashboard');
      _currentUnmount = unmountAdmin;

    } else if (path === '/daily') {
      const { mountDaily, unmountDaily } = await import('./views/dailyPull.js');
      await mountDaily(main);
      _currentUnmount = unmountDaily;

    } else if (path === '/store') {
      const { mountStore, unmountStore } = await import('./views/store.js');
      await mountStore(main);
      _currentUnmount = unmountStore;

    } else if (path === '/jumm') {
      const { mountJumm, unmountJumm } = await import('./views/tcg.js?v=5.2');
      await mountJumm(main);
      _currentUnmount = unmountJumm;

    } else {
      _render404(main);
    }
  } catch (err) {
    console.error('[Router]', path, err);
    _renderError(main, err);
  }
}

function _render404(main) {
  main.innerHTML = `
    <div class="empty-state section">
      <div class="empty-icon">🔍</div>
      <div class="empty-title">404 — ไม่พบหน้านี้</div>
      <div class="empty-desc">ลองกลับหน้าหลักหรือเลือกเมนูด้านบน</div>
      <button class="btn btn-primary btn-md" style="margin-top:24px" onclick="navigate('/')">กลับหน้าหลัก</button>
    </div>
  `;
}

function _renderError(main, err) {
  main.innerHTML = `
    <div class="empty-state section">
      <div class="empty-icon">⚠️</div>
      <div class="empty-title">เกิดข้อผิดพลาด</div>
      <div class="empty-desc">${err.message}</div>
      <button class="btn btn-ghost btn-md" style="margin-top:24px" onclick="navigate('/')">กลับหน้าหลัก</button>
    </div>
  `;
}
