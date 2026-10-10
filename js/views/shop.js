/**
 * Shop View — CH.จุ่มการ์ดโคนัน
 * Features:
 *  - Advanced fuzzy search (Thai + English, partial matching, scoring)
 *  - Category filter chips
 *  - Rarity filter buttons (13 rarities, unique colors)
 *  - Sort: default / price desc / price asc / A-Z / ก-ฮ
 */
import { t, onLangChange } from '../i18n.js';
import { navigate } from '../router.js';

const DROP_URL = 'http://localhost:5173';

/* ── Rarity definitions ────────────────────────────────────── */
const RARITIES = [
  { id: 'PR',   color: '#94a3b8', bg: 'rgba(148,163,184,.15)', border: 'rgba(148,163,184,.35)' },
  { id: 'D',    color: '#22d3ee', bg: 'rgba(34,211,238,.12)',  border: 'rgba(34,211,238,.35)' },
  { id: 'C',    color: '#60a5fa', bg: 'rgba(96,165,250,.12)',  border: 'rgba(96,165,250,.35)' },
  { id: 'CP',   color: '#38bdf8', bg: 'rgba(56,189,248,.12)',  border: 'rgba(56,189,248,.35)' },
  { id: 'R',    color: '#4ade80', bg: 'rgba(74,222,128,.12)',  border: 'rgba(74,222,128,.35)' },
  { id: 'RP',   color: '#34d399', bg: 'rgba(52,211,153,.12)',  border: 'rgba(52,211,153,.35)' },
  { id: 'SR',   color: '#a78bfa', bg: 'rgba(167,139,250,.15)', border: 'rgba(167,139,250,.40)' },
  { id: 'MR',   color: '#c084fc', bg: 'rgba(192,132,252,.15)', border: 'rgba(192,132,252,.40)' },
  { id: 'SRP',  color: '#fbbf24', bg: 'rgba(251,191,36,.12)',  border: 'rgba(251,191,36,.40)' },
  { id: 'MRP',  color: '#fb923c', bg: 'rgba(251,146,60,.12)',  border: 'rgba(251,146,60,.38)' },
  { id: 'SRCP', color: '#f87171', bg: 'rgba(248,113,113,.12)', border: 'rgba(248,113,113,.38)' },
  { id: 'MRCP', color: '#f472b6', bg: 'rgba(244,114,182,.12)', border: 'rgba(244,114,182,.38)' },
  { id: 'SEC',  color: null /* gradient */, bg: null, border: null },
];

