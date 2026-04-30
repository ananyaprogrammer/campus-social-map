import React, { useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import "./PostCard.css";

const typeMeta = (type) => {
  switch (type) {
    case "EVENT":
      return { label: "Event", className: "badge-event" };
    case "STUDY_GROUP":
      return { label: "Study Group", className: "badge-study" };
    case "LOST_FOUND":
      return { label: "Lost & Found", className: "badge-lost" };
    default:
      return { label: "Other", className: "badge-default" };
  }
};

export default function PostCard({ post }) {
  const dateStr = post.date ? new Date(post.date).toLocaleDateString() : null;
  const { label, className } = typeMeta(post.type);

  const bgRef = useRef(null);
  const hiddenImgRef = useRef(null);

  useEffect(() => {
    const el = bgRef.current;
    if (!el) return;

    // Force the wrapper to the desired dimensions & background behaviour with !important
    el.style.setProperty("min-height", "260px", "important");
    el.style.setProperty("max-height", "360px", "important");
    el.style.setProperty("padding", "0px", "important");
    el.style.setProperty("overflow", "hidden", "important");
    el.style.setProperty("display", "block", "important");
    el.style.setProperty("border-radius", "0.9rem", "important");
    el.style.setProperty("background-repeat", "no-repeat", "important");
    el.style.setProperty("background-position", "center center", "important");
    // important: contain so full image visible (no crop)
    el.style.setProperty("background-size", "contain", "important");

    if (post.imageUrl) {
      // apply image url as background
      el.style.setProperty("background-image", `url("${post.imageUrl}")`, "important");
      el.setAttribute("aria-label", post.title || "post image");
    } else {
      el.style.removeProperty("background-image");
      el.removeAttribute("aria-label");
    }

    // Also ensure hidden <img> (if present) is allowed to load (helps caching)
    const hiddenImg = hiddenImgRef.current;
    if (hiddenImg && hiddenImg.src !== post.imageUrl) {
      hiddenImg.src = post.imageUrl || "";
    }
  }, [post.imageUrl, post.title]);

  return (
    <Link to={`/posts/${post._id}`} className="post-card-link">
      <article className="post-card">
        {/* IMAGE AS BACKGROUND (force contain) */}
        {post.imageUrl && (
          <div
            ref={bgRef}
            className="post-card-bg-wrapper"
            role="img"
            aria-hidden={false}
          >
            {/* Hidden <img> to ensure browser preloads the source (and to keep accessibility/caching sane).
                It's visually hidden but keeps normal image loading behaviour. */}
            <img
              ref={hiddenImgRef}
              alt={post.title || ""}
              style={{
                width: 0,
                height: 0,
                position: "absolute",
                left: "-9999px",
                opacity: 0,
                pointerEvents: "none",
              }}
            />
            {/* Keep a non-visual label for assistive tech */}
            <span style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(1px,1px,1px,1px)" }}>
              {post.title}
            </span>
          </div>
        )}

        <div className="post-card-content">
          {/* Title + type */}
          <header className="post-card-header">
            <h3 className="post-card-title">{post.title}</h3>
            <span className={`post-card-badge ${className}`}>{label}</span>
          </header>

          {/* Description */}
          <p className="post-card-description">{post.description}</p>

          {/* Meta info */}
          <div className="post-card-meta">
            <p className="meta-item">
              <span className="meta-icon">📍</span>
              <span>{post.locationText}</span>
            </p>

            {dateStr && (
              <p className="meta-item">
                <span className="meta-icon">📅</span>
                <span>
                  {dateStr} {post.time && `• ${post.time}`}
                </span>
              </p>
            )}

            <p className="meta-item">
              <span className="meta-icon">👤</span>
              <span>{post.createdBy?.name || "Unknown"}</span>
              <span className="meta-dot">•</span>
              <span>👥 {post.participants?.length || 0} joined</span>
            </p>
          </div>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="post-card-tags">
              {post.tags.map((tag) => (
                <span key={tag} className="post-card-tag">
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </article>
    </Link>
  );
}
