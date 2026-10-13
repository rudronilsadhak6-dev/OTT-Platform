import { SERVER_URL } from "./config";

// Makes video and poster links work on every computer.
//   /videos/movie1.mp4                       -> <this server>/videos/movie1.mp4
//   http://localhost:8000/videos/movie1.mp4  -> <this server>/videos/movie1.mp4
//   https://youtube.com/...                  -> unchanged
export function mediaUrl(url) {
  if (!url) return "";
  const local = url.match(/^https?:\/\/(?:localhost|127\.0\.0\.1):8000(\/.*)$/i);
  if (local) return SERVER_URL + local[1];
  if (url.startsWith("/")) return SERVER_URL + url;
  return url;
}
