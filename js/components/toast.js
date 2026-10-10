/** Toast notification system */
export function showToast(msg, type = 'info', title = '') {
  const container = document.getElementById('toast-container');
  if (!container) return;
  const icons = { success:'✅', error:'❌', info:'ℹ️', warning:'⚠️' };
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <div class="toast-icon">${icons[type] || 'ℹ️'}</div>
    <div>
      ${title ? `<div class="toast-title">${title}</div>` : ''}
      <div class="toast-msg">${msg}</div>
    </div>`;
  container.appendChild(toast);
  setTimeout(() => {
    toast.classList.add('leaving');
    setTimeout(() => toast.remove(), 280);
  }, 3500);
}