/* ── Product catalog ───────────────────────────────────────── */
const ALL_PRODUCTS = [
  { id:'p1',  name:'CONAN CT-P10',           nameEn:'Conan CT-P10 Box',       series:'Conan', seriesEn:'Conan', category:'box',  price:3200, status:'available', emoji:'', packs:'18 PACKS / BOX', desc:'กล่องการ์ดโคนัน CT-P10 รุ่นล่าสุด 18 แพ็คต่อกล่อง', descEn:'Latest Conan CT-P10 box. 18 packs per box, 5 cards per pack.' },
  { id:'p2',  name:'CONAN CT-P09',           nameEn:'Conan CT-P09 Box',       series:'Conan', seriesEn:'Conan', category:'box',  price:2800, status:'available', emoji:'', packs:'18 PACKS / BOX', desc:'กล่องการ์ดโคนัน CT-P09', descEn:'Conan CT-P09 box. 18 packs per box.' },
  { id:'p3',  name:'CONAN CT-P08',           nameEn:'Conan CT-P08 Box',       series:'Conan', seriesEn:'Conan', category:'box',  price:2600, status:'soldout',   emoji:'', packs:'18 PACKS / BOX', desc:'กล่องการ์ดโคนัน CT-P08', descEn:'Conan CT-P08 box. Sold out.' },
  { id:'p4',  name:'โคนัน เอโดงาวะ SSR',    nameEn:'Conan Edogawa SSR',      series:'Conan', seriesEn:'Conan', category:'card', price:890,  status:'available', emoji:'', rarity:'SSR',  char:'โคนัน', charEn:'Conan', desc:'การ์ด SSR โคนัน เอโดงาวะ', descEn:'SSR card — Conan Edogawa' },
  { id:'p5',  name:'โคนัน เอโดงาวะ MR',     nameEn:'Conan Edogawa MR',       series:'Conan', seriesEn:'Conan', category:'card', price:2400, status:'available', emoji:'', rarity:'MR',   char:'โคนัน', charEn:'Conan', desc:'การ์ด MR โคนัน เอโดงาวะ หายากมาก', descEn:'MR card — Conan Edogawa (very rare)' },
  { id:'p6',  name:'รัน เมาริ BP',           nameEn:'Ran Mouri BP',           series:'Conan', seriesEn:'Conan', category:'card', price:1800, status:'available', emoji:'', rarity:'BP',   char:'รัน',   charEn:'Ran', desc:'การ์ด BP รัน เมาริ', descEn:'BP card — Ran Mouri' },
  { id:'p7',  name:'ชินอิจิ คุโด้ SRP',     nameEn:'Shinichi Kudo SRP',      series:'Conan', seriesEn:'Conan', category:'card', price:3200, status:'available', emoji:'', rarity:'SRP',  char:'ชินอิจิ', charEn:'Shinichi', desc:'การ์ด SRP ชินอิจิ คุโด้ หายากมาก', descEn:'SRP card — Shinichi Kudo (very rare)' },
  { id:'p8',  name:'ไฮบาระ อาอิ SEC',       nameEn:'Ai Haibara SEC',         series:'Conan', seriesEn:'Conan', category:'card', price:5800, status:'available', emoji:'', rarity:'SEC',  char:'ไฮบาระ', charEn:'Haibara', desc:'การ์ด SEC ไฮบาระ อาอิ หายากที่สุด', descEn:'SEC card — Ai Haibara (ultra rare)' },
  { id:'p9',  name:'เฮจิ แฮตโตริ SR',       nameEn:'Heiji Hattori SR',       series:'Conan', seriesEn:'Conan', category:'card', price:480,  status:'available', emoji:'', rarity:'SR',   char:'เฮจิ',  charEn:'Heiji', desc:'การ์ด SR เฮจิ แฮตโตริ', descEn:'SR card — Heiji Hattori' },
  { id:'p10', name:'แก๊งสืบสวน R',          nameEn:'Detective Boys R',       series:'Conan', seriesEn:'Conan', category:'card', price:120,  status:'available', emoji:'', rarity:'R',    char:'แก๊ง',  charEn:'Detective Boys', desc:'การ์ด R แก๊งสืบสวน', descEn:'R card — Detective Boys' },
  { id:'p11', name:'รัน เมาริ CP',           nameEn:'Ran Mouri CP',           series:'Conan', seriesEn:'Conan', category:'card', price:680,  status:'available', emoji:'', rarity:'CP',   char:'รัน',   charEn:'Ran', desc:'การ์ด CP รัน เมาริ', descEn:'CP card — Ran Mouri' },
  { id:'p12', name:'โคนัน C',               nameEn:'Conan C',                series:'Conan', seriesEn:'Conan', category:'card', price:60,   status:'available', emoji:'', rarity:'C',    char:'โคนัน', charEn:'Conan', desc:'การ์ด C โคนัน', descEn:'C card — Conan' },
  { id:'p13', name:'CT-P10 Single Pack',     nameEn:'CT-P10 Single Pack',     series:'Conan', seriesEn:'Conan', category:'pack', price:180,  status:'available', emoji:'', desc:'1 แพ็ค CT-P10', descEn:'1 pack of CT-P10 (5 cards)' },
  { id:'p14', name:'CT-P09 Single Pack',     nameEn:'CT-P09 Single Pack',     series:'Conan', seriesEn:'Conan', category:'pack', price:160,  status:'available', emoji:'', desc:'1 แพ็ค CT-P09', descEn:'1 pack of CT-P09 (5 cards)' },
  { id:'p15', name:'Card Sleeve Premium',    nameEn:'Premium Card Sleeve',    series:'Accessories', seriesEn:'Accessories', category:'other', price:120, status:'available', emoji:'', desc:'ซองใส่การ์ดแบบ Premium', descEn:'Premium-grade card sleeve' },
  { id:'p16', name:'Binder A4 ลายโคนัน',   nameEn:'Conan A4 Card Binder',   series:'Accessories', seriesEn:'Accessories', category:'other', price:350, status:'available', emoji:'', desc:'แฟ้มใส่การ์ดลายโคนัน', descEn:'Conan-themed A4 card binder' },
  { id:'p17', name:'ชินอิจิ คุโด้ MRP',    nameEn:'Shinichi Kudo MRP',      series:'Conan', seriesEn:'Conan', category:'card', price:4200, status:'available', emoji:'', rarity:'MRP',  char:'ชินอิจิ', charEn:'Shinichi', desc:'การ์ด MRP ชินอิจิ คุโด้', descEn:'MRP card — Shinichi Kudo' },
  { id:'p18', name:'รัน เมาริ MRCP',        nameEn:'Ran Mouri MRCP',         series:'Conan', seriesEn:'Conan', category:'card', price:3800, status:'preorder',  emoji:'', rarity:'MRCP', char:'รัน',   charEn:'Ran', desc:'การ์ด MRCP รัน เมาริ (พรีออเดอร์)', descEn:'MRCP card — Ran Mouri (Pre-Order)' },
  { id:'p19', name:'โคนัน RP',              nameEn:'Conan RP',               series:'Conan', seriesEn:'Conan', category:'card', price:220,  status:'available', emoji:'', rarity:'RP',   char:'โคนัน', charEn:'Conan', desc:'การ์ด RP โคนัน', descEn:'RP card — Conan' },
  { id:'p20', name:'ไฮบาระ SRCP',           nameEn:'Haibara SRCP',           series:'Conan', seriesEn:'Conan', category:'card', price:2800, status:'available', emoji:'', rarity:'SRCP', char:'ไฮบาระ', charEn:'Haibara', desc:'การ์ด SRCP ไฮบาระ อาอิ', descEn:'SRCP card — Ai Haibara' },
  { id:'p21', name:'CONAN CT-P07',           nameEn:'Conan CT-P07 Box',       series:'Conan', seriesEn:'Conan', category:'box',  price:2400, status:'soldout',   emoji:'', packs:'18 PACKS / BOX', desc:'กล่องการ์ดโคนัน CT-P07', descEn:'Conan CT-P07 box. Sold out.' },
  { id:'p22', name:'โคนัน D',               nameEn:'Conan D',                series:'Conan', seriesEn:'Conan', category:'card', price:80,   status:'available', emoji:'', rarity:'D',    char:'โคนัน', charEn:'Conan', desc:'การ์ด D โคนัน', descEn:'D card — Conan' },
  { id:'p23', name:'เฮจิ PR',               nameEn:'Heiji PR',               series:'Conan', seriesEn:'Conan', category:'card', price:50,   status:'available', emoji:'', rarity:'PR',   char:'เฮจิ',  charEn:'Heiji', desc:'การ์ด PR เฮจิ', descEn:'PR card — Heiji' },
];

