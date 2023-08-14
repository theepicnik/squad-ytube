document.getElementById("watchButton").addEventListener("click", function() {
  const videoUrls = [
    document.getElementById("videoUrl1").value,
    document.getElementById("videoUrl2").value,
    document.getElementById("videoUrl3").value,
    document.getElementById("videoUrl4").value
  ];

  for (let i = 1; i <= 4; i++) {
    const iframe = document.createElement("iframe");
    iframe.src = generateEmbedUrl(videoUrls[i - 1]);
    iframe.setAttribute("allowfullscreen", "");
    document.getElementById(`video${i}`).innerHTML = "";
    document.getElementById(`video${i}`).appendChild(iframe);
  }
});

function generateEmbedUrl(url) {
  // Extract the video ID from the YouTube URL
  const videoId = getYouTubeVideoId(url);
  // Construct the embed URL
  return `https://www.youtube.com/embed/${videoId}`;
}

function getYouTubeVideoId(url) {
  const regex = /[?&]v=([^&#]*)/;
  const match = regex.exec(url);
  return match && match[1];
}
