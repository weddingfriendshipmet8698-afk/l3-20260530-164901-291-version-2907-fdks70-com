(function () {
  function ready(callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback);
    } else {
      callback();
    }
  }

  ready(function () {
    initMobileNav();
    initHeroSliders();
    initFilters();
    initImageFallback();
  });

  function initMobileNav() {
    var toggle = document.querySelector("[data-nav-toggle]");
    var panel = document.querySelector("[data-mobile-panel]");
    if (!toggle || !panel) {
      return;
    }

    toggle.addEventListener("click", function () {
      panel.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", panel.classList.contains("is-open") ? "true" : "false");
    });
  }

  function initHeroSliders() {
    var sliders = document.querySelectorAll("[data-hero-slider]");
    sliders.forEach(function (slider) {
      var slides = Array.prototype.slice.call(slider.querySelectorAll("[data-hero-slide]"));
      var dots = Array.prototype.slice.call(slider.querySelectorAll("[data-hero-dot]"));
      var prev = slider.querySelector("[data-hero-prev]");
      var next = slider.querySelector("[data-hero-next]");
      var current = 0;
      var timer = null;

      if (slides.length <= 1) {
        return;
      }

      function show(index) {
        current = (index + slides.length) % slides.length;
        slides.forEach(function (slide, slideIndex) {
          slide.classList.toggle("is-active", slideIndex === current);
        });
        dots.forEach(function (dot, dotIndex) {
          dot.classList.toggle("is-active", dotIndex === current);
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
        }
      }

      if (prev) {
        prev.addEventListener("click", function () {
          show(current - 1);
          start();
        });
      }

      if (next) {
        next.addEventListener("click", function () {
          show(current + 1);
          start();
        });
      }

      dots.forEach(function (dot, dotIndex) {
        dot.addEventListener("click", function () {
          show(dotIndex);
          start();
        });
      });

      slider.addEventListener("mouseenter", stop);
      slider.addEventListener("mouseleave", start);
      start();
    });
  }

  function initFilters() {
    var scope = document.querySelector("[data-filter-scope]");
    if (!scope) {
      return;
    }

    var searchInput = scope.querySelector("[data-card-filter]");
    var typeSelect = scope.querySelector("[data-type-filter]");
    var countLabel = scope.querySelector("[data-filter-count]");
    var cards = Array.prototype.slice.call(document.querySelectorAll("[data-movie-card]"));

    function normalize(value) {
      return String(value || "").toLowerCase().trim();
    }

    function update() {
      var query = normalize(searchInput && searchInput.value);
      var type = normalize(typeSelect && typeSelect.value);
      var visibleCount = 0;

      cards.forEach(function (card) {
        var haystack = [
          card.getAttribute("data-title"),
          card.getAttribute("data-year"),
          card.getAttribute("data-type"),
          card.getAttribute("data-tags")
        ].join(" ").toLowerCase();
        var cardType = normalize(card.getAttribute("data-type"));
        var matchesQuery = !query || haystack.indexOf(query) !== -1;
        var matchesType = !type || cardType.indexOf(type) !== -1;
        var isVisible = matchesQuery && matchesType;
        card.hidden = !isVisible;
        if (isVisible) {
          visibleCount += 1;
        }
      });

      if (countLabel) {
        countLabel.textContent = "当前显示 " + visibleCount + " 部";
      }
    }

    if (searchInput) {
      searchInput.addEventListener("input", update);
    }
    if (typeSelect) {
      typeSelect.addEventListener("change", update);
    }
    update();
  }

  function initImageFallback() {
    document.addEventListener("error", function (event) {
      var target = event.target;
      if (!target || target.tagName !== "IMG") {
        return;
      }

      var holder = target.closest(".poster-wrap, .compact-thumb, .rank-cover, .detail-poster");
      if (holder) {
        holder.classList.add("is-missing");
      }
    }, true);
  }
})();
