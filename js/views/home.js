/**
 * Home View — CH.จุ่มการ์ดโคนัน
 * Full homepage: Hero (HUD), Features, Products, Categories,
 * Live, Highlights, Card Showcase, Box Showcase, Track Widget, About, Footer
 */
import { t, onLangChange, getLang } from '../i18n.js';
import { navigate } from '../router.js';

const DROP_URL = 'https://conancard-3f557.web.app/';
const FB_URL = 'https://www.facebook.com/profile.php?id=100075963494534&locale=th_TH';

/* ── Mock data ──────────────────────────────────────────────── */
const FEATURED_PRODUCTS = [
  { id: 'p1', name: 'CONAN CT-P10', nameEn: 'Conan CT-P10', series: 'Conan', category: 'box', price: 3200, status: 'available', emoji: '', packs: '18 PACKS / BOX' },
  { id: 'p2', name: 'CONAN CT-P09', nameEn: 'Conan CT-P09', series: 'Conan', category: 'box', price: 2800, status: 'available', emoji: '', packs: '18 PACKS / BOX' },
  { id: 'p3', name: 'Conan SSR Card', nameEn: 'Conan SSR', series: 'Conan', category: 'card', price: 890, status: 'available', emoji: '', rarity: 'SSR' },
  { id: 'p4', name: 'CONAN CT-P08', nameEn: 'Conan CT-P08', series: 'Conan', category: 'box', price: 2600, status: 'soldout', emoji: '', packs: '18 PACKS / BOX' },
];

const CARD_SHOWCASES = [
  { id: 'c1', name: 'Conan Edogawa', nameEn: 'Conan Edogawa', char: 'โคนัน', charEn: 'Conan', rarity: 'MR', emoji: '️', glow: 'purple' },
  { id: 'c2', name: 'Ran Mouri', nameEn: 'Ran Mouri', char: 'รัน', charEn: 'Ran', rarity: 'SSR', emoji: '', glow: 'gold' },
  { id: 'c3', name: 'Shinichi Kudo', nameEn: 'Shinichi Kudo', char: 'ชินอิจิ', charEn: 'Shinichi', rarity: 'BP', emoji: '', glow: 'gold' },
  { id: 'c4', name: 'Ai Haibara', nameEn: 'Ai Haibara', char: 'ไฮบาระ', charEn: 'Haibara', rarity: 'SR', emoji: '', glow: 'none' },
  { id: 'c5', name: 'Detective Boys', nameEn: 'Detective Boys', char: 'แก๊ง', charEn: 'Kids', rarity: 'R', emoji: '', glow: 'none' },
  { id: 'c6', name: 'Heiji Hattori', nameEn: 'Heiji Hattori', char: 'เฮจิ', charEn: 'Heiji', rarity: 'CP', emoji: '', glow: 'none' },
];

const LIVE_SESSIONS = [
  { id: 'l1', title: 'จุ่มการ์ดโคนัน CT-P10 Drop #021', titleEn: 'Conan CT-P10 Drop #021', date: '28 ก.ค. 2568', dateEn: 'Jul 28, 2025', viewers: '1,248', emoji: '' },
  { id: 'l2', title: 'เปิดกล่อง CONAN CT-P09 ทั้งกล่อง!', titleEn: 'Opening CONAN CT-P09 Box!', date: '20 ก.ค. 2568', dateEn: 'Jul 20, 2025', viewers: '987', emoji: '' },
  { id: 'l3', title: 'Rare Pull SSR ทุกซอง!! CT-P08', titleEn: 'SSR Rare Pulls!! CT-P08', date: '15 ก.ค. 2568', dateEn: 'Jul 15, 2025', viewers: '2,105', emoji: '' },
];

