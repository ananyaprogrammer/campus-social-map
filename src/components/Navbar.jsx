import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const token = localStorage.getItem("csm_token");
  const user = localStorage.getItem("csm_user")
    ? JSON.parse(localStorage.getItem("csm_user"))
    : null;

  const handleLogout = () => {
    localStorage.removeItem("csm_token");
    localStorage.removeItem("csm_user");
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  const [theme, setTheme] = useState(
    localStorage.getItem("csm_theme") || "dark"
  );

  useEffect(() => {
    const next = theme === "light" ? "theme-light" : "theme-dark";
    document.body.classList.remove("theme-light", "theme-dark");
    document.body.classList.add(next);
    localStorage.setItem("csm_theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <nav className="csm-navbar">
      <div className="csm-nav-inner">
        {/* Brand */}
        <Link to="/" className="csm-brand">
          <div className="csm-logo-circle">CS</div>
          <div className="csm-brand-text">
            <span className="csm-brand-title">Campus Social Map</span>
            <span className="csm-brand-subtitle">
              Connect • Discover • Meet
            </span>
          </div>
        </Link>

        {/* Desktop links */}
        <div className="csm-nav-links">
          {/* About – always visible */}
          <Link
            to="/about"
            className={`csm-nav-link ${isActive("/about") ? "active" : ""}`}
          >
            About
          </Link>

          {/* New Post – only when logged in */}
          {token && (
            <Link
              to="/create"
              className={`csm-nav-link ${isActive("/create") ? "active" : ""}`}
            >
              <span className="plus-icon">+</span> New Post
            </Link>
          )}

          {token ? (
            <>
              <div className="csm-user-pill">
                <div className="csm-user-avatar">
                  {user?.name?.[0]?.toUpperCase() || "U"}
                </div>
                <div className="csm-user-text">
                  <span className="csm-user-label">Logged in as</span>
                  <span className="csm-user-name">{user?.name || "User"}</span>
                </div>
              </div>
              <button
                className="csm-btn csm-btn-outline"
                onClick={handleLogout}
              >
                Logout
              </button>
            </>
          ) : (
            <div className="csm-auth-group">
              <Link
                to="/login"
                className={`csm-btn csm-btn-ghost ${
                  isActive("/login") ? "active" : ""
                }`}
              >
                Login
              </Link>
              <Link
                to="/register"
                className={`csm-btn csm-btn-primary ${
                  isActive("/register") ? "active" : ""
                }`}
              >
                Get Started
              </Link>
            </div>
          )}

          <button
            type="button"
            className="theme-toggle-btn"
            onClick={toggleTheme}
          >
            {theme === "light" ? "🌙" : "☀️"}
          </button>
        </div>

        {/* Mobile menu toggle */}
        <button
          className="csm-mobile-toggle"
          onClick={() => setIsMobileOpen((prev) => !prev)}
        >
          <span className={isMobileOpen ? "bar bar1 open" : "bar bar1"}></span>
          <span className={isMobileOpen ? "bar bar2 open" : "bar bar2"}></span>
        </button>
      </div>

      {/* Mobile dropdown */}
      <div className={`csm-mobile-menu ${isMobileOpen ? "open" : ""}`}>
        {/* About – mobile */}
        <Link
          to="/about"
          className={`csm-mobile-link ${isActive("/about") ? "active" : ""}`}
          onClick={() => setIsMobileOpen(false)}
        >
          About
        </Link>

        {token && (
          <Link
            to="/create"
            className={`csm-mobile-link ${
              isActive("/create") ? "active" : ""
            }`}
            onClick={() => setIsMobileOpen(false)}
          >
            + New Post
          </Link>
        )}

        {token ? (
          <>
            <div className="csm-mobile-user">
              <div className="csm-user-avatar">
                {user?.name?.[0]?.toUpperCase() || "U"}
              </div>
              <div className="csm-user-text">
                <span className="csm-user-label">Logged in as</span>
                <span className="csm-user-name">{user?.name || "User"}</span>
              </div>
            </div>
            <button
              className="csm-btn csm-btn-outline full"
              onClick={() => {
                setIsMobileOpen(false);
                handleLogout();
              }}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className={`csm-mobile-link ${
                isActive("/login") ? "active" : ""
              }`}
              onClick={() => setIsMobileOpen(false)}
            >
              Login
            </Link>
            <Link
              to="/register"
              className={`csm-mobile-link ${
                isActive("/register") ? "active" : ""
              }`}
              onClick={() => setIsMobileOpen(false)}
            >
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
