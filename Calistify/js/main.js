// ============================================
// MOBILE NAV EMERGENCY FIX - يشتغل فوراً قبل أي حاجة
// ============================================
(function() {
  function forceCloseNav() {
    var nav = document.getElementById('mobileNav');
    var btn = document.getElementById('hamburgerBtn');
    if (nav) {
      nav.classList.remove('open', 'closing', 'animating');
    }
    if (btn) {
      btn.classList.remove('open');
    }
    document.body.style.overflow = '';
  }

  // يشتغل فوراً (main.js بيكون في آخر الـ body فالـ DOM جاهز)
  forceCloseNav();

  // يشتغل فور ما الـ DOM يكون جاهز
  document.addEventListener('DOMContentLoaded', forceCloseNav);

  // يشتغل لو المتصفح رجّع الصفحة من الـ cache
  window.addEventListener('pageshow', forceCloseNav);

  // Global functions تشتغل على كل الصفحات
  window.toggleMobileNav = function() {
    var nav = document.getElementById('mobileNav');
    var btn = document.getElementById('hamburgerBtn');
    if (!nav) return;
    if (nav.classList.contains('open')) {
      window.closeMobileNav();
    } else {
      nav.classList.remove('closing');
      nav.classList.add('open');
      if (btn) btn.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
  };

  window.closeMobileNav = function() {
    var nav = document.getElementById('mobileNav');
    var btn = document.getElementById('hamburgerBtn');
    if (!nav) return;
    nav.classList.remove('open');
    if (btn) btn.classList.remove('open');
    document.body.style.overflow = '';
  };
})();

// ============================================
// CALISTIFY - ULTRA POWERFUL JAVASCRIPT 🔥
// Advanced Features & Interactions
// ============================================

// Global namespace
window.calistify = window.calistify || {};

// ============================================
// PROGRESS TRACKING SYSTEM
// ============================================
class ProgressTracker {
  constructor() {
    this.storageKey = 'calistify_progress';
    this.init();
  }

  init() {
    const saved = localStorage.getItem(this.storageKey);
    if (!saved) {
      this.data = {
        completedExercises: [],
        currentLevel: 'pre-beginner',
        badges: [],
        joinDate: new Date().toISOString(),
        totalWorkouts: 0,
        streak: 0
      };
      this.save();
    } else {
      this.data = JSON.parse(saved);
    }
  }

  completeExercise(exerciseId) {
    if (!this.data.completedExercises.includes(exerciseId)) {
      this.data.completedExercises.push(exerciseId);
      this.data.totalWorkouts++;
      this.checkBadges();
      this.save();
      this.showAchievement(`Exercise completed! 💪`);
    }
  }

  checkBadges() {
    const count = this.data.completedExercises.length;
    const badges = [
      { name: 'First Steps', requirement: 5 },
      { name: 'Getting Strong', requirement: 20 },
      { name: 'Dedicated Athlete', requirement: 50 },
      { name: 'Calisthenics Master', requirement: 100 }
    ];

    badges.forEach(badge => {
      if (count >= badge.requirement && !this.data.badges.includes(badge.name)) {
        this.data.badges.push(badge.name);
        this.showBadgeUnlock(badge.name);
      }
    });
  }

  showBadgeUnlock(badgeName) {
    showToast(`🏆 Badge Unlocked: ${badgeName}!`, 'success', 5000);
  }

  showAchievement(message) {
    createFireworks();
    showToast(message, 'success', 3000);
  }

  getProgress() {
    return this.data;
  }

  save() {
    localStorage.setItem(this.storageKey, JSON.stringify(this.data));
  }
}

// ============================================
// SHOPPING CART SYSTEM
// ============================================
class ShoppingCart {
  constructor() {
    this.storageKey = 'calistify_cart';
    this.items = this.load();
    this.updateUI();
  }

  load() {
    const saved = localStorage.getItem(this.storageKey);
    return saved ? JSON.parse(saved) : [];
  }

  save() {
    localStorage.setItem(this.storageKey, JSON.stringify(this.items));
    this.updateUI();
  }

  addItem(product) {
    const existing = this.items.find(item => item.id === product.id);
    if (existing) {
      existing.quantity++;
    } else {
      this.items.push({ ...product, quantity: 1 });
    }
    this.save();
    if (event) createParticleBurst(event.clientX, event.clientY);
    showToast(`${product.name} added to cart! 🛒`, 'success');
  }

  removeItem(productId) {
    this.items = this.items.filter(item => item.id !== productId);
    this.save();
    showToast('Item removed from cart', 'info');
  }

  updateQuantity(productId, quantity) {
    if (quantity <= 0) {
      this.removeItem(productId);
      return;
    }
    const item = this.items.find(i => i.id === productId);
    if (item) {
      item.quantity = quantity;
      this.save();
    }
  }

  getTotal() {
    return this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }

  getItemCount() {
    return this.items.reduce((sum, item) => sum + item.quantity, 0);
  }

  updateUI() {
    const countElements = document.querySelectorAll('.cart-count');
    const count = this.getItemCount();
    countElements.forEach(el => {
      el.textContent = count;
      if (count > 0) {
        el.style.animation = 'pulse 0.5s ease';
        setTimeout(() => el.style.animation = '', 500);
      }
    });
  }
}

// ============================================
// AUTHENTICATION SYSTEM
// ============================================
class AuthSystem {
  constructor() {
    this.storageKey = 'calistify_users';
    this.sessionKey = 'calistify_session';
    this.currentUser = this.getSession();
    this.updateAuthUI();
  }

  register(name, email, password, username = '') {
    const users = this.getUsers();
    if (users.find(u => u.email === email)) {
      showToast('Email already exists!', 'error');
      return false;
    }
    if (username && users.find(u => u.username === username)) {
      showToast('Username already taken!', 'error');
      return false;
    }
    users.push({ name, email, password, username, id: Date.now() });
    localStorage.setItem(this.storageKey, JSON.stringify(users));
    this.login(email, password);
    return true;
  }

  login(email, password) {
    const users = this.getUsers();
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
      this.currentUser = { name: user.name, email: user.email, id: user.id, username: user.username || '' };
      sessionStorage.setItem(this.sessionKey, JSON.stringify(this.currentUser));
      this.updateAuthUI();
      // 🚫 تم إزالة showToast و createFireworks من هنا
      // ✅ الآن يتم عرضهم فقط في الدالة العامة window.login
      return true;
    }
    showToast('Invalid credentials!', 'error');
    return false;
  }

  updateProfile(newName, newUsername) {
    const users = this.getUsers();
    const idx   = users.findIndex(u => u.id === this.currentUser.id);
    if (idx === -1) { showToast('User not found!', 'error'); return false; }

    // Check username uniqueness (ignore current user)
    if (newUsername && users.find(u => u.username === newUsername && u.id !== this.currentUser.id)) {
      showToast('Username already taken!', 'error');
      return false;
    }

    users[idx].name     = newName;
    users[idx].username = newUsername;
    localStorage.setItem(this.storageKey, JSON.stringify(users));

    // Update session
    this.currentUser.name     = newName;
    this.currentUser.username = newUsername;
    sessionStorage.setItem(this.sessionKey, JSON.stringify(this.currentUser));
    this.updateAuthUI();
    return true;
  }

  logout() {
    this.currentUser = null;
    sessionStorage.removeItem(this.sessionKey);
    this.updateAuthUI();
    showToast('Logged out successfully', 'info');
    setTimeout(() => window.location.href = 'index.html', 1000);
  }

  isLoggedIn() {
    return this.currentUser !== null;
  }

  getSession() {
    const session = sessionStorage.getItem(this.sessionKey);
    return session ? JSON.parse(session) : null;
  }

  getUsers() {
    const users = localStorage.getItem(this.storageKey);
    return users ? JSON.parse(users) : [];
  }

  updateAuthUI() {
    const authButtons = document.querySelectorAll('.auth-buttons');
    authButtons.forEach(container => {
      if (this.isLoggedIn()) {
        container.innerHTML = `
          <a href="profile.html" class="btn btn-outline" style="padding: 0.75rem 1.5rem;">
            <i class="fas fa-user"></i> ${this.currentUser.name}
          </a>
        `;
      } else {
        container.innerHTML = `
          <a href="login.html" class="btn btn-outline" style="padding: 0.75rem 1.5rem;">Login</a>
          <a href="register.html" class="btn btn-primary" style="padding: 0.75rem 1.5rem;">Sign Up</a>
        `;
      }
    });
  }
}