const HIGHLIGHTS = [
  { id: 'h1', title: 'Pull SSR แรกของ Drop #021!', titleEn: 'First SSR Pull in Drop #021!', type: 'rare-pull', views: '24K', emoji: '' },
  { id: 'h2', title: 'เปิด 1 กล่อง ได้ BP + SSR !!', titleEn: '1 Box = BP + SSR !!', type: 'rare-pull', views: '18K', emoji: '' },
  { id: 'h3', title: 'Reaction ช็อค!! ดึง QR หายาก', titleEn: 'Shocked Reaction!! Rare QR Pull', type: 'reaction', views: '12K', emoji: '' },
  { id: 'h4', title: 'เปิดกล่อง CT-P09 ทั้งกล่อง', titleEn: 'Full CT-P09 Box Opening', type: 'box-open', views: '31K', emoji: '' },
  { id: 'h5', title: 'ครบ Set!! สะสมครบทุกตัว', titleEn: 'Full Set Completed!!', type: 'reaction', views: '9K', emoji: '' },
  { id: 'h6', title: 'Drop #018 Live เปิดพร้อมกัน', titleEn: 'Drop #018 Live Opening', type: 'box-open', views: '15K', emoji: '' },
];

let _cleanups = [];
let _unsubLang = null;
let _eventsBound = false;

/* ══════════════════════════════════════════════════════════════
   MOUNT / UNMOUNT
   ══════════════════════════════════════════════════════════════ */
export async function mountHome(container) {
  window.navigate = navigate;

  function render() {
    // Stop old timers before rerendering
    _cleanups.forEach(fn => fn());
    _cleanups = [];

    container.innerHTML = _buildPage();
    _setupScrollReveal(container);
    _startTypewriter(container);
    _spawnParticles(container);
  }

  render();

  if (!_eventsBound) {
    _bindEvents(container);
    _eventsBound = true;
  }

  if (!_unsubLang) {
    _unsubLang = onLangChange(() => render());
  }
}

export function unmountHome() {
  _cleanups.forEach(fn => fn());
  _cleanups = [];
  if (_unsubLang) { _unsubLang(); _unsubLang = null; }
  _eventsBound = false;
}

/* ── Build page ─────────────────────────────────────────────── */
function _buildPage() {
  return `
    ${_heroHTML()}
    ${_featuresHTML()}
    ${_sectionHTML('featured', _featuredHTML())}
    ${_categoriesHTML()}
    ${_liveHTML()}
    ${_sectionHTML('highlights', _highlightsHTML(), 'bg-alt')}
    ${_sectionHTML('cards', _cardShowcaseHTML())}
    ${_sectionHTML('boxes', _boxShowcaseHTML(), 'bg-alt')}
    ${_trackOrderHTML()}
    ${_aboutHTML()}
    ${_footerHTML()}
  `;
}

/* ══════════════════════════════════════════════════════════════
   1. HERO — HUD Edition
   ══════════════════════════════════════════════════════════════ */
