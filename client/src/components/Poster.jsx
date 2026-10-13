import React, { useEffect, useState } from "react";
import { mediaUrl } from "../media";

// Shows the poster image, or the title on a plain block if the image is missing/broken
const Poster = ({ src, title, className = "" }) => {
  const [broken, setBroken] = useState(false);

  // try again whenever the link changes (for example while the admin is typing it)
  useEffect(() => {
    setBroken(false);
  }, [src]);

  if (!src || broken) {
    return (
      <div className={`poster poster-fallback ${className}`}>
        <span>{title}</span>
      </div>
    );
  }
  return (
    <div className={`poster ${className}`}>
      <img src={mediaUrl(src)} alt={title} loading="lazy" onError={() => setBroken(true)} />
    </div>
  );
};

export default Poster;
