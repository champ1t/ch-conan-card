/** Highlights View — with real YouTube embeds */
import { navigate } from '../router.js';

const CLIPS = [
  {
    id: 'h1',
    ytId: 'YXbfwyBRSKQ',
    title: 'จุ่มการ์ดโคนัน Highlight #1 ',
    type: 'rare-pull',
    emoji: '',
  },
  {
    id: 'h2',
    ytId: 'TKsxZ8wgrQE',
    title: 'จุ่มการ์ดโคนัน Highlight #2 ',
    type: 'rare-pull',
    emoji: '',
  },
  {
    id: 'h3',
    ytId: 'X4iHh1jdO-A',
    title: 'Reaction จุ่มการ์ดโคนัน ',
    type: 'reaction',
    emoji: '',
  },
  {
    id: 'h4',
    ytId: 'nUAZJRpfqi4',
    title: 'Rare Pull สุดหายาก!! ',
    type: 'rare-pull',
    emoji: '',
    isShort: true,
  },
];

const TYPES = [
  { id: 'all',       label: 'ทั้งหมด' },
  { id: 'rare-pull', label: 'Rare Pull ' },
  { id: 'box-open',  label: 'Box Opening ' },
  { id: 'reaction',  label: 'Reaction ' },
];

let _playerOverlay = null;

function _openPlayer(ytId, title) {
  if (_playerOverlay) _closePlayer();
  _playerOverlay = document.createElement('div');
  _playerOverlay.style.cssText = `
    position:fixed;inset:0;z-index:9999;
    background:rgba(0,0,0,0.92);backdrop-filter:blur(20px);
    display:flex;flex-direction:column;align-items:center;justify-content:center;padding:20px;
    animation:fadeIn .25s ease;
  `;
  _playerOverlay.innerHTML = `
    <div style="width:100%;max-width:900px;">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px;gap:12px;">
        <h3 style="color:#fff;font-size:1rem;margin:0;font-family:var(--font-th);">${title}</h3>
        <button id="player-close" style="background:rgba(255,255,255,0.1);border:1px solid rgba(255,255,255,0.2);color:#fff;min-width:36px;height:36px;border-radius:50%;cursor:pointer;font-size:1rem;display:flex;align-items:center;justify-content:center;transition:all .2s;flex-shrink:0;">✕</button>
      </div>
      <div style="position:relative;padding-bottom:56.25%;height:0;border-radius:16px;overflow:hidden;box-shadow:0 0 60px rgba(124,58,237,0.5);">
        <iframe
          src="https://www.youtube.com/embed/${ytId}?autoplay=1&rel=0&modestbranding=1"
          title="${title}"
          frameborder="0"
          allow="accelerometer;autoplay;clipboard-write;encrypted-media;gyroscope;picture-in-picture"
          allowfullscreen
          style="position:absolute;top:0;left:0;width:100%;height:100%;"
        ></iframe>
      </div>
      <p style="text-align:center;color:rgba(255,255,255,0.3);font-size:0.75rem;margin-top:12px;">กด ESC หรือคลิกพื้นหลังเพื่อปิด</p>
    </div>
  `;
  document.body.appendChild(_playerOverlay);
  _playerOverlay.querySelector('#player-close').addEventListener('click', _closePlayer);
  _playerOverlay.addEventListener('click', e => { if (e.target === _playerOverlay) _closePlayer(); });
  document.addEventListener('keydown', _escClose);
}

function _escClose(e) { if (e.key === 'Escape') _closePlayer(); }

function _closePlayer() {
  if (_playerOverlay) {
    _playerOverlay.remove();
    _playerOverlay = null;
    document.removeEventListener('keydown', _escClose);
  }
}

