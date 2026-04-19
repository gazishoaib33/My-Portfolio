/* ============================================================
   Gazi Shoaib — Portfolio Animations & Interactions
   Replaces the existing script.js completely
   ============================================================ */

/* ── 1. CURSOR GLOW ─────────────────────────────────────── */
const cursor = document.createElement('div');
cursor.id = 'cursor-glow';
cursor.style.cssText = `
  position:fixed;width:320px;height:320px;border-radius:50%;
  background:radial-gradient(circle,rgba(240,165,0,0.07) 0%,transparent 70%);
  pointer-events:none;z-index:0;transform:translate(-50%,-50%);
  transition:opacity 0.3s;top:0;left:0;
`;
document.body.appendChild(cursor);

let mx = 0, my = 0, cx = 0, cy = 0;
document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
(function animateCursor() {
  cx += (mx - cx) * 0.08;
  cy += (my - cy) * 0.08;
  cursor.style.left = cx + 'px';
  cursor.style.top  = cy + 'px';
  requestAnimationFrame(animateCursor);
})();


/* ── 2. NAVBAR: HIDE ON SCROLL DOWN, SHOW ON SCROLL UP ─── */
const nav = document.querySelector('nav') || document.querySelector('header');
if (nav) {
  let lastY = 0, ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const y = window.scrollY;
        if (y > 80) {
          nav.style.transform = y > lastY ? 'translateY(-100%)' : 'translateY(0)';
          nav.style.backdropFilter = 'blur(16px)';
          nav.style.background = 'rgba(10,12,15,0.9)';
          nav.style.boxShadow = '0 1px 0 rgba(255,255,255,0.05)';
        } else {
          nav.style.transform = 'translateY(0)';
          nav.style.background = '';
          nav.style.boxShadow = '';
        }
        lastY = y;
        ticking = false;
      });
      ticking = true;
    }
  });
}


/* ── 3. ACTIVE NAV LINK ON SCROLL ───────────────────────── */
const sections  = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('nav a[href^="#"]');
const observer  = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      navLinks.forEach(l => {
        const active = l.getAttribute('href') === '#' + e.target.id;
        l.style.color  = active ? 'var(--amber, #f0a500)' : '';
        l.style.opacity = active ? '1' : '';
      });
    }
  });
}, { threshold: 0.4 });
sections.forEach(s => observer.observe(s));


/* ── 4. HERO ENTRANCE — staggered fade+slide ────────────── */
function heroEntrance() {
  const heroEls = document.querySelectorAll(
    '.hero h1, .hero p, .hero .cta-buttons, .hero .stats, ' +
    'section.hero > *, #hero > *, .hero-content > *'
  );
  const fallback = document.querySelectorAll('h1, .hero p, .hero a, .stat-item');

  const targets = heroEls.length ? heroEls : fallback;
  targets.forEach((el, i) => {
    el.style.opacity   = '0';
    el.style.transform = 'translateY(28px)';
    el.style.transition = `opacity 0.7s ease ${i * 0.12}s, transform 0.7s ease ${i * 0.12}s`;
    setTimeout(() => {
      el.style.opacity   = '1';
      el.style.transform = 'translateY(0)';
    }, 100 + i * 120);
  });
}
document.addEventListener('DOMContentLoaded', heroEntrance);


/* ── 5. SCROLL REVEAL ───────────────────────────────────── */
const revealObs = new IntersectionObserver((entries, obs) => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    const el   = e.target;
    const dir  = el.dataset.reveal || 'up';
    const del  = el.dataset.delay  || '0';
    const from = { up:'translateY(40px)', left:'translateX(-40px)', right:'translateX(40px)', fade:'scale(0.96)' };
    el.style.transition = `opacity 0.65s ease ${del}s, transform 0.65s ease ${del}s`;
    el.style.opacity    = '1';
    el.style.transform  = 'none';
    obs.unobserve(el);
  });
}, { threshold: 0.12 });

