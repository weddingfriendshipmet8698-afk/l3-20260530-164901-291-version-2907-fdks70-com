(function () {
  const mobileButton = document.querySelector('[data-mobile-menu-button]');
  const mobileNav = document.querySelector('[data-mobile-nav]');

  if (mobileButton && mobileNav) {
    mobileButton.addEventListener('click', function () {
      mobileNav.classList.toggle('is-open');
    });
  }

  document.querySelectorAll('[data-search-form]').forEach(function (form) {
    form.addEventListener('submit', function (event) {
      event.preventDefault();
      const input = form.querySelector('input[name="q"]');
      const value = input ? input.value.trim() : '';
      const target = value ? './search.html?q=' + encodeURIComponent(value) : './search.html';
      window.location.href = target;
    });
  });

  const hero = document.querySelector('[data-hero]');
  if (hero) {
    const slides = Array.from(hero.querySelectorAll('[data-hero-slide]'));
    const dots = Array.from(hero.querySelectorAll('[data-hero-dot]'));
    const prev = hero.querySelector('[data-hero-prev]');
    const next = hero.querySelector('[data-hero-next]');
    let index = 0;
    let timer = null;

    const setSlide = function (nextIndex) {
      if (!slides.length) {
        return;
      }
      index = (nextIndex + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('is-active', slideIndex === index);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('is-active', dotIndex === index);
      });
    };

    const startTimer = function () {
      timer = window.setInterval(function () {
        setSlide(index + 1);
      }, 5200);
    };

    const restartTimer = function () {
      if (timer) {
        window.clearInterval(timer);
      }
      startTimer();
    };

    if (prev) {
      prev.addEventListener('click', function () {
        setSlide(index - 1);
        restartTimer();
      });
    }

    if (next) {
      next.addEventListener('click', function () {
        setSlide(index + 1);
        restartTimer();
      });
    }

    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        setSlide(Number(dot.dataset.heroDot || 0));
        restartTimer();
      });
    });

    setSlide(0);
    startTimer();
  }

  const filterPanels = document.querySelectorAll('[data-filter-panel]');
  filterPanels.forEach(function (panel) {
    const scope = panel.closest('main') || document;
    const cards = Array.from(scope.querySelectorAll('[data-movie-card]'));
    const countOutput = scope.querySelector('[data-result-count]');
    const input = panel.querySelector('[data-filter-input]');
    const category = panel.querySelector('[data-filter-category]');
    const region = panel.querySelector('[data-filter-region]');
    const type = panel.querySelector('[data-filter-type]');
    const year = panel.querySelector('[data-filter-year]');
    const reset = panel.querySelector('[data-filter-reset]');

    const populateSelect = function (select, attr) {
      if (!select || select.options.length > 1) {
        return;
      }
      const values = Array.from(new Set(cards.map(function (card) {
        return card.getAttribute(attr) || '';
      }).filter(Boolean))).sort(function (a, b) {
        return String(b).localeCompare(String(a), 'zh-CN');
      });
      values.forEach(function (value) {
        const option = document.createElement('option');
        option.value = value;
        option.textContent = value;
        select.appendChild(option);
      });
    };

    populateSelect(region, 'data-region');
    populateSelect(type, 'data-type');
    populateSelect(year, 'data-year');

    const params = new URLSearchParams(window.location.search);
    const queryValue = params.get('q');
    if (queryValue && input) {
      input.value = queryValue;
    }

    const applyFilter = function () {
      const keyword = input ? input.value.trim().toLowerCase() : '';
      const categoryValue = category ? category.value : '';
      const regionValue = region ? region.value : '';
      const typeValue = type ? type.value : '';
      const yearValue = year ? year.value : '';
      let visible = 0;

      cards.forEach(function (card) {
        const searchText = (card.getAttribute('data-search') || '').toLowerCase();
        const cardCategory = card.getAttribute('data-category') || '';
        const cardRegion = card.getAttribute('data-region') || '';
        const cardType = card.getAttribute('data-type') || '';
        const cardYear = card.getAttribute('data-year') || '';
        const matched = (!keyword || searchText.indexOf(keyword) !== -1) &&
          (!categoryValue || cardCategory === categoryValue) &&
          (!regionValue || cardRegion === regionValue) &&
          (!typeValue || cardType === typeValue) &&
          (!yearValue || cardYear === yearValue);

        card.classList.toggle('is-filter-hidden', !matched);
        if (matched) {
          visible += 1;
        }
      });

      if (countOutput) {
        countOutput.textContent = String(visible);
      }
    };

    [input, category, region, type, year].forEach(function (control) {
      if (control) {
        control.addEventListener('input', applyFilter);
        control.addEventListener('change', applyFilter);
      }
    });

    if (reset) {
      reset.addEventListener('click', function () {
        if (input) {
          input.value = '';
        }
        [category, region, type, year].forEach(function (control) {
          if (control) {
            control.value = '';
          }
        });
        applyFilter();
      });
    }

    applyFilter();
  });
})();
