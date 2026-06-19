(function () {
  var menuButton = document.querySelector(".menu-toggle");
  var mobilePanel = document.querySelector(".mobile-panel");

  if (menuButton && mobilePanel) {
    menuButton.addEventListener("click", function () {
      mobilePanel.classList.toggle("open");
    });
  }

  var hero = document.querySelector("[data-hero]");
  if (hero) {
    var slides = Array.prototype.slice.call(hero.querySelectorAll(".hero-slide"));
    var dots = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-dot]"));
    var current = 0;

    function showHero(index) {
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle("active", i === current);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle("active", i === current);
      });
    }

    dots.forEach(function (dot, i) {
      dot.addEventListener("click", function () {
        showHero(i);
      });
    });

    if (slides.length > 1) {
      window.setInterval(function () {
        showHero(current + 1);
      }, 5200);
    }
  }

  function normalize(value) {
    return String(value || "").trim().toLowerCase();
  }

  function runFilters(box) {
    var input = box.querySelector("[data-filter-input]");
    var year = box.querySelector("[data-year-filter]");
    var category = box.querySelector("[data-category-filter]");
    var cards = Array.prototype.slice.call(document.querySelectorAll("[data-card]"));
    var q = normalize(input ? input.value : "");
    var y = normalize(year ? year.value : "");
    var c = normalize(category ? category.value : "");

    cards.forEach(function (card) {
      var text = normalize(card.getAttribute("data-search"));
      var cardYear = normalize(card.getAttribute("data-year"));
      var cardCategory = normalize(card.getAttribute("data-category"));
      var ok = true;

      if (q && text.indexOf(q) === -1) {
        ok = false;
      }
      if (y && cardYear !== y) {
        ok = false;
      }
      if (c && cardCategory !== c) {
        ok = false;
      }

      card.classList.toggle("is-hidden", !ok);
    });
  }

  Array.prototype.slice.call(document.querySelectorAll("[data-filter-box]")).forEach(function (box) {
    var controls = Array.prototype.slice.call(box.querySelectorAll("input, select"));
    controls.forEach(function (control) {
      control.addEventListener("input", function () {
        runFilters(box);
      });
      control.addEventListener("change", function () {
        runFilters(box);
      });
    });
  });

  var params = new URLSearchParams(window.location.search);
  var q = params.get("q");
  if (q) {
    var searchInput = document.querySelector("[data-filter-input]");
    var searchBox = document.querySelector("[data-filter-box]");
    if (searchInput && searchBox) {
      searchInput.value = q;
      runFilters(searchBox);
    }
  }
})();
