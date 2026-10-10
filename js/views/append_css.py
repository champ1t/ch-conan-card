import os

css_path = '/Users/jakkapatmac/.gemini/antigravity-ide/scratch/cardlab/css/pages/tcg.css'

new_css = """
/* ════════════════════════════════════════════════════════════
   AAA GACHA SCREEN (FULL OVERLAY)
   ════════════════════════════════════════════════════════════ */
.tcg-gacha-scene {
  position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
  z-index: 2000; background: #000; color: white;
  display: flex; flex-direction: column;
  font-family: var(--font-primary);
  overflow: hidden;
  transition: opacity 0.5s;
}
.tcg-gacha-layout {
  display: grid; grid-template-columns: 320px 1fr 320px; flex: 1; position: relative; z-index: 10;
  padding: 0 40px; gap: 40px;
}

/* Header (Logo & Profile) */
.tcg-gacha-scene .tcg-top-nav {
  position: relative; z-index: 20; display: flex; justify-content: space-between; align-items: center; padding: 20px 40px;
}
.tcg-gacha-scene .tcg-logo-main { font-size: 2rem; font-weight: 900; font-style: italic; }
.tcg-gacha-scene .tcg-logo-sub { display: block; font-size: 0.6rem; letter-spacing: 4px; color: #60a5fa; }
.tcg-gacha-scene .tcg-top-links button { background: none; border: none; color: white; padding: 10px 20px; font-weight: bold; font-size: 0.9rem; cursor: pointer; opacity: 0.6; }
.tcg-gacha-scene .tcg-top-links button.active { opacity: 1; border-bottom: 2px solid #60a5fa; color: #60a5fa; }
.tcg-gacha-scene .tcg-user-bar { display: flex; gap: 15px; }

/* Left Sidebar */
.tcg-gacha-left { display: flex; flex-direction: column; gap: 20px; justify-content: center; }
.tcg-gacha-sets { display: flex; flex-direction: column; gap: 10px; background: rgba(255,255,255,0.03); backdrop-filter: blur(10px); padding: 20px; border-radius: 16px; border: 1px solid rgba(255,255,255,0.1); }
.gacha-set-item { display: flex; align-items: center; gap: 15px; padding: 10px; border-radius: 12px; cursor: pointer; opacity: 0.5; transition: 0.3s; }
.gacha-set-item.active { opacity: 1; background: linear-gradient(90deg, rgba(96,165,250,0.2), transparent); border-left: 3px solid #60a5fa; }
.gacha-set-item .set-img { width: 40px; height: 60px; background-size: cover; border-radius: 4px; box-shadow: 0 0 10px rgba(0,0,0,0.5); }
.gacha-set-item .id { font-size: 0.8rem; font-weight: 900; }
.gacha-set-item .name { font-size: 0.7rem; color: #94a3b8; }
.tcg-gacha-quote { font-family: 'Brush Script MT', cursive; font-size: 1.5rem; color: rgba(255,255,255,0.4); text-shadow: 0 0 10px rgba(255,255,255,0.1); transform: rotate(-5deg); margin-top: 40px; }
.tcg-gacha-mascot { display: flex; align-items: flex-end; gap: 15px; margin-top: auto; padding-bottom: 40px; position: relative; }
.tcg-gacha-mascot .speech-bubble { background: rgba(30,58,138,0.5); padding: 15px; border-radius: 20px 20px 20px 0; border: 1px solid rgba(96,165,250,0.3); font-size: 0.85rem; margin-bottom: 50px; }
.tcg-gacha-mascot .conan-art { margin-left:-20px; }

/* Center Stage */
.tcg-gacha-center { display: flex; flex-direction: column; align-items: center; justify-content: center; position: relative; }
.gacha-set-title-pill { display: inline-flex; align-items: center; gap: 10px; background: rgba(0,0,0,0.6); padding: 10px 30px; border-radius: 50px; font-weight: 900; border: 1px solid rgba(255,255,255,0.1); letter-spacing: 2px; text-transform: uppercase; margin-bottom: auto; margin-top: 20px; z-index:20; }
.gacha-center-stage { position: relative; width: 100%; height: 500px; display: flex; align-items: center; justify-content: center; }
.gacha-platform { position: absolute; bottom: -50px; width: 500px; height: 180px; background-size: cover; border-radius: 50%; opacity: 0.8; mix-blend-mode: screen; filter: saturate(1.5) brightness(1.2); }
.gacha-pack-container { position: absolute; z-index: 10; animation: tcgOrbFloat 4s ease-in-out infinite; transform-origin: center bottom; }
.gacha-burst-cards { position: absolute; top: 50%; left: 50%; z-index: 5; pointer-events: none; }

/* Actions */
.gacha-action-area { display: flex; flex-direction: column; align-items: center; gap: 20px; margin-top: auto; padding-bottom: 40px; z-index: 20; }
.gacha-status { font-size: 0.8rem; font-weight: 900; letter-spacing: 8px; color: #60a5fa; }
.gacha-btn-pull { 
  background: linear-gradient(180deg, #fcd34d, #b45309);
  color: #000; font-weight: 900; font-size: 1.5rem; padding: 15px 80px; border-radius: 12px;
  border: 2px solid #fef3c7; box-shadow: 0 0 30px rgba(245,158,11,0.5), inset 0 2px 10px rgba(255,255,255,0.5);
  cursor: pointer; transition: 0.3s;
}
.gacha-btn-pull:hover { transform: scale(1.05); box-shadow: 0 0 50px rgba(245,158,11,0.8), inset 0 2px 10px rgba(255,255,255,0.5); }

/* Right Sidebar */
.tcg-gacha-right { display: flex; flex-direction: column; gap: 20px; justify-content: center; }
.gacha-obtained-panel { background: rgba(0,0,0,0.5); backdrop-filter: blur(10px); border-radius: 16px; border: 1px solid rgba(255,255,255,0.1); padding: 20px; display: flex; flex-direction: column; gap: 15px; height: 400px; }
.gacha-obtained-panel h3 { margin: 0; font-size: 0.8rem; font-weight: 900; letter-spacing: 2px; }
.obtained-list { display: flex; flex-direction: column; gap: 10px; overflow-y: auto; padding-right: 5px; flex: 1; }
.gacha-obtained-item { display: flex; align-items: center; gap: 12px; background: rgba(255,255,255,0.05); padding: 8px; border-radius: 10px; border: 1px solid rgba(255,255,255,0.1); position: relative; }
.gacha-obtained-item .thumb { width: 40px; height: 56px; background-size: cover; background-position:center; border-radius: 4px; display:flex; align-items:center; justify-content:center; }
.gacha-obtained-item .info { display: flex; flex-direction: column; gap: 2px; }
.gacha-obtained-item .info .rar { font-size: 0.65rem; font-weight: 900; }
.gacha-obtained-item .info .name { font-size: 0.75rem; font-weight: bold; }
.gacha-obtained-item .info .cid { font-size: 0.6rem; color: rgba(255,255,255,0.4); }
.gacha-obtained-item .new-badge { position: absolute; top: -5px; right: -5px; background: #e11d48; color: white; font-size: 0.6rem; font-weight: 900; padding: 2px 6px; border-radius: 10px; }

.gacha-rarity-panel { background: rgba(0,0,0,0.5); backdrop-filter: blur(10px); border-radius: 16px; border: 1px solid rgba(255,255,255,0.1); padding: 20px; }
.gacha-rarity-panel h3 { margin: 0 0 15px 0; font-size: 0.8rem; font-weight: 900; letter-spacing: 2px; }
.rarity-stats .r-row { display: flex; justify-content: space-between; font-size: 0.8rem; padding: 8px 0; border-bottom: 1px solid rgba(255,255,255,0.05); }

/* Footer */
.tcg-gacha-footer { position: absolute; bottom: 0; left: 0; width: 100%; padding: 20px 40px; display: flex; justify-content: space-between; z-index: 20; }
.tcg-gacha-footer .settings { display: flex; gap: 20px; }
.tcg-gacha-footer .settings button { background: none; border: none; color: rgba(255,255,255,0.6); font-size: 0.8rem; cursor: pointer; display: flex; align-items: center; gap: 8px; }
.tcg-gacha-footer .skip-toggle { display: flex; align-items: center; gap: 10px; font-size: 0.8rem; font-weight: 900; color: rgba(255,255,255,0.6); }
.tcg-gacha-footer .skip-toggle .toggle { width: 40px; height: 20px; background: rgba(255,255,255,0.2); border-radius: 20px; position: relative; }
.tcg-gacha-footer .skip-toggle .toggle::after { content: ''; position: absolute; width: 16px; height: 16px; background: white; border-radius: 50%; top: 2px; left: 2px; }

/* Responsive adjustments for Gacha Scene */
@media (max-width: 1024px) {
  .tcg-gacha-layout { grid-template-columns: 1fr; padding: 20px; overflow-y: auto; display: block; }
  .tcg-gacha-left, .tcg-gacha-right { display: none; } /* Hide sidebars on mobile for now */
  .tcg-gacha-center { height: 100vh; }
  .tcg-gacha-footer { display: none; }
}
"""

with open(css_path, 'a') as f:
    f.write(new_css)
    
print("CSS Appended!")
