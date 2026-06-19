(function () {
    const menuToggle = document.querySelector('[data-menu-toggle]');
    const mobileNav = document.querySelector('[data-mobile-nav]');

    if (menuToggle && mobileNav) {
        menuToggle.addEventListener('click', function () {
            mobileNav.classList.toggle('open');
        });
    }

    const slides = Array.from(document.querySelectorAll('[data-hero-slide]'));
    const dots = Array.from(document.querySelectorAll('[data-hero-dot]'));
    let activeSlide = 0;

    function showSlide(index) {
        if (!slides.length) {
            return;
        }

        activeSlide = (index + slides.length) % slides.length;
        slides.forEach(function (slide, slideIndex) {
            slide.classList.toggle('is-active', slideIndex === activeSlide);
        });
        dots.forEach(function (dot, dotIndex) {
            dot.classList.toggle('active', dotIndex === activeSlide);
        });
    }

    dots.forEach(function (dot) {
        dot.addEventListener('click', function () {
            showSlide(Number(dot.dataset.heroDot || 0));
        });
    });

    if (slides.length > 1) {
        setInterval(function () {
            showSlide(activeSlide + 1);
        }, 5200);
    }

    const searchForm = document.querySelector('[data-home-search-form]');
    if (searchForm) {
        searchForm.addEventListener('submit', function () {
            const input = searchForm.querySelector('input[name="q"]');
            const searchBox = document.querySelector('[data-search-input]');
            if (input && searchBox) {
                searchBox.value = input.value;
                searchBox.dispatchEvent(new Event('input'));
            }
        });
    }

    const searchInput = document.querySelector('[data-search-input]');
    const searchCategory = document.querySelector('[data-search-category]');
    const searchResults = document.querySelector('[data-search-results]');

    function normalize(value) {
        return String(value || '').toLowerCase().trim();
    }

    function escapeHtml(value) {
        return String(value || '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    function renderSearch() {
        if (!searchInput || !searchResults || !window.SEARCH_INDEX) {
            return;
        }

        const keyword = normalize(searchInput.value);
        const category = searchCategory ? searchCategory.value : '';
        let results = window.SEARCH_INDEX.filter(function (item) {
            const text = normalize([item.title, item.region, item.year, item.genre, item.tags, item.description, item.category].join(' '));
            const keywordMatched = !keyword || text.includes(keyword);
            const categoryMatched = !category || item.categorySlug === category;
            return keywordMatched && categoryMatched;
        }).slice(0, 18);

        if (!keyword && !category) {
            results = window.SEARCH_INDEX.slice(0, 9);
        }

        searchResults.innerHTML = results.map(function (item) {
            return '<a class="search-result-card" href="' + escapeHtml(item.url) + '">' +
                '<img src="' + escapeHtml(item.cover) + '" alt="' + escapeHtml(item.title) + '" loading="lazy">' +
                '<div><h3>' + escapeHtml(item.title) + '</h3><p>' + escapeHtml(item.description) + '</p><div class="movie-meta"><span>' + escapeHtml(item.year) + '</span><span>' + escapeHtml(item.region) + '</span><span>' + escapeHtml(item.category) + '</span></div></div>' +
                '</a>';
        }).join('');
    }

    if (searchInput && searchResults) {
        searchInput.addEventListener('input', renderSearch);
        if (searchCategory) {
            searchCategory.addEventListener('change', renderSearch);
        }
        renderSearch();
        window.addEventListener('load', renderSearch);
    }

    const listFilter = document.querySelector('[data-list-filter]');
    const regionFilter = document.querySelector('[data-region-filter]');
    const cardList = document.querySelector('[data-card-list]');

    function filterCards() {
        if (!cardList) {
            return;
        }

        const keyword = normalize(listFilter ? listFilter.value : '');
        const region = regionFilter ? regionFilter.value : '';
        const cards = Array.from(cardList.querySelectorAll('[data-title]'));

        cards.forEach(function (card) {
            const text = normalize([card.dataset.title, card.dataset.region, card.dataset.year].join(' '));
            const keywordMatched = !keyword || text.includes(keyword);
            const regionMatched = !region || card.dataset.region === region;
            card.hidden = !(keywordMatched && regionMatched);
        });
    }

    if (listFilter) {
        listFilter.addEventListener('input', filterCards);
    }
    if (regionFilter) {
        regionFilter.addEventListener('change', filterCards);
    }
})();
