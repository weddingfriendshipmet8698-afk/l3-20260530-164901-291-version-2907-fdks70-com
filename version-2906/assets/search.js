(function () {
  function escapeHtml(value) {
    return String(value || "").replace(/[&<>"']/g, function (character) {
      return {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        "\"": "&quot;",
        "'": "&#039;"
      }[character];
    });
  }

  function getQuery() {
    var params = new URLSearchParams(window.location.search);
    return (params.get("q") || "").trim();
  }

  function normalize(value) {
    return String(value || "").toLowerCase();
  }

  function cardTemplate(movie) {
    return [
      '<article class="movie-card">',
      '  <a href="' + escapeHtml(movie.url) + '" class="movie-link">',
      '    <span class="poster-wrap">',
      '      <img src="./' + escapeHtml(movie.cover) + '" alt="' + escapeHtml(movie.title) + '" loading="lazy">',
      '      <span class="poster-badge">' + escapeHtml(movie.region) + '</span>',
      '      <span class="play-float">▶</span>',
      '    </span>',
      '    <span class="card-body">',
      '      <strong class="card-title">' + escapeHtml(movie.title) + '</strong>',
      '      <span class="card-line">' + escapeHtml(movie.oneLine) + '</span>',
      '      <span class="card-meta">',
      '        <span>' + escapeHtml(movie.year) + '</span>',
      '        <span>' + escapeHtml(movie.type) + '</span>',
      '        <span>' + escapeHtml(movie.genre) + '</span>',
      '      </span>',
      '    </span>',
      '  </a>',
      '</article>'
    ].join("\n");
  }

  function render(movies, query) {
    var results = document.getElementById("search-results");
    var title = document.querySelector("[data-search-title]");
    var summary = document.querySelector("[data-search-summary]");
    if (!results) {
      return;
    }

    var filtered = movies;
    if (query) {
      var q = normalize(query);
      filtered = movies.filter(function (movie) {
        return [
          movie.title,
          movie.region,
          movie.type,
          movie.year,
          movie.genre,
          movie.oneLine,
          (movie.tags || []).join(" ")
        ].join(" ").toLowerCase().indexOf(q) !== -1;
      });
    } else {
      filtered = movies.slice(0, 60);
    }

    if (title) {
      title.textContent = query ? "搜索结果" : "推荐影片";
    }
    if (summary) {
      summary.textContent = query ? "找到 " + filtered.length + " 部与“" + query + "”相关的影片。" : "默认展示部分热门内容，搜索后会显示匹配结果。";
    }

    results.innerHTML = filtered.slice(0, 240).map(cardTemplate).join("\n");
    if (filtered.length === 0) {
      results.innerHTML = '<p class="content-card">没有找到匹配影片，请尝试更换关键词。</p>';
    }
  }

  document.addEventListener("DOMContentLoaded", function () {
    var input = document.querySelector("[data-search-page-input]");
    var query = getQuery();
    if (input) {
      input.value = query;
    }

    if (Array.isArray(window.MOVIE_SEARCH_INDEX)) {
      render(window.MOVIE_SEARCH_INDEX, query);
      return;
    }

    fetch("./assets/movies.json")
      .then(function (response) {
        return response.json();
      })
      .then(function (movies) {
        render(movies, query);
      })
      .catch(function () {
        var summary = document.querySelector("[data-search-summary]");
        if (summary) {
          summary.textContent = "搜索索引加载失败，请直接通过分类页或全部影片页浏览。";
        }
      });
  });
})();
