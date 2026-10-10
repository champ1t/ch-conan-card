/**
 * dailyPull.js — เช็คจุ่มรายวัน v7 (Custom Rarities + Authentic Pack Realism)
 * Detective Conan TCG Pack Opening
 */

const DAILY_KEY = 'ch_daily_v7';
const CARDS_PER_PACK = 5;

/* ─── CARD POOL (NEW RARITY SYSTEM) ──────────────────────── */
const RARITY_CONFIG = {
  PR:  { short:'PR',  c:'#94a3b8', w:5 },
  D:   { short:'D',   c:'#06b6d4', w:10 },
  C:   { short:'C',   c:'#3b82f6', w:40 },
  CP:  { short:'CP',  c:'#0ea5e9', w:20 },
  R:   { short:'R',   c:'#10b981', w:15 },
  RP:  { short:'RP',  c:'#34d399', w:8 },
  SR:  { short:'SR',  c:'#8b5cf6', w:4 },
  MR:  { short:'MR',  c:'#a855f7', w:3 },
  SRP: { short:'SRP', c:'#eab308', w:2 },
  MRP: { short:'MRP', c:'#f97316', w:1 },
  SRCP:{ short:'SRCP',c:'#f43f5e', w:0.8 },
  MRCP:{ short:'MRCP',c:'#ec4899', w:0.5 },
  SEC: { short:'SEC', c:'sec',     w:0.2 },
};

const CARD_POOL = [
  { id:'c001', name:'Conan Edogawa (Promo)', nameEn:'Conan Edogawa', rarity:'PR' },
  { id:'c002', name:'Detective Boys',        nameEn:'Detective Boys', rarity:'D' },
  { id:'c003', name:'Inspector Megure',      nameEn:'Insp. Megure',   rarity:'C' },
  { id:'c004', name:'Dr. Agasa',             nameEn:'Dr. Agasa',      rarity:'C' },
  { id:'c005', name:'Sonoko Suzuki',         nameEn:'Sonoko Suzuki',  rarity:'CP' },
  { id:'c006', name:'Genta Kojima',          nameEn:'Genta Kojima',   rarity:'CP' },
  { id:'c007', name:'Kogoro Mouri',          nameEn:'Kogoro Mouri',   rarity:'R' },
  { id:'c008', name:'Heiji Hattori',         nameEn:'Heiji Hattori',  rarity:'R' },
  { id:'c009', name:'Ran Mouri',             nameEn:'Ran Mouri',      rarity:'RP' },
  { id:'c010', name:'Kazuha Toyama',         nameEn:'Kazuha Toyama',  rarity:'RP' },
  { id:'c011', name:'Ai Haibara',            nameEn:'Ai Haibara',     rarity:'SR' },
  { id:'c012', name:'Shuichi Akai',          nameEn:'Shuichi Akai',   rarity:'MR' },
  { id:'c013', name:'Rei Furuya',            nameEn:'Rei Furuya',     rarity:'SRP' },
  { id:'c014', name:'Kaito Kid',             nameEn:'Kaito Kid',      rarity:'MRP' },
  { id:'c015', name:'Vermouth',              nameEn:'Vermouth',       rarity:'SRCP' },
  { id:'c016', name:'Gin',                   nameEn:'Gin',            rarity:'MRCP' },
  { id:'c017', name:'Shinichi Kudo (True)',  nameEn:'Shinichi Kudo',  rarity:'SEC' },
];

/* ─── STATE ──────────────────────────────────────────────── */
let _state = null, _timers = [], _animLock = false, _root = null, _rafIds = [];
let _dragEvents = [];

