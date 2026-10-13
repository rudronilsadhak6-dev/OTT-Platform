import React, { useEffect, useState } from "react";
import api, { errorText } from "../../api";

const kinds = [
  { value: "", label: "All" },
  { value: "contact", label: "Contact messages" },
  { value: "report", label: "Reports" },
];

const statuses = [
  { value: "open", label: "Open" },
  { value: "resolved", label: "Resolved" },
  { value: "", label: "Both" },
];

const Inbox = () => {
  const [items, setItems] = useState([]);
  const [kind, setKind] = useState("");
  const [status, setStatus] = useState("open");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    setError("");
    api.get("/admin/messages", { params: { kind, status } })
      .then((res) => setItems(res.data))
      .catch((err) => setError(errorText(err)))
      .finally(() => setLoading(false));
  }, [kind, status]);

  const changeStatus = async (item, newStatus) => {
    try {
      await api.patch(`/admin/messages/${item._id}`, { status: newStatus });
      // if we are only showing one status, the item leaves the list
      setItems(
        status
          ? items.filter((x) => x._id !== item._id)
          : items.map((x) => (x._id === item._id ? { ...x, status: newStatus } : x))
      );
    } catch (err) {
      alert(errorText(err));
    }
  };

  const removeItem = async (item) => {
    if (!window.confirm("Delete this message for good?")) return;
    try {
      await api.delete(`/admin/messages/${item._id}`);
      setItems(items.filter((x) => x._id !== item._id));
    } catch (err) {
      alert(errorText(err));
    }
  };

  const replyLink = (item) => {
    const subject = `Re: ${item.subject || item.reportType || "Your message to MovieNest"}`;
    return `mailto:${item.email}?subject=${encodeURIComponent(subject)}`;
  };

  return (
    <div className="container py-4">
      <h1 className="page-title">Inbox</h1>

      <div className="d-flex flex-wrap gap-3 mb-4">
        <div className="btn-group" role="group" aria-label="Choose message type">
          {kinds.map((k) => (
            <button
              key={k.label}
              className={`btn ${kind === k.value ? "btn-gold" : "btn-outline-light"}`}
              onClick={() => setKind(k.value)}
            >
              {k.label}
            </button>
          ))}
        </div>
        <div className="btn-group" role="group" aria-label="Choose status">
          {statuses.map((s) => (
            <button
              key={s.label}
              className={`btn ${status === s.value ? "btn-gold" : "btn-outline-light"}`}
              onClick={() => setStatus(s.value)}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}
      {loading && <p className="text-muted-soft">Loading...</p>}
      {!loading && !error && items.length === 0 && (
        <p className="empty">Nothing here. New contact messages and reports will show up in this list.</p>
      )}

      <div className="inbox-list">
        {items.map((item) => (
          <article className="panel inbox-item" key={item._id}>
            <div className="inbox-top">
              <span className={`badge ${item.kind === "report" ? "text-bg-warning" : "text-bg-info"}`}>
                {item.kind === "report" ? "Report" : "Contact"}
              </span>
              {item.status === "resolved" && <span className="badge text-bg-success">Resolved</span>}
              <span className="text-muted-soft small ms-auto">{new Date(item.createdAt).toLocaleString()}</span>
            </div>

            <h2 className="inbox-title">
              {item.kind === "report" ? item.reportType : item.subject || "(no subject)"}
            </h2>
            <p className="card-sub mb-2">
              From {item.name} ({item.email})
              {item.contentTitle ? `, about "${item.contentTitle}"` : ""}
            </p>
            <p className="inbox-message">{item.message}</p>

            <div className="d-flex flex-wrap gap-2">
              <a className="btn btn-sm btn-outline-light" href={replyLink(item)}>Reply by email</a>
              {item.status === "open" ? (
                <button className="btn btn-sm btn-gold" onClick={() => changeStatus(item, "resolved")}>Mark resolved</button>
              ) : (
                <button className="btn btn-sm btn-outline-light" onClick={() => changeStatus(item, "open")}>Reopen</button>
              )}
              <button className="btn btn-sm btn-outline-danger" onClick={() => removeItem(item)}>Delete</button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

export default Inbox;