// ============================================
// VISUAL EFFECTS - ULTRA POWERFUL 🔥
// ============================================

// Particle Burst Effect
function createParticleBurst(x, y) {
  const colors = ['#FF4D00', '#FFD700', '#FF6B33', '#FFA500'];
  for (let i = 0; i < 30; i++) {
    const particle = document.createElement('div');
    const size = Math.random() * 8 + 4;
    const color = colors[Math.floor(Math.random() * colors.length)];
    
    particle.style.cssText = `
      position: fixed;
      width: ${size}px;
      height: ${size}px;
      background: ${color};
      border-radius: 50%;
      left: ${x}px;
      top: ${y}px;
      pointer-events: none;
      z-index: 10000;
      box-shadow: 0 0 10px ${color};
    `;
    
    document.body.appendChild(particle);
    
    const angle = (Math.PI * 2 * i) / 30;
    const velocity = Math.random() * 150 + 100;
    const vx = Math.cos(angle) * velocity;
    const vy = Math.sin(angle) * velocity;
    
    animateParticle(particle, vx, vy);
  }
}

function animateParticle(particle, vx, vy) {
  let x = parseFloat(particle.style.left);
  let y = parseFloat(particle.style.top);
  let opacity = 1;
  let startTime = Date.now();
  
  function update() {
    const elapsed = (Date.now() - startTime) / 1000;
    if (elapsed > 1) {
      particle.remove();
      return;
    }
    
    x += vx * 0.016;
    y += vy * 0.016 + elapsed * 200;
    opacity = 1 - elapsed;
    
    particle.style.left = x + 'px';
    particle.style.top = y + 'px';
    particle.style.opacity = opacity;
    
    requestAnimationFrame(update);
  }
  
  update();
}