const CATS = [
  { id: 'all',  labelTh: 'ทั้งหมด', labelEn: 'All' },
  { id: 'card', labelTh: 'การ์ด',   labelEn: 'Cards' },
  { id: 'box',  labelTh: 'กล่อง',   labelEn: 'Boxes' },
  { id: 'pack', labelTh: 'แพ็ค',    labelEn: 'Packs' },
  { id: 'other',labelTh: 'อื่นๆ',   labelEn: 'Other' },
];

const SORTS = [
  { id: 'default',   th: 'จัดเรียงปกติ',       en: 'Default' },
  { id: 'price_hi',  th: 'ราคา: มาก → น้อย',   en: 'Price: High → Low' },
  { id: 'price_lo',  th: 'ราคา: น้อย → มาก',   en: 'Price: Low → High' },
  { id: 'az',        th: 'ตัวอักษร A → Z',      en: 'Name: A → Z' },
  { id: 'th_alpha',  th: 'ตัวอักษร ก → ฮ',      en: 'Name: ก → ฮ' },
];

/* ── State ─────────────────────────────────────────────────── */
let _cat     = 'all';
let _rarity  = 'all';
let _sort    = 'default';
let _query   = '';
let _unsubLang = null;

export async function mountShop(container, cat = null) {
  window.navigate = navigate;
  _cat    = cat || 'all';
  _rarity = 'all';
  _sort   = 'default';
  _query  = '';

  _render(container);
  _unsubLang = onLangChange(() => _render(container));
}

