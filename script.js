// ... (previous code)

document.getElementById("watchButton").addEventListener("click", function() {
  // ... (previous code)

  const iframes = [];

  for (let i = 1; i <= 4; i++) {
    const iframe = document.createElement("iframe");
    iframe.src = generateEmbedUrl(videoUrls[i - 1]);
    iframe.setAttribute("allowfullscreen", "");
    document.getElementById(`video${i}`).innerHTML = "";
    document.getElementById(`video${i}`).appendChild(iframe);
    
    iframes.push(iframe);
  }

  synchronizeVideos(iframes);
});

// Function to synchronize videos based on audio
function synchronizeVideos(iframes) {
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  const analyzers = [];
  
  // Create analyzers for each video's audio
  for (let i = 0; i < iframes.length; i++) {
    const analyzer = audioContext.createAnalyser();
    analyzers.push(analyzer);
    
    const iframeWindow = iframes[i].contentWindow;
    iframeWindow.addEventListener("load", function() {
      const iframeAudio = new Audio();
      iframeAudio.src = iframes[i].src.replace("/embed/", "/watch?v="); // Convert to regular YouTube link
      const source = audioContext.createMediaElementSource(iframeAudio);
      source.connect(analyzer);
      analyzer.connect(audioContext.destination);
      iframeAudio.play();
    });
  }
  
  // Synchronize the analyzers
  setInterval(function() {
    const frequencies = analyzers.map(analyzer => {
      const dataArray = new Uint8Array(analyzer.frequencyBinCount);
      analyzer.getByteFrequencyData(dataArray);
      return dataArray;
    });
    
    const averageFrequencies = frequencies.map(array => {
      const sum = array.reduce((acc, value) => acc + value, 0);
      return sum / array.length;
    });
    
    const referenceFrequency = averageFrequencies[0];
    const maxDeviation = 10; // Adjust this value for sensitivity
    
    for (let i = 1; i < iframes.length; i++) {
      const frequencyDiff = Math.abs(referenceFrequency - averageFrequencies[i]);
      if (frequencyDiff > maxDeviation) {
        iframes[i].contentWindow.postMessage("pause", "*"); // Pause out-of-sync videos
      } else {
        iframes[i].contentWindow.postMessage("play", "*"); // Play in-sync videos
      }
    }
  }, 100); // Adjust interval as needed
}
