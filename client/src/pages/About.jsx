import React from "react";
import { Link } from "react-router-dom";
import { SITE } from "../siteInfo";

const features = [
  {
    title: "Watch online",
    text: "Open any movie or series and play it right in your browser. You need an internet connection to watch.",
  },
  {
    title: "Find it fast",
    text: "Search by title, switch between movies and series, and filter by genre.",
  },
  {
    title: "Watch later",
    text: "Save titles to your own list and come back to them whenever you like.",
  },
  {
    title: "Tell us what is wrong",
    text: "Video not playing or information wrong? Send us a report and our team will look at it.",
  },
];

const About = () => (
  <div className="container py-5">
    <div className="text-page">
      <p className="hero-kicker">About us</p>
      <h1 className="page-title">About {SITE.name}</h1>
      <p className="lead-text">
        {SITE.name} is a streaming website where you can browse movies and web series, watch them online,
        and save the ones you want to see later.
      </p>
      <p>
        We built {SITE.name} as a full-stack web development project using the MERN stack: MongoDB for the
        database, Express.js and Node.js for the server, and React.js for the website you are using now.
      </p>

      <h2 className="section-title mt-5">What you can do here</h2>
      <div className="info-grid">
        {features.map((item) => (
          <div className="panel" key={item.title}>
            <h3 className="info-title">{item.title}</h3>
            <p className="mb-0 text-muted-soft">{item.text}</p>
          </div>
        ))}
      </div>

      <h2 className="section-title mt-5">Behind the scenes</h2>
      <p>
        Our team adds new movies and series, keeps their details correct, and reads the messages and
        reports you send. Everything is managed from a private admin dashboard.
      </p>

      <p className="mt-4">
        Questions or ideas? <Link to="/contact">Contact us</Link> or visit the <Link to="/help">Help page</Link>.
      </p>
    </div>
  </div>
);

export default About;
