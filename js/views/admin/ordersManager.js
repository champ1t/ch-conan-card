import { db, COLLECTIONS } from '../../config/firebase.js';
import { collection, addDoc, getDocs, deleteDoc, doc, query, orderBy, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

export function renderOrdersUI() {
  return `
    <div>
      <h2 style="font-size:var(--text-2xl);font-weight:900;margin-bottom:var(--space-6);">📋 จัดการระบบติดตามพัสดุ</h2>
      
      <!-- Add Order Form -->
      <div style="background:var(--glass-bg);border:1px solid var(--glass-border);padding:var(--space-6);border-radius:var(--r-xl);margin-bottom:var(--space-6);">
        <h3 style="font-size:var(--text-lg);font-weight:700;margin-bottom:var(--space-4);">เพิ่มข้อมูลพัสดุใหม่</h3>
        <form id="admin-add-order-form" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:var(--space-4);align-items:end;">
          <div>
            <label class="form-label">ชื่อลูกค้า</label>
            <input type="text" id="ao-name" class="form-input" required placeholder="เช่น คุณสมชาย">
          </div>
          <div>
            <label class="form-label">เบอร์โทรศัพท์ (ใช้ค้นหา)</label>
            <input type="text" id="ao-phone" class="form-input" required placeholder="เช่น 0812345678">
          </div>
          <div>
            <label class="form-label">ขนส่ง</label>
            <select id="ao-courier" class="form-input" required>
              <option value="flash">Flash Express ⚡️</option>
              <option value="thaipost">ไปรษณีย์ไทย 📮</option>
            </select>
          </div>
          <div>
            <label class="form-label">เลขพัสดุ (Tracking)</label>
            <input type="text" id="ao-tracking" class="form-input" required placeholder="เช่น TH123456789">
          </div>
          <div>
            <button type="submit" class="btn btn-primary btn-block">บันทึกข้อมูล</button>
          </div>
        </form>
      </div>

      <!-- Orders Table -->
      <div class="admin-table-wrap">
        <table class="admin-table">
          <thead>
            <tr>
              <th>ชื่อลูกค้า</th>
              <th>เบอร์โทร</th>
              <th>ขนส่ง</th>
              <th>เลขพัสดุ</th>
              <th>สถานะ</th>
              <th>วันที่เพิ่ม</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody id="admin-orders-tbody">
            <tr><td colspan="7" style="text-align:center;padding:var(--space-6);color:var(--text-3);">กำลังโหลดข้อมูล...</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  `;
}

export async function loadOrdersData(container) {
  const tbody = container.querySelector('#admin-orders-tbody');
  if (!tbody) return;

  try {
    const q = query(collection(db, COLLECTIONS.ORDERS), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    
    if (snapshot.empty) {
      tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;padding:var(--space-6);color:var(--text-3);">ไม่มีข้อมูลพัสดุ</td></tr>';
      return;
    }

    let html = '';
    snapshot.forEach(docSnap => {
      const d = docSnap.data();
      const dateStr = d.createdAt ? new Date(d.createdAt.toMillis()).toLocaleString('th-TH', {dateStyle:'short', timeStyle:'short'}) : 'N/A';
      const courierBadge = d.courier === 'flash' 
        ? '<span class="badge badge-gold">Flash Express</span>' 
        : '<span class="badge badge-red">ไปรษณีย์ไทย</span>';
        
      html += `
        <tr>
          <td style="font-weight:700;">${d.customerName || '-'}</td>
          <td>${d.phone || '-'}</td>
          <td>${courierBadge}</td>
          <td style="font-family:var(--font-en);font-weight:700;color:var(--purple-light);">${d.tracking || '-'}</td>
          <td><span class="badge badge-blue">จัดส่งแล้ว</span></td>
          <td style="font-size:var(--text-sm);color:var(--text-3);">${dateStr}</td>
          <td>
            <button class="btn btn-sm btn-delete-order" data-id="${docSnap.id}" style="background:rgba(244,63,94,0.15);color:#fda4af;border:1px solid rgba(244,63,94,0.3);padding:4px 8px;border-radius:4px;cursor:pointer;">ลบ</button>
          </td>
        </tr>
      `;
    });
    tbody.innerHTML = html;

    // Attach delete events
    tbody.querySelectorAll('.btn-delete-order').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        if (!confirm('ยืนยันการลบข้อมูลพัสดุนี้?')) return;
        const id = e.target.dataset.id;
        await deleteDoc(doc(db, COLLECTIONS.ORDERS, id));
        loadOrdersData(container); // reload
      });
    });

  } catch (err) {
    console.error("Error loading orders:", err);
    tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;padding:var(--space-6);color:#fda4af;">เกิดข้อผิดพลาดในการโหลดข้อมูล</td></tr>';
  }
}

export function bindOrdersEvents(container) {
  const form = container.querySelector('#admin-add-order-form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    const originalText = btn.textContent;
    btn.textContent = 'กำลังบันทึก...';
    btn.disabled = true;

    try {
      const data = {
        customerName: document.getElementById('ao-name').value.trim(),
        phone: document.getElementById('ao-phone').value.trim(),
        courier: document.getElementById('ao-courier').value,
        tracking: document.getElementById('ao-tracking').value.trim(),
        status: 'shipped',
        createdAt: serverTimestamp()
      };

      await addDoc(collection(db, COLLECTIONS.ORDERS), data);
      
      form.reset();
      loadOrdersData(container);
    } catch (err) {
      console.error("Error adding order:", err);
      alert("เกิดข้อผิดพลาด: " + err.message);
    } finally {
      btn.textContent = originalText;
      btn.disabled = false;
    }
  });
}
