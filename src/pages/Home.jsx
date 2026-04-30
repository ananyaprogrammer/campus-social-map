import React, { useEffect, useState } from "react";
import api from "../api/axiosInstance";
import PostCard from "../components/PostCard";
import FilterBar from "../components/FilterBar";
import { io } from "socket.io-client";
import "./Home.css";

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [type, setType] = useState("");
  const [search, setSearch] = useState("");
  const [selectedTag, setSelectedTag] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const params = {};
      if (type) params.type = type;
      if (search) params.search = search;
      if (selectedTag) params.tag = selectedTag;

      const res = await api.get("/posts", { params });
      setPosts(res.data);
    } catch (err) {
      console.error("Error fetching posts", err);
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Filters change hone par reload (debounced)
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchPosts();
    }, 400);
    return () => clearTimeout(delayDebounce);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type, search, selectedTag]);

  const uniqueTags = [...new Set(posts.flatMap((p) => p.tags || []))];

  // Realtime: Socket.io
  useEffect(() => {
    const socket = io("http://localhost:5000", {
      transports: ["websocket", "polling"],
    });

    socket.on("connect", () => {
      console.log("Socket connected:", socket.id);
    });

    socket.on("postCreated", (data) => {
      console.log("Realtime: New post created", data);
      fetchPosts();
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected");
    });

    return () => {
      socket.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="home-page">
      {/* Header */}
      <div className="home-header">
        <div>
          <h2>Campus feed</h2>
          <p>
            Explore what&apos;s happening around your campus in real-time – events,
            study groups, announcements and more.
          </p>
        </div>
        <div className="home-stats-chip">
          <span className="dot-live" />
          {loading ? "Syncing..." : `${posts.length} active posts`}
        </div>
      </div>

      {/* Filter bar */}
      <FilterBar
        type={type}
        setType={setType}
        search={search}
        setSearch={setSearch}
      />

      {/* Tags row */}
      {uniqueTags.length > 0 && (
        <div className="tags-row">
          <button
            type="button"
            onClick={() => setSelectedTag("")}
            className={
              selectedTag === ""
                ? "tag-pill tag-pill-active"
                : "tag-pill"
            }
          >
            All tags
          </button>
          {uniqueTags.map((tag) => (
            <button
              type="button"
              key={tag}
              onClick={() =>
                setSelectedTag(tag === selectedTag ? "" : tag)
              }
              className={
                tag === selectedTag
                  ? "tag-pill tag-pill-active"
                  : "tag-pill"
              }
            >
              #{tag}
            </button>
          ))}
        </div>
      )}

      {/* List / states */}
      {loading ? (
        <div className="home-loading">
          <div className="loading-pulse" />
          <span>Loading posts...</span>
        </div>
      ) : posts.length === 0 ? (
        <div className="home-empty">
          <div className="empty-icon">📭</div>
          <h3>No posts found</h3>
          <p>
            Try changing filters or be the first one to share something
            happening on campus.
          </p>
        </div>
      ) : (
        <div className="posts-list">
          {posts.map((post) => (
            <PostCard key={post._id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
