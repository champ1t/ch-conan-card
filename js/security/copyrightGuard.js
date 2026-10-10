/**
 * ═════════════════════════════════════════════════════════════════════
 * COPYRIGHT & SECURITY GUARD — CH.จุ่มการ์ดโคนัน
 * All Rights Reserved © 2026 CH.จุ่มการ์ดโคนัน (Owner: champ1t)
 * Master Security Password: 11151415
 * ═════════════════════════════════════════════════════════════════════
 */

const MASTER_PASSWORD_HASH = '11151415';
const STORAGE_KEY = 'ch_conan_unlocked';

// รายชื่อโดเมนที่ได้รับอนุญาตให้รันเว็บนี้อย่างเป็นทางการ
const AUTHORIZED_HOSTS = [
  'website-c790b.web.app',
  'website-c790b.firebaseapp.com',
  'conancard.com',
  'localhost',
  '127.0.0.1'
];

export function initCopyrightGuard() {
  injectCopyrightStyles();
  preventAssetStealing();
  checkAuthorization();
  injectWatermarkBadge();
}

/**
 * ตรวจสอบความถูกต้องของโดเมน หรือการปลดล็อกด้วยรหัสผ่าน
 */
function checkAuthorization() {
  const currentHost = window.location.hostname.toLowerCase();
  const isAuthorizedHost = AUTHORIZED_HOSTS.some(host => currentHost.endsWith(host));
  const isUnlocked = sessionStorage.getItem(STORAGE_KEY) === 'true' || localStorage.getItem(STORAGE_KEY) === 'true';

  // ถ้าเป็นโดเมนที่ไม่ได้รับอนุญาต หรือถูกขโมยโค้ดไปรันที่อื่น
  if (!isAuthorizedHost && !isUnlocked) {
    showPasswordLockModal();
  }
}

/**
 * แสดงหน้าจอล็อกและให้ใส่รหัสผ่าน 11151415
 */
function showPasswordLockModal() {
  const overlay = document.createElement('div');
  overlay.id = 'ch-security-lock';
  overlay.innerHTML = `
    <div class="ch-lock-box">
      <div class="ch-lock-shield">🛡️</div>
      <div class="ch-lock-brand">CH.จุ่มการ์ดโคนัน</div>
      <h2 class="ch-lock-title">SYSTEM COPYRIGHT PROTECTED</h2>
      <p class="ch-lock-desc">
        เว็บไซต์และระบบนี้เป็นลิขสิทธิ์ทางปัญญาเฉพาะของ <strong>CH.จุ่มการ์ดโคนัน</strong><br>
        ตรวจพบการเปิดใช้งานนอกโดเมนที่ได้รับอนุญาต กรุณากรอกรหัสผ่านเจ้าของระบบเพื่อเข้าใช้งาน
      </p>

      <form id="ch-lock-form" class="ch-lock-form">
        <div class="ch-input-wrapper">
          <input type="password" id="ch-lock-pass" placeholder="กรอก Master Password" required autofocus autocomplete="off" />
        </div>
        <button type="submit" class="ch-lock-btn">ปลดล็อกเข้าสู่ระบบ</button>
        <div id="ch-lock-error" class="ch-lock-error" style="display:none;">รหัสผ่านไม่ถูกต้อง!</div>
      </form>

      <div class="ch-lock-footer">
        © 2026 CH.จุ่มการ์ดโคนัน (Owner: champ1t) • All Rights Reserved
      </div>
    </div>
  `;

  document.body.appendChild(overlay);
  document.body.classList.add('ch-locked');

  const form = overlay.querySelector('#ch-lock-form');
  const input = overlay.querySelector('#ch-lock-pass');
  const errEl = overlay.querySelector('#ch-lock-error');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (input.value === MASTER_PASSWORD_HASH) {
      sessionStorage.setItem(STORAGE_KEY, 'true');
      overlay.style.opacity = '0';
      overlay.style.transition = 'opacity 0.4s ease';
      setTimeout(() => {
        overlay.remove();
        document.body.classList.remove('ch-locked');
      }, 400);
    } else {
      errEl.style.display = 'block';
      input.value = '';
      input.focus();
    }
  });
}

/**
 * ป้องกันการคลิกขวาเซฟรูป และลากรูปการ์ดไปใช้
 */
function preventAssetStealing() {
  // ปิด Context Menu คลิกขวาที่รูปภาพ
  document.addEventListener('contextmenu', (e) => {
    if (e.target.tagName === 'IMG' || e.target.closest('.tcg-holo-card, .tcg-pack-wrapper')) {
      e.preventDefault();
    }
  }, false);

  // ป้องกันการ Drag รูปภาพ
  document.addEventListener('dragstart', (e) => {
    if (e.target.tagName === 'IMG') {
      e.preventDefault();
    }
  }, false);
}

