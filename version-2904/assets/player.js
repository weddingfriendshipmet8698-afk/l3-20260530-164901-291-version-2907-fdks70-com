(function () {
  function ready(callback) {
    if (document.readyState !== 'loading') {
      callback();
      return;
    }
    document.addEventListener('DOMContentLoaded', callback);
  }

  function setupPlayer(shell) {
    var video = shell.querySelector('video');
    var button = shell.querySelector('[data-play-button]');
    var message = shell.querySelector('[data-player-message]');
    var url = shell.getAttribute('data-video');
    var prepared = false;
    var hls = null;

    function showMessage(text) {
      if (!message) {
        return;
      }
      message.textContent = text;
      message.classList.add('is-visible');
    }

    function prepare() {
      if (prepared || !video || !url) {
        return;
      }
      prepared = true;
      if (window.Hls && window.Hls.isSupported()) {
        hls = new window.Hls({ enableWorker: true });
        hls.loadSource(url);
        hls.attachMedia(video);
        hls.on(window.Hls.Events.ERROR, function (event, data) {
          if (data && data.fatal) {
            showMessage('视频暂时无法播放，请稍后再试');
            if (data.type === window.Hls.ErrorTypes.NETWORK_ERROR) {
              hls.startLoad();
            } else if (data.type === window.Hls.ErrorTypes.MEDIA_ERROR) {
              hls.recoverMediaError();
            }
          }
        });
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = url;
      } else {
        showMessage('视频暂时无法播放，请稍后再试');
      }
    }

    function play() {
      prepare();
      shell.classList.add('is-playing');
      video.setAttribute('controls', 'controls');
      var result = video.play();
      if (result && result.catch) {
        result.catch(function () {
          shell.classList.remove('is-playing');
        });
      }
    }

    if (button) {
      button.addEventListener('click', function () {
        play();
      });
    }

    if (video) {
      video.addEventListener('click', function () {
        if (video.paused) {
          play();
        } else {
          video.pause();
        }
      });
      video.addEventListener('ended', function () {
        shell.classList.remove('is-playing');
      });
      video.addEventListener('error', function () {
        showMessage('视频暂时无法播放，请稍后再试');
      });
    }
  }

  ready(function () {
    document.querySelectorAll('[data-video]').forEach(setupPlayer);
  });
}());
