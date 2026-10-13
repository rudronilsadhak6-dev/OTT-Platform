import React, { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import api, { errorText } from "../api";
import { useAuth } from "../context/AuthContext";

const Register = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (user) return <Navigate to="/" replace />;

  const onValueChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submitData = async (e) => {
    e.preventDefault();
    setError("");
    // validation
    if (!form.name) return setError("Enter your name");
    if (!form.email) return setError("Enter your email");
    if (form.password.length < 6) return setError("Password must be at least 6 characters");
    if (form.password !== form.confirm) return setError("The two passwords do not match");

    try {
      setLoading(true);
      await api.post("/auth/register", {
        name: form.name,
        email: form.email,
        password: form.password,
      });
      alert("Account created. Log in to start watching.");
      navigate("/login");
    } catch (err) {
      setError(errorText(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="auth-wrap">
      <div className="auth-card">
        <h1 className="auth-title">Create your account</h1>
        <p className="text-muted-soft">Free to join. Watch movies and series anytime you're online.</p>

        {error && <div className="alert alert-danger py-2">{error}</div>}

        <form onSubmit={submitData}>
          <label className="form-label" htmlFor="name">Name</label>
          <input id="name" type="text" name="name" className="form-control mb-3" value={form.name} onChange={onValueChange} placeholder="Your name" />

          <label className="form-label" htmlFor="email">Email</label>
          <input id="email" type="email" name="email" className="form-control mb-3" value={form.email} onChange={onValueChange} placeholder="you@example.com" />

          <label className="form-label" htmlFor="password">Password</label>
          <input id="password" type="password" name="password" className="form-control mb-3" value={form.password} onChange={onValueChange} placeholder="At least 6 characters" />

          <label className="form-label" htmlFor="confirm">Confirm password</label>
          <input id="confirm" type="password" name="confirm" className="form-control mb-4" value={form.confirm} onChange={onValueChange} placeholder="Type it again" />

          <button type="submit" className="btn btn-gold w-100" disabled={loading}>
            {loading ? "Creating account..." : "Create account"}
          </button>
        </form>

        <p className="mt-4 mb-0 text-muted-soft">
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </div>
    </section>
  );
};

export default Register;
