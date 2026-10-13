import React from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { SITE } from "../siteInfo";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-md app-nav">
      <div className="container">
        <Link className="navbar-brand brand" to={user?.role === "admin" ? "/admin" : "/"}>
          <span className="brand-mark" aria-hidden="true"></span>{SITE.name}
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#mainNav"
          aria-controls="mainNav"
          aria-expanded="false"
          aria-label="Open menu"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="mainNav">
          <ul className="navbar-nav me-auto">
            {user?.role === "admin" ? (
              <>
                <li className="nav-item"><NavLink end className="nav-link" to="/admin">Dashboard</NavLink></li>
                <li className="nav-item"><NavLink className="nav-link" to="/admin/content">Movies & series</NavLink></li>
                <li className="nav-item"><NavLink className="nav-link" to="/admin/inbox">Inbox</NavLink></li>
                <li className="nav-item"><NavLink end className="nav-link" to="/">View site</NavLink></li>
              </>
            ) : user ? (
              <>
                <li className="nav-item"><NavLink end className="nav-link" to="/">Browse</NavLink></li>
                <li className="nav-item"><NavLink className="nav-link" to="/watchlist">Watch later</NavLink></li>
                <li className="nav-item"><NavLink className="nav-link" to="/help">Help</NavLink></li>
              </>
            ) : (
              <>
                <li className="nav-item"><NavLink className="nav-link" to="/about">About</NavLink></li>
                <li className="nav-item"><NavLink className="nav-link" to="/contact">Contact</NavLink></li>
                <li className="nav-item"><NavLink className="nav-link" to="/help">Help</NavLink></li>
              </>
            )}
          </ul>

          {user ? (
            <div className="d-flex align-items-center gap-3">
              <span className="text-muted-soft small">Hi, {user.name}</span>
              <button className="btn btn-sm btn-outline-light" onClick={handleLogout}>Log out</button>
            </div>
          ) : (
            <div className="d-flex align-items-center gap-2">
              <Link className="btn btn-sm btn-outline-light" to="/login">Log in</Link>
              <Link className="btn btn-sm btn-gold" to="/register">Sign up</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
