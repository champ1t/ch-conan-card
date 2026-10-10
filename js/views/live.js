/** Live View — CH.จุ่มการ์ดโคนัน */
import { navigate } from '../router.js';
import { t } from '../i18n.js';

const DROP_URL = 'https://conancard-3f557.web.app/';
const FB_URL   = 'https://www.facebook.com/profile.php?id=100075963494534&locale=th_TH';

const SESSIONS = [
  { id:'l1', title:'จุ่มการ์ดโคนัน CT-P10 Drop #021', date:'28 ก.ค. 2568', viewers:'1,248', emoji:'📺', duration:'2:14:30' },
  { id:'l2', title:'เปิดกล่อง CONAN CT-P09 ทั้งกล่อง!', date:'20 ก.ค. 2568', viewers:'987', emoji:'🎥', duration:'1:45:12' },
  { id:'l3', title:'Rare Pull SSR ทุกซอง!! CT-P08', date:'15 ก.ค. 2568', viewers:'2,105', emoji:'🎞', duration:'3:02:00' },
  { id:'l4', title:'Drop #018 Live เปิดพร้อมกัน', date:'8 ก.ค. 2568', viewers:'1,560', emoji:'📡', duration:'2:30:00' },
  { id:'l5', title:'CT-P07 กล่องพิเศษ Unboxing', date:'1 ก.ค. 2568', viewers:'820', emoji:'📹', duration:'1:20:00' },
];

export async function mountLive(container) {
  window.navigate = navigate;
  container.innerHTML = `
    <div style="padding-top:var(--space-12);padding-bottom:var(--space-16);">
      <div class="container">
        <div style="margin-bottom:var(--space-10);">
          <div class="section-eyebrow">LIVE</div>
          <h1 class="section-title-th">ไลฟ์สดและอาร์ไคฟ์</h1>
        </div>

        <!-- Live Now Card -->
        <div style="background:var(--glass-bg);border:1px solid rgba(244,63,94,.25);border-radius:var(--r-2xl);padding:var(--space-10);text-align:center;margin-bottom:var(--space-10);position:relative;overflow:hidden;">
          <div style="position:absolute;inset:0;background:radial-gradient(ellipse at center,rgba(244,63,94,.08),transparent 70%);pointer-events:none;"></div>
          <div class="live-indicator" style="margin:0 auto var(--space-4);">
            <div class="dot" style="width:12px;height:12px;border-radius:50%;background:#f43f5e;margin:0 auto;"></div>
          </div>
          <h2 style="font-size:var(--text-2xl);font-weight:900;margin-bottom:var(--space-3);">ยังไม่มี Live ขณะนี้</h2>
          <p style="color:var(--text-3);margin-bottom:var(--space-6);">
            ติดตาม Live เปิดการ์ดสดทุกสัปดาห์บน Facebook<br>
            กดเพื่อเข้าชมหน้า Facebook ของร้านได้เลย
          </p>
          <div style="display:flex;gap:var(--space-4);justify-content:center;flex-wrap:wrap;">
            <a href="${FB_URL}" target="_blank" rel="noopener noreferrer" class="btn btn-live btn-lg">
              📘 Facebook Live
            </a>
            <a href="${DROP_URL}" target="_blank" rel="noopener noreferrer" class="btn btn-outline btn-lg">
              ${t('live_join_drop')}
            </a>
          </div>
        </div>

        <!-- Archive -->
        <div class="section-header" style="margin-bottom:var(--space-6);">
          <div>
            <div class="section-eyebrow">ARCHIVE</div>
            <h2 class="section-title-th" style="font-size:var(--text-2xl);">Live ที่ผ่านมา</h2>
          </div>
          <a href="${FB_URL}" target="_blank" rel="noopener noreferrer" class="btn btn-outline btn-sm">
            ดูเพิ่มเติม →
          </a>
        </div>
        <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:var(--space-5);">
          ${SESSIONS.map(s => `
            <a href="${FB_URL}" target="_blank" rel="noopener noreferrer"
               class="video-card" style="text-decoration:none;" aria-label="${s.title}">
              <div class="video-thumb">${s.emoji}<div class="video-play-btn">▶</div></div>
              <div class="video-card-body">
                <div style="font-weight:700;font-size:var(--text-sm);margin-bottom:6px;">${s.title}</div>
                <div class="video-meta">
                  <span>${s.date}</span>
                  <span>👁 ${s.viewers}</span>
                  <span>⏱ ${s.duration}</span>
                </div>
              </div>
            </a>
          `).join('')}
        </div>
      </div>
    </div>`;
}

export function unmountLive() {}
