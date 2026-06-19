(function () {
    window.initMoviePlayer = function (sourceUrl) {
        const video = document.querySelector('.movie-video');
        const overlay = document.querySelector('.player-overlay');
        const playButtons = Array.from(document.querySelectorAll('[data-play]'));
        let loaded = false;
        let hls = null;

        function loadVideo() {
            if (!video || loaded) {
                return;
            }

            loaded = true;

            if (video.canPlayType('application/vnd.apple.mpegurl')) {
                video.src = sourceUrl;
                return;
            }

            if (window.Hls && window.Hls.isSupported()) {
                hls = new window.Hls({
                    enableWorker: true,
                    lowLatencyMode: true
                });
                hls.loadSource(sourceUrl);
                hls.attachMedia(video);
                return;
            }

            video.src = sourceUrl;
        }

        function startVideo() {
            if (!video) {
                return;
            }

            loadVideo();
            if (overlay) {
                overlay.classList.add('is-hidden');
            }

            const playPromise = video.play();
            if (playPromise && typeof playPromise.catch === 'function') {
                playPromise.catch(function () {
                    if (overlay) {
                        overlay.classList.remove('is-hidden');
                    }
                });
            }
        }

        playButtons.forEach(function (button) {
            button.addEventListener('click', startVideo);
        });

        if (video) {
            video.addEventListener('click', function () {
                if (video.paused) {
                    startVideo();
                }
            });
            video.addEventListener('play', function () {
                if (overlay) {
                    overlay.classList.add('is-hidden');
                }
            });
            video.addEventListener('pause', function () {
                if (overlay && video.currentTime === 0) {
                    overlay.classList.remove('is-hidden');
                }
            });
        }

        window.addEventListener('pagehide', function () {
            if (hls) {
                hls.destroy();
                hls = null;
            }
        });
    };
})();