export async function mountHighlights(container) {
  window.navigate = navigate;
  let cat = 'all';

  const render = () => {
    const filtered = cat === 'all' ? CLIPS : CLIPS.filter(c => c.type === cat);
    if (filtered.length === 0) {
      grid.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:60px;color:var(--text-3);">ยังไม่มีวิดีโอในหมวดนี้</div>`;
      return;
    }
    grid.innerHTML = filtered.map(h => {
      const thumb    = `https://img.youtube.com/vi/${h.ytId}/maxresdefault.jpg`;
      const fallback = `https://img.youtube.com/vi/${h.ytId}/hqdefault.jpg`;
      return `
      <div class="video-card" role="button" tabindex="0" aria-label="${h.title}"
           data-yt="${h.ytId}" data-title="${h.title}"
           style="cursor:pointer;overflow:hidden;">
        <div style="height:200px;position:relative;background:#0f0f1a;overflow:hidden;">
          <img
            src="${thumb}"
            onerror="this.src='${fallback}'"
            alt="${h.title}"
            loading="lazy"
            style="width:100%;height:100%;object-fit:cover;transition:transform 0.4s ease;"
          >
          <div style="position:absolute;inset:0;background:linear-gradient(to top,rgba(0,0,0,0.55) 0%,transparent 60%);pointer-events:none;"></div>
          <div class="yt-play-overlay" style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;pointer-events:none;">
            <div class="yt-play-btn" style="width:64px;height:64px;border-radius:50%;background:rgba(124,58,237,0.85);border:2px solid rgba(168,85,247,0.8);display:flex;align-items:center;justify-content:center;box-shadow:0 0 24px rgba(124,58,237,0.6);transition:all 0.3s ease;font-size:1.4rem;"></div>
          </div>
          <div style="position:absolute;top:10px;right:10px;background:rgba(0,0,0,0.7);border-radius:6px;padding:3px 8px;font-size:0.7rem;color:#fff;font-family:var(--font-en);font-weight:700;">YT</div>
        </div>
        <div class="video-card-body" style="padding:16px;">
          <div style="font-weight:700;font-size:var(--text-sm);margin-bottom:8px;line-height:1.4;">${h.emoji} ${h.title}</div>
          <div style="display:flex;gap:8px;flex-wrap:wrap;">
            <span class="badge badge-purple" style="font-size:.6rem;">${h.type}</span>
          </div>
        </div>
      </div>`;
    }).join('');

    grid.querySelectorAll('[data-yt]').forEach(card => {
      const open = () => _openPlayer(card.dataset.yt, card.dataset.title);
      card.addEventListener('click', open);
      card.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') open(); });
      const img = card.querySelector('img');
      const btn = card.querySelector('.yt-play-btn');
      card.addEventListener('mouseenter', () => {
        if (img) img.style.transform = 'scale(1.07)';
        if (btn) { btn.style.transform = 'scale(1.18)'; btn.style.boxShadow = '0 0 40px rgba(124,58,237,0.9)'; }
      });
      card.addEventListener('mouseleave', () => {
        if (img) img.style.transform = 'scale(1)';
        if (btn) { btn.style.transform = 'scale(1)'; btn.style.boxShadow = '0 0 24px rgba(124,58,237,0.6)'; }
      });
    });
  };

  container.innerHTML = `
    <div style="padding-top:var(--space-12);padding-bottom:var(--space-16);">
      <div class="container">
        <div style="margin-bottom:var(--space-8);">
          <div class="section-eyebrow">HIGHLIGHTS</div>
          <h1 class="section-title-th">ไฮไลท์ &amp; Rare Pull</h1>
          <p style="color:var(--text-2);margin-top:8px;">คลิปจุ่มการ์ดโคนัน รวมช่วงเวลาสุดฮาและหายาก!</p>
        </div>
        <div class="filter-chips" id="highlight-filters" style="margin-bottom:var(--space-8);">
          ${TYPES.map(t => `<button class="filter-chip ${t.id==='all'?'active':''}" data-type="${t.id}">${t.label}</button>`).join('')}
        </div>
        <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:var(--space-5);" id="highlight-grid"></div>
      </div>
    </div>`;

  const grid = container.querySelector('#highlight-grid');
  render();

  container.querySelector('#highlight-filters').addEventListener('click', e => {
    const btn = e.target.closest('[data-type]');
    if (!btn) return;
    cat = btn.dataset.type;
    container.querySelectorAll('.filter-chip').forEach(b => b.classList.toggle('active', b.dataset.type === cat));
    render();
  });
}

export function unmountHighlights() {
  _closePlayer();
}



