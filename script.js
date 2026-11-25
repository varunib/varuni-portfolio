const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#navLinks');

if (menuButton && navigation) {
  const closeMenu = () => {
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', 'Open menu');
    navigation.classList.remove('open');
  };

  menuButton.addEventListener('click', () => {
    const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
    menuButton.setAttribute('aria-expanded', String(!isOpen));
    menuButton.setAttribute('aria-label', isOpen ? 'Open menu' : 'Close menu');
    navigation.classList.toggle('open', !isOpen);
  });

  navigation.addEventListener('click', event => {
    if (event.target instanceof HTMLAnchorElement) {
      closeMenu();
    }
  });

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') {
      closeMenu();
      menuButton.focus();
    }
  });

  window.matchMedia('(min-width: 901px)').addEventListener('change', closeMenu);
}

// ── Typewriter Effect ──
const words = [
  'AI & Full-Stack Developer',
  'Python & GenAI Engineer',
  'FastAPI & React Specialist',
  'LLM & RAG Builder'
];
const typewriterEl = document.getElementById('typewriterText');

if (typewriterEl) {
  let wordIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  const typeSpeed = 90;
  const deleteSpeed = 45;
  const pauseEnd = 1600;

  function type() {
    const currentWord = words[wordIndex];
    if (isDeleting) {
      typewriterEl.textContent = currentWord.substring(0, charIndex - 1);
      charIndex--;
    } else {
      typewriterEl.textContent = currentWord.substring(0, charIndex + 1);
      charIndex++;
    }

    let delay = isDeleting ? deleteSpeed : typeSpeed;

    if (!isDeleting && charIndex === currentWord.length) {
      delay = pauseEnd;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      wordIndex = (wordIndex + 1) % words.length;
      delay = 400;
    }

    setTimeout(type, delay);
  }

  type();
}

// ── Project Category Filters ──
const filterButtons = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card-item');

if (filterButtons.length && projectCards.length) {
  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;

      projectCards.forEach(card => {
        if (filter === 'all') {
          card.classList.remove('hidden');
        } else {
          const categories = card.dataset.category || '';
          if (categories.includes(filter)) {
            card.classList.remove('hidden');
          } else {
            card.classList.add('hidden');
          }
        }
      });
    });
  });
}

// ── Lightbox Image Modal ──
const modal = document.getElementById('imageModal');
const modalImg = document.getElementById('modalImg');
const modalTitle = document.getElementById('modalTitle');
const modalClose = document.getElementById('modalClose');
const backdrop = document.querySelector('.modal-backdrop');
const triggers = document.querySelectorAll('.lightbox-trigger');

if (modal && modalImg) {
  const openModal = (src, alt, title) => {
    modalImg.src = src;
    modalImg.alt = alt;
    if (modalTitle && title) modalTitle.textContent = title;
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    modalImg.src = '';
  };

  triggers.forEach(trigger => {
    trigger.addEventListener('click', () => {
      const src = trigger.getAttribute('data-full') || trigger.src;
      const alt = trigger.alt || trigger.getAttribute('aria-label') || 'Preview view';
      const title = trigger.getAttribute('aria-label') || trigger.closest('.project-card-item')?.querySelector('h3')?.textContent || 'Preview View';
      openModal(src, alt, title);
    });
  });

  if (modalClose) modalClose.addEventListener('click', closeModal);
  if (backdrop) backdrop.addEventListener('click', closeModal);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('open')) {
      closeModal();
    }
  });
}

// ── Copy Email & Toast Notification ──
const copyEmailBtn = document.getElementById('copyEmailBtn');
const copyBadge = document.getElementById('copyBadge');
const toast = document.getElementById('toast');
const toastMessage = document.getElementById('toastMessage');

function showToast(msg) {
  if (!toast) return;
  if (toastMessage) toastMessage.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 2800);
}

if (copyEmailBtn) {
  copyEmailBtn.addEventListener('click', async () => {
    const email = 'varunibennur7@gmail.com';
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(email);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = email;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      if (copyBadge) copyBadge.textContent = 'Copied!';
      showToast('✓ Email copied to clipboard!');
      setTimeout(() => {
        if (copyBadge) copyBadge.textContent = 'Copy';
      }, 2000);
    } catch (err) {
      showToast('varunibennur7@gmail.com');
    }
  });
}

// ── Contact Form Handler ──
const contactForm = document.getElementById('contactForm');
const formFeedback = document.getElementById('formFeedback');

if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('senderName')?.value || '';
    const email = document.getElementById('senderEmail')?.value || '';
    const msg = document.getElementById('senderMsg')?.value || '';

    // Direct mailto compose with pre-filled sender info
    const subject = encodeURIComponent(`Portfolio Inquiry from ${name}`);
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${msg}`);
    
    if (formFeedback) {
      formFeedback.className = 'form-feedback success';
      formFeedback.textContent = '✓ Opening email client with your message...';
    }

    window.location.href = `mailto:varunibennur7@gmail.com?subject=${subject}&body=${body}`;

    setTimeout(() => {
      contactForm.reset();
      if (formFeedback) {
        formFeedback.textContent = '✓ Note prepared! Thank you for reaching out.';
      }
    }, 1500);
  });
}