// Fireworks Effect 💥
function createFireworks() {
  const container = document.createElement('div');
  container.style.cssText = `
    position: fixed;
    inset: 0;
    pointer-events: none;
    z-index: 9999;
  `;
  document.body.appendChild(container);
  
  for (let i = 0; i < 5; i++) {
    setTimeout(() => {
      const x = Math.random() * window.innerWidth;
      const y = Math.random() * window.innerHeight * 0.7;
      createFirework(container, x, y);
    }, i * 200);
  }
  
  setTimeout(() => container.remove(), 3000);
}

function createFirework(container, x, y) {
  const colors = ['#FF4D00', '#FFD700', '#00FF88', '#00F0FF', '#FF006E'];
  const color = colors[Math.floor(Math.random() * colors.length)];
  
  for (let i = 0; i < 50; i++) {
    const particle = document.createElement('div');
    particle.style.cssText = `
      position: absolute;
      width: 4px;
      height: 4px;
      background: ${color};
      border-radius: 50%;
      left: ${x}px;
      top: ${y}px;
      box-shadow: 0 0 10px ${color};
    `;
    container.appendChild(particle);
    
    const angle = (Math.PI * 2 * i) / 50;
    const velocity = Math.random() * 200 + 100;
    animateFireworkParticle(particle, angle, velocity);
  }
}

function animateFireworkParticle(particle, angle, velocity) {
  let startTime = Date.now();
  const startX = parseFloat(particle.style.left);
  const startY = parseFloat(particle.style.top);
  
  function update() {
    const elapsed = (Date.now() - startTime) / 1000;
    if (elapsed > 2) {
      particle.remove();
      return;
    }
    
    const x = startX + Math.cos(angle) * velocity * elapsed;
    const y = startY + Math.sin(angle) * velocity * elapsed + elapsed * elapsed * 200;
    const opacity = 1 - elapsed / 2;
    
    particle.style.left = x + 'px';
    particle.style.top = y + 'px';
    particle.style.opacity = opacity;
    
    requestAnimationFrame(update);
  }
  
  update();
}