function setupReveal() {
  /* Auto-tag all major sections, project cards, skill groups, experience items */
  const selectors = [
    'section > .section-header, section > h2',
    '.project-card, .project-item, article.project',
    '.skill-group, .skills-category',
    '.experience-item, .timeline-item',
    '.contact-card, .contact-info',
    '.about-text, .about-content',
    'footer'
  ];

  selectors.forEach((sel, gi) => {
    document.querySelectorAll(sel).forEach((el, i) => {
      if (el.dataset.revealDone) return;
      el.dataset.revealDone = '1';
      el.dataset.reveal = gi % 2 === 0 ? 'up' : (i % 2 === 0 ? 'left' : 'right');
      el.dataset.delay  = (i * 0.1).toFixed(2);
      el.style.opacity  = '0';
      el.style.transform = el.dataset.reveal === 'up'    ? 'translateY(40px)'  :
                           el.dataset.reveal === 'left'  ? 'translateX(-40px)' :
                           el.dataset.reveal === 'right' ? 'translateX(40px)'  : 'scale(0.96)';
      revealObs.observe(el);
    });
  });
}
document.addEventListener('DOMContentLoaded', setupReveal);


/* ── 6. COUNTER ANIMATION ───────────────────────────────── */
function animateCounter(el) {
  const text   = el.textContent.trim();
  const numStr = text.replace(/[^0-9.]/g, '');
  const num    = parseFloat(numStr);
  if (isNaN(num)) return;

  const suffix = text.replace(numStr, '').replace(/^\d+/, '');
  const prefix = text.match(/^[^0-9]*/)?.[0] || '';
  const dur    = 1800;
  const start  = performance.now();
  const isInt  = Number.isInteger(num);

  function step(now) {
    const t    = Math.min((now - start) / dur, 1);
    const ease = 1 - Math.pow(1 - t, 3);
    const val  = isInt ? Math.round(ease * num) : Math.round(ease * num * 10) / 10;
    el.textContent = prefix + val + suffix;
    if (t < 1) requestAnimationFrame(step);
    else el.textContent = text; // restore exact original
  }
  requestAnimationFrame(step);
}

const counterObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    const numEls = e.target.querySelectorAll
      ? e.target.querySelectorAll('.stat-number, .stat-value, [class*="stat"] > span, .counter')
      : [];
    // Also try to find bare number elements inside stat containers
    if (!numEls.length) {
      // Find elements that are purely numeric (with optional suffix)
      const all = e.target.querySelectorAll('*');
      all.forEach(el => {
        if (el.children.length === 0 && /^\d[\d.]*[+%xX]?$/.test(el.textContent.trim())) {
          animateCounter(el);
        }
      });
    } else {
      numEls.forEach(animateCounter);
    }
    counterObs.unobserve(e.target);
  });
}, { threshold: 0.5 });

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.stat, .stat-item, .metric, [class*="stat-"]').forEach(el => {
    counterObs.observe(el);
  });
  // Fallback: find any element with a number+symbol pattern
  document.querySelectorAll('*').forEach(el => {
    if (el.children.length === 0 && /^\d[\d.]*[+%]$/.test(el.textContent.trim())) {
      counterObs.observe(el.parentElement || el);
    }
  });
});


/* ── 7. SKILL TAGS STAGGER POP-IN ───────────────────────── */
const skillTagObs = new IntersectionObserver((entries, obs) => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    const tags = e.target.querySelectorAll('span, .tag, .skill-tag, .tech-tag');
    tags.forEach((tag, i) => {
      tag.style.opacity   = '0';
      tag.style.transform = 'scale(0.8) translateY(8px)';
      tag.style.transition = `opacity 0.35s ease ${i * 0.045}s, transform 0.35s ease ${i * 0.045}s`;
      setTimeout(() => {
        tag.style.opacity   = '1';
        tag.style.transform = 'scale(1) translateY(0)';
      }, 80 + i * 45);
    });
    obs.unobserve(e.target);
  });
}, { threshold: 0.3 });

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.skill-group, .skills-category, .tech-stack, .tags').forEach(el => {
    skillTagObs.observe(el);
  });
});


