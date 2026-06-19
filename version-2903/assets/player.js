(function () {
  const attachNative = function (video, source) {
    video.src = source;
    video.load();
    return Promise.resolve();
  };

  const attachHls = function (video, source) {
    return new Promise(function (resolve) {
      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true
      });
      hls.loadSource(source);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, function () {
        resolve();
      });
      hls.on(Hls.Events.ERROR, function () {
        resolve();
      });
      video._hls = hls;
    });
  };

  window.initMoviePlayer = function (videoId, coverId, source) {
    const video = document.getElementById(videoId);
    const cover = document.getElementById(coverId);
    let attached = false;
    let attaching = false;

    if (!video || !source) {
      return;
    }

    const attach = function () {
      if (attached || attaching) {
        return Promise.resolve();
      }
      attaching = true;

      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        return attachNative(video, source).then(function () {
          attached = true;
          attaching = false;
        });
      }

      if (window.Hls && window.Hls.isSupported()) {
        return attachHls(video, source).then(function () {
          attached = true;
          attaching = false;
        });
      }

      return attachNative(video, source).then(function () {
        attached = true;
        attaching = false;
      });
    };

    const play = function () {
      if (cover) {
        cover.classList.add('is-hidden');
      }

      attach().then(function () {
        const promise = video.play();
        if (promise && typeof promise.catch === 'function') {
          promise.catch(function () {
            if (cover) {
              cover.classList.remove('is-hidden');
            }
          });
        }
      });
    };

    if (cover) {
      cover.addEventListener('click', play);
    }

    video.addEventListener('click', function () {
      if (video.paused) {
        play();
      }
    });

    video.addEventListener('play', function () {
      if (cover) {
        cover.classList.add('is-hidden');
      }
    });
  };
})();
