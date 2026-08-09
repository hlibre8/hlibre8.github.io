(() => {
  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
  }

  const header = document.querySelector('.site-header');
  const heroStage = document.querySelector('.hero-stage');
  const aboutPanel = document.querySelector('.about-panel');
  const scrollCue = document.querySelector('.scroll-cue');
  const menuButton = document.querySelector('.menu-button');
  const nav = document.querySelector('.primary-nav');
  const isHomePage = Boolean(heroStage);
  const homeUrl = `${window.location.pathname}${window.location.search}`;
  const newsItems = Array.isArray(window.NEWS_ITEMS)
    ? window.NEWS_ITEMS.slice().sort((a, b) => String(b.date || '').localeCompare(String(a.date || '')))
    : [];

  const normalizeHomeScroll = () => {
    if (!isHomePage) return;
    if (window.location.hash === '#about') {
      history.replaceState(null, '', homeUrl);
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  };

  const updateScrollState = () => {
    const hasScrolled = window.scrollY > 64;
    const headerHeight = header ? header.offsetHeight : 0;
    const inWhiteContent = heroStage ? window.scrollY >= heroStage.offsetHeight - headerHeight : hasScrolled;

    if (header && !header.classList.contains('always-solid')) {
      header.classList.remove('is-solid');
      header.classList.toggle('is-scrolled', inWhiteContent);
    }

    if (heroStage && aboutPanel) {
      const shouldShow = window.scrollY < heroStage.offsetHeight;
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

  const parseNewsDate = (date) => {
    const parts = String(date || '').split('-').map((part) => Number(part));
    if (parts.length !== 3 || parts.some((part) => Number.isNaN(part))) return null;
    return new Date(parts[0], parts[1] - 1, parts[2]);
  };

  const formatNewsDate = (date, options) => {
    const parsed = parseNewsDate(date);
    if (!parsed) return '';
    return new Intl.DateTimeFormat('en-US', options).format(parsed);
  };

  const appendNewsTitle = (heading, item) => {
    if (item.link) {
      const link = document.createElement('a');
      link.href = item.link;
      link.textContent = item.title;
      heading.append(link);
      return;
    }
    heading.textContent = item.title;
  };

  const renderHomeNews = () => {
    const list = document.querySelector('[data-home-news-list]');
    if (!list || !newsItems.length) return;
    list.textContent = '';

    newsItems.slice(0, 5).forEach((item) => {
      const row = document.createElement('article');
      row.className = 'home-news-row';

      const time = document.createElement('time');
      time.className = 'home-news-date';
      time.dateTime = item.date;
      time.textContent = formatNewsDate(item.date, { month: '2-digit', year: '2-digit' });

      const copy = document.createElement('div');
      copy.className = 'home-news-copy';

      const title = document.createElement('h3');
      appendNewsTitle(title, item);

      const summary = document.createElement('p');
      summary.textContent = item.summary || item.description || '';

      copy.append(title, summary);
      row.append(time, copy);
      list.append(row);
    });
  };

  const renderNewsFeed = () => {
    const feed = document.querySelector('[data-news-feed]');
    if (!feed || !newsItems.length) return;
    feed.textContent = '';

    newsItems.forEach((item) => {
      const entry = document.createElement('article');
      entry.className = 'news-feed-item';

      const time = document.createElement('time');
      time.className = 'news-feed-date';
      time.dateTime = item.date;
      time.textContent = formatNewsDate(item.date, { month: 'long', day: 'numeric', year: 'numeric' });

      const title = document.createElement('h2');
      title.className = 'news-feed-title';
      appendNewsTitle(title, item);

      const description = document.createElement('p');
      description.className = 'news-feed-description';
      description.textContent = item.description || item.summary || '';

      entry.append(time, title, description);

      if (item.image) {
        const figure = document.createElement('figure');
        figure.className = 'news-feed-figure';

        const image = document.createElement('img');
        image.src = item.image;
        image.alt = item.imageAlt || '';
        figure.append(image);

        if (item.caption) {
          const caption = document.createElement('figcaption');
          caption.textContent = item.caption;
          figure.append(caption);
        }

        entry.append(figure);
      }

      feed.append(entry);
    });
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
    link.addEventListener('click', (event) => {
      if (!isHomePage) return;
      event.preventDefault();
      closeMenu();
      history.replaceState(null, '', homeUrl);
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
      if (aboutPanel) aboutPanel.classList.add('is-visible');
      updateScrollState();
    });
  });

  document.querySelectorAll('[data-current-year]').forEach((node) => {
    node.textContent = new Date().getFullYear();
  });

  renderHomeNews();
  renderNewsFeed();

  window.addEventListener('scroll', updateScrollState, { passive: true });
  window.addEventListener('resize', updateScrollState);
  window.addEventListener('pageshow', () => {
    normalizeHomeScroll();
    updateScrollState();
  });
  normalizeHomeScroll();
  updateScrollState();
})();
