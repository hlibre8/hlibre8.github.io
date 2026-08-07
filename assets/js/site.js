(() => {
  const header = document.querySelector('.site-header');
  const heroStage = document.querySelector('.hero-stage');
  const aboutPanel = document.querySelector('.about-panel');
  const scrollCue = document.querySelector('.scroll-cue');
  const menuButton = document.querySelector('.menu-button');
  const nav = document.querySelector('.primary-nav');

  const updateScrollState = () => {
    const hasScrolled = window.scrollY > 64;

    if (header && !header.classList.contains('always-solid')) {
      header.classList.remove('is-solid');
      header.classList.toggle('is-scrolled', hasScrolled);
    }

    if (heroStage && aboutPanel) {
      const shouldShow = window.scrollY < heroStage.offsetHeight || window.location.hash === '#about';
      aboutPanel.classList.toggle('is-visible', shouldShow);
    }

    if (scrollCue) {
      scrollCue.classList.toggle('is-hidden', hasScrolled);
    }
  };

  const closeMenu = () => {
    if (!menuButton || !nav) return;
    menuButton.setAttribute('aria-expanded', 'false');
    nav.classList.remove('is-open');
    document.body.classList.remove('menu-open');
  };

  if (menuButton && nav) {
    menuButton.addEventListener('click', () => {
      const opening = menuButton.getAttribute('aria-expanded') !== 'true';
      menuButton.setAttribute('aria-expanded', String(opening));
      nav.classList.toggle('is-open', opening);
      document.body.classList.toggle('menu-open', opening);
    });

    nav.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') closeMenu();
    });
  }

  document.querySelectorAll('a[href="#about"]').forEach((link) => {
    link.addEventListener('click', () => {
      if (aboutPanel) aboutPanel.classList.add('is-visible');
    });
  });

  document.querySelectorAll('[data-current-year]').forEach((node) => {
    node.textContent = new Date().getFullYear();
  });

  window.addEventListener('scroll', updateScrollState, { passive: true });
  window.addEventListener('resize', updateScrollState);
  updateScrollState();
})();
