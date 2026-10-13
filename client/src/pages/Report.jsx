import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import api, { errorText } from "../api";

const REPORT_TYPES = [
  "Video is not playing",
  "Wrong movie or series information",
  "Inappropriate or illegal content",
  "Problem with the website",
  "Other",
];

const Report = () => {
  const [searchParams] = useSearchParams(); // /report?title=<id> fills in the title for you
  const [titles, setTitles] = useState([]);
  const [form, setForm] = useState({
    reportType: "",
    contentId: searchParams.get("title") || "",
    message: "",
  });
  const [error, setError] = useState("");
  const [done, setDone] = useState("");
  const [sending, setSending] = useState(false);

  // load the list of titles for the dropdown
  useEffect(() => {
    api.get("/content")
      .then((res) => setTitles(res.data))
      .catch(() => {}); // the dropdown is optional, so ignore errors here
  }, []);

  const onValueChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submitData = async (e) => {
    e.preventDefault();
    setError("");
    setDone("");
    if (!form.reportType) return setError("Choose what kind of problem it is");
    if (form.message.trim().length < 10) return setError("Please describe the problem, at least 10 characters");

    try {
      setSending(true);
      const res = await api.post("/support/report", form);
      setDone(res.data.message);
      setForm({ reportType: "", contentId: "", message: "" });
    } catch (err) {
      setError(errorText(err));
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="text-page">
        <p className="hero-kicker">Report</p>
        <h1 className="page-title">Report a problem</h1>
        <p className="lead-text">
          Tell us what went wrong and our team will look into it. For general questions, use the{" "}
          <Link to="/contact">Contact page</Link>.
        </p>

        <div className="panel">
          {done && (
            <div className="alert alert-success py-2" role="status">
              {done} <Link to="/">Back to browse</Link>
            </div>
          )}
          {error && <div className="alert alert-danger py-2">{error}</div>}

          <form onSubmit={submitData}>
            <label className="form-label" htmlFor="reportType">What is the problem? <span className="req">*</span></label>
            <select id="reportType" name="reportType" className="form-select mb-3" value={form.reportType} onChange={onValueChange}>
              <option value="">Choose one</option>
              {REPORT_TYPES.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>

            <label className="form-label" htmlFor="contentId">Which movie or series? (optional)</label>
            <select id="contentId" name="contentId" className="form-select mb-3" value={form.contentId} onChange={onValueChange}>
              <option value="">Not about a specific title</option>
              {titles.map((item) => (
                <option key={item._id} value={item._id}>{item.title}</option>
              ))}
            </select>

            <label className="form-label" htmlFor="message">Describe the problem <span className="req">*</span></label>
            <textarea id="message" name="message" rows="6" className="form-control mb-3" value={form.message} onChange={onValueChange} placeholder="What happened? What did you expect to happen?"></textarea>

            <button type="submit" className="btn btn-gold" disabled={sending}>
              {sending ? "Sending..." : "Send report"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Report;