function _heroHTML() {
  const lang = getLang();
  return `
  <section class="hero" aria-label="Hero">
    <div class="hero-bg">
      <div class="hero-grid"></div>
      <div class="hero-shimmer"></div>
    </div>

    <div class="hero-content">
      <!-- LEFT -->
      <div class="hero-left">
        <div class="hero-eyebrow-v2">
          <div class="hero-eyebrow-dot" aria-hidden="true"></div>
          ${t('hero_eyebrow')}
          <span class="hero-eyebrow-badge">${lang === 'th' ? 'TH' : 'EN'}</span>
        </div>

        <!-- Single-line shimmer gradient title -->
        <h1 class="hero-brand-title" data-text="${t('hero_title')}">
          ${t('hero_title')}
        </h1>

        <!-- Typewriter sub-line -->
        <div class="hero-sub-line" aria-live="polite">
          <span class="hero-sub-bracket">[</span>
          <span id="hero-typetext" class="hero-typetext"></span>
          <span class="hero-cursor" aria-hidden="true">_</span>
          <span class="hero-sub-bracket">]</span>
        </div>

        <p class="hero-subtitle">
          ${t('hero_subtitle').replace(/\n/g, '<br>')}
        </p>

        <div class="hero-ctas">
          <button class="btn btn-primary btn-xl" data-route="/shop">
             ${t('hero_cta_shop')}
          </button>
          <a href="${DROP_URL}" target="_blank" rel="noopener noreferrer" class="btn btn-outline btn-xl">
             ${t('hero_cta_drop')}
          </a>
        </div>

        <div class="hero-stats">
          <div>
            <div class="hero-stat-num" style="background:linear-gradient(135deg,#d8b4fe,#a78bfa);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text">500+</div>
            <div class="hero-stat-label">${t('hero_stat_orders')}</div>
          </div>
          <div>
            <div class="hero-stat-num" style="color:var(--gold-light)">50+</div>
            <div class="hero-stat-label">${t('hero_stat_drops')}</div>
          </div>
          <div>
            <div class="hero-stat-num" style="color:#f43f5e">LIVE</div>
            <div class="hero-stat-label">${t('hero_stat_live')}</div>
          </div>
        </div>
      </div>

      <!-- RIGHT — HUD Card Display -->
      <div class="hero-right" aria-hidden="true">
        <div class="hud-orb hud-orb-1"></div>
        <div class="hud-orb hud-orb-2"></div>
        <div class="hud-frame">
          <div class="hud-corner hud-tl"></div>
          <div class="hud-corner hud-tr"></div>
          <div class="hud-corner hud-bl"></div>
          <div class="hud-corner hud-br"></div>
          <div class="hud-cross hud-cross-t">${t('home_hud_cross_t')}</div>
          <div class="hud-cross hud-cross-b">${t('home_hud_cross_b')}</div>

          <div class="hud-card-back hud-card-back-1"></div>
          <div class="hud-card-back hud-card-back-2"></div>

          <div class="hud-card-animator">
            <div class="hud-card-wrap">
              <div class="hud-card-holo"></div>
              <div class="hud-scan-line"></div>
              <!--  Image slot -->
              <div class="hud-card-image-slot" id="hud-img-slot">
                <img src="./img/CH_Logocard.png" style="width:100%; height:100%; object-fit:cover; border-radius:6px;">
              </div>
            </div>
          </div>

          <div class="hud-popup" role="status">
            <div class="hud-popup-dot"></div>
            ${t('home_hud_rare')}
          </div>

          <div class="hud-rarity-strip"> CH.จุ่มการ์ดโคนัน</div>

          <div class="hud-data hud-data-l">${t('home_hud_series')}</div>
          <div class="hud-data hud-data-r">${t('home_hud_rare_type')}</div>
        </div>
      </div>
    </div>

    <div class="hero-scroll-indicator" aria-hidden="true">
      <div>${t('hero_scroll')}</div>
      <div class="hero-scroll-line"></div>
    </div>
  </section>`;
}

/* ══════════════════════════════════════════════════════════════
   2. FEATURES STRIP
   ══════════════════════════════════════════════════════════════ */
function _featuresHTML() {
  const items = [
    { title: t('feat_drop_title'), href: DROP_URL },
    { title: t('feat_live_title'), href: FB_URL },
    { title: t('feat_hl_title'), route: '/highlights' },
    { title: t('feat_track_title'), route: '/track' },
  ];
  return `
  <section class="features-section" aria-label="Features" style="border:none; padding:var(--space-8) 0;">
    <div class="container">
      <div class="features-strip luxurious-strip">
        ${items.map(item => `
          <div class="feature-item luxurious-item"
            ${item.route ? `data-route="${item.route}"` : `data-href="${item.href}"`}
            role="button" tabindex="0">
            <div class="feature-title">${item.title}</div>
          </div>
        `).join('')}
      </div>
    </div>
  </section>`;
}

/* ══════════════════════════════════════════════════════════════
   3. FEATURED PRODUCTS
   ══════════════════════════════════════════════════════════════ */
function _featuredHTML() {
  return `
    <div class="section-header">
      <div>
        <div class="section-eyebrow">${t('featured_eyebrow')}</div>
        <h2 class="section-title-th">${t('featured_title')}</h2>
      </div>
      <button class="btn btn-outline btn-sm" data-route="/shop">${t('featured_see_all')}</button>
    </div>
    <div class="products-grid stagger">
      ${FEATURED_PRODUCTS.map(p => _productCardHTML(p)).join('')}
    </div>`;
}