/**
 * ติดลายน้ำลิขสิทธิ์ประจำตัวเจ้าของระบบ
 */
function injectWatermarkBadge() {
  const badge = document.createElement('div');
  badge.id = 'ch-copyright-watermark';
  badge.innerHTML = `
    <span class="ch-wm-dot"></span>
    <span>CH.จุ่มการ์ดโคนัน © 2026</span>
  `;
  badge.title = "CH.จุ่มการ์ดโคนัน — Official Proprietary System (champ1t)";
  document.body.appendChild(badge);
}

/**
 * สไตล์สำหรับระบบความปลอดภัยและลายน้ำ
 */
function injectCopyrightStyles() {
  const style = document.createElement('style');
  style.id = 'ch-copyright-styles';
  style.textContent = `
    /* Copyright Watermark Badge */
    #ch-copyright-watermark {
      position: fixed;
      bottom: 12px;
      left: 14px;
      z-index: 99999;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 5px 12px;
      background: rgba(10, 10, 20, 0.75);
      border: 1px solid rgba(255, 255, 255, 0.12);
      border-radius: 999px;
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
      font-size: 0.7rem;
      font-weight: 600;
      letter-spacing: 0.5px;
      color: rgba(255, 255, 255, 0.45);
      pointer-events: none;
      user-select: none;
      transition: opacity 0.3s ease;
    }
    #ch-copyright-watermark .ch-wm-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: #a855f7;
      box-shadow: 0 0 6px #a855f7;
    }

    /* Protection Lock Overlay */
    body.ch-locked {
      overflow: hidden !important;
    }
    #ch-security-lock {
      position: fixed;
      inset: 0;
      background: radial-gradient(circle at center, #131127 0%, #06050c 100%);
      z-index: 999999999;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Sarabun", sans-serif;
    }
    .ch-lock-box {
      width: 100%;
      max-width: 440px;
      background: rgba(18, 16, 36, 0.85);
      border: 1px solid rgba(168, 85, 247, 0.3);
      box-shadow: 0 20px 50px rgba(0, 0, 0, 0.8), 0 0 40px rgba(168, 85, 247, 0.15);
      border-radius: 20px;
      padding: 36px 30px;
      text-align: center;
      backdrop-filter: blur(20px);
      color: #fff;
    }
    .ch-lock-shield {
      font-size: 3rem;
      margin-bottom: 12px;
      filter: drop-shadow(0 0 15px rgba(168, 85, 247, 0.5));
    }
    .ch-lock-brand {
      font-size: 0.85rem;
      letter-spacing: 2px;
      text-transform: uppercase;
      color: #c084fc;
      font-weight: 700;
      margin-bottom: 6px;
    }
    .ch-lock-title {
      font-size: 1.25rem;
      font-weight: 800;
      letter-spacing: 1px;
      margin: 0 0 12px 0;
      color: #f8fafc;
    }
    .ch-lock-desc {
      font-size: 0.85rem;
      color: rgba(255, 255, 255, 0.7);
      line-height: 1.6;
      margin-bottom: 24px;
    }
    .ch-lock-desc strong {
      color: #facc15;
    }
    .ch-lock-form {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .ch-input-wrapper input {
      width: 100%;
      padding: 14px 18px;
      border-radius: 12px;
      border: 1px solid rgba(255, 255, 255, 0.15);
      background: rgba(0, 0, 0, 0.4);
      color: #fff;
      font-size: 1rem;
      text-align: center;
      letter-spacing: 2px;
      outline: none;
      transition: border-color 0.2s;
    }
    .ch-input-wrapper input:focus {
      border-color: #a855f7;
      box-shadow: 0 0 15px rgba(168, 85, 247, 0.3);
    }
    .ch-lock-btn {
      padding: 14px;
      border-radius: 12px;
      background: linear-gradient(135deg, #9333ea, #6366f1);
      border: none;
      color: #fff;
      font-size: 0.95rem;
      font-weight: 700;
      cursor: pointer;
      box-shadow: 0 4px 15px rgba(147, 51, 234, 0.4);
      transition: transform 0.2s, box-shadow 0.2s;
    }
    .ch-lock-btn:hover {
      transform: translateY(-1px);
      box-shadow: 0 6px 20px rgba(147, 51, 234, 0.6);
    }
    .ch-lock-error {
      color: #f87171;
      font-size: 0.82rem;
      margin-top: 6px;
      font-weight: 600;
    }
    .ch-lock-footer {
      margin-top: 24px;
      font-size: 0.7rem;
      color: rgba(255, 255, 255, 0.35);
      letter-spacing: 0.5px;
    }
  `;
  document.head.appendChild(style);
}
