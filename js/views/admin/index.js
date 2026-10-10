/**
 * Admin Panel — CH.จุ่มการ์ดโคนัน
 * Login → Dashboard with tabs: Products, Orders, Live, Highlights, Customers
 */
import { navigate } from '../../router.js';

// Mock admin data
const MOCK_STATS = {
  totalOrders: 127,
  totalRevenue: '฿284,500',
  totalProducts: 48,
  totalCustomers: 89,
};
const MOCK_ORDERS = [
  { id:'CL-000127', customer:'คุณอรอุษา', phone:'0812345678', items:'CT-P10 x1', price:'฿3,200', status:'shipped',   date:'28 ก.ค. 68' },
  { id:'CL-000126', customer:'คุณวรวุฒิ',  phone:'0898765432', items:'CT-P09 x2', price:'฿5,600', status:'packed',    date:'27 ก.ค. 68' },
  { id:'CL-000125', customer:'คุณนภัส',    phone:'0871234567', items:'SSR Card x3',price:'฿2,670', status:'confirmed', date:'27 ก.ค. 68' },
  { id:'CL-000124', customer:'คุณธนพล',    phone:'0623456789', items:'CT-P10 x1', price:'฿3,200', status:'delivered', date:'25 ก.ค. 68' },
];
const MOCK_PRODUCTS = [
  { id:'p1', name:'CONAN CT-P10', category:'box',  price:'฿3,200', status:'available', stock:12 },
  { id:'p2', name:'CONAN CT-P09', category:'box',  price:'฿2,800', status:'available', stock:5  },
  { id:'p3', name:'Conan SSR Card', category:'card', price:'฿890',  status:'available', stock:8  },
  { id:'p4', name:'CT-P10 Pack',  category:'pack', price:'฿180',   status:'available', stock:54 },
];

const TABS = [
  { id:'dashboard',  icon:'📊', label:'Dashboard' },
  { id:'products',   icon:'🛍', label:'Products' },
  { id:'orders',     icon:'📋', label:'Orders' },
  { id:'live',       icon:'📺', label:'Live' },
  { id:'highlights', icon:'⭐', label:'Highlights' },
  { id:'customers',  icon:'👥', label:'Customers' },
];

let _tab = 'dashboard';

export function mountAdmin(container, initialTab = 'dashboard') {
  window.navigate = navigate;
  _tab = initialTab;
  _render(container);
}

export function unmountAdmin() {}

function _render(container) {
  _renderShell(container);
}

/* ── Login ─────────────────────────────────────────────────── */
function _renderLogin(container) {
  container.innerHTML = `
    <div class="admin-login-wrap">
      <div class="admin-login-card">
        <div style="text-align:center;margin-bottom:var(--space-8);">
          <div style="font-size:3rem;margin-bottom:var(--space-3);">🔐</div>
          <h1 style="font-size:var(--text-2xl);font-weight:900;margin-bottom:4px;">Admin Panel</h1>
          <div style="color:var(--text-3);font-size:var(--text-sm);">CH.จุ่มการ์ดโคนัน</div>
        </div>
        <button class="btn btn-primary btn-lg btn-block" id="admin-login-btn">เข้าสู่ระบบ Admin</button>
      </div>
    </div>`;

  container.querySelector('#admin-login-btn').addEventListener('click', () => {
    sessionStorage.setItem('cl_admin', '1');
    _isLoggedIn = true;
    _renderShell(container);
  });
}

/* ── Admin Shell ───────────────────────────────────────────── */
function _renderShell(container) {
  container.innerHTML = `
    <div class="admin-shell">
      <!-- Sidebar -->
      <aside class="admin-sidebar">
        <div class="admin-sidebar-title">Admin Menu</div>
        ${TABS.map(t => `
          <button class="admin-nav-item ${t.id === _tab ? 'active' : ''}" data-tab="${t.id}">
            ${t.icon} ${t.label}
          </button>
        `).join('')}
        <div style="margin-top:auto;padding-top:var(--space-8);">
          <button class="admin-nav-item" id="admin-logout-btn">🚪 Logout</button>
        </div>
      </aside>
      <!-- Content -->
      <div class="admin-content" id="admin-content">
        ${_renderTabContent(_tab)}
      </div>
    </div>`;

  _postRenderTab(_tab, container);

  // Tab navigation
  container.querySelectorAll('[data-tab]').forEach(btn => {
    btn.addEventListener('click', () => {
      _tab = btn.dataset.tab;
      container.querySelectorAll('[data-tab]').forEach(b => b.classList.toggle('active', b.dataset.tab === _tab));
      container.querySelector('#admin-content').innerHTML = _renderTabContent(_tab);
      _postRenderTab(_tab, container);
    });
  });

  // Logout
  container.querySelector('#admin-logout-btn').addEventListener('click', () => {
    sessionStorage.removeItem('cl_admin');
    navigate('/');
  });
}

