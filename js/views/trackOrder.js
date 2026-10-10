/** Track Order View */
import { navigate } from '../router.js';
import { db, COLLECTIONS } from '../config/firebase.js';
import { collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

export async function mountTrack(container) {
  window.navigate = navigate;
  let mode = 'phone'; // 'phone' or 'tracking'

  container.innerHTML = `
    <div style="padding-top:var(--space-12);padding-bottom:var(--space-16);">
      <div class="container-md">
        <div style="text-align:center;margin-bottom:var(--space-12);">
          <div class="section-eyebrow" style="justify-content:center;display:flex;">TRACK ORDER</div>
          <h1 class="section-title-th">ติดตามคำสั่งซื้อ</h1>
          <p style="color:var(--text-3);margin-top:var(--space-3);">ค้นหาด้วยเบอร์โทรหรือ Tracking Number ไม่ต้องสมัครสมาชิก</p>
        </div>

        <div class="track-widget" style="background:var(--glass-bg);border:1px solid var(--glass-border);border-radius:var(--r-2xl);padding:var(--space-8);">
          <div class="tab-bar" id="track-tabs" style="margin-bottom:var(--space-6);">
            <button class="tab-btn active" data-tab="phone">📱 เบอร์โทรศัพท์</button>
            <button class="tab-btn" data-tab="tracking">📦 Tracking Number</button>
          </div>
          <div class="form-group">
            <label class="form-label" id="track-label">เบอร์โทรศัพท์</label>
            <div class="input-wrap">
              <span class="input-icon" id="track-icon">📱</span>
              <input id="track-input" type="text" class="form-input" placeholder="เช่น 0812345678" />
            </div>
          </div>
          <button class="btn btn-primary btn-lg btn-block" id="track-btn">🔍 ค้นหา</button>
          <div id="track-result" style="margin-top:var(--space-6);"></div>
        </div>
      </div>
    </div>`;

  // Tab switch
  container.querySelector('#track-tabs').addEventListener('click', e => {
    const btn = e.target.closest('[data-tab]');
    if (!btn) return;
    mode = btn.dataset.tab;
    container.querySelectorAll('.tab-btn').forEach(b => b.classList.toggle('active', b.dataset.tab === mode));
    const input = container.querySelector('#track-input');
    const icon  = container.querySelector('#track-icon');
    const label = container.querySelector('#track-label');
    if (mode === 'phone') {
      input.placeholder = 'เช่น 0812345678';
      icon.textContent = '📱';
      label.textContent = 'เบอร์โทรศัพท์';
    } else {
      input.placeholder = 'เช่น TH123456789TH';
      icon.textContent = '📦';
      label.textContent = 'Tracking Number';
    }
    input.value = '';
    container.querySelector('#track-result').innerHTML = '';
  });

  // Search
  const doSearch = async () => {
    const val = container.querySelector('#track-input').value.trim();
    const resultEl = container.querySelector('#track-result');
    if (!val) {
      resultEl.innerHTML = `<div style="color:#fda4af;font-size:var(--text-sm);">กรุณากรอกข้อมูลก่อนค้นหา</div>`;
      return;
    }

    resultEl.innerHTML = `<div style="text-align:center;padding:var(--space-6) 0;"><div class="spinner spinner-lg" style="margin:0 auto;"></div><div style="margin-top:12px;color:var(--text-3);font-size:var(--text-sm);">กำลังค้นหา...</div></div>`;

    try {
      // Query Firebase
      const field = mode === 'phone' ? 'phone' : 'tracking';
      const q = query(collection(db, COLLECTIONS.ORDERS), where(field, '==', val));
      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        resultEl.innerHTML = `
          <div style="text-align:center;padding:var(--space-6) 0;color:var(--text-3);">
            <div style="font-size:2.5rem;margin-bottom:12px;">🔍</div>
            <div style="font-weight:700;margin-bottom:8px;color:var(--text-2);">ไม่พบข้อมูลพัสดุ</div>
            <div style="font-size:var(--text-sm);">ตรวจสอบความถูกต้องของ ${mode === 'phone' ? 'เบอร์โทรศัพท์' : 'เลขพัสดุ'} อีกครั้ง</div>
          </div>`;
        return;
      }

      let html = '';
      snapshot.forEach(docSnap => {
        html += _orderHTML(docSnap.id, docSnap.data());
      });
      resultEl.innerHTML = html;

    } catch (err) {
      console.error("Search Error:", err);
      resultEl.innerHTML = `<div style="text-align:center;color:#fda4af;padding:var(--space-4);">เกิดข้อผิดพลาดในการเชื่อมต่อ กรุณาลองใหม่</div>`;
    }
  };

  container.querySelector('#track-btn').addEventListener('click', doSearch);
  container.querySelector('#track-input').addEventListener('keydown', e => { if (e.key === 'Enter') doSearch(); });
}

export function unmountTrack() {}

function _orderHTML(docId, o) {
  let trackUrl = '#';
  let trackName = o.courier === 'flash' ? 'Flash Express' : 'ไปรษณีย์ไทย';
  if (o.tracking) {
    if (o.courier === 'flash') trackUrl = `https://flashexpress.com/fle/tracking?se=${o.tracking}`;
    if (o.courier === 'thaipost') trackUrl = `https://track.thailandpost.co.th/?trackNumber=${o.tracking}`;
  }

  const dateStr = o.createdAt ? new Date(o.createdAt.toMillis()).toLocaleString('th-TH') : '';

  return `
    <div style="border:1px solid var(--glass-border);border-radius:var(--r-xl);overflow:hidden;margin-bottom:var(--space-5);">
      <div style="padding:var(--space-4) var(--space-5);background:rgba(124,58,237,.08);border-bottom:1px solid var(--glass-border);display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px;">
        <div>
          <div style="font-family:var(--font-en);font-size:.72rem;color:var(--text-3);margin-bottom:2px;">ผู้รับพัสดุ</div>
          <div style="font-family:var(--font-en);font-weight:900;font-size:var(--text-lg);">${o.customerName || '-'}</div>
        </div>
        <div style="text-align:right;">
          <div style="font-size:.7rem;color:var(--text-3);">Tracking (${trackName})</div>
          <div style="font-family:var(--font-en);font-size:var(--text-sm);font-weight:700;color:var(--blue-light);">
            <a href="${trackUrl}" target="_blank" style="color:var(--blue-light);text-decoration:none;display:inline-flex;align-items:center;gap:4px;">
              ${o.tracking} <span style="font-size:10px;">↗</span>
            </a>
          </div>
        </div>
      </div>
      <div style="padding:var(--space-5);">
        <div style="font-size:var(--text-sm);color:var(--text-2);margin-bottom:var(--space-5);">
          วันที่เพิ่มข้อมูล: <strong style="color:var(--gold-light);">${dateStr}</strong>
        </div>
        <div class="timeline">
          <div class="timeline-step done">
            <div class="timeline-dot">✓</div>
            <div class="timeline-body">
              <div class="timeline-label" style="color:var(--green)">ยืนยันข้อมูล</div>
              <div class="timeline-date">${dateStr}</div>
            </div>
          </div>
          <div class="timeline-step active">
            <div class="timeline-dot">◎</div>
            <div class="timeline-body">
              <div class="timeline-label" style="color:var(--purple-light)">จัดส่งแล้วโดย ${trackName}</div>
              <div class="timeline-date">คลิกที่เลขพัสดุด้านบนเพื่อตรวจสอบสถานะการจัดส่งจริง</div>
            </div>
          </div>
        </div>
      </div>
    </div>`;
}
