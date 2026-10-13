import React from "react";
import { Link } from "react-router-dom";
import { SITE } from "../siteInfo";

const Footer = () => (
  <footer className="site-footer">
    <div className="container">
      <div className="row g-4">
        <div className="col-md-5">
          <p className="footer-brand">
            <span className="brand-mark" aria-hidden="true"></span>
            {SITE.name}
          </p>
          <p className="footer-text">{SITE.tagline}</p>
        </div>

        <nav className="col-6 col-md-2" aria-label="Company">
          <h2 className="footer-title">Company</h2>
          <ul className="footer-links">
            <li><Link to="/about">About us</Link></li>
            <li><Link to="/contact">Contact us</Link></li>
          </ul>
        </nav>

        <nav className="col-6 col-md-2" aria-label="Support">
          <h2 className="footer-title">Support</h2>
          <ul className="footer-links">
            <li><Link to="/help">Help and FAQ</Link></li>
            <li><Link to="/report">Report a problem</Link></li>
          </ul>
        </nav>

        <nav className="col-6 col-md-3" aria-label="Legal">
          <h2 className="footer-title">Legal</h2>
          <ul className="footer-links">
            <li><Link to="/privacy">Privacy policy</Link></li>
            <li><Link to="/terms">Terms of use</Link></li>
          </ul>
        </nav>
      </div>

      <p className="footer-copy">
        &copy; {new Date().getFullYear()} {SITE.name}. All rights reserved.
      </p>
    </div>
  </footer>
);

export default Footer;
