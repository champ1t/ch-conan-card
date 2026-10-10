export function initCursor() {
  if (window.innerWidth < 768) return; // Disable on mobile devices

  const style = document.createElement('style');
  style.textContent = `
    /* Hide default cursor on most elements, keep it for inputs */
    *:not(input):not(textarea) {
      cursor: none !important;
    }
    #ai-cursor-dot {
      position: fixed;
      top: 0; left: 0;
      width: 6px; height: 6px;
      background: #ffffff;
      border-radius: 50%;
      pointer-events: none;
      z-index: 999999;
      transform: translate(-50%, -50%);
      box-shadow: 0 0 10px rgba(255, 255, 255, 0.9);
      transition: width 0.2s, height 0.2s, background 0.2s;
    }
    #ai-cursor-aura {
      position: fixed;
      top: 0; left: 0;
      width: 40px; height: 40px;
      border: 1.5px solid rgba(168, 85, 247, 0.6);
      border-radius: 50%;
      pointer-events: none;
      z-index: 999998;
      transform: translate(-50%, -50%);
      box-shadow: 0 0 20px rgba(168, 85, 247, 0.4), inset 0 0 15px rgba(168, 85, 247, 0.15);
      transition: width 0.3s, height 0.3s, border-color 0.3s, box-shadow 0.3s;
    }
    /* Hover effects for interactive elements */
    #ai-cursor-dot.hover {
      width: 10px; height: 10px;
      background: var(--gold-light, #fcd34d);
      box-shadow: 0 0 15px var(--gold-light, #fcd34d);
    }
    #ai-cursor-aura.hover {
      width: 55px; height: 55px;
      border-color: rgba(252, 211, 77, 0.8);
      background: rgba(252, 211, 77, 0.05);
      box-shadow: 0 0 30px rgba(252, 211, 77, 0.4), inset 0 0 15px rgba(252, 211, 77, 0.2);
    }
    /* Click animation / Shockwave */
    @keyframes cursorClickPulse {
      0% { transform: translate(-50%, -50%) scale(1); opacity: 1; border-width: 2px; }
      100% { transform: translate(-50%, -50%) scale(2.5); opacity: 0; border-width: 0px; }
    }
    #ai-cursor-click {
      position: fixed;
      top: 0; left: 0;
      width: 45px; height: 45px;
      border: 2px solid var(--purple-light, #c084fc);
      border-radius: 50%;
      pointer-events: none;
      z-index: 999997;
      transform: translate(-50%, -50%);
      opacity: 0;
    }
    #ai-cursor-click.animate {
      animation: cursorClickPulse 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
    }
  `;
  document.head.appendChild(style);

  const dot = document.createElement('div');
  dot.id = 'ai-cursor-dot';
  document.body.appendChild(dot);

  const aura = document.createElement('div');
  aura.id = 'ai-cursor-aura';
  document.body.appendChild(aura);

  const clickRing = document.createElement('div');
  clickRing.id = 'ai-cursor-click';
  document.body.appendChild(clickRing);

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let auraX = mouseX;
  let auraY = mouseY;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.left = mouseX + 'px';
    dot.style.top = mouseY + 'px';
  });

  // Smooth follow for aura (Lerp)
  function animate() {
    auraX += (mouseX - auraX) * 0.15; // 0.15 is the easing factor (higher = faster)
    auraY += (mouseY - auraY) * 0.15;
    aura.style.left = auraX + 'px';
    aura.style.top = auraY + 'px';
    requestAnimationFrame(animate);
  }
  animate();

  // Click ripple/shockwave
  window.addEventListener('mousedown', (e) => {
    clickRing.style.left = e.clientX + 'px';
    clickRing.style.top = e.clientY + 'px';
    clickRing.classList.remove('animate');
    void clickRing.offsetWidth; // trigger reflow
    clickRing.classList.add('animate');
    
    // Scale aura down on click for tactile feel
    aura.style.transform = 'translate(-50%, -50%) scale(0.7)';
  });
  window.addEventListener('mouseup', () => {
    aura.style.transform = 'translate(-50%, -50%) scale(1)';
  });

  // Hover detection logic
  const interactiveTags = ['a', 'button', 'input', 'select', 'textarea'];
  
  document.addEventListener('mouseover', (e) => {
    const target = e.target;
    const isInteractive = 
      interactiveTags.includes(target.tagName.toLowerCase()) ||
      target.closest('a') ||
      target.closest('button') ||
      target.getAttribute('role') === 'button' ||
      target.classList.contains('nav-link') ||
      window.getComputedStyle(target).cursor === 'pointer';

    if (isInteractive) {
      dot.classList.add('hover');
      aura.classList.add('hover');
    }
  });

  document.addEventListener('mouseout', (e) => {
    const target = e.target;
    const isInteractive = 
      interactiveTags.includes(target.tagName.toLowerCase()) ||
      target.closest('a') ||
      target.closest('button') ||
      target.getAttribute('role') === 'button' ||
      target.classList.contains('nav-link') ||
      window.getComputedStyle(target).cursor === 'pointer';

    if (isInteractive) {
      dot.classList.remove('hover');
      aura.classList.remove('hover');
    }
  });
}
