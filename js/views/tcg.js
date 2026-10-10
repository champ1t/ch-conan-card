/**
 * tcg.js v2 — Ultra Premium Conan TCG Experience
 * Features: Drag-to-Tear · Spinning Aura · 3D Tilt · 360 Spin · Rainbow Holo
 * Route: /jumm
 */

import { TCG_SETS, CARD_POOL, RARITIES, drawCards } from '../data/tcgCards.js';
import '../components/HoloCard.js';

/* ─── Storage ─────────────────────────────────────────────── */
const SAVE_KEY = 'tcg_v2';
function _load() {
  try {
    const d = JSON.parse(localStorage.getItem(SAVE_KEY) || '{}');
    const today = _today();
    const lastDate = d.lastDate || null;
    const yesterday = _dkey(new Date(Date.now() - 86400000));
    let streak = d.streak || 0;
    if (lastDate !== today && lastDate !== yesterday) streak = 0;
    return {
      collection: d.collection || [],
      streak, lastDate, today,
      soundOn: d.soundOn !== false,
      totalPulls: d.totalPulls || 0,
      lastSetId: d.lastSetId || 'CT-P04',
      pity: d.pity || { purple: 0, gold: 0, red: 0 }
    };
  } catch {
    return { collection: [], streak: 0, lastDate: null, today: _today(), soundOn: true, totalPulls: 0, lastSetId: 'CT-P04' };
  }
}
function _save(s) {
  localStorage.setItem(SAVE_KEY, JSON.stringify({
    collection: s.collection, streak: s.streak,
    lastDate: s.today, soundOn: s.soundOn, totalPulls: s.totalPulls,
    lastSetId: _selectedSetId,
  }));
}
function _today() { return _dkey(new Date()); }
function _dkey(d) { return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`; }

/* ─── State ───────────────────────────────────────────────── */
let _root = null, _state = null, _view = 'home', _animLock = false;
let _timers = [], _cleanups = [], _currentFilter = 'ALL';
let _selectedSetId = 'CT-P04';

function _getSet(id = _selectedSetId) {
  return TCG_SETS.find(s => s.id === id) || TCG_SETS[0];
}

function _setTimeout(fn, ms) { const t = setTimeout(fn, ms); _timers.push(t); return t; }
function _addCleanup(fn) { _cleanups.push(fn); }
function _clearAll() {
  _timers.forEach(clearTimeout); _timers = [];
  _cleanups.forEach(fn => { try { fn(); } catch {} }); _cleanups = [];
}
const _delay = ms => new Promise(r => _setTimeout(r, ms));

/* ─── CSS ─────────────────────────────────────────────────── */
function _ensureCSS() {
  if (!document.getElementById('css-tcg')) {
    const l = document.createElement('link');
    l.id = 'css-tcg'; l.rel = 'stylesheet'; l.href = 'css/pages/tcg.css?v=3.0';
    document.head.appendChild(l);
  }
}

/* ─── Rarity Helpers ──────────────────────────────────────── */
function _R(card) { return RARITIES[card.rarity]; }
function _rarityStyle(card) {
  const r = _R(card);
  return `--card-color:${r.color};--c1:${card.color1};--c2:${card.color2};`;
}
function _rarityBadge(rarity) {
  const r = RARITIES[rarity];
  if (rarity === 'SEC' || rarity === 'SECSign') return `<span class="tcg-rarity-badge sec">${r.short}</span>`;
  return `<span class="tcg-rarity-badge" style="--card-color:${r.color};--card-badge-bg:${r.badgeBg};">${r.short}</span>`;
}

/* ─── Card Front HTML ─────────────────────────────────────── */
function _cardFrontHTML(card) {
  const r = _R(card);
  return `
    <div class="tcg-card-front-face tcg-card-face" style="${_rarityStyle(card)}">
      <div class="tcg-card-corner tl" style="--card-color:${r.color}"></div>
      <div class="tcg-card-corner tr" style="--card-color:${r.color}"></div>
      <div class="tcg-card-corner bl" style="--card-color:${r.color}"></div>
      <div class="tcg-card-corner br" style="--card-color:${r.color}"></div>
      <div class="tcg-card-art" style="flex:1;position:relative;display:flex;align-items:center;justify-content:center;overflow:hidden;">
        <div class="tcg-card-art-bg" style="position:absolute;inset:0;background:radial-gradient(circle at center,${r.color} 0%,transparent 65%);opacity:.09;"></div>
        <div class="tcg-card-art-scan" style="position:absolute;inset:0;background:repeating-linear-gradient(0deg,rgba(0,0,0,0) 0,rgba(0,0,0,0) 3px,rgba(0,0,0,.03) 3px,rgba(0,0,0,.03) 4px);pointer-events:none;"></div>
        ${card.image ? '' : ''}
      </div>
      <div class="tcg-card-info">
        <div class="tcg-card-name">${card.name}</div>
        <div class="tcg-card-meta">
          <div class="tcg-card-num">#${card.num} · ${card.set}</div>
          ${_rarityBadge(card.rarity)}
        </div>
      </div>
      ${r.holographic ? `<div class="tcg-card-rainbow" style="position:absolute;inset:0;border-radius:18px;pointer-events:none;mix-blend-mode:color-dodge;background:radial-gradient(circle at calc(var(--mx,.5)*100%) calc(var(--my,.5)*100%),rgba(255,255,255,.9) 0%,rgba(255,200,255,.3) 22%,transparent 55%),linear-gradient(135deg,rgba(255,0,80,.22) 0%,rgba(255,130,0,.22) 14%,rgba(255,220,0,.22) 28%,rgba(60,255,60,.22) 42%,rgba(0,200,255,.22) 56%,rgba(30,80,255,.22) 70%,rgba(160,0,255,.22) 84%,rgba(255,0,140,.22) 100%);background-size:100%,300% 300%;background-position:center,calc(var(--mx,.5)*100%) calc(var(--my,.5)*100%);opacity:0;transition:opacity .3s;"></div>` : ''}
      <div class="tcg-card-holo" style="position:absolute;inset:0;border-radius:18px;background:radial-gradient(circle at calc(var(--mx,.5)*100%) calc(var(--my,.5)*100%),rgba(255,255,255,.22) 0%,transparent 55%);mix-blend-mode:color-dodge;pointer-events:none;opacity:0;transition:opacity .3s;"></div>
      <div class="tcg-card-sweep"></div>
    </div>`;
}

/* ─── Card Back HTML ──────────────────────────────────────── */
function _cardBackHTML(card) {
  const r = _R(card);
  const obtained = _state.collection.find(e => e.cardId === card.id);
  return `
    <div class="tcg-card-back-face tcg-card-face" style="transform:rotateY(180deg);">
      <div class="tcg-card-back-grid"></div>
      <div class="tcg-card-back-logo">DETECTIVE<br>CONAN<br>TCG</div>
      <div class="tcg-card-back-rows">
        <div class="tcg-card-back-row"><span class="tcg-card-back-label">Card</span><span class="tcg-card-back-val">#${card.num}</span></div>
        <div class="tcg-card-back-row"><span class="tcg-card-back-label">Set</span><span class="tcg-card-back-val">${card.set}</span></div>
        <div class="tcg-card-back-row"><span class="tcg-card-back-label">Rarity</span><span class="tcg-card-back-val" style="color:${r.color}">${r.label}</span></div>
        <div class="tcg-card-back-row"><span class="tcg-card-back-label">Obtained</span><span class="tcg-card-back-val">${obtained?.date || '—'}</span></div>
      </div>
    </div>`;
}

/* ─── Full Card Element (Width x Height needed) ───────────── */
function _buildCard(card, w = 240, h = 336, opts = {}) {
  const r = _R(card);
  const el = document.createElement('div');
  el.className = 'tcg-card';
  el.style.cssText = `width:${w}px;height:${h}px;${_rarityStyle(card)}`;
  el.innerHTML = `
    <div class="tcg-card-inner" style="width:${w}px;height:${h}px;transform-style:preserve-3d;">
      ${_cardFrontHTML(card)}
      ${_cardBackHTML(card)}
    </div>`;

  // Aura (for holo cards)
  if (r.holographic && !opts.noAura) {
    const aura = document.createElement('div');
    aura.className = 'tcg-card-aura on';
    aura.style.cssText = `position:absolute;inset:-25px;border-radius:26px;pointer-events:none;z-index:-1;box-shadow:0 0 50px ${r.color},0 0 100px ${r.color};opacity:.4;animation:tcgAuraPulse 2s ease-in-out infinite alternate;`;
    el.appendChild(aura);
  }
  // Halo rings (SR+ Parallel and above)
  if (['CP','CP2','SRP','SRCP','MR','MRP','MRCP','SEC','SECSign'].includes(card.rarity) && !opts.noAura) {
    const halo = document.createElement('div');
    halo.style.cssText = `position:absolute;inset:-35px;border-radius:50%;border:2px solid ${r.color};opacity:.5;pointer-events:none;z-index:-2;box-shadow:0 0 20px ${r.color};animation:tcgHaloSpin 5s linear infinite;`;
    el.appendChild(halo);
    const halo2 = document.createElement('div');
    halo2.style.cssText = `position:absolute;inset:-50px;border-radius:50%;border:1px dashed ${r.color};opacity:.25;pointer-events:none;z-index:-3;animation:tcgHaloSpin 8s linear infinite reverse;`;
    el.appendChild(halo2);
  }
  return el;
}

/* ─── 3D Tilt & Manual Spin ─────────────────────────────────── */
function _bindTilt(el, deg = 22, opts = {}) {
  if (!el) return;
  const isMobile = matchMedia('(hover:none)').matches;
  let isDragging = false;
  let startX = 0, startY = 0;
  let currentRx = 0, currentRy = 0;
  let baseRx = 0, baseRy = 0;
  const ROT_SPEED = 0.6; // Sensitivity for manual spin

  const updateTilt = (mx, my) => {
    if (isDragging) return;
    el.style.setProperty('--mx', mx.toFixed(3));
    el.style.setProperty('--my', my.toFixed(3));
    el.classList.add('tilt','is-hover');
    // Normal tilt
    if (!el.classList.contains('manual-spin')) {
      el.style.transform = `rotateY(${(mx - .5) * deg}deg) rotateX(${(.5 - my) * deg}deg)`;
    }
    el.querySelectorAll('.tcg-card-holo,.tcg-card-rainbow').forEach(holo => {
      holo.style.setProperty('--mx', mx.toFixed(3));
      holo.style.setProperty('--my', my.toFixed(3));
      holo.style.opacity = '1';
    });
  };
  const resetTilt = () => {
    if (isDragging) return;
    el.classList.remove('tilt','is-hover');
    el.style.setProperty('--mx', '.5');
    el.style.setProperty('--my', '.5');
    if (!el.classList.contains('manual-spin')) el.style.transform = '';
    el.querySelectorAll('.tcg-card-holo,.tcg-card-rainbow').forEach(h => h.style.opacity = '0');
  };

  // Manual Drag to Spin logic
  const onDragStart = (x, y) => {
    if (!opts.allowDrag) return;
    isDragging = true;
    startX = x; startY = y;
    el.classList.add('manual-spin');
    // Use a very fast ease-out to make drag feel incredibly smooth and slightly weighty
    el.style.transition = 'transform 0.1s cubic-bezier(0.2, 0.8, 0.2, 1)'; 
  };
  const onDragMove = (x, y) => {
    if (!isDragging) return;
    const dx = x - startX;
    const dy = y - startY;
    currentRy = baseRy + dx * 0.8; // Increased sensitivity slightly for easier spin
    currentRx = baseRx - dy * 0.8;
    el.style.transform = `rotateY(${currentRy}deg) rotateX(${currentRx}deg)`;
    
    // Fake light source based on rotation
    const mx = (Math.sin(currentRy * Math.PI / 180) + 1) / 2;
    const my = (Math.sin(currentRx * Math.PI / 180) + 1) / 2;
    el.style.setProperty('--mx', mx.toFixed(3));
    el.style.setProperty('--my', my.toFixed(3));
    el.querySelectorAll('.tcg-card-holo,.tcg-card-rainbow').forEach(h => {
      h.style.opacity = '1';
      h.style.setProperty('--mx', mx.toFixed(3));
      h.style.setProperty('--my', my.toFixed(3));
    });
  };
  const onDragEnd = () => {
    if (!isDragging) return;
    isDragging = false;
    baseRy = currentRy;
    baseRx = currentRx;
    // Longer smooth transition when letting go
    el.style.transition = 'transform 0.4s cubic-bezier(0.34,1.56,0.64,1)'; 
    if (!opts.allowDrag) resetTilt();
  };

  if (!isMobile) {
    const mm = e => {
      if (isDragging) {
        onDragMove(e.clientX, e.clientY);
      } else {
        const r = el.getBoundingClientRect();
        updateTilt((e.clientX - r.left) / r.width, (e.clientY - r.top) / r.height);
      }
    };
    const ml = () => { onDragEnd(); resetTilt(); };
    const md = e => { e.preventDefault(); onDragStart(e.clientX, e.clientY); };
    const mu = () => { onDragEnd(); };
    
    el.addEventListener('mousemove', mm);
    el.addEventListener('mouseleave', ml);
    if (opts.allowDrag) {
      el.addEventListener('mousedown', md);
      window.addEventListener('mouseup', mu);
    }
    _addCleanup(() => { 
      el.removeEventListener('mousemove', mm); el.removeEventListener('mouseleave', ml); 
      el.removeEventListener('mousedown', md); window.removeEventListener('mouseup', mu);
    });
  } else {
    // Touch-based tilt & drag
    const ts = e => { 
      const t = e.touches[0]; 
      onDragStart(t.clientX, t.clientY);
    };
    const tm = e => {
      e.preventDefault();
      const t = e.touches[0];
      if (isDragging) {
        onDragMove(t.clientX, t.clientY);
      } else {
        const r = el.getBoundingClientRect();
        updateTilt((t.clientX - r.left) / r.width, (t.clientY - r.top) / r.height);
      }
    };
    const te = () => { onDragEnd(); resetTilt(); };
    
    el.addEventListener('touchstart', ts, { passive:false });
    el.addEventListener('touchmove', tm, { passive:false });
    el.addEventListener('touchend', te);
    _addCleanup(() => {
      el.removeEventListener('touchstart', ts);
      el.removeEventListener('touchmove', tm);
      el.removeEventListener('touchend', te);
    });
  }
}

/* ─── Flash ───────────────────────────────────────────────── */
function _flash(color = '#fff') {
  if (window.matchMedia('(max-width: 1024px)').matches) return; // skip on mobile
  const f = document.createElement('div');
  f.className = 'tcg-flash';
  f.style.background = color;
  document.body.appendChild(f);
  _setTimeout(() => f.remove(), 800);
}

/* ─── Particle Burst ──────────────────────────────────────── */
function _burst(x, y, color, count = 40, spread = 200) {
  // Halve particles on mobile/touch devices for performance
  const isMobile = window.matchMedia('(max-width: 1024px)').matches;
  const actualCount = isMobile ? Math.ceil(count / 3) : count;
  for (let i = 0; i < actualCount; i++) {
    const p = document.createElement('div');
    p.className = 'tcg-particle';
    const angle = (i / actualCount) * 360 + Math.random() * 20;
    const dist = spread * (.4 + Math.random() * .6);
    const tx = Math.cos(angle * Math.PI / 180) * dist;
    const ty = Math.sin(angle * Math.PI / 180) * dist - 80;
    const size = 4 + Math.random() * 6;
    const colors = color === 'rainbow'
      ? `hsl(${Math.random()*360},100%,70%)`
      : color;
    p.style.cssText = `left:${x}px;top:${y}px;background:${colors};width:${size}px;height:${size}px;border-radius:${Math.random()>.5?'50%':'3px'};--tx:${tx}px;--ty:${ty}px;--rot:${Math.random()*720}deg;--dur:${.6+Math.random()*.8}s;--del:${Math.random()*.2}s;box-shadow:0 0 8px ${colors};`;
    document.body.appendChild(p);
    _setTimeout(() => p.remove(), 1400);
  }
}

/* ─── Floating Sparkles (Home) ────────────────────────────── */
function _spawnSparkles(container) {
  // Skip sparkles on mobile for perf
  if (window.matchMedia('(max-width: 1024px)').matches) return;
  const colors = ['#a855f7','#60a5fa','#ec4899','#f59e0b','#10b981'];
  for (let i = 0; i < 14; i++) {
    const s = document.createElement('div');
    s.className = 'tcg-sparkle';
    const size = 3 + Math.random() * 5;
    const c = colors[Math.floor(Math.random() * colors.length)];
    const angle = Math.random() * 360;
    const dist = 80 + Math.random() * 120;
    s.style.cssText = `
      width:${size}px;height:${size}px;
      left:calc(50% + ${(Math.random()-.5)*200}px);
      top:calc(50% + ${(Math.random()-.5)*200}px);
      background:${c};color:${c};
      --d:${3+Math.random()*5}s;--del:${Math.random()*4}s;
      --tx:${Math.cos(angle*Math.PI/180)*dist}px;
      --ty:${Math.sin(angle*Math.PI/180)*dist}px;
      border-radius:50%;
    `;
    container.appendChild(s);
  }
}

function _renderHome() {
  const currentSet = _getSet(_selectedSetId);
  const setCards = CARD_POOL.filter(c => c.set === currentSet.id);
  
  // Get top 6 highest rarity cards for HOT CARDS
  const hotCards = setCards.sort((a,b) => {
    const val = r => ({ 'N':1, 'R':2, 'SR':3, 'CP':4, 'MR':5, 'SRP':6, 'SEC':7, 'SECSign':8 }[r] || 0);
    return val(b.rarity) - val(a.rarity);
  }).slice(0, 8);

  const html = `
  <div class="tcg-premium-app" style="--pack-color:${currentSet.themeColor};--pack-glow:${currentSet.auraColor};">
    
    <!-- Background FX -->
    <div class="tcg-premium-bg">
       <!-- Generated AAA Background Image -->
       <div class="tcg-bg-image" style="background-image:url('img/tcg_bg_premium.jpg');"></div>
       <!-- Cinematic overlay layers -->
       <div class="tcg-bg-vignette"></div>
       <div class="tcg-bg-left-fade"></div>
       <div class="tcg-bg-right-fade"></div>
       <!-- Animated grid -->
       <div class="tcg-bg-grid"></div>
       <!-- Ambient glow orbs -->
       <div class="tcg-bg-orb orb-blue"></div>
       <div class="tcg-bg-orb orb-purple"></div>
       <div class="tcg-bg-orb orb-cyan"></div>
       <!-- Floating particles canvas -->
       <canvas class="tcg-bg-particles-canvas" id="tcg-particles-canvas"></canvas>
       <!-- Scanline effect -->
       <div class="tcg-bg-scanlines"></div>
    </div>

    <!-- Top Navigation -->
    <header class="tcg-top-nav glass-panel">
      <div class="tcg-logo">
        <span class="tcg-logo-main">DETECTIVE <span style="color:#60a5fa">CONAN</span></span>
        <span class="tcg-logo-sub">CARD GAME LIVE PULL SYSTEM</span>
      </div>
      <nav class="tcg-top-links">
        <button class="active">HOME</button>
        <button>JUMP</button>
        <button>COLLECTION</button>
        <button>RANKING</button>
        <button>SHOP</button>
      </nav>
      <div class="tcg-user-bar">
        <div class="tcg-profile-sm glass-pill">
          <img src="https://placehold.co/40x40/1e3a8a/fff?text=J" alt="Avatar" class="tcg-profile-avatar">
          <div class="tcg-profile-text">
            <div class="name">JACKPOT</div>
            <div class="level">Lv.12 <div class="tcg-level-bar"><div class="fill" style="width:75%;background:#60a5fa;box-shadow:0 0 10px #60a5fa;"></div></div></div>
          </div>
        </div>
        <div class="tcg-currency glass-pill">
          <span class="icon" style="color:#60a5fa"></span> <span class="val">3,580</span> <button class="add">+</button>
        </div>
      </div>
    </header>

    <!-- Main Grid Layout -->
    <div class="tcg-premium-layout">
      


      <!-- Center Stage -->
      <main class="tcg-center-stage">

        <!-- Floating Set Info LEFT -->
        <div class="tcg-float-set-info glass-panel" id="tcg-float-set-info">
          <div class="float-set-badge" style="color:${currentSet.themeColor};border-color:${currentSet.themeColor};box-shadow:0 0 20px ${currentSet.auraColor};">PACK</div>
          <div class="float-set-id" style="color:${currentSet.themeColor};text-shadow:0 0 20px ${currentSet.auraColor};">${currentSet.id}</div>
          <div class="float-set-name">${currentSet.nameEn || currentSet.name}</div>
          <div class="float-set-desc">${currentSet.desc}</div>
          <div class="float-divider" style="background:${currentSet.themeColor};"></div>
          <button class="tcg-float-detail-btn" style="--btn-color:${currentSet.themeColor};--btn-glow:${currentSet.auraColor};">ดูรายละเอียด</button>
          <button class="tcg-float-hot-btn" id="tcg-open-hotcards" style="--btn-color:#f59e0b;--btn-glow:#f59e0b80;">
            HOT CARDS
            <span class="hot-count">${hotCards.length}</span>
          </button>
        </div>

        <!-- Floating Pity/Guarantee RIGHT -->
        <div class="tcg-float-pity glass-panel" id="tcg-float-pity">
          <div class="float-pity-title">GUARANTEE</div>
          <div class="pity-gauge-row">
            <div class="pity-gauge-label">SR / MR</div>
            <div class="pity-gauge-track">
              <div class="pity-gauge-fill purple" style="width:${(_state.pity.purple/10)*100}%;"></div>
              <div class="pity-gauge-glow purple" style="opacity:${_state.pity.purple/10};"></div>
            </div>
            <div class="pity-gauge-val">${_state.pity.purple}<span>/10</span></div>
          </div>
          <div class="pity-gauge-row">
            <div class="pity-gauge-label">SRP / MRP+</div>
            <div class="pity-gauge-track">
              <div class="pity-gauge-fill gold" style="width:${(_state.pity.gold/20)*100}%;"></div>
              <div class="pity-gauge-glow gold" style="opacity:${_state.pity.gold/20};"></div>
            </div>
            <div class="pity-gauge-val">${_state.pity.gold}<span>/20</span></div>
          </div>
          <div class="pity-gauge-row">
            <div class="pity-gauge-label">SEC</div>
            <div class="pity-gauge-track">
              <div class="pity-gauge-fill red" style="width:${(_state.pity.red/300)*100}%;"></div>
              <div class="pity-gauge-glow red" style="opacity:${Math.min(_state.pity.red/150, 1)};"></div>
            </div>
            <div class="pity-gauge-val">${_state.pity.red}<span>/300</span></div>
          </div>
        </div>

        <!-- Pack Display Area -->
        <div class="tcg-stage-pack-area">

          <!-- 3D Holographic Pack Display -->
          <div class="tcg-holo-display" id="tcg-pack-stage" style="--pack-color:${currentSet.themeColor};--pack-glow:${currentSet.auraColor};">
            
            <!-- Platform image (bottom) -->
            <div class="tcg-holo-platform-img"></div>
            
            <!-- Holo energy rings -->
            <div class="tcg-holo-cylinder glass-cylinder"></div>
            <div class="tcg-holo-base">
              <div class="tcg-holo-ring r1"></div>
              <div class="tcg-holo-ring r2"></div>
              <div class="tcg-holo-ring r3"></div>
            </div>
            
            <!-- Energy beam up effect -->
            <div class="tcg-energy-beam"></div>
            
            <!-- Floating particles around pack -->
            <div class="tcg-pack-particles">
              ${Array.from({length:12},(_,i) => `<div class="pack-particle" style="--i:${i};--angle:${i*30}deg;--delay:${(i*0.2).toFixed(1)}s;--size:${4+Math.random()*4}px"></div>`).join('')}
            </div>
            
            <div class="tcg-pack-carousel-wrap">
              <button class="tcg-pack-arrow prev glass-circle" id="tcg-prev-set">‹</button>
              
              <div class="tcg-pack-wrap idle" id="tcg-home-pack">
                <!-- Holographic scan line on pack -->
                <div class="tcg-pack-holo-scan"></div>
                <div class="tcg-pack-3d" id="tcg-pack-3d">
                  <div class="tcg-pack premium" id="tcg-pack" style="background:#050508;--pack-glow:${currentSet.auraColor};--pack-color:${currentSet.themeColor};">
                    <div class="tcg-pack-graphic">
                      <div class="pack-shard-bg"></div>
                      <div class="pack-portal"></div>
                      <div class="pack-title">BOOSTER PACK</div>
                      <div class="pack-set-code">${currentSet.id}</div>
                      <div class="pack-logo-triangle"></div>
                    </div>
                    <div class="tcg-pack-crimp-top"></div>
                    <div class="tcg-pack-tearline"></div>
                    <div class="tcg-pack-foil"></div>
                    <div class="tcg-pack-rainbow"></div>
                    <div class="tcg-pack-crimp-bottom"></div>
                    <!-- Inner glow border -->
                    <div class="tcg-pack-inner-glow"></div>
                  </div>
                </div>
              </div>

              <button class="tcg-pack-arrow next glass-circle" id="tcg-next-set">›</button>
            </div>
            
            <div class="tcg-set-label-float glass-pill">${currentSet.id}</div>
          </div>

          <!-- Pull Action Buttons -->
          <div class="tcg-pull-control-panel">
            <button class="tcg-btn-pull primary" id="tcg-jumm-btn-1">
              <div class="btn-inner">
                <div class="btn-label">สุ่ม 1 แพ็ก</div>
                <div class="btn-price">120 B</div>
              </div>
              <div class="btn-shine"></div>
            </button>
            <button class="tcg-btn-pull secondary" id="tcg-jumm-btn-10">
              <div class="btn-inner">
                <div class="btn-label">สุ่มแบบพิเศษ</div>
                <div class="btn-price">200 B</div>
              </div>
              <div class="btn-shine"></div>
            </button>
          </div>

        </div><!-- end tcg-stage-pack-area -->

      </main>

      <!-- HOT CARDS POPUP OVERLAY -->
      <div class="tcg-hotcards-overlay" id="tcg-hotcards-overlay">
        <div class="tcg-hotcards-popup glass-panel">
          <div class="hotcards-popup-header">
            <div class="hotcards-popup-title">
              <span class="hot-fire">HOT CARDS</span>
              <small>การ์ดสุดฮิตจากแพ็กนี้</small>
            </div>
            <button class="hotcards-close-btn" id="tcg-close-hotcards">✕</button>
          </div>
          <div class="hotcards-popup-grid">
            ${hotCards.map((c, idx) => {
              const r = _R(c);
              return `
                <div class="hotcard-popup-item" style="--rarity-color:${r.color};--rarity-glow:${r.color}60;">
                  <div class="hotcard-popup-img" style="${c.image ? `background-image:url('${c.image}')` : `background:linear-gradient(135deg,${c.color1||'#2a1a3a'},${c.color2||'#0d0818'})`};">
                    <div class="hotcard-popup-shine"></div>
                    <div class="hotcard-popup-rarity" style="background:${r.color};color:#000;">${c.rarity}</div>
                  </div>
                  <div class="hotcard-popup-name">${c.nameEn || c.name}</div>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      </div>



    </div>
    
    <!-- Footer Info -->
    <footer class="tcg-premium-bottom-bar glass-panel">
      <div class="footer-left">
         <img src="https://placehold.co/40/transparent/fff?text=C" class="conan-chibi">
         <div class="tcg-bottom-quote">"ความจริงมีเพียงหนึ่งเดียว" <br><small>- 江戸川 コナン -</small></div>
      </div>
      
      <div class="tcg-bottom-links">
        <div class="link-item"><span class="icon glass-circle sm">️</span> <div class="txt">Rarity System<br><small>ระบบระดับความหายาก</small></div></div>
        <div class="link-item"><span class="icon glass-circle sm"></span> <div class="txt">Ranking<br><small>อันดับผู้เล่น</small></div></div>
        <div class="link-item"><span class="icon glass-circle sm"></span> <div class="txt">Mission<br><small>ภารกิจรับของรางวัล</small></div></div>
      </div>

      <div class="footer-right">
        DETECTIVE CONAN<br><small>THE TRUTH ALWAYS WINS</small>
      </div>
    </footer>

  </div>`;

  return html;
}

function _switchSet(setId) {
  if (_selectedSetId === setId || _animLock) return;
  _selectedSetId = setId;
  _state.lastSetId = setId;
  _save(_state);

  const pack = document.getElementById('tcg-pack');
  if (pack) {
    pack.classList.add('switching');
    _setTimeout(() => {
      const content = document.getElementById('tcg-content');
      if (content && _view === 'home') {
        content.innerHTML = _renderHome();
        const newHome = content.querySelector('.tcg-home');
        if (newHome) newHome.style.animation = 'none';
        
        const newPack = document.getElementById('tcg-pack');
        if (newPack) newPack.classList.add('enter-from-switch');

        _bindHomeEvents();
      }
    }, 250);
  } else {
    const content = document.getElementById('tcg-content');
    if (content && _view === 'home') {
      content.innerHTML = _renderHome();
      _bindHomeEvents();
    }
  }
}

function _bindHomeEvents() {
  // Activate aura rings
  _setTimeout(() => {
    document.getElementById('tcg-pack-stage')?.classList.add('active');
  }, 300);

  // Spawn sparkles
  const sparkleContainer = document.getElementById('tcg-home-sparkles');
  if (sparkleContainer) _spawnSparkles(sparkleContainer);

  // ── Canvas Particle System (Desktop only for perf) ─────────────────────────────────
  const canvas = document.getElementById('tcg-particles-canvas');
  if (canvas && !window.matchMedia('(max-width: 1024px)').matches) {
    const ctx = canvas.getContext('2d');
    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; };
    resize();
    const resizeObs = new ResizeObserver(resize);
    resizeObs.observe(canvas.parentElement);
    _addCleanup(() => resizeObs.disconnect());

    const PARTICLE_COUNT = 80;
    const particles = Array.from({ length: PARTICLE_COUNT }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: 1 + Math.random() * 2,
      vx: (Math.random() - 0.5) * 0.3,
      vy: -0.1 - Math.random() * 0.4,
      alpha: 0.2 + Math.random() * 0.6,
      hue: 190 + Math.random() * 80, // blue-purple range
    }));

    let animId;
    const tick = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.y < -5) { p.y = canvas.height + 5; p.x = Math.random() * canvas.width; }
        if (p.x < -5) p.x = canvas.width + 5;
        if (p.x > canvas.width + 5) p.x = -5;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 100%, 75%, ${p.alpha})`;
        ctx.shadowBlur = 8;
        ctx.shadowColor = `hsla(${p.hue}, 100%, 75%, 0.5)`;
        ctx.fill();
      });
      animId = requestAnimationFrame(tick);
    };
    tick();
    _addCleanup(() => cancelAnimationFrame(animId));
  }

  // Pack 3D tilt (desktop mouse follow only — skipped on mobile for 120fps)
  const pack3d = document.getElementById('tcg-pack-3d');
  const packWrap = document.getElementById('tcg-home-pack');
  if (pack3d && packWrap && !window.matchMedia('(max-width: 1024px)').matches) {
    const onMove = e => {
      const r = packWrap.getBoundingClientRect();
      const mx = ((e.clientX - r.left) / r.width).toFixed(3);
      const my = ((e.clientY - r.top) / r.height).toFixed(3);
      pack3d.style.transform = `rotateY(${(mx - .5) * 24}deg) rotateX(${(.5 - my) * 18}deg)`;
      // Update foil
      const foil = packWrap.querySelector('.tcg-pack-foil');
      if (foil) foil.style.transform = `translateX(${(mx - .5) * -80}px)`;
    };
    const onLeave = () => {
      pack3d.style.transform = '';
    };
    packWrap.addEventListener('mousemove', onMove);
    packWrap.addEventListener('mouseleave', onLeave);
    _addCleanup(() => {
      packWrap.removeEventListener('mousemove', onMove);
      packWrap.removeEventListener('mouseleave', onLeave);
    });
  }

  // Set tabs switcher click
  document.querySelectorAll('.tcg-set-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      _switchSet(tab.dataset.set);
    });
  });

  // Prev / Next buttons
  document.getElementById('tcg-prev-set')?.addEventListener('click', e => {
    e.stopPropagation();
    const idx = TCG_SETS.findIndex(s => s.id === _selectedSetId);
    const prevIdx = (idx - 1 + TCG_SETS.length) % TCG_SETS.length;
    _switchSet(TCG_SETS[prevIdx].id);
  });

  document.getElementById('tcg-next-set')?.addEventListener('click', e => {
    e.stopPropagation();
    const idx = TCG_SETS.findIndex(s => s.id === _selectedSetId);
    const nextIdx = (idx + 1) % TCG_SETS.length;
    _switchSet(TCG_SETS[nextIdx].id);
  });

  // Pack click = open pack
  packWrap?.addEventListener('click', _startOpenPack);
  document.getElementById('tcg-jumm-btn-1')?.addEventListener('click', _startOpenPack);
  document.getElementById('tcg-jumm-btn-10')?.addEventListener('click', _startOpenPack);

  // Hot cards popup
  const openHotCards = document.getElementById('tcg-open-hotcards');
  const closeHotCards = document.getElementById('tcg-close-hotcards');
  const hotOverlay = document.getElementById('tcg-hotcards-overlay');

  const showHotCards = () => {
    if (hotOverlay) {
      hotOverlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  };
  const hideHotCards = () => {
    if (hotOverlay) {
      hotOverlay.classList.remove('active');
      document.body.style.overflow = '';
    }
  };

  openHotCards?.addEventListener('click', (e) => { e.stopPropagation(); showHotCards(); });
  closeHotCards?.addEventListener('click', hideHotCards);
  hotOverlay?.addEventListener('click', (e) => { if (e.target === hotOverlay) hideHotCards(); });
  _addCleanup(() => { document.body.style.overflow = ''; });

  // Interactive UI features & Modals
  const _showToast = (msg, icon = '') => {
    const existing = document.querySelector('.tcg-toast-modal');
    if (existing) existing.remove();
    const t = document.createElement('div');
    t.className = 'tcg-toast-modal';
    t.style.cssText = 'position:fixed;bottom:30px;right:30px;z-index:9999;background:rgba(15,23,42,0.95);backdrop-filter:blur(12px);border:1px solid rgba(96,165,250,0.4);border-radius:14px;padding:14px 22px;color:white;font-family:sans-serif;font-size:0.85rem;box-shadow:0 10px 30px rgba(0,0,0,0.8),0 0 20px rgba(96,165,250,0.3);display:flex;align-items:center;gap:12px;animation:tcgToastIn 0.3s cubic-bezier(0.16,1,0.3,1);';
    t.innerHTML = `<span style="font-size:1.4rem;">${icon}</span><div>${msg}</div>`;
    document.body.appendChild(t);
    setTimeout(() => {
      t.style.opacity = '0';
      t.style.transform = 'translateY(10px)';
      t.style.transition = 'all 0.3s ease';
      setTimeout(() => t.remove(), 300);
    }, 2500);
  };

  // Promo Banner View button
  document.querySelector('.tcg-promo-banner .view-btn')?.addEventListener('click', () => {
    _showToast('การันตี SSR เมื่อเปิดสะสมครบ 10 ซอง! (คูปองโบนัสสะสมแล้ว 3/10)');
  });

  // Live Chat input send
  const chatInput = document.querySelector('.tcg-chat-input input');
  const chatSendBtn = document.querySelector('.tcg-chat-input button');
  const sendMsg = () => {
    if (chatInput && chatInput.value.trim()) {
      const chatList = document.querySelector('.tcg-chat-list');
      if (chatList) {
        const msgDiv = document.createElement('div');
        msgDiv.className = 'tcg-chat-msg';
        msgDiv.innerHTML = `<img src="https://placehold.co/20/3b82f6/fff?text=YOU" class="chat-av"><div class="msg"><span class="name" style="color:#60a5fa">คุณ:</span> ${chatInput.value.trim()}</div>`;
        chatList.appendChild(msgDiv);
        chatList.scrollTop = chatList.scrollHeight;
      }
      chatInput.value = '';
    }
  };
  chatSendBtn?.addEventListener('click', sendMsg);
  chatInput?.addEventListener('keydown', (e) => { if (e.key === 'Enter') sendMsg(); });

  // Bottom Links (Rarity System, Ranking, Mission)
  const bottomLinks = document.querySelectorAll('.tcg-bottom-links .link-item');
  bottomLinks[0]?.addEventListener('click', () => {
    _showToast('<b>Drop Rates:</b> C 35.2% · R 25% · CP 12% · RP 8% · D 6% · SR 5% · MR 3% · SRP 2% · MRP 1.2% · SRCP 0.8% · MRCP 0.6% · SEC 0.1%');
  });
  bottomLinks[1]?.addEventListener('click', () => {
    _showToast('<b>Ranking:</b> อันดับ 1. JACKPOT (3,580 P) · 2. ConanMaster (2,900 P)');
  });
  bottomLinks[2]?.addEventListener('click', () => {
    _showToast('<b>Mission:</b> เปิดครบ 5 ซองวันนี้ (4/5) - รางวัล 200 P');
  });

  // User Profile click & Currency click
  document.querySelector('.tcg-user-bar')?.addEventListener('click', () => {
    _showToast('เติม Diamond หรือดูโปรไฟล์ผู้เล่น Lv.12 (JACKPOT)');
  });
}

/* ════════════════════════════════════════════════════════════
   TEAR-TO-OPEN PACK MECHANIC
   Color-coded rarity aura: Blue / Purple / Gold / Red
   ════════════════════════════════════════════════════════════ */

function _getRarityTier(cards) {
  // Determine the highest rarity among drawn cards
  for (const c of cards) {
    if (['SEC','SECSign'].includes(c.rarity)) return 'red';
  }
  for (const c of cards) {
    if (['SRP','MRP','SRCP','MRCP'].includes(c.rarity)) return 'gold';
  }
  for (const c of cards) {
    if (['SR','MR'].includes(c.rarity)) return 'purple';
  }
  return 'blue';
}

const TIER_COLORS = {
  blue:   { main: '#3b82f6', glow: 'rgba(59,130,246,0.8)',  name: 'RARE' },
  purple: { main: '#a855f7', glow: 'rgba(168,85,247,0.8)',  name: 'SUPER RARE' },
  gold:   { main: '#f59e0b', glow: 'rgba(245,158,11,0.9)',  name: 'ULTRA RARE' },
  red:    { main: '#ef4444', glow: 'rgba(239,68,68,0.95)',   name: '★ SECRET ★' },
};

async function _startOpenPack() {
  if (_animLock) return;
  _animLock = true;

  const currentSet = _getSet(_selectedSetId);
  
  if (!_state.pity) _state.pity = { purple: 0, gold: 0, red: 0 };
  _state.pity.purple++;
  _state.pity.gold++;
  _state.pity.red++;
  
  const cards = drawCards(1, currentSet.id, _state.pity);
  const tier = _getRarityTier(cards);
  const tc = TIER_COLORS[tier];

  // Full screen tear scene
  const scene = document.createElement('div');
  scene.className = 'tcg-tear-scene';
  scene.innerHTML = `
    <div class="tear-bg" style="background-image:url('img/tcg_bg_premium.jpg');"></div>
    <div class="tear-bg-dark"></div>
    <div class="tear-particles" id="tear-particles"></div>

    <div class="tear-header">
      <button class="tear-back-btn" id="tear-back">✕</button>
      <div class="tear-set-label">${currentSet.id} — ${currentSet.nameEn || currentSet.name}</div>
    </div>

    <div class="tear-center">
      <div class="tear-hint" id="tear-hint">️ ลากขวาเพื่อฉีกซอง ️</div>
      <div class="tear-pack-wrap" id="tear-pack-wrap">
        <div class="tear-aura" id="tear-aura" style="--aura-color:${tc.main};--aura-glow:${tc.glow};"></div>
        <!-- Flap: the top ~15% that gets torn away -->
        <div class="tear-flap" id="tear-flap" style="background:${tc.main === '#60a5fa' ? 'linear-gradient(135deg,#0a0a2e,#0d1b4b)' : 'linear-gradient(135deg,#0a0a1e,#150520)'};">
          <div class="tear-flap-fill" style="background:inherit;"></div>
          <div class="tear-pack-foil" style="opacity:0.6;"></div>
        </div>
        <!-- Edge glow that follows the cut -->
        <div class="tear-edge-glow" id="tear-edge-glow" style="--tear-color:${tc.main};--aura-glow:${tc.glow};"></div>
        <!-- Main pack body (shows below the cut) -->
        <div class="tear-pack" id="tear-pack" style="--pack-glow:${tc.glow};--pack-color:${tc.main};background:linear-gradient(160deg,${tc.main}22 0%,#050508 30%);">
          <div class="tcg-pack-graphic">
            <div class="pack-shard-bg"></div>
            <div class="pack-portal"></div>
            <div class="pack-title">BOOSTER PACK</div>
            <div class="pack-set-code">${currentSet.id}</div>
            <div class="pack-logo-triangle"></div>
          </div>
          <div class="tear-pack-foil"></div>
          <div class="tear-pack-crimp-top"></div>
          <div class="tear-pack-crimp-bottom"></div>
        </div>
      </div>
      <div class="tear-progress-bar" id="tear-progress-bar">
        <div class="tear-progress-fill" id="tear-progress-fill" style="--tear-color:${tc.main};"></div>
      </div>
    </div>

    <div class="tear-result" id="tear-result" style="display:none;">
      <div class="tear-result-title" id="tear-result-title" style="color:${tc.main};text-shadow:0 0 30px ${tc.glow};">
        ${tc.name}
      </div>
      <div class="tear-cards-fan" id="tear-cards-fan"></div>
      <div class="tear-cards-list" id="tear-cards-list"></div>
      <button class="tear-done-btn" id="tear-done-btn">กลับหน้าแรก </button>
    </div>
  `;
  document.body.appendChild(scene);

  // Force reflow then animate in
  requestAnimationFrame(() => scene.classList.add('active'));

  // Back button
  scene.querySelector('#tear-back').addEventListener('click', () => {
    scene.classList.remove('active');
    _setTimeout(() => { scene.remove(); _animLock = false; }, 400);
  });

  // Tear drag logic
  const pack        = scene.querySelector('#tear-pack');
  const packWrap    = scene.querySelector('#tear-pack-wrap');
  const tearFlap    = scene.querySelector('#tear-flap');
  const edgeGlow    = scene.querySelector('#tear-edge-glow');
  const tearAura    = scene.querySelector('#tear-aura');
  const progressFill= scene.querySelector('#tear-progress-fill');
  const hint        = scene.querySelector('#tear-hint');

  // Keep the old tear-line alias out of the way (it's hidden via CSS)
  let tearProgress = 0;
  const TEAR_THRESHOLD = 180; // pixels of horizontal drag
  let isDragging = false;
  let startX = 0;

  const onStart = (x) => {
    isDragging = true;
    startX = x;
    packWrap.classList.add('tearing');
    hint.style.opacity = '0';
    edgeGlow.style.opacity = '0.9';
  };

  const onMove = (x) => {
    if (!isDragging) return;
    const dx = Math.max(0, x - startX);
    tearProgress = Math.min(dx / TEAR_THRESHOLD, 1);
    const ripX = tearProgress * 100; // 0–100%

    // ─── 1. Flap slides to the right (being peeled off) ───────
    // rotate a bit outward + translate right to simulate tearing angle
    tearFlap.style.transform = `translateX(${ripX * 1.5}%) rotateZ(${tearProgress * -8}deg)`;
    tearFlap.style.opacity   = String(1 - tearProgress * 0.6);

    // ─── 2. Pack body: clip bottom portion (top flap area removed) ─
    // After the flap is dragged past a point, the cut is revealed
    pack.style.clipPath = tearProgress > 0.05
      ? `polygon(0 15%, ${ripX}% 15%, ${ripX}% 0, 100% 0, 100% 100%, 0 100%)`
      : 'none';

    // ─── 3. Edge-glow cursor follows the cut line ─────────────
    edgeGlow.style.transform = `translateX(${ripX * 2.5}px)`; // Fixed width basis instead of % for layout performance
    edgeGlow.style.opacity = String(0.5 + tearProgress * 0.5);
    // Glow scales instead of recomputing box-shadow (huge perf boost)
    edgeGlow.style.transform += ` scale(${1 + tearProgress * 3})`;

    // ─── 4. Aura behind whole pack intensifies ─────────────────
    tearAura.style.opacity   = String(0.15 + tearProgress * 0.85);
    tearAura.style.transform = `scale(${1 + tearProgress * 0.8})`;

    progressFill.style.width = `${tearProgress * 100}%`;

    // ─── 5. Micro-shake resistance (Reduced frequency for perf) ────────
    if (tearProgress > 0.15 && Math.random() > 0.5) {
      const shake = tearProgress * 4;
      pack.style.transform = `translate(${(Math.random()-0.5)*shake}px, ${(Math.random()-0.5)*shake}px)`;
    } else if (tearProgress <= 0.15) {
      pack.style.transform = '';
    }

    // ─── 6. Sparks at cut position (Throttled) ────────────────────────
    if (Math.random() < 0.1 * tearProgress) {
      const rect = packWrap.getBoundingClientRect();
      _burst(rect.left + rect.width * tearProgress, rect.top + rect.height * 0.13, tc.main, 1, 60);
    }

    if (tearProgress >= 1 && !packWrap.classList.contains('torn')) {
      isDragging = false;
      _completeTear(scene, cards, tier, tc, currentSet);
    }
  };

  let rAF = null;
  const onMoveThrottled = (x) => {
    if (rAF) cancelAnimationFrame(rAF);
    rAF = requestAnimationFrame(() => onMove(x));
  };

  const onEnd = () => {
    if (!isDragging) return;
    isDragging = false;
    if (tearProgress < 1) {
      // Snap back
      tearProgress = 0;
      tearFlap.style.transform = '';
      tearFlap.style.opacity = '1';
      edgeGlow.style.opacity = '0';
      edgeGlow.style.left = '0';
      edgeGlow.style.transform = '';
      tearAura.style.opacity = '0.15';
      tearAura.style.transform = 'scale(1)';
      progressFill.style.width = '0%';
      pack.style.clipPath = 'none';
      pack.style.transform = '';
      packWrap.classList.remove('tearing');
      hint.style.opacity = '1';
    }
  };

  // Mouse
  const onMouseMove = e => onMoveThrottled(e.clientX);
  packWrap.addEventListener('mousedown', e => { e.preventDefault(); onStart(e.clientX); });
  window.addEventListener('mousemove', onMouseMove);
  window.addEventListener('mouseup', onEnd);

  // Touch
  const onTouchMove = e => onMoveThrottled(e.touches[0].clientX);
  packWrap.addEventListener('touchstart', e => { onStart(e.touches[0].clientX); }, { passive: true });
  window.addEventListener('touchmove', onTouchMove, { passive: true });
  window.addEventListener('touchend', onEnd);

  _addCleanup(() => {
    window.removeEventListener('mousemove', onMouseMove);
    window.removeEventListener('mouseup', onEnd);
    window.removeEventListener('touchmove', onTouchMove);
    window.removeEventListener('touchend', onEnd);
  });

  // Spawn ambient particles
  _spawnTearParticles(scene.querySelector('#tear-particles'), tc.main);
}


function _spawnTearParticles(container, color) {
  if (!container) return;
  for (let i = 0; i < 30; i++) {
    const p = document.createElement('div');
    p.className = 'tear-ambient-particle';
    const size = 2 + Math.random() * 4;
    p.style.cssText = `
      width:${size}px;height:${size}px;
      left:${Math.random()*100}%;top:${Math.random()*100}%;
      background:${color};
      animation-delay:${Math.random()*5}s;
      animation-duration:${4+Math.random()*6}s;
    `;
    container.appendChild(p);
  }
}

async function _completeTear(scene, cards, tier, tc, currentSet) {
  const pack    = scene.querySelector('#tear-pack');
  const packWrap= scene.querySelector('#tear-pack-wrap');

  // Flash + burst from pack center
  _flash(tc.main);
  const rect = pack.getBoundingClientRect();
  _burst(rect.left + rect.width/2, rect.top + rect.height/2, tc.main, 60, 300);

  if (tier === 'red') {
    _flash('#fff');
    await _delay(150);
    _flash('#ef4444');
    document.body.style.animation = 'tcgScreenShake 0.8s cubic-bezier(.36,.07,.19,.97) both';
    _burst(rect.left + rect.width/2, rect.top + rect.height/2, 'rainbow', 120, 500);
    _burst(rect.left + rect.width/2, rect.top + rect.height/2, '#ef4444', 150, 800);
    const secFlash = document.createElement('div');
    secFlash.style.cssText = 'position:absolute;inset:0;background:radial-gradient(circle,#ef4444,transparent);mix-blend-mode:color-dodge;animation:tcgFlash 1s ease-out forwards;z-index:999;pointer-events:none;';
    scene.appendChild(secFlash);
    _setTimeout(() => { document.body.style.animation = ''; }, 800);
  }

  // Animate pack away
  packWrap.style.transition = 'all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)';
  packWrap.style.transform = 'scale(0) rotate(20deg)';
  packWrap.style.opacity = '0';
  scene.querySelector('.tear-header').style.opacity = '0';
  scene.querySelector('#tear-progress-bar').style.opacity = '0';
  scene.querySelector('#tear-hint').style.display = 'none';

  await _delay(500);

  // ─── Rarity aura helpers ─────────────────────────────────────
  const PURPLE_RAR = ['SR', 'MR'];
  const GOLD_RAR   = ['SRP', 'MRP', 'SRCP', 'MRCP'];
  const RED_RAR    = ['SEC'];

  const _auraColor = (rarity) => {
    if (RED_RAR.includes(rarity))    return { color: '#ef4444', glow: 'rgba(239,68,68,0.9)',   tier: 'red' };
    if (GOLD_RAR.includes(rarity))   return { color: '#f59e0b', glow: 'rgba(245,158,11,0.9)',  tier: 'gold' };
    if (PURPLE_RAR.includes(rarity)) return { color: '#a855f7', glow: 'rgba(168,85,247,0.85)', tier: 'purple' };
    return null;
  };

  // ─── Single Card Cinematic Reveal ─────────────────────────────
  const card = cards[0];
  const r    = _R(card);
  const ac   = _auraColor(card.rarity);

  const revealDiv = document.createElement('div');
  revealDiv.className = 'tcg-single-reveal';
  revealDiv.innerHTML = `
    <div class="sr-particles" id="sr-particles"></div>
    <div class="sr-magic-circle" id="sr-magic-circle">
      <div class="sr-ring sr-ring-1"></div>
      <div class="sr-ring sr-ring-2"></div>
      <div class="sr-ring sr-ring-3"></div>
      <div class="sr-rune-ring"></div>
    </div>
    <div class="sr-light-pillar" id="sr-light-pillar" style="--pillar-color:${ac ? ac.color : r.color};"></div>
    <div class="sr-card-stage" id="sr-card-stage">
      <div class="sr-card-wrap" id="sr-card-wrap" style="--card-color:${r.color};--card-glow:${r.glow || r.color};">
        <div class="sr-card-aura ${ac ? 'sr-aura-' + ac.tier : ''}"></div>
        <div class="sr-card-inner" id="sr-card-inner">
          <div class="sr-card-back">
            <img src="img/cardlist/example/secconan(back).jpeg" style="width: 100%; height: 100%; object-fit: cover; border-radius: 16px;" alt="Card Back" />
          </div>
          <div class="sr-card-front">
            <holo-card
              image="${card.image || 'img/cardlist/example/Secconan.jpg'}"
              preset="shards"
              foil-color="#eab308"
              intensity="0.4"
              scale="1"
              edge-sparkle="0.4"
              frame="4"
              glare="0.3"
              tilt-max="16"
              hover-scale="1.06"
              width="320"
              radius="18"
              idle="true"
              shadow="true">
            </holo-card>
          </div>
        </div>
      </div>
    </div>
    <div class="sr-info" id="sr-info">
      <div class="sr-card-name">${card.nameEn || card.name}</div>
      <div class="sr-card-rarity" style="color:${r.color};">${r.label || card.rarity}</div>
      <div class="sr-card-set">${currentSet.id} — ${currentSet.nameEn || currentSet.name}</div>
    </div>
    <button class="sr-done-btn" id="sr-done-btn">
      <span>Continue</span>
    </button>
    <div class="sr-sparkle-field" id="sr-sparkle-field"></div>
  `;
  scene.appendChild(revealDiv);

  // Save state (1 card)
  const today = _today();
  _state.collection = [..._state.collection, { cardId: card.id, date: today }];
  _state.totalPulls = (_state.totalPulls || 0) + 1;
  _save(_state);

  // ─── Phase 1: Magic Circle Appear (0-800ms) ──────────────
  requestAnimationFrame(() => revealDiv.classList.add('active'));
  
  // Spawn ambient fantasy particles
  const partContainer = revealDiv.querySelector('#sr-particles');
  for (let i = 0; i < 50; i++) {
    const p = document.createElement('div');
    p.className = 'sr-particle';
    const size = 2 + Math.random() * 5;
    const hue = ac ? '' : `hue-rotate(${Math.random() * 360}deg)`;
    p.style.cssText = `
      width:${size}px; height:${size}px;
      left:${Math.random() * 100}%; top:${Math.random() * 100}%;
      background:${ac ? ac.color : r.color};
      animation-delay:${Math.random() * 3}s;
      animation-duration:${3 + Math.random() * 4}s;
      filter:blur(${Math.random() > 0.5 ? 1 : 0}px) ${hue};
    `;
    partContainer.appendChild(p);
  }

  await _delay(600);

  // ─── Phase 2: Light pillar erupts (600-1400ms) ───────────
  const pillar = revealDiv.querySelector('#sr-light-pillar');
  pillar.classList.add('active');
  _flash(ac ? ac.color : r.color, 0.25);
  
  if (tier === 'red') {
    _flash('#fff');
    await _delay(100);
    _flash('#ef4444');
    _burst(window.innerWidth/2, window.innerHeight/2, 'rainbow', 80, 400);
    document.body.style.animation = 'tcgScreenShake 0.5s cubic-bezier(.36,.07,.19,.97) both';
    _setTimeout(() => { document.body.style.animation = ''; }, 500);
  } else if (tier === 'gold') {
    _burst(window.innerWidth/2, window.innerHeight/2, tc.main, 40, 250);
  }

  await _delay(400);

  // ─── Phase 3: Card Materializes from back (1000-2200ms) ──
  const cardStage = revealDiv.querySelector('#sr-card-stage');
  cardStage.classList.add('materialized');
  _burst(window.innerWidth/2, window.innerHeight/2, ac ? ac.color : r.color, 20, 200);

  // Wait for user interaction
  const tapHint = document.createElement('div');
  tapHint.className = 'sr-tap-hint';
  tapHint.innerText = 'แตะเพื่อเปิดการ์ด';
  revealDiv.appendChild(tapHint);

  // Wait for click on the card stage to proceed
  await new Promise(resolve => {
    cardStage.style.cursor = 'pointer';
    cardStage.addEventListener('click', () => {
      cardStage.style.cursor = '';
      tapHint.style.opacity = '0';
      _setTimeout(() => tapHint.remove(), 300);
      resolve();
    }, { once: true });
  });

  // ─── Phase 4: Card Flips to front (2200-3200ms) ──────────
  const cardInner = revealDiv.querySelector('#sr-card-inner');
  cardInner.classList.add('flipped');
  _flash(ac ? ac.color : r.color, 0.15);
  _burst(window.innerWidth/2, window.innerHeight/2, ac ? ac.color : r.color, 30, 180);

  // Sparkle field
  const sparkleField = revealDiv.querySelector('#sr-sparkle-field');
  for (let i = 0; i < 30; i++) {
    const s = document.createElement('div');
    s.className = 'sr-sparkle';
    s.style.cssText = `
      left:${Math.random() * 100}%; top:${Math.random() * 100}%;
      animation-delay:${Math.random() * 2}s;
      --sparkle-color:${ac ? ac.color : r.color};
    `;
    sparkleField.appendChild(s);
  }

  await _delay(800);

  // ─── Phase 5: Show info + done button (3000ms+) ──────────
  const infoDiv = revealDiv.querySelector('#sr-info');
  infoDiv.classList.add('visible');
  
  await _delay(400);
  
  const doneBtn = revealDiv.querySelector('#sr-done-btn');
  doneBtn.classList.add('visible');

  // Done button
  doneBtn.addEventListener('click', () => {
    // Elegant exit animation
    revealDiv.classList.add('exiting');
    _setTimeout(() => {
      scene.classList.remove('active');
      _setTimeout(() => {
        scene.remove();
        _animLock = false;
        _renderShell();
      }, 400);
    }, 600);
  });
}



function _renderCollection() {
  const owned = new Set(_state.collection.map(e => e.cardId));
  const setTabs = ['ALL', 'CT-P01', 'CT-P02', 'CT-P03', 'CT-P04', 'OWNED'];
  const filtered = _currentFilter === 'ALL' ? CARD_POOL
    : _currentFilter === 'OWNED' ? CARD_POOL.filter(c => owned.has(c.id))
    : CARD_POOL.filter(c => c.set === _currentFilter);

  const activeSet = TCG_SETS.find(s => s.id === _currentFilter);
  const activeSetOwned = activeSet ? CARD_POOL.filter(c => c.set === activeSet.id && owned.has(c.id)).length : 0;
  const activeSetTotal = activeSet ? CARD_POOL.filter(c => c.set === activeSet.id).length : 0;

  return `
  <div class="tcg-page tcg-collection">
    <div class="tcg-collection-header">
      <h1 class="tcg-coll-title">MY COLLECTION</h1>
      <div class="tcg-coll-subtitle">CONAN TCG · 4 BOOSTER SETS (CT-P01 - CT-P04)</div>
      <div class="tcg-coll-prog-wrap">
        <div class="tcg-coll-prog-numbers"><span>${owned.size} / ${CARD_POOL.length} CARDS</span><span>${Math.round(owned.size/CARD_POOL.length*100)}%</span></div>
        <div class="tcg-coll-prog-bar"><div class="tcg-coll-prog-fill" style="width:${owned.size/CARD_POOL.length*100}%"></div></div>
      </div>
    </div>

    <!-- Filter Buttons with Set Colors -->
    <div class="tcg-filters">
      ${setTabs.map(s => {
        const sInfo = TCG_SETS.find(x => x.id === s);
        return `<button class="tcg-filter-btn ${_currentFilter===s?'active':''}" data-filter="${s}" style="${sInfo ? `--set-accent:${sInfo.themeColor};` : ''}">
          ${sInfo ? `<span style="opacity:.7;font-size:.65rem;margin-right:3px;">${sInfo.code}</span>` : ''}${s}
        </button>`;
      }).join('')}
    </div>

    ${activeSet ? `
      <div style="display:flex;align-items:center;gap:14px;background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.08);border-left:4px solid ${activeSet.themeColor};padding:14px 18px;border-radius:16px;margin-bottom:14px;max-width:540px;width:100%;backdrop-filter:blur(10px);">
        <img src="${activeSet.packImg}" style="width:40px;height:62px;object-fit:cover;border-radius:8px;box-shadow:0 4px 12px rgba(0,0,0,.6);" alt="${activeSet.id}">
        <div style="flex:1;">
          <div style="font-size:.9rem;font-weight:900;color:#fff;">${activeSet.id} · ${activeSet.name}</div>
          <div style="font-size:.72rem;color:rgba(255,255,255,.55);margin-top:2px;">${activeSet.desc}</div>
        </div>
        <div style="text-align:right;">
          <div style="font-size:1rem;font-weight:900;color:${activeSet.themeColor};">${activeSetOwned}/${activeSetTotal}</div>
          <div style="font-size:.62rem;color:rgba(255,255,255,.4);font-weight:800;">สะสมแล้ว</div>
        </div>
      </div>
    ` : ''}

    <div class="tcg-card-grid" id="tcg-grid">
      ${filtered.map((card, i) => {
        const isOwned = owned.has(card.id);
        const r = _R(card);
        return `<div class="tcg-grid-card ${isOwned?'':'locked'}" data-id="${card.id}"
          style="--c1:${card.color1};--c2:${card.color2};--card-color:${r.color};--delay:${(i%16)*.04}s;">
          <div style="flex:1;display:flex;align-items:center;justify-content:center;position:relative;overflow:hidden;min-height:0;">
            <div style="position:absolute;inset:0;background:radial-gradient(circle at center,${r.color} 0%,transparent 65%);opacity:.09;"></div>
            
          </div>
          <div class="tcg-card-info">
            <div class="tcg-card-name" style="font-size:.78rem;">${isOwned ? card.name : '???'}</div>
            <div class="tcg-card-meta"><div class="tcg-card-num">${card.set} #${card.num}</div>${_rarityBadge(card.rarity)}</div>
          </div>
          <div class="tcg-card-holo" style="position:absolute;inset:0;border-radius:14px;background:radial-gradient(circle at calc(var(--mx,.5)*100%) calc(var(--my,.5)*100%),rgba(255,255,255,.22) 0%,transparent 55%);mix-blend-mode:color-dodge;pointer-events:none;opacity:0;transition:opacity .3s;"></div>
          ${r.holographic && isOwned ? `<div class="tcg-card-rainbow" style="position:absolute;inset:0;border-radius:14px;pointer-events:none;mix-blend-mode:color-dodge;opacity:0;transition:opacity .3s;background:linear-gradient(135deg,rgba(255,0,80,.2) 0%,rgba(255,130,0,.2) 14%,rgba(255,220,0,.2) 28%,rgba(60,255,60,.2) 42%,rgba(0,200,255,.2) 56%,rgba(30,80,255,.2) 70%,rgba(160,0,255,.2) 84%,rgba(255,0,140,.2) 100%);"></div>` : ''}
        </div>`;
      }).join('')}
    </div>
  </div>`;
}

function _bindCollectionEvents() {
  _root.querySelectorAll('.tcg-filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      _currentFilter = btn.dataset.filter;
      document.getElementById('tcg-content').innerHTML = _renderCollection();
      _bindCollectionEvents();
    });
  });

  _root.querySelectorAll('.tcg-grid-card:not(.locked)').forEach(el => {
    // Tilt
    const onMove = e => {
      const r = el.getBoundingClientRect();
      const mx = (e.clientX - r.left) / r.width;
      const my = (e.clientY - r.top) / r.height;
      el.style.setProperty('--mx', mx.toFixed(3));
      el.style.setProperty('--my', my.toFixed(3));
      el.querySelectorAll('.tcg-card-holo,.tcg-card-rainbow').forEach(h => { h.style.opacity='1'; h.style.setProperty('--mx',mx.toFixed(3)); h.style.setProperty('--my',my.toFixed(3)); });
    };
    const onLeave = () => { el.querySelectorAll('.tcg-card-holo,.tcg-card-rainbow').forEach(h => h.style.opacity='0'); };
    el.addEventListener('mousemove', onMove);
    el.addEventListener('mouseleave', onLeave);
    _addCleanup(() => { el.removeEventListener('mousemove', onMove); el.removeEventListener('mouseleave', onLeave); });

    el.addEventListener('click', () => {
      const card = CARD_POOL.find(c => c.id === el.dataset.id);
      if (card) _showDetail(card);
    });
  });
}

/* ─── Card Detail Modal ───────────────────────────────────── */
function _showDetail(card) {
  const r = _R(card);
  const obtained = _state.collection.find(e => e.cardId === card.id);

  const modal = document.createElement('div');
  modal.className = 'tcg-detail-modal';

  const cardEl = _buildCard(card, 240, 336);
  let spinInterval = null;

  modal.innerHTML = `
    <div class="tcg-detail-inner" id="tcg-det-inner">
      <button class="tcg-detail-close" id="tcg-det-close">✕</button>
      <div id="tcg-det-card-slot" style="position:relative;"></div>
      <div class="tcg-detail-meta">
        <div class="tcg-detail-card-name">${card.name}</div>
        <div class="tcg-detail-card-num">CARD #${card.num} · ${card.set}</div>
        <div class="tcg-detail-tags">
          <div class="tcg-detail-tag"><div class="tcg-detail-tag-label">Set</div><div class="tcg-detail-tag-val">${card.set}</div></div>
          <div class="tcg-detail-tag"><div class="tcg-detail-tag-label">Rarity</div><div class="tcg-detail-tag-val" style="color:${r.color}">${r.label}</div></div>
          <div class="tcg-detail-tag"><div class="tcg-detail-tag-label">Obtained</div><div class="tcg-detail-tag-val">${obtained?.date || '—'}</div></div>
        </div>
      </div>
      <div class="tcg-detail-actions">
        <button class="tcg-detail-btn" id="tcg-det-flip"> FLIP</button>
        <button class="tcg-detail-btn" id="tcg-det-spin"> SPIN</button>
      </div>
    </div>`;

  document.body.appendChild(modal);
  document.getElementById('tcg-det-card-slot').appendChild(cardEl);

  // Enable manual drag-to-spin
  _bindTilt(cardEl, 32, { allowDrag: true });

  // Flip
  document.getElementById('tcg-det-flip')?.addEventListener('click', () => {
    cardEl.classList.toggle('flipped');
    const sweep = cardEl.querySelector('.tcg-card-sweep');
    if (sweep) { _setTimeout(() => { sweep.classList.add('go'); _setTimeout(() => sweep.classList.remove('go'), 800); }, 100); }
  });

  // Spin (Auto)
  document.getElementById('tcg-det-spin')?.addEventListener('click', () => {
    cardEl.classList.remove('spinning');
    void cardEl.offsetWidth;
    cardEl.style.transform = ''; // Reset drag
    cardEl.classList.add('spinning');
    const wrapRect = cardEl.getBoundingClientRect();
    _burst(wrapRect.left + wrapRect.width/2, wrapRect.top + wrapRect.height/2, r.holographic ? 'rainbow' : r.color, 35, 150);
    _setTimeout(() => cardEl.classList.remove('spinning'), 2100);
  });

  // Close
  modal.addEventListener('click', e => { if (e.target === modal) { modal.remove(); } });
  document.getElementById('tcg-det-close')?.addEventListener('click', () => modal.remove());
}

/* ════════════════════════════════════════════════════════════
   PROFILE VIEW
   ════════════════════════════════════════════════════════════ */
function _renderProfile() {
  const owned = new Set(_state.collection.map(e => e.cardId));
  const total = owned.size;
  const pct = Math.round(total / CARD_POOL.length * 100);
  const streak = _state.streak;

  const ACHIEVEMENTS = [
    { icon:'', name:'First Pull',    cond: _state.totalPulls >= 1 },
    { icon:'', name:'3 Day Streak',  cond: streak >= 3 },
    { icon:'', name:'7 Day Streak',  cond: streak >= 7 },
    { icon:'', name:'10 Cards',      cond: total >= 10 },
    { icon:'', name:'25 Cards',      cond: total >= 25 },
    { icon:'', name:'First SR+',     cond: _state.collection.some(e => { const c=CARD_POOL.find(x=>x.id===e.cardId); return c&&['SR','SSR','CP','SEC'].includes(c.rarity); }) },
    { icon:'', name:'25% Complete',  cond: pct >= 25 },
    { icon:'', name:'Secret Card',   cond: _state.collection.some(e => { const c=CARD_POOL.find(x=>x.id===e.cardId); return c&&c.rarity==='SEC'; }) },
    { icon:'', name:'50% Complete',  cond: pct >= 50 },
  ];

  const rarityOrder = ['SEC','CP','SSR','SR','R','C'];
  let favCard = null;
  for (const r of rarityOrder) {
    const found = CARD_POOL.find(c => c.rarity === r && owned.has(c.id));
    if (found) { favCard = found; break; }
  }

  return `
  <div class="tcg-page tcg-profile">
    <div class="tcg-profile-hero">
      <div class="tcg-profile-avatar"></div>
      <div class="tcg-profile-name">CONAN COLLECTOR</div>
      <div class="tcg-profile-sub">DETECTIVE · SERIES 01</div>
    </div>
    <div class="tcg-profile-stats">
      <div class="tcg-profile-stat"><div class="tcg-profile-stat-val">${total}</div><div class="tcg-profile-stat-label">Cards</div></div>
      <div class="tcg-profile-stat"><div class="tcg-profile-stat-val" style="color:#f97316">${streak}</div><div class="tcg-profile-stat-label">Streak</div></div>
      <div class="tcg-profile-stat"><div class="tcg-profile-stat-val">${pct}%</div><div class="tcg-profile-stat-label">Done</div></div>
    </div>
    <div class="tcg-achievements">
      <div class="tcg-achievement-title">Achievements</div>
      <div class="tcg-achievements-grid">
        ${ACHIEVEMENTS.map(a => `<div class="tcg-achievement ${a.cond?'unlocked':''}"><div class="tcg-achievement-icon">${a.icon}</div><div class="tcg-achievement-name">${a.name}</div></div>`).join('')}
      </div>
    </div>
    ${favCard ? `
    <div class="tcg-fav-card">
      <div class="tcg-achievement-title">Favourite Card</div>
      <div style="display:flex;align-items:center;gap:18px;background:rgba(255,255,255,.025);border:1px solid rgba(255,255,255,.06);border-radius:20px;padding:16px;" id="tcg-fav-slot">
        
        <div>
          <div style="font-size:.58rem;color:rgba(255,255,255,.35);font-weight:800;letter-spacing:.1em;margin-bottom:5px;">TOP RARITY</div>
          <div style="font-size:1rem;font-weight:900;">${favCard.name}</div>
          <div style="font-size:.65rem;color:rgba(255,255,255,.4);margin-top:5px;">${favCard.set} · ${_rarityBadge(favCard.rarity)}</div>
        </div>
      </div>
    </div>` : `
    <div class="tcg-fav-card">
      <div class="tcg-achievement-title">Favourite Card</div>
      <div style="text-align:center;padding:30px;background:rgba(255,255,255,.02);border:1px solid rgba(255,255,255,.05);border-radius:20px;color:rgba(255,255,255,.28);font-size:.8rem;font-weight:700;">Pull cards to unlock</div>
    </div>`}
  </div>`;
}

/* ════════════════════════════════════════════════════════════
   NAVIGATION SHELL
   ════════════════════════════════════════════════════════════ */
function _shell() {
  return `
    <nav class="tcg-desktop-nav">
      <div class="tcg-desktop-logo"><div class="tcg-desktop-logo-dot"></div>CONAN TCG</div>
      <div class="tcg-desktop-links">
        <button class="tcg-desktop-link ${_view==='home'?'active':''}" data-view="home">HOME</button>
        <button class="tcg-desktop-link ${_view==='collection'?'active':''}" data-view="collection">COLLECTION</button>
        <button class="tcg-desktop-link ${_view==='profile'?'active':''}" data-view="profile">PROFILE</button>
      </div>
    </nav>
    <div class="tcg-ambient" aria-hidden="true">
      <div class="tcg-orb tcg-orb-1"></div>
      <div class="tcg-orb tcg-orb-2"></div>
      <div class="tcg-orb tcg-orb-3"></div>
    </div>
    <div id="tcg-content"></div>
    <nav class="tcg-nav">
      <button class="tcg-nav-btn ${_view==='home'?'active':''}" data-view="home"><span>HOME</span></button>
      <button class="tcg-nav-btn" data-view="home" style="color:rgba(168,85,247,.9)" id="tcg-nav-jumm"><span>JUMM</span></button>
      <button class="tcg-nav-btn ${_view==='collection'?'active':''}" data-view="collection"><span>CARDS</span></button>
      <button class="tcg-nav-btn ${_view==='profile'?'active':''}" data-view="profile"><span>PROFILE</span></button>
    </nav>`;
}

function _goView(v) {
  _view = v;
  _currentFilter = 'ALL';
  _renderShell();
}

function _renderShell() {
  _root.innerHTML = `<div class="tcg-root">${_shell()}</div>`;
  const content = document.getElementById('tcg-content');
  if (_view === 'home') content.innerHTML = _renderHome();
  else if (_view === 'collection') content.innerHTML = _renderCollection();
  else if (_view === 'profile') content.innerHTML = _renderProfile();
  _bindAllNav();
  if (_view === 'home') _bindHomeEvents();
  if (_view === 'collection') _bindCollectionEvents();
}

function _bindAllNav() {
  _root.querySelectorAll('[data-view]').forEach(btn => {
    btn.addEventListener('click', () => {
      const v = btn.dataset.view;
      if (btn.id === 'tcg-nav-jumm') {
        // JUMM button always triggers opening
        if (!_animLock) {
          _goView('home');
          _setTimeout(_startOpenPack, 300);
        }
      } else {
        _goView(v);
      }
    });
  });
}

/* ════════════════════════════════════════════════════════════
   MOUNT / UNMOUNT
   ════════════════════════════════════════════════════════════ */
export async function mountJumm(container) {
  _root = container;
  _state = _load();
  _animLock = false;
  _view = 'home';
  _currentFilter = 'ALL';
  _ensureCSS();

  // Hide global navigation and body padding for immersive mode
  const topnav = document.getElementById('topnav');
  const mobnav = document.getElementById('mobile-nav');
  if (topnav) topnav.style.display = 'none';
  if (mobnav) mobnav.style.display = 'none';
  document.body.style.paddingTop = '0';

  _renderShell();
}

export function unmountJumm() {
  _clearAll();
  _animLock = false;
  document.querySelectorAll('.tcg-tear-scene,.tcg-card-reveal,.tcg-reveal-pips,.tcg-detail-modal,.tcg-flash,.tcg-particle,.tcg-sec-reveal,.tcg-open-scene').forEach(el => el.remove());
  if (_root) _root.innerHTML = '';

  // Restore global navigation
  const topnav = document.getElementById('topnav');
  const mobnav = document.getElementById('mobile-nav');
  if (topnav) topnav.style.display = '';
  if (mobnav) mobnav.style.display = '';
  document.body.style.paddingTop = '';
}
