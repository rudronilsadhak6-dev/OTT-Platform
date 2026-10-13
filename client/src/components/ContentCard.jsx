import React from "react";
import { Link } from "react-router-dom";
import Poster from "./Poster";

const ContentCard = ({ item, onRemove }) => {
  const info =
    item.type === "series"
      ? `Series, ${item.episodes?.length || 0} episodes`
      : "Movie";

  return (
    <div className="content-card">
      <Link to={`/watch/${item._id}`} className="content-link">
        <Poster src={item.poster} title={item.title} />
        <div className="card-text">
          <h3 className="card-title-sm">{item.title}</h3>
          <p className="card-sub">
            {info}
            {item.releaseYear ? `, ${item.releaseYear}` : ""}
          </p>
        </div>
      </Link>
      {onRemove && (
        <button className="btn btn-sm btn-outline-danger w-100 mt-2" onClick={() => onRemove(item._id)}>
          Remove
        </button>
      )}
    </div>
  );
};

export default ContentCard;
