import React from "react";
import { Link } from "react-router-dom";

export default function StoreCard({ store }) {
  return (
    <div
      style={{
        border: "1px solid #ccc",
        padding: "12px",
        margin: "10px",
        borderRadius: "6px",
        width: "250px",
        boxShadow: "2px 2px 6px rgba(0,0,0,0.1)",
      }}
    >
      <h3>{store.name}</h3>
      <p>{store.address}</p>
      <p>Average Rating: {Number(store.avgRating || 0).toFixed(2)}</p>
      <p>Total Ratings: {store.ratingCount || 0}</p>
      <Link to={`/store/${store.id}`}>View Details</Link>
    </div>
  );
}
