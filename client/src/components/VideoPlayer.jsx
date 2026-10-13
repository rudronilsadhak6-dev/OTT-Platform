import React from "react";
import { mediaUrl } from "../media";

// Finds the video id inside a YouTube link, e.g. https://www.youtube.com/watch?v=abc123
function getYouTubeId(url) {
  const match = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{11})/);
  return match ? match[1] : null;
}

// Plays a YouTube link OR a video file (.mp4, .webm) from your own server or any website
const VideoPlayer = ({ url, title }) => {
  if (!url) return <div className="player-empty">No video link added for this title yet.</div>;

  const youtubeId = getYouTubeId(url);
  const fileUrl = mediaUrl(url);

  return (
    <div className="player">
      {youtubeId ? (
        <iframe
          src={`https://www.youtube.com/embed/${youtubeId}`}
          title={title}
          allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      ) : (
        // key={fileUrl} makes React load the new video when the episode changes
        <video key={fileUrl} src={fileUrl} controls controlsList="nodownload" preload="metadata">
          Your browser cannot play this video.
        </video>
      )}
    </div>
  );
};

export default VideoPlayer;
