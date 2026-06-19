(function () {
  var player = document.querySelector('[data-player]');
  if (!player) {
    return;
  }

  var video = player.querySelector('video');
  var playButton = player.querySelector('[data-play-button]');
  var url = player.getAttribute('data-url');
  var isReady = false;

  function attach() {
    if (!video || !url) {
      return;
    }

    if (isReady) {
      var again = video.play();
      if (again && again.catch) {
        again.catch(function () {});
      }
      return;
    }

    isReady = true;

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = url;
    } else if (window.Hls && window.Hls.isSupported()) {
      var hls = new window.Hls({
        lowLatencyMode: true,
        backBufferLength: 90
      });
      hls.loadSource(url);
      hls.attachMedia(video);
    } else {
      video.src = url;
    }

    if (playButton) {
      playButton.classList.add('is-hidden');
    }

    video.controls = true;
    var playTask = video.play();
    if (playTask && playTask.catch) {
      playTask.catch(function () {});
    }
  }

  if (playButton) {
    playButton.addEventListener('click', attach);
  }

  if (video) {
    video.addEventListener('click', function () {
      if (!isReady || video.paused) {
        attach();
      }
    });
  }
})();
