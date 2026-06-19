(function () {
  function ready(callback) {
    if (document.readyState !== 'loading') {
      callback();
      return;
    }
    document.addEventListener('DOMContentLoaded', callback);
  }

  function setupMenu() {
    var toggle = document.querySelector('[data-menu-toggle]');
    var panel = document.querySelector('[data-mobile-panel]');
    if (!toggle || !panel) {
      return;
    }
    toggle.addEventListener('click', function () {
      panel.classList.toggle('is-open');
    });
  }

  function setupHero() {
    var root = document.querySelector('[data-hero]');
    if (!root) {
      return;
    }
    var slides = Array.prototype.slice.call(root.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(root.querySelectorAll('[data-hero-dot]'));
    var next = root.querySelector('[data-hero-next]');
    var prev = root.querySelector('[data-hero-prev]');
    var current = 0;
    var timer = null;

    function show(index) {
      if (!slides.length) {
        return;
      }
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('is-active', slideIndex === current);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('is-active', dotIndex === current);
      });
    }

    function start() {
      stop();
      timer = window.setInterval(function () {
        show(current + 1);
      }, 5200);
    }

    function stop() {
      if (timer) {
        window.clearInterval(timer);
        timer = null;
      }
    }

    if (next) {
      next.addEventListener('click', function () {
        show(current + 1);
        start();
      });
    }
    if (prev) {
      prev.addEventListener('click', function () {
        show(current - 1);
        start();
      });
    }
    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        show(Number(dot.getAttribute('data-hero-dot')) || 0);
        start();
      });
    });
    root.addEventListener('mouseenter', stop);
    root.addEventListener('mouseleave', start);
    show(0);
    start();
  }

  function setupFilters() {
    var params = new URLSearchParams(window.location.search);
    document.querySelectorAll('[data-filter-scope]').forEach(function (scope) {
      var input = scope.querySelector('[data-filter-input]');
      var typeSelect = scope.querySelector('[data-filter-type]');
      var yearSelect = scope.querySelector('[data-filter-year]');
      var categorySelect = scope.querySelector('[data-filter-category]');
      var empty = scope.querySelector('[data-empty-state]');
      var cards = Array.prototype.slice.call(scope.querySelectorAll('[data-card]'));

      if (input && input.getAttribute('data-use-query') === '1') {
        input.value = params.get('q') || '';
      }

      function apply() {
        var q = input ? input.value.trim().toLowerCase() : '';
        var type = typeSelect ? typeSelect.value : '';
        var year = yearSelect ? yearSelect.value : '';
        var category = categorySelect ? categorySelect.value : '';
        var visible = 0;

        cards.forEach(function (card) {
          var text = card.textContent.toLowerCase();
          var ok = true;
          if (q && text.indexOf(q) === -1) {
            ok = false;
          }
          if (type && card.getAttribute('data-type') !== type) {
            ok = false;
          }
          if (year && card.getAttribute('data-year') !== year) {
            ok = false;
          }
          if (category && card.getAttribute('data-category') !== category) {
            ok = false;
          }
          card.hidden = !ok;
          if (ok) {
            visible += 1;
          }
        });

        if (empty) {
          empty.classList.toggle('is-visible', visible === 0);
        }
      }

      [input, typeSelect, yearSelect, categorySelect].forEach(function (field) {
        if (!field) {
          return;
        }
        field.addEventListener('input', apply);
        field.addEventListener('change', apply);
      });

      apply();
    });
  }

  ready(function () {
    setupMenu();
    setupHero();
    setupFilters();
  });
}());