function _productCardHTML(p) {
  const lang = getLang();
  const name = lang === 'en' ? p.nameEn : p.name;
  const statusBadge = p.status === 'available'
    ? `<span class="badge badge-available">${t('available')}</span>`
    : `<span class="badge badge-soldout">${t('soldout')}</span>`;
  const rarityBadge = p.rarity ? `<span class="rarity rarity-${p.rarity}">${p.rarity}</span>` : '';
  return `
    <div class="product-card anim-fade-up" data-product="${p.id}" role="button" tabindex="0" aria-label="${name}">
      <div class="product-card-img">
        ${p.image ? `<img src="${p.image}" alt="${name}" style="width:100%; height:100%; object-fit:contain; border-radius:var(--r-lg);">` : p.emoji}
      </div>
      <div class="product-card-body">
        <div class="product-series">${p.series}</div>
        <div class="product-name">${name}</div>
        ${p.packs ? `<div style="font-size:var(--text-xs);color:var(--text-3);margin-bottom:var(--space-2);">${p.packs}</div>` : ''}
        <div class="product-meta">
          <div class="product-price"><span>฿</span>${p.price.toLocaleString()}</div>
          <div style="display:flex;gap:4px;flex-wrap:wrap;">${statusBadge}${rarityBadge}</div>
        </div>
        <button class="btn btn-primary btn-sm btn-block" style="margin-top:var(--space-3);" data-product-btn="${p.id}">
          ${t('btn_see_details')}
        </button>
      </div>
    </div>`;
}

/* ══════════════════════════════════════════════════════════════
   4. CATEGORIES
   ══════════════════════════════════════════════════════════════ */
function _categoriesHTML() {
  const cats = [
    { id: 'card', icon: '', label: t('cat_cards'), count: t('cat_cards_count'), color: 'rgba(168,85,247,.15)', border: 'rgba(168,85,247,.3)' },
    { id: 'box', icon: '', label: t('cat_boxes'), count: t('cat_boxes_count'), color: 'rgba(96,165,250,.12)', border: 'rgba(96,165,250,.3)' },
    { id: 'pack', icon: '', label: t('cat_packs'), count: t('cat_packs_count'), color: 'rgba(245,158,11,.10)', border: 'rgba(245,158,11,.3)' },
    { id: 'other', icon: '', label: t('cat_other'), count: t('cat_other_count'), color: 'rgba(16,185,129,.10)', border: 'rgba(16,185,129,.3)' },
  ];
  return `
  <section class="section-sm" aria-label="${t('cat_title')}"
    style="background:var(--bg-surface);border-top:1px solid var(--glass-border);border-bottom:1px solid var(--glass-border);">
    <div class="container">
      <div class="section-header">
        <div>
          <div class="section-eyebrow">${t('cat_eyebrow')}</div>
          <h2 class="section-title-th">${t('cat_title')}</h2>
        </div>
      </div>
      <div class="categories-grid stagger">
        ${cats.map(c => `
          <button class="category-tile anim-scale-in" data-route="/shop/${c.id}"
            style="border-color:${c.border};background:${c.color};" aria-label="${c.label}">
            <div class="category-icon">${c.icon}</div>
            <div class="category-name">${c.label}</div>
            <div class="category-count">${c.count}</div>
          </button>
        `).join('')}
      </div>
    </div>
  </section>`;
}

/* ══════════════════════════════════════════════════════════════
   5. LIVE
   ══════════════════════════════════════════════════════════════ */
