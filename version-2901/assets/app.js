(function () {
  var menuButton = document.querySelector('[data-menu-button]');
  var mobileMenu = document.querySelector('[data-mobile-menu]');

  if (menuButton && mobileMenu) {
    menuButton.addEventListener('click', function () {
      mobileMenu.classList.toggle('is-open');
    });
  }

  var hero = document.querySelector('[data-hero]');
  if (hero) {
    var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
    var prev = hero.querySelector('[data-hero-prev]');
    var next = hero.querySelector('[data-hero-next]');
    var active = 0;
    var timer = null;

    function show(index) {
      if (!slides.length) {
        return;
      }
      active = (index + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle('is-active', i === active);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle('is-active', i === active);
      });
    }

    function startTimer() {
      clearInterval(timer);
      timer = setInterval(function () {
        show(active + 1);
      }, 5200);
    }

    if (prev) {
      prev.addEventListener('click', function () {
        show(active - 1);
        startTimer();
      });
    }

    if (next) {
      next.addEventListener('click', function () {
        show(active + 1);
        startTimer();
      });
    }

    dots.forEach(function (dot, index) {
      dot.addEventListener('click', function () {
        show(index);
        startTimer();
      });
    });

    show(0);
    startTimer();
  }

  var resultBox = document.querySelector('[data-search-results]');
  var input = document.querySelector('[data-search-input]');
  var typeSelect = document.querySelector('[data-search-type]');
  var yearSelect = document.querySelector('[data-search-year]');

  function normalize(value) {
    return String(value || '').toLowerCase().trim();
  }

  function renderResults(items) {
    if (!resultBox) {
      return;
    }
    if (!items.length) {
      resultBox.innerHTML = '<div class="empty-state">没有找到匹配内容，请更换关键词或筛选条件。</div>';
      return;
    }
    resultBox.innerHTML = items.slice(0, 120).map(function (movie) {
      return '<article class="movie-card">' +
        '<a class="poster-link" href="' + movie.href + '" aria-label="' + movie.safeTitle + '">' +
        '<img src="' + movie.cover + '" alt="' + movie.safeTitle + '" loading="lazy">' +
        '<span class="poster-badge">' + movie.safeType + '</span>' +
        '</a>' +
        '<div class="card-body">' +
        '<div class="card-meta"><span>' + movie.safeYear + '</span><span>' + movie.safeRegion + '</span></div>' +
        '<h3><a href="' + movie.href + '">' + movie.safeTitle + '</a></h3>' +
        '<p>' + movie.safeOneLine + '</p>' +
        '<div class="tag-line"><span>' + movie.safeCategory + '</span><span>' + movie.safeGenre + '</span></div>' +
        '</div>' +
        '</article>';
    }).join('');
  }

  function applySearch() {
    if (!resultBox || typeof MOVIES === 'undefined') {
      return;
    }
    var keyword = normalize(input && input.value);
    var typeValue = typeSelect ? typeSelect.value : '';
    var yearValue = yearSelect ? yearSelect.value : '';
    var filtered = MOVIES.filter(function (movie) {
      var text = normalize(movie.title + ' ' + movie.region + ' ' + movie.type + ' ' + movie.genre + ' ' + movie.oneLine + ' ' + movie.category);
      var keywordOk = !keyword || text.indexOf(keyword) !== -1;
      var typeOk = !typeValue || movie.type === typeValue;
      var yearOk = !yearValue || movie.year === yearValue;
      return keywordOk && typeOk && yearOk;
    });
    renderResults(filtered);
  }

  if (resultBox && typeof MOVIES !== 'undefined') {
    [input, typeSelect, yearSelect].forEach(function (control) {
      if (control) {
        control.addEventListener('input', applySearch);
        control.addEventListener('change', applySearch);
      }
    });
    applySearch();
  }
})();
