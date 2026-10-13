import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api, { errorText } from "../api";
import ContentCard from "../components/ContentCard";

const Watchlist = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get("/watchlist")
      .then((res) => setItems(res.data))
      .catch((err) => setError(errorText(err)))
      .finally(() => setLoading(false));
  }, []);

  const removeItem = async (id) => {
    try {
      await api.delete(`/watchlist/${id}`);
      setItems(items.filter((item) => item._id !== id));
    } catch (err) {
      alert(errorText(err));
    }
  };

  return (
    <div className="container py-4">
      <h1 className="page-title">Watch later</h1>
      {error && <div className="alert alert-danger">{error}</div>}
      {loading && <p className="text-muted-soft">Loading...</p>}

      {!loading && !error && items.length === 0 && (
        <p className="empty">
          Your list is empty. Open any movie or series and choose Add to Watch later. <Link to="/">Browse titles</Link>
        </p>
      )}

      <div className="card-grid">
        {items.map((item) => (
          <ContentCard key={item._id} item={item} onRemove={removeItem} />
        ))}
      </div>
    </div>
  );
};

export default Watchlist;