function _liveHTML() {
  const lang = getLang();
  return `
  <section class="section" aria-label="Latest Live">
    <div class="container">
      <div class="section-header">
        <div>
          <div class="section-eyebrow">${t('live_eyebrow')}</div>
          <h2 class="section-title-th">${t('live_title')}</h2>
        </div>
        <button class="btn btn-outline btn-sm" data-route="/live">${t('live_see_all')}</button>
      </div>
      <div class="live-section-inner">
        <div class="live-main-card">
          <div style="text-align:center;color:var(--text-3);">
            <div style="font-size:5rem;margin-bottom:16px;"></div>
            <div style="font-size:.8rem;font-family:var(--font-en);font-weight:700;letter-spacing:.1em;">${t('live_coming_soon')}</div>
            <div style="font-size:.7rem;margin-top:8px;opacity:.6;">${t('live_coming_desc')}</div>
          </div>
          <div style="position:absolute;bottom:24px;left:50%;transform:translateX(-50%);">
            <a href="${FB_URL}" target="_blank" rel="noopener noreferrer" class="btn btn-live btn-md">
               ${t('live_watch_btn')}
            </a>
          </div>
        </div>
        <div class="live-sidebar">
          <div style="font-size:var(--text-xs);font-weight:700;color:var(--text-3);letter-spacing:.1em;text-transform:uppercase;font-family:var(--font-en);margin-bottom:4px;">${t('live_recent_lives')}</div>
          ${LIVE_SESSIONS.map(l => `
            <a href="${FB_URL}" target="_blank" rel="noopener noreferrer" class="live-archive-card" style="text-decoration:none;">
              <div class="live-archive-thumb">${l.emoji}</div>
              <div class="live-archive-info">
                <div class="live-archive-title">${lang === 'en' ? l.titleEn : l.title}</div>
                <div class="live-archive-meta">${lang === 'en' ? l.dateEn : l.date} ·  ${l.viewers}</div>
              </div>
            </a>
          `).join('')}
        </div>
      </div>
    </div>
  </section>`;
}

/* ══════════════════════════════════════════════════════════════
   6. HIGHLIGHTS
   ══════════════════════════════════════════════════════════════ */
function _highlightsHTML() {
  const lang = getLang();
  return `
    <div class="section-header">
      <div>
        <div class="section-eyebrow">${t('hl_eyebrow')}</div>
        <h2 class="section-title-th">${t('hl_title')}</h2>
      </div>
      <button class="btn btn-outline btn-sm" data-route="/highlights">${t('hl_see_all')}</button>
    </div>
    <div class="highlights-grid stagger">
      ${HIGHLIGHTS.map(h => `
        <div class="video-card anim-fade-up" data-route="/highlights" role="button" tabindex="0">
          <div class="video-thumb">
            ${h.emoji}
            <div class="video-play-btn"></div>
          </div>
          <div class="video-card-body">
            <div style="font-weight:700;font-size:var(--text-sm);margin-bottom:6px;line-height:1.4;">${lang === 'en' ? h.titleEn : h.title}</div>
            <div class="video-meta">
              <span class="badge badge-purple" style="font-size:.6rem;">${h.type}</span>
              <span> ${h.views}</span>
            </div>
          </div>
        </div>
      `).join('')}
    </div>`;
}

/* ══════════════════════════════════════════════════════════════
   7. CARD SHOWCASE
   ══════════════════════════════════════════════════════════════ */
function _cardShowcaseHTML() {
  const lang = getLang();
  return `
    <div class="section-header">
      <div>
        <div class="section-eyebrow">${t('cards_eyebrow')}</div>
        <h2 class="section-title-th">${t('cards_title')}</h2>
      </div>
      <button class="btn btn-outline btn-sm" data-route="/shop/card">${t('cards_see_all')}</button>
    </div>
    <div class="showcase-grid stagger">
      ${CARD_SHOWCASES.map(c => `
        <div class="showcase-card rarity-${c.rarity.toLowerCase()} anim-scale-in"
          data-route="/shop/card" role="button" tabindex="0" aria-label="${lang === 'en' ? c.nameEn : c.name}">
          <div class="showcase-img">${c.emoji}</div>
          <div class="showcase-info">
            <span class="rarity rarity-${c.rarity}">${c.rarity}</span>
            <div class="showcase-name" style="margin-top:6px;">${lang === 'en' ? c.nameEn : c.name}</div>
            <div class="showcase-char">${lang === 'en' ? c.charEn : c.char}</div>
          </div>
        </div>
      `).join('')}
    </div>`;
}

/* ══════════════════════════════════════════════════════════════
   8. BOX SHOWCASE
   ══════════════════════════════════════════════════════════════ */
