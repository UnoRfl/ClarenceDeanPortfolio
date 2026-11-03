(() => {
  const motionTargets = [...document.querySelectorAll('.home-intro h1,.home-intro p,.home-intro a,.section-heading h2,.section-heading p,.filters .filter-button,.gallery-item,.editorial-page h1,.editorial-page p,.editorial-page h2,.contact-details>div,.editorial-page .button,.site-footer')];
  if (motionTargets.length && 'IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.documentElement.classList.add('motion-ready');
    motionTargets.forEach((element,index) => {
      element.dataset.motion = 'rise';
      element.style.setProperty('--motion-delay', `${(index % 5) * 65}ms`);
    });
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.dataset.visible = 'true';
        observer.unobserve(entry.target);
      }
    }), { threshold: 0.06, rootMargin: '0px 0px -4% 0px' });
    motionTargets.forEach(element => observer.observe(element));
  }

  const filters = [...document.querySelectorAll('.filter-button')];
  const items = [...document.querySelectorAll('.gallery-item')];
  filters.forEach(button => button.addEventListener('click', () => {
    const selected = button.dataset.filter;
    filters.forEach(filter => {
      const active = filter === button;
      filter.classList.toggle('active', active);
      filter.setAttribute('aria-pressed', String(active));
    });
    items.forEach(item => { item.hidden = selected !== 'all' && item.dataset.category !== selected; });
  }));

  const dialog = document.querySelector('.lightbox');
  if (!dialog) return;
  const image = dialog.querySelector('figure img');
  const title = dialog.querySelector('.lightbox-title');
  const credit = dialog.querySelector('.lightbox-credit');
  const source = dialog.querySelector('.lightbox-source');
  let current = 0;
  const visibleItems = () => items.filter(item => !item.hidden);
  const show = (item) => {
    if (!item) return;
    current = visibleItems().indexOf(item);
    const preview = item.querySelector('img');
    image.src = preview.currentSrc || preview.src;
    image.alt = preview.alt;
    title.textContent = item.dataset.title;
    credit.textContent = item.dataset.credit;
    source.href = item.dataset.source;
    if (!dialog.open) dialog.showModal();
  };
  items.forEach(item => item.addEventListener('click', () => show(item)));
  const step = direction => {
    const list = visibleItems();
    if (!list.length) return;
    current = (current + direction + list.length) % list.length;
    show(list[current]);
  };
  dialog.querySelector('.lightbox-close').addEventListener('click', () => dialog.close());
  dialog.querySelector('.previous').addEventListener('click', () => step(-1));
  dialog.querySelector('.next').addEventListener('click', () => step(1));
  dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
  document.addEventListener('keydown', event => {
    if (!dialog.open) return;
    if (event.key === 'ArrowLeft') step(-1);
    if (event.key === 'ArrowRight') step(1);
  });
})();