/* ─── STORAGE ────────────────────────────────────────────── */
function _load() {
  const today = _today();
  try {
    const raw = JSON.parse(localStorage.getItem(DAILY_KEY) || '{}');
    const allCards = raw.allCards || [];
    const todayPulls = raw.todayDate === today ? (raw.todayPulls||0) : 0;
    const lastDate = raw.lastDate || null;
    const yesterday = _dkey(new Date(Date.now()-86400000));
    let streak = raw.streak || 0;
    if (raw.streakUpdated !== today) {
      if (lastDate === yesterday) streak++;
      else if (lastDate !== today && lastDate) streak = 0;
    }
    return { today, streak, lastDate, allCards, todayPulls };
  } catch { return { today, streak:0, lastDate:null, allCards:[], todayPulls:0 }; }
}
function _save(p, cards, streak, last) {
  localStorage.setItem(DAILY_KEY, JSON.stringify({
    todayDate:_today(), todayPulls:p, allCards:cards,
    streak, lastDate:last||_today(), streakUpdated:_today(),
  }));
}
function _today() { return _dkey(new Date()); }
function _dkey(d) { return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`; }

/* ─── UTILS ──────────────────────────────────────────────── */
function _draw(n) {
  const arr = [];
  for (let i=0; i<n; i++) {
    let t=0; CARD_POOL.forEach(c=>{t+=RARITY_CONFIG[c.rarity].w;});
    let r=Math.random()*t;
    for (const c of CARD_POOL) { r-=RARITY_CONFIG[c.rarity].w; if(r<=0){arr.push(c);break;} }
    if (arr.length <= i) arr.push(CARD_POOL[CARD_POOL.length-1]);
  }
  return arr;
}
function _delay(ms) { return new Promise(r => { const t=setTimeout(r,ms); _timers.push(t); }); }
function _raf(fn) { const id = requestAnimationFrame(fn); _rafIds.push(id); return id; }

/* ─── PARTICLES ──────────────────────────────────────────── */
function _bgParticles(el, n=20) {
  if (!el) return;
  for (let i=0;i<n;i++) {
    const p = document.createElement('div');
    p.className = 'dp-p dp-p--ambient';
    p.style.cssText = `left:${Math.random()*100}%;top:${Math.random()*100}%;--d:${5+Math.random()*6}s;--del:${Math.random()*5}s;width:${2+Math.random()*3}px;height:${2+Math.random()*3}px;`;
    el.appendChild(p);
  }
}
function _tearParticles(el, n=30, maxD=150) {
  if (!el) return;
  for (let i=0;i<n;i++) {
    const p = document.createElement('div');
    p.className = 'dp-p dp-p--tear';
    const a=(i/n)*360, d=30+Math.random()*maxD;
    p.style.cssText = `--a:${a}deg;--d:${d}px;background:hsl(${190+Math.random()*40},80%,${60+Math.random()*40}%);animation-delay:${Math.random()*0.15}s;`;
    el.appendChild(p);
  }
}
function _rareParticles(el, color, n=50) {
  if (!el) return; el.innerHTML='';
  for (let i=0;i<n;i++) {
    const p = document.createElement('div');
    p.className = 'dp-p dp-p--sparkle';
    p.style.cssText = `left:${Math.random()*100}%;top:${Math.random()*100}%;background:${color};--d:${0.8+Math.random()*2}s;--del:${Math.random()*2}s;width:${3+Math.random()*6}px;height:${3+Math.random()*6}px;box-shadow: 0 0 15px ${color};`;
    el.appendChild(p);
  }
}

/* ─── 3D TILT ────────────────────────────────────────────── */
function _tilt(el, deg=15, sc=1.05) {
  if (!el || matchMedia('(hover:none)').matches) return;
  const onMove = e => {
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    el.style.setProperty('--mx', x);
    el.style.setProperty('--my', y);
    el.style.setProperty('--deg', `${deg}deg`);
    el.style.setProperty('--sc', sc);
    el.classList.add('is-hover');
  };
  const onLeave = () => { 
    el.classList.remove('is-hover');
    el.style.setProperty('--mx', 0.5);
    el.style.setProperty('--my', 0.5);
    el.style.setProperty('--sc', 1);
  };
  el.addEventListener('mousemove', onMove);
  el.addEventListener('mouseleave', onLeave);
}

/* ─── RARITY BADGE HTML ───────────────────────────────────── */
function _badgeHTML(rarityId) {
  const r = RARITY_CONFIG[rarityId];
  if (rarityId === 'SEC') {
    return `<div class="dp-rb-sec"><span>SEC</span></div>`;
  }
  return `<div class="dp-rb" style="color:${r.c}; border-color:${r.c}44;">${r.short}</div>`;
}

/* ─── CARD THUMBNAIL ──────────────────────────────────────── */
function _thumb(card, count) {
  return `<div class="dp-thumb" style="--cg:${RARITY_CONFIG[card.rarity].c};">
    <div class="dp-thumb-in">
      ${_badgeHTML(card.rarity)}
      <div class="dp-thumb-name">${card.name}</div>
      <div class="dp-thumb-foil"></div>
    </div>
    ${count>1?`<div class="dp-thumb-count">×${count}</div>`:''}
  </div>`;
}

/* ════════════════════════════════════════════════════════════
   1. HOME SCREEN
   ════════════════════════════════════════════════════════════ */
function _home(el, s) {
  const ret = s.lastDate && s.lastDate !== s.today && s.streak > 0;
  
  el.innerHTML = `
  <div class="dp-home">
    <div class="dp-bg">
      <div class="dp-orb dp-orb--1"></div>
      <div class="dp-orb dp-orb--2"></div>
      <div class="dp-orb dp-orb--3"></div>
      <div class="dp-bg-p" id="dp-bgp"></div>
    </div>

    ${ret?`<div class="dp-toast" id="dp-toast"><span>🎉</span><div><b>ยินดีต้อนรับกลับมา!</b><br><small>เล่นต่อเนื่อง ${s.streak} วัน ✨</small></div><button class="dp-toast-x" id="dp-tx">✕</button></div>`:''}

    <div class="dp-hero">
      <div class="dp-pack-stage">
        <div class="dp-pack-shadow"></div>
        <div class="dp-pack3d-wrap" id="dp-pack">
          <div class="dp-pack" role="button" tabindex="0" aria-label="ซองการ์ดโคนัน">
            <div class="dp-pack-crimp dp-pack-crimp--top"></div>
            <div class="dp-pack-tearline"></div>
            <div class="dp-pack-inner">
              <div class="dp-pack-art">
                <div class="dp-pack-logo">DETECTIVE<br>CONAN</div>
                <div class="dp-pack-sub">TRADING CARD GAME</div>
                <div class="dp-pack-char"></div>
                <div class="dp-pack-ser">MYTHICAL DETECTIVE</div>
              </div>
              <div class="dp-pack-foil"></div>
              <div class="dp-pack-shine"></div>
              <div class="dp-holo"></div>
            </div>
            <div class="dp-pack-crimp dp-pack-crimp--bottom"></div>
            <div class="dp-pack-hint">แตะเพื่อเปิดซอง</div>
          </div>
          <div class="dp-pack-aura"></div>
        </div>
      </div>

      <div class="dp-info">
        <div class="dp-info-eyebrow">🎴 เช็คจุ่มรายวัน</div>
        <h1 class="dp-info-title">จุ่มการ์ดโคนัน<span class="dp-badge-free">UNLIMITED</span></h1>
        <p class="dp-info-desc">สุ่มเปิดซองฟรีไม่จำกัดครั้ง! สนุกไปกับฟิสิกส์ 3D<br>ระบบฉีกซองเสมือนจริง และเอฟเฟกต์โฮโลแกรมสุดล้ำ</p>

        <button class="dp-cta" id="dp-cta">
          <div class="dp-cta-bg"></div>
          <span class="dp-cta-icon">⚡</span><span class="dp-cta-txt">ฉีกซองเลย!</span>
          <span class="dp-cta-ring"></span>
        </button>

        <div class="dp-streak">
          <div class="dp-streak-icon">🔥</div>
          <div class="dp-streak-body"><div class="dp-streak-num">${s.streak} วัน</div><div class="dp-streak-label">เล่นต่อเนื่อง</div></div>
          <div class="dp-streak-milestones">${[3,7,14,30].map(n=>`<div class="dp-ms ${s.streak>=n?'on':''}" title="${n} วัน">${n>=30?'👑':n>=14?'💎':n>=7?'🌟':'🔥'}<span>${n}d</span></div>`).join('')}</div>
        </div>
      </div>
    </div>

    <div class="dp-lower container">
      <div class="dp-tabs" role="tablist">
        <button class="dp-tab on" data-p="recent" role="tab">ล่าสุดที่ได้</button>
        <button class="dp-tab" data-p="coll" role="tab">คอลเลกชันทั้งหมด <span class="dp-tab-n">${s.allCards.length}</span></button>
      </div>
      <div id="p-recent" class="dp-panel">${s.allCards.length===0?'<div class="dp-empty"><div class="dp-empty-i">🃏</div><div class="dp-empty-t">ยังไม่มีการ์ด</div><div class="dp-empty-d">กดจุ่มเลย!</div></div>':`<div class="dp-grid">${s.allCards.slice(-15).reverse().map(c=>_thumb(c,1)).join('')}</div>`}</div>
      <div id="p-coll" class="dp-panel" style="display:none">${s.allCards.length===0?'<div class="dp-empty"><div class="dp-empty-i">📦</div><div class="dp-empty-t">คอลเลกชันว่างเปล่า</div><div class="dp-empty-d">จุ่มเพื่อเริ่มสะสม!</div></div>':`<div class="dp-coll-bar"><span>${[...new Set(s.allCards.map(c=>c.id))].length} / ${CARD_POOL.length} ชนิด</span><div class="dp-prog"><div class="dp-prog-fill" style="width:${Math.round([...new Set(s.allCards.map(c=>c.id))].length/CARD_POOL.length*100)}%"></div></div></div><div class="dp-grid dp-grid--lg">${[...new Map(s.allCards.map(c=>[c.id,c])).values()].map(c=>_thumb(c,s.allCards.filter(x=>x.id===c.id).length)).join('')}</div>`}</div>
    </div>
  </div>`;

  _bgParticles(document.getElementById('dp-bgp'), 25);

  document.getElementById('dp-tx')?.addEventListener('click', ()=>{
    const t=document.getElementById('dp-toast'); if(t){t.classList.add('dp-toast--out');setTimeout(()=>t.remove(),300);}
  });

  const cta = document.getElementById('dp-cta');
  if (cta) cta.addEventListener('click', ()=>_beginOpening(el, s));

  const packWrap = document.getElementById('dp-pack');
  if (packWrap) {
    packWrap.addEventListener('click', ()=>_beginOpening(el, s));
    packWrap.addEventListener('keydown', e=>{if(e.key==='Enter'||e.key===' ')_beginOpening(el,s);});
  }
  _tilt(packWrap, 25, 1.05);

  el.querySelectorAll('.dp-tab').forEach(tab=>{
    tab.addEventListener('click',()=>{
      el.querySelectorAll('.dp-tab').forEach(t=>t.classList.remove('on'));
      tab.classList.add('on');
      document.getElementById('p-recent').style.display = tab.dataset.p==='recent'?'':'none';
      document.getElementById('p-coll').style.display = tab.dataset.p==='coll'?'':'none';
    });
  });
}

/* ════════════════════════════════════════════════════════════
   2. START OPENING
   ════════════════════════════════════════════════════════════ */
async function _beginOpening(el, s) {
  if (_animLock) return;
  _animLock = true;
  const drawn = _draw(CARDS_PER_PACK);

  const pack = document.getElementById('dp-pack');
  const home = el.querySelector('.dp-home');
  
  if (pack) pack.classList.add('dp-pack3d--zoom');
  if (home) home.classList.add('dp-home--dimming');
  
  await _delay(500);

  if (pack) { 
    pack.classList.remove('dp-pack3d--zoom'); 
    pack.classList.add('dp-pack3d--shake'); 
  }
  await _delay(600);

  _packScene(el, s, drawn);
}

/* ════════════════════════════════════════════════════════════
   3. PACK TEAR SCENE (Real Booster Mechanics)
   ════════════════════════════════════════════════════════════ */
function _packScene(el, s, cards) {
  el.innerHTML = `
  <div class="dp-scene">
    <div class="dp-scene-bg"><div class="dp-scene-vignette"></div></div>
    <div class="dp-scene-center">
      <div class="dp-shockwave" id="dp-shockwave"></div>
      <div class="dp-pack-tear" id="dp-pt">
        <div class="dp-pt-top" id="dp-pt-top">
          <div class="dp-pack-crimp dp-pack-crimp--top"></div>
          <div class="dp-pack-tearline" style="top:auto; bottom:-2px; position:absolute;"></div>
          <div class="dp-pt-drag-hint">↔ ลากปัดเพื่อฉีก!</div>
        </div>
        <div class="dp-pt-body" id="dp-pt-body">
          <div class="dp-pt-beam"></div>
          <div class="dp-pack-logo">DETECTIVE<br>CONAN</div>
          <div class="dp-pack-sub" style="margin-top:10px;">TRADING CARD GAME</div>
          <div class="dp-pack-char"></div>
          <div class="dp-pack-foil"></div>
          <div class="dp-pack-shine"></div>
        </div>
        <div class="dp-pack-crimp dp-pack-crimp--bottom" style="position:absolute;"></div>
        <div class="dp-pt-particles" id="dp-pt-p"></div>
      </div>
    </div>
  </div>`;

  const pt = document.getElementById('dp-pt');
  _raf(()=>pt?.classList.add('dp-pt--enter'));

  const t1 = setTimeout(()=>pt?.classList.add('dp-pt--idle'), 600);
  _timers.push(t1);

  const top = document.getElementById('dp-pt-top');
  const body = document.getElementById('dp-pt-body');
  const partEl = document.getElementById('dp-pt-p');
  
  let isDragging = false;
  let startX = 0, startY = 0;
  
  const clearEvents = () => {
    _dragEvents.forEach(e => e.tgt.removeEventListener(e.ev, e.fn));
    _dragEvents = [];
  };

  const doTear = async (fromDrag = false) => {
    if (_animLock === 'tearing') return;
    _animLock = 'tearing';
    
    clearEvents();
    pt?.classList.remove('dp-pt--idle');
    if (body) body.style.transform = '';

    if (!fromDrag) {
      pt?.classList.add('dp-pt--pre-tear');
      await _delay(300);
    }

    // Shockwave!
    document.getElementById('dp-shockwave')?.classList.add('dp-shockwave--fire');

    top.style.transition = 'transform .4s cubic-bezier(0.34, 1.56, 0.64, 1), opacity .3s ease';
    top?.classList.add('dp-pt-top--rip');
    
    _tearParticles(partEl, 120, 700); // Big particle burst

    await _delay(50);
    _flash('rgba(255,255,255,1)', 800);
    
    if (body) body.classList.add('dp-pt-body--glow');
    
    await _delay(900); 
    _cardFlow(el, s, cards);
  };

  const onStart = (e) => {
    if (_animLock === 'tearing') return;
    isDragging = true;
    const ev = e.touches ? e.touches[0] : e;
    startX = ev.clientX; startY = ev.clientY;
    
    top.style.transition = 'none';
    pt?.classList.remove('dp-pt--idle');
    
    const dragHint = document.querySelector('.dp-pt-drag-hint');
    if (dragHint) dragHint.style.opacity = '0';
  };

  const onMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const ev = e.touches ? e.touches[0] : e;
    let dx = ev.clientX - startX;
    
    let dir = dx >= 0 ? 1 : -1;
    let adx = Math.abs(dx);
    
    if (adx > 5) {
      let tx = dx * 0.9;
      let ty = adx * 0.3; 
      let rotZ = (adx * 0.3) * dir;
      let rotX = -adx * 0.6;
      
      top.style.transform = `translate3d(${tx}px, ${ty}px, 0) rotateZ(${rotZ}deg) rotateX(${rotX}deg)`;
      
      let tension = Math.min(1, adx / 140);
      let shakeInt = tension * 4;
      
      if (body) {
        body.style.transform = `translate3d(${Math.random()*shakeInt-shakeInt/2}px, ${Math.random()*shakeInt-shakeInt/2}px, 0)`;
        body.style.boxShadow = `0 10px 30px rgba(0,0,0,.6), inset 0 0 ${tension*50}px rgba(100,200,255,${tension*0.5})`;
      }
      
      if (Math.random() > (1 - tension * 0.5)) _tearParticles(partEl, 2, 80);
      
      if (adx > 140) {
        isDragging = false;
        doTear(true);
      }
    }
  };

  const onEnd = () => {
    if (!isDragging) return;
    isDragging = false;
    
    top.style.transition = 'transform .5s cubic-bezier(0.34, 1.56, 0.64, 1)';
    top.style.transform = '';
    if (body) { body.style.transform = ''; body.style.boxShadow = ''; }
    
    const dragHint = document.querySelector('.dp-pt-drag-hint');
    if (dragHint) dragHint.style.opacity = '1';

    setTimeout(() => { if (_animLock !== 'tearing') pt?.classList.add('dp-pt--idle'); }, 500);
  };

  const bind = (tgt, ev, fn, opts) => {
    tgt.addEventListener(ev, fn, opts);
    _dragEvents.push({tgt, ev, fn});
  };

  bind(top, 'mousedown', onStart);
  bind(top, 'touchstart', onStart, {passive: false});
  bind(window, 'mousemove', onMove, {passive: false});
  bind(window, 'touchmove', onMove, {passive: false});
  bind(window, 'mouseup', onEnd);
  bind(window, 'touchend', onEnd);
  bind(pt, 'click', (e) => { if (e.target !== top) doTear(); });
}

/* ════════════════════════════════════════════════════════════
   4 & 5. CARD REVEAL 
   ════════════════════════════════════════════════════════════ */
async function _cardFlow(el, s, cards) {
  let idx = 0;

  const showCard = async (i) => {
    const card = cards[i];
    const rc = RARITY_CONFIG[card.rarity];
    const isLast = i === cards.length - 1;
    const isRare = ['SR','MR','SRP','MRP','SRCP','MRCP','SEC'].includes(card.rarity);
    const isSec = card.rarity === 'SEC';
    const cColor = rc.c === 'sec' ? '#0ea5e9' : rc.c; // fallback for SEC glow

    const flipDelay = isLast ? 850 : 500;
    const revealPause = isLast ? 700 : 350;

    el.innerHTML = `
    <div class="dp-rv ${isRare?'dp-rv--rare':''} ${isSec?'dp-rv--sec':''}">
      <div class="dp-rv-bg">
        <div class="dp-orb" style="background:radial-gradient(circle,${cColor}55 0%,transparent 70%);width:900px;height:900px;top:0%;left:5%;"></div>
        ${isRare?`<div class="dp-rv-sparkles" id="dp-sp"></div>`:''}
      </div>

      <div class="dp-rv-bar">
        <div class="dp-rv-pips">${cards.map((_,j)=>`<div class="dp-pip ${j<i?'done':j===i?'now':''}"></div>`).join('')}</div>
        <div class="dp-rv-n">${i+1}/${cards.length}</div>
      </div>

      <div class="dp-rv-stage" id="dp-rv-stage">
        <div class="dp-card3d-wrap" id="dp-card3d" style="--cg:${cColor};" data-rarity="${card.rarity}">
          <div class="dp-card-body" id="dp-card-body">
            <div class="dp-card-back">
              <div class="dp-card-back-art">
                <div class="dp-card-back-logo">DETECTIVE<br>CONAN</div>
                <div class="dp-card-back-grid"></div>
              </div>
            </div>
            <div class="dp-card-front">
              <div class="dp-card-front-glow"></div>
              ${_badgeHTML(card.rarity)}
              <div class="dp-cf-name">${card.name}</div>
              <div class="dp-cf-name-en">${card.nameEn}</div>
              <div class="dp-holo"></div>
              <div class="dp-card-sweep" id="dp-sweep"></div>
            </div>
          </div>
        </div>
        ${isRare?`<div class="dp-rv-ring" id="dp-ring"></div>`:''}
      </div>

      <div class="dp-rv-info" id="dp-rv-info">
        <div class="dp-rv-rar" style="color:${cColor}">${card.rarity}</div>
        <div class="dp-rv-card-name">${card.name}</div>
      </div>

      <div class="dp-rv-btns" id="dp-rv-btns">
        ${isLast
          ? `<button class="dp-btn dp-btn--primary dp-btn--lg" id="dp-to-result"><div class="dp-cta-bg"></div>🎊 ดูผลสรุป</button>`
          : `<button class="dp-btn dp-btn--secondary dp-btn--glass" id="dp-next">การ์ดถัดไป →</button>`
        }
      </div>
    </div>`;

    if (isRare) _rareParticles(document.getElementById('dp-sp'), cColor, isSec? 100 : 80);

    const cardWrap = document.getElementById('dp-card3d');
    _raf(()=>cardWrap?.classList.add('dp-card3d--enter'));

    await _delay(flipDelay);

    const body = document.getElementById('dp-card-body');
    body?.classList.add('dp-card--flipped');

    if (isRare) {
      await _delay(120);
      _flash(isSec ? 'rgba(255,255,255,0.8)' : `rgba(255,255,255,0.6)`, 600);
      document.getElementById('dp-ring')?.classList.add('dp-rv-ring--on');
    }

    await _delay(revealPause);

    const sweep = document.getElementById('dp-sweep');
    if (sweep) sweep.classList.add('dp-card-sweep--go');

    cardWrap?.classList.add('dp-card3d--revealed');
    _tilt(cardWrap, 35, 1.1);

    await _delay(300);
    document.getElementById('dp-rv-info')?.classList.add('dp-rv-info--show');
    await _delay(150);
    document.getElementById('dp-rv-btns')?.classList.add('dp-rv-btns--show');

    document.getElementById('dp-next')?.addEventListener('click', ()=>{ idx++; if(idx<cards.length) showCard(idx); });
    document.getElementById('dp-to-result')?.addEventListener('click', ()=>_result(el, s, cards));
  };

  await _delay(100);
  showCard(idx);
}

/* ════════════════════════════════════════════════════════════
   6. RESULT SCREEN
   ════════════════════════════════════════════════════════════ */
function _result(el, s, cards) {
  const newAll = [...s.allCards, ...cards];
  const newPulls = s.todayPulls + 1;
  _save(newPulls, newAll, s.streak, s.today);
  s.todayPulls = newPulls; s.allCards = newAll; s.lastDate = s.today;

  // Compute best card based on weight
  const best = cards.reduce((b,c)=>RARITY_CONFIG[c.rarity].w < RARITY_CONFIG[b.rarity].w ? c : b, cards[0]);
  const rc = RARITY_CONFIG[best.rarity];
  const cColor = rc.c === 'sec' ? '#0ea5e9' : rc.c;

  el.innerHTML = `
  <div class="dp-res">
    <div class="dp-bg"><div class="dp-orb dp-orb--1"></div><div class="dp-orb dp-orb--2"></div><div class="dp-res-sparkle" id="dp-rsp"></div></div>
    
    <div class="dp-res-header">
      <div class="dp-res-eyebrow">🎉 สำเร็จ!</div>
      <h2 class="dp-res-title">การ์ดที่ได้รับ</h2>
      <div class="dp-res-best">ดีที่สุด: <span style="color:${cColor};font-weight:900;text-shadow:0 0 20px ${cColor}bb;">${best.name} (${best.rarity})</span></div>
    </div>
    
    <div class="dp-res-cards">${cards.map((c,i)=>{
      const r=RARITY_CONFIG[c.rarity];
      return `<div class="dp-res-card" style="--cg:${r.c==='sec'?'#0ea5e9':r.c};--i:${i}" data-rarity="${c.rarity}">
        ${_badgeHTML(c.rarity)}
        <div class="dp-res-card-name">${c.name}</div>
        <div class="dp-res-card-shine"></div>
        <div class="dp-holo"></div>
      </div>`;
    }).join('')}</div>
    
    <div class="dp-res-actions">
      <button class="dp-btn dp-btn--primary dp-btn--lg" id="dp-again">
        <div class="dp-cta-bg"></div>⚡ จุ่มเพิ่มอีก! (ฟรี)
      </button>
      <button class="dp-btn dp-btn--secondary dp-btn--glass" id="dp-to-coll">📖 ดูคอลเลกชัน</button>
    </div>
  </div>`;

  _tearParticles(document.getElementById('dp-rsp'), 80, 400);
  el.querySelectorAll('.dp-res-card').forEach(c => _tilt(c, 25, 1.2));

  document.getElementById('dp-again')?.addEventListener('click',()=>{_animLock=false;_beginOpening(el,s);});
  document.getElementById('dp-to-coll')?.addEventListener('click',()=>{_animLock=false;_home(el,s);setTimeout(()=>el.querySelector('[data-p="coll"]')?.click(),150);});
}

function _flash(color, dur=350) {
  const f = document.createElement('div');
  f.className = 'dp-flash';
  f.style.background = color;
  f.style.animationDuration = dur+'ms';
  document.body.appendChild(f);
  setTimeout(()=>f.remove(), dur+50);
}

export async function mountDaily(container) {
  _root = container; _animLock = false; _timers = []; _rafIds = []; _dragEvents = [];
  _state = _load();
  container.className = 'dp-root';
  _home(container, _state);
}
export function unmountDaily() {
  _timers.forEach(t=>clearTimeout(t)); _timers=[];
  _rafIds.forEach(id=>cancelAnimationFrame(id)); _rafIds=[];
  _dragEvents.forEach(e => e.tgt.removeEventListener(e.ev, e.fn)); _dragEvents=[];
  _animLock = false;
  if (_root) _root.className = '';
}