function _boxShowcaseHTML() {
  const boxes = [
    { name: 'CONAN CT-P10', packs: '18 packs', price: 3200, emoji: '', status: 'available' },
    { name: 'CONAN CT-P09', packs: '18 packs', price: 2800, emoji: '', status: 'available' },
    { name: 'CONAN CT-P08', packs: '18 packs', price: 2600, emoji: '', status: 'soldout' },
    { name: 'CONAN CT-P07', packs: '18 packs', price: 2400, emoji: '', status: 'soldout' },
  ];
  return `
    <div class="section-header">
      <div>
        <div class="section-eyebrow">${t('boxes_eyebrow')}</div>
        <h2 class="section-title-th">${t('boxes_title')}</h2>
      </div>
      <button class="btn btn-outline btn-sm" data-route="/shop/box">${t('boxes_see_all')}</button>
    </div>
    <div class="products-grid stagger">
      ${boxes.map(b => _productCardHTML({ ...b, id: b.name, series: 'Conan', category: 'box' })).join('')}
    </div>`;
}

/* ══════════════════════════════════════════════════════════════
   9. TRACK ORDER
   ══════════════════════════════════════════════════════════════ */
function _trackOrderHTML() {
  return `
  <section class="section" id="track-section"
    style="background:var(--bg-surface);border-top:1px solid var(--glass-border);border-bottom:1px solid var(--glass-border);"
    aria-label="Track Order">
    <div class="container">
      <div style="text-align:center;margin-bottom:var(--space-10);">
        <div class="section-eyebrow" style="justify-content:center;display:flex;">${t('track_eyebrow')}</div>
        <h2 class="section-title-th">${t('track_title')}</h2>
        <p style="color:var(--text-3);margin-top:var(--space-3);font-size:var(--text-sm);">
          ${t('track_desc')}
        </p>
      </div>
      <div class="track-section-inner">
        <div class="track-widget">
          <div class="tab-bar" style="margin-bottom:var(--space-5);" id="track-tab-bar">
            <button class="tab-btn active" data-tab="phone"> ${t('track_tab_phone')}</button>
            <button class="tab-btn" data-tab="tracking"> ${t('track_tab_tracking')}</button>
          </div>
          <div class="form-group" style="margin-bottom:var(--space-4);">
            <div class="input-wrap">
              <span class="input-icon" id="track-icon"></span>
              <input type="text" id="track-input" class="form-input"
                placeholder="${t('track_ph_phone')}" />
            </div>
          </div>
          <button class="btn btn-primary btn-lg btn-block" id="track-search-btn">${t('track_search_btn')}</button>
          <div id="track-result" class="track-result"></div>
        </div>
        <div style="text-align:center;margin-top:var(--space-5);">
          <button class="btn btn-ghost btn-md" data-route="/track">
            ${t('track_full_page')}
          </button>
        </div>
      </div>
    </div>
  </section>`;
}

/* ══════════════════════════════════════════════════════════════
   10. ABOUT
   ══════════════════════════════════════════════════════════════ */
function _aboutHTML() {
  return `
  <section class="section" aria-label="About">
    <div class="container">
      <div class="about-inner">
        <div class="about-image anim-scale-in">
          <img src="./img/FBscreen.png" alt="CH. Conan Card Cover" style="width:100%; height:auto; display:block;">
        </div>
        <div class="about-text-block anim-fade-up">
          <div class="section-eyebrow">${t('about_eyebrow')}</div>
          <h2 class="section-title-th" style="margin-bottom:var(--space-5);white-space:pre-line;">${t('about_title')}</h2>
          <p class="about-desc">
            ${t('about_desc')}
          </p>
          <div class="about-tags">
            ${[t('about_tag_1'), t('about_tag_2'), t('about_tag_3'), t('about_tag_4'), t('about_tag_5'), t('about_tag_6')].map(tag =>
    `<span class="about-tag">${tag}</span>`).join('')}
          </div>
          <div style="display:flex;gap:var(--space-4);margin-top:var(--space-8);flex-wrap:wrap;">
            <a href="${FB_URL}" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-md">
               ${t('about_line')}
            </a>
            <a href="${DROP_URL}" target="_blank" rel="noopener noreferrer" class="btn btn-outline btn-md">
              ${t('about_drop')}
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>`;
}

/* ══════════════════════════════════════════════════════════════
   FOOTER
   ══════════════════════════════════════════════════════════════ */
