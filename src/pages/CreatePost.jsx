import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axiosInstance";
import "./CreatePost.css";

// 👉 yahan apna Cloudinary details daal
const CLOUD_NAME = "doyljoj7v";
const UPLOAD_PRESET = "unsigned_preset";

export default function CreatePost() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    type: "EVENT",
    locationText: "",
    date: "",
    time: "",
    tags: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();

  const onChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file || null);
  };

  const uploadImageToCloudinary = async (file) => {
    const url = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", UPLOAD_PRESET);

    const res = await fetch(url, {
      method: "POST",
      body: data,
    });

    if (!res.ok) {
      throw new Error("Image upload failed");
    }

    const json = await res.json();
    return json.secure_url;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setUploading(true);

    try {
      let imageUrl = "";

      if (imageFile) {
        imageUrl = await uploadImageToCloudinary(imageFile);
      }

      const payload = {
        ...form,
        tags: form.tags
          ? form.tags
              .split(",")
              .map((t) => t.trim())
              .filter(Boolean)
          : [],
        imageUrl,
      };

      const res = await api.post("/posts", payload);
      if (res.status === 201) {
        navigate("/");
      }
    } catch (err) {
      console.error("Create post error", err);
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to create post"
      );
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="create-page">
      <div className="create-card">
        <div className="create-header">
          <h2>Create a new post</h2>
          <p>Share an event, study group, or campus update with everyone.</p>
        </div>

        {error && <p className="create-error">{error}</p>}

        <form onSubmit={handleSubmit} className="create-form">
          {/* Title */}
          <div className="form-field">
            <label className="field-label" htmlFor="title">
              Title <span>*</span>
            </label>
            <input
              id="title"
              name="title"
              placeholder="e.g., DSA Doubt Solving Session"
              value={form.title}
              onChange={onChange}
              required
              className="field-input"
            />
          </div>

          {/* Description */}
          <div className="form-field">
            <label className="field-label" htmlFor="description">
              Description <span>*</span>
            </label>
            <textarea
              id="description"
              name="description"
              placeholder="Add details like agenda, who can join, things to bring..."
              value={form.description}
              onChange={onChange}
              required
              rows={4}
              className="field-textarea"
            />
          </div>

          {/* Type + Location */}
          <div className="form-row">
            <div className="form-field">
              <label className="field-label" htmlFor="type">
                Type
              </label>
              <select
                id="type"
                name="type"
                value={form.type}
                onChange={onChange}
                className="field-input"
              >
                <option value="EVENT">Event</option>
                <option value="STUDY_GROUP">Study Group</option>
                <option value="LOST_FOUND">Lost &amp; Found</option>
              </select>
            </div>

            <div className="form-field">
              <label className="field-label" htmlFor="locationText">
                Location <span>*</span>
              </label>
              <input
                id="locationText"
                name="locationText"
                placeholder="Block A, Lab 3, Seminar Hall..."
                value={form.locationText}
                onChange={onChange}
                required
                className="field-input"
              />
            </div>
          </div>

          {/* Date + Time */}
          <div className="form-row">
            <div className="form-field">
              <label className="field-label" htmlFor="date">
                Date
              </label>
              <input
                type="date"
                id="date"
                name="date"
                value={form.date}
                onChange={onChange}
                className="field-input"
              />
            </div>

            <div className="form-field">
              <label className="field-label" htmlFor="time">
                Time
              </label>
              <input
                type="time"
                id="time"
                name="time"
                value={form.time}
                onChange={onChange}
                className="field-input"
              />
            </div>
          </div>

          {/* Image */}
          <div className="form-field">
            <label className="field-label">Image (optional)</label>
            <label className="file-drop" htmlFor="image-upload">
              <div className="file-drop-inner">
                <span className="file-icon">📎</span>
                <div className="file-text">
                  <span className="file-main">
                    {imageFile ? imageFile.name : "Click to upload or drag & drop"}
                  </span>
                  <span className="file-sub">PNG, JPG up to ~5MB</span>
                </div>
              </div>
            </label>
            <input
              id="image-upload"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="file-input-hidden"
            />
          </div>

          {/* Tags */}
          <div className="form-field">
            <label className="field-label" htmlFor="tags">
              Tags
            </label>
            <input
              id="tags"
              name="tags"
              placeholder="e.g., DSA, fresher, hackathon"
              value={form.tags}
              onChange={onChange}
              className="field-input"
            />
            {form.tags && (
              <p className="tags-hint">
                Press comma to separate tags. Preview:{" "}
                {form.tags
                  .split(",")
                  .map((t) => t.trim())
                  .filter(Boolean)
                  .map((t) => (
                    <span key={t} className="tags-chip">
                      #{t}
                    </span>
                  ))}
              </p>
            )}
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={uploading}
            className="create-btn"
          >
            {uploading ? "Publishing..." : "Publish post"}
          </button>
        </form>
      </div>
    </div>
  );
}
