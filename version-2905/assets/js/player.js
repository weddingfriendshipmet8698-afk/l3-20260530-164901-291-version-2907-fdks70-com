(function () {
  var shell = document.querySelector('[data-player-shell]');

  if (!shell) {
    return;
  }

  var video = shell.querySelector('video');
  var cover = shell.querySelector('[data-video-cover]');
  var button = shell.querySelector('[data-play-button]');
  var started = false;
  var hls = null;

  function attach() {
    if (!video || started) {
      return;
    }

    var src = video.getAttribute('data-src');

    if (!src) {
      return;
    }

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = src;
    } else if (window.Hls && window.Hls.isSupported()) {
      hls = new Hls();
      hls.loadSource(src);
      hls.attachMedia(video);
    } else {
      video.src = src;
    }

    started = true;
  }

  function playVideo() {
    attach();

    if (cover) {
      cover.classList.add('hide');
    }

    if (video) {
      var playPromise = video.play();

      if (playPromise && playPromise.catch) {
        playPromise.catch(function () {});
      }
    }
  }

  if (button) {
    button.addEventListener('click', playVideo);
  }

  if (cover) {
    cover.addEventListener('click', playVideo);
  }

  if (video) {
    video.addEventListener('click', function () {
      if (!started || video.paused) {
        playVideo();
      }
    });
  }

  window.addEventListener('pagehide', function () {
    if (hls) {
      hls.destroy();
      hls = null;
    }
  });
})();
