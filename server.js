const express = require('express');
const fetch = require('node-fetch');
const app = express();
const PORT = process.env.PORT || 3000;

// Securely access API_KEY from the YouTube-APi environment
const YOUTUBE_API_KEY = process.env.API_KEY;

if (!YOUTUBE_API_KEY) {
  console.error('API_KEY not found in environment. Ensure it is configured correctly.');
  process.exit(1);
}

// Endpoint to fetch YouTube video data
app.get('/api/youtube', async (req, res) => {
  const { videoName } = req.query;

  if (!videoName) {
    return res.status(400).json({ error: 'Video name is required' });
  }

  try {
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(
        videoName
      )}&type=video&key=${YOUTUBE_API_KEY}`
    );

    const data = await response.json();
    if (!data.items.length) {
      return res.status(404).json({ error: 'No videos found.' });
    }

    const video = data.items[0];
    const videoId = video.id.videoId;
    const title = video.snippet.title;
    const description = video.snippet.description;
    const thumbnail = video.snippet.thumbnails.high.url;

    res.json({ videoId, title, description, thumbnail });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch video data.' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
