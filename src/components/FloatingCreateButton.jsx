import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./FloatingCreateButton.css";

export default function FloatingCreateButton() {
  const navigate = useNavigate();
  const location = useLocation();

  const token = localStorage.getItem("csm_token");

  // Hide on auth pages and create page
  if (!token) return null;
  if (location.pathname === "/create") return null;
  if (location.pathname === "/login" || location.pathname === "/register")
    return null;

  return (
    <button
      className="floating-create-btn"
      onClick={() => navigate("/create")}
    >
      <span className="floating-plus">+</span>
      <span className="floating-label">Create post</span>
    </button>
  );
}
