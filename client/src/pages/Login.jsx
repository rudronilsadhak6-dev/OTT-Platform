import React, { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import api, { errorText } from "../api";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (user) return <Navigate to={user.role === "admin" ? "/admin" : "/"} replace />;

  const onValueChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submitData = async (e) => {
    e.preventDefault(); // stop the page refresh
    setError("");
    if (!form.email || !form.password) {
      setError("Enter your email and password");
      return;
    }
    try {
      setLoading(true);
      const res = await api.post("/auth/login", form);
      login(res.data.token, res.data.user);
      navigate(res.data.user.role === "admin" ? "/admin" : "/"); // programmatic router
    } catch (err) {
      setError(errorText(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="auth-wrap">
      <div className="auth-card">
        <h1 className="auth-title">Log in</h1>
        <p className="text-muted-soft">Pick up where you left off.</p>

        {error && <div className="alert alert-danger py-2">{error}</div>}

        <form onSubmit={submitData}>
          <label className="form-label" htmlFor="email">Email</label>
          <input id="email" type="email" name="email" className="form-control mb-3" value={form.email} onChange={onValueChange} placeholder="you@example.com" />

          <label className="form-label" htmlFor="password">Password</label>
          <input id="password" type="password" name="password" className="form-control mb-4" value={form.password} onChange={onValueChange} placeholder="Your password" />

          <button type="submit" className="btn btn-gold w-100" disabled={loading}>
            {loading ? "Logging in..." : "Log in"}
          </button>
        </form>

        <p className="mt-4 mb-0 text-muted-soft">
          New here? <Link to="/register">Create an account</Link>
        </p>
      </div>
    </section>
  );
};

export default Login;
