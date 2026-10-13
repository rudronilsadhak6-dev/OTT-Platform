import React from "react";
import { Link } from "react-router-dom";

const faqs = [
  {
    q: "How do I create an account?",
    a: "Click Sign up at the top, enter your name, your email and a password of at least 6 characters, then log in.",
  },
  {
    q: "I forgot my password. What can I do?",
    a: (
      <>
        Password reset is not available yet. Please <Link to="/contact">contact us</Link> and tell us the
        email you registered with.
      </>
    ),
  },
  {
    q: "How do I watch a movie or series?",
    a: "Log in, open any title on the Browse page and press play. For a series, choose an episode from the list under the video.",
  },
  {
    q: "The video does not play or keeps stopping",
    a: (
      <>
        Check your internet connection, refresh the page and try again. Titles play online only. If it still
        does not work, send us a note from <Link to="/report">Report a problem</Link> and choose the title.
      </>
    ),
  },
  {
    q: "How does Watch later work?",
    a: "Open a title and press Add to Watch later. Your saved titles are on the Watch later page, and you can remove them at any time.",
  },
  {
    q: "How do I search for something?",
    a: "Use the search box on the Browse page. You can also switch between All, Movies and Series, and use the genre buttons.",
  },
  {
    q: "Can I download movies?",
    a: "No. Movies play online only, so you need an internet connection to watch.",
  },
  {
    q: "Does it cost anything?",
    a: "No. It is free to use right now and there are no subscription plans.",
  },
  {
    q: "How do I delete my account?",
    a: (
      <>
        Send us a message from the <Link to="/contact">Contact page</Link> and our team can remove your account.
      </>
    ),
  },
];

const Help = () => (
  <div className="container py-5">
    <div className="text-page">
      <p className="hero-kicker">Help</p>
      <h1 className="page-title">Help and frequently asked questions</h1>
      <p className="lead-text">Find quick answers below. If you cannot find yours, we are happy to help.</p>

      <div className="faq-list">
        {faqs.map((item) => (
          <details className="faq" key={item.q}>
            <summary>{item.q}</summary>
            <p>{item.a}</p>
          </details>
        ))}
      </div>

      <div className="panel mt-5">
        <h2 className="section-title">Still need help?</h2>
        <div className="d-flex flex-wrap gap-2">
          <Link to="/contact" className="btn btn-gold">Contact us</Link>
          <Link to="/report" className="btn btn-outline-light">Report a problem</Link>
        </div>
      </div>
    </div>
  </div>
);

export default Help;
