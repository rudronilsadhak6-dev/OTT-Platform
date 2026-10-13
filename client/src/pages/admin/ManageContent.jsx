import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api, { errorText } from "../../api";

const ManageContent = () => {
  const [items, setItems] = useState([]);
  const [type, setType] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    api.get("/content", { params: { type } })
      .then((res) => setItems(res.data))
      .catch((err) => setError(errorText(err)))
      .finally(() => setLoading(false));
  }, [type]);

  const removeItem = async (item) => {
    if (!window.confirm(`Delete "${item.title}"? Users will no longer see it.`)) return;
    try {
      await api.delete(`/admin/content/${item._id}`);
      setItems(items.filter((x) => x._id !== item._id));
    } catch (err) {
      alert(errorText(err));
    }
  };

  return (
    <div className="container py-4">
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
        <h1 className="page-title mb-0">Movies & series</h1>
        <Link to="/admin/content/new" className="btn btn-gold">Add movie or series</Link>
      </div>

      <select className="form-select mb-3 type-select" value={type} onChange={(e) => setType(e.target.value)} aria-label="Filter by type">
        <option value="">All titles</option>
        <option value="movie">Movies only</option>
        <option value="series">Series only</option>
      </select>

      {error && <div className="alert alert-danger">{error}</div>}
      {loading && <p className="text-muted-soft">Loading...</p>}
      {!loading && items.length === 0 && (
        <p className="empty">No titles here yet. Add your first movie or series.</p>
      )}

      {items.length > 0 && (
        <div className="panel">
          <div className="table-responsive">
            <table className="table table-dark-soft align-middle mb-0">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Type</th>
                  <th>Genre</th>
                  <th>Year</th>
                  <th>Plays</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item._id}>
                    <td>{item.title}</td>
                    <td>{item.type === "series" ? `Series (${item.episodes?.length || 0} ep)` : "Movie"}</td>
                    <td>{item.genre || "-"}</td>
                    <td>{item.releaseYear || "-"}</td>
                    <td>{item.views || 0}</td>
                    <td className="text-end text-nowrap">
                      <Link to={`/admin/content/edit/${item._id}`} className="btn btn-sm btn-outline-light me-2">Edit</Link>
                      <button className="btn btn-sm btn-outline-danger" onClick={() => removeItem(item)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageContent;
