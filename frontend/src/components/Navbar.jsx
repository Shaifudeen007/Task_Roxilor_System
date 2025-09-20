import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { getUser, logout } from "../utils/auth";

export default function Navbar() {
  const user = getUser();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav style={{ padding: "10px", background: "#333", color: "#fff" }}>
      <Link to="/" style={{ marginRight: "10px", color: "#fff" }}>
        Home
      </Link>

      {user ? (
        <>
          {user.role === "admin" && (
            <Link to="/admin" style={{ marginRight: "10px", color: "#fff" }}>
              Admin Dashboard
            </Link>
          )}
          {user.role === "owner" && (
            <Link to="/owner" style={{ marginRight: "10px", color: "#fff" }}>
              Owner Dashboard
            </Link>
          )}
          <span style={{ marginRight: "10px" }}>Hi, {user.name}</span>
          <button onClick={handleLogout}>Logout</button>
        </>
      ) : (
        <>
          <Link to="/login" style={{ marginRight: "10px", color: "#fff" }}>
            Login
          </Link>
          <Link to="/signup" style={{ color: "#fff" }}>
            Signup
          </Link>
        </>
      )}
    </nav>
  );
}
