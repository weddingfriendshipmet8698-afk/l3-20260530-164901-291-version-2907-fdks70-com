(function () {
  var menuButton = document.querySelector("[data-menu-button]");
  var mobileMenu = document.querySelector("[data-mobile-menu]");

  if (menuButton && mobileMenu) {
    menuButton.addEventListener("click", function () {
      mobileMenu.classList.toggle("is-open");
    });
  }

  document.querySelectorAll("[data-hero-slider]").forEach(function (slider) {
    var slides = Array.prototype.slice.call(slider.querySelectorAll("[data-hero-slide]"));
    var dots = Array.prototype.slice.call(slider.querySelectorAll("[data-hero-dot]"));
    var current = 0;

    function showSlide(index) {
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle("is-active", i === current);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle("is-active", i === current);
      });
    }

    dots.forEach(function (dot) {
      dot.addEventListener("click", function () {
        showSlide(Number(dot.getAttribute("data-hero-dot")) || 0);
      });
    });

    if (slides.length > 1) {
      setInterval(function () {
        showSlide(current + 1);
      }, 5200);
    }
  });

  document.querySelectorAll("[data-filter-panel]").forEach(function (panel) {
    var scope = panel.parentElement.querySelector("[data-card-scope]");
    if (!scope) {
      return;
    }

    var searchInput = panel.querySelector("[data-search-input]");
    var selects = Array.prototype.slice.call(panel.querySelectorAll("[data-filter-select]"));
    var cards = Array.prototype.slice.call(scope.querySelectorAll("[data-card]"));
    var empty = panel.parentElement.querySelector("[data-empty-result]");

    function normalize(value) {
      return String(value || "").toLowerCase().trim();
    }

    function applyFilter() {
      var query = normalize(searchInput ? searchInput.value : "");
      var rules = selects.map(function (select) {
        return {
          key: select.getAttribute("data-filter-select"),
          value: normalize(select.value)
        };
      });
      var visible = 0;

      cards.forEach(function (card) {
        var text = normalize([
          card.getAttribute("data-title"),
          card.getAttribute("data-year"),
          card.getAttribute("data-region"),
          card.getAttribute("data-genre"),
          card.getAttribute("data-category"),
          card.textContent
        ].join(" "));
        var matched = !query || text.indexOf(query) !== -1;

        rules.forEach(function (rule) {
          if (rule.value) {
            matched = matched && normalize(card.getAttribute("data-" + rule.key)) === rule.value;
          }
        });

        card.style.display = matched ? "" : "none";
        if (matched) {
          visible += 1;
        }
      });

      if (empty) {
        empty.classList.toggle("is-visible", visible === 0);
      }
    }

    if (searchInput) {
      searchInput.addEventListener("input", applyFilter);
    }

    selects.forEach(function (select) {
      select.addEventListener("change", applyFilter);
    });
  });

  document.querySelectorAll("img").forEach(function (image) {
    image.addEventListener("error", function () {
      image.style.visibility = "hidden";
    }, { once: true });
  });

  window.initMoviePlayer = function (streamUrl) {
    var video = document.getElementById("movie-player");
    var cover = document.getElementById("player-cover");
    var button = document.getElementById("movie-play-button");
    var loaded = false;
    var hlsPlayer = null;

    if (!video || !cover || !button || !streamUrl) {
      return;
    }

    function bindStream() {
      if (loaded) {
        return;
      }

      if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = streamUrl;
      } else if (window.Hls && window.Hls.isSupported()) {
        hlsPlayer = new window.Hls({ enableWorker: true });
        hlsPlayer.loadSource(streamUrl);
        hlsPlayer.attachMedia(video);
      } else {
        video.src = streamUrl;
      }

      loaded = true;
    }

    function play() {
      bindStream();
      cover.classList.add("is-hidden");
      video.controls = true;
      var request = video.play();
      if (request && typeof request.catch === "function") {
        request.catch(function () {
          video.controls = true;
        });
      }
    }

    button.addEventListener("click", play);
    cover.addEventListener("click", play);
    video.addEventListener("click", function () {
      if (!loaded) {
        play();
      }
    });

    window.addEventListener("pagehide", function () {
      if (hlsPlayer && typeof hlsPlayer.destroy === "function") {
        hlsPlayer.destroy();
      }
    });
  };
})();
