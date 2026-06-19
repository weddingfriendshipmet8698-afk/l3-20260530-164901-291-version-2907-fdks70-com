import { H as Hls } from "./video-vendor-dru42stk.js";

document.addEventListener("DOMContentLoaded", function () {
  var shells = document.querySelectorAll("[data-player-shell]");
  shells.forEach(function (shell) {
    var video = shell.querySelector(".js-hls-player");
    var button = shell.querySelector("[data-player-start]");
    var message = shell.querySelector("[data-player-message]");
    var hasStarted = false;
    var hls = null;

    function setMessage(text) {
      if (message) {
        message.textContent = text;
      }
    }

    function startPlayer() {
      if (!video || hasStarted) {
        if (video) {
          video.play().catch(function () {});
        }
        return;
      }

      var source = video.getAttribute("data-src");
      if (!source) {
        setMessage("播放地址为空。请检查影片播放源。");
        return;
      }

      hasStarted = true;
      shell.classList.add("is-playing");
      setMessage("正在加载高清线路...");

      if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = source;
        video.addEventListener("loadedmetadata", function () {
          video.play().catch(function () {
            setMessage("播放器已加载，请再次点击播放。");
          });
        }, { once: true });
      } else if (Hls && Hls.isSupported()) {
        hls = new Hls({
          enableWorker: true,
          lowLatencyMode: true
        });
        hls.loadSource(source);
        hls.attachMedia(video);
        hls.on(Hls.Events.MANIFEST_PARSED, function () {
          video.play().then(function () {
            setMessage("正在播放。");
          }).catch(function () {
            setMessage("播放器已加载，请再次点击播放。");
          });
        });
        hls.on(Hls.Events.ERROR, function (_event, data) {
          if (data && data.fatal) {
            setMessage("播放加载遇到问题，请刷新页面或稍后重试。");
            if (hls) {
              hls.destroy();
              hls = null;
            }
          }
        });
      } else {
        video.src = source;
        video.play().catch(function () {
          setMessage("当前浏览器不支持该播放线路。");
        });
      }
    }

    if (button) {
      button.addEventListener("click", startPlayer);
    }

    if (video) {
      video.addEventListener("play", function () {
        shell.classList.add("is-playing");
        setMessage("正在播放。");
      });
    }
  });
});
