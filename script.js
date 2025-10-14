// Mobile navigation toggle
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.getElementById('navMenu');
if (navToggle && navMenu) {
  navToggle.addEventListener('click', () => {
    const isOpen = navMenu.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });
}

// Intersection Observer for reveal-on-scroll
const revealEls = document.querySelectorAll('.reveal');
const io = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      io.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });
revealEls.forEach(el => io.observe(el));

// Active menu highlighting based on section in view
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.site-nav a');
const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute('id');
      navLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
      });
    }
  });
}, { rootMargin: '-40% 0px -50% 0px', threshold: 0.01 });
sections.forEach(sec => sectionObserver.observe(sec));

// Footer year
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Enhance mailto with subject/body composed from fields (progressive enhancement)
const form = document.querySelector('.contact-form');
if (form) {
  form.addEventListener('submit', (e) => {
    const name = document.getElementById('name')?.value?.trim() || '';
    const email = document.getElementById('email')?.value?.trim() || '';
    const message = document.getElementById('message')?.value?.trim() || '';
    const subject = encodeURIComponent(`Contact portfolio – ${name || 'Sans nom'}`);
    const body = encodeURIComponent(`Nom: ${name}\nEmail: ${email}\n\n${message}`);
    const mailto = `mailto:elias.boinali@epita.fr?subject=${subject}&body=${body}`;
    form.setAttribute('action', mailto);
    // Let the browser handle the navigation to mailto
  });
}

// Theme toggle with persistence
const THEME_KEY = 'pref-theme';
const root = document.documentElement;
const toggleBtn = document.getElementById('themeToggle');

function applyTheme(theme) {
  if (theme === 'dark') {
    root.setAttribute('data-theme', 'dark');
    toggleBtn && (toggleBtn.innerHTML = '<i class="fas fa-sun" aria-hidden="true"></i>');
  } else {
    root.removeAttribute('data-theme');
    toggleBtn && (toggleBtn.innerHTML = '<i class="fas fa-moon" aria-hidden="true"></i>');
  }
}

function detectInitialTheme() {
  const saved = localStorage.getItem(THEME_KEY);
  if (saved === 'light' || saved === 'dark') return saved;
  return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

let currentTheme = detectInitialTheme();
applyTheme(currentTheme);

toggleBtn?.addEventListener('click', () => {
  currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
  localStorage.setItem(THEME_KEY, currentTheme);
  applyTheme(currentTheme);
});

// Project modals
function openModal(modal) {
  if (!modal) return;
  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeModal(modal) {
  if (!modal) return;
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

document.querySelectorAll('.project-card, .open-project').forEach(trigger => {
  trigger.addEventListener('click', (e) => {
    const targetId = trigger.getAttribute('data-modal-target');
    const modal = document.getElementById(targetId);
    openModal(modal);
  });
  trigger.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      const targetId = trigger.getAttribute('data-modal-target');
      const modal = document.getElementById(targetId);
      openModal(modal);
    }
  });
});

document.querySelectorAll('.modal').forEach(modal => {
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal(modal);
  });
  modal.querySelector('.modal-close')?.addEventListener('click', () => closeModal(modal));
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    document.querySelectorAll('.modal.open').forEach(m => closeModal(m));
  }
});

// === Galerie interactive pour le projet mot mêlé ===
document.querySelectorAll('[data-gallery]').forEach(gallery => {
  const mainImg = gallery.querySelector('.gallery-main img');
  const thumbs = gallery.querySelectorAll('.gallery-thumbs img');
  const mainCaption = gallery.querySelector('.gallery-main figcaption');

  // Récupère toutes les légendes des miniatures
  const thumbCaptions = Array.from(
    gallery.querySelectorAll('.gallery-thumbs figure figcaption')
  ).map(caption => caption.textContent.trim());

  thumbs.forEach((thumb, i) => {
    thumb.addEventListener('click', () => {
      // Réinitialise les miniatures actives
      thumbs.forEach(t => t.classList.remove('is-active'));

      // Active la miniature cliquée
      thumb.classList.add('is-active');

      // Change l'image principale
      const fullSrc = thumb.dataset.full;
      if (fullSrc) mainImg.src = fullSrc;

      // Met à jour la légende principale
      if (mainCaption && thumbCaptions[i]) {
        mainCaption.textContent = thumbCaptions[i];
      }
    });
  });
});



