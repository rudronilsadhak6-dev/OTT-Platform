import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api, { errorText } from "../api";
import VideoPlayer from "../components/VideoPlayer";

const Watch = () => {
  const { id } = useParams(); // parameterised router -> /watch/:id
  const [item, setItem] = useState(null);
  const [episodeIndex, setEpisodeIndex] = useState(0);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        setError("");
        const res = await api.get(`/content/${id}`);
        setItem(res.data);
        setEpisodeIndex(0);
        // check if this title is already in watch later
        const list = await api.get("/watchlist");
        setSaved(list.data.some((x) => x._id === id));
      } catch (err) {
        setError(errorText(err));
      }
    };
    load();
  }, [id]);

  const toggleWatchLater = async () => {
    try {
      if (saved) {
        await api.delete(`/watchlist/${id}`);
        setSaved(false);
        setMessage("Removed from Watch later");
      } else {
        await api.post(`/watchlist/${id}`);
        setSaved(true);
        setMessage("Added to Watch later");
      }
    } catch (err) {
      setMessage(errorText(err));
    }
  };

  if (error) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger">{error}</div>
        <Link to="/">Back to browse</Link>
      </div>
    );
  }
  if (!item) return <div className="container py-5 text-muted-soft">Loading...</div>;

  const isSeries = item.type === "series";
  const episode = isSeries ? item.episodes[episodeIndex] : null;
  const videoUrl = isSeries ? episode?.videoUrl : item.videoUrl;

  return (
    <div className="container py-4">
      <VideoPlayer url={videoUrl} title={item.title} />

      <div className="watch-info">
        <div>
          <h1 className="watch-title">{item.title}</h1>
          {isSeries && episode && (
            <p className="now-playing">Episode {episode.number}: {episode.title}</p>
          )}
          <p className="card-sub">
            {isSeries ? "Series" : "Movie"}
            {item.genre ? `, ${item.genre}` : ""}
            {item.releaseYear ? `, ${item.releaseYear}` : ""}
          </p>
          <p className="watch-desc">{item.description}</p>
        </div>
        <div className="watch-actions">
          <button className={`btn ${saved ? "btn-outline-light" : "btn-gold"}`} onClick={toggleWatchLater}>
            {saved ? "Remove from Watch later" : "Add to Watch later"}
          </button>
          {message && <p className="small text-muted-soft mt-2 mb-0" role="status">{message}</p>}
          <p className="small mt-3 mb-0">
            <Link to={`/report?title=${id}`}>Report a problem with this title</Link>
          </p>
        </div>
      </div>

      {isSeries && (
        <section className="episodes">
          <h2 className="section-title">Episodes</h2>
          <ol className="episode-list">
            {item.episodes.map((ep, index) => (
              <li key={index}>
                <button
                  className={`episode-btn ${index === episodeIndex ? "active" : ""}`}
                  onClick={() => { setEpisodeIndex(index); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                >
                  <span className="ep-num">{ep.number}</span>
                  <span>{ep.title}</span>
                </button>
              </li>
            ))}
          </ol>
        </section>
      )}
    </div>
  );
};

export default Watch;