function _postRenderTab(tab, container) {
  if (tab === 'orders') {
    bindOrdersEvents(container);
    loadOrdersData(container);
  }
}

function _renderTabContent(tab) {
  switch (tab) {
    case 'dashboard':  return _dashboardHTML();
    case 'products':   return _productsHTML();
    case 'orders':     return _ordersHTML();
    case 'live':       return _liveHTML();
    case 'highlights': return _highlightsHTML();
    case 'customers':  return _customersHTML();
    default: return `<div class="empty-state"><div class="empty-title">${tab}</div></div>`;
  }
}

/* ── Dashboard ─────────────────────────────────────────────── */
function _dashboardHTML() {
  const statColors = ['var(--purple-light)','var(--gold-light)','var(--blue-light)','var(--green)'];
  const stats = [
    { label:'Orders ทั้งหมด', num: MOCK_STATS.totalOrders, icon:'📋' },
    { label:'รายได้รวม',      num: MOCK_STATS.totalRevenue, icon:'💰' },
    { label:'สินค้าทั้งหมด', num: MOCK_STATS.totalProducts, icon:'🛍' },
    { label:'ลูกค้าทั้งหมด', num: MOCK_STATS.totalCustomers, icon:'👥' },
  ];
  return `
    <div>
      <h2 style="font-size:var(--text-2xl);font-weight:900;margin-bottom:var(--space-6);">📊 Dashboard</h2>
      <div class="admin-stat-grid">
        ${stats.map((s,i) => `
          <div class="admin-stat-card">
            <div class="admin-stat-label">${s.icon} ${s.label}</div>
            <div class="admin-stat-num" style="color:${statColors[i]}">${s.num}</div>
          </div>
        `).join('')}
      </div>
      <h3 style="font-size:var(--text-lg);font-weight:700;margin-bottom:var(--space-4);">Orders ล่าสุด</h3>
      ${_orderTable(MOCK_ORDERS.slice(0,4))}
    </div>`;
}