function _footerHTML() {
  return `
  <footer class="footer" role="contentinfo">
    <div class="container">
      <div class="footer-grid">
        <div>
          <div class="footer-brand-logo"> ${t('hero_title')}</div>
          <p class="footer-desc" style="white-space:pre-line;">
            ${t('footer_brand_desc')}
          </p>
          <div class="footer-social" style="margin-top:var(--space-5);">
            <a href="${FB_URL}" target="_blank" rel="noopener noreferrer" class="social-btn" aria-label="Facebook"></a>
            <a href="${DROP_URL}" target="_blank" rel="noopener noreferrer" class="social-btn" aria-label="Card Drop"></a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" class="social-btn" aria-label="YouTube"></a>
            <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" class="social-btn" aria-label="TikTok"></a>
          </div>
        </div>
        <div>
          <div class="footer-heading">${t('footer_col_shop')}</div>
          <div class="footer-links">
            <span class="footer-link" data-route="/shop">${t('footer_shop_1')}</span>
            <span class="footer-link" data-route="/shop/card">${t('footer_shop_2')}</span>
            <span class="footer-link" data-route="/shop/box">${t('footer_shop_3')}</span>
            <span class="footer-link" data-route="/shop/pack">${t('footer_shop_4')}</span>
          </div>
        </div>
        <div>
          <div class="footer-heading">${t('footer_col_drop')}</div>
          <div class="footer-links">
            <a href="${DROP_URL}" target="_blank" rel="noopener noreferrer" class="footer-link">${t('footer_drop_1')}</a>
            <span class="footer-link" data-route="/live">${t('footer_drop_2')}</span>
            <span class="footer-link" data-route="/highlights">${t('footer_drop_3')}</span>
            <span class="footer-link" data-route="/track">${t('footer_drop_4')}</span>
          </div>
        </div>
        <div>
          <div class="footer-heading">${t('footer_col_contact')}</div>
          <div class="footer-links">
            <a href="${FB_URL}" target="_blank" rel="noopener noreferrer" class="footer-link"> Facebook</a>
            <a href="${DROP_URL}" target="_blank" rel="noopener noreferrer" class="footer-link"> ${t('footer_col_drop')}</a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" class="footer-link"> YouTube</a>
          </div>
        </div>
      </div>
      <div class="footer-bottom">
        <span>${t('footer_copy')}</span>
        <span style="opacity:.5;">${t('footer_tagline')}</span>
      </div>
    </div>
  </footer>`;
}

/* ══════════════════════════════════════════════════════════════
   HELPERS
   ══════════════════════════════════════════════════════════════ */
function _sectionHTML(id, inner, variant = '') {
  const bg = variant === 'bg-alt'
    ? 'style="background:var(--bg-surface);border-top:1px solid var(--glass-border);border-bottom:1px solid var(--glass-border);"'
    : '';
  return `<section class="section" id="section-${id}" ${bg} aria-label="${id}"><div class="container">${inner}</div></section>`;
}

/* ══════════════════════════════════════════════════════════════
   TYPEWRITER ANIMATION
   ══════════════════════════════════════════════════════════════ */
const PHRASES_EN = [
  'Official Card Store',
  'Buy · Collect · Drop',
  'Conan Card Collector',
  'Live Pack Opening',
  'Rare Pull Hunter ️',
];
const PHRASES_TH = [
  'ร้านจำหน่ายการ์ด Official',
  'ซื้อ · สะสม · จุ่มการ์ด',
  'นักสะสมการ์ดโคนัน',
  'ไลฟ์เปิดการ์ดสด',
  'ตามล่า Rare Pull ️',
];

function _startTypewriter(container) {
  const el = container.querySelector('#hero-typetext');
  if (!el) return;

  const phrases = getLang() === 'en' ? PHRASES_EN : PHRASES_TH;
  let phraseIdx = 0;
  let charIdx = 0;
  let deleting = false;
  let timer = null;

  function tick() {
    const phrase = phrases[phraseIdx];
    if (!deleting) {
      el.textContent = phrase.slice(0, charIdx + 1);
      charIdx++;
      if (charIdx === phrase.length) {
        deleting = true;
        timer = setTimeout(tick, 2200);
        return;
      }
    } else {
      el.textContent = phrase.slice(0, charIdx - 1);
      charIdx--;
      if (charIdx === 0) {
        deleting = false;
        phraseIdx = (phraseIdx + 1) % phrases.length;
      }
    }
    timer = setTimeout(tick, deleting ? 45 : 80);
  }

  timer = setTimeout(tick, 900);
  _cleanups.push(() => clearTimeout(timer));
}

