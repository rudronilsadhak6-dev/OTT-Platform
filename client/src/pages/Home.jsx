import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api, { errorText } from "../api";
import ContentCard from "../components/ContentCard";
import Poster from "../components/Poster";

const tabs = [
  { value: "", label: "All" },
  { value: "movie", label: "Movies" },
  { value: "series", label: "Series" },
];

const Home = () => {
  const [items, setItems] = useState([]);
  const [type, setType] = useState("");
  const [search, setSearch] = useState("");
  const [genre, setGenre] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Load titles whenever type or search changes (waits 400ms after typing stops)
  useEffect(() => {
    const timer = setTimeout(async () => {
      try {
        setLoading(true);
        setError("");
        const res = await api.get("/content", { params: { type, search } });
        setItems(res.data);
      } catch (err) {
        setError(errorText(err));
      } finally {
        setLoading(false);
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [type, search]);

  // All genres that exist in the loaded list (for the genre buttons)
  const genres = [...new Set(items.map((item) => item.genre).filter(Boolean))];
  const shown = genre ? items.filter((item) => item.genre === genre) : items;
  const featured = !search && !genre && items.length > 0 ? items[0] : null;

  return (
    <div className="container py-4">
      {featured && (
        <section className="hero">
          <Poster src={featured.poster} title={featured.title} className="hero-poster" />
          <div className="hero-text">
            <p className="hero-kicker">New on MovieNest</p>
            <h1 className="hero-title">{featured.title}</h1>
            <p className="hero-desc">{featured.description}</p>
            <Link className="btn btn-gold btn-lg" to={`/watch/${featured._id}`}>
              {featured.type === "series" ? "Watch episode 1" : "Watch now"}
            </Link>
          </div>
        </section>
      )}

      <section className="toolbar">
        <div className="btn-group" role="group" aria-label="Choose type">
          {tabs.map((tab) => (
            <button
              key={tab.value}
              className={`btn ${type === tab.value ? "btn-gold" : "btn-outline-light"}`}
              onClick={() => { setType(tab.value); setGenre(""); }}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <input
          type="search"
          className="form-control search-input"
          placeholder="Search by title"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          aria-label="Search by title"
        />
      </section>

      {genres.length > 1 && (
        <div className="genre-row">
          <button className={`chip ${genre === "" ? "active" : ""}`} onClick={() => setGenre("")}>Every genre</button>
          {genres.map((g) => (
            <button key={g} className={`chip ${genre === g ? "active" : ""}`} onClick={() => setGenre(g)}>{g}</button>
          ))}
        </div>
      )}

      {error && <div className="alert alert-danger">{error}</div>}
      {loading && <p className="text-muted-soft">Loading titles...</p>}

      {!loading && !error && shown.length === 0 && (
        <p className="empty">Nothing matches that search. Try another title, or pick All.</p>
      )}

      <div className="card-grid">
        {shown.map((item) => (
          <ContentCard key={item._id} item={item} />
        ))}
      </div>
    </div>
  );
};

export default Home;
