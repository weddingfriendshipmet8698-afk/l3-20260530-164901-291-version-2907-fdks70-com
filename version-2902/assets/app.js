(function(){
  const q = (sel, root=document) => root.querySelector(sel);
  const qa = (sel, root=document) => Array.from(root.querySelectorAll(sel));

  const slides = qa('[data-hero-slide]');
  if (slides.length > 1) {
    let idx = slides.findIndex(s => s.classList.contains('active'));
    if (idx < 0) idx = 0;
    const setActive = (next) => {
      slides.forEach((s, i) => s.classList.toggle('active', i === next));
      idx = next;
    };
    setInterval(() => setActive((idx + 1) % slides.length), 5000);
  }

  const search = q('[data-search-input]');
  const scope = q('[data-search-scope]');
  if (search && scope) {
    const cards = qa('[data-film-card]', scope);
    const filterCards = () => {
      const term = search.value.trim().toLowerCase();
      cards.forEach(card => {
        const text = (card.getAttribute('data-keywords') || card.textContent || '').toLowerCase();
        card.style.display = (!term || text.includes(term)) ? '' : 'none';
      });
    };
    search.addEventListener('input', filterCards);
    filterCards();
  }

  const video = q('[data-player-video]');
  const status = q('[data-player-status]');
  const sourceBtns = qa('[data-source-btn]');
  const playlist = window.__PLAYER_SOURCES__ || [];
  let hls = null;

  const destroyHls = () => {
    if (hls) {
      try { hls.destroy(); } catch (e) {}
      hls = null;
    }
  };

  const loadSource = (index) => {
    const item = playlist[index];
    if (!item || !video) return;
    sourceBtns.forEach(btn => btn.classList.toggle('active', Number(btn.dataset.sourceIndex) === index));
    if (status) status.textContent = item.label ? ('当前线路：' + item.label) : '当前线路';
    destroyHls();
    const url = item.url;
    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = url;
      video.load();
    } else if (window.Hls && Hls.isSupported()) {
      hls = new Hls({ enableWorker: true, lowLatencyMode: true });
      hls.loadSource(url);
      hls.attachMedia(video);
    } else {
      video.src = url;
    }
    const p = video.play();
    if (p && p.catch) p.catch(() => {});
  };

  if (video && playlist.length) {
    sourceBtns.forEach(btn => btn.addEventListener('click', () => loadSource(Number(btn.dataset.sourceIndex))));
    loadSource(0);
  }
})();
