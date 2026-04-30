import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axiosInstance";
import "./PostDetails.css";

export default function PostDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  // current user
  const user = localStorage.getItem("csm_user")
    ? JSON.parse(localStorage.getItem("csm_user"))
    : null;
  const userId = user?._id || user?.id || user?.userId; // normalize id

  const fetchPost = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/posts/${id}`);
      setPost(res.data);
      setError("");
    } catch (err) {
      console.error("Error fetching post details", err);
      setError("Unable to load post");
      setPost(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPost();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (loading) {
    return (
      <div className="post-details-page">
        <div className="details-loading">
          <div className="spinner" />
          <span>Loading post...</span>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="post-details-page">
        <div className="details-card">
          <button onClick={() => navigate(-1)} className="back-btn">
            ← Back
          </button>
          <p className="details-error-text">Post not found or removed.</p>
        </div>
      </div>
    );
  }

  const dateStr = post.date ? new Date(post.date).toLocaleDateString() : null;

  // normalize createdBy id
  const createdById =
    post.createdBy?._id || post.createdBy?.id || post.createdBy?.userId;

  const isOwner = !!userId && !!createdById && createdById === userId;

  const isJoined =
    !!userId &&
    post.participants?.some(
      (p) => (p._id || p.id || p.userId) === userId
    );

  const handleJoinLeave = async () => {
    if (!user) return;
    setJoining(true);
    setError("");

    try {
      if (isJoined) {
        await api.post(`/posts/${post._id}/leave`);
      } else {
        await api.post(`/posts/${post._id}/join`);
      }
      await fetchPost();
    } catch (err) {
      console.error("Join/Leave error", err);
      setError("Action failed, please try again.");
    } finally {
      setJoining(false);
    }
  };

  const handleDelete = async () => {
    if (!isOwner) return;

    const ok = window.confirm("Are you sure you want to delete this post?");
    if (!ok) return;

    try {
      setDeleting(true);
      setError("");
      await api.delete(`/posts/${post._id}`);
      navigate("/");
    } catch (err) {
      console.error("Delete error", err);
      setError("Failed to delete post, try again.");
    } finally {
      setDeleting(false);
    }
  };

  const typeLabel = post.type.replace("_", " ");

  return (
    <div className="post-details-page">
      <div className="details-card">
        {/* Back Button */}
        <button onClick={() => navigate(-1)} className="back-btn">
          ← Back to feed
        </button>

        {/* Header */}
        <header className="details-header">
          <div className="details-title-wrap">
            <h2>{post.title}</h2>
            <span className={`details-type-badge type-${post.type || "OTHER"}`}>
              {typeLabel}
            </span>
          </div>
          <div className="details-participants-chip">
            👥 {post.participants?.length || 0} joined
          </div>
        </header>

        {/* Image */}
        {post.imageUrl && (
          <div className="details-image-wrapper">
            <img
              src={post.imageUrl}
              alt={post.title}
              className="details-image"
            />
          </div>
        )}

        {/* Description */}
        <p className="details-description">{post.description}</p>

        {/* Meta Section */}
        <div className="details-meta-grid">
          <div className="meta-block">
            <span className="meta-label">Location</span>
            <span className="meta-value">📍 {post.locationText}</span>
          </div>

          {dateStr && (
            <div className="meta-block">
              <span className="meta-label">When</span>
              <span className="meta-value">
                📅 {dateStr} {post.time && `• ${post.time}`}
              </span>
            </div>
          )}

          <div className="meta-block">
            <span className="meta-label">Created by</span>
            <span className="meta-value">
              👤 {post.createdBy?.name || "Unknown"}
              {post.createdBy?.branch && ` · ${post.createdBy.branch}`}
            </span>
          </div>
        </div>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="details-tags">
            {post.tags.map((tag) => (
              <span key={tag} className="details-tag-pill">
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Error */}
        {error && <p className="details-inline-error">{error}</p>}

        {/* Join + Delete Buttons */}
        <div className="details-actions">
          <button
            onClick={handleJoinLeave}
            disabled={joining || !user}
            className={`join-btn ${isJoined ? "leave" : "join"}`}
          >
            {joining
              ? "Please wait..."
              : isJoined
              ? "Leave this post"
              : user
              ? "Join this post"
              : "Login to join"}
          </button>

          {isOwner && (
            <button
              type="button"
              className="delete-btn"
              onClick={handleDelete}
              disabled={deleting}
            >
              {deleting ? "Deleting..." : "Delete post"}
            </button>
          )}
        </div>

        {/* Participants */}
        {post.participants && post.participants.length > 0 && (
          <section className="details-participants-section">
            <h3>People who joined</h3>
            <ul className="participants-list">
              {post.participants.map((p) => (
                <li key={p._id || p.id || p.userId} className="participant-item">
                  <div className="participant-avatar">
                    {p.name?.[0]?.toUpperCase() || "U"}
                  </div>
                  <div className="participant-info">
                    <span className="participant-name">{p.name}</span>
                    {p.branch && (
                      <span className="participant-branch">{p.branch}</span>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </div>
  );
}
