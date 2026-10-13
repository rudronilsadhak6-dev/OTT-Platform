import React from "react";
import { Link } from "react-router-dom";
import { SITE } from "../siteInfo";

const Terms = () => (
  <div className="container py-5">
    <div className="text-page">
      <p className="hero-kicker">Legal</p>
      <h1 className="page-title">Terms of use</h1>
      <p className="lead-text">By using {SITE.name} you agree to these terms.</p>

      <h2 className="section-title">Your account</h2>
      <p>
        Give correct information when you register and keep your password private. You are responsible
        for what happens under your account.
      </p>

      <h2 className="section-title">Using the site</h2>
      <p>
        Do not misuse {SITE.name}. This means no attempts to break or overload the site, no sharing of
        illegal content and no use of other people&apos;s accounts.
      </p>

      <h2 className="section-title">Movies and series</h2>
      <p>
        Titles shown on {SITE.name} belong to their respective owners. You may watch them on the site but
        you may not copy or redistribute them.
      </p>

      <h2 className="section-title">Our right to act</h2>
      <p>
        We may suspend or remove accounts that break these terms. Admins may add, edit or remove titles at
        any time.
      </p>

      <h2 className="section-title">Availability</h2>
      <p>
        We try to keep {SITE.name} running, but we cannot promise that it will always be available or free
        of errors.
      </p>

      <h2 className="section-title">Questions</h2>
      <p>
        If you have any questions about these terms, <Link to="/contact">contact us</Link>.
      </p>
      <p>Last updated: October 2026.</p>
    </div>
  </div>
);

export default Terms;
