(function () {
  window.startMoviePlayer = function (videoId, layerId, url) {
    var video = document.getElementById(videoId);
    var layer = document.getElementById(layerId);

    if (!video || !layer || !url) {
      return;
    }

    function attachAndPlay() {
      layer.classList.add("is-hidden");

      if (video.canPlayType("application/vnd.apple.mpegurl")) {
        if (!video.getAttribute("src")) {
          video.setAttribute("src", url);
        }
        video.play().catch(function () {});
        return;
      }

      if (window.Hls && window.Hls.isSupported()) {
        if (!video.hlsReady) {
          var hls = new window.Hls();
          hls.loadSource(url);
          hls.attachMedia(video);
          video.hlsReady = true;
          hls.on(window.Hls.Events.MANIFEST_PARSED, function () {
            video.play().catch(function () {});
          });
        } else {
          video.play().catch(function () {});
        }
        return;
      }

      if (!video.getAttribute("src")) {
        video.setAttribute("src", url);
      }
      video.play().catch(function () {});
    }

    layer.addEventListener("click", attachAndPlay);
    video.addEventListener("click", function () {
      if (video.paused) {
        attachAndPlay();
      }
    });
  };
})();
