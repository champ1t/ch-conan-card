import os

js_path = '/Users/jakkapatmac/.gemini/antigravity-ide/scratch/cardlab/js/views/tcg.js'
with open(js_path, 'r') as f:
    js_content = f.read()

start_idx = js_content.find('async function _startOpenPack()')
end_idx = js_content.find('function _renderCollection()')

if start_idx != -1 and end_idx != -1:
    new_js = """
/* ════════════════════════════════════════════════════════════
   AAA GACHA SCREEN (MOCKUP RECREATION)
   ════════════════════════════════════════════════════════════ */
async function _startOpenPack() {
  if (_animLock) return;
  _animLock = true;

  const currentSet = _getSet(_selectedSetId);
  
  // Create full screen Gacha UI
  const scene = document.createElement('div');
  scene.className = 'tcg-gacha-scene';
  
  // Generate HTML for sidebars and center
  scene.innerHTML = `
    <!-- Background -->
    <div class="tcg-bg-image" style="filter: saturate(1.5) brightness(0.6); opacity: 0.9;"></div>
    <div class="tcg-bg-vignette"></div>
    <div class="tcg-bg-orb orb-blue"></div>
    <div class="tcg-bg-orb orb-purple"></div>
    <canvas class="tcg-bg-particles-canvas" id="tcg-gacha-particles" style="position:absolute;inset:0;z-index:2;pointer-events:none;"></canvas>
    
    <!-- Top Nav -->
    <header class="tcg-top-nav">
      <div class="tcg-logo"><span class="tcg-logo-main">DETECTIVE <span style="color:#60a5fa">CONAN</span></span><span class="tcg-logo-sub">TRADING CARD GAME</span></div>
      <nav class="tcg-top-links">
        <button id="gacha-btn-home"><span class="icon">🏠</span> HOME</button>
        <button class="active"><span class="icon">⚡</span> JUMP</button>
        <button><span class="icon">🃏</span> COLLECTION</button>
      </nav>
      <div class="tcg-user-bar">
        <div class="tcg-profile-sm glass-pill"><div class="tcg-profile-text"><div class="name">JACKPOT</div><div class="level" style="font-size:0.6rem;color:#60a5fa;">Lv.12</div></div></div>
        <div class="tcg-currency glass-pill"><span class="icon">💎</span> <span class="val">3,580</span> <button class="add" style="background:none;border:none;color:white;cursor:pointer;">+</button></div>
      </div>
    </header>

    <div class="tcg-gacha-layout">
      <!-- Left Sidebar (Set List & Conan) -->
      <div class="tcg-gacha-left">
        <div class="tcg-gacha-sets">
          ${TCG_SETS.slice(0,6).map(s => `
            <div class="gacha-set-item ${s.id === currentSet.id ? 'active' : ''}">
              <div class="set-img" style="background-image:url('${s.packImg}')"></div>
              <div class="set-info">
                <div class="id">${s.id}</div>
                <div class="name" style="text-overflow:ellipsis;white-space:nowrap;overflow:hidden;max-width:140px;">${s.nameEn || s.name}</div>
              </div>
            </div>
          `).join('')}
          <div class="more-btn" style="text-align:center;font-size:0.7rem;color:rgba(255,255,255,0.5);margin-top:10px;cursor:pointer;">MORE ⌄</div>
        </div>
        
        <div class="tcg-gacha-quote">
          "There is always truth...<br>only one truth..."
        </div>
        
        <div class="tcg-gacha-mascot">
          <div class="conan-art" style="font-size: 6rem; filter: drop-shadow(0 0 20px rgba(96,165,250,0.5)); transform: scaleX(-1);">🕵️</div>
          <div class="speech-bubble">เปิดซองไปด้วยกันเลย!</div>
        </div>
      </div>

      <!-- Center Stage (Pack & Pull Button) -->
      <div class="tcg-gacha-center">
        <!-- Floating Set Title -->
        <div class="gacha-set-title-pill">
          <span class="highlight" style="color:#fcd34d;">${currentSet.id}</span> | ${currentSet.nameEn || currentSet.name}
        </div>
        
        <div class="gacha-center-stage">
          <div class="gacha-platform" style="background-image:url('img/tcg_platform_glow.jpg')"></div>
          
          <div class="gacha-pack-container" id="gacha-pack-wrap">
            <div class="tcg-pack premium" style="background-image:url('${currentSet.packImg}');--pack-glow:${currentSet.auraColor}; transform: scale(1.6); box-shadow:0 0 50px ${currentSet.auraColor};">
              <div class="tcg-pack-foil"></div>
              <div class="tcg-pack-rainbow"></div>
              <div class="tcg-pack-inner-glow"></div>
            </div>
          </div>
          
          <div class="gacha-burst-cards" id="gacha-burst-cards"></div>
        </div>
        
        <div class="gacha-action-area">
          <div class="gacha-status">OPENING...</div>
          <button class="gacha-btn-pull" id="gacha-trigger-pull">
            <span class="icon">📦</span> เปิดซอง <span style="letter-spacing:2px">>></span>
          </button>
        </div>
      </div>

      <!-- Right Sidebar (Obtained Cards) -->
      <div class="tcg-gacha-right">
        <div class="gacha-obtained-panel">
          <h3>OBTAINED CARDS <span style="float:right;color:#60a5fa">--</span></h3>
          <div class="obtained-list" id="gacha-obtained-list">
            <!-- Empty state -->
            <div style="opacity:0.3; text-align:center; padding: 20px;">รอเปิดซอง...</div>
          </div>
        </div>
        
        <div class="gacha-rarity-panel">
          <h3>RARITY <span style="float:right;color:#60a5fa">--</span></h3>
          <div class="rarity-stats" id="gacha-rarity-stats">
            <div class="r-row"><span style="color:#fcd34d;display:flex;align-items:center;gap:5px;"><span style="font-size:0.6rem">🌟</span> SSR</span> <span>0</span></div>
            <div class="r-row"><span style="color:#a855f7;display:flex;align-items:center;gap:5px;"><span style="font-size:0.6rem">✨</span> SR</span> <span>0</span></div>
            <div class="r-row"><span style="color:#38bdf8;display:flex;align-items:center;gap:5px;"><span style="font-size:0.6rem">🔮</span> R</span> <span>0</span></div>
            <div class="r-row"><span style="color:#94a3b8;display:flex;align-items:center;gap:5px;"><span style="font-size:0.6rem">📦</span> N</span> <span>0</span></div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Footer Settings -->
    <div class="tcg-gacha-footer">
      <div class="settings">
        <button><span class="icon">🔊</span> เสียง</button>
        <button><span class="icon">✨</span> เอฟเฟกต์</button>
        <button><span class="icon">⏱️</span> ความเร็ว</button>
      </div>
      <div class="skip-toggle">
        SKIP ANIMATION <div class="toggle"></div>
      </div>
    </div>
  `;
  document.body.appendChild(scene);

  // Home Button
  scene.querySelector('#gacha-btn-home').addEventListener('click', () => {
    scene.style.opacity = '0';
    _setTimeout(() => { scene.remove(); _animLock = false; }, 500);
  });

  // Start Canvas particles
  const canvas = scene.querySelector('#tcg-gacha-particles');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    const particles = Array.from({length:100}, () => ({x:Math.random()*canvas.width, y:Math.random()*canvas.height, vy:-0.5-Math.random(), r:1+Math.random()*2, a:0.2+Math.random()*0.5}));
    let animId;
    const draw = () => {
      ctx.clearRect(0,0,canvas.width,canvas.height);
      particles.forEach(p => {
        p.y += p.vy; if (p.y < 0) { p.y = canvas.height; p.x = Math.random()*canvas.width; }
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
        ctx.fillStyle = `rgba(96,165,250,${p.a})`; ctx.shadowBlur=10; ctx.shadowColor='#60a5fa'; ctx.fill();
      });
      animId = requestAnimationFrame(draw);
    };
    draw();
    _addCleanup(() => cancelAnimationFrame(animId));
  }

  // Handle Pull Action
  const btn = scene.querySelector('#gacha-trigger-pull');
  btn.addEventListener('click', async () => {
    btn.style.pointerEvents = 'none';
    btn.style.opacity = '0.5';
    
    // Draw 5 cards
    const cards = drawCards(5, currentSet.id);
    
    // Animate Pack Burst
    const packWrap = scene.querySelector('#gacha-pack-wrap');
    packWrap.style.animation = 'tcgCineShake 1s cubic-bezier(.36,.07,.19,.97) both';
    scene.querySelector('.gacha-status').textContent = 'UNLEASHING...';
    
    await _delay(1000);
    _flash('#fff');
    packWrap.style.opacity = '0';
    packWrap.style.transform = 'scale(0)';
    
    // Reveal Cards around center
    const burstContainer = scene.querySelector('#gacha-burst-cards');
    const listContainer = scene.querySelector('#gacha-obtained-list');
    listContainer.innerHTML = '';
    
    let stats = { SSR:0, SR:0, R:0, N:0 };
    
    for (let i = 0; i < cards.length; i++) {
      const c = cards[i];
      const r = _R(c);
      
      // Update stats
      if (['SEC','SECSign','MR','MRP','CP'].includes(c.rarity)) stats.SSR++;
      else if (['SR','SRP','SRCP'].includes(c.rarity)) stats.SR++;
      else if (['R','RP'].includes(c.rarity)) stats.R++;
      else stats.N++;
      
      // Burst card 3D
      const cardEl = _buildCard(c, 160, 224, { noAura: true });
      cardEl.style.position = 'absolute';
      const angle = (i - 2) * 25; // spread fan
      cardEl.style.transform = `translate(-50%, -50%) rotate(${angle}deg) translateY(-50px) scale(0)`;
      cardEl.style.transition = 'all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)';
      burstContainer.appendChild(cardEl);
      
      // Sidebar list item
      const li = document.createElement('div');
      li.className = 'gacha-obtained-item';
      li.style.borderColor = r.color;
      li.innerHTML = `
        <div class="thumb" style="${c.image ? `background-image:url('${c.image}')` : `background:linear-gradient(135deg,${c.color1||'#333'},${c.color2||'#111'})`}">${c.image?'':(c.emoji||'❓')}</div>
        <div class="info">
          <div class="rar" style="color:${r.color}">${c.rarity}</div>
          <div class="name">${c.nameTh || c.nameEn || c.name}</div>
          <div class="cid">${c.id}</div>
        </div>
        ${r.id !== 'C' ? '<div class="new-badge">NEW</div>' : ''}
      `;
      li.style.opacity = '0';
      li.style.transform = 'translateX(20px)';
      listContainer.appendChild(li);
      
      // Animate them in
      _setTimeout(() => {
        cardEl.style.transform = `translate(-50%, -50%) rotate(${angle}deg) translateY(-250px) scale(1)`;
        li.style.transition = 'all 0.4s ease';
        li.style.opacity = '1';
        li.style.transform = 'translateX(0)';
      }, i * 200);
    }
    
    // Update Stats UI
    scene.querySelector('#gacha-rarity-stats').innerHTML = `
      <div class="r-row"><span style="color:#fcd34d;display:flex;align-items:center;gap:5px;"><span style="font-size:0.6rem">🌟</span> SSR+</span> <span style="font-weight:bold">${stats.SSR}</span></div>
      <div class="r-row"><span style="color:#a855f7;display:flex;align-items:center;gap:5px;"><span style="font-size:0.6rem">✨</span> SR</span> <span style="font-weight:bold">${stats.SR}</span></div>
      <div class="r-row"><span style="color:#38bdf8;display:flex;align-items:center;gap:5px;"><span style="font-size:0.6rem">🔮</span> R</span> <span style="font-weight:bold">${stats.R}</span></div>
      <div class="r-row"><span style="color:#94a3b8;display:flex;align-items:center;gap:5px;"><span style="font-size:0.6rem">📦</span> N</span> <span style="font-weight:bold">${stats.N}</span></div>
    `;
    
    // Save to State
    const today = _today();
    const newEntries = cards.map(c => ({ cardId: c.id, date: today }));
    _state.collection = [..._state.collection, ...newEntries];
    _state.totalPulls = (_state.totalPulls || 0) + 5;
    _save(_state);
    
    scene.querySelector('.gacha-status').textContent = 'COMPLETED';
    
    // Change button to return
    _setTimeout(() => {
      btn.innerHTML = 'กลับหน้าแรก 🏠';
      btn.style.pointerEvents = 'auto';
      btn.style.opacity = '1';
      btn.onclick = () => {
        scene.style.opacity = '0';
        _setTimeout(() => { scene.remove(); _animLock = false; _renderHome(); }, 500);
      };
    }, 1500);
  });
}
"""

    js_content = js_content[:start_idx] + new_js + "\n" + js_content[end_idx:]
    with open(js_path, 'w') as f:
        f.write(js_content)
    print("JS Replacement Success")
else:
    print("Failed to find indices")
