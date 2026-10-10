import { login, signup, loginGuest, resetPassword } from '../services/auth.js';

let _modalWrapper = null;
let _mode = 'login'; // 'login', 'signup', 'forgot'

export function showAuthModal(initialMode = 'login') {
  if (document.getElementById('auth-modal-wrapper')) return;
  
  _mode = initialMode;
  _modalWrapper = document.createElement('div');
  _modalWrapper.id = 'auth-modal-wrapper';
  _modalWrapper.className = 'modal-overlay';
  _modalWrapper.style.display = 'flex';
  
  _render();
  document.body.appendChild(_modalWrapper);
  
  // Trigger animation
  requestAnimationFrame(() => {
    _modalWrapper.classList.add('open');
  });
  
  // Close on overlay click
  _modalWrapper.addEventListener('click', (e) => {
    if (e.target === _modalWrapper) closeAuthModal();
  });
}

export function closeAuthModal() {
  if (_modalWrapper) {
    _modalWrapper.classList.remove('open');
    setTimeout(() => {
      if (_modalWrapper) {
        _modalWrapper.remove();
        _modalWrapper = null;
      }
    }, 300);
  }
}

function _render() {
  if (!_modalWrapper) return;
  
  const isLogin = _mode === 'login';
  const isSignup = _mode === 'signup';
  const isForgot = _mode === 'forgot';
  
  let title = 'เข้าสู่ระบบ';
  let submitText = 'เข้าสู่ระบบ';
  if (isSignup) { title = 'สร้างบัญชีใหม่'; submitText = 'สมัครสมาชิก'; }
  if (isForgot) { title = 'ลืมรหัสผ่าน'; submitText = 'ส่งลิงก์รีเซ็ตรหัสผ่าน'; }
  
  _modalWrapper.innerHTML = `
    <div class="modal-panel" style="max-width:400px; padding:32px;">
      
      ${!isForgot ? `
        <div style="display:flex; gap:12px; margin-bottom:24px; background:rgba(0,0,0,0.2); padding:6px; border-radius:14px; border:1px solid rgba(255,255,255,0.05); box-shadow:inset 0 4px 10px rgba(0,0,0,0.5);">
          <button id="tab-login" class="auth-tab-btn ${isLogin ? 'active' : ''}">เข้าสู่ระบบ</button>
          <button id="tab-signup" class="auth-tab-btn ${isSignup ? 'active' : ''}">สมัครสมาชิก</button>
        </div>
      ` : `
        <h2 style="margin-bottom:8px; text-align:center; font-size:1.5rem;">${title}</h2>
        <p style="text-align:center; color:var(--text-2); font-size:0.9rem; margin-bottom:24px;">กรุณากรอกอีเมลที่ใช้สมัครสมาชิก เราจะส่งลิงก์สำหรับตั้งรหัสผ่านใหม่ไปให้คุณ</p>
      `}
      
      <form id="auth-form" style="display:flex; flex-direction:column; gap:16px;">
        <div>
          <label style="display:block; margin-bottom:8px; font-size:0.9rem; color:var(--text-2);">อีเมล</label>
          <input type="email" id="auth-email" required placeholder="your@email.com" 
                 style="width:100%; padding:12px; border-radius:8px; background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.1); color:#fff;">
        </div>
        
        ${!isForgot ? `
          <div>
            <div style="display:flex; justify-content:space-between; margin-bottom:8px;">
              <label style="display:block; font-size:0.9rem; color:var(--text-2);">รหัสผ่าน</label>
              ${isLogin ? `<button type="button" id="btn-forgot" style="background:none; border:none; color:var(--purple-light); font-size:0.85rem; cursor:pointer;">ลืมรหัสผ่าน?</button>` : ''}
            </div>
            <input type="password" id="auth-password" required minlength="6" placeholder="รหัสผ่าน 6 ตัวขึ้นไป"
                   style="width:100%; padding:12px; border-radius:8px; background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.1); color:#fff;">
          </div>
        ` : ''}
        
        <div id="auth-error" style="color:#ef4444; font-size:0.85rem; display:none; text-align:center; background:rgba(239,68,68,0.1); padding:8px; border-radius:8px;"></div>
        <div id="auth-success" style="color:#22c55e; font-size:0.85rem; display:none; text-align:center; background:rgba(34,197,94,0.1); padding:8px; border-radius:8px;"></div>
        
        <button type="submit" class="btn btn-primary btn-md" style="width:100%; justify-content:center; margin-top:8px;" id="auth-submit-btn">
          ${submitText}
        </button>
      </form>
      
      ${isForgot ? `
        <div style="text-align:center; margin-top:16px;">
          <button id="btn-back-login" style="background:none; border:none; color:var(--text-2); cursor:pointer; font-size:0.9rem; text-decoration:underline;">กลับไปเข้าสู่ระบบ</button>
        </div>
      ` : ''}
      
      ${!isForgot ? `
        <div style="display:flex; align-items:center; margin:24px 0; color:rgba(255,255,255,0.2);">
          <div style="flex:1; height:1px; background:currentColor;"></div>
          <span style="padding:0 12px; font-size:0.8rem;">หรือ</span>
          <div style="flex:1; height:1px; background:currentColor;"></div>
        </div>
        
        <button id="auth-guest-btn" class="btn btn-ghost btn-md" style="width:100%; justify-content:center; border:1px solid rgba(255,255,255,0.1);">
          เข้าใช้งานแบบไม่ระบุตัวตน (Guest)
        </button>
      ` : ''}
      
      <button id="auth-close-btn" style="position:absolute; top:16px; right:16px; background:none; border:none; color:var(--text-3); cursor:pointer; font-size:1.2rem; transition:color 0.2s;">✕</button>
    </div>
  `;
  
  // Attach events
  _modalWrapper.querySelector('#auth-close-btn').addEventListener('click', closeAuthModal);
  
  if (!isForgot) {
    _modalWrapper.querySelector('#tab-login').addEventListener('click', () => { _mode = 'login'; _render(); });
    _modalWrapper.querySelector('#tab-signup').addEventListener('click', () => { _mode = 'signup'; _render(); });
    
    if (isLogin) {
      _modalWrapper.querySelector('#btn-forgot').addEventListener('click', () => { _mode = 'forgot'; _render(); });
    }
    
    _modalWrapper.querySelector('#auth-guest-btn').addEventListener('click', async () => {
      try {
        const btn = _modalWrapper.querySelector('#auth-guest-btn');
        btn.textContent = 'กำลังเข้าสู่ระบบ...';
        btn.disabled = true;
        await loginGuest();
        closeAuthModal();
      } catch (err) {
        let msg = err.message;
        if (err.code === 'auth/operation-not-allowed') {
          msg = 'ระบบยังไม่เปิดให้เข้าใช้งานแบบ Guest กรุณาเปิดใช้งาน Anonymous Auth ใน Firebase Console';
        }
        _showError(msg);
        const btn = _modalWrapper.querySelector('#auth-guest-btn');
        if(btn) { btn.textContent = 'เข้าใช้งานแบบไม่ระบุตัวตน (Guest)'; btn.disabled = false; }
      }
    });
  } else {
    _modalWrapper.querySelector('#btn-back-login').addEventListener('click', () => { _mode = 'login'; _render(); });
  }
  
  _modalWrapper.querySelector('#auth-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('auth-email').value;
    let pass = '';
    if (!isForgot) pass = document.getElementById('auth-password').value;
    
    const btn = document.getElementById('auth-submit-btn');
    
    try {
      btn.textContent = 'กำลังดำเนินการ...';
      btn.disabled = true;
      _showError('');
      _showSuccess('');
      
      if (_mode === 'login') {
        await login(email, pass);
        closeAuthModal();
      } else if (_mode === 'signup') {
        await signup(email, pass);
        closeAuthModal();
      } else if (_mode === 'forgot') {
        await resetPassword(email);
        _showSuccess('ส่งลิงก์รีเซ็ตรหัสผ่านไปยังอีเมลของคุณเรียบร้อยแล้ว');
        btn.textContent = submitText;
        btn.disabled = false;
      }
    } catch (err) {
      console.error("[Auth Error]", err);
      let msg = err.message;
      if (err.code === 'auth/invalid-credential') msg = 'อีเมลหรือรหัสผ่านไม่ถูกต้อง';
      else if (err.code === 'auth/email-already-in-use') msg = 'อีเมลนี้มีผู้ใช้งานแล้ว';
      else if (err.code === 'auth/weak-password') msg = 'รหัสผ่านอ่อนเกินไป ต้องมีอย่างน้อย 6 ตัวอักษร';
      
      _showError(msg);
      btn.textContent = submitText;
      btn.disabled = false;
    }
  });
}

function _showError(msg) {
  const errEl = _modalWrapper?.querySelector('#auth-error');
  if (errEl) {
    errEl.textContent = msg;
    errEl.style.display = msg ? 'block' : 'none';
  }
}

function _showSuccess(msg) {
  const el = _modalWrapper?.querySelector('#auth-success');
  if (el) {
    el.textContent = msg;
    el.style.display = msg ? 'block' : 'none';
  }
}