/* ── 8. PROJECT CARDS — TILT ON HOVER ───────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.project-card, .project-item, article.project').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r   = card.getBoundingClientRect();
      const x   = (e.clientX - r.left) / r.width  - 0.5;
      const y   = (e.clientY - r.top)  / r.height - 0.5;
      card.style.transform = `perspective(600px) rotateY(${x * 6}deg) rotateX(${-y * 4}deg) translateY(-4px)`;
      card.style.transition = 'transform 0.1s ease, box-shadow 0.2s ease';
      card.style.boxShadow  = `${-x * 12}px ${-y * 12}px 40px rgba(240,165,0,0.08)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform  = 'perspective(600px) rotateY(0) rotateX(0) translateY(0)';
      card.style.transition = 'transform 0.5s ease, box-shadow 0.5s ease';
      card.style.boxShadow  = '';
    });
  });
});


/* ── 9. TYPEWRITER — hero subheading ────────────────────── */
function typewriter(el, text, speed = 38) {
  el.textContent = '';
  el.style.borderRight = '2px solid var(--amber, #f0a500)';
  el.style.display = 'inline';
  let i = 0;
  function type() {
    if (i < text.length) {
      el.textContent += text[i++];
      setTimeout(type, speed + Math.random() * 20);
    } else {
      // Blink then remove cursor
      setTimeout(() => { el.style.borderRight = 'none'; }, 1200);
    }
  }
  type();
}

document.addEventListener('DOMContentLoaded', () => {
  // Target the hero paragraph / tagline
  const tagline = document.querySelector('.hero p, .hero-tagline, .hero .subtitle, .hero-description');
  if (tagline && tagline.textContent.trim().length < 200) {
    const text = tagline.textContent.trim();
    setTimeout(() => typewriter(tagline, text, 28), 800);
  }
});


/* ── 10. SMOOTH SCROLL for nav links ────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id  = a.getAttribute('href').slice(1);
    const el  = document.getElementById(id);
    if (!el) return;
    e.preventDefault();
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});


/* ── 11. CONTACT FORM — micro-feedback ──────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('form, .contact-form');
  if (!form) return;

  const btn = form.querySelector('button[type="submit"], input[type="submit"], .submit-btn');
  if (!btn) return;

  form.addEventListener('submit', e => {
    btn.textContent = 'Sending…';
    btn.disabled    = true;
    btn.style.opacity = '0.7';
    // Re-enable after 3s as fallback (real submit still fires)
    setTimeout(() => {
      btn.textContent = 'Sent ✓';
      btn.style.background = '#00d68f';
      btn.style.color      = '#000';
      setTimeout(() => {
        btn.textContent = 'Send Message →';
        btn.disabled    = false;
        btn.style.opacity   = '1';
        btn.style.background = '';
        btn.style.color      = '';
      }, 2500);
    }, 1200);
  });
});


/* ── 12. PAGE LOAD PROGRESS BAR ─────────────────────────── */
const bar = document.createElement('div');
bar.style.cssText = `
  position:fixed;top:0;left:0;height:2px;width:0;z-index:9999;
  background:linear-gradient(90deg,#f0a500,#ffd060);
  transition:width 0.3s ease;pointer-events:none;
`;
document.body.prepend(bar);

let prog = 0;
const fill = setInterval(() => {
  prog = Math.min(prog + Math.random() * 15, 85);
  bar.style.width = prog + '%';
}, 120);

window.addEventListener('load', () => {
  clearInterval(fill);
  bar.style.width = '100%';
  setTimeout(() => { bar.style.opacity = '0'; bar.style.transition += ',opacity 0.4s'; }, 300);
});


/* ── 13. SCROLL PROGRESS INDICATOR ─────────────────────── */
const scrollBar = document.createElement('div');
scrollBar.style.cssText = `
  position:fixed;top:0;left:0;height:2px;z-index:9998;
  background:rgba(240,165,0,0.35);pointer-events:none;
  width:0;transition:width 0.1s linear;
`;
document.body.prepend(scrollBar);

window.addEventListener('scroll', () => {
  const pct = window.scrollY / (document.body.scrollHeight - window.innerHeight) * 100;
  scrollBar.style.width = pct + '%';
});


/* ── 14. FOOTER ENTRANCE ─────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  const footer = document.querySelector('footer');
  if (!footer) return;
  footer.style.opacity   = '0';
  footer.style.transform = 'translateY(20px)';
  const fo = new IntersectionObserver(([e]) => {
    if (!e.isIntersecting) return;
    footer.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    footer.style.opacity    = '1';
    footer.style.transform  = 'translateY(0)';
    fo.disconnect();
  }, { threshold: 0.2 });
  fo.observe(footer);
});
