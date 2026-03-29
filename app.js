/* ── SafeTravel AI – App Logic ──────────────────────────────────────────── */
'use strict';

/* ── Navigation ──────────────────────────────────────────────────────────── */
const navBtns   = document.querySelectorAll('.nav-btn');
const screens   = document.querySelectorAll('.screen');

function showScreen(targetId) {
  screens.forEach(s => {
    s.classList.remove('active');
  });
  navBtns.forEach(b => b.classList.remove('active'));

  const targetScreen = document.getElementById(targetId);
  const targetBtn    = document.querySelector(`[data-target="${targetId}"]`);
  if (targetScreen) {
    targetScreen.classList.add('active');
    targetScreen.scrollTop = 0;
  }
  if (targetBtn) targetBtn.classList.add('active');
}

navBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const target = btn.dataset.target;
    if (target) showScreen(target);
  });
});

/* ── Score Ring Animation ────────────────────────────────────────────────── */
function animateScoreRing() {
  const circle = document.querySelector('.score-progress');
  if (!circle) return;

  const radius      = 48;
  const circumf     = 2 * Math.PI * radius; // ≈ 301.59
  const scoreValue  = parseInt(document.getElementById('score-value').textContent, 10);
  const targetOffset = circumf - (circumf * scoreValue / 100);

  // Start fully hidden, then animate
  circle.style.strokeDashoffset = circumf.toString();
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      circle.style.strokeDashoffset = targetOffset.toString();
    });
  });
}

/* Animate on load and whenever Home screen becomes visible */
let scoreAnimated = false;
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting && !scoreAnimated) {
      scoreAnimated = true;
      animateScoreRing();
    }
  });
}, { threshold: 0.1 });

const homeScreen = document.getElementById('screen-home');
if (homeScreen) observer.observe(homeScreen);
animateScoreRing(); // also run immediately

/* Re-animate when navigating back to home */
const origShowScreen = showScreen;
window.showScreenInternal = function(targetId) {
  origShowScreen(targetId);
  if (targetId === 'screen-home') {
    scoreAnimated = false;
    setTimeout(animateScoreRing, 100);
  }
};

navBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const target = btn.dataset.target;
    if (target === 'screen-home') {
      setTimeout(animateScoreRing, 120);
    }
  });
});

/* ── Check Route Button ──────────────────────────────────────────────────── */
const checkRouteBtn = document.getElementById('check-route-btn');
if (checkRouteBtn) {
  checkRouteBtn.addEventListener('click', () => {
    showScreen('screen-map');
    document.getElementById('nav-map').classList.add('active');
    document.getElementById('nav-home').classList.remove('active');
  });
}

/* ── SOS Button – Hold to Send ───────────────────────────────────────────── */
const sosBtn   = document.getElementById('sos-button');
const sosModal = document.getElementById('sos-modal');
const modalClose = document.getElementById('modal-close');

let sosTimer     = null;
let sosHoldStart = null;
const SOS_HOLD_MS = 3000;

function triggerSOS() {
  if (sosModal) {
    sosModal.classList.add('visible');
    sosModal.setAttribute('aria-hidden', 'false');
  }
}

if (sosBtn) {
  /* Pointer down → start countdown */
  sosBtn.addEventListener('pointerdown', (e) => {
    e.preventDefault();
    sosBtn.classList.add('pressed');
    sosHoldStart = Date.now();
    sosTimer = setTimeout(() => {
      triggerSOS();
      sosBtn.classList.remove('pressed');
    }, SOS_HOLD_MS);
  });

  /* Pointer up / leave → cancel if not yet fired */
  function cancelSOS() {
    if (sosTimer) {
      clearTimeout(sosTimer);
      sosTimer = null;
    }
    sosBtn.classList.remove('pressed');
  }
  sosBtn.addEventListener('pointerup', cancelSOS);
  sosBtn.addEventListener('pointerleave', cancelSOS);
  sosBtn.addEventListener('pointercancel', cancelSOS);
}

if (modalClose) {
  modalClose.addEventListener('click', () => {
    sosModal.classList.remove('visible');
    sosModal.setAttribute('aria-hidden', 'true');
  });
}

/* ── Quick Action Buttons ────────────────────────────────────────────────── */
const callPolice     = document.getElementById('call-police');
const shareLocation  = document.getElementById('share-location');
const safeCheckin    = document.getElementById('safe-checkin');