/* ══════════════════════════════════════════════════════════════
   FLOATING PARTICLES
   ══════════════════════════════════════════════════════════════ */
function _spawnParticles(container) {
  const heroBg = container.querySelector('.hero-bg');
  if (!heroBg) return;
  for (let i = 0; i < 18; i++) {
    const p = document.createElement('div');
    p.className = 'hero-particle';
    const size = (2 + Math.random() * 4).toFixed(1);
    p.style.setProperty('--size', `${size}px`);
    p.style.setProperty('--x', `${(Math.random() * 90 + 5).toFixed(1)}%`);
    p.style.setProperty('--delay', `${(Math.random() * 4).toFixed(2)}s`);
    heroBg.appendChild(p);
  }
}

/* ══════════════════════════════════════════════════════════════
   EVENTS
   ══════════════════════════════════════════════════════════════ */
function _bindEvents(container) {
  container.addEventListener('click', (e) => {
    const el = e.target.closest('[data-route]');
    if (el) { navigate(el.dataset.route); return; }

    const href = e.target.closest('[data-href]');
    if (href) { window.open(href.dataset.href, '_blank', 'noopener'); return; }

    const productBtn = e.target.closest('[data-product-btn]');
    if (productBtn) { navigate('/product/' + productBtn.dataset.productBtn); return; }

    const product = e.target.closest('[data-product]');
    if (product) { navigate('/product/' + product.dataset.product); return; }
  });

  let _trackMode = 'phone';
  container.addEventListener('click', (e) => {
    const btn = e.target.closest('.tab-btn');
    if (!btn) return;
    container.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    _trackMode = btn.dataset.tab;
    const input = container.querySelector('#track-input');
    const icon = container.querySelector('#track-icon');
    if (_trackMode === 'phone') {
      input.placeholder = t('track_ph_phone');
      icon.textContent = '';
    } else {
      input.placeholder = t('track_ph_tracking');
      icon.textContent = '';
    }
    const res = container.querySelector('#track-result');
    if (res) { res.innerHTML = ''; res.classList.remove('visible'); }
  });

  container.addEventListener('click', (e) => {
    const searchBtn = e.target.closest('#track-search-btn');
    if (!searchBtn) return;
    const val = container.querySelector('#track-input').value.trim();
    const resultEl = container.querySelector('#track-result');
    if (!resultEl) return;
    if (!val) {
      resultEl.innerHTML = `<div style="color:#fda4af;font-size:var(--text-sm);padding:var(--space-4) 0;">${t('track_no_input')}</div>`;
      resultEl.classList.add('visible');
      return;
    }
    resultEl.innerHTML = `
      <div style="text-align:center;padding:var(--space-8) 0;">
        <div class="spinner spinner-lg" style="margin:0 auto;"></div>
        <div style="margin-top:12px;color:var(--text-3);font-size:var(--text-sm);">${t('track_searching')}</div>
      </div>`;
    resultEl.classList.add('visible');
    setTimeout(() => {
      resultEl.innerHTML = `
        <div style="border-top:1px solid var(--glass-border);padding-top:var(--space-5);margin-top:var(--space-5);">
          <div style="font-size:var(--text-sm);color:var(--text-3);margin-bottom:var(--space-4);">
            ${t('track_not_found')} "${val}"
          </div>
          <button class="btn btn-primary btn-md" data-route="/track">${t('track_full_page')}</button>
        </div>`;
    }, 1200);
  });

  container.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && e.target.id === 'track-input') {
      container.querySelector('#track-search-btn')?.click();
    }
  });
}

/* ══════════════════════════════════════════════════════════════
   SCROLL REVEAL
   ══════════════════════════════════════════════════════════════ */
function _setupScrollReveal(container) {
  if (!('IntersectionObserver' in window)) return;
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  container.querySelectorAll('.anim-fade-up, .anim-scale-in').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity .6s ease, transform .6s ease';
    obs.observe(el);
  });
  _cleanups.push(() => obs.disconnect());
}
