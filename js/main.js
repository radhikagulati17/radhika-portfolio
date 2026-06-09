/* ============================================================
   Radhika Gulati — Portfolio | Main JavaScript
   Pure Vanilla JS · ES6+ · No Dependencies
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ----------------------------------------------------------
     0. Reduced-Motion Preference
  ---------------------------------------------------------- */
  const prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;

  /* ----------------------------------------------------------
     1. Intersection Observer — Scroll Reveal (.fade-up)
  ---------------------------------------------------------- */
  const initScrollReveal = () => {
    const fadeEls = document.querySelectorAll('.fade-up');
    if (!fadeEls.length) return;

    if (prefersReducedMotion) {
      fadeEls.forEach(el => el.classList.add('visible'));
      return;
    }

    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -50px 0px' }
    );

    fadeEls.forEach(el => revealObserver.observe(el));
  };

  /* ----------------------------------------------------------
     2. Animated Counters (.stat-number[data-target])
  ---------------------------------------------------------- */
  const initCounters = () => {
    const counters = document.querySelectorAll('.stat-number[data-target]');
    if (!counters.length) return;

    const animateCounter = (el) => {
      const target = parseInt(el.dataset.target, 10);
      const suffix = el.dataset.suffix || '';
      const prefix = el.dataset.prefix || '';

      if (prefersReducedMotion) {
        el.textContent = `${prefix}${target}${suffix}`;
        return;
      }

      const duration = 2000;
      let startTime = null;

      const step = (timestamp) => {
        if (!startTime) startTime = timestamp;
        const elapsed = timestamp - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Ease-out cubic: 1 - (1 - t)^3
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(eased * target);

        el.textContent = `${prefix}${current}${suffix}`;

        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          el.textContent = `${prefix}${target}${suffix}`;
        }
      };

      requestAnimationFrame(step);
    };

    const counterObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -50px 0px' }
    );

    counters.forEach(el => counterObserver.observe(el));
  };

  /* ----------------------------------------------------------
     3. Active Navigation Tracking
  ---------------------------------------------------------- */
  const initActiveNav = () => {
    const sectionIds = ['hero', 'about', 'skills', 'work', 'philosophy', 'contact'];
    const sections = sectionIds
      .map(id => document.getElementById(id))
      .filter(Boolean);

    const navLinks = document.querySelectorAll('.nav-link');
    if (!sections.length || !navLinks.length) return;

    const OFFSET = 120; // navbar height + buffer

    const setActiveLink = (id) => {
      navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === `#${id}`) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      });
    };

    let ticking = false;

    const onScroll = () => {
      if (ticking) return;
      ticking = true;

      requestAnimationFrame(() => {
        const scrollY = window.scrollY + OFFSET;
        let currentSection = sections[0];

        for (const section of sections) {
          if (section.offsetTop <= scrollY) {
            currentSection = section;
          }
        }

        setActiveLink(currentSection.id);
        ticking = false;
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // set initial state
  };

  /* ----------------------------------------------------------
     4. Smooth Scroll for Nav Links
  ---------------------------------------------------------- */
  const initSmoothScroll = () => {
    const NAVBAR_HEIGHT = 80;
    const mobileMenu = document.querySelector('.mobile-menu');

    const closeMobileMenu = () => {
      if (mobileMenu) mobileMenu.classList.remove('active');
      const menuBtn = document.querySelector('.mobile-menu-btn');
      if (menuBtn) menuBtn.classList.remove('active');
    };

    const scrollToTarget = (hash) => {
      const target = document.querySelector(hash);
      if (!target) return;

      const top = target.getBoundingClientRect().top + window.pageYOffset - NAVBAR_HEIGHT;
      window.scrollTo({ top, behavior: 'smooth' });
      closeMobileMenu();
    };

    // Nav links
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', (e) => {
        const hash = link.getAttribute('href');
        if (hash && hash.startsWith('#')) {
          e.preventDefault();
          scrollToTarget(hash);
        }
      });
    });

    // CTA button in nav → #contact
    const navCta = document.querySelector('.nav-cta-btn');
    if (navCta) {
      navCta.addEventListener('click', (e) => {
        const hash = navCta.getAttribute('href');
        if (hash && hash.startsWith('#')) {
          e.preventDefault();
          scrollToTarget(hash);
        }
      });
    }

    // Mobile-menu links
    if (mobileMenu) {
      mobileMenu.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', (e) => {
          const hash = link.getAttribute('href');
          if (hash) {
            e.preventDefault();
            scrollToTarget(hash);
          }
        });
      });
    }

    // Any other anchor links with href="#..."
    document.querySelectorAll('a[href^="#"]').forEach(link => {
      // Avoid double-binding on already handled elements
      if (
        link.classList.contains('nav-link') ||
        link.classList.contains('nav-cta-btn') ||
        (mobileMenu && mobileMenu.contains(link))
      ) return;

      link.addEventListener('click', (e) => {
        const hash = link.getAttribute('href');
        if (hash && hash.length > 1) {
          e.preventDefault();
          scrollToTarget(hash);
        }
      });
    });
  };

  /* ----------------------------------------------------------
     5. Navbar Scroll Effect
  ---------------------------------------------------------- */
  const initNavbarScroll = () => {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;

    let ticking = false;

    const onScroll = () => {
      if (ticking) return;
      ticking = true;

      requestAnimationFrame(() => {
        if (window.scrollY > 50) {
          navbar.classList.add('scrolled');
        } else {
          navbar.classList.remove('scrolled');
        }
        ticking = false;
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });

    // Set initial state
    onScroll();
  };

  /* ----------------------------------------------------------
     6. Hero Canvas — Animated Scatter Plot
  ---------------------------------------------------------- */
  const initHeroCanvas = () => {
    const canvas = document.getElementById('hero-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const PARTICLE_COUNT = 60;
    const GRID_LINE_COUNT = 8;

    // Color palette
    const COLORS = [
      'rgba(196,113,59,0.18)',   // copper
      'rgba(74,144,217,0.12)',   // blue
      'rgba(26,26,46,0.08)',     // dark muted
    ];

    let particles = [];
    let animationId = null;

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      canvas.width = parent.offsetWidth;
      canvas.height = parent.offsetHeight;
    };

    const createParticles = () => {
      particles = [];
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          radius: 1 + Math.random() * 2,
          opacity: 0.1 + Math.random() * 0.4,
          color: COLORS[Math.floor(Math.random() * COLORS.length)],
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
        });
      }
    };

    const drawGrid = () => {
      ctx.strokeStyle = 'rgba(26,26,46,0.04)';
      ctx.lineWidth = 1;

      const spacingX = canvas.width / GRID_LINE_COUNT;
      const spacingY = canvas.height / GRID_LINE_COUNT;

      for (let i = 1; i < GRID_LINE_COUNT; i++) {
        // Vertical
        ctx.beginPath();
        ctx.moveTo(i * spacingX, 0);
        ctx.lineTo(i * spacingX, canvas.height);
        ctx.stroke();

        // Horizontal
        ctx.beginPath();
        ctx.moveTo(0, i * spacingY);
        ctx.lineTo(canvas.width, i * spacingY);
        ctx.stroke();
      }
    };

    const drawRegressionLine = () => {
      ctx.save();
      ctx.strokeStyle = 'rgba(196,113,59,0.12)';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([8, 6]);
      ctx.beginPath();
      ctx.moveTo(canvas.width * 0.1, canvas.height * 0.85);
      ctx.lineTo(canvas.width * 0.9, canvas.height * 0.15);
      ctx.stroke();
      ctx.restore();
    };

    const drawParticles = () => {
      particles.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.opacity;
        ctx.fill();
        ctx.globalAlpha = 1;
      });
    };

    const updateParticles = () => {
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;

        // Wrap around edges
        if (p.x < -p.radius) p.x = canvas.width + p.radius;
        if (p.x > canvas.width + p.radius) p.x = -p.radius;
        if (p.y < -p.radius) p.y = canvas.height + p.radius;
        if (p.y > canvas.height + p.radius) p.y = -p.radius;
      });
    };

    const drawFrame = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawGrid();
      drawRegressionLine();
      drawParticles();
    };

    const animate = () => {
      updateParticles();
      drawFrame();
      animationId = requestAnimationFrame(animate);
    };

    // Debounced resize handler
    let resizeTimer;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        resize();
        createParticles();
        if (prefersReducedMotion) drawFrame();
      }, 150);
    };

    // Initialise
    resize();
    createParticles();

    if (prefersReducedMotion) {
      drawFrame(); // Static single frame
    } else {
      animate();
    }

    window.addEventListener('resize', handleResize, { passive: true });
  };

  /* ----------------------------------------------------------
     7. Mobile Menu Toggle
  ---------------------------------------------------------- */
  const initMobileMenu = () => {
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const mobileMenu = document.querySelector('.mobile-menu');
    if (!menuBtn || !mobileMenu) return;

    menuBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      menuBtn.classList.toggle('active');
      mobileMenu.classList.toggle('active');
    });

    // Close when clicking a link inside the mobile menu
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        menuBtn.classList.remove('active');
        mobileMenu.classList.remove('active');
      });
    });

    // Close when clicking outside
    document.addEventListener('click', (e) => {
      if (
        mobileMenu.classList.contains('active') &&
        !mobileMenu.contains(e.target) &&
        !menuBtn.contains(e.target)
      ) {
        menuBtn.classList.remove('active');
        mobileMenu.classList.remove('active');
      }
    });
  };

  /* ----------------------------------------------------------
     8. CV Download Handler (stay on page)
  ---------------------------------------------------------- */
  const initCVDownload = () => {
    const cvLinks = document.querySelectorAll('a[download]');
    if (!cvLinks.length) return;

    cvLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const href = link.getAttribute('href');
        if (!href) return;

        // Fetch the file as a blob and trigger download
        fetch(href)
          .then(res => res.blob())
          .then(blob => {
            const url = URL.createObjectURL(blob);
            const tmp = document.createElement('a');
            tmp.href = url;
            tmp.download = href.split('/').pop() || 'Radhika_Gulati_CV.pdf';
            document.body.appendChild(tmp);
            tmp.click();
            document.body.removeChild(tmp);
            URL.revokeObjectURL(url);
          })
          .catch(() => {
            // Fallback: open in new tab if fetch fails (e.g. file:// protocol)
            window.open(href, '_blank');
          });
      });
    });
  };

  /* ----------------------------------------------------------
     9. Scroll-to-Top Button
  ---------------------------------------------------------- */
  const initScrollToTop = () => {
    const btn = document.getElementById('scroll-to-top');
    if (!btn) return;

    const SHOW_THRESHOLD = 400; // px from top before button appears
    let ticking = false;

    const onScroll = () => {
      if (ticking) return;
      ticking = true;

      requestAnimationFrame(() => {
        if (window.scrollY > SHOW_THRESHOLD) {
          btn.classList.add('visible');
        } else {
          btn.classList.remove('visible');
        }
        ticking = false;
      });
    };

    btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // set initial state
  };

  /* ----------------------------------------------------------
     Initialise Everything
  ---------------------------------------------------------- */
  initScrollReveal();
  initCounters();
  initActiveNav();
  initSmoothScroll();
  initNavbarScroll();
  initHeroCanvas();
  initMobileMenu();
  initCVDownload();
  initScrollToTop();
});
