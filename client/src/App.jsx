import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import OfflineBanner from "./components/OfflineBanner";
import ProtectedRoute from "./components/ProtectedRoute";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Watch from "./pages/Watch";
import Watchlist from "./pages/Watchlist";

import About from "./pages/About";
import Contact from "./pages/Contact";
import Help from "./pages/Help";
import Report from "./pages/Report";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";

import Dashboard from "./pages/admin/Dashboard";
import ManageContent from "./pages/admin/ManageContent";
import ContentForm from "./pages/admin/ContentForm";
import Inbox from "./pages/admin/Inbox";

function App() {
  return (
    <>
      <Navbar />
      <OfflineBanner />
      <main>
        <Routes>
          {/* Public pages */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/help" element={<Help />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />

          {/* User portal (must be logged in) */}
          <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="/watch/:id" element={<ProtectedRoute><Watch /></ProtectedRoute>} />
          <Route path="/watchlist" element={<ProtectedRoute><Watchlist /></ProtectedRoute>} />
          <Route path="/report" element={<ProtectedRoute><Report /></ProtectedRoute>} />

          {/* Admin portal (must be admin) */}
          <Route path="/admin" element={<ProtectedRoute adminOnly><Dashboard /></ProtectedRoute>} />
          <Route path="/admin/content" element={<ProtectedRoute adminOnly><ManageContent /></ProtectedRoute>} />
          <Route path="/admin/content/new" element={<ProtectedRoute adminOnly><ContentForm /></ProtectedRoute>} />
          <Route path="/admin/content/edit/:id" element={<ProtectedRoute adminOnly><ContentForm /></ProtectedRoute>} />
          <Route path="/admin/inbox" element={<ProtectedRoute adminOnly><Inbox /></ProtectedRoute>} />

          {/* Any unknown url goes home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}

export default App;
