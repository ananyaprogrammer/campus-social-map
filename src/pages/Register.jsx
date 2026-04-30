import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axiosInstance";
import "./Register.css";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    branch: "",
    year: ""
  });

  const [error, setError] = useState("");
  const navigate = useNavigate();

  const onChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await api.post("/auth/register", form);
      localStorage.setItem("csm_token", res.data.token);
      localStorage.setItem("csm_user", JSON.stringify(res.data.user));
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <h2>Create an account</h2>
          <p>Join the campus social network in seconds</p>
        </div>

        {error && <p className="auth-error">{error}</p>}

        <form onSubmit={handleSubmit} className="auth-form">

          <div className="form-field">
            <label className="field-label">Full Name</label>
            <input
              name="name"
              placeholder="e.g. Utkarsh Munna"
              value={form.name}
              onChange={onChange}
              required
              className="auth-input"
            />
          </div>

          <div className="form-field">
            <label className="field-label">College Email</label>
            <input
              type="email"
              name="email"
              placeholder="example@college.edu"
              value={form.email}
              onChange={onChange}
              required
              className="auth-input"
            />
          </div>

          <div className="form-field">
            <label className="field-label">Password</label>
            <input
              type="password"
              name="password"
              placeholder="Choose a strong password"
              value={form.password}
              onChange={onChange}
              required
              className="auth-input"
            />
          </div>

          <div className="form-field">
            <label className="field-label">Branch</label>
            <input
              name="branch"
              placeholder="e.g. CSE, ECE, ME"
              value={form.branch}
              onChange={onChange}
              className="auth-input"
            />
          </div>

          <div className="form-field">
            <label className="field-label">Year</label>
            <input
              name="year"
              placeholder="e.g. 1st year, 3rd year"
              value={form.year}
              onChange={onChange}
              className="auth-input"
            />
          </div>

          <button type="submit" className="auth-btn register-btn">
            Create Account
          </button>
        </form>

        <p className="auth-footer">
          Already have an account?{" "}
          <Link to="/login" className="auth-link">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
