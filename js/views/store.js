/**
 * store.js — AI Futuristic Pack Store (Coverflow)
 */

const PACKS = [
  { id: 'starter', name: 'STARTER PACK', price: 1688, theme: 'starter', color: '#64748b' },
  { id: 'silver', name: 'SILVER PACK', price: 4188, theme: 'silver', color: '#38bdf8' },
  { id: 'ai', name: 'AI DETECTIVE', price: 9999, theme: 'ai', color: '#00f2fe' },
  { id: 'gold', name: 'GOLD PACK', price: 8288, theme: 'gold', color: '#facc15' },
  { id: 'diamond', name: 'DIAMOND PACK', price: 16488, theme: 'diamond', color: '#c084fc' }
];

let _root = null;
let _activeIndex = 2; // Default to AI Detective
let _qty = 1;
let _startX = 0;
let _currentX = 0;
let _isDragging = false;

function _render() {
  _root.innerHTML = `
    <div class="store-root">
      <div class="store-bg"></div>
      <div class="store-glow g1"></div>
      <div class="store-glow g2"></div>

      <div class="store-content">
        <!-- Top Nav -->
        <div class="store-nav-scroll">
          <div class="store-nav">
            ${PACKS.map((p, i) => `
              <button class="store-pill ${i === _activeIndex ? 'active' : ''}" data-idx="${i}" style="${i === _activeIndex ? `border-color:${p.color}; box-shadow: 0 0 20px ${p.color}33, inset 0 0 10px ${p.color}11; background: ${p.color}11` : ''}">
                <span class="store-pill-title">${p.name}</span>
                <span class="store-pill-price" style="${i === _activeIndex ? `color:${p.color}` : ''}"><i>⬡</i> ${p.price.toLocaleString()}</span>
              </button>
            `).join('')}
          </div>
        </div>

        <!-- Carousel -->
        <div class="store-carousel-wrap" id="store-carousel-wrap">
          <div class="store-carousel" id="store-carousel">
            ${PACKS.map((p, i) => `
              <div class="store-pack-wrap ${i === _activeIndex ? 'active' : ''}" data-idx="${i}" data-theme="${p.theme}">
                <div class="store-pack">
                  <div class="store-pack-crimp store-pack-crimp--top"></div>
                  
                  <div class="store-pack-content">
                    <div class="store-pack-ring" style="color:${p.color}"></div>
                    <div class="store-pack-type" style="color:${p.color}">${p.name.replace(' PACK', '')}</div>
                  </div>
                  
                  <div class="store-pack-sweep"></div>
                  <div class="store-pack-crimp store-pack-crimp--bottom"></div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>

      <!-- Bottom Action Bar -->
      <div class="store-action-bar">
        <div class="store-qty">
          <button class="store-qty-btn" id="btn-minus">−</button>
          <div class="store-qty-num" id="qty-disp">${_qty}</div>
          <button class="store-qty-btn" id="btn-plus">+</button>
        </div>
        <button class="store-buy-btn" id="btn-buy">
          <span>ซื้อเลย</span>
          <span class="price"><i>⬡</i> <span id="price-disp">${(PACKS[_activeIndex].price * _qty).toLocaleString()}</span></span>
        </button>
      </div>
    </div>
  `;

  _bindEvents();
  _updateCarousel();
}

function _updateCarousel() {
  const wraps = _root.querySelectorAll('.store-pack-wrap');
  const pills = _root.querySelectorAll('.store-pill');
  
  wraps.forEach((el, i) => {
    const offset = i - _activeIndex;
    const absOffset = Math.abs(offset);
    
    // Spacing config
    const translateX = offset * 140; // distance between cards
    const translateZ = -absOffset * 100; // push back
    const rotateY = offset === 0 ? 0 : (offset > 0 ? -25 : 25);
    const opacity = offset === 0 ? 1 : Math.max(0, 1 - absOffset * 0.4);
    const scale = offset === 0 ? 1 : Math.max(0.7, 1 - absOffset * 0.1);
    const zIndex = 100 - absOffset;
    
    el.style.transform = `translateX(${translateX}px) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`;
    el.style.opacity = opacity;
    el.style.zIndex = zIndex;
    
    if (offset === 0) el.classList.add('active');
    else el.classList.remove('active');
  });

  // Update pills
  pills.forEach((pill, i) => {
    const p = PACKS[i];
    if (i === _activeIndex) {
      pill.classList.add('active');
      pill.style.borderColor = p.color;
      pill.style.boxShadow = `0 0 20px ${p.color}33, inset 0 0 10px ${p.color}11`;
      pill.style.background = `${p.color}11`;
      pill.querySelector('.store-pill-price').style.color = p.color;
      // scroll pill into view smoothly
      pill.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    } else {
      pill.classList.remove('active');
      pill.style.borderColor = '';
      pill.style.boxShadow = '';
      pill.style.background = '';
      pill.querySelector('.store-pill-price').style.color = '';
    }
  });

  // Update price
  const pDisp = document.getElementById('price-disp');
  if (pDisp) {
    pDisp.innerText = (PACKS[_activeIndex].price * _qty).toLocaleString();
  }
}

function _setIndex(idx) {
  if (idx < 0) idx = 0;
  if (idx >= PACKS.length) idx = PACKS.length - 1;
  if (_activeIndex !== idx) {
    _activeIndex = idx;
    _qty = 1; // reset qty on switch
    document.getElementById('qty-disp').innerText = _qty;
    _updateCarousel();
  }
}

function _bindEvents() {
  // Nav pills click
  _root.querySelectorAll('.store-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      _setIndex(parseInt(pill.dataset.idx));
    });
  });

  // Pack clicks
  _root.querySelectorAll('.store-pack-wrap').forEach(pack => {
    pack.addEventListener('click', () => {
      const idx = parseInt(pack.dataset.idx);
      if (idx !== _activeIndex) _setIndex(idx);
    });
  });

  // Qty buttons
  const qtyDisp = document.getElementById('qty-disp');
  document.getElementById('btn-minus').addEventListener('click', () => {
    if (_qty > 1) {
      _qty--;
      qtyDisp.innerText = _qty;
      qtyDisp.classList.remove('pop');
      void qtyDisp.offsetWidth; // trigger reflow
      qtyDisp.classList.add('pop');
      _updateCarousel();
    }
  });
  document.getElementById('btn-plus').addEventListener('click', () => {
    if (_qty < 10) {
      _qty++;
      qtyDisp.innerText = _qty;
      qtyDisp.classList.remove('pop');
      void qtyDisp.offsetWidth;
      qtyDisp.classList.add('pop');
      _updateCarousel();
    }
  });

  // Swipe / Drag on Carousel
  const wrap = document.getElementById('store-carousel-wrap');
  wrap.addEventListener('pointerdown', (e) => {
    _isDragging = true;
    _startX = e.clientX;
    wrap.style.cursor = 'grabbing';
  });
  window.addEventListener('pointermove', (e) => {
    if (!_isDragging) return;
    _currentX = e.clientX;
  });
  window.addEventListener('pointerup', (e) => {
    if (!_isDragging) return;
    _isDragging = false;
    wrap.style.cursor = '';
    const diffX = _currentX - _startX;
    if (Math.abs(diffX) > 50) {
      if (diffX > 0) _setIndex(_activeIndex - 1);
      else _setIndex(_activeIndex + 1);
    }
    _currentX = 0; _startX = 0;
  });
}

export function mountStore(container) {
  _root = container;
  _qty = 1;
  _activeIndex = 2; // Center on AI pack
  
  // Ensure CSS is loaded
  if (!document.getElementById('css-store')) {
    const link = document.createElement('link');
    link.id = 'css-store';
    link.rel = 'stylesheet';
    link.href = 'css/pages/store.css';
    document.head.appendChild(link);
  }

  _render();
}

export function unmountStore() {
  if (_root) _root.innerHTML = '';
}
