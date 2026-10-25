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


// ── RESUME MODAL ──
const resumeModal = document.querySelector('#resume-modal');
const resumeTriggers = document.querySelectorAll('.resume-trigger');
const modalCloseBtn = document.querySelector('.modal-close');

if (resumeModal && resumeTriggers.length > 0) {
  const openModal = () => {
    resumeModal.hidden = false;
    requestAnimationFrame(() => {
      resumeModal.classList.add('is-open');
      document.body.classList.add('modal-open');
    });
  };

  const closeModal = () => {
    resumeModal.classList.remove('is-open');
    document.body.classList.remove('modal-open');
    setTimeout(() => {
      resumeModal.hidden = true;
    }, 250);
  };

  resumeTriggers.forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault();
      openModal();
    });
  });

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeModal);
  }

  resumeModal.addEventListener('click', e => {
    if (e.target === resumeModal) {
      closeModal();
    }
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && !resumeModal.hidden) {
      closeModal();
    }
  });
}


// ── HERO ROLE TYPEWRITER ──
const roleRotator = document.querySelector('#role-rotator');
if (roleRotator && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const roles = [
    'Software Engineer',
    'Applied AI & ML Developer',
    'Full-Stack Web Builder',
    'Backend & API Specialist'
  ];
  let roleIndex = 0;
  let charIndex = roles[0].length;
  let isDeleting = true;

  const typeSpeed = 70;
  const deleteSpeed = 35;
  const pauseBetween = 2200;

  const tick = () => {
    const currentRole = roles[roleIndex];

    if (isDeleting) {
      charIndex--;
      roleRotator.textContent = currentRole.substring(0, charIndex);
    } else {
      charIndex++;
      roleRotator.textContent = currentRole.substring(0, charIndex);
    }

    if (!isDeleting && charIndex === currentRole.length) {
      isDeleting = true;
      setTimeout(tick, pauseBetween);
      return;
    }

    if (isDeleting && charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      setTimeout(tick, 300);
      return;
    }

    const nextDelay = isDeleting ? deleteSpeed : typeSpeed;
    setTimeout(tick, nextDelay);
  };

  setTimeout(tick, pauseBetween);
}


// ── INTERACTIVE CONTACT FORM ──
const contactForm = document.querySelector('#contact-form');
if (contactForm) {
  const nameInput = contactForm.querySelector('#form-name');
  const emailInput = contactForm.querySelector('#form-email');
  const messageInput = contactForm.querySelector('#form-message');
  const charCounter = contactForm.querySelector('#form-char-count');
  const submitBtn = contactForm.querySelector('#form-submit-btn');
  const btnSpinner = submitBtn ? submitBtn.querySelector('.btn-spinner') : null;
  const btnText = submitBtn ? submitBtn.querySelector('.btn-text') : null;
  const formStatus = document.querySelector('#form-status');

  // Live character counter
  if (messageInput && charCounter) {
    const maxChars = messageInput.getAttribute('maxlength') || 800;
    messageInput.addEventListener('input', () => {
      const length = messageInput.value.length;
      charCounter.textContent = `${length} / ${maxChars}`;
    });
  }

  const showStatus = (type, htmlMessage) => {
    if (!formStatus) return;
    formStatus.hidden = false;
    formStatus.className = `form-status is-${type}`;
    formStatus.innerHTML = htmlMessage;
    formStatus.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  };

  contactForm.addEventListener('submit', async event => {
    event.preventDefault();

    const name = nameInput ? nameInput.value.trim() : '';
    const email = emailInput ? emailInput.value.trim() : '';
    const message = messageInput ? messageInput.value.trim() : '';
    const topicRadio = contactForm.querySelector('input[name="topic"]:checked');
    const topic = topicRadio ? topicRadio.value : 'Job Opportunity';

    // Basic validation
    if (!name) {
      showStatus('error', 'Please enter your name.');
      nameInput?.focus();
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      showStatus('error', 'Please enter a valid email address.');
      emailInput?.focus();
      return;
    }

    if (!message || message.length < 10) {
      showStatus('error', 'Please enter a message (at least 10 characters).');
      messageInput?.focus();
      return;
    }

    // Set loading state
    if (submitBtn) submitBtn.disabled = true;
    if (btnSpinner) btnSpinner.hidden = false;
    const originalBtnText = btnText ? btnText.innerHTML : 'Send Message';
    if (btnText) btnText.innerHTML = 'Sending...';
    if (formStatus) formStatus.hidden = true;

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 12000);

      const response = await fetch('https://formsubmit.co/ajax/varunibennur7@gmail.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          name: name,
          email: email,
          _subject: `Portfolio [${topic}] inquiry from ${name}`,
          topic: topic,
          message: message
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        showStatus(
          'success',
          `✅ <strong>Message sent successfully!</strong> Thank you ${name}, I'll review your note and respond to <em>${email}</em> promptly.`
        );
        contactForm.reset();
        if (charCounter) charCounter.textContent = '0 / 800';
      } else {
        throw new Error('Service responded with an error');
      }
    } catch (err) {
      console.warn('Direct form submission error:', err);
      const fallbackMailto = `mailto:varunibennur7@gmail.com?subject=${encodeURIComponent(
        `Portfolio [${topic}] inquiry from ${name}`
      )}&body=${encodeURIComponent(
        `Hi Varuni,\n\nName: ${name}\nEmail: ${email}\nTopic: ${topic}\n\n${message}`
      )}`;

      showStatus(
        'error',
        `⚠️ Could not submit directly. <a href="${fallbackMailto}" target="_blank" rel="noopener noreferrer">Click here to send via your email client ↗</a>`
      );
    } finally {
      if (submitBtn) submitBtn.disabled = false;
      if (btnSpinner) btnSpinner.hidden = true;
      if (btnText) btnText.innerHTML = originalBtnText;
    }
  });
}
