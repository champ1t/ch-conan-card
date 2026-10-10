/**
 * Navigation Component — CH.จุ่มการ์ดโคนัน
 * Logo: single line, high-class font, gradient
 * Nav: TH/EN, JOIN DROP CTA, Mobile bottom nav
 */
import { t, getLang, setLang, onLangChange } from '../i18n.js';
import { subscribeAuth, logout } from '../services/auth.js';
import { showAuthModal } from './authModal.js';

const DROP_URL = 'https://conancard-3f557.web.app/';
const FB_URL   = 'https://www.facebook.com/profile.php?id=100075963494534&locale=th_TH';

const LINKS = [
  { key: 'nav_home',       route: '/' },
  { key: 'nav_shop',       route: '/shop' },
  { key: 'nav_store',      route: '/store' },
  { key: 'nav_daily',      route: '/daily',      badge: true },
  { key: 'nav_jumm',       route: '/jumm' },
  { key: 'nav_live',       route: '/live' },
  { key: 'nav_highlights', route: '/highlights' },
  { key: 'nav_track',      route: '/track' },
];

const MOBILE_ITEMS = [
  { key: 'nav_home',       route: '/',           icon: '⊙' },
  { key: 'nav_shop',       route: '/shop',        icon: '🛍' },
  { key: 'nav_store',      route: '/store',       icon: '💎' },
  { key: 'nav_daily',      route: '/daily',       icon: '🎴', badge: true },
  { key: 'nav_jumm',       route: '/jumm',        icon: '⚡' },
  { key: 'nav_live',       route: '/live',        icon: '📺' },
  { key: 'nav_highlights', route: '/highlights',  icon: '⭐' },
  { key: 'nav_track',      route: '/track',       icon: '📦' },
];

let _unsubLang = null;
let _unsubAuth = null;
let _currentUser = null;
let _isAdmin = false;

export function mountNav(currentRoute = '/') {
  _unsubAuth = subscribeAuth(({ user, isAdmin }) => {
    _currentUser = user;
    _isAdmin = isAdmin;
    _renderTopNav(window._currentRoute || '/');
    _renderMobileNav(window._currentRoute || '/');
  });

  _renderTopNav(currentRoute);
  _renderMobileNav(currentRoute);
  window.addEventListener('scroll', _onScroll, { passive: true });
  _onScroll();
  _unsubLang = onLangChange(() => {
    _renderTopNav(window._currentRoute || '/');
    _renderMobileNav(window._currentRoute || '/');
  });
}

export function updateNavActive(route) {
  window._currentRoute = route;
  document.querySelectorAll('[data-route]').forEach(el => {
    const r = el.dataset.route;
    const active = r === route || (r !== '/' && route.startsWith(r));
    el.classList.toggle('active', active);
  });
}

