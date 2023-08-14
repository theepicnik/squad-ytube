document.getElementById("watchButton").addEventListener("click", function() {
  // ... (previous code)

  const videoContainers = document.querySelectorAll(".video-container");
  const videoFrames = document.querySelectorAll(".video-frame");

  // Add click event listeners for each video container
  videoContainers.forEach((container, index) => {
    container.addEventListener("click", () => {
      if (!container.classList.contains("zoomed")) {
        // Zoom in
        videoContainers.forEach(c => c.classList.remove("zoomed"));
        container.classList.add("zoomed");
        videoFrames.forEach(frame => frame.style.pointerEvents = "none");
        videoFrames[index].style.pointerEvents = "auto";
        muteAllVideosExcept(index);
      } else {
        // Unzoom
        videoContainers.forEach(c => c.classList.remove("zoomed"));
        videoFrames.forEach(frame => frame.style.pointerEvents = "auto");
        unmuteAllVideos();
      }
    });
  });
});

function muteAllVideosExcept(index) {
  const iframes = document.querySelectorAll("iframe");
  iframes.forEach((iframe, i) => {
    if (i !== index) {
      iframe.contentWindow.postMessage("mute", "*"); // Mute other videos
    }
  });
}

function unmuteAllVideos() {
  const iframes = document.querySelectorAll("iframe");
  iframes.forEach(iframe => {
    iframe.contentWindow.postMessage("unmute", "*"); // Unmute all videos
  });
}
