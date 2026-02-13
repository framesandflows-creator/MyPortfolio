const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');
const navLinks = document.querySelectorAll('.nav a');
const sections = document.querySelectorAll('main section[id], footer[id]');
const progressBar = document.querySelector('.scroll-progress');
const heroMain = document.querySelector('.hero-main');

const setMenuState = (isOpen) => {
  if (!nav || !menuToggle) return;
  nav.classList.toggle('open', isOpen);
  menuToggle.setAttribute('aria-expanded', String(isOpen));
};

if (menuToggle && nav) {
  menuToggle.addEventListener('click', () => {
    const isOpen = !nav.classList.contains('open');
    setMenuState(isOpen);
  });

  navLinks.forEach((link) => {
    link.addEventListener('click', () => setMenuState(false));
  });

  document.addEventListener('click', (event) => {
    if (!nav.classList.contains('open')) return;
    if (nav.contains(event.target) || menuToggle.contains(event.target)) return;
    setMenuState(false);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') setMenuState(false);
  });
}

if (!prefersReducedMotion) {
  const revealElements = document.querySelectorAll('.reveal');

  revealElements.forEach((el, index) => {
    el.style.setProperty('--stagger', `${Math.min(index * 55, 330)}ms`);
  });

  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.16 }
  );

  revealElements.forEach((el) => revealObserver.observe(el));
} else {
  document.querySelectorAll('.reveal').forEach((el) => el.classList.add('visible'));
}

if (navLinks.length > 0 && sections.length > 0) {
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      const activeEntry = entries.find((entry) => entry.isIntersecting);
      if (!activeEntry) return;

      const id = activeEntry.target.getAttribute('id');
      navLinks.forEach((link) => {
        const isActive = link.getAttribute('href') === `#${id}`;
        link.classList.toggle('active', isActive);
        if (isActive) {
          link.setAttribute('aria-current', 'page');
        } else {
          link.removeAttribute('aria-current');
        }
      });
    },
    {
      threshold: 0.45,
      rootMargin: '-10% 0px -40% 0px',
    }
  );

  sections.forEach((section) => sectionObserver.observe(section));
}

const yearEl = document.getElementById('year');
if (yearEl) {
  yearEl.textContent = String(new Date().getFullYear());
}

const greetingEl = document.getElementById('time-greeting');
if (greetingEl) {
  const hour = new Date().getHours();
  let greeting = 'Good Evening';

  if (hour < 12) {
    greeting = 'Good Morning';
  } else if (hour < 17) {
    greeting = 'Good Afternoon';
  }

  greetingEl.textContent = `${greeting}`;
}

if (!prefersReducedMotion) {
  const tiltCards = document.querySelectorAll('.tilt-card');

  tiltCards.forEach((card) => {
    card.addEventListener('mousemove', (event) => {
      const bounds = card.getBoundingClientRect();
      const x = event.clientX - bounds.left;
      const y = event.clientY - bounds.top;
      const rotateY = (x / bounds.width - 0.5) * 8;
      const rotateX = (y / bounds.height - 0.5) * -8;
      card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}

if (!prefersReducedMotion && progressBar) {
  let ticking = false;

  const animateOnScroll = () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? Math.min(scrollTop / docHeight, 1) : 0;
    progressBar.style.transform = `scaleX(${progress})`;

    if (heroMain) {
      const parallax = Math.min(scrollTop * 0.08, 26);
      heroMain.style.transform = `translateY(${parallax}px)`;
    }

    ticking = false;
  };

  const requestTick = () => {
    if (ticking) return;
    window.requestAnimationFrame(animateOnScroll);
    ticking = true;
  };

  window.addEventListener('scroll', requestTick, { passive: true });
  window.addEventListener('resize', requestTick);
  requestTick();
}

if (!prefersReducedMotion) {
  const magneticButtons = document.querySelectorAll('.hero-actions .btn');

  magneticButtons.forEach((button) => {
    button.addEventListener('mousemove', (event) => {
      const rect = button.getBoundingClientRect();
      const offsetX = event.clientX - (rect.left + rect.width / 2);
      const offsetY = event.clientY - (rect.top + rect.height / 2);
      button.style.transform = `translate(${offsetX * 0.08}px, ${offsetY * 0.12}px)`;
    });

    button.addEventListener('mouseleave', () => {
      button.style.transform = '';
    });
  });
}

const canvas = document.getElementById('tech-canvas');
if (canvas && !prefersReducedMotion) {
  const ctx = canvas.getContext('2d');
  const particles = [];
  const maxParticleCount = Math.min(56, Math.floor(window.innerWidth / 22));
  let rafId = null;

  const setCanvasSize = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.floor(window.innerWidth * dpr);
    canvas.height = Math.floor(window.innerHeight * dpr);
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };

  const createParticle = () => ({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    vx: (Math.random() - 0.5) * 0.4,
    vy: (Math.random() - 0.5) * 0.4,
    size: Math.random() * 1.8 + 0.8,
  });

  const draw = () => {
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

    for (let i = 0; i < particles.length; i += 1) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;

      if (p.x <= 0 || p.x >= window.innerWidth) p.vx *= -1;
      if (p.y <= 0 || p.y >= window.innerHeight) p.vy *= -1;

      ctx.beginPath();
      ctx.fillStyle = 'rgba(34, 211, 238, 0.42)';
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();

      for (let j = i + 1; j < particles.length; j += 1) {
        const q = particles[j];
        const dx = p.x - q.x;
        const dy = p.y - q.y;
        const distance = Math.hypot(dx, dy);

        if (distance < 118) {
          const alpha = (1 - distance / 118) * 0.2;
          ctx.strokeStyle = `rgba(157, 176, 207, ${alpha})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.stroke();
        }
      }
    }

    rafId = window.requestAnimationFrame(draw);
  };

  const resetParticles = () => {
    particles.length = 0;
    for (let i = 0; i < maxParticleCount; i += 1) {
      particles.push(createParticle());
    }
  };

  setCanvasSize();
  resetParticles();
  draw();

  let resizeTimer = null;
  window.addEventListener('resize', () => {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(() => {
      setCanvasSize();
      resetParticles();
    }, 120);
  });

  document.addEventListener('visibilitychange', () => {
    if (document.hidden && rafId) {
      window.cancelAnimationFrame(rafId);
      rafId = null;
    } else if (!document.hidden && !rafId) {
      draw();
    }
  });
}
