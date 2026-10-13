import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api, { errorText } from "../../api";

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");

  const loadData = async () => {
    try {
      setError("");
      const [statsRes, usersRes] = await Promise.all([
        api.get("/admin/stats"),
        api.get("/admin/users"),
      ]);
      setStats(statsRes.data);
      setUsers(usersRes.data);
    } catch (err) {
      setError(errorText(err));
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const removeUser = async (user) => {
    if (!window.confirm(`Remove ${user.name}? They will lose their account.`)) return;
    try {
      await api.delete(`/admin/users/${user._id}`);
      loadData();
    } catch (err) {
      alert(errorText(err));
    }
  };

  const formatDate = (date) => (date ? new Date(date).toLocaleString() : "Never");

  if (error) return <div className="container py-4"><div className="alert alert-danger">{error}</div></div>;
  if (!stats) return <div className="container py-4 text-muted-soft">Loading dashboard...</div>;

  return (
    <div className="container py-4">
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
        <h1 className="page-title mb-0">Dashboard</h1>
        <Link to="/admin/content/new" className="btn btn-gold">Add movie or series</Link>
      </div>

      <div className="stat-grid">
        <div className="stat stat-main">
          <span className="stat-num">{stats.totalUsers}</span>
          <span className="stat-label">Registered users</span>
        </div>
        <div className="stat">
          <span className="stat-num">{stats.activeUsers}</span>
          <span className="stat-label">Logged in, last 24 hours</span>
        </div>
        <div className="stat">
          <span className="stat-num">{stats.totalMovies}</span>
          <span className="stat-label">Movies</span>
        </div>
        <div className="stat">
          <span className="stat-num">{stats.totalSeries}</span>
          <span className="stat-label">Series</span>
        </div>
        <div className="stat">
          <span className="stat-num">{stats.totalViews}</span>
          <span className="stat-label">Total plays</span>
        </div>
        <Link to="/admin/inbox" className="stat stat-link">
          <span className="stat-num">{stats.openMessages || 0}</span>
          <span className="stat-label">Open messages and reports</span>
        </Link>
      </div>

      <div className="row g-4 mt-1">
        <div className="col-lg-4">
          <div className="panel">
            <h2 className="section-title">Most watched</h2>
            {stats.topContent.length === 0 ? (
              <p className="text-muted-soft mb-0">No titles yet.</p>
            ) : (
              <ol className="top-list">
                {stats.topContent.map((item) => (
                  <li key={item._id}>
                    <span>{item.title}</span>
                    <span className="text-muted-soft">{item.views} plays</span>
                  </li>
                ))}
              </ol>
            )}
          </div>
        </div>

        <div className="col-lg-8">
          <div className="panel">
            <h2 className="section-title">Users ({users.length})</h2>
            {users.length === 0 ? (
              <p className="text-muted-soft mb-0">No one has signed up yet. Share your site to get your first users.</p>
            ) : (
              <div className="table-responsive">
                <table className="table table-dark-soft align-middle mb-0">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Joined</th>
                      <th>Last login</th>
                      <th>Watch later</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user._id}>
                        <td>{user.name}</td>
                        <td>{user.email}</td>
                        <td>{formatDate(user.createdAt)}</td>
                        <td>{formatDate(user.lastLogin)}</td>
                        <td>{user.watchlist?.length || 0}</td>
                        <td>
                          <button className="btn btn-sm btn-outline-danger" onClick={() => removeUser(user)}>Remove</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
