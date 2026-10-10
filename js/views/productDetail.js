/** Product Detail View */
import { navigate } from '../router.js';

const ALL_PRODUCTS = {
  p1: { name:'CONAN CT-P10', series:'Conan', category:'box', price:3200, status:'available', emoji:'🎁', packs:'18 PACKS / BOX', desc:'กล่องการ์ดโคนัน CT-P10 รุ่นล่าสุด มีทั้งหมด 18 แพ็คต่อกล่อง แต่ละแพ็คมี 5 ใบ มีโอกาสได้การ์ดสุดหายาก SSR / MR / BP / CP / QR' },
  p2: { name:'CONAN CT-P09', series:'Conan', category:'box', price:2800, status:'available', emoji:'📦', packs:'18 PACKS / BOX', desc:'กล่องการ์ดโคนัน CT-P09' },
  p3: { name:'Conan SSR — Shinichi', series:'Conan', category:'card', price:890, status:'available', emoji:'✨', rarity:'SSR', desc:'การ์ด SSR ชินอิจิ คุโด้ หายาก' },
};

export async function mountProductDetail(container, id) {
  window.navigate = navigate;
  const p = ALL_PRODUCTS[id];
  if (!p) {
    container.innerHTML = `<div class="empty-state section"><div class="empty-icon">🔍</div><div class="empty-title">ไม่พบสินค้า</div><button class="btn btn-primary btn-md" onclick="navigate('/shop')" style="margin-top:24px;">กลับร้านค้า</button></div>`;
    return;
  }
  container.innerHTML = `
    <div style="padding-top:var(--space-12);padding-bottom:var(--space-16);">
      <div class="container">
        <button class="btn btn-ghost btn-sm" onclick="history.back()" style="margin-bottom:var(--space-6);">← ย้อนกลับ</button>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:var(--space-12);align-items:start;">
          <div style="background:var(--bg-elevated);border:1px solid var(--glass-border);border-radius:var(--r-2xl);aspect-ratio:1;display:flex;align-items:center;justify-content:center;font-size:8rem;overflow:hidden;padding:var(--space-4);">
            ${p.image ? `<img src="${p.image}" alt="${p.name}" style="max-width:100%; max-height:100%; object-fit:contain; border-radius:var(--r-xl);">` : p.emoji}
          </div>
          <div>
            <div class="product-series">${p.series}</div>
            <h1 style="font-size:var(--text-3xl);font-weight:900;margin-bottom:var(--space-3);">${p.name}</h1>
            ${p.rarity ? `<span class="rarity rarity-${p.rarity}" style="font-size:.9rem;padding:4px 14px;margin-bottom:var(--space-4);display:inline-block;">${p.rarity}</span>` : ''}
            ${p.packs ? `<div style="color:var(--text-3);font-size:var(--text-sm);margin-bottom:var(--space-5);">${p.packs}</div>` : ''}
            <p style="color:var(--text-2);line-height:1.8;margin-bottom:var(--space-6);">${p.desc}</p>
            <div style="font-size:2rem;font-weight:900;font-family:var(--font-en);color:var(--gold-light);margin-bottom:var(--space-6);">฿${p.price.toLocaleString()}</div>
            ${p.status === 'available'
    ? `<span class="badge badge-available" style="margin-bottom:var(--space-5);font-size:var(--text-sm);">พร้อมจำหน่าย</span>`
    : `<span class="badge badge-soldout" style="margin-bottom:var(--space-5);">สินค้าหมด</span>`}
            <div style="display:flex;gap:var(--space-3);margin-top:var(--space-4);flex-wrap:wrap;">
              <a href="https://line.me" target="_blank" rel="noopener" class="btn btn-primary btn-lg">💬 สั่งซื้อผ่าน LINE</a>
              <button class="btn btn-outline btn-lg" data-route="/shop">← ดูสินค้าอื่น</button>
            </div>
          </div>
        </div>
      </div>
    </div>`;

  container.addEventListener('click', e => {
    const btn = e.target.closest('[data-route]');
    if (btn) navigate(btn.dataset.route);
  });
}
export function unmountProductDetail() {}
