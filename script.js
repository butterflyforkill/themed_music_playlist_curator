// Load songs from JSON file
async function loadSongs() {
  const response = await fetch("songs.json");
  return await response.json();
}

// Generate playlist based on trope and mood
async function generatePlaylist() {
  const trope = document.getElementById("trope").value;
  const mood = document.getElementById("mood").value;
  const playlistDiv = document.getElementById("playlist");

  try {
    const songsData = await loadSongs();
    const playlist = songsData[trope][mood] || [];

    // Display playlist
    if (playlist.length === 0) {
      playlistDiv.innerHTML = "<p>No songs found for this combination.</p>";
      return;
    }

    playlistDiv.innerHTML =
      "<h2>Your Yaoi Playlist</h2><ul>" +
      playlist
        .map((song) => `<li>${song.title} by ${song.artist}</li>`)
        .join("") +
      "</ul>";

    // Save playlist to localStorage
    localStorage.setItem(
      "lastPlaylist",
      JSON.stringify({ trope, mood, songs: playlist }),
    );

    // Draw simple Canvas visual
    drawCanvasVisual();
  } catch (error) {
    playlistDiv.innerHTML = "<p>Error loading playlist. Please try again.</p>";
    console.error(error);
  }
}

// Simple Canvas visual (e.g., a heart)
function drawCanvasVisual() {
  const canvas = document.getElementById("visual");
  const ctx = canvas.getContext("2d");

  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw a simple heart
  ctx.fillStyle = "#d81b60";
  ctx.beginPath();
  ctx.moveTo(200, 100);
  ctx.bezierCurveTo(200, 60, 150, 50, 150, 80);
  ctx.bezierCurveTo(150, 110, 200, 130, 200, 150);
  ctx.bezierCurveTo(200, 130, 250, 110, 250, 80);
  ctx.bezierCurveTo(250, 50, 200, 60, 200, 100);
  ctx.fill();
}

// Load last playlist on page load (if exists)
window.onload = () => {
  const savedPlaylist = localStorage.getItem("lastPlaylist");
  if (savedPlaylist) {
    const { trope, mood, songs } = JSON.parse(savedPlaylist);
    document.getElementById("trope").value = trope;
    document.getElementById("mood").value = mood;
    document.getElementById("playlist").innerHTML =
      "<h2>Your Last Playlist</h2><ul>" +
      songs.map((song) => `<li>${song.title} by ${song.artist}</li>`).join("") +
      "</ul>";
    drawCanvasVisual();
  }
};