// Toast Notification System 🔔
function showToast(message, type = 'success', duration = 3000) {
  const toast = document.createElement('div');
  const icons = {
    success: '✓',
    error: '✕',
    warning: '⚠',
    info: 'ℹ'
  };
  const colors = {
    success: '#00FF88',
    error: '#FF3366',
    warning: '#FFB800',
    info: '#00D4FF'
  };
  
  toast.style.cssText = `
    position: fixed;
    top: 100px;
    right: -400px;
    background: linear-gradient(135deg, ${colors[type]}, ${colors[type]}dd);
    color: white;
    padding: 1.2rem 2rem;
    border-radius: 12px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4), 0 0 20px ${colors[type]}88;
    z-index: 10000;
    font-family: 'Rajdhani', sans-serif;
    font-weight: 700;
    font-size: 1.1rem;
    display: flex;
    align-items: center;
    gap: 1rem;
    transition: right 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
    border: 2px solid ${colors[type]};
  `;
  
  toast.innerHTML = `
    <span style="font-size: 1.5rem;">${icons[type]}</span>
    <span>${message}</span>
  `;
  
  document.body.appendChild(toast);
  
  requestAnimationFrame(() => {
    toast.style.right = '20px';
  });
  
  setTimeout(() => {
    toast.style.right = '-400px';
    setTimeout(() => toast.remove(), 500);
  }, duration);
}

// ============================================
// SCROLL ANIMATIONS & EFFECTS
// ============================================

// Enhanced Navbar on Scroll
let lastScroll = 0;
window.addEventListener('scroll', () => {
  const navbar = document.querySelector('.navbar');
  const currentScroll = window.pageYOffset;
  
  if (currentScroll > 100) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
  
  lastScroll = currentScroll;
});

// Intersection Observer for Animations
const observerOptions = {
  threshold: 0.15,
  rootMargin: '0px 0px -100px 0px'
};

const fadeObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, index) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0) scale(1)';
      }, index * 100);
      fadeObserver.unobserve(entry.target);
    }
  });
}, observerOptions);

// Auto-animate elements on page load
document.addEventListener('DOMContentLoaded', () => {
  const elements = document.querySelectorAll('.card, .feature-card, .product-card, .exercise-card, .level-card');
  
  elements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(50px) scale(0.95)';
    el.style.transition = 'all 0.8s cubic-bezier(0.23, 1, 0.32, 1)';
    fadeObserver.observe(el);
  });
});

// ============================================
// SMOOTH SCROLL
// ============================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

// ============================================
// INITIALIZE SYSTEMS
// ============================================
window.calistify.progressTracker = new ProgressTracker();
window.calistify.cart = new ShoppingCart();
window.calistify.auth = new AuthSystem();

// Export utilities
Object.assign(window.calistify, {
  showToast,
  createFireworks,
  createParticleBurst
});

// ============================================
// GLOBAL AUTH FUNCTIONS (للتوافق مع HTML) ✅
// ============================================
window.register = function(name, email, password, username = '') {
  const success = window.calistify.auth.register(name, email, password, username);
  if (success) {
    window.location.href = 'profile.html';
  }
  return success;
};

window.login = function(email, password) {
  const success = window.calistify.auth.login(email, password);
  if (success) {
    // ✅ الآن يتم عرض الإشعار والألعاب النارية هنا فقط – مرة واحدة عند تسجيل الدخول الفعلي
    createFireworks();
    const user = window.calistify.auth.currentUser;
    showToast(`Welcome back, ${user.name}! 💪`, 'success', 4000);
    window.location.href = 'profile.html';
  }
  return success;
};

window.logout = function() {
  window.calistify.auth.logout();
};
document.addEventListener('DOMContentLoaded', function() {
  // Highlight active link in mobile nav
  const currentPage = window.location.pathname.split('/').pop();
  const mobileLinks = document.querySelectorAll('.mobile-nav-links a');
  mobileLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage) {
      link.classList.add('active');
    }
  });
});

// ============================================
// CONSOLE BRANDING 🔥
// ============================================
console.log('%c🔥 CALISTIFY 🔥', 'color: #FF4D00; font-size: 48px; font-weight: bold; text-shadow: 0 0 20px rgba(255, 77, 0, 0.8), 0 0 40px rgba(255, 215, 0, 0.4);');
console.log('%cULTRA POWERFUL JAVASCRIPT ENGINE', 'color: #FFD700; font-size: 18px; font-weight: bold;');
console.log('%cBuild Your Body. Master Your Mind.', 'color: #00FF88; font-size: 14px;');