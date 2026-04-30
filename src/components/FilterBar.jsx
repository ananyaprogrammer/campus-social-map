import React from "react";
import "./FilterBar.css";

export default function FilterBar({ type, setType, search, setSearch }) {
  return (
    <div className="filter-container">

      <div className="filter-select-wrapper">
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="filter-select"
        >
          <option value="">All Types</option>
          <option value="EVENT">Events</option>
          <option value="STUDY_GROUP">Study Groups</option>
          <option value="LOST_FOUND">Lost &amp; Found</option>
        </select>
      </div>

      <div className="filter-input-wrapper">
        <input
          type="text"
          placeholder="Search posts..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="filter-input"
        />
      </div>
    </div>
  );
}