if (callPolice) {
  callPolice.addEventListener('click', () => {
    showToast('Calling emergency services…', 'danger');
  });
}
if (shareLocation) {
  shareLocation.addEventListener('click', () => {
    showToast('Location shared with contacts ✓', 'success');
  });
}
if (safeCheckin) {
  safeCheckin.addEventListener('click', () => {
    showToast('Check-in sent to contacts ✓', 'success');
  });
}

/* ── Nav Buttons misc ────────────────────────────────────────────────────── */
document.getElementById('notif-btn')?.addEventListener('click', () => {
  showToast('No new notifications', 'neutral');
});
document.getElementById('add-contact-btn')?.addEventListener('click', () => {
  showToast('Add contact feature coming soon', 'neutral');
});
document.getElementById('logout-btn')?.addEventListener('click', () => {
  showToast('Signed out successfully', 'neutral');
});
document.getElementById('about-app')?.addEventListener('click', () => {
  showToast('SafeTravel AI v1.0.0', 'neutral');
});

/* ── Toast Notification ──────────────────────────────────────────────────── */
function showToast(message, type = 'neutral') {
  /* Remove existing toast */
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = message;

  const colors = {
    success: { bg: 'rgba(34,197,94,0.15)',  border: 'rgba(34,197,94,0.35)',  color: '#22C55E' },
    danger:  { bg: 'rgba(239,68,68,0.15)',  border: 'rgba(239,68,68,0.35)',  color: '#EF4444' },
    neutral: { bg: 'rgba(30,41,59,0.95)',   border: '#334155',               color: '#E2E8F0' },
  };
  const c = colors[type] || colors.neutral;

  Object.assign(toast.style, {
    position: 'absolute',
    bottom: '88px',
    left: '16px',
    right: '16px',
    background: c.bg,
    border: `1px solid ${c.border}`,
    borderRadius: '12px',
    padding: '12px 16px',
    color: c.color,
    fontSize: '14px',
    fontFamily: 'Inter, sans-serif',
    fontWeight: '500',
    zIndex: '300',
    backdropFilter: 'blur(8px)',
    webkitBackdropFilter: 'blur(8px)',
    opacity: '0',
    transform: 'translateY(8px)',
    transition: 'opacity 0.22s, transform 0.22s',
    textAlign: 'center',
  });

  document.querySelector('.app-shell').appendChild(toast);

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      toast.style.opacity = '1';
      toast.style.transform = 'translateY(0)';
    });
  });

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(8px)';
    setTimeout(() => toast.remove(), 250);
  }, 2800);
}

/* ── Safety Score Live Counter (subtle micro-animation) ─────────────────── */
function countUp(el, target, duration = 1200) {
  const start = performance.now();
  function step(now) {
    const elapsed  = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased    = 1 - Math.pow(1 - progress, 3); // ease-out cubic
    el.textContent = Math.round(eased * target);
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

const scoreEl = document.getElementById('score-value');
if (scoreEl) {
  const finalScore = parseInt(scoreEl.textContent, 10);
  scoreEl.textContent = '0';
  setTimeout(() => countUp(scoreEl, finalScore), 300);
}

/* ── Alert Items Ripple ──────────────────────────────────────────────────── */
document.querySelectorAll('.alert-item').forEach(item => {
  item.addEventListener('click', (e) => {
    const circle = document.createElement('span');
    const rect   = item.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    Object.assign(circle.style, {
      position: 'absolute', left: x + 'px', top: y + 'px',
      width: '4px', height: '4px',
      background: 'rgba(34,197,94,0.3)',
      borderRadius: '50%',
      transform: 'translate(-50%,-50%) scale(0)',
      transition: 'transform 0.5s, opacity 0.5s',
      pointerEvents: 'none',
    });
    item.style.position = 'relative';
    item.style.overflow = 'hidden';
    item.appendChild(circle);
    requestAnimationFrame(() => {
      circle.style.transform = 'translate(-50%,-50%) scale(60)';
      circle.style.opacity = '0';
    });
    setTimeout(() => circle.remove(), 550);
  });
});

/* ── Initial Screen ──────────────────────────────────────────────────────── */
showScreen('screen-home');
