import React, { useState } from "react";
import api, { errorText } from "../api";
import { useAuth } from "../context/AuthContext";
import { SITE } from "../siteInfo";

const Contact = () => {
  const { user } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    subject: "",
    message: "",
  });
  const [error, setError] = useState("");
  const [done, setDone] = useState("");
  const [sending, setSending] = useState(false);

  const onValueChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submitData = async (e) => {
    e.preventDefault(); // stop the page refresh
    setError("");
    setDone("");
    // validation
    if (!form.name) return setError("Enter your name");
    if (!form.email) return setError("Enter your email");
    if (form.message.trim().length < 10) return setError("Please write a little more, at least 10 characters");

    try {
      setSending(true);
      const res = await api.post("/support/contact", form);
      setDone(res.data.message);
      setForm({ ...form, subject: "", message: "" });
    } catch (err) {
      setError(errorText(err));
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="container py-5">
      <p className="hero-kicker">Contact us</p>
      <h1 className="page-title">We would love to hear from you</h1>

      <div className="row g-4">
        <div className="col-lg-4">
          <div className="panel h-100">
            <h2 className="section-title">Get in touch</h2>
            <p className="mb-1"><strong>Email</strong></p>
            <p><a href={`mailto:${SITE.email}`}>{SITE.email}</a></p>
            <p className="mb-1"><strong>Address</strong></p>
            <p>{SITE.address}</p>
            <p className="mb-1"><strong>Reply time</strong></p>
            <p className="mb-0">We try to reply {SITE.replyTime}.</p>
          </div>
        </div>

        <div className="col-lg-8">
          <div className="panel">
            <h2 className="section-title">Send us a message</h2>

            {done && <div className="alert alert-success py-2" role="status">{done}</div>}
            {error && <div className="alert alert-danger py-2">{error}</div>}

            <form onSubmit={submitData}>
              <div className="row g-3 mb-3">
                <div className="col-sm-6">
                  <label className="form-label" htmlFor="name">Name <span className="req">*</span></label>
                  <input id="name" name="name" className="form-control" value={form.name} onChange={onValueChange} />
                </div>
                <div className="col-sm-6">
                  <label className="form-label" htmlFor="email">Email <span className="req">*</span></label>
                  <input id="email" name="email" type="email" className="form-control" value={form.email} onChange={onValueChange} />
                </div>
              </div>

              <label className="form-label" htmlFor="subject">Subject</label>
              <input id="subject" name="subject" className="form-control mb-3" value={form.subject} onChange={onValueChange} />

              <label className="form-label" htmlFor="message">Message <span className="req">*</span></label>
              <textarea id="message" name="message" rows="6" className="form-control mb-3" value={form.message} onChange={onValueChange}></textarea>

              <button type="submit" className="btn btn-gold" disabled={sending}>
                {sending ? "Sending..." : "Send message"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
