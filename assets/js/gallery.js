/*
  Glass gallery renderer.

  Maintenance flow:
  1. Put a new image in assets/images/gallery/.
  2. Add its title/date/type and optional location to assets/js/gallery-data.js.
  3. Run `python3 scripts/analyze-gallery.py`.
  4. The generated order in assets/js/gallery-generated.js drives this page.
*/
(() => {
  const grid = document.querySelector('[data-gallery-grid]');
  const empty = document.querySelector('[data-gallery-empty]');
  const filterButtons = Array.from(document.querySelectorAll('[data-gallery-filter]'));
  const lightbox = document.querySelector('[data-gallery-lightbox]');
  if (!grid || !lightbox) return;

  const items = Array.isArray(window.GALLERY_ITEMS) ? window.GALLERY_ITEMS.slice() : [];
  const byOrder = items.sort((a, b) => (a.order || 0) - (b.order || 0));
  let activeFilter = 'All';
  let visibleItems = byOrder.slice();
  let activeIndex = -1;

  const lightboxImage = lightbox.querySelector('[data-lightbox-image]');
  const lightboxTitle = lightbox.querySelector('[data-lightbox-title]');
  const lightboxMeta = lightbox.querySelector('[data-lightbox-meta]');
  const lightboxLocation = lightbox.querySelector('[data-lightbox-location]');
  const lightboxCaption = lightbox.querySelector('[data-lightbox-caption]');
  const closeButton = lightbox.querySelector('[data-lightbox-close]');
  const prevButton = lightbox.querySelector('[data-lightbox-prev]');
  const nextButton = lightbox.querySelector('[data-lightbox-next]');

  const layoutItem = (item) => {
    const image = item.querySelector('img');
    if (!image || !image.naturalWidth) return;
    const style = getComputedStyle(grid);
    const rowHeight = parseFloat(style.gridAutoRows) || 8;
    const gap = parseFloat(style.rowGap) || 16;
    const height = image.naturalHeight * (item.getBoundingClientRect().width / image.naturalWidth);
    const span = Math.ceil((height + gap) / (rowHeight + gap));
    item.style.gridRowEnd = `span ${span}`;
  };

  const layoutGallery = () => {
    grid.querySelectorAll('.gallery-item').forEach(layoutItem);
  };

  const openLightbox = (index) => {
    const item = visibleItems[index];
    if (!item) return;
    activeIndex = index;
    lightboxImage.src = item.image;
    lightboxImage.alt = item.title || '';
    lightboxTitle.textContent = item.title || 'Untitled';
    lightboxMeta.textContent = [item.type, item.date].filter(Boolean).join(' · ');
    lightboxLocation.textContent = item.location || '';
    lightboxLocation.hidden = !item.location;
    lightboxCaption.textContent = item.caption || '';
    lightboxCaption.hidden = !item.caption;
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.classList.add('lightbox-open');
    closeButton.focus({ preventScroll: true });
  };

  const closeLightbox = () => {
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('lightbox-open');
    activeIndex = -1;
  };

  const moveLightbox = (direction) => {
    if (activeIndex < 0 || !visibleItems.length) return;
    const nextIndex = (activeIndex + direction + visibleItems.length) % visibleItems.length;
    openLightbox(nextIndex);
  };

  const createGalleryItem = (item, index) => {
    const button = document.createElement('button');
    button.className = `gallery-item${item.featured ? ' is-featured' : ''}`;
    button.type = 'button';
    button.setAttribute('aria-label', `Open ${item.title || 'gallery image'}`);

    const image = document.createElement('img');
    image.src = item.image;
    image.alt = item.title || '';
    image.loading = 'lazy';
    image.decoding = 'async';
    image.addEventListener('load', () => layoutItem(button), { once: true });

    const overlay = document.createElement('span');
    overlay.className = 'gallery-item-title';
    overlay.textContent = item.title || 'Untitled';

    button.append(image, overlay);
    button.addEventListener('click', () => openLightbox(index));
    return button;
  };

  const renderGallery = () => {
    visibleItems = byOrder.filter((item) => activeFilter === 'All' || item.type === activeFilter);
    grid.textContent = '';
    grid.classList.add('is-filtering');

    visibleItems.forEach((item, index) => {
      grid.append(createGalleryItem(item, index));
    });

    if (empty) empty.hidden = visibleItems.length > 0;

    requestAnimationFrame(() => {
      layoutGallery();
      grid.classList.remove('is-filtering');
    });
  };

  filterButtons.forEach((button) => {
    button.addEventListener('click', () => {
      activeFilter = button.dataset.galleryFilter || 'All';
      filterButtons.forEach((candidate) => {
        const isActive = candidate === button;
        candidate.classList.toggle('is-active', isActive);
        candidate.setAttribute('aria-pressed', String(isActive));
      });
      renderGallery();
    });
  });

  closeButton.addEventListener('click', closeLightbox);
  prevButton.addEventListener('click', () => moveLightbox(-1));
  nextButton.addEventListener('click', () => moveLightbox(1));
  lightbox.addEventListener('click', (event) => {
    if (event.target === lightbox) closeLightbox();
  });
  document.addEventListener('keydown', (event) => {
    if (lightbox.getAttribute('aria-hidden') === 'true') return;
    if (event.key === 'Escape') closeLightbox();
    if (event.key === 'ArrowLeft') moveLightbox(-1);
    if (event.key === 'ArrowRight') moveLightbox(1);
  });
  window.addEventListener('resize', layoutGallery);

  renderGallery();
})();
