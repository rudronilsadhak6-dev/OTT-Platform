import React from "react";
import { Link } from "react-router-dom";
import { SITE } from "../siteInfo";

const Privacy = () => (
  <div className="container py-5">
    <div className="text-page">
      <p className="hero-kicker">Legal</p>
      <h1 className="page-title">Privacy policy</h1>
      <p className="lead-text">
        This page explains what {SITE.name} stores about you and how it is used.
      </p>

      <h2 className="section-title">What we store</h2>
      <p>
        When you create an account we store your name, your email address and a scrambled (hashed)
        version of your password. We also store when you last logged in, the titles in your Watch later
        list, and how many times each title has been played. Messages you send through Contact us or
        Report a problem are stored so our team can read them.
      </p>

      <h2 className="section-title">How we use it</h2>
      <p>
        We use this information to log you in, show your Watch later list, keep the site working and
        answer your messages. Our admin team can see the names, email addresses and last login times of
        registered users.
      </p>

      <h2 className="section-title">What we do not do</h2>
      <p>We do not sell your information and we do not show advertisements.</p>

      <h2 className="section-title">Browser storage</h2>
      <p>
        {SITE.name} keeps your login in your browser&apos;s local storage so you stay signed in. Log out to
        remove it.
      </p>

      <h2 className="section-title">Other services</h2>
      <p>
        The site loads fonts from Google Fonts and styling from the Bootstrap CDN. If a title is a YouTube
        video, the YouTube player is loaded and YouTube&apos;s own policies apply to it.
      </p>

      <h2 className="section-title">Your choices</h2>
      <p>
        You can ask us to remove your account at any time. Send a message from the{" "}
        <Link to="/contact">Contact page</Link>.
      </p>

      <h2 className="section-title">Changes</h2>
      <p>We may update this policy from time to time. Last updated: October 2026.</p>
    </div>
  </div>
);

export default Privacy;