export function unmountShop() {
  if (_unsubLang) { _unsubLang(); _unsubLang = null; }
}

/* ── Main render ───────────────────────────────────────────── */
function _render(container) {
  const isEn = localStorage.getItem('cl_lang') === 'en';

  container.innerHTML = `
    <div style="padding-top:var(--space-12);padding-bottom:var(--space-16);">
      <div class="container">

        <!-- Header -->
        <div style="margin-bottom:var(--space-8);">
          <div class="section-eyebrow">${t('shop_eyebrow')}</div>
          <h1 class="section-title-th">${t('shop_title')}</h1>
        </div>

        <!-- Search bar -->
        <div class="shop-search-wrap" style="margin-bottom:var(--space-6);">
          <div class="input-wrap">
            <span class="input-icon"></span>
            <input type="search" id="shop-search" class="form-input"
              placeholder="${t('shop_search_ph')}"
              value="${_query}"
              autocomplete="off"
              spellcheck="false"
            />
            ${_query ? `<button id="shop-search-clear" style="position:absolute;right:14px;top:50%;transform:translateY(-50%);background:none;border:none;color:var(--text-3);cursor:pointer;font-size:1.2rem;padding:4px;" aria-label="Clear">✕</button>` : ''}
          </div>
        </div>

        <!-- Category filter -->
        <div style="margin-bottom:var(--space-5);">
          <div style="font-size:.68rem;font-weight:800;letter-spacing:.12em;text-transform:uppercase;color:var(--text-3);margin-bottom:var(--space-3);font-family:var(--font-en);">CATEGORY</div>
          <div class="filter-chips" id="cat-filters">
            ${CATS.map(c => {
    const count = c.id === 'all' ? ALL_PRODUCTS.length : ALL_PRODUCTS.filter(p => p.category === c.id).length;
    const label = isEn ? c.labelEn : c.labelTh;
    return `<button class="filter-chip ${c.id === _cat ? 'active' : ''}" data-cat="${c.id}" aria-pressed="${c.id === _cat}">
                ${label} <span style="opacity:.6;font-size:.7em;">(${count})</span>
              </button>`;
  }).join('')}
          </div>
        </div>

        <!-- Rarity filter buttons -->
        <div style="margin-bottom:var(--space-6);">
          <div style="font-size:.68rem;font-weight:800;letter-spacing:.12em;text-transform:uppercase;color:var(--text-3);margin-bottom:var(--space-3);font-family:var(--font-en);">RARITY</div>
          <div style="display:flex;flex-wrap:wrap;gap:var(--space-2);" id="rarity-filters">
            <button class="rarity-filter-btn ${_rarity === 'all' ? 'rarity-active' : ''}"
              data-rarity="all"
              style="border-color:rgba(255,255,255,.2);color:var(--text-2);${_rarity === 'all' ? 'background:rgba(255,255,255,.1);' : ''}"
              aria-pressed="${_rarity === 'all'}">
              ${isEn ? 'All Rarities' : 'ทุก Rarity'}
            </button>
            ${RARITIES.map(r => {
    const isActive = _rarity === r.id;
    if (r.id === 'SEC') {
      return `<button class="rarity-filter-btn ${isActive ? 'rarity-active' : ''}" data-rarity="SEC"
                  style="background:${isActive ? 'linear-gradient(135deg,rgba(255,0,128,.2),rgba(0,128,255,.2))' : 'transparent'};
                         border-image:linear-gradient(135deg,#f43f5e,#f59e0b,#22d3ee,#a855f7) 1;
                         border-color:transparent;
                         color:#fff;
                         border-style:solid;"
                  aria-label="SEC rarity" aria-pressed="${isActive}">
                  <span style="background:linear-gradient(90deg,#f43f5e,#f59e0b,#a855f7,#22d3ee);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;font-weight:900;">SEC</span>
                </button>`;
    }
    return `<button class="rarity-filter-btn ${isActive ? 'rarity-active' : ''}"
                data-rarity="${r.id}"
                style="color:${r.color};background:${isActive ? r.bg : 'transparent'};border-color:${isActive ? r.border : 'rgba(255,255,255,.12)'};"
                aria-pressed="${isActive}">
                ${r.id}
              </button>`;
  }).join('')}
          </div>
        </div>

        <!-- Sort + Results bar -->
        <div style="display:flex;align-items:center;justify-content:space-between;gap:var(--space-4);flex-wrap:wrap;margin-bottom:var(--space-6);">
          <div id="result-count" style="font-size:var(--text-sm);color:var(--text-3);">
            ${_getResultCount(isEn)}
          </div>
          <div style="display:flex;align-items:center;gap:var(--space-3);">
            <label style="font-size:.72rem;font-weight:700;color:var(--text-3);white-space:nowrap;font-family:var(--font-en);">SORT</label>
            <select class="form-select" id="shop-sort" style="width:auto;padding:9px 40px 9px 14px;font-size:.82rem;min-width:200px;" aria-label="Sort products">
              ${SORTS.map(s => `<option value="${s.id}" ${_sort === s.id ? 'selected' : ''}>${isEn ? s.en : s.th}</option>`).join('')}
            </select>
          </div>
        </div>

        <!-- Product grid -->
        <div id="shop-grid" class="products-grid"></div>

      </div>
    </div>`;

  _renderGrid(container);
  _bindShopEvents(container);
}

/* ── Grid renderer ─────────────────────────────────────────── */
function _renderGrid(container) {
  const isEn   = localStorage.getItem('cl_lang') === 'en';
  const results = _getFiltered();
  const grid    = container.querySelector('#shop-grid');
  const countEl = container.querySelector('#result-count');
  if (countEl) countEl.textContent = _getResultCount(isEn);

  if (!grid) return;
  if (results.length === 0) {
    grid.innerHTML = `
      <div class="empty-state" style="grid-column:1/-1;padding:var(--space-16) 0;">
        <div class="empty-icon"></div>
        <div class="empty-title">${t('shop_no_result')}</div>
        <div class="empty-desc">${t('shop_no_result_hint')}</div>
      </div>`;
    return;
  }
  grid.innerHTML = results.map(p => _productCard(p, isEn)).join('');
}

/* ── Product card HTML ─────────────────────────────────────── */
function _productCard(p, isEn) {
  const name     = isEn ? (p.nameEn || p.name) : p.name;
  const statusBadge = {
    available: `<span class="badge badge-available">${isEn ? 'In Stock' : 'พร้อมจำหน่าย'}</span>`,
    soldout:   `<span class="badge badge-soldout">${isEn ? 'Sold Out' : 'สินค้าหมด'}</span>`,
    preorder:  `<span class="badge badge-preorder">${isEn ? 'Pre-Order' : 'พรีออเดอร์'}</span>`,
  }[p.status] || '';

  const rarityBadge = p.rarity ? _rarityBadge(p.rarity) : '';

  return `
    <div class="product-card anim-fade-up" data-product="${p.id}" role="button" tabindex="0" aria-label="${name}">
      <div class="product-card-img">
        ${p.image ? `<img src="${p.image}" alt="${name}" style="width:100%; height:100%; object-fit:contain; border-radius:var(--r-lg);">` : p.emoji}
      </div>
      <div class="product-card-body">
        <div class="product-series">${isEn ? (p.seriesEn || p.series) : p.series}</div>
        <div class="product-name">${name}</div>
        ${p.packs ? `<div style="font-size:var(--text-xs);color:var(--text-3);margin-bottom:6px;">${p.packs}</div>` : ''}
        ${p.charEn && isEn ? `<div style="font-size:var(--text-xs);color:var(--text-3);margin-bottom:4px;">${p.charEn}</div>` : (p.char ? `<div style="font-size:var(--text-xs);color:var(--text-3);margin-bottom:4px;">${p.char}</div>` : '')}
        <div class="product-meta">
          <div class="product-price"><span>฿</span>${p.price.toLocaleString()}</div>
          <div style="display:flex;gap:4px;flex-wrap:wrap;align-items:center;">${statusBadge}${rarityBadge}</div>
        </div>
        <button class="btn btn-primary btn-sm btn-block" style="margin-top:var(--space-3);">${isEn ? 'View Details' : 'ดูรายละเอียด'}</button>
      </div>
    </div>`;
}

function _rarityBadge(r) {
  const def = RARITIES.find(x => x.id === r);
  if (!def) return `<span class="rarity" style="background:rgba(124,58,237,.15);color:#c4b5fd;border:1px solid rgba(168,85,247,.3);">${r}</span>`;
  if (r === 'SEC') {
    return `<span class="rarity" style="background:linear-gradient(135deg,rgba(244,63,94,.15),rgba(168,85,247,.15));border:1px solid rgba(168,85,247,.4);color:#fff;">
      <span style="background:linear-gradient(90deg,#f43f5e,#f59e0b,#a855f7);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;font-weight:900;">SEC</span></span>`;
  }
  return `<span class="rarity" style="background:${def.bg};border:1px solid ${def.border};color:${def.color};">${r}</span>`;
}

/* ── Filter & sort logic ───────────────────────────────────── */
function _getFiltered() {
  let list = [...ALL_PRODUCTS];

  // Category
  if (_cat !== 'all') list = list.filter(p => p.category === _cat);

  // Rarity
  if (_rarity !== 'all') list = list.filter(p => p.rarity === _rarity);

  // Search — advanced fuzzy scoring
  if (_query.trim()) {
    const scored = list
      .map(p => ({ p, score: _scoreProduct(p, _query) }))
      .filter(x => x.score > 0)
      .sort((a, b) => b.score - a.score);
    list = scored.map(x => x.p);
  }

  // Sort
  const collator = new Intl.Collator('th', { sensitivity: 'base' });
  switch (_sort) {
    case 'price_hi': list.sort((a, b) => b.price - a.price); break;
    case 'price_lo': list.sort((a, b) => a.price - b.price); break;
    case 'az':       list.sort((a, b) => (a.nameEn||a.name).localeCompare(b.nameEn||b.name, 'en')); break;
    case 'th_alpha': list.sort((a, b) => collator.compare(a.name, b.name)); break;
  }

  return list;
}

/**
 * Advanced fuzzy search scoring
 * Returns score > 0 if product matches, 0 if no match
 * Higher score = better match
 */
function _scoreProduct(p, rawQuery) {
  const q = rawQuery.toLowerCase().trim().normalize('NFD');
  if (!q) return 1;

  const tokens = q.split(/[\s,]+/).filter(t => t.length >= 1);
  if (tokens.length === 0) return 1;

  // Build searchable corpus for this product
  const corpus = [
    p.name, p.nameEn || '',
    p.series, p.seriesEn || '',
    p.category, p.rarity || '',
    p.char || '', p.charEn || '',
    p.desc || '', p.descEn || '',
    p.packs || '',
  ]
    .join(' ')
    .toLowerCase()
    .normalize('NFD');

  let totalScore = 0;

  for (const token of tokens) {
    let tokenScore = 0;

    if (corpus === token) {
      tokenScore = 200; // exact full match
    } else if (corpus.startsWith(token + ' ') || corpus.startsWith(token)) {
      tokenScore = 120; // corpus starts with token
    } else {
      // Find all occurrences and score by word boundary
      const idx = corpus.indexOf(token);
      if (idx !== -1) {
        const prevChar = idx > 0 ? corpus[idx - 1] : ' ';
        const isWordStart = prevChar === ' ' || prevChar === ',' || idx === 0;
        tokenScore = isWordStart ? 80 : 40; // word boundary vs mid-word

        // Bonus: match in name (more important than desc)
        const inName = (p.name + ' ' + (p.nameEn || '')).toLowerCase().normalize('NFD').includes(token);
        if (inName) tokenScore += 30;

        // Bonus: match in char/rarity
        const inChar = (p.char || '' + ' ' + (p.charEn || '')).toLowerCase().includes(token);
        const inRarity = (p.rarity || '').toLowerCase() === token;
        if (inChar)   tokenScore += 15;
        if (inRarity) tokenScore += 25;
      } else if (token.length >= 2) {
        // Partial match: check if any 2-char window of the token appears in corpus
        let found = false;
        for (let i = 0; i <= token.length - 2; i++) {
          const sub = token.slice(i, i + Math.min(token.length - i, 3));
          if (sub.length >= 2 && corpus.includes(sub)) {
            tokenScore = 10;
            found = true;
            break;
          }
        }
        if (!found) return 0; // this token matches nothing → reject
      } else {
        return 0; // single char not found → reject
      }
    }

    totalScore += tokenScore;
  }

  return totalScore;
}

function _getResultCount(isEn) {
  const n = _getFiltered().length;
  if (isEn) return `${n} result${n !== 1 ? 's' : ''}`;
  return `พบ ${n} รายการ`;
}

/* ── Event binding ─────────────────────────────────────────── */
function _bindShopEvents(container) {
  // Category filter
  container.querySelector('#cat-filters')?.addEventListener('click', e => {
    const btn = e.target.closest('[data-cat]');
    if (!btn) return;
    _cat = btn.dataset.cat;
    container.querySelectorAll('[data-cat]').forEach(b => {
      b.classList.toggle('active', b.dataset.cat === _cat);
      b.setAttribute('aria-pressed', b.dataset.cat === _cat);
    });
    _renderGrid(container);
    navigate('/shop' + (_cat === 'all' ? '' : '/' + _cat));
  });

  // Rarity filter
  container.querySelector('#rarity-filters')?.addEventListener('click', e => {
    const btn = e.target.closest('[data-rarity]');
    if (!btn) return;
    _rarity = btn.dataset.rarity;
    _render(container); // re-render to update button styles
  });

  // Sort
  container.querySelector('#shop-sort')?.addEventListener('change', e => {
    _sort = e.target.value;
    _renderGrid(container);
  });

  // Search — debounced
  let _searchTimer;
  container.querySelector('#shop-search')?.addEventListener('input', e => {
    clearTimeout(_searchTimer);
    _searchTimer = setTimeout(() => {
      _query = e.target.value;
      // Show/hide clear button
      const existing = container.querySelector('#shop-search-clear');
      if (_query && !existing) {
        const wrap = e.target.parentElement;
        const clr = document.createElement('button');
        clr.id = 'shop-search-clear';
        clr.setAttribute('aria-label', 'Clear search');
        clr.innerHTML = '✕';
        clr.style.cssText = 'position:absolute;right:14px;top:50%;transform:translateY(-50%);background:none;border:none;color:var(--text-3);cursor:pointer;font-size:1.2rem;padding:4px;';
        clr.addEventListener('click', () => {
          _query = '';
          container.querySelector('#shop-search').value = '';
          clr.remove();
          _renderGrid(container);
        });
        wrap.appendChild(clr);
      } else if (!_query && existing) {
        existing.remove();
      }
      _renderGrid(container);
    }, 200); // 200ms debounce
  });

  // Clear button (initial render if query existed)
  container.querySelector('#shop-search-clear')?.addEventListener('click', () => {
    _query = '';
    container.querySelector('#shop-search').value = '';
    container.querySelector('#shop-search-clear')?.remove();
    _renderGrid(container);
  });

  // Product click → detail
  container.addEventListener('click', e => {
    const r = e.target.closest('[data-route]');
    if (r) { navigate(r.dataset.route); return; }
    const p = e.target.closest('[data-product]');
    if (p) navigate('/product/' + p.dataset.product);
  });
}
