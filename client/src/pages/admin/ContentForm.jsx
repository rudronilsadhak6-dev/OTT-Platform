import React, { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import api, { errorText } from "../../api";
import Poster from "../../components/Poster";

const emptyForm = {
  title: "",
  description: "",
  type: "movie",
  genre: "",
  releaseYear: "",
  poster: "",
  videoUrl: "",
  episodes: [{ title: "", videoUrl: "" }],
};

// Used for BOTH "add new" and "edit". If the url has an :id, we are editing.
const ContentForm = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isEdit) return;
    api.get(`/admin/content/${id}`)
      .then((res) => {
        const item = res.data;
        setForm({
          title: item.title,
          description: item.description || "",
          type: item.type,
          genre: item.genre || "",
          releaseYear: item.releaseYear || "",
          poster: item.poster || "",
          videoUrl: item.videoUrl || "",
          episodes: item.episodes?.length ? item.episodes : [{ title: "", videoUrl: "" }],
        });
      })
      .catch((err) => setError(errorText(err)));
  }, [id, isEdit]);

  const onValueChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // episodes helpers
  const changeEpisode = (index, field, value) => {
    const updated = form.episodes.map((ep, i) => (i === index ? { ...ep, [field]: value } : ep));
    setForm({ ...form, episodes: updated });
  };
  const addEpisode = () => {
    setForm({ ...form, episodes: [...form.episodes, { title: "", videoUrl: "" }] });
  };
  const removeEpisode = (index) => {
    setForm({ ...form, episodes: form.episodes.filter((_, i) => i !== index) });
  };

  const submitData = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.title) return setError("Enter a title");
    if (form.type === "movie" && !form.videoUrl) return setError("Add the video link for this movie");
    if (form.type === "series" && !form.episodes.some((ep) => ep.title && ep.videoUrl)) {
      return setError("Add at least one episode with a title and a video link");
    }

    try {
      setSaving(true);
      if (isEdit) {
        await api.put(`/admin/content/${id}`, form);
      } else {
        await api.post("/admin/content", form);
      }
      navigate("/admin/content");
    } catch (err) {
      setError(errorText(err));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="container py-4">
      <Link to="/admin/content" className="small">Back to Movies & series</Link>
      <h1 className="page-title mt-2">{isEdit ? "Edit title" : "Add a movie or series"}</h1>

      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={submitData} className="row g-4">
        <div className="col-lg-8">
          <div className="panel">
            <div className="mb-3">
              <span className="form-label d-block">Type</span>
              <div className="btn-group" role="group">
                <input type="radio" className="btn-check" name="type" id="type-movie" value="movie" checked={form.type === "movie"} onChange={onValueChange} />
                <label className="btn btn-outline-light" htmlFor="type-movie">Movie</label>
                <input type="radio" className="btn-check" name="type" id="type-series" value="series" checked={form.type === "series"} onChange={onValueChange} />
                <label className="btn btn-outline-light" htmlFor="type-series">Series</label>
              </div>
            </div>

            <label className="form-label" htmlFor="title">Title <span className="req">*</span></label>
            <input id="title" name="title" className="form-control mb-3" value={form.title} onChange={onValueChange} />

            <label className="form-label" htmlFor="description">Description</label>
            <textarea id="description" name="description" rows="3" className="form-control mb-3" value={form.description} onChange={onValueChange}></textarea>

            <div className="row g-3 mb-3">
              <div className="col-sm-6">
                <label className="form-label" htmlFor="genre">Genre</label>
                <input id="genre" name="genre" className="form-control" placeholder="Action, Drama, Comedy..." value={form.genre} onChange={onValueChange} />
              </div>
              <div className="col-sm-6">
                <label className="form-label" htmlFor="releaseYear">Release year</label>
                <input id="releaseYear" name="releaseYear" type="number" className="form-control" value={form.releaseYear} onChange={onValueChange} />
              </div>
            </div>

            <label className="form-label" htmlFor="poster">Poster image link</label>
            <input id="poster" name="poster" className="form-control" placeholder="/posters/movie1.jpg" value={form.poster} onChange={onValueChange} />
            <p className="form-text mb-3">A file in server/posters, like /posters/movie1.jpg, or any image link from a website.</p>

            {form.type === "movie" ? (
              <>
                <label className="form-label" htmlFor="videoUrl">Video link <span className="req">*</span></label>
                <input id="videoUrl" name="videoUrl" className="form-control" placeholder="/videos/movie1.mp4 or a YouTube link" value={form.videoUrl} onChange={onValueChange} />
                <p className="form-text">A file in server/videos, like /videos/movie1.mp4, a YouTube link, or a direct .mp4 link.</p>
              </>
            ) : (
              <>
                <span className="form-label d-block">Episodes <span className="req">*</span></span>
                {form.episodes.map((ep, index) => (
                  <div className="episode-row" key={index}>
                    <span className="ep-num">{index + 1}</span>
                    <input className="form-control" placeholder="Episode title" value={ep.title} onChange={(e) => changeEpisode(index, "title", e.target.value)} aria-label={`Episode ${index + 1} title`} />
                    <input className="form-control" placeholder="/videos/episode1.mp4 or YouTube link" value={ep.videoUrl} onChange={(e) => changeEpisode(index, "videoUrl", e.target.value)} aria-label={`Episode ${index + 1} video link`} />
                    {form.episodes.length > 1 && (
                      <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => removeEpisode(index)}>Remove</button>
                    )}
                  </div>
                ))}
                <button type="button" className="btn btn-sm btn-outline-light mt-2" onClick={addEpisode}>Add another episode</button>
              </>
            )}
          </div>
        </div>

        <div className="col-lg-4">
          <div className="panel">
            <span className="form-label d-block">Poster preview</span>
            <Poster src={form.poster} title={form.title || "Your title"} />
            <button type="submit" className="btn btn-gold w-100 mt-4" disabled={saving}>
              {saving ? "Saving..." : isEdit ? "Save changes" : "Add title"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ContentForm;
