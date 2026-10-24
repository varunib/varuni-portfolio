const nav = document.querySelector('#main-nav');
const menuToggle = document.querySelector('.menu-toggle');
const mobileNav = window.matchMedia('(max-width: 720px)');

if (nav && menuToggle) {
  const closeMenu = (restoreFocus = false) => {
    nav.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
    if (restoreFocus) menuToggle.focus();
  };

  menuToggle.addEventListener('click', () => {
    const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
    nav.classList.toggle('open', !isOpen && mobileNav.matches);
    menuToggle.setAttribute('aria-expanded', String(!isOpen && mobileNav.matches));
  });

  nav.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', () => closeMenu());
  });

  document.addEventListener('click', event => {
    if (
      mobileNav.matches &&
      menuToggle.getAttribute('aria-expanded') === 'true' &&
      event.target instanceof Node &&
      !nav.contains(event.target) &&
      !menuToggle.contains(event.target)
    ) {
      closeMenu();
    }
  });

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && menuToggle.getAttribute('aria-expanded') === 'true') {
      closeMenu(true);
    }
  });

  mobileNav.addEventListener('change', () => closeMenu());
}

document.querySelectorAll('.skill-icon-image').forEach(image => {
  const fallback = image.nextElementSibling;
  const showIcon = () => {
    image.classList.add('is-loaded');
    fallback.hidden = true;
  };
  const showFallback = () => {
    image.classList.remove('is-loaded');
    fallback.hidden = false;
  };

  image.addEventListener('load', showIcon, { once: true });
  image.addEventListener('error', showFallback, { once: true });

  if (image.complete) {
    if (image.naturalWidth > 0) showIcon();
    else showFallback();
  }
});

const revealTargets = document.querySelectorAll(
  '.project-card, .about-grid > *, .contact-section > *'
);

if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.14 });

  revealTargets.forEach(target => {
    target.classList.add('reveal');
    observer.observe(target);
  });
}

const cursor = document.querySelector('.cursor-glow');
if (cursor) {
  window.addEventListener('pointermove', event => {
    cursor.style.transform = `translate(${event.clientX}px,${event.clientY}px)`;
  });
}


// ── PROJECT FILTERING ──
const filterTabs = document.querySelectorAll('.filter-tab');
const projectCards = document.querySelectorAll('.project-card');

if (filterTabs.length > 0 && projectCards.length > 0) {
  filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // Toggle active states
      filterTabs.forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');

      const filterValue = tab.getAttribute('data-filter');

      projectCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue) {
          card.classList.remove('is-filtered-out');
          card.classList.remove('is-animating');
          void card.offsetWidth; // Trigger reflow for smooth animation
          card.classList.add('is-animating');
        } else {
          card.classList.add('is-filtered-out');
        }
      });
    });
  });
}
