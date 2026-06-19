(function () {
  var menuButton = document.querySelector('[data-menu-button]');
  var mobileNav = document.querySelector('[data-mobile-nav]');

  if (menuButton && mobileNav) {
    menuButton.addEventListener('click', function () {
      mobileNav.classList.toggle('open');
    });
  }

  var slides = document.querySelectorAll('[data-hero-slide]');
  var dots = document.querySelectorAll('[data-hero-dot]');
  var activeIndex = 0;

  function showSlide(index) {
    if (!slides.length) {
      return;
    }

    activeIndex = (index + slides.length) % slides.length;

    slides.forEach(function (slide, slideIndex) {
      slide.classList.toggle('active', slideIndex === activeIndex);
    });

    dots.forEach(function (dot, dotIndex) {
      dot.classList.toggle('active', dotIndex === activeIndex);
    });
  }

  dots.forEach(function (dot, index) {
    dot.addEventListener('click', function () {
      showSlide(index);
    });
  });

  if (slides.length > 1) {
    setInterval(function () {
      showSlide(activeIndex + 1);
    }, 5200);
  }

  var filterInput = document.querySelector('[data-filter-input]');
  var filterSelect = document.querySelector('[data-filter-select]');
  var searchableCards = Array.prototype.slice.call(document.querySelectorAll('[data-search]'));
  var emptyMessage = document.querySelector('[data-empty-message]');

  function applyFilter() {
    var query = filterInput ? filterInput.value.trim().toLowerCase() : '';
    var type = filterSelect ? filterSelect.value : '';
    var visible = 0;

    searchableCards.forEach(function (card) {
      var text = (card.getAttribute('data-search') || '').toLowerCase();
      var matchQuery = !query || text.indexOf(query) !== -1;
      var matchType = !type || text.indexOf(type.toLowerCase()) !== -1;
      var show = matchQuery && matchType;

      card.style.display = show ? '' : 'none';

      if (show) {
        visible += 1;
      }
    });

    if (emptyMessage) {
      emptyMessage.style.display = visible ? 'none' : 'block';
    }
  }

  if (filterInput) {
    var params = new URLSearchParams(window.location.search);
    var q = params.get('q');

    if (q) {
      filterInput.value = q;
    }

    filterInput.addEventListener('input', applyFilter);
  }

  if (filterSelect) {
    filterSelect.addEventListener('change', applyFilter);
  }

  applyFilter();
})();
