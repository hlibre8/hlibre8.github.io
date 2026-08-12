/*
  Glass gallery renderer.

  Maintenance flow:
  1. Put a new image in assets/images/gallery/.
  2. Add its title/date/type and optional location to assets/js/gallery-data.js.
  3. Commit and push. This page reads gallery-data.js directly.
*/
(() => {
  const grid = document.querySelector('[data-gallery-grid]');
  const empty = document.querySelector('[data-gallery-empty]');
  const filterButtons = Array.from(document.querySelectorAll('[data-gallery-filter]'));
  const lightbox = document.querySelector('[data-gallery-lightbox]');
  if (!grid || !lightbox) return;

  const hasOrderOverride = (item) => item.orderOverride !== null
    && item.orderOverride !== undefined
    && item.orderOverride !== ''
    && Number.isFinite(Number(item.orderOverride));

  const items = Array.isArray(window.GALLERY_SOURCE_ITEMS)
    ? window.GALLERY_SOURCE_ITEMS.map((item, index) => ({ ...item, sourceIndex: index }))
    : [];
  const byOrder = items.sort((a, b) => {
    const aHasOverride = hasOrderOverride(a);
    const bHasOverride = hasOrderOverride(b);

    if (aHasOverride || bHasOverride) {
      const aOrder = aHasOverride ? Number(a.orderOverride) : a.sourceIndex;
      const bOrder = bHasOverride ? Number(b.orderOverride) : b.sourceIndex;
      if (aOrder !== bOrder) return aOrder - bOrder;
    }

    return a.sourceIndex - b.sourceIndex;
  });
  let activeFilter = 'All';
  let visibleItems = byOrder.slice();
  let activeIndex = -1;
  let renderFrame = 0;

  const lightboxImage = lightbox.querySelector('[data-lightbox-image]');
  const lightboxTitle = lightbox.querySelector('[data-lightbox-title]');
  const lightboxMeta = lightbox.querySelector('[data-lightbox-meta]');
  const lightboxLocation = lightbox.querySelector('[data-lightbox-location]');
  const lightboxCaption = lightbox.querySelector('[data-lightbox-caption]');
  const closeButton = lightbox.querySelector('[data-lightbox-close]');
  const prevButton = lightbox.querySelector('[data-lightbox-prev]');
  const nextButton = lightbox.querySelector('[data-lightbox-next]');

  const getColumnCount = () => {
    const width = grid.getBoundingClientRect().width || window.innerWidth;
    if (width < 680) return 1;
    if (width < 1040) return 2;
    return 3;
  };

  const getGalleryGap = () => {
    const styles = getComputedStyle(grid);
    return parseFloat(styles.columnGap || styles.gap) || 20;
  };

  const getAspectRatio = (item) => (
    Number.isFinite(Number(item.aspectRatio)) && Number(item.aspectRatio) > 0
      ? Number(item.aspectRatio)
      : 4 / 3
  );

  const updateAspectRatio = (item, image) => {
    if (!image.naturalWidth || !image.naturalHeight) return;
    const ratio = image.naturalWidth / image.naturalHeight;
    if (Number.isFinite(ratio) && Math.abs((item.aspectRatio || 0) - ratio) > 0.01) {
      item.aspectRatio = ratio;
      scheduleRender();
    }
  };

  const scheduleRender = () => {
    cancelAnimationFrame(renderFrame);
    renderFrame = requestAnimationFrame(renderGallery);
  };

  const openLightbox = (index) => {
    const item = visibleItems[index];
    if (!item) return;
    activeIndex = index;
    lightboxImage.src = item.image;
    lightboxImage.alt = item.title || item.location || item.type || '';
    lightboxTitle.textContent = item.title || '';
    lightboxTitle.hidden = !item.title;
    lightboxLocation.textContent = item.location || '';
    lightboxLocation.hidden = !item.location;
    lightboxMeta.textContent = item.date || '';
    lightboxMeta.hidden = !item.date;
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
    button.setAttribute('aria-label', `Open ${item.title || item.location || 'gallery image'}`);

    const image = document.createElement('img');
    image.addEventListener('load', () => updateAspectRatio(item, image), { once: true });
    image.src = item.image;
    image.alt = item.title || item.location || '';
    image.loading = 'lazy';
    image.decoding = 'async';

    button.append(image);
    if (item.title) {
      const overlay = document.createElement('span');
      overlay.className = 'gallery-item-title';
      overlay.textContent = item.title;
      button.append(overlay);
    }
    button.addEventListener('click', () => openLightbox(index));
    return button;
  };

  const renderGallery = () => {
    visibleItems = byOrder.filter((item) => activeFilter === 'All' || item.type === activeFilter);
    grid.textContent = '';
    grid.classList.add('is-filtering');
    const columnCount = getColumnCount();
    grid.style.setProperty('--gallery-columns', columnCount);
    const gap = getGalleryGap();
    const columnWidth = (grid.getBoundingClientRect().width - (gap * (columnCount - 1))) / columnCount;
    const columns = Array.from({ length: columnCount }, () => {
      const column = document.createElement('div');
      column.className = 'gallery-column';
      grid.append(column);
      return { element: column, height: 0 };
    });

    visibleItems.forEach((item, index) => {
      const shortestColumn = columns.reduce((shortest, column) => (
        column.height < shortest.height ? column : shortest
      ));
      shortestColumn.element.append(createGalleryItem(item, index));
      shortestColumn.height += (columnWidth / getAspectRatio(item)) + gap;
    });

    if (empty) empty.hidden = visibleItems.length > 0;

    requestAnimationFrame(() => {
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
  window.addEventListener('resize', scheduleRender);

  renderGallery();
})();