function _renderTopNav(route) {
  const nav = document.getElementById('topnav');
  if (!nav) return;
  nav.innerHTML = `
    <div class="nav-inner">
      <a class="nav-logo" href="#/" data-route="/" aria-label="CH.จุ่มการ์ดโคนัน Home">
        <img class="logo-animated" src="./img/CH_Logohome.png" alt="CH.จุ่มการ์ดโคนัน">
      </a>

      <!-- Links (desktop) -->
      <nav class="nav-links hide-mobile" aria-label="Main navigation">
        ${LINKS.map(l => `
          <button class="nav-link ${_isActive(route, l.route) ? 'active' : ''} ${l.badge ? 'nav-link--daily' : ''}" data-route="${l.route}">
            ${l.badge ? '<span class="nav-daily-dot" aria-hidden="true"></span>' : ''}
            ${t(l.key)}
          </button>
        `).join('')}
      </nav>

      <!-- Actions -->
      <div class="nav-actions">
        <button class="nav-live-badge hidden" id="nav-live-badge" data-route="/live" aria-label="Live Now">
          <div class="live-dot-red" aria-hidden="true"></div>LIVE
        </button>

        <!-- Lang toggle -->
        <div class="nav-lang-group" role="group" aria-label="Language">
          <button class="nav-lang-btn ${getLang()==='th'?'active':''}" id="lang-th" aria-pressed="${getLang()==='th'}">TH</button>
          <button class="nav-lang-btn ${getLang()==='en'?'active':''}" id="lang-en" aria-pressed="${getLang()==='en'}">EN</button>
        </div>

        <!-- Auth Section -->
        ${!_currentUser ? `
          <button class="btn btn-primary btn-sm hide-mobile" id="nav-login-btn" style="padding:8px 12px;font-size:.72rem;">
            เข้าสู่ระบบ
          </button>
        ` : `
          <div class="hide-mobile" style="font-size:0.8rem; color:var(--text-2); display:flex; align-items:center; gap:8px;">
            <span>${_currentUser.isAnonymous ? 'Guest' : (_currentUser.email?.split('@')[0] || 'User')}</span>
            <button id="nav-logout-btn" style="background:none; border:none; color:#ef4444; cursor:pointer; font-size:0.75rem; text-decoration:underline;">Logout</button>
          </div>
        `}

        <!-- Admin (desktop) - Only show if isAdmin is true -->
        ${_isAdmin ? `
          <button class="btn btn-ghost btn-sm hide-mobile" data-route="/admin"
                  style="padding:8px 12px;font-size:.72rem;" aria-label="${t('nav_admin')}">
            ${t('nav_admin')}
          </button>
        ` : ''}
      </div>
    </div>`;

  nav.addEventListener('click', e => {
    const r = e.target.closest('[data-route]');
    if (r) { window.navigate?.(r.dataset.route); return; }
  });
  nav.querySelector('#lang-th')?.addEventListener('click', () => setLang('th'));
  nav.querySelector('#lang-en')?.addEventListener('click', () => setLang('en'));
  
  nav.querySelector('#nav-login-btn')?.addEventListener('click', showAuthModal);
  nav.querySelector('#nav-logout-btn')?.addEventListener('click', logout);
}

function _renderMobileNav(route) {
  const nav = document.getElementById('mobile-nav');
  if (!nav) return;
  nav.innerHTML = `
    <div class="mobile-nav-inner">
      ${MOBILE_ITEMS.map(item => `
        <button class="mobile-nav-item ${_isActive(route, item.route) ? 'active' : ''} ${item.badge ? 'mobile-nav-item--daily' : ''}"
                data-route="${item.route}" aria-label="${t(item.key)}">
          <span class="mobile-nav-icon" aria-hidden="true">${item.icon}</span>
          <span>${t(item.key)}</span>
          ${item.badge ? '<span class="mobile-daily-dot" aria-hidden="true"></span>' : ''}
        </button>
      `).join('')}
      
      ${!_currentUser ? `
        <button class="mobile-nav-item" id="mobile-login-btn">
          <span class="mobile-nav-icon">👤</span><span>Login</span>
        </button>
      ` : `
        <button class="mobile-nav-item" id="mobile-logout-btn">
          <span class="mobile-nav-icon">🚪</span><span>Logout</span>
        </button>
      `}
    </div>`;
    
  nav.querySelectorAll('[data-route]').forEach(el => {
    el.addEventListener('click', () => window.navigate?.(el.dataset.route));
  });
  
  nav.querySelector('#mobile-login-btn')?.addEventListener('click', showAuthModal);
  nav.querySelector('#mobile-logout-btn')?.addEventListener('click', logout);
}

function _isActive(current, route) {
  return route === current || (route !== '/' && current.startsWith(route));
}

let _lastScrollY = window.scrollY;
function _onScroll() {
  const topnav = document.getElementById('topnav');
  if (!topnav) return;
  
  const currentScrollY = window.scrollY;
  // Sticky background on scroll
  topnav.classList.toggle('scrolled', currentScrollY > 40);
  
  // Hide on scroll down, show on scroll up (bounce effect)
  if (currentScrollY > _lastScrollY && currentScrollY > 100) {
    // Scrolling down
    topnav.classList.add('nav-hidden');
  } else {
    // Scrolling up or at top
    topnav.classList.remove('nav-hidden');
  }
  
  _lastScrollY = currentScrollY;
}

export function unmountNav() {
  if (_unsubLang) { _unsubLang(); _unsubLang = null; }
  if (_unsubAuth) { _unsubAuth(); _unsubAuth = null; }
  window.removeEventListener('scroll', _onScroll);
}
