(function () {
  var menuButton = document.querySelector('[data-menu-toggle]');
  var mobileNav = document.querySelector('[data-mobile-nav]');

  if (menuButton && mobileNav) {
    menuButton.addEventListener('click', function () {
      mobileNav.classList.toggle('open');
    });
  }

  var slides = Array.prototype.slice.call(document.querySelectorAll('[data-hero-slide]'));
  var dots = Array.prototype.slice.call(document.querySelectorAll('[data-hero-dot]'));
  var activeSlide = 0;

  function showSlide(index) {
    if (!slides.length) {
      return;
    }

    activeSlide = (index + slides.length) % slides.length;
    slides.forEach(function (slide, slideIndex) {
      slide.classList.toggle('active', slideIndex === activeSlide);
    });
    dots.forEach(function (dot, dotIndex) {
      dot.classList.toggle('active', dotIndex === activeSlide);
    });
  }

  dots.forEach(function (dot) {
    dot.addEventListener('click', function () {
      showSlide(Number(dot.getAttribute('data-hero-dot')) || 0);
    });
  });

  if (slides.length > 1) {
    window.setInterval(function () {
      showSlide(activeSlide + 1);
    }, 5600);
  }

  function normalize(value) {
    return String(value || '').trim().toLowerCase();
  }

  var searchInputs = Array.prototype.slice.call(document.querySelectorAll('[data-search-input]'));
  var filterChips = Array.prototype.slice.call(document.querySelectorAll('[data-filter]'));
  var currentFilter = 'all';

  function filterCards() {
    var query = normalize(searchInputs.map(function (input) {
      return input.value;
    }).join(' '));
    var cards = Array.prototype.slice.call(document.querySelectorAll('.movie-card, .rank-item'));

    cards.forEach(function (card) {
      var haystack = normalize([
        card.getAttribute('data-title'),
        card.getAttribute('data-year'),
        card.getAttribute('data-region'),
        card.getAttribute('data-tags'),
        card.textContent
      ].join(' '));
      var matchesQuery = !query || haystack.indexOf(query) !== -1;
      var matchesFilter = currentFilter === 'all' || haystack.indexOf(normalize(currentFilter)) !== -1;
      card.classList.toggle('hidden-card', !(matchesQuery && matchesFilter));
    });
  }

  searchInputs.forEach(function (input) {
    input.addEventListener('input', filterCards);
  });

  filterChips.forEach(function (chip) {
    chip.addEventListener('click', function () {
      currentFilter = chip.getAttribute('data-filter') || 'all';
      filterChips.forEach(function (item) {
        item.classList.toggle('active', item === chip);
      });
      filterCards();
    });
  });

  function loadHls(callback) {
    if (window.Hls) {
      callback();
      return;
    }

    var script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/hls.js@1.5.20/dist/hls.min.js';
    script.onload = callback;
    document.head.appendChild(script);
  }

  function initPlayer() {
    var player = document.querySelector('[data-player]');
    var video = document.querySelector('#video-player');
    var buttons = Array.prototype.slice.call(document.querySelectorAll('[data-play-button]'));

    if (!player || !video || !buttons.length) {
      return;
    }

    var source = video.getAttribute('data-src');
    var isReady = false;

    function markPlaying() {
      player.classList.add('playing');
    }

    function startPlayback() {
      if (!source) {
        return;
      }

      if (isReady) {
        video.play().then(markPlaying).catch(function () {});
        return;
      }

      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = source;
        isReady = true;
        video.play().then(markPlaying).catch(function () {});
        return;
      }

      loadHls(function () {
        if (window.Hls && window.Hls.isSupported()) {
          var hls = new window.Hls({ enableWorker: true });
          hls.loadSource(source);
          hls.attachMedia(video);
          hls.on(window.Hls.Events.MANIFEST_PARSED, function () {
            isReady = true;
            video.play().then(markPlaying).catch(function () {});
          });
        } else {
          video.src = source;
          isReady = true;
          video.play().then(markPlaying).catch(function () {});
        }
      });
    }

    buttons.forEach(function (button) {
      button.addEventListener('click', startPlayback);
    });

    video.addEventListener('play', markPlaying);
    video.addEventListener('pause', function () {
      player.classList.remove('playing');
    });
  }

  initPlayer();
})();