/* ── Products ──────────────────────────────────────────────── */
function _productsHTML() {
  return `
    <div>
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:var(--space-6);flex-wrap:wrap;gap:12px;">
        <h2 style="font-size:var(--text-2xl);font-weight:900;">🛍 Products</h2>
        <button class="btn btn-primary btn-md">+ เพิ่มสินค้า</button>
      </div>
      <div class="admin-table-wrap">
        <table class="admin-table">
          <thead><tr><th>ชื่อสินค้า</th><th>Category</th><th>ราคา</th><th>Stock</th><th>สถานะ</th><th>Action</th></tr></thead>
          <tbody>
            ${MOCK_PRODUCTS.map(p => `
              <tr>
                <td style="font-weight:700;">${p.name}</td>
                <td><span class="badge badge-blue">${p.category}</span></td>
                <td style="color:var(--gold-light);font-weight:700;">${p.price}</td>
                <td>${p.stock} ชิ้น</td>
                <td><span class="badge badge-available">พร้อมขาย</span></td>
                <td>
                  <button class="btn btn-ghost btn-sm" style="padding:5px 12px;">✏️</button>
                  <button class="btn btn-ghost btn-sm" style="padding:5px 12px;color:#fda4af;">🗑</button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>`;
}

/* ── Orders ────────────────────────────────────────────────── */
import { renderOrdersUI, loadOrdersData, bindOrdersEvents } from './ordersManager.js';
function _ordersHTML() {
  return renderOrdersUI();
}

function _orderTable(orders) {
  const statusBadge = s => ({
    confirmed: `<span class="badge badge-blue">Confirmed</span>`,
    packed:    `<span class="badge badge-purple">Packed</span>`,
    shipped:   `<span class="badge badge-gold">Shipped</span>`,
    delivered: `<span class="badge badge-green">Delivered</span>`,
  }[s] || `<span class="badge badge-gray">${s}</span>`);

  return `
    <div class="admin-table-wrap">
      <table class="admin-table">
        <thead><tr><th>Order ID</th><th>ลูกค้า</th><th>สินค้า</th><th>ราคา</th><th>สถานะ</th><th>วันที่</th><th>Action</th></tr></thead>
        <tbody>
          ${orders.map(o => `
            <tr>
              <td style="font-family:var(--font-en);font-weight:700;color:var(--purple-light);">${o.id}</td>
              <td><div style="font-weight:700;">${o.customer}</div><div style="font-size:.72rem;color:var(--text-3);">${o.phone}</div></td>
              <td>${o.items}</td>
              <td style="color:var(--gold-light);font-weight:700;">${o.price}</td>
              <td>${statusBadge(o.status)}</td>
              <td style="font-size:var(--text-sm);color:var(--text-3);">${o.date}</td>
              <td>
                <select class="form-select" style="padding:5px 10px;font-size:.75rem;width:auto;">
                  <option value="confirmed" ${o.status==='confirmed'?'selected':''}>Confirmed</option>
                  <option value="packed" ${o.status==='packed'?'selected':''}>Packed</option>
                  <option value="shipped" ${o.status==='shipped'?'selected':''}>Shipped</option>
                  <option value="delivered" ${o.status==='delivered'?'selected':''}>Delivered</option>
                </select>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>`;
}

/* ── Live Admin ─────────────────────────────────────────────── */
function _liveHTML() {
  return `
    <div>
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:var(--space-6);flex-wrap:wrap;gap:12px;">
        <h2 style="font-size:var(--text-2xl);font-weight:900;">📺 Live Sessions</h2>
        <button class="btn btn-live btn-md">+ เพิ่ม Live</button>
      </div>
      <div class="empty-state" style="padding:var(--space-12) 0;">
        <div class="empty-icon">📺</div>
        <div class="empty-title">ยังไม่มีข้อมูล Live</div>
        <div class="empty-desc">กดปุ่ม "เพิ่ม Live" เพื่อเพิ่ม Live Session ใหม่</div>
      </div>
    </div>`;
}

/* ── Highlights Admin ───────────────────────────────────────── */
function _highlightsHTML() {
  return `
    <div>
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:var(--space-6);flex-wrap:wrap;gap:12px;">
        <h2 style="font-size:var(--text-2xl);font-weight:900;">⭐ Highlights</h2>
        <button class="btn btn-primary btn-md">+ เพิ่ม Clip</button>
      </div>
      <div class="empty-state" style="padding:var(--space-12) 0;">
        <div class="empty-icon">⭐</div>
        <div class="empty-title">ยังไม่มีไฮไลท์</div>
        <div class="empty-desc">กดปุ่ม "เพิ่ม Clip" เพื่อเพิ่มไฮไลท์</div>
      </div>
    </div>`;
}

/* ── Customers ──────────────────────────────────────────────── */
function _customersHTML() {
  const customers = [
    { name:'คุณอรอุษา', phone:'0812345678', orders:3, total:'฿9,600',  lastOrder:'28 ก.ค. 68' },
    { name:'คุณวรวุฒิ',  phone:'0898765432', orders:2, total:'฿5,600',  lastOrder:'27 ก.ค. 68' },
    { name:'คุณนภัส',    phone:'0871234567', orders:5, total:'฿14,200', lastOrder:'27 ก.ค. 68' },
    { name:'คุณธนพล',    phone:'0623456789', orders:1, total:'฿3,200',  lastOrder:'25 ก.ค. 68' },
  ];
  return `
    <div>
      <h2 style="font-size:var(--text-2xl);font-weight:900;margin-bottom:var(--space-6);">👥 Customers</h2>
      <div class="admin-table-wrap">
        <table class="admin-table">
          <thead><tr><th>ชื่อ</th><th>เบอร์โทร</th><th>Orders</th><th>ยอดรวม</th><th>Order ล่าสุด</th></tr></thead>
          <tbody>
            ${customers.map(c => `
              <tr>
                <td style="font-weight:700;">${c.name}</td>
                <td style="font-family:var(--font-en);color:var(--text-3);">${c.phone}</td>
                <td><span class="badge badge-blue">${c.orders}</span></td>
                <td style="color:var(--gold-light);font-weight:700;">${c.total}</td>
                <td style="color:var(--text-3);font-size:var(--text-sm);">${c.lastOrder}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>`;
}
